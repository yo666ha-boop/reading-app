(function(){'use strict';
const all=[...(window.V11_BATCH11_G1_DRAFTS||[]),...(window.V11_BATCH11_G2_DRAFTS||[]),...(window.V11_BATCH11_G3_DRAFTS||[])];
const frozen=new Map();
function cloneNotes(v){return (Array.isArray(v)?v:[]).map(n=>({...n}));}
for(const p of all){if(p&&p.id&&Array.isArray(p.supportNotes)&&p.supportNotes.length)frozen.set(p.id,{notes:cloneNotes(p.supportNotes),version:p.supportNotesVersion});}
if(frozen.size!==50)throw Error('Batch11 support property guard requires 50 snapshots, got '+frozen.size);
function guardObject(p){
  const s=frozen.get(p&&p.id);if(!s)return false;
  const d=Object.getOwnPropertyDescriptor(p,'supportNotes');
  if(d&&d.configurable===false&&typeof d.get==='function')return true;
  let current=cloneNotes(Array.isArray(p.supportNotes)&&p.supportNotes.length?p.supportNotes:s.notes);
  try{
    Object.defineProperty(p,'supportNotes',{configurable:false,enumerable:true,get(){return cloneNotes(current);},set(v){if(Array.isArray(v)&&v.length)current=cloneNotes(v);}});
    p.supportNotesVersion=s.version;
    return true;
  }catch(e){throw Error('Batch11 registered support guard '+p.id+': '+e.message);}
}
function installRegistryGuards(){
  let found=0,guarded=0;
  for(const arr of Object.values(window.V11_EXTRA_PASSAGES||{}))for(const p of arr||[]){if(!frozen.has(p&&p.id))continue;found++;if(guardObject(p))guarded++;}
  const state={found,guarded,expected:frozen.size,pass:found===frozen.size&&guarded===frozen.size,version:'20260831-b11-registry-support-guard-r7'};
  window.V11_BATCH11_REGISTRY_SUPPORT_GUARD_STATE=state;
  return state;
}
window.V11_INSTALL_BATCH11_REGISTRY_SUPPORT_GUARDS=installRegistryGuards;
// Draft objects may later be replaced by runtime refresh, so draft guarding is only
// a first boundary. The authoritative boundary is installed on registry objects
// immediately after V11_REGISTER_PASSAGES in candidate/persistent registration.
for(const p of all)guardObject(p);
window.V11_BATCH11_CHOOSE_PROPERTY_GUARD={installed:true,snapshots:frozen.size,passagePropertyGuard:true,registryInstaller:true,defensiveClone:true,version:'20260831-b11-registry-support-guard-r7'};
})();
