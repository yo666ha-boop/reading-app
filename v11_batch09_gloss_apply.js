(function applyV11Batch09FinalGloss(){
'use strict';
const ps=[...(window.V11_BATCH09_G1_DRAFTS||[]),...(window.V11_BATCH09_G2_DRAFTS||[]),...(window.V11_BATCH09_G3_DRAFTS||[])];if(ps.length!==50)throw Error('Batch09 50 passages missing');
const gloss={...(window.V11_BATCH09_VERIFIED_GLOSS_BASE||{}),...(window.V11_BATCH09_MANUAL_GLOSS||{})};
const norm=w=>String(w||'').toLowerCase().replace(/[’‘]/g,"'").trim();let converted=0,missing=[];
for(const p of ps){p.notes=Array.isArray(p.notes)?p.notes:[];const temps=p.notes.filter(n=>n&&n.kind==='temporary_vocab_inventory');const keep=p.notes.filter(n=>!n||n.kind!=='temporary_vocab_inventory');const have=new Set(keep.map(n=>norm(n.english)));
 for(const n of temps){const w=norm(n.english),g=String(gloss[w]||'').trim();if(!g){missing.push([p.id,w]);continue;}if(g.toLowerCase()===w||/最終注整理対象|本文で使用|placeholder|temporary/i.test(g))throw Error(`invalid final gloss ${p.id} ${w}=${g}`);if(!have.has(w)){keep.push({english:w,japanese:g,kind:'unlearned_local_required',source:'v11 Batch09 verified/final Japanese gloss'});have.add(w);converted++;}}
 p.notes=keep;p.glossFinalized=true;
}
if(missing.length)throw Error(`Batch09 final gloss missing ${missing.length}: ${missing.slice(0,20).map(x=>x.join(':')).join(', ')}`);
window.V11_BATCH09_GLOSS_APPLY_STATE={version:'20260829',passages:ps.length,converted,missing:0,registered:false};
})();