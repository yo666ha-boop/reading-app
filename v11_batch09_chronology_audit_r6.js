'use strict';
const fs=require('fs');
// r6: finalize the post-grammar residual vocabulary inventory, then audit human semantic repairs.
let src=fs.readFileSync('v11_batch09_chronology_audit.js','utf8');
src=src.replace("'v11_batch09_g3_length_repair.js']","'v11_batch09_g3_length_repair.js','v11_batch09_grammar_repair.js','v11_batch09_grammar_repair_r2.js','v11_batch09_verified_gloss_base.js','v11_batch09_manual_gloss_a_h.js','v11_batch09_manual_gloss_i_r.js','v11_batch09_vocab_repair.js','v11_batch09_gloss_apply.js','v11_batch09_vocab_repair_r2.js','v11_batch09_prior_final_gloss.js','v11_batch09_manual_gloss_residual_r3.js','v11_batch09_gloss_apply_r2.js','v11_batch09_chronology_residual_notes_r3.js','v11_batch09_semantic_repair_g1_r1.js']");
eval(src);
