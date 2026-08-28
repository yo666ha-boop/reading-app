const fs=require('fs');
const vm=require('vm');
const {loadCanonicalV7}=require('./v10_v7_lexicon_loader');
function run(s,f){vm.runInContext(fs.readFileSync(f,'utf8'),s,{filename:f});}
try{
 const s={window:{},console};s.globalThis=s.window;vm.createContext(s);
 for(const f of ['v11_batch04_passages_draft_g1.js','v11_batch04_passages_draft_g2.js','v11_batch04_passages_draft_g3.js','v11_batch04_length_repair.js','v11_batch04_length_repair_r2.js','v11_batch04_chronology_repair.js','v11_batch04_grammar_repair.js','v11_batch04_chronology_repair_r2.js'])run(s,f);
 const ps=[...(s.window.V11_BATCH04_G1_PASSAGES||[]),...(s.window.V11_BATCH04_G2_PASSAGES||[]),...(s.window.V11_BATCH04_G3_PASSAGES||[])];
 const data=loadCanonicalV7();
 const need=[...new Set(ps.flatMap(p=>(p.notes||[]).filter(n=>String(n.japanese||'').includes('最終注整理対象')).map(n=>String(n.english||'').toLowerCase())))].sort();
 const sample={keys:Object.keys(data),source:data.source,unitsType:typeof data.units,unitsKeys:data.units&&typeof data.units==='object'?Object.keys(data.units).slice(0,12):[],lexType:typeof data.lex,lexIsArray:Array.isArray(data.lex),lexKeys:data.lex&&typeof data.lex==='object'?Object.keys(data.lex).slice(0,30):[]};
 const hits={};
 if(data.lex&&typeof data.lex==='object')for(const w of need){const v=data.lex[w];if(v!==undefined)hits[w]=v;}
 const out={sample,passages:ps.length,needed:need.length,hitWords:Object.keys(hits).length,hits};
 fs.writeFileSync('V11_BATCH04_GLOSS_PROBE.json',JSON.stringify(out,null,2)+'\n');
 console.log(JSON.stringify({sample,passages:ps.length,needed:need.length,hitWords:Object.keys(hits).length,hitSample:Object.entries(hits).slice(0,10)},null,2));
}catch(e){console.error(e.stack||e);process.exitCode=1}
