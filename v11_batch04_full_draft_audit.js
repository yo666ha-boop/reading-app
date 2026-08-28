const fs=require('fs'),vm=require('vm');
const sandbox={window:{},console};sandbox.globalThis=sandbox.window;vm.createContext(sandbox);
for(const f of ['v11_batch04_passages_draft_g1.js','v11_batch04_passages_draft_g2.js','v11_batch04_passages_draft_g3.js','v11_batch04_length_repair.js'])vm.runInContext(fs.readFileSync(f,'utf8'),sandbox,{filename:f});
const ps=[...(sandbox.window.V11_BATCH04_G1_PASSAGES||[]),...(sandbox.window.V11_BATCH04_G2_PASSAGES||[]),...(sandbox.window.V11_BATCH04_G3_PASSAGES||[])];
const problems=[],ids=new Set();
if(ps.length!==50)problems.push(`count=${ps.length}`);
for(const p of ps){
 if(ids.has(p.id))problems.push(`${p.id}:duplicate`);ids.add(p.id);
 const actual=(p.sentences.join(' ').match(/[A-Za-z]+(?:['’][A-Za-z]+)?/g)||[]).length;
 if(actual!==p.wordCount)problems.push(`${p.id}:wordCount stored=${p.wordCount} actual=${actual}`);
 const [lo,hi]=p.targetWordBand||[];if(actual<lo||actual>hi)problems.push(`${p.id}:wordBand ${actual} not ${lo}-${hi}`);
 if(!Array.isArray(p.slashRows)||p.slashRows.length!==p.sentences.length)problems.push(`${p.id}:slashRows=${p.slashRows&&p.slashRows.length}/${p.sentences.length}`);
 if(!p.fullTranslation||p.fullTranslation.length<20)problems.push(`${p.id}:translation`);
 if((p.questions||[]).length!==5||(p.questionSetB||[]).length!==5)problems.push(`${p.id}:questions`);
 for(const q of [...(p.questions||[]),...(p.questionSetB||[])]){if(!p.sentences.includes(q.evidence))problems.push(`${p.id}:evidence not in text`);if(!q.evidenceJp||!q.reason)problems.push(`${p.id}:question evidence/reason missing`);}
 if(p.registered!==false)problems.push(`${p.id}:registered must stay false during authoring`);
 if(!p.semanticRewrite||!String(p.semanticRewrite).includes('BATCH04'))problems.push(`${p.id}:semanticRewrite marker`);
}
const byGrade={};for(const p of ps)(byGrade[p.grade]||(byGrade[p.grade]=[])).push({id:p.id,wordCount:p.wordCount,target:p.targetWordBand,title:p.title});
const out={generatedAt:new Date().toISOString(),count:ps.length,registered:false,currentRuntimeTotal:318,targetRuntimeTotal:368,lengthRepair:sandbox.window.V11_BATCH04_LENGTH_REPAIR_STATE||null,problems,byGrade,finalPass:ps.length===50&&problems.length===0};
fs.writeFileSync('V11_BATCH04_FULL_DRAFT_AUDIT.json',JSON.stringify(out,null,2)+'\n');
console.log(`Batch04 full draft count=${ps.length}/50 problems=${problems.length} final=${out.finalPass?'PASS':'FAIL'}`);for(const x of problems)console.log(x);if(!out.finalPass)process.exitCode=1;