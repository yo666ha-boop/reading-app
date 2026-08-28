const fs=require('fs'),vm=require('vm');
function run(ctx,f){vm.runInContext(fs.readFileSync(f,'utf8'),ctx,{filename:f});}
function words(s){return (String(s||'').match(/[A-Za-z]+(?:['’][A-Za-z]+)?/g)||[]).length;}
try{
 const s={window:{},console};s.globalThis=s.window;vm.createContext(s);
 for(const f of ['v11_batch05_passages_draft_g1.js','v11_batch05_passages_draft_g2.js','v11_batch05_passages_draft_g3.js'])run(s,f);
 const ps=[...(s.window.V11_BATCH05_G1_PASSAGES||[]),...(s.window.V11_BATCH05_G2_PASSAGES||[]),...(s.window.V11_BATCH05_G3_PASSAGES||[])],ids=new Set(),issues=[],lengthIssues=[];
 if(ps.length!==50)issues.push(`passage count ${ps.length}`);
 const grades={1:0,2:0,3:0};
 for(const p of ps){grades[p.grade]=(grades[p.grade]||0)+1;if(ids.has(p.id))issues.push(`${p.id}: duplicate id`);ids.add(p.id);
  const wc=words((p.sentences||[]).join(' ')),band=p.targetWordBand||[];
  if(band.length!==2||wc<+band[0]||wc>+band[1])lengthIssues.push({id:p.id,wc,band});
  if(p.wordCount!==wc)issues.push(`${p.id}: stale wordCount`);
  if(!Array.isArray(p.sentences)||!p.sentences.length||!Array.isArray(p.slashRows)||p.sentences.length!==p.slashRows.length)issues.push(`${p.id}: sentence/slash mismatch`);
  if((p.slashRows||[]).some(x=>!x||!x.en||!x.jp))issues.push(`${p.id}: empty slash row`);
  if(String(p.fullTranslation||'')!==(p.slashRows||[]).map(x=>x&&x.jp||'').join(''))issues.push(`${p.id}: full translation mismatch`);
  if((p.questions||[]).length!==5||(p.questionSetB||[]).length!==5)issues.push(`${p.id}: A/B count`);
  for(const q of [...(p.questions||[]),...(p.questionSetB||[])]){if(!q.prompt||!q.answer||!q.evidence||!q.evidenceJp||!q.reason)issues.push(`${p.id}: missing question field`);const i=(p.sentences||[]).indexOf(q.evidence);if(i<0)issues.push(`${p.id}: evidence not in body`);else if(p.slashRows[i].jp!==q.evidenceJp)issues.push(`${p.id}: evidence JP mismatch`);}
  if(p.registered!==false)issues.push(`${p.id}: draft must stay unregistered`);
 }
 const report={batch:'Batch05',passages:ps.length,grades,uniqueIds:ids.size,lengthIssues,structureIssues:issues,finalPass:lengthIssues.length===0&&issues.length===0};
 fs.writeFileSync('v11_batch05_full_draft_audit_report.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));if(!report.finalPass)process.exit(1);
}catch(e){console.error(e);process.exit(1);}
