const fs=require('fs');
const vm=require('vm');
const {JSDOM,VirtualConsole}=require('jsdom');
const norm=s=>String(s||'').replace(/\s+/g,' ').trim();
const deSlash=s=>norm(String(s||'').replace(/\s*\/\s*/g,' '));
const parts=s=>String(s||'').split(/\s*\/\s*/).map(norm).filter(Boolean);
const wc=s=>norm(s).split(/\s+/).filter(Boolean).length;
(async()=>{
 const errs=[],vc=new VirtualConsole();vc.on('jsdomError',e=>errs.push('browser: '+String(e&&e.message||e)));
 const dom=await JSDOM.fromFile('v10_stage2.html',{runScripts:'dangerously',resources:'usable',pretendToBeVisual:true,virtualConsole:vc});
 await new Promise((res,rej)=>{const t=setTimeout(()=>rej(new Error('window load timeout')),25000);dom.window.addEventListener('load',()=>{clearTimeout(t);res()},{once:true})});
 const w=dom.window,ctx=dom.getInternalVMContext();
 const chunks=[];for(let n=1;n<=151;n+=10)chunks.push(`v10_semantic_runtime_repairs_${String(n).padStart(3,'0')}_${String(n+9).padStart(3,'0')}.js`);chunks.push('v10_semantic_runtime_repairs_161_168.js');
 const ordered=[];for(const f of chunks){if(f.includes('091_100'))ordered.push('v10_semantic_runtime_repairs_091_100_alias.js');ordered.push(f)}ordered.push('v10_semantic_runtime_final_fixes.js');
 for(const f of ordered){if(!fs.existsSync(f))throw new Error('missing '+f);vm.runInContext(fs.readFileSync(f,'utf8'),ctx,{filename:f})}
 const sets=[['1','サンシャイン',w.V10_SUNSHINE_G1||{}],['1','ニューホライズン',w.V10_NEWHORIZON_G1||{}],['2','サンシャイン',w.V10_PASSAGES_G2_SS||{}],['2','ニューホライズン',w.V10_PASSAGES_G2_NH||{}],['3','サンシャイン',w.V10_PASSAGES_G3_SS||{}],['3','ニューホライズン',w.V10_PASSAGES_G3_NH||{}]];
 let pc=0,rc=0,slashCount=0,noSlash=0;
 const objectVerbs=new Set(['like','likes','love','loves','see','sees','saw','eat','eats','ate','read','reads','write','writes','wrote','play','plays','visit','visits','visited','make','makes','made','take','takes','took','buy','buys','bought','want','wants','need','needs','choose','chooses','chose','open','opens','collect','collects','collected','protect','protects','enjoy','enjoys']);
 const prepStart=/^(?:in|at|on|with|for|from|about|after|before|during|near|around|along|by|because|when|while|if|that|since)\b/i;
 const lastWord=s=>{const a=norm(s).replace(/[.,!?;:"“”'’]+$/g,'').split(/\s+/);return (a[a.length-1]||'').toLowerCase()};
 for(const[g,b,d]of sets)for(const[sec,p]of Object.entries(d)){
  pc++;const tag=`${g}|${b}|${sec}`;
  if(p.slashReadingVersion!=='meaning-chunks-v2')errs.push(`${tag}: missing meaning-chunks-v2`);
  const s=Array.isArray(p.sentences)?p.sentences:[],r=Array.isArray(p.slashRows)?p.slashRows:[];
  if(r.length!==s.length){errs.push(`${tag}: row count ${r.length}/${s.length}`);continue;}
  r.forEach((row,i)=>{
   rc++;const en=norm(row.en),jp=norm(row.jp),tag2=`${tag}#${i+1}`;
   if(deSlash(en)!==norm(s[i]))errs.push(`${tag2}: slash changes English: ${en} <> ${s[i]}`);
   const ep=parts(en),jpParts=parts(jp);if(ep.length===1)noSlash++;else slashCount+=ep.length-1;
   if(wc(s[i])<=5&&ep.length>1)errs.push(`${tag2}: forced slash in very short basic sentence: ${en}`);
   if(ep.length>1&&jpParts.length!==ep.length)errs.push(`${tag2}: EN/JP chunk count ${ep.length}/${jpParts.length}: ${en} || ${jp}`);
   for(const x of ep)if(wc(x)<2&&ep.length>1&&!/^(Yes|No|Really|Great|However|Then|Next|Finally)[,.!?]?$/i.test(x))errs.push(`${tag2}: one-word fragment: ${en}`);
   for(let k=0;k<ep.length-1;k++){
     const left=ep[k],right=ep[k+1],lw=lastWord(left);
     if(/^(?:am|is|are|was|were|be|been|being|can|could|will|would|shall|should|may|might|must)$/i.test(lw))errs.push(`${tag2}: core grammar split: ${en}`);
     if(/^(?:a|an|the|my|your|his|her|our|their|this|these|those)$/i.test(lw))errs.push(`${tag2}: determiner split: ${en}`);
     if(objectVerbs.has(lw)&&!prepStart.test(right))errs.push(`${tag2}: likely verb/object split: ${en}`);
   }
   if(/\bmade\s*\/\s*from\b/i.test(en))errs.push(`${tag2}: participle phrase split: ${en}`);
   if(/\b(?:is|are|was|were|am)\s*\/\s*/i.test(en))errs.push(`${tag2}: be/complement split: ${en}`);
   if(/\b(?:can|could|will|would|should|must|may|might)\s*\/\s*/i.test(en))errs.push(`${tag2}: auxiliary/verb split: ${en}`);
   if(/,\s*\/\s*and\b/i.test(en))errs.push(`${tag2}: likely list split before and: ${en}`);
  });
 }
 if(pc!==168)errs.push(`passages ${pc}/168`);
 if(!w.V10_SLASH_REBUILD||w.V10_SLASH_REBUILD.passages!==168)errs.push(`runtime rebuild marker missing: ${JSON.stringify(w.V10_SLASH_REBUILD||null)}`);
 const expect=(p,sentence,want,tag)=>{const i=p.sentences.indexOf(sentence);if(i<0)return errs.push(`${tag}: sentence missing`);const got=norm(p.slashRows[i].en);if(got!==want)errs.push(`${tag}: expected [${want}] got [${got}]`)};
 const gr2=w.V10_SUNSHINE_G1['Get Ready 2'];
 const gr3=w.V10_SUNSHINE_G1['Get Ready 3'];
 const gr4=w.V10_SUNSHINE_G1['Get Ready 4'];
 expect(gr2,'This is my English book.','This is my English book.','reference no be/complement split');
 expect(gr2,'I write “dog” in my notebook.','I write “dog” / in my notebook.','reference place phrase split');
 expect(gr3,'I like English.','I like English.','reference no verb/object split');
 expect(gr4,'I practice in the gym every day.','I practice / in the gym / every day.','reference core/place/time chunks');
 const p81=(w.V10_PASSAGES_G2_SS||{})['PROGRAM 8-1'];
 if(p81)expect(p81,'I see a notebook made from recycled paper.','I see a notebook / made from recycled paper.','reference participle phrase chunk');
 console.log(`SLASH QUALITY passages=${pc}/168 rows=${rc} slashes=${slashCount} unsplit_rows=${noSlash}`);
 if(errs.length){console.error(`SLASH QUALITY FAIL ${errs.length}`);errs.slice(0,200).forEach(e=>console.error('- '+e));process.exit(1)}
 console.log('SLASH QUALITY PASS: meaning chunks preserve every English sentence, core grammar stays intact, useful place/time chunks are retained, list boundaries are not mistaken for clause boundaries, and EN/JP chunk counts agree.');dom.window.close();
})().catch(e=>{console.error('SLASH QUALITY FAIL: '+(e.stack||e));process.exit(1)});
