const fs=require('fs');
const FILES=['v11_batch15_g1_body_draft.json','v11_batch15_g2_body_draft.json','v11_batch15_g3_body_draft.json'];
const residual=JSON.parse(fs.readFileSync('v11_batch15_vocab_residual_unique.json','utf8'));
const pmap=new Map();
for(const f of FILES){const d=JSON.parse(fs.readFileSync(f,'utf8'));for(const p of d.passages||[])pmap.set(p.id,p)}
function sentences(s){return String(s||'').match(/[^.!?]+[.!?]?/g)||[]}
function rx(w){return new RegExp(`\\b${String(w).replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}\\b`,'i')}
const rows=[];
for(const r of residual.rows||[]){const id=r.passages&&r.passages[0],p=pmap.get(id);let context='';if(p){context=sentences(p.body).find(s=>rx(r.word).test(s))||''}rows.push({word:r.word,kinds:r.kinds,base:r.base,id,grade:r.grades&&r.grades[0],anchor:r.anchors&&r.anchors[0],context:context.trim()})}
const groups=[['a','e'],['f','j'],['k','o'],['p','t'],['u','z']];
for(const [a,b] of groups){const x=rows.filter(r=>{const c=(r.word[0]||'').toLowerCase();return c>=a&&c<=b});const name=`v11_batch15_vocab_residual_context_${a}_${b}.json`;fs.writeFileSync(name,JSON.stringify({range:`${a}-${b}`,count:x.length,rows:x},null,2)+'\n')}
console.log(JSON.stringify({total:rows.length,groups:Object.fromEntries(groups.map(([a,b])=>[`${a}-${b}`,rows.filter(r=>{const c=(r.word[0]||'').toLowerCase();return c>=a&&c<=b}).length]))},null,2));
