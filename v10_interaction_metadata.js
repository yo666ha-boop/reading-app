window.V10_INTERACTION_META=window.V10_INTERACTION_META||{};
(function(){
 if(typeof document==='undefined')return;
 const target=window.V10_INTERACTION_META;
 const load=(src,done)=>{const s=document.createElement('script');s.src=src;s.onload=done;document.head.appendChild(s)};
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
  ['v10_semantic_runtime_repairs_041_050.js',()=>window.V10_INTERACTION_META_SEMANTIC_REPAIRS_041_050]
 ];
 let i=0;
 const next=()=>{
  if(i>=chunks.length){window.V10_INTERACTION_META=target;if(typeof window.render==='function')window.render();return;}
  const [src,getObj]=chunks[i++];
  load(src,()=>{const obj=getObj()||{};window.V10_INTERACTION_META=target;Object.assign(target,obj);next();});
 };
 next();
})();