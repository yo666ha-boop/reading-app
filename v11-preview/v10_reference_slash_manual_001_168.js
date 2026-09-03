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
    {en:'This is my English book.',jp:'これは私の英語の本です。'},{en:'Really?',jp:'本当に？'},{en:'Yes.',jp:'うん。'},{en:'This is a dog.',jp:'これは犬です。'},{en:'I see.',jp:'なるほど。'},{en:'This is a cat, / too.',jp:'これはねこです / 〜もまた'},{en:'I write “dog” / in my notebook.',jp:'私は「dog」と書きます / 私のノートに'},{en:'I write “cat” / in my notebook, / too.',jp:'私は「cat」と書きます / 私のノートに / 〜もまた'},{en:'I can read “dog”.',jp:'私は「dog」を読むことができます。'},{en:'I can read “cat”, / too.',jp:'私は「cat」を読むことができます / 〜もまた'},{en:'Great!',jp:'すごい！'}
  ],1);
  setAudit(sun1,'Get Ready 3',[
    {en:'What subject do you like?',jp:'何の教科が好きですか。'},{en:'I like English.',jp:'私は英語が好きです。'},{en:'Really?',jp:'本当に？'},{en:'Yes.',jp:'うん。'},{en:'Do you have your English book?',jp:'英語の本を持っていますか。'},{en:'Yes, / I do.',jp:'はい / 持っています'},{en:'Can you read English?',jp:'英語を読むことができますか。'},{en:'Yes, / I can.',jp:'はい / できます'},{en:'Great!',jp:'すごい！'},{en:'I like English, / too.',jp:'私は英語が好きです / 〜もまた'}
  ],2);
  setAudit(sun1,'Get Ready 4',[
    {en:'I like basketball.',jp:'私はバスケットボールが好きです。'},{en:'I am / in the basketball club.',jp:'私はいます / バスケットボール部に'},{en:'I practice / in the gym / every day.',jp:'私は練習します / 体育館で / 毎日'},{en:'I can run.',jp:'私は走ることができます。'},{en:'I can jump high.',jp:'私は高くジャンプすることができます。'},{en:'I can shoot the ball.',jp:'私はボールをシュートすることができます。'},{en:'Basketball is very exciting.',jp:'バスケットボールはとてもわくわくします。'},{en:'Do you like basketball?',jp:'バスケットボールは好きですか。'},{en:'Yes, / I do.',jp:'はい / 好きです'},{en:'Let’s play basketball together.',jp:'いっしょにバスケットボールをしよう。'},{en:'Great!',jp:'いいね！'}
  ],3);
  setAudit(sun1,'Get Ready 5',[
    {en:'Do you like the zoo?',jp:'動物園は好きですか。'},{en:'Yes, / I do.',jp:'はい / 好きです'},{en:'What do you like?',jp:'何が好きですか。'},{en:'I like the panda / and the monkey.',jp:'私はパンダが好きです / そしてサルも'},{en:'I like the tiger, / too.',jp:'私はトラが好きです / 〜もまた'},{en:'Really?',jp:'本当に？'},{en:'Yes.',jp:'うん。'},{en:'Do you like the rabbit?',jp:'ウサギは好きですか。'},{en:'Yes, / I do.',jp:'はい / 好きです'},{en:'I like the bear, / too.',jp:'私はクマが好きです / 〜もまた'}
  ],4);
  setAudit(sun1,'Get Ready 6',[
    {en:'I had lunch / at the zoo.',jp:'私は昼食をとりました / 動物園で'},{en:'I ate pizza.',jp:'私はピザを食べました。'},{en:'I saw a panda.',jp:'私はパンダを見ました。'},{en:'I saw a monkey, / too.',jp:'私はサルを見ました / 〜もまた'},{en:'I saw a tiger.',jp:'私はトラを見ました。'},{en:'I saw a rabbit.',jp:'私はウサギを見ました。'},{en:'I saw a bear, / too.',jp:'私はクマを見ました / 〜もまた'},{en:'I like the panda / and the monkey.',jp:'私はパンダが好きです / そしてサルも'},{en:'I like the tiger, / too.',jp:'私はトラが好きです / 〜もまた'},{en:'I like the zoo.',jp:'私は動物園が好きです。'}
  ],5);
  setAudit(sun1,'PROGRAM 1-1',[
    {en:'Hi.',jp:'こんにちは。'},{en:'I’m a junior high school student.',jp:'私は中学生です。'},{en:'I’m friendly.',jp:'私は人なつっこいです。'},{en:'My teacher is kind.',jp:'私の先生は親切です。'},{en:'I like my teacher.',jp:'私は先生が好きです。'},{en:'I like music.',jp:'私は音楽が好きです。'},{en:'I play the trumpet.',jp:'私はトランペットを演奏します。'},{en:'I practice / every Wednesday.',jp:'私は練習します / 毎週水曜日に'},{en:'I like basketball, / too.',jp:'私はバスケットボールが好きです / 〜もまた'},{en:'I like my school.',jp:'私は自分の学校が好きです。'},{en:'School is really great.',jp:'学校は本当にすばらしいです。'},{en:'Goodbye.',jp:'さようなら。'}
  ],6);
  setAudit(sun1,'PROGRAM 1-2',[
    {en:'Hello.',jp:'こんにちは。'},{en:'I’m a student.',jp:'私は生徒です。'},{en:'I’m / from Australia.',jp:'私は〜出身です / オーストラリア'},{en:'Australia is really great.',jp:'オーストラリアは本当にすばらしいです。'},{en:'My teacher is / from Japan.',jp:'私の先生は〜出身です / 日本'},{en:'My teacher is kind.',jp:'私の先生は親切です。'},{en:'I like Japan.',jp:'私は日本が好きです。'},{en:'I like Australia, / too.',jp:'私はオーストラリアが好きです / 〜もまた'},{en:'I’m friendly.',jp:'私は人なつっこいです。'},{en:'I like my school.',jp:'私は自分の学校が好きです。'},{en:'School is great.',jp:'学校はすばらしいです。'},{en:'Goodbye.',jp:'さようなら。'}
  ],7);
  setAudit(sun1,'PROGRAM 1-3',[
    {en:'I’m a new student.',jp:'私は新しい生徒です。'},{en:'This is my new class.',jp:'ここが私の新しいクラスです。'},{en:'Nice / to meet you.',jp:'うれしいです / あなたに会えて'},{en:'I’m quiet.',jp:'私はおとなしいです。'},{en:'I’m cheerful, / too.',jp:'私は明るいです / 〜もまた'},{en:'I like math / and science.',jp:'私は数学が好きです / そして理科も'},{en:'I’m good / at math.',jp:'私は得意です / 数学が'},{en:'I’m good / at science, / too.',jp:'私は得意です / 理科が / 〜もまた'},{en:'I like Japanese.',jp:'私は国語が好きです。'},{en:'I’m a fan / of movies.',jp:'私はファンです / 映画の'},{en:'My teacher is kind.',jp:'私の先生は親切です。'},{en:'This city is nice.',jp:'この街はすてきです。'},{en:'I want / to be friendly.',jp:'私は望んでいます / 人なつっこくなることを'},{en:'School is really great.',jp:'学校は本当にすばらしいです。'}
  ],8);
  setAudit(sun1,'PROGRAM 2-1',[
    {en:'After school, / I ride my bicycle.',jp:'放課後 / 私は自転車に乗ります'},{en:'I sometimes ride / with my friend.',jp:'私はときどき乗ります / 友達といっしょに'},{en:'We ride / in our town.',jp:'私たちは乗ります / 私たちの町の中で'},{en:'Our town is beautiful.',jp:'私たちの町は美しいです。'},{en:'My friend / and I walk, / too.',jp:'私の友達 / そして私は歩きます / 〜もまた'},{en:'I like my bicycle very much.',jp:'私は自転車がとても好きです。'},{en:'I go home / after school.',jp:'私は家に帰ります / 放課後に'},{en:'At home, / I clean my bicycle.',jp:'家で / 私は自転車をきれいにします'},{en:'I read / at home.',jp:'私は読みます / 家で'},{en:'I like my town, / too.',jp:'私は自分の町が好きです / 〜もまた'},{en:'I like my bicycle / and my town.',jp:'私は自転車が好きです / そして自分の町も'}
  ],9);
  setAudit(sun1,'PROGRAM 2-2',[
    {en:'On the weekend, / I ride my bicycle / with my friend.',jp:'週末に / 私は自転車に乗ります / 友達といっしょに'},{en:'We ride / in our town.',jp:'私たちは乗ります / 私たちの町の中で'},{en:'Our town is beautiful.',jp:'私たちの町は美しいです。'},{en:'Before dinner, / I clean my bicycle.',jp:'夕食前に / 私は自転車をきれいにします'},{en:'I study math / before dinner.',jp:'私は数学を勉強します / 夕食前に'},{en:'I like math, / but I like science, / too.',jp:'私は数学が好きです / しかし私は理科が好きです / 〜もまた'},{en:'After dinner, / I study Japanese.',jp:'夕食後に / 私は国語を勉強します'},{en:'I read / at home / after dinner.',jp:'私は読みます / 家で / 夕食後に'},{en:'I sometimes watch tennis / after dinner.',jp:'私はときどきテニスを見ます / 夕食後に'},{en:'I like the weekend very much.',jp:'私は週末がとても好きです。'}
  ],10);
  setAudit(sun1,'PROGRAM 2-3',[
    {en:'Look / at this picture.',jp:'見てください / この絵を'},{en:'Wow!',jp:'わあ！'},{en:'I draw this picture / in my notebook.',jp:'私はこの絵をかきます / 私のノートに'},{en:'I draw / at home, / too.',jp:'私はかきます / 家で / 〜もまた'},{en:'Are you an artist?',jp:'あなたはアーティストですか。'},{en:'No, / I’m not.',jp:'いいえ / 違います'},{en:'I like this picture.',jp:'私はこの絵が好きです。'},{en:'This pencil is / for you.',jp:'この鉛筆は〜です / あなた用'},{en:'Thank you.',jp:'ありがとう。'},{en:'I have two.',jp:'私は2本持っています。'},{en:'We can draw / during the break.',jp:'私たちは絵をかけます / 休み時間に'},{en:'Let’s draw tomorrow.',jp:'明日、絵をかこう。'},{en:'Great!',jp:'いいね！'}
  ],11);
  setAudit(sun1,'PROGRAM 3-1',[
    {en:'This is my family.',jp:'これは私の家族です。'},{en:'That is my brother.',jp:'あれは私の兄（弟）です。'},{en:'He can ski well.',jp:'彼は上手にスキーができます。'},{en:'I can ski, / too.',jp:'私はスキーができます / 〜もまた'},{en:'My father can ski, / too.',jp:'私の父はスキーができます / 〜もまた'},{en:'My mother can’t ski.',jp:'私の母はスキーができません。'},{en:'My mother can dance well.',jp:'私の母は上手に踊れます。'},{en:'My grandfather can dance, / too.',jp:'私の祖父は踊れます / 〜もまた'},{en:'My grandmother can dance, / too.',jp:'私の祖母は踊れます / 〜もまた'},{en:'We ski / in winter.',jp:'私たちはスキーをします / 冬に'},{en:'We don’t ski / in summer.',jp:'私たちはスキーをしません / 夏に'},{en:'We like winter.',jp:'私たちは冬が好きです。'},{en:'Winter is great.',jp:'冬はすばらしいです。'}
  ],12);
  setAudit(sun1,'PROGRAM 3-2',[
    {en:'I can speak French.',jp:'私はフランス語を話せます。'},{en:'My friend can play the guitar.',jp:'私の友達はギターを弾けます。'},{en:'I can play the guitar, / too.',jp:'私もギターを弾けます / 〜もまた'},{en:'I can skate fast.',jp:'私は速くスケートができます。'},{en:'My friend can skate, / too.',jp:'私の友達はスケートができます / 〜もまた'},{en:'Can you do a magic trick?',jp:'手品ができますか。'},{en:'Yes, / I can.',jp:'はい / できます'},{en:'Great!',jp:'すごい！'},{en:'We can practice / after school.',jp:'私たちは練習できます / 放課後に'},{en:'I like the guitar.',jp:'私はギターが好きです。'},{en:'My friend / and I can skate together.',jp:'私の友達 / そして私はいっしょにスケートができます'},{en:'Sounds great.',jp:'楽しそうですね。'}
  ],13);
  setAudit(sun1,'PROGRAM 3-3',[
    {en:'This is our rescue robot.',jp:'これは私たちの救助ロボットです。'},{en:'The robot is / in our show.',jp:'そのロボットはいます / 私たちのショーに'},{en:'I am so excited.',jp:'私はとてもわくわくしています。'},{en:'It can carry a heavy thing.',jp:'それは重いものを運べます。'},{en:'It can carry water, / too.',jp:'それは水を運べます / 〜もまた'},{en:'It can find people.',jp:'それは人を見つけられます。'},{en:'It can help people.',jp:'それは人を助けられます。'},{en:'It can help people / in a tree.',jp:'それは人を助けられます / 木にいる'},{en:'It can fly, / too.',jp:'それは飛べます / 〜もまた'},{en:'It is wonderful.',jp:'それはすばらしいです。'},{en:'Good luck!',jp:'がんばって！'},{en:'Our show is great.',jp:'私たちのショーはすばらしいです。'}
  ],14);
  setAudit(sun1,'PROGRAM 4-1',[
    {en:'Look / at this picture.',jp:'見てください / この絵を'},{en:'Is this a zebra?',jp:'これはシマウマですか。'},{en:'No, / it isn’t.',jp:'いいえ / 違います'},{en:'This is a horse.',jp:'これはウマです。'},{en:'Is that an elephant?',jp:'あれはゾウですか。'},{en:'Yes, / it is.',jp:'はい / そうです'},{en:'Look / at that ant.',jp:'見てください / あのアリを'},{en:'Is that a butterfly?',jp:'あれはチョウですか。'},{en:'No, / it isn’t.',jp:'いいえ / 違います'},{en:'That is an ant.',jp:'あれはアリです。'},{en:'I like the horse / and the elephant.',jp:'私はウマが好きです / そしてゾウも'},{en:'This picture is great.',jp:'この絵はすばらしいです。'}
  ],15);
  setAudit(sun1,'PROGRAM 4-2',[
    {en:'Look / at this picture.',jp:'見てください / この写真を'},{en:'Who is this boy?',jp:'この男の子はだれですか。'},{en:'He is my classmate.',jp:'彼は私のクラスメートです。'},{en:'Is he a runner?',jp:'彼はランナーですか。'},{en:'Yes, / he is.',jp:'はい / そうです'},{en:'He is / on the track and field team.',jp:'彼は所属しています / 陸上競技のチームに'},{en:'Who is that man?',jp:'あの男性はだれですか。'},{en:'He is my teacher.',jp:'彼は私の先生です。'},{en:'He is / on the court.',jp:'彼はいます / コートに'},{en:'Is he / on the track and field team?',jp:'彼は所属していますか / 陸上競技のチームに'},{en:'No, / he isn’t.',jp:'いいえ / 所属していません'},{en:'This picture is great.',jp:'この写真はすばらしいです。'}
  ],16);
  setAudit(sun1,'PROGRAM 4-3',[
    {en:'I have a question.',jp:'質問があります。'},{en:'This fruit is yellow / and long.',jp:'このくだものは黄色です / そして長いです'},{en:'What is it?',jp:'それは何ですか。'},{en:'Is it a banana?',jp:'バナナですか。'},{en:'Yes.',jp:'はい。'},{en:'That’s right.',jp:'そのとおりです。'},{en:'I got it!',jp:'わかった！'},{en:'This fruit is round / and sweet.',jp:'このくだものは丸いです / そして甘いです'},{en:'What is it?',jp:'それは何ですか。'},{en:'Is it a cherry?',jp:'サクランボですか。'},{en:'Yes.',jp:'はい。'},{en:'That’s right.',jp:'そのとおりです。'},{en:'I like fruit.',jp:'私はくだものが好きです。'}
  ],17);
  setAudit(sun1,'PROGRAM 5-1',[
    {en:'This is my brother.',jp:'これは私の兄（弟）です。'},{en:'This is his pajama design.',jp:'これは彼のパジャマのデザインです。'},{en:'He is / in home economics.',jp:'彼はいます / 家庭科の授業に'},{en:'He can sew.',jp:'彼は縫い物ができます。'},{en:'Does he like drawing?',jp:'彼は絵をかくことが好きですか。'},{en:'Yes, / he does.',jp:'はい / 好きです'},{en:'His drawing is great.',jp:'彼の絵はすばらしいです。'},{en:'This design is yellow.',jp:'このデザインは黄色です。'},{en:'Does he like this design?',jp:'彼はこのデザインが好きですか。'},{en:'Yes, / he does.',jp:'はい / 好きです'},{en:'Does he like this long design?',jp:'彼はこの長いデザインが好きですか。'},{en:'No, / he doesn’t.',jp:'いいえ / 好きではありません'},{en:'This pajama design is great.',jp:'このパジャマのデザインはすばらしいです。'}
  ],18);
  setAudit(sun1,'PROGRAM 5-2',[
    {en:'Look / at this picture.',jp:'見てください / この絵を'},{en:'Who is this man?',jp:'この男性はだれですか。'},{en:'He is an ice hockey player.',jp:'彼はアイスホッケー選手です。'},{en:'He can skate fast.',jp:'彼は速くスケートができます。'},{en:'Look / at his clothes.',jp:'見てください / 彼の服を'},{en:'His clothes are yellow.',jp:'彼の服は黄色です。'},{en:'He is / on a team.',jp:'彼は所属しています / チームに'},{en:'His team is famous.',jp:'彼のチームは有名です。'},{en:'Does he like ice hockey?',jp:'彼はアイスホッケーが好きですか。'},{en:'Yes, / he does.',jp:'はい / 好きです'},{en:'Does he like his clothes?',jp:'彼は自分の服が好きですか。'},{en:'Yes, / he does.',jp:'はい / 好きです'},{en:'This picture is great.',jp:'この絵はすばらしいです。'}
  ],19);
  setAudit(sun1,'PROGRAM 5-3',[
    {en:'This is a charity event.',jp:'これはチャリティー行事です。'},{en:'It is / at my elementary school.',jp:'それは行われます / 私の小学校で'},{en:'We support sick children.',jp:'私たちは病気の子どもたちを支援します。'},{en:'The children are / in a hospital.',jp:'その子どもたちはいます / 病院に'},{en:'We have a photo / of the event.',jp:'私たちは写真を持っています / その行事の'},{en:'We work together.',jp:'私たちはいっしょに活動します。'},{en:'We spend time / at the hospital.',jp:'私たちは時間を過ごします / 病院で'},{en:'We talk / about the children.',jp:'私たちは話します / その子どもたちについて'},{en:'I am proud / of our work.',jp:'私は誇りに思っています / 私たちの活動を'},{en:'I would like / to support the children.',jp:'私は〜したいです / その子どもたちを支援することを'},{en:'I’d like / to talk / about the event.',jp:'私は〜したいです / 話すことを / その行事について'},{en:'This event is great.',jp:'この行事はすばらしいです。'}
  ],20);

  window.V10_REFERENCE_SLASH_AUDIT={version:'2026-08-20',passagesAudited:20,total:168,lastCompleted:20,minimumRuleImageConfirmed:true};
})();
