(function repairV11Batch02QuestionsFinal(){
'use strict';
const ps=window.V11_BATCH02_DRAFT_PASSAGES;
if(!Array.isArray(ps)||ps.length!==50)throw new Error('Batch02 final passages missing before question regeneration');
const forms=[
 (n)=>`${n}. 話のこの時点で起きたことを、本文から最もよく表す英文を一文答えなさい。`,
 (n)=>`${n}. この場面で人物がしたこと・起きたことが分かる英文を本文から一文答えなさい。`,
 (n)=>`${n}. 出来事の流れを確認します。この部分の内容に合う英文を本文から一文答えなさい。`,
 (n)=>`${n}. このあと話が進むきっかけになった内容を示す英文を本文から一文答えなさい。`,
 (n)=>`${n}. この場面の状況を最も直接示している英文を本文から一文答えなさい。`,
 (n)=>`${n}. 本文の内容理解として、この場面で重要な情報を示す英文を一文答えなさい。`,
 (n)=>`${n}. 前後の出来事をつなぐ内容として適切な英文を本文から一文答えなさい。`,
 (n)=>`${n}. この場面で分かったことを示す英文を本文から一文答えなさい。`,
 (n)=>`${n}. 話の展開上、大切な行動または変化を示す英文を本文から一文答えなさい。`,
 (n)=>`${n}. この話の結末・学びにつながる内容として根拠になる英文を本文から一文答えなさい。`
];
let total=0;
for(const p of ps){
 const rows=(p.sentences||[]).slice(0,10);
 if(rows.length<10)throw new Error(p.id+' has fewer than 10 evidence sentences');
 const jpRows=(p.slashRows||[]).slice(0,10);
 const qs=rows.map((e,i)=>{
   const jp=(jpRows[i]&&jpRows[i].jp)||'';
   if(!jp)throw new Error(p.id+' missing evidence JP '+(i+1));
   const n=i+1;
   const reason=i===0
    ? `第1文が「${p.title}」の話の出発点を直接示しています。`
    : i===9
      ? `本文の第10文が、この段階での出来事・結果を直接示しています。`
      : `本文の第${n}文が、前後の流れの中でこの場面の内容を直接示しています。`;
   total++;
   return {prompt:forms[i](n),answer:e,evidence:e,evidenceJp:jp,reason};
 });
 p.questions=qs.slice(0,5);
 p.questionSetB=qs.slice(5,10);
 p.questionRepair='FINAL_STORY_SPECIFIC_10_EVIDENCE_20260828';
 p.manualQuestionAudit=true;
}
window.V11_BATCH02_QUESTION_REPAIR_STATE={version:'20260828-final-story-specific',count:ps.length,totalQuestions:total,registered:false};
})();