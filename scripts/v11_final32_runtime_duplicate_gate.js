const fs=require('fs');
const path=require('path');
const {chromium}=require('playwright');
const {spawn}=require('child_process');
const ROOT=path.resolve(__dirname,'..');
const bodyFiles=['V11_FINAL32_BODY_TRANSLATION_DRAFT_G1_001_008.json','V11_FINAL32_BODY_TRANSLATION_DRAFT_G1_009_011.json','V11_FINAL32_BODY_TRANSLATION_DRAFT_G2_001_008.json','V11_FINAL32_BODY_TRANSLATION_DRAFT_G2_009_011.json','V11_FINAL32_BODY_TRANSLATION_DRAFT_G3_001_010.json'];
function norm(s){return String(s||'').toLowerCase().replace(/[^a-z0-9\s]/g,' ').replace(/\s+/g,' ').trim()}
function toks(s){return new Set(norm(s).split(' ').filter(Boolean))}
function jac(a,b){const A=toks(a),B=toks(b);let n=0;for(const x of A)if(B.has(x))n++;return n/(A.size+B.size-n||1)}
function candidate(){return bodyFiles.flatMap(f=>JSON.parse(fs.readFileSync(path.join(ROOT,f),'utf8')).items||[]).map(x=>({id:x.id,body:x.body}))}
(async()=>{
 const cand=candidate();
 const srv=spawn('python3',['-m','http.server','8124','--bind','127.0.0.1'],{cwd:ROOT,stdio:'ignore'});
 await new Promise(r=>setTimeout(r,1200));
 let browser;
 try{
  browser=await chromium.launch({headless:true});
  const page=await browser.newPage();
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:8124/index.html',{waitUntil:'networkidle',timeout:120000});
  await page.waitForFunction(()=>window.V11_MULTI_PASSAGE_STATE&&Number(window.V11_MULTI_PASSAGE_STATE.extraPassages)===800&&window.V11_BATCH16_REGISTERED===true,{timeout:120000});
  const rt=await page.evaluate(()=>{
   const body=p=>{if(!p)return'';if(typeof p.body==='string')return p.body;if(typeof p.passage==='string')return p.passage;if(typeof p.text==='string')return p.text;if(Array.isArray(p.sentences))return p.sentences.join(' ');return''};
   const datasets=(typeof DATASETS!=='undefined'&&DATASETS)||{},base=[],seen=new Set();
   for(const [g,tbs] of Object.entries(datasets))for(const [tb,secs] of Object.entries(tbs||{}))for(const [sec,p] of Object.entries(secs||{})){if(!p)continue;const id=String(p.id||`${g}|${tb}|${sec}`),txt=body(p);if(txt&&!seen.has(id)){seen.add(id);base.push({id:`BASE:${id}`,body:txt})}}
   const extra=[];for(const arr of Object.values(window.V11_EXTRA_PASSAGES||{}))for(const p of (Array.isArray(arr)?arr:[])){const txt=body(p);if(p&&p.id&&txt)extra.push({id:String(p.id),body:txt})}
   return {base,extra,state:window.V11_MULTI_PASSAGE_STATE,b16:window.V11_BATCH16_STATE||null};
  });
  const prior=[...rt.base,...rt.extra],exact=[],near=[];
  for(let i=0;i<cand.length;i++){
   for(let j=i+1;j<cand.length;j++){const a=norm(cand[i].body),b=norm(cand[j].body);if(a===b)exact.push([cand[i].id,cand[j].id]);else{const s=jac(a,b);if(s>=.90)near.push([cand[i].id,cand[j].id,+s.toFixed(6)])}}
   for(const p of prior){const a=norm(cand[i].body),b=norm(p.body);if(a===b)exact.push([cand[i].id,p.id]);else{const s=jac(a,b);if(s>=.90)near.push([cand[i].id,p.id,+s.toFixed(6)])}}
  }
  const prerequisites={candidate32:cand.length===32&&new Set(cand.map(x=>x.id)).size===32,baseline168:rt.base.length===168,registeredExtra800:rt.extra.length===800,prior968:prior.length===968,batch16Registered:rt.b16&&rt.b16.registered===true};
  const out={generatedAt:new Date().toISOString(),batch:'V11-FINAL32',registered:false,officialTotal:968,threshold:.90,candidate:cand.length,prior:prior.length,prerequisites,exactDuplicates:exact,nearDuplicates:near,browserErrors:errors,finalPass:Object.values(prerequisites).every(Boolean)&&exact.length===0&&near.length===0&&errors.length===0};
  fs.writeFileSync(path.join(ROOT,'V11_FINAL32_RUNTIME_DUPLICATE_GATE_REPORT.json'),JSON.stringify(out,null,2)+'\n');console.log(JSON.stringify(out,null,2));if(!out.finalPass)process.exitCode=2;
 }finally{if(browser)await browser.close();srv.kill('SIGTERM')}
})().catch(e=>{console.error(e);process.exit(3)});