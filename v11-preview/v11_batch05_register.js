(function registerV11Batch05Final(){
'use strict';
const ps=[window.V11_BATCH05_G1_PASSAGES,window.V11_BATCH05_G2_PASSAGES,window.V11_BATCH05_G3_PASSAGES].flatMap(x=>Array.isArray(x)?x:[]);
if(ps.length!==50)throw new Error('Batch05 final passages missing '+ps.length);
if(typeof window.V11_REGISTER_PASSAGES!=='function')throw new Error('V11_REGISTER_PASSAGES missing');
if(!window.V11_BATCH05_NOTE_FINALIZE_STATE||!window.V11_BATCH05_NOTE_FINALIZE_STATE.ready||window.V11_BATCH05_NOTE_FINALIZE_STATE.unresolved!==0)throw new Error('Batch05 final note gate missing');
if(!window.V11_BATCH05_TRANSLATION_SYNC_STATE||!window.V11_BATCH05_TRANSLATION_SYNC_STATE.ready)throw new Error('Batch05 translation sync gate missing');
if(!window.V11_BATCH05_QUESTION_REGEN_STATE||!window.V11_BATCH05_QUESTION_REGEN_STATE.ready||window.V11_BATCH05_QUESTION_REGEN_STATE.count!==50||window.V11_BATCH05_QUESTION_REGEN_STATE.totalQuestions!==500)throw new Error('Batch05 question regeneration gate missing');
if(!ps.every(p=>(p.questions||[]).length===5&&(p.questionSetB||[]).length===5&&p.questionRepair==='B05_FINAL_STORY_SPECIFIC_10_EVIDENCE_20260829'))throw new Error('Batch05 final question marker missing');
if(ps.some(p=>(p.notes||[]).some(n=>!n||!n.english||!n.japanese||String(n.japanese).includes('最終注整理対象'))))throw new Error('Batch05 unresolved required-note gloss');
if(!ps.every(p=>p.translationSync==='B05_POST_GRAMMAR_SYNC_20260829'))throw new Error('Batch05 translation sync marker missing');
window.V11_BATCH05_PASSAGES=ps;
const st=window.V11_REGISTER_PASSAGES(ps);
const totalWithBaseline=168+Number(st&&st.extraPassages||0);
if(!st||st.extraPassages!==250||totalWithBaseline!==418)throw new Error('Batch05 runtime totals invalid '+JSON.stringify(st));
window.V11_BATCH05_STATE={...st,totalWithBaseline,batch05Passages:50,registered:true,version:'20260829-final'};
if(typeof window.V11_APPLY_EASY_SUPPORT_NOTES==='function')window.V11_APPLY_EASY_SUPPORT_NOTES();
window.V11_BATCH05_LOADED=true;
})();
