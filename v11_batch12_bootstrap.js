(function bootstrapV11Batch12(){
'use strict';
if(window.V11_BATCH12_LOADED||window.V11_BATCH12_BOOTSTRAP_LOADING)return;
window.V11_BATCH12_BOOTSTRAP_LOADING=true;
const files=['v11_batch12_runtime_bundle.js','v11_batch12_register.js'];
function load(src){return new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=src;s.async=false;s.onload=resolve;s.onerror=()=>reject(new Error('Batch12 script load failed: '+src));document.head.appendChild(s);});}
(async()=>{try{
  for(const f of files)await load(f);
  const ps=window.V11_BATCH12_PASSAGES||[],st=window.V11_BATCH12_STATE;
  if(ps.length!==50||!window.V11_BATCH12_LOADED||!st||st.registered!==true||st.totalWithBaseline!==768||st.batch12Passages!==50||st.humanReviewedQuestions!==500||st.slashReviewedPassages!==50)throw new Error('Batch12 final state invalid '+JSON.stringify(st));
  window.V11_BATCH12_BOOTSTRAP_STATE={version:'20260901-b12-r7-final',files:files.length,loaded:true,total:768,registered:true};
  if(typeof window.render==='function')window.render();
}catch(e){window.V11_BATCH12_BOOTSTRAP_ERROR=String(e&&e.stack||e);console.error(e);throw e;}finally{window.V11_BATCH12_BOOTSTRAP_LOADING=false;}})();
})();
