// Final semantic consistency repairs applied after all numbered runtime repair batches.
// This file does not invent new content except for one verified short G1 passage ending;
// its main job is to normalize multi-sentence evidence into the runtime's verbatim format.
(function(){
  const datasets=[
    ['1','サンシャイン',window.V10_SUNSHINE_G1||{}],
    ['1','ニューホライズン',window.V10_NEWHORIZON_G1||{}],
    ['2','サンシャイン',window.V10_PASSAGES_G2_SS||{}],
    ['2','ニューホライズン',window.V10_PASSAGES_G2_NH||{}],
    ['3','サンシャイン',window.V10_PASSAGES_G3_SS||{}],
    ['3','ニューホライズン',window.V10_PASSAGES_G3_NH||{}]
  ];

  function splitJoinedEvidence(q,sentences){
    if(!q||typeof q.evidence!=='string'||!Array.isArray(sentences))return false;
    const e=q.evidence.trim();
    if(!e||e.includes(' / ')||sentences.includes(e))return false;
    for(let i=0;i<sentences.length;i++){
      for(let j=i+1;j<sentences.length;j++){
        if((sentences[i]+' '+sentences[j]).trim()===e){q.evidence=sentences[i]+' / '+sentences[j];return true;}
        for(let k=j+1;k<sentences.length;k++){
          if((sentences[i]+' '+sentences[j]+' '+sentences[k]).trim()===e){q.evidence=sentences[i]+' / '+sentences[j]+' / '+sentences[k];return true;}
        }
      }
    }
    return false;
  }

  // The repaired G1 NH Unit 4-2 passage had seven sentences. Keep its existing scene and
  // add one simple, already-known-language closing sentence instead of padding with new vocabulary.
  const u42=(window.V10_NEWHORIZON_G1||{})['Unit 4-2'];
  if(u42&&Array.isArray(u42.sentences)&&u42.sentences.length===7){
    u42.sentences.push('We are happy after practice.');
    u42.fullTranslation=String(u42.fullTranslation||'')+' 練習のあと、私たちはうれしいです。';
    u42.slashRows=u42.slashRows||[];
    u42.slashRows.push({en:'We are / happy / after practice.',jp:'私たちは〜です / うれしい / 練習のあと'});
    u42.auditNote=String(u42.auditNote||'')+' 7文で止まっていたため、同じバスケットボール練習場面の自然な終結文を1文追加。';
  }

  // Normalize A-set evidence that names two or three actual sentences without the canonical
  // " / " separator. This makes the evidence checker strict without weakening it.
  for(const[, ,data] of datasets){
    for(const p of Object.values(data)){
      const s=Array.isArray(p&&p.sentences)?p.sentences:[];
      for(const q of (p&&Array.isArray(p.questions)?p.questions:[]))splitJoinedEvidence(q,s);
    }
  }

  // Do the same for every numbered B-set metadata object. Section labels repeat across grades,
  // so use book+section plus actual sentence evidence to identify the intended dataset.
  const metaObjects=[];
  for(const k of Object.keys(window))if(/^V10_INTERACTION_META_SEMANTIC_REPAIRS(?:_\d{3}_\d{3})?$/.test(k)&&window[k]&&typeof window[k]==='object')metaObjects.push(window[k]);
  for(const obj of metaObjects){
    for(const[key,m]of Object.entries(obj)){
      const parts=key.split('|');
      if(parts.length<2||!m||!Array.isArray(m.questionSetB))continue;
      const book=parts[0],sec=parts[parts.length-1];
      const candidates=datasets.filter(([,b,d])=>b===book&&d[sec]).map(([, ,d])=>d[sec]);
      for(const q of m.questionSetB){
        if(candidates.some(p=>Array.isArray(p.sentences)&&p.sentences.includes(String(q.evidence||'').trim())))continue;
        for(const p of candidates)if(splitJoinedEvidence(q,p.sentences||[]))break;
      }
    }
  }
})();
