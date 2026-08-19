const fs=require('fs');
function edit(file, pairs){
  let s=fs.readFileSync(file,'utf8'), changed=false;
  for(const [oldv,newv] of pairs){
    if(s.includes(newv)) continue;
    if(!s.includes(oldv)) throw new Error(`${file}: target not found: ${oldv.slice(0,100)}`);
    s=s.replace(oldv,newv); changed=true;
  }
  if(changed){fs.writeFileSync(file,s);console.log('fixed '+file)}
}

// G1 NH: keep each reading passage substantial enough for the runtime gate.
edit('v10_semantic_runtime_repairs_041_050.js',[[
"sentences:['Basketball is my favorite sport.','I practice basketball in the afternoon.','My friend and I practice together.','We practice hard.','We want to win.','We like basketball very much.','Basketball is great.'],",
"sentences:['Basketball is my favorite sport.','I practice basketball in the afternoon.','My friend and I practice together.','We practice hard.','We want to win.','We like basketball very much.','We will practice again tomorrow.','Basketball is great.'],"
],[
"fullTranslation:'バスケットボールは私のいちばん好きなスポーツです。午後にバスケットボールを練習します。友達と私はいっしょに練習します。私たちは一生懸命練習します。私たちは勝ちたいです。私たちはバスケットボールがとても好きです。バスケットボールはすばらしいです。',",
"fullTranslation:'バスケットボールは私のいちばん好きなスポーツです。午後にバスケットボールを練習します。友達と私はいっしょに練習します。私たちは一生懸命練習します。私たちは勝ちたいです。私たちはバスケットボールがとても好きです。明日もまた練習します。バスケットボールはすばらしいです。',"
],[
"{en:'We like / basketball / very much.',jp:'私たちは好きです / バスケットボールが / とても'},{en:'Basketball is / great.',jp:'バスケットボールは〜です / すばらしい'}],",
"{en:'We like / basketball / very much.',jp:'私たちは好きです / バスケットボールが / とても'},{en:'We will practice / again / tomorrow.',jp:'私たちは練習します / また / 明日'},{en:'Basketball is / great.',jp:'バスケットボールは〜です / すばらしい'}],"
]]);

edit('v10_semantic_runtime_repairs_061_070.js',[[
"sentences:['During vacation, I went to a mountain.','I met my friend there.','We went snowboarding.','I like snowboarding very much.','After snowboarding, I went back home.','I want to go back to the mountain someday.','I like this vacation very much.'],",
"sentences:['During vacation, I went to a mountain.','I met my friend there.','We went snowboarding.','I like snowboarding very much.','The mountain was beautiful.','After snowboarding, I went back home.','I want to go back to the mountain someday.','I like this vacation very much.'],"
],[
"fullTranslation:'休みの間に山へ行きました。そこで友達に会いました。私たちはスノーボードをしに行きました。私はスノーボードがとても好きです。スノーボードのあと、家へ戻りました。いつかその山へまた行きたいです。この休みがとても好きです。',",
"fullTranslation:'休みの間に山へ行きました。そこで友達に会いました。私たちはスノーボードをしに行きました。私はスノーボードがとても好きです。その山は美しかったです。スノーボードのあと、家へ戻りました。いつかその山へまた行きたいです。この休みがとても好きです。',"
],[
"{en:'I like / snowboarding / very much.',jp:'私は好きです / スノーボードが / とても'},{en:'After snowboarding, / I went back / home.',jp:'スノーボードのあと / 私は戻りました / 家へ'}",
"{en:'I like / snowboarding / very much.',jp:'私は好きです / スノーボードが / とても'},{en:'The mountain was / beautiful.',jp:'その山は〜でした / 美しい'},{en:'After snowboarding, / I went back / home.',jp:'スノーボードのあと / 私は戻りました / 家へ'}"
]]);

// Evidence made of two sentences must use the audit delimiter so each sentence is checked verbatim.
edit('v10_semantic_runtime_repairs_071_080.js',[[
"evidence:'“Is it a deer footprint?” “Yes, it is.”'",
"evidence:'“Is it a deer footprint?” / “Yes, it is.”'"
]]);
edit('v10_semantic_runtime_repairs_081_090.js',[[
"evidence:'After the drill, we talk about the rule. We decide to remember it.'",
"evidence:'After the drill, we talk about the rule. / We decide to remember it.'"
]]);
edit('v10_semantic_runtime_repairs_091_100.js',[[
"evidence:'“I did not know recycled stationery was sold here.” “Me neither.”'",
"evidence:'“I did not know recycled stationery was sold here.” / “Me neither.”'"
],[
"evidence:'I am excited about dinner. My friend is excited, too.'",
"evidence:'I am excited about dinner. / My friend is excited, too.'"
],[
"evidence:'We are in a special area in Singapore. We see a large wall there.'",
"evidence:'We are in a special area in Singapore. / We see a large wall there.'"
]]);
edit('v10_semantic_runtime_repairs_101_110.js',[[
"evidence:'It found a pear. Then it found a plum.'",
"evidence:'It found a pear. / Then it found a plum.'"
],[
"evidence:'We must save water in this house. For that reason, I must take a short shower.'",
"evidence:'We must save water in this house. / For that reason, I must take a short shower.'"
]]);

// PROGRAM 3-2 must not consume PROGRAM 3-3's first-use word "training".
edit('v10_data_sunshine_g3_program3.js',[[
"'Training can sometimes be boring.'",
"'Practice can sometimes be boring.'"
],[
"トレーニングは時には退屈なこともあります。",
"練習は時には退屈なこともあります。"
],[
"{en:'Training can sometimes be / boring.',jp:'トレーニングは時には〜のことがあります / 退屈'}",
"{en:'Practice can sometimes be / boring.',jp:'練習は時には〜のことがあります / 退屈'}"
]]);

// Replace the simplified stage2 controller with grade-safe metadata selection, explicit
// unavailable-genre handling, B-set state, and the release gate expected by the app/tests.
{
 const file='v10_stage2.html'; let s=fs.readFileSync(file,'utf8');
 const start=s.indexOf("const DATASETS=");
 const end=s.indexOf("</script></body></html>",start);
 if(start<0||end<0)throw new Error('stage2 controller boundaries not found');
 const controller=`const DATASETS={'1':{'サンシャイン':window.V10_SUNSHINE_G1||{},'ニューホライズン':window.V10_NEWHORIZON_G1||{}},'2':{'サンシャイン':window.V10_PASSAGES_G2_SS||{},'ニューホライズン':window.V10_PASSAGES_G2_NH||{}},'3':{'サンシャイン':window.V10_PASSAGES_G3_SS||{},'ニューホライズン':window.V10_PASSAGES_G3_NH||{}}};
const META=window.V10_INTERACTION_META||{};let current=null,currentKey='',setIndex=0;const $=id=>document.getElementById(id);
function majorOf(s){let m=s.match(/^PROGRAM\\s+([0-9]+)/i);if(m)return 'PROGRAM '+m[1];m=s.match(/^Unit\\s+([0-9]+)/i);if(m)return 'Unit '+m[1];if(/^Get Ready/i.test(s))return 'Get Ready';return s.split(/\\s*[-/]\\s*/)[0]}
function entries(){return Object.entries(DATASETS[$('grade').value][$('textbook').value]||{})}
function metaFor(sec){const b=$('textbook').value,g=$('grade').value;return META[b+'|'+g+'|'+sec]||META[b+'|'+sec]||{}}
function refreshMajor(){const vals=[...new Set(entries().map(([k])=>majorOf(k)))];$('major').innerHTML=vals.map(v=>\`<option>\${v}</option>\`).join('');refreshSection()}
function refreshSection(){const m=$('major').value,ks=entries().map(([k])=>k).filter(k=>majorOf(k)===m);$('section').innerHTML=ks.map(k=>\`<option>\${k}</option>\`).join('');setIndex=0;render()}
function clearUnavailable(){current=null;currentKey='';$('passage').innerHTML='';$('slash').innerHTML='';$('questions').innerHTML='';$('answers').innerHTML='';$('audit').innerHTML='';$('altSetBtn').disabled=true;$('gate').innerHTML='<span class="warn">この範囲には選択した出題型の監修済み本文はまだありません。</span>';$('masterCount').textContent='該当本文 0件'}
function choose(){const ds=DATASETS[$('grade').value][$('textbook').value]||{},k=$('section').value,p=$('pattern').value;let keys=Object.keys(ds).filter(x=>majorOf(x)===$('major').value);const upto=keys.indexOf(k);if(upto>=0)keys=keys.slice(0,upto+1);if(p!=='all'){keys=keys.filter(x=>(metaFor(x).genre||'')===p);if(!keys.length){clearUnavailable();return null}}const key=keys[keys.length-1]||k;current=ds[key]||null;currentKey=current?key:'';return current}
function render(){const d=choose();if(!d)return;const meta=metaFor(currentKey),bReady=Array.isArray(meta.questionSetB)&&meta.questionSetB.length>=3;if(!bReady)setIndex=0;const useB=!!(setIndex%2&&bReady),qs=useB?meta.questionSetB:(d.questions||[]);$('altSetBtn').disabled=!bReady;$('passage').innerHTML=\`<h2>\${d.title}</h2><div class="meta">\${d.id} / \${d.textbook} / 中\${d.grade} / \${d.section}</div><div class="en">\${d.sentences.join(' ')}</div><h3>自然な全訳</h3><div>\${d.fullTranslation}</div>\`;$('slash').innerHTML='<h2>英文解釈</h2>'+d.slashRows.map(r=>\`<div class="slash"><div class="enline">\${r.en}</div><div class="jpline">\${r.jp}</div></div>\`).join('');$('questions').innerHTML=\`<h2>問題</h2><div class="meta">問題セット \${useB?'B':'A'}</div>\`+qs.map((x,i)=>\`<div class="q">\${i+1}. \${x.prompt.replace(/^\\d+\\.\\s*/,'')}</div>\`).join('');$('answers').innerHTML='<h2>解答・解説</h2>'+qs.map((x,i)=>\`<div class="q"><b>\${i+1}. \${x.answer}</b><div class="evidence">根拠英文：\${x.evidence}<br>根拠の意味：\${x.evidenceJp}<br>なぜ：\${x.reason}</div></div>\`).join('');$('audit').innerHTML=\`<h2>品質監査</h2><span class="badge">監修済み</span><div class="meta">本文文数=\${d.sentences.length} / スラッシュ行数=\${d.slashRows.length}<br>\${d.auditNote||''}</div>\`;$('gate').innerHTML=bReady?\`<span class="ok">品質ゲート通過</span>：\${currentKey}\`:\`<span class="warn">品質ゲート未通過</span>：\${currentKey}（B問題未同期）\`;$('masterCount').textContent=\`表示本文：\${d.textbook} 中\${d.grade} \${currentKey}\`}
['textbook','grade'].forEach(id=>$(id).addEventListener('change',refreshMajor));$('major').addEventListener('change',refreshSection);$('section').addEventListener('change',()=>{setIndex=0;render()});$('pattern').addEventListener('change',()=>{setIndex=0;render()});$('altSetBtn').addEventListener('click',()=>{if(!$('altSetBtn').disabled){setIndex++;render()}});$('printBtn').addEventListener('click',()=>window.print());document.querySelectorAll('.tabs button').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('.tabs button').forEach(x=>x.classList.remove('active'));b.classList.add('active');document.querySelectorAll('.tabpage').forEach(x=>x.classList.add('hidden'));$(b.dataset.tab).classList.remove('hidden')}));refreshMajor();
`;
 const oldController=s.slice(start,end);
 if(!oldController.includes('function choose()'))throw new Error('unexpected stage2 controller');
 s=s.slice(0,start)+controller+s.slice(end);fs.writeFileSync(file,s);console.log('fixed '+file);
}
