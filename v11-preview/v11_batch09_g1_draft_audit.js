const fs=require('fs'),vm=require('vm');
const ctx={window:{},console};vm.createContext(ctx);
vm.runInContext(fs.readFileSync('v11_batch09_passages_draft_g1.js','utf8'),ctx);
const ps=ctx.window.V11_BATCH09_G1_DRAFTS||[];
const issues=[];const ids=new Set();
if(ps.length!==17) issues.push(`count=${ps.length}`);
for(const p of ps){
 if(ids.has(p.id)) issues.push(`${p.id}: duplicate id`); ids.add(p.id);
 if(p.registered!==false) issues.push(`${p.id}: registered must remain false`);
 if(!Array.isArray(p.sentences)||p.sentences.length<8) issues.push(`${p.id}: sentences`);
 if(!Array.isArray(p.slashRows)||p.slashRows.length!==p.sentences.length) issues.push(`${p.id}: slashRows`);
 if(!p.fullTranslation||p.fullTranslation!==p.slashRows.map(r=>r.jp).join('')) issues.push(`${p.id}: fullTranslation sync`);
 if(!Array.isArray(p.questions)||p.questions.length!==5||!Array.isArray(p.questionSetB)||p.questionSetB.length!==5) issues.push(`${p.id}: questions 5+5`);
 if(p.wordCount<90||p.wordCount>125) issues.push(`${p.id}: wordCount=${p.wordCount}`);
 for(const q of [...(p.questions||[]),...(p.questionSetB||[])]){
  if(!p.sentences.includes(q.evidence)) issues.push(`${p.id}: evidence not in body`);
  const row=p.slashRows.find(r=>r.en===q.evidence); if(!row||row.jp!==q.evidenceJp) issues.push(`${p.id}: evidenceJp mismatch`);
  if(/第\d+(段階|文)/.test(q.prompt||'')) issues.push(`${p.id}: machine scaffold prompt`);
 }
}
const summary={batch:'V11-B09',grade:1,count:ps.length,minWords:ps.length?Math.min(...ps.map(p=>p.wordCount)):0,maxWords:ps.length?Math.max(...ps.map(p=>p.wordCount)):0,issues,pass:issues.length===0};
console.log(JSON.stringify(summary,null,2));
if(issues.length) process.exit(1);
