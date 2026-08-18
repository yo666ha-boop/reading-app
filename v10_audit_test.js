const fs=require('fs');
const vm=require('vm');

const SUN_FILES=['v10_data_sunshine_g1.js','v10_data_sunshine_g1_program1.js','v10_data_sunshine_g1_program2.js','v10_data_sunshine_g1_program4.js','v10_data_sunshine_g1_program5.js','v10_data_sunshine_g1_program6.js','v10_data_sunshine_g1_program7.js','v10_data_sunshine_g1_program8.js','v10_data_sunshine_g1_program9.js','v10_data_sunshine_g1_program10.js','v10_data_sunshine_g1_program10_fix.js'];
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

const EXPECTED_SUN=[
 'Get Ready 2','Get Ready 3','Get Ready 4','Get Ready 5','Get Ready 6',
 'PROGRAM 1-1','PROGRAM 1-2','PROGRAM 1-3',
 'PROGRAM 2-1','PROGRAM 2-2','PROGRAM 2-3',
 'PROGRAM 3-1','PROGRAM 3-2','PROGRAM 3-3',
 'PROGRAM 4-1','PROGRAM 4-2','PROGRAM 4-3',
 'PROGRAM 5-1','PROGRAM 5-2','PROGRAM 5-3',
 'PROGRAM 6-1','PROGRAM 6-2','PROGRAM 6-3',
 'PROGRAM 7-1','PROGRAM 7-2','PROGRAM 7-3',
 'PROGRAM 8-1','PROGRAM 8-2','PROGRAM 8-3',
 'PROGRAM 9-1','PROGRAM 9-2','PROGRAM 9-3','PROGRAM 9-4',
 'PROGRAM 10-1','PROGRAM 10-2','PROGRAM 10-3','PROGRAM 10-4',
 'Step 6 / Our Project 3 / Power-Up 6'
];
const EXPECTED_NH=['Unit 0'];
for(let u=1;u<=10;u++) for(let p=1;p<=3;p++) EXPECTED_NH.push(`Unit ${u}-${p}`);

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
function auditExactSections(label,data,expected,errors){
 const actual=Object.keys(data);
 const missing=expected.filter(x=>!actual.includes(x));
 const unexpected=actual.filter(x=>!expected.includes(x));
 if(missing.length) fail(`${label}: missing sections: ${missing.join(', ')}`,errors);
 if(unexpected.length) fail(`${label}: unexpected sections: ${unexpected.join(', ')}`,errors);
}
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
if(Object.keys(sun).length!==EXPECTED_SUN.length) fail(`Sunshine count expected ${EXPECTED_SUN.length}, got ${Object.keys(sun).length}`,errors);
if(Object.keys(nh).length!==EXPECTED_NH.length) fail(`New Horizon count expected ${EXPECTED_NH.length}, got ${Object.keys(nh).length}`,errors);
auditExactSections('Sunshine',sun,EXPECTED_SUN,errors);
auditExactSections('New Horizon',nh,EXPECTED_NH,errors);
auditSet('SS',sun,errors);auditSet('NH',nh,errors);
const all=[...Object.values(sun),...Object.values(nh)];
const ids=new Map();
for(const m of all){if(ids.has(m.id)) fail(`duplicate id: ${m.id} (${ids.get(m.id)} / ${m.section})`,errors); else ids.set(m.id,m.section);}

const stage=fs.readFileSync('v10_stage1.html','utf8');
for(const f of [...SUN_FILES,...NH_FILES]) if(!stage.includes(`src="${f}"`)) fail(`stage does not load ${f}`,errors);

console.log(`AUDIT passages=${all.length} sunshine=${Object.keys(sun).length} new_horizon=${Object.keys(nh).length}`);
console.log(`COVERAGE sunshine=${EXPECTED_SUN.length}/${EXPECTED_SUN.length} new_horizon=${EXPECTED_NH.length}/${EXPECTED_NH.length}`);
if(errors.length){console.error(`AUDIT FAIL ${errors.length}`);for(const e of errors)console.error(`- ${e}`);process.exit(1);}
console.log('AUDIT PASS: exact section coverage, structural release gates, evidence links, IDs, counts, and stage loading are consistent.');