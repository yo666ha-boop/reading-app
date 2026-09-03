(function repairV11Batch02Length(){
'use strict';
const ps=window.V11_BATCH02_DRAFT_PASSAGES;if(!Array.isArray(ps)||ps.length!==50)throw new Error('Batch02 missing before length repair');
function slash(en){return en.replace(/, /g,', / ').replace(/\b(and|but|because|so|before|after|until|then|when|while)\b/gi,'/ $1');}
const X={
'V11-SS-G1-P10-2-012':[
['My sister asked what I had drawn when I came home.','家に帰ると、姉が何を描いたのかたずねました。'],['I showed her the page and told her why I liked that exhibit.','私はそのページを見せ、なぜその展示物が好きなのか話しました。']],
'V11-NH-G1-U10-2-012':[
['After practice, we walked home together.','練習のあと、私たちはいっしょに歩いて帰りました。'],['The tired teammate said the shorter practice had helped.','疲れていた仲間は、短い練習が助けになったと言いました。']],
'V11-SS-G1-P10-2-013':[
['My sister put the plates on the table.','姉は皿をテーブルに置きました。'],['We talked about the new taste while we ate.','食べながら、新しい味について話しました。']],
'V11-SS-G1-P10-2-014':[
['Each morning, one student checked the soil before class.','毎朝、一人の生徒が授業前に土を確認しました。'],['Another student wrote a short note about the garden.','別の生徒は庭について短いメモを書きました。'],['We compared the notes after one week.','一週間後、私たちはメモを比べました。'],['The new plan was easy for everyone to follow.','新しい計画はみんなが続けやすいものでした。']],
'V11-SS-G1-P10-2-015':[
['We put the bags of trash in one place.','私たちはごみの袋を一か所に置きました。'],['Before leaving, we looked around the park again.','帰る前に、私たちはもう一度公園を見回しました。']],
'V11-SS-G1-P10-2-016':[
['We waited quietly until the right time.','私たちはちょうどよい時まで静かに待ちました。']],
'V11-NH-G1-U10-2-017':[
['The second time, I followed each step slowly.','二回目は、それぞれの手順をゆっくり行いました。'],['My family tasted the food and smiled.','家族は料理を食べて笑顔になりました。']],
'V11-NH-G1-U10-2-018':[
['One student drew the main picture for the poster.','一人の生徒がポスターの中心の絵を描きました。'],['The other student chose the words and where to put them.','もう一人の生徒は言葉と置く場所を選びました。'],['They checked the finished poster together.','二人はいっしょに完成したポスターを確認しました。']],
'V11-SS-G2-P8-3-010':[
['On the way, the visitor asked one more question about the town.','途中で、その旅行者は町についてもう一つ質問しました。'],['I pointed out a small park beside the road.','私は道のそばの小さな公園を指しました。']],
'V11-NH-G2-U7-4-010':[
['Before lunch, each group checked the new meeting time.','昼食前、それぞれの班が新しい集合時刻を確認しました。'],['Our teacher also wrote the change on the class paper.','先生も変更をクラスの紙に書きました。']],
'V11-SS-G2-P8-3-011':[
['I kept the small box on my desk so I could see it every day.','毎日見えるように、小さな箱を机の上に置きました。']],
'V11-NH-G2-U7-4-011':[
['Before the second game, we watched one short part of the first game again.','二試合目の前に、最初の試合の短い部分をもう一度見ました。'],['We noticed that players often passed before looking around.','選手たちは周りを見る前にパスすることが多いと気づきました。'],['Our coach asked us to call each other’s names more clearly.','コーチはおたがいの名前をもっとはっきり呼ぶよう言いました。'],['During practice, we stopped after every few passes and talked.','練習中、数回パスするごとに止まって話しました。'],['That made us understand where each player wanted the ball.','そのことで、それぞれの選手がどこでボールをほしいのか分かりました。'],['In the second game, we made fewer rushed passes.','二試合目では、急いだパスが少なくなりました。'],['One player who had been quiet also began to call for the ball.','静かだった一人の選手もボールを呼ぶようになりました。'],['Near the end, our team made several passes before taking a shot.','終わり近く、私たちのチームはシュート前にいくつかパスをしました。'],['Even after the game, we kept the same focus for the next practice.','試合後も、次の練習で同じ重点を続けました。']],
'V11-SS-G2-P8-3-012':[
['We told a teacher what had happened before moving anything else.','ほかの物を動かす前に、何が起きたか先生に伝えました。'],['The teacher helped us choose a safer place for the box.','先生は箱を置くより安全な場所を選ぶのを手伝いました。']],
'V11-NH-G2-U7-4-012':[
['We also wrote the month under every picture.','それぞれの写真の下に月も書きました。'],['That made the order of the seasons easy to see.','それで季節の順番が見やすくなりました。']],
'V11-SS-G2-P8-3-013':[
['I asked the child to explain one rule back to me.','私はその子に一つのルールを私へ説明してもらいました。'],['That helped me see which part still needed practice.','そのことで、どの部分にまだ練習が必要か分かりました。']],
'V11-NH-G2-U7-4-013':[
['Before we left, we checked how long the short trip would take.','出発前に、その短い外出にどれくらい時間がかかるか確認しました。'],['My father prepared a place where my grandmother could rest.','父は祖母が休める場所を準備しました。'],['At the place, we first walked slowly around the short course.','その場所では、まず短いコースをゆっくり歩きました。'],['My grandmother stopped twice and talked with us while sitting.','祖母は二回止まり、座りながら私たちと話しました。'],['After lunch, we looked at the photos we had taken.','昼食後、撮った写真を見ました。'],['One picture showed everyone together, so we chose it as our favorite.','一枚には全員がいっしょに写っていたので、お気に入りに選びました。'],['We still had time to visit a small shop before going home.','帰る前に小さな店へ行く時間もありました。'],['Nobody felt that the shorter plan was too small.','短い計画では足りないと感じた人はいませんでした。'],['It gave us enough time to enjoy being together without hurrying.','急がずいっしょの時間を楽しむのに十分でした。']],
'V11-SS-G2-P8-3-014':[
['I used short sentences because I did not want my meaning to be unclear.','意味が分かりにくくならないよう、短い文を使いました。'],['I also checked the names of school activities before writing them.','学校の活動名も書く前に確認しました。']],
'V11-NH-G2-U7-4-014':[
['We made one example card and put it where visitors could see it.','見本のカードを一枚作り、来た人に見える場所へ置きました。'],['After that, people understood the new activity quickly.','そのあと、人々は新しい活動をすぐ理解しました。']],
'V11-SS-G2-P8-3-015':[
['I stayed near the desk until the worker finished checking the wallet.','店員が財布の確認を終えるまで、私はカウンターの近くにいました。'],['The person thanked both the worker and me before leaving.','その人は帰る前に店員と私の両方にお礼を言いました。'],['I did not need to know what was inside the wallet to help.','助けるために財布の中身を知る必要はありませんでした。']],
'V11-NH-G2-U7-4-015':[
['While waiting, we also checked the museum opening time.','待っている間、博物館の開館時刻も確認しました。'],['It was later than we had thought, so we knew we still had enough time.','思っていたより遅かったので、まだ十分時間があると分かりました。'],['We marked the best station exit on the map.','地図にいちばんよい駅の出口へ印をつけました。'],['One friend found a small park beside the walking route.','一人の友達が徒歩ルートのそばに小さな公園を見つけました。'],['We decided to stop there only if we arrived early.','早く着いた場合だけそこへ寄ることにしました。'],['On the train, we looked at the map one last time.','電車の中で地図を最後にもう一度見ました。'],['After getting off, nobody needed to stop and ask for directions.','降りたあと、だれも止まって道をたずねる必要がありませんでした。'],['We reached the entrance together and still had time before it opened.','いっしょに入口へ着き、開くまでまだ時間がありました。'],['The waiting time had become useful planning time.','待ち時間が役立つ計画時間になっていました。']],
'V11-SS-G2-P8-3-016':[
['We also checked how much food each choice would need.','それぞれの選択にどれくらい食べ物が必要かも確認しました。'],['That helped us make a plan without preparing too much.','そのことで、用意しすぎず計画できました。'],['After lunch, we asked the class about the new menu again.','昼食後、新しいメニューについてもう一度クラスにたずねました。']],
'V11-NH-G2-U7-4-016':[
['I practiced once with the three notes before class started.','授業が始まる前に三枚のメモで一度練習しました。'],['That practice showed me that one note had too many words.','その練習で、一枚のメモには言葉が多すぎると分かりました。']],
'V11-SS-G2-P8-3-017':[
['My friend agreed that changing the day was better than taking a risk.','友達も、危険をおかすより日を変えるほうがよいと賛成しました。'],['We chose a new day before we went to the park.','公園へ行く前に新しい日を選びました。'],['The next time, I checked both tires before my friend arrived.','次回は友達が来る前に両方のタイヤを確認しました。'],['The bicycle worked well, and we completed the long ride safely.','自転車は問題なく動き、長い外出を安全に終えました。']],
'V11-NH-G2-U7-4-017':[
['We also talked about where we could stay dry if the rain became strong.','雨が強くなった場合どこでぬれずにいられるかも話しました。'],['One friend found a building near the middle of our route.','一人の友達がルートの中ほどに建物を見つけました。'],['We marked that place on the map before leaving.','出発前にその場所を地図へ印しました。'],['In the morning, the sky was clear and the trip began normally.','午前中は空が晴れ、外出は普通に始まりました。'],['After lunch, dark clouds appeared from the west.','昼食後、西から暗い雲が出てきました。'],['We remembered the report and did not wait for heavy rain.','予報を思い出し、強い雨になるまで待ちませんでした。'],['We walked toward the building we had marked.','印をつけた建物へ向かって歩きました。'],['The rain started just before we reached it.','着く少し前に雨が降り始めました。'],['We stayed there for a short time and continued when the rain became light.','少しそこにいて、雨が弱くなってから続けました。']],
'V11-NH-G2-U7-4-018':[
['My grandfather showed me another photo from a different year.','祖父は別の年の写真も見せてくれました。'],['It helped me understand that the street had changed little by little.','通りが少しずつ変わったことを理解する助けになりました。']]
};
let added=0,trimmed=0;for(const p of ps){const rows=X[p.id]||[];if(rows.length){for(const [en,jp] of rows){p.sentences.push(en);p.slashRows.push({en:slash(en),jp});p.fullTranslation+=jp;added++;}}const hi=Number((p.targetWordBand||[])[1]);while(p.grade==='3'&&p.wordCount>hi&&p.sentences.length>10){p.sentences.pop();p.slashRows.pop();trimmed++;p.fullTranslation=p.slashRows.map(r=>r.jp).join('');p.wordCount=(p.sentences.join(' ').match(/[A-Za-z]+(?:['’][A-Za-z]+)?/g)||[]).length;}p.wordCount=(p.sentences.join(' ').match(/[A-Za-z]+(?:['’][A-Za-z]+)?/g)||[]).length;}
window.V11_BATCH02_LENGTH_REPAIR_STATE={version:'20260828-r1',added,trimmed,count:ps.length,registered:false};
})();