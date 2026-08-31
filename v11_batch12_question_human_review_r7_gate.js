const fs=require('fs');
const scaffold=JSON.parse(fs.readFileSync('v11_batch12_slash_question_scaffold.json','utf8'));
const r=JSON.parse(fs.readFileSync('v11_batch12_question_human_review_r7_g1_011_017.json','utf8'));
function fail(m){throw new Error(m)}
if(scaffold.registered!==false||r.registered!==false)fail('Batch12 must remain unregistered');
if(scaffold.officialTotal!==718||r.officialTotal!==718)fail('official total drift');
if(!Array.isArray(scaffold.passages)||scaffold.passages.length!==50)fail('expected 50 scaffold passages');
const expected=['V11-B12-G1-011','V11-B12-G1-012','V11-B12-G1-013','V11-B12-G1-014','V11-B12-G1-015','V11-B12-G1-016','V11-B12-G1-017'];
if(JSON.stringify(r.passages.map(p=>p.id))!==JSON.stringify(expected))fail('R7 ids mismatch');
const byId=new Map(scaffold.passages.map(p=>[p.id,p]));
const prompts=[];let n=0;
const generic=/本文の最初に示された状況|判断の手がかりになった具体的な情報|最初の考えをそのまま実行せず|問題を解決するために行った中心的な対応|この出来事から分かったこと・最後に確かめられたこと|本文全体から、同じような場面で大切|確認後、話の流れを変えた中心的な出来事|判断を変えるきっかけになった情報|最終的に行った変更・決定・対応|文章全体を最もよく表す学び・結論/;
for(const rp of r.passages){
  const sp=byId.get(rp.id); if(!sp)fail('missing '+rp.id);
  if(rp.questions.length!==5||rp.questionSetB.length!==5)fail(rp.id+' A/B count');
  const qs=[...rp.questions,...rp.questionSetB];
  if(new Set(qs.map(q=>q.questionType)).size<5)fail(rp.id+' low type diversity');
  for(const q of qs){
    if(!q.prompt||!q.answer||!q.evidence||!q.evidenceJp||!q.reason)fail(rp.id+' incomplete');
    if(q.humanReview!=='HUMAN_REVIEW_R7')fail(rp.id+' marker');
    if(!sp.body.includes(q.evidence))fail(rp.id+' evidence not exact: '+q.evidence);
    if(!sp.fullTranslation.includes(q.evidenceJp))fail(rp.id+' evidenceJp not exact: '+q.evidenceJp);
    if(generic.test(q.prompt))fail(rp.id+' generic prompt');
    prompts.push(q.prompt); n++;
  }
}
if(n!==70||r.reviewedQuestions!==70)fail('review count mismatch');
if(new Set(prompts).size!==prompts.length)fail('duplicate R7 prompts');
console.log(JSON.stringify({batch:'V11-B12',registered:false,officialTotal:718,r7Passages:7,r7Questions:70,previousHumanReviewed:110,cumulativeHumanReviewed:180,humanReviewPending:320,evidenceExactBody:'PASS',evidenceJpExactTranslation:'PASS',questionCompleteness:'PASS',questionTypeDiversity:'PASS',genericScaffoldPromptExcluded:'PASS',finalRegistrationReady:false},null,2));
