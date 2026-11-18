// src/content.js
// Learning content for P4-T7 (Simple Past vs Present Perfect ESL) tailored to Persona Aarav (L1)

export const EXAM_CARD = {
  id: '24b1233',
  problem: 'P4 — Adaptive tutor with automatic question generation',
  topic: 'P4-T7 — English tenses: simple past vs present perfect (ESL)',
  learnerContext: 'L1 — Class 6–8 rural government school student, regional medium, uses father\'s Android phone ~30 min in evening',
  constraint: 'C4 — 10-minute sessions (bite-sized 5-step sequence; stop and resume anytime without countdown stress)'
};

export const MISCONCEPTIONS = {
  M1: {
    code: 'M1',
    title: 'Misconception M1: Using "have/has + V3" with a Closed Past Time',
    shortRule: 'When a sentence names a finished past time (like yesterday, last night, or two hours ago), the time box is closed. Use Simple Past (V2), never have/has + V3.'
  },
  M2: {
    code: 'M2',
    title: 'Misconception M2: Using Simple Past (V2) when the Action Touches NOW',
    shortRule: 'When an action still changes what is happening right now (or uses already, yet, just, since), we need a bridge to the present: use Present Perfect (have/has + V3).'
  }
};

export const DIAGNOSTIC_QUESTIONS = [
  {
    id: 'DIAG-1',
    prompt: 'Scene 1: Yesterday evening, Aarav and his father ___ an English action movie on TV.',
    timeCue: 'Yesterday evening',
    options: [
      { id: 'a', text: 'watched', isCorrect: true, tag: 'CORRECT', feedback: 'Spot on! "Yesterday evening" is a finished time box, so we use Simple Past (watched).' },
      { id: 'b', text: 'have watched', isCorrect: false, tag: 'M1', feedback: 'Careful (M1): "Yesterday evening" is already over. We do not use "have watched" with a closed past time.' },
      { id: 'c', text: 'has watched', isCorrect: false, tag: 'PREREQ', feedback: 'Note: "Aarav and his father" is plural, and "yesterday evening" is a closed past time, so we use "watched".' }
    ]
  },
  {
    id: 'DIAG-2',
    prompt: 'Scene 2: Look at the TV right now! The electricity ___ off, so the screen is completely black now.',
    timeCue: 'right now / screen is black now',
    options: [
      { id: 'a', text: 'has gone', isCorrect: true, tag: 'CORRECT', feedback: 'Great job! Because the TV screen is black right now, "has gone" connects the past action to the present result.' },
      { id: 'b', text: 'went', isCorrect: false, tag: 'M2', feedback: 'Notice the bridge to NOW (M2): the screen is black right now. Present Perfect ("has gone") shows that the result still holds now.' },
      { id: 'c', text: 'have went', isCorrect: false, tag: 'PREREQ', feedback: 'Prerequisite check: After has/have we need V3 ("gone", not "went"), and "electricity" takes singular "has".' }
    ]
  }
];
