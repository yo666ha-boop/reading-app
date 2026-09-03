const fs=require('fs'),vm=require('vm');
const ctx={window:{},console};vm.createContext(ctx);
for(const f of ['v11_batch09_passages_draft_g1.js','v11_batch09_g1_length_repair.js']) vm.runInContext(fs.readFileSync(f,'utf8'),ctx);
const ps=ctx.window.V11_BATCH09_G1_DRAFTS||[],issues=[],ids=new Set();
if(ps.length!==17) issues.push(`count=${ps.length}`);
for(const p of ps){
 if(ids.has(p.id)) issues.push(`${p.id}: duplicate id`);ids.add(p.id);
 if(p.registered!==false) issues.push(`${p.id}: registered`);
 if(p.wordCount<90||p.wordCount>125) issues.push(`${p.id}: wordCount=${p.wordCount}`);
 if(!Array.isArray(p.sentences)||p.sentences.length<8) issues.push(`${p.id}: sentences`);
 if(!Array.isArray(p.slashRows)||p.slashRows.length!==p.sentences.length) issues.push(`${p.id}: slashRows`);
 if(p.fullTranslation!==p.slashRows.map(r=>r.jp).join('')) issues.push(`${p.id}: translation sync`);
 if((p.questions||[]).length!==5||(p.questionSetB||[]).length!==5) issues.push(`${p.id}: questions`);
 for(const q of [...(p.questions||[]),...(p.questionSetB||[])]){const r=p.slashRows.find(x=>x.en===q.evidence);if(!r)issues.push(`${p.id}: evidence`);else if(r.jp!==q.evidenceJp)issues.push(`${p.id}: evidenceJp`);if(/第\d+(段階|文)/.test(q.prompt||''))issues.push(`${p.id}: scaffold`);}
}
const summary={batch:'V11-B09',grade:1,count:ps.length,minWords:Math.min(...ps.map(p=>p.wordCount)),maxWords:Math.max(...ps.map(p=>p.wordCount)),issues,pass:!issues.length};
console.log(JSON.stringify(summary,null,2));if(issues.length)process.exit(1);
