// Deliberately retained out-of-chronology lexical items.
// These are passage-local only: they do not become cumulative vocabulary and must carry a JP gloss.
(function(g){
  const NOTES=[
    ...['PROGRAM 3-3'].map(section=>({textbook:'サンシャイン',grade:'1',section,english:'water',japanese:'水',basis:'content-bearing noun; v7 SS first exposes water inside a later water phrase'})),
    ...['Unit 5-2','Unit 8-3'].map(section=>({textbook:'ニューホライズン',grade:'1',section,english:'water',japanese:'水',basis:'content-bearing noun; v7 NH standalone chronology is later than this passage'})),
    ...['Unit 4-2'].map(section=>({textbook:'ニューホライズン',grade:'2',section,english:'water',japanese:'水',basis:'content-bearing noun; retained with passage-local gloss'})),
    ...['Unit 4-1','Unit 4-2','Unit 4-4','Unit 6-4'].map(section=>({textbook:'ニューホライズン',grade:'3',section,english:'water',japanese:'水',basis:'content-bearing noun; retained with passage-local gloss'})),
    ...['PROGRAM 10-1'].map(section=>({textbook:'サンシャイン',grade:'1',section,english:'idea',japanese:'考え',basis:'content-bearing noun; v7 canonical idea is introduced later'})),
    ...['PROGRAM 2-3','PROGRAM 5-3','PROGRAM 6-1','PROGRAM 6-2','PROGRAM 6-3'].map(section=>({textbook:'サンシャイン',grade:'2',section,english:'idea',japanese:'考え',basis:'content-bearing noun; retained with passage-local gloss until v7 introduction'}))
  ];
  const pools=()=>[g.V10_SUNSHINE_G1,g.V10_NEWHORIZON_G1,g.V10_PASSAGES_G2_SS,g.V10_PASSAGES_G2_NH,g.V10_PASSAGES_G3_SS,g.V10_PASSAGES_G3_NH].filter(Boolean);
  const tokenRe=w=>new RegExp('(^|[^A-Za-z])'+String(w).replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'([^A-Za-z]|$)','i');
  function apply(){let targets=0,added=0,missing=0;for(const n of NOTES){let found=false;for(const pool of pools())for(const m of Object.values(pool||{})){if(!m||String(m.textbook)!==n.textbook||String(m.grade)!==n.grade||String(m.section)!==n.section)continue;found=true;targets++;const corpus=[...(m.sentences||[]),...((m.slashRows||[]).map(r=>r&&r.en)),...((m.questions||[]).flatMap(q=>[q&&q.prompt,q&&q.answer,q&&q.evidence]))].join(' ');if(!tokenRe(n.english).test(corpus)){missing++;continue;}m.notes=Array.isArray(m.notes)?m.notes:[];if(!m.notes.some(x=>x&&String(x.english||'').toLowerCase()===n.english.toLowerCase())){m.notes.push({english:n.english,japanese:n.japanese,basis:n.basis,scope:'passage-only-unlearned'});added++;}}if(!found)missing++;}g.V10_UNLEARNED_NOTES_STATE={definitions:NOTES.length,targets,added,missing};return g.V10_UNLEARNED_NOTES_STATE;}
  g.V10_UNLEARNED_NOTES=NOTES;g.V10_APPLY_UNLEARNED_NOTES=apply;apply();
})(typeof window!=='undefined'?window:globalThis);
