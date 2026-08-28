const fs=require('fs');
let src=fs.readFileSync('v11_batch03_chronology_audit.js','utf8');
const needle="'v11_batch03_length_repair.js'])";
const repl="'v11_batch03_length_repair.js','v11_batch03_chronology_repair.js'])";
if(!src.includes(needle))throw new Error('Batch03 chronology loader signature changed');
src=src.replace(needle,repl);
eval(src);
