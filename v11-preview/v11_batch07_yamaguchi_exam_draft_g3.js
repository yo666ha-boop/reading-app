(function buildV11Batch07YamaguchiExamDrafts(){
'use strict';
const BATCH='V11-B07-YAMAGUCHI-EXAM-DRAFT-20260829';
function wc(rows){return (rows.map(r=>r[0]).join(' ').match(/[A-Za-z]+(?:['’][A-Za-z]+)?/g)||[]).length;}
function q(type,prompt,answer,evidence,evidenceJp,reason,extra){return Object.assign({questionType:type,prompt,answer,evidence,evidenceJp,reason},extra||{});}
function build(o){return Object.assign({grade:'3',level:'ENTRANCE_EXAM',genre:'reading',batch:BATCH,targetWordBand:[330,450],wordCount:wc(o.rows),sentences:o.rows.map(r=>r[0]),fullTranslation:o.rows.map(r=>r[1]).join(''),slashRows:o.rows.map(r=>({en:r[0],jp:r[1]})),registered:false,semanticRewrite:'BATCH07_YAMAGUCHI_EXAM_ORIGINAL_20260829',auditNote:'Original Yamaguchi-style non-runtime draft. Chronology and all final gates still required.'},o,{rows:undefined});}
const SS='サンシャイン',NH='ニューホライズン';
const passages=[];

passages.push(build({
id:'V11-B07-G3-003',textbook:SS,section:'PROGRAM 7-3',sourceSectionBaselineId:'V10-SS-G3-P7-3-001',title:'The Old Map with a New Street Name',
materialData:{type:'map-record-table',items:[['Old map label','Harbor Road'],['Current map label','Green Street'],['Bridge position','unchanged'],['Library opening record','1988']]},
rows:[
['Our class was preparing a small history walk for visitors to our town.','私たちのクラスは町を訪れる人のために小さな歴史散策を準備していました。'],
['My group had to explain an old shopping area near the river.','私の班は川の近くにある古い商店地域について説明する担当でした。'],
['We found a town map printed about forty years ago and compared it with a current map.','約四十年前に印刷された町の地図を見つけ、現在の地図と比べました。'],
['At first, we thought one street on the old map no longer existed.','最初、古い地図にある一本の通りはもう存在しないと思いました。'],
['The old map called it Harbor Road, but the current map showed Green Street in a similar place.','古い地図ではハーバー通りと呼ばれていましたが、現在の地図ではよく似た場所にグリーン通りがありました。'],
['Ken said the town had probably moved the road when new buildings were constructed.','ケンは新しい建物が建てられたときに町が道路を移したのだろうと言いました。'],
['Mina was not sure, because the bridge at the south end appeared in exactly the same position on both maps.','ミナは、南端の橋が両方の地図でまったく同じ位置に見えたため確信が持てませんでした。'],
['We decided to look for records before writing anything in our guide.','案内に何か書く前に記録を調べることにしました。'],
['At the city library, we found a short newspaper article about street names.','市立図書館で通りの名前についての短い新聞記事を見つけました。'],
['It explained that Harbor Road received a new name in 1992 during a town improvement project.','そこには、ハーバー通りが1992年の町の整備事業の際に新しい名前になったと説明されていました。'],
['The article did not say that the road itself had been moved.','記事には道路そのものが移されたとは書かれていませんでした。'],
['A second record showed that the public library beside the road had opened in 1988.','別の記録には、その通り沿いの公共図書館が1988年に開館したとありました。'],
['That building appeared on both maps, although its entrance symbol was drawn differently.','その建物は入口の記号の描き方は違いましたが、両方の地図に載っていました。'],
['These clues changed our first idea.','これらの手がかりで最初の考えが変わりました。'],
['The place had not moved; the label used for the same street had changed.','場所が移ったのではなく、同じ通りに使われる名称が変わっていたのです。'],
['Then we noticed another problem in our draft guide.','その後、案内の下書きに別の問題があることに気づきました。'],
['We had written that Green Street was created in 1992, which was not supported by the records.','私たちはグリーン通りが1992年に作られたと書いていましたが、それは記録に裏づけられていませんでした。'],
['We changed the sentence to say that the street was renamed in 1992.','そこで、その通りは1992年に改名されたと書き換えました。'],
['For visitors, we added both names with an arrow between them on a small map.','訪問者のために、小さな地図に両方の名前を矢印で結んで載せました。'],
['We also marked the bridge and library because they helped people see that the location was the same.','さらに、場所が同じだと分かる助けになるため、橋と図書館にも印を付けました。'],
['During a test walk, one student said the two names had made her imagine two different streets.','試しの散策で、一人の生徒は二つの名前から別々の通りを想像していたと言いました。'],
['After seeing the old and new labels together, she understood the change immediately.','古い名称と新しい名称を一緒に見ると、彼女は変化をすぐ理解しました。'],
['Our teacher reminded us that maps show information chosen by people at a certain time.','先生は、地図はある時点で人が選んだ情報を示すものだと話しました。'],
['A difference between two maps may show a change in the place, but it may also show a change in names or symbols.','二つの地図の違いは場所の変化を表すこともありますが、名称や記号の変化を表す場合もあります。'],
['We learned to check what had actually changed before turning a map difference into a historical fact.','地図の違いを歴史的事実として扱う前に、実際に何が変わったのか確かめることを学びました。']
],
questions:[
q('GIST','本文全体の中心内容として最も適切なものを答えなさい。','同じ道路でも名称や地図記号が変わることがあるため、複数の資料で実際の変化を確かめる必要があること。','We learned to check what had actually changed before turning a map difference into a historical fact.','地図の違いを歴史的事実として扱う前に、実際に何が変わったのか確かめることを学びました。','最後の文が調査から得た中心的な学びをまとめています。'),
q('DETAIL','古い地図で道路は何と呼ばれていましたか。','Harbor Road','The old map called it Harbor Road, but the current map showed Green Street in a similar place.','古い地図ではハーバー通りと呼ばれていましたが、現在の地図ではよく似た場所にグリーン通りがありました。','古い地図上の名称が直接示されています。'),
q('REASON','Minaが道路が移動したという考えに確信を持てなかったのはなぜですか。','両方の地図で南端の橋が同じ位置にあったから。','Mina was not sure, because the bridge at the south end appeared in exactly the same position on both maps.','ミナは、南端の橋が両方の地図でまったく同じ位置に見えたため確信が持てませんでした。','because以下が理由を示しています。'),
q('MATERIAL_LINK','資料の4項目のうち、道路の位置が同じ可能性を最も直接支えるものを一つ答えなさい。','Bridge position — unchanged','Mina was not sure, because the bridge at the south end appeared in exactly the same position on both maps.','ミナは、南端の橋が両方の地図でまったく同じ位置に見えたため確信が持てませんでした。','地図上の固定された橋の位置が道路位置の比較点になります。',{materialEvidence:'Bridge position: unchanged'}),
q('CONTENT_MATCH','本文の内容に合うものを選びなさい。','The street was renamed in 1992.','We changed the sentence to say that the street was renamed in 1992.','そこで、その通りは1992年に改名されたと書き換えました。','道路が新設されたのではなく改名されたことが本文の結論です。')
],
questionSetB:[
q('INFERENCE','班が最初の下書きを直したことから、資料を使うときに何が大切だと考えられますか。','資料が示す範囲を超えて事実を断定しないこと。',['The article did not say that the road itself had been moved.','We had written that Green Street was created in 1992, which was not supported by the records.'],['記事には道路そのものが移されたとは書かれていませんでした。','私たちはグリーン通りが1992年に作られたと書いていましたが、それは記録に裏づけられていませんでした。'],'二つの文から、資料にないことを断定しない姿勢が読み取れます。'),
q('SENTENCE_INSERTION','次の文を入れるならどこが最も自然ですか: “That small detail made us question our first guess.”','Minaが橋の位置に気づいた文の直後。','Mina was not sure, because the bridge at the south end appeared in exactly the same position on both maps.','ミナは、南端の橋が両方の地図でまったく同じ位置に見えたため確信が持てませんでした。','That small detail は直前の「橋が同じ位置」という細部を指し、その後の「記録を調べる」行動につながります。',{insertAfterSentence:7}),
q('CONTEXT_WORD','本文の流れに合うように r で始まる1語を入れなさい: “The street was not newly created in 1992; it was _____.”','renamed','We changed the sentence to say that the street was renamed in 1992.','そこで、その通りは1992年に改名されたと書き換えました。','新設ではなく名称変更という対比から renamed が決まります。'),
q('SUMMARY_FILL','本文のまとめに合うように空所を補いなさい: “The two maps looked different mainly because the street had a different ____.”','name','The place had not moved; the label used for the same street had changed.','場所が移ったのではなく、同じ通りに使われる名称が変わっていたのです。','場所ではなく名称が変化したという本文の要点です。'),
q('CONTENT_MATCH','班が訪問者向けの小地図に橋と図書館を加えた目的として最も適切なものを答えなさい。','古い地図と新しい地図が同じ場所を示していると分かりやすくするため。','We also marked the bridge and library because they helped people see that the location was the same.','さらに、場所が同じだと分かる助けになるため、橋と図書館にも印を付けました。','because以下に目的が直接示されています。')
],
freeWriteTask:{questionType:'FREE_WRITE_20_30',prompt:'古い資料と新しい資料を比べるとき、あなたなら何を確認しますか。20～30語の英語で書きなさい。',wordRange:[20,30],scoringConditions:['20～30語','確認したい点が明確','理由または方法を含む','意味の通る英文'],modelAnswer:'I would check names, places, and dates in another source because one difference on a map does not always mean the place changed.'},
notes:[['rename','改名する'],['record','記録'],['label','名称・表示'],['symbol','記号']]
}));

passages.push(build({
id:'V11-B07-G3-006',textbook:NH,section:'Unit 6-4',sourceSectionBaselineId:'V10-NH-G3-U6-4-001',title:'The Emergency Message Test',
materialData:{type:'delivery-record',items:[['Group chat','18 of 24 within 10 min'],['School app','21 of 24 within 10 min'],['Phone tree','24 of 24 within 18 min'],['Combined method','24 of 24 within 9 min']]},
rows:[
['Our student safety team wanted to know whether an emergency message could reach every member quickly.','生徒安全チームは緊急連絡が全員にすばやく届くか確かめたいと考えました。'],
['We had always used one group chat, and most of us believed it was enough.','私たちはいつも一つのグループチャットを使っており、多くの人はそれで十分だと思っていました。'],
['A teacher asked a simple question: What happens if a member cannot check that app?','先生は「そのアプリを確認できない部員がいたらどうなるのか」と単純な質問をしました。'],
['Instead of arguing about it, we planned a test with twenty-four students.','議論だけをするのではなく、二十四人の生徒でテストすることにしました。'],
['The first message was sent through our usual group chat at 4:00 p.m.','最初の連絡は午後4時にいつものグループチャットで送られました。'],
['After ten minutes, eighteen students had confirmed that they had seen it.','十分後、十八人が見たと確認していました。'],
['Two students were practicing in a place with weak internet service, and four had not checked their phones.','二人は通信の弱い場所で練習しており、四人は携帯電話を確認していませんでした。'],
['On the next day, we sent a similar message through the school information app.','翌日、同じような連絡を学校の情報アプリで送りました。'],
['Twenty-one students responded within ten minutes, which was better but still not complete.','二十一人が十分以内に反応し、改善はしましたが全員ではありませんでした。'],
['For the third test, one student called three people, and each of those students called several others.','三回目のテストでは、一人が三人に電話し、その三人がさらに何人かに電話しました。'],
['This phone tree reached all twenty-four students, but it took eighteen minutes.','この電話連絡網では二十四人全員に届きましたが、十八分かかりました。'],
['Some members said the phone tree was too slow to use by itself.','電話連絡網だけでは遅すぎるという部員もいました。'],
['Others pointed out that it had reached people who had missed the app messages.','一方、アプリの連絡を見逃した人にも届いたと指摘する人もいました。'],
['We then designed a fourth test that combined two methods.','そこで二つの方法を組み合わせた四回目のテストを考えました。'],
['The school app sent the first alert, and after five minutes the phone tree started only for people who had not replied.','まず学校アプリで連絡し、五分後に返事のない人だけへ電話連絡網を始めました。'],
['This time every student confirmed the message within nine minutes.','今回は全員が九分以内に連絡を確認しました。'],
['The combined method also required fewer phone calls than the full phone tree.','組み合わせた方法では、全員への電話連絡網より電話の回数も少なく済みました。'],
['Our first question had been, “Which tool is best?”','最初の問いは「どの道具が一番よいか」でした。'],
['After the tests, we changed it to, “Which process reaches everyone quickly even when one tool fails?”','テスト後は「一つの道具が使えないときでも、どの手順なら全員にすばやく届くか」という問いに変わりました。'],
['That change mattered because an emergency plan must work for the person who is hardest to reach, not only for the majority.','緊急時の計画は多数の人だけでなく、最も連絡が届きにくい人にも機能する必要があるため、この変化は重要でした。'],
['We wrote a short rule for future events: send the app alert first, wait five minutes, then call only those without a reply.','今後の行事のために「まずアプリで連絡し、五分待ち、返事のない人だけに電話する」という短いルールを書きました。'],
['We also decided to check phone numbers at the beginning of each school term.','また、学期の初めに電話番号を確認することにしました。'],
['A communication system is not reliable simply because it usually works.','連絡の仕組みは、普段うまくいくというだけで信頼できるとは限りません。'],
['Testing it under different conditions showed us where the weak points were.','異なる条件で試すことで弱い点がどこにあるか分かりました。'],
['The best plan was not one perfect tool but a clear backup process.','最もよい計画は完璧な一つの道具ではなく、明確な予備の手順でした。']
],
questions:[
q('GIST','本文の中心内容を答えなさい。','緊急連絡では一つの道具に頼らず、届かなかった人への予備手順を組み合わせることが大切だということ。','The best plan was not one perfect tool but a clear backup process.','最もよい計画は完璧な一つの道具ではなく、明確な予備の手順でした。','最後の文が実験から得た中心的な結論です。'),
q('DETAIL','最初のグループチャットで10分以内に確認した生徒は何人ですか。','18','After ten minutes, eighteen students had confirmed that they had seen it.','十分後、十八人が見たと確認していました。','人数が直接示されています。'),
q('MATERIAL_LINK','全員に届き、かつ最も短時間だった方法はどれですか。','Combined method','This time every student confirmed the message within nine minutes.','今回は全員が九分以内に連絡を確認しました。','資料でもcombined methodは24/24、9分で最短です。',{materialEvidence:'Combined method: 24 of 24 within 9 min'}),
q('REASON','電話連絡網だけを使うことに反対する意見が出た理由は何ですか。','全員に届いたが18分かかり、単独では遅いと考えたから。',['This phone tree reached all twenty-four students, but it took eighteen minutes.','Some members said the phone tree was too slow to use by itself.'],['この電話連絡網では二十四人全員に届きましたが、十八分かかりました。','電話連絡網だけでは遅すぎるという部員もいました。'],'到達率と所要時間の両方が理由です。'),
q('CONTENT_MATCH','本文の内容に合うものを選びなさい。','The combined method used the app first and called only students who had not replied.','The school app sent the first alert, and after five minutes the phone tree started only for people who had not replied.','まず学校アプリで連絡し、五分後に返事のない人だけへ電話連絡網を始めました。','組み合わせた方法の手順と一致します。')
],
questionSetB:[
q('INFERENCE','テスト後に問いを変えたことから、チームの考え方はどう変化したと言えますか。','一番よい道具を選ぶ考えから、失敗時も全員に届く仕組みを設計する考えへ変わった。',['Our first question had been, “Which tool is best?”','After the tests, we changed it to, “Which process reaches everyone quickly even when one tool fails?”'],['最初の問いは「どの道具が一番よいか」でした。','テスト後は「一つの道具が使えないときでも、どの手順なら全員にすばやく届くか」という問いに変えました。'],'二つの問いの違いから考え方の変化を推論できます。'),
q('SENTENCE_INSERTION','“The result was useful because speed alone was not enough.” を入れるなら最も自然な位置を答えなさい。','電話連絡網が18分かかったことを述べた文の直後。','This phone tree reached all twenty-four students, but it took eighteen minutes.','この電話連絡網では二十四人全員に届きましたが、十八分かかりました。','The result は直前の全員到達と18分という結果を指し、次の「遅すぎる」という評価へつながります。',{insertAfterSentence:11}),
q('CONTEXT_WORD','本文の意味に合うように b で始まる1語を入れなさい: “The team needed a clear _____ process when one app did not reach everyone.”','backup','The best plan was not one perfect tool but a clear backup process.','最もよい計画は完璧な一つの道具ではなく、明確な予備の手順でした。','一つの方法が失敗したときの予備手順という文脈です。'),
q('SUMMARY_FILL','まとめの空所を補いなさい: “The combined system first used the school app and then called students who had not _____.”','replied','The school app sent the first alert, and after five minutes the phone tree started only for people who had not replied.','まず学校アプリで連絡し、五分後に返事のない人だけへ電話連絡網を始めました。','返事のない人が電話対象になる仕組みです。'),
q('CONTENT_MATCH','チームが学期初めに電話番号を確認することにした理由として最も適切な考えを答えなさい。','予備の電話連絡が必要なときに確実に使えるようにするため。',['We also decided to check phone numbers at the beginning of each school term.','The best plan was not one perfect tool but a clear backup process.'],['また、学期の初めに電話番号を確認することにしました。','最もよい計画は完璧な一つの道具ではなく、明確な予備の手順でした。'],'明示された行動とバックアップ重視の結論を組み合わせて判断します。')
],
freeWriteTask:{questionType:'FREE_WRITE_20_30',prompt:'学校で大切な連絡を全員に届けるため、どんな方法がよいと思いますか。20～30語の英語で書きなさい。',wordRange:[20,30],scoringConditions:['20～30語','具体的な方法','理由を含む','意味の通る英文'],modelAnswer:'I would use a school app first and contact people another way if they do not reply, because one method may not reach everyone.'},
notes:[['emergency','緊急事態'],['confirm','確認する'],['backup','予備の'],['reliable','信頼できる']]
}));

passages.push(build({
id:'V11-B07-G3-009',textbook:SS,section:'PROGRAM 7-3',sourceSectionBaselineId:'V10-SS-G3-P7-3-001',title:'Two Interviews, One Event',
materialData:{type:'interview-note-table',items:[['Interview A','parade started before rain'],['Interview B','rain started before parade reached square'],['Photo record','wet street at 2:18'],['Program','parade start 2:00']]},
rows:[
['For our local-history project, I interviewed two people about a summer festival held thirty years ago.','地域史の課題で、私は三十年前に行われた夏祭りについて二人にインタビューしました。'],
['Both people had helped with the same parade, so I expected their stories to match.','二人とも同じパレードを手伝っていたため、話は一致すると思っていました。'],
['Mr. Sato remembered that the parade had already begun when heavy rain suddenly started.','佐藤さんはパレードがすでに始まったあとで急に激しい雨が降り出したと覚えていました。'],
['He said everyone ran to cover the instruments and then continued after the rain became lighter.','みんなが楽器に覆いをかけるため走り、雨が弱くなってから続けたと話しました。'],
['Ms. Kondo remembered the order differently.','近藤さんは順番を違って覚えていました。'],
['She believed the rain had started first and that the parade waited near the school gate before moving.','彼女は雨が先に降り始め、パレードは動く前に校門付近で待ったと考えていました。'],
['At first, I thought one person had to be wrong.','最初、どちらか一人が間違っているはずだと思いました。'],
['However, my teacher asked me to write down exactly what each person had actually seen.','しかし先生は、それぞれが実際に何を見たのか正確に書くよう言いました。'],
['Mr. Sato had been near the front of the parade beside the music group.','佐藤さんは音楽隊のそばでパレードの前方にいました。'],
['Ms. Kondo had been near the back, helping younger children prepare.','近藤さんは後方で年下の子どもの準備を手伝っていました。'],
['The parade stretched along a long road, and the two people were several minutes apart.','パレードは長い道路に伸び、二人の位置には数分の差がありました。'],
['That made it possible for both memories to contain part of the truth.','そのため、両方の記憶に真実の一部が含まれる可能性がありました。'],
['I then searched the town archive for other evidence.','そこで町の資料室で別の根拠を探しました。'],
['The official program listed the parade start at 2:00 p.m., but it did not record the actual start time.','公式プログラムにはパレード開始が午後2時とありましたが、実際の開始時刻は記録されていませんでした。'],
['A newspaper photograph showed wet streets at 2:18, although it did not show the school gate.','新聞写真では2時18分に道路が濡れていましたが、校門は写っていませんでした。'],
['Another photo showed musicians already walking, but its exact time was unknown.','別の写真には音楽隊がすでに歩いている様子が写っていましたが、正確な時刻は不明でした。'],
['None of these records proved the complete order of events.','どの記録も出来事の完全な順番を証明するものではありませんでした。'],
['Instead of choosing one interview and rejecting the other, I changed the way I wrote my report.','一方のインタビューだけを選び、もう一方を退けるのではなく、報告の書き方を変えました。'],
['I wrote that people in different parts of the parade remembered the beginning of the rain differently.','パレードの違う場所にいた人々は雨の始まりを違って覚えていたと書きました。'],
['I also explained where each person had been standing and what the photographs could and could not show.','また、それぞれがいた場所と、写真から分かること・分からないことも説明しました。'],
['This did not give readers one simple answer, but it gave them a clearer picture of the evidence.','読者に一つの単純な答えを与えることにはなりませんでしたが、根拠の全体像をより明確に示せました。'],
['Mr. Sato later read my report and said Ms. Kondo’s memory now made more sense to him.','後に佐藤さんは報告を読み、近藤さんの記憶も以前より理解できると言いました。'],
['I learned that an interview is valuable evidence, but memory is shaped by position and experience.','インタビューは貴重な根拠ですが、記憶は立場や経験によって形づくられると学びました。'],
['When accounts disagree, careful writing can show the disagreement without pretending that one uncertain answer is a fact.','証言が食い違うとき、慎重に書けば、不確かな一つの答えを事実のように扱わずに違いを示せます。'],
['For our final display, we placed the two short quotations beside the photographs so visitors could compare the evidence themselves.','最終展示では、来訪者自身が根拠を比べられるよう、二つの短い証言を写真の横に置きました。']
],
questions:[
q('GIST','本文の中心的な学びを答えなさい。','異なる証言があるとき、一方をすぐ誤りとせず、立場や他資料を比較して不確かさも含めて示すことが大切だということ。','When accounts disagree, careful writing can show the disagreement without pretending that one uncertain answer is a fact.','証言が食い違うとき、慎重に書けば、不確かな一つの答えを事実のように扱わずに違いを示せます。','終盤の文が調査方法の学びをまとめています。'),
q('DETAIL','Ms. Kondoはパレードのどこにいましたか。','near the back','Ms. Kondo had been near the back, helping younger children prepare.','近藤さんは後方で年下の子どもの準備を手伝っていました。','位置が直接示されています。'),
q('REASON','二人の記憶が両方とも一部正しい可能性があると考えた理由は何ですか。','二人がパレードの離れた場所にいて、時間的にも数分の差があったから。',['The parade stretched along a long road, and the two people were several minutes apart.','That made it possible for both memories to contain part of the truth.'],['パレードは長い道路に伸び、二人の位置には数分の差がありました。','そのため、両方の記憶に真実の一部が含まれる可能性がありました。'],'位置と時間差が記憶の違いを説明します。'),
q('MATERIAL_LINK','資料だけから確実に言えることはどれですか。','2:18には少なくとも写真に写った道路が濡れていた。','A newspaper photograph showed wet streets at 2:18, although it did not show the school gate.','新聞写真では2時18分に道路が濡れていましたが、校門は写っていませんでした。','写真資料が直接示す範囲だけを選びます。',{materialEvidence:'Photo record: wet street at 2:18'}),
q('CONTENT_MATCH','本文の内容に合うものを選びなさい。','The official program gave a planned start time, not proof of the actual start time.','The official program listed the parade start at 2:00 p.m., but it did not record the actual start time.','公式プログラムにはパレード開始が午後2時とありましたが、実際の開始時刻は記録されていませんでした。','予定と実際の時刻を区別しています。')
],
questionSetB:[
q('INFERENCE','筆者が一方の証言を「正解」と決めなかったのは、どんな考えに基づいていますか。','利用できる資料では完全な順番を証明できず、観察位置によって記憶が異なる可能性があったから。',['None of these records proved the complete order of events.','I learned that an interview is valuable evidence, but memory is shaped by position and experience.'],['どの記録も出来事の完全な順番を証明するものではありませんでした。','インタビューは貴重な根拠ですが、記憶は立場や経験によって形づくられると学びました。'],'複数の根拠を合わせて判断する推論です。'),
q('SENTENCE_INSERTION','“Their different locations were important.” を入れるなら最も自然な位置を答えなさい。','Mr. SatoとMs. Kondoの位置を説明した二文の直後。',['Mr. Sato had been near the front of the parade beside the music group.','Ms. Kondo had been near the back, helping younger children prepare.'],['佐藤さんは音楽隊のそばでパレードの前方にいました。','近藤さんは後方で年下の子どもの準備を手伝っていました。'],'Their different locations が直前の二人の位置を受け、続く時間差の説明につながります。',{insertAfterSentence:10}),
q('CONTEXT_WORD','本文の流れに合うように e で始まる1語を入れなさい: “The writer looked for more _____ in the town archive.”','evidence','I then searched the town archive for other evidence.','そこで町の資料室で別の根拠を探しました。','証言を確かめるため他の根拠を探す文脈です。'),
q('SUMMARY_FILL','まとめの空所を補いなさい: “The two people remembered the rain differently partly because they were in different _____.”','positions','I learned that an interview is valuable evidence, but memory is shaped by position and experience.','インタビューは貴重な根拠ですが、記憶は立場や経験によって形づくられると学びました。','二人の観察位置の違いが中心理由です。'),
q('CONTENT_MATCH','最終展示で二つの証言を写真の横に置いた目的を答えなさい。','来訪者が複数の根拠を自分で比較できるようにするため。','For our final display, we placed the two short quotations beside the photographs so visitors could compare the evidence themselves.','最終展示では、来訪者自身が根拠を比べられるよう、二つの短い証言を写真の横に置きました。','so以下に目的が示されています。')
],
freeWriteTask:{questionType:'FREE_WRITE_20_30',prompt:'二人の人が同じ出来事を違って覚えているとき、あなたならどうしますか。20～30語の英語で書きなさい。',wordRange:[20,30],scoringConditions:['20～30語','複数の情報を確認する行動','理由または目的','意味の通る英文'],modelAnswer:'I would listen to both people and check photos or records before deciding, because different memories can each contain useful parts of the truth.'},
notes:[['account','証言・説明'],['archive','資料室・記録保管所'],['quotation','引用'],['evidence','根拠']]
}));

passages.push(build({
id:'V11-B07-G3-014',textbook:NH,section:'Unit 6-4',sourceSectionBaselineId:'V10-NH-G3-U6-4-001',title:'The Survey Missing Younger Visitors',
materialData:{type:'survey-sample-table',items:[['Weekday 10:00–12:00','48 responses; age 60+ = 31'],['Weekday 15:00–17:00','32 responses; under 30 = 8'],['Saturday 10:00–12:00','41 responses; under 30 = 17'],['Saturday 15:00–17:00','46 responses; under 30 = 21']]},
rows:[
['Our class helped a local museum ask visitors what should be improved.','私たちのクラスは地域の博物館が来訪者に改善点をたずねる調査を手伝いました。'],
['We prepared a short survey about signs, rest areas, ticket information, and special events.','案内表示、休憩場所、チケット情報、特別行事についての短いアンケートを用意しました。'],
['During the first week, two students stood near the exit from ten until noon on three weekdays.','最初の週は、平日の三日間、二人の生徒が午前十時から正午まで出口付近に立ちました。'],
['They collected many answers, and most visitors said the museum was easy to understand.','多くの回答が集まり、ほとんどの来訪者は博物館が分かりやすいと答えました。'],
['Our group was pleased and almost wrote that the museum needed only small changes.','私たちの班は喜び、博物館には小さな変更しか必要ないと書きかけました。'],
['Before we finished the report, our teacher asked us who had answered the survey.','報告を仕上げる前に、先生は誰がアンケートに答えたのかたずねました。'],
['We checked the response sheets and noticed that many respondents were older adults visiting on weekday mornings.','回答用紙を調べると、平日の午前に訪れた高齢者が多いことに気づきました。'],
['Very few teenagers or young adults appeared in our first sample.','最初の標本には十代や若い成人がほとんどいませんでした。'],
['That did not mean younger people disliked the museum; it meant we had rarely asked them.','それは若い人が博物館を好まないという意味ではなく、私たちがほとんど彼らにたずねていなかったという意味でした。'],
['We decided to collect a second set of answers at different times.','そこで違う時間帯でも二回目の回答を集めることにしました。'],
['Some students returned on weekday afternoons, and others worked on Saturday morning and afternoon.','平日の午後に戻る生徒もいれば、土曜日の午前と午後に調査する生徒もいました。'],
['The new sample included more high-school students, university students, and young families.','新しい標本には高校生、大学生、若い家族がより多く含まれました。'],
['Their answers were different in several ways.','彼らの回答はいくつかの点で異なっていました。'],
['Younger visitors were more likely to ask for clearer information about short events and public transportation.','若い来訪者は短時間の行事や公共交通について、より分かりやすい情報を求める傾向がありました。'],
['Parents with small children mentioned places to sit and simple signs near restrooms.','小さな子ども連れの保護者は座る場所やトイレ付近の分かりやすい表示について述べました。'],
['Older visitors still gave important comments about lighting and the size of printed words.','高齢の来訪者からは照明や印刷文字の大きさについて、引き続き重要な意見がありました。'],
['No single age group represented every visitor.','どの一つの年齢層も、すべての来訪者を代表するものではありませんでした。'],
['When we combined all four time periods, our report changed from “most visitors are satisfied” to a more careful statement.','四つの時間帯を合わせると、報告は「ほとんどの来訪者が満足している」から、より慎重な表現に変わりました。'],
['We wrote that satisfaction was high among the people we had surveyed, but needs differed by visiting time and group.','調査した人々の満足度は高いものの、必要とすることは訪問時間や集団によって異なると書きました。'],
['The museum staff said this information was more useful than one simple percentage.','博物館の職員は、この情報は一つの単純な割合より役立つと言いました。'],
['They planned to test clearer event notices and add two small seats near the family area.','職員は行事案内を分かりやすくし、家族向け区域の近くに小さな椅子を二つ置くことを試す予定にしました。'],
['We also added a note to our report explaining when and where the survey had been conducted.','また、いつどこで調査したかを説明する注記を報告に加えました。'],
['Readers could then judge what the results did and did not represent.','そうすることで、読者は結果が何を代表し、何を代表しないのか判断できます。'],
['A survey can contain many correct answers and still give a weak picture if the sample misses part of the population.','アンケートには多くの正しい回答があっても、標本が対象集団の一部を欠けば不十分な全体像になることがあります。'],
['Our biggest improvement was not changing a question; it was changing who had a chance to answer it.','私たちの最大の改善は質問を変えることではなく、誰に回答する機会があるかを変えることでした。']
],
questions:[
q('GIST','本文の中心内容を答えなさい。','アンケート結果を信頼するには質問内容だけでなく、誰がいつ回答したかという標本の偏りを確認する必要があること。','A survey can contain many correct answers and still give a weak picture if the sample misses part of the population.','アンケートには多くの正しい回答があっても、標本が対象集団の一部を欠けば不十分な全体像になることがあります。','終盤の文が調査から得た一般的な学びを示しています。'),
q('DETAIL','最初の調査は主にいつ行われましたか。','weekday mornings from ten until noon','During the first week, two students stood near the exit from ten until noon on three weekdays.','最初の週は、平日の三日間、二人の生徒が午前十時から正午まで出口付近に立ちました。','最初の調査時間が直接示されています。'),
q('REASON','最初の結果だけで報告を完成させなかったのはなぜですか。','回答者が平日午前の高齢者に偏り、若い人がほとんど含まれていなかったから。',['We checked the response sheets and noticed that many respondents were older adults visiting on weekday mornings.','Very few teenagers or young adults appeared in our first sample.'],['回答用紙を調べると、平日の午前に訪れた高齢者が多いことに気づきました。','最初の標本には十代や若い成人がほとんどいませんでした。'],'標本の偏りが理由です。'),
q('MATERIAL_LINK','資料の4時間帯のうち、30歳未満の回答者が最も多かったのはどれですか。','Saturday 15:00–17:00','The new sample included more high-school students, university students, and young families.','新しい標本には高校生、大学生、若い家族がより多く含まれました。','資料では土曜15～17時が21人で最大です。',{materialEvidence:'Saturday 15:00–17:00: under 30 = 21'}),
q('CONTENT_MATCH','本文の内容に合うものを選びなさい。','Different visitor groups mentioned different needs.','We wrote that satisfaction was high among the people we had surveyed, but needs differed by visiting time and group.','調査した人々の満足度は高いものの、必要とすることは訪問時間や集団によって異なると書きました。','集団ごとに必要なことが異なるという結論と一致します。')
],
questionSetB:[
q('INFERENCE','博物館職員が「一つの単純な割合」より新しい報告を役立つと考えたのはなぜだと推測できますか。','来訪者全体を一つの数字でまとめるより、集団ごとの異なる必要を具体的に把握できたから。',['The museum staff said this information was more useful than one simple percentage.','We wrote that satisfaction was high among the people we had surveyed, but needs differed by visiting time and group.'],['博物館の職員は、この情報は一つの単純な割合より役立つと言いました。','調査した人々の満足度は高いものの、必要とすることは訪問時間や集団によって異なると書きました。'],'異なる集団のニーズを改善策に結びつけられるためです。'),
q('SENTENCE_INSERTION','“The number of answers was large, but the range of people was narrow.” を入れるなら最も自然な位置を答えなさい。','最初の標本に若い人が少ないと述べた文の直後。','Very few teenagers or young adults appeared in our first sample.','最初の標本には十代や若い成人がほとんどいませんでした。','answersの数と回答者層の狭さを対比し、次の「若者をたずねていなかった」という説明につながります。',{insertAfterSentence:8}),
q('CONTEXT_WORD','本文の意味に合うように s で始まる1語を入れなさい: “The first _____ did not include enough younger visitors.”','sample','Very few teenagers or young adults appeared in our first sample.','最初の標本には十代や若い成人がほとんどいませんでした。','調査対象の一部を表すsampleが文脈に合います。'),
q('SUMMARY_FILL','まとめの空所を補いなさい: “The class improved the survey mainly by changing who had a chance to _____.”','answer','Our biggest improvement was not changing a question; it was changing who had a chance to answer it.','私たちの最大の改善は質問を変えることではなく、誰に回答する機会があるかを変えることでした。','最終文の要点をそのまままとめています。'),
q('CONTENT_MATCH','報告に調査の時間と場所を書き加えた目的を答えなさい。','読者が結果がどの範囲を代表するか判断できるようにするため。',['We also added a note to our report explaining when and where the survey had been conducted.','Readers could then judge what the results did and did not represent.'],['また、いつどこで調査したかを説明する注記を報告に加えました。','そうすることで、読者は結果が何を代表し、何を代表しないのか判断できます。'],'二文目が目的を示しています。')
],
freeWriteTask:{questionType:'FREE_WRITE_20_30',prompt:'学校でアンケートをするとき、偏りを減らすために何をしますか。20～30語の英語で書きなさい。',wordRange:[20,30],scoringConditions:['20～30語','対象者や時間の工夫','理由を含む','意味の通る英文'],modelAnswer:'I would ask students from different grades at different times, because answers from only one class may not represent the whole school.'},
notes:[['survey','アンケート調査'],['sample','標本・調査対象'],['respondent','回答者'],['represent','代表する']]
}));

window.V11_BATCH07_YAMAGUCHI_EXAM_DRAFTS=passages;
window.V11_BATCH07_YAMAGUCHI_EXAM_DRAFT_STATE={batch:BATCH,count:passages.length,ids:passages.map(p=>p.id),wordCounts:Object.fromEntries(passages.map(p=>[p.id,p.wordCount])),registered:false};
})();
