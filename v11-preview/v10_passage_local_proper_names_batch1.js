(function installV10PassageLocalProperNamesBatch1(){
  const defs=[
    {book:'ニューホライズン',grade:'1',section:'Unit 6-2',names:['Riko'],basis:'proper names: passage-local person name only; capitalization required by scanner; never cumulative'},
    {book:'ニューホライズン',grade:'3',section:'Unit 0',names:['Yuki'],basis:'proper names: passage-local person name only; capitalization required by scanner; never cumulative'},
    {book:'サンシャイン',grade:'3',section:'PROGRAM 3-1',names:['Ken'],basis:'proper names: passage-local person name only; capitalization required by scanner; never cumulative'},
    {book:'ニューホライズン',grade:'2',section:'Unit 3-4',names:['Ken'],basis:'proper names: passage-local person name only; capitalization required by scanner; never cumulative'}
  ];
  function pools(){return [window.V10_SUNSHINE_G1,window.V10_NEWHORIZON_G1,window.V10_PASSAGES_G2_SS,window.V10_PASSAGES_G2_NH,window.V10_PASSAGES_G3_SS,window.V10_PASSAGES_G3_NH].filter(Boolean);}
  function apply(){let added=0,seen=0;for(const d of defs){for(const pool of pools())for(const m of Object.values(pool||{})){if(!m||String(m.textbook)!==d.book||String(m.grade)!==d.grade||String(m.section)!==d.section)continue;seen++;m.allowedWords=Array.isArray(m.allowedWords)?m.allowedWords:[];const text=d.names.join(' / ');if(!m.allowedWords.some(r=>Array.isArray(r)&&/proper\s*names?/i.test(String(r[1]||''))&&String(r[0]||'')===text)){m.allowedWords.push([text,d.basis]);added++;}}}window.V10_PASSAGE_LOCAL_PROPER_NAMES_BATCH1={seen,added,definitions:defs.length};return {seen,added};}
  apply();window.V10_APPLY_PASSAGE_LOCAL_PROPER_NAMES_BATCH1=apply;
})();
