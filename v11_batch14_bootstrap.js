/* v11 Batch14 persistent bootstrap. Loads the already-gated 50-passage JSON,
   normalizes candidate-only structural fields to the proven Batch13 runtime schema,
   then atomically registers the unchanged passage content. */
(function(){
  'use strict';
  if (window.V11_BATCH14_BOOTSTRAP_STARTED) return;
  window.V11_BATCH14_BOOTSTRAP_STARTED = true;

  var BOOKS = [
    {prefix:'New Horizon ', runtime:'ニューホライズン', anchor:'New Horizon'},
    {prefix:'Sunshine ', runtime:'サンシャイン', anchor:'Sunshine'},
    {prefix:'Here We Go! ', runtime:'Here We Go!', anchor:'Here We Go!'},
    {prefix:'Here We Go ', runtime:'Here We Go!', anchor:'Here We Go!'},
    {prefix:'ONE WORLD ', runtime:'ONE WORLD', anchor:'ONE WORLD'},
    {prefix:'One World ', runtime:'ONE WORLD', anchor:'ONE WORLD'},
    {prefix:'BLUE SKY ', runtime:'BLUE SKY', anchor:'BLUE SKY'},
    {prefix:'Blue Sky ', runtime:'BLUE SKY', anchor:'BLUE SKY'},
    {prefix:'NEW CROWN ', runtime:'NEW CROWN', anchor:'NEW CROWN'},
    {prefix:'New Crown ', runtime:'NEW CROWN', anchor:'NEW CROWN'}
  ];

  function normalizeQuestion(q,set,no){
    var out=Object.assign({},q);
    out.set=set;
    out.no=no;
    return out;
  }

  function normalizePassage(p){
    var m=/^V11-B14-G([123])-/.exec(String(p.id||''));
    if(!m) throw new Error('Batch14 invalid grade id '+String(p.id));
    var grade=m[1];
    var rawAnchor=String(p.anchor||'').trim();
    var book=BOOKS.find(function(b){return rawAnchor.indexOf(b.prefix)===0;});
    if(!book) throw new Error('Batch14 unsupported anchor '+p.id+': '+rawAnchor);
    var section=rawAnchor.slice(book.prefix.length).trim();
    if(!section) throw new Error('Batch14 missing section '+p.id);
    if(!Array.isArray(p.slashRows)||!p.slashRows.length) throw new Error('Batch14 missing slashRows '+p.id);

    var sentences=p.slashRows.map(function(r){return String(r.english||r.en||'').trim();}).filter(Boolean);
    if(!sentences.length) throw new Error('Batch14 missing sentences '+p.id);
    var slashRows=p.slashRows.map(function(r){
      return {
        en:String(r.english||r.en||''),
        jp:String(r.japanese||r.jp||''),
        humanReview:r.humanReview||'B14_HUMAN_SLASH_PASS',
        alignmentShape:r.alignmentShape||'1:1'
      };
    });
    var qa=(p.questions||[]).map(function(q,i){return normalizeQuestion(q,'A',i+1);});
    var qb=(p.questionSetB||[]).map(function(q,i){return normalizeQuestion(q,'B',i+1);});
    if(qa.length!==5||qb.length!==5) throw new Error('Batch14 '+p.id+' requires A/B 5 questions');

    return Object.assign({},p,{
      anchor:{textbook:book.anchor,grade:Number(grade),unit:section},
      registered:false,
      sentences:sentences,
      slashRows:slashRows,
      questions:qa,
      questionSetB:qb,
      textbook:book.runtime,
      grade:grade,
      section:section,
      batch:'V11-B14',
      finalHumanQuestionReview:true,
      finalSlashHumanReview:'B14_SLASH_HUMAN_REVIEW_PASS'
    });
  }

  fetch('./v11_batch14_assembled_draft.json', {cache:'no-store'})
    .then(function(r){ if(!r.ok) throw new Error('HTTP '+r.status); return r.json(); })
    .then(function(payload){
      var raw=Array.isArray(payload)?payload:(payload&&Array.isArray(payload.passages)?payload.passages:null);
      if (!Array.isArray(raw) || raw.length !== 50) throw new Error('Batch14 must contain exactly 50 passages');
      var batch=raw.map(normalizePassage);
      if(new Set(batch.map(function(p){return p.id;})).size!==50) throw new Error('Batch14 duplicate IDs after normalization');
      window.V11_BATCH14_PASSAGES = batch;
      var s=document.createElement('script');
      s.src='./v11_batch14_register.js';
      s.onload=function(){ window.dispatchEvent(new Event('v11-passages-updated')); };
      s.onerror=function(){ console.error('[v11 batch14] registrar load failed'); window.V11_BATCH14_REGISTERED=false; };
      document.head.appendChild(s);
    })
    .catch(function(e){ console.error('[v11 batch14] bootstrap failed', e); window.V11_BATCH14_REGISTERED=false; });
})();
