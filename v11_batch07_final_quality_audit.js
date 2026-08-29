'use strict';
const fs=require('fs'),vm=require('vm');
function run(s,f){vm.runInContext(fs.readFileSync(f,'utf8'),s,{filename:f});}
function words(x){return(String(x||'').match(/[A-Za-z]+(?:['’][A-Za-z]+)?/g)||[]).length;}
function jac(a,b){a=new Set(a);b=new Set(b);let n=0;for(const x of a)if(b.has(x))n++;return n/(a.size+b.size-n||1);}
const s={window:{},console};s.globalThis=s.window;vm.createContext(s);
const files=['v11_batch07_passages_draft_g1.js','v11_batch07_g1_semantic_repair.js','v11_batch07_passages_draft_g2.js','v11_batch07_g2_semantic_repair.js','v11_batch07_standard_draft_g3.js','v11_batch07_standard_semantic_repair.js','v11_batch07_long_draft_g3.js','v11_batch07_long_semantic_repair.js','v11_batch07_yamaguchi_exam_draft_g3.js','v11_batch07_yamaguchi_semantic_repair.js','v11_batch07_yamaguchi_exam_evidence_sync.js','v11_batch07_grammar_repair.js','v11_batch07_grammar_repair_r3.js','v11_batch07_vocab_repair.js','v11_batch06_canonical_gloss.js','v11_batch07_notes_finalize.js'];
for(const f of files)run(s,f);
const ps=[...(s.window.V11_BATCH07_G1_DRAFTS||[]),...(s.window.V11_BATCH07_G2_DRAFTS||[]),...(s.window.V11_BATCH07_STANDARD_DRAFTS||[]),...(s.window.V11_BATCH07_LONG_DRAFTS||[]),...(s.window.V11_BATCH07_YAMAGUCHI_EXAM_DRAFTS||[])];
const lengthIssues=[],structureIssues=[],translationIssues=[],questionIssues=[],noteIssues=[],highShared=[],tierCounts={G1:0,G2:0,G3_STANDARD:0,G3_LONG:0,G3_YAMAGUCHI_EXAM:0};
for(const p of ps){
 const wc=words((p.sentences||[]).join(' '));
 let band=p.targetWordBand||[];
 const id=String(p.id||'');
 if(id.includes('-G1-')){tierCounts.G1++;if(!band.length)band=[90,165];}
 else if(id.includes('-G2-')){tierCounts.G2++;if(!band.length)band=[115,210];}
 else if((s.window.V11_BATCH07_YAMAGUCHI_EXAM_DRAFTS||[]).some(x=>x.id===p.id)){tierCounts.G3_YAMAGUCHI_EXAM++;band=[330,450];}
 else if((s.window.V11_BATCH07_LONG_DRAFTS||[]).some(x=>x.id===p.id)){tierCounts.G3_LONG++;band=[240,330];}
 else {tierCounts.G3_STANDARD++;if(!band.length)band=[150,230];}
 if(band.length===2&&(wc<+band[0]||wc>+band[1]))lengthIssues.push({id:p.id,wc,band});
 if(p.wordCount!=null&&+p.wordCount!==wc)structureIssues.push({id:p.id,reason:'wordCount stale',stored:p.wordCount,actual:wc});
 if(!Array.isArray(p.sentences)||!Array.isArray(p.slashRows)||p.sentences.length!==p.slashRows.length)structureIssues.push({id:p.id,reason:'sentence/slash mismatch'});
 for(let i=0;i<(p.sentences||[]).length;i++){const r=p.slashRows[i];if(!r||!r.en||!r.jp||r.en!==p.sentences[i])structureIssues.push({id:p.id,reason:'slash row mismatch/empty',i});}
 const full=(p.slashRows||[]).map(x=>x&&x.jp||'').join('');if(String(p.fullTranslation||'')!==full)translationIssues.push({id:p.id,reason:'fullTranslation/slash jp mismatch'});
 for(const n of(p.notes||[])){const jp=String(n&&n.japanese||'');if(!n||!n.english||!jp||jp.includes('最終注整理対象')||n.kind==='temporary_vocab_inventory'||(/^[\x00-\x7F\s・,./()'-]+$/.test(jp)&&/[A-Za-z]/.test(jp)))noteIssues.push({id:p.id,n});}
 const A=p.questions||[],B=p.questionSetB||[],qs=[...A,...B];if(A.length!==5||B.length!==5)questionIssues.push({id:p.id,reason:`A/B count ${A.length}/${B.length}`});
 const ev=new Set(),pr=new Set();for(const q of qs){if(!q||!q.prompt||!q.answer||!q.evidence||!q.evidenceJp||!q.reason)questionIssues.push({id:p.id,reason:'missing field',q});const idx=(p.sentences||[]).indexOf(q&&q.evidence);if(idx<0)questionIssues.push({id:p.id,reason:'evidence not in body',q});else if((p.slashRows[idx]||{}).jp!==q.evidenceJp)questionIssues.push({id:p.id,reason:'evidence jp mismatch',q});ev.add(q&&q.evidence);pr.add(String(q&&q.prompt||'').replace(/^\d+\.\s*/,''));}
 if(qs.length===10){const expected=Math.min(10,(p.sentences||[]).length);if(ev.size<expected)questionIssues.push({id:p.id,reason:`evidence diversity ${ev.size} expected>=${expected}`});if(pr.size!==10)questionIssues.push({id:p.id,reason:`prompt diversity ${pr.size}`});}
}
for(let i=0;i<ps.length;i++)for(let j=i+1;j<ps.length;j++){const a=ps[i],b=ps[j];if(a.textbook!==b.textbook||a.grade!==b.grade||a.section!==b.section)continue;const score=jac(a.sentences||[],b.sentences||[]);if(score>=.85)highShared.push({a:a.id,b:b.id,score});}
const tierOK=tierCounts.G1===17&&tierCounts.G2===17&&tierCounts.G3_STANDARD===8&&tierCounts.G3_LONG===4&&tierCounts.G3_YAMAGUCHI_EXAM===4;
const out={generatedAt:new Date().toISOString(),passages:ps.length,tierCounts,tierOK,lengthIssues,structureIssues,translationIssues,questionIssues,noteIssues,highShared,notesFinalize:s.window.V11_BATCH07_NOTES_FINALIZE_STATE,registrationReady:ps.length===50&&tierOK&&!lengthIssues.length&&!structureIssues.length&&!translationIssues.length&&!questionIssues.length&&!noteIssues.length&&!highShared.length};
fs.writeFileSync('V11_BATCH07_FINAL_QUALITY_AUDIT.json',JSON.stringify(out,null,2)+'\n');console.log(JSON.stringify(out,null,2));if(!out.registrationReady)process.exitCode=2;
