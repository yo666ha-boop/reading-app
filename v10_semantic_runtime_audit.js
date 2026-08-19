const fs=require('fs');
const vm=require('vm');
const {JSDOM,VirtualConsole}=require('jsdom');
function filled(v){return typeof v==='string'&&v.trim().length>0}
(async()=>{
 const browserErrors=[];const vc=new VirtualConsole();vc.on('jsdomError',e=>browserErrors.push(String(e&&e.message||e)));
 const dom=await JSDOM.fromFile('v10_stage2.html',{runScripts:'dangerously',resources:'usable',pretendToBeVisual:true,virtualConsole:vc});
 await new Promise((res,rej)=>{const t=setTimeout(()=>rej(new Error('window load timeout')),25000);dom.window.addEventListener('load',()=>{clearTimeout(t);res()},{once:true})});
 const w=dom.window,ctx=dom.getInternalVMContext();
 const chunks=[];for(let n=1;n<=151;n+=10)chunks.push(`v10_semantic_runtime_repairs_${String(n).padStart(3,'0')}_${String(n+9).padStart(3,'0')}.js`);chunks.push('v10_semantic_runtime_repairs_161_168.js');
 // 091-100 uses the compatibility alias immediately before the actual patch.
 const ordered=[];for(const f of chunks){if(f.includes('091_100'))ordered.push('v10_semantic_runtime_repairs_091_100_alias.js');ordered.push(f)}
 for(const f of ordered){if(!fs.existsSync(f))throw new Error(`missing runtime repair ${f}`);vm.runInContext(fs.readFileSync(f,'utf8'),ctx,{filename:f})}
 const repairMeta={};for(const k of Object.keys(w)){if(/^V10_INTERACTION_META_SEMANTIC_REPAIRS(?:_\d{3}_\d{3})?$/.test(k)&&w[k]&&typeof w[k]==='object')Object.assign(repairMeta,w[k])}
 const sets=[
  ['1','サンシャイン',w.V10_SUNSHINE_G1||{}],['1','ニューホライズン',w.V10_NEWHORIZON_G1||{}],
  ['2','サンシャイン',w.V10_PASSAGES_G2_SS||{}],['2','ニューホライズン',w.V10_PASSAGES_G2_NH||{}],
  ['3','サンシャイン',w.V10_PASSAGES_G3_SS||{}],['3','ニューホライズン',w.V10_PASSAGES_G3_NH||{}]
 ];
 const expected={'1|サンシャイン':38,'1|ニューホライズン':31,'2|サンシャイン':24,'2|ニューホライズン':29,'3|サンシャイン':21,'3|ニューホライズン':25};
 let total=0,aq=0,bq=0;const errors=[];
 const checkQ=(q,s,tag)=>{for(const f of ['prompt','answer','evidence','evidenceJp','reason'])if(!filled(q&&q[f]))errors.push(`${tag}: ${f} empty`);for(const ev of String(q&&q.evidence||'').split(' / ').map(x=>x.trim()).filter(Boolean))if(!s.includes(ev))errors.push(`${tag}: evidence not verbatim: ${ev}`)};
 for(const[g,book,data]of sets){const keys=Object.keys(data);const key=`${g}|${book}`;if(keys.length!==expected[key])errors.push(`${key}: expected ${expected[key]}, got ${keys.length}`);total+=keys.length;
  for(const sec of keys){const p=data[sec],tag=`${key}|${sec}`;for(const f of ['title','fullTranslation'])if(!filled(p&&p[f]))errors.push(`${tag}: ${f} empty`);const s=p&&Array.isArray(p.sentences)?p.sentences:[];if(s.length<8)errors.push(`${tag}: sentences short`);if(!p||!Array.isArray(p.slashRows)||p.slashRows.length!==s.length)errors.push(`${tag}: slash mismatch ${p&&p.slashRows&&p.slashRows.length}/${s.length}`);else p.slashRows.forEach((r,i)=>{if(!filled(r.en)||!filled(r.jp))errors.push(`${tag}: slash ${i+1} empty`)});if(!p||!Array.isArray(p.questions)||p.questions.length<3)errors.push(`${tag}: A questions short`);else p.questions.forEach((q,i)=>{aq++;checkQ(q,s,`${tag} AQ${i+1}`)});
   const m=repairMeta[`${book}|${sec}`]||repairMeta[`${book}|${g}|${sec}`];if(!m)errors.push(`${tag}: repaired B metadata missing`);else if(!Array.isArray(m.questionSetB)||m.questionSetB.length<3)errors.push(`${tag}: B questions short`);else m.questionSetB.forEach((q,i)=>{bq++;checkQ(q,s,`${tag} BQ${i+1}`)})
  }
 }
 if(total!==168)errors.push(`total expected 168 got ${total}`);if(browserErrors.length)errors.push(`browser errors: ${browserErrors.join(' | ')}`);
 const markers=[[w.V10_PASSAGES_G2_NH,'Unit 7-4','Keeping the Mountain Trail Clean'],[w.V10_PASSAGES_G3_SS,'PROGRAM 6-3','One Reusable Mug and Less Plastic Waste'],[w.V10_PASSAGES_G3_NH,'Unit 2-2','How Long the Designer Has Used a Recycling Idea'],[w.V10_PASSAGES_G3_NH,'Unit 4-4','Delivering Relief by Bicycle'],[w.V10_PASSAGES_G3_NH,'Unit 6-4','How One Coat Connects Several Countries']];
 for(const[d,s,t]of markers)if(!d||!d[s]||d[s].title!==t)errors.push(`runtime marker failed ${s}: expected ${t}`);
 const repairCount=Object.keys(repairMeta).length;if(repairCount!==168)errors.push(`runtime repair metadata expected 168 got ${repairCount}`);
 console.log(`SEMANTIC RUNTIME AUDIT total=${total}/168 runtime_repairs=${repairCount}/168 A_questions=${aq} B_questions=${bq}`);
 if(errors.length){console.error(`SEMANTIC RUNTIME AUDIT FAIL ${errors.length}`);errors.forEach(e=>console.error('- '+e));process.exit(1)}
 console.log('SEMANTIC RUNTIME AUDIT PASS: all 168 directly applied repairs have synchronized sentence/slash/A+B/evidence structures.');dom.window.close();
})().catch(e=>{console.error('SEMANTIC RUNTIME AUDIT FAIL: '+(e.stack||e));process.exit(1)});
