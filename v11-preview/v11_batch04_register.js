(function registerV11Batch04Final(){
'use strict';
const ps=[window.V11_BATCH04_G1_PASSAGES,window.V11_BATCH04_G2_PASSAGES,window.V11_BATCH04_G3_PASSAGES].flatMap(x=>Array.isArray(x)?x:[]);
if(ps.length!==50)throw new Error('Batch04 final passages missing '+ps.length);
if(typeof window.V11_REGISTER_PASSAGES!=='function')throw new Error('V11_REGISTER_PASSAGES missing');
if(!window.V11_BATCH04_QUESTION_REGEN_STATE||window.V11_BATCH04_QUESTION_REGEN_STATE.count!==50||window.V11_BATCH04_QUESTION_REGEN_STATE.totalQuestions!==500)throw new Error('Batch04 question regeneration gate missing');
if(!ps.every(p=>(p.questions||[]).length===5&&(p.questionSetB||[]).length===5&&p.questionRepair==='B04_FINAL_STORY_SPECIFIC_10_EVIDENCE_20260828'))throw new Error('Batch04 final question marker missing');
if(ps.some(p=>(p.notes||[]).some(n=>!n||!n.english||!n.japanese||String(n.japanese).includes('最終注整理対象'))))throw new Error('Batch04 unresolved required-note gloss');
if(!ps.every(p=>p.translationSync==='B04_POST_GRAMMAR_SYNC_20260828'))throw new Error('Batch04 translation sync gate missing');
window.V11_BATCH04_PASSAGES=ps;
const st=window.V11_REGISTER_PASSAGES(ps);
const totalWithBaseline=168+Number(st&&st.extraPassages||0);
if(!st||st.extraPassages!==200||totalWithBaseline!==368)throw new Error('Batch04 runtime totals invalid '+JSON.stringify(st));
window.V11_BATCH04_STATE={...st,totalWithBaseline,batch04Passages:50,registered:true,version:'20260828-final'};
if(typeof window.V11_APPLY_EASY_SUPPORT_NOTES==='function')window.V11_APPLY_EASY_SUPPORT_NOTES();
window.V11_BATCH04_LOADED=true;
})();