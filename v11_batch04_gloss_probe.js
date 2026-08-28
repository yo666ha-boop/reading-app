const fs=require('fs');
const vm=require('vm');
const {loadCanonicalV7}=require('./v10_v7_lexicon_loader');
function run(s,f){vm.runInContext(fs.readFileSync(f,'utf8'),s,{filename:f});}
try{
 const s={window:{},console};s.globalThis=s.window;vm.createContext(s);
 for(const f of ['v11_batch04_passages_draft_g1.js','v11_batch04_passages_draft_g2.js','v11_batch04_passages_draft_g3.js','v11_batch04_length_repair.js','v11_batch04_length_repair_r2.js','v11_batch04_chronology_repair.js','v11_batch04_grammar_repair.js','v11_batch04_chronology_repair_r2.js'])run(s,f);
 const ps=[...(s.window.V11_BATCH04_G1_PASSAGES||[]),...(s.window.V11_BATCH04_G2_PASSAGES||[]),...(s.window.V11_BATCH04_G3_PASSAGES||[])];
 const data=loadCanonicalV7();
 const sample={keys:Object.keys(data),source:data.source,entryCount:Array.isArray(data.entries)?data.entries.length:null,firstEntry:Array.isArray(data.entries)?data.entries[0]:null};
 const need=[...new Set(ps.flatMap(p=>(p.notes||[]).filter(n=>String(n.japanese||'').includes('最終注整理対象')).map(n=>String(n.english||'').toLowerCase())))].sort();
 const all=[];
 function walk(x,path=''){if(Array.isArray(x)){for(let i=0;i<x.length;i++){const v=x[i];if(v&&typeof v==='object'&&i<10000)all.push({path:path+'['+i+']',value:v});}}else if(x&&typeof x==='object'){for(const [k,v] of Object.entries(x))if(Array.isArray(v))for(let i=0;i<v.length;i++)if(v[i]&&typeof v[i]==='object')all.push({path:path+'.'+k+'['+i+']',value:v[i]});}}
 walk(data,'data');
 const hits={};
 for(const w of need){const arr=[];for(const rec of all){const txt=JSON.stringify(rec.value).toLowerCase();if(txt.includes('"'+w+'"')||txt.includes(':'+JSON.stringify(w)))arr.push({path:rec.path,value:rec.value});if(arr.length>=8)break;}if(arr.length)hits[w]=arr;}
 const out={sample,passages:ps.length,needed:need.length,hitWords:Object.keys(hits).length,hits};
 fs.writeFileSync('V11_BATCH04_GLOSS_PROBE.json',JSON.stringify(out,null,2)+'\n');
 console.log(JSON.stringify({sample,passages:ps.length,needed:need.length,hitWords:Object.keys(hits).length},null,2));
}catch(e){console.error(e.stack||e);process.exitCode=1}
