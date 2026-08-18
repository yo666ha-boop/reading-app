window.V10_INTERACTION_META=window.V10_INTERACTION_META||{};
(function(){
 if(typeof document==='undefined')return;
 const target=window.V10_INTERACTION_META;
 const load=(src,done)=>{const s=document.createElement('script');s.src=src;s.onload=done;document.head.appendChild(s)};
 load('v10_interaction_metadata_initial.js',()=>{
  const initial=window.V10_INTERACTION_META||{};window.V10_INTERACTION_META=target;Object.assign(target,initial);
  load('v10_interaction_metadata_sun_p1_p3.js',()=>{
   Object.assign(target,window.V10_INTERACTION_META_P1P3||{});window.V10_INTERACTION_META=target;
   load('v10_interaction_metadata_sun_p4_p6.js',()=>{
    Object.assign(target,window.V10_INTERACTION_META_P4P6||{});window.V10_INTERACTION_META=target;
    if(typeof window.render==='function')window.render();
   });
  });
 });
})();
