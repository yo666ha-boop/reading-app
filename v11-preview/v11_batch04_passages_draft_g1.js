(function buildV11Batch04Grade1Draft(){
'use strict';
const BATCH='V11-B04-G1-DRAFT-20260828';
function slash(en){return en.replace(/, /g,', / ').replace(/\b(and|but|because|so|before|after|until|then|when)\b/gi,'/ $1');}
function wc(rows){return (rows.map(r=>r[0]).join(' ').match(/[A-Za-z]+(?:['’][A-Za-z]+)?/g)||[]).length;}
function build(id,textbook,section,baseline,title,rows,long,notes){
 const qs=rows.slice(0,10).map((r,i)=>({prompt:`${i+1}. 本文の第${i+1}文の内容に合う英文を本文から一文答えなさい。`,answer:r[0],evidence:r[0],evidenceJp:r[1],reason:`第${i+1}文が直接の根拠です。`}));
 return {id,textbook,grade:'1',section,level:'STEP',title,genre:'story',batch:BATCH,sourceSectionBaselineId:baseline,targetWordBand:long?[135,165]:[90,125],wordCount:wc(rows),sentences:rows.map(r=>r[0]),fullTranslation:rows.map(r=>r[1]).join(''),slashRows:rows.map(r=>({en:slash(r[0]),jp:r[1]})),questions:qs.slice(0,5),questionSetB:qs.slice(5,10),notes:(notes||[]).map(n=>({english:n[0],japanese:n[1],kind:'unlearned_local_required',source:'v11 Batch04 G1 story-specific required note seed'})),semanticRewrite:'BATCH04_G1_STORY_SPECIFIC_20260828',registered:false,auditNote:'Batch04 G1 non-runtime authoring draft. Story-specific passage; chronology, length, question diversity, notes, cross-batch, PC/iPhone and A4 gates still required.'};
}
const SS='サンシャイン',NH='ニューホライズン',ssBase='V10-SS-G1-P10-2-001',nhBase='V10-NH-G1-U10-2-001';
const all=[
build('V11-SS-G1-P10-2-026',SS,'PROGRAM 10-2',ssBase,'The Library Card Pocket',[
['Our class has one card for each shelf in the small library.','私たちのクラスの小さな図書コーナーには、棚ごとにカードが一枚あります。'],
['One day, I used a card and put it on my desk.','ある日、私はカードを使い、机の上に置きました。'],
['After class, I almost left the room without it.','授業のあと、私はそのカードを置いたまま教室を出そうとしました。'],
['My friend saw the card and called my name.','友達がカードを見つけて、私の名前を呼びました。'],
['We wanted an easy way to keep the card in one place.','私たちはカードを一か所に置く簡単な方法を考えました。'],
['I made a small paper pocket and wrote “Library Card” on it.','私は小さな紙のポケットを作り、「Library Card」と書きました。'],
['We put the pocket beside the books, not on a desk.','そのポケットを机ではなく、本のそばに置きました。'],
['Now I return the card to the pocket after I use it.','今ではカードを使ったあと、そのポケットに戻します。'],
['Other students can also see where the card belongs.','ほかの生徒もカードをどこへ戻すか分かります。'],
['A small pocket helped us stop a small problem before it became a big one.','小さなポケットのおかげで、小さな問題が大きくなる前に防げました。']
],false,[['pocket','ポケット'],['belongs','置くべき場所にある']]),
build('V11-SS-G1-P10-2-027',SS,'PROGRAM 10-2',ssBase,'The Full Bus Stop Name',[
['I was waiting for a bus with my cousin on Saturday.','土曜日、私はいとことバスを待っていました。'],
['We wanted to get off near a sports center.','私たちはスポーツセンターの近くで降りたいと思っていました。'],
['There were two bus stops with very similar names.','よく似た名前のバス停が二つありました。'],
['I remembered only the first part of the name.','私は名前の最初の部分しか覚えていませんでした。'],
['My cousin said we should check before we got on the bus.','いとこはバスに乗る前に確認したほうがよいと言いました。'],
['I looked at our message and wrote the full stop name on paper.','私はメッセージを見て、バス停の名前を全部紙に書きました。'],
['Then I showed the paper to the bus driver.','それからその紙をバスの運転手に見せました。'],
['The driver pointed to the correct bus and smiled.','運転手は正しいバスを指して笑顔を見せました。'],
['We arrived at the sports center without getting lost.','私たちは道に迷わずスポーツセンターに着きました。'],
['Writing the whole name was better than trusting a name that only sounded familiar.','聞き覚えのある名前だけを頼りにするより、名前を全部書くほうがよいと分かりました。']
],false,[['similar','似ている'],['driver','運転手'],['familiar','聞き覚えのある']]),
build('V11-SS-G1-P10-2-028',SS,'PROGRAM 10-2',ssBase,'Two Arrows to the Club Room',[
['A new student wanted to visit our art club after school.','新しい生徒が放課後に私たちの美術部を見学したがっていました。'],
['She knew the school building, but she did not know our club room.','彼女は校舎は知っていましたが、部室の場所は知りませんでした。'],
['I first gave her a long explanation in the hall.','最初、私は廊下で長い説明をしました。'],
['She looked at me and asked about the second turn again.','彼女は私を見て、二つ目の曲がり角についてもう一度たずねました。'],
['I saw that my words were not easy to remember.','私の説明は覚えやすくないと気づきました。'],
['So I drew a short line on a small piece of paper.','そこで小さな紙に短い線を描きました。'],
['I added two arrows and wrote “Art Club” at the end.','矢印を二つ加え、最後に「Art Club」と書きました。'],
['She followed the arrows and found the room in a few minutes.','彼女は矢印にしたがい、数分で部室を見つけました。'],
['She kept the note for her next visit.','彼女は次に来るときのために、そのメモを取っておきました。'],
['A simple picture gave clearer help than my long first explanation.','簡単な絵のほうが、最初の長い説明より分かりやすい助けになりました。']
],false,[['arrow','矢印'],['followed','たどった']]),
build('V11-SS-G1-P10-2-029',SS,'PROGRAM 10-2',ssBase,'The Similar Packages',[
['My mother asked me to get one kind of noodles at a store.','母は店である種類のめんを取ってくるよう私に頼みました。'],
['She showed me a picture of the package before I left.','出かける前に、その商品の写真を見せてくれました。'],
['At the store, I found two packages with almost the same color.','店では、ほとんど同じ色のパッケージが二つありました。'],
['I picked up the first one because the color looked right.','色が合っているように見えたので、最初の一つを手に取りました。'],
['Then I remembered that color was not the only thing to check.','そのとき、色だけを確認すればよいのではないと思い出しました。'],
['I looked at the picture on my phone again.','私はスマートフォンの写真をもう一度見ました。'],
['The word under the picture was different on the two packages.','二つのパッケージでは、絵の下の言葉が違っていました。'],
['I chose the package with both the right picture and the right word.','私は正しい絵と正しい言葉の両方がある商品を選びました。'],
['My mother checked it when I got home.','家に帰ると、母がそれを確認しました。'],
['Looking at two details helped me avoid a simple shopping mistake.','二つの点を見たことで、簡単な買い物の間違いを避けられました。']
],false,[['package','包装・パッケージ'],['detail','細かい点']]),
build('V11-SS-G1-P10-2-030',SS,'PROGRAM 10-2',ssBase,'The Return-Date Note',[
['I borrowed a book from a friend for one week.','私は友達から一週間、本を借りました。'],
['I was happy to read it, but I did not write the return date anywhere.','読むのはうれしかったのですが、返す日をどこにも書きませんでした。'],
['Several days passed, and I almost forgot our plan.','何日か過ぎ、私は約束を忘れそうになりました。'],
['My friend asked if I was still reading the book.','友達は私がまだその本を読んでいるかたずねました。'],
['I checked the date and saw that I had only two days left.','日付を確認すると、あと二日しかありませんでした。'],
['That evening, I wrote “Return book Friday” on a note.','その晩、メモに「金曜日に本を返す」と書きました。'],
['I put the note beside my school bag.','そのメモを通学かばんのそばに置きました。'],
['I saw it again before school on Friday morning.','金曜日の朝、学校へ行く前にもう一度それを見ました。'],
['The book went into my bag, and I returned it that day.','本をかばんに入れ、その日に返しました。'],
['A note in the right place helped me remember at the right time.','必要な場所に置いたメモのおかげで、必要なときに思い出せました。']
],false,[['return date','返却日']]),
build('V11-SS-G1-P10-2-031',SS,'PROGRAM 10-2',ssBase,'Rain on the Short Walk',[
['My friend and I walked to a small store after school.','友達と私は放課後、小さな店まで歩きました。'],
['The sky was gray, but it was not raining when we left.','空は灰色でしたが、出発したときは雨は降っていませんでした。'],
['Halfway there, large drops began to fall.','途中で大きな雨粒が降り始めました。'],
['Neither of us had an umbrella.','私たちは二人とも傘を持っていませんでした。'],
['We saw a covered place near a building and went there.','建物の近くに屋根のある場所を見つけ、そこへ行きました。'],
['We waited together and watched the road.','私たちはいっしょに待ちながら道を見ていました。'],
['After a few minutes, the rain became much lighter.','数分後、雨はずっと弱くなりました。'],
['We decided to walk home instead of going to the store.','店へ行く代わりに家へ帰ることにしました。'],
['Our shoes were a little wet, but we were safe and calm.','靴は少しぬれましたが、安全で落ち着いていました。'],
['Waiting for a short time was better than running through heavy rain.','強い雨の中を走るより、少し待つほうがよい選択でした。']
],false,[['covered','屋根のある'],['drops','雨粒']]),
build('V11-SS-G1-P10-2-032',SS,'PROGRAM 10-2',ssBase,'Show the First Move',[
['I brought a simple card game to class for free time.','私は自由時間に簡単なカードゲームを教室へ持ってきました。'],
['Three friends wanted to play, but none of them knew the rules.','三人の友達が遊びたがりましたが、だれもルールを知りませんでした。'],
['I started to explain every rule before the game began.','私はゲームを始める前にすべてのルールを説明し始めました。'],
['After a minute, one friend said there were too many words.','一分ほどすると、一人の友達が言葉が多すぎると言いました。'],
['I stopped and put two cards on the desk.','私は説明を止め、机に二枚のカードを置きました。'],
['I showed only the first move and asked my friend to copy it.','最初の一手だけ見せ、友達に同じようにしてもらいました。'],
['Then we started a practice round together.','それからいっしょに練習の一回を始めました。'],
['I explained the next rule only when we needed it.','次のルールは必要になったときだけ説明しました。'],
['Soon everyone understood enough to play without help.','すぐに全員が助けなしで遊べるほど理解しました。'],
['Showing one move first made the long rules much easier to learn.','最初に一手を見せることで、長いルールがずっと学びやすくなりました。']
],false,[['rule','ルール'],['copy','まねる'],['round','一回・一試合']]),
build('V11-SS-G1-P10-2-033',SS,'PROGRAM 10-2',ssBase,'The Callback Time',[
['My uncle called me while I was finishing my homework.','私が宿題を終えようとしているとき、おじから電話がかかってきました。'],
['He wanted to ask about our family visit on Sunday.','おじは日曜日の家族の訪問についてたずねたいことがありました。'],
['Just then, my mother asked me to help carry something.','ちょうどそのとき、母が物を運ぶのを手伝ってほしいと言いました。'],
['I told my uncle that I could not talk for long.','私はおじに長く話せないと伝えました。'],
['He said it was fine and asked me to call again later.','おじは大丈夫だと言い、あとでかけ直すよう言いました。'],
['I did not want to forget, so I wrote the time on paper.','忘れたくなかったので、時間を紙に書きました。'],
['The paper said, “Call Uncle at seven.”','その紙には「七時におじへ電話する」と書きました。'],
['I put it beside the clock in my room.','それを部屋の時計のそばに置きました。'],
['At seven, I saw the note and called him back.','七時にメモを見て、おじにかけ直しました。'],
['A clear time made an interrupted call easy to finish later.','はっきりした時間を書いたことで、中断した電話をあとで簡単に続けられました。']
],false,[['interrupted','中断された'],['call back','かけ直す']]),
build('V11-NH-G1-U10-2-028',NH,'Unit 10-2',nhBase,'Check the Calendar First',[
['My father asked me when our school music day was.','父が学校の音楽の日はいつか私にたずねました。'],
['I thought it was on Thursday, but I was not completely sure.','木曜日だと思いましたが、完全には自信がありませんでした。'],
['I almost answered quickly because Thursday sounded right.','木曜日で合っている気がして、すぐ答えそうになりました。'],
['Then I remembered the calendar on our kitchen wall.','そのとき、台所の壁にあるカレンダーを思い出しました。'],
['I checked it before giving my answer.','答える前にそれを確認しました。'],
['The music day was actually on Friday afternoon.','音楽の日は実際には金曜日の午後でした。'],
['My father thanked me for checking.','父は確認したことにお礼を言いました。'],
['He needed the correct day because he wanted to come.','父は来たいと思っていたので、正しい日が必要でした。'],
['I also wrote the starting time beside the date.','私は日付のそばに開始時間も書きました。'],
['Checking one calendar was better than giving a fast answer from memory.','記憶だけですぐ答えるより、カレンダーを一つ確認するほうがよいと分かりました。']
],false,[['calendar','カレンダー'],['actually','実際には']]),
build('V11-NH-G1-U10-2-029',NH,'Unit 10-2',nhBase,'At the Ticket Machine',[
['I was at a station with my older sister on Sunday.','日曜日、私は姉と駅にいました。'],
['A visitor stood near the ticket machine and looked worried.','旅行者が券売機の近くに立ち、困った様子でした。'],
['He showed us the name of a station on his phone.','その人はスマートフォンで駅の名前を見せました。'],
['My sister found the same name on the machine.','姉は券売機で同じ名前を見つけました。'],
['I pointed to the station name first.','私は最初に駅名を指しました。'],
['Then I pointed to the price shown beside it.','それから、そのそばに表示された金額を指しました。'],
['The visitor repeated the price to make sure he understood.','旅行者は分かったか確認するために金額を繰り返しました。'],
['My sister showed which button to press.','姉はどのボタンを押すか示しました。'],
['The ticket came out, and the visitor smiled.','切符が出てきて、旅行者は笑顔になりました。'],
['Showing the destination and the price in order made our help easy to follow.','行き先と金額を順番に示したことで、私たちの説明は分かりやすくなりました。']
],false,[['ticket machine','券売機'],['destination','行き先'],['button','ボタン']]),
build('V11-NH-G1-U10-2-030',NH,'Unit 10-2',nhBase,'Number and Item Again',[
['Our class ordered lunch before a school event.','学校行事の前に、私たちのクラスは昼食を注文しました。'],
['Each lunch had a number and a short name.','それぞれの昼食には番号と短い名前がありました。'],
['I told my friend that I wanted number three.','私は友達に三番がほしいと伝えました。'],
['My friend heard “two” because the room was noisy.','部屋がうるさかったので、友達には「二番」と聞こえました。'],
['When the lunches arrived, the wrong box was beside my name.','昼食が届くと、私の名前のそばに違う箱がありました。'],
['We checked the list and found the mistake.','私たちは一覧を確認し、間違いを見つけました。'],
['This time, I said both the number and the item name slowly.','今度は番号と品名の両方をゆっくり言いました。'],
['My friend repeated both parts back to me.','友達も両方を私に言い返しました。'],
['We corrected the list before anyone opened a box.','だれかが箱を開ける前に一覧を直しました。'],
['Using two pieces of information helped us fix the mix-up quickly.','二つの情報を使うことで、取り違えをすぐ直せました。']
],false,[['ordered','注文した'],['mix-up','取り違え']]),
build('V11-NH-G1-U10-2-031',NH,'Unit 10-2',nhBase,'The Missing Cleaning Tool',[
['Our class cleaned the room after the last lesson.','最後の授業のあと、私たちのクラスは教室を掃除しました。'],
['When we finished, one cleaning tool was missing.','終わったとき、掃除道具が一つ見つかりませんでした。'],
['Several students looked under desks and beside the door.','何人かの生徒が机の下やドアのそばを探しました。'],
['We could not find it there.','そこでは見つけられませんでした。'],
['Then our class leader brought the storage list.','そこで学級の係が収納場所の一覧を持ってきました。'],
['The list showed where each tool should go.','一覧にはそれぞれの道具をどこへ戻すか書かれていました。'],
['We noticed that the missing tool belonged in a small space near the back wall.','なくなった道具は後ろの壁の近くの小さな場所に戻すものだと気づきました。'],
['Another student had put it on the shelf above that space.','別の生徒がその場所の上の棚に置いていました。'],
['We returned it to the correct place and checked the list again.','正しい場所に戻し、一覧をもう一度確認しました。'],
['The list saved us from searching the whole room again.','その一覧のおかげで、教室全体をもう一度探さずにすみました。']
],false,[['storage','収納'],['tool','道具']]),
build('V11-NH-G1-U10-2-032',NH,'Unit 10-2',nhBase,'Move Near the Window',[
['Our group was taking photos for a small class project.','私たちの班は小さなクラス作品のために写真を撮っていました。'],
['We put a paper model on a desk at the back of the room.','紙の模型を教室の後ろの机に置きました。'],
['The first photo was too dark to show the model well.','最初の写真は暗すぎて模型がよく見えませんでした。'],
['I wanted to take many more photos from the same place.','私は同じ場所から何枚も撮り直そうと思いました。'],
['My partner looked at the window and had another idea.','相手は窓を見て、別の考えを持ちました。'],
['We moved the model to a desk near the window.','私たちは模型を窓の近くの机へ移しました。'],
['We did not change the model at all.','模型自体はまったく変えませんでした。'],
['The next photo was brighter and easier to see.','次の写真は明るく、見やすくなりました。'],
['We used that photo in our project.','私たちはその写真を作品に使いました。'],
['Changing the place solved the problem faster than repeating the same photo.','同じ写真を繰り返すより、場所を変えるほうが早く問題を解決できました。']
],false,[['model','模型'],['brighter','より明るい']]),
build('V11-NH-G1-U10-2-033',NH,'Unit 10-2',nhBase,'School Time for a Visitor',[
['A visitor came to our school during an open day.','公開日に一人の来校者が学校へ来ました。'],
['She asked me what time the next class would begin.','その人は次の授業が何時に始まるか私にたずねました。'],
['I thought I knew the answer, but our open-day schedule was different.','答えを知っていると思いましたが、公開日の予定はいつもと違いました。'],
['I did not want to send her to the room too early or too late.','早すぎたり遅すぎたりする時間に教室へ案内したくありませんでした。'],
['There was a schedule on a board near us.','近くの掲示板に予定表がありました。'],
['I checked the next class and its starting time.','次の授業と開始時間を確認しました。'],
['Then I showed the time to the visitor.','それからその時間を来校者に見せました。'],
['She thanked me and walked toward the correct room.','その人はお礼を言い、正しい教室へ向かいました。'],
['I checked one more time after she left.','その人が行ったあと、もう一度確認しました。'],
['Using the day’s real schedule was safer than answering from my usual routine.','いつもの時間割で答えるより、その日の実際の予定表を使うほうが確実でした。']
],false,[['visitor','来校者'],['schedule','予定表'],['routine','いつもの流れ']]),
build('V11-NH-G1-U10-2-034',NH,'Unit 10-2',nhBase,'The Picnic Bench',[
['My family planned a small picnic in a park.','家族で公園へ小さなピクニックに行く予定でした。'],
['We wanted to use a table near a large tree.','大きな木の近くのテーブルを使いたいと思っていました。'],
['When we arrived, another family was already using it.','着いたとき、別の家族がすでに使っていました。'],
['My little brother looked disappointed because he liked that place.','弟はその場所が好きだったので、残念そうでした。'],
['We did not want to wait for a long time.','私たちは長く待ちたくありませんでした。'],
['My father saw an empty bench a short walk away.','父が少し歩いたところに空いているベンチを見つけました。'],
['There was enough space beside it for our picnic sheet.','そのそばにはピクニックシートを広げる十分な場所もありました。'],
['We moved there and ate together.','私たちはそこへ移動し、いっしょに食べました。'],
['My brother soon forgot about the first table.','弟はすぐ最初のテーブルのことを忘れました。'],
['A nearby second choice kept our picnic simple and enjoyable.','近くの二つ目の選択肢のおかげで、ピクニックを簡単に楽しめました。']
],false,[['bench','ベンチ'],['disappointed','がっかりした']]),
build('V11-NH-G1-U10-2-035',NH,'Unit 10-2',nhBase,'Mark the First Music Line',[
['I practiced a short song with two friends after school.','放課後、私は二人の友達と短い曲を練習しました。'],
['The music sheet had several similar lines.','楽譜にはよく似た行がいくつかありました。'],
['During our first practice, I started from the wrong line.','最初の練習で、私は違う行から始めてしまいました。'],
['My friends stopped because my part did not match theirs.','私のパートが二人と合わなかったので、友達は止まりました。'],
['We laughed, but I wanted to avoid the same mistake.','私たちは笑いましたが、同じ間違いは避けたいと思いました。'],
['I put a small mark beside the correct first line.','私は正しい最初の行のそばに小さな印をつけました。'],
['Before the next practice, I looked at the mark.','次の練習の前に、その印を見ました。'],
['This time, all three of us began at the same place.','今度は三人とも同じ場所から始めました。'],
['The song sounded better, and we did not need to stop.','曲はよく聞こえ、止まる必要もありませんでした。'],
['One clear mark helped me find the right starting point quickly.','一つのはっきりした印で、正しい開始位置をすぐ見つけられました。']
],false,[['music sheet','楽譜'],['mark','印']]),
build('V11-NH-G1-U10-2-036',NH,'Unit 10-2',nhBase,'Write the Family Name Clearly',[
['A small package arrived at our house in the afternoon.','午後、家に小さな荷物が届きました。'],
['It was for my older brother, who was not home yet.','それはまだ帰宅していない兄あてでした。'],
['My mother asked me to leave it in the family room.','母は家族の部屋に置いておくよう私に頼みました。'],
['There were two other boxes there for different people.','そこには別の人あての箱が二つありました。'],
['The name on the new package was small and hard to see.','新しい荷物の名前は小さく、見えにくいものでした。'],
['I did not want anyone to open the wrong box.','だれかが違う箱を開けてほしくありませんでした。'],
['I wrote my brother’s name clearly on a note.','私は兄の名前をメモにはっきり書きました。'],
['Then I put the note on top of his package.','それからそのメモを兄の荷物の上に置きました。'],
['When he came home, he found his box immediately.','兄が帰宅すると、すぐ自分の箱を見つけました。'],
['A large clear name made three similar boxes easy to tell apart.','大きくはっきりした名前で、よく似た三つの箱を簡単に見分けられました。']
],false,[['package','荷物'],['tell apart','見分ける']])
];
if(all.length!==17)throw new Error('Batch04 G1 count '+all.length);
window.V11_BATCH04_G1_PASSAGES=all;
window.V11_BATCH04_G1_STATE={version:'20260828-g1-authoring',count:all.length,registered:false};
})();