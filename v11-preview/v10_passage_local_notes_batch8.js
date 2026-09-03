(function installV10PassageLocalNotesBatch8(){
  const defs=[
    {book:'ニューホライズン',grade:'1',section:'Unit 6-1',english:'the U.K.',japanese:'イギリス',basis:'Canonical v7 contains the U.K.=英国/イギリス; current tokenizer splits the dotted abbreviation, so the exact passage-local phrase note handles U.K. without globally allowing single letters.'},
    {book:'サンシャイン',grade:'1',section:'PROGRAM 7-1',english:'museum',japanese:'博物館',basis:'No standalone museum row is licensed by canonical v7 at this boundary; content-bearing place noun retained passage-locally.'},
    {book:'サンシャイン',grade:'1',section:'PROGRAM 8-3',english:'pastry',japanese:'ペストリー・焼き菓子',basis:'Canonical v7 contains pastry only inside the later phrase pastry chef; standalone current use is retained passage-locally.'},
    {book:'ニューホライズン',grade:'3',section:'Unit 5-2',english:'peaceful',japanese:'平和な',basis:'Canonical v7 has peaceful=平和な at a later boundary; current earlier use retained passage-locally.'},
    {book:'ニューホライズン',grade:'3',section:'Unit 5-3',english:'peaceful',japanese:'平和な',basis:'Canonical v7 has peaceful=平和な at a later boundary; current earlier use retained passage-locally.'},
    {book:'ニューホライズン',grade:'3',section:'Unit 5-2',english:'political',japanese:'政治の・政治的な',basis:'No standalone political row is licensed by canonical v7 at this boundary; content-bearing adjective retained passage-locally.'},
    {book:'ニューホライズン',grade:'3',section:'Unit 5-4',english:'political',japanese:'政治の・政治的な',basis:'No standalone political row is licensed by canonical v7 at this boundary; content-bearing adjective retained passage-locally.'},
    {book:'ニューホライズン',grade:'3',section:'Unit 3-4',english:'protection',japanese:'保護',basis:'No standalone protection row is licensed by canonical v7 at this boundary; content-bearing noun retained passage-locally.'},
    {book:'ニューホライズン',grade:'3',section:'Unit 5-2',english:'protesters',japanese:'抗議する人々',basis:'No standalone protesters row is licensed by canonical v7 at this boundary; content-bearing plural noun retained passage-locally.'},
    {book:'ニューホライズン',grade:'3',section:'Unit 5-3',english:'protesters',japanese:'抗議する人々',basis:'No standalone protesters row is licensed by canonical v7 at this boundary; content-bearing plural noun retained passage-locally.'},
    {book:'ニューホライズン',grade:'1',section:'Unit 4-1',english:'puppy',japanese:'子イヌ',basis:'Canonical v7 has puppy=子イヌ at a later boundary; current earlier use retained passage-locally.'},
    {book:'サンシャイン',grade:'3',section:'PROGRAM 3-2',english:'record',japanese:'記録',basis:'No standalone record row is licensed by canonical v7 at this boundary; content-bearing noun retained passage-locally.'},
    {book:'ニューホライズン',grade:'2',section:'Unit 7-4',english:'safe',japanese:'安全な',basis:'Canonical v7 has safe=安全な at a later boundary; current earlier use retained passage-locally.'},
    {book:'ニューホライズン',grade:'3',section:'Unit 2-4',english:'safe',japanese:'安全な',basis:'Canonical v7 has safe=安全な at a later boundary; current earlier use retained passage-locally.'},
    {book:'ニューホライズン',grade:'3',section:'Unit 3-4',english:'sea',japanese:'海',basis:'Canonical v7 has sea at a later boundary; current earlier use retained passage-locally.'},
    {book:'ニューホライズン',grade:'3',section:'Unit 1-4',english:'sequence',japanese:'順序・一連の流れ',basis:'No standalone sequence row is licensed by canonical v7 at this boundary; content-bearing noun retained passage-locally.'},
    {book:'サンシャイン',grade:'3',section:'PROGRAM 2-3',english:'simple',japanese:'簡単な・単純な',basis:'Canonical v7 has simple at a later boundary; current earlier use retained passage-locally.'},
    {book:'サンシャイン',grade:'3',section:'PROGRAM 4-1',english:'simple',japanese:'簡単な・単純な',basis:'Canonical v7 has simple at a later boundary; current earlier use retained passage-locally.'},
    {book:'サンシャイン',grade:'3',section:'PROGRAM 6-3',english:'single',japanese:'1つの・単一の',basis:'No standalone single row is licensed by canonical v7 at this boundary; retained passage-locally.'},
    {book:'ニューホライズン',grade:'3',section:'Unit 2-4',english:'single',japanese:'1つの・単一の',basis:'No standalone single row is licensed by canonical v7 at this boundary; retained passage-locally.'},
    {book:'ニューホライズン',grade:'3',section:'Unit 2-3',english:'solve',japanese:'解決する',basis:'Canonical v7 has solve at a later boundary; current earlier use retained passage-locally.'},
    {book:'ニューホライズン',grade:'3',section:'Unit 4-4',english:'solve',japanese:'解決する',basis:'Canonical v7 has solve at a later boundary; current earlier use retained passage-locally.'},
    {book:'ニューホライズン',grade:'3',section:'Unit 6-1',english:'solve',japanese:'解決する',basis:'Canonical v7 has solve at a later boundary; current earlier use retained passage-locally.'},
    {book:'サンシャイン',grade:'1',section:'PROGRAM 8-1',english:'supermarket',japanese:'スーパーマーケット',basis:'No standalone supermarket row is licensed by canonical v7 at this boundary; place noun retained passage-locally.'},
    {book:'サンシャイン',grade:'1',section:'PROGRAM 10-2',english:'theater',japanese:'劇場',basis:'No standalone theater row is licensed by canonical v7 at this boundary; place noun retained passage-locally.'},
    {book:'サンシャイン',grade:'1',section:'PROGRAM 8-3',english:'tuna',japanese:'マグロ',basis:'No standalone tuna row is licensed by canonical v7 at this boundary; food noun retained passage-locally.'},
    {book:'ニューホライズン',grade:'2',section:'Unit 6-1',english:'twenty',japanese:'20・20の',basis:'No standalone twenty row is licensed by canonical v7 at this boundary; numeral retained passage-locally rather than globally allowed.'},
    {book:'ニューホライズン',grade:'2',section:'Unit 7-1',english:'UNESCO',japanese:'ユネスコ（国連教育科学文化機関）',basis:'Canonical v7 has UNESCO at a later boundary; acronym retained passage-locally.'}
  ];
  function pools(){return [window.V10_SUNSHINE_G1,window.V10_NEWHORIZON_G1,window.V10_PASSAGES_G2_SS,window.V10_PASSAGES_G2_NH,window.V10_PASSAGES_G3_SS,window.V10_PASSAGES_G3_NH].filter(Boolean);}
  function apply(){let added=0,seen=0;for(const d of defs){for(const pool of pools())for(const m of Object.values(pool||{})){if(!m||String(m.textbook)!==d.book||String(m.grade)!==d.grade||String(m.section)!==d.section)continue;seen++;m.notes=Array.isArray(m.notes)?m.notes:[];if(!m.notes.some(n=>n&&String(n.english||'').toLowerCase()===d.english.toLowerCase())){m.notes.push({english:d.english,japanese:d.japanese,basis:d.basis});added++;}}}window.V10_PASSAGE_LOCAL_NOTES_BATCH8={seen,added,definitions:defs.length};return {seen,added};}
  apply();window.V10_APPLY_PASSAGE_LOCAL_NOTES_BATCH8=apply;
})();
