const fs=require('fs');
const vm=require('vm');
function run(s,f){vm.runInContext(fs.readFileSync(f,'utf8'),s,{filename:f})}
function jac(a,b){a=new Set(a);b=new Set(b);let i=0;for(const x of a)if(b.has(x))i++;return i/(a.size+b.size-i||1)}
try{
 const s={window:{},console};s.globalThis=s.window;s.window.V11_REGISTER_PASSAGES=(all)=>({extraPassages:all.length});vm.createContext(s);
 run(s,'v11_batch01_passages_001_050.js');run(s,'v11_batch01_uniqueness_repair.js');
 for(const f of ['v11_batch02_passages_draft.js','v11_batch02_unit_safe_repair.js','v11_batch02_unique_structure_repair.js','v11_batch02_semantic_rewrite_pass1.js','v11_batch02_semantic_chronology_repair_pass1.js','v11_batch02_required_notes_repair.js','v11_batch02_semantic_rewrite_pass2_grade2.js','v11_batch02_grade2_chronology_repair.js','v11_batch02_semantic_rewrite_pass3_grade3.js','v11_batch02_grade3_chronology_repair.js','v11_batch02_length_repair.js','v11_batch02_length_repair_r2.js','v11_batch02_postlength_chronology_repair.js','v11_batch02_question_repair.js'])run(s,f);
 const b1=JSON.parse(JSON.stringify(s.window.V11_BATCH01_PASSAGES||[])),b2=JSON.parse(JSON.stringify(s.window.V11_BATCH02_DRAFT_PASSAGES||[]));
 const all=[...b1,...b2],bad=[],ids=new Set(),bodies=new Map(),severe=[];
 for(const x of all){if(ids.has(x.id))bad.push('duplicate-id:'+x.id);ids.add(x.id);const body=(x.sentences||[]).join(' ');if(bodies.has(body))bad.push('duplicate-body:'+bodies.get(body)+':'+x.id);else bodies.set(body,x.id)}
 for(let i=0;i<all.length;i++)for(let j=i+1;j<all.length;j++){const a=all[i],b=all[j];if(a.textbook!==b.textbook||String(a.grade)!==String(b.grade)||a.section!==b.section)continue;const score=jac(a.sentences||[],b.sentences||[]);if(score>=0.85)severe.push({a:a.id,b:b.id,score:+score.toFixed(3)})}
 const b1ids=new Set(b1.map(x=>x.id)),crossOnly=severe.filter(x=>b1ids.has(x.a)!==b1ids.has(x.b)),b2Only=severe.filter(x=>!b1ids.has(x.a)&&!b1ids.has(x.b));
 const out={generatedAt:new Date().toISOString(),batch01:b1.length,batch02:b2.length,total:all.length,bad,severe,crossOnly,b2Only,finalPass:b1.length===50&&b2.length===50&&bad.length===0&&crossOnly.length===0&&b2Only.length===0};
 fs.writeFileSync('V11_BATCH02_CROSS_BATCH_FINAL_AUDIT.json',JSON.stringify(out,null,2)+'\n');console.log(JSON.stringify(out,null,2));if(!out.finalPass)process.exitCode=1;
}catch(e){console.error(e.stack||e);process.exitCode=1}
