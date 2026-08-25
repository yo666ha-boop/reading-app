(function installV10PassageLocalNotesBatch5(){
  const defs=[
    {book:'サンシャイン',grade:'3',section:'PROGRAM 6-3',english:'everyday',japanese:'日常の',basis:'No standalone everyday row in canonical v7; here it modifies waste reduction and is retained as a content-bearing adjective.'},
    {book:'ニューホライズン',grade:'2',section:'Unit 5-1',english:'everyday',japanese:'日常の',basis:'No standalone everyday row in canonical v7; here it modifies actions and is retained as a content-bearing adjective.'},
    {book:'ニューホライズン',grade:'3',section:'Unit 5-4',english:'everyday',japanese:'日常の',basis:'No standalone everyday row in canonical v7; here it modifies product and is retained as a content-bearing adjective.'},
    {book:'サンシャイン',grade:'3',section:'PROGRAM 5-2',english:'compares',japanese:'比べる',basis:'No compare/compares row was found in canonical v7; graph-comparison meaning is central to this passage, so the exact surface form is noted passage-locally.'},
    {book:'ニューホライズン',grade:'2',section:'Unit 6-1',english:'compares',japanese:'比べる',basis:'No compare/compares row was found in canonical v7; exact surface form retained passage-locally rather than globally licensing an absent base.'},
    {book:'サンシャイン',grade:'1',section:'PROGRAM 7-2',english:'bus',japanese:'バス',basis:'No standalone bus row in canonical v7 (substring hits are busy/business only); indispensable transport noun retained passage-locally.'},
    {book:'サンシャイン',grade:'2',section:'PROGRAM 5-1',english:'director',japanese:'店長',basis:'No director row in canonical v7; in this bookshop passage the word denotes the shop manager and is retained passage-locally.'},
    {book:'サンシャイン',grade:'3',section:'PROGRAM 3-3',english:'explains',japanese:'説明する',basis:'Canonical v7 introduces explain later than this PROGRAM 3-3 boundary; exact third-person surface form retained passage-locally without promoting it cumulatively.'},
    {book:'ニューホライズン',grade:'2',section:'Unit 4-2',english:'explains',japanese:'説明する',basis:'Canonical v7 introduces explain at Unit 4 Read and Think1/2, later than Unit 4-2; retained passage-locally.'},
    {book:'ニューホライズン',grade:'2',section:'Unit 2-4',english:'gives',japanese:'与える・くれる',basis:'Canonical v7 introduces give-gave at Let’s Read 1, later than Unit 2-4; retained passage-locally where replacing it would distort the flavor-giving relation.'},
    {book:'ニューホライズン',grade:'2',section:'Unit 3-1',english:'gives',japanese:'与える・くれる',basis:'Canonical v7 introduces give-gave at Let’s Read 1, later than Unit 3-1; retained passage-locally.'},
    {book:'ニューホライズン',grade:'2',section:'Unit 3-2',english:'gives',japanese:'与える・くれる',basis:'Canonical v7 introduces give-gave at Let’s Read 1, later than Unit 3-2; retained passage-locally.'},
    {book:'ニューホライズン',grade:'2',section:'Unit 1-4',english:'learn',japanese:'学ぶ・習う',basis:'Canonical v7 NH2 introduction is Unit 3 Read and Think2, later than Unit 1-4; replacing learn mechanically with study would make the final context unnatural, so it is retained passage-locally.'},
    {book:'ニューホライズン',grade:'2',section:'Unit 3-1',english:'learn',japanese:'学ぶ・習う',basis:'Canonical v7 NH2 introduction is Unit 3 Read and Think2, later than Unit 3-1; retained passage-locally because the learn-that construction cannot be safely replaced by study-that.'},
    {book:'ニューホライズン',grade:'2',section:'Unit 3-2',english:'learn',japanese:'学ぶ・習う',basis:'Canonical v7 NH2 introduction is Unit 3 Read and Think2, later than Unit 3-2; retained passage-locally.'}
  ];
  function pools(){return [window.V10_SUNSHINE_G1,window.V10_NEWHORIZON_G1,window.V10_PASSAGES_G2_SS,window.V10_PASSAGES_G2_NH,window.V10_PASSAGES_G3_SS,window.V10_PASSAGES_G3_NH].filter(Boolean);}
  function apply(){let added=0,seen=0;for(const d of defs){for(const pool of pools())for(const m of Object.values(pool||{})){if(!m||String(m.textbook)!==d.book||String(m.grade)!==d.grade||String(m.section)!==d.section)continue;seen++;m.notes=Array.isArray(m.notes)?m.notes:[];if(!m.notes.some(n=>n&&String(n.english||'').toLowerCase()===d.english.toLowerCase())){m.notes.push({english:d.english,japanese:d.japanese,basis:d.basis});added++;}}}window.V10_PASSAGE_LOCAL_NOTES_BATCH5={seen,added,definitions:defs.length};return {seen,added};}
  apply();window.V10_APPLY_PASSAGE_LOCAL_NOTES_BATCH5=apply;
})();
