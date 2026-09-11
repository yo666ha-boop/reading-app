const fs=require('fs');
const files=['v11_batch15_g1_body_draft.json','v11_batch15_g2_body_draft.json','v11_batch15_g3_body_draft.json'];
const replacement={two:'二つ',fifty:'五十',seventy:'七十'};
let changed=0;
const details=[];
for(const f of files){
  const root=JSON.parse(fs.readFileSync(f,'utf8'));
  for(const p of (root.passages||[])){
    for(const n of (Array.isArray(p.notes)?p.notes:[])){
      if(!n||n.kind!=='unlearned_local_required') continue;
      const e=String(n.english||'').trim().toLowerCase();
      const old=String(n.japanese||'').trim();
      if(replacement[e] && /^\d+(?:[.,]\d+)?$/.test(old)){
        n.japanese=replacement[e];
        n.basis=String(n.basis||'')+' Batch15 notes gate repair: replaced numeric-only gloss with formal Japanese reading; English body unchanged.';
        changed++;
        details.push({id:p.id,english:e,from:old,to:n.japanese});
      }
    }
  }
  fs.writeFileSync(f,JSON.stringify(root,null,2)+'\n');
}
fs.writeFileSync('V11_BATCH15_NUMERIC_GLOSS_REPAIR_REPORT.json',JSON.stringify({generatedAt:new Date().toISOString(),changed,details},null,2)+'\n');
console.log(JSON.stringify({changed,details},null,2));
if(changed!==33){console.error(`expected 33 numeric-only repairs, got ${changed}`);process.exitCode=1;}
