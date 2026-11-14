/* Wave4: six additional UNIT-specific original reading candidates.
   Keep the frozen 1000 independent, and leave curriculum approval PENDING. */
(function registerV11UnitWave4(){
'use strict';
if(window.V11_UNIT_SUPPLEMENTAL_STATE?.count!==18)throw new Error('Wave4 requires 18 Wave1-3 passages');
const items=[
{
meta:['V11-UNIT-SS-G1-P2-1-004','サンシャイン','1','PROGRAM 2-1','My First Flip Book'],
rows:[
['After school, I go home with my friend.','放課後、私は友達と家に帰ります。','After school, / I go home / with my friend.','放課後 / 私は帰ります / 友達と'],
['At home, I draw many pictures.','家で私はたくさんの絵を描きます。','At home, / I draw / many pictures.','家で / 私は描きます / たくさんの絵を'],
['I use a small flip book.','私は小さなパラパラ漫画の本を使います。','I use / a small flip book.','私は使います / 小さなパラパラ漫画の本を'],
['I am an artist today.','今日の私は絵描きです。','I am / an artist / today.','私は〜です / 絵描き / 今日'],
['I draw a flower in the book.','私は本に花を描きます。','I draw / a flower / in the book.','私は描きます / 花を / 本に'],
['I draw the flower again.','私はその花をもう一度描きます。','I draw / the flower / again.','私は描きます / その花を / もう一度'],
['This flower is beautiful.','この花は美しいです。','This flower is / beautiful.','この花は〜です / 美しい'],
['My friend and I watch the flip book.','友達と私はパラパラ漫画を見ます。','My friend and I / watch / the flip book.','友達と私は / 見ます / パラパラ漫画を'],
['We sometimes read books together.','私たちはときどき一緒に本を読みます。','We sometimes read / books / together.','私たちはときどき読みます / 本を / 一緒に'],
['I clean my desk at home.','私は家で机を掃除します。','I clean / my desk / at home.','私は掃除します / 机を / 家で'],
['We walk to school every day.','私たちは毎日歩いて学校へ行きます。','We walk / to school / every day.','私たちは歩きます / 学校へ / 毎日'],
['I like my flip book very much.','私はパラパラ漫画の本がとても好きです。','I like / my flip book / very much.','私は好きです / 自分のパラパラ漫画の本が / とても']
],
A:[
[0,'1. 話し手は放課後誰と帰りますか。英語で答えなさい。','my friend','with に続く相手です。'],
[1,'2. 家で何をたくさん描きますか。英語で答えなさい。','many pictures','draw の目的語です。'],
[2,'3. 話し手はどんな本を使いますか。英語で答えなさい。','a small flip book','use の目的語です。'],
[4,'4. 本に何を描きますか。英語で答えなさい。','a flower','draw の目的語です。'],
[7,'5. 誰がパラパラ漫画を見ますか。英語で答えなさい。','My friend and I','watch の主語です。']],
B:[
[3,'1. 今日、話し手は自分を何だと言っていますか。英語で答えなさい。','an artist','be 動詞に続く職業の表現です。'],
[5,'2. 花を何回目か描いていますか。本文中の英語を答えなさい。','again','繰り返しを示す副詞です。'],
[6,'3. 花はどのようですか。英語で答えなさい。','beautiful','is の後ろにある形容詞です。'],
[9,'4. 家で何を掃除しますか。英語で答えなさい。','my desk','clean の目的語です。'],
[11,'5. 何がとても好きですか。英語で答えなさい。','my flip book','like の目的語です。']]
},
{
meta:['V11-UNIT-NH-G1-U2-1-004','ニューホライズン','1','Unit 2-1','Our School Tennis Team'],
rows:[
['This is our tennis team.','これは私たちのテニスチームです。','This is / our tennis team.','これは〜です / 私たちのテニスチーム'],
['My friend is Aki.','私の友達はアキです。','My friend is / Aki.','私の友達は〜です / アキ'],
['She is on our team.','彼女は私たちのチームにいます。','She is on / our team.','彼女は所属しています / 私たちのチームに'],
["She's very cool.",'彼女はとてもかっこいいです。',"She's / very cool.",'彼女は〜です / とてもかっこいい'],
['She is good at tennis.','彼女はテニスが得意です。','She is good at / tennis.','彼女は得意です / テニスが'],
['This is Ken.','こちらはケンです。','This is / Ken.','こちらは〜です / ケン'],
['He is from America.','彼はアメリカ出身です。','He is from / America.','彼は〜出身です / アメリカ'],
["He's on the team.",'彼もチームに所属しています。',"He's on / the team.",'彼は所属しています / チームに'],
['He is a good student.','彼はよい生徒です。','He is / a good student.','彼は〜です / よい生徒'],
['This is our new teacher, Ms. Green.','こちらは新しい先生のグリーン先生です。','This is / our new teacher, / Ms. Green.','こちらは〜です / 私たちの新しい先生 / グリーン先生'],
['She is from Canada.','彼女はカナダ出身です。','She is from / Canada.','彼女は〜出身です / カナダ'],
['Our team is great.','私たちのチームはすばらしいです。','Our team is / great.','私たちのチームは〜です / すばらしい']
],
A:[
[0,'1. 何のチームを紹介していますか。英語で答えなさい。','tennis','team の前のスポーツ名です。'],
[1,'2. 最初に紹介する友達は誰ですか。英語で答えなさい。','Aki','My friend is に続く名前です。'],
[2,'3. アキはどのチームにいますか。英語で答えなさい。','our team','on の後ろです。'],
[4,'4. アキは何が得意ですか。英語で答えなさい。','tennis','good at の後ろです。'],
[6,'5. ケンはどこ出身ですか。英語で答えなさい。','America','from の後ろの国名です。']],
B:[
[3,'1. アキはどんな人ですか。英語で答えなさい。','very cool','be 動詞の後ろに説明があります。'],
[5,'2. 2人目に紹介される人は誰ですか。英語で答えなさい。','Ken','This is の後ろです。'],
[7,'3. ケンはチームにいますか。Yes / No で答えなさい。','Yes','He is on the team. とあります。'],
[9,'4. 新しい先生の名前は何ですか。英語で答えなさい。','Ms. Green','先生の敬称と名前です。'],
[10,'5. 先生はどこ出身ですか。英語で答えなさい。','Canada','is from の後ろです。']]
},
{
meta:['V11-UNIT-SS-G2-P2-2-004','サンシャイン','2','PROGRAM 2-2','A Sports Program at School'],
rows:[
['Our school has a new sports day.','私たちの学校には新しいスポーツの日があります。','Our school has / a new sports day.','私たちの学校にはあります / 新しいスポーツの日が'],
['A national program helps our school.','全国的なプログラムが私たちの学校を支えています。','A national program helps / our school.','全国的なプログラムが支えています / 私たちの学校を'],
['The coach works at a university.','コーチは大学で働いています。','The coach works / at a university.','そのコーチは働いています / 大学で'],
['The coach believes in peace.','コーチは平和を信じています。','The coach believes in / peace.','コーチは信じています / 平和を'],
['I believe sports can create peace.','私はスポーツが平和を生み出せると信じています。','I believe / sports can create / peace.','私は信じています / スポーツは生み出せると / 平和を'],
['When children play, they smile.','子どもたちは遊ぶと笑顔になります。','When children play, / they smile.','子どもたちは遊ぶと / 笑顔になります'],
['When we play together, we talk to new friends.','一緒に遊ぶと、私たちは新しい友達と話します。','When we play together, / we talk to / new friends.','一緒に遊ぶと / 私たちは話します / 新しい友達と'],
['We create a team at school.','私たちは学校でチームを作ります。','We create / a team / at school.','私たちは作ります / チームを / 学校で'],
['The program is about baseball and peace.','そのプログラムは野球と平和についてのものです。','The program is / about baseball and peace.','そのプログラムは〜です / 野球と平和についてのもの'],
['I am interested in the national program.','私はその全国的なプログラムに興味があります。','I am interested in / the national program.','私は興味があります / その全国的なプログラムに'],
['We should help all children.','私たちはすべての子どもたちを助けるべきです。','We should help / all children.','私たちは助けるべきです / すべての子どもたちを'],
['The coach says, "Have fun!"','コーチは「楽しんでね！」と言います。','The coach says, / "Have fun!"','コーチは言います / 「楽しんでね！」']
],
A:[
[0,'1. 学校で新しく始まるものは何ですか。英語で答えなさい。','a new sports day','has の目的語です。'],
[1,'2. 何が学校を支えていますか。英語で答えなさい。','A national program','主語を答えます。'],
[2,'3. コーチはどこで働いていますか。英語で答えなさい。','a university','works at の後ろです。'],
[3,'4. コーチは何を信じていますか。英語で答えなさい。','peace','believes in の後ろです。'],
[4,'5. スポーツは何を生み出せますか。英語で答えなさい。','peace','create の目的語です。']],
B:[
[5,'1. 子どもたちは遊ぶとどうなりますか。英語で答えなさい。','smile','When の後ろの主節です。'],
[6,'2. 一緒に遊ぶと誰と話しますか。英語で答えなさい。','new friends','talk to の後ろにあります。'],
[7,'3. 学校で何を作りますか。英語で答えなさい。','a team','create の目的語です。'],
[9,'4. 話し手は何に興味がありますか。英語で答えなさい。','the national program','interested in の後ろです。'],
[10,'5. 私たちは誰を助けるべきですか。英語で答えなさい。','all children','help の目的語です。']]
},
{
meta:['V11-UNIT-NH-G2-U1-4-004','ニューホライズン','2','Unit 1-4','A Culture Day with Pictures'],
rows:[
['Our class had a culture day at school.','私たちのクラスには学校で文化の日がありました。','Our class had / a culture day / at school.','私たちのクラスではありました / 文化の日が / 学校で'],
['I saw a painting from India.','私はインドから来た絵を見ました。','I saw / a painting / from India.','私は見ました / 絵を / インドからの'],
['The painting showed a large wall.','その絵には大きな壁が描かれていました。','The painting showed / a large wall.','その絵は示していました / 大きな壁を'],
['The wall was in a busy area.','その壁はにぎやかな地域にありました。','The wall was / in a busy area.','その壁はありました / にぎやかな地域に'],
['My friend was surprised by the painting.','友達はその絵に驚きました。','My friend was surprised / by the painting.','友達は驚きました / その絵に'],
['We talked about the colors.','私たちは色について話しました。','We talked about / the colors.','私たちは話しました / 色について'],
['A second picture was from Singapore.','2枚目の写真はシンガポールのものでした。','A second picture was / from Singapore.','2枚目の写真は〜でした / シンガポールからの'],
['There was a mosque in the picture.','写真にはモスクがありました。','There was / a mosque / in the picture.','ありました / モスクが / 写真の中に'],
['The mosque was beautiful.','そのモスクは美しかったです。','The mosque was / beautiful.','そのモスクは〜でした / 美しい'],
['We learned about different cultures.','私たちは異なる文化について学びました。','We learned about / different cultures.','私たちは学びました / 異なる文化について'],
['I want to visit Singapore someday.','私はいつかシンガポールを訪れたいです。','I want to visit / Singapore / someday.','私は訪れたいです / シンガポールを / いつか'],
['The culture day was fun.','その文化の日は楽しかったです。','The culture day was / fun.','その文化の日は〜でした / 楽しい']
],
A:[
[0,'1. クラスではどのような日がありましたか。英語で答えなさい。','a culture day','had の目的語です。'],
[1,'2. 最初に見た絵はどこの国からのものですか。英語で答えなさい。','India','from の後ろの国です。'],
[2,'3. 絵には何が描かれていましたか。英語で答えなさい。','a large wall','showed の目的語です。'],
[4,'4. 友達は何に驚きましたか。英語で答えなさい。','the painting','surprised by の後ろです。'],
[6,'5. 2枚目の写真はどこの国のものですか。英語で答えなさい。','Singapore','from の後ろです。']],
B:[
[3,'1. 壁はどのような地域にありましたか。英語で答えなさい。','a busy area','in の後ろの場所です。'],
[5,'2. みんなは何について話しましたか。英語で答えなさい。','the colors','talked about の後ろです。'],
[7,'3. 写真には何がありましたか。英語で答えなさい。','a mosque','There was の直後です。'],
[9,'4. 何について学びましたか。英語で答えなさい。','different cultures','learned about の後ろです。'],
[10,'5. 話し手はいつかどこに行きたいですか。英語で答えなさい。','Singapore','visit の目的語です。']]
},
{
meta:['V11-UNIT-SS-G3-P2-2-004','サンシャイン','3','PROGRAM 2-2','My English Study Diary'],
rows:[
['I have used this diary since April.','私は4月からこの日記を使っています。','I have used / this diary / since April.','私は使っています / この日記を / 4月から'],
['I have studied English for many months.','私は何か月も英語を勉強し続けています。','I have studied / English / for many months.','私は勉強し続けています / 英語を / 何か月も'],
['Every day, I write one new word in it.','毎日、私は新しい単語を一つ書きます。','Every day, / I write / one new word / in it.','毎日 / 私は書きます / 新しい単語を一つ / その中に'],
['Right now, the diary is full of notes.','今、日記はメモでいっぱいです。','Right now, / the diary is full of / notes.','今 / その日記はいっぱいです / メモで'],
['My study plan is based on short lessons.','私の学習計画は短いレッスンを基にしています。','My study plan is based on / short lessons.','私の学習計画は基づいています / 短いレッスンに'],
['I concentrate on English before a test.','私はテスト前に英語に集中します。','I concentrate on / English / before a test.','私は集中します / 英語に / テスト前に'],
['This habit is useful to me.','この習慣は私に役立っています。','This habit is / useful / to me.','この習慣は〜です / 役立つ / 私にとって'],
['My friend has used a diary for six weeks.','友達は6週間日記を使っています。','My friend has used / a diary / for six weeks.','友達は使っています / 日記を / 6週間'],
['We read our notes after school.','私たちは放課後にメモを読みます。','We read / our notes / after school.','私たちは読みます / メモを / 放課後に'],
['I want to keep a diary next year, too.','私は来年も日記をつけたいです。','I want to keep / a diary / next year, too.','私はつけたいです / 日記を / 来年も'],
['I hope my English will get better.','私は自分の英語が上達することを願っています。','I hope / my English will get / better.','私は願っています / 私の英語が〜になることを / よりよく'],
['The small habit helps me study.','その小さな習慣は勉強の助けになります。','The small habit helps / me / study.','その小さな習慣は助けます / 私が / 勉強するのを']
],
A:[
[0,'1. いつから日記を使っていますか。英語で答えなさい。','since April','開始時点を表す語句です。'],
[1,'2. どの教科を何か月も勉強していますか。英語で答えなさい。','English','studied の目的語です。'],
[2,'3. 毎日いくつ新しい単語を書きますか。英語で答えなさい。','one','word の数です。'],
[3,'4. 日記は何でいっぱいですか。英語で答えなさい。','notes','full of の後ろです。'],
[5,'5. テスト前に何に集中しますか。英語で答えなさい。','English','concentrate on の後ろです。']],
B:[
[4,'1. 学習計画は何に基づいていますか。英語で答えなさい。','short lessons','based on の後ろです。'],
[6,'2. この習慣はどのようなものですか。英語で答えなさい。','useful','be 動詞の後ろです。'],
[7,'3. 友達は何週間日記を使っていますか。英語で答えなさい。','six weeks','期間を示しています。'],
[8,'4. 放課後に何を読みますか。英語で答えなさい。','our notes','read の目的語です。'],
[9,'5. 来年も何をつけたいですか。英語で答えなさい。','a diary','keep の目的語です。']]
},
{
meta:['V11-UNIT-NH-G3-U1-4-004','ニューホライズン','3','Unit 1-4','Old Art and Modern Animation'],
rows:[
['Today our teacher shows us a Japanese picture scroll.','今日、先生は私たちに日本の絵巻物を見せてくれます。','Today / our teacher shows / us / a Japanese picture scroll.','今日 / 先生は見せます / 私たちに / 日本の絵巻物を'],
['The scroll has a long history.','その絵巻物には長い歴史があります。','The scroll has / a long history.','その絵巻物にはあります / 長い歴史が'],
['It is said that picture scrolls are one of the roots of animation.','絵巻物はアニメーションの源流の一つだと言われています。','It is said that / picture scrolls are / one of the roots of animation.','〜と言われています / 絵巻物は〜であると / アニメーションの源流の一つ'],
['Each drawing links to the next one.','それぞれの絵が次の絵につながっています。','Each drawing links / to the next one.','それぞれの絵はつながります / 次の絵に'],
['We can see movement in the pictures.','私たちは絵の中に動きを見ることができます。','We can see / movement / in the pictures.','私たちは見ることができます / 動きを / 絵の中に'],
['An artist can express movement with drawings.','絵描きは絵で動きを表現できます。','An artist can express / movement / with drawings.','絵描きは表現できます / 動きを / 絵で'],
['This technique has an advantage.','この技法には利点があります。','This technique has / an advantage.','この技法にはあります / 利点が'],
['It can show a story without many words.','それは多くの言葉を使わずに物語を表せます。','It can show / a story / without many words.','それは示せます / 物語を / 多くの言葉を使わずに'],
['Modern artists can take advantage of it.','現代の芸術家はそれを活用できます。','Modern artists can take advantage of / it.','現代の芸術家は活用できます / それを'],
['We should not ignore the influence of old art.','私たちは古い芸術の影響を無視すべきではありません。','We should not ignore / the influence / of old art.','私たちは無視すべきではありません / 影響を / 古い芸術の'],
['The link is not entirely clear.','そのつながりは完全には明らかではありません。','The link is not / entirely clear.','そのつながりは〜ではありません / 完全に明らかな'],
['People have different tastes in art.','人々には芸術の好みの違いがあります。','People have / different tastes / in art.','人々にはあります / さまざまな好みが / 芸術について']
],
A:[
[0,'1. 先生は何を見せてくれますか。英語で答えなさい。','a Japanese picture scroll','shows の目的語です。'],
[1,'2. 絵巻物には何がありますか。英語で答えなさい。','a long history','has の目的語です。'],
[2,'3. 絵巻物は何の源流の一つだと言われていますか。英語で答えなさい。','animation','roots of の後ろです。'],
[4,'4. 絵の中には何が見えますか。英語で答えなさい。','movement','see の目的語です。'],
[6,'5. この技法には何がありますか。英語で答えなさい。','an advantage','has の目的語です。']],
B:[
[3,'1. それぞれの絵は何につながっていますか。英語で答えなさい。','the next one','links to の後ろです。'],
[5,'2. 芸術家は何を表現できますか。英語で答えなさい。','movement','express の目的語です。'],
[7,'3. 多くの何を使わずに物語を表せますか。英語で答えなさい。','words','without many の後ろです。'],
[9,'4. 何の影響を無視すべきではありませんか。英語で答えなさい。','old art','influence of の後ろです。'],
[10,'5. つながりは完全に明らかですか。Yes / No で答えなさい。','No','not entirely clear と否定しています。']]
}
];
function convert(x){
 const [id,textbook,grade,section,title]=x.meta;
 const sentences=x.rows.map(r=>r[0]),q=a=>({prompt:a[1],answer:a[2],evidence:sentences[a[0]],evidenceJp:x.rows[a[0]][1],reason:a[3]});
 return {id,textbook,grade,section,title,genre:'story',level:'HOP',sentences,
  fullTranslation:x.rows.map(r=>r[1]).join(''),slashRows:x.rows.map(r=>({en:r[2],jp:r[3]})),
  questions:x.A.map(q),questionSetB:x.B.map(q),notes:[],unitSupplemental:true,
  curriculumGate:'PENDING_FINAL_V7_CANONICAL_REVIEW',
  auditNote:'2026-11 Wave4：単元と問題根拠を確認済み。全文単語・文法進度の正本最終監修前につき未公開候補。'};
}
const registry=window.V11_UNIT_SUPPLEMENTAL_PASSAGES||{},created=items.map(convert),seen=new Set();
if(created.length!==6)throw new Error('Wave4 must add six passages');
for(const p of created){
 if(seen.has(p.id))throw new Error('Wave4 duplicated '+p.id);seen.add(p.id);
 if(typeof window.V11_VALIDATE_PASSAGE==='function')window.V11_VALIDATE_PASSAGE(p);
 if(p.questions.length!==5||p.questionSetB.length!==5)throw new Error('Wave4 A/B contract '+p.id);
 for(const q of p.questions.concat(p.questionSetB))if(!p.sentences.includes(q.evidence))throw new Error('Wave4 missing evidence '+p.id);
 const k=typeof window.V11_PASSAGE_REGISTRY_KEY==='function'?window.V11_PASSAGE_REGISTRY_KEY(p):
  [p.textbook,String(p.grade),String(p.section).replace(/^(program|unit)\s*/i,m=>m.trim().toUpperCase()+' ')].join('|');
 if(!registry[k])registry[k]=[];
 if(!registry[k].some(r=>r.id===p.id))registry[k].push(p);
}
const all=Object.values(registry).flat();
if(all.length!==24)throw new Error('Wave4 expected 24, got '+all.length);
window.V11_UNIT_SUPPLEMENTAL_PASSAGES=registry;
window.V11_UNIT_SUPPLEMENTAL_STATE={version:'20261114-unit-supplement-wave4-r1',
 count:all.length,sections:Object.keys(registry).length,core1000Unchanged:true,
 reviewStatus:'AWAITING_CANONICAL_V7_CURRICULUM_GATE',ids:all.map(p=>p.id),wave4Count:6};
if(typeof window.V11_SYNC_PASSAGE_VARIANT_UI==='function')window.V11_SYNC_PASSAGE_VARIANT_UI({preserveSelection:true,render:true});
})();