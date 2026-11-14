/* Second wave of original UNIT-aligned reading candidates. The verified 1000-item
 * registry is frozen; this script only extends the supplemental registry. */
(function addV11UnitWave2(){
'use strict';
const previous=window.V11_UNIT_SUPPLEMENTAL_STATE;
if(!previous||previous.count!==6)throw new Error('Wave2 requires reviewed Wave1 inventory of 6');
const rows=[
{
 meta:['V11-UNIT-SS-G1-P1-2-002','サンシャイン','1','PROGRAM 1-2','A Message from Australia'],
 text:[
 ['Hello, I am Mia.','こんにちは、私はミアです。','Hello, / I am Mia.','こんにちは / 私はミアです'],
 ['I am a student from Australia.','私はオーストラリア出身の生徒です。','I am / a student / from Australia.','私は〜です / 生徒 / オーストラリア出身の'],
 ['I am not from Japan.','私は日本出身ではありません。','I am not from / Japan.','私は〜出身ではありません / 日本'],
 ['My friend is from Brazil.','私の友達はブラジル出身です。','My friend is from / Brazil.','私の友達は〜出身です / ブラジル'],
 ['My friend is friendly.','私の友達は親しみやすいです。','My friend is / friendly.','私の友達は〜です / 親しみやすい'],
 ['I like my school in Australia.','私はオーストラリアの学校が好きです。','I like / my school / in Australia.','私は好きです / 自分の学校が / オーストラリアの'],
 ['My teacher is kind.','私の先生は親切です。','My teacher is / kind.','私の先生は〜です / 親切な'],
 ['My teacher is from Japan.','私の先生は日本出身です。','My teacher is from / Japan.','私の先生は〜出身です / 日本'],
 ['I like Japan, too.','私は日本も好きです。','I like / Japan, too.','私は好きです / 日本も'],
 ['Australia is really nice.','オーストラリアは本当にすてきです。','Australia is / really nice.','オーストラリアは〜です / 本当にすてきな'],
 ['My school is great.','私の学校はすばらしいです。','My school is / great.','私の学校は〜です / すばらしい'],
 ['Goodbye.','さようなら。','Goodbye.','さようなら']
 ],
 A:[
 [0,'1. 話し手は何という名前ですか。英語で答えなさい。','Mia','最初の文で名前を述べています。'],
 [1,'2. 話し手の出身国はどこですか。英語で答えなさい。','Australia','from に続く国名です。'],
 [3,'3. 友達の出身国はどこですか。英語で答えなさい。','Brazil','友達についての文の from の後ろです。'],
 [6,'4. 先生はどのような人ですか。英語で答えなさい。','kind','kind が先生の性格を説明しています。'],
 [7,'5. 先生はどこ出身ですか。英語で答えなさい。','Japan','teacher is from の後ろを読みます。']
 ],
 B:[
 [2,'1. 話し手は日本出身ですか。Yes / No で答えなさい。','No','not from Japan とあります。'],
 [4,'2. 友達はどのような人ですか。英語で答えなさい。','friendly','be 動詞の後ろで友達を説明しています。'],
 [5,'3. 話し手はどこの学校が好きですか。英語で答えなさい。','Australia','in に続く国名です。'],
 [8,'4. 日本も好きですか。Yes / No で答えなさい。','Yes','I like Japan, too. とあります。'],
 [9,'5. オーストラリアをどのように感じていますか。英語で答えなさい。','really nice','is の後ろの説明です。']
 ]
},
{
 meta:['V11-UNIT-NH-G1-U1-2-002','ニューホライズン','1','Unit 1-2','A Rugby Fan and a Soccer Player'],
 text:[
 ['I like rugby.','私はラグビーが好きです。','I like / rugby.','私は好きです / ラグビーが'],
 ['My friend likes soccer.','私の友達はサッカーが好きです。','My friend likes / soccer.','友達は好きです / サッカーが'],
 ['I often watch rugby with my friends.','私はよく友達とラグビーを見ます。','I often watch / rugby / with my friends.','私はよく見ます / ラグビーを / 友達と'],
 ['I am a rugby fan.','私はラグビーファンです。','I am / a rugby fan.','私は〜です / ラグビーファン'],
 ['Do you watch rugby?','あなたはラグビーを見ますか。','Do you watch / rugby?','あなたは見ますか / ラグビーを'],
 ['Yes, I do.','はい、見ます。','Yes, / I do.','はい / 見ます'],
 ['But I do not play rugby.','でも私はラグビーをしません。','But / I do not play / rugby.','でも / 私はしません / ラグビーを'],
 ['I play soccer with my friend.','私は友達とサッカーをします。','I play / soccer / with my friend.','私はします / サッカーを / 友達と'],
 ['My friend is a soccer fan, too.','友達もサッカーファンです。','My friend is / a soccer fan, too.','友達も〜です / サッカーファン'],
 ['Do you like soccer?','あなたはサッカーが好きですか。','Do you like / soccer?','あなたは好きですか / サッカーが'],
 ['Yes, I do.','はい、好きです。','Yes, / I do.','はい / 好きです'],
 ['Soccer is great!','サッカーはすばらしいです。','Soccer is / great!','サッカーは〜です / すばらしい']
 ],
 A:[
 [0,'1. 話し手が好きなスポーツは何ですか。英語で答えなさい。','rugby','like の目的語です。'],
 [2,'2. 話し手はよく誰とラグビーを見ますか。英語で答えなさい。','my friends','with の後ろに一緒の人が書かれています。'],
 [3,'3. 話し手は何のファンですか。英語で答えなさい。','rugby','fan の前の語です。'],
 [6,'4. 話し手はラグビーをしますか。Yes / No で答えなさい。','No','do not play と書かれています。'],
 [7,'5. 話し手が友達とするスポーツは何ですか。英語で答えなさい。','soccer','play の目的語です。']
 ],
 B:[
 [1,'1. 友達が好きなスポーツは何ですか。英語で答えなさい。','soccer','likes の後ろを確認します。'],
 [4,'2. 話し手は何を見るかと質問されていますか。英語で答えなさい。','rugby','watch の目的語を読みます。'],
 [5,'3. 話し手はラグビーを見ますか。Yes / No で答えなさい。','Yes','Yes, I do. と返答しています。'],
 [8,'4. 友達は何のファンですか。英語で答えなさい。','soccer','soccer fan とあります。'],
 [9,'5. 最後に何が好きか尋ねていますか。英語で答えなさい。','soccer','like の目的語です。']
 ]
},
{
 meta:['V11-UNIT-SS-G2-P1-3-002','サンシャイン','2','PROGRAM 1-3','A Short Quiz Overseas'],
 text:[
 ['I am overseas with my family.','私は家族と海外にいます。','I am / overseas / with my family.','私はいます / 海外に / 家族と'],
 ['My new school has a quiz today.','新しい学校では今日小テストがあります。','My new school has / a quiz / today.','新しい学校にはあります / 小テストが / 今日'],
 ['I am a bit worried about the quiz.','私は小テストが少し心配です。','I am / a bit worried / about the quiz.','私は〜です / 少し心配 / 小テストについて'],
 ['Maybe the quiz is short.','たぶん小テストは短いです。','Maybe / the quiz is / short.','たぶん / 小テストは〜です / 短い'],
 ["I won't cry.",'私は泣きません。',"I won't cry.",'私は泣きません'],
 ["I'll do my best.",'私は最善を尽くします。',"I'll do / my best.",'私は尽くします / 最善を'],
 ['After the quiz, I text my friend.','小テストの後、私は友達に連絡します。','After the quiz, / I text / my friend.','小テストの後 / 私は連絡します / 友達に'],
 ['Why don’t you take a short break?','少し休憩したらどう？','Why don’t you take / a short break?','取ったらどうですか / 少しの休憩を'],
 ['Sounds nice!','いいね！','Sounds nice!','いいね！'],
 ['I read a book in the park.','私は公園で本を読みます。','I read / a book / in the park.','私は読みます / 本を / 公園で'],
 ['Maybe tomorrow is a good day, too.','たぶん明日もよい日になるでしょう。','Maybe / tomorrow is / a good day, too.','たぶん / 明日も〜です / よい日'],
 ["I'll do my best again.",'私はもう一度最善を尽くします。',"I'll do / my best / again.",'私は尽くします / 最善を / また']
 ],
 A:[
 [0,'1. 話し手は今どこにいますか。英語で答えなさい。','overseas','場所を表す語です。'],
 [1,'2. 今日学校で何がありますか。英語で答えなさい。','a quiz','has の目的語です。'],
 [2,'3. 話し手は何を心配していますか。英語で答えなさい。','the quiz','about の後ろです。'],
 [4,'4. 話し手は泣きますか。Yes / No で答えなさい。','No',"won't cry と否定しています。"],
 [9,'5. 話し手はどこで本を読みますか。英語で答えなさい。','in the park','場所を表しています。']
 ],
 B:[
 [3,'1. 小テストはたぶんどのようですか。英語で答えなさい。','short','is の後ろの形容詞です。'],
 [5,'2. 話し手は何を尽くすと言っていますか。英語で答えなさい。','my best','do の目的語です。'],
 [6,'3. 小テストのあと誰に連絡しますか。英語で答えなさい。','my friend','text の目的語です。'],
 [7,'4. 友達は何を提案していますか。英語で答えなさい。','a short break','take の目的語です。'],
 [11,'5. 話し手は再び何をすると言いますか。英語で答えなさい。','my best','do の目的語を確認します。']
 ]
},
{
 meta:['V11-UNIT-NH-G2-U1-2-002','ニューホライズン','2','Unit 1-2','Two Plans after Our Flight'],
 text:[
 ['Our flight will arrive in the afternoon.','私たちの飛行機は午後に到着する予定です。','Our flight will arrive / in the afternoon.','私たちの便は到着する予定です / 午後に'],
 ['I will meet my friend at the airport.','私は空港で友達に会う予定です。','I will meet / my friend / at the airport.','私は会う予定です / 友達に / 空港で'],
 ['We will go to a restaurant.','私たちはレストランへ行く予定です。','We will go / to a restaurant.','私たちは行く予定です / レストランへ'],
 ['I will eat seafood.','私は魚介料理を食べる予定です。','I will eat / seafood.','私は食べる予定です / 魚介料理を'],
 ['My friend will not eat seafood.','友達は魚介料理を食べません。','My friend will not eat / seafood.','友達は食べません / 魚介料理を'],
 ['My friend will eat different food.','友達は別の食べ物を食べます。','My friend will eat / different food.','友達は食べます / 別の食べ物を'],
 ['I will make a reservation first.','私は先に予約をします。','I will make / a reservation / first.','私はします / 予約を / 先に'],
 ['The restaurant is not far from the airport.','レストランは空港から遠くありません。','The restaurant is not / far from the airport.','レストランは〜ではありません / 空港から遠い'],
 ['We are excited about our dinner.','私たちは夕食を楽しみにしています。','We are / excited / about our dinner.','私たちは〜です / わくわくしている / 夕食について'],
 ['I will call my friend after dinner.','私は夕食後に友達に電話する予定です。','I will call / my friend / after dinner.','私は電話する予定です / 友達に / 夕食後'],
 ['My friend will call me, too.','友達も私に電話をくれる予定です。','My friend will call / me, too.','友達は電話する予定です / 私にも'],
 ['It will be a good evening.','よい夕べになるでしょう。','It will be / a good evening.','それは〜になるでしょう / よい夕べ']
 ],
 A:[
 [0,'1. 飛行機はいつ到着しますか。英語で答えなさい。','in the afternoon','will arrive の後ろに到着時刻があります。'],
 [1,'2. 話し手はどこで友達に会う予定ですか。英語で答えなさい。','at the airport','meet の後ろの場所です。'],
 [3,'3. 話し手は何を食べる予定ですか。英語で答えなさい。','seafood','eat の目的語です。'],
 [4,'4. 友達も魚介料理を食べる予定ですか。Yes / No で答えなさい。','No','will not eat とあります。'],
 [6,'5. 話し手は先に何をする予定ですか。英語で答えなさい。','a reservation','make の目的語です。']
 ],
 B:[
 [2,'1. 2人はどこへ行く予定ですか。英語で答えなさい。','a restaurant','go to の後ろです。'],
 [5,'2. 友達は何を食べる予定ですか。英語で答えなさい。','different food','eat の目的語です。'],
 [7,'3. レストランは空港から遠いですか。Yes / No で答えなさい。','No','not far とあります。'],
 [8,'4. 2人は夕食をどのように感じていますか。英語で答えなさい。','excited','are の後ろの形容詞です。'],
 [9,'5. 話し手は夕食後に何をする予定ですか。日本語で答えなさい。','友達に電話する','will call が予定を表します。']
 ]
},
{
 meta:['V11-UNIT-SS-G3-P1-3-002','サンシャイン','3','PROGRAM 1-3','A Bento at the School Festival'],
 text:[
 ["I've eaten a homemade bento before.",'私は以前手作りのお弁当を食べたことがあります。',"I've eaten / a homemade bento / before.",'私は食べたことがあります / 手作りのお弁当を / 以前に'],
 ['Today I see a variety of bentos at school.','今日私は学校でさまざまなお弁当を見ます。','Today / I see / a variety of bentos / at school.','今日 / 私は見ます / さまざまなお弁当を / 学校で'],
 ['One bento has a small portion of eel.','一つのお弁当には少量のウナギが入っています。','One bento has / a small portion / of eel.','一つのお弁当にはあります / 少量が / ウナギの'],
 ['Another bento has a few kinds of food.','別のお弁当には何種類かの食べ物が入っています。','Another bento has / a few kinds / of food.','別のお弁当にはあります / いくつかの種類が / 食べ物の'],
 ["I've never eaten eel in a bento.",'私はお弁当でウナギを食べたことがありません。',"I've never eaten / eel / in a bento.",'私は一度も食べたことがありません / ウナギを / お弁当で'],
 ['My friend has eaten eel twice.','友達はウナギを二度食べたことがあります。','My friend has eaten / eel / twice.','友達は食べたことがあります / ウナギを / 二度'],
 ['I suggest a small portion for lunch.','私は昼食には少量を勧めます。','I suggest / a small portion / for lunch.','私は勧めます / 少量を / 昼食には'],
 ['The popular bentos can sell out at noon.','人気のお弁当は正午には売り切れることがあります。','The popular bentos / can sell out / at noon.','人気のお弁当は / 売り切れることがあります / 正午に'],
 ['I want to get a normal bento.','私は普通のお弁当を手に入れたいです。','I want to get / a normal bento.','私は手に入れたいです / 普通のお弁当を'],
 ['My friend wants to try a colorful bento.','友達は色鮮やかなお弁当を試したいです。','My friend wants to try / a colorful bento.','友達は試したいです / 色鮮やかなお弁当を'],
 ['We learn about different lunches together.','私たちは一緒にいろいろな昼食について学びます。','We learn / about different lunches / together.','私たちは学びます / いろいろな昼食について / 一緒に'],
 ['I have heard of Japanese bentos before.','私は以前日本のお弁当について聞いたことがあります。','I have heard of / Japanese bentos / before.','私は聞いたことがあります / 日本のお弁当について / 以前に']
 ],
 A:[
 [0,'1. 話し手は以前何を食べたことがありますか。英語で答えなさい。','a homemade bento','現在完了の目的語です。'],
 [2,'2. 一つのお弁当には何が少し入っていますか。英語で答えなさい。','eel','portion of の後ろです。'],
 [4,'3. 話し手はお弁当でウナギを食べたことがありますか。Yes / No で答えなさい。','No','never eaten とあります。'],
 [5,'4. 友達はウナギを何度食べたことがありますか。英語で答えなさい。','twice','回数の副詞を探します。'],
 [7,'5. 人気のお弁当はいつ売り切れることがありますか。英語で答えなさい。','at noon','sell out の後ろの時間です。']
 ],
 B:[
 [1,'1. 話し手は学校で何を見ますか。英語で答えなさい。','a variety of bentos','see の目的語です。'],
 [3,'2. 別のお弁当には何種類かの何が入っていますか。英語で答えなさい。','food','of の後ろの語です。'],
 [6,'3. 話し手は昼食に何を勧めますか。英語で答えなさい。','a small portion','suggest の目的語です。'],
 [8,'4. 話し手は何のお弁当を手に入れたいですか。英語で答えなさい。','a normal bento','get の目的語です。'],
 [9,'5. 友達はどのようなお弁当を試したいですか。英語で答えなさい。','a colorful bento','try の目的語です。']
 ]
},
{
 meta:['V11-UNIT-NH-G3-U1-2-002','ニューホライズン','3','Unit 1-2','A Visitor and Japanese Fashion'],
 text:[
 ['A visitor from another country comes to our school.','外国からの訪問者が私たちの学校に来ます。','A visitor / from another country / comes to our school.','訪問者が / 別の国からの / 私たちの学校に来ます'],
 ['He likes Japanese fashion.','彼は日本のファッションが好きです。','He likes / Japanese fashion.','彼は好きです / 日本のファッションが'],
 ['He has been to Kyoto once.','彼は京都に一度行ったことがあります。','He has been to / Kyoto / once.','彼は行ったことがあります / 京都に / 一度'],
 ['He has never been to Hokkaido.','彼は北海道に行ったことがありません。','He has never been to / Hokkaido.','彼は一度も行ったことがありません / 北海道に'],
 ['We hear about regional fashion from him.','私たちは彼から地方のファッションについて聞きます。','We hear about / regional fashion / from him.','私たちは聞きます / 地方のファッションについて / 彼から'],
 ['I ask, "Have you ever been to Osaka?"','私は「大阪に行ったことがありますか」と尋ねます。','I ask, / "Have you ever been / to Osaka?"','私は尋ねます / 大阪に行ったことがありますか'],
 ['He says, "Yes, twice."','彼は「はい、二度あります」と言います。','He says, / "Yes, twice."','彼は言います / はい、二度あります'],
 ['He shows us a picture of the regional style.','彼はその地方のスタイルの写真を見せます。','He shows / us / a picture of the regional style.','彼は見せます / 私たちに / 地方のスタイルの写真を'],
 ['I have never seen that style before.','私はそのスタイルを以前見たことがありません。','I have never seen / that style / before.','私は一度も見たことがありません / そのスタイルを / 以前に'],
 ['The picture is colorful and interesting.','その写真は色鮮やかでおもしろいです。','The picture is / colorful and interesting.','その写真は〜です / 色鮮やかでおもしろい'],
 ['We talk about fashion at school.','私たちは学校でファッションについて話します。','We talk about / fashion / at school.','私たちは話します / ファッションについて / 学校で'],
 ['I want to learn more about Japan.','私は日本についてもっと学びたいです。','I want to learn / more about Japan.','私はもっと学びたいです / 日本について']
 ],
 A:[
 [0,'1. 訪問者はどこから来ましたか。英語で答えなさい。','another country','from の後ろを確認します。'],
 [2,'2. 訪問者は京都に何度行ったことがありますか。英語で答えなさい。','once','経験回数を表す副詞です。'],
 [3,'3. 訪問者は北海道に行ったことがありますか。Yes / No で答えなさい。','No','never been とあります。'],
 [4,'4. 何について訪問者から聞きますか。英語で答えなさい。','regional fashion','hear about の後ろです。'],
 [7,'5. 訪問者は何を見せてくれますか。英語で答えなさい。','a picture of the regional style','shows の目的語です。']
 ],
 B:[
 [1,'1. 訪問者は何が好きですか。英語で答えなさい。','Japanese fashion','likes の後ろです。'],
 [5,'2. 話し手はどこに行ったことがあるか質問していますか。英語で答えなさい。','Osaka','Have you ever been to の目的地です。'],
 [6,'3. 訪問者は大阪に何度行ったことがありますか。英語で答えなさい。','twice','回数を表しています。'],
 [8,'4. 話し手はそのスタイルを以前見たことがありますか。Yes / No で答えなさい。','No','never seen とあります。'],
 [9,'5. 写真はどのようなものですか。英語で答えなさい。','colorful and interesting','is の後ろです。']
 ]
}
];
function make(o){
 const [id,textbook,grade,section,title]=o.meta;
 const sentences=o.text.map(a=>a[0]),slashRows=o.text.map(a=>({en:a[2],jp:a[3]}));
 const q=([i,prompt,answer,reason])=>({prompt,answer,evidence:sentences[i],evidenceJp:o.text[i][1],reason});
 return {id,textbook,grade,section,title,genre:'story',level:'HOP',sentences,
   fullTranslation:o.text.map(a=>a[1]).join(''),slashRows,questions:o.A.map(q),questionSetB:o.B.map(q),
   notes:[],curriculumGate:'PENDING_FINAL_V7_CANONICAL_REVIEW',unitSupplemental:true,
   auditNote:'2026-11 Wave2追加候補。直接v7単語正本・正式文法順序と全文照合を完了するまで正式承認しない。'};
}
const passages=rows.map(make),keys=new Set(),ids=new Set();
if(passages.length!==6)throw new Error('Wave2 count invalid');
const registry=window.V11_UNIT_SUPPLEMENTAL_PASSAGES||{};
for(const p of passages){
 if(ids.has(p.id))throw new Error('Wave2 duplicate '+p.id);ids.add(p.id);
 if(typeof window.V11_VALIDATE_PASSAGE==='function')window.V11_VALIDATE_PASSAGE(p);
 if(p.questions.length!==5||p.questionSetB.length!==5)throw new Error(p.id+' A/B count invalid');
 for(const q of p.questions.concat(p.questionSetB))if(!p.sentences.includes(q.evidence))throw new Error(p.id+' question evidence absent');
 const k=typeof window.V11_PASSAGE_REGISTRY_KEY==='function'?window.V11_PASSAGE_REGISTRY_KEY(p)
 :[p.textbook,p.grade,p.section.replace(/^(program|unit)\s*/i,x=>x.trim().toUpperCase()+' ')].join('|');
 if(!registry[k])registry[k]=[];
 if(registry[k].some(v=>v.id===p.id))continue;
 registry[k].push(p);keys.add(k);
}
window.V11_UNIT_SUPPLEMENTAL_PASSAGES=registry;
const all=Object.values(registry).flat();
window.V11_UNIT_SUPPLEMENTAL_STATE={version:'20261114-unit-supplement-wave2-r1',
 count:all.length,sections:Object.keys(registry).length,core1000Unchanged:true,
 reviewStatus:'AWAITING_CANONICAL_V7_CURRICULUM_GATE',ids:all.map(p=>p.id),wave2Count:6};
if(typeof window.V11_SYNC_PASSAGE_VARIANT_UI==='function')window.V11_SYNC_PASSAGE_VARIANT_UI({preserveSelection:true,render:true});
})();