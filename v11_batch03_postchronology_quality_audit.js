const fs=require('fs');
const vm=require('vm');
function run(s,f){vm.runInContext(fs.readFileSync(f,'utf8'),s,{filename:f})}
function jac(a,b){a=new Set(a);b=new Set(b);let n=0;for(const x of a)if(b.has(x))n++;return n/(a.size+b.size-n||1)}
function words(s){return (String(s||'').match(/[A-Za-z]+(?:['’][A-Za-z]+)?/g)||[]).length}
try{
 const s={window:{},console};s.globalThis=s.window;vm.createContext(s);
 for(const f of ['v11_batch03_passages_draft_g1.js','v11_batch03_g1_length_repair.js','v11_batch03_passages_draft_g2.js','v11_batch03_passages_draft_g3.js','v11_batch03_length_repair.js','v11_batch03_chronology_repair.js','v11_batch03_chronology_repair_r2.js'])run(s,f);
 const ps=[...(s.window.V11_BATCH03_DRAFT_G1_PASSAGES||[]),...(s.window.V11_BATCH03_DRAFT_G2_PASSAGES||[]),...(s.window.V11_BATCH03_DRAFT_G3_PASSAGES||[])];
 const lengthIssues=[],structureIssues=[],temporaryGlossPassages=[];
 for(const p of ps){
   const wc=words((p.sentences||[]).join(' ')),band=p.targetWordBand||[];
   if(band.length===2&&(wc<Number(band[0])||wc>Number(band[1])))lengthIssues.push({id:p.id,wc,band});
   if(!Array.isArray(p.sentences)||!p.sentences.length||!Array.isArray(p.slashRows)||p.sentences.length!==p.slashRows.length)structureIssues.push({id:p.id,reason:'sentence/slash row mismatch'});
   if((p.slashRows||[]).some(x=>!x||!x.en||!x.jp))structureIssues.push({id:p.id,reason:'empty slash en/jp'});
   if(!String(p.fullTranslation||'').trim())structureIssues.push({id:p.id,reason:'missing fullTranslation'});
   if((p.notes||[]).some(n=>String(n&&n.japanese||'').includes('最終注整理対象')))temporaryGlossPassages.push(p.id);
 }
 const groups=new Map();for(const p of ps){const k=p.textbook+'|'+p.grade+'|'+p.section;if(!groups.has(k))groups.set(k,[]);groups.get(k).push(p)}
 const pairs=[];for(const [g,xs] of groups)for(let i=0;i<xs.length;i++)for(let j=i+1;j<xs.length;j++){const score=jac(xs[i].sentences,xs[j].sentences);if(score>=0.55)pairs.push({group:g,a:xs[i].id,b:xs[j].id,score:+score.toFixed(3)})}
 const arcOnly=[];for(const p of ps){const same=groups.get(p.textbook+'|'+p.grade+'|'+p.section),freq=new Map();for(const x of same)for(const e of x.sentences)freq.set(e,(freq.get(e)||0)+1);const shared=p.sentences.filter(e=>(freq.get(e)||0)>=Math.ceil(same.length*.7)).length,ratio=shared/Math.max(1,p.sentences.length);if(ratio>.55)arcOnly.push({id:p.id,shared,all:p.sentences.length,ratio:+ratio.toFixed(3)})}
 const contentPass=ps.length===50&&lengthIssues.length===0&&structureIssues.length===0;
 const naturalnessPass=ps.length===50&&pairs.length===0&&arcOnly.length===0;
 const out={generatedAt:new Date().toISOString(),passages:ps.length,contentPass,lengthIssueCount:lengthIssues.length,lengthIssues,structureIssueCount:structureIssues.length,structureIssues,naturalnessPass,highSharedPairs:pairs.length,worstPairs:pairs.sort((a,b)=>b.score-a.score).slice(0,30),highCommonSentenceRatio:arcOnly.length,arcOnly,temporaryGlossPassageCount:new Set(temporaryGlossPassages).size,temporaryGlossPassages:[...new Set(temporaryGlossPassages)],questionsPending:ps.filter(p=>(p.questions||[]).length!==5||(p.questionSetB||[]).length!==5).length,finalRegistrationReady:false};
 fs.writeFileSync('V11_BATCH03_POSTCHRONOLOGY_QUALITY_AUDIT.json',JSON.stringify(out,null,2)+'\n');
 console.log(JSON.stringify(out,null,2));
 if(!contentPass||!naturalnessPass)process.exitCode=1;
}catch(e){console.error(e.stack||e);process.exitCode=1}
