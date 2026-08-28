const fs=require('fs');
const vm=require('vm');
function run(s,f){vm.runInContext(fs.readFileSync(f,'utf8'),s,{filename:f})}
function words(s){return (String(s||'').match(/[A-Za-z]+(?:['’][A-Za-z]+)?/g)||[]).length}
try{
 const s={window:{},console};s.globalThis=s.window;vm.createContext(s);
 for(const f of ['v11_batch02_passages_draft.js','v11_batch02_unit_safe_repair.js','v11_batch02_unique_structure_repair.js','v11_batch02_semantic_rewrite_pass1.js','v11_batch02_semantic_chronology_repair_pass1.js','v11_batch02_required_notes_repair.js','v11_batch02_semantic_rewrite_pass2_grade2.js','v11_batch02_grade2_chronology_repair.js','v11_batch02_semantic_rewrite_pass3_grade3.js','v11_batch02_grade3_chronology_repair.js','v11_batch02_length_repair.js'])run(s,f);
 const ps=JSON.parse(JSON.stringify(s.window.V11_BATCH02_DRAFT_PASSAGES||[]));const failures=[],rows=[];
 for(const p of ps){const wc=words((p.sentences||[]).join(' ')),band=p.targetWordBand||[];const inBand=wc>=Number(band[0])&&wc<=Number(band[1]);const slashOk=Array.isArray(p.slashRows)&&p.slashRows.length===p.sentences.length&&p.slashRows.every((r,i)=>r&&r.en&&r.jp&&r.jp.trim().length>0);const trOk=String(p.fullTranslation||'').trim().length>0;const semantic=Boolean(p.semanticRewrite);if(!inBand)failures.push(`${p.id}:wordCount=${wc} target=${band.join('-')}`);if(!slashOk)failures.push(`${p.id}:slashRows`);if(!trOk)failures.push(`${p.id}:translation`);if(!semantic)failures.push(`${p.id}:semanticRewrite`);if(wc!==p.wordCount)failures.push(`${p.id}:storedWordCount=${p.wordCount} actual=${wc}`);rows.push({id:p.id,grade:p.grade,wordCount:wc,target:band,inBand,slashOk,translationOk:trOk,semanticRewrite:p.semanticRewrite||null});}
 const out={generatedAt:new Date().toISOString(),passages:ps.length,failures,rows,finalPass:ps.length===50&&failures.length===0};fs.writeFileSync('V11_BATCH02_POSTSEMANTIC_CONTENT_AUDIT.json',JSON.stringify(out,null,2)+'\n');console.log(`POSTSEMANTIC passages=${ps.length}/50 failures=${failures.length} final=${out.finalPass?'PASS':'FAIL'}`);if(failures.length)console.log(failures.join('\n'));if(!out.finalPass)process.exitCode=1;
}catch(e){console.error(e.stack||e);process.exitCode=1}
