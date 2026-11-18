// src/content.js
// Everyday ESL learning content for Simple Past vs Present Perfect across 3 question formats

export const PROJECT_INFO = {
  id: '24b1233',
  appType: 'Adaptive English Tutor with Automatic Question Generation',
  topic: 'English Tenses: Simple Past vs Present Perfect (ESL)',
  learnerProfile: 'Class 6–8 student in a rural government school (regional-language medium), practicing on a parent\'s Android phone for short evening sessions',
  sessionDesign: 'Short, self-contained 10-minute learning sequences with instant stop-and-resume support'
};

export const LEVEL_NAMES = {
  1: 'Level 1 · Guided Everyday Sentences',
  2: 'Level 2 · Building & Comparing Time',
  3: 'Level 3 · Explain & Fix Real Conversations'
};

export const VERB_STUDIO_BANK = [
  { base: 'buy', past: 'bought', participle: 'bought', exampleObj: 'fresh tomatoes' },
  { base: 'rain', past: 'rained', participle: 'rained', exampleObj: 'heavily outside' },
  { base: 'arrive', past: 'arrived', participle: 'arrived', exampleObj: 'at the bus stop' },
  { base: 'win', past: 'won', participle: 'won', exampleObj: 'the cricket match' },
  { base: 'eat', past: 'ate', participle: 'eaten', exampleObj: 'my lunch' },
  { base: 'repair', past: 'repaired', participle: 'repaired', exampleObj: 'the bicycle chain' },
  { base: 'visit', past: 'visited', participle: 'visited', exampleObj: 'my grandmother\'s village' },
  { base: 'lose', past: 'lost', participle: 'lost', exampleObj: 'the reading glasses' },
  { base: 'submit', past: 'submitted', participle: 'submitted', exampleObj: 'our science notebook' },
  { base: 'finish', past: 'finished', participle: 'finished', exampleObj: 'my school homework' },
  { base: 'clean', past: 'cleaned', participle: 'cleaned', exampleObj: 'the courtyard' },
  { base: 'go', past: 'went', participle: 'gone', exampleObj: 'to the market' },
  { base: 'watch', past: 'watched', participle: 'watched', exampleObj: 'an English film on TV' }
];

export const DIAGNOSTIC_QUESTIONS = [
  {
    id: 'DIAG-1',
    prompt: 'Yesterday evening, Rohan and his sister ___ their school homework before dinner.',
    timeCue: 'Yesterday evening',
    options: [
      {
        id: 'a',
        text: 'finished',
        isCorrect: true,
        tag: 'CORRECT',
        feedback: 'Well done! "Yesterday evening" is a finished time in the past, so we use "finished".'
      },
      {
        id: 'b',
        text: 'have finished',
        isCorrect: false,
        tag: 'M1',
        feedback: 'Look at "Yesterday evening": that time is completely over. We do not use "have finished" with a finished past time word.'
      },
      {
        id: 'c',
        text: 'has finished',
        isCorrect: false,
        tag: 'PREREQ',
        feedback: '"Rohan and his sister" is more than one person, and "yesterday evening" is already over, so we use "finished".'
      }
    ]
  },
  {
    id: 'DIAG-2',
    prompt: 'Look! Meena ___ the front door key, so she cannot open the lock right now.',
    timeCue: 'cannot open the lock right now',
    options: [
      {
        id: 'a',
        text: 'has lost',
        isCorrect: true,
        tag: 'CORRECT',
        feedback: 'Spot on! Because she still cannot open the lock right now, "has lost" connects the past action to this moment.'
      },
      {
        id: 'b',
        text: 'lost',
        isCorrect: false,
        tag: 'M2',
        feedback: 'Notice the second half: "she cannot open the lock right now." When the result still matters now, we use "has lost".'
      },
      {
        id: 'c',
        text: 'have lost',
        isCorrect: false,
        tag: 'PREREQ',
        feedback: 'For one person (Meena / she), we use "has lost" rather than "have lost".'
      }
    ]
  }
];

export const PRACTICE_QUESTION_BANK = [
  // LEVEL 1 — Format 1 (Context Multiple Choice) & Format 2 (Guided Builder)
  {
    id: 'Q1-MARKET',
    level: 1,
    format: 'mcq',
    formatLabel: 'Multiple Choice',
    focusArea: 'M1',
    expectedWindow: 'closed_past',
    contextTitle: 'At the Weekly Market',
    prompt: 'My mother ___ fresh tomatoes from the village market yesterday morning.',
    timeCue: 'yesterday morning',
    correctAnswerText: 'bought',
    options: [
      { id: 'a', text: 'bought', isCorrect: true, tag: 'CORRECT' },
      { id: 'b', text: 'has bought', isCorrect: false, tag: 'M1' },
      { id: 'c', text: 'have bought', isCorrect: false, tag: 'PREREQ' }
    ],
    hints: [
      'Hint 1: Look at the words "yesterday morning" at the end of the sentence. Is yesterday morning still happening, or is it already over?',
      'Hint 2: Because "yesterday morning" is finished, use the past form of "buy" without "has" or "have".',
      'Hint 3: The answer is "bought". We say: "My mother bought fresh tomatoes yesterday morning."'
    ],
    selfCheckPrompt: 'Look at the words "yesterday morning" in this sentence. What kind of time does it show?',
    selfCheckCorrectWindow: 'closed_past',
    contrastChosenText: 'Using "has bought" tries to connect the action to right now, which clashes with "yesterday morning".',
    contrastTargetText: '"Yesterday morning" is a closed box in the past. Simple Past ("bought") fits any finished past time.'
  },
  {
    id: 'Q2-RAIN',
    level: 1,
    format: 'mcq',
    formatLabel: 'Multiple Choice',
    focusArea: 'M2',
    expectedWindow: 'bridge_now',
    contextTitle: 'Walking Outside After Rain',
    prompt: 'Look at the wet road outside! It ___ just ___, so the puddles are still full of water now.',
    timeCue: 'just / puddles are still full now',
    correctAnswerText: 'has just rained',
    options: [
      { id: 'a', text: 'has just rained', isCorrect: true, tag: 'CORRECT' },
      { id: 'b', text: 'rained', isCorrect: false, tag: 'M2' },
      { id: 'c', text: 'have just rained', isCorrect: false, tag: 'PREREQ' }
    ],
    hints: [
      'Hint 1: The speaker says "Look at the wet road outside!" and "puddles are still full of water now." This connects to right now.',
      'Hint 2: When we can see the result right now (with "It"), we use "has + just + rained".',
      'Hint 3: The answer is "has just rained". It connects the recent rain to the wet road we see right now.'
    ],
    selfCheckPrompt: 'Why does the speaker tell us that the puddles are still full of water right now?',
    selfCheckCorrectWindow: 'bridge_now',
    contrastChosenText: 'Simple Past treats the rain as a separate past story, missing the connection to the wet road right now.',
    contrastTargetText: 'Present Perfect ("has just rained") builds a bridge from the rain to the wet road we see right now.'
  },
  {
    id: 'Q3-BUS',
    level: 1,
    format: 'builder',
    formatLabel: 'Time & Verb Builder',
    focusArea: 'M2',
    expectedWindow: 'bridge_now',
    contextTitle: 'Waiting at the Bus Stop',
    prompt: 'Don\'t worry, we are not late! The school bus ___ (not / arrive) yet.',
    timeCue: 'yet (we are waiting right now)',
    correctWindowChoice: 'bridge_now',
    correctVerbChoice: 'has not arrived',
    verbChoices: ['did not arrive', 'has not arrived', 'have not arrived'],
    hints: [
      'Hint 1: Notice the word "yet" and "we are not late!" They are waiting at the bus stop right now.',
      'Hint 2: With "yet" connecting to right now, and singular "The school bus", use "has not + arrived".',
      'Hint 3: Choose "Connected to Right Now" and "has not arrived". The sentence is: "The school bus has not arrived yet."'
    ],
    selfCheckPrompt: 'With the word "yet", is the waiting period finished, or does it continue up to right now?',
    selfCheckCorrectWindow: 'bridge_now',
    contrastChosenText: 'Treating this as a closed past time ignores that they are still waiting at the bus stop right now.',
    contrastTargetText: 'The word "yet" reaches up to this exact moment, so we use "has not arrived".'
  },

  // LEVEL 2 — Format 2 (Time & Verb Builder) & Format 1 (Implicit Context MCQ)
  {
    id: 'Q4-CRICKET',
    level: 2,
    format: 'builder',
    formatLabel: 'Time & Verb Builder',
    focusArea: 'M1',
    expectedWindow: 'closed_past',
    contextTitle: 'School Cricket Match',
    prompt: 'Our class team ___ (win) the inter-school cricket match last Friday.',
    timeCue: 'last Friday',
    correctWindowChoice: 'closed_past',
    correctVerbChoice: 'won',
    verbChoices: ['won', 'has won', 'have won'],
    hints: [
      'Hint 1: Check the words at the end: "last Friday". Is last Friday still going on today?',
      'Hint 2: When a sentence names a finished day like "last Friday", choose "Finished Past Time" and the past form of "win".',
      'Hint 3: Choose "Finished Past Time" and "won". We say: "Our class team won the match last Friday."'
    ],
    selfCheckPrompt: 'Look at "last Friday". Is that day finished in the past, or is it still open today?',
    selfCheckCorrectWindow: 'closed_past',
    contrastChosenText: 'Pairing "has won" with "last Friday" mixes a present bridge with a closed past day.',
    contrastTargetText: '"Last Friday" is completely over, so we use Simple Past ("won").'
  },
  {
    id: 'Q5-LUNCH',
    level: 2,
    format: 'builder',
    formatLabel: 'Time & Verb Builder',
    focusArea: 'M2',
    expectedWindow: 'bridge_now',
    contextTitle: 'Sharing Food at Home',
    prompt: 'No thank you, I am full right now. I ___ already ___ (eat) my lunch.',
    timeCue: 'I am full right now / already',
    correctWindowChoice: 'bridge_now',
    correctVerbChoice: 'have already eaten',
    verbChoices: ['already ate', 'have already eaten', 'has already eaten'],
    hints: [
      'Hint 1: The speaker says "I am full right now" and uses "already". The meal explains why they feel full now.',
      'Hint 2: For "I" when the result matters right now, choose "Connected to Right Now" and "have + already + eaten".',
      'Hint 3: Choose "Connected to Right Now" and "have already eaten".'
    ],
    selfCheckPrompt: 'Why does the speaker mention eating lunch when someone offers them food right now?',
    selfCheckCorrectWindow: 'bridge_now',
    contrastChosenText: 'Without "have already eaten", the sentence loses the direct bridge explaining why the speaker is full right now.',
    contrastTargetText: '"I have already eaten" links the past meal to feeling full at this moment.'
  },
  {
    id: 'Q6-CYCLE',
    level: 2,
    format: 'mcq',
    formatLabel: 'Multiple Choice',
    focusArea: 'M1',
    expectedWindow: 'closed_past',
    contextTitle: 'Repairing a Bicycle',
    prompt: 'Two days ago, my uncle ___ the broken chain on my bicycle.',
    timeCue: 'Two days ago',
    correctAnswerText: 'repaired',
    options: [
      { id: 'a', text: 'repaired', isCorrect: true, tag: 'CORRECT' },
      { id: 'b', text: 'has repaired', isCorrect: false, tag: 'M1' },
      { id: 'c', text: 'have repaired', isCorrect: false, tag: 'PREREQ' }
    ],
    hints: [
      'Hint 1: Look at the opening words: "Two days ago". That time is already over.',
      'Hint 2: Any phrase with "ago" belongs to a finished past time. Use the simple past form without "has" or "have".',
      'Hint 3: The answer is "repaired". With "Two days ago", we say "my uncle repaired the broken chain."'
    ],
    selfCheckPrompt: 'What does the word "ago" ("Two days ago") tell us about when the action happened?',
    selfCheckCorrectWindow: 'closed_past',
    contrastChosenText: '"Has repaired" cannot be used when the sentence specifies "Two days ago".',
    contrastTargetText: '"Two days ago" locks the action in a finished past time box, requiring "repaired".'
  },

  // LEVEL 3 — Format 3 (Open Explanation & Sentence Fix)
  {
    id: 'Q7-EXPLAIN-TICKET',
    level: 3,
    format: 'explanation',
    formatLabel: 'Spot & Explain the Error',
    focusArea: 'M1',
    expectedWindow: 'closed_past',
    contextTitle: 'Fixing a Common Everyday Mistake',
    flawedSentence: 'I have visited my grandmother\'s village last Sunday.',
    prompt: 'A student wrote: "I have visited my grandmother\'s village last Sunday." Write the corrected verb and explain in one short sentence why "have visited" does not fit here.',
    timeCue: 'last Sunday',
    correctAnswerText: 'visited',
    acceptedVerbs: ['visited'],
    requiredConceptKeywords: ['last sunday', 'finished', 'past', 'over', 'closed', 'yesterday'],
    modelExplanation: 'We should use "visited" (Simple Past) because "last Sunday" is a finished time in the past, so we cannot use "have visited".',
    hints: [
      'Hint 1: Look at "last Sunday" at the end of the sentence. Last Sunday is already over.',
      'Hint 2: Because "last Sunday" is finished, drop "have" and use "visited". In your explanation, mention that "last Sunday" is finished in the past.',
      'Hint 3: Correct verb: "visited". Explanation: Because "last Sunday" is a finished past time, we use "visited" instead of "have visited".'
    ],
    selfCheckPrompt: 'Why does "have visited" clash with the words "last Sunday"?',
    selfCheckCorrectWindow: 'closed_past',
    contrastChosenText: '"Have visited" connects to the present, which clashes with the finished timestamp "last Sunday".',
    contrastTargetText: 'Replacing "have visited" with "visited" matches the finished past time "last Sunday".'
  },
  {
    id: 'Q8-EXPLAIN-GLASSES',
    level: 3,
    format: 'explanation',
    formatLabel: 'Spot & Explain the Error',
    focusArea: 'M2',
    expectedWindow: 'bridge_now',
    contextTitle: 'Looking for Reading Glasses',
    flawedSentence: 'Grandfather is still searching the table because he lost his glasses and cannot read the newspaper now.',
    prompt: 'Grandfather is searching the table right now. Write the Present Perfect verb phrase for "(lose)" in: "He ___ his glasses, so he cannot read the newspaper right now," and explain in one short sentence why Present Perfect fits.',
    timeCue: 'cannot read the newspaper right now',
    correctAnswerText: 'has lost',
    acceptedVerbs: ['has lost'],
    requiredConceptKeywords: ['now', 'still', 'result', 'present', 'cannot read', 'searching'],
    modelExplanation: 'We use "has lost" because the result still affects him right now — he still does not have his glasses and cannot read now.',
    hints: [
      'Hint 1: Grandfather is searching the table right now because his glasses are still missing.',
      'Hint 2: For "He" when the result is still true right now, use "has lost". In your explanation, mention that he still cannot read right now.',
      'Hint 3: Correct verb: "has lost". Explanation: We use "has lost" because the result is still true right now.'
    ],
    selfCheckPrompt: 'Why do we use "has lost" instead of just treating it as a closed past event?',
    selfCheckCorrectWindow: 'bridge_now',
    contrastChosenText: 'Without "has lost", we don\'t emphasize that the glasses are still missing right now.',
    contrastTargetText: '"Has lost" builds the bridge showing that the past loss still prevents him from reading right now.'
  },
  {
    id: 'Q9-EXPLAIN-HOMEWORK',
    level: 3,
    format: 'explanation',
    formatLabel: 'Spot & Explain the Error',
    focusArea: 'M1',
    expectedWindow: 'closed_past',
    contextTitle: 'Talking to the Class Teacher',
    flawedSentence: 'We have submitted our science notebook two hours ago.',
    prompt: 'A classmate says: "We have submitted our science notebook two hours ago." Write the corrected verb and explain in one short sentence why "have submitted" is wrong here.',
    timeCue: 'two hours ago',
    correctAnswerText: 'submitted',
    acceptedVerbs: ['submitted'],
    requiredConceptKeywords: ['ago', 'two hours', 'finished', 'past', 'over', 'closed'],
    modelExplanation: 'We must use "submitted" because "two hours ago" is a finished time in the past.',
    hints: [
      'Hint 1: Look at the words "two hours ago". That time is already finished.',
      'Hint 2: Drop "have" and use "submitted". In your explanation, mention that "two hours ago" is a finished past time.',
      'Hint 3: Correct verb: "submitted". Explanation: Because "two hours ago" is a finished past time, we use "submitted" instead of "have submitted".'
    ],
    selfCheckPrompt: 'What kind of time window does "two hours ago" create?',
    selfCheckCorrectWindow: 'closed_past',
    contrastChosenText: '"Have submitted" cannot pair with a closed past timestamp like "two hours ago".',
    contrastTargetText: 'Simple Past "submitted" fits "two hours ago" because that time moment is already over.'
  }
];

// Dynamic Adaptive Question Generator (synthesizes fresh everyday questions when bank items are exhausted or for targeted retries)
const DYNAMIC_TEMPLATES = [
  {
    focusArea: 'M1',
    expectedWindow: 'closed_past',
    contextTitle: 'Helping at Home',
    subject: 'My elder brother',
    verbBase: 'clean',
    verbPast: 'cleaned',
    verbPerf: 'has cleaned',
    wrongPerfPlural: 'have cleaned',
    objectText: 'the water tank',
    timeMarker: 'last Saturday'
  },
  {
    focusArea: 'M1',
    expectedWindow: 'closed_past',
    contextTitle: 'Evening Study Routine',
    subject: 'We',
    verbBase: 'finish',
    verbPast: 'finished',
    verbPerf: 'have finished',
    wrongPerfPlural: 'has finished',
    objectText: 'that story chapter',
    timeMarker: 'yesterday afternoon'
  },
  {
    focusArea: 'M2',
    expectedWindow: 'bridge_now',
    contextTitle: 'Ready for School',
    subject: 'Anita',
    verbBase: 'pack',
    verbPast: 'packed',
    verbPerf: 'has already packed',
    wrongPerfPlural: 'have already packed',
    objectText: 'her school bag, so she is ready to leave right now',
    timeMarker: 'already / ready right now'
  },
  {
    focusArea: 'M2',
    expectedWindow: 'bridge_now',
    contextTitle: 'Cooking in the Kitchen',
    subject: 'Mother',
    verbBase: 'make',
    verbPast: 'made',
    verbPerf: 'has just made',
    wrongPerfPlural: 'have just made',
    objectText: 'hot tea, and the cups are steaming on the tray right now',
    timeMarker: 'just / steaming right now'
  }
];

export function generateDynamicQuestion(targetLevel, targetFocusArea, counter = 1) {
  const pool = DYNAMIC_TEMPLATES.filter((t) => !targetFocusArea || t.focusArea === targetFocusArea);
  const chosen = pool[(counter - 1) % pool.length] || DYNAMIC_TEMPLATES[0];
  const isClosed = chosen.expectedWindow === 'closed_past';
  const id = `GEN-${targetLevel}-${chosen.focusArea}-${counter}`;

  if (targetLevel >= 3) {
    const flawed = isClosed
      ? `${chosen.subject} ${chosen.verbPerf} ${chosen.objectText} ${chosen.timeMarker}.`
      : `${chosen.subject} ${chosen.verbPast} ${chosen.objectText}.`;
    const correctV = isClosed ? chosen.verbPast : chosen.verbPerf;
    return {
      id,
      level: 3,
      isGenerated: true,
      format: 'explanation',
      formatLabel: 'Spot & Explain the Error',
      focusArea: chosen.focusArea,
      expectedWindow: chosen.expectedWindow,
      contextTitle: chosen.contextTitle,
      flawedSentence: flawed,
      prompt: `A student wrote: "${flawed}" Write the corrected verb and explain in one short sentence why it is needed here.`,
      timeCue: chosen.timeMarker,
      correctAnswerText: correctV,
      acceptedVerbs: [correctV],
      requiredConceptKeywords: isClosed
        ? ['last', 'yesterday', 'finished', 'past', 'over', 'closed']
        : ['now', 'already', 'just', 'still', 'result', 'present', 'ready', 'steaming'],
      modelExplanation: isClosed
        ? `We use "${correctV}" because "${chosen.timeMarker}" is a finished time in the past.`
        : `We use "${correctV}" because the result still holds right now.`,
      hints: [
        `Hint 1: Look at the time clue "${chosen.timeMarker}". Is that time already finished, or does the result hold right now?`,
        `Hint 2: The correct verb phrase is "${correctV}". In your explanation, mention why "${chosen.timeMarker}" is finished or connected to right now.`,
        `Hint 3: Correct verb: "${correctV}". Explanation: ${
          isClosed
            ? `Because "${chosen.timeMarker}" is a finished past time, we use "${correctV}".`
            : `Because the result is true right now, we use "${correctV}".`
        }`
      ],
      selfCheckPrompt: `Look at "${chosen.timeMarker}". Does it describe a finished past time or something connected to right now?`,
      selfCheckCorrectWindow: chosen.expectedWindow,
      contrastChosenText: isClosed
        ? `Using "${chosen.verbPerf}" clashes with the finished past time "${chosen.timeMarker}".`
        : `Using "${chosen.verbPast}" misses the connection to what is true right now.`,
      contrastTargetText: isClosed
        ? `"${chosen.timeMarker}" is finished, so "${correctV}" is required.`
        : `Because the result holds right now, "${correctV}" builds the bridge to now.`
    };
  }

  if (targetLevel === 2) {
    return {
      id,
      level: targetLevel,
      isGenerated: true,
      format: 'builder',
      formatLabel: 'Time & Verb Builder',
      focusArea: chosen.focusArea,
      expectedWindow: chosen.expectedWindow,
      contextTitle: chosen.contextTitle,
      prompt: isClosed
        ? `${chosen.subject} ___ (${chosen.verbBase}) ${chosen.objectText} ${chosen.timeMarker}.`
        : `${chosen.subject} ___ (${chosen.verbBase}) ${chosen.objectText}.`,
      timeCue: chosen.timeMarker,
      correctWindowChoice: chosen.expectedWindow,
      correctVerbChoice: isClosed ? chosen.verbPast : chosen.verbPerf,
      verbChoices: [chosen.verbPast, chosen.verbPerf, chosen.wrongPerfPlural],
      hints: [
        `Hint 1: Look closely at "${chosen.timeMarker}". Is that time already over, or does the result matter right now?`,
        `Hint 2: ${
          isClosed
            ? `Because "${chosen.timeMarker}" is finished, choose "Finished Past Time" and "${chosen.verbPast}".`
            : `Because the result is visible right now, choose "Connected to Right Now" and "${chosen.verbPerf}".`
        }`,
        `Hint 3: Choose "${
          isClosed ? 'Finished Past Time' : 'Connected to Right Now'
        }" and "${isClosed ? chosen.verbPast : chosen.verbPerf}".`
      ],
      selfCheckPrompt: `Look at "${chosen.timeMarker}". Does it describe a finished past time or something connected to right now?`,
      selfCheckCorrectWindow: chosen.expectedWindow,
      contrastChosenText: isClosed
        ? `Using "${chosen.verbPerf}" clashes with the finished past time "${chosen.timeMarker}".`
        : `Using Simple Past misses the connection to what is true right now.`,
      contrastTargetText: isClosed
        ? `"${chosen.timeMarker}" is finished, so "${chosen.verbPast}" is required.`
        : `Because the result holds right now, "${chosen.verbPerf}" builds the bridge to now.`
    };
  }

  return {
    id,
    level: targetLevel,
    isGenerated: true,
    format: 'mcq',
    formatLabel: 'Multiple Choice',
    focusArea: chosen.focusArea,
    expectedWindow: chosen.expectedWindow,
    contextTitle: chosen.contextTitle,
    prompt: isClosed
      ? `${chosen.subject} ___ ${chosen.objectText} ${chosen.timeMarker}.`
      : `${chosen.subject} ___ ${chosen.objectText}.`,
    timeCue: chosen.timeMarker,
    correctAnswerText: isClosed ? chosen.verbPast : chosen.verbPerf,
    options: [
      { id: 'a', text: isClosed ? chosen.verbPast : chosen.verbPerf, isCorrect: true, tag: 'CORRECT' },
      { id: 'b', text: isClosed ? chosen.verbPerf : chosen.verbPast, isCorrect: false, tag: chosen.focusArea },
      { id: 'c', text: chosen.wrongPerfPlural, isCorrect: false, tag: 'PREREQ' }
    ],
    hints: [
      `Hint 1: Look at "${chosen.timeMarker}". Ask yourself if that time is closed or still open right now.`,
      `Hint 2: ${
        isClosed
          ? `With finished time "${chosen.timeMarker}", pick the past verb without has/have.`
          : `Because the result matters right now, pick has/have + V3.`
      }`,
      `Hint 3: The answer is "${isClosed ? chosen.verbPast : chosen.verbPerf}".`
    ],
    selfCheckPrompt: `Does "${chosen.timeMarker}" belong to a finished past time or connect to right now?`,
    selfCheckCorrectWindow: chosen.expectedWindow,
    contrastChosenText: isClosed
      ? `"${chosen.verbPerf}" cannot be used with finished time "${chosen.timeMarker}".`
      : `Simple Past does not show that the result is still true right now.`,
    contrastTargetText: isClosed
      ? `"${chosen.timeMarker}" is finished, so we use "${chosen.verbPast}".`
      : `The result holds right now, so we use "${chosen.verbPerf}".`
  };
}
