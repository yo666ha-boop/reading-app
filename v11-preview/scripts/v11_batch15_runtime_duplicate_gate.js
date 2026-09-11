const fs=require('fs');
const { chromium }=require('playwright');
const { spawn }=require('child_process');
function norm(s){return String(s||'').toLowerCase().replace(/[^a-z0-9\s]/g,' ').replace(/\s+/g,' ').trim()}
function body(p){if(!p)return'';if(typeof p.body==='string')return p.body;if(typeof p.passage==='string')return p.passage;if(typeof p.text==='string')return p.text;if(Array.isArray(p.sentences))return p.sentences.join(' ');return''}
function toks(s){return new Set(norm(s).split(' ').filter(Boolean))}
function jac(a,b){const A=toks(a),B=toks(b);let n=0;for(const x of A)if(B.has(x))n++;return n/(A.size+B.size-n||1)}
function visit(v,fn,seen=new Set()){if(!v||typeof v!=='object'||seen.has(v))return;seen.add(v);fn(v);if(Array.isArray(v))v.forEach(x=>visit(x,fn,seen));else Object.values(v).forEach(x=>visit(x,fn,seen))}
function batch15(){const m=new Map();for(const f of fs.readdirSync('.').filter(x=>/^v11_batch15_.*\.json$/i.test(x))){let x;try{x=JSON.parse(fs.readFileSync(f,'utf8'))}catch{continue}visit(x,o=>{const id=String(o&&o.id||'');const b=body(o);if(/^V11-B15-G[123]-\d{3}$/.test(id)&&b&&!m.has(id))m.set(id,{id,body:b});});}return [...m.values()].sort((a,b)=>a.id.localeCompare(b.id))}
(async()=>{
 const srv=spawn('python3',['-m','http.server','8123','--bind','127.0.0.1'],{stdio:'ignore'});await new Promise(r=>setTimeout(r,1200));
 let browser;try{
  browser=await chromium.launch({headless:true});const page=await browser.newPage();await page.goto('http://127.0.0.1:8123/index.html',{waitUntil:'networkidle',timeout:120000});
  await page.waitForFunction(()=>window.V11_MULTI_PASSAGE_STATE&&window.V11_MULTI_PASSAGE_STATE.extraPassages>=700,{timeout:120000});
  const rt=await page.evaluate(()=>{
    const b=p=>{if(!p)return'';if(typeof p.body==='string')return p.body;if(typeof p.passage==='string')return p.passage;if(typeof p.text==='string')return p.text;if(Array.isArray(p.sentences))return p.sentences.join(' ');return''};
    const datasets=(typeof DATASETS!=='undefined'&&DATASETS)||{};
    const base=[],seen=new Set();for(const [g,tbs] of Object.entries(datasets))for(const [tb,secs] of Object.entries(tbs||{}))for(const [sec,p] of Object.entries(secs||{})){if(!p)continue;const id=String(p.id||`${g}|${tb}|${sec}`),txt=b(p);if(txt&&!seen.has(id)){seen.add(id);base.push({id:`BASE:${id}`,body:txt})}}
    const extra=[];for(const arr of Object.values(window.V11_EXTRA_PASSAGES||{}))for(const p of (Array.isArray(arr)?arr:[])){const txt=b(p);if(p&&p.id&&txt)extra.push({id:String(p.id),body:txt})}
    return {base,extra,state:window.V11_MULTI_PASSAGE_STATE};
  });
  const cand=batch15();const prior=[...rt.base,...rt.extra];const exact=[],near=[];for(let i=0;i<cand.length;i++){for(let j=i+1;j<cand.length;j++){const a=norm(cand[i].body),b=norm(cand[j].body);if(a===b)exact.push([cand[i].id,cand[j].id]);else{const s=jac(a,b);if(s>=.90)near.push([cand[i].id,cand[j].id,+s.toFixed(6)])}}for(const p of prior){const a=norm(cand[i].body),b=norm(p.body);if(a===b)exact.push([cand[i].id,p.id]);else{const s=jac(a,b);if(s>=.90)near.push([cand[i].id,p.id,+s.toFixed(6)])}}}
  const prerequisites={batch15Exactly50:cand.length===50,baselineExactly168:rt.base.length===168,registeredExtraExactly700:rt.extra.length===700,priorExactly868:prior.length===868};const pass=Object.values(prerequisites).every(Boolean)&&exact.length===0&&near.length===0;
  const out={generatedAt:new Date().toISOString(),candidate:cand.length,baseline:rt.base.length,registeredExtra:rt.extra.length,prior:prior.length,threshold:.90,prerequisites,exactDuplicates:exact,nearDuplicates:near,runtimeState:rt.state,finalPass:pass};fs.writeFileSync('V11_BATCH15_RUNTIME_DUPLICATE_GATE_REPORT.json',JSON.stringify(out,null,2)+'\n');fs.writeFileSync('V11_BATCH15_RUNTIME_DUPLICATE_GATE_STATUS.txt',`batch15=${cand.length}/50\nbaseline=${rt.base.length}/168\nregistered_extra=${rt.extra.length}/700\nprior=${prior.length}/868\nexact=${exact.length}\nnear=${near.length}\nthreshold=0.90\nruntime_duplicate_gate=${pass?'PASS':'FAIL'}\n`);console.log(out);if(!pass)process.exitCode=1;
 }finally{if(browser)await browser.close();srv.kill('SIGTERM')}
})().catch(e=>{console.error(e);process.exit(1)});
