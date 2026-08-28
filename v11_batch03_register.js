(function registerV11Batch03Final(){
'use strict';
const ps=[window.V11_BATCH03_DRAFT_G1_PASSAGES,window.V11_BATCH03_DRAFT_G2_PASSAGES,window.V11_BATCH03_DRAFT_G3_PASSAGES].flatMap(x=>Array.isArray(x)?x:[]);
if(ps.length!==50)throw new Error('Batch03 final passages missing '+ps.length);
if(typeof window.V11_REGISTER_PASSAGES!=='function')throw new Error('V11_REGISTER_PASSAGES missing');
if(!window.V11_BATCH03_NOTE_FINALIZE_STATE||window.V11_BATCH03_NOTE_FINALIZE_STATE.count!==50||window.V11_BATCH03_NOTE_FINALIZE_STATE.unresolved!==0)throw new Error('Batch03 note finalization gate missing');
if(!window.V11_BATCH03_QUESTION_REGEN_STATE||window.V11_BATCH03_QUESTION_REGEN_STATE.count!==50||window.V11_BATCH03_QUESTION_REGEN_STATE.totalQuestions!==500)throw new Error('Batch03 question regeneration gate missing');
if(!ps.every(p=>(p.questions||[]).length===5&&(p.questionSetB||[]).length===5&&p.questionRepair==='B03_FINAL_STORY_SPECIFIC_10_EVIDENCE_20260828'))throw new Error('Batch03 final question marker missing');
window.V11_BATCH03_PASSAGES=ps;
const st=window.V11_REGISTER_PASSAGES(ps);
const totalWithBaseline=168+Number(st&&st.extraPassages||0);
if(!st||st.extraPassages!==150||totalWithBaseline!==318)throw new Error('Batch03 runtime totals invalid '+JSON.stringify(st));
window.V11_BATCH03_STATE={...st,totalWithBaseline,batch03Passages:50,registered:true,version:'20260828-final'};
if(typeof window.V11_APPLY_EASY_SUPPORT_NOTES==='function')window.V11_APPLY_EASY_SUPPORT_NOTES();
window.V11_BATCH03_LOADED=true;
})();