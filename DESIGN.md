# DESIGN.md — ET 617 End-Semester Examination

## 0. Exam Card & Identity

| Field | Selection |
| :--- | :--- |
| **Roll No. / Identity Token (`ID`)** | `24b1233` |
| **Problem Statement (`P`)** | **P4** — Adaptive tutor with automatic question generation |
| **Topic (`T`)** | **P4-T7** — English tenses: simple past vs present perfect (ESL) |
| **Learner Context (`L`)** | **L1** — Class 6–8 student in a rural government school, regional-language medium, uses a parent's Android phone for about 30 minutes in the evening |
| **Design Constraint (`C`)** | **C4** — 10-minute sessions (One complete learning sequence fits in 10 minutes; the learner can stop and resume where they left off) |
| **GitHub Repository** | `https://github.com/tejask-42/et617-endsem-24b1233` |
| **Target Deployment URL** | `https://et617-24b1233.netlify.app` |

---

## 1. Educational Problem & Learning Outcomes (Deliverable D1)

### Educational Problem (4 Sentences)
Class 6–8 students in rural regional-language medium government schools (L1) often learn English only through rote textbook drills and struggle to distinguish between the **Simple Past** (*"I watched that film yesterday"*) and the **Present Perfect** (*"I have already watched that film, so I know the ending"*). Because their home language often maps both meanings onto a single past-completive construction, learners frequently mix finished past time markers with `have/has + V3` or use simple past `V2` when describing an action whose result still holds in the present. When practicing independently on a parent's shared Android phone in the evening, static worksheets fail to diagnose *why* a learner chose the wrong tense or adapt to how many hints they needed. This application solves that gap with a mobile-first, 10-minute stop-and-resume adaptive tutor (C4) that diagnoses specific tense misconceptions, scaffolds learners with a 3-step progressive hint ladder, and dynamically routes them between harder tasks, alternative visual timeline explanations with a retry-later queue, or a foundational prerequisite recap with level step-down.

### Three Measurable Learning Outcomes (Bloom's Taxonomy)
1. **Outcome 1 — Classify Time Windows (Understand):** Given an everyday or movie-dialogue sentence context, the learner will **classify** whether the action occurs in a **closed past time window** (requiring Simple Past) or forms a **bridge connected to the present moment/result** (requiring Present Perfect) with at least 80% accuracy.
2. **Outcome 2 — Construct Accurate Verb Phrases (Apply):** Given a subject, a base verb (`V1`), and a situational context, the learner will **construct** the grammatically accurate verb phrase (`V2` vs `has/have + V3`) without subject-auxiliary agreement or participle form errors across at least 4 of 5 adaptive tasks.
3. **Outcome 3 — Explain & Diagnose Tense Choice (Analyze / Evaluate):** Given a sentence containing a common ESL tense error or a contrast pair, the learner will **explain** in their own words *why* Simple Past or Present Perfect is required by referencing whether the time period is finished or the outcome still affects "now".

### Context of Use
- **Where & When:** At home in a rural town/village between 7:30 PM and 8:00 PM after dinner.
- **Device & Session Constraint (C4):** Accessed on the learner's father's budget Android smartphone (360 px portrait screen, patchy evening mobile data). Because his father may need the phone at any moment for a call or message, each complete learning sequence is paced for **10 minutes** with automatic local state saving (`localStorage`) and a one-tap **Stop & Resume** bar so zero progress is lost.

---

## 2. Learner Persona (Deliverable D2 — Expanded from Seed L1)

- **Name & Age:** **Aarav Patil**, 13 years old (Class 8 student at a rural government school, regional-language Marathi medium).
- **Language & Background:** Speaks Marathi at home and in school classrooms. He is trying to learn practical, conversational English for the first time on his own outside of rote school exams.
- **Motivation Driver:** Aarav is fascinated by the English language after watching English action and adventure movies on TV. He wants to understand movie dialogues without waiting for dubbed versions and speak natural English sentences, rather than memorizing grammar definitions for school marks.
- **Device & Time Window:** Uses his father's Android smartphone for about 20–30 minutes in the evening. He needs bite-sized **10-minute sessions (C4)** that remember his exact question, hint state, and retry queue if interrupted.
- **Prior Knowledge of Prerequisites:**
  - Recognizes basic pronouns (*I, you, we, they, he, she, it*) and familiar everyday verbs (*watch, finish, lose, arrive, see, eat, go*).
  - Has seen past verbs (`watched`, `went`) and the words `have`/`has` in movie subtitles, but does not yet have stable control over when to use `V2` vs `has/have + V3`, or the difference between `V2` (*went/saw*) and `V3` (*gone/seen*).
- **Two Likely Misconceptions (Target of D2, D3, D5, and Rubric P2):**
  1. **Misconception M1 — "Present Perfect with a Closed Past Time Marker":**
     - *What Aarav thinks:* He believes adding `have/has` before a past verb just makes the sentence sound "more complete or formal English," so he pairs `have/has + V3` with finished past time words like *yesterday*, *last night*, or *two hours ago* (e.g., *"I have watched that superhero movie last night"* instead of *"I watched..."*).
  2. **Misconception M2 — "Simple Past for Present Result / Unfinished Bridge to Now":**
     - *What Aarav thinks:* Whenever an action happened before the current second, he defaults to Simple Past (`V2`), ignoring that the sentence emphasizes a **present result right now** or uses unfinished/experiential markers like *already*, *yet*, *just*, or *never* (e.g., *"Don't tell me the ending! I didn't watch the final scene yet"* or *"Look, the hero lost his shield, so he has no cover now"* where `"has not watched yet"` / `"has lost"` connects the action directly to the present moment).

---

## 3. Pedagogical Theories & Design Principles

| Course Theory | What It Predicts for Aarav (L1) | Concrete App Feature |
| :--- | :--- | :--- |
| **Zone of Proximal Development (ZPD) & Scaffolding** | A first-time self-motivated ESL learner will quit if marked wrong bluntly, but can solve tasks when given graduated cues. | **3-Step Progressive Hint Ladder** (Hint 1: Time-window clue → Hint 2: Tense structure clue → Hint 3: Full answer reveal + retry-later queueing). |
| **Cognitive Load Theory (CLT)** | Long grammar terminology overloads working memory on a 360 px shared phone. | **Conversational active voice** (`"Let us check..."`), visual **"Closed Box vs Bridge to Now"** diagram, one task per screen, and a 10-minute session cap (C4). |
| **Atkinson-Shiffrin Memory Model (Encoding & Retrieval Practice)** | Items solved only after Hint 3 reveals the answer are held in short-term working memory (~20s), not encoded into long-term memory. | **Retry-Later Queue & 2-Correct Stabilization Gate**: Any question needing hints is queued for delayed retrieval practice before mastery is credited. |
| **Conceptual Change / Alternate Conceptions (Rubric P2)** | Telling a learner "wrong" does not replace M1 or M2; they must see why their choice clashes with the timeline. | **Contrastive Timeline Feedback Card** that shows what Aarav's chosen tense actually implies vs the target timeline, followed by a 1-tap self-identification check. |

### Design Principles (Course Format)
1. **We will** visually frame every task using a **"Closed Past Box (Yesterday)" vs "Bridge to NOW"** timeline tool **because** Aarav (L1) learns English from movie scenes and visual action rather than abstract grammar terminology (*Multimedia Learning & Rubric T6*).
2. **We will** provide a **3-step progressive hint ladder** where Hints 1–2 queue the item for later retry and 3 consecutive Hint-3 reveals trigger a foundational recap + level step-down **because** scaffolding within the learner's Zone of Proximal Development prevents frustration while ensuring long-term retrieval (*ZPD & Atkinson-Shiffrin Memory Model*).
3. **We will** require **2 consecutive unassisted correct answers** after a level step-down before advancing back to a higher difficulty tier **because** mastery stabilization prevents premature promotion after lucky guesses (*Mastery Learning & P4 Design Challenge*).
4. **We will** structure practice into **10-minute stop-and-resume micro-sessions** with instant `localStorage` persistence **because** Aarav uses his father's phone for short evening windows and must be able to pause and resume seamlessly (*Constraint C4 & Error Prevention*).
5. **We will** diagnose **M1 (finished time + `have V3`)** and **M2 (present result + `V2`)** separately across 3 question formats (MCQ, Interactive Time-Tag + Verb Builder, and Open Dialogue Explanation) **because** learners must confront and resolve their specific alternate conception (*Rubric P2 & P4 Specification*).

---

## 4. Educational Content Plan & Question Formats (Deliverable D3)

### 4.1 Concept Explanation & Topic-Specific Tool (Rubric P5 & T6)
- **Conversational Briefing ("The Two Movie Frames"):** Written in conversational active voice (`"Let us look at how English movies talk about time..."`) with visual callout boxes (`First`, `Second`, `Third`).
- **Interactive Topic-Specific Tool (`T6` — "Time-Bridge & Verb Studio"):**
  - Always accessible during practice.
  - Lets Aarav pick a **Subject** (`I / You / We / They` vs `He / She / The Hero`), pick an everyday/movie **Verb** (`watch`, `finish`, `lose`, `arrive`, `see`, `go`), and toggle the **Time Switch** between:
    - `[Frame 1: Closed Past Time (yesterday / in 2022 / last night)]` → highlights `V2` (e.g., *watched / went / saw*) and warns: *"Door to NOW is closed! Do not use have/has here (avoids M1)."*
    - `[Frame 2: Bridge to NOW (already / yet / result still true now)]` → highlights `have/has + V3` (e.g., *has watched / has gone / have seen*) and shows the bridge touching `[NOW]`.

### 4.2 Three Question Formats (7 Curated Core Items + Dynamic Adaptive Generator)
To satisfy **P4** (at least 3 formats + explanation evaluation + automatic generation) and **D3** (at least 5 tasks with model answers and specific feedback for Correct, M1, and M2):

| Task ID | Level | Format | Scenario / Prompt (Movie & Everyday ESL Context) | Target Tense & Model Answer | M1 Trap & Feedback | M2 Trap & Feedback |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **DIAG-1** | Diagnostic (Profile) | **Format 1: Context MCQ** | *"Yesterday evening, Aarav and his father ___ an action movie on TV."* (`watched` vs `have watched` vs `has watched`) | **Simple Past:** `watched` (*"Yesterday evening" is a finished time box.*) | `have watched` → Diagnoses **M1** (*"Yesterday evening is finished; do not pair have+V3 with a closed past time."*) | — |
| **DIAG-2** | Diagnostic (Profile) | **Format 1: Context MCQ** | *"Look at the TV screen! The power ___ out, so the room is completely dark right now."* (`has gone` vs `went` vs `have went`) | **Present Perfect:** `has gone` (*The room is still dark right now — bridge to NOW.*) | — | `went` → Diagnoses **M2** (*"Because the room is dark right now, we use 'has gone' to connect the action to the present result."*) |
| **T1** | Level 1 (Guided) | **Format 1: Context MCQ** | *"We ___ the new sci-fi trailer two hours ago."* (`saw` vs `have seen` vs `has seen`) | **Simple Past:** `saw` (*"Two hours ago" is a closed past window.*) | `have seen` → **M1** (*"Two hours ago is over. Keep 'have seen' for experiences without a closed timestamp."*) | — |
| **T2** | Level 1 (Guided) | **Format 2: Time-Tag + Verb Builder** | Tag time window (`Closed Past` vs `Bridge to NOW`) + build verb: *"Don't change the channel! The hero ___ (not / finish) the rescue mission yet."* | **Bridge to NOW** + `has not finished` (*"Yet" connects up to the present moment.*) | — | Tagging `Closed Past` or `did not finish` → **M2** (*"The mission is still happening now ('yet'). Use 'has not finished'."*) |
| **T3** | Level 2 (Core) | **Format 2: Time-Tag + Verb Builder** | Tag time window + build verb: *"In the 2019 film, the team ___ (travel) back in time to save the city."* | **Closed Past** + `traveled` (*"In the 2019 film" is a finished past context.*) | Tagging `Bridge to NOW` or `have traveled` → **M1** (*"2019 / that specific past scene is closed; use Simple Past 'traveled'."*) | — |
| **T4** | Level 2 (Core) | **Format 3: Open Explanation & Error-Spotter** | Spot & explain the error in this subtitle: *"I have lost my bus ticket yesterday, so I walked home."* Write the corrected verb and 1 sentence explaining *why*. | **Correction:** `lost`. **Model explanation:** *"Because 'yesterday' is a finished past time (and he already walked home), we must use Simple Past 'lost', not 'have lost'."* | Keeping `have lost` with `yesterday` → **M1** feedback + timeline contrast. | Claiming the ticket is still lost today while keeping `yesterday` → **M1/M2** clarification. |
| **T5** | Level 3 (Challenge) | **Format 3: Open Explanation & Error-Spotter** | Look at this scene: *"Maya is standing outside the locked cinema door holding an empty bag. She says: 'Oh no! I ___ (lose) my wallet, I can't buy the ticket now!'"* Fill the verb and explain in 1 sentence *why* that tense fits. | **Verb:** `have lost`. **Model explanation:** *"We use Present Perfect 'have lost' because the result is true right now — she still does not have her wallet and cannot buy the ticket now."* | Using `have lost` but saying "because it happened yesterday" → **M1** check. | Using `lost` without connecting to the present result → **M2** feedback (*"Since the result blocks her right now, Present Perfect 'have lost' builds the bridge to NOW."*). |

*(Plus an **Adaptive Question Generator Bank & AI/Rule Engine** that dynamically synthesizes new parameterized questions across all 3 formats targeting whichever misconception `M1`, `M2`, or `PREREQ` the learner most recently showed.)*

---

## 5. P4 Design Challenge — Exact Adaptive Decision Rule (Deliverable D7 & Rubric P13_CP)

### Signals Tracked (All 3 Rubric `P13_CP` Dimensions)
1. **Learner Profile (`profileLevel`):** Established via the 2-item Diagnostic (`DIAG-1` for M1, `DIAG-2` for M2) → sets starting tier (`Level 1` if any error, `Level 2` if 2/2 correct) and flags initial misconception profile.
2. **Learner Performance (`attemptOutcome`, `misconceptionTag`, `consecutiveCorrect`, `consecutiveHintReveals`):** Tracks whether the learner solved the item on the 1st try, needed Hints 1–2, or reached Hint 3 (full answer revealed), plus which misconception (`M1`, `M2`, or `PREREQ`) was triggered.
3. **Learner Interaction (`hintsUsedThisItem`, `timeSpentSec`, `toolClicks`):** Tracks progressive hint ladder clicks (`0, 1, 2, 3`), time spent per task, and usage of the Time-Bridge tool.

### The 3-Step Progressive Hint Ladder (Scaffolding Rule)
- **Hint 1 (Time-Window Clue):** Highlights the time marker or present-result clue in the sentence and asks: *"Is this time box closed in the past, or does its result touch NOW?"*
- **Hint 2 (Structure & Formula Clue):** Shows the required structure (`Subject + V2` vs `Subject + has/have + V3`) and reminds the learner of the verb's `V2`/`V3` form.
- **Hint 3 (Full Answer Reveal + Conceptual Breakdown):** Progressively reveals the complete answer and explains *why* the alternative tense would cause Misconception M1 or M2. **Because the learner did not solve it independently, this item is marked `REVEALED_NOT_SOLVED`.**

### The 3-Way Routing Decision Rule
After every task submission or Hint-3 reveal, the tutor executes this deterministic decision rule:

```text
IF (hintsUsed == 0 AND answeredCorrectlyFirstTry == true):
    consecutiveHint3Reveals = 0
    consecutiveUnassistedCorrect += 1
    IF (inRecoveryMode == true AND consecutiveUnassistedCorrect < 2):
        OUTCOME = KEEP_CURRENT_LEVEL ("Mastery Stabilization: 1 of 2 unassisted correct answers before leveling up")
    ELSE:
        inRecoveryMode = false
        currentLevel = min(3, currentLevel + 1)
        OUTCOME = 1_HARDER_QUESTION (Generate next task at higher level / more open format)

ELSE IF (hintsUsed in [1, 2] OR (wrongAnswerTriggered M1 or M2 AND consecutiveHint3Reveals < 3)):
    consecutiveUnassistedCorrect = 0
    pushToRetryLaterQueue(currentQuestion)
    IF (hintsUsed == 3 / answerRevealed):
        consecutiveHint3Reveals += 1
    IF (consecutiveHint3Reveals >= 3):
        GOTO OUTCOME 3
    ELSE:
        OUTCOME = 2_ALTERNATIVE_EXPLANATION (Show Visual Contrastive Timeline Card for M1/M2 + Self-Discovery Check + keep item in Retry-Later Queue)

ELSE IF (consecutiveHint3Reveals >= 3 OR prerequisiteVerbFormErrorCount >= 2):
    consecutiveHint3Reveals = 0
    consecutiveUnassistedCorrect = 0
    currentLevel = max(1, currentLevel - 1)
    inRecoveryMode = true   // requires 2 unassisted correct answers before advancing level again
    OUTCOME = 3_PREREQUISITE_INSTRUCTION (Open Basic Concepts & Prerequisite Recap Module + decrease level + enforce 2-correct stabilization gate)
```

---

## 6. Application Architecture & Screen Map (Deliverable D4)

### 6 Connected Screens / States (All showing Identity Token `24b1233` in Footer + C4 10-Min Session Bar)
1. **Screen 1 — Welcome & C4 Resume Dashboard:** Shows Aarav's context, the **10-Minute Session Timer & Progress Bar (C4)**, a one-tap **"Resume Where You Left Off"** card if `localStorage` has an active session, and quick-launch buttons for **Normal Flow** plus **Demo Scenario A (Correct / Harder Path)** and **Demo Scenario B (Misconception / Alt Explanation & Prerequisite Path)** for instant verification.
2. **Screen 2 — Conversational Concept Briefing & Diagnostic Profile (`P5` & `P13_CP` Point 1):** Active-voice visual guide (*"The Closed Yesterday Box vs The Bridge to NOW"*) + 2-question diagnostic that sets Aarav's initial profile level.
3. **Screen 3 — Adaptive Practice Workspace + Interactive Time-Bridge Tool (`T6`):**
   - Renders the current adaptive task in **Format 1 (MCQ)**, **Format 2 (Time-Tag + Verb-Slot Builder)**, or **Format 3 (Open Explanation & Error-Spotter)**.
   - Includes the **3-Step Progressive Hint Ladder** (`Hint 1 → Hint 2 → Hint 3 Full Reveal`), the collapsible **Time-Bridge & Verb Studio tool (`T6`)**, and the **Retry-Later Queue badge**.
4. **Screen 4 — Adaptive Feedback & Alternative Visual Explanation Modal/View (`Outcome 2` & Rubric `P2`):**
   - Contrasts what Aarav's answer means on a timeline vs the target meaning, includes a 1-click **"Spot Your Gap" self-check (`P2`)**, and displays the **Adaptive Tutor Decision Log** explaining why the next task was chosen.
5. **Screen 5 — Prerequisite & Basic Concepts Recap Module (`Outcome 3`):**
   - Triggered automatically after **3 consecutive Hint-3 reveals** (or accessible to inspect). Steps down the learner's level, teaches the foundational `Closed Past vs Present Bridge` + `has/have` + `V1-V2-V3` irregular verb table with an interactive mini-check, and activates the **2-consecutive-correct stabilization gate**.
6. **Screen 6 — Session Summary, AI Specification & About Screen (`D4`, `D6`, `D8`):**
   - Displays session mastery metrics, misconception diagnosis breakdown (`M1` vs `M2`), retry-queue resolution, the **AI Functionality Specification & Prompt/Fallback Inspector (`D6`)**, and the **About Screen** with Identity Token `24b1233`.

### File Structure (Clean Vanilla ES Modules — Zero Build Failure Risk)
- `index.html` — Semantic mobile-first layout (360 px–720 px), header with C4 10-minute session timer & Stop/Resume control, main view container, and persistent footer displaying `ID: 24b1233 | P4 · P4-T7 · L1 · C4`.
- `styles.css` — Minimal paper-and-ink theme (`#FAF9F6` surface, high-contrast `#1C1917` text, crisp `1px` borders, deep forest `#1E5E4B` accent, amber/terracotta misconception callouts, >=44 px touch targets).
- `src/content.js` — All learning content, diagnostic items, multi-format question templates, movie/everyday ESL contexts, `V1/V2/V3` verb bank, and `M1`/`M2` contrastive explanations.
- `src/pedagogy.js` — Pure functions implementing the P4 3-Way Decision Rule, 3-step hint ladder, retry-later queue, 3-consecutive-reveal level step-down, 2-correct mastery stabilization gate, and explanation rubric/AI evaluator + deterministic fallback.
- `src/state.js` — Single learner state object + `localStorage` load/save/reset under key `et617_24b1233_p4_state` for C4 stop-and-resume persistence.
- `src/app.js` — UI rendering, event handlers, Time-Bridge interactive tool (`T6`), and live decision-trace logger.
