const fs = require('fs');

const fixes = [
  {
    file: 'v11_batch14_g1_body_draft.json',
    id: 'V11-B14-G1-002',
    english: 'stand',
    from: '傘立て',
    to: '譜面台',
    reason: 'music stand in this passage means a music stand, not an umbrella stand.'
  },
  {
    file: 'v11_batch14_g2_body_draft.json',
    id: 'V11-B14-G2-002',
    english: 'notices',
    from: '気づく（三単現）',
    to: 'お知らせ・通知（複数形）',
    reason: 'notices is a plural noun in general notices, not the verb notices.'
  }
];

const result = { fixes: [], failures: [] };
for (const fix of fixes) {
  const src = JSON.parse(fs.readFileSync(fix.file, 'utf8'));
  const p = (src.passages || []).find(x => x.id === fix.id);
  if (!p) {
    result.failures.push(`${fix.id}: passage missing`);
    continue;
  }
  const notes = (p.notes || []).filter(n => String(n.english || '').toLowerCase() === fix.english.toLowerCase());
  if (notes.length !== 1) {
    result.failures.push(`${fix.id}: expected exactly one ${fix.english} note, got ${notes.length}`);
    continue;
  }
  const note = notes[0];
  if (note.japanese !== fix.from && note.japanese !== fix.to) {
    result.failures.push(`${fix.id}: unexpected current gloss for ${fix.english}: ${note.japanese}`);
    continue;
  }
  note.japanese = fix.to;
  note.semanticRepair = 'B14_NOTE_SEMANTIC_REPAIR_R1';
  note.semanticRepairReason = fix.reason;
  p.humanSemanticReview = `${p.humanSemanticReview || 'B14_HUMAN_REVIEW'}_NOTE_R1`;
  fs.writeFileSync(fix.file, JSON.stringify(src, null, 2) + '\n');
  result.fixes.push({ id: fix.id, english: fix.english, japanese: fix.to });
}

result.finalPass = result.failures.length === 0 && result.fixes.length === fixes.length;
fs.writeFileSync('V11_BATCH14_NOTE_SEMANTIC_REPAIR_R1.json', JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify(result, null, 2));
if (!result.finalPass) process.exit(1);
