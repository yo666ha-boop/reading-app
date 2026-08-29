'use strict';
const fs=require('fs');
// Batch10 chronology gate. Reuse the established Batch05 engine, but load the real Batch10 stack
// in final preparation order: drafts -> length -> grammar chronology repairs -> vocab inventory/glosses
// -> post-grammar residual gloss -> question rewrite. Registration remains false until every downstream gate passes.
let src=fs.readFileSync('v11_batch05_chronology_audit.js','utf8');
src=src.replaceAll('V11_BATCH05','V11_BATCH10').replaceAll('Batch05','Batch10').replaceAll('batch05','batch10');
const loader=`function loadDraft(){const sandbox={window:{},console};sandbox.globalThis=sandbox.window;vm.createContext(sandbox);for(const f of ['v11_batch10_passages_draft_g1.js','v11_batch10_passages_draft_g2.js','v11_batch10_passages_draft_g3.js','v11_batch10_length_repair_r1.js','v11_batch10_grammar_repair_r1.js','v11_batch10_grammar_repair_r2.js','v11_batch10_vocab_inventory.js','v11_batch10_prior_verified_gloss.js','v11_batch10_manual_gloss_r1.js','v11_batch10_gloss_apply.js','v11_batch10_vocab_residual_r2_apply.js','v11_batch10_question_human_rewrite.js'])vm.runInContext(fs.readFileSync(f,'utf8'),sandbox,{filename:f});const ps=[...(sandbox.window.V11_BATCH10_G1_DRAFTS||[]),...(sandbox.window.V11_BATCH10_G2_DRAFTS||[]),...(sandbox.window.V11_BATCH10_G3_DRAFTS||[])];if(ps.length!==50)throw Error('Batch10 draft not 50');return JSON.parse(JSON.stringify(ps));}`;
src=src.replace(/function loadDraft\(\)\{[\s\S]*?return JSON\.parse\(JSON\.stringify\(ps\)\);\}/,loader);
src=src.replace('runtime_total=368','runtime_total=618');
eval(src);
