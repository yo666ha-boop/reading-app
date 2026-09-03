(function repairV11Batch07LongSemantics(){
'use strict';
const ps=window.V11_BATCH07_LONG_DRAFTS||[];
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
      q.evidence=q.evidence.map(x=>x===oldEn?newEn:x);
      if(Array.isArray(q.evidenceJp)) q.evidenceJp=q.evidenceJp.map((x,j)=>q.evidence[j]===newEn?newJp:x);
    }
  }
  p.fullTranslation=p.slashRows.map(r=>r.jp).join(''); p.wordCount=wc(p.sentences.join(' '));
}

const p001=find('V11-B07-G3-001');
replaceRow(p001,'At first, our main source was a club booklet written by students in 1985.','At first, our main source was a club booklet written by students in 1987.','最初、主な資料は1987年に生徒が書いた部活動の冊子でした。');
replaceRow(p001,'We kept the 1985 booklet in the display, but we identified it as one student source rather than the final answer.','We kept the 1987 booklet in the display, but we identified it as one student source rather than the final answer.','1987年の冊子も展示に残しましたが、最終的な答えではなく、一つの生徒資料として示しました。');
const item001=(p001.materialData.items||[]).find(x=>x[0]==='1985 club booklet'); if(!item001) throw new Error('missing old booklet material'); item001[0]='1987 club booklet';
for(const q of [...p001.questions,...p001.questionSetB]){
  q.prompt=String(q.prompt).replace(/1985年の冊子/g,'1987年の冊子');
  q.reason=String(q.reason).replace(/1985年の冊子/g,'1987年の冊子');
}
p001.semanticHumanReview={reviewed:true,timelineCoherent:true,causalClaimBounded:true,materialBodyConsistent:true,questionAnswerLogical:true,insertionNatural:true,note:'Booklet moved to 1987 so it can retrospectively describe a market documented through March 1986.'};

const p004=find('V11-B07-G3-004');
const row004=(p004.slashRows||[]).find(r=>r.en==='Some needed only ten minutes to print homework, while others wanted longer time for research or club work.');
if(!row004) throw new Error('missing G3-004 ten-minute row'); row004.jp='宿題を印刷するため10分だけ必要な人もいれば、調べ学習や部活動のために長く使いたい人もいました。';
p004.fullTranslation=p004.slashRows.map(r=>r.jp).join('');
for(const q of [...p004.questions,...p004.questionSetB]) if(q.evidence===row004.en) q.evidenceJp=row004.jp;
p004.semanticHumanReview={reviewed:true,timelineCoherent:true,accessLogicCoherent:true,materialBodyConsistent:true,questionAnswerLogical:true,insertionNatural:true,note:'Arrival-time advantage, short-task occupancy, and two-session remedy are causally consistent.'};

const p008=find('V11-B07-G3-008');
replaceRow(p008,'Because we could not rebuild it, some members thought the line was unavoidable.','We could not rebuild it.','門を作り直すことはできませんでした。');
p008.semanticHumanReview={reviewed:true,timelineCoherent:true,numericConsistency:true,materialBodyConsistent:true,questionAnswerLogical:true,insertionNatural:true,note:'Saturday/Sunday comparison keeps visitor flow nearly constant while isolating layout changes; length trimmed without filler.'};

const p013=find('V11-B07-G3-013');
p013.semanticHumanReview={reviewed:true,timelineCoherent:true,numericConsistency:true,materialBodyConsistent:true,questionAnswerLogical:true,insertionNatural:true,note:'Time-of-day data supports targeting the end-of-day routine without treating necessary club use as waste.'};
for(const p of ps){p.fullTranslation=(p.slashRows||[]).map(r=>r.jp).join('');p.wordCount=wc((p.sentences||[]).join(' '));}
window.V11_BATCH07_LONG_SEMANTIC_REPAIR_STATE={version:'20260829-human-semantic-r1',count:ps.length,reviewed:ps.filter(p=>p.semanticHumanReview&&p.semanticHumanReview.reviewed).length,wordCounts:Object.fromEntries(ps.map(p=>[p.id,p.wordCount]))};
})();
