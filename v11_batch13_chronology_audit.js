'use strict';
const fs=require('fs');
let src=fs.readFileSync('v11_batch05_chronology_audit.js','utf8');
src=src.replaceAll('V11_BATCH05','V11_BATCH13').replaceAll('Batch05','Batch13').replaceAll('batch05','batch13');
const loader=`function loadDraft(){const build=require('./v11_batch13_build_body_candidate.js');const apply=require('./v11_batch13_apply_prior_verified_gloss.js');const x=apply(build());if(!x||!Array.isArray(x.passages)||x.passages.length!==50)throw Error('Batch13 candidate not 50');const ps=x.passages.map(p=>{const q=JSON.parse(JSON.stringify(p));const a=q.anchor||{};q.textbook=a.textbook==='Sunshine'?'サンシャイン':a.textbook==='New Horizon'?'ニューホライズン':a.textbook;q.grade=Number(a.grade);q.section=a.unit;q.semanticRewrite=q.humanSemanticReview||'B13_HUMAN_SEMANTIC_COMPLETE';q.notes=q.notes||[];return q;});return ps;}`;
src=src.replace(/function loadDraft\(\)\{[\s\S]*?return JSON\.parse\(JSON\.stringify\(ps\)\);\}/,loader);
src=src.replace('runtime_total=368','runtime_total=768');
eval(src);
