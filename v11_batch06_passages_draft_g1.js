(function buildV11Batch06Grade1Draft(){
'use strict';
const BATCH='V11-B06-G1-DRAFT-20260829';
function slash(en){return en.replace(/, /g,', / ').replace(/\b(and|but|because|so|before|after|until|then|when|while)\b/gi,'/ $1');}
function wc(rows){return (rows.map(r=>r[0]).join(' ').match(/[A-Za-z]+(?:['’][A-Za-z]+)?/g)||[]).length;}
function build(id,textbook,section,baseline,title,rows,notes){const qs=rows.slice(0,10).map((r,i)=>({prompt:`${i+1}. 本文の第${i+1}文の内容に合う英文を本文から一文答えなさい。`,answer:r[0],evidence:r[0],evidenceJp:r[1],reason:`第${i+1}文が直接の根拠です。`}));return {id,textbook,grade:'1',section,level:'STEP',title,genre:'story',batch:BATCH,sourceSectionBaselineId:baseline,targetWordBand:[90,125],wordCount:wc(rows),sentences:rows.map(r=>r[0]),fullTranslation:rows.map(r=>r[1]).join(''),slashRows:rows.map(r=>({en:slash(r[0]),jp:r[1]})),questions:qs.slice(0,5),questionSetB:qs.slice(5,10),notes:(notes||[]).map(n=>({english:n[0],japanese:n[1],kind:'unlearned_local_required',source:'v11 Batch06 G1 story-specific required note seed'})),semanticRewrite:'BATCH06_G1_STORY_SPECIFIC_20260829',registered:false,auditNote:'Batch06 G1 non-runtime draft; all chronology and final gates still required.'};}
const SS='サンシャイン',NH='ニューホライズン',ssBase='V10-SS-G1-P10-2-001',nhBase='V10-NH-G1-U10-2-001';
const all=[
build('V11-B06-G1-001',SS,'PROGRAM 10-2',ssBase,'The Lost Library Card',[
['After school, Emi went to the library to return two books.','放課後、エミは二冊の本を返すために図書館へ行きました。'],
['At the desk, she noticed that her library card was not in her bag.','受付で、彼女は図書カードがかばんにないことに気づきました。'],
['She first checked the table where she had studied with a friend.','彼女はまず友達と勉強した机を確認しました。'],
['Then she looked near the water machine and the front door.','次に給水機の近くと入口を見ました。'],
['The card was not there, so she walked back to the return desk.','カードはそこになかったので、返却受付へ戻りました。'],
['One of her books was still beside the box for returned books.','返した本の一冊が返却箱のそばにまだありました。'],
['Her card was under that book, with her name facing up.','カードはその本の下にあり、名前の面が上になっていました。'],
['Emi smiled because checking her steps helped her find it quickly.','エミは自分の行動をたどることで早く見つけられたので笑顔になりました。'],
['She put the card in a small pocket before leaving the library.','図書館を出る前に、彼女はカードを小さなポケットに入れました。']
],[['library card','図書カード'],['return desk','返却受付']]),
build('V11-B06-G1-002',NH,'Unit 10-2',nhBase,'A Warm Drink for the Guard',[
['Our school had an evening event on a very cold Friday.','私たちの学校では、とても寒い金曜日の夕方に行事がありました。'],
['Mr. Sato was standing outside the gate to welcome families.','佐藤さんは家族を迎えるために門の外に立っていました。'],
['My friends and I saw that his hands were getting cold.','友達と私は彼の手が冷たくなっているのに気づきました。'],
['We asked a teacher if someone could take his place for a few minutes.','私たちは先生に、数分間だれかが代われるかたずねました。'],
['Two older students agreed to stand at the gate together.','二人の上級生が一緒に門に立つことになりました。'],
['I went inside and brought Mr. Sato a cup of warm tea.','私は中へ行き、佐藤さんに温かいお茶を一杯持ってきました。'],
['He drank it in the hall while the students watched the gate.','生徒たちが門を見ている間、彼は廊下でそれを飲みました。'],
['After a short rest, he returned and thanked everyone for helping.','短い休憩のあと彼は戻り、助けてくれたみんなにお礼を言いました。'],
['Taking turns kept the event running and gave him time to get warm.','交代することで行事を続けながら、彼が体を温める時間も作れました。']
],[['take his place','彼の代わりをする'],['take turns','交代する']]),
build('V11-B06-G1-003',SS,'PROGRAM 10-2',ssBase,'The Quiet Seat on the Bus',[
['I usually sit by the window on the bus after school.','私は放課後のバスでいつも窓側に座ります。'],
['One day, an older woman got on with a large shopping bag.','ある日、大きな買い物袋を持った年配の女性が乗ってきました。'],
['There were no empty seats near the front of the bus.','バスの前の方には空いている席がありませんでした。'],
['I stood up and told her that she could use my seat.','私は立ち上がり、その席を使ってよいと彼女に言いました。'],
['She sat down carefully and put the heavy bag by her feet.','彼女は注意して座り、重い袋を足元に置きました。'],
['At the next stop, the bus turned sharply around a corner.','次の停留所で、バスは角を急に曲がりました。'],
['The woman held the seat and kept the bag safely beside her.','女性は座席につかまり、袋を安全にそばへ置いていました。'],
['She thanked me again before she got off two stops later.','二つ先の停留所で降りる前に、彼女はもう一度私にお礼を言いました。'],
['I understood that the quiet seat had helped more than I first knew.','その席は自分が最初に思った以上に役立ったのだと分かりました。']
],[['shopping bag','買い物袋'],['sharply','急に']]),
build('V11-B06-G1-004',NH,'Unit 10-2',nhBase,'Three Photos of the Same Tree',[
['Our science group chose one tree near the school gate.','私たちの理科グループは校門近くの一本の木を選びました。'],
['We wanted to see how its look changed during one day.','私たちは一日の中でその見え方がどう変わるか知りたいと思いました。'],
['Mika took the first photo before classes started in the morning.','ミカは朝、授業が始まる前に最初の写真を撮りました。'],
['At noon, I took another photo from the same place.','昼に、私は同じ場所から二枚目の写真を撮りました。'],
['The last photo was taken after school when the sun was low.','最後の写真は放課後、太陽が低いときに撮られました。'],
['The morning picture had a long shadow on one side.','朝の写真には片側に長い影がありました。'],
['At noon, the shadow was much shorter under the tree.','昼には、影は木の下でずっと短くなっていました。'],
['In the last picture, the long shadow pointed the other way.','最後の写真では、長い影が反対の方向を向いていました。'],
['Three simple photos showed us a change that we usually did not notice.','三枚の写真が、普段は気づかない変化を私たちに見せてくれました。']
],[['shadow','影'],['at noon','正午に']]),
build('V11-B06-G1-005',SS,'PROGRAM 10-2',ssBase,'The Wrong Lunch Bag',[
['Ken and I brought lunch bags with the same red pattern.','ケンと私は同じ赤い模様の昼食バッグを持ってきました。'],
['Before lunch, we left both bags on a shelf in our classroom.','昼食前、私たちは二つのバッグを教室の棚に置きました。'],
['I picked up the bag on the left and opened it at my desk.','私は左のバッグを取り、机で開けました。'],
['Inside, I saw an orange, but my lunch had a banana.','中にはオレンジがありましたが、私の昼食にはバナナが入っていました。'],
['I called Ken before taking any food from the bag.','私は食べ物を取る前にケンを呼びました。'],
['He checked the other bag and found my name on a small paper inside.','彼はもう一方を確認し、中の小さな紙に私の名前を見つけました。'],
['We laughed and exchanged the bags without blaming each other.','私たちは笑い、お互いを責めることなくバッグを交換しました。'],
['After lunch, we tied different ribbons to the two handles.','昼食後、二つの持ち手に違う色のリボンを結びました。'],
['The next day, we could tell our lunch bags apart at once.','次の日、私たちはすぐに自分の昼食バッグを見分けられました。']
],[['pattern','模様'],['tell apart','見分ける']]),
build('V11-B06-G1-006',NH,'Unit 10-2',nhBase,'A Note Under the Umbrella',[
['It started raining while our class was in the gym.','私たちのクラスが体育館にいる間に雨が降り始めました。'],
['My umbrella had been near an open window in the classroom.','私の傘は教室の開いた窓の近くに置いてありました。'],
['When I came back, the umbrella was not in that place.','戻ると、傘はその場所にありませんでした。'],
['I saw a small note on the floor under the window.','窓の下の床に小さなメモがあるのを見つけました。'],
['It said, “I moved your umbrella beside the teacher’s desk.”','そこには「あなたの傘を先生の机のそばに移しました」と書いてありました。'],
['I looked there and found the umbrella dry and safe.','そこを見ると、傘は乾いたまま安全に置かれていました。'],
['Aya told me that rain was coming through the window.','アヤは窓から雨が入ってきていたと教えてくれました。'],
['She had moved the umbrella and left the note before gym class ended.','彼女は体育の授業が終わる前に傘を移し、メモを残してくれていました。'],
['Her short message saved me from looking all around the room.','彼女の短いメッセージのおかげで、教室中を探さずにすみました。']
],[['come through','入ってくる'],['all around','あちこちを']]),
build('V11-B06-G1-007',SS,'PROGRAM 10-2',ssBase,'The Last Practice Ticket',[
['Our tennis club had one practice ticket left for Saturday.','私たちのテニス部には土曜日の練習券が一枚だけ残っていました。'],
['Three members wanted to use the court at the same time.','三人の部員が同じ時間にコートを使いたがっていました。'],
['At first, we thought about choosing a name at random.','最初は、名前を無作為に選ぶことを考えました。'],
['Then our captain asked each person why the practice was important.','そこで部長が、それぞれに練習が必要な理由をたずねました。'],
['One member had a match on Sunday and needed extra practice.','一人は日曜日に試合があり、追加の練習が必要でした。'],
['The other two had no match that weekend and could practice later.','ほかの二人はその週末に試合がなく、あとで練習できました。'],
['They agreed to give the last ticket to the member with the match.','二人は最後の券を試合のある部員に渡すことに賛成しました。'],
['The captain wrote their names first on next week’s practice list.','部長は来週の練習表ではその二人の名前を最初に書きました。'],
['Hearing every reason helped us make a choice that felt fair.','全員の理由を聞くことで、納得できる公平な選択ができました。']
],[['practice ticket','練習券'],['at random','無作為に'],['fair','公平な']]),
build('V11-B06-G1-008',NH,'Unit 10-2',nhBase,'A Map for the New Student',[
['A new student named Leo joined our class on Monday.','レオという新しい生徒が月曜日に私たちのクラスに入りました。'],
['He did not know the way from our classroom to the music room.','彼は教室から音楽室までの道を知りませんでした。'],
['I drew a simple map with the stairs and two hallways.','私は階段と二つの廊下を入れた簡単な地図を描きました。'],
['After school, Leo and I walked the route together.','放課後、レオと私はその道を一緒に歩きました。'],
['At one corner, he stopped because two doors looked the same.','ある角で、二つのドアが同じように見えたので彼は立ち止まりました。'],
['My map did not show the big clock beside the correct door.','私の地図には正しいドアの横の大きな時計が書かれていませんでした。'],
['I added the clock and a small arrow to the map.','私は地図にその時計と小さな矢印を加えました。'],
['The next day, Leo reached the music room without asking anyone.','次の日、レオはだれにもたずねずに音楽室へ行けました。'],
['Walking the real route showed me what the first map was missing.','実際の道を歩くことで、最初の地図に足りなかったものが分かりました。']
],[['hallway','廊下'],['route','道順'],['arrow','矢印']]),
build('V11-B06-G1-009',SS,'PROGRAM 10-2',ssBase,'The Bell That Did Not Ring',[
['A short bell usually tells our class when morning study ends.','短いベルがいつも朝学習の終わりを私たちのクラスに知らせます。'],
['On Thursday, we waited, but the bell did not ring.','木曜日、私たちは待ちましたがベルは鳴りませんでした。'],
['Some students thought we still had several minutes left.','何人かの生徒はまだ数分あると思っていました。'],
['I looked at the clock and saw that first period would start soon.','私は時計を見て、一時間目がすぐ始まると分かりました。'],
['Our class leader checked the daily schedule on the wall.','学級委員は壁の一日の予定表を確認しました。'],
['The time showed that morning study was already over.','時刻を見ると、朝学習はすでに終わっていました。'],
['We closed our books and prepared for the first class.','私たちは本を閉じ、一時間目の準備をしました。'],
['A teacher later said that the bell system had a small problem.','あとで先生がベルの設備に小さな問題があったと言いました。'],
['The clock and schedule helped us continue the day on time.','時計と予定表のおかげで、私たちは時間どおりに一日を続けられました。']
],[['first period','一時間目'],['daily schedule','一日の予定表']]),
build('V11-B06-G1-010',NH,'Unit 10-2',nhBase,'One More Chair',[
['Our group prepared five chairs for a small English activity.','私たちのグループは小さな英語活動のために椅子を五脚用意しました。'],
['Just before we started, a student from another class joined us.','始める直前に、別のクラスの生徒が一人加わりました。'],
['There was no empty chair inside our small circle.','小さな輪の中に空いた椅子はありませんでした。'],
['Moving only one chair made the circle too narrow.','椅子を一脚だけ動かすと輪が狭すぎました。'],
['We moved all five chairs a little farther from the table.','私たちは五脚全部を机から少し遠くへ動かしました。'],
['Then I brought one more chair from the back of the room.','それから私は教室の後ろからもう一脚持ってきました。'],
['The six chairs made a wider circle with enough space.','六脚の椅子で、十分な広さの輪ができました。'],
['Everyone could see the cards in the middle of the table.','みんなが机の中央のカードを見ることができました。'],
['Changing the whole plan a little worked better than adding one chair alone.','一脚だけ加えるより、全体を少し変えるほうがうまくいきました。']
],[['circle','輪'],['narrow','狭い']]),
build('V11-B06-G1-011',SS,'PROGRAM 10-2',ssBase,'The Blue Ribbon on the Fence',[
['Our class walked to a nearby park for an outdoor lesson.','私たちのクラスは校外学習で近くの公園まで歩きました。'],
['We were told to meet beside a long fence after lunch.','昼食後、長い柵のそばで集合するよう言われました。'],
['The fence looked the same from one end to the other.','その柵は端から端まで同じように見えました。'],
['Two friends walked to the wrong end and could not see us.','二人の友達が反対側の端へ行き、私たちが見えなくなりました。'],
['Our teacher had a bright blue ribbon in her bag.','先生はかばんに鮮やかな青いリボンを持っていました。'],
['She tied it to the fence beside our meeting place.','先生は集合場所のそばの柵にそれを結びました。'],
['I called the two friends and told them to look for the ribbon.','私は二人に電話し、そのリボンを探すよう伝えました。'],
['They found the blue mark and joined the class a few minutes later.','二人は青い印を見つけ、数分後にクラスへ合流しました。'],
['One clear color made a long fence into an easy meeting point.','一つの目立つ色が、長い柵を分かりやすい集合場所に変えました。']
],[['fence','柵'],['ribbon','リボン'],['meeting point','集合場所']]),
build('V11-B06-G1-012',NH,'Unit 10-2',nhBase,'A Pencil with Two Names',[
['Yuta borrowed my pencil during math class on Tuesday.','ユウタは火曜日の数学の授業で私の鉛筆を借りました。'],
['He wrote his name on a small piece of tape around it.','彼は鉛筆に巻いた小さなテープに自分の名前を書きました。'],
['He planned to remember that he should return it after class.','授業後に返すことを忘れないためでした。'],
['The next morning, I found the pencil under my desk.','次の朝、私は机の下でその鉛筆を見つけました。'],
['My name was near the top, and Yuta’s name was on the tape.','上の方には私の名前があり、テープにはユウタの名前がありました。'],
['For a moment, another student thought the pencil belonged to Yuta.','少しの間、別の生徒はその鉛筆がユウタのものだと思いました。'],
['Yuta remembered borrowing it and explained the two names.','ユウタは借りたことを思い出し、二つの名前について説明しました。'],
['He removed the tape and gave the pencil back to me.','彼はテープを外し、鉛筆を私に返しました。'],
['Remembering when the names were added solved the small mystery.','いつ名前が付けられたかを思い出すことで、小さな謎が解けました。']
],[['tape','テープ'],['belong to','～のものである'],['mystery','謎']]),
build('V11-B06-G1-013',SS,'PROGRAM 10-2',ssBase,'The Window Garden List',[
['Our class grows four small plants by the sunny window.','私たちのクラスは日当たりのよい窓辺で四つの小さな植物を育てています。'],
['We made a list of jobs for watering and checking the soil.','水やりと土の確認の仕事表を作りました。'],
['Each pair of students had one simple job every two days.','生徒二人ずつが二日ごとに一つの簡単な仕事を担当しました。'],
['After a week, one plant began to look dry in the afternoon.','一週間後、一つの植物が午後になると乾いて見え始めました。'],
['It was closer to the warm window than the other plants.','それはほかの植物より暖かい窓に近い場所にありました。'],
['We decided to check that plant every day instead of every two days.','私たちはその植物だけ二日ごとではなく毎日確認することにしました。'],
['We added a small star beside its name on the job list.','仕事表のその名前の横に小さな星印を付けました。'],
['The extra check helped us give water before the soil became too dry.','追加の確認で、土が乾きすぎる前に水をあげられました。'],
['Changing one part of the list gave the plant the care it needed.','表の一部を変えることで、その植物に必要な世話ができました。']
],[['soil','土'],['instead of','～の代わりに']]),
build('V11-B06-G1-014',NH,'Unit 10-2',nhBase,'The Early Train Plan',[
['Our class trip train was going to leave very early on Saturday.','私たちの校外学習の電車は土曜日のとても早い時間に出る予定でした。'],
['Four friends planned to meet at the station before seven.','四人の友達は七時前に駅で会う計画を立てました。'],
['One friend usually needed a long time to get ready.','一人はいつも準備に長い時間がかかりました。'],
['We wrote a simple morning plan together on Friday.','私たちは金曜日に一緒に簡単な朝の計画を書きました。'],
['He put his bag by the door and prepared breakfast that night.','彼はその夜、かばんをドアのそばに置き、朝食の準備をしました。'],
['I set two alarms, and another friend checked the bus time.','私は目覚ましを二つセットし、別の友達はバスの時刻を確認しました。'],
['We sent one message after waking up in the morning.','朝起きたあと、私たちは一度メッセージを送りました。'],
['All four of us reached the station ten minutes before the train.','四人全員が電車の十分前に駅へ着きました。'],
['A little planning the night before made the early morning much easier.','前の晩の少しの計画で、早い朝がずっと楽になりました。']
],[['alarm','目覚まし'],['get ready','準備をする']]),
build('V11-B06-G1-015',SS,'PROGRAM 10-2',ssBase,'A Message on the Whiteboard',[
['A message on our whiteboard said, “Bring a towel tomorrow.”','教室のホワイトボードに「明日タオルを持ってきて」と書かれていました。'],
['Some students thought it was for our morning sports class.','何人かの生徒は朝の体育の授業のためだと思いました。'],
['Others thought the science club needed towels after school.','ほかの生徒は放課後の科学部で必要だと思いました。'],
['The message did not say who should bring one or why.','そのメッセージには、だれが何のために持ってくるか書かれていませんでした。'],
['Our class leader checked the teacher’s note beside the calendar.','学級委員はカレンダーの横の先生のメモを確認しました。'],
['It said that only the science club needed old towels.','そこには科学部だけが古いタオルを必要としていると書いてありました。'],
['We asked the teacher before sending a message to everyone.','全員に知らせる前に、私たちは先生に確認しました。'],
['Then the club members wrote their names under the whiteboard message.','それから部員がホワイトボードのメッセージの下に名前を書きました。'],
['Checking the facts stopped one short message from confusing the whole class.','事実を確認したことで、短いメッセージがクラス全体を混乱させずにすみました。']
],[['whiteboard','ホワイトボード'],['calendar','カレンダー']]),
build('V11-B06-G1-016',NH,'Unit 10-2',nhBase,'The Small Box at the Door',[
['A small brown box was beside our classroom door after lunch.','昼食後、教室のドアのそばに小さな茶色い箱がありました。'],
['Nobody in our class remembered putting it there.','クラスのだれもそこに置いた覚えがありませんでした。'],
['A paper on the top had the name “Mr. Mori” and the time two o’clock.','上の紙には「森先生」という名前と二時という時刻が書かれていました。'],
['Our teacher remembered promising to return some art tools that afternoon.','先生はその午後に美術の道具を返す約束をしていたことを思い出しました。'],
['The tools belonged to Mr. Mori in the art room.','その道具は美術室の森先生のものでした。'],
['We opened the box with our teacher and saw brushes inside.','私たちは先生と一緒に箱を開け、中に筆があるのを見ました。'],
['The name, the time, and the promise all matched.','名前と時刻と約束がすべて一致しました。'],
['Our teacher carried the box to the art room before two.','先生は二時前にその箱を美術室へ運びました。'],
['Three small clues told us why the box had been left by the door.','三つの小さな手がかりで、なぜ箱がドアのそばにあったのか分かりました。']
],[['art tools','美術の道具'],['brush','筆'],['clue','手がかり']]),
build('V11-B06-G1-017',SS,'PROGRAM 10-2',ssBase,'The Rainy-Day Team',[
['Our class planned a small game event outside on Friday.','私たちのクラスは金曜日に外で小さなゲーム行事を予定していました。'],
['In the morning, dark clouds came and rain started before lunch.','朝、黒い雲が出て昼食前に雨が降り始めました。'],
['The field became too wet for our three outdoor games.','校庭はぬれて、三つの屋外ゲームができなくなりました。'],
['We did not want to cancel the whole event.','私たちは行事全体を中止したくありませんでした。'],
['One team moved chairs in the gym while another carried the game cards inside.','一つの班が体育館の椅子を動かし、別の班がゲームカードを中へ運びました。'],
['A third team changed the signs at the school entrance.','三つ目の班は学校入口の案内表示を変えました。'],
['We replaced the running game with a quiet team quiz.','走るゲームの代わりに静かなチームクイズを行いました。'],
['Families came to the gym and enjoyed all three indoor activities.','家族は体育館に来て、三つの屋内活動を楽しみました。'],
['Changing our jobs quickly helped the rainy-day event finish well.','仕事をすぐに組み替えたことで、雨の日の行事をうまく終えられました。']
],[['cancel','中止する'],['replace A with B','AをBに替える']])
];
window.V11_BATCH06_G1_PASSAGES=all;
window.V11_BATCH06_PASSAGES=[...(window.V11_BATCH06_PASSAGES||[]),...all];
})();