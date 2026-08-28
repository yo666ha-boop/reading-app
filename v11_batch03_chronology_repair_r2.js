(function repairV11Batch03ChronologyR2(){
'use strict';
const ps=[window.V11_BATCH03_DRAFT_G1_PASSAGES,window.V11_BATCH03_DRAFT_G2_PASSAGES,window.V11_BATCH03_DRAFT_G3_PASSAGES].flatMap(x=>Array.isArray(x)?x:[]);
if(ps.length!==50)throw new Error('Batch03 50 passages missing before chronology r2');
const add={
 'V11-SS-G1-P10-2-021':['started'],
 'V11-SS-G1-P10-2-022':['difference','between'],
 'V11-SS-G1-P10-2-025':['began'],
 'V11-NH-G1-U10-2-027':['rule'],
 'V11-SS-G2-P8-3-018':['safely'],
 'V11-NH-G2-U7-4-022':['point'],
 'V11-SS-G3-P7-3-023':['appearance']
};
function slash(en){return String(en).replace(/, /g,', / ').replace(/\b(and|but|because|so|before|after|until|then|when|while)\b/gi,'/ $1');}
let notesAdded=0,changed=0;
for(const p of ps){
 const rows=(p.sentences||[]).map((en,i)=>({en,jp:(p.slashRows&&p.slashRows[i]&&p.slashRows[i].jp)||''}));
 for(const r of rows){if(r.en==='The teacher told me the day of the picture.'){r.en='I learned the day of the picture from the teacher.';changed++;}}
 p.sentences=rows.map(r=>r.en);p.fullTranslation=rows.map(r=>r.jp).join('');p.slashRows=rows.map(r=>({en:slash(r.en),jp:r.jp}));
 p.wordCount=(p.sentences.join(' ').match(/[A-Za-z]+(?:['’][A-Za-z]+)?/g)||[]).length;
 p.notes=Array.isArray(p.notes)?p.notes:[];const have=new Set(p.notes.map(n=>String(n&&n.english||'').replace(/[’]/g,"'").toLowerCase()));
 for(const w of (add[p.id]||[])){if(have.has(w))continue;p.notes.push({english:w,japanese:'本文で必要な語（最終注整理対象）',kind:'unlearned_local_required',source:'v11 Batch03 chronology repair r2; temporary required-local note pending final gloss/prune audit'});have.add(w);notesAdded++;}
}
window.V11_BATCH03_CHRONOLOGY_REPAIR_R2_STATE={version:'20260828-r2',count:ps.length,notesAdded,changed,registered:false,temporaryGlosses:true,questionsPending:true};
})();