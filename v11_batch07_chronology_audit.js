'use strict';
// Batch07 chronology gate loads the full 50-passage human-reviewed authoring set.
const fs=require('fs');
let src=fs.readFileSync('v11_batch05_chronology_audit.js','utf8');
src=src.replaceAll('V11_BATCH05','V11_BATCH07').replaceAll('Batch05','Batch07').replaceAll('batch05','batch07');
const loader=`function loadDraft(){const sandbox={window:{},console};sandbox.globalThis=sandbox.window;vm.createContext(sandbox);for(const f of ['v11_batch07_passages_draft_g1.js','v11_batch07_g1_semantic_repair.js','v11_batch07_passages_draft_g2.js','v11_batch07_g2_semantic_repair.js','v11_batch07_standard_draft_g3.js','v11_batch07_standard_semantic_repair.js','v11_batch07_long_draft_g3.js','v11_batch07_long_semantic_repair.js','v11_batch07_yamaguchi_exam_draft_g3.js','v11_batch07_yamaguchi_semantic_repair.js','v11_batch07_yamaguchi_exam_evidence_sync.js','v11_batch07_grammar_repair.js'])vm.runInContext(fs.readFileSync(f,'utf8'),sandbox,{filename:f});const ps=[...(sandbox.window.V11_BATCH07_G1_DRAFTS||[]),...(sandbox.window.V11_BATCH07_G2_DRAFTS||[]),...(sandbox.window.V11_BATCH07_STANDARD_DRAFTS||[]),...(sandbox.window.V11_BATCH07_LONG_DRAFTS||[]),...(sandbox.window.V11_BATCH07_YAMAGUCHI_EXAM_DRAFTS||[])];if(ps.length!==50)throw Error('Batch07 draft not 50');return JSON.parse(JSON.stringify(ps));}`;
src=src.replace(/function loadDraft\(\)\{[\s\S]*?return JSON\.parse\(JSON\.stringify\(ps\)\);\}/,loader);
src=src.replace('runtime_total=368','runtime_total=468');
eval(src);
