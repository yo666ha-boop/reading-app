// Chronology bridge for reference slash rows.
// The reference PDFs define slash boundaries; v7 vocabulary chronology may change a nonessential lexeme.
// For early Sunshine G1 passages, v7 allows "nice" before "great". Preserve those authored boundaries while
// synchronizing the learner-visible English/Japanese and A/B evidence to the chronology-safe lexeme.
(function(g){
  const legacyGreatBySection={
    'Get Ready 2':['Great!'],
    'Get Ready 3':['Great!'],
    'Get Ready 4':['Great!'],
    'PROGRAM 1-1':['School is really great.'],
    'PROGRAM 1-2':['Australia is really great.','School is great.'],
    'PROGRAM 1-3':['School is really great.'],
    'PROGRAM 2-3':['Great!'],
    'PROGRAM 3-1':['Winter is great.'],
    'PROGRAM 3-2':['Great!','Sounds great.'],
    'PROGRAM 3-3':['Our show is great.'],
    'PROGRAM 4-1':['This picture is great.'],
    'PROGRAM 4-2':['This picture is great.'],
    'PROGRAM 5-1':['His drawing is great.','This pajama design is great.'],
    'PROGRAM 5-2':['This picture is great.'],
    'PROGRAM 5-3':['This event is great.'],
    'PROGRAM 7-1':['It is a great day.'],
    'PROGRAM 7-2':['The cake is great.']
  };
  const sections=new Set(Object.keys(legacyGreatBySection));
  const enNice=s=>typeof s==='string'?s.replace(/\bgreat\b/gi,m=>m[0]==='G'?'Nice':'nice'):s;
  const enGreat=s=>typeof s==='string'?s.replace(/\bnice\b/gi,m=>m[0]==='N'?'Great':'great'):s;
  const plain=s=>String(s||'').replace(/\s*\/\s*/g,' ').replace(/\s+/g,' ').trim();
  const jpNice=s=>typeof s==='string'?s
    .replace(/すてきなです/g,'すてきです')
    .replace(/すばらしいです/g,'すてきです')
    .replace(/すばらしい/g,'すてき')
    .replace(/すごい！/g,'いいね！')
    .replace(/すごい/g,'いいね'):s;
  function eachQuestion(fn){
    const data=g.V10_SUNSHINE_G1||{};
    for(const sec of sections){const p=data[sec];if(!p)continue;for(const q of (p.questions||[]))fn(q);const m=g.V10_INTERACTION_META&&g.V10_INTERACTION_META[`サンシャイン|1|${sec}`];if(m&&Array.isArray(m.questionSetB))for(const q of m.questionSetB)fn(q);}
    for(const k of Object.keys(g))if(/^V10_INTERACTION_META_SEMANTIC_REPAIRS(?:_\d{3}_\d{3})?$/.test(k)&&g[k]&&typeof g[k]==='object')for(const[key,m]of Object.entries(g[k])){const parts=key.split('|');const sec=parts[parts.length-1];if(parts[0]==='サンシャイン'&&sections.has(sec)&&m&&Array.isArray(m.questionSetB))for(const q of m.questionSetB)fn(q);}
  }
  function prepareLegacyReferenceGreat(referenceSource){
    // Reverse only exact Great sentences documented for the same affected section. A global
    // Nice->Great transform is forbidden because legitimate early expressions such as
    // "Nice to meet you." and "This city is nice." must remain unchanged.
    const documented=new Set();
    for(const m of String(referenceSource||'').matchAll(/\{en:'([^'\n]*\bgreat\b[^'\n]*)'/gi))documented.add(plain(m[1]));
    const data=g.V10_SUNSHINE_G1||{};let changed=0,expected=0;
    for(const sec of sections){const p=data[sec];if(!p)continue;const allowed=new Set((legacyGreatBySection[sec]||[]).map(plain));expected+=allowed.size;p.sentences=(p.sentences||[]).map(s=>{const candidate=enGreat(s);if(candidate!==s&&allowed.has(plain(candidate))){changed++;return candidate}return s});}
    return {changed,expected,referenceGreatRows:documented.size};
  }
  function apply(){
    const data=g.V10_SUNSHINE_G1||{};let passages=0,rows=0;
    for(const sec of sections){const p=data[sec];if(!p)continue;passages++;p.sentences=(p.sentences||[]).map(enNice);if(typeof p.title==='string')p.title=enNice(p.title);if(typeof p.fullTranslation==='string')p.fullTranslation=jpNice(p.fullTranslation);if(Array.isArray(p.slashRows))for(const r of p.slashRows){if(r&&typeof r.en==='string')r.en=enNice(r.en);if(r&&typeof r.jp==='string')r.jp=jpNice(r.jp);rows++;}p.auditNote=String(p.auditNote||'')+' Reference-boundary chronology sync: early great→nice follows v7 order without changing slash boundaries.';}
    eachQuestion(q=>{if(!q)return;for(const k of ['prompt','answer','evidence'])if(typeof q[k]==='string')q[k]=enNice(q[k]);for(const k of ['evidenceJp','reason'])if(typeof q[k]==='string')q[k]=jpNice(q[k]);});
    g.V10_REFERENCE_CHRONOLOGY_SYNC_STATE={passages,rows,version:'v7-nice-before-great-20260825'};
    return g.V10_REFERENCE_CHRONOLOGY_SYNC_STATE;
  }
  g.V10_REFERENCE_CHRONOLOGY_SYNC={sections,legacyGreatBySection,prepareLegacyReferenceGreat,apply};
})(typeof window!=='undefined'?window:globalThis);
