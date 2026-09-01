(function registerV11Batch12Final(){
'use strict';
const bundle=window.V11_BATCH12_FINAL_BUNDLE,ps=window.V11_BATCH12_FINAL_PASSAGES||[];
if(!bundle||bundle.registered!==false||bundle.officialBefore!==718||bundle.targetAfterFullGates!==768)throw new Error('Batch12 final bundle state invalid');
if(ps.length!==50||new Set(ps.map(p=>p&&p.id)).size!==50)throw new Error('Batch12 final passages must be 50 unique IDs');
if(typeof window.V11_REGISTER_PASSAGES!=='function')throw new Error('V11_REGISTER_PASSAGES missing');
const norm=s=>String(s||'').normalize('NFKC').replace(/[『』]/g,m=>m==='『'?'「':'」').replace(/[“”]/g,'"').replace(/[’‘]/g,"'").replace(/\s+/g,' ').trim();
const contains=(h,n)=>norm(h).includes(norm(n));
function noteOK(n){return !!n&&!!n.english&&!!n.japanese&&n.kind!=='temporary_vocab_inventory'&&!/placeholder|temporary|最終注整理対象|本文で使用/i.test(String(n.japanese));}
function evidenceOK(p,q){const body=String(p.body||((p.sentences||[]).join(' '))),jp=String(p.fullTranslation||'');const es=Array.isArray(q.evidence)?q.evidence:[q.evidence],js=Array.isArray(q.evidenceJp)?q.evidenceJp:[q.evidenceJp];if(!es.length||es.length!==js.length)return false;return es.every((e,i)=>contains(body,e)&&(contains(jp,js[i])||(p.slashRows||[]).some(r=>contains(r.jp,js[i]))));}
function supportOK(p){const req=new Set((p.notes||[]).map(n=>norm(n&&n.english).toLowerCase()));const sup=p.supportNotes||[];return sup.length>=4&&sup.length<=16&&new Set(sup.map(n=>norm(n&&n.english).toLowerCase())).size===sup.length&&sup.every(n=>n&&n.english&&n.japanese&&!req.has(norm(n.english).toLowerCase())&&!/placeholder|temporary|最終注整理対象/i.test(String(n.japanese)));}
for(const p of ps){
  if(p.registered!==false)throw new Error(p.id+' partial registration invariant');
  if(!p.humanSemanticReview)throw new Error(p.id+' human semantic review missing');
  if(p.finalSlashHumanReview!=='B12_FINAL_SLASH_HUMAN_REVIEW_R7_REPAIRED')throw new Error(p.id+' final slash human review missing');
  if(!Array.isArray(p.slashRows)||!p.slashRows.length||p.slashRows.some(r=>!r.en||!r.jp))throw new Error(p.id+' slash rows invalid');
  if((p.questions||[]).length!==5||(p.questionSetB||[]).length!==5)throw new Error(p.id+' A/B count');
  const qs=[...(p.questions||[]),...(p.questionSetB||[])];
  if(!qs.every(q=>q&&q.questionType&&q.prompt&&q.answer!=null&&q.evidence&&q.evidenceJp&&String(q.reason||'').trim()&&evidenceOK(p,q)))throw new Error(p.id+' human question/evidence invalid');
  if(qs.some(q=>/第\s*\d+\s*(?:文|段階)|generic|scaffold|本文のどの部分/i.test(q.prompt||'')))throw new Error(p.id+' mechanical question remains');
  if(!(p.notes||[]).every(noteOK))throw new Error(p.id+' unresolved normal/required note');
  if(!supportOK(p))throw new Error(p.id+' easy support invalid');
}
if(!Array.isArray(bundle.finalSemanticRepairs)||!bundle.finalSemanticRepairs.includes('V11-B12-G1-011')||!bundle.finalSemanticRepairs.includes('V11-B12-G1-014'))throw new Error('Batch12 R7 semantic repairs missing');
window.V11_BATCH12_PASSAGES=ps;
const st=window.V11_REGISTER_PASSAGES(ps),extra=Number(st&&st.extraPassages||0),totalWithBaseline=168+extra;
if(!st||extra!==600||totalWithBaseline!==768)throw new Error('Batch12 runtime totals invalid '+JSON.stringify(st));
window.V11_BATCH12_STATE={...st,totalWithBaseline,batch12Passages:50,registered:true,humanReviewedPassages:50,humanReviewedQuestions:500,slashReviewedPassages:50,normalNotes:ps.reduce((n,p)=>n+(p.notes||[]).length,0),supportNotes:ps.reduce((n,p)=>n+(p.supportNotes||[]).length,0),version:'20260901-b12-r7-final'};
window.V11_BATCH12_LOADED=true;
})();
