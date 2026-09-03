window.V10_PASSAGES = window.V10_PASSAGES || {};
window.V10_PASSAGES['Unit 1-3'] = {
 id:'V10-NH-G1-U1-3-001',textbook:'ニューホライズン',grade:'1',section:'Unit 1-3',level:'HOP',title:'Comics and Clubs',
 sentences:[
  'Do you like comics?',
  'Yes, I do.',
  'I draw comics, too.',
  'Wow!',
  'Are you an anime fan?',
  'Yes, I am.',
  'Are you in the art club?',
  'Yes, I am.',
  'How about you?',
  'I’m not in a school club now.',
  'But I take swimming lessons.',
  'Great!'
 ],
 fullTranslation:'「マンガは好きですか。」「はい、好きです。」「私もマンガをかきます。」「わあ！」「あなたはアニメのファンですか。」「はい、そうです。」「美術部に入っていますか。」「はい、入っています。」「あなたはどうですか。」「私は今、学校の部活には入っていません。」「でも、水泳のレッスンを受けています。」「いいね！」',
 slashRows:[
  {en:'Do you like / comics?',jp:'あなたは好きですか / マンガが'},
  {en:'Yes, / I do.',jp:'はい / 好きです'},
  {en:'I draw / comics, too.',jp:'私はかきます / マンガも'},
  {en:'Wow!',jp:'わあ！'},
  {en:'Are you / an anime fan?',jp:'あなたは〜ですか / アニメのファン'},
  {en:'Yes, / I am.',jp:'はい / そうです'},
  {en:'Are you / in the art club?',jp:'あなたはいますか / 美術部に'},
  {en:'Yes, / I am.',jp:'はい / 入っています'},
  {en:'How about you?',jp:'あなたはどうですか。'},
  {en:'I’m not / in a school club / now.',jp:'私は入っていません / 学校の部活に / 今は'},
  {en:'But / I take / swimming lessons.',jp:'でも / 私は受けています / 水泳のレッスンを'},
  {en:'Great!',jp:'いいね！'}
 ],
 questions:[
  {prompt:'1. 最初の話し手はマンガが好きですか。本文に合うように Yes / No で答えなさい。',answer:'Yes',evidence:'Do you like comics? / Yes, I do.',evidenceJp:'マンガは好きですか。／はい、好きです。',reason:'Do you like ...? に対して Yes, I do. と答えています。'},
  {prompt:'2. 最初の話し手はマンガについて、読む以外に何をしますか。日本語で答えなさい。',answer:'マンガをかく',evidence:'I draw comics, too.',evidenceJp:'私もマンガをかきます。',reason:'draw が「かく」を表し、comics がその対象です。'},
  {prompt:'3. 最初の話し手は何部に入っていますか。英語で答えなさい。',answer:'the art club',evidence:'Are you in the art club? / Yes, I am.',evidenceJp:'美術部に入っていますか。／はい、入っています。',reason:'部活をたずねる質問に Yes と答えているため、美術部に入っていると分かります。'},
  {prompt:'4. もう一人の話し手は今、学校の部活に入っていますか。本文に合うように Yes / No で答えなさい。',answer:'No',evidence:'I’m not in a school club now.',evidenceJp:'私は今、学校の部活には入っていません。',reason:'not が否定を表しています。'},
  {prompt:'5. もう一人の話し手が受けているレッスンは何ですか。本文から英語で答えなさい。',answer:'swimming lessons',evidence:'But I take swimming lessons.',evidenceJp:'でも、水泳のレッスンを受けています。',reason:'take の後ろの swimming lessons が、受けているレッスンです。'}
 ],
 allowedWords:[
  ['anime','Unit 1-3'],['lesson / lessons','Unit 1-3 + textbook-confirmed plural correction'],['draw','Unit 1-3'],['an','Unit 1-3'],['art','Unit 1-3'],['school','Unit 1-3'],['swimming','Unit 1-3'],['comic / comics','Unit 1-3 + textbook-confirmed plural correction'],['are','Unit 1-3'],['take','Unit 1-3'],['how / How about you?','Unit 1-3'],['now','Unit 1-3'],['in','Unit 1-3'],['wow','Unit 1-3'],['fan','Unit 1-2 cumulative'],['not','Unit 1-2 cumulative'],['but','Unit 1-2 cumulative'],['great','Unit 1-2 cumulative'],['club / the','Unit 1-1 cumulative'],['do / you / like / yes / I’m / I / am','Unit 0 cumulative']
 ],
 auditNote:'Unit 1-3の教科書本文・語彙欄を基準に、マンガ→アニメ→部活→水泳レッスンという同一会話の流れで構成。comics / lessons は教科書の comic(s) / lesson(s) と実本文の使用を根拠に補正台帳へ明示登録し、自動複数形では扱っていない。',
 vocabAudit:true,manualSlashAudit:true,manualMeaningAudit:true,manualQuestionAudit:true
};