(function addV11Batch02RequiredNotes(){
'use strict';
const ps=window.V11_BATCH02_DRAFT_PASSAGES;
if(!Array.isArray(ps)||ps.length!==50)throw new Error('Batch02 draft missing before required-note repair');
const gloss={
 movie:'映画',theater:'劇場',interesting:'おもしろい',together:'いっしょに',trash:'ごみ',technology:'技術',talk:'話す',talked:'話した',box:'箱',think:'考える',hope:'願う',tired:'疲れた',sleepy:'眠い',life:'生活・人生',badge:'バッジ',album:'アルバム',contest:'コンクール',beat:'鼓動する',safe:'安全な',chorus:'合唱',water:'水',fold:'折る',
 compared:'比べた',step:'手順・段階',activity:'活動',chose:'選んだ',practiced:'練習した',visitor:'訪問者',used:'使った',photo:'写真',science:'科学',rain:'雨',picnic:'ピクニック',indoor:'屋内の',presentation:'発表',quietly:'静かに',museum:'博物館',drew:'描いた',exhibit:'展示物',lent:'貸した',garden:'庭',soil:'土',bus:'バス',sorted:'分けた',forgot:'忘れた',rewrote:'書き直した',surprise:'驚き・サプライズ',yard:'庭',gate:'門',failed:'失敗した',succeeded:'成功した',disagreed:'意見が合わなかった',combined:'組み合わせた',directions:'説明・道順',schedule:'予定',allowance:'おこづかい',focus:'重点',strange:'変な',checked:'確認した',safely:'安全に',fallen:'落ちた',seasonal:'季節の',taught:'教えた',reply:'返事',festival:'祭り・文化祭',booth:'出店',wallet:'財布',responsible:'責任のある',train:'電車',survey:'アンケート',menu:'メニュー',bicycle:'自転車',postponed:'延期した',weather:'天気',routines:'日課・決まり',noticed:'気づいた',object:'物・品物',goal:'ゴール',score:'得点する',recommendation:'おすすめ',led:'つながった',discuss:'話し合う',volunteer:'ボランティア',divided:'分けた',luggage:'荷物',thinking:'考えること',"receiver's":'受け取る人の',classroom:'教室',grew:'育った',poorly:'よくない状態で',until:'〜まで',canceled:'中止した',outdoor:'屋外の',indoors:'屋内で',interview:'インタビュー',assignment:'課題',timetable:'時刻表',misunderstanding:'思い違い',week:'週',failure:'失敗',
 changed:'変えた',lost:'なくした',part:'部分・役',card:'カード',borrowed:'借りた',arrived:'到着した',roads:'道（複数）',safer:'より安全な',road:'道',left:'出発した・残した',teammate:'チームメイト',missing:'足りない・なくなった',ingredient:'材料',received:'受け取った',note:'メモ',dry:'乾いた',watering:'水やり',plan:'計画',local:'地域の',collected:'集めた',planned:'計画した',kept:'保った',secret:'秘密',found:'見つけた',carefully:'注意深く',once:'一度',ideas:'考え（複数）',instead:'代わりに',photographed:'写真に撮った',simple:'簡単な',abroad:'海外',adult:'大人',review:'見直す',chart:'表・グラフ',solve:'解決する'
};
function norm(s){return String(s||'').replace(/[’]/g,"'").toLowerCase();}
function tokens(s){return new Set((norm(s).match(/[a-z]+(?:'[a-z]+)*/g)||[]));}
let added=0;
for(const p of ps){
 const body=tokens((p.sentences||[]).join(' '));
 p.notes=Array.isArray(p.notes)?p.notes:[];
 const have=new Set(p.notes.map(n=>norm(n&&n.english)));
 for(const [english,japanese] of Object.entries(gloss)){
  const key=norm(english);
  if(body.has(key)&&!have.has(key)){
   p.notes.push({english:key,japanese,kind:'unlearned_local_required',source:'v11 Batch02 story-specific local vocabulary chronology repair'});
   have.add(key);added++;
  }
 }
}
window.V11_BATCH02_REQUIRED_NOTES_REPAIR_STATE={version:'20260828-pass3-apostrophe-normalized',count:ps.length,added,registered:false};
})();