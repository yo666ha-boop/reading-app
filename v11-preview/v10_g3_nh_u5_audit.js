const fs=require('fs');const vm=require('vm');
function filled(v){return typeof v==='string'&&v.trim().length>0}
function load(files,key){const c={window:{}};vm.createContext(c);for(const f of files){if(!fs.existsSync(f))throw new Error(`missing ${f}`);vm.runInContext(fs.readFileSync(f,'utf8'),c,{filename:f})}return c.window[key]||{}}
const data=load(['v10_data_newhorizon_g3_unit5.js','v10_data_newhorizon_g3_unit5_fix.js'],'V10_PASSAGES_G3_NH');
const meta=load(['v10_interaction_metadata_nh_g3_u5.js'],'V10_INTERACTION_META_G3_NH_U5');
const expected=['Unit 5-1','Unit 5-2','Unit 5-3','Unit 5-4'];const errors=[];let bq=0;
for(const k of expected)if(!data[k])errors.push(`missing passage ${k}`);for(const k of Object.keys(data))if(!expected.includes(k))errors.push(`unexpected passage ${k}`);
for(const [section,m] of Object.entries(data)){
 const tag=`NH3/${section}`;if(m.grade!=='3'||m.textbook!=='ニューホライズン'||m.section!==section)errors.push(`${tag}: identity mismatch`);for(const k of ['id','title','fullTranslation','auditNote'])if(!filled(m[k]))errors.push(`${tag}: ${k} empty`);if(!Array.isArray(m.sentences)||m.sentences.length<10)errors.push(`${tag}: fewer than 10 sentences`);if(!Array.isArray(m.slashRows)||m.slashRows.length!==m.sentences.length)errors.push(`${tag}: slash count mismatch`);if(Array.isArray(m.slashRows)&&m.slashRows.some(r=>!r||!filled(r.en)||!filled(r.jp)))errors.push(`${tag}: empty slash row`);
 if(!Array.isArray(m.questions)||m.questions.length<3)errors.push(`${tag}: A questions short`);else m.questions.forEach((q,i)=>{for(const x of ['prompt','answer','evidence','evidenceJp','reason'])if(!filled(q[x]))errors.push(`${tag}: AQ${i+1} ${x} empty`);for(const p of String(q.evidence||'').split(' / ').map(x=>x.trim()).filter(Boolean))if(!m.sentences.includes(p))errors.push(`${tag}: AQ${i+1} evidence not verbatim: ${p}`)});for(const x of ['vocabAudit','manualSlashAudit','manualMeaningAudit','manualQuestionAudit'])if(m[x]!==true)errors.push(`${tag}: ${x} false`);
 const md=meta[`ニューホライズン|3|${section}`];if(!md){errors.push(`${tag}: interaction metadata missing`);continue}if(!['diary','notice','email','report'].includes(md.genre))errors.push(`${tag}: genre invalid`);if(!Array.isArray(md.questionSetB)||md.questionSetB.length<3)errors.push(`${tag}: B questions short`);else md.questionSetB.forEach((q,i)=>{bq++;for(const x of ['prompt','answer','evidence','evidenceJp','reason'])if(!filled(q[x]))errors.push(`${tag}: BQ${i+1} ${x} empty`);for(const p of String(q.evidence||'').split(' / ').map(x=>x.trim()).filter(Boolean))if(!m.sentences.includes(p))errors.push(`${tag}: BQ${i+1} evidence not verbatim: ${p}`)});
}
if(Object.keys(meta).length!==expected.length)errors.push(`NH3 U5 interaction expected ${expected.length}, got ${Object.keys(meta).length}`);
function text(section){return ` ${(data[section].sentences||[]).join(' ').toLowerCase()} `}
const p2=[' fight ',' fast ','go on',' tough ',' protest ',' violence ','human rights',' independence '];
const rt1=[' stood ',' rule ',' law ','at that time',' lawyer ','go out',' jail ','even if',' discrimination ',' effective ',' arrest ',' freely ',' accept '];
const rt2=[' produce ',' put ',' expensive ',' tax ','way to',' legacy ','thousands of',' kilometer ','in those days',' colony ',' peaceful '];
const u6=[' wish ',' supply ',' felt ',' backpack ',' abroad ',' unused ',' overseas ',' donate ','this way','so far',' connect ',' afghanistan ',' service ',' definitely ','the globe',' imagine ',' border ',' son ',' daughter ',' illiterate ','most of','be ready for','in the open air','encourage ',' sold ',' exception ','in fact',' coat ','depend on',' third ',' surround ',' interdependent ',' import ',' daily ',' trade ',' quite ',' survival ',' beyond ',' relationship '];
const future={
 'Unit 5-1':[...p2,...rt1,...rt2,...u6],
 'Unit 5-2':[...rt1,...rt2,...u6],
 'Unit 5-3':[...rt2,...u6],
 'Unit 5-4':u6
};
for(const [section,terms] of Object.entries(future)){const t=text(section);for(const term of terms)if(t.includes(term))errors.push(`NH3/${section}: future-vocab leak ${term.trim()}`)}
const forbidden=['leaders','notes','persons','images','prints','fights','fasts','protests','laws','lawyers','movements','jails','arrests','colonies','taxes','kilometers','legacies','asks','makes','stands','accepts','spreads','produces','puts'];
for(const [section,m] of Object.entries(data)){const t=(m.sentences||[]).join(' ').toLowerCase();for(const term of forbidden)if(new RegExp(`\\b${term}\\b`).test(t))errors.push(`NH3/${section}: unsupported form ${term}`)}
console.log(`G3 NH U5 AUDIT passages=${Object.keys(data).length}/${expected.length} alternate_questions=${bq}`);
console.log('G3 NH U5 CANONICAL v7=Part1 -> 5-1 / Part2 -> 5-2 / ReadThink1 -> 5-3 / ReadThink2 -> 5-4; Unit6 vocabulary gated');
if(errors.length){console.error(`G3 NH U5 AUDIT FAIL ${errors.length}`);for(const e of errors)console.error(`- ${e}`);process.exit(1)}
console.log('G3 NH U5 AUDIT PASS: Unit 5 passages, slash rows, A/B questions, evidence links, release flags, morphology guard, chronological vocabulary gates, and Unit6 future-vocab gate are consistent.');
