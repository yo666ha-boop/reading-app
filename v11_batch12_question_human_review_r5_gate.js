const fs = require('fs');

const scaffold = JSON.parse(fs.readFileSync('v11_batch12_slash_question_scaffold.json', 'utf8'));
const r5 = JSON.parse(fs.readFileSync('v11_batch12_question_human_review_r5_g1_002_005.json', 'utf8'));

function fail(msg) { throw new Error(msg); }
if (scaffold.registered !== false || r5.registered !== false) fail('Batch12 must remain unregistered');
if (scaffold.officialTotal !== 718 || r5.officialTotal !== 718) fail('official total drift');
if (!Array.isArray(scaffold.passages) || scaffold.passages.length !== 50) fail('expected 50 scaffold passages');
if (!Array.isArray(r5.passages) || r5.passages.length !== 4) fail('expected 4 R5 passages');

const expectedIds = ['V11-B12-G1-002','V11-B12-G1-003','V11-B12-G1-004','V11-B12-G1-005'];
const ids = r5.passages.map(p => p.id);
if (JSON.stringify(ids) !== JSON.stringify(expectedIds)) fail(`R5 ids mismatch: ${ids.join(',')}`);

const scaffoldById = new Map(scaffold.passages.map(p => [p.id, p]));
const allPrompts = [];
let reviewed = 0;
for (const rp of r5.passages) {
  const sp = scaffoldById.get(rp.id);
  if (!sp) fail(`missing scaffold passage ${rp.id}`);
  const qs = [...(rp.questions || []), ...(rp.questionSetB || [])];
  if ((rp.questions || []).length !== 5 || (rp.questionSetB || []).length !== 5) fail(`${rp.id}: expected A/B 5 each`);
  if (qs.length !== 10) fail(`${rp.id}: expected 10 questions`);
  const types = new Set(qs.map(q => q.questionType));
  if (types.size < 5) fail(`${rp.id}: question type diversity too low (${[...types].join(',')})`);
  for (const q of qs) {
    if (!q.prompt || !q.answer || !q.evidence || !q.evidenceJp || !q.reason) fail(`${rp.id}: incomplete question`);
    if (q.humanReview !== 'HUMAN_REVIEW_R5') fail(`${rp.id}: human review marker missing`);
    if (!sp.body.includes(q.evidence)) fail(`${rp.id}: evidence is not exact body text: ${q.evidence}`);
    if (!sp.fullTranslation.includes(q.evidenceJp)) fail(`${rp.id}: evidenceJp is not exact translation text: ${q.evidenceJp}`);
    if (/本文の最初に示された状況|判断の手がかりになった具体的な情報|最初の考えをそのまま実行せず|問題を解決するために行った中心的な対応|この出来事から分かったこと・最後に確かめられたこと|本文全体から、同じような場面で大切|確認後、話の流れを変えた中心的な出来事|判断を変えるきっかけになった情報|最終的に行った変更・決定・対応|文章全体を最もよく表す学び・結論/.test(q.prompt)) fail(`${rp.id}: generic scaffold prompt remains`);
    allPrompts.push(q.prompt);
    reviewed++;
  }
}
if (reviewed !== 40 || r5.reviewedQuestions !== 40) fail(`reviewed count mismatch ${reviewed}`);
if (new Set(allPrompts).size !== allPrompts.length) fail('duplicate R5 prompts');

const result = {
  batch: 'V11-B12',
  registered: false,
  officialTotal: 718,
  r5Passages: 4,
  r5Questions: 40,
  previousHumanReviewed: 30,
  cumulativeHumanReviewed: 70,
  humanReviewPending: 430,
  evidenceExactBody: 'PASS',
  evidenceJpExactTranslation: 'PASS',
  questionCompleteness: 'PASS',
  questionTypeDiversity: 'PASS',
  genericScaffoldPromptExcluded: 'PASS',
  finalRegistrationReady: false
};
console.log(JSON.stringify(result, null, 2));
