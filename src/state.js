// src/state.js
// Manages the single learner state object and localStorage persistence for C4 (stop & resume)

export const STORAGE_KEY = 'et617_24b1233_p4_state';
export const TARGET_SESSION_STEPS = 5;

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
    currentStepIndex: 0,
    totalStepsCompleted: 0,
    hintsUsedOnCurrent: 0,
    consecutiveHint3Reveals: 0,
    consecutiveUnassistedCorrect: 0,
    inRecoveryMode: false,
    retryQueue: [],
    misconceptionLog: { M1: 0, M2: 0, PREREQ: 0 },
    attemptHistory: []
  };
}

export function loadState() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return createInitialState();
    const parsed = JSON.parse(raw);
    return { ...createInitialState(), ...parsed };
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
