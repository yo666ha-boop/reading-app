// Final semantic consistency repairs applied after all numbered runtime repair batches.
// Also rebuild every slash-reading row by natural meaning chunks: never force a slash
// between be + complement, auxiliary + verb, or a simple transitive verb + object.
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

  const u42=(window.V10_NEWHORIZON_G1||{})['Unit 4-2'];
  if(u42&&Array.isArray(u42.sentences)&&u42.sentences.length===7){
    u42.sentences.push('We are happy after practice.');
    u42.fullTranslation=String(u42.fullTranslation||'')+' 練習のあと、私たちはうれしいです。';
    u42.slashRows=u42.slashRows||[];
    u42.slashRows.push({en:'We are happy after practice.',jp:'練習のあと、私たちはうれしいです。'});
    u42.auditNote=String(u42.auditNote||'')+' 7文で止まっていたため、同じバスケットボール練習場面の自然な終結文を1文追加。';
  }

  for(const[, ,data] of datasets){
    for(const p of Object.values(data)){
      const s=Array.isArray(p&&p.sentences)?p.sentences:[];
      for(const q of (p&&Array.isArray(p.questions)?p.questions:[]))splitJoinedEvidence(q,s);
    }
  }

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

  // ----- Meaning-chunk slash reading -----
  const wc=s=>String(s).trim().split(/\s+/).filter(Boolean).length;
  const clean=s=>String(s||'').replace(/\s+/g,' ').trim();
  const startsInitial=s=>/^(When|While|After|Before|If|Because|Although|Since|As|During|At|In|On|Near|From|For|With|Without|By|At first|In the end)\b/i.test(s);

  function splitOne(seg,re){
    const m=re.exec(seg);if(!m)return null;
    const a=clean(seg.slice(0,m.index)),b=clean(seg.slice(m.index));
    if(wc(a)<2||wc(b)<2)return null;
    return [a,b];
  }

  function slashEnglish(sentence){
    const s=clean(sentence);
    if(wc(s)<=6)return s;
    let parts=[s];
    const comma=s.indexOf(', ');
    if(comma>0){
      const left=s.slice(0,comma+1),right=s.slice(comma+2);
      // Never create a one-word chunk such as "Today, / ..." or "First, / ...".
      if(startsInitial(left)&&wc(left)>=2&&wc(left)<=7&&wc(right)>=3)parts=[left,right];
      else if(/,\s+(but|so|and|yet)\s+/i.test(s)){
        const m=/,\s+(but|so|and|yet)\s+/i.exec(s);parts=[clean(s.slice(0,m.index+1)),clean(s.slice(m.index+2))];
      }
    }
    if(parts.length===1){
      for(const re of [/\s+(because|although|while|when|if|since)\s+/i,/\s+that\s+/i]){
        const z=splitOne(s,re);if(z&&wc(z[0])>=3&&wc(z[1])>=3){parts=z;break;}
      }
    }
    if(parts.length<3){
      const idx=parts.length-1,seg=parts[idx];
      if(wc(seg)>=8){
        const tails=[
          /\s+(every day|every morning|every night|this morning|that morning|last night|next time|right now|in the morning|in the afternoon|in the evening|at night|after school|after practice|before school|before bed)\.?$/i,
          /\s+(around|near|along|inside|outside)\s+the\s+[A-Za-z][A-Za-z'’.-]*(?:\s+[A-Za-z][A-Za-z'’.-]*)?\.?$/i
        ];
        for(const re of tails){
          const m=re.exec(seg);if(!m)continue;
          const a=clean(seg.slice(0,m.index)),b=clean(seg.slice(m.index));
          if(wc(a)>=4&&wc(b)>=2&&!/(?:\b(?:am|is|are|was|were|be|been|being|can|could|will|would|should|must|may|might|do|does|did|have|has|had)|\b(?:like|love|see|saw|eat|ate|read|write|play|visit|make|made|take|took|buy|bought|want|need|know|ask|tell|told|choose|chose|open|put))$/i.test(a)){
            parts.splice(idx,1,a,b);break;
          }
        }
      }
    }
    return parts.map(clean).join(' / ');
  }

  function japaneseSentences(text){
    const src=String(text||'').trim();if(!src)return [];
    const out=[];let cur='';
    for(const ch of src){cur+=ch;if(/[。！？]/.test(ch)){out.push(cur.trim());cur='';}}
    if(cur.trim())out.push(cur.trim());
    return out;
  }
  function stripOldJp(s){return clean(String(s||'').replace(/\s*\/\s*/g,' ').replace(/〜/g,''));}
  function oldJpParts(s){return String(s||'').split(/\s*\/\s*/).map(x=>clean(x.replace(/〜/g,''))).filter(Boolean);}
  function slashJapanese(natural,old,count){
    natural=clean(natural);if(count<=1)return natural||stripOldJp(old);
    const comma=[];for(let i=0;i<natural.length;i++)if(natural[i]==='、')comma.push(i);
    if(comma.length>=count-1){
      const cuts=comma.slice(0,count-1),arr=[];let from=0;
      for(const p of cuts){arr.push(natural.slice(from,p+1).trim());from=p+1;}
      arr.push(natural.slice(from).trim());if(arr.every(Boolean))return arr.join(' / ');
    }
    let op=oldJpParts(old);
    if(op.length===count)return op.join(' / ');
    while(op.length>count){const b=op.pop(),a=op.pop();op.push(clean(a+' '+b));}
    if(op.length===count)return op.join(' / ');
    return natural||stripOldJp(old);
  }

  let rebuilt=0,rows=0;
  for(const[g,book,data]of datasets){
    for(const[sec,p]of Object.entries(data)){
      if(!p||!Array.isArray(p.sentences))continue;
      const old=Array.isArray(p.slashRows)?p.slashRows:[];
      const jp=japaneseSentences(p.fullTranslation);
      p.slashRows=p.sentences.map((s,i)=>{
        const natural=jp.length===p.sentences.length?jp[i]:'';
        let en=slashEnglish(s),n=en.split(' / ').length;
        let j=slashJapanese(natural,old[i]&&old[i].jp,n);
        // Do not invent a slash boundary unless the Japanese forward-reading line can
        // represent the same number of meaning units. Conservative unsplit is preferable
        // to a grammatically or semantically false split.
        if(n>1&&String(j).split(/\s*\/\s*/).filter(Boolean).length!==n){
          en=clean(s);j=natural||stripOldJp(old[i]&&old[i].jp);n=1;
        }
        rows++;return {en,jp:j};
      });
      p.slashReadingVersion='meaning-chunks-v2';
      p.auditNote=String(p.auditNote||'')+' スラッシュは文法記号ではなく前から意味を取れる自然な意味単位で再構成。短い基本文は無理に分割せず、be+補語・助動詞+動詞・動詞+短い目的語を分断しない。日本語側が同じ意味単位に対応できない場合は無理に切らない。';
      rebuilt++;
    }
  }
  window.V10_SLASH_REBUILD={version:'meaning-chunks-v2',passages:rebuilt,rows};
})();
