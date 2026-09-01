const fs=require('fs');
function read(p){return JSON.parse(fs.readFileSync(p,'utf8'))}
function fail(m){throw new Error(m)}
function norm(s){return String(s||'').normalize('NFKC').replace(/[『』]/g,c=>c==='『'?'「':'」').replace(/\s+/g,' ').trim()}
const scaffold=read('v11_batch12_slash_question_scaffold.json');
const r4=read('v11_batch12_human_review_layer_r4.json');
const syncR7=require('./v11_batch12_question_human_review_r7_semantic_sync.js');
const syncR8=require('./v11_batch12_question_human_review_r8_semantic_sync.js');
const syncR11=require('./v11_batch12_question_human_review_r11_semantic_sync.js');
const syncR12=require('./v11_batch12_question_human_review_r12_semantic_sync.js');
const syncR13=require('./v11_batch12_question_human_review_r13_semantic_sync.js');
const stages=[['R5','v11_batch12_question_human_review_r5_g1_002_005.json'],['R6','v11_batch12_question_human_review_r6_g1_006_010.json'],['R7','v11_batch12_question_human_review_r7_g1_011_017.json'],['R8','v11_batch12_question_human_review_r8_g2_001_007.json'],['R9','v11_batch12_question_human_review_r9_g2_008_013.json'],['R10','v11_batch12_question_human_review_r10_g2_014_017.json'],['R11','v11_batch12_question_human_review_r11_g3_001_004.json'],['R12','v11_batch12_question_human_review_r12_g3_005_008.json'],['R13','v11_batch12_question_human_review_r13_g3_009_012.json'],['R14','v11_batch12_question_human_review_r14_g3_013_016.json']];
if(scaffold.registered!==false||scaffold.officialTotal!==718)fail('scaffold registration state');if(!Array.isArray(scaffold.passages)||scaffold.passages.length!==50)fail('scaffold passage count');
const src=new Map(scaffold.passages.map(p=>[p.id,p]));const map=new Map(),overlaps=[];
function add(stage,ps){for(const p of ps){if(map.has(p.id))overlaps.push({id:p.id,old:map.get(p.id).stage,new:stage});map.set(p.id,{stage,p});}}
function syncStage(stage,x){if(stage==='R7')return syncR7(x);if(stage==='R8')return syncR8(x);if(stage==='R11')return syncR11(x);if(stage==='R12')return syncR12(x);if(stage==='R13')return syncR13(x);return x;}
const r4Passages=Object.entries(r4.questionRewrites||{}).map(([id,v])=>({id,questions:v.A,questionSetB:v.B}));add('R4',r4Passages);for(const [stage,path] of stages){let x=read(path);if(x.registered!==false||x.officialTotal!==718)fail(stage+' state');x=syncStage(stage,x);add(stage,x.passages||[])}
if(overlaps.length!==1||overlaps[0].id!=='V11-B12-G1-014'||overlaps[0].old!=='R4'||overlaps[0].new!=='R7')fail('unexpected review overlap '+JSON.stringify(overlaps));
const expected=[];for(let g=1;g<=3;g++){const n=g===3?16:17;for(let i=1;i<=n;i++)expected.push(`V11-B12-G${g}-${String(i).padStart(3,'0')}`)}if(JSON.stringify([...map.keys()].sort())!==JSON.stringify([...expected].sort()))fail('unique reviewed ID coverage mismatch');
const generic=[/第\s*\d+\s*(文|段階)/,/本文の内容を表す空所/,/根拠となる文を選/,/本文から抜き出/];const prompts=new Map();let qn=0;const typeCounts={};
for(const id of expected){const rec=map.get(id),base=src.get(id);if(!rec||!base)fail(id+' missing');const A=rec.p.questions,B=rec.p.questionSetB;if(!Array.isArray(A)||!Array.isArray(B)||A.length!==5||B.length!==5)fail(id+' A/B count');for(const q of [...A,...B]){qn++;if(!q.questionType||!q.prompt||!q.answer||!q.evidence||!q.evidenceJp||!q.reason)fail(id+' required field');if(!String(q.humanReview||'').startsWith('HUMAN_REVIEW'))fail(id+' human marker');if(generic.some(r=>r.test(q.prompt)))fail(id+' generic prompt '+q.prompt);if(!norm(base.body).includes(norm(q.evidence)))fail(id+' evidence not in body: '+q.evidence);if(!norm(base.fullTranslation).includes(norm(q.evidenceJp)))fail(id+' evidenceJp not in translation: '+q.evidenceJp);const pk=norm(q.prompt);if(prompts.has(pk)&&prompts.get(pk)!==id)fail('cross-passage duplicate prompt '+id+' / '+prompts.get(pk));prompts.set(pk,id);typeCounts[q.questionType]=(typeCounts[q.questionType]||0)+1;}}
if(map.size!==50||qn!==500)fail(`coverage count ${map.size}/${qn}`);const distinctTypes=Object.keys(typeCounts).length;if(distinctTypes<7)fail('question type diversity '+distinctTypes);
console.log(JSON.stringify({batch:'V11-B12',registered:false,officialTotal:718,uniqueHumanReviewedPassages:50,uniqueHumanReviewedQuestions:500,pendingPassages:0,pendingQuestions:0,explicitSupersession:'V11-B12-G1-014 R7 supersedes R4',unexpectedOverlapCount:0,distinctQuestionTypes:distinctTypes,typeCounts,semanticSyncLayers:['R7','R8','R11','R12','R13'],finalQuestionHumanGate:true,finalRegistrationReady:false},null,2));
