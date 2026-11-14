/* Unit-targeted supplemental English readings. This inventory is intentionally
   separate from the frozen 168+832 (=1000) v11 release registry. */
(function installUnitSupplementalReadings(){
'use strict';
const VERSION='20261114-unit-supplement-r1';
const make=(meta,rows,qa,qb)=>{
  const [id,textbook,grade,section,title]=meta;
  const sentences=rows.map(x=>x[0]);
  const fullTranslation=rows.map(x=>x[1]).join('');
  const slashRows=rows.map(x=>({en:x[2],jp:x[3]}));
  const build=([row,prompt,answer,reason])=>({
    prompt,answer,evidence:sentences[row],evidenceJp:rows[row][1],reason
  });
  return {id,textbook,grade,section,title,genre:'story',level:'HOP',
    sentences,fullTranslation,slashRows,
    questions:qa.map(build),questionSetB:qb.map(build),
    notes:[],auditNote:'2026-11 UNIT別追加候補。原本UNITの基礎本文に照らした語彙・文法の最終照合を要する。',
    curriculumGate:'PENDING_FINAL_V7_CANONICAL_REVIEW',unitSupplemental:true};
};
const passages=[
make(['V11-UNIT-SS-G1-P1-1-001','サンシャイン','1','PROGRAM 1-1','Hana and Her School'],
[
['Hi.','こんにちは。','Hi.','こんにちは。'],
["I'm Hana.",'私はハナです。',"I'm / Hana.",'私は〜です / ハナ'],
["I'm a junior high school student.",'私は中学生です。',"I'm / a junior high school student.",'私は〜です / 中学生'],
['My friend is Ken.','私の友達はケンです。','My friend is / Ken.','私の友達は〜です / ケン'],
['Ken is friendly.','ケンは人なつっこいです。','Ken is / friendly.','ケンは〜です / 人なつっこい'],
['My teacher is friendly and kind.','私の先生は親しみやすく親切です。','My teacher is / friendly and kind.','私の先生は〜です / 親しみやすく親切な'],
['I like music.','私は音楽が好きです。','I like / music.','私は好きです / 音楽が'],
['I play the trumpet at school.','私は学校でトランペットを演奏します。','I play / the trumpet / at school.','私は演奏します / トランペットを / 学校で'],
['Every Wednesday, I practice the trumpet.','毎週水曜日に私はトランペットを練習します。','Every Wednesday, / I practice / the trumpet.','毎週水曜日に / 私は練習します / トランペットを'],
['I like basketball at school, too.','私は学校でのバスケットボールも好きです。','I like / basketball / at school, too.','私は好きです / バスケットボールが / 学校でも'],
['Ken is not shy.','ケンは恥ずかしがりではありません。','Ken is not / shy.','ケンは〜ではありません / 恥ずかしがり'],
['I really like my school.','私は自分の学校が本当に好きです。','I really like / my school.','私は本当に好きです / 自分の学校が']
],
[
[1,'1. 話し手の名前を英語で答えなさい。','Hana','自己紹介で名前を述べています。'],
[4,'2. ケンはどのような人ですか。本文から英語で答えなさい。','friendly','ケンを表す形容詞です。'],
[5,'3. 先生はどのような人ですか。本文から英語で答えなさい。','kind','先生を説明している語です。'],
[7,'4. 話し手が演奏する楽器を英語で答えなさい。','the trumpet','play の後ろを確認します。'],
[8,'5. 話し手はいつ練習しますか。英語で答えなさい。','Every Wednesday','文頭に練習する曜日が書かれています。']
],
[
[2,'1. ハナは何の生徒ですか。本文から英語で答えなさい。','a junior high school student','自己紹介で学校段階を説明しています。'],
[3,'2. ハナの友達の名前は何ですか。英語で答えなさい。','Ken','My friend is に続く名前です。'],
[6,'3. ハナが好きな教科・活動の一つを英語で答えなさい。','music','like の目的語です。'],
[9,'4. 音楽以外に何が好きですか。本文から英語で答えなさい。','basketball','too が付いた文を見ます。'],
[10,'5. ケンは恥ずかしがりですか。Yes / No で答えなさい。','No','not shy と否定されています。']
]),
make(['V11-UNIT-NH-G1-U1-1-001','ニューホライズン','1','Unit 1-1','Aoi Meets a Tennis Friend'],
[
['Hello, everyone.','こんにちは、みなさん。','Hello, / everyone.','こんにちは / みなさん'],
["I'm Aoi.",'私はアオイです。',"I'm / Aoi.",'私は〜です / アオイ'],
["I'm twelve.",'私は12歳です。',"I'm / twelve.",'私は〜です / 12歳'],
["I'm from Japan.",'私は日本出身です。',"I'm from / Japan.",'私は〜出身です / 日本'],
['I love tennis.','私はテニスが大好きです。','I love / tennis.','私は大好きです / テニスが'],
['My friend is Leo.','私の友達はレオです。','My friend is / Leo.','私の友達は〜です / レオ'],
['Leo is from South Africa.','レオは南アフリカ共和国出身です。','Leo is from / South Africa.','レオは〜出身です / 南アフリカ共和国'],
['Do you like tennis?','テニスは好きですか。','Do you like / tennis?','あなたは好きですか / テニスが'],
['Yes, I do.','はい、好きです。','Yes, / I do.','はい / 好きです'],
['I want to join the tennis club.','私はテニス部に入りたいです。','I want to join / the tennis club.','私は入りたいです / テニス部に'],
['Call me Aoi.','アオイと呼んでください。','Call me / Aoi.','私を呼んでください / アオイと'],
['Nice to meet you.','はじめまして。','Nice to meet / you.','お会いできてうれしいです / あなたに']
],
[
[1,'1. 話し手の名前は何ですか。英語で答えなさい。','Aoi','自己紹介の名前です。'],
[2,'2. 話し手は何歳ですか。英語で答えなさい。','twelve','年齢を表す語です。'],
[3,'3. 話し手はどこの出身ですか。英語で答えなさい。','Japan','from の後ろです。'],
[4,'4. 話し手が大好きなスポーツは何ですか。英語で答えなさい。','tennis','love の目的語です。'],
[9,'5. 話し手は何部に入りたいですか。英語で答えなさい。','the tennis club','join の目的語です。']
],
[
[5,'1. 話し手の友達の名前は何ですか。英語で答えなさい。','Leo','My friend is の後ろです。'],
[6,'2. レオはどこの国の出身ですか。英語で答えなさい。','South Africa','from の後ろの国名です。'],
[7,'3. 相手に何の好みを尋ねていますか。英語で答えなさい。','tennis','like の目的語です。'],
[8,'4. テニスは好きですか。本文の返答に合わせ Yes / No で答えなさい。','Yes','Yes, I do. と答えています。'],
[10,'5. 話し手は何と呼んでほしいですか。英語で答えなさい。','Aoi','Call me の後ろです。']
]),
make(['V11-UNIT-SS-G2-P1-2-001','サンシャイン','2','PROGRAM 1-2','A Promise Before Sunday'],
[
['I leave this town on Sunday.','私は日曜日にこの町を出発します。','I leave / this town / on Sunday.','私は出発します / この町を / 日曜日に'],
['My friend is worried.','友達は心配しています。','My friend is / worried.','友達は〜です / 心配している'],
['I am a bit worried, too.','私も少し心配しています。','I am / a bit worried, too.','私も〜です / 少し心配な'],
['We have a plan.','私たちには計画があります。','We have / a plan.','私たちにはあります / 計画が'],
['I will text my friend tomorrow.','私は明日友達にメッセージを送ります。','I will text / my friend / tomorrow.','私は送ります / 友達に / 明日'],
['My friend will text me, too.','友達も私にメッセージを送ってくれます。','My friend will text / me, too.','友達は送ってくれます / 私にも'],
['We will keep in touch.','私たちは連絡を取り合います。','We will keep / in touch.','私たちは続けます / 連絡を'],
["I won't forget this town.",'私はこの町を忘れません。',"I won't forget / this town.",'私は忘れません / この町を'],
["I won't forget our school, either.",'私たちの学校も忘れません。',"I won't forget / our school, either.",'私は忘れません / 私たちの学校も'],
['The local park is special to me.','地元の公園は私にとって特別です。','The local park is / special / to me.','地元の公園は〜です / 特別な / 私にとって'],
['I will visit that park again.','私はその公園をまた訪れます。','I will visit / that park / again.','私は訪れます / その公園を / また'],
['I hope my friend will be fine.','友達が元気でいることを願っています。','I hope / my friend will be / fine.','私は願っています / 友達が〜であることを / 元気な'],
['Take care.','気をつけてね。','Take care.','気をつけてね。'],
['See you soon.','またすぐに会おう。','See you / soon.','また会おう / すぐに']
],
[
[0,'1. 話し手はいつ町を出発しますか。英語で答えなさい。','on Sunday','leave の時を表しています。'],
[1,'2. 心配しているのはだれですか。本文から英語で答えなさい。','My friend','主語が示されています。'],
[4,'3. 話し手は明日何をしますか。日本語で答えなさい。','友達にメッセージを送る','will text が未来の予定です。'],
[6,'4. 2人はどうやって関係を続けますか。英語で答えなさい。','keep in touch','連絡を取り続けるという表現です。'],
[7,'5. 話し手は町を忘れますか。Yes / No で答えなさい。','No',"won't forget と否定しています。"]
],
[
[2,'1. 話し手はどのような気持ちですか。本文から英語で答えなさい。','a bit worried','a bit が程度を表します。'],
[5,'2. 誰が話し手にメッセージを送りますか。英語で答えなさい。','My friend','主語が相手を表します。'],
[8,'3. 町以外に何を忘れませんか。英語で答えなさい。','our school','forget の目的語です。'],
[9,'4. 話し手にとって特別な場所はどこですか。英語で答えなさい。','The local park','主語が場所を示しています。'],
[10,'5. 話し手はまたどこを訪れますか。英語で答えなさい。','that park','visit の目的語です。']
]),
make(['V11-UNIT-NH-G2-U1-1-001','ニューホライズン','2','Unit 1-1','Our First Trip Plan'],
[
['We are going to take a trip next week.','私たちは来週旅行をする予定です。','We are going to take / a trip / next week.','私たちはする予定です / 旅行を / 来週'],
['I am going to meet Mei at the airport.','私は空港でメイに会う予定です。','I am going to meet / Mei / at the airport.','私は会う予定です / メイに / 空港で'],
['Our flight is in the morning.','私たちの飛行機の便は午前です。','Our flight is / in the morning.','私たちの便は〜です / 午前に'],
['We are going to take many pictures.','私たちはたくさん写真を撮る予定です。','We are going to take / many pictures.','私たちは撮る予定です / たくさんの写真を'],
['We are going to arrive before lunch.','私たちは昼食前に到着する予定です。','We are going to arrive / before lunch.','私たちは到着する予定です / 昼食前に'],
['We are going to walk around the city.','私たちは街のあちこちを歩く予定です。','We are going to walk / around the city.','私たちは歩く予定です / 街のあちこちを'],
['Mei is going to show me around the city.','メイが街を案内してくれる予定です。','Mei is going to show / me / around the city.','メイは案内する予定です / 私を / 街のあちこちで'],
['I want to see the local park.','私は地元の公園を見たいです。','I want to see / the local park.','私は見たいです / 地元の公園を'],
['I am going to write about the trip.','私は旅行について書く予定です。','I am going to write / about the trip.','私は書く予定です / その旅行について'],
['My friend is excited, too.','友達もわくわくしています。','My friend is / excited, too.','友達も〜です / わくわくした'],
['We are going to leave the airport soon.','私たちはまもなく空港を出発する予定です。','We are going to leave / the airport / soon.','私たちは出発する予定です / 空港を / まもなく'],
['Our holiday is going to start soon.','私たちの休日はまもなく始まる予定です。','Our holiday is going to start / soon.','私たちの休日は始まる予定です / まもなく']
],
[
[0,'1. いつ旅行に行く予定ですか。英語で答えなさい。','next week','予定の時期は文末にあります。'],
[1,'2. 話し手は空港で誰に会う予定ですか。英語で答えなさい。','Mei','meet の目的語です。'],
[2,'3. 飛行機の便はいつですか。英語で答えなさい。','in the morning','時を表しています。'],
[4,'4. いつ到着する予定ですか。英語で答えなさい。','before lunch','before が前後関係を表します。'],
[7,'5. 話し手が見たい場所はどこですか。英語で答えなさい。','the local park','see の目的語です。']
],
[
[3,'1. 旅行中に何をたくさん撮る予定ですか。英語で答えなさい。','many pictures','take の目的語です。'],
[5,'2. 2人はどこを歩く予定ですか。英語で答えなさい。','around the city','場所を表しています。'],
[6,'3. 街を案内する予定の人はだれですか。英語で答えなさい。','Mei','主語が案内者を示します。'],
[8,'4. 話し手は何について書く予定ですか。英語で答えなさい。','the trip','about の目的語です。'],
[10,'5. 2人はどこから出発する予定ですか。英語で答えなさい。','the airport','leave の目的語です。']
]),
make(['V11-UNIT-SS-G3-P1-2-001','サンシャイン','3','PROGRAM 1-2','A Quiet Lunch after the Marathon'],
[
['Today is our school marathon.','今日は学校のマラソンです。','Today is / our school marathon.','今日は〜です / 学校のマラソン'],
['My friend is in the marathon.','私の友達はマラソンに参加しています。','My friend is / in the marathon.','私の友達は〜です / マラソンに参加して'],
['I meet my friend after the marathon.','私はマラソンのあと友達に会います。','I meet / my friend / after the marathon.','私は会います / 友達に / マラソンのあと'],
['There is a homemade bento on the table.','テーブルの上に手作りのお弁当があります。','There is / a homemade bento / on the table.','あります / 手作りのお弁当が / テーブルの上に'],
['The bento has eel in it.','そのお弁当にはウナギが入っています。','The bento has / eel / in it.','そのお弁当には入っています / ウナギが / その中に'],
['I eat a small portion of eel.','私はウナギを少し食べます。','I eat / a small portion / of eel.','私は食べます / 少しの量を / ウナギの'],
['My friend eats the homemade food, too.','友達も手作りの食べ物を食べます。','My friend eats / the homemade food, too.','友達も食べます / 手作りの食べ物を'],
['There is a musical instrument in the next room.','隣の部屋に楽器があります。','There is / a musical instrument / in the next room.','あります / 楽器が / 隣の部屋に'],
['I hear the instrument.','私はその楽器の音を聞きます。','I hear / the instrument.','私は聞きます / その楽器の音を'],
['We talk about the marathon.','私たちはマラソンについて話します。','We talk / about the marathon.','私たちは話します / マラソンについて'],
['My friend is tired but happy.','友達は疲れていますがうれしそうです。','My friend is / tired but happy.','友達は〜です / 疲れているがうれしい'],
['The homemade lunch is very good.','手作りの昼食はとてもおいしいです。','The homemade lunch is / very good.','手作りの昼食は〜です / とてもおいしい']
],
[
[0,'1. 今日は学校で何がありますか。英語で答えなさい。','our school marathon','be動詞の後ろに行事名があります。'],
[1,'2. マラソンに参加しているのはだれですか。英語で答えなさい。','My friend','主語が参加者を表します。'],
[3,'3. テーブルの上に何がありますか。英語で答えなさい。','a homemade bento','There is の後ろに書かれています。'],
[4,'4. お弁当に何が入っていますか。英語で答えなさい。','eel','has の目的語です。'],
[10,'5. 友達はどのような気持ちですか。英語で答えなさい。','tired but happy','be動詞の後ろにある説明です。']
],
[
[2,'1. 話し手はいつ友達に会いますか。英語で答えなさい。','after the marathon','after に続く時を表す部分です。'],
[5,'2. 話し手は何を少し食べますか。英語で答えなさい。','eel','of の後ろにある食べ物です。'],
[6,'3. 友達も何を食べますか。英語で答えなさい。','the homemade food','eats の目的語です。'],
[7,'4. 楽器はどこにありますか。英語で答えなさい。','in the next room','場所を示しています。'],
[9,'5. 2人は何について話しますか。英語で答えなさい。','the marathon','about の目的語です。']
]),
make(['V11-UNIT-NH-G3-U1-1-001','ニューホライズン','3','Unit 1-1','Two Friends and Two Trips'],
[
['I have been to Kyoto once.','私は京都に一度行ったことがあります。','I have been to / Kyoto / once.','私は行ったことがあります / 京都に / 一度'],
['I have been to a museum in Kyoto, too.','私は京都の博物館にも行ったことがあります。','I have been to / a museum / in Kyoto, too.','私は行ったことがあります / 博物館に / 京都でも'],
['I have never been to Hokkaido.','私は北海道には一度も行ったことがありません。','I have never been to / Hokkaido.','私は一度も行ったことがありません / 北海道に'],
['My friend has been to Hokkaido twice.','私の友達は北海道に二度行ったことがあります。','My friend has been to / Hokkaido / twice.','私の友達は行ったことがあります / 北海道に / 二度'],
['We talk about our trips at school.','私たちは学校で旅行について話します。','We talk about / our trips / at school.','私たちは話します / 旅行について / 学校で'],
['I show my friend a picture of Kyoto.','私は友達に京都の写真を見せます。','I show / my friend / a picture of Kyoto.','私は見せます / 友達に / 京都の写真を'],
['My friend shows me a picture of Hokkaido.','友達は私に北海道の写真を見せます。','My friend shows / me / a picture of Hokkaido.','友達は見せます / 私に / 北海道の写真を'],
['I want to travel there someday.','私はいつかそこへ旅行したいです。','I want to travel / there / someday.','私は旅行したいです / そこへ / いつか'],
['I write about Kyoto in my notebook.','私は京都についてノートに書きます。','I write about / Kyoto / in my notebook.','私は書きます / 京都について / ノートに'],
['Kyoto has many old buildings.','京都には古い建物がたくさんあります。','Kyoto has / many old buildings.','京都にはあります / たくさんの古い建物が'],
['We want to discover new places.','私たちは新しい場所を発見したいです。','We want to discover / new places.','私たちは発見したいです / 新しい場所を'],
['I want to visit Hokkaido someday.','私はいつか北海道を訪れたいです。','I want to visit / Hokkaido / someday.','私は訪れたいです / 北海道を / いつか']
],
[
[0,'1. 話し手は京都に何度行ったことがありますか。英語で答えなさい。','once','回数を表しています。'],
[1,'2. 京都で何を訪れたことがありますか。英語で答えなさい。','a museum','have been to の目的地です。'],
[2,'3. 話し手は北海道に行ったことがありますか。Yes / No で答えなさい。','No','never とあるので一度もありません。'],
[3,'4. 友達は北海道に何度行ったことがありますか。英語で答えなさい。','twice','経験回数を表しています。'],
[4,'5. 2人はどこで旅行について話しますか。英語で答えなさい。','at school','場所を表しています。']
],
[
[5,'1. 話し手は友達に何を見せますか。英語で答えなさい。','a picture of Kyoto','show の目的語です。'],
[6,'2. 友達は何の写真を見せますか。英語で答えなさい。','a picture of Hokkaido','show の目的語です。'],
[8,'3. 話し手は何についてノートに書きますか。英語で答えなさい。','Kyoto','about の後ろです。'],
[9,'4. 京都には何が多くありますか。英語で答えなさい。','many old buildings','has の目的語です。'],
[11,'5. 話し手はいつかどこに行きたいですか。英語で答えなさい。','Hokkaido','visit の目的語です。']
])
];
if(passages.length!==6)throw new Error('Unit supplement inventory must have 6 items');
const keys=new Set(), ids=new Set(), registry={};
for(const p of passages){
  if(ids.has(p.id))throw new Error('Duplicate supplement '+p.id);ids.add(p.id);
  if(typeof window.V11_VALIDATE_PASSAGE==='function')window.V11_VALIDATE_PASSAGE(p);
  if(p.questions.length!==5||p.questionSetB.length!==5)throw new Error('A/B question count '+p.id);
  for(const q of p.questions.concat(p.questionSetB)){
    if(!p.sentences.includes(q.evidence))throw new Error('Question evidence not in passage '+p.id);
  }
  const k=typeof window.V11_PASSAGE_REGISTRY_KEY==='function'
    ?window.V11_PASSAGE_REGISTRY_KEY(p)
    :[p.textbook,String(p.grade),String(p.section).replace(/^(program|unit)\s*/i,m=>m.trim().toUpperCase()+' ')].join('|');
  if(!registry[k])registry[k]=[];
  registry[k].push(p);keys.add(k);
}
window.V11_UNIT_SUPPLEMENTAL_PASSAGES=registry;
window.V11_UNIT_SUPPLEMENTAL_STATE={version:VERSION,count:passages.length,sections:keys.size,
  core1000Unchanged:true,reviewStatus:'AWAITING_CANONICAL_V7_CURRICULUM_GATE',
  ids:passages.map(p=>p.id)};
if(typeof window.V11_SYNC_PASSAGE_VARIANT_UI==='function'){
  window.V11_SYNC_PASSAGE_VARIANT_UI({preserveSelection:true,render:true});
}
})();