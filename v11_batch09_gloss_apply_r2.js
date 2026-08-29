(function applyV11Batch09ResidualGlossR2(){
'use strict';
const ps=[...(window.V11_BATCH09_G1_DRAFTS||[]),...(window.V11_BATCH09_G2_DRAFTS||[]),...(window.V11_BATCH09_G3_DRAFTS||[])];
if(ps.length!==50)throw Error('Batch09 50 passages missing');
const gloss={...(window.V11_BATCH09_PRIOR_FINAL_GLOSS||{}),...(window.V11_BATCH09_VERIFIED_GLOSS_BASE||{}),...(window.V11_BATCH09_MANUAL_GLOSS||{}),...(window.V11_BATCH09_RESIDUAL_MANUAL_GLOSS||{})};
const norm=w=>String(w||'').toLowerCase().replace(/[’‘]/g,"'").trim();
let converted=0;const missing=[];
for(const p of ps){
  p.notes=Array.isArray(p.notes)?p.notes:[];
  const temps=p.notes.filter(n=>n&&n.kind==='temporary_vocab_inventory_r2');
  const keep=p.notes.filter(n=>!n||n.kind!=='temporary_vocab_inventory_r2');
  const have=new Set(keep.filter(Boolean).map(n=>norm(n.english)));
  for(const n of temps){
    const w=norm(n.english),g=String(gloss[w]||'').trim();
    if(!g){missing.push([p.id,w]);continue;}
    if(g.toLowerCase()===w||/最終注整理対象|本文で使用|placeholder|temporary/i.test(g))throw Error(`invalid residual gloss ${p.id} ${w}=${g}`);
    if(!have.has(w)){keep.push({english:w,japanese:g,kind:'unlearned_local_required',source:'v11 Batch09 verified/prior-final/curated Japanese gloss r2'});have.add(w);converted++;}
  }
  p.notes=keep;
}
window.V11_BATCH09_GLOSS_APPLY_R2_STATE={version:'20260829-r6-final',passages:ps.length,converted,missing:missing.length,missingWords:[...new Set(missing.map(x=>x[1]))].sort(),registered:false};
if(missing.length)throw Error(`Batch09 residual final gloss missing ${missing.length} occurrences / ${window.V11_BATCH09_GLOSS_APPLY_R2_STATE.missingWords.length} words: ${window.V11_BATCH09_GLOSS_APPLY_R2_STATE.missingWords.join(', ')}`);
})();
