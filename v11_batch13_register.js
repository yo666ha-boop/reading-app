(function registerV11Batch13Final(){
'use strict';
const bundle=window.V11_BATCH13_FINAL_BUNDLE,ps=window.V11_BATCH13_FINAL_PASSAGES||[];
if(!bundle||bundle.registered!==false||bundle.officialBefore!==768||bundle.targetAfterFullGates!==818)throw new Error('Batch13 final bundle state invalid');
if(ps.length!==50||new Set(ps.map(p=>p&&p.id)).size!==50)throw new Error('Batch13 final passages must be 50 unique IDs');
if(typeof window.V11_REGISTER_PASSAGES!=='function')throw new Error('V11_REGISTER_PASSAGES missing');
const norm=s=>String(s||'').normalize('NFKC').replace(/[『』]/g,m=>m==='『'?'「':'」').replace(/[“”]/g,'"').replace(/[’‘]/g,"'").replace(/\s+/g,' ').trim();
const contains=(h,n)=>norm(h).includes(norm(n));
function noteOK(n){return !!n&&!!n.english&&!!n.japanese&&n.kind!=='temporary_vocab_inventory'&&!/placeholder|temporary|最終注整理対象|本文で使用/i.test(String(n.japanese));}
function evidenceOK(p,q){const body=String(p.body||((p.sentences||[]).join(' '))),jp=String(p.fullTranslation||'');const es=Array.isArray(q.evidence)?q.evidence:[q.evidence],js=Array.isArray(q.evidenceJp)?q.evidenceJp:[q.evidenceJp];if(!es.length||es.length!==js.length)return false;return es.every((e,i)=>contains(body,e)&&(contains(jp,js[i])||(p.slashRows||[]).some(r=>contains(r.jp,js[i]))));}
for(const p of ps){if(p.registered!==false)throw new Error(p.id+' partial registration');if(!p.humanSemanticReview)throw new Error(p.id+' semantic review missing');if(p.finalSlashHumanReview!=='B13_SLASH_HUMAN_REVIEW_PASS')throw new Error(p.id+' slash review missing');if(!Array.isArray(p.slashRows)||!p.slashRows.length||p.slashRows.some(r=>!r.en||!r.jp))throw new Error(p.id+' slash invalid');if((p.questions||[]).length!==5||(p.questionSetB||[]).length!==5)throw new Error(p.id+' A/B count');const qs=[...p.questions,...p.questionSetB];if(!qs.every(q=>q&&q.prompt&&q.answer!=null&&q.evidence&&q.evidenceJp&&String(q.reason||'').trim()&&evidenceOK(p,q)))throw new Error(p.id+' question/evidence invalid');if(!(p.notes||[]).every(noteOK))throw new Error(p.id+' normal/required note invalid');}
window.V11_BATCH13_PASSAGES=ps;
const st=window.V11_REGISTER_PASSAGES(ps),extra=Number(st&&st.extraPassages||0),totalWithBaseline=168+extra;
if(!st||extra!==650||totalWithBaseline!==818)throw new Error('Batch13 runtime totals invalid '+JSON.stringify(st));
if(typeof window.V11_APPLY_EASY_SUPPORT_NOTES==='function')window.V11_APPLY_EASY_SUPPORT_NOTES();
window.V11_BATCH13_STATE={...st,totalWithBaseline,batch13Passages:50,registered:true,humanReviewedPassages:50,humanReviewedQuestions:500,slashReviewedPassages:50,normalNotes:ps.reduce((n,p)=>n+(p.notes||[]).length,0),version:'20260903-b13-candidate'};
window.V11_BATCH13_LOADED=true;
})();
