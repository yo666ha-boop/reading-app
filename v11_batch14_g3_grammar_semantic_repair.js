'use strict';
const fs=require('fs');
const path=require('path');

const repairs={
  'V11-B14-G3-001': {
    bodyOld:'Second, emergency stock was checked only once a month, which made it easy to miss items that were close to their dates.',
    bodyNew:'Second, emergency stock was checked only once a month, so volunteers sometimes missed items that were close to their dates.',
    jpOld:'第二に、非常用備蓄は月に一度しか確認されず、期限が近い物を見落としやすくなっていました。',
    jpNew:'第二に、非常用備蓄は月に一度しか確認されなかったため、ボランティアは期限が近い物を見落とすことがありました。'
  },
  'V11-B14-G3-006': {
    bodyOld:'It also left enough time to return downstairs and reach lunch by 12:10.',
    bodyNew:'It also gave the class time to return downstairs and reach lunch by 12:10.',
    jpOld:'また、階下へ戻って12時10分までに昼食場所へ着く時間もあります。',
    jpNew:'また、クラスには階下へ戻って12時10分までに昼食場所へ着く時間も残ります。'
  },
  'V11-B14-G3-010': {
    bodyOld:'The question also asked whether they had joined at least one activity during the previous three months, not whether they volunteered every month.',
    bodyNew:'The question asked about joining at least one activity during the previous three months. It did not ask about volunteering every month.',
    jpOld:'また質問は「過去3か月に少なくとも一度活動へ参加したか」を尋ねており、毎月ボランティアをしているかを尋ねたものではありませんでした。',
    jpNew:'また質問は、過去3か月に少なくとも一度活動へ参加した経験についてのものでした。毎月ボランティアをしているかを尋ねたものではありませんでした。'
  }
};

const files=[1,2,3,4].map(n=>path.join(__dirname,`v11_batch14_g3_body_draft_part${n}.json`));
const seen=new Set();
for(const file of files){
  const doc=JSON.parse(fs.readFileSync(file,'utf8'));
  let changed=false;
  for(const p of doc.passages||[]){
    const r=repairs[p.id];
    if(!r) continue;
    seen.add(p.id);
    if(p.body.includes(r.bodyOld)){ p.body=p.body.replace(r.bodyOld,r.bodyNew); changed=true; }
    else if(!p.body.includes(r.bodyNew)) throw new Error(`${p.id}: body repair anchor missing`);
    if(p.fullTranslation.includes(r.jpOld)){ p.fullTranslation=p.fullTranslation.replace(r.jpOld,r.jpNew); changed=true; }
    else if(!p.fullTranslation.includes(r.jpNew)) throw new Error(`${p.id}: JP repair anchor missing`);
    p.humanSemanticReview='B14_G3_HUMAN_REVIEW_R2_GRAMMAR_SYNC';
  }
  if(changed) fs.writeFileSync(file,JSON.stringify(doc,null,2)+'\n');
}
for(const id of Object.keys(repairs)) if(!seen.has(id)) throw new Error(`${id}: target passage not found`);
console.log(`g3_grammar_semantic_repair PASS targets=${seen.size}`);
