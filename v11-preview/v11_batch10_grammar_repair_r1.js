(function repairV11Batch10GrammarR1(){
'use strict';
const ps=[...(window.V11_BATCH10_G1_DRAFTS||[]),...(window.V11_BATCH10_G2_DRAFTS||[]),...(window.V11_BATCH10_G3_DRAFTS||[])];
if(ps.length!==50)throw Error('Batch10 grammar repair requires 50 passages');
const norm=s=>String(s||'').replace(/[’‘]/g,"'").replace(/[“”]/g,'"').trim();
function replaceRow(oldEn,newEn,newJp){
 let hits=0;
 for(const p of ps){
  const i=(p.sentences||[]).findIndex(x=>norm(x)===norm(oldEn));
  if(i<0)continue;
  hits++;
  const oldActual=p.sentences[i],oldJp=p.slashRows[i]&&p.slashRows[i].jp;
  p.sentences[i]=newEn;
  p.slashRows[i]={en:newEn,jp:newJp};
  for(const q of [...(p.questions||[]),...(p.questionSetB||[])]){
   if(typeof q.evidence==='string'&&norm(q.evidence)===norm(oldActual)){
    q.evidence=newEn;q.evidenceJp=newJp;
    if(typeof q.answer==='string'&&oldJp&&q.answer===oldJp)q.answer=newJp;
   }
   if(Array.isArray(q.evidence)){
    const before=q.evidence.slice();
    q.evidence=q.evidence.map(x=>norm(x)===norm(oldActual)?newEn:x);
    if(Array.isArray(q.evidenceJp))q.evidenceJp=q.evidenceJp.map((x,k)=>norm(before[k])===norm(oldActual)?newJp:x);
   }
  }
 }
 if(hits!==1)throw Error(`Batch10 grammar repair row hits=${hits}: ${oldEn}`);
}
const R=[
["He did not move the whole desk because the desks had already been arranged for a quiz.","He did not move the whole desk. The teacher arranged the desks for a quiz before class.","彼は机全体を動かしませんでした。先生が授業前に小テストのため机を並べていたからです。"],
["Yui counted thirty students in the picture, although the class had thirty-one students that day.","Yui counted thirty students in the picture. There were thirty-one students in the class on the trip day.","結衣は写真の中の生徒を30人と数えました。旅行の日、クラスには31人いました。"],
["At first, Yui thought someone might have left the trip early.","At first, Yui thought one student left the trip early.","最初、結衣は一人の生徒が旅行を途中で帰ったと思いました。"],
["Some students could not eat peanuts, so each snack needed a clear card.","Peanuts caused problems for some students, so each snack needed a clear card.","ピーナッツは一部の生徒に問題を起こすため、それぞれのおやつに分かりやすいカードが必要でした。"],
["The package said the cookies contained peanuts, so the card had been placed by the wrong plate.","The package said the cookies contained peanuts. Ken saw the card by the wrong plate.","袋にはクッキーにピーナッツが入っていると書かれていました。健はカードが違う皿のそばにあることに気づきました。"],
["Ken learned that food labels should be checked directly when safety depends on them.","Ken learned an important rule: check food labels directly for safety.","健は大切なルールを学びました。安全のため、食品表示を直接確認することです。"],
["When she reached the platform, the board showed a ten-minute delay.","She reached the platform. The board showed a ten-minute delay.","彼女はホームに着きました。案内板には10分の遅れと表示されていました。"],
["She did not take an earlier train on another line because it stopped far from the meeting place.","Another line had an earlier train, but its stop was far from the meeting place. She did not take it.","別の路線にはもっと早い電車がありましたが、その停車駅は集合場所から遠く離れていました。彼女はその電車には乗りませんでした。"],
["Instead, she sent her teacher a short message about the delay.","Instead, she sent a short message about the delay to her teacher.","代わりに、彼女は遅れについて短いメッセージを先生に送りました。"],
["After art class, Nao could not find her class's box of colored pencils.","After art class, Nao looked for her class's box of colored pencils, but it was gone.","美術の授業後、奈緒はクラスの色鉛筆の箱を探しましたが、見当たりませんでした。"],
["She checked the return list and saw her class box had been carried to shelf B.","She checked the return list. It said another student carried her class box to shelf B.","彼女は返却表を確認しました。別の生徒がクラスの箱を棚Bへ運んだと書かれていました。"],
["Several students put down their pencils because they thought the test had ended.","Several students thought the test ended, so they put down their pencils.","何人かの生徒はテストが終わったと思い、鉛筆を置きました。"],
["The teacher immediately said, “Please keep working; I will tell you when time is up.”","The teacher immediately said, “Please continue the test. Stop only after my signal.”","先生はすぐに「テストを続けてください。私の合図のあとで止めてください」と言いました。"],
["Afterward, a notice about the special bell test was placed near each classroom clock.","Afterward, the school put a notice about the special bell test near each classroom clock.","その後、学校は特別なベルの試験についてのお知らせを各教室の時計の近くに置きました。"],
["The students learned that an unusual signal may need an explanation before they act on it.","The students learned a lesson: explain an unusual signal before people act on it.","生徒たちは、いつもと違う合図は人が行動する前に説明することが大切だと学びました。"],
["She did not add more cups because there were already enough for six people.","There were already enough cups for six people, so she added no more.","すでに6人分のコップが十分にあったので、彼女はそれ以上加えませんでした。"],
["The group also asked the new student whether there was any food he could not eat.","The group also asked the new student, “Do any foods cause problems for you?”","グループは新しい生徒に「何か食べると困る食べ物はありますか」とも尋ねました。"],
["Everyone had enough food at the picnic, and nothing extra was thrown away.","Everyone had enough food at the picnic, and the group wasted no extra food.","ピクニックでは全員に十分な食べ物があり、グループは余分な食べ物を無駄にしませんでした。"],
["When he reached his bicycle, he remembered that its front light had stopped working that morning.","He reached his bicycle. Then he remembered a problem from the morning: the front light stopped working.","彼は自転車の所に着きました。そして朝の問題を思い出しました。前のライトが動かなくなっていたのです。"],
["He did not start riding just because the street had several bright lamps.","The street had several bright lamps, but he waited and did not ride yet.","通りには明るい街灯がいくつかありましたが、彼は待って、まだ自転車に乗りませんでした。"],
["He rode home slowly and could see the road while other people could also see him.","He rode home slowly. The light let him see the road, and other people saw him too.","彼はゆっくり家へ自転車で帰りました。ライトで道が見え、ほかの人からも彼が見えました。"],
["Tomo learned that a safety problem should be solved before starting a trip, not after it begins.","Tomo learned a safety rule: solve a problem before a trip starts, not after.","智は安全のルールを学びました。問題は出発後ではなく、出発前に解決することです。"],
["Both sheets were marked “B,” which showed that the “A” page was missing.","Both sheets had a “B” mark. The class needed an “A” page.","どちらの用紙にも「B」の印がありました。クラスには「A」の用紙が必要でした。"],
["They did not copy answers from another pair because they still needed the correct questions.","They still needed the correct questions, so they did not copy another pair's answers.","正しい問題がまだ必要だったので、二人は別のペアの答えを写しませんでした。"],
["The teacher gave them one “A” sheet, and they shared it between them.","The teacher gave one “A” sheet to them, and they shared it.","先生は二人に「A」の用紙を1枚渡し、二人はそれを一緒に使いました。"],
["They learned that identifying the missing part is more useful than simply saying something is wrong.","They learned a useful lesson: find the missing part first. Do not only say something is wrong.","二人は役立つことを学びました。単に何かがおかしいと言うだけでなく、まず足りない部分を見つけることです。"],
["The two buildings were close, so both reports could describe the same cat.","The two buildings were close. Kumi thought the two reports described the same cat.","二つの建物は近くにありました。久美は二つの報告が同じ猫についてだと考えました。"],
["Kumi did not say the cat must still be behind the music building.","Kumi did not say the cat was still behind the music building.","久美は、その猫がまだ音楽棟の裏にいるとは言いませんでした。"],
["The class party had been on Friday, but one message on the card was dated Saturday.","The class party was on Friday, but one message had a Saturday date.","クラス会は金曜日でしたが、カードの一つのメッセージには土曜日の日付がありました。"],
["The Saturday date showed when his message was written, not when the party happened.","The Saturday date showed the message date, not the party date.","土曜日の日付が示していたのはメッセージの日付で、クラス会の日付ではありませんでした。"],
["Rina checked the other messages and saw that most were dated Friday.","Rina checked the other messages. Most had a Friday date.","里奈はほかのメッセージを確認しました。多くには金曜日の日付がありました。"],
["Rina first wondered whether she had remembered the party date incorrectly.","Rina first thought, “Did I remember the party date incorrectly?”","里奈は最初、「クラス会の日付を間違えて覚えていたのかな」と考えました。"],
["He did not put the ball into his class basket just because it was nearby.","His class basket was nearby, but he did not put the ball there yet.","自分のクラスのかごは近くにありましたが、彼はまだそこへボールを入れませんでした。"],
["Both classes then checked that their equipment marks were still easy to see.","Both classes then checked their equipment marks. The marks were still clear.","その後、両クラスは用具の印を確認しました。印はまだはっきり見えました。"],
["Four students were assigned to clean the classroom after school.","The teacher chose four students for classroom cleaning after school.","先生は放課後の教室掃除のために4人の生徒を選びました。"],
["They wrote the change on the chart so the teacher knew how the work had been shared.","They wrote the change on the chart, so the teacher knew each student's job.","生徒たちは変更を表に書き、先生はそれぞれの生徒の仕事が分かりました。"],
["Before cleaning began, Aoi told the other students that the job was now uncovered.","Before cleaning began, Aoi explained the problem to the other students: no one had the job now.","掃除が始まる前に、葵はほかの生徒に問題を説明しました。その仕事をする人が今はいなかったのです。"],
["They did not leave the trash for Kaito because he was no longer at school.","Kaito was no longer at school, so they did not leave the trash for him.","海斗はもう学校にいなかったので、生徒たちはごみを彼のために残しませんでした。"],
["Another student checked the floor while she was outside.","She went outside. At the same time, another student checked the floor.","彼女は外へ行きました。同じ時間に、別の生徒が床を確認しました。"],
["The group learned that a plan should show who can actually do each job that day.","The group learned a rule for plans: show the person for each job on the actual day.","グループは予定表のルールを学びました。その日に実際に各仕事をする人を示すことです。"],
["Their first list put the fastest song at the end.","Their first list put a very fast song at the end.","最初の曲順では、とても速い曲を最後に置きました。"],
["During practice, the club noticed that the final song needed the most breath and energy.","During practice, the club noticed that the final song needed a lot of breath and energy.","練習中、部員たちは最後の曲には多くの息と体力が必要だと気づきました。"],
["Two members found it difficult to sing that song clearly after the other two.","Two members had trouble with that song after the other two. Their singing became unclear.","二人の部員はほかの2曲のあとではその曲に苦労しました。歌い方が不明瞭になりました。"],
["The club did not remove the song because everyone still liked it and could sing it well when fresh.","Everyone still liked the song and sang it well at the start, so the club kept it.","全員がその曲をまだ気に入っていて、最初なら上手に歌えたので、部はその曲を残しました。"],
["She explained that visitors in a noisy hall or people who could not hear well might have the same problem.","She explained the problem. A noisy hall caused trouble for some visitors, and poor hearing caused the same trouble.","彼女は問題を説明しました。騒がしいホールは一部の来場者に困難を起こし、聞こえにくい人にも同じ問題がありました。"],
["His teacher asked whether someone outside the town would know what that word meant.","His teacher asked, “Does a person outside the town know this word?”","先生は「町の外の人はこの言葉を知っていますか」と尋ねました。"],
["During a practice visit, a student using a wheelchair could not pass between the boards.","During a practice visit, a student came in a wheelchair. The space between the boards was too narrow.","練習見学のとき、一人の生徒が車いすで来ました。掲示板の間の幅が狭すぎました。"],
["She asked the student who sent the recipe to describe the smell, taste, and usual use.","One student sent the recipe. She asked that student to describe the smell, taste, and usual use.","一人の生徒がレシピを送りました。彼女はその生徒に、におい、味、普段の使い方を説明するよう頼みました。"],
["Two students who had not heard the original could explain the main point after listening once.","Two students did not hear the original. They listened once and then explained the main point.","二人の生徒は元の音声を聞いていませんでした。一度聞いたあと、要点を説明できました。"],
["Students standing several meters away could not read the event time.","Some students stood several meters away. They did not read the event time clearly.","何人かの生徒は数メートル離れて立ちました。行事の時刻をはっきり読めませんでした。"],
["The reporter changed the next question to, “What has surprised you about lunch here?”","The reporter changed the next question to, “What surprised you about lunch here?”","記者は次の質問を「ここの昼食で何に驚きましたか」に変えました。"],
["At the second hallway, the visitors stopped because they could not remember whether to turn left or right.","At the second hallway, the visitors forgot the next turn, so they stopped.","二つ目の廊下で、来場者は次に曲がる方向を忘れたので立ち止まりました。"],
["They learned that user testing reveals gaps that creators may no longer notice.","They learned a lesson. Creators sometimes overlook gaps, but user tests reveal them.","彼らは一つの教訓を学びました。作り手が見落とすことのある不足も、利用者テストなら明らかにできます。"],
["The festival committee prepared a short speech to thank people who had helped the school event.","The festival committee prepared a short speech for the school event helpers.","祭りの委員会は、学校行事を手伝った人たちのために短い感謝のスピーチを用意しました。"],
["The first plan used only one fast-growing species because it was cheap and easy to order.","The species was cheap and easy to order, so the first plan used only that one type.","その種類は安く注文しやすかったので、最初の案ではその1種類だけを使いました。"],
["Students kept both photographs because they still showed weather conditions and visible change.","Both photographs still showed weather conditions and visible change, so students kept them.","どちらの写真にも天候の状態と目に見える変化が残っていたので、生徒たちは両方を残しました。"]
];
for(const x of R)replaceRow(...x);
for(const p of ps){
 p.fullTranslation=(p.slashRows||[]).map(r=>r.jp).join('');
 p.wordCount=((p.sentences||[]).join(' ').match(/[A-Za-z]+(?:['’][A-Za-z]+)?/g)||[]).length;
 p.grammarChronologyRepair='BATCH10_R1_20260829';
}
window.V11_BATCH10_GRAMMAR_REPAIR_STATE={version:'20260829-r1',passages:ps.length,replacements:R.length,registered:false};
})();
