(function repairV11Batch04LengthR2(){
'use strict';
const ps=[...(window.V11_BATCH04_G1_PASSAGES||[]),...(window.V11_BATCH04_G2_PASSAGES||[]),...(window.V11_BATCH04_G3_PASSAGES||[])];
function slash(en){return en.replace(/, /g,', / ').replace(/\b(and|but|because|so|before|after|until|then|when|while|although)\b/gi,'/ $1');}
function replaceRow(p,oldEn,newEn,oldJp,newJp){
 const i=p.sentences.indexOf(oldEn);if(i<0)throw new Error(`${p.id}: sentence not found for r2`);
 p.sentences[i]=newEn;
 if(!p.slashRows[i])throw new Error(`${p.id}: slash row missing for r2`);
 p.slashRows[i]={en:slash(newEn),jp:newJp};
 if(!String(p.fullTranslation).includes(oldJp))throw new Error(`${p.id}: translation not found for r2`);
 p.fullTranslation=String(p.fullTranslation).replace(oldJp,newJp);
 p.wordCount=(p.sentences.join(' ').match(/[A-Za-z]+(?:['’][A-Za-z]+)?/g)||[]).length;
 p.auditNote+=' Batch04 r2 one-word trim applied to keep the passage inside the normal band.';
}
let changed=0;
for(const p of ps){
 if(p.id==='V11-NH-G3-U6-4-029'){
   replaceRow(p,
    'I wrote an email to a student I had met during an international exchange activity.',
    'I wrote an email to a student I had met during an exchange activity.',
    '国際交流活動で会った生徒にメールを書きました。',
    '交流活動で会った生徒にメールを書きました。');changed++;
 }
 if(p.id==='V11-NH-G3-U6-4-033'){
   replaceRow(p,
    'The second route followed a larger street with stores, streetlights, and more people.',
    'The second route followed a street with stores, streetlights, and more people.',
    '二つ目の道は、店や街灯、人通りの多い大きな通りを進むものでした。',
    '二つ目の道は、店や街灯、人通りの多い通りを進むものでした。');changed++;
 }
 if(p.id==='V11-SS-G2-P8-3-028'){
   const bad='試合前に十分钟、新しい配置を練習しました。',good='試合前に十分間、新しい配置を練習しました。';
   if(String(p.fullTranslation).includes(bad))p.fullTranslation=String(p.fullTranslation).replace(bad,good);
   for(const r of p.slashRows||[])if(r.jp===bad)r.jp=good;
 }
}
if(changed!==2)throw new Error('Batch04 r2 trim count '+changed);
window.V11_BATCH04_LENGTH_REPAIR_R2_STATE={version:'20260828-r2',changed,translationTypoFixed:true,registered:false};
})();