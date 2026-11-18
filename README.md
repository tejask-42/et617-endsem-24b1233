# TimeBridge English — Adaptive ESL Tense Tutor

- **Live Application:** https://et617-24b1233.netlify.app
- **Repository:** https://github.com/tejask-42/et617-endsem-24b1233
- **Student Roll Number:** `24b1233`

## About the Project
**TimeBridge English** is an adaptive English learning web application built for Class 6–8 students in regional-language medium schools who practice English on a parent's shared smartphone in short evening sessions. It teaches the difference between **Simple Past** (actions completed in a finished past time, such as *yesterday* or *last Sunday*) and **Present Perfect** (past actions connected to what is true right now, such as *has lost the key* or *has already eaten*).

## Key Features
- **Conversational Concept Introduction & Starting Warm-Up:** Introduces time windows using plain, active language and a 2-question warm-up that sets the learner's starting difficulty level.
- **Three Question Formats:**
  1. **Multiple Choice** across everyday contexts (weekly market, rain puddles, bicycle repair).
  2. **Time & Verb Builder** where learners classify the time window first and then construct the verb phrase.
  3. **Spot & Explain the Error** where learners type the corrected verb and explain in one sentence why the time clue requires Simple Past or Present Perfect.
- **Two-Step Error Self-Identification:** When a learner makes an error, they are first asked to spot whether the sentence talks about a finished past time or something connected to right now, followed by a side-by-side explanation.
- **3-Step Progressive Hint Ladder & Retry Later Queue:** Learners can take up to 3 progressive hints (Time Clue → Verb Rule Clue → Full Answer Reveal). Any question needing hints is saved to the **Retry Later** list so the learner can solve it independently later.
- **Automatic Basic Concepts Recap & Confidence Rebuild:** If 3 questions in a row require all 3 hints (revealing the answer), the tutor automatically opens a foundational **Basic Recap**, lowers the difficulty level by one tier, and waits for **2 consecutive unassisted correct answers** before moving up again.
- **Interactive Time-Bridge & Verb Explorer:** A built-in tool on the practice screen that lets learners test different subjects, everyday verbs, and time frames live.
- **Stop & Resume Anytime + Dark Mode:** Saves progress in browser `localStorage` so learners can pause when a parent needs the phone and pick up right where they left off, with full Light and Dark theme support.

## Running Locally
Serve the root folder with any static web server (for example `npx serve .`) and open `http://localhost:3000`.
