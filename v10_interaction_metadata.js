window.V10_INTERACTION_META=window.V10_INTERACTION_META||{};
(function(){
 if(typeof document==='undefined')return;
 const target=window.V10_INTERACTION_META;
 const first=document.createElement('script');
 first.src='v10_interaction_metadata_initial.js';
 first.onload=()=>{
  const initial=window.V10_INTERACTION_META||{};
  window.V10_INTERACTION_META=target;
  Object.assign(target,initial);
  const second=document.createElement('script');
  second.src='v10_interaction_metadata_sun_p1_p3.js';
  second.onload=()=>{
   Object.assign(target,window.V10_INTERACTION_META_P1P3||{});
   window.V10_INTERACTION_META=target;
   if(typeof window.render==='function')window.render();
  };
  document.head.appendChild(second);
 };
 document.head.appendChild(first);
})();
