'use strict';
const fs=require('fs');
let src=fs.readFileSync('v11_batch09_chronology_audit.js','utf8');
src=src.replace("'v11_batch09_g3_length_repair.js']","'v11_batch09_g3_length_repair.js','v11_batch09_grammar_repair.js']");
eval(src);