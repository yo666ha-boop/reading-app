const fs=require('fs');
const path=require('path');
const {JSDOM,VirtualConsole}=require('jsdom');
function vals(el){return[...el.options].map(o=>o.value)}
function change(w,el,v){el.value=v;el.dispatchEvent(new w.Event('change',{bubbles:true}))}
function clean(s){return String(s||'').replace(/\u00a0/g,' ').replace(/[ \t]+\n/g,'\n').replace(/\n{3,}/g,'\n\n').trim()}
function pad(n){return String(n).padStart(3,'0')}
(async()=>{
 const errs=[];const vc=new VirtualConsole();vc.on('jsdomError',e=>errs.push(String(e&&e.message||e)));
 const dom=await JSDOM.fromFile('v10_stage2.html',{runScripts:'dangerously',resources:'usable',pretendToBeVisual:true,virtualConsole:vc});
 await new Promise((res,rej)=>{const t=setTimeout(()=>rej(new Error('load timeout')),20000);dom.window.addEventListener('load',()=>{clearTimeout(t);setTimeout(res,150)},{once:true})});
 const w=dom.window,d=w.document;
 const tb=d.getElementById('textbook'),grade=d.getElementById('grade'),major=d.getElementById('major'),section=d.getElementById('section'),pattern=d.getElementById('pattern'),alt=d.getElementById('altSetBtn');
 const passage=d.getElementById('passage'),slash=d.getElementById('slash'),questions=d.getElementById('questions'),answers=d.getElementById('answers'),audit=d.getElementById('audit'),gate=d.getElementById('gate');
 const all=['V10 SEMANTIC RENDER DUMP','Purpose: human reading audit of all rendered passages. This report is not itself an approval.',''];
 const entries=[];let n=0;
 for(const g of ['1','2','3']) for(const book of ['サンシャイン','ニューホライズン']){
  change(w,tb,book);change(w,grade,g);change(w,pattern,'all');
  for(const maj of vals(major)){
   change(w,major,maj);
   for(const sec of vals(section)){
    change(w,section,sec);change(w,pattern,'all');
    n++;
    const pass=clean(passage.textContent),sl=clean(slash.textContent),qA=clean(questions.textContent),aA=clean(answers.textContent),au=clean(audit.textContent),ga=clean(gate.textContent);
    const full=[];
    full.push(`===== ${n}/168 | 中${g} | ${book} | ${maj} | ${sec} =====`);
    full.push('--- GATE ---',ga,'--- PASSAGE ---',pass,'--- SLASH / TRANSLATION ---',sl,'--- QUESTIONS A ---',qA,'--- ANSWERS A ---',aA);
    let qB='',aB='';
    if(!alt.disabled){alt.click();await new Promise(r=>setTimeout(r,0));qB=clean(questions.textContent);aB=clean(answers.textContent);full.push('--- QUESTIONS B ---',qB,'--- ANSWERS B ---',aB);alt.click();await new Promise(r=>setTimeout(r,0));}
    full.push('--- AUDIT ---',au,'');
    all.push(...full);
    entries.push({n,g,book,maj,sec,passage:pass,slash:sl,qA,aA,qB,aB,audit:au,gate:ga,full});
   }
  }
 }
 if(n!==168)throw new Error(`expected 168 passages, got ${n}`);
 if(errs.length)throw new Error(`browser errors: ${errs.join(' | ')}`);
 fs.writeFileSync('v10_semantic_render_dump.txt',all.join('\n')+'\n');
 fs.mkdirSync('semantic_chunks',{recursive:true});
 fs.mkdirSync('semantic_passages',{recursive:true});
 for(const old of fs.readdirSync('semantic_chunks'))if(/^v10_semantic_\d+_\d+\.txt$/.test(old))fs.unlinkSync(path.join('semantic_chunks',old));
 for(const old of fs.readdirSync('semantic_passages'))if(/^v10_semantic_\d+\.txt$/.test(old))fs.unlinkSync(path.join('semantic_passages',old));
 for(const e of entries){
   const lines=[`V10 HUMAN REVIEW PASSAGE ${e.n}/168`,`中${e.g} | ${e.book} | ${e.maj} | ${e.sec}`,'','--- PASSAGE + NATURAL TRANSLATION ---',e.passage,'','--- SLASH ---',e.slash,'','--- QUESTIONS A / ANSWERS A ---',e.qA,e.aA];
   if(e.qB)lines.push('','--- QUESTIONS B / ANSWERS B ---',e.qB,e.aB);
   lines.push('','--- AUDIT NOTE ---',e.audit,'');
   fs.writeFileSync(path.join('semantic_passages',`v10_semantic_${pad(e.n)}.txt`),lines.join('\n')+'\n');
 }
 for(let i=0;i<entries.length;i+=10){
   const part=entries.slice(i,i+10),start=part[0].n,end=part[part.length-1].n;
   const lines=[`V10 HUMAN REVIEW CHUNK ${start}-${end}`,'Read for natural meaning and coherence first; then verify translation/slash/questions after rewrites.',''];
   for(const e of part){
     lines.push(`===== ${e.n}/168 | 中${e.g} | ${e.book} | ${e.maj} | ${e.sec} =====`,'--- PASSAGE + NATURAL TRANSLATION ---',e.passage,'--- SLASH ---',e.slash,'--- QUESTIONS A ---',e.qA);
     if(e.qB)lines.push('--- QUESTIONS B ---',e.qB);
     lines.push('--- AUDIT NOTE ---',e.audit,'');
   }
   fs.writeFileSync(path.join('semantic_chunks',`v10_semantic_${pad(start)}_${pad(end)}.txt`),lines.join('\n')+'\n');
 }
 console.log(`SEMANTIC DUMP PASS: rendered ${n}/168 passages; chunks=${Math.ceil(entries.length/10)}; individual=${entries.length}`);
 dom.window.close();
})().catch(e=>{console.error(`SEMANTIC DUMP FAIL: ${e.stack||e}`);process.exit(1)});
