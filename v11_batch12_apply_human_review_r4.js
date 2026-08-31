const fs = require('fs');

const scaffoldPath = 'v11_batch12_slash_question_scaffold.json';
const packetPath = 'v11_batch12_grouped_slash_review_packet.json';
const layerPath = 'v11_batch12_human_review_layer_r4.json';
const outPath = 'v11_batch12_human_review_progress_r4.json';

const scaffold = JSON.parse(fs.readFileSync(scaffoldPath, 'utf8'));
const packet = JSON.parse(fs.readFileSync(packetPath, 'utf8'));
const layer = JSON.parse(fs.readFileSync(layerPath, 'utf8'));

if (scaffold.registered !== false || scaffold.officialTotal !== 718) throw new Error('Batch12 scaffold base must remain registered=false / officialTotal=718');
if (!Array.isArray(scaffold.passages) || scaffold.passages.length !== 50) throw new Error('Expected exactly 50 Batch12 passages');
if (packet.passageCount !== 20 || packet.rowCount !== 31) throw new Error(`Unexpected grouped packet size ${packet.passageCount}/${packet.rowCount}`);

const byId = new Map(scaffold.passages.map(p => [p.id, p]));
const packetById = new Map(packet.passages.map(p => [p.id, p]));
const confirmed = layer.groupedSlashHumanReview.confirmedPassages;
const repairs = layer.groupedSlashHumanReview.repairRequiredPassages;
if (confirmed.length !== 18 || repairs.length !== 2) throw new Error('R4 must account for all 20 grouped passages as 18 confirmed + 2 repair-required');
if (new Set([...confirmed, ...repairs]).size !== 20) throw new Error('Grouped passage review IDs overlap or are missing');
for (const id of [...confirmed, ...repairs]) if (!packetById.has(id)) throw new Error(`Grouped packet missing ${id}`);

let confirmedRows = 0;
for (const id of confirmed) {
  const p = byId.get(id);
  const rp = packetById.get(id);
  if (!p || !rp) throw new Error(`Missing passage ${id}`);
  for (const row of rp.groupedRows) {
    const target = p.slashRows.find(r => r.en === row.en && r.jp === row.jp);
    if (!target) throw new Error(`Cannot locate grouped slash row in scaffold: ${id}: ${row.en}`);
    target.humanReview = 'HUMAN_REVIEW_R4_CONFIRMED';
    confirmedRows++;
  }
  p.slashStage = 'B12_SLASH_GROUPED_R4_CONFIRMED_OR_1TO1_PENDING';
}

for (const [id, repair] of Object.entries(layer.translationBoundaryRepairs)) {
  const p = byId.get(id);
  if (!p) throw new Error(`Missing repair passage ${id}`);
  p.fullTranslation = repair.fullTranslation;
  p.slashStage = 'B12_SLASH_R4_TRANSLATION_REPAIRED_REBUILD_REQUIRED';
  p.slashRows.forEach(r => { if (r.humanReview !== 'HUMAN_REVIEW_R4_CONFIRMED') r.humanReview = 'PENDING_R4_REBUILD'; });
}

let reviewedQuestions = 0;
for (const [id, sets] of Object.entries(layer.questionRewrites)) {
  const p = byId.get(id);
  if (!p) throw new Error(`Missing question rewrite passage ${id}`);
  if (!Array.isArray(sets.A) || sets.A.length !== 5 || !Array.isArray(sets.B) || sets.B.length !== 5) throw new Error(`${id} must have A/B 5 each`);
  const prompts = new Set();
  for (const q of [...sets.A, ...sets.B]) {
    for (const key of ['questionType','prompt','answer','evidence','evidenceJp','reason','humanReview']) if (!q[key] || !String(q[key]).trim()) throw new Error(`${id} question missing ${key}`);
    if (q.humanReview !== 'HUMAN_REVIEW_R4') throw new Error(`${id} question is not marked HUMAN_REVIEW_R4`);
    if (!p.body.includes(q.evidence)) throw new Error(`${id} evidence not found verbatim in body: ${q.evidence}`);
    if (!p.fullTranslation.includes(q.evidenceJp)) {
      const slashHas = p.slashRows.some(r => r.jp.includes(q.evidenceJp) || q.evidenceJp.includes(r.jp));
      if (!slashHas) throw new Error(`${id} evidenceJp not found in translation/slash: ${q.evidenceJp}`);
    }
    if (prompts.has(q.prompt)) throw new Error(`${id} duplicate prompt within A/B sets`);
    prompts.add(q.prompt);
    reviewedQuestions++;
  }
  p.questions = sets.A;
  p.questionSetB = sets.B;
  p.questionStage = 'B12_QUESTION_HUMAN_REVIEW_R4_PARTIAL';
}

if (reviewedQuestions !== layer.questionHumanReviewedCount) throw new Error(`Reviewed question count mismatch: ${reviewedQuestions}`);
if (confirmedRows <= 0 || confirmedRows >= packet.rowCount) throw new Error(`R4 confirmed row count must be partial because two passages require rebuild: ${confirmedRows}`);

const generic = [
  '本文の最初に示された状況・問題を答えなさい。',
  '判断の手がかりになった具体的な情報を一つ答えなさい。',
  '最初の考えをそのまま実行せず、確認や見直しをした理由を答えなさい。',
  '問題を解決するために行った中心的な対応を答えなさい。'
];
for (const id of Object.keys(layer.questionRewrites)) {
  const p = byId.get(id);
  for (const q of [...p.questions, ...p.questionSetB]) if (generic.includes(q.prompt)) throw new Error(`${id} still contains scaffold-generic prompt after human rewrite`);
}

scaffold.registered = false;
scaffold.status = 'B12_HUMAN_REVIEW_R4_IN_PROGRESS_REGISTER_FORBIDDEN';
scaffold.humanReviewR4 = {
  groupedPacketPassages: packet.passageCount,
  groupedPacketRows: packet.rowCount,
  groupedConfirmedPassages: confirmed.length,
  groupedConfirmedRows: confirmedRows,
  groupedRepairRequiredPassages: repairs,
  humanQuestionPassages: Object.keys(layer.questionRewrites).length,
  humanQuestions: reviewedQuestions,
  remainingQuestions: 500 - reviewedQuestions,
  finalPass: false
};

fs.writeFileSync(outPath, JSON.stringify(scaffold, null, 2) + '\n');
console.log(JSON.stringify(scaffold.humanReviewR4));
