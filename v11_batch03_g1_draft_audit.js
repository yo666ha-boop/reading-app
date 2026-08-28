const fs=require('fs'),vm=require('vm');
const sandbox={window:{},console};sandbox.globalThis=sandbox.window;vm.createContext(sandbox);
vm.runInContext(fs.readFileSync('v11_batch03_passages_draft_g1.js','utf8'),sandbox,{filename:'v11_batch03_passages_draft_g1.js'});
const ps=sandbox.window.V11_BATCH03_DRAFT_G1_PASSAGES||[];
const problems=[];
if(ps.length!==17)problems.push(`count=${ps.length}`);
const ids=new Set();
for(const p of ps){
 if(ids.has(p.id))problems.push(`${p.id}:duplicate`);ids.add(p.id);
 const actual=(p.sentences.join(' ').match(/[A-Za-z]+(?:['’][A-Za-z]+)?/g)||[]).length;
 if(actual!==p.wordCount)problems.push(`${p.id}:wordCount stored=${p.wordCount} actual=${actual}`);
 const [lo,hi]=p.targetWordBand||[];if(actual<lo||actual>hi)problems.push(`${p.id}:wordBand ${actual} not ${lo}-${hi}`);
 if(!Array.isArray(p.slashRows)||p.slashRows.length!==p.sentences.length)problems.push(`${p.id}:slashRows`);
 if(!p.fullTranslation||p.fullTranslation.length<20)problems.push(`${p.id}:translation`);
 if((p.questions||[]).length!==5||(p.questionSetB||[]).length!==5)problems.push(`${p.id}:questions`);
 for(const q of [...(p.questions||[]),...(p.questionSetB||[])])if(!p.sentences.includes(q.evidence))problems.push(`${p.id}:evidence not in text`);
}
const out={generatedAt:new Date().toISOString(),count:ps.length,registered:false,problems,wordCounts:ps.map(p=>({id:p.id,wordCount:p.wordCount,target:p.targetWordBand})),finalPass:ps.length===17&&problems.length===0};
fs.writeFileSync('V11_BATCH03_G1_DRAFT_AUDIT.json',JSON.stringify(out,null,2)+'\n');
console.log(`Batch03 G1 draft count=${ps.length}/17 problems=${problems.length} final=${out.finalPass?'PASS':'FAIL'}`);
for(const x of problems)console.log(x);
if(!out.finalPass)process.exitCode=1;