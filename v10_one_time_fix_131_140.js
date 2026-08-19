const fs=require('fs');
const p='v10_semantic_runtime_repairs_131_140.js';
let s=fs.readFileSync(p,'utf8');
const marker="];const slash=";
const i=s.lastIndexOf(marker);
if(i<0)throw new Error('131-140 repair tail marker not found');
const head=s.slice(0,i+2);
const tail=`const slash=s=>s.includes(', ')?s.replace(', ',', / '):s;
const mk=(x,s,j)=>({prompt:x[0],answer:x[1],evidence:s[x[2]],evidenceJp:j[x[2]],reason:'本文の該当文から確認できます。'});
const meta={};
for(const [n,sec,title,s,j,qq] of data){
  if(!window.V10_PASSAGES_G3_SS[sec])throw new Error('Missing SS G3 passage '+sec);
  const questions=qq.map(x=>mk(x,s,j));
  Object.assign(window.V10_PASSAGES_G3_SS[sec],{title,sentences:s,fullTranslation:j.join(''),slashRows:s.map((e,i)=>({en:slash(e),jp:j[i].replace('、','、 / ')})),questions,auditNote:'Passage '+n+': sentence-first blueprintに基づき、1つの場面・話題へ再構成。'});
  const b=[questions[4],questions[2],questions[0],questions[3]];
  meta['サンシャイン|'+sec]={genre:'report',questionSetB:b.map((z,i)=>({...z,prompt:(i+1)+'. '+z.prompt.replace(/^\\d+\\.\\s*/,'')}))};
}
window.V10_INTERACTION_META_SEMANTIC_REPAIRS_131_140=meta;
})();`;
const out=head+tail;
fs.writeFileSync(p,out);
console.log('fixed '+p);
