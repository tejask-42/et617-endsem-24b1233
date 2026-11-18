# Architecture (`P4 · P4-T7 · L1 · C4 · ID: 24b1233`)

## 1. Stack & Hosting
- **Stack:** Plain HTML5 + CSS3 + Vanilla ES Modules (`type="module"`). Zero build step so every line is directly inspectable and live-tweakable during the viva.
- **Hosting:** Netlify (`https://et617-24b1233.netlify.app`), deployed via `netlify deploy --prod --dir=.` and linked to GitHub (`https://github.com/tejask-42/et617-endsem-24b1233`).
- **Persistence:** Browser `localStorage` under key `et617_24b1233_p4_state` to support **C4 (10-minute sessions with instant stop-and-resume)**.

## 2. File Tree & One-Line Responsibilities
- `index.html` — Root shell with C4 10-minute session header, navigation tabs (Learn/Practice, Time-Bridge Tool, Summary/AI Spec, About), main screen stage, and permanent footer with `ID: 24b1233`.
- `styles.css` — Minimal paper-and-ink stylesheet (`#FAF9F6` background, `#1E5E4B` forest accent, 360px-first layout, >=44px touch targets).
- `src/content.js` — Diagnostic questions, adaptive question generator templates across 3 formats (MCQ, Time-Tag + Verb Builder, Open Explanation), verb conjugation table (`V1/V2/V3`), and M1/M2 contrastive timeline cards.
- `src/pedagogy.js` — Pure pedagogical engine: answer evaluation, explanation rubric + AI generator/fallback, 3-step progressive hint ladder, retry-later queue, 3-consecutive-reveal level step-down, and 2-correct mastery stabilization gate.
- `src/state.js` — Single learner-state store (`createInitialState`, `loadState`, `saveState`, `resetState`, C4 pause/resume timestamp & elapsed timer).
- `src/app.js` — DOM rendering, user event bindings, interactive Time-Bridge & Verb Studio tool (`T6`), and live decision-rule banner.

## 3. Data Flow (Numbered Steps)
1. **User Action:** Learner clicks `"Check Answer"`, `"Get Hint (1/2/3)"`, or `"Pause 10-Min Session (C4)"` in `index.html`.
2. **Event Handler (`src/app.js`):** Reads current input (selected MCQ option, Time-Tag + verb slot, or 1-sentence explanation text) and elapsed item time.
3. **Pedagogy Engine (`src/pedagogy.js`):**
   - Evaluates answer and classifies outcome (`CORRECT`, `M1_FINISHED_TIME_WITH_PERF`, `M2_PRESENT_RESULT_WITH_PAST`, `PREREQ_FORM_ERROR`, or `HINT_3_REVEALED`).
   - Applies the **P4 3-Way Decision Rule** (`1_HARDER_QUESTION`, `2_ALTERNATIVE_EXPLANATION` + push to `retryQueue`, or `3_PREREQUISITE_INSTRUCTION` + decrease `currentLevel` + set `inRecoveryMode = true` requiring `2` consecutive unassisted correct answers).
4. **State Update & Save (`src/state.js`):** Updates `state` and persists immediately to `localStorage['et617_24b1233_p4_state']`.
5. **Render (`src/app.js`):** Redraws feedback card, contrastive timeline explanation, hint ladder, C4 progress bar, and next adaptive task.

## 4. Where to Change What (Viva Quick-Reference Table)

| What to Change | File | Constant / Function / Key |
| :--- | :--- | :--- |
| Max hints per question (default `3`, where 3rd reveals answer) | `src/pedagogy.js` | `PEDAGOGY_CONFIG.MAX_HINTS` & `getNextHint()` |
| Consecutive Hint-3 reveals before Prerequisite Recap & Level Step-Down (default `3`) | `src/pedagogy.js` | `PEDAGOGY_CONFIG.REVEALS_BEFORE_RECAP` (`3`) in `applyAdaptiveDecisionRule()` |
| Consecutive unassisted correct answers required in recovery mode before leveling up (default `2`) | `src/pedagogy.js` | `PEDAGOGY_CONFIG.RECOVERY_CORRECT_STREAK` (`2`) in `applyAdaptiveDecisionRule()` |
| C4 Session target duration (default `10` minutes = `600` seconds) | `src/state.js` | `SESSION_LIMIT_SECONDS = 600` |
| `localStorage` persistence key | `src/state.js` | `STORAGE_KEY = 'et617_24b1233_p4_state'` |
| Misconception M1 / M2 feedback & questions | `src/content.js` | `MISCONCEPTIONS`, `CORE_QUESTIONS`, `TEMPLATE_BANK` |
| Theme colours & spacing tokens | `styles.css` | `:root` CSS variables (`--bg`, `--accent`, `--border`) |
| Identity token (`24b1233`) display | `index.html` & `src/app.js` | Footer `#identity-footer` & `renderAboutScreen()` |
