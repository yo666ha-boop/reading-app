window.V10_SUNSHINE_G1=window.V10_SUNSHINE_G1||{};
(function(){
function repair(section,patch){if(!window.V10_SUNSHINE_G1[section])throw new Error('Missing passage for semantic repair: '+section);Object.assign(window.V10_SUNSHINE_G1[section],patch);}

repair('PROGRAM 2-3',{
 title:'Drawing During the Break',
 sentences:['Look at this picture.','Wow!','I draw this picture in my notebook.','I draw at home, too.','Are you an artist?','No, I’m not.','I like this picture.','This pencil is for you.','Thank you.','I have two.','We can draw during the break.','Let’s draw tomorrow.','Great!'],
 fullTranslation:'「この絵を見て。」「わあ！」「私はこの絵をノートにかきます。」「家でも絵をかきます。」「あなたはアーティストですか。」「いいえ、違います。」「私はこの絵が好きです。」「この鉛筆はあなた用です。」「ありがとう。」「私は2本持っています。」「休み時間にいっしょに絵をかけます。」「明日、絵をかこう。」「いいね！」',
 slashRows:[{en:'Look at / this picture.',jp:'見てください / この絵を'},{en:'Wow!',jp:'わあ！'},{en:'I draw / this picture / in my notebook.',jp:'私はかきます / この絵を / 私のノートに'},{en:'I draw / at home, too.',jp:'私はかきます / 家でも'},{en:'Are you / an artist?',jp:'あなたは〜ですか / アーティスト'},{en:'No, / I’m not.',jp:'いいえ / 違います'},{en:'I like / this picture.',jp:'私は好きです / この絵が'},{en:'This pencil is / for you.',jp:'この鉛筆は〜です / あなた用'},{en:'Thank you.',jp:'ありがとう。'},{en:'I have / two.',jp:'私は持っています / 2本'},{en:'We can draw / during the break.',jp:'私たちはかくことができます / 休み時間に'},{en:'Let’s draw / tomorrow.',jp:'かきましょう / 明日'},{en:'Great!',jp:'いいね！'}],
 questions:[{prompt:'1. 最初に相手へ見てほしいものは何ですか。本文から英語で答えなさい。',answer:'this picture',evidence:'Look at this picture.',evidenceJp:'この絵を見て。',reason:'Look at の目的語が this picture です。'},{prompt:'2. 話し手は絵をどこにかきますか。本文から英語で答えなさい。',answer:'my notebook',evidence:'I draw this picture in my notebook.',evidenceJp:'私はこの絵をノートにかきます。',reason:'in の後ろが my notebook です。'},{prompt:'3. 話し手はアーティストですか。本文に合うように Yes / No で答えなさい。',answer:'No',evidence:'Are you an artist? / No, I’m not.',evidenceJp:'あなたはアーティストですか。／いいえ、違います。',reason:'No, I’m not. と否定しています。'},{prompt:'4. 相手に渡すものは何ですか。本文から英語で答えなさい。',answer:'this pencil',evidence:'This pencil is for you.',evidenceJp:'この鉛筆はあなた用です。',reason:'for you とされているものが This pencil です。'},{prompt:'5. いついっしょに絵をかこうと言っていますか。本文から英語で答えなさい。',answer:'tomorrow',evidence:'Let’s draw tomorrow.',evidenceJp:'明日、絵をかこう。',reason:'tomorrow が提案した時を表しています。'}],
 auditNote:'絵を見せる→自分も絵をかく→鉛筆を渡す→休み時間と翌日にいっしょにかく、という一場面に再構成。無関係な question / Sure のやり取りを削除。'
});

repair('PROGRAM 3-1',{
 title:'What My Family Can Do',
 sentences:['This is my family.','That is my brother.','He can ski well.','I can ski, too.','My father can ski, too.','My mother can’t ski.','My mother can dance well.','My grandfather can dance, too.','My grandmother can dance, too.','We ski in winter.','We don’t ski in summer.','We like winter.','Winter is great.'],
 fullTranslation:'これは私の家族です。あれは私の兄（弟）です。兄（弟）は上手にスキーができます。私もスキーができます。父もスキーができます。母はスキーができません。母は上手に踊れます。祖父も踊れます。祖母も踊れます。私たちは冬にスキーをします。夏にはスキーをしません。私たちは冬が好きです。冬はすばらしいです。',
 slashRows:[{en:'This is / my family.',jp:'これは〜です / 私の家族'},{en:'That is / my brother.',jp:'あれは〜です / 私の兄（弟）'},{en:'He can ski / well.',jp:'彼はスキーができます / 上手に'},{en:'I can ski, / too.',jp:'私もスキーができます / 〜も'},{en:'My father can ski, / too.',jp:'私の父もスキーができます / 〜も'},{en:'My mother can’t ski.',jp:'私の母はスキーができません'},{en:'My mother can dance / well.',jp:'私の母は踊れます / 上手に'},{en:'My grandfather can dance, / too.',jp:'私の祖父も踊れます / 〜も'},{en:'My grandmother can dance, / too.',jp:'私の祖母も踊れます / 〜も'},{en:'We ski / in winter.',jp:'私たちはスキーをします / 冬に'},{en:'We don’t ski / in summer.',jp:'私たちはスキーをしません / 夏に'},{en:'We like / winter.',jp:'私たちは好きです / 冬が'},{en:'Winter is / great.',jp:'冬は〜です / すばらしい'}],
 questions:[{prompt:'1. `That` が指しているのは誰ですか。本文から英語で答えなさい。',answer:'my brother',evidence:'That is my brother.',evidenceJp:'あれは私の兄（弟）です。',reason:'That is の後ろが my brother です。'},{prompt:'2. 兄（弟）はスキーができますか。本文に合うように Yes / No で答えなさい。',answer:'Yes',evidence:'He can ski well.',evidenceJp:'兄（弟）は上手にスキーができます。',reason:'can ski とあるので Yes です。'},{prompt:'3. 母はスキーができますか。本文に合うように Yes / No で答えなさい。',answer:'No',evidence:'My mother can’t ski.',evidenceJp:'母はスキーができません。',reason:'can’t ski と否定されています。'},{prompt:'4. 母ができることは何ですか。本文から英語で答えなさい。',answer:'dance',evidence:'My mother can dance well.',evidenceJp:'母は上手に踊れます。',reason:'can の後ろの dance ができることです。'},{prompt:'5. 家族はいつスキーをしますか。本文から英語で答えなさい。',answer:'in winter',evidence:'We ski in winter.',evidenceJp:'私たちは冬にスキーをします。',reason:'in winter が季節を表しています。'}],
 auditNote:'家族のできることを、スキーのグループ→ダンスのグループ→冬の習慣の順に整理し、能力紹介として一貫させた。'
});

repair('PROGRAM 3-2',{
 title:'After-School Practice',
 sentences:['I can speak French.','My friend can play the guitar.','I can play the guitar, too.','I can skate fast.','My friend can skate, too.','Can you do a magic trick?','Yes, I can.','Great!','We can practice after school.','I like the guitar.','My friend and I can skate together.','Sounds great.'],
 fullTranslation:'私はフランス語を話せます。友達はギターを弾けます。私もギターを弾けます。私は速くスケートができます。友達もスケートができます。「手品ができますか。」「はい、できます。」「すごい！」私たちは放課後に練習できます。私はギターが好きです。友達と私はいっしょにスケートができます。「楽しそうですね。」',
 slashRows:[{en:'I can speak / French.',jp:'私は話せます / フランス語を'},{en:'My friend can play / the guitar.',jp:'私の友達は演奏できます / ギターを'},{en:'I can play / the guitar, too.',jp:'私も演奏できます / ギターを'},{en:'I can skate / fast.',jp:'私はスケートができます / 速く'},{en:'My friend can skate, / too.',jp:'私の友達もスケートができます / 〜も'},{en:'Can you do / a magic trick?',jp:'あなたはできますか / 手品を'},{en:'Yes, / I can.',jp:'はい / できます'},{en:'Great!',jp:'すごい！'},{en:'We can practice / after school.',jp:'私たちは練習できます / 放課後に'},{en:'I like / the guitar.',jp:'私は好きです / ギターが'},{en:'My friend and I / can skate / together.',jp:'私の友達と私は / スケートができます / いっしょに'},{en:'Sounds / great.',jp:'〜そうですね / 楽しそう'}],
 questions:[{prompt:'1. 話し手は何語を話せますか。本文から英語で答えなさい。',answer:'French',evidence:'I can speak French.',evidenceJp:'私はフランス語を話せます。',reason:'speak の目的語が French です。'},{prompt:'2. 友達は何を演奏できますか。本文から英語で答えなさい。',answer:'the guitar',evidence:'My friend can play the guitar.',evidenceJp:'友達はギターを弾けます。',reason:'play の目的語が the guitar です。'},{prompt:'3. 話し手もギターを弾けますか。本文に合うように Yes / No で答えなさい。',answer:'Yes',evidence:'I can play the guitar, too.',evidenceJp:'私もギターを弾けます。',reason:'can play the guitar とあるので Yes です。'},{prompt:'4. 手品ができますか。本文に合うように Yes / No で答えなさい。',answer:'Yes',evidence:'Can you do a magic trick? / Yes, I can.',evidenceJp:'手品ができますか。／はい、できます。',reason:'質問に Yes, I can. と答えています。'},{prompt:'5. いつ練習できますか。本文から英語で答えなさい。',answer:'after school',evidence:'We can practice after school.',evidenceJp:'私たちは放課後に練習できます。',reason:'after school が練習する時です。'}],
 auditNote:'複数の Can you ...? を繰り返すドリル型から、2人のできることを確認して放課後の練習へつなげる流れに再構成。'
});

repair('PROGRAM 3-3',{
 title:'Our Rescue Robot Show',
 sentences:['This is our rescue robot.','The robot is in our show.','I am so excited.','It can carry a heavy thing.','It can carry water, too.','It can find people.','It can help people.','It can help people in a tree.','It can fly, too.','It is wonderful.','Good luck!','Our show is great.'],
 fullTranslation:'これは私たちの救助ロボットです。そのロボットは私たちのショーに出ます。私はとてもわくわくしています。重いものを運べます。水も運べます。人を見つけられます。人を助けられます。木にいる人も助けられます。飛ぶこともできます。すばらしいロボットです。「がんばって！」私たちのショーはすばらしいです。',
 slashRows:[{en:'This is / our rescue robot.',jp:'これは〜です / 私たちの救助ロボット'},{en:'The robot is / in our show.',jp:'そのロボットはいます / 私たちのショーに'},{en:'I am / so excited.',jp:'私は〜です / とてもわくわくしている'},{en:'It can carry / a heavy thing.',jp:'それは運べます / 重いものを'},{en:'It can carry / water, too.',jp:'それは運べます / 水も'},{en:'It can find / people.',jp:'それは見つけられます / 人々を'},{en:'It can help / people.',jp:'それは助けられます / 人々を'},{en:'It can help / people / in a tree.',jp:'それは助けられます / 人々を / 木にいる'},{en:'It can fly, / too.',jp:'それは飛べます / 〜も'},{en:'It is / wonderful.',jp:'それは〜です / すばらしい'},{en:'Good luck!',jp:'がんばって！'},{en:'Our show is / great.',jp:'私たちのショーは〜です / すばらしい'}],
 questions:[{prompt:'1. 最初に示されているものは何ですか。本文から英語で答えなさい。',answer:'our rescue robot',evidence:'This is our rescue robot.',evidenceJp:'これは私たちの救助ロボットです。',reason:'最初の文で示されています。'},{prompt:'2. ロボットは何を運べますか。本文から英語で2つ答えなさい。',answer:'a heavy thing and water',evidence:'It can carry a heavy thing. / It can carry water, too.',evidenceJp:'重いものを運べます。／水も運べます。',reason:'carry の目的語が2つ示されています。'},{prompt:'3. ロボットは誰を見つけられますか。本文から英語で答えなさい。',answer:'people',evidence:'It can find people.',evidenceJp:'人を見つけられます。',reason:'find の目的語が people です。'},{prompt:'4. 木にいる人を助けられますか。本文に合うように Yes / No で答えなさい。',answer:'Yes',evidence:'It can help people in a tree.',evidenceJp:'木にいる人も助けられます。',reason:'can help と明示されています。'},{prompt:'5. ロボットについてどのようだと言っていますか。本文から英語で1語抜き出しなさい。',answer:'wonderful',evidence:'It is wonderful.',evidenceJp:'すばらしいロボットです。',reason:'wonderful が評価です。'}],
 auditNote:'救助ロボットの実演という一場面に限定し、同じ能力を質問→Yesで重ねる部分を削除。能力の列挙もcarry/find/help/flyという救助目的に統一。'
});

repair('PROGRAM 4-1',{
 title:'Animals in a Picture',
 sentences:['Look at this picture.','Is this a zebra?','No, it isn’t.','This is a horse.','Is that an elephant?','Yes, it is.','Look at that ant.','Is that a butterfly?','No, it isn’t.','That is an ant.','I like the horse and the elephant.','This picture is great.'],
 fullTranslation:'「この絵を見て。」「これはシマウマですか。」「いいえ、違います。」「これはウマです。」「あれはゾウですか。」「はい、そうです。」「あのアリを見て。」「あれはチョウですか。」「いいえ、違います。」「あれはアリです。」「私はウマとゾウが好きです。」「この絵はすばらしいです。」',
 slashRows:[{en:'Look at / this picture.',jp:'見てください / この絵を'},{en:'Is this / a zebra?',jp:'これは〜ですか / シマウマ'},{en:'No, / it isn’t.',jp:'いいえ / 違います'},{en:'This is / a horse.',jp:'これは〜です / ウマ'},{en:'Is that / an elephant?',jp:'あれは〜ですか / ゾウ'},{en:'Yes, / it is.',jp:'はい / そうです'},{en:'Look at / that ant.',jp:'見てください / あのアリを'},{en:'Is that / a butterfly?',jp:'あれは〜ですか / チョウ'},{en:'No, / it isn’t.',jp:'いいえ / 違います'},{en:'That is / an ant.',jp:'あれは〜です / アリ'},{en:'I like / the horse and the elephant.',jp:'私は好きです / ウマとゾウが'},{en:'This picture is / great.',jp:'この絵は〜です / すばらしい'}],
 questions:[{prompt:'1. 最初にシマウマかとたずねたものは、実際には何でしたか。本文から英語で答えなさい。',answer:'a horse',evidence:'This is a horse.',evidenceJp:'これはウマです。',reason:'シマウマを否定した直後に horse と示されています。'},{prompt:'2. あれはゾウですか。本文に合うように Yes / No で答えなさい。',answer:'Yes',evidence:'Is that an elephant? / Yes, it is.',evidenceJp:'あれはゾウですか。／はい、そうです。',reason:'Yes, it is. と答えています。'},{prompt:'3. チョウだと思ったものは実際には何でしたか。本文から英語で答えなさい。',answer:'an ant',evidence:'Is that a butterfly? / No, it isn’t. / That is an ant.',evidenceJp:'あれはチョウですか。／いいえ、違います。／あれはアリです。',reason:'butterfly を否定したあと ant と示されています。'},{prompt:'4. 話し手が好きな動物を2つ答えなさい。',answer:'the horse and the elephant',evidence:'I like the horse and the elephant.',evidenceJp:'私はウマとゾウが好きです。',reason:'like の目的語に2種類が示されています。'},{prompt:'5. 最後に絵をどのように評価していますか。本文から英語で1語抜き出しなさい。',answer:'great',evidence:'This picture is great.',evidenceJp:'この絵はすばらしいです。',reason:'great が絵への評価です。'}],
 auditNote:'1枚の動物の絵を見分ける活動に絞り、推測→訂正を2回行って終える構成に整理。'
});

repair('PROGRAM 4-2',{
 title:'People in a Sports Picture',
 sentences:['Look at this picture.','Who is this boy?','He is my classmate.','Is he a runner?','Yes, he is.','He is on the track and field team.','Who is that man?','He is my teacher.','He is on the court.','Is he on the track and field team?','No, he isn’t.','This picture is great.'],
 fullTranslation:'「この写真を見て。」「この男の子はだれですか。」「彼は私のクラスメートです。」「彼はランナーですか。」「はい、そうです。」「彼は陸上競技のチームに入っています。」「あの男性はだれですか。」「彼は私の先生です。」「彼はコートにいます。」「彼も陸上競技のチームに入っていますか。」「いいえ、入っていません。」「この写真はすばらしいです。」',
 slashRows:[{en:'Look at / this picture.',jp:'見てください / この写真を'},{en:'Who is / this boy?',jp:'だれですか / この男の子は'},{en:'He is / my classmate.',jp:'彼は〜です / 私のクラスメート'},{en:'Is he / a runner?',jp:'彼は〜ですか / ランナー'},{en:'Yes, / he is.',jp:'はい / そうです'},{en:'He is / on the track and field team.',jp:'彼は所属しています / 陸上競技のチームに'},{en:'Who is / that man?',jp:'だれですか / あの男性は'},{en:'He is / my teacher.',jp:'彼は〜です / 私の先生'},{en:'He is / on the court.',jp:'彼はいます / コートに'},{en:'Is he / on the track and field team?',jp:'彼は所属していますか / 陸上競技のチームに'},{en:'No, / he isn’t.',jp:'いいえ / 所属していません'},{en:'This picture is / great.',jp:'この写真は〜です / すばらしい'}],
 questions:[{prompt:'1. 最初の男の子は話し手の何ですか。本文から英語で答えなさい。',answer:'my classmate',evidence:'He is my classmate.',evidenceJp:'彼は私のクラスメートです。',reason:'He is の後ろが関係を示しています。'},{prompt:'2. その男の子はランナーですか。本文に合うように Yes / No で答えなさい。',answer:'Yes',evidence:'Is he a runner? / Yes, he is.',evidenceJp:'彼はランナーですか。／はい、そうです。',reason:'Yes, he is. と答えています。'},{prompt:'3. その男の子は何のチームに入っていますか。本文から英語で答えなさい。',answer:'the track and field team',evidence:'He is on the track and field team.',evidenceJp:'彼は陸上競技のチームに入っています。',reason:'on the ... team の部分が所属を示します。'},{prompt:'4. 最後の男性は話し手の何ですか。本文から英語で答えなさい。',answer:'my teacher',evidence:'He is my teacher.',evidenceJp:'彼は私の先生です。',reason:'He is の後ろが my teacher です。'},{prompt:'5. 先生はどこにいますか。本文から英語で答えなさい。',answer:'on the court',evidence:'He is on the court.',evidenceJp:'彼はコートにいます。',reason:'on the court が場所です。'}],
 auditNote:'1枚のスポーツ写真に話題を限定。無関係なstreet singerを削除し、クラスメートのランナーとコートにいる先生だけを紹介する構成へ変更。'
});

repair('PROGRAM 4-3',{
 title:'A Fruit Guessing Game',
 sentences:['I have a question.','This fruit is yellow and long.','What is it?','Is it a banana?','Yes.','That’s right.','I got it!','This fruit is round and sweet.','What is it?','Is it a cherry?','Yes.','That’s right.','I like fruit.'],
 fullTranslation:'「質問があります。このくだものは黄色くて長いです。」「それは何ですか。」「バナナですか。」「はい。」「そのとおりです。」「わかった！」「このくだものは丸くて甘いです。」「それは何ですか。」「サクランボですか。」「はい。」「そのとおりです。」「私はくだものが好きです。」',
 slashRows:[{en:'I have / a question.',jp:'私は持っています / 1つの質問を'},{en:'This fruit is / yellow and long.',jp:'このくだものは〜です / 黄色くて長い'},{en:'What is / it?',jp:'何ですか / それは'},{en:'Is it / a banana?',jp:'それは〜ですか / バナナ'},{en:'Yes.',jp:'はい。'},{en:'That’s right.',jp:'そのとおりです。'},{en:'I got it!',jp:'わかった！'},{en:'This fruit is / round and sweet.',jp:'このくだものは〜です / 丸くて甘い'},{en:'What is / it?',jp:'何ですか / それは'},{en:'Is it / a cherry?',jp:'それは〜ですか / サクランボ'},{en:'Yes.',jp:'はい。'},{en:'That’s right.',jp:'そのとおりです。'},{en:'I like / fruit.',jp:'私は好きです / くだものが'}],
 questions:[{prompt:'1. 最初のくだものは何色で、どんな形ですか。本文から英語で2語答えなさい。',answer:'yellow, long',evidence:'This fruit is yellow and long.',evidenceJp:'このくだものは黄色くて長いです。',reason:'yellow と long が特徴です。'},{prompt:'2. 最初のくだものは何ですか。本文から英語で答えなさい。',answer:'a banana',evidence:'Is it a banana? / Yes.',evidenceJp:'バナナですか。／はい。',reason:'banana かという質問を肯定しています。'},{prompt:'3. 2つ目のくだものはどのような味ですか。本文から英語で1語抜き出しなさい。',answer:'sweet',evidence:'This fruit is round and sweet.',evidenceJp:'このくだものは丸くて甘いです。',reason:'sweet が味を表します。'},{prompt:'4. 2つ目のくだものは何ですか。本文から英語で答えなさい。',answer:'a cherry',evidence:'Is it a cherry? / Yes.',evidenceJp:'サクランボですか。／はい。',reason:'cherry かという質問を肯定しています。'},{prompt:'5. 話し手はくだものが好きですか。本文に合うように Yes / No で答えなさい。',answer:'Yes',evidence:'I like fruit.',evidenceJp:'私はくだものが好きです。',reason:'I like fruit. と明示されています。'}],
 auditNote:'果物当てゲームの2問だけに集中し、ゲーム後の無関係なbanana提供場面を削除。'
});

repair('PROGRAM 5-1',{
 title:'A Pajama Design',
 sentences:['This is my brother.','This is his pajama design.','He is in home economics.','He can sew.','Does he like drawing?','Yes, he does.','His drawing is great.','This design is yellow.','Does he like this design?','Yes, he does.','Does he like this long design?','No, he doesn’t.','This pajama design is great.'],
 fullTranslation:'これは私の兄（弟）です。これは彼のパジャマのデザインです。彼は家庭科の授業にいます。縫い物ができます。「絵をかくことが好きですか。」「はい、好きです。」彼の絵はすばらしいです。このデザインは黄色です。「このデザインが好きですか。」「はい、好きです。」「この長いデザインが好きですか。」「いいえ、好きではありません。」このパジャマのデザインはすばらしいです。',
 slashRows:[{en:'This is / my brother.',jp:'これは〜です / 私の兄（弟）'},{en:'This is / his pajama design.',jp:'これは〜です / 彼のパジャマのデザイン'},{en:'He is / in home economics.',jp:'彼はいます / 家庭科の授業に'},{en:'He can sew.',jp:'彼は縫い物ができます'},{en:'Does he like / drawing?',jp:'彼は好きですか / 絵をかくことが'},{en:'Yes, / he does.',jp:'はい / 好きです'},{en:'His drawing is / great.',jp:'彼の絵は〜です / すばらしい'},{en:'This design is / yellow.',jp:'このデザインは〜です / 黄色い'},{en:'Does he like / this design?',jp:'彼は好きですか / このデザインが'},{en:'Yes, / he does.',jp:'はい / 好きです'},{en:'Does he like / this long design?',jp:'彼は好きですか / この長いデザインが'},{en:'No, / he doesn’t.',jp:'いいえ / 好きではありません'},{en:'This pajama design is / great.',jp:'このパジャマのデザインは〜です / すばらしい'}],
 questions:[{prompt:'1. パジャマのデザインは誰のものですか。本文から英語で答えなさい。',answer:'my brother',evidence:'This is my brother. / This is his pajama design.',evidenceJp:'これは私の兄（弟）です。／これは彼のパジャマのデザインです。',reason:'his が直前の my brother を指します。'},{prompt:'2. 兄（弟）は縫い物ができますか。本文に合うように Yes / No で答えなさい。',answer:'Yes',evidence:'He can sew.',evidenceJp:'縫い物ができます。',reason:'can sew と明示されています。'},{prompt:'3. 兄（弟）は絵をかくことが好きですか。本文に合うように Yes / No で答えなさい。',answer:'Yes',evidence:'Does he like drawing? / Yes, he does.',evidenceJp:'絵をかくことが好きですか。／はい、好きです。',reason:'Yes, he does. と答えています。'},{prompt:'4. デザインは何色ですか。本文から英語で1語抜き出しなさい。',answer:'yellow',evidence:'This design is yellow.',evidenceJp:'このデザインは黄色です。',reason:'yellow が色を表します。'},{prompt:'5. 兄（弟）は長いデザインが好きですか。本文に合うように Yes / No で答えなさい。',answer:'No',evidence:'Does he like this long design? / No, he doesn’t.',evidenceJp:'この長いデザインが好きですか。／いいえ、好きではありません。',reason:'No, he doesn’t. と否定しています。'}],
 auditNote:'家庭科のパジャマデザインという1場面へ全面再構成。無関係なcurry and riceを削除し、一般的なデザインとlong designの好みを明示的に分けた。'
});

repair('PROGRAM 5-2',{
 title:'An Ice Hockey Player',
 sentences:['Look at this picture.','Who is this man?','He is an ice hockey player.','He can skate fast.','Look at his clothes.','His clothes are yellow.','He is on a team.','His team is famous.','Does he like ice hockey?','Yes, he does.','Does he like his clothes?','Yes, he does.','This picture is great.'],
 fullTranslation:'「この絵を見て。」「この男性はだれですか。」「彼はアイスホッケー選手です。」彼は速くスケートができます。「彼の服を見て。」服は黄色です。彼はチームに入っています。そのチームは有名です。「彼はアイスホッケーが好きですか。」「はい、好きです。」「自分の服が好きですか。」「はい、好きです。」「この絵はすばらしいです。」',
 slashRows:[{en:'Look at / this picture.',jp:'見てください / この絵を'},{en:'Who is / this man?',jp:'だれですか / この男性は'},{en:'He is / an ice hockey player.',jp:'彼は〜です / アイスホッケー選手'},{en:'He can skate / fast.',jp:'彼はスケートができます / 速く'},{en:'Look at / his clothes.',jp:'見てください / 彼の服を'},{en:'His clothes are / yellow.',jp:'彼の服は〜です / 黄色い'},{en:'He is / on a team.',jp:'彼は所属しています / チームに'},{en:'His team is / famous.',jp:'彼のチームは〜です / 有名な'},{en:'Does he like / ice hockey?',jp:'彼は好きですか / アイスホッケーが'},{en:'Yes, / he does.',jp:'はい / 好きです'},{en:'Does he like / his clothes?',jp:'彼は好きですか / 自分の服が'},{en:'Yes, / he does.',jp:'はい / 好きです'},{en:'This picture is / great.',jp:'この絵は〜です / すばらしい'}],
 questions:[{prompt:'1. 絵の男性は何をする人ですか。本文から英語で答えなさい。',answer:'an ice hockey player',evidence:'He is an ice hockey player.',evidenceJp:'彼はアイスホッケー選手です。',reason:'He is の後ろが立場を示しています。'},{prompt:'2. その男性は速くスケートができますか。本文に合うように Yes / No で答えなさい。',answer:'Yes',evidence:'He can skate fast.',evidenceJp:'彼は速くスケートができます。',reason:'can skate fast とあります。'},{prompt:'3. 服は何色ですか。本文から英語で1語抜き出しなさい。',answer:'yellow',evidence:'His clothes are yellow.',evidenceJp:'服は黄色です。',reason:'yellow が服の色です。'},{prompt:'4. チームはどのようだと書かれていますか。本文から英語で1語抜き出しなさい。',answer:'famous',evidence:'His team is famous.',evidenceJp:'そのチームは有名です。',reason:'famous がチームの説明です。'},{prompt:'5. その男性はアイスホッケーが好きですか。本文に合うように Yes / No で答えなさい。',answer:'Yes',evidence:'Does he like ice hockey? / Yes, he does.',evidenceJp:'彼はアイスホッケーが好きですか。／はい、好きです。',reason:'Yes, he does. と答えています。'}],
 auditNote:'選手の人物説明→能力→服→チーム→好み、という1枚の写真説明の順に整理し、質問ドリル感を弱めた。'
});

repair('PROGRAM 5-3',{
 title:'A Charity Event',
 sentences:['This is a charity event.','It is at my elementary school.','We support sick children.','The children are in a hospital.','We have a photo of the event.','We work together.','We spend time at the hospital.','We talk about the children.','I am proud of our work.','I would like to support the children.','I’d like to talk about the event.','This event is great.'],
 fullTranslation:'これはチャリティー行事です。私の小学校で行われます。私たちは病気の子どもたちを支援します。その子どもたちは病院にいます。行事の写真があります。私たちはいっしょに活動します。病院で時間を過ごします。子どもたちについて話します。私は私たちの活動を誇りに思っています。子どもたちを支援したいです。この行事について話したいです。この行事はすばらしいです。',
 slashRows:[{en:'This is / a charity event.',jp:'これは〜です / チャリティー行事'},{en:'It is / at my elementary school.',jp:'それは行われます / 私の小学校で'},{en:'We support / sick children.',jp:'私たちは支援します / 病気の子どもたちを'},{en:'The children are / in a hospital.',jp:'その子どもたちはいます / 病院に'},{en:'We have / a photo / of the event.',jp:'私たちは持っています / 1枚の写真を / その行事の'},{en:'We work / together.',jp:'私たちは活動します / いっしょに'},{en:'We spend / time / at the hospital.',jp:'私たちは過ごします / 時間を / 病院で'},{en:'We talk about / the children.',jp:'私たちは話します / その子どもたちについて'},{en:'I am proud of / our work.',jp:'私は誇りに思っています / 私たちの活動を'},{en:'I would like to support / the children.',jp:'私は支援したいです / その子どもたちを'},{en:'I’d like to talk about / the event.',jp:'私は話したいです / その行事について'},{en:'This event is / great.',jp:'この行事は〜です / すばらしい'}],
 questions:[{prompt:'1. これはどんな行事ですか。本文から英語で答えなさい。',answer:'a charity event',evidence:'This is a charity event.',evidenceJp:'これはチャリティー行事です。',reason:'最初の文で示されています。'},{prompt:'2. 行事はどこで行われますか。本文から英語で答えなさい。',answer:'my elementary school',evidence:'It is at my elementary school.',evidenceJp:'私の小学校で行われます。',reason:'at の後ろが場所です。'},{prompt:'3. 誰を支援していますか。本文から英語で答えなさい。',answer:'sick children',evidence:'We support sick children.',evidenceJp:'私たちは病気の子どもたちを支援します。',reason:'support の目的語が sick children です。'},{prompt:'4. 話し手は何を誇りに思っていますか。本文から英語で答えなさい。',answer:'our work',evidence:'I am proud of our work.',evidenceJp:'私は私たちの活動を誇りに思っています。',reason:'be proud of の後ろが our work です。'},{prompt:'5. 話し手は何をしたいと言っていますか。本文から英語で答えなさい。',answer:'support the children',evidence:'I would like to support the children.',evidenceJp:'子どもたちを支援したいです。',reason:'would like to の後ろが希望する行動です。'}],
 auditNote:'チャリティー行事→支援対象→活動→振り返りの順に整理。proud/supportの重複を削り、行事の一貫した説明へ修正。'
});

window.V10_INTERACTION_META_SEMANTIC_REPAIRS_011_020={
'サンシャイン|PROGRAM 2-3':{genre:'email',questionSetB:[
 {prompt:'1. 話し手は家でも絵をかきますか。本文に合うように Yes / No で答えなさい。',answer:'Yes',evidence:'I draw at home, too.',evidenceJp:'家でも絵をかきます。',reason:'draw at home と明示されています。'},
 {prompt:'2. 相手に渡すものは何ですか。本文から英語で答えなさい。',answer:'this pencil',evidence:'This pencil is for you.',evidenceJp:'この鉛筆はあなた用です。',reason:'for you とされているものが This pencil です。'},
 {prompt:'3. 話し手はいくつ持っていますか。本文から英語で答えなさい。',answer:'two',evidence:'I have two.',evidenceJp:'私は2本持っています。',reason:'two が数を表します。'},
 {prompt:'4. 休み時間にできることは何ですか。英語で答えなさい。',answer:'draw',evidence:'We can draw during the break.',evidenceJp:'休み時間に絵をかくことができます。',reason:'can の後ろが draw です。'}]},
'サンシャイン|PROGRAM 3-1':{genre:'report',questionSetB:[
 {prompt:'1. 話し手自身もスキーができますか。本文に合うように Yes / No で答えなさい。',answer:'Yes',evidence:'I can ski, too.',evidenceJp:'私もスキーができます。',reason:'can ski とあります。'},
 {prompt:'2. 父もスキーができますか。本文に合うように Yes / No で答えなさい。',answer:'Yes',evidence:'My father can ski, too.',evidenceJp:'父もスキーができます。',reason:'can ski とあります。'},
 {prompt:'3. 祖父と祖母に共通してできることは何ですか。英語で答えなさい。',answer:'dance',evidence:'My grandfather can dance, too. / My grandmother can dance, too.',evidenceJp:'祖父も踊れます。／祖母も踊れます。',reason:'両方に can dance があります。'},
 {prompt:'4. 夏にはスキーをしますか。本文に合うように Yes / No で答えなさい。',answer:'No',evidence:'We don’t ski in summer.',evidenceJp:'夏にはスキーをしません。',reason:'don’t ski と否定されています。'}]},
'サンシャイン|PROGRAM 3-2':{genre:'email',questionSetB:[
 {prompt:'1. 話し手は速く何ができますか。本文から英語で答えなさい。',answer:'skate',evidence:'I can skate fast.',evidenceJp:'私は速くスケートができます。',reason:'can の後ろが skate です。'},
 {prompt:'2. 友達もスケートができますか。本文に合うように Yes / No で答えなさい。',answer:'Yes',evidence:'My friend can skate, too.',evidenceJp:'友達もスケートができます。',reason:'can skate, too とあります。'},
 {prompt:'3. 友達と話し手がいっしょにできることは何ですか。英語で答えなさい。',answer:'skate',evidence:'My friend and I can skate together.',evidenceJp:'友達と私はいっしょにスケートができます。',reason:'can の後ろが skate です。'},
 {prompt:'4. 最後の反応を本文からそのまま抜き出しなさい。',answer:'Sounds great.',evidence:'Sounds great.',evidenceJp:'楽しそうですね。',reason:'最後の反応としてそのまま書かれています。'}]},
'サンシャイン|PROGRAM 3-3':{genre:'report',questionSetB:[
 {prompt:'1. そのロボットはどこに登場しますか。本文から英語で答えなさい。',answer:'in our show',evidence:'The robot is in our show.',evidenceJp:'そのロボットは私たちのショーに出ます。',reason:'in our show が場所です。'},
 {prompt:'2. 話し手はどんな気持ちですか。本文から英語で1語抜き出しなさい。',answer:'excited',evidence:'I am so excited.',evidenceJp:'私はとてもわくわくしています。',reason:'excited が気持ちです。'},
 {prompt:'3. ロボットは飛ぶこともできますか。本文に合うように Yes / No で答えなさい。',answer:'Yes',evidence:'It can fly, too.',evidenceJp:'飛ぶこともできます。',reason:'can fly, too とあります。'},
 {prompt:'4. ショーはどのようだと述べていますか。本文から英語で1語抜き出しなさい。',answer:'great',evidence:'Our show is great.',evidenceJp:'私たちのショーはすばらしいです。',reason:'great が評価です。'}]},
'サンシャイン|PROGRAM 4-1':{genre:'email',questionSetB:[
 {prompt:'1. 最初にシマウマかとたずねたものは、実際には何でしたか。英語で答えなさい。',answer:'a horse',evidence:'This is a horse.',evidenceJp:'これはウマです。',reason:'シマウマを否定した直後に horse と示されています。'},
 {prompt:'2. 「あのアリを見て。」に当たる英文を本文から抜き出しなさい。',answer:'Look at that ant.',evidence:'Look at that ant.',evidenceJp:'あのアリを見て。',reason:'Look at の後ろが that ant です。'},
 {prompt:'3. チョウだと思ったものは実際には何でしたか。英語で答えなさい。',answer:'an ant',evidence:'That is an ant.',evidenceJp:'あれはアリです。',reason:'butterfly を否定したあとに示されています。'},
 {prompt:'4. 最後に、この絵をどのように評価していますか。本文から英語で1語抜き出しなさい。',answer:'great',evidence:'This picture is great.',evidenceJp:'この絵はすばらしいです。',reason:'great が評価です。'}]},
'サンシャイン|PROGRAM 4-2':{genre:'report',questionSetB:[
 {prompt:'1. 最後に出てくる男性は話し手の何ですか。英語で答えなさい。',answer:'my teacher',evidence:'He is my teacher.',evidenceJp:'彼は私の先生です。',reason:'He is の後ろが my teacher です。'},
 {prompt:'2. その先生はどこにいますか。英語で答えなさい。',answer:'on the court',evidence:'He is on the court.',evidenceJp:'彼はコートにいます。',reason:'on the court が場所です。'},
 {prompt:'3. 先生も陸上競技のチームに入っていますか。本文に合うように Yes / No で答えなさい。',answer:'No',evidence:'Is he on the track and field team? / No, he isn’t.',evidenceJp:'彼も陸上競技のチームに入っていますか。／いいえ、入っていません。',reason:'No, he isn’t. と答えています。'},
 {prompt:'4. 写真全体について最後にどのようだと言っていますか。英語で1語答えなさい。',answer:'great',evidence:'This picture is great.',evidenceJp:'この写真はすばらしいです。',reason:'great が評価です。'}]},
'サンシャイン|PROGRAM 4-3':{genre:'email',questionSetB:[
 {prompt:'1. 最初の答えが分かったときの表現を本文からそのまま抜き出しなさい。',answer:'I got it!',evidence:'I got it!',evidenceJp:'わかった！',reason:'答えに気づいた直後の定型表現です。'},
 {prompt:'2. 2つ目のくだものの形を表す英語を1語抜き出しなさい。',answer:'round',evidence:'This fruit is round and sweet.',evidenceJp:'このくだものは丸くて甘いです。',reason:'round が形です。'},
 {prompt:'3. 2つ目のくだものは何ですか。英語で答えなさい。',answer:'a cherry',evidence:'Is it a cherry? / Yes.',evidenceJp:'サクランボですか。／はい。',reason:'質問を Yes. で肯定しています。'},
 {prompt:'4. 話し手はくだものが好きですか。本文に合うように Yes / No で答えなさい。',answer:'Yes',evidence:'I like fruit.',evidenceJp:'私はくだものが好きです。',reason:'I like fruit. と明示されています。'}]},
'サンシャイン|PROGRAM 5-1':{genre:'report',questionSetB:[
 {prompt:'1. 兄（弟）がいる授業は何ですか。本文から英語で答えなさい。',answer:'home economics',evidence:'He is in home economics.',evidenceJp:'彼は家庭科の授業にいます。',reason:'in の後ろが home economics です。'},
 {prompt:'2. 兄（弟）の絵はどのようだと書かれていますか。本文から英語で1語抜き出しなさい。',answer:'great',evidence:'His drawing is great.',evidenceJp:'彼の絵はすばらしいです。',reason:'great が drawing の評価です。'},
 {prompt:'3. 兄（弟）はこのデザインが好きですか。本文に合うように Yes / No で答えなさい。',answer:'Yes',evidence:'Does he like this design? / Yes, he does.',evidenceJp:'このデザインが好きですか。／はい、好きです。',reason:'Yes, he does. と答えています。'},
 {prompt:'4. 長いデザインは好きですか。本文に合うように Yes / No で答えなさい。',answer:'No',evidence:'Does he like this long design? / No, he doesn’t.',evidenceJp:'この長いデザインが好きですか。／いいえ、好きではありません。',reason:'No, he doesn’t. と答えています。'}]},
'サンシャイン|PROGRAM 5-2':{genre:'report',questionSetB:[
 {prompt:'1. 最初に相手へ何を見るように言っていますか。英語で答えなさい。',answer:'this picture',evidence:'Look at this picture.',evidenceJp:'この絵を見て。',reason:'Look at の目的語が this picture です。'},
 {prompt:'2. 選手の服を見てほしいことが分かる英文を本文から1文抜き出しなさい。',answer:'Look at his clothes.',evidence:'Look at his clothes.',evidenceJp:'彼の服を見て。',reason:'his clothes を直接見るように促しています。'},
 {prompt:'3. その選手はチームに入っていますか。本文に合うように Yes / No で答えなさい。',answer:'Yes',evidence:'He is on a team.',evidenceJp:'彼はチームに入っています。',reason:'on a team とあります。'},
 {prompt:'4. 最後に絵をどのように評価していますか。本文から英語で1語抜き出しなさい。',answer:'great',evidence:'This picture is great.',evidenceJp:'この絵はすばらしいです。',reason:'great が評価です。'}]},
'サンシャイン|PROGRAM 5-3':{genre:'report',questionSetB:[
 {prompt:'1. 支援する子どもたちはどこにいますか。本文から英語で答えなさい。',answer:'in a hospital',evidence:'The children are in a hospital.',evidenceJp:'その子どもたちは病院にいます。',reason:'in a hospital が場所です。'},
 {prompt:'2. 行事について持っているものは何ですか。英語で答えなさい。',answer:'a photo',evidence:'We have a photo of the event.',evidenceJp:'行事の写真があります。',reason:'have の目的語が a photo です。'},
 {prompt:'3. 病院で何を過ごしますか。英語で答えなさい。',answer:'time',evidence:'We spend time at the hospital.',evidenceJp:'病院で時間を過ごします。',reason:'spend の目的語が time です。'},
 {prompt:'4. 話し手は何について話したいですか。本文から英語で答えなさい。',answer:'the event',evidence:'I’d like to talk about the event.',evidenceJp:'この行事について話したいです。',reason:'talk about の後ろが the event です。'}]}
};
})();
