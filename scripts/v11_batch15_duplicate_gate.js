const fs=require('fs'); const vm=require('vm');
function load(path){const src=fs.readFileSync(path,'utf8');const ctx={};vm.createContext(ctx);vm.runInContext(src.replace(/\bconst\s+(\w+)\s*=/g,'this.$1=').replace(/\blet\s+(\w+)\s*=/g,'this.$1=').replace(/\bvar\s+(\w+)\s*=/g,'this.$1='),ctx,{timeout:5000});return ctx;}
function norm(s){return String(s||'').toLowerCase().replace(/[^a-z0-9\s]/g,' ').replace(/\s+/g,' ').trim()}
function tokens(s){return new Set(norm(s).split(' ').filter(Boolean))}
function jac(a,b){const A=tokens(a),B=tokens(b);let i=0;for(const x of A)if(B.has(x))i++;return i/(A.size+B.size-i||1)}
const files=fs.readdirSync('.');
const batchFiles=files.filter(x=>/^V11_BATCH15_G[123]_PASSAGES\.js$/.test(x));
let batch=[]; for(const f of batchFiles){const c=load(f);for(const v of Object.values(c))if(Array.isArray(v)&&v.some(x=>x&&/^V11-B15-/.test(x.id||'')))batch.push(...v.filter(x=>x&&/^V11-B15-/.test(x.id||'')));}
const seen=new Map();batch=batch.filter(p=>!seen.has(p.id)&&(seen.set(p.id,1),true));
const runtime=load('app_v11.js');let prior=[];for(const v of Object.values(runtime))if(Array.isArray(v)&&v.length&&v[0]&&typeof v[0]==='object'&&('body'in v[0]||'english'in v[0]))prior.push(...v.filter(x=>x&&x.id&&!/^V11-B15-/.test(x.id)));
const text=p=>p.body||p.english||p.passage||p.text||'';
let exact=[],near=[];
for(let i=0;i<batch.length;i++){for(let j=i+1;j<batch.length;j++){if(norm(text(batch[i]))===norm(text(batch[j])))exact.push([batch[i].id,batch[j].id]);else{const s=jac(text(batch[i]),text(batch[j]));if(s>=.90)near.push([batch[i].id,batch[j].id,s]);}}for(const q of prior){if(norm(text(batch[i]))&&norm(text(batch[i]))===norm(text(q)))exact.push([batch[i].id,q.id]);else{const s=jac(text(batch[i]),text(q));if(s>=.90)near.push([batch[i].id,q.id,s]);}}}
const pass=batch.length===50&&exact.length===0&&near.length===0;
const report={generatedAt:new Date().toISOString(),batch:'V11-B15',passages:batch.length,priorCompared:prior.length,threshold:.90,exactDuplicates:exact,nearDuplicates:near,finalPass:pass};
fs.writeFileSync('V11_BATCH15_DUPLICATE_GATE_REPORT.json',JSON.stringify(report,null,2));fs.writeFileSync('V11_BATCH15_DUPLICATE_GATE_STATUS.txt',`batch15_passages=${batch.length}/50\nprior_compared=${prior.length}\nexact_duplicates=${exact.length}\nnear_duplicates=${near.length}\nthreshold=0.90\nduplicate_gate=${pass?'PASS':'FAIL'}\n`);if(!pass)process.exit(1);
