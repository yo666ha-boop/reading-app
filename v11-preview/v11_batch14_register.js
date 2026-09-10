/* v11 Batch14 atomic registrar: exactly 50 gated passages, no partial registration. */
(function registerV11Batch14(){
'use strict';
const ps=Array.isArray(window.V11_BATCH14_PASSAGES)?window.V11_BATCH14_PASSAGES:[];
if(ps.length!==50||new Set(ps.map(p=>p&&p.id)).size!==50)throw new Error('Batch14 must contain 50 unique passages');
if(typeof window.V11_REGISTER_PASSAGES!=='function')throw new Error('V11_REGISTER_PASSAGES missing');
const st=window.V11_REGISTER_PASSAGES(ps),extra=Number(st&&st.extraPassages||0),totalWithBaseline=168+extra;
if(!st||extra!==700||totalWithBaseline!==868)throw new Error('Batch14 runtime totals invalid '+JSON.stringify(st));
if(typeof window.V11_APPLY_EASY_SUPPORT_NOTES==='function')window.V11_APPLY_EASY_SUPPORT_NOTES();
window.V11_BATCH14_STATE={...st,totalWithBaseline,batch14Passages:50,registered:true,version:'20260910-b14-persistent-r1'};
window.V11_BATCH14_REGISTERED=true;
window.V11_BATCH14_REGISTERED_COUNT=50;
window.V11_BATCH14_LOADED=true;
console.log('[v11 batch14] registered 50 passages atomically; total',totalWithBaseline);
})();
