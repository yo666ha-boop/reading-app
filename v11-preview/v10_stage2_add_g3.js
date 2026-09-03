const fs=require('fs');

function mustReplace(src, from, to, label){
  const count=src.split(from).length-1;
  if(count!==1) throw new Error(`${label}: expected exactly 1 target, got ${count}`);
  return src.replace(from,to);
}

let html=fs.readFileSync('v10_stage2.html','utf8');
if(!html.includes('v10_data_sunshine_g3_program7.js')){
  html=mustReplace(
    html,
    '<select id="grade"><option value="1">中1</option><option value="2">中2</option></select>',
    '<select id="grade"><option value="1">中1</option><option value="2">中2</option><option value="3">中3</option></select>',
    'grade selector'
  );

  const g3Data=`<script src="v10_data_sunshine_g3_program1.js"></script><script src="v10_data_sunshine_g3_program1_fix.js"></script><script src="v10_data_sunshine_g3_program2.js"></script><script src="v10_data_sunshine_g3_program2_fix.js"></script><script src="v10_data_sunshine_g3_program3.js"></script><script src="v10_data_sunshine_g3_program3_fix.js"></script><script src="v10_data_sunshine_g3_program3_fix2.js"></script><script src="v10_data_sunshine_g3_program3_fix3.js"></script><script src="v10_data_sunshine_g3_program4.js"></script><script src="v10_data_sunshine_g3_program4_fix.js"></script><script src="v10_data_sunshine_g3_program5.js"></script><script src="v10_data_sunshine_g3_program5_fix.js"></script><script src="v10_data_sunshine_g3_program6.js"></script><script src="v10_data_sunshine_g3_program6_fix.js"></script><script src="v10_data_sunshine_g3_program7.js"></script><script src="v10_data_sunshine_g3_program7_fix.js"></script>\n<script src="v10_data_newhorizon_g3_unit0_1.js"></script><script src="v10_data_newhorizon_g3_unit0_1_fix.js"></script><script src="v10_data_newhorizon_g3_unit0_1_fix2.js"></script><script src="v10_data_newhorizon_g3_unit2.js"></script><script src="v10_data_newhorizon_g3_unit2_fix.js"></script><script src="v10_data_newhorizon_g3_unit2_fix2.js"></script><script src="v10_data_newhorizon_g3_unit2_fix3.js"></script><script src="v10_data_newhorizon_g3_unit2_fix4.js"></script><script src="v10_data_newhorizon_g3_unit3.js"></script><script src="v10_data_newhorizon_g3_unit3_fix.js"></script><script src="v10_data_newhorizon_g3_unit4.js"></script><script src="v10_data_newhorizon_g3_unit4_fix.js"></script><script src="v10_data_newhorizon_g3_unit5.js"></script><script src="v10_data_newhorizon_g3_unit5_fix.js"></script><script src="v10_data_newhorizon_g3_unit6.js"></script><script src="v10_data_newhorizon_g3_unit6_fix.js"></script><script src="v10_data_newhorizon_g3_unit6_fix2.js"></script>\n\n`;
  html=mustReplace(html,'<script src="v10_interaction_metadata.js"></script>',g3Data+'<script src="v10_interaction_metadata.js"></script>','G3 data insertion point');

  const g3Meta=`<script src="v10_interaction_metadata_sun_g3_p1.js"></script><script src="v10_interaction_metadata_sun_g3_p2.js"></script><script src="v10_interaction_metadata_sun_g3_p3.js"></script><script src="v10_interaction_metadata_sun_g3_p4.js"></script><script src="v10_interaction_metadata_sun_g3_p5.js"></script><script src="v10_interaction_metadata_sun_g3_p6.js"></script><script src="v10_interaction_metadata_sun_g3_p7.js"></script>\n<script src="v10_interaction_metadata_nh_g3_u0_u1.js"></script><script src="v10_interaction_metadata_nh_g3_u2.js"></script><script src="v10_interaction_metadata_nh_g3_u2_fix.js"></script><script src="v10_interaction_metadata_nh_g3_u3.js"></script><script src="v10_interaction_metadata_nh_g3_u4.js"></script><script src="v10_interaction_metadata_nh_g3_u5.js"></script><script src="v10_interaction_metadata_nh_g3_u6.js"></script><script src="v10_interaction_metadata_nh_g3_u6_fix.js"></script>\n`;
  html=mustReplace(html,'<script>\nwindow.V10_INTERACTION_META=window.V10_INTERACTION_META||{};</script>','<script>\nwindow.V10_INTERACTION_META=window.V10_INTERACTION_META||{};</script>','noop guard');
  // The prior replacement is a guard only; actual insertion is before the first assignment script.
  const metaAnchor='<script>\nwindow.V10_INTERACTION_META=window.V10_INTERACTION_META||{};\nObject.assign(window.V10_INTERACTION_META,';
  html=mustReplace(html,metaAnchor,g3Meta+metaAnchor,'G3 metadata insertion point');

  const assignTail=' window.V10_INTERACTION_META_G2_NH_U7||{}\n);';
  const assignG3=` window.V10_INTERACTION_META_G2_NH_U7||{},\n window.V10_INTERACTION_META_G3_SS_P1||{},\n window.V10_INTERACTION_META_G3_SS_P2||{},\n window.V10_INTERACTION_META_G3_SS_P3||{},\n window.V10_INTERACTION_META_G3_SS_P4||{},\n window.V10_INTERACTION_META_G3_SS_P5||{},\n window.V10_INTERACTION_META_G3_SS_P6||{},\n window.V10_INTERACTION_META_G3_SS_P7||{},\n window.V10_INTERACTION_META_G3_NH_U01||{},\n window.V10_INTERACTION_META_G3_NH_U2||{},\n window.V10_INTERACTION_META_G3_NH_U3||{},\n window.V10_INTERACTION_META_G3_NH_U4||{},\n window.V10_INTERACTION_META_G3_NH_U5||{},\n window.V10_INTERACTION_META_G3_NH_U6||{}\n);`;
  html=mustReplace(html,assignTail,assignG3,'G3 metadata assignment');

  const dsTail=" '2':{'サンシャイン':window.V10_PASSAGES_G2_SS||{},'ニューホライズン':window.V10_PASSAGES_G2_NH||{}}\n};";
  const dsG3=" '2':{'サンシャイン':window.V10_PASSAGES_G2_SS||{},'ニューホライズン':window.V10_PASSAGES_G2_NH||{}},\n '3':{'サンシャイン':window.V10_PASSAGES_G3_SS||{},'ニューホライズン':window.V10_PASSAGES_G3_NH||{}}\n};";
  html=mustReplace(html,dsTail,dsG3,'G3 DATASETS');
  fs.writeFileSync('v10_stage2.html',html);
  console.log('Integrated G3 into v10_stage2.html');
}else{
  console.log('v10_stage2.html already contains G3 data scripts');
}

let test=fs.readFileSync('v10_stage2_dom_test.js','utf8');
if(!test.includes('// G3 full-core integration')){
  test=mustReplace(test,"assert(vals(grade).join(',')==='1,2','grade options must be G1,G2');","assert(vals(grade).join(',')==='1,2,3','grade options must be G1,G2,G3');",'DOM grade assertion');
  const marker='// Switching back must restore G1 data, not leak G2';
  const block=`// G3 full-core integration\nchange(w,tb,'サンシャイン');change(w,grade,'3');assert(vals(major).includes('PROGRAM 7'),'G3 Sunshine PROGRAM 7 missing from major selector');change(w,major,'PROGRAM 7');assert(vals(section).join(',')==='PROGRAM 7-1,PROGRAM 7-2,PROGRAM 7-3','G3 Sunshine PROGRAM 7 canonical three parts changed');change(w,section,'PROGRAM 7-3');change(w,pattern,'report');assert(d.getElementById('passage').textContent.includes('Robots and Loneliness'),'G3 Sunshine PROGRAM 7-3 failed to render');assert(d.getElementById('passage').textContent.includes('中3'),'G3 Sunshine rendered wrong grade');assert(!alt.disabled,'G3 Sunshine B set should be enabled');const g3ssa=d.getElementById('questions').textContent;alt.click();const g3ssb=d.getElementById('questions').textContent;assert(g3ssa!==g3ssb&&g3ssb.includes('問題セット B'),'G3 Sunshine B set switch failed');assert(d.getElementById('gate').textContent.includes('品質ゲート通過'),'G3 Sunshine release gate did not pass');\nchange(w,tb,'ニューホライズン');assert(vals(major).includes('Unit 6'),'G3 New Horizon Unit 6 missing from major selector');change(w,major,'Unit 6');assert(vals(section).join(',')==='Unit 6-1,Unit 6-2,Unit 6-3,Unit 6-4','G3 NH Unit 6 canonical four sections changed');change(w,section,'Unit 6-4');change(w,pattern,'report');assert(d.getElementById('passage').textContent.includes('中3'),'G3 NH rendered wrong grade');assert(d.getElementById('passage').textContent.trim(),'G3 NH Unit 6-4 failed to render');assert(!alt.disabled,'G3 NH Unit6 B set should be enabled');const g3nha=d.getElementById('questions').textContent;alt.click();const g3nhb=d.getElementById('questions').textContent;assert(g3nha!==g3nhb&&g3nhb.includes('問題セット B'),'G3 NH B set switch failed');assert(d.getElementById('gate').textContent.includes('品質ゲート通過'),'G3 NH release gate did not pass');\n\n`;
  test=mustReplace(test,marker,block+marker,'G3 DOM block insertion');
  test=mustReplace(test,"console.log('STAGE2 DOM PASS: G1/G2 grade switching, textbook > major > minor selection, genre fallback rules, A/B question switching, Unit7 release gate, and print control behave correctly.');","console.log('STAGE2 DOM PASS: G1/G2/G3 grade switching, textbook > major > minor selection, genre fallback rules, A/B question switching, release gates, and print control behave correctly.');",'DOM success message');
  fs.writeFileSync('v10_stage2_dom_test.js',test);
  console.log('Extended v10_stage2_dom_test.js for G3');
}else{
  console.log('v10_stage2_dom_test.js already contains G3 checks');
}
