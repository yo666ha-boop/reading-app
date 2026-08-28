'use strict';
const fs=require('fs');
let src=fs.readFileSync('v11_batch05_chronology_audit.js','utf8');
src=src.replaceAll('V11_BATCH05','V11_BATCH06').replaceAll('Batch05','Batch06').replaceAll('batch05','batch06');
src=src.replace("'v11_batch06_passages_draft_g3.js','v11_batch06_grammar_repair.js'","'v11_batch06_passages_draft_g3.js','v11_batch06_draft_repairs.js','v11_batch06_grammar_repair.js','v11_batch06_chronology_repair.js'");
src=src.replace('runtime_total=368','runtime_total=418');
eval(src);
