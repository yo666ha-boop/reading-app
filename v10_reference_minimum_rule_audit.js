const fs=require('fs');
const vm=require('vm');
const {JSDOM,VirtualConsole}=require('jsdom');
const norm=s=>String(s||'').replace(/\s+/g,' ').trim();
const deSlash=s=>norm(String(s||'').replace(/\s*\/\s*/g,' '));
const parts=s=>String(s||'').split(/\s*\/\s*/).map(norm).filter(Boolean);
const prepositions=new Set('about above across after against along among around as at before behind below beside between by during for from in inside into near of on over through to under with without'.split(' '));
const conjunctions=new Set('and but or so because if when while although though since'.split(' '));
const relWords=new Set(['which','who','whom','whose']);
function cleanWord(x){return String(x||'').toLowerCase().replace(/^["'“”‘’(\[]+|["'“”‘’),.!?;:\]]+$/g,'')}
function hasSlashBefore(en,wordStart){return /\/\s*$/.test(en.slice(0,wordStart))}
function commaPositions(s){const a=[];for(let i=0;i<s.length;i++)if(s[i]===',')a.push(i);return a}
function hasTextAfterComma(s,pos){return /\S/.test(s.slice(pos+1))}
function wordsBefore(en,start){return norm(en.slice(0,start)).toLowerCase().replace(/[“”"'’‘]/g,'').split(/\s+/).filter(Boolean)}
function wordsAfter(en,end){return norm(en.slice(end)).toLowerCase().replace(/[“”"'’‘]/g,'').split(/\s+/).filter(Boolean)}
function fixedUnitException(en,start,word,end){
  const before=wordsBefore(en,start), after=wordsAfter(en,end), prev=before[before.length-1]||'', prev2=before.slice(-2).join(' '), next=after[0]||'';
  if(word==='around' && /\bshow\s+(?:me|you|him|her|us|them)\s*$/i.test(en.slice(0,start))) return true;
  if(word==='behind' && /\bleft\s*$/i.test(en.slice(0,start))) return true;
  if(word==='while' && prev==='a' && /\bafter\s+a\s*$/i.test(en.slice(0,start))) return true;
  if(word==='near' && /\bis\s*$/i.test(en.slice(0,start))) return true;
  if(word==='of' && /\b(?:in front|on top|first)\s*$/i.test(en.slice(0,start))) return true;
  if(word==='on' && /\bfrom now\s*$/i.test(en.slice(0,start))) return true;
  if(word==='on' && /\bshoes\s*$/i.test(en.slice(0,start))) return true;
  if(word==='at' && /\bat least\s*$/i.test(en.slice(0,start))) return true;
  if(word==='about' && /^\s*how\s*$/i.test(en.slice(0,start))) return true;
  if(word==='if' && prev==='as') return true; // as if is one conjunction unit; boundary belongs before as.
  if(word==='and' && /\btrack\s*$/i.test(en.slice(0,start)) && next==='field') return true; // track and field
  return false;
}
function isConjunctionUse(en,start,word,end){
  if(word==='so'){
    const after=wordsAfter(en,end), next=after[0]||'';
    // so + adjective/adverb is not the conjunction 'so'.
    if(next && /^(?:excited|sad|thin|happy|good|bad|big|small|long|short|beautiful|important|special|different|popular|tired|busy|quiet|fast|slow|well|much|many|few|very)$/.test(next)) return false;
  }
  if(word==='while' && /\bafter\s+a\s*$/i.test(en.slice(0,start))) return false;
  return true;
}
function isRelativeUse(en,start,word){
  const before=en.slice(0,start);
  // Sentence/quote-initial wh-questions and indirect interrogatives are not relative clauses.
  if(!/\S/.test(before.replace(/[“”"'’‘(),:;\s]/g,''))) return false;
  if(/[“"']\s*$/u.test(before)) return false;
  if(/\b(?:ask|asks|asked|say|says|said|question|know|knows|knew|decide|decides|decided|wonder|wonders|wondered|talk about|think about)\s*$/i.test(before)) return false;
  if(/\babout\s*$/i.test(before)) return false;
  return true;
}
function isContentThat(en,start,end){
  const before=en.slice(0,start).trim(),after=en.slice(end).trim();
  if(!before||!after) return false;
  if(/\b(?:for|after|before|from|with|at|in|on|by|about|like)\s*$/i.test(before)) return false;
  if(/\b(?:this|that|the|a|an|each|every|some|any|no)\s*$/i.test(before)) return false;
  // Content/relative that normally follows a reporting/cognition verb, noun antecedent, or a complete clause.
  return /\b(?:know|knew|think|thought|say|said|says|tell|told|explain|explains|explained|realize|realized|reason|dream|thing|things|way|place|person|people|book|story|robot|project|idea)\s*$/i.test(before) || /\b(?:is|are|was|were|can|could|will|would|do|does|did|have|has|had|we|you|they|he|she|it|there|i)\b/i.test(after);
}
function tolerantReferenceSource(src){
 return String(src)
  .replace("if(rows.length!==(p.sentences||[]).length)throw new Error('Row mismatch '+n);","if(rows.length!==(p.sentences||[]).length){window.V10_REFERENCE_STALE=(window.V10_REFERENCE_STALE||[]).concat(n);return}")
  .replace("if(e!==s)throw new Error('English mismatch '+n+'#'+(i+1)+': '+e+' <> '+s);","if(e!==s){window.V10_REFERENCE_STALE=(window.V10_REFERENCE_STALE||[]).concat(n);return}");
}
(async()=>{
 const browserErrs=[];const vc=new VirtualConsole();vc.on('jsdomError',e=>browserErrs.push(String(e&&e.message||e)));
 const dom=await JSDOM.fromFile('v10_stage2.html',{runScripts:'dangerously',resources:'usable',pretendToBeVisual:true,virtualConsole:vc});
 await new Promise((res,rej)=>{const t=setTimeout(()=>rej(new Error('window load timeout')),30000);dom.window.addEventListener('load',()=>{clearTimeout(t);res()},{once:true})});
 const w=dom.window,ctx=dom.getInternalVMContext();w.V10_REFERENCE_STALE=[];
 const sem=[];for(let n=1;n<=151;n+=10)sem.push(`v10_semantic_runtime_repairs_${String(n).padStart(3,'0')}_${String(n+9).padStart(3,'0')}.js`);sem.push('v10_semantic_runtime_repairs_161_168.js');
 for(const f of sem){if(f==='v10_semantic_runtime_repairs_091_100.js'&&fs.existsSync('v10_semantic_runtime_repairs_091_100_alias.js'))vm.runInContext(fs.readFileSync('v10_semantic_runtime_repairs_091_100_alias.js','utf8'),ctx,{filename:'v10_semantic_runtime_repairs_091_100_alias.js'});if(fs.existsSync(f))vm.runInContext(fs.readFileSync(f,'utf8'),ctx,{filename:f})}
 if(fs.existsSync('v10_semantic_runtime_final_fixes.js'))vm.runInContext(fs.readFileSync('v10_semantic_runtime_final_fixes.js','utf8'),ctx,{filename:'v10_semantic_runtime_final_fixes.js'});
 const manuals=fs.readdirSync('.').filter(f=>/^v10_vocab_slash_manual_.*\.js$/.test(f)).sort();
 for(const f of manuals)vm.runInContext(fs.readFileSync(f,'utf8'),ctx,{filename:f});
 const refs=fs.readdirSync('.').filter(f=>/^v10_reference_slash_manual_.*\.js$/.test(f)).sort();
 for(const f of refs){
   let src=fs.readFileSync(f,'utf8');if(!/001_168/.test(f))src=tolerantReferenceSource(src);
   try{vm.runInContext(src,ctx,{filename:f})}catch(e){browserErrs.push('reference-load '+f+': '+String(e&&e.message||e))}
 }
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
   for(const pos of commaPositions(en))if(hasTextAfterComma(en,pos)&&!/^,\s*\//.test(en.slice(pos)))errs.push(`${tag}: COMMA_BOUNDARY_MISSED :: ${en}`);
   const re=/\b[A-Za-z]+(?:['’][A-Za-z]+)?\b/g;let m;let tokenIndex=0;
   while((m=re.exec(en))){const word=cleanWord(m[0]),start=m.index,end=start+m[0].length;tokenIndex++;if(tokenIndex===1)continue;
     if(prepositions.has(word)&&!fixedUnitException(en,start,word,end)&&!hasSlashBefore(en,start))errs.push(`${tag}: PREPOSITION_BOUNDARY_BEFORE_${word.toUpperCase()}_MISSED :: ${en}`);
     if(conjunctions.has(word)&&isConjunctionUse(en,start,word,end)&&!fixedUnitException(en,start,word,end)&&!hasSlashBefore(en,start))errs.push(`${tag}: CONJUNCTION_BOUNDARY_BEFORE_${word.toUpperCase()}_MISSED :: ${en}`);
     if(relWords.has(word)&&isRelativeUse(en,start,word)&&!hasSlashBefore(en,start))errs.push(`${tag}: RELATIVE_BOUNDARY_BEFORE_${word.toUpperCase()}_MISSED :: ${en}`);
     if(word==='that'&&!hasSlashBefore(en,start)&&isContentThat(en,start,end))errs.push(`${tag}: RELATIVE_OR_CONTENT_THAT_BOUNDARY_MISSED :: ${en}`);
   }
   // No fixed word-count splitter: R14 forbids treating sentence length alone as a failure.
  });
 }
 if(pc!==168)errs.push(`PASSAGE_COUNT ${pc}/168`);
 const stale=[...new Set((w.V10_REFERENCE_STALE||[]).map(Number))].sort((a,b)=>a-b);if(stale.length)errs.unshift(`STALE_REFERENCE_PASSAGES ${stale.join(',')}`);
 if(browserErrs.length)errs.push(...browserErrs.map(x=>'BROWSER '+x));
 console.log(`REFERENCE MINIMUM RULE AUDIT passages=${pc}/168 rows=${rows} reference_marked=${referencePassages}/168 slashes=${slashCount} unsplit_rows=${unsplit} stale=${stale.length}`);
 if(stale.length)console.log('STALE REFERENCE PASSAGES: '+stale.join(','));
 if(errs.length){console.error(`REFERENCE MINIMUM RULE FAIL ${errs.length}`);errs.slice(0,2000).forEach(e=>console.error('- '+e));process.exit(1)}
 console.log('REFERENCE MINIMUM RULE PASS 168/168: source-derived comma/preposition/conjunction/infinitive/relative-clause boundaries, EN/JP chunk counts, English preservation, and reference-style exceptions all pass.');dom.window.close();
})().catch(e=>{console.error('REFERENCE MINIMUM RULE AUDIT ERROR: '+(e.stack||e));process.exit(1)});
