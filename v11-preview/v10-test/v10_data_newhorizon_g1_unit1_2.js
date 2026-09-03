window.V10_PASSAGES = window.V10_PASSAGES || {};
window.V10_PASSAGES['Unit 1-2'] = {
 id:'V10-NH-G1-U1-2-001',textbook:'ニューホライズン',grade:'1',section:'Unit 1-2',level:'HOP',title:'Rugby and Soccer',
 sentences:[
  'Do you like rugby?',
  'Yes, I do.',
  'I’m a rugby fan, too.',
  'I often watch rugby with my friends.',
  'Great!',
  'Do you play rugby?',
  'No, I don’t.',
  'I don’t play rugby.',
  'But I play soccer.',
  'Oh, I play soccer, too.',
  'Great!'
 ],
 fullTranslation:'「ラグビーは好きですか。」「はい、好きです。」「私もラグビーファンです。」「私はよく友達とラグビーを見ます。」「いいね！」「ラグビーをしますか。」「いいえ、しません。」「私はラグビーはしません。」「でも、サッカーをします。」「ああ、私もサッカーをします。」「いいね！」',
 slashRows:[
  {en:'Do you like / rugby?',jp:'あなたは好きですか / ラグビーが'},
  {en:'Yes, / I do.',jp:'はい / 好きです'},
  {en:'I’m / a rugby fan, too.',jp:'私は〜です / ラグビーファンでも'},
  {en:'I often watch / rugby / with my friends.',jp:'私はよく見ます / ラグビーを / 友達といっしょに'},
  {en:'Great!',jp:'いいね！'},
  {en:'Do you play / rugby?',jp:'あなたはしますか / ラグビーを'},
  {en:'No, / I don’t.',jp:'いいえ / しません'},
  {en:'I don’t play / rugby.',jp:'私はしません / ラグビーを'},
  {en:'But / I play / soccer.',jp:'でも / 私はします / サッカーを'},
  {en:'Oh, / I play / soccer, too.',jp:'ああ / 私もします / サッカーを'},
  {en:'Great!',jp:'いいね！'}
 ],
 questions:[
  {prompt:'1. 話し手はラグビーが好きですか。本文に合うように Yes / No で答えなさい。',answer:'Yes',evidence:'Do you like rugby? / Yes, I do.',evidenceJp:'ラグビーは好きですか。／はい、好きです。',reason:'Do you like ...? に対して Yes, I do. と答えています。'},
  {prompt:'2. 話し手はよく誰とラグビーを見ますか。本文から英語で抜き出しなさい。',answer:'with my friends',evidence:'I often watch rugby with my friends.',evidenceJp:'私はよく友達とラグビーを見ます。',reason:'with my friends が「誰と」を表しています。'},
  {prompt:'3. 話し手はラグビーをしますか。本文に合うように Yes / No で答えなさい。',answer:'No',evidence:'Do you play rugby? / No, I don’t.',evidenceJp:'ラグビーをしますか。／いいえ、しません。',reason:'Do you play ...? に対して No, I don’t. と答えています。'},
  {prompt:'4. 話し手が実際にするスポーツは何ですか。英語で答えなさい。',answer:'soccer',evidence:'But I play soccer.',evidenceJp:'でも、サッカーをします。',reason:'but の後ろで、ラグビーはしない代わりにするスポーツが示されています。'},
  {prompt:'5. 2人に共通していることは何ですか。日本語で答えなさい。',answer:'2人ともサッカーをすること',evidence:'But I play soccer. / Oh, I play soccer, too.',evidenceJp:'でも、私はサッカーをします。／ああ、私もサッカーをします。',reason:'too が「〜も」を表すので、2人ともサッカーをすると分かります。'}
 ],
 allowedWords:[
  ['fan','Unit 1-2'],['often','Unit 1-2'],['but','Unit 1-2'],['with','Unit 1-2'],['friend / friends','Unit 1-2 + textbook-confirmed plural correction'],['rugby','Unit 1-2'],['watch','Unit 1-2'],['great','Unit 1-2'],['no','Unit 1-2'],['not / don’t','Unit 1-2'],['oh','Unit 1-2'],['soccer','Unit 1-2 textbook-confirmed missing-entry correction'],['play','elementary'],['do / you / like / yes / I’m','Unit 0 cumulative'],['too','Unit 1-1 cumulative'],['a / my','elementary']
 ],
 auditNote:'Unit 1-2の教科書本文と語彙欄を基準に再構成。soccer は教科書本文に明示される一方でv9内蔵Unit 1-2語彙行に独立登録が見つからなかったため、v10_vocab_corrections.jsへ先に補正登録。friends も教科書の friend(s) 表記に基づく明示形で、自動複数形ではない。',
 vocabAudit:true,manualSlashAudit:true,manualMeaningAudit:true,manualQuestionAudit:true
};