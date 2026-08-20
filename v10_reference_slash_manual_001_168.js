// Final reference-based slash layer. Source of truth: 英語長文基本.pdf + 英語長文基本解答.pdf + user-supplied minimum-rule page.
// Minimum rule: slash before prepositions/conjunctions, before infinitive to + verb, and after commas; then translate chunk-by-chunk.
// This file is loaded after all older semantic/vocab slash layers and is extended continuously through passage 168.
(function(){
  const PASS='PASS_REFERENCE_20260820';
  function checkRows(p,rows,passageNo,section){
    if(!Array.isArray(p.sentences)||rows.length!==p.sentences.length) throw new Error('Reference slash row mismatch passage '+passageNo+': '+section+' '+rows.length+'/'+((p.sentences||[]).length));
    for(let i=0;i<rows.length;i++){
      const deSlash=String(rows[i].en||'').replace(/\s*\/\s*/g,' ').replace(/\s+/g,' ').trim();
      const sentence=String(p.sentences[i]||'').replace(/\s+/g,' ').trim();
      if(deSlash!==sentence) throw new Error('Reference slash changes English passage '+passageNo+' row '+(i+1)+': '+deSlash+' <> '+sentence);
      const ec=String(rows[i].en||'').split(/\s*\/\s*/).filter(Boolean).length;
      const jc=String(rows[i].jp||'').split(/\s*\/\s*/).filter(Boolean).length;
      if(ec!==jc) throw new Error('Reference EN/JP chunk mismatch passage '+passageNo+' row '+(i+1)+': '+ec+'/'+jc);
    }
  }
  function setAudit(data,section,rows,passageNo){
    const p=data&&data[section];
    if(!p) throw new Error('Missing reference-audit passage '+passageNo+': '+section);
    checkRows(p,rows,passageNo,section);
    p.slashRows=rows;
    p.slashReadingVersion='reference-book-minimum-rules-20260820';
    p.slashReferenceAudit=PASS;
    p.slashReferencePassageNo=passageNo;
  }

  const sun1=window.V10_SUNSHINE_G1||{};

  setAudit(sun1,'Get Ready 2',[
    {en:'This is my English book.',jp:'これは私の英語の本です。'},
    {en:'Really?',jp:'本当に？'},
    {en:'Yes.',jp:'うん。'},
    {en:'This is a dog.',jp:'これは犬です。'},
    {en:'I see.',jp:'なるほど。'},
    {en:'This is a cat, / too.',jp:'これはねこです / 〜もまた'},
    {en:'I write “dog” / in my notebook.',jp:'私は「dog」と書きます / 私のノートに'},
    {en:'I write “cat” / in my notebook, / too.',jp:'私は「cat」と書きます / 私のノートに / 〜もまた'},
    {en:'I can read “dog”.',jp:'私は「dog」を読むことができます。'},
    {en:'I can read “cat”, / too.',jp:'私は「cat」を読むことができます / 〜もまた'},
    {en:'Great!',jp:'すごい！'}
  ],1);

  setAudit(sun1,'Get Ready 3',[
    {en:'What subject do you like?',jp:'何の教科が好きですか。'},
    {en:'I like English.',jp:'私は英語が好きです。'},
    {en:'Really?',jp:'本当に？'},
    {en:'Yes.',jp:'うん。'},
    {en:'Do you have your English book?',jp:'英語の本を持っていますか。'},
    {en:'Yes, / I do.',jp:'はい / 持っています'},
    {en:'Can you read English?',jp:'英語を読むことができますか。'},
    {en:'Yes, / I can.',jp:'はい / できます'},
    {en:'Great!',jp:'すごい！'},
    {en:'I like English, / too.',jp:'私は英語が好きです / 〜もまた'}
  ],2);

  setAudit(sun1,'Get Ready 4',[
    {en:'I like basketball.',jp:'私はバスケットボールが好きです。'},
    {en:'I am / in the basketball club.',jp:'私はいます / バスケットボール部に'},
    {en:'I practice / in the gym / every day.',jp:'私は練習します / 体育館で / 毎日'},
    {en:'I can run.',jp:'私は走ることができます。'},
    {en:'I can jump high.',jp:'私は高くジャンプすることができます。'},
    {en:'I can shoot the ball.',jp:'私はボールをシュートすることができます。'},
    {en:'Basketball is very exciting.',jp:'バスケットボールはとてもわくわくします。'},
    {en:'Do you like basketball?',jp:'バスケットボールは好きですか。'},
    {en:'Yes, / I do.',jp:'はい / 好きです'},
    {en:'Let’s play basketball together.',jp:'いっしょにバスケットボールをしよう。'},
    {en:'Great!',jp:'いいね！'}
  ],3);

  setAudit(sun1,'Get Ready 5',[
    {en:'Do you like the zoo?',jp:'動物園は好きですか。'},
    {en:'Yes, / I do.',jp:'はい / 好きです'},
    {en:'What do you like?',jp:'何が好きですか。'},
    {en:'I like the panda / and the monkey.',jp:'私はパンダが好きです / そしてサルも'},
    {en:'I like the tiger, / too.',jp:'私はトラが好きです / 〜もまた'},
    {en:'Really?',jp:'本当に？'},
    {en:'Yes.',jp:'うん。'},
    {en:'Do you like the rabbit?',jp:'ウサギは好きですか。'},
    {en:'Yes, / I do.',jp:'はい / 好きです'},
    {en:'I like the bear, / too.',jp:'私はクマが好きです / 〜もまた'}
  ],4);

  setAudit(sun1,'Get Ready 6',[
    {en:'I had lunch / at the zoo.',jp:'私は昼食をとりました / 動物園で'},
    {en:'I ate pizza.',jp:'私はピザを食べました。'},
    {en:'I saw a panda.',jp:'私はパンダを見ました。'},
    {en:'I saw a monkey, / too.',jp:'私はサルを見ました / 〜もまた'},
    {en:'I saw a tiger.',jp:'私はトラを見ました。'},
    {en:'I saw a rabbit.',jp:'私はウサギを見ました。'},
    {en:'I saw a bear, / too.',jp:'私はクマを見ました / 〜もまた'},
    {en:'I like the panda / and the monkey.',jp:'私はパンダが好きです / そしてサルも'},
    {en:'I like the tiger, / too.',jp:'私はトラが好きです / 〜もまた'},
    {en:'I like the zoo.',jp:'私は動物園が好きです。'}
  ],5);

  setAudit(sun1,'PROGRAM 1-1',[
    {en:'Hi.',jp:'こんにちは。'},
    {en:'I’m a junior high school student.',jp:'私は中学生です。'},
    {en:'I’m friendly.',jp:'私は人なつっこいです。'},
    {en:'My teacher is kind.',jp:'私の先生は親切です。'},
    {en:'I like my teacher.',jp:'私は先生が好きです。'},
    {en:'I like music.',jp:'私は音楽が好きです。'},
    {en:'I play the trumpet.',jp:'私はトランペットを演奏します。'},
    {en:'I practice / every Wednesday.',jp:'私は練習します / 毎週水曜日に'},
    {en:'I like basketball, / too.',jp:'私はバスケットボールが好きです / 〜もまた'},
    {en:'I like my school.',jp:'私は自分の学校が好きです。'},
    {en:'School is really great.',jp:'学校は本当にすばらしいです。'},
    {en:'Goodbye.',jp:'さようなら。'}
  ],6);

  setAudit(sun1,'PROGRAM 1-2',[
    {en:'Hello.',jp:'こんにちは。'},
    {en:'I’m a student.',jp:'私は生徒です。'},
    {en:'I’m / from Australia.',jp:'私は〜出身です / オーストラリア'},
    {en:'Australia is really great.',jp:'オーストラリアは本当にすばらしいです。'},
    {en:'My teacher is / from Japan.',jp:'私の先生は〜出身です / 日本'},
    {en:'My teacher is kind.',jp:'私の先生は親切です。'},
    {en:'I like Japan.',jp:'私は日本が好きです。'},
    {en:'I like Australia, / too.',jp:'私はオーストラリアが好きです / 〜もまた'},
    {en:'I’m friendly.',jp:'私は人なつっこいです。'},
    {en:'I like my school.',jp:'私は自分の学校が好きです。'},
    {en:'School is great.',jp:'学校はすばらしいです。'},
    {en:'Goodbye.',jp:'さようなら。'}
  ],7);

  setAudit(sun1,'PROGRAM 1-3',[
    {en:'I’m a new student.',jp:'私は新しい生徒です。'},
    {en:'This is my new class.',jp:'ここが私の新しいクラスです。'},
    {en:'Nice / to meet you.',jp:'うれしいです / あなたに会えて'},
    {en:'I’m quiet.',jp:'私はおとなしいです。'},
    {en:'I’m cheerful, / too.',jp:'私は明るいです / 〜もまた'},
    {en:'I like math / and science.',jp:'私は数学が好きです / そして理科も'},
    {en:'I’m good / at math.',jp:'私は得意です / 数学が'},
    {en:'I’m good / at science, / too.',jp:'私は得意です / 理科が / 〜もまた'},
    {en:'I like Japanese.',jp:'私は国語が好きです。'},
    {en:'I’m a fan / of movies.',jp:'私はファンです / 映画の'},
    {en:'My teacher is kind.',jp:'私の先生は親切です。'},
    {en:'This city is nice.',jp:'この街はすてきです。'},
    {en:'I want / to be friendly.',jp:'私は望んでいます / 人なつっこくなることを'},
    {en:'School is really great.',jp:'学校は本当にすばらしいです。'}
  ],8);

  setAudit(sun1,'PROGRAM 2-1',[
    {en:'After school, / I ride my bicycle.',jp:'放課後 / 私は自転車に乗ります'},
    {en:'I sometimes ride / with my friend.',jp:'私はときどき乗ります / 友達といっしょに'},
    {en:'We ride / in our town.',jp:'私たちは乗ります / 私たちの町の中で'},
    {en:'Our town is beautiful.',jp:'私たちの町は美しいです。'},
    {en:'My friend / and I walk, / too.',jp:'私の友達 / そして私は歩きます / 〜もまた'},
    {en:'I like my bicycle very much.',jp:'私は自転車がとても好きです。'},
    {en:'I go home / after school.',jp:'私は家に帰ります / 放課後に'},
    {en:'At home, / I clean my bicycle.',jp:'家で / 私は自転車をきれいにします'},
    {en:'I read / at home.',jp:'私は読みます / 家で'},
    {en:'I like my town, / too.',jp:'私は自分の町が好きです / 〜もまた'},
    {en:'I like my bicycle / and my town.',jp:'私は自転車が好きです / そして自分の町も'}
  ],9);

  setAudit(sun1,'PROGRAM 2-2',[
    {en:'On the weekend, / I ride my bicycle / with my friend.',jp:'週末に / 私は自転車に乗ります / 友達といっしょに'},
    {en:'We ride / in our town.',jp:'私たちは乗ります / 私たちの町の中で'},
    {en:'Our town is beautiful.',jp:'私たちの町は美しいです。'},
    {en:'Before dinner, / I clean my bicycle.',jp:'夕食前に / 私は自転車をきれいにします'},
    {en:'I study math / before dinner.',jp:'私は数学を勉強します / 夕食前に'},
    {en:'I like math, / but I like science, / too.',jp:'私は数学が好きです / しかし私は理科が好きです / 〜もまた'},
    {en:'After dinner, / I study Japanese.',jp:'夕食後に / 私は国語を勉強します'},
    {en:'I read / at home / after dinner.',jp:'私は読みます / 家で / 夕食後に'},
    {en:'I sometimes watch tennis / after dinner.',jp:'私はときどきテニスを見ます / 夕食後に'},
    {en:'I like the weekend very much.',jp:'私は週末がとても好きです。'}
  ],10);

  window.V10_REFERENCE_SLASH_AUDIT={version:'2026-08-20',passagesAudited:10,total:168,lastCompleted:10,minimumRuleImageConfirmed:true};
})();
