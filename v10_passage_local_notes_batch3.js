(function installV10PassageLocalNotesBatch3(){
  const defs=[
    {book:'サンシャイン',grade:'1',section:'PROGRAM 6-3',english:'schoolchildren',japanese:'学校に通う子どもたち',basis:'No standalone schoolchildren row in canonical v7; passage-topic noun retained locally.'},
    {book:'ニューホライズン',grade:'3',section:'Unit 3-4',english:'term',japanese:'用語',basis:'No standalone term row in canonical v7; passage-topic noun retained locally.'},
    {book:'ニューホライズン',grade:'3',section:'Unit 4-4',english:'term',japanese:'用語',basis:'No standalone term row in canonical v7; passage-topic noun retained locally.'},
    {book:'サンシャイン',grade:'2',section:'PROGRAM 5-2',english:'architect',japanese:'建築家',basis:'Canonical v7 has architecture=建築 but no architect row; profession noun retained passage-locally.'},
    {book:'サンシャイン',grade:'2',section:'PROGRAM 6-2',english:'deck',japanese:'（船の）甲板',basis:'v7 canonical deck=（船の）甲板 is introduced later inside SS2 PROGRAM6 than this passage boundary.'},
    {book:'サンシャイン',grade:'1',section:'PROGRAM 3-2',english:'skate',japanese:'スケートをする',basis:'No standalone skate row in canonical v7; activity verb retained locally.'},
    {book:'ニューホライズン',grade:'2',section:'Unit 7-1',english:'value',japanese:'価値',basis:'v7 canonical value=価値 is introduced later at NH2 Unit7 Stage Activity 3.'},
    {book:'ニューホライズン',grade:'2',section:'Unit 7-2',english:'value',japanese:'価値',basis:'v7 canonical value=価値 is introduced later at NH2 Unit7 Stage Activity 3.'},
    {book:'ニューホライズン',grade:'2',section:'Unit 5-1',english:'person',japanese:'人, 個人',basis:'v7 canonical person=人, 個人 exists, but current NH2 use precedes NH canonical introduction; passage-local only.'},
    {book:'ニューホライズン',grade:'2',section:'Unit 5-3',english:'person',japanese:'人, 個人',basis:'v7 canonical person=人, 個人 exists, but current NH2 use precedes NH canonical introduction; passage-local only.'},
    {book:'ニューホライズン',grade:'2',section:'Unit 5-4',english:'person',japanese:'人, 個人',basis:'v7 canonical person=人, 個人 exists, but current NH2 use precedes NH canonical introduction; passage-local only.'},
    {book:'サンシャイン',grade:'1',section:'PROGRAM 6-1',english:'pirate',japanese:'海賊',basis:'v7 canonical pirate=海賊 is introduced at SS1 PROGRAM6 6-2, later than current 6-1.'},
    {book:'ニューホライズン',grade:'3',section:'Unit 6-1',english:'project',japanese:'プロジェクト',basis:'No exact standalone project lexical row found for the current NH chronology; content-bearing noun retained locally.'},
    {book:'サンシャイン',grade:'3',section:'PROGRAM 5-2',english:'data',japanese:'データ',basis:'No exact standalone data row is licensed by the current SS chronology; comparison-topic noun retained locally.'},
    {book:'サンシャイン',grade:'1',section:'PROGRAM 4-1',english:'horse',japanese:'馬',basis:'No exact standalone horse row is licensed by the current SS chronology; content-bearing animal noun retained locally.'},
    {book:'ニューホライズン',grade:'3',section:'Unit 5-1',english:'supporters',japanese:'支持者たち',basis:'No exact supporters row is licensed by current NH chronology; passage-topic noun retained locally.'},
    {book:'ニューホライズン',grade:'3',section:'Unit 5-4',english:'supporters',japanese:'支持者たち',basis:'No exact supporters row is licensed by current NH chronology; passage-topic noun retained locally.'}
  ];
  function pools(){return [window.V10_SUNSHINE_G1,window.V10_NEWHORIZON_G1,window.V10_PASSAGES_G2_SS,window.V10_PASSAGES_G2_NH,window.V10_PASSAGES_G3_SS,window.V10_PASSAGES_G3_NH].filter(Boolean);}
  function apply(){let added=0,seen=0;for(const d of defs){for(const pool of pools())for(const m of Object.values(pool||{})){if(!m||String(m.textbook)!==d.book||String(m.grade)!==d.grade||String(m.section)!==d.section)continue;seen++;m.notes=Array.isArray(m.notes)?m.notes:[];if(!m.notes.some(n=>n&&String(n.english||'').toLowerCase()===d.english.toLowerCase())){m.notes.push({english:d.english,japanese:d.japanese,basis:d.basis});added++;}}}window.V10_PASSAGE_LOCAL_NOTES_BATCH3={seen,added,definitions:defs.length};return {seen,added};}
  apply();window.V10_APPLY_PASSAGE_LOCAL_NOTES_BATCH3=apply;
})();
