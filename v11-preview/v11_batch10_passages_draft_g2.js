(function buildV11Batch10G2Drafts(){
'use strict';
const BATCH='V11-B10-G2-DRAFT-20260829',SS='サンシャイン',NH='ニューホライズン';
function words(s){return (String(s||'').match(/[A-Za-z]+(?:['’][A-Za-z]+)?/g)||[]);}
function q(type,prompt,answer,evidence,evidenceJp,reason){return {questionType:type,prompt,answer,evidence,evidenceJp,reason};}
function build(o){const sentences=o.rows.map(r=>r[0]),slashRows=o.rows.map(r=>({en:r[0],jp:r[1]})),fullTranslation=o.rows.map(r=>r[1]).join(''),wc=words(sentences.join(' ')).length,n=sentences.length,at=x=>Math.max(0,Math.min(n-1,x)),ev=i=>sentences[at(i)],jp=i=>slashRows[at(i)].jp;const questions=[q('GIST',`「${o.title}」で中心になった問題を答えなさい。`,jp(0),ev(0),jp(0),'冒頭の目的や問題が根拠です。'),q('DETAIL','問題に気づく手がかりとなったことを答えなさい。',jp(2),ev(2),jp(2),'本文中の具体的な手がかりです。'),q('REASON','最初の方法をそのまま続けなかった理由を答えなさい。',jp(4),ev(4),jp(4),'見直しが必要になった理由です。'),q('CONTENT_MATCH','改善のために行ったことを答えなさい。',jp(Math.max(6,n-4)),ev(Math.max(6,n-4)),jp(Math.max(6,n-4)),'改善行動が本文に書かれています。'),q('GIST','最終的に学んだことを答えなさい。',jp(n-1),ev(n-1),jp(n-1),'最後の文が全体をまとめています。')];const questionSetB=[q('INFERENCE','本文全体から、相手に伝えるときに大切だと分かることを答えなさい。',jp(n-2),ev(n-2),jp(n-2),'終盤の結果から推論できます。'),q('SUMMARY_FILL','見直し後に行った中心的な変更を答えなさい。',jp(Math.floor(n/2)),ev(Math.floor(n/2)),jp(Math.floor(n/2)),'流れの転換点です。'),q('DETAIL','判断を変えた具体的な情報を答えなさい。',jp(3),ev(3),jp(3),'本文の具体情報です。'),q('CONTENT_MATCH','最終版・最終案の特徴を答えなさい。',jp(n-2),ev(n-2),jp(n-2),'終盤の決定に一致します。'),q('GIST',`「${o.title}」から得られる大切な学びを答えなさい。`,jp(n-1),ev(n-1),jp(n-1),'結末が文章全体の学びを示しています。')];return Object.assign({grade:'2',genre:'reading',batch:BATCH,level:'STANDARD',targetWordBand:[115,155],wordCount:wc,sentences,fullTranslation,slashRows,questions,questionSetB,registered:false,questionStage:'BATCH10_DRAFT_HUMAN_BASE',authorReview:{reviewed:true,timelineCoherent:true,actorPerspectiveClear:true,causalLogicCoherent:true,translationNatural:true}},o,{rows:undefined});}
const passages=[],add=o=>passages.push(build(o));
add({id:'V11-B10-G2-001',textbook:SS,section:'PROGRAM 8-3',sourceSectionBaselineId:'V10-SS-G2-P8-3-001',title:'The Welcome Video with No Captions',rows:[
['The student council made a welcome video for families visiting the school.','生徒会は学校を訪れる家族のために歓迎動画を作りました。'],
['It showed classrooms, clubs, and short interviews with students.','動画には教室、部活動、生徒への短いインタビューが入っていました。'],
['During a trial viewing, one student turned down the sound and could not follow the interviews.','試しに見るとき、一人の生徒が音を小さくするとインタビューの内容が分かりませんでした。'],
['She explained that visitors in a noisy hall or people who could not hear well might have the same problem.','その生徒は、騒がしい場所の来訪者や聞こえにくい人にも同じ問題が起こると説明しました。'],
['The council realized that clear pictures did not replace spoken information.','生徒会は、分かりやすい映像だけでは話された情報の代わりにならないと気づきました。'],
['They wrote captions for every interview and checked names against the original recording.','すべてのインタビューに字幕を付け、名前は元の録音と照合しました。'],
['They also shortened long captions so viewers could read them before the scene changed.','場面が変わる前に読めるよう、長い字幕は短くしました。'],
['A second test was done with the sound completely off.','二回目の確認は音を完全に消して行いました。'],
['This time, students understood the main information and found only two timing problems.','今回は生徒たちが主な情報を理解でき、タイミングの問題は二か所だけでした。'],
['After those were fixed, the video worked in both quiet and noisy spaces.','そこを直すと、動画は静かな場所でも騒がしい場所でも使えるようになりました。'],
['The council learned that accessibility improves communication for more than one kind of viewer.','生徒会は、利用しやすさを考えることは一種類だけでなく多くの人の理解を助けると学びました。']
]});
add({id:'V11-B10-G2-002',textbook:NH,section:'Unit 7-4',sourceSectionBaselineId:'V10-NH-G2-U7-4-001',title:'A Pen-Pal Letter That Used a Local Nickname',rows:[
['Kei wrote to a pen pal in Canada about a spring festival in his town.','圭はカナダの文通相手に町の春祭りについて手紙を書きました。'],
['He called the festival “Hanaichi,” the nickname everyone at his school used.','圭は学校のみんなが使う愛称「花市」と祭りを呼びました。'],
['His teacher asked whether someone outside the town would know what that word meant.','先生は、町の外の人がその言葉の意味を分かるだろうかと尋ねました。'],
['Kei noticed that the letter never explained the official festival name or its main event.','圭は手紙に祭りの正式名も中心行事も説明していないことに気づきました。'],
['The nickname was friendly locally, but it depended on knowledge his pen pal did not have.','その愛称は地元では親しみやすくても、文通相手が持っていない知識に頼っていました。'],
['Kei kept the nickname but added one sentence explaining it after the first use.','圭は愛称を残し、最初に使った直後に意味を説明する一文を加えました。'],
['He also described the evening flower market that gave the nickname its meaning.','また、その愛称の由来となった夕方の花の市場も説明しました。'],
['His pen pal replied that the new detail helped her imagine the festival.','文通相手は、その説明で祭りの様子を想像しやすくなったと返事しました。'],
['She then asked a question about the flowers instead of asking what “Hanaichi” was.','そして「花市とは何か」ではなく、花について質問しました。'],
['Kei saw that the local word could still give the letter personality when it was explained.','圭は、説明すれば地元の言葉を残して手紙らしさを出せると分かりました。'],
['He learned to think about what background knowledge a reader actually shares.','圭は、読み手と本当に共有している背景知識を考えることが大切だと学びました。']
]});
add({id:'V11-B10-G2-003',textbook:SS,section:'PROGRAM 8-3',sourceSectionBaselineId:'V10-SS-G2-P8-3-001',title:'The School Festival Booth with a Narrow Entrance',rows:[
['Class 2-A built a game booth for the school festival.','二年A組は学校祭のゲーム屋台を作りました。'],
['The entrance looked colorful because two large display boards stood on both sides.','入口の両側に大きな展示板を置いたため、見た目は華やかでした。'],
['During a practice visit, a student using a wheelchair could not pass between the boards.','試しに見学したとき、車いすを使う生徒が展示板の間を通れませんでした。'],
['The builders measured the space and found that the opening was much narrower than the classroom door.','作った生徒が幅を測ると、入口は教室の扉よりかなり狭いと分かりました。'],
['They realized that decoration had accidentally made the activity harder to enter.','飾り付けが思いがけず参加しにくさを作っていたと気づきました。'],
['Instead of removing the theme, they moved one board to the back wall.','テーマそのものをやめず、一枚の展示板を奥の壁へ移しました。'],
['They taped the remaining board flat so it would not swing into the path.','残した展示板は通路側へ動かないよう平らに固定しました。'],
['The student tried the entrance again and could turn safely inside the booth.','その生徒がもう一度試すと、安全に入り中で方向を変えられました。'],
['The class then checked the exit and the space around each game table too.','クラスは出口と各ゲーム台の周りの広さも確認しました。'],
['The booth kept its bright design while becoming easier for many visitors to use.','屋台は明るいデザインを保ちながら、多くの人が利用しやすくなりました。'],
['The class learned to test a design from the visitor’s path, not only from the builder’s view.','クラスは作る側の見た目だけでなく、来る人の動きからデザインを確認すると学びました。']
]});
add({id:'V11-B10-G2-004',textbook:NH,section:'Unit 7-4',sourceSectionBaselineId:'V10-NH-G2-U7-4-001',title:'A Club Interview Recorded in a Noisy Gym',rows:[
['The broadcasting club interviewed the basketball captain for a school program.','放送部は学校番組のためバスケットボール部の主将にインタビューしました。'],
['They recorded beside the gym because the captain had practice immediately afterward.','主将がすぐ練習だったため、体育館のそばで録音しました。'],
['When the club listened later, bouncing balls covered several important answers.','後で聞くと、ボールをつく音で大切な答えがいくつも聞こえませんでした。'],
['The interviewer remembered the general meaning but could not safely guess the captain’s exact words.','聞き手は大体の意味を覚えていましたが、主将の正確な言葉を推測することはできませんでした。'],
['They decided that a convenient location had produced an unreliable recording.','便利な場所を選んだことで信頼できない録音になったと判断しました。'],
['The captain agreed to answer the missing questions again during lunch the next day.','主将は翌日の昼休みに聞こえない質問へもう一度答えることに同意しました。'],
['This time, the club used a small meeting room and tested ten seconds of sound first.','今度は小会議室を使い、最初に十秒間の音を試しました。'],
['They kept the clear parts of the first interview and replaced only the unusable sections.','最初の録音の聞き取れる部分は残し、使えない部分だけを差し替えました。'],
['Before editing, the captain listened to the combined version and approved the meaning.','編集前に主将もつないだ内容を聞き、意味が正しいことを確認しました。'],
['The final program sounded natural without pretending the missing audio had been clear.','最終番組は、聞こえなかった音を聞こえたふりせず自然な内容になりました。'],
['The club learned to test recording conditions before an interview begins.','放送部はインタビューを始める前に録音環境を確かめると学びました。']
]});
add({id:'V11-B10-G2-005',textbook:SS,section:'PROGRAM 8-3',sourceSectionBaselineId:'V10-SS-G2-P8-3-001',title:'The Community Mural with Three Design Ideas',rows:[
['Students were asked to design a mural for a wall beside the community center.','生徒たちは地域センター横の壁画をデザインすることになりました。'],
['One group wanted local flowers, another wanted a river scene, and a third wanted pictures of people.','一班は地元の花、別の班は川の景色、三班目は人々の絵を望みました。'],
['A first vote gave no idea more than half the class.','最初の投票ではどの案もクラスの半数を超えませんでした。'],
['The students noticed that each proposal represented a different part of the same community.','生徒たちは、各案が同じ地域の別々の面を表していることに気づきました。'],
['Choosing only the largest group’s idea would leave the other two themes out completely.','最大の班の案だけを選ぶと、ほかの二つのテーマが完全に消えてしまいます。'],
['They sketched a new scene with people walking beside the river and flowers along the path.','そこで、川沿いを歩く人々と道に咲く花を一つの景色に描きました。'],
['Each group chose one detail that was important to keep.','各班は残したい大切な要素を一つ選びました。'],
['The class then checked whether the combined picture still looked simple enough from across the street.','クラスは、組み合わせた絵が道路の向かいから見ても十分分かりやすいか確認しました。'],
['They removed several small objects but kept all three main themes.','細かい物はいくつか減らしましたが、三つの中心テーマは残しました。'],
['The community center approved the revised sketch, and students could explain whose ideas it included.','地域センターは修正版を認め、生徒たちは誰の案が含まれるか説明できました。'],
['They learned that a compromise works best when it preserves clear reasons from different proposals.','生徒たちは、妥協案は異なる提案の大切な理由を明確に残すとき最もよく働くと学びました。']
]});
add({id:'V11-B10-G2-006',textbook:NH,section:'Unit 7-4',sourceSectionBaselineId:'V10-NH-G2-U7-4-001',title:'A Recipe Exchange with an Unknown Ingredient',rows:[
['For an international recipe exchange, Emi received a soup recipe from a student in Thailand.','国際レシピ交流で、恵美はタイの生徒からスープの作り方を受け取りました。'],
['One ingredient had an English name that nobody in her group recognized.','材料の一つに、グループの誰も知らない英語名がありました。'],
['A quick image search showed several similar green leaves, but they had different flavors.','画像で簡単に調べると似た緑の葉がいくつも出ましたが、味はそれぞれ違いました。'],
['Emi did not choose a leaf just because its picture looked close.','恵美は写真が似ているだけで葉を選びませんでした。'],
['She asked the student who sent the recipe to describe the smell, taste, and usual use.','レシピを送った生徒に、香り、味、普段の使い方を説明してもらいました。'],
['The reply explained that the leaf had a fresh citrus smell and was used mainly for aroma.','返事には、その葉は新鮮な柑橘系の香りがあり主に香り付けに使うとありました。'],
['Their local shop did not sell it, so the sender suggested lime peel as a possible substitute.','近くの店では売っていなかったため、送り主は代わりにライムの皮を提案しました。'],
['Emi’s group wrote both the original ingredient and the substitute in its class recipe.','恵美の班は元の材料と代用品の両方をクラスのレシピに書きました。'],
['They also explained that the substitute would not make exactly the same flavor.','また、代用品では全く同じ味にはならないことも説明しました。'],
['The soup was successful, and readers understood which part had been adapted.','スープはうまくでき、読む人にもどの部分を変えたか分かりました。'],
['Emi learned that unfamiliar cultural details should be explained rather than silently replaced.','恵美は、知らない文化的な要素は黙って置き換えず説明するべきだと学びました。']
]});
add({id:'V11-B10-G2-007',textbook:SS,section:'PROGRAM 8-3',sourceSectionBaselineId:'V10-SS-G2-P8-3-001',title:'The Robot Demo That Children Could Not See',rows:[
['The science club prepared a small robot demonstration for elementary school visitors.','科学部は小学生の来訪者向けに小さなロボット実演を準備しました。'],
['The robot moved colored blocks on a normal classroom table.','ロボットは普通の教室の机の上で色の付いたブロックを動かしました。'],
['During a trial, younger students standing in the second row could see only the backs of older students.','試すと、二列目に立つ低学年の子どもたちは前の子の背中しか見えませんでした。'],
['Club members had tested the robot’s movement but had never tested the audience’s view.','部員はロボットの動きは確認していましたが、観客からの見え方は確認していませんでした。'],
['They realized that a correct demonstration was still ineffective if viewers could not see the important action.','正しい実演でも大切な動きが見えなければ役立たないと気づきました。'],
['They moved the robot to a low platform and placed a camera above it.','ロボットを低い台へ移し、その上にカメラを置きました。'],
['The camera showed a top view on a large screen behind the table.','カメラは机の後ろの大きな画面に上からの映像を映しました。'],
['Children at the back tested both positions and said the screen made the block colors clear.','後ろの子どもたちが試すと、画面でブロックの色も分かりやすいと言いました。'],
['The club also marked a line so the front row would not stand too close.','科学部は前列が近づきすぎないよう線も付けました。'],
['At the event, every group could follow the robot without crowding around the table.','当日は、どの班も机の周りに集まりすぎずロボットを見られました。'],
['The club learned to test an explanation from the audience’s physical point of view.','科学部は説明を観客の実際の見える位置から確認すると学びました。']
]});
add({id:'V11-B10-G2-008',textbook:NH,section:'Unit 7-4',sourceSectionBaselineId:'V10-NH-G2-U7-4-001',title:'A School Podcast Episode That Was Too Long',rows:[
['The media club recorded a podcast about three student volunteer projects.','メディア部は三つの生徒ボランティア活動についてポッドキャストを録音しました。'],
['The first edit lasted twenty-eight minutes, although the school site recommended about fifteen.','最初の編集版は二十八分あり、学校サイトの目安である約十五分を大きく超えました。'],
['Club members noticed that each interview repeated the project date and meeting place several times.','部員は各インタビューで活動日と集合場所が何度も繰り返されていると気づきました。'],
['They did not simply cut the longest speaker because that interview contained the clearest explanation of the project’s purpose.','最も長く話した人の部分を単純に削りませんでした。そこには活動目的の最も分かりやすい説明があったからです。'],
['Instead, they marked information as essential, useful, or repeated.','代わりに情報を「必要」「あるとよい」「重複」に分けました。'],
['They kept one clear description of each project and moved dates to a short ending section.','各活動の分かりやすい説明を一つ残し、日付は最後の短い案内へまとめました。'],
['Long pauses and repeated greetings were also removed without changing anyone’s meaning.','長い間や繰り返しのあいさつも、話の意味を変えずに取り除きました。'],
['The new version lasted sixteen minutes and still included all three projects.','新しい版は十六分で、三つの活動すべてを残しました。'],
['Two students who had not heard the original could explain the main point after listening once.','元の録音を知らない生徒二人も、一度聞いただけで中心内容を説明できました。'],
['The club published the shorter version and put detailed dates in the written notes.','部は短い版を公開し、詳しい日付は文字の案内に載せました。'],
['They learned that good editing removes repetition before it removes important meaning.','部員は、よい編集は大切な意味より先に重複を減らすと学びました。']
]});
add({id:'V11-B10-G2-009',textbook:SS,section:'PROGRAM 8-3',sourceSectionBaselineId:'V10-SS-G2-P8-3-001',title:'The Local History Walk without Rest Stops',rows:[
['A history club designed a ninety-minute walking tour of old buildings near the station.','歴史部は駅周辺の古い建物を巡る九十分の徒歩コースを作りました。'],
['The first route connected six sites in the shortest possible distance.','最初の道順は六か所を最短距離で結んでいました。'],
['When grandparents joined a trial walk, several asked where they could sit after the third stop.','祖父母世代の人が試し歩きに参加すると、三か所目の後で座れる場所を尋ねる人が何人もいました。'],
['The map showed monuments carefully but did not show benches, toilets, or places with shade.','地図には記念物は詳しくありましたが、ベンチ、トイレ、日陰の場所は載っていませんでした。'],
['The club realized that the shortest route was not automatically the easiest route for every participant.','部員は、最短の道がすべての参加者にとって一番歩きやすいとは限らないと気づきました。'],
['They walked the area again and recorded three public benches and one small park.','もう一度歩き、公共のベンチ三か所と小さな公園一か所を記録しました。'],
['A revised route added a five-minute rest in the park after the third historical site.','修正版では三つ目の史跡の後、公園で五分休むようにしました。'],
['It was only two hundred meters longer than the first plan.','その道は最初の予定より二百メートル長いだけでした。'],
['A second trial group completed the walk with fewer questions about stopping places.','二回目の試し歩きでは休憩場所についての質問が減りました。'],
['The final map showed both historical information and practical rest points.','最終地図には歴史情報と実用的な休憩場所の両方を載せました。'],
['The club learned that a route should be tested with the needs of real participants in mind.','歴史部は、実際の参加者の必要を考えて道順を試すべきだと学びました。']
]});
add({id:'V11-B10-G2-010',textbook:NH,section:'Unit 7-4',sourceSectionBaselineId:'V10-NH-G2-U7-4-001',title:'A Poster Color That Looked Different Outdoors',rows:[
['Maya designed a blue-and-yellow poster for an outdoor sports event.','麻耶は屋外スポーツ行事のため青と黄色のポスターを作りました。'],
['On her computer screen, the light yellow words were easy to read against the dark blue background.','パソコン画面では、濃い青の背景に薄い黄色の文字が読みやすく見えました。'],
['When a test copy was placed outside at noon, sunlight made the yellow look much weaker.','試し刷りを正午の外に置くと、日光で黄色がかなり弱く見えました。'],
['Students standing several meters away could not read the event time.','数メートル離れた生徒には行事の時刻が読めませんでした。'],
['Maya realized that a design checked only indoors had not been tested under its real viewing condition.','麻耶は、室内だけで確認したデザインは実際に見る条件で試されていなかったと気づきました。'],
['She printed three versions with different text darkness and letter thickness.','文字の濃さと太さを変えた三種類を印刷しました。'],
['The class placed all three in the same outdoor spot in both sun and shade.','クラスは三種類を同じ屋外場所で日なたと日陰の両方に置きました。'],
['The darkest, thicker letters stayed readable in both conditions.','最も濃く太い文字はどちらの条件でも読めました。'],
['Maya used that version but kept the original blue background and layout.','麻耶はその文字を採用し、元の青い背景と配置は残しました。'],
['The finished poster could be read from the path where visitors actually approached.','完成したポスターは来訪者が実際に歩いてくる道から読めました。'],
['She learned that visual design should be tested where and how people will really see it.','麻耶は、デザインは人が実際に見る場所と見方で確かめるべきだと学びました。']
]});
add({id:'V11-B10-G2-011',textbook:SS,section:'PROGRAM 8-3',sourceSectionBaselineId:'V10-SS-G2-P8-3-001',title:"The Exchange Student's Lunch Interview",rows:[
['The school newspaper interviewed Lina, an exchange student, about lunch at her new school.','学校新聞は留学生リナに新しい学校の昼食についてインタビューしました。'],
['The first question asked, “You must miss the food from your country, right?”','最初の質問は「きっと自分の国の食べ物が恋しいですよね」でした。'],
['Lina smiled but said she actually enjoyed trying many Japanese lunches.','リナは笑いましたが、実際にはいろいろな日本の昼食を試すのを楽しんでいると答えました。'],
['The reporter noticed that the question had already suggested the answer it expected.','記者は、その質問が期待する答えを先に示してしまっていたと気づきました。'],
['A question based on an assumption could hide what Lina really wanted to say.','思い込みに基づく質問では、リナが本当に言いたいことが隠れる可能性がありました。'],
['The reporter changed the next question to, “What has surprised you about lunch here?”','記者は次を「ここの昼食で驚いたことは何ですか」に変えました。'],
['Lina talked about warm soup, short lunch time, and sharing cleaning jobs afterward.','リナは温かいスープ、短い昼食時間、その後の掃除当番について話しました。'],
['These answers gave the article details the reporter had not expected.','その答えから、記者が予想していなかった内容が記事に加わりました。'],
['Before publication, Lina read the quoted sentences and confirmed they matched her meaning.','掲載前にリナが引用文を読み、自分の意味と合っているか確認しました。'],
['The final article described her experience without treating one cultural reaction as automatic.','最終記事は一つの文化的反応を当然と決めつけず、リナの経験を伝えました。'],
['The reporter learned that neutral questions give interviewees more room to provide their own evidence.','記者は、中立的な質問ほど相手自身の情報を出せる余地が大きいと学びました。']
]});
add({id:'V11-B10-G2-012',textbook:NH,section:'Unit 7-4',sourceSectionBaselineId:'V10-NH-G2-U7-4-001',title:'A Book Recommendation for Two Different Readers',rows:[
['The library committee was asked to recommend one book to two new students.','図書委員会は二人の新入生にそれぞれ本を一冊勧めることになりました。'],
['One student liked short mysteries, while the other enjoyed long stories about nature.','一人は短いミステリーが好きで、もう一人は自然についての長い物語を楽しんでいました。'],
['At first, a committee member wanted to give both students the same popular adventure book.','最初、委員の一人は二人とも同じ人気の冒険小説にしようと考えました。'],
['The book was popular, but popularity did not explain why it would fit two different reading interests.','その本は人気でしたが、違う好みの二人に合う理由にはなりませんでした。'],
['The committee checked short descriptions and the students’ answers on a reading card.','委員会は本の短い紹介と二人の読書カードの回答を確認しました。'],
['They chose a ninety-page mystery with quick chapters for the first student.','一人目には短い章で進む九十ページのミステリーを選びました。'],
['For the second, they chose a longer story about a family protecting a forest.','二人目には森を守る家族についてのより長い物語を選びました。'],
['Each recommendation note explained two features connected to that student’s stated interests.','推薦メモには、それぞれの生徒が書いた好みにつながる特徴を二つ説明しました。'],
['Both students borrowed the books and later asked for similar titles.','二人とも本を借り、後で似た本を尋ねました。'],
['The committee kept the popular adventure book on a general display rather than forcing it into both recommendations.','人気の冒険小説は二人に無理に勧めず、一般の展示に残しました。'],
['They learned that a recommendation is stronger when its reasons match a particular reader.','委員会は、推薦は理由が特定の読み手に合うほど良くなると学びました。']
]});
add({id:'V11-B10-G2-013',textbook:SS,section:'PROGRAM 8-3',sourceSectionBaselineId:'V10-SS-G2-P8-3-001',title:'The Sports Day Announcement Heard from the Back Field',rows:[
['For sports day, teachers used one speaker near the main field to announce schedule changes.','運動会では、先生たちは主運動場近くの一台のスピーカーで予定変更を知らせました。'],
['A relay team waiting on the back field missed an announcement about a ten-minute delay.','裏側の運動場で待つリレーチームは、十分の遅れを知らせる放送を聞き逃しました。'],
['They could hear music from the speaker but not the words clearly.','スピーカーの音楽は聞こえても、言葉ははっきり聞こえませんでした。'],
['The organizers had tested the sound beside the main seats, not at the farthest waiting area.','主催者は主な観客席のそばで音を確認しましたが、最も遠い待機場所では試していませんでした。'],
['They realized that volume at one point did not show whether an announcement reached every team.','一か所での音量だけでは、放送が全チームに届くか分からないと気づきました。'],
['Before the next event, a teacher walked to the back field while another made a test announcement.','次の競技前、先生一人が裏側へ行き、別の先生が試し放送をしました。'],
['The words were still unclear, so they did not solve the problem only by making the speaker louder.','言葉はまだ不明瞭だったため、単にスピーカーを大きくするだけでは解決しませんでした。'],
['Instead, schedule changes were also sent by text to teachers leading each team.','代わりに、予定変更を各チーム担当の先生へ文字でも送りました。'],
['Those teachers repeated the information directly to students in their waiting areas.','担当の先生が待機場所の生徒へ直接情報を伝えました。'],
['No team missed the later changes, even when wind made the speaker difficult to hear.','その後は風で放送が聞きにくくても、変更を聞き逃すチームはありませんでした。'],
['The organizers learned that important messages need a backup method when distance can block sound.','主催者は、距離で音が届かない可能性があるとき大切な連絡には別の方法も必要だと学びました。']
]});
add({id:'V11-B10-G2-014',textbook:NH,section:'Unit 7-4',sourceSectionBaselineId:'V10-NH-G2-U7-4-001',title:'A Photo Caption That Changed the Meaning',rows:[
['A student photographer took a picture of volunteers carrying boxes after a charity event.','生徒カメラマンは慈善行事後に箱を運ぶボランティアの写真を撮りました。'],
['The first caption said, “Students take unused food home after the event.”','最初の説明文は「生徒が行事後に使わなかった食べ物を家へ持ち帰る」でした。'],
['One volunteer read it and explained that the boxes were actually being delivered to a local food bank.','ボランティアの一人が読み、その箱は実際には地域のフードバンクへ届ける物だと説明しました。'],
['The photographer had seen people leaving the hall but had not asked where they were going.','撮影者は人々が会場を出るのを見ただけで、行き先を尋ねていませんでした。'],
['The phrase “take home” turned an unconfirmed guess into a false statement.','「家へ持ち帰る」という言葉が、確かめていない推測を誤った事実にしていました。'],
['The photographer checked the event plan and spoke with the student carrying the front box.','撮影者は行事計画を確認し、先頭の箱を運んでいた生徒にも尋ねました。'],
['Both sources confirmed that unopened food was being donated.','どちらからも未開封の食べ物を寄付していることが確認できました。'],
['The caption was changed to explain the delivery and name the food bank only after permission was given.','説明文は配送を説明する内容に変え、許可を得てからフードバンク名も載せました。'],
['Readers could now understand what the photograph actually showed.','読む人は写真が実際に何を示すのか分かるようになりました。'],
['The original caption was kept in the editing record so the correction was clear.','元の説明文は修正が分かるよう編集記録に残しました。'],
['The photographer learned that a few words can change a picture’s meaning when they add an unsupported story.','撮影者は、根拠のない話を加えると少数の言葉でも写真の意味を変えてしまうと学びました。']
]});
add({id:'V11-B10-G2-015',textbook:SS,section:'PROGRAM 8-3',sourceSectionBaselineId:'V10-SS-G2-P8-3-001',title:'The Student Guide Who Gave Too Many Directions at Once',rows:[
['Yuki guided visitors from the school entrance to a music room on the third floor.','由紀は来訪者を学校入口から三階の音楽室へ案内しました。'],
['She gave all eight directions at once before they started walking.','歩き始める前に八つの道順を一度に全部説明しました。'],
['At the second hallway, the visitors stopped because they could not remember whether to turn left or right.','二つ目の廊下で、来訪者は左右どちらか思い出せず止まりました。'],
['Yuki knew the building so well that the full route seemed simple to her.','由紀は校舎をよく知っていたため、全道順が簡単に感じられていました。'],
['She realized that the listener had to remember unfamiliar information while also watching where to walk.','聞く人は知らない情報を覚えながら歩く場所も見なければならないと気づきました。'],
['On the way back, she tried giving only the next two steps at each clear landmark.','帰り道では、分かりやすい目印ごとに次の二手順だけを伝えました。'],
['She said, “Go to the library sign, then turn right,” and waited until they reached it.','「図書館の表示まで進み、右へ曲がってください」と言い、そこへ着くまで待ちました。'],
['The visitors moved smoothly and asked fewer questions.','来訪者はスムーズに進み、質問も減りました。'],
['Yuki made a small guide card using landmarks and short numbered steps.','由紀は目印と短い番号付き手順を使った小さな案内カードを作りました。'],
['Other student guides used it during the afternoon without memorizing a long speech.','午後はほかの案内係も長い説明を暗記せずそのカードを使えました。'],
['Yuki learned that useful directions should be given in an order a listener can act on.','由紀は、役立つ道案内は聞く人が実行できる順序と量で伝えるべきだと学びました。']
]});
add({id:'V11-B10-G2-016',textbook:NH,section:'Unit 7-4',sourceSectionBaselineId:'V10-NH-G2-U7-4-001',title:'A Handmade Game Tested by Younger Students',rows:[
['A design club made a card game to teach elementary students about local animals.','デザイン部は小学生に地元の動物を教えるカードゲームを作りました。'],
['The club members understood the rules because they had discussed them for several weeks.','部員は数週間話し合っていたためルールをよく理解していました。'],
['During the first test, younger students kept asking when they were allowed to draw a new card.','最初の試遊では、小学生がいつ新しいカードを引けるのか何度も尋ねました。'],
['The printed rules said “after a turn,” but they never explained exactly when a turn ended.','印刷したルールには「一回の番の後」とありましたが、番がいつ終わるか説明していませんでした。'],
['The club realized that familiar words can still be unclear when steps are missing.','よく知る言葉でも手順が抜ければ分かりにくくなると部員は気づきました。'],
['They watched another round without helping and wrote down every point where players stopped.','次の一回は助けずに見守り、遊ぶ人が止まった場所をすべて記録しました。'],
['Then they rewrote the rule as three numbered actions: play, check, and draw.','その後、ルールを「出す・確認する・引く」の三つの番号付き行動に書き直しました。'],
['A small example beside the rules showed one complete turn.','ルールの横には一回の番全体を示す小さな例も載せました。'],
['A second group of younger students played for ten minutes without asking about turn order.','別の小学生グループは、番の順序を質問せず十分間遊べました。'],
['The club kept one other question from the test as the next improvement task.','部員は試遊で出た別の一つの質問を次の改善課題として残しました。'],
['They learned that user testing reveals gaps that creators may no longer notice.','部員は、利用者に試してもらうと作り手には見えなくなった不足が分かると学びました。']
]});
add({id:'V11-B10-G2-017',textbook:SS,section:'PROGRAM 8-3',sourceSectionBaselineId:'V10-SS-G2-P8-3-001',title:'The Thank-You Speech with One Person Left Out',rows:[
['The festival committee prepared a short speech to thank people who had helped the school event.','学校祭委員会は行事を手伝った人へ感謝する短いスピーチを用意しました。'],
['The draft thanked teachers, parents, and the student bands by name.','原稿では先生、保護者、生徒バンドに名前を挙げて感謝していました。'],
['While checking the work log, Sana noticed that the local caretaker who opened the hall early was not mentioned.','作業記録を確認していた紗奈は、朝早く会場を開けた地域の管理人が書かれていないことに気づきました。'],
['No committee member had worked with him directly, so his contribution had been easy to overlook.','委員の誰も彼と直接作業していなかったため、その貢献が見落とされやすかったのです。'],
['Sana realized that memory alone favored the people the writers had seen most often.','紗奈は、記憶だけでは原稿を書く人がよく見た人ばかりを思い出してしまうと気づきました。'],
['The committee compared the speech with the full volunteer and task records.','委員会はスピーチをボランティア名簿と作業記録全体と照合しました。'],
['They found the caretaker and two office staff who had arranged keys and deliveries.','管理人に加え、鍵と配送を手配した職員二人も見つけました。'],
['The speech was revised to thank each group for a specific contribution rather than adding a long list of names.','長い名前の一覧にせず、各グループの具体的な貢献へ感謝する形に直しました。'],
['A final check confirmed that every recorded task was represented somewhere in the speech.','最終確認で、記録されたすべての仕事がスピーチのどこかに含まれると確認しました。'],
['The shorter, more complete speech was delivered at the closing ceremony.','より短く、しかも抜けの少ないスピーチが閉会式で読まれました。'],
['The committee learned that fair thanks should be checked against contribution records, not only personal memory.','委員会は、公平な感謝は個人の記憶だけでなく貢献記録と照合すべきだと学びました。']
]});
window.V11_BATCH10_G2_DRAFTS=passages;
window.V11_BATCH10_G2_DRAFT_STATE={count:passages.length,registered:false,version:'20260829-author-r1'};
})();
