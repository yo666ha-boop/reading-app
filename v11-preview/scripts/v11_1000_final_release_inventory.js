const fs=require('fs');
const {chromium}=require('playwright');
const URL=process.env.V11_LOCAL_URL||'http://127.0.0.1:4175/index.html';
function norm(s){return String(s||'').toLowerCase().replace(/[^a-z0-9\s]/g,' ').replace(/\s+/g,' ').trim()}
function jac(a,b){const A=new Set(norm(a).split(' ').filter(Boolean)),B=new Set(norm(b).split(' ').filter(Boolean));let n=0;for(const x of A)if(B.has(x))n++;return n/(A.size+B.size-n||1)}
function counts(rows,key){const o={};for(const r of rows){const v=String(r[key]??'').trim()||'(blank)';o[v]=(o[v]||0)+1}return o}
(async()=>{
 const browser=await chromium.launch({headless:true});
 const report={generatedAt:new Date().toISOString(),source:'local persistent runtime',hardFailures:[],warnings:[],finalHardPass:false};
 try{
  const page=await browser.newPage({viewport:{width:1440,height:1000}});
  const errors=[];page.on('pageerror',e=>errors.push('page:'+e.message));page.on('console',m=>{if(m.type()==='error')errors.push('console:'+m.text())});
  const r=await page.goto(URL,{waitUntil:'domcontentloaded',timeout:120000});
  if(!r||!r.ok())throw new Error('HTTP '+(r&&r.status()));
  await page.waitForFunction(()=>window.V11_FINAL32_REGISTERED===true&&window.V11_FINAL_RELEASE_READING_ONLY_APPLIED===true&&window.V11_YAMAGUCHI_100_READY===true&&window.V11_MULTI_PASSAGE_STATE&&Number(window.V11_MULTI_PASSAGE_STATE.extraPassages)===832,{timeout:150000});
  const data=await page.evaluate(()=>{
   // Match the UI's V11 body source: registered passages render ordered sentences; body/passage/text are legacy fallbacks.\nconst body=p=>{if(!p)return'';if(Array.isArray(p.sentences)&&p.sentences.length)return p.sentences.join(' ');if(typeof p.body==='string')return p.body;if(typeof p.passage==='string')return p.passage;if(typeof p.text==='string')return p.text;return''};
   const base=[];const ds=(typeof DATASETS!=='undefined'&&DATASETS)||{};
   for(const [grade,tbs] of Object.entries(ds))for(const [textbook,secs] of Object.entries(tbs||{}))for(const [section,p] of Object.entries(secs||{})){if(!p)continue;base.push({source:'base',id:String(p.id||('BASE:'+grade+'|'+textbook+'|'+section)),grade:String(p.grade||grade),textbook:String(p.textbook||textbook),section:String(p.section||section),body:body(p),fullTranslation:String(p.fullTranslation||''),questions:Array.isArray(p.questions)?p.questions:[],questionSetB:Array.isArray(p.questionSetB)?p.questionSetB:[],notes:Array.isArray(p.notes)?p.notes:[],supportNotes:Array.isArray(p.supportNotes)?p.supportNotes:[],requiredLocal:Array.isArray(p.requiredLocal)?p.requiredLocal:[],level:p.level||'',genre:p.genre||'',tier:p.tier||'',batch:p.batch||'',examStyle:p.examStyle||p.examType||p.style||'',freeWriteTask:p.freeWriteTask||null,freeWrite:p.freeWrite||null,keys:Object.keys(p)})}
   const extra=[];for(const arr of Object.values(window.V11_EXTRA_PASSAGES||{}))for(const p of (Array.isArray(arr)?arr:[])){extra.push({source:'extra',id:String(p.id||''),grade:String(p.grade||''),textbook:String(p.textbook||''),section:String(p.section||''),body:body(p),fullTranslation:String(p.fullTranslation||''),questions:Array.isArray(p.questions)?p.questions:[],questionSetB:Array.isArray(p.questionSetB)?p.questionSetB:[],notes:Array.isArray(p.notes)?p.notes:[],supportNotes:Array.isArray(p.supportNotes)?p.supportNotes:[],requiredLocal:Array.isArray(p.requiredLocal)?p.requiredLocal:[],level:p.level||'',genre:p.genre||'',tier:p.tier||'',batch:p.batch||'',examStyle:p.examStyle||p.examType||p.style||'',materialData:p.materialData||null,freeWriteTask:p.freeWriteTask||null,freeWrite:p.freeWrite||null,keys:Object.keys(p)})}
   return {base,extra,state:window.V11_MULTI_PASSAGE_STATE,final32:window.V11_FINAL32_STATE};
  });
  const all=[...data.base,...data.extra],ids=new Map(),bodies=new Map(),dupIds=[],dupBodies=[];
  for(const p of all){if(ids.has(p.id))dupIds.push([ids.get(p.id),p.id]);else ids.set(p.id,p.id);const b=norm(p.body);if(!b)report.hardFailures.push('empty body '+p.id);else if(bodies.has(b))dupBodies.push([bodies.get(b),p.id]);else bodies.set(b,p.id)}
  const near=[];const groups={};for(const p of all){const k=[p.textbook,p.grade,p.section].join('|');(groups[k]??=[]).push(p)}
  for(const arr of Object.values(groups))for(let i=0;i<arr.length;i++)for(let j=i+1;j<arr.length;j++){const s=jac(arr[i].body,arr[j].body);if(s>=.90)near.push({a:arr[i].id,b:arr[j].id,score:+s.toFixed(4)})}
  const qFailures=[],typeCounts={},composition=[];
  report.v11QuestionContractDiagnostics=[];
  for(const p of data.extra){
   if((p.questions||[]).length!==5||(p.questionSetB||[]).length!==5)qFailures.push(p.id+' A/B '+(p.questions||[]).length+'/'+(p.questionSetB||[]).length);
   for(const [set,qs] of [['A',p.questions||[]],['B',p.questionSetB||[]]])for(let i=0;i<qs.length;i++){
    const q=qs[i]||{},prompt=String(q.prompt||q.question||''),type=String(q.questionType||q.type||'').trim()||'(blank)';
    typeCounts[type]=(typeCounts[type]||0)+1;
    for(const k of ['answer','evidence','evidenceJp','reason'])if(!String(q[k]||'').trim())qFailures.push(p.id+' '+set+(i+1)+' missing '+k);
    if(!prompt.trim())qFailures.push(p.id+' '+set+(i+1)+' missing prompt');
    const evs=Array.isArray(q.evidence)?q.evidence.map(String):[String(q.evidence||'')];
    for(const ev of evs.filter(Boolean)) if(!norm(p.body).includes(norm(ev))){
      qFailures.push(p.id+' '+set+(i+1)+' evidence not body substring');
      if(report.v11QuestionContractDiagnostics.length<40)report.v11QuestionContractDiagnostics.push({id:p.id,set,no:i+1,evidence:ev.slice(0,400),bodyLength:p.body.length,bodyHead:p.body.slice(0,900),bodyHasEvidence:p.body.includes(ev),normalizedEvidence:norm(ev),normalizedBodyHead:norm(p.body).slice(0,1100)});
    }
    const low=(prompt+' '+type).toLowerCase();
    if(/free[_ -]?write|composition|英作文|20.?30.?語|write\s+(?:about|an?|your|in\s+english)/i.test(low))composition.push({id:p.id,set,no:i+1,type,prompt});
   }
   if(p.freeWriteTask||p.freeWrite)composition.push({id:p.id,set:'passage',no:0,type:'freeWriteField',prompt:String((p.freeWriteTask&&p.freeWriteTask.prompt)||p.freeWrite||'')});
  }
  const yCandidates=data.extra.filter(p=>{
    const tag=[p.level,p.genre,p.tier,p.batch,p.examStyle,...p.keys].join(' ').toUpperCase();
    return /YAMAGUCHI|ENTRANCE_EXAM/.test(tag);
  });
  const yTypes={};for(const p of yCandidates)for(const q of [...(p.questions||[]),...(p.questionSetB||[])]){const t=String(q.questionType||q.type||'(blank)');yTypes[t]=(yTypes[t]||0)+1}
  const yByBatch={};for(const p of yCandidates){const m=p.id.match(/V11-B(\d+)-/);const k=m?('B'+m[1]):(p.batch||'other');yByBatch[k]=(yByBatch[k]||0)+1}
  const yRows=yCandidates.map(p=>({id:p.id,level:p.level,genre:p.genre,tier:p.tier,batch:p.batch,examStyle:p.examStyle,wordCount:(p.body.match(/[A-Za-z]+(?:['’][A-Za-z]+)*/g)||[]).length,hasMaterial:!!p.materialData,questionTypes:[...(p.questions||[]),...(p.questionSetB||[])].map(q=>q.questionType||q.type||'')}));
  Object.assign(report,{runtime:{base:data.base.length,extra:data.extra.length,total:all.length,state:data.state,final32:data.final32},distributions:{level:counts(data.extra,'level'),genre:counts(data.extra,'genre'),tier:counts(data.extra,'tier'),examStyle:counts(data.extra,'examStyle')},global:{duplicateIds:dupIds,duplicateBodies:dupBodies,nearDuplicatesSameSection90:near},v11QuestionContract:{passages:data.extra.length,totalQuestions:data.extra.reduce((n,p)=>n+(p.questions||[]).length+(p.questionSetB||[]).length,0),failures:qFailures,typeCounts},composition:{count:composition.length,items:composition.slice(0,200)},yamaguchiInventory:{count:yCandidates.length,byBatch:yByBatch,questionTypes:yTypes,rows:yRows},browserErrors:errors});
  if(data.base.length!==168)report.hardFailures.push('base '+data.base.length+'/168');
  if(data.extra.length!==832)report.hardFailures.push('extra '+data.extra.length+'/832');
  if(all.length!==1000)report.hardFailures.push('total '+all.length+'/1000');
  if(dupIds.length)report.hardFailures.push('duplicate IDs '+dupIds.length);
  if(dupBodies.length)report.hardFailures.push('duplicate bodies '+dupBodies.length);
  if(near.length)report.hardFailures.push('same-section near duplicates >=.90 '+near.length);
  if(qFailures.length)report.hardFailures.push('v11 question contract failures '+qFailures.length);
  if(composition.length)report.hardFailures.push('composition/free-writing items '+composition.length);
  if(errors.length)report.hardFailures.push('browser errors '+errors.length);
  if(yCandidates.length!==100)report.warnings.push('ACTIVE_SPEC expects exactly 100 Yamaguchi-style passages; detected '+yCandidates.length);
  report.finalHardPass=report.hardFailures.length===0;
 }catch(e){report.fatal=String(e&&e.stack||e);report.hardFailures.push('fatal');}
 finally{await browser.close();}
 fs.writeFileSync('V11_1000_FINAL_RELEASE_INVENTORY.json',JSON.stringify(report,null,2)+'\n');
 console.log(JSON.stringify(report,null,2)); if(!report.finalHardPass)process.exit(2);
})().catch(e=>{console.error(e);process.exit(3)});