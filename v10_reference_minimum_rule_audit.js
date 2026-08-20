const fs=require('fs');
const vm=require('vm');
const {JSDOM,VirtualConsole}=require('jsdom');
const norm=s=>String(s||'').replace(/\s+/g,' ').trim();
const deSlash=s=>norm(String(s||'').replace(/\s*\/\s*/g,' '));
const parts=s=>String(s||'').split(/\s*\/\s*/).map(norm).filter(Boolean);
const boundaryWords=new Set('about above across after against along among around as at before behind below beside between by during for from in inside into near of on over through to under with without and but or so because if when while although though since'.split(' '));
const relWords=new Set(['which','who','whom','whose']);
function tokenize(s){return String(s||'').replace(/[“”]/g,'"').split(/\s+/).filter(Boolean)}
function cleanWord(x){return String(x||'').toLowerCase().replace(/^["'“”‘’(\[]+|["'“”‘’),.!?;:\]]+$/g,'')}
function hasSlashBefore(en,wordStart){
  const left=en.slice(0,wordStart);
  return /\/\s*$/.test(left);
}
function commaPositions(s){const a=[];for(let i=0;i<s.length;i++)if(s[i]===',')a.push(i);return a}
(async()=>{
 const browserErrs=[];const vc=new VirtualConsole();vc.on('jsdomError',e=>browserErrs.push(String(e&&e.message||e)));
 const dom=await JSDOM.fromFile('v10_stage2.html',{runScripts:'dangerously',resources:'usable',pretendToBeVisual:true,virtualConsole:vc});
 await new Promise((res,rej)=>{const t=setTimeout(()=>rej(new Error('window load timeout')),30000);dom.window.addEventListener('load',()=>{clearTimeout(t);res()},{once:true})});
 const w=dom.window,ctx=dom.getInternalVMContext();
 // Re-apply the final data layers deterministically so this audit sees the same final passages/slash rows as the app.
 const sem=[];for(let n=1;n<=151;n+=10)sem.push(`v10_semantic_runtime_repairs_${String(n).padStart(3,'0')}_${String(n+9).padStart(3,'0')}.js`);sem.push('v10_semantic_runtime_repairs_161_168.js');
 for(const f of sem){if(f==='v10_semantic_runtime_repairs_091_100.js'&&fs.existsSync('v10_semantic_runtime_repairs_091_100_alias.js'))vm.runInContext(fs.readFileSync('v10_semantic_runtime_repairs_091_100_alias.js','utf8'),ctx,{filename:'v10_semantic_runtime_repairs_091_100_alias.js'});if(fs.existsSync(f))vm.runInContext(fs.readFileSync(f,'utf8'),ctx,{filename:f})}
 if(fs.existsSync('v10_semantic_runtime_final_fixes.js'))vm.runInContext(fs.readFileSync('v10_semantic_runtime_final_fixes.js','utf8'),ctx,{filename:'v10_semantic_runtime_final_fixes.js'});
 const manuals=fs.readdirSync('.').filter(f=>/^v10_vocab_slash_manual_.*\.js$/.test(f)).sort();
 for(const f of manuals)vm.runInContext(fs.readFileSync(f,'utf8'),ctx,{filename:f});
 const refs=fs.readdirSync('.').filter(f=>/^v10_reference_slash_manual_.*\.js$/.test(f)).sort();
 for(const f of refs)vm.runInContext(fs.readFileSync(f,'utf8'),ctx,{filename:f});
 const sets=[['1','サンシャイン',w.V10_SUNSHINE_G1||{}],['1','ニューホライズン',w.V10_NEWHORIZON_G1||{}],['2','サンシャイン',w.V10_PASSAGES_G2_SS||{}],['2','ニューホライズン',w.V10_PASSAGES_G2_NH||{}],['3','サンシャイン',w.V10_PASSAGES_G3_SS||{}],['3','ニューホライズン',w.V10_PASSAGES_G3_NH||{}]];
 const errs=[];let pc=0,rows=0,slashCount=0,unsplit=0,referencePassages=0;
 for(const[g,b,d]of sets)for(const[sec,p]of Object.entries(d)){
  pc++;if(p.slashReferenceAudit==='PASS_REFERENCE_20260820')referencePassages++;
  const ss=Array.isArray(p.sentences)?p.sentences:[],rr=Array.isArray(p.slashRows)?p.slashRows:[];const base=`${g}|${b}|${sec}`;
  if(rr.length!==ss.length){errs.push(`${base}: ROW_COUNT ${rr.length}/${ss.length}`);continue}
  rr.forEach((row,i)=>{
   rows++;const en=norm(row.en),jp=norm(row.jp),plain=norm(ss[i]),tag=`${base}#${i+1}`;
   if(deSlash(en)!==plain)errs.push(`${tag}: ENGLISH_CHANGED :: ${en} <> ${plain}`);
   const ep=parts(en),jpP=parts(jp);slashCount+=Math.max(0,ep.length-1);if(ep.length===1)unsplit++;
   if(ep.length!==jpP.length)errs.push(`${tag}: EN_JP_CHUNK_MISMATCH ${ep.length}/${jpP.length} :: ${en} || ${jp}`);
   // Rule 3: every comma is immediately followed by a slash boundary.
   for(const pos of commaPositions(en))if(!/^,\s*\//.test(en.slice(pos)))errs.push(`${tag}: COMMA_BOUNDARY_MISSED :: ${en}`);
   // Rules 1-2: slash immediately before common prepositions/conjunctions and before infinitive/prepositional to.
   const re=/\b[A-Za-z]+(?:['’][A-Za-z]+)?\b/g;let m;let tokenIndex=0;
   while((m=re.exec(en))){const word=cleanWord(m[0]);const start=m.index;tokenIndex++;if(tokenIndex===1)continue;
     if(boundaryWords.has(word)&&!hasSlashBefore(en,start))errs.push(`${tag}: BOUNDARY_BEFORE_${word.toUpperCase()}_MISSED :: ${en}`);
     if(relWords.has(word)&&!hasSlashBefore(en,start))errs.push(`${tag}: RELATIVE_BOUNDARY_BEFORE_${word.toUpperCase()}_MISSED :: ${en}`);
     // 'that' is checked only when it is not clearly demonstrative before a noun-like short phrase; diagnostics remain explicit for human review.
     if(word==='that'&&!hasSlashBefore(en,start)){
       const before=en.slice(0,start).trim();const after=en.slice(start+m[0].length).trim();
       if(before&&!/\b(?:this|that|the|a|an)\s*$/.test(before)&&/\b(?:is|are|was|were|can|could|will|would|do|does|did|have|has|had|people|we|you|they|he|she|it|there|I)\b/i.test(after))errs.push(`${tag}: RELATIVE_OR_CONTENT_THAT_BOUNDARY_MISSED :: ${en}`);
     }
   }
   // Reference density safety: longer sentences should not remain essentially unsplit.
   const wc=plain.split(/\s+/).filter(Boolean).length;
   if(wc>=10&&ep.length<2)errs.push(`${tag}: TOO_FEW_SLASHES_LONG_SENTENCE words=${wc} :: ${en}`);
  });
 }
 if(pc!==168)errs.push(`PASSAGE_COUNT ${pc}/168`);
 if(browserErrs.length)errs.push(...browserErrs.map(x=>'BROWSER '+x));
 console.log(`REFERENCE MINIMUM RULE AUDIT passages=${pc}/168 rows=${rows} reference_marked=${referencePassages}/168 slashes=${slashCount} unsplit_rows=${unsplit}`);
 if(errs.length){console.error(`REFERENCE MINIMUM RULE FAIL ${errs.length}`);errs.slice(0,1000).forEach(e=>console.error('- '+e));process.exit(1)}
 console.log('REFERENCE MINIMUM RULE PASS 168/168: comma/preposition/conjunction/to/relative-clause minimum boundaries, EN/JP chunk counts, English preservation, and long-sentence density all pass.');
 dom.window.close();
})().catch(e=>{console.error('REFERENCE MINIMUM RULE AUDIT ERROR: '+(e.stack||e));process.exit(1)});
