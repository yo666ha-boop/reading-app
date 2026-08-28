const fs=require('fs');
const vm=require('vm');
function run(s,f){vm.runInContext(fs.readFileSync(f,'utf8'),s,{filename:f})}
function jac(a,b){a=new Set(a);b=new Set(b);let n=0;for(const x of a)if(b.has(x))n++;return n/(a.size+b.size-n||1)}
try{
 const s={window:{},console};s.globalThis=s.window;vm.createContext(s);
 run(s,'v11_batch02_passages_draft.js');run(s,'v11_batch02_unit_safe_repair.js');run(s,'v11_batch02_unique_structure_repair.js');run(s,'v11_batch02_required_notes_repair.js');
 const ps=JSON.parse(JSON.stringify(s.window.V11_BATCH02_DRAFT_PASSAGES||[]));
 const groups=new Map();for(const p of ps){const k=p.textbook+'|'+p.grade+'|'+p.section;if(!groups.has(k))groups.set(k,[]);groups.get(k).push(p)}
 const pairs=[];for(const [g,xs] of groups)for(let i=0;i<xs.length;i++)for(let j=i+1;j<xs.length;j++){const score=jac(xs[i].sentences,xs[j].sentences);if(score>=0.55)pairs.push({group:g,a:xs[i].id,b:xs[j].id,score:+score.toFixed(3)})}
 const oldSafeMarker=ps.filter(p=>String(p.auditNote||'').includes('same-unit sentence bank')).map(p=>p.id);
 const semanticPending=ps.filter(p=>String(p.auditNote||'').includes('Story-specific semantic rewrite is still pending')).map(p=>p.id);
 const arcOnly=[];for(const p of ps){const sameGroup=groups.get(p.textbook+'|'+p.grade+'|'+p.section);const freq=new Map();for(const x of sameGroup)for(const e of x.sentences)freq.set(e,(freq.get(e)||0)+1);const shared=p.sentences.filter(e=>(freq.get(e)||0)>=Math.ceil(sameGroup.length*.7)).length;const ratio=shared/Math.max(1,p.sentences.length);if(ratio>.55)arcOnly.push({id:p.id,shared,all:p.sentences.length,ratio:+ratio.toFixed(3)})}
 const structuralPass=ps.length===50&&pairs.length===0&&oldSafeMarker.length===0&&arcOnly.length===0;
 const out={generatedAt:new Date().toISOString(),passages:ps.length,highSharedPairs:pairs.length,worstPairs:pairs.sort((a,b)=>b.score-a.score).slice(0,30),sameUnitRepairMarkerCount:oldSafeMarker.length,highCommonSentenceRatio:arcOnly.length,semanticRewritePendingCount:semanticPending.length,structuralPass,finalPass:structuralPass&&semanticPending.length===0};
 fs.writeFileSync('V11_BATCH02_NATURALNESS_AUDIT.json',JSON.stringify(out,null,2)+'\n');console.log(JSON.stringify(out,null,2));if(!out.finalPass)process.exitCode=1;
}catch(e){console.error(e.stack||e);process.exitCode=1}
