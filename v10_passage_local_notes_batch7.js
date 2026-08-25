(function installV10PassageLocalNotesBatch7(){
  const defs=[
    {book:'サンシャイン',grade:'3',section:'PROGRAM 4-3',english:'communication',japanese:'コミュニケーション',basis:'Canonical v7 has no standalone communication row; content-bearing noun retained passage-locally.'},
    {book:'サンシャイン',grade:'3',section:'PROGRAM 7-2',english:'communication',japanese:'コミュニケーション',basis:'Canonical v7 has no standalone communication row; content-bearing noun retained passage-locally.'},
    {book:'サンシャイン',grade:'3',section:'PROGRAM 7-3',english:'communication',japanese:'コミュニケーション',basis:'Canonical v7 has no standalone communication row; content-bearing noun retained passage-locally.'},
    {book:'ニューホライズン',grade:'3',section:'Unit 3-1',english:'damage',japanese:'損害（を与える）',basis:'Canonical v7 has damage=~に損害を与える at a later Unit boundary; retained passage-locally at current earlier use.'},
    {book:'ニューホライズン',grade:'3',section:'Unit 3-4',english:'damage',japanese:'損害（を与える）',basis:'Canonical v7 has damage=~に損害を与える at a later Unit boundary; retained passage-locally at current earlier use.'},
    {book:'ニューホライズン',grade:'3',section:'Unit 5-4',english:'damage',japanese:'損害（を与える）',basis:'Canonical v7 has damage=~に損害を与える at a later Unit boundary; retained passage-locally at current earlier use.'},
    {book:'サンシャイン',grade:'3',section:'PROGRAM 3-3',english:'diet',japanese:'食生活・食事',basis:'No standalone diet row is licensed by canonical v7; content-bearing noun retained passage-locally.'},
    {book:'サンシャイン',grade:'3',section:'PROGRAM 5-2',english:'difference',japanese:'違い',basis:'No standalone difference row is licensed by canonical v7 at this boundary; retained passage-locally.'},
    {book:'ニューホライズン',grade:'2',section:'Unit 6-3',english:'difference',japanese:'違い',basis:'No standalone difference row is licensed by canonical v7 at this boundary; retained passage-locally.'},
    {book:'サンシャイン',grade:'2',section:'PROGRAM 5-2',english:'earthquake',japanese:'地震',basis:'Canonical v7 has earthquake=地震 at a later boundary; current earlier use is retained passage-locally.'},
    {book:'ニューホライズン',grade:'2',section:'Unit 5-1',english:'easily',japanese:'簡単に',basis:'No standalone easily row is licensed by canonical v7 at this boundary; retained passage-locally.'},
    {book:'ニューホライズン',grade:'2',section:'Unit 5-2',english:'easily',japanese:'簡単に',basis:'No standalone easily row is licensed by canonical v7 at this boundary; retained passage-locally.'},
    {book:'ニューホライズン',grade:'2',section:'Unit 5-1',english:'handle',japanese:'〜を処理する',basis:'Canonical v7 has handle=~を処理する only at a later boundary; current Unit5-1 use is retained passage-locally.'},
    {book:'サンシャイン',grade:'3',section:'PROGRAM 7-2',english:'human',japanese:'人間',basis:'No standalone human row is licensed by canonical v7 at this boundary; content-bearing noun retained passage-locally.'}
  ];
  function pools(){return [window.V10_SUNSHINE_G1,window.V10_NEWHORIZON_G1,window.V10_PASSAGES_G2_SS,window.V10_PASSAGES_G2_NH,window.V10_PASSAGES_G3_SS,window.V10_PASSAGES_G3_NH].filter(Boolean);}
  function apply(){let added=0,seen=0;for(const d of defs){for(const pool of pools())for(const m of Object.values(pool||{})){if(!m||String(m.textbook)!==d.book||String(m.grade)!==d.grade||String(m.section)!==d.section)continue;seen++;m.notes=Array.isArray(m.notes)?m.notes:[];if(!m.notes.some(n=>n&&String(n.english||'').toLowerCase()===d.english.toLowerCase())){m.notes.push({english:d.english,japanese:d.japanese,basis:d.basis});added++;}}}window.V10_PASSAGE_LOCAL_NOTES_BATCH7={seen,added,definitions:defs.length};return {seen,added};}
  apply();window.V10_APPLY_PASSAGE_LOCAL_NOTES_BATCH7=apply;
})();
