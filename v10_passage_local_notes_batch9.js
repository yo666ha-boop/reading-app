(function installV10PassageLocalNotesBatch9(){
  const defs=[
    {book:'サンシャイン',grade:'2',section:'PROGRAM 5-3',english:'advice',japanese:'助言・アドバイス',basis:'No standalone advice row is licensed by canonical v7 at this boundary; retained passage-locally.'},
    {book:'ニューホライズン',grade:'2',section:'Unit 7-2',english:'cape',japanese:'岬',basis:'Canonical v7 places cape later than this current use; retained passage-locally.'},
    {book:'サンシャイン',grade:'2',section:'PROGRAM 6-3',english:'classroom',japanese:'教室',basis:'No standalone classroom row is licensed by canonical v7 at this boundary; retained passage-locally.'},
    {book:'サンシャイン',grade:'3',section:'PROGRAM 6-2',english:'cleanup',japanese:'清掃・片づけ',basis:'Canonical v7 places cleanup later than this current use; retained passage-locally.'},
    {book:'サンシャイン',grade:'3',section:'PROGRAM 6-3',english:'cleanup',japanese:'清掃・片づけ',basis:'Canonical v7 places cleanup later than this current use; retained passage-locally.'},
    {book:'ニューホライズン',grade:'2',section:'Unit 6-1',english:'comparison',japanese:'比較',basis:'No standalone comparison row is licensed by canonical v7 at this boundary; retained passage-locally.'},
    {book:'ニューホライズン',grade:'3',section:'Unit 1-4',english:'comparison',japanese:'比較',basis:'No standalone comparison row is licensed by canonical v7 at this boundary; retained passage-locally.'},
    {book:'ニューホライズン',grade:'2',section:'Unit 2-1',english:'corn',japanese:'トウモロコシ',basis:'No standalone corn row is licensed by canonical v7 at this boundary; retained passage-locally.'},
    {book:'サンシャイン',grade:'3',section:'PROGRAM 3-2',english:'crowd',japanese:'群衆・人ごみ',basis:'No standalone crowd row is licensed by canonical v7 at this boundary; retained passage-locally.'},
    {book:'ニューホライズン',grade:'2',section:'Unit 2-3',english:'crowd',japanese:'群衆・人ごみ',basis:'No standalone crowd row is licensed by canonical v7 at this boundary; retained passage-locally.'},
    {book:'ニューホライズン',grade:'3',section:'Unit 5-3',english:'crowd',japanese:'群衆・人ごみ',basis:'No standalone crowd row is licensed by canonical v7 at this boundary; retained passage-locally.'},
    {book:'サンシャイン',grade:'1',section:'PROGRAM 4-1',english:'elephant',japanese:'ゾウ',basis:'No standalone elephant row is licensed by canonical v7 at this boundary; retained passage-locally.'},
    {book:'サンシャイン',grade:'1',section:'PROGRAM 4-2',english:'field',japanese:'野原・競技場',basis:'Canonical v7 places field later than this current use; retained passage-locally.'},
    {book:'ニューホライズン',grade:'2',section:'Unit 2-4',english:'fresh',japanese:'新鮮な',basis:'No standalone fresh row is licensed by canonical v7 at this boundary; retained passage-locally.'},
    {book:'サンシャイン',grade:'1',section:'Get Ready 4',english:'gym',japanese:'体育館',basis:'No standalone gym row is licensed by canonical v7 at this boundary; retained passage-locally.'},
    {book:'サンシャイン',grade:'1',section:'Get Ready 4',english:'high',japanese:'高い',basis:'Canonical v7 places high later than this current use; retained passage-locally.'},
    {book:'サンシャイン',grade:'1',section:'PROGRAM 1-1',english:'high',japanese:'高い',basis:'Canonical v7 places high later than this current use; retained passage-locally.'},
    {book:'サンシャイン',grade:'1',section:'PROGRAM 5-2',english:'hockey',japanese:'ホッケー',basis:'Canonical v7 places hockey later than this current use; retained passage-locally.'},
    {book:'サンシャイン',grade:'1',section:'PROGRAM 5-3',english:'hospital',japanese:'病院',basis:'No standalone hospital row is licensed by canonical v7 at this boundary; retained passage-locally.'},
    {book:'サンシャイン',grade:'1',section:'PROGRAM 5-2',english:'ice',japanese:'氷',basis:'Canonical v7 places ice later than this current use; retained passage-locally.'},
    {book:'ニューホライズン',grade:'2',section:'Unit 5-2',english:'machine',japanese:'機械',basis:'No standalone machine row is licensed by canonical v7 at this boundary; retained passage-locally.'},
    {book:'ニューホライズン',grade:'2',section:'Unit 1-4',english:'mosque',japanese:'モスク',basis:'Canonical v7 places mosque later than this current use; retained passage-locally.'},
    {book:'ニューホライズン',grade:'2',section:'Unit 3-2',english:'product',japanese:'製品・商品',basis:'Canonical v7 places product later than this current use; retained passage-locally.'},
    {book:'ニューホライズン',grade:'2',section:'Unit 7-1',english:'protect',japanese:'守る・保護する',basis:'Canonical v7 places protect later than this current use; retained passage-locally.'},
    {book:'ニューホライズン',grade:'2',section:'Unit 7-2',english:'protect',japanese:'守る・保護する',basis:'Canonical v7 places protect later than this current use; retained passage-locally.'},
    {book:'ニューホライズン',grade:'3',section:'Unit 2-3',english:'reused',japanese:'再利用された',basis:'No standalone reused row is licensed by canonical v7 at this boundary; retained passage-locally.'},
    {book:'サンシャイン',grade:'2',section:'PROGRAM 3-3',english:'stall',japanese:'屋台・売店',basis:'No standalone stall row is licensed by canonical v7 at this boundary; retained passage-locally.'},
    {book:'サンシャイン',grade:'1',section:'PROGRAM 8-3',english:'stand',japanese:'売店・屋台',basis:'Canonical v7 places stand later than this current use; runtime context is a food/vendor stand, retained passage-locally.'},
    {book:'サンシャイン',grade:'1',section:'PROGRAM 4-2',english:'track',japanese:'競走路・トラック',basis:'Canonical v7 places track later than this current use; retained passage-locally.'}
  ];
  function pools(){return [window.V10_SUNSHINE_G1,window.V10_NEWHORIZON_G1,window.V10_PASSAGES_G2_SS,window.V10_PASSAGES_G2_NH,window.V10_PASSAGES_G3_SS,window.V10_PASSAGES_G3_NH].filter(Boolean);}
  function apply(){let added=0,seen=0;for(const d of defs){for(const pool of pools())for(const m of Object.values(pool||{})){if(!m||String(m.textbook)!==d.book||String(m.grade)!==d.grade||String(m.section)!==d.section)continue;seen++;m.notes=Array.isArray(m.notes)?m.notes:[];if(!m.notes.some(n=>n&&String(n.english||'').toLowerCase()===d.english.toLowerCase())){m.notes.push({english:d.english,japanese:d.japanese,basis:d.basis});added++;}}}window.V10_PASSAGE_LOCAL_NOTES_BATCH9={seen,added,definitions:defs.length};return {seen,added};}
  apply();window.V10_APPLY_PASSAGE_LOCAL_NOTES_BATCH9=apply;
})();
