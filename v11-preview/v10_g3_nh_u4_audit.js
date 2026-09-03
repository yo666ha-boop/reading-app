const fs=require('fs');const vm=require('vm');
function filled(v){return typeof v==='string'&&v.trim().length>0}
function load(files,key){const c={window:{}};vm.createContext(c);for(const f of files){if(!fs.existsSync(f))throw new Error(`missing ${f}`);vm.runInContext(fs.readFileSync(f,'utf8'),c,{filename:f})}return c.window[key]||{}}
const data=load(['v10_data_newhorizon_g3_unit4.js','v10_data_newhorizon_g3_unit4_fix.js'],'V10_PASSAGES_G3_NH');
const meta=load(['v10_interaction_metadata_nh_g3_u4.js'],'V10_INTERACTION_META_G3_NH_U4');
const expected=['Unit 4-1','Unit 4-2','Unit 4-3','Unit 4-4'];const errors=[];let bq=0;
for(const k of expected)if(!data[k])errors.push(`missing passage ${k}`);for(const k of Object.keys(data))if(!expected.includes(k))errors.push(`unexpected passage ${k}`);
for(const [section,m] of Object.entries(data)){
 const tag=`NH3/${section}`;if(m.grade!=='3'||m.textbook!=='ニューホライズン'||m.section!==section)errors.push(`${tag}: identity mismatch`);for(const k of ['id','title','fullTranslation','auditNote'])if(!filled(m[k]))errors.push(`${tag}: ${k} empty`);if(!Array.isArray(m.sentences)||m.sentences.length<10)errors.push(`${tag}: fewer than 10 sentences`);if(!Array.isArray(m.slashRows)||m.slashRows.length!==m.sentences.length)errors.push(`${tag}: slash count mismatch`);if(Array.isArray(m.slashRows)&&m.slashRows.some(r=>!r||!filled(r.en)||!filled(r.jp)))errors.push(`${tag}: empty slash row`);
 if(!Array.isArray(m.questions)||m.questions.length<3)errors.push(`${tag}: A questions short`);else m.questions.forEach((q,i)=>{for(const x of ['prompt','answer','evidence','evidenceJp','reason'])if(!filled(q[x]))errors.push(`${tag}: AQ${i+1} ${x} empty`);for(const p of String(q.evidence||'').split(' / ').map(x=>x.trim()).filter(Boolean))if(!m.sentences.includes(p))errors.push(`${tag}: AQ${i+1} evidence not verbatim: ${p}`)});for(const x of ['vocabAudit','manualSlashAudit','manualMeaningAudit','manualQuestionAudit'])if(m[x]!==true)errors.push(`${tag}: ${x} false`);
 const md=meta[`ニューホライズン|3|${section}`];if(!md){errors.push(`${tag}: interaction metadata missing`);continue}if(!['diary','notice','email','report'].includes(md.genre))errors.push(`${tag}: genre invalid`);if(!Array.isArray(md.questionSetB)||md.questionSetB.length<3)errors.push(`${tag}: B questions short`);else md.questionSetB.forEach((q,i)=>{bq++;for(const x of ['prompt','answer','evidence','evidenceJp','reason'])if(!filled(q[x]))errors.push(`${tag}: BQ${i+1} ${x} empty`);for(const p of String(q.evidence||'').split(' / ').map(x=>x.trim()).filter(Boolean))if(!m.sentences.includes(p))errors.push(`${tag}: BQ${i+1} evidence not verbatim: ${p}`)});
}
if(Object.keys(meta).length!==expected.length)errors.push(`NH3 U4 interaction expected ${expected.length}, got ${Object.keys(meta).length}`);
function text(section){return ` ${(data[section].sentences||[]).join(' ').toLowerCase()} `}
const p2=[' prepare ',' emergency ',' done ',' earthquake ',' recommend ',' hard ',' link '," we've ",' kit '," hasn't "];
const rt1=[' bridge ',' comfort ','between ',' several ','all the time',' safe ',' energetic ',' hit ','be killed in',' encourage '];
const rt2=[' support ',' exchange ',' rode ',' crisis ',' bicycle ',' caught ',' sudden ',' news ',' ordinary ','be caught in',' shortly ',' work ','bring ',' program ','no longer'];
const u5=['be born','non-violence',' national ',' leader ','on the internet',' image ',' print ',' greatly ',' fight ','go on',' tough ',' protest ',' violence ','human rights',' independence ',' stood ',' law ','at that time',' lawyer ',' jail ',' discrimination ',' effective ',' arrest ',' freely ',' accept ',' produce ',' expensive ',' tax ',' legacy ','thousands of',' kilometer ','in those days',' colony ',' peaceful '];
const future={
 'Unit 4-1':[...p2,...rt1,...rt2,...u5],
 'Unit 4-2':[...rt1,...rt2,...u5],
 'Unit 4-3':[...rt2,...u5],
 'Unit 4-4':u5
};
for(const [section,terms] of Object.entries(future)){const t=text(section);for(const term of terms)if(t.includes(term))errors.push(`NH3/${section}: future-vocab leak ${term.trim()}`)}
const forbidden=['stores','fires','circles','extinguishers','shelters','prepares','recommends','earthquakes','bridges','encourages','comforts','supports','exchanges','rides','catches','programs','started','encouragement','disasters'];
for(const [section,m] of Object.entries(data)){const t=(m.sentences||[]).join(' ').toLowerCase();for(const term of forbidden)if(new RegExp(`\\b${term}\\b`).test(t))errors.push(`NH3/${section}: unsupported form ${term}`)}
console.log(`G3 NH U4 AUDIT passages=${Object.keys(data).length}/${expected.length} alternate_questions=${bq}`);
console.log('G3 NH U4 CANONICAL v7=Part1 -> 4-1 / Part2 -> 4-2 / ReadThink1 -> 4-3 / ReadThink2 -> 4-4; Unit5 vocabulary gated');
if(errors.length){console.error(`G3 NH U4 AUDIT FAIL ${errors.length}`);for(const e of errors)console.error(`- ${e}`);process.exit(1)}
console.log('G3 NH U4 AUDIT PASS: Unit 4 passages, slash rows, A/B questions, evidence links, release flags, morphology guard, chronological vocabulary gates, and Unit5 future-vocab gate are consistent.');
