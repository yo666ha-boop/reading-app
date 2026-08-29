(function finalizeV11Batch10HumanSemanticReviewR1(){
'use strict';
const ps=[...(window.V11_BATCH10_G1_DRAFTS||[]),...(window.V11_BATCH10_G2_DRAFTS||[]),...(window.V11_BATCH10_G3_DRAFTS||[])];
if(ps.length!==50)throw Error('Batch10 human semantic review requires 50 passages');
const norm=s=>String(s||'').replace(/[’‘]/g,"'").replace(/[“”]/g,'"').trim();
const changes=[];
function replaceRow(id,oldEn,newEn,newJp,note){const p=ps.find(x=>x.id===id);if(!p)throw Error('missing '+id);const i=(p.sentences||[]).findIndex(x=>norm(x)===norm(oldEn));if(i<0)throw Error(`semantic review source changed ${id}: ${oldEn}`);const oldActual=p.sentences[i],oldJp=p.slashRows[i]&&p.slashRows[i].jp;p.sentences[i]=newEn;p.slashRows[i]={en:newEn,jp:newJp};for(const q of [...(p.questions||[]),...(p.questionSetB||[])]){if(typeof q.evidence==='string'&&norm(q.evidence)===norm(oldActual)){q.evidence=newEn;q.evidenceJp=newJp;if(q.answer===oldJp)q.answer=newJp;}}p.semanticRewrite='BATCH10_HUMAN_SEMANTIC_R1';changes.push({id,row:i+1,oldEn,newEn,note});}
replaceRow('V11-B10-G2-001','She explained the problem. A noisy hall caused trouble for some visitors, and poor hearing caused the same trouble.','She explained the problem. There was noise, so some visitors could not hear the interviews well, and some visitors also needed written words.','彼女は問題を説明しました。騒音があったため、インタビューをよく聞き取れない来場者がいて、文字での情報を必要とする来場者もいました。','Removed the unregistered hard wording while preserving the accessibility problem and its two distinct needs in natural chronology-safe English.');
replaceRow('V11-B10-G2-006','One student sent the recipe. She asked that student to describe the smell, taste, and usual use.','Emi wrote back to the recipe sender and asked about the smell, taste, and usual use.','恵美はレシピの送り主に返事を書き、におい、味、普段の使い方を尋ねました。','Removed a mechanical grammar-repair scar and restored natural referent flow.');
for(const p of ps){p.fullTranslation=(p.slashRows||[]).map(r=>r.jp).join('');p.wordCount=((p.sentences||[]).join(' ').match(/[A-Za-z]+(?:['’][A-Za-z]+)?/g)||[]).length;p.semanticReview='BATCH10_HUMAN_REVIEW_20260829';p.semanticReviewStatus='READ_FULL_BODY_TRANSLATION_QUESTIONS';p.semanticReviewRegistered=false;}
window.V11_BATCH10_HUMAN_SEMANTIC_REVIEW_STATE={version:'20260829-r1',passagesRead:50,translationsRead:50,questionSetsRead:50,bodyRepairs:changes.length,changes,registered:false};
})();
