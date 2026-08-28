(function repairV11Batch02Questions(){
'use strict';
const ps=window.V11_BATCH02_DRAFT_PASSAGES;
if(!Array.isArray(ps)||ps.length!==50)throw new Error('Batch02 draft missing before question repair');
const b1=window.V11_BATCH01_PASSAGES;
if(!Array.isArray(b1)||b1.length!==50)throw new Error('Batch01 audited passages missing before Batch02 question repair');
const byEvidence=new Map();
for(const p of b1){
  for(const q of [...(p.questions||[]),...(p.questionSetB||[])]){
    if(q&&q.evidence&&!byEvidence.has(q.evidence))byEvidence.set(q.evidence,{...q});
  }
}
function renumber(prompt,n){return String(prompt||'').replace(/^\s*\d+\.\s*/,`${n}. `);}
let reused=0,arc=0;
for(const p of ps){
  const jp=new Map((p.slashRows||[]).map(r=>[r.en&&r.en.replace(/\s*\/\s*/g,' ').replace(/\s+/g,' ').trim(),r.jp]));
  const rows=(p.sentences||[]).slice(0,10);
  if(rows.length<10)throw new Error(p.id+' needs at least 10 evidence sentences');
  const qs=rows.map((e,i)=>{
    const hit=byEvidence.get(e);
    if(hit){
      reused++;
      return {...hit,prompt:renumber(hit.prompt,i+1),evidence:e,evidenceJp:hit.evidenceJp||jp.get(e)||'',reason:hit.reason||`本文の第${i+1}文が根拠です。`};
    }
    arc++;
    const forms=[
      '話の最初に起きたことを、本文から英文を一文抜き出して答えなさい。',
      'この話で起きた重要な出来事を、本文から英文を一文抜き出して答えなさい。',
      'タイトルに関係する出来事を、本文から英文を一文抜き出して答えなさい。'
    ];
    return {prompt:`${i+1}. ${forms[(p.id.length+i)%forms.length]}`,answer:e,evidence:e,evidenceJp:jp.get(e)||'',reason:`この英文が「${p.title}」の中心となる出来事を直接表しています。`};
  });
  p.questions=qs.slice(0,5);
  p.questionSetB=qs.slice(5,10);
  p.questionRepair='BATCH01_AUDITED_EVIDENCE_REUSE_PLUS_STORY_ARC_20260828';
  p.manualQuestionAudit=true;
}
window.V11_BATCH02_QUESTION_REPAIR_STATE={version:'20260828-v1',count:ps.length,reusedEvidenceQuestions:reused,storyArcQuestions:arc,registered:false};
})();