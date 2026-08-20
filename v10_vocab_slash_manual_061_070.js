// Human-reviewed vocabulary/slash final audit overrides for passages 061-070.
(function(){
  const nh=window.V10_NEWHORIZON_G1||{};
  const ss2=window.V10_PASSAGES_G2_SS||{};
  function setAudit(data,section,rows){const p=data[section];if(!p)throw new Error('Missing '+section);if(rows.length!==p.sentences.length)throw new Error('Slash mismatch '+section);p.slashRows=rows;p.slashHumanAudit='PASS_MODEL_ALIGNED';p.vocabFinalAudit=p.vocabFinalAudit||'PASS_REVIEWED_GATE_RECHECK_NOTES_0';}
  function setMeta(book,grade,section,meta){const plain=book+'|'+section,graded=book+'|'+grade+'|'+section;window.V10_INTERACTION_META=window.V10_INTERACTION_META||{};window.V10_INTERACTION_META[plain]=meta;window.V10_INTERACTION_META[graded]=meta;}

  const p61=nh['Unit 8-1'];
  p61.sentences=['This is a volunteer in Kenya.','The children are in need.','He can teach the children.','The children respect him.','I respect him, too.','I want to become a volunteer.','I want to teach children someday.','I want to do my best.'];
  p61.fullTranslation='こちらはケニアのボランティアです。その子どもたちは困っています。彼は子どもたちに教えることができます。子どもたちは彼を尊敬しています。私も彼を尊敬しています。私はボランティアになりたいです。いつか子どもたちに教えたいです。最善を尽くしたいです。';
  p61.questions=[
    {prompt:'1. そのボランティアはどこで活動していますか。本文から英語で答えなさい。',answer:'Kenya',evidence:'This is a volunteer in Kenya.',evidenceJp:'こちらはケニアのボランティアです。',reason:'in Kenya が場所です。'},
    {prompt:'2. 子どもたちはどのような状態ですか。本文から英語で答えなさい。',answer:'in need',evidence:'The children are in need.',evidenceJp:'その子どもたちは困っています。',reason:'in need が状態です。'},
    {prompt:'3. ボランティアは子どもたちに何ができますか。本文から英語で答えなさい。',answer:'teach',evidence:'He can teach the children.',evidenceJp:'彼は子どもたちに教えることができます。',reason:'can の後ろが teach です。'},
    {prompt:'4. 子どもたちはそのボランティアを尊敬していますか。Yes / No で答えなさい。',answer:'Yes',evidence:'The children respect him.',evidenceJp:'子どもたちは彼を尊敬しています。',reason:'respect him と明示されています。'},
    {prompt:'5. 話し手は何になりたいですか。本文から英語で答えなさい。',answer:'a volunteer',evidence:'I want to become a volunteer.',evidenceJp:'私はボランティアになりたいです。',reason:'become の後ろです。'}
  ];
  p61.vocabFinalAudit='PASS_REWRITTEN_TO_GATE_NOTES_0';p61.vocabRepairReason='Removed simple help them. The earlier canonical item is the phrase help A with B; the Unit 8-1 reviewed gate itself does not license bare help as used here.';
  setAudit(nh,'Unit 8-1',p61.sentences.map((en,i)=>({en,jp:['こちらはケニアのボランティアです。','その子どもたちは困っています。','彼は子どもたちに教えることができます。','子どもたちは彼を尊敬しています。','私も彼を尊敬しています。','私はボランティアになりたいです。','私は子どもたちに教えたいです / いつか','私は最善を尽くしたいです。'][i]})).map((r,i)=>i===6?{en:'I want to teach children / someday.',jp:r.jp}:r));
  setMeta('ニューホライズン','1','Unit 8-1',{genre:'report',questionSetB:[
    {prompt:'1. 子どもたちは困っていますか。Yes / No で答えなさい。',answer:'Yes',evidence:'The children are in need.',evidenceJp:'その子どもたちは困っています。',reason:'in need とあります。'},
    {prompt:'2. ボランティアは子どもたちに教えられますか。Yes / No で答えなさい。',answer:'Yes',evidence:'He can teach the children.',evidenceJp:'彼は子どもたちに教えることができます。',reason:'can teach とあります。'},
    {prompt:'3. 話し手も彼を尊敬していますか。Yes / No で答えなさい。',answer:'Yes',evidence:'I respect him, too.',evidenceJp:'私も彼を尊敬しています。',reason:'respect him, too とあります。'},
    {prompt:'4. 話し手はいつか誰に教えたいですか。英語で答えなさい。',answer:'children',evidence:'I want to teach children someday.',evidenceJp:'いつか子どもたちに教えたいです。',reason:'teach の後ろが children です。'}]});

  const p62=nh['Unit 8-2'];
  p62.title='A Reusable Straw and a Paper Straw';
  p62.sentences=['This is my reusable straw.','It is plastic.','I use it at home.','This is a paper straw.','I use the paper straw at a cafe.','I like the reusable straw.','I like the paper straw, too.','I want to reduce waste.'];
  p62.fullTranslation='これは私の再利用できるストローです。プラスチック製です。家で使います。こちらは紙のストローです。カフェでは紙のストローを使います。私は再利用できるストローが好きです。紙のストローも好きです。ごみを減らしたいです。';
  p62.questions=[
    {prompt:'1. 最初のストローは何製ですか。本文から英語で1語抜き出しなさい。',answer:'plastic',evidence:'It is plastic.',evidenceJp:'プラスチック製です。',reason:'plastic が材質です。'},
    {prompt:'2. 再利用できるストローはどこで使いますか。本文から英語で答えなさい。',answer:'at home',evidence:'I use it at home.',evidenceJp:'家で使います。',reason:'at home が場所です。'},
    {prompt:'3. 最初のストローは再利用できるものですか。Yes / No で答えなさい。',answer:'Yes',evidence:'This is my reusable straw.',evidenceJp:'これは私の再利用できるストローです。',reason:'reusable が再利用できることを示します。'},
    {prompt:'4. カフェでは何を使いますか。本文から英語で答えなさい。',answer:'the paper straw',evidence:'I use the paper straw at a cafe.',evidenceJp:'カフェでは紙のストローを使います。',reason:'use の目的語です。'},
    {prompt:'5. 話し手は何を減らしたいですか。本文から英語で答えなさい。',answer:'waste',evidence:'I want to reduce waste.',evidenceJp:'ごみを減らしたいです。',reason:'reduce の目的語です。'}
  ];p62.vocabFinalAudit='PASS_REWRITTEN_TO_GATE_NOTES_0';p62.vocabRepairReason='Removed again, which appears later in Unit8 Stage Activity 2, and removed unapproved plural Straws from the title.';
  setAudit(nh,'Unit 8-2',[
    {en:'This is my reusable straw.',jp:'これは私の再利用できるストローです。'},{en:'It is plastic.',jp:'プラスチック製です。'},{en:'I use it / at home.',jp:'私はそれを使います / 家で'},{en:'This is a paper straw.',jp:'こちらは紙のストローです。'},
    {en:'I use the paper straw / at a cafe.',jp:'私は紙のストローを使います / カフェで'},{en:'I like the reusable straw.',jp:'私は再利用できるストローが好きです。'},{en:'I like the paper straw, too.',jp:'紙のストローも好きです。'},{en:'I want to reduce waste.',jp:'ごみを減らしたいです。'}
  ]);

  const p63=nh['Unit 8-3'];
  p63.sentences=['This is a village.','The river is far from the village.','The river water is not clean.','A group is in the village.','They want to build a well.','They collect money.','They work for a long time.','Now the village has a well.','The well has clean water.','The people are happy.'];
  p63.fullTranslation='ここは村です。川は村から遠いです。川の水はきれいではありません。村には1つのグループがあります。彼らは井戸を作りたいと思っています。彼らはお金を集めます。長い間働きます。今、その村には井戸があります。その井戸にはきれいな水があります。人々はうれしいです。';
  p63.questions[2]={prompt:'3. そのグループは何を作りたいですか。本文から英語で答えなさい。',answer:'a well',evidence:'They want to build a well.',evidenceJp:'彼らは井戸を作りたいと思っています。',reason:'build の目的語が a well です。'};
  p63.vocabFinalAudit='PASS_REWRITTEN_TO_GATE_NOTES_0';p63.vocabRepairReason='Removed auto-generated positive 3sg wants; Unit8-3 gate provides want to with plural they, not wants.';
  setAudit(nh,'Unit 8-3',[
    {en:'This is a village.',jp:'ここは村です。'},{en:'The river is far from the village.',jp:'川は村から遠いです。'},{en:'The river water is not clean.',jp:'川の水はきれいではありません。'},{en:'A group is in the village.',jp:'村には1つのグループがあります。'},
    {en:'They want to build a well.',jp:'彼らは井戸を作りたいです。'},{en:'They collect money.',jp:'彼らはお金を集めます。'},{en:'They work / for a long time.',jp:'彼らは働きます / 長い間'},{en:'Now / the village has a well.',jp:'今 / その村には井戸があります'},
    {en:'The well has clean water.',jp:'その井戸にはきれいな水があります。'},{en:'The people are happy.',jp:'人々はうれしいです。'}
  ]);

  const p64=nh['Unit 9-1'];p64.sentences=p64.sentences.map(s=>s==='The mountain was beautiful.'?'The mountain is beautiful.':s);p64.fullTranslation='休みの間に山へ行きました。そこで友達に会いました。私たちはスノーボードをしに行きました。私はスノーボードがとても好きです。その山は美しいです。スノーボードのあと、家へ戻りました。いつかその山へまた行きたいです。この休みがとても好きです。';p64.vocabFinalAudit='PASS_REWRITTEN_TO_GATE_NOTES_0';p64.vocabRepairReason='Replaced premature past be was; Unit9-1 explicitly unlocks met/went/saw, while was is introduced at Unit10-1.';
  setAudit(nh,'Unit 9-1',[
    {en:'During vacation, / I went to a mountain.',jp:'休みの間に / 私は山へ行きました'},{en:'I met my friend / there.',jp:'私は友達に会いました / そこで'},{en:'We went snowboarding.',jp:'私たちはスノーボードをしに行きました。'},{en:'I like snowboarding very much.',jp:'私はスノーボードがとても好きです。'},
    {en:'The mountain is beautiful.',jp:'その山は美しいです。'},{en:'After snowboarding, / I went back home.',jp:'スノーボードのあと / 私は家へ戻りました'},{en:'I want to go back to the mountain / someday.',jp:'私はその山へまた行きたいです / いつか'},{en:'I like this vacation very much.',jp:'この休みがとても好きです。'}
  ]);

  setAudit(nh,'Unit 9-2',[
    {en:'At New Year, / I wrote a special card / for my grandparent.',jp:'新年に / 私は特別なカードを書きました / 祖父母のために'},{en:'I wrote the card / in English.',jp:'私はそのカードを書きました / 英語で'},{en:'I ate a traditional rice cake / with my family.',jp:'私は伝統的なもちを食べました / 家族と'},
    {en:'“Did you write the card / in English?”',jp:'「そのカードを書きましたか / 英語で」'},{en:'“Yes, I did.”',jp:'「はい、書きました。」'},{en:'“Good for you!”',jp:'「よくやったね！」'},{en:'“Thank you.”',jp:'「ありがとう。」'},{en:'This New Year is special / for me.',jp:'この新年は特別です / 私にとって'}
  ]);
  setAudit(nh,'Unit 9-3',[
    {en:'On New Year’s Day, / I spent time / with my grandparent.',jp:'元日に / 私は時間を過ごしました / 祖父母と'},{en:'I got a fortune slip.',jp:'おみくじを引きました。'},{en:'It is not bad.',jp:'悪い内容ではありません。'},{en:'I bought a charm, too.',jp:'お守りも買いました。'},
    {en:'We had a good time.',jp:'私たちは楽しい時間を過ごしました。'},{en:'“Did you like the charm?”',jp:'「そのお守りは気に入った？」'},{en:'“Yes, I did.”',jp:'「うん、気に入ったよ。」'},{en:'I want to spend New Year’s Day / with my grandparent / again.',jp:'私は元日を過ごしたいです / 祖父母と / また'}
  ]);

  const p67=nh['Unit 10-1'];p67.sentences=p67.sentences.filter(s=>s!=='I realize that I was late.');p67.fullTranslation='それは合唱コンクールでした。私は合唱に参加していました。最初は緊張していました。私はまちがいをしました。遅れてしまいました。それでも、私たちはコンクールで勝ちました。私はうれしかったです。今でも自分のまちがいを覚えています。だれでもまちがいをすることがあります。';p67.vocabFinalAudit='PASS_REWRITTEN_TO_GATE_NOTES_0';p67.vocabRepairReason='Removed unreviewed that-clause. Unit10-1 gate licenses realize lexically but not this new complement-clause construction; the reflection remains explicit through remember.';
  setAudit(nh,'Unit 10-1',[
    {en:'It was a chorus contest.',jp:'それは合唱コンクールでした。'},{en:'I was in the chorus.',jp:'私は合唱に参加していました。'},{en:'At first, / I was nervous.',jp:'最初は / 私は緊張していました'},{en:'I made a mistake.',jp:'私はまちがいをしました。'},{en:'I was late.',jp:'私は遅れてしまいました。'},
    {en:'Anyway, / we won the contest.',jp:'それでも / 私たちはコンクールで勝ちました'},{en:'I was happy.',jp:'私はうれしかったです。'},{en:'Now / I remember my mistake.',jp:'今 / 私は自分のまちがいを覚えています'},{en:'Anyone can make a mistake.',jp:'だれでもまちがいをすることがあります。'}
  ]);

  const p68=nh['Unit 10-2'];p68.sentences=p68.sentences.map(s=>s==='I remember that we won, too.'?'I remember the contest, too.':s);p68.fullTranslation='「ねえ、このアルバムを見て。」それは私の机の上にあります。それぞれの写真は思い出をよみがえらせることがあります。この写真は合唱コンクールのものです。この写真はコンクールの思い出をよみがえらせます。これを見ると心臓が速くどきどきすることがあります。私たちのまちがいを思い出します。そのコンクールも思い出します。この写真は私にとって大切です。';p68.questions[4]={prompt:'5. 話し手はまちがいだけでなく何も思い出しますか。本文から英語で答えなさい。',answer:'the contest',evidence:'I remember the contest, too.',evidenceJp:'そのコンクールも思い出します。',reason:'remember の目的語が the contest です。'};p68.vocabFinalAudit='PASS_REWRITTEN_TO_GATE_NOTES_0';p68.vocabRepairReason='Removed unreviewed that-clause after remember; Unit10-2 gate does not introduce complement-clause grammar.';
  setAudit(nh,'Unit 10-2',[
    {en:'Hey, / look at this album.',jp:'ねえ / このアルバムを見て'},{en:'It is on my desk.',jp:'それは私の机の上にあります。'},{en:'Each picture can bring back a memory.',jp:'それぞれの写真は思い出をよみがえらせることがあります。'},{en:'This picture is from the chorus contest.',jp:'この写真は合唱コンクールのものです。'},
    {en:'It can bring back my memory / of the contest.',jp:'それは私の思い出をよみがえらせます / コンクールの'},{en:'My heart can beat fast / when I see it.',jp:'私の心臓は速くどきどきすることがあります / それを見るとき'},{en:'I remember our mistake.',jp:'私たちのまちがいを思い出します。'},{en:'I remember the contest, too.',jp:'そのコンクールも思い出します。'},{en:'This picture is important / to me.',jp:'この写真は大切です / 私にとって'}
  ]);
  setMeta('ニューホライズン','1','Unit 10-2',{genre:'report',questionSetB:[
    {prompt:'1. アルバムはどこにありますか。英語で答えなさい。',answer:'on my desk',evidence:'It is on my desk.',evidenceJp:'それは私の机の上にあります。',reason:'on my desk が場所です。'},
    {prompt:'2. 写真は何をよみがえらせますか。英語で答えなさい。',answer:'a memory',evidence:'Each picture can bring back a memory.',evidenceJp:'それぞれの写真は思い出をよみがえらせることがあります。',reason:'bring back の目的語です。'},
    {prompt:'3. 写真を見ると何が速く動くことがありますか。英語で答えなさい。',answer:'my heart',evidence:'My heart can beat fast when I see it.',evidenceJp:'これを見ると心臓が速くどきどきすることがあります。',reason:'主語が My heart です。'},
    {prompt:'4. コンクールも思い出しますか。Yes / No で答えなさい。',answer:'Yes',evidence:'I remember the contest, too.',evidenceJp:'そのコンクールも思い出します。',reason:'remember the contest, too とあります。'}]});

  setAudit(nh,'Unit 10-3',[
    {en:'We went to a campground.',jp:'私たちはキャンプ場へ行きました。'},{en:'We set up a tent.',jp:'テントを張りました。'},{en:'The campground had a hot spring.',jp:'そのキャンプ場には温泉がありました。'},{en:'At night, / we had a campfire.',jp:'夜には / 私たちはキャンプファイアをしました'},
    {en:'The campfire was the main event.',jp:'キャンプファイアが主な行事でした。'},{en:'It was exciting.',jp:'とてもわくわくしました。'},{en:'We were happy.',jp:'私たちはうれしかったです。'},{en:'I like camping very much.',jp:'私はキャンプがとても好きです。'},{en:'It was a great trip.',jp:'すばらしい旅行でした。'}
  ]);

  const p70=ss2['PROGRAM 1-1'];p70.sentences=p70.sentences.map(s=>s==='I have important news.'?'I have a special plan.':s);p70.fullTranslation='特別な計画があります。私は日曜日にこの町を出ます。新しい町へ引っ越します。町を出る前に友達とパーティーをします。パーティーは私の家でします。私たちは音楽を演奏します。いっしょに夕食を食べます。学校について話します。また友達に会いたいです。この町は私にとって特別です。そのパーティーも特別です。';p70.vocabFinalAudit='PASS_REWRITTEN_TO_GATE_NOTES_0';p70.vocabRepairReason='Removed news. Canonical Sunshine G2 master introduces news later in Reading 1, not PROGRAM 1-1; special and plan are already available here.';
  setAudit(ss2,'PROGRAM 1-1',[
    {en:'I have a special plan.',jp:'特別な計画があります。'},{en:'I leave this town / on Sunday.',jp:'私はこの町を出ます / 日曜日に'},{en:'I move to a new city.',jp:'新しい町へ引っ越します。'},{en:'I have a party / with my friends / before I leave.',jp:'私はパーティーをします / 友達と / 町を出る前に'},
    {en:'The party is at my house.',jp:'パーティーは私の家でします。'},{en:'We play music.',jp:'私たちは音楽を演奏します。'},{en:'We eat dinner together.',jp:'いっしょに夕食を食べます。'},{en:'We talk about our school.',jp:'学校について話します。'},
    {en:'I want to see my friends / again.',jp:'私は友達に会いたいです / また'},{en:'This town is special / for me.',jp:'この町は特別です / 私にとって'},{en:'The party is special, too.',jp:'そのパーティーも特別です。'}
  ]);

  window.V10_VOCAB_SLASH_MANUAL_061_070={passages:10,vocabAudited:10,slashAudited:10,rewritten:6,notes:0};
})();