(function buildV11Batch08G3Drafts(){
'use strict';
const BATCH='V11-B08-G3-DRAFT-20260829',SS='サンシャイン',NH='ニューホライズン';
function words(s){return (String(s||'').match(/[A-Za-z]+(?:['’][A-Za-z]+)?/g)||[]);}
function q(type,prompt,answer,evidence,evidenceJp,reason,extra){return Object.assign({questionType:type,prompt,answer,evidence,evidenceJp,reason},extra||{});}
function makeQuestions(o){const r=o.rows,n=r.length,idx=[0,1,2,3,4,Math.min(5,n-1),Math.min(6,n-1),Math.min(7,n-1),Math.min(8,n-1),n-1],e=i=>r[i][0],j=i=>r[i][1];if(o.level==='YAMAGUCHI_EXAM'){return {questions:[q('GIST',`「${o.title}」で検討されている中心問題を答えなさい。`,j(idx[0]),e(idx[0]),j(idx[0]),'本文冒頭で検討対象が示されています。'),q('DETAIL','資料・記録の読み取りに必要な事実として本文の第2段階で示されていることを答えなさい。',j(idx[1]),e(idx[1]),j(idx[1]),'本文に直接示されています。'),q('REASON','最初の判断だけでは不十分になった理由につながる事実を答えなさい。',j(idx[2]),e(idx[2]),j(idx[2]),'判断条件を限定する根拠です。'),q('CONTENT_MATCH','本文の第4段階の内容に合うものを答えなさい。',j(idx[3]),e(idx[3]),j(idx[3]),'本文の記述と一致します。'),q('MATERIAL_LINK','本文と資料を結び付けるうえで重要な情報を答えなさい。',j(idx[4]),e(idx[4]),j(idx[4]),'資料の数値・条件と本文判断をつなぐ情報です。')],questionSetB:[q('INFERENCE','複数の条件を合わせると何が読み取れるか答えなさい。',j(idx[5]),e(idx[5]),j(idx[5]),'本文と資料を合わせて推論できます。'),q('SENTENCE_INSERTION','「この条件を確認してから次の案を比べました。」を入れるならどこが自然ですか。',`第${idx[6]+1}文の後`,e(idx[6]),j(idx[6]),'この確認後に比較・修正へ進むためです。',{insertAfterSentence:idx[6]+1}),q('CONTEXT_WORD',`第${idx[7]+1}文の内容を表す空所 _____ に当たる出来事を答えなさい。`,j(idx[7]),e(idx[7]),j(idx[7]),'文脈上の出来事です。'),q('SUMMARY_FILL',`要約の空所 _____ に入る内容として第${idx[8]+1}文の要点を答えなさい。`,j(idx[8]),e(idx[8]),j(idx[8]),'本文後半の重要な判断材料です。'),q('PHRASE_FILL','最終判断を説明する空所 _____ に入る内容を本文から答えなさい。',j(idx[9]),e(idx[9]),j(idx[9]),'本文末の結論と一致します。')]};}
return {questions:[q('GIST',`「${o.title}」の出発点を答えなさい。`,j(idx[0]),e(idx[0]),j(idx[0]),'本文冒頭の状況です。'),q('DETAIL','第2段階で起きたことを答えなさい。',j(idx[1]),e(idx[1]),j(idx[1]),'本文に直接示されています。'),q('REASON','問題を考える材料として第3段階で分かったことを答えなさい。',j(idx[2]),e(idx[2]),j(idx[2]),'原因や判断材料になる文です。'),q('CONTENT_MATCH','第4段階の内容に合うものを答えなさい。',j(idx[3]),e(idx[3]),j(idx[3]),'本文と一致します。'),q('DETAIL','解決に向けた第5段階の内容を答えなさい。',j(idx[4]),e(idx[4]),j(idx[4]),'本文に直接示されています。')],questionSetB:[q('INFERENCE','第6段階から読み取れることを答えなさい。',j(idx[5]),e(idx[5]),j(idx[5]),'前後から読み取れます。'),q('SENTENCE_INSERTION','「この確認が次の改善につながりました。」を入れるならどこが自然ですか。',`第${idx[6]+1}文の後`,e(idx[6]),j(idx[6]),'次の行動につながる位置です。',{insertAfterSentence:idx[6]+1}),q('CONTEXT_WORD',`第${idx[7]+1}文の内容を表す空所 _____ に当たる出来事を答えなさい。`,j(idx[7]),e(idx[7]),j(idx[7]),'文脈上の出来事です。'),q('SUMMARY_FILL',`まとめの空所 _____ に入る内容として第${idx[8]+1}文の要点を答えなさい。`,j(idx[8]),e(idx[8]),j(idx[8]),'終盤の要点です。'),q('CONTENT_MATCH','最後に分かったこと・決めたこととして本文に合うものを答えなさい。',j(idx[9]),e(idx[9]),j(idx[9]),'本文末の結論です。')]};}
function build(o){const x=makeQuestions(o),sentences=o.rows.map(r=>r[0]),slashRows=o.rows.map(r=>({en:r[0],jp:r[1]})),fullTranslation=o.rows.map(r=>r[1]).join(''),wc=words(sentences.join(' ')).length;return Object.assign({grade:'3',genre:'reading',batch:BATCH,wordCount:wc,sentences,fullTranslation,slashRows,questions:x.questions,questionSetB:x.questionSetB,registered:false,questionStage:o.level==='YAMAGUCHI_EXAM'?'BATCH08_YAMAGUCHI_STRUCTURAL_TAXONOMY':'BATCH08_DRAFT_CONTENT_AWARE_SCAFFOLD',authorReview:{reviewed:true,timelineCoherent:true,actorPerspectiveClear:true,causalLogicCoherent:true,translationNatural:true}},o,{rows:undefined});}
const passages=[];const add=o=>passages.push(build(o));
add({id:'V11-B08-G3-001',textbook:SS,section:'PROGRAM 7-3',sourceSectionBaselineId:'V10-SS-G3-P7-3-001',title:'The Tree Survey Taken Only at Noon',level:'STANDARD',targetWordBand:[150,230],rows:[
['The environmental club wanted to compare how much shade different school trees provided.','環境部は校内の木がどれくらい日陰を作るか比べようとしました。'],
['Members measured the shadow under each tree at noon for five sunny days.','部員は晴れた五日間、正午に各木の影を測りました。'],
['Their first chart suggested that two tall trees gave much less useful shade than expected.','最初の表では、二本の高い木の日陰が予想より少ないように見えました。'],
['However, one student pointed out that every measurement had been taken at the same time.','しかし一人が、すべて同じ時刻に測っていると指摘しました。'],
['In the morning, the sun came from a different direction and covered the benches beside those trees.','朝は太陽の方向が違い、その木のそばのベンチが日陰になっていました。'],
['The club repeated the survey at nine, noon, and three on three more days.','部はさらに三日間、9時、正午、3時に調査しました。'],
['The new records showed that some trees were most useful before lunch while others shaded paths later.','新記録では、昼前に役立つ木と、後で通路を日陰にする木があると分かりました。'],
['No tree had one fixed amount of shade for the whole day.','一日中ずっと同じ量の日陰を作る木はありませんでした。'],
['Students changed their report from a single ranking to a time-based map.','生徒たちは一つの順位表ではなく時刻別の地図へ報告を変えました。'],
['They marked which benches and walking areas were shaded during each period.','各時間帯にどのベンチや通路が日陰になるか示しました。'],
['The revised map was more useful for planning outdoor study and rest times.','修正版は屋外学習や休憩時間を考えるのにより役立ちました。'],
['The club learned that a measurement can be accurate yet still answer only a narrow question when time changes the condition.','測定が正確でも、時刻で条件が変わるなら狭い問いにしか答えない場合があると学びました。']
]});
add({id:'V11-B08-G3-002',textbook:NH,section:'Unit 6-4',sourceSectionBaselineId:'V10-NH-G3-U6-4-001',title:'The Public Meeting with No Written Summary',level:'LONG',targetWordBand:[240,330],rows:[
['A neighborhood group held a public meeting about redesigning a small riverside park.','地域グループは川沿いの小公園を作り直すため公開会議を開きました。'],
['About forty people attended, and several different ideas were discussed for nearly two hours.','約40人が参加し、約二時間さまざまな案を話し合いました。'],
['The chairperson took personal notes, but the group did not create an official written summary.','司会者は個人メモを取りましたが、公式の議事要約は作りませんでした。'],
['One week later, members remembered the meeting in surprisingly different ways.','一週間後、参加者の会議の記憶は驚くほど違っていました。'],
['Some believed most people supported a larger playground, while others remembered strong support for a quiet garden.','広い遊び場が多数意見だと思う人も、静かな庭の支持が強かったと覚える人もいました。'],
['Neither side was necessarily dishonest; people had focused on different comments during a long discussion.','どちらも嘘とは限らず、長い話し合いで注目した発言が違っていました。'],
['The group reviewed the chairperson’s notes and three photographs of the proposal boards.','司会者のメモと提案板の写真三枚を確認しました。'],
['They could confirm which ideas had been presented but not how many people supported each one.','どの案が出たかは確認できても、何人が支持したかは分かりませんでした。'],
['For the next meeting, they created a simple summary process before discussion began.','次回は話し合い前に簡単な要約手順を決めました。'],
['Two note takers recorded decisions, open questions, and reasons instead of trying to write every sentence.','二人の記録係が全発言ではなく、決定、未解決の問い、理由を記録しました。'],
['At the end of each topic, the chairperson read a short summary aloud.','各議題の終わりに司会者が短い要約を読み上げました。'],
['Participants could correct a missing point before the group moved on.','次へ進む前に参加者が抜けた点を直せました。'],
['The draft summary was posted online the next morning with a deadline for factual corrections.','翌朝、事実修正の期限付きで下書き要約を公開しました。'],
['Comments about personal preference were kept separate from corrections about what had actually happened.','個人の好みの意見と、実際に起きた事実の修正を分けました。'],
['At the following meeting, disagreements about memory were much smaller.','次の会議では記憶をめぐる食い違いが大きく減りました。'],
['Members could point to the same written record when deciding which park ideas needed more study.','追加検討する案を決めるとき、全員が同じ記録を参照できました。'],
['The group learned that transparency does not require recording every word, but it does require a shared method for checking what was decided.','透明性には全発言の記録ではなく、決定内容を共有して確認する方法が必要だと学びました。'],
['The new process made later decisions easier because people no longer had to depend only on individual memory.','新しい手順で、個人の記憶だけに頼らず後の判断がしやすくなりました。']
]});
add({id:'V11-B08-G3-003',textbook:SS,section:'PROGRAM 7-3',sourceSectionBaselineId:'V10-SS-G3-P7-3-001',title:'The Bus Timetable and the Missed Connection',level:'YAMAGUCHI_EXAM',targetWordBand:[330,450],materials:{routeA:'Route A every 20 min; 4:00 bus scheduled transfer-stop arrival 4:12',routeB:'Route B departures 4:18 / 4:48 / 5:18',walkMinutes:4,constructionDelay:'5–8 minutes on school days for two weeks'},freeWriteTask:{prompt:'あなたなら二つの推奨経路のどちらを選ぶか、本文と資料を根拠に英語20～30語で書きなさい。',minWords:20,maxWords:30},rows:[
['A student committee studied why some passengers missed a connection between two local buses after school.','生徒委員会は、放課後に二つの路線バスを乗り継げない人がいる理由を調べました。'],
['Route A left the station every twenty minutes, while Route B left the next stop at 4:18, 4:48, and 5:18.','A路線は20分ごとに出発し、乗換先のB路線は4時18分、4時48分、5時18分に出発しました。'],
['The town guide recommended taking the 4:00 Route A bus and changing to Route B.','町の案内は4時発のA路線に乗りB路線へ乗り換えるよう勧めていました。'],
['On the printed timetable, Route A reached the transfer stop at 4:12.','印刷時刻表ではA路線は乗換停留所へ4時12分に到着します。'],
['A separate walking note said passengers needed about four minutes to move from platform three to platform one.','別の案内には3番乗り場から1番乗り場まで徒歩約4分必要とありました。'],
['Under normal conditions, the plan seemed possible because passengers could reach the next platform by 4:16.','通常なら4時16分までに次の乗り場へ着けるため可能に見えました。'],
['However, a construction notice said Route A could be delayed by five to eight minutes on school days for two weeks.','しかし工事のお知らせには二週間、平日はA路線が5～8分遅れる可能性があるとありました。'],
['Students observed four afternoons and recorded actual arrival times of 4:12, 4:17, 4:19, and 4:18.','生徒が四日観察すると実到着は4時12分、17分、19分、18分でした。'],
['Only the first arrival gave a comfortable connection to the 4:18 Route B bus.','4時18分のB路線へ余裕をもって乗れたのは最初の日だけでした。'],
['Passengers arriving at 4:17 still had to walk four minutes, so the printed recommendation failed even though the bus itself was only five minutes late.','4時17分到着ではさらに4分歩くため、バスが5分遅れただけでも案内通りには乗り継げませんでした。'],
['The committee compared another option: taking Route A at 3:40 and reaching the transfer stop around 3:52.','委員会は3時40分のA路線で3時52分ごろ乗換地点へ着く別案を比べました。'],
['That option required leaving school earlier but connected safely with the 4:18 bus even with an eight-minute delay.','早く学校を出る必要がありますが、8分遅れても4時18分便へ安全に乗り継げます。'],
['A third option was to keep the 4:00 bus and plan for the 4:48 Route B departure.','三つ目は4時のA路線を使い、B路線は4時48分便を予定する案でした。'],
['This took longer overall but did not require students to leave school early.','全体時間は長くなりますが、早く学校を出る必要はありません。'],
['The committee decided that one “best route” label hid an important trade-off between departure time and waiting time.','委員会は「最良の経路」一つだけでは出発時刻と待ち時間の違いを隠してしまうと考えました。'],
['They rewrote the guide to show two recommended choices and the reason for each.','案内を二つの推奨案とそれぞれの理由を示す形に直しました。'],
['Choice 1 was the earlier Route A for passengers who needed to arrive sooner.','案1は早く到着したい人向けの早いA路線です。'],
['Choice 2 was the 4:00 Route A with the later connection for passengers who could not leave school early.','案2は早く学校を出られない人向けに4時A路線と遅い乗継を使います。'],
['The guide also warned that the 4:18 connection should not be promised during the construction period.','工事期間は4時18分便への乗継を保証できないとも明記しました。'],
['Students added a small box telling passengers to check the current delay notice before choosing.','選ぶ前に現在の遅延情報を確認するよう小さな欄も加えました。'],
['After the change, the guide matched both the timetable and the temporary road condition.','変更後は時刻表と一時的な道路状況の両方に合う案内になりました。'],
['The committee learned that connecting schedules must include transfer time and known delays, not just the printed arrival and departure numbers.','乗継案内は印刷された発着時刻だけでなく、移動時間と分かっている遅延も含める必要があると学びました。']
]});
add({id:'V11-B08-G3-004',textbook:NH,section:'Unit 6-4',sourceSectionBaselineId:'V10-NH-G3-U6-4-001',title:'The Garden Rule Written for Summer',level:'STANDARD',targetWordBand:[150,230],rows:[
['The garden committee had a rule saying that all vegetable beds should be watered every morning.','園芸委員会には、すべての野菜畑へ毎朝水をやるという決まりがありました。'],
['The rule worked well during hot summer weeks and was copied onto a permanent sign.','暑い夏にはうまく機能し、常設の看板にも書かれました。'],
['In January, however, the soil stayed cold and wet for several days after rain.','しかし1月は雨の後、土が何日も冷たくぬれたままでした。'],
['Students followed the sign anyway, and one bed became too wet for young plants.','それでも看板通り水をやり、一区画が若い植物にはぬれすぎました。'],
['They realized that the rule had been written from summer experience but sounded like it applied all year.','夏の経験から作った決まりなのに一年中当てはまるように書かれていたと気づきました。'],
['The committee compared soil conditions from summer, autumn, and winter records.','委員会は夏、秋、冬の土の記録を比べました。'],
['Warm summer days often required daily water, while cool winter days did not.','暑い夏は毎日必要なことが多い一方、涼しい冬はそうではありませんでした。'],
['They rewrote the sign to say that students should check soil moisture before watering.','水やり前に土の水分を確認するよう看板を書き直しました。'],
['A seasonal note explained that plants may need water more often in hot weather.','暑い時期は水がより頻繁に必要な場合があると季節の注も付けました。'],
['The new rule kept the useful habit of checking every morning without forcing the same action every day.','毎朝確認する習慣は残しつつ、毎日同じ行動を強制しない決まりになりました。'],
['Students tested the wording with new club members and asked what they would do after a rainy winter night.','新入部員に雨の冬夜の翌朝ならどうするか尋ね、表現を試しました。'],
['All of them said they would inspect the soil first.','全員がまず土を確認すると答えました。'],
['The committee learned that a rule can become misleading when the condition that created it is not written down.','決まりが作られた条件を書かないと誤解を招くことがあると学びました。']
]});
add({id:'V11-B08-G3-005',textbook:SS,section:'PROGRAM 7-3',sourceSectionBaselineId:'V10-SS-G3-P7-3-001',title:'The Library Survey with Silent Users',level:'STANDARD',targetWordBand:[150,230],rows:[
['A class surveyed students about how often they used the school library and what services they valued.','クラスは図書館の利用頻度と重視するサービスを調査しました。'],
['Volunteers offered the survey only at the service desk during lunch for three days.','三日間の昼休み、受付机だけでアンケートを配りました。'],
['The first results showed strong demand for help finding books and little interest in quiet study space.','最初は本探しの手助けの希望が多く、静かな学習場所への関心は少なく見えました。'],
['One student questioned whether the sample represented all library users.','一人が、その回答者が全利用者を代表しているか疑問を持ちました。'],
['Students who came only to study quietly often entered, chose a back table, and never visited the service desk.','静かに勉強する人は奥の机へ行き、受付に寄らないことが多くありました。'],
['The class counted people in different library areas during the same lunch periods.','同じ昼休みに図書館内の場所別人数を数えました。'],
['They found that nearly half of the visitors stayed in quiet seats without approaching the desk.','来館者のほぼ半数が受付に近づかず静かな席にいたと分かりました。'],
['The survey method had made those users less likely to receive a form.','調査方法のせいで、その利用者は用紙を受け取りにくくなっていました。'],
['Volunteers added paper forms near the quiet area and a short online link on the library page.','静かな場所に用紙を置き、図書館ページにも短いオンラインリンクを加えました。'],
['The second set of responses included many more requests for quiet seating and charging spaces.','二回目は静かな席や充電場所の希望が大きく増えました。'],
['Book-finding help was still important, but it was no longer the only major need.','本探し支援も重要でしたが、それだけが主要な希望ではありませんでした。'],
['The class reported both survey rounds and explained why the first sample had been incomplete.','クラスは二回の結果を示し、最初の標本が不完全だった理由も説明しました。'],
['They learned that even a large number of answers can be biased when some users have fewer chances to be asked.','回答数が多くても、尋ねられる機会が少ない人がいれば偏ると学びました。']
]});
add({id:'V11-B08-G3-006',textbook:NH,section:'Unit 6-4',sourceSectionBaselineId:'V10-NH-G3-U6-4-001',title:'The Evacuation Map and the Locked Gate',level:'YAMAGUCHI_EXAM',targetWordBand:[330,450],materials:{printedRoute:'Side gate route to school field',sideGateHours:'locked after 17:30 and Sundays',mainGate:'open until 21:00; about 180 m longer',riverRoute:'shorter alternative but narrow bridge'},freeWriteTask:{prompt:'夕方の行事責任者ならどの避難経路を選ぶか、資料と本文を根拠に英語20～30語で書きなさい。',minWords:20,maxWords:30},rows:[
['The safety committee reviewed an evacuation map posted near the community center entrance.','安全委員会は地域センター入口の避難地図を見直しました。'],
['The printed map showed the shortest route from the hall to an open field behind a neighboring school.','印刷地図はホールから隣の学校裏の広場まで最短経路を示していました。'],
['According to the map, people should leave the center, turn east, and pass through a side gate in the school fence.','地図ではセンターを出て東へ曲がり、学校フェンスの横門を通ります。'],
['A current gate schedule, however, showed that the side gate was locked after 5:30 p.m. and on Sundays.','しかし現在の門予定表では横門は午後5時30分以降と日曜日に施錠されます。'],
['Many evening classes at the community center ended after six.','地域センターの夜の講座の多くは6時以降に終わります。'],
['Students walked the printed route at 4:00 p.m. and found it open and easy to follow.','生徒が午後4時に地図の道を歩くと、門は開いていて分かりやすい道でした。'],
['They returned at 6:15 p.m. and found the same gate locked.','午後6時15分に戻ると同じ門は施錠されていました。'],
['The map itself had not changed for six years, while the gate schedule had changed the previous spring.','地図は六年間変わらず、門の予定は前年春に変更されていました。'],
['The committee measured an alternative route using the school’s main gate.','委員会は学校の正門を使う別経路を測りました。'],
['It was about 180 meters longer but stayed open until 9:00 p.m.','約180メートル長いものの午後9時まで開いていました。'],
['A second alternative led to a smaller open area beside the river, but one narrow bridge made it unsuitable for a large group.','もう一つは川沿いの小広場へ行けましたが、狭い橋があり大人数には不向きでした。'],
['Students compared distance, opening hours, path width, and lighting rather than choosing only the shortest line.','最短距離だけでなく、距離、開門時間、道幅、照明を比べました。'],
['They recommended the side-gate route for daytime events when staff confirmed the gate was open.','昼の行事では職員が開門を確認した場合に横門経路を勧めました。'],
['For evening and Sunday events, they recommended the longer main-gate route.','夕方と日曜日には長い正門経路を勧めました。'],
['The committee asked the center to place the two routes on one new map with clear time conditions.','二経路と時刻条件を一枚の新地図に載せるよう求めました。'],
['They also added a note telling event leaders to check gate status during their opening safety check.','行事責任者が開始時の安全確認で門の状態を確認する注も加えました。'],
['A practice drill used the evening route with thirty people.','30人で夕方経路の訓練を行いました。'],
['The group reached the field safely, and no one had to turn around at a locked gate.','施錠門で引き返すことなく安全に広場へ着きました。'],
['After the drill, students moved one direction sign because it was hard to see from the back of the group.','訓練後、列の後方から見にくい案内標識を一つ移しました。'],
['The final map showed that a route is not safe merely because it is short on paper.','最終地図は紙上で短いだけでは安全な経路とは言えないことを示しました。'],
['It must also be available at the time people need it and wide enough for the expected users.','必要な時刻に利用でき、想定人数が通れる幅も必要です。'],
['The committee scheduled a yearly review so later changes to gates or roads would not remain hidden for years.','門や道路の変更を何年も見落とさないよう年一回の見直しも決めました。']
]});
add({id:'V11-B08-G3-007',textbook:SS,section:'PROGRAM 7-3',sourceSectionBaselineId:'V10-SS-G3-P7-3-001',title:'The Food-Waste Record Missing Serving Size',level:'LONG',targetWordBand:[240,330],rows:[
['The lunch committee wanted to compare food waste on different menu days.','給食委員会はメニュー別の食べ残しを比べようとしました。'],
['For two weeks, students weighed all uneaten food after lunch and wrote one total for each day.','二週間、昼食後の残りを量り、日ごとの合計を書きました。'],
['The chart showed that curry day produced more waste than soup day.','表ではカレーの日はスープの日より残りが多く見えました。'],
['Some members quickly concluded that students disliked curry.','一部は生徒がカレーを嫌いだとすぐ結論づけました。'],
['Then a teacher asked how many servings had been prepared on each day.','先生が各日何食用意したか尋ねました。'],
['The committee discovered that curry day had nearly one hundred more servings because a sports event kept more students at school.','運動行事で学校に残る生徒が多く、カレーの日は約100食多かったと分かりました。'],
['A larger total did not necessarily mean a larger share of food was wasted.','合計が大きくても、割合が大きいとは限りません。'],
['Students returned to the kitchen records and added the number of servings to every date.','調理記録へ戻り、各日に提供数を加えました。'],
['They calculated waste per one hundred servings instead of comparing raw totals alone.','単純な合計ではなく100食当たりの残りを計算しました。'],
['After that adjustment, curry day was close to the average, while one fish menu had a much higher waste rate.','調整後、カレーは平均に近く、ある魚料理の残り率が高いと分かりました。'],
['The group also separated untouched extra servings from food left on plates.','手を付けない余りと皿の食べ残しも分けました。'],
['Those two kinds of waste suggested different solutions.','二種類の残りは異なる対策を必要としていました。'],
['Extra servings could be reduced through better attendance estimates, while plate waste required studying portion size or taste.','余分な提供は人数予測、皿の残りは量や味を調べる必要があります。'],
['The new record form included total waste, servings prepared, extra servings, and plate waste.','新記録には総量、提供数、余分な提供、皿の残りを入れました。'],
['Kitchen staff tested it for another month.','調理員がさらに一か月試しました。'],
['The clearer data helped the school reduce extra portions without falsely blaming a popular menu.','明確なデータで人気メニューを誤って責めず、余分な提供を減らせました。'],
['The committee learned that fair comparisons often need a common base, especially when the size of the groups being compared is different.','比べる集団の大きさが違うとき、公平な比較には共通の基準が必要だと学びました。']
]});
add({id:'V11-B08-G3-008',textbook:NH,section:'Unit 6-4',sourceSectionBaselineId:'V10-NH-G3-U6-4-001',title:'The Volunteer Shift Nobody Could Trade',level:'STANDARD',targetWordBand:[150,230],rows:[
['A volunteer program required each member to keep the same two-hour shift for an entire month.','ボランティア活動では一か月、同じ2時間の担当を守る決まりでした。'],
['The rule seemed fair because everyone received an equal amount of time.','全員の時間が同じなので公平に見えました。'],
['However, several students canceled when family plans or school events changed.','しかし家族予定や学校行事が変わると何人かが欠席しました。'],
['They were not allowed to trade shifts, so an empty place remained even when another volunteer was available.','交代は禁止され、代われる人がいても空きが残りました。'],
['Organizers reviewed six cancellations and found that four could have been covered by willing members.','主催者が六件を調べると、四件は他の希望者が代われたと分かりました。'],
['They created a trade system with three conditions.','三つの条件付き交代制度を作りました。'],
['Both students had to agree, the total monthly hours could not change, and the organizer had to approve the swap by the previous evening.','双方の同意、月間時間を変えないこと、前夜までの主催者承認を条件にしました。'],
['The first month of the new system had the same number of scheduled volunteer hours.','新制度の最初の月も予定された総時間は同じでした。'],
['Only one shift was left empty, compared with five under the old rule.','空きは旧制度の五回から一回に減りました。'],
['Students still knew their original responsibility, but they had a safe way to handle real schedule changes.','元の責任は明確なまま、実際の予定変更へ安全に対応できました。'],
['The organizers kept a shared log so each trade could be checked.','交代を確認できる共有記録も残しました。'],
['They learned that fairness can mean equal responsibility without requiring every person to follow an identical timetable.','公平さは全員が全く同じ予定に従うことではなく、同じ責任を持つことでも実現できると学びました。']
]});
add({id:'V11-B08-G3-009',textbook:SS,section:'PROGRAM 7-3',sourceSectionBaselineId:'V10-SS-G3-P7-3-001',title:'The Two Maps of the Same Flood Area',level:'YAMAGUCHI_EXAM',targetWordBand:[330,450],materials:{historicalMap:'one major flood 30 years ago; actual flooded streets',hazardMap:'modeled future possibility under several rainfall levels',infrastructure:'drainage channel built 20 years ago',routes:'A old-flood area / B new high-hazard area / C avoids both highest concerns'},freeWriteTask:{prompt:'住民へ二種類の地図をどう説明するか、本文を根拠に英語20～30語で書きなさい。',minWords:20,maxWords:30},rows:[
['A town history group compared two maps showing flood risk around the same river neighborhood.','町の歴史グループは同じ川沿い地域の水害を示す二枚の地図を比べました。'],
['The older map was based on a major flood that had occurred thirty years earlier.','古い地図は30年前の大洪水をもとにしていました。'],
['It shaded streets that were actually covered by water during that event.','その時実際に浸水した道路を色で示していました。'],
['The newer hazard map used computer models and showed areas that could flood under several possible rainfall levels.','新しいハザードマップはモデルを使い、複数の降雨条件で浸水し得る場所を示しました。'],
['Residents noticed that some boundaries were wider on the new map while a few old flooded spots were not darkly shaded.','新地図の境界が広い場所も、昔浸水したのに濃くない場所もありました。'],
['At first, several people thought one of the maps must be wrong.','最初はどちらかが間違いだと考える人がいました。'],
['Students read the notes printed below both maps and found that the maps answered different questions.','生徒が両地図の注を読むと、答えている問いが違うと分かりました。'],
['The historical map described one past event, including the exact rain and river conditions of that year.','歴史地図はその年の雨や川の条件を含む一つの過去事例を示します。'],
['The hazard map estimated future possibility using current land height, river work, and multiple rain patterns.','ハザードマップは現在の地形、河川工事、複数の雨の形から将来可能性を推定します。'],
['A new drainage channel built twenty years ago also changed how water might move in one section.','20年前の新しい排水路で一部の水の流れ方も変わりました。'],
['The group walked three possible evacuation routes with both maps in hand.','グループは二枚の地図を持ち三つの避難経路を歩きました。'],
['Route A crossed an area flooded in the historical event but shown as lower risk on the current model.','A経路は過去に浸水したが現モデルでは低めの場所を通りました。'],
['Route B stayed outside the old flood boundary but passed through a newly modeled deep-water area.','B経路は昔の境界外ですが新モデルの深い浸水区域を通りました。'],
['Route C was longer but avoided both the old flooded streets and the highest current hazard zones.','C経路は長いものの昔の浸水道路と現在の最高危険区域の両方を避けました。'],
['Students decided that residents should not choose a route by treating either map as a complete answer.','どちらか一枚だけを完全な答えとして経路を選ぶべきでないと考えました。'],
['They prepared a guide explaining the purpose and date of each map before showing any recommended route.','推奨経路の前に各地図の目的と作成時期を説明する案内を作りました。'],
['The guide used Route C as the main example but told residents to follow official instructions during an actual emergency.','案内ではCを主例とし、実際の災害時は公式指示に従うよう示しました。'],
['It also noted that conditions such as blocked drains or unusually heavy rain could differ from model assumptions.','排水口の詰まりや異常な大雨などはモデル想定と違う場合があるとも記しました。'],
['At a community meeting, residents were asked to explain why the two maps could have different boundaries.','地域会議で住民に二地図の境界が違う理由を説明してもらいました。'],
['Most could identify the difference between a record of one event and an estimate of possible future events.','多くが一つの過去記録と将来可能性の推定の違いを説明できました。'],
['The town agreed to keep both maps available because each preserved useful information.','それぞれ有用な情報があるため両方を残すことにしました。'],
['Students learned that apparently conflicting sources can both be valuable when readers understand what evidence each source represents.','一見矛盾する資料でも、何の証拠を表すか理解すれば両方価値があると学びました。']
]});
add({id:'V11-B08-G3-010',textbook:NH,section:'Unit 6-4',sourceSectionBaselineId:'V10-NH-G3-U6-4-001',title:'The Repair Priority List Without Criteria',level:'STANDARD',targetWordBand:[150,230],rows:[
['The school repair committee received requests for a leaking window, scratched desks, a broken clock, and a loose handrail.','学校修理委員会は雨漏りする窓、傷ついた机、壊れた時計、緩い手すりの要望を受けました。'],
['Two groups ranked the four repairs in almost opposite orders.','二グループはほぼ逆の順位を付けました。'],
['One group put the clock first because many students saw it every day.','一方は多くの生徒が毎日見るため時計を一位にしました。'],
['The other put the handrail first because a fall could cause injury.','もう一方は転倒でけがにつながるため手すりを一位にしました。'],
['Members realized they had never agreed on what “important” meant.','委員は「重要」の意味を共有していなかったと気づきました。'],
['They created three criteria: immediate safety risk, effect on daily learning, and chance that damage would become worse.','即時の安全危険、日常学習への影響、損傷悪化の可能性という三基準を作りました。'],
['Each repair received a short explanation under all three criteria.','各修理を三基準すべてで短く説明しました。'],
['The loose handrail ranked high for safety, while the leaking window ranked high for worsening damage.','緩い手すりは安全、雨漏り窓は悪化可能性が高くなりました。'],
['The clock mattered for learning but had a low safety risk because another clock was nearby.','時計は学習に関係しますが、別の時計があり安全危険は低いと判断しました。'],
['The committee used the criteria to choose the handrail first and the window second.','基準を使い手すりを一番、窓を二番にしました。'],
['Members published the reasons beside the order instead of showing only a numbered list.','番号だけでなく順位の横に理由も公開しました。'],
['Students who had preferred another repair could still see how the decision had been made.','別の修理を希望した生徒も判断方法を確認できました。'],
['The group learned that explicit criteria do not remove disagreement, but they make different rankings easier to compare and discuss.','明確な基準は意見の違いを消さなくても、順位を比べ話し合いやすくすると学びました。']
]});
add({id:'V11-B08-G3-011',textbook:SS,section:'PROGRAM 7-3',sourceSectionBaselineId:'V10-SS-G3-P7-3-001',title:'The Event Survey Sent Only by QR Code',level:'LONG',targetWordBand:[240,330],rows:[
['The town youth group used a QR-code survey to ask residents what activities they wanted at a summer event.','町の青年グループは夏行事の希望をQRコード調査で住民に尋ねました。'],
['Posters with the code were placed at the station, library, and community center.','コード付きポスターを駅、図書館、地域センターに置きました。'],
['After one week, the group had more than three hundred responses and felt confident about the result.','一週間で300件以上集まり、結果に自信を持ちました。'],
['Most respondents wanted evening music and online ticket information.','多くは夜の音楽とオンライン券情報を希望しました。'],
['During a planning meeting, however, an older resident asked how people without smartphones had been able to answer.','しかし会議で高齢住民がスマホのない人はどう答えたのか尋ねました。'],
['The group checked the response ages and found very few answers from residents over seventy.','回答年齢を見ると70歳超の回答が非常に少ないと分かりました。'],
['They visited the community center during a daytime class and learned that several regular users had seen the poster but could not open the code.','昼の講座を訪ねると、ポスターは見てもコードを開けない利用者がいました。'],
['The students added paper forms at the center and a staffed table at the weekend market.','センターに紙用紙、週末市場に有人受付を追加しました。'],
['They used the same core questions so the new responses could be compared with the digital ones.','デジタル回答と比べられるよう中心質問は同じにしました。'],
['Paper respondents showed more interest in daytime activities, seating, and printed schedules.','紙の回答者は昼の活動、座席、印刷予定への関心が高めでした。'],
['The group did not throw away the QR results; instead, it reported how each collection method reached different people.','QR結果を捨てず、各方法がどんな人に届いたか説明しました。'],
['Event planners added one daytime performance and kept both printed and online information.','企画には昼公演を一つ加え、印刷とオンライン情報を両方残しました。'],
['For the next survey, the youth group planned digital and non-digital response methods from the beginning.','次回は最初からデジタルと非デジタル両方を用意することにしました。'],
['They also decided to record how each response was collected without attaching a person’s name.','名前を付けず回答方法だけ記録することも決めました。'],
['The experience showed that a large response count can still leave out a group when everyone must use the same technology.','回答数が多くても同じ技術を全員に求めると抜ける集団があると分かりました。'],
['Using two methods made the survey slightly harder to manage but gave more residents a practical chance to be heard.','二方法は管理が少し複雑でも、より多くの住民に現実的な回答機会を与えました。']
]});
add({id:'V11-B08-G3-012',textbook:NH,section:'Unit 6-4',sourceSectionBaselineId:'V10-NH-G3-U6-4-001',title:'The Shared Bicycle Rule and Short Trips',level:'STANDARD',targetWordBand:[150,230],rows:[
['A shared-bicycle project limited every ride to sixty minutes so that no one could keep a bicycle all day.','共同自転車は一人が一日中使わないよう、一回60分に制限していました。'],
['The rule sounded fair and worked well for people making long trips.','公平に見え、長い移動にはうまく機能しました。'],
['After a month, however, users making ten-minute trips began avoiding the bicycles at busy times.','一か月後、10分ほどの利用者が混雑時に自転車を避けるようになりました。'],
['They explained that returning a bicycle quickly gave them no benefit, while a long rider could use the same full hour.','早く返しても利点がなく、長時間利用者も同じ1時間使えると説明しました。'],
['The project team checked station records and saw many short trips ending just before a station became empty.','記録を見ると、駅の自転車がなくなる直前に短い利用が多く終わっていました。'],
['They tested a new rule that gave users a small booking priority after returning a bicycle within fifteen minutes.','15分以内に返した人へ小さな予約優先を与える新ルールを試しました。'],
['The priority lasted only for the next two hours and could not be saved for another day.','優先は次の2時間だけで、別の日には持ち越せません。'],
['During the trial, short trips increased while average bicycle availability did not fall.','試行中、短い利用は増えましたが平均利用可能台数は減りませんでした。'],
['Longer users still kept the sixty-minute limit.','長い利用者は引き続き60分制限でした。'],
['The team kept the change but monitored whether anyone was making unnecessary short rides only to gain priority.','変更を残し、優先のためだけに不要な短距離利用をする人がいないか観察しました。'],
['No clear misuse appeared during the first month.','最初の一か月には明らかな悪用は見られませんでした。'],
['The project learned that treating every trip exactly the same can sometimes discourage behavior that helps a shared system work.','全利用を完全に同じ扱いにすると、共有制度を助ける行動を減らす場合があると学びました。']
]});
add({id:'V11-B08-G3-013',textbook:SS,section:'PROGRAM 7-3',sourceSectionBaselineId:'V10-SS-G3-P7-3-001',title:'The Community Board Full of Old Notices',level:'STANDARD',targetWordBand:[150,230],rows:[
['The community notice board was covered with flyers for classes, sales, and events.','地域掲示板は講座、販売、行事のチラシでいっぱいでした。'],
['Some notices were more than six months old, but no one knew who was allowed to remove them.','半年以上古い物もありましたが、誰が外してよいか分かりませんでした。'],
['New groups placed papers over older ones, and current information became difficult to find.','新しい紙が古い紙の上に貼られ、現在の情報を探しにくくなりました。'],
['Students counted eighty-two notices and checked the dates on each one.','生徒は82枚を数え、日付を確認しました。'],
['Twenty-seven referred to events that had already ended.','27枚はすでに終わった行事の物でした。'],
['Another nineteen had no date at all.','さらに19枚には日付がありませんでした。'],
['The students proposed adding a posting date and an expiration date to every new notice.','新しい掲示すべてに掲示日と期限を付けるよう提案しました。'],
['Notices without a clear event date would receive a default review after one month.','明確な行事日がない物は一か月後に見直すことにしました。'],
['A volunteer would check the board every Friday and move expired papers to a folder for one week before recycling them.','毎週金曜に確認し、期限切れは一週間保管してから再利用へ回します。'],
['This gave owners a chance to recover a notice removed by mistake.','誤って外した物を持ち主が取り戻す機会も作れました。'],
['After six weeks, the board held fewer papers but displayed more current events.','六週間後、紙は減りましたが現在の行事はより多く見えるようになりました。'],
['People could read the remaining notices without lifting other sheets.','他の紙を持ち上げず残った掲示を読めました。'],
['The group learned that shared information spaces need a review rule, not just more room for new material.','共有情報の場所には広さだけでなく見直しの決まりが必要だと学びました。']
]});
add({id:'V11-B08-G3-014',textbook:NH,section:'Unit 6-4',sourceSectionBaselineId:'V10-NH-G3-U6-4-001',title:'The Heat Alert, the Sports Schedule, and the Shade Record',level:'YAMAGUCHI_EXAM',targetWordBand:[330,450],materials:{heatAlert:'13:00 moderate / 14:00 high / 15:00 very high / after 17:00 high',normalPractice:'running 14:40–15:30; skills 15:30–16:30',shade:'west field almost no shade at 15:00; covered area shaded but too small for full-team running',transport:'some students need 17:45 bus'},freeWriteTask:{prompt:'安全と帰宅時刻の両方を考えた練習案を、本文と資料を根拠に英語20～30語で書きなさい。',minWords:20,maxWords:30},rows:[
['The school sports committee had to decide whether afternoon practice should continue during a week of extreme heat.','学校の運動委員会は猛暑の週に午後練習を続けるか判断する必要がありました。'],
['An official heat notice listed hourly risk levels: moderate at 1:00, high at 2:00, very high at 3:00, and high again after 5:00.','公式暑さ情報は1時中程度、2時高い、3時非常に高い、5時以降高いと示しました。'],
['The normal practice schedule placed running drills from 2:40 to 3:30 and skill practice from 3:30 to 4:30.','通常予定は2時40分～3時30分が走練習、3時30分～4時30分が技能練習でした。'],
['Students also measured shade on the field and found that the west side had almost no shade at 3:00.','生徒が日陰を測ると3時の西側にはほとんど日陰がありませんでした。'],
['A covered practice area beside the gym stayed shaded all afternoon but was too small for full-team running.','体育館横の屋根付き場所は午後ずっと日陰ですが、全員で走るには狭すぎました。'],
['One coach suggested canceling every activity, while another wanted to keep the normal plan with more water breaks.','一人のコーチは全中止、別のコーチは給水を増やし通常通りを提案しました。'],
['The committee compared three options rather than choosing between those two extremes.','委員会は二択にせず三案を比べました。'],
['Option A kept the schedule and added a water break every fifteen minutes.','A案は通常予定で15分ごとに給水を入れます。'],
['Option B moved running to 5:10 and used the covered area for low-intensity skill work before then.','B案は走練習を5時10分へ移し、それまでは屋根下で低強度の技能練習をします。'],
['Option C canceled running completely but kept a short indoor meeting.','C案は走練習を完全中止し短い屋内会議だけ行います。'],
['The heat notice showed that extra breaks did not change the very high outdoor risk at 3:00.','暑さ情報から、給水を増やしても3時の非常に高い屋外危険自体は変わらないと分かりました。'],
['The shade record also showed that moving a few meters on the field would not solve the problem at that hour.','日陰記録でも、数メートル移動するだけではその時刻の問題を解決できませんでした。'],
['Option B reduced exposure during the highest-risk period but required practice to end later.','B案は最高危険時間の屋外活動を減らせますが終了が遅くなります。'],
['Some students depended on the 5:45 bus, so a late finish could create another problem.','5時45分のバスを使う生徒もいて、遅い終了は別の問題になります。'],
['The committee shortened the 5:10 running block and allowed bus users to complete an indoor alternative.','5時10分の走練習を短くし、バス利用者には屋内代替を認めました。'],
['During the trial, all high-intensity outdoor work began after the risk level had fallen.','試行では高強度の屋外活動は危険度が下がった後に始めました。'],
['Coaches recorded water breaks and asked students to report dizziness immediately.','コーチは給水を記録し、めまいをすぐ報告するよう求めました。'],
['No student was required to stay for the later outdoor block if transportation or health conditions made it difficult.','交通や健康上難しい生徒に遅い屋外練習を強制しませんでした。'],
['The committee posted the reason for the change beside the revised schedule.','委員会は変更理由を修正版予定の横に掲示しました。'],
['It explained that the plan used three pieces of information: hourly heat risk, activity intensity, and actual shade.','時刻別暑さ危険、活動強度、実際の日陰という三情報を使ったと説明しました。'],
['The group agreed to check the official notice again each day because the risk level could change.','危険度は変わるため公式情報を毎日確認することにしました。'],
['They learned that a safe recommendation should explain its trade-offs rather than simply saying “practice” or “cancel.”','安全な提案は「実施」「中止」だけでなく、利点と不利益の両方を説明すべきだと学びました。']
]});
add({id:'V11-B08-G3-015',textbook:SS,section:'PROGRAM 7-3',sourceSectionBaselineId:'V10-SS-G3-P7-3-001',title:'The Small Shop Survey Taken on One Day',level:'LONG',targetWordBand:[240,330],rows:[
['A business class surveyed shoppers near a small neighborhood store on one Wednesday afternoon.','ビジネスの授業で水曜午後に地域の小店の買物客を調査しました。'],
['Most of the people they met wanted quick lunches, drinks, and school supplies.','出会った多くの人は簡単な昼食、飲み物、学校用品を求めていました。'],
['The students planned to recommend expanding those products.','生徒たちはそれらの商品を増やす提案を考えました。'],
['Before writing the report, one member asked whether Wednesday afternoon represented the store’s whole week.','報告前に一人が、水曜午後が一週間全体を代表するか尋ねました。'],
['They returned on Saturday morning and counted a very different group of shoppers.','土曜朝に戻ると、かなり違う買物客がいました。'],
['Families bought larger food packages, older residents asked about household items, and few students were present.','家族は大きな食品、高齢者は日用品を求め、生徒は少数でした。'],
['The class then reviewed the store’s hourly sales totals for one ordinary week.','クラスは普通の一週間の時間別売上も確認しました。'],
['Weekday afternoons had many small purchases, while weekend mornings had fewer but larger purchases.','平日午後は小口購入が多く、週末朝は件数が少ないが一回の購入が大きめでした。'],
['The original survey had described one important period but not every type of customer.','最初の調査は重要な一時間帯を示しても、すべての客を示してはいませんでした。'],
['Students collected a second short survey on Saturday and kept the two samples separate.','土曜に二回目の短い調査をし、二つの標本を分けました。'],
['They compared needs by time instead of mixing the answers into one average.','一つの平均へ混ぜず、時間帯別に希望を比べました。'],
['The final recommendation suggested quick items near the front on school days and clearer household displays for weekends.','最終案は学校のある日に入口近くへ簡単な商品、週末は日用品を見やすくする内容でした。'],
['It did not claim that every shopper wanted both sets of products.','すべての客が両方を望むとは述べませんでした。'],
['The owner tested the display changes for a month and shared sales totals with the class.','店主が一か月配置変更を試し、売上をクラスと共有しました。'],
['School-day convenience sales stayed strong, while several weekend household items improved.','学校日の便利商品売上は保たれ、週末の日用品のいくつかは伸びました。'],
['The students learned that one-day research can support a narrow claim, but a broad claim needs evidence from the different periods it describes.','一日の調査は狭い主張には使えても、広い主張には対象期間ごとの証拠が必要だと学びました。']
]});
add({id:'V11-B08-G3-016',textbook:NH,section:'Unit 6-4',sourceSectionBaselineId:'V10-NH-G3-U6-4-001',title:'The Final Recommendation with One Missing Voice',level:'STANDARD',targetWordBand:[150,230],rows:[
['A student committee prepared a final recommendation for changing the pickup area after school.','生徒委員会は放課後の迎え場所を変える最終提案を準備しました。'],
['They had surveyed teachers, bus drivers, bicycle users, and parents who arrived by car.','先生、バス運転手、自転車利用者、車で来る保護者を調査していました。'],
['Most responses supported moving the bicycle waiting line away from the main gate.','多くの回答は自転車待機列を正門から離すことに賛成でした。'],
['Just before submitting the report, a member noticed that students who walked home had never been asked.','提出直前、徒歩で帰る生徒には一度も尋ねていないと気づきました。'],
['Walkers used the same gate and would be affected by the new bicycle route.','徒歩生徒も同じ門を使い、新しい自転車経路の影響を受けます。'],
['The committee paused the recommendation and held a short listening session the next day.','委員会は提案を止め、翌日短い意見聴取を行いました。'],
['Several walkers supported the change, but they pointed out one narrow corner where bicycles would cross their path.','多くの徒歩生徒も賛成でしたが、自転車と交差する狭い角を指摘しました。'],
['The committee adjusted the proposed line by several meters and added a painted crossing point.','待機線を数メートル調整し、色付きの横断地点を加えました。'],
['They then showed the revised map to both bicycle users and walkers.','修正版地図を自転車利用者と徒歩生徒の両方へ見せました。'],
['Both groups said the new route was clearer than the first proposal.','両方が最初の案より分かりやすいと言いました。'],
['The final report explained why the decision had been delayed and what changed after the missing group was heard.','最終報告はなぜ遅らせたか、抜けていた集団の意見後に何を変えたか説明しました。'],
['Committee members learned that a strong majority cannot represent people who were never given a chance to respond.','強い多数意見でも、回答の機会がなかった人々を代表できないと学びました。']
]});
window.V11_BATCH08_G3_DRAFTS=passages;window.V11_BATCH08_G3_DRAFT_META={batch:BATCH,count:passages.length,registered:false,stage:'G3_DRAFT_AUTHORING',profile:{STANDARD:passages.filter(p=>p.level==='STANDARD').length,LONG:passages.filter(p=>p.level==='LONG').length,YAMAGUCHI_EXAM:passages.filter(p=>p.level==='YAMAGUCHI_EXAM').length}};
})(typeof window!=='undefined'?window:this);
