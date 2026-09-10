const fs=require('fs');
const {chromium,webkit,devices}=require('playwright');
function ok(c,m){if(!c)throw Error(m)}
async function open(type){
  const browser=type==='chromium'?await chromium.launch({headless:true}):await webkit.launch({headless:true});
  const context=type==='chromium'?await browser.newContext({viewport:{width:1366,height:900}}):await browser.newContext({...devices['iPhone 13']});
  const page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(String(e)));
  page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
  const r=await page.goto('http://127.0.0.1:8000/index.html?b14persistent='+type+'-'+Date.now(),{waitUntil:'domcontentloaded',timeout:90000});
  ok(r&&r.ok(),type+' HTTP');
  await page.waitForTimeout(8000);
  const probe=await page.evaluate(()=>({b13Loaded:window.V11_BATCH13_LOADED,b13State:window.V11_BATCH13_STATE||null,b14BootstrapStarted:window.V11_BATCH14_BOOTSTRAP_STARTED,b14Passages:Array.isArray(window.V11_BATCH14_PASSAGES)?window.V11_BATCH14_PASSAGES.length:null,b14Loaded:window.V11_BATCH14_LOADED,b14Registered:window.V11_BATCH14_REGISTERED,b14State:window.V11_BATCH14_STATE||null,extra:Object.values(window.V11_EXTRA_PASSAGES||{}).flat().length}));
  console.log('B14_PROBE '+type+' '+JSON.stringify(probe));
  if(!(probe.b14Loaded===true&&probe.b14Registered===true&&probe.b14State&&probe.b14State.registered===true&&probe.b14State.totalWithBaseline===868&&probe.extra===700)) throw new Error('Batch14 persistent state invalid '+type+' probe='+JSON.stringify(probe)+' errors='+JSON.stringify(errors));
  return{browser,context,page,errors};
}
async function engine(type){
  const c=await open(type);
  try{
    const ids=await c.page.evaluate(()=>window.V11_BATCH14_PASSAGES.map(p=>p.id));
    ok(ids.length===50,type+' b14 count'); ok(new Set(ids).size===50,type+' b14 unique ids'); let overflow=0;
    for(const id of ids){
      const x=await c.page.evaluate(id=>window.V11_BATCH14_PASSAGES.find(p=>p.id===id),id);
      const textbookOptions=await c.page.locator('#textbook option').evaluateAll(os=>os.map(o=>({value:o.value,text:o.textContent})));
      if(!textbookOptions.some(o=>o.value===String(x.textbook))) throw new Error('TEXTBOOK_MAP '+type+' '+id+' textbook='+x.textbook+' options='+JSON.stringify(textbookOptions));
      await c.page.selectOption('#textbook',x.textbook); await c.page.selectOption('#grade',String(x.grade));
      const majors=await c.page.locator('#major option').evaluateAll(os=>os.map(o=>o.value)); let found=false;
      for(const m of majors){ await c.page.selectOption('#major',m); const secs=await c.page.locator('#section option').evaluateAll(os=>os.map(o=>o.value)); if(secs.includes(x.section)){found=true;break} }
      ok(found,id+' section'); await c.page.selectOption('#section',x.section);
      const options=await c.page.locator('#v11PassageVariant option').evaluateAll(os=>os.map(o=>({value:o.value,text:o.textContent})));
      if(!options.some(o=>o.value===String(id))) throw new Error('VARIANT_MAP '+type+' '+id+' book='+x.textbook+' grade='+x.grade+' section='+x.section+' options='+JSON.stringify(options));
      await c.page.selectOption('#v11PassageVariant',String(id)); await c.page.evaluate(()=>window.render()); ok((await c.page.locator('#questions .q').count())===5,id+' A');
      const b=c.page.locator('#altSetBtn'); if(await b.count()){await b.click();ok((await c.page.locator('#questions .q').count())===5,id+' B')}
      if(await c.page.evaluate(()=>document.documentElement.scrollWidth>document.documentElement.clientWidth+2))overflow++;
    }
    ok(!overflow,type+' overflow'); ok(!c.errors.length,type+' errors '+c.errors.join('|'));
    return{passages:50,overflow,errors:c.errors.length,total:await c.page.evaluate(()=>window.V11_BATCH14_STATE.totalWithBaseline),extra:await c.page.evaluate(()=>Object.values(window.V11_EXTRA_PASSAGES||{}).flat().length)};
  } finally {await Promise.allSettled([c.context.close(),c.browser.close()])}
}
(async()=>{const pc=await engine('chromium'),iphone=await engine('webkit');const out={generatedAt:new Date().toISOString(),registered:true,total:868,extra:700,batch14:50,pc,iphone,finalPass:true};fs.writeFileSync('V11_BATCH14_PERSISTENT_RUNTIME_AUDIT.json',JSON.stringify(out,null,2)+'\n');console.log(JSON.stringify(out,null,2));console.log('V11_BATCH14_PERSISTENT_868_PASS')})().catch(e=>{const failure={generatedAt:new Date().toISOString(),finalPass:false,error:String(e&&e.stack||e)};fs.writeFileSync('V11_BATCH14_PERSISTENT_RUNTIME_FAILURE.json',JSON.stringify(failure,null,2)+'\n');console.error(failure.error);process.exit(1)});
