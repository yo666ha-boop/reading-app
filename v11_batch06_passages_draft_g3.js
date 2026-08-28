(function buildV11Batch06Grade3Draft(){
'use strict';
const BATCH='V11-B06-G3-DRAFT-20260829';
function slash(en){return en.replace(/, /g,', / ').replace(/\b(and|but|because|so|before|after|until|then|when|while|although|if)\b/gi,'/ $1');}
function wc(rows){return (rows.map(r=>r[0]).join(' ').match(/[A-Za-z]+(?:['’][A-Za-z]+)?/g)||[]).length;}
function build(id,textbook,section,baseline,title,rows,notes){const qs=rows.slice(0,10).map((r,i)=>({prompt:`${i+1}. 本文の第${i+1}文の内容に合う英文を本文から一文答えなさい。`,answer:r[0],evidence:r[0],evidenceJp:r[1],reason:`第${i+1}文が直接の根拠です。`}));return {id,textbook,grade:'3',section,level:'STEP',title,genre:'story',batch:BATCH,sourceSectionBaselineId:baseline,targetWordBand:[140,185],wordCount:wc(rows),sentences:rows.map(r=>r[0]),fullTranslation:rows.map(r=>r[1]).join(''),slashRows:rows.map(r=>({en:slash(r[0]),jp:r[1]})),questions:qs.slice(0,5),questionSetB:qs.slice(5,10),notes:(notes||[]).map(n=>({english:n[0],japanese:n[1],kind:'unlearned_local_required',source:'v11 Batch06 G3 story-specific required note seed'})),semanticRewrite:'BATCH06_G3_STORY_SPECIFIC_20260829',registered:false,auditNote:'Batch06 G3 non-runtime draft; all chronology and final gates still required.'};}
const SS='サンシャイン',NH='ニューホライズン',ssBase='V10-SS-G3-P7-3-001',nhBase='V10-NH-G3-U6-4-001';
const all=[
build('V11-B06-G3-001',SS,'PROGRAM 7-3',ssBase,'The Local History Sign Debate',[
['Our class was asked to help write a small sign beside an old stone bridge in town.','私たちのクラスは町の古い石橋のそばに置く小さな案内板作りを手伝うことになりました。'],
['The local history book contained many facts, but the sign had room for only about eighty words.','地域史の本には多くの事実がありましたが、案内板には約八十語しか入りませんでした。'],
['One group wanted to explain the year the bridge was built and the name of its builder.','一つの班は橋が造られた年と建設者の名前を説明したいと考えました。'],
['Another group preferred a story about how the bridge connected two neighborhoods during floods.','別の班は洪水のときに橋が二つの地域をつないだ話を入れたいと考えました。'],
['A third group argued that visitors first needed to know why the bridge still mattered today.','三つ目の班は、まず現在その橋が重要な理由を来訪者が知る必要があると主張しました。'],
['We listed the facts and asked which ones helped a person understand the place within one minute.','事実を書き出し、一分以内に場所を理解する助けになるものはどれか考えました。'],
['The final sign included the date, one sentence about the builder, and the flood story in two short lines.','最終案内板には年代、建設者についての一文、洪水の話を短い二行で入れました。'],
['A final line explained that people still crossed the bridge daily on their way to shops and school.','最後の一行では、今も人々が店や学校へ行くため毎日橋を渡ることを説明しました。'],
['Choosing fewer facts did not make the history smaller; it made the main story easier to understand.','事実を減らしても歴史が小さくなるのではなく、中心となる物語が理解しやすくなりました。']
],[['neighborhood','地域'],['flood','洪水'],['builder','建設者']]),
build('V11-B06-G3-002',NH,'Unit 6-4',nhBase,'The Volunteer Schedule Nobody Used',[
['A student committee created a detailed volunteer schedule for the school festival.','生徒委員会は学校祭のために詳しいボランティア予定表を作りました。'],
['It showed every job, room, time, and member on one large sheet filled with small boxes.','一枚の大きな紙に、すべての仕事、部屋、時刻、担当者を小さな枠で示しました。'],
['The information was correct, yet volunteers repeatedly asked where they should go next.','情報は正しかったのに、ボランティアは次にどこへ行くべきか何度もたずねました。'],
['During lunch, the committee watched several people try to read the sheet from a crowded hallway.','昼食時、委員会は混雑した廊下で何人かが予定表を読もうとする様子を観察しました。'],
['Most readers first searched for their own names, not for the job names or room numbers.','ほとんどの人は仕事名や部屋番号ではなく、まず自分の名前を探していました。'],
['The committee made a second version with one short line for each volunteer and larger time headings.','委員会は担当者ごとに一行を使い、時刻の見出しを大きくした二つ目の版を作りました。'],
['They also placed separate copies near the entrance, stage, and food area instead of using only one central sheet.','一枚だけを中央に置くのではなく、入口、舞台、飲食場所の近くにも別のコピーを置きました。'],
['On the second festival day, far fewer people stopped to ask for directions.','学校祭二日目には、行き先をたずねて立ち止まる人が大きく減りました。'],
['The first schedule had contained every fact, but the redesign made those facts easier to use at the right moment.','最初の予定表にはすべての事実がありましたが、作り直したことで必要なときに使いやすくなりました。']
],[['committee','委員会'],['redesign','作り直すこと']]),
build('V11-B06-G3-003',SS,'PROGRAM 7-3',ssBase,'The Photograph Without a Date',[
['Our history teacher showed us an old photograph of the shopping street near our school.','歴史の先生が学校近くの商店街の古い写真を見せてくれました。'],
['No date was written on the back, so our task was to estimate when the picture had been taken.','裏に日付がなかったため、写真がいつ撮られたか推定することが課題でした。'],
['We first noticed a cinema sign that disappeared from town records after 1978.','まず、町の記録では1978年以降なくなった映画館の看板に気づきました。'],
['Another student found a bus model that the local company began using in 1974.','別の生徒は地域の会社が1974年に使い始めた型のバスを見つけました。'],
['Those two clues suggested a period from 1974 to 1978, but they did not prove an exact year.','二つの手がかりから1974年から1978年の間だと考えられましたが、正確な年を証明するものではありませんでした。'],
['A shop banner seemed to show the number 1976, although part of it was hidden behind a tree branch.','店の横断幕には1976という数字が見えるようでしたが、一部が木の枝に隠れていました。'],
['We wrote “possibly 1976” beside that clue instead of treating the unclear number as a fact.','不鮮明な数字を事実として扱わず、その手がかりの横に「1976年の可能性」と書きました。'],
['Our final note said that the photograph was most likely from the middle of the 1970s.','最終メモでは、その写真は1970年代半ばの可能性が高いとしました。'],
['Separating strong evidence from a reasonable guess made our conclusion more careful and honest.','確かな根拠と妥当な推測を分けることで、結論をより慎重で誠実なものにできました。']
],[['estimate','推定する'],['evidence','根拠'],['conclusion','結論']]),
build('V11-B06-G3-004',NH,'Unit 6-4',nhBase,'A School Rule Seen from Two Sides',[
['Our school was considering a rule that would close the library twenty minutes earlier during winter.','学校では冬の間、図書室を二十分早く閉めるルールが検討されていました。'],
['At first, I supported the idea because fewer students stayed after dark and staff could finish work earlier.','最初、暗くなってから残る生徒が減り、職員も早く仕事を終えられるため、私は賛成でした。'],
['For a class assignment, however, we interviewed people who would be affected by the change.','しかし授業課題で、その変更の影響を受ける人々にインタビューしました。'],
['A librarian explained that the final twenty minutes were usually quiet and required little extra work.','司書は最後の二十分は通常静かで、追加の仕事もあまり必要ないと説明しました。'],
['Two students who waited for late buses said that the library was the safest warm place for them to study.','遅いバスを待つ二人の生徒は、図書室が安全で暖かく勉強できる場所だと言いました。'],
['A teacher still supported earlier closing on days when snow made travel difficult.','先生の一人は、雪で移動が難しい日は早く閉めることを支持しました。'],
['Our group changed its proposal from a fixed winter rule to an early-closing option for severe weather days.','私たちの班は固定した冬のルールから、悪天候の日だけ早く閉める案へ変更しました。'],
['The interviews did not make everyone agree, but they showed costs and benefits that our first opinion had missed.','インタビューで全員が同意したわけではありませんが、最初の意見で見落としていた利点と問題点が見えました。'],
['Seeing the rule from different positions led to a more flexible plan.','異なる立場からルールを見ることで、より柔軟な案になりました。']
],[['affected by','～の影響を受ける'],['flexible','柔軟な'],['severe weather','悪天候']]),
build('V11-B06-G3-005',SS,'PROGRAM 7-3',ssBase,'The River Cleanup Record',[
['Our environmental club cleaned a short section of riverbank on four Saturdays.','環境部は四回の土曜日に川岸の短い区間を清掃しました。'],
['Instead of only weighing the trash, we recorded what kind of items we collected and exactly where we found them.','ごみの重さだけでなく、何をどこで集めたか正確に記録しました。'],
['Plastic bottles appeared along the whole path, but food wrappers were concentrated near one bench close to the road.','ペットボトルは道全体で見つかりましたが、食品の包みは道路近くの一つのベンチ周辺に集中していました。'],
['After the second week, someone suggested placing many new bins along the river.','二週目のあと、川沿いに多くの新しいごみ箱を置く案が出ました。'],
['Our record, however, showed that most of the repeated litter came from one small area rather than the entire route.','しかし記録では、繰り返し見つかるごみの多くは道全体ではなく一つの小さな場所から出ていました。'],
['We asked the town office whether one covered bin could be tested beside that bench.','私たちは町役場に、そのベンチの横でふた付きごみ箱を一つ試せるかたずねました。'],
['The office agreed to a one-month trial and added a sign asking visitors to use the bin.','役場は一か月の試行に同意し、ごみ箱を使うよう呼びかける表示を付けました。'],
['During our next two cleanups, the number of wrappers near the bench fell sharply.','次の二回の清掃では、ベンチ周辺の包みの数が大きく減りました。'],
['Recording the pattern helped us propose a smaller and more focused solution.','傾向を記録したことで、より小さく焦点を絞った解決策を提案できました。']
],[['riverbank','川岸'],['wrapper','包み'],['trial','試行']]),
build('V11-B06-G3-006',NH,'Unit 6-4',nhBase,'The Message That Arrived Too Late',[
['Our debate team changed its Saturday meeting time after a teacher became unavailable in the morning.','討論チームは先生が午前中参加できなくなったため、土曜日の集合時刻を変更しました。'],
['The captain posted the new time in a group chat late on Friday evening.','部長は金曜日の夜遅くにグループチャットへ新しい時刻を投稿しました。'],
['Most members saw it, but two students had already turned off their phones and came at the old time.','多くの部員は見ましたが、二人はすでに携帯電話の電源を切っていて古い時刻に来ました。'],
['They waited outside the locked classroom for almost forty minutes before another member arrived.','別の部員が来るまで、二人は鍵のかかった教室の外で四十分近く待ちました。'],
['Nobody had ignored the message on purpose; the problem was that the team depended on one late channel.','だれも意図的にメッセージを無視したのではなく、遅い時間の一つの連絡方法だけに頼ったことが問題でした。'],
['The team decided that any change within twenty-four hours required both a group message and a direct reply from every member.','チームは二十四時間以内の変更ではグループ連絡に加え、全員から直接返事をもらうことにしました。'],
['If someone did not reply by a set time, the captain would call that person.','決めた時刻までに返事がなければ、部長がその人へ電話することにしました。'],
['They tested the system when the next meeting room changed, and every member reached the correct place.','次に集合場所が変わったときその方法を試し、全員が正しい場所へ来ました。'],
['The lesson was not to send more messages, but to make sure important changes were actually received.','学んだのは連絡数を増やすことではなく、重要な変更が実際に届いたか確かめることでした。']
],[['depend on','～に頼る'],['channel','連絡手段']]),
build('V11-B06-G3-007',SS,'PROGRAM 7-3',ssBase,'The Empty Storefront Project',[
['A shop near the station closed, leaving its front room empty for several months.','駅近くの店が閉まり、店先の部屋が数か月空いたままになりました。'],
['Our civics class was asked to imagine temporary uses that could help the neighborhood without requiring major construction.','公民の授業で、大きな工事をせず地域に役立つ一時利用を考えることになりました。'],
['One group proposed a study room for teenagers, while another wanted a weekly market for local farmers.','一班は中高生の学習室、別の班は地域農家の週一市場を提案しました。'],
['A third group suggested a small exhibition space where older residents could share photographs and stories.','三班目は年配の住民が写真や話を紹介できる小さな展示場所を提案しました。'],
['We listed who would benefit, what equipment each idea required, and when the space would be used.','だれが利益を得るか、どんな設備が必要か、いつ使うかを書き出しました。'],
['The study room needed weekday afternoons, while the market mainly needed Saturday mornings.','学習室は平日午後、市場は主に土曜朝に必要でした。'],
['Because the times did not conflict, we combined those two ideas and reserved one Sunday each month for exhibitions.','時間が重ならないため二案を組み合わせ、毎月一回の日曜日を展示に使う案にしました。'],
['The owner liked the shared plan because it served several groups and could be tested for three months.','所有者は、複数の人々に役立ち三か月試せるため、その共同案を気に入りました。'],
['Comparing benefits and practical needs turned three competing ideas into one flexible project.','利点と実際の必要条件を比べることで、競合する三案を一つの柔軟な計画にできました。']
],[['storefront','店先'],['temporary','一時的な'],['exhibition','展示']]),
build('V11-B06-G3-008',NH,'Unit 6-4',nhBase,'The School Festival Waste Map',[
['After last year’s school festival, volunteers found overflowing bins near the gym but almost empty bins beside the main office.','昨年の学校祭後、体育館近くのごみ箱はあふれていましたが、事務室横のごみ箱はほとんど空でした。'],
['This year, the environmental committee decided to record where trash appeared before simply adding more bins.','今年、環境委員会は単にごみ箱を増やす前に、どこにごみが出るか記録することにしました。'],
['Students marked a map every hour and noted the busiest food stands, resting areas, and walking routes.','生徒たちは一時間ごとに地図へ印を付け、混雑する飲食店、休憩場所、人の流れを記録しました。'],
['By noon, a clear pattern appeared around the path between the food court and the gym.','正午までに、飲食場所と体育館の間の道に明確な傾向が現れました。'],
['Visitors often finished drinks while walking that route, yet the nearest bin was hidden behind a sign.','来場者はその道を歩きながら飲み物を飲み終えることが多いのに、最寄りのごみ箱は看板の後ろに隠れていました。'],
['The committee moved two bins to visible corners on the route and placed sorting labels at eye level.','委員会は二つのごみ箱を道の見える角へ移し、分別表示を目の高さに付けました。'],
['During the afternoon, the gym bins filled more slowly and less trash was left on tables.','午後には体育館のごみ箱はゆっくり満杯になり、机に残されるごみも減りました。'],
['The map showed that location, not only the number of bins, affected how people used them.','地図から、ごみ箱の数だけでなく場所も利用のされ方に影響すると分かりました。'],
['Evidence from actual movement helped the committee improve the festival without buying additional bins.','実際の人の動きという根拠で、新しいごみ箱を買わずに学校祭を改善できました。']
],[['overflowing','あふれている'],['sorting label','分別表示']]),
build('V11-B06-G3-009',SS,'PROGRAM 7-3',ssBase,'The Oral History Correction',[
['For a local history project, I interviewed two people who remembered the same summer festival from their childhood.','地域史の課題で、子どものころの同じ夏祭りを覚えている二人にインタビューしました。'],
['Mr. Ito clearly remembered that the main dance had started before sunset because children were still playing outside.','伊藤さんは子どもたちがまだ外で遊んでいたので、主要な踊りは日没前に始まったとはっきり覚えていました。'],
['Ms. Kato was equally certain that lanterns were already bright when the dance began.','加藤さんは踊り開始時には提灯がすでに明るく光っていたと同じくらい確信していました。'],
['My first draft chose Mr. Ito’s version because his description included more details.','最初の下書きでは、説明が詳しかったため伊藤さんの話を選びました。'],
['Then my teacher reminded me that a detailed memory is not automatically more accurate.','そこで先生が、詳しい記憶が必ずしもより正確とは限らないと教えてくれました。'],
['I checked an old festival program, but it listed only the date and events, not their exact starting times.','古い祭りのプログラムを確認しましたが、日付と行事だけで正確な開始時刻はありませんでした。'],
['Instead of forcing one memory to be correct, I rewrote the passage to present both accounts and the uncertainty.','一方を正しいと決めつけず、両方の証言と不確かさを示すよう文章を書き直しました。'],
['I also explained that lighting conditions and the order of events might have shaped each person’s memory.','照明の状態や行事の順番が、それぞれの記憶に影響した可能性も説明しました。'],
['The correction made the history less simple, but it represented the available evidence more fairly.','修正によって歴史は単純ではなくなりましたが、得られた根拠をより公平に表すことができました。']
],[['oral history','聞き取りによる歴史'],['account','証言'],['uncertainty','不確かさ']]),
build('V11-B06-G3-010',NH,'Unit 6-4',nhBase,'The Quiet Hour Proposal',[
['Several students asked for a quiet study period in the library before final exams.','何人かの生徒が期末試験前に図書室で静かな学習時間を設けてほしいと求めました。'],
['Our student council proposed making the last hour after school completely silent for two weeks.','生徒会は二週間、放課後最後の一時間を完全に無音にする案を出しました。'],
['A quick survey showed strong support from students who studied alone, but club members raised a practical concern.','簡単なアンケートでは一人で勉強する生徒から強い支持がありましたが、部活動の生徒から実際的な問題が出ました。'],
['Some groups used the library computers to plan presentations and needed brief discussion.','一部のグループは発表準備で図書室のパソコンを使い、短い話し合いが必要でした。'],
['The librarian also noted that younger students sometimes needed to ask for help with books.','司書は年下の生徒が本について助けを求める必要があることも指摘しました。'],
['Instead of dropping the idea, the council limited the quiet rule to one large reading area.','案をやめる代わりに、生徒会は静かなルールを一つの大きな閲覧場所だけに限定しました。'],
['A smaller computer area remained available for group work, and questions could be asked quietly at the desk.','小さなパソコン場所はグループ活動用に残し、受付では静かに質問できるようにしました。'],
['During the first week, both areas were used steadily without many complaints.','最初の一週間、どちらの場所も大きな苦情なく継続して利用されました。'],
['Collecting reactions turned a simple rule into a plan that protected quiet study without blocking other necessary uses.','反応を集めることで、静かな学習を守りながらほかの必要な利用を妨げない案になりました。']
],[['proposal','提案'],['student council','生徒会'],['practical concern','実際上の問題']]),
build('V11-B06-G3-011',SS,'PROGRAM 7-3',ssBase,'The Broken Link in the Guide',[
['Our school website included a digital guide with links to club pages, bus information, and public facilities.','学校のウェブサイトには部活動、バス情報、公共施設へのリンクを含むデジタル案内がありました。'],
['The guide had worked well when it was created, so nobody checked every link afterward.','作成時には問題なく動いていたため、その後だれもすべてのリンクを確認していませんでした。'],
['Six months later, a new student reported that the bus timetable link opened an error page.','半年後、新入生がバス時刻表のリンクを開くとエラーページになると報告しました。'],
['We tested the rest of the guide and found four more links that had changed or disappeared.','案内の残りも調べると、変更または消失したリンクがさらに四つ見つかりました。'],
['Simply repairing those five links would solve the immediate problem but not prevent the next one.','その五つだけ直せば今の問題は解決しますが、次の問題は防げません。'],
['The web team created a short checklist and assigned one student to test all outside links on the first Friday of each month.','ウェブ班は短い確認表を作り、毎月最初の金曜日に一人が外部リンクをすべて試す担当にしました。'],
['The guide also showed a “last checked” date so readers could judge how recent the information was.','案内には「最終確認日」も表示し、読者が情報の新しさを判断できるようにしました。'],
['The next month, the check found one changed museum link before anyone reported it.','翌月の確認では、だれかが報告する前に博物館リンクの変更を一つ発見しました。'],
['Maintaining the guide became a regular process rather than a repair made only after something broke.','案内の管理は、壊れてから直すだけでなく、定期的な作業になりました。']
],[['digital guide','デジタル案内'],['maintain','管理する'],['outside link','外部リンク']]),
build('V11-B06-G3-012',NH,'Unit 6-4',nhBase,'The Community Garden Waiting List',[
['A community garden near our school had twelve small spaces, but twenty families applied for them.','学校近くの共同菜園には十二の小区画しかありませんでしたが、二十家族が申し込みました。'],
['The organizers asked our class to compare fair ways of choosing who could use the garden that year.','運営者はその年だれが菜園を使えるか、公平な選び方を比較するよう私たちに頼みました。'],
['One idea was first come, first served, which was simple but favored people who learned about the application early.','一案は先着順で簡単ですが、募集を早く知った人に有利でした。'],
['Another idea gave spaces to the families who had used the garden longest, but that left little chance for newcomers.','別案は長く利用してきた家族を優先しましたが、新しい人には機会がほとんどありませんでした。'],
['A random drawing treated each application equally, although some students worried that experienced gardeners might all lose their places at once.','抽選はすべての申込を平等に扱いますが、経験者が一度に全員外れる可能性を心配する生徒もいました。'],
['We proposed keeping four spaces for returning gardeners and choosing the other eight by drawing among all remaining applicants.','私たちは四区画を継続利用者に残し、残り八区画をほかの申込者全員から抽選する案を出しました。'],
['Families who were not selected would receive priority in the drawing the following year.','選ばれなかった家族は翌年の抽選で優先されることにしました。'],
['The organizers liked the plan because it balanced experience, new access, and a clear waiting process.','運営者は経験、新しい参加機会、明確な待機手順のバランスがあるため、その案を評価しました。'],
['Comparing several definitions of fairness helped us design a rule that no single method had provided.','公平さのいくつかの考え方を比べることで、一つの方法だけではできなかったルールを作れました。']
],[['applicant','申込者'],['priority','優先'],['random drawing','抽選']]),
build('V11-B06-G3-013',SS,'PROGRAM 7-3',ssBase,'The Old Building Energy Check',[
['Our school wanted to reduce energy use in an old classroom building without planning a major rebuilding project.','学校は大規模な建て替えをせず、古い校舎のエネルギー使用を減らしたいと考えていました。'],
['A science group recorded room temperature, light use, and heater time in six classrooms for one week.','科学班が一週間、六教室の室温、照明使用、暖房時間を記録しました。'],
['They found that two south-facing rooms became warm in the afternoon but still kept their heaters at the same setting.','南向きの二教室は午後に暖かくなるのに、暖房設定が同じままだと分かりました。'],
['Several empty classrooms also had lights on during lunch because no one had a clear responsibility for checking them.','昼食時、確認担当が明確でないため空き教室でも照明が付いていることがありました。'],
['The group did not suggest expensive new windows or machines because the school had asked for small practical changes first.','学校がまず小さく実行できる改善を求めていたため、高価な窓や機械の導入は提案しませんでした。'],
['Instead, they tested lower heater settings in the warm rooms and added a lunch-time light check to each class duty list.','代わりに暖かい教室で暖房設定を下げ、各クラスの係表に昼食時の消灯確認を加えました。'],
['During the second week, the rooms stayed comfortable and the total heater time fell.','二週目も教室は快適なままで、暖房の総使用時間は減りました。'],
['Teachers also reported fewer lights left on in empty rooms.','先生たちも空き教室で照明の消し忘れが減ったと報告しました。'],
['The check showed that understanding when energy was being wasted could lead to useful changes before expensive construction was considered.','いつエネルギーが無駄になっているか理解することで、高価な工事を考える前に役立つ改善ができると分かりました。']
],[['energy use','エネルギー使用'],['setting','設定'],['responsibility','担当']]),
build('V11-B06-G3-014',NH,'Unit 6-4',nhBase,'The Visitor Survey Problem',[
['The town museum gave visitors a short survey and received very positive answers about a new exhibition.','町の博物館が来館者に短いアンケートを行い、新しい展示について非常に好意的な回答を得ました。'],
['At first, the staff planned to report that almost all visitors were satisfied.','最初、職員はほぼすべての来館者が満足したと報告する予定でした。'],
['A student volunteer noticed, however, that the survey cards had been handed out only beside the final activity room.','しかし生徒ボランティアが、アンケート用紙は最後の体験室の横だけで配られていたことに気づきました。'],
['People who entered that room had already chosen to spend extra time at an optional activity.','その部屋に入った人は、任意の活動に追加の時間を使うことをすでに選んでいました。'],
['Visitors who left early, used only the main galleries, or came with very young children were rarely included.','早く帰った人、主要展示だけ見た人、幼い子ども連れの人はほとんど含まれていませんでした。'],
['The staff realized that the survey had reached one especially interested type of visitor.','職員はアンケートが特に関心の高い一種類の来館者に偏っていたと気づきました。'],
['For the next week, they offered cards at the entrance, exit, café, and activity room at different times of day.','翌週は入口、出口、カフェ、体験室で時間帯を変えて用紙を配りました。'],
['The new results were still mostly positive, but they also revealed concerns about signs and rest areas.','新しい結果も多くは好意的でしたが、表示や休憩場所への問題も明らかになりました。'],
['A broader sample gave the museum information that was more useful for improving the whole visitor experience.','より幅広い対象から回答を得たことで、来館体験全体の改善により役立つ情報になりました。']
],[['sample','調査対象'],['optional','任意の'],['gallery','展示室']]),
build('V11-B06-G3-015',SS,'PROGRAM 7-3',ssBase,'The Emergency Meeting Point',[
['Our school emergency plan told students to meet beside the large clock near the front gate.','学校の緊急時計画では、正門近くの大時計のそばに集合することになっていました。'],
['The place was familiar and easy to describe, so nobody had questioned it for years.','そこはよく知られ説明しやすいため、長年だれも疑問を持ちませんでした。'],
['During a safety lesson, our class was asked to test whether the point worked under different conditions.','安全学習で、さまざまな状況でその集合場所が機能するか試すことになりました。'],
['From the gym, students reached it quickly, but a group from the back field had to cross the path used by arriving emergency vehicles.','体育館からはすぐ着けましたが、裏の校庭からの班は緊急車両が入る道を横切る必要がありました。'],
['We also discovered that the clock could not be seen from one side when festival tents were set up.','学校祭のテントがあると一方向から時計が見えないことも分かりました。'],
['Teachers explained that a meeting point should be recognizable, safe to approach, and clear even when normal routes change.','先生は、集合場所は分かりやすく、安全に近づけ、通常の道が変わっても明確であるべきだと説明しました。'],
['Our class proposed a marked area beside the west fence, away from the vehicle entrance and visible from both fields.','私たちは車両入口から離れ、両方の校庭から見える西側の柵横の印付き区域を提案しました。'],
['A second practice showed that all groups could reach the new point without crossing the emergency route.','二回目の訓練では、全グループが緊急車両の道を横切らず新しい場所へ行けました。'],
['Testing a familiar plan revealed risks that were easy to miss when we only read the instructions on paper.','慣れた計画も実際に試すことで、紙の指示を読むだけでは見落としやすい危険が分かりました。']
],[['emergency','緊急時'],['recognizable','見分けやすい'],['vehicle','車両']]),
build('V11-B06-G3-016',NH,'Unit 6-4',nhBase,'The Final Page of the Town Guide',[
['Our class created a small English guide to the town for visitors, but one page remained after the main sections were finished.','私たちのクラスは来訪者向けの小さな英語の町案内を作りましたが、主要部分完成後に一ページ残りました。'],
['Several students wanted to use it for their favorite restaurant, while others preferred a beautiful river photograph.','何人かはお気に入りの飲食店を載せたがり、ほかの人は美しい川の写真を希望しました。'],
['Another group suggested a list of emergency contacts and transport information.','別の班は緊急連絡先と交通情報の一覧を提案しました。'],
['We realized that choosing by personal preference would make it difficult to explain why one idea had won.','個人の好みで選ぶと、なぜ一案が選ばれたか説明しにくいと気づきました。'],
['The class agreed on three criteria: useful to many visitors, not already explained elsewhere, and likely to remain accurate for at least a year.','クラスは「多くの来訪者に役立つ」「ほかで説明していない」「少なくとも一年は正確でありそう」という三基準に合意しました。'],
['The restaurant failed the last point because opening times and menus could change, while the river photo offered little new information.','飲食店は営業時間やメニューが変わるため最後の基準に合わず、川の写真は新しい情報がほとんどありませんでした。'],
['The transport and emergency page met all three criteria after we confirmed the phone numbers and bus website.','交通と緊急情報のページは、電話番号とバスサイトを確認したあと三基準すべてを満たしました。'],
['We included a small river photo in the corner so the page still looked welcoming.','ページが親しみやすく見えるよう、隅に小さな川の写真も入れました。'],
['Using shared criteria helped us make the final choice without turning the discussion into a contest of personal favorites.','共有基準を使うことで、個人の好みの競争にせず最後の選択ができました。']
],[['criteria','基準'],['emergency contact','緊急連絡先'],['preference','好み']])
];
window.V11_BATCH06_G3_PASSAGES=all;
window.V11_BATCH06_PASSAGES=[...(window.V11_BATCH06_PASSAGES||[]),...all];
})();