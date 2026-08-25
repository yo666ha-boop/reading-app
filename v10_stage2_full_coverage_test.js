const {JSDOM,VirtualConsole}=require('jsdom');
function vals(el){return[...el.options].map(o=>o.value)}
function assert(c,m){if(!c)throw new Error(m)}
function change(w,el,v){el.value=v;el.dispatchEvent(new w.Event('change',{bubbles:true}))}
async function waitFor(fn,ms=30000){const start=Date.now();while(Date.now()-start<ms){if(fn())return;await new Promise(r=>setTimeout(r,50))}throw new Error('semantic runtime load timeout')}
(async()=>{
 const errs=[];const vc=new VirtualConsole();vc.on('jsdomError',e=>errs.push(String(e&&e.message||e)));
 const dom=await JSDOM.fromFile('v10_stage2.html',{runScripts:'dangerously',resources:'usable',pretendToBeVisual:true,virtualConsole:vc});
 await new Promise((res,rej)=>{const t=setTimeout(()=>rej(new Error('load timeout')),20000);dom.window.addEventListener('load',()=>{clearTimeout(t);res()},{once:true})});
 const w=dom.window;
 await waitFor(()=>w.V10_RUNTIME_LOAD_PROGRESS==='complete'&&!w.V10_RUNTIME_LOAD_ERROR&&w.V10_INTERACTION_META_SEMANTIC_REPAIRS_161_168&&w.V10_PASSAGES_G3_NH&&w.V10_PASSAGES_G3_NH['Unit 6-4']&&w.V10_PASSAGES_G3_NH['Unit 6-4'].title==='How One Coat Connects Several Countries');
 assert(w.V10_PASSAGES_G2_NH['Unit 7-4'].title==='Keeping the Mountain Trail Clean','121-130 runtime repair not loaded');
 assert(w.V10_PASSAGES_G3_SS['PROGRAM 6-3'].title==='One Reusable Mug and Less Plastic Waste','131-140 runtime repair not loaded');
 assert(w.V10_PASSAGES_G3_NH['Unit 2-2'].title==='How Long the Designer Has Used a Recycling Idea','141-150 runtime repair not loaded');
 assert(w.V10_PASSAGES_G3_NH['Unit 4-4'].title==='Delivering Relief by Bicycle','151-160 runtime repair not loaded');
 assert(w.V10_PASSAGES_G3_NH['Unit 6-4'].title==='How One Coat Connects Several Countries','161-168 runtime repair not loaded');
 const d=w.document,tb=d.getElementById('textbook'),grade=d.getElementById('grade'),major=d.getElementById('major'),section=d.getElementById('section'),pattern=d.getElementById('pattern'),alt=d.getElementById('altSetBtn'),passage=d.getElementById('passage'),gate=d.getElementById('gate');
 const expected={
  '1|サンシャイン':38,'1|ニューホライズン':31,
  '2|サンシャイン':24,'2|ニューホライズン':29,
  '3|サンシャイン':21,'3|ニューホライズン':25
 };
 let total=0,bEnabled=0;const summary=[];
 for(const g of ['1','2','3']){
  for(const book of ['サンシャイン','ニューホライズン']){
   change(w,tb,book);change(w,grade,g);change(w,pattern,'all');
   const majors=vals(major);assert(majors.length>0,`${g}|${book}: no majors`);
   let count=0;
   for(const maj of majors){
    change(w,major,maj);
    const secs=vals(section);assert(secs.length>0,`${g}|${book}|${maj}: no sections`);
    for(const sec of secs){
     change(w,section,sec);change(w,pattern,'all');
     const text=passage.textContent;
     assert(text.trim(),`${g}|${book}|${sec}: passage empty`);
     assert(text.includes(`中${g}`),`${g}|${book}|${sec}: wrong grade rendered`);
     assert(gate.textContent.includes('品質ゲート通過'),`${g}|${book}|${sec}: release gate failed: ${gate.textContent}`);
     assert(!alt.disabled,`${g}|${book}|${sec}: B question set unavailable`);
     count++;bEnabled++;
    }
   }
   const key=`${g}|${book}`;assert(count===expected[key],`${key}: expected ${expected[key]} sections, got ${count}`);
   total+=count;summary.push(`${key}=${count}`);
  }
 }
 change(w,tb,'ニューホライズン');change(w,grade,'3');change(w,major,'Unit 6');change(w,section,'Unit 6-4');change(w,pattern,'all');
 assert(passage.textContent.includes('How One Coat Connects Several Countries'),'final repaired title not rendered in DOM');
 assert(passage.textContent.includes('This kind of interdependence is part of daily life.'),'final repaired prose not rendered in DOM');
 assert(total===168,`stage2 total expected 168, got ${total}`);
 assert(bEnabled===168,`B-set enabled expected 168, got ${bEnabled}`);
 assert(errs.length===0,`browser errors: ${errs.join(' | ')}`);
 console.log(`STAGE2 FULL COVERAGE PASS (semantic runtime verified): ${summary.join(' / ')} / total=${total} / B-sets=${bEnabled}`);
 // The broad legacy harness leaves navigation microtasks queued in jsdom. Calling window.close()
 // after a successful gate nulls its document before those microtasks drain and can turn a real
 // PASS into a teardown-only TypeError. Exit only after all assertions and browser-error checks.
 process.exit(0);
})().catch(e=>{console.error(`STAGE2 FULL COVERAGE FAIL: ${e.stack||e}`);process.exit(1)});
