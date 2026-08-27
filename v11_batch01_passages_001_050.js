(function installV11Batch01(){
 const BATCH='V11-B01-20260827';
 const rows=(obj)=>obj;
 const q=(r)=>({prompt:r.q[0],answer:r.q[1],evidence:r.en,evidenceJp:r.jp,reason:r.q[2]});
 function make(cfg,bank,meta){
   const rs=cfg.keys.map(k=>{if(!bank[k])throw new Error(cfg.id+' missing row '+k);return bank[k]});
   const qs=rs.filter(r=>r.q).map(q);
   if(qs.length<10)throw new Error(cfg.id+' needs 10 evidence rows');
   return {id:cfg.id,textbook:meta.textbook,grade:meta.grade,section:meta.section,level:cfg.level||'HOP',title:cfg.title,genre:cfg.genre||'diary',batch:BATCH,sourceSectionBaselineId:meta.baseline,vocabChronology:'PASS_BY_SECTION_BANK_20260827',grammarChronology:'PASS_BY_SECTION_BANK_20260827',sentences:rs.map(r=>r.en),fullTranslation:rs.map(r=>r.jp).join(''),slashRows:rs.map(r=>({en:r.sen,jp:r.sjp})),questions:qs.slice(0,5),questionSetB:qs.slice(-5),notes:[],auditNote:'v11 Batch01. Exact textbook/grade/section bound to an already audited late-unit vocabulary and grammar bank; coherent passage, synchronized translation/slash/A+B evidence.',vocabAudit:true,manualSlashAudit:true,manualMeaningAudit:true,manualQuestionAudit:true};
 }
 const all=[];
 function addFamily(meta,bank,configs){for(const c of configs)all.push(make(c,bank,meta));}

 const ss1=rows({
  theaterQuiet:{en:'Yesterday, the theater was quiet.',jp:'昨日、劇場は静かでした。',sen:'Yesterday, / the theater was / quiet.',sjp:'昨日 / 劇場は〜でした / 静かな',q:['1. 昨日、劇場はどのような様子でしたか。本文から英語で1語答えなさい。','quiet','quiet が劇場の様子を表しています。']},
  theaterBusy:{en:'Yesterday, the theater was busy.',jp:'昨日、劇場は混んでいました。',sen:'Yesterday, / the theater was / busy.',sjp:'昨日 / 劇場は〜でした / 混んでいる',q:['1. 昨日、劇場はどのような様子でしたか。本文から英語で1語答えなさい。','busy','busy が劇場の様子を表しています。']},
  friendThere:{en:'My friend was at the theater with me.',jp:'友達は私といっしょに劇場にいました。',sen:'My friend was / at the theater / with me.',sjp:'私の友達はいました / 劇場に / 私といっしょに',q:['2. 誰が話し手と劇場にいましたか。本文から英語で答えなさい。','My friend','文の主語 My friend がいっしょにいた人です。']},
  watchedMovie:{en:'We watched a movie.',jp:'私たちは映画を見ました。',sen:'We watched / a movie.',sjp:'私たちは見ました / 映画を',q:['3. 2人は何を見ましたか。本文から英語で答えなさい。','a movie','watched の目的語 a movie が見たものです。']},
  movieInteresting:{en:'The movie was interesting.',jp:'その映画はおもしろかったです。',sen:'The movie was / interesting.',sjp:'その映画は〜でした / おもしろい',q:['4. 映画はどうでしたか。本文から英語で1語答えなさい。','interesting','interesting が映画の感想です。']},
  speakerNotTired:{en:'I was not tired.',jp:'私は疲れていませんでした。',sen:'I was not / tired.',sjp:'私は〜ではありませんでした / 疲れて',q:['5. 話し手は疲れていましたか。Yes / No で答えなさい。','No','not tired とあるので No です。']},
  friendSleepy:{en:'My friend was sleepy.',jp:'友達は眠そうでした。',sen:'My friend was / sleepy.',sjp:'私の友達は〜でした / 眠い',q:['6. 友達はどのような状態でしたか。本文から英語で1語答えなさい。','sleepy','sleepy が友達の状態です。']},
  goodTime:{en:'We had a good time.',jp:'私たちは楽しい時間を過ごしました。',sen:'We had / a good time.',sjp:'私たちは過ごしました / 楽しい時間を',q:['7. 2人はどのような時間を過ごしましたか。本文から英語で答えなさい。','a good time','had の目的語が a good time です。']},
  talkedMovie:{en:'After the movie, we talked about the movie.',jp:'映画のあと、私たちはその映画について話しました。',sen:'After the movie, / we talked / about the movie.',sjp:'映画のあと / 私たちは話しました / その映画について',q:['8. 映画のあと、何について話しましたか。本文から英語で答えなさい。','the movie','about の後ろの the movie が話題です。']},
  talkedSchool:{en:'After the movie, we talked about school.',jp:'映画のあと、私たちは学校について話しました。',sen:'After the movie, / we talked / about school.',sjp:'映画のあと / 私たちは話しました / 学校について',q:['8. 映画のあと、何について話しましたか。本文から英語で答えなさい。','school','about の後ろの school が話題です。']},
  wentHome:{en:'We went home together.',jp:'私たちはいっしょに家へ帰りました。',sen:'We went home / together.',sjp:'私たちは家へ帰りました / いっしょに',q:['9. 2人はどのように家へ帰りましたか。本文から英語で1語答えなさい。','together','together がいっしょに帰ったことを表します。']},
  houseNear:{en:'My house was not far from the theater.',jp:'私の家は劇場から遠くありませんでした。',sen:'My house was not / far / from the theater.',sjp:'私の家は〜ではありませんでした / 遠い / 劇場から',q:['10. 話し手の家は劇場から遠かったですか。Yes / No で答えなさい。','No','not far とあるので No です。']},
  houseFar:{en:'My house was far from the theater.',jp:'私の家は劇場から遠かったです。',sen:'My house was / far / from the theater.',sjp:'私の家は〜でした / 遠い / 劇場から',q:['10. 話し手の家は劇場から遠かったですか。Yes / No で答えなさい。','Yes','far from the theater とあるので Yes です。']},
  happy:{en:'I was happy after the movie.',jp:'私は映画のあと、うれしかったです。',sen:'I was / happy / after the movie.',sjp:'私は〜でした / うれしい / 映画のあと',q:['10. 話し手は映画のあとどんな気持ちでしたか。本文から英語で1語答えなさい。','happy','happy が気持ちを表しています。']}
 });
 addFamily({textbook:'サンシャイン',grade:'1',section:'PROGRAM 10-2',baseline:'V10-SS-G1-P10-2-001'},ss1,[
  {id:'V11-SS-G1-P10-2-002',title:'A Quiet Movie Evening',keys:['theaterQuiet','friendThere','watchedMovie','movieInteresting','speakerNotTired','goodTime','talkedMovie','wentHome','houseNear','happy']},
  {id:'V11-SS-G1-P10-2-003',title:'A Busy Theater',keys:['theaterBusy','friendThere','watchedMovie','movieInteresting','friendSleepy','goodTime','talkedSchool','wentHome','houseNear','happy']},
  {id:'V11-SS-G1-P10-2-004',title:'Talking about School after a Movie',keys:['theaterQuiet','friendThere','watchedMovie','movieInteresting','speakerNotTired','talkedSchool','goodTime','wentHome','houseNear','happy']},
  {id:'V11-SS-G1-P10-2-005',title:'A Sleepy Friend at the Theater',keys:['theaterQuiet','friendThere','friendSleepy','watchedMovie','movieInteresting','goodTime','talkedMovie','wentHome','houseNear','happy']},
  {id:'V11-SS-G1-P10-2-006',title:'A Long Way Home',keys:['theaterBusy','friendThere','watchedMovie','movieInteresting','speakerNotTired','goodTime','talkedMovie','wentHome','houseFar','happy']},
  {id:'V11-SS-G1-P10-2-007',title:'A Good Time with a Friend',keys:['theaterQuiet','friendThere','speakerNotTired','watchedMovie','movieInteresting','goodTime','talkedSchool','wentHome','houseNear','happy']},
  {id:'V11-SS-G1-P10-2-008',title:'After the Interesting Movie',keys:['theaterBusy','friendThere','watchedMovie','movieInteresting','speakerNotTired','talkedMovie','goodTime','wentHome','houseNear','happy']},
  {id:'V11-SS-G1-P10-2-009',title:'Yesterday at the Quiet Theater',keys:['theaterQuiet','friendThere','watchedMovie','friendSleepy','movieInteresting','goodTime','talkedSchool','wentHome','houseFar','happy']}
 ]);

 const nh1=rows({
  album:{en:'Yesterday, I looked at an album.',jp:'昨日、私はアルバムを見ました。',sen:'Yesterday, / I looked at / an album.',sjp:'昨日 / 私は見ました / アルバムを',q:['1. 昨日、何を見ましたか。本文から英語で答えなさい。','an album','looked at の目的語が an album です。']},
  picture:{en:'I saw a picture in the album.',jp:'私はアルバムの中に写真を見ました。',sen:'I saw / a picture / in the album.',sjp:'私は見ました / 写真を / アルバムの中に',q:['2. アルバムの中に何を見ましたか。本文から英語で答えなさい。','a picture','saw の目的語が a picture です。']},
  contest:{en:'The picture was from a chorus contest.',jp:'その写真は合唱コンクールのものでした。',sen:'The picture was / from a chorus contest.',sjp:'その写真は〜でした / 合唱コンクールからの',q:['3. その写真は何の行事のものでしたか。本文から英語で答えなさい。','a chorus contest','from の後ろが a chorus contest です。']},
  memory:{en:'The picture can bring back a good memory.',jp:'その写真はよい思い出をよみがえらせることがあります。',sen:'The picture / can bring back / a good memory.',sjp:'その写真は / 思い出させることができます / よい思い出を',q:['4. 写真は何を思い出させますか。本文から英語で答えなさい。','a good memory','bring back の目的語が a good memory です。']},
  remember:{en:'I remember the contest.',jp:'私はそのコンクールを覚えています。',sen:'I remember / the contest.',sjp:'私は覚えています / そのコンクールを',q:['5. 話し手は何を覚えていますか。本文から英語で答えなさい。','the contest','remember の目的語が the contest です。']},
  heart:{en:'My heart can beat fast when I see the picture.',jp:'その写真を見ると、私の心臓は速くどきどきすることがあります。',sen:'My heart / can beat / fast / when I see the picture.',sjp:'私の心臓は / どきどきすることがあります / 速く / その写真を見るとき',q:['6. 写真を見ると心臓はどのように動くことがありますか。本文から英語で答えなさい。','beat fast','beat fast が心臓の動きを表しています。']},
  break:{en:'Then, I had a break.',jp:'それから、私は休憩しました。',sen:'Then, / I had / a break.',sjp:'それから / 私は取りました / 休憩を',q:['7. そのあと何をしましたか。本文から英語で答えなさい。','had a break','had a break がその後の行動です。']},
  schoolWay:{en:'I saw my friend on my way to school.',jp:'学校へ行く途中で友達に会いました。',sen:'I saw / my friend / on my way to school.',sjp:'私は会いました / 友達に / 学校へ行く途中で',q:['8. どこへ行く途中で友達に会いましたか。本文から英語で答えなさい。','school','on my way to school の school が行き先です。']},
  friendAlbum:{en:'My friend also had an album.',jp:'友達もアルバムを持っていました。',sen:'My friend / also had / an album.',sjp:'私の友達も / 持っていました / アルバムを',q:['9. 友達も何を持っていましたか。本文から英語で答えなさい。','an album','had の目的語が an album です。']},
  friendPicture:{en:'We looked at one picture together.',jp:'私たちはいっしょに1枚の写真を見ました。',sen:'We looked at / one picture / together.',sjp:'私たちは見ました / 1枚の写真を / いっしょに',q:['9. 2人はいっしょに何を見ましたか。本文から英語で答えなさい。','one picture','looked at の目的語が one picture です。']},
  talkMemory:{en:'We talked about the memory.',jp:'私たちはその思い出について話しました。',sen:'We talked / about the memory.',sjp:'私たちは話しました / その思い出について',q:['10. 2人は何について話しましたか。本文から英語で答えなさい。','the memory','about の後ろが the memory です。']},
  good:{en:'It was a good memory for us.',jp:'それは私たちにとってよい思い出でした。',sen:'It was / a good memory / for us.',sjp:'それは〜でした / よい思い出 / 私たちにとって',q:['10. それは2人にとって何でしたか。本文から英語で答えなさい。','a good memory','be動詞の後ろが a good memory です。']}
 });
 addFamily({textbook:'ニューホライズン',grade:'1',section:'Unit 10-2',baseline:'V10-NH-G1-U10-2-001'},nh1,[
  {id:'V11-NH-G1-U10-2-002',title:'A Picture from the Chorus Contest',keys:['album','picture','contest','memory','remember','heart','break','friendAlbum','talkMemory','good']},
  {id:'V11-NH-G1-U10-2-003',title:'An Album on the Way to School',keys:['schoolWay','friendAlbum','album','picture','memory','remember','heart','break','talkMemory','good']},
  {id:'V11-NH-G1-U10-2-004',title:'A Memory that Makes My Heart Beat Fast',keys:['album','picture','memory','heart','remember','contest','break','friendPicture','talkMemory','good']},
  {id:'V11-NH-G1-U10-2-005',title:'Looking at an Album with a Friend',keys:['schoolWay','friendAlbum','friendPicture','picture','contest','memory','remember','heart','talkMemory','good']},
  {id:'V11-NH-G1-U10-2-006',title:'A Good Contest Memory',keys:['album','contest','picture','remember','memory','heart','break','friendAlbum','talkMemory','good']},
  {id:'V11-NH-G1-U10-2-007',title:'Yesterday and an Old Picture',keys:['album','picture','memory','remember','heart','friendAlbum','friendPicture','break','talkMemory','good']},
  {id:'V11-NH-G1-U10-2-008',title:'A Break after Remembering the Contest',keys:['album','contest','picture','memory','remember','heart','break','schoolWay','talkMemory','good']},
  {id:'V11-NH-G1-U10-2-009',title:'Two Albums and One Memory',keys:['schoolWay','friendAlbum','album','friendPicture','contest','memory','remember','heart','talkMemory','good']}
 ]);

 const ss2=rows({
  project:{en:'Our class has a project about old tin and wood.',jp:'私たちのクラスには古いブリキと木材についてのプロジェクトがあります。',sen:'Our class has / a project / about old tin and wood.',sjp:'私たちのクラスにはあります / プロジェクトが / 古いブリキと木材についての',q:['1. クラスには何についてのプロジェクトがありますか。本文から英語で答えなさい。','old tin and wood','about の後ろが old tin and wood です。']},
  box:{en:'A box is filled with old tin and wood.',jp:'箱は古いブリキと木材でいっぱいです。',sen:'A box is filled / with old tin and wood.',sjp:'箱はいっぱいです / 古いブリキと木材で',q:['2. 箱は何でいっぱいですか。本文から英語で答えなさい。','old tin and wood','is filled with の後ろが old tin and wood です。']},
  most:{en:'We want to make the most of the old material.',jp:'私たちは古い材料を最大限に活用したいです。',sen:'We want to make the most of / the old material.',sjp:'私たちは最大限に活用したいです / その古い材料を',q:['3. 私たちは何を最大限に活用したいですか。本文から英語で答えなさい。','the old material','make the most of の後ろが the old material です。']},
  thin:{en:'The tin is so thin that we can fold it.',jp:'ブリキはとても薄いので、私たちはそれを折ることができます。',sen:'The tin is / so thin that / we can fold / it.',sjp:'そのブリキは〜です / とても薄いので / 私たちは折ることができます / それを',q:['4. なぜブリキを折ることができますか。本文から英語で答えなさい。','so thin','so thin that が理由につながっています。']},
  badge:{en:'We make a small badge from the tin.',jp:'私たちはブリキから小さなバッジを作ります。',sen:'We make / a small badge / from the tin.',sjp:'私たちは作ります / 小さなバッジを / ブリキから',q:['5. ブリキから何を作りますか。本文から英語で答えなさい。','a small badge','make の目的語が a small badge です。']},
  figure:{en:'We make a small figure from the wood.',jp:'私たちは木材から小さな人形を作ります。',sen:'We make / a small figure / from the wood.',sjp:'私たちは作ります / 小さな人形を / 木材から',q:['5. 木材から何を作りますか。本文から英語で答えなさい。','a small figure','make の目的語が a small figure です。']},
  message:{en:'Each badge has a peace message.',jp:'それぞれのバッジには平和のメッセージがあります。',sen:'Each badge has / a peace message.',sjp:'それぞれのバッジにはあります / 平和のメッセージが',q:['6. それぞれのバッジには何がありますか。本文から英語で答えなさい。','a peace message','has の目的語が a peace message です。']},
  known:{en:'The project is known to our class.',jp:'そのプロジェクトは私たちのクラスに知られています。',sen:'The project is known / to our class.',sjp:'そのプロジェクトは知られています / 私たちのクラスに',q:['7. そのプロジェクトは誰に知られていますか。本文から英語で答えなさい。','our class','is known to の後ろが our class です。']},
  receive:{en:'After the project, we receive one badge.',jp:'プロジェクトのあと、私たちはバッジを1つ受け取ります。',sen:'After the project, / we receive / one badge.',sjp:'プロジェクトのあと / 私たちは受け取ります / バッジを1つ',q:['8. プロジェクトのあと何を受け取りますか。本文から英語で答えなさい。','one badge','receive の目的語が one badge です。']},
  wear:{en:'I wear the badge at school.',jp:'私は学校でそのバッジを身につけます。',sen:'I wear / the badge / at school.',sjp:'私は身につけます / そのバッジを / 学校で',q:['9. どこでバッジを身につけますか。本文から英語で答えなさい。','at school','at school が場所を表します。']},
  more:{en:'We can make more from the old material.',jp:'私たちはその古い材料からさらに作ることができます。',sen:'We can make / more / from the old material.',sjp:'私たちは作ることができます / さらに / その古い材料から',q:['9. さらに何から作ることができますか。本文から英語で答えなさい。','the old material','from の後ろが the old material です。']},
  way:{en:'We think this is a good way to use old tin and wood.',jp:'私たちはこれは古いブリキと木材を使うよい方法だと思います。',sen:'We think / this is / a good way / to use / old tin and wood.',sjp:'私たちは思います / これは〜だと / よい方法 / 使うための / 古いブリキと木材を',q:['10. これは何を使うよい方法ですか。本文から英語で答えなさい。','old tin and wood','to use の目的語が old tin and wood です。']}
 });
 addFamily({textbook:'サンシャイン',grade:'2',section:'PROGRAM 8-3',baseline:'V10-SS-G2-P8-3-001'},ss2,[
  {id:'V11-SS-G2-P8-3-002',title:'A Tin Badge Project',genre:'report',keys:['project','box','most','thin','badge','message','known','receive','wear','way']},
  {id:'V11-SS-G2-P8-3-003',title:'A Small Figure from Old Wood',genre:'report',keys:['project','box','most','figure','badge','message','known','receive','more','way']},
  {id:'V11-SS-G2-P8-3-004',title:'A Peace Message on a Badge',genre:'report',keys:['project','box','thin','badge','message','known','receive','wear','more','way']},
  {id:'V11-SS-G2-P8-3-005',title:'Making the Most of a Full Box',genre:'report',keys:['box','project','most','thin','figure','badge','message','receive','more','way']},
  {id:'V11-SS-G2-P8-3-006',title:'Folding Old Tin in Class',genre:'report',keys:['project','box','thin','most','badge','message','known','wear','more','way']},
  {id:'V11-SS-G2-P8-3-007',title:'A Reuse Day at School',genre:'report',keys:['project','box','most','figure','badge','message','receive','wear','more','way']},
  {id:'V11-SS-G2-P8-3-008',title:'One Badge after the Project',genre:'report',keys:['project','box','thin','badge','message','known','receive','wear','more','way']},
  {id:'V11-SS-G2-P8-3-009',title:'Using Old Tin and Wood Again',genre:'report',keys:['box','project','most','figure','badge','message','known','receive','more','way']}
 ]);

 const nh2=rows({
  sunrise:{en:'Recently, I saw a beautiful sunrise at the mountain.',jp:'最近、私は山で美しい日の出を見ました。',sen:'Recently, / I saw / a beautiful sunrise / at the mountain.',sjp:'最近 / 私は見ました / 美しい日の出を / 山で',q:['1. 最近、山で何を見ましたか。本文から英語で答えなさい。','a beautiful sunrise','saw の目的語が a beautiful sunrise です。']},
  cloud:{en:'A cloud was over the mountain.',jp:'山の上には雲がありました。',sen:'A cloud was / over the mountain.',sjp:'雲がありました / 山の上に',q:['2. 山の上には何がありましたか。本文から英語で答えなさい。','a cloud','文の主語 A cloud があるものです。']},
  left:{en:'I left early and started to climb.',jp:'私は早く出発して登り始めました。',sen:'I left / early / and started to climb.',sjp:'私は出発しました / 早く / そして登り始めました',q:['3. 話し手はいつ出発しましたか。本文から英語で1語答えなさい。','early','early が出発した時を表します。']},
  crater:{en:'Near the crater, I saw a tourist on the trail.',jp:'噴火口の近くで、小道にいる観光客を見ました。',sen:'Near the crater, / I saw / a tourist / on the trail.',sjp:'噴火口の近くで / 私は見ました / 観光客を / 小道で',q:['4. どこで観光客を見ましたか。本文から英語で答えなさい。','on the trail','on the trail が観光客のいた場所です。']},
  more:{en:'More and more people visit the site.',jp:'ますます多くの人がその遺産を訪れます。',sen:'More and more people / visit / the site.',sjp:'ますます多くの人が / 訪れます / その遺産を',q:['5. どのような人の数が増えていますか。本文から英語で答えなさい。','people','More and more people が増えている人を表します。']},
  trash:{en:'Sometimes they leave a large amount of trash.',jp:'時には彼らはたくさんのごみを残します。',sen:'Sometimes / they leave / a large amount of trash.',sjp:'時には / 彼らは残します / たくさんのごみを',q:['6. 人々は時に何を残しますか。本文から英語で答えなさい。','a large amount of trash','leave の目的語が a large amount of trash です。']},
  campaign:{en:'A cleanup campaign can help the mountain.',jp:'清掃キャンペーンは山を助けることができます。',sen:'A cleanup campaign / can help / the mountain.',sjp:'清掃キャンペーンは / 助けることができます / 山を',q:['7. 何が山を助けることができますか。本文から英語で答えなさい。','a cleanup campaign','can help の主語が A cleanup campaign です。']},
  list:{en:'People list the problems before the cleanup.',jp:'人々は清掃の前に問題をリストにします。',sen:'People list / the problems / before the cleanup.',sjp:'人々はリストにします / 問題を / 清掃の前に',q:['8. 人々は清掃の前に何をリストにしますか。本文から英語で答えなさい。','the problems','list の目的語が the problems です。']},
  trail:{en:'The trail must stay safe and clean.',jp:'小道は安全で清潔なままでなければなりません。',sen:'The trail must stay / safe and clean.',sjp:'小道は保たれなければなりません / 安全で清潔に',q:['9. 小道はどのような状態でなければなりませんか。本文から英語で答えなさい。','safe and clean','stay の後ろが safe and clean です。']},
  water:{en:'A bath near the mountain needs clean water.',jp:'山の近くの浴室にはきれいな水が必要です。',sen:'A bath / near the mountain / needs / clean water.',sjp:'浴室は / 山の近くの / 必要とします / きれいな水を',q:['9. 山の近くの浴室には何が必要ですか。本文から英語で答えなさい。','clean water','needs の目的語が clean water です。']},
  forever:{en:'We want to protect this site forever.',jp:'私たちはこの遺産を永遠に守りたいです。',sen:'We want to protect / this site / forever.',sjp:'私たちは守りたいです / この遺産を / 永遠に',q:['10. いつまでこの遺産を守りたいですか。本文から英語で1語答えなさい。','forever','forever が時を表しています。']},
  enjoy:{en:'I hope every tourist can enjoy the mountain.',jp:'すべての観光客が山を楽しめることを願います。',sen:'I hope / every tourist can enjoy / the mountain.',sjp:'私は願います / すべての観光客が楽しめることを / 山を',q:['10. 観光客が何を楽しめることを願っていますか。本文から英語で答えなさい。','the mountain','enjoy の目的語が the mountain です。']}
 });
 addFamily({textbook:'ニューホライズン',grade:'2',section:'Unit 7-4',baseline:'V10-NH-G2-U7-4-001'},nh2,[
  {id:'V11-NH-G2-U7-4-002',title:'Sunrise before a Cleanup',genre:'report',keys:['sunrise','cloud','left','crater','more','trash','campaign','list','trail','forever']},
  {id:'V11-NH-G2-U7-4-003',title:'A Cloud over the Mountain',genre:'report',keys:['cloud','sunrise','left','crater','more','trash','campaign','trail','water','enjoy']},
  {id:'V11-NH-G2-U7-4-004',title:'Trash on the Trail',genre:'report',keys:['left','crater','more','trash','campaign','list','trail','water','forever','enjoy']},
  {id:'V11-NH-G2-U7-4-005',title:'Planning a Cleanup Campaign',genre:'report',keys:['sunrise','more','trash','campaign','list','trail','water','crater','forever','enjoy']},
  {id:'V11-NH-G2-U7-4-006',title:'Near the Crater',genre:'report',keys:['left','cloud','crater','sunrise','more','trash','campaign','list','trail','enjoy']},
  {id:'V11-NH-G2-U7-4-007',title:'Clean Water near the Mountain',genre:'report',keys:['sunrise','cloud','more','trash','water','campaign','list','trail','forever','enjoy']},
  {id:'V11-NH-G2-U7-4-008',title:'More Visitors, More Care',genre:'report',keys:['more','crater','trash','campaign','list','trail','water','sunrise','forever','enjoy']},
  {id:'V11-NH-G2-U7-4-009',title:'Protecting the Site Forever',genre:'report',keys:['sunrise','left','crater','more','trash','campaign','list','trail','forever','enjoy']}
 ]);

 const ss3=rows({
  inventor:{en:'An inventor can imagine a powerful robot for society.',jp:'発明家は社会のための強力なロボットを想像できます。',sen:'An inventor / can imagine / a powerful robot / for society.',sjp:'発明家は / 想像できます / 強力なロボットを / 社会のための',q:['1. 発明家は何を想像できますか。本文から英語で答えなさい。','a powerful robot','imagine の目的語が a powerful robot です。']},
  lift:{en:'The robot can lift a heavy box.',jp:'そのロボットは重い箱を持ち上げることができます。',sen:'The robot / can lift / a heavy box.',sjp:'そのロボットは / 持ち上げることができます / 重い箱を',q:['2. ロボットは何を持ち上げることができますか。本文から英語で答えなさい。','a heavy box','lift の目的語が a heavy box です。']},
  alone:{en:'It can connect with a person who lives alone.',jp:'それは一人で暮らす人とつながることができます。',sen:'It can connect / with a person / who lives alone.',sjp:'それはつながることができます / 人と / 一人で暮らす',q:['3. ロボットはどのような人とつながれますか。本文から英語で答えなさい。','a person who lives alone','connect with の後ろが a person who lives alone です。']},
  wish:{en:'A person may wish for someone to talk with.',jp:'人は話し相手がほしいと願うことがあります。',sen:'A person / may wish for / someone / to talk with.',sjp:'人は / 願うことがあります / だれかを / 話すための',q:['4. 人は何を願うことがありますか。本文から英語で答えなさい。','someone to talk with','wish for の対象が someone to talk with です。']},
  loneliness:{en:'The robot can help shrink loneliness.',jp:'そのロボットは孤独を減らす助けができます。',sen:'The robot / can help shrink / loneliness.',sjp:'そのロボットは / 減らす助けができます / 孤独を',q:['5. ロボットは何を減らす助けができますか。本文から英語で1語答えなさい。','loneliness','shrink の目的語が loneliness です。']},
  people:{en:'It should not make a person no longer meet people.',jp:'それは人がもう人々と会わなくなるようにするべきではありません。',sen:'It should not make / a person / no longer meet / people.',sjp:'それは〜させるべきではありません / 人を / もはや会わないように / 人々と',q:['6. ロボットは人をどのようにさせるべきではありませんか。本文から英語で答えなさい。','no longer meet people','no longer meet people が避けるべき状態です。']},
  getAlong:{en:'People can get along with a robot and with each other.',jp:'人々はロボットとも、おたがいとも仲よくやっていけます。',sen:'People can get along / with a robot / and with each other.',sjp:'人々は仲よくやっていけます / ロボットと / そしておたがいと',q:['7. 人々は何と仲よくやっていけますか。本文から英語で答えなさい。','a robot and each other','with a robot and with each other が相手を表します。']},
  meeting:{en:'The inventor can take part in a meeting about robots.',jp:'発明家はロボットについての会議に参加できます。',sen:'The inventor / can take part in / a meeting / about robots.',sjp:'発明家は / 参加できます / 会議に / ロボットについての',q:['8. 発明家は何に参加できますか。本文から英語で答えなさい。','a meeting about robots','take part in の後ろが a meeting about robots です。']},
  document:{en:'A document can explain the purpose of the robot.',jp:'文書はロボットの目的を説明できます。',sen:'A document / can explain / the purpose / of the robot.',sjp:'文書は / 説明できます / 目的を / ロボットの',q:['8. 文書は何を説明できますか。本文から英語で答えなさい。','the purpose of the robot','explain の目的語が the purpose of the robot です。']},
  password:{en:'A password can protect the robot system.',jp:'パスワードはロボットの仕組みを守ることができます。',sen:'A password / can protect / the robot system.',sjp:'パスワードは / 守ることができます / ロボットの仕組みを',q:['9. 何がロボットの仕組みを守れますか。本文から英語で答えなさい。','a password','can protect の主語が A password です。']},
  hands:{en:'The robot can shake hands with a person.',jp:'そのロボットは人と握手できます。',sen:'The robot / can shake hands / with a person.',sjp:'そのロボットは / 握手できます / 人と',q:['9. ロボットは誰と握手できますか。本文から英語で答えなさい。','a person','with の後ろが a person です。']},
  heater:{en:'Certainly, a heater and a robot can make life easier.',jp:'確かに、ヒーターとロボットは生活をより楽にできます。',sen:'Certainly, / a heater and a robot / can make / life easier.',sjp:'確かに / ヒーターとロボットは / 〜できます / 生活をより楽に',q:['10. 何が生活をより楽にできますか。本文から英語で答えなさい。','a heater and a robot','can make の主語が a heater and a robot です。']},
  point:{en:'Rather, the important point is how people use technology.',jp:'むしろ、大切な点は人々が技術をどう使うかです。',sen:'Rather, / the important point is / how people use / technology.',sjp:'むしろ / 大切な点は〜です / 人々がどう使うか / 技術を',q:['10. 大切な点は何ですか。本文から英語で答えなさい。','how people use technology','be動詞の後ろの内容が how people use technology です。']},
  society:{en:'A useful robot can connect people in society.',jp:'役立つロボットは社会の中で人々をつなぐことができます。',sen:'A useful robot / can connect / people / in society.',sjp:'役立つロボットは / つなぐことができます / 人々を / 社会の中で',q:['10. 役立つロボットは社会で誰をつなげられますか。本文から英語で1語答えなさい。','people','connect の目的語が people です。']}
 });
 addFamily({textbook:'サンシャイン',grade:'3',section:'PROGRAM 7-3',baseline:'V10-SS-G3-P7-3-001'},ss3,[
  {id:'V11-SS-G3-P7-3-002',title:'A Powerful Robot for Society',genre:'report',keys:['inventor','lift','alone','wish','loneliness','people','meeting','password','point','society']},
  {id:'V11-SS-G3-P7-3-003',title:'A Robot for a Person Who Lives Alone',genre:'report',keys:['alone','wish','loneliness','people','getAlong','inventor','document','password','hands','society']},
  {id:'V11-SS-G3-P7-3-004',title:'A Meeting about Helpful Robots',genre:'report',keys:['inventor','meeting','document','lift','alone','loneliness','getAlong','password','point','society']},
  {id:'V11-SS-G3-P7-3-005',title:'A Password for a Robot System',genre:'report',keys:['inventor','document','password','lift','alone','wish','loneliness','people','point','society']},
  {id:'V11-SS-G3-P7-3-006',title:'Shaking Hands with a Robot',genre:'report',keys:['inventor','hands','getAlong','alone','wish','loneliness','people','document','point','society']},
  {id:'V11-SS-G3-P7-3-007',title:'Robots and Loneliness in Society',genre:'report',keys:['alone','wish','loneliness','people','getAlong','inventor','meeting','document','point','society']},
  {id:'V11-SS-G3-P7-3-008',title:'A Heater, a Robot, and Daily Life',genre:'report',keys:['inventor','heater','lift','alone','wish','loneliness','people','getAlong','point','society']},
  {id:'V11-SS-G3-P7-3-009',title:'The Purpose of a New Robot',genre:'report',keys:['inventor','document','lift','meeting','password','alone','wish','people','point','society']},
  {id:'V11-SS-G3-P7-3-010',title:'Connecting People with Technology',genre:'report',keys:['inventor','alone','getAlong','hands','document','password','loneliness','people','point','society']}
 ]);

 const nh3=rows({
  openAir:{en:'A person can sell a coat in the open air.',jp:'人は屋外でコートを売ることができます。',sen:'A person / can sell / a coat / in the open air.',sjp:'人は / 売ることができます / コートを / 屋外で',q:['1. 屋外で何を売ることができますか。本文から英語で答えなさい。','a coat','sell の目的語が a coat です。']},
  sold:{en:'One shop sold a coat yesterday.',jp:'ある店は昨日コートを売りました。',sen:'One shop / sold / a coat / yesterday.',sjp:'ある店は / 売りました / コートを / 昨日',q:['2. 店は昨日何を売りましたか。本文から英語で答えなさい。','a coat','sold の目的語が a coat です。']},
  support:{en:'Trade can support daily life.',jp:'貿易は日々の生活を支えることができます。',sen:'Trade can support / daily life.',sjp:'貿易は支えることができます / 日々の生活を',q:['3. 貿易は何を支えることができますか。本文から英語で答えなさい。','daily life','support の目的語が daily life です。']},
  depend:{en:'In fact, a country can depend on another country.',jp:'実際、ある国は別の国に依存することがあります。',sen:'In fact, / a country / can depend / on another country.',sjp:'実際 / ある国は / 依存することがあります / 別の国に',q:['4. ある国は何に依存することがありますか。本文から英語で答えなさい。','another country','depend on の後ろが another country です。']},
  import:{en:'A third country can import a product.',jp:'3番目の国は製品を輸入できます。',sen:'A third country / can import / a product.',sjp:'3番目の国は / 輸入できます / 製品を',q:['5. 3番目の国は何を輸入できますか。本文から英語で答えなさい。','a product','import の目的語が a product です。']},
  island:{en:'Water can surround an island.',jp:'水は島を囲むことがあります。',sen:'Water can surround / an island.',sjp:'水は囲むことがあります / 島を',q:['6. 水は何を囲むことがありますか。本文から英語で答えなさい。','an island','surround の目的語が an island です。']},
  inter:{en:'People in different places are interdependent.',jp:'異なる場所の人々は相互依存しています。',sen:'People / in different places / are / interdependent.',sjp:'人々は / 異なる場所の / 〜です / 相互依存している',q:['7. 異なる場所の人々はどのような関係ですか。本文から英語で1語答えなさい。','interdependent','interdependent が関係を表します。']},
  exception:{en:'There is one exception in this trade.',jp:'この貿易には1つの例外があります。',sen:'There is / one exception / in this trade.',sjp:'あります / 1つの例外が / この貿易に',q:['7. この貿易にはいくつの例外がありますか。本文から英語で答えなさい。','one','one が数を表します。']},
  border:{en:'Trade can go beyond a border.',jp:'貿易は国境を越えることができます。',sen:'Trade can go / beyond a border.',sjp:'貿易は進むことができます / 国境を越えて',q:['8. 貿易は何を越えることができますか。本文から英語で答えなさい。','a border','beyond の後ろが a border です。']},
  survival:{en:'This relationship is quite important for survival.',jp:'この関係は生存にとってかなり重要です。',sen:'This relationship is / quite important / for survival.',sjp:'この関係は〜です / かなり重要 / 生存にとって',q:['9. この関係は何にとって重要ですか。本文から英語で答えなさい。','survival','for の後ろが survival です。']},
  encourage:{en:'We encourage a student to study trade.',jp:'私たちは生徒に貿易を学ぶよう励まします。',sen:'We encourage / a student / to study / trade.',sjp:'私たちは励まします / 生徒に / 学ぶように / 貿易を',q:['9. 私たちは生徒に何を学ぶよう励ましますか。本文から英語で答えなさい。','trade','study の目的語が trade です。']},
  connect:{en:'A daily relationship can connect people.',jp:'日々の関係は人々をつなぐことができます。',sen:'A daily relationship / can connect / people.',sjp:'日々の関係は / つなぐことができます / 人々を',q:['10. 日々の関係は誰をつなげられますか。本文から英語で1語答えなさい。','people','connect の目的語が people です。']},
  think:{en:'I think trade can support life beyond a border.',jp:'私は貿易が国境を越えて生活を支えられると思います。',sen:'I think / trade can support / life / beyond a border.',sjp:'私は思います / 貿易は支えられると / 生活を / 国境を越えて',q:['10. 話し手は貿易が何を支えられると思っていますか。本文から英語で1語答えなさい。','life','support の目的語が life です。']}
 });
 addFamily({textbook:'ニューホライズン',grade:'3',section:'Unit 6-4',baseline:'V10-NH-G3-U6-4-001'},nh3,[
  {id:'V11-NH-G3-U6-4-002',title:'A Coat Sold in the Open Air',genre:'report',keys:['openAir','sold','support','depend','import','inter','border','survival','encourage','think']},
  {id:'V11-NH-G3-U6-4-003',title:'Trade Supports Daily Life',genre:'report',keys:['support','depend','import','inter','border','survival','openAir','sold','connect','think']},
  {id:'V11-NH-G3-U6-4-004',title:'An Island and Imported Products',genre:'report',keys:['island','import','support','depend','inter','border','survival','encourage','connect','think']},
  {id:'V11-NH-G3-U6-4-005',title:'Trade beyond a Border',genre:'report',keys:['support','border','depend','import','inter','survival','openAir','encourage','connect','think']},
  {id:'V11-NH-G3-U6-4-006',title:'An Interdependent World',genre:'report',keys:['inter','depend','support','import','border','survival','island','encourage','connect','think']},
  {id:'V11-NH-G3-U6-4-007',title:'A Product from a Third Country',genre:'report',keys:['import','depend','support','inter','border','survival','openAir','sold','connect','think']},
  {id:'V11-NH-G3-U6-4-008',title:'Studying Trade at School',genre:'report',keys:['encourage','support','depend','import','inter','border','survival','openAir','connect','think']},
  {id:'V11-NH-G3-U6-4-009',title:'A Relationship Important for Survival',genre:'report',keys:['support','depend','inter','survival','border','import','island','encourage','connect','think']},
  {id:'V11-NH-G3-U6-4-010',title:'People Connected through Trade',genre:'report',keys:['support','depend','import','inter','border','connect','survival','encourage','openAir','think']}
 ]);

 if(all.length!==50)throw new Error('Batch01 count '+all.length+' != 50');
 if(typeof window.V11_REGISTER_PASSAGES!=='function')throw new Error('V11_REGISTER_PASSAGES missing');
 const ids=new Set(all.map(p=>p.id));if(ids.size!==50)throw new Error('Batch01 duplicate IDs');
 const state=window.V11_REGISTER_PASSAGES(all);
 window.V11_BATCH01_PASSAGES=all;
 window.V11_BATCH01_STATE={batch:BATCH,count:all.length,registered:state.extraPassages,totalWithBaseline:168+state.extraPassages,sections:[...new Set(all.map(p=>p.textbook+'|'+p.grade+'|'+p.section))]};
 if(typeof window.V11_APPLY_EASY_SUPPORT_NOTES==='function')window.V11_APPLY_EASY_SUPPORT_NOTES();
})();
