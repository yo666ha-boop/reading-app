'use strict';
const fs=require('fs'),vm=require('vm');
const files=['v11_batch09_passages_draft_g1.js','v11_batch09_g1_length_repair.js','v11_batch09_passages_draft_g2.js','v11_batch09_passages_draft_g3.js','v11_batch09_g3_length_repair.js','v11_batch09_grammar_repair.js','v11_batch09_grammar_repair_r2.js','v11_batch09_verified_gloss_base.js','v11_batch09_manual_gloss_a_h.js','v11_batch09_manual_gloss_i_r.js','v11_batch09_vocab_repair.js','v11_batch09_gloss_apply.js','v11_batch09_vocab_repair_r2.js'];
const s={window:{},console};s.globalThis=s.window;vm.createContext(s);
for(const f of files)vm.runInContext(fs.readFileSync(f,'utf8'),s,{filename:f});
const ps=[...(s.window.V11_BATCH09_G1_DRAFTS||[]),...(s.window.V11_BATCH09_G2_DRAFTS||[]),...(s.window.V11_BATCH09_G3_DRAFTS||[])];
function snap(label){const kinds={},samples={};for(const p of ps)for(const n of (p.notes||[])){const k=n&&n.kind||'NONE';kinds[k]=(kinds[k]||0)+1;(samples[k]||(samples[k]=[]));if(samples[k].length<20)samples[k].push(`${p.id}:${n&&n.english}`)}console.log(label,JSON.stringify({kinds,samples,state:s.window.V11_BATCH09_GLOSS_APPLY_R2_STATE||null},null,2));}
snap('BEFORE_R2_GLOSS');
vm.runInContext(fs.readFileSync('v11_batch09_gloss_apply_r2.js','utf8'),s,{filename:'v11_batch09_gloss_apply_r2.js'});
snap('AFTER_R2_GLOSS');
