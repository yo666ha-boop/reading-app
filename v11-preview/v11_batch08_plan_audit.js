'use strict';
const fs=require('fs');
const x=fs.readFileSync('V11_BATCH08_50_PASSAGE_PLAN.md','utf8');
const rows=[...x.matchAll(/^\d+\. `(?<id>V11-B08-G(?<g>[123])-\d{3})` — (?<anchor>.+?) — (?<tier>NORMAL|LONG|STANDARD|YAMAGUCHI_EXAM) (?<min>\d+)[–-](?<max>\d+) — \*\*(?<title>.+?)\*\* — (?<story>.+)$/gm)].map(m=>m.groups);
const ids=new Set(rows.map(r=>r.id)),titles=new Set(rows.map(r=>r.title));
const grade={1:rows.filter(r=>r.g==='1').length,2:rows.filter(r=>r.g==='2').length,3:rows.filter(r=>r.g==='3').length};
const g1Long=rows.filter(r=>r.g==='1'&&r.tier==='LONG').length,g2Long=rows.filter(r=>r.g==='2'&&r.tier==='LONG').length;
const g3={STANDARD:rows.filter(r=>r.g==='3'&&r.tier==='STANDARD').length,LONG:rows.filter(r=>r.g==='3'&&r.tier==='LONG').length,YAMAGUCHI_EXAM:rows.filter(r=>r.g==='3'&&r.tier==='YAMAGUCHI_EXAM').length};
const badBands=[];for(const r of rows){const a=+r.min,b=+r.max;if(!(a<b))badBands.push([r.id,a,b]);if(r.g==='1'&&r.tier==='NORMAL'&&(a<90||b>130))badBands.push([r.id,'G1_NORMAL',a,b]);if(r.g==='1'&&r.tier==='LONG'&&(a!==135||b!==165))badBands.push([r.id,'G1_LONG',a,b]);if(r.g==='2'&&r.tier==='NORMAL'&&(a<115||b>160))badBands.push([r.id,'G2_NORMAL',a,b]);if(r.g==='2'&&r.tier==='LONG'&&(a!==170||b!==210))badBands.push([r.id,'G2_LONG',a,b]);if(r.g==='3'&&r.tier==='STANDARD'&&(a!==150||b!==230))badBands.push([r.id,'G3_STANDARD',a,b]);if(r.g==='3'&&r.tier==='LONG'&&(a!==240||b!==330))badBands.push([r.id,'G3_LONG',a,b]);if(r.g==='3'&&r.tier==='YAMAGUCHI_EXAM'&&(a!==330||b!==450))badBands.push([r.id,'G3_EXAM',a,b]);}
const expectedAnchors={1:new Set(['Sunshine G1 PROGRAM 10-2','NH G1 Unit 10-2']),2:new Set(['Sunshine G2 PROGRAM 8-3','NH G2 Unit 7-4']),3:new Set(['Sunshine G3 PROGRAM 7-3','NH G3 Unit 6-4'])};
const badAnchors=rows.filter(r=>!expectedAnchors[r.g].has(r.anchor)).map(r=>[r.id,r.anchor]);
const yamIds=rows.filter(r=>r.tier==='YAMAGUCHI_EXAM').map(r=>r.id).sort();const expectedYam=['V11-B08-G3-003','V11-B08-G3-006','V11-B08-G3-009','V11-B08-G3-014'];
const pass=rows.length===50&&ids.size===50&&titles.size===50&&grade[1]===17&&grade[2]===17&&grade[3]===16&&g1Long===5&&g2Long===5&&g3.STANDARD===8&&g3.LONG===4&&g3.YAMAGUCHI_EXAM===4&&!badBands.length&&!badAnchors.length&&JSON.stringify(yamIds)===JSON.stringify(expectedYam)&&/`registered=false`/.test(x);
const out={generatedAt:new Date().toISOString(),rows:rows.length,uniqueIds:ids.size,uniqueTitles:titles.size,grade,g1Long,g2Long,g3,badBands,badAnchors,yamaguchiIds:yamIds,registered:false,pass};
fs.writeFileSync('V11_BATCH08_PLAN_AUDIT.json',JSON.stringify(out,null,2)+'\n');console.log(JSON.stringify(out,null,2));if(!pass)process.exitCode=2;
