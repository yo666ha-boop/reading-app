// Reference/minimum-rule slash audit passages 151-160.
(function(){
 const PASS='PASS_REFERENCE_20260820';
 function setAudit(data,section,rows,n){const p=data&&data[section];if(!p)throw new Error('Missing reference passage '+n+': '+section);if(rows.length!==(p.sentences||[]).length)throw new Error('Row mismatch '+n);for(let i=0;i<rows.length;i++){const e=String(rows[i].en||'').replace(/\s*\/\s*/g,' ').replace(/\s+/g,' ').trim(),s=String(p.sentences[i]||'').replace(/\s+/g,' ').trim();if(e!==s)throw new Error('English mismatch '+n+'#'+(i+1)+': '+e+' <> '+s);const ec=String(rows[i].en||'').split(/\s*\/\s*/).filter(Boolean).length,jc=String(rows[i].jp||'').split(/\s*\/\s*/).filter(Boolean).length;if(ec!==jc)throw new Error('EN/JP chunks '+n+'#'+(i+1)+' '+ec+'/'+jc)}p.slashRows=rows;p.slashReadingVersion='reference-book-minimum-rules-20260820';p.slashReferenceAudit=PASS;p.slashReferencePassageNo=n}
 const d=window.V10_PASSAGES_G3_NH||{};
 setAudit(d,'Unit 2-3',[
  {en:'Our class studies a clothing company / that wants / to reduce waste.',jp:'私たちのクラスは衣料会社について学びます / その会社は望んでいます / ごみを減らすことを'},
  {en:'The company collects old clothes / from customers.',jp:'その会社は古い服を集めます / 客から'},
  {en:'Workers separate material / that can be reused.',jp:'作業員は素材を分けます / 再利用できる'},
  {en:'Some wool / from old products is cleaned / and used again.',jp:'ウールの一部は / 古い製品からのきれいにされます / そしてもう一度使われます'},
  {en:'The company uses the reused material / in a new design.',jp:'会社は再利用した素材を使います / 新しいデザインに'},
  {en:'This reduces the amount / of new material needed / for one product.',jp:'これによって量が減ります / 必要な新しい素材の / 1つの製品に'},
  {en:'It also keeps useful material / from becoming waste.',jp:'それは役立つ素材を防ぎます / ごみになることから'},
  {en:'The company checks the quality / before selling the new product.',jp:'会社は品質を確認します / 新しい製品を売る前に'},
  {en:'Reusing material cannot solve every environmental problem.',jp:'素材の再利用だけですべての環境問題を解決することはできません。'},
  {en:'However, / it is one practical way / to reduce waste / in clothing production.',jp:'しかし / それは実際的な方法の1つです / ごみを減らすための / 衣料品の生産で'},
  {en:'I want / to learn how other companies reuse old material.',jp:'私は望んでいます / ほかの会社が古い素材をどう再利用しているか学ぶことを'}
 ],151);
 setAudit(d,'Unit 2-4',[
  {en:'Responsible clothing should be made / with respect / for both people / and the environment.',jp:'責任ある衣服は作られるべきです / 配慮をもって / 人の両方への / そして環境への'},
  {en:'First, / workers need fair wages / and safe labor conditions.',jp:'まず / 働く人には公正な賃金が必要です / そして安全な労働条件も'},
  {en:'A very low price should not depend / on unfair treatment / of workers.',jp:'とても安い価格は頼るべきではありません / 不公平な扱いに / 労働者への'},
  {en:'Second, / companies need / to think carefully / about the materials they use.',jp:'次に / 会社は必要があります / 注意深く考える / 使う素材について'},
  {en:'Some chemicals can harm workers / or the environment / if they are used carelessly.',jp:'化学物質の中には労働者を傷つけるものがあります / または環境を / 不注意に使われると'},
  {en:'Leather / and fur also raise questions / about animals / and production methods.',jp:'革 / そして毛皮も問題を提起します / 動物について / そして生産方法について'},
  {en:'Some companies choose alternate materials / when possible.',jp:'会社の中には代わりの素材を選びます / 可能なとき'},
  {en:'No single material is perfect / in every situation.',jp:'どんな1つの素材も完璧ではありません / すべての状況で'},
  {en:'Responsible clothing means checking both how people work / and how materials are produced.',jp:'責任ある衣服とは人がどう働くかの両方を確認することです / そして素材がどう作られるかを'},
  {en:'Consumers can use this information / when they choose clothing.',jp:'消費者はこの情報を使えます / 服を選ぶとき'}
 ],152);
 setAudit(d,'Unit 3-1',[
  {en:'Our class studies an endangered animal / that lives / in a forest.',jp:'私たちのクラスは絶滅危惧の動物について学びます / 住む / 森に'},
  {en:'The animal needs a large area / to find food / and raise its young.',jp:'その動物は広い場所を必要とします / 食べ物を探すために / そして子どもを育てるために'},
  {en:'Human activity has changed part / of the forest / into roads / and buildings.',jp:'人間の活動は一部を変えました / 森の / 道路へ / そして建物へ'},
  {en:'As the habitat becomes smaller, / the animal has less space / to live.',jp:'生息地が小さくなるにつれて / その動物にはより少ない場所しかありません / 暮らすための'},
  {en:'The population is now / in danger.',jp:'その個体群は今あります / 危険な状態に'},
  {en:'If the decline continues, / the animal may face extinction.',jp:'減少が続けば / その動物は絶滅に直面するかもしれません'},
  {en:'Protecting the remaining forest is an important challenge.',jp:'残った森を守ることは大切な課題です。'},
  {en:'People also need / to reduce further damage / to the habitat.',jp:'人々は必要もあります / さらなる被害を減らすことが / 生息地への'},
  {en:'This example shows how one human-caused change can create trouble / for wildlife.',jp:'この例は人間が起こした1つの変化が問題を生むことを示しています / 野生動物に'},
  {en:'We want / to learn what local people can do / to help.',jp:'私たちは望んでいます / 地元の人が何をできるか学ぶことを / 助けるために'}
 ],153);
 setAudit(d,'Unit 3-2',[
  {en:'I read an article / about an endangered animal / near our town.',jp:'私は記事を読みます / 絶滅危惧の動物についての / 私たちの町の近くにいる'},
  {en:'The article says / that the animal is losing places / to find food.',jp:'記事にはあります / その動物が場所を失っていると / 食べ物を探すための'},
  {en:'I had heard / of the animal / before, / but I did not know / about this problem.',jp:'私は聞いたことがありました / その動物について / 以前 / しかし知りませんでした / この問題について'},
  {en:'I show the article / to my friend.',jp:'私は記事を見せます / 友達に'},
  {en:'I want my friend / to read the part / about the animal’s habitat.',jp:'私は友達に望みます / その部分を読むことを / 動物の生息地についての'},
  {en:'My friend asks me / to explain why the problem is getting worse.',jp:'友達は私に頼みます / なぜ問題が悪化しているか説明するように'},
  {en:'I tell her / to look / at the map / in the article.',jp:'私は彼女に言います / 見るように / 地図を / 記事の中の'},
  {en:'The map shows where the habitat has become smaller.',jp:'地図は生息地がどこで小さくなったか示します。'},
  {en:'We ask our teacher / to let us share the article / with the class.',jp:'私たちは先生に頼みます / 私たちに記事を共有させるように / クラスと'},
  {en:'Then we make a short list / of actions / that can help protect the habitat.',jp:'それから私たちは短いリストを作ります / 行動の / 生息地を守る助けになる'},
  {en:'Sharing the article gives our class a clear reason / to act.',jp:'記事を共有することでクラスにはっきりした理由ができます / 行動するための'}
 ],154);
 setAudit(d,'Unit 3-3',[
  {en:'Researchers study an animal population living / near a busy road.',jp:'研究者は動物の個体群を調べます / 交通量の多い道路の近くに住む'},
  {en:'They have found / that traffic accidents kill some animals each year.',jp:'彼らは分かっています / 交通事故で毎年一部の動物が死ぬと'},
  {en:'The number / of accidents increases / when animals cross the road / to find food.',jp:'数が / 事故の増えます / 動物が道路を渡るとき / 食べ物を探すために'},
  {en:'The researchers compare accident locations / with the animals’ usual routes.',jp:'研究者は事故の場所を比べます / 動物が普段通る道と'},
  {en:'Their data relate heavy traffic / to a clear danger / for the animals.',jp:'彼らのデータは交通量の多さを関連づけます / 明確な危険に / 動物への'},
  {en:'The study focuses / on traffic / because it is the main problem / in this area.',jp:'研究は焦点を当てています / 交通に / それが主な問題だから / この地域で'},
  {en:'The researchers suggest signs / and safer crossing points / in the most dangerous areas.',jp:'研究者は標識を提案します / そしてより安全な横断地点を / 最も危険な場所に'},
  {en:'Local people can also report where they see animals / near the road.',jp:'地元の人も動物を見た場所を報告できます / 道路の近くで'},
  {en:'These actions may not end every accident.',jp:'こうした行動ですべての事故をなくせるとは限りません。'},
  {en:'However, / they can reduce one human-caused problem / in a realistic way.',jp:'しかし / それらは人間が原因の問題を1つ減らせます / 現実的な方法で'}
 ],155);
 setAudit(d,'Unit 3-4',[
  {en:'Sea otters once lived / in large numbers / along part / of the coast.',jp:'ラッコはかつて暮らしていました / 多く / 一部に沿って / 海岸の'},
  {en:'Heavy hunting caused the population / to fall sharply.',jp:'激しい狩猟は個体数に作用しました / 大きく減るように'},
  {en:'Later, / oil pollution / in the sea created another danger.',jp:'その後 / 油汚染が / 海の中の別の危険を生みました'},
  {en:'Oil can damage an otter’s fur / and make survival difficult.',jp:'油はラッコの毛皮を傷めることがあります / そして生存を難しくします'},
  {en:'Researchers studied the remaining population / and its role / in the ecosystem.',jp:'研究者は残った個体群を調べました / そしてその役割を / 生態系での'},
  {en:'Their research showed / that sea otters were important / to coastal life.',jp:'彼らの研究は示しました / ラッコが大切だと / 沿岸の生き物にとって'},
  {en:'The animal was given stronger protection / in many areas.',jp:'その動物はより強い保護を与えられました / 多くの地域で'},
  {en:'Citizens / and researchers also watched the population / over time.',jp:'市民 / そして研究者も個体数を見守りました / 長い間'},
  {en:'The number / of otters did not recover everywhere / at once.',jp:'数は / ラッコのすべての場所で回復したわけではありません / 一度に'},
  {en:'The history shows why conservation needs both protection / and long-term research.',jp:'この歴史は保全に保護の両方が必要な理由を示しています / そして長期的な研究も'}
 ],156);
 setAudit(d,'Unit 4-1',[
  {en:'Our family uses a local disaster map / to prepare / for an emergency.',jp:'私たちの家族は地域の防災地図を使います / 備えるために / 緊急時に'},
  {en:'First, / we mark the nearest shelter / on the map.',jp:'まず / 私たちは最寄りの避難所に印を付けます / 地図で'},
  {en:'We also write down the shelter’s location / and the route / from our house.',jp:'私たちは避難所の場所も書きます / そして道順を / 家からの'},
  {en:'Next, / we check where the fire extinguisher is / in our home.',jp:'次に / 私たちは消火器がどこにあるか確認します / 家の中で'},
  {en:'We prepare enough drinking water / for several days.',jp:'私たちは十分な飲み水を用意します / 数日分の'},
  {en:'Then we check food, / lights, / and other emergency supplies.',jp:'それから私たちは食べ物を確認します / 明かり / そしてその他の非常用品を'},
  {en:'We keep important phone numbers / with the checklist.',jp:'私たちは大切な電話番号を一緒にしておきます / チェックリストと'},
  {en:'After every item is checked, / we put the map / and checklist / in an easy-to-find place.',jp:'すべての項目を確認したら / 私たちは地図を置きます / そしてチェックリストを / 見つけやすい場所に'},
  {en:'Our family is better prepared / because we know both what / to take / and where / to go.',jp:'私たちの家族はよりよく備えられています / 私たちは何かの両方を知っているから / 持って行くもの / そして場所を / 行く'}
 ],157);
 setAudit(d,'Unit 4-2',[
  {en:'I have started preparing an emergency kit / for an earthquake.',jp:'私は非常用バッグの準備を始めました / 地震のための'},
  {en:'I use a checklist / from a reliable website.',jp:'私はチェックリストを使っています / 信頼できるウェブサイトの'},
  {en:'I have already packed water / and some food.',jp:'私は水をもう入れました / そして食べ物を少し'},
  {en:'Water is the first item / on my checklist / because it is essential.',jp:'水は最初の項目です / 私のチェックリストの / それが欠かせないから'},
  {en:'I have also added a light / and other small supplies.',jp:'私は明かりも入れました / そしてほかの小さな用品も'},
  {en:'The bag must not become too heavy / to carry.',jp:'バッグは重くなりすぎてはいけません / 運ぶには'},
  {en:'I check the size / and weight / after adding each item.',jp:'私は大きさを確認します / そして重さを / 品物を追加するたびに'},
  {en:'My friend has not prepared a kit yet.',jp:'友達はまだ非常用バッグを準備していません。'},
  {en:'I show my friend the web link / and the checklist.',jp:'私は友達にウェブリンクを見せます / そしてチェックリストを'},
  {en:'We decide / to check our kits again this weekend.',jp:'私たちは決めます / 今週末にもう一度バッグを確認することに'}
 ],158);
 setAudit(d,'Unit 4-3',[
  {en:'After a serious disaster, / one bridge / to the community shelter was damaged.',jp:'深刻な災害のあと / 1つの橋が / 地域の避難所へ向かう壊れました'},
  {en:'People had / to use a longer route / while the bridge was closed.',jp:'人々は必要がありました / より長い道を使う / 橋が閉鎖されている間'},
  {en:'The town repaired the bridge / so residents could reach the shelter safely again.',jp:'町は橋を修理しました / 住民が再び安全に避難所へ行けるように'},
  {en:'On the day it reopened, / students helped guide elderly people / along the route.',jp:'再開の日 / 生徒たちは高齢者を案内するのを手伝いました / 道に沿って'},
  {en:'One student comforted a friend / who still felt afraid / after the disaster.',jp:'ある生徒は友達を励ましました / まだ怖さを感じている / 災害後も'},
  {en:'The community also held a quiet moment / to remember people / who had died.',jp:'地域では静かな時間も持ちました / 人々を思い出すために / 亡くなった'},
  {en:'The event did not erase the loss / or fear.',jp:'その行事で喪失が消えるわけではありません / または恐怖が'},
  {en:'It showed / that safe infrastructure / and human support are both important / after a disaster.',jp:'それは示しました / 安全な設備 / そして人の支えの両方が大切だと / 災害後に'},
  {en:'Residents can now use the bridge / as the main route / to the shelter.',jp:'住民は今、橋を使えます / 主な道として / 避難所への'},
  {en:'The town continues / to encourage people / to learn the emergency route.',jp:'町は続けています / 人々に呼びかけることを / 緊急時の道を覚えるように'}
 ],159);
 setAudit(d,'Unit 4-4',[
  {en:'After a crisis, / some roads / in the town were blocked.',jp:'危機のあと / 一部の道路が / 町の通れなくなっていました'},
  {en:'A local support team used bicycles / to carry small supplies / to nearby homes.',jp:'地元の支援チームは自転車を使いました / 少量の物資を運ぶために / 近くの家へ'},
  {en:'One volunteer found a family / with a child / who needed water / and food.',jp:'あるボランティアは家族を見つけました / 子どものいる / 水を必要とする / そして食べ物も'},
  {en:'The volunteer delivered the supplies / and reported the family’s situation / to the support center.',jp:'そのボランティアは物資を届けました / そして家族の状況を報告しました / 支援センターへ'},
  {en:'Other volunteers exchanged information / about people / who still needed help.',jp:'ほかのボランティアは情報を交換しました / 人々について / まだ助けを必要とする'},
  {en:'Bicycles were useful / because they could move / through some narrow roads.',jp:'自転車は役立ちました / それらが移動できたから / 狭い道の一部を通って'},
  {en:'The first emergency period ended, / but the town still had problems / to solve.',jp:'最初の緊急期間は終わりました / しかし町にはまだ問題がありました / 解決すべき'},
  {en:'A longer-term support program began / after the immediate relief work.',jp:'より長期的な支援プログラムが始まりました / すぐの救援活動のあと'},
  {en:'The program helps residents exchange information / and ask / for support.',jp:'そのプログラムは住民が情報を交換するのを助けます / そして求めるのを / 支援を'},
  {en:'The crisis did not simply disappear; recovery continued step / by step.',jp:'危機が単純に消えたわけではありません；復旧は続きました一歩 / ずつ'}
 ],160);
 window.V10_REFERENCE_SLASH_AUDIT={version:'2026-08-20',passagesAudited:160,total:168,lastCompleted:160,minimumRuleImageConfirmed:true};
})();