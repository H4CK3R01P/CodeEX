""""FastAPI Application

Main application entry point for CodeEX Auto-Grader.
"""

from fastapi import FastAPI, BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from uuid import uuid4
import asyncio

from api.schemas import (
    SubmissionRequest,
    SubmissionResponse,
    VerdictResponse,
    FeedbackResponse,
    SubmissionStatus
)
from api.storage import storage
from runner import DockerExecutor, LocalExecutor
from grader import AutoGrader, VerdictEngine
from models import TestCase, Verdict
from config import settings
from api.routes import ai as ai_router

app = FastAPI(
    title="CodeEX Auto-Grader API",
    description="Production-grade competitive programming judge",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(ai_router.router)

# Initialize components
if settings.DOCKER_ENABLED:
    try:
        executor = DockerExecutor()
        print("✅ Using Docker executor")
    except:
        print("⚠️  Docker not available, falling back to LocalExecutor")
        executor = LocalExecutor()
else:
    executor = LocalExecutor()
    print("✅ Using Local executor")

auto_grader = AutoGrader(ai_enabled=settings.AI_FEEDBACK_ENABLED)
verdict_engine = VerdictEngine()


@app.get("/")
async def root():
    return {
        "service": "CodeEX Auto-Grader",
        "version": "1.0.0",
        "status": "operational",
        "executor": "docker" if settings.DOCKER_ENABLED else "local"
    }


@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat()
    }


@app.post("/api/v1/submissions", response_model=SubmissionResponse, status_code=202)
async def submit_code(
    request: SubmissionRequest,
    background_tasks: BackgroundTasks
):
    """
    Submit code for grading.
    Returns immediately with submission_id.
    """
    try:
        # Create submission
        submission_id = f"sub_{uuid4().hex}"
        submission_data = {
            "submission_id": submission_id,
            "problem_id": request.problem_id,
            "language": request.language,
            "source_code": request.source_code,
            "user_id": request.user_id or "anonymous",
            "status": "QUEUED",
            "created_at": datetime.utcnow(),
            "verdict_report": None,
            "feedback_report": None,
            "feedback_status": "PENDING"
        }
        
        await storage.insert_submission(submission_data)
        
        # Queue grading task
        background_tasks.add_task(grade_submission, submission_id)
        
        return SubmissionResponse(
            submission_id=submission_id,
            status=SubmissionStatus.QUEUED,
            message="Submission accepted. Use submission_id to check status.",
            submitted_at=submission_data["created_at"],
            estimated_completion_seconds=5
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/v1/submissions/{submission_id}/verdict", response_model=VerdictResponse)
async def get_verdict(submission_id: str):
    """
    Get grading verdict.
    Returns IMMUTABLE verdict from judge.
    """
    submission = await storage.get_submission(submission_id)
    
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")
    
    status = submission["status"]
    
    if status in ["QUEUED", "GRADING"]:
        return VerdictResponse(
            submission_id=submission_id,
            status=status,
            verdict=None,
            message="Grading in progress"
        )
    
    if status == "ERROR":
        return VerdictResponse(
            submission_id=submission_id,
            status="ERROR",
            error_message=submission.get("error_message"),
            verdict=None
        )
    
    # COMPLETED
    return VerdictResponse(
        submission_id=submission_id,
        status="COMPLETED",
        verdict=submission["verdict_report"],
        graded_at=submission.get("graded_at"),
        language=submission["language"],
        problem_id=submission["problem_id"]
    )


@app.get("/api/v1/submissions/{submission_id}/feedback", response_model=FeedbackResponse)
async def get_feedback(submission_id: str, include_ai: bool = True):
    """
    Get educational feedback.
    Separate from verdict to ensure failures don't break grading.
    """
    submission = await storage.get_submission(submission_id)
    
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")
    
    feedback_status = submission.get("feedback_status", "PENDING")
    
    if feedback_status == "PENDING":
        return FeedbackResponse(
            submission_id=submission_id,
            status="PENDING",
            verdict=None,
            feedback=None
        )
    
    if feedback_status == "FAILED":
        return FeedbackResponse(
            submission_id=submission_id,
            status="FAILED",
            verdict=submission.get("verdict_report", {}).get("final_verdict"),
            feedback=None
        )
    
    # COMPLETED
    feedback_data = submission["feedback_report"]
    
    if not include_ai and feedback_data:
        # Remove AI feedback if not requested
        feedback_data = {**feedback_data, "ai_feedback": None}
    
    return FeedbackResponse(
        submission_id=submission_id,
        status="COMPLETED",
        verdict=submission.get("verdict_report", {}).get("final_verdict"),
        feedback=feedback_data,
        version="v1",
        generated_at=submission.get("feedback_generated_at"),
        ai_enabled=feedback_data.get("ai_feedback") is not None if feedback_data else False
    )


async def grade_submission(submission_id: str):
    """
    Background task: Grade submission.
    """
    try:
        await storage.update_field(submission_id, "status", "GRADING")
        
        submission = await storage.get_submission(submission_id)
        
        # Load test cases (demo: create dummy testcase)
        testcase = TestCase(
            testcase_id="test_1",
            problem_id=submission["problem_id"],
            input_data="",
            expected_output="Hello, World!",
            time_limit_ms=2000,
            memory_limit_kb=262144
        )
        
        # Execute
        result = await asyncio.to_thread(
            executor.run_testcase,
            language=submission["language"],
            source_code=submission["source_code"],
            testcase=testcase,
            testcase_id="test_1"
        )
        
        # Build verdict report
        verdict_report = verdict_engine.aggregate(
            submission_id=submission_id,
            problem_id=submission["problem_id"],
            testcase_results=[result],
            language=submission["language"],
            grading_start_time=submission["created_at"]
        )
        
        # Store verdict
        await storage.update_submission(submission_id, {
            "status": "COMPLETED",
            "verdict_report": verdict_report.model_dump(),
            "graded_at": datetime.utcnow()
        })
        
        # Trigger feedback generation
        if settings.FEEDBACK_ENABLED:
            asyncio.create_task(generate_feedback(submission_id, verdict_report))
        
    except Exception as e:
        await storage.update_submission(submission_id, {
            "status": "ERROR",
            "error_message": str(e),
            "graded_at": datetime.utcnow()
        })


async def generate_feedback(submission_id: str, verdict_report):
    """
    Background task: Generate feedback.
    """
    try:
        await storage.update_field(submission_id, "feedback_status", "PENDING")
        
        # Generate feedback
        enhanced_report = await asyncio.to_thread(
            auto_grader.generate_feedback,
            verdict_report
        )
        
        # Store feedback
        feedback_data = {
            "classification": {
                "category": enhanced_report.classification.category,
                "subcategory": enhanced_report.classification.subcategory,
                "confidence": enhanced_report.classification.confidence
            },
            "base_feedback": {
                "title": enhanced_report.base_feedback.title,
                "summary": enhanced_report.base_feedback.summary,
                "details": enhanced_report.base_feedback.details,
                "suggestions": enhanced_report.base_feedback.suggestions
            },
            "signals": enhanced_report.signals,
            "ai_feedback": enhanced_report.ai_feedback
        }
        
        await storage.update_submission(submission_id, {
            "feedback_status": "COMPLETED",
            "feedback_report": feedback_data,
            "feedback_generated_at": datetime.utcnow()
        })
        
    except Exception as e:
        await storage.update_submission(submission_id, {
            "feedback_status": "FAILED",
            "feedback_error": str(e)
        })


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host=settings.HOST, port=settings.PORT)
