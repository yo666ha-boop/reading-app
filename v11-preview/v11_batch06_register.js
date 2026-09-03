(function registerV11Batch06Final(){
'use strict';
const ps=[window.V11_BATCH06_G1_PASSAGES,window.V11_BATCH06_G2_PASSAGES,window.V11_BATCH06_G3_PASSAGES].flatMap(x=>Array.isArray(x)?x:[]);
if(ps.length!==50)throw new Error('Batch06 final passages missing '+ps.length);
if(typeof window.V11_REGISTER_PASSAGES!=='function')throw new Error('V11_REGISTER_PASSAGES missing');
const ns=window.V11_BATCH06_NOTES_FINALIZE_STATE;if(!ns||ns.missing&&ns.missing.length)throw new Error('Batch06 final note gate missing');
const qs=window.V11_BATCH06_QUESTION_REGEN_STATE;if(!qs||!qs.ready||qs.count!==50||qs.totalQuestions!==500)throw new Error('Batch06 question regeneration gate missing');
if(!window.V11_BATCH06_LENGTH_REPAIR_STATE)throw new Error('Batch06 length repair gate missing');
if(!ps.every(p=>(p.questions||[]).length===5&&(p.questionSetB||[]).length===5&&p.questionRepair==='B06_FINAL_STORY_SPECIFIC_10_QUESTIONS_20260829'))throw new Error('Batch06 final question marker missing');
if(ps.some(p=>(p.notes||[]).some(n=>!n||!n.english||!n.japanese||String(n.japanese).includes('最終注整理対象'))))throw new Error('Batch06 unresolved required-note gloss');
if(ps.some(p=>String(p.fullTranslation||'')!==(p.slashRows||[]).map(x=>x&&x.jp||'').join('')))throw new Error('Batch06 translation/slash mismatch');
window.V11_BATCH06_PASSAGES=ps;
const st=window.V11_REGISTER_PASSAGES(ps);const totalWithBaseline=168+Number(st&&st.extraPassages||0);
if(!st||st.extraPassages!==300||totalWithBaseline!==468)throw new Error('Batch06 runtime totals invalid '+JSON.stringify(st));
window.V11_BATCH06_STATE={...st,totalWithBaseline,batch06Passages:50,registered:true,version:'20260829-final'};
if(typeof window.V11_APPLY_EASY_SUPPORT_NOTES==='function')window.V11_APPLY_EASY_SUPPORT_NOTES();
window.V11_BATCH06_LOADED=true;
})();
