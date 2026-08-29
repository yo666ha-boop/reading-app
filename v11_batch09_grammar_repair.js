(function repairV11Batch09Grammar(){
'use strict';
const ps=[...(window.V11_BATCH09_G1_DRAFTS||[]),...(window.V11_BATCH09_G2_DRAFTS||[]),...(window.V11_BATCH09_G3_DRAFTS||[])];
const norm=s=>String(s||'').replace(/[’‘]/g,"'").replace(/[“”]/g,'"').trim();
function replaceRow(oldEn,newEn,newJp){let hits=0;for(const p of ps){const i=(p.sentences||[]).findIndex(x=>norm(x)===norm(oldEn));if(i<0)continue;hits++;const oldActual=p.sentences[i],oldJp=p.slashRows[i]&&p.slashRows[i].jp;p.sentences[i]=newEn;p.slashRows[i]={en:newEn,jp:newJp};for(const q of [...(p.questions||[]),...(p.questionSetB||[])]){if(typeof q.evidence==='string'&&norm(q.evidence)===norm(oldActual)){q.evidence=newEn;q.evidenceJp=newJp;if(typeof q.answer==='string'&&oldJp&&q.answer===oldJp)q.answer=newJp;}if(Array.isArray(q.evidence)){const before=q.evidence.slice();q.evidence=q.evidence.map(x=>norm(x)===norm(oldActual)?newEn:x);if(Array.isArray(q.evidenceJp))q.evidenceJp=q.evidenceJp.map((x,k)=>norm(before[k])===norm(oldActual)?newJp:x);}}}
if(hits!==1)throw Error(`grammar repair row hits=${hits}: ${oldEn}`);}
const R=[
["She asked the student who cared for the plant on Friday.","She asked a student about the plant. That student cared for it on Friday.","彩は一人の生徒に植物のことを尋ねました。その生徒は金曜日に植物の世話をしていました。"],
["He returned the box to Mao and moved a sign so food would not be placed on that shelf again.","He returned the box to Mao. Then he moved the sign to keep food away from that shelf.","蓮は真央に箱を返しました。そして、その棚に食べ物を置かないよう表示を動かしました。"],
["They learned that the best route can change with weather and road conditions.","They learned that a good route can change with weather and road conditions.","よい道は天候や道路の状態によって変わると学びました。"],
["Kenta had three photos from the same science club day, but their order was mixed.","Kenta had three photos from the same science club day, but he did not know their order.","健太は同じ科学部の日の写真を三枚持っていましたが、その順番が分かりませんでした。"],
["At first, Kenta put the cleaning photo first because it was the brightest.","At first, Kenta put the cleaning photo first. It was very bright.","最初、健太は掃除の写真を最初に置きました。その写真はとても明るかったからです。"],
["They learned that picture details can show time order better than color.","They learned that picture details can show time order clearly. Color alone may not show the order.","写真の細部は時間の順序をはっきり示せます。色だけでは順序が分からないこともあると学びました。"],
["She worried that she might return the book late.","She worried about a late return.","美奈は返却が遅れることを心配しました。"],
["The receipt was printed when Mina borrowed the book that morning.","The librarian printed the receipt that morning. Mina received it with the book.","その朝、司書がレシートを印刷しました。美奈は本と一緒にそれを受け取りました。"],
["Mina learned to check when information was made before choosing between two dates.","Mina learned to check the date of information before choosing between two dates.","二つの日付から選ぶ前に、その情報の日付を確認することを美奈は学びました。"],
["Leo learned that a direction is useful only when you know what the sign is directing you to.","Leo learned that a direction is useful only with a clear label. The label tells you the sign's purpose.","方向表示は明確なラベルがあると役立つとレオは学びました。そのラベルが表示の目的を教えます。"],
["It had been posted after the announcement, so she knew it was the update.","Someone posted it after the announcement, so Nana knew it was the update.","誰かが放送の後にそれを掲示したので、奈々はそれが最新情報だと分かりました。"],
["Ken was listed for Saturday morning, and Riku was listed for Sunday morning.","The chart showed Ken for Saturday morning and Riku for Sunday morning.","予定表には土曜の朝が健、日曜の朝が陸と書かれていました。"],
["He did not know whether someone had changed the plan or simply marked the wrong box.","He saw two possibilities. Someone changed the plan, or someone marked the wrong box.","二つの可能性がありました。誰かが予定を変えたか、違う欄に印を付けたかです。"],
["The shortest route used the east stairway.","The map showed a short route through the east stairway.","地図には東階段を通る短い道が示されていました。"],
["Haru learned that a useful map must show current conditions, not only the shortest path.","Haru learned that a useful map needs current conditions, not only a short path.","役立つ地図には短い道だけでなく現在の状況も必要だと陽は学びました。"],
["After it was posted, two students asked what time the workshop would begin.","The club posted it. After that, two students asked about the workshop's start time.","部活がそれを掲示しました。その後、二人の生徒が体験会の開始時刻を尋ねました。"],
["The room was booked from ten thirty, so they added “10:30 a.m.” in large letters.","The booking sheet showed the room from ten thirty, so they added “10:30 a.m.” in large letters.","予約表では部屋は10時30分からとなっていたので、大きな字で「午前10時30分」と加えました。"],
["Basketball needed the baskets only after four, while dance could finish by four.","Basketball needed the baskets only after four. Dance planned to finish by four.","バスケットボール部は4時以降だけゴールが必要でした。ダンス部は4時までに終える予定でした。"],
["They learned that sharing works better when people compare actual needs, not only old reservations.","They learned a lesson about sharing: compare actual needs, not only old reservations.","共有するときは以前の予約だけでなく実際の必要を比べることが大切だと学びました。"],
["Tomo learned that color alone may not be enough when several items look similar.","Tomo learned that color alone is sometimes not enough for similar items.","似た物がいくつかあるときは色だけでは十分でない場合があると智は学びました。"],
["At first, one student doubled only the eggs because they were listed first.","At first, one student doubled only the eggs. They appeared first on the card.","最初、一人の生徒は卵だけを二倍にしました。卵がカードの最初に書かれていたからです。"],
["Miu pointed out that every main amount had to change for six people.","Miu pointed out that every main amount needed a change for six people.","美羽は六人分にするには主な量をすべて変える必要があると指摘しました。"],
["Yui was ready to say that almost everyone preferred the windows.","Yui almost said that everyone preferred the windows.","結衣はほとんど全員が窓側を好むと言いそうになりました。"],
["Yui learned that a fair survey should not ask only the people most likely to agree.","Yui learned that a fair survey does not ask only people likely to agree.","公平な調査では賛成しそうな人だけに尋ねないと結衣は学びました。"],
["However, six other members were absent because they were taking a school test.","However, six other members were absent. They were taking a school test.","しかし別の六人は欠席していました。学校のテストを受けていたからです。"],
["The leader reported both the final total and the number of students who answered.","The leader reported the final total and the number of responding students.","部長は最終合計と回答した生徒の人数を報告しました。"],
["Students learned that a useful rule may need a condition when circumstances change.","Students learned that a useful rule sometimes needs a condition after circumstances change.","状況が変わった後は、役立つ規則にも条件が必要な場合があると生徒は学びました。"],
["The librarian explained that book size, print, and pictures made page counts hard to compare directly.","The librarian explained a problem with direct page comparison. Book size, print, and pictures were different.","司書はページ数を直接比べる問題を説明しました。本の大きさ、文字、絵が異なっていたからです。"],
["Students who already liked spicy food often stood near it, while others used a different line.","Students with a strong preference for spicy food often stood near it. Others used a different line.","辛い料理を強く好む生徒はその近くに並ぶことが多く、ほかの生徒は別の列を使いました。"],
["That meant the box might collect more opinions from one group.","That meant the box possibly collected more opinions from one group.","つまり、その箱には一つのグループからより多くの意見が集まった可能性がありました。"],
["In July, students used the page for a weekend visit.","Students used the page during a weekend visit in July.","7月の週末の訪問で、生徒たちはそのページを使いました。"],
["Most answers came from students who often used school tablets at home.","Most answers came from frequent home users of school tablets.","回答の多くは、家で学校のタブレットをよく使う生徒から来ました。"],
["The students learned that evacuation planning must combine location, changing conditions, and enough time to act safely.","The students learned that evacuation planning needs location, changing conditions, and safe action time together.","避難計画には場所、変化する状況、安全に行動するための時間を組み合わせる必要があると生徒は学びました。"],
["A student changed the flood date to 1937 because that was the date printed clearly on the newspaper.","A student changed the flood date to 1937. The newspaper clearly showed that date.","ある生徒は洪水の日付を1937年へ変えました。新聞にはその年がはっきり印刷されていたからです。"],
["They kept the 1937 newspaper because it was valuable evidence about the 1936 flood.","They kept the 1937 newspaper. It was valuable evidence about the 1936 flood.","1937年の新聞は残しました。それは1936年の洪水についての貴重な証拠だったからです。"]
];
for(const x of R)replaceRow(...x);
for(const p of ps){p.fullTranslation=(p.slashRows||[]).map(r=>r.jp).join('');p.wordCount=((p.sentences||[]).join(' ').match(/[A-Za-z]+(?:['’][A-Za-z]+)?/g)||[]).length;p.grammarChronologyRepair='20260829-r1';}
window.V11_BATCH09_GRAMMAR_REPAIR_STATE={version:'20260829-r1',passages:ps.length,replacements:R.length,registered:false};
})();