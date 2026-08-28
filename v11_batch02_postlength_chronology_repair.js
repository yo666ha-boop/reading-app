(function repairV11Batch02PostLengthChronology(){
'use strict';
const ps=window.V11_BATCH02_DRAFT_PASSAGES;
if(!Array.isArray(ps)||ps.length!==50)throw new Error('Batch02 missing before post-length chronology repair');
function slash(en){return en.replace(/, /g,', / ').replace(/\b(and|but|because|so|before|after|until|then|when|while)\b/gi,'/ $1');}
const replacements=new Map([
 ['My sister asked what I had drawn when I came home.',['I came home and showed my drawing to my sister.','私は家に帰り、自分の絵を姉に見せました。']],
 ['I showed her the page and told her why I liked that exhibit.',['I showed her the page and talked about the exhibit.','私はそのページを見せ、その展示物について話しました。']],
 ['We talked about the new taste while we ate.',['We ate together and talked about the new taste.','私たちはいっしょに食べ、新しい味について話しました。']],
 ['The other student chose the words and where to put them.',['The other student chose the words and their place on the poster.','もう一人の生徒は言葉とポスター上の位置を選びました。']],
 ["Our coach asked us to call each other’s names more clearly.",["Our coach said, 'Use each other’s names more clearly.'",'コーチは「おたがいの名前をもっとはっきり使おう」と言いました。']],
 ['That made us understand where each player wanted the ball.',['Then we understood the best place for each player to get the ball.','それから、それぞれの選手がボールを受けるのによい場所が分かりました。']],
 ['It gave us enough time to enjoy being together without hurrying.',['We had enough time, and we enjoyed being together without hurrying.','私たちには十分な時間があり、急がずいっしょに過ごすことを楽しみました。']],
 ['I used short sentences because I did not want my meaning to be unclear.',['I used short sentences. I wanted my meaning to be clear.','私は短い文を使いました。意味を分かりやすくしたかったからです。']]
]);
const gloss={
 drawn:'描いた',drew:'描いた',page:'ページ',drawing:'絵',plates:'皿（複数）',morning:'朝',checked:'確認した',note:'メモ',compared:'比べた',week:'週',everyone:'みんな',quietly:'静かに',desk:'机',ball:'ボール',passed:'パスした',quiet:'静かな',rushed:'急いだ',shot:'シュート',practice:'練習',hurrying:'急ぐこと',nobody:'だれも〜ない',without:'〜なしで',activities:'活動（複数）',unclear:'分かりにくい',used:'使った',checking:'確認すること',beside:'〜のそばに',entrance:'入口',exit:'出口',marked:'印をつけた',chose:'選んだ',completed:'終えた',risk:'危険',safely:'安全に',tires:'タイヤ（複数）',dry:'ぬれない・乾いた',normally:'ふつうに',route:'道順',strong:'強い',west:'西',table:'テーブル',taste:'味',easy:'簡単な',follow:'続ける・従う',leaving:'出発すること',waited:'待った',followed:'従った',slowly:'ゆっくり',tasted:'味見した',finished:'終えた',main:'中心の',put:'置く',part:'部分',explain:'説明する',enough:'十分な',prepared:'準備した',sitting:'座っていること',twice:'二回',choice:'選択',changing:'変えること',middle:'中ほど',reached:'着いた',toward:'〜の方へ',place:'場所',clearly:'はっきり',best:'いちばんよい',player:'選手',players:'選手たち'
};
let changed=0,added=0;
for(const p of ps){
 const rows=[];
 for(let i=0;i<(p.sentences||[]).length;i++){
  const en=p.sentences[i], hit=replacements.get(en);
  if(hit){rows.push({en:hit[0],jp:hit[1]});changed++;}
  else rows.push({en,jp:(p.slashRows&&p.slashRows[i]&&p.slashRows[i].jp)||''});
 }
 p.sentences=rows.map(r=>r.en);p.slashRows=rows.map(r=>({en:slash(r.en),jp:r.jp}));p.fullTranslation=rows.map(r=>r.jp).join('');p.wordCount=(p.sentences.join(' ').match(/[A-Za-z]+(?:['’][A-Za-z]+)?/g)||[]).length;
 const body=new Set((p.sentences.join(' ').replace(/[’]/g,"'").toLowerCase().match(/[a-z]+(?:'[a-z]+)*/g)||[]));p.notes=Array.isArray(p.notes)?p.notes:[];const have=new Set(p.notes.map(n=>String(n&&n.english||'').replace(/[’]/g,"'").toLowerCase()));
 for(const [english,japanese] of Object.entries(gloss)){if(body.has(english)&&!have.has(english)){p.notes.push({english,japanese,kind:'unlearned_local_required',source:'v11 Batch02 post-length chronology repair'});have.add(english);added++;}}
 p.auditNote=String(p.auditNote||'')+' Post-length chronology repair applied after word-count expansion.';
}
window.V11_BATCH02_POSTLENGTH_CHRONOLOGY_REPAIR_STATE={version:'20260828-r2',count:ps.length,changed,notesAdded:added,registered:false};
})();