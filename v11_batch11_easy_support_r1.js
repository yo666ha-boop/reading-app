(function(){
'use strict';
const ps=[...(window.V11_BATCH11_G1_DRAFTS||[]),...(window.V11_BATCH11_G2_DRAFTS||[]),...(window.V11_BATCH11_G3_DRAFTS||[])];
if(ps.length!==50)throw Error('Batch11 50 passages missing');
const gloss={...(window.V11_BATCH10_PRIOR_VERIFIED_GLOSS||{}),...(window.V11_BATCH10_MANUAL_GLOSS||{}),...(window.V11_BATCH11_MANUAL_GLOSS||{}),...(window.V11_EASY_SUPPORT_DICT||{})};
const norm=w=>String(w||'').toLowerCase().replace(/[’‘]/g,"'").trim();
const tok=s=>(String(s||'').replace(/[’‘]/g,"'").match(/[A-Za-z]+(?:'[A-Za-z]+)*/g)||[]).map(norm);
const stop=new Set(['i','a','an','the','am','is','are','was','were','be','been','being','do','does','did','can','could','will','would','should','must','may','might','have','has','had','to','of','in','on','at','for','from','by','with','and','but','or','so','if','that','this','these','those','it','he','she','we','they','you','my','your','his','her','our','their','me','him','us','them','not','no','yes','too','very']);
function lookup(w){
  if(gloss[w])return{base:w,jp:gloss[w]};
  const c=[];
  if(/'s$/.test(w))c.push(w.slice(0,-2));
  if(/ies$/.test(w))c.push(w.slice(0,-3)+'y');
  if(/ves$/.test(w))c.push(w.slice(0,-3)+'f',w.slice(0,-3)+'fe');
  if(/es$/.test(w))c.push(w.slice(0,-2));
  if(/s$/.test(w)&&w.length>3)c.push(w.slice(0,-1));
  if(/ied$/.test(w))c.push(w.slice(0,-3)+'y');
  if(/ed$/.test(w))c.push(w.slice(0,-2),w.slice(0,-1));
  if(/ing$/.test(w)){c.push(w.slice(0,-3),w.slice(0,-3)+'e');if(w.length>5&&w[w.length-4]===w[w.length-5])c.push(w.slice(0,-4));}
  for(const b of c)if(gloss[b])return{base:b,jp:gloss[b]};
  return null;
}
let total=0,min=99,max=0;
for(const p of ps){
  const required=new Set((p.notes||[]).map(n=>norm(n&&n.english)));
  const seen=new Set(),out=[];
  for(const w of tok((p.sentences||[]).join(' '))){
    if(stop.has(w)||required.has(w))continue;
    const g=lookup(w);if(!g||required.has(g.base)||seen.has(g.base))continue;
    const jp=String(g.jp||'').trim();
    if(!jp||jp.toLowerCase()===g.base||/placeholder|temporary|最終注整理対象/i.test(jp))continue;
    seen.add(g.base);out.push({english:g.base,japanese:jp,source:'v11 Batch11 verified easy support',support:true});
    if(out.length>=16)break;
  }
  if(!out.length)throw Error(p.id+' no verified easy support candidate');
  p.supportNotes=out;p.supportNotesVersion='20260830-b11-r3';
  total+=out.length;min=Math.min(min,out.length);max=Math.max(max,out.length);
}
const cloneNotes=v=>(Array.isArray(v)?v:[]).map(n=>({...n}));
const frozenById=new Map(ps.map(p=>[p.id,{supportNotes:cloneNotes(p.supportNotes),supportNotesVersion:p.supportNotesVersion}]));
function exportVerifiedSnapshots(){return [...frozenById.entries()].map(([id,s])=>({id,supportNotes:cloneNotes(s.supportNotes),supportNotesVersion:s.supportNotesVersion}));}
window.V11_GET_BATCH11_VERIFIED_SUPPORT_SNAPSHOTS=exportVerifiedSnapshots;
const protectedObjects=new WeakSet();
function restoreOne(p){
  const src=frozenById.get(p&&p.id);if(!src)return false;
  if(!protectedObjects.has(p)){
    const d=Object.getOwnPropertyDescriptor(p,'supportNotes');
    if(!d||d.configurable!==false){
      let current=cloneNotes(src.supportNotes);
      try{
        Object.defineProperty(p,'supportNotes',{configurable:false,enumerable:true,get(){return cloneNotes(current);},set(v){if(Array.isArray(v)&&v.length){current=cloneNotes(v);}}});
        protectedObjects.add(p);
      }catch(_e){
        p.supportNotes=cloneNotes(src.supportNotes);
      }
    }else{
      try{p.supportNotes=cloneNotes(src.supportNotes);}catch(_e){}
      protectedObjects.add(p);
    }
  }else{
    const now=p.supportNotes;
    if(!Array.isArray(now)||!now.length){try{p.supportNotes=cloneNotes(src.supportNotes);}catch(_e){}}
  }
  p.supportNotesVersion=src.supportNotesVersion;
  return Array.isArray(p.supportNotes)&&p.supportNotes.length>0;
}
function restoreRegistry(){
  let applied=0;
  for(const arr of Object.values(window.V11_EXTRA_PASSAGES||{}))for(const p of arr||[]){if(restoreOne(p))applied++;}
  return applied;
}
function installChooseGuard(force){
  if(typeof window.choose!=='function')return false;
  const current=window.choose;if(!force&&current.__V11_BATCH11_SUPPORT_GUARD===true)return true;
  const baseChoose=current;
  const guarded=function(){const p=baseChoose.apply(this,arguments);if(p&&frozenById.has(p.id))restoreOne(p);return p;};
  guarded.__V11_BATCH11_SUPPORT_GUARD=true;guarded.__V11_BATCH11_SUPPORT_BASE=baseChoose;
  window.choose=guarded;window.__V11_BATCH11_SUPPORT_CHOOSE_GUARD=true;return true;
}
function installRenderGuard(force){
  if(typeof window.render!=='function')return false;
  const current=window.render;if(!force&&current.__V11_BATCH11_SUPPORT_RENDER_GUARD===true)return true;
  const baseRender=current;
  const guarded=function(){const r=baseRender.apply(this,arguments);restoreRegistry();installChooseGuard(true);return r;};
  guarded.__V11_BATCH11_SUPPORT_RENDER_GUARD=true;guarded.__V11_BATCH11_SUPPORT_RENDER_BASE=baseRender;
  window.render=guarded;window.__V11_BATCH11_SUPPORT_RENDER_GUARD=true;return true;
}
function keepGuard(){
  restoreRegistry();
  if(typeof window.choose==='function'&&window.choose.__V11_BATCH11_SUPPORT_GUARD!==true)installChooseGuard(true);
  if(typeof window.render==='function'&&window.render.__V11_BATCH11_SUPPORT_RENDER_GUARD!==true)installRenderGuard(true);
}
window.V11_APPLY_BATCH11_EASY_SUPPORT_NOTES=function(){
  const applied=restoreRegistry();installChooseGuard(true);installRenderGuard(true);
  return{applied,expected:frozenById.size,pass:applied===frozenById.size};
};
for(const p of ps)restoreOne(p);
installChooseGuard(false);installRenderGuard(false);
const guardTimer=setInterval(keepGuard,5);window.__V11_BATCH11_SUPPORT_GUARD_TIMER=guardTimer;
window.V11_BATCH11_EASY_SUPPORT_STATE={passages:ps.length,total,min,max,registered:false,replacementObjectGuard:true,authoritativeSnapshotExport:true,version:'20260831-b11-r10-authoritative-snapshot'};
})();
