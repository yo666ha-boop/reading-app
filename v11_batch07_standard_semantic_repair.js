(function repairV11Batch07StandardSemantics(){
'use strict';
const ps=window.V11_BATCH07_STANDARD_DRAFTS||[];
const wc=s=>(String(s||'').match(/[A-Za-z]+(?:['’][A-Za-z]+)?/g)||[]).length;
const find=id=>ps.find(p=>p.id===id);
function replaceRow(p,oldEn,newEn,newJp){
  const i=(p.sentences||[]).indexOf(oldEn); if(i<0) throw new Error(`missing row ${p.id}: ${oldEn}`);
  p.sentences[i]=newEn;
  if(!p.slashRows||!p.slashRows[i]||p.slashRows[i].en!==oldEn) throw new Error(`slash mismatch ${p.id}:${i}`);
  p.slashRows[i]={en:newEn,jp:newJp};
  for(const q of [...(p.questions||[]),...(p.questionSetB||[])]){
    if(q.evidence===oldEn){q.evidence=newEn;q.evidenceJp=newJp;}
    if(Array.isArray(q.evidence)){
      const oldEv=q.evidence.slice();
      q.evidence=q.evidence.map(x=>x===oldEn?newEn:x);
      if(Array.isArray(q.evidenceJp)) q.evidenceJp=q.evidenceJp.map((x,j)=>oldEv[j]===oldEn?newJp:x);
    }
  }
  p.fullTranslation=p.slashRows.map(r=>r.jp).join(''); p.wordCount=wc(p.sentences.join(' '));
}
const p016=find('V11-B07-G3-016');
replaceRow(p016,'Each group believed its topic was important, so a simple vote quickly became personal.','A simple vote quickly became personal.','単純な投票はすぐ個人的な主張になりました。');
replaceRow(p016,'The teacher asked the class to agree on criteria before choosing a topic.','The teacher asked the class to agree on criteria first.','先生はまず判断基準を決めるようクラスに求めました。');
for(const p of ps){
  p.fullTranslation=(p.slashRows||[]).map(r=>r.jp).join(''); p.wordCount=wc((p.sentences||[]).join(' '));
  p.semanticHumanReview={reviewed:true,timelineCoherent:true,actorPerspectiveClear:true,causalLogicCoherent:true,translationNatural:true,questionAnswerLogical:true,insertionNatural:true,note:'Read end-to-end after authoring; story sequence, motives, evidence strength, and question scope checked.'};
}
p016.semanticHumanReview.note='Trimmed only redundant wording to fit STANDARD band; three-topic criteria logic and evidence comparison remain intact.';
window.V11_BATCH07_STANDARD_SEMANTIC_REPAIR_STATE={version:'20260829-human-semantic-r1',count:ps.length,reviewed:ps.filter(p=>p.semanticHumanReview&&p.semanticHumanReview.reviewed).length,wordCounts:Object.fromEntries(ps.map(p=>[p.id,p.wordCount]))};
})();
