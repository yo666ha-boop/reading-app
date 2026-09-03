// Recovery layer for reference-audit passages whose earlier batch aborted because runtime English differed from the authored snapshot.
// Never changes p.sentences. It selects a slash row by the exact current sentence text, verifies EN/JP chunk parity, then marks the passage reference-audited.
(function(){
 const PASS='PASS_REFERENCE_20260820';
 const norm=s=>String(s||'').replace(/\s+/g,' ').trim();
 const plain=s=>norm(String(s||'').replace(/\s*\/\s*/g,' '));
 function row(en,jp){return {en,jp}}
 function applyMap(data,section,n,map){
   const p=data&&data[section]; if(!p) throw new Error('Recovery missing passage '+n+': '+section);
   const rows=(p.sentences||[]).map((s,i)=>{
     const r=map[norm(s)]; if(!r) throw new Error('Recovery unknown English '+n+'#'+(i+1)+': '+s);
     if(plain(r.en)!==norm(s)) throw new Error('Recovery changes English '+n+'#'+(i+1)+': '+plain(r.en)+' <> '+norm(s));
     const ec=String(r.en).split(/\s*\/\s*/).filter(Boolean).length, jc=String(r.jp).split(/\s*\/\s*/).filter(Boolean).length;
     if(ec!==jc) throw new Error('Recovery EN/JP chunks '+n+'#'+(i+1)+' '+ec+'/'+jc);
     return r;
   });
   p.slashRows=rows; p.slashReadingVersion='reference-book-minimum-rules-20260820'; p.slashReferenceAudit=PASS; p.slashReferencePassageNo=n;
 }

 const n1=window.V10_NEWHORIZON_G1||{};
 applyMap(n1,'Unit 5-2',53,{
  'This is his blog.':row('This is his blog.','これは彼のブログです。'),
  'The blog is about his life.':row('The blog is / about his life.','そのブログは〜です / 彼の生活について'),
  'He has a beautiful dolphin picture there.':row('He has a beautiful dolphin picture there.','彼はそこに美しいイルカの写真を持っています。'),
  'The dolphin is in the water.':row('The dolphin is / in the water.','そのイルカはいます / 水の中に'),
  'Does he like the picture?':row('Does he like the picture?','彼はその写真が好きですか。'),
  'Yes, he does.':row('Yes, / he does.','はい / そうです'),
  'He can swim.':row('He can swim.','彼は泳ぐことができます。'),
  'He doesn’t surf.':row('He doesn’t surf.','彼はサーフィンをしません。'),
  'Does he write about the dolphin?':row('Does he write / about the dolphin?','彼は書きますか / そのイルカについて'),
  'The picture is very beautiful.':row('The picture is very beautiful.','その写真はとても美しいです。'),
  'The blog is interesting.':row('The blog is interesting.','そのブログはおもしろいです。'),
  'He has a dolphin picture there.':row('He has a dolphin picture there.','彼はそこにイルカの写真を持っています。'),
  'Does he swim?':row('Does he swim?','彼は泳ぎますか。'),
  'Does he surf?':row('Does he surf?','彼はサーフィンをしますか。'),
  'No, he doesn’t.':row('No, / he doesn’t.','いいえ / しません'),
  'The picture is beautiful.':row('The picture is beautiful.','その写真は美しいです。'),
  'Interesting!':row('Interesting!','おもしろいね！')
 });

 const s3=window.V10_PASSAGES_G3_SS||{};
 applyMap(s3,'PROGRAM 7-1',141,{
  'A patient has a disease and must stay in his hospital room.':row('A patient has a disease / and must stay / in his hospital room.','ある患者には病気があります / そしていなければなりません / 病室に'),
  'The hospital has a simple remote-robot project.':row('The hospital has a simple remote-robot project.','病院には簡単な遠隔ロボットのプロジェクトがあります。'),
  'The patient can control the robot with a computer through a network.':row('The patient can control the robot / with a computer / through a network.','患者はロボットを操作できます / コンピューターで / ネットワークを通して'),
  'One day, the robot visits a museum far away.':row('One day, / the robot visits a museum far away.','ある日 / そのロボットは遠くの博物館を訪れます'),
  'The patient watches the museum from his room and talks with a guide.':row('The patient watches the museum / from his room / and talks / with a guide.','患者は博物館を見ます / 病室から / そして話します / 案内の人と'),
  'He can move the robot and look around the room.':row('He can move the robot / and look / around the room.','彼はロボットを動かせます / そして見て回れます / 部屋の中を'),
  'For a short time, he feels as if he is visiting the museum himself.':row('For a short time, / he feels / as if he is visiting the museum himself.','短い時間 / 彼は感じます / 自分自身が博物館を訪れているように'),
  'He imagines using the robot to visit another place abroad someday.':row('He imagines using the robot / to visit another place abroad someday.','彼はロボットを使うことを想像します / いつか外国の別の場所を訪れるために'),
  'Probably, the project can help other patients too.':row('Probably, / the project can help other patients too.','おそらく / このプロジェクトはほかの患者も助けられます'),
  'Probably, the project can help other patients, too.':row('Probably, / the project can help other patients, / too.','おそらく / このプロジェクトはほかの患者を助けられます / 〜もまた'),
  'A dream that once felt far away may come true through the robot.':row('A dream / that once felt far away may come true / through the robot.','夢が / かつて遠く感じられたものが実現するかもしれません / ロボットを通して'),
  'The project gives the patient a new way to connect with the world.':row('The project gives the patient a new way / to connect / with the world.','このプロジェクトは患者に新しい方法を与えます / つながるための / 世界と')
 });

 const n3=window.V10_PASSAGES_G3_NH||{};
 applyMap(n3,'Unit 1-1',145,{
  'My friend and I compare places we have visited in Japan.':row('My friend / and I compare places we have visited / in Japan.','私の友達 / そして私は訪れたことのある場所を比べます / 日本で'),
  'I have been to Kyoto once.':row('I have been / to Kyoto once.','私は行ったことがあります / 京都に1度'),
  'My friend has been to Kyoto too.':row('My friend has been / to Kyoto too.','友達も行ったことがあります / 京都に'),
  'My friend has been to Kyoto, too.':row('My friend has been / to Kyoto, / too.','友達も行ったことがあります / 京都に / 〜もまた'),
  'I have also been to Osaka twice.':row('I have also been / to Osaka twice.','私は行ったこともあります / 大阪に2度'),
  'My friend has never been to Hokkaido.':row('My friend has never been / to Hokkaido.','友達は行ったことが一度もありません / 北海道へ'),
  'I have never been there either.':row('I have never been there either.','私もそこへ行ったことがありません。'),
  'I have never been there, either.':row('I have never been there, / either.','私もそこへ行ったことがありません / 〜もまた'),
  'We talk about what we enjoyed in Kyoto and Osaka.':row('We talk / about what we enjoyed / in Kyoto / and Osaka.','私たちは話します / 楽しんだことについて / 京都で / そして大阪で'),
  'Then we look at a picture of Hokkaido.':row('Then we look / at a picture / of Hokkaido.','それから私たちは見ます / 写真を / 北海道の'),
  '“Have you ever wanted to go there?” I ask.':row('“Have you ever wanted / to go there?” I ask.','「今まで望んだことがある / そこへ行くことを？」と私はたずねます'),
  'My friend says yes.':row('My friend says yes.','友達はあると答えます。'),
  'Because neither of us has been there, we choose Hokkaido as our next trip.':row('Because neither / of us has been there, / we choose Hokkaido / as our next trip.','どちらも〜でないので / 私たちのうちどちらもそこへ行ったことがないので / 私たちは北海道を選びます / 次の旅行先として')
 });

 window.V10_REFERENCE_SLASH_RECOVERY={version:'2026-08-20',passages:[53,141,145],status:'applied'};
})();
