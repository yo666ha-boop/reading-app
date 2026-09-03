(function repairV11Batch09G3Lengths(){
'use strict';
const ps=window.V11_BATCH09_G3_DRAFTS||[];
function wc(p){p.wordCount=(p.sentences.join(' ').match(/[A-Za-z]+(?:['’][A-Za-z]+)?/g)||[]).length;p.fullTranslation=p.slashRows.map(r=>r.jp).join('');}
function remove(p,en){const i=p.sentences.indexOf(en);if(i<0)throw new Error(`${p.id}: remove target not found`);p.sentences.splice(i,1);p.slashRows.splice(i,1);}
function appendBeforeLast(p,en,jp){const i=Math.max(0,p.sentences.length-1);p.sentences.splice(i,0,en);p.slashRows.splice(i,0,{en,jp});}
const p004=ps.find(p=>p.id==='V11-B09-G3-004');
remove(p004,'That seemed early, but the island visitor center opened at 9:40 and offered a free short program about local fishing.');wc(p004);
const p009=ps.find(p=>p.id==='V11-B09-G3-009');
appendBeforeLast(p009,'They also printed the shared definition above every score column.','さらに共通の定義をすべての採点欄の上に印刷しました。');wc(p009);
const p016=ps.find(p=>p.id==='V11-B09-G3-016');
for(const en of [
'They added a reminder that a shelter should not be chosen only because its straight-line distance looked shortest.',
'Students also placed a phone number for the local emergency information service below the map.',
'They checked the shelter information again with the city website before printing the final version.',
'They posted the guide near the school exits and shared the same information online.'
]) remove(p016,en);wc(p016);
for(const p of [p004,p009,p016]){
 for(const q of [...p.questions,...p.questionSetB]){
  const r=p.slashRows.find(x=>x.en===q.evidence);
  if(!r) throw new Error(`${p.id}: repair removed question evidence`);
  q.evidenceJp=r.jp;
 }
}
window.V11_BATCH09_G3_LENGTH_REPAIR={wordCounts:Object.fromEntries([p004,p009,p016].map(p=>[p.id,p.wordCount]))};
})();