const {JSDOM,VirtualConsole}=require('jsdom');
function vals(el){return[...el.options].map(o=>o.value)}
function assert(c,m){if(!c)throw new Error(m)}
function change(w,el,v){el.value=v;el.dispatchEvent(new w.Event('change',{bubbles:true}))}
(async()=>{
 const errs=[];const vc=new VirtualConsole();vc.on('jsdomError',e=>errs.push(String(e&&e.message||e)));
 const dom=await JSDOM.fromFile('v10_stage2.html',{runScripts:'dangerously',resources:'usable',pretendToBeVisual:true,virtualConsole:vc});
 await new Promise((res,rej)=>{const t=setTimeout(()=>rej(new Error('load timeout')),20000);dom.window.addEventListener('load',()=>{clearTimeout(t);setTimeout(res,150)},{once:true})});
 const w=dom.window,d=w.document,tb=d.getElementById('textbook'),grade=d.getElementById('grade'),major=d.getElementById('major'),section=d.getElementById('section'),pattern=d.getElementById('pattern'),alt=d.getElementById('altSetBtn'),passage=d.getElementById('passage'),gate=d.getElementById('gate');
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
 assert(total===168,`stage2 total expected 168, got ${total}`);
 assert(bEnabled===168,`B-set enabled expected 168, got ${bEnabled}`);
 assert(errs.length===0,`browser errors: ${errs.join(' | ')}`);
 console.log(`STAGE2 FULL COVERAGE PASS: ${summary.join(' / ')} / total=${total} / B-sets=${bEnabled}`);
 dom.window.close();
})().catch(e=>{console.error(`STAGE2 FULL COVERAGE FAIL: ${e.stack||e}`);process.exit(1)});
