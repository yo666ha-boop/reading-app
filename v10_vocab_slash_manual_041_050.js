// Human-reviewed vocabulary/slash final audit overrides for passages 041-050.
// This batch also repairs two genuine chronology leaks found by the final vocabulary audit:
// 049 Unit 4-1 used picture (canonical master: Unit 4 Part2) and an unapproved plural animals.
// 050 Unit 4-2 used future will before it is introduced.
(function(){
  const nh=window.V10_NEWHORIZON_G1||{};
  function setAudit(section,rows){
    const p=nh[section];
    if(!p) throw new Error('Missing audited passage: '+section);
    if(rows.length!==p.sentences.length) throw new Error('Slash row count mismatch: '+section+' '+rows.length+'/'+p.sentences.length);
    p.slashRows=rows;
    p.vocabFinalAudit='PASS_REVIEWED_GATE_RECHECK_NOTES_0';
    p.slashHumanAudit='PASS_MODEL_ALIGNED';
  }
  function setMeta(section,meta){
    const plain='ニューホライズン|'+section;
    const graded='ニューホライズン|1|'+section;
    window.V10_INTERACTION_META=window.V10_INTERACTION_META||{};
    window.V10_INTERACTION_META[plain]=meta;
    window.V10_INTERACTION_META[graded]=meta;
    if(window.V10_INTERACTION_META_SEMANTIC_REPAIRS_041_050)window.V10_INTERACTION_META_SEMANTIC_REPAIRS_041_050[plain]=meta;
  }

  setAudit('Unit 1-2',[
    {en:'Do you like rugby?',jp:'ラグビーは好きですか。'},
    {en:'Yes, I do.',jp:'はい、好きです。'},
    {en:'I’m a rugby fan, too.',jp:'私もラグビーファンです。'},
    {en:'I often watch rugby / with my friends.',jp:'私はよくラグビーを見ます / 友達といっしょに'},
    {en:'Do you play rugby?',jp:'ラグビーをしますか。'},
    {en:'No, I don’t.',jp:'いいえ、しません。'},
    {en:'But I play soccer.',jp:'でも、サッカーをします。'},
    {en:'Oh, I play soccer, too.',jp:'ああ、私もサッカーをします。'},
    {en:'We can play soccer together.',jp:'私たちはいっしょにサッカーができます。'}
  ]);

  setAudit('Unit 1-3',[
    {en:'Do you like comics?',jp:'マンガは好きですか。'},
    {en:'Yes, I do.',jp:'はい、好きです。'},
    {en:'I draw comics, too.',jp:'私はマンガもかきます。'},
    {en:'Wow!',jp:'わあ！'},
    {en:'I’m an anime fan, too.',jp:'私はアニメのファンでもあります。'},
    {en:'Are you in the art club?',jp:'美術部に入っていますか。'},
    {en:'Yes, I am.',jp:'はい、入っています。'},
    {en:'How about you?',jp:'あなたはどうですか。'},
    {en:'I’m not in a school club / now.',jp:'私は学校の部活には入っていません / 今は'},
    {en:'But I take swimming lessons.',jp:'でも、水泳のレッスンを受けています。'},
    {en:'I see.',jp:'なるほど。'}
  ]);

  setAudit('Unit 2-1',[
    {en:'This is Ms. Brown.',jp:'こちらはブラウン先生です。'},
    {en:'She’s our new teacher.',jp:'彼女は私たちの新しい先生です。'},
    {en:'She’s from Canada.',jp:'カナダ出身です。'},
    {en:'She’s cool.',jp:'かっこいい先生です。'},
    {en:'This is Leo.',jp:'こちらはレオです。'},
    {en:'He’s in our class.',jp:'彼は私たちのクラスにいます。'},
    {en:'He’s from America.',jp:'アメリカ出身です。'},
    {en:'He’s on our tennis team.',jp:'彼は私たちのテニスチームの一員です。'},
    {en:'He’s good at tennis.',jp:'テニスが得意です。'},
    {en:'I’m on the tennis team, too.',jp:'私もそのテニスチームの一員です。'},
    {en:'Our team is cool.',jp:'私たちのチームはかっこいいです。'}
  ]);

  setAudit('Unit 2-2',[
    {en:'This is my father.',jp:'こちらは私の父です。'},
    {en:'He’s from China.',jp:'父は中国出身です。'},
    {en:'He can make Chinese food / very well.',jp:'父は中国料理を作ることができます / とても上手に'},
    {en:'Do you like Chinese food?',jp:'中国料理は好きですか。'},
    {en:'Yes, I do.',jp:'はい、好きです。'},
    {en:'Can you make Chinese food?',jp:'中国料理を作ることができますか。'},
    {en:'No, I can’t.',jp:'いいえ、できません。'},
    {en:'My father can.',jp:'私の父はできます。'},
    {en:'Really?',jp:'本当？'},
    {en:'Yes.',jp:'うん。'},
    {en:'That’s cool.',jp:'それはかっこいいね。'}
  ]);

  setAudit('Unit 2-3',[
    {en:'Oops!',jp:'おっと！'},
    {en:'Excuse me.',jp:'すみません。'},
    {en:'Is this your English book?',jp:'これはあなたの英語の本ですか。'},
    {en:'Yes, it is.',jp:'はい、そうです。'},
    {en:'Is this your notebook, too?',jp:'これもあなたのノートですか。'},
    {en:'Yes, it is.',jp:'はい、そうです。'},
    {en:'Here you are.',jp:'はい、どうぞ。'},
    {en:'Thank you.',jp:'ありがとう。'},
    {en:'You’re welcome.',jp:'どういたしまして。'}
  ]);

  setAudit('Unit 3-1',[
    {en:'What’s your favorite character?',jp:'あなたのいちばん好きな登場人物はだれですか。'},
    {en:'My favorite character is Hana.',jp:'私のいちばん好きな登場人物はハナです。'},
    {en:'Who’s Hana?',jp:'ハナってだれですか。'},
    {en:'She’s a character / in this comic.',jp:'彼女は登場人物です / このマンガの中の'},
    {en:'She’s kind.',jp:'彼女はやさしいです。'},
    {en:'She’s also brave.',jp:'それに勇かんです。'},
    {en:'She’s interesting and cool.',jp:'彼女はおもしろくて、かっこいいです。'},
    {en:'Why is she your favorite character?',jp:'なぜ彼女がいちばん好きな登場人物なのですか。'},
    {en:'She’s kind and brave.',jp:'彼女はやさしくて勇かんです。'},
    {en:'I see.',jp:'なるほど。'}
  ]);

  setAudit('Unit 3-2',[
    {en:'When do you study English?',jp:'いつ英語を勉強しますか。'},
    {en:'I study English / after school.',jp:'私は英語を勉強します / 放課後に'},
    {en:'Do you study online?',jp:'オンラインで勉強しますか。'},
    {en:'Yes, I do.',jp:'はい、します。'},
    {en:'I study online / with my friend.',jp:'私はオンラインで勉強します / 友達と'},
    {en:'We study English together.',jp:'私たちはいっしょに英語を勉強します。'},
    {en:'After school, / I walk home / with my friend.',jp:'放課後 / 私は家まで歩きます / 友達と'},
    {en:'We talk about English.',jp:'私たちは英語について話します。'},
    {en:'I like our study time.',jp:'私は私たちの勉強時間が好きです。'}
  ]);

  setAudit('Unit 3-3',[
    {en:'Where do you practice tennis?',jp:'どこでテニスを練習しますか。'},
    {en:'I practice tennis / near the park.',jp:'私はテニスを練習します / 公園の近くで'},
    {en:'The park is near the station.',jp:'その公園は駅の近くです。'},
    {en:'I go there / after school.',jp:'私はそこへ行きます / 放課後に'},
    {en:'I practice with my friend.',jp:'友達と練習します。'},
    {en:'We practice hard.',jp:'私たちは一生懸命練習します。'},
    {en:'I want to win.',jp:'私は勝ちたいです。'},
    {en:'Good luck.',jp:'がんばって。'},
    {en:'Thank you.',jp:'ありがとう。'}
  ]);

  const p49=nh['Unit 4-1'];
  if(!p49)throw new Error('Missing Unit 4-1');
  Object.assign(p49,{
    title:'A Puppy and a Cat in New Zealand',
    sentences:['This is a puppy.','This is a cat, too.','They are small.','I like the puppy.','I like the cat, too.','They are in New Zealand.','I want to visit New Zealand someday.','New Zealand is interesting.'],
    fullTranslation:'これは子イヌです。こちらはネコです。どちらも小さいです。私はその子イヌが好きです。ネコも好きです。2匹はニュージーランドにいます。私はいつかニュージーランドを訪れたいです。ニュージーランドはおもしろそうです。',
    slashRows:[
      {en:'This is a puppy.',jp:'これは子イヌです。'},
      {en:'This is a cat, too.',jp:'こちらはネコでもあります。'},
      {en:'They are small.',jp:'どちらも小さいです。'},
      {en:'I like the puppy.',jp:'私はその子イヌが好きです。'},
      {en:'I like the cat, too.',jp:'ネコも好きです。'},
      {en:'They are in New Zealand.',jp:'2匹はニュージーランドにいます。'},
      {en:'I want to visit New Zealand / someday.',jp:'私はニュージーランドを訪れたいです / いつか'},
      {en:'New Zealand is interesting.',jp:'ニュージーランドはおもしろそうです。'}
    ],
    questions:[
      {prompt:'1. 最初に紹介される動物は何ですか。英語で答えなさい。',answer:'a puppy',evidence:'This is a puppy.',evidenceJp:'これは子イヌです。',reason:'最初の文で a puppy と紹介されています。'},
      {prompt:'2. もう一つ紹介される動物は何ですか。英語で答えなさい。',answer:'a cat',evidence:'This is a cat, too.',evidenceJp:'こちらはネコでもあります。',reason:'2つ目の動物として a cat が示されています。'},
      {prompt:'3. 2匹は大きいですか、小さいですか。英語で1語答えなさい。',answer:'small',evidence:'They are small.',evidenceJp:'どちらも小さいです。',reason:'small が2匹の大きさを表しています。'},
      {prompt:'4. 2匹はどこにいますか。英語で答えなさい。',answer:'New Zealand',evidence:'They are in New Zealand.',evidenceJp:'2匹はニュージーランドにいます。',reason:'in の後ろが New Zealand です。'},
      {prompt:'5. 話し手はいつニュージーランドを訪れたいですか。英語で答えなさい。',answer:'someday',evidence:'I want to visit New Zealand someday.',evidenceJp:'私はいつかニュージーランドを訪れたいです。',reason:'someday が時を表しています。'}
    ],
    vocabFinalAudit:'PASS_REWRITTEN_TO_GATE_NOTES_0',
    slashHumanAudit:'PASS_MODEL_ALIGNED',
    vocabRepairReason:'Removed picture (canonical master: Unit 4 Part2, later than Unit 4-1) and avoided auto-generated plural animals.'
  });
  setMeta('Unit 4-1',{genre:'report',questionSetB:[
    {prompt:'1. 紹介される2つの動物は何ですか。英語で答えなさい。',answer:'a puppy and a cat',evidence:'This is a puppy. / This is a cat, too.',evidenceJp:'これは子イヌです。／こちらはネコでもあります。',reason:'2つの動物が順に紹介されています。'},
    {prompt:'2. 2匹はどのような大きさですか。英語で1語答えなさい。',answer:'small',evidence:'They are small.',evidenceJp:'どちらも小さいです。',reason:'small が大きさです。'},
    {prompt:'3. 2匹はどこにいますか。英語で答えなさい。',answer:'New Zealand',evidence:'They are in New Zealand.',evidenceJp:'2匹はニュージーランドにいます。',reason:'in の後ろが New Zealand です。'},
    {prompt:'4. 話し手はニュージーランドを訪れたいですか。Yes / No で答えなさい。',answer:'Yes',evidence:'I want to visit New Zealand someday.',evidenceJp:'私はいつかニュージーランドを訪れたいです。',reason:'want to visit と明示されています。'}
  ]});

  const p50=nh['Unit 4-2'];
  if(!p50)throw new Error('Missing Unit 4-2');
  Object.assign(p50,{
    sentences:['Basketball is my favorite sport.','I practice basketball in the afternoon.','My friend and I practice basketball.','We practice near the park.','We practice hard.','We want to win.','We like basketball.','Basketball is great.'],
    fullTranslation:'バスケットボールは私のいちばん好きなスポーツです。午後にバスケットボールを練習します。友達と私はバスケットボールを練習します。私たちは公園の近くで練習します。私たちは一生懸命練習します。私たちは勝ちたいです。私たちはバスケットボールが好きです。バスケットボールはすばらしいです。',
    slashRows:[
      {en:'Basketball is my favorite sport.',jp:'バスケットボールは私のいちばん好きなスポーツです。'},
      {en:'I practice basketball / in the afternoon.',jp:'私はバスケットボールを練習します / 午後に'},
      {en:'My friend and I practice basketball.',jp:'友達と私はバスケットボールを練習します。'},
      {en:'We practice / near the park.',jp:'私たちは練習します / 公園の近くで'},
      {en:'We practice hard.',jp:'私たちは一生懸命練習します。'},
      {en:'We want to win.',jp:'私たちは勝ちたいです。'},
      {en:'We like basketball.',jp:'私たちはバスケットボールが好きです。'},
      {en:'Basketball is great.',jp:'バスケットボールはすばらしいです。'}
    ],
    questions:[
      {prompt:'1. 話し手のいちばん好きなスポーツは何ですか。英語で答えなさい。',answer:'Basketball',evidence:'Basketball is my favorite sport.',evidenceJp:'バスケットボールは私のいちばん好きなスポーツです。',reason:'favorite sport として Basketball が示されています。'},
      {prompt:'2. いつバスケットボールを練習しますか。英語で答えなさい。',answer:'in the afternoon',evidence:'I practice basketball in the afternoon.',evidenceJp:'午後にバスケットボールを練習します。',reason:'in the afternoon が時を表しています。'},
      {prompt:'3. 誰とバスケットボールを練習しますか。英語で答えなさい。',answer:'my friend',evidence:'My friend and I practice basketball.',evidenceJp:'友達と私はバスケットボールを練習します。',reason:'My friend and I の中の my friend がいっしょに練習する相手です。'},
      {prompt:'4. どのように練習しますか。英語で1語答えなさい。',answer:'hard',evidence:'We practice hard.',evidenceJp:'私たちは一生懸命練習します。',reason:'hard が練習のしかたです。'},
      {prompt:'5. 2人は何をしたいですか。英語で答えなさい。',answer:'win',evidence:'We want to win.',evidenceJp:'私たちは勝ちたいです。',reason:'want to の後ろが win です。'}
    ],
    vocabFinalAudit:'PASS_REWRITTEN_TO_GATE_NOTES_0',
    slashHumanAudit:'PASS_MODEL_ALIGNED',
    vocabRepairReason:'Removed premature future auxiliary will and unnecessary again/tomorrow wording; rebuilt with cumulative Unit 3-3 and Unit 4-2 vocabulary.'
  });
  setMeta('Unit 4-2',{genre:'report',questionSetB:[
    {prompt:'1. いつ練習しますか。英語で答えなさい。',answer:'in the afternoon',evidence:'I practice basketball in the afternoon.',evidenceJp:'午後にバスケットボールを練習します。',reason:'in the afternoon が時です。'},
    {prompt:'2. 誰とバスケットボールを練習しますか。英語で答えなさい。',answer:'my friend',evidence:'My friend and I practice basketball.',evidenceJp:'友達と私はバスケットボールを練習します。',reason:'My friend and I が2人を示しています。'},
    {prompt:'3. どのように練習しますか。英語で1語答えなさい。',answer:'hard',evidence:'We practice hard.',evidenceJp:'私たちは一生懸命練習します。',reason:'hard が練習のしかたです。'},
    {prompt:'4. 2人の目標は何ですか。英語で答えなさい。',answer:'win',evidence:'We want to win.',evidenceJp:'私たちは勝ちたいです。',reason:'want to の後ろが win です。'}
  ]});

  window.V10_VOCAB_SLASH_MANUAL_041_050={passages:10,vocabAudited:10,slashAudited:10,rewritten:2,notes:0};
})();