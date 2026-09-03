(function bootstrapV11Batch13(){
'use strict';
if(window.V11_BATCH13_LOADED||window.V11_BATCH13_BOOTSTRAP_LOADING)return;
window.V11_BATCH13_BOOTSTRAP_LOADING=true;
const files=['v11_batch13_runtime_bundle.js','v11_batch13_register.js'];
function load(src){return new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=src;s.async=false;s.onload=resolve;s.onerror=()=>reject(new Error('Batch13 script load failed: '+src));document.head.appendChild(s);});}
(async()=>{try{
  for(const f of files)await load(f);
  const ps=window.V11_BATCH13_PASSAGES||[],st=window.V11_BATCH13_STATE;
  if(ps.length!==50||!window.V11_BATCH13_LOADED||!st||st.registered!==true||st.totalWithBaseline!==818||st.batch13Passages!==50||st.humanReviewedPassages!==50||st.humanReviewedQuestions!==500||st.slashReviewedPassages!==50)throw new Error('Batch13 final state invalid '+JSON.stringify(st));
  window.V11_BATCH13_BOOTSTRAP_STATE={version:'20260903-b13-final',files:files.length,loaded:true,total:818,registered:true};
  if(typeof window.render==='function')window.render();
}catch(e){window.V11_BATCH13_BOOTSTRAP_ERROR=String(e&&e.stack||e);console.error(e);throw e;}finally{window.V11_BATCH13_BOOTSTRAP_LOADING=false;}})();
})();
