const fs=require('fs');
const path=require('path');
const vm=require('vm');
function norm(s){return String(s||'').toLowerCase().replace(/[^a-z0-9\s]/g,' ').replace(/\s+/g,' ').trim()}
function words(s){return norm(s).split(' ').filter(Boolean)}
function tokens(s){return new Set(words(s))}
function jac(a,b){const A=tokens(a),B=tokens(b);let i=0;for(const x of A)if(B.has(x))i++;return i/(A.size+B.size-i||1)}
function text(p){return p&&String(p.body||p.passage||p.text||'')}
function filesUnder(dir='.'){let out=[];for(const e of fs.readdirSync(dir,{withFileTypes:true})){if(e.name==='.git'||e.name==='node_modules')continue;const p=path.join(dir,e.name);if(e.isDirectory())out=out.concat(filesUnder(p));else out.push(p.replace(/^\.\//,''));}return out}
function visit(v,fn,seen=new Set()){if(!v||typeof v!=='object'||seen.has(v))return;seen.add(v);fn(v);if(Array.isArray(v))for(const x of v)visit(x,fn,seen);else for(const x of Object.values(v))visit(x,fn,seen)}
const all=filesUnder('.');
const byId=new Map();
for(const f of all.filter(f=>/\.json$/i.test(f))){let v;try{v=JSON.parse(fs.readFileSync(f,'utf8'))}catch{continue}visit(v,o=>{const id=String(o&&o.id||'');const b=text(o);if(/^V11-B(?:0[1-9]|1[0-5])-G[123]-\d{3}$/.test(id)&&words(b).length>=40&&!byId.has(id))byId.set(id,{id,body:b,source:f});});}
const batch=[...byId.values()].filter(p=>/^V11-B15-/.test(p.id)).sort((a,b)=>a.id.localeCompare(b.id));
const priorV11=[...byId.values()].filter(p=>/^V11-B(?:0[1-9]|1[0-4])-/.test(p.id)).sort((a,b)=>a.id.localeCompare(b.id));
const baseline=new Map();
for(const f of all.filter(f=>/^v10_data_.*\.js$/i.test(path.basename(f)))){const src=fs.readFileSync(f,'utf8');const ctx={window:{},console:{log(){},warn(){},error(){}}};ctx.globalThis=ctx;vm.createContext(ctx);try{vm.runInContext(src,ctx,{timeout:3000})}catch{continue}visit(ctx.window,o=>{const b=text(o);if(words(b).length<40)return;const n=norm(b);if(n&&!baseline.has(n))baseline.set(n,{id:`V10:${f}:${baseline.size+1}`,body:b,source:f});});}
const prior=[...priorV11,...baseline.values()];
let exact=[],near=[];
function compare(a,b){const na=norm(a.body),nb=norm(b.body);if(!na||!nb)return;if(na===nb)exact.push([a.id,b.id]);else{const s=jac(a.body,b.body);if(s>=0.90)near.push([a.id,b.id,Number(s.toFixed(6))]);}}
for(let i=0;i<batch.length;i++){for(let j=i+1;j<batch.length;j++)compare(batch[i],batch[j]);for(const q of prior)compare(batch[i],q);}
const prerequisites={batch15Exactly50:batch.length===50,registeredV11AtLeast700:priorV11.length>=700,baselineAtLeast168:baseline.size>=168};
const pass=Object.values(prerequisites).every(Boolean)&&exact.length===0&&near.length===0;
const report={generatedAt:new Date().toISOString(),batch:'V11-B15',passages:batch.length,registeredV11Compared:priorV11.length,baselineV10Compared:baseline.size,priorCompared:prior.length,threshold:0.90,prerequisites,exactDuplicates:exact,nearDuplicates:near,finalPass:pass};
fs.writeFileSync('V11_BATCH15_DUPLICATE_GATE_REPORT.json',JSON.stringify(report,null,2)+'\n');
fs.writeFileSync('V11_BATCH15_DUPLICATE_GATE_STATUS.txt',[`batch15_passages=${batch.length}/50`,`registered_v11_compared=${priorV11.length}/700+`,`baseline_v10_compared=${baseline.size}/168+`,`prior_compared=${prior.length}`,`exact_duplicates=${exact.length}`,`near_duplicates=${near.length}`,`threshold=0.90`,`duplicate_gate=${pass?'PASS':'FAIL'}`,''].join('\n'));
console.log(JSON.stringify(report));
if(!pass)process.exit(1);
