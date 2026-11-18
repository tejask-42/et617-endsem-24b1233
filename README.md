# TimeBridge English — Adaptive ESL Tense Tutor (`24b1233`)

- **Live Application URL:** https://et617-24b1233.netlify.app
- **GitHub Repository:** https://github.com/tejask-42/et617-endsem-24b1233

## Exam Card

| Field | Value |
| :--- | :--- |
| **Roll Number (`ID`)** | `24b1233` |
| **Problem Statement (`P`)** | **P4** — Adaptive tutor with automatic question generation |
| **Topic (`T`)** | **P4-T7** — English tenses: simple past vs present perfect (ESL) |
| **Learner Context (`L`)** | **L1** — Class 6–8 student in a rural government school, regional-language medium, uses a parent's Android phone for about 30 minutes in the evening |
| **Design Constraint (`C`)** | **C4** — 10-minute sessions (one complete learning sequence fits in 10 minutes; stop and resume where they left off) |

## Learner Persona & Learning Outcomes
- **Persona:** Aarav Patil (13, Class 8 rural government school student, regional-language medium) learning conversational English on his father's Android phone in short evening windows.
- **Outcomes:**
  1. **Classify** whether an everyday sentence refers to a finished past time window (Simple Past) or connects to a present result right now (Present Perfect).
  2. **Construct** accurate Simple Past (`V2`) and Present Perfect (`have/has + V3`) verb phrases across everyday contexts.
  3. **Explain** in one sentence why a given context requires Simple Past or Present Perfect.

## Key Adaptive & Pedagogical Features
1. **Three Question Formats + Dynamic Everyday Question Generator:**
   - Format 1: Everyday Context Multiple Choice
   - Format 2: Two-Step Time Frame & Verb Phrase Builder
   - Format 3: Spot & Explain the Error (1-sentence open explanation evaluated for verb accuracy and time-frame reasoning)
2. **Two-Step Error Self-Identification (`Rubric P2`):**
   - When the learner makes an error, Step 1 prompts them to self-identify whether the time clue describes a *finished past time* or *connects to right now*, followed by Step 2 showing a side-by-side timeline comparison and queuing the item for later retry.
3. **3-Step Progressive Hint Ladder & 3-Way Adaptive Decision Rule (`P4 Design Challenge`):**
   - **First-Try Correct (0 hints):** Advances the learner to a harder question / next difficulty level.
   - **Solved with Hints 1–2 (or after an error):** Queues the question into the **Retry Later** list so the learner can prove independent mastery later.
   - **3 Consecutive Hint-3 Reveals (answer revealed, not solved independently):** Automatically opens the **Basic Concepts Recap**, decreases the learner's difficulty level by 1, and activates **Confidence Rebuild Mode** (requiring 2 consecutive unassisted correct answers before advancing to the next level).
4. **Interactive Topic-Specific Problem-Solving Tool (`Rubric T6`):**
   - Built-in **Time-Bridge & Verb Explorer** lets the learner test any person, everyday verb, and time switch (`Finished Past Time` vs `Connected to Right Now`).
5. **Pressure-Free Stop & Resume (`Constraint C4`) + Dark Mode:**
   - Automatic `localStorage` persistence with a **Pick Up Where You Left Off** vs **Quit & Start New Lesson** banner on the Home screen, plus Light/Dark mode toggle.

## How to Run Locally
Open `index.html` with any static file server (e.g., `npx serve .` or VS Code Live Server). Zero build step or external dependencies required.
