/* v11 Batch14 atomic registrar: candidate 50 only, no partial registration */
(function(){
  const batch = Array.isArray(window.V11_BATCH14_PASSAGES) ? window.V11_BATCH14_PASSAGES : [];
  if (batch.length !== 50) {
    console.error('[v11 batch14] registration blocked: expected 50, got', batch.length);
    window.V11_BATCH14_REGISTERED = false;
    return;
  }
  if (typeof window.V11_REGISTER_PASSAGES !== 'function') {
    console.error('[v11 batch14] registration blocked: V11_REGISTER_PASSAGES unavailable');
    window.V11_BATCH14_REGISTERED = false;
    return;
  }
  window.V11_REGISTER_PASSAGES(batch);
  window.V11_BATCH14_REGISTERED = true;
  window.V11_BATCH14_REGISTERED_COUNT = 50;
  console.log('[v11 batch14] registered 50 passages atomically');
})();
