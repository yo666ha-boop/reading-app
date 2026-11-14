// Browser smoke: six course checkpoints and a future-UNIT leak guard.
'use strict';
const { chromium }=require('playwright');
const assert=require('node:assert/strict');
const origin=process.env.READING_APP_URL||'http://127.0.0.1:4177';
const cases=[
 {textbook:'サンシャイン',grade:'1',major:'PROGRAM 1',section:'PROGRAM 1-1',id:'V11-UNIT-SS-G1-P1-1-001'},
 {textbook:'ニューホライズン',grade:'1',major:'Unit 1',section:'Unit 1-1',id:'V11-UNIT-NH-G1-U1-1-001'},
 {textbook:'サンシャイン',grade:'2',major:'PROGRAM 1',section:'PROGRAM 1-2',id:'V11-UNIT-SS-G2-P1-2-001'},
 {textbook:'ニューホライズン',grade:'2',major:'Unit 1',section:'Unit 1-1',id:'V11-UNIT-NH-G2-U1-1-001'},
 {textbook:'サンシャイン',grade:'3',major:'PROGRAM 1',section:'PROGRAM 1-2',id:'V11-UNIT-SS-G3-P1-2-001'},
 {textbook:'ニューホライズン',grade:'3',major:'Unit 1',section:'Unit 1-1',id:'V11-UNIT-NH-G3-U1-1-001'}
];
(async()=>{
 const browser=await chromium.launch({headless:true});
 const page=await browser.newPage();
 const errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto(origin+'/index.html',{waitUntil:'load'});
 await page.addScriptTag({url:origin+'/v11_multi_passage_architecture.js'});
 await page.addScriptTag({url:origin+'/v11_candidate_list_ui.js'});
 await page.addScriptTag({url:origin+'/v11_unit_supplemental_20261114.js'});
 await page.waitForFunction(()=>window.V11_UNIT_SUPPLEMENTAL_STATE?.count===6);
 assert.equal(await page.locator('#v11PassageVariant').count(),1);
 let checked=0;
 for(const c of cases){
  await page.selectOption('#textbook',{label:c.textbook});
  await page.selectOption('#grade',c.grade);
  await page.selectOption('#major',{label:c.major});
  await page.selectOption('#section',{label:c.section});
  await page.waitForFunction(id=>Array.from(document.querySelectorAll('#v11PassageVariant option')).some(x=>x.value===id),c.id,{timeout:12000});
  let state=await page.evaluate(()=>({range:window.V11_UNIT_RANGE_STATE,ui:window.V11_MULTI_PASSAGE_UI_STATE}));
  assert.equal(state.range.targetSection,c.section);
  assert.equal(state.range.mode,'studied-through');
  assert.ok(state.range.eligibleSections.length>=2);
  await page.selectOption('#v11PassageVariant',c.id);
  await page.waitForFunction(id=>document.querySelector('#passage')?.textContent.includes(id),c.id,{timeout:5000});
  assert.ok((await page.locator('#passage').innerText()).includes(c.section));
  assert.ok((await page.locator('#gate').innerText()).includes('正式照合') || (await page.locator('#gate').innerText()).includes('正本照合'));
  assert.ok(await page.locator('#altSetBtn').isEnabled());
  await page.locator('#altSetBtn').click();
  assert.ok((await page.locator('#questions').innerText()).includes('問題セット B'));
  await page.locator('#altSetBtn').click();
  assert.ok((await page.locator('#questions').innerText()).includes('問題セット A'));
  checked++;
 }
 // One early-unit checkpoint must not contain a later unit's supplemental text.
 await page.selectOption('#textbook',{label:'ニューホライズン'});
 await page.selectOption('#grade','1');
 await page.selectOption('#major',{label:'Unit 0'});
 await page.selectOption('#section',{label:'Unit 0'});
 await page.waitForFunction(()=>window.V11_UNIT_RANGE_STATE?.targetSection==='Unit 0');
 let ids=await page.locator('#v11PassageVariant option').evaluateAll(o=>o.map(x=>x.value));
 assert.ok(!ids.includes('V11-UNIT-NH-G1-U1-1-001'),'Future unit leaked into Unit 0');
 assert.ok(ids.length>0,'No earlier passage');
 assert.equal(errors.length,0,errors.join('\n'));
 console.log('PASS Chromium UI '+checked+' course/UNIT checkpoints, A/B switching, no future-UNIT leak');
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
