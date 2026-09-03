// Reference/minimum-rule slash audit passages 051-060.
(function(){
 const PASS='PASS_REFERENCE_20260820';
 function setAudit(data,section,rows,n){const p=data&&data[section];if(!p)throw new Error('Missing reference passage '+n+': '+section);if(rows.length!==(p.sentences||[]).length)throw new Error('Row mismatch '+n);for(let i=0;i<rows.length;i++){const e=String(rows[i].en||'').replace(/\s*\/\s*/g,' ').replace(/\s+/g,' ').trim(),s=String(p.sentences[i]||'').replace(/\s+/g,' ').trim();if(e!==s)throw new Error('English mismatch '+n+'#'+(i+1)+': '+e+' <> '+s);const ec=String(rows[i].en||'').split(/\s*\/\s*/).filter(Boolean).length,jc=String(rows[i].jp||'').split(/\s*\/\s*/).filter(Boolean).length;if(ec!==jc)throw new Error('EN/JP chunks '+n+'#'+(i+1)+' '+ec+'/'+jc)}p.slashRows=rows;p.slashReadingVersion='reference-book-minimum-rules-20260820';p.slashReferenceAudit=PASS;p.slashReferencePassageNo=n}
 const d=window.V10_NEWHORIZON_G1||{};
 setAudit(d,'Unit 4-3',[
  {en:'It’s your turn.',jp:'あなたの番です。'},{en:'Are you nervous?',jp:'緊張していますか。'},{en:'Yes, / I am.',jp:'はい / しています'},{en:'Don’t worry.',jp:'心配しないで。'},{en:'Please come / to the front.',jp:'来てください / 前へ'},{en:'Read this, / please.',jp:'これを読んでください / お願いします'},{en:'Look / at me, / please.',jp:'見てください / 私を / お願いします'},{en:'Is this right?',jp:'これで合っていますか。'},{en:'Yes, / it is.',jp:'はい / 合っています'},{en:'Great.',jp:'いいですね。'},{en:'Enjoy yourself.',jp:'楽しんでね。'},{en:'Thank you.',jp:'ありがとうございます。'}
 ],51);
 setAudit(d,'Unit 5-1',[
  {en:'This is my blog.',jp:'これは私のブログです。'},{en:'I am a local guide.',jp:'私は地元のガイドです。'},{en:'I like nature very much.',jp:'私は自然がとても好きです。'},{en:'This is a local spot.',jp:'ここは地元のスポットです。'},{en:'It is beautiful.',jp:'きれいな場所です。'},{en:'I work here / as a local guide.',jp:'私はここで働いています / 地元のガイドとして'},{en:'I write / about this local spot.',jp:'私は書きます / この地元のスポットについて'},{en:'I enjoy working / as a guide.',jp:'私は働くことを楽しんでいます / ガイドとして'},{en:'I like this blog, / too.',jp:'私はこのブログが好きです / 〜もまた'},{en:'My work is interesting.',jp:'私の仕事はおもしろいです。'}
 ],52);
 setAudit(d,'Unit 5-2',[
  {en:'This is his blog.',jp:'これは彼のブログです。'},
  {en:'The blog is / about his life.',jp:'そのブログは〜です / 彼の生活について'},
  {en:'He has a beautiful dolphin picture there.',jp:'彼はそこに美しいイルカの写真を持っています。'},
  {en:'Does he like the picture?',jp:'彼はその写真が好きですか。'},
  {en:'Yes, / he does.',jp:'はい / 好きです'},
  {en:'The dolphin is / in the water.',jp:'そのイルカはいます / 水の中に'},
  {en:'He can swim.',jp:'彼は泳ぐことができます。'},
  {en:'He doesn’t surf.',jp:'彼はサーフィンをしません。'},
  {en:'Does he write / about the dolphin?',jp:'彼は書きますか / そのイルカについて'},
  {en:'Yes, / he does.',jp:'はい / 書きます'},
  {en:'The picture is very beautiful.',jp:'その写真はとても美しいです。'},
  {en:'The blog is interesting.',jp:'そのブログはおもしろいです。'}
 ],53);
 setAudit(d,'Unit 5-3',[
  {en:'My brother / and I look / at a cafe website.',jp:'兄 / そして私は見ます / カフェのウェブサイトを'},{en:'The cafe is popular.',jp:'そのカフェは人気があります。'},{en:'The owner is friendly.',jp:'そのオーナーは親切です。'},{en:'This dish is wonderful.',jp:'この料理はすばらしいです。'},{en:'A fried egg is / on top of the dish.',jp:'目玉焼きがあります / その料理の上に'},{en:'“Do you know this cafe?”',jp:'「このカフェを知っていますか。」'},{en:'“No, / I don’t.”',jp:'「いいえ / 知りません」'},{en:'“Look / at this dish.”',jp:'「見て / この料理を」'},{en:'“Wonderful!”',jp:'「すばらしい！」'},{en:'“I want / to visit the cafe.”',jp:'「私は望んでいます / そのカフェを訪れることを」'},{en:'“Great!”',jp:'「いいね！」'}
 ],54);
 setAudit(d,'Unit 6-1',[
  {en:'This is a show / from the U.K.',jp:'これはショーです / イギリスの'},{en:'This is a performer / in the show.',jp:'こちらは出演者です / そのショーの'},{en:'Do you know him?',jp:'彼を知っていますか。'},{en:'Yes, / I do.',jp:'はい / 知っています'},{en:'He is / from the U.K.',jp:'彼は〜出身です / イギリス'},{en:'I like him very much.',jp:'私は彼がとても好きです。'},{en:'Why don’t we watch the show?',jp:'そのショーを見ませんか。'},{en:'Sounds great.',jp:'楽しそうだね。'},{en:'We can watch it together.',jp:'私たちはいっしょに見ることができます。'},{en:'The show is interesting.',jp:'そのショーはおもしろいです。'}
 ],55);
 setAudit(d,'Unit 6-2',[
  {en:'This is a ticket.',jp:'これはチケットです。'},{en:'Whose ticket is this?',jp:'これはだれのチケットですか。'},{en:'Is it yours?',jp:'あなたのものですか。'},{en:'No, / it is not.',jp:'いいえ / 違います'},{en:'Maybe it is Riko’s.',jp:'たぶん理子のものです。'},{en:'Yes, / it is.',jp:'はい / そうです'},{en:'This history book is / near the ticket.',jp:'この歴史の本はあります / チケットの近くに'},{en:'It is Riko’s, / too.',jp:'これも理子のものです / 〜もまた'},{en:'Here you are, / Riko.',jp:'はい、どうぞ / 理子'},{en:'Thanks.',jp:'ありがとう。'}
 ],56);
 setAudit(d,'Unit 6-3',[
  {en:'This is a cushion.',jp:'これはクッションです。'},{en:'It is a prop / in the show.',jp:'それは小道具です / そのショーで使う'},{en:'This is a towel.',jp:'これはタオルです。'},{en:'It is a prop, / too.',jp:'それは小道具です / 〜もまた'},{en:'I use the cushion first.',jp:'私は最初にクッションを使います。'},{en:'I use the towel / after the cushion.',jp:'私はタオルを使います / クッションのあとに'},{en:'I wear casual clothes / in the show.',jp:'私はカジュアルな服を着ます / そのショーで'},{en:'Which do you like, / the cushion / or the towel?',jp:'どちらが好きですか / クッション / それともタオルが'},{en:'I like the cushion.',jp:'私はクッションが好きです。'},{en:'The cushion / and the towel are different.',jp:'クッション / そしてタオルは違います'},{en:'The show is great.',jp:'そのショーはすばらしいです。'}
 ],57);
 setAudit(d,'Unit 7-1',[
  {en:'What’s up?',jp:'どうしたの？'},{en:'Are you busy tomorrow morning?',jp:'明日の朝は忙しい？'},{en:'Yes, / I am.',jp:'はい / そうです'},{en:'I want / to practice tennis tomorrow morning.',jp:'私は望んでいます / 明日の朝テニスを練習することを'},{en:'Are you free / after school?',jp:'ひまですか / 放課後は'},{en:'Yes, / I am.',jp:'はい / そうです'},{en:'Why don’t we talk / about tennis / after school?',jp:'話しませんか / テニスについて / 放課後に'},{en:'Great!',jp:'いいね！'},{en:'I look forward / to tomorrow.',jp:'私は楽しみにしています / 明日を'}
 ],58);
 setAudit(d,'Unit 7-2',[
  {en:'Welcome / to this market.',jp:'ようこそ / この市場へ'},{en:'It is a popular place.',jp:'ここは人気のある場所です。'},{en:'I want / to buy a souvenir / for my family.',jp:'私は望んでいます / おみやげを買うことを / 家族のために'},{en:'Look / at this souvenir.',jp:'見てください / このおみやげを'},{en:'It is beautiful.',jp:'それは美しいです。'},{en:'Do you like it?',jp:'それが好きですか。'},{en:'Yes, / I do.',jp:'はい / 好きです'},{en:'Great!',jp:'いいね！'},{en:'I want / to buy it.',jp:'私は望んでいます / それを買うことを'},{en:'I like this market very much.',jp:'私はこの市場がとても好きです。'}
 ],59);
 setAudit(d,'Unit 7-3',[
  {en:'Mom, / are you free tomorrow?',jp:'お母さん / 明日はひま？'},{en:'Yes, / I am.',jp:'はい / ひまです'},{en:'Dad, / are you free tomorrow?',jp:'お父さん / 明日はひま？'},{en:'Yes, / I am.',jp:'はい / ひまです'},{en:'Great!',jp:'いいね！'},{en:'Let’s travel tomorrow.',jp:'明日、旅行しよう。'},{en:'I want / to visit a palace.',jp:'私は望んでいます / 宮殿を訪れることを'},{en:'Mom / and Dad like the plan.',jp:'お母さん / そしてお父さんもその計画が気に入っています'},{en:'Sounds exciting.',jp:'楽しそうだね。'},{en:'We’re happy.',jp:'私たちはうれしいです。'}
 ],60);
 window.V10_REFERENCE_SLASH_AUDIT={version:'2026-08-20',passagesAudited:60,total:168,lastCompleted:60,minimumRuleImageConfirmed:true};
})();
