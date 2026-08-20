// Human-reviewed vocabulary/slash final audit overrides for passages 051-060.
// Genuine final-gate repairs in this batch:
// 051 removes `story` (not available in NH G1 at Unit 4-3).
// 052 keeps Unit 5-1 `enjoy ...ing` grammar scope and removes broader `enjoy my work` usage.
// 053 removes unverified `water` from the Unit 5-2 passage.
// 057 removes unverified `Then` and uses cumulative `after` instead.
(function(){
  const nh=window.V10_NEWHORIZON_G1||{};
  function setAudit(section,rows){
    const p=nh[section]; if(!p) throw new Error('Missing audited passage: '+section);
    if(rows.length!==p.sentences.length) throw new Error('Slash row count mismatch: '+section+' '+rows.length+'/'+p.sentences.length);
    p.slashRows=rows; p.vocabFinalAudit=p.vocabFinalAudit||'PASS_REVIEWED_GATE_RECHECK_NOTES_0'; p.slashHumanAudit='PASS_MODEL_ALIGNED';
  }
  function setMeta(section,meta){
    const plain='ニューホライズン|'+section, graded='ニューホライズン|1|'+section;
    window.V10_INTERACTION_META=window.V10_INTERACTION_META||{};
    window.V10_INTERACTION_META[plain]=meta; window.V10_INTERACTION_META[graded]=meta;
    if(window.V10_INTERACTION_META_SEMANTIC_REPAIRS_051_060) window.V10_INTERACTION_META_SEMANTIC_REPAIRS_051_060[plain]=meta;
  }

  const p51=nh['Unit 4-3'];
  Object.assign(p51,{
    sentences:['It’s your turn.','Are you nervous?','Yes, I am.','Don’t worry.','Please come to the front.','Read this, please.','Look at me, please.','Is this right?','Yes, it is.','Great.','Enjoy yourself.','Thank you.'],
    fullTranslation:'「あなたの番です。」「緊張していますか。」「はい、しています。」「心配しないで。」「前へ来てください。」「これを読んでください。」「私を見てください。」「これで合っていますか。」「はい、合っています。」「いいですね。」「楽しんでね。」「ありがとうございます。」',
    questions:[
      {prompt:'1. 何をする番ですか。本文の流れに合うように日本語で答えなさい。',answer:'前でこれを読む番',evidence:'Please come to the front. / Read this, please.',evidenceJp:'前へ来てください。／これを読んでください。',reason:'前へ来たあと、これを読むよう指示されているため活動内容が分かります。'},
      {prompt:'2. 相手は緊張していますか。本文に合うように Yes / No で答えなさい。',answer:'Yes',evidence:'Are you nervous? / Yes, I am.',evidenceJp:'緊張していますか。／はい、しています。',reason:'nervous かどうかの質問に Yes, I am. と答えています。'},
      {prompt:'3. 緊張している相手に何と声をかけていますか。本文から英語で抜き出しなさい。',answer:'Don’t worry.',evidence:'Don’t worry.',evidenceJp:'心配しないで。',reason:'worry を否定する命令文で相手を安心させています。'},
      {prompt:'4. 相手はどこへ来るように言われていますか。本文から英語で答えなさい。',answer:'to the front',evidence:'Please come to the front.',evidenceJp:'前へ来てください。',reason:'to the front が移動先です。'},
      {prompt:'5. 読み方が合っているか確認する英文を本文から抜き出しなさい。',answer:'Is this right?',evidence:'Is this right?',evidenceJp:'これで合っていますか。',reason:'right を使って正しいかを確認しています。'}
    ],
    vocabFinalAudit:'PASS_REWRITTEN_TO_GATE_NOTES_0',
    vocabRepairReason:'Removed story. Canonical NH1 master does not introduce story by Unit 4-3; read is already available from Pre-step/Unit2.'
  });
  setAudit('Unit 4-3',[
    {en:'It’s your turn.',jp:'あなたの番です。'},{en:'Are you nervous?',jp:'緊張していますか。'},{en:'Yes, I am.',jp:'はい、しています。'},{en:'Don’t worry.',jp:'心配しないで。'},
    {en:'Please come to the front.',jp:'前へ来てください。'},{en:'Read this, please.',jp:'これを読んでください。'},{en:'Look at me, please.',jp:'私を見てください。'},{en:'Is this right?',jp:'これで合っていますか。'},
    {en:'Yes, it is.',jp:'はい、合っています。'},{en:'Great.',jp:'いいですね。'},{en:'Enjoy yourself.',jp:'楽しんでね。'},{en:'Thank you.',jp:'ありがとうございます。'}
  ]);
  setMeta('Unit 4-3',{genre:'dialogue',questionSetB:[
    {prompt:'1. 相手は前へ来るように言われていますか。Yes / No で答えなさい。',answer:'Yes',evidence:'Please come to the front.',evidenceJp:'前へ来てください。',reason:'to the front と移動先が示されています。'},
    {prompt:'2. 「これを読んでください」に当たる英文を抜き出しなさい。',answer:'Read this, please.',evidence:'Read this, please.',evidenceJp:'これを読んでください。',reason:'read を使った指示文です。'},
    {prompt:'3. 「心配しないで」に当たる英文を抜き出しなさい。',answer:'Don’t worry.',evidence:'Don’t worry.',evidenceJp:'心配しないで。',reason:'相手を安心させる表現です。'},
    {prompt:'4. 正しいかという質問にはどう答えていますか。英語で答えなさい。',answer:'Yes, it is.',evidence:'Is this right? / Yes, it is.',evidenceJp:'これで合っていますか。／はい、合っています。',reason:'Is this ...? に Yes, it is. と答えています。'}
  ]});

  const p52=nh['Unit 5-1'];
  p52.sentences=['This is my blog.','I am a local guide.','I like nature very much.','This is a local spot.','It is beautiful.','I work here as a local guide.','I write about this local spot.','I enjoy working as a guide.','I like this blog, too.','My work is interesting.'];
  p52.fullTranslation='これは私のブログです。私は地元のガイドです。自然がとても好きです。ここは地元のスポットです。きれいな場所です。私はここで地元のガイドとして働いています。この地元のスポットについて書きます。ガイドとして働くことを楽しんでいます。このブログも好きです。私の仕事はおもしろいです。';
  p52.vocabFinalAudit='PASS_REWRITTEN_TO_GATE_NOTES_0'; p52.vocabRepairReason='Unit 5-1 explicitly licenses enjoy ...ing; replaced broader enjoy my work with cumulative be + interesting.';
  setAudit('Unit 5-1',[
    {en:'This is my blog.',jp:'これは私のブログです。'},{en:'I am a local guide.',jp:'私は地元のガイドです。'},{en:'I like nature very much.',jp:'自然がとても好きです。'},{en:'This is a local spot.',jp:'ここは地元のスポットです。'},
    {en:'It is beautiful.',jp:'きれいな場所です。'},{en:'I work here / as a local guide.',jp:'私はここで働いています / 地元のガイドとして'},{en:'I write about this local spot.',jp:'この地元のスポットについて書きます。'},
    {en:'I enjoy working / as a guide.',jp:'私は働くことを楽しんでいます / ガイドとして'},{en:'I like this blog, too.',jp:'このブログも好きです。'},{en:'My work is interesting.',jp:'私の仕事はおもしろいです。'}
  ]);

  const p53=nh['Unit 5-2'];
  p53.sentences=['This is his blog.','The blog is about his life.','He has a beautiful dolphin picture there.','Does he like the picture?','Yes, he does.','He can swim.','He doesn’t surf.','Does he write about the dolphin?','Yes, he does.','The picture is very beautiful.','The blog is interesting.'];
  p53.fullTranslation='これは彼のブログです。そのブログは彼の生活についてのものです。そこには美しいイルカの写真があります。「彼はその写真が好きですか。」「はい、好きです。」彼は泳ぐことができます。サーフィンはしません。「彼はイルカについて書きますか。」「はい、書きます。」その写真はとても美しいです。そのブログはおもしろいです。';
  p53.questions=[
    {prompt:'1. ブログは何についてですか。本文から英語で答えなさい。',answer:'his life',evidence:'The blog is about his life.',evidenceJp:'そのブログは彼の生活についてのものです。',reason:'about の後ろの his life が内容です。'},
    {prompt:'2. 彼は何の写真を持っていますか。本文から英語で答えなさい。',answer:'a beautiful dolphin picture',evidence:'He has a beautiful dolphin picture there.',evidenceJp:'そこには美しいイルカの写真があります。',reason:'has の目的語が写真です。'},
    {prompt:'3. その写真はどのようですか。本文から英語で1語抜き出しなさい。',answer:'beautiful',evidence:'The picture is very beautiful.',evidenceJp:'その写真はとても美しいです。',reason:'beautiful が写真の様子です。'},
    {prompt:'4. 彼は泳ぐことができますか。本文に合うように Yes / No で答えなさい。',answer:'Yes',evidence:'He can swim.',evidenceJp:'彼は泳ぐことができます。',reason:'can swim と明示されています。'},
    {prompt:'5. 彼はサーフィンをしますか。本文に合うように Yes / No で答えなさい。',answer:'No',evidence:'He doesn’t surf.',evidenceJp:'彼はサーフィンをしません。',reason:'doesn’t surf と否定しています。'}
  ];
  p53.vocabFinalAudit='PASS_REWRITTEN_TO_GATE_NOTES_0'; p53.vocabRepairReason='Removed unverified water; Unit 5-2 source gate does not list it and canonical NH1 search found no supporting row in the checked range.';
  setAudit('Unit 5-2',[
    {en:'This is his blog.',jp:'これは彼のブログです。'},{en:'The blog is about his life.',jp:'そのブログは彼の生活についてのものです。'},{en:'He has a beautiful dolphin picture / there.',jp:'彼は美しいイルカの写真を持っています / そこに'},
    {en:'Does he like the picture?',jp:'彼はその写真が好きですか。'},{en:'Yes, he does.',jp:'はい、好きです。'},{en:'He can swim.',jp:'彼は泳ぐことができます。'},{en:'He doesn’t surf.',jp:'彼はサーフィンをしません。'},
    {en:'Does he write about the dolphin?',jp:'彼はイルカについて書きますか。'},{en:'Yes, he does.',jp:'はい、書きます。'},{en:'The picture is very beautiful.',jp:'その写真はとても美しいです。'},{en:'The blog is interesting.',jp:'そのブログはおもしろいです。'}
  ]);
  setMeta('Unit 5-2',{genre:'report',questionSetB:[
    {prompt:'1. 彼は泳ぐことができますか。Yes / No で答えなさい。',answer:'Yes',evidence:'He can swim.',evidenceJp:'彼は泳ぐことができます。',reason:'can swim とあります。'},
    {prompt:'2. 彼はその写真が好きですか。Yes / No で答えなさい。',answer:'Yes',evidence:'Does he like the picture? / Yes, he does.',evidenceJp:'その写真が好きですか。／はい、好きです。',reason:'質問を肯定しています。'},
    {prompt:'3. 彼はサーフィンをしますか。Yes / No で答えなさい。',answer:'No',evidence:'He doesn’t surf.',evidenceJp:'彼はサーフィンをしません。',reason:'doesn’t surf と否定しています。'},
    {prompt:'4. ブログはどのようですか。英語で1語答えなさい。',answer:'interesting',evidence:'The blog is interesting.',evidenceJp:'そのブログはおもしろいです。',reason:'interesting が評価です。'}
  ]});

  setAudit('Unit 5-3',[
    {en:'My brother and I look at a cafe website.',jp:'兄と私はカフェのウェブサイトを見ます。'},{en:'The cafe is popular.',jp:'そのカフェは人気があります。'},{en:'The owner is friendly.',jp:'オーナーは親切です。'},
    {en:'This dish is wonderful.',jp:'この料理はすばらしいです。'},{en:'A fried egg is on top of the dish.',jp:'料理の上には目玉焼きがあります。'},{en:'“Do you know this cafe?”',jp:'「このカフェを知っている？」'},
    {en:'“No, I don’t.”',jp:'「ううん、知らない。」'},{en:'“Look at this dish.”',jp:'「この料理を見て。」'},{en:'“Wonderful!”',jp:'「すばらしいね！」'},{en:'“I want to visit the cafe.”',jp:'「このカフェに行ってみたいな。」'},{en:'“Great!”',jp:'「いいね！」'}
  ]);

  setAudit('Unit 6-1',[
    {en:'This is a show / from the U.K.',jp:'これはショーです / イギリスの'},{en:'This is a performer / in the show.',jp:'こちらは出演者です / そのショーの'},{en:'Do you know him?',jp:'彼を知っていますか。'},
    {en:'Yes, I do.',jp:'はい、知っています。'},{en:'He is from the U.K.',jp:'彼はイギリス出身です。'},{en:'I like him very much.',jp:'私は彼がとても好きです。'},{en:'Why don’t we watch the show?',jp:'そのショーを見ませんか。'},
    {en:'Sounds great.',jp:'楽しそうだね。'},{en:'We can watch it together.',jp:'私たちはいっしょに見ることができます。'},{en:'The show is interesting.',jp:'そのショーはおもしろいです。'}
  ]);

  setAudit('Unit 6-2',[
    {en:'This is a ticket.',jp:'これはチケットです。'},{en:'Whose ticket is this?',jp:'これはだれのチケットですか。'},{en:'Is it yours?',jp:'あなたのものですか。'},{en:'No, it is not.',jp:'いいえ、違います。'},
    {en:'Maybe / it is Riko’s.',jp:'たぶん / それは理子のものです'},{en:'Yes, it is.',jp:'はい、そうです。'},{en:'This history book is near the ticket.',jp:'この歴史の本はチケットの近くにあります。'},
    {en:'It is Riko’s, too.',jp:'これも理子のものです。'},{en:'Here you are, Riko.',jp:'はい、どうぞ、理子。'},{en:'Thanks.',jp:'ありがとう。'}
  ]);

  const p57=nh['Unit 6-3'];
  p57.sentences=['This is a cushion.','It is a prop in the show.','This is a towel.','It is a prop, too.','I use the cushion first.','I use the towel after the cushion.','I wear casual clothes in the show.','Which do you like, the cushion or the towel?','I like the cushion.','The cushion and the towel are different.','The show is great.'];
  p57.fullTranslation='これはクッションです。ショーで使う小道具です。これはタオルです。これも小道具です。私は最初にクッションを使います。クッションのあとにタオルを使います。ショーではカジュアルな服を着ます。「クッションとタオルでは、どちらが好きですか。」「クッションが好きです。」クッションとタオルは違います。そのショーはすばらしいです。';
  p57.questions=[
    {prompt:'1. クッションはショーで何として使われますか。本文から英語で答えなさい。',answer:'a prop',evidence:'It is a prop in the show.',evidenceJp:'ショーで使う小道具です。',reason:'a prop が役割です。'},
    {prompt:'2. 話し手が最初に使うものは何ですか。本文から英語で答えなさい。',answer:'the cushion',evidence:'I use the cushion first.',evidenceJp:'私は最初にクッションを使います。',reason:'first とともに the cushion が示されています。'},
    {prompt:'3. クッションのあとに何を使いますか。本文から英語で答えなさい。',answer:'the towel',evidence:'I use the towel after the cushion.',evidenceJp:'クッションのあとにタオルを使います。',reason:'use の目的語が the towel です。'},
    {prompt:'4. ショーではどんな服を着ますか。本文から英語で答えなさい。',answer:'casual clothes',evidence:'I wear casual clothes in the show.',evidenceJp:'ショーではカジュアルな服を着ます。',reason:'wear の目的語が casual clothes です。'},
    {prompt:'5. クッションとタオルのどちらが好きですか。本文から英語で答えなさい。',answer:'the cushion',evidence:'Which do you like, the cushion or the towel? / I like the cushion.',evidenceJp:'クッションとタオルでは、どちらが好きですか。／クッションが好きです。',reason:'選択質問に the cushion と答えています。'}
  ];
  p57.vocabFinalAudit='PASS_REWRITTEN_TO_GATE_NOTES_0'; p57.vocabRepairReason='Removed unverified Then; used cumulative after from Unit 3-2 while preserving chronology.';
  setAudit('Unit 6-3',[
    {en:'This is a cushion.',jp:'これはクッションです。'},{en:'It is a prop / in the show.',jp:'それは小道具です / そのショーで使う'},{en:'This is a towel.',jp:'これはタオルです。'},{en:'It is a prop, too.',jp:'これも小道具です。'},
    {en:'I use the cushion first.',jp:'私は最初にクッションを使います。'},{en:'I use the towel / after the cushion.',jp:'私はタオルを使います / クッションのあとに'},{en:'I wear casual clothes / in the show.',jp:'私はカジュアルな服を着ます / そのショーで'},
    {en:'Which do you like, / the cushion or the towel?',jp:'どちらが好きですか / クッション、それともタオルを'},{en:'I like the cushion.',jp:'クッションが好きです。'},{en:'The cushion and the towel are different.',jp:'クッションとタオルは違います。'},{en:'The show is great.',jp:'そのショーはすばらしいです。'}
  ]);
  setMeta('Unit 6-3',{genre:'report',questionSetB:[
    {prompt:'1. 最初に使う小道具は何ですか。英語で答えなさい。',answer:'the cushion',evidence:'I use the cushion first.',evidenceJp:'私は最初にクッションを使います。',reason:'first とともに示されています。'},
    {prompt:'2. クッションのあとに使うものは何ですか。英語で答えなさい。',answer:'the towel',evidence:'I use the towel after the cushion.',evidenceJp:'クッションのあとにタオルを使います。',reason:'use の目的語です。'},
    {prompt:'3. ショーで着る服はどのような服ですか。英語で答えなさい。',answer:'casual clothes',evidence:'I wear casual clothes in the show.',evidenceJp:'ショーではカジュアルな服を着ます。',reason:'wear の目的語です。'},
    {prompt:'4. クッションとタオルは同じですか。Yes / No で答えなさい。',answer:'No',evidence:'The cushion and the towel are different.',evidenceJp:'クッションとタオルは違います。',reason:'different とあるので同じではありません。'}
  ]});

  setAudit('Unit 7-1',[
    {en:'What’s up?',jp:'どうしたの？'},{en:'Are you busy / tomorrow morning?',jp:'忙しいですか / 明日の朝は'},{en:'Yes, I am.',jp:'うん。'},{en:'I want to practice tennis / tomorrow morning.',jp:'テニスを練習したいです / 明日の朝に'},
    {en:'Are you free / after school?',jp:'ひまですか / 放課後は'},{en:'Yes, I am.',jp:'うん、ひまだよ。'},{en:'Why don’t we talk about tennis / after school?',jp:'テニスのことを話さない？ / 放課後に'},
    {en:'Great!',jp:'いいね！'},{en:'I look forward to tomorrow.',jp:'明日を楽しみにしています。'}
  ]);

  setAudit('Unit 7-2',[
    {en:'Welcome to this market.',jp:'この市場へようこそ。'},{en:'It is a popular place.',jp:'ここは人気のある場所です。'},{en:'I want to buy a souvenir / for my family.',jp:'私はおみやげを買いたいです / 家族のために'},
    {en:'Look at this souvenir.',jp:'このおみやげを見て。'},{en:'It is beautiful.',jp:'きれいだね。'},{en:'Do you like it?',jp:'それが好き？'},{en:'Yes, I do.',jp:'うん、好きだよ。'},{en:'Great!',jp:'いいね！'},
    {en:'I want to buy it.',jp:'私はそれを買いたいです。'},{en:'I like this market very much.',jp:'この市場がとても好きです。'}
  ]);

  setAudit('Unit 7-3',[
    {en:'Mom, are you free / tomorrow?',jp:'お母さん、ひま？ / 明日は'},{en:'Yes, I am.',jp:'うん、ひまだよ。'},{en:'Dad, are you free / tomorrow?',jp:'お父さん、ひま？ / 明日は'},{en:'Yes, I am.',jp:'うん、ひまだよ。'},
    {en:'Great!',jp:'いいね！'},{en:'Let’s travel / tomorrow.',jp:'旅行しよう / 明日'},{en:'I want to visit a palace.',jp:'宮殿を訪れたいです。'},{en:'Mom and Dad like the plan.',jp:'お母さんとお父さんもその計画が気に入っています。'},
    {en:'Sounds exciting.',jp:'楽しそうだね。'},{en:'We’re happy.',jp:'私たちはうれしいです。'}
  ]);

  window.V10_VOCAB_SLASH_MANUAL_051_060={passages:10,vocabAudited:10,slashAudited:10,rewritten:4,notes:0};
})();