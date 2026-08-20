// Reference/minimum-rule slash audit passages 141-150.
(function(){
 const PASS='PASS_REFERENCE_20260820';
 function setAudit(data,section,rows,n){const p=data&&data[section];if(!p)throw new Error('Missing reference passage '+n+': '+section);if(rows.length!==(p.sentences||[]).length)throw new Error('Row mismatch '+n);for(let i=0;i<rows.length;i++){const e=String(rows[i].en||'').replace(/\s*\/\s*/g,' ').replace(/\s+/g,' ').trim(),s=String(p.sentences[i]||'').replace(/\s+/g,' ').trim();if(e!==s)throw new Error('English mismatch '+n+'#'+(i+1)+': '+e+' <> '+s);const ec=String(rows[i].en||'').split(/\s*\/\s*/).filter(Boolean).length,jc=String(rows[i].jp||'').split(/\s*\/\s*/).filter(Boolean).length;if(ec!==jc)throw new Error('EN/JP chunks '+n+'#'+(i+1)+' '+ec+'/'+jc)}p.slashRows=rows;p.slashReadingVersion='reference-book-minimum-rules-20260820';p.slashReferenceAudit=PASS;p.slashReferencePassageNo=n}
 const s3=window.V10_PASSAGES_G3_SS||{}, n3=window.V10_PASSAGES_G3_NH||{};
 setAudit(s3,'PROGRAM 7-1',[
  {en:'A patient has a disease / and must stay / in his hospital room.',jp:'ある患者には病気があります / そしていなければなりません / 病室に'},
  {en:'The hospital has a simple remote-robot project.',jp:'病院には簡単な遠隔ロボットのプロジェクトがあります。'},
  {en:'The patient can control the robot / with a computer / through a network.',jp:'患者はロボットを操作できます / コンピューターで / ネットワークを通して'},
  {en:'One day, / the robot visits a museum far away.',jp:'ある日 / そのロボットは遠くの博物館を訪れます'},
  {en:'The patient watches the museum / from his room / and talks / with a guide.',jp:'患者は博物館を見ます / 病室から / そして話します / 案内の人と'},
  {en:'He can move the robot / and look / around the room.',jp:'彼はロボットを動かせます / そして見て回れます / 部屋の中を'},
  {en:'For a short time, / he feels / as if he is visiting the museum himself.',jp:'短い時間 / 彼は感じます / 自分自身が博物館を訪れているように'},
  {en:'He imagines using the robot / to visit another place abroad someday.',jp:'彼はロボットを使うことを想像します / いつか外国の別の場所を訪れるために'},
  {en:'Probably, / the project can help other patients too.',jp:'おそらく / このプロジェクトはほかの患者も助けられます'},
  {en:'A dream / that once felt far away may come true / through the robot.',jp:'夢が / かつて遠く感じられた実現するかもしれません / ロボットを通して'},
  {en:'The project gives the patient a new way / to connect / with the world.',jp:'このプロジェクトは患者に新しい方法を与えます / つながるための / 世界と'}
 ],141);
 setAudit(s3,'PROGRAM 7-2',[
  {en:'These days, / AI can control many kinds / of machines.',jp:'近ごろ / AIは多くの種類を制御できます / 機械の'},
  {en:'Our class studies one social robot / with a simple face.',jp:'私たちのクラスは社会的なロボットを1台調べます / 簡単な顔を持つ'},
  {en:'The robot can listen / to a person / and answer simple questions.',jp:'そのロボットは聞けます / 人の話を / そして簡単な質問に答えられます'},
  {en:'Its AI can recognize some words / and changes / in a voice.',jp:'そのAIはいくつかの言葉を認識できます / そして変化を / 声の'},
  {en:'But / can it really understand human emotion?',jp:'しかし / 本当に人間の感情を理解できるのでしょうか'},
  {en:'A mask / or a simple face cannot show every emotion.',jp:'仮面 / または簡単な顔ですべての感情を表すことはできません'},
  {en:'A person / with a fever may need more / than a machine’s answer.',jp:'人は / 熱のあるより多くを必要とするかもしれません / 機械の返事より'},
  {en:'A robot can send a message / or music / to someone far away.',jp:'ロボットはメッセージを送れます / または音楽を / 遠くにいる人へ'},
  {en:'That can be useful, / but it does not replace human care.',jp:'それは役立つことがあります / しかし人の世話の代わりにはなりません'},
  {en:'We use our imagination / to think / about the best role / for AI.',jp:'私たちは想像力を使います / 考えるために / 最もよい役割について / AIの'},
  {en:'AI can support communication / while people continue / to care / for one another.',jp:'AIはコミュニケーションを支えられます / 人々が続ける一方で / 思いやることを / おたがいを'}
 ],142);
 setAudit(s3,'PROGRAM 7-3',[
  {en:'An inventor wants / to help a person / who is often alone.',jp:'発明家は望んでいます / 人を助けることを / よく一人でいる'},
  {en:'The person may wish / for someone / to talk / with.',jp:'その人は願うことがあります / だれかを / 話すための / いっしょに'},
  {en:'The inventor creates a social robot / that can connect the person / with family / and friends.',jp:'発明家は社会的なロボットを作ります / その人をつなげられる / 家族と / そして友達と'},
  {en:'The robot can start a video call / and carry a simple message.',jp:'ロボットはビデオ通話を始められます / そして簡単なメッセージを運べます'},
  {en:'It can also shake hands / and respond / when the person speaks.',jp:'それは握手もできます / そして反応できます / その人が話すとき'},
  {en:'These actions may help shrink loneliness / for a short time.',jp:'こうした行動は孤独を減らす助けになるかもしれません / 短い時間でも'},
  {en:'However, / the robot should not make the person no longer meet other people.',jp:'しかし / ロボットのせいでその人がもはや他の人と会わなくなるべきではありません'},
  {en:'Human relationships are still important.',jp:'人との関係は今も大切です。'},
  {en:'The inventor explains this purpose / in a document / about the robot.',jp:'発明家はこの目的を説明します / 文書で / ロボットについての'},
  {en:'A password protects the communication system.',jp:'パスワードが通信の仕組みを守ります。'},
  {en:'Rather / than replace people, / the robot should help people connect.',jp:'むしろ / 人の代わりになるより / ロボットは人どうしをつなぐ助けになるべきです'},
  {en:'That is how technology can support society.',jp:'それが技術で社会を支える方法です。'}
 ],143);
 setAudit(n3,'Unit 0',[
  {en:'Today, / our class has an activity / about discovering a new side / of a classmate.',jp:'今日 / 私たちのクラスでは活動があります / 新しい一面を発見することについての / クラスメートの'},
  {en:'My classmate Yuki shows us a picture / from a musical.',jp:'クラスメートのユキが私たちに写真を見せます / ミュージカルの'},
  {en:'I think she only likes watching musicals.',jp:'私は彼女がミュージカルを見ることだけが好きなのだと思っています。'},
  {en:'Then she tells us / that she is an actor / in a local musical group.',jp:'すると彼女は私たちに教えます / 自分は俳優だと / 地元のミュージカル団体の'},
  {en:'I did not know that / before.',jp:'私はそれを知りませんでした / 以前は'},
  {en:'She explains / that she practices songs / after school.',jp:'彼女は説明します / 歌を練習していると / 放課後に'},
  {en:'She also shows us a picture / of the stage.',jp:'彼女は私たちに写真も見せます / 舞台の'},
  {en:'I ask her what she likes most / about acting.',jp:'私は彼女に何が一番好きかたずねます / 演技について'},
  {en:'She says she enjoys working / with other people.',jp:'彼女は取り組むことを楽しんでいると言います / 他の人といっしょに'},
  {en:'Finally, / I understand a new side / of Yuki.',jp:'ついに / 私は新しい一面を理解します / ユキの'},
  {en:'The activity helps me discover something real / about my classmate.',jp:'この活動は私が本当のことを発見する助けになります / クラスメートについて'}
 ],144);
 setAudit(n3,'Unit 1-1',[
  {en:'My friend / and I compare places we have visited / in Japan.',jp:'私の友達 / そして私は訪れたことのある場所を比べます / 日本で'},
  {en:'I have been / to Kyoto once.',jp:'私は行ったことがあります / 京都に1度'},
  {en:'My friend has been / to Kyoto too.',jp:'友達も行ったことがあります / 京都にも'},
  {en:'I have also been / to Osaka twice.',jp:'私は行ったこともあります / 大阪に2度'},
  {en:'My friend has never been / to Hokkaido.',jp:'友達は行ったことが一度もありません / 北海道へ'},
  {en:'I have never been there either.',jp:'私もそこへ行ったことがありません。'},
  {en:'We talk / about what we enjoyed / in Kyoto / and Osaka.',jp:'私たちは話します / 楽しんだことについて / 京都で / そして大阪で'},
  {en:'Then we look / at a picture / of Hokkaido.',jp:'それから私たちは見ます / 写真を / 北海道の'},
  {en:'“Have you ever wanted / to go there?” I ask.',jp:'「今まで望んだことがある / そこへ行くことを？」と私はたずねます'},
  {en:'My friend says yes.',jp:'友達はあると答えます。'},
  {en:'Because neither / of us has been there, / we choose Hokkaido / as our next trip.',jp:'どちらも〜でないので / 私たちのそこへ行ったことが / 私たちは北海道を選びます / 次の旅行先として'}
 ],145);
 setAudit(n3,'Unit 1-2',[
  {en:'Today, / I meet a visitor / from another country.',jp:'今日 / 私は訪問者に会います / 外国から来た'},
  {en:'I ask, / “Have you ever been / to Kyoto?”',jp:'私はたずねます / 「今まで行ったことがありますか / 京都に」'},
  {en:'He says / that he has been there once.',jp:'彼は言います / そこへ1度行ったことがあると'},
  {en:'He has also visited Osaka.',jp:'彼は大阪も訪れたことがあります。'},
  {en:'Then he shows us a picture / from his trip.',jp:'それから彼は私たちに写真を見せます / 旅行で撮った'},
  {en:'The picture shows a style / of regional fashion he saw / in Kyoto.',jp:'その写真は様式を示しています / 彼が見た地域の服装の / 京都で'},
  {en:'He explains when people wear it / and why he found it interesting.',jp:'彼は人々がいつそれを着るか説明します / そしてなぜ興味深いと思ったかも'},
  {en:'My friend / and I look closely / at the picture.',jp:'私の友達 / そして私はよく見ます / その写真を'},
  {en:'I had seen similar clothes / before, / but I did not know their regional meaning.',jp:'私は似た服を見たことがありました / 以前 / しかしその地域的な意味は知りませんでした'},
  {en:'The visitor’s experience helps us learn something new / about Japanese culture.',jp:'その訪問者の経験は私たちが新しいことを学ぶ助けになります / 日本文化について'}
 ],146);
 setAudit(n3,'Unit 1-3',[
  {en:'Japanese animation is enjoyed / by both children / and adults / around the world.',jp:'日本のアニメーションは楽しまれています / 子どもたちに / そして大人たちに / 世界中で'},
  {en:'One reason is the variety / of stories.',jp:'理由の1つは多様さです / 物語の'},
  {en:'Some stories are exciting adventures.',jp:'わくわくする冒険の物語もあります。'},
  {en:'Others give a positive message / about friendship / or courage.',jp:'ほかのものは前向きなメッセージを伝えます / 友情について / または勇気について'},
  {en:'Another reason is the quality / of the drawing.',jp:'もう1つの理由は質です / 絵の'},
  {en:'A delicate drawing can show a small change / in a character’s feeling.',jp:'繊細な絵は小さな変化を表せます / 登場人物の気持ちの'},
  {en:'A simple drawing can also make an action easy / to understand.',jp:'単純な絵でも動作を簡単にできます / 理解するのが'},
  {en:'Different genres give viewers many kinds / of stories / to choose / from.',jp:'さまざまなジャンルは見る人に多くの種類を与えます / 物語の / 選ぶための / そこから'},
  {en:'Good stories / and expressive drawings work together.',jp:'よい物語 / そして表現力のある絵がいっしょに働きます'},
  {en:'These qualities help Japanese animation reach people / in many countries.',jp:'こうした良さは日本のアニメーションが人々へ届く助けになります / 多くの国の'}
 ],147);
 setAudit(n3,'Unit 1-4',[
  {en:'Our class studies an old Japanese picture scroll.',jp:'私たちのクラスは古い日本の絵巻物を学びます。'},
  {en:'The scroll shows a story / through drawings placed / in order.',jp:'その絵巻物は物語を示します / 置かれた絵を通して / 順番に'},
  {en:'As our eyes move / along the scroll, / the position / of a character changes.',jp:'私たちの目が動くにつれて / 絵巻物に沿って / 位置が / 登場人物の変わります'},
  {en:'This sequence can give us a feeling / of movement.',jp:'この連続は私たちに感じを与えます / 動きの'},
  {en:'Modern animation also creates movement / by showing drawings / in sequence.',jp:'現代のアニメーションも動きを作ります / 絵を示すことで / 順番に'},
  {en:'The two forms are not the same, / and the historical connection is not simple.',jp:'2つの形式は同じではありません / そして歴史的なつながりも単純ではありません'},
  {en:'However, / both use a series / of pictures / to show change / over time.',jp:'しかし / どちらも一連を使います / 絵の / 変化を示すために / 時間による'},
  {en:'This comparison helps us understand one old technique / in Japanese visual storytelling.',jp:'この比較は私たちが1つの古い技法を理解する助けになります / 日本の視覚的な物語表現の'},
  {en:'We look / at the scroll again / and follow the character / from one scene / to the next.',jp:'私たちは見ます / もう一度絵巻物を / そして登場人物を追います / 1つの場面から / 次の場面へ'},
  {en:'I can now see why people compare some picture-scroll techniques / with animation.',jp:'私は今、絵巻物の技法の一部を比べる理由が分かります / アニメーションと'}
 ],148);
 setAudit(n3,'Unit 2-1',[
  {en:'I am reading an interview / with an ethical-fashion designer.',jp:'私はインタビューを読んでいます / エシカルファッションのデザイナーへの'},
  {en:'I have already read the first half.',jp:'最初の半分はもう読みました。'},
  {en:'The designer has explained why she chooses materials carefully.',jp:'デザイナーはなぜ素材を注意深く選ぶのか説明しています。'},
  {en:'She has also described how workers make one product.',jp:'1つの製品を労働者がどのように作るかも説明しています。'},
  {en:'I have just learned / that a low price can hide a problem / in production.',jp:'私はちょうど学んだところです / 安い価格が問題を隠すことがあると / 生産上の'},
  {en:'My friend asks, / “Have you read the part / about recycling yet?”',jp:'友達がたずねます / 「その部分は読んだ / リサイクルについての、もう？」'},
  {en:'I answer, / “Not yet.”',jp:'私は答えます / 「まだ」'},
  {en:'That part is / in the second half / of the interview.',jp:'その部分はあります / 後半に / インタビューの'},
  {en:'I want / to finish it tonight.',jp:'私は望んでいます / 今夜それを読み終えることを'},
  {en:'The interview has already changed the way I think / about clothing.',jp:'そのインタビューで私の考え方がすでに変わっています / 服について'}
 ],149);
 setAudit(n3,'Unit 2-2',[
  {en:'Our class talks / with an accessory designer online.',jp:'私たちのクラスは話します / オンラインでアクセサリーのデザイナーと'},
  {en:'She makes products / from material / that would otherwise be thrown away.',jp:'彼女は製品を作ります / 素材から / そのままなら捨てられる'},
  {en:'I ask how long she has used this recycling idea.',jp:'私はこのリサイクルの考えをどのくらい使っているのかたずねます。'},
  {en:'She says, / “I have used it / for five years.”',jp:'彼女は言います / 「私はそれを使っています / 5年間」'},
  {en:'She first tried the idea / with a small accessory.',jp:'彼女は最初その考えを試しました / 小さなアクセサリーで'},
  {en:'Since then, / she has continued / to improve the design.',jp:'それ以来 / 彼女は続けています / デザインを改善することを'},
  {en:'My friend asks what has changed / during those five years.',jp:'友達は何が変わったのかたずねます / その5年間に'},
  {en:'The designer shows us an early product / and a newer one.',jp:'デザイナーは私たちに初期の製品を見せます / そして新しい製品を'},
  {en:'The newer design uses less new material.',jp:'新しいデザインでは新しい素材の使用が少なくなっています。'},
  {en:'I understand / that a useful idea can develop / over time.',jp:'私は分かります / 役立つ考えは発展できると / 時間をかけて'},
  {en:'Her answer makes the duration meaningful / because it describes real work / on the design.',jp:'彼女の答えはその期間を意味あるものにします / 実際の取り組みを表すから / デザインへの'}
 ],150);
 window.V10_REFERENCE_SLASH_AUDIT={version:'2026-08-20',passagesAudited:150,total:168,lastCompleted:150,minimumRuleImageConfirmed:true};
})();