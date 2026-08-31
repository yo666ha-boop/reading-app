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
      Object.defineProperty(p,'supportNotes',{configurable:false,enumerable:true,get(){
        // Never expose the private verified backing array. The shared refresh path may
        // clear/splice the array it reads; returning a defensive copy makes that harmless.
        return cloneNotes(current);
      },set(v){
        // Ignore destructive empty replacements from refresh while allowing a later
        // verified non-empty replacement to become the new protected value.
        if(Array.isArray(v)&&v.length){current=cloneNotes(v);}
      }});
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
// Keep a best-effort choose wrapper for callers that replace passage objects. The
// non-configurable accessor plus defensive-copy getter protects same-object refreshes.
const baseChoose=window.choose;
if(typeof baseChoose==='function'){
  const wrapped=function(){return restore(baseChoose.apply(this,arguments));};
  wrapped.__V11_B11_PROPERTY_GUARD=true;wrapped.__V11_B11_PROPERTY_BASE=baseChoose;
  try{window.choose=wrapped;}catch(_e){}
}
for(const arr of Object.values(window.V11_EXTRA_PASSAGES||{}))for(const p of arr||[])restore(p);
window.V11_BATCH11_CHOOSE_PROPERTY_GUARD={installed:true,snapshots:frozen.size,passagePropertyGuard:true,defensiveClone:true,version:'20260831-b11-support-property-guard-r4'};
})();
