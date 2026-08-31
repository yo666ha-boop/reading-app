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
// R6: keep the outer wrapper structurally installed. R5 left the property
// configurable, so later runtime code could replace the descriptor itself and
// bypass the setter. With configurable:false, ordinary later assignments still
// update the delegate through the setter, while descriptor replacement cannot
// remove the restore boundary.
let delegate=window.choose;
if(typeof delegate==='function'){
  const guardedChoose=function(){return restore(delegate.apply(this,arguments));};
  guardedChoose.__V11_B11_PROPERTY_GUARD=true;
  guardedChoose.__V11_B11_PROPERTY_BASE=delegate;
  try{
    Object.defineProperty(window,'choose',{configurable:false,enumerable:true,get(){return guardedChoose;},set(fn){
      if(typeof fn==='function'&&fn!==guardedChoose){delegate=fn;guardedChoose.__V11_B11_PROPERTY_BASE=fn;}
    }});
    const d=Object.getOwnPropertyDescriptor(window,'choose');
    if(!d||d.configurable!==false||typeof d.get!=='function'||typeof d.set!=='function')throw Error('non-configurable choose descriptor not installed');
  }catch(e){throw Error('Batch11 outer choose guard R6: '+e.message);}
}
for(const arr of Object.values(window.V11_EXTRA_PASSAGES||{}))for(const p of arr||[])restore(p);
window.V11_BATCH11_CHOOSE_PROPERTY_GUARD={installed:true,snapshots:frozen.size,passagePropertyGuard:true,defensiveClone:true,outerChooseGuard:true,nonConfigurableChoose:true,version:'20260831-b11-support-property-guard-r6'};
})();
