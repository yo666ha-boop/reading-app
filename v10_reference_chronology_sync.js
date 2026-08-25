// Chronology bridge for reference slash rows.
// The reference PDFs define slash boundaries; v7 vocabulary chronology may change a nonessential lexeme.
// For early Sunshine G1 passages, v7 allows "nice" before "great". Preserve the reference boundaries while
// synchronizing the learner-visible English/Japanese and A/B evidence to the chronology-safe lexeme.
(function(g){
  const sections=new Set(['Get Ready 2','Get Ready 3','Get Ready 4','PROGRAM 1-1','PROGRAM 1-2','PROGRAM 1-3','PROGRAM 2-3','PROGRAM 3-1','PROGRAM 3-2','PROGRAM 3-3','PROGRAM 4-1','PROGRAM 4-2','PROGRAM 5-1','PROGRAM 5-2','PROGRAM 5-3','PROGRAM 7-1','PROGRAM 7-2']);
  const enNice=s=>typeof s==='string'?s.replace(/\bgreat\b/gi,m=>m[0]==='G'?'Nice':'nice'):s;
  const enGreat=s=>typeof s==='string'?s.replace(/\bnice\b/gi,m=>m[0]==='N'?'Great':'great'):s;
  const plain=s=>String(s||'').replace(/\s*\/\s*/g,' ').replace(/\s+/g,' ').trim();
  const jpNice=s=>typeof s==='string'?s.replace(/すばらしいです/g,'すてきです').replace(/すばらしい/g,'すてき').replace(/すごい！/g,'いいね！').replace(/すごい/g,'いいね'):s;
  function eachQuestion(fn){
    const data=g.V10_SUNSHINE_G1||{};
    for(const sec of sections){const p=data[sec];if(!p)continue;for(const q of (p.questions||[]))fn(q);const m=g.V10_INTERACTION_META&&g.V10_INTERACTION_META[`サンシャイン|1|${sec}`];if(m&&Array.isArray(m.questionSetB))for(const q of m.questionSetB)fn(q);}
    for(const k of Object.keys(g))if(/^V10_INTERACTION_META_SEMANTIC_REPAIRS(?:_\d{3}_\d{3})?$/.test(k)&&g[k]&&typeof g[k]==='object')for(const[key,m]of Object.entries(g[k])){const parts=key.split('|');const sec=parts[parts.length-1];if(parts[0]==='サンシャイン'&&sections.has(sec)&&m&&Array.isArray(m.questionSetB))for(const q of m.questionSetB)fn(q);}
  }
  function prepareLegacyReferenceGreat(referenceSource){
    // Only reverse a chronology replacement when the static reference file proves that the
    // corresponding row actually used "great". This protects legitimate early "nice" such as
    // "Nice to meet you." and "This city is nice." from accidental reversal.
    const greatRows=new Set();
    for(const m of String(referenceSource||'').matchAll(/\{en:'([^'\n]*\bgreat\b[^'\n]*)'/gi))greatRows.add(plain(m[1]));
    const data=g.V10_SUNSHINE_G1||{};let changed=0;
    for(const sec of sections){const p=data[sec];if(!p)continue;p.sentences=(p.sentences||[]).map(s=>{const candidate=enGreat(s);if(candidate!==s&&greatRows.has(plain(candidate))){changed++;return candidate}return s});}
    return {changed,referenceGreatRows:greatRows.size};
  }
  function apply(){
    const data=g.V10_SUNSHINE_G1||{};let passages=0,rows=0;
    for(const sec of sections){const p=data[sec];if(!p)continue;passages++;p.sentences=(p.sentences||[]).map(enNice);if(typeof p.title==='string')p.title=enNice(p.title);if(typeof p.fullTranslation==='string')p.fullTranslation=jpNice(p.fullTranslation);if(Array.isArray(p.slashRows))for(const r of p.slashRows){if(r&&typeof r.en==='string')r.en=enNice(r.en);if(r&&typeof r.jp==='string')r.jp=jpNice(r.jp);rows++;}p.auditNote=String(p.auditNote||'')+' Reference-boundary chronology sync: early great→nice follows v7 order without changing slash boundaries.';}
    eachQuestion(q=>{if(!q)return;for(const k of ['prompt','answer','evidence'])if(typeof q[k]==='string')q[k]=enNice(q[k]);for(const k of ['evidenceJp','reason'])if(typeof q[k]==='string')q[k]=jpNice(q[k]);});
    g.V10_REFERENCE_CHRONOLOGY_SYNC_STATE={passages,rows,version:'v7-nice-before-great-20260825'};
    return g.V10_REFERENCE_CHRONOLOGY_SYNC_STATE;
  }
  g.V10_REFERENCE_CHRONOLOGY_SYNC={sections,prepareLegacyReferenceGreat,apply};
})(typeof window!=='undefined'?window:globalThis);
