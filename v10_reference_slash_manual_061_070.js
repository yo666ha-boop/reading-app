// Reference/minimum-rule slash audit passages 061-070.
(function(){
 const PASS='PASS_REFERENCE_20260820';
 function setAudit(data,section,rows,n){const p=data&&data[section];if(!p)throw new Error('Missing reference passage '+n+': '+section);if(rows.length!==(p.sentences||[]).length)throw new Error('Row mismatch '+n);for(let i=0;i<rows.length;i++){const e=String(rows[i].en||'').replace(/\s*\/\s*/g,' ').replace(/\s+/g,' ').trim(),s=String(p.sentences[i]||'').replace(/\s+/g,' ').trim();if(e!==s)throw new Error('English mismatch '+n+'#'+(i+1)+': '+e+' <> '+s);const ec=String(rows[i].en||'').split(/\s*\/\s*/).filter(Boolean).length,jc=String(rows[i].jp||'').split(/\s*\/\s*/).filter(Boolean).length;if(ec!==jc)throw new Error('EN/JP chunks '+n+'#'+(i+1)+' '+ec+'/'+jc)}p.slashRows=rows;p.slashReadingVersion='reference-book-minimum-rules-20260820';p.slashReferenceAudit=PASS;p.slashReferencePassageNo=n}
 const n1=window.V10_NEWHORIZON_G1||{}, s2=window.V10_PASSAGES_G2_SS||{};
 setAudit(n1,'Unit 8-1',[
  {en:'This is a volunteer / in Kenya.',jp:'こちらはボランティアです / ケニアの'},
  {en:'The children are / in need.',jp:'その子どもたちはいます / 困っている状態に'},
  {en:'He can teach the children.',jp:'彼は子どもたちに教えることができます。'},
  {en:'He can help them, / too.',jp:'彼は彼らを助けられます / 〜もまた'},
  {en:'The children respect him.',jp:'子どもたちは彼を尊敬しています。'},
  {en:'I respect him, / too.',jp:'私は彼を尊敬しています / 〜もまた'},
  {en:'I want / to become a volunteer.',jp:'私は望んでいます / ボランティアになることを'},
  {en:'I want / to teach children someday.',jp:'私は望んでいます / いつか子どもたちに教えることを'},
  {en:'I want / to do my best.',jp:'私は望んでいます / 最善を尽くすことを'}
 ],61);
 setAudit(n1,'Unit 8-2',[
  {en:'This is my reusable straw.',jp:'これは私の再利用できるストローです。'},
  {en:'It is plastic.',jp:'プラスチック製です。'},
  {en:'I use it / at home.',jp:'私はそれを使います / 家で'},
  {en:'I can use it again.',jp:'私はそれをもう一度使うことができます。'},
  {en:'This is a paper straw.',jp:'こちらは紙のストローです。'},
  {en:'I use the paper straw / at a cafe.',jp:'私は紙のストローを使います / カフェで'},
  {en:'I like the reusable straw.',jp:'私は再利用できるストローが好きです。'},
  {en:'I like the paper straw, / too.',jp:'私は紙のストローが好きです / 〜もまた'},
  {en:'I want / to reduce waste.',jp:'私は望んでいます / ごみを減らすことを'}
 ],62);
 setAudit(n1,'Unit 8-3',[
  {en:'This is a village.',jp:'ここは村です。'},
  {en:'The river is far / from the village.',jp:'その川は遠いです / 村から'},
  {en:'The river water is not clean.',jp:'川の水はきれいではありません。'},
  {en:'A group / in the village wants / to build a well.',jp:'グループが / 村の中の望んでいます / 井戸を作ることを'},
  {en:'They collect money.',jp:'彼らはお金を集めます。'},
  {en:'They work / for a long time.',jp:'彼らは働きます / 長い間'},
  {en:'Now the village has a well.',jp:'今、その村には井戸があります。'},
  {en:'The well has clean water.',jp:'その井戸にはきれいな水があります。'},
  {en:'The people are happy.',jp:'人々はうれしいです。'}
 ],63);
 setAudit(n1,'Unit 9-1',[
  {en:'During vacation, / I went / to a mountain.',jp:'休みの間に / 私は行きました / 山へ'},
  {en:'I met my friend there.',jp:'私はそこで友達に会いました。'},
  {en:'We went snowboarding.',jp:'私たちはスノーボードをしに行きました。'},
  {en:'I like snowboarding very much.',jp:'私はスノーボードがとても好きです。'},
  {en:'The mountain was beautiful.',jp:'その山は美しかったです。'},
  {en:'After snowboarding, / I went back home.',jp:'スノーボードのあと / 私は家へ戻りました'},
  {en:'I want / to go back / to the mountain someday.',jp:'私は望んでいます / また行くことを / いつかその山へ'},
  {en:'I like this vacation very much.',jp:'私はこの休みがとても好きです。'}
 ],64);
 setAudit(n1,'Unit 9-2',[
  {en:'At New Year, / I wrote a special card / for my grandparent.',jp:'新年に / 私は特別なカードを書きました / 祖父母のために'},
  {en:'I wrote the card / in English.',jp:'私はそのカードを書きました / 英語で'},
  {en:'I ate a traditional rice cake / with my family.',jp:'私は伝統的なもちを食べました / 家族と'},
  {en:'“Did you write the card / in English?”',jp:'「そのカードを書いたの / 英語で」'},
  {en:'“Yes, / I did.”',jp:'「うん / 書いたよ」'},
  {en:'“Good / for you!”',jp:'「よかったね / あなたにとって」'},
  {en:'“Thank you.”',jp:'「ありがとう。」'},
  {en:'This New Year is special / for me.',jp:'この新年は特別です / 私にとって'}
 ],65);
 setAudit(n1,'Unit 9-3',[
  {en:'On New Year’s Day, / I spent time / with my grandparent.',jp:'元日に / 私は時間を過ごしました / 祖父母と'},
  {en:'I got a fortune slip.',jp:'私はおみくじを引きました。'},
  {en:'It is not bad.',jp:'悪い内容ではありません。'},
  {en:'I bought a charm, / too.',jp:'私はお守りを買いました / 〜もまた'},
  {en:'We had a good time.',jp:'私たちは楽しい時間を過ごしました。'},
  {en:'“Did you like the charm?”',jp:'「そのお守りは気に入った？」'},
  {en:'“Yes, / I did.”',jp:'「うん / 気に入ったよ」'},
  {en:'I want / to spend New Year’s Day / with my grandparent again.',jp:'私は望んでいます / 元日を過ごすことを / また祖父母と'}
 ],66);
 setAudit(n1,'Unit 10-1',[
  {en:'It was a chorus contest.',jp:'それは合唱コンクールでした。'},
  {en:'I was / in the chorus.',jp:'私は参加していました / 合唱に'},
  {en:'At first, / I was nervous.',jp:'最初は / 私は緊張していました'},
  {en:'I made a mistake.',jp:'私はまちがいをしました。'},
  {en:'I was late.',jp:'私は遅れてしまいました。'},
  {en:'Anyway, / we won the contest.',jp:'それでも / 私たちはコンクールで勝ちました'},
  {en:'I was happy.',jp:'私はうれしかったです。'},
  {en:'Now I remember my mistake.',jp:'今でも自分のまちがいを覚えています。'},
  {en:'I realize / that I was late.',jp:'私は気づいています / 自分が遅れたことに'},
  {en:'Anyone can make a mistake.',jp:'だれでもまちがいをすることがあります。'}
 ],67);
 setAudit(n1,'Unit 10-2',[
  {en:'Hey, / look / at this album.',jp:'ねえ / 見て / このアルバムを'},
  {en:'It is / on my desk.',jp:'それはあります / 私の机の上に'},
  {en:'Each picture can bring back a memory.',jp:'それぞれの写真は思い出をよみがえらせることがあります。'},
  {en:'This picture is / from the chorus contest.',jp:'この写真は〜です / 合唱コンクールの'},
  {en:'It can bring back my memory / of the contest.',jp:'それは私の思い出をよみがえらせます / コンクールの'},
  {en:'My heart can beat fast / when I see it.',jp:'私の心臓は速くどきどきすることがあります / 私がそれを見るとき'},
  {en:'I remember our mistake.',jp:'私は私たちのまちがいを思い出します。'},
  {en:'I remember / that we won, / too.',jp:'私は思い出します / 私たちが勝ったことを / 〜もまた'},
  {en:'This picture is important / to me.',jp:'この写真は大切です / 私にとって'}
 ],68);
 setAudit(n1,'Unit 10-3',[
  {en:'We went / to a campground.',jp:'私たちは行きました / キャンプ場へ'},
  {en:'We set up a tent.',jp:'私たちはテントを張りました。'},
  {en:'The campground had a hot spring.',jp:'そのキャンプ場には温泉がありました。'},
  {en:'At night, / we had a campfire.',jp:'夜には / 私たちはキャンプファイアをしました'},
  {en:'The campfire was the main event.',jp:'キャンプファイアが主な行事でした。'},
  {en:'It was exciting.',jp:'とてもわくわくしました。'},
  {en:'We were happy.',jp:'私たちはうれしかったです。'},
  {en:'I like camping very much.',jp:'私はキャンプがとても好きです。'},
  {en:'It was a great trip.',jp:'すばらしい旅行でした。'}
 ],69);
 setAudit(s2,'PROGRAM 1-1',[
  {en:'I have important news.',jp:'大切な知らせがあります。'},
  {en:'I leave this town / on Sunday.',jp:'私はこの町を出ます / 日曜日に'},
  {en:'I move / to a new city.',jp:'私は引っ越します / 新しい町へ'},
  {en:'I have a party / with my friends / before I leave.',jp:'私はパーティーをします / 友達と / 私が出る前に'},
  {en:'The party is / at my house.',jp:'そのパーティーはあります / 私の家で'},
  {en:'We play music.',jp:'私たちは音楽を演奏します。'},
  {en:'We eat dinner together.',jp:'私たちはいっしょに夕食を食べます。'},
  {en:'We talk / about our school.',jp:'私たちは話します / 私たちの学校について'},
  {en:'I want / to see my friends again.',jp:'私は望んでいます / また友達に会うことを'},
  {en:'This town is special / for me.',jp:'この町は特別です / 私にとって'},
  {en:'The party is special, / too.',jp:'そのパーティーは特別です / 〜もまた'}
 ],70);
 window.V10_REFERENCE_SLASH_AUDIT={version:'2026-08-20',passagesAudited:70,total:168,lastCompleted:70,minimumRuleImageConfirmed:true};
})();