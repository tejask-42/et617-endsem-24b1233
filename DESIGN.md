# TimeBridge English — Design Document

## 1. Overview & Project Context

- **Application Name:** TimeBridge English
- **Student Roll Number:** `24b1233`
- **Core Goal:** An adaptive English as a Second Language (ESL) tutor that helps middle-school learners tell the difference between **Simple Past** (actions completed in a finished past time) and **Present Perfect** (past actions whose result still matters right now).
- **Repository:** `https://github.com/tejask-42/et617-endsem-24b1233`
- **Live URL:** `https://et617-24b1233.netlify.app`

---

## 2. Educational Problem & Learning Outcomes

### The Problem
Class 6–8 students in rural regional-language medium government schools often learn English through rote textbook memorization and struggle to distinguish between the **Simple Past** (*"I lost my key yesterday"*) and the **Present Perfect** (*"I have lost my key, so I cannot open the door now"*). Because their home language often expresses both situations using a single past construction, learners frequently combine finished past time markers with `have/has + past participle` or use the simple past when trying to explain a result that still holds in the present moment. When practicing on a parent's shared smartphone for a short time in the evening, static worksheets fail to diagnose *why* a student picked the wrong tense or adapt to how much support they needed. TimeBridge English addresses this by offering short, self-contained evening lessons with stop-and-resume support, diagnosing specific conceptual errors, guiding learners through a 3-step progressive hint ladder, and dynamically adjusting difficulty and foundational recaps.

### Learning Outcomes
1. **Classify Time Contexts (Understand):** Given an everyday sentence context, the learner will **classify** whether the action belongs to a **finished past time period** (requiring Simple Past) or **connects to the present moment** (requiring Present Perfect).
2. **Construct Accurate Verb Phrases (Apply):** Given a person (subject), a base verb, and an everyday situation, the learner will **construct** the accurate verb phrase (`past form V2` vs `has/have + past participle V3`) without helper-verb or irregular participle mistakes.
3. **Explain & Fix Tense Errors (Analyze / Evaluate):** Given a sentence containing a common tense mistake, the learner will **explain** in their own words *why* Simple Past or Present Perfect is needed by referring to whether the time window is already over or still affects right now.

### Context of Use
- **Where & When:** Used at home in the evening between 7:30 PM and 8:00 PM after dinner.
- **Device & Pacing:** Accessed on a father's shared Android smartphone. Because the parent may need the phone back at any moment, the lesson is designed to complete in under 10 minutes without any stressful countdown clock, and saves progress automatically so the student can pick up right where they left off.

---

## 3. Learner Persona

- **Name & Age:** **Aarav Patil**, 13 years old (Class 8 student at a rural government school, regional-language Marathi medium).
- **Language Background:** Speaks Marathi at home and at school. He is learning conversational, everyday English for the first time outside routine school tests.
- **Motivation:** Aarav is fascinated by English after watching English movies on TV. He wants to understand natural dialogues and express everyday actions clearly, rather than memorizing abstract grammar rules.
- **Device & Daily Routine:** Borrows his father's Android phone for 20–30 minutes in the evening. He needs calm, bite-sized practice sessions that let him pause at any point and resume later without losing his place.
- **Prior Knowledge:**
  - Knows common pronouns (*I, we, you, they, he, she, it*) and everyday verbs (*finish, lose, buy, clean, visit, eat, go, watch*).
  - Has heard past verbs (*watched, went, lost*) and phrases with *have/has*, but is unsure when to use one over the other or when to use *went* vs *gone*.
- **Two Common Conceptual Gaps:**
  1. **Gap 1 — Pairing "have / has + V3" with a Finished Past Time:**
     - Aarav thinks adding *have* or *has* before a past verb simply makes English sound more complete or polite, so he uses `have/has + V3` with finished past time words like *yesterday*, *last Sunday*, or *two hours ago* (for example, *"I have visited my grandmother's village last Sunday"* instead of *"I visited..."*).
  2. **Gap 2 — Using Simple Past when the Result Still Matters Right Now:**
     - Whenever an action happened before the current second, Aarav defaults to Simple Past (`V2`), even when the sentence explains a present situation right now or uses words like *already*, *yet*, or *just* (for example, *"Meena lost the key, so she cannot open the lock right now"* instead of connecting the past loss to the locked door now with *"has lost"*).

---

## 4. Learning Theories & Design Principles

| Educational Theory | Application to Aarav's Learning | Feature in TimeBridge English |
| :--- | :--- | :--- |
| **Zone of Proximal Development & Scaffolding** | A self-motivated beginner gets discouraged by harsh red-X grading, but succeeds when given graduated cues. | **3-Step Progressive Hint Ladder** (Hint 1: Time clue → Hint 2: Verb structure clue → Hint 3: Full answer reveal + retry queue). |
| **Cognitive Load Theory** | Heavy linguistic terms and countdown clocks overload working memory on a small phone screen. | **Conversational active voice** (*"Let us picture time..."*), visual **Finished Past vs Connected to Right Now** boxes, one task per screen, and pressure-free stop-and-resume pacing. |
| **Memory Encoding & Retrieval Practice** | Answers that are merely revealed by a final hint sit briefly in short-term memory unless retrieved independently later. | **Retry Later Queue & Confidence Rebuild Streak:** Questions solved with hints return later, and level step-downs require 2 consecutive unassisted correct answers before advancing. |
| **Conceptual Change through Self-Identification** | Simply showing "Incorrect" does not fix a habit; learners remember best when they spot the time clash themselves. | **Two-Step Error Repair Card:** Step 1 asks Aarav to tap whether the sentence describes a finished past time or connects to right now; Step 2 contrasts both meanings side by side. |

### Core Design Principles
1. **We will** frame tense choice visually as **"Finished Past Time" vs "Connected to Right Now"** with an interactive verb explorer **because** a beginner learns better from concrete time relationships than abstract grammar terminology.
2. **We will** guide learners through a **3-step progressive hint ladder** and queue any assisted question for later retry **because** graduated scaffolding supports problem solving while delayed retrieval ensures genuine retention.
3. **We will** automatically trigger a **Basic Concepts Recap**, lower the difficulty level by one tier, and require **2 consecutive unassisted correct answers** whenever 3 questions in a row require full answer reveal **because** struggling learners need foundational consolidation before moving to harder tasks.
4. **We will** design lessons as calm, short sequences with instant local saving and a **"Pick Up Where You Left Off"** option **because** Aarav practices on a shared family phone and should never feel rushed by a countdown timer.
5. **We will** prompt the learner to **self-identify the time clue first** whenever they make an error **because** active error recognition leads to deeper conceptual repair than passive correction.

---

## 5. Content Plan & Question Formats

### 5.1 Conversational Idea Briefing & Interactive Helper Tool
- **Learn the Idea Screen:** Written in a friendly, conversational style (*"Let us picture time in two simple ways..."*) using clear visual steps (*First*, *Second*, *Third*) and highlighted time and verb boxes.
- **Interactive Time-Bridge & Verb Explorer:** Available inside the practice workspace so the learner can pick a person (*I, We, They, My mother, Rohan, She*), pick an everyday verb (*finish, lose, clean, visit, go, eat, buy, watch*), and switch between `[Finished Past Time · Yesterday]` and `[Connected to Right Now · Present Result]` to see how the sentence and verb form change live.

### 5.2 Three Question Formats Across Everyday Contexts
1. **Format 1 — Everyday Context Multiple Choice:** Learner selects the right verb phrase for everyday situations (buying tomatoes at the market yesterday morning, wet roads after rain right now, fixing a bicycle two days ago).
2. **Format 2 — Time Frame & Verb Phrase Builder:** Learner first classifies the sentence's time frame (`Finished Past Time` vs `Connected to Right Now`) and then chooses the matching verb phrase (`won` vs `has won`, `has not arrived`, `have already eaten`).
3. **Format 3 — Spot & Explain the Error:** Learner inspects a sentence with a tense error (or a real-life scenario), writes the corrected verb phrase, and writes a one-sentence explanation of *why* that tense is required.

---

## 6. Adaptive Tutor Decision Rule

The tutor adapts using three sources of information:
1. **Starting Profile (Warm-Up Check):** Two quick warm-up questions determine whether the learner starts at **Level 1 (Guided Everyday Sentences)** or **Level 2 (Building & Comparing Time)**.
2. **Task Performance:** Whether the learner answered right on the first try, made a finished-past or present-result mistake, or needed hints.
3. **Interaction Behaviour:** How many hints were requested (`1`, `2`, or `3`) and how often the learner explored the interactive Time-Bridge Helper.

### The Three Adaptive Routing Outcomes
1. **Outcome 1 — Advance to Harder Tasks:**
   - **Rule:** When the learner answers **correctly on the first attempt with zero hints**, the tutor advances their level (from Level 1 → Level 2 → Level 3). If the learner is currently in **Confidence Rebuild Mode** after a recap, they must complete **2 unassisted correct answers in a row** before advancing back up.
2. **Outcome 2 — Self-Identification Repair & Retry Later Queue:**
   - **Rule:** When the learner makes a mistake, the tutor opens a **2-step self-identification card** (asking them to identify the time window first, then showing a side-by-side comparison). Any question solved after an error or with **Hints 1 or 2** is placed into the **Retry Later** queue so the learner practices it again later.
3. **Outcome 3 — Basic Concepts Recap & Level Step-Down:**
   - **Rule:** If the learner cannot solve **3 questions in a row** and must click through to **Hint 3 (which reveals the full answer)**, the tutor automatically opens the **Basic Concepts Recap**, steps their practice level down by one tier, and activates **Confidence Rebuild Mode** (requiring 2 unassisted correct answers before advancing again).
