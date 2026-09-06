'use strict';
const fs=require('fs');
const f='v11_batch14_g2_body_draft.json';
const d=JSON.parse(fs.readFileSync(f,'utf8'));
const byId=id=>{const p=d.passages.find(x=>x.id===id);if(!p)throw Error('missing '+id);return p};
function rep(id,enFrom,enTo,jpFrom,jpTo){const p=byId(id);if(p.body.includes(enFrom))p.body=p.body.replace(enFrom,enTo);else if(!p.body.includes(enTo))throw Error(`${id} English target missing: ${enFrom}`);if(jpFrom&&p.fullTranslation.includes(jpFrom))p.fullTranslation=p.fullTranslation.replace(jpFrom,jpTo);else if(jpFrom&&!p.fullTranslation.includes(jpTo))throw Error(`${id} Japanese target missing: ${jpFrom}`)}
rep('V11-B14-G2-002','the teachers who managed the lists','the teachers managing the lists','リストを管理している先生たち','リストを管理している先生たち');
rep('V11-B14-G2-003','the same number of students used the station','the station served the same number of students','同じ人数が給水機を使いました','給水機を使った人数は同じでした');
rep('V11-B14-G2-005','Older students used either method easily','Either method worked well for older students','上級生はどちらでも簡単に使えました','上級生にはどちらの方法も使いやすいものでした');
rep('V11-B14-G2-005','for students who wanted more detail','for anyone wanting more detail','詳しく知りたい生徒のために','詳しく知りたい人のために');
rep('V11-B14-G2-007','Ryo interviewed six students who had lost items.','Ryo interviewed six students about things they had lost.','リョウが物をなくしたことのある6人に話を聞くと','リョウが6人の生徒に、なくした物について話を聞くと');
rep('V11-B14-G2-011','The class kept the setup because it gave everyone a clear first step.','The setup gave everyone a clear first step, so the class kept it.','クラスは、全員に明確な最初の一歩を与えるため、この準備時間を続けることにしました。','この準備時間は全員に明確な最初の一歩を与えたので、クラスは続けることにしました。');
rep('V11-B14-G2-012','the needs of the receiving group might change','the needs of the receiving group could change','受け取る側の必要な物が変わるかもしれない','受け取る側の必要な物が変わる可能性がある');
rep('V11-B14-G2-012','two small pictures showing items that could not be accepted','two small pictures showing unacceptable items','受け取れない物を示す小さな絵を二つ','受け取れない物を示す小さな絵を二つ');
for(const p of d.passages)p.humanSemanticReview='B14_G2_HUMAN_REVIEW_R5_GRAMMAR_CHRONOLOGY_SYNC';
d.status='BODY_TRANSLATION_HUMAN_SEMANTIC_REVIEWED_R5_GRAMMAR_CHRONOLOGY_SYNC';
fs.writeFileSync(f,JSON.stringify(d,null,2)+'\n');
console.log('Batch14 G2 grammar chronology rewrites synced');
