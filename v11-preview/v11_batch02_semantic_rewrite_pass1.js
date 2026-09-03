(function rewriteV11Batch02SemanticPass1(){
'use strict';
const ps=window.V11_BATCH02_DRAFT_PASSAGES;
if(!Array.isArray(ps)||ps.length!==50)throw new Error('Batch02 draft missing before semantic rewrite pass1');
function slash(en){return en.replace(/, /g,', / ').replace(/\b(and|but|because|so|before|after|until|then|when)\b/gi,'/ $1');}
const R={
'V11-SS-G1-P10-2-010':[
['I lost my library card before I borrowed a science book.','科学の本を借りる前に、私は図書館のカードをなくしました。'],
['I looked in my bag, but the card was not there.','かばんの中を見ましたが、カードはありませんでした。'],
['I went back to the library and looked near the books.','私は図書館に戻り、本の近くを探しました。'],
['My friend came with me and helped me look for it.','友達も来て、いっしょに探してくれました。'],
['We looked under a book and near a chair.','私たちは本の下やいすの近くを探しました。'],
['Then I saw the card on the floor by the table.','すると、テーブルのそばの床にカードが見えました。'],
['I was happy because I could use the card again.','そのカードをまた使えるので、私はうれしかったです。'],
['After that, I borrowed the science book I wanted.','そのあと、私は読みたかった科学の本を借りました。'],
['I put the card in a small place in my bag.','私はカードをかばんの中の小さな場所に入れました。'],
['Now I check that place before I leave the library.','今では図書館を出る前に、その場所を確認します。']
],
'V11-NH-G1-U10-2-010':[
['Rain changed our park picnic into an indoor lunch and a board game.','雨で、公園のピクニックは室内での昼食とボードゲームに変わりました。'],
['We were ready to go to the park in the morning.','私たちは朝、公園へ行く準備をしていました。'],
['Then we saw the rain and stayed inside.','それから雨を見て、私たちは中にいました。'],
['At first, I was sad because I wanted the picnic.','最初、私はピクニックをしたかったので残念でした。'],
['My friend put our lunch on a table by the window.','友達が窓のそばのテーブルに昼食を置きました。'],
['We ate together and watched the rain outside.','私たちはいっしょに食べ、外の雨を見ました。'],
['After lunch, we started a board game.','昼食のあと、私たちはボードゲームを始めました。'],
['The game was fun, and everyone laughed a lot.','ゲームは楽しく、みんなたくさん笑いました。'],
['The rain did not stop, but our day was still good.','雨はやみませんでしたが、私たちの一日はそれでもよい一日でした。'],
['I learned that a changed plan can still be fun.','計画が変わっても楽しくできると学びました。']
],
'V11-SS-G1-P10-2-011':[
['I arrived early and helped my class prepare a presentation.','私は早く着き、クラスの発表の準備を手伝いました。'],
['Only a few students were in the classroom then.','そのとき教室には数人の生徒しかいませんでした。'],
['We put the papers on the desks and checked them.','私たちは紙を机の上に置き、確認しました。'],
['One picture was in the wrong place, so I moved it.','一枚の絵が違う場所にあったので、私は動かしました。'],
['My friend read the first part of the presentation.','友達は発表の最初の部分を読みました。'],
['I listened and helped with one hard word.','私は聞いて、一つの難しい言葉を手伝いました。'],
['Soon the other students came into the classroom.','やがてほかの生徒たちが教室に入ってきました。'],
['Everything was ready before our teacher came.','先生が来る前に、すべて準備できていました。'],
['The presentation started well, and I felt happy.','発表はうまく始まり、私はうれしく感じました。'],
['Arriving early gave our class time to prepare.','早く着いたことで、クラスは準備する時間を持てました。']
],
'V11-NH-G1-U10-2-011':[
['My friend and I compared two roads and chose the safer road home.','友達と私は二つの道を比べ、より安全な帰り道を選びました。'],
['One road was short, but many cars used it.','一方の道は短かったですが、たくさんの車が通りました。'],
['The other road was longer and had fewer cars.','もう一方の道はより長く、車が少なかったです。'],
['We stopped and looked at both roads before we walked.','私たちは歩く前に立ち止まり、両方の道を見ました。'],
['My friend said the longer road was better for us.','友達は長いほうの道が私たちにはよいと言いました。'],
['I agreed, so we chose that road together.','私も賛成したので、その道をいっしょに選びました。'],
['We could talk easily because the road was quiet.','その道は静かだったので、私たちは楽に話せました。'],
['It took more time, but we did not need to hurry.','時間はよりかかりましたが、急ぐ必要はありませんでした。'],
['We got home safely and told our families about the choice.','私たちは安全に家に着き、その選択について家族に話しました。'],
['Now I think about safety before I choose a road.','今では道を選ぶ前に安全について考えます。']
],
'V11-SS-G1-P10-2-012':[
['I quietly visited a museum and drew my favorite exhibit before I left.','私は静かに博物館を見学し、帰る前にお気に入りの展示物を描きました。'],
['There were many old things in the museum.','博物館にはたくさんの古い物がありました。'],
['I walked slowly and looked at each room.','私はゆっくり歩き、それぞれの部屋を見ました。'],
['One exhibit was small, but I liked its shape.','一つの展示物は小さかったですが、その形が気に入りました。'],
['I sat near it and opened my notebook.','私はその近くに座り、ノートを開きました。'],
['First I drew the outside, and then I added small parts.','最初に外側を描き、それから小さな部分を加えました。'],
['I looked at the exhibit many times while I drew.','描いている間、私は何度も展示物を見ました。'],
['My picture was simple, but it helped me remember the exhibit.','私の絵は簡単でしたが、その展示物を覚える助けになりました。'],
['Before I left, I looked at my drawing one more time.','帰る前に、私はもう一度自分の絵を見ました。'],
['The quiet museum visit became a good memory for me.','静かな博物館見学は私にとってよい思い出になりました。'],
['At home, I showed the sketch to my family and talked about the museum.','家で私は家族にスケッチを見せ、博物館について話しました。'],
['I want to draw another favorite exhibit when I visit again.','また訪れたときには、別のお気に入りの展示物を描きたいです。']
],
'V11-NH-G1-U10-2-012':[
['We made morning practice shorter because one teammate was tired.','チームメイトの一人が疲れていたので、朝の練習を短くしました。'],
['Our team usually practiced for a long time in the morning.','私たちのチームはふつう朝に長い時間練習しました。'],
['That day, one teammate looked very tired.','その日、一人のチームメイトがとても疲れて見えました。'],
['We asked if the teammate was all right.','私たちはそのチームメイトが大丈夫か尋ねました。'],
['The teammate wanted to practice but needed some rest.','そのチームメイトは練習したかったですが、少し休む必要がありました。'],
['So we chose only the most important practice.','そこで私たちはいちばん大切な練習だけを選びました。'],
['We worked carefully for a short time together.','私たちは短い時間、いっしょに注意して取り組みました。'],
['Then we stopped earlier than usual.','そして、いつもより早く終わりました。'],
['The teammate smiled and thanked everyone.','そのチームメイトは笑って、みんなにお礼を言いました。'],
['I learned that helping a teammate is also part of practice.','チームメイトを助けることも練習の一部だと学びました。']
],
'V11-SS-G1-P10-2-013':[
['My family found one missing ingredient and cooked dinner together.','家族は足りない材料が一つあることに気づき、いっしょに夕食を作りました。'],
['We started cooking after everyone came home.','みんなが家に帰ったあと、私たちは料理を始めました。'],
['My mother looked at the food and saw one problem.','母が食べ物を見て、一つ問題に気づきました。'],
['One ingredient was not in the kitchen.','一つの材料が台所にありませんでした。'],
['We talked about what we could use instead.','私たちは代わりに何を使えるか話しました。'],
['My father found another food that worked well.','父がうまく使える別の食べ物を見つけました。'],
['I washed the vegetables while my family cooked.','家族が料理する間、私は野菜を洗いました。'],
['Soon the dinner smelled very good.','やがて夕食はとてもよいにおいがしました。'],
['We sat down and ate the dinner together.','私たちは座って、いっしょに夕食を食べました。'],
['The missing ingredient did not stop our family dinner.','足りない材料があっても、家族の夕食は中止になりませんでした。']
],
'V11-NH-G1-U10-2-013':[
['I lent my umbrella to a student and later received a thank-you note.','私は生徒に傘を貸し、後でお礼のメモを受け取りました。'],
['It started to rain when school finished.','学校が終わったとき、雨が降り始めました。'],
['I had an umbrella, but another student did not.','私は傘を持っていましたが、別の生徒は持っていませんでした。'],
['The student looked outside and waited by the door.','その生徒は外を見て、ドアのそばで待っていました。'],
['I lived near school, so I gave my umbrella to the student.','私は学校の近くに住んでいたので、その生徒に傘を渡しました。'],
['I ran home in the light rain.','私は小雨の中を走って家に帰りました。'],
['The next morning, the student gave the umbrella back.','次の朝、その生徒は傘を返してくれました。'],
['There was a small note with it.','それといっしょに小さなメモがありました。'],
['The note said thank you and made me smile.','そのメモにはありがとうと書いてあり、私は笑顔になりました。'],
['I was glad that one umbrella could help someone.','一本の傘でだれかを助けられて、私はうれしかったです。']
],
'V11-SS-G1-P10-2-014':[
['Our garden team saw dry soil and changed the watering plan.','園芸チームは土が乾いているのを見て、水やりの計画を変えました。'],
['We visited the school garden early in the morning.','私たちは朝早く学校の庭を見に行きました。'],
['The plants looked weak, and the soil was very dry.','植物は弱って見え、土はとても乾いていました。'],
['We touched the soil and talked about the water.','私たちは土に触れ、水について話しました。'],
['Our old plan gave the garden water only later in the day.','前の計画では、その日のもっと遅い時間にだけ庭へ水をやっていました。'],
['We decided to give some water in the morning too.','私たちは朝にも水をやることにしました。'],
['Two students brought water while I checked the plants.','二人の生徒が水を運ぶ間、私は植物を確認しました。'],
['We gave each plant enough water and waited.','私たちはそれぞれの植物に十分な水をやり、待ちました。'],
['After a few days, the garden looked much better.','数日後、庭はずっとよく見えました。'],
['Our team wrote the new watering plan on paper.','チームは新しい水やり計画を紙に書きました。'],
['We kept checking the soil every morning.','私たちは毎朝、土を確認し続けました。'],
['The dry soil taught us to look at the garden before following a plan.','乾いた土から、計画どおりにする前に庭を見ることを学びました。']
],
'V11-NH-G1-U10-2-014':[
['A bus was late, so I called home and waited at the station.','バスが遅れたので、私は家に電話して駅で待ちました。'],
['I arrived at the station after school.','私は放課後、駅に着きました。'],
['The bus usually came soon, but it did not come that day.','バスはふつうすぐ来ましたが、その日は来ませんでした。'],
['I looked at the time and waited with other people.','私は時刻を見て、ほかの人たちと待ちました。'],
['After some time, I knew I would get home late.','しばらくして、家に着くのが遅くなると分かりました。'],
['I called home and told my family about the bus.','私は家に電話し、家族にバスのことを伝えました。'],
['My family said it was all right and told me to wait safely.','家族は大丈夫だと言い、安全に待つよう言いました。'],
['I stayed near the station and read a book.','私は駅の近くにいて、本を読みました。'],
['At last, the bus came and everyone got on.','ついにバスが来て、みんな乗りました。'],
['I got home late, but my family was not worried.','私は遅く家に着きましたが、家族は心配していませんでした。']
],
'V11-SS-G1-P10-2-015':[
['Our class cleaned a local park and sorted the trash we collected.','クラスで近くの公園を掃除し、集めたごみを分けました。'],
['We went to the park together in the morning.','私たちは朝、いっしょに公園へ行きました。'],
['At first, the park looked clean from far away.','最初、遠くから見ると公園はきれいに見えました。'],
['When we walked around, we found trash near the trees and seats.','歩き回ると、木やいすの近くにごみを見つけました。'],
['We picked it up and put it into different bags.','私たちはそれを拾い、別々の袋に入れました。'],
['Some students worked near the road, and others worked by the grass.','何人かの生徒は道の近くで、ほかの生徒は草のそばで作業しました。'],
['I collected paper and small plastic things.','私は紙や小さなプラスチックの物を集めました。'],
['After an hour, our bags were full.','一時間後、私たちの袋はいっぱいになりました。'],
['We sorted the trash before we left the park.','公園を出る前に、私たちはごみを分けました。'],
['The park looked better, and our class felt proud.','公園はよりきれいに見え、クラスのみんなは誇らしく感じました。']
],
'V11-NH-G1-U10-2-015':[
['I forgot my notebook, borrowed paper, and rewrote my notes at home.','私はノートを忘れ、紙を借り、家でノートを書き直しました。'],
['I found the problem when class started.','授業が始まったとき、私は問題に気づきました。'],
['My notebook was not in my school bag.','私のノートは学校のかばんにありませんでした。'],
['I looked again, but I knew I had left it at home.','もう一度見ましたが、家に置いてきたと分かりました。'],
['A friend gave me some paper for the class.','友達が授業のために紙をくれました。'],
['I listened carefully and wrote the important points on it.','私は注意して聞き、大切な点をその紙に書きました。'],
['After school, I took the paper home.','放課後、私はその紙を家に持ち帰りました。'],
['I found my notebook on my desk.','机の上に自分のノートを見つけました。'],
['Then I rewrote all my notes in the notebook.','それからノートにすべてのメモを書き直しました。'],
['Now I check my bag before I leave home each morning.','今では毎朝、家を出る前にかばんを確認します。']
],
'V11-SS-G1-P10-2-016':[
['My friends planned a birthday surprise and kept it secret until the right time.','友達は誕生日のサプライズを計画し、よい時まで秘密にしました。'],
['The birthday was on a school day.','その誕生日は学校のある日でした。'],
['We wanted to do something small after class.','私たちは授業のあとに小さなことをしたいと思いました。'],
['One friend brought a card, and another friend brought a little gift.','一人の友達はカードを、別の友達は小さな贈り物を持ってきました。'],
['We put them in a place where the birthday student could not see them.','私たちは誕生日の生徒に見えない場所にそれらを置きました。'],
['During the day, nobody talked about the surprise.','その日、だれもサプライズについて話しませんでした。'],
['After the last class, we asked the student to wait.','最後の授業のあと、私たちはその生徒に待つよう頼みました。'],
['Then we gave the card and gift together.','それからカードと贈り物をいっしょに渡しました。'],
['The student was very surprised and happy.','その生徒はとても驚き、うれしそうでした。'],
['We were happy because we kept the secret until the right time.','よい時まで秘密を守れたので、私たちもうれしかったです。'],
['Later, we all talked and laughed together.','そのあと、みんなで話して笑いました。'],
['It became a birthday memory for our group.','それは私たちのグループの誕生日の思い出になりました。']
],
'V11-NH-G1-U10-2-016':[
['Our pet ran into the yard, but we found it near the gate.','ペットが庭へ走って行きましたが、門の近くで見つけました。'],
['The door was open for a short time in the morning.','朝、ドアが少しの間開いていました。'],
['Our pet saw the yard and ran outside.','ペットは庭を見て、外へ走りました。'],
['I called its name, but it did not come back.','私は名前を呼びましたが、戻ってきませんでした。'],
['My family looked behind the house and near the trees.','家族は家の後ろや木の近くを探しました。'],
['I walked slowly around the yard and listened.','私は庭をゆっくり歩き回り、耳をすませました。'],
['Then I heard a small sound near the gate.','すると門の近くで小さな音が聞こえました。'],
['Our pet was there and looked at me.','ペットはそこにいて、私を見ました。'],
['I picked it up and carried it inside.','私はそれを抱き上げ、家の中へ運びました。'],
['After that, we checked the door more carefully.','そのあと、私たちはドアをもっと注意して確認しました。']
],
'V11-SS-G1-P10-2-017':[
['I chose a small part in the play and practiced it carefully.','私は劇で小さな役を選び、ていねいに練習しました。'],
['At first, I wanted a bigger part in the play.','最初、私は劇でもっと大きな役がほしかったです。'],
['Then I read the small part and liked the words.','それから小さな役を読み、その言葉が気に入りました。'],
['I decided that this part was right for me.','この役が自分に合っていると決めました。'],
['Every day, I practiced the lines after school.','毎日、私は放課後にせりふを練習しました。'],
['I spoke slowly first and then tried to speak more clearly.','最初はゆっくり話し、それからもっとはっきり話すようにしました。'],
['A friend listened and helped me with one line.','友達が聞いて、一つのせりふを手伝ってくれました。'],
['On the day of the play, I was a little nervous.','劇の日、私は少し緊張しました。'],
['When my turn came, I remembered all the words.','自分の番が来たとき、私はすべての言葉を覚えていました。'],
['The part was small, but I was happy with my work.','役は小さかったですが、自分の取り組みに満足しました。']
],
'V11-NH-G1-U10-2-017':[
['My cooking failed once, but I read the directions again and succeeded.','料理は一度失敗しましたが、説明をもう一度読んで成功しました。'],
['I wanted to make a simple dinner by myself.','私は一人で簡単な夕食を作りたいと思いました。'],
['I read the directions quickly and started cooking.','私は説明を急いで読み、料理を始めました。'],
['Soon I saw that something was wrong.','すぐに何かがおかしいと気づきました。'],
['I had used too much of one thing.','私は一つのものを使いすぎていました。'],
['The food did not look good, so I stopped.','食べ物はよく見えなかったので、私はやめました。'],
['I read the directions again from the first line.','私は最初の行から説明をもう一度読みました。'],
['This time, I followed each step slowly.','今度は、一つ一つの手順をゆっくり進めました。'],
['The second dinner looked and smelled much better.','二回目の夕食は見た目もにおいもずっとよくなりました。'],
['I ate it with my family and felt happy.','私は家族とそれを食べ、うれしく感じました。']
],
'V11-NH-G1-U10-2-018':[
['Two students disagreed about a poster and then combined both ideas.','二人の生徒はポスターについて意見が合いませんでしたが、その後二つの考えを合わせました。'],
['They were making the poster for a school event.','二人は学校行事のためにポスターを作っていました。'],
['One student wanted a big picture in the middle.','一人の生徒は中央に大きな絵を入れたいと思いました。'],
['The other student wanted more words and information.','もう一人の生徒はもっと多くの言葉と情報を入れたいと思いました。'],
['At first, they both thought their own idea was better.','最初、二人とも自分の考えのほうがよいと思っていました。'],
['They stopped working and looked at the empty poster.','二人は作業を止め、空のポスターを見ました。'],
['Then one student said they could use both ideas.','すると一人が、両方の考えを使えると言いました。'],
['They put the big picture at the top and the information under it.','二人は大きな絵を上に置き、その下に情報を入れました。'],
['The finished poster was clear and interesting.','完成したポスターは分かりやすく、おもしろいものでした。'],
['Both students were happy because the poster showed both ideas.','ポスターに両方の考えが表れていたので、二人とも満足しました。'],
['They learned to listen before saying that one idea was best.','一つの考えがいちばんだと言う前に、相手の話を聞くことを学びました。'],
['The poster was better because they worked together.','二人が協力したので、そのポスターはよりよいものになりました。']
]
};
let rewritten=0;
for(const p of ps){
 const rows=R[p.id];
 if(!rows)continue;
 p.sentences=rows.map(r=>r[0]);
 p.fullTranslation=rows.map(r=>r[1]).join('');
 p.slashRows=rows.map(r=>({en:slash(r[0]),jp:r[1]}));
 p.wordCount=(p.sentences.join(' ').match(/[A-Za-z]+(?:['’][A-Za-z]+)?/g)||[]).length;
 p.questions=[];p.questionSetB=[];
 p.auditNote=String(p.auditNote||'').replace(/ Story-specific semantic rewrite is still pending\./g,'');
 p.auditNote+=' Story-specific semantic rewrite pass1 complete for this passage; event arc, translation, and slash rows were rewritten together.';
 p.semanticRewrite='PASS1_GRADE1_20260828';
 rewritten++;
}
window.V11_BATCH02_SEMANTIC_REWRITE_PASS1_STATE={version:'20260828-grade1',rewritten,pending:50-rewritten,registered:false};
if(rewritten!==17)throw new Error('semantic rewrite pass1 count '+rewritten);
})();