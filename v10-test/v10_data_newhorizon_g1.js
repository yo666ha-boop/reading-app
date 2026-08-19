window.V10_PASSAGES = {
'Unit 0':{
 id:'V10-NH-G1-U0-001',textbook:'ニューホライズン',grade:'1',section:'Unit 0',level:'HOP',title:'Good Morning',
 sentences:['Good morning.','Hi.','I’m Ken.','I’m Mei.','Nice to meet you.','Nice to meet you.','Do you like tennis?','Yes, I do.','I like tennis.','Do you play tennis?','Yes, I do.','Good!'],
 fullTranslation:'「おはよう。」「こんにちは。」「ぼくはケンです。」「私はメイです。」「はじめまして。」「はじめまして。」「テニスは好きですか。」「はい、好きです。」「私はテニスが好きです。」「テニスをしますか。」「はい、します。」「いいね！」',
 slashRows:[{en:'Good morning.',jp:'おはよう。'},{en:'Hi.',jp:'こんにちは。'},{en:'I’m / Ken.',jp:'私は〜です / ケン'},{en:'I’m / Mei.',jp:'私は〜です / メイ'},{en:'Nice to meet you.',jp:'はじめまして。'},{en:'Nice to meet you.',jp:'はじめまして。'},{en:'Do you like / tennis?',jp:'あなたは好きですか / テニスが'},{en:'Yes, / I do.',jp:'はい / 好きです'},{en:'I like / tennis.',jp:'私は好きです / テニスが'},{en:'Do you play / tennis?',jp:'あなたはしますか / テニスを'},{en:'Yes, / I do.',jp:'はい / します'},{en:'Good!',jp:'いいね！'}],
 questions:[{prompt:'1. 2人が会ったのは、どの時間帯だと考えられますか。本文の表現をもとに日本語で答えなさい。',answer:'朝',evidence:'Good morning.',evidenceJp:'おはよう。',reason:'Good morning. は朝のあいさつなので、朝に会った場面だと分かります。'},{prompt:'2. 2人が話題にしているスポーツは何ですか。英語で答えなさい。',answer:'tennis',evidence:'Do you like tennis? / Do you play tennis?',evidenceJp:'テニスは好きですか。／テニスをしますか。',reason:'どちらの質問にも tennis が使われています。'},{prompt:'3. テニスは好きですか。本文に合うように Yes / No で答えなさい。',answer:'Yes',evidence:'Do you like tennis? / Yes, I do.',evidenceJp:'テニスは好きですか。／はい、好きです。',reason:'質問の直後に Yes, I do. と答えています。'},{prompt:'4. テニスをしますか。本文に合うように Yes / No で答えなさい。',answer:'Yes',evidence:'Do you play tennis? / Yes, I do.',evidenceJp:'テニスをしますか。／はい、します。',reason:'Do you play ...? に対して Yes, I do. と答えています。'}],
 allowedWords:[['morning','Unit 0'],['tennis','Unit 0'],['you','Unit 0'],['I','Unit 0'],['meet','Unit 0'],['am / I’m','Unit 0'],['like','Unit 0'],['do','Unit 0'],['good','Unit 0'],['yes','Unit 0'],['hi','Unit 0'],['Nice to meet you.','Unit 0 phrase'],['Good morning.','Unit 0 phrase'],['play','elementary'],['Ken / Mei','proper names']],
 auditNote:'Unit 0 の実登録語を中心に、小学生既習の play だけを補助使用。Ken / Mei は固有名詞として語彙ゲート対象外。Sounds and Letters 0 はこの本文には未使用だが、Unit 1-1以降の累積語彙には含める。',vocabAudit:true,manualSlashAudit:true,manualMeaningAudit:true,manualQuestionAudit:true
},
'Unit 1-1':{
 id:'V10-NH-G1-U1-1-001',textbook:'ニューホライズン',grade:'1',section:'Unit 1-1',level:'HOP',title:'Call Me Leo',
 sentences:['Hello, everyone.','I’m Leonardo.','Call me Leo.','I’m twelve.','I’m from South Africa.','Do you like Japanese sweets?','Yes, I do.','I love Japanese sweets.','I love tennis, too.','I want to join the tennis club.','Good!'],
 fullTranslation:'「こんにちは、みなさん。」「ぼくはレオナルドです。」「レオと呼んでください。」「12歳です。」「南アフリカ共和国出身です。」「日本の甘いお菓子は好きですか。」「はい、好きです。」「日本の甘いお菓子が大好きです。」「テニスも大好きです。」「テニス部に入りたいです。」「いいね！」',
 slashRows:[
  {en:'Hello, / everyone.',jp:'こんにちは / みなさん'},
  {en:'I’m / Leonardo.',jp:'ぼくは〜です / レオナルド'},
  {en:'Call me / Leo.',jp:'私を呼んでください / レオと'},
  {en:'I’m / twelve.',jp:'ぼくは〜です / 12歳'},
  {en:'I’m from / South Africa.',jp:'ぼくは〜出身です / 南アフリカ共和国'},
  {en:'Do you like / Japanese sweets?',jp:'あなたは好きですか / 日本の甘いお菓子が'},
  {en:'Yes, / I do.',jp:'はい / 好きです'},
  {en:'I love / Japanese sweets.',jp:'ぼくは大好きです / 日本の甘いお菓子が'},
  {en:'I love / tennis, too.',jp:'ぼくは大好きです / テニスも'},
  {en:'I want to join / the tennis club.',jp:'ぼくは入りたいです / そのテニス部に'},
  {en:'Good!',jp:'いいね！'}
 ],
 questions:[
  {prompt:'1. Leonardo は何と呼んでほしいと言っていますか。英語で答えなさい。',answer:'Leo',evidence:'Call me Leo.',evidenceJp:'レオと呼んでください。',reason:'Call me ... の後ろが、呼んでほしい名前です。'},
  {prompt:'2. Leonardo はどこの出身ですか。英語で答えなさい。',answer:'South Africa',evidence:'I’m from South Africa.',evidenceJp:'南アフリカ共和国出身です。',reason:'from の後ろに出身地が示されています。'},
  {prompt:'3. Leonardo は何歳ですか。数字を英語で答えなさい。',answer:'twelve',evidence:'I’m twelve.',evidenceJp:'12歳です。',reason:'twelve が年齢を表しています。'},
  {prompt:'4. Leonardo が大好きなものを2つ、日本語で答えなさい。',answer:'日本の甘いお菓子とテニス',evidence:'I love Japanese sweets. / I love tennis, too.',evidenceJp:'日本の甘いお菓子が大好きです。／テニスも大好きです。',reason:'love の目的語を2文から拾うと分かります。'},
  {prompt:'5. Leonardo は何部に入りたいですか。英語で答えなさい。',answer:'the tennis club',evidence:'I want to join the tennis club.',evidenceJp:'テニス部に入りたいです。',reason:'want to join の後ろが、入りたい部活です。'}
 ],
 allowedWords:[['South Africa','Unit 1-1'],['call / Call me ...','Unit 1-1'],['love','Unit 1-1'],['sweet(s)','Unit 1-1 textbook form'],['club','Unit 1-1'],['twelve','Unit 1-1'],['everyone','Unit 1-1'],['me','Unit 1-1'],['join','Unit 1-1'],['Japanese','Unit 1-1'],['too','Unit 1-1'],['from','Unit 1-1'],['the','Unit 1-1'],['want to','Unit 1-1 phrase'],['hello','Unit 0 cumulative'],['I’m','Unit 0 cumulative'],['do / you / like / yes','Unit 0 cumulative'],['tennis','Unit 0 cumulative'],['Leonardo / Leo','proper names']],
 auditNote:'Unit 0 → Sounds and Letters 0 → Unit 1-1 の順を累積順として保持。本文はUnit 1-1の自己紹介表現を中心に構成し、sweet(s) は教科書本文で実際に使われる複数形 sweets を採用。自動活用ではない。',vocabAudit:true,manualSlashAudit:true,manualMeaningAudit:true,manualQuestionAudit:true
}
};