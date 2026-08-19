(()=>{
const D=window.V10_PASSAGES_G2_NH;
let m=D['Unit 1-1'];
m.sentences[8]='We are going to take a picture.';
m.sentences[9]='I like our trip.';
m.slashRows[8]={en:'We are going to take / a picture.',jp:'私たちは撮る予定です / 1枚の写真を'};
m.slashRows[9]={en:'I like / our trip.',jp:'私は好きです / 私たちの旅行が'};
m.questions[3]={prompt:'4. 話し手は旅行が好きですか。本文に合うように Yes / No で答えなさい。',answer:'Yes',evidence:'I like our trip.',evidenceJp:'私は私たちの旅行が好きです。',reason:'I like our trip. と明示されています。'};
m.fullTranslation='「私たちは旅行をする予定です。私は空港で友達に会う予定です。私たちの便は午前です。私たちはまもなく空港を出発する予定です。昼食前に到着する予定です。友達が街のあちこちを案内してくれる予定です。私たちにとってすばらしい休日です。私たちは街のあちこちを歩きたいです。私たちは写真を1枚撮る予定です。私は私たちの旅行が好きです。『またね』と言います。旅行はまもなく始まります。」';
m.auditNote+=' 時系列再監査でUnit1-2初出excitedと自動複数形picturesを削除。';

m=D['Unit 1-2'];
m.sentences[5]='We will eat at the same restaurant.';
m.slashRows[5]={en:'We will eat / at the same restaurant.',jp:'私たちは食べます / 同じレストランで'};
m.fullTranslation='「私たちの便は午後に到着するでしょう。私はまず友達に会います。私たちはレストランへ行くでしょう。私はそこでシーフードを食べます。友達はシーフードを食べません。私たちは同じレストランで食べます。私は予約をします。そのレストランは空港から遠くありません。私は夕食を楽しみにしています。友達もわくわくしています。私は『夕食後に電話するよ』と言います。『よい夜になるよ。』」';
m.auditNote+=' 時系列再監査でUnit1-3初出differentを削除し、Unit0既習sameへ置換。';

m=D['Unit 1-3'];
m.sentences[2]='The card had English and Chinese.';
m.sentences[3]='English was on the card.';
m.sentences[4]='Chinese was on the card.';
m.slashRows[2]={en:'The card had / English and Chinese.',jp:'そのカードにはありました / 英語と中国語が'};
m.slashRows[3]={en:'English was / on the card.',jp:'英語がありました / カードに'};
m.slashRows[4]={en:'Chinese was / on the card.',jp:'中国語がありました / カードに'};
m.questions[1]={prompt:'2. カードには何語と何語がありましたか。本文から英語で2つ答えなさい。',answer:'English, Chinese',evidence:'The card had English and Chinese.',evidenceJp:'そのカードには英語と中国語がありました。',reason:'1文で English and Chinese と明示されています。'};
m.fullTranslation='「昨日、私たちは店へ行きました。私はそこで小さなカードを見つけました。そのカードには英語と中国語がありました。カードには英語がありました。中国語もカードにありました。私たちは店員と意思を伝え合うことができます。例えば、私は短い英語の質問を使うことができます。友達は違う単語を使うことができます。そのカードは1ドルでした。それは大きな看板から約1メートルのところにありました。その看板は高さ1メートルでした。私たちはその看板の重さがどのくらいになり得るか知りませんでした。私たちは意思を伝え合うよい方法を見つけました。買い物はおもしろい経験でした。」';
m.auditNote+=' 語形再監査で自動複数形languagesを削除し、正本語languageの概念をEnglish / Chineseの実語で表現。';
})();