const fs=require('fs');
const vm=require('vm');
const {JSDOM,VirtualConsole}=require('jsdom');
(async()=>{
  const browserErrors=[];
  const vc=new VirtualConsole();
  vc.on('jsdomError',e=>browserErrors.push(String(e&&e.message||e)));
  const dom=await JSDOM.fromFile('v10_stage2.html',{runScripts:'dangerously',resources:'usable',pretendToBeVisual:true,virtualConsole:vc});
  await new Promise((res,rej)=>{const t=setTimeout(()=>rej(new Error('window load timeout')),25000);dom.window.addEventListener('load',()=>{clearTimeout(t);res()},{once:true})});
  const w=dom.window,ctx=dom.getInternalVMContext();
  const files=['v10_semantic_runtime_repairs_091_100_alias.js','v10_semantic_runtime_repairs_091_100.js','v10_semantic_runtime_repairs_101_110.js','v10_semantic_runtime_repairs_111_120.js','v10_semantic_runtime_repairs_121_130.js','v10_semantic_runtime_repairs_131_140.js','v10_semantic_runtime_repairs_141_150.js','v10_semantic_runtime_repairs_151_160.js','v10_semantic_runtime_repairs_161_168.js','v10_semantic_runtime_final_fixes.js','v10_vocab_slash_manual_091_168.js'];
  for(const f of files){if(!fs.existsSync(f))throw new Error('missing '+f);vm.runInContext(fs.readFileSync(f,'utf8'),ctx,{filename:f});}
  if(browserErrors.length)throw new Error('browser errors: '+browserErrors.join(' | '));
  if(!w.V10_FINAL_AUDIT_091_168||w.V10_FINAL_AUDIT_091_168.audited!==78)throw new Error('091-168 coverage failed');
  const pools=[w.V10_PASSAGES_G2_SS||{},w.V10_PASSAGES_G2_NH||{},w.V10_PASSAGES_G3_SS||{},w.V10_PASSAGES_G3_NH||{}];
  let n=0,rows=0;
  for(const pool of pools)for(const p of Object.values(pool))if(p&&p.slashHumanAudit==='PASS_MODEL_ALIGNED_091_168'){
    n++;
    if(!Array.isArray(p.sentences)||!Array.isArray(p.slashRows)||p.sentences.length!==p.slashRows.length)throw new Error('row mismatch');
    for(const r of p.slashRows){rows++;if(String(r.en||'').split(' / ').length!==String(r.jp||'').split(' / ').length)throw new Error('bilingual slash mismatch');}
  }
  if(n!==78)throw new Error('marked passage count '+n);
  console.log(JSON.stringify({status:'PASS',audited:n,rows,mergedPassages:w.V10_FINAL_AUDIT_091_168.mergedPassages}));
  dom.window.close();
})().catch(e=>{console.error(e.stack||e);process.exit(1)});
