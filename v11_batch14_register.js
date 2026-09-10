(function registerV11Batch14Final(){
'use strict';
if(window.V11_BATCH14_LOADING||window.V11_BATCH14_LOADED)return;
window.V11_BATCH14_LOADING=true;
const norm=s=>String(s||'').normalize('NFKC').replace(/[『』]/g,m=>m==='『'?'「':'」').replace(/[“”]/g,'"').replace(/[’‘]/g,"'").replace(/\s+/g,' ').trim();
const contains=(h,n)=>norm(h).includes(norm(n));
function noteOK(n){return !!n&&!!n.english&&!!n.japanese&&n.kind!=='temporary_vocab_inventory'&&!/placeholder|temporary|最終注整理対象|本文で使用/i.test(String(n.japanese));}
function evidenceOK(p,q){const body=String(p.body||((p.sentences||[]).join(' '))),jp=String(p.fullTranslation||'');const es=Array.isArray(q.evidence)?q.evidence:[q.evidence],js=Array.isArray(q.evidenceJp)?q.evidenceJp:[q.evidenceJp];if(!es.length||es.length!==js.length)return false;return es.every((e,i)=>contains(body,e)&&(contains(jp,js[i])||(p.slashRows||[]).some(r=>contains(r.jp,js[i]))));}
async function loadJson(src){const r=await fetch(src+'?b14='+Date.now(),{cache:'no-store'});if(!r.ok)throw new Error('Batch14 fetch failed '+src+' '+r.status);return r.json();}
(async()=>{try{
  if(typeof window.V11_REGISTER_PASSAGES!=='function')throw new Error('V11_REGISTER_PASSAGES missing');
  if(!window.V11_BATCH13_LOADED||!window.V11_BATCH13_STATE||window.V11_BATCH13_STATE.totalWithBaseline!==818)throw new Error('Batch13 prerequisite missing');
  const [raw,plan]=await Promise.all([loadJson('v11_batch14_assembled_draft.json'),loadJson('v11_batch14_authoring_plan.json')]);
  if(!raw||!Array.isArray(raw.passages)||raw.passages.length!==50)throw new Error('Batch14 assembled 50 missing');
  if(!plan||!Array.isArray(plan.passages)||plan.passages.length!==50)throw new Error('Batch14 plan 50 missing');
  const by=new Map(plan.passages.map(p=>[p.id,p]));
  const ps=raw.passages.map(p=>{const q=by.get(p.id);if(!q)throw new Error(p.id+' plan missing');const x=JSON.parse(JSON.stringify(p));x.textbook=String(q.anchor).startsWith('Sunshine ')?'サンシャイン':'ニューホライズン';x.grade=String(q.grade);x.section=String(q.anchor).replace(/^Sunshine\s+|^NH\s+/,'');x.sentences=(x.slashRows||[]).map(r=>r.english||r.en);x.slashRows=(x.slashRows||[]).map(r=>({en:r.english||r.en,jp:r.japanese||r.jp}));x.registered=false;x.batch='V11-B14';return x});
  if(new Set(ps.map(p=>p&&p.id)).size!==50)throw new Error('Batch14 unique IDs');
  for(const p of ps){
    if(!p.id||!p.body||!p.fullTranslation)throw new Error((p.id||'?')+' core missing');
    if(!Array.isArray(p.sentences)||!p.sentences.length||p.sentences.some(x=>!x))throw new Error(p.id+' sentences');
    if(!Array.isArray(p.slashRows)||!p.slashRows.length||p.slashRows.some(r=>!r.en||!r.jp))throw new Error(p.id+' slash');
    if((p.questions||[]).length!==5||(p.questionSetB||[]).length!==5)throw new Error(p.id+' A/B count');
    const qs=[...p.questions,...p.questionSetB];
    if(!qs.every(q=>q&&q.prompt&&q.answer!=null&&q.evidence&&q.evidenceJp&&String(q.reason||'').trim()&&evidenceOK(p,q)))throw new Error(p.id+' question/evidence');
    if(!(p.notes||[]).every(noteOK))throw new Error(p.id+' notes');
  }
  window.V11_BATCH14_PASSAGES=ps;
  const st=window.V11_REGISTER_PASSAGES(ps),extra=Number(st&&st.extraPassages||0),totalWithBaseline=168+extra;
  if(!st||extra!==700||totalWithBaseline!==868)throw new Error('Batch14 runtime totals invalid '+JSON.stringify(st));
  if(typeof window.V11_APPLY_EASY_SUPPORT_NOTES==='function')window.V11_APPLY_EASY_SUPPORT_NOTES();
  const fallback={'V11-B14-G1-001':{english:'take',japanese:'取る'},'V11-B14-G1-014':{english:'building',japanese:'建物'}};
  for(const p of ps){const f=fallback[p.id];if(!f)continue;const req=new Set((p.notes||[]).map(n=>norm(n&&n.english).toLowerCase()));const sup=p.supportNotes=Array.isArray(p.supportNotes)?p.supportNotes:[];if(sup.length<4&&!req.has(f.english)&&!sup.some(n=>norm(n&&n.english).toLowerCase()===f.english))sup.push({...f,source:'Batch14 curated support fallback',support:true});}
  for(const p of ps){const req=new Set((p.notes||[]).map(n=>norm(n&&n.english).toLowerCase())),sup=p.supportNotes||[];if(sup.length<4||sup.length>16||sup.some(n=>!n||!n.english||!n.japanese||req.has(norm(n.english).toLowerCase())))throw new Error(p.id+' support invalid '+sup.length);}
  window.V11_BATCH14_STATE={...st,totalWithBaseline,batch14Passages:50,registered:true,normalNotes:ps.reduce((n,p)=>n+(p.notes||[]).length,0),supportNotes:ps.reduce((n,p)=>n+(p.supportNotes||[]).length,0),version:'20260910-b14-final'};
  window.V11_BATCH14_LOADED=true;
  if(typeof window.render==='function')window.render();
}catch(e){window.V11_BATCH14_ERROR=String(e&&e.stack||e);console.error(e);throw e;}finally{window.V11_BATCH14_LOADING=false;}})();
})();
