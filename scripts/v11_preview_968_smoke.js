const fs=require('fs');
const {chromium}=require('playwright');
const url=process.env.V11_PREVIEW_URL||'https://yo666ha-boop.github.io/reading-app/v11-preview/';
const expectedSourceSha=process.env.EXPECTED_SOURCE_SHA||'';
(async()=>{
  const report={url,expectedSourceSha,checkedAt:new Date().toISOString(),pass:false};
  const browser=await chromium.launch({headless:true});
  try{
    const page=await browser.newPage();
    const errors=[];
    page.on('pageerror',e=>errors.push('pageerror:'+e.message));
    page.on('console',m=>{if(m.type()==='error')errors.push('console:'+m.text())});
    const resp=await page.goto(url,{waitUntil:'domcontentloaded',timeout:60000});
    await page.waitForFunction(()=>window.V11_MULTI_PASSAGE_STATE&&Number(window.V11_MULTI_PASSAGE_STATE.extraPassages)===800&&window.V11_BATCH16_REGISTERED===true,{timeout:90000});
    const source=await page.evaluate(async()=>await (await fetch('./PREVIEW_SOURCE.txt',{cache:'no-store'})).text());
    const runtime=await page.evaluate(()=>{
      const all=Object.values(window.V11_EXTRA_PASSAGES||{}).flat();
      const b16=all.filter(p=>/^V11-B16-G[123]-\d{3}$/.test(String(p&&p.id||'')));
      return {
        multi:window.V11_MULTI_PASSAGE_STATE||null,
        batch16State:window.V11_BATCH16_STATE||null,
        batch16Registered:window.V11_BATCH16_REGISTERED,
        batch16RegisteredCount:window.V11_BATCH16_REGISTERED_COUNT,
        b16Count:b16.length,
        b16Unique:new Set(b16.map(p=>p.id)).size,
        b16First:b16[0]&&{id:b16[0].id,title:b16[0].title,questions:(b16[0].questions||[]).length,questionSetB:(b16[0].questionSetB||[]).length,slashRows:(b16[0].slashRows||[]).length}
      };
    });
    await page.selectOption('#textbook','サンシャイン');
    await page.selectOption('#grade','1');
    await page.waitForTimeout(200);
    await page.selectOption('#major',{label:'PROGRAM 10'});
    await page.waitForTimeout(200);
    await page.selectOption('#section','PROGRAM 10-2');
    await page.waitForFunction(()=>[...document.querySelectorAll('#v11PassageVariant option')].some(o=>o.value==='V11-B16-G1-001'),{timeout:15000});
    await page.selectOption('#v11PassageVariant','V11-B16-G1-001');
    await page.waitForFunction(()=>window.V11_MULTI_PASSAGE_UI_STATE&&window.V11_MULTI_PASSAGE_UI_STATE.selectedId==='V11-B16-G1-001',{timeout:10000});
    const rendered=await page.evaluate(()=>({
      selectedId:window.V11_MULTI_PASSAGE_UI_STATE&&window.V11_MULTI_PASSAGE_UI_STATE.selectedId,
      optionCount:document.querySelector('#v11PassageVariant')?.options.length||0,
      passageText:document.querySelector('#passage')?.innerText||'',
      questionsText:document.querySelector('#questions')?.innerText||'',
      answersText:document.querySelector('#answers')?.innerText||''
    }));
    const sourceOk=!expectedSourceSha||source.includes('source_sha='+expectedSourceSha);
    const pass=!!resp&&resp.ok()&&source.includes('expected_registered_total=968')&&sourceOk&&
      Number(runtime.multi&&runtime.multi.extraPassages)===800&&
      Number(runtime.batch16State&&runtime.batch16State.totalWithBaseline)===968&&
      runtime.batch16Registered===true&&Number(runtime.batch16RegisteredCount)===50&&runtime.b16Count===50&&runtime.b16Unique===50&&
      runtime.b16First&&runtime.b16First.questions===5&&runtime.b16First.questionSetB===5&&runtime.b16First.slashRows>0&&
      rendered.selectedId==='V11-B16-G1-001'&&rendered.passageText.includes('The Quiet Corner')&&rendered.questionsText.length>20&&errors.length===0;
    Object.assign(report,{httpStatus:resp&&resp.status(),source,runtime,rendered:{selectedId:rendered.selectedId,optionCount:rendered.optionCount,passageHasTitle:rendered.passageText.includes('The Quiet Corner'),questionsChars:rendered.questionsText.length,answersChars:rendered.answersText.length},errors,pass});
  }catch(e){report.error=String(e&&e.stack||e);}
  finally{await browser.close();}
  fs.writeFileSync('V11_PREVIEW_968_SMOKE_REPORT.json',JSON.stringify(report,null,2)+'\n');
  console.log(JSON.stringify(report,null,2));
  if(!report.pass)process.exit(2);
})().catch(e=>{console.error(e);process.exit(3)});