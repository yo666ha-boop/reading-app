(function repairV11Batch09G1Length(){
'use strict';
const ps=window.V11_BATCH09_G1_DRAFTS||[];
const p=ps.find(x=>x.id==='V11-B09-G1-004');
if(!p) throw new Error('V11-B09-G1-004 not found');
const old='They learned that objects in a picture can show time order better than brightness or color.';
const neu='They learned that picture details can show time order better than color.';
const jp='写真の細部は、色より時間の順序をよく示すことがあると学びました。';
const i=p.sentences.indexOf(old); if(i<0) throw new Error('target sentence not found');
p.sentences[i]=neu;p.slashRows[i]={en:neu,jp};p.fullTranslation=p.slashRows.map(r=>r.jp).join('');
for(const q of [...p.questions,...p.questionSetB]){if(q.evidence===old){q.evidence=neu;q.evidenceJp=jp;q.answer=jp;}}
p.wordCount=(p.sentences.join(' ').match(/[A-Za-z]+(?:['’][A-Za-z]+)?/g)||[]).length;
window.V11_BATCH09_G1_LENGTH_REPAIR={id:p.id,wordCount:p.wordCount};
})();