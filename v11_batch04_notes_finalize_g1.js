(function finalizeV11Batch04Grade1Notes(){
'use strict';
const gloss={
'almost':'ほとんど','answer':'答え','answered':'答えた','beside':'〜のそばに','better':'よりよい','checked':'確認した','checking':'確認すること','completely':'完全に','correct':'正しい','giving':'与えること','quickly':'すばやく','thought':'思った','wall':'壁',
'easy':'簡単な','follow':'従う','found':'見つけた','order':'順番','phone':'電話','pointed':'指し示した','press':'押す','price':'値段','repeated':'繰り返した','shown':'示された','stood':'立っていた','understood':'理解した','visitor':'訪問者',
'arrived':'到着した','corrected':'訂正した','event':'行事','fix':'直す','heard':'聞いた','information':'情報','item':'項目','list':'一覧','noisy':'騒がしい','parts':'部分','pieces':'いくつかの部分','slowly':'ゆっくり','using':'使って','wrong':'間違った',
'above':'上に','belonged':'属していた','door':'ドア','find':'見つける','finished':'終えた','leader':'リーダー','noticed':'気づいた','put':'置いた','returned':'戻った','saved':'保存した','searching':'探して','several':'いくつかの','shelf':'棚','space':'場所・空間','whole':'全体の',
'change':'変える・変化','changing':'変えている','easier':'より簡単な','idea':'考え','moved':'動かした・移動した','partner':'相手','photo':'写真','photos':'写真','project':'課題','repeating':'繰り返して','solved':'解決した','used':'使った',
'answering':'答えて','begin':'始める','early':'早く','real':'本当の','safer':'より安全な','send':'送る','toward':'〜の方へ','usual':'いつもの','already':'すでに','away':'離れて','choice':'選択','empty':'空の','enjoyable':'楽しい','enough':'十分な','forgot':'忘れた','kept':'保った・持ち続けた','nearby':'近くの','picnic':'ピクニック','sheet':'用紙','simple':'簡単な','soon':'すぐに',
'avoid':'避ける','began':'始めた','clear':'はっきりした','laughed':'笑った','line':'線','lines':'線','match':'合う','part':'部分','point':'点・要点','similar':'似ている','house':'家','immediately':'すぐに','leave':'去る','note':'メモ','yet':'まだ',
'became':'〜になった','called':'呼んだ','card':'カード','desk':'机','keep':'保つ','left':'残した・置いていった','paper':'紙','return':'返す','stop':'止まる・停留所','without':'〜なしで','bus':'バス','check':'確認する','lost':'なくした','message':'メッセージ','remembered':'思い出した','sports':'スポーツ','stops':'停留所','trusting':'信頼して','waiting':'待って',
'added':'加えた','arrows':'矢印','art':'美術','building':'建物','clearer':'より分かりやすい','drew':'描いた','end':'終わり','explanation':'説明','gave':'与えた','hall':'ホール','minutes':'分','piece':'一片・部分','remember':'覚えている','chose':'選んだ','color':'色','details':'詳細','different':'異なる','mistake':'間違い','noodles':'麺','packages':'包み','picked':'選んだ','shopping':'買い物','store':'店',
'borrowed':'借りた','evening':'夕方','morning':'朝','passed':'渡した・通過した','plan':'計画','week':'週','calm':'落ち着いた','decided':'決めた','fall':'降る・落ちる','gray':'灰色の','halfway':'途中で','instead':'代わりに','lighter':'より明るい','rain':'雨','raining':'雨が降っている','shoes':'靴','sky':'空','together':'一緒に','umbrella':'傘','waited':'待った','wet':'ぬれた',
'brought':'持ってきた','cards':'カード','everyone':'みんな','explain':'説明する','explained':'説明した','learn':'学ぶ','minute':'分','move':'動く','none':'1つもない','practice':'練習','rules':'ルール','started':'始めた','stopped':'止まった','clock':'時計','fine':'大丈夫な','forget':'忘れる','later':'後で','talk':'話す',
'reading':'読むこと','nighttime':'夜','festival':'祭り','port':'港','mud':'泥','divided':'分けられた','protect':'守る','local people':'地元の人々','swallowed':'飲み込んだ','smell':'におい','further':'さらに遠く','leaf':'葉','flood':'洪水','filtered':'ろ過した','insects':'昆虫','sealed':'密閉した','threatened':'おびやかした'
};
const grade1=[...(window.V11_BATCH04_G1_PASSAGES||[])];
let replaced=0,unresolved=[];
for(const p of grade1){
 p.notes=Array.isArray(p.notes)?p.notes:[];
 for(const n of p.notes){
  if(!n||!n.english||!String(n.japanese||'').includes('最終注整理対象'))continue;
  const key=String(n.english).replace(/[’]/g,"'").toLowerCase();
  if(gloss[key]){n.japanese=gloss[key];n.source='v11 Batch04 grade1 final context gloss 20260828';replaced++;}
  else unresolved.push({id:p.id,english:n.english});
 }
}
window.V11_BATCH04_G1_NOTE_FINALIZE_STATE={version:'20260828-g1-final',passages:grade1.length,replaced,unresolved,ready:grade1.length===17&&unresolved.length===0};
})();
