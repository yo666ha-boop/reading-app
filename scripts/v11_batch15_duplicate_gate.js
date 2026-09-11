const fs=require('fs');
const path=require('path');
const vm=require('vm');
function norm(s){return String(s||'').toLowerCase().replace(/[^a-z0-9\s]/g,' ').replace(/\s+/g,' ').trim()}
function words(s){return norm(s).split(' ').filter(Boolean)}
function tokens(s){return new Set(words(s))}
function jac(a,b){const A=tokens(a),B=tokens(b);let i=0;for(const x of A)if(B.has(x))i++;return i/(A.size+B.size-i||1)}
function text(p){if(!p)return'';if(typeof p.body==='string')return p.body;if(typeof p.passage==='string')return p.passage;if(typeof p.text==='string')return p.text;if(Array.isArray(p.sentences))return p.sentences.join(' ');return''}
function filesUnder(dir='.'){let out=[];for(const e of fs.readdirSync(dir,{withFileTypes:true})){if(e.name==='.git'||e.name==='node_modules')continue;const p=path.join(dir,e.name);if(e.isDirectory())out=out.concat(filesUnder(p));else out.push(p.replace(/^\.\//,''));}return out}
function visit(v,fn,seen=new Set()){if(!v||typeof v!=='object'||seen.has(v))return;seen.add(v);fn(v);if(Array.isArray(v))for(const x of v)visit(x,fn,seen);else for(const x of Object.values(v))visit(x,fn,seen)}
const all=filesUnder('.');
function jsonPassages(){const m=new Map();for(const f of all.filter(f=>/\.json$/i.test(f))){let v;try{v=JSON.parse(fs.readFileSync(f,'utf8'))}catch{continue}visit(v,o=>{const id=String(o&&o.id||'');const b=text(o);if(/^V11-B(?:0[1-9]|1[0-5])-G[123]-\d{3}$/.test(id)&&words(b).length>=40&&!m.has(id))m.set(id,{id,body:b,source:f});});}return m}
function ctxFor(batchNo,captured){const c={console:{log(){},warn(){},error(){}},setTimeout(){return 0},clearTimeout(){},Event:function(){},CustomEvent:function(){},fetch(){return Promise.reject(new Error('fetch disabled in static extractor'))}};c.window=c;c.globalThis=c;c.document={createElement(){return {set src(v){this._src=v},get src(){return this._src},set async(v){},onload:null,onerror:null}},head:{appendChild(){}},querySelector(){return null},getElementById(){return null}};c.dispatchEvent=()=>{};c.V11_APPLY_EASY_SUPPORT_NOTES=()=>{};c.V11_REGISTER_PASSAGES=list=>{for(const p of list||[]){const b=text(p);if(p&&p.id&&words(b).length>=40)captured.set(String(p.id),{id:String(p.id),body:b,source:`runtime-b${String(batchNo).padStart(2,'0')}`});}return{extraPassages:batchNo*50,lastAdded:(list||[]).length}};vm.createContext(c);return c}
function runFile(c,f){if(!fs.existsSync(f))throw new Error('missing runtime source '+f);vm.runInContext(fs.readFileSync(f,'utf8'),c,{filename:f,timeout:5000})}
function bootstrapFiles(n){const b=String(n).padStart(2,'0'),f=`v11_batch${b}_bootstrap.js`;if(!fs.existsSync(f))throw new Error('missing '+f);const s=fs.readFileSync(f,'utf8'),m=s.match(/const\s+files\s*=\s*\[([\s\S]*?)\]/);if(!m)throw new Error('cannot parse files list '+f);return [...m[1].matchAll(/['"]([^'"]+\.js)['"]/g)].map(x=>x[1])}
function registeredV11FromRuntimeSources(){const captured=new Map();{
 const c=ctxFor(1,captured);runFile(c,'v11_batch01_passages_001_050.js');for(const f of ['v11_batch01_uniqueness_repair.js','v11_batch01_grammar_repair.js'])if(fs.existsSync(f))runFile(c,f);
 }
 for(let n=2;n<=13;n++){const c=ctxFor(n,captured);for(const f of bootstrapFiles(n)){try{runFile(c,f)}catch(e){if(/register/.test(f))throw e;}}
 }
 const j=jsonPassages();for(const p of j.values())if(/^V11-B14-/.test(p.id))captured.set(p.id,p);
 return captured}
function baselineV10(){const out=new Map();for(const f of all.filter(f=>/^v10_data_.*\.js$/i.test(path.basename(f)))){const c={window:{},console:{log(){},warn(){},error(){}}};c.globalThis=c;vm.createContext(c);try{vm.runInContext(fs.readFileSync(f,'utf8'),c,{timeout:3000})}catch{continue}visit(c.window,o=>{const b=text(o);if(words(b).length<40)return;const n=norm(b);if(n&&!out.has(n))out.set(n,{id:`V10:${path.basename(f)}:${out.size+1}`,body:b,source:f});});}return out}
const json=jsonPassages();
const batch=[...json.values()].filter(p=>/^V11-B15-/.test(p.id)).sort((a,b)=>a.id.localeCompare(b.id));
let priorMap;try{priorMap=registeredV11FromRuntimeSources()}catch(e){console.error(e.stack||e);priorMap=new Map()}
const priorV11=[...priorMap.values()];
const baseline=[...baselineV10().values()];
const prior=[...priorV11,...baseline];
let exact=[],near=[];
function compare(a,b){const na=norm(a.body),nb=norm(b.body);if(!na||!nb)return;if(na===nb)exact.push([a.id,b.id]);else{const s=jac(a.body,b.body);if(s>=0.90)near.push([a.id,b.id,Number(s.toFixed(6))]);}}
for(let i=0;i<batch.length;i++){for(let j=i+1;j<batch.length;j++)compare(batch[i],batch[j]);for(const q of prior)compare(batch[i],q);}
const prerequisites={batch15Exactly50:batch.length===50,registeredV11Exactly700:priorV11.length===700,baselineAtLeast168:baseline.length>=168};
const pass=Object.values(prerequisites).every(Boolean)&&exact.length===0&&near.length===0;
const report={generatedAt:new Date().toISOString(),batch:'V11-B15',passages:batch.length,registeredV11Compared:priorV11.length,baselineV10Compared:baseline.length,priorCompared:prior.length,threshold:0.90,prerequisites,exactDuplicates:exact,nearDuplicates:near,finalPass:pass};
fs.writeFileSync('V11_BATCH15_DUPLICATE_GATE_REPORT.json',JSON.stringify(report,null,2)+'\n');fs.writeFileSync('V11_BATCH15_DUPLICATE_GATE_STATUS.txt',[`batch15_passages=${batch.length}/50`,`registered_v11_compared=${priorV11.length}/700`,`baseline_v10_compared=${baseline.length}/168+`,`prior_compared=${prior.length}`,`exact_duplicates=${exact.length}`,`near_duplicates=${near.length}`,`threshold=0.90`,`duplicate_gate=${pass?'PASS':'FAIL'}`,''].join('\n'));console.log(JSON.stringify(report));if(!pass)process.exit(1);
