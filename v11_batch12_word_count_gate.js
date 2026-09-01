'use strict';
const fs=require('fs');
const build=require('./v11_batch12_build_final_candidate.js');
const x=build();
const count=s=>(String(s||'').match(/[A-Za-z]+(?:['’][A-Za-z]+)?/g)||[]).length;
const band=p=>{
  const g=Number(p.anchor&&p.anchor.grade||p.grade);
  const lv=String(p.level||p.tier||'STANDARD').toUpperCase();
  if(g===1)return lv==='LONG'?[135,165]:[90,125];
  if(g===2)return lv==='LONG'?[170,210]:[115,155];
  if(g===3){if(lv==='YAMAGUCHI_EXAM')return[330,450];if(lv==='LONG')return[240,330];return[150,230];}
  throw Error('unknown grade '+g+' '+p.id);
};
const rows=[],failures=[];
for(const p of x.passages||[]){const wc=count(p.body||((p.sentences||[]).join(' '))),[min,max]=band(p);rows.push({id:p.id,grade:Number(p.anchor&&p.anchor.grade||p.grade),level:String(p.level||p.tier||'STANDARD'),words:wc,min,max,pass:wc>=min&&wc<=max});if(wc<min||wc>max)failures.push({id:p.id,words:wc,min,max,level:p.level||p.tier||'STANDARD'});}
const out={batch:'V11-B12',registered:x.registered,officialTotal:x.officialTotal,policy:'V11_YAMAGUCHI_ENTRANCE_EXAM_READING_SPEC.md passage length policy',passages:rows.length,failures,finalPass:rows.length===50&&failures.length===0};
fs.writeFileSync('V11_BATCH12_WORD_COUNT_GATE.json',JSON.stringify(out,null,2)+'\n');console.log(JSON.stringify(out,null,2));if(!out.finalPass)process.exit(1);
