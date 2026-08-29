(function registerV11Batch07Final(){
'use strict';
const ps=[window.V11_BATCH07_G1_DRAFTS,window.V11_BATCH07_G2_DRAFTS,window.V11_BATCH07_STANDARD_DRAFTS,window.V11_BATCH07_LONG_DRAFTS,window.V11_BATCH07_YAMAGUCHI_EXAM_DRAFTS].flatMap(x=>Array.isArray(x)?x:[]);
if(ps.length!==50)throw new Error('Batch07 final passages missing '+ps.length);
if(typeof window.V11_REGISTER_PASSAGES!=='function')throw new Error('V11_REGISTER_PASSAGES missing');
const ns=window.V11_BATCH07_NOTES_FINALIZE_STATE;if(!ns||ns.unresolved!==0||ns.temporaryGlosses!==false)throw new Error('Batch07 final note gate missing');
if(!window.V11_BATCH07_LENGTH_REPAIR_STATE)throw new Error('Batch07 length repair gate missing');
function noteOK(n){if(Array.isArray(n))return !!n[0]&&!!n[1]&&!String(n[1]).includes('最終注整理対象');return !!n&&!!n.english&&!!n.japanese&&n.kind!=='temporary_vocab_inventory'&&!String(n.japanese).includes('最終注整理対象');}
function evidenceOK(p,q){const es=Array.isArray(q.evidence)?q.evidence:[q.evidence],js=Array.isArray(q.evidenceJp)?q.evidenceJp:[q.evidenceJp];if(es.length!==js.length||!es.length)return false;return es.every((e,i)=>{const j=(p.sentences||[]).indexOf(e);return j>=0&&(p.slashRows[j]||{}).jp===js[i]});}
if(!ps.every(p=>(p.questions||[]).length===5&&(p.questionSetB||[]).length===5&&[...(p.questions||[]),...(p.questionSetB||[])].every(q=>q&&q.prompt&&q.answer&&q.reason&&evidenceOK(p,q))))throw new Error('Batch07 final question/evidence gate missing');
if(ps.some(p=>(p.notes||[]).some(n=>!noteOK(n))))throw new Error('Batch07 unresolved note gloss');
if(ps.some(p=>String(p.fullTranslation||'')!==(p.slashRows||[]).map(x=>x&&x.jp||'').join('')))throw new Error('Batch07 translation/slash mismatch');
window.V11_BATCH07_PASSAGES=ps;
const st=window.V11_REGISTER_PASSAGES(ps);const totalWithBaseline=168+Number(st&&st.extraPassages||0);
if(!st||st.extraPassages!==350||totalWithBaseline!==518)throw new Error('Batch07 runtime totals invalid '+JSON.stringify(st));
window.V11_BATCH07_STATE={...st,totalWithBaseline,batch07Passages:50,registered:true,version:'20260829-final'};
if(typeof window.V11_APPLY_EASY_SUPPORT_NOTES==='function')window.V11_APPLY_EASY_SUPPORT_NOTES();
window.V11_BATCH07_LOADED=true;
})();
