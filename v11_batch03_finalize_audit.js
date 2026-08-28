const fs=require('fs');
const vm=require('vm');
function run(s,f){vm.runInContext(fs.readFileSync(f,'utf8'),s,{filename:f})}
function norm(s){return String(s||'').replace(/^\s*\d+\.\s*/,'').trim()}
try{
 const s={window:{},console};s.globalThis=s.window;vm.createContext(s);
 for(const f of ['v11_batch03_passages_draft_g1.js','v11_batch03_g1_length_repair.js','v11_batch03_passages_draft_g2.js','v11_batch03_passages_draft_g3.js','v11_batch03_length_repair.js','v11_batch03_chronology_repair.js','v11_batch03_chronology_repair_r2.js','v11_batch03_note_finalize.js','v11_batch03_question_regenerate.js'])run(s,f);
 const ps=[...(s.window.V11_BATCH03_DRAFT_G1_PASSAGES||[]),...(s.window.V11_BATCH03_DRAFT_G2_PASSAGES||[]),...(s.window.V11_BATCH03_DRAFT_G3_PASSAGES||[])];
 const failures=[];let totalQuestions=0,totalNotes=0;const promptForms=new Set();
 for(const p of ps){
   const notes=Array.isArray(p.notes)?p.notes:[];totalNotes+=notes.length;
   const seen=new Set();for(const n of notes){const e=String(n&&n.english||'').trim(),j=String(n&&n.japanese||'').trim();if(!e||!j)failures.push(p.id+':blank-note');if(j.includes('最終注整理対象'))failures.push(p.id+':placeholder-note:'+e);const k=e.toLowerCase();if(seen.has(k))failures.push(p.id+':duplicate-note:'+e);seen.add(k);}
   const qs=[...(p.questions||[]),...(p.questionSetB||[])];if(qs.length!==10)failures.push(p.id+':question-count='+qs.length);const ev=new Set(),pp=new Set();
   for(const q of qs){totalQuestions++;if(!q.prompt||!q.answer||!q.evidence||!q.evidenceJp||!q.reason)failures.push(p.id+':missing-question-field');if(!(p.sentences||[]).includes(q.evidence))failures.push(p.id+':evidence-not-in-body');if(q.answer!==q.evidence)failures.push(p.id+':answer-evidence-mismatch');const idx=(p.sentences||[]).indexOf(q.evidence),expected=idx>=0&&p.slashRows&&p.slashRows[idx]?p.slashRows[idx].jp:'';if(expected!==q.evidenceJp)failures.push(p.id+':evidence-jp-mismatch');ev.add(q.evidence);pp.add(norm(q.prompt));promptForms.add(norm(q.prompt));}
   if(ev.size!==10)failures.push(p.id+':evidence-diversity='+ev.size);if(pp.size!==10)failures.push(p.id+':prompt-diversity='+pp.size);if(p.questionRepair!=='B03_FINAL_STORY_SPECIFIC_10_EVIDENCE_20260828')failures.push(p.id+':question-marker');
 }
 const ns=s.window.V11_BATCH03_NOTE_FINALIZE_STATE,qs=s.window.V11_BATCH03_QUESTION_REGEN_STATE;
 if(!ns||ns.count!==50||ns.unresolved!==0)failures.push('note-finalize-state');if(!qs||qs.count!==50||qs.totalQuestions!==500)failures.push('question-regen-state');
 const out={generatedAt:new Date().toISOString(),passages:ps.length,totalNotes,totalQuestions,uniquePromptForms:promptForms.size,noteState:ns||null,questionState:qs||null,failures,finalPass:ps.length===50&&totalQuestions===500&&failures.length===0};fs.writeFileSync('V11_BATCH03_FINALIZE_AUDIT.json',JSON.stringify(out,null,2)+'\n');console.log(JSON.stringify(out,null,2));if(!out.finalPass)process.exitCode=1;
}catch(e){console.error(e.stack||e);process.exitCode=1}
