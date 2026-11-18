// src/app.js
// Slice 1: Shell, C4 Stop & Resume without countdown pressure, Screen 1 (Welcome), Screen 2 (Conversational Briefing & Diagnostic), and About (24b1233)

import { loadState, saveState, clearSavedState, TARGET_SESSION_STEPS } from './state.js';
import { EXAM_CARD, DIAGNOSTIC_QUESTIONS, MISCONCEPTIONS } from './content.js';

let appState = loadState();

function setScreen(screenName) {
  appState.currentScreen = screenName;
  appState = saveState(appState);
  render();
}

function updateHeaderStatus() {
  const pill = document.getElementById('session-status-bar');
  if (!pill) return;
  const levelLabel = `Level ${appState.currentLevel}`;
  const stepLabel = `Step ${appState.totalStepsCompleted} of ${TARGET_SESSION_STEPS}`;
  pill.textContent = `C4 Bite-Sized Lesson · ${stepLabel} · ${levelLabel}`;

  document.querySelectorAll('.nav-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.nav === appState.currentScreen);
  });
}

function renderWelcomeScreen(root) {
  const hasSavedProgress =
    appState.hasActiveSession &&
    (appState.diagnosticCompleted || Object.keys(appState.diagnosticAnswers).length > 0 || appState.totalStepsCompleted > 0);

  const resumeBannerHtml = hasSavedProgress
    ? `
      <div class="resume-banner" role="region" aria-label="Saved session found">
        <h3>Saved Lesson Found (C4 Stop &amp; Resume)</h3>
        <p>
          You last paused at <strong>${appState.lastSavedAt || 'earlier today'}</strong>
          (Level ${appState.currentLevel}, Step ${appState.totalStepsCompleted} of ${TARGET_SESSION_STEPS}).
          Because this session is designed for short evening breaks, there is no timer pressure.
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
      <h2>Welcome, Movie-Dialogue English Explorer!</h2>
      <p>
        Have you ever watched an English action movie on TV and wondered why characters sometimes say
        <span class="highlight-verb">I lost the key</span> and other times say
        <span class="highlight-verb">I have lost the key</span>?
      </p>
      <p>
        In this short, pressure-free <strong>5-step lesson (~8 minutes, C4)</strong>, let us master how English connects past actions to what is happening right now.
        If your father needs the phone back at any moment, tap <strong>Save &amp; Stop for Now</strong> and pick up right where you left off.
      </p>
      <div class="btn-row">
        <button type="button" class="btn-primary" id="btn-start-briefing">
          Start Concept &amp; Quick Diagnostic
        </button>
      </div>
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
      render();
    });
  }

  document.getElementById('btn-start-briefing').addEventListener('click', () => {
    setScreen('briefing');
  });
}

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
        <h3>Diagnostic Question ${idx + 1} of ${DIAGNOSTIC_QUESTIONS.length}</h3>
        <p>${q.prompt}</p>
        <div class="option-list">${optionsHtml}</div>
        ${feedbackHtml}
      </div>
    `;
  }).join('');

  const allAnswered = DIAGNOSTIC_QUESTIONS.every((q) => Boolean(appState.diagnosticAnswers[q.id]));

  root.innerHTML = `
    <section class="card">
      <h2>Let Us Picture Time as Two Movie Frames</h2>
      <p>
        When we speak English, let us ask one simple question:
        <strong>Is the time period closed, or does the action still touch right now?</strong>
      </p>

      <div class="cue-box">
        <span class="cue-label">First · The Closed Yesterday Box (Simple Past — V2)</span>
        <p>
          When the sentence gives a <strong>finished past time</strong> like
          <span class="highlight-time">yesterday</span>, <span class="highlight-time">last night</span>, or
          <span class="highlight-time">two hours ago</span>, that movie scene is closed.
          We use <strong>Simple Past</strong>:
          <em>"We <span class="highlight-verb">watched</span> the movie <span class="highlight-time">last night</span>."</em>
        </p>
      </div>

      <div class="cue-box">
        <span class="cue-label">Second · The Bridge to NOW (Present Perfect — have / has + V3)</span>
        <p>
          When a past action has a <strong>result that we can still see right now</strong> (or uses words like
          <span class="highlight-time">already</span>, <span class="highlight-time">yet</span>, or
          <span class="highlight-time">just</span>), we build a bridge to the present using
          <strong>have / has + V3</strong>:
          <em>"The hero <span class="highlight-verb">has lost</span> his key, so the door is still locked <span class="highlight-time">now</span>."</em>
        </p>
      </div>

      <div class="cue-box">
        <span class="cue-label">Third · Our Two Common Traps to Avoid</span>
        <p>
          <strong>Trap M1:</strong> Never mix <span class="highlight-verb">have / has + V3</span> with a finished time like <span class="highlight-time">yesterday</span>.<br>
          <strong>Trap M2:</strong> Do not use Simple Past when the sentence is explaining what is true <span class="highlight-time">right now</span>.
        </p>
      </div>
    </section>

    <section class="card-muted">
      <h2>Quick 2-Scene Profile Check (Sets Your Starting Level)</h2>
      <p>Try these two short movie scenes so we can pick the right starting level for you.</p>
    </section>

    ${diagHtml}

    <div class="card">
      <div class="btn-row">
        <button type="button" class="btn-primary" id="btn-finish-diag" ${allAnswered ? '' : 'disabled'}>
          ${allAnswered ? 'Continue to Adaptive Practice →' : 'Answer both scenes above to continue'}
        </button>
        <button type="button" class="btn-secondary" id="btn-save-pause">
          Save &amp; Stop for Now (C4)
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

function renderPracticePlaceholder(root) {
  root.innerHTML = `
    <section class="card">
      <h2>Adaptive Practice Workspace (Level ${appState.currentLevel})</h2>
      <p>
        Your profile diagnostic placed you at <strong>Level ${appState.currentLevel}</strong>.
        Slice 2 adds the 3-format adaptive question engine, the 3-step progressive hint ladder, and the Time-Bridge tool.
      </p>
      <div class="btn-row">
        <button type="button" class="btn-secondary" id="btn-back-home">
          Save &amp; Stop for Now (Return to Home)
        </button>
      </div>
    </section>
  `;
  document.getElementById('btn-back-home').addEventListener('click', () => {
    setScreen('welcome');
  });
}

function renderAboutScreen(root) {
  root.innerHTML = `
    <section class="card">
      <h2>About This Application &amp; Exam Card</h2>
      <p><strong>Identity Token (Roll Number):</strong> <code>${EXAM_CARD.id}</code></p>
      <ul>
        <li><strong>Problem Statement (P):</strong> ${EXAM_CARD.problem}</li>
        <li><strong>Topic (T):</strong> ${EXAM_CARD.topic}</li>
        <li><strong>Learner Context (L):</strong> ${EXAM_CARD.learnerContext}</li>
        <li><strong>Design Constraint (C):</strong> ${EXAM_CARD.constraint}</li>
      </ul>
      <h3>Target Misconceptions Diagnosed</h3>
      <p><strong>${MISCONCEPTIONS.M1.title}:</strong> ${MISCONCEPTIONS.M1.shortRule}</p>
      <p><strong>${MISCONCEPTIONS.M2.title}:</strong> ${MISCONCEPTIONS.M2.shortRule}</p>
    </section>
  `;
}

function render() {
  updateHeaderStatus();
  const root = document.getElementById('app-root');
  if (!root) return;

  if (appState.currentScreen === 'welcome') {
    renderWelcomeScreen(root);
  } else if (appState.currentScreen === 'briefing') {
    renderBriefingScreen(root);
  } else if (appState.currentScreen === 'practice') {
    renderPracticePlaceholder(root);
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

render();
