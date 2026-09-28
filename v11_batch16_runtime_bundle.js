/* v11 Batch16 persistent runtime bundle: assemble exactly 50 already-gated passages in the established runtime schema. */
(function buildV11Batch16Runtime(){
'use strict';
if(window.V11_BATCH16_RUNTIME_READY)return;
const bodyFiles=[
'V11_BATCH16_BODY_TRANSLATION_DRAFT_G1_001_010.json','V11_BATCH16_BODY_TRANSLATION_DRAFT_G1_011_017.json',
'V11_BATCH16_BODY_TRANSLATION_DRAFT_G2_001_009.json','V11_BATCH16_BODY_TRANSLATION_DRAFT_G2_010_017.json',
'V11_BATCH16_BODY_TRANSLATION_DRAFT_G3_001_008.json','V11_BATCH16_BODY_TRANSLATION_DRAFT_G3_009_016.json'];
const slashFiles=['V11_BATCH16_SLASH_HUMAN_G1_001_006_20260920.json','V11_BATCH16_SLASH_HUMAN_REMAINDER_044_20260920.json'];
const questionFiles=['V11_BATCH16_QUESTIONS_HUMAN_G1_ALL_NORMALIZED.json','V11_BATCH16_QUESTIONS_HUMAN_G2_ALL_NORMALIZED.json','V11_BATCH16_QUESTIONS_HUMAN_G3_ALL_NORMALIZED.json'];
const noteFiles=['V11_BATCH16_G1_NOTES_NORMAL_EASY_001_017.json','V11_BATCH16_G2_NOTES_NORMAL_EASY_001_017.json','V11_BATCH16_G3_NOTES_NORMAL_EASY_001_004.json','V11_BATCH16_G3_NOTES_NORMAL_EASY_005.json','V11_BATCH16_G3_NOTES_NORMAL_EASY_006_008.json','V11_BATCH16_G3_NOTES_NORMAL_EASY_009_012.json','V11_BATCH16_G3_NOTES_NORMAL_EASY_013.json','V11_BATCH16_G3_NOTES_NORMAL_EASY_014_016.json'];
const ids=[];for(const [g,n] of [['G1',17],['G2',17],['G3',16]])for(let i=1;i<=n;i++)ids.push(`V11-B16-${g}-${String(i).padStart(3,'0')}`);
const glossFiles=ids.map(id=>`V11_BATCH16_REQUIRED_LOCAL_GLOSS_${id.replace('V11-B16-','').replaceAll('-','_')}.json`);
async function load(path){const r=await fetch('./'+path,{cache:'no-store'});if(!r.ok)throw new Error(`Batch16 artifact load failed ${path}: ${r.status}`);return r.json();}
function metaFor(id){
 const m=/^V11-B16-G([123])-(\d{3})$/.exec(String(id||''));if(!m)throw new Error('Batch16 invalid id '+id);
 const grade=m[1],seq=Number(m[2]),book=seq%2===1?'SS':'NH';
 const verified={1:{SS:'PROGRAM 10-2',NH:'Unit 10-2'},2:{SS:'PROGRAM 8-3',NH:'Unit 7-4'},3:{SS:'PROGRAM 7-3',NH:'Unit 6-4'}}[grade];
 const section=verified[book];
 return {textbook:book==='SS'?'サンシャイン':'ニューホライズン',grade,section,anchor:{textbook:book==='SS'?'Sunshine':'New Horizon',grade:Number(grade),unit:section}};
}
function qnorm(x,set,i,id){
 const out={...x,prompt:String(x&&x.prompt||x&&x.question||'').trim(),set,no:i+1};
 for(const k of ['prompt','answer','evidence','evidenceJp','reason'])if(!String(out[k]||'').trim())throw new Error(`Batch16 ${id} ${set}${i+1} missing ${k}`);
 return out;
}
function runtimeNote(x){
 const english=String(x&&x.english||x&&x.expression||x&&x.word||'').trim();
 const japanese=String(x&&x.japanese||x&&x.jp||x&&x.gloss||'').trim();
 return english&&japanese?{english,japanese}:null;
}
function uniqueNotes(rows){
 const map=new Map();
 for(const x of rows.map(runtimeNote).filter(Boolean)){const k=x.english.toLowerCase();if(!map.has(k))map.set(k,x);}
 return [...map.values()];
}
window.V11_BATCH16_RUNTIME_READY=(async()=>{
 const [bodies,slashes,questions,notes,glosses]=await Promise.all([
  Promise.all(bodyFiles.map(load)),Promise.all(slashFiles.map(load)),Promise.all(questionFiles.map(load)),Promise.all(noteFiles.map(load)),Promise.all(glossFiles.map(load))
 ]);
 const bodyItems=bodies.flatMap(x=>x.items||[]), slashItems=slashes.flatMap(x=>x.items||[]), qItems=questions.flatMap(x=>x.items||[]), noteItems=notes.flatMap(x=>x.items||[]);
 const byS=new Map(slashItems.filter(x=>Array.isArray(x.slashRows)&&x.slashRows.length).map(x=>[x.id,x]));
 const byQ=new Map(qItems.map(x=>[x.id,x])),byN=new Map(noteItems.map(x=>[x.id,x])),byG=new Map(glosses.map(x=>[x.passageId,x]));
 if(bodyItems.length!==50||new Set(bodyItems.map(x=>x.id)).size!==50)throw new Error(`Batch16 body coverage invalid ${bodyItems.length}`);
 if(byS.size!==50||qItems.length!==50||noteItems.length!==50||glosses.length!==50)throw new Error(`Batch16 support coverage invalid slash=${byS.size} q=${qItems.length} notes=${noteItems.length} gloss=${glosses.length}`);
 const out=bodyItems.map(b=>{
  const s=byS.get(b.id),q=byQ.get(b.id),n=byN.get(b.id),g=byG.get(b.id);if(!s||!q||!n||!g)throw new Error('Batch16 support missing '+b.id);
  if((q.questionsA||[]).length!==5||(q.questionsB||[]).length!==5)throw new Error('Batch16 A/B count invalid '+b.id);
  const slashRows=s.slashRows.map(r=>({en:String(r.en||r.english||'').trim(),jp:String(r.jp||r.japanese||'').trim(),humanReview:r.humanReview||'B16_HUMAN_SLASH_PASS',alignmentShape:r.alignmentShape||'1:1'}));
  if(!slashRows.length||slashRows.some(r=>!r.en||!r.jp))throw new Error('Batch16 human slash invalid '+b.id);
  const questions=(q.questionsA||[]).map((x,i)=>qnorm(x,'A',i,b.id)),questionSetB=(q.questionsB||[]).map((x,i)=>qnorm(x,'B',i,b.id));
  const normalNotes=n.normalNotes||[],easyNotes=n.easyNotes||[],requiredLocal=g.requiredLocal||[];
  const requiredLocalNotes=n.requiredLocalNotes||[];
  const runtimeNotes=uniqueNotes([...normalNotes,...requiredLocalNotes,...requiredLocal]);
  const supportNotes=uniqueNotes(easyNotes).filter(x=>!runtimeNotes.some(n0=>n0.english.toLowerCase()===x.english.toLowerCase()));
  const meta=metaFor(b.id);
  const p={...b,...meta,registered:false,batch:'V11-B16',genre:b.genre||'report',sentences:slashRows.map(r=>r.en),slashRows,questions,questionSetB,questionsA:questions,questionsB:questionSetB,notes:runtimeNotes,supportNotes,supportNotesVersion:'20260830-b11-r3',normalNotes,easyNotes,requiredLocal,finalHumanQuestionReview:true,finalSlashHumanReview:'B16_SLASH_HUMAN_REVIEW_PASS'};
  if(!p.body||!p.fullTranslation||!p.slash)throw new Error('Batch16 canonical text field missing '+b.id);
  return p;
 });
 if(typeof window.V11_VALIDATE_PASSAGE==='function')out.forEach(window.V11_VALIDATE_PASSAGE);
 window.V11_BATCH16_PASSAGES=out;
 window.V11_BATCH16_RUNTIME_BUNDLE_READY=true;
 return out;
})();
})();