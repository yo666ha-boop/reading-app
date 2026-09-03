window.V10_SUNSHINE_G1=window.V10_SUNSHINE_G1||{};

function v10Repair(section, patch){
  if(!window.V10_SUNSHINE_G1[section]) throw new Error('Missing passage for semantic repair: '+section);
  Object.assign(window.V10_SUNSHINE_G1[section],patch);
}

v10Repair('Get Ready 2',{
 title:'My English Book',
 sentences:['This is my English book.','Really?','Yes.','This is a dog.','I see.','This is a cat, too.','I write “dog” in my notebook.','I write “cat” in my notebook, too.','I can read “dog”.','I can read “cat”, too.','Great!'],
 fullTranslation:'「これは私の英語の本です。」「本当に？」「うん。」「これは犬です。」「なるほど。」「これはねこでもあります。」「私はノートに dog と書きます。」「cat もノートに書きます。」「私は dog を読むことができます。」「cat も読むことができます。」「すごい！」',
 slashRows:[{en:'This is / my English book.',jp:'これは〜です / 私の英語の本'},{en:'Really?',jp:'本当に？'},{en:'Yes.',jp:'うん。'},{en:'This is / a dog.',jp:'これは〜です / 犬'},{en:'I see.',jp:'なるほど。'},{en:'This is / a cat, too.',jp:'これは〜でもあります / ねこ'},{en:'I write “dog” / in my notebook.',jp:'私は「dog」と書きます / 私のノートに'},{en:'I write “cat” / in my notebook, too.',jp:'私は「cat」と書きます / 私のノートにも'},{en:'I can read / “dog”.',jp:'私は読むことができます / 「dog」を'},{en:'I can read / “cat”, too.',jp:'私は読むことができます / 「cat」も'},{en:'Great!',jp:'すごい！'}],
 questions:[{prompt:'1. 最初に見せているものは何ですか。本文から英語で答えなさい。',answer:'my English book',evidence:'This is my English book.',evidenceJp:'これは私の英語の本です。',reason:'最初の文で、見せているものをそのまま説明しています。'},{prompt:'2. 本の中で取り上げている動物を2つ、英語で答えなさい。',answer:'dog and cat',evidence:'This is a dog. / This is a cat, too.',evidenceJp:'これは犬です。／これはねこでもあります。',reason:'本文には dog と cat の2つが順に出ています。'},{prompt:'3. ノートに書いた英単語を2つ答えなさい。',answer:'dog and cat',evidence:'I write “dog” in my notebook. / I write “cat” in my notebook, too.',evidenceJp:'私はノートに dog と書きます。／cat もノートに書きます。',reason:'write の目的語として dog と cat が示されています。'},{prompt:'4. 「私」が読める2つの語を答えなさい。',answer:'dog and cat',evidence:'I can read “dog”. / I can read “cat”, too.',evidenceJp:'私は dog を読むことができます。／cat も読むことができます。',reason:'can read の後ろに dog と cat が示されています。'}],
 auditNote:'Get Ready 2 の語彙上限を守り、英語の本を見せる一場面に整理。重複した反応を削り、本文・訳・スラッシュ・設問を再同期。'
});

v10Repair('Get Ready 3',{
 title:'English at School',
 sentences:['What subject do you like?','I like English.','Really?','Yes.','Do you have your English book?','Yes, I do.','Can you read English?','Yes, I can.','Great!','I like English, too.'],
 fullTranslation:'「何の教科が好きですか。」「私は英語が好きです。」「本当に？」「うん。」「英語の本を持っていますか。」「はい、持っています。」「英語を読むことができますか。」「はい、できます。」「すごい！」「私も英語が好きです。」',
 slashRows:[{en:'What subject / do you like?',jp:'何の教科が / あなたは好きですか'},{en:'I like / English.',jp:'私は好きです / 英語が'},{en:'Really?',jp:'本当に？'},{en:'Yes.',jp:'うん。'},{en:'Do you have / your English book?',jp:'あなたは持っていますか / あなたの英語の本を'},{en:'Yes, / I do.',jp:'はい / 持っています'},{en:'Can you read / English?',jp:'あなたは読むことができますか / 英語を'},{en:'Yes, / I can.',jp:'はい / できます'},{en:'Great!',jp:'すごい！'},{en:'I like / English, too.',jp:'私も好きです / 英語が'}],
 questions:[{prompt:'1. 最初の人が好きな教科は何ですか。英語で答えなさい。',answer:'English',evidence:'I like English.',evidenceJp:'私は英語が好きです。',reason:'好きな教科を直接答えています。'},{prompt:'2. 英語の本を持っていますか。本文に合うように Yes / No で答えなさい。',answer:'Yes',evidence:'Do you have your English book? / Yes, I do.',evidenceJp:'英語の本を持っていますか。／はい、持っています。',reason:'質問に Yes, I do. と答えているためです。'},{prompt:'3. 英語を読むことができますか。本文に合うように Yes / No で答えなさい。',answer:'Yes',evidence:'Can you read English? / Yes, I can.',evidenceJp:'英語を読むことができますか。／はい、できます。',reason:'質問に Yes, I can. と答えているためです。'},{prompt:'4. 2人に共通して好きなものは何ですか。英語で答えなさい。',answer:'English',evidence:'I like English. / I like English, too.',evidenceJp:'私は英語が好きです。／私も英語が好きです。',reason:'too により、2人とも英語が好きだと分かります。'}],
 auditNote:'Get Ready 3 の共有された英語好きという一つの会話に整理。Yesの後の重複説明と末尾のぶら下がった反応を削除し、設問も再同期。'
});

v10Repair('Get Ready 4',{
 title:'Basketball in the Gym',
 sentences:['I like basketball.','I am in the basketball club.','I practice in the gym every day.','I can run.','I can jump high.','I can shoot the ball.','Basketball is very exciting.','Do you like basketball?','Yes, I do.','Let’s play basketball together.','Great!'],
 fullTranslation:'私はバスケットボールが好きです。私はバスケットボール部に入っています。毎日体育館で練習します。走ることができます。高くジャンプすることができます。ボールをシュートすることができます。バスケットボールはとてもわくわくします。「バスケットボールは好きですか。」「はい、好きです。」「いっしょにバスケットボールをしよう。」「いいね！」',
 slashRows:[{en:'I like / basketball.',jp:'私は好きです / バスケットボールが'},{en:'I am / in the basketball club.',jp:'私はいます / バスケットボール部に'},{en:'I practice / in the gym / every day.',jp:'私は練習します / 体育館で / 毎日'},{en:'I can run.',jp:'私は走ることができます。'},{en:'I can jump / high.',jp:'私はジャンプできます / 高く'},{en:'I can shoot / the ball.',jp:'私はシュートできます / そのボールを'},{en:'Basketball is / very exciting.',jp:'バスケットボールは〜です / とてもわくわくする'},{en:'Do you like / basketball?',jp:'あなたは好きですか / バスケットボールが'},{en:'Yes, / I do.',jp:'はい / 好きです'},{en:'Let’s play / basketball / together.',jp:'やろう / バスケットボールを / いっしょに'},{en:'Great!',jp:'いいね！'}],
 questions:[{prompt:'1. 「私」は何部に入っていますか。英語で答えなさい。',answer:'the basketball club',evidence:'I am in the basketball club.',evidenceJp:'私はバスケットボール部に入っています。',reason:'in the basketball club が所属する部を示しています。'},{prompt:'2. どこで練習しますか。英語で答えなさい。',answer:'in the gym',evidence:'I practice in the gym every day.',evidenceJp:'毎日体育館で練習します。',reason:'in the gym が練習場所です。'},{prompt:'3. どのくらいの頻度で練習しますか。本文から英語で抜き出しなさい。',answer:'every day',evidence:'I practice in the gym every day.',evidenceJp:'毎日体育館で練習します。',reason:'every day が練習の頻度を表しています。'},{prompt:'4. 「私」ができることを3つ、日本語で答えなさい。',answer:'走ること・高くジャンプすること・ボールをシュートすること',evidence:'I can run. / I can jump high. / I can shoot the ball.',evidenceJp:'走ることができます。／高くジャンプできます。／ボールをシュートできます。',reason:'can の後ろに3つの動作が示されています。'}],
 auditNote:'Get Ready 4 のバスケットボール部という一場面を維持し、重複するpractice文を統合。本文・訳・スラッシュ・設問を再同期。'
});

v10Repair('Get Ready 5',{
 title:'The Zoo',
 sentences:['Do you like the zoo?','Yes, I do.','What do you like?','I like the panda and the monkey.','I like the tiger, too.','Really?','Yes.','Do you like the rabbit?','Yes, I do.','I like the bear, too.'],
 fullTranslation:'「動物園は好きですか。」「はい、好きです。」「何が好きですか。」「パンダとサルが好きです。」「トラも好きです。」「本当に？」「うん。」「ウサギは好きですか。」「はい、好きです。」「クマも好きです。」',
 slashRows:[{en:'Do you like / the zoo?',jp:'あなたは好きですか / 動物園が'},{en:'Yes, / I do.',jp:'はい / 好きです'},{en:'What / do you like?',jp:'何が / あなたは好きですか'},{en:'I like / the panda and the monkey.',jp:'私は好きです / パンダとサルが'},{en:'I like / the tiger, too.',jp:'私は好きです / トラも'},{en:'Really?',jp:'本当に？'},{en:'Yes.',jp:'うん。'},{en:'Do you like / the rabbit?',jp:'あなたは好きですか / ウサギが'},{en:'Yes, / I do.',jp:'はい / 好きです'},{en:'I like / the bear, too.',jp:'私は好きです / クマも'}],
 questions:[{prompt:'1. 最初の質問では、何が好きかをたずねていますか。英語で答えなさい。',answer:'the zoo',evidence:'Do you like the zoo?',evidenceJp:'動物園は好きですか。',reason:'最初の疑問文の like の後ろが対象です。'},{prompt:'2. 最初に好きだと答えた2種類の動物を英語で答えなさい。',answer:'the panda and the monkey',evidence:'I like the panda and the monkey.',evidenceJp:'パンダとサルが好きです。',reason:'and で2種類の動物を並べています。'},{prompt:'3. そのあと、さらに好きだと言った動物は何ですか。英語で答えなさい。',answer:'the tiger',evidence:'I like the tiger, too.',evidenceJp:'トラも好きです。',reason:'too によりトラも好きだと追加しています。'},{prompt:'4. ウサギは好きですか。本文に合うように Yes / No で答えなさい。',answer:'Yes',evidence:'Do you like the rabbit? / Yes, I do.',evidenceJp:'ウサギは好きですか。／はい、好きです。',reason:'質問に Yes, I do. と答えています。'}],
 auditNote:'Get Ready 5 は語彙上限が極めて小さいため、動物園で好きな動物を話す短い会話として整理し、重複する反応を減らした。'
});

v10Repair('Get Ready 6',{
 title:'A Day at the Zoo',
 sentences:['I had lunch at the zoo.','I ate pizza.','I saw a panda.','I saw a monkey, too.','I saw a tiger.','I saw a rabbit.','I saw a bear, too.','I like the panda and the monkey.','I like the tiger, too.','I like the zoo.'],
 fullTranslation:'私は動物園で昼食をとりました。ピザを食べました。パンダを見ました。サルも見ました。トラを見ました。ウサギを見ました。クマも見ました。私はパンダとサルが好きです。トラも好きです。動物園が好きです。',
 slashRows:[{en:'I had lunch / at the zoo.',jp:'私は昼食をとりました / 動物園で'},{en:'I ate / pizza.',jp:'私は食べました / ピザを'},{en:'I saw / a panda.',jp:'私は見ました / パンダを'},{en:'I saw / a monkey, too.',jp:'私は見ました / サルも'},{en:'I saw / a tiger.',jp:'私は見ました / トラを'},{en:'I saw / a rabbit.',jp:'私は見ました / ウサギを'},{en:'I saw / a bear, too.',jp:'私は見ました / クマも'},{en:'I like / the panda and the monkey.',jp:'私は好きです / パンダとサルが'},{en:'I like / the tiger, too.',jp:'私は好きです / トラも'},{en:'I like / the zoo.',jp:'私は好きです / 動物園が'}],
 questions:[{prompt:'1. 何を食べましたか。英語で答えなさい。',answer:'pizza',evidence:'I ate pizza.',evidenceJp:'ピザを食べました。',reason:'ate の目的語が pizza です。'},{prompt:'2. どこで昼食をとりましたか。本文から英語で答えなさい。',answer:'at the zoo',evidence:'I had lunch at the zoo.',evidenceJp:'動物園で昼食をとりました。',reason:'at the zoo が昼食をとった場所です。'},{prompt:'3. 見た動物を5種類、英語で答えなさい。',answer:'panda, monkey, tiger, rabbit, bear',evidence:'I saw a panda. / I saw a monkey, too. / I saw a tiger. / I saw a rabbit. / I saw a bear, too.',evidenceJp:'パンダ、サル、トラ、ウサギ、クマを見ました。',reason:'saw の目的語を順に拾うと5種類分かります。'},{prompt:'4. 最初に好きだと書かれている2種類の動物は何ですか。英語で答えなさい。',answer:'the panda and the monkey',evidence:'I like the panda and the monkey.',evidenceJp:'私はパンダとサルが好きです。',reason:'like の目的語として2種類が and で結ばれています。'}],
 auditNote:'Get Ready 6 を「動物園で昼食→動物を見る→好きな動物を振り返る」という一つの日記に全面再構成。話者不明のQ&Aを削除し、本文・訳・スラッシュ・設問を再同期。'
});

v10Repair('PROGRAM 1-1',{
 title:'A Junior High School Student',
 sentences:['Hi.','I’m a junior high school student.','I’m friendly.','My teacher is kind.','I like my teacher.','I like music.','I play the trumpet.','I practice every Wednesday.','I like basketball, too.','I like my school.','School is really great.','Goodbye.'],
 fullTranslation:'「こんにちは。私は中学生です。私は人なつっこいです。私の先生は親切です。先生が好きです。音楽が好きです。トランペットを演奏します。毎週水曜日に練習します。バスケットボールも好きです。自分の学校が好きです。学校は本当にすばらしいです。さようなら。」',
 slashRows:[{en:'Hi.',jp:'こんにちは。'},{en:'I’m / a junior high school student.',jp:'私は〜です / 中学生'},{en:'I’m / friendly.',jp:'私は〜です / 人なつっこい'},{en:'My teacher is / kind.',jp:'私の先生は〜です / 親切な'},{en:'I like / my teacher.',jp:'私は好きです / 私の先生が'},{en:'I like / music.',jp:'私は好きです / 音楽が'},{en:'I play / the trumpet.',jp:'私は演奏します / トランペットを'},{en:'I practice / every Wednesday.',jp:'私は練習します / 毎週水曜日に'},{en:'I like / basketball, too.',jp:'私は好きです / バスケットボールも'},{en:'I like / my school.',jp:'私は好きです / 私の学校が'},{en:'School is / really great.',jp:'学校は〜です / 本当にすばらしい'},{en:'Goodbye.',jp:'さようなら。'}],
 questions:[{prompt:'1. 話し手はどんな生徒ですか。本文から英語で答えなさい。',answer:'a junior high school student',evidence:'I’m a junior high school student.',evidenceJp:'私は中学生です。',reason:'be動詞の後ろが話し手の立場です。'},{prompt:'2. 話し手は自分の性格をどのように表していますか。本文から英語で1語抜き出しなさい。',answer:'friendly',evidence:'I’m friendly.',evidenceJp:'私は人なつっこいです。',reason:'friendly が話し手自身の性格を表しています。'},{prompt:'3. 先生はどのような人ですか。本文から英語で1語抜き出しなさい。',answer:'kind',evidence:'My teacher is kind.',evidenceJp:'私の先生は親切です。',reason:'kind が先生の性格を表しています。'},{prompt:'4. 話し手は何を演奏しますか。本文から英語で答えなさい。',answer:'the trumpet',evidence:'I play the trumpet.',evidenceJp:'トランペットを演奏します。',reason:'play の目的語が the trumpet です。'},{prompt:'5. 話し手はいつ練習しますか。本文から英語で答えなさい。',answer:'every Wednesday',evidence:'I practice every Wednesday.',evidenceJp:'毎週水曜日に練習します。',reason:'every Wednesday が練習する時を表しています。'}],
 auditNote:'PROGRAM 1-1 を連続した自己紹介に整理し、孤立した否定文を削除。人物→先生→音楽/練習→学校という流れで本文・訳・スラッシュ・設問を再同期。'
});

v10Repair('PROGRAM 1-2',{
 title:'From Australia',
 sentences:['Hello.','I’m a student.','I’m from Australia.','Australia is really great.','My teacher is from Japan.','My teacher is kind.','I like Japan.','I like Australia, too.','I’m friendly.','I like my school.','School is great.','Goodbye.'],
 fullTranslation:'「こんにちは。私は生徒です。オーストラリア出身です。オーストラリアは本当にすばらしいです。私の先生は日本出身です。先生は親切です。私は日本が好きです。オーストラリアも好きです。私は人なつっこいです。自分の学校が好きです。学校はすばらしいです。さようなら。」',
 slashRows:[{en:'Hello.',jp:'こんにちは。'},{en:'I’m / a student.',jp:'私は〜です / 生徒'},{en:'I’m from / Australia.',jp:'私は〜出身です / オーストラリア'},{en:'Australia is / really great.',jp:'オーストラリアは〜です / 本当にすばらしい'},{en:'My teacher is from / Japan.',jp:'私の先生は〜出身です / 日本'},{en:'My teacher is / kind.',jp:'私の先生は〜です / 親切な'},{en:'I like / Japan.',jp:'私は好きです / 日本が'},{en:'I like / Australia, too.',jp:'私は好きです / オーストラリアも'},{en:'I’m / friendly.',jp:'私は〜です / 人なつっこい'},{en:'I like / my school.',jp:'私は好きです / 私の学校が'},{en:'School is / great.',jp:'学校は〜です / すばらしい'},{en:'Goodbye.',jp:'さようなら。'}],
 questions:[{prompt:'1. 話し手はどこの出身ですか。本文から英語で答えなさい。',answer:'Australia',evidence:'I’m from Australia.',evidenceJp:'私はオーストラリア出身です。',reason:'from の後ろが出身地です。'},{prompt:'2. 先生はどこの出身ですか。本文から英語で答えなさい。',answer:'Japan',evidence:'My teacher is from Japan.',evidenceJp:'私の先生は日本出身です。',reason:'teacher に続く is from Japan が出身地を示します。'},{prompt:'3. 先生はどのような人ですか。本文から英語で1語抜き出しなさい。',answer:'kind',evidence:'My teacher is kind.',evidenceJp:'先生は親切です。',reason:'kind が先生の性格です。'},{prompt:'4. 話し手は日本が好きですか。本文に合うように Yes / No で答えなさい。',answer:'Yes',evidence:'I like Japan.',evidenceJp:'私は日本が好きです。',reason:'I like Japan. と明示されています。'},{prompt:'5. 話し手自身の性格を表す英語を本文から1語抜き出しなさい。',answer:'friendly',evidence:'I’m friendly.',evidenceJp:'私は人なつっこいです。',reason:'friendly が話し手の性格です。'}],
 auditNote:'PROGRAM 1-2 の不自然な not from Japan / not from the U.S. の連続を削除。オーストラリア出身の生徒が先生・日本・学校を紹介する一つの自己紹介へ再構成。'
});

v10Repair('PROGRAM 1-3',{
 title:'A New Student in This City',
 sentences:['I’m a new student.','This is my new class.','Nice to meet you.','I’m quiet.','I’m cheerful, too.','I like math and science.','I’m good at math.','I’m good at science, too.','I like Japanese.','I’m a fan of movies.','My teacher is kind.','This city is nice.','I want to be friendly.','School is really great.'],
 fullTranslation:'「私は新しい生徒です。ここが私の新しいクラスです。はじめまして。私はおとなしいです。明るい性格でもあります。数学と理科が好きです。数学が得意です。理科も得意です。国語が好きです。映画のファンです。私の先生は親切です。この街はすてきです。人なつっこくなりたいです。学校は本当にすばらしいです。」',
 slashRows:[{en:'I’m / a new student.',jp:'私は〜です / 新しい生徒'},{en:'This is / my new class.',jp:'これは〜です / 私の新しいクラス'},{en:'Nice to meet you.',jp:'はじめまして。'},{en:'I’m / quiet.',jp:'私は〜です / おとなしい'},{en:'I’m / cheerful, too.',jp:'私は〜でもあります / 明るい'},{en:'I like / math and science.',jp:'私は好きです / 数学と理科が'},{en:'I’m good at / math.',jp:'私は得意です / 数学が'},{en:'I’m good at / science, too.',jp:'私は得意です / 理科も'},{en:'I like / Japanese.',jp:'私は好きです / 国語が'},{en:'I’m / a fan of movies.',jp:'私は〜です / 映画のファン'},{en:'My teacher is / kind.',jp:'私の先生は〜です / 親切な'},{en:'This city is / nice.',jp:'この街は〜です / すてきな'},{en:'I want to be / friendly.',jp:'私は〜になりたいです / 人なつっこい'},{en:'School is / really great.',jp:'学校は〜です / 本当にすばらしい'}],
 questions:[{prompt:'1. 話し手はどんな立場の人ですか。本文から英語で答えなさい。',answer:'a new student',evidence:'I’m a new student.',evidenceJp:'私は新しい生徒です。',reason:'a new student が話し手の立場です。'},{prompt:'2. 話し手はどんな性格ですか。本文から英語で2語答えなさい。',answer:'quiet, cheerful',evidence:'I’m quiet. / I’m cheerful, too.',evidenceJp:'私はおとなしいです。／明るい性格でもあります。',reason:'quiet と cheerful の2語で性格を説明しています。'},{prompt:'3. 話し手が得意な教科を2つ、本文から英語で答えなさい。',answer:'math, science',evidence:'I’m good at math. / I’m good at science, too.',evidenceJp:'数学が得意です。／理科も得意です。',reason:'be good at の後ろに math と science があります。'},{prompt:'4. 話し手は何のファンですか。本文から英語で答えなさい。',answer:'movies',evidence:'I’m a fan of movies.',evidenceJp:'映画のファンです。',reason:'a fan of の後ろが movies です。'},{prompt:'5. 話し手はどのようになりたいですか。本文から英語で答えなさい。',answer:'friendly',evidence:'I want to be friendly.',evidenceJp:'人なつっこくなりたいです。',reason:'want to be の後ろが friendly です。'}],
 auditNote:'PROGRAM 1-3 の内容は維持しつつ、初日の自己紹介として class→性格→教科→趣味/先生→街→願い の順に整理し、重複感を減らした。'
});

v10Repair('PROGRAM 2-1',{
 title:'My Bicycle After School',
 sentences:['After school, I ride my bicycle.','I sometimes ride with my friend.','We ride in our town.','Our town is beautiful.','My friend and I walk, too.','I like my bicycle very much.','I go home after school.','At home, I clean my bicycle.','I read at home.','I like my town, too.','I like my bicycle and my town.'],
 fullTranslation:'「放課後、私は自転車に乗ります。ときどき友達といっしょに乗ります。私たちは町の中を走ります。私たちの町は美しいです。友達と私は歩くこともあります。私は自転車がとても好きです。放課後は家に帰ります。家では自転車をきれいにします。家で本を読みます。自分の町も好きです。自転車も町も好きです。」',
 slashRows:[{en:'After school, / I ride / my bicycle.',jp:'放課後 / 私は乗ります / 私の自転車に'},{en:'I sometimes ride / with my friend.',jp:'私はときどき乗ります / 私の友達といっしょに'},{en:'We ride / in our town.',jp:'私たちは乗ります / 私たちの町の中で'},{en:'Our town is / beautiful.',jp:'私たちの町は〜です / 美しい'},{en:'My friend and I / walk, too.',jp:'私の友達と私は / 歩くこともあります'},{en:'I like / my bicycle / very much.',jp:'私は好きです / 私の自転車が / とても'},{en:'I go home / after school.',jp:'私は家に帰ります / 放課後に'},{en:'At home, / I clean / my bicycle.',jp:'家で / 私はきれいにします / 私の自転車を'},{en:'I read / at home.',jp:'私は読みます / 家で'},{en:'I like / my town, too.',jp:'私は好きです / 私の町も'},{en:'I like / my bicycle and my town.',jp:'私は好きです / 私の自転車と町が'}],
 questions:[{prompt:'1. 話し手は放課後、何に乗りますか。本文から英語で答えなさい。',answer:'my bicycle',evidence:'After school, I ride my bicycle.',evidenceJp:'放課後、私は自転車に乗ります。',reason:'ride の目的語が my bicycle です。'},{prompt:'2. 町はどのようだと書かれていますか。本文から英語で1語抜き出しなさい。',answer:'beautiful',evidence:'Our town is beautiful.',evidenceJp:'私たちの町は美しいです。',reason:'beautiful が町の様子を表しています。'},{prompt:'3. 話し手はときどき誰と自転車に乗りますか。本文から英語で答えなさい。',answer:'my friend',evidence:'I sometimes ride with my friend.',evidenceJp:'ときどき友達といっしょに乗ります。',reason:'with の後ろが my friend です。'},{prompt:'4. 家で何をきれいにしますか。本文から英語で答えなさい。',answer:'my bicycle',evidence:'At home, I clean my bicycle.',evidenceJp:'家では自転車をきれいにします。',reason:'clean の目的語が my bicycle です。'},{prompt:'5. 話し手は家で本を読みますか。本文に合うように Yes / No で答えなさい。',answer:'Yes',evidence:'I read at home.',evidenceJp:'家で本を読みます。',reason:'I read at home. と明示されています。'}],
 auditNote:'PROGRAM 2-1 から無関係なtennisと否定練習文を削除。放課後の自転車→帰宅→手入れ/読書という一つの流れへ再構成。'
});

v10Repair('PROGRAM 2-2',{
 title:'My Weekend Routine',
 sentences:['On the weekend, I ride my bicycle with my friend.','We ride in our town.','Our town is beautiful.','Before dinner, I clean my bicycle.','I study math before dinner.','I like math, but I like science, too.','After dinner, I study Japanese.','I read at home after dinner.','I sometimes watch tennis after dinner.','I like the weekend very much.'],
 fullTranslation:'「週末は友達と自転車に乗ります。私たちは町の中を走ります。私たちの町は美しいです。夕食前に自転車をきれいにします。夕食前に数学を勉強します。数学が好きですが、理科も好きです。夕食後に国語を勉強します。夕食後は家で本を読みます。ときどき夕食後にテニスを見ます。私は週末がとても好きです。」',
 slashRows:[{en:'On the weekend, / I ride / my bicycle / with my friend.',jp:'週末に / 私は乗ります / 私の自転車に / 友達といっしょに'},{en:'We ride / in our town.',jp:'私たちは乗ります / 私たちの町の中で'},{en:'Our town is / beautiful.',jp:'私たちの町は〜です / 美しい'},{en:'Before dinner, / I clean / my bicycle.',jp:'夕食前に / 私はきれいにします / 私の自転車を'},{en:'I study / math / before dinner.',jp:'私は勉強します / 数学を / 夕食前に'},{en:'I like math, / but I like science, too.',jp:'私は数学が好きです / しかし理科も好きです'},{en:'After dinner, / I study / Japanese.',jp:'夕食後に / 私は勉強します / 国語を'},{en:'I read / at home / after dinner.',jp:'私は読みます / 家で / 夕食後に'},{en:'I sometimes watch / tennis / after dinner.',jp:'私はときどき見ます / テニスを / 夕食後に'},{en:'I like / the weekend / very much.',jp:'私は好きです / 週末が / とても'}],
 questions:[{prompt:'1. 週末、話し手は誰と自転車に乗りますか。本文から英語で答えなさい。',answer:'my friend',evidence:'On the weekend, I ride my bicycle with my friend.',evidenceJp:'週末は友達と自転車に乗ります。',reason:'with の後ろが my friend です。'},{prompt:'2. 町はどのようですか。本文から英語で1語抜き出しなさい。',answer:'beautiful',evidence:'Our town is beautiful.',evidenceJp:'私たちの町は美しいです。',reason:'beautiful が町の様子です。'},{prompt:'3. 夕食前に何をきれいにしますか。本文から英語で答えなさい。',answer:'my bicycle',evidence:'Before dinner, I clean my bicycle.',evidenceJp:'夕食前に自転車をきれいにします。',reason:'clean の目的語が my bicycle です。'},{prompt:'4. 夕食前に何を勉強しますか。本文から英語で答えなさい。',answer:'math',evidence:'I study math before dinner.',evidenceJp:'夕食前に数学を勉強します。',reason:'study の目的語が math です。'},{prompt:'5. 夕食後に何を勉強しますか。本文から英語で答えなさい。',answer:'Japanese',evidence:'After dinner, I study Japanese.',evidenceJp:'夕食後に国語を勉強します。',reason:'study の目的語が Japanese です。'}],
 auditNote:'PROGRAM 2-2 を時系列に再構成。自転車→夕食前の手入れ/数学→夕食後の国語/読書/テニスの順に固定し、本文・訳・スラッシュ・設問を再同期。'
});

window.V10_INTERACTION_META_SEMANTIC_REPAIRS={
'サンシャイン|Get Ready 2':{genre:'email',questionSetB:[
 {prompt:'1. 本の中で最初に出てくる動物は何ですか。英語で答えなさい。',answer:'a dog',evidence:'This is a dog.',evidenceJp:'これは犬です。',reason:'dog の文が cat の文より先に出ています。'},
 {prompt:'2. 「なるほど。」に当たる本文の英語をそのまま書きなさい。',answer:'I see.',evidence:'I see.',evidenceJp:'なるほど。',reason:'I see. がこの場面では「なるほど。」を表します。'},
 {prompt:'3. 「私」は dog をノートに書きますか。本文に合うように Yes / No で答えなさい。',answer:'Yes',evidence:'I write “dog” in my notebook.',evidenceJp:'私はノートに dog と書きます。',reason:'write “dog” と明示されています。'},
 {prompt:'4. 「私」は cat を読むことができますか。本文に合うように Yes / No で答えなさい。',answer:'Yes',evidence:'I can read “cat”, too.',evidenceJp:'cat も読むことができます。',reason:'can read “cat” と明示されています。'}]},
'サンシャイン|Get Ready 3':{genre:'email',questionSetB:[
 {prompt:'1. “What subject do you like?” に対する答えの英文を本文から1文抜き出しなさい。',answer:'I like English.',evidence:'I like English.',evidenceJp:'私は英語が好きです。',reason:'好きな教科を直接答えています。'},
 {prompt:'2. 英語の本を持っていますか。本文に合うように Yes / No で答えなさい。',answer:'Yes',evidence:'Do you have your English book? / Yes, I do.',evidenceJp:'英語の本を持っていますか。／はい、持っています。',reason:'Yes, I do. と答えています。'},
 {prompt:'3. “Can you read English?” への答えを英語で書きなさい。',answer:'Yes, I can.',evidence:'Can you read English? / Yes, I can.',evidenceJp:'英語を読むことができますか。／はい、できます。',reason:'can の疑問文に Yes, I can. と答えています。'},
 {prompt:'4. 2人に共通して好きなものは何ですか。英語で答えなさい。',answer:'English',evidence:'I like English. / I like English, too.',evidenceJp:'私は英語が好きです。／私も英語が好きです。',reason:'too により共通の好みだと分かります。'}]},
'サンシャイン|Get Ready 4':{genre:'report',questionSetB:[
 {prompt:'1. 練習する場所を表す英語を本文から抜き出しなさい。',answer:'in the gym',evidence:'I practice in the gym every day.',evidenceJp:'毎日体育館で練習します。',reason:'in the gym が場所を表します。'},
 {prompt:'2. バスケットボールについて、どのようだと説明していますか。本文から英語で2語抜き出しなさい。',answer:'very exciting',evidence:'Basketball is very exciting.',evidenceJp:'バスケットボールはとてもわくわくします。',reason:'very exciting が印象です。'},
 {prompt:'3. 友達に何をしようと誘っていますか。英語で答えなさい。',answer:'play basketball together',evidence:'Let’s play basketball together.',evidenceJp:'いっしょにバスケットボールをしよう。',reason:'Let’s の後ろが誘っている行動です。'},
 {prompt:'4. 「私」がボールを使ってできることは何ですか。日本語で答えなさい。',answer:'ボールをシュートすること',evidence:'I can shoot the ball.',evidenceJp:'ボールをシュートすることができます。',reason:'can shoot the ball ができることです。'}]},
'サンシャイン|Get Ready 5':{genre:'email',questionSetB:[
 {prompt:'1. パンダといっしょに最初に好きだと言った動物は何ですか。英語で答えなさい。',answer:'the monkey',evidence:'I like the panda and the monkey.',evidenceJp:'パンダとサルが好きです。',reason:'and で panda と monkey が並んでいます。'},
 {prompt:'2. トラも好きだと分かる語は何ですか。本文から英語で1語抜き出しなさい。',answer:'too',evidence:'I like the tiger, too.',evidenceJp:'トラも好きです。',reason:'too が「〜も」を表します。'},
 {prompt:'3. ウサギについてたずねている英文を本文から1文抜き出しなさい。',answer:'Do you like the rabbit?',evidence:'Do you like the rabbit?',evidenceJp:'ウサギは好きですか。',reason:'rabbit を目的語にした疑問文です。'},
 {prompt:'4. クマも好きですか。本文に合うように Yes / No で答えなさい。',answer:'Yes',evidence:'I like the bear, too.',evidenceJp:'クマも好きです。',reason:'like the bear と明示されています。'}]},
'サンシャイン|Get Ready 6':{genre:'diary',questionSetB:[
 {prompt:'1. 動物園で最初に見た動物は何ですか。英語で答えなさい。',answer:'a panda',evidence:'I saw a panda.',evidenceJp:'パンダを見ました。',reason:'動物を見る文の最初に panda が出ています。'},
 {prompt:'2. クマも見ましたか。本文に合うように Yes / No で答えなさい。',answer:'Yes',evidence:'I saw a bear, too.',evidenceJp:'クマも見ました。',reason:'saw a bear とあるので Yes です。'},
 {prompt:'3. トラも好きですか。本文に合うように Yes / No で答えなさい。',answer:'Yes',evidence:'I like the tiger, too.',evidenceJp:'トラも好きです。',reason:'like the tiger とあるので Yes です。'},
 {prompt:'4. 最後に何が好きだと書かれていますか。英語で答えなさい。',answer:'the zoo',evidence:'I like the zoo.',evidenceJp:'動物園が好きです。',reason:'最後の文の like の目的語が the zoo です。'}]},
'サンシャイン|PROGRAM 1-1':{genre:'email',questionSetB:[
 {prompt:'1. 話し手が好きなものとして出てくるものは何ですか。英語で答えなさい。',answer:'music',evidence:'I like music.',evidenceJp:'音楽が好きです。',reason:'like の目的語が music です。'},
 {prompt:'2. 話し手はバスケットボールも好きですか。本文に合うように Yes / No で答えなさい。',answer:'Yes',evidence:'I like basketball, too.',evidenceJp:'バスケットボールも好きです。',reason:'like basketball, too とあります。'},
 {prompt:'3. 話し手は自分の学校が好きですか。本文に合うように Yes / No で答えなさい。',answer:'Yes',evidence:'I like my school.',evidenceJp:'自分の学校が好きです。',reason:'I like my school. と明示されています。'},
 {prompt:'4. 学校についてどのように感じていますか。本文から英語で2語抜き出しなさい。',answer:'really great',evidence:'School is really great.',evidenceJp:'学校は本当にすばらしいです。',reason:'really great が学校への評価です。'}]},
'サンシャイン|PROGRAM 1-2':{genre:'email',questionSetB:[
 {prompt:'1. オーストラリアをどのように述べていますか。本文から英語で2語抜き出しなさい。',answer:'really great',evidence:'Australia is really great.',evidenceJp:'オーストラリアは本当にすばらしいです。',reason:'really great が評価です。'},
 {prompt:'2. 話し手は日本だけでなく、どの国も好きですか。英語で答えなさい。',answer:'Australia',evidence:'I like Australia, too.',evidenceJp:'オーストラリアも好きです。',reason:'too により Australia も好きだと分かります。'},
 {prompt:'3. 話し手は自分の学校が好きですか。本文に合うように Yes / No で答えなさい。',answer:'Yes',evidence:'I like my school.',evidenceJp:'自分の学校が好きです。',reason:'I like my school. と明示されています。'},
 {prompt:'4. 学校についてどのように述べていますか。本文から英語で1語抜き出しなさい。',answer:'great',evidence:'School is great.',evidenceJp:'学校はすばらしいです。',reason:'great が学校への評価です。'}]},
'サンシャイン|PROGRAM 1-3':{genre:'report',questionSetB:[
 {prompt:'1. 話し手が紹介している場所は何ですか。英語で答えなさい。',answer:'my new class',evidence:'This is my new class.',evidenceJp:'ここが私の新しいクラスです。',reason:'This is の後ろが my new class です。'},
 {prompt:'2. 話し手が好きな教科として、日本語に関係する教科は何ですか。英語で答えなさい。',answer:'Japanese',evidence:'I like Japanese.',evidenceJp:'国語が好きです。',reason:'like の目的語が Japanese です。'},
 {prompt:'3. 先生はどのような人ですか。本文から英語で1語抜き出しなさい。',answer:'kind',evidence:'My teacher is kind.',evidenceJp:'私の先生は親切です。',reason:'kind が先生を説明しています。'},
 {prompt:'4. この街はどのようだと書かれていますか。本文から英語で1語抜き出しなさい。',answer:'nice',evidence:'This city is nice.',evidenceJp:'この街はすてきです。',reason:'nice が街の様子です。'}]},
'サンシャイン|PROGRAM 2-1':{genre:'diary',questionSetB:[
 {prompt:'1. 友達と話し手は、自転車に乗る以外に何をすることがありますか。英語で答えなさい。',answer:'walk',evidence:'My friend and I walk, too.',evidenceJp:'友達と私は歩くこともあります。',reason:'walk が追加の行動です。'},
 {prompt:'2. 話し手は自分の自転車がどのくらい好きですか。本文から英語で2語抜き出しなさい。',answer:'very much',evidence:'I like my bicycle very much.',evidenceJp:'私は自転車がとても好きです。',reason:'very much が好きな程度を強めます。'},
 {prompt:'3. 本を読む場所を英語で答えなさい。',answer:'at home',evidence:'I read at home.',evidenceJp:'家で本を読みます。',reason:'at home が読む場所です。'},
 {prompt:'4. 自転車のほかに、話し手は何も好きですか。英語で答えなさい。',answer:'my town',evidence:'I like my town, too.',evidenceJp:'自分の町も好きです。',reason:'too により町も好きだと分かります。'}]},
'サンシャイン|PROGRAM 2-2':{genre:'diary',questionSetB:[
 {prompt:'1. 夕食前、最初に書かれている行動は何ですか。本文から英文を1文抜き出しなさい。',answer:'Before dinner, I clean my bicycle.',evidence:'Before dinner, I clean my bicycle.',evidenceJp:'夕食前に自転車をきれいにします。',reason:'時系列上、夕食前の最初の行動として書かれています。'},
 {prompt:'2. 夕食後、どこで本を読みますか。本文から英語で答えなさい。',answer:'at home',evidence:'I read at home after dinner.',evidenceJp:'夕食後は家で本を読みます。',reason:'at home が読む場所です。'},
 {prompt:'3. 話し手はいつテニスを見ますか。本文から英語で答えなさい。',answer:'after dinner',evidence:'I sometimes watch tennis after dinner.',evidenceJp:'ときどき夕食後にテニスを見ます。',reason:'after dinner が時を表します。'},
 {prompt:'4. 町はどのようですか。本文から英語で1語抜き出しなさい。',answer:'beautiful',evidence:'Our town is beautiful.',evidenceJp:'私たちの町は美しいです。',reason:'beautiful が町の様子です。'}]}
};
