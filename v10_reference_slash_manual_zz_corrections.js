// Final corrections after full 168 minimum-rule audit.
// Loaded after all range reference layers. These rows follow the user-supplied minimum rule:
// slash before prepositions/conjunctions, before infinitive to+verb, after commas, and chunk-aligned Japanese.
(function(){
 const PASS='PASS_REFERENCE_20260820';
 function setAudit(data,section,rows,n){
   const p=data&&data[section];if(!p)throw new Error('Missing final reference correction '+n+': '+section);
   if(rows.length!==(p.sentences||[]).length)throw new Error('Final correction row mismatch '+n+' '+rows.length+'/'+((p.sentences||[]).length));
   for(let i=0;i<rows.length;i++){
     const e=String(rows[i].en||'').replace(/\s*\/\s*/g,' ').replace(/\s+/g,' ').trim();
     const s=String(p.sentences[i]||'').replace(/\s+/g,' ').trim();
     if(e!==s)throw new Error('Final correction English mismatch '+n+'#'+(i+1)+': '+e+' <> '+s);
     const ec=String(rows[i].en||'').split(/\s*\/\s*/).filter(Boolean).length;
     const jc=String(rows[i].jp||'').split(/\s*\/\s*/).filter(Boolean).length;
     if(ec!==jc)throw new Error('Final correction EN/JP chunks '+n+'#'+(i+1)+' '+ec+'/'+jc);
   }
   p.slashRows=rows;p.slashReadingVersion='reference-book-minimum-rules-20260820-final';p.slashReferenceAudit=PASS;p.slashReferencePassageNo=n;
 }
 const n1=window.V10_NEWHORIZON_G1||{},s3=window.V10_PASSAGES_G3_SS||{},n3=window.V10_PASSAGES_G3_NH||{};
 setAudit(n1,'Unit 5-2',[
   {en:'This is his blog.',jp:'これは彼のブログです。'},
   {en:'The blog is / about his life.',jp:'そのブログは〜です / 彼の生活について'},
   {en:'He has a beautiful dolphin picture there.',jp:'彼はそこに美しいイルカの写真を持っています。'},
   {en:'Does he like the picture?',jp:'彼はその写真が好きですか。'},
   {en:'Yes, / he does.',jp:'はい / 好きです'},
   {en:'The dolphin is / in the water.',jp:'イルカはいます / 水の中に'},
   {en:'He can swim.',jp:'彼は泳ぐことができます。'},
   {en:'He doesn’t surf.',jp:'彼はサーフィンをしません。'},
   {en:'Does he write / about the dolphin?',jp:'彼は書きますか / そのイルカについて'},
   {en:'Yes, / he does.',jp:'はい / 書きます'},
   {en:'The picture is very beautiful.',jp:'その写真はとても美しいです。'},
   {en:'The blog is interesting.',jp:'そのブログはおもしろいです。'}
 ],53);
 setAudit(s3,'PROGRAM 7-1',[
   {en:'A patient has a disease / and must stay / in his hospital room.',jp:'ある患者には病気があります / そしていなければなりません / 病室に'},
   {en:'The hospital has a simple remote-robot project.',jp:'病院には簡単な遠隔ロボットのプロジェクトがあります。'},
   {en:'The patient can control the robot / with a computer / through a network.',jp:'患者はロボットを操作できます / コンピューターで / ネットワークを通して'},
   {en:'One day, / the robot visits a museum far away.',jp:'ある日 / そのロボットは遠くの博物館を訪れます'},
   {en:'The patient watches the museum / from his room / and talks / with a guide.',jp:'患者は博物館を見ます / 病室から / そして話します / 案内の人と'},
   {en:'He can move the robot / and look / around the room.',jp:'彼はロボットを動かせます / そして見ます / 部屋の中を見回して'},
   {en:'For a short time, / he feels / as if he is visiting the museum himself.',jp:'短い時間 / 彼は感じます / まるで自分自身が博物館を訪れているかのように'},
   {en:'He imagines using the robot / to visit another place abroad someday.',jp:'彼はロボットを使うことを想像します / いつか外国の別の場所を訪れるために'},
   {en:'Probably, / the project can help other patients too.',jp:'おそらく / このプロジェクトはほかの患者も助けられます'},
   {en:'A dream / that once felt far away may come true / through the robot.',jp:'夢が / かつて遠く感じられたものが実現するかもしれません / ロボットを通して'},
   {en:'The project gives the patient a new way / to connect / with the world.',jp:'このプロジェクトは患者に新しい方法を与えます / つながるための / 世界と'}
 ],141);
 setAudit(n3,'Unit 1-1',[
   {en:'My friend / and I compare places we have visited / in Japan.',jp:'私の友達 / そして私は訪れたことのある場所を比べます / 日本で'},
   {en:'I have been / to Kyoto once.',jp:'私は行ったことがあります / 京都に1度'},
   {en:'My friend has been / to Kyoto too.',jp:'私の友達は行ったことがあります / 京都にも'},
   {en:'I have also been / to Osaka twice.',jp:'私は行ったこともあります / 大阪に2度'},
   {en:'My friend has never been / to Hokkaido.',jp:'私の友達は行ったことが一度もありません / 北海道へ'},
   {en:'I have never been there either.',jp:'私もそこへ行ったことがありません。'},
   {en:'We talk / about what we enjoyed / in Kyoto / and Osaka.',jp:'私たちは話します / 私たちが楽しんだことについて / 京都で / そして大阪で'},
   {en:'Then we look / at a picture / of Hokkaido.',jp:'それから私たちは見ます / 写真を / 北海道の'},
   {en:'“Have you ever wanted / to go there?” I ask.',jp:'「今まで望んだことがありますか / そこへ行くことを」と私はたずねます'},
   {en:'My friend says yes.',jp:'友達はあると答えます。'},
   {en:'Because neither / of us has been there, / we choose Hokkaido / as our next trip.',jp:'どちらも〜でないので / 私たちのうちそこへ行ったことが / 私たちは北海道を選びます / 次の旅行先として'}
 ],145);
 const p146=n3['Unit 1-2'];
 if(p146&&Array.isArray(p146.slashRows)&&p146.slashRows.length===p146.sentences.length){p146.slashRows[6]={en:'He explains / when people wear it / and why he found it interesting.',jp:'彼は説明します / 人々がいつそれを着るか / そしてなぜ興味深いと思ったかも'};p146.slashReadingVersion='reference-book-minimum-rules-20260820-final';p146.slashReferenceAudit=PASS;p146.slashReferencePassageNo=146;}
 const p155=n3['Unit 5-3'];
 if(p155&&Array.isArray(p155.slashRows)&&p155.slashRows.length===p155.sentences.length){const i=6,s=String(p155.sentences[i]||'');if(s==='Even after his release, he continued to defend free speech and equal treatment.'){p155.slashRows[i]={en:'Even / after his release, / he continued / to defend free speech / and equal treatment.',jp:'〜でさえ / 釈放後 / 彼は続けました / 言論の自由を守ることを / そして平等な扱いを'};p155.slashReadingVersion='reference-book-minimum-rules-20260820-final';p155.slashReferenceAudit=PASS;p155.slashReferencePassageNo=155;}}
 window.V10_REFERENCE_SLASH_FINAL_CORRECTIONS={version:'2026-08-20',passages:[53,141,145,146,155],status:'APPLIED'};
})();
