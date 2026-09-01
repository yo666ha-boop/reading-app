'use strict';
const fs=require('fs'),vm=require('vm');
function norm(w){return String(w||'').toLowerCase().replace(/[’‘]/g,"'").trim()}
function loadGloss(){
  const sandbox={window:{},console}; vm.createContext(sandbox);
  for(const f of ['v11_batch10_prior_verified_gloss.js','v11_batch10_manual_gloss_r1.js','v11_batch11_manual_gloss_r1.js']) vm.runInContext(fs.readFileSync(f,'utf8'),sandbox,{filename:f});
  let b12={}; try{b12=require('./v11_batch12_manual_gloss_r1.js')}catch(e){}
  return {...(sandbox.window.V11_BATCH10_PRIOR_VERIFIED_GLOSS||{}),...(sandbox.window.V11_BATCH10_MANUAL_GLOSS||{}),...(sandbox.window.V11_BATCH11_MANUAL_GLOSS||{}),...b12};
}
function candidates(w){const a=[w];if(/'s$/.test(w))a.push(w.slice(0,-2));if(/ies$/.test(w))a.push(w.slice(0,-3)+'y');if(/ves$/.test(w))a.push(w.slice(0,-3)+'f',w.slice(0,-3)+'fe');if(/ied$/.test(w))a.push(w.slice(0,-3)+'y');if(/es$/.test(w))a.push(w.slice(0,-2),w.slice(0,-1));if(/s$/.test(w)&&w.length>3)a.push(w.slice(0,-1));for(const suf of ['ing','ed','er','est'])if(w.endsWith(suf)&&w.length>suf.length+2){const b=w.slice(0,-suf.length);a.push(b,b+'e');if(b.endsWith('i'))a.push(b.slice(0,-1)+'y');if(b.length>2&&b.at(-1)===b.at(-2))a.push(b.slice(0,-1));}return [...new Set(a.map(norm))]}
function findGloss(gloss,w){for(const b of candidates(norm(w))){const jp=gloss[b];if(jp&&String(jp).trim()&&norm(jp)!==norm(w)&&!/placeholder|temporary|最終注整理対象|本文で使用/i.test(jp))return{base:b,jp:String(jp).trim()};}return null;}
module.exports=function apply(candidate){const inv=JSON.parse(fs.readFileSync('V11_BATCH13_VOCAB_INVENTORY.json','utf8')),gloss=loadGloss();let added=0;const uncovered=new Set(),covered=new Set();for(const p of candidate.passages||[]){p.notes=Array.isArray(p.notes)?p.notes:[];const have=new Set(p.notes.map(n=>norm(n&&n.english)));for(const w of inv[p.id]||[]){if(have.has(norm(w)))continue;const g=findGloss(gloss,w);if(!g){uncovered.add(norm(w));continue;}p.notes.push({english:norm(w),japanese:g.jp,kind:'unlearned_local_required',source:'prior human-verified Japanese gloss'+(g.base===norm(w)?'':' via '+g.base)});have.add(norm(w));covered.add(norm(w));added++;}}
candidate.priorVerifiedGlossReuse={inventoryPairs:Object.values(inv).reduce((n,a)=>n+a.length,0),notesAdded:added,coveredDistinct:covered.size,uncoveredDistinct:uncovered.size,uncoveredWords:[...uncovered].sort(),registered:false};return candidate;};
if(require.main===module){const build=require('./v11_batch13_build_body_candidate.js');console.log(JSON.stringify(module.exports(build()).priorVerifiedGlossReuse,null,2));}
