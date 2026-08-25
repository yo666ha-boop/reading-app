// Strict final wrapper around the preserved base scanner.
// Batch5 rerun marker: authoritative scan is retriggered only after prior evidence-writer commits settled.
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
  "function classifyToken(v7, w, raw, cut, reviewedEvidence, localProperNames, notedWords) {\n  if (notedWords && notedWords.has(w)) return { kind:'NOTED_UNLEARNED_ALLOWED', evidence:'current passage notes entry with nonblank English+Japanese gloss; passage-local and non-cumulative' };\n  const possessiveProperBase = w.endsWith(\"'s\") ? w.slice(0,-2) : (w.endsWith(\"s'\") ? w.slice(0,-1) : '');\n  if (possessiveProperBase && localProperNames.has(possessiveProperBase) && /^[A-Z]/.test(String(raw || ''))) return { kind:'EXPLICIT_PROPER_NAME_ALLOWED', evidence:'current passage allowedWords row explicitly tagged proper names; possessive surface form of local proper name' };\n",
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
  "Capitalization alone never authorizes a proper noun. Explicitly tagged local proper-name possessives are authorized only for that passage. A passage-local notes entry authorizes only the exact noted token in that passage and only when English and Japanese gloss are both nonblank; it never enters cumulative vocabulary.'",
  'rule text'
);
patch(
  "    await new Promise(r => setTimeout(r, 250));\n    browserErrors.length = 0;",
  "    await waitFor(() => w.V10_RUNTIME_LOAD_PROGRESS === 'complete' || !!w.V10_RUNTIME_LOAD_ERROR, 90000, 'authoritative final runtime terminal state');\n    assert(w.V10_RUNTIME_LOAD_PROGRESS === 'complete' && !w.V10_RUNTIME_LOAD_ERROR, `authoritative runtime load failed: progress=${w.V10_RUNTIME_LOAD_PROGRESS} error=${w.V10_RUNTIME_LOAD_ERROR}`);\n    for (const f of ['v10_passage_local_proper_names_batch1.js','v10_passage_local_notes_batch2.js','v10_passage_local_notes_batch3.js','v10_passage_local_notes_batch4.js','v10_passage_local_notes_batch5.js']) {\n      if (!fs.existsSync(f)) throw new Error('missing bounded passage-local runtime file: '+f);\n      w.eval(fs.readFileSync(f,'utf8'));\n    }\n    await new Promise(r => setTimeout(r, 250));\n    browserErrors.length = 0;",
  'authoritative runtime completion + bounded local annotations'
);
fs.writeFileSync(tmp,s);
try{
  const r=cp.spawnSync(process.execPath,[tmp],{stdio:'inherit',env:process.env});
  if(r.error)throw r.error;
  if(r.status!==0)process.exit(r.status||1);
}finally{try{fs.unlinkSync(tmp)}catch(_){}}
