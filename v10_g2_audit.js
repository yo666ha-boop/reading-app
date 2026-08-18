const fs=require('fs');const vm=require('vm');
function filled(v){return typeof v==='string'&&v.trim().length>0}
function load(file,key){const c={window:{}};vm.createContext(c);vm.runInContext(fs.readFileSync(file,'utf8'),c,{filename:file});return c.window[key]||{}}
const data=load('v10_data_sunshine_g2_program1.js','V10_PASSAGES_G2_SS');
const meta=load('v10_interaction_metadata_sun_g2_p1.js','V10_INTERACTION_META_G2');
const expected=['PROGRAM 1-1','PROGRAM 1-2','PROGRAM 1-3'];const errors=[];let bq=0;
for(const k of expected)if(!data[k])errors.push(`missing passage ${k}`);
for(const k of Object.keys(data))if(!expected.includes(k))errors.push(`unexpected passage ${k}`);
for(const [section,m] of Object.entries(data)){
 const tag=`SS2/${section}`;
 if(m.grade!=='2'||m.textbook!=='サンシャイン'||m.section!==section)errors.push(`${tag}: identity mismatch`);
 for(const k of ['id','title','fullTranslation','auditNote'])if(!filled(m[k]))errors.push(`${tag}: ${k} empty`);
 if(!Array.isArray(m.sentences)||m.sentences.length<10)errors.push(`${tag}: fewer than 10 sentences`);
 if(!Array.isArray(m.slashRows)||m.slashRows.length!==m.sentences.length)errors.push(`${tag}: slash count mismatch`);
 if(Array.isArray(m.slashRows)&&m.slashRows.some(r=>!r||!filled(r.en)||!filled(r.jp)))errors.push(`${tag}: empty slash row`);
 if(!Array.isArray(m.questions)||m.questions.length<3)errors.push(`${tag}: A questions short`);
 if(Array.isArray(m.questions))m.questions.forEach((q,i)=>{for(const x of ['prompt','answer','evidence','evidenceJp','reason'])if(!filled(q[x]))errors.push(`${tag}: AQ${i+1} ${x} empty`);for(const p of String(q.evidence||'').split(' / ').map(x=>x.trim()).filter(Boolean))if(!m.sentences.includes(p))errors.push(`${tag}: AQ${i+1} evidence not verbatim: ${p}`)});
 for(const x of ['vocabAudit','manualSlashAudit','manualMeaningAudit','manualQuestionAudit'])if(m[x]!==true)errors.push(`${tag}: ${x} false`);
 const md=meta[`サンシャイン|2|${section}`];if(!md){errors.push(`${tag}: interaction metadata missing`);continue}if(!['diary','notice','email','report'].includes(md.genre))errors.push(`${tag}: genre invalid`);if(!Array.isArray(md.questionSetB)||md.questionSetB.length<3)errors.push(`${tag}: B questions short`);else md.questionSetB.forEach((q,i)=>{bq++;for(const x of ['prompt','answer','evidence','evidenceJp','reason'])if(!filled(q[x]))errors.push(`${tag}: BQ${i+1} ${x} empty`);for(const p of String(q.evidence||'').split(' / ').map(x=>x.trim()).filter(Boolean))if(!m.sentences.includes(p))errors.push(`${tag}: BQ${i+1} evidence not verbatim: ${p}`)});
}
if(Object.keys(meta).length!==3)errors.push(`G2 interaction expected 3, got ${Object.keys(meta).length}`);
console.log(`G2 AUDIT sunshine=${Object.keys(data).length}/3 alternate_questions=${bq}`);if(errors.length){console.error(`G2 AUDIT FAIL ${errors.length}`);for(const e of errors)console.error(`- ${e}`);process.exit(1)}console.log('G2 AUDIT PASS: Sunshine Program 1-1 through 1-3 passages, slash rows, A/B questions, evidence links, genres, and release flags are consistent.');
