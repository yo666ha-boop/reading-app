'use strict';
const fs=require('fs');
const path=require('path');
const sourcePath=path.join(__dirname,'v11_batch14_g1_chronology_audit.js');
let src=fs.readFileSync(sourcePath,'utf8');
src=src.replaceAll('v11_batch14_g1_body_draft.json','v11_batch14_g2_body_draft.json');
src=src.replaceAll('V11_BATCH14_G1_','V11_BATCH14_G2_');
src=src.replaceAll('batch14_g1_','batch14_g2_');
src=src.replaceAll('Batch14 G1','Batch14 G2');
src=src.replaceAll('B14_G1','B14_G2');
src=src.replaceAll('v11-b14-g1','v11-b14-g2');
src=src.replace('grade:1,section:p.anchor','grade:2,section:p.anchor');
src=src.replace("classification:'CANDIDATES_FOR_V11_BATCH14_G1_GATE'","classification:'CANDIDATES_FOR_V11_BATCH14_G2_GATE'");
const runner=path.join(__dirname,'.v11_batch14_g2_chronology_runtime.cjs');
fs.writeFileSync(runner,src);
try { require(runner); } finally { try{fs.unlinkSync(runner)}catch(e){} }
