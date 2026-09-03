// Reference/minimum-rule slash audit passages 031-040.
(function(){
 const PASS='PASS_REFERENCE_20260820';
 function setAudit(data,section,rows,n){const p=data&&data[section];if(!p)throw new Error('Missing reference passage '+n+': '+section);if(rows.length!==(p.sentences||[]).length)throw new Error('Row mismatch '+n+' '+rows.length+'/'+((p.sentences||[]).length));for(let i=0;i<rows.length;i++){const e=String(rows[i].en||'').replace(/\s*\/\s*/g,' ').replace(/\s+/g,' ').trim(),s=String(p.sentences[i]||'').replace(/\s+/g,' ').trim();if(e!==s)throw new Error('English mismatch '+n+'#'+(i+1)+': '+e+' <> '+s);const ec=String(rows[i].en||'').split(/\s*\/\s*/).filter(Boolean).length,jc=String(rows[i].jp||'').split(/\s*\/\s*/).filter(Boolean).length;if(ec!==jc)throw new Error('EN/JP chunks '+n+'#'+(i+1)+' '+ec+'/'+jc)}p.slashRows=rows;p.slashReadingVersion='reference-book-minimum-rules-20260820';p.slashReferenceAudit=PASS;p.slashReferencePassageNo=n}
 const s=window.V10_SUNSHINE_G1||{}, n=window.V10_NEWHORIZON_G1||{};
 setAudit(s,'PROGRAM 9-2',[
  {en:'Yesterday afternoon, / my friend came / to my house.',jp:'昨日の午後 / 友達が来ました / 私の家へ'},
  {en:'My dog stayed / near us.',jp:'私の犬はいました / 私たちの近くに'},
  {en:'My friend took a picture / of my dog.',jp:'友達は写真を撮りました / 私の犬の'},
  {en:'I took a picture, / too.',jp:'私も写真を撮りました / 〜もまた'},
  {en:'We took a walk / with my dog.',jp:'私たちは散歩しました / 私の犬と'},
  {en:'We came back / to my house.',jp:'私たちは戻りました / 私の家へ'},
  {en:'We read a book / at home.',jp:'私たちは本を読みました / 家で'},
  {en:'We talked / about my dog.',jp:'私たちは話しました / 私の犬について'},
  {en:'My friend relaxed there.',jp:'友達はそこでくつろぎました。'},
  {en:'We relaxed a lot.',jp:'私たちは大いにくつろぎました。'}
 ],31);
 setAudit(s,'PROGRAM 9-3',[
  {en:'Last night, / I went / to my friend’s house.',jp:'昨夜 / 私は行きました / 友達の家へ'},
  {en:'We had a good time.',jp:'私たちは楽しい時間を過ごしました。'},
  {en:'We played a game.',jp:'私たちはゲームをしました。'},
  {en:'My friend played well.',jp:'友達は上手にプレーしました。'},
  {en:'I didn’t win the game.',jp:'私はそのゲームに勝ちませんでした。'},
  {en:'We read a book.',jp:'私たちは本を読みました。'},
  {en:'We talked / about the game.',jp:'私たちは話しました / そのゲームについて'},
  {en:'I didn’t sleep there.',jp:'私はそこで寝ませんでした。'},
  {en:'I went home / at night.',jp:'私は家へ帰りました / 夜に'},
  {en:'I relaxed / at home.',jp:'私はくつろぎました / 家で'}
 ],32);
 setAudit(s,'PROGRAM 9-4',[
  {en:'Last winter, / I visited Finland / with my family.',jp:'この前の冬 / 私はフィンランドを訪れました / 家族と'},
  {en:'One night, / I went outside.',jp:'ある夜 / 私は外へ出ました'},
  {en:'I found a reindeer / near the road.',jp:'私はトナカイを見つけました / 道路の近くで'},
  {en:'I ran / to my family.',jp:'私は走りました / 家族のところへ'},
  {en:'We went outside together.',jp:'私たちはいっしょに外へ出ました。'},
  {en:'The reindeer stayed / near the road.',jp:'そのトナカイはいました / 道路の近くに'},
  {en:'We watched it / at night.',jp:'私たちはそれを見ました / 夜に'},
  {en:'Then it went down the road.',jp:'それからトナカイは道を下って行きました。'},
  {en:'We went back / to our house.',jp:'私たちは戻りました / 私たちの家へ'},
  {en:'I slept / after midnight.',jp:'私は寝ました / 真夜中のあとに'},
  {en:'The next morning, / I talked / about the experience.',jp:'次の朝 / 私は話しました / その体験について'},
  {en:'I liked the winter trip a lot.',jp:'私は冬の旅行がとても気に入りました。'}
 ],33);
 setAudit(s,'PROGRAM 10-1',[
  {en:'Yesterday, / I was tired.',jp:'昨日 / 私は疲れていました'},
  {en:'My grandma was / at home / with me.',jp:'祖母がいました / 家で / 私といっしょに'},
  {en:'I had homework.',jp:'私は宿題がありました。'},
  {en:'I was sleepy, / too.',jp:'私は眠かったです / 〜もまた'},
  {en:'My grandma had an idea.',jp:'祖母には考えがありました。'},
  {en:'“Let’s finish the homework together.”',jp:'「いっしょに宿題を終わらせよう。」'},
  {en:'“Great!”',jp:'「いいね！」'},
  {en:'We finished my homework together.',jp:'私たちはいっしょに宿題を終えました。'},
  {en:'Then we talked / about my school.',jp:'それから私たちは話しました / 私の学校について'},
  {en:'I was happy.',jp:'私はうれしかったです。'},
  {en:'It was a great evening.',jp:'すばらしい夕方でした。'}
 ],34);
 setAudit(s,'PROGRAM 10-2',[
  {en:'Yesterday, / my friend / and I were / at the theater.',jp:'昨日 / 私の友達 / そして私はいました / 劇場に'},
  {en:'The theater wasn’t busy.',jp:'劇場は混んでいませんでした。'},
  {en:'It was quiet.',jp:'静かでした。'},
  {en:'We watched a movie.',jp:'私たちは映画を見ました。'},
  {en:'The movie was interesting.',jp:'その映画はおもしろかったです。'},
  {en:'We had a good time.',jp:'私たちは楽しい時間を過ごしました。'},
  {en:'After the movie, / we talked / about it.',jp:'映画のあと / 私たちは話しました / それについて'},
  {en:'We went home together.',jp:'私たちはいっしょに家へ帰りました。'},
  {en:'I was happy.',jp:'私はうれしかったです。'},
  {en:'It was a great evening.',jp:'すばらしい夕方でした。'}
 ],35);
 setAudit(s,'PROGRAM 10-3',[
  {en:'Last night, / I was / at home.',jp:'昨夜 / 私はいました / 家に'},
  {en:'I read a comic story.',jp:'私はマンガの物語を読みました。'},
  {en:'The story was / about a detective.',jp:'その物語は〜でした / 探偵についての'},
  {en:'At seven, / my friend called me.',jp:'7時に / 友達が私に電話をしました'},
  {en:'I was surprised.',jp:'私は驚きました。'},
  {en:'We talked / about the comic story.',jp:'私たちは話しました / そのマンガの物語について'},
  {en:'We talked / about the detective, / too.',jp:'私たちは話しました / 探偵について / 〜もまた'},
  {en:'Then I read the story again.',jp:'それから私はその物語をもう一度読みました。'},
  {en:'I was happy.',jp:'私はうれしかったです。'},
  {en:'It was a good night.',jp:'よい夜でした。'}
 ],36);
 setAudit(s,'PROGRAM 10-4',[
  {en:'Last winter, / my family / and I were / in a snowy town.',jp:'この前の冬 / 私の家族 / そして私はいました / 雪の多い町に'},
  {en:'We got / on a sleigh.',jp:'私たちは乗りました / そりに'},
  {en:'We started / on a hill.',jp:'私たちは出発しました / 丘で'},
  {en:'The sleigh went down a slope.',jp:'そのそりは坂を下りました。'},
  {en:'The speed increased.',jp:'スピードが増しました。'},
  {en:'Bang!',jp:'バン！'},
  {en:'The sleigh broke.',jp:'そのそりは壊れました。'},
  {en:'It was terrible.',jp:'ひどい状態でした。'},
  {en:'We walked / to our house.',jp:'私たちは歩きました / 私たちの家まで'},
  {en:'We reached the house.',jp:'私たちはその家に着きました。'},
  {en:'The house was warm.',jp:'家は暖かかったです。'},
  {en:'Finally, / we were warm / and safe.',jp:'ついに / 私たちは暖まりました / そして安全でした'}
 ],37);
 setAudit(s,'Step 6 / Our Project 3 / Power-Up 6',[
  {en:'Dear Anna,',jp:'親愛なるアンナへ'},
  {en:'I want / to tell you / about my school performance.',jp:'私は望んでいます / あなたに伝えることを / 私の学校の発表会について'},
  {en:'In February, / I went / to the performance.',jp:'2月に / 私は行きました / その発表会へ'},
  {en:'It was my first performance.',jp:'それは私にとって初めての発表会でした。'},
  {en:'I was nervous.',jp:'私は緊張していました。'},
  {en:'My friend was nervous, / too.',jp:'友達は緊張していました / 〜もまた'},
  {en:'The performance was creative / and exciting.',jp:'その発表会は創造的でした / そしてわくわくするものでした'},
  {en:'After the performance, / we took a shot.',jp:'発表会のあと / 私たちは写真を1枚撮りました'},
  {en:'I have a card / from the performance / for you.',jp:'私はカードを持っています / その発表会の / あなたのために'},
  {en:'I want / to show it / to you.',jp:'私は望んでいます / それを見せることを / あなたに'},
  {en:'I miss you.',jp:'あなたがいなくてさびしいです。'},
  {en:'It was a great day.',jp:'すばらしい一日でした。'},
  {en:'Best wishes,',jp:'幸運を祈ります'}
 ],38);
 setAudit(n,'Unit 0',[
  {en:'Ken: Good morning.',jp:'ケン：おはよう。'},
  {en:'Mei: Hi.',jp:'メイ：こんにちは。'},
  {en:'Ken: I’m Ken.',jp:'ケン：ぼくはケンです。'},
  {en:'Mei: I’m Mei.',jp:'メイ：私はメイです。'},
  {en:'Ken: Nice / to meet you.',jp:'ケン：うれしいです / あなたに会えて'},
  {en:'Ken: Do you like tennis?',jp:'ケン：テニスは好きですか。'},
  {en:'Mei: Yes, / I do.',jp:'メイ：はい / 好きです'},
  {en:'Ken: I like tennis.',jp:'ケン：ぼくはテニスが好きです。'},
  {en:'Mei: Do you play tennis?',jp:'メイ：テニスをしますか。'},
  {en:'Ken: Yes, / I do.',jp:'ケン：はい / します'}
 ],39);
 setAudit(n,'Unit 1-1',[
  {en:'Hello, / everyone.',jp:'こんにちは / みなさん'},
  {en:'I’m Leonardo.',jp:'ぼくはレオナルドです。'},
  {en:'Call me Leo.',jp:'レオと呼んでください。'},
  {en:'I’m twelve.',jp:'12歳です。'},
  {en:'I’m / from South Africa.',jp:'ぼくは〜出身です / 南アフリカ共和国'},
  {en:'I love Japanese sweets.',jp:'ぼくは日本の甘いお菓子が大好きです。'},
  {en:'I love tennis, / too.',jp:'ぼくはテニスが大好きです / 〜もまた'},
  {en:'I want / to join the tennis club.',jp:'ぼくは望んでいます / テニス部に入ることを'},
  {en:'Nice / to meet you.',jp:'うれしいです / あなたに会えて'}
 ],40);
 window.V10_REFERENCE_SLASH_AUDIT={version:'2026-08-20',passagesAudited:40,total:168,lastCompleted:40,minimumRuleImageConfirmed:true};
})();