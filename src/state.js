// src/state.js
// Manages the single learner state object and localStorage persistence

export const STORAGE_KEY = 'et617_24b1233_p4_state';
export const THEME_KEY = 'et617_24b1233_theme';

export function createInitialState() {
  return {
    identityToken: '24b1233',
    currentScreen: 'welcome',
    hasActiveSession: false,
    lastSavedAt: null,
    diagnosticCompleted: false,
    diagnosticAnswers: {},
    profileLevel: 1,
    currentLevel: 1,
    currentQuestionId: 'Q1-MARKET',
    seenQuestionIds: [],
    totalQuestionsSolved: 0,
    hintsUsedOnCurrent: 0,
    wrongAttemptsOnCurrent: 0,
    consecutiveHint3Reveals: 0,
    consecutiveUnassistedCorrect: 0,
    inRecoveryMode: false,
    recapTriggeredCount: 0,
    generatedCounter: 0,
    toolClicks: 0,
    toolState: {
      subject: 'My mother',
      verbBase: 'buy',
      timeMode: 'closed_past'
    },
    retryQueue: [],
    misconceptionLog: { M1: 0, M2: 0, PREREQ: 0 },
    lastTutorDecision: null,
    attemptHistory: []
  };
}

export function loadState() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return createInitialState();
    const parsed = JSON.parse(raw);
    return {
      ...createInitialState(),
      ...parsed,
      misconceptionLog: { ...createInitialState().misconceptionLog, ...(parsed.misconceptionLog || {}) },
      toolState: { ...createInitialState().toolState, ...(parsed.toolState || {}) }
    };
  } catch (err) {
    return createInitialState();
  }
}

export function saveState(state) {
  try {
    const updated = {
      ...state,
      hasActiveSession: true,
      lastSavedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    return state;
  }
}

export function clearSavedState() {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    // ignore storage errors
  }
  return createInitialState();
}

export function loadTheme() {
  try {
    return window.localStorage.getItem(THEME_KEY) || 'light';
  } catch (err) {
    return 'light';
  }
}

export function saveTheme(theme) {
  try {
    window.localStorage.setItem(THEME_KEY, theme);
  } catch (err) {
    // ignore
  }
}
