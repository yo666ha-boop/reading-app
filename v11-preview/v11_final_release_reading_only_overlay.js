/* v11 final-release reading-only overlay. Removes legacy composition artifacts without changing passage count. */
(function applyV11FinalReleaseReadingOnly(){
'use strict';
if(window.V11_FINAL_RELEASE_READING_ONLY_APPLIED)return;
const all=Object.values(window.V11_EXTRA_PASSAGES||{}).flat();
const byId=new Map(all.map(p=>[String(p&&p.id||''),p]));
const log={removedFreeWriteFields:[],replacedQuestions:[],bodySync:[]};
function replaceB5(id,q){
 const p=byId.get(id); if(!p)throw new Error('reading-only overlay missing '+id);
 if(!Array.isArray(p.questionSetB)||p.questionSetB.length!==5)throw new Error(id+' B set invalid');
 p.questionSetB[4]=q; if(Array.isArray(p.questionsB)&&p.questionsB.length===5)p.questionsB[4]=q;
 log.replacedQuestions.push(id);
}
function replaceQ(id,set,no,q){
 const p=byId.get(id); if(!p)throw new Error('reading-only overlay missing '+id);
 const arr=set==='A'?p.questions:p.questionSetB;
 if(!Array.isArray(arr)||arr.length!==5)throw new Error(id+' '+set+' set invalid');
 arr[no-1]={...q,set,no};
 if(set==='B'&&Array.isArray(p.questionsB)&&p.questionsB.length===5)p.questionsB[no-1]=arr[no-1];
 log.replacedQuestions.push(id+':'+set+no);
}
for(const p of all){
 if(!p)continue;
 if(Object.prototype.hasOwnProperty.call(p,'freeWriteTask')){delete p.freeWriteTask;log.removedFreeWriteFields.push(p.id+':freeWriteTask')}
 if(Object.prototype.hasOwnProperty.call(p,'freeWrite')){delete p.freeWrite;log.removedFreeWriteFields.push(p.id+':freeWrite')}
}
replaceB5('V11-B09-G3-016',{
 questionType:'SUMMARY_FILL',type:'SUMMARY_FILL',set:'B',no:5,
 prompt:'Complete the summary: The guide worked because it offered different safe actions for different ____.',
 answer:'times and conditions',
 evidence:'The guide worked because it offered different safe actions for different times and conditions.',
 evidenceJp:'時間や状況に応じた異なる安全行動を示したため案内は役立ちました。',
 reason:'本文の結論を要約し、時間帯と状況に応じて行動を変える点を読み取る問題です。'
});
replaceB5('V11-B10-G3-016',{
 questionType:'SUMMARY_FILL',type:'SUMMARY_FILL',set:'B',no:5,
 prompt:'Complete the summary: Winter-event safety required an indoor venue plus capacity, opening hours, transport seats, updated permission, and a ____.',
 answer:'cancellation rule',
 evidence:'The organizers learned that moving indoors is only one part of winter safety; capacity, opening hours, transport seats, updated permission, and a cancellation rule must also fit together.',
 evidenceJp:'主催者は、屋内化だけが冬の安全対策ではなく、定員、開館時間、交通座席、更新した許可、中止基準も組み合わせる必要があると学びました。',
 reason:'最終文に示された複数条件を統合して読む要約補充です。'
});
{
 const id='V11-B13-G3-014',p=byId.get(id);if(!p)throw new Error('reading-only overlay missing '+id);
 const en='For the optional writing task, students were asked to give one 20-30 word recommendation for another class visiting the event on a hot day and include a reason connected to the schedule or map.';
 const jp='別枠の英作文では、暑い日にこのイベントを訪れる別のクラスへのおすすめを20〜30語で一つ書き、予定表または地図に関係する理由を含めるよう求めます。';
 if(String(p.body||'').includes(en))p.body=String(p.body).replace(/\n\n?For the optional writing task,[\s\S]*?schedule or map\./,'').trim();
 if(String(p.fullTranslation||'').includes(jp))p.fullTranslation=String(p.fullTranslation).replace(/\n\n?別枠の英作文では、暑い日にこのイベントを訪れる別のクラスへのおすすめを20〜30語で一つ書き、予定表または地図に関係する理由を含めるよう求めます。/,'').trim();
 if(Array.isArray(p.sentences))p.sentences=p.sentences.filter(x=>x!==en);
 if(Array.isArray(p.slashRows))p.slashRows=p.slashRows.filter(x=>String(x&&x.en||'')!==en);
 log.bodySync.push(id);
}
replaceB5('V11-B13-G3-014',{
 questionType:'SUMMARY_FILL',type:'SUMMARY_FILL',set:'B',no:5,
 prompt:'Complete the summary: The solar-car options were less suitable because the group had to combine heat-warning time, shade and water, activity times, and the ____.',
 answer:'shuttle schedule',
 evidence:'The time of the warning, the lack of shade and water at Field A, the activity times, and the shuttle schedule all made the two solar-car options less suitable for this class visit.',
 evidenceJp:'警報の時間、Field Aに日陰と給水場所がないこと、活動時刻、シャトル時刻を合わせると、二つのソーラーカー回は今回のクラス訪問には適しにくかったのです。',
 reason:'本文の最終判断を構成する四つの条件を統合して読む要約補充です。'
});

/* YAMAGUCHI_EXPLICIT_CONTRACT_REPAIR: normalize legacy question types to the active reading-only taxonomy. */
replaceQ('V11-B13-G3-003','B',4,{questionType:'CONTEXT_WORD',type:'CONTEXT_WORD',prompt:"In the sentence 'The 8:10 bus required more waiting but made the arrival time more reliable,' what does reliable mean here?",answer:'more dependable or less likely to be delayed',evidence:'The 8:10 bus required more waiting but made the arrival time more reliable.',evidenceJp:'8時10分のバスは待ち時間が長い代わりに到着時刻が安定します。',reason:'文脈上、reliable は到着時刻の確実性が高いことを表します。'});
replaceQ('V11-B14-G3-003','B',3,{questionType:'CONTEXT_WORD',type:'CONTEXT_WORD',prompt:"What does prohibited mean in 'bicycles would still be prohibited until 2:00 p.m.'?",answer:'not allowed',evidence:'After 11:30, the path would reopen, but bicycles would still be prohibited until 2:00 p.m.',evidenceJp:'11時30分以降は再開しますが、自転車は午後2時まで通れません。',reason:'prohibited はその時間まで自転車の通行が許可されないことを表します。'});
replaceQ('V11-B15-G3-009','B',1,{questionType:'CONTEXT_WORD',type:'CONTEXT_WORD',prompt:"What does backup mean in 'with the hall ready as a backup'?",answer:'an alternative place to use if the outdoor plan became unsafe',evidence:'The 11:00 music performance stayed outdoors during the dry period, with the hall ready as a backup.',evidenceJp:'11時の音楽公演は雨がやむ時間帯は屋外のままとし、ホールを代替場所として準備しました。',reason:'backup は天候が悪化したときに使う代替案・代替場所を指します。'});
replaceQ('V11-B10-G3-004','B',3,{questionType:'PHRASE_FILL',type:'PHRASE_FILL',prompt:'Complete the phrase: The students set a 2:45 meeting time at the ticket hall so they could walk to the gate without ____.',answer:'rushing',evidence:'The students set a two forty-five meeting time at the ticket hall so they could walk to the gate without rushing.',evidenceJp:'急がず入口へ歩けるよう、二時四十五分にチケット会場で集合することにしました。',reason:'without の後には本文中の rushing が入り、余裕を持った移動という文脈に合います。'});
replaceQ('V11-B10-G3-008','B',3,{questionType:'PHRASE_FILL',type:'PHRASE_FILL',prompt:'Complete the phrase: Using the later bus would add time near the coast as the tide continued to rise without adding a necessary ____.',answer:'task',evidence:'Using the later bus would add time near the coast as the tide continued to rise without adding a necessary task.',evidenceJp:'遅いバスでは必要な作業を増やさず、潮が上がる海岸での滞在時間だけが増えます。',reason:'本文では遅い便にしても必要な task は増えないことが理由になっています。'});
replaceQ('V11-B10-G3-012','B',3,{questionType:'PHRASE_FILL',type:'PHRASE_FILL',prompt:'Complete the phrase: After repair ended at 2:50, the seven-minute walk to Room B left enough time before ____.',answer:'3:10',evidence:'After repair ended at two fifty, the seven-minute walk to Room B left enough time before three ten.',evidenceJp:'修理は二時五十分に終わり、B室まで七分なので三時十分まで十分時間がありました。',reason:'本文の時刻関係をそのまま短句補充として確認します。'});
replaceQ('V11-B10-G3-016','B',3,{questionType:'PHRASE_FILL',type:'PHRASE_FILL',prompt:'Complete the phrase: On event day, snow stayed light in the morning, so the group used the revised plan and finished before conditions ____.',answer:'worsened',evidence:'On event day, snow stayed light in the morning, so the group used the revised plan and finished before conditions worsened.',evidenceJp:'当日朝は小雪のままだったため修正案で移動し、天候悪化前に行事を終えました。',reason:'before の後に本文中の worsened が入り、悪化前に終了した結果を表します。'});
replaceQ('V11-B11-G3-012','A',4,{questionType:'CONTENT_MATCH',type:'CONTENT_MATCH',prompt:'Which statement matches the revised departure plan?',answer:'Leaving at 8:25 reached Market A at 8:45 and Market B at 9:00.',evidence:'The club changed departure to eight twenty-five, reaching A at eight forty-five and B at nine, while keeping both lettuce deliveries within thirty-five minutes.',evidenceJp:'出発を八時二十五分に変えるとAへ八時四十五分、Bへ九時で、レタスはどちらも三十五分以内です。',reason:'修正版の出発・到着時刻に一致する内容を選ぶCONTENT_MATCHです。'});
replaceQ('V11-B11-G3-012','B',2,{questionType:'PHRASE_FILL',type:'PHRASE_FILL',prompt:'Complete the phrase: The van could reach A in twenty minutes and B ____ minutes after leaving school.',answer:'thirty-five',evidence:'The van could reach A in twenty minutes and B thirty-five minutes after leaving school, both inside the sixty-minute rule.',evidenceJp:'学校出発からAは二十分、Bは三十五分で、どちらも六十分以内です。',reason:'60分規則と照合する本文中の到着所要時間を補充します。'});
replaceQ('V11-B11-G3-004','A',5,{questionType:'SUMMARY_FILL',type:'SUMMARY_FILL',prompt:'Complete the summary: When a fallen branch blocked the side street, teachers used a marked ____ and kept the class together.',answer:'detour',evidence:'Teachers used that marked detour and kept the class together rather than sending separate groups in different directions.',evidenceJp:'先生たちは表示された迂回路を使い、別々の方向へ分けずクラスを一緒に移動させました。',reason:'倒木時の対応を要約した短句補充です。'});
replaceQ('V11-B11-G3-016','B',2,{questionType:'PHRASE_FILL',type:'PHRASE_FILL',prompt:'Complete the phrase: A live screen was placed at the large shaded west entrance so additional spectators could watch from outside the playing ____.',answer:'area',evidence:'A live screen was placed at the large shaded west entrance so additional spectators could watch from outside the playing area.',evidenceJp:'大きな日陰の西入口にライブ画面を置き、追加の観客は競技区域の外から見られるようにしました。',reason:'本文のplaying areaというまとまりを文脈で補充します。'});
replaceQ('V11-B12-G3-004','B',3,{questionType:'PHRASE_FILL',type:'PHRASE_FILL',prompt:'Complete the phrase: If the morning ferry was canceled, the students would ____ the visit rather than arrive late and pressure the clinic staff.',answer:'postpone',evidence:'The students also wrote a backup rule: if the morning ferry was canceled, they would postpone the visit rather than arrive late and pressure the clinic staff.',evidenceJp:'朝のフェリーが欠航した場合は、遅れて診療所に負担をかけるより訪問を延期するという予備ルールも書きました。',reason:'欠航時の行動を示す動詞 postpone を文脈で補充します。'});
replaceQ('V11-B13-G3-006','B',4,{questionType:'PHRASE_FILL',type:'PHRASE_FILL',prompt:'Complete the phrase: The emergency bus list showed two buses from the neighborhood stop to Center B, at 5:55 and ____.',answer:'6:25',evidence:'The emergency bus list showed two buses from the neighborhood stop to Center B, at 5:55 and 6:25.',evidenceJp:'緊急バス一覧には、近所の停留所からBセンターへ行く便が5時55分と6時25分にあると示されていました。',reason:'二つの出発時刻を本文から補充します。'});
replaceQ('V11-B13-G3-014','B',4,{questionType:'PHRASE_FILL',type:'PHRASE_FILL',prompt:'Complete the phrase: Open Field A had no permanent shade and no water ____.',answer:'station',evidence:'Water stations were beside the entrance, the pavilion, and Garden C, but there was no water station in Open Field A.',evidenceJp:'給水所は入口、パビリオン、Garden Cにありましたが、Open Field Aには給水所がありませんでした。',reason:'Field Aの設備条件をwater stationという語句で補充します。'});
replaceQ('V11-B15-G3-006','B',2,{questionType:'CONTEXT_WORD',type:'CONTEXT_WORD',prompt:"What does orientation mean in 'all groups received orientation'?",answer:'an introductory explanation before the activities',evidence:'From 10:00 to 10:20, all groups received orientation.',evidenceJp:'10時から10時20分までは全班が説明を受けます。',reason:'ここでorientationは活動前の説明・案内を指します。'});
replaceQ('V11-B15-G3-014','B',1,{questionType:'CONTEXT_WORD',type:'CONTEXT_WORD',prompt:"What does scheduled mean in 'were scheduled to arrive at 6:30'?",answer:'planned to arrive at that time',evidence:'Water and blankets would arrive at 5:00 p.m., while baby supplies and extra floor mats would arrive at 6:30.',evidenceJp:'水と毛布は午後5時、乳幼児用品と追加の床用マットは6時30分です。',reason:'scheduledはその時刻に届く予定であることを表します。'});

if(typeof window.render==='function')window.render();
window.V11_FINAL_RELEASE_READING_ONLY_STATE={version:'20260929-reading-only-r1',passages:all.length,...log};
window.V11_FINAL_RELEASE_READING_ONLY_APPLIED=true;
window.dispatchEvent(new Event('v11-passages-updated'));
if(!window.V11_YAMAGUCHI_100_READY){
  const y=document.createElement('script');
  y.src='./v11_yamaguchi_100_subset_overlay.js';
  y.onerror=function(){window.V11_YAMAGUCHI_100_ERROR='subset overlay load failed';console.error('[v11 Yamaguchi100] subset overlay load failed');};
  document.head.appendChild(y);
}
})();
