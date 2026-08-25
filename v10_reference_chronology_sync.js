// Chronology bridge for reference slash rows and passage-local unlearned-word notes.
// Reference PDFs own slash boundaries; canonical v7 owns vocabulary chronology.
(function(g){
  const legacyGreatBySection={
    'Get Ready 2':['Great!'],'Get Ready 3':['Great!'],'Get Ready 4':['Great!'],
    'PROGRAM 1-1':['School is really great.'],'PROGRAM 1-2':['Australia is really great.','School is great.'],'PROGRAM 1-3':['School is really great.'],
    'PROGRAM 2-3':['Great!'],'PROGRAM 3-1':['Winter is great.'],'PROGRAM 3-2':['Great!','Sounds great.'],'PROGRAM 3-3':['Our show is great.'],
    'PROGRAM 4-1':['This picture is great.'],'PROGRAM 4-2':['This picture is great.'],'PROGRAM 5-1':['His drawing is great.','This pajama design is great.'],
    'PROGRAM 5-2':['This picture is great.'],'PROGRAM 5-3':['This event is great.'],'PROGRAM 7-1':['It is a great day.'],'PROGRAM 7-2':['The cake is great.']
  };
  const unlearnedNotes=[
    {textbook:'サンシャイン',grade:'1',section:'PROGRAM 3-3',english:'water',japanese:'水'},
    {textbook:'ニューホライズン',grade:'1',section:'Unit 5-2',english:'water',japanese:'水'},
    {textbook:'ニューホライズン',grade:'1',section:'Unit 8-3',english:'water',japanese:'水'},
    {textbook:'ニューホライズン',grade:'2',section:'Unit 4-2',english:'water',japanese:'水'},
    {textbook:'ニューホライズン',grade:'3',section:'Unit 4-1',english:'water',japanese:'水'},
    {textbook:'ニューホライズン',grade:'3',section:'Unit 4-2',english:'water',japanese:'水'},
    {textbook:'ニューホライズン',grade:'3',section:'Unit 4-4',english:'water',japanese:'水'},
    {textbook:'ニューホライズン',grade:'3',section:'Unit 6-4',english:'water',japanese:'水'},
    {textbook:'サンシャイン',grade:'1',section:'PROGRAM 10-1',english:'idea',japanese:'考え'},
    {textbook:'サンシャイン',grade:'2',section:'PROGRAM 2-3',english:'idea',japanese:'考え'},
    {textbook:'サンシャイン',grade:'2',section:'PROGRAM 5-3',english:'idea',japanese:'考え'},
    {textbook:'サンシャイン',grade:'2',section:'PROGRAM 6-1',english:'idea',japanese:'考え'},
    {textbook:'サンシャイン',grade:'2',section:'PROGRAM 6-2',english:'idea',japanese:'考え'},
    {textbook:'サンシャイン',grade:'2',section:'PROGRAM 6-3',english:'idea',japanese:'考え'}
  ];
  const sections=new Set(Object.keys(legacyGreatBySection));
  const pools=()=>[g.V10_SUNSHINE_G1,g.V10_NEWHORIZON_G1,g.V10_PASSAGES_G2_SS,g.V10_PASSAGES_G2_NH,g.V10_PASSAGES_G3_SS,g.V10_PASSAGES_G3_NH].filter(Boolean);
  const enNice=s=>typeof s==='string'?s.replace(/\bgreat\b/gi,m=>m[0]==='G'?'Nice':'nice'):s;
  const enGreat=s=>typeof s==='string'?s.replace(/\bnice\b/gi,m=>m[0]==='N'?'Great':'great'):s;
  const plain=s=>String(s||'').replace(/\s*\/\s*/g,' ').replace(/\s+/g,' ').trim();
  const jpNice=s=>typeof s==='string'?s.replace(/すてきなです/g,'すてきです').replace(/すばらしいです/g,'すてきです').replace(/すばらしい/g,'すてき').replace(/すごい！/g,'いいね！').replace(/すごい/g,'いいね'):s;
  function eachQuestion(fn){const data=g.V10_SUNSHINE_G1||{};for(const sec of sections){const p=data[sec];if(!p)continue;for(const q of(p.questions||[]))fn(q);const m=g.V10_INTERACTION_META&&g.V10_INTERACTION_META[`サンシャイン|1|${sec}`];if(m&&Array.isArray(m.questionSetB))for(const q of m.questionSetB)fn(q);}for(const k of Object.keys(g))if(/^V10_INTERACTION_META_SEMANTIC_REPAIRS(?:_\d{3}_\d{3})?$/.test(k)&&g[k]&&typeof g[k]==='object')for(const[key,m]of Object.entries(g[k])){const parts=key.split('|'),sec=parts[parts.length-1];if(parts[0]==='サンシャイン'&&sections.has(sec)&&m&&Array.isArray(m.questionSetB))for(const q of m.questionSetB)fn(q);}}
  function applyUnlearnedNotes(){let targets=0,added=0,missing=0;for(const n of unlearnedNotes){let hit=false;for(const pool of pools())for(const p of Object.values(pool||{})){if(!p||String(p.textbook)!==n.textbook||String(p.grade)!==n.grade||String(p.section)!==n.section)continue;hit=true;targets++;const corpus=[...(p.sentences||[]),...((p.slashRows||[]).map(r=>r&&r.en)),...((p.questions||[]).flatMap(q=>[q&&q.prompt,q&&q.answer,q&&q.evidence]))].join(' ');const re=new RegExp('(^|[^A-Za-z])'+n.english+'([^A-Za-z]|$)','i');if(!re.test(corpus)){missing++;continue;}p.notes=Array.isArray(p.notes)?p.notes:[];if(!p.notes.some(x=>x&&String(x.english||'').toLowerCase()===n.english)){p.notes.push({english:n.english,japanese:n.japanese,scope:'passage-only-unlearned',basis:'retained because replacing this content-bearing noun would distort passage meaning; vocabulary remains non-cumulative'});added++;}}if(!hit)missing++;}g.V10_UNLEARNED_NOTES_STATE={definitions:unlearnedNotes.length,targets,added,missing};return g.V10_UNLEARNED_NOTES_STATE;}
  function prepareLegacyReferenceGreat(referenceSource){applyUnlearnedNotes();const documented=new Set();for(const m of String(referenceSource||'').matchAll(/\{en:'([^'\n]*\bgreat\b[^'\n]*)'/gi))documented.add(plain(m[1]));const data=g.V10_SUNSHINE_G1||{};let changed=0,expected=0;for(const sec of sections){const p=data[sec];if(!p)continue;const allowed=new Set((legacyGreatBySection[sec]||[]).map(plain));expected+=allowed.size;p.sentences=(p.sentences||[]).map(s=>{const candidate=enGreat(s);if(candidate!==s&&allowed.has(plain(candidate))){changed++;return candidate}return s});}return {changed,expected,referenceGreatRows:documented.size};}
  function apply(){const data=g.V10_SUNSHINE_G1||{};let passages=0,rows=0;for(const sec of sections){const p=data[sec];if(!p)continue;passages++;p.sentences=(p.sentences||[]).map(enNice);if(typeof p.title==='string')p.title=enNice(p.title);if(typeof p.fullTranslation==='string')p.fullTranslation=jpNice(p.fullTranslation);if(Array.isArray(p.slashRows))for(const r of p.slashRows){if(r&&typeof r.en==='string')r.en=enNice(r.en);if(r&&typeof r.jp==='string')r.jp=jpNice(r.jp);rows++;}p.auditNote=String(p.auditNote||'')+' Reference-boundary chronology sync: early great→nice follows v7 order without changing slash boundaries.';}eachQuestion(q=>{if(!q)return;for(const k of['prompt','answer','evidence'])if(typeof q[k]==='string')q[k]=enNice(q[k]);for(const k of['evidenceJp','reason'])if(typeof q[k]==='string')q[k]=jpNice(q[k]);});const noteState=applyUnlearnedNotes();g.V10_REFERENCE_CHRONOLOGY_SYNC_STATE={passages,rows,noteState,version:'v7-nice-before-great-20260825'};return g.V10_REFERENCE_CHRONOLOGY_SYNC_STATE;}
  g.V10_REFERENCE_CHRONOLOGY_SYNC={sections,legacyGreatBySection,unlearnedNotes,applyUnlearnedNotes,prepareLegacyReferenceGreat,apply};
})(typeof window!=='undefined'?window:globalThis);
