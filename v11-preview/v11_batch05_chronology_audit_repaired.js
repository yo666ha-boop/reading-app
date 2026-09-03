const fs=require('fs');
let src=fs.readFileSync('v11_batch05_chronology_audit.js','utf8');
src=src.replace("'v11_batch05_grammar_repair.js']","'v11_batch05_grammar_repair.js','v11_batch05_grammar_repair_r2.js']");
src=src.replace('3.1-v11-b05-grammar-r1','3.1-v11-b05-grammar-r2');
if(!src.includes('v11_batch05_grammar_repair_r2.js'))throw new Error('failed to layer grammar repair r2 into chronology audit');
eval(src);
