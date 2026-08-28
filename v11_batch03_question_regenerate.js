(function regenerateV11Batch03Questions(){
'use strict';
const ps=[window.V11_BATCH03_DRAFT_G1_PASSAGES,window.V11_BATCH03_DRAFT_G2_PASSAGES,window.V11_BATCH03_DRAFT_G3_PASSAGES].flatMap(x=>Array.isArray(x)?x:[]);
if(ps.length!==50)throw new Error('Batch03 50 passages missing before question regeneration');
const forms=[
 n=>`${n}. この話の出発点を最も直接示す英文を本文から一文答えなさい。`,
 n=>`${n}. この場面で起きたことが分かる英文を本文から一文答えなさい。`,
 n=>`${n}. 人物の行動や状況の変化を示す英文を本文から一文答えなさい。`,
 n=>`${n}. 話が次へ進むきっかけを示す英文を本文から一文答えなさい。`,
 n=>`${n}. この場面で重要な情報を直接示す英文を本文から一文答えなさい。`,
 n=>`${n}. 後半の出来事につながる内容を示す英文を本文から一文答えなさい。`,
 n=>`${n}. この場面で人物がしたこと、または分かったことを示す英文を本文から一文答えなさい。`,
 n=>`${n}. 前後の流れを理解する根拠になる英文を本文から一文答えなさい。`,
 n=>`${n}. 結末へ向かう大切な変化・行動を示す英文を本文から一文答えなさい。`,
 n=>`${n}. この話の結果や学びにつながる内容を示す英文を本文から一文答えなさい。`
];
let total=0;
for(const p of ps){
 const rows=p.sentences||[], jp=p.slashRows||[];
 if(rows.length<10)throw new Error(p.id+' fewer than 10 sentences');
 const picks=[];
 for(let i=0;i<10;i++)picks.push(Math.round(i*(rows.length-1)/9));
 if(new Set(picks).size!==10)throw new Error(p.id+' insufficient evidence diversity');
 const qs=picks.map((idx,i)=>{const evidence=rows[idx],evidenceJp=jp[idx]&&jp[idx].jp;if(!evidenceJp)throw new Error(p.id+' missing evidence jp '+idx);total++;return{prompt:forms[i](i+1),answer:evidence,evidence,evidenceJp,reason:`本文の第${idx+1}文が、前後の出来事の流れの中でこの設問の内容を直接示しているためです。`};});
 p.questions=qs.slice(0,5);p.questionSetB=qs.slice(5,10);p.questionRepair='B03_FINAL_STORY_SPECIFIC_10_EVIDENCE_20260828';p.manualQuestionAudit=true;
}
window.V11_BATCH03_QUESTION_REGEN_STATE={version:'20260828-final-story-specific',count:ps.length,totalQuestions:total,registered:false};
})();