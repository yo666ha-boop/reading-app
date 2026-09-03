(function repairV11Batch07YamaguchiSemantics(){
'use strict';
const ps=window.V11_BATCH07_YAMAGUCHI_EXAM_DRAFTS||[];
const find=id=>ps.find(p=>p.id===id);
const wc=s=>(String(s||'').match(/[A-Za-z]+(?:['’][A-Za-z]+)?/g)||[]).length;
const replaceSentence=(p,oldEn,newEn,newJp)=>{
  if(!p) throw new Error('missing passage');
  const i=(p.sentences||[]).indexOf(oldEn);
  if(i<0) throw new Error(`sentence not found ${p.id}: ${oldEn}`);
  p.sentences[i]=newEn;
  if(!p.slashRows||!p.slashRows[i]||p.slashRows[i].en!==oldEn) throw new Error(`slash mismatch before repair ${p.id}:${i}`);
  p.slashRows[i]={en:newEn,jp:newJp};
  for(const q of [...(p.questions||[]),...(p.questionSetB||[])]){
    if(q.evidence===oldEn) q.evidence=newEn;
    if(Array.isArray(q.evidence)) q.evidence=q.evidence.map(x=>x===oldEn?newEn:x);
  }
  p.fullTranslation=p.slashRows.map(r=>r.jp).join('');
  p.wordCount=wc(p.sentences.join(' '));
};

const p003=find('V11-B07-G3-003');
replaceSentence(
  p003,
  'We found a town map printed about forty years ago and compared it with a current map.',
  'We found a town map printed about thirty-five years ago and compared it with a current map.',
  '約三十五年前に印刷された町の地図を見つけ、現在の地図と比べました。'
);
p003.semanticHumanReview={reviewed:true,timelineCoherent:true,actorPerspectiveClear:true,materialBodyConsistent:true,questionAnswerLogical:true,insertionReferentNatural:true,freeWriteNatural:true,note:'1988 library opening and 1992 rename now fit the old-map date.'};

const p006=find('V11-B07-G3-006');
const ins006=(p006.questionSetB||[]).find(q=>q.questionType==='SENTENCE_INSERTION');
if(!ins006) throw new Error('missing G3-006 insertion question');
ins006.prompt='“The result showed that reaching everyone was not enough; the process also had to be quick.” を入れるなら最も自然な位置を答えなさい。';
ins006.answer='電話連絡網が18分かかったことを述べた文の直後。';
ins006.reason='The result は直前の「全員に届いたが18分かかった」という結果を受け、次の「電話連絡網だけでは遅い」という評価へ自然につながります。';
p006.semanticHumanReview={reviewed:true,timelineCoherent:true,actorPerspectiveClear:true,materialBodyConsistent:true,questionAnswerLogical:true,insertionReferentNatural:true,freeWriteNatural:true,numericConsistency:true,note:'Coverage-versus-speed contrast in the insertion task is now logically explicit.'};

const p009=find('V11-B07-G3-009');
const old009='She believed the rain had started first and that the parade waited near the school gate before moving.';
const new009='She believed the rain had started before the back of the parade began moving from the school gate.';
replaceSentence(p009,old009,new009,'彼女は、パレードの後方が校門から動き始める前に雨が降り始めたと考えていました。');
if(!p009.materialData||!Array.isArray(p009.materialData.items)) throw new Error('missing G3-009 material data');
const item009=p009.materialData.items.find(x=>x[0]==='Interview B');
if(!item009) throw new Error('missing G3-009 Interview B material');
item009[1]='rain started before back group moved from school gate';
p009.semanticHumanReview={reviewed:true,timelineCoherent:true,actorPerspectiveClear:true,materialBodyConsistent:true,questionAnswerLogical:true,insertionReferentNatural:true,freeWriteNatural:true,note:'Ms. Kondo now reports the back group she could observe, allowing both front/back memories to be partly true.'};

const p014=find('V11-B07-G3-014');
p014.semanticHumanReview={reviewed:true,timelineCoherent:true,actorPerspectiveClear:true,materialBodyConsistent:true,questionAnswerLogical:true,insertionReferentNatural:true,freeWriteNatural:true,sampleLogicCoherent:true,note:'Sampling times, respondent mix, conclusion, and questions are mutually consistent.'};

window.V11_BATCH07_YAMAGUCHI_SEMANTIC_REPAIR_STATE={version:'20260829-human-semantic-r1',passages:ps.length,reviewed:ps.filter(p=>p.semanticHumanReview&&p.semanticHumanReview.reviewed).length,ids:ps.map(p=>p.id)};
})();
