const fs=require('fs');
const vm=require('vm');
const {JSDOM,VirtualConsole}=require('jsdom');
const norm=s=>String(s||'').replace(/\s+/g,' ').trim();
(async()=>{
  const errs=[]; const vc=new VirtualConsole(); vc.on('jsdomError',e=>errs.push(String(e&&e.message||e)));
  const dom=await JSDOM.fromFile('v10_stage2.html',{runScripts:'dangerously',resources:'usable',pretendToBeVisual:true,virtualConsole:vc});
  await new Promise((res,rej)=>{const t=setTimeout(()=>rej(new Error('window load timeout')),25000);dom.window.addEventListener('load',()=>{clearTimeout(t);res()},{once:true})});
  const w=dom.window,ctx=dom.getInternalVMContext();
  const files=[];
  for(let n=1;n<=151;n+=10){
    if(n===91)files.push('v10_semantic_runtime_repairs_091_100_alias.js');
    files.push(`v10_semantic_runtime_repairs_${String(n).padStart(3,'0')}_${String(Math.min(n+9,160)).padStart(3,'0')}.js`);
  }
  files.push('v10_semantic_runtime_repairs_161_168.js');
  files.push('v10_semantic_runtime_final_fixes.js');
  files.push('v10_vocab_slash_manual_004_010.js','v10_vocab_slash_manual_011_020.js','v10_vocab_slash_manual_021_030.js','v10_vocab_slash_manual_031_040.js','v10_vocab_slash_manual_041_050.js','v10_vocab_slash_manual_051_060.js','v10_vocab_slash_manual_061_070.js','v10_vocab_slash_manual_071_080.js','v10_vocab_slash_manual_081_090.js','v10_vocab_slash_manual_091_168.js','v10_vocab_slash_manual_corrections.js');
  for(const f of files){
    if(!fs.existsSync(f)) throw new Error('missing '+f);
    vm.runInContext(fs.readFileSync(f,'utf8'),ctx,{filename:f});
  }
  const sets=[['1','サンシャイン',w.V10_SUNSHINE_G1||{}],['1','ニューホライズン',w.V10_NEWHORIZON_G1||{}],['2','サンシャイン',w.V10_PASSAGES_G2_SS||{}],['2','ニューホライズン',w.V10_PASSAGES_G2_NH||{}],['3','サンシャイン',w.V10_PASSAGES_G3_SS||{}],['3','ニューホライズン',w.V10_PASSAGES_G3_NH||{}]];
  let pi=0,rows=0;
  console.log('REFERENCE_RUNTIME_DUMP_BEGIN');
  for(const[g,book,data] of sets){
    for(const[sec,p] of Object.entries(data)){
      pi++;
      const ss=Array.isArray(p.sentences)?p.sentences:[];
      const rr=Array.isArray(p.slashRows)?p.slashRows:[];
      console.log('PASSAGE|'+pi+'|'+g+'|'+book+'|'+sec+'|'+norm(p.title||''));
      for(let i=0;i<ss.length;i++){
        rows++;
        const r=rr[i]||{};
        console.log('ROW|'+pi+'|'+(i+1)+'|'+JSON.stringify({sentence:norm(ss[i]),en:norm(r.en),jp:norm(r.jp)}));
      }
    }
  }
  console.log(`REFERENCE_RUNTIME_DUMP_END passages=${pi} rows=${rows} jsdomErrors=${errs.length}`);
  if(pi!==168) throw new Error('passage count '+pi+' != 168');
  dom.window.close();
})().catch(e=>{console.error(e.stack||e);process.exit(1)});
