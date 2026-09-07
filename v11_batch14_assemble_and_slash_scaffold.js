const fs = require('fs');

const draftFiles = [
  'v11_batch14_g1_body_draft.json',
  'v11_batch14_g2_body_draft.json',
  'v11_batch14_g3_body_draft.json'
];
const statusFiles = [
  'V11_BATCH14_G1_CHRONOLOGY_STATUS.txt',
  'V11_BATCH14_G2_CHRONOLOGY_STATUS.txt',
  'V11_BATCH14_G3_CHRONOLOGY_STATUS.txt'
];

function parseStatus(path) {
  const out = {};
  for (const line of fs.readFileSync(path, 'utf8').split(/\r?\n/)) {
    const i = line.indexOf('=');
    if (i > 0) out[line.slice(0, i)] = line.slice(i + 1);
  }
  return out;
}
function sentenceSplit(text, locale) {
  const seg = new Intl.Segmenter(locale, { granularity: 'sentence' });
  return [...seg.segment(String(text || ''))].map(x => x.segment.trim()).filter(Boolean);
}
function qCount(p) {
  return (Array.isArray(p.questions) ? p.questions.length : 0) +
    (Array.isArray(p.questionSetB) ? p.questionSetB.length : 0);
}

const failures = [];
const chronology = statusFiles.map(parseStatus);
chronology.forEach((s, i) => {
  const grade = i + 1;
  if (s.registered !== 'false') failures.push(`G${grade}: chronology source must remain unregistered`);
  if (s.vocab_unregistered !== '0') failures.push(`G${grade}: vocab_unregistered=${s.vocab_unregistered}`);
  if (s.vocab_future_leak !== '0') failures.push(`G${grade}: vocab_future_leak=${s.vocab_future_leak}`);
  if (s.grammar_unresolved !== '0') failures.push(`G${grade}: grammar_unresolved=${s.grammar_unresolved}`);
  if (s.grammar_future_leak !== '0') failures.push(`G${grade}: grammar_future_leak=${s.grammar_future_leak}`);
  if (s.final !== 'PASS') failures.push(`G${grade}: chronology final=${s.final}`);
});

const passages = [];
for (const file of draftFiles) {
  const src = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (src.registered !== false || src.officialTotal !== 818) failures.push(`${file}: registration contract mismatch`);
  for (const p of src.passages || []) passages.push(JSON.parse(JSON.stringify(p)));
}

if (passages.length !== 50) failures.push(`expected 50 passages, got ${passages.length}`);
const uniqueIds = new Set(passages.map(p => p.id));
if (uniqueIds.size !== 50) failures.push(`expected 50 unique ids, got ${uniqueIds.size}`);
const gradeCounts = passages.reduce((a,p) => {
  const m = /-G([123])-/.exec(p.id || '');
  const g = m ? `G${m[1]}` : 'BAD';
  a[g] = (a[g] || 0) + 1;
  return a;
}, {});
if (gradeCounts.G1 !== 17 || gradeCounts.G2 !== 17 || gradeCounts.G3 !== 16) failures.push(`grade split mismatch ${JSON.stringify(gradeCounts)}`);

let oneToOneRows = 0;
const boundaryPending = [];
let existingQuestions = 0;
for (const p of passages) {
  if (!p.body || !p.fullTranslation || !p.humanSemanticReview) failures.push(`${p.id}: missing body/fullTranslation/humanSemanticReview`);
  const en = sentenceSplit(p.body, 'en');
  const jp = sentenceSplit(p.fullTranslation, 'ja');
  if (en.length === jp.length) {
    p.slashRows = en.map((english, i) => ({ english, japanese: jp[i], humanReview: 'PENDING_BATCH14_SLASH_HUMAN' }));
    oneToOneRows += en.length;
  } else {
    p.slashRows = [];
    p.slashBoundaryDraft = { englishSentences: en, japaneseSentences: jp, humanReview: 'PENDING_BATCH14_BOUNDARY_HUMAN' };
    boundaryPending.push({ id: p.id, en: en.length, jp: jp.length });
  }
  existingQuestions += qCount(p);
}

const assembled = {
  batch: 'V11-B14',
  officialBefore: 818,
  targetAfterFullGates: 868,
  registered: false,
  status: 'ASSEMBLED_CHRONOLOGY_PASS_SLASH_HUMAN_PENDING_QUESTIONS_PENDING',
  chronologyAllGradesPass: failures.filter(x => x.includes('chronology') || /G[123]:/.test(x)).length === 0,
  passages
};
fs.writeFileSync('v11_batch14_assembled_draft.json', JSON.stringify(assembled, null, 2) + '\n');

const report = {
  passages: passages.length,
  uniqueIds: uniqueIds.size,
  gradeCounts,
  chronologyAllGradesPass: assembled.chronologyAllGradesPass,
  oneToOneRows,
  boundaryPendingPassages: boundaryPending.length,
  boundaryPending,
  existingQuestions,
  requiredQuestions: 500,
  pendingQuestions: Math.max(0, 500 - existingQuestions),
  registered: false,
  officialBefore: 818,
  targetAfterFullGates: 868,
  assemblyFailures: failures,
  assemblyPass: failures.length === 0,
  slashHumanPass: false,
  questionHumanPass: false,
  finalReady: false
};
fs.writeFileSync('V11_BATCH14_ASSEMBLY_SLASH_SCAFFOLD.json', JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
if (!report.assemblyPass) process.exit(1);
