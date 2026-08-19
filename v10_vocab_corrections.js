window.V10_VOCAB_CORRECTIONS = [
  {
    textbook:'ニューホライズン',grade:'1',section:'Unit 1-1',english:'sweets',japanese:'甘い菓子',
    basis:'Unit 1 Part 1 textbook booklet explicitly lists sweet(s) and uses Japanese sweets.',
    rule:'explicit textbook form; not automatic plural inflection'
  },
  {
    textbook:'ニューホライズン',grade:'1',section:'Unit 1-2',english:'friends',japanese:'友達',
    basis:'Unit 1 Part 2 textbook booklet explicitly lists friend(s) and uses with my friends.',
    rule:'explicit textbook form; not automatic plural inflection'
  },
  {
    textbook:'ニューホライズン',grade:'1',section:'Unit 1-2',english:'soccer',japanese:'サッカー',
    basis:'Unit 1 Part 2 textbook body explicitly uses I play soccer, but the embedded Unit 1-2 word rows do not expose a separate soccer row.',
    rule:'textbook-confirmed missing base entry; register before passage release'
  },
  {
    textbook:'ニューホライズン',grade:'1',section:'Unit 1-3',english:'comics',japanese:'マンガ',
    basis:'Unit 1 Part 3 textbook booklet explicitly lists comic(s) and uses Do you like comics? / I draw comics, too.',
    rule:'explicit textbook form; not automatic plural inflection'
  },
  {
    textbook:'ニューホライズン',grade:'1',section:'Unit 1-3',english:'lessons',japanese:'レッスン',
    basis:'Unit 1 Part 3 textbook booklet explicitly lists lesson(s) and uses I take swimming lessons.',
    rule:'explicit textbook form; not automatic plural inflection'
  }
];

// Mobile layout hardening for the single-file stage2 shell. Some reviewed
// evidence strings, long English tokens, and native select controls can
// otherwise force WebKit to widen the document beyond the iPhone viewport.
// Keep all content intact while allowing rendered children to shrink/wrap.
(function installV10MobileLayoutGuard(){
  if (typeof document === 'undefined' || document.getElementById('v10-mobile-layout-guard')) return;
  const style = document.createElement('style');
  style.id = 'v10-mobile-layout-guard';
  style.textContent = `
    html,body{width:100%;max-width:100%;min-width:0;overflow-x:hidden}
    .wrap,.panel,.tabpage,.row,.field,.controlbar,.q,.slash,.evidence,.meta,.notice,.fail{max-width:100%;min-width:0}
    .panel *{min-width:0}
    .en,.slash,.q,.evidence,.meta,.notice,.fail,.muted,p,div,span,li,td,th,a{overflow-wrap:anywhere;word-break:break-word}
    pre,code{max-width:100%;white-space:pre-wrap;overflow-wrap:anywhere;word-break:break-word}
    table{max-width:100%;width:100%;table-layout:fixed}
    select,button,input,textarea{max-width:100%;min-width:0}
    @media(max-width:700px){
      .wrap{width:100%}
      .row{width:100%;min-width:0}
      .field{min-width:0!important;flex:1 1 calc(50% - 8px);max-width:100%}
      .field select{display:block;width:100%!important;min-width:0!important;max-width:100%!important}
      .controlbar>*{max-width:100%;white-space:normal}
    }
  `;
  document.head.appendChild(style);
})();
