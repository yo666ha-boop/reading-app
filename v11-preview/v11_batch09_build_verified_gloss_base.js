'use strict';
const fs=require('fs'),vm=require('vm');
const sandbox={window:{},console};vm.createContext(sandbox);
vm.runInContext(fs.readFileSync('v11_batch06_canonical_gloss.js','utf8'),sandbox);
const gloss={...(sandbox.window.V11_BATCH06_CANONICAL_GLOSS||{})};
const f7=fs.readFileSync('v11_batch07_notes_finalize.js','utf8');
const mm=f7.match(/const manual=(\{[\s\S]*?\});\nconst proper=/);if(!mm)throw Error('Batch07 manual gloss map not found');Object.assign(gloss,vm.runInNewContext('('+mm[1]+')'));
vm.runInContext(fs.readFileSync('v11_batch08_gloss_finalize.js','utf8'),sandbox);Object.assign(gloss,sandbox.window.V11_BATCH08_FINAL_GLOSS||{});
const repair=fs.readFileSync('v11_batch09_vocab_repair.js','utf8');const m=repair.match(/const add=(\{[\s\S]*?\});\nlet added=/);if(!m)throw Error('Batch09 inventory not found');const add=JSON.parse(m[1]);
const words=[...new Set(Object.values(add).flat().map(x=>String(x).toLowerCase().replace(/[’‘]/g,"'")))].sort();
const names=new Set(['aya','ren','mao','kenta','emi','mina','leo','aki','saki','nana','ken','riku','yuna','haru','tomo','miu','yui','koki','ko','rina','yuto','mai','mika','nao','hana','sota','maya','miki','ryo']);
const base={};for(const w of words){const b=w.endsWith("'s")?w.slice(0,-2):null;if(gloss[w])base[w]=gloss[w];else if(b&&gloss[b])base[w]=gloss[b]+'の';else if(names.has(w)||b&&names.has(b))base[w]='固有名詞';}
fs.writeFileSync('v11_batch09_verified_gloss_base.js',`(function(){'use strict';window.V11_BATCH09_VERIFIED_GLOSS_BASE=${JSON.stringify(base)};})();\n`);
console.log(`verified base=${Object.keys(base).length}`);