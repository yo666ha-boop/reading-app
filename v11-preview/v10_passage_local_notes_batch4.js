(function installV10PassageLocalNotesBatch4(){
  const defs=[
    {book:'ニューホライズン',grade:'1',section:'Unit 4-1',english:'New Zealand',japanese:'ニュージーランド',basis:'Canonical v7 has New Zealand=ニュージーランド, but its canonical introduction is later than NH1 Unit 4-1; phrase retained passage-locally.'},
    {book:'サンシャイン',grade:'1',section:'PROGRAM 4-1',english:'ant',japanese:'アリ',basis:'No standalone ant row in canonical v7; indispensable animal noun retained passage-locally.'},
    {book:'サンシャイン',grade:'2',section:'PROGRAM 6-2',english:'boat shoe',japanese:'デッキシューズ',basis:'Canonical v7 has boat shoe=デッキシューズ later than the current SS2 PROGRAM 6-2 boundary; phrase retained passage-locally.'},
    {book:'ニューホライズン',grade:'1',section:'Unit 10-1',english:'chorus contest',japanese:'合唱コンクール',basis:'Canonical v7 has chorus contest=合唱コンクール later than the current NH1 Unit 10-1 boundary; phrase retained passage-locally.'},
    {book:'ニューホライズン',grade:'1',section:'Unit 10-2',english:'chorus contest',japanese:'合唱コンクール',basis:'Canonical v7 has chorus contest=合唱コンクール later than the current NH1 Unit 10-2 boundary; phrase retained passage-locally.'},
    {book:'ニューホライズン',grade:'3',section:'Unit 4-3',english:'community',japanese:'地域社会',basis:'No standalone community row in canonical v7; content-bearing noun retained passage-locally.'},
    {book:'ニューホライズン',grade:'2',section:'Unit 4-4',english:'shoes',japanese:'靴',basis:'Canonical v7 has boat shoe as a phrase but no standalone shoes row licensed at this NH2 boundary; indispensable noun retained passage-locally.'}
  ];
  function pools(){return [window.V10_SUNSHINE_G1,window.V10_NEWHORIZON_G1,window.V10_PASSAGES_G2_SS,window.V10_PASSAGES_G2_NH,window.V10_PASSAGES_G3_SS,window.V10_PASSAGES_G3_NH].filter(Boolean);}
  function apply(){let added=0,seen=0;for(const d of defs){for(const pool of pools())for(const m of Object.values(pool||{})){if(!m||String(m.textbook)!==d.book||String(m.grade)!==d.grade||String(m.section)!==d.section)continue;seen++;m.notes=Array.isArray(m.notes)?m.notes:[];if(!m.notes.some(n=>n&&String(n.english||'').toLowerCase()===d.english.toLowerCase())){m.notes.push({english:d.english,japanese:d.japanese,basis:d.basis});added++;}}}window.V10_PASSAGE_LOCAL_NOTES_BATCH4={seen,added,definitions:defs.length};return {seen,added};}
  apply();window.V10_APPLY_PASSAGE_LOCAL_NOTES_BATCH4=apply;
})();
