const fs=require('fs');
const vm=require('vm');
function run(sandbox,file){vm.runInContext(fs.readFileSync(file,'utf8'),sandbox,{filename:file})}
function norm(s){return String(s||'').replace(/^\s*\d+\.\s*/,'').trim()}
try{
  const sandbox={window:{},console};sandbox.globalThis=sandbox.window;
  sandbox.window.V11_REGISTER_PASSAGES=(all)=>({extraPassages:Array.isArray(all)?all.length:0});
  vm.createContext(sandbox);
  run(sandbox,'v11_batch01_passages_001_050.js');
  run(sandbox,'v11_batch02_passages_draft.js');
  run(sandbox,'v11_batch02_unit_safe_repair.js');
  run(sandbox,'v11_batch02_required_notes_repair.js');
  run(sandbox,'v11_batch02_question_repair.js');
  const ps=JSON.parse(JSON.stringify(sandbox.window.V11_BATCH02_DRAFT_PASSAGES||[]));
  const st=sandbox.window.V11_BATCH02_QUESTION_REPAIR_STATE;
  const failures=[];let total=0,reused=0,arc=0;const uniquePromptForms=new Set();
  for(const p of ps){
    const qs=[...(p.questions||[]),...(p.questionSetB||[])];
    if(qs.length!==10)failures.push(p.id+':question-count='+qs.length);
    const ev=new Set();const prompts=new Set();
    for(const q of qs){
      total++;
      if(!q.prompt||!q.answer||!q.evidence||!q.evidenceJp||!q.reason)failures.push(p.id+':missing-question-field');
      if(!(p.sentences||[]).includes(q.evidence))failures.push(p.id+':evidence-not-in-body');
      ev.add(q.evidence);prompts.add(norm(q.prompt));uniquePromptForms.add(norm(q.prompt));
      if(q.answer===q.evidence)arc++;else reused++;
    }
    if(ev.size<9)failures.push(p.id+':evidence-diversity='+ev.size);
    if(prompts.size<6)failures.push(p.id+':prompt-diversity='+prompts.size);
    if(qs.every(q=>/本文の内容に合う英文を一文答えなさい/.test(q.prompt)))failures.push(p.id+':legacy-extractive-only');
    if(p.questionRepair!=='BATCH01_AUDITED_EVIDENCE_REUSE_PLUS_STORY_ARC_20260828')failures.push(p.id+':question-repair-marker');
  }
  if(!st||st.count!==50)failures.push('repair-state-missing');
  const out={generatedAt:new Date().toISOString(),passages:ps.length,totalQuestions:total,reusedAuditedContentQuestions:reused,storyArcExtractiveQuestions:arc,uniquePromptForms:uniquePromptForms.size,repairState:st||null,failures,finalPass:ps.length===50&&total===500&&reused>=400&&failures.length===0};
  fs.writeFileSync('V11_BATCH02_QUESTION_AUDIT.json',JSON.stringify(out,null,2)+'\n');
  console.log(JSON.stringify(out,null,2));
  if(!out.finalPass)process.exitCode=1;
}catch(e){console.error(e.stack||e);process.exitCode=1}
