const {JSDOM,VirtualConsole}=require('jsdom');
function assert(c,m){if(!c)throw new Error(m)}
async function waitFor(fn,ms=30000,label='condition'){const st=Date.now();while(Date.now()-st<ms){try{if(fn())return;}catch(_){}await new Promise(r=>setTimeout(r,50));}throw new Error(`timeout waiting for ${label}`);}
function change(w,el,v){assert(el,`missing control for value ${v}`);el.value=v;el.dispatchEvent(new w.Event('change',{bubbles:true}));}
function datasetCount(w){try{const d=w.eval('DATASETS');let n=0;for(const g of Object.values(d||{}))for(const t of Object.values(g||{}))n+=Object.keys(t||{}).length;return n;}catch(_){return 0;}}
(async()=>{
  const errs=[];const vc=new VirtualConsole();vc.on('jsdomError',e=>errs.push(String(e&&e.message||e)));
  let dom;
  try{
    console.log('NOTES UI PHASE 1: create jsdom');
    dom=await JSDOM.fromFile('v10_stage2.html',{runScripts:'dangerously',resources:'usable',pretendToBeVisual:true,virtualConsole:vc});
    const w=dom.window;
    // Do not wait for the browser load event. v10_stage2 dynamically injects runtime scripts,
    // and jsdom can keep the load event open even after the application data is already usable.
    console.log('NOTES UI PHASE 2: wait for 168 datasets + gloss renderer');
    await waitFor(()=>datasetCount(w)===168&&w.V10_GLOSS_RENDERER_INSTALLED===true,45000,'168 datasets + gloss renderer');
    console.log(`NOTES UI PHASE 3: datasets=${datasetCount(w)}`);
    await waitFor(()=>{
      const m=w.V10_SUNSHINE_G1&&w.V10_SUNSHINE_G1['Get Ready 4'];
      return m&&Array.isArray(m.allowedWords)&&m.allowedWords.some(r=>String(r&&r[0]||'').toLowerCase()==='play');
    },10000,'v7 play correction');
    const m=w.V10_SUNSHINE_G1['Get Ready 4'];
    assert(m.allowedWords.some(r=>String(r[0]).toLowerCase()==='play'),'v7-confirmed play correction not applied');
    m.notes=[{english:'test<word>',japanese:'試験用の意味',reading:'テスト'}];
    const d=w.document;
    change(w,d.getElementById('textbook'),'サンシャイン');
    change(w,d.getElementById('grade'),'1');
    change(w,d.getElementById('major'),'Get Ready');
    change(w,d.getElementById('section'),'Get Ready 4');
    await waitFor(()=>d.querySelector('#passage .v10-gloss-box'),5000,'gloss box render');
    const box=d.querySelector('#passage .v10-gloss-box');
    assert(box.textContent.includes('注（未習語）'),'gloss title missing');
    assert(box.textContent.includes('test<word>：試験用の意味（テスト）'),'English/Japanese/reading gloss missing');
    assert(!box.innerHTML.includes('<word>'),'gloss HTML was not escaped');
    m.notes=[];
    change(w,d.getElementById('section'),'Get Ready 3');
    change(w,d.getElementById('section'),'Get Ready 4');
    await new Promise(r=>setTimeout(r,100));
    assert(!d.querySelector('#passage .v10-gloss-box'),'zero-note passage must hide gloss box');
    assert(errs.length===0,`browser errors: ${errs.join(' | ')}`);
    console.log('NOTES UI PASS: 168 datasets ready; v7 correction applied; indispensable note renders English+Japanese meaning+optional reading; zero-note hides; HTML escaped.');
  } finally {
    if(dom) dom.window.close();
  }
  // Some app timers are created by dynamically loaded scripts; closing jsdom is sufficient for
  // correctness, and an explicit success exit prevents those timers from holding CI open.
  process.exit(0);
})().catch(e=>{console.error(`NOTES UI FAIL: ${e.stack||e}`);try{process.exitCode=1;}finally{setImmediate(()=>process.exit(1));}});
