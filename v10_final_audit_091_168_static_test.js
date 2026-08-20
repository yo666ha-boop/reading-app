const fs=require('fs');
const vm=require('vm');
const ctx={window:{}};ctx.window=ctx;
for(const f of [
 'v10_data_sunshine_g2.js','v10_data_newhorizon_g2.js','v10_data_sunshine_g3.js','v10_data_newhorizon_g3.js',
 'v10_semantic_runtime_repairs_091_100_alias.js','v10_semantic_runtime_repairs_091_100.js','v10_semantic_runtime_repairs_101_110.js','v10_semantic_runtime_repairs_111_120.js','v10_semantic_runtime_repairs_121_130.js','v10_semantic_runtime_repairs_131_140.js','v10_semantic_runtime_repairs_141_150.js','v10_semantic_runtime_repairs_151_160.js','v10_semantic_runtime_repairs_161_168.js','v10_semantic_runtime_final_fixes.js','v10_vocab_slash_manual_091_168.js'
]){
 if(fs.existsSync(f))vm.runInNewContext(fs.readFileSync(f,'utf8'),ctx,{filename:f});
}
if(!ctx.V10_FINAL_AUDIT_091_168||ctx.V10_FINAL_AUDIT_091_168.audited!==78)throw new Error('091-168 coverage failed');
const pools=[ctx.V10_PASSAGES_G2_SS||{},ctx.V10_PASSAGES_G2_NH||{},ctx.V10_PASSAGES_G3_SS||{},ctx.V10_PASSAGES_G3_NH||{}];
let n=0;
for(const pool of pools)for(const p of Object.values(pool))if(p&&p.slashHumanAudit==='PASS_MODEL_ALIGNED_091_168'){
 n++;
 if(!Array.isArray(p.sentences)||!Array.isArray(p.slashRows)||p.sentences.length!==p.slashRows.length)throw new Error('row mismatch');
 for(const r of p.slashRows){if(String(r.en||'').split(' / ').length!==String(r.jp||'').split(' / ').length)throw new Error('bilingual slash mismatch');}
}
if(n!==78)throw new Error('marked passage count '+n);
console.log(JSON.stringify({status:'PASS',audited:n,mergedPassages:ctx.V10_FINAL_AUDIT_091_168.mergedPassages}));
