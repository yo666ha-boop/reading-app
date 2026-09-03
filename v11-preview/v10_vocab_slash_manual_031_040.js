// Human-reviewed vocabulary/slash final audit overrides for passages 031-040.
(function(){
  const ss=window.V10_SUNSHINE_G1||{};
  const nh=window.V10_NEWHORIZON_G1||{};
  function setAudit(data,section,rows){
    const p=data[section];
    if(!p) throw new Error('Missing audited passage: '+section);
    if(rows.length!==p.sentences.length) throw new Error('Slash row count mismatch: '+section+' '+rows.length+'/'+p.sentences.length);
    p.slashRows=rows;
    p.vocabFinalAudit='PASS_REVIEWED_GATE_RECHECK_NOTES_0';
    p.slashHumanAudit='PASS_MODEL_ALIGNED';
  }

  setAudit(ss,'PROGRAM 9-2',[
    {en:'Yesterday afternoon, / my friend came to my house.',jp:'昨日の午後 / 友達が私の家に来ました'},
    {en:'My dog stayed near us.',jp:'私の犬は私たちの近くにいました。'},
    {en:'My friend took a picture / of my dog.',jp:'友達は写真を撮りました / 私の犬の'},
    {en:'I took a picture, too.',jp:'私も写真を撮りました。'},
    {en:'We took a walk / with my dog.',jp:'私たちは散歩をしました / 犬といっしょに'},
    {en:'We came back to my house.',jp:'私たちは私の家に戻りました。'},
    {en:'We read a book / at home.',jp:'私たちは本を読みました / 家で'},
    {en:'We talked about my dog.',jp:'私たちは私の犬について話しました。'},
    {en:'My friend relaxed there.',jp:'友達はそこでくつろぎました。'},
    {en:'We relaxed a lot.',jp:'私たちは大いにくつろぎました。'}
  ]);

  setAudit(ss,'PROGRAM 9-3',[
    {en:'Last night, / I went to my friend’s house.',jp:'昨夜 / 私は友達の家へ行きました'},
    {en:'We had a good time.',jp:'私たちは楽しい時間を過ごしました。'},
    {en:'We played a game.',jp:'私たちはゲームをしました。'},
    {en:'My friend played well.',jp:'友達は上手にプレーしました。'},
    {en:'I didn’t win the game.',jp:'私はそのゲームに勝ちませんでした。'},
    {en:'We read a book.',jp:'私たちは本を読みました。'},
    {en:'We talked about the game.',jp:'私たちはそのゲームについて話しました。'},
    {en:'I didn’t sleep there.',jp:'私はそこで寝ませんでした。'},
    {en:'I went home / at night.',jp:'私は家へ帰りました / 夜に'},
    {en:'I relaxed / at home.',jp:'私はくつろぎました / 家で'}
  ]);

  setAudit(ss,'PROGRAM 9-4',[
    {en:'Last winter, / I visited Finland / with my family.',jp:'この前の冬 / 私はフィンランドを訪れました / 家族といっしょに'},
    {en:'One night, / I went outside.',jp:'ある夜 / 私は外へ出ました'},
    {en:'I found a reindeer / near the road.',jp:'私はトナカイを見つけました / 道路の近くで'},
    {en:'I ran to my family.',jp:'私は家族のところへ走りました。'},
    {en:'We went outside together.',jp:'私たちはいっしょに外へ出ました。'},
    {en:'The reindeer stayed near the road.',jp:'そのトナカイは道路の近くにいました。'},
    {en:'We watched it / at night.',jp:'私たちはそれを見ました / 夜に'},
    {en:'Then / it went down the road.',jp:'それから / トナカイは道を下って行きました'},
    {en:'We went back to our house.',jp:'私たちは家に戻りました。'},
    {en:'I slept / after midnight.',jp:'私は寝ました / 真夜中のあとに'},
    {en:'The next morning, / I talked about the experience.',jp:'次の朝 / 私はその体験について話しました'},
    {en:'I liked the winter trip a lot.',jp:'私は冬の旅行がとても気に入りました。'}
  ]);

  setAudit(ss,'PROGRAM 10-1',[
    {en:'Yesterday, / I was tired.',jp:'昨日 / 私は疲れていました'},
    {en:'My grandma was at home / with me.',jp:'祖母が家にいました / 私といっしょに'},
    {en:'I had homework.',jp:'私は宿題がありました。'},
    {en:'I was sleepy, too.',jp:'眠くもありました。'},
    {en:'My grandma had an idea.',jp:'祖母には考えがありました。'},
    {en:'“Let’s finish the homework together.”',jp:'「いっしょに宿題を終わらせよう。」'},
    {en:'“Great!”',jp:'「いいね！」'},
    {en:'We finished my homework together.',jp:'私たちはいっしょに宿題を終えました。'},
    {en:'Then / we talked about my school.',jp:'それから / 私たちは学校について話しました'},
    {en:'I was happy.',jp:'私はうれしかったです。'},
    {en:'It was a great evening.',jp:'すばらしい夕方でした。'}
  ]);

  setAudit(ss,'PROGRAM 10-2',[
    {en:'Yesterday, / my friend and I were at the theater.',jp:'昨日 / 友達と私は劇場にいました'},
    {en:'The theater wasn’t busy.',jp:'劇場は混んでいませんでした。'},
    {en:'It was quiet.',jp:'静かでした。'},
    {en:'We watched a movie.',jp:'私たちは映画を見ました。'},
    {en:'The movie was interesting.',jp:'その映画はおもしろかったです。'},
    {en:'We had a good time.',jp:'私たちは楽しい時間を過ごしました。'},
    {en:'After the movie, / we talked about it.',jp:'映画のあと / 私たちはその映画について話しました'},
    {en:'We went home together.',jp:'私たちはいっしょに家へ帰りました。'},
    {en:'I was happy.',jp:'私はうれしかったです。'},
    {en:'It was a great evening.',jp:'すばらしい夕方でした。'}
  ]);

  setAudit(ss,'PROGRAM 10-3',[
    {en:'Last night, / I was at home.',jp:'昨夜 / 私は家にいました'},
    {en:'I read a comic story.',jp:'マンガの物語を読みました。'},
    {en:'The story was about a detective.',jp:'その物語は探偵についてのものでした。'},
    {en:'At seven, / my friend called me.',jp:'7時に / 友達が私に電話をしました'},
    {en:'I was surprised.',jp:'私は驚きました。'},
    {en:'We talked about the comic story.',jp:'私たちはそのマンガの物語について話しました。'},
    {en:'We talked about the detective, too.',jp:'探偵についても話しました。'},
    {en:'Then / I read the story again.',jp:'それから / 私はその物語をもう一度読みました'},
    {en:'I was happy.',jp:'私はうれしかったです。'},
    {en:'It was a good night.',jp:'よい夜でした。'}
  ]);

  setAudit(ss,'PROGRAM 10-4',[
    {en:'Last winter, / my family and I were in a snowy town.',jp:'この前の冬 / 家族と私は雪の多い町にいました'},
    {en:'We got on a sleigh.',jp:'私たちはそりに乗りました。'},
    {en:'We started / on a hill.',jp:'私たちは出発しました / 丘から'},
    {en:'The sleigh went down a slope.',jp:'そりは坂を下りました。'},
    {en:'The speed increased.',jp:'スピードが増しました。'},
    {en:'Bang!',jp:'バン！'},
    {en:'The sleigh broke.',jp:'そりが壊れました。'},
    {en:'It was terrible.',jp:'ひどい状態でした。'},
    {en:'We walked to our house.',jp:'私たちは自分たちの家まで歩きました。'},
    {en:'We reached the house.',jp:'その家に着きました。'},
    {en:'The house was warm.',jp:'家は暖かかったです。'},
    {en:'Finally, / we were warm and safe.',jp:'ついに / 私たちは暖かく安全な状態になりました'}
  ]);

  setAudit(ss,'Step 6 / Our Project 3 / Power-Up 6',[
    {en:'Dear Anna,',jp:'親愛なるアンナへ'},
    {en:'I want to tell you / about my school performance.',jp:'私はあなたに伝えたいです / 私の学校の発表会について'},
    {en:'In February, / I went to the performance.',jp:'2月に / 私はその発表会へ行きました'},
    {en:'It was my first performance.',jp:'それは私にとって初めての発表会でした。'},
    {en:'I was nervous.',jp:'私は緊張していました。'},
    {en:'My friend was nervous, too.',jp:'友達も緊張していました。'},
    {en:'The performance was creative and exciting.',jp:'その発表会は創造的で、わくわくするものでした。'},
    {en:'After the performance, / we took a shot.',jp:'発表会のあと / 私たちは写真を1枚撮りました'},
    {en:'I have a card from the performance / for you.',jp:'私はその発表会のカードを持っています / あなたのために'},
    {en:'I want to show it to you.',jp:'それをあなたに見せたいです。'},
    {en:'I miss you.',jp:'あなたがいなくてさびしいです。'},
    {en:'It was a great day.',jp:'すばらしい一日でした。'},
    {en:'Best wishes,',jp:'幸運を祈ります'}
  ]);

  setAudit(nh,'Unit 0',[
    {en:'Ken: Good morning.',jp:'ケン「おはよう。」'},
    {en:'Mei: Hi.',jp:'メイ「こんにちは。」'},
    {en:'Ken: I’m Ken.',jp:'ケン「ぼくはケンです。」'},
    {en:'Mei: I’m Mei.',jp:'メイ「私はメイです。」'},
    {en:'Ken: Nice to meet you.',jp:'ケン「はじめまして。」'},
    {en:'Ken: Do you like tennis?',jp:'ケン「テニスは好きですか。」'},
    {en:'Mei: Yes, I do.',jp:'メイ「はい、好きです。」'},
    {en:'Ken: I like tennis.',jp:'ケン「ぼくはテニスが好きです。」'},
    {en:'Mei: Do you play tennis?',jp:'メイ「テニスをしますか。」'},
    {en:'Ken: Yes, I do.',jp:'ケン「はい、します。」'}
  ]);

  setAudit(nh,'Unit 1-1',[
    {en:'Hello, everyone.',jp:'こんにちは、みなさん。'},
    {en:'I’m Leonardo.',jp:'ぼくはレオナルドです。'},
    {en:'Call me Leo.',jp:'レオと呼んでください。'},
    {en:'I’m twelve.',jp:'12歳です。'},
    {en:'I’m from South Africa.',jp:'南アフリカ共和国出身です。'},
    {en:'I love Japanese sweets.',jp:'日本の甘いお菓子が大好きです。'},
    {en:'I love tennis, too.',jp:'テニスも大好きです。'},
    {en:'I want to join the tennis club.',jp:'テニス部に入りたいです。'},
    {en:'Nice to meet you.',jp:'はじめまして。'}
  ]);

  window.V10_VOCAB_SLASH_MANUAL_031_040={passages:10,vocabAudited:10,slashAudited:10,notes:0};
})();
