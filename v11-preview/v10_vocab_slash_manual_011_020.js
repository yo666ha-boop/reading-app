// Human-reviewed vocabulary/slash final audit overrides for passages 011-020.
// Short basic clauses remain intact; slashes are used only for genuine front-to-back meaning chunks.
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

  setAudit('PROGRAM 2-3',[
    {en:'Look at this picture.',jp:'この絵を見て。'},
    {en:'Wow!',jp:'わあ！'},
    {en:'I draw this picture / in my notebook.',jp:'私はこの絵をかきます / ノートに'},
    {en:'I draw / at home, too.',jp:'私は絵をかきます / 家でも'},
    {en:'Are you an artist?',jp:'あなたはアーティストですか。'},
    {en:'No, I’m not.',jp:'いいえ、違います。'},
    {en:'I like this picture.',jp:'私はこの絵が好きです。'},
    {en:'This pencil is for you.',jp:'この鉛筆はあなた用です。'},
    {en:'Thank you.',jp:'ありがとう。'},
    {en:'I have two.',jp:'私は2本持っています。'},
    {en:'We can draw / during the break.',jp:'私たちは絵をかけます / 休み時間に'},
    {en:'Let’s draw / tomorrow.',jp:'絵をかこう / 明日'},
    {en:'Great!',jp:'いいね！'}
  ]);

  setAudit('PROGRAM 3-1',[
    {en:'This is my family.',jp:'これは私の家族です。'},
    {en:'That is my brother.',jp:'あれは私の兄（弟）です。'},
    {en:'He can ski well.',jp:'兄（弟）は上手にスキーができます。'},
    {en:'I can ski, too.',jp:'私もスキーができます。'},
    {en:'My father can ski, too.',jp:'父もスキーができます。'},
    {en:'My mother can’t ski.',jp:'母はスキーができません。'},
    {en:'My mother can dance well.',jp:'母は上手に踊れます。'},
    {en:'My grandfather can dance, too.',jp:'祖父も踊れます。'},
    {en:'My grandmother can dance, too.',jp:'祖母も踊れます。'},
    {en:'We ski / in winter.',jp:'私たちはスキーをします / 冬に'},
    {en:'We don’t ski / in summer.',jp:'私たちはスキーをしません / 夏に'},
    {en:'We like winter.',jp:'私たちは冬が好きです。'},
    {en:'Winter is great.',jp:'冬はすばらしいです。'}
  ]);

  setAudit('PROGRAM 3-2',[
    {en:'I can speak French.',jp:'私はフランス語を話せます。'},
    {en:'My friend can play the guitar.',jp:'友達はギターを弾けます。'},
    {en:'I can play the guitar, too.',jp:'私もギターを弾けます。'},
    {en:'I can skate fast.',jp:'私は速くスケートができます。'},
    {en:'My friend can skate, too.',jp:'友達もスケートができます。'},
    {en:'Can you do a magic trick?',jp:'手品ができますか。'},
    {en:'Yes, I can.',jp:'はい、できます。'},
    {en:'Great!',jp:'すごい！'},
    {en:'We can practice / after school.',jp:'私たちは練習できます / 放課後に'},
    {en:'I like the guitar.',jp:'私はギターが好きです。'},
    {en:'My friend and I can skate together.',jp:'友達と私はいっしょにスケートができます。'},
    {en:'Sounds great.',jp:'楽しそうですね。'}
  ]);

  setAudit('PROGRAM 3-3',[
    {en:'This is our rescue robot.',jp:'これは私たちの救助ロボットです。'},
    {en:'The robot is in our show.',jp:'そのロボットは私たちのショーに出ます。'},
    {en:'I am so excited.',jp:'私はとてもわくわくしています。'},
    {en:'It can carry a heavy thing.',jp:'重いものを運べます。'},
    {en:'It can carry water, too.',jp:'水も運べます。'},
    {en:'It can find people.',jp:'人を見つけられます。'},
    {en:'It can help people.',jp:'人を助けられます。'},
    {en:'It can help people in a tree.',jp:'木にいる人も助けられます。'},
    {en:'It can fly, too.',jp:'飛ぶこともできます。'},
    {en:'It is wonderful.',jp:'すばらしいロボットです。'},
    {en:'Good luck!',jp:'がんばって！'},
    {en:'Our show is great.',jp:'私たちのショーはすばらしいです。'}
  ]);

  setAudit('PROGRAM 4-1',[
    {en:'Look at this picture.',jp:'この絵を見て。'},
    {en:'Is this a zebra?',jp:'これはシマウマですか。'},
    {en:'No, it isn’t.',jp:'いいえ、違います。'},
    {en:'This is a horse.',jp:'これはウマです。'},
    {en:'Is that an elephant?',jp:'あれはゾウですか。'},
    {en:'Yes, it is.',jp:'はい、そうです。'},
    {en:'Look at that ant.',jp:'あのアリを見て。'},
    {en:'Is that a butterfly?',jp:'あれはチョウですか。'},
    {en:'No, it isn’t.',jp:'いいえ、違います。'},
    {en:'That is an ant.',jp:'あれはアリです。'},
    {en:'I like the horse and the elephant.',jp:'私はウマとゾウが好きです。'},
    {en:'This picture is great.',jp:'この絵はすばらしいです。'}
  ]);

  setAudit('PROGRAM 4-2',[
    {en:'Look at this picture.',jp:'この写真を見て。'},
    {en:'Who is this boy?',jp:'この男の子はだれですか。'},
    {en:'He is my classmate.',jp:'彼は私のクラスメートです。'},
    {en:'Is he a runner?',jp:'彼はランナーですか。'},
    {en:'Yes, he is.',jp:'はい、そうです。'},
    {en:'He is on the track and field team.',jp:'彼は陸上競技のチームに入っています。'},
    {en:'Who is that man?',jp:'あの男性はだれですか。'},
    {en:'He is my teacher.',jp:'彼は私の先生です。'},
    {en:'He is on the court.',jp:'彼はコートにいます。'},
    {en:'Is he on the track and field team?',jp:'彼も陸上競技のチームに入っていますか。'},
    {en:'No, he isn’t.',jp:'いいえ、入っていません。'},
    {en:'This picture is great.',jp:'この写真はすばらしいです。'}
  ]);

  setAudit('PROGRAM 4-3',[
    {en:'I have a question.',jp:'質問があります。'},
    {en:'This fruit is yellow and long.',jp:'このくだものは黄色くて長いです。'},
    {en:'What is it?',jp:'それは何ですか。'},
    {en:'Is it a banana?',jp:'バナナですか。'},
    {en:'Yes.',jp:'はい。'},
    {en:'That’s right.',jp:'そのとおりです。'},
    {en:'I got it!',jp:'わかった！'},
    {en:'This fruit is round and sweet.',jp:'このくだものは丸くて甘いです。'},
    {en:'What is it?',jp:'それは何ですか。'},
    {en:'Is it a cherry?',jp:'サクランボですか。'},
    {en:'Yes.',jp:'はい。'},
    {en:'That’s right.',jp:'そのとおりです。'},
    {en:'I like fruit.',jp:'私はくだものが好きです。'}
  ]);

  setAudit('PROGRAM 5-1',[
    {en:'This is my brother.',jp:'これは私の兄（弟）です。'},
    {en:'This is his pajama design.',jp:'これは彼のパジャマのデザインです。'},
    {en:'He is in home economics.',jp:'彼は家庭科の授業にいます。'},
    {en:'He can sew.',jp:'縫い物ができます。'},
    {en:'Does he like drawing?',jp:'絵をかくことが好きですか。'},
    {en:'Yes, he does.',jp:'はい、好きです。'},
    {en:'His drawing is great.',jp:'彼の絵はすばらしいです。'},
    {en:'This design is yellow.',jp:'このデザインは黄色です。'},
    {en:'Does he like this design?',jp:'このデザインが好きですか。'},
    {en:'Yes, he does.',jp:'はい、好きです。'},
    {en:'Does he like this long design?',jp:'この長いデザインが好きですか。'},
    {en:'No, he doesn’t.',jp:'いいえ、好きではありません。'},
    {en:'This pajama design is great.',jp:'このパジャマのデザインはすばらしいです。'}
  ]);

  setAudit('PROGRAM 5-2',[
    {en:'Look at this picture.',jp:'この絵を見て。'},
    {en:'Who is this man?',jp:'この男性はだれですか。'},
    {en:'He is an ice hockey player.',jp:'彼はアイスホッケー選手です。'},
    {en:'He can skate fast.',jp:'彼は速くスケートができます。'},
    {en:'Look at his clothes.',jp:'彼の服を見て。'},
    {en:'His clothes are yellow.',jp:'服は黄色です。'},
    {en:'He is on a team.',jp:'彼はチームに入っています。'},
    {en:'His team is famous.',jp:'そのチームは有名です。'},
    {en:'Does he like ice hockey?',jp:'彼はアイスホッケーが好きですか。'},
    {en:'Yes, he does.',jp:'はい、好きです。'},
    {en:'Does he like his clothes?',jp:'自分の服が好きですか。'},
    {en:'Yes, he does.',jp:'はい、好きです。'},
    {en:'This picture is great.',jp:'この絵はすばらしいです。'}
  ]);

  setAudit('PROGRAM 5-3',[
    {en:'This is a charity event.',jp:'これはチャリティー行事です。'},
    {en:'It is at my elementary school.',jp:'私の小学校で行われます。'},
    {en:'We support sick children.',jp:'私たちは病気の子どもたちを支援します。'},
    {en:'The children are in a hospital.',jp:'その子どもたちは病院にいます。'},
    {en:'We have a photo of the event.',jp:'行事の写真があります。'},
    {en:'We work together.',jp:'私たちはいっしょに活動します。'},
    {en:'We spend time / at the hospital.',jp:'私たちは時間を過ごします / 病院で'},
    {en:'We talk about the children.',jp:'子どもたちについて話します。'},
    {en:'I am proud of our work.',jp:'私は私たちの活動を誇りに思っています。'},
    {en:'I would like to support the children.',jp:'子どもたちを支援したいです。'},
    {en:'I’d like to talk about the event.',jp:'この行事について話したいです。'},
    {en:'This event is great.',jp:'この行事はすばらしいです。'}
  ]);

  window.V10_VOCAB_SLASH_MANUAL_011_020={passages:10,vocabAudited:10,slashAudited:10,notes:0};
})();
