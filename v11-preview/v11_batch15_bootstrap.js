/* v11 Batch15 persistent bootstrap: load the already-gated 50-passage runtime candidate and register it after Batch14. */
(function(){
  'use strict';
  if (window.V11_BATCH15_BOOTSTRAP_STARTED) return;
  window.V11_BATCH15_BOOTSTRAP_STARTED = true;

  function fail(msg){
    window.V11_BATCH15_PERSISTENT_REGISTERED = false;
    window.V11_BATCH15_BOOTSTRAP_ERROR = String(msg);
    console.error('[v11 batch15] bootstrap failed', msg);
  }

  fetch('./V11_BATCH15_RUNTIME_CANDIDATE.json', {cache:'no-store'})
    .then(function(r){ if(!r.ok) throw new Error('HTTP '+r.status); return r.json(); })
    .then(function(payload){
      var batch = Array.isArray(payload) ? payload : (payload && Array.isArray(payload.passages) ? payload.passages : null);
      if (!Array.isArray(batch) || batch.length !== 50) throw new Error('Batch15 must contain exactly 50 passages');
      if (new Set(batch.map(function(p){ return p.id; })).size !== 50) throw new Error('Batch15 duplicate IDs');
      batch.forEach(function(p){
        if (!p || !/^V11-B15-/.test(String(p.id||''))) throw new Error('Batch15 invalid id '+String(p&&p.id));
        if (!Array.isArray(p.slashRows) || !p.slashRows.length) throw new Error('Batch15 missing slashRows '+p.id);
        if (!Array.isArray(p.questions) || p.questions.length !== 5 || !Array.isArray(p.questionSetB) || p.questionSetB.length !== 5) throw new Error('Batch15 requires A/B 5 questions '+p.id);
        p.questions.concat(p.questionSetB).forEach(function(q){
          ['answer','evidence','evidenceJp','reason'].forEach(function(k){ if(!String(q&&q[k]||'').trim()) throw new Error('Batch15 '+p.id+' missing '+k); });
        });
      });
      if (typeof window.V11_REGISTER_PASSAGES !== 'function') throw new Error('V11_REGISTER_PASSAGES unavailable');
      window.V11_REGISTER_PASSAGES(batch);
      var st = window.V11_MULTI_PASSAGE_STATE || {};
      var extra = Array.isArray(st.extraPassages) ? st.extraPassages.length : Number(st.extraPassages||0);
      if (extra !== 750) throw new Error('Batch15 persistent extraPassages expected 750, got '+extra);
      window.V11_BATCH15_PERSISTENT_REGISTERED = true;
      window.V11_BATCH15_BOOTSTRAP_STATE = {version:'20260919-b15-persistent-r2', registered:true, batch15Passages:50, extraPassages:750, totalWithBaseline:918};
      if (typeof window.render === 'function') window.render();
      window.dispatchEvent(new Event('v11-passages-updated'));
    })
    .catch(function(e){ fail(e&&e.stack||e); });
})();
