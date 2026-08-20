(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.MikamiMathFigureMarkers=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';

  const SAFE_EXTERNAL_SCHEMES=new Set(['http','https','data','blob']);
  const SAFE_LOCAL_EXTENSIONS=new Set(['.png','.jpg','.jpeg','.webp','.gif','.svg','.avif']);
  const MARKER_RE=/\[\[IMAGE:([^\]\r\n]+)\]\]/g;

  function txt(v){return typeof v==='string'?v.trim():''}
  function esc(s){return String(s??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;')}
  function escAttr(s){return esc(s).replaceAll("'",'&#39;')}

  function safeFigureRef(ref){
    const s=txt(ref);if(!s)return false;
    if(s.startsWith('//'))return true;
    const scheme=s.match(/^([A-Za-z][A-Za-z0-9+.-]*):/);
    if(scheme)return SAFE_EXTERNAL_SCHEMES.has(scheme[1].toLowerCase());
    let path=s.split(/[?#]/,1)[0];
    try{path=decodeURIComponent(path)}catch{return false}
    if(!path||path.startsWith('/')||path.includes('\\'))return false;
    const parts=path.split('/');
    if(parts.some(p=>!p||p==='.'||p==='..'))return false;
    const name=parts[parts.length-1];const dot=name.lastIndexOf('.');
    if(dot<0)return false;
    return SAFE_LOCAL_EXTENSIONS.has(name.slice(dot).toLowerCase());
  }

  function renderCanonicalText(text,figureRefs,recordId){
    const source=String(text??'');
    const refs=Array.isArray(figureRefs)?figureRefs.map(txt).filter(Boolean):[];
    const allowed=new Set(refs);
    const used=[];
    const unresolved=[];
    let out='';let last=0;let m;
    MARKER_RE.lastIndex=0;
    while((m=MARKER_RE.exec(source))!==null){
      out+=esc(source.slice(last,m.index));
      const raw=m[1];const ref=txt(raw);
      if(ref&&allowed.has(ref)&&safeFigureRef(ref)){
        used.push(ref);
        out+=`<span class="inline-figure"><img src="${escAttr(ref)}" alt="図版 ${escAttr(recordId||'')}" loading="eager" data-inline-figure="1" onload="this.dataset.loadOk='1'" onerror="this.dataset.loadError='1'"></span>`;
      }else{
        unresolved.push(ref||raw);
        out+=`<span class="figure-marker-error" data-figure-marker-error="1">[図版参照エラー]</span>`;
      }
      last=MARKER_RE.lastIndex;
    }
    out+=esc(source.slice(last));
    return {html:out,usedRefs:[...new Set(used)],unresolvedMarkers:[...new Set(unresolved)]};
  }

  function markerRefs(text){
    const source=String(text??'');const refs=[];let m;
    MARKER_RE.lastIndex=0;
    while((m=MARKER_RE.exec(source))!==null){const ref=txt(m[1]);if(ref)refs.push(ref)}
    return [...new Set(refs)];
  }

  return {safeFigureRef,renderCanonicalText,markerRefs};
});
