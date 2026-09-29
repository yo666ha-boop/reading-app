/* v11 FINAL32 atomic registrar: exactly 32 fully gated passages, no partial registration. */
(async function registerV11FINAL32(){
'use strict';
if(window.V11_FINAL32_RUNTIME_READY)await window.V11_FINAL32_RUNTIME_READY;
const ps=Array.isArray(window.V11_FINAL32_PASSAGES)?window.V11_FINAL32_PASSAGES:[];
if(ps.length!==32||new Set(ps.map(p=>p&&p.id)).size!==32)throw new Error('FINAL32 must contain 32 unique passages');
if(ps.some(p=>(p.questionsA||[]).length!==5||(p.questionsB||[]).length!==5||!p.body||!p.fullTranslation||!p.slash))throw new Error('FINAL32 passage payload incomplete');
if(typeof window.V11_REGISTER_PASSAGES!=='function')throw new Error('V11_REGISTER_PASSAGES missing');
const st=window.V11_REGISTER_PASSAGES(ps),extra=Number(st&&st.extraPassages||0),totalWithBaseline=168+extra;
if(!st||extra!==832||totalWithBaseline!==1000)throw new Error('FINAL32 runtime totals invalid '+JSON.stringify(st));
if(typeof window.V11_APPLY_EASY_SUPPORT_NOTES==='function')window.V11_APPLY_EASY_SUPPORT_NOTES();
window.V11_FINAL32_STATE={...st,totalWithBaseline,final32Passages:32,registered:true,version:'20260929-final32-atomic-r1'};
window.V11_FINAL32_REGISTERED=true;
window.V11_FINAL32_REGISTERED_COUNT=32;
window.V11_FINAL32_LOADED=true;
console.log('[v11 final32] registered 32 passages atomically; total',totalWithBaseline);
})();
