(function(){'use strict';
const all=[...(window.V11_BATCH11_G1_DRAFTS||[]),...(window.V11_BATCH11_G2_DRAFTS||[]),...(window.V11_BATCH11_G3_DRAFTS||[])];
const frozen=new Map();
function cloneNotes(v){return (Array.isArray(v)?v:[]).map(n=>({...n}));}
for(const p of all){
  if(p&&p.id&&Array.isArray(p.supportNotes)&&p.supportNotes.length){
    const s={notes:cloneNotes(p.supportNotes),version:p.supportNotesVersion};
    frozen.set(p.id,s);
    let current=cloneNotes(s.notes);
    try{
      Object.defineProperty(p,'supportNotes',{configurable:false,enumerable:true,get(){return cloneNotes(current);},set(v){if(Array.isArray(v)&&v.length){current=cloneNotes(v);}}});
      p.supportNotesVersion=s.version;
    }catch(e){throw Error('Batch11 support property guard '+p.id+': '+e.message);}
  }
}
if(frozen.size!==50)throw Error('Batch11 support property guard requires 50 snapshots, got '+frozen.size);
function restore(p){
  const s=frozen.get(p&&p.id);if(!s)return p;
  const now=p.supportNotes;
  if(!Array.isArray(now)||!now.length){try{p.supportNotes=cloneNotes(s.notes);}catch(_e){}}
  p.supportNotesVersion=s.version;
  return p;
}
// Keep this wrapper outermost even when later shared runtime code replaces window.choose.
// The setter only swaps the delegate. Every choose result therefore passes through restore().
let delegate=window.choose;
if(typeof delegate==='function'){
  const guardedChoose=function(){return restore(delegate.apply(this,arguments));};
  guardedChoose.__V11_B11_PROPERTY_GUARD=true;
  guardedChoose.__V11_B11_PROPERTY_BASE=delegate;
  try{
    Object.defineProperty(window,'choose',{configurable:true,enumerable:true,get(){return guardedChoose;},set(fn){
      if(typeof fn==='function'&&fn!==guardedChoose){delegate=fn;guardedChoose.__V11_B11_PROPERTY_BASE=fn;}
    }});
  }catch(_e){try{window.choose=guardedChoose;}catch(__e){}}
}
for(const arr of Object.values(window.V11_EXTRA_PASSAGES||{}))for(const p of arr||[])restore(p);
window.V11_BATCH11_CHOOSE_PROPERTY_GUARD={installed:true,snapshots:frozen.size,passagePropertyGuard:true,defensiveClone:true,outerChooseGuard:true,version:'20260831-b11-support-property-guard-r5'};
})();
