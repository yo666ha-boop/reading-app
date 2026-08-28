const fs=require('fs');
const vm=require('vm');
const {loadCanonicalV7}=require('./v10_v7_lexicon_loader');
function run(s,f){vm.runInContext(fs.readFileSync(f,'utf8'),s,{filename:f});}
try{
 const s={window:{},console};s.globalThis=s.window;vm.createContext(s);
 for(const f of ['v11_batch04_passages_draft_g1.js','v11_batch04_passages_draft_g2.js','v11_batch04_passages_draft_g3.js','v11_batch04_length_repair.js','v11_batch04_length_repair_r2.js','v11_batch04_chronology_repair.js','v11_batch04_grammar_repair.js','v11_batch04_chronology_repair_r2.js'])run(s,f);
 const ps=[...(s.window.V11_BATCH04_G1_PASSAGES||[]),...(s.window.V11_BATCH04_G2_PASSAGES||[]),...(s.window.V11_BATCH04_G3_PASSAGES||[])];
 const data=loadCanonicalV7();
 const hits={},miss=[];
 for(const p of ps){const code=p.textbook==='ニューホライズン'?'NH':'SS';for(const n of (p.notes||[])){if(!String(n.japanese||'').includes('最終注整理対象'))continue;const w=String(n.english||'').toLowerCase(),key=code+'|'+w,v=data.lex&&data.lex[key];if(v!==undefined)hits[key]=v;else miss.push(key);}}
 const out={source:data.source,passages:ps.length,neededKeys:new Set(Object.keys(hits).concat(miss)).size,hitKeys:Object.keys(hits).length,missKeys:[...new Set(miss)].sort(),hits};
 fs.writeFileSync('V11_BATCH04_GLOSS_PROBE.json',JSON.stringify(out,null,2)+'\n');
 console.log(JSON.stringify({source:data.source,passages:ps.length,neededKeys:out.neededKeys,hitKeys:out.hitKeys,missKeys:out.missKeys.length,hitSample:Object.entries(hits).slice(0,12),missSample:out.missKeys.slice(0,30)},null,2));
}catch(e){console.error(e.stack||e);process.exitCode=1}
