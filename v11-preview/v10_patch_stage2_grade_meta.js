const fs=require('fs');
const p='v10_stage2.html';
let s=fs.readFileSync(p,'utf8');
const old1="const META=window.V10_INTERACTION_META||{};let current=null,currentKey='',setIndex=0;const $=id=>document.getElementById(id);";
const new1="const META=window.V10_INTERACTION_META||{};let current=null,currentKey='',setIndex=0;const $=id=>document.getElementById(id);function metaFor(sec){const book=$('textbook').value,g=$('grade').value;return META[book+'|'+g+'|'+sec]||META[book+'|'+sec]||{}}";
const old2="if(p!=='all'){const f=keys.filter(x=>(META[$('textbook').value+'|'+x]?.genre||'')===p);if(f.length)keys=f}";
const new2="if(p!=='all'){const f=keys.filter(x=>(metaFor(x).genre||'')===p);if(f.length)keys=f}";
const old3="const meta=META[$('textbook').value+'|'+currentKey]||{};";
const new3="const meta=metaFor(currentKey);";
for(const [a,b] of [[old1,new1],[old2,new2],[old3,new3]]){if(!s.includes(a))throw new Error('stage2 patch target missing: '+a.slice(0,80));s=s.replace(a,b)}
fs.writeFileSync(p,s);
console.log('patched stage2 grade-qualified metadata lookup');
