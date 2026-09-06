'use strict';
const fs=require('fs');
const f='v11_batch14_g2_body_draft.json';
const d=JSON.parse(fs.readFileSync(f,'utf8'));
const add={
'V11-B14-G2-003':{
 en:' Before moving anything, they also asked two students to describe where the line felt slow. Both pointed to the narrow space beside the table, not to the water flow. This matched the timing results and gave the committee another reason to test the layout first.',
 jp:' 何かを動かす前に、さらに2人の生徒に、列のどこで遅く感じるかを説明してもらいました。二人とも水の出る速さではなく、机の横の狭い場所を指しました。この意見は計測結果とも一致し、まず配置を試す理由がさらに増えました。'},
'V11-B14-G2-006':{
 en:' The team wrote both results in the guide instead of calling one route good and the other bad. That way, visitors could understand why the rainy-day recommendation was different and could choose with the weather in mind.',
 jp:' チームは一方を良い道、もう一方を悪い道と決めつけず、両方の結果を案内に書きました。そうすれば、雨の日のおすすめがなぜ違うのか来校者が理解し、天気を考えて選べます。'},
'V11-B14-G2-009':{
 en:' The team checked again during the final hour to see whether the change only worked once. Stand B still had fewer people in line than Stand A, but its waiting time was now close to the time shown on the sign. The second check supported their explanation.',
 jp:' チームは、変更が一度だけうまくいったのではないかを確かめるため、最後の1時間にも再確認しました。B店の列の人数はA店より少ないままでしたが、待ち時間は表示した時間に近くなっていました。二度目の確認でも、チームの説明が確かめられました。'},
'V11-B14-G2-012':{
 en:' The group kept the old sign in its meeting notes so members could compare the two versions later. They also decided to review the accepted-item examples before the next season, because the needs of the receiving group might change.',
 jp:' グループは、後で二つの表示を比べられるよう、古い表示も活動記録に残しました。また、受け取る側の必要な物が変わるかもしれないため、次の時期の前に受け入れ品の例を見直すことにしました。'},
'V11-B14-G2-015':{
 en:' After the event, the club compared its records with the previous year. Trash from drink cups had fallen, and the waiting time stayed within the limit the organizers had set. The members wrote both benefits and problems in their report so the next team could improve the plan again.',
 jp:' 行事の後、部員は記録を前年と比べました。飲み物用カップのごみは減り、待ち時間も主催者が決めた範囲に収まりました。次の担当者がさらに改善できるよう、報告書には良かった点と問題点の両方を書きました。'}
};
for(const p of d.passages){
 if(add[p.id]&&!p.body.includes(add[p.id].en.trim().slice(0,45))){p.body+=add[p.id].en;p.fullTranslation+=add[p.id].jp;}
 if(p.id==='V11-B14-G2-014'&&!p.body.includes('Several players said')){p.body=p.body.replace('Players said they needed','Several players said they needed').replace('the whole practice well.','the whole practice well for everyone.');p.fullTranslation=p.fullTranslation.replace('選手たちは、','何人かの選手は、').replace('練習全体を上手に使うことではない','全員にとって練習全体を上手に使うことではない');}
 if(p.id==='V11-B14-G2-017'&&!p.body.includes('discussed the result')){p.body=p.body.replace('The survey team kept','The survey team discussed the result and kept');p.fullTranslation=p.fullTranslation.replace('調査チームは役立つ質問','調査チームは結果について話し合い、役立つ質問');}
 p.humanSemanticReview='B14_G2_HUMAN_REVIEW_R2_WORDCOUNT_POLICY_SYNC';
}
d.status='BODY_TRANSLATION_HUMAN_SEMANTIC_REVIEWED_R2_WORDCOUNT_POLICY_SYNC';
fs.writeFileSync(f,JSON.stringify(d,null,2)+'\n');
const wc=s=>(String(s).match(/[A-Za-z0-9]+(?:['’-][A-Za-z0-9]+)*/g)||[]).length;
for(const p of d.passages){const n=wc(p.body),lo=p.tier==='LONG'?170:115,hi=p.tier==='LONG'?210:155;if(n<lo||n>hi)throw Error(`${p.id} ${n} not ${lo}-${hi}`);console.log(p.id,n);}
