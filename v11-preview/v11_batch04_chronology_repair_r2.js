(function repairV11Batch04ChronologyR2(){
'use strict';
const ps=[...(window.V11_BATCH04_G1_PASSAGES||[]),...(window.V11_BATCH04_G2_PASSAGES||[]),...(window.V11_BATCH04_G3_PASSAGES||[])];
if(ps.length!==50)throw new Error('Batch04 50 passages missing before chronology r2');
const add={
'V11-SS-G1-P10-2-027':['choice'],
'V11-SS-G1-P10-2-028':['difficult','easily'],
'V11-SS-G1-P10-2-029':['please'],
'V11-SS-G1-P10-2-030':['happily'],
'V11-SS-G1-P10-2-031':['idea'],
'V11-SS-G1-P10-2-033':['please'],
'V11-NH-G1-U10-2-028':['enough'],
'V11-NH-G1-U10-2-029':['easily','followed'],
'V11-NH-G1-U10-2-032':['quickly'],
'V11-NH-G1-U10-2-036':['easily'],
'V11-SS-G3-P7-3-027':['value']
};
function slash(en){return String(en).replace(/, /g,', / ').replace(/\b(and|but|because|so|before|after|until|then|when|while|although)\b/gi,'/ $1');}
let notesAdded=0,changed=0;
for(const p of ps){
 p.notes=Array.isArray(p.notes)?p.notes:[]; const have=new Set(p.notes.map(n=>String(n&&n.english||'').replace(/[’]/g,"'").toLowerCase()));
 for(const w of (add[p.id]||[])){if(have.has(w))continue;p.notes.push({english:w,japanese:w+'（本文で使用・最終注整理対象）',kind:'unlearned_local_required',source:'v11 Batch04 chronology repair r2; temporary required-local note pending final gloss/prune audit'});have.add(w);notesAdded++;}
 for(let i=0;i<(p.sentences||[]).length;i++){
  if(p.sentences[i]==='We learned an important survey rule: collect opinions and do not tell people which opinion to choose.'){
   p.sentences[i]='We learned an important survey rule: collect opinions and do not choose an opinion for other people.';
   if(p.slashRows&&p.slashRows[i])p.slashRows[i].en=slash(p.sentences[i]); changed++;
  }
 }
 p.wordCount=(p.sentences.join(' ').match(/[A-Za-z]+(?:['’][A-Za-z]+)?/g)||[]).length;
}
if(changed!==1)throw new Error('Batch04 chronology r2 grammar replacement count '+changed);
window.V11_BATCH04_CHRONOLOGY_REPAIR_R2_STATE={version:'20260828-r2',count:ps.length,notesAdded,changed,registered:false,temporaryGlosses:true,questionsPending:true,translationRecheckPending:true};
})();