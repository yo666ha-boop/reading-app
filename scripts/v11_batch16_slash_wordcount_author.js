const fs=require('fs');
// Batch16 authoring gate: preserve body exactly; slash only at existing sentence boundaries.
const files=['V11_BATCH16_BODY_TRANSLATION_DRAFT_G1_001_010.json','V11_BATCH16_BODY_TRANSLATION_DRAFT_G1_011_017.json','V11_BATCH16_BODY_TRANSLATION_DRAFT_G2_001_009.json','V11_BATCH16_BODY_TRANSLATION_DRAFT_G2_010_017.json','V11_BATCH16_BODY_TRANSLATION_DRAFT_G3_001_008.json','V11_BATCH16_BODY_TRANSLATION_DRAFT_G3_009_016.json'];
const addSlash=s=>String(s||'').trim().replace(/([.!?][”"']?)(\s+)/g,'$1 / $2');
const wordCount=s=>(String(s||'').match(/[A-Za-z]+(?:['’][A-Za-z]+)*/g)||[]).length;
let n=0,changed=0,errors=[];
for(const f of files){const j=JSON.parse(fs.readFileSync(f,'utf8'));for(const p of j.items||[]){n++;const body=String(p.body||'').trim();if(!body){errors.push(`${p.id}: empty body`);continue;}const slash=addSlash(body);if(p.slash!==slash){p.slash=slash;changed++;}p.wordCount=wordCount(body);if(p.slash.replace(/ \/ /g,'')!==body)errors.push(`${p.id}: slash reconstruction mismatch`);}j.stage='body_fullTranslation_slash_wordcount_authoring';fs.writeFileSync(f,JSON.stringify(j,null,2)+'\n');}
const report={generatedAt:new Date().toISOString(),batch:'V11-B16',passages:n,changed,errors,pass:n===50&&errors.length===0};fs.writeFileSync('V11_BATCH16_SLASH_WORDCOUNT_REPORT.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));if(!report.pass)process.exitCode=1;
