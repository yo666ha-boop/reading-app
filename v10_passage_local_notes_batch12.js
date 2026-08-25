(function installV10PassageLocalNotesBatch12(){
  const defs=[
    {book:'サンシャイン',grade:'3',section:'PROGRAM 2-2',english:'months',japanese:'（暦上での）月',basis:'The canonical v7 master contains month=（暦上での）月 in NH1 U3, but no same-textbook SS chronology entry licenses months here. Retained only in this passage with a nonblank gloss; the plural surface form is not promoted into cumulative vocabulary.'}
  ];
  function pools(){return [window.V10_SUNSHINE_G1,window.V10_NEWHORIZON_G1,window.V10_PASSAGES_G2_SS,window.V10_PASSAGES_G2_NH,window.V10_PASSAGES_G3_SS,window.V10_PASSAGES_G3_NH].filter(Boolean);}
  function apply(){let added=0,seen=0;for(const d of defs){for(const pool of pools())for(const m of Object.values(pool||{})){if(!m||String(m.textbook)!==d.book||String(m.grade)!==d.grade||String(m.section)!==d.section)continue;seen++;m.notes=Array.isArray(m.notes)?m.notes:[];if(!m.notes.some(n=>n&&String(n.english||'').toLowerCase()===d.english.toLowerCase())){m.notes.push({english:d.english,japanese:d.japanese,basis:d.basis});added++;}}}window.V10_PASSAGE_LOCAL_NOTES_BATCH12={seen,added,definitions:defs.length};return {seen,added};}
  apply();window.V10_APPLY_PASSAGE_LOCAL_NOTES_BATCH12=apply;
})();
