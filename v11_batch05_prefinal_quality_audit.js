const fs=require('fs'),vm=require('vm');
function run(s,f){vm.runInContext(fs.readFileSync(f,'utf8'),s,{filename:f});}
function words(s){return (String(s||'').match(/[A-Za-z]+(?:['’][A-Za-z]+)?/g)||[]).length;}
try{
 const s={window:{},console};s.globalThis=s.window;vm.createContext(s);
 for(const f of ['v11_batch05_passages_draft_g1.js','v11_batch05_passages_draft_g2.js','v11_batch05_passages_draft_g3.js','v11_batch05_grammar_repair.js','v11_batch05_grammar_repair_r2.js','v11_batch05_chronology_repair.js'])run(s,f);
 const ps=[...(s.window.V11_BATCH05_G1_PASSAGES||[]),...(s.window.V11_BATCH05_G2_PASSAGES||[]),...(s.window.V11_BATCH05_G3_PASSAGES||[])];
 const lengthIssues=[],structureIssues=[],translationIssues=[],questionIssues=[],temporaryGlossPassages=[],temporaryGlossCountByPassage=[];
 for(const p of ps){
  const wc=words((p.sentences||[]).join(' ')),band=p.targetWordBand||[];
  if(band.length!==2||wc<+band[0]||wc>+band[1])lengthIssues.push({id:p.id,wc,band});
  if(p.wordCount!==wc)structureIssues.push({id:p.id,reason:'wordCount stale',stored:p.wordCount,actual:wc});
  if(!Array.isArray(p.sentences)||!p.sentences.length||!Array.isArray(p.slashRows)||p.sentences.length!==p.slashRows.length)structureIssues.push({id:p.id,reason:'sentence/slash mismatch'});
  if((p.slashRows||[]).some(x=>!x||!x.en||!x.jp))structureIssues.push({id:p.id,reason:'empty slash en/jp'});
  const full=(p.slashRows||[]).map(x=>x&&x.jp||'').join('');if(String(p.fullTranslation||'')!==full)translationIssues.push({id:p.id,reason:'fullTranslation/slash jp mismatch'});
  let temp=0;for(const n of (p.notes||[]))if(!n||!n.english||!n.japanese||String(n.japanese).includes('最終注整理対象'))temp++;if(temp){temporaryGlossPassages.push(p.id);temporaryGlossCountByPassage.push({id:p.id,count:temp});}
  const qs=[...(p.questions||[]),...(p.questionSetB||[])];if(qs.length!==10)questionIssues.push({id:p.id,reason:'question count '+qs.length});
 }
 const out={generatedAt:new Date().toISOString(),passages:ps.length,lengthIssues,structureIssues,translationIssues,questionIssues,temporaryGlossPassages:[...new Set(temporaryGlossPassages)],temporaryGlossCount:temporaryGlossCountByPassage.reduce((a,x)=>a+x.count,0),temporaryGlossCountByPassage,registrationReady:false};
 out.registrationReady=ps.length===50&&!lengthIssues.length&&!structureIssues.length&&!translationIssues.length&&!questionIssues.length&&!out.temporaryGlossPassages.length;
 fs.writeFileSync('V11_BATCH05_PREFINAL_QUALITY_AUDIT.json',JSON.stringify(out,null,2)+'\n');
 console.log(JSON.stringify({passages:out.passages,lengthIssues:lengthIssues.length,structureIssues:structureIssues.length,translationIssues:translationIssues.length,questionIssues:questionIssues.length,temporaryGlossPassages:out.temporaryGlossPassages.length,temporaryGlossCount:out.temporaryGlossCount,registrationReady:out.registrationReady},null,2));
 if(out.registrationReady)process.exitCode=0; else process.exitCode=1;
}catch(e){console.error(e.stack||e);process.exitCode=1;}
