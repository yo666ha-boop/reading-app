const fs=require('fs');
const path=require('path');

const TARGETS=['v11_batch15_g1_body_draft.json','v11_batch15_g2_body_draft.json','v11_batch15_g3_body_draft.json'];
const report=JSON.parse(fs.readFileSync('v11_batch15_vocab_chronology_report.json','utf8'));
const root=fs.readdirSync('.').filter(f=>/^v11_batch(?:0[1-9]|1[0-4]).*\.json$/i.test(f) && !/report|audit/i.test(f));
const glosses=new Map();
const sources=new Map();

function norm(s){return String(s||'').trim().toLowerCase().replace(/[’]/g,"'");}
function validJapanese(s){
  const x=String(s||'').trim();
  if(!x) return false;
  if(/^[A-Za-z0-9 _'\-.,/]+$/.test(x)) return false;
  return /[ぁ-んァ-ヶ一-龠々]/.test(x);
}
function collect(obj,file){
  if(!obj||typeof obj!=='object') return;
  if(Array.isArray(obj)){for(const x of obj) collect(x,file);return;}
  if(Array.isArray(obj.notes)){
    for(const n of obj.notes){
      if(!n||typeof n!=='object') continue;
      const e=norm(n.english), j=String(n.japanese||'').trim();
      if(!e||!validJapanese(j)) continue;
      const accepted=/unlearned|local|required|proper/i.test(String(n.kind||'')+' '+String(n.scope||'')+' '+String(n.basis||''));
      if(!accepted) continue;
      if(!glosses.has(e)){glosses.set(e,j);sources.set(e,file);}
    }
  }
  for(const [k,v] of Object.entries(obj)) if(k!=='notes') collect(v,file);
}
for(const f of root){try{collect(JSON.parse(fs.readFileSync(f,'utf8')),f)}catch(e){}}

const byId=new Map();
for(const v of report.violations||[]){if(!byId.has(v.id))byId.set(v.id,[]);byId.get(v.id).push(v)}
let added=0, reusedWords=new Set(), unresolved=new Set();
for(const file of TARGETS){
  const d=JSON.parse(fs.readFileSync(file,'utf8'));
  for(const p of d.passages||[]){
    if(!Array.isArray(p.notes)) p.notes=[];
    const existing=new Set(p.notes.map(n=>norm(n&&n.english)).filter(Boolean));
    for(const v of byId.get(p.id)||[]){
      const candidates=[norm(v.word),norm(v.base)].filter(Boolean);
      let hit=null;
      for(const c of candidates) if(glosses.has(c)){hit=c;break;}
      if(!hit){unresolved.add(norm(v.word));continue;}
      const word=norm(v.word);
      if(existing.has(word)) continue;
      p.notes.push({
        kind:'unlearned_local_required',
        english:word,
        japanese:glosses.get(hit),
        scope:'passage-only-unlearned',
        basis:`Batch15 chronology repair: reused verified canonical Japanese gloss from ${sources.get(hit)}${hit!==word?` via base ${hit}`:''}; retained because necessary for passage meaning.`
      });
      existing.add(word);added++;reusedWords.add(word);
    }
  }
  fs.writeFileSync(file,JSON.stringify(d,null,2)+'\n');
}
const out={sourceFiles:root.length,verifiedGlosses:glosses.size,notesAdded:added,reusedUnique:reusedWords.size,unresolvedUniqueBeforeRerun:unresolved.size,unresolvedSample:[...unresolved].sort().slice(0,200)};
fs.writeFileSync('v11_batch15_verified_gloss_reuse_report.json',JSON.stringify(out,null,2)+'\n');
console.log(JSON.stringify(out,null,2));
