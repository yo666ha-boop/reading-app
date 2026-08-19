const fs=require('fs');const vm=require('vm');
function filled(v){return typeof v==='string'&&v.trim().length>0}
function load(files,key){const c={window:{}};vm.createContext(c);for(const f of files){if(!fs.existsSync(f))throw new Error(`missing ${f}`);vm.runInContext(fs.readFileSync(f,'utf8'),c,{filename:f})}return c.window[key]||{}}
const data=load(['v10_data_newhorizon_g2_unit0_1.js','v10_data_newhorizon_g2_unit0_1_fix.js','v10_data_newhorizon_g2_unit0_1_fix2.js','v10_data_newhorizon_g2_unit2.js'],'V10_PASSAGES_G2_NH');
const meta=Object.assign({},load(['v10_interaction_metadata_nh_g2_u0_u1.js'],'V10_INTERACTION_META_G2_NH_U01'),load(['v10_interaction_metadata_nh_g2_u2.js'],'V10_INTERACTION_META_G2_NH_U2'));
const expected=['Unit 0','Unit 1-1','Unit 1-2','Unit 1-3','Unit 1-4','Unit 2-1','Unit 2-2','Unit 2-3','Unit 2-4'];
const errors=[];let bq=0;
for(const k of expected)if(!data[k])errors.push(`missing passage ${k}`);for(const k of Object.keys(data))if(!expected.includes(k))errors.push(`unexpected passage ${k}`);
for(const [section,m] of Object.entries(data)){
 const tag=`NH2/${section}`;if(m.grade!=='2'||m.textbook!=='ニューホライズン'||m.section!==section)errors.push(`${tag}: identity mismatch`);for(const k of ['id','title','fullTranslation','auditNote'])if(!filled(m[k]))errors.push(`${tag}: ${k} empty`);if(!Array.isArray(m.sentences)||m.sentences.length<10)errors.push(`${tag}: fewer than 10 sentences`);if(!Array.isArray(m.slashRows)||m.slashRows.length!==m.sentences.length)errors.push(`${tag}: slash count mismatch`);if(Array.isArray(m.slashRows)&&m.slashRows.some(r=>!r||!filled(r.en)||!filled(r.jp)))errors.push(`${tag}: empty slash row`);
 if(!Array.isArray(m.questions)||m.questions.length<3)errors.push(`${tag}: A questions short`);else m.questions.forEach((q,i)=>{for(const x of ['prompt','answer','evidence','evidenceJp','reason'])if(!filled(q[x]))errors.push(`${tag}: AQ${i+1} ${x} empty`);for(const p of String(q.evidence||'').split(' / ').map(x=>x.trim()).filter(Boolean))if(!m.sentences.includes(p))errors.push(`${tag}: AQ${i+1} evidence not verbatim: ${p}`)});for(const x of ['vocabAudit','manualSlashAudit','manualMeaningAudit','manualQuestionAudit'])if(m[x]!==true)errors.push(`${tag}: ${x} false`);
 const md=meta[`ニューホライズン|2|${section}`];if(!md){errors.push(`${tag}: interaction metadata missing`);continue}if(!['diary','notice','email','report'].includes(md.genre))errors.push(`${tag}: genre invalid`);if(!Array.isArray(md.questionSetB)||md.questionSetB.length<3)errors.push(`${tag}: B questions short`);else md.questionSetB.forEach((q,i)=>{bq++;for(const x of ['prompt','answer','evidence','evidenceJp','reason'])if(!filled(q[x]))errors.push(`${tag}: BQ${i+1} ${x} empty`);for(const p of String(q.evidence||'').split(' / ').map(x=>x.trim()).filter(Boolean))if(!m.sentences.includes(p))errors.push(`${tag}: BQ${i+1} evidence not verbatim: ${p}`)});
}
if(Object.keys(meta).length!==expected.length)errors.push(`NH2 interaction expected ${expected.length}, got ${Object.keys(meta).length}`);
function text(section){return (data[section].sentences||[]).join(' ').toLowerCase()}
const future={
 'Unit 0':['be going to','flight','airport','seafood','reservation','excited','language','communicate','chinese','dollar','weigh','culture','painting','surprised','india','mosque','soy sauce','topping','speech','butter','recommended','climate','variation','creativity'],
 'Unit 1-1':['seafood','reservation','excited','different','language','communicate','chinese','dollar','weigh','culture','painting','surprised','india','mosque','soy sauce','topping','speech','butter','recommended','climate','variation','creativity'],
 'Unit 1-2':['found','communicate','chinese','different','meter','dollar','weigh','culture','painting','surprised','india','mosque','soy sauce','topping','speech','butter','recommended','climate','variation','creativity'],
 'Unit 1-3':['culture','painting','surprised','india','mosque','soy sauce','topping','speech','butter','recommended','climate','variation','creativity'],
 'Unit 1-4':['soy sauce','topping','speech','butter','recommended','climate','variation','creativity'],
 'Unit 2-1':['speech','butter','sometime','would love to',' add ','because','recommended','be interested in','climate','variation','foreign','creativity','chef'],
 'Unit 2-2':['because','recommended','be interested in','climate','variation','foreign','creativity','chef'],
 'Unit 2-3':['climate','variation','foreign','creativity','chef','here is']
};
for(const [section,terms] of Object.entries(future)){const t=` ${text(section)} `;for(const term of terms)if(t.includes(term))errors.push(`NH2/${section}: future-vocab leak ${term.trim()}`)}
const forbidden=['visited','showed','learned','gave','tried','used','pictures','languages','tourists','victims','badges','materials','flavors','toppings','variations'];
for(const [section,m] of Object.entries(data)){const t=(m.sentences||[]).join(' ').toLowerCase();for(const term of forbidden)if(new RegExp(`\\b${term}\\b`).test(t))errors.push(`NH2/${section}: unsupported form ${term}`)}
console.log(`G2 NH AUDIT passages=${Object.keys(data).length}/${expected.length} alternate_questions=${bq}`);
console.log('G2 NH CANONICAL v7=Unit0 + Unit1-2 Part1/Part2/ReadThink1/ReadThink2; v9 labels=Unit0 + Unit1-1..2-4');
if(errors.length){console.error(`G2 NH AUDIT FAIL ${errors.length}`);for(const e of errors)console.error(`- ${e}`);process.exit(1)}
console.log('G2 NH AUDIT PASS: Unit 0 through Unit 2 passages, slash rows, A/B questions, evidence links, genres, release flags, morphology guard, and chronological vocab gates are consistent.');