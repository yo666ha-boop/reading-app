const fs=require('fs');
const {chromium}=require('playwright');
const url=process.env.V11_PREVIEW_URL||'https://yo666ha-boop.github.io/reading-app/v11-preview/';
const expectedSourceSha=process.env.EXPECTED_SOURCE_SHA||'';
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
 const report={url,expectedSourceSha,checkedAt:new Date().toISOString(),pass:false};
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage();
  const errors=[]; page.on('pageerror',e=>errors.push('pageerror:'+e.message)); page.on('console',m=>{if(m.type()==='error')errors.push('console:'+m.text())});
  let source='';
  for(let attempt=0;attempt<24;attempt++){
    const resp=await page.goto(url,{waitUntil:'domcontentloaded',timeout:60000});
    if(!resp||!resp.ok())throw new Error('preview HTTP '+(resp&&resp.status()));
    source=await page.evaluate(async()=>await (await fetch('./PREVIEW_SOURCE.txt?ts='+Date.now(),{cache:'no-store'})).text());
    if((!expectedSourceSha||source.includes('source_sha='+expectedSourceSha))&&source.includes('expected_registered_total=1000'))break;
    await sleep(5000);
  }
  if(expectedSourceSha&&!source.includes('source_sha='+expectedSourceSha))throw new Error('preview source did not reach '+expectedSourceSha+'; got '+source);
  if(!source.includes('expected_registered_total=1000'))throw new Error('preview metadata not 1000: '+source);
  await page.reload({waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForFunction(()=>window.V11_FINAL32_REGISTERED===true&&window.V11_FINAL_RELEASE_READING_ONLY_APPLIED===true&&window.V11_YAMAGUCHI_100_READY===true&&window.V11_MULTI_PASSAGE_STATE&&Number(window.V11_MULTI_PASSAGE_STATE.extraPassages)===832,{timeout:120000});
  const runtime=await page.evaluate(()=>{
    const all=Object.values(window.V11_EXTRA_PASSAGES||{}).flat();
    const f=all.filter(p=>/^V11-F32-G[123]-\d{3}$/.test(String(p&&p.id||'')));
    return {
      multi:window.V11_MULTI_PASSAGE_STATE||null,
      final32State:window.V11_FINAL32_STATE||null,
      final32Registered:window.V11_FINAL32_REGISTERED,
      final32RegisteredCount:window.V11_FINAL32_REGISTERED_COUNT,
      final32Count:f.length,
      final32Unique:new Set(f.map(p=>p.id)).size,
      readingOnlyState:window.V11_FINAL_RELEASE_READING_ONLY_STATE||null,
      yamaguchi100:window.V11_YAMAGUCHI_100_STATE||null,
      yamaguchiCount:all.filter(p=>p&&p.yamaguchiStyle===true).length,
      composition:(()=>{
        const bad=[];
        for(const p of all){
          if(p.freeWriteTask||p.freeWrite)bad.push({id:p.id,kind:'field'});
          for(const [set,qs] of [['A',p.questions||[]],['B',p.questionSetB||[]]]) for(let i=0;i<qs.length;i++){
            const q=qs[i]||{}, s=String(q.questionType||q.type||'')+' '+String(q.prompt||q.question||'');
            if(/FREE_WRITE|英作文|20.?30.?語|write\\s+(?:20|about|an?|your)/i.test(s)) bad.push({id:p.id,kind:set+(i+1)});
          }
        }
        return bad;
      })(),
      replacements:['V11-B09-G3-016','V11-B10-G3-016','V11-B13-G3-014'].map(id=>{const p=all.find(x=>x.id===id);return {id,type:p&&p.questionSetB&&p.questionSetB[4]&&(p.questionSetB[4].questionType||p.questionSetB[4].type),prompt:p&&p.questionSetB&&p.questionSetB[4]&&p.questionSetB[4].prompt,bodyHasWriting:p&&String(p.body||'').includes('optional writing task'),translationHasWriting:p&&String(p.fullTranslation||'').includes('英作文')}}),
      first:f.find(p=>p.id==='V11-F32-G1-001')&&(()=>{const p=f.find(p=>p.id==='V11-F32-G1-001');return{id:p.id,title:p.title,questions:(p.questions||[]).length,questionSetB:(p.questionSetB||[]).length,slashRows:(p.slashRows||[]).length,notes:(p.notes||[]).length,supportNotes:(p.supportNotes||[]).length,requiredLocal:(p.requiredLocal||[]).length}})()
    };
  });
  await page.selectOption('#textbook',{label:'サンシャイン'});
  await page.selectOption('#grade','1'); await page.waitForTimeout(100);
  await page.selectOption('#major',{label:'PROGRAM 10'}); await page.waitForTimeout(100);
  await page.selectOption('#section','PROGRAM 10-2');
  await page.waitForFunction(()=>[...document.querySelectorAll('#v11PassageVariant option')].some(o=>o.value==='V11-F32-G1-001'),{timeout:15000});
  await page.selectOption('#v11PassageVariant','V11-F32-G1-001');
  await page.waitForFunction(()=>window.V11_MULTI_PASSAGE_UI_STATE&&window.V11_MULTI_PASSAGE_UI_STATE.selectedId==='V11-F32-G1-001',{timeout:10000});
  const rendered=await page.evaluate(()=>({
    selectedId:window.V11_MULTI_PASSAGE_UI_STATE&&window.V11_MULTI_PASSAGE_UI_STATE.selectedId,
    optionCount:document.querySelector('#v11PassageVariant')?.options.length||0,
    passageText:document.querySelector('#passage')?.innerText||'',
    questionsText:document.querySelector('#questions')?.innerText||'',
    answersText:document.querySelector('#answers')?.innerText||''
  }));
  const pass=Number(runtime.multi&&runtime.multi.extraPassages)===832&&Number(runtime.final32State&&runtime.final32State.totalWithBaseline)===1000&&runtime.final32Registered===true&&Number(runtime.final32RegisteredCount)===32&&runtime.final32Count===32&&runtime.final32Unique===32&&runtime.readingOnlyState&&runtime.yamaguchi100&&runtime.yamaguchiCount===100&&runtime.composition.length===0&&runtime.replacements.every(x=>x.type==='SUMMARY_FILL'&&!x.bodyHasWriting&&!x.translationHasWriting)&&runtime.first&&runtime.first.questions===5&&runtime.first.questionSetB===5&&runtime.first.slashRows>0&&runtime.first.notes>0&&runtime.first.supportNotes>0&&runtime.first.requiredLocal>0&&rendered.selectedId==='V11-F32-G1-001'&&rendered.passageText.includes('The Umbrella Stand')&&rendered.questionsText.length>100&&rendered.answersText.length>100&&errors.length===0;
  Object.assign(report,{source,runtime,rendered:{selectedId:rendered.selectedId,optionCount:rendered.optionCount,passageHasTitle:rendered.passageText.includes('The Umbrella Stand'),questionsChars:rendered.questionsText.length,answersChars:rendered.answersText.length},errors,pass});
 }catch(e){report.error=String(e&&e.stack||e);}
 finally{await browser.close();}
 fs.writeFileSync('V11_PREVIEW_1000_SMOKE_REPORT.json',JSON.stringify(report,null,2)+'\n');
 console.log(JSON.stringify(report,null,2));
 if(!report.pass)process.exit(2);
})().catch(e=>{console.error(e);process.exit(3)});