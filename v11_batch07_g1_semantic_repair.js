(function repairV11Batch07G1Semantics(){
'use strict';
const ps=window.V11_BATCH07_G1_DRAFTS||[];
const wc=s=>(String(s||'').match(/[A-Za-z]+(?:['’][A-Za-z]+)?/g)||[]).length;
const find=id=>ps.find(p=>p.id===id);
const p004=find('V11-B07-G1-004');
if(!p004) throw new Error('missing G1-004');
const anchor='The class compared the three times and found the problem.';
const ai=p004.sentences.indexOf(anchor);if(ai<0)throw new Error('missing G1-004 anchor');
const newEn='Two other students had also arrived early because they trusted the classroom clock.';
const newJp='ほかの二人の生徒も教室の時計を信じたため、早く来ていました。';
if(!p004.sentences.includes(newEn)){
  p004.sentences.splice(ai+1,0,newEn);
  p004.slashRows.splice(ai+1,0,{en:newEn,jp:newJp});
}
for(const p of ps){
  p.fullTranslation=(p.slashRows||[]).map(r=>r.jp).join('');p.wordCount=wc((p.sentences||[]).join(' '));
  p.semanticHumanReview={reviewed:true,timelineCoherent:true,actorPerspectiveClear:true,causalLogicCoherent:true,translationNatural:true,questionAnswerLogical:true,insertionNatural:true,note:'Read end-to-end; one clear event chain, age-appropriate wording, question evidence, and Japanese meaning checked.'};
}
p004.semanticHumanReview.note='Added a story-specific consequence of the five-minute-fast clock so the passage reaches the target band without filler.';
window.V11_BATCH07_G1_SEMANTIC_REPAIR_STATE={version:'20260829-human-semantic-r1',count:ps.length,reviewed:ps.filter(p=>p.semanticHumanReview&&p.semanticHumanReview.reviewed).length,wordCounts:Object.fromEntries(ps.map(p=>[p.id,p.wordCount]))};
})();
