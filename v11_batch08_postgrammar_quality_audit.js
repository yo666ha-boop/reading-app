'use strict';
const fs=require('fs');
let src=fs.readFileSync('v11_batch08_50_authoring_quality_audit.js','utf8');
src=src.replace("'v11_batch08_g3_length_repair.js'", "'v11_batch08_g3_length_repair.js','v11_batch08_grammar_repair.js'");
src=src.replaceAll('V11_BATCH08_50_AUTHORING_QUALITY_AUDIT.json','V11_BATCH08_POSTGRAMMAR_QUALITY_AUDIT.json');
src=src.replaceAll('BATCH08 50 AUTHORING','BATCH08 POSTGRAMMAR QUALITY');
eval(src);
