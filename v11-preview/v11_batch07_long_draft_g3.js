(function buildV11Batch07LongDrafts(){
'use strict';
const BATCH='V11-B07-LONG-DRAFT-20260829';
const SS='サンシャイン',NH='ニューホライズン';
function wc(rows){return (rows.map(r=>r[0]).join(' ').match(/[A-Za-z]+(?:['’][A-Za-z]+)?/g)||[]).length;}
function q(type,prompt,answer,evidence,evidenceJp,reason,extra){return Object.assign({questionType:type,prompt,answer,evidence,evidenceJp,reason},extra||{});}
function build(o){return Object.assign({grade:'3',level:'LONG',genre:'reading',batch:BATCH,targetWordBand:[240,330],wordCount:wc(o.rows),sentences:o.rows.map(r=>r[0]),fullTranslation:o.rows.map(r=>r[1]).join(''),slashRows:o.rows.map(r=>({en:r[0],jp:r[1]})),registered:false,semanticRewrite:'BATCH07_LONG_ORIGINAL_20260829'},o,{rows:undefined});}
const passages=[];

passages.push(build({
id:'V11-B07-G3-001',textbook:SS,section:'PROGRAM 7-3',sourceSectionBaselineId:'V10-SS-G3-P7-3-001',title:'The History Display with One Source',
materialData:{type:'source-record-table',items:[['1985 club booklet','The old market closed after a new supermarket opened.'],['City permit','Supermarket opened: September 1984'],['Market tax record','Market business continued through March 1986'],['Local newsletter','Roof repair costs and fewer shoppers were both discussed.']]},
rows:[
['Our history club was making a display about an old market that once stood near the station.','私たちの歴史部は、かつて駅の近くにあった古い市場について展示を作っていました。'],
['At first, our main source was a club booklet written by students in 1985.','最初、主な資料は1985年に生徒が書いた部活動の冊子でした。'],
['It said the market had closed after a new supermarket opened nearby.','そこには、近くに新しいスーパーマーケットが開店したあと市場が閉まったと書かれていました。'],
['We turned that sentence into a large label: “The supermarket caused the old market to close.”','私たちはその文を「スーパーマーケットが古い市場を閉店に追い込んだ」という大きな説明文にしました。'],
['Our teacher asked whether the booklet really proved that cause.','先生は、その冊子が本当にその原因を証明しているのかとたずねました。'],
['We read it again and noticed that it gave no closing date and named no other source.','読み直すと、閉店日がなく、ほかの資料も示されていないことに気づきました。'],
['So we searched the town archive for records from the same years.','そこで、同じ時期の記録を町の資料室で探しました。'],
['A city permit showed that the supermarket opened in September 1984.','市の許可記録には、そのスーパーマーケットが1984年9月に開店したとありました。'],
['However, a market tax record showed business continuing through March 1986.','しかし、市場の税の記録では1986年3月まで営業が続いていました。'],
['That meant the market had remained open for more than a year after the supermarket arrived.','つまり、スーパーマーケットの開店後も市場は一年以上営業していたことになります。'],
['We then found a local newsletter from early 1986.','次に、1986年初めの地域ニュースレターを見つけました。'],
['It discussed fewer shoppers, but it also mentioned high roof repair costs.','そこには客が減ったことだけでなく、高い屋根修理費についても書かれていました。'],
['A photograph dated November 1985 showed several market shops still open.','1985年11月の日付がある写真には、市場のいくつかの店がまだ営業している様子が写っていました。'],
['None of these records told us exactly how much each problem mattered.','どの記録からも、それぞれの問題がどの程度影響したかまでは分かりませんでした。'],
['We decided that our first label was too certain.','私たちは最初の説明文は断定しすぎていると判断しました。'],
['The supermarket may have affected the market, but the evidence also pointed to other difficulties.','スーパーマーケットは市場に影響したかもしれませんが、資料はほかの困難も示していました。'],
['We replaced the large label with a short timeline and a more careful explanation.','大きな説明文を短い年表と、より慎重な説明に置き換えました。'],
['The new text said that the supermarket opened in 1984, the old market continued into 1986, and several problems were discussed before it closed.','新しい文章には、スーパーマーケットは1984年に開店し、古い市場は1986年まで続き、閉店前には複数の問題が話題になっていたと書きました。'],
['We kept the 1985 booklet in the display, but we identified it as one student source rather than the final answer.','1985年の冊子も展示に残しましたが、最終的な答えではなく、一つの生徒資料として示しました。'],
['Visitors could now see which facts came from dated records and which ideas were interpretations.','来場者は、どの事実が日付のある記録から来たのか、どの考えが解釈なのか分かるようになりました。'],
['Our display became less simple, but it became more trustworthy.','展示は単純ではなくなりましたが、より信頼できるものになりました。'],
['We learned that adding sources does not always give one perfect answer; sometimes it helps us state an answer more carefully.','資料を増やしても一つの完璧な答えが出るとは限らず、むしろ答えをより慎重に述べる助けになることもあると学びました。']
],
questions:[
q('GIST','本文の中心内容として最も適切なものを答えなさい。','一つの資料だけで原因を断定せず、複数の記録を比べて事実と解釈を分けることが大切だということ。','We learned that adding sources does not always give one perfect answer; sometimes it helps us state an answer more carefully.','資料を増やしても一つの完璧な答えが出るとは限らず、むしろ答えをより慎重に述べる助けになることもあると学びました。','最後の文が展示作りを通して得た学びをまとめています。'),
q('DETAIL','市の許可記録によると、新しいスーパーマーケットはいつ開店しましたか。','September 1984','A city permit showed that the supermarket opened in September 1984.','市の許可記録には、そのスーパーマーケットが1984年9月に開店したとありました。','開店時期が直接示されています。'),
q('REASON','班が最初の大きな説明文を直したのはなぜですか。','スーパーマーケットだけが閉店原因だと断定するには証拠が足りず、ほかの問題を示す資料も見つかったから。',['We decided that our first label was too certain.','The supermarket may have affected the market, but the evidence also pointed to other difficulties.'],['私たちは最初の説明文は断定しすぎていると判断しました。','スーパーマーケットは市場に影響したかもしれませんが、資料はほかの困難も示していました。'],'断定を弱めた理由が二文に示されています。'),
q('CONTENT_MATCH','本文の内容に合うものを選びなさい。','The old market continued operating for more than a year after the supermarket opened.','That meant the market had remained open for more than a year after the supermarket arrived.','つまり、スーパーマーケットの開店後も市場は一年以上営業していたことになります。','市場がすぐ閉店したわけではないことが本文に明示されています。'),
q('MATERIAL_LINK','資料のうち「スーパー開店後もしばらく市場が営業していた」ことを最も直接示すものを答えなさい。','Market tax record','However, a market tax record showed business continuing through March 1986.','しかし、市場の税の記録では1986年3月まで営業が続いていました。','営業継続時期を直接示す記録です。',{materialEvidence:'Market tax record: Market business continued through March 1986'})
],
questionSetB:[
q('INFERENCE','新しい展示が「より信頼できる」と言える理由を本文から推測しなさい。','事実の根拠となる記録と、そこから考えた解釈を区別して示したから。','Visitors could now see which facts came from dated records and which ideas were interpretations.','来場者は、どの事実が日付のある記録から来たのか、どの考えが解釈なのか分かるようになりました。','根拠と解釈を区別したことが信頼性向上につながっています。'),
q('SENTENCE_INSERTION','“That gap in time made our first explanation look too simple.” を入れるなら最も自然な位置を答えなさい。','市場がスーパー開店後一年以上続いたと述べた文の直後。','That meant the market had remained open for more than a year after the supermarket arrived.','つまり、スーパーマーケットの開店後も市場は一年以上営業していたことになります。','That gap in time はスーパー開店と市場閉店の時間差を指し、その後の追加資料探しにつながります。',{insertAfterSentence:10}),
q('CONTEXT_WORD','本文の流れに合うように s で始まる1語を入れなさい: “The students searched for more _____ before changing the display.”','sources','So we searched the town archive for records from the same years.','そこで、同じ時期の記録を町の資料室で探しました。','一つの冊子だけでなく追加資料を探す流れなので sources が適切です。'),
q('SUMMARY_FILL','まとめの空所を補いなさい: “The group changed a simple claim into a careful explanation based on several _____.”','records','We replaced the large label with a short timeline and a more careful explanation.','大きな説明文を短い年表と、より慎重な説明に置き換えました。','複数の記録を比較したことが改訂の中心です。'),
q('CONTENT_MATCH','1985年の冊子を展示から外さなかった理由として最も適切なものを答えなさい。','一つの資料として価値はあるが、それだけを最終的な答えとして扱わないため。','We kept the 1985 booklet in the display, but we identified it as one student source rather than the final answer.','1985年の冊子も展示に残しましたが、最終的な答えではなく、一つの生徒資料として示しました。','資料を捨てるのではなく位置づけを明確にしたと書かれています。')
],
notes:[['booklet','小冊子'],['permit','許可記録'],['interpretation','解釈'],['trustworthy','信頼できる']]
}));

passages.push(build({
id:'V11-B07-G3-004',textbook:NH,section:'Unit 6-4',sourceSectionBaselineId:'V10-NH-G3-U6-4-001',title:'A Rule That Helped One Group More',
materialData:{type:'access-time-table',items:[['Class A lunch release','12:20'],['Class B lunch release','12:25'],['Class C lunch release','12:30'],['Old computer rule','First 20 sign-ups keep a computer for the full lunch period']]},
rows:[
['Our school library had twenty computers that students could use during lunch.','学校の図書館には、昼休みに生徒が使えるコンピューターが二十台ありました。'],
['The rule seemed simple: the first twenty students to write their names on a list could use a computer for the whole lunch period.','ルールは単純で、名簿に先に名前を書いた二十人が昼休みの間ずっとコンピューターを使えるというものでした。'],
['For several weeks, teachers heard complaints that some students almost never got a place.','数週間、ほとんど席を取れない生徒がいるという不満が先生たちに届きました。'],
['At first, the library committee thought those students simply arrived too slowly.','最初、図書委員会はその生徒たちが来るのが遅いだけだと考えました。'],
['Then we compared the lunch schedules of three classes.','そこで三つのクラスの昼休み開始時刻を比べました。'],
['Class A was usually released at 12:20, Class B at 12:25, and Class C at 12:30 because their morning schedules ended at different times.','午前の時間割が異なるため、A組は通常12時20分、B組は12時25分、C組は12時30分に昼休みになっていました。'],
['By the time many Class C students reached the library, the list was often full.','C組の多くの生徒が図書館に着くころには、名簿がすでに埋まっていることがよくありました。'],
['The rule did not mention classes, but it still gave an advantage to students who could arrive earlier.','ルールにはクラスのことは書かれていませんでしたが、早く来られる生徒が有利になっていました。'],
['We asked students why they wanted the computers.','私たちは生徒にコンピューターを使いたい理由もたずねました。'],
['Some needed only ten minutes to print homework, while others wanted longer time for research or club work.','宿題を印刷するため十分だけ必要な人もいれば、調べ学習や部活動のために長く使いたい人もいました。'],
['This showed another problem with the old rule: a short task could hold a computer for the entire lunch period.','これは古いルールの別の問題も示しました。短い作業でもコンピューターを昼休み中ずっと確保できたのです。'],
['The committee considered giving every class exactly the same number of computers.','委員会は各クラスにまったく同じ台数を割り当てる案を考えました。'],
['However, student needs changed from day to day, so fixed class limits could leave computers unused.','しかし、必要な人数は日によって変わるため、固定したクラス枠ではコンピューターが使われずに残る可能性がありました。'],
['Instead, we tested two shorter sessions and allowed students to choose one session when they signed up.','そこで、より短い二つの利用時間を試し、生徒が申し込み時にどちらか一つを選べるようにしました。'],
['We also kept six places open until 12:30 so later classes had a real chance to use them.','さらに、遅く昼休みになるクラスにも実際の利用機会があるよう、六席は12時30分まで空けておきました。'],
['Students with quick printing jobs could finish in the first session, and another student could use the same computer later.','短い印刷作業の生徒は前半で終え、その後は別の生徒が同じコンピューターを使えました。'],
['After a two-week trial, more students from all three classes had used the computers, and unused time did not increase.','二週間試した結果、三つのクラスすべてで利用した生徒が増え、使われない時間も増えませんでした。'],
['The new rule was not perfectly equal every day, but access no longer depended so strongly on which class ended first.','新しいルールでも毎日完全に同じではありませんが、どのクラスが先に終わるかに利用機会が強く左右されなくなりました。'],
['We learned that a rule can use the same words for everyone and still affect groups differently.','同じ言葉のルールを全員に適用しても、集団によって影響が違うことがあると学びました。'],
['Checking who can actually use a rule helped us improve it without wasting the computers.','誰が実際にそのルールを利用できるのか確かめることで、コンピューターを無駄にせず改善できました。']
],
questions:[
q('GIST','本文の中心内容を答えなさい。','同じルールでも利用できる時間の違いによって不公平が生じるため、実際の利用条件を調べて改善することが大切だということ。','We learned that a rule can use the same words for everyone and still affect groups differently.','同じ言葉のルールを全員に適用しても、集団によって影響が違うことがあると学びました。','本文全体の問題発見と改善をまとめる文です。'),
q('DETAIL','C組は通常何時に昼休みになりましたか。','12:30','Class A was usually released at 12:20, Class B at 12:25, and Class C at 12:30 because their morning schedules ended at different times.','午前の時間割が異なるため、A組は通常12時20分、B組は12時25分、C組は12時30分に昼休みになっていました。','時刻が直接示されています。'),
q('REASON','古いルールがC組に不利になりやすかったのはなぜですか。','C組が図書館へ来られる時刻が遅く、そのころには先着二十人の名簿が埋まっていることが多かったから。',['By the time many Class C students reached the library, the list was often full.','The rule did not mention classes, but it still gave an advantage to students who could arrive earlier.'],['C組の多くの生徒が図書館に着くころには、名簿がすでに埋まっていることがよくありました。','ルールにはクラスのことは書かれていませんでしたが、早く来られる生徒が有利になっていました。'],'到着可能時刻と先着制の組み合わせが原因です。'),
q('CONTENT_MATCH','本文の内容に合うものを選びなさい。','Some students needed a computer for only a short printing task.','Some needed only ten minutes to print homework, while others wanted longer time for research or club work.','宿題を印刷するため十分だけ必要な人もいれば、調べ学習や部活動のために長く使いたい人もいました。','短時間利用の生徒がいたことが直接示されています。'),
q('MATERIAL_LINK','古いルールと時間表を合わせて考えると、最も有利になりやすいのはどのクラスですか。','Class A','Class A was usually released at 12:20, Class B at 12:25, and Class C at 12:30 because their morning schedules ended at different times.','午前の時間割が異なるため、A組は通常12時20分、B組は12時25分、C組は12時30分に昼休みになっていました。','先着制では最も早く来られるA組が有利になりやすいと判断できます。',{materialEvidence:'Class A lunch release: 12:20; Old computer rule: First 20 sign-ups keep a computer for the full lunch period'})
],
questionSetB:[
q('INFERENCE','各クラスに同じ台数を固定配分する案を採用しなかった理由を推測しなさい。','日ごとに利用希望者が変わるため、固定枠では必要の少ないクラスに空席が残り、必要な生徒が使えない可能性があるから。','However, student needs changed from day to day, so fixed class limits could leave computers unused.','しかし、必要な人数は日によって変わるため、固定したクラス枠ではコンピューターが使われずに残る可能性がありました。','本文の理由から固定配分の弱点を説明できます。'),
q('SENTENCE_INSERTION','“The list was open to everyone, but the chance to reach it early was not the same.” を入れるなら最も自然な位置を答えなさい。','C組が着くころ名簿が埋まっていると述べた文の直後。','By the time many Class C students reached the library, the list was often full.','C組の多くの生徒が図書館に着くころには、名簿がすでに埋まっていることがよくありました。','名簿自体は共通でも到着条件が違うという次の問題説明へつながります。',{insertAfterSentence:7}),
q('CONTEXT_WORD','本文の意味に合うように a で始まる1語を入れなさい: “The new rule improved _____ for students whose classes ended later.”','access','The new rule was not perfectly equal every day, but access no longer depended so strongly on which class ended first.','新しいルールでも毎日完全に同じではありませんが、どのクラスが先に終わるかに利用機会が強く左右されなくなりました。','コンピューターを利用する機会という意味で access が合います。'),
q('SUMMARY_FILL','まとめの空所を補いなさい: “The committee used shorter sessions so more than one student could use the same computer during _____.”','lunch','Students with quick printing jobs could finish in the first session, and another student could use the same computer later.','短い印刷作業の生徒は前半で終え、その後は別の生徒が同じコンピューターを使えました。','昼休みを二つの時間に分けた改善をまとめています。'),
q('CONTENT_MATCH','12時30分まで六席を空けた目的を答えなさい。','遅く昼休みになるクラスの生徒にも利用する実際の機会を残すため。','We also kept six places open until 12:30 so later classes had a real chance to use them.','さらに、遅く昼休みになるクラスにも実際の利用機会があるよう、六席は12時30分まで空けておきました。','so以下に目的が示されています。')
],
notes:[['release','授業などから解放される・終わる'],['advantage','有利な点'],['access','利用機会'],['fixed','固定した']]
}));

passages.push(build({
id:'V11-B07-G3-008',textbook:NH,section:'Unit 6-4',sourceSectionBaselineId:'V10-NH-G3-U6-4-001',title:'The Festival Entrance Bottleneck',
materialData:{type:'entrance-observation-table',items:[['Saturday 9:00','60 arrivals/10 min; average wait 3 min'],['Saturday 10:00','110 arrivals/10 min; average wait 12 min'],['Saturday 11:00','95 arrivals/10 min; average wait 9 min'],['Sunday 10:00 after changes','112 arrivals/10 min; average wait 5 min']]},
rows:[
['Our school festival used one main gate for visitors, and every year a long line formed during the busiest hour.','学校祭では来場者が一つの正門を使い、毎年いちばん混む時間に長い列ができていました。'],
['The planning team first blamed the narrow gate.','運営チームは最初、門が狭いことが原因だと考えました。'],
['Because we could not rebuild it, some members thought the line was unavoidable.','門を作り直すことはできないため、列は避けられないと考える部員もいました。'],
['This year, we decided to observe what actually happened before making a plan for the second day.','今年は二日目の対策を決める前に、実際に何が起きているか観察することにしました。'],
['On Saturday at 9:00, about sixty people arrived in ten minutes, and the average wait was only three minutes.','土曜日の9時には十分間に約六十人が来ましたが、平均待ち時間はわずか三分でした。'],
['At 10:00, about one hundred ten people arrived in ten minutes, and the average wait grew to twelve minutes.','10時には十分間に約百十人が来て、平均待ち時間は十二分に伸びました。'],
['We stood beside the entrance and recorded where people stopped.','私たちは入口の横に立ち、人々がどこで止まるか記録しました。'],
['The ticket check itself was usually quick.','チケット確認そのものはたいてい短時間で終わりました。'],
['The problem was that three different activities were crowded into the same small space.','問題は、三つの異なる作業が同じ狭い場所に集まっていたことでした。'],
['Visitors received programs beside the ticket table, families stopped there to ask about classrooms, and many people paused at a photo board just inside the gate.','来場者はチケット台の横で案内を受け取り、家族はそこで教室の場所をたずね、多くの人が門のすぐ内側の写真ボードで立ち止まりました。'],
['When one family stopped, people behind them could not easily move around.','一組の家族が止まると、後ろの人は簡単に追い越せませんでした。'],
['At 11:00, arrivals were slightly lower, but the wait was still nine minutes because the same stopping points remained.','11時には来場者数は少し減りましたが、同じ場所で人が止まるため待ち時間は九分ありました。'],
['For Sunday, we did not try to make the gate wider.','日曜日には門を広げようとはしませんでした。'],
['Instead, we moved the program and information table twenty meters inside the school grounds.','代わりに、案内と情報の机を校内側へ二十メートル移しました。'],
['We moved the photo board farther away and marked a clear walking path from the gate.','写真ボードもさらに離し、門からの通路を分かりやすく示しました。'],
['We also made two short ticket lines so visitors with prepaid tickets did not wait behind people buying tickets.','さらに、前売り券を持つ人が当日券を買う人の後ろで待たないよう、短い二つのチケット列を作りました。'],
['At 10:00 on Sunday, one hundred twelve people arrived in ten minutes, almost the same heavy flow as Saturday.','日曜日の10時には十分間に百十二人が来て、土曜日とほぼ同じ多さでした。'],
['However, the average wait fell to five minutes.','しかし、平均待ち時間は五分に下がりました。'],
['The gate had not changed, and the number of visitors had not fallen.','門は変わらず、来場者数も減っていませんでした。'],
['What changed was the place where visitors had to stop and make decisions.','変わったのは、来場者が立ち止まって判断する場所でした。'],
['Our first idea focused on the size of the entrance, but observation showed that the flow around it mattered just as much.','最初は入口の大きさに注目していましたが、観察によって周囲の人の流れも同じくらい重要だと分かりました。'],
['We learned that a bottleneck is not always solved by making a space bigger; sometimes the better question is why people stop there.','混雑箇所は場所を広くするだけで解決するとは限らず、なぜそこで人が止まるのかを考えることがよりよい場合もあると学びました。']
],
questions:[
q('GIST','本文の中心内容を答えなさい。','入口の広さだけを原因と決めず、人がどこで止まるかを観察して流れを改善したこと。','We learned that a bottleneck is not always solved by making a space bigger; sometimes the better question is why people stop there.','混雑箇所は場所を広くするだけで解決するとは限らず、なぜそこで人が止まるのかを考えることがよりよい場合もあると学びました。','最後の文が改善から得た学びをまとめています。'),
q('DETAIL','土曜日10時の平均待ち時間は何分でしたか。','12 minutes','At 10:00, about one hundred ten people arrived in ten minutes, and the average wait grew to twelve minutes.','10時には十分間に約百十人が来て、平均待ち時間は十二分に伸びました。','待ち時間が直接示されています。'),
q('REASON','入口付近で列が進みにくくなった主な理由は何ですか。','案内配布、質問、写真撮影などで人が同じ狭い場所に立ち止まっていたから。',['The problem was that three different activities were crowded into the same small space.','When one family stopped, people behind them could not easily move around.'],['問題は、三つの異なる作業が同じ狭い場所に集まっていたことでした。','一組の家族が止まると、後ろの人は簡単に追い越せませんでした。'],'狭さだけでなく停止する活動の集中が原因でした。'),
q('CONTENT_MATCH','本文の内容に合うものを選びなさい。','The gate stayed the same size on Sunday.','The gate had not changed, and the number of visitors had not fallen.','門は変わらず、来場者数も減っていませんでした。','改善は門の改築によるものではありません。'),
q('MATERIAL_LINK','来場者数がほぼ同じなのに待ち時間が大きく短くなった比較として最も適切な二つを答えなさい。','Saturday 10:00 and Sunday 10:00 after changes','At 10:00 on Sunday, one hundred twelve people arrived in ten minutes, almost the same heavy flow as Saturday.','日曜日の10時には十分間に百十二人が来て、土曜日とほぼ同じ多さでした。','資料では土曜10時110人・12分、日曜10時112人・5分で改善効果を比較できます。',{materialEvidence:'Saturday 10:00: 110 arrivals/10 min; average wait 12 min; Sunday 10:00 after changes: 112 arrivals/10 min; average wait 5 min'})
],
questionSetB:[
q('INFERENCE','日曜日の結果から、混雑の原因について何が言えますか。','門の幅だけが主な原因ではなく、入口付近で人が止まる配置が大きく影響していたと考えられる。',['The gate had not changed, and the number of visitors had not fallen.','What changed was the place where visitors had to stop and make decisions.'],['門は変わらず、来場者数も減っていませんでした。','変わったのは、来場者が立ち止まって判断する場所でした。'],'変えていない条件と変えた条件を比較して推論できます。'),
q('SENTENCE_INSERTION','“This suggested that the gate itself was not the only cause.” を入れるなら最も自然な位置を答えなさい。','土曜9時は待ち時間が三分だったと述べた文の直後。','On Saturday at 9:00, about sixty people arrived in ten minutes, and the average wait was only three minutes.','土曜日の9時には十分間に約六十人が来ましたが、平均待ち時間はわずか三分でした。','同じ門でも混雑しない時間がある事実を受け、門だけが原因ではないという仮説につながります。',{insertAfterSentence:5}),
q('CONTEXT_WORD','本文の意味に合うように f で始まる1語を入れなさい: “The team improved the _____ of visitors around the entrance.”','flow','Our first idea focused on the size of the entrance, but observation showed that the flow around it mattered just as much.','最初は入口の大きさに注目していましたが、観察によって周囲の人の流れも同じくらい重要だと分かりました。','人の流れを表す flow が適切です。'),
q('SUMMARY_FILL','まとめの空所を補いなさい: “Moving activities away from the gate reduced the time visitors had to _____ there.”','stop','What changed was the place where visitors had to stop and make decisions.','変わったのは、来場者が立ち止まって判断する場所でした。','停止場所を分散したことが改善の中心です。'),
q('CONTENT_MATCH','前売り券用と当日券購入用を分けた目的を答えなさい。','前売り券を持つ人が購入手続きの人の後ろで待つ必要をなくすため。','We also made two short ticket lines so visitors with prepaid tickets did not wait behind people buying tickets.','さらに、前売り券を持つ人が当日券を買う人の後ろで待たないよう、短い二つのチケット列を作りました。','so以下が目的です。')
],
notes:[['bottleneck','流れが詰まる場所'],['prepaid','前払いの・前売りの'],['flow','流れ'],['unavoidable','避けられない']]
}));

passages.push(build({
id:'V11-B07-G3-013',textbook:SS,section:'PROGRAM 7-3',sourceSectionBaselineId:'V10-SS-G3-P7-3-001',title:'The Classroom Energy Pattern',
materialData:{type:'energy-use-table',items:[['8:00–9:00','0.9 kWh average'],['12:00–13:00','1.1 kWh average'],['15:00–16:00','2.3 kWh average'],['16:00–17:00','3.0 kWh average']]},
rows:[
['Our environmental committee wanted to reduce electricity use in one classroom building.','環境委員会は一つの校舎の電気使用量を減らしたいと考えました。'],
['We first planned a campaign telling everyone to turn off lights during lunch.','最初、昼休みに全員へ消灯を呼びかける運動を計画しました。'],
['Before printing posters, a science teacher suggested checking when the building actually used the most electricity.','ポスターを印刷する前に、理科の先生が校舎で実際にいつ最も電気を使っているか調べるよう提案しました。'],
['For one week, we recorded the meter at the same times each day.','一週間、毎日同じ時刻にメーターを記録しました。'],
['The morning average was low, and the lunch period was only a little higher.','朝の平均は低く、昼休みもそれより少し高いだけでした。'],
['The surprising result came after regular classes ended.','意外な結果は通常授業が終わったあとに出ました。'],
['Use increased from 15:00 to 16:00 and was highest between 16:00 and 17:00.','使用量は15時から16時に増え、16時から17時の間が最も高くなりました。'],
['Our first campaign was aimed at the wrong time of day.','最初の運動は一日の中で違う時間帯に焦点を当てていたのです。'],
['We walked through the building at 16:15 to find out what was happening.','何が起きているか確かめるため、16時15分に校舎を回りました。'],
['Some club rooms were being used, so their lights and equipment were necessary.','いくつかの部活動の部屋は使用中だったため、照明や機器は必要でした。'],
['However, we also found empty classrooms with lights on, a projector left ready for the next day, and several chargers still connected.','しかし、誰もいないのに照明がついた教室、翌日のために待機状態のままのプロジェクター、接続されたままの充電器も見つかりました。'],
['Turning everything off at 15:30 would not work because students were still using some rooms.','15時30分にすべて消す方法では、まだ部屋を使う生徒がいるためうまくいきません。'],
['Instead, we asked each room to name the last group that used it each day.','そこで、各部屋でその日最後に使うグループを決めてもらいました。'],
['That group used a short checklist before leaving: lights, projector, air conditioner, and chargers.','そのグループは退出前に、照明、プロジェクター、エアコン、充電器の短い確認表を使いました。'],
['We also placed one reminder near the main exit rather than many posters in every hallway.','また、廊下中に多くのポスターを貼る代わりに、正面出口の近くに一つの注意表示を置きました。'],
['During the next week, we recorded the same meter times again.','翌週も同じ時刻にメーターを記録しました。'],
['The 16:00–17:00 average fell, while the morning and lunch figures changed very little.','16時から17時の平均は下がりましたが、朝と昼休みの数値はほとんど変わりませんでした。'],
['This result supported the idea that the end-of-day routine had been an important part of the problem.','この結果は、一日の終わりの片づけ手順が問題の重要な部分だったという考えを支えました。'],
['It did not mean every late use was waste, because some clubs still needed electricity.','ただし、部活動で必要な電気もあるため、遅い時間の使用すべてが無駄という意味ではありません。'],
['Our goal became more specific: remove unnecessary use without stopping useful activities.','目標は、必要な活動を止めずに不要な使用を減らすという、より具体的なものになりました。'],
['The meter did more than tell us how much electricity we used; it showed us when to ask better questions.','メーターは使用量だけでなく、いつよりよい問いを立てるべきかも示してくれました。'],
['We learned that a good solution should be aimed at the pattern shown by the evidence, not only at the first problem we imagine.','よい解決策は、最初に思いついた問題ではなく、資料が示すパターンに向けるべきだと学びました。']
],
questions:[
q('GIST','本文の中心内容を答えなさい。','電気使用の実際の時間帯を調べ、必要な活動を止めずに無駄が多い時間と原因へ対策を向けたこと。','We learned that a good solution should be aimed at the pattern shown by the evidence, not only at the first problem we imagine.','よい解決策は、最初に思いついた問題ではなく、資料が示すパターンに向けるべきだと学びました。','最後の文が調査から得た学びをまとめています。'),
q('DETAIL','最も電気使用量が高かった時間帯はいつですか。','16:00–17:00','Use increased from 15:00 to 16:00 and was highest between 16:00 and 17:00.','使用量は15時から16時に増え、16時から17時の間が最も高くなりました。','時間帯が直接示されています。'),
q('REASON','15時30分にすべての電気を切る案を採用しなかったのはなぜですか。','その時間にも部活動などで必要な部屋と機器を使っている生徒がいたから。','Turning everything off at 15:30 would not work because students were still using some rooms.','15時30分にすべて消す方法では、まだ部屋を使う生徒がいるためうまくいきません。','because以下が理由を示しています。'),
q('CONTENT_MATCH','本文の内容に合うものを選びなさい。','Some electricity use after class was necessary for club activities.','Some club rooms were being used, so their lights and equipment were necessary.','いくつかの部活動の部屋は使用中だったため、照明や機器は必要でした。','放課後の使用をすべて無駄とはしていません。'),
q('MATERIAL_LINK','最初の「昼休み消灯」案が主な問題に合っていないと判断するのに最も重要な資料は何ですか。','16:00–17:00 had the highest average use at 3.0 kWh.','Use increased from 15:00 to 16:00 and was highest between 16:00 and 17:00.','使用量は15時から16時に増え、16時から17時の間が最も高くなりました。','資料では昼休み1.1 kWhより16～17時3.0 kWhが大きく、重点時間が違うと分かります。',{materialEvidence:'12:00–13:00: 1.1 kWh average; 16:00–17:00: 3.0 kWh average'})
],
questionSetB:[
q('INFERENCE','翌週に16～17時だけ大きく下がったことから何が推測できますか。','退出時の確認手順が、放課後に残っていた不要な電気使用を減らすのに役立った可能性が高い。',['The 16:00–17:00 average fell, while the morning and lunch figures changed very little.','This result supported the idea that the end-of-day routine had been an important part of the problem.'],['16時から17時の平均は下がりましたが、朝と昼休みの数値はほとんど変わりませんでした。','この結果は、一日の終わりの片づけ手順が問題の重要な部分だったという考えを支えました。'],'変化した時間帯と対策の対象が一致しています。'),
q('SENTENCE_INSERTION','“The data made us question our original plan.” を入れるなら最も自然な位置を答えなさい。','16～17時が最も高いと述べた文の直後。','Use increased from 15:00 to 16:00 and was highest between 16:00 and 17:00.','使用量は15時から16時に増え、16時から17時の間が最も高くなりました。','data は直前の時間帯別結果を指し、次の「最初の運動は違う時間を狙っていた」へつながります。',{insertAfterSentence:7}),
q('CONTEXT_WORD','本文の意味に合うように p で始まる1語を入れなさい: “The committee changed its plan after finding a different energy-use _____.”','pattern','We learned that a good solution should be aimed at the pattern shown by the evidence, not only at the first problem we imagine.','よい解決策は、最初に思いついた問題ではなく、資料が示すパターンに向けるべきだと学びました。','時間帯ごとの傾向を表す pattern が適切です。'),
q('SUMMARY_FILL','まとめの空所を補いなさい: “The new checklist was used by the _____ group that left each room.”','last','Instead, we asked each room to name the last group that used it each day.','そこで、各部屋でその日最後に使うグループを決めてもらいました。','最後に使うグループが退出確認を担当しました。'),
q('CONTENT_MATCH','委員会の最終的な目標を答えなさい。','必要な活動を止めずに不要な電気使用を減らすこと。','Our goal became more specific: remove unnecessary use without stopping useful activities.','目標は、必要な活動を止めずに不要な使用を減らすという、より具体的なものになりました。','目標が本文に直接示されています。')
],
notes:[['electricity','電気'],['meter','メーター・計測器'],['charger','充電器'],['unnecessary','不要な']]
}));

window.V11_BATCH07_LONG_DRAFTS=passages;
window.V11_BATCH07_LONG_DRAFT_STATE={batch:BATCH,count:passages.length,ids:passages.map(p=>p.id),wordCounts:Object.fromEntries(passages.map(p=>[p.id,p.wordCount])),registered:false};
})();
