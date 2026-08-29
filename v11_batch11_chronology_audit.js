'use strict';
const fs=require('fs');
// Batch11 chronology gate. Load the complete unregistered authoring stack, final word-band/grammar repairs, and only human-verified Japanese glosses.
// Registration remains false until chronology plus semantic/question/duplicate/UI/print/runtime gates all pass.
let src=fs.readFileSync('v11_batch05_chronology_audit.js','utf8');
src=src.replaceAll('V11_BATCH05','V11_BATCH11').replaceAll('Batch05','Batch11').replaceAll('batch05','batch11');
const loader=`function loadDraft(){const sandbox={window:{},console};sandbox.globalThis=sandbox.window;vm.createContext(sandbox);for(const f of ['v11_batch11_passages_draft_g1.js','v11_batch11_passages_draft_g2.js','v11_batch11_g3_core.js','v11_batch11_passages_draft_g3_standard.js','v11_batch11_passages_draft_g3_long.js','v11_batch11_passages_draft_g3_yamaguchi_a.js','v11_batch11_passages_draft_g3_yamaguchi_b.js','v11_batch11_length_repair_r1.js','v11_batch11_length_repair_r2.js','v11_batch11_length_repair_r3.js','v11_batch11_length_repair_r4.js','v11_batch11_grammar_repair_r1.js','v11_batch10_prior_verified_gloss.js','v11_batch10_manual_gloss_r1.js','v11_batch11_verified_gloss_reuse.js'])vm.runInContext(fs.readFileSync(f,'utf8'),sandbox,{filename:f});const ps=[...(sandbox.window.V11_BATCH11_G1_DRAFTS||[]),...(sandbox.window.V11_BATCH11_G2_DRAFTS||[]),...(sandbox.window.V11_BATCH11_G3_DRAFTS||[])];if(ps.length!==50)throw Error('Batch11 draft not 50');return JSON.parse(JSON.stringify(ps));}`;
src=src.replace(/function loadDraft\(\)\{[\s\S]*?return JSON\.parse\(JSON\.stringify\(ps\)\);\}/,loader);
src=src.replace('runtime_total=368','runtime_total=668');
eval(src);
