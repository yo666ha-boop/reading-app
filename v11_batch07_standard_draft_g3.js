(function buildV11Batch07StandardDrafts(){
'use strict';
const BATCH='V11-B07-STANDARD-DRAFT-20260829';
const SS='サンシャイン',NH='ニューホライズン';
function wc(rows){return (rows.map(r=>r[0]).join(' ').match(/[A-Za-z]+(?:['’][A-Za-z]+)?/g)||[]).length;}
function q(type,prompt,answer,evidence,evidenceJp,reason,extra){return Object.assign({questionType:type,prompt,answer,evidence,evidenceJp,reason},extra||{});}
function build(o){return Object.assign({grade:'3',level:'STANDARD',genre:'reading',batch:BATCH,targetWordBand:[150,230],wordCount:wc(o.rows),sentences:o.rows.map(r=>r[0]),fullTranslation:o.rows.map(r=>r[1]).join(''),slashRows:o.rows.map(r=>({en:r[0],jp:r[1]})),registered:false,semanticRewrite:'BATCH07_STANDARD_ORIGINAL_20260829'},o,{rows:undefined});}
const passages=[];

passages.push(build({id:'V11-B07-G3-002',textbook:NH,section:'Unit 6-4',sourceSectionBaselineId:'V10-NH-G3-U6-4-001',title:'The Volunteer Form People Skipped',
rows:[
['Our town library needed volunteers for a weekend reading event.','町の図書館は週末の読み聞かせ行事のボランティアを必要としていました。'],
['Twenty-eight people opened the online application, but only eleven finished it.','二十八人がオンライン申込書を開きましたが、最後まで終えたのは十一人だけでした。'],
['The organizers first thought people had simply changed their minds.','主催者は最初、応募者が単に気持ちを変えたのだと思いました。'],
['Then they checked where people usually left the form.','そこで、どこで入力をやめる人が多いのか確認しました。'],
['Most people stopped at a long question asking them to describe every volunteer activity they had done before.','多くの人は、過去のすべてのボランティア経験を説明する長い質問のところで止まっていました。'],
['That information was interesting, but it was not necessary for helping at a two-hour event.','その情報は興味深いものでしたが、二時間の行事を手伝うために必要なものではありませんでした。'],
['The form also asked for a home address even though organizers only needed an email address and an emergency phone number.','また、主催者に必要なのはメールアドレスと緊急連絡先だけなのに、自宅住所まで求めていました。'],
['The team rewrote the form with six short required questions and made past experience optional.','チームは必須質問を短い六問に書き直し、過去の経験は任意にしました。'],
['They also explained why each piece of contact information was needed.','さらに、それぞれの連絡情報がなぜ必要なのか説明を付けました。'],
['During the next week, thirty people opened the new form and twenty-six completed it.','翌週には三十人が新しい申込書を開き、二十六人が完了しました。'],
['The event did not lower its safety rules or accept unprepared volunteers.','行事は安全上のルールを緩めたり、準備のできていない人を受け入れたりしたわけではありません。'],
['It simply stopped asking for information that was not needed at the first step.','最初の段階で必要のない情報を求めるのをやめただけでした。'],
['The organizers learned that a form can lose good applicants when every possible question is treated as essential.','主催者は、考えられる質問をすべて必須にすると、よい応募者を失うことがあると学びました。'],
['A useful form asks enough to make a safe decision, but not so much that people cannot see why they are being asked.','役に立つ申込書は安全に判断するため十分な情報を求めつつ、何のための質問か分からなくなるほど多く求めないものです。']
],
questions:[
q('GIST','本文の中心内容を答えなさい。','必要以上の質問が応募を妨げていたため、必要情報に絞って申込書を改善したこと。','The organizers learned that a form can lose good applicants when every possible question is treated as essential.','主催者は、考えられる質問をすべて必須にすると、よい応募者を失うことがあると学びました。','改善の学びをまとめています。'),
q('DETAIL','最初の申込書を最後まで終えた人は何人ですか。','11','Twenty-eight people opened the online application, but only eleven finished it.','二十八人がオンライン申込書を開きましたが、最後まで終えたのは十一人だけでした。','人数が直接示されています。'),
q('REASON','過去の全ボランティア経験を必須にしなくなったのはなぜですか。','二時間の行事を手伝うための最初の判断には必要な情報ではなかったから。','That information was interesting, but it was not necessary for helping at a two-hour event.','その情報は興味深いものでしたが、二時間の行事を手伝うために必要なものではありませんでした。','不要な必須項目だったことが理由です。'),
q('CONTENT_MATCH','本文の内容に合うものを選びなさい。','The new form still kept necessary safety information.','The event did not lower its safety rules or accept unprepared volunteers.','行事は安全上のルールを緩めたり、準備のできていない人を受け入れたりしたわけではありません。','短くしても安全基準は下げていません。'),
q('DETAIL','新しい申込書を完了した人は何人ですか。','26','During the next week, thirty people opened the new form and twenty-six completed it.','翌週には三十人が新しい申込書を開き、二十六人が完了しました。','人数が直接示されています。')
],
questionSetB:[
q('INFERENCE','新しい申込書の完了者が増えた主な理由として何が考えられますか。','必要のない長い必須質問を減らし、情報を求める理由も分かりやすくしたから。',['The team rewrote the form with six short required questions and made past experience optional.','They also explained why each piece of contact information was needed.'],['チームは必須質問を短い六問に書き直し、過去の経験は任意にしました。','さらに、それぞれの連絡情報がなぜ必要なのか説明を付けました。'],'変更内容と完了率の改善から推論できます。'),
q('SENTENCE_INSERTION','“That made the team question whether the form was asking too much too early.” を入れるなら最も自然な位置を答えなさい。','多くの人が長い経験質問で止まったと述べた文の直後。','Most people stopped at a long question asking them to describe every volunteer activity they had done before.','多くの人は、過去のすべてのボランティア経験を説明する長い質問のところで止まっていました。','That は直前の離脱地点を受け、その質問の必要性を検討する流れにつながります。',{insertAfterSentence:5}),
q('CONTEXT_WORD','本文の意味に合うように o で始まる1語を入れなさい: “Past volunteer experience became _____ instead of required.”','optional','The team rewrote the form with six short required questions and made past experience optional.','チームは必須質問を短い六問に書き直し、過去の経験は任意にしました。','required の反対として optional が本文にあります。'),
q('SUMMARY_FILL','まとめの空所を補いなさい: “The team removed information that was not _____ at the first step.”','needed','It simply stopped asking for information that was not needed at the first step.','最初の段階で必要のない情報を求めるのをやめただけでした。','本文のまとめ表現です。'),
q('CONTENT_MATCH','主催者が連絡情報を求める理由を説明した目的として最も適切なものを答えなさい。','応募者がその情報の必要性を理解できるようにするため。','They also explained why each piece of contact information was needed.','さらに、それぞれの連絡情報がなぜ必要なのか説明を付けました。','why以下の内容から目的を判断できます。')
],notes:[['application','申込書'],['optional','任意の'],['essential','必要不可欠な'],['applicant','応募者']] }));

passages.push(build({id:'V11-B07-G3-005',textbook:SS,section:'PROGRAM 7-3',sourceSectionBaselineId:'V10-SS-G3-P7-3-001',title:'The Cleanup Day with the Wrong Focus',
rows:[
['Our class joined a monthly cleanup around a small river park.','私たちのクラスは小さな川沿いの公園で毎月行う清掃に参加しました。'],
['Most volunteers began near the main entrance because litter there was easy to see and collect.','多くのボランティアは、ごみが見つけやすく拾いやすい正面入口付近から始めました。'],
['After an hour, the entrance looked very clean, and everyone felt successful.','一時間後、入口はとてもきれいになり、みんな達成感を持ちました。'],
['A student named Mei suggested counting litter in every area before the next cleanup.','芽衣さんは次回の清掃前に各場所のごみを数えることを提案しました。'],
['The class divided the park into four zones and counted visible pieces without picking them up.','クラスは公園を四つの区域に分け、拾わずに見えるごみの数を数えました。'],
['The entrance had twelve pieces, the playground had nineteen, and the riverside path had forty-six.','入口には十二個、遊び場には十九個、川沿いの道には四十六個ありました。'],
['The area we cleaned first every month was not the area with the largest problem.','毎月最初に清掃していた場所は、最も問題が大きい場所ではありませんでした。'],
['The riverside path was farther from the meeting point and had wet leaves around some litter, so volunteers often reached it late.','川沿いの道は集合場所から遠く、ごみの周りにぬれた葉がある所もあり、ボランティアはそこへ遅く着くことがよくありました。'],
['For the next cleanup, we assigned groups to zones before anyone began.','次回は、清掃を始める前に班ごとの担当区域を決めました。'],
['We also gave the riverside group gloves and bags that were better for wet ground.','川沿い担当には、ぬれた地面に合う手袋と袋も用意しました。'],
['At the end, every zone had been cleaned instead of only the easiest places.','最後には、簡単な場所だけでなくすべての区域が清掃されていました。'],
['The entrance still mattered, but it no longer received most of our time simply because it was convenient.','入口も大切ですが、便利だからというだけで作業時間の大部分を使うことはなくなりました。'],
['We learned that visible progress can feel satisfying without showing where help is needed most.','目に見える成果は満足感を与えても、最も助けが必要な場所を示すとは限らないと学びました。'],
['A simple count helped us put effort where the problem was larger.','単純な数の記録によって、より問題の大きい場所へ力を向けられました。']
],
questions:[
q('GIST','本文の中心内容を答えなさい。','清掃しやすい場所だけでなく、ごみの数を調べて問題が大きい場所へ作業を配分したこと。','A simple count helped us put effort where the problem was larger.','単純な数の記録によって、より問題の大きい場所へ力を向けられました。','最後の文が改善方法をまとめています。'),
q('DETAIL','川沿いの道には見えるごみが何個ありましたか。','46','The entrance had twelve pieces, the playground had nineteen, and the riverside path had forty-six.','入口には十二個、遊び場には十九個、川沿いの道には四十六個ありました。','数が直接示されています。'),
q('REASON','川沿いの道が後回しになりやすかった理由は何ですか。','集合場所から遠く、ぬれた葉の周りにごみがあるなど作業しにくかったから。','The riverside path was farther from the meeting point and had wet leaves around some litter, so volunteers often reached it late.','川沿いの道は集合場所から遠く、ごみの周りにぬれた葉がある所もあり、ボランティアはそこへ遅く着くことがよくありました。','距離と作業条件が理由です。'),
q('CONTENT_MATCH','本文の内容に合うものを選びなさい。','The entrance was cleaner partly because volunteers usually started there.','Most volunteers began near the main entrance because litter there was easy to see and collect.','多くのボランティアは、ごみが見つけやすく拾いやすい正面入口付近から始めました。','毎回最初に作業する場所だったことが分かります。'),
q('DETAIL','次回の清掃前にクラスがしたことは何ですか。','They assigned groups to zones before starting.','For the next cleanup, we assigned groups to zones before anyone began.','次回は、清掃を始める前に班ごとの担当区域を決めました。','改善行動が直接示されています。')
],
questionSetB:[
q('INFERENCE','清掃後の見た目だけで成功を判断すると何を見落とす可能性がありますか。','清掃しやすい場所だけがきれいになり、本当にごみが多い場所が残っていること。',['The area we cleaned first every month was not the area with the largest problem.','We learned that visible progress can feel satisfying without showing where help is needed most.'],['毎月最初に清掃していた場所は、最も問題が大きい場所ではありませんでした。','目に見える成果は満足感を与えても、最も助けが必要な場所を示すとは限らないと学びました。'],'見た目の成果と問題の大きさが一致しないことから推論できます。'),
q('SENTENCE_INSERTION','“The numbers changed our idea of where to begin.” を入れるなら最も自然な位置を答えなさい。','四つの区域のごみ数を示した文の直後。','The entrance had twelve pieces, the playground had nineteen, and the riverside path had forty-six.','入口には十二個、遊び場には十九個、川沿いの道には四十六個ありました。','numbers は直前の比較を受け、次の「最大問題ではなかった」という判断につながります。',{insertAfterSentence:6}),
q('CONTEXT_WORD','本文の意味に合うように z で始まる1語を入れなさい: “The park was divided into four _____ for counting.”','zones','The class divided the park into four zones and counted visible pieces without picking them up.','クラスは公園を四つの区域に分け、拾わずに見えるごみの数を数えました。','本文の語 zones がそのまま合います。'),
q('SUMMARY_FILL','まとめの空所を補いなさい: “The class used a simple _____ to decide where more effort was needed.”','count','A simple count helped us put effort where the problem was larger.','単純な数の記録によって、より問題の大きい場所へ力を向けられました。','改善の根拠となった方法です。'),
q('CONTENT_MATCH','川沿い担当に別の手袋と袋を渡した理由として最も適切なものを答えなさい。','ぬれた地面での作業に合う道具が必要だったから。','We also gave the riverside group gloves and bags that were better for wet ground.','川沿い担当には、ぬれた地面に合う手袋と袋も用意しました。','道具を変えた理由が本文に示されています。')
],notes:[['zone','区域'],['riverside','川沿い'],['visible','見える'],['effort','努力・力']] }));

passages.push(build({id:'V11-B07-G3-007',textbook:SS,section:'PROGRAM 7-3',sourceSectionBaselineId:'V10-SS-G3-P7-3-001',title:'The Empty Lot Community Vote',
rows:[
['There was an empty town lot beside our community center.','地域センターの横に町の空き地がありました。'],
['The town planned to use it for one year before a new building project began.','新しい建物の工事が始まるまでの一年間、その土地を使う計画が立てられました。'],
['A student group collected ideas and held an online vote.','生徒のグループが案を集め、オンライン投票を行いました。'],
['A weekend market received the most votes, followed by a small sports space and a community garden.','週末市場が最多票で、小さな運動場所、共同菜園が続きました。'],
['At first, the group wanted to choose the market immediately.','最初、グループはすぐに市場を選ぼうとしました。'],
['A center worker asked them to compare what each idea would require.','センター職員は、それぞれの案に何が必要か比べるよう求めました。'],
['The market could serve many people, but it needed parking control and could create noise every weekend.','市場は多くの人が利用できますが、駐車管理が必要で毎週末に騒音が出る可能性がありました。'],
['The sports space needed little setup, but nearby residents worried about balls reaching the road.','運動場所は準備が少なくて済みますが、近隣住民はボールが道路へ出ることを心配しました。'],
['The garden was quieter, but one year was a short time for some plants.','菜園は静かですが、一年では一部の植物には短い期間でした。'],
['The group realized that popularity answered only one question: what people liked at first.','グループは、人気投票が答えるのは「最初に何を好むか」という一つの問いだけだと気づきました。'],
['They added three conditions: safety, cost, and whether the idea could be removed easily after one year.','そこで、安全、費用、一年後に簡単に撤去できるかという三つの条件を加えました。'],
['After comparing the ideas again, they proposed a small weekend market twice a month with a clear parking plan.','再比較のあと、明確な駐車計画を付けて月二回の小規模な週末市場を提案しました。'],
['On other weekends, the lot would remain open for simple community activities.','それ以外の週末は、簡単な地域活動に使えるよう空けておくことにしました。'],
['The final proposal was still based on the most popular idea, but it was changed to fit the limits of the place.','最終案は最も人気の案をもとにしていましたが、その場所の条件に合うよう変更されていました。'],
['The group learned that a vote can start a decision, but it does not always finish one.','投票は決定の出発点にはなっても、それだけで決定が終わるとは限らないと学びました。']
],
questions:[
q('GIST','本文の中心内容を答えなさい。','人気投票だけで決めず、安全・費用・期間などの条件も比べて案を調整したこと。','The group learned that a vote can start a decision, but it does not always finish one.','投票は決定の出発点にはなっても、それだけで決定が終わるとは限らないと学びました。','投票と最終判断の違いをまとめています。'),
q('DETAIL','オンライン投票で最も多く票を得た案は何ですか。','a weekend market','A weekend market received the most votes, followed by a small sports space and a community garden.','週末市場が最多票で、小さな運動場所、共同菜園が続きました。','最多票の案が直接示されています。'),
q('REASON','スポーツ場所について近隣住民が心配したことは何ですか。','Balls might reach the road.','The sports space needed little setup, but nearby residents worried about balls reaching the road.','運動場所は準備が少なくて済みますが、近隣住民はボールが道路へ出ることを心配しました。','心配の内容が直接書かれています。'),
q('CONTENT_MATCH','本文の内容に合うものを選びなさい。','The final market plan was smaller and less frequent than a market every weekend.','After comparing the ideas again, they proposed a small weekend market twice a month with a clear parking plan.','再比較のあと、明確な駐車計画を付けて月二回の小規模な週末市場を提案しました。','毎週末ではなく月二回に調整されています。'),
q('DETAIL','追加した三つの判断条件は何ですか。','safety, cost, and easy removal after one year','They added three conditions: safety, cost, and whether the idea could be removed easily after one year.','そこで、安全、費用、一年後に簡単に撤去できるかという三つの条件を加えました。','三条件が直接示されています。')
],
questionSetB:[
q('INFERENCE','グループが人気投票だけで決めなかった理由を推論しなさい。','人気は実施時の安全性や費用、周囲への影響、一年後の撤去条件までは示さないから。',['The group realized that popularity answered only one question: what people liked at first.','They added three conditions: safety, cost, and whether the idea could be removed easily after one year.'],['グループは、人気投票が答えるのは「最初に何を好むか」という一つの問いだけだと気づきました。','そこで、安全、費用、一年後に簡単に撤去できるかという三つの条件を加えました。'],'人気と実行可能性は別の情報だからです。'),
q('SENTENCE_INSERTION','“Each choice had a different kind of problem.” を入れるなら最も自然な位置を答えなさい。','市場・運動場所・菜園の三案の問題点を説明した三文の直後。',['The market could serve many people, but it needed parking control and could create noise every weekend.','The sports space needed little setup, but nearby residents worried about balls reaching the road.','The garden was quieter, but one year was a short time for some plants.'],['市場は多くの人が利用できますが、駐車管理が必要で毎週末に騒音が出る可能性がありました。','運動場所は準備が少なくて済みますが、近隣住民はボールが道路へ出ることを心配しました。','菜園は静かですが、一年では一部の植物には短い期間でした。'],'三案それぞれの弱点をまとめ、次の判断基準追加へつながります。',{insertAfterSentence:9}),
q('CONTEXT_WORD','本文の意味に合うように p で始まる1語を入れなさい: “The market was the most _____ idea in the vote.”','popular','The final proposal was still based on the most popular idea, but it was changed to fit the limits of the place.','最終案は最も人気の案をもとにしていましたが、その場所の条件に合うよう変更されていました。','投票で最も好まれたという意味です。'),
q('SUMMARY_FILL','まとめの空所を補いなさい: “The final plan kept the market idea but changed its size and _____.”','frequency','After comparing the ideas again, they proposed a small weekend market twice a month with a clear parking plan.','再比較のあと、明確な駐車計画を付けて月二回の小規模な週末市場を提案しました。','規模と開催頻度を調整しています。'),
q('CONTENT_MATCH','空き地を一年後に簡単に元に戻せることを条件にした理由として最も適切なものを答えなさい。','一年後には新しい建物の工事が始まる予定だから。','The town planned to use it for one year before a new building project began.','新しい建物の工事が始まるまでの一年間、その土地を使う計画が立てられました。','利用期間が最初から一年に限られていました。')
],notes:[['lot','空き地'],['proposal','提案'],['popularity','人気'],['condition','条件']] }));

passages.push(build({id:'V11-B07-G3-010',textbook:NH,section:'Unit 6-4',sourceSectionBaselineId:'V10-NH-G3-U6-4-001',title:'The Study Space Trial',
rows:[
['Students at our school asked for a quiet place to study after classes.','学校の生徒たちは放課後に静かに勉強できる場所を求めました。'],
['An unused classroom near the library was chosen for a one-week trial.','図書館近くの使われていない教室が一週間の試行場所に選ばれました。'],
['The first rules were strict: complete silence, no phones, and one student at each table.','最初の規則は厳しく、完全な無言、携帯電話禁止、一つの机に一人というものでした。'],
['The room was crowded on Monday, but by Thursday only a few students were using it.','月曜日は混んでいましたが、木曜日には数人しか使っていませんでした。'],
['The committee first thought students had lost interest in studying.','委員会は最初、生徒が勉強への関心を失ったのだと思いました。'],
['Instead of closing the trial, they asked users and non-users for short comments.','試行をやめる代わりに、利用した人としなかった人の両方に短い意見を聞きました。'],
['Some students liked the silence, especially when reading or preparing for tests.','読書や試験勉強をするとき、静けさを好む生徒もいました。'],
['Others needed a phone to check school materials or wanted to ask a friend one quiet question.','学校教材を確認するため携帯電話が必要な人や、友達に小声で一つ質問したい人もいました。'],
['The room was large enough to separate these needs.','その教室には、こうした必要を分けられるだけの広さがありました。'],
['For the second week, the back half remained a silent zone with phones on silent mode.','二週目は後ろ半分を無言区域のままにし、携帯電話は消音で使えるようにしました。'],
['The front half allowed quiet discussion between two students at a table.','前半分では一つの机で二人まで小声の相談を認めました。'],
['A sign near the door explained both choices before students entered.','入口近くの表示で、入る前に二つの使い方を説明しました。'],
['Use increased again, while students in the silent area still reported that they could concentrate.','利用者は再び増え、無言区域の生徒も集中できたと答えました。'],
['The trial showed that “quiet” did not have to mean one rule for every kind of study.','試行によって、「静か」ということがすべての勉強に同じ規則を使う意味ではないと分かりました。'],
['By keeping the main goal and changing the details, the committee made the room useful to more students.','主な目的を守りながら細部を変えることで、委員会はより多くの生徒に役立つ部屋にしました。']
],
questions:[
q('GIST','本文の中心内容を答えなさい。','静かな学習という目的を保ちながら、異なる学習方法に合うよう規則を調整したこと。','By keeping the main goal and changing the details, the committee made the room useful to more students.','主な目的を守りながら細部を変えることで、委員会はより多くの生徒に役立つ部屋にしました。','改善の要点をまとめています。'),
q('DETAIL','最初の試行は何週間の予定でしたか。','one week','An unused classroom near the library was chosen for a one-week trial.','図書館近くの使われていない教室が一週間の試行場所に選ばれました。','期間が直接示されています。'),
q('REASON','委員会が最初の規則を変えたのはなぜですか。','利用が減り、意見を聞くと静けさ以外にも教材確認や小声の相談が必要な生徒がいたから。',['The room was crowded on Monday, but by Thursday only a few students were using it.','Others needed a phone to check school materials or wanted to ask a friend one quiet question.'],['月曜日は混んでいましたが、木曜日には数人しか使っていませんでした。','学校教材を確認するため携帯電話が必要な人や、友達に小声で一つ質問したい人もいました。'],'利用低下と具体的な需要が変更理由です。'),
q('CONTENT_MATCH','本文の内容に合うものを選びなさい。','The second plan still kept a silent area.','For the second week, the back half remained a silent zone with phones on silent mode.','二週目は後ろ半分を無言区域のままにし、携帯電話は消音で使えるようにしました。','静かな区域を廃止していません。'),
q('DETAIL','前半分では一つの机を何人まで使えましたか。','two students','The front half allowed quiet discussion between two students at a table.','前半分では一つの机で二人まで小声の相談を認めました。','人数が直接示されています。')
],
questionSetB:[
q('INFERENCE','二週目の利用増加から何が推測できますか。','学習目的に応じて静けさの程度を選べる方が、完全に一律の規則より多くの生徒に使いやすかった。',['Use increased again, while students in the silent area still reported that they could concentrate.','The trial showed that “quiet” did not have to mean one rule for every kind of study.'],['利用者は再び増え、無言区域の生徒も集中できたと答えました。','試行によって、「静か」ということがすべての勉強に同じ規則を使う意味ではないと分かりました。'],'利用増加と静かな区域維持の両方から推論できます。'),
q('SENTENCE_INSERTION','“The comments showed that the problem was not the idea of a study room itself.” を入れるなら最も自然な位置を答えなさい。','利用者と非利用者から意見を聞いた文の直後。','Instead of closing the trial, they asked users and non-users for short comments.','試行をやめる代わりに、利用した人としなかった人の両方に短い意見を聞きました。','comments を受けて、次に具体的な利用者の意見が続きます。',{insertAfterSentence:6}),
q('CONTEXT_WORD','本文の意味に合うように z で始まる1語を入れなさい: “The back half remained a silent _____.”','zone','For the second week, the back half remained a silent zone with phones on silent mode.','二週目は後ろ半分を無言区域のままにし、携帯電話は消音で使えるようにしました。','本文の語 zone が入ります。'),
q('SUMMARY_FILL','まとめの空所を補いなさい: “The committee kept the main goal but changed the _____ of the rules.”','details','By keeping the main goal and changing the details, the committee made the room useful to more students.','主な目的を守りながら細部を変えることで、委員会はより多くの生徒に役立つ部屋にしました。','本文のまとめ表現です。'),
q('CONTENT_MATCH','入口の表示を置いた目的として最も適切なものを答えなさい。','生徒が入る前に二つの利用方法を理解して選べるようにするため。','A sign near the door explained both choices before students entered.','入口近くの表示で、入る前に二つの使い方を説明しました。','before students entered が目的を示します。')
],notes:[['trial','試行'],['concentrate','集中する'],['silent','静かな・無言の'],['discussion','話し合い']] }));

passages.push(build({id:'V11-B07-G3-011',textbook:SS,section:'PROGRAM 7-3',sourceSectionBaselineId:'V10-SS-G3-P7-3-001',title:'The Website Page Nobody Updated',
rows:[
['A parent emailed our school because the website showed an old bus schedule for an open-school event.','保護者から、学校説明会のウェブページに古いバス時刻表が載っているというメールが届きました。'],
['The event date had been changed correctly, but the bus information below it was from the previous year.','行事の日付は正しく変更されていましたが、その下のバス情報は前年のままでした。'],
['Several students checked other pages and found two more old notices.','生徒たちがほかのページを確認すると、古いお知らせがさらに二つ見つかりました。'],
['At first, everyone asked who had made the mistakes.','最初、みんなは誰が間違えたのかを問題にしました。'],
['The answer was less simple: different clubs had created the pages, but nobody was responsible for checking them later.','答えは単純ではなく、別々の部活動がページを作っていましたが、その後確認する担当者がいませんでした。'],
['A page could remain online for years after its original writer graduated.','元の作成者が卒業したあとも、ページが何年も公開されたままになることがありました。'],
['The student council made a list of public pages and gave each section a current owner.','生徒会は公開ページの一覧を作り、各部分に現在の担当者を決めました。'],
['Pages with dates, prices, or transportation information received a review date as well.','日付、料金、交通情報を含むページには確認日も設定しました。'],
['One month before a review date, the owner received a reminder to check the information or remove the page.','確認日の一か月前に、担当者へ情報を確認するかページを削除するよう通知が届く仕組みにしました。'],
['The council also added “last checked” dates at the bottom of important pages.','重要なページの下には「最終確認日」も加えました。'],
['This did not guarantee that every future detail would always be correct.','これで将来のすべての情報が必ず正しいと保証できるわけではありません。'],
['However, it made responsibility visible and gave people a clear time to check changing information.','しかし、担当を見える形にし、変化する情報を確認する明確な時期を作れました。'],
['The problem had looked like three separate mistakes, but the deeper problem was that no one owned the job of updating old pages.','問題は三つの別々の間違いに見えましたが、より深い問題は古いページを更新する仕事の担当がいなかったことでした。'],
['Fixing the system helped prevent the same kind of mistake from being forgotten again.','仕組みを直すことで、同じ種類の間違いが再び放置されるのを防ぎやすくなりました。']
],
questions:[
q('GIST','本文の中心内容を答えなさい。','古い情報を個別に直すだけでなく、ページごとの担当者と確認時期を決める仕組みを作ったこと。','Fixing the system helped prevent the same kind of mistake from being forgotten again.','仕組みを直すことで、同じ種類の間違いが再び放置されるのを防ぎやすくなりました。','個別修正ではなく仕組み改善が中心です。'),
q('DETAIL','最初に保護者が指摘した古い情報は何ですか。','an old bus schedule','A parent emailed our school because the website showed an old bus schedule for an open-school event.','保護者から、学校説明会のウェブページに古いバス時刻表が載っているというメールが届きました。','指摘内容が直接示されています。'),
q('REASON','古いページが残りやすかったのはなぜですか。','作成した部活動があっても、その後に内容を確認する担当者が決まっていなかったから。','The answer was less simple: different clubs had created the pages, but nobody was responsible for checking them later.','答えは単純ではなく、別々の部活動がページを作っていましたが、その後確認する担当者がいませんでした。','担当不在が原因です。'),
q('CONTENT_MATCH','本文の内容に合うものを選びなさい。','Important pages showed when they were last checked.','The council also added “last checked” dates at the bottom of important pages.','重要なページの下には「最終確認日」も加えました。','確認日表示を追加しています。'),
q('DETAIL','確認日の一か月前に担当者は何をするよう通知されますか。','check the information or remove the page','One month before a review date, the owner received a reminder to check the information or remove the page.','確認日の一か月前に、担当者へ情報を確認するかページを削除するよう通知が届く仕組みにしました。','行動が直接示されています。')
],
questionSetB:[
q('INFERENCE','「三つの別々の間違い」より深い問題とは何ですか。','更新責任の所在と定期確認の仕組みがなかったこと。','The problem had looked like three separate mistakes, but the deeper problem was that no one owned the job of updating old pages.','問題は三つの別々の間違いに見えましたが、より深い問題は古いページを更新する仕事の担当がいなかったことでした。','個々の誤りを生む共通原因を問う問題です。'),
q('SENTENCE_INSERTION','“Correcting one bus schedule would not solve that problem.” を入れるなら最も自然な位置を答えなさい。','ページ作成後の確認担当がいないと説明した文の直後。','The answer was less simple: different clubs had created the pages, but nobody was responsible for checking them later.','答えは単純ではなく、別々の部活動がページを作っていましたが、その後確認する担当者がいませんでした。','that problem は担当不在を指し、次の長期放置の説明につながります。',{insertAfterSentence:5}),
q('CONTEXT_WORD','本文の意味に合うように o で始まる1語を入れなさい: “Each public section received a current _____.”','owner','The student council made a list of public pages and gave each section a current owner.','生徒会は公開ページの一覧を作り、各部分に現在の担当者を決めました。','担当者を表す owner が入ります。'),
q('SUMMARY_FILL','まとめの空所を補いなさい: “Pages with changing information received a review _____.”','date','Pages with dates, prices, or transportation information received a review date as well.','日付、料金、交通情報を含むページには確認日も設定しました。','定期確認の時期を表します。'),
q('CONTENT_MATCH','「最終確認日」を表示する利点として本文から最も適切なものを答えなさい。','情報がいつ確認されたかを見える形にし、更新責任を分かりやすくすること。',['The council also added “last checked” dates at the bottom of important pages.','However, it made responsibility visible and gave people a clear time to check changing information.'],['重要なページの下には「最終確認日」も加えました。','しかし、担当を見える形にし、変化する情報を確認する明確な時期を作れました。'],'表示と仕組みの目的を組み合わせて判断できます。')
],notes:[['responsible','責任がある'],['owner','担当者'],['review','確認・見直し'],['guarantee','保証する']] }));

passages.push(build({id:'V11-B07-G3-012',textbook:NH,section:'Unit 6-4',sourceSectionBaselineId:'V10-NH-G3-U6-4-001',title:'The Fair Way to Share Limited Tools',
rows:[
['A community garden had eight shared tools for more than twenty members.','共同菜園には二十人以上の会員に対して共用道具が八つありました。'],
['The old rule was first come, first served, and members could keep a tool until they finished.','古いルールは先着順で、作業が終わるまで道具を使えるというものでした。'],
['This worked on quiet days but caused arguments on busy Saturday mornings.','空いている日はうまくいきましたが、混む土曜の朝には言い争いが起きました。'],
['Members who arrived early sometimes kept tools for several hours, while later members waited without knowing when one would return.','早く来た人が数時間道具を使い続け、後から来た人はいつ戻るか分からないまま待つことがありました。'],
['The garden team considered a simple thirty-minute limit for everyone.','運営チームは全員一律三十分という制限を考えました。'],
['Some jobs, however, really needed more time, especially when members were preparing a new garden bed.','しかし、新しい畑を準備するときなど、本当により長い時間が必要な作業もありました。'],
['The team asked members to list the common jobs and how long they usually took.','チームはよく行う作業と通常かかる時間を会員に挙げてもらいました。'],
['They created one-hour reservation periods but allowed a second period when a member named a longer job in advance.','一時間の予約枠を作り、長い作業を事前に示した場合は二枠目も取れるようにしました。'],
['Two tools were kept unreserved for short unexpected jobs.','二つの道具は短い急な作業のため予約なしで残しました。'],
['A board showed when reserved tools were expected back, so waiting members could make another plan.','掲示板には予約道具の返却予定時刻を示し、待つ人が別の予定を立てられるようにしました。'],
['After a month, arguments became less common, and the tools were used by more different members.','一か月後、言い争いは減り、より多くの異なる会員が道具を使うようになりました。'],
['The system did not give everyone exactly the same number of minutes.','この仕組みは全員にまったく同じ分数を与えるものではありませんでした。'],
['Instead, it made the reasons for longer use clear and gave other members information about when tools would return.','代わりに、長時間利用の理由を明確にし、ほかの会員へ返却時刻の情報を与えました。'],
['The team learned that fair sharing can require both limits and flexibility when needs are different.','必要が異なるとき、公平な共有には制限と柔軟さの両方が必要なことがあると学びました。']
],
questions:[
q('GIST','本文の中心内容を答えなさい。','道具を公平に共有するため、一律制限ではなく予約時間と必要に応じた柔軟さを組み合わせたこと。','The team learned that fair sharing can require both limits and flexibility when needs are different.','必要が異なるとき、公平な共有には制限と柔軟さの両方が必要なことがあると学びました。','最後の文が仕組みの考え方をまとめています。'),
q('DETAIL','共同菜園の共用道具はいくつありましたか。','8','A community garden had eight shared tools for more than twenty members.','共同菜園には二十人以上の会員に対して共用道具が八つありました。','数が直接示されています。'),
q('REASON','全員一律三十分にしなかったのはなぜですか。','新しい畑の準備など、本当に三十分より長く必要な作業があったから。','Some jobs, however, really needed more time, especially when members were preparing a new garden bed.','しかし、新しい畑を準備するときなど、本当により長い時間が必要な作業もありました。','一律制限が作業内容に合わない理由です。'),
q('CONTENT_MATCH','本文の内容に合うものを選びなさい。','Two tools remained available without reservations for short unexpected jobs.','Two tools were kept unreserved for short unexpected jobs.','二つの道具は短い急な作業のため予約なしで残しました。','予約外の道具を残しています。'),
q('DETAIL','通常の予約時間はどれくらいですか。','one hour','They created one-hour reservation periods but allowed a second period when a member named a longer job in advance.','一時間の予約枠を作り、長い作業を事前に示した場合は二枠目も取れるようにしました。','時間が直接示されています。')
],
questionSetB:[
q('INFERENCE','返却予定時刻を掲示することが待つ人に役立つのはなぜですか。','いつ道具が空くか分かれば、その間に別の作業をするなど予定を立てられるから。','A board showed when reserved tools were expected back, so waiting members could make another plan.','掲示板には予約道具の返却予定時刻を示し、待つ人が別の予定を立てられるようにしました。','so以下から利点を推論できます。'),
q('SENTENCE_INSERTION','“Equal time was not always the same as useful time.” を入れるなら最も自然な位置を答えなさい。','長い作業には三十分以上必要だと述べた文の直後。','Some jobs, however, really needed more time, especially when members were preparing a new garden bed.','しかし、新しい畑を準備するときなど、本当により長い時間が必要な作業もありました。','一律時間の弱点をまとめ、次の作業時間調査につながります。',{insertAfterSentence:6}),
q('CONTEXT_WORD','本文の意味に合うように r で始まる1語を入れなさい: “Members could use the board to see when a _____ tool should return.”','reserved','A board showed when reserved tools were expected back, so waiting members could make another plan.','掲示板には予約道具の返却予定時刻を示し、待つ人が別の予定を立てられるようにしました。','予約済みの道具を表す reserved が合います。'),
q('SUMMARY_FILL','まとめの空所を補いなさい: “The new system combined time limits with some _____ for longer jobs.”','flexibility','The team learned that fair sharing can require both limits and flexibility when needs are different.','必要が異なるとき、公平な共有には制限と柔軟さの両方が必要なことがあると学びました。','長い作業への例外を表す語です。'),
q('CONTENT_MATCH','二つの道具を予約なしにした目的を答えなさい。','急に必要になる短い作業へ対応できるようにするため。','Two tools were kept unreserved for short unexpected jobs.','二つの道具は短い急な作業のため予約なしで残しました。','for以下が目的です。')
],notes:[['reservation','予約'],['unreserved','予約されていない'],['flexibility','柔軟さ'],['limit','制限']] }));

passages.push(build({id:'V11-B07-G3-015',textbook:SS,section:'PROGRAM 7-3',sourceSectionBaselineId:'V10-SS-G3-P7-3-001',title:'The Meeting Point in Heavy Rain',
rows:[
['Our school emergency plan used a large tree in the central courtyard as an outdoor meeting point.','学校の緊急時計画では、中庭の大きな木を屋外の集合場所にしていました。'],
['It was easy to see from most buildings, so the location seemed practical.','多くの校舎から見つけやすいため、便利な場所に思えました。'],
['During a safety review, a teacher asked whether the point would still work in heavy rain.','安全点検で、先生が大雨でもその場所を使えるかたずねました。'],
['The student safety team checked the courtyard during the next strong rain instead of guessing.','生徒安全チームは推測する代わりに、次の強い雨の日に中庭を確認しました。'],
['Water collected around the tree, and one path from the science building became slippery.','木の周りに水がたまり、理科棟からの道の一つは滑りやすくなりました。'],
['Students could still reach the tree, but some would have to cross the wettest part of the courtyard.','木まで行くことはできましたが、一部の生徒は中庭で最もぬれた場所を通る必要がありました。'],
['The team compared two covered alternatives.','チームは屋根のある二つの代替場所を比べました。'],
['The front entrance was dry but too close to the road where emergency vehicles might arrive.','正面玄関は乾いていましたが、緊急車両が来る可能性のある道路に近すぎました。'],
['The gym entrance was covered, wide, and connected to every building by indoor or roofed paths.','体育館入口は屋根があり広く、すべての校舎から屋内または屋根付き通路でつながっていました。'],
['The team chose the gym entrance as the rain meeting point but kept the courtyard tree for dry-weather practice.','チームは雨天時の集合場所を体育館入口にし、晴天時の訓練では中庭の木を残しました。'],
['They added both locations to classroom emergency cards with a simple weather rule.','教室の緊急カードに二つの場所を加え、簡単な天候ルールも示しました。'],
['At the next drill, teachers announced “rain route,” and students reached the gym entrance without crossing the flooded area.','次の訓練では先生が「雨天経路」と伝え、生徒は水がたまった場所を通らず体育館入口へ着きました。'],
['The original meeting point had not been a bad idea; it had simply been tested under only one kind of condition.','元の集合場所が悪い考えだったのではなく、一種類の条件でしか試されていなかったのです。'],
['The team learned that an emergency plan should be checked under the conditions that make it hardest to use.','緊急時の計画は、最も使いにくくなる条件でも確認するべきだと学びました。']
],
questions:[
q('GIST','本文の中心内容を答えなさい。','晴天では便利な集合場所も大雨では危険が増えるため、悪条件で実際に確認して雨天用集合場所を決めたこと。','The team learned that an emergency plan should be checked under the conditions that make it hardest to use.','緊急時の計画は、最も使いにくくなる条件でも確認するべきだと学びました。','最後の文が安全計画の学びをまとめています。'),
q('DETAIL','元の集合場所はどこでしたか。','a large tree in the central courtyard','Our school emergency plan used a large tree in the central courtyard as an outdoor meeting point.','学校の緊急時計画では、中庭の大きな木を屋外の集合場所にしていました。','場所が直接示されています。'),
q('REASON','正面玄関を雨天集合場所にしなかったのはなぜですか。','緊急車両が来る可能性のある道路に近すぎたから。','The front entrance was dry but too close to the road where emergency vehicles might arrive.','正面玄関は乾いていましたが、緊急車両が来る可能性のある道路に近すぎました。','but以下が不採用理由です。'),
q('CONTENT_MATCH','本文の内容に合うものを選びなさい。','The courtyard tree remained in the plan for dry-weather practice.','The team chose the gym entrance as the rain meeting point but kept the courtyard tree for dry-weather practice.','チームは雨天時の集合場所を体育館入口にし、晴天時の訓練では中庭の木を残しました。','元の場所を完全に廃止したわけではありません。'),
q('DETAIL','雨天集合場所に選ばれたのはどこですか。','the gym entrance','The team chose the gym entrance as the rain meeting point but kept the courtyard tree for dry-weather practice.','チームは雨天時の集合場所を体育館入口にし、晴天時の訓練では中庭の木を残しました。','選択場所が直接示されています。')
],
questionSetB:[
q('INFERENCE','体育館入口が雨天時に適していると判断した重要な条件は何ですか。','屋根と十分な広さがあり、各校舎からぬれにくい経路で到達できること。','The gym entrance was covered, wide, and connected to every building by indoor or roofed paths.','体育館入口は屋根があり広く、すべての校舎から屋内または屋根付き通路でつながっていました。','複数の安全条件が直接示されています。'),
q('SENTENCE_INSERTION','“Being easy to see was not the only condition that mattered.” を入れるなら最も自然な位置を答えなさい。','大雨で木の周りに水がたまり道が滑りやすくなったと述べた文の直後。','Water collected around the tree, and one path from the science building became slippery.','木の周りに水がたまり、理科棟からの道の一つは滑りやすくなりました。','見つけやすさ以外に安全な到達経路も必要だと分かる位置です。',{insertAfterSentence:5}),
q('CONTEXT_WORD','本文の意味に合うように c で始まる1語を入れなさい: “The team compared two _____ alternatives.”','covered','The team compared two covered alternatives.','チームは屋根のある二つの代替場所を比べました。','雨を避けられるという文脈です。'),
q('SUMMARY_FILL','まとめの空所を補いなさい: “The school used a different meeting point for _____ weather.”','rainy','The team chose the gym entrance as the rain meeting point but kept the courtyard tree for dry-weather practice.','チームは雨天時の集合場所を体育館入口にし、晴天時の訓練では中庭の木を残しました。','天候別に場所を変えています。'),
q('CONTENT_MATCH','「rain route」と伝える利点として最も適切なものを答えなさい。','雨天時にどの集合場所と経路を使うかを短く明確に共有できること。',['They added both locations to classroom emergency cards with a simple weather rule.','At the next drill, teachers announced “rain route,” and students reached the gym entrance without crossing the flooded area.'],['教室の緊急カードに二つの場所を加え、簡単な天候ルールも示しました。','次の訓練では先生が「雨天経路」と伝え、生徒は水がたまった場所を通らず体育館入口へ着きました。'],'簡単な合図で雨天用計画を実行できています。')
],notes:[['courtyard','中庭'],['slippery','滑りやすい'],['covered','屋根のある'],['alternative','代替案']] }));

passages.push(build({id:'V11-B07-G3-016',textbook:NH,section:'Unit 6-4',sourceSectionBaselineId:'V10-NH-G3-U6-4-001',title:'The Last Section of the Community Report',
materialData:{type:'issue-evidence-table',items:[['Traffic near station','42 observations; clear morning pattern; town already reviewing crossing'],['Night noise','18 reports; times vary; source often unclear'],['Park shade','61 survey responses; 39 request more shade; two possible locations identified']]},
rows:[
['Our class prepared a community report with space for only one final issue.','私たちのクラスは、最後に一つだけ課題を載せられる地域報告書を作りました。'],
['Three groups wanted that section: traffic near the station, night noise, and a lack of shade in the park.','駅前の交通、夜間の騒音、公園の日陰不足という三つの班がその欄を希望しました。'],
['Each group believed its topic was important, so a simple vote quickly became personal.','どの班も自分たちの課題が重要だと考え、単純な投票はすぐ個人的な主張になりました。'],
['The teacher asked the class to agree on criteria before choosing a topic.','先生は、課題を選ぶ前に判断基準を決めるよう求めました。'],
['The class chose three questions: How strong is the evidence? How many people may be affected? Is there a realistic next action?','クラスは「根拠はどの程度強いか」「影響を受ける人はどのくらいか」「現実的な次の行動があるか」という三つの問いを選びました。'],
['The traffic group had forty-two observations showing a clear morning pattern, but the town was already reviewing the crossing.','交通班には朝の明確な傾向を示す四十二件の観察がありましたが、町がすでに横断場所を検討していました。'],
['The noise group had eighteen reports, but the times varied and the source of the noise was often unclear.','騒音班には十八件の報告がありましたが、時間はばらばらで、音の発生源も不明なことが多くありました。'],
['The park group had sixty-one survey responses, and thirty-nine asked for more shade.','公園班には六十一件の回答があり、そのうち三十九件が日陰を増やしてほしいと答えました。'],
['They had also found two places where a temporary shade structure could be tested.','さらに、仮設の日よけを試せる場所を二か所見つけていました。'],
['Using the agreed criteria, the class chose the park issue for the final section.','合意した基準を使い、クラスは最後の欄に公園の課題を選びました。'],
['The traffic and noise research was not thrown away; it was saved for a later report and shared with the groups already working on those topics.','交通と騒音の調査は捨てず、後の報告のため保存し、すでにその課題に取り組む団体とも共有しました。'],
['The final choice did not prove that shade was the most important problem in town.','最終選択は、日陰が町で最も重要な問題だと証明するものではありません。'],
['It showed which issue best fit the purpose and evidence needs of this particular report.','この報告書の目的と根拠の条件に最も合う課題がどれかを示したものです。'],
['The class learned that clear criteria can turn a competition between favorite topics into a decision that others can understand.','明確な基準があれば、好きな課題同士の競争を、ほかの人にも理解できる決定へ変えられると学びました。']
],
questions:[
q('GIST','本文の中心内容を答えなさい。','好きな課題への投票ではなく、根拠・影響・次の行動という共通基準で報告書の最終課題を選んだこと。','The class learned that clear criteria can turn a competition between favorite topics into a decision that others can understand.','明確な基準があれば、好きな課題同士の競争を、ほかの人にも理解できる決定へ変えられると学びました。','共通基準による判断が中心です。'),
q('DETAIL','公園班のアンケート回答は何件でしたか。','61','The park group had sixty-one survey responses, and thirty-nine asked for more shade.','公園班には六十一件の回答があり、そのうち三十九件が日陰を増やしてほしいと答えました。','件数が直接示されています。'),
q('REASON','単純な投票を続けなかったのはなぜですか。','各班が自分の課題を重要だと考え、共通の判断基準がないまま個人的な主張になったから。','Each group believed its topic was important, so a simple vote quickly became personal.','どの班も自分たちの課題が重要だと考え、単純な投票はすぐ個人的な主張になりました。','so が理由と結果を示しています。'),
q('CONTENT_MATCH','本文の内容に合うものを選びなさい。','The traffic research was saved even though it was not chosen for the last section.','The traffic and noise research was not thrown away; it was saved for a later report and shared with the groups already working on those topics.','交通と騒音の調査は捨てず、後の報告のため保存し、すでにその課題に取り組む団体とも共有しました。','選ばれなかった調査も保存されています。'),
q('MATERIAL_LINK','資料と本文から、公園課題が「次の行動」という基準に合う根拠は何ですか。','Temporary shade could be tested at two identified places.','They had also found two places where a temporary shade structure could be tested.','さらに、仮設の日よけを試せる場所を二か所見つけていました。','具体的に試せる場所があるため実行可能な次の行動があります。',{materialEvidence:'Park shade: two possible locations identified'})
],
questionSetB:[
q('INFERENCE','交通課題に十分な観察があるのに最終欄に選ばれなかった理由として何が考えられますか。','町がすでに横断場所を検討中で、この報告書が追加で行う次の行動の必要性が公園課題より低かったから。','The traffic group had forty-two observations showing a clear morning pattern, but the town was already reviewing the crossing.','交通班には朝の明確な傾向を示す四十二件の観察がありましたが、町がすでに横断場所を検討していました。','根拠の強さだけでなく「次の行動」も基準だったことから推論できます。'),
q('SENTENCE_INSERTION','“The class needed a method that could be applied to all three topics.” を入れるなら最も自然な位置を答えなさい。','単純な投票が個人的になったと述べた文の直後。','Each group believed its topic was important, so a simple vote quickly became personal.','どの班も自分たちの課題が重要だと考え、単純な投票はすぐ個人的な主張になりました。','method が次の共通基準設定へ自然につながります。',{insertAfterSentence:3}),
q('CONTEXT_WORD','本文の意味に合うように c で始まる1語を入れなさい: “The class agreed on three _____ before choosing.”','criteria','The teacher asked the class to agree on criteria before choosing a topic.','先生は、課題を選ぶ前に判断基準を決めるよう求めました。','判断基準を表す criteria が入ります。'),
q('SUMMARY_FILL','まとめの空所を補いなさい: “The final choice showed which issue best fit the _____ of this report.”','purpose','It showed which issue best fit the purpose and evidence needs of this particular report.','この報告書の目的と根拠の条件に最も合う課題がどれかを示したものです。','最重要問題そのものではなく報告の目的への適合を表します。'),
q('CONTENT_MATCH','最終選択が「町で最も重要な問題」を決めたわけではないのはなぜですか。','この報告書の目的と設定した基準に最も合う課題を選んだだけだから。',['The final choice did not prove that shade was the most important problem in town.','It showed which issue best fit the purpose and evidence needs of this particular report.'],['最終選択は、日陰が町で最も重要な問題だと証明するものではありません。','この報告書の目的と根拠の条件に最も合う課題がどれかを示したものです。'],'選択の範囲を二文で明示しています。')
],notes:[['criteria','判断基準'],['shade','日陰'],['temporary','仮設の・一時的な'],['particular','特定の']] }));

window.V11_BATCH07_STANDARD_DRAFTS=passages;
window.V11_BATCH07_STANDARD_DRAFT_STATE={batch:BATCH,count:passages.length,ids:passages.map(p=>p.id),wordCounts:Object.fromEntries(passages.map(p=>[p.id,p.wordCount])),registered:false};
})();
