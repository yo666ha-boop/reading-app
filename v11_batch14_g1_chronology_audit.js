'use strict';
const fs=require('fs');
let src=fs.readFileSync('v11_batch05_chronology_audit.js','utf8');
src=src.replaceAll('V11_BATCH05','V11_BATCH14_G1').replaceAll('Batch05','Batch14 G1').replaceAll('batch05','batch14_g1');
const loader=`function loadDraft(){const d=JSON.parse(fs.readFileSync('v11_batch14_g1_body_draft.json','utf8'));if(!d||d.registered!==false||d.officialTotal!==818||!Array.isArray(d.passages)||d.passages.length!==17)throw Error('Batch14 G1 draft invariant');return d.passages.map(p=>{const q=JSON.parse(JSON.stringify(p));q.textbook=p.anchor.startsWith('Sunshine ')?'サンシャイン':'ニューホライズン';q.grade=1;q.section=p.anchor.replace(/^Sunshine\\s+|^NH\\s+/,'');q.semanticRewrite=p.humanSemanticReview||null;q.sentences=[p.body];q.slashRows=[];q.questions=[];q.questionSetB=[];q.notes=q.notes||[];return q;});}`;
src=src.replace(/function loadDraft\\(\\)\\{[\\s\\S]*?return JSON\\.parse\\(JSON\\.stringify\\(ps\\)\\);\\}/,loader);
src=src.replaceAll('ps.length===50','ps.length===17').replaceAll('passages:50','passages:17').replaceAll('/50','/17').replace('runtime_total=368','runtime_total=818');
eval(src);
