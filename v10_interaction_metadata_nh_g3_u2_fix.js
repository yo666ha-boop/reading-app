(()=>{const m=window.V10_INTERACTION_META_G3_NH_U2&&window.V10_INTERACTION_META_G3_NH_U2['ニューホライズン|3|Unit 2-3'];if(!m)return;m.questionSetB[4]={prompt:'5. この考えは何につながることがありますか。本文から英語で答えなさい。',answer:'a better product',evidence:'This idea can lead to a better product.',evidenceJp:'この考えはよりよい製品につながることがあります。',reason:'lead to の後ろが a better product です。'};})();

// Load bounded final chronology syncs in the actual app runtime.
// They wait until the final grammar rewrite bridge has executed, so these static loaders may run early.
(()=>{
 const files=[['V10_GRAMMAR_VOCAB_FINAL_SYNC_LOADER','v10_grammar_vocab_final_sync.js','V10_GRAMMAR_VOCAB_FINAL_SYNC_LOAD_ERROR'],['V10_GRAMMAR_ADDITIONAL_FUTURE_SYNC_LOADER','v10_grammar_additional_future_sync.js','V10_GRAMMAR_ADDITIONAL_FUTURE_SYNC_LOAD_ERROR']];
 for(const [flag,src,errKey] of files){if(window[flag])continue;window[flag]=true;const s=document.createElement('script');s.src=src;s.async=false;s.onerror=()=>{window[errKey]='failed to load '+src;};document.head.appendChild(s);}
})();
