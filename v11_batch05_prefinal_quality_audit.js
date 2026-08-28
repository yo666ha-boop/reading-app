const fs=require('fs'),vm=require('vm');
function run(s,f){vm.runInContext(fs.readFileSync(f,'utf8'),s,{filename:f});}
function words(s){return (String(s||'').match(/[A-Za-z]+(?:['’][A-Za-z]+)?/g)||[]).length;}
try{
 const s={window:{},console};s.globalThis=s.window;vm.createContext(s);
 for(const f of ['v11_batch05_passages_draft_g1.js','v11_batch05_passages_draft_g2.js','v11_batch05_passages_draft_g3.js','v11_batch05_grammar_repair.js','v11_batch05_grammar_repair_r2.js','v11_batch05_chronology_repair.js','v11_batch05_notes_finalize.js','v11_batch05_translation_sync.js','v11_batch05_question_regenerate.js'])run(s,f);
 const ps=[...(s.window.V11_BATCH05_G1_PASSAGES||[]),...(s.window.V11_BATCH05_G2_PASSAGES||[]),...(s.window.V11_BATCH05_G3_PASSAGES||[])];
 const lengthIssues=[],structureIssues=[],translationIssues=[],questionIssues=[],temporaryGlossPassages=[],temporaryGlossCountByPassage=[];
 for(const p of ps){
  const wc=words((p.sentences||[]).join(' ')),band=p.targetWordBand||[];
  if(band.length!==2||wc<+band[0]||wc>+band[1])lengthIssues.push({id:p.id,wc,band});
  if(p.wordCount!==wc)structureIssues.push({id:p.id,reason:'wordCount stale',stored:p.wordCount,actual:wc});
  if(!Array.isArray(p.sentences)||!p.sentences.length||!Array.isArray(p.slashRows)||p.sentences.length!==p.slashRows.length)structureIssues.push({id:p.id,reason:'sentence/slash mismatch'});
  if((p.slashRows||[]).some(x=>!x||!x.en||!x.jp))structureIssues.push({id:p.id,reason:'empty slash en/jp'});
  const full=(p.slashRows||[]).map(x=>x&&x.jp||'').join('');if(String(p.fullTranslation||'')!==full)translationIssues.push({id:p.id,reason:'fullTranslation/slash jp mismatch'});
  if(p.translationSync!=='B05_POST_GRAMMAR_SYNC_20260829')translationIssues.push({id:p.id,reason:'translation sync marker'});
  let temp=0;for(const n of (p.notes||[]))if(!n||!n.english||!n.japanese||String(n.japanese).includes('最終注整理対象'))temp++;if(temp){temporaryGlossPassages.push(p.id);temporaryGlossCountByPassage.push({id:p.id,count:temp});}
  const qs=[...(p.questions||[]),...(p.questionSetB||[])];if(qs.length!==10)questionIssues.push({id:p.id,reason:'question count '+qs.length});
  const ev=new Set(),prompts=new Set();for(const q of qs){if(!q||!q.prompt||!q.answer||!q.evidence||!q.evidenceJp||!q.reason){questionIssues.push({id:p.id,reason:'missing question field'});continue;}if(!(p.sentences||[]).includes(q.evidence))questionIssues.push({id:p.id,reason:'evidence not in body'});const idx=(p.sentences||[]).indexOf(q.evidence),jp=idx>=0&&p.slashRows[idx]&&p.slashRows[idx].jp;if(jp!==q.evidenceJp)questionIssues.push({id:p.id,reason:'evidence jp mismatch'});if(q.answer!==q.evidence)questionIssues.push({id:p.id,reason:'answer/evidence mismatch'});ev.add(q.evidence);prompts.add(String(q.prompt).replace(/^\d+\.\s*/,''));}if(qs.length===10&&ev.size!==10)questionIssues.push({id:p.id,reason:'evidence diversity '+ev.size});if(qs.length===10&&prompts.size!==10)questionIssues.push({id:p.id,reason:'prompt diversity '+prompts.size});
 }
 const out={generatedAt:new Date().toISOString(),passages:ps.length,lengthIssues,structureIssues,translationIssues,questionIssues,temporaryGlossPassages:[...new Set(temporaryGlossPassages)],temporaryGlossCount:temporaryGlossCountByPassage.reduce((a,x)=>a+x.count,0),temporaryGlossCountByPassage,noteFinalizeState:s.window.V11_BATCH05_NOTE_FINALIZE_STATE||null,translationSyncState:s.window.V11_BATCH05_TRANSLATION_SYNC_STATE||null,questionRegenState:s.window.V11_BATCH05_QUESTION_REGEN_STATE||null,registrationReady:false};
 out.registrationReady=ps.length===50&&!lengthIssues.length&&!structureIssues.length&&!translationIssues.length&&!questionIssues.length&&!out.temporaryGlossPassages.length&&!!(out.noteFinalizeState&&out.noteFinalizeState.ready)&&!!(out.translationSyncState&&out.translationSyncState.ready)&&!!(out.questionRegenState&&out.questionRegenState.ready);
 fs.writeFileSync('V11_BATCH05_PREFINAL_QUALITY_AUDIT.json',JSON.stringify(out,null,2)+'\n');
 console.log(JSON.stringify({passages:out.passages,lengthIssues:lengthIssues.length,structureIssues:structureIssues.length,translationIssues:translationIssues.length,questionIssues:questionIssues.length,temporaryGlossPassages:out.temporaryGlossPassages.length,temporaryGlossCount:out.temporaryGlossCount,noteFinalizeState:out.noteFinalizeState,translationSyncState:out.translationSyncState,questionRegenState:out.questionRegenState,registrationReady:out.registrationReady},null,2));
 if(out.registrationReady)process.exitCode=0; else process.exitCode=1;
}catch(e){console.error(e.stack||e);process.exitCode=1;}
