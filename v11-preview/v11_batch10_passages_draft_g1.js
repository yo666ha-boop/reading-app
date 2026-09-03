(function buildV11Batch10G1Drafts(){
'use strict';
const BATCH='V11-B10-G1-DRAFT-20260829',SS='サンシャイン',NH='ニューホライズン';
function words(s){return (String(s||'').match(/[A-Za-z]+(?:['’][A-Za-z]+)?/g)||[]);}
function q(type,prompt,answer,evidence,evidenceJp,reason){return {questionType:type,prompt,answer,evidence,evidenceJp,reason};}
function build(o){
 const sentences=o.rows.map(r=>r[0]),slashRows=o.rows.map(r=>({en:r[0],jp:r[1]})),fullTranslation=o.rows.map(r=>r[1]).join('');
 const wc=words(sentences.join(' ')).length,n=sentences.length,ix=x=>Math.max(0,Math.min(n-1,x)),ev=i=>sentences[ix(i)],jp=i=>slashRows[ix(i)].jp;
 const questions=[q('GIST',`「${o.title}」で最初に起きた問題は何ですか。`,jp(0),ev(0),jp(0),'冒頭の状況が根拠です。'),q('DETAIL','問題を確かめるために見つけた手がかりを答えなさい。',jp(2),ev(2),jp(2),'本文中の具体的な手がかりが根拠です。'),q('REASON','最初の考えをそのまま使わなかった理由を答えなさい。',jp(4),ev(4),jp(4),'判断を見直した理由が示されています。'),q('CONTENT_MATCH','その後に行った対応を答えなさい。',jp(Math.max(5,n-3)),ev(Math.max(5,n-3)),jp(Math.max(5,n-3)),'解決へ向けた行動が直接書かれています。'),q('GIST','最後に分かったことを答えなさい。',jp(n-1),ev(n-1),jp(n-1),'最後の文が学びをまとめています。')];
 const questionSetB=[q('INFERENCE','本文全体から、正しく判断するために大切だと分かることは何ですか。',jp(n-2),ev(n-2),jp(n-2),'終盤の判断から読み取れます。'),q('SUMMARY_FILL','出来事の流れで、確認のあとに行った中心的な行動を答えなさい。',jp(Math.floor(n/2)),ev(Math.floor(n/2)),jp(Math.floor(n/2)),'解決へ進む転換点です。'),q('DETAIL','判断を変えた具体的な情報を答えなさい。',jp(3),ev(3),jp(3),'本文中の具体的情報です。'),q('CONTENT_MATCH','最終的な変更や決定として本文に合う内容を答えなさい。',jp(n-2),ev(n-2),jp(n-2),'終盤の決定と一致します。'),q('GIST',`「${o.title}」から得られる学びを答えなさい。`,jp(n-1),ev(n-1),jp(n-1),'結末が文章全体の学びを示しています。')];
 return Object.assign({grade:'1',genre:'reading',batch:BATCH,level:'STANDARD',targetWordBand:[90,125],wordCount:wc,sentences,fullTranslation,slashRows,questions,questionSetB,registered:false,questionStage:'BATCH10_DRAFT_HUMAN_BASE',authorReview:{reviewed:true,timelineCoherent:true,actorPerspectiveClear:true,causalLogicCoherent:true,translationNatural:true}},o,{rows:undefined});
}
const passages=[],add=o=>passages.push(build(o));
add({id:'V11-B10-G1-001',textbook:SS,section:'PROGRAM 10-2',sourceSectionBaselineId:'V10-SS-G1-P10-2-001',title:'The Name Card Put on the Wrong Desk',rows:[
['Before homeroom, Sora noticed a name card on the desk beside his.','朝の会の前、空は自分の隣の机に名札があることに気づきました。'],
['The card said Miki, but Miki usually sat near the window.','名札には美紀とありましたが、美紀はいつも窓の近くに座っていました。'],
['A small number on the back of the card matched desk fourteen.','名札の裏の小さな番号は十四番の机を示していました。'],
['Sora checked the seating chart and saw that desk fourteen was by the window.','空が座席表を確かめると、十四番の机は窓のそばでした。'],
['He did not move the whole desk because the desks had already been arranged for a quiz.','小テスト用に机はすでに並べられていたので、空は机そのものを動かしませんでした。'],
['Instead, he carried only the name card to desk fourteen.','代わりに名札だけを十四番の机へ運びました。'],
['Miki arrived and confirmed that the card was hers.','美紀が来て、その名札が自分のものだと確認しました。'],
['The teacher later asked students to place cards only after checking desk numbers.','先生は後で、机の番号を確かめてから名札を置くよう生徒に伝えました。'],
['Sora learned that a small label can solve a problem without changing everything around it.','空は、小さな表示を確かめれば周りを全部動かさずに問題を解けると学びました。']
]});
add({id:'V11-B10-G1-002',textbook:NH,section:'Unit 10-2',sourceSectionBaselineId:'V10-NH-G1-U10-2-001',title:'A Soccer Practice Moved because of the Wind',rows:[
['Riku planned to meet his soccer team on the main field after school.','陸は放課後、サッカーチームと運動場で会う予定でした。'],
['At lunch, a strong wind began blowing dust across the field.','昼休み、強い風が運動場に砂ぼこりを飛ばし始めました。'],
['The coach posted a new message saying practice would start in the gym at four.','コーチは、練習を四時から体育館で始めるという新しい連絡を出しました。'],
['Riku first looked only at the old weekly schedule on his notebook.','陸は最初、ノートに書いた古い週間予定だけを見ました。'],
['Then his friend showed him the message and pointed to its time, one thirty.','すると友達が連絡を見せ、午後一時半という送信時刻を指しました。'],
['Riku understood that the newer notice replaced the usual field plan for that day.','陸は、その日の通常の運動場予定が新しい連絡に変わったと分かりました。'],
['He went to the gym and helped move the balls away from an open door.','体育館へ行き、開いた扉から離れた所へボールを運ぶのを手伝いました。'],
['The whole team started safely without waiting on the windy field.','チーム全員は風の強い運動場で待たず、安全に練習を始めました。'],
['Riku learned to check recent messages when weather can change a familiar plan.','陸は、天候でいつもの予定が変わりそうなときは新しい連絡を確認すると学びました。']
]});
add({id:'V11-B10-G1-003',textbook:SS,section:'PROGRAM 10-2',sourceSectionBaselineId:'V10-SS-G1-P10-2-001',title:'The Two Keys for the Science Room',rows:[
['Hana found two silver keys on the teacher’s table after science class.','花は理科の授業後、先生の机に銀色の鍵が二本あるのを見つけました。'],
['Both looked alike, but only one opened the science room storage door.','二本はよく似ていましたが、理科室の倉庫を開けるのは一本だけでした。'],
['One key had a faded blue dot and the other had a tiny number three.','一本には薄い青い点、もう一本には小さな三の数字がありました。'],
['Hana checked the key board and saw a blue mark beside “Science Storage.”','花が鍵の一覧を見ると、「理科倉庫」の横に青い印がありました。'],
['She did not try both keys in different doors because another class was using the hallway.','別のクラスが廊下を使っていたので、花はあちこちの扉で二本を試しませんでした。'],
['She brought the blue-dot key to the teacher and explained what she had found.','青い点の鍵を先生へ持って行き、見つけたことを説明しました。'],
['The teacher confirmed it was the storage key and returned the numbered key to another room.','先生はそれが倉庫の鍵だと確認し、番号の鍵は別の部屋へ戻しました。'],
['They replaced the faded dot with a clear blue label.','二人は薄くなった点を見やすい青い表示に取り替えました。'],
['Hana learned that a label and a list are safer clues than guessing with a key.','花は、鍵を試して推測するより表示と一覧を使う方が安全だと学びました。']
]});
add({id:'V11-B10-G1-004',textbook:NH,section:'Unit 10-2',sourceSectionBaselineId:'V10-NH-G1-U10-2-001',title:'A Class Photo Taken before One Student Arrived',rows:[
['The class looked at a photo taken before the school trip began.','クラスは校外学習が始まる前に撮った写真を見ていました。'],
['Yui counted thirty students in the picture, although the class had thirty-one students that day.','結衣が数えると写真には三十人いましたが、その日のクラスは三十一人でした。'],
['A second photo showed Kota holding a red bag beside the bus.','二枚目の写真には、航太がバスのそばで赤いかばんを持つ姿が写っていました。'],
['The time printed on that photo was eight forty, five minutes after the first picture.','その写真の時刻は八時四十分で、一枚目より五分後でした。'],
['At first, Yui thought someone might have left the trip early.','最初、結衣は誰かが校外学習から早く帰ったのかもしれないと思いました。'],
['Then Kota remembered arriving late because his bus to school had been slow.','すると航太は、学校へ来るバスが遅れて到着が遅くなったことを思い出しました。'],
['The attendance sheet also showed that he joined before the class bus departed.','出席表にも、クラスのバスが出る前に航太が合流したと記録されていました。'],
['The class labeled the first picture “before Kota arrived” instead of “the whole class.”','クラスは一枚目を「全員」ではなく「航太が来る前」と表示しました。'],
['Yui learned that the time of a photo matters when deciding who was present.','結衣は、誰がいたか判断するとき写真の時刻が大切だと学びました。']
]});
add({id:'V11-B10-G1-005',textbook:SS,section:'PROGRAM 10-2',sourceSectionBaselineId:'V10-SS-G1-P10-2-001',title:'The Snack Table with Allergy Cards',rows:[
['At a class party, Ken helped arrange snacks on three small tables.','クラス会で、健は三つの小さな机にお菓子を並べるのを手伝いました。'],
['Some students could not eat peanuts, so each snack needed a clear card.','ピーナッツを食べられない生徒がいるため、各お菓子には分かりやすいカードが必要でした。'],
['Ken saw one plate of cookies beside a card that said “no peanuts.”','健は「ピーナッツなし」と書かれたカードのそばにクッキーの皿を見つけました。'],
['Before serving them, he checked the unopened package under the plate.','配る前に、健は皿の下にあった未開封の袋を確認しました。'],
['The package said the cookies contained peanuts, so the card had been placed by the wrong plate.','袋にはピーナッツ入りと書かれており、カードが別の皿の所に置かれていたと分かりました。'],
['Ken stopped serving the cookies and told the teacher.','健はクッキーを配るのをやめ、先生に伝えました。'],
['They moved the plate and put a new card directly in front of it.','二人は皿を移し、新しいカードをその真正面に置きました。'],
['They also checked every other package before the party started.','さらにクラス会が始まる前に、ほかの袋もすべて確認しました。'],
['Ken learned that food labels should be checked directly when safety depends on them.','健は、安全に関わるときは食べ物そのものの表示を直接確認すべきだと学びました。']
]});
add({id:'V11-B10-G1-006',textbook:NH,section:'Unit 10-2',sourceSectionBaselineId:'V10-NH-G1-U10-2-001',title:'A Morning Train Delayed by Ten Minutes',rows:[
['Mio took the seven thirty train to meet her class at the station.','美緒は駅でクラスと会うため、七時三十分の電車に乗る予定でした。'],
['When she reached the platform, the board showed a ten-minute delay.','ホームに着くと、案内板は十分の遅れを示していました。'],
['Her paper schedule still showed the normal arrival time of seven fifty.','紙の時刻表には通常の到着時刻である七時五十分のままでした。'],
['Mio checked the electronic board again and saw her train number beside eight o’clock.','美緒が電光掲示板をもう一度見ると、自分の電車番号の横に八時とありました。'],
['She did not take an earlier train on another line because it stopped far from the meeting place.','別の路線の早い電車は集合場所から遠くに停まるため、そちらには乗りませんでした。'],
['Instead, she sent her teacher a short message about the delay.','代わりに先生へ遅れを知らせる短い連絡を送りました。'],
['The teacher answered that the class would wait until eight ten.','先生は八時十分まで待つと返信しました。'],
['Mio arrived at eight and joined the group without rushing through another station.','美緒は八時に着き、別の駅から急いで移動せずに合流できました。'],
['She learned to use current travel information and tell others when a delay changes a plan.','遅れで予定が変わるときは最新の交通情報を使い、相手にも知らせると学びました。']
]});
add({id:'V11-B10-G1-007',textbook:SS,section:'PROGRAM 10-2',sourceSectionBaselineId:'V10-SS-G1-P10-2-001',title:'The Art Box Returned to Another Class',rows:[
['After art class, Nao could not find her class’s box of colored pencils.','美術の授業後、奈緒はクラスの色鉛筆箱を見つけられませんでした。'],
['A similar green box was on the shelf, but its lid had a small “2-B” sticker.','似た緑の箱が棚にありましたが、ふたには小さく「2-B」と貼られていました。'],
['Nao remembered that class 2-B had used the art room before lunch.','奈緒は二年B組が昼食前に美術室を使っていたことを思い出しました。'],
['She checked the return list and saw that one box from her class had been carried to shelf B.','返却表を見ると、自分のクラスの箱一つがBの棚へ運ばれたと記録されていました。'],
['She did not take the green box because its class label clearly belonged to someone else.','緑の箱には別のクラス名がはっきりあるため、奈緒はそれを持って行きませんでした。'],
['With the teacher, she looked on shelf B and found a blue box marked with her class number.','先生とBの棚を調べると、自分のクラス番号が付いた青い箱を見つけました。'],
['They returned both boxes to their correct shelves.','二人は二つの箱をそれぞれ正しい棚へ戻しました。'],
['The teacher added large class labels to the shelf edges as well as the boxes.','先生は箱だけでなく棚の端にも大きなクラス表示を付けました。'],
['Nao learned that matching two labels can prevent one mistake from causing another.','奈緒は、二つの表示を合わせれば一つの間違いから別の間違いが起きるのを防げると学びました。']
]});
add({id:'V11-B10-G1-008',textbook:NH,section:'Unit 10-2',sourceSectionBaselineId:'V10-NH-G1-U10-2-001',title:'A School Bell That Rang during a Test',rows:[
['During a math test, the school bell rang ten minutes earlier than usual.','数学のテスト中、学校のベルがいつもより十分早く鳴りました。'],
['Several students put down their pencils because they thought the test had ended.','何人かの生徒はテストが終わったと思い、鉛筆を置きました。'],
['The teacher immediately said, “Please keep working; I will tell you when time is up.”','先生はすぐに「続けてください。時間になったら私が知らせます」と言いました。'],
['A clock on the wall showed that twelve minutes still remained.','壁の時計を見ると、まだ十二分残っていました。'],
['The bell had rung for a fire-system check, not for the end of the class period.','そのベルは授業終了ではなく、火災設備の点検のために鳴ったものでした。'],
['The students followed the teacher’s instruction and continued the test.','生徒たちは先生の指示に従い、テストを続けました。'],
['When the correct time arrived, the teacher clearly announced the end.','正しい時刻になると、先生がはっきり終了を知らせました。'],
['Afterward, a notice about the special bell test was placed near each classroom clock.','その後、特別なベル点検についての案内が各教室の時計の近くに置かれました。'],
['The students learned that an unusual signal may need an explanation before they act on it.','生徒たちは、普段と違う合図では行動する前に説明を確かめる必要があると学びました。']
]});
add({id:'V11-B10-G1-009',textbook:SS,section:'PROGRAM 10-2',sourceSectionBaselineId:'V10-SS-G1-P10-2-001',title:'The Picnic List with One Extra Guest',rows:[
['Aya’s group planned a picnic for five students and wrote a food list.','彩のグループは五人でピクニックをする予定で、食べ物の一覧を作りました。'],
['On Friday, their teacher said a new student would join them on Saturday.','金曜日、先生は土曜日に新しい生徒が一人加わると伝えました。'],
['The list had five sandwiches, five juice boxes, and six paper cups.','一覧にはサンドイッチ五つ、ジュース五本、紙コップ六個とありました。'],
['Aya counted the people again and changed the number beside sandwiches and juice.','彩は人数をもう一度数え、サンドイッチとジュースの数を変えました。'],
['She did not add more cups because there were already enough for six people.','紙コップはすでに六人分あるため増やしませんでした。'],
['The group also asked the new student whether there was any food he could not eat.','グループは新しい生徒に食べられない物がないかも尋ねました。'],
['He said the planned food was fine, so they bought only the two missing items.','予定の食べ物で大丈夫だと分かり、足りない二種類だけを買いました。'],
['Everyone had enough food at the picnic, and nothing extra was thrown away.','ピクニックでは全員に食べ物が行き渡り、余分な物を捨てることもありませんでした。'],
['Aya learned to update only the parts of a plan that a new condition actually changes.','彩は、新しい条件で本当に変わる部分だけを予定の中で直すと学びました。']
]});
add({id:'V11-B10-G1-010',textbook:NH,section:'Unit 10-2',sourceSectionBaselineId:'V10-NH-G1-U10-2-001',title:'A Bike Light Found after Sunset',rows:[
['Tomo stayed late at the library and left after the sun had gone down.','友は図書館に遅くまで残り、日が沈んでから帰ろうとしました。'],
['When he reached his bicycle, he remembered that its front light had stopped working that morning.','自転車の所で、前のライトがその朝から点かないことを思い出しました。'],
['A small spare light was in the bottom of his school bag.','学校のかばんの底に小さな予備ライトが入っていました。'],
['Tomo checked its switch and battery before putting it on the handlebar.','友はハンドルに付ける前に、スイッチと電池を確認しました。'],
['He did not start riding just because the street had several bright lamps.','道路に明るい街灯がいくつかあるだけで走り出すことはしませんでした。'],
['The spare light worked, so he fixed it firmly and tested it again.','予備ライトは点いたので、しっかり取り付けてもう一度確かめました。'],
['He rode home slowly and could see the road while other people could also see him.','友はゆっくり帰り、自分が道路を見られるだけでなく他の人からも見える状態でした。'],
['The next morning, he asked a shop to repair the main light.','翌朝、店で元のライトを直してもらいました。'],
['Tomo learned that a safety problem should be solved before starting a trip, not after it begins.','友は、安全上の問題は出発後ではなく出発前に解決すべきだと学びました。']
]});
add({id:'V11-B10-G1-011',textbook:SS,section:'PROGRAM 10-2',sourceSectionBaselineId:'V10-SS-G1-P10-2-001',title:'The Classroom Clock Five Minutes Fast',rows:[
['During lunch, Mei noticed that the classroom clock showed twelve fifty-five.','昼休み、芽衣は教室の時計が十二時五十五分を示していることに気づきました。'],
['Her watch showed twelve fifty, and the next class began at one o’clock.','自分の腕時計は十二時五十分で、次の授業は一時からでした。'],
['Two friends also checked their phones, and both showed twelve fifty.','友達二人も携帯の時刻を確認すると、どちらも十二時五十分でした。'],
['Mei realized that the classroom clock was about five minutes fast.','芽衣は教室の時計が約五分進んでいると分かりました。'],
['She did not change the hands herself because the clock belonged to the school.','その時計は学校の物なので、自分で針を動かしませんでした。'],
['She told the teacher and wrote a small temporary note beside the clock.','先生に伝え、時計のそばに一時的な注意書きを置きました。'],
['The teacher checked the office clock and corrected the classroom clock before class.','先生は職員室の時計を確認し、授業前に教室の時計を直しました。'],
['Students then used the corrected time for the afternoon schedule.','生徒はその後、直された時刻を午後の予定に使いました。'],
['Mei learned to compare independent clocks before deciding that one display is wrong.','芽衣は、一つの表示が間違っていると決める前に別の時計とも比べると学びました。']
]});
add({id:'V11-B10-G1-012',textbook:NH,section:'Unit 10-2',sourceSectionBaselineId:'V10-NH-G1-U10-2-001',title:'A Pair Work Sheet with One Missing Page',rows:[
['In English class, Daichi and Emma received different pages for a pair activity.','英語の授業で、大地とエマはペア活動用の別々のページを受け取りました。'],
['Daichi’s sheet had questions one to five, but Emma’s sheet began with question six.','大地の用紙には一番から五番までありましたが、エマの用紙は六番から始まっていました。'],
['They expected two matching pages, so they checked the page numbers at the bottom.','二人は対応する二枚だと思っていたので、下にあるページ番号を確認しました。'],
['Both sheets were marked “B,” which showed that the “A” page was missing.','どちらも「B」とあり、「A」のページがないと分かりました。'],
['They did not copy answers from another pair because they still needed the correct questions.','正しい問題そのものが必要なので、別のペアの答えを写すことはしませんでした。'],
['Emma told the teacher exactly which page number they needed.','エマは必要なページ番号を先生に正確に伝えました。'],
['The teacher gave them one “A” sheet, and they shared it between them.','先生は「A」の用紙を一枚渡し、二人はそれを共有しました。'],
['They finished the activity and returned the extra “B” sheet for later use.','二人は活動を終え、余った「B」の用紙を後で使えるよう返しました。'],
['They learned that identifying the missing part is more useful than simply saying something is wrong.','二人は、ただ「おかしい」と言うより不足している部分を特定する方が役立つと学びました。']
]});
add({id:'V11-B10-G1-013',textbook:SS,section:'PROGRAM 10-2',sourceSectionBaselineId:'V10-SS-G1-P10-2-001',title:'The School Cat Seen near Two Buildings',rows:[
['Students were looking for a school cat that often slept near the library.','生徒たちは図書館の近くでよく眠る学校の猫を探していました。'],
['At noon, Kumi saw an orange tail disappear behind the music building.','正午、久美は音楽棟の後ろへ消えるオレンジ色のしっぽを見ました。'],
['Ten minutes later, Haru saw an orange cat near the gym.','十分後、陽は体育館の近くでオレンジ色の猫を見ました。'],
['The two buildings were close, so both reports could describe the same cat.','二つの建物は近いので、どちらの目撃も同じ猫の可能性がありました。'],
['Kumi did not say the cat must still be behind the music building.','久美は猫が今も必ず音楽棟の後ろにいるとは言いませんでした。'],
['The students quietly checked the path between the two places.','生徒たちは二つの場所の間の道を静かに確認しました。'],
['They found fresh paw marks leading toward the warm steps beside the gym.','体育館横の暖かい階段へ続く新しい足跡を見つけました。'],
['The cat was resting there, and the students left water nearby without surrounding it.','猫はそこで休んでおり、生徒たちは囲まず近くに水を置きました。'],
['They learned that a sighting tells where an animal was, not exactly where it is later.','生徒たちは、目撃情報はその時いた場所を示すのであって後の居場所を断定するものではないと学びました。']
]});
add({id:'V11-B10-G1-014',textbook:NH,section:'Unit 10-2',sourceSectionBaselineId:'V10-NH-G1-U10-2-001',title:'A Birthday Card Signed after the Party',rows:[
['Rina found a birthday card in her desk on Monday morning.','里奈は月曜日の朝、机の中に誕生日カードを見つけました。'],
['The class party had been on Friday, but one message on the card was dated Saturday.','クラスの誕生日会は金曜日でしたが、カードの一つの言葉には土曜日の日付がありました。'],
['Rina first wondered whether she had remembered the party date incorrectly.','里奈は最初、自分が誕生日会の日を間違えて覚えていたのかと思いました。'],
['Then Yuta explained that he had been absent Friday and signed the card the next day.','すると悠太が、金曜日は欠席し翌日にカードへ書いたと説明しました。'],
['The Saturday date showed when his message was written, not when the party happened.','土曜日の日付は、誕生日会の日ではなく悠太が言葉を書いた日を示していました。'],
['Rina checked the other messages and saw that most were dated Friday.','里奈がほかの言葉を見ると、大部分は金曜日の日付でした。'],
['She thanked Yuta for adding his message even after the party.','里奈は誕生日会の後でも言葉を加えてくれた悠太にお礼を言いました。'],
['The class wrote “party: Friday” inside the cover so the two kinds of dates were clear.','クラスは二種類の日付が分かるよう表紙の内側に「誕生日会：金曜日」と書きました。'],
['Rina learned that a written date can describe the writing itself rather than the event being discussed.','里奈は、書かれた日付が話題の出来事ではなく書いた行為の日を表す場合があると学びました。']
]});
add({id:'V11-B10-G1-015',textbook:SS,section:'PROGRAM 10-2',sourceSectionBaselineId:'V10-SS-G1-P10-2-001',title:'The Playground Ball with a Small Mark',rows:[
['After recess, Jun found a yellow ball beside the playground fence.','休み時間の後、純は運動場の柵のそばに黄色いボールを見つけました。'],
['Two classes used yellow balls, so color alone did not show who owned it.','二つのクラスが黄色いボールを使っていたので、色だけでは持ち主が分かりませんでした。'],
['Jun noticed a small black triangle drawn near the air valve.','純は空気を入れる部分の近くに小さな黒い三角が描かれているのを見つけました。'],
['His class equipment list said its balls had blue circles, not black triangles.','自分のクラスの備品表には、ボールには黒い三角ではなく青い丸があると書かれていました。'],
['He did not put the ball into his class basket just because it was nearby.','近くにあったというだけで、自分のクラスのかごへ入れませんでした。'],
['He asked the next class, and their teacher recognized the black triangle.','次のクラスに尋ねると、その先生が黒い三角を見て自分たちの物だと分かりました。'],
['Jun returned the ball and showed where he had found it.','純はボールを返し、どこで見つけたかも伝えました。'],
['Both classes then checked that their equipment marks were still easy to see.','二つのクラスは備品の印が今も見やすいか確認しました。'],
['Jun learned that a specific mark is stronger ownership evidence than color or location alone.','純は、具体的な印は色や場所だけより持ち主を判断する強い根拠になると学びました。']
]});
add({id:'V11-B10-G1-016',textbook:NH,section:'Unit 10-2',sourceSectionBaselineId:'V10-NH-G1-U10-2-001',title:'A Cleaning Job Changed after an Absence',rows:[
['Four students were assigned to clean the classroom after school.','四人の生徒が放課後の教室掃除を担当する予定でした。'],
['That morning, one student, Kaito, went home sick.','その朝、一人の生徒である海斗が体調を崩して帰宅しました。'],
['The old cleaning chart still listed Kaito for carrying trash outside.','古い掃除当番表では、海斗がごみを外へ運ぶ担当のままでした。'],
['Before cleaning began, Aoi told the other students that the job was now uncovered.','掃除が始まる前、葵はその仕事の担当者がいないとほかの生徒に伝えました。'],
['They did not leave the trash for Kaito because he was no longer at school.','海斗はもう学校にいないため、彼のためにごみを残しておくことはしませんでした。'],
['Aoi finished wiping the desks early and volunteered to carry the trash.','葵は机拭きを早く終え、ごみ運びを引き受けました。'],
['Another student checked the floor while she was outside.','葵が外にいる間、別の生徒が床の確認をしました。'],
['They wrote the change on the chart so the teacher knew how the work had been shared.','仕事をどう分担したか先生に分かるよう、当番表に変更を書きました。'],
['The group learned that a plan should show who can actually do each job that day.','グループは、その日の予定には実際に各仕事をできる人を示す必要があると学びました。']
]});
add({id:'V11-B10-G1-017',textbook:SS,section:'PROGRAM 10-2',sourceSectionBaselineId:'V10-SS-G1-P10-2-001',title:'The English Club Song List in a New Order',rows:[
['The English club chose three songs for a small school concert.','英語部は学校の小さな発表会で歌う三曲を選びました。'],
['Their first list put the fastest song at the end.','最初の一覧では最も速い曲を最後にしていました。'],
['During practice, the club noticed that the final song needed the most breath and energy.','練習すると、最後の曲が最も息と体力を使うと分かりました。'],
['Two members found it difficult to sing that song clearly after the other two.','二人の部員は、ほかの二曲の後ではその曲をはっきり歌うのが難しいと感じました。'],
['The club did not remove the song because everyone still liked it and could sing it well when fresh.','全員がその曲を好きで、元気なときは上手に歌えるため曲自体は外しませんでした。'],
['They tried the fast song first and placed a calm song last.','速い曲を最初にし、落ち着いた曲を最後にして試しました。'],
['The new order sounded clearer from beginning to end.','新しい順番では最初から最後までよりはっきり歌えました。'],
['They wrote numbers beside the titles and used the same order at the next practice.','曲名の横に番号を書き、次の練習でも同じ順番を使いました。'],
['The club learned that changing an order can solve a problem without changing the chosen parts.','英語部は、選んだ内容を変えなくても順番を変えることで問題を解決できると学びました。']
]});
window.V11_BATCH10_G1_DRAFTS=passages;
window.V11_BATCH10_G1_DRAFT_STATE={count:passages.length,registered:false,version:'20260829-author-r1'};
})();
