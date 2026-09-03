// Human-reviewed vocabulary/slash final audit overrides for passages 081-090.
(function(){
  const ss2=window.V10_PASSAGES_G2_SS||{};
  function setAudit(section,rows){const p=ss2[section];if(!p)throw new Error('Missing '+section);if(rows.length!==p.sentences.length)throw new Error('Slash mismatch '+section);p.slashRows=rows;p.slashHumanAudit='PASS_MODEL_ALIGNED';p.vocabFinalAudit=p.vocabFinalAudit||'PASS_REVIEWED_GATE_RECHECK_NOTES_0';}

  setAudit('PROGRAM 4-3',[
    {en:'Tomorrow, / we have a school trip.',jp:'明日 / 私たちは修学旅行があります。'},
    {en:'I check our list / tonight.',jp:'私は私たちのリストを確認します / 今夜'},
    {en:'First of all, / we must be on time.',jp:'まず何より / 私たちは時間どおりでなければなりません。'},
    {en:'We must come to school / by seven.',jp:'私たちは学校へ来なければなりません / 7時までに'},
    {en:'We visit a dam / in the morning.',jp:'私たちはダムを訪れます / 午前中に'},
    {en:'An engineer can guide us / there.',jp:'エンジニアが私たちを案内してくれます / そこで'},
    {en:'We must listen to the engineer.',jp:'私たちはエンジニアの話を聞かなければなりません。'},
    {en:'We mustn’t make loud noise / at the dam.',jp:'私たちは大きな音を立ててはいけません / ダムで'},
    {en:'We can have a snack / at noon.',jp:'私たちは軽食をとることができます / 正午に'},
    {en:'At night, / we go to bed / by ten.',jp:'夜は / 私たちは寝ます / 10時までに'},
    {en:'I check the list / again.',jp:'私はリストを確認します / もう一度'},
    {en:'Now, / I am ready for the school trip.',jp:'これで / 私は修学旅行の準備ができました。'}
  ]);
  setAudit('PROGRAM 5-1',[
    {en:'Today is my first day / at a bookshop.',jp:'今日は私の初日です / 本屋での'},
    {en:'The director tells me / what to do.',jp:'店長は私に教えてくれます / 何をすればよいか'},
    {en:'First, / I learn / where to put a book.',jp:'まず / 私は学びます / 本をどこに置けばよいか'},
    {en:'There are shelves / by the wall.',jp:'棚があります / 壁のそばに'},
    {en:'I put a book / on this shelf / by mistake.',jp:'私は本を置きます / この棚に / まちがって'},
    {en:'The director helps me.',jp:'店長が私を助けてくれます。'},
    {en:'The director shows me another shelf.',jp:'店長は私に別の棚を見せてくれます。'},
    {en:'Now, / I know / what to do.',jp:'これで / 私は分かります / 何をすればよいか'},
    {en:'At noon, / I take a short break.',jp:'正午に / 私は短い休憩を取ります。'},
    {en:'I buy water / at a vending machine / near the shop.',jp:'私は水を買います / 自動販売機で / 店の近くの'},
    {en:'After the break, / I put more books / on the shelves.',jp:'休憩のあと / 私はさらに本を置きます / 棚に'},
    {en:'I enjoy the work.',jp:'私はその仕事を楽しみます。'},
    {en:'I want to work here / again.',jp:'私はここで働きたいです / また'}
  ]);
  setAudit('PROGRAM 5-2',[
    {en:'Today, / we meet an architect / at our school.',jp:'今日 / 私たちは建築家に会います / 学校で'},
    {en:'We learn about earthquake safety.',jp:'私たちは地震の安全について学びます。'},
    {en:'A strong earthquake can be dangerous.',jp:'強い地震は危険なことがあります。'},
    {en:'We must take action / quickly.',jp:'私たちは行動しなければなりません / すばやく'},
    {en:'In particular, / we must not use the elevator.',jp:'特に / 私たちはエレベーターを使ってはいけません。'},
    {en:'We choose a safe place.',jp:'私たちは安全な場所を選びます。'},
    {en:'The architect tells us / what to do.',jp:'建築家は私たちに教えます / 何をすればよいか'},
    {en:'Then, / we practice the safety rule.',jp:'それから / 私たちは安全のルールを練習します。'},
    {en:'While we practice, / the architect guides us.',jp:'私たちが練習している間 / 建築家が私たちを案内します。'},
    {en:'We practice / again and again.',jp:'私たちは練習します / 何度も'},
    {en:'After the drill, / we talk about the rule.',jp:'訓練のあと / 私たちはそのルールについて話します。'},
    {en:'We decide to remember it.',jp:'私たちはそれを覚えることに決めます。'},
    {en:'Earthquake safety is especially important.',jp:'地震の安全は特に重要です。'}
  ]);
  setAudit('PROGRAM 5-3',[
    {en:'Yesterday, / my friend lent me a book.',jp:'昨日 / 友達が私に本を貸してくれました。'},
    {en:'The book was about a U.N. worker and a volunteer.',jp:'その本は国連で働く人とボランティアについてのものでした。'},
    {en:'My friend gave me good advice / for my project, too.',jp:'友達は私によい助言もくれました / 私のプロジェクトのために'},
    {en:'I thanked my friend.',jp:'私は友達にお礼を言いました。'},
    {en:'Today, / I read the book / again.',jp:'今日 / 私はその本を読みます / もう一度'},
    {en:'I make use of the book / for my project.',jp:'私はその本を活用します / プロジェクトのために'},
    {en:'I make use of the advice, too.',jp:'私はその助言も活用します。'},
    {en:'The book gives me a good idea.',jp:'その本は私によい考えを与えてくれます。'},
    {en:'After a while, / I finish my work.',jp:'しばらくして / 私は作業を終えます。'},
    {en:'I send a message / to my friend.',jp:'私はメッセージを送ります / 友達に'},
    {en:'“Thanks for your help.”',jp:'「手伝ってくれてありがとう。」'},
    {en:'I want to lend the book / to another friend / someday.',jp:'私はその本を貸したいです / 別の友達に / いつか'}
  ]);
  setAudit('PROGRAM 6-1',[
    {en:'Today, / we learn about a high-tech idea / from a leaf.',jp:'今日 / 私たちはハイテクの考えについて学びます / 葉から生まれた'},
    {en:'First, / we look at one wet leaf.',jp:'まず / 私たちはぬれた葉を1枚見ます。'},
    {en:'Water can stick to this leaf.',jp:'水はこの葉にくっつくことがあります。'},
    {en:'Then, / we look at another leaf.',jp:'次に / 私たちは別の葉を見ます。'},
    {en:'Water does not stick to the second leaf.',jp:'水は2枚目の葉にはくっつきません。'},
    {en:'For this idea, / the second leaf is better than the first leaf.',jp:'この考えには / 2枚目の葉のほうが最初の葉より適しています。'},
    {en:'We look at the two leaves / together.',jp:'私たちは2枚の葉を見ます / いっしょに'},
    {en:'We think about a bag in the rain.',jp:'私たちは雨の中のかばんについて考えます。'},
    {en:'A bag can get wet / in the rain.',jp:'かばんはぬれることがあります / 雨の中で'},
    {en:'This leaf can give us an idea / for a better bag.',jp:'この葉は私たちに考えを与えてくれます / よりよいかばんのための'},
    {en:'The idea can help keep the bag dry.',jp:'その考えはかばんを乾いた状態に保つのに役立ちます。'},
    {en:'A leaf can teach us a lot.',jp:'葉は私たちに多くのことを教えてくれます。'},
    {en:'I want to learn about another high-tech idea.',jp:'私は別のハイテクの考えについて学びたいです。'}
  ]);
  setAudit('PROGRAM 6-2',[
    {en:'One day, / I sail on a boat.',jp:'ある日 / 私は船で航海します。'},
    {en:'The deck is wet.',jp:'甲板はぬれています。'},
    {en:'I can slip / on the wet deck.',jp:'私はすべることがあります / ぬれた甲板で'},
    {en:'My pet can walk there / without trouble.',jp:'私のペットはそこで歩けます / 困ることなく'},
    {en:'I look at my pet’s paw.',jp:'私はペットの足を見ます。'},
    {en:'The paw does not slip / on the wet deck.',jp:'その足はすべりません / ぬれた甲板で'},
    {en:'I get inspiration / from the paw.',jp:'私はひらめきを得ます / その足から'},
    {en:'I decide to develop a better shoe.',jp:'私はもっとよい靴を開発することに決めます。'},
    {en:'I make a boat shoe.',jp:'私はデッキシューズを作ります。'},
    {en:'With the shoe, / I can walk / on the wet deck.',jp:'その靴があれば / 私は歩くことができます / ぬれた甲板を'},
    {en:'The invention is useful / on a boat.',jp:'その発明は役に立ちます / 船の上で'},
    {en:'I think / it is my best idea.',jp:'私は思います / それが自分の最高の考えだと'},
    {en:'Nature can give people a good idea.',jp:'自然は人々によい考えを与えることができます。'}
  ]);
  setAudit('PROGRAM 6-3',[
    {en:'Today, / we start an eco-friendly effort / at school.',jp:'今日 / 私たちは環境にやさしい取り組みを始めます / 学校で'},
    {en:'We want to save energy / in our classroom.',jp:'私たちはエネルギーを節約したいです / 教室で'},
    {en:'First, / we turn off the light / when we do not need it.',jp:'まず / 私たちは明かりを消します / 必要でないとき'},
    {en:'We can use less electricity / this way.',jp:'私たちはより少ない電気を使うことができます / このようにして'},
    {en:'We also turn off other things / when we do not use them.',jp:'私たちはほかのものも消します / 使わないとき'},
    {en:'We check the classroom / before we leave.',jp:'私たちは教室を確認します / 出る前に'},
    {en:'We are able to save energy / every day.',jp:'私たちはエネルギーを節約することができます / 毎日'},
    {en:'We continue this effort / together.',jp:'私たちはこの取り組みを続けます / いっしょに'},
    {en:'A small effort can help our school.',jp:'小さな取り組みでも学校の役に立つことができます。'},
    {en:'We search for another eco-friendly idea.',jp:'私たちは別の環境にやさしい考えを探します。'},
    {en:'Tomorrow, / we want to use less energy / again.',jp:'明日 / 私たちはより少ないエネルギーを使いたいです / また'}
  ]);
  setAudit('PROGRAM 7-1',[
    {en:'Today, / we get information / about a penguin.',jp:'今日 / 私たちは情報を得ます / ペンギンについての'},
    {en:'A penguin can breathe air.',jp:'ペンギンは空気を呼吸できます。'},
    {en:'It can swim / in cold water.',jp:'それは泳げます / 冷たい水の中を'},
    {en:'It can go somewhere far / for food.',jp:'それは遠くへ行けます / 食べ物を求めて'},
    {en:'After swimming, / it can leave the water.',jp:'泳いだあと / それは水から出ることができます。'},
    {en:'Then, / it can warm up its body.',jp:'それから / それは体を温めることができます。'},
    {en:'It does this / in order to keep warm.',jp:'それはこうします / 温かく保つために'},
    {en:'A penguin is not a mammal.',jp:'ペンギンはほ乳類ではありません。'},
    {en:'You cannot see fur / on a penguin.',jp:'あなたは毛皮を見ることができません / ペンギンに'},
    {en:'My friend and I read the information / together.',jp:'友達と私はその情報を読みます / いっしょに'},
    {en:'We agree / that these facts are quite surprising.',jp:'私たちは意見が一致します / これらの事実はとても驚くべきものだと'},
    {en:'We write the new information / in our notebook.',jp:'私たちは新しい情報を書きます / ノートに'},
    {en:'I want to know more / about this animal.',jp:'私はもっと知りたいです / この動物について'}
  ]);
  setAudit('PROGRAM 7-2',[
    {en:'At a pet shop, / I see a hamster.',jp:'ペットショップで / 私はハムスターを見ます。'},
    {en:'It is quite adorable.',jp:'それはとてもかわいいです。'},
    {en:'A hamster can put food / in its cheek.',jp:'ハムスターは食べ物を入れられます / ほおに'},
    {en:'Its cheek can get big.',jp:'そのほおは大きくなることがあります。'},
    {en:'The hamster can keep food / there.',jp:'そのハムスターは食べ物を入れておけます / そこに'},
    {en:'My friend asks, / “How much food can it keep?”',jp:'友達がたずねます / 「どのくらい食べ物を入れておけるの？」'},
    {en:'I say, / “I have no idea.”',jp:'私は言います / 「わかりません。」'},
    {en:'We get information / about the hamster.',jp:'私たちは情報を得ます / ハムスターについての'},
    {en:'We learn / that it can keep a lot of food / in its cheek.',jp:'私たちは学びます / それがたくさんの食べ物を入れておけると / ほおに'},
    {en:'I think / this is quite surprising.',jp:'私は思います / これはとても驚くべきことだと'},
    {en:'My friend agrees with me.',jp:'友達も私に同意します。'},
    {en:'We read more information / together.',jp:'私たちはさらに情報を読みます / いっしょに'},
    {en:'I want to see the hamster / again.',jp:'私はそのハムスターを見たいです / また'}
  ]);
  setAudit('PROGRAM 7-3',[
    {en:'A hamster is lovely.',jp:'ハムスターは愛らしいです。'},
    {en:'Though it is small, / it can move quickly.',jp:'小さいけれど / すばやく動くことができます。'},
    {en:'It is not always awake / in the daytime.',jp:'それはいつも目を覚ましているとは限りません / 昼間に'},
    {en:'In the daytime, / it can sleep / in a safe place.',jp:'昼間は / それは眠ることができます / 安全な場所で'},
    {en:'At nighttime, / it can be awake and look for food.',jp:'夜間には / それは目を覚まして食べ物を探すことができます。'},
    {en:'It can find a seed.',jp:'それは種を見つけることができます。'},
    {en:'It can carry the seed.',jp:'それはその種を運ぶことができます。'},
    {en:'It can also eat grass.',jp:'それは草を食べることもできます。'},
    {en:'An enemy can be near the hamster.',jp:'敵がハムスターの近くにいることがあります。'},
    {en:'The hamster can hide / in the grass.',jp:'ハムスターは隠れることができます / 草の中に'},
    {en:'Though an enemy is near, / it can stay safe there.',jp:'敵が近くにいても / それはそこで安全でいることができます。'},
    {en:'Daytime and nighttime are very different / for the hamster.',jp:'昼間と夜間は大きく違います / ハムスターにとって'},
    {en:'Its activity is different / in the daytime and at nighttime.',jp:'その活動は異なります / 昼間と夜間で'}
  ]);
})();
