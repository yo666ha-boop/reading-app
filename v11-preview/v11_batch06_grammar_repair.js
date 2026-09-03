(function repairV11Batch06Grammar(){
'use strict';
const ps=window.V11_BATCH06_PASSAGES||[];
function slash(en){return en.replace(/, /g,', / ').replace(/\b(and|but|because|so|before|after|until|then|when|while|although|if)\b/gi,'/ $1');}
function wc(rows){return (rows.join(' ').match(/[A-Za-z]+(?:['’][A-Za-z]+)?/g)||[]).length;}
const R=new Map([
['We asked a teacher if someone could take his place for a few minutes.',[['We asked a teacher, “Can someone take his place for a few minutes?”','私たちは先生に「数分間だれかが代われますか」とたずねました。']]],
['Taking turns kept the event running and gave him time to get warm.',[['Taking turns kept the event running and helped him get warm.','交代することで行事を続けながら、彼が体を温める助けにもなりました。']]],
['I stood up and told her that she could use my seat.',[['I stood up and said, “You can use my seat.”','私は立ち上がり、「この席を使ってください」と言いました。']]],
['The last photo was taken after school when the sun was low.',[['After school, I took the last photo under the low sun.','放課後、私は低い太陽の下で最後の写真を撮りました。']]],
['The next day, we could tell our lunch bags apart at once.',[['The next day, we found our own lunch bags at once.','次の日、私たちはすぐに自分の昼食バッグを見つけられました。']]],
['When I came back, the umbrella was not in that place.',[['I came back and saw that the umbrella was not in that place.','私は戻り、傘がその場所にないことに気づきました。']]],
['Aya told me that rain was coming through the window.',[['Aya said, “Rain was coming through the window.”','アヤは「窓から雨が入ってきていました」と言いました。']]],
['The other two had no match that weekend and could practice later.',[['The other two had no match that weekend and practiced later.','ほかの二人はその週末に試合がなく、あとで練習しました。']]],
['Everyone could see the cards in the middle of the table.',[['Everyone saw the cards in the middle of the table.','みんなが机の中央のカードを見ることができました。']]],
['Changing the whole plan a little worked better than adding one chair alone.',[['Changing the whole plan a little worked well, unlike adding one chair alone.','一脚だけ加えるのとは違い、全体を少し変えるとうまくいきました。']]],
['We were told to meet beside a long fence after lunch.',[['Our teacher said, “Meet beside the long fence after lunch.”','先生は「昼食後、長い柵のそばで集合してください」と言いました。']]],
['Two friends walked to the wrong end and could not see us.',[['Two friends walked to the wrong end and did not see us.','二人の友達が反対側の端へ行き、私たちが見えませんでした。']]],
['I called the two friends and told them to look for the ribbon.',[['I called the two friends and said, “Look for the ribbon.”','私は二人に電話し、「そのリボンを探して」と言いました。']]],
['He planned to remember that he should return it after class.',[['He wanted to remember the return after class.','彼は授業後に返すことを忘れたくありませんでした。']]],
['Remembering when the names were added solved the small mystery.',[['Remembering the time we added the names solved the small mystery.','名前を付けた時を思い出すことで、小さな謎が解けました。']]],
['The message did not say who should bring one or why.',[['The message did not say who needed a towel or why.','そのメッセージには、だれにタオルが必要なのか、またその理由も書かれていませんでした。']]],
['Three small clues told us why the box had been left by the door.',[['The three small clues showed the reason for the box by the door.','三つの小さな手がかりが、箱がドアのそばにあった理由を示しました。']]],
['She first heard about the event from two friends who had watched it from the school gate.',[['She first heard about the event from two friends.','彼女は最初、二人の友達からその行事について聞きました。'],['They had watched it from the school gate.','二人は校門からその行事を見ていました。']]],
['Before printing the article, she interviewed the student who had planned the route.',[['Before printing the article, she interviewed a student.','記事を印刷する前に、彼女は一人の生徒にインタビューしました。'],['That student had planned the route.','その生徒が道順を計画していました。']]],
['Her draft said that the runners had chosen the route because it was easy and flat.',[['Her draft said that the route was easy and flat, so the runners had chosen it.','下書きには、その道が簡単で平らなので走者たちが選んだと書きました。']]],
['She kept one sentence about the flat road, but made it clear that it was only another benefit.',[['She kept one sentence about the flat road, but clearly described it as only another benefit.','平らな道についての一文は残しましたが、それは別の利点にすぎないとはっきり説明しました。']]],
['Some students said the forecast had been wrong, but our teacher asked us to check the time carefully.',[['Some students said the forecast had been wrong.','予報が外れたと言う生徒もいました。'],['Our teacher said, “Check the time carefully.”','先生は「時刻をよく確認してください」と言いました。']]],
['Several students used the guide during the following week.',[['During the next week, several students found the guide useful.','翌週、何人もの生徒がその案内を役立つと感じました。']]],
['The words “on a cold day” may have made warm soup sound especially attractive.',[['The words “on a cold day” probably increased interest in warm soup.','「寒い日に」という言葉で温かいスープへの関心が高まった可能性があります。']]],
['The mixed piles also made it difficult to check the numbers afterward.',[['The mixed piles also caused problems during later checks.','硬貨が混じった山は、あとで確認するときにも問題になりました。']]],
['Most of us imagined that older people used the benches mainly in the morning.',[['Most of us imagined older people as the main morning visitors to the benches.','私たちの多くは、朝のベンチの主な利用者は年配の人だと考えていました。']]],
['After school, however, parents with small children and students used every bench.',[['After school, however, every bench had parents with small children and students.','しかし放課後には、すべてのベンチに小さな子ども連れの保護者や生徒がいました。']]],
['The first version had no pictures because we wanted to see whether the written instructions were clear by themselves.',[['We wanted to test the written instructions alone, so the first version had no pictures.','文章の指示だけで明確か試したかったので、最初の版には写真を入れませんでした。']]],
['The owner liked the shared plan because it served several groups and could be tested for three months.',[['The shared plan served several groups and had a three-month test period, so the owner liked it.','その共同案は複数の人々に役立ち、三か月の試行期間もあったので、所有者は気に入りました。']]]
]);
for(const p of ps){const rows=[];for(let i=0;i<p.sentences.length;i++){const en=p.sentences[i],jp=p.slashRows[i].jp;const rep=R.get(en);if(rep)rows.push(...rep);else rows.push([en,jp]);}p.sentences=rows.map(r=>r[0]);p.slashRows=rows.map(r=>({en:slash(r[0]),jp:r[1]}));p.fullTranslation=rows.map(r=>r[1]).join('');p.wordCount=wc(p.sentences);const qs=rows.slice(0,10).map((r,i)=>({prompt:`${i+1}. 本文の第${i+1}文の内容に合う英文を本文から一文答えなさい。`,answer:r[0],evidence:r[0],evidenceJp:r[1],reason:`第${i+1}文が直接の根拠です。`}));if(qs.length<10){const r=rows[rows.length-1];qs.push({prompt:'10. 本文全体の最後に示された結果・学びに合う英文を本文から一文答えなさい。',answer:r[0],evidence:r[0],evidenceJp:r[1],reason:'本文の最終文が結果・学びを直接示しています。'});}p.questions=qs.slice(0,5);p.questionSetB=qs.slice(5,10);p.grammarRepair='BATCH06_GRAMMAR_REPAIR_20260829';}
})();