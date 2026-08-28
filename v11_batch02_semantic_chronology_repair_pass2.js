(function repairV11Batch02SemanticChronologyPass2(){
'use strict';
const ps=window.V11_BATCH02_DRAFT_PASSAGES;
if(!Array.isArray(ps)||ps.length!==50)throw new Error('Batch02 draft missing before semantic chronology repair pass2');
function slash(en){return en.replace(/, /g,', / ').replace(/\b(and|but|because|so|before|after|until|then|when)\b/gi,'/ $1');}
const M=new Map([
['It took more time, but we walked home without a problem.',['It took more time, but we walked home and had no problem.','時間はよりかかりましたが、私たちは家まで歩き、問題はありませんでした。']],
['I stopped near it and opened my notebook.',['I was near it and opened my notebook.','私はその近くにいて、ノートを開きました。']],
['We walked around and found trash near the trees and seats.',['We walked around and found trash in many places.','私たちは歩き回り、いろいろな場所でごみを見つけました。']],
['After that, we all talked and had fun together.',['After that, we all talked and had a good time together.','そのあと、みんなで話して楽しい時間を過ごしました。']],
['So we chose some important practice.',['So we chose some practice for that morning.','そこで私たちはその朝にする練習をいくつか選びました。']],
['My mother looked at the food and saw one problem.',['My mother looked at our dinner plan and saw one problem.','母は夕食の計画を見て、一つ問題に気づきました。']],
['One ingredient was not in the kitchen.',['One ingredient was not at home.','一つの材料が家にありませんでした。']],
['My father found another food. It worked well.',['My father found another ingredient. It worked well.','父は別の材料を見つけました。それはうまく使えました。']],
['I washed the vegetables while my family cooked.',['I helped my family with the dinner.','私は夕食づくりを家族といっしょに手伝いました。']],
['It started to rain when school finished.',['It started to rain after school.','放課後、雨が降り始めました。']],
['The student looked outside and waited by the door.',['The student looked outside and waited at school.','その生徒は外を見て、学校で待っていました。']],
['I lived near school, so I gave my umbrella to the student.',['I lived near school, so I lent my umbrella to the student.','私は学校の近くに住んでいたので、その生徒に傘を貸しました。']],
['The next morning, the student gave the umbrella back.',['The next morning, I got my umbrella back from the student.','次の朝、私はその生徒から傘を返してもらいました。']],
['The plants did not look good, and the soil was very dry.',['The garden did not look good, and the soil was very dry.','庭はよい状態に見えず、土はとても乾いていました。']],
['Two students had water. I looked at the plants.',['Two students had water. I looked at the garden.','二人の生徒が水を持ち、私は庭を見ました。']],
['We used enough water for each plant.',['We used enough water for the garden.','私たちは庭に十分な水を使いました。']],
['A friend gave me some paper for the class.',['A friend had some paper. I used it in class.','友達が紙を持っていました。私は授業でそれを使いました。']],
['I listened carefully and wrote the important points on it.',['I listened carefully and wrote my notes on it.','私は注意して聞き、その紙にメモを書きました。']],
['Now I check my bag before I leave home each morning.',['Now I look in my bag before I go to school each morning.','今では毎朝、学校へ行く前にかばんの中を見ます。']],
['One friend had a card, and another friend had a little gift.',['One friend had a card, and another friend had a small present.','一人の友達はカードを、別の友達は小さな贈り物を持っていました。']],
['Then the student got the card and gift from us.',['Then the student got the card and present from us.','それからその生徒は私たちからカードと贈り物を受け取りました。']],
['The door was open for a short time in the morning.',['The house was open for a short time in the morning.','朝、家の出入り口が少しの間開いていました。']],
['After that, we checked the door more carefully.',['After that, we looked at the house more carefully before our pet went outside.','そのあと、ペットが外へ行く前に、私たちは家の出入り口をもっと注意して見るようにしました。']],
['At first, each student liked only one idea.',['At first, each student liked only one plan for the poster.','最初、それぞれの生徒はポスターについて一つの案だけを気に入っていました。']],
['After that, they listened to each other before talking about an idea.',['After that, they listened to each other before they talked about the poster.','そのあと、ポスターについて話す前に、おたがいの話を聞きました。']],
['We had time to prepare because we were early.',['We were early, so we had time to prepare.','私たちは早かったので、準備する時間がありました。']],
['The dry soil showed us that we should look at the garden before we use a plan.',['Now we look at the garden before we use the watering plan.','今では水やり計画を使う前に庭を見ます。']],
['My family said it was all right and told me to wait safely.',['My family said, "It is all right. Please wait safely."','家族は「大丈夫。安全に待ってね」と言いました。']]
]);
let changed=0;
for(const p of ps){if(p.semanticRewrite!=='PASS1_GRADE1_20260828')continue;const rows=[];for(let i=0;i<p.sentences.length;i++){const en=p.sentences[i],hit=M.get(en);if(hit){rows.push({en:hit[0],jp:hit[1]});changed++;}else rows.push({en,jp:(p.slashRows&&p.slashRows[i]&&p.slashRows[i].jp)||''});}p.sentences=rows.map(r=>r.en);p.fullTranslation=rows.map(r=>r.jp).join('');p.slashRows=rows.map(r=>({en:slash(r.en),jp:r.jp}));p.wordCount=(p.sentences.join(' ').match(/[A-Za-z]+(?:['’][A-Za-z]+)?/g)||[]).length;p.auditNote+=' Grade1 chronology repair pass2 applied to remaining detected violations.';}
window.V11_BATCH02_SEMANTIC_CHRONOLOGY_REPAIR_PASS2_STATE={version:'20260828-grade1-r2',changed,registered:false};
})();