const fs=require('fs');
const required={
 human:'V11_FINAL32_HUMAN_SEMANTIC_FINAL_GATE_20260929.json',
 grammar:'V11_FINAL32_FORMAL_GRAMMAR_CHRONOLOGY_REPORT.json',
 vocab:'V11_FINAL32_FORMAL_VOCAB_CHRONOLOGY_REPORT.json',
 questions:'V11_FINAL32_320_QUESTION_FINAL_GATE.json',
 notes:'V11_FINAL32_NOTES_FINAL_GATE.json',
 slashWordCount:'V11_FINAL32_SLASH_WORDCOUNT_REPORT.json',
 duplicate:'V11_FINAL32_RUNTIME_DUPLICATE_GATE_REPORT.json',
 browserA4Persistent:'V11_FINAL32_BROWSER_A4_PERSISTENT_GATE_REPORT.json'
};
const checks={},failures=[];
for(const [k,p] of Object.entries(required)){
 if(!fs.existsSync(p)){checks[k]={exists:false,pass:false};failures.push(k+' missing '+p);continue;}
 const j=JSON.parse(fs.readFileSync(p,'utf8'));const pass=(j.finalPass===true||j.result==='PASS');
 checks[k]={exists:true,pass,file:p};if(!pass)failures.push(k+' not PASS');
}
const bodyFiles=['V11_FINAL32_BODY_TRANSLATION_DRAFT_G1_001_008.json','V11_FINAL32_BODY_TRANSLATION_DRAFT_G1_009_011.json','V11_FINAL32_BODY_TRANSLATION_DRAFT_G2_001_008.json','V11_FINAL32_BODY_TRANSLATION_DRAFT_G2_009_011.json','V11_FINAL32_BODY_TRANSLATION_DRAFT_G3_001_010.json'];
const bodies=bodyFiles.flatMap(f=>JSON.parse(fs.readFileSync(f,'utf8')).items||[]);
const body32=bodies.length===32&&new Set(bodies.map(x=>x.id)).size===32;
if(!body32)failures.push('body coverage not 32 unique');
const report={generatedAt:new Date().toISOString(),batch:'V11-FINAL32',officialTotalBefore:968,targetTotal:1000,atomicCount:32,registered:false,body32,checks,failures,finalPass:body32&&failures.length===0,next:failures.length?'Fix only failed FINAL32 gates; do not register.':'Load v11_final32_runtime_bundle.js then v11_final32_register.js through the persistent chain; verify total 1000.'};
fs.writeFileSync('V11_FINAL32_REGISTRATION_READY_GATE.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));if(!report.finalPass)process.exit(2);