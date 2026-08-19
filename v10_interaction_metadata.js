window.V10_INTERACTION_META=window.V10_INTERACTION_META||{};
(function(){
 if(typeof document==='undefined')return;
 const target=window.V10_INTERACTION_META;
 window.V10_RUNTIME_LOAD_PROGRESS='start';window.V10_RUNTIME_LOAD_ERROR='';
 const load=(src,done)=>{window.V10_RUNTIME_LOAD_PROGRESS='loading:'+src;const s=document.createElement('script');s.src=src;s.onload=()=>{window.V10_RUNTIME_LOAD_PROGRESS='loaded:'+src;done()};s.onerror=()=>{window.V10_RUNTIME_LOAD_ERROR='failed:'+src;window.V10_RUNTIME_LOAD_PROGRESS='error:'+src;done()};document.head.appendChild(s)};
 const dataset=(g,book)=>g==='1'?(book==='サンシャイン'?(window.V10_SUNSHINE_G1||{}):(window.V10_NEWHORIZON_G1||{})):g==='2'?(book==='サンシャイン'?(window.V10_PASSAGES_G2_SS||{}):(window.V10_PASSAGES_G2_NH||{})):(book==='サンシャイン'?(window.V10_PASSAGES_G3_SS||{}):(window.V10_PASSAGES_G3_NH||{}));
 const gradeFor=(book,sec,m)=>{const ev=m&&Array.isArray(m.questionSetB)&&m.questionSetB[0]&&m.questionSetB[0].evidence;const hits=[];for(const g of ['1','2','3']){const p=dataset(g,book)[sec];if(p&&(!ev||(p.sentences||[]).includes(ev)))hits.push(g)}return hits.length===1?hits[0]:''};
 const mergeObj=obj=>{Object.assign(target,obj);for(const[k,m]of Object.entries(obj||{})){const parts=k.split('|');if(parts.length===2){const[gbook,sec]=parts,g=gradeFor(gbook,sec,m);if(g)target[gbook+'|'+g+'|'+sec]=m}}};
 const chunks=[
  ['v10_interaction_metadata_initial.js',()=>window.V10_INTERACTION_META],
  ['v10_interaction_metadata_sun_p1_p3.js',()=>window.V10_INTERACTION_META_P1P3],
  ['v10_interaction_metadata_sun_p4_p6.js',()=>window.V10_INTERACTION_META_P4P6],
  ['v10_interaction_metadata_sun_p7_p8.js',()=>window.V10_INTERACTION_META_P7P8],
  ['v10_interaction_metadata_sun_p9_p10.js',()=>window.V10_INTERACTION_META_P9P10],
  ['v10_interaction_metadata_nh_u2_u4.js',()=>window.V10_INTERACTION_META_NH_U2U4],
  ['v10_interaction_metadata_nh_u5_u7.js',()=>window.V10_INTERACTION_META_NH_U5U7],
  ['v10_interaction_metadata_nh_u8_u10.js',()=>window.V10_INTERACTION_META_NH_U8U10],
  ['v10_semantic_runtime_repairs_001_010.js',()=>window.V10_INTERACTION_META_SEMANTIC_REPAIRS],
  ['v10_semantic_runtime_repairs_011_020.js',()=>window.V10_INTERACTION_META_SEMANTIC_REPAIRS_011_020],
  ['v10_semantic_runtime_repairs_021_030.js',()=>window.V10_INTERACTION_META_SEMANTIC_REPAIRS_021_030],
  ['v10_semantic_runtime_repairs_031_040.js',()=>window.V10_INTERACTION_META_SEMANTIC_REPAIRS_031_040],
  ['v10_semantic_runtime_repairs_041_050.js',()=>window.V10_INTERACTION_META_SEMANTIC_REPAIRS_041_050],
  ['v10_semantic_runtime_repairs_051_060.js',()=>window.V10_INTERACTION_META_SEMANTIC_REPAIRS_051_060],
  ['v10_semantic_runtime_repairs_061_070.js',()=>window.V10_INTERACTION_META_SEMANTIC_REPAIRS_061_070],
  ['v10_semantic_runtime_repairs_071_080.js',()=>window.V10_INTERACTION_META_SEMANTIC_REPAIRS_071_080],
  ['v10_semantic_runtime_repairs_081_090.js',()=>window.V10_INTERACTION_META_SEMANTIC_REPAIRS_081_090],
  ['v10_semantic_runtime_repairs_091_100_alias.js',()=>({})],
  ['v10_semantic_runtime_repairs_091_100.js',()=>window.V10_INTERACTION_META_SEMANTIC_REPAIRS_091_100],
  ['v10_semantic_runtime_repairs_101_110.js',()=>window.V10_INTERACTION_META_SEMANTIC_REPAIRS_101_110],
  ['v10_semantic_runtime_repairs_111_120.js',()=>window.V10_INTERACTION_META_SEMANTIC_REPAIRS_111_120],
  ['v10_semantic_runtime_repairs_121_130.js',()=>window.V10_INTERACTION_META_SEMANTIC_REPAIRS_121_130],
  ['v10_semantic_runtime_repairs_131_140.js',()=>window.V10_INTERACTION_META_SEMANTIC_REPAIRS_131_140],
  ['v10_semantic_runtime_repairs_141_150.js',()=>window.V10_INTERACTION_META_SEMANTIC_REPAIRS_141_150],
  ['v10_semantic_runtime_repairs_151_160.js',()=>window.V10_INTERACTION_META_SEMANTIC_REPAIRS_151_160],
  ['v10_semantic_runtime_repairs_161_168.js',()=>window.V10_INTERACTION_META_SEMANTIC_REPAIRS_161_168]
 ];
 let i=0;
 const next=()=>{
  if(i>=chunks.length){window.V10_INTERACTION_META=target;window.V10_RUNTIME_LOAD_PROGRESS='complete';if(typeof window.render==='function')window.render();return;}
  const [src,getObj]=chunks[i++];
  load(src,()=>{try{const obj=getObj()||{};window.V10_INTERACTION_META=target;mergeObj(obj)}catch(e){window.V10_RUNTIME_LOAD_ERROR='merge:'+src+':'+String(e&&e.message||e)}next();});
 };
 next();
})();