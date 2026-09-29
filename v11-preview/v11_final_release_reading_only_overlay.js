/* v11 final-release reading-only overlay. Removes legacy composition artifacts without changing passage count. */
(function applyV11FinalReleaseReadingOnly(){
'use strict';
if(window.V11_FINAL_RELEASE_READING_ONLY_APPLIED)return;
const all=Object.values(window.V11_EXTRA_PASSAGES||{}).flat();
const byId=new Map(all.map(p=>[String(p&&p.id||''),p]));
const log={removedFreeWriteFields:[],replacedQuestions:[],bodySync:[]};
function replaceB5(id,q){
 const p=byId.get(id); if(!p)throw new Error('reading-only overlay missing '+id);
 if(!Array.isArray(p.questionSetB)||p.questionSetB.length!==5)throw new Error(id+' B set invalid');
 p.questionSetB[4]=q; if(Array.isArray(p.questionsB)&&p.questionsB.length===5)p.questionsB[4]=q;
 log.replacedQuestions.push(id);
}
function repairEvidence(id,set,no,evidence,evidenceJp){
 const p=byId.get(id); if(!p)throw new Error('evidence repair missing '+id);
 const arr=set==='A'?p.questions:p.questionSetB;
 if(!Array.isArray(arr)||!arr[no-1])throw new Error(id+' '+set+no+' missing question');
 arr[no-1].evidence=evidence;
 arr[no-1].evidenceJp=evidenceJp;
 if(set==='B'&&Array.isArray(p.questionsB)&&p.questionsB[no-1]){
   p.questionsB[no-1].evidence=evidence;
   p.questionsB[no-1].evidenceJp=evidenceJp;
 }
}
function replaceQ(id,set,no,q){
 const p=byId.get(id); if(!p)throw new Error('reading-only overlay missing '+id);
 const arr=set==='A'?p.questions:p.questionSetB;
 if(!Array.isArray(arr)||arr.length!==5)throw new Error(id+' '+set+' set invalid');
 arr[no-1]={...q,set,no};
 if(set==='B'&&Array.isArray(p.questionsB)&&p.questionsB.length===5)p.questionsB[no-1]=arr[no-1];
 log.replacedQuestions.push(id+':'+set+no);
}
for(const p of all){
 if(!p)continue;
 if(Object.prototype.hasOwnProperty.call(p,'freeWriteTask')){delete p.freeWriteTask;log.removedFreeWriteFields.push(p.id+':freeWriteTask')}
 if(Object.prototype.hasOwnProperty.call(p,'freeWrite')){delete p.freeWrite;log.removedFreeWriteFields.push(p.id+':freeWrite')}
}
replaceB5('V11-B09-G3-016',{
 questionType:'SUMMARY_FILL',type:'SUMMARY_FILL',set:'B',no:5,
 prompt:'Complete the summary: The guide worked because it offered different safe actions for different ____.',
 answer:'times and conditions',
 evidence:'The guide worked because it offered different safe actions for different times and conditions.',
 evidenceJp:'時間や状況に応じた異なる安全行動を示したため案内は役立ちました。',
 reason:'本文の結論を要約し、時間帯と状況に応じて行動を変える点を読み取る問題です。'
});
replaceB5('V11-B10-G3-016',{
 questionType:'SUMMARY_FILL',type:'SUMMARY_FILL',set:'B',no:5,
 prompt:'Complete the summary: Winter-event safety required an indoor venue plus capacity, opening hours, transport seats, updated permission, and a ____.',
 answer:'cancellation rule',
 evidence:'The organizers learned that moving indoors is only one part of winter safety; capacity, opening hours, transport seats, updated permission, and a cancellation rule must also fit together.',
 evidenceJp:'主催者は、屋内化だけが冬の安全対策ではなく、定員、開館時間、交通座席、更新した許可、中止基準も組み合わせる必要があると学びました。',
 reason:'最終文に示された複数条件を統合して読む要約補充です。'
});
{
 const id='V11-B13-G3-014',p=byId.get(id);if(!p)throw new Error('reading-only overlay missing '+id);
 const en='For the optional writing task, students were asked to give one 20-30 word recommendation for another class visiting the event on a hot day and include a reason connected to the schedule or map.';
 const jp='別枠の英作文では、暑い日にこのイベントを訪れる別のクラスへのおすすめを20〜30語で一つ書き、予定表または地図に関係する理由を含めるよう求めます。';
 if(String(p.body||'').includes(en))p.body=String(p.body).replace(/\n\n?For the optional writing task,[\s\S]*?schedule or map\./,'').trim();
 if(String(p.fullTranslation||'').includes(jp))p.fullTranslation=String(p.fullTranslation).replace(/\n\n?別枠の英作文では、暑い日にこのイベントを訪れる別のクラスへのおすすめを20〜30語で一つ書き、予定表または地図に関係する理由を含めるよう求めます。/,'').trim();
 if(Array.isArray(p.sentences))p.sentences=p.sentences.filter(x=>x!==en);
 if(Array.isArray(p.slashRows))p.slashRows=p.slashRows.filter(x=>String(x&&x.en||'')!==en);
 log.bodySync.push(id);
}
replaceB5('V11-B13-G3-014',{
 questionType:'SUMMARY_FILL',type:'SUMMARY_FILL',set:'B',no:5,
 prompt:'Complete the summary: The solar-car options were less suitable because the group had to combine heat-warning time, shade and water, activity times, and the ____.',
 answer:'shuttle schedule',
 evidence:'The time of the warning, the lack of shade and water at Field A, the activity times, and the shuttle schedule all made the two solar-car options less suitable for this class visit.',
 evidenceJp:'警報の時間、Field Aに日陰と給水場所がないこと、活動時刻、シャトル時刻を合わせると、二つのソーラーカー回は今回のクラス訪問には適しにくかったのです。',
 reason:'本文の最終判断を構成する四つの条件を統合して読む要約補充です。'
});

/* EVIDENCE_REPAIR_PART1: replace slash/ellipsis shorthand with exact current-body evidence. */
repairEvidence('V11-B14-G1-003','B',4,
 ['She first looked for her name, but the labels only showed the letters S.K. and S.M.','She carefully opened only the small outside pocket of the S.K. bag and saw the red card.'],
 ['最初に名前を探しましたが、札にはS.K.とS.M.という文字しかありませんでした。','S.K.の袋の小さな外ポケットだけを注意して開けると、赤いカードが見えました。']);
repairEvidence('V11-B14-G1-007','B',3,
 ['At 1:05, she heard it again near the library.','It said, “Reading Week book return: 1:00-1:15.”'],
 ['1時5分、図書室の近くでまた音がしました。','掲示には「読書週間の本の返却：1時〜1時15分」とありました。']);
repairEvidence('V11-B14-G1-011','A',1,
 ["Every student's name was on the list, but Seat 12 was empty.",'Maybe one student had no seat.'],
 ['生徒全員の名前がありましたが、12番の席だけ空いていました。','だれか一人に席がないのかもしれないと思いました。']);
repairEvidence('V11-B14-G1-011','B',2,
 ["Then she saw a small note beside Seat 12: ‘Camera box.’",'The empty seat had a job of its own.'],
 ['しかし12番の横には「カメラ箱」と小さく書かれていました。','その空席には別の役目があったのです。']);
repairEvidence('V11-B14-G1-011','B',4,
 ["Then she saw a small note beside Seat 12: ‘Camera box.’",'Yuna counted the names again.'],
 ['しかし12番の横には「カメラ箱」と小さく書かれていました。','ユナがもう一度名前を数えました。']);
repairEvidence('V11-B16-G1-001','B',4,
 ['Many said they wanted a quiet place with natural light, but they did not want to carry several books across the room.','We moved one shelf of popular books closer to the windows and added two small tables.'],
 ['多くの生徒は自然光のある静かな場所を望んでいましたが、何冊もの本を部屋の反対側まで運びたくはありませんでした。','人気の本の棚を一つ窓の近くへ移し、小さな机を二つ加えました。']);
repairEvidence('V11-B16-G1-003','B',1,
 'Mika brought a large water bottle to practice every day, but she often took much of it home.',
 'ミカは毎日練習に大きな水筒を持って行きましたが、その水の多くを家へ持ち帰っていました。');
repairEvidence('V11-B16-G1-005','B',1,
 ['Two kinds of bread were sold at the same table, and students often waited while others decided which one to buy.','The council put pictures of both kinds near the entrance and made two short lines at the table.'],
 ['同じ机で二種類のパンを売っていて、ほかの生徒がどちらを買うか決める間、待つことがよくありました。','生徒会は入口近くに両方のパンの写真を置き、机では二つの短い列を作りました。']);
repairEvidence('V11-B16-G1-007','B',1,
 ['New students sometimes got lost between the gym and the music room.','They learned that the problem was not the whole map.'],
 ['新入生は体育館から音楽室へ行く途中で迷うことがありました。','問題は地図全体ではないと分かりました。']);

/* EVIDENCE_REPAIR_PART2: exact current-body evidence for the remaining final-release mismatches. */
repairEvidence('V11-B16-G1-017','B',2,
 ['The class checked its schedule and found that different students were last in the room on different days.','The last person leaving turned off the light and moved the card from “on” to “checked.”'],
 ['予定を確認すると、最後まで教室にいる生徒は日によって違うことが分かりました。','最後に出る人が電気を消し、カードを「点灯中」から「確認済み」へ動かします。']);
repairEvidence('V11-B14-G1-002','B',4,
 ['It said, ‘Practice in Room 3 at four.’','The brass band used Room 3 at four, and the guitar club used it at five.'],
 ['そこには「4時に第3室で練習」と書かれていました。','吹奏楽部は4時に第3室を使い、ギター部は5時に使うことが分かりました。']);
repairEvidence('V11-B14-G1-006','B',4,
 ['The middle pot had the word ‘basil.’','The middle plant had the same round leaves as the basil in the picture.'],
 ['真ん中の鉢には「バジル」という言葉がありました。','真ん中の植物には写真のバジルと同じ丸い葉がありました。']);
repairEvidence('V11-B14-G1-008','B',4,
 ['The first pile started on page 32, but the second started on page 34.','On the board, he saw, ‘Today: pages 32-33. Next class: pages 34-35.’'],
 ['一つ目は32ページから、二つ目は34ページから始まっていました。','黒板には「今日：32〜33ページ。次の授業：34〜35ページ」とありました。']);
repairEvidence('V11-B14-G1-012','B',1,
 ['He read the words under the arrows.','His papers were flat worksheets, so he used the blue opening.'],
 ['矢印の下の言葉を読みました。','持っていたのは平らなプリントだったので、青い投入口を使いました。']);
repairEvidence('V11-B14-G1-012','B',3,
 ['His papers were flat worksheets, so he used the blue opening.','Shun was glad.'],
 ['持っていたのは平らなプリントだったので、青い投入口を使いました。','シュンはよかったと思いました。']);
repairEvidence('V11-B14-G1-016','B',4,
 ['It said the display would continue until Friday.','A student borrowed it before the display began and returned it that morning.'],
 ['金曜日まで続くと書かれていました。','ある生徒が展示開始前に借り、今朝返したことが分かりました。']);
repairEvidence('V11-B15-G1-006','B',3,
 'Hina looked at the seating chart, but that did not show the card’s owner.',
 'ヒナは座席表を見ましたが、それだけでは名札の持ち主は分かりませんでした。');
repairEvidence('V11-B16-G1-006','B',1,
 ['His teacher said, “Try the difficult part first for one week.”','In the morning on Saturday, he also tried the same part before breakfast.'],
 ['先生は「一週間、難しい部分を最初に練習してみて」と言いました。','土曜日の朝には、朝食前に同じ部分を練習しました。']);
repairEvidence('V11-B14-G2-009','A',1,
 ['They counted people in each line every five minutes and also measured the time from ordering to receiving food.','The team put a small sign at both stands showing the usual preparation time.','They also prepared part of Stand B\'s snack before the busiest period.'],
 ['5分ごとに各列の人数を数え、注文してから受け取るまでの時間も測りました。','チームは両方の店に、通常の調理時間を示す小さな表示を置きました。','また、混雑する時間の前にB店の調理の一部を準備しました。']);
repairEvidence('V11-B14-G2-017','B',2,
 ['When six first-year students tested the form, three stopped at that question.','In a second test, all six students reached the end.'],
 ['1年生6人に試してもらうと、3人がその質問で止まりました。','2回目のテストでは6人全員が最後まで答えました。']);
repairEvidence('V11-B14-G2-017','B',4,
 ['Changing the order did not remove important thinking.','Later questions gave short information before asking about future choices.'],
 ['順番を変えたことは、大切な思考をなくしたのではありません。','後の質問では短い情報を示してから、将来の選択を尋ねました。']);
repairEvidence('V11-B16-G2-009','B',1,
 ['A sports center sometimes closed its outdoor court after heavy rain.','The center began posting the same notice on its website as soon as a decision was made and kept the indoor board as well.'],
 ['スポーツセンターでは、大雨の後に屋外コートを閉鎖することがありました。','センターは、決定したらすぐウェブサイトにも同じ案内を出し、館内の掲示も残しました。']);
repairEvidence('V11-B16-G2-013','B',5,
 ['After everyone had spoken once, the discussion became free.','The rule did not reduce strong opinions; it created a fair starting point for them.'],
 ['全員が一度話した後は自由な話し合いにしました。','このルールは強い意見を減らしたのではなく、全員に公平な出発点を作りました。']);
repairEvidence('V11-B14-G2-004','B',2,
 ['They placed it low on a wall near the stairs because the colors looked bright there.','Bags and students blocked the lower wall, and he could not read the club name from several meters away.'],
 ['色が明るく見えるので、階段近くの壁の低い位置に貼りました。','かばんや生徒が壁の下の部分を隠し、数メートル離れると部名を読めませんでした。']);
repairEvidence('V11-B14-G2-010','A',1,
 ['The team printed a test copy rotated to match the view from the gate.','Rotating the map worked better than adding many arrows.'],
 ['班は門から見える向きに合わせて回転させた試作地図を印刷しました。','矢印を増やすより、地図を回転させる方が効果的でした。']);
repairEvidence('V11-B14-G2-010','A',5,
 ['The map was correct, so volunteers first planned to add arrows.','Rotating the map worked better than adding many arrows.'],
 ['地図は正しかったので、ボランティアは最初、矢印を増やそうと考えました。','矢印を増やすより、地図を回転させる方が効果的でした。']);
repairEvidence('V11-B14-G2-010','B',4,
 ['Sora watched five visitors use it.','They asked five more visitors to find the science room.','Four chose the correct path without help.'],
 ['ソラが5人の利用の様子を観察しました。','別の5人に理科室を探してもらいました。','4人が助けなしで正しい道を選びました。']);
repairEvidence('V11-B14-G2-010','B',5,
 ['Sora watched five visitors use it.','Rotating the map worked better than adding many arrows.'],
 ['ソラが5人の利用の様子を観察しました。','矢印を増やすより、地図を回転させる方が効果的でした。']);
repairEvidence('V11-B14-G2-016','A',5,
 ['The school did not leave the fire door open.','The solution kept the safety rule and fixed the problem.'],
 ['学校は防火扉を開けたままにはしませんでした。','解決策は安全の決まりを守りながら問題を直しました。']);
repairEvidence('V11-B16-G2-010','A',4,
 ['The Japanese text described the place correctly but hid the action inside a long sentence.','Nothing important was removed.'],
 ['日本語は場所を正しく説明していましたが、行動の指示が長い文の中に隠れていました。','大切な情報は削っていません。']);
repairEvidence('V11-B16-G3-011','A',4,
 ['Another pointed out that the new oven had never been used for this recipe.','They also decided to prepare only twelve cakes before opening and make more if sales were strong.'],
 ['別の生徒は、新しいオーブンではこのレシピをまだ試していないと指摘しました。','開店前には12個だけ作り、売れ行きがよければ追加することにしました。']);
repairEvidence('V11-B16-G3-011','B',4,
 ['Their recipe used 200 milliliters of milk for one cake, and they expected to sell eighteen cakes.','The group baked one test cake first and found that the oven dried the cake slightly, so they increased the milk to 220 milliliters for each later cake.'],
 ['レシピでは1個につき200ミリリットルの牛乳を使い、18個売れると予想していました。','試作すると少し乾いたため、その後は1個につき220ミリリットルへ増やしました。']);
repairEvidence('V11-B10-G3-016','B',5,
 'The organizers learned that winter safety must combine venue capacity, opening hours, transport seats, updated permission, and a cancellation rule.',
 '主催者は、冬の安全には会場定員、開館時間、交通座席、更新した許可、中止基準を組み合わせる必要があると学びました。');
repairEvidence('V11-B16-G3-006','A',4,
 ['Rather than moving every event, the committee shifted the science show to 2:00, kept its room, and used the inspection period as setup time.','The craft and music schedules remained unchanged.'],
 ['すべての行事を動かさず、科学ショーだけを2時へ変更し教室はそのままにしました。','工作と音楽の予定は変えませんでした。']);
repairEvidence('V11-B16-G3-006','B',2,
 ['Room A held 30 people, Room B held 45, and the hall held 90.','A short science show expected 40 but used equipment that had to stay indoors.','Then the committee learned that Room B would be unavailable from 1:00 to 1:40 for an electrical inspection.'],
 ['A教室は30人、B教室は45人、ホールは90人収容できました。','科学ショーは40人を予定し、機材は屋内に置く必要がありました。','B教室は電気点検のため1時から1時40分まで使えないと分かりました。']);
repairEvidence('V11-B16-G3-008','B',1,
 ['Local students knew that this meant the open field on the north side, but visiting students who read the English guide could not tell which side was meant.','The original instruction had seemed obvious only because local students shared knowledge that visitors did not have.'],
 ['地元生徒は北側広場だと知っていましたが、英語案内を読む訪問生徒にはどちら側か分かりませんでした。','元の案内が明白に見えたのは、地元生徒だけが訪問者にはない知識を共有していたからです。']);

/* YAMAGUCHI_EXPLICIT_CONTRACT_REPAIR: normalize legacy question types to the active reading-only taxonomy. */
replaceQ('V11-B13-G3-003','B',4,{questionType:'CONTEXT_WORD',type:'CONTEXT_WORD',prompt:"In the sentence 'The 8:10 bus required more waiting but made the arrival time more reliable,' what does reliable mean here?",answer:'more dependable or less likely to be delayed',evidence:'The 8:10 bus required more waiting but made the arrival time more reliable.',evidenceJp:'8時10分のバスは待ち時間が長い代わりに到着時刻が安定します。',reason:'文脈上、reliable は到着時刻の確実性が高いことを表します。'});
replaceQ('V11-B14-G3-003','B',3,{questionType:'CONTEXT_WORD',type:'CONTEXT_WORD',prompt:"What does prohibited mean in 'bicycles would still be prohibited until 2:00 p.m.'?",answer:'not allowed',evidence:'After 11:30, the path would reopen, but bicycles would still be prohibited until 2:00 p.m.',evidenceJp:'11時30分以降は再開しますが、自転車は午後2時まで通れません。',reason:'prohibited はその時間まで自転車の通行が許可されないことを表します。'});
replaceQ('V11-B15-G3-009','B',1,{questionType:'CONTEXT_WORD',type:'CONTEXT_WORD',prompt:"What does backup mean in 'with the hall ready as a backup'?",answer:'an alternative place to use if the outdoor plan became unsafe',evidence:'The 11:00 music performance stayed outdoors during the dry period, with the hall ready as a backup.',evidenceJp:'11時の音楽公演は雨がやむ時間帯は屋外のままとし、ホールを代替場所として準備しました。',reason:'backup は天候が悪化したときに使う代替案・代替場所を指します。'});
replaceQ('V11-B10-G3-004','B',3,{questionType:'PHRASE_FILL',type:'PHRASE_FILL',prompt:'Complete the phrase: The students set a 2:45 meeting time at the ticket hall so they could walk to the gate without ____.',answer:'rushing',evidence:'The students set a two forty-five meeting time at the ticket hall so they could walk to the gate without rushing.',evidenceJp:'急がず入口へ歩けるよう、二時四十五分にチケット会場で集合することにしました。',reason:'without の後には本文中の rushing が入り、余裕を持った移動という文脈に合います。'});
replaceQ('V11-B10-G3-008','B',3,{questionType:'PHRASE_FILL',type:'PHRASE_FILL',prompt:'Complete the phrase: Using the later bus would add time near the coast as the tide continued to rise without adding a necessary ____.',answer:'task',evidence:'Using the later bus would add time near the coast as the tide continued to rise without adding a necessary task.',evidenceJp:'遅いバスでは必要な作業を増やさず、潮が上がる海岸での滞在時間だけが増えます。',reason:'本文では遅い便にしても必要な task は増えないことが理由になっています。'});
replaceQ('V11-B10-G3-012','B',3,{questionType:'PHRASE_FILL',type:'PHRASE_FILL',prompt:'Complete the phrase: After repair ended at 2:50, the seven-minute walk to Room B left enough time before ____.',answer:'3:10',evidence:'After repair ended at two fifty, the seven-minute walk to Room B left enough time before three ten.',evidenceJp:'修理は二時五十分に終わり、B室まで七分なので三時十分まで十分時間がありました。',reason:'本文の時刻関係をそのまま短句補充として確認します。'});
replaceQ('V11-B10-G3-016','B',3,{questionType:'PHRASE_FILL',type:'PHRASE_FILL',prompt:'Complete the phrase: On event day, snow stayed light in the morning, so the group used the revised plan and finished before conditions ____.',answer:'worsened',evidence:'On event day, snow stayed light in the morning, so the group used the revised plan and finished before conditions worsened.',evidenceJp:'当日朝は小雪のままだったため修正案で移動し、天候悪化前に行事を終えました。',reason:'before の後に本文中の worsened が入り、悪化前に終了した結果を表します。'});
replaceQ('V11-B11-G3-012','A',4,{questionType:'CONTENT_MATCH',type:'CONTENT_MATCH',prompt:'Which statement matches the revised departure plan?',answer:'Leaving at 8:25 reached Market A at 8:45 and Market B at 9:00.',evidence:'The club changed departure to eight twenty-five, reaching A at eight forty-five and B at nine, while keeping both lettuce deliveries within thirty-five minutes.',evidenceJp:'出発を八時二十五分に変えるとAへ八時四十五分、Bへ九時で、レタスはどちらも三十五分以内です。',reason:'修正版の出発・到着時刻に一致する内容を選ぶCONTENT_MATCHです。'});
replaceQ('V11-B11-G3-012','B',2,{questionType:'PHRASE_FILL',type:'PHRASE_FILL',prompt:'Complete the phrase: The van could reach A in twenty minutes and B ____ minutes after leaving school.',answer:'thirty-five',evidence:'The van could reach A in twenty minutes and B thirty-five minutes after leaving school, both inside the sixty-minute rule.',evidenceJp:'学校出発からAは二十分、Bは三十五分で、どちらも六十分以内です。',reason:'60分規則と照合する本文中の到着所要時間を補充します。'});
replaceQ('V11-B11-G3-004','A',5,{questionType:'SUMMARY_FILL',type:'SUMMARY_FILL',prompt:'Complete the summary: When a fallen branch blocked the side street, teachers used a marked ____ and kept the class together.',answer:'detour',evidence:'Teachers used that marked detour and kept the class together rather than sending separate groups in different directions.',evidenceJp:'先生たちは表示された迂回路を使い、別々の方向へ分けずクラスを一緒に移動させました。',reason:'倒木時の対応を要約した短句補充です。'});
replaceQ('V11-B11-G3-016','B',2,{questionType:'PHRASE_FILL',type:'PHRASE_FILL',prompt:'Complete the phrase: A live screen was placed at the large shaded west entrance so additional spectators could watch from outside the playing ____.',answer:'area',evidence:'A live screen was placed at the large shaded west entrance so additional spectators could watch from outside the playing area.',evidenceJp:'大きな日陰の西入口にライブ画面を置き、追加の観客は競技区域の外から見られるようにしました。',reason:'本文のplaying areaというまとまりを文脈で補充します。'});
replaceQ('V11-B12-G3-004','B',3,{questionType:'PHRASE_FILL',type:'PHRASE_FILL',prompt:'Complete the phrase: If the morning ferry was canceled, the students would ____ the visit rather than arrive late and pressure the clinic staff.',answer:'postpone',evidence:'The students also wrote a backup rule: if the morning ferry was canceled, they would postpone the visit rather than arrive late and pressure the clinic staff.',evidenceJp:'朝のフェリーが欠航した場合は、遅れて診療所に負担をかけるより訪問を延期するという予備ルールも書きました。',reason:'欠航時の行動を示す動詞 postpone を文脈で補充します。'});
replaceQ('V11-B13-G3-006','B',4,{questionType:'PHRASE_FILL',type:'PHRASE_FILL',prompt:'Complete the phrase: The emergency bus list showed two buses from the neighborhood stop to Center B, at 5:55 and ____.',answer:'6:25',evidence:'The emergency bus list showed two buses from the neighborhood stop to Center B, at 5:55 and 6:25.',evidenceJp:'緊急バス一覧には、近所の停留所からBセンターへ行く便が5時55分と6時25分にあると示されていました。',reason:'二つの出発時刻を本文から補充します。'});
replaceQ('V11-B13-G3-014','B',4,{questionType:'PHRASE_FILL',type:'PHRASE_FILL',prompt:'Complete the phrase: Open Field A had no permanent shade and no water ____.',answer:'station',evidence:'Water stations were beside the entrance, the pavilion, and Garden C, but there was no water station in Open Field A.',evidenceJp:'給水所は入口、パビリオン、Garden Cにありましたが、Open Field Aには給水所がありませんでした。',reason:'Field Aの設備条件をwater stationという語句で補充します。'});
replaceQ('V11-B15-G3-006','B',2,{questionType:'CONTEXT_WORD',type:'CONTEXT_WORD',prompt:"What does orientation mean in 'all groups received orientation'?",answer:'an introductory explanation before the activities',evidence:'From 10:00 to 10:20, all groups received orientation.',evidenceJp:'10時から10時20分までは全班が説明を受けます。',reason:'ここでorientationは活動前の説明・案内を指します。'});
replaceQ('V11-B15-G3-014','B',1,{questionType:'CONTEXT_WORD',type:'CONTEXT_WORD',prompt:"What does scheduled mean in 'were scheduled to arrive at 6:30'?",answer:'planned to arrive at that time',evidence:'Water and blankets would arrive at 5:00 p.m., while baby supplies and extra floor mats would arrive at 6:30.',evidenceJp:'水と毛布は午後5時、乳幼児用品と追加の床用マットは6時30分です。',reason:'scheduledはその時刻に届く予定であることを表します。'});

if(typeof window.render==='function')window.render();
window.V11_FINAL_RELEASE_READING_ONLY_STATE={version:'20260929-reading-only-r1',passages:all.length,...log};
window.V11_FINAL_RELEASE_READING_ONLY_APPLIED=true;
window.dispatchEvent(new Event('v11-passages-updated'));
if(!window.V11_YAMAGUCHI_100_READY){
  const y=document.createElement('script');
  y.src='./v11_yamaguchi_100_subset_overlay.js';
  y.onerror=function(){window.V11_YAMAGUCHI_100_ERROR='subset overlay load failed';console.error('[v11 Yamaguchi100] subset overlay load failed');};
  document.head.appendChild(y);
}
})();
