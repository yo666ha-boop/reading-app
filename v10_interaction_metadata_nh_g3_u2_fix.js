(()=>{const m=window.V10_INTERACTION_META_G3_NH_U2&&window.V10_INTERACTION_META_G3_NH_U2['ニューホライズン|3|Unit 2-3'];if(!m)return;m.questionSetB[4]={prompt:'5. この考えは何につながることがありますか。本文から英語で答えなさい。',answer:'a better product',evidence:'This idea can lead to a better product.',evidenceJp:'この考えはよりよい製品につながることがあります。',reason:'lead to の後ろが a better product です。'};})();

// Load the final grammar-vocabulary chronology sync in the actual app runtime.
// The sync itself waits until the final grammar rewrite bridge has executed, so this static loader may run early.
(()=>{if(window.V10_GRAMMAR_VOCAB_FINAL_SYNC_LOADER)return;window.V10_GRAMMAR_VOCAB_FINAL_SYNC_LOADER=true;const s=document.createElement('script');s.src='v10_grammar_vocab_final_sync.js';s.async=false;s.onerror=()=>{window.V10_GRAMMAR_VOCAB_FINAL_SYNC_LOAD_ERROR='failed to load v10_grammar_vocab_final_sync.js';};document.head.appendChild(s);})();
