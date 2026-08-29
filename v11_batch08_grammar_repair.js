(function repairV11Batch08Grammar(){
'use strict';
const ps=[...(window.V11_BATCH08_G1_DRAFTS||[]),...(window.V11_BATCH08_G2_DRAFTS||[]),...(window.V11_BATCH08_G3_DRAFTS||[])];
const norm=s=>String(s||'').replace(/[’‘]/g,"'").replace(/[“”]/g,'"').trim();
function replaceRow(oldEn,newEn,newJp){let hits=0;for(const p of ps){const i=(p.sentences||[]).findIndex(x=>norm(x)===norm(oldEn));if(i<0)continue;hits++;const oldActual=p.sentences[i],oldJp=p.slashRows[i]&&p.slashRows[i].jp;p.sentences[i]=newEn;p.slashRows[i]={en:newEn,jp:newJp};for(const q of [...(p.questions||[]),...(p.questionSetB||[])]){if(typeof q.evidence==='string'&&norm(q.evidence)===norm(oldActual)){q.evidence=newEn;q.evidenceJp=newJp;}if(Array.isArray(q.evidence)){const before=q.evidence.slice();q.evidence=q.evidence.map(x=>norm(x)===norm(oldActual)?newEn:x);if(Array.isArray(q.evidenceJp))q.evidenceJp=q.evidenceJp.map((x,k)=>norm(before[k])===norm(oldActual)?newJp:x);}if(typeof q.answer==='string'&&oldJp&&q.answer===oldJp)q.answer=newJp;}}
if(hits!==1)throw Error(`grammar repair row hits=${hits}: ${oldEn}`);}
const R=[
["She did not open the smaller pocket because it might hold private things.","She left the smaller pocket closed. Private things were possible inside.",'芽衣は小さいポケットを閉じたままにしました。中には個人的な物が入っている可能性がありました。'],
["She asked Kota to describe his missing case before showing it to him.","She spoke with Kota first. Kota described his missing case before he saw it.",'芽衣はまず康太と話しました。康太は筆箱を見る前に、なくした筆箱の特徴を説明しました。'],
["On Monday, two new students used the classroom map to find the music room.","On Monday, there were two new students. They used the classroom map to find the music room.",'月曜日、二人の新しい生徒がいました。二人は音楽室を探すために教室の地図を使いました。'],
["The map was hanging sideways because it had been moved during cleaning.","The map hung sideways. A cleaner moved it earlier.",'地図は横向きに掛かっていました。少し前に掃除で動かされていました。'],
["That helped, but the sideways rooms were still hard to follow.","That helped, but the sideways room layout still confused visitors.",'それで少し分かりやすくなりましたが、横向きの部屋配置はまだ来校者を迷わせました。'],
["Another student said the table had been cleared before club practice began.","Another student said someone cleared the table before club practice began.",'別の生徒は、部活が始まる前に誰かがその机を片付けたと言いました。'],
["The cloth had been carried from the classroom next door.","Someone carried the cloth from the classroom next door.",'誰かがその布を隣の教室から運んできました。'],
["The whiteboard date had been copied from the wrong line.","Someone copied the whiteboard date from the wrong line.",'誰かが違う行の日付をホワイトボードへ写していました。'],
["Most students walked around it without stopping.","Many students walked around it without stopping.",'多くの生徒は立ち止まらずにその横を通っていました。'],
["That created more room, but one wheel blocked the door when it opened.","That created more room, but one wheel stood in the door's path.",'通りやすくなりましたが、一つの車輪が扉の動く場所にありました。'],
["Students could still return books quickly, and the door opened fully.","Students still returned books quickly, and the door opened fully.",'生徒はそれでも本をすぐ返せて、扉も完全に開きました。'],
["The librarian checked that emergency signs stayed easy to see.","The librarian checked the emergency signs. All signs stayed clear.",'司書は非常時の表示を確認しました。すべての表示は見やすいままでした。'],
["When they looked at the picture, they noticed that Daichi was missing.","They looked at the picture and noticed that Daichi was missing.",'写真を見ると、大地が写っていないことに気づきました。'],
["He had been carrying empty boxes to the storage room when the photo was taken.","At photo time, Daichi carried empty boxes to the storage room.",'写真を撮った時、大地は空箱を倉庫へ運んでいました。'],
["Both pictures were placed together on the class page.","The class put both pictures together on the class page.",'クラスは二枚の写真をクラスのページに一緒に載せました。'],
["Daichi was included, and no one had to repeat the entire group photo.","Daichi appeared in a picture, and the class did not repeat the entire group photo.",'大地も写真に入り、クラス全員が集合写真を撮り直すこともありませんでした。'],
["When she returned, the bottle felt much warmer than before.","She returned and found the bottle much warmer than before.",'戻ると、水筒は前よりずっと温かくなっていました。'],
["The water was still safe, but she did not enjoy drinking it.","The water was still safe, but she did not like its warm taste.",'水は飲めましたが、結菜はその温かい味を好みませんでした。'],
["A small change in where she stored the bottle made it more comfortable to use.","The new storage place kept the bottle cooler and more pleasant.",'新しい置き場所では水筒がより冷たく、使いやすい状態に保たれました。'],
["Three students who had not seen the old signs tested the wording.","Three students had not seen the old signs. They tested the wording.",'三人の生徒は古い案内を見ていませんでした。その三人が新しい表現を試しました。'],
["Then they saw that the second twelve should have been thirteen.","Then they saw a problem: the second twelve was really thirteen.",'そこで問題に気づきました。二つ目の12は実際には13でした。'],
["The poster was technically on display, but a heavy curtain covered most of it.","The poster was on display, but a heavy curtain covered nearly all of it.",'ポスターは掲示されていましたが、厚いカーテンがほとんど全部を隠していました。'],
["Only the bottom corner could be seen from the hallway.","People in the hallway saw only the bottom corner.",'廊下にいる人から見えたのは下の角だけでした。'],
["From there, students could read the title while walking past.","From there, students read the title as they walked past.",'そこなら、生徒は通りながら題名を読めました。'],
["They also asked a teacher to check that the new place was allowed.","They also spoke with a teacher, and the teacher approved the new place.",'新しい場所について先生にも相談し、先生がその場所を認めました。'],
["The club learned that being displayed is not enough if the information cannot actually be seen.","The club learned this lesson: a notice is useless if people do not actually see the information.",'情報は掲示するだけでは足りず、人が実際に見られなければ役立たないと学びました。'],
["That place was visible, but the paper covered part of the window people used to look through.","That place was visible, but the paper covered part of the window. People often looked through that window.",'そこは見やすい一方、紙が窓の一部をふさいでいました。人はその窓からよく中を見ていました。'],
["He asked Mao whether she had lost a reminder.","He asked Mao, 'Did you lose a reminder?'",'圭は真央に「覚え書きをなくした？」と尋ねました。'],
["Using the sequence was safer than guessing from where the label was found.","The number sequence gave a safe answer. A guess about the label's location did not.",'番号の順番を使うと確実に判断できました。札が落ちた場所だけの推測ではそうなりませんでした。'],
["They could hear it near the building but not behind the tall equipment shed.","They heard it near the building but not behind the tall equipment shed.",'校舎の近くでは聞こえましたが、高い用具庫の後ろでは聞こえませんでした。'],
["The outdoor group could see the signal clearly and returned on time.","The outdoor group saw the signal clearly and returned on time.",'屋外のグループは合図をはっきり見て、時間通り戻りました。'],
["After cleaning day, two pairs of indoor shoes were washed at the same time.","After cleaning day, students washed two pairs of indoor shoes at the same time.",'清掃の日の後、生徒たちは二足の上履きを同じ時刻に洗いました。'],
["One pair was placed beside an open window, and the other was left under a bench.","Students put one pair beside an open window and the other under a bench.",'生徒たちは一足を開いた窓のそばに、もう一足をベンチの下に置きました。'],
["Students first wondered whether one pair had been washed with more water.","Students first asked, 'Did one pair get more water?'",'生徒たちは最初、「片方の上履きの方が多くの水を使ったのだろうか」と考えました。'],
["Again, the shoes near moving air dried faster than the pair under the bench.","Again, the shoes near the open window dried first. The pair under the bench was still wet.",'再び、開いた窓の近くの上履きが先に乾きました。ベンチの下の上履きはまだぬれていました。'],
["The class also checked that direct rain could not reach the window area.","The class also checked the window area and found no direct rain there.",'クラスは窓の場所も確認し、直接雨が入らないことを確かめました。'],
["Labels showed where wet shoes should be put after future cleaning days.","Labels marked the place for wet shoes after future cleaning days.",'札を付け、今後の清掃後にぬれた上履きを置く場所を示しました。'],
["Students were unsure whether it belonged in the middle or at the end.","Students did not know its place: the middle or the end.",'生徒たちは、それが真ん中か最後か分かりませんでした。'],
["The weather report said rain might begin during the evening.","The weather report showed evening rain as a possibility.",'天気予報では夕方に雨の可能性が示されていました。'],
["Students made a short routine for the last two people leaving practice.","For the final two people, there was a short leaving routine.",'最後に帰る二人のために短い確認手順がありました。'],
["They signed a small box on the list when both checks were finished.","After both checks, they signed a small box on the list.",'二つの確認の後、一覧の小さな欄に印を付けました。'],
["On later practice days, the room was checked before the final pair left.","On later practice days, the final pair checked the room before departure.",'その後の練習日には、最後の二人が帰る前に教室を確認しました。'],
["It also asked groups to state whether they needed special equipment.","It also asked groups, 'Do you need special equipment?'",'特別な用具が必要かも各グループに尋ねました。'],
["Mio said the question itself might be pushing people toward one answer.","Mio said the question pushed people toward one answer.",'美緒は、その質問が一つの答えへ人を誘導していると言いました。'],
["Students expected it to fill quickly because many people used the gym.","Students expected a quick fill; the gym had many users.",'生徒たちはすぐいっぱいになると思いました。体育館には多くの利用者がいました。'],
["Members said the written record made the discussion feel fairer because it separated repeated problems from occasional noise.","Members said the written record improved fairness. It separated repeated problems from occasional noise.",'部員は、記録によって話し合いがより公平になったと言いました。繰り返す問題と一時的な音を分けられたからです。']
];
for(const x of R)replaceRow(...x);
for(const p of ps){p.fullTranslation=(p.slashRows||[]).map(r=>r.jp).join('');p.wordCount=((p.sentences||[]).join(' ').match(/[A-Za-z]+(?:['’][A-Za-z]+)?/g)||[]).length;p.grammarChronologyRepair='20260829-r1';}
window.V11_BATCH08_GRAMMAR_REPAIR_STATE={version:'20260829-r1',passages:ps.length,replacements:R.length,registered:false};
})();
