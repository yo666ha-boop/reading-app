const fs=require('fs');
const vm=require('vm');
function run(sandbox,file){vm.runInContext(fs.readFileSync(file,'utf8'),sandbox,{filename:file})}
function norm(s){return String(s||'').replace(/^\s*\d+\.\s*/,'').trim()}
try{
  const sandbox={window:{},console};sandbox.globalThis=sandbox.window;vm.createContext(sandbox);
  for(const f of ['v11_batch02_passages_draft.js','v11_batch02_unit_safe_repair.js','v11_batch02_unique_structure_repair.js','v11_batch02_semantic_rewrite_pass1.js','v11_batch02_semantic_chronology_repair_pass1.js','v11_batch02_required_notes_repair.js','v11_batch02_semantic_rewrite_pass2_grade2.js','v11_batch02_grade2_chronology_repair.js','v11_batch02_semantic_rewrite_pass3_grade3.js','v11_batch02_grade3_chronology_repair.js','v11_batch02_length_repair.js','v11_batch02_length_repair_r2.js','v11_batch02_postlength_chronology_repair.js','v11_batch02_question_repair.js'])run(sandbox,f);
  const ps=JSON.parse(JSON.stringify(sandbox.window.V11_BATCH02_DRAFT_PASSAGES||[]));
  const st=sandbox.window.V11_BATCH02_QUESTION_REPAIR_STATE;
  const failures=[];let total=0;const uniquePromptForms=new Set();
  for(const p of ps){
    const qs=[...(p.questions||[]),...(p.questionSetB||[])];
    if(qs.length!==10)failures.push(p.id+':question-count='+qs.length);
    const ev=new Set(),prompts=new Set();
    for(const q of qs){
      total++;
      if(!q.prompt||!q.answer||!q.evidence||!q.evidenceJp||!q.reason)failures.push(p.id+':missing-question-field');
      if(!(p.sentences||[]).includes(q.evidence))failures.push(p.id+':evidence-not-in-body');
      if(q.answer!==q.evidence)failures.push(p.id+':answer-evidence-mismatch');
      const idx=(p.sentences||[]).indexOf(q.evidence);
      const expectedJp=idx>=0&&p.slashRows&&p.slashRows[idx]?p.slashRows[idx].jp:'';
      if(expectedJp!==q.evidenceJp)failures.push(p.id+':evidence-jp-mismatch');
      ev.add(q.evidence);prompts.add(norm(q.prompt));uniquePromptForms.add(norm(q.prompt));
    }
    if(ev.size!==10)failures.push(p.id+':evidence-diversity='+ev.size);
    if(prompts.size!==10)failures.push(p.id+':prompt-diversity='+prompts.size);
    if(p.questionRepair!=='FINAL_STORY_SPECIFIC_10_EVIDENCE_20260828')failures.push(p.id+':question-repair-marker');
  }
  if(!st||st.count!==50||st.totalQuestions!==500)failures.push('repair-state-missing-or-invalid');
  const out={generatedAt:new Date().toISOString(),passages:ps.length,totalQuestions:total,uniquePromptForms:uniquePromptForms.size,repairState:st||null,failures,finalPass:ps.length===50&&total===500&&failures.length===0};
  fs.writeFileSync('V11_BATCH02_QUESTION_AUDIT.json',JSON.stringify(out,null,2)+'\n');console.log(JSON.stringify(out,null,2));if(!out.finalPass)process.exitCode=1;
}catch(e){console.error(e.stack||e);process.exitCode=1}
