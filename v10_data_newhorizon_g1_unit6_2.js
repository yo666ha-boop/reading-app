window.V10_PASSAGES = window.V10_PASSAGES || {};
window.V10_PASSAGES['Unit 6-2'] = {
 id:'V10-NH-G1-U6-2-001',textbook:'ニューホライズン',grade:'1',section:'Unit 6-2',level:'HOP',title:'Whose Ticket Is This?',
 sentences:['This is a ticket.','Whose ticket is this?','Is it yours?','No, it is not.','Maybe it is Riko\'s.','Yes, it is.','This is a history book.','Whose book is this?','It is mine.','Here you are.','Thanks.','Thank you.'],
 fullTranslation:'「これはチケットです。」「これはだれのチケットですか。」「あなたのものですか。」「いいえ、違います。」「たぶん理子のものです。」「はい、そうです。」「これは歴史の本です。」「この本はだれのものですか。」「私のものです。」「はい、どうぞ。」「ありがとう。」「ありがとう。」',
 slashRows:[
  {en:'This is / a ticket.',jp:'これは〜です / 1枚のチケット'},
  {en:'Whose ticket / is this?',jp:'だれのチケットが / これですか'},
  {en:'Is it / yours?',jp:'それは〜ですか / あなたのもの'},
  {en:'No, / it is not.',jp:'いいえ / そうではありません'},
  {en:'Maybe / it is Riko\'s.',jp:'たぶん / それは理子のものです'},
  {en:'Yes, / it is.',jp:'はい / そうです'},
  {en:'This is / a history book.',jp:'これは〜です / 歴史の本'},
  {en:'Whose book / is this?',jp:'だれの本が / これですか'},
  {en:'It is / mine.',jp:'それは〜です / 私のもの'},
  {en:'Here you are.',jp:'はい、どうぞ。'},
  {en:'Thanks.',jp:'ありがとう。'},
  {en:'Thank you.',jp:'ありがとう。'}
 ],
 questions:[
  {prompt:'1. 最初に見つかったものは何ですか。本文から英語で答えなさい。',answer:'a ticket',evidence:'This is a ticket.',evidenceJp:'これはチケットです。',reason:'最初の文で見つかった物が ticket と示されています。'},
  {prompt:'2. そのチケットは話し相手のものですか。本文に合うように Yes / No で答えなさい。',answer:'No',evidence:'Is it yours? / No, it is not.',evidenceJp:'あなたのものですか。／いいえ、違います。',reason:'所有代名詞 yours を使った質問に No, it is not. と答えています。'},
  {prompt:'3. チケットはだれのものだと考えられていますか。本文から英語で答えなさい。',answer:'Riko\'s',evidence:'Maybe it is Riko\'s.',evidenceJp:'たぶん理子のものです。',reason:'Maybe の後ろで所有者を Riko\'s と示しています。'},
  {prompt:'4. 歴史の本はだれのものですか。本文から英語で答えなさい。',answer:'mine',evidence:'Whose book is this? / It is mine.',evidenceJp:'この本はだれのものですか。／私のものです。',reason:'whose の質問に所有代名詞 mine で答えています。'},
  {prompt:'5. `yours` と `mine` は何を表す語ですか。日本語で答えなさい。',answer:'持ち主（あなたのもの・私のもの）を表す語。',evidence:'Is it yours? / It is mine.',evidenceJp:'あなたのものですか。／私のものです。',reason:'名詞を繰り返さず、所有者を示す所有代名詞として使われています。'}
 ],
 allowedWords:[['history','Unit 6-2'],['whose','Unit 6-2'],['yours','Unit 6-2 possessive pronoun'],['mine','Unit 6-2 possessive pronoun'],['maybe','Unit 6-2'],['ticket','Unit 6-2'],['(Riko)\'s','Unit 6-2 possessive form'],['Thanks.','Unit 6-2 phrase'],['book','elementary'],['Here you are. / Thank you.','Unit 2-3 cumulative phrases'],['this / is / a / it / no / not / yes / you','cumulative / elementary']],
 auditNote:'v9内蔵VOCABでUnit 6-2をid2303〜2319まで照合し、id2320からUnit 6-3へ切り替わることを確認。minute / history / whose / yours / mine / wait / careful / crowded / still / maybe / over / ticket / start / (Riko)s / Thanks. / be careful with / How old ...? が登録されている。本文は持ち物の所有者を確認する1場面に限定し、未確認複数形tickets等は生成しない。whose / yours / mine / Riko\'sを明示的に使って所有表現の読解にした。',
 vocabAudit:true,manualSlashAudit:true,manualMeaningAudit:true,manualQuestionAudit:true
};