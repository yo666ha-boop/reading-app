/* v11 FINAL32 candidate runtime bundle: assemble exactly 32 fully-gated passages without registering them. */
(function buildV11Final32Runtime(){
'use strict';
if(window.V11_FINAL32_RUNTIME_READY)return;
const bodyFiles=[
'V11_FINAL32_BODY_TRANSLATION_DRAFT_G1_001_008.json','V11_FINAL32_BODY_TRANSLATION_DRAFT_G1_009_011.json',
'V11_FINAL32_BODY_TRANSLATION_DRAFT_G2_001_008.json','V11_FINAL32_BODY_TRANSLATION_DRAFT_G2_009_011.json',
'V11_FINAL32_BODY_TRANSLATION_DRAFT_G3_001_010.json'];
const questionFiles=[
'V11_FINAL32_QUESTIONS_HUMAN_G1_001_005.json','V11_FINAL32_QUESTIONS_HUMAN_G1_006_011.json',
'V11_FINAL32_QUESTIONS_HUMAN_G2_001_006.json','V11_FINAL32_QUESTIONS_HUMAN_G2_007_011.json',
'V11_FINAL32_QUESTIONS_HUMAN_G3_001_005.json','V11_FINAL32_QUESTIONS_HUMAN_G3_006_010.json'];
const noteFiles=['V11_FINAL32_G1_NOTES_NORMAL_EASY.json','V11_FINAL32_G2_NOTES_NORMAL_EASY.json','V11_FINAL32_G3_NOTES_NORMAL_EASY.json'];
const ids=[];for(const [g,n] of [['G1',11],['G2',11],['G3',10]])for(let i=1;i<=n;i++)ids.push(`V11-F32-${g}-${String(i).padStart(3,'0')}`);
const glossFiles=ids.map(id=>`V11_FINAL32_REQUIRED_LOCAL_GLOSS_${id.replace('V11-F32-','').replaceAll('-','_')}.json`);
async function load(path){const r=await fetch('./'+path,{cache:'no-store'});if(!r.ok)throw new Error(`FINAL32 artifact load failed ${path}: ${r.status}`);return r.json();}
function metaFor(id){
 const m=/^V11-F32-G([123])-(\d{3})$/.exec(String(id||''));if(!m)throw new Error('FINAL32 invalid id '+id);
 const grade=m[1],seq=Number(m[2]),book=seq%2===1?'SS':'NH';
 const verified={1:{SS:'PROGRAM 10-2',NH:'Unit 10-2'},2:{SS:'PROGRAM 8-3',NH:'Unit 7-4'},3:{SS:'PROGRAM 7-3',NH:'Unit 6-4'}}[grade];
 const section=verified[book];
 return {textbook:book==='SS'?'サンシャイン':'ニューホライズン',grade,section,anchor:{textbook:book==='SS'?'Sunshine':'New Horizon',grade:Number(grade),unit:section}};
}
function qnorm(x,set,i,id){
 const out={...x,prompt:String(x&&x.prompt||x&&x.question||'').trim(),set,no:i+1};
 for(const k of ['prompt','answer','evidence','evidenceJp','reason'])if(!String(out[k]||'').trim())throw new Error(`FINAL32 ${id} ${set}${i+1} missing ${k}`);
 return out;
}
function runtimeNote(x){
 const english=String(x&&x.english||x&&x.expression||x&&x.word||'').trim();
 const japanese=String(x&&x.japanese||x&&x.jp||x&&x.gloss||'').trim();
 return english&&japanese?{english,japanese}:null;
}
function uniqueNotes(rows){const map=new Map();for(const x of rows.map(runtimeNote).filter(Boolean)){const k=x.english.toLowerCase();if(!map.has(k))map.set(k,x);}return [...map.values()];}
function jpSegments(s){return (String(s||'').match(/[^。！？]+[。！？]?/g)||[]).map(x=>x.trim()).filter(Boolean);}
window.V11_FINAL32_RUNTIME_READY=(async()=>{
 const [bodies,questions,notes,glosses]=await Promise.all([
  Promise.all(bodyFiles.map(load)),Promise.all(questionFiles.map(load)),Promise.all(noteFiles.map(load)),Promise.all(glossFiles.map(load))
 ]);
 const bodyItems=bodies.flatMap(x=>x.items||[]),qItems=questions.flatMap(x=>x.items||[]),noteItems=notes.flatMap(x=>x.items||[]);
 const byQ=new Map(qItems.map(x=>[x.id,x])),byN=new Map(noteItems.map(x=>[x.id,x])),byG=new Map(glosses.map(x=>[x.passageId,x]));
 if(bodyItems.length!==32||new Set(bodyItems.map(x=>x.id)).size!==32)throw new Error(`FINAL32 body coverage invalid ${bodyItems.length}`);
 if(qItems.length!==32||noteItems.length!==32||glosses.length!==32)throw new Error(`FINAL32 support coverage invalid q=${qItems.length} notes=${noteItems.length} gloss=${glosses.length}`);
 const out=bodyItems.map(b=>{
  const q=byQ.get(b.id),n=byN.get(b.id),g=byG.get(b.id);if(!q||!n||!g)throw new Error('FINAL32 support missing '+b.id);
  if((q.questionsA||[]).length!==5||(q.questionsB||[]).length!==5)throw new Error('FINAL32 A/B count invalid '+b.id);
  const en=String(b.slash||'').split(' / ').map(x=>x.trim()).filter(Boolean),jp=jpSegments(b.fullTranslation);
  if(!en.length||en.length!==jp.length)throw new Error(`FINAL32 slash JP alignment invalid ${b.id} en=${en.length} jp=${jp.length}`);
  const slashRows=en.map((x,i)=>({en:x,jp:jp[i],humanReview:'FINAL32_SYNCED_BODY_TRANSLATION',alignmentShape:'1:1'}));
  if(en.join(' ')!==String(b.body||'').trim())throw new Error('FINAL32 slash body reconstruction invalid '+b.id);
  const questions=(q.questionsA||[]).map((x,i)=>qnorm(x,'A',i,b.id)),questionSetB=(q.questionsB||[]).map((x,i)=>qnorm(x,'B',i,b.id));
  const normalNotes=n.normalNotes||[],easyNotes=n.easyNotes||[],requiredLocalNotes=n.requiredLocalNotes||[],requiredLocal=g.requiredLocal||[];
  const runtimeNotes=uniqueNotes([...normalNotes,...requiredLocalNotes,...requiredLocal]);
  const supportNotes=uniqueNotes(easyNotes).filter(x=>!runtimeNotes.some(n0=>n0.english.toLowerCase()===x.english.toLowerCase()));
  const meta=metaFor(b.id);
  const p={...b,...meta,batch:'V11-FINAL32',registered:false,genre:b.genre||'report',sentences:en,slashRows,questions,questionSetB,questionsA:questions,questionsB:questionSetB,notes:runtimeNotes,supportNotes,supportNotesVersion:'20260929-final32-r1',normalNotes,easyNotes,requiredLocal,finalHumanQuestionReview:true,finalSlashHumanReview:'FINAL32_SYNCED_PASS'};
  if(typeof window.V11_VALIDATE_PASSAGE==='function')window.V11_VALIDATE_PASSAGE(p);
  return p;
 });
 window.V11_FINAL32_PASSAGES=out;
 window.V11_FINAL32_RUNTIME_BUNDLE_READY=true;
 return out;
})();
})();