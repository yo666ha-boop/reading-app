const fs=require('fs');const vm=require('vm');
function filled(v){return typeof v==='string'&&v.trim().length>0}
function load(files,key){const c={window:{},document:{readyState:'loading',addEventListener(){}}};vm.createContext(c);for(const f of files){if(!fs.existsSync(f))throw new Error(`missing ${f}`);vm.runInContext(fs.readFileSync(f,'utf8'),c,{filename:f})}return c.window[key]||{}}
const data=load(['v10_data_newhorizon_g3_unit6.js','v10_data_newhorizon_g3_unit6_fix.js','v10_data_newhorizon_g3_unit6_fix2.js'],'V10_PASSAGES_G3_NH');
const meta=load(['v10_interaction_metadata_nh_g3_u6.js','v10_interaction_metadata_nh_g3_u6_fix.js'],'V10_INTERACTION_META_G3_NH_U6');
const expected=['Unit 6-1','Unit 6-2','Unit 6-3','Unit 6-4'];const errors=[];let bq=0;
for(const k of expected)if(!data[k])errors.push(`missing passage ${k}`);for(const k of Object.keys(data))if(!expected.includes(k))errors.push(`unexpected passage ${k}`);
for(const [section,m] of Object.entries(data)){
 const tag=`NH3/${section}`;if(m.grade!=='3'||m.textbook!=='ニューホライズン'||m.section!==section)errors.push(`${tag}: identity mismatch`);for(const k of ['id','title','fullTranslation','auditNote'])if(!filled(m[k]))errors.push(`${tag}: ${k} empty`);if(!Array.isArray(m.sentences)||m.sentences.length<10)errors.push(`${tag}: fewer than 10 sentences`);if(!Array.isArray(m.slashRows)||m.slashRows.length!==m.sentences.length)errors.push(`${tag}: slash count mismatch`);if(Array.isArray(m.slashRows)&&m.slashRows.some(r=>!r||!filled(r.en)||!filled(r.jp)))errors.push(`${tag}: empty slash row`);
 if(!Array.isArray(m.questions)||m.questions.length<3)errors.push(`${tag}: A questions short`);else m.questions.forEach((q,i)=>{for(const x of ['prompt','answer','evidence','evidenceJp','reason'])if(!filled(q[x]))errors.push(`${tag}: AQ${i+1} ${x} empty`);for(const p of String(q.evidence||'').split(' / ').map(x=>x.trim()).filter(Boolean))if(!m.sentences.includes(p))errors.push(`${tag}: AQ${i+1} evidence not verbatim: ${p}`)});for(const x of ['vocabAudit','manualSlashAudit','manualMeaningAudit','manualQuestionAudit'])if(m[x]!==true)errors.push(`${tag}: ${x} false`);
 const md=meta[`ニューホライズン|3|${section}`];if(!md){errors.push(`${tag}: interaction metadata missing`);continue}if(!['diary','notice','email','report'].includes(md.genre))errors.push(`${tag}: genre invalid`);if(!Array.isArray(md.questionSetB)||md.questionSetB.length<3)errors.push(`${tag}: B questions short`);else md.questionSetB.forEach((q,i)=>{bq++;for(const x of ['prompt','answer','evidence','evidenceJp','reason'])if(!filled(q[x]))errors.push(`${tag}: BQ${i+1} ${x} empty`);for(const p of String(q.evidence||'').split(' / ').map(x=>x.trim()).filter(Boolean))if(!m.sentences.includes(p))errors.push(`${tag}: BQ${i+1} evidence not verbatim: ${p}`)});
}
if(Object.keys(meta).length!==expected.length)errors.push(`NH3 U6 interaction expected ${expected.length}, got ${Object.keys(meta).length}`);
function text(section){return ` ${(data[section].sentences||[]).join(' ').toLowerCase()} `}
const p2=[' overseas ',' donate ','this way','so far',' connect ',' afghanistan '];
const rt1=[' service ',' definitely ',' globe ',' imagine ',' border ',' son ',' air ',' daughter ',' illiterate ','most of','through ','be ready for'];
const rt2=['in the open air','encourage ',' sold ',' exception ','in fact',' coat ','depend on',' third ',' surround ',' interdependent ',' import ',' daily ',' trade ',' quite ',' survival ',' beyond ',' relationship '];
const supplements=[' storm ',' depart ',' railway ','be bound for',' owe ',' pleasure ',' departure ','be due to','what is worse',' stuck ','all right',' blow ','be over','at last','no kidding',' technology ','how come',' revolution ',' eventually ',' enormous ',' underground ',' collection ',' energy ',' release ',' electricity ',' progress ',' dam ',' invent ',' consumer ',' handle ',' coal ',' damage ',' chart ',' battery ',' control ',' sustainable ',' charge ',' renewable ',' wave ',' dangerous ',' sunshine ',' cheap ',' steam ',' relatively ',' furthermore ',' rainwater ','wind power',' radiation ','water power',' quarter ','nuclear power','nuclear waste','natural gas','run out of',' liter ',' lamp ',' inventor '];
const future={
 'Unit 6-1':[...p2,...rt1,...rt2,...supplements],
 'Unit 6-2':[...rt1,...rt2,...supplements],
 'Unit 6-3':[...rt2,...supplements],
 'Unit 6-4':supplements
};
for(const [section,terms] of Object.entries(future)){const t=text(section);for(const term of terms)if(t.includes(term))errors.push(`NH3/${section}: future-vocab leak ${term.trim()}`)}
const forbidden=['wishes','supplies','backpacks','runs','donates','connects','services','globes','imagines','borders','sons','daughters','imports','surrounds','trades','relationships','coats','shops','countries','places','learns','projects','families','students'];
for(const [section,m] of Object.entries(data)){const t=(m.sentences||[]).join(' ').toLowerCase();for(const term of forbidden)if(new RegExp(`\\b${term}\\b`).test(t))errors.push(`NH3/${section}: unsupported form ${term}`)}
console.log(`G3 NH U6 AUDIT passages=${Object.keys(data).length}/${expected.length} alternate_questions=${bq}`);
console.log('G3 NH U6 CANONICAL v7=Part1,2 shared pool split first-half -> 6-1 and second-half -> 6-2 / ReadThink1 -> 6-3 / ReadThink2 -> 6-4; post-core supplements gated');
if(errors.length){console.error(`G3 NH U6 AUDIT FAIL ${errors.length}`);for(const e of errors)console.error(`- ${e}`);process.exit(1)}
console.log('G3 NH U6 AUDIT PASS: Unit 6 passages, slash rows, A/B questions, evidence links, release flags, morphology guard, shared-pool chronology, and post-core supplement vocabulary gate are consistent.');
