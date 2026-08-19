const fs=require('fs');const vm=require('vm');
function filled(v){return typeof v==='string'&&v.trim().length>0}
function load(files,key){const c={window:{}};vm.createContext(c);for(const f of files){if(!fs.existsSync(f))throw new Error(`missing ${f}`);vm.runInContext(fs.readFileSync(f,'utf8'),c,{filename:f})}return c.window[key]||{}}
const data=load(['v10_data_newhorizon_g3_unit0_1.js','v10_data_newhorizon_g3_unit0_1_fix.js','v10_data_newhorizon_g3_unit0_1_fix2.js'],'V10_PASSAGES_G3_NH');
const meta=load(['v10_interaction_metadata_nh_g3_u0_u1.js'],'V10_INTERACTION_META_G3_NH_U01');
const expected=['Unit 0','Unit 1-1','Unit 1-2','Unit 1-3','Unit 1-4'];const errors=[];let bq=0;
for(const k of expected)if(!data[k])errors.push(`missing passage ${k}`);for(const k of Object.keys(data))if(!expected.includes(k))errors.push(`unexpected passage ${k}`);
for(const [section,m] of Object.entries(data)){
 const tag=`NH3/${section}`;if(m.grade!=='3'||m.textbook!=='ニューホライズン'||m.section!==section)errors.push(`${tag}: identity mismatch`);for(const k of ['id','title','fullTranslation','auditNote'])if(!filled(m[k]))errors.push(`${tag}: ${k} empty`);if(!Array.isArray(m.sentences)||m.sentences.length<10)errors.push(`${tag}: fewer than 10 sentences`);if(!Array.isArray(m.slashRows)||m.slashRows.length!==m.sentences.length)errors.push(`${tag}: slash count mismatch`);if(Array.isArray(m.slashRows)&&m.slashRows.some(r=>!r||!filled(r.en)||!filled(r.jp)))errors.push(`${tag}: empty slash row`);
 if(!Array.isArray(m.questions)||m.questions.length<3)errors.push(`${tag}: A questions short`);else m.questions.forEach((q,i)=>{for(const x of ['prompt','answer','evidence','evidenceJp','reason'])if(!filled(q[x]))errors.push(`${tag}: AQ${i+1} ${x} empty`);for(const p of String(q.evidence||'').split(' / ').map(x=>x.trim()).filter(Boolean))if(!m.sentences.includes(p))errors.push(`${tag}: AQ${i+1} evidence not verbatim: ${p}`)});for(const x of ['vocabAudit','manualSlashAudit','manualMeaningAudit','manualQuestionAudit'])if(m[x]!==true)errors.push(`${tag}: ${x} false`);
 const md=meta[`ニューホライズン|3|${section}`];if(!md){errors.push(`${tag}: interaction metadata missing`);continue}if(!['diary','notice','email','report'].includes(md.genre))errors.push(`${tag}: genre invalid`);if(!Array.isArray(md.questionSetB)||md.questionSetB.length<3)errors.push(`${tag}: B questions short`);else md.questionSetB.forEach((q,i)=>{bq++;for(const x of ['prompt','answer','evidence','evidenceJp','reason'])if(!filled(q[x]))errors.push(`${tag}: BQ${i+1} ${x} empty`);for(const p of String(q.evidence||'').split(' / ').map(x=>x.trim()).filter(Boolean))if(!m.sentences.includes(p))errors.push(`${tag}: BQ${i+1} evidence not verbatim: ${p}`)});
}
if(Object.keys(meta).length!==expected.length)errors.push(`NH3 U0-U1 interaction expected ${expected.length}, got ${Object.keys(meta).length}`);
function text(section){return ` ${(data[section].sentences||[]).join(' ').toLowerCase()} `}
const u1part2=[' fashion ',' haven’t ',' regional ',' hear ',' ever ',' foreigner '];
const u1rt1=['make ',' animation ',' match ',' adventure ','in addition',' adult ',' positive ',' quality ',' global ',' genre ',' delicate ',' drawing '];
const u1rt2=[' taste ',' scroll ','it is said that',' roots ',' link ',' movement ',' influence ',' existence ',' ignore ',' entirely ',' express ',' advantage ',' technique ','take advantage of'];
const u2=[' already ',' interview ',' just ',' message ',' essay ',' yet ',' designer ',' sleep ',' ethical ','for ',' introduce ',' since ',' recycle ','how long',' design ',' impact ',' accessory ',' call ',' company ',' less ',' avoid ',' you’ve ',' lead ',' moreover ',' include ',' prohibit ',' wool ',' worker ',' wage ',' leather ',' labor ',' fur ',' condition ',' clothing ',' responsible ',' chemical ',' low ',' negative ',' fair ','eco-friendly',' morally ','animal-free',' shop ',' vegan ','the planet',' hour ','vegan leather',' developing '];
const future={
 'Unit 0':[' been '," i've ",' never ',' once ','have been to',' twice ',...u1part2,...u1rt1,...u1rt2,...u2],
 'Unit 1-1':[...u1part2,...u1rt1,...u1rt2,...u2],
 'Unit 1-2':[...u1rt1,...u1rt2,...u2],
 'Unit 1-3':[...u1rt2,...u2],
 'Unit 1-4':u2
};
for(const [section,terms] of Object.entries(future)){const t=text(section);for(const term of terms)if(t.includes(term))errors.push(`NH3/${section}: future-vocab leak ${term.trim()}`)}
const forbidden=['likes','wants','shows','visits','says','uses','helps','places','buildings','children','adults','stories','drawings','animations','genres','techniques','advantages','scrolls','foreigners','fashions','visitors','classmates','interests','popularity','style','modern'];
for(const [section,m] of Object.entries(data)){const t=(m.sentences||[]).join(' ').toLowerCase();for(const term of forbidden)if(new RegExp(`\\b${term}\\b`).test(t))errors.push(`NH3/${section}: unsupported form ${term}`)}
console.log(`G3 NH U0-U1 AUDIT passages=${Object.keys(data).length}/${expected.length} alternate_questions=${bq}`);
console.log('G3 NH CANONICAL v7=Unit0 + Unit1 Part1,2 shared pool split into 1-1/1-2 + ReadThink1 -> 1-3 + ReadThink2 -> 1-4; Unit2 vocabulary gated');
if(errors.length){console.error(`G3 NH U0-U1 AUDIT FAIL ${errors.length}`);for(const e of errors)console.error(`- ${e}`);process.exit(1)}
console.log('G3 NH U0-U1 AUDIT PASS: Unit 0 through Unit 1 passages, slash rows, A/B questions, evidence links, release flags, morphology guard, unsupported-lexeme guard, and chronological Unit2 vocabulary gate are consistent.');
