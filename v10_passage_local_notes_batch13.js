(function installV10PassageLocalNotesBatch13(){
  const defs=[
    {book:'サンシャイン',grade:'1',section:'PROGRAM 9-2',english:'afternoon',japanese:'午後',basis:'Not licensed by same-textbook v7 chronology at this passage; retained only here with gloss.'},
    {book:'サンシャイン',grade:'3',section:'PROGRAM 6-1',english:'area',japanese:'地域',basis:'Not licensed by same-textbook v7 chronology at this passage; retained only here with gloss.'},
    {book:'サンシャイン',grade:'3',section:'PROGRAM 4-3',english:'Asia',japanese:'アジア',basis:'Future-v7 lexical item at this passage; passage-local note only.'},
    {book:'ニューホライズン',grade:'3',section:'Unit 5-2',english:'attack',japanese:'攻撃する',basis:'Not licensed by same-textbook v7 chronology at this passage; passage-local note only.'},
    {book:'ニューホライズン',grade:'3',section:'Unit 5-4',english:'attack',japanese:'攻撃する',basis:'Not licensed by same-textbook v7 chronology at this passage; passage-local note only.'},
    {book:'ニューホライズン',grade:'3',section:'Unit 5-1',english:'attacking',japanese:'攻撃している',basis:'Surface form is not licensed by same-textbook v7 chronology here; passage-local note only.'},
    {book:'サンシャイン',grade:'3',section:'PROGRAM 4-3',english:'automatic',japanese:'自動の',basis:'Not licensed by same-textbook v7 chronology at this passage; passage-local note only.'},
    {book:'サンシャイン',grade:'1',section:'Get Ready 4',english:'ball',japanese:'ボール',basis:'Future-v7 lexical item at this passage; passage-local note only.'},
    {book:'サンシャイン',grade:'1',section:'PROGRAM 4-3',english:'banana',japanese:'バナナ',basis:'Not licensed by same-textbook v7 chronology at this passage; passage-local note only.'},
    {book:'サンシャイン',grade:'3',section:'PROGRAM 6-2',english:'beach',japanese:'海岸',basis:'Not licensed by same-textbook v7 chronology at this passage; passage-local note only.'},
    {book:'ニューホライズン',grade:'3',section:'Unit 5-1',english:'believed',japanese:'信じた',basis:'Surface form is not licensed by same-textbook v7 chronology here; passage-local note only.'},
    {book:'ニューホライズン',grade:'2',section:'Unit 3-4',english:'brown',japanese:'茶色の',basis:'Not licensed by same-textbook v7 chronology at this passage; passage-local note only.'},
    {book:'サンシャイン',grade:'1',section:'PROGRAM 5-3',english:'charity',japanese:'慈善',basis:'Future-v7 lexical item at this passage; passage-local note only.'},
    {book:'サンシャイン',grade:'3',section:'PROGRAM 5-3',english:'connected',japanese:'つながった',basis:'Future-v7 lexical item/surface form at this passage; passage-local note only.'},
    {book:'ニューホライズン',grade:'3',section:'Unit 5-1',english:'connected',japanese:'つながった',basis:'Future-v7 lexical item/surface form at this passage; passage-local note only.'},
    {book:'ニューホライズン',grade:'3',section:'Unit 1-4',english:'connection',japanese:'つながり',basis:'Not licensed by same-textbook v7 chronology at this passage; passage-local note only.'},
    {book:'ニューホライズン',grade:'3',section:'Unit 3-4',english:'conservation',japanese:'保護',basis:'Not licensed by same-textbook v7 chronology at this passage; passage-local note only.'},
    {book:'ニューホライズン',grade:'3',section:'Unit 2-4',english:'consumers',japanese:'消費者',basis:'Future-v7 lexical item/surface form at this passage; passage-local note only.'},
    {book:'ニューホライズン',grade:'3',section:'Unit 2-2',english:'continued',japanese:'続けた',basis:'Future-v7 lexical item/surface form at this passage; passage-local note only.'},
    {book:'ニューホライズン',grade:'3',section:'Unit 3-1',english:'continues',japanese:'続く',basis:'Future-v7 lexical item/surface form at this passage; passage-local note only.'},
    {book:'サンシャイン',grade:'3',section:'PROGRAM 4-1',english:'conversation',japanese:'会話',basis:'Not licensed by same-textbook v7 chronology at this passage; passage-local note only.'},
    {book:'ニューホライズン',grade:'3',section:'Unit 4-3',english:'damaged',japanese:'損傷した',basis:'Future-v7 lexical item/surface form at this passage; passage-local note only.'},
    {book:'ニューホライズン',grade:'3',section:'Unit 3-3',english:'dangerous',japanese:'危険な',basis:'Future-v7 lexical item at this passage; passage-local note only.'},
    {book:'ニューホライズン',grade:'3',section:'Unit 3-1',english:'decline',japanese:'減少',basis:'Not licensed by same-textbook v7 chronology at this passage; passage-local note only.'},
    {book:'サンシャイン',grade:'3',section:'PROGRAM 3-3',english:'development',japanese:'発展',basis:'Not licensed by same-textbook v7 chronology at this passage; passage-local note only.'},
    {book:'ニューホライズン',grade:'2',section:'Unit 4-4',english:'done',japanese:'終えた・された',basis:'Future-v7 surface form at this passage; passage-local note only.'},
    {book:'サンシャイン',grade:'3',section:'PROGRAM 4-3',english:'door',japanese:'ドア',basis:'Future-v7 lexical item at this passage; passage-local note only.'},
    {book:'サンシャイン',grade:'3',section:'PROGRAM 7-1',english:'dream',japanese:'夢',basis:'Not licensed by same-textbook v7 chronology at this passage; passage-local note only.'},
    {book:'サンシャイン',grade:'1',section:'PROGRAM 5-1',english:'economics',japanese:'経済学',basis:'Not licensed by same-textbook v7 chronology at this passage; passage-local note only.'},
    {book:'サンシャイン',grade:'2',section:'PROGRAM 5-2',english:'elevator',japanese:'エレベーター',basis:'Not licensed by same-textbook v7 chronology at this passage; passage-local note only.'},
    {book:'ニューホライズン',grade:'3',section:'Unit 4-1',english:'emergency',japanese:'緊急事態',basis:'Future-v7 lexical item at this passage; passage-local note only.'}
  ];
  function pools(){return [window.V10_SUNSHINE_G1,window.V10_NEWHORIZON_G1,window.V10_PASSAGES_G2_SS,window.V10_PASSAGES_G2_NH,window.V10_PASSAGES_G3_SS,window.V10_PASSAGES_G3_NH].filter(Boolean);}
  function apply(){let added=0,seen=0;for(const d of defs){for(const pool of pools())for(const m of Object.values(pool||{})){if(!m||String(m.textbook)!==d.book||String(m.grade)!==d.grade||String(m.section)!==d.section)continue;seen++;m.notes=Array.isArray(m.notes)?m.notes:[];if(!m.notes.some(n=>n&&String(n.english||'').toLowerCase()===d.english.toLowerCase())){m.notes.push({english:d.english,japanese:d.japanese,basis:d.basis});added++;}}}window.V10_PASSAGE_LOCAL_NOTES_BATCH13={seen,added,definitions:defs.length};return {seen,added};}
  apply();window.V10_APPLY_PASSAGE_LOCAL_NOTES_BATCH13=apply;
})();
