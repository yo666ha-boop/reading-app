'use strict';
const fs=require('fs');
const files=[1,2,3,4].map(n=>`v11_batch14_g3_body_draft_part${n}.json`);
const parts=files.map(f=>JSON.parse(fs.readFileSync(f,'utf8')));
const passages=parts.flatMap(x=>x.passages||[]);
if(passages.length!==16) throw Error(`G3 count ${passages.length}`);
const ids=passages.map(p=>p.id); if(new Set(ids).size!==16) throw Error('duplicate G3 ids');
for(let i=1;i<=16;i++){const id=`V11-B14-G3-${String(i).padStart(3,'0')}`;if(!ids.includes(id))throw Error(`missing ${id}`)}
const out={batch:'V11-B14',grade:3,registered:false,officialTotal:818,status:'BODY_TRANSLATION_HUMAN_SEMANTIC_REVIEWED_R1_MERGED',passages};
fs.writeFileSync('v11_batch14_g3_body_draft.json',JSON.stringify(out,null,2)+'\n');
console.log(`merged=${passages.length}`);
