// Human-reviewed vocabulary/slash final audit overrides for passages 021-030.
(function(){
  const data=window.V10_SUNSHINE_G1||{};
  function setAudit(section, rows){
    const p=data[section];
    if(!p) throw new Error('Missing audited passage: '+section);
    if(rows.length!==p.sentences.length) throw new Error('Slash row count mismatch: '+section);
    p.slashRows=rows;
    p.vocabFinalAudit='PASS_REVIEWED_GATE_RECHECK_NOTES_0';
    p.slashHumanAudit='PASS_MODEL_ALIGNED';
  }

  setAudit('PROGRAM 6-1',[
    {en:'I like this story.',jp:'私はこの物語が好きです。'},
    {en:'This story is about a detective.',jp:'この物語は探偵についての話です。'},
    {en:'A pirate is in the story, too.',jp:'海賊もその物語に登場します。'},
    {en:'A monster is in the story, too.',jp:'モンスターもその物語に登場します。'},
    {en:'I like the detective very much.',jp:'私はその探偵がとても好きです。'},
    {en:'I like the pirate, too.',jp:'海賊も好きです。'},
    {en:'I don’t like the monster very much.',jp:'モンスターはあまり好きではありません。'},
    {en:'My friend and I like the detective.',jp:'友達と私はその探偵が好きです。'},
    {en:'My friend and I talk about the detective and the pirate.',jp:'友達と私は探偵と海賊について話します。'},
    {en:'We talk about the monster, too.',jp:'モンスターについても話します。'},
    {en:'We really like the story.',jp:'私たちはその物語が本当に好きです。'}
  ]);

  setAudit('PROGRAM 6-2',[
    {en:'I always go to the park / on Saturday.',jp:'私はいつも公園へ行きます / 土曜日に'},
    {en:'My friend and I go there together.',jp:'友達と私はいっしょにそこへ行きます。'},
    {en:'We go there early.',jp:'私たちは早い時間にそこへ行きます。'},
    {en:'The park is quiet.',jp:'その公園は静かです。'},
    {en:'It is beautiful, too.',jp:'きれいでもあります。'},
    {en:'We practice basketball there.',jp:'私たちはそこでバスケットボールを練習します。'},
    {en:'We practice hard.',jp:'一生懸命練習します。'},
    {en:'After practice, / I read there.',jp:'練習のあと / 私はそこで本を読みます'},
    {en:'I sometimes ride my bicycle there.',jp:'ときどきそこで自転車に乗ります。'},
    {en:'My friend and I like the park very much.',jp:'友達と私はその公園がとても好きです。'},
    {en:'We go home together.',jp:'私たちはいっしょに家へ帰ります。'}
  ]);

  setAudit('PROGRAM 6-3',[
    {en:'This is Kenya.',jp:'ここはケニアです。'},
    {en:'Schoolchildren walk across the savanna / every morning.',jp:'子どもたちはサバンナを横切って歩きます / 毎朝'},
    {en:'They walk for one hour / to school.',jp:'彼らは1時間歩きます / 学校まで'},
    {en:'The walk is tough.',jp:'その道のりは大変です。'},
    {en:'The savanna can be dangerous.',jp:'サバンナは危険なことがあります。'},
    {en:'The schoolchildren are strong.',jp:'その子どもたちは強いです。'},
    {en:'They walk together.',jp:'彼らはいっしょに歩きます。'},
    {en:'They go to school / every morning.',jp:'彼らは学校へ行きます / 毎朝'},
    {en:'I respect the schoolchildren.',jp:'私はその子どもたちを尊敬します。'},
    {en:'I want to tell my friend / about them.',jp:'私は友達に伝えたいです / 彼らのことを'},
    {en:'The schoolchildren are amazing.',jp:'その子どもたちはすごいと思います。'}
  ]);

  setAudit('PROGRAM 7-1',[
    {en:'My dad and I are at a college.',jp:'父と私は大学にいます。'},
    {en:'We talk about research.',jp:'私たちは研究について話します。'},
    {en:'The research is interesting.',jp:'その研究はおもしろいです。'},
    {en:'A library is near the college.',jp:'図書館が大学の近くにあります。'},
    {en:'A museum is near the library.',jp:'博物館は図書館の近くにあります。'},
    {en:'My dad and I go to the museum.',jp:'父と私はその博物館へ行きます。'},
    {en:'After the museum, / I am hungry.',jp:'博物館のあと / 私はおなかがすきます'},
    {en:'My dad is hungry, too.',jp:'父もおなかがすいています。'},
    {en:'We go to a restaurant near the college.',jp:'私たちは大学の近くのレストランへ行きます。'},
    {en:'I have a pork sandwich.',jp:'私はポークサンドイッチを食べます。'},
    {en:'My dad has steak.',jp:'父はステーキを食べます。'},
    {en:'We go home / after dinner.',jp:'私たちは家へ帰ります / 夕食後に'},
    {en:'It is a great day.',jp:'すばらしい一日です。'}
  ]);

  setAudit('PROGRAM 7-2',[
    {en:'My friend and I go to a cake shop.',jp:'友達と私はケーキ屋へ行きます。'},
    {en:'The shop is far from my house.',jp:'その店は私の家から遠いです。'},
    {en:'We go there / by bus.',jp:'私たちはそこへ行きます / バスで'},
    {en:'I am a little hungry.',jp:'私は少しおなかがすいています。'},
    {en:'My friend is hungry, too.',jp:'友達もおなかがすいています。'},
    {en:'We want something sweet.',jp:'私たちは何か甘いものがほしいです。'},
    {en:'We have cake together.',jp:'いっしょにケーキを食べます。'},
    {en:'The cake is great.',jp:'そのケーキはすばらしいです。'},
    {en:'Now I am full.',jp:'今、私はおなかがいっぱいです。'},
    {en:'My friend is full, too.',jp:'友達もおなかがいっぱいです。'},
    {en:'We go home / by bus.',jp:'私たちは家へ帰ります / バスで'},
    {en:'I like this shop very much.',jp:'私はこの店がとても好きです。'}
  ]);

  setAudit('PROGRAM 7-3',[
    {en:'This zoo is popular.',jp:'この動物園は人気があります。'},
    {en:'My friend and I are at the zoo.',jp:'友達と私はその動物園にいます。'},
    {en:'My friend can show me around.',jp:'友達は私を案内して回ることができます。'},
    {en:'The zoo is famous for the quokka.',jp:'その動物園はクオッカで有名です。'},
    {en:'Look at the quokka.',jp:'クオッカを見てください。'},
    {en:'The quokka is a unique animal.',jp:'クオッカは珍しい動物です。'},
    {en:'I like the quokka very much.',jp:'私はクオッカがとても好きです。'},
    {en:'The zoo has a koala, too.',jp:'その動物園にはコアラもいます。'},
    {en:'A turtle is near the gate.',jp:'カメは門の近くにいます。'},
    {en:'The scenery is gorgeous.',jp:'景色はすばらしいです。'},
    {en:'I want to come here / with my family / someday.',jp:'私はここへ来たいです / 家族といっしょに / いつか'},
    {en:'I like this zoo very much.',jp:'私はこの動物園がとても好きです。'}
  ]);

  setAudit('PROGRAM 8-1',[
    {en:'Happy New Year!',jp:'新年おめでとう！'},
    {en:'My dad and I go to the supermarket.',jp:'父と私はスーパーマーケットへ行きます。'},
    {en:'We need fruit / for our family.',jp:'私たちはくだものが必要です / 家族のために'},
    {en:'We need a pineapple and a strawberry.',jp:'パイナップルとイチゴが必要です。'},
    {en:'We need a persimmon and a peach, too.',jp:'カキとモモも必要です。'},
    {en:'The supermarket is busy.',jp:'スーパーマーケットは混んでいます。'},
    {en:'We have the fruit / in our bag.',jp:'くだものを持っています / 私たちのかばんの中に'},
    {en:'My dad and I go home together.',jp:'父と私はいっしょに家へ帰ります。'},
    {en:'My family and I like the fruit.',jp:'家族と私はそのくだものが好きです。'},
    {en:'We are happy.',jp:'私たちはうれしいです。'}
  ]);

  setAudit('PROGRAM 8-2',[
    {en:'Today, / my friend and I are at home.',jp:'今日 / 友達と私は家にいます'},
    {en:'We prepare for a countdown.',jp:'私たちはカウントダウンの準備をします。'},
    {en:'We are busy.',jp:'私たちは忙しいです。'},
    {en:'We have a cake for the countdown.',jp:'カウントダウン用のケーキがあります。'},
    {en:'Why don’t we listen to music?',jp:'音楽を聞きませんか。'},
    {en:'Great!',jp:'いいね！'},
    {en:'We listen to music together.',jp:'私たちはいっしょに音楽を聞きます。'},
    {en:'We have a little cake / before the countdown.',jp:'私たちはケーキを少し食べます / カウントダウンの前に'},
    {en:'The countdown is exciting.',jp:'カウントダウンはわくわくします。'},
    {en:'I feel happy.',jp:'私はうれしく感じます。'},
    {en:'My friend is happy, too.',jp:'友達もうれしいです。'},
    {en:'It is a great day.',jp:'すばらしい一日です。'}
  ]);

  setAudit('PROGRAM 8-3',[
    {en:'We’re at a market.',jp:'私たちは市場にいます。'},
    {en:'My mom is with me.',jp:'母が私といっしょにいます。'},
    {en:'It is almost midnight.',jp:'もうすぐ真夜中です。'},
    {en:'We are in front of a food stand.',jp:'私たちは食べ物の屋台の前にいます。'},
    {en:'I have tuna / at the stand.',jp:'私はマグロを食べます / その屋台で'},
    {en:'I have an oyster, too.',jp:'カキも食べます。'},
    {en:'The tuna is expensive.',jp:'マグロは高価です。'},
    {en:'A pastry chef is at the next stand.',jp:'次の屋台にはパティシエがいます。'},
    {en:'The pastry chef is from France.',jp:'そのパティシエはフランス出身です。'},
    {en:'The pastry chef is skillful.',jp:'そのパティシエは腕がよいです。'},
    {en:'My mom and I like the market very much.',jp:'母と私はその市場がとても好きです。'},
    {en:'We go home together.',jp:'私たちはいっしょに家へ帰ります。'}
  ]);

  setAudit('PROGRAM 9-1',[
    {en:'Last holiday, / I stayed in Finland / with my family.',jp:'この前の休日 / 私はフィンランドに滞在しました / 家族といっしょに'},
    {en:'We stayed in a small house / near a park.',jp:'私たちは小さな家に泊まりました / 公園の近くの'},
    {en:'I relaxed a lot there.',jp:'私はそこで大いにくつろぎました。'},
    {en:'One day, / my brother and I walked to the park.',jp:'ある日 / 兄（弟）と私は公園まで歩きました'},
    {en:'We played tennis there.',jp:'そこでテニスをしました。'},
    {en:'My brother beat me.',jp:'兄（弟）は私に勝ちました。'},
    {en:'We walked home.',jp:'私たちは歩いて家へ帰りました。'},
    {en:'My father cooked dinner.',jp:'父は夕食を作りました。'},
    {en:'After dinner, / we talked about the tennis game.',jp:'夕食後 / 私たちはそのテニスの試合について話しました'},
    {en:'I read a book / and relaxed.',jp:'私は本を読みました / そしてくつろぎました'},
    {en:'I liked the trip very much.',jp:'私はその旅行がとても気に入りました。'}
  ]);

  window.V10_VOCAB_SLASH_MANUAL_021_030={passages:10,vocabAudited:10,slashAudited:10,notes:0};
})();
