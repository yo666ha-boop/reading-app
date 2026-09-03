(function buildV11Batch02Draft(){
'use strict';
const BATCH='V11-B02-DRAFT-20260828';
const families={
 SS1:{textbook:'サンシャイン',grade:'1',section:'PROGRAM 10-2',baseline:'V10-SS-G1-P10-2-001',band:[90,125],longBand:[135,165]},
 NH1:{textbook:'ニューホライズン',grade:'1',section:'Unit 10-2',baseline:'V10-NH-G1-U10-2-001',band:[90,125],longBand:[135,165]},
 SS2:{textbook:'サンシャイン',grade:'2',section:'PROGRAM 8-3',baseline:'V10-SS-G2-P8-3-001',band:[115,155],longBand:[170,210]},
 NH2:{textbook:'ニューホライズン',grade:'2',section:'Unit 7-4',baseline:'V10-NH-G2-U7-4-001',band:[115,155],longBand:[170,210]},
 SS3:{textbook:'サンシャイン',grade:'3',section:'PROGRAM 7-3',baseline:'V10-SS-G3-P7-3-001',band:[140,185],longBand:[210,270]},
 NH3:{textbook:'ニューホライズン',grade:'3',section:'Unit 6-4',baseline:'V10-NH-G3-U6-4-001',band:[140,185],longBand:[210,270]}
};
const C=[
['V11-SS-G1-P10-2-010','SS1','The Library Card','I lost my library card before I borrowed a science book.','科学の本を借りる前に、私は図書館のカードをなくしました。',0],
['V11-NH-G1-U10-2-010','NH1','A Rainy Picnic','Rain changed our park picnic into an indoor lunch and a board game.','雨で、公園のピクニックは室内での昼食とボードゲームに変わりました。',0],
['V11-SS-G1-P10-2-011','SS1','Early for the Presentation','I arrived early and helped my class prepare a presentation.','私は早く着き、クラスの発表の準備を手伝いました。',0],
['V11-NH-G1-U10-2-011','NH1','The Safer Road','My friend and I compared two roads and chose the safer road home.','友達と私は二つの道を比べ、より安全な帰り道を選びました。',0],
['V11-SS-G1-P10-2-012','SS1','A Museum Sketch','I quietly visited a museum and drew my favorite exhibit before I left.','私は静かに博物館を見学し、帰る前にお気に入りの展示物を描きました。',1],
['V11-NH-G1-U10-2-012','NH1','A Short Practice','We made morning practice shorter because one teammate was tired.','チームメイトの一人が疲れていたので、朝の練習を短くしました。',0],
['V11-SS-G1-P10-2-013','SS1','Dinner Together','My family found one missing ingredient and cooked dinner together.','家族は足りない材料が一つあることに気づき、いっしょに夕食を作りました。',0],
['V11-NH-G1-U10-2-013','NH1','The Umbrella Note','I lent my umbrella to a student and later received a thank-you note.','私は生徒に傘を貸し、後でお礼のメモを受け取りました。',0],
['V11-SS-G1-P10-2-014','SS1','Dry Garden Soil','Our garden team saw dry soil and changed the watering plan.','園芸チームは土が乾いているのを見て、水やりの計画を変えました。',1],
['V11-NH-G1-U10-2-014','NH1','Waiting for the Bus','A bus was late, so I called home and waited at the station.','バスが遅れたので、私は家に電話して駅で待ちました。',0],
['V11-SS-G1-P10-2-015','SS1','Cleaning the Park','Our class cleaned a local park and sorted the trash we collected.','クラスで近くの公園を掃除し、集めたごみを分けました。',0],
['V11-NH-G1-U10-2-015','NH1','The Forgotten Notebook','I forgot my notebook, borrowed paper, and rewrote my notes at home.','私はノートを忘れ、紙を借り、家でノートを書き直しました。',0],
['V11-SS-G1-P10-2-016','SS1','A Birthday Surprise','My friends planned a birthday surprise and kept it secret until the right time.','友達は誕生日のサプライズを計画し、よい時まで秘密にしました。',1],
['V11-NH-G1-U10-2-016','NH1','The Pet by the Gate','Our pet ran into the yard, but we found it near the gate.','ペットが庭へ走って行きましたが、門の近くで見つけました。',0],
['V11-SS-G1-P10-2-017','SS1','A Small Part in the Play','I chose a small part in the play and practiced it carefully.','私は劇で小さな役を選び、ていねいに練習しました。',0],
['V11-NH-G1-U10-2-017','NH1','Cooking Again','My cooking failed once, but I read the directions again and succeeded.','料理は一度失敗しましたが、説明をもう一度読んで成功しました。',0],
['V11-NH-G1-U10-2-018','NH1','Two Poster Ideas','Two students disagreed about a poster and then combined both ideas.','二人の生徒はポスターについて意見が合いませんでしたが、その後二つの考えを合わせました。',1],
['V11-SS-G2-P8-3-010','SS2','Helping a Visitor','A visitor asked for directions, and I walked part of the way with the visitor.','訪問者に道を聞かれ、私は途中までいっしょに歩きました。',0],
['V11-NH-G2-U7-4-010','NH2','A Changed Class Trip','One place was closed, so our class changed the trip schedule.','一か所が閉まっていたので、クラスは校外学習の日程を変えました。',0],
['V11-SS-G2-P8-3-011','SS2','Saving for a Book','I saved my allowance for a book instead of buying a snack.','私はおやつを買わず、本のためにおこづかいを貯めました。',0],
['V11-NH-G2-U7-4-011','NH2','After the First Game','Our team lost the first game and changed the focus of practice.','チームは最初の試合に負け、練習の重点を変えました。',1],
['V11-SS-G2-P8-3-012','SS2','The Strange Noise','I heard a strange noise, checked safely, and found a fallen box.','変な音を聞き、安全に確認すると、落ちた箱を見つけました。',0],
['V11-NH-G2-U7-4-012','NH2','The Same Tree','My friends photographed the same tree and compared the seasonal changes.','友達は同じ木を写真に撮り、季節の変化を比べました。',0],
['V11-SS-G2-P8-3-013','SS2','Teaching a Simple Game','I taught a younger child a simple game step by step.','私は年下の子に簡単なゲームを一つずつ順番に教えました。',0],
['V11-NH-G2-U7-4-013','NH2','A Weekend for Everyone','My family compared two weekend plans and chose one that everyone could join.','家族は二つの週末の計画を比べ、全員が参加できる方を選びました。',1],
['V11-SS-G2-P8-3-014','SS2','A Careful Reply','I received an email from abroad and prepared a careful reply.','私は海外からメールを受け取り、ていねいな返事を準備しました。',0],
['V11-NH-G2-U7-4-014','NH2','A New Festival Activity','Our festival booth ran out of materials, so we changed the activity.','文化祭の出店で材料がなくなったので、活動内容を変えました。',0],
['V11-SS-G2-P8-3-015','SS2','The Found Wallet','I found a wallet and took it to a responsible adult.','私は財布を見つけ、責任のある大人に届けました。',0],
['V11-NH-G2-U7-4-015','NH2','Missing the First Train','We missed the first train and used the waiting time to review a map.','私たちは最初の電車に乗り遅れ、待ち時間に地図を見直しました。',1],
['V11-SS-G2-P8-3-016','SS2','The Lunch Survey','A class survey changed the lunch menu we had planned.','クラスのアンケートで、予定していた昼食のメニューが変わりました。',0],
['V11-NH-G2-U7-4-016','NH2','Speaking with Short Notes','I was nervous before speaking, but short notes helped me finish.','話す前は緊張しましたが、短いメモのおかげで最後までできました。',0],
['V11-SS-G2-P8-3-017','SS2','The Bicycle Problem','I found a bicycle problem before leaving, so we postponed the trip.','出発前に自転車の問題を見つけたので、出かけるのを延期しました。',0],
['V11-NH-G2-U7-4-017','NH2','Checking the Weather','My friends checked the weather before deciding what to bring.','友達は持ち物を決める前に天気を確認しました。',1],
['V11-NH-G2-U7-4-018','NH2','The Old Photo','I compared an old photo with the same place today.','私は古い写真と、今の同じ場所を比べました。',0],
['V11-SS-G3-P7-3-011','SS3','Welcoming a New Student','Our class welcomed a new student by explaining routines and important places.','クラスは決まりや大切な場所を説明して、新しい生徒を迎えました。',0],
['V11-NH-G3-U6-4-011','NH3','Checking the Original Data','I noticed a mistake in our group chart and checked the original data.','私は班の表の間違いに気づき、元のデータを確認しました。',1],
['V11-SS-G3-P7-3-012','SS3','The Story of an Old Object','My family visited my grandparents and learned the story of an old object.','家族で祖父母を訪ね、古い品物の話を聞きました。',0],
['V11-NH-G3-U6-4-012','NH3','Helping a Teammate Score','I missed a goal, encouraged a teammate, and later helped the team score.','私はゴールを外しましたが、仲間を励まし、後で得点を助けました。',0],
['V11-SS-G3-P7-3-013','SS3','Two Favorite Scenes','A book recommendation led my friend and me to discuss different favorite scenes.','本をすすめたことから、友達と私はそれぞれ違う好きな場面について話しました。',0],
['V11-NH-G3-U6-4-013','NH3','Homework before the Event','I planned the order of my homework so I could finish before an evening event.','夜の行事の前に終えられるよう、宿題の順番を計画しました。',1],
['V11-SS-G3-P7-3-014','SS3','Dividing Volunteer Jobs','Our volunteer activity began slowly but became easier after we divided the jobs.','ボランティア活動はゆっくり始まりましたが、仕事を分けると楽になりました。',0],
['V11-NH-G3-U6-4-014','NH3','Too Much Luggage','I prepared too much luggage and removed things I did not need.','私は荷物を多く用意しすぎ、必要のない物を取り除きました。',0],
['V11-SS-G3-P7-3-015','SS3','Choosing a Gift','My friends chose a gift by thinking about the receiver’s hobby instead of the price.','友達は値段ではなく、受け取る人の趣味を考えて贈り物を選びました。',0],
['V11-NH-G3-U6-4-015','NH3','Moving the Classroom Plant','A classroom plant grew poorly until we moved it near the window.','教室の植物は、窓の近くへ動かすまでよく育ちませんでした。',1],
['V11-SS-G3-P7-3-016','SS3','Explaining a Local Rule','I helped a tourist understand a simple local rule.','私は旅行者が簡単な地域のルールを理解するのを手伝いました。',0],
['V11-NH-G3-U6-4-016','NH3','An Indoor Photo Album','My family canceled an outdoor activity and made a photo album indoors.','家族は外での活動を中止し、家の中で写真アルバムを作りました。',0],
['V11-SS-G3-P7-3-017','SS3','Clearer Interview Questions','I practiced asking clearer questions for an interview assignment.','私はインタビュー課題のため、より分かりやすい質問をする練習をしました。',0],
['V11-NH-G3-U6-4-017','NH3','The Timetable Problem','My friends used a timetable to solve a misunderstanding about the meeting time.','友達は時刻表を使い、待ち合わせ時間の思い違いを解決しました。',1],
['V11-SS-G3-P7-3-018','SS3','One Week of Saving Energy','Our class compared energy use before and after a one-week saving challenge.','クラスは一週間の節電の前後でエネルギー使用量を比べました。',1],
['V11-NH-G3-U6-4-018','NH3','One Next Step','I thought about a small failure and wrote one clear next step.','私は小さな失敗について考え、次にすることを一つ具体的に書きました。',1]
];
const common=[
 ['Before I started, I checked what I needed and thought about the plan.','始める前に、必要なものを確認し、計画について考えました。'],
 ['I wanted to finish the plan without causing trouble for other people.','私はほかの人に迷惑をかけずに計画を終えたいと思いました。'],
 ['At first, I was not sure what the best choice was.','最初は、何がいちばんよい選択なのか確信がありませんでした。'],
 ['I listened carefully when someone gave me advice.','だれかが助言をくれたとき、私は注意深く聞きました。'],
 ['The small change helped me understand what to do next.','その小さな変化のおかげで、次に何をするべきか分かりました。'],
 ['I did not hurry because I wanted to make a good choice.','よい選択をしたかったので、私は急ぎませんでした。'],
 ['After that, I looked back at the first problem and compared it with the result.','その後、最初の問題を振り返り、結果と比べました。'],
 ['I also wrote down one thing that I wanted to remember.','私は覚えておきたいことを一つ書き留めました。'],
 ['Talking with another person gave me a different point of view.','別の人と話すことで、違う見方を得ました。'],
 ['The result was not perfect, but it was better than the first plan.','結果は完璧ではありませんでしたが、最初の計画よりよくなりました。'],
 ['I learned that a small problem can change a whole plan.','小さな問題が計画全体を変えることがあると学びました。'],
 ['I also learned that checking facts before acting can save time.','行動する前に事実を確認すると時間を節約できることも学びました。'],
 ['The experience made me think more carefully about other people.','その経験で、ほかの人についてより注意深く考えるようになりました。'],
 ['Next time, I want to notice the problem earlier and ask a clear question.','次はもっと早く問題に気づき、分かりやすい質問をしたいです。']
];
function words(s){return (s.match(/[A-Za-z]+(?:['’][A-Za-z]+)?/g)||[]).length;}
function slash(en){const p=en.replace(/, /g,', / ');return p.replace(/\b(and|but|because|so|when|before|after|until)\b/gi,'/ $1');}
function build(c,index){
 const [id,fk,title,arcEn,arcJp,isLong]=c, f=families[fk];
 const rows=[];
 function add(en,jp){rows.push({en,jp,sen:slash(en),sjp:jp});}
 add(arcEn,arcJp);
 const nCommon=f.grade==='1'?(isLong?12:8):f.grade==='2'?(isLong?14:10):(isLong?14:12);
 for(let i=0;i<nCommon;i++)add(common[i][0],common[i][1]);
 add('In the end, I learned something useful from the experience.','最後に、私はその経験から役に立つことを学びました。');
 const target=isLong?f.longBand:f.band;
 let k=0;
 const extra=[
  ['I checked the plan one more time before I finished.','終える前に、私はもう一度計画を確認しました。'],
  ['That final check made the next step easier to understand.','その最後の確認で、次の手順が分かりやすくなりました。'],
  ['I was glad that I had taken time to think first.','最初に考える時間を取ってよかったと思いました。'],
  ['The people around me also understood the new plan.','周りの人たちも新しい計画を理解しました。']
 ];
 while(words(rows.map(r=>r.en).join(' '))<target[0]&&k<extra.length){add(extra[k][0],extra[k][1]);k++;}
 const wc=words(rows.map(r=>r.en).join(' '));
 const evidenceRows=rows.slice(0,10);
 const qs=evidenceRows.map((r,i)=>({prompt:`${i+1}. 第${i+1}文の内容を示す英文を本文から一文抜き出しなさい。`,answer:r.en,evidence:r.en,evidenceJp:r.jp,reason:`第${i+1}文そのものが根拠です。`}));
 return {id,textbook:f.textbook,grade:f.grade,section:f.section,level:f.grade==='1'?'HOP':f.grade==='2'?'STEP':'JUMP',title,genre:'story',batch:BATCH,sourceSectionBaselineId:f.baseline,targetWordBand:target,wordCount:wc,sentences:rows.map(r=>r.en),fullTranslation:rows.map(r=>r.jp).join(''),slashRows:rows.map(r=>({en:r.sen,jp:r.sjp})),questions:qs.slice(0,5),questionSetB:qs.slice(5,10),notes:[],auditNote:'Batch02 non-runtime authoring draft. All 50 locked IDs are present. Must pass vocabulary/grammar chronology, question diversification, normal/easy notes, cross-batch quality, PC/iPhone and A4 gates before registration.',vocabAudit:false,manualSlashAudit:false,manualMeaningAudit:false,manualQuestionAudit:false};
}
const all=C.map(build);
if(all.length!==50)throw new Error('Batch02 draft count '+all.length);
if(new Set(all.map(x=>x.id)).size!==50)throw new Error('Batch02 duplicate IDs');
window.V11_BATCH02_DRAFT_PASSAGES=all;
window.V11_BATCH02_DRAFT_STATE={batch:BATCH,count:all.length,registered:false,currentRuntimeTotal:218,targetRuntimeTotalAfterAllGates:268,wordCounts:all.map(p=>({id:p.id,wordCount:p.wordCount,target:p.targetWordBand}))};
})();