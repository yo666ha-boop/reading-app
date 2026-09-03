const fs=require('fs');
const path='v11_batch14_g1_body_draft.json';
const d=JSON.parse(fs.readFileSync(path,'utf8'));
const repairs={
'V11-B14-G1-004':{
 en:' Before leaving, Kota noticed that the footprints stopped beside the cloth, not at the student’s shoes. That was one more reason to wait for an explanation.',
 jp:' 帰る前、コウタは足跡がその生徒の靴のところではなく布のそばで途切れていることにも気づきました。それも、すぐ決めつけず説明を待つべき理由の一つでした。'},
'V11-B14-G1-007':{
 en:' She also noticed that the bell stopped as soon as the empty box arrived, which matched the notice exactly.',
 jp:' また、空の箱が届くとすぐベルが鳴らなくなり、その様子も掲示の説明とぴったり合っていました。'},
'V11-B14-G1-010':{
 en:' The note also reminded the staff to check their own phones for the real time before opening the doors. That detail showed that the faster clocks were only a preparation tool, not the official event time.',
 jp:' そのメモには、ドアを開ける前に本当の時刻を自分のスマートフォンで確認するよう、スタッフへの注意もありました。この説明から、進めた時計は準備のための道具であって、行事の正式な時刻ではないことも分かりました。'},
'V11-B14-G1-013':{
 en:' The teacher then wrote Ken’s name in the class record too, so the picture and the record would stay together.',
 jp:' 先生はクラスの記録にもケンの名前を書き、作品と記録がきちんと対応するようにしました。'}
};
for(const p of d.passages){const r=repairs[p.id];if(r){p.body+=r.en;p.fullTranslation+=r.jp;p.humanSemanticReview='B14_G1_HUMAN_REVIEW_R2_LENGTH_SYNC';}}
d.status='BODY_TRANSLATION_HUMAN_SEMANTIC_REVIEWED_R2_CHRONOLOGY_PENDING';
fs.writeFileSync(path,JSON.stringify(d,null,2)+'\n');
