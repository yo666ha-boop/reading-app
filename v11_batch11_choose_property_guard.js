(function(){'use strict';
const all=()=>[...(window.V11_BATCH11_G1_DRAFTS||[]),...(window.V11_BATCH11_G2_DRAFTS||[]),...(window.V11_BATCH11_G3_DRAFTS||[])];
let frozen=new Map();
function cloneNotes(v){return (Array.isArray(v)?v:[]).map(n=>({...n}));}
function registryObjects(){const out=[];for(const arr of Object.values(window.V11_EXTRA_PASSAGES||{}))for(const p of arr||[])out.push(p);return out;}
function buildFrozen(){
  const next=new Map();
  for(const p of all())if(p&&p.id&&Array.isArray(p.supportNotes)&&p.supportNotes.length)next.set(p.id,{notes:cloneNotes(p.supportNotes),version:p.supportNotesVersion});
  for(const p of registryObjects())if(p&&/^V11-B11-/.test(String(p.id||''))&&Array.isArray(p.supportNotes)&&p.supportNotes.length&&!next.has(p.id))next.set(p.id,{notes:cloneNotes(p.supportNotes),version:p.supportNotesVersion});
  if(next.size!==50)throw Error('Batch11 support property guard requires 50 verified snapshots at install boundary, got '+next.size);
  frozen=next;
  return frozen;
}
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
  buildFrozen();
  let found=0,guarded=0;
  for(const p of registryObjects()){if(!frozen.has(p&&p.id))continue;found++;if(guardObject(p))guarded++;}
  const state={found,guarded,expected:frozen.size,pass:found===frozen.size&&guarded===frozen.size,version:'20260831-b11-registry-support-guard-r8-delayed-snapshot'};
  window.V11_BATCH11_REGISTRY_SUPPORT_GUARD_STATE=state;
  if(!state.pass)throw Error('Batch11 registry support guard incomplete: '+JSON.stringify(state));
  return state;
}
window.V11_INSTALL_BATCH11_REGISTRY_SUPPORT_GUARDS=installRegistryGuards;
// Do not fail during script loading: easy-support and the candidate registry may be
// populated later in the same startup chain. The installer rebuilds and hard-validates
// all 50 snapshots at the authoritative post-registration boundary.
try{const initial=all();for(const p of initial){if(p&&Array.isArray(p.supportNotes)&&p.supportNotes.length){if(!frozen.has(p.id))frozen.set(p.id,{notes:cloneNotes(p.supportNotes),version:p.supportNotesVersion});}}for(const p of initial)if(frozen.has(p&&p.id))guardObject(p);}catch(_e){}
window.V11_BATCH11_CHOOSE_PROPERTY_GUARD={installed:true,snapshotsAtLoad:frozen.size,passagePropertyGuard:true,registryInstaller:true,delayedSnapshotValidation:true,defensiveClone:true,version:'20260831-b11-registry-support-guard-r8-delayed-snapshot'};
})();
