const fs=require('fs');
const {chromium,webkit}=require('playwright');

const PREVIEW_URL=process.env.V11_PREVIEW_URL||'https://yo666ha-boop.github.io/reading-app/v11-preview/';
const EXPECTED_SHA=process.env.EXPECTED_SOURCE_SHA||'';
const samples=[
  {textbook:'サンシャイン',grade:'1',major:'PROGRAM 10',section:'PROGRAM 10-2'},
  {textbook:'ニューホライズン',grade:'1',major:'Unit 10',section:'Unit 10-2'},
  {textbook:'サンシャイン',grade:'2',major:'PROGRAM 8',section:'PROGRAM 8-3'},
  {textbook:'ニューホライズン',grade:'2',major:'Unit 7',section:'Unit 7-4'},
  {textbook:'サンシャイン',grade:'3',major:'PROGRAM 7',section:'PROGRAM 7-3'},
  {textbook:'ニューホライズン',grade:'3',major:'Unit 6',section:'Unit 6-4'},
];
const norm=s=>String(s==null?'':s).replace(/\s+/g,' ').trim();
const qtext=s=>norm(String(s||'').replace(/^\d+\.\s*/,''));
function need(c,m,f){if(!c)f.push(m)}
function bandFor(n){if(n<=99)return'lt100';if(n<=129)return'100-129';if(n<=159)return'130-159';if(n<=199)return'160-199';return'200plus'}
function inBand(n,b){return b==='lt100'?n<=99:b==='100-129'?n>=100&&n<=129:b==='130-159'?n>=130&&n<=159:b==='160-199'?n>=160&&n<=199:n>=200}
async function waitSource(request){
  const end=Date.now()+240000;let last='';
  while(Date.now()<end){
    try{const r=await request.get(PREVIEW_URL+'PREVIEW_SOURCE.txt?ts='+Date.now(),{timeout:15000});if(r.ok()){last=await r.text();if(!EXPECTED_SHA||last.includes('source_sha='+EXPECTED_SHA))return last}}catch(_){}
    await new Promise(r=>setTimeout(r,5000));
  }
  throw Error('preview source timeout expected='+EXPECTED_SHA+' last='+last);
}
async function sel(page,id,label){await page.selectOption('#'+id,{label}).catch(()=>page.selectOption('#'+id,label));await page.waitForTimeout(100)}
async function settle(page){
  await page.waitForFunction(()=>window.V11_MULTI_PASSAGE_STATE&&window.V11_MULTI_PASSAGE_STATE.extraPassages>=650&&typeof window.V11_SYNC_PASSAGE_VARIANT_UI==='function',null,{timeout:120000});
  await page.evaluate(()=>window.V11_SYNC_PASSAGE_VARIANT_UI({preserveSelection:false,source:'range-wordcount-audit'}));await page.waitForTimeout(150);
}
async function inspect(page){
  return page.evaluate(()=>{
    const p=window.choose&&window.choose();
    const opts=Array.from(document.querySelectorAll('#v11PassageVariant option')).map(o=>({value:o.value,label:o.textContent}));
    return {id:p&&p.id,section:p&&p.section,title:p&&p.title,wordFilter:!!document.getElementById('v11WordCountFilter'),opts,meta:(document.getElementById('v11PassageSourceMeta')||{}).textContent||'',master:(document.getElementById('masterCount')||{}).textContent||'',passage:(document.getElementById('passage')||{}).textContent||'',slash:(document.getElementById('slash')||{}).textContent||'',questions:(document.getElementById('questions')||{}).textContent||'',answers:(document.getElementById('answers')||{}).textContent||'',sentences:p&&p.sentences||[],fullTranslation:p&&p.fullTranslation||'',slashRows:p&&p.slashRows||[],qA:p&&p.questions||[],qB:p&&p.questionSetB||[],words:p?((p.sentences||[]).join(' ').match(/[A-Za-z0-9]+(?:['’-][A-Za-z0-9]+)*/g)||[]).length:0,ui:window.V11_MULTI_PASSAGE_UI_STATE||null};
  });
}
async function auditEngine(browserType,name){
  const browser=await browserType.launch();
  const page=await browser.newPage({viewport:name==='webkit'?{width:390,height:844}:{width:1440,height:1000}});
  const failures=[],results=[],pageErrors=[];page.on('pageerror',e=>pageErrors.push(String(e)));
  await page.goto(PREVIEW_URL+'?rangeaudit='+Date.now(),{waitUntil:'domcontentloaded',timeout:120000});await settle(page);
  for(const s of samples){
    await sel(page,'textbook',s.textbook);await sel(page,'grade',s.grade);await sel(page,'major',s.major);await sel(page,'section',s.section);await page.selectOption('#pattern','all');await page.selectOption('#v11WordCountFilter','all');await page.evaluate(()=>window.V11_SYNC_PASSAGE_VARIANT_UI({preserveSelection:false,source:'sample'}));await page.waitForTimeout(120);
    let x=await inspect(page);const labels=x.opts.map(o=>o.label);const sections=[...new Set(labels.map(t=>(t.split('｜')[1]||'').trim()).filter(Boolean))];
    const baseLabels=labels.filter(t=>/^基本\s*｜/.test(t));
    const extraLabels=labels.filter(t=>/^追加(?:\d+)?\s*｜/.test(t));
    need(x.wordFilter,`${name} ${s.section}: Word数 filter missing`,failures);
    need(x.opts.length>1,`${name} ${s.section}: passage candidates=${x.opts.length}`,failures);
    need(baseLabels.length===1,`${name} ${s.section}: 基本 count=${baseLabels.length}`,failures);
    need(extraLabels.length>=1,`${name} ${s.section}: 追加 count=${extraLabels.length}`,failures);
    need(labels.every(t=>/\|\d+ words\|/.test(t.replace(/｜/g,'|'))),`${name} ${s.section}: word count missing from option label`,failures);
    need(sections.length===1&&sections[0]===s.section,`${name} ${s.section}: exact-section filter failed sections=${sections.join(',')}`,failures);
    need(x.section===s.section,`${name} ${s.section}: choose() section=${x.section}`,failures);
    need(/該当長文\s*\d+題/.test(x.master),`${name} ${s.section}: selected-count summary missing`,failures);
    need(x.ui&&x.ui.optionCount===x.opts.length&&x.ui.baseCount===baseLabels.length&&x.ui.extraCount===extraLabels.length,`${name} ${s.section}: UI candidate counts out of sync`,failures);
    const extra=x.opts.find(o=>/^追加(?:\d+)?\s*｜/.test(o.label));
    if(extra){
      await page.selectOption('#v11PassageVariant',extra.value);await page.waitForTimeout(120);x=await inspect(page);need(x.id===extra.value,`${name} ${s.section}: extra selection mismatch`,failures);need(x.section===s.section,`${name} ${s.section}: selected extra section=${x.section}`,failures);need(x.meta.includes('追加本文')&&x.meta.includes(x.words+' words'),`${name} ${s.section}: selected source/words meta missing`,failures);need(norm(x.passage).includes(norm(x.fullTranslation)),`${name} ${s.section}: translation not synced`,failures);need(x.slashRows[0]&&norm(x.slash).includes(norm(x.slashRows[0].en))&&norm(x.slash).includes(norm(x.slashRows[0].jp)),`${name} ${s.section}: slash not synced`,failures);need(x.qA.length===5&&norm(x.questions).includes(qtext(x.qA[0]&&x.qA[0].prompt)),`${name} ${s.section}: A questions not synced`,failures);need(x.qA[0]&&norm(x.answers).includes(norm(x.qA[0].evidence))&&norm(x.answers).includes(norm(x.qA[0].evidenceJp)),`${name} ${s.section}: A evidence not synced`,failures);
      const band=bandFor(x.words);await page.selectOption('#v11WordCountFilter',band);await page.waitForTimeout(150);const y=await inspect(page);const counts=y.opts.map(o=>{const m=o.label.match(/｜(\d+) words｜/);return m?Number(m[1]):NaN});need(counts.length>0&&counts.every(n=>Number.isFinite(n)&&inBand(n,band)),`${name} ${s.section}: Word数 filter ${band} failed counts=${counts.join(',')}`,failures);need(y.opts.every(o=>(o.label.split('｜')[1]||'').trim()===s.section),`${name} ${s.section}: Word数 filter leaked another section`,failures);await page.selectOption('#v11WordCountFilter','all');
    }
    results.push({...s,optionCount:x.opts.length,baseCount:baseLabels.length,extraCount:extraLabels.length,sections,selectedId:x.id,words:x.words});
  }
  const runtime=await page.evaluate(()=>({multi:window.V11_MULTI_PASSAGE_STATE||null,ui:window.V11_MULTI_PASSAGE_UI_STATE||null}));need(runtime.multi&&runtime.multi.extraPassages>=650,`${name}: extras=${runtime.multi&&runtime.multi.extraPassages}`,failures);need(pageErrors.length===0,`${name}: page errors ${pageErrors.join(' | ')}`,failures);await browser.close();return{name,results,runtime,pageErrors,failures,pass:failures.length===0};
}
(async()=>{const b=await chromium.launch();const c=await b.newContext();const source=await waitSource(c.request);await b.close();const chromiumResult=await auditEngine(chromium,'chromium');const webkitResult=await auditEngine(webkit,'webkit');const report={previewUrl:PREVIEW_URL,expectedSourceSha:EXPECTED_SHA,previewSource:source.trim(),chromium:chromiumResult,webkit:webkitResult,finalPass:chromiumResult.pass&&webkitResult.pass,createdAt:new Date().toISOString()};fs.writeFileSync('V11_PREVIEW_RANGE_WORDCOUNT_UI_AUDIT.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));if(!report.finalPass)process.exit(1)})().catch(e=>{const report={previewUrl:PREVIEW_URL,expectedSourceSha:EXPECTED_SHA,fatal:String(e&&e.stack||e),finalPass:false,createdAt:new Date().toISOString()};fs.writeFileSync('V11_PREVIEW_RANGE_WORDCOUNT_UI_AUDIT.json',JSON.stringify(report,null,2));console.error(report.fatal);process.exit(1)});
