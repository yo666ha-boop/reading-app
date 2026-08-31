const fs=require('fs');
function read(p){return JSON.parse(fs.readFileSync(p,'utf8'))}
const r4=read('v11_batch12_human_review_layer_r4.json');
const r5=read('v11_batch12_question_human_review_r5_g1_002_005.json');
const r6=read('v11_batch12_question_human_review_r6_g1_006_010.json');
const r7=read('v11_batch12_question_human_review_r7_g1_011_017.json');
const r8=read('v11_batch12_question_human_review_r8_g2_001_007.json');
const r9=read('v11_batch12_question_human_review_r9_g2_008_013.json');
function fail(m){throw new Error(m)}
const map=new Map(); const overlaps=[];
function add(stage,ps){for(const p of ps){if(map.has(p.id))overlaps.push({id:p.id,old:map.get(p.id).stage,new:stage});map.set(p.id,{stage,p});}}
add('R4',r4.questionHumanRewrites||[]);add('R5',r5.passages);add('R6',r6.passages);add('R7',r7.passages);add('R8',r8.passages);add('R9',r9.passages);
if(overlaps.length!==1||overlaps[0].id!=='V11-B12-G1-014'||overlaps[0].old!=='R4'||overlaps[0].new!=='R7')fail('unexpected review overlap '+JSON.stringify(overlaps));
const expected=[];for(let i=1;i<=17;i++)expected.push(`V11-B12-G1-${String(i).padStart(3,'0')}`);for(let i=1;i<=13;i++)expected.push(`V11-B12-G2-${String(i).padStart(3,'0')}`);
const got=[...map.keys()].sort();const want=[...expected].sort();if(JSON.stringify(got)!==JSON.stringify(want))fail('unique reviewed ID coverage mismatch');
let qn=0;for(const {p} of map.values()){if(!Array.isArray(p.questions)||!Array.isArray(p.questionSetB)||p.questions.length!==5||p.questionSetB.length!==5)fail(p.id+' A/B count');qn+=10;}
if(map.size!==30||qn!==300)fail(`coverage count ${map.size}/${qn}`);
console.log(JSON.stringify({batch:'V11-B12',registered:false,officialTotal:718,uniqueHumanReviewedPassages:30,uniqueHumanReviewedQuestions:300,pendingPassages:20,pendingQuestions:200,explicitSupersession:'V11-B12-G1-014 R7 supersedes R4',unexpectedOverlapCount:0,finalRegistrationReady:false},null,2));
