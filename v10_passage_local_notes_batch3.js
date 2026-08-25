(function installV10PassageLocalNotesBatch3(){
  const defs=[
    {book:'サンシャイン',grade:'3',section:'PROGRAM 5-1',english:'compare',japanese:'比較する',basis:'No standalone compare row in canonical v7; retained as content-bearing local verb.'},
    {book:'サンシャイン',grade:'3',section:'PROGRAM 5-2',english:'compare',japanese:'比較する',basis:'No standalone compare row in canonical v7; retained as content-bearing local verb.'},
    {book:'ニューホライズン',grade:'2',section:'Unit 6-3',english:'compare',japanese:'比較する',basis:'No standalone compare row in canonical v7; retained as content-bearing local verb.'},
    {book:'ニューホライズン',grade:'3',section:'Unit 1-1',english:'compare',japanese:'比較する',basis:'No standalone compare row in canonical v7; retained as content-bearing local verb.'},
    {book:'ニューホライズン',grade:'3',section:'Unit 1-4',english:'compare',japanese:'比較する',basis:'No standalone compare row in canonical v7; retained as content-bearing local verb.'},
    {book:'ニューホライズン',grade:'3',section:'Unit 3-3',english:'compare',japanese:'比較する',basis:'No standalone compare row in canonical v7; retained as content-bearing local verb.'},
    {book:'サンシャイン',grade:'1',section:'PROGRAM 6-1',english:'detective',japanese:'探偵',basis:'v7 canonical detective=探偵 is introduced later in SS1 P6 chronology.'},
    {book:'ニューホライズン',grade:'3',section:'Unit 3-3',english:'road',japanese:'道路',basis:'v7 NH3 canonical road=道路 is introduced later at Let’s Read 1.'},
    {book:'ニューホライズン',grade:'3',section:'Unit 4-1',english:'route',japanese:'経路',basis:'No standalone route row in canonical v7; content-bearing local noun.'},
    {book:'ニューホライズン',grade:'3',section:'Unit 4-3',english:'route',japanese:'経路',basis:'No standalone route row in canonical v7; content-bearing local noun.'},
    {book:'サンシャイン',grade:'3',section:'PROGRAM 1-1',english:'vegetables',japanese:'野菜',basis:'v7 contains fried vegetables=野菜炒め later in SS3 P1; standalone vegetables is not yet cumulatively licensed here.'},
    {book:'サンシャイン',grade:'3',section:'PROGRAM 1-2',english:'vegetables',japanese:'野菜',basis:'v7 contains fried vegetables=野菜炒め later in SS3 P1; standalone vegetables is not yet cumulatively licensed here.'},
    {book:'サンシャイン',grade:'3',section:'PROGRAM 4-2',english:'visitors',japanese:'訪問者たち',basis:'No visitor/visitors row in canonical v7; content-bearing local noun.'},
    {book:'サンシャイン',grade:'3',section:'PROGRAM 4-3',english:'visitors',japanese:'訪問者たち',basis:'No visitor/visitors row in canonical v7; content-bearing local noun.'},
    {book:'ニューホライズン',grade:'2',section:'Unit 5-4',english:'visitors',japanese:'訪問者たち',basis:'No visitor/visitors row in canonical v7; content-bearing local noun.'},
    {book:'ニューホライズン',grade:'2',section:'Unit 7-4',english:'visitors',japanese:'訪問者たち',basis:'No visitor/visitors row in canonical v7; content-bearing local noun.'},
    {book:'サンシャイン',grade:'1',section:'PROGRAM 2-1',english:'bicycle',japanese:'自転車',basis:'v7 has bicycle=自転車 in NH3 only; cross-textbook promotion is forbidden.'},
    {book:'サンシャイン',grade:'1',section:'PROGRAM 5-3',english:'event',japanese:'出来事, 行事',basis:'v7 has event=出来事, 行事 in NH1 only; cross-textbook promotion is forbidden.'},
    {book:'ニューホライズン',grade:'2',section:'Unit 0',english:'house',japanese:'家',basis:'Canonical v7 has only the SS phrase the Opera House, not an NH cumulative standalone house row.'},
    {book:'ニューホライズン',grade:'2',section:'Unit 4-1',english:'house',japanese:'家',basis:'Canonical v7 has only the SS phrase the Opera House, not an NH cumulative standalone house row.'}
  ];
  function pools(){return [window.V10_SUNSHINE_G1,window.V10_NEWHORIZON_G1,window.V10_PASSAGES_G2_SS,window.V10_PASSAGES_G2_NH,window.V10_PASSAGES_G3_SS,window.V10_PASSAGES_G3_NH].filter(Boolean);}
  function apply(){let added=0,seen=0;for(const d of defs){for(const pool of pools())for(const m of Object.values(pool||{})){if(!m||String(m.textbook)!==d.book||String(m.grade)!==d.grade||String(m.section)!==d.section)continue;seen++;m.notes=Array.isArray(m.notes)?m.notes:[];if(!m.notes.some(n=>n&&String(n.english||'').toLowerCase()===d.english.toLowerCase())){m.notes.push({english:d.english,japanese:d.japanese,basis:d.basis});added++;}}}window.V10_PASSAGE_LOCAL_NOTES_BATCH3={seen,added,definitions:defs.length};return {seen,added};}
  apply();window.V10_APPLY_PASSAGE_LOCAL_NOTES_BATCH3=apply;
})();
