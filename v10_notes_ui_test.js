const {JSDOM,VirtualConsole}=require('jsdom');
function assert(c,m){if(!c)throw new Error(m)}
async function waitFor(fn,ms=30000){const st=Date.now();while(Date.now()-st<ms){if(fn())return;await new Promise(r=>setTimeout(r,50));}throw new Error('timeout');}
function change(w,el,v){el.value=v;el.dispatchEvent(new w.Event('change',{bubbles:true}));}
(async()=>{
  const errs=[];const vc=new VirtualConsole();vc.on('jsdomError',e=>errs.push(String(e&&e.message||e)));
  const dom=await JSDOM.fromFile('v10_stage2.html',{runScripts:'dangerously',resources:'usable',pretendToBeVisual:true,virtualConsole:vc});
  await new Promise((res,rej)=>{const t=setTimeout(()=>rej(new Error('load timeout')),20000);dom.window.addEventListener('load',()=>{clearTimeout(t);res()},{once:true});});
  const w=dom.window;await waitFor(()=>w.V10_RUNTIME_LOAD_PROGRESS==='complete'&&w.V10_GLOSS_RENDERER_INSTALLED===true);
  await waitFor(()=>{
    const m=w.V10_SUNSHINE_G1&&w.V10_SUNSHINE_G1['Get Ready 4'];
    return m&&Array.isArray(m.allowedWords)&&m.allowedWords.some(r=>String(r&&r[0]||'').toLowerCase()==='play');
  });
  const m=w.V10_SUNSHINE_G1['Get Ready 4'];
  assert(m.allowedWords.some(r=>String(r[0]).toLowerCase()==='play'),'v7-confirmed play correction not applied');
  m.notes=[{english:'test<word>',japanese:'試験用の意味',reading:'テスト'}];
  const d=w.document;change(w,d.getElementById('textbook'),'サンシャイン');change(w,d.getElementById('grade'),'1');change(w,d.getElementById('major'),'Get Ready');change(w,d.getElementById('section'),'Get Ready 4');
  await waitFor(()=>d.querySelector('#passage .v10-gloss-box'));
  const box=d.querySelector('#passage .v10-gloss-box');
  assert(box.textContent.includes('注（未習語）'),'gloss title missing');
  assert(box.textContent.includes('test<word>：試験用の意味（テスト）'),'English/Japanese/reading gloss missing');
  assert(!box.innerHTML.includes('<word>'),'gloss HTML was not escaped');
  m.notes=[];change(w,d.getElementById('section'),'Get Ready 3');change(w,d.getElementById('section'),'Get Ready 4');
  await new Promise(r=>setTimeout(r,50));
  assert(!d.querySelector('#passage .v10-gloss-box'),'zero-note passage must hide gloss box');
  assert(errs.length===0,`browser errors: ${errs.join(' | ')}`);
  console.log('NOTES UI PASS: v7 correction applied; indispensable note renders English+Japanese meaning+optional reading; zero-note hides; HTML escaped.');
  dom.window.close();
})().catch(e=>{console.error(`NOTES UI FAIL: ${e.stack||e}`);process.exit(1)});
