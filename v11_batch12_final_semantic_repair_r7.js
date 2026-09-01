'use strict';

module.exports=function repairBatch12FinalSemanticR7(candidate){
  const byId=id=>{
    const p=(candidate.passages||[]).find(x=>x.id===id);
    if(!p)throw new Error('R7 semantic repair: missing '+id);
    return p;
  };
  const replaceAllQuestionJp=(p,oldText,newText)=>{
    for(const q of [...(p.questions||[]),...(p.questionSetB||[])]){
      if(typeof q.evidenceJp==='string'&&q.evidenceJp.includes(oldText))q.evidenceJp=q.evidenceJp.replace(oldText,newText);
      if(typeof q.answer==='string'&&q.answer.includes(oldText))q.answer=q.answer.replace(oldText,newText);
      if(typeof q.reason==='string'&&q.reason.includes(oldText))q.reason=q.reason.replace(oldText,newText);
    }
  };

  // G1-011: the old JP row 4 prematurely contained the action from English row 5.
  {
    const p=byId('V11-B12-G1-011');
    const old4='そこで司書の先生に置き場所を尋ね、一緒に返却カウンターの横へ移しました。';
    const old5='そこなら本棚も通路もふさぎません。';
    const new4='そこで司書の先生に正しい置き場所を尋ねました。';
    const new5='一緒に返却カウンターの横へ移すと、本棚も通路もふさぎませんでした。';
    if(!String(p.fullTranslation||'').includes(old4)||!String(p.fullTranslation||'').includes(old5))throw new Error('R7 semantic repair: G1-011 translation source mismatch');
    p.fullTranslation=p.fullTranslation.replace(old4,new4).replace(old5,new5);
    const r4=p.slashRows&&p.slashRows[3],r5=p.slashRows&&p.slashRows[4];
    if(!r4||!r5||r4.en!=='She asked the librarian about the right place for it.'||r5.en!=='Together they placed it beside the return desk, where it did not block shelves or the aisle.')throw new Error('R7 semantic repair: G1-011 slash source mismatch');
    r4.jp=new4;r5.jp=new5;
    r4.humanReview='HUMAN_REVIEW_1TO1_R7_REPAIRED';r5.humanReview='HUMAN_REVIEW_1TO1_R7_REPAIRED';
    replaceAllQuestionJp(p,old4,new4);replaceAllQuestionJp(p,old5,new5);
    p.humanSemanticReview='B12_HUMAN_REVIEW_R7_SLASH_BOUNDARY_SYNC';
  }

  // G1-014: Japanese counters made individual shoes sound like pairs; restore one-shoe meaning and the explicit confirmation.
  {
    const p=byId('V11-B12-G1-014');
    const fixes=[
      ['ジュンは二足ともユウタの箱へ入れず、本人に確認しました。','ジュンは両方の上履きをユウタの箱へ入れず、二つともユウタに見せて「これは君の？」と尋ねました。'],
      ['ユウタは最初の一足だけ自分の物だと分かり、もう片方はすでにかばんにあると言いました。','ユウタは片方だけが自分の物だと分かり、もう片方の自分の上履きはすでにかばんにあると言いました。'],
      ['二足目は名前が「ユ」で始まる別の生徒の物でした。','もう片方の上履きは、名前が「ユ」で始まる別の生徒の物でした。']
    ];
    for(const [oldText,newText] of fixes){
      if(!String(p.fullTranslation||'').includes(oldText))throw new Error('R7 semantic repair: G1-014 translation source mismatch: '+oldText);
      p.fullTranslation=p.fullTranslation.replace(oldText,newText);
      replaceAllQuestionJp(p,oldText,newText);
    }
    const rows=p.slashRows||[];
    const expected=[
      [3,"Jun did not put both shoes into Yuta's box. He showed both shoes to Yuta and asked, 'Are these yours?'",fixes[0][1]],
      [4,"Yuta recognized only the first shoe and said his other shoe was already in his bag.",fixes[1][1]],
      [5,"The second shoe belonged to another student whose name began with Yu.",fixes[2][1]]
    ];
    for(const [idx,en,jp] of expected){
      if(!rows[idx]||rows[idx].en!==en)throw new Error('R7 semantic repair: G1-014 slash source mismatch row '+(idx+1));
      rows[idx].jp=jp;rows[idx].humanReview='HUMAN_REVIEW_1TO1_R7_REPAIRED';
    }
    p.humanSemanticReview='B12_HUMAN_REVIEW_R7_COUNTER_AND_CONFIRMATION_SYNC';
  }

  candidate.finalSemanticRepairs=Array.from(new Set([...(candidate.finalSemanticRepairs||[]),'V11-B12-G1-011','V11-B12-G1-014']));
  candidate.finalSlashHumanReview='B12_FINAL_SLASH_HUMAN_REVIEW_R7_REPAIRED';
  return candidate;
};
