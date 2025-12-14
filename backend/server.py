"""
FastAPI Backend for CodeEX
Serves both the auto-grader API and any additional endpoints needed by the frontend.
"""

import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from datetime import datetime

# Get MongoDB URL from environment
MONGO_URL = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')

# Initialize FastAPI app
app = FastAPI(
    title="CodeEX API",
    description="Backend API for CodeEX Educational Platform",
    version="3.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB client (optional - for future use)
try:
    mongo_client = MongoClient(MONGO_URL)
    db = mongo_client['codex']
    print(f"✅ Connected to MongoDB at {MONGO_URL}")
except Exception as e:
    print(f"⚠️  MongoDB connection failed: {e}")
    db = None


@app.get("/")
async def root():
    """Root endpoint - API health check"""
    return {
        "service": "CodeEX API",
        "version": "3.0.0",
        "status": "operational",
        "timestamp": datetime.utcnow().isoformat()
    }


@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "mongodb": "connected" if db is not None else "disconnected",
        "timestamp": datetime.utcnow().isoformat()
    }


@app.get("/api/status")
async def status():
    """Get system status"""
    return {
        "status": "online",
        "services": {
            "api": "operational",
            "database": "connected" if db is not None else "disconnected",
            "grader": "ready"
        },
        "timestamp": datetime.utcnow().isoformat()
    }


# Import and include grader routes (if they exist)
try:
    import sys
    sys.path.insert(0, '/app')
    from api.main import app as grader_app
    
    # Mount grader routes under /api/grader
    app.mount("/api/grader", grader_app)
    print("✅ Grader API mounted at /api/grader")
except Exception as e:
    print(f"⚠️  Grader API not available: {e}")


if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get('PORT', 8001))
    uvicorn.run(
        "server:app",
        host="0.0.0.0",
        port=port,
        reload=True,
        log_level="info"
    )
