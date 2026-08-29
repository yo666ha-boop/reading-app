'use strict';
const fs=require('fs'),vm=require('vm');
const sandbox={window:{},console};vm.createContext(sandbox);vm.runInContext(fs.readFileSync('v11_batch06_canonical_gloss.js','utf8'),sandbox);
const gloss=sandbox.window.V11_BATCH06_CANONICAL_GLOSS||{};
const repair=fs.readFileSync('v11_batch07_vocab_repair.js','utf8');const m=repair.match(/const add=(\{[\s\S]*?\});\nlet added=/);if(!m)throw Error('exact add inventory not found');const add=JSON.parse(m[1]);
const words=[...new Set(Object.values(add).flat().map(x=>String(x).toLowerCase().replace(/[’‘]/g,"'")))].sort();
const names=new Set(['ken','mina','taro','aya','emi','riku','yuna','mai','miki','sora','leo','mao','haru','nina','yui','aoi','mika','rena','kota','hina','mei','ryo','yuta','kondo','sato','mr','ms']);
const possessive=w=>w.endsWith("'s")?w.slice(0,-2):null;const covered=[],missing=[];
for(const w of words){const b=possessive(w);if(gloss[w])covered.push([w,gloss[w],'canonical']);else if(b&&gloss[b])covered.push([w,gloss[b]+'の','canonical-possessive']);else if(names.has(w)||b&&names.has(b))covered.push([w,'固有名詞','proper-name']);else missing.push(w);}
const report={generatedAt:new Date().toISOString(),inventoryPassageWords:Object.values(add).reduce((n,a)=>n+a.length,0),distinct:words.length,covered:covered.length,missing:missing.length,coverage:words.length?covered.length/words.length:1,missingWords:missing,coveredWords:covered};
fs.writeFileSync('V11_BATCH07_GLOSS_COVERAGE_AUDIT.json',JSON.stringify(report,null,2)+'\n');console.log(`Batch07 gloss distinct=${words.length} covered=${covered.length} missing=${missing.length} coverage=${(report.coverage*100).toFixed(1)}%`);
