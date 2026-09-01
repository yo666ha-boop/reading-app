'use strict';
const fs=require('fs');
const x=JSON.parse(fs.readFileSync('v11_batch12_slash_question_scaffold.json','utf8'));
if(x.registered!==false||x.officialTotal!==718||!Array.isArray(x.passages)||x.passages.length!==50)throw Error('Batch12 scaffold state');
const rows=[];for(const p of x.passages){for(let i=0;i<(p.slashRows||[]).length;i++){const r=p.slashRows[i];if(r.alignmentShape==='1:1')rows.push({id:p.id,row:i+1,en:r.en,jp:r.jp,cost:r.alignmentCost});}}
const ids=[...new Set(rows.map(r=>r.id))];
const out={batch:'V11-B12',registered:false,officialTotal:718,passageCount:ids.length,rowCount:rows.length,status:'HUMAN_REVIEW_REQUIRED',rows};
fs.writeFileSync('V11_BATCH12_1TO1_SLASH_REVIEW_PACKET.json',JSON.stringify(out,null,2)+'\n');
fs.writeFileSync('V11_BATCH12_1TO1_SLASH_REVIEW_PACKET.tsv',['id\trow\tcost\ten\tjp',...rows.map(r=>[r.id,r.row,r.cost,String(r.en).replace(/\t/g,' '),String(r.jp).replace(/\t/g,' ')].join('\t'))].join('\n')+'\n');
console.log(JSON.stringify({passages:ids.length,rows:rows.length,registered:false},null,2));
