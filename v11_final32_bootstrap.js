/* v11 FINAL32 persistent bootstrap; intentionally inert until loaded by the registered Batch16 chain. */
(function(){
'use strict';
if(window.V11_FINAL32_BOOTSTRAP_STARTED||window.V11_FINAL32_REGISTERED)return;
window.V11_FINAL32_BOOTSTRAP_STARTED=true;
var b=document.createElement('script');
b.src='./v11_final32_runtime_bundle.js';
b.onload=function(){
  var r=document.createElement('script');
  r.src='./v11_final32_register.js';
  r.onerror=function(){window.V11_FINAL32_BOOTSTRAP_ERROR='registrar load failed';console.error('[v11 FINAL32] registrar load failed');};
  document.head.appendChild(r);
};
b.onerror=function(){window.V11_FINAL32_BOOTSTRAP_ERROR='runtime bundle load failed';console.error('[v11 FINAL32] runtime bundle load failed');};
document.head.appendChild(b);
})();