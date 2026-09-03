(function addV11Batch02RequiredNotes(){
'use strict';
const ps=window.V11_BATCH02_DRAFT_PASSAGES;
if(!Array.isArray(ps)||ps.length!==50)throw new Error('Batch02 draft missing before required-note repair');
function slash(en){return en.replace(/, /g,', / ').replace(/\b(and|but|because|so|before|after|until|then|when)\b/gi,'/ $1');}
const cleanup=new Map([
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
let cleanupCount=0;
for(const p of ps){if(p.semanticRewrite!=='PASS1_GRADE1_20260828')continue;const rows=[];for(let i=0;i<p.sentences.length;i++){const en=p.sentences[i],hit=cleanup.get(en);if(hit){rows.push({en:hit[0],jp:hit[1]});cleanupCount++;}else rows.push({en,jp:(p.slashRows&&p.slashRows[i]&&p.slashRows[i].jp)||''});}p.sentences=rows.map(r=>r.en);p.fullTranslation=rows.map(r=>r.jp).join('');p.slashRows=rows.map(r=>({en:slash(r.en),jp:r.jp}));p.wordCount=(p.sentences.join(' ').match(/[A-Za-z]+(?:['’][A-Za-z]+)?/g)||[]).length;}
const gloss={
movie:'映画',theater:'劇場',interesting:'おもしろい',together:'いっしょに',trash:'ごみ',technology:'技術',talk:'話す',talked:'話した',box:'箱',think:'考える',hope:'願う',tired:'疲れた',sleepy:'眠い',life:'生活・人生',badge:'バッジ',album:'アルバム',contest:'コンクール',beat:'鼓動する',safe:'安全な',chorus:'合唱',water:'水',fold:'折る',
compared:'比べた',step:'手順・段階',activity:'活動',chose:'選んだ',practiced:'練習した',visitor:'訪問者',used:'使った',photo:'写真',science:'科学',rain:'雨',picnic:'ピクニック',indoor:'屋内の',presentation:'発表',quietly:'静かに',museum:'博物館',drew:'描いた',exhibit:'展示物',lent:'貸した',garden:'庭',soil:'土',bus:'バス',sorted:'分けた',forgot:'忘れた',rewrote:'書き直した',surprise:'驚き・サプライズ',yard:'庭',gate:'門',failed:'失敗した',succeeded:'成功した',disagreed:'意見が合わなかった',combined:'組み合わせた',directions:'説明・道順',schedule:'予定',allowance:'おこづかい',focus:'重点',strange:'変な',checked:'確認した',safely:'安全に',fallen:'落ちた',seasonal:'季節の',taught:'教えた',reply:'返事',festival:'祭り・文化祭',booth:'出店',wallet:'財布',responsible:'責任のある',train:'電車',survey:'アンケート',menu:'メニュー',bicycle:'自転車',postponed:'延期した',weather:'天気',routines:'日課・決まり',noticed:'気づいた',object:'物・品物',goal:'ゴール',score:'得点する',recommendation:'おすすめ',led:'つながった',discuss:'話し合う',volunteer:'ボランティア',divided:'分けた',luggage:'荷物',thinking:'考えること',"receiver's":'受け取る人の',classroom:'教室',grew:'育った',poorly:'よくない状態で',until:'〜まで',canceled:'中止した',outdoor:'屋外の',indoors:'屋内で',interview:'インタビュー',assignment:'課題',timetable:'時刻表',misunderstanding:'思い違い',week:'週',failure:'失敗',
changed:'変えた',lost:'なくした',part:'部分・役',card:'カード',borrowed:'借りた',arrived:'到着した',roads:'道（複数）',safer:'より安全な',road:'道',left:'出発した・残した',teammate:'チームメイト',missing:'足りない・なくなった',ingredient:'材料',received:'受け取った',note:'メモ',dry:'乾いた',watering:'水やり',plan:'計画',local:'地域の',collected:'集めた',planned:'計画した',kept:'保った',secret:'秘密',found:'見つけた',carefully:'注意深く',once:'一度',ideas:'考え（複数）',instead:'代わりに',photographed:'写真に撮った',simple:'簡単な',abroad:'海外',adult:'大人',review:'見直す',chart:'表・グラフ',solve:'解決する'
};
function norm(s){return String(s||'').replace(/[’]/g,"'").toLowerCase();}
function tokens(s){return new Set((norm(s).match(/[a-z]+(?:'[a-z]+)*/g)||[]));}
let added=0;
for(const p of ps){const body=tokens((p.sentences||[]).join(' '));p.notes=Array.isArray(p.notes)?p.notes:[];const have=new Set(p.notes.map(n=>norm(n&&n.english)));for(const [english,japanese] of Object.entries(gloss)){const key=norm(english);if(body.has(key)&&!have.has(key)){p.notes.push({english:key,japanese,kind:'unlearned_local_required',source:'v11 Batch02 story-specific local vocabulary chronology repair'});have.add(key);added++;}}}
window.V11_BATCH02_REQUIRED_NOTES_REPAIR_STATE={version:'20260828-pass4-grade1-cleanup',count:ps.length,added,cleanupCount,registered:false};
})();