// Final corrections after full 168 minimum-rule audit.
// Loaded after all range reference layers. These rows follow the user-supplied minimum rule:
// slash before prepositions/conjunctions, before infinitive to+verb, after commas, and chunk-aligned Japanese.
(function(){
 const PASS='PASS_REFERENCE_20260820';
 const VERSION='reference-book-minimum-rules-20260820';
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
   p.slashRows=rows;p.slashReadingVersion=VERSION;p.slashReferenceAudit=PASS;p.slashReferencePassageNo=n;
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
 if(p146&&Array.isArray(p146.slashRows)&&p146.slashRows.length===p146.sentences.length){p146.slashRows[6]={en:'He explains / when people wear it / and why he found it interesting.',jp:'彼は説明します / 人々がいつそれを着るか / そしてなぜ興味深いと思ったかも'};p146.slashReadingVersion=VERSION;p146.slashReferenceAudit=PASS;p146.slashReferencePassageNo=146;}
 const p155=n3['Unit 5-3'];
 if(p155&&Array.isArray(p155.slashRows)&&p155.slashRows.length===p155.sentences.length){const i=6,s=String(p155.sentences[i]||'');if(s==='Even after his release, he continued to defend free speech and equal treatment.'){p155.slashRows[i]={en:'Even / after his release, / he continued / to defend free speech / and equal treatment.',jp:'〜でさえ / 釈放後 / 彼は続けました / 言論の自由を守ることを / そして平等な扱いを'};p155.slashReadingVersion=VERSION;p155.slashReferenceAudit=PASS;p155.slashReferencePassageNo=155;}}
 window.V10_REFERENCE_SLASH_FINAL_CORRECTIONS={version:'2026-08-20',passages:[53,141,145,146,155],status:'APPLIED'};
})();

// Grammar-chronology final bridge. Runs last, after reference rows, so any sentence rewrite
// atomically updates learner-visible sentence/slash/A+B evidence while retaining the audited
// reference marker on the passage. Chronology boundaries are never widened to hide future grammar.
(function(){
 const pools={
  'ニューホライズン|1':window.V10_NEWHORIZON_G1||{},
  'ニューホライズン|2':window.V10_PASSAGES_G2_NH||{},
  'ニューホライズン|3':window.V10_PASSAGES_G3_NH||{}
 };
 const fixes=[
  ['1','Unit 1-1','I want to join the tennis club.','I like the tennis club.','テニス部に入りたいです。','テニス部が好きです。','I like / the tennis club.','私は好きです / テニス部が','Leonardo はどの部活動が好きですか。本文から英語で答えなさい。','the tennis club'],
  ['1','Unit 1-2','We can play soccer together.','We play soccer together.','私たちはいっしょにサッカーができます。','私たちはいっしょにサッカーをします。','We play soccer / together.','私たちはサッカーをします / いっしょに','2人はいっしょに何をしますか。本文から英語で答えなさい。','soccer'],
  ['1','Unit 3-3','I want to win.','I practice every day.','勝ちたいんだ。','毎日練習するんだ。','I practice / every day.','私は練習します / 毎日','話し手はどのくらいの頻度で練習しますか。本文から英語で答えなさい。','every day'],
  ['1','Unit 4-1','I want to visit New Zealand someday.','I like New Zealand.','いつかニュージーランドを訪れたいな。','ニュージーランドが好きです。','I like / New Zealand.','私は好きです / ニュージーランドが','話し手が好きな国はどこですか。本文から英語で答えなさい。','New Zealand'],
  ['1','Unit 4-2','We want to win.','We practice every day.','私たちは勝ちたいです。','私たちは毎日練習します。','We practice / every day.','私たちは練習します / 毎日','話し手たちはどのくらいの頻度で練習しますか。本文から英語で答えなさい。','every day'],
  ['1','Unit 5-3','“I want to visit the cafe.”','“I like the cafe.”','「そのカフェを訪れたいです。」','「そのカフェが好きです。」','“I like / the cafe.”','「私は好きです / そのカフェが」','話し手が好きな場所はどこですか。本文から英語で答えなさい。','the cafe'],
  ['1','Unit 7-1','I want to practice tennis tomorrow morning.','Tennis practice is tomorrow morning.','明日の朝、テニスを練習したいです。','テニスの練習は明日の朝です。','Tennis practice is / tomorrow morning.','テニスの練習は〜です / 明日の朝','テニスの練習はいつですか。本文から英語で答えなさい。','tomorrow morning'],
  ['1','Unit 7-2','I want to buy a souvenir for my family.','This souvenir is for my family.','家族のためにおみやげを買いたいです。','このおみやげは家族のためです。','This souvenir is / for my family.','このおみやげは〜です / 家族のため','このおみやげは誰のためですか。本文から英語で答えなさい。','my family'],
  ['1','Unit 7-2','I want to buy it.','I like it.','それを買いたいです。','それが好きです。','I like it.','私はそれが好きです。','話し手はそれをどう思っていますか。本文に合うように英語で答えなさい。','I like it.'],
  ['1','Unit 7-3','I want to visit a palace.','I like this palace.','宮殿を訪れたいです。','この宮殿が好きです。','I like / this palace.','私は好きです / この宮殿が','話し手が好きな建物は何ですか。本文から英語で答えなさい。','this palace'],
  ['2','Unit 1-3','We look at the card when we need help.','We look at the card for help.','助けが必要なとき、そのカードを見ます。','助けのために、そのカードを見ます。','We look / at the card / for help.','私たちは見ます / そのカードを / 助けのために','私たちは何のためにカードを見ますか。本文から英語で答えなさい。','for help'],
  ['2','Unit 1-3','Shopping was an interesting experience.','The trip was an interesting experience.','買い物はおもしろい体験でした。','その旅はおもしろい体験でした。','The trip was an interesting experience.','その旅はおもしろい体験でした。','何がおもしろい体験でしたか。本文から英語で答えなさい。','the trip'],
  ['2','Unit 2-2','I am happy to hear that.','I am happy about that.','それを聞いてうれしいです。','そのことがうれしいです。','I am happy / about that.','私はうれしいです / そのことが','話し手はそのことをどう感じていますか。本文から英語で答えなさい。','happy'],
  ['2','Unit 3-1','In the morning, I help the children get ready to play.','In the morning, I help the children.','朝、私は子どもたちが遊ぶ準備をするのを手伝います。','朝、私は子どもたちを手伝います。','In the morning, / I help the children.','朝 / 私は子どもたちを手伝います','朝、話し手は誰を手伝いますか。本文から英語で答えなさい。','the children'],
  ['2','Unit 3-4','I learned how to read clearly.','Now I read clearly.','はっきり読む方法を学びました。','今は、はっきり読みます。','Now / I read clearly.','今は / 私ははっきり読みます','今、話し手はどのように読みますか。本文から英語で答えなさい。','clearly'],
  ['3','Unit 3-1','Our class studies an endangered animal that lives in a forest.','Our class studies an endangered forest animal.','私たちのクラスは森に住む絶滅危惧動物を調べます。','私たちのクラスは絶滅危惧の森の動物を調べます。','Our class studies / an endangered forest animal.','私たちのクラスは調べます / 絶滅危惧の森の動物を','私たちのクラスは何を調べますか。本文から英語で答えなさい。','an endangered forest animal'],
  ['3','Unit 3-2','We ask our teacher to let us share the article with the class.','We ask our teacher about the article and share it with the class.','私たちは先生に、その記事をクラスで共有させてほしいと頼みます。','私たちは先生にその記事についてたずね、クラスで共有します。','We ask our teacher / about the article / and share it / with the class.','私たちは先生にたずねます / その記事について / そして共有します / クラスで','私たちは記事をどうしますか。本文から英語で答えなさい。','share it with the class'],
  ['3','Unit 4-3','One student comforted a friend who still felt afraid after the disaster.','One student comforted an afraid friend after the disaster.','ある生徒は災害後もまだ怖がっていた友達を慰めました。','ある生徒は災害後、怖がっていた友達を慰めました。','One student comforted / an afraid friend / after the disaster.','ある生徒は慰めました / 怖がっていた友達を / 災害後に','ある生徒は誰を慰めましたか。本文から英語で答えなさい。','an afraid friend'],
  ['3','Unit 4-3','The community also held a quiet moment to remember people who had died.','The community also held a quiet moment after many people died.','地域では亡くなった人々を思い出すために黙とうの時間も持ちました。','地域では多くの人が亡くなったあと、静かな時間も持ちました。','The community also held a quiet moment / after many people died.','地域では静かな時間も持ちました / 多くの人が亡くなったあと','地域では多くの人が亡くなったあと何をしましたか。本文から英語で答えなさい。','a quiet moment'],
  ['3','Unit 4-4','Other volunteers exchanged information about people who still needed help.','Other volunteers exchanged information about people in need.','ほかのボランティアはまだ助けを必要としている人々について情報交換しました。','ほかのボランティアは助けを必要とする人々について情報交換しました。','Other volunteers exchanged information / about people in need.','ほかのボランティアは情報交換しました / 助けを必要とする人々について','ボランティアは誰について情報交換しましたか。本文から英語で答えなさい。','people in need']
 ];
 function replaceAll(s,a,b){return typeof s==='string'?s.split(a).join(b):s;}
 function metas(book,grade,section){const out=[];const direct=window.V10_INTERACTION_META&&window.V10_INTERACTION_META[book+'|'+grade+'|'+section];if(direct)out.push(direct);const plain=window.V10_INTERACTION_META&&window.V10_INTERACTION_META[book+'|'+section];if(plain)out.push(plain);for(const k of Object.keys(window)){if(!/^V10_INTERACTION_META_SEMANTIC_REPAIRS(?:_\d{3}_\d{3})?$/.test(k))continue;const obj=window[k];if(!obj||typeof obj!=='object')continue;for(const key of [book+'|'+grade+'|'+section,book+'|'+section])if(obj[key])out.push(obj[key]);}return [...new Set(out)];}
 function syncQuestion(q,oldEn,newEn,oldJp,newJp,prompt,answer){if(!q)return false;const ev=String(q.evidence||'');if(!ev.includes(oldEn))return false;q.prompt=prompt;q.answer=answer;q.evidence=newEn;q.evidenceJp=newJp;q.reason='根拠英文の内容と一致します。';return true;}
 let changed=0,qchanged=0,missing=[];
 for(const [grade,section,oldEn,newEn,oldJp,newJp,slashEn,slashJp,prompt,answer] of fixes){const p=pools['ニューホライズン|'+grade]&&pools['ニューホライズン|'+grade][section];if(!p){missing.push(grade+'|'+section+':passage');continue;}const idx=(p.sentences||[]).indexOf(oldEn);if(idx<0){if(!(p.sentences||[]).includes(newEn))missing.push(grade+'|'+section+':'+oldEn);continue;}p.sentences[idx]=newEn;if(Array.isArray(p.slashRows)&&p.slashRows[idx])p.slashRows[idx]={en:slashEn,jp:slashJp};p.fullTranslation=replaceAll(p.fullTranslation,oldJp,newJp);for(const q of (p.questions||[]))if(syncQuestion(q,oldEn,newEn,oldJp,newJp,prompt,answer))qchanged++;for(const m of metas('ニューホライズン',grade,section))for(const q of (m.questionSetB||[]))if(syncQuestion(q,oldEn,newEn,oldJp,newJp,prompt,answer))qchanged++;p.auditNote=String(p.auditNote||'')+' Grammar chronology repair: future structure was rewritten at the exact passage boundary; sentence/translation/slash/A+B evidence were synchronized.';changed++;}
 window.V10_GRAMMAR_CHRONOLOGY_RUNTIME_FIX_STATE={definitions:fixes.length,changed,qchanged,missing,version:'future-grammar-rewrite-20260826'};
 if(missing.length)throw new Error('grammar chronology final fixes missing targets: '+missing.join(' | '));
})();
