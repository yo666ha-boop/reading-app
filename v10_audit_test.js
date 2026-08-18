const fs=require('fs');
const vm=require('vm');

const SUN_FILES=['v10_data_sunshine_g1.js','v10_data_sunshine_g1_program1.js','v10_data_sunshine_g1_program2.js','v10_data_sunshine_g1_program4.js','v10_data_sunshine_g1_program5.js'];
const NH_FILES=[
 'v10_data_newhorizon_g1.js',
 'v10_data_newhorizon_g1_unit1_2.js',
 'v10_data_newhorizon_g1_unit1_3.js',
 'v10_data_newhorizon_g1_unit2_1.js',
 'v10_data_newhorizon_g1_unit2_2.js',
 'v10_data_newhorizon_g1_unit2_3.js',
 'v10_data_newhorizon_g1_unit3_1.js',
 'v10_data_newhorizon_g1_unit3_2.js',
 'v10_data_newhorizon_g1_unit4_3.js',
 'v10_data_newhorizon_g1_unit5_1.js',
 'v10_data_newhorizon_g1_unit5_2.js',
 'v10_data_newhorizon_g1_unit5_3.js',
 'v10_data_newhorizon_g1_unit6_1.js',
 'v10_data_newhorizon_g1_unit7_1.js',
 'v10_data_newhorizon_g1_unit8_1.js',
 'v10_data_newhorizon_g1_unit9_1.js',
 'v10_data_newhorizon_g1_unit10_1.js'
];

function load(files){
 const ctx={window:{}};
 vm.createContext(ctx);
 for(const f of files){
  if(!fs.existsSync(f)) throw new Error(`missing data file: ${f}`);
  vm.runInContext(fs.readFileSync(f,'utf8'),ctx,{filename:f});
 }
 return ctx.window.V10_PASSAGES||{};
}
function filled(v){return typeof v==='string'&&v.trim().length>0;}
function fail(msg,errors){errors.push(msg);}
function auditSet(label,data,errors){
 for(const [key,m] of Object.entries(data)){
  const tag=`${label}/${key}`;
  if(!m||typeof m!=='object'){fail(`${tag}: object missing`,errors);continue;}
  if(m.section!==key) fail(`${tag}: section key mismatch (${m.section})`,errors);
  for(const k of ['id','title','textbook','grade','section','level','fullTranslation','auditNote']) if(!filled(m[k])) fail(`${tag}: ${k} empty`,errors);
  if(!Array.isArray(m.sentences)||m.sentences.length<10) fail(`${tag}: fewer than 10 sentences`,errors);
  if(!Array.isArray(m.slashRows)||!Array.isArray(m.sentences)||m.slashRows.length!==m.sentences.length) fail(`${tag}: sentence/slash count mismatch`,errors);
  if(Array.isArray(m.slashRows)&&m.slashRows.some(r=>!r||!filled(r.en)||!filled(r.jp))) fail(`${tag}: empty slash row`,errors);
  if(!Array.isArray(m.questions)||m.questions.length<3) fail(`${tag}: fewer than 3 questions`,errors);
  if(Array.isArray(m.questions)){
   m.questions.forEach((q,i)=>{
    for(const k of ['prompt','answer','evidence','evidenceJp','reason']) if(!q||!filled(q[k])) fail(`${tag}: Q${i+1} ${k} empty`,errors);
    if(q&&filled(q.evidence)&&Array.isArray(m.sentences)){
     const parts=q.evidence.split(' / ').map(s=>s.trim()).filter(Boolean);
     for(const p of parts) if(!m.sentences.includes(p)) fail(`${tag}: Q${i+1} evidence not found verbatim in passage: ${p}`,errors);
    }
   });
  }
  if(!Array.isArray(m.allowedWords)||m.allowedWords.length===0) fail(`${tag}: allowedWords empty`,errors);
  if(Array.isArray(m.allowedWords)&&m.allowedWords.some(x=>!Array.isArray(x)||x.length<2||!filled(x[0])||!filled(x[1]))) fail(`${tag}: malformed allowedWords entry`,errors);
  for(const k of ['vocabAudit','manualSlashAudit','manualMeaningAudit','manualQuestionAudit']) if(m[k]!==true) fail(`${tag}: ${k} is not true`,errors);
 }
}

const errors=[];
const sun=load(SUN_FILES);
const nh=load(NH_FILES);
if(Object.keys(sun).length!==20) fail(`Sunshine count expected 20, got ${Object.keys(sun).length}`,errors);
if(Object.keys(nh).length!==31) fail(`New Horizon count expected 31, got ${Object.keys(nh).length}`,errors);
auditSet('SS',sun,errors);auditSet('NH',nh,errors);
const all=[...Object.values(sun),...Object.values(nh)];
const ids=new Map();
for(const m of all){if(ids.has(m.id)) fail(`duplicate id: ${m.id} (${ids.get(m.id)} / ${m.section})`,errors); else ids.set(m.id,m.section);}

const stage=fs.readFileSync('v10_stage1.html','utf8');
for(const f of [...SUN_FILES,...NH_FILES]) if(!stage.includes(`src="${f}"`)) fail(`stage does not load ${f}`,errors);

console.log(`AUDIT passages=${all.length} sunshine=${Object.keys(sun).length} new_horizon=${Object.keys(nh).length}`);
if(errors.length){console.error(`AUDIT FAIL ${errors.length}`);for(const e of errors)console.error(`- ${e}`);process.exit(1);}
console.log('AUDIT PASS: structural release gates, evidence links, IDs, counts, and stage loading are consistent.');