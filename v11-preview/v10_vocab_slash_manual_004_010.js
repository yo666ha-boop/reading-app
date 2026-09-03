// Human-reviewed vocabulary/slash final audit overrides for passages 004-010.
// Keep short basic clauses intact; split only at natural front-to-back meaning chunks.
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

  setAudit('Get Ready 5',[
    {en:'Do you like the zoo?',jp:'動物園は好きですか。'},
    {en:'Yes, I do.',jp:'はい、好きです。'},
    {en:'What do you like?',jp:'何が好きですか。'},
    {en:'I like the panda and the monkey.',jp:'パンダとサルが好きです。'},
    {en:'I like the tiger, too.',jp:'トラも好きです。'},
    {en:'Really?',jp:'本当に？'},
    {en:'Yes.',jp:'うん。'},
    {en:'Do you like the rabbit?',jp:'ウサギは好きですか。'},
    {en:'Yes, I do.',jp:'はい、好きです。'},
    {en:'I like the bear, too.',jp:'クマも好きです。'}
  ]);

  setAudit('Get Ready 6',[
    {en:'I had lunch / at the zoo.',jp:'私は昼食をとりました / 動物園で'},
    {en:'I ate pizza.',jp:'ピザを食べました。'},
    {en:'I saw a panda.',jp:'パンダを見ました。'},
    {en:'I saw a monkey, too.',jp:'サルも見ました。'},
    {en:'I saw a tiger.',jp:'トラを見ました。'},
    {en:'I saw a rabbit.',jp:'ウサギを見ました。'},
    {en:'I saw a bear, too.',jp:'クマも見ました。'},
    {en:'I like the panda and the monkey.',jp:'私はパンダとサルが好きです。'},
    {en:'I like the tiger, too.',jp:'トラも好きです。'},
    {en:'I like the zoo.',jp:'動物園が好きです。'}
  ]);

  setAudit('PROGRAM 1-1',[
    {en:'Hi.',jp:'こんにちは。'},
    {en:'I’m a junior high school student.',jp:'私は中学生です。'},
    {en:'I’m friendly.',jp:'私は人なつっこいです。'},
    {en:'My teacher is kind.',jp:'私の先生は親切です。'},
    {en:'I like my teacher.',jp:'先生が好きです。'},
    {en:'I like music.',jp:'音楽が好きです。'},
    {en:'I play the trumpet.',jp:'トランペットを演奏します。'},
    {en:'I practice / every Wednesday.',jp:'私は練習します / 毎週水曜日に'},
    {en:'I like basketball, too.',jp:'バスケットボールも好きです。'},
    {en:'I like my school.',jp:'自分の学校が好きです。'},
    {en:'School is really great.',jp:'学校は本当にすばらしいです。'},
    {en:'Goodbye.',jp:'さようなら。'}
  ]);

  setAudit('PROGRAM 1-2',[
    {en:'Hello.',jp:'こんにちは。'},
    {en:'I’m a student.',jp:'私は生徒です。'},
    {en:'I’m from Australia.',jp:'オーストラリア出身です。'},
    {en:'Australia is really great.',jp:'オーストラリアは本当にすばらしいです。'},
    {en:'My teacher is from Japan.',jp:'私の先生は日本出身です。'},
    {en:'My teacher is kind.',jp:'先生は親切です。'},
    {en:'I like Japan.',jp:'私は日本が好きです。'},
    {en:'I like Australia, too.',jp:'オーストラリアも好きです。'},
    {en:'I’m friendly.',jp:'私は人なつっこいです。'},
    {en:'I like my school.',jp:'自分の学校が好きです。'},
    {en:'School is great.',jp:'学校はすばらしいです。'},
    {en:'Goodbye.',jp:'さようなら。'}
  ]);

  setAudit('PROGRAM 1-3',[
    {en:'I’m a new student.',jp:'私は新しい生徒です。'},
    {en:'This is my new class.',jp:'ここが私の新しいクラスです。'},
    {en:'Nice to meet you.',jp:'はじめまして。'},
    {en:'I’m quiet.',jp:'私はおとなしいです。'},
    {en:'I’m cheerful, too.',jp:'明るい性格でもあります。'},
    {en:'I like math and science.',jp:'数学と理科が好きです。'},
    {en:'I’m good at math.',jp:'数学が得意です。'},
    {en:'I’m good at science, too.',jp:'理科も得意です。'},
    {en:'I like Japanese.',jp:'国語が好きです。'},
    {en:'I’m a fan of movies.',jp:'映画のファンです。'},
    {en:'My teacher is kind.',jp:'私の先生は親切です。'},
    {en:'This city is nice.',jp:'この街はすてきです。'},
    {en:'I want to be friendly.',jp:'人なつっこくなりたいです。'},
    {en:'School is really great.',jp:'学校は本当にすばらしいです。'}
  ]);

  setAudit('PROGRAM 2-1',[
    {en:'After school, / I ride my bicycle.',jp:'放課後 / 私は自転車に乗ります'},
    {en:'I sometimes ride / with my friend.',jp:'私はときどき自転車に乗ります / 友達といっしょに'},
    {en:'We ride / in our town.',jp:'私たちは自転車に乗ります / 町の中で'},
    {en:'Our town is beautiful.',jp:'私たちの町は美しいです。'},
    {en:'My friend and I walk, too.',jp:'友達と私は歩くこともあります。'},
    {en:'I like my bicycle very much.',jp:'私は自転車がとても好きです。'},
    {en:'I go home / after school.',jp:'私は家に帰ります / 放課後に'},
    {en:'At home, / I clean my bicycle.',jp:'家で / 私は自転車をきれいにします'},
    {en:'I read / at home.',jp:'私は読みます / 家で'},
    {en:'I like my town, too.',jp:'自分の町も好きです。'},
    {en:'I like my bicycle and my town.',jp:'自転車も町も好きです。'}
  ]);

  setAudit('PROGRAM 2-2',[
    {en:'On the weekend, / I ride my bicycle / with my friend.',jp:'週末に / 私は自転車に乗ります / 友達といっしょに'},
    {en:'We ride / in our town.',jp:'私たちは自転車に乗ります / 町の中で'},
    {en:'Our town is beautiful.',jp:'私たちの町は美しいです。'},
    {en:'Before dinner, / I clean my bicycle.',jp:'夕食前に / 私は自転車をきれいにします'},
    {en:'I study math / before dinner.',jp:'私は数学を勉強します / 夕食前に'},
    {en:'I like math, / but I like science, too.',jp:'私は数学が好きです / しかし理科も好きです'},
    {en:'After dinner, / I study Japanese.',jp:'夕食後に / 私は国語を勉強します'},
    {en:'I read / at home / after dinner.',jp:'私は読みます / 家で / 夕食後に'},
    {en:'I sometimes watch tennis / after dinner.',jp:'私はときどきテニスを見ます / 夕食後に'},
    {en:'I like the weekend very much.',jp:'私は週末がとても好きです。'}
  ]);

  window.V10_VOCAB_SLASH_MANUAL_004_010={passages:7,vocabAudited:7,slashAudited:7,notes:0};
})();
