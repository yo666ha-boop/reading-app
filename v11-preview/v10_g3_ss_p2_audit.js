const fs=require('fs');const vm=require('vm');
function filled(v){return typeof v==='string'&&v.trim().length>0}
function load(files,key){const c={window:{}};vm.createContext(c);for(const f of files){if(!fs.existsSync(f))throw new Error(`missing ${f}`);vm.runInContext(fs.readFileSync(f,'utf8'),c,{filename:f})}return c.window[key]||{}}
const data=load(['v10_data_sunshine_g3_program2.js','v10_data_sunshine_g3_program2_fix.js'],'V10_PASSAGES_G3_SS');
const meta=load(['v10_interaction_metadata_sun_g3_p2.js'],'V10_INTERACTION_META_G3_SS_P2');
const expected=['PROGRAM 2-1','PROGRAM 2-2','PROGRAM 2-3'];const errors=[];let bq=0;
for(const k of expected)if(!data[k])errors.push(`missing passage ${k}`);for(const k of Object.keys(data))if(!expected.includes(k))errors.push(`unexpected passage ${k}`);
for(const [section,m] of Object.entries(data)){
 const tag=`SS3/${section}`;if(m.grade!=='3'||m.textbook!=='サンシャイン'||m.section!==section)errors.push(`${tag}: identity mismatch`);for(const k of ['id','title','fullTranslation','auditNote'])if(!filled(m[k]))errors.push(`${tag}: ${k} empty`);if(!Array.isArray(m.sentences)||m.sentences.length<10)errors.push(`${tag}: fewer than 10 sentences`);if(!Array.isArray(m.slashRows)||m.slashRows.length!==m.sentences.length)errors.push(`${tag}: slash count mismatch`);if(Array.isArray(m.slashRows)&&m.slashRows.some(r=>!r||!filled(r.en)||!filled(r.jp)))errors.push(`${tag}: empty slash row`);
 if(!Array.isArray(m.questions)||m.questions.length<3)errors.push(`${tag}: A questions short`);else m.questions.forEach((q,i)=>{for(const x of ['prompt','answer','evidence','evidenceJp','reason'])if(!filled(q[x]))errors.push(`${tag}: AQ${i+1} ${x} empty`);for(const p of String(q.evidence||'').split(' / ').map(x=>x.trim()).filter(Boolean))if(!m.sentences.includes(p))errors.push(`${tag}: AQ${i+1} evidence not verbatim: ${p}`)});for(const x of ['vocabAudit','manualSlashAudit','manualMeaningAudit','manualQuestionAudit'])if(m[x]!==true)errors.push(`${tag}: ${x} false`);
 const md=meta[`サンシャイン|3|${section}`];if(!md){errors.push(`${tag}: interaction metadata missing`);continue}if(!['diary','notice','email','report'].includes(md.genre))errors.push(`${tag}: genre invalid`);if(!Array.isArray(md.questionSetB)||md.questionSetB.length<3)errors.push(`${tag}: B questions short`);else md.questionSetB.forEach((q,i)=>{bq++;for(const x of ['prompt','answer','evidence','evidenceJp','reason'])if(!filled(q[x]))errors.push(`${tag}: BQ${i+1} ${x} empty`);for(const p of String(q.evidence||'').split(' / ').map(x=>x.trim()).filter(Boolean))if(!m.sentences.includes(p))errors.push(`${tag}: BQ${i+1} evidence not verbatim: ${p}`)});
}
function text(section){return ` ${(data[section].sentences||[]).join(' ').toLowerCase()} `}
const p22=['right now',' since ','be based on',' habit ','concentrate on','be full of','keep a diary'];
const p23=[' hair ',' position ','as a result',' title ',' introduce ',' rope ',' dry ',' bright ',' tour ',' thus ',' tournament '];
const p3=[' whose ',' born ',' kangaroo ',' octopus ',' dove ','draw a picture of',' attracted ','take part in',' incredible ',' boring ',' progress ',' sportswear ',' beyond ',' huge ',' sunburn ',' runner ',' typical ','take care of oneself',' trainer ',' athlete ',' weather ',' development ',' breathing ',' training ',' failure ',' diet ',' carefully ',' importance ',' nutritional '];
const future={'PROGRAM 2-1':[...p22,...p23,...p3],'PROGRAM 2-2':[...p23,...p3],'PROGRAM 2-3':p3};
for(const [section,terms] of Object.entries(future)){const t=text(section);for(const term of terms)if(t.includes(term))errors.push(`SS3/${section}: future-vocab leak ${term.trim()}`)}
const forbidden=['starts','helps','concentrates','affects','recommends','introduces','positionses','tournaments','tourses','ropes','hairs'];
for(const [section,m] of Object.entries(data)){const t=(m.sentences||[]).join(' ').toLowerCase();for(const term of forbidden)if(new RegExp(`\\b${term}\\b`).test(t))errors.push(`SS3/${section}: unsupported form ${term}`)}
console.log(`G3 SS P2 AUDIT passages=${Object.keys(data).length}/${expected.length} alternate_questions=${bq}`);
console.log('G3 SS P2 CANONICAL v7=PROGRAM2 2-1 / 2-2 / 2-3 exact source partitions; PROGRAM3 vocabulary gated');
if(errors.length){console.error(`G3 SS P2 AUDIT FAIL ${errors.length}`);for(const e of errors)console.error(`- ${e}`);process.exit(1)}
console.log('G3 SS P2 AUDIT PASS: Program 2 passages, slash rows, A/B questions, evidence links, release flags, morphology guard, chronological partitions, and Program 3 future-vocab gate are consistent.');
