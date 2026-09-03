(function buildV11Batch03Grade1Draft(){
'use strict';
const BATCH='V11-B03-G1-DRAFT-20260828';
function slash(en){return en.replace(/, /g,', / ').replace(/\b(and|but|because|so|before|after|until|then|when)\b/gi,'/ $1');}
function wc(rows){return (rows.map(r=>r[0]).join(' ').match(/[A-Za-z]+(?:['’][A-Za-z]+)?/g)||[]).length;}
function build(id,textbook,section,baseline,title,rows,long,notes){
 const qs=rows.slice(0,10).map((r,i)=>({prompt:`${i+1}. 本文の第${i+1}文の内容に合う英文を本文から一文答えなさい。`,answer:r[0],evidence:r[0],evidenceJp:r[1],reason:`第${i+1}文が直接の根拠です。`}));
 return {id,textbook,grade:'1',section,level:'HOP',title,genre:'story',batch:BATCH,sourceSectionBaselineId:baseline,targetWordBand:long?[135,165]:[90,125],wordCount:wc(rows),sentences:rows.map(r=>r[0]),fullTranslation:rows.map(r=>r[1]).join(''),slashRows:rows.map(r=>({en:slash(r[0]),jp:r[1]})),questions:qs.slice(0,5),questionSetB:qs.slice(5,10),notes:(notes||[]).map(n=>({english:n[0],japanese:n[1],kind:'unlearned_local_required',source:'v11 Batch03 G1 story-specific required note seed'})),semanticRewrite:'BATCH03_G1_STORY_SPECIFIC_20260828',registered:false,auditNote:'Batch03 G1 non-runtime authoring draft. Story-specific passage; chronology, length, question diversity, normal/easy notes, cross-batch, PC/iPhone and A4 gates still required.'};
}
const SS='サンシャイン',NH='ニューホライズン';
const ssBase='V10-SS-G1-P10-2-001',nhBase='V10-NH-G1-U10-2-001';
const all=[
build('V11-SS-G1-P10-2-018',SS,'PROGRAM 10-2',ssBase,'The Wrong Classroom',[
['I came to school early and opened a classroom door.','私は早く学校に来て、教室のドアを開けました。'],
['I put my bag by a desk and looked around.','私はかばんを机のそばに置き、周りを見ました。'],
['The pictures on the wall were different from the pictures in my room.','壁の絵は私の教室の絵と違っていました。'],
['I also saw names that I did not know.','知らない名前も見えました。'],
['Then one student came in and looked at me.','すると一人の生徒が入ってきて、私を見ました。'],
['I asked, "Is this our classroom?"','私は「ここは私たちの教室ですか」とたずねました。'],
['The student smiled and said, "No, your room is next to this one."','その生徒は笑って「いいえ、あなたの教室はこの隣です」と言いました。'],
['I took my bag and went to the next room.','私はかばんを持って隣の教室へ行きました。'],
['My friend was there and asked why I was laughing.','友達がそこにいて、なぜ笑っているのかたずねました。'],
['I told my friend about my small mistake before class started.','授業が始まる前に、私は小さな間違いについて友達に話しました。']
],false,[['classroom','教室'],['mistake','間違い']]),
build('V11-SS-G1-P10-2-019',SS,'PROGRAM 10-2',ssBase,'A Seat for a Friend',[
['Our school had a small event after lunch.','私たちの学校では昼食後に小さな行事がありました。'],
['Many students were already sitting in the room.','多くの生徒がすでに部屋に座っていました。'],
['My friend came late and could not find a seat.','友達は遅れて来て、席を見つけられませんでした。'],
['I looked near the wall and saw an empty chair.','壁の近くを見ると、空いているいすが見えました。'],
['The chair was behind a small table.','そのいすは小さな机の後ろにありました。'],
['I moved the table a little and took the chair out.','私は机を少し動かして、いすを出しました。'],
['My friend sat next to me and thanked me.','友達は私の隣に座り、お礼を言いました。'],
['We listened to the talk together.','私たちはいっしょに話を聞きました。'],
['After the event, we put the chair back by the wall.','行事のあと、私たちはいすを壁のそばに戻しました。'],
['Finding one empty seat made the event easier for both of us.','空いている席を一つ見つけたことで、私たち二人にとって行事が過ごしやすくなりました。']
],false,[['event','行事'],['empty','空いている']]),
build('V11-SS-G1-P10-2-020',SS,'PROGRAM 10-2',ssBase,'The Last Piece of Chalk',[
['Our group used the board for a class activity.','私たちの班は授業の活動で黒板を使いました。'],
['We needed chalk to write three short answers.','三つの短い答えを書くためにチョークが必要でした。'],
['There was only one small piece of chalk left.','小さなチョークが一つだけ残っていました。'],
['At first, everyone wanted to write at the same time.','最初、みんな同時に書きたがりました。'],
['Then we decided to use the chalk one by one.','それから一人ずつチョークを使うことにしました。'],
['I wrote the first answer and gave the chalk to my friend.','私は最初の答えを書き、チョークを友達に渡しました。'],
['Two other students wrote the next answers.','ほかの二人の生徒が次の答えを書きました。'],
['The chalk became very short, but it was still enough.','チョークはとても短くなりましたが、それでも足りました。'],
['We finished before our teacher checked the board.','先生が黒板を確認する前に、私たちは終えました。'],
['Sharing one piece helped our group finish the activity.','一つを分けて使うことで、班は活動を終えられました。']
],false,[['chalk','チョーク'],['activity','活動']]),
build('V11-SS-G1-P10-2-021',SS,'PROGRAM 10-2',ssBase,'A Quiet Morning Walk',[
['I left home earlier than usual one morning.','ある朝、私はいつもより早く家を出ました。'],
['The street near my house was very quiet.','家の近くの通りはとても静かでした。'],
['Only a few people were walking outside.','外を歩いている人は少ししかいませんでした。'],
['I did not hurry because I had enough time.','十分な時間があったので、私は急ぎませんでした。'],
['I walked past a small park and saw light on the trees.','小さな公園の前を通り、木々に光が当たっているのを見ました。'],
['The same park looked different in the early morning.','同じ公園でも早朝には違って見えました。'],
['Near the station, a store was just opening.','駅の近くでは店がちょうど開くところでした。'],
['A worker put a sign by the door and said good morning.','店の人がドアのそばに看板を置き、おはようと言いました。'],
['I said good morning and continued toward school.','私もおはようと言って、学校へ向かって歩き続けました。'],
['I heard birds near the school gate before I saw any students.','生徒を見る前に、校門の近くで鳥の声が聞こえました。'],
['When I reached my classroom, only one friend was there.','教室に着いたとき、友達は一人だけいました。'],
['We talked quietly while we prepared our books.','本を準備しながら、私たちは静かに話しました。'],
['Starting the day slowly made me feel calm.','一日をゆっくり始めたことで、私は落ち着いた気持ちになりました。'],
['After that morning, I sometimes chose to leave home a little early.','その朝のあと、ときどき少し早く家を出るようになりました。']
],true,[['street','通り'],['calm','落ち着いた']]),
build('V11-SS-G1-P10-2-022',SS,'PROGRAM 10-2',ssBase,'The Mixed-Up Shoes',[
['Two pairs of indoor shoes were beside the classroom door.','二足の上ばきが教室のドアのそばにありました。'],
['They looked almost the same.','それらはほとんど同じに見えました。'],
['My friend put on one pair and said they felt strange.','友達は一足をはき、変な感じがすると言いました。'],
['I checked the name inside one shoe.','私は片方の靴の中の名前を確認しました。'],
['The name was another student’s name.','その名前は別の生徒の名前でした。'],
['We checked the second pair and found my friend’s name.','二足目を確認すると、友達の名前が見つかりました。'],
['My friend changed shoes before class.','友達は授業前に靴をはき替えました。'],
['Later, the other student came and found the right pair.','あとで別の生徒が来て、正しい一足を見つけました。'],
['We laughed because the shoes looked so similar.','靴がとても似て見えたので、私たちは笑いました。'],
['After school, my friend made the name easier to see.','放課後、友達は名前をもっと見やすくしました。']
],false,[['indoor','室内の'],['similar','似ている']]),
build('V11-SS-G1-P10-2-023',SS,'PROGRAM 10-2',ssBase,'A Message on the Board',[
['I entered the classroom and saw a message on the board.','教室に入ると、黒板にメッセージがありました。'],
['It said that we needed a blue book after lunch.','昼食後に青い本が必要だと書いてありました。'],
['I put the book on my desk before the first class.','最初の授業前に、その本を机の上に置きました。'],
['My friend came later and did not see the message.','友達はあとで来て、そのメッセージを見ませんでした。'],
['I told my friend about the blue book.','私は友達に青い本のことを伝えました。'],
['My friend looked in a bag but the book was not there.','友達はかばんの中を見ましたが、本はありませんでした。'],
['There was still time before lunch.','昼食までまだ時間がありました。'],
['My friend went home nearby and brought the book back.','友達は近くの家へ戻り、その本を持ってきました。'],
['After lunch, both of us had the right book.','昼食後、私たち二人とも正しい本を持っていました。'],
['A short message on the board helped us prepare.','黒板の短いメッセージが準備の助けになりました。']
],false,[['message','メッセージ']]),
build('V11-SS-G1-P10-2-024',SS,'PROGRAM 10-2',ssBase,'The Window after Lunch',[
['Our classroom felt warm after lunch.','昼食後、教室は暖かく感じました。'],
['Many students were sitting and talking quietly.','多くの生徒が座って静かに話していました。'],
['I asked my teacher if we could open a window.','窓を開けてもよいか先生にたずねました。'],
['The teacher said yes, so my friend opened one window.','先生がいいと言ったので、友達が窓を一つ開けました。'],
['Cool air came into the room.','涼しい空気が部屋に入ってきました。'],
['After a few minutes, the room felt better.','数分後、部屋は過ごしやすく感じました。'],
['We studied there during the next class.','次の授業の間、私たちはそこで勉強しました。'],
['Before we left the room, I looked at the window again.','部屋を出る前に、私はもう一度窓を見ました。'],
['My friend closed it because no one would stay there.','だれも残らないので、友達が窓を閉めました。'],
['Opening and closing it at the right time kept the room comfortable.','よい時に開け閉めすることで、教室を快適にできました。']
],false,[['comfortable','快適な']]),
build('V11-SS-G1-P10-2-025',SS,'PROGRAM 10-2',ssBase,'One More Song',[
['Our music group played two songs at a small school event.','私たちの音楽グループは小さな学校行事で二曲演奏しました。'],
['We practiced the songs many times before that day.','その日までに、その曲を何度も練習しました。'],
['The first song was slow and the second song was bright.','最初の曲はゆっくりで、二曲目は明るい曲でした。'],
['Both songs went well, and we still had some time.','どちらの曲もうまくいき、まだ少し時間がありました。'],
['Our teacher asked if we wanted to play one more song.','先生はもう一曲演奏したいかたずねました。'],
['We looked at each other and chose a song everyone knew.','私たちは顔を見合わせ、全員が知っている曲を選びました。'],
['We had not planned to play it that day.','その日にその曲を演奏する予定ではありませんでした。'],
['Before we started, we quietly checked the first part together.','始める前に、最初の部分をいっしょに静かに確認しました。'],
['Then the teacher gave us a sign to begin.','それから先生が始める合図をしました。'],
['The song was simple, so we could listen to one another while we played.','その曲は簡単だったので、演奏しながらおたがいの音を聞けました。'],
['Some students in the room knew the song too.','部屋にいた生徒の中にもその曲を知っている人がいました。'],
['They moved with the music and smiled.','その生徒たちは音楽に合わせて動き、笑顔になりました。'],
['We finished the last sound together.','私たちは最後の音をいっしょに終えました。'],
['Playing one extra song became my favorite part of the event.','もう一曲演奏したことが、その行事で私のいちばん好きな時間になりました。']
],true,[['music','音楽'],['song','曲'],['extra','追加の']]),
build('V11-NH-G1-U10-2-019',NH,'Unit 10-2',nhBase,'The Picture on the Wall',[
['I saw an old class picture on a wall at school.','私は学校の壁に古いクラス写真を見つけました。'],
['Many students were standing in front of the school in the picture.','写真では多くの生徒が学校の前に立っていました。'],
['One face looked familiar to me.','一人の顔に見覚えがありました。'],
['I looked more closely and thought about where I had seen that person.','私はもっとよく見て、その人をどこで見たか考えました。'],
['Then a teacher came by and looked at the picture with me.','すると先生が通りかかり、私といっしょに写真を見ました。'],
['I asked about the student near the center.','私は中央近くの生徒についてたずねました。'],
['The teacher smiled and said that the student was now a teacher at our school.','先生は笑って、その生徒は今この学校の先生だと言いました。'],
['I was surprised because the person looked very young in the old picture.','古い写真ではその人がとても若く見えたので、私は驚きました。'],
['The teacher told me when the picture was taken.','先生はその写真がいつ撮られたか教えてくれました。'],
['After that, the old picture became more interesting to me.','そのあと、その古い写真がもっとおもしろく感じられました。']
],false,[['familiar','見覚えのある'],['center','中央']]),
build('V11-NH-G1-U10-2-020',NH,'Unit 10-2',nhBase,'A Small Morning Mistake',[
['I put my school things in my bag early in the morning.','私は朝早く学校の物をかばんに入れました。'],
['I thought I had the right notebook for the first class.','最初の授業の正しいノートを持っていると思っていました。'],
['At school, I opened my bag and saw a different notebook.','学校でかばんを開けると、違うノートが入っていました。'],
['I had brought my brother’s notebook by mistake.','私は間違えて兄弟のノートを持ってきていました。'],
['My friend had some extra paper and gave me two sheets.','友達が余分な紙を持っていて、二枚くれました。'],
['I used the paper during class and wrote my notes carefully.','授業中にその紙を使い、メモを書きました。'],
['After school, I took the paper home.','放課後、その紙を家へ持ち帰りました。'],
['I copied the notes into my own notebook.','私は自分のノートにメモを書き写しました。'],
['Then I put my brother’s notebook back in the right place.','それから兄弟のノートを正しい場所に戻しました。'],
['Now I check the name on each notebook before school.','今では学校へ行く前に、それぞれのノートの名前を確認します。']
],false,[['sheet','紙1枚'],['copied','書き写した']]),
build('V11-NH-G1-U10-2-021',NH,'Unit 10-2',nhBase,'The Red Bookmark',[
['I borrowed a book from our class shelf.','私はクラスの棚から本を借りました。'],
['When I opened it, a red bookmark fell onto my desk.','本を開くと、赤いしおりが机の上に落ちました。'],
['The bookmark had a small star on it.','そのしおりには小さな星がありました。'],
['I remembered seeing the same bookmark before.','私は前に同じしおりを見たことを思い出しました。'],
['My friend had used it in a book last week.','友達が先週、本でそれを使っていました。'],
['I asked my friend about the red bookmark after class.','授業後、赤いしおりについて友達にたずねました。'],
['My friend looked surprised and checked a pencil case.','友達は驚いた顔をして、筆箱を確認しました。'],
['The bookmark was not there, so I gave it back.','しおりはそこになかったので、私は返しました。'],
['My friend thanked me and put it in the book again.','友達はお礼を言い、また本にはさみました。'],
['I was glad that the small bookmark returned to its owner.','小さなしおりが持ち主に戻って、私はうれしかったです。']
],false,[['bookmark','しおり'],['owner','持ち主']]),
build('V11-NH-G1-U10-2-022',NH,'Unit 10-2',nhBase,'Meeting at the Corner',[
['My friend and I planned to meet near a store on Saturday.','友達と私は土曜日に店の近くで会う予定でした。'],
['I arrived first and waited at one corner.','私は先に着き、一つの角で待ちました。'],
['Five minutes passed, but my friend did not come.','五分たちましたが、友達は来ませんでした。'],
['I looked across the street and saw another corner near the same store.','通りの向こうを見ると、同じ店の近くに別の角がありました。'],
['I wondered if my friend was waiting there.','友達がそこで待っているのではないかと思いました。'],
['I walked to a place where I could see both corners safely.','両方の角を安全に見られる場所へ歩きました。'],
['Then I saw my friend beside a blue sign.','すると青い看板のそばに友達が見えました。'],
['My friend had been waiting at the other corner.','友達は別の角で待っていました。'],
['We laughed because both of us thought our corner was the clear meeting place.','二人とも自分の角が分かりやすい待ち合わせ場所だと思っていたので、笑いました。'],
['Before leaving, we looked at the two signs near the store.','出発する前に、店の近くの二つの看板を見ました。'],
['One sign was blue and the other was white.','一つは青く、もう一つは白い看板でした。'],
['We decided to use the blue sign as our meeting place next time.','次から青い看板を待ち合わせ場所にすることにしました。'],
['After that, we continued our day together.','そのあと、私たちはいっしょに一日を過ごしました。']
],true,[['corner','角'],['meeting','待ち合わせ']]),
build('V11-NH-G1-U10-2-023',NH,'Unit 10-2',nhBase,'A Photo for Grandmother',[
['My family wanted to send a new photo to my grandmother.','家族は祖母に新しい写真を送りたいと思いました。'],
['We stood together in our living room after dinner.','夕食後、私たちは居間でいっしょに立ちました。'],
['My father took three pictures of us.','父が私たちの写真を三枚撮りました。'],
['In the first picture, my eyes were closed.','最初の写真では私の目が閉じていました。'],
['The second picture was dark near the window.','二枚目は窓の近くが暗く写っていました。'],
['The third picture was clear, and everyone was smiling.','三枚目ははっきりしていて、みんな笑っていました。'],
['We chose that picture together.','私たちはその写真をいっしょに選びました。'],
['I wrote a short message for my grandmother.','私は祖母への短いメッセージを書きました。'],
['My father sent the picture and the message that evening.','父はその夜、写真とメッセージを送りました。'],
['The next day, my grandmother said the photo made her happy.','次の日、祖母はその写真でうれしくなったと言いました。']
],false,[['grandmother','祖母'],['clear','はっきりした']]),
build('V11-NH-G1-U10-2-024',NH,'Unit 10-2',nhBase,'The Empty Water Bottle',[
['I picked up my water bottle before a school activity.','学校の活動前に、私は水筒を持ちました。'],
['It felt very light, so I opened it.','とても軽く感じたので、開けました。'],
['There was no water inside.','中に水がありませんでした。'],
['I still had ten minutes before the activity started.','活動が始まるまでまだ十分ありました。'],
['I went to get water and filled the bottle.','私は水を入れに行き、水筒を満たしました。'],
['On my way back, I saw my friend with another bottle.','戻る途中で、別の水筒を持った友達に会いました。'],
['I asked if my friend had checked it.','友達がそれを確認したかたずねました。'],
['My friend opened the bottle and found only a little water.','友達が開けると、水が少ししかありませんでした。'],
['We got more water before the activity began.','活動が始まる前に、私たちはもっと水を入れました。'],
['Checking early helped both of us prepare.','早めに確認したことで、二人とも準備できました。']
],false,[['bottle','水筒'],['filled','満たした']]),
build('V11-NH-G1-U10-2-025',NH,'Unit 10-2',nhBase,'A Different Bus Stop',[
['I walked to my usual bus stop after school.','放課後、いつものバス停へ歩きました。'],
['A sign there said that buses would stop at a different place that day.','そこには、その日はバスが別の場所に止まると書かれた看板がありました。'],
['The road near the stop was being worked on.','バス停近くの道路で工事が行われていました。'],
['I read the sign again and looked for the new stop.','私は看板をもう一度読み、新しいバス停を探しました。'],
['An arrow on the sign pointed toward the station.','看板の矢印は駅のほうを指していました。'],
['I followed the arrow and saw several people waiting.','矢印に従うと、何人かの人が待っていました。'],
['A small bus sign was beside them.','その人たちのそばに小さなバスの看板がありました。'],
['I waited there and checked the bus number when it came.','そこで待ち、バスが来たとき番号を確認しました。'],
['It was the right bus, so I got on.','正しいバスだったので、私は乗りました。'],
['Reading the temporary sign helped me get home safely.','臨時の看板を読んだことで、安全に家へ帰れました。']
],false,[['arrow','矢印'],['temporary','臨時の']]),
build('V11-NH-G1-U10-2-026',NH,'Unit 10-2',nhBase,"My Father's Old School Bag",[
['My father opened a closet and found an old school bag.','父が物入れを開け、古い通学かばんを見つけました。'],
['The bag was smaller than the bag I use now.','そのかばんは今私が使っているかばんより小さかったです。'],
['Its color was dark, and one part was worn.','色は暗く、一部分が使い古されていました。'],
['I asked my father if he used it every day.','私は父に、それを毎日使っていたのかたずねました。'],
['He said he carried books and lunch in it when he was a student.','父は生徒だったころ、本と昼食を入れていたと言いました。'],
['He showed me a small mark inside the bag.','父はかばんの中の小さなしるしを見せてくれました。'],
['He had written his name there many years ago.','何年も前に、そこへ自分の名前を書いていました。'],
['Then he told me about one rainy school morning.','それから雨の日の学校の朝について一つ話してくれました。'],
['He forgot an umbrella and held the bag over his head.','父は傘を忘れ、かばんを頭の上にかざしました。'],
['The books stayed dry, but the outside of the bag became wet.','本はぬれませんでしたが、かばんの外側はぬれました。'],
['We laughed when he showed me the old mark from that day.','父がその日の古い跡を見せると、私たちは笑いました。'],
['I compared his bag with mine and noticed many differences.','私は父のかばんと自分のかばんを比べ、多くの違いに気づきました。'],
['Before putting it away, I wrote his story in my notebook.','しまう前に、私は父の話を自分のノートに書きました。'],
['The old bag became more than just an old thing to me.','その古いかばんは、私にとってただの古い物ではなくなりました。']
],true,[['closet','物入れ'],['worn','使い古された'],['mark','跡・しるし']]),
build('V11-NH-G1-U10-2-027',NH,'Unit 10-2',nhBase,'The Light in the Hall',[
['Our class moved to another room for the last lesson.','私たちのクラスは最後の授業のため別の部屋へ移動しました。'],
['I was one of the last students to leave.','私は最後に出る生徒の一人でした。'],
['When I closed the classroom door, I saw a light in the hall.','教室のドアを閉めたとき、廊下の明かりが見えました。'],
['No one was using that part of the hall.','廊下のその場所を使っている人はいませんでした。'],
['I did not know if students could turn the light off.','生徒がその明かりを消してよいか分かりませんでした。'],
['I told a teacher near the stairs.','私は階段の近くの先生に伝えました。'],
['The teacher checked the hall and turned the light off.','先生は廊下を確認して、明かりを消しました。'],
['The teacher thanked me for noticing it.','先生は気づいたことにお礼を言いました。'],
['After that, I looked back at our room before leaving school.','そのあと、学校を出る前に教室を振り返りました。'],
['A small check can stop us from leaving things on.','小さな確認で、物をつけたままにすることを防げます。']
],false,[['hall','廊下'],['stairs','階段']])
];
if(all.length!==17)throw new Error('Batch03 G1 draft count '+all.length);
if(new Set(all.map(x=>x.id)).size!==17)throw new Error('Batch03 G1 duplicate IDs');
window.V11_BATCH03_DRAFT_G1_PASSAGES=all;
window.V11_BATCH03_DRAFT_G1_STATE={batch:BATCH,count:17,registered:false,currentRuntimeTotal:268,targetRuntimeTotalAfterFullBatch03:318,wordCounts:all.map(p=>({id:p.id,wordCount:p.wordCount,target:p.targetWordBand}))};
})();