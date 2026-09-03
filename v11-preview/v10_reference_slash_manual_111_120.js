// Reference/minimum-rule slash audit passages 111-120.
(function(){
 const PASS='PASS_REFERENCE_20260820';
 function setAudit(data,section,rows,n){const p=data&&data[section];if(!p)throw new Error('Missing reference passage '+n+': '+section);if(rows.length!==(p.sentences||[]).length)throw new Error('Row mismatch '+n);for(let i=0;i<rows.length;i++){const e=String(rows[i].en||'').replace(/\s*\/\s*/g,' ').replace(/\s+/g,' ').trim(),s=String(p.sentences[i]||'').replace(/\s+/g,' ').trim();if(e!==s)throw new Error('English mismatch '+n+'#'+(i+1)+': '+e+' <> '+s);const ec=String(rows[i].en||'').split(/\s*\/\s*/).filter(Boolean).length,jc=String(rows[i].jp||'').split(/\s*\/\s*/).filter(Boolean).length;if(ec!==jc)throw new Error('EN/JP chunks '+n+'#'+(i+1)+' '+ec+'/'+jc)}p.slashRows=rows;p.slashReadingVersion='reference-book-minimum-rules-20260820';p.slashReferenceAudit=PASS;p.slashReferencePassageNo=n}
 const d=window.V10_PASSAGES_G2_NH||{};
 setAudit(d,'Unit 5-1',[
  {en:'Today, / I go / to city hall / for a universal design fair.',jp:'今日 / 私は行きます / 市役所へ / ユニバーサルデザインの博覧会のために'},
  {en:'First, / I see a bottle / with an adjustable handle.',jp:'まず / 私はボトルを見ます / 調節できる取っ手の付いた'},
  {en:'I can move the handle / to a comfortable position.',jp:'私は取っ手を動かせます / 使いやすい位置へ'},
  {en:'Then I can open the bottle more easily.',jp:'すると、ボトルをより簡単に開けられます。'},
  {en:'The design can help children / and people / with weak hands.',jp:'そのデザインは子どもを助けられます / そして人々を / 手の力が弱い'},
  {en:'I also see an automatic door / at the public facility.',jp:'私は自動ドアも見ます / 公共施設で'},
  {en:'People do not have / to pull the door open.',jp:'人々は必要がありません / ドアを引いて開ける'},
  {en:'A person / with baggage can enter easily.',jp:'人が / 手荷物を持つ簡単に入れます'},
  {en:'Both designs make everyday actions easier / for many people.',jp:'どちらのデザインも日常の動作を楽にします / 多くの人にとって'},
  {en:'I write / about the bottle / and the automatic door.',jp:'私は書きます / ボトルについて / そして自動ドアについて'},
  {en:'I want / to learn more / about universal design.',jp:'私は望んでいます / もっと学ぶことを / ユニバーサルデザインについて'}
 ],111);
 setAudit(d,'Unit 5-2',[
  {en:'At city hall, / I meet a staff member / at the universal design fair.',jp:'市役所で / 私は職員に会います / ユニバーサルデザイン博覧会で'},
  {en:'The staff member shows me a new ticket machine.',jp:'職員は私に新しい券売機を見せてくれます。'},
  {en:'It has a large button / in the center.',jp:'それには大きなボタンがあります / 中央に'},
  {en:'I can tap the button / with my right hand.',jp:'私はそのボタンを軽くたたけます / 右手で'},
  {en:'I can tap it / with my left hand, / too.',jp:'私はそれを軽くたたけます / 左手で / 〜もまた'},
  {en:'Both ways are easy / for me.',jp:'どちらの方法も簡単です / 私には'},
  {en:'The button is easy / to reach / from either side.',jp:'そのボタンは簡単です / 手が届くのが / どちら側からでも'},
  {en:'Thanks / to this design, / both right-handed / and left-handed people can use the machine easily.',jp:'感謝です / このデザインに / 右利きの人 / そして左利きの人もその機械を簡単に使えます'},
  {en:'The staff member shows me a paper / about the product.',jp:'職員は私に用紙を見せてくれます / その製品についての'},
  {en:'The paper has a picture / of the button.',jp:'用紙には絵があります / ボタンの'},
  {en:'I want / to show this design / to my friend.',jp:'私は望んでいます / このデザインを見せることを / 友達に'},
  {en:'I think it is useful / for many people.',jp:'私はそれが役立つと思います / 多くの人に'}
 ],112);
 setAudit(d,'Unit 5-3',[
  {en:'I listen / to a professor / at a universal design fair.',jp:'私は聞きます / 教授の話を / ユニバーサルデザイン博覧会で'},
  {en:'The professor uses a wheelchair.',jp:'その教授は車いすを使っています。'},
  {en:'In his childhood, / one heavy door / at a public facility was difficult / for him.',jp:'子どものころ / 1つの重いドアが / 公共施設ので難しかったです / 彼には'},
  {en:'He could not pull the door open / by himself.',jp:'彼はドアを引いて開けられませんでした / 自分だけで'},
  {en:'Today, / the same kind / of entrance can have an automatic door.',jp:'今では / 同じ種類 / 入口の自動ドアを付けることができます'},
  {en:'The door opens / without pulling.',jp:'そのドアは開きます / 引かなくても'},
  {en:'This design removes the barrier / for a person / in a wheelchair.',jp:'このデザインは障壁を取り除きます / 人にとっての / 車いすの'},
  {en:'A young child can use the same entrance, / too.',jp:'幼い子どもも同じ入口を使えます / 〜もまた'},
  {en:'People can use it / regardless / of their situation.',jp:'人々はそれを使えます / かかわらず / 自分たちの状況に'},
  {en:'I am sure this is a useful design.',jp:'私はこれは役立つデザインだと確信しています。'},
  {en:'I write / about how the automatic door helps different people.',jp:'私は書きます / 自動ドアがどのようにさまざまな人を助けるかについて'},
  {en:'I want / to learn how / to make good universal design.',jp:'私は望んでいます / 方法を学ぶことを / よいユニバーサルデザインを作る'}
 ],113);
 setAudit(d,'Unit 5-4',[
  {en:'At a center, / I give a presentation / about universal design.',jp:'あるセンターで / 私は発表します / ユニバーサルデザインについて'},
  {en:'First, / I show a large sign / with clear letters.',jp:'まず / 私は大きな標識を見せます / はっきりした文字の'},
  {en:'The sign is easy / to see / from far away.',jp:'その標識は簡単です / 見るのが / 遠くから'},
  {en:'It can help the elderly / and people carrying baggage.',jp:'それはお年寄りを助けられます / そして手荷物を持つ人を'},
  {en:'Next, / I show an automatic door.',jp:'次に / 私は自動ドアを見せます'},
  {en:'It can help a person / in a wheelchair / and a family / with a baby.',jp:'それは人を助けられます / 車いすの / そして家族を / 赤ちゃん連れの'},
  {en:'These designs remove different barriers.',jp:'これらのデザインは異なる障壁を取り除きます。'},
  {en:'They are useful / regardless / of a person’s ability.',jp:'それらは役立ちます / かかわらず / 人の能力に'},
  {en:'I also talk / about an American professor / who studies accessible design.',jp:'私はまた話します / アメリカ人教授について / 使いやすいデザインを研究する'},
  {en:'The center uses similar designs / for visitors.',jp:'そのセンターは似たデザインを使っています / 訪問者のために'},
  {en:'I want / to spread the idea / of universal design.',jp:'私は望んでいます / 考えを広めることを / ユニバーサルデザインの'},
  {en:'Good design can help many different people.',jp:'よいデザインはさまざまな人を助けることができます。'}
 ],114);
 setAudit(d,'Unit 6-1',[
  {en:'Our class has a presentation / about sports.',jp:'私たちのクラスでは発表があります / スポーツについての'},
  {en:'I make a quiz / for the presentation.',jp:'私はクイズを作ります / 発表のために'},
  {en:'One question compares two tennis courts / in our textbook picture.',jp:'1つの問題では2つのテニスコートを比べます / 教科書の絵にある'},
  {en:'Court A is twenty meters long.',jp:'コートAは20メートルの長さです。'},
  {en:'Court B is twenty-four meters long.',jp:'コートBは24メートルの長さです。'},
  {en:'I ask, / “Which court is longer?”',jp:'私はたずねます / 「どちらのコートが長いですか」'},
  {en:'My classmates look / at the picture / and the numbers.',jp:'クラスのみんなは見ます / 絵を / そして数字を'},
  {en:'Court B is longer / than Court A.',jp:'コートBは長いです / コートAより'},
  {en:'We check the answer together.',jp:'私たちはいっしょに答えを確認します。'},
  {en:'The comparison makes the sports trivia easy / to understand.',jp:'その比較でスポーツの雑学が簡単になります / 理解するのが'},
  {en:'The quiz is a fun part / of our presentation.',jp:'そのクイズは楽しい部分です / 私たちの発表の'},
  {en:'I want / to use another clear comparison next time.',jp:'私は望んでいます / 次回も別の分かりやすい比較を使うことを'}
 ],115);
 setAudit(d,'Unit 6-2',[
  {en:'We make a survey / about sports / for our presentation.',jp:'私たちは調査をします / スポーツについて / 発表のために'},
  {en:'We ask one question: “Which sport do you like best?”',jp:'私たちは1つ質問します。「どのスポーツが一番好きですか。」'},
  {en:'The choices are soccer, / tennis, / and curling.',jp:'選択肢はサッカーです / テニス / そしてカーリング'},
  {en:'Each student writes one answer / on paper.',jp:'それぞれの生徒が1つ答えを書きます / 用紙に'},
  {en:'More students choose soccer / than tennis.',jp:'より多くの生徒がサッカーを選びます / テニスより'},
  {en:'More students choose tennis / than curling.',jp:'より多くの生徒がテニスを選びます / カーリングより'},
  {en:'Soccer is the most popular / of the three / in our class.',jp:'サッカーが最も人気です / 3つの中で / 私たちのクラスで'},
  {en:'We do not say which sport needs the most skill.',jp:'どのスポーツが最も技術を必要とするかは言いません。'},
  {en:'Our survey only shows what our class likes.',jp:'私たちの調査が示すのはクラスのみんなの好みだけです。'},
  {en:'We use the results / in our presentation.',jp:'私たちは結果を使います / 発表で'},
  {en:'I want / to learn more / about curling strategy another day.',jp:'私は望んでいます / もっと学ぶことを / 別の日にカーリングの作戦について'}
 ],116);
 setAudit(d,'Unit 6-3',[
  {en:'We finish our sports survey.',jp:'私たちはスポーツ調査を終えます。'},
  {en:'Then I make a graph / of the results.',jp:'それから私はグラフを作ります / 結果の'},
  {en:'According / to the survey, / 60 percent / of the class chose soccer.',jp:'従って / 調査に / 60パーセント / クラスのがサッカーを選びました'},
  {en:'Half / of the class chose tennis.',jp:'半分 / クラスのがテニスを選びました'},
  {en:'More students chose soccer / than tennis.',jp:'より多くの生徒がサッカーを選びました / テニスより'},
  {en:'The graph shows this difference clearly.',jp:'グラフはこの違いをはっきり示します。'},
  {en:'A graph such / as this one makes the numbers easy / to compare.',jp:'このようなグラフ / この1つのようなは数字を簡単にします / 比べるのが'},
  {en:'I check each number again / before the presentation.',jp:'私はそれぞれの数字をもう一度確認します / 発表前に'},
  {en:'In conclusion, / soccer was more popular / than tennis / in our survey.',jp:'結論として / サッカーはより人気でした / テニスより / 私たちの調査では'},
  {en:'We use the graph / to explain the result.',jp:'私たちはグラフを使います / 結果を説明するために'},
  {en:'I think the graph will make our presentation easier / to understand.',jp:'私はグラフが発表を簡単にすると思います / 理解するのが'}
 ],117);
 setAudit(d,'Unit 6-4',[
  {en:'Yesterday, / I spoke / about universal design.',jp:'昨日 / 私は話しました / ユニバーサルデザインについて'},
  {en:'I used one slide / with data.',jp:'私は1枚のスライドを使いました / データを入れた'},
  {en:'The content / of the slide was clear, / and each letter was big.',jp:'内容が / スライドのははっきりしていました / そしてそれぞれの文字は大きかったです'},
  {en:'After the presentation, / I got feedback / from my classmates.',jp:'発表のあと / 私は意見をもらいました / クラスメートから'},
  {en:'One comment said / that my voice was sometimes too quiet.',jp:'1つのコメントでは言われました / 私の声がときどき小さすぎると'},
  {en:'Another comment said / that I looked / at the slide too often.',jp:'別のコメントでは言われました / 私が見たと / スライドを見すぎている'},
  {en:'I wrote the feedback / on paper.',jp:'私はその意見を書きました / 用紙に'},
  {en:'I decided / to work / on my delivery.',jp:'私は決めました / 取り組むことを / 自分の話し方に'},
  {en:'Next time, / I will speak more clearly.',jp:'次回 / 私はもっとはっきり話します'},
  {en:'I will also make more eye contact / with the audience.',jp:'私はもっとアイコンタクトもします / 聞き手と'},
  {en:'Clear content / and good delivery are both important / for a speaker.',jp:'はっきりした内容 / そしてよい話し方はどちらも大切です / 話し手にとって'},
  {en:'I will use this feedback / in my next presentation.',jp:'私はこの意見を使います / 次の発表で'}
 ],118);
 setAudit(d,'Unit 7-1',[
  {en:'Today, / our class studies how UNESCO selects World Heritage sites.',jp:'今日 / 私たちのクラスはユネスコがどのように世界遺産を選ぶかを学びます'},
  {en:'We learn / that there is more / than one standard.',jp:'私たちは学びます / あると / 1つより多くの基準が'},
  {en:'Our teacher shows us a forest region / on a world map.',jp:'先生が森林地域を見せます / 世界地図で'},
  {en:'The region has an important species / that lives only there.',jp:'その地域には大切な生物の種があります / そこにだけ生息する'},
  {en:'Protecting the region can also protect that species.',jp:'その地域を守ることはその種を守ることにもなります。'},
  {en:'This natural value is one reason the site may meet a standard.',jp:'この自然の価値が、その場所が基準を満たす可能性がある理由の1つです。'},
  {en:'UNESCO uses a selection process / to decide whether a site qualifies.',jp:'ユネスコは選定の仕組みを使います / 場所が条件を満たすかどうかを決めるために'},
  {en:'The selection is not easy.',jp:'選定は簡単ではありません。'},
  {en:'Our class talks / about the standards used / for natural sites.',jp:'私たちのクラスは話します / 使われる基準について / 自然遺産に'},
  {en:'I write one question / about the region.',jp:'私は1つ質問を書きます / その地域について'},
  {en:'I want / to know why other sites are selected, / too.',jp:'私は望んでいます / ほかの遺産がなぜ選ばれるのか知ることを / 〜もまた'}
 ],119);
 setAudit(d,'Unit 7-2',[
  {en:'The Cape Floral Region is a World Heritage site.',jp:'ケープ植物区は世界遺産です。'},
  {en:'It is a natural heritage site.',jp:'それは自然遺産です。'},
  {en:'The region has a great diversity / of plant life.',jp:'その地域には大きな多様性があります / 植物の'},
  {en:'Many different plants grow / in a small area.',jp:'多くの異なる植物が育ちます / 小さな地域に'},
  {en:'Its floral world is fantastic.',jp:'その花の世界はすばらしいです。'},
  {en:'This diversity gives the region important natural value.',jp:'この多様性が地域に大切な自然の価値を与えます。'},
  {en:'At a conference, / people can discuss how / to protect this heritage.',jp:'会議では / 人々は方法を話し合えます / この遺産を守る'},
  {en:'The region is different / from a cultural heritage site.',jp:'その地域は異なります / 文化遺産とは'},
  {en:'It is also different / from a mixed site, / which has both natural / and cultural value.',jp:'それはまた異なります / 複合遺産とも / それは自然の価値を持つ / そして文化の価値も'},
  {en:'In general, / World Heritage sites can have different kinds / of value.',jp:'一般的に / 世界遺産にはさまざまな種類があります / 価値の'},
  {en:'I want / to learn more / about the plants / of the Cape Floral Region.',jp:'私は望んでいます / もっと学ぶことを / 植物について / ケープ植物区の'}
 ],120);
 window.V10_REFERENCE_SLASH_AUDIT={version:'2026-08-20',passagesAudited:120,total:168,lastCompleted:120,minimumRuleImageConfirmed:true};
})();