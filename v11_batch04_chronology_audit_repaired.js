const fs=require('fs');
let src=fs.readFileSync('v11_batch04_chronology_audit.js','utf8');
const before="['v11_batch04_passages_draft_g1.js','v11_batch04_passages_draft_g2.js','v11_batch04_passages_draft_g3.js']";
const after="['v11_batch04_passages_draft_g1.js','v11_batch04_passages_draft_g2.js','v11_batch04_passages_draft_g3.js','v11_batch04_length_repair.js','v11_batch04_length_repair_r2.js','v11_batch04_chronology_repair.js']";
if(!src.includes(before))throw new Error('Batch04 chronology loader signature changed');
src=src.replace(before,after).replace("detectorVersion:'3.1-v11-b04-initial'","detectorVersion:'3.1-v11-b04-chronology-repair-pass1'");
eval(src);