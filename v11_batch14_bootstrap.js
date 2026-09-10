/* v11 Batch14 persistent bootstrap. Loads the already-gated 50-passage JSON, then atomically registers it. */
(function(){
  if (window.V11_BATCH14_BOOTSTRAP_STARTED) return;
  window.V11_BATCH14_BOOTSTRAP_STARTED = true;
  fetch('./v11_batch14_assembled_draft.json', {cache:'no-store'})
    .then(function(r){ if(!r.ok) throw new Error('HTTP '+r.status); return r.json(); })
    .then(function(batch){
      if (!Array.isArray(batch) || batch.length !== 50) throw new Error('Batch14 must contain exactly 50 passages');
      window.V11_BATCH14_PASSAGES = batch;
      var s=document.createElement('script');
      s.src='./v11_batch14_register.js';
      s.onload=function(){ window.dispatchEvent(new Event('v11-passages-updated')); };
      s.onerror=function(){ console.error('[v11 batch14] registrar load failed'); window.V11_BATCH14_REGISTERED=false; };
      document.head.appendChild(s);
    })
    .catch(function(e){ console.error('[v11 batch14] bootstrap failed', e); window.V11_BATCH14_REGISTERED=false; });
})();
