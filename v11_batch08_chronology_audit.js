'use strict';
const fs=require('fs');
let src=fs.readFileSync('v11_batch05_chronology_audit.js','utf8');
src=src.replaceAll('V11_BATCH05','V11_BATCH08').replaceAll('Batch05','Batch08').replaceAll('batch05','batch08');
const loader=`function loadDraft(){const sandbox={window:{},console};sandbox.globalThis=sandbox.window;vm.createContext(sandbox);for(const f of ['v11_batch08_passages_draft_g1.js','v11_batch08_passages_draft_g2.js','v11_batch08_passages_draft_g3.js','v11_batch08_g3_length_repair.js','v11_batch08_grammar_repair.js','v11_batch08_grammar_repair_r2.js'])vm.runInContext(fs.readFileSync(f,'utf8'),sandbox,{filename:f});const ps=[...(sandbox.window.V11_BATCH08_G1_DRAFTS||[]),...(sandbox.window.V11_BATCH08_G2_DRAFTS||[]),...(sandbox.window.V11_BATCH08_G3_DRAFTS||[])];if(ps.length!==50)throw Error('Batch08 draft not 50');return JSON.parse(JSON.stringify(ps));}`;
src=src.replace(/function loadDraft\(\)\{[\s\S]*?return JSON\.parse\(JSON\.stringify\(ps\)\);\}/,loader);
src=src.replace('runtime_total=368','runtime_total=518');
eval(src);
