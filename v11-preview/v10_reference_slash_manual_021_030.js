// Reference/minimum-rule slash audit passages 021-030.
(function(){
 const PASS='PASS_REFERENCE_20260820';
 function setAudit(data,section,rows,n){const p=data&&data[section];if(!p)throw new Error('Missing reference passage '+n+': '+section);if(rows.length!==(p.sentences||[]).length)throw new Error('Row mismatch '+n);for(let i=0;i<rows.length;i++){const e=String(rows[i].en||'').replace(/\s*\/\s*/g,' ').replace(/\s+/g,' ').trim(),s=String(p.sentences[i]||'').replace(/\s+/g,' ').trim();if(e!==s)throw new Error('English mismatch '+n+'#'+(i+1)+': '+e+' <> '+s);const ec=String(rows[i].en||'').split(/\s*\/\s*/).filter(Boolean).length,jc=String(rows[i].jp||'').split(/\s*\/\s*/).filter(Boolean).length;if(ec!==jc)throw new Error('EN/JP chunks '+n+'#'+(i+1)+' '+ec+'/'+jc)}p.slashRows=rows;p.slashReadingVersion='reference-book-minimum-rules-20260820';p.slashReferenceAudit=PASS;p.slashReferencePassageNo=n}
 const d=window.V10_SUNSHINE_G1||{};
 setAudit(d,'PROGRAM 6-1',[
  {en:'I like this story.',jp:'私はこの物語が好きです。'},
  {en:'This story is / about a detective.',jp:'この物語は〜です / 探偵について'},
  {en:'A pirate is / in the story, / too.',jp:'海賊がいます / その物語の中に / 〜もまた'},
  {en:'A monster is / in the story, / too.',jp:'モンスターがいます / その物語の中に / 〜もまた'},
  {en:'I like the detective very much.',jp:'私はその探偵がとても好きです。'},
  {en:'I like the pirate, / too.',jp:'私はその海賊が好きです / 〜もまた'},
  {en:'I don’t like the monster very much.',jp:'私はそのモンスターがあまり好きではありません。'},
  {en:'My friend / and I like the detective.',jp:'私の友達 / そして私はその探偵が好きです'},
  {en:'My friend / and I talk / about the detective / and the pirate.',jp:'私の友達 / そして私は話します / その探偵について / そして海賊について'},
  {en:'We talk / about the monster, / too.',jp:'私たちは話します / そのモンスターについて / 〜もまた'},
  {en:'We really like the story.',jp:'私たちはその物語が本当に好きです。'}
 ],21);
 setAudit(d,'PROGRAM 6-2',[
  {en:'I always go / to the park / on Saturday.',jp:'私はいつも行きます / 公園へ / 土曜日に'},
  {en:'My friend / and I go there together.',jp:'私の友達 / そして私はいっしょにそこへ行きます'},
  {en:'We go there early.',jp:'私たちは早い時間にそこへ行きます。'},
  {en:'The park is quiet.',jp:'その公園は静かです。'},
  {en:'It is beautiful, / too.',jp:'そこはきれいです / 〜もまた'},
  {en:'We practice basketball / there.',jp:'私たちはバスケットボールを練習します / そこで'},
  {en:'We practice hard.',jp:'私たちは一生懸命練習します。'},
  {en:'After practice, / I read there.',jp:'練習のあと / 私はそこで本を読みます'},
  {en:'I sometimes ride my bicycle / there.',jp:'私はときどき自転車に乗ります / そこで'},
  {en:'My friend / and I like the park very much.',jp:'私の友達 / そして私はその公園がとても好きです'},
  {en:'We go home together.',jp:'私たちはいっしょに家へ帰ります。'}
 ],22);
 setAudit(d,'PROGRAM 6-3',[
  {en:'This is Kenya.',jp:'ここはケニアです。'},
  {en:'Schoolchildren walk / across the savanna / every morning.',jp:'子どもたちは歩きます / サバンナを横切って / 毎朝'},
  {en:'They walk / for one hour / to school.',jp:'彼らは歩きます / 1時間 / 学校まで'},
  {en:'The walk is tough.',jp:'その道のりは大変です。'},
  {en:'The savanna can be dangerous.',jp:'サバンナは危険なことがあります。'},
  {en:'The schoolchildren are strong.',jp:'その子どもたちは強いです。'},
  {en:'They walk together.',jp:'彼らはいっしょに歩きます。'},
  {en:'They go / to school / every morning.',jp:'彼らは行きます / 学校へ / 毎朝'},
  {en:'I respect the schoolchildren.',jp:'私はその子どもたちを尊敬します。'},
  {en:'I want / to tell my friend / about them.',jp:'私は望んでいます / 友達に伝えることを / 彼らについて'},
  {en:'The schoolchildren are amazing.',jp:'その子どもたちはすごいです。'}
 ],23);
 setAudit(d,'PROGRAM 7-1',[
  {en:'My dad / and I are / at a college.',jp:'私の父 / そして私はいます / 大学に'},
  {en:'We talk / about research.',jp:'私たちは話します / 研究について'},
  {en:'The research is interesting.',jp:'その研究はおもしろいです。'},
  {en:'A library is / near the college.',jp:'図書館があります / 大学の近くに'},
  {en:'A museum is / near the library.',jp:'博物館があります / 図書館の近くに'},
  {en:'My dad / and I go / to the museum.',jp:'私の父 / そして私は行きます / その博物館へ'},
  {en:'After the museum, / I am hungry.',jp:'博物館のあと / 私はおなかがすいています'},
  {en:'My dad is hungry, / too.',jp:'私の父はおなかがすいています / 〜もまた'},
  {en:'We go / to a restaurant / near the college.',jp:'私たちは行きます / レストランへ / 大学の近くの'},
  {en:'I have a pork sandwich.',jp:'私はポークサンドイッチを食べます。'},
  {en:'My dad has steak.',jp:'私の父はステーキを食べます。'},
  {en:'We go home / after dinner.',jp:'私たちは家へ帰ります / 夕食後に'},
  {en:'It is a great day.',jp:'すばらしい一日です。'}
 ],24);
 setAudit(d,'PROGRAM 7-2',[
  {en:'My friend / and I go / to a cake shop.',jp:'私の友達 / そして私は行きます / ケーキ屋へ'},
  {en:'The shop is far / from my house.',jp:'その店は遠いです / 私の家から'},
  {en:'We go there / by bus.',jp:'私たちはそこへ行きます / バスで'},
  {en:'I am a little hungry.',jp:'私は少しおなかがすいています。'},
  {en:'My friend is hungry, / too.',jp:'私の友達はおなかがすいています / 〜もまた'},
  {en:'We want something sweet.',jp:'私たちは何か甘いものがほしいです。'},
  {en:'We have cake together.',jp:'私たちはいっしょにケーキを食べます。'},
  {en:'The cake is great.',jp:'そのケーキはすばらしいです。'},
  {en:'Now I am full.',jp:'今、私はおなかがいっぱいです。'},
  {en:'My friend is full, / too.',jp:'私の友達はおなかがいっぱいです / 〜もまた'},
  {en:'We go home / by bus.',jp:'私たちは家へ帰ります / バスで'},
  {en:'I like this shop very much.',jp:'私はこの店がとても好きです。'}
 ],25);
 setAudit(d,'PROGRAM 7-3',[
  {en:'This zoo is popular.',jp:'この動物園は人気があります。'},
  {en:'My friend / and I are / at the zoo.',jp:'私の友達 / そして私はいます / その動物園に'},
  {en:'My friend can show me around.',jp:'私の友達は私を案内して回ることができます。'},
  {en:'The zoo is famous / for the quokka.',jp:'その動物園は有名です / クオッカで'},
  {en:'Look / at the quokka.',jp:'見てください / そのクオッカを'},
  {en:'The quokka is a unique animal.',jp:'そのクオッカは珍しい動物です。'},
  {en:'I like the quokka very much.',jp:'私はそのクオッカがとても好きです。'},
  {en:'The zoo has a koala, / too.',jp:'その動物園にはコアラがいます / 〜もまた'},
  {en:'A turtle is / near the gate.',jp:'カメがいます / 門の近くに'},
  {en:'The scenery is gorgeous.',jp:'その景色はすばらしいです。'},
  {en:'I want / to come here / with my family / someday.',jp:'私は望んでいます / ここへ来ることを / 家族といっしょに / いつか'},
  {en:'I like this zoo very much.',jp:'私はこの動物園がとても好きです。'}
 ],26);
 setAudit(d,'PROGRAM 8-1',[
  {en:'Happy New Year!',jp:'新年おめでとう！'},
  {en:'My dad / and I go / to the supermarket.',jp:'私の父 / そして私は行きます / スーパーマーケットへ'},
  {en:'We need fruit / for our family.',jp:'私たちはくだものが必要です / 家族のために'},
  {en:'We need a pineapple / and a strawberry.',jp:'私たちはパイナップルが必要です / そしてイチゴも'},
  {en:'We need a persimmon / and a peach, / too.',jp:'私たちはカキが必要です / そしてモモも / 〜もまた'},
  {en:'The supermarket is busy.',jp:'そのスーパーマーケットは混んでいます。'},
  {en:'We have the fruit / in our bag.',jp:'私たちはそのくだものを持っています / 私たちのかばんの中に'},
  {en:'My dad / and I go home together.',jp:'私の父 / そして私はいっしょに家へ帰ります'},
  {en:'My family / and I like the fruit.',jp:'私の家族 / そして私はそのくだものが好きです'},
  {en:'We are happy.',jp:'私たちはうれしいです。'}
 ],27);
 setAudit(d,'PROGRAM 8-2',[
  {en:'Today, / my friend / and I are / at home.',jp:'今日 / 私の友達 / そして私はいます / 家に'},
  {en:'We prepare / for a countdown.',jp:'私たちは準備します / カウントダウンのために'},
  {en:'We are busy.',jp:'私たちは忙しいです。'},
  {en:'We have a cake / for the countdown.',jp:'私たちはケーキを持っています / カウントダウン用の'},
  {en:'Why don’t we listen / to music?',jp:'私たちは聞きませんか / 音楽を'},
  {en:'Great!',jp:'いいね！'},
  {en:'We listen / to music together.',jp:'私たちは聞きます / いっしょに音楽を'},
  {en:'We have a little cake / before the countdown.',jp:'私たちは少しケーキを食べます / カウントダウンの前に'},
  {en:'The countdown is exciting.',jp:'そのカウントダウンはわくわくします。'},
  {en:'I feel happy.',jp:'私はうれしく感じます。'},
  {en:'My friend is happy, / too.',jp:'私の友達もうれしいです / 〜もまた'},
  {en:'It is a great day.',jp:'すばらしい一日です。'}
 ],28);
 setAudit(d,'PROGRAM 8-3',[
  {en:'We’re / at a market.',jp:'私たちはいます / 市場に'},
  {en:'My mom is / with me.',jp:'私の母はいます / 私といっしょに'},
  {en:'It is almost midnight.',jp:'もうすぐ真夜中です。'},
  {en:'We are / in front of a food stand.',jp:'私たちはいます / 食べ物の屋台の前に'},
  {en:'I have tuna / at the stand.',jp:'私はマグロを食べます / その屋台で'},
  {en:'I have an oyster, / too.',jp:'私はカキを食べます / 〜もまた'},
  {en:'The tuna is expensive.',jp:'そのマグロは高価です。'},
  {en:'A pastry chef is / at the next stand.',jp:'パティシエがいます / 次の屋台に'},
  {en:'The pastry chef is / from France.',jp:'そのパティシエは〜出身です / フランス'},
  {en:'The pastry chef is skillful.',jp:'そのパティシエは腕がよいです。'},
  {en:'My mom / and I like the market very much.',jp:'私の母 / そして私はその市場がとても好きです'},
  {en:'We go home together.',jp:'私たちはいっしょに家へ帰ります。'}
 ],29);
 setAudit(d,'PROGRAM 9-1',[
  {en:'Last holiday, / I stayed / in Finland / with my family.',jp:'この前の休日 / 私は滞在しました / フィンランドに / 家族と'},
  {en:'We stayed / in a small house / near a park.',jp:'私たちは滞在しました / 小さな家に / 公園の近くの'},
  {en:'I relaxed a lot there.',jp:'私はそこで大いにくつろぎました。'},
  {en:'One day, / my brother / and I walked / to the park.',jp:'ある日 / 私の兄（弟） / そして私は歩きました / 公園まで'},
  {en:'We played tennis there.',jp:'私たちはそこでテニスをしました。'},
  {en:'My brother beat me.',jp:'私の兄（弟）は私に勝ちました。'},
  {en:'We walked home.',jp:'私たちは歩いて家へ帰りました。'},
  {en:'My father cooked dinner.',jp:'私の父は夕食を作りました。'},
  {en:'After dinner, / we talked / about the tennis game.',jp:'夕食後 / 私たちは話しました / そのテニスの試合について'},
  {en:'I read a book / and relaxed.',jp:'私は本を読みました / そしてくつろぎました'},
  {en:'I liked the trip very much.',jp:'私はその旅行がとても気に入りました。'}
 ],30);
 window.V10_REFERENCE_SLASH_AUDIT={version:'2026-08-20',passagesAudited:30,total:168,lastCompleted:30,minimumRuleImageConfirmed:true};
})();