const fs=require('fs');const {chromium}=require('playwright');
(async()=>{const browser=await chromium.launch({headless:true});const out={generatedAt:new Date().toISOString(),pass:false};try{
 const p=await browser.newPage();await p.goto(process.env.V11_LOCAL_URL||'http://127.0.0.1:4180/index.html',{waitUntil:'domcontentloaded',timeout:120000});
 await p.waitForFunction(()=>window.V11_YAMAGUCHI_100_READY===true&&window.V11_FINAL_RELEASE_READING_ONLY_APPLIED===true&&Number(window.V11_MULTI_PASSAGE_STATE&&window.V11_MULTI_PASSAGE_STATE.extraPassages)===832,{timeout:150000});
 const r=await p.evaluate(()=>{
  const all=Object.values(window.V11_EXTRA_PASSAGES||{}).flat();
  const ys=all.filter(x=>x&&x.yamaguchiStyle===true);
  const bad=[];const types={};const byBatch={};const byTier={};
  const wc=s=>(String(s||'').match(/[A-Za-z]+(?:['’][A-Za-z]+)*/g)||[]).length;
  for(const x of ys){
   const qs=[...(x.questions||[]),...(x.questionSetB||[])],ts=qs.map(q=>String(q.questionType||q.type||'').toUpperCase());
   const distinct=[...new Set(ts.filter(Boolean))];
   const words=wc(x.body||x.sentences&&x.sentences.join(' ')||'');
   const tier=words>=330?'EXAM_STAMINA':words>=240?'LONG':words>=150?'STANDARD':'SHORT';
   const m=String(x.id||'').match(/V11-B(\d+)-/),batch=m?('B'+m[1]):String(x.batch||'other');
   byBatch[batch]=(byBatch[batch]||0)+1;byTier[tier]=(byTier[tier]||0)+1;
   for(const t of ts)types[t]=(types[t]||0)+1;
   const checks={ten:qs.length===10,distinct6:distinct.length>=6,content:ts.includes('CONTENT_MATCH'),insOrSum:ts.includes('SENTENCE_INSERTION')||ts.includes('SUMMARY_FILL'),ctxOrPhrase:ts.includes('CONTEXT_WORD')||ts.includes('PHRASE_FILL'),reasonOrInf:ts.includes('REASON')||ts.includes('INFERENCE'),noWrite:!x.freeWriteTask&&!x.freeWrite&&!qs.some(q=>/FREE_WRITE|英作文|20.?30.?語|write\s+(?:20|about|an?|your|in\s+english)/i.test(String(q.prompt||q.question||'')+' '+String(q.questionType||q.type||'')))};
   if(!Object.values(checks).every(Boolean))bad.push({id:x.id,checks,types:ts});
  }
  return{total:all.length,yCount:ys.length,state:window.V11_YAMAGUCHI_100_STATE,ids:ys.map(x=>x.id),byBatch,byTier,typeCounts:types,bad};
 });
 const manifest=JSON.parse(fs.readFileSync('V11_YAMAGUCHI_100_SUBSET_20260929.json','utf8'));
 const checks={runtime1000:r.total===832,runtimeY100:r.yCount===100,manifest100:manifest.count===100&&manifest.ids.length===100,idsMatch:new Set(r.ids).size===100&&manifest.ids.every(id=>r.ids.includes(id)),tier:r.byTier.EXAM_STAMINA===36&&r.byTier.LONG===32&&r.byTier.STANDARD===32,batchSpread:Object.keys(r.byBatch).length>=10,contract:r.bad.length===0};
 Object.assign(out,{runtime:r,manifestDistribution:manifest.distribution,checks,pass:Object.values(checks).every(Boolean)});
 }catch(e){out.error=String(e&&e.stack||e)}finally{await browser.close()}
 fs.writeFileSync('V11_YAMAGUCHI_100_FINAL_GATE.json',JSON.stringify(out,null,2)+'\n');console.log(JSON.stringify(out,null,2));if(!out.pass)process.exit(2);})();