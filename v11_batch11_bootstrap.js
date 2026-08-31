(function bootstrapV11Batch11(){
'use strict';
if(window.V11_BATCH11_LOADED||window.V11_BATCH11_BOOTSTRAP_LOADING)return;
window.V11_BATCH11_BOOTSTRAP_LOADING=true;
const files=[
'v11_batch11_passages_draft_g1.js','v11_batch11_passages_draft_g2.js','v11_batch11_g3_core.js','v11_batch11_passages_draft_g3_standard.js','v11_batch11_passages_draft_g3_long.js','v11_batch11_passages_draft_g3_yamaguchi_a.js','v11_batch11_passages_draft_g3_yamaguchi_b.js',
'v11_batch11_length_repair_r1.js','v11_batch11_length_repair_r2.js','v11_batch11_length_repair_r3.js','v11_batch11_length_repair_r4.js','v11_batch11_grammar_repair_r1.js','v11_batch11_grammar_repair_r2.js','v11_batch11_semantic_repair_r5.js','v11_batch11_semantic_repair_r6.js',
'v11_batch11_question_human_rewrite_r1.js','v11_batch11_question_human_rewrite_r2.js','v11_batch11_question_human_rewrite_r3.js','v11_batch11_question_human_rewrite_r4.js','v11_batch11_question_human_rewrite_r5.js','v11_batch11_question_human_rewrite_r6.js','v11_batch11_question_human_rewrite_r7.js','v11_batch11_question_human_rewrite_r8.js','v11_batch11_question_human_rewrite_r9.js','v11_batch11_question_human_rewrite_r10.js','v11_batch11_question_human_rewrite_r11.js','v11_batch11_question_human_rewrite_r12.js','v11_batch11_question_human_rewrite_r13.js','v11_batch11_question_human_rewrite_r14.js',
'v11_batch10_prior_verified_gloss.js','v11_batch10_manual_gloss_r1.js','v11_batch11_manual_gloss_r1.js','v11_batch11_verified_gloss_reuse.js','v11_batch11_easy_support_r1.js','v11_batch11_choose_property_guard.js','v11_batch11_register.js'];
function load(src){return new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=src;s.async=false;s.onload=resolve;s.onerror=()=>reject(new Error('Batch11 script load failed: '+src));document.head.appendChild(s);});}
(async()=>{try{
for(const f of files)await load(f);
const g1=window.V11_BATCH11_G1_DRAFTS||[],g2=window.V11_BATCH11_G2_DRAFTS||[],g3=window.V11_BATCH11_G3_DRAFTS||[];
if(g1.length!==17||g2.length!==17||g3.length!==16)throw new Error(`Batch11 draft count mismatch ${g1.length}/${g2.length}/${g3.length}`);
window.V11_BATCH11_DRAFTS=[...g1,...g2,...g3];window.V11_BATCH11_DRAFT_READY=true;
const st=window.V11_BATCH11_STATE;
if(!window.V11_BATCH11_LOADED||!st||st.registered!==true||st.totalWithBaseline!==718||st.batch11Passages!==50||st.humanReviewedPassages!==50||st.humanReviewedQuestions!==500||st.supportSnapshots!==50)throw new Error('Batch11 final state invalid '+JSON.stringify(st));
window.V11_BATCH11_DRAFT_STATE={count:50,g1:g1.length,g2:g2.length,g3:g3.length,registered:true,version:'20260831-human-r14-support-r11-locked'};
window.V11_BATCH11_BOOTSTRAP_STATE={version:'20260831-human-r14-support-r11-locked',files:files.length,loaded:true,total:st.totalWithBaseline,registered:true};
if(typeof window.render==='function')window.render();
}catch(e){window.V11_BATCH11_DRAFT_ERROR=String(e&&e.stack||e);window.V11_BATCH11_BOOTSTRAP_ERROR=String(e&&e.stack||e);console.error(e);throw e;}finally{window.V11_BATCH11_DRAFT_LOADING=false;window.V11_BATCH11_BOOTSTRAP_LOADING=false;}})();
})();
