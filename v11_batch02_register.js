(function registerV11Batch02Final(){
'use strict';
const ps=window.V11_BATCH02_DRAFT_PASSAGES;
if(!Array.isArray(ps)||ps.length!==50)throw new Error('Batch02 final passages missing');
if(typeof window.V11_REGISTER_PASSAGES!=='function')throw new Error('V11_REGISTER_PASSAGES missing');
if(!ps.every(p=>p.semanticRewrite&&p.questionRepair==='FINAL_STORY_SPECIFIC_10_EVIDENCE_20260828'))throw new Error('Batch02 final content/question gate marker missing');
if(!window.V11_BATCH02_POSTLENGTH_CHRONOLOGY_REPAIR_STATE||window.V11_BATCH02_POSTLENGTH_CHRONOLOGY_REPAIR_STATE.count!==50)throw new Error('Batch02 post-length chronology repair missing');
window.V11_BATCH02_PASSAGES=ps;
const st=window.V11_REGISTER_PASSAGES(ps);
if(!st||st.extraPassages!==100||st.totalWithBaseline!==268)throw new Error('Batch02 runtime totals invalid '+JSON.stringify(st));
window.V11_BATCH02_STATE={...st,batch02Passages:50,registered:true,version:'20260828-final'};
if(typeof window.V11_APPLY_EASY_SUPPORT_NOTES==='function')window.V11_APPLY_EASY_SUPPORT_NOTES();
window.V11_BATCH02_LOADED=true;
})();