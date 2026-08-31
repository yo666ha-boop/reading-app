(function(){'use strict';
const all=[...(window.V11_BATCH11_G1_DRAFTS||[]),...(window.V11_BATCH11_G2_DRAFTS||[]),...(window.V11_BATCH11_G3_DRAFTS||[])];
const frozen=new Map();
for(const p of all){
  if(p&&p.id&&Array.isArray(p.supportNotes)&&p.supportNotes.length){
    const s={notes:p.supportNotes.map(n=>({...n})),version:p.supportNotesVersion};
    frozen.set(p.id,s);
    let current=s.notes.map(n=>({...n}));
    try{
      Object.defineProperty(p,'supportNotes',{configurable:false,enumerable:true,get(){return current;},set(v){
        // The shared refresh path writes an empty support list while rebuilding a passage.
        // Preserve the verified Batch11 support list against that destructive write, but
        // still allow a later verified non-empty replacement.
        if(Array.isArray(v)&&v.length){current=v.map(n=>({...n}));}
      }});
      p.supportNotesVersion=s.version;
    }catch(e){throw Error('Batch11 support property guard '+p.id+': '+e.message);}
  }
}
if(frozen.size!==50)throw Error('Batch11 support property guard requires 50 snapshots, got '+frozen.size);
function restore(p){const s=frozen.get(p&&p.id);if(!s)return p;if(!Array.isArray(p.supportNotes)||!p.supportNotes.length)p.supportNotes=s.notes.map(n=>({...n}));p.supportNotesVersion=s.version;return p;}
// Keep a best-effort choose wrapper for callers that replace passage objects, but the
// per-passage non-configurable supportNotes accessor above is the primary protection.
const baseChoose=window.choose;
if(typeof baseChoose==='function'){
  const wrapped=function(){return restore(baseChoose.apply(this,arguments));};
  wrapped.__V11_B11_PROPERTY_GUARD=true;wrapped.__V11_B11_PROPERTY_BASE=baseChoose;
  try{window.choose=wrapped;}catch(_e){}
}
for(const arr of Object.values(window.V11_EXTRA_PASSAGES||{}))for(const p of arr||[])restore(p);
window.V11_BATCH11_CHOOSE_PROPERTY_GUARD={installed:true,snapshots:frozen.size,passagePropertyGuard:true,version:'20260831-b11-support-property-guard-r3'};
})();
