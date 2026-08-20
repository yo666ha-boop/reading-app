// Reference/minimum-rule slash audit passages 131-140.
(function(){
 const PASS='PASS_REFERENCE_20260820';
 function setAudit(data,section,rows,n){const p=data&&data[section];if(!p)throw new Error('Missing reference passage '+n+': '+section);if(rows.length!==(p.sentences||[]).length)throw new Error('Row mismatch '+n);for(let i=0;i<rows.length;i++){const e=String(rows[i].en||'').replace(/\s*\/\s*/g,' ').replace(/\s+/g,' ').trim(),s=String(p.sentences[i]||'').replace(/\s+/g,' ').trim();if(e!==s)throw new Error('English mismatch '+n+'#'+(i+1)+': '+e+' <> '+s);const ec=String(rows[i].en||'').split(/\s*\/\s*/).filter(Boolean).length,jc=String(rows[i].jp||'').split(/\s*\/\s*/).filter(Boolean).length;if(ec!==jc)throw new Error('EN/JP chunks '+n+'#'+(i+1)+' '+ec+'/'+jc)}p.slashRows=rows;p.slashReadingVersion='reference-book-minimum-rules-20260820';p.slashReferenceAudit=PASS;p.slashReferencePassageNo=n}
 const d=window.V10_PASSAGES_G3_SS||{};
 setAudit(d,'PROGRAM 3-3',[
  {en:'Our trainer gives the athlete a plan / for the next race.',jp:'トレーナーは選手に計画を示します / 次のレースのための'},
  {en:'A good diet is the base / of the plan.',jp:'よい食事が土台です / その計画の'},
  {en:'The trainer recommends a nutritional meal / before hard training.',jp:'トレーナーは栄養のある食事を勧めます / きついトレーニングの前に'},
  {en:'The athlete checks the meal carefully.',jp:'選手は食事を注意深く確認します。'},
  {en:'The trainer also explains the importance / of breathing.',jp:'トレーナーは大切さも説明します / 呼吸の'},
  {en:'During training, / the athlete practices slow, / regular breathing.',jp:'トレーニング中 / 選手はゆっくりした呼吸を練習します / 規則正しい呼吸を'},
  {en:'Good breathing helps him stay calm / during a race.',jp:'よい呼吸は彼が落ち着いている助けになります / レース中に'},
  {en:'Rest is also an important part / of the plan.',jp:'休息も大切な部分です / その計画の'},
  {en:'The athlete follows the plan carefully each day.',jp:'選手は毎日その計画に注意深く従います。'},
  {en:'His development takes time, / but he can see progress.',jp:'成長には時間がかかります / しかし進歩を見ることができます'},
  {en:'Even a failure can show him what / to improve next.',jp:'失敗でも彼に何かを示すことがあります / 次に改善すべきことを'},
  {en:'Diet, / breathing, / and rest all support his training.',jp:'食事 / 呼吸 / そして休息のすべてが彼のトレーニングを支えます'}
 ],131);
 setAudit(d,'PROGRAM 4-1',[
  {en:'My friend / and I are / at a restaurant / during our travel.',jp:'私の友達 / そして私はいます / レストランに / 旅行中'},
  {en:'A waiter is / behind the counter.',jp:'ウェイターはいます / カウンターの後ろに'},
  {en:'My friend wants / to ask / about one dish, / but speaking is difficult / for the waiter.',jp:'友達は望んでいます / たずねることを / 料理について / しかし話すことは難しいです / ウェイターには'},
  {en:'The waiter uses sign language.',jp:'ウェイターは手話を使います。'},
  {en:'My friend does not know the sign, / so she uses a simple gesture.',jp:'友達はその手話を知りません / だから簡単な身ぶりを使います'},
  {en:'The waiter understands the gesture / and points / to the dish.',jp:'ウェイターは身ぶりを理解します / そして指さします / その料理を'},
  {en:'My friend smiles / and points / to the same dish.',jp:'友達はほほえみます / そして指さします / 同じ料理を'},
  {en:'They understand each other / without a long conversation.',jp:'二人はおたがいを理解します / 長い会話をしなくても'},
  {en:'I learn / that a gesture is not always sign language.',jp:'私は学びます / 身ぶりがいつも手話とは限らないと'},
  {en:'I also see how useful sign language can be.',jp:'手話がどれほど役立つかも分かります。'},
  {en:'After the meal, / I want / to learn some signs myself.',jp:'食事のあと / 私は望んでいます / 私自身もいくつか手話を学ぶことを'}
 ],132);
 setAudit(d,'PROGRAM 4-2',[
  {en:'Our school has an official guide / for a new user.',jp:'私たちの学校には公式案内があります / 新しい利用者のための'},
  {en:'The first part shows where / to enter the school.',jp:'最初の部分は場所を示します / 学校へ入る'},
  {en:'Another part explains where a user can ask / for help.',jp:'別の部分は利用者がどこで求められるか説明します / 助けを'},
  {en:'According / to the guide, / important information is shown / with both words / and signs.',jp:'従って / 案内に / 大切な情報は示されています / 言葉の両方で / そして表示で'},
  {en:'The guide also has a part / about sign language.',jp:'案内には部分もあります / 手話についての'},
  {en:'It explains / that a gesture / and sign language are not always the same.',jp:'それは説明します / 身ぶり / そして手話がいつも同じではないことを'},
  {en:'My friend / and I use the guide / to find the school office.',jp:'私の友達 / そして私は案内を使います / 学校の事務室を見つけるために'},
  {en:'We can find the right information quickly.',jp:'私たちは正しい情報をすぐ見つけられます。'},
  {en:'The guide is used widely / by visitors / to our school.',jp:'その案内は広く使われています / 訪問者に / 私たちの学校への'},
  {en:'I understand why an official guide should give clear information / to every user.',jp:'私は公式案内が明確な情報を与えるべき理由が分かります / すべての利用者に'}
 ],133);
 setAudit(d,'PROGRAM 4-3',[
  {en:'My friend / and I enter a barrier-free facility / for an event.',jp:'私の友達 / そして私はバリアフリー施設へ入ります / イベントのために'},
  {en:'At first, / I notice the wide entrance / and an automatic door.',jp:'最初に / 私は広い入口に気づきます / そして自動ドアに'},
  {en:'A hand rail runs / along the wall.',jp:'手すりがあります / 壁に沿って'},
  {en:'These features help an elderly customer enter safely.',jp:'こうした設備は年配のお客さんが安全に入る助けになります。'},
  {en:'Near the stage, / a speaker points / at a large sign.',jp:'ステージの近くで / 話し手が指さします / 大きな表示を'},
  {en:'The sign represents an important message / for visitors.',jp:'その表示は大切なメッセージを表しています / 訪問者への'},
  {en:'In addition, / the speaker talks / about different types / of sign language.',jp:'さらに / 話し手は話します / さまざまな種類について / 手話の'},
  {en:'A student / from Asia introduces ASL / as one type / of sign language.',jp:'生徒が / アジア出身のASLを紹介します / 1種類として / 手話の'},
  {en:'I realize / that signs, / space, / and communication can remove different barriers.',jp:'私は気づきます / 表示 / 空間 / そしてコミュニケーションが異なる障壁を取り除けることに'},
  {en:'After the event, / we drop / by the entrance again.',jp:'イベントのあと / 私たちは立ち寄ります / もう一度入口に'},
  {en:'I now understand why a wide, / barrier-free space can help many people.',jp:'私は今、広い理由が分かります / バリアフリー空間が多くの人を助けられる'}
 ],134);
 setAudit(d,'PROGRAM 5-1',[
  {en:'Our class listens / to a speech / about the original use / of cacao.',jp:'私たちのクラスは聞きます / スピーチを / 本来の使われ方について / カカオの'},
  {en:'Long ago, / some people regarded cacao / as medicine.',jp:'昔 / 人々の中にはカカオをみなしました / 薬として'},
  {en:'They crushed cacao / and used it / to make a drink.',jp:'彼らはカカオを砕きました / そしてそれを使いました / 飲み物を作るために'},
  {en:'The original drink was not sweet / like chocolate today.',jp:'その本来の飲み物は甘くありませんでした / 今日のチョコレートのように'},
  {en:'Later, / cacao reached Europe.',jp:'その後 / カカオはヨーロッパに伝わりました'},
  {en:'In Europe, / people changed the way they prepared the drink.',jp:'ヨーロッパでは / 人々が飲み物の作り方を変えました'},
  {en:'This became an important part / of the history / of cacao.',jp:'これは大切な一部になりました / 歴史の / カカオの'},
  {en:'The speaker shows us a website / with information / about the topic.',jp:'話し手は私たちにウェブサイトを見せます / 情報がある / その話題について'},
  {en:'The information is limited, / so we compare it / with the speech.',jp:'情報は限られています / だから私たちはそれを比べます / スピーチと'},
  {en:'I write notes / about how cacao changed / from an original drink / to later chocolate.',jp:'私はメモを書きます / カカオがどう変わったかについて / 本来の飲み物から / 後のチョコレートへ'},
  {en:'I want / to learn more / about cacao history.',jp:'私は望んでいます / もっと学ぶことを / カカオの歴史について'}
 ],135);
 setAudit(d,'PROGRAM 5-2',[
  {en:'Our class studies a graph / about chocolate consumption.',jp:'私たちのクラスはグラフを調べます / チョコレート消費についての'},
  {en:'The graph compares male / and female data.',jp:'グラフは男性のデータを比べます / そして女性のデータを'},
  {en:'It also compares British people / with other European people.',jp:'それはイギリスの人々も比べます / ほかのヨーロッパの人々と'},
  {en:'We read how much chocolate each group can consume.',jp:'各グループがどれくらいチョコレートを消費するか読み取ります。'},
  {en:'The male / and female numbers are not the same.',jp:'男性 / そして女性の数字は同じではありません'},
  {en:'The British data are also different / from some other European data.',jp:'イギリスのデータも異なります / ほかのヨーロッパの一部のデータと'},
  {en:'We mark the biggest difference / on the graph.',jp:'私たちは最も大きな違いに印を付けます / グラフで'},
  {en:'Then we compare the groups again.',jp:'それからグループをもう一度比べます。'},
  {en:'The graph helps us see a pattern / in chocolate consumption.',jp:'グラフは私たちが傾向を見る助けになります / チョコレート消費の'},
  {en:'We do not use the graph / to explain the history / of chocolate.',jp:'私たちはそのグラフを使いません / 歴史を説明するために / チョコレートの'},
  {en:'We use it only / to describe what the data show.',jp:'私たちはそれを使うだけです / データが示すことを説明するために'}
 ],136);
 setAudit(d,'PROGRAM 5-3',[
  {en:'I look / for a fair trade chocolate package / at a store.',jp:'私は探します / フェアトレードのチョコレートのパッケージを / 店で'},
  {en:'A magazine / beside the shelf has an image / of a cacao farm.',jp:'雑誌が / 棚のそばの写真を持っています / カカオ農園の'},
  {en:'The article explains the fair trade movement.',jp:'その記事はフェアトレード運動について説明しています。'},
  {en:'Some farmers can be forced / to sell cacao / for an unfair price.',jp:'農家の人々は強いられることがあります / カカオを売るように / 不公平な価格で'},
  {en:'Fair trade tries / to give a fairer price / to the people / at the farm.',jp:'フェアトレードは試みます / より公平な価格を与えることを / 人々に / 農園の'},
  {en:'I check the fair trade mark / and the price / on each package.',jp:'私はフェアトレードマークを確認します / そして価格を / 各パッケージの'},
  {en:'One dark chocolate package is perfect / for a gift.',jp:'あるダークチョコレートのパッケージはぴったりです / 贈り物に'},
  {en:'The magazine also explains where the cacao / in the package comes / from.',jp:'雑誌はカカオがどこかも説明しています / パッケージの中の来るのか / 〜から'},
  {en:'I realize / that the price / of chocolate is connected / to life / on a cacao farm.',jp:'私は気づきます / 価格が / チョコレートのつながっていることに / 生活に / カカオ農園での'},
  {en:'At the end, / I choose the fair trade package.',jp:'最後に / 私はフェアトレードのパッケージを選びます'},
  {en:'I want my choice / to support the people / who produce cacao.',jp:'私は自分の選択に望みます / 人々を支えることを / カカオを生産する'}
 ],137);
 setAudit(d,'PROGRAM 6-1',[
  {en:'A Canadian researcher studies a patch / in the ocean.',jp:'カナダの研究者が区域を調べます / 海の'},
  {en:'It is said / that a lot / of trash can gather there.',jp:'言われています / たくさん / ごみがそこに集まると'},
  {en:'The researcher finds / that the trash is mostly plastic.',jp:'研究者は分かります / そのごみの大部分がプラスチックだと'},
  {en:'A bottle can float / for a long time / and move / into the patch.',jp:'ボトルは浮かぶことがあります / 長い間 / そして移動します / その区域へ'},
  {en:'A plastic bottle can also get caught / in a net.',jp:'プラスチックのボトルが引っかかることもあります / 網に'},
  {en:'A net left behind can hurt / or kill an animal.',jp:'置き去りにされた網は傷つけることがあります / または動物を殺すことがあります'},
  {en:'The researcher gathers information / about the amount / of plastic.',jp:'研究者は情報を集めます / 量について / プラスチックの'},
  {en:'In one area, / the amount can be more / than a ton.',jp:'ある区域では / その量は多いことがあります / 1トンより'},
  {en:'A map shows where the trash gathers.',jp:'地図はごみがどこに集まるかを示します。'},
  {en:'The data help us understand why the patch is dangerous / to ocean life.',jp:'そのデータはこの区域が危険な理由を理解する助けになります / 海の生き物に'},
  {en:'We talk / about how / to leave less plastic behind.',jp:'私たちは話します / 方法について / 置き去りにするプラスチックを減らす'}
 ],138);
 setAudit(d,'PROGRAM 6-2',[
  {en:'At the age / of sixteen, / a boy saw a large amount / of trash / at a beach.',jp:'年齢のとき / 16歳の / ある少年は大量を見ました / ごみの / 海辺で'},
  {en:'He was shocked / by the plastic / in the water.',jp:'彼は衝撃を受けました / プラスチックに / 水中の'},
  {en:'He began / to study how trash moves / on the sea.',jp:'彼は始めました / ごみがどう動くか調べることを / 海で'},
  {en:'He also used what he learned / when he went out / to dive.',jp:'彼は学んだことも使いました / 出かけたとき / ダイビングするために'},
  {en:'Then he thought / about a system / for collecting plastic.',jp:'それから彼は考えました / 仕組みについて / プラスチックを集めるための'},
  {en:'His first idea used a long part / that could float / on the water.',jp:'最初の案では長い部分を使いました / それは浮かぶことができました / 水の上に'},
  {en:'The system could guide plastic / to one place / for collection.',jp:'その仕組みはプラスチックを導けました / 1か所へ / 回収のために'},
  {en:'He wrote the idea / in a notebook / and showed it / to his family.',jp:'彼はその案を書きました / ノートに / そしてそれを見せました / 家族に'},
  {en:'Later, / he tested the idea / and found problems.',jp:'その後 / 彼は案を試しました / そして問題を見つけました'},
  {en:'He changed the design / to improve the system.',jp:'彼はデザインを変えました / その仕組みを改善するために'},
  {en:'His goal was / to collect plastic / before it could hurt an animal.',jp:'彼の目標は〜でした / プラスチックを集めること / それが動物を傷つける前に'},
  {en:'A problem he saw / as a teenager became a real cleanup project.',jp:'彼が見た問題は / 10代のとき本当の清掃プロジェクトになりました'}
 ],139);
 setAudit(d,'PROGRAM 6-3',[
  {en:'Ocean plastic can look like an impossible problem.',jp:'海のプラスチックは不可能に思えるほど大きな問題に見えることがあります。'},
  {en:'A fish can swallow small pieces / of plastic.',jp:'魚は小さな破片を飲み込むことがあります / プラスチックの'},
  {en:'Much / of the waste / in the ocean is mainly plastic.',jp:'多くは / ごみの / 海の中の主にプラスチックです'},
  {en:'Cleanup systems can remove some waste / from water.',jp:'清掃の仕組みは一部のごみを取り除けます / 水から'},
  {en:'We also need / to reduce the waste / that reaches the ocean.',jp:'私たちは必要です / ごみを減らすことが / 海に届く'},
  {en:'At school, / I decide not / to throw my mug away / after one use.',jp:'学校で / 私はしないと決めます / マグカップを捨てることを / 一度使ったあと'},
  {en:'I wash the mug / and use it many times.',jp:'私はマグカップを洗います / そして何度も使います'},
  {en:'One reusable mug cannot remove all ocean plastic.',jp:'再利用するマグカップ1つで海のプラスチックを全部取り除くことはできません。'},
  {en:'However, / it can reduce the number / of things I throw away.',jp:'しかし / それは数を減らせます / 私が捨てる物の'},
  {en:'My class talks / about other useful things we can use again.',jp:'私のクラスは話します / ほかにも繰り返し使える物について'},
  {en:'We make a small plan / to reduce single-use waste / at school.',jp:'私たちは小さな計画を立てます / 使い捨てごみを減らすために / 学校で'},
  {en:'Ocean cleanup / and everyday waste reduction can work together.',jp:'海の清掃 / そして日常のごみ削減は一緒に取り組めます'}
 ],140);
 window.V10_REFERENCE_SLASH_AUDIT={version:'2026-08-20',passagesAudited:140,total:168,lastCompleted:140,minimumRuleImageConfirmed:true};
})();