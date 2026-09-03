// Reference/minimum-rule slash audit passages 041-050.
(function(){
 const PASS='PASS_REFERENCE_20260820';
 function setAudit(data,section,rows,n){const p=data&&data[section];if(!p)throw new Error('Missing reference passage '+n+': '+section);if(rows.length!==(p.sentences||[]).length)throw new Error('Row mismatch '+n);for(let i=0;i<rows.length;i++){const e=String(rows[i].en||'').replace(/\s*\/\s*/g,' ').replace(/\s+/g,' ').trim(),s=String(p.sentences[i]||'').replace(/\s+/g,' ').trim();if(e!==s)throw new Error('English mismatch '+n+'#'+(i+1)+': '+e+' <> '+s);const ec=String(rows[i].en||'').split(/\s*\/\s*/).filter(Boolean).length,jc=String(rows[i].jp||'').split(/\s*\/\s*/).filter(Boolean).length;if(ec!==jc)throw new Error('EN/JP chunks '+n+'#'+(i+1)+' '+ec+'/'+jc)}p.slashRows=rows;p.slashReadingVersion='reference-book-minimum-rules-20260820';p.slashReferenceAudit=PASS;p.slashReferencePassageNo=n}
 const d=window.V10_NEWHORIZON_G1||{};
 setAudit(d,'Unit 1-2',[
  {en:'Do you like rugby?',jp:'ラグビーは好きですか。'},
  {en:'Yes, / I do.',jp:'はい / 好きです'},
  {en:'I’m a rugby fan, / too.',jp:'私はラグビーファンです / 〜もまた'},
  {en:'I often watch rugby / with my friends.',jp:'私はよくラグビーを見ます / 友達といっしょに'},
  {en:'Do you play rugby?',jp:'ラグビーをしますか。'},
  {en:'No, / I don’t.',jp:'いいえ / しません'},
  {en:'But / I play soccer.',jp:'でも / 私はサッカーをします'},
  {en:'Oh, / I play soccer, / too.',jp:'ああ / 私はサッカーをします / 〜もまた'},
  {en:'We can play soccer together.',jp:'私たちはいっしょにサッカーができます。'}
 ],41);
 setAudit(d,'Unit 1-3',[
  {en:'Do you like comics?',jp:'マンガは好きですか。'},
  {en:'Yes, / I do.',jp:'はい / 好きです'},
  {en:'I draw comics, / too.',jp:'私はマンガをかきます / 〜もまた'},
  {en:'Wow!',jp:'わあ！'},
  {en:'I’m an anime fan, / too.',jp:'私はアニメのファンです / 〜もまた'},
  {en:'Are you / in the art club?',jp:'あなたはいますか / 美術部に'},
  {en:'Yes, / I am.',jp:'はい / 入っています'},
  {en:'How about you?',jp:'あなたはどうですか。'},
  {en:'I’m not / in a school club now.',jp:'私は入っていません / 今、学校の部活に'},
  {en:'But / I take swimming lessons.',jp:'でも / 私は水泳のレッスンを受けています'},
  {en:'I see.',jp:'なるほど。'}
 ],42);
 setAudit(d,'Unit 2-1',[
  {en:'This is Ms. Brown.',jp:'こちらはブラウン先生です。'},
  {en:'She’s our new teacher.',jp:'彼女は私たちの新しい先生です。'},
  {en:'She’s / from Canada.',jp:'彼女は〜出身です / カナダ'},
  {en:'She’s cool.',jp:'彼女はかっこいいです。'},
  {en:'This is Leo.',jp:'こちらはレオです。'},
  {en:'He’s / in our class.',jp:'彼はいます / 私たちのクラスに'},
  {en:'He’s / from America.',jp:'彼は〜出身です / アメリカ'},
  {en:'He’s / on our tennis team.',jp:'彼は一員です / 私たちのテニスチームの'},
  {en:'He’s good / at tennis.',jp:'彼は得意です / テニスが'},
  {en:'I’m / on the tennis team, / too.',jp:'私も一員です / そのテニスチームの / 〜もまた'},
  {en:'Our team is cool.',jp:'私たちのチームはかっこいいです。'}
 ],43);
 setAudit(d,'Unit 2-2',[
  {en:'This is my father.',jp:'こちらは私の父です。'},
  {en:'He’s / from China.',jp:'彼は〜出身です / 中国'},
  {en:'He can make Chinese food very well.',jp:'彼は中国料理をとても上手に作ることができます。'},
  {en:'Do you like Chinese food?',jp:'中国料理は好きですか。'},
  {en:'Yes, / I do.',jp:'はい / 好きです'},
  {en:'Can you make Chinese food?',jp:'中国料理を作ることができますか。'},
  {en:'No, / I can’t.',jp:'いいえ / できません'},
  {en:'My father can.',jp:'私の父はできます。'},
  {en:'Really?',jp:'本当？'},
  {en:'Yes.',jp:'うん。'},
  {en:'That’s cool.',jp:'それはかっこいいね。'}
 ],44);
 setAudit(d,'Unit 2-3',[
  {en:'Oops!',jp:'おっと！'},
  {en:'Excuse me.',jp:'すみません。'},
  {en:'Is this your English book?',jp:'これはあなたの英語の本ですか。'},
  {en:'Yes, / it is.',jp:'はい / そうです'},
  {en:'Is this your notebook, / too?',jp:'これもあなたのノートですか / 〜もまた'},
  {en:'Yes, / it is.',jp:'はい / そうです'},
  {en:'Here you are.',jp:'はい、どうぞ。'},
  {en:'Thank you.',jp:'ありがとう。'},
  {en:'You’re welcome.',jp:'どういたしまして。'}
 ],45);
 setAudit(d,'Unit 3-1',[
  {en:'What’s your favorite character?',jp:'あなたのいちばん好きな登場人物はだれですか。'},
  {en:'My favorite character is Hana.',jp:'私のいちばん好きな登場人物はハナです。'},
  {en:'Who’s Hana?',jp:'ハナってだれですか。'},
  {en:'She’s a character / in this comic.',jp:'彼女は登場人物です / このマンガの中の'},
  {en:'She’s kind.',jp:'彼女はやさしいです。'},
  {en:'She’s also brave.',jp:'彼女はさらに勇かんです。'},
  {en:'She’s interesting / and cool.',jp:'彼女はおもしろいです / そしてかっこいいです'},
  {en:'Why is she your favorite character?',jp:'なぜ彼女がいちばん好きな登場人物なのですか。'},
  {en:'She’s kind / and brave.',jp:'彼女はやさしいです / そして勇かんです'},
  {en:'I see.',jp:'なるほど。'}
 ],46);
 setAudit(d,'Unit 3-2',[
  {en:'When do you study English?',jp:'いつ英語を勉強しますか。'},
  {en:'I study English / after school.',jp:'私は英語を勉強します / 放課後に'},
  {en:'Do you study online?',jp:'オンラインで勉強しますか。'},
  {en:'Yes, / I do.',jp:'はい / します'},
  {en:'I study online / with my friend.',jp:'私はオンラインで勉強します / 友達と'},
  {en:'We study English together.',jp:'私たちはいっしょに英語を勉強します。'},
  {en:'After school, / I walk home / with my friend.',jp:'放課後 / 私は家まで歩きます / 友達と'},
  {en:'We talk / about English.',jp:'私たちは話します / 英語について'},
  {en:'I like our study time.',jp:'私は私たちの勉強時間が好きです。'}
 ],47);
 setAudit(d,'Unit 3-3',[
  {en:'Where do you practice tennis?',jp:'どこでテニスを練習しますか。'},
  {en:'I practice tennis / near the park.',jp:'私はテニスを練習します / 公園の近くで'},
  {en:'The park is / near the station.',jp:'その公園はあります / 駅の近くに'},
  {en:'I go there / after school.',jp:'私はそこへ行きます / 放課後に'},
  {en:'I practice / with my friend.',jp:'私は練習します / 友達と'},
  {en:'We practice hard.',jp:'私たちは一生懸命練習します。'},
  {en:'I want / to win.',jp:'私は望んでいます / 勝つことを'},
  {en:'Good luck.',jp:'がんばって。'},
  {en:'Thank you.',jp:'ありがとう。'}
 ],48);
 setAudit(d,'Unit 4-1',[
  {en:'This is a puppy.',jp:'これは子イヌです。'},
  {en:'This is a cat, / too.',jp:'こちらはネコです / 〜もまた'},
  {en:'They are small.',jp:'どちらも小さいです。'},
  {en:'I like the puppy.',jp:'私はその子イヌが好きです。'},
  {en:'I like the cat, / too.',jp:'私はネコが好きです / 〜もまた'},
  {en:'They are / in New Zealand.',jp:'2匹はいます / ニュージーランドに'},
  {en:'I want / to visit New Zealand someday.',jp:'私は望んでいます / いつかニュージーランドを訪れることを'},
  {en:'New Zealand is interesting.',jp:'ニュージーランドはおもしろそうです。'}
 ],49);
 setAudit(d,'Unit 4-2',[
  {en:'Basketball is my favorite sport.',jp:'バスケットボールは私のいちばん好きなスポーツです。'},
  {en:'I practice basketball / in the afternoon.',jp:'私はバスケットボールを練習します / 午後に'},
  {en:'My friend / and I practice basketball.',jp:'私の友達 / そして私はバスケットボールを練習します'},
  {en:'We practice / near the park.',jp:'私たちは練習します / 公園の近くで'},
  {en:'We practice hard.',jp:'私たちは一生懸命練習します。'},
  {en:'We want / to win.',jp:'私たちは望んでいます / 勝つことを'},
  {en:'We like basketball.',jp:'私たちはバスケットボールが好きです。'},
  {en:'Basketball is great.',jp:'バスケットボールはすばらしいです。'}
 ],50);
 window.V10_REFERENCE_SLASH_AUDIT={version:'2026-08-20',passagesAudited:50,total:168,lastCompleted:50,minimumRuleImageConfirmed:true};
})();
