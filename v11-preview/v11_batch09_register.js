(function registerV11Batch09Final(){
'use strict';
const ps=[window.V11_BATCH09_G1_DRAFTS,window.V11_BATCH09_G2_DRAFTS,window.V11_BATCH09_G3_DRAFTS].flatMap(x=>Array.isArray(x)?x:[]);
if(ps.length!==50)throw new Error('Batch09 final passages missing '+ps.length);
if(typeof window.V11_REGISTER_PASSAGES!=='function')throw new Error('V11_REGISTER_PASSAGES missing');
function noteOK(n){if(Array.isArray(n))return !!n[0]&&!!n[1]&&!String(n[1]).includes('最終注整理対象');return !!n&&!!n.english&&!!n.japanese&&n.kind!=='temporary_vocab_inventory'&&!String(n.japanese).includes('最終注整理対象');}
function evidenceOK(p,q){const es=Array.isArray(q.evidence)?q.evidence:[q.evidence],js=Array.isArray(q.evidenceJp)?q.evidenceJp:[q.evidenceJp];if(es.length!==js.length||!es.length)return false;return es.every((e,i)=>{const j=(p.sentences||[]).indexOf(e);return j>=0&&(p.slashRows[j]||{}).jp===js[i]});}
if(!ps.every(p=>p.authorReview&&p.authorReview.reviewed===true&&p.authorReview.timelineCoherent===true&&p.authorReview.actorPerspectiveClear===true&&p.authorReview.causalLogicCoherent===true&&p.authorReview.translationNatural===true))throw new Error('Batch09 author review gate missing');
if(!ps.every(p=>p.questionStage==='BATCH09_HUMAN_REWRITE_R1'))throw new Error('Batch09 human question rewrite missing');
if(!ps.every(p=>(p.questions||[]).length===5&&(p.questionSetB||[]).length===5&&[...(p.questions||[]),...(p.questionSetB||[])].every(q=>q&&q.questionType&&q.prompt&&q.answer&&q.reason&&evidenceOK(p,q))))throw new Error('Batch09 final question/evidence gate missing');
if(ps.some(p=>[...(p.questions||[]),...(p.questionSetB||[])].some(q=>/第\d+段階|第\d+文の内容を表す空所/.test(q.prompt||''))))throw new Error('Batch09 mechanical question scaffold remains');
if(ps.some(p=>(p.notes||[]).some(n=>!noteOK(n))))throw new Error('Batch09 unresolved note gloss');
if(ps.some(p=>String(p.fullTranslation||'')!==(p.slashRows||[]).map(x=>x&&x.jp||'').join('')))throw new Error('Batch09 translation/slash mismatch');
window.V11_BATCH09_PASSAGES=ps;
const st=window.V11_REGISTER_PASSAGES(ps);const totalWithBaseline=168+Number(st&&st.extraPassages||0);
if(!st||st.extraPassages!==450||totalWithBaseline!==618)throw new Error('Batch09 runtime totals invalid '+JSON.stringify(st));
window.V11_BATCH09_STATE={...st,totalWithBaseline,batch09Passages:50,registered:true,version:'20260829-human-r1'};
if(typeof window.V11_APPLY_EASY_SUPPORT_NOTES==='function')window.V11_APPLY_EASY_SUPPORT_NOTES();
window.V11_BATCH09_LOADED=true;
})();
