(function buildV11Batch06Grade2Draft(){
'use strict';
const BATCH='V11-B06-G2-DRAFT-20260829';
function slash(en){return en.replace(/, /g,', / ').replace(/\b(and|but|because|so|before|after|until|then|when|while|although)\b/gi,'/ $1');}
function wc(rows){return (rows.map(r=>r[0]).join(' ').match(/[A-Za-z]+(?:['’][A-Za-z]+)?/g)||[]).length;}
function build(id,textbook,section,baseline,title,rows,notes){const qs=rows.slice(0,10).map((r,i)=>({prompt:`${i+1}. 本文の第${i+1}文の内容に合う英文を本文から一文答えなさい。`,answer:r[0],evidence:r[0],evidenceJp:r[1],reason:`第${i+1}文が直接の根拠です。`}));return {id,textbook,grade:'2',section,level:'STEP',title,genre:'story',batch:BATCH,sourceSectionBaselineId:baseline,targetWordBand:[115,155],wordCount:wc(rows),sentences:rows.map(r=>r[0]),fullTranslation:rows.map(r=>r[1]).join(''),slashRows:rows.map(r=>({en:slash(r[0]),jp:r[1]})),questions:qs.slice(0,5),questionSetB:qs.slice(5,10),notes:(notes||[]).map(n=>({english:n[0],japanese:n[1],kind:'unlearned_local_required',source:'v11 Batch06 G2 story-specific required note seed'})),semanticRewrite:'BATCH06_G2_STORY_SPECIFIC_20260829',registered:false,auditNote:'Batch06 G2 non-runtime draft; all chronology and final gates still required.'};}
const SS='サンシャイン',NH='ニューホライズン',ssBase='V10-SS-G2-P8-3-001',nhBase='V10-NH-G2-U7-4-001';
const all=[
build('V11-B06-G2-001',SS,'PROGRAM 8-3',ssBase,'The Poster with Too Much Information',[
['Our class made a poster for a weekend music event at school.','私たちのクラスは週末の学校音楽行事のポスターを作りました。'],
['The first version included the time, place, club names, food list, rules, and a long welcome message.','最初の版には時刻、場所、部名、食べ物の一覧、ルール、長い歓迎文を入れました。'],
['We liked the amount of information, but several classmates could not find the starting time quickly.','情報量には満足していましたが、何人かのクラスメートは開始時刻をすぐ見つけられませんでした。'],
['One student even asked where the event would be held although the place was written near the bottom.','場所は下の方に書いてあったのに、行事がどこで行われるかたずねる生徒もいました。'],
['We placed the date, time, and gym name in three large lines at the top.','私たちは日付、時刻、体育館名を上部の大きな三行に置きました。'],
['The food list moved to a smaller card beside the entrance instead of staying on the main poster.','食べ物の一覧はメインポスターから外し、入口横の小さなカードへ移しました。'],
['We shortened the welcome message to one sentence and kept only two important rules.','歓迎文は一文に短くし、重要なルールだけ二つ残しました。'],
['When we showed the new version to another class, everyone found the key details in a few seconds.','新しい版を別のクラスに見せると、全員が数秒で重要情報を見つけました。'],
['The poster became more useful after we decided what readers needed to see first.','読者が最初に見るべきものを決めたことで、ポスターはもっと役立つものになりました。']
],[['key details','重要な情報'],['version','版']]),
build('V11-B06-G2-002',NH,'Unit 7-4',nhBase,'A Reusable Cup Experiment',[
['Our class wanted to know whether reusable cups could reduce daily trash.','私たちのクラスは再利用できるカップで毎日のごみを減らせるか知りたいと思いました。'],
['For one week, two students counted the paper cups used near the water station each day.','一週間、二人の生徒が給水場所の近くで使われた紙コップを毎日数えました。'],
['On Monday and Tuesday, more than forty paper cups were thrown away.','月曜日と火曜日には四十個以上の紙コップが捨てられました。'],
['On Wednesday, we placed clean reusable cups on a tray and added a box for used ones.','水曜日、きれいな再利用カップをトレーに置き、使用済み用の箱も用意しました。'],
['The number of paper cups fell, but some students forgot where to return the reusable cups.','紙コップの数は減りましたが、再利用カップの返却場所を忘れる生徒もいました。'],
['We added a large return sign beside the water station the next morning.','翌朝、給水場所の横に大きな返却表示を付けました。'],
['By Friday, most reusable cups came back to the box after use.','金曜日までには、ほとんどの再利用カップが使用後に箱へ戻りました。'],
['Our record showed that the new routine worked better when the return step was clear.','記録から、返却の手順が分かりやすいと新しい方法がよりうまくいくと分かりました。'],
['We kept the cups and the sign for the following week.','私たちは翌週もそのカップと表示を使い続けました。']
],[['reusable','再利用できる'],['reduce','減らす'],['routine','決まったやり方']]),
build('V11-B06-G2-003',SS,'PROGRAM 8-3',ssBase,'The Interview That Changed the Article',[
['Rina wrote a short article about a charity run for the school newspaper.','リナは学校新聞のためにチャリティーランの記事を書きました。'],
['She first heard about the event from two friends who had watched it from the school gate.','彼女は最初、校門から見ていた二人の友達からその行事について聞きました。'],
['Her draft said that the runners had chosen the route because it was easy and flat.','下書きには、走者たちが道を簡単で平らだから選んだと書きました。'],
['Before printing the article, she interviewed the student who had planned the route.','記事を印刷する前に、彼女は道順を計画した生徒にインタビューしました。'],
['He explained that the route was chosen mainly because volunteers could watch every crossing safely.','彼は、主にボランティアがすべての交差点を安全に見守れるため、その道を選んだと説明しました。'],
['He also showed Rina a map with the volunteer positions marked on it.','彼はボランティアの位置を記した地図もリナに見せました。'],
['Rina changed the article and added the safety reason instead of repeating the first guess.','リナは記事を直し、最初の推測を繰り返す代わりに安全上の理由を加えました。'],
['She kept one sentence about the flat road, but made it clear that it was only another benefit.','平らな道についての一文は残しましたが、それは別の利点にすぎないと分かるようにしました。'],
['The direct interview made the final article more accurate than the first version.','直接のインタビューによって、最終記事は最初の版より正確になりました。']
],[['charity run','チャリティーラン'],['accurate','正確な'],['crossing','交差点']]),
build('V11-B06-G2-004',NH,'Unit 7-4',nhBase,'The Shorter Route Was Slower',[
['Nao and Jun wanted to find the fastest walk from school to the community center.','ナオとジュンは学校から公民館まで最も速く歩ける道を探したいと思いました。'],
['The map showed a short route through several narrow streets and a longer route along a main road.','地図には細い道を通る短い道と、大通り沿いの長い道がありました。'],
['They expected the short route to take less time, so Nao tried it first.','二人は短い道の方が時間がかからないと思い、ナオが先に試しました。'],
['She had to wait at two busy crossings and slow down beside many parked bicycles.','彼女は二つの混んだ交差点で待ち、多くの駐輪自転車のそばで速度を落とす必要がありました。'],
['Jun used the longer road, which had wide sidewalks and only one traffic light.','ジュンは広い歩道と一つだけの信号がある長い道を使いました。'],
['He arrived three minutes before Nao even though he had walked farther.','彼はより長く歩いたのに、ナオより三分早く着きました。'],
['The next day they changed routes and got almost the same result.','翌日二人は道を入れ替え、ほぼ同じ結果になりました。'],
['They learned that distance was important, but waiting time and walking conditions mattered too.','距離は重要ですが、待ち時間や歩きやすさも関係すると分かりました。'],
['Their final map marked both distance and usual travel time.','二人の最終地図には距離と普段の所要時間の両方を記しました。']
],[['sidewalk','歩道'],['travel time','所要時間']]),
build('V11-B06-G2-005',SS,'PROGRAM 8-3',ssBase,'The Club Room Noise Plan',[
['The brass band practiced beside the art club room every Thursday after school.','吹奏楽部は毎週木曜日の放課後、美術部の部屋の隣で練習していました。'],
['The music was not a problem during most art activities, but it became difficult during short drawing talks.','音楽は普段の美術活動では問題ありませんでしたが、短い説明の時間には困ることがありました。'],
['At the same time, the band needed twenty quiet minutes at the start to listen to the teacher.','一方、吹奏楽部も最初に先生の話を聞くため二十分の静かな時間が必要でした。'],
['Members from both clubs met instead of simply asking the other group to be quieter.','両部の部員は、ただ相手に静かにしてほしいと頼むのではなく話し合いました。'],
['The art club explained that its talk usually began at four ten and lasted fifteen minutes.','美術部は説明が通常四時十分に始まり十五分続くと説明しました。'],
['The band said its listening time was from three forty to four o’clock.','吹奏楽部は聞く時間が三時四十分から四時までだと言いました。'],
['Because the two quiet periods did not overlap, they wrote both times on a shared schedule.','二つの静かな時間は重ならなかったので、共有予定表に両方の時間を書きました。'],
['The band moved its loudest practice until after the art talk on Thursdays.','吹奏楽部は木曜日の最も大きな音の練習を美術部の説明後に移しました。'],
['A clear schedule solved the problem without stopping either club from practicing.','分かりやすい予定表で、どちらの部の練習も止めずに問題を解決できました。']
],[['overlap','重なる'],['shared schedule','共有予定表']]),
build('V11-B06-G2-006',NH,'Unit 7-4',nhBase,'A Book Exchange with One Rule',[
['Our class started a small book exchange by placing twenty books on a table.','私たちのクラスは机に二十冊の本を置き、小さな本の交換会を始めました。'],
['The idea was simple: anyone could bring one book and take another one home.','仕組みは簡単で、一冊持ってきた人が別の一冊を持ち帰れるものでした。'],
['During the first lunch break, several students took books before putting their own books on the table.','最初の昼休みには、自分の本を置く前に本を持っていく生徒が何人かいました。'],
['Others could not tell which books were still part of the exchange and which belonged to students nearby.','どの本が交換用で、どれが近くの生徒の持ち物か分からなくなる人もいました。'],
['We did not want to create a long list of rules.','私たちは長いルール一覧を作りたくありませんでした。'],
['Instead, we added one rule: place your book in the blue box before choosing another book.','代わりに「別の本を選ぶ前に自分の本を青い箱に入れる」という一つのルールを加えました。'],
['A student moved books from the box to the exchange table every afternoon.','毎日午後、一人の生徒が箱から交換机へ本を移しました。'],
['After that, everyone could see which books were ready to be exchanged.','それからは、どの本が交換できるものか全員に分かるようになりました。'],
['One clear step made the exchange easier without making it strict or complicated.','一つの明確な手順で、厳しく複雑にせず交換会を分かりやすくできました。']
],[['exchange','交換'],['complicated','複雑な']]),
build('V11-B06-G2-007',SS,'PROGRAM 8-3',ssBase,'The Weather Board Question',[
['Our class kept a weather board beside the window for two weeks.','私たちのクラスは二週間、窓のそばに天気記録板を置きました。'],
['Every noon, one student wrote the temperature, clouds, and wind that we could observe from school.','毎日正午、一人の生徒が学校から観察できる気温、雲、風を書きました。'],
['On Tuesday morning, the forecast said that the afternoon would be sunny.','火曜日の朝、予報では午後は晴れるとなっていました。'],
['However, our noon record showed thick clouds and a strong wind.','しかし、正午の記録には厚い雲と強い風がありました。'],
['Some students said the forecast had been wrong, but our teacher asked us to check the time carefully.','予報が外れたと言う生徒もいましたが、先生は時刻をよく確認するよう言いました。'],
['The forecast described the whole afternoon, while our board showed only what we saw at noon.','予報は午後全体を表し、私たちの記録板は正午に見たものだけを表していました。'],
['At three o’clock, the clouds moved away and sunlight reached the playground.','三時には雲が移動し、日光が校庭に届きました。'],
['We added exact observation times to the board after that day.','その日以降、私たちは記録板に正確な観察時刻も加えました。'],
['Comparing records became easier when each piece of information included its time.','それぞれの情報に時刻を付けると、記録を比べやすくなりました。']
],[['forecast','天気予報'],['observation','観察']]),
build('V11-B06-G2-008',NH,'Unit 7-4',nhBase,'The Museum Audio Choice',[
['Mio and Haru visited a history museum during a school trip.','ミオとハルは校外学習で歴史博物館を訪れました。'],
['At the entrance, visitors could choose an audio guide or a short printed guide.','入口では音声ガイドか短い印刷ガイドを選べました。'],
['Mio chose the audio guide because she liked hearing stories while looking at objects.','ミオは展示物を見ながら話を聞くのが好きなので音声ガイドを選びました。'],
['Haru chose the printed guide because he wanted to move at his own speed and reread important lines.','ハルは自分の速さで進み、重要な文を読み返したかったので印刷ガイドを選びました。'],
['Mio learned a detailed story about the family that had owned an old clock.','ミオは古い時計を持っていた家族について詳しい話を知りました。'],
['Haru noticed the dates beside three tools because they were easy to compare on the page.','ハルはページ上で比べやすかったので、三つの道具の横の日付に気づきました。'],
['At lunch, they told each other what had stood out during the visit.','昼食時、二人は見学で特に印象に残ったことを話し合いました。'],
['They realized that neither guide was better for every purpose.','どちらのガイドもすべての目的で優れているわけではないと気づきました。'],
['The different methods had helped them notice different kinds of information.','異なる方法が、それぞれ違う種類の情報に気づく助けになっていました。']
],[['audio guide','音声ガイド'],['printed guide','印刷ガイド']]),
build('V11-B06-G2-009',SS,'PROGRAM 8-3',ssBase,'The Empty Space in the School Paper',[
['The school newspaper team finished almost every page two days before printing.','学校新聞チームは印刷の二日前にほとんどのページを完成させました。'],
['Then one planned article was canceled because its event had been moved to the next month.','その後、予定されていた行事が翌月へ移ったため、一つの記事が中止になりました。'],
['The change left a large empty space on the last page.','その変更で最終ページに大きな空白ができました。'],
['At first, someone suggested filling it with a large picture that had no connection to the other stories.','最初、ほかの記事と関係のない大きな写真で埋める案が出ました。'],
['Another editor remembered that new students often asked where to borrow sports equipment.','別の編集者は、新入生が運動用具をどこで借りるかよくたずねることを思い出しました。'],
['The team made a small guide showing the office, opening times, and three steps for borrowing items.','チームは事務室、利用時間、借りるための三つの手順を示す小さな案内を作りました。'],
['They checked the information with a teacher before sending the page to print.','印刷へ送る前に先生に情報を確認しました。'],
['Several students used the guide during the following week.','翌週、何人もの生徒がその案内を利用しました。'],
['The unexpected space became useful because the editors chose information readers actually needed.','編集者が読者に本当に必要な情報を選んだことで、予想外の空白が役立つものになりました。']
],[['editor','編集者'],['equipment','用具']]),
build('V11-B06-G2-010',NH,'Unit 7-4',nhBase,'A Lunch Survey with a Surprise',[
['Our class predicted that curry would be the most popular school lunch.','私たちのクラスはカレーが最も人気の給食だと予想しました。'],
['We wrote one survey question and asked thirty students during lunch break.','一つのアンケート質問を作り、昼休みに三十人の生徒へたずねました。'],
['To our surprise, bread and soup received more votes than curry.','驚いたことに、パンとスープがカレーより多くの票を得ました。'],
['Some classmates thought our prediction had simply been wrong.','何人かは私たちの予想が単に間違っていたと思いました。'],
['Then Aya read the question again: “Which lunch do you want on a cold day?”','そこでアヤが「寒い日にどの給食がほしいですか」という質問を読み直しました。'],
['The words “on a cold day” may have made warm soup sound especially attractive.','「寒い日に」という言葉が温かいスープを特に魅力的に感じさせた可能性がありました。'],
['The next day, we asked another group only, “Which school lunch do you like best?”','翌日、別のグループに「どの給食が一番好きですか」とだけたずねました。'],
['This time curry received the most votes, although the difference was small.','今回は差は小さかったものの、カレーが最も多くの票を得ました。'],
['We learned that the wording of a question can change what a survey seems to show.','質問の言い方でアンケートが示すように見える結果が変わることを学びました。']
],[['survey','アンケート'],['wording','言い方'],['vote','票']]),
build('V11-B06-G2-011',SS,'PROGRAM 8-3',ssBase,'The Bicycle Light Check',[
['In late autumn, our sports club often finished practice close to sunset.','晩秋、私たちの運動部は日没近くまで練習することがよくありました。'],
['One evening, we noticed that several bicycles near the gate were difficult to see from a distance.','ある夕方、門の近くの何台かの自転車が遠くから見えにくいことに気づきました。'],
['The next day, club members checked their front lights before riding home.','翌日、部員たちは帰宅前に自転車の前照灯を確認しました。'],
['Two lights did not turn on, and one light was pointed too far down.','二つは点灯せず、一つは下向きすぎていました。'],
['We did not try to repair electrical parts ourselves.','私たちは電気部品を自分たちで修理しようとはしませんでした。'],
['The students with broken lights called home and walked their bicycles instead.','ライトが壊れていた生徒は家へ連絡し、自転車を押して帰りました。'],
['A teacher helped the third student adjust the direction of the working light.','先生が三人目の生徒の点灯するライトの向きを調整するのを手伝いました。'],
['We added a monthly light check to the club safety list.','私たちは部の安全確認表に月一回のライト点検を加えました。'],
['A five-minute check made a problem visible before anyone had to ride in the dark.','五分の確認で、だれかが暗い中を走る前に問題を見つけられました。']
],[['sunset','日没'],['adjust','調整する']]),
build('V11-B06-G2-012',NH,'Unit 7-4',nhBase,'The Two-Minute Presentation',[
['Kota prepared a presentation about a local sports center for English class.','コウタは英語の授業で地域のスポーツセンターについて発表を準備しました。'],
['His first practice lasted nearly four minutes, but the class limit was only two.','最初の練習は四分近くかかりましたが、授業の制限は二分でした。'],
['He had included the building history, every activity, opening times, prices, and his own memories.','彼は建物の歴史、すべての活動、利用時間、料金、自分の思い出まで入れていました。'],
['Instead of speaking twice as fast, he wrote his main message at the top of the page.','二倍の速さで話すのではなく、紙の上に中心となるメッセージを書きました。'],
['He wanted classmates to know why the center was useful for both young people and older residents.','その施設が若者にも年配の住民にも役立つ理由を知ってほしかったのです。'],
['He kept one example for each group and removed most of the history and price details.','それぞれのグループの例を一つ残し、歴史や料金の細かい内容の大部分を削りました。'],
['The second practice took two minutes and five seconds.','二回目の練習は二分五秒でした。'],
['After shortening one final example, he finished exactly within the time limit.','最後の例を一つ短くしたあと、制限時間内にちょうど終えられました。'],
['Cutting information made the central message clearer instead of weaker.','情報を削ることで、中心メッセージは弱くなるのではなく、より明確になりました。']
],[['time limit','制限時間'],['central message','中心となるメッセージ']]),
build('V11-B06-G2-013',SS,'PROGRAM 8-3',ssBase,'The Community Board Translation',[
['Our class helped make a short notice for a community sports day.','私たちのクラスは地域のスポーツデーの短い案内作りを手伝いました。'],
['The first English version copied almost every sentence from the long Japanese notice.','最初の英語版は長い日本語案内のほとんどすべての文を写す形になっていました。'],
['It explained the history of the event before giving the date and meeting place.','日付や集合場所より先に行事の歴史を説明していました。'],
['Two exchange students read it and said they understood the words but could not quickly find what to do.','二人の留学生は単語は分かるが、何をすべきかすぐ見つけられないと言いました。'],
['We moved the date, time, place, and “bring indoor shoes” message to the top.','日付、時刻、場所、「上履きを持参」の内容を上に移しました。'],
['We changed several long sentences into short instructions and removed details that visitors did not need at the entrance.','いくつかの長文を短い指示に変え、入口で来場者に不要な細部を削りました。'],
['The Japanese notice stayed complete, while the English board focused on actions and key facts.','日本語案内は完全なまま残し、英語掲示は行動と重要事項に絞りました。'],
['The exchange students checked the new version and found the meeting information immediately.','留学生が新しい版を確認すると、集合情報をすぐ見つけられました。'],
['We learned that useful translation sometimes requires choosing information, not only changing words.','役立つ翻訳には単に言葉を変えるだけでなく、情報を選ぶことも必要だと学びました。']
],[['notice','案内'],['instruction','指示']]),
build('V11-B06-G2-014',NH,'Unit 7-4',nhBase,'The Forgotten Rehearsal Room',[
['Our drama group reserved a classroom for rehearsal after school on Wednesday.','私たちの演劇グループは水曜日の放課後、練習のため教室を予約しました。'],
['When we arrived, a science team was already using the room for a meeting.','着いてみると、科学班がすでにその部屋を会議に使っていました。'],
['Both groups believed that they had the correct reservation.','どちらのグループも自分たちの予約が正しいと思っていました。'],
['Instead of arguing, we checked the schedule posted outside the staff room.','言い争う代わりに、職員室の外に掲示された予定表を確認しました。'],
['The science team had the room from three thirty to four, and our rehearsal started at four.','科学班は三時半から四時までで、私たちの練習は四時開始でした。'],
['Our group had arrived twenty minutes early because we wanted extra practice.','私たちは追加練習をしたくて二十分早く来ていたのです。'],
['The science team offered one corner for quiet script reading until its meeting ended.','科学班は会議が終わるまで静かな台本読みのため部屋の一角を使わせてくれました。'],
['At four, they left and we moved the chairs for rehearsal.','四時に彼らが出て、私たちは練習用に椅子を動かしました。'],
['Checking the exact times turned an apparent room conflict into a simple sharing problem.','正確な時刻を確認すると、部屋の衝突に見えた問題は簡単な共有の問題だと分かりました。']
],[['rehearsal','練習'],['reservation','予約'],['conflict','衝突']]),
build('V11-B06-G2-015',SS,'PROGRAM 8-3',ssBase,'The Donation Box Count',[
['Students collected coins for an animal shelter during the school festival.','生徒たちは学校祭で動物保護施設のために硬貨を集めました。'],
['After the festival, two pairs counted the same donation box separately.','祭りのあと、二組が同じ募金箱を別々に数えました。'],
['One pair recorded 18,640 yen, while the other recorded 18,540 yen.','一組は18,640円、もう一組は18,540円と記録しました。'],
['Nobody wanted to report a total until they understood the one-hundred-yen difference.','だれも百円の差の理由が分かるまで合計を報告したくありませんでした。'],
['They counted again and found that one pair had placed a one-hundred-yen coin with the fifty-yen coins.','もう一度数えると、一組が百円玉を五十円玉のところに置いていたと分かりました。'],
['The mixed piles also made it difficult to check the numbers afterward.','硬貨が混じった山ではあとから数字を確認しにくくなりました。'],
['For the second box, they used separate trays for each kind of coin and wrote each subtotal immediately.','二つ目の箱では硬貨の種類ごとに別のトレーを使い、小計をすぐ書きました。'],
['Both pairs got the same total on their first count.','両組は最初の計算で同じ合計になりました。'],
['A clearer counting method made the final report easier to trust.','より明確な数え方で、最終報告を信頼しやすくできました。']
],[['donation box','募金箱'],['subtotal','小計']]),
build('V11-B06-G2-016',NH,'Unit 7-4',nhBase,'The Park Bench Observation',[
['Our class discussed whether the small park near school needed more benches.','私たちのクラスは学校近くの小さな公園にベンチを増やす必要があるか話し合いました。'],
['Most of us imagined that older people used the benches mainly in the morning.','私たちの多くは、主に朝に年配の人がベンチを使うと考えていました。'],
['Four students observed the park for fifteen minutes at different times over three days.','四人の生徒が三日間、異なる時刻に十五分ずつ公園を観察しました。'],
['In the morning, two benches were often empty except for one person walking a dog.','朝は犬を散歩させる一人を除き、二つのベンチは空いていることが多くありました。'],
['After school, however, parents with small children and students used every bench.','しかし放課後には、小さな子ども連れの保護者や生徒がすべてのベンチを使っていました。'],
['Near sunset, several people stopped briefly while carrying shopping bags.','日没近くには、買い物袋を持つ人が何人か短時間休んでいました。'],
['Our first idea about the main users had been too simple.','主な利用者についての最初の考えは単純すぎました。'],
['We made a chart showing both the time and the different kinds of park users.','時刻とさまざまな利用者の両方を示す表を作りました。'],
['The observation changed our discussion from guesses about age to evidence about when seats were actually full.','観察によって、年齢の推測から実際に席が満席になる時刻の証拠へ話し合いが変わりました。']
],[['observe','観察する'],['evidence','根拠']]),
build('V11-B06-G2-017',SS,'PROGRAM 8-3',ssBase,'The Recipe Test Without a Picture',[
['Our cooking club wrote a simple pancake recipe for younger students.','料理部は年下の生徒向けに簡単なパンケーキの作り方を書きました。'],
['The first version had no pictures because we wanted to see whether the written instructions were clear by themselves.','最初の版には写真を入れず、文章だけで指示が明確か確かめたかったのです。'],
['Another group followed the recipe without asking us any questions.','別のグループが私たちに質問せず作り方に従いました。'],
['They mixed the flour and milk correctly, but stopped after reading “add the egg and mix again.”','小麦粉と牛乳は正しく混ぜましたが、「卵を加えてもう一度混ぜる」を読んで止まりました。'],
['They could not tell whether the egg should be mixed in a separate bowl first.','卵を先に別のボウルで混ぜるべきか分かりませんでした。'],
['Our original team had always done that step automatically, so nobody had written it down.','元のチームはいつもその手順を当然のようにしていたので、だれも書いていませんでした。'],
['We changed the line to “break the egg into a small bowl, mix it, and then add it.”','その文を「卵を小さなボウルに割り、混ぜてから加える」に変えました。'],
['A second group completed the recipe without stopping at that step.','二つ目のグループはその手順で止まらず作り終えました。'],
['Testing the instructions showed us a missing step that the writers had not noticed.','指示を試してもらうことで、書いた側が気づかなかった抜けた手順が分かりました。']
],[['recipe','作り方'],['instruction','指示'],['flour','小麦粉']])
];
window.V11_BATCH06_G2_PASSAGES=all;
window.V11_BATCH06_PASSAGES=[...(window.V11_BATCH06_PASSAGES||[]),...all];
})();