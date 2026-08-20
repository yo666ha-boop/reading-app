// Human-reviewed vocabulary/slash final audit overrides for passages 041-050.
(function(){
  const nh=window.V10_NEWHORIZON_G1||{};
  function setAudit(section,rows){
    const p=nh[section];
    if(!p) throw new Error('Missing audited passage: '+section);
    if(rows.length!==p.sentences.length) throw new Error('Slash row count mismatch: '+section+' '+rows.length+'/'+p.sentences.length);
    p.slashRows=rows;
    p.vocabFinalAudit='PASS_REVIEWED_GATE_RECHECK_NOTES_0';
    p.slashHumanAudit='PASS_MODEL_ALIGNED';
  }

  setAudit('Unit 1-2',[
    {en:'Do you like rugby?',jp:'ラグビーは好きですか。'},
    {en:'Yes, I do.',jp:'はい、好きです。'},
    {en:'I’m a rugby fan, too.',jp:'私もラグビーファンです。'},
    {en:'I often watch rugby / with my friends.',jp:'私はよくラグビーを見ます / 友達といっしょに'},
    {en:'Do you play rugby?',jp:'ラグビーをしますか。'},
    {en:'No, I don’t.',jp:'いいえ、しません。'},
    {en:'But / I play soccer.',jp:'でも / 私はサッカーをします'},
    {en:'Oh, / I play soccer, too.',jp:'ああ / 私もサッカーをします'},
    {en:'We can play soccer together.',jp:'私たちはいっしょにサッカーができます。'}
  ]);

  setAudit('Unit 1-3',[
    {en:'Do you like comics?',jp:'マンガは好きですか。'},
    {en:'Yes, I do.',jp:'はい、好きです。'},
    {en:'I draw comics, too.',jp:'私はマンガもかきます。'},
    {en:'Wow!',jp:'わあ！'},
    {en:'I’m an anime fan, too.',jp:'私はアニメのファンでもあります。'},
    {en:'Are you in the art club?',jp:'美術部に入っていますか。'},
    {en:'Yes, I am.',jp:'はい、入っています。'},
    {en:'How about you?',jp:'あなたはどうですか。'},
    {en:'I’m not in a school club / now.',jp:'私は学校の部活には入っていません / 今は'},
    {en:'But / I take swimming lessons.',jp:'でも / 私は水泳のレッスンを受けています'},
    {en:'I see.',jp:'なるほど。'}
  ]);

  setAudit('Unit 2-1',[
    {en:'This is Ms. Brown.',jp:'こちらはブラウン先生です。'},
    {en:'She’s our new teacher.',jp:'彼女は私たちの新しい先生です。'},
    {en:'She’s from Canada.',jp:'カナダ出身です。'},
    {en:'She’s cool.',jp:'かっこいい先生です。'},
    {en:'This is Leo.',jp:'こちらはレオです。'},
    {en:'He’s in our class.',jp:'彼は私たちのクラスにいます。'},
    {en:'He’s from America.',jp:'アメリカ出身です。'},
    {en:'He’s on our tennis team.',jp:'彼は私たちのテニスチームの一員です。'},
    {en:'He’s good at tennis.',jp:'彼はテニスが得意です。'},
    {en:'I’m on the tennis team, too.',jp:'私もそのテニスチームの一員です。'},
    {en:'Our team is cool.',jp:'私たちのチームはかっこいいです。'}
  ]);

  setAudit('Unit 2-2',[
    {en:'This is my father.',jp:'こちらは私の父です。'},
    {en:'He’s from China.',jp:'父は中国出身です。'},
    {en:'He can make Chinese food / very well.',jp:'父は中国料理を作ることができます / とても上手に'},
    {en:'Do you like Chinese food?',jp:'中国料理は好きですか。'},
    {en:'Yes, I do.',jp:'はい、好きです。'},
    {en:'Can you make Chinese food?',jp:'中国料理を作ることができますか。'},
    {en:'No, I can’t.',jp:'いいえ、できません。'},
    {en:'My father can.',jp:'私の父はできます。'},
    {en:'Really?',jp:'本当？'},
    {en:'Yes.',jp:'うん。'},
    {en:'That’s cool.',jp:'それはかっこいいね。'}
  ]);

  setAudit('Unit 2-3',[
    {en:'Oops!',jp:'おっと！'},
    {en:'Excuse me.',jp:'すみません。'},
    {en:'Is this your English book?',jp:'これはあなたの英語の本ですか。'},
    {en:'Yes, it is.',jp:'はい、そうです。'},
    {en:'Is this your notebook, too?',jp:'これもあなたのノートですか。'},
    {en:'Yes, it is.',jp:'はい、そうです。'},
    {en:'Here you are.',jp:'はい、どうぞ。'},
    {en:'Thank you.',jp:'ありがとう。'},
    {en:'You’re welcome.',jp:'どういたしまして。'}
  ]);

  setAudit('Unit 3-1',[
    {en:'What’s your favorite character?',jp:'あなたのいちばん好きな登場人物はだれですか。'},
    {en:'My favorite character is Hana.',jp:'私のいちばん好きな登場人物はハナです。'},
    {en:'Who’s Hana?',jp:'ハナってだれですか。'},
    {en:'She’s a character / in this comic.',jp:'彼女は登場人物です / このマンガの中の'},
    {en:'She’s kind.',jp:'彼女はやさしいです。'},
    {en:'She’s also brave.',jp:'それに勇かんです。'},
    {en:'She’s interesting and cool.',jp:'彼女はおもしろくて、かっこいいです。'},
    {en:'Why is she your favorite character?',jp:'なぜ彼女がいちばん好きな登場人物なのですか。'},
    {en:'She’s kind and brave.',jp:'彼女はやさしくて勇かんです。'},
    {en:'I see.',jp:'なるほど。'}
  ]);

  setAudit('Unit 3-2',[
    {en:'When do you study English?',jp:'いつ英語を勉強しますか。'},
    {en:'I study English / after school.',jp:'私は英語を勉強します / 放課後に'},
    {en:'Do you study online?',jp:'オンラインで勉強しますか。'},
    {en:'Yes, I do.',jp:'はい、します。'},
    {en:'I study online / with my friend.',jp:'私はオンラインで勉強します / 友達と'},
    {en:'We study English together.',jp:'私たちはいっしょに英語を勉強します。'},
    {en:'After school, / I walk home / with my friend.',jp:'放課後 / 私は家まで歩きます / 友達と'},
    {en:'We talk about English.',jp:'私たちは英語について話します。'},
    {en:'I like our study time.',jp:'私は私たちの勉強時間が好きです。'}
  ]);

  setAudit('Unit 3-3',[
    {en:'Where do you practice tennis?',jp:'どこでテニスを練習しますか。'},
    {en:'I practice tennis / near the park.',jp:'私はテニスを練習します / 公園の近くで'},
    {en:'The park is near the station.',jp:'その公園は駅の近くです。'},
    {en:'I go there / after school.',jp:'私はそこへ行きます / 放課後に'},
    {en:'I practice / with my friend.',jp:'私は練習します / 友達と'},
    {en:'We practice hard.',jp:'私たちは一生懸命練習します。'},
    {en:'I want to win.',jp:'私は勝ちたいです。'},
    {en:'Good luck.',jp:'がんばって。'},
    {en:'Thank you.',jp:'ありがとう。'}
  ]);

  setAudit('Unit 4-1',[
    {en:'This is a picture / from New Zealand.',jp:'これは写真です / ニュージーランドの'},
    {en:'A puppy is in the picture.',jp:'写真の中に子イヌがいます。'},
    {en:'A cat is in the picture, too.',jp:'ネコも写真の中にいます。'},
    {en:'They are small.',jp:'どちらも小さいです。'},
    {en:'They are animals.',jp:'どちらも動物です。'},
    {en:'I like the puppy and the cat.',jp:'私はその子イヌとネコが好きです。'},
    {en:'I want to visit New Zealand / someday.',jp:'私はニュージーランドを訪れたいです / いつか'},
    {en:'New Zealand is interesting.',jp:'ニュージーランドはおもしろそうです。'}
  ]);

  setAudit('Unit 4-2',[
    {en:'Basketball is my favorite sport.',jp:'バスケットボールは私のいちばん好きなスポーツです。'},
    {en:'I practice basketball / in the afternoon.',jp:'私はバスケットボールを練習します / 午後に'},
    {en:'My friend and I practice together.',jp:'友達と私はいっしょに練習します。'},
    {en:'We practice hard.',jp:'私たちは一生懸命練習します。'},
    {en:'We want to win.',jp:'私たちは勝ちたいです。'},
    {en:'We like basketball very much.',jp:'私たちはバスケットボールがとても好きです。'},
    {en:'We will practice again / tomorrow.',jp:'私たちはまた練習します / 明日'},
    {en:'Basketball is great.',jp:'バスケットボールはすばらしいです。'}
  ]);

  window.V10_VOCAB_SLASH_MANUAL_041_050={passages:10,vocabAudited:10,slashAudited:10,notes:0};
})();