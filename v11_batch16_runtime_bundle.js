/* v11 Batch16 runtime bundle: assemble exactly 50 gated passages from locked artifacts. */
(function buildV11Batch16Runtime(){
'use strict';
const bodyFiles=[
'V11_BATCH16_BODY_TRANSLATION_DRAFT_G1_001_010.json','V11_BATCH16_BODY_TRANSLATION_DRAFT_G1_011_017.json',
'V11_BATCH16_BODY_TRANSLATION_DRAFT_G2_001_009.json','V11_BATCH16_BODY_TRANSLATION_DRAFT_G2_010_017.json',
'V11_BATCH16_BODY_TRANSLATION_DRAFT_G3_001_008.json','V11_BATCH16_BODY_TRANSLATION_DRAFT_G3_009_016.json'];
const questionFiles=['V11_BATCH16_QUESTIONS_HUMAN_G1_ALL_NORMALIZED.json','V11_BATCH16_QUESTIONS_HUMAN_G2_ALL_NORMALIZED.json','V11_BATCH16_QUESTIONS_HUMAN_G3_ALL_NORMALIZED.json'];
const noteFiles=['V11_BATCH16_G1_NOTES_NORMAL_EASY_001_017.json','V11_BATCH16_G2_NOTES_NORMAL_EASY_001_017.json','V11_BATCH16_G3_NOTES_NORMAL_EASY_001_004.json','V11_BATCH16_G3_NOTES_NORMAL_EASY_005.json','V11_BATCH16_G3_NOTES_NORMAL_EASY_006_008.json','V11_BATCH16_G3_NOTES_NORMAL_EASY_009_012.json','V11_BATCH16_G3_NOTES_NORMAL_EASY_013.json','V11_BATCH16_G3_NOTES_NORMAL_EASY_014_016.json'];
const ids=[]; for(const [g,n] of [['G1',17],['G2',17],['G3',16]])for(let i=1;i<=n;i++)ids.push(`V11-B16-${g}-${String(i).padStart(3,'0')}`);
const glossFiles=ids.map(id=>`V11_BATCH16_REQUIRED_LOCAL_GLOSS_${id.replace('V11-B16-','').replaceAll('-','_')}.json`);
async function load(path){const r=await fetch(path,{cache:'no-store'});if(!r.ok)throw new Error(`Batch16 artifact load failed ${path}: ${r.status}`);return r.json();}
window.V11_BATCH16_RUNTIME_READY=(async()=>{
 const [bodies,questions,notes,glosses]=await Promise.all([Promise.all(bodyFiles.map(load)),Promise.all(questionFiles.map(load)),Promise.all(noteFiles.map(load)),Promise.all(glossFiles.map(load))]);
 const bodyItems=bodies.flatMap(x=>x.items||[]), qItems=questions.flatMap(x=>x.items||[]), noteItems=notes.flatMap(x=>x.items||[]);
 const byQ=new Map(qItems.map(x=>[x.id,x])), byN=new Map(noteItems.map(x=>[x.id,x])), byG=new Map(glosses.map(x=>[x.passageId,x]));
 if(bodyItems.length!==50||new Set(bodyItems.map(x=>x.id)).size!==50)throw new Error(`Batch16 body coverage invalid ${bodyItems.length}`);
 if(qItems.length!==50||noteItems.length!==50||glosses.length!==50)throw new Error(`Batch16 support coverage invalid q=${qItems.length} notes=${noteItems.length} gloss=${glosses.length}`);
 const out=bodyItems.map(b=>{const q=byQ.get(b.id),n=byN.get(b.id),g=byG.get(b.id);if(!q||!n||!g)throw new Error(`Batch16 support missing ${b.id}`);if((q.questionsA||[]).length!==5||(q.questionsB||[]).length!==5)throw new Error(`Batch16 A/B count invalid ${b.id}`);return {...b,questionsA:q.questionsA,questionsB:q.questionsB,normalNotes:n.normalNotes||[],easyNotes:n.easyNotes||[],requiredLocal:g.requiredLocal||[]};});
 if(out.some(p=>!p.body||!p.fullTranslation||!p.slash))throw new Error('Batch16 canonical text field missing');
 window.V11_BATCH16_PASSAGES=out; window.V11_BATCH16_RUNTIME_BUNDLE_READY=true; return out;
})();
})();
