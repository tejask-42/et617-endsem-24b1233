// src/app.js
// Complete 6-screen application controller with Dark Mode, 3 question formats,
// 2-step error self-identification, 3-step progressive hint ladder, retry queue,
// 3-consecutive-reveal Basic Recap & level step-down, and interactive Time-Bridge tool.

import {
  loadState,
  saveState,
  clearSavedState,
  loadTheme,
  saveTheme
} from './state.js';
import {
  PROJECT_INFO,
  LEVEL_NAMES,
  VERB_STUDIO_BANK,
  DIAGNOSTIC_QUESTIONS,
  PRACTICE_QUESTION_BANK
} from './content.js';
import {
  PEDAGOGY_CONFIG,
  evaluateLearnerResponse,
  applyAdaptiveDecisionRule,
  selectNextQuestion,
  AI_FUNCTIONALITY_SPEC
} from './pedagogy.js';

let appState = loadState();
let currentTheme = loadTheme();

// Transient UI state for the current active question
let currentQuestion =
  PRACTICE_QUESTION_BANK.find((q) => q.id === appState.currentQuestionId) ||
  PRACTICE_QUESTION_BANK[0];

let uiFormState = {
  selectedOptionId: null,
  windowChoice: null,
  verbChoice: null,
  correctedVerb: '',
  explanationText: '',
  validationMessage: null,
  lastEvaluation: null,
  selfIdentifiedWindow: null,
  questionSolvedOrRevealed: false,
  toolOpen: false
};

function resetUiFormForQuestion(question) {
  currentQuestion = question;
  appState.currentQuestionId = question.id;
  appState.hintsUsedOnCurrent = 0;
  appState.wrongAttemptsOnCurrent = 0;
  uiFormState = {
    selectedOptionId: null,
    windowChoice: null,
    verbChoice: null,
    correctedVerb: '',
    explanationText: '',
    validationMessage: null,
    lastEvaluation: null,
    selfIdentifiedWindow: null,
    questionSolvedOrRevealed: false,
    toolOpen: uiFormState.toolOpen
  };
}

function applyTheme(theme) {
  currentTheme = theme;
  document.documentElement.setAttribute('data-theme', theme);
  saveTheme(theme);
  const btn = document.getElementById('btn-theme-toggle');
  if (btn) {
    btn.textContent = theme === 'dark' ? 'Light Mode' : 'Dark Mode';
  }
}

function setScreen(screenName) {
  appState.currentScreen = screenName;
  appState = saveState(appState);
  render();
}

function updateHeaderStatus() {
  const pill = document.getElementById('session-status-bar');
  if (pill) {
    pill.textContent = `Level ${appState.currentLevel}`;
  }

  document.querySelectorAll('.nav-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.nav === appState.currentScreen);
  });
}

// ============================================================================
// SCREEN 1: HOME & RESUME
// ============================================================================
function renderWelcomeScreen(root) {
  const hasSavedProgress =
    appState.hasActiveSession &&
    (appState.diagnosticCompleted ||
      Object.keys(appState.diagnosticAnswers).length > 0 ||
      appState.totalQuestionsSolved > 0 ||
      appState.attemptHistory.length > 0);

  const resumeBannerHtml = hasSavedProgress
    ? `
      <div class="resume-banner" role="region" aria-label="Saved lesson available">
        <h3>Continue Your Saved Lesson?</h3>
        <p>
          You last practiced at <strong>${appState.lastSavedAt || 'earlier today'}</strong>
          (currently at <strong>${LEVEL_NAMES[appState.currentLevel]}</strong>,
          with <strong>${appState.totalQuestionsSolved}</strong> completed tasks${
            appState.retryQueue.length > 0 ? ` and ${appState.retryQueue.length} item waiting in Retry Later` : ''
          }).
        </p>
        <div class="btn-row">
          <button type="button" class="btn-primary" id="btn-resume-session">
            Pick Up Where You Left Off
          </button>
          <button type="button" class="btn-danger" id="btn-reset-session">
            Quit &amp; Start New Lesson
          </button>
        </div>
      </div>
    `
    : '';

  root.innerHTML = `
    ${resumeBannerHtml}
    <section class="card">
      <h2>Speak Natural English: Past Events vs What Matters Now</h2>
      <p>
        When we talk about everyday life or watch an English film on TV, we often hear two different ways to speak about the past:
        <span class="highlight-verb">I lost my key yesterday</span> and
        <span class="highlight-verb">I have lost my key, so I cannot open the door now</span>.
      </p>
      <p>
        This short, pressure-free lesson takes just a few minutes on your phone. There is no countdown clock — you can learn at your own pace, ask for up to 3 step-by-step hints whenever you feel stuck, and stop or resume anytime.
      </p>
      <div class="btn-row">
        <button type="button" class="btn-primary" id="btn-start-briefing">
          Learn the Idea &amp; Take Quick Check
        </button>
        <button type="button" class="btn-secondary" id="btn-jump-practice">
          Go Directly to Practice
        </button>
      </div>
    </section>

    <section class="card-muted">
      <h3>How This Tutor Helps You Learn</h3>
      <ul>
        <li><strong>Everyday &amp; Real-Life Sentences:</strong> Practice with familiar situations from home, school, the market, the bus stop, and stories.</li>
        <li><strong>3 Step-by-Step Hints:</strong> Stuck on a question? Take Hint 1 (Time Clue), Hint 2 (Rule Clue), or Hint 3 (Full Answer). Any question that needs hints comes back later so you can master it on your own.</li>
        <li><strong>Adapts to Your Comfort:</strong> Answer on your first try without hints to unlock harder challenges. If 3 questions in a row need the full answer revealed, we pause for a friendly Basic Recap and adjust the level so you can rebuild confidence.</li>
      </ul>
    </section>
  `;

  const resumeBtn = document.getElementById('btn-resume-session');
  if (resumeBtn) {
    resumeBtn.addEventListener('click', () => {
      const target = appState.diagnosticCompleted ? 'practice' : 'briefing';
      setScreen(target);
    });
  }

  const resetBtn = document.getElementById('btn-reset-session');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      appState = clearSavedState();
      resetUiFormForQuestion(PRACTICE_QUESTION_BANK[0]);
      render();
    });
  }

  document.getElementById('btn-start-briefing').addEventListener('click', () => {
    setScreen('briefing');
  });

  document.getElementById('btn-jump-practice').addEventListener('click', () => {
    setScreen('practice');
  });
}

// ============================================================================
// SCREEN 2: LEARN THE IDEA & QUICK STARTING CHECK
// ============================================================================
function renderBriefingScreen(root) {
  const diagHtml = DIAGNOSTIC_QUESTIONS.map((q, idx) => {
    const chosenId = appState.diagnosticAnswers[q.id];
    const chosenObj = q.options.find((o) => o.id === chosenId);

    const optionsHtml = q.options
      .map(
        (opt) => `
        <button
          type="button"
          class="option-btn ${chosenId === opt.id ? 'selected' : ''}"
          data-qid="${q.id}"
          data-opt="${opt.id}"
        >
          <strong>${opt.id.toUpperCase()})</strong> ${opt.text}
        </button>
      `
      )
      .join('');

    const feedbackHtml = chosenObj
      ? `
        <div class="feedback-box ${chosenObj.isCorrect ? 'feedback-ok' : 'feedback-warn'}">
          <strong>${chosenObj.isCorrect ? 'Correct!' : 'Let us look closely:'}</strong> ${chosenObj.feedback}
        </div>
      `
      : '';

    return `
      <div class="card">
        <h3>Warm-Up Question ${idx + 1} of ${DIAGNOSTIC_QUESTIONS.length}</h3>
        <p>${q.prompt}</p>
        <div class="option-list">${optionsHtml}</div>
        ${feedbackHtml}
      </div>
    `;
  }).join('');

  const allAnswered = DIAGNOSTIC_QUESTIONS.every((q) => Boolean(appState.diagnosticAnswers[q.id]));

  root.innerHTML = `
    <section class="card">
      <h2>Let Us Picture Time in Two Simple Ways</h2>
      <p>
        Whenever we talk about something that happened before now, let us ask one simple question:
        <strong>Is that time period already over, or does the result still matter right now?</strong>
      </p>

      <div class="cue-box">
        <span class="cue-label">First · Finished Past Time (Simple Past — V2)</span>
        <p>
          When a sentence mentions a <strong>finished past time</strong> like
          <span class="highlight-time">yesterday</span>, <span class="highlight-time">last Sunday</span>, or
          <span class="highlight-time">two hours ago</span>, that time box is closed.
          We use <strong>Simple Past</strong>:
          <em>"My mother <span class="highlight-verb">bought</span> vegetables <span class="highlight-time">yesterday morning</span>."</em>
        </p>
      </div>

      <div class="cue-box">
        <span class="cue-label">Second · Connected to Right Now (Present Perfect — have / has + V3)</span>
        <p>
          When a past action leaves a <strong>result we can still see right now</strong> (or uses words like
          <span class="highlight-time">already</span>, <span class="highlight-time">yet</span>, or
          <span class="highlight-time">just</span>), we build a bridge to the present using
          <strong>have / has + V3</strong>:
          <em>"Meena <span class="highlight-verb">has lost</span> the key, so she cannot open the lock <span class="highlight-time">right now</span>."</em>
        </p>
      </div>

      <div class="cue-box">
        <span class="cue-label">Third · Two Common Mistakes We Will Avoid Together</span>
        <p>
          <strong>Mistake 1:</strong> Do not use <span class="highlight-verb">have / has + V3</span> when the sentence names a finished past time like <span class="highlight-time">yesterday</span>.<br>
          <strong>Mistake 2:</strong> Do not use Simple Past when the sentence is explaining why something is true <span class="highlight-time">right now</span>.
        </p>
      </div>
    </section>

    <section class="card-muted">
      <h2>Quick 2-Question Starting Check</h2>
      <p>Try these two everyday sentences so we can choose the best starting level for your practice.</p>
    </section>

    ${diagHtml}

    <div class="card">
      <div class="btn-row">
        <button type="button" class="btn-primary" id="btn-finish-diag" ${allAnswered ? '' : 'disabled'}>
          ${allAnswered ? `Start Practice at Level ${appState.currentLevel} →` : 'Answer both warm-up questions above to begin'}
        </button>
        <button type="button" class="btn-secondary" id="btn-save-pause">
          Save &amp; Stop for Now
        </button>
      </div>
    </div>
  `;

  root.querySelectorAll('.option-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const qid = btn.dataset.qid;
      const optId = btn.dataset.opt;
      appState.diagnosticAnswers[qid] = optId;

      const correctCount = DIAGNOSTIC_QUESTIONS.filter((q) => {
        const picked = q.options.find((o) => o.id === appState.diagnosticAnswers[q.id]);
        return picked && picked.isCorrect;
      }).length;

      if (Object.keys(appState.diagnosticAnswers).length === DIAGNOSTIC_QUESTIONS.length) {
        appState.diagnosticCompleted = true;
        appState.profileLevel = correctCount === 2 ? 2 : 1;
        appState.currentLevel = appState.profileLevel;
        const firstForLevel = selectNextQuestion(appState);
        resetUiFormForQuestion(firstForLevel);
      }
      appState = saveState(appState);
      render();
    });
  });

  const finishBtn = document.getElementById('btn-finish-diag');
  if (finishBtn) {
    finishBtn.addEventListener('click', () => {
      if (!allAnswered) return;
      setScreen('practice');
    });
  }

  document.getElementById('btn-save-pause').addEventListener('click', () => {
    appState = saveState(appState);
    setScreen('welcome');
  });
}

// ============================================================================
// INTERACTIVE TOPIC-SPECIFIC TOOL: TIME-BRIDGE & VERB EXPLORER
// ============================================================================
function renderTimeBridgeToolHtml() {
  const { subject, verbBase, timeMode } = appState.toolState;
  const verbObj = VERB_STUDIO_BANK.find((v) => v.base === verbBase) || VERB_STUDIO_BANK[0];
  const isSingularThird = ['My mother', 'Rohan', 'She', 'He'].includes(subject);
  const aux = isSingularThird ? 'has' : 'have';

  const builtSentence =
    timeMode === 'closed_past'
      ? `${subject} <span class="highlight-verb">${verbObj.past}</span> ${verbObj.exampleObj} <span class="highlight-time">yesterday</span>.`
      : `${subject} <span class="highlight-verb">${aux} already ${verbObj.participle}</span> ${verbObj.exampleObj}, so it is done <span class="highlight-time">right now</span>.`;

  const explanationNote =
    timeMode === 'closed_past'
      ? `<strong>Closed Past Box:</strong> Because "yesterday" is completely finished, we use Simple Past (<strong>${verbObj.past}</strong>) with no has/have.`
      : `<strong>Bridge to Right Now:</strong> Because the result matters right now, "${subject}" uses <strong>${aux} + ${verbObj.participle} (V3)</strong>.`;

  return `
    <div class="tool-panel" role="region" aria-label="Sentence Guide">
      <h3>Sentence Guide</h3>
      <p>Try any person, verb, and time below to see how the sentence works:</p>
      <div class="tool-Controls">
        <div>
          <label class="builder-label" for="tool-subject-select">1. Person</label>
          <select id="tool-subject-select" class="select-input">
            ${['I', 'We', 'They', 'My mother', 'Rohan', 'She'].map(
              (s) => `<option value="${s}" ${s === subject ? 'selected' : ''}>${s}</option>`
            ).join('')}
          </select>
        </div>
        <div>
          <label class="builder-label" for="tool-verb-select">2. Verb</label>
          <select id="tool-verb-select" class="select-input">
            ${VERB_STUDIO_BANK.map(
              (v) => `<option value="${v.base}" ${v.base === verbBase ? 'selected' : ''}>${v.base} (${v.past} / ${v.participle})</option>`
            ).join('')}
          </select>
        </div>
      </div>

      <div class="builder-group">
        <span class="builder-label">3. Time:</span>
        <div class="chip-row">
          <button type="button" class="chip-btn ${timeMode === 'closed_past' ? 'selected' : ''}" data-tool-mode="closed_past">
            Finished Past Time (Yesterday)
          </button>
          <button type="button" class="chip-btn ${timeMode === 'bridge_now' ? 'selected' : ''}" data-tool-mode="bridge_now">
            Connected to Right Now
          </button>
        </div>
      </div>

      <div class="cue-box">
        <p><strong>Example Sentence:</strong> ${builtSentence}</p>
        <p style="margin-bottom:0;">${explanationNote}</p>
      </div>
    </div>
  `;
}

function bindTimeBridgeToolEvents(root) {
  const subjSelect = root.querySelector('#tool-subject-select');
  const verbSelect = root.querySelector('#tool-verb-select');
  if (subjSelect) {
    subjSelect.addEventListener('change', (e) => {
      appState.toolState.subject = e.target.value;
      appState.toolClicks += 1;
      appState = saveState(appState);
      render();
    });
  }
  if (verbSelect) {
    verbSelect.addEventListener('change', (e) => {
      appState.toolState.verbBase = e.target.value;
      appState.toolClicks += 1;
      appState = saveState(appState);
      render();
    });
  }
  root.querySelectorAll('[data-tool-mode]').forEach((btn) => {
    btn.addEventListener('click', () => {
      appState.toolState.timeMode = btn.dataset.toolMode;
      appState.toolClicks += 1;
      appState = saveState(appState);
      render();
    });
  });
}

// ============================================================================
// SCREEN 3 & 4: ADAPTIVE PRACTICE + 2-STEP ERROR SELF-CHECK + 3-STEP HINT LADDER
// ============================================================================
function renderQuestionInputHtml(q) {
  if (q.format === 'mcq') {
    return `
      <div class="option-list">
        ${q.options
          .map(
            (opt) => `
            <button
              type="button"
              class="option-btn ${uiFormState.selectedOptionId === opt.id ? 'selected' : ''}"
              data-mcq-opt="${opt.id}"
              ${uiFormState.questionSolvedOrRevealed ? 'disabled' : ''}
            >
              <strong>${opt.id.toUpperCase()})</strong> ${opt.text}
            </button>
          `
          )
          .join('')}
      </div>
    `;
  }

  if (q.format === 'builder') {
    return `
      <div class="builder-group">
        <span class="builder-label">Step 1: What kind of time does this sentence talk about?</span>
        <div class="chip-row">
          <button
            type="button"
            class="chip-btn ${uiFormState.windowChoice === 'closed_past' ? 'selected' : ''}"
            data-window-choice="closed_past"
            ${uiFormState.questionSolvedOrRevealed ? 'disabled' : ''}
          >
            Finished Past Time (already over)
          </button>
          <button
            type="button"
            class="chip-btn ${uiFormState.windowChoice === 'bridge_now' ? 'selected' : ''}"
            data-window-choice="bridge_now"
            ${uiFormState.questionSolvedOrRevealed ? 'disabled' : ''}
          >
            Connected to Right Now (still matters now)
          </button>
        </div>
      </div>

      <div class="builder-group">
        <span class="builder-label">Step 2: Choose the matching verb phrase for the blank:</span>
        <div class="chip-row">
          ${q.verbChoices
            .map(
              (vc) => `
              <button
                type="button"
                class="chip-btn ${uiFormState.verbChoice === vc ? 'selected' : ''}"
                data-verb-choice="${vc}"
                ${uiFormState.questionSolvedOrRevealed ? 'disabled' : ''}
              >
                ${vc}
              </button>
            `
            )
            .join('')}
        </div>
      </div>
    `;
  }

  // Format 3: explanation
  return `
    <div class="builder-group">
      <label class="builder-label" for="input-corrected-verb">
        Step 1: Write the correct verb phrase (for example: <em>visited</em> or <em>has lost</em>):
      </label>
      <input
        type="text"
        id="input-corrected-verb"
        class="text-input"
        placeholder="Type the correct verb phrase..."
        value="${uiFormState.correctedVerb.replace(/"/g, '&quot;')}"
        ${uiFormState.questionSolvedOrRevealed ? 'disabled' : ''}
      >
    </div>

    <div class="builder-group">
      <label class="builder-label" for="input-explanation-text">
        Step 2: Explain in one short sentence why that verb fits (mention the time clue "${q.timeCue}"):
      </label>
      <textarea
        id="input-explanation-text"
        class="textarea-input"
        placeholder="Example: Because '${q.timeCue}' is a finished time in the past..."
        ${uiFormState.questionSolvedOrRevealed ? 'disabled' : ''}
      >${uiFormState.explanationText}</textarea>
    </div>
  `;
}

function renderTwoStepErrorRepairHtml(q, evaluation) {
  if (!evaluation || evaluation.isCorrect) return '';

  const selfPicked = uiFormState.selfIdentifiedWindow;
  const selfCorrect = selfPicked === q.selfCheckCorrectWindow;

  const step2ResolutionHtml = selfPicked
    ? `
      <div class="feedback-box ${selfCorrect ? 'feedback-ok' : 'feedback-warn'}" style="margin-top:0.75rem;">
        <p>
          <strong>${
            selfCorrect
              ? 'Yes! You spotted the time rule yourself:'
              : 'Look closely at the time clue "' + q.timeCue + '":'
          }</strong>
        </p>
        <div class="timeline-compare">
          <div class="timeline-box">
            <strong>Why your first choice clashed:</strong>
            <p style="margin-bottom:0;">${q.contrastChosenText}</p>
          </div>
          <div class="timeline-box">
            <strong>How to fix it:</strong>
            <p style="margin-bottom:0;">${q.contrastTargetText}</p>
          </div>
        </div>
        <p style="margin-bottom:0;">
          Now try answering the question again above (or tap a Hint if you want extra help). This question is also saved to your <strong>Retry Later</strong> list so you can practice it again soon.
        </p>
      </div>
    `
    : '';

  return `
    <div class="feedback-box feedback-warn" role="region" aria-label="Self-check your time frame">
      <h3>Let Us Spot the Clue Together (Step 1 of 2)</h3>
      <p>${evaluation.feedback}</p>
      <p><strong>Quick Self-Check:</strong> ${q.selfCheckPrompt}</p>
      <div class="chip-row">
        <button
          type="button"
          class="chip-btn ${selfPicked === 'closed_past' ? 'selected' : ''}"
          data-self-check="closed_past"
        >
          It is a Finished Past Time (already over)
        </button>
        <button
          type="button"
          class="chip-btn ${selfPicked === 'bridge_now' ? 'selected' : ''}"
          data-self-check="bridge_now"
        >
          It connects to Right Now (result still holds now)
        </button>
      </div>
      ${step2ResolutionHtml}
    </div>
  `;
}

function renderStudyBuddyHtml() {
  const evalObj = uiFormState.lastEvaluation;
  let mood = 'neutral';
  let moodText = 'Pip is ready to learn with you! Take your time.';

  if (evalObj && evalObj.isCorrect) {
    mood = 'happy';
    moodText = 'Yay! Pip is jumping with joy — you got it right!';
  } else if (evalObj && !evalObj.isCorrect) {
    mood = 'sad';
    moodText = 'Aww, Pip looks a little sad — let us check the clue together!';
  } else if (appState.hintsUsedOnCurrent > 0) {
    mood = 'neutral';
    moodText = 'Pip fetched a helpful hint for you below!';
  }

  // SVG pet puppy face that reacts visibly to happy / sad / neutral states
  const svgHtml =
    mood === 'happy'
      ? `
      <svg width="50" height="50" viewBox="0 0 64 64" aria-hidden="true">
        <path d="M10 24 C8 12, 18 10, 22 20" fill="#d97706" />
        <path d="M54 24 C56 12, 46 10, 42 20" fill="#d97706" />
        <circle cx="32" cy="34" r="18" fill="#fbbf24" stroke="#92400e" stroke-width="2.5" />
        <path d="M23 30 Q26 25 29 30" fill="none" stroke="#1c1917" stroke-width="2.5" stroke-linecap="round" />
        <path d="M35 30 Q38 25 41 30" fill="none" stroke="#1c1917" stroke-width="2.5" stroke-linecap="round" />
        <ellipse cx="32" cy="36" rx="3.5" ry="2.5" fill="#1c1917" />
        <path d="M24 41 Q32 49 40 41" fill="none" stroke="#1c1917" stroke-width="2.5" stroke-linecap="round" />
        <path d="M30 44 Q32 50 34 44" fill="#ef4444" />
      </svg>
    `
      : mood === 'sad'
      ? `
      <svg width="50" height="50" viewBox="0 0 64 64" aria-hidden="true">
        <path d="M14 26 C6 34, 8 44, 16 38" fill="#d97706" />
        <path d="M50 26 C58 34, 56 44, 48 38" fill="#d97706" />
        <circle cx="32" cy="34" r="18" fill="#fbbf24" stroke="#92400e" stroke-width="2.5" />
        <circle cx="26" cy="31" r="2.5" fill="#1c1917" />
        <circle cx="38" cy="31" r="2.5" fill="#1c1917" />
        <path d="M23 26 L28 28" stroke="#92400e" stroke-width="2" stroke-linecap="round" />
        <path d="M41 26 L36 28" stroke="#92400e" stroke-width="2" stroke-linecap="round" />
        <ellipse cx="32" cy="36" rx="3.2" ry="2.2" fill="#1c1917" />
        <path d="M26 44 Q32 39 38 44" fill="none" stroke="#1c1917" stroke-width="2.5" stroke-linecap="round" />
      </svg>
    `
      : `
      <svg width="50" height="50" viewBox="0 0 64 64" aria-hidden="true">
        <path d="M12 24 C10 15, 18 14, 21 22" fill="#d97706" />
        <path d="M52 24 C54 15, 46 14, 43 22" fill="#d97706" />
        <circle cx="32" cy="34" r="18" fill="#fbbf24" stroke="#92400e" stroke-width="2.5" />
        <circle cx="26" cy="31" r="2.5" fill="#1c1917" />
        <circle cx="38" cy="31" r="2.5" fill="#1c1917" />
        <ellipse cx="32" cy="36" rx="3.2" ry="2.2" fill="#1c1917" />
        <path d="M27 42 Q32 45 37 42" fill="none" stroke="#1c1917" stroke-width="2.2" stroke-linecap="round" />
      </svg>
    `;

  const energyPercent = Math.min(
    100,
    Math.max(15, appState.currentLevel * 25 + Math.min(25, appState.totalQuestionsSolved * 8))
  );

  return `
    <div class="buddy-card" role="status" aria-live="polite">
      <div class="buddy-avatar ${mood === 'happy' ? 'buddy-happy' : mood === 'sad' ? 'buddy-sad' : ''}">
        ${svgHtml}
      </div>
      <div class="buddy-info">
        <div class="buddy-header">
          <span class="buddy-name">Pip (Your Study Buddy)</span>
          <span class="badge badge-accent">${LEVEL_NAMES[appState.currentLevel]}</span>
        </div>
        <p class="buddy-mood-text">${moodText}</p>
        <div class="energy-track" title="Learning Energy Meter">
          <div class="energy-fill" style="width: ${energyPercent}%;"></div>
        </div>
      </div>
    </div>
  `;
}

function renderPracticeScreen(root) {
  const q = currentQuestion;
  const hintsToShow = q.hints.slice(0, appState.hintsUsedOnCurrent);

  const hintLadderHtml =
    hintsToShow.length > 0
      ? `
      <div class="hint-ladder" aria-live="polite">
        ${hintsToShow.map((h) => `<div class="hint-item">${h}</div>`).join('')}
      </div>
    `
      : '';

  const nextHintNumber = appState.hintsUsedOnCurrent + 1;
  const hintButtonLabel =
    nextHintNumber <= PEDAGOGY_CONFIG.MAX_HINTS
      ? `Get Hint ${nextHintNumber}`
      : 'All 3 Hints Shown';

  const decisionBannerHtml =
    uiFormState.questionSolvedOrRevealed && appState.lastTutorDecision
      ? `
      <div class="feedback-box ${uiFormState.lastEvaluation && uiFormState.lastEvaluation.isCorrect ? 'feedback-ok' : 'feedback-warn'}">
        <h3>${
          uiFormState.lastEvaluation && uiFormState.lastEvaluation.isCorrect
            ? uiFormState.lastEvaluation.feedback
            : 'Answer Shown'
        }</h3>
        <p><strong>${appState.lastTutorDecision.title}</strong></p>
        <p style="margin-bottom:0.75rem;">${appState.lastTutorDecision.detail}</p>
        <button type="button" class="btn-primary" id="btn-next-question">
          Next Question →
        </button>
      </div>
    `
      : '';

  const recoveryBannerHtml = appState.inRecoveryMode
    ? `
      <div class="card-muted">
        <strong>Building Steady Confidence:</strong>
        Solve <strong>${PEDAGOGY_CONFIG.RECOVERY_STREAK_REQUIRED} questions in a row without hints</strong>
        (${appState.consecutiveUnassistedCorrect} of ${PEDAGOGY_CONFIG.RECOVERY_STREAK_REQUIRED} done)
        to move up to the next level.
      </div>
    `
    : '';

  root.innerHTML = `
    ${renderStudyBuddyHtml()}

    <div class="progress-strip">
      <span>Questions Solved: <strong>${appState.totalQuestionsSolved}</strong></span>
      <span>Retry Later List: <strong>${appState.retryQueue.length}</strong></span>
    </div>

    ${recoveryBannerHtml}

    <section class="card">
      <div class="badge-row">
        <span class="badge badge-accent">${q.formatLabel}</span>
        <span class="badge">${q.contextTitle}</span>
        ${q.isRetryItem ? '<span class="badge badge-warn">Retry Later Item</span>' : ''}
      </div>

      <h2>${q.prompt}</h2>

      ${renderQuestionInputHtml(q)}

      ${
        uiFormState.validationMessage
          ? `<div class="feedback-box feedback-err">${uiFormState.validationMessage}</div>`
          : ''
      }

      ${hintLadderHtml}

      ${
        !uiFormState.questionSolvedOrRevealed
          ? `
          <div class="btn-row">
            <button type="button" class="btn-primary" id="btn-check-answer">
              Check Answer
            </button>
            <button
              type="button"
              class="btn-secondary"
              id="btn-request-hint"
              ${appState.hintsUsedOnCurrent >= PEDAGOGY_CONFIG.MAX_HINTS ? 'disabled' : ''}
            >
              ${hintButtonLabel}
            </button>
            <button type="button" class="btn-secondary" id="btn-toggle-tool">
              ${uiFormState.toolOpen ? 'Hide Guide' : 'Guide'}
            </button>
          </div>
        `
          : ''
      }

      ${
        !uiFormState.questionSolvedOrRevealed
          ? renderTwoStepErrorRepairHtml(q, uiFormState.lastEvaluation)
          : ''
      }

      ${decisionBannerHtml}

      ${uiFormState.toolOpen ? renderTimeBridgeToolHtml() : ''}
    </section>

    <div class="card-muted">
      <div class="btn-row" style="margin-top:0;">
        <button type="button" class="btn-secondary" id="btn-pause-practice">
          Save &amp; Stop for Now
        </button>
        <button type="button" class="btn-secondary" id="btn-view-recap">
          Basic Recap
        </button>
        <button type="button" class="btn-secondary" id="btn-view-summary">
          My Progress
        </button>
      </div>
    </div>
  `;

  // Bind MCQ options
  root.querySelectorAll('[data-mcq-opt]').forEach((btn) => {
    btn.addEventListener('click', () => {
      uiFormState.selectedOptionId = btn.dataset.mcqOpt;
      uiFormState.validationMessage = null;
      render();
    });
  });

  // Bind Builder options
  root.querySelectorAll('[data-window-choice]').forEach((btn) => {
    btn.addEventListener('click', () => {
      uiFormState.windowChoice = btn.dataset.windowChoice;
      uiFormState.validationMessage = null;
      render();
    });
  });

  root.querySelectorAll('[data-verb-choice]').forEach((btn) => {
    btn.addEventListener('click', () => {
      uiFormState.verbChoice = btn.dataset.verbChoice;
      uiFormState.validationMessage = null;
      render();
    });
  });

  // Bind Explanation inputs
  const verbInput = root.querySelector('#input-corrected-verb');
  if (verbInput) {
    verbInput.addEventListener('input', (e) => {
      uiFormState.correctedVerb = e.target.value;
    });
  }
  const expInput = root.querySelector('#input-explanation-text');
  if (expInput) {
    expInput.addEventListener('input', (e) => {
      uiFormState.explanationText = e.target.value;
    });
  }

  // Bind 2-step error self-identification buttons
  root.querySelectorAll('[data-self-check]').forEach((btn) => {
    btn.addEventListener('click', () => {
      uiFormState.selfIdentifiedWindow = btn.dataset.selfCheck;
      render();
    });
  });

  // Bind Check My Answer
  const checkBtn = document.getElementById('btn-check-answer');
  if (checkBtn) {
    checkBtn.addEventListener('click', () => {
      const evalResult = evaluateLearnerResponse(q, uiFormState);
      if (!evalResult.isValid) {
        uiFormState.validationMessage = evalResult.message;
        render();
        return;
      }

      uiFormState.validationMessage = null;
      uiFormState.lastEvaluation = evalResult;

      if (evalResult.isCorrect) {
        uiFormState.questionSolvedOrRevealed = true;
        appState.totalQuestionsSolved += 1;

        const usedHintsOrRetries =
          appState.hintsUsedOnCurrent > 0 || appState.wrongAttemptsOnCurrent > 0;
        const outcomeType = usedHintsOrRetries
          ? 'SOLVED_WITH_HINTS'
          : 'SOLVED_FIRST_TRY_NO_HINTS';

        const { nextState } = applyAdaptiveDecisionRule(appState, q, outcomeType);
        appState = nextState;

        appState.attemptHistory.push({
          questionId: q.id,
          title: q.contextTitle,
          format: q.formatLabel,
          outcome: outcomeType,
          hintsUsed: appState.hintsUsedOnCurrent,
          levelAfter: appState.currentLevel
        });

        appState = saveState(appState);
        render();
      } else {
        // Learner made an error -> encourage 2-step self-identification & add to retryQueue
        appState.wrongAttemptsOnCurrent += 1;
        uiFormState.selfIdentifiedWindow = null;

        if (evalResult.tag && appState.misconceptionLog[evalResult.tag] !== undefined) {
          appState.misconceptionLog[evalResult.tag] += 1;
        }
        if (!appState.retryQueue.includes(q.id)) {
          appState.retryQueue.push(q.id);
        }
        appState = saveState(appState);
        render();
      }
    });
  }

  // Bind Progressive Hint Ladder (Hint 1 -> Hint 2 -> Hint 3 Full Reveal)
  const hintBtn = document.getElementById('btn-request-hint');
  if (hintBtn) {
    hintBtn.addEventListener('click', () => {
      if (appState.hintsUsedOnCurrent >= PEDAGOGY_CONFIG.MAX_HINTS) return;
      appState.hintsUsedOnCurrent += 1;

      // If learner reached Hint 3, the full answer is revealed (not solved by learner)
      if (appState.hintsUsedOnCurrent === PEDAGOGY_CONFIG.MAX_HINTS) {
        uiFormState.questionSolvedOrRevealed = true;
        uiFormState.lastEvaluation = {
          isCorrect: false,
          feedback: q.hints[2]
        };

        const { nextState, routeToRecap } = applyAdaptiveDecisionRule(
          appState,
          q,
          'REVEALED_BY_HINT_3'
        );
        appState = nextState;

        appState.attemptHistory.push({
          questionId: q.id,
          title: q.contextTitle,
          format: q.formatLabel,
          outcome: 'REVEALED_BY_HINT_3',
          hintsUsed: 3,
          levelAfter: appState.currentLevel
        });

        appState = saveState(appState);

        if (routeToRecap) {
          setScreen('recap');
          return;
        }
      } else {
        appState = saveState(appState);
      }
      render();
    });
  }

  // Bind Next Question
  const nextBtn = document.getElementById('btn-next-question');
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const nextQ = selectNextQuestion(appState);
      if (nextQ.isGenerated) {
        appState.generatedCounter = (appState.generatedCounter || 0) + 1;
      }
      resetUiFormForQuestion(nextQ);
      appState = saveState(appState);
      render();
    });
  }

  // Bind Time-Bridge Helper Toggle
  const toolToggleBtn = document.getElementById('btn-toggle-tool');
  if (toolToggleBtn) {
    toolToggleBtn.addEventListener('click', () => {
      uiFormState.toolOpen = !uiFormState.toolOpen;
      if (uiFormState.toolOpen) {
        appState.toolClicks += 1;
        appState = saveState(appState);
      }
      render();
    });
  }

  if (uiFormState.toolOpen) {
    bindTimeBridgeToolEvents(root);
  }

  document.getElementById('btn-pause-practice').addEventListener('click', () => {
    appState = saveState(appState);
    setScreen('welcome');
  });

  document.getElementById('btn-view-recap').addEventListener('click', () => {
    setScreen('recap');
  });

  document.getElementById('btn-view-summary').addEventListener('click', () => {
    setScreen('summary');
  });
}

// ============================================================================
// SCREEN 5: BASIC CONCEPTS RECAP (AUTO-TRIGGERED AFTER 3 CONSECUTIVE HINT-3 REVEALS)
// ============================================================================
function renderRecapScreen(root) {
  const decisionNoteHtml =
    appState.lastTutorDecision &&
    appState.lastTutorDecision.code === 'PREREQUISITE_RECAP_AND_STEP_DOWN'
      ? `
      <div class="resume-banner">
        <h3>${appState.lastTutorDecision.title}</h3>
        <p style="margin-bottom:0;">${appState.lastTutorDecision.detail}</p>
      </div>
    `
      : '';

  root.innerHTML = `
    ${decisionNoteHtml}
    <section class="card">
      <h2>Basic Concepts Recap: Closed Past vs Bridge to Right Now</h2>
      <p>
        Let us take one calm minute to review the foundation before jumping back into questions.
      </p>

      <div class="timeline-compare">
        <div class="timeline-box">
          <h3>1. Closed Past Box (Simple Past)</h3>
          <p><strong>When to use:</strong> The time is already over.</p>
          <p><strong>Clue words:</strong> <span class="highlight-time">yesterday</span>, <span class="highlight-time">last week</span>, <span class="highlight-time">two hours ago</span>, <span class="highlight-time">in 2022</span>.</p>
          <p><strong>How to form:</strong> Just use the Past Verb (<strong>V2</strong>). Never add <em>have</em> or <em>has</em>.</p>
          <p style="margin-bottom:0;"><em>Example: "We <strong>visited</strong> the market yesterday."</em></p>
        </div>

        <div class="timeline-box">
          <h3>2. Bridge to Right Now (Present Perfect)</h3>
          <p><strong>When to use:</strong> The result is still true right now.</p>
          <p><strong>Clue words:</strong> <span class="highlight-time">already</span>, <span class="highlight-time">yet</span>, <span class="highlight-time">just</span>, or a result we see <span class="highlight-time">right now</span>.</p>
          <p><strong>How to form:</strong> Use <strong>have / has + V3</strong>.</p>
          <p style="margin-bottom:0;"><em>Example: "She <strong>has lost</strong> her key, so the door is locked now."</em></p>
        </div>
      </div>

      <h3>Quick Building-Block Table: When to Use "have" vs "has" + V3</h3>
      <table class="table-clean">
        <thead>
          <tr>
            <th>Person (Subject)</th>
            <th>Helper for Present Perfect</th>
            <th>Everyday Verb (V1 → V2 → V3)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>I / We / You / They</strong></td>
            <td><strong>have</strong> + V3</td>
            <td>finish → finished → <strong>have finished</strong><br>eat → ate → <strong>have eaten</strong></td>
          </tr>
          <tr>
            <td><strong>He / She / It / One Person</strong></td>
            <td><strong>has</strong> + V3</td>
            <td>lose → lost → <strong>has lost</strong><br>go → went → <strong>has gone</strong></td>
          </tr>
        </tbody>
      </table>

      <div class="btn-row">
        <button type="button" class="btn-primary" id="btn-return-from-recap">
          I'm Ready — Return to Practice (Level ${appState.currentLevel}) →
        </button>
      </div>
    </section>
  `;

  document.getElementById('btn-return-from-recap').addEventListener('click', () => {
    const nextQ = selectNextQuestion(appState);
    resetUiFormForQuestion(nextQ);
    setScreen('practice');
  });
}

// ============================================================================
// SCREEN 6: MY PROGRESS & TUTOR SUMMARY
// ============================================================================
function renderSummaryScreen(root) {
  const historyRowsHtml =
    appState.attemptHistory.length === 0
      ? '<tr><td colspan="4">No questions completed in this session yet.</td></tr>'
      : appState.attemptHistory
          .map(
            (item, idx) => `
          <tr>
            <td>${idx + 1}. ${item.title}</td>
            <td>${item.format}</td>
            <td>${
              item.outcome === 'SOLVED_FIRST_TRY_NO_HINTS'
                ? 'Solved 1st try (0 hints)'
                : item.outcome === 'SOLVED_WITH_HINTS'
                ? `Solved with help (${item.hintsUsed} hint(s)) — queued to retry`
                : 'Revealed by Hint 3 — queued to retry'
            }</td>
            <td>Level ${item.levelAfter}</td>
          </tr>
        `
          )
          .join('');

  root.innerHTML = `
    <section class="card">
      <h2>My Learning Progress</h2>
      <div class="timeline-compare">
        <div class="timeline-box">
          <strong>Current Practice Level:</strong>
          <p style="font-size:1.1rem;font-weight:700;margin:0.25rem 0;">${LEVEL_NAMES[appState.currentLevel]}</p>
          <p style="margin-bottom:0;">Starting Level from Warm-Up: Level ${appState.profileLevel}</p>
        </div>
        <div class="timeline-box">
          <strong>Session Milestones:</strong>
          <p style="margin:0.25rem 0;">Questions Solved Independently: <strong>${appState.totalQuestionsSolved}</strong></p>
          <p style="margin:0.25rem 0;">Items Waiting in Retry Later: <strong>${appState.retryQueue.length}</strong></p>
          <p style="margin-bottom:0;">Time-Bridge Helper Uses: <strong>${appState.toolClicks}</strong></p>
        </div>
      </div>

      <h3>Common Time-Traps Practiced</h3>
      <ul>
        <li><strong>Using "have/has + V3" with a finished past time (like yesterday):</strong> ${appState.misconceptionLog.M1} time(s) spotted &amp; repaired</li>
        <li><strong>Using Simple Past when the result still matters right now:</strong> ${appState.misconceptionLog.M2} time(s) spotted &amp; repaired</li>
        <li><strong>Helper / verb form mix-ups (has vs have or V2 vs V3):</strong> ${appState.misconceptionLog.PREREQ} time(s) spotted &amp; repaired</li>
      </ul>

      <h3>Question-by-Question History</h3>
      <table class="table-clean">
        <thead>
          <tr>
            <th>Task</th>
            <th>Format</th>
            <th>How You Solved It</th>
            <th>Next Level</th>
          </tr>
        </thead>
        <tbody>
          ${historyRowsHtml}
        </tbody>
      </table>

      <div class="btn-row">
        <button type="button" class="btn-primary" id="btn-back-to-practice">
          Continue Practicing
        </button>
        <button type="button" class="btn-secondary" id="btn-pause-from-summary">
          Save &amp; Stop for Now
        </button>
      </div>
    </section>
  `;

  document.getElementById('btn-back-to-practice').addEventListener('click', () => {
    setScreen('practice');
  });

  document.getElementById('btn-pause-from-summary').addEventListener('click', () => {
    appState = saveState(appState);
    setScreen('welcome');
  });
}

// ============================================================================
// SCREEN 7: ABOUT & ADAPTIVE SYSTEM DETAILS (ID: 24b1233)
// ============================================================================
function renderAboutScreen(root) {
  root.innerHTML = `
    <section class="card">
      <h2>About TimeBridge English</h2>
      <p><strong>Student Roll Number (Identity Token):</strong> <code>${PROJECT_INFO.id}</code></p>
      <ul>
        <li><strong>Application Focus:</strong> ${PROJECT_INFO.appType}</li>
        <li><strong>Subject Topic:</strong> ${PROJECT_INFO.topic}</li>
        <li><strong>Intended Learner:</strong> ${PROJECT_INFO.learnerProfile}</li>
        <li><strong>Session Structure:</strong> ${PROJECT_INFO.sessionDesign}</li>
      </ul>

      <h3>How the Adaptive Tutor Makes Decisions</h3>
      <ol>
        <li><strong>Advance to Harder Tasks:</strong> When you answer correctly on your first try with 0 hints, the tutor advances the difficulty level (moving across Multiple Choice → Time &amp; Verb Builder → Spot &amp; Explain the Error).</li>
        <li><strong>Self-Identification Repair &amp; Retry Later Queue:</strong> When you make an error, a 2-step card helps you first spot whether the sentence describes a finished past time or connects to right now, then shows a side-by-side timeline explanation. Any question solved using Hints 1–2 (or after an error) is added to your <strong>Retry Later</strong> queue.</li>
        <li><strong>3 Consecutive Full-Answer Reveals → Basic Concepts Recap &amp; Level Step-Down:</strong> If you cannot solve 3 questions in a row and must use Hint 3 (which reveals the full answer), the tutor automatically opens the <strong>Basic Concepts Recap</strong>, lowers the difficulty level by 1, and waits for <strong>2 consecutive unassisted correct answers</strong> before advancing back to a higher level.</li>
      </ol>
    </section>

    <section class="card">
      <h3>Question Generation &amp; Explanation Evaluation Engine</h3>
      <p><strong>1. ${AI_FUNCTIONALITY_SPEC.feature1.name}:</strong> ${AI_FUNCTIONALITY_SPEC.feature1.whatItDoes}</p>
      <pre style="white-space:pre-wrap;font-size:0.82rem;background:var(--surface-muted);padding:0.75rem;border-radius:4px;border:1px solid var(--border);">${AI_FUNCTIONALITY_SPEC.feature1.sampleInputPrompt}</pre>
      <p><strong>Output Verification &amp; Offline Fallback:</strong> ${AI_FUNCTIONALITY_SPEC.feature1.verificationCheck} ${AI_FUNCTIONALITY_SPEC.feature1.fallbackBehaviour}</p>

      <p><strong>2. ${AI_FUNCTIONALITY_SPEC.feature2.name}:</strong> ${AI_FUNCTIONALITY_SPEC.feature2.whatItDoes}</p>
      <pre style="white-space:pre-wrap;font-size:0.82rem;background:var(--surface-muted);padding:0.75rem;border-radius:4px;border:1px solid var(--border);">${AI_FUNCTIONALITY_SPEC.feature2.sampleInputPrompt}</pre>
      <p style="margin-bottom:0;"><strong>Output Verification &amp; Offline Fallback:</strong> ${AI_FUNCTIONALITY_SPEC.feature2.verificationCheck} ${AI_FUNCTIONALITY_SPEC.feature2.fallbackBehaviour}</p>
    </section>
  `;
}

// ============================================================================
// MAIN RENDER & GLOBAL BINDINGS
// ============================================================================
function render() {
  updateHeaderStatus();
  const root = document.getElementById('app-root');
  if (!root) return;

  if (appState.currentScreen === 'welcome') {
    renderWelcomeScreen(root);
  } else if (appState.currentScreen === 'briefing') {
    renderBriefingScreen(root);
  } else if (appState.currentScreen === 'practice') {
    renderPracticeScreen(root);
  } else if (appState.currentScreen === 'recap') {
    renderRecapScreen(root);
  } else if (appState.currentScreen === 'summary') {
    renderSummaryScreen(root);
  } else {
    renderAboutScreen(root);
  }
}

document.querySelectorAll('.nav-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    setScreen(btn.dataset.nav);
  });
});

const footerAboutBtn = document.getElementById('footer-about-btn');
if (footerAboutBtn) {
  footerAboutBtn.addEventListener('click', () => {
    setScreen('about');
  });
}

const themeToggleBtn = document.getElementById('btn-theme-toggle');
if (themeToggleBtn) {
  themeToggleBtn.addEventListener('click', () => {
    applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
  });
}

applyTheme(currentTheme);
render();
