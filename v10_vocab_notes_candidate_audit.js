// Strict final wrapper around the preserved base scanner.
// Passage-local notes are allowed only when both English and Japanese gloss are present; they never become cumulative vocabulary.
// Any change to the bounded runtime note definitions must be followed by this 168-passage scanner.
const fs=require('fs');
const cp=require('child_process');
const base='v10_vocab_notes_candidate_audit_base.js';
const tmp='.v10_vocab_notes_candidate_audit_runtime.js';
let s=fs.readFileSync(base,'utf8');
function patch(from,to,label){if(!s.includes(from))throw new Error('audit wrapper patch point missing: '+label);s=s.replace(from,to);}
patch(
  "function classifyToken(v7, w, raw, cut, reviewedEvidence, localProperNames) {\n",
  "function classifyToken(v7, w, raw, cut, reviewedEvidence, localProperNames, notedWords) {\n  if (notedWords && notedWords.has(w)) return { kind:'NOTED_UNLEARNED_ALLOWED', evidence:'current passage notes entry with nonblank English+Japanese gloss; passage-local and non-cumulative' };\n",
  'classify signature'
);
patch(
  "const localEvidence = allowedEvidence(m), local = localEvidence.lexical, localProperNames = localEvidence.proper;\n          const priorReviewedTokens = reviewedEvidence.size;",
  "const localEvidence = allowedEvidence(m), local = localEvidence.lexical, localProperNames = localEvidence.proper;\n          const passageNotes = (Array.isArray(m.notes) ? m.notes : []).filter(n => n && String(n.english || '').trim() && String(n.japanese || '').trim());\n          const notedWords = new Set(passageNotes.flatMap(n => tokenize(n.english)));\n          const priorReviewedTokens = reviewedEvidence.size;",
  'passage note set'
);
patch(
  "classifyToken(v7, tok, raw, cut, reviewedEvidence, localProperNames)",
  "classifyToken(v7, tok, raw, cut, reviewedEvidence, localProperNames, notedWords)",
  'classify call'
);
patch(
  "counts[c.kind]++;",
  "counts[c.kind] = (counts[c.kind] || 0) + 1;",
  'dynamic counts'
);
patch(
  "c.kind === 'REVIEWED_EXPLICIT_ALLOWED') continue;",
  "c.kind === 'REVIEWED_EXPLICIT_ALLOWED' || c.kind === 'NOTED_UNLEARNED_ALLOWED') continue;",
  'allowed skip'
);
patch(
  "const notes = Array.isArray(m.notes) ? m.notes : [];\n          notesPresent += notes.length;",
  "const notes = Array.isArray(m.notes) ? m.notes : [];\n          notesPresent += notes.length;",
  'notes accounting'
);
patch(
  "Capitalization alone never authorizes a proper noun.'",
  "Capitalization alone never authorizes a proper noun. A passage-local notes entry authorizes only the exact noted token in that passage and only when English and Japanese gloss are both nonblank; it never enters cumulative vocabulary.'",
  'rule text'
);
patch(
  "    await new Promise(r => setTimeout(r, 250));\n    browserErrors.length = 0;",
  "    await waitFor(() => w.V10_RUNTIME_LOAD_PROGRESS === 'complete', 60000, 'authoritative final runtime load order');\n    assert(!w.V10_RUNTIME_LOAD_ERROR, `authoritative runtime load failed: ${w.V10_RUNTIME_LOAD_ERROR}`);\n    await new Promise(r => setTimeout(r, 250));\n    browserErrors.length = 0;",
  'authoritative runtime completion gate'
);
fs.writeFileSync(tmp,s);
try{
  const r=cp.spawnSync(process.execPath,[tmp],{stdio:'inherit',env:process.env});
  if(r.error)throw r.error;
  if(r.status!==0)process.exit(r.status||1);
}finally{try{fs.unlinkSync(tmp)}catch(_){}}
