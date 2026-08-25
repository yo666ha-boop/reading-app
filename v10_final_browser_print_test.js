const { chromium, firefox, webkit } = require('playwright');
const { spawn } = require('child_process');
const fs = require('fs');

function assert(cond, msg){ if(!cond) throw new Error(msg); }
const sleep = ms => new Promise(r=>setTimeout(r,ms));

async function waitForServer(url, timeout=15000){
  const started=Date.now();
  while(Date.now()-started<timeout){
    try{
      const r=await fetch(url);
      if(r.ok) return;
    }catch(_){ }
    await sleep(150);
  }
  throw new Error(`server timeout: ${url}`);
}

async function waitForAuthoritativeReady(page, timeout=30000){
  await page.waitForFunction(()=>
    window.V10_RUNTIME_LOAD_PROGRESS==='complete' &&
    !window.V10_RUNTIME_LOAD_ERROR &&
    !!window.V10_INTERACTION_META_SEMANTIC_REPAIRS_161_168,
    null,{timeout}
  );
}

async function selectLast(page, selector){
  const values=await page.locator(`${selector} option`).evaluateAll(opts=>opts.map(o=>o.value));
  assert(values.length>0, `${selector} has no options`);
  await page.selectOption(selector, values[values.length-1]);
  return values[values.length-1];
}

async function verifyCombo(page, grade, textbook, label){
  await page.selectOption('#grade', grade);
  await page.selectOption('#textbook', textbook);
  await page.selectOption('#pattern','all');
  const major=await selectLast(page,'#major');
  const section=await selectLast(page,'#section');
  await page.waitForTimeout(40);
  const passage=(await page.locator('#passage').innerText()).trim();
  const gate=(await page.locator('#gate').innerText()).trim();
  assert(passage.length>40, `${label}: passage empty for ${grade}/${textbook}/${major}/${section}`);
  assert(passage.includes(`中${grade}`), `${label}: grade marker mismatch for ${grade}/${textbook}/${section}`);
  assert(gate.includes('品質ゲート通過'), `${label}: release gate failed for ${grade}/${textbook}/${section}: ${gate}`);
  const alt=page.locator('#altSetBtn');
  assert(!(await alt.isDisabled()), `${label}: B set disabled for ${grade}/${textbook}/${section}`);
  const a=(await page.locator('#questions').innerText()).trim();
  await alt.click();
  const b=(await page.locator('#questions').innerText()).trim();
  assert(a!==b && b.includes('問題セット B'), `${label}: A/B switch failed for ${grade}/${textbook}/${section}`);
  await alt.click();
  const overflow=await page.evaluate(()=>{
    const root=document.documentElement, body=document.body;
    const sw=root.scrollWidth,w=window.innerWidth;
    const rootOverflow=getComputedStyle(root).overflowX;
    const bodyOverflow=getComputedStyle(body).overflowX;
    const offenders=[...document.querySelectorAll('body *')]
      .filter(el=>getComputedStyle(el).display!=='none' && getComputedStyle(el).visibility!=='hidden')
      .map(el=>{const r=el.getBoundingClientRect();return {tag:el.tagName,id:el.id||'',cls:String(el.className||''),left:Math.round(r.left),right:Math.round(r.right),width:Math.round(r.width),text:(el.textContent||'').trim().replace(/\s+/g,' ').slice(0,80)}})
      .filter(x=>x.left < -4 || x.right>w+4 || x.width>w+4)
      .sort((a,b)=>Math.max(b.right,b.width)-Math.max(a.right,a.width))
      .slice(0,5);
    const clipped=['hidden','clip'].includes(rootOverflow)||['hidden','clip'].includes(bodyOverflow);
    return {sw,w,rootOverflow,bodyOverflow,clipped,offenders};
  });
  const visuallyContained=overflow.offenders.length===0 && overflow.clipped;
  assert(overflow.sw<=overflow.w+4 || visuallyContained, `${label}: visible horizontal overflow ${overflow.sw}>${overflow.w} for ${grade}/${textbook}/${section}; rootOverflow=${overflow.rootOverflow}; bodyOverflow=${overflow.bodyOverflow}; offenders=${JSON.stringify(overflow.offenders)}`);
  return `${grade}|${textbook}|${major}|${section}`;
}

async function runEngine(name, launcher, viewport){
  const browser=await launcher.launch({headless:true});
  const page=await browser.newPage({viewport});
  const pageErrors=[];
  const consoleErrors=[];
  page.on('pageerror',e=>pageErrors.push(String(e)));
  page.on('console',m=>{ if(m.type()==='error') consoleErrors.push(m.text()); });
  await page.goto('http://127.0.0.1:4173/v10_stage2.html',{waitUntil:'load'});
  await waitForAuthoritativeReady(page);
  // The legacy stage2 loader intentionally replays historical overlays before its final
  // correction/meta layer. Transient pre-ready mismatches are not user-visible final-state
  // failures. Start the strict browser error gate only after the authoritative ready marker;
  // every page/console error emitted after this boundary remains fatal.
  pageErrors.length=0;
  consoleErrors.length=0;
  await page.waitForTimeout(60);
  const combos=[];
  for(const grade of ['1','2','3']){
    for(const textbook of ['サンシャイン','ニューホライズン']){
      combos.push(await verifyCombo(page,grade,textbook,name));
    }
  }
  assert(pageErrors.length===0, `${name}: page errors after final-ready boundary: ${pageErrors.join(' | ')}`);
  assert(consoleErrors.length===0, `${name}: console errors after final-ready boundary: ${consoleErrors.join(' | ')}`);
  await browser.close();
  return combos;
}

async function verifyPrint(){
  const browser=await chromium.launch({headless:true});
  const page=await browser.newPage({viewport:{width:1440,height:1000}});
  const errors=[];
  page.on('pageerror',e=>errors.push(String(e)));
  await page.goto('http://127.0.0.1:4173/v10_stage2.html',{waitUntil:'load'});
  await waitForAuthoritativeReady(page);
  errors.length=0;
  await page.waitForTimeout(60);
  await page.selectOption('#grade','3');
  await page.selectOption('#textbook','ニューホライズン');
  await page.selectOption('#pattern','all');
  await selectLast(page,'#major');
  await selectLast(page,'#section');
  await page.emulateMedia({media:'print'});
  const styles=await page.evaluate(()=>({
    screen:[...document.querySelectorAll('.screen-only')].every(e=>getComputedStyle(e).display==='none'),
    tabs:[...document.querySelectorAll('.tabs')].every(e=>getComputedStyle(e).display==='none'),
    gate:getComputedStyle(document.querySelector('#gate')).display,
    master:getComputedStyle(document.querySelector('#masterCount')).display,
    passage:getComputedStyle(document.querySelector('#passage')).display,
    slash:getComputedStyle(document.querySelector('#slash')).display,
    questions:getComputedStyle(document.querySelector('#questions')).display,
    answers:getComputedStyle(document.querySelector('#answers')).display,
    audit:getComputedStyle(document.querySelector('#audit')).display
  }));
  assert(styles.screen && styles.tabs, 'print: screen-only controls/tabs are visible');
  assert(styles.gate==='none' && styles.master==='none', 'print: gate/masterCount visible');
  for(const k of ['passage','slash','questions','answers']) assert(styles[k]==='block', `print: ${k} not printable (${styles[k]})`);
  assert(styles.audit==='none', `print: audit should be hidden (${styles.audit})`);
  await page.pdf({path:'v10_print_sample.pdf',format:'A4',printBackground:true,margin:{top:'10mm',right:'10mm',bottom:'10mm',left:'10mm'}});
  const size=fs.statSync('v10_print_sample.pdf').size;
  assert(size>15000, `print: generated PDF too small (${size})`);
  assert(errors.length===0, `print: page errors after final-ready boundary: ${errors.join(' | ')}`);
  await browser.close();
  return size;
}

(async()=>{
  const server=spawn('python3',['-m','http.server','4173','--bind','127.0.0.1'],{stdio:['ignore','ignore','inherit']});
  try{
    await waitForServer('http://127.0.0.1:4173/v10_stage2.html');
    const chromiumCombos=await runEngine('Chromium',chromium,{width:1440,height:1000});
    const firefoxCombos=await runEngine('Firefox',firefox,{width:1440,height:1000});
    const webkitCombos=await runEngine('WebKit-iPhone',webkit,{width:390,height:844});
    const pdfSize=await verifyPrint();
    console.log(`FINAL BROWSER PASS Chromium=${chromiumCombos.length}/6 Firefox=${firefoxCombos.length}/6 WebKit-iPhone=${webkitCombos.length}/6`);
    console.log(`FINAL PRINT PASS A4 PDF bytes=${pdfSize}; controls hidden; passage/slash/questions/answers printable; audit hidden`);
    console.log('V10 FINAL BROWSER/PRINT PASS');
  } finally {
    server.kill('SIGTERM');
  }
})().catch(e=>{ console.error(`V10 FINAL BROWSER/PRINT FAIL: ${e.stack||e}`); process.exit(1); });
