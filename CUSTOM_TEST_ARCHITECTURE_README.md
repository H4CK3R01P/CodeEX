# 📝 CodeEX Custom Test Engine: Architecture & Flow

This document details the architecture, UI/UX flow, algorithms, and AI Agent integrations for the **Custom Test Engine** in the CodeEX platform. 

The Custom Test feature allows students to generate highly personalized, domain-specific mock exams (e.g., a 3-hour JEE Full Mock, a 45-minute FAANG System Design interview, or a 50-question UPSC Polity quiz) to assess their readiness dynamically.

---

## 📍 1. Where It Lives & How to Access It
*   **Location:** Resides under the **"Tests"** tab on the main Student Dashboard navigation bar.
*   **Sub-section:** Inside the Tests page, alongside "Official/Scheduled Exams", there is a prominent widget titled **"Create Custom Test"**.
*   **Entry Point:** Clicking this widget opens the *Custom Test Configurator Modal*.

---

## 🎛️ 2. The Creation UI (What is there)
When the student initiates a custom test, they must define the parameters. The UI provides a step-by-step configurator:

1.  **Syllabus Selection:** A multi-select tree view based on their Domain. 
    *   *Example (Tech):* Trees, Dynamic Programming, System Design.
    *   *Example (JEE):* Rotational Mechanics, Organic Chemistry, Integral Calculus.
2.  **Format Selection:** 
    *   Code Execution (Algorithms)
    *   Multiple Choice Questions (MCQs)
    *   Subjective / Theory (Short answers)
3.  **Difficulty Tuning:** A slider from *Beginner* to *Master*.
4.  **Time Constraint:** Dropdown for 15m, 30m, 1hr, 3hr.
5.  **Mode Selection:** 
    *   **Strict Mode:** Proctored, no tabs switching, ZERO AI assistance.
    *   **Practice Mode:** Relaxed environment, hints allowed (but tracked).

---

## ⚙️ 3. The Test Generation Algorithm
Once parameters are submitted, the backend generates the test paper.

**The Balancing Algorithm:**
1.  **Query the Question Bank:** Fetch all questions matching the selected tags/domain.
2.  **Weight Distribution:** If the user selected 3 topics (A, B, C) for a 30-question test, the algorithm attempts a 10-10-10 split.
3.  **Adaptive Difficulty Curve:** The algorithm doesn't just pick random difficulties. It creates a curve: 
    *   20% Easy (Warm-up)
    *   60% Medium (Core testing)
    *   20% Hard (Stress testing)
4.  **Freshness Check:** Cross-references the user's `SessionHistory` to ensure at least 80% of the selected questions have *never been seen* by the student before, preventing memorization bias.

---

## 🖥️ 4. The Test-Taking Interface (The Arena)

Once generated, the student enters a full-screen, locked UI.

### UI Layout
*   **Top Bar:** A sticky header containing the countdown timer, the "Submit Test" button, and a live "Warnings" counter (if in strict proctored mode).
*   **Right Sidebar (Question Palette):** A grid of question numbers.
    *   *Green:* Answered
    *   *Red:* Unanswered
    *   *Purple:* Marked for Review
*   **Main Center Pane:** 
    *   *For Coding:* Split view with Problem Description on top, Monaco Editor below.
    *   *For MCQs:* Clean, distraction-free typography with radio buttons and a digital rough-pad.

---

## 🤖 5. AI Agent Integration (Where & How They Are Used)

The CodeEX Brain heavily integrates into the Custom Test lifecycle, specifically adapting to whether the student chose **Strict Mode** or **Practice Mode**.

### A. Pre-Test Phase
*   **The Scheduler/Planner Agent:**
    *   *Usage:* Before creating the test, the UI prompts: *"Not sure what to test?"* The Planner Agent analyzes the user's recent Analytics Radar Chart and auto-fills the configurator to target their weakest chapters.

### B. During the Test (Practice Mode ONLY)
*If the test is in "Strict Mode", the AI is forcibly disabled by the backend `PermissionEnforcer`.*
*   **The Hint Agent:**
    *   *Usage:* Students can request a hint on a tough question.
    *   *Algorithm:* The backend intercepts this, serves the hint, but permanently deducts 20% of the potential points for that specific question to penalize reliance.
*   **The Visualizer Agent:**
    *   *Usage:* Can be summoned to generate a 3D diagram of a physics problem or a flow chart of a system architecture to help the student understand the question better.

### C. Post-Test Phase (The Most Critical Integration)
Once the test is submitted, the AI goes to work on the results page.

*   **The Evaluator Agent:**
    *   *Usage:* For any "Subjective/Theory" questions (e.g., "Explain how the Event Loop works"), traditional grading fails. This agent reads the student's text, compares it to the ideal rubric, and assigns a score out of 10 with feedback.
*   **The Debugging / Teacher Agent (The Autopsy):**
    *   *Usage:* On the results dashboard, next to every *incorrect* answer, a "Why did I get this wrong?" button appears.
    *   *Algorithm:* The Debugging Agent looks at the student's submitted code (or selected MCQ option) and the correct answer. It generates a personalized explanation: *"You selected Option B because you forgot to account for friction. Here is the correct free-body diagram..."*
*   **The Memory & Scheduler Agents:**
    *   *Usage:* The Memory Agent logs exactly which topics the student failed. It immediately pings the Scheduler Agent to automatically add revision blocks for those failed topics into the student's calendar for the following week.

---

