(function installV10PassageLocalNotesBatch6(){
  const defs=[
    {book:'サンシャイン',grade:'2',section:'PROGRAM 6-2',english:'paw',japanese:'（動物の）足',basis:'Canonical v7 has paw=（動物の）足 in the later PROGRAM6 textbook-body boundary; current PROGRAM 6-2 use is retained passage-locally.'},
    {book:'サンシャイン',grade:'1',section:'PROGRAM 9-4',english:'reindeer',japanese:'トナカイ',basis:'Canonical v7 has reindeer=トナカイ at the later PROGRAM9 textbook-body boundary; current PROGRAM 9-4 use is retained passage-locally.'},
    {book:'サンシャイン',grade:'1',section:'PROGRAM 6-3',english:'savanna',japanese:'サバンナ',basis:'Canonical v7 has savanna=サバンナ at the later PROGRAM6 textbook-body boundary; current PROGRAM 6-3 use is retained passage-locally.'},
    {book:'サンシャイン',grade:'1',section:'PROGRAM 7-2',english:'shop',japanese:'店',basis:'No standalone shop row is licensed by canonical v7 for this section; indispensable location noun retained passage-locally.'},
    {book:'ニューホライズン',grade:'3',section:'Unit 4-1',english:'supplies',japanese:'必需品',basis:'Canonical v7 has supply-supplies=必需品 at Unit6 Part1, later than Unit4-1; retained passage-locally.'},
    {book:'ニューホライズン',grade:'3',section:'Unit 4-2',english:'supplies',japanese:'必需品',basis:'Canonical v7 has supply-supplies=必需品 at Unit6 Part1, later than Unit4-2; retained passage-locally.'},
    {book:'ニューホライズン',grade:'3',section:'Unit 4-4',english:'supplies',japanese:'必需品',basis:'Canonical v7 has supply-supplies=必需品 at Unit6 Part1, later than Unit4-4; retained passage-locally.'},
    {book:'ニューホライズン',grade:'3',section:'Unit 5-1',english:'banknote',japanese:'紙幣',basis:'No standalone banknote row is licensed in canonical v7 at this boundary; content-bearing noun retained passage-locally.'},
    {book:'サンシャイン',grade:'1',section:'PROGRAM 7-2',english:'cake',japanese:'ケーキ',basis:'No standalone cake row is licensed by canonical v7 for this section; food noun retained passage-locally.'},
    {book:'ニューホライズン',grade:'1',section:'Unit 9-3',english:'charm',japanese:'お守り',basis:'No standalone charm row is licensed by canonical v7 for this section; runtime context explicitly uses charm as お守り, so it is retained passage-locally.'},
    {book:'ニューホライズン',grade:'3',section:'Unit 0',english:'classmate',japanese:'クラスメート',basis:'No standalone classmate row is licensed by canonical v7 at Unit0; indispensable person-role noun retained passage-locally.'},
    {book:'サンシャイン',grade:'1',section:'PROGRAM 10-3',english:'comic',japanese:'漫画',basis:'No standalone comic row is licensed by canonical v7 for this section; content-bearing noun retained passage-locally.'}
  ];
  function pools(){return [window.V10_SUNSHINE_G1,window.V10_NEWHORIZON_G1,window.V10_PASSAGES_G2_SS,window.V10_PASSAGES_G2_NH,window.V10_PASSAGES_G3_SS,window.V10_PASSAGES_G3_NH].filter(Boolean);}
  function apply(){let added=0,seen=0;for(const d of defs){for(const pool of pools())for(const m of Object.values(pool||{})){if(!m||String(m.textbook)!==d.book||String(m.grade)!==d.grade||String(m.section)!==d.section)continue;seen++;m.notes=Array.isArray(m.notes)?m.notes:[];if(!m.notes.some(n=>n&&String(n.english||'').toLowerCase()===d.english.toLowerCase())){m.notes.push({english:d.english,japanese:d.japanese,basis:d.basis});added++;}}}window.V10_PASSAGE_LOCAL_NOTES_BATCH6={seen,added,definitions:defs.length};return {seen,added};}
  apply();window.V10_APPLY_PASSAGE_LOCAL_NOTES_BATCH6=apply;
})();
