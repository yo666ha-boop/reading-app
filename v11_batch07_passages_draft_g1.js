(function buildV11Batch07G1Drafts(){
'use strict';
const BATCH='V11-B07-G1-DRAFT-20260829',SS='サンシャイン',NH='ニューホライズン';
function wc(rows){return (rows.map(r=>r[0]).join(' ').match(/[A-Za-z]+(?:['’][A-Za-z]+)?/g)||[]).length;}
function q(type,prompt,answer,evidence,evidenceJp,reason,extra){return Object.assign({questionType:type,prompt,answer,evidence,evidenceJp,reason},extra||{});}
function build(o){return Object.assign({grade:'1',level:'STANDARD',genre:'reading',batch:BATCH,targetWordBand:[90,125],wordCount:wc(o.rows),sentences:o.rows.map(r=>r[0]),fullTranslation:o.rows.map(r=>r[1]).join(''),slashRows:o.rows.map(r=>({en:r[0],jp:r[1]})),registered:false,semanticRewrite:'BATCH07_G1_ORIGINAL_20260829'},o,{rows:undefined});}
function qs(rows,info){const e=i=>rows[i][0],j=i=>rows[i][1];return {questions:[q('GIST','本文の中心内容を答えなさい。',info.gist,e(info.gistI),j(info.gistI),info.gistR),q('DETAIL',info.dq,info.da,e(info.di),j(info.di),'本文に直接示されています。'),q('REASON',info.rq,info.ra,e(info.ri),j(info.ri),'理由を示す文から答えられます。'),q('CONTENT_MATCH','本文の内容に合うものを答えなさい。',info.ca,e(info.ci),j(info.ci),'本文の記述と一致します。'),q('DETAIL',info.dq2,info.da2,e(info.di2),j(info.di2),'本文に直接示されています。')],questionSetB:[q('INFERENCE',info.iq,info.ia,e(info.ii),j(info.ii),'本文の出来事から考えられます。'),q('SENTENCE_INSERTION',info.insq,info.insa,e(info.insi),j(info.insi),info.insr,{insertAfterSentence:info.insi+1}),q('CONTEXT_WORD',info.cwq,info.cwa,e(info.cwi),j(info.cwi),'本文の語と文脈から判断できます。'),q('SUMMARY_FILL',info.sfq,info.sfa,e(info.sfi),j(info.sfi),'本文の要点を表す語です。'),q('CONTENT_MATCH',info.cq2,info.ca2,e(info.ci2),j(info.ci2),'本文の内容から判断できます。')]};}
const passages=[];
function add(o,info){const x=qs(o.rows,info);passages.push(build(Object.assign(o,x)));}

add({id:'V11-B07-G1-001',textbook:SS,section:'PROGRAM 10-2',sourceSectionBaselineId:'V10-SS-G1-P10-2-001',title:'The Jacket on the Wrong Hook',rows:[
['After basketball practice, Ken found a blue jacket on his hook.','バスケットボールの練習後、健は自分のフックに青い上着を見つけました。'],
['It looked like his jacket, but the sleeves were a little short.','自分の上着に見えましたが、袖が少し短かったです。'],
['Mina had another blue jacket, and she checked the name tag.','美奈はもう一着の青い上着を持ってきて、名札を確認しました。'],
['That jacket had Ken’s name, so the two jackets were mixed up.','その上着には健の名前があり、二着が入れ替わっていたと分かりました。'],
['The short jacket had a small star on one pocket.','短い上着のポケットには小さな星がありました。'],
['Mina remembered that Taro had a star on his jacket.','美奈は太郎の上着に星があったことを思い出しました。'],
['They found Taro in the gym and gave him the short jacket.','二人は体育館で太郎を見つけ、短い上着を渡しました。'],
['Ken took his own jacket and put it on the correct hook.','健は自分の上着を取り、正しいフックに掛けました。'],
['The students decided to check name tags before taking similar jackets.','生徒たちは似た上着を取る前に名札を確認することにしました。']
]}, {gist:'小さな手がかりと名札を確認して、入れ替わった上着を正しく返した話。',gistI:8,gistR:'最後の文が出来事から得た工夫をまとめています。',dq:'健が最初に気づいた上着の違いは何ですか。',da:'The sleeves were a little short.',di:1,rq:'二着が入れ替わったと分かったのはなぜですか。',ra:'もう一着に健の名前があったから。',ri:3,ca:'The short jacket had a star on a pocket.',ci:4,dq2:'太郎はどこで見つかりましたか。',da2:'in the gym',di2:6,iq:'美奈が太郎の上着だと考えた手がかりは何ですか。',ia:'ポケットの小さな星。',ii:5,insq:'“That clue gave them one more name to check.” を入れるならどこが自然ですか。',insa:'美奈が太郎の上着の星を思い出した文の直後。',insi:5,insr:'That clue は星の印を指し、次に太郎を探す流れにつながります。',cwq:'“They checked the name _____.” の空所に入る語を答えなさい。',cwa:'tag',cwi:2,sfq:'まとめの空所: “They used names and a small _____ to solve the mix-up.”',sfa:'star',sfi:4,cq2:'今後、似た上着を取る前に何をすることにしましたか。',ca2:'Check the name tag.',ci2:8});

add({id:'V11-B07-G1-002',textbook:NH,section:'Unit 10-2',sourceSectionBaselineId:'V10-NH-G1-U10-2-001',title:'A Seat Saved for Nobody',rows:[
['Aya arrived early at the school concert and saved one seat for Emi.','彩は学校のコンサートに早く着き、恵美のために一席取っておきました。'],
['Many families came, and soon only a few seats were empty.','多くの家族が来て、すぐに空席は少なくなりました。'],
['Emi sent a message and said she could not come.','恵美から、来られないというメッセージが届きました。'],
['Aya first left the bag on the empty seat.','彩は最初、空いた席にかばんを置いたままにしました。'],
['Then she saw an older man looking for a place to sit.','そのとき、座る場所を探している年配の男性に気づきました。'],
['Aya moved her bag and told him the seat was free.','彩はかばんを動かし、その席は空いていると男性に伝えました。'],
['The man thanked her and sat down before the concert began.','男性は礼を言い、コンサートが始まる前に座りました。'],
['Aya learned that a saved seat should be opened when the plan changes.','彩は、予定が変わったら取っておいた席を空けるべきだと学びました。'],
['That way, an empty place can help someone who is really there.','そうすれば、空いた場所を実際にいる人のために使えます。']
]}, {gist:'友達が来られなくなった後、取っておいた席を必要な人に譲った話。',gistI:7,gistR:'予定変更後の行動の学びをまとめています。',dq:'恵美は彩に何と伝えましたか。',da:'She could not come.',di:2,rq:'彩がかばんを動かしたのはなぜですか。',ra:'年配の男性が座る場所を探していたから。',ri:4,ca:'The man sat down before the concert began.',ci:6,dq2:'彩は最初、空席に何を置いていましたか。',da2:'her bag',di2:3,iq:'彩が席を空けたことはどんな考えを表していますか。',ia:'予定が変わったら、使わない席をほかの人に使ってもらう考え。',ii:7,insq:'“The seat was no longer needed for Emi.” を入れるならどこが自然ですか。',insa:'恵美が来られないと伝えた文の直後。',insi:2,insr:'Emiの予定変更を受け、席の状態を説明する位置です。',cwq:'“The seat was _____.” の空所に本文の語を入れなさい。',cwa:'free',cwi:5,sfq:'まとめの空所: “Aya moved her _____ and opened the seat.”',sfa:'bag',sfi:5,cq2:'彩が学んだことを答えなさい。',ca2:'Open a saved seat when the plan changes.',ci2:7});

add({id:'V11-B07-G1-003',textbook:SS,section:'PROGRAM 10-2',sourceSectionBaselineId:'V10-SS-G1-P10-2-001',title:'The Library Book with a Note',rows:[
['Riku returned a library book and saw a small note inside it.','陸は図書館の本を返すとき、中に小さなメモを見つけました。'],
['The note said, “Please bring the blue folder tomorrow.”','メモには「明日、青いファイルを持ってきてください」とありました。'],
['There was no name, and Riku did not read anything else.','名前はなく、陸はそれ以上読もうとしませんでした。'],
['He gave the note to the librarian with the book.','陸は本と一緒にメモを司書へ渡しました。'],
['The librarian checked the return record for that book.','司書はその本の貸出返却記録を確認しました。'],
['One student had returned it that morning before Riku borrowed it.','陸が借りる前、その朝に一人の生徒が返していました。'],
['The librarian contacted that student and asked about the note.','司書はその生徒に連絡し、メモについてたずねました。'],
['The note belonged to her, and she was happy to get it back.','メモはその生徒のもので、戻ってきて喜びました。'],
['Riku helped without trying to learn a private message.','陸は個人的な内容を知ろうとせずに手助けできました。']
]}, {gist:'本の中のメモを勝手に詳しく読まず、司書と記録を使って持ち主へ返した話。',gistI:8,gistR:'最後の文が安全で丁寧な行動をまとめています。',dq:'メモには何色のファイルと書かれていましたか。',da:'blue',di:1,rq:'陸が司書にメモを渡したのはなぜですか。',ra:'名前がなく、自分で個人的な内容を調べずに持ち主へ返すため。',ri:2,ca:'The librarian checked the book record.',ci:4,dq2:'メモの持ち主はどう感じましたか。',da2:'She was happy.',di2:7,iq:'陸の行動からどんな配慮が分かりますか。',ia:'必要以上に他人の個人的なメッセージを読まない配慮。',ii:8,insq:'“That was a safer way to find the owner.” を入れるならどこが自然ですか。',insa:'司書が返却記録を確認した文の直後。',insi:4,insr:'記録を使う方法を評価し、次の持ち主特定へつながります。',cwq:'“The librarian checked the return _____.” の空所を答えなさい。',cwa:'record',cwi:4,sfq:'まとめの空所: “Riku gave the note to the _____.”',sfa:'librarian',sfi:3,cq2:'陸がしなかったことは何ですか。',ca2:'He did not read anything else.',ci2:2});

add({id:'V11-B07-G1-004',textbook:NH,section:'Unit 10-2',sourceSectionBaselineId:'V10-NH-G1-U10-2-001',title:'The Clock Five Minutes Fast',rows:[
['Our classroom clock showed 8:25 when Yuna arrived for morning practice.','朝の練習に結菜が来たとき、教室の時計は8時25分を示していました。'],
['She thought she was late because practice started at 8:20.','練習は8時20分開始なので、遅刻したと思いました。'],
['Her phone showed 8:20, so she checked the hall clock.','携帯電話は8時20分だったため、廊下の時計を確認しました。'],
['The hall clock also showed 8:20.','廊下の時計も8時20分を示していました。'],
['The class compared the three times and found the problem.','クラスは三つの時刻を比べ、問題を見つけました。'],
['The classroom clock was five minutes fast.','教室の時計が五分進んでいました。'],
['A teacher corrected it before the next class.','先生が次の授業前に直しました。'],
['The students also wrote the real start time on the practice board.','生徒たちは練習ボードにも本当の開始時刻を書きました。'],
['After that, one wrong clock did not change their morning plan.','その後は、一つの間違った時計で朝の予定が変わることはありませんでした。']
]}, {gist:'複数の時計を比べて教室の時計が五分進んでいると確認し、予定の混乱を直した話。',gistI:8,gistR:'最後の文が問題解決の結果をまとめています。',dq:'朝の練習は何時に始まりますか。',da:'8:20',di:1,rq:'結菜が廊下の時計を確認したのはなぜですか。',ra:'教室の時計と携帯電話の時刻が違ったから。',ri:2,ca:'The classroom clock was five minutes fast.',ci:5,dq2:'誰が教室の時計を直しましたか。',da2:'a teacher',di2:6,iq:'二つの別の時計が8:20だったことから何が分かりますか。',ia:'教室の時計の方に問題がある可能性が高い。',ii:3,insq:'“Now they had two clocks showing the same time.” を入れるならどこが自然ですか。',insa:'廊下の時計も8:20だった文の直後。',insi:3,insr:'two clocks は携帯電話と廊下の時計を指します。',cwq:'“The clock was five minutes _____.” の空所を答えなさい。',cwa:'fast',cwi:5,sfq:'まとめの空所: “The class compared three _____.”',sfa:'times',sfi:4,cq2:'練習ボードに何を書きましたか。',ca2:'the real start time',ci2:7});

add({id:'V11-B07-G1-005',textbook:SS,section:'PROGRAM 10-2',sourceSectionBaselineId:'V10-SS-G1-P10-2-001',title:'A Snack for the Wrong Team',rows:[
['Two school teams practiced after class in nearby rooms.','二つの学校チームが放課後、近くの部屋で練習していました。'],
['A teacher left two snack bags outside the rooms.','先生は二つのおやつ袋を部屋の外に置きました。'],
['The soccer team opened a bag and found small rice crackers.','サッカーチームが袋を開けると、小さなせんべいが入っていました。'],
['Their note said they should have fruit because one player could not eat the crackers.','メモには、一人の選手がせんべいを食べられないので果物のはずだと書かれていました。'],
['Mai checked the other bag before anyone ate.','舞は誰かが食べる前にもう一方の袋を確認しました。'],
['It had fruit and a card marked “Soccer.”','そこには果物と「Soccer」と書かれたカードがありました。'],
['The rice crackers were for the table-tennis team.','せんべいは卓球チーム用でした。'],
['Mai changed the bags and told both teams about the mistake.','舞は袋を交換し、両チームに間違いを伝えました。'],
['Checking the card first kept the snack mistake from becoming a food problem.','先にカードを確認したことで、おやつの間違いが食べ物の問題になるのを防げました。']
]}, {gist:'おやつ袋のカードを確認し、食べる前に二つのチームの袋の取り違えを直した話。',gistI:8,gistR:'最後の文が確認の大切さをまとめています。',dq:'サッカーチームの正しいおやつは何でしたか。',da:'fruit',di:5,rq:'舞が誰かが食べる前にもう一方の袋を確認したのはなぜですか。',ra:'メモと袋の中身が合わず、食べられない選手がいたから。',ri:3,ca:'The crackers were for the table-tennis team.',ci:6,dq2:'正しい袋には何と書かれたカードがありましたか。',da2:'Soccer',di2:5,iq:'舞の確認が特に大切だった理由は何ですか。',ia:'食べられない物を口にする選手が出る前に間違いを止められたから。',ii:8,insq:'“Something was clearly wrong.” を入れるならどこが自然ですか。',insa:'本来は果物のはずだというメモを説明した文の直後。',insi:3,insr:'メモと袋の中身の不一致を受け、次の確認行動につながります。',cwq:'“The card was marked _____.” の空所を答えなさい。',cwa:'Soccer',cwi:5,sfq:'まとめの空所: “Mai checked the other _____ before anyone ate.”',sfa:'bag',sfi:4,cq2:'舞は間違いを直した後、誰に伝えましたか。',ca2:'both teams',ci2:7});

add({id:'V11-B07-G1-006',textbook:NH,section:'Unit 10-2',sourceSectionBaselineId:'V10-NH-G1-U10-2-001',title:'The Name Missing from the List',rows:[
['Our class made a job list for the school festival.','クラスは学校祭の係の一覧を作りました。'],
['Every student had one job, but Sora could not find his name.','全員に一つ係がありましたが、空は自分の名前を見つけられませんでした。'],
['He first thought the class had forgotten him.','空は最初、クラスが自分を忘れたのだと思いました。'],
['Miki checked the first paper used to make the list.','美紀は一覧を作るとき使った最初の紙を確認しました。'],
['Sora’s name was there beside “chair team.”','そこには「いす係」の横に空の名前がありました。'],
['The name was missed when the clean copy was written.','清書するときに名前が抜けていたのです。'],
['The class added Sora and checked every other name once more.','クラスは空を追加し、ほかの名前ももう一度確認しました。'],
['No other student was missing, and Sora joined the chair team.','ほかに抜けた生徒はおらず、空はいす係に加わりました。'],
['The class learned to compare a new list with the first paper before using it.','クラスは新しい一覧を使う前に元の紙と比べることにしました。']
]}, {gist:'清書で抜けた名前を元の紙で確認し、一覧を正しく直した話。',gistI:8,gistR:'最後の文が再発防止をまとめています。',dq:'空の元の係は何でしたか。',da:'chair team',di:4,rq:'空の名前が新しい一覧になかったのはなぜですか。',ra:'清書するときに抜けたから。',ri:5,ca:'The class checked every other name again.',ci:6,dq2:'ほかに名前が抜けた生徒はいましたか。',da2:'No.',di2:7,iq:'最初の紙を残していたことはどう役立ちましたか。',ia:'空の本来の係と、清書時の抜けを確認できた。',ii:4,insq:'“The first paper showed that the job had already been decided.” を入れるならどこが自然ですか。',insa:'空の名前がchair teamの横にあった文の直後。',insi:4,insr:'first paper の内容を受け、次に清書ミスだと分かる流れです。',cwq:'“The name was _____ when the clean copy was written.” の空所を答えなさい。',cwa:'missed',cwi:5,sfq:'まとめの空所: “They compared the clean list with the first _____.”',sfa:'paper',sfi:3,cq2:'今後、新しい一覧を使う前に何をしますか。',ca2:'Compare it with the first paper.',ci2:8});

add({id:'V11-B07-G1-007',textbook:SS,section:'PROGRAM 10-2',sourceSectionBaselineId:'V10-SS-G1-P10-2-001',title:'The Wet Shoes by the Door',rows:[
['Heavy rain came before the students entered the music room.','生徒が音楽室に入る前に強い雨が降りました。'],
['Many students left wet outdoor shoes near the door.','多くの生徒がぬれた外靴を入口近くに置きました。'],
['After practice, two students took similar black shoes by mistake.','練習後、二人の生徒が似た黒い靴を間違えて取りました。'],
['They noticed the problem before leaving school and brought the shoes back.','二人は学校を出る前に間違いに気づき、靴を戻しました。'],
['The class moved the wet shoes onto two long mats.','クラスはぬれた靴を二枚の長いマットへ移しました。'],
['One mat was for the left side of the room and one for the right side.','一枚は部屋の左側用、もう一枚は右側用にしました。'],
['They also made a sign: “Put your shoes by your room side.”','さらに「自分の側のマットに靴を置こう」という表示を作りました。'],
['The next rainy day, students found their shoes more easily.','次の雨の日には、生徒たちは自分の靴をより簡単に見つけられました。'],
['A simple place rule helped even when many shoes looked the same.','多くの靴が似ていても、置き場所の簡単なルールが役立ちました。']
]}, {gist:'似たぬれた靴を間違えないよう、置く場所を分けて表示を作った話。',gistI:8,gistR:'最後の文が工夫の効果をまとめています。',dq:'間違えた靴は何色でしたか。',da:'black',di:2,rq:'靴を二枚のマットに分けたのはなぜですか。',ra:'似た靴を見つけやすくし、取り違えを減らすため。',ri:2,ca:'Students noticed the mistake before leaving school.',ci:3,dq2:'マットは何枚使いましたか。',da2:'two',di2:4,iq:'表示が役立つ理由を答えなさい。',ia:'どちら側に自分の靴を置いたか分かり、探す範囲が小さくなるから。',ii:6,insq:'“They needed a way to separate the similar pairs.” を入れるならどこが自然ですか。',insa:'二人が靴を戻した文の直後。',insi:3,insr:'取り違え問題を受け、次のマット分けへつながります。',cwq:'“One _____ was for the left side.” の空所を答えなさい。',cwa:'mat',cwi:5,sfq:'まとめの空所: “The class made a simple place _____.”',sfa:'rule',sfi:8,cq2:'次の雨の日、何が変わりましたか。',ca2:'Students found their shoes more easily.',ci2:7});

add({id:'V11-B07-G1-008',textbook:NH,section:'Unit 10-2',sourceSectionBaselineId:'V10-NH-G1-U10-2-001',title:'A Shorter Way to the Gym',rows:[
['Leo was new at school and often forgot the way to the gym.','レオは転校してきたばかりで、体育館への道をよく忘れました。'],
['A classmate showed him a short route through three small hallways.','友達が三つの短い廊下を通る近道を教えました。'],
['Leo reached the gym quickly, but he missed one turn the next day.','レオはすぐ体育館に着きましたが、翌日は曲がる場所を一つ間違えました。'],
['His teacher showed another route along one long hallway and the library.','先生は長い廊下一本と図書館の横を通る別の道を教えました。'],
['That route took one minute more, but it had only one turn.','その道は一分多くかかりましたが、曲がる場所は一つだけでした。'],
['Leo tried both routes again after school.','レオは放課後に両方の道をもう一度試しました。'],
['He chose the longer route because the library was an easy landmark.','図書館が分かりやすい目印だったため、少し長い方を選びました。'],
['After one week, he could reach the gym without help.','一週間後、助けなしで体育館へ行けるようになりました。'],
['For Leo, the easiest route to remember was better than the shortest route.','レオにとっては、最短の道より覚えやすい道の方がよかったのです。']
]}, {gist:'最短ではなく、目印があり覚えやすい道を選んだ新入生の話。',gistI:8,gistR:'最後の文が二つの道の比較をまとめています。',dq:'短い道には小さな廊下がいくつありましたか。',da:'three',di:1,rq:'レオが長い道を選んだのはなぜですか。',ra:'図書館が分かりやすい目印で、曲がる場所も少なかったから。',ri:6,ca:'The longer route took one minute more.',ci:4,dq2:'一週間後、レオはどうなりましたか。',da2:'He could reach the gym without help.',di2:7,iq:'この話から「よい道」は人によって変わると言えるのはなぜですか。',ia:'速さだけでなく、覚えやすさもレオには重要だったから。',ii:8,insq:'“Speed was not his only problem.” を入れるならどこが自然ですか。',insa:'翌日に曲がる場所を間違えた文の直後。',insi:2,insr:'速く着けても覚えにくい問題があることを受けます。',cwq:'“The library was an easy _____.” の空所を答えなさい。',cwa:'landmark',cwi:6,sfq:'まとめの空所: “Leo chose the route that was easier to _____.”',sfa:'remember',sfi:8,cq2:'先生の道は曲がる場所がいくつでしたか。',ca2:'one',ci2:4});

add({id:'V11-B07-G1-009',textbook:SS,section:'PROGRAM 10-2',sourceSectionBaselineId:'V10-SS-G1-P10-2-001',title:'The Plant That Faced the Wall',rows:[
['Our class had four small plants near a classroom window.','クラスには教室の窓近くに四つの小さな植物がありました。'],
['Three plants grew well, but one plant stayed small.','三つはよく育ちましたが、一つだけ小さいままでした。'],
['Mao checked the water and found that all four had the same amount.','真央が水を確認すると、四つとも同じ量をもらっていました。'],
['Then she noticed that the small plant faced the wall.','そのとき、小さい植物だけ壁の方を向いていることに気づきました。'],
['A tall box also blocked some light from the window.','さらに、高い箱が窓からの光を一部さえぎっていました。'],
['The class moved the box and turned the plant toward the window.','クラスは箱を移し、植物を窓の方へ向けました。'],
['They kept the water schedule the same.','水やりの予定は同じままにしました。'],
['Two weeks later, new leaves appeared on the small plant.','二週間後、小さな植物に新しい葉が出ました。'],
['Changing one condition helped the class see that light had mattered.','一つの条件を変えることで、光が重要だったと分かりました。']
]}, {gist:'水ではなく光の条件を確認し、植物の向きと箱を変えて成長を助けた話。',gistI:8,gistR:'最後の文が条件を比べた学びをまとめています。',dq:'植物はいくつありましたか。',da:'four',di:0,rq:'小さい植物の場所を変えたのはなぜですか。',ra:'壁を向き、箱で窓の光が一部さえぎられていたから。',ri:4,ca:'The class kept the water schedule the same.',ci:6,dq2:'二週間後、何が出ましたか。',da2:'new leaves',di2:7,iq:'水やりを同じままにしたことはどう役立ちましたか。',ia:'変えた主な条件が光だと考えやすくなった。',ii:6,insq:'“So water did not seem to explain the difference.” を入れるならどこが自然ですか。',insa:'四つとも同じ量の水だったと述べた文の直後。',insi:2,insr:'同じ水量を受け、次に別の条件を見る流れです。',cwq:'“A tall box blocked some _____.” の空所を答えなさい。',cwa:'light',cwi:4,sfq:'まとめの空所: “The class changed one _____.”',sfa:'condition',sfi:8,cq2:'箱を移した後も同じにしたことは何ですか。',ca2:'the water schedule',ci2:6});

add({id:'V11-B07-G1-010',textbook:NH,section:'Unit 10-2',sourceSectionBaselineId:'V10-NH-G1-U10-2-001',title:'The Bus Stop Photo',rows:[
['Nina and Haru were going to a sports center by bus.','ニナと春はバスでスポーツセンターへ行こうとしていました。'],
['A friend sent them a photo of the bus stop.','友達がバス停の写真を送ってくれました。'],
['They found a stop with the same blue roof and waited there.','二人は同じ青い屋根のバス停を見つけ、そこで待ちました。'],
['Haru then noticed that the photo also showed a bakery sign.','そのとき春は、写真にパン屋の看板も写っていることに気づきました。'],
['There was no bakery near their stop.','二人がいるバス停の近くにはパン屋がありませんでした。'],
['They checked the stop name and saw “East Gate.”','バス停名を確認すると「East Gate」とありました。'],
['Their message said “West Gate,” so they walked one block west.','メッセージには「West Gate」とあったため、一ブロック西へ歩きました。'],
['The correct stop had the blue roof and the bakery sign.','正しいバス停には青い屋根とパン屋の看板がありました。'],
['The photo helped only after they checked more than one clue.','写真は一つ以上の手がかりを確認して初めて役立ちました。']
]}, {gist:'似たバス停を写真の複数の手がかりと名前で確認し、正しい場所を見つけた話。',gistI:8,gistR:'最後の文が確認方法をまとめています。',dq:'最初に見つけたバス停の屋根は何色でしたか。',da:'blue',di:2,rq:'二人が最初のバス停を離れたのはなぜですか。',ra:'写真にあるパン屋がなく、バス停名もEast Gateでメッセージと違ったから。',ri:5,ca:'The correct stop had a bakery sign.',ci:7,dq2:'正しいバス停名は何ですか。',da2:'West Gate',di2:6,iq:'青い屋根だけでは十分な手がかりでなかったのはなぜですか。',ia:'別のバス停にも同じ青い屋根があったから。',ii:2,insq:'“The roof alone was not enough.” を入れるならどこが自然ですか。',insa:'写真にもパン屋の看板があると気づいた文の直後。',insi:3,insr:'追加の手がかりに気づいたあと、比較へ進む位置です。',cwq:'“They checked the stop _____.” の空所を答えなさい。',cwa:'name',cwi:5,sfq:'まとめの空所: “They used more than one _____.”',sfa:'clue',sfi:8,cq2:'正しいバス停は最初の場所からどちらへありましたか。',ca2:'west',ci2:6});

add({id:'V11-B07-G1-011',textbook:SS,section:'PROGRAM 10-2',sourceSectionBaselineId:'V10-SS-G1-P10-2-001',title:'One Missing Music Stand',rows:[
['Our music group needed six stands for an afternoon practice.','音楽グループは午後の練習に譜面台が六台必要でした。'],
['When practice began, only five stands were in the room.','練習開始時、部屋には五台しかありませんでした。'],
['The students first looked in the hall but found nothing.','生徒たちは最初に廊下を探しましたが、見つかりませんでした。'],
['They did not want to lose all their practice time.','練習時間を全部失いたくありませんでした。'],
['Two players shared one stand for the first song.','最初の曲では二人の演奏者が一台を一緒に使いました。'],
['During a short break, Yui checked the storage room.','短い休憩中、結衣が倉庫を確認しました。'],
['The missing stand was behind a box from the morning class.','なくなった譜面台は午前の授業で使った箱の後ろにありました。'],
['They brought it back and used six stands for the next song.','それを戻し、次の曲では六台を使いました。'],
['The group solved the problem without stopping the whole practice.','グループは練習全体を止めずに問題を解決しました。']
]}, {gist:'譜面台が一台なくても練習を止めず、一時的に共有して休憩中に見つけた話。',gistI:8,gistR:'最後の文が工夫と結果をまとめています。',dq:'必要な譜面台は何台でしたか。',da:'six',di:0,rq:'二人が一台を共有したのはなぜですか。',ra:'一台見つからず、練習時間を失いたくなかったから。',ri:3,ca:'The missing stand was behind a box.',ci:6,dq2:'誰が倉庫を確認しましたか。',da2:'Yui',di2:5,iq:'最初の曲で共有したことの利点は何ですか。',ia:'譜面台を探している間も練習を続けられた。',ii:4,insq:'“They needed a temporary plan.” を入れるならどこが自然ですか。',insa:'練習時間を失いたくないと述べた文の直後。',insi:3,insr:'問題を受けて次の共有方法へつながります。',cwq:'“The missing stand was in the storage _____.” の空所を答えなさい。',cwa:'room',cwi:5,sfq:'まとめの空所: “Two players _____ one stand.”',sfa:'shared',sfi:4,cq2:'次の曲では譜面台を何台使いましたか。',ca2:'six',ci2:7});

add({id:'V11-B07-G1-012',textbook:NH,section:'Unit 10-2',sourceSectionBaselineId:'V10-NH-G1-U10-2-001',title:'The Birthday Card with No Name',rows:[
['A colorful birthday card was on Mika’s desk after lunch.','昼休み後、美香の机にカラフルな誕生日カードがありました。'],
['The card had no name, so Mika did not know who made it.','カードに名前がなく、美香は誰が作ったのか分かりませんでした。'],
['It had a yellow paper flower and a small cat drawing.','黄色い紙の花と小さな猫の絵が付いていました。'],
['Rena remembered making yellow flowers with Aoi in art class.','玲奈は図工の時間に葵と黄色い花を作ったことを思い出しました。'],
['Mika also remembered that Aoi often drew the same small cat.','美香は葵がよく同じ小さな猫を描いていたことも思い出しました。'],
['They asked Aoi instead of writing her name on the card themselves.','自分たちで名前を書かず、葵にたずねました。'],
['Aoi smiled and said she had made the card that morning.','葵は笑って、その朝カードを作ったと話しました。'],
['She had forgotten to sign it before the bell rang.','チャイムが鳴る前に名前を書くのを忘れていたのです。'],
['Two remembered details helped them check the maker without guessing only once.','二つの覚えていた特徴が、一つの思いつきだけで決めずに作り手を確認する助けになりました。']
]}, {gist:'カードの花と猫の絵という二つの特徴を使い、作り手本人に確認した話。',gistI:8,gistR:'最後の文が手がかりの使い方をまとめています。',dq:'カードの花は何色でしたか。',da:'yellow',di:2,rq:'葵に直接たずねたのはなぜですか。',ra:'手がかりはあっても、決めつけず本人に確認するため。',ri:5,ca:'Aoi made the card that morning.',ci:6,dq2:'葵は何を忘れましたか。',da2:'to sign the card',di2:7,iq:'二つの手がかりを使った利点は何ですか。',ia:'一つの特徴だけで作り手を決めつけずに確認できた。',ii:8,insq:'“Both clues pointed to the same person.” を入れるならどこが自然ですか。',insa:'葵が同じ猫をよく描くと述べた文の直後。',insi:4,insr:'花と猫の二つの手がかりがそろった後の位置です。',cwq:'“She forgot to _____ it.” の空所を答えなさい。',cwa:'sign',cwi:7,sfq:'まとめの空所: “They asked Aoi instead of only _____.”',sfa:'guessing',sfi:8,cq2:'カードの作り手は誰でしたか。',ca2:'Aoi',ci2:6});

add({id:'V11-B07-G1-013',textbook:SS,section:'PROGRAM 10-2',sourceSectionBaselineId:'V10-SS-G1-P10-2-001',title:'The Door That Would Not Close',rows:[
['After lunch, a classroom door would not close completely.','昼食後、教室のドアが完全に閉まらなくなりました。'],
['Kota pushed it once, but the door stopped near the floor.','航太が一度押しましたが、ドアは床の近くで止まりました。'],
['He did not push harder because he did not know the cause.','原因が分からなかったため、もっと強く押しませんでした。'],
['A small metal part was loose near the bottom of the door.','ドアの下の方で小さな金属部品が緩んでいました。'],
['The students moved their bags away from the doorway.','生徒たちは入口付近からかばんを移しました。'],
['They put a chair nearby with a note: “Please use the other door.”','近くにいすを置き、「別のドアを使ってください」というメモを付けました。'],
['Then Kota told a teacher about the loose part.','その後、航太は緩んだ部品について先生に伝えました。'],
['The teacher asked the office to check the door before the next class.','先生は次の授業前に事務室へドアの点検を頼みました。'],
['The students kept the area safe without trying to repair something they did not understand.','生徒たちは分からない物を自分で直そうとせず、周囲を安全に保ちました。']
]}, {gist:'原因不明のドアを無理に直さず、周囲を安全にして先生へ知らせた話。',gistI:8,gistR:'最後の文が安全な対応をまとめています。',dq:'ドアのどこに緩んだ部品がありましたか。',da:'near the bottom',di:3,rq:'航太が強く押さなかったのはなぜですか。',ra:'原因が分からなかったから。',ri:2,ca:'Students told people to use the other door.',ci:5,dq2:'航太は誰に知らせましたか。',da2:'a teacher',di2:6,iq:'かばんを入口から動かした目的は何ですか。',ia:'壊れたドアの近くを安全にして通行の邪魔を減らすため。',ii:4,insq:'“For now, the important job was to keep people away from the problem.” を入れるならどこが自然ですか。',insa:'緩んだ部品を見つけた文の直後。',insi:3,insr:'原因を見つけた後、次の安全確保へつながります。',cwq:'“A metal part was _____.” の空所を答えなさい。',cwa:'loose',cwi:3,sfq:'まとめの空所: “They asked people to use the other _____.”',sfa:'door',sfi:5,cq2:'生徒たちが自分でしなかったことは何ですか。',ca2:'They did not try to repair the door.',ci2:8});

add({id:'V11-B07-G1-014',textbook:NH,section:'Unit 10-2',sourceSectionBaselineId:'V10-NH-G1-U10-2-001',title:'The Two Morning Alarms',rows:[
['Hina used one phone alarm every morning at 6:30.','陽菜は毎朝6時30分に携帯電話のアラームを一つ使っていました。'],
['Most days it worked, but busy sports days were different.','たいていの日はうまくいきましたが、忙しい運動部の日は違いました。'],
['One Tuesday, she turned the alarm off and fell asleep again.','ある火曜日、アラームを止めてもう一度眠ってしまいました。'],
['She woke at 7:10 and had no time to check her sports bag.','7時10分に起き、スポーツバッグを確認する時間がありませんでした。'],
['At school, she found that her towel was still at home.','学校で、タオルを家に忘れたことに気づきました。'],
['That evening, Hina added a second alarm at 6:40.','その夜、陽菜は6時40分に二つ目のアラームを設定しました。'],
['She put the phone across the room, so she had to stand up.','携帯電話を部屋の反対側に置き、立ち上がらないと止められないようにしました。'],
['She also packed the sports bag before going to bed.','さらに、寝る前にスポーツバッグを準備しました。'],
['The two changes made busy mornings less dependent on one alarm.','二つの変更で、忙しい朝が一つのアラームだけに頼らなくなりました。']
]}, {gist:'寝過ごしをきっかけに、二つ目のアラームと前夜の準備で朝の失敗を減らした話。',gistI:8,gistR:'最後の文が二つの改善をまとめています。',dq:'最初のアラームは何時でしたか。',da:'6:30',di:0,rq:'陽菜が二つ目のアラームを付けたのはなぜですか。',ra:'一つ目を止めて寝直し、準備する時間を失ったから。',ri:2,ca:'She packed the sports bag before bed.',ci:7,dq2:'二つ目のアラームは何時ですか。',da2:'6:40',di2:5,iq:'携帯電話を部屋の反対側に置く利点は何ですか。',ia:'アラームを止めるために立ち上がる必要があり、寝直しにくくなる。',ii:6,insq:'“The problem was not only the time on the clock.” を入れるならどこが自然ですか。',insa:'タオルを忘れたと気づいた文の直後。',insi:4,insr:'寝坊が準備不足につながったことを受け、次の習慣改善へつながります。',cwq:'“She added a second _____.” の空所を答えなさい。',cwa:'alarm',cwi:5,sfq:'まとめの空所: “She packed her bag before going to _____.”',sfa:'bed',sfi:7,cq2:'陽菜は携帯電話をどこへ置きましたか。',ca2:'across the room',ci2:6});

add({id:'V11-B07-G1-015',textbook:SS,section:'PROGRAM 10-2',sourceSectionBaselineId:'V10-SS-G1-P10-2-001',title:'The Ball Under the Bench',rows:[
['The soccer team counted its balls after practice and found one missing.','サッカーチームが練習後にボールを数えると、一つ足りませんでした。'],
['They had used six balls near the goal and four near the benches.','ゴール近くで六個、ベンチ近くで四個使っていました。'],
['The players first searched only behind the goal.','選手たちは最初、ゴールの後ろだけを探しました。'],
['No ball was there, so Mei asked where the last drill happened.','見つからなかったため、芽衣は最後の練習をどこでしたかたずねました。'],
['The last drill was beside the benches.','最後の練習はベンチのそばでした。'],
['The team walked back along that part of the field.','チームはその場所までグラウンドを戻りました。'],
['One ball was under the far bench behind a sports bag.','一つのボールが遠いベンチの下、スポーツバッグの後ろにありました。'],
['They found all ten balls before leaving school.','学校を出る前に十個すべて見つかりました。'],
['Remembering where equipment was last used made the search shorter.','道具を最後に使った場所を思い出すことで、探す範囲を短くできました。']
]}, {gist:'最後にボールを使った場所をたどり、なくなった一個を効率よく見つけた話。',gistI:8,gistR:'最後の文が探し方をまとめています。',dq:'全部でボールはいくつありましたか。',da:'ten',di:7,rq:'ゴールの後ろで見つからなかった後、芽衣は何を確認しましたか。',ra:'最後の練習をした場所。',ri:3,ca:'The missing ball was under a bench.',ci:6,dq2:'最後の練習はどこでしたか。',da2:'beside the benches',di2:4,iq:'最後に使った場所を思い出すことの利点は何ですか。',ia:'探す場所をしぼれる。',ii:8,insq:'“That gave them a better place to search.” を入れるならどこが自然ですか。',insa:'最後の練習がベンチのそばだと分かった文の直後。',insi:4,insr:'That は最後の使用場所の情報を指します。',cwq:'“The ball was under the far _____.” の空所を答えなさい。',cwa:'bench',cwi:6,sfq:'まとめの空所: “They remembered where the ball was last _____.”',sfa:'used',sfi:8,cq2:'ボールの前には何がありましたか。',ca2:'a sports bag',ci2:6});

add({id:'V11-B07-G1-016',textbook:NH,section:'Unit 10-2',sourceSectionBaselineId:'V10-NH-G1-U10-2-001',title:'A Message for the Next Class',rows:[
['Class 1A used the science room before Class 1B.','1年A組は1年B組の前に理科室を使いました。'],
['A student wrote a quick note on the board: “Box. Back. Please.”','生徒が黒板に「箱。後ろ。お願い。」という急いだメモを書きました。'],
['The next class could not tell which box or what to do with it.','次のクラスは、どの箱で何をするのか分かりませんでした。'],
['Their teacher asked 1A to explain the message.','先生は1年A組にメッセージの意味を説明してもらいました。'],
['The red experiment box had to go back on the rear shelf.','赤い実験箱を後ろの棚へ戻す必要がありました。'],
['The students rewrote the note: “Please put the red experiment box on the back shelf.”','生徒たちは「赤い実験箱を後ろの棚に置いてください」と書き直しました。'],
['They added a small drawing of the shelf.','棚の小さな絵も加えました。'],
['Class 1B understood the new message without asking another question.','1年B組は新しいメッセージを追加質問なしで理解できました。'],
['The class learned that a short message is useful only when the next reader has enough information.','短いメッセージでも、次に読む人に十分な情報があって初めて役立つと学びました。']
]}, {gist:'急ぎすぎて意味が伝わらないメッセージを、具体的な物と場所が分かる文に直した話。',gistI:8,gistR:'最後の文が分かりやすいメッセージの条件をまとめています。',dq:'戻す箱は何色でしたか。',da:'red',di:4,rq:'最初のメモが分かりにくかったのはなぜですか。',ra:'どの箱をどうするか書かれていなかったから。',ri:2,ca:'They added a drawing of the shelf.',ci:6,dq2:'新しいメッセージを読んだクラスはどこですか。',da2:'Class 1B',di2:7,iq:'棚の絵を加えた利点は何ですか。',ia:'箱を置く場所をさらに分かりやすくできる。',ii:6,insq:'“The words were short, but they were too short.” を入れるならどこが自然ですか。',insa:'次のクラスが意味を分からなかった文の直後。',insi:2,insr:'最初の短いメモの問題をまとめ、説明へつながります。',cwq:'“Put the box on the back _____.” の空所を答えなさい。',cwa:'shelf',cwi:5,sfq:'まとめの空所: “The new note named the box and the _____.”',sfa:'place',sfi:5,cq2:'1Bは新しいメッセージを読んだ後、追加質問が必要でしたか。',ca2:'No.',ci2:7});

add({id:'V11-B07-G1-017',textbook:SS,section:'PROGRAM 10-2',sourceSectionBaselineId:'V10-SS-G1-P10-2-001',title:'The Windy Outdoor Display',rows:[
['Our class put paper pictures on boards for an outdoor school event.','クラスは屋外の学校行事のため、紙の写真を板に貼りました。'],
['At first, each picture had tape only at the top.','最初、それぞれの写真は上側だけをテープで留めていました。'],
['A strong wind began before visitors arrived.','来場者が来る前に強い風が吹き始めました。'],
['The bottom of several pictures lifted and covered the words below them.','何枚かの写真の下側がめくれ、下の文字を隠しました。'],
['The students took the boards inside for ten minutes.','生徒たちは十分間、板を屋内へ運びました。'],
['They added tape to all four corners of each picture.','それぞれの写真の四隅すべてにテープを追加しました。'],
['For the largest paper, they also used two small clips.','いちばん大きな紙には小さなクリップも二つ使いました。'],
['The boards went outside again, and the pictures stayed flat.','板を再び外へ出すと、写真は平らなままでした。'],
['The class changed the way it fixed the paper instead of hoping the wind would stop.','風が止むことを期待するのではなく、紙の留め方を変えました。']
]}, {gist:'風で紙がめくれたため、四隅とクリップで留め方を強くして展示を直した話。',gistI:8,gistR:'最後の文が問題への対応をまとめています。',dq:'最初、テープは写真のどこにありましたか。',da:'only at the top',di:1,rq:'板を一度屋内へ運んだのはなぜですか。',ra:'風で写真がめくれ、文字を隠したため安全に留め直すため。',ri:3,ca:'The largest paper used two clips.',ci:6,dq2:'板を屋内へ運んだ時間はどれくらいですか。',da2:'ten minutes',di2:4,iq:'四隅にテープを付けた目的は何ですか。',ia:'風で写真の下側がめくれないようにするため。',ii:5,insq:'“The display could not be read clearly like that.” を入れるならどこが自然ですか。',insa:'写真が下の文字を隠した文の直後。',insi:3,insr:'like that は直前のめくれた状態を指します。',cwq:'“They used two small _____.” の空所を答えなさい。',cwa:'clips',cwi:6,sfq:'まとめの空所: “They added tape to all four _____.”',sfa:'corners',sfi:5,cq2:'再び外へ出した後、写真はどうなりましたか。',ca2:'They stayed flat.',ci2:7});

window.V11_BATCH07_G1_DRAFTS=passages;window.V11_BATCH07_G1_DRAFT_STATE={batch:BATCH,count:passages.length,ids:passages.map(p=>p.id),wordCounts:Object.fromEntries(passages.map(p=>[p.id,p.wordCount])),registered:false};
})();
