'use strict';
const fs=require('fs');

const PARTS=[1,2,3,4].map(n=>`v11_batch14_g3_body_draft_part${n}.json`);
const targetFiles=['V11_BATCH14_G3_MISSING_VOCAB_WORDS.txt','V11_BATCH14_G3_FUTURE_VOCAB_WORDS.txt'];
const targets=new Set(targetFiles.flatMap(f=>fs.existsSync(f)?fs.readFileSync(f,'utf8').split(/\r?\n/).map(x=>x.trim().toLowerCase()).filter(Boolean):[]));

// Formal Japanese glosses for the current Batch14 G3 chronology leaks.
// This map is intentionally reusable: each run applies only entries still present in the current target reports.
const glossText=`
accepting|受け入れること
accounts|説明・記録
accurate|正確な
across|～を横切って・～の向こう側に
activity|活動
actual|実際の
adopted|採用された
advice|助言
affect|影響を与える
afternoon|午後
afterward|その後
ahead|前方に・先に
akira|アキラ（人名）
allowed|許された
although|～だけれども
area|地域・区域
arguments|議論・主張
arrival|到着
arrivals|到着
article|記事
assumed|想定した・思い込んだ
assuming|想定すること
assumptions|想定・思い込み
attention|注意
attracted|引きつけた
audience|観客・聴衆
audio|音声
automatic|自動の
available|利用できる
avoid|避ける
berry|ベリー・木の実
beside|～のそばに
bicycle|自転車
bicycles|自転車
bilingual|二言語の
birds|鳥
blankets|毛布
blocked|ふさがれた・通れなくなった
board|掲示板・板
bridge|橋
bus|バス
bushes|茂み
c|C（記号）
cabinets|戸棚
calculated|計算した
camera|カメラ
capacity|収容力・容量
caption|説明文・見出し
certainty|確実さ
check|確認する
checked|確認した
chose|選んだ
claim|主張・主張する
classroom|教室
closely|注意深く
closure|閉鎖・通行止め
cloudy|曇りの
combine|組み合わせる
committee|委員会
community|地域社会
comparable|比較できる・同程度の
compare|比べる
compared|比べた
comparing|比べること
competing|競い合う・競合する
complete|完全な・完成させる
completed|完成した
conclude|結論を出す
conditioning|調整・空調
conditions|条件・状況
confident|自信のある
confirmed|確認された・確認した
considered|検討した・考えた
construction|工事・建設
contain|含む
context|文脈・状況
continuity|連続性
continuous|連続した
cool|涼しい・冷やす
cooler|より涼しい・保冷容器
correct|正しい
correctly|正しく
cost|費用・費用がかかる
count|数える・数
counted|数えた
counting|数えること
counts|数・数える
cropped|切り取られた
cropping|切り取ること
crossed|横切った・線で消した
curb|縁石
current|現在の
damp|湿った
date|日付・期限
dates|日付・期限
deep|深い
delayed|遅れた・延期された
delete|削除する
deleting|削除すること
demonstrations|実演
departures|出発
 depth|深さ
describe|説明する
described|説明した
detail|詳細
differ|異なる
difference|違い
differences|違い
differently|異なる方法で
directly|直接に
distance|距離
distributed|配布した・分配された
divided|分けられた
donations|寄付品・寄付
downstairs|階下に
draft|下書き
dramatic|劇的な・大きな
drop|落ちる・低下
dry|乾いた
east|東
editors|編集者
educator|教育担当者・教育者
eight|8・八
eighteen|18・十八
eighty|80・八十
emergencies|緊急事態
emergency|緊急時・非常用の
empty|空の
entrance|入口
entry|入口・記入・参加
equal|等しい
equally|等しく
equipment|設備・器具
evacuation|避難
evacuees|避難者
event|行事・出来事
everyone|全員
evidence|根拠・証拠
exhibit|展示物・展示する
exhibits|展示物
expect|予想する・期待する
expectation|予想・期待
expected|予想された・期待された
explanations|説明
extra|追加の
extreme|極端な・非常に厳しい
factors|要因
faded|色あせた
failed|失敗した
fairly|公平に・かなり
false|誤った・偽の
falsely|誤って・偽って
file|ファイル・記録
fill|満たす・埋める
final|最終の
fit|合う・適合する
five|5・五
fixed|固定した・修理した
flag|旗・印
forecast|予報
forty|40・四十
four|4・四
frame|枠・フレーム
freezer|冷凍庫
function|機能・働き
gallery|展示室・ギャラリー
gap|すき間・差
garden|庭・花壇
gardeners|園芸をする人・庭師
gate|門・ゲート
grew|育った・増えた
grown|育った・成長した
growth|成長
guessing|推測すること
hall|ホール・広間
hana|ハナ（人名）
headline|見出し
healthy|健康な・健全な
height|高さ
homerooms|ホームルーム・学級
hourly|1時間ごとの
hundred|100・百
hygiene|衛生
identical|同一の
identification|識別・特定
identified|特定した・見分けた
identity|正体・同一性
immediate|すぐの・差し迫った
immediately|すぐに
impossible|不可能な
incident|出来事・事故
included|含まれていた・含めた
incomplete|不完全な
individual|個々の・個人
inspection|点検
instruction|指示
instructions|指示
intentional|意図的な
junior|年下の・中学生の
leaders|責任者・リーダー
legs|脚・区間
lengths|長さ
location|場所
locked|鍵が掛かった
log|記録・記録表
loose|緩い
main|主な
map|地図
marked|印を付けた・表示された
mats|マット・敷物
mattered|重要だった
meals|食事
measurements|測定値
media|メディア・報道
mentioned|述べた・言及した
midori|みどり（固有名）
mika|ミカ（人名）
model|模型・モデル
battery|電池・バッテリー
damage|損傷・被害
damaged|損傷した・壊れた
group|グループ・集団
lamps|ランプ・照明
memory|記憶
race|競走・レース
several|いくつかの
water|水
whole|全体の・全部の
wind|風
`;
const gloss=new Map();
for(const raw of glossText.trim().split(/\n/)){
  const line=raw.trim(); if(!line)continue;
  const i=line.indexOf('|'); if(i<1)throw Error('bad gloss row: '+line);
  const en=line.slice(0,i).trim().toLowerCase(), jp=line.slice(i+1).trim();
  if(!jp||/[A-Za-z]{3}/.test(jp))throw Error('invalid Japanese gloss: '+en+'='+jp);
  gloss.set(en,jp);
}

function tokens(s){return new Set((String(s||'').replace(/[’]/g,"'").match(/[A-Za-z]+(?:'[A-Za-z]+)*/g)||[]).map(x=>x.toLowerCase()));}
let passages=0,added=0,coveredTargets=new Set();
for(const file of PARTS){
  const doc=JSON.parse(fs.readFileSync(file,'utf8'));
  if(doc.registered!==false||doc.officialTotal!==818||!Array.isArray(doc.passages))throw Error('G3 part invariant '+file);
  let changed=false;
  for(const p of doc.passages){
    passages++;
    const bodyWords=tokens(p.body);
    p.notes=Array.isArray(p.notes)?p.notes:[];
    const existing=new Set(p.notes.filter(n=>n&&n.kind==='unlearned_local_required').flatMap(n=>[...tokens(n.english)]));
    for(const w of targets){
      if(!bodyWords.has(w)||existing.has(w)||!gloss.has(w))continue;
      p.notes.push({kind:'unlearned_local_required',english:w,japanese:gloss.get(w),scope:'passage-only-unlearned',basis:'Batch14 G3 chronology repair: retained because the word is necessary for the passage meaning; formal Japanese gloss supplied locally.'});
      existing.add(w); coveredTargets.add(w); added++; changed=true;
    }
    if(changed)p.vocabNoteRepair='B14_G3_REQUIRED_LOCAL_GLOSS_REPAIR_R1';
  }
  if(changed)fs.writeFileSync(file,JSON.stringify(doc,null,2)+'\n');
}
const mappedTargets=[...targets].filter(w=>gloss.has(w));
const stillUnmapped=[...targets].filter(w=>!gloss.has(w));
console.log(JSON.stringify({passages,targetWords:targets.size,glossDefinitions:gloss.size,mappedCurrentTargets:mappedTargets.length,notesAdded:added,coveredTargetWords:coveredTargets.size,stillUnmappedCount:stillUnmapped.length,stillUnmapped:stillUnmapped.slice(0,80)},null,2));
if(!added&&mappedTargets.length&&stillUnmapped.length===targets.size)throw Error('vocab note repair made no progress');
