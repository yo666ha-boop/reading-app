'use strict';
const fs=require('fs');
function parseObject(file,varName){
  if(!fs.existsSync(file))return {};
  const s=fs.readFileSync(file,'utf8');
  const key=`const ${varName}=`; const i=s.indexOf(key); if(i<0)return {};
  let p=i+key.length,depth=0,inStr=false,esc=false,end=-1;
  for(;p<s.length;p++){const c=s[p];if(inStr){if(esc)esc=false;else if(c==='\\')esc=true;else if(c==='"')inStr=false;continue;}if(c==='"'){inStr=true;continue;}if(c==='{')depth++;else if(c==='}'){depth--;if(depth===0){end=p+1;break;}}}
  if(end<0)return {}; return JSON.parse(s.slice(i+key.length,end));
}
const sources=[
  ['v11_batch08_gloss_apply.js','all'],
  ['v11_batch07_gloss_apply.js','all'],
  ['v11_batch06_canonical_gloss.js','gloss']
];
const merged={};const counts={};
for(const [f,v] of sources){const o=parseObject(f,v);counts[f]=Object.keys(o).length;Object.assign(merged,o);}
const out=`(function(){'use strict';window.V11_BATCH09_PRIOR_FINAL_GLOSS=${JSON.stringify(merged)};window.V11_BATCH09_PRIOR_FINAL_GLOSS_STATE=${JSON.stringify({generatedAt:new Date().toISOString(),counts,total:Object.keys(merged).length})};})();\n`;
fs.writeFileSync('v11_batch09_prior_final_gloss.js',out);
console.log(JSON.stringify({counts,total:Object.keys(merged).length},null,2));
if(Object.keys(merged).length<500)process.exitCode=1;
