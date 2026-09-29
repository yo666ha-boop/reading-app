const fs=require('fs');
const files=['V11_FINAL32_BODY_TRANSLATION_DRAFT_G1_001_008.json','V11_FINAL32_BODY_TRANSLATION_DRAFT_G1_009_011.json','V11_FINAL32_BODY_TRANSLATION_DRAFT_G2_001_008.json','V11_FINAL32_BODY_TRANSLATION_DRAFT_G2_009_011.json','V11_FINAL32_BODY_TRANSLATION_DRAFT_G3_001_010.json'];
const wordCount=s=>(String(s||'').match(/[A-Za-z]+(?:['’][A-Za-z]+)*/g)||[]).length;
const failures=[],rows=[];
for(const f of files)for(const p of JSON.parse(fs.readFileSync(f,'utf8')).items||[]){
 const body=String(p.body||'').trim(),slash=String(p.slash||'').trim(),wc=wordCount(body);
 const rebuilt=slash.replace(/ \/ /g,' ');
 if(!body)failures.push(p.id+' empty body');
 if(!slash)failures.push(p.id+' empty slash');
 if(rebuilt!==body)failures.push(p.id+' slash reconstruction mismatch');
 if(wc<60)failures.push(p.id+' suspiciously short word count '+wc);
 rows.push({id:p.id,wordCount:wc,slashSegments:slash?slash.split(' / ').length:0});
}
const report={generatedAt:new Date().toISOString(),batch:'V11-FINAL32',registered:false,officialTotal:968,passages:rows.length,minWordCount:Math.min(...rows.map(x=>x.wordCount)),maxWordCount:Math.max(...rows.map(x=>x.wordCount)),rows,failures,finalPass:rows.length===32&&failures.length===0};
fs.writeFileSync('V11_FINAL32_SLASH_WORDCOUNT_REPORT.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));if(!report.finalPass)process.exit(2);