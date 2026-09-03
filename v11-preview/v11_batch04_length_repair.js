(function repairV11Batch04Length(){
'use strict';
const ps=[...(window.V11_BATCH04_G1_PASSAGES||[]),...(window.V11_BATCH04_G2_PASSAGES||[]),...(window.V11_BATCH04_G3_PASSAGES||[])];
function slash(en){return en.replace(/, /g,', / ').replace(/\b(and|but|because|so|before|after|until|then|when|while|although)\b/gi,'/ $1');}
const add={
'V11-SS-G2-P8-3-030':[
 ['The teacher later asked us to compare our notes with the museum website at school.','先生はあとで、学校で私たちのメモを博物館のウェブサイトと比べるよう言いました。']
],
'V11-NH-G2-U7-4-030':[
 ['I later added “open the file once” under the three words on my checklist.','あとでチェックリストの三つの言葉の下に「ファイルを一度開く」も加えました。']
],
'V11-SS-G3-P7-3-028':[
 ['After the event, we saved the table as a blank form for the next volunteer activity.','行事のあと、次のボランティア活動のためにその表を空のひな形として保存しました。'],
 ['Future organizers could change the roles without rebuilding the whole system from separate sheets.','今後の担当者は別々の用紙から全体を作り直さず、役割だけを変更できます。']
],
'V11-SS-G3-P7-3-031':[
 ['I also wrote one reminder at the top of my notes: ask for an example when an answer stays general.','メモの一番上に「答えが一般的なままなら例をたずねる」という注意も書きました。'],
 ['That reminder helped me listen to the answer before deciding what to ask next.','その注意のおかげで、次の質問を決める前に答えをよく聞けました。']
],
'V11-SS-G3-P7-3-034':[
 ['We printed both routes in the same size so the elevator path did not look like secondary information.','エレベーター経路が二次的な情報に見えないよう、二つの経路を同じ大きさで印刷しました。'],
 ['A visitor later told us that seeing the choice before entering the building was helpful.','あとで一人の来訪者が、建物に入る前に選択肢が見えるのは役立つと言いました。']
],
'V11-NH-G3-U6-4-027':[
 ['We also learned to state urgency without making the person receiving the message feel responsible for our delay.','自分たちの遅れを相手の責任のように感じさせず、急ぎであることを伝える方法も学びました。'],
 ['That balance became part of our group rule for future requests.','そのバランスは今後のお願いに使う班のルールになりました。']
],
'V11-NH-G3-U6-4-028':[
 ['For the next measurement period, we added a rule that the sensor position had to be checked before every reading.','次の測定期間では、毎回の測定前にセンサーの位置を確認するルールを加えました。'],
 ['A small mark on the wall showed the normal shaded location.','壁の小さな印で、通常の日陰の位置を示しました。']
],
'V11-NH-G3-U6-4-030':[
 ['We kept the direct translation in our working notes so we could remember why it had caused confusion.','なぜ混乱したか覚えておけるよう、逐語訳は作業メモに残しました。']
],
'V11-NH-G3-U6-4-031':[
 ['We proposed repeating the survey later with students from every grade and different after-school activities.','あとで全学年や異なる放課後活動の生徒にもアンケートを繰り返すことを提案しました。'],
 ['A larger second survey could test whether the first pattern appeared again.','より大きな二回目の調査で、最初の傾向が再び出るか確認できます。']
],
'V11-NH-G3-U6-4-032':[
 ['The office later added three prompts to its lost-item form: “when,” “where,” and “what did it look like?”','事務室はあとで落とし物用紙に「いつ・どこで・どんな見た目」の三つの項目を加えました。']
],
'V11-NH-G3-U6-4-034':[
 ['The next day, I told both adults what I had decided and why.','翌日、私は二人の大人に自分が何を決め、なぜそうしたか伝えました。']
]};
const markLong=new Set(Object.keys(add));
let changed=0;
for(const p of ps){
 const rows=add[p.id];if(!rows)continue;
 for(const [en,jp] of rows){p.sentences.push(en);p.slashRows.push({en:slash(en),jp});p.fullTranslation+=jp;}
 p.targetWordBand=p.grade==='2'?[170,210]:[210,270];
 p.wordCount=(p.sentences.join(' ').match(/[A-Za-z]+(?:['’][A-Za-z]+)?/g)||[]).length;
 p.auditNote+=' Batch04 story-specific length extension applied to reach the long-passage band without filler reuse.';
 changed++;
}
window.V11_BATCH04_LENGTH_REPAIR_STATE={version:'20260828-pass1',changed,ids:[...markLong],registered:false};
})();