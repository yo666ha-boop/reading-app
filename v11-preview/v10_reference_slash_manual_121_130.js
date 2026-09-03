// Reference/minimum-rule slash audit passages 121-130.
(function(){
 const PASS='PASS_REFERENCE_20260820';
 function setAudit(data,section,rows,n){const p=data&&data[section];if(!p)throw new Error('Missing reference passage '+n+': '+section);if(rows.length!==(p.sentences||[]).length)throw new Error('Row mismatch '+n);for(let i=0;i<rows.length;i++){const e=String(rows[i].en||'').replace(/\s*\/\s*/g,' ').replace(/\s+/g,' ').trim(),s=String(p.sentences[i]||'').replace(/\s+/g,' ').trim();if(e!==s)throw new Error('English mismatch '+n+'#'+(i+1)+': '+e+' <> '+s);const ec=String(rows[i].en||'').split(/\s*\/\s*/).filter(Boolean).length,jc=String(rows[i].jp||'').split(/\s*\/\s*/).filter(Boolean).length;if(ec!==jc)throw new Error('EN/JP chunks '+n+'#'+(i+1)+' '+ec+'/'+jc)}p.slashRows=rows;p.slashReadingVersion='reference-book-minimum-rules-20260820';p.slashReferenceAudit=PASS;p.slashReferencePassageNo=n}
 const n2=window.V10_PASSAGES_G2_NH||{}, s3=window.V10_PASSAGES_G3_SS||{};
 setAudit(n2,'Unit 7-3',[
  {en:'The Taj Mahal is a World Heritage site.',jp:'タージ・マハルは世界遺産です。'},
  {en:'Emperor Shah Jahan built it / in memory / of his wife.',jp:'皇帝シャー・ジャハーンはそれを建てました / 記念して / 妻を'},
  {en:'Its main material is white marble.',jp:'主な材料は白い大理石です。'},
  {en:'From far away, / its architecture looks like a jewel.',jp:'遠くから / その建築は宝石のように見えます'},
  {en:'Today, / air pollution is a serious problem / near the site.',jp:'今日 / 大気汚染は深刻な問題です / その遺産の近くで'},
  {en:'Because / of pollution, / the white marble can turn dark.',jp:'〜のため / 汚染の / 白い大理石は黒ずむことがあります'},
  {en:'The government works / to reduce pollution / around the site.',jp:'政府は取り組んでいます / 汚染を減らすために / その遺産の周辺で'},
  {en:'Experts also study the marble / and clean it carefully.',jp:'専門家も大理石を調べます / そして注意深く清掃します'},
  {en:'Their goal is / to keep the white marble beautiful.',jp:'彼らの目標は〜です / 白い大理石を美しく保つこと'},
  {en:'Protecting the material also protects the architecture.',jp:'材料を守ることは建築を守ることにもなります。'},
  {en:'I think this cultural heritage should remain beautiful / for the future.',jp:'私はこの文化遺産は美しいままであるべきだと思います / 未来のために'}
 ],121);
 setAudit(n2,'Unit 7-4',[
  {en:'Recently, / I climbed a mountain / at a World Heritage site.',jp:'最近 / 私は山に登りました / 世界遺産にある'},
  {en:'I left early / and saw a beautiful sunrise.',jp:'私は早く出発しました / そして美しい日の出を見ました'},
  {en:'Near the crater, / more / and more tourists were walking / on the trail.',jp:'噴火口の近くでは / ますます / 多くの観光客が歩いていました / 小道を'},
  {en:'Some visitors had left a large amount / of trash.',jp:'訪問者の中には大量に残していました / ごみを'},
  {en:'The trash made part / of the trail dirty / and unsafe.',jp:'そのごみは一部を汚くしました / 小道の / そして危険にしました'},
  {en:'A local cleanup campaign started that morning.',jp:'その朝、地元の清掃キャンペーンが始まりました。'},
  {en:'Volunteers collected trash / along the trail.',jp:'ボランティアはごみを集めました / 小道沿いで'},
  {en:'They also put up a sign asking tourists / to carry their trash home.',jp:'彼らは観光客に求める標識も立てました / ごみを持ち帰るように'},
  {en:'After the cleanup, / the trail was clean again.',jp:'清掃後 / 小道は再びきれいになりました'},
  {en:'We want / to protect the mountain forever.',jp:'私たちは望んでいます / この山をいつまでも守ることを'},
  {en:'I hope future tourists can enjoy a safe / and beautiful trail.',jp:'私は未来の観光客が安全な小道を楽しめることを願っています / そして美しい小道を'}
 ],122);
 setAudit(s3,'PROGRAM 1-1',[
  {en:'It is noon / at school.',jp:'正午です / 学校では'},
  {en:'My friends / and I go / to the schoolyard / for lunch.',jp:'私の友達 / そして私は行きます / 校庭へ / 昼食のために'},
  {en:'Emi opens a small bag / and takes out a colorful bento.',jp:'エミは小さな袋を開けます / そして色彩豊かなお弁当を取り出します'},
  {en:'Her bento has rice, / egg, / and vegetables.',jp:'彼女のお弁当にはご飯があります / 卵 / そして野菜も'},
  {en:'The different colors make the lunch fun / to look / at.',jp:'さまざまな色でその昼食は楽しくなります / 見るのが / それを'},
  {en:'We sit together / on a bench.',jp:'私たちはいっしょに座ります / ベンチに'},
  {en:'I ask Emi / about the food / in her bento.',jp:'私はエミにたずねます / 食べ物について / 彼女のお弁当の中の'},
  {en:'She tells us / that her mother made it this morning.',jp:'彼女は私たちに教えます / 今朝お母さんがそれを作ったのだと'},
  {en:'We talk / and eat lunch together.',jp:'私たちは話します / そしていっしょに昼食を食べます'},
  {en:'The schoolyard is quiet / and warm.',jp:'校庭は静かです / そして暖かいです'},
  {en:'Noon is a good time / to relax / with friends.',jp:'正午はよい時間です / くつろぐための / 友達と'}
 ],123);
 setAudit(s3,'PROGRAM 1-2',[
  {en:'My friend runs / in a marathon today.',jp:'友達は走ります / 今日マラソンで'},
  {en:'After the marathon, / we meet / at my friend’s house.',jp:'マラソンのあと / 私たちは会います / 友達の家で'},
  {en:'A homemade bento is waiting / on the table.',jp:'自家製のお弁当が待っています / テーブルの上で'},
  {en:'The bento has rice, / vegetables, / and a small portion / of eel.',jp:'そのお弁当にはご飯があります / 野菜 / そして少量 / ウナギの'},
  {en:'My friend is hungry / after the long race.',jp:'友達はおなかがすいています / 長いレースのあとで'},
  {en:'We start / with the rice / and vegetables.',jp:'私たちは始めます / ご飯から / そして野菜から'},
  {en:'Then I try some eel, / too.',jp:'それから私はウナギを少し食べてみます / 〜もまた'},
  {en:'The homemade food tastes very good.',jp:'自家製の食べ物はとてもおいしいです。'},
  {en:'While we eat, / my friend tells me / about the marathon.',jp:'私たちが食べている間 / 友達は私に話します / マラソンについて'},
  {en:'We talk / about the hardest part / of the race.',jp:'私たちは話します / 一番大変だった部分について / レースの'},
  {en:'The meal is a quiet way / to rest / after the marathon.',jp:'その食事は静かな方法です / 休むための / マラソンのあとに'}
 ],124);
 setAudit(s3,'PROGRAM 1-3',[
  {en:'At lunch, / my friend / and I talk / about bentos we have eaten.',jp:'昼食のとき / 私の友達 / そして私は話します / これまで食べたお弁当について'},
  {en:'I have eaten a homemade bento many times.',jp:'私は自家製のお弁当を何度も食べたことがあります。'},
  {en:'I have never eaten eel / in a bento.',jp:'私はウナギを食べたことが一度もありません / お弁当で'},
  {en:'My friend has eaten eel / before.',jp:'友達はウナギを食べたことがあります / 以前に'},
  {en:'“Have you ever eaten a very colorful bento?” I ask.',jp:'「今までにとても色彩豊かなお弁当を食べたことがある？」と私はたずねます。'},
  {en:'My friend says, / “Yes, / I have.”',jp:'友達は言います / 「うん / あるよ」'},
  {en:'We have both heard / of a variety / of Japanese bentos.',jp:'私たちは二人とも聞いたことがあります / さまざまな種類について / 日本のお弁当の'},
  {en:'Some bentos have many small portions / of different foods.',jp:'お弁当の中には少量ずつたくさん入っています / さまざまな食べ物が'},
  {en:'Popular bentos can sell out / at noon / at a shop / near our school.',jp:'人気のお弁当は売り切れることがあります / 正午に / 店で / 私たちの学校の近くの'},
  {en:'I have gotten one there / before.',jp:'私はそこで1つ買ったことがあります / 以前に'},
  {en:'Our experiences are different, / so we enjoy talking / about them.',jp:'私たちの経験は違います / だから私たちは話すのを楽しんでいます / それらについて'},
  {en:'I want / to try a new kind / of bento next time.',jp:'私は望んでいます / 新しい種類を試すことを / 次回のお弁当の'}
 ],125);
 setAudit(s3,'PROGRAM 2-1',[
  {en:'You’ve just finished your homework.',jp:'あなたはちょうど宿題を終えたところです。'},
  {en:'It is already late.',jp:'もう遅い時間です。'},
  {en:'You have not gone / to bed yet.',jp:'あなたはまだ行っていません / 寝床へ'},
  {en:'A lack / of sleep can affect your health.',jp:'不足が / 睡眠の健康に影響することがあります'},
  {en:'A regular bedtime is important.',jp:'規則正しい就寝時刻は大切です。'},
  {en:'Put your school things away now.',jp:'学校の物を今片づけましょう。'},
  {en:'Take at least a few minutes / to relax quietly.',jp:'少なくとも数分取りましょう / 静かにくつろぐために'},
  {en:'Then go / to bed / at your regular time.',jp:'それから行きましょう / 寝床へ / いつもの時刻に'},
  {en:'Sleep tight tonight.',jp:'今夜はぐっすり眠ってください。'},
  {en:'Good sleep can help you feel ready / in the morning.',jp:'よい睡眠は準備ができた気分になる助けになります / 朝に'},
  {en:'You have already done enough / for tonight.',jp:'あなたはもう十分にやりました / 今夜の分は'}
 ],126);
 setAudit(s3,'PROGRAM 2-2',[
  {en:'I started a sleep diary / in April.',jp:'私は睡眠日記を始めました / 4月に'},
  {en:'I have used the diary / since then.',jp:'私はその日記を使っています / それ以来'},
  {en:'Every night, / I write down the time I go / to bed.',jp:'毎晩 / 私は行く時刻を書き留めます / 寝床へ'},
  {en:'Every morning, / I write how I feel / when I wake up.',jp:'毎朝 / 私は自分の気分を書きます / 目覚めたときの'},
  {en:'My plan is based / on a regular sleep time.',jp:'私の計画は基づいています / 規則正しい睡眠時間に'},
  {en:'I have followed this plan / for two months.',jp:'私はこの計画を続けています / 2か月間'},
  {en:'Before a test, / I still try / to go / to bed / at the same time.',jp:'テストの前でも / 私はなお試みます / 行くことを / 寝床へ / 同じ時刻に'},
  {en:'The diary helps me see my sleep habit clearly.',jp:'日記のおかげで自分の睡眠習慣がはっきり分かります。'},
  {en:'Since April, / I have been more careful / about sleep.',jp:'4月から / 私はより気をつけています / 睡眠について'},
  {en:'Right now, / I feel better / in the morning.',jp:'今では / 私は調子がよく感じます / 朝に'},
  {en:'I want / to keep this habit.',jp:'私は望んでいます / この習慣を続けることを'}
 ],127);
 setAudit(s3,'PROGRAM 2-3',[
  {en:'Our team is / on a tour / for a tournament.',jp:'私たちのチームはいます / 遠征中に / 大会のための'},
  {en:'Tomorrow is our first game.',jp:'明日は最初の試合です。'},
  {en:'After practice, / our trainer introduces a simple sleep plan.',jp:'練習後 / トレーナーが簡単な睡眠計画を紹介します'},
  {en:'First, / we dry our hair / before bed.',jp:'まず / 私たちは髪を乾かします / 寝る前に'},
  {en:'Then we put our phones away.',jp:'それから携帯電話を片づけます。'},
  {en:'The hotel room is bright, / so we turn off the main light.',jp:'ホテルの部屋は明るいです / だから主な明かりを消します'},
  {en:'We also close the curtain.',jp:'カーテンも閉めます。'},
  {en:'As a result, / the room becomes quiet / and dark.',jp:'その結果 / 部屋は静かになります / そして暗くなります'},
  {en:'We go / to bed / at our regular time.',jp:'私たちは行きます / 寝床へ / いつもの時刻に'},
  {en:'Thus, / we can get enough rest / before the tournament.',jp:'したがって / 私たちは十分な休息をとれます / 大会前に'},
  {en:'The tour is busy, / but good sleep is part / of our preparation.',jp:'遠征は忙しいです / しかしよい睡眠は一部です / 私たちの準備の'}
 ],128);
 setAudit(s3,'PROGRAM 3-1',[
  {en:'Our school has a sports event next month.',jp:'私たちの学校では来月スポーツイベントがあります。'},
  {en:'My class must make a poster / for the event.',jp:'私たちのクラスはポスターを作らなければなりません / そのイベントのために'},
  {en:'We want one animal mascot / on the poster.',jp:'私たちは動物のマスコットを1つ入れたいです / ポスターに'},
  {en:'Ken draws a kangaroo.',jp:'ケンはカンガルーを描きます。'},
  {en:'Aya draws an octopus.',jp:'アヤはタコを描きます。'},
  {en:'I draw a dove.',jp:'私はハトを描きます。'},
  {en:'We put the three pictures / on the board.',jp:'私たちは3枚の絵を置きます / 黒板に'},
  {en:'Someone asks, / “Whose picture is the kangaroo?”',jp:'だれかがたずねます / 「カンガルーの絵はだれの？」'},
  {en:'Ken says, / “It’s mine.”',jp:'ケンは言います / 「僕のだよ」'},
  {en:'We talk / about which mascot fits the event best.',jp:'私たちは話します / どのマスコットがイベントに一番合うかについて'},
  {en:'In the end, / we choose the kangaroo.',jp:'最後に / 私たちはカンガルーを選びます'},
  {en:'Ken’s picture will be / on our event poster.',jp:'ケンの絵が載るでしょう / 私たちのイベントのポスターに'},
  {en:'The class is excited / about the new mascot.',jp:'クラスのみんなはわくわくしています / 新しいマスコットについて'}
 ],129);
 setAudit(s3,'PROGRAM 3-2',[
  {en:'An athlete / in our town will take part / in a race tomorrow.',jp:'ある選手が / 私たちの町の参加します / 明日のレースに'},
  {en:'A trainer is helping the runner prepare today.',jp:'今日はトレーナーがそのランナーの準備を手伝っています。'},
  {en:'The weather is hot / and bright.',jp:'天気は暑いです / そして日差しも強いです'},
  {en:'The runner has a little sunburn / on his arm.',jp:'ランナーには少し日焼けがあります / 腕に'},
  {en:'The trainer tells him / to take care / of himself / in the heat.',jp:'トレーナーは彼に言います / 大切にするように / 自分を / 暑さの中で'},
  {en:'The runner drinks water / and rests / in the shade.',jp:'ランナーは水を飲みます / そして休みます / 日陰で'},
  {en:'Then they talk / about his recent progress.',jp:'それから二人は話します / 最近の進歩について'},
  {en:'His progress has been incredible.',jp:'彼の進歩はすばらしいものです。'},
  {en:'His best time is now close / to his old record.',jp:'自己ベストは今近いです / 以前の記録に'},
  {en:'Tomorrow, / he wants / to go beyond that record.',jp:'明日は / 彼は望んでいます / その記録を越えることを'},
  {en:'A huge crowd is expected / at the race.',jp:'大勢の観客が予想されています / レースで'},
  {en:'Many people are attracted / to the event / because local runners take part.',jp:'多くの人が引きつけられています / そのイベントに / 地元のランナーが参加するから'},
  {en:'The runner feels ready / for tomorrow.',jp:'ランナーは準備ができたと感じています / 明日に向けて'}
 ],130);
 window.V10_REFERENCE_SLASH_AUDIT={version:'2026-08-20',passagesAudited:130,total:168,lastCompleted:130,minimumRuleImageConfirmed:true};
})();