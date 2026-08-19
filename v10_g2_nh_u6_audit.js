const fs=require('fs');const vm=require('vm');
function filled(v){return typeof v==='string'&&v.trim().length>0}
function load(files,key){const c={window:{}};vm.createContext(c);for(const f of files){if(!fs.existsSync(f))throw new Error(`missing ${f}`);vm.runInContext(fs.readFileSync(f,'utf8'),c,{filename:f})}return c.window[key]||{}}
const data=load(['v10_data_newhorizon_g2_unit6.js','v10_data_newhorizon_g2_unit6_fix.js'],'V10_PASSAGES_G2_NH');
const meta=load(['v10_interaction_metadata_nh_g2_u6.js'],'V10_INTERACTION_META_G2_NH_U6');
const expected=['Unit 6-1','Unit 6-2','Unit 6-3','Unit 6-4'];const errors=[];let bq=0;
for(const k of expected)if(!data[k])errors.push(`missing passage ${k}`);for(const k of Object.keys(data))if(!expected.includes(k))errors.push(`unexpected passage ${k}`);
for(const [section,m] of Object.entries(data)){
 const tag=`NH2/${section}`;if(m.grade!=='2'||m.textbook!=='ニューホライズン'||m.section!==section)errors.push(`${tag}: identity mismatch`);for(const k of ['id','title','fullTranslation','auditNote'])if(!filled(m[k]))errors.push(`${tag}: ${k} empty`);if(!Array.isArray(m.sentences)||m.sentences.length<10)errors.push(`${tag}: fewer than 10 sentences`);if(!Array.isArray(m.slashRows)||m.slashRows.length!==m.sentences.length)errors.push(`${tag}: slash count mismatch`);if(Array.isArray(m.slashRows)&&m.slashRows.some(r=>!r||!filled(r.en)||!filled(r.jp)))errors.push(`${tag}: empty slash row`);
 if(!Array.isArray(m.questions)||m.questions.length<3)errors.push(`${tag}: A questions short`);else m.questions.forEach((q,i)=>{for(const x of ['prompt','answer','evidence','evidenceJp','reason'])if(!filled(q[x]))errors.push(`${tag}: AQ${i+1} ${x} empty`);for(const p of String(q.evidence||'').split(' / ').map(x=>x.trim()).filter(Boolean))if(!m.sentences.includes(p))errors.push(`${tag}: AQ${i+1} evidence not verbatim: ${p}`)});for(const x of ['vocabAudit','manualSlashAudit','manualMeaningAudit','manualQuestionAudit'])if(m[x]!==true)errors.push(`${tag}: ${x} false`);
 const md=meta[`ニューホライズン|2|${section}`];if(!md){errors.push(`${tag}: interaction metadata missing`);continue}if(!['diary','notice','email','report'].includes(md.genre))errors.push(`${tag}: genre invalid`);if(!Array.isArray(md.questionSetB)||md.questionSetB.length<3)errors.push(`${tag}: B questions short`);else md.questionSetB.forEach((q,i)=>{bq++;for(const x of ['prompt','answer','evidence','evidenceJp','reason'])if(!filled(q[x]))errors.push(`${tag}: BQ${i+1} ${x} empty`);for(const p of String(q.evidence||'').split(' / ').map(x=>x.trim()).filter(Boolean))if(!m.sentences.includes(p))errors.push(`${tag}: BQ${i+1} evidence not verbatim: ${p}`)});
}
if(Object.keys(meta).length!==expected.length)errors.push(`NH2 U6 interaction expected ${expected.length}, got ${Object.keys(meta).length}`);
function text(section){return ` ${(data[section].sentences||[]).join(' ').toLowerCase()} `}
const u7=['decide','natural','select','standard','species',' site ','region','selection','plant','heritage','hometown','conference','diversity','mixed','floral','fantastic','cultural','protect','material','cover','marble','jewel','because of','government','emperor',' face ','architecture','wife','in memory of','pollution','from far away','sunrise','crater','cloud','climb','campaign','a large amount of',' bath ','more and more','cleanup','recently','trail','forever','tourist'];
const future={
 'Unit 6-1':[' more ','skill','most ','curling','survey',' answer ','strategy','in conclusion','better',' find ','percent',' best ',' half ',' then ',' graph ','according to',' such as ','as for','feedback','spoke','delivery',' letter ',' data ',' work ','content','topic','contact','speaker','comment','slide','clear',...u7],
 'Unit 6-2':['in conclusion','better',' find ','percent',' best ',' half ',' then ',' graph ','according to',' such as ','as for','feedback','spoke','delivery',' letter ',' data ',' work ','content','topic','contact','speaker','comment','slide','clear',...u7],
 'Unit 6-3':['feedback','spoke','delivery',' letter ',' data ',' work ','content','topic','contact','speaker','comment','slide','clear',...u7],
 'Unit 6-4':u7
};
for(const [section,terms] of Object.entries(future)){const t=text(section);for(const term of terms)if(t.includes(term))errors.push(`NH2/${section}: future-vocab leak ${term.trim()}`)}
const forbidden=['used','courts','skills','surveys','answers','strategies','graphs','slides','comments','letters','topics','speakers','contacts','pictures'];
for(const [section,m] of Object.entries(data)){const t=(m.sentences||[]).join(' ').toLowerCase();for(const term of forbidden)if(new RegExp(`\\b${term}\\b`).test(t))errors.push(`NH2/${section}: unsupported form ${term}`)}
console.log(`G2 NH U6 AUDIT passages=${Object.keys(data).length}/${expected.length} alternate_questions=${bq}`);
console.log('G2 NH U6 CANONICAL v7=Part1 -> 6-1 / Part2 -> 6-2 / ReadThink1 -> 6-3 / ReadThink2 -> 6-4');
if(errors.length){console.error(`G2 NH U6 AUDIT FAIL ${errors.length}`);for(const e of errors)console.error(`- ${e}`);process.exit(1)}
console.log('G2 NH U6 AUDIT PASS: Unit 6 passages, slash rows, A/B questions, evidence links, release flags, morphology guard, chronological vocab gates, and Unit 7 future-vocab gate are consistent.');
