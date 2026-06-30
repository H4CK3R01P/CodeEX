# 🚀 ULTIMATE FULL-STACK PROMPT: CodeEX Student Section & AI Brain

**Instructions for the AI Coder:**
You are acting as a **Principal Full-Stack Engineer** building the "Student Section" of the CodeEX platform from scratch. This is a production-ready system consisting of a **React Frontend**, a **FastAPI/Python Backend**, a **Dockerized Execution Sandbox**, and the **CodeEX Brain** (a strict, 9-agent AI orchestration system).

You must build this end-to-end. Read every architectural constraint and API contract carefully.

---

## 🏗️ 1. Complete System Architecture

The system is divided into 4 core layers:
1.  **Frontend (React/TypeScript):** The Student IDE, Dashboard, and AI Chat UI.
2.  **API Gateway (FastAPI):** Handles Auth, state synchronization, and routes requests.
3.  **Sandbox Engine (Grader):** Executes untrusted user code in isolated Docker containers to determine `AC` (Accepted), `WA` (Wrong Answer), or `TLE` (Time Limit Exceeded). **AI MUST NEVER ALTER GRADER VERDICTS.**
4.  **CodeEX Brain (AI Orchestrator):** The intelligence layer managing 9 specialized agents. It intercepts all AI requests, checks permissions, prompts the LLM, validates the output, and returns it to the user.

---

## 💾 2. Database Schema & Data Models

Implement these models (e.g., in SQLAlchemy/Prisma and TypeScript interfaces):

```typescript
// USER & STATE
User { id: UUID, name: String, coins: Int, streak: Int }
Problem { id: UUID, title: String, description: Markdown, testCases: JSON }
Session { userId: UUID, problemId: UUID, failedAttempts: Int, isSolved: Boolean }

// AI CONTEXT
enum AgentRole { PLANNER, TEACHER, HINT, CODING, DEBUGGING, REFACTOR, INSPECTOR, RESEARCH, MEMORY }
AIContext { userId: UUID, currentHintLevel: Int, chatHistory: Array<Message> }

// API CONTRACT
OrchestrationRequest {
  request_type: "HINT" | "TEACHING" | "DEBUG" | "SOLUTION" | "PLANNING";
  agent: AgentRole;
  problem_context: { user_code: String, error_trace?: String, hint_level?: Int };
  user_context: { attempt_count: Int };
}

OrchestrationResponse {
  status: "SUCCESS" | "FAILED_PERMISSION" | "FAILED_VERIFICATION" | "FAILED_API";
  output: String; // The verified AI response
  rejection_reason?: String;
}
```

---

## 🧠 3. The Backend "CodeEX Brain" (AI Orchestration)

You must build `backend/ai/orchestrator.py` and `backend/ai/agents/permission_enforcer.py`. The backend is the source of truth for security. 

### 3.1 The 6-Step Orchestration Pipeline
Every request to `/api/ai/orchestrate` must go through this exact pipeline in the backend:
1.  **Load Config:** Fetch domain rules (e.g., DSA vs Web Dev).
2.  **Check Permissions (`PermissionEnforcer`):** Verify if the requested `AgentRole` is allowed to perform the action. (e.g., If user requests `CODING` but `attempt_count < 3`, instantly return `FAILED_PERMISSION`).
3.  **Call LLM:** Send the specialized system prompt for that specific agent.
4.  **Validate Output (`RoleValidator`):** Parse the LLM's response. **Crucial:** If the `HINT` agent accidentally included code blocks in its response, the validator must catch it and return `FAILED_VERIFICATION`.
5.  **Save to Database:** Log the request/response for the `MEMORY_AGENT`.
6.  **Return Safe Response:** Send to frontend.

### 3.2 The 9 Agents & Backend System Prompts
The backend must construct specific system prompts for these 9 agents:

1.  **PLANNER_AGENT:** Instructed to break problems into sub-tasks. Output must be formatted as a Markdown checklist.
2.  **TEACHER_AGENT:** Instructed to explain concepts using analogies and generic examples.
3.  **HINT_AGENT (Heavily Restricted):** Instructed to provide exactly one hint based on `hint_level` (1=Category, 2=Approach, 3=Logic). *System Prompt must explicitly forbid code generation.*
4.  **CODING_AGENT:** Allowed to generate code, but backend routes here *only* if `attempt_count >= 3`.
5.  **DEBUGGING_AGENT:** Requires `error_trace` and `user_code`. Instructed to pinpoint the line causing the error and explain why.
6.  **REFACTOR_AGENT:** Requires `user_code` and a verified `AC` status from the grader. Instructed to return optimized code.
7.  **PROJECT_INSPECTOR_AGENT:** Instructed to find Big-O inefficiencies and bad variable naming.
8.  **RESEARCH_AGENT:** Returns documentation links.
9.  **MEMORY_AGENT:** A background data-retrieval agent that injects past user mistakes into the current system prompt so the AI remembers context.

---

## ⚙️ 4. The Grader API (Sandbox Execution)

Endpoint: `POST /api/sandbox/submit`
*   **Input:** `problemId`, `sourceCode`, `language`.
*   **Backend Logic:** Spin up a secure Docker container, inject code and hidden test cases, measure time/memory, and return the verdict.
*   **Output:** `{ status: "WA", stdout: "...", stderr: "Index out of bounds at line 4", executionTime: 120ms }`.

---

## 🖥️ 5. Frontend UI Implementation (React)

Build the UI to consume these APIs. Do not use prop-drilling; use React Context for `IDEState` and `AIState`.

### 5.1 The Dashboard Shell
*   **Top Bar:** Flame Icon (Streak), Coin Icon (Currency), Notification Bell, User Avatar.
*   **12 Navigation Tabs:** Dashboard, Daily, Collaborate, Learn, Problems, Practice, Compete, Tests, Achieve, Social, Analytics, Coins.
*   **Problems Datatable:** Searchable list of problems. Clicking one opens the Practice IDE.

### 5.2 The Practice IDE (3-Pane Layout)
*   **Left Pane (Problem View):** Markdown problem description. Highlighting text here renders a floating "Explain" button, which calls `/api/ai/orchestrate` with the `TEACHER_AGENT`.
*   **Center Pane (Monaco Editor & Console):**
    *   Code editor on top.
    *   Console on bottom with "Run Code" and "Submit" buttons.
    *   **Logic:** Clicking "Submit" calls `/api/sandbox/submit`. If response is `WA/TLE`, increment `failedAttempts` locally and sync to backend.
*   **Right Pane (AI Brain Sidebar):**
    *   Top 70%: Chat interface rendering Markdown.
    *   Bottom 30%: The Agent Action Grid.

### 5.3 The Agent Action Grid (Frontend Logic)
Build exactly 6 buttons in a 2x3 grid. They trigger frontend logic that calls the Orchestrator API:

1.  **"📋 Plan Approach" Button:** Calls Orchestrator. Renders response as interactive checkboxes in chat.
2.  **"💡 Get Hint" Button:** Checks local `hintLevel`. Calls Orchestrator. Renders color-coded hint cards (Blue/Yellow/Red).
3.  **"💻 Show Solution" Button:**
    *   *Frontend Guardrail:* Checks if `failedAttempts >= 3`.
    *   If false, block click and show toast: "Attempt 3 times first".
    *   If true, show warning modal ("Reduces points"), then call Orchestrator.
4.  **"🐞 Debug Code" Button:** Dynamically appears in the Center Console next to a failed test case. Sends `stderr` to Orchestrator.
5.  **"👨‍🏫 Explain Concept" Button:** Triggers via text highlight in the Left Pane.
6.  **"♻️ Refactor Code" Button:** Unlocks only when Center Console receives an `AC` verdict. Opens a side-by-side Code Diff Modal.

---

## ✅ 6. Execution Instructions for the AI
1.  **Backend First:** Define the Pydantic models for the API contracts and the SQLAlchemy/Prisma schemas.
2.  **Orchestrator Core:** Build the `CodeEXOrchestrator` class with the permission checks and validation loops.
3.  **Frontend State:** Build the Zustand/Context stores to manage `attemptCount` and `hintLevel`.
4.  **UI Construction:** Build the 3-pane layout, wire the buttons in the Agent Action Grid to the Axios API calls, and build the `switch(response.status)` logic to handle `FAILED_PERMISSION` gracefully in the UI.
