'use strict';
const fs=require('fs'),vm=require('vm');
const sandbox={window:{},console};vm.createContext(sandbox);vm.runInContext(fs.readFileSync('v11_batch06_canonical_gloss.js','utf8'),sandbox);
const gloss={...(sandbox.window.V11_BATCH06_CANONICAL_GLOSS||{})};
const f7=fs.readFileSync('v11_batch07_notes_finalize.js','utf8');
const mm=f7.match(/const manual=(\{[\s\S]*?\});\nconst proper=/);if(!mm)throw Error('Batch07 manual gloss map not found');
const manual=vm.runInNewContext('('+mm[1]+')');Object.assign(gloss,manual);
vm.runInContext(fs.readFileSync('v11_batch08_gloss_finalize.js','utf8'),sandbox);Object.assign(gloss,sandbox.window.V11_BATCH08_FINAL_GLOSS||{});
const repair=fs.readFileSync('v11_batch08_vocab_repair.js','utf8');const m=repair.match(/const add=(\{[\s\S]*?\});\nlet added=/);if(!m)throw Error('Batch08 exact add inventory not found');const add=JSON.parse(m[1]);
const words=[...new Set(Object.values(add).flat().map(x=>String(x).toLowerCase().replace(/[’‘]/g,"'")))].sort();
const names=new Set(['ken','mina','taro','aya','emi','riku','yuna','mai','miki','sora','leo','mao','haru','nina','yui','aoi','mika','rena','kota','hina','mei','ryo','yuta','kondo','sato','aki','daichi','haruki','kei','mio','mr','ms']);
const possessive=w=>w.endsWith("'s")?w.slice(0,-2):null;const covered=[],missing=[];
for(const w of words){const b=possessive(w);if(gloss[w])covered.push([w,gloss[w],'verified-or-batch08-final']);else if(b&&gloss[b])covered.push([w,gloss[b]+'の','verified-prior-possessive']);else if(names.has(w)||b&&names.has(b))covered.push([w,'固有名詞','proper-name']);else missing.push(w);}
const report={generatedAt:new Date().toISOString(),inventoryPassageWords:Object.values(add).reduce((n,a)=>n+a.length,0),distinct:words.length,covered:covered.length,missing:missing.length,coverage:words.length?covered.length/words.length:1,missingWords:missing,coveredWords:covered};
fs.writeFileSync('V11_BATCH08_GLOSS_COVERAGE_AUDIT.json',JSON.stringify(report,null,2)+'\n');console.log(`Batch08 gloss distinct=${words.length} covered=${covered.length} missing=${missing.length} coverage=${(report.coverage*100).toFixed(1)}%`);
