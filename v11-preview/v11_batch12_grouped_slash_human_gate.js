const fs = require('fs');

const scaffold = JSON.parse(fs.readFileSync('v11_batch12_slash_question_scaffold.json', 'utf8'));
const review = JSON.parse(fs.readFileSync('v11_batch12_grouped_slash_human_review_r5.json', 'utf8'));

function fail(msg) { throw new Error(msg); }
if (scaffold.registered !== false || review.registered !== false) fail('Batch12 must remain unregistered before final gates');
if (scaffold.officialTotal !== 718 || review.officialTotal !== 718) fail('official total drift');
if (!Array.isArray(scaffold.passages) || scaffold.passages.length !== 50) fail('expected 50 passages');

const grouped = scaffold.passages.filter(p => (p.slashRows || []).some(r => r.alignmentShape && r.alignmentShape !== '1:1'));
const groupedRows = grouped.reduce((n,p) => n + (p.slashRows || []).filter(r => r.alignmentShape && r.alignmentShape !== '1:1').length, 0);
const groupedIds = [...new Set(grouped.map(p => p.id))].sort();
const reviewedIds = [...new Set(review.confirmedPassages || [])].sort();

if (groupedIds.length !== 19) fail(`expected 19 grouped passages, got ${groupedIds.length}`);
if (groupedRows !== 26) fail(`expected 26 grouped rows, got ${groupedRows}`);
if (review.reviewedGroupedPassageCount !== groupedIds.length) fail('reviewed grouped passage count mismatch');
if (review.reviewedGroupedRowCount !== groupedRows) fail('reviewed grouped row count mismatch');
if (JSON.stringify(groupedIds) !== JSON.stringify(reviewedIds)) {
  fail(`grouped review ID mismatch\nscaffold=${groupedIds.join(',')}\nreview=${reviewedIds.join(',')}`);
}
if (!Array.isArray(review.repairedAndRechecked) || !review.repairedAndRechecked.some(x => x.id === 'V11-B12-G3-008' && x.result === 'PASS')) fail('G3-008 repaired review missing');
if (!review.repairedAndRechecked.some(x => x.id === 'V11-B12-G3-011' && x.result === 'PASS_REMOVED_FROM_GROUPED_SET')) fail('G3-011 repair/removal review missing');
if ((review.questionHumanReview || {}).reviewed !== 30 || (review.questionHumanReview || {}).pending !== 470) fail('question review count drift');

const result = {
  batch: 'V11-B12',
  registered: false,
  officialTotal: 718,
  groupedPassages: groupedIds.length,
  groupedRows,
  groupedHumanReview: 'PASS',
  questionHumanReviewed: 30,
  questionHumanPending: 470,
  finalRegistrationReady: false
};
console.log(JSON.stringify(result, null, 2));
