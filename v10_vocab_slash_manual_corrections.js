// Corrections to final human vocabulary/slash audit decisions after broader cumulative chronology checks.
(function(){
  const nh=window.V10_NEWHORIZON_G1||{};
  const p=nh['Unit 5-2'];
  if(!p) throw new Error('Missing Unit 5-2 for final correction');
  // `water` is valid before Unit 5-2: the reviewed Unit 8-3 source gate records
  // water as `Sounds and Letters 3 cumulative`. Restore the coherent dolphin sentence
  // instead of keeping the earlier conservative removal based on an incomplete keyword search.
  Object.assign(p,{
    sentences:['This is his blog.','The blog is about his life.','He has a beautiful dolphin picture there.','Does he like the picture?','Yes, he does.','The dolphin is in the water.','He can swim.','He doesn’t surf.','Does he write about the dolphin?','Yes, he does.','The picture is very beautiful.','The blog is interesting.'],
    fullTranslation:'これは彼のブログです。そのブログは彼の生活についてのものです。そこには美しいイルカの写真があります。「彼はその写真が好きですか。」「はい、好きです。」イルカは水の中にいます。彼は泳ぐことができます。サーフィンはしません。「彼はイルカについて書きますか。」「はい、書きます。」その写真はとても美しいです。そのブログはおもしろいです。',
    slashRows:[
      {en:'This is his blog.',jp:'これは彼のブログです。'},
      {en:'The blog is about his life.',jp:'そのブログは彼の生活についてのものです。'},
      {en:'He has a beautiful dolphin picture / there.',jp:'彼は美しいイルカの写真を持っています / そこに'},
      {en:'Does he like the picture?',jp:'彼はその写真が好きですか。'},
      {en:'Yes, he does.',jp:'はい、好きです。'},
      {en:'The dolphin is in the water.',jp:'イルカは水の中にいます。'},
      {en:'He can swim.',jp:'彼は泳ぐことができます。'},
      {en:'He doesn’t surf.',jp:'彼はサーフィンをしません。'},
      {en:'Does he write about the dolphin?',jp:'彼はイルカについて書きますか。'},
      {en:'Yes, he does.',jp:'はい、書きます。'},
      {en:'The picture is very beautiful.',jp:'その写真はとても美しいです。'},
      {en:'The blog is interesting.',jp:'そのブログはおもしろいです。'}
    ],
    questions:[
      {prompt:'1. ブログは何についてですか。本文から英語で答えなさい。',answer:'his life',evidence:'The blog is about his life.',evidenceJp:'そのブログは彼の生活についてのものです。',reason:'about の後ろの his life が内容です。'},
      {prompt:'2. 彼は何の写真を持っていますか。本文から英語で答えなさい。',answer:'a beautiful dolphin picture',evidence:'He has a beautiful dolphin picture there.',evidenceJp:'そこには美しいイルカの写真があります。',reason:'has の目的語が写真です。'},
      {prompt:'3. イルカはどこにいますか。本文から英語で答えなさい。',answer:'in the water',evidence:'The dolphin is in the water.',evidenceJp:'イルカは水の中にいます。',reason:'in the water が場所です。'},
      {prompt:'4. 彼は泳ぐことができますか。本文に合うように Yes / No で答えなさい。',answer:'Yes',evidence:'He can swim.',evidenceJp:'彼は泳ぐことができます。',reason:'can swim と明示されています。'},
      {prompt:'5. 彼はサーフィンをしますか。本文に合うように Yes / No で答えなさい。',answer:'No',evidence:'He doesn’t surf.',evidenceJp:'彼はサーフィンをしません。',reason:'doesn’t surf と否定しています。'}
    ],
    vocabFinalAudit:'PASS_CUMULATIVE_SOUNDS3_WATER_NOTES_0',
    vocabRepairReason:'Final cumulative review confirmed water is already available from Sounds and Letters 3; restored coherent original sentence.'
  });
  const meta={genre:'report',questionSetB:[
    {prompt:'1. イルカはどこにいますか。英語で答えなさい。',answer:'in the water',evidence:'The dolphin is in the water.',evidenceJp:'イルカは水の中にいます。',reason:'in the water が場所です。'},
    {prompt:'2. 彼はその写真が好きですか。Yes / No で答えなさい。',answer:'Yes',evidence:'Does he like the picture? / Yes, he does.',evidenceJp:'その写真が好きですか。／はい、好きです。',reason:'質問を肯定しています。'},
    {prompt:'3. 彼はサーフィンをしますか。Yes / No で答えなさい。',answer:'No',evidence:'He doesn’t surf.',evidenceJp:'彼はサーフィンをしません。',reason:'doesn’t surf とあります。'},
    {prompt:'4. ブログはどのようですか。英語で1語答えなさい。',answer:'interesting',evidence:'The blog is interesting.',evidenceJp:'そのブログはおもしろいです。',reason:'interesting が評価です。'}
  ]};
  window.V10_INTERACTION_META=window.V10_INTERACTION_META||{};
  window.V10_INTERACTION_META['ニューホライズン|Unit 5-2']=meta;
  window.V10_INTERACTION_META['ニューホライズン|1|Unit 5-2']=meta;
})();

// SS1 Get Ready 6 chronology repair. Canonical v7 has eat/lunch in pre-step,
// but past-tense ate/saw are not introduced here (saw only appears much later as see-saw / see-saw-seen).
// Keep the zoo/lunch scene while removing future vocabulary and future past-tense grammar.
(function(){
  const ss=window.V10_SUNSHINE_G1||{};
  const p=ss['Get Ready 6'];
  if(!p) throw new Error('Missing SS1 Get Ready 6 for chronology correction');
  Object.assign(p,{
    sentences:['I eat lunch.','I am at the zoo.','I like the panda.','I like the monkey, too.','I like the tiger.','I like the rabbit.','I like the bear, too.','Do you like the tiger?','Yes, I do.','Great!'],
    fullTranslation:'私は昼食を食べます。私は動物園にいます。私はパンダが好きです。サルも好きです。トラが好きです。ウサギが好きです。クマも好きです。「あなたはトラが好きですか。」「はい、好きです。」「いいね！」',
    slashRows:[
      {en:'I eat lunch.',jp:'私は昼食を食べます。'},
      {en:'I am / at the zoo.',jp:'私はいます / 動物園に'},
      {en:'I like the panda.',jp:'私はパンダが好きです。'},
      {en:'I like the monkey, too.',jp:'私はサルも好きです。'},
      {en:'I like the tiger.',jp:'私はトラが好きです。'},
      {en:'I like the rabbit.',jp:'私はウサギが好きです。'},
      {en:'I like the bear, too.',jp:'私はクマも好きです。'},
      {en:'Do you like the tiger?',jp:'あなたはトラが好きですか。'},
      {en:'Yes, I do.',jp:'はい、好きです。'},
      {en:'Great!',jp:'いいね！'}
    ],
    questions:[
      {prompt:'1. 「私」は何を食べますか。本文から英語で答えなさい。',answer:'lunch',evidence:'I eat lunch.',evidenceJp:'私は昼食を食べます。',reason:'eat の後ろの lunch が食べるものです。'},
      {prompt:'2. 「私」はどこにいますか。本文から英語で抜き出しなさい。',answer:'at the zoo',evidence:'I am at the zoo.',evidenceJp:'私は動物園にいます。',reason:'at the zoo が場所を表しています。'},
      {prompt:'3. 「私」が好きな動物を5種類、英語で答えなさい。',answer:'panda, monkey, tiger, rabbit, bear',evidence:'I like the panda. / I like the monkey, too. / I like the tiger. / I like the rabbit. / I like the bear, too.',evidenceJp:'パンダ、サル、トラ、ウサギ、クマが好きだと書かれています。',reason:'like の後ろの動物名を順番に拾うと5種類すべて分かります。'},
      {prompt:'4. トラは好きですか。本文に合うように Yes / No で答えなさい。',answer:'Yes',evidence:'Do you like the tiger? / Yes, I do.',evidenceJp:'トラが好きですか。／はい、好きです。',reason:'質問に対して Yes, I do. と答えています。'}
    ],
    allowedWords:[['lunch','SS1 pre-step v7'],['eat','SS1 pre-step v7'],['zoo','Get Ready 5 cumulative'],['panda','Get Ready 5 cumulative'],['monkey','Get Ready 5 cumulative'],['tiger','Get Ready 5 cumulative'],['rabbit','Get Ready 5 cumulative'],['bear','Get Ready 5 cumulative'],['at','elementary'],['the','Get Ready 4 cumulative'],['like','Get Ready 3 cumulative'],['do','Get Ready 3 cumulative'],['you','Get Ready 3 cumulative'],['I','Get Ready 2 cumulative'],['am','elementary'],['too','Get Ready 2 cumulative'],['great','Get Ready 2 cumulative'],['yes','elementary']],
    auditNote:'v7 chronology repair: removed had / ate / saw and the unregistered pizza. Canonical v7 confirms SS1 pre-step eat and lunch; the zoo animal vocabulary is cumulative from Get Ready 5. No past-tense morphology is used.',
    vocabFinalAudit:'PASS_V7_CHRONOLOGY_REPAIR_PENDING_FULL_SCAN',
    slashHumanAudit:'PASS_MODEL_ALIGNED'
  });
  const meta={genre:'diary',questionSetB:[
    {prompt:'1. 「私」は昼食を食べますか。本文に合うように Yes / No で答えなさい。',answer:'Yes',evidence:'I eat lunch.',evidenceJp:'私は昼食を食べます。',reason:'I eat lunch. と明示されています。'},
    {prompt:'2. 「私」はどこにいますか。英語で答えなさい。',answer:'at the zoo',evidence:'I am at the zoo.',evidenceJp:'私は動物園にいます。',reason:'at the zoo が場所です。'},
    {prompt:'3. 「私」が好きな動物を2つ英語で答えなさい。',answer:'panda and monkey',evidence:'I like the panda. / I like the monkey, too.',evidenceJp:'私はパンダが好きです。／サルも好きです。',reason:'最初の2つの like 文から分かります。'},
    {prompt:'4. 「私」はクマが好きですか。Yes / No で答えなさい。',answer:'Yes',evidence:'I like the bear, too.',evidenceJp:'私はクマも好きです。',reason:'like the bear と明示されています。'},
    {prompt:'5. トラについての質問への答えを本文から抜き出しなさい。',answer:'Yes, I do.',evidence:'Do you like the tiger? / Yes, I do.',evidenceJp:'トラが好きですか。／はい、好きです。',reason:'質問直後の返答です。'}
  ]};
  window.V10_INTERACTION_META=window.V10_INTERACTION_META||{};
  window.V10_INTERACTION_META['サンシャイン|Get Ready 6']=meta;
  window.V10_INTERACTION_META['サンシャイン|1|Get Ready 6']=meta;
})();

// NH2 Unit 2-2 reference/v7 chronology repair.
// v7 introduces `speech` in Unit 2 Part2, while `give-gave` is not introduced until Let's Read 1.
// The reference sentence uses the already-learned `talk`, so keep that wording everywhere instead of leaking `give`.
(function(){
  const nh=window.V10_PASSAGES_G2_NH||{};
  const p=nh['Unit 2-2'];
  if(!p) throw new Error('Missing NH2 Unit 2-2 for chronology correction');
  const oldSentence='At school, I give a short speech about local food.';
  const newSentence='At school, I talk about local food in a short speech.';
  p.sentences=(p.sentences||[]).map(s=>s===oldSentence?newSentence:s);
  if(Array.isArray(p.slashRows)&&p.slashRows[0]){
    p.slashRows[0]={en:'At school, / I talk about local food / in a short speech.',jp:'学校で / 私は地元の食べ物について話します / 短いスピーチで'};
  }
  p.fullTranslation=String(p.fullTranslation||'').replace('学校で、私は地元の食べ物について短いスピーチをします。','学校で、私は短いスピーチで地元の食べ物について話します。');
  for(const q of (p.questions||[])){
    if(q&&q.evidence===oldSentence){
      q.evidence=newSentence;
      q.evidenceJp='学校で、私は短いスピーチで地元の食べ物について話します。';
      q.reason='talk about の後ろの local food が話す内容です。';
    }
  }
  p.auditNote=String(p.auditNote||'')+' v7 chronology repair: Unit 2 Part2 speech is retained, but future give (introduced in Let’s Read 1) is replaced by cumulative talk; wording is aligned to the authoritative reference slash sentence.';
  p.vocabFinalAudit='PASS_V7_GIVE_TO_TALK_REFERENCE_ALIGNED_PENDING_FULL_SCAN';
  const keys=['ニューホライズン|Unit 2-2','ニューホライズン|2|Unit 2-2'];
  window.V10_INTERACTION_META=window.V10_INTERACTION_META||{};
  for(const key of keys){
    const meta=window.V10_INTERACTION_META[key];
    if(!meta||!Array.isArray(meta.questionSetB)) continue;
    for(const q of meta.questionSetB){
      if(q&&q.evidence===oldSentence){
        q.evidence=newSentence;
        q.evidenceJp='学校で、私は短いスピーチで地元の食べ物について話します。';
        q.reason='talk about の後ろの local food が話す内容です。';
      }
    }
  }
})();
