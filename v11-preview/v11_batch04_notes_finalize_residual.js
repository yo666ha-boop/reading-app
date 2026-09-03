(function finalizeV11Batch04ResidualNotes(){
'use strict';
const gloss={
  'easily':'簡単に',
  'followed':'たどった',
  'happily':'うれしそうに',
  'please':'どうぞ・お願いします',
  'difficult':'難しい'
};
const ps=[...(window.V11_BATCH04_G1_PASSAGES||[]),...(window.V11_BATCH04_G2_PASSAGES||[]),...(window.V11_BATCH04_G3_PASSAGES||[])];
let replaced=0,unresolved=[];
for(const p of ps){
  p.notes=Array.isArray(p.notes)?p.notes:[];
  for(const n of p.notes){
    if(!n||!n.english||!String(n.japanese||'').includes('最終注整理対象'))continue;
    const key=String(n.english).replace(/[’]/g,"'").toLowerCase();
    if(gloss[key]){n.japanese=gloss[key];n.source='v11 Batch04 residual final context gloss 20260828';replaced++;}
    else unresolved.push({id:p.id,english:n.english});
  }
}
window.V11_BATCH04_RESIDUAL_NOTE_FINALIZE_STATE={version:'20260828-residual-final',passages:ps.length,replaced,unresolved,ready:ps.length===50&&unresolved.length===0};
})();
