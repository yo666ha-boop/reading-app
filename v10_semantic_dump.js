const fs=require('fs');
const {JSDOM,VirtualConsole}=require('jsdom');
function vals(el){return[...el.options].map(o=>o.value)}
function change(w,el,v){el.value=v;el.dispatchEvent(new w.Event('change',{bubbles:true}))}
function clean(s){return String(s||'').replace(/\u00a0/g,' ').replace(/[ \t]+\n/g,'\n').replace(/\n{3,}/g,'\n\n').trim()}
(async()=>{
 const errs=[];const vc=new VirtualConsole();vc.on('jsdomError',e=>errs.push(String(e&&e.message||e)));
 const dom=await JSDOM.fromFile('v10_stage2.html',{runScripts:'dangerously',resources:'usable',pretendToBeVisual:true,virtualConsole:vc});
 await new Promise((res,rej)=>{const t=setTimeout(()=>rej(new Error('load timeout')),20000);dom.window.addEventListener('load',()=>{clearTimeout(t);setTimeout(res,150)},{once:true})});
 const w=dom.window,d=w.document;
 const tb=d.getElementById('textbook'),grade=d.getElementById('grade'),major=d.getElementById('major'),section=d.getElementById('section'),pattern=d.getElementById('pattern'),alt=d.getElementById('altSetBtn');
 const passage=d.getElementById('passage'),slash=d.getElementById('slash'),questions=d.getElementById('questions'),answers=d.getElementById('answers'),audit=d.getElementById('audit'),gate=d.getElementById('gate');
 let out=[];let n=0;
 out.push('V10 SEMANTIC RENDER DUMP');
 out.push('Purpose: human reading audit of all rendered passages. This report is not itself an approval.');
 out.push('');
 for(const g of ['1','2','3']) for(const book of ['サンシャイン','ニューホライズン']){
  change(w,tb,book);change(w,grade,g);change(w,pattern,'all');
  for(const maj of vals(major)){
   change(w,major,maj);
   for(const sec of vals(section)){
    change(w,section,sec);change(w,pattern,'all');
    n++;
    out.push(`===== ${n}/168 | 中${g} | ${book} | ${maj} | ${sec} =====`);
    out.push('--- GATE ---');out.push(clean(gate.textContent));
    out.push('--- PASSAGE ---');out.push(clean(passage.textContent));
    out.push('--- SLASH / TRANSLATION ---');out.push(clean(slash.textContent));
    out.push('--- QUESTIONS A ---');out.push(clean(questions.textContent));
    out.push('--- ANSWERS A ---');out.push(clean(answers.textContent));
    if(!alt.disabled){alt.click();await new Promise(r=>setTimeout(r,0));out.push('--- QUESTIONS B ---');out.push(clean(questions.textContent));out.push('--- ANSWERS B ---');out.push(clean(answers.textContent));alt.click();await new Promise(r=>setTimeout(r,0));}
    out.push('--- AUDIT ---');out.push(clean(audit.textContent));
    out.push('');
   }
  }
 }
 if(n!==168)throw new Error(`expected 168 passages, got ${n}`);
 if(errs.length)throw new Error(`browser errors: ${errs.join(' | ')}`);
 fs.writeFileSync('v10_semantic_render_dump.txt',out.join('\n')+'\n');
 console.log(`SEMANTIC DUMP PASS: rendered ${n}/168 passages`);
 dom.window.close();
})().catch(e=>{console.error(`SEMANTIC DUMP FAIL: ${e.stack||e}`);process.exit(1)});
