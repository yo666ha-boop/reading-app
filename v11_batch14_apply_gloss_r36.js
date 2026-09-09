const fs = require('fs');

const assembledPath = 'v11_batch14_assembled_draft.json';
const repairPath = 'v11_batch14_gloss_repair_r36_20260909.json';
const data = JSON.parse(fs.readFileSync(assembledPath, 'utf8'));
const repair = JSON.parse(fs.readFileSync(repairPath, 'utf8'));

if (!Array.isArray(data.passages) || data.passages.length !== 50) {
  throw new Error(`Batch14 passage count must be 50, got ${data.passages && data.passages.length}`);
}
if (!Array.isArray(repair.repairs) || repair.repairs.length !== 14) {
  throw new Error(`R36 repair count must be 14, got ${repair.repairs && repair.repairs.length}`);
}

function norm(s) { return String(s || '').trim().toLowerCase(); }

function applyOne(passage, rep) {
  let changed = 0;
  const hits = [];
  function walk(node, path) {
    if (!node || typeof node !== 'object') return;
    if (!Array.isArray(node)) {
      const entries = Object.entries(node);
      const hasEnglish = entries.some(([k,v]) => typeof v === 'string' && norm(v) === norm(rep.english));
      if (hasEnglish) {
        for (const [k,v] of entries) {
          if (typeof v === 'string' && v === rep.from && !['body','fullTranslation','evidence','evidenceJp','reason','answer'].includes(k)) {
            node[k] = rep.to;
            changed++;
            hits.push(`${path}.${k}`);
          }
        }
      }
    }
    for (const [k,v] of Object.entries(node)) {
      if (v && typeof v === 'object') walk(v, `${path}.${k}`);
    }
  }
  walk(passage, passage.id);
  if (changed !== 1) {
    throw new Error(`R36 ${rep.id} ${rep.english}: expected exactly 1 contextual gloss replacement ${rep.from}->${rep.to}, got ${changed}; hits=${hits.join(',')}`);
  }
  return hits[0];
}

const applied = [];
for (const rep of repair.repairs) {
  const p = data.passages.find(x => x.id === rep.id);
  if (!p) throw new Error(`R36 target passage missing: ${rep.id}`);
  const hit = applyOne(p, rep);
  applied.push({id: rep.id, english: rep.english, from: rep.from, to: rep.to, hit});
}

// Fail closed: none of the exact bad contextual pairs may remain in their target passage.
for (const rep of repair.repairs) {
  const p = data.passages.find(x => x.id === rep.id);
  let bad = 0;
  function scan(node) {
    if (!node || typeof node !== 'object') return;
    if (!Array.isArray(node)) {
      const vals = Object.values(node);
      const hasEnglish = vals.some(v => typeof v === 'string' && norm(v) === norm(rep.english));
      if (hasEnglish && vals.some(v => typeof v === 'string' && v === rep.from)) bad++;
    }
    for (const v of Object.values(node)) if (v && typeof v === 'object') scan(v);
  }
  scan(p);
  if (bad !== 0) throw new Error(`R36 residual bad contextual gloss ${rep.id} ${rep.english}: ${bad}`);
}

data.status = 'ASSEMBLED_R36_GLOSS_APPLIED_PENDING_REMAINING_GATES';
data.r36ApplySummary = { appliedCount: applied.length, applied };
fs.writeFileSync(assembledPath, JSON.stringify(data, null, 2) + '\n');
console.log(JSON.stringify({passages: data.passages.length, applied: applied.length, repairs: applied}, null, 2));
