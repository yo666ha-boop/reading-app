const fs=require('fs');
const files=['v11_batch15_g1_body_draft.json','v11_batch15_g2_body_draft.json','v11_batch15_g3_body_draft.json'];
const passages=files.flatMap(f=>JSON.parse(fs.readFileSync(f,'utf8')).passages||[]);
const vocab=JSON.parse(fs.readFileSync('V11_BATCH15_VOCAB_GATE_R6_REPORT.json','utf8'));
const grammar=JSON.parse(fs.readFileSync('V11_BATCH15_GRAMMAR_CHRONOLOGY_REPORT.json','utf8'));
const jp=/[\u3040-\u30ff\u3400-\u9fff]/;
let noteCount=0;
const failures=[];
const passageSummary=[];
for(const p of passages){
  const notes=Array.isArray(p.notes)?p.notes:[];
  const required=notes.filter(n=>n&&n.kind==='unlearned_local_required');
  let bad=0;
  for(const n of required){
    noteCount++;
    const e=String(n.english||'').trim();
    const j=String(n.japanese||'').trim();
    const reason=[];
    if(!e) reason.push('missing_english');
    if(!j) reason.push('missing_japanese');
    if(e&&j&&e.toLowerCase()===j.toLowerCase()) reason.push('english_as_japanese');
    if(j&&!jp.test(j)) reason.push('no_japanese_script');
    if(reason.length){bad++;failures.push({id:p.id,english:e,japanese:j,reason});}
  }
  passageSummary.push({id:p.id,requiredLocalNotes:required.length,invalidNotes:bad});
}
const vocabZero=!!vocab.finalPass&&Number(vocab.unregisteredOccurrences||0)===0&&Number(vocab.futureVocabLeakOccurrences||0)===0&&Number(vocab.uniqueResidualWords||0)===0;
const grammarZero=!!grammar.finalPass&&Number(grammar.unresolvedOccurrences||0)===0&&Number(grammar.futureGrammarLeak||0)===0;
const pass=passages.length===50&&vocabZero&&grammarZero&&failures.length===0;
const out={generatedAt:new Date().toISOString(),batch:'V11-B15',registered:false,officialTotal:868,passages:passages.length,requiredLocalNotes:noteCount,invalidGlosses:failures.length,vocabZero,grammarZero,normalNotesSchema:'shared passage notes array',easyNotesSchema:'shared passage notes array',requiredLocalGlossGate:pass?'PASS':'FAIL',finalPass:pass,failures,passageSummary};
fs.writeFileSync('V11_BATCH15_NOTES_GATE_REPORT.json',JSON.stringify(out,null,2)+'\n');
fs.writeFileSync('V11_BATCH15_NOTES_GATE_STATUS.txt',[`batch15_passages=${passages.length}/50`,`registered=false`,`official_total=868`,`required_local_notes=${noteCount}`,`invalid_glosses=${failures.length}`,`vocab_zero=${vocabZero?'PASS':'FAIL'}`,`grammar_zero=${grammarZero?'PASS':'FAIL'}`,`notes_required_local_gate=${pass?'PASS':'FAIL'}`].join('\n')+'\n');
console.log(JSON.stringify(out,null,2));
if(!pass) process.exitCode=1;
