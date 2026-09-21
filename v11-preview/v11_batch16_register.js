/* v11 Batch16 atomic registrar: exactly 50 fully gated passages, no partial registration. */
(async function registerV11Batch16(){
'use strict';
if(window.V11_BATCH16_RUNTIME_READY)await window.V11_BATCH16_RUNTIME_READY;
const ps=Array.isArray(window.V11_BATCH16_PASSAGES)?window.V11_BATCH16_PASSAGES:[];
if(ps.length!==50||new Set(ps.map(p=>p&&p.id)).size!==50)throw new Error('Batch16 must contain 50 unique passages');
if(ps.some(p=>(p.questionsA||[]).length!==5||(p.questionsB||[]).length!==5||!p.body||!p.fullTranslation||!p.slash))throw new Error('Batch16 passage payload incomplete');
if(typeof window.V11_REGISTER_PASSAGES!=='function')throw new Error('V11_REGISTER_PASSAGES missing');
const st=window.V11_REGISTER_PASSAGES(ps),extra=Number(st&&st.extraPassages||0),totalWithBaseline=168+extra;
if(!st||extra!==800||totalWithBaseline!==968)throw new Error('Batch16 runtime totals invalid '+JSON.stringify(st));
if(typeof window.V11_APPLY_EASY_SUPPORT_NOTES==='function')window.V11_APPLY_EASY_SUPPORT_NOTES();
window.V11_BATCH16_STATE={...st,totalWithBaseline,batch16Passages:50,registered:true,version:'20260922-b16-atomic-r2'};
window.V11_BATCH16_REGISTERED=true;
window.V11_BATCH16_REGISTERED_COUNT=50;
window.V11_BATCH16_LOADED=true;
console.log('[v11 batch16] registered 50 passages atomically; total',totalWithBaseline);
})();
