const fs=require('fs');const {chromium}=require('playwright');
const URL=process.env.V11_LOCAL_URL||'http://127.0.0.1:4177/index.html';
const compRe=/FREE_WRITE|英作文|20.?30.?語|write\s+(?:20|about|an?|your|in\s+english)/i;
function normType(q){return String(q&& (q.questionType||q.type)||'').trim().toUpperCase().replace(/\s+/g,'_')}
function wc(s){return (String(s||'').match(/[A-Za-z]+(?:['’][A-Za-z]+)*/g)||[]).length}
(async()=>{
 const browser=await chromium.launch({headless:true});const report={generatedAt:new Date().toISOString(),pass:false};
 try{
  const page=await browser.newPage();await page.goto(URL,{waitUntil:'domcontentloaded',timeout:120000});
  await page.waitForFunction(()=>window.V11_FINAL32_REGISTERED===true&&window.V11_FINAL_RELEASE_READING_ONLY_APPLIED===true&&Number(window.V11_MULTI_PASSAGE_STATE&&window.V11_MULTI_PASSAGE_STATE.extraPassages)===832,{timeout:150000});
  const rows=await page.evaluate(()=>{
    const body=p=>typeof p.body==='string'?p.body:Array.isArray(p.sentences)?p.sentences.join(' '):'';
    return Object.values(window.V11_EXTRA_PASSAGES||{}).flat().filter(p=>String(p&&p.grade||'')==='3'||/-G3-/.test(String(p&&p.id||''))).map(p=>({id:String(p.id||''),batch:String(p.batch||''),level:String(p.level||''),tier:String(p.tier||''),genre:String(p.genre||''),examStyle:String(p.examStyle||p.examType||p.style||''),body:body(p),questions:[...(p.questions||[]),...(p.questionSetB||[])],materialData:p.materialData||null,keys:Object.keys(p)}));
  });
  const out=rows.map(p=>{
    const types=p.questions.map(q=>String(q&& (q.questionType||q.type)||'').trim().toUpperCase().replace(/\s+/g,'_'));
    const distinct=[...new Set(types.filter(Boolean))];
    const prompts=p.questions.map(q=>String(q&& (q.prompt||q.question)||''));
    const composition=prompts.some(x=>/FREE_WRITE|英作文|20.?30.?語|write\s+(?:20|about|an?|your|in\s+english)/i.test(x));
    const wordCount=(p.body.match(/[A-Za-z]+(?:['’][A-Za-z]+)*/g)||[]).length;
    const explicit=/YAMAGUCHI|ENTRANCE_EXAM/i.test([p.level,p.tier,p.genre,p.examStyle,...p.keys].join(' '));
    const checks={
      tenQuestions:p.questions.length===10,
      noComposition:!composition,
      wordCountGrade3:wordCount>=150&&wordCount<=450,
      distinct6:distinct.length>=6,
      contentMatch:types.includes('CONTENT_MATCH'),
      insertionOrSummary:types.includes('SENTENCE_INSERTION')||types.includes('SUMMARY_FILL'),
      contextOrPhrase:types.includes('CONTEXT_WORD')||types.includes('PHRASE_FILL'),
      reasonOrInference:types.includes('REASON')||types.includes('INFERENCE'),
      materialIfPresent:!p.materialData||types.includes('MATERIAL_LINK')
    };
    const qualifying=Object.values(checks).every(Boolean);
    const m=p.id.match(/V11-B(\d+)-/);const batch=m?('B'+m[1]):(p.batch||'other');
    const lengthTier=wordCount>=330?'EXAM_STAMINA':wordCount>=240?'LONG':wordCount>=150?'STANDARD':'SHORT';
    return {id:p.id,batch,wordCount,lengthTier,explicit,qualifying,types,distinctTypes:distinct,checks,hasMaterial:!!p.materialData};
  });
  const explicit=out.filter(x=>x.explicit),qualifying=out.filter(x=>x.qualifying),qualifyingExplicit=out.filter(x=>x.explicit&&x.qualifying),explicitFail=out.filter(x=>x.explicit&&!x.qualifying),additional=out.filter(x=>!x.explicit&&x.qualifying);
  const countBy=(arr,key)=>arr.reduce((o,x)=>{const k=x[key]||'(blank)';o[k]=(o[k]||0)+1;return o},{});
  Object.assign(report,{grade3Count:out.length,explicitCount:explicit.length,qualifyingCount:qualifying.length,qualifyingExplicitCount:qualifyingExplicit.length,explicitFailCount:explicitFail.length,additionalQualifyingCount:additional.length,byBatchQualifying:countBy(qualifying,'batch'),byTierQualifying:countBy(qualifying,'lengthTier'),explicitFail,additionalQualifying:additional,all:out,pass:qualifying.length>=100&&qualifyingExplicit.length===explicit.length});
 }catch(e){report.error=String(e&&e.stack||e)}
 finally{await browser.close()}
 fs.writeFileSync('V11_YAMAGUCHI_100_CANDIDATE_AUDIT.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({grade3Count:report.grade3Count,explicitCount:report.explicitCount,qualifyingCount:report.qualifyingCount,qualifyingExplicitCount:report.qualifyingExplicitCount,explicitFailCount:report.explicitFailCount,additionalQualifyingCount:report.additionalQualifyingCount,byBatchQualifying:report.byBatchQualifying,byTierQualifying:report.byTierQualifying,pass:report.pass,error:report.error},null,2));if(!report.pass)process.exit(2);
})();