const fs=require('fs');
const f='v10_semantic_runtime_repairs_041_050.js';
let s=fs.readFileSync(f,'utf8');
for(const sec of ['Unit 1-3','Unit 2-3']){
  const oldv=`'ニューホライズン|${sec}':{genre:'dialogue'`;
  const newv=`'ニューホライズン|${sec}':{genre:'email'`;
  if(!s.includes(newv)){
    if(!s.includes(oldv))throw new Error('genre target missing '+sec);
    s=s.replace(oldv,newv);
  }
}
fs.writeFileSync(f,s);
console.log('normalized G1 NH Unit 1-3 and Unit 2-3 to email genre');
