'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),{chromium}=require('playwright');
const origin=process.env.READING_APP_URL||'http://127.0.0.1:4177';
(async()=>{
 const browser=await chromium.launch({headless:true}),page=await browser.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto(origin+'/index.html',{waitUntil:'load'});
 await page.waitForFunction(()=>window.V11_MULTI_PASSAGE_STATE?.extraPassages===832,null,{timeout:50000});
 if(!(await page.evaluate(()=>window.V11_UNIT_SUPPLEMENTAL_STATE?.count===12))){
  await page.addScriptTag({url:origin+'/v11_unit_supplemental_20261114.js'});
  await page.addScriptTag({url:origin+'/v11_unit_supplemental_wave2_20261114.js'});
 }
 await page.waitForFunction(()=>window.V11_UNIT_SUPPLEMENTAL_STATE?.count===12,null,{timeout:5000});
 const report=await page.evaluate(()=>{
  const registry=window.V11_EXTRA_PASSAGES||{},supp=window.V11_UNIT_SUPPLEMENTAL_PASSAGES||{},ds=DATASETS,items=[];
  const norm=s=>String(s).normalize('NFKC').trim().replace(/\s+/g,' ').replace(/\s*-\s*/g,'-').replace(/^(program|unit)\s*/i,m=>m.trim().toUpperCase()+' ');
  for(const grade of ['1','2','3'])for(const textbook of ['サンシャイン','ニューホライズン']){
   const map=ds?.[grade]?.[textbook]||{},course=[];
   for(const [section,p] of Object.entries(map)){
    const key=[textbook,grade,norm(section)].join('|'),extra=(registry[key]||[]).length,supplementary=(supp[key]||[]).length;
    course.push({section,base:Number(!!p),extra,supplementary,total:Number(!!p)+extra+supplementary});
   }
   items.push({textbook,grade,totalSections:course.length,under2:course.filter(s=>s.total<2).length,
      zeroSupplementary:course.filter(s=>s.supplementary===0).length,sections:course});
  }
  const all=items.flatMap(x=>x.sections);
  return {generatedAt:new Date().toISOString(),source:'full v11 persistent runtime plus supplementary Wave1+2',
    core:{base:all.reduce((n,s)=>n+s.base,0),extra:all.reduce((n,s)=>n+s.extra,0)},
    supplementary:all.reduce((n,s)=>n+s.supplementary,0),allCandidates:all.reduce((n,s)=>n+s.total,0),
    courseCount:items.length,sectionCount:all.length,fewerThan2:all.filter(s=>s.total<2).length,
    sectionsWithSupplement:all.filter(s=>s.supplementary>0).length,courses:items};
 });
 await browser.close();
 assert.equal(errors.length,0,errors.join('\n'));
 assert.equal(report.core.base,168,'Frozen base inventory differs');
 assert.equal(report.core.extra,832,'Frozen extra inventory differs');
 assert.equal(report.supplementary,12,'Supplemental inventory differs');
 assert.equal(report.allCandidates,1012,'Total 1000+12 mismatch');
 assert.equal(report.courseCount,6);
 assert.equal(report.sectionsWithSupplement,12);
 fs.writeFileSync('V11_UNIT_COVERAGE_REPORT_20261114.json',JSON.stringify(report,null,2)+'\n');
 console.log('PASS FULL v11 UNIT inventory: base '+report.core.base+', extra '+report.core.extra+', supplements '+report.supplementary+', total '+report.allCandidates);
 console.log('PASS six courses, '+report.sectionCount+' UNIT sections, '+report.sectionsWithSupplement+' supplemented, '+report.fewerThan2+' still below two readings');
 for(const c of report.courses)console.log(c.textbook+' G'+c.grade+': '+c.totalSections+' sections, '+c.under2+' below 2 readings, '+c.zeroSupplementary+' with no supplements');
})().catch(e=>{console.error(e);process.exit(1)});
