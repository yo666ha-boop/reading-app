const fs=require('fs');
const vm=require('vm');
const {JSDOM,VirtualConsole}=require('jsdom');
const norm=s=>String(s||'').replace(/\s+/g,' ').trim();
const deSlash=s=>norm(String(s||'').replace(/\s*\/\s*/g,' '));
const chunks=s=>String(s||'').split(/\s*\/\s*/).map(norm).filter(Boolean);
const isLetterCommaExempt=en=>/^(?:Dear\b.+|Best wishes|Sincerely yours),$/.test(norm(en));
(async()=>{
 const errors=[], vc=new VirtualConsole();
 vc.on('jsdomError',e=>errors.push('browser: '+String(e&&e.message||e)));
 const dom=await JSDOM.fromFile('v10_stage2.html',{runScripts:'dangerously',resources:'usable',pretendToBeVisual:true,virtualConsole:vc});
 await new Promise((res,rej)=>{const t=setTimeout(()=>rej(new Error('window load timeout')),30000);dom.window.addEventListener('load',()=>{clearTimeout(t);res()},{once:true})});
 const w=dom.window,ctx=dom.getInternalVMContext();
 const semantic=[];for(let n=1;n<=151;n+=10)semantic.push(`v10_semantic_runtime_repairs_${String(n).padStart(3,'0')}_${String(n+9).padStart(3,'0')}.js`);semantic.push('v10_semantic_runtime_repairs_161_168.js');
 const before=[];for(const f of semantic){if(f.includes('091_100'))before.push('v10_semantic_runtime_repairs_091_100_alias.js');before.push(f)}before.push('v10_semantic_runtime_final_fixes.js');
 const vocab=['v10_vocab_slash_manual_004_010.js','v10_vocab_slash_manual_011_020.js','v10_vocab_slash_manual_021_030.js','v10_vocab_slash_manual_031_040.js','v10_vocab_slash_manual_041_050.js','v10_vocab_slash_manual_051_060.js','v10_vocab_slash_manual_061_070.js','v10_vocab_slash_manual_071_080.js','v10_vocab_slash_manual_081_090.js','v10_vocab_slash_manual_091_168.js','v10_vocab_slash_manual_corrections.js'];
 const refs=['v10_reference_slash_manual_001_168.js','v10_reference_slash_manual_021_030.js','v10_reference_slash_manual_031_040.js','v10_reference_slash_manual_041_050.js','v10_reference_slash_manual_051_060.js','v10_reference_slash_manual_061_070.js','v10_reference_slash_manual_071_080.js','v10_reference_slash_manual_081_090.js','v10_reference_slash_manual_091_100.js','v10_reference_slash_manual_101_110.js','v10_reference_slash_manual_111_120.js','v10_reference_slash_manual_121_130.js','v10_reference_slash_manual_131_140.js','v10_reference_slash_manual_141_150.js','v10_reference_slash_manual_151_160.js','v10_reference_slash_manual_161_168.js'];
 for(const f of [...before,...vocab,...refs]){if(!fs.existsSync(f))throw new Error('missing '+f);vm.runInContext(fs.readFileSync(f,'utf8'),ctx,{filename:f})}
 const sets=[['1','サンシャイン',w.V10_SUNSHINE_G1||{}],['1','ニューホライズン',w.V10_NEWHORIZON_G1||{}],['2','サンシャイン',w.V10_PASSAGES_G2_SS||{}],['2','ニューホライズン',w.V10_PASSAGES_G2_NH||{}],['3','サンシャイン',w.V10_PASSAGES_G3_SS||{}],['3','ニューホライズン',w.V10_PASSAGES_G3_NH||{}]];
 let passages=0,rows=0,slashes=0,unsplit=0;const seen=new Set();
 for(const[g,b,d]of sets)for(const[sec,p]of Object.entries(d)){
   passages++;const tag=`${g}|${b}|${sec}`;
   if(p.slashReferenceAudit!=='PASS_REFERENCE_20260820')errors.push(`${tag}: missing reference PASS marker`);
   if(p.slashReadingVersion!=='reference-book-minimum-rules-20260820')errors.push(`${tag}: wrong slash version ${p.slashReadingVersion}`);
   const no=Number(p.slashReferencePassageNo);if(!(no>=1&&no<=168))errors.push(`${tag}: bad passage no ${p.slashReferencePassageNo}`);else if(seen.has(no))errors.push(`${tag}: duplicate passage no ${no}`);else seen.add(no);
   const s=Array.isArray(p.sentences)?p.sentences:[],r=Array.isArray(p.slashRows)?p.slashRows:[];
   if(r.length!==s.length){errors.push(`${tag}: rows ${r.length}/${s.length}`);continue}
   for(let i=0;i<r.length;i++){
     rows++;const en=norm(r[i].en),jp=norm(r[i].jp),t=`${tag}#${i+1}`;
     if(deSlash(en)!==norm(s[i]))errors.push(`${t}: English changed`);
     const ec=chunks(en).length,jc=chunks(jp).length;if(ec!==jc)errors.push(`${t}: EN/JP chunks ${ec}/${jc}`);
     slashes+=Math.max(0,ec-1);if(ec===1)unsplit++;
     if(!isLetterCommaExempt(en)&&/,(?!\s*\/)/.test(en))errors.push(`${t}: comma not followed by slash: ${en}`);
     const plain=' '+en.replace(/\s+/g,' ')+' ';
     const toMatches=[...plain.matchAll(/\sto\s+[A-Za-z]/gi)];
     for(const m of toMatches){const idx=m.index||0;const beforeText=plain.slice(Math.max(0,idx-4),idx+1);if(!/\/\s*$/.test(beforeText))errors.push(`${t}: to-boundary lacks slash: ${en}`)}
   }
 }
 if(passages!==168)errors.push(`passages ${passages}/168`);
 if(seen.size!==168)errors.push(`numbered passage markers ${seen.size}/168`);
 for(let n=1;n<=168;n++)if(!seen.has(n))errors.push(`missing passage marker ${n}`);
 if(!w.V10_REFERENCE_SLASH_AUDIT||w.V10_REFERENCE_SLASH_AUDIT.passagesAudited!==168||w.V10_REFERENCE_SLASH_AUDIT.lastCompleted!==168)errors.push('final V10_REFERENCE_SLASH_AUDIT marker missing/incomplete');
 const p153=(w.V10_PASSAGES_G3_NH||{})['Unit 3-1'];
 const requireRow=(sentence,expected)=>{if(!p153)return errors.push('missing NH G3 Unit 3-1');const i=p153.sentences.indexOf(sentence);if(i<0)return errors.push('production example sentence missing: '+sentence);if(norm(p153.slashRows[i].en)!==expected)errors.push('production example mismatch: '+p153.slashRows[i].en)};
 requireRow('The animal needs a large area to find food and raise its young.','The animal needs a large area / to find food / and raise its young.');
 requireRow('Human activity has changed part of the forest into roads and buildings.','Human activity has changed part / of the forest / into roads / and buildings.');
 requireRow('The population is now in danger.','The population is now / in danger.');
 console.log(`REFERENCE RUNTIME passages=${passages}/168 rows=${rows} slashes=${slashes} unsplit=${unsplit}`);
 if(errors.length){console.error(`REFERENCE RUNTIME FAIL ${errors.length}`);errors.slice(0,300).forEach(e=>console.error('- '+e));process.exit(1)}
 console.log('REFERENCE RUNTIME PASS: all 168 passages use explicit reference/minimum-rule slash rows, preserve English, align EN/JP chunk counts, enforce comma/to boundaries, and include the reported production example.');
 dom.window.close();
})().catch(e=>{console.error('REFERENCE RUNTIME FAIL: '+(e.stack||e));process.exit(1)});