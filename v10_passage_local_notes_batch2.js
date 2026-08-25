(function installV10PassageLocalNotesBatch2(){
  const defs=[
    {book:'サンシャイン',grade:'2',section:'PROGRAM 8-3',english:'badge',japanese:'バッジ',basis:'v7 SS2 P8 canonical row 3393; current use is earlier than its exact v7 subunit boundary.'},
    {book:'ニューホライズン',grade:'3',section:'Unit 4-1',english:'checklist',japanese:'チェックリスト',basis:'No standalone checklist row in canonical v7; content-bearing local noun.'},
    {book:'ニューホライズン',grade:'3',section:'Unit 4-2',english:'checklist',japanese:'チェックリスト',basis:'No standalone checklist row in canonical v7; content-bearing local noun.'},
    {book:'サンシャイン',grade:'3',section:'PROGRAM 6-1',english:'ocean',japanese:'大洋, 海',basis:'Canonical v7 has ocean meaning; SS3 exact introduction is later inside PROGRAM 6, so early use remains local-note only.'},
    {book:'サンシャイン',grade:'3',section:'PROGRAM 6-3',english:'ocean',japanese:'大洋, 海',basis:'Canonical v7 has ocean meaning; exact chronology scanner still places these occurrences before the registered boundary.'},
    {book:'ニューホライズン',grade:'3',section:'Unit 2-1',english:'production',japanese:'生産',basis:'No standalone production row in canonical v7; content-bearing local noun.'},
    {book:'ニューホライズン',grade:'3',section:'Unit 2-3',english:'production',japanese:'生産',basis:'No standalone production row in canonical v7; content-bearing local noun.'},
    {book:'ニューホライズン',grade:'3',section:'Unit 2-4',english:'production',japanese:'生産',basis:'No standalone production row in canonical v7; content-bearing local noun.'},
    {book:'ニューホライズン',grade:'3',section:'Unit 6-4',english:'production',japanese:'生産',basis:'No standalone production row in canonical v7; content-bearing local noun.'},
    {book:'サンシャイン',grade:'3',section:'PROGRAM 1-2',english:'race',japanese:'競走, レース',basis:'v7 canonical race=競走, レース; exact SS3 introduction is later than this passage.'},
    {book:'サンシャイン',grade:'3',section:'PROGRAM 3-2',english:'race',japanese:'競走, レース',basis:'v7 canonical race=競走, レース; exact SS3 introduction is later than this passage.'},
    {book:'サンシャイン',grade:'3',section:'PROGRAM 3-3',english:'race',japanese:'競走, レース',basis:'v7 canonical race=競走, レース; exact SS3 introduction is later than this passage.'},
    {book:'ニューホライズン',grade:'3',section:'Unit 3-3',english:'researchers',japanese:'研究者たち',basis:'v7 has researcher=研究者, 調査者 only in SS3; cross-textbook promotion is forbidden, so NH use stays passage-local.'},
    {book:'ニューホライズン',grade:'3',section:'Unit 3-4',english:'researchers',japanese:'研究者たち',basis:'v7 has researcher=研究者, 調査者 only in SS3; cross-textbook promotion is forbidden, so NH use stays passage-local.'},
    {book:'ニューホライズン',grade:'2',section:'Unit 7-4',english:'trash',japanese:'ごみ',basis:'v7 canonical meaning is trash=ごみ in SS3; no NH cumulative row exists, so this is local-note only.'},
    {book:'ニューホライズン',grade:'2',section:'Unit 7-3',english:'white',japanese:'白い',basis:'No standalone white row in canonical v7; content-bearing color adjective retained locally.'},
    {book:'サンシャイン',grade:'1',section:'Get Ready 4',english:'basketball',japanese:'バスケットボール',basis:'v7 has basketball=バスケットボール in NH1 only; cross-textbook promotion is forbidden.'},
    {book:'ニューホライズン',grade:'1',section:'Unit 8-2',english:'straw',japanese:'ストロー',basis:'v7 canonical straw=ストロー is introduced later in NH1 Unit 8 chronology than this passage.'}
  ];
  function pools(){return [window.V10_SUNSHINE_G1,window.V10_NEWHORIZON_G1,window.V10_PASSAGES_G2_SS,window.V10_PASSAGES_G2_NH,window.V10_PASSAGES_G3_SS,window.V10_PASSAGES_G3_NH].filter(Boolean);}
  function apply(){let added=0,seen=0;for(const d of defs){for(const pool of pools())for(const m of Object.values(pool||{})){if(!m||String(m.textbook)!==d.book||String(m.grade)!==d.grade||String(m.section)!==d.section)continue;seen++;m.notes=Array.isArray(m.notes)?m.notes:[];if(!m.notes.some(n=>n&&String(n.english||'').toLowerCase()===d.english.toLowerCase())){m.notes.push({english:d.english,japanese:d.japanese,basis:d.basis});added++;}}}window.V10_PASSAGE_LOCAL_NOTES_BATCH2={seen,added,definitions:defs.length};return {seen,added};}
  apply();
  window.V10_APPLY_PASSAGE_LOCAL_NOTES_BATCH2=apply;
})();
