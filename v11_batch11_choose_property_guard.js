(function(){'use strict';
const frozen=new Map();
for(const p of [...(window.V11_BATCH11_G1_DRAFTS||[]),...(window.V11_BATCH11_G2_DRAFTS||[]),...(window.V11_BATCH11_G3_DRAFTS||[])]){
  if(p&&p.id&&Array.isArray(p.supportNotes)&&p.supportNotes.length) frozen.set(p.id,{notes:p.supportNotes.map(n=>({...n})),version:p.supportNotesVersion});
}
if(frozen.size!==50) throw Error('Batch11 choose guard requires 50 support snapshots, got '+frozen.size);
function restore(p){const s=frozen.get(p&&p.id);if(!s)return p;p.supportNotes=s.notes.map(n=>({...n}));p.supportNotesVersion=s.version;return p;}
function wrap(fn){if(typeof fn!=='function')return fn;if(fn.__V11_B11_PROPERTY_GUARD)return fn;const g=function(){return restore(fn.apply(this,arguments));};g.__V11_B11_PROPERTY_GUARD=true;g.__V11_B11_PROPERTY_BASE=fn;return g;}
let current=wrap(window.choose);
try{
  Object.defineProperty(window,'choose',{configurable:true,enumerable:true,get(){return current;},set(fn){current=wrap(fn);}});
}catch(e){throw Error('Batch11 choose property guard install failed: '+e.message);}
window.choose=current;
for(const arr of Object.values(window.V11_EXTRA_PASSAGES||{})) for(const p of arr||[]) restore(p);
window.V11_BATCH11_CHOOSE_PROPERTY_GUARD={installed:true,snapshots:frozen.size,version:'20260831-b11-property-guard-r1'};
})();
