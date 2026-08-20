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