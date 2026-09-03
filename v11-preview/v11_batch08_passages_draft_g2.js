(function buildV11Batch08G2Drafts(){
'use strict';
const BATCH='V11-B08-G2-DRAFT-20260829',SS='サンシャイン',NH='ニューホライズン';
function words(s){return (String(s||'').match(/[A-Za-z]+(?:['’][A-Za-z]+)?/g)||[]);}
function q(type,prompt,answer,evidence,evidenceJp,reason,extra){return Object.assign({questionType:type,prompt,answer,evidence,evidenceJp,reason},extra||{});}
function build(o){const sentences=o.rows.map(r=>r[0]),slashRows=o.rows.map(r=>({en:r[0],jp:r[1]})),fullTranslation=o.rows.map(r=>r[1]).join(''),wc=words(sentences.join(' ')).length;const idx=[0,1,2,3,4,Math.min(5,o.rows.length-1),Math.min(6,o.rows.length-1),Math.min(7,o.rows.length-1),Math.min(8,o.rows.length-1),o.rows.length-1],ev=i=>o.rows[i][0],jp=i=>o.rows[i][1];const questions=[q('GIST',`「${o.title}」の出発点として本文に書かれていることを答えなさい。`,jp(idx[0]),ev(idx[0]),jp(idx[0]),'本文冒頭の状況です。'),q('DETAIL',`第2段階で起きたことを答えなさい。`,jp(idx[1]),ev(idx[1]),jp(idx[1]),'本文に直接示されています。'),q('REASON',`問題を考える材料として第3段階で分かったことを答えなさい。`,jp(idx[2]),ev(idx[2]),jp(idx[2]),'原因や判断材料になる文です。'),q('CONTENT_MATCH',`第4段階の内容に合うものを答えなさい。`,jp(idx[3]),ev(idx[3]),jp(idx[3]),'本文の記述と一致します。'),q('DETAIL',`解決に向けた第5段階の内容を答えなさい。`,jp(idx[4]),ev(idx[4]),jp(idx[4]),'本文に直接示されています。')];const questionSetB=[q('INFERENCE',`第6段階から読み取れることを答えなさい。`,jp(idx[5]),ev(idx[5]),jp(idx[5]),'前後の出来事から読み取れます。'),q('SENTENCE_INSERTION',`「この確認が次の改善につながりました。」を入れるなら、どの文の後が自然ですか。`,`第${idx[6]+1}文の後`,ev(idx[6]),jp(idx[6]),'この内容を受けて次の行動に進むからです。',{insertAfterSentence:idx[6]+1}),q('CONTEXT_WORD',`第${idx[7]+1}文の内容を表す空所 _____ に当たる出来事を答えなさい。`,jp(idx[7]),ev(idx[7]),jp(idx[7]),'文脈上の出来事です。'),q('SUMMARY_FILL',`まとめの空所 _____ に入る内容として第${idx[8]+1}文の要点を答えなさい。`,jp(idx[8]),ev(idx[8]),jp(idx[8]),'終盤の要点です。'),q('CONTENT_MATCH',`最後に分かったこと・決めたこととして本文に合うものを答えなさい。`,jp(idx[9]),ev(idx[9]),jp(idx[9]),'本文末の結論と一致します。')];return Object.assign({grade:'2',genre:'reading',batch:BATCH,wordCount:wc,sentences,fullTranslation,slashRows,questions,questionSetB,registered:false,questionStage:'BATCH08_DRAFT_CONTENT_AWARE_SCAFFOLD',authorReview:{reviewed:true,timelineCoherent:true,actorPerspectiveClear:true,causalLogicCoherent:true,translationNatural:true}},o,{rows:undefined});}
const passages=[];const add=o=>passages.push(build(o));
add({id:'V11-B08-G2-001',textbook:SS,section:'PROGRAM 8-3',sourceSectionBaselineId:'V10-SS-G2-P8-3-001',title:'The Graph with an Uneven Scale',level:'STANDARD',targetWordBand:[120,155],rows:[
['The student council made a bar graph showing how many bottles were collected each week.','生徒会は週ごとの回収ボトル数を示す棒グラフを作りました。'],
['At first, the graph looked as if collections had doubled in only seven days.','最初、そのグラフでは回収数が七日間で二倍になったように見えました。'],
['However, Aki noticed that the vertical scale started at ninety bottles instead of zero.','しかし秋は、縦軸が0ではなく90本から始まっていることに気づきました。'],
['The first week had ninety-eight bottles, and the second week had one hundred six.','一週目は98本、二週目は106本でした。'],
['The difference was real, but it was much smaller than the tall bars suggested.','差は実際にありましたが、棒の高さが示すほど大きくはありませんでした。'],
['Students redrew the graph with a scale beginning at zero.','生徒たちは0から始まる目盛りでグラフを描き直しました。'],
['They also wrote the exact number above each bar.','それぞれの棒の上に正確な数も書きました。'],
['When classmates compared both versions, they said the second graph was easier to judge fairly.','クラスメートが二つを比べると、二つ目の方が公平に判断しやすいと言いました。'],
['The council kept the new version for its report.','生徒会は報告書に新しい版を使いました。'],
['They added a note explaining that a graph should not make a small change look larger than it is.','小さな変化を実際以上に大きく見せないことが大切だという注も加えました。']
]});
add({id:'V11-B08-G2-002',textbook:NH,section:'Unit 7-4',sourceSectionBaselineId:'V10-NH-G2-U7-4-001',title:'The Community Room Booking Gap',level:'LONG',targetWordBand:[170,210],rows:[
['Two community groups wanted to use the same meeting room on Saturday afternoon.','二つの地域グループが土曜日の午後に同じ会議室を使う予定でした。'],
['The booking sheet showed the first group ending at three and the second starting at three.','予約表では一つ目が3時終了、二つ目が3時開始となっていました。'],
['Both leaders believed there was no conflict because the times did not overlap.','時間が重ならないため、両代表は問題ないと思っていました。'],
['On the day of the meetings, the first group needed ten minutes to move tables and clean the floor.','当日、一つ目のグループは机を動かし床を片付けるのに10分必要でした。'],
['The second group arrived at three and found people and chairs still inside.','二つ目のグループが3時に来ると、まだ人と椅子が残っていました。'],
['Instead of blaming either group, students checked how the schedule had been designed.','生徒たちはどちらかを責めず、予定表の作り方を確認しました。'],
['They found that the form recorded meeting time but had no space for setup or cleanup.','用紙には会議時間だけがあり、準備や片付け時間を書く欄がないと分かりました。'],
['The students tested three possible gaps: five, ten, and fifteen minutes.','生徒たちは5分、10分、15分の三つの空き時間を試しました。'],
['Five minutes was too short for groups using large tables.','大きな机を使うグループには5分では短すぎました。'],
['Fifteen minutes left the room empty longer than necessary for most meetings.','15分では多くの会議で必要以上に部屋が空きました。'],
['A ten-minute transition worked during two later trials.','その後二回試すと、10分の入れ替え時間がうまく機能しました。'],
['The revised booking sheet showed meeting time and a separate transition period.','新しい予約表には会議時間と別に入れ替え時間を示しました。'],
['It also asked groups to state whether they needed special equipment.','特別な用具が必要かも書くようにしました。'],
['After the change, both leaders could see exactly when the room had to be ready.','変更後は、両代表が部屋をいつまでに準備すべきか正確に分かりました。'],
['The small gap made the schedule more realistic without reducing the number of meetings.','短い空き時間を入れることで、会議数を減らさず現実的な予定になりました。']
]});
add({id:'V11-B08-G2-003',textbook:SS,section:'PROGRAM 8-3',sourceSectionBaselineId:'V10-SS-G2-P8-3-001',title:'The Interview Question That Led the Answer',level:'STANDARD',targetWordBand:[120,155],rows:[
['The school newspaper planned an interview about the new lunch menu.','学校新聞は新しい給食メニューについてインタビューすることにしました。'],
['One student wrote, “Don’t you think the healthier menu is better?”','一人が「健康的な新メニューの方がよいと思いませんか」と質問を作りました。'],
['During a practice interview, nearly everyone answered yes before giving any details.','練習では、ほとんどの人が詳しい理由を言う前に「はい」と答えました。'],
['Mio said the question itself might be pushing people toward one answer.','美緒は質問自体が一つの答えへ誘導しているかもしれないと言いました。'],
['The reporters tried a second version: “What do you think about the new lunch menu?”','記者たちは「新しい給食についてどう思いますか」という二つ目の質問を試しました。'],
['Some students liked the vegetables, while others talked about portion size or taste.','野菜をよいとする人もいれば、量や味について話す人もいました。'],
['The answers became more varied and gave the reporters useful reasons.','答えは多様になり、記事に使える理由も得られました。'],
['They compared the two sets of responses before writing the article.','記事を書く前に二種類の回答を比べました。'],
['The team kept the open question and added one follow-up asking why.','チームは自由に答えられる質問を残し、理由を尋ねる追加質問を付けました。'],
['The final article included both positive and negative comments.','完成した記事には肯定的・否定的な意見の両方が入りました。'],
['The reporters learned that a question should help people explain their view instead of suggesting the expected answer.','質問は期待する答えを示すのではなく、考えを説明しやすくするべきだと学びました。']
]});
add({id:'V11-B08-G2-004',textbook:NH,section:'Unit 7-4',sourceSectionBaselineId:'V10-NH-G2-U7-4-001',title:'The Recycling Box People Walked Past',level:'STANDARD',targetWordBand:[120,155],rows:[
['A recycling box stood beside the gym entrance for two weeks.','リサイクル箱は二週間、体育館入口のそばに置かれていました。'],
['Students expected it to fill quickly because many people used the gym.','体育館を使う人が多いので、すぐいっぱいになると思っていました。'],
['Instead, the box often stayed nearly empty.','しかし箱はほとんど空のままでした。'],
['Riku watched where students actually walked after lunch and after club practice.','陸は昼食後と部活後に生徒が実際どこを歩くか観察しました。'],
['Most people left through a side door and never passed the box.','多くの人は横の扉から出て、箱の前を通っていませんでした。'],
['He marked the main walking routes on a simple floor map.','陸は簡単な校内図に主な歩行経路を記しました。'],
['The class moved the box beside the side door but kept it away from the emergency exit.','クラスは非常口をふさがないよう、横の扉のそばへ箱を移しました。'],
['During the next week, the amount of collected paper increased.','翌週、回収された紙の量が増えました。'],
['Students also noticed fewer loose papers in nearby trash bins.','近くのごみ箱に混ざる紙も減ったと気づきました。'],
['They kept the new location and added a clear recycling sign.','新しい場所を使い続け、分かりやすい表示も付けました。'],
['The result showed that a useful place depends on where people really move, not only on which entrance seems important.','便利な場所は目立つ入口ではなく、人が実際に動く場所で考える必要があると分かりました。']
]});
add({id:'V11-B08-G2-005',textbook:SS,section:'PROGRAM 8-3',sourceSectionBaselineId:'V10-SS-G2-P8-3-001',title:'The Practice Room Noise Record',level:'LONG',targetWordBand:[170,210],rows:[
['The brass band and drama club both practiced after school near the same hallway.','吹奏楽部と演劇部は放課後、同じ廊下の近くで練習していました。'],
['Each club complained that the other group was making too much noise.','どちらも相手の音が大きすぎると不満を言っていました。'],
['At first, members argued using memories from different days.','最初は別々の日の記憶をもとに言い合っていました。'],
['The student council suggested recording the actual times and places for one week.','生徒会は一週間、実際の時刻と場所を記録するよう提案しました。'],
['Students stood at three points in the hallway and wrote down when loud sounds could be heard.','生徒たちは廊下の三地点に立ち、大きな音が聞こえた時刻を書きました。'],
['They also noted whether classroom doors were open or closed.','教室の扉が開いているか閉まっているかも記録しました。'],
['The records showed that the loudest overlap happened only on Tuesday and Thursday from four to four thirty.','記録から、最も大きく重なるのは火曜と木曜の4時から4時半だけだと分かりました。'],
['On other days, the clubs used different rooms or finished at different times.','他の日は別の部屋を使うか、終了時刻が違いました。'],
['Closing one practice-room door reduced the sound near the drama area.','練習室の扉を一つ閉めると演劇部側の音が減りました。'],
['Moving the band’s warm-up ten minutes earlier removed most of the remaining overlap.','吹奏楽部の準備練習を10分早めると、残る重なりもほとんどなくなりました。'],
['Both clubs tested the new arrangement for another week.','両部は新しい方法をさらに一週間試しました。'],
['The second record showed fewer complaints and no missed practice time.','二回目の記録では不満が減り、練習時間も失われませんでした。'],
['The council posted the agreed times beside both rooms.','生徒会は合意した時刻を両方の部屋のそばに掲示しました。'],
['Members said the written record made the discussion feel fairer because it separated repeated problems from occasional noise.','記録があることで、繰り返す問題と一時的な音を分けられ、話し合いが公平になったと感じました。'],
['They kept the plan but agreed to record again if the room schedule changed.','部屋の予定が変わったら再び記録することも決めました。']
]});
add({id:'V11-B08-G2-006',textbook:NH,section:'Unit 7-4',sourceSectionBaselineId:'V10-NH-G2-U7-4-001',title:'The Recipe Card with Two Cup Sizes',level:'STANDARD',targetWordBand:[120,155],rows:[
['A cooking group followed a recipe card for vegetable soup.','調理グループは野菜スープのレシピカードを使いました。'],
['The card said to add “two cups of water,” but two different measuring cups were on the table.','カードには「水2カップ」とありましたが、机には大きさの違う計量カップが二つありました。'],
['One cup held two hundred milliliters, and the other held two hundred fifty.','一つは200ミリリットル、もう一つは250ミリリットル入りました。'],
['Two teams made the same recipe and ended with very different amounts of soup.','二チームが同じレシピで作りましたが、出来たスープの量が大きく違いました。'],
['They checked the vegetables and cooking time first, but those were nearly identical.','まず野菜と調理時間を確認しましたが、ほぼ同じでした。'],
['Then they noticed that the teams had used different cups.','そこで二チームが違うカップを使っていたと気づきました。'],
['The students rewrote the card to say “five hundred milliliters of water.”','生徒たちは「水500ミリリットル」とカードを書き直しました。'],
['They tested the new instruction with both measuring sets.','新しい指示を二つの計量道具で試しました。'],
['Both soups then had almost the same amount and thickness.','するとスープの量と濃さがほぼ同じになりました。'],
['The class kept the metric amount on the card and wrote the old cup note in parentheses only for reference.','カードにはミリリットル表示を残し、元のカップ表示は参考として括弧に入れました。'],
['They learned that an instruction should name a measurement clearly when different tools could give different results.','道具によって結果が変わる場合は、量を明確に示すべきだと学びました。']
]});
add({id:'V11-B08-G2-007',textbook:SS,section:'PROGRAM 8-3',sourceSectionBaselineId:'V10-SS-G2-P8-3-001',title:'The Lost-and-Found Log with No Dates',level:'STANDARD',targetWordBand:[120,155],rows:[
['The lost-and-found room kept a notebook listing every umbrella, glove, and bag.','落とし物室では傘、手袋、かばんを記録するノートを使っていました。'],
['Workers wrote the item name and color, but they did not write the date.','品名と色は書きましたが、日付は書いていませんでした。'],
['By November, several black umbrellas looked almost identical.','11月になると、よく似た黒い傘が何本も集まりました。'],
['A student asked whether one umbrella had arrived yesterday or three months earlier.','ある生徒が、その傘は昨日か三か月前かと尋ねました。'],
['No one could answer from the notebook.','ノートからは誰も答えられませんでした。'],
['The class added two new columns for the date found and the date returned.','クラスは発見日と返却日の二つの欄を追加しました。'],
['They also put small numbered tags on new items.','新しい落とし物には小さな番号札も付けました。'],
['After one month, staff could match questions to recent entries much faster.','一か月後、最近の記録と問い合わせをずっと早く照合できました。'],
['Old items were easier to review because their dates were visible.','古い品も日付が見えるので確認しやすくなりました。'],
['The new log did not collect private information about owners.','新しい記録は持ち主の個人情報を集めませんでした。'],
['It simply recorded enough history to tell similar old and new items apart.','似た古い物と新しい物を区別するのに必要な履歴だけを記録しました。']
]});
add({id:'V11-B08-G2-008',textbook:NH,section:'Unit 7-4',sourceSectionBaselineId:'V10-NH-G2-U7-4-001',title:'The Wheelchair Route Tested Too Late',level:'LONG',targetWordBand:[170,210],rows:[
['Students planned a school fair and drew a wide route for wheelchair users on the floor map.','生徒たちは学校祭を計画し、車いす利用者の広い経路を会場図に描きました。'],
['They checked the route on paper and believed it was clear.','紙の上で確認し、問題なく通れると思いました。'],
['On the morning of the fair, booths and extra chairs were placed before anyone tested the real path.','当日の朝、実際の通路を試す前に出店や追加の椅子が置かれました。'],
['A game table narrowed one corner, and a stack of boxes blocked the easiest turn.','ゲーム台が角を狭くし、箱の山が曲がりやすい場所をふさいでいました。'],
['When a student tried the route in a wheelchair, helpers had to move two objects.','生徒が車いすで試すと、二つの物を動かす必要がありました。'],
['The planners stopped and measured the open width along the whole path.','計画係は作業を止め、経路全体の空いている幅を測りました。'],
['They marked a minimum clear space with removable tape before reopening the area.','再開前に必要な幅をはがせるテープで示しました。'],
['Two booths were shifted thirty centimeters, and storage boxes were moved behind a closed counter.','二つの出店を30センチずらし、保管箱は閉じたカウンターの後ろへ移しました。'],
['The team then tested the route with a wheelchair, a stroller, and a cart.','その後、車いす、ベビーカー、台車で経路を試しました。'],
['All three could pass without asking people to move furniture.','どれも家具を動かしてもらわず通れました。'],
['Students added the clear route to the setup checklist for future events.','今後の行事用の設営確認表に、経路確保を追加しました。'],
['They also assigned one person to inspect it before visitors arrived.','来場者が来る前に一人が確認する係も決めました。'],
['The lesson was not only to draw an accessible route but to protect that route during setup.','通れる経路を描くだけでなく、設営中もその経路を守る必要があると学びました。'],
['Testing after every object was placed prevented a good plan from becoming unusable.','すべてを置いた後に試すことで、良い計画が使えなくなるのを防げました。'],
['The fair opened a little later, but the route stayed clear for the rest of the day.','学校祭の開始は少し遅れましたが、その日は最後まで通路が確保されました。']
]});
add({id:'V11-B08-G2-009',textbook:SS,section:'PROGRAM 8-3',sourceSectionBaselineId:'V10-SS-G2-P8-3-001',title:'The Poll with Too Few Choices',level:'STANDARD',targetWordBand:[120,155],rows:[
['The class created a poll about activities for the school open day.','クラスは学校公開日の活動についてアンケートを作りました。'],
['The choices were sports, music, science, and art.','選択肢はスポーツ、音楽、科学、美術でした。'],
['Many students selected one option, but several wrote comments saying they wanted cooking.','多くは選択肢から選びましたが、料理を希望するコメントもいくつかありました。'],
['The original poll had no place for an answer outside the four choices.','元のアンケートには四つ以外の答えを書く場所がありませんでした。'],
['Yui counted the comments and found that cooking appeared more often than one listed activity.','結衣がコメントを数えると、料理はある既存選択肢より多く出ていました。'],
['The class added “other” with a short writing box.','クラスは「その他」と短い記入欄を加えました。'],
['They ran the poll again with the same grade.','同じ学年でもう一度調査しました。'],
['Cooking became a visible choice through the open responses.','自由記述によって料理という希望が見えるようになりました。'],
['Students still kept the four original categories for comparison.','比較のため、元の四分類も残しました。'],
['The final report explained both the fixed choices and the added responses.','最終報告では固定選択肢と追加回答の両方を説明しました。'],
['The class learned that a poll can miss common opinions when the available choices are too narrow.','選択肢が狭すぎると、よくある意見でも見落とすことがあると学びました。']
]});
add({id:'V11-B08-G2-010',textbook:NH,section:'Unit 7-4',sourceSectionBaselineId:'V10-NH-G2-U7-4-001',title:'The Watering Schedule After a Cloudy Week',level:'STANDARD',targetWordBand:[120,155],rows:[
['The garden club watered its vegetable beds every Monday, Wednesday, and Friday.','園芸部は毎週月・水・金曜日に野菜畑へ水をやっていました。'],
['After a cloudy week, some soil stayed wet even on the next watering day.','曇りの日が続いた週には、次の水やりの日でも土がぬれたままでした。'],
['Students followed the calendar anyway, and one bed became muddy.','それでも予定通り水をやると、一つの畑がぬかるみました。'],
['Mai suggested checking the soil before adding more water.','舞は水を加える前に土を確認しようと提案しました。'],
['The group compared the top soil with soil a few centimeters below.','表面の土と数センチ下の土を比べました。'],
['They found that the lower soil still held plenty of moisture.','下の土にはまだ十分な水分が残っていました。'],
['For the next two weeks, they used the calendar as a reminder but checked the soil first.','次の二週間は予定表を目安にしつつ、先に土を確認しました。'],
['They skipped watering twice after cool, cloudy days.','涼しく曇った日の後は二回、水やりをしませんでした。'],
['The plants stayed healthy, and the beds were no longer muddy.','植物は元気なままで、畑もぬかるまなくなりました。'],
['The club wrote the new rule on its garden board.','部は新しい決まりを園芸掲示板に書きました。'],
['A schedule remained useful, but the actual soil condition decided whether water was needed.','予定表は役立ちますが、水が必要かは実際の土の状態で決めることにしました。']
]});
add({id:'V11-B08-G2-011',textbook:SS,section:'PROGRAM 8-3',sourceSectionBaselineId:'V10-SS-G2-P8-3-001',title:'The School Tour That Took Different Times',level:'LONG',targetWordBand:[170,210],rows:[
['Students designed a twenty-minute school tour for visiting families.','生徒たちは来校家族向けに20分の校内案内を作りました。'],
['The route looked reasonable when one student walked it alone.','一人で歩くと、その道順は無理がないように見えました。'],
['During the first real tour, however, the group needed almost thirty minutes.','しかし最初の本番では、グループは30分近くかかりました。'],
['The planners timed another three groups and recorded where each delay happened.','計画係はさらに三グループを計り、遅れた場所を記録しました。'],
['The entrance explanation was usually on time, but the science room took longer because visitors asked questions.','入口説明は予定通りでしたが、理科室では質問が出て時間がかかりました。'],
['The narrow stairway also slowed large groups when another class was coming down.','狭い階段では、別のクラスが下りてくると大人数の移動が遅れました。'],
['Students moved one explanation to a wider hall and shortened a repeated introduction.','一つの説明を広い廊下へ移し、重複する紹介を短くしました。'],
['They added a two-minute question period at the science room instead of pretending questions would not happen.','質問が出ない前提をやめ、理科室に2分の質問時間を入れました。'],
['The next group finished in twenty-three minutes.','次のグループは23分で終わりました。'],
['A later group took twenty-two minutes even with several questions.','その後は質問がいくつかあっても22分でした。'],
['The team changed the printed schedule from an exact twenty minutes to a twenty-five-minute plan.','印刷予定を20分ちょうどから25分の計画へ変えました。'],
['They also left five minutes before the next activity rather than booking events back to back.','次の活動との間にも5分空けました。'],
['Families said the tour felt less rushed.','家族は案内が以前より慌ただしくないと言いました。'],
['The students learned that a schedule should use measured group times, not only the fastest individual walk.','予定は一人の最速時間ではなく、実際のグループ時間で作るべきだと学びました。'],
['The revised plan was used for the next open day.','修正版は次の公開日に使われました。']
]});
add({id:'V11-B08-G2-012',textbook:NH,section:'Unit 7-4',sourceSectionBaselineId:'V10-NH-G2-U7-4-001',title:'The Caption That Changed the Meaning',level:'STANDARD',targetWordBand:[120,155],rows:[
['The school website posted a photo with the caption “Grade Two students plant trees on Friday.”','学校サイトに「中学二年生が金曜日に木を植える」という説明付き写真が載りました。'],
['Keiko recognized the place and thought something was wrong.','恵子は場所を見て、何か違うと感じました。'],
['The photo showed the community park, but Friday’s activity had taken place behind the school.','写真は地域の公園でしたが、金曜日の活動は学校裏で行われました。'],
['She checked the camera folder and found that the picture was from the previous Tuesday.','カメラのフォルダを確認すると、その写真は前の火曜日の物でした。'],
['The students in it were members of the environment club from three grades.','写っていたのは三学年から集まった環境部の生徒でした。'],
['Editors compared the date, location, and participant list.','編集係は日付、場所、参加者一覧を比べました。'],
['They rewrote the caption to name the park, Tuesday, and the environment club.','説明を公園、火曜日、環境部と分かるよう書き直しました。'],
['They left the Friday photo with its own correct caption.','金曜日の写真には別の正しい説明を付けました。'],
['The corrected page was published before the weekly newsletter.','修正版は週刊のお知らせ前に公開されました。'],
['The team added a rule requiring captions to be checked against the photo record.','チームは写真記録と説明を照合する決まりを加えました。'],
['A short caption can change the meaning of a picture when even one key fact is wrong.','短い説明でも重要な事実が一つ違うだけで、写真の意味を変えてしまうと学びました。']
]});
add({id:'V11-B08-G2-013',textbook:SS,section:'PROGRAM 8-3',sourceSectionBaselineId:'V10-SS-G2-P8-3-001',title:'The Donation Box Nobody Noticed',level:'STANDARD',targetWordBand:[120,155],rows:[
['A donation box was placed close to the school entrance for a charity project.','募金活動のため、募金箱を学校入口の近くに置きました。'],
['Students thought the entrance would be the best location.','生徒たちは入口が一番よい場所だと思いました。'],
['After three days, only a few people had noticed the box.','三日後、箱に気づいた人はわずかでした。'],
['The class tested three places during lunch while keeping the same sign.','同じ表示のまま、昼休みに三か所を試しました。'],
['They counted how many people looked at the box from the entrance, cafeteria hall, and library corner.','入口、食堂前廊下、図書室角で箱を見る人数を数えました。'],
['The cafeteria hall had the most people, but many were facing the opposite direction.','食堂前は人が最多でしたが、多くは反対方向を向いていました。'],
['The library corner had fewer people, yet the box stood directly in their walking line.','図書室角は人数が少ないものの、箱が歩く線上にありました。'],
['More students noticed it there and stopped to read the sign.','そこではより多くの生徒が気づき、表示を読むため立ち止まりました。'],
['The class moved the box to that corner without blocking the path.','通路をふさがないよう、その角へ箱を移しました。'],
['Donations increased during the next three days.','次の三日間で募金が増えました。'],
['The test showed that visibility can matter more than simply being near a busy entrance.','人の多い入口に近いだけより、実際に見えることが大切な場合があると分かりました。']
]});
add({id:'V11-B08-G2-014',textbook:NH,section:'Unit 7-4',sourceSectionBaselineId:'V10-NH-G2-U7-4-001',title:'The Stage Change That Needed Four Minutes',level:'LONG',targetWordBand:[170,210],rows:[
['The drama club planned four scene changes and gave each one the same two-minute space.','演劇部は四回の場面転換すべてに同じ2分を割り当てました。'],
['During rehearsal, the first change finished early, but the third took more than four minutes.','練習では一回目は早く終わりましたが、三回目は4分以上かかりました。'],
['That scene required a table, six chairs, and a large painted wall.','その場面では机一つ、椅子六脚、大きな背景板が必要でした。'],
['Actors stood waiting because the schedule assumed every change was equal.','すべて同じ時間と考えた予定のため、役者が待つことになりました。'],
['Students timed each change three times instead of using one rough guess.','生徒たちは大まかな予想ではなく、各転換を三回ずつ計りました。'],
['The results were one minute, two minutes, four minutes, and two minutes.','結果は1分、2分、4分、2分でした。'],
['They moved a short announcement before the longest change to cover part of the waiting time.','最長の転換前に短い案内を入れ、待ち時間の一部を使いました。'],
['Two chairs were also placed onstage earlier because they did not affect the previous scene.','前の場面に影響しない椅子二脚は先に舞台へ置きました。'],
['The next full rehearsal had no long silent gap.','次の通し練習では長い無音時間がなくなりました。'],
['The running order became easier for the lighting team to follow.','照明係も進行を追いやすくなりました。'],
['Students kept the measured times beside each scene in the script.','台本の各場面の横に測った時間を残しました。'],
['They also added one extra minute before the most complex change in case something went wrong.','最も複雑な転換には問題に備えて1分余分に取りました。'],
['The club learned that equal schedule blocks can be unfair to tasks that need different amounts of work.','必要な作業量が違うのに同じ時間を割り当てるのは適切でないと学びました。'],
['Measuring each change produced a smoother performance without cutting any scene.','各転換を測ることで場面を削らず、より滑らかな公演になりました。']
]});
add({id:'V11-B08-G2-015',textbook:SS,section:'PROGRAM 8-3',sourceSectionBaselineId:'V10-SS-G2-P8-3-001',title:'The Weather Record from One Corner',level:'STANDARD',targetWordBand:[120,155],rows:[
['A science class recorded temperature beside the school building for five afternoons.','理科のクラスは五日間の午後、校舎横で気温を記録しました。'],
['The numbers suggested that the whole school yard stayed cooler than expected.','数値からは校庭全体が予想より涼しいように見えました。'],
['One student noticed that the thermometer was always placed in a sheltered corner.','一人が温度計をいつも風の当たりにくい角へ置いていたと気づきました。'],
['That corner received little direct sun and almost no warm wind from the playground.','そこは直射日光が少なく、運動場からの暖かい風もほとんど来ませんでした。'],
['The class moved two extra thermometers to an open field and a paved area.','クラスは追加の温度計二つを開けた場所と舗装部分へ置きました。'],
['They took readings at the same times for another five days.','さらに五日間、同じ時刻に測りました。'],
['The open field was usually warmer, and the paved area was warmest on sunny days.','開けた場所はたいてい暖かく、晴れた日は舗装部分が最も高温でした。'],
['The original corner was still useful, but it represented only one condition.','元の角の記録も役立ちますが、一つの条件しか表していませんでした。'],
['Students changed their report to compare locations instead of claiming one temperature for the whole yard.','校庭全体の一つの気温とせず、場所ごとの比較へ報告を直しました。'],
['They added the measurement places to the graph labels.','グラフにも測定場所を記しました。'],
['The class learned that data from one protected corner should not be treated as if it describes every place.','一か所の守られた場所のデータを全地点の代表として扱うべきではないと学びました。']
]});
add({id:'V11-B08-G2-016',textbook:NH,section:'Unit 7-4',sourceSectionBaselineId:'V10-NH-G2-U7-4-001',title:'The Online Form with a Hidden Required Box',level:'STANDARD',targetWordBand:[120,155],rows:[
['The student council tested an online form for signing up for volunteer work.','生徒会はボランティア申込み用オンラインフォームを試しました。'],
['Several students reached the last page but could not submit it.','何人かは最後のページまで進んでも送信できませんでした。'],
['A required phone-contact box was hidden below a long explanation.','必須の電話連絡欄が長い説明の下に隠れていました。'],
['Users had scrolled past it without noticing the small red mark.','利用者は小さな赤印に気づかず通り過ぎていました。'],
['The design team watched three students complete the form from the beginning.','設計チームは三人が最初から入力する様子を見ました。'],
['All three paused at the same error message near the end.','三人とも終盤の同じエラー表示で止まりました。'],
['The team moved the required box beside the other contact fields.','チームは必須欄を他の連絡欄の隣へ移しました。'],
['They also added a short sentence explaining why the information was needed.','その情報が必要な理由も短く説明しました。'],
['Another three students completed the form without missing the field.','別の三人はその欄を見落とさず入力を終えました。'],
['The council kept the new layout and checked it on both phones and computers.','生徒会は新配置を残し、スマホとパソコンの両方で確認しました。'],
['A required item works better when users can see it before an error stops them.','必須項目はエラーで止まる前に利用者が見つけられる方がよいと分かりました。']
]});
add({id:'V11-B08-G2-017',textbook:SS,section:'PROGRAM 8-3',sourceSectionBaselineId:'V10-SS-G2-P8-3-001',title:'The Announcement Heard Differently',level:'STANDARD',targetWordBand:[120,155],rows:[
['The morning announcement included seven club changes, two room numbers, and three reminders in one long message.','朝の放送には七つの部活変更、二つの教室番号、三つの注意が長い一文に入っていました。'],
['Teachers later heard different versions of the information from students.','その後、先生たちは生徒から違う内容を聞きました。'],
['Some remembered the room changes but forgot which clubs they belonged to.','教室変更は覚えていても、どの部活か忘れた人がいました。'],
['Others remembered the club names but mixed up the times.','部活名は覚えていても時刻を取り違えた人もいました。'],
['The broadcasting group asked listeners to write what they had understood.','放送係は聞いた人に理解した内容を書いてもらいました。'],
['The answers showed that too many details had been packed into one sentence.','回答から、一文に情報を詰め込みすぎたと分かりました。'],
['Students divided the message into three short parts: today’s changes, room information, and reminders.','生徒たちは放送を「今日の変更」「教室情報」「注意」の三つに分けました。'],
['They repeated each club name directly before its new room or time.','新しい教室や時刻の直前に部活名を繰り返しました。'],
['The next day, another listening check showed far fewer mistakes.','翌日の確認では間違いが大きく減りました。'],
['The group also posted the same short points on the classroom board.','同じ短い要点を教室の掲示板にも載せました。'],
['They learned that clear order and smaller pieces help listeners keep important details together.','明確な順序と短いまとまりが、重要な情報を正しく結び付ける助けになると学びました。']
]});
window.V11_BATCH08_G2_DRAFTS=passages;window.V11_BATCH08_G2_DRAFT_META={batch:BATCH,count:passages.length,registered:false,stage:'G2_DRAFT_AUTHORING'};
})(typeof window!=='undefined'?window:this);
