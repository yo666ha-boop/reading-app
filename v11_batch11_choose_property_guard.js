(function(){'use strict';
const all=()=>[...(window.V11_BATCH11_G1_DRAFTS||[]),...(window.V11_BATCH11_G2_DRAFTS||[]),...(window.V11_BATCH11_G3_DRAFTS||[])];
let frozen=new Map();
function cloneNotes(v){return (Array.isArray(v)?v:[]).map(n=>({...n}));}
function registryObjects(){const out=[];for(const arr of Object.values(window.V11_EXTRA_PASSAGES||{}))for(const p of arr||[])out.push(p);return out;}
function diagSnapshot(raw,next){
  const drafts=all(),regs=registryObjects().filter(p=>p&&/^V11-B11-/.test(String(p.id||'')));
  const rawIds=(raw||[]).map(s=>s&&s.id).filter(Boolean),draftIds=drafts.map(p=>p&&p.id).filter(Boolean),regIds=regs.map(p=>p&&p.id).filter(Boolean);
  const uniq=a=>[...new Set(a)],dups=a=>uniq(a.filter((x,i)=>a.indexOf(x)!==i));
  const expected=uniq(draftIds);
  return {
    rawCount:(raw||[]).length,rawUnique:uniq(rawIds).length,rawDuplicates:dups(rawIds),
    draftCount:drafts.length,draftUnique:expected.length,draftDuplicates:dups(draftIds),
    registryCount:regs.length,registryUnique:uniq(regIds).length,registryDuplicates:dups(regIds),
    mapCount:next.size,
    missingFromRaw:expected.filter(id=>!rawIds.includes(id)),
    missingFromMap:expected.filter(id=>!next.has(id)),
    emptyDraftSupport:drafts.filter(p=>p&&!Array.isArray(p.supportNotes)||p&&Array.isArray(p.supportNotes)&&!p.supportNotes.length).map(p=>p&&p.id),
    emptyRegistrySupport:regs.filter(p=>!Array.isArray(p.supportNotes)||!p.supportNotes.length).map(p=>p&&p.id)
  };
}
function buildFrozen(){
  const next=new Map();
  let raw=[];
  if(typeof window.V11_GET_BATCH11_VERIFIED_SUPPORT_SNAPSHOTS==='function'){
    raw=window.V11_GET_BATCH11_VERIFIED_SUPPORT_SNAPSHOTS()||[];
    for(const s of raw){
      if(s&&s.id&&Array.isArray(s.supportNotes)&&s.supportNotes.length)next.set(s.id,{notes:cloneNotes(s.supportNotes),version:s.supportNotesVersion});
    }
  }
  for(const p of all())if(p&&p.id&&Array.isArray(p.supportNotes)&&p.supportNotes.length&&!next.has(p.id))next.set(p.id,{notes:cloneNotes(p.supportNotes),version:p.supportNotesVersion});
  for(const p of registryObjects())if(p&&/^V11-B11-/.test(String(p.id||''))&&Array.isArray(p.supportNotes)&&p.supportNotes.length&&!next.has(p.id))next.set(p.id,{notes:cloneNotes(p.supportNotes),version:p.supportNotesVersion});
  if(next.size!==50)throw Error('Batch11 support property guard requires 50 verified snapshots at install boundary, got '+next.size+' DIAG '+JSON.stringify(diagSnapshot(raw,next)));
  frozen=next;
  return frozen;
}
function guardObject(p){
  const s=frozen.get(p&&p.id);if(!s)return false;
  const d=Object.getOwnPropertyDescriptor(p,'supportNotes');
  if(d&&d.configurable===false&&typeof d.get==='function'){
    try{p.supportNotes=cloneNotes(s.notes);}catch(_e){}
    p.supportNotesVersion=s.version;
    return Array.isArray(p.supportNotes)&&p.supportNotes.length>0;
  }
  let current=cloneNotes(Array.isArray(p.supportNotes)&&p.supportNotes.length?p.supportNotes:s.notes);
  try{
    Object.defineProperty(p,'supportNotes',{configurable:false,enumerable:true,get(){return cloneNotes(current);},set(v){if(Array.isArray(v)&&v.length)current=cloneNotes(v);}});
    p.supportNotesVersion=s.version;
    return true;
  }catch(e){throw Error('Batch11 registered support guard '+p.id+': '+e.message);}
}
function installRegistryGuards(){
  buildFrozen();
  let found=0,guarded=0;
  for(const p of registryObjects()){if(!frozen.has(p&&p.id))continue;found++;if(guardObject(p))guarded++;}
  const state={found,guarded,expected:frozen.size,pass:found===frozen.size&&guarded===frozen.size,authoritativeSnapshot:true,version:'20260831-b11-registry-support-guard-r10-diag'};
  window.V11_BATCH11_REGISTRY_SUPPORT_GUARD_STATE=state;
  if(!state.pass)throw Error('Batch11 registry support guard incomplete: '+JSON.stringify(state));
  return state;
}
window.V11_INSTALL_BATCH11_REGISTRY_SUPPORT_GUARDS=installRegistryGuards;
try{const initial=all();for(const p of initial){if(p&&Array.isArray(p.supportNotes)&&p.supportNotes.length){if(!frozen.has(p.id))frozen.set(p.id,{notes:cloneNotes(p.supportNotes),version:p.supportNotesVersion});}}for(const p of initial)if(frozen.has(p&&p.id))guardObject(p);}catch(_e){}
window.V11_BATCH11_CHOOSE_PROPERTY_GUARD={installed:true,snapshotsAtLoad:frozen.size,passagePropertyGuard:true,registryInstaller:true,delayedSnapshotValidation:true,authoritativeSnapshot:true,defensiveClone:true,diagnosticIds:true,version:'20260831-b11-registry-support-guard-r10-diag'};
})();
