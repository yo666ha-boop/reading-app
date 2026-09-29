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
if(typeof window.render==='function')window.render();
window.V11_FINAL_RELEASE_READING_ONLY_STATE={version:'20260929-reading-only-r1',passages:all.length,...log};
window.V11_FINAL_RELEASE_READING_ONLY_APPLIED=true;
window.dispatchEvent(new Event('v11-passages-updated'));
})();
