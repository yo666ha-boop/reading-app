(function registerV11Batch11Final(){
'use strict';
const ps=[window.V11_BATCH11_G1_DRAFTS,window.V11_BATCH11_G2_DRAFTS,window.V11_BATCH11_G3_DRAFTS].flatMap(x=>Array.isArray(x)?x:[]);
if(ps.length!==50)throw new Error('Batch11 final passages missing '+ps.length);
const ids=ps.map(p=>String(p&&p.id||''));if(new Set(ids).size!==50||ids.some(x=>!x))throw new Error('Batch11 final passage IDs must be 50 unique non-empty IDs');
if(typeof window.V11_REGISTER_PASSAGES!=='function')throw new Error('V11_REGISTER_PASSAGES missing');
function noteOK(n){if(Array.isArray(n))return !!n[0]&&!!n[1]&&!String(n[1]).includes('最終注整理対象');return !!n&&!!n.english&&!!n.japanese&&n.kind!=='temporary_vocab_inventory'&&!String(n.japanese).includes('最終注整理対象');}
function evidenceOK(p,q){const es=Array.isArray(q.evidence)?q.evidence:[q.evidence],js=Array.isArray(q.evidenceJp)?q.evidenceJp:[q.evidenceJp];if(es.length!==js.length||!es.length)return false;return es.every((e,i)=>{const j=(p.sentences||[]).indexOf(e);return j>=0&&(p.slashRows[j]||{}).jp===js[i]});}
function supportOK(p){const req=new Set((p.notes||[]).map(n=>String(Array.isArray(n)?n[0]:n&&n.english||'').toLowerCase()));const sup=Array.isArray(p.supportNotes)?p.supportNotes:[];return sup.length>0&&sup.length<=16&&sup.every(n=>n&&n.english&&n.japanese&&!req.has(String(n.english).toLowerCase()));}
function actualHumanPassageReviewOK(p){return Object.keys(p||{}).some(k=>/^humanReviewR\d+$/.test(k)&&p[k]&&p[k].reviewed===true);}
function actualHumanQuestionReviewOK(q){return q&&typeof q.questionReview==='string'&&/HUMAN_REVIEW/.test(q.questionReview);}
if(!ps.every(p=>p.registered===false))throw new Error('Batch11 draft registration invariant lost');
if(!ps.every(p=>p.authorReview&&p.authorReview.reviewed&&p.authorReview.timelineCoherent&&p.authorReview.actorPerspectiveClear&&p.authorReview.causalLogicCoherent&&p.authorReview.translationNatural))throw new Error('Batch11 human semantic review gate missing');
if(!ps.every(actualHumanPassageReviewOK))throw new Error('Batch11 actual human passage review missing');
if(!ps.every(p=>(p.questions||[]).length===5&&(p.questionSetB||[]).length===5&&[...(p.questions||[]),...(p.questionSetB||[])].every(q=>q&&q.questionType&&q.prompt&&q.answer&&String(q.reason||'').trim().length>=8&&actualHumanQuestionReviewOK(q)&&evidenceOK(p,q))))throw new Error('Batch11 final human question/evidence gate missing');
if(ps.some(p=>[...(p.questions||[]),...(p.questionSetB||[])].some(q=>/第\s*\d+\s*(?:文|段階)|sentence\s*\d+/i.test(q.prompt||''))))throw new Error('Batch11 mechanical question scaffold remains');
if(ps.some(p=>(p.notes||[]).some(n=>!noteOK(n))))throw new Error('Batch11 unresolved note gloss');
if(ps.some(p=>String(p.fullTranslation||'')!==(p.slashRows||[]).map(x=>x&&x.jp||'').join('')))throw new Error('Batch11 translation/slash mismatch');
if(!ps.every(supportOK))throw new Error('Batch11 verified support notes missing before registration');
if(typeof window.V11_GET_BATCH11_VERIFIED_SUPPORT_SNAPSHOTS!=='function'||(window.V11_GET_BATCH11_VERIFIED_SUPPORT_SNAPSHOTS()||[]).length!==50)throw new Error('Batch11 verified support snapshot must contain 50 passages');
window.V11_BATCH11_PASSAGES=ps;
const st=window.V11_REGISTER_PASSAGES(ps);const totalWithBaseline=168+Number(st&&st.extraPassages||0);
if(!st||st.extraPassages!==550||totalWithBaseline!==718)throw new Error('Batch11 runtime totals invalid '+JSON.stringify(st));
if(typeof window.V11_APPLY_EASY_SUPPORT_NOTES==='function')window.V11_APPLY_EASY_SUPPORT_NOTES();
if(typeof window.V11_APPLY_BATCH11_EASY_SUPPORT_NOTES==='function'){const sr=window.V11_APPLY_BATCH11_EASY_SUPPORT_NOTES();if(!sr||sr.pass!==true)throw new Error('Batch11 support registry apply '+JSON.stringify(sr));}
if(typeof window.V11_INSTALL_BATCH11_REGISTRY_SUPPORT_GUARDS==='function'){const gr=window.V11_INSTALL_BATCH11_REGISTRY_SUPPORT_GUARDS();if(!gr||gr.pass!==true)throw new Error('Batch11 support registry guard '+JSON.stringify(gr));}
const registered=Object.values(window.V11_EXTRA_PASSAGES||{}).flat().filter(p=>String(p&&p.id||'').startsWith('V11-B11-'));
if(registered.length!==50||new Set(registered.map(p=>p.id)).size!==50||!registered.every(supportOK))throw new Error('Batch11 verified support notes/IDs invalid after registration');
window.V11_BATCH11_STATE={...st,totalWithBaseline,batch11Passages:50,registered:true,humanReviewedPassages:50,humanReviewedQuestions:500,supportSnapshots:50,version:'20260831-human-r14-support-r11-locked'};
window.V11_BATCH11_LOADED=true;
})();
