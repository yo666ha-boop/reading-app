window.V10_PASSAGES=window.V10_PASSAGES||{};

window.V10_PASSAGES['PROGRAM 4-1']={
 id:'V10-SS-G1-P4-1-001',textbook:'サンシャイン',grade:'1',section:'PROGRAM 4-1',level:'HOP',title:'Animals in a Picture',
 sentences:[
  'This is a picture.',
  'Is this a zebra?',
  'No, it isn’t.',
  'This is a horse.',
  'Is that an elephant?',
  'Yes, it is.',
  'Look at that ant.',
  'Is that a butterfly?',
  'No, it isn’t.',
  'That is an ant.',
  'I like the elephant.',
  'I like the horse, too.',
  'This picture is great.'
 ],
 fullTranslation:'「これは1枚の絵です。」「これはシマウマですか。」「いいえ、違います。」「これはウマです。」「あれはゾウですか。」「はい、そうです。」「あのアリを見て。」「あれはチョウですか。」「いいえ、違います。」「あれはアリです。」「私はそのゾウが好きです。」「ウマも好きです。」「この絵はすばらしいです。」',
 slashRows:[
  {en:'This is / a picture.',jp:'これは〜です / 1枚の絵'},
  {en:'Is this / a zebra?',jp:'これは〜ですか / シマウマ'},
  {en:'No, / it isn’t.',jp:'いいえ / 違います'},
  {en:'This is / a horse.',jp:'これは〜です / ウマ'},
  {en:'Is that / an elephant?',jp:'あれは〜ですか / ゾウ'},
  {en:'Yes, / it is.',jp:'はい / そうです'},
  {en:'Look at / that ant.',jp:'見てください / あのアリを'},
  {en:'Is that / a butterfly?',jp:'あれは〜ですか / チョウ'},
  {en:'No, / it isn’t.',jp:'いいえ / 違います'},
  {en:'That is / an ant.',jp:'あれは〜です / アリ'},
  {en:'I like / the elephant.',jp:'私は好きです / そのゾウが'},
  {en:'I like / the horse, too.',jp:'私は好きです / そのウマも'},
  {en:'This picture is / great.',jp:'この絵は〜です / すばらしい'}
 ],
 questions:[
  {prompt:'1. 最初に「これは何ですか」とたずねている動物は何ですか。本文から英語で答えなさい。',answer:'a zebra',evidence:'Is this a zebra?',evidenceJp:'これはシマウマですか。',reason:'最初の動物についての疑問文で a zebra とたずねています。'},
  {prompt:'2. 最初に見ている動物はシマウマですか。本文に合うように Yes / No で答えなさい。',answer:'No',evidence:'Is this a zebra? / No, it isn’t.',evidenceJp:'これはシマウマですか。／いいえ、違います。',reason:'isn’t を使って否定しているので No です。'},
  {prompt:'3. `that` を使ってたずねている大きな動物は何ですか。本文から英語で答えなさい。',answer:'an elephant',evidence:'Is that an elephant?',evidenceJp:'あれはゾウですか。',reason:'that の後ろに an elephant が置かれています。'},
  {prompt:'4. チョウだと思ったものは、実際には何でしたか。本文から英語で答えなさい。',answer:'an ant',evidence:'Is that a butterfly? / No, it isn’t. / That is an ant.',evidenceJp:'あれはチョウですか。／いいえ、違います。／あれはアリです。',reason:'butterfly を否定したあと、That is an ant. と正体を示しています。'},
  {prompt:'5. 話し手が好きだと書かれている動物を2つ、本文から英語で答えなさい。',answer:'the elephant, the horse',evidence:'I like the elephant. / I like the horse, too.',evidenceJp:'私はそのゾウが好きです。／ウマも好きです。',reason:'like の目的語として elephant と horse が示されています。'}
 ],
 allowedWords:[
  ['jelly / butterfly / zebra / horse / elephant / ant / isn’t','PROGRAM 4-1: id333-339'],
  ['picture / Look at ～','PROGRAM 2-3 cumulative'],['this / that','cumulative'],['I / like / is / a / an / no / it / yes / the / too / great','cumulative / elementary']
 ],
 auditNote:'v9内蔵VOCABでPROGRAM 4-1をid333〜339まで照合し、id340からPROGRAM 4-2へ切り替わることを確認。butterfly / zebra / horse / elephant / antと明示登録のisn’tを、1枚の動物の絵を見分ける場面に統合。jellyは動物場面に混ぜると不自然なため未使用。三単現・過去形・複数形の自動生成はしていない。',
 vocabAudit:true,manualSlashAudit:true,manualMeaningAudit:true,manualQuestionAudit:true
};

window.V10_PASSAGES['PROGRAM 4-2']={
 id:'V10-SS-G1-P4-2-001',textbook:'サンシャイン',grade:'1',section:'PROGRAM 4-2',level:'HOP',title:'Who Is in the Picture?',
 sentences:[
  'Look at this picture.',
  'Who is this boy?',
  'He is my classmate.',
  'Is he a runner?',
  'Yes, he is.',
  'He is on the track and field team.',
  'Who is that woman?',
  'She is a street singer.',
  'Is she famous?',
  'Yes, she is.',
  'Who is that man?',
  'He is my teacher.',
  'He is on the court.',
  'This picture is great.'
 ],
 fullTranslation:'「この写真を見て。」「この男の子はだれですか。」「彼は私のクラスメートです。」「彼はランナーですか。」「はい、そうです。」「彼は陸上競技のチームに入っています。」「あの女性はだれですか。」「彼女はストリートシンガーです。」「彼女は有名ですか。」「はい、そうです。」「あの男性はだれですか。」「彼は私の先生です。」「彼はコートにいます。」「この写真はすばらしいです。」',
 slashRows:[
  {en:'Look at / this picture.',jp:'見てください / この写真を'},
  {en:'Who is / this boy?',jp:'だれですか / この男の子は'},
  {en:'He is / my classmate.',jp:'彼は〜です / 私のクラスメート'},
  {en:'Is he / a runner?',jp:'彼は〜ですか / ランナー'},
  {en:'Yes, / he is.',jp:'はい / そうです'},
  {en:'He is / on the track and field team.',jp:'彼は所属しています / 陸上競技のチームに'},
  {en:'Who is / that woman?',jp:'だれですか / あの女性は'},
  {en:'She is / a street singer.',jp:'彼女は〜です / ストリートシンガー'},
  {en:'Is she / famous?',jp:'彼女は〜ですか / 有名な'},
  {en:'Yes, / she is.',jp:'はい / そうです'},
  {en:'Who is / that man?',jp:'だれですか / あの男性は'},
  {en:'He is / my teacher.',jp:'彼は〜です / 私の先生'},
  {en:'He is / on the court.',jp:'彼はいます / コートに'},
  {en:'This picture is / great.',jp:'この写真は〜です / すばらしい'}
 ],
 questions:[
  {prompt:'1. 最初の男の子は話し手の何ですか。本文から英語で答えなさい。',answer:'my classmate',evidence:'He is my classmate.',evidenceJp:'彼は私のクラスメートです。',reason:'He is の後ろの my classmate がその男の子と話し手の関係を示しています。'},
  {prompt:'2. その男の子はランナーですか。本文に合うように Yes / No で答えなさい。',answer:'Yes',evidence:'Is he a runner? / Yes, he is.',evidenceJp:'彼はランナーですか。／はい、そうです。',reason:'質問に Yes, he is. と答えています。'},
  {prompt:'3. その男の子は何のチームに入っていますか。本文から英語で答えなさい。',answer:'the track and field team',evidence:'He is on the track and field team.',evidenceJp:'彼は陸上競技のチームに入っています。',reason:'on the ... team の中に track and field が入っています。'},
  {prompt:'4. あの女性は何をしている人ですか。本文から英語で答えなさい。',answer:'a street singer',evidence:'She is a street singer.',evidenceJp:'彼女はストリートシンガーです。',reason:'She is の後ろの a street singer がその女性を説明しています。'},
  {prompt:'5. 最後の男性はどこにいますか。本文から英語で答えなさい。',answer:'on the court',evidence:'He is on the court.',evidenceJp:'彼はコートにいます。',reason:'on the court が男性のいる場所を示しています。'}
 ],
 allowedWords:[
  ['woman / man / boy / classmate / cookie / brand / towel / runner / track and field / court / year / who / she / he / buy / famous / old / street singer / ～ year(s) old','PROGRAM 4-2: id340-358'],
  ['picture / Look at ～','PROGRAM 2-3 cumulative'],['teacher','PROGRAM 1-1 cumulative'],['on the ～ team','Get Ready 4 cumulative phrase'],['this / that / my / is / a / yes / the / great','cumulative / elementary']
 ],
 auditNote:'v9内蔵VOCABでPROGRAM 4-2をid340〜358まで照合し、id359からPROGRAM 4-3へ切り替わることを確認。who / he / she、boy / woman / man / classmate / runner / track and field / court / street singer / famousを1枚の写真の人物紹介に統合。buy / cookie / brand / towel / old / 年齢表現は話の流れに不要なため未使用。一般動詞の三単現を避け、be動詞中心で構成した。',
 vocabAudit:true,manualSlashAudit:true,manualMeaningAudit:true,manualQuestionAudit:true
};

window.V10_PASSAGES['PROGRAM 4-3']={
 id:'V10-SS-G1-P4-3-001',textbook:'サンシャイン',grade:'1',section:'PROGRAM 4-3',level:'HOP',title:'A Fruit Guessing Game',
 sentences:[
  'I have a question.',
  'This fruit is yellow and long.',
  'What is it?',
  'Is it a banana?',
  'Yes.',
  'That’s right.',
  'I got it!',
  'This fruit is round and sweet.',
  'What is it?',
  'Is it a cherry?',
  'Yes.',
  'That’s right.',
  'Would you like a banana?',
  'Yes, thank you.',
  'I like fruit.'
 ],
 fullTranslation:'「質問があります。このくだものは黄色くて長いです。」「それは何ですか。」「バナナですか。」「はい。」「そのとおりです。」「わかった！」「このくだものは丸くて甘いです。」「それは何ですか。」「サクランボですか。」「はい。」「そのとおりです。」「バナナはいかがですか。」「はい、ありがとう。」「私はくだものが好きです。」',
 slashRows:[
  {en:'I have / a question.',jp:'私は持っています / 1つの質問を'},
  {en:'This fruit is / yellow and long.',jp:'このくだものは〜です / 黄色くて長い'},
  {en:'What is / it?',jp:'何ですか / それは'},
  {en:'Is it / a banana?',jp:'それは〜ですか / バナナ'},
  {en:'Yes.',jp:'はい。'},
  {en:'That’s right.',jp:'そのとおりです。'},
  {en:'I got it!',jp:'わかった！'},
  {en:'This fruit is / round and sweet.',jp:'このくだものは〜です / 丸くて甘い'},
  {en:'What is / it?',jp:'何ですか / それは'},
  {en:'Is it / a cherry?',jp:'それは〜ですか / サクランボ'},
  {en:'Yes.',jp:'はい。'},
  {en:'That’s right.',jp:'そのとおりです。'},
  {en:'Would you like / a banana?',jp:'〜はいかがですか / バナナ'},
  {en:'Yes, / thank you.',jp:'はい / ありがとう'},
  {en:'I like / fruit.',jp:'私は好きです / くだものが'}
 ],
 questions:[
  {prompt:'1. 最初のくだものは何色で、どんな形ですか。本文から英語で2語答えなさい。',answer:'yellow, long',evidence:'This fruit is yellow and long.',evidenceJp:'このくだものは黄色くて長いです。',reason:'yellow と long が最初のくだものの特徴を表しています。'},
  {prompt:'2. 最初のくだものは何ですか。本文から英語で答えなさい。',answer:'a banana',evidence:'Is it a banana? / Yes.',evidenceJp:'バナナですか。／はい。',reason:'banana かという質問を Yes. で肯定しています。'},
  {prompt:'3. 2つ目のくだものはどのような味ですか。本文から英語で1語抜き出しなさい。',answer:'sweet',evidence:'This fruit is round and sweet.',evidenceJp:'このくだものは丸くて甘いです。',reason:'sweet が味を表しています。'},
  {prompt:'4. 2つ目のくだものは何ですか。本文から英語で答えなさい。',answer:'a cherry',evidence:'Is it a cherry? / Yes.',evidenceJp:'サクランボですか。／はい。',reason:'cherry かという質問を Yes. で肯定しています。'},
  {prompt:'5. 最後に何をすすめていますか。本文から英語で答えなさい。',answer:'a banana',evidence:'Would you like a banana?',evidenceJp:'バナナはいかがですか。',reason:'Would you like ～? の後ろの a banana がすすめているものです。'}
 ],
 allowedWords:[
  ['meat / legend / worry / ready / deep-fried / ha-ha / lady / custard pudding / traditional / sister / cool / sweet / who’s / she’s / Would you like ～? / answer / round / fruit / banana / cherry / tomato / hint / corn / yellow / long / right / sour / got / I got it! / That’s right.','PROGRAM 4-3: id359-388'],
  ['question','PROGRAM 2-3 cumulative'],['what','cumulative'],['have / this / is / it / a / yes / and / I / like / thank you','cumulative / elementary']
 ],
 auditNote:'v9内蔵VOCABでPROGRAM 4-3をid359〜388まで照合し、id389からPROGRAM 5-1へ切り替わることを確認。fruit / banana / cherry / yellow / long / round / sweetと、明示登録のI got it! / That’s right. / Would you like ～?を果物当ての1場面に統合。got単独を新しい過去文として広げず、正本に登録されたI got it!の定型表現だけを使用。tomato / corn / meat / custard pudding等は場面を散らすため未使用。',
 vocabAudit:true,manualSlashAudit:true,manualMeaningAudit:true,manualQuestionAudit:true
};