'use strict';
const fs=require('fs');
let src=fs.readFileSync('v11_batch05_chronology_audit.js','utf8');
src=src.replaceAll('V11_BATCH05','V11_BATCH09').replaceAll('Batch05','Batch09').replaceAll('batch05','batch09');
const loader=`function loadDraft(){const sandbox={window:{},console};sandbox.globalThis=sandbox.window;vm.createContext(sandbox);for(const f of ['v11_batch09_passages_draft_g1.js','v11_batch09_g1_length_repair.js','v11_batch09_passages_draft_g2.js','v11_batch09_passages_draft_g3.js','v11_batch09_g3_length_repair.js'])vm.runInContext(fs.readFileSync(f,'utf8'),sandbox,{filename:f});const ps=[...(sandbox.window.V11_BATCH09_G1_DRAFTS||[]),...(sandbox.window.V11_BATCH09_G2_DRAFTS||[]),...(sandbox.window.V11_BATCH09_G3_DRAFTS||[])];if(ps.length!==50)throw Error('Batch09 draft not 50');return JSON.parse(JSON.stringify(ps));}`;
src=src.replace(/function loadDraft\(\)\{[\s\S]*?return JSON\.parse\(JSON\.stringify\(ps\)\);\}/,loader);
src=src.replace('runtime_total=368','runtime_total=568');
eval(src);