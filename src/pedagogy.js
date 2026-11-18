// src/pedagogy.js
// Pure pedagogical engine (no DOM calls):
// - Evaluates 3 question formats (MCQ, Time & Verb Builder, Open Explanation)
// - Manages 3-step progressive hint ladder (3rd hint reveals full answer)
// - Executes the 3-way adaptive decision rule:
//     1) 1st-try correct with 0 hints -> advance level (or progress 2-correct recovery streak)
//     2) Solved with Hints 1-2 OR error made -> queue for Retry Later + 2-step self-identification repair
//     3) 3 consecutive Hint-3 full answer reveals (not solved by learner) -> show Basic Concepts Recap,
//        decrease student level by 1, and require 2 consecutive unassisted correct answers before leveling up

import { PRACTICE_QUESTION_BANK, generateDynamicQuestion } from './content.js';

export const PEDAGOGY_CONFIG = {
  MAX_HINTS: 3,
  REVEALS_BEFORE_RECAP: 3,
  RECOVERY_STREAK_REQUIRED: 2
};

export function evaluateLearnerResponse(question, userInput) {
  if (question.format === 'mcq') {
    const selected = question.options.find((o) => o.id === userInput.selectedOptionId);
    if (!selected) {
      return { isValid: false, message: 'Please choose an answer option first.' };
    }
    if (selected.isCorrect) {
      return {
        isValid: true,
        isCorrect: true,
        tag: 'CORRECT',
        feedback: `Correct! "${selected.text}" fits because "${question.timeCue}" matches this time frame.`
      };
    }
    return {
      isValid: true,
      isCorrect: false,
      tag: selected.tag || question.focusArea,
      feedback: `Let us check the time clue "${question.timeCue}" before we lock in the answer.`
    };
  }

  if (question.format === 'builder') {
    const { windowChoice, verbChoice } = userInput;
    if (!windowChoice || !verbChoice) {
      return { isValid: false, message: 'Please select both the Time Frame and the Verb Phrase.' };
    }
    const windowOk = windowChoice === question.correctWindowChoice;
    const verbOk = verbChoice === question.correctVerbChoice;

    if (windowOk && verbOk) {
      return {
        isValid: true,
        isCorrect: true,
        tag: 'CORRECT',
        feedback: `Great building! You matched the right time frame and chose "${question.correctVerbChoice}".`
      };
    }

    const detectedTag = !windowOk ? question.focusArea : 'PREREQ';
    return {
      isValid: true,
      isCorrect: false,
      tag: detectedTag,
      feedback: !windowOk
        ? `Check Step 1 first: look at "${question.timeCue}" to see if the time is already finished or connected to right now.`
        : `You picked the right time frame, now check which verb form matches it.`
    };
  }

  if (question.format === 'explanation') {
    const verbText = (userInput.correctedVerb || '').trim().toLowerCase();
    const reasonText = (userInput.explanationText || '').trim().toLowerCase();

    if (!verbText || !reasonText) {
      return {
        isValid: false,
        message: 'Please fill in both the corrected verb and your one-sentence explanation.'
      };
    }

    const verbMatches = question.acceptedVerbs.some((v) => verbText === v.toLowerCase() || verbText.includes(v.toLowerCase()));
    const mentionsConcept = question.requiredConceptKeywords.some((kw) => reasonText.includes(kw.toLowerCase()));
    const wordCount = reasonText.split(/\s+/).filter(Boolean).length;

    if (verbMatches && mentionsConcept && wordCount >= 3) {
      return {
        isValid: true,
        isCorrect: true,
        tag: 'CORRECT',
        feedback: `Excellent explanation! You identified the verb "${question.correctAnswerText}" and explained the time rule clearly. Model answer: ${question.modelExplanation}`
      };
    }

    if (verbMatches && !mentionsConcept) {
      return {
        isValid: true,
        isCorrect: false,
        tag: question.focusArea,
        feedback: `Your verb "${question.correctAnswerText}" is right! Now make sure your explanation mentions why the time clue ("${question.timeCue}") is finished in the past or connected to right now.`
      };
    }

    return {
      isValid: true,
      isCorrect: false,
      tag: question.focusArea,
      feedback: `Look closely at the time clue "${question.timeCue}". Ask whether that time is already finished or still happening right now.`
    };
  }

  return { isValid: false, message: 'Unknown question format.' };
}

export function applyAdaptiveDecisionRule(state, question, outcomeType) {
  // outcomeType: 'SOLVED_FIRST_TRY_NO_HINTS' | 'SOLVED_WITH_HINTS' | 'REVEALED_BY_HINT_3'
  const next = {
    ...state,
    retryQueue: [...state.retryQueue],
    seenQuestionIds: [...state.seenQuestionIds]
  };

  if (!next.seenQuestionIds.includes(question.id)) {
    next.seenQuestionIds.push(question.id);
  }

  // Remove from retryQueue if it was a retry item and the learner just solved it without Hint-3 reveal
  if (outcomeType === 'SOLVED_FIRST_TRY_NO_HINTS' || outcomeType === 'SOLVED_WITH_HINTS') {
    next.retryQueue = next.retryQueue.filter((qId) => qId !== question.id);
  }

  // CASE 1: Learner gets it right on the first try with 0 hints
  if (outcomeType === 'SOLVED_FIRST_TRY_NO_HINTS') {
    next.consecutiveHint3Reveals = 0;
    next.consecutiveUnassistedCorrect += 1;

    if (next.inRecoveryMode) {
      if (next.consecutiveUnassistedCorrect >= PEDAGOGY_CONFIG.RECOVERY_STREAK_REQUIRED) {
        next.inRecoveryMode = false;
        next.consecutiveUnassistedCorrect = 0;
        const oldLevel = next.currentLevel;
        next.currentLevel = Math.min(3, next.currentLevel + 1);
        next.lastTutorDecision = {
          code: 'HARDER_AFTER_RECOVERY',
          title: 'Confidence Rebuilt — Moving Up a Level!',
          detail: `You solved ${PEDAGOGY_CONFIG.RECOVERY_STREAK_REQUIRED} questions in a row without hints after your recap. You have advanced from Level ${oldLevel} to Level ${next.currentLevel}.`
        };
      } else {
        const remaining = PEDAGOGY_CONFIG.RECOVERY_STREAK_REQUIRED - next.consecutiveUnassistedCorrect;
        next.lastTutorDecision = {
          code: 'RECOVERY_PROGRESS',
          title: 'Great Unassisted Answer — Building Steady Confidence',
          detail: `You solved this on your first try without hints (${next.consecutiveUnassistedCorrect} of ${PEDAGOGY_CONFIG.RECOVERY_STREAK_REQUIRED}). Solve ${remaining} more without hints to move up to the next level.`
        };
      }
    } else {
      const oldLevel = next.currentLevel;
      next.currentLevel = Math.min(3, next.currentLevel + 1);
      next.lastTutorDecision = {
        code: 'HARDER_QUESTION',
        title: oldLevel < next.currentLevel ? `Advancing from Level ${oldLevel} to Level ${next.currentLevel}!` : 'Staying at Top Challenge Level (Level 3)',
        detail: 'Because you solved this on your first try with zero hints, the tutor is giving you a more challenging task next.'
      };
    }

    return { nextState: next, routeToRecap: false };
  }

  // CASE 2: Learner solved the question after taking Hints 1 or 2 (or after self-identifying an error)
  if (outcomeType === 'SOLVED_WITH_HINTS') {
    next.consecutiveHint3Reveals = 0;
    next.consecutiveUnassistedCorrect = 0;

    if (!next.retryQueue.includes(question.id)) {
      next.retryQueue.push(question.id);
    }

    next.lastTutorDecision = {
      code: 'QUEUED_FOR_RETRY',
      title: 'Saved to "Retry Later" List',
      detail: 'You solved this with the help of hints! We have saved this question to your Retry Later list so you can try it again on your own in a moment.'
    };

    return { nextState: next, routeToRecap: false };
  }

  // CASE 3: Learner could not get the answer and had to take up to Hint 3 (full answer revealed)
  if (outcomeType === 'REVEALED_BY_HINT_3') {
    next.consecutiveUnassistedCorrect = 0;
    next.consecutiveHint3Reveals += 1;

    if (!next.retryQueue.includes(question.id)) {
      next.retryQueue.push(question.id);
    }

    if (next.consecutiveHint3Reveals >= PEDAGOGY_CONFIG.REVEALS_BEFORE_RECAP) {
      const oldLevel = next.currentLevel;
      next.currentLevel = Math.max(1, next.currentLevel - 1);
      next.inRecoveryMode = true;
      next.consecutiveHint3Reveals = 0;
      next.recapTriggeredCount = (next.recapTriggeredCount || 0) + 1;

      next.lastTutorDecision = {
        code: 'PREREQUISITE_RECAP_AND_STEP_DOWN',
        title: 'Time for a Quick Basic Concepts Recap',
        detail: `Because 3 questions in a row needed all 3 hints to reveal the answer, let us pause for a clear recap of the basics. We have adjusted your practice from Level ${oldLevel} to Level ${next.currentLevel}, and after 2 unassisted correct answers you will advance again.`
      };

      return { nextState: next, routeToRecap: true };
    }

    const leftBeforeRecap = PEDAGOGY_CONFIG.REVEALS_BEFORE_RECAP - next.consecutiveHint3Reveals;
    next.lastTutorDecision = {
      code: 'HINT3_REVEAL_QUEUED',
      title: 'Answer Revealed & Queued for Retry Later',
      detail: `Hint 3 revealed the full answer, so this question is kept in your Retry Later list (${next.consecutiveHint3Reveals} of ${PEDAGOGY_CONFIG.REVEALS_BEFORE_RECAP} consecutive reveals; ${leftBeforeRecap} more in a row will open a Basic Concepts Recap).`
    };

    return { nextState: next, routeToRecap: false };
  }

  return { nextState: next, routeToRecap: false };
}

export function selectNextQuestion(state) {
  // 1. If retryQueue has an item that is not the exact item just completed, serve it after at least 1 other question
  if (state.retryQueue.length > 0) {
    const candidateRetryId = state.retryQueue.find((id) => id !== state.currentQuestionId) || state.retryQueue[0];
    const fromBank = PRACTICE_QUESTION_BANK.find((q) => q.id === candidateRetryId);
    if (fromBank && (state.retryQueue.length > 1 || state.currentQuestionId !== fromBank.id)) {
      return { ...fromBank, isRetryItem: true };
    }
  }

  // 2. Pick an unseen question matching currentLevel
  const levelPool = PRACTICE_QUESTION_BANK.filter(
    (q) => q.level === state.currentLevel && !state.seenQuestionIds.includes(q.id)
  );
  if (levelPool.length > 0) {
    return levelPool[0];
  }

  // 3. Pick any unseen question from the bank
  const anyUnseen = PRACTICE_QUESTION_BANK.find((q) => !state.seenQuestionIds.includes(q.id));
  if (anyUnseen) {
    return anyUnseen;
  }

  // 4. If there is still a retry item waiting, serve it now
  if (state.retryQueue.length > 0) {
    const retryQ = PRACTICE_QUESTION_BANK.find((q) => q.id === state.retryQueue[0]);
    if (retryQ) return { ...retryQ, isRetryItem: true };
  }

  // 5. Otherwise dynamically generate a fresh everyday question at currentLevel targeting the learner's most common gap
  const focus = (state.misconceptionLog.M2 || 0) > (state.misconceptionLog.M1 || 0) ? 'M2' : 'M1';
  const genCount = (state.generatedCounter || 0) + 1;
  return generateDynamicQuestion(state.currentLevel, focus, genCount);
}

// Deliverable D6: AI Functionality Specification (Prompt, Input, Output Check, and Offline Fallback)
export const AI_FUNCTIONALITY_SPEC = {
  feature1: {
    name: 'Adaptive Everyday Question Generator',
    whatItDoes: 'Generates a context-appropriate ESL question (Simple Past vs Present Perfect) matched to the learner\'s current difficulty level (1-3), question format (MCQ, Time & Verb Builder, or Spot & Explain), and most recent misconception.',
    sampleInputPrompt: `System: You are an ESL pedagogical item generator for Class 6-8 Indian students.
Input JSON: { "learnerLevel": 2, "targetMisconception": "M1_present_perfect_with_finished_past_time", "format": "builder", "contextDomain": "everyday_home_or_school" }
Task: Output strict JSON with fields { "prompt", "timeCue", "expectedWindow", "correctVerbChoice", "verbChoices", "hints": [h1, h2, h3], "selfCheckPrompt" }.`,
    verificationCheck: 'Before displaying to the learner, the validator checks that (1) all 3 progressive hints exist, (2) correctVerbChoice appears in verbChoices, and (3) sentences are <= 20 words with familiar everyday vocabulary.',
    fallbackBehaviour: 'When offline or when no external API key is configured, the deterministic template generator (generateDynamicQuestion in src/content.js) synthesizes verified everyday items from parameterized subject-verb-time matrices.'
  },
  feature2: {
    name: 'Open Explanation & Misconception Evaluator (Format 3)',
    whatItDoes: 'Evaluates the learner\'s corrected verb and 1-sentence free-text explanation in Level 3 tasks to check whether they correctly identified why the time window is finished or connected to right now.',
    sampleInputPrompt: `System: Evaluate the student's 1-sentence grammar explanation.
Input JSON: { "flawedSentence": "I have visited my grandmother's village last Sunday.", "studentVerb": "visited", "studentExplanation": "Because last Sunday is already finished in the past." }
Task: Return JSON { "verbCorrect": true, "conceptUnderstood": true, "misconceptionDetected": null, "encouragingFeedback": "..." }.`,
    verificationCheck: 'Checks that the returned feedback is non-empty, matches the ground-truth verb key, and never marks a valid synonym explanation wrong.',
    fallbackBehaviour: 'Deterministic semantic-keyword & verb-form rule engine (evaluateLearnerResponse in src/pedagogy.js) checks acceptedVerbs + requiredConceptKeywords with instant feedback.'
  }
};
