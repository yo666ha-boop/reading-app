window.V10_PASSAGES = {
'Unit 0':{
 id:'V10-NH-G1-U0-001',textbook:'ニューホライズン',grade:'1',section:'Unit 0',level:'HOP',title:'Good Morning',
 sentences:['Good morning.','Hi.','I’m Ken.','I’m Mei.','Nice to meet you.','Nice to meet you.','Do you like tennis?','Yes, I do.','I like tennis.','Do you play tennis?','Yes, I do.','Good!'],
 fullTranslation:'「おはよう。」「こんにちは。」「ぼくはケンです。」「私はメイです。」「はじめまして。」「はじめまして。」「テニスは好きですか。」「はい、好きです。」「私はテニスが好きです。」「テニスをしますか。」「はい、します。」「いいね！」',
 slashRows:[
  {en:'Good morning.',jp:'おはよう。'},
  {en:'Hi.',jp:'こんにちは。'},
  {en:'I’m / Ken.',jp:'私は〜です / ケン'},
  {en:'I’m / Mei.',jp:'私は〜です / メイ'},
  {en:'Nice to meet you.',jp:'はじめまして。'},
  {en:'Nice to meet you.',jp:'はじめまして。'},
  {en:'Do you like / tennis?',jp:'あなたは好きですか / テニスが'},
  {en:'Yes, / I do.',jp:'はい / 好きです'},
  {en:'I like / tennis.',jp:'私は好きです / テニスが'},
  {en:'Do you play / tennis?',jp:'あなたはしますか / テニスを'},
  {en:'Yes, / I do.',jp:'はい / します'},
  {en:'Good!',jp:'いいね！'}
 ],
 questions:[
  {prompt:'1. 2人が会ったのは、どの時間帯だと考えられますか。本文の表現をもとに日本語で答えなさい。',answer:'朝',evidence:'Good morning.',evidenceJp:'おはよう。',reason:'Good morning. は朝のあいさつなので、朝に会った場面だと分かります。'},
  {prompt:'2. 2人が話題にしているスポーツは何ですか。英語で答えなさい。',answer:'tennis',evidence:'Do you like tennis? / Do you play tennis?',evidenceJp:'テニスは好きですか。／テニスをしますか。',reason:'どちらの質問にも tennis が使われています。'},
  {prompt:'3. テニスは好きですか。本文に合うように Yes / No で答えなさい。',answer:'Yes',evidence:'Do you like tennis? / Yes, I do.',evidenceJp:'テニスは好きですか。／はい、好きです。',reason:'質問の直後に Yes, I do. と答えています。'},
  {prompt:'4. テニスをしますか。本文に合うように Yes / No で答えなさい。',answer:'Yes',evidence:'Do you play tennis? / Yes, I do.',evidenceJp:'テニスをしますか。／はい、します。',reason:'Do you play ...? に対して Yes, I do. と答えています。'}
 ],
 allowedWords:[
  ['morning','Unit 0'],['tennis','Unit 0'],['you','Unit 0'],['I','Unit 0'],['meet','Unit 0'],['am / I’m','Unit 0'],['like','Unit 0'],['do','Unit 0'],['good','Unit 0'],['yes','Unit 0'],['hi','Unit 0'],['Nice to meet you.','Unit 0 phrase'],['Good morning.','Unit 0 phrase'],['play','elementary'],['Ken / Mei','proper names']
 ],
 auditNote:'Unit 0 の実登録語を中心に、小学生既習の play だけを補助使用。Ken / Mei は固有名詞として語彙ゲート対象外。Sounds and Letters 0 はこの本文には未使用だが、Unit 1-1以降の累積語彙には含める。',
 vocabAudit:true,manualSlashAudit:true,manualMeaningAudit:true,manualQuestionAudit:true
}
};