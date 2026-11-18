# Application Architecture

## 1. Stack & Hosting
- **Stack:** HTML5, CSS3, and Vanilla ES Modules (`type="module"`). No build step or external bundler is required, keeping every function easy to inspect and modify live.
- **Hosting:** Netlify (`https://et617-24b1233.netlify.app`).
- **Persistence:** Browser `localStorage` (`et617_24b1233_tutor_state` and `et617_24b1233_theme`) for instant stop-and-resume support and dark mode preference.

## 2. File Structure
- `index.html` — Main layout shell, top navigation bar, dark-mode toggle button, main screen container, and persistent footer showing roll number `24b1233`.
- `styles.css` — Light and Dark theme variables, responsive mobile-first cards, highlighted time/verb callouts, and button styles.
- `src/content.js` — Warm-up questions, practice question bank across three formats (Multiple Choice, Time & Verb Builder, Spot & Explain the Error), everyday verb table, and dynamic question generator.
- `src/pedagogy.js` — Pure pedagogical logic: answer evaluation across all three formats, 3-step progressive hint ladder, retry-later queue management, 3-consecutive-reveal level step-down with Basic Recap trigger, and 2-unassisted-correct confidence rebuild streak.
- `src/state.js` — Learner state creation, `localStorage` load/save/reset functions, and theme storage.
- `src/app.js` — Screen rendering (`Home`, `Learn the Idea`, `Practice`, `Basic Recap`, `My Progress`, `About`), event handlers, and the interactive Time-Bridge & Verb Explorer tool.

## 3. Data Flow
1. **Learner Action:** Learner clicks `"Check My Answer"`, `"Get Hint"`, `"Save & Stop for Now"`, or switches the Time-Bridge helper.
2. **Event Handler (`src/app.js`):** Collects current form inputs (chosen option, time-window + verb chip, or typed verb + explanation sentence).
3. **Pedagogy Engine (`src/pedagogy.js`):**
   - Evaluates the response (`evaluateLearnerResponse`).
   - Updates level, retry queue, and streak counters (`applyAdaptiveDecisionRule`).
4. **State Persistence (`src/state.js`):** Saves the updated state object to `localStorage`.
5. **View Update (`src/app.js`):** Re-renders feedback, self-check prompts, hint ladder, or transitions to the Basic Recap screen.

## 4. Where to Change What

| Change Needed | File | Location / Function |
| :--- | :--- | :--- |
| Maximum hints per question (default `3`, where 3rd reveals full answer) | `src/pedagogy.js` | `PEDAGOGY_CONFIG.MAX_HINTS` |
| Consecutive Hint-3 answer reveals before Basic Recap & level step-down (default `3`) | `src/pedagogy.js` | `PEDAGOGY_CONFIG.REVEALS_BEFORE_RECAP` in `applyAdaptiveDecisionRule()` |
| Consecutive unassisted correct answers needed in Confidence Rebuild Mode to level up (default `2`) | `src/pedagogy.js` | `PEDAGOGY_CONFIG.RECOVERY_STREAK_REQUIRED` in `applyAdaptiveDecisionRule()` |
| `localStorage` state key | `src/state.js` | `STORAGE_KEY` |
| Practice questions, warm-up items, and dynamic question templates | `src/content.js` | `DIAGNOSTIC_QUESTIONS`, `PRACTICE_QUESTION_BANK`, `DYNAMIC_TEMPLATES` |
| Light and Dark theme colors | `styles.css` | `:root` and `html[data-theme="dark"]` |
| Roll number (`24b1233`) in footer and About page | `index.html` & `src/app.js` | `#identity-footer` & `renderAboutScreen()` |
