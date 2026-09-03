(function buildV11Batch08G1Drafts(){
'use strict';
const BATCH='V11-B08-G1-DRAFT-20260829',SS='サンシャイン',NH='ニューホライズン';
function words(s){return (String(s||'').match(/[A-Za-z]+(?:['’][A-Za-z]+)?/g)||[]);}
function q(type,prompt,answer,evidence,evidenceJp,reason,extra){return Object.assign({questionType:type,prompt,answer,evidence,evidenceJp,reason},extra||{});}
function build(o){
  const sentences=o.rows.map(r=>r[0]), slashRows=o.rows.map(r=>({en:r[0],jp:r[1]})), fullTranslation=o.rows.map(r=>r[1]).join('');
  const wc=words(sentences.join(' ')).length;
  const idx=[0,1,2,3,4,Math.min(5,o.rows.length-1),Math.min(6,o.rows.length-1),Math.min(7,o.rows.length-1),Math.min(8,o.rows.length-1),o.rows.length-1];
  const ev=i=>o.rows[i][0], jp=i=>o.rows[i][1];
  const questions=[
    q('GIST',`「${o.title}」の最初の状況として本文に書かれていることを答えなさい。`,jp(idx[0]),ev(idx[0]),jp(idx[0]),'本文冒頭の状況から答えられます。'),
    q('DETAIL',`「${o.title}」の第2段階で起きたことを答えなさい。`,jp(idx[1]),ev(idx[1]),jp(idx[1]),'本文の該当文に直接示されています。'),
    q('REASON',`問題を考えるための手がかりとして本文の第3段階で分かったことを答えなさい。`,jp(idx[2]),ev(idx[2]),jp(idx[2]),'出来事の原因や判断材料になる文です。'),
    q('CONTENT_MATCH',`本文の第4段階の内容に合うものを答えなさい。`,jp(idx[3]),ev(idx[3]),jp(idx[3]),'本文の記述と一致します。'),
    q('DETAIL',`解決に向けて第5段階で起きたことを答えなさい。`,jp(idx[4]),ev(idx[4]),jp(idx[4]),'本文の該当文に直接示されています。')
  ];
  const questionSetB=[
    q('INFERENCE',`「${o.title}」の第6段階から読み取れることを答えなさい。`,jp(idx[5]),ev(idx[5]),jp(idx[5]),'前後の出来事を合わせると読み取れます。'),
    q('SENTENCE_INSERTION',`「この確認が次の行動につながりました。」を入れるなら、本文のどの段階の後が自然ですか。`,`第${idx[6]+1}文の後`,ev(idx[6]),jp(idx[6]),'この文の内容を受けて次の行動へ進むためです。',{insertAfterSentence:idx[6]+1}),
    q('CONTEXT_WORD',`第${idx[7]+1}文の内容を表す空所 _____ に当たる出来事を本文から答えなさい。`,jp(idx[7]),ev(idx[7]),jp(idx[7]),'文脈上、この出来事が空所の内容に当たります。'),
    q('SUMMARY_FILL',`まとめの空所 _____ に入る内容として第${idx[8]+1}文の要点を答えなさい。`,jp(idx[8]),ev(idx[8]),jp(idx[8]),'終盤の要点を示す文です。'),
    q('CONTENT_MATCH',`最後に分かったこと・決めたこととして本文に合うものを答えなさい。`,jp(idx[9]),ev(idx[9]),jp(idx[9]),'本文末の結論・行動と一致します。')
  ];
  return Object.assign({grade:'1',genre:'reading',batch:BATCH,wordCount:wc,sentences,fullTranslation,slashRows,questions,questionSetB,registered:false,questionStage:'BATCH08_DRAFT_CONTENT_AWARE_SCAFFOLD',authorReview:{reviewed:true,timelineCoherent:true,actorPerspectiveClear:true,causalLogicCoherent:true,translationNatural:true}},o,{rows:undefined});
}
const passages=[]; const add=o=>passages.push(build(o));
add({id:'V11-B08-G1-001',textbook:SS,section:'PROGRAM 10-2',sourceSectionBaselineId:'V10-SS-G1-P10-2-001',title:'The Pencil Case with Two Zippers',level:'STANDARD',targetWordBand:[95,125],rows:[
['After class, Mei found a black pencil case under the back desk.','放課後、芽衣は後ろの机の下で黒い筆箱を見つけました。'],
['It had two zippers, like the one used by several students.','それにはファスナーが二つあり、何人かの生徒が使っている物と似ていました。'],
['She opened only the large outside pocket and saw three ordinary pencils.','芽衣は大きな外側のポケットだけを開け、普通の鉛筆が三本あるのを見ました。'],
['She did not open the smaller pocket because it might hold private things.','小さいポケットには個人的な物が入っているかもしれないので、芽衣は開けませんでした。'],
['One pencil had a tiny green tape mark near the eraser.','一本の鉛筆には消しゴムの近くに小さな緑色のテープ印がありました。'],
['Mei remembered that Kota used green tape on his school supplies.','芽衣は、康太が学校用品に緑色のテープを使っていたことを思い出しました。'],
['She asked Kota to describe his missing case before showing it to him.','芽衣は筆箱を見せる前に、なくした筆箱の特徴を康太に説明してもらいました。'],
['He said it had two zippers and a green mark on one pencil.','康太は、ファスナーが二つあり、鉛筆一本に緑の印があると言いました。'],
['The details matched, so Mei gave the case back to Kota.','特徴が一致したので、芽衣は筆箱を康太に返しました。'],
['They learned that simple visible clues can identify an item without checking private spaces.','二人は、個人的な場所を調べなくても、見える手がかりで持ち物を確認できると学びました。']
]});
add({id:'V11-B08-G1-002',textbook:NH,section:'Unit 10-2',sourceSectionBaselineId:'V10-NH-G1-U10-2-001',title:'The Classroom Map Turned Sideways',level:'LONG',targetWordBand:[135,165],rows:[
['On Monday, two new students used the classroom map to find the music room.','月曜日、二人の新しい生徒が音楽室を探すために教室の地図を使いました。'],
['The map was hanging sideways because it had been moved during cleaning.','地図は掃除のときに動かされ、横向きに掛かっていました。'],
['The words were readable, but the front gate appeared on the wrong side.','文字は読めましたが、正門が反対側にあるように見えました。'],
['One student turned left in the hall while the other turned right.','一人は廊下で左へ曲がり、もう一人は右へ曲がりました。'],
['Both returned because the directions did not match what they saw.','二人とも、案内と目の前の様子が合わなかったので戻ってきました。'],
['Yui first added a large arrow showing where the front gate was.','結衣はまず、正門の位置を示す大きな矢印を付けました。'],
['That helped, but the sideways rooms were still hard to follow.','それで少し分かりやすくなりましたが、横向きの部屋配置はまだ分かりにくいままでした。'],
['Then the class turned the whole map to match the school entrance.','そこでクラスは、学校の入口に合う向きへ地図全体を回しました。'],
['They added a red dot for the classroom and a blue dot for the music room.','教室には赤い点、音楽室には青い点を付けました。'],
['Two other students tested the display without extra directions.','別の二人の生徒が、追加説明なしで新しい表示を試しました。'],
['Both reached the music room by the same route.','二人とも同じ道順で音楽室へ着きました。'],
['The class kept the corrected map and asked cleaners not to rotate it.','クラスは直した地図をそのまま使い、掃除の際に向きを変えないようお願いしました。'],
['The test showed that a clear starting point and direction made the map easier to use.','この試し方から、出発点と向きをはっきりさせると地図が使いやすくなると分かりました。']
]});
add({id:'V11-B08-G1-003',textbook:SS,section:'PROGRAM 10-2',sourceSectionBaselineId:'V10-SS-G1-P10-2-001',title:'A Lunch Box Left in the Art Room',level:'STANDARD',targetWordBand:[95,125],rows:[
['During art club cleanup, Sora found a lunch box beside the paint shelves.','美術部の片付け中、空は絵の具の棚のそばで弁当箱を見つけました。'],
['No one in the room said it belonged to them.','部屋にいた誰も自分の物だとは言いませんでした。'],
['Rina remembered seeing the same box on a table near the window earlier.','里奈は、少し前に窓の近くの机で同じ箱を見たことを思い出しました。'],
['Another student said the table had been cleared before club practice began.','別の生徒は、部活が始まる前にその机を片付けたと言いました。'],
['They checked the cleanup basket and found a cloth from the same table.','片付け用のかごを調べると、その机にあった布が見つかりました。'],
['The cloth had been carried from the classroom next door.','その布は隣の教室から運ばれてきた物でした。'],
['Sora asked that class whether anyone had lost a lunch box.','空は隣のクラスで弁当箱をなくした人がいないか尋ねました。'],
['Haruki raised his hand and described a silver box with a yellow band.','陽希が手を挙げ、黄色い帯の付いた銀色の箱だと説明しました。'],
['The description matched the box in the art room.','その説明は美術室にあった箱と一致しました。'],
['They returned it before Haruki left school and changed the cleanup rule to check owners first.','陽希が帰る前に箱を返し、片付けでは先に持ち主を確認することにしました。']
]});
add({id:'V11-B08-G1-004',textbook:NH,section:'Unit 10-2',sourceSectionBaselineId:'V10-NH-G1-U10-2-001',title:'The Wrong Date on the Whiteboard',level:'STANDARD',targetWordBand:[95,125],rows:[
['On Tuesday morning, the whiteboard said that the science report was due Friday.','火曜日の朝、ホワイトボードには理科のレポートは金曜日が締切だと書かれていました。'],
['Miki copied that date into her notebook before the first lesson.','美紀は一時間目の前にその日付をノートへ写しました。'],
['Later, another group said their notebooks showed Thursday.','その後、別のグループは自分たちのノートには木曜日と書いてあると言いました。'],
['At first, both groups thought the other side had copied the date incorrectly.','最初はどちらのグループも、相手が日付を間違えて写したと思いました。'],
['They checked the teacher’s printed plan from Monday.','生徒たちは月曜日に配られた先生の予定表を確認しました。'],
['It clearly said Thursday, the twelfth, beside the science report.','そこには理科のレポートの横に「12日木曜日」とはっきり書かれていました。'],
['Then they found a small note showing that Friday belonged to a different task.','さらに、金曜日は別の課題の日だと示す小さなメモを見つけました。'],
['The whiteboard date had been copied from the wrong line.','ホワイトボードの日付は違う行から写されていたのです。'],
['Miki corrected the board and told the class before lunch.','美紀はホワイトボードを直し、昼食前にクラスへ知らせました。'],
['After that, students checked the printed plan when a copied date did not match their notes.','その後は、写した日付とノートが合わないとき、予定表を確認するようになりました。']
]});
add({id:'V11-B08-G1-005',textbook:SS,section:'PROGRAM 10-2',sourceSectionBaselineId:'V10-SS-G1-P10-2-001',title:'The Library Cart Blocking the Way',level:'LONG',targetWordBand:[135,165],rows:[
['Every afternoon, the library staff rolled a book cart beside the return desk.','毎日の午後、図書室では返却机の横へ本のカートを置いていました。'],
['The cart helped with sorting, but it made one passage very narrow.','カートは本の整理に便利でしたが、通路の一つをとても狭くしていました。'],
['Most students walked around it without stopping.','多くの生徒は立ち止まらずにその横を通っていました。'],
['One day, a student carrying a large bag bumped the cart with her elbow.','ある日、大きなかばんを持った生徒がひじでカートにぶつかりました。'],
['No books fell, but everyone saw that the route was too tight.','本は落ちませんでしたが、その通路が狭すぎると皆が気づきました。'],
['The class measured the space and moved the cart closer to the wall.','クラスは幅を測り、カートを壁の近くへ動かしました。'],
['That created more room, but one wheel blocked the door when it opened.','通りやすくなりましたが、扉を開くと車輪が邪魔になりました。'],
['They next placed the cart beside a low shelf three meters away.','次に、生徒たちは三メートル離れた低い棚の横へカートを置きました。'],
['Students could still return books quickly, and the door opened fully.','そこでも本はすぐ返せて、扉も完全に開きました。'],
['A teacher walked through while carrying a box and had no problem.','先生が箱を持って通ってみても問題ありませんでした。'],
['The librarian checked that emergency signs stayed easy to see.','司書は非常時の表示が見やすいままかも確認しました。'],
['After two days, no one needed to squeeze past the cart.','二日後まで、カートの横を無理にすり抜ける人はいませんでした。'],
['The staff marked the safer place with a small piece of tape.','図書室では、安全な置き場所を小さなテープで示しました。']
]});
add({id:'V11-B08-G1-006',textbook:NH,section:'Unit 10-2',sourceSectionBaselineId:'V10-NH-G1-U10-2-001',title:'The Photo with One Person Missing',level:'STANDARD',targetWordBand:[95,125],rows:[
['The class took a group photo after the school festival.','クラスは学校祭の後に集合写真を撮りました。'],
['When they looked at the picture, they noticed that Daichi was missing.','写真を見ると、大地が写っていないことに気づきました。'],
['He had been carrying empty boxes to the storage room when the photo was taken.','写真を撮ったとき、大地は空箱を倉庫へ運んでいました。'],
['Some students wanted to take the whole picture again immediately.','何人かは全員でもう一度すぐ撮り直したいと言いました。'],
['Others had already changed clothes and needed to catch their buses.','一方、すでに着替えてバスに乗らなければならない生徒もいました。'],
['Daichi said he did not want everyone to stay late because of him.','大地は自分のために皆を遅くまで残したくないと言いました。'],
['The class chose a simpler plan and asked four nearby friends to stand with him.','クラスは簡単な方法を選び、近くにいた四人の友達に大地と一緒に立ってもらいました。'],
['They took a second picture in front of the same festival sign.','同じ学校祭の看板の前で二枚目の写真を撮りました。'],
['Both pictures were placed together on the class page.','二枚の写真はクラスのページに一緒に載せられました。'],
['Daichi was included, and no one had to repeat the entire group photo.','大地も含まれ、全員が集合写真を撮り直す必要もありませんでした。']
]});
add({id:'V11-B08-G1-007',textbook:SS,section:'PROGRAM 10-2',sourceSectionBaselineId:'V10-SS-G1-P10-2-001',title:'The Water Bottle on the Sunny Desk',level:'STANDARD',targetWordBand:[95,125],rows:[
['Yuna left her water bottle on a desk beside the sunny window.','結菜は日当たりのよい窓のそばの机に水筒を置きました。'],
['She went to another classroom for two lessons.','結菜は二時間、別の教室へ行きました。'],
['When she returned, the bottle felt much warmer than before.','戻ると、水筒は前よりずっと温かくなっていました。'],
['The water was still safe, but she did not enjoy drinking it.','水は飲めましたが、結菜はあまりおいしく感じませんでした。'],
['Her friend’s bottle had stayed cool inside a bag under the desk.','友達の水筒は机の下のかばんの中で冷たいままでした。'],
['Yuna moved her own bottle away from the window the next day.','翌日、結菜は自分の水筒を窓から離しました。'],
['She placed it in the shaded side pocket of her school bag.','学校のかばんの日陰になる横ポケットへ入れました。'],
['After two lessons, the water was much cooler.','二時間後、水はずっと冷たいままでした。'],
['She kept using the new place during warm days.','結菜は暖かい日にはその新しい場所を使い続けました。'],
['A small change in where she stored the bottle made it more comfortable to use.','水筒を置く場所を少し変えるだけで、より気持ちよく使えるようになりました。']
]});
add({id:'V11-B08-G1-008',textbook:NH,section:'Unit 10-2',sourceSectionBaselineId:'V10-NH-G1-U10-2-001',title:'Two Signs for the Same Stairway',level:'LONG',targetWordBand:[135,165],rows:[
['Visitors saw one sign saying, “Music Room: Upstairs Left.”','来校者は「音楽室：二階左」と書かれた案内を見ました。'],
['At the next corner, another sign said, “Music Room: Right after the stairs.”','次の角には「音楽室：階段を上がって右」と書かれていました。'],
['Both described the same route, but visitors thought they pointed to different places.','どちらも同じ道順でしたが、来校者には別の場所を示しているように見えました。'],
['One family went back to the entrance for help.','ある家族は助けを求めて入口まで戻りました。'],
['The student council followed the route like a first-time visitor.','生徒会は初めて来た人のつもりで道順をたどりました。'],
['They found that the first sign used the direction before climbing the stairs.','最初の案内は階段を上がる前の向きで左右を示していると分かりました。'],
['The second sign used the direction after reaching the upper floor.','二つ目は二階に着いた後の向きで示していました。'],
['Students rewrote both signs to use the same landmarks and order.','生徒たちは同じ目印と順番を使うよう、二つの案内を書き直しました。'],
['The first new sign said to take the main stairs to the second floor.','新しい最初の案内には、中央階段で二階へ行くと書きました。'],
['The next said to turn right at the library.','次の案内には、図書室で右へ曲がると書きました。'],
['Three students who had not seen the old signs tested the wording.','古い案内を見ていない三人の生徒が新しい表現を試しました。'],
['All three reached the music room without asking for help.','三人とも助けを求めずに音楽室へ着きました。'],
['The council replaced the old signs before the next event.','生徒会は次の行事の前に古い案内を取り替えました。']
]});
add({id:'V11-B08-G1-009',textbook:SS,section:'PROGRAM 10-2',sourceSectionBaselineId:'V10-SS-G1-P10-2-001',title:'The Eraser Pieces on the Floor',level:'STANDARD',targetWordBand:[95,125],rows:[
['Small eraser pieces appeared under one table during group work.','グループ活動中、一つの机の下に小さな消しゴムのかけらが落ちていました。'],
['A student quickly said that Ren had made the mess.','一人の生徒はすぐに、蓮が散らかしたと言いました。'],
['Ren was using a large white eraser, so the claim sounded possible.','蓮は大きな白い消しゴムを使っていたので、その話はありそうに思えました。'],
['However, Aya remembered that the floor had been clean when Ren joined the group.','しかし彩は、蓮がグループに加わったとき床はきれいだったことを覚えていました。'],
['They checked a photo taken before the activity started.','生徒たちは活動前に撮った写真を確認しました。'],
['No pieces were visible under the table in that picture.','その写真では机の下にかけらは見えませんでした。'],
['Then they noticed that several students had used colored erasers during the poster task.','その後、ポスター作りで何人かが色付きの消しゴムを使っていたと気づきました。'],
['The pieces on the floor were pink, blue, and yellow, not white.','床のかけらは白ではなく、桃色、青、黄色でした。'],
['The group stopped blaming Ren and cleaned the floor together.','グループは蓮を責めるのをやめ、皆で床を掃除しました。'],
['They agreed to check what actually happened before deciding who caused a problem.','誰のせいか決める前に、実際に何が起きたか確認することにしました。']
]});
add({id:'V11-B08-G1-010',textbook:NH,section:'Unit 10-2',sourceSectionBaselineId:'V10-NH-G1-U10-2-001',title:'The Umbrella Stand Number',level:'STANDARD',targetWordBand:[95,125],rows:[
['After a rainy morning, two students reached for umbrellas marked number twelve.','雨の朝の後、二人の生徒が12番と書かれた傘を取ろうとしました。'],
['The stand had two spaces with the same number.','傘立てには同じ番号の場所が二つありました。'],
['One umbrella was black, and the other was dark blue.','一つは黒い傘で、もう一つは濃い青の傘でした。'],
['Neither student was sure which space had been meant for them.','どちらの生徒も自分の場所がどちらか分かりませんでした。'],
['They checked the paper list beside the stand.','二人は傘立ての横の紙の一覧を確認しました。'],
['The list showed numbers eleven, twelve, thirteen, and fourteen only once each.','一覧には11、12、13、14が一つずつ書かれていました。'],
['Then they saw that the second twelve should have been thirteen.','そこで、二つ目の12は13であるはずだと分かりました。'],
['A loose label had covered the old number.','はがれかけたラベルが元の番号を隠していました。'],
['They replaced the label and returned each umbrella to the correct space.','ラベルを直し、それぞれの傘を正しい場所へ戻しました。'],
['Before the next rainy day, the class checked every number on the stand.','次の雨の日の前に、クラスは傘立ての全番号を確認しました。']
]});
add({id:'V11-B08-G1-011',textbook:SS,section:'PROGRAM 10-2',sourceSectionBaselineId:'V10-SS-G1-P10-2-001',title:'The Club Poster Behind the Curtain',level:'LONG',targetWordBand:[135,165],rows:[
['The science club made a colorful poster for its weekend event.','科学部は週末の行事のために色鮮やかなポスターを作りました。'],
['A student pinned it to the notice board near the stage.','一人の生徒が舞台近くの掲示板に貼りました。'],
['The poster was technically on display, but a heavy curtain covered most of it.','掲示はされていましたが、厚いカーテンがほとんどを隠していました。'],
['Only the bottom corner could be seen from the hallway.','廊下から見えたのは下の角だけでした。'],
['The club first moved the poster to the center of a glass door.','科学部はまずガラス扉の中央へポスターを移しました。'],
['That place was visible, but the paper covered part of the window people used to look through.','そこは見やすい一方、人がのぞく窓の一部を紙がふさいでいました。'],
['They tried a second wall beside the entrance.','そこで入口の横にある別の壁を試しました。'],
['From there, students could read the title while walking past.','そこなら通りながら題名を読むことができました。'],
['The poster did not block the door, the window, or any safety information.','ポスターは扉、窓、安全情報のどれも隠しませんでした。'],
['Club members watched the area during lunch and saw many students stop to read it.','部員が昼休みに様子を見ると、多くの生徒が立ち止まって読んでいました。'],
['They also asked a teacher to check that the new place was allowed.','新しい場所に貼ってよいか先生にも確認しました。'],
['The teacher approved it, so they left the poster on that wall.','先生が認めたので、その壁に貼ることにしました。'],
['The club learned that being displayed is not enough if the information cannot actually be seen.','情報は掲示するだけでなく、実際に見えることが大切だと学びました。']
]});
add({id:'V11-B08-G1-012',textbook:NH,section:'Unit 10-2',sourceSectionBaselineId:'V10-NH-G1-U10-2-001',title:'A Note Put in the Wrong Notebook',level:'STANDARD',targetWordBand:[95,125],rows:[
['Kei opened his math notebook and found a short note between two pages.','圭は数学のノートを開き、ページの間に短いメモを見つけました。'],
['The note said to bring colored paper for an English activity.','メモには英語の活動のため色紙を持ってくるよう書かれていました。'],
['Kei knew the message was not for his math lesson.','圭はそのメッセージが数学の授業用ではないと分かりました。'],
['He compared the handwriting with notes written by his table group.','圭は同じ班の人が書いたメモと字を比べました。'],
['Mao’s letters had the same round shape and small star beside her name.','真央の字には同じ丸い形と、名前の横の小さな星がありました。'],
['Kei also remembered that Mao had borrowed his notebook during the previous class.','圭は前の授業で真央が自分のノートを借りたことも思い出しました。'],
['He asked Mao whether she had lost a reminder.','圭は真央に、覚え書きをなくしていないか尋ねました。'],
['She described the colored paper message before Kei showed it to her.','圭が見せる前に、真央は色紙についてのメッセージだと説明しました。'],
['The note was hers, so he returned it without reading anything else.','メモは真央の物だったので、圭はそれ以上読まずに返しました。'],
['They both checked notebook names more carefully when sharing materials later.','その後、二人は物を貸し借りするときノートの名前をより注意して確認しました。']
]});
add({id:'V11-B08-G1-013',textbook:SS,section:'PROGRAM 10-2',sourceSectionBaselineId:'V10-SS-G1-P10-2-001',title:'The Chair with a Loose Label',level:'STANDARD',targetWordBand:[95,125],rows:[
['Before a school event, one paper label fell from a chair in the front row.','学校行事の前、前列の椅子から紙の番号札が一枚落ちました。'],
['The label showed seat B-6, but no chair now had that number.','札にはB-6とありましたが、その番号の椅子がなくなっていました。'],
['Students first wanted to place it on the nearest empty chair.','生徒たちは最初、最も近い空いた椅子に付けようとしました。'],
['Then they checked the labels still attached on both sides.','しかし両側に残っている番号札を確認しました。'],
['The chairs read B-4, B-5, an empty place, B-7, and B-8.','椅子はB-4、B-5、札なし、B-7、B-8の順でした。'],
['The order showed exactly where B-6 belonged.','その順番からB-6の場所が正確に分かりました。'],
['They attached the loose label to the chair between B-5 and B-7.','生徒たちはB-5とB-7の間の椅子に札を付けました。'],
['A teacher compared the row with the seating list.','先生がその列と座席表を比べました。'],
['Every number then matched the planned order.','するとすべての番号が予定した順番と一致しました。'],
['Using the sequence was safer than guessing from where the label was found.','札が落ちた場所から推測するより、番号の順番を使う方が確実でした。']
]});
add({id:'V11-B08-G1-014',textbook:NH,section:'Unit 10-2',sourceSectionBaselineId:'V10-NH-G1-U10-2-001',title:'The Bell Nobody Heard Outside',level:'STANDARD',targetWordBand:[95,125],rows:[
['The outdoor practice group waited for the usual bell to end its activity.','屋外練習のグループは、活動終了を知らせるいつものベルを待っていました。'],
['The school bell rang, but students near the far field did not hear it.','校内ではベルが鳴りましたが、遠い運動場の生徒には聞こえませんでした。'],
['They returned several minutes late and missed the start of cleanup.','生徒たちは数分遅れて戻り、片付けの開始に間に合いませんでした。'],
['At first, the group thought the bell had failed.','最初、グループはベルが鳴らなかったと思いました。'],
['A teacher inside confirmed that it had worked normally.','校内の先生はベルが普通に鳴ったと確認しました。'],
['Students tested the sound from different parts of the field.','生徒たちは運動場のいろいろな場所で音を確かめました。'],
['They could hear it near the building but not behind the tall equipment shed.','校舎の近くでは聞こえましたが、高い用具庫の後ろでは聞こえませんでした。'],
['The group chose a backup signal using a red flag at the correct time.','グループは決まった時刻に赤い旗を使う予備の合図を決めました。'],
['One student near the building watched the clock and raised the flag.','校舎近くの一人が時計を見て旗を上げました。'],
['The outdoor group could see the signal clearly and returned on time.','屋外のグループは合図をはっきり見て、時間通り戻れました。']
]});
add({id:'V11-B08-G1-015',textbook:SS,section:'PROGRAM 10-2',sourceSectionBaselineId:'V10-SS-G1-P10-2-001',title:'The Shoes That Dried at Different Speeds',level:'LONG',targetWordBand:[135,165],rows:[
['After cleaning day, two pairs of indoor shoes were washed at the same time.','清掃の日の後、二足の上履きを同じ時刻に洗いました。'],
['One pair was placed beside an open window, and the other was left under a bench.','一足は開いた窓のそばに置き、もう一足はベンチの下に置きました。'],
['The next morning, the shoes by the window were almost dry.','翌朝、窓のそばの上履きはほとんど乾いていました。'],
['The pair under the bench was still wet inside.','ベンチの下の上履きは中がまだぬれていました。'],
['Students first wondered whether one pair had been washed with more water.','生徒たちは最初、片方をより多くの水で洗ったのではないかと考えました。'],
['They weighed both pairs after washing on the next cleaning day.','次の清掃日には、洗った後の二足の重さを量りました。'],
['The starting weights were almost the same.','洗い終わった時点の重さはほとんど同じでした。'],
['Then they changed only the drying place while keeping the washing method the same.','そこで洗い方は同じにして、乾かす場所だけを変えました。'],
['Again, the shoes near moving air dried faster than the pair under the bench.','再び、風が通る場所の上履きの方がベンチの下より早く乾きました。'],
['The class also checked that direct rain could not reach the window area.','クラスは窓の場所に雨が直接入らないことも確認しました。'],
['They created a drying rack in the safe, airy place beside the window.','安全で風通しのよい窓のそばに乾燥用の棚を作りました。'],
['Labels showed where wet shoes should be put after future cleaning days.','札を付け、今後の清掃後にぬれた上履きを置く場所を示しました。'],
['The small test helped them separate the effect of the drying place from the amount of water used.','小さな実験で、水の量と乾かす場所の影響を分けて考えることができました。']
]});
add({id:'V11-B08-G1-016',textbook:NH,section:'Unit 10-2',sourceSectionBaselineId:'V10-NH-G1-U10-2-001',title:'The Page Number Missing from the Handout',level:'STANDARD',targetWordBand:[95,125],rows:[
['A class received a four-page handout, but one page had no printed number.','クラスは四ページのプリントを受け取りましたが、一枚にはページ番号がありませんでした。'],
['Students were unsure whether it belonged in the middle or at the end.','生徒たちは真ん中か最後か分かりませんでした。'],
['They read the last sentence on page two.','そこで二ページ目の最後の文を読みました。'],
['It introduced a question about how plants use light.','その文は植物が光をどう使うかという問いを出していました。'],
['The unnumbered page began by answering that same question.','番号のないページは、その同じ問いに答えるところから始まりました。'],
['Its final sentence then introduced a short experiment.','そのページの最後の文は短い実験を紹介していました。'],
['Page four started with the words, “In this experiment,” and gave the results.','四ページ目は「この実験では」という言葉で始まり、結果を示していました。'],
['The sentence connections showed that the unnumbered sheet was page three.','文のつながりから、番号のない紙は三ページ目だと分かりました。'],
['Students wrote a small three in the corner and put the pages in order.','生徒たちは角に小さく3と書き、ページを順番に並べました。'],
['They learned that the flow of ideas can help when a printed number is missing.','番号がなくても、内容の流れが手がかりになると学びました。']
]});
add({id:'V11-B08-G1-017',textbook:SS,section:'PROGRAM 10-2',sourceSectionBaselineId:'V10-SS-G1-P10-2-001',title:'The Window Left Open After Practice',level:'STANDARD',targetWordBand:[95,125],rows:[
['After club practice, Hana returned to the classroom to get her notebook.','部活の後、花はノートを取りに教室へ戻りました。'],
['She found one window open even though everyone had already left.','皆が帰った後なのに、窓が一つ開いていました。'],
['The weather report said rain might begin during the evening.','天気予報では夕方から雨が降るかもしれないと言っていました。'],
['Hana closed the window and told the club leader what she had found.','花は窓を閉め、見つけたことを部長に伝えました。'],
['The leader checked the room list and saw that windows had no final checker.','部長が教室の確認表を見ると、窓には最後の確認係が決まっていませんでした。'],
['Students made a short routine for the last two people leaving practice.','生徒たちは最後に帰る二人のために短い確認手順を作りました。'],
['One person checked windows and lights.','一人が窓と照明を確認しました。'],
['The other checked the door and any equipment left on desks.','もう一人が扉と机に残った用具を確認しました。'],
['They signed a small box on the list when both checks were finished.','二つの確認が終わると一覧の小さな欄に印を付けました。'],
['On later practice days, the room was checked before the final pair left.','その後の練習日には、最後の二人が帰る前に教室が確認されるようになりました。']
]});
window.V11_BATCH08_G1_DRAFTS=passages;
window.V11_BATCH08_G1_DRAFT_META={batch:BATCH,count:passages.length,registered:false,stage:'G1_DRAFT_AUTHORING'};
})(typeof window!=='undefined'?window:this);
