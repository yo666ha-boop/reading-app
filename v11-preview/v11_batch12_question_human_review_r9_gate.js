const fs=require('fs');
const scaffold=JSON.parse(fs.readFileSync('v11_batch12_slash_question_scaffold.json','utf8'));
const r=JSON.parse(fs.readFileSync('v11_batch12_question_human_review_r9_g2_008_013.json','utf8'));
function fail(m){throw new Error(m)}
if(scaffold.registered!==false||r.registered!==false)fail('Batch12 must remain unregistered');
if(scaffold.officialTotal!==718||r.officialTotal!==718)fail('official total drift');
if(!Array.isArray(scaffold.passages)||scaffold.passages.length!==50)fail('expected 50 scaffold passages');
const expected=['V11-B12-G2-008','V11-B12-G2-009','V11-B12-G2-010','V11-B12-G2-011','V11-B12-G2-012','V11-B12-G2-013'];
if(JSON.stringify(r.passages.map(p=>p.id))!==JSON.stringify(expected))fail('R9 ids mismatch');
const byId=new Map(scaffold.passages.map(p=>[p.id,p]));
const prompts=[];let n=0;
for(const rp of r.passages){const sp=byId.get(rp.id);if(!sp)fail('missing '+rp.id);if(rp.questions.length!==5||rp.questionSetB.length!==5)fail(rp.id+' A/B count');const qs=[...rp.questions,...rp.questionSetB];if(new Set(qs.map(q=>q.questionType)).size<5)fail(rp.id+' low type diversity');for(const q of qs){if(!q.prompt||!q.answer||!q.evidence||!q.evidenceJp||!q.reason)fail(rp.id+' incomplete');if(q.humanReview!=='HUMAN_REVIEW_R9')fail(rp.id+' marker');if(!sp.body.includes(q.evidence))fail(rp.id+' evidence not exact: '+q.evidence);if(!sp.fullTranslation.includes(q.evidenceJp))fail(rp.id+' evidenceJp not exact: '+q.evidenceJp);prompts.push(q.prompt);n++;}}
if(n!==60||r.reviewedQuestions!==60)fail('review count mismatch');if(new Set(prompts).size!==prompts.length)fail('duplicate R9 prompts');
console.log(JSON.stringify({batch:'V11-B12',registered:false,officialTotal:718,r9Passages:6,r9Questions:60,previousUniqueHumanReviewed:240,cumulativeUniqueHumanReviewed:300,humanReviewPending:200,evidenceExactBody:'PASS',evidenceJpExactTranslation:'PASS',questionCompleteness:'PASS',questionTypeDiversity:'PASS',finalRegistrationReady:false},null,2));
