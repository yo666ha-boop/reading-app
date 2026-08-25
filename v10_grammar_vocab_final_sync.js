// Final bounded sync after reference + grammar chronology rewrites.
// Restores vocabulary chronology where a grammar-safe rewrite accidentally introduced a later lexical item.
(function(){
 const data=window.V10_NEWHORIZON_G1||{};
 const defs=[
  {section:'Unit 3-3',from:'I practice every day.',to:'I practice after school.',jpFrom:'毎日練習するんだ。',jpTo:'放課後に練習するんだ。',slash:{en:'I practice / after school.',jp:'私は練習します / 放課後に'},prompt:'話し手はいつ練習しますか。本文から英語で答えなさい。',answer:'after school'},
  {section:'Unit 4-2',from:'We practice every day.',to:'We practice after school.',jpFrom:'私たちは毎日練習します。',jpTo:'私たちは放課後に練習します。',slash:{en:'We practice / after school.',jp:'私たちは練習します / 放課後に'},prompt:'話し手たちはいつ練習しますか。本文から英語で答えなさい。',answer:'after school'}
 ];
 function metas(section){const out=[];for(const key of ['ニューホライズン|1|'+section,'ニューホライズン|'+section]){const m=window.V10_INTERACTION_META&&window.V10_INTERACTION_META[key];if(m)out.push(m);}for(const k of Object.keys(window)){if(!/^V10_INTERACTION_META_SEMANTIC_REPAIRS(?:_\d{3}_\d{3})?$/.test(k))continue;const obj=window[k];if(!obj||typeof obj!=='object')continue;for(const key of ['ニューホライズン|1|'+section,'ニューホライズン|'+section])if(obj[key])out.push(obj[key]);}return [...new Set(out)];}
 function syncQ(q,d){if(!q)return 0;const hit=String(q.evidence||'').includes(d.from)||String(q.answer||'')==='every day';if(!hit)return 0;q.prompt=d.prompt;q.answer=d.answer;q.evidence=d.to;q.evidenceJp=d.jpTo;q.reason='本文の after school が練習する時を表しています。';return 1;}
 let changed=0,qchanged=0;const missing=[];
 for(const d of defs){const p=data[d.section];if(!p){missing.push(d.section+':passage');continue;}const i=(p.sentences||[]).indexOf(d.from);if(i<0){if(!(p.sentences||[]).includes(d.to))missing.push(d.section+':sentence');}else{p.sentences[i]=d.to;if(Array.isArray(p.slashRows)&&p.slashRows[i])p.slashRows[i]=d.slash;p.fullTranslation=String(p.fullTranslation||'').split(d.jpFrom).join(d.jpTo);changed++;}for(const q of (p.questions||[]))qchanged+=syncQ(q,d);for(const m of metas(d.section))for(const q of (m.questionSetB||[]))qchanged+=syncQ(q,d);p.auditNote=String(p.auditNote||'')+' Final chronology sync: grammar-safe rewrite used future lexical day; replaced with already-learned after school and synchronized sentence/translation/slash/A+B evidence.';}
 window.V10_GRAMMAR_VOCAB_FINAL_SYNC={definitions:defs.length,changed,qchanged,missing,version:'20260826'};
 if(missing.length)throw new Error('grammar-vocab final sync missing: '+missing.join(' | '));
})();
