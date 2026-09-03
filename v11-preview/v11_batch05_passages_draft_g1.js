(function buildV11Batch05Grade1Draft(){
'use strict';
const BATCH='V11-B05-G1-DRAFT-20260828';
function slash(en){return en.replace(/, /g,', / ').replace(/\b(and|but|because|so|before|after|until|then|when)\b/gi,'/ $1');}
function wc(rows){return (rows.map(r=>r[0]).join(' ').match(/[A-Za-z]+(?:['’][A-Za-z]+)?/g)||[]).length;}
function build(id,textbook,section,baseline,title,rows,long,notes){
 const qs=rows.slice(0,10).map((r,i)=>({prompt:`${i+1}. 本文の第${i+1}文の内容に合う英文を本文から一文答えなさい。`,answer:r[0],evidence:r[0],evidenceJp:r[1],reason:`第${i+1}文が直接の根拠です。`}));
 return {id,textbook,grade:'1',section,level:'STEP',title,genre:'story',batch:BATCH,sourceSectionBaselineId:baseline,targetWordBand:long?[135,165]:[90,125],wordCount:wc(rows),sentences:rows.map(r=>r[0]),fullTranslation:rows.map(r=>r[1]).join(''),slashRows:rows.map(r=>({en:slash(r[0]),jp:r[1]})),questions:qs.slice(0,5),questionSetB:qs.slice(5,10),notes:(notes||[]).map(n=>({english:n[0],japanese:n[1],kind:'unlearned_local_required',source:'v11 Batch05 G1 story-specific required note seed'})),semanticRewrite:'BATCH05_G1_STORY_SPECIFIC_20260828',registered:false,auditNote:'Batch05 G1 non-runtime authoring draft. Story-specific passage; chronology, question diversity, notes, cross-batch, PC/iPhone and A4 gates still required.'};
}
const SS='サンシャイン',NH='ニューホライズン',ssBase='V10-SS-G1-P10-2-001',nhBase='V10-NH-G1-U10-2-001';
const all=[
build('V11-SS-G1-P10-2-034',SS,'PROGRAM 10-2',ssBase,'The Library Seat Card',[
['Our reading group often uses the same table in the school library.','私たちの読書グループは学校の図書室でよく同じ机を使います。'],
['One afternoon, another class was already using that table.','ある日の午後、別のクラスがすでにその机を使っていました。'],
['We found four empty seats near the back window instead.','私たちは代わりに奥の窓の近くに空いた席を四つ見つけました。'],
['One friend was coming later and did not know about the change.','一人の友達はあとで来る予定で、変更を知りませんでした。'],
['I wrote our names and the new place on a small card.','私は小さなカードに私たちの名前と新しい場所を書きました。'],
['I left the card where our group usually sat before moving.','移動する前に、いつもの席にそのカードを置きました。'],
['Ten minutes later, our friend entered and saw the card.','十分後、友達が入ってきてカードを見つけました。'],
['She followed the short note and joined us by the window.','彼女は短いメモにしたがって窓のそばの私たちに合流しました。'],
['Nobody had to leave the new seats to look for her.','だれも彼女を探すために新しい席を離れる必要がありませんでした。'],
['One simple card kept a small change from becoming confusing.','一枚の簡単なカードが小さな変更による混乱を防ぎました。']
],false,[['reading group','読書グループ'],['empty seat','空いた席'],['confusing','分かりにくい']]),
build('V11-SS-G1-P10-2-035',SS,'PROGRAM 10-2',ssBase,'The Two Blue Umbrellas',[
['It rained during our last class on Tuesday afternoon.','火曜日の最後の授業中に雨が降りました。'],
['Many students put their umbrellas near the classroom door.','多くの生徒が教室のドアの近くに傘を置きました。'],
['After school, I saw two blue umbrellas of the same size.','放課後、同じ大きさの青い傘を二本見つけました。'],
['I almost took the first one because it looked like mine.','自分のものに見えたので、最初の一本を取りそうになりました。'],
['Then I remembered the small name tag on my umbrella.','そのとき、自分の傘に小さな名前札があることを思い出しました。'],
['I checked the handle and found another student’s name there.','持ち手を確認すると、別の生徒の名前がありました。'],
['The second umbrella had my own tag under the handle.','二本目の傘には持ち手の下に私の名前札がありました。'],
['I took that one and left the other umbrella in place.','私はそちらを取り、もう一本はその場所に残しました。'],
['The next student could find the correct umbrella easily too.','次の生徒も正しい傘を簡単に見つけられました。'],
['Checking one small tag stopped us from taking each other’s things.','小さな名前札を確認することで、お互いの物を取り違えずにすみました。']
],false,[['name tag','名前札'],['handle','持ち手']]),
build('V11-SS-G1-P10-2-036',SS,'PROGRAM 10-2',ssBase,'The Practice Room Clock',[
['Our music group meets in a practice room after school.','私たちの音楽グループは放課後、練習室に集まります。'],
['On Wednesday, the wall clock in that room was five minutes slow.','水曜日、その部屋の掛け時計は五分遅れていました。'],
['We did not notice the problem when we first came in.','最初に入ったとき、私たちはその問題に気づきませんでした。'],
['Everyone thought we still had time before practice should start.','みんな練習開始までまだ時間があると思っていました。'],
['A teacher opened the door and asked why we were waiting.','先生がドアを開け、なぜ待っているのかたずねました。'],
['We looked at the hall clock and saw the real time.','廊下の時計を見て、本当の時刻を確認しました。'],
['After that, we checked the hall clock before every practice.','それからは毎回、練習前に廊下の時計を確認しました。'],
['One student also wrote a note beside the slow clock.','一人の生徒が遅れている時計のそばにメモも書きました。'],
['The note reminded other groups to check the time too.','そのメモはほかのグループにも時刻確認を思い出させました。'],
['A quick check helped everyone begin practice at the right time.','短い確認のおかげで、みんな正しい時刻に練習を始められました。']
],false,[['practice room','練習室'],['wall clock','掛け時計'],['reminded','思い出させた']]),
build('V11-SS-G1-P10-2-037',SS,'PROGRAM 10-2',ssBase,'The Lunch Box Note',[
['My brother and I have lunch boxes that look almost the same.','弟と私はほとんど同じ見た目の弁当箱を持っています。'],
['Mine is dark green, and his is also dark green.','私のは濃い緑色で、弟のも濃い緑色です。'],
['One morning, both boxes were ready on the kitchen table.','ある朝、二つの弁当箱が台所の机に用意されていました。'],
['I picked one up and nearly put it in my school bag.','私は一つを取り、通学かばんに入れそうになりました。'],
['My brother saw me and asked me to check the food inside.','弟がそれを見て、中の食べ物を確認するよう言いました。'],
['We laughed because I was holding his lunch box.','私が弟の弁当箱を持っていたので、二人で笑いました。'],
['That evening, I wrote our names on two small paper labels.','その晩、二枚の小さな紙のラベルに私たちの名前を書きました。'],
['We put one label on the top of each lunch box.','それぞれの弁当箱のふたに一枚ずつ貼りました。'],
['The next morning, we could tell the boxes apart at once.','次の朝、すぐに二つの弁当箱を見分けられました。'],
['A tiny name label made our busy morning much easier.','小さな名前ラベルで忙しい朝がずっと楽になりました。']
],false,[['lunch box','弁当箱'],['label','ラベル'],['tell apart','見分ける']]),
build('V11-SS-G1-P10-2-038',SS,'PROGRAM 10-2',ssBase,'One Clear Meeting Place',[
['Four friends planned to meet before a school sports event.','四人の友達が学校のスポーツ行事の前に待ち合わせを計画しました。'],
['One said the front gate, and another said the bicycle area.','一人は正門、別の一人は自転車置き場と言いました。'],
['A third friend thought everyone meant the gym entrance.','三人目の友達は全員が体育館入口のことだと思っていました。'],
['I saw that three different places could cause a problem.','三つの違う場所では問題になると思いました。'],
['We looked at the school map together on our phones.','私たちはスマートフォンで学校の地図をいっしょに見ました。'],
['The large clock near the main gate was easy to see.','正門近くの大きな時計は見つけやすい場所でした。'],
['We chose that clock as our only meeting place.','私たちはその時計を唯一の待ち合わせ場所に決めました。'],
['I sent one short message with the place and meeting time.','私は場所と時刻を書いた短いメッセージを一つ送りました。'],
['All four of us arrived there before the event began.','行事が始まる前に四人全員がそこへ着きました。'],
['Choosing one clear place was better than keeping three ideas.','三つの案を残すより、一つの明確な場所を選ぶほうがよかったです。']
],false,[['meeting place','待ち合わせ場所'],['main gate','正門']]),
build('V11-SS-G1-P10-2-039',SS,'PROGRAM 10-2',ssBase,'The Wet Homework Folder',[
['Rain started while I was walking home from school one day.','ある日、学校から歩いて帰る途中で雨が降り始めました。'],
['I had an umbrella, but my school bag became a little wet.','傘はありましたが、通学かばんが少しぬれました。'],
['At a covered bus stop, I opened the bag to check inside.','屋根のあるバス停で、私はかばんの中を確認しました。'],
['The corner of my homework paper was already getting wet.','宿題の紙の角がすでにぬれ始めていました。'],
['I also had a dry plastic folder in another pocket.','別のポケットに乾いたプラスチックのファイルもありました。'],
['I moved the homework and my other papers into that folder.','宿題とほかの紙をそのファイルへ移しました。'],
['Then I closed the bag carefully before walking again.','それからもう一度歩く前に、かばんを注意して閉じました。'],
['When I reached home, the outside of the bag was wetter.','家に着いたとき、かばんの外側はさらにぬれていました。'],
['The homework inside the folder was still dry and easy to read.','ファイルの中の宿題は乾いたままで、読むことができました。'],
['Moving the papers early saved me from doing the homework again.','早めに紙を移したことで、宿題をやり直さずにすみました。']
],false,[['plastic folder','プラスチックのファイル'],['covered','屋根のある']]),
build('V11-SS-G1-P10-2-040',SS,'PROGRAM 10-2',ssBase,'The First Page Mark',[
['Our class reading group started a new story on Friday.','私たちのクラスの読書グループは金曜日に新しい物語を始めました。'],
['The teacher told us to begin on page forty-two.','先生は四十二ページから始めるよう言いました。'],
['After a short break, two students opened the book again.','短い休憩のあと、二人の生徒がもう一度本を開きました。'],
['One opened page forty, and the other opened page forty-four.','一人は四十ページ、もう一人は四十四ページを開きました。'],
['Nobody wanted to lose more time finding the first page.','だれも最初のページを探してこれ以上時間を使いたくありませんでした。'],
['I put a small paper mark at page forty-two.','私は四十二ページに小さな紙の印をはさみました。'],
['I wrote “Start here” on the part above the book.','本から出る部分に「ここから始める」と書きました。'],
['Everyone could see the mark when we returned after lunch.','昼食後に戻ると、みんなその印を見ることができました。'],
['We opened the correct page together without asking again.','もう一度たずねることなく、いっしょに正しいページを開きました。'],
['One clear page mark kept our reading time moving smoothly.','一つの明確なページの印で、読書時間をスムーズに進められました。']
],false,[['page mark','ページの印'],['smoothly','スムーズに']]),
build('V11-SS-G1-P10-2-041',SS,'PROGRAM 10-2',ssBase,'The Quiet Phone Reminder',[
['My aunt called me just before our basketball club started.','バスケットボール部が始まる直前、おばから電話がかかってきました。'],
['I could not talk because our coach was calling everyone together.','コーチがみんなを集めていたので、話すことができませんでした。'],
['I told my aunt that I would call her after practice.','練習後に電話するとおばに伝えました。'],
['Then I put my phone away and joined the team.','それから電話をしまい、チームに加わりました。'],
['Practice ended later than usual, and I almost forgot the call.','練習はいつもより遅く終わり、私は電話を忘れそうになりました。'],
['Before practice, I had set a quiet reminder for that time.','練習前に、その時刻に静かなリマインダーを設定していました。'],
['The message appeared when I looked at my phone again.','もう一度電話を見ると、メッセージが表示されました。'],
['I moved to a quiet place outside the gym.','私は体育館の外の静かな場所へ移動しました。'],
['Then I called my aunt and answered her question.','それからおばに電話し、質問に答えました。'],
['A short reminder helped me keep a promise after a busy practice.','短いリマインダーのおかげで、忙しい練習後も約束を守れました。']
],false,[['reminder','リマインダー'],['coach','コーチ']]),
build('V11-NH-G1-U10-2-037',NH,'Unit 10-2',nhBase,'The Correct Train Direction',[
['My father and I took a train to visit my grandmother.','父と私は祖母を訪ねるため電車に乗りました。'],
['At the station, two platforms had trains leaving soon.','駅では二つのホームからまもなく電車が出るところでした。'],
['The signs showed different final station names above the stairs.','階段の上の案内には違う終点名が表示されていました。'],
['I remembered our station name but not the direction we needed.','私は目的の駅名は覚えていましたが、必要な方向は覚えていませんでした。'],
['My father said we should check before going down.','父は下へ行く前に確認しようと言いました。'],
['We looked at the route map beside the ticket gates.','私たちは改札のそばの路線図を見ました。'],
['Our station was on the line toward the second final station.','私たちの駅は二つ目の終点へ向かう路線上にありました。'],
['We followed that station name and went to the correct platform.','その終点名を確認し、正しいホームへ行きました。'],
['The train arrived, and we reached my grandmother’s town safely.','電車が到着し、無事に祖母の町へ着きました。'],
['Checking the final station name made the direction easy to choose.','終点名を確認すると、方向を簡単に選べました。']
],false,[['platform','ホーム'],['final station','終点'],['route map','路線図']]),
build('V11-NH-G1-U10-2-038',NH,'Unit 10-2',nhBase,'The Extra Chair',[
['Our class held a small welcome lunch for a visiting student.','私たちのクラスは訪問してきた生徒のため小さな歓迎昼食会を開きました。'],
['We put six chairs around one table before the lunch began.','昼食会が始まる前に、一つの机の周りにいすを六脚置きました。'],
['Then the visiting student’s teacher came into the room too.','すると訪問生徒の先生も部屋に入ってきました。'],
['There was no empty chair left at our table.','私たちの机には空いたいすが残っていませんでした。'],
['I saw another chair beside the wall near the door.','私はドア近くの壁のそばに別のいすを見つけました。'],
['A friend and I carried it carefully to the table.','友達と私はそれを注意して机まで運びました。'],
['We moved our bags so everyone had enough space.','みんなに十分な場所ができるよう、かばんを移しました。'],
['The teacher sat with us and joined our conversation.','先生は私たちといっしょに座り、会話に加わりました。'],
['Nobody needed to stand or eat in another place.','だれも立ったり別の場所で食べたりする必要がありませんでした。'],
['One extra chair helped the unexpected guest feel welcome.','一脚の追加のいすで、予定外の客も歓迎されていると感じられました。']
],false,[['welcome lunch','歓迎昼食会'],['extra','追加の'],['unexpected','予定外の']]),
build('V11-NH-G1-U10-2-039',NH,'Unit 10-2',nhBase,'The Changed Start Time',[
['Our science club planned to meet at four on Thursday.','科学部は木曜日の四時に集まる予定でした。'],
['I wrote that time in my notebook on Monday.','私は月曜日にその時刻をノートに書きました。'],
['On Wednesday, our teacher changed the meeting to four thirty.','水曜日、先生が集合時刻を四時半に変更しました。'],
['I heard the new time, but my old note still said four.','新しい時刻を聞きましたが、古いメモにはまだ四時とありました。'],
['I did not want to read the old note and arrive too early.','古いメモを読んで早く着きすぎたくありませんでした。'],
['I drew one line through four and wrote four thirty beside it.','四時に一本線を引き、その横に四時半と書きました。'],
['I also added the word “new” above the changed time.','変更した時刻の上に「new」とも書きました。'],
['The next day, I checked the notebook before leaving class.','次の日、教室を出る前にノートを確認しました。'],
['I went to the club room at the new time with my friend.','友達と新しい時刻に部室へ行きました。'],
['Changing the old note clearly kept the schedule easy to understand.','古いメモをはっきり直したことで、予定が分かりやすくなりました。']
],false,[['schedule','予定'],['changed time','変更した時刻']]),
build('V11-NH-G1-U10-2-040',NH,'Unit 10-2',nhBase,'The Photo with the School Name',[
['An exchange student visited our school for one afternoon.','交換留学生が午後の間、私たちの学校を訪れました。'],
['Before leaving, she wanted one photo to remember the visit.','帰る前に、訪問の思い出として写真を一枚撮りたがりました。'],
['We first stood beside a tree in the school yard.','最初、私たちは校庭の木のそばに立ちました。'],
['The place was pretty, but the photo could be from any school.','きれいな場所でしたが、どの学校の写真か分かりませんでした。'],
['My friend pointed to the main building near the front gate.','友達が正門近くの本館を指しました。'],
['Our school name was written clearly above its entrance.','入口の上に学校名がはっきり書かれていました。'],
['We moved there and stood where the name stayed behind us.','そこへ移動し、学校名が後ろに見える場所に立ちました。'],
['Another student took the picture with all of us smiling.','別の生徒が、全員が笑顔の写真を撮りました。'],
['The visitor could see both her new friends and our school name.','訪問生徒は新しい友達と学校名の両方を見ることができました。'],
['Choosing the background made one simple photo tell a fuller story.','背景を選ぶことで、一枚の写真がより多くを伝えるものになりました。']
],false,[['exchange student','交換留学生'],['background','背景'],['entrance','入口']]),
build('V11-NH-G1-U10-2-041',NH,'Unit 10-2',nhBase,'The Missing Price Tag',[
['I stopped at a small shop with my sister after school.','放課後、姉と小さな店に寄りました。'],
['I wanted to buy a notebook for my next class project.','次の授業の活動用にノートを買いたいと思いました。'],
['Most notebooks had a price tag on the shelf below them.','ほとんどのノートには下の棚に値札がありました。'],
['One notebook I liked had no clear tag near it.','気に入った一冊の近くには、はっきりした値札がありませんでした。'],
['I almost carried it to the register without knowing the price.','値段を知らないままレジへ持っていきそうになりました。'],
['My sister said it was better to ask before deciding.','姉は決める前にたずねたほうがよいと言いました。'],
['I showed the notebook to a worker and asked the price.','店員にノートを見せ、値段をたずねました。'],
['The worker checked a list and told me the correct amount.','店員は一覧を確認し、正しい金額を教えてくれました。'],
['The price was within my money, so I bought the notebook.','持っているお金で足りたので、そのノートを買いました。'],
['Asking one question helped me choose without an unpleasant surprise.','一つ質問したことで、困るような驚きなく選ぶことができました。']
],false,[['price tag','値札'],['register','レジ'],['amount','金額']]),
build('V11-NH-G1-U10-2-042',NH,'Unit 10-2',nhBase,'The Last Bus Check',[
['My friends and I went to an evening school event on Friday.','金曜日、友達と私は夕方の学校行事へ行きました。'],
['The program ended later than we first expected.','行事は最初の予想より遅く終わりました。'],
['We usually took the bus from the stop near school.','私たちは普段、学校近くのバス停からバスに乗ります。'],
['One friend said another bus would probably come soon.','一人の友達は、たぶん次のバスがすぐ来ると言いました。'],
['I wanted to check because it was already getting late.','もう遅くなっていたので、私は確認したいと思いました。'],
['We looked at the bus time board beside the school entrance.','学校入口のそばのバス時刻表を見ました。'],
['The last bus was leaving in only twelve minutes.','最終バスはあと十二分で出るところでした。'],
['We packed our things quickly and walked together to the stop.','荷物をすばやくまとめ、いっしょにバス停へ歩きました。'],
['We reached it before the bus came and all got home safely.','バスが来る前に着き、全員無事に帰宅しました。'],
['Checking the last time was safer than depending on a guess.','予想に頼るより、最終時刻を確認するほうが安全でした。']
],false,[['last bus','最終バス'],['time board','時刻表'],['expected','予想した']]),
build('V11-NH-G1-U10-2-043',NH,'Unit 10-2',nhBase,'The Wrong Classroom Number',[
['A notice said our class meeting was in room two hundred five.','お知らせには、学級の集まりは205教室と書かれていました。'],
['That number surprised me because we usually met on another floor.','普段は別の階で集まるので、その番号を不思議に思いました。'],
['Two friends were ready to go upstairs without checking.','二人の友達は確認せず上の階へ行こうとしていました。'],
['I remembered that the school board showed room changes each day.','学校の掲示板には毎日教室変更が出ることを思い出しました。'],
['We stopped by the board near the teachers’ room first.','まず職員室近くの掲示板に立ち寄りました。'],
['The board said room one hundred five, not two hundred five.','掲示板には205ではなく105教室とありました。'],
['The first notice had one wrong number written on it.','最初のお知らせには数字が一つ間違って書かれていました。'],
['We told our teacher, and she corrected the notice quickly.','先生に伝えると、すぐにお知らせを直してくれました。'],
['Our classmates then went to the right room on the first floor.','その後、クラスメートは一階の正しい教室へ行きました。'],
['Checking an unusual number saved many people from going upstairs.','不自然な番号を確認したことで、多くの人が上の階へ行かずにすみました。']
],false,[['notice','お知らせ'],['school board','学校の掲示板'],['unusual','普段と違う']]),
build('V11-NH-G1-U10-2-044',NH,'Unit 10-2',nhBase,'The Simple Gift List',[
['My family prepared small gifts for three relatives on Sunday.','日曜日、家族で三人の親せきに小さな贈り物を用意しました。'],
['The bags were the same color and were all on one table.','袋は同じ色で、全部一つの机に置かれていました。'],
['Each person was getting a different book or snack.','それぞれ違う本やお菓子を受け取る予定でした。'],
['I worried that we might put the wrong gift in a bag.','間違った贈り物を袋に入れるかもしれないと思いました。'],
['I wrote the three names down the left side of a paper.','紙の左側に三人の名前を書きました。'],
['Beside each name, I wrote the correct gift in simple words.','それぞれの名前の横に、正しい贈り物を簡単な言葉で書きました。'],
['My mother checked the list while filling the bags.','母は袋に入れながら一覧を確認しました。'],
['I added each name to the outside after a bag was ready.','袋ができるたびに外側へ名前を付けました。'],
['At the family visit, every person received the planned gift.','家族を訪ねたとき、全員が予定どおりの贈り物を受け取りました。'],
['A short list made three similar bags easy to prepare correctly.','短い一覧で、似た三つの袋を正しく準備しやすくなりました。']
],false,[['relative','親せき'],['gift list','贈り物の一覧']]),
build('V11-NH-G1-U10-2-045',NH,'Unit 10-2',nhBase,'The Water Bottle Mark',[
['Our basketball team put water bottles beside the gym wall.','バスケットボール部は体育館の壁のそばに水筒を置きました。'],
['Several bottles were the same shape and almost the same color.','いくつかの水筒は同じ形で、色もほとんど同じでした。'],
['During a break, I reached for one that looked like mine.','休憩中、自分のものに見える一本へ手を伸ばしました。'],
['A teammate stopped me because it was actually his bottle.','チームメートが止めました。それは実は彼の水筒でした。'],
['We both laughed, but we wanted to avoid another mistake.','二人で笑いましたが、もう一度間違えたくありませんでした。'],
['I found a small piece of bright tape in my bag.','かばんの中に明るい色の小さなテープを見つけました。'],
['I put the tape around the top of my own bottle.','自分の水筒の上の部分にそのテープを巻きました。'],
['The bright mark was easy to see from a short distance.','明るい印は少し離れた場所からでも見やすくなりました。'],
['After that, I always picked up the correct bottle during breaks.','それからは休憩中、いつも正しい水筒を取ることができました。'],
['One simple mark helped everyone keep personal things separate.','一つの簡単な印で、個人の物を区別しておけるようになりました。']
],false,[['water bottle','水筒'],['bright tape','明るい色のテープ'],['separate','分けておく']])
];
window.V11_BATCH05_G1_PASSAGES=all;
window.V11_BATCH05_G1_META={batch:BATCH,count:all.length,registered:false,grade1:17};
})();
