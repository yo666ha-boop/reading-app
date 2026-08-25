const {JSDOM,VirtualConsole}=require('jsdom');

function values(sel){return [...sel.options].map(o=>o.value);}
function assert(cond,msg){if(!cond)throw new Error(msg);}
function change(win,el,value){el.value=value;el.dispatchEvent(new win.Event('change',{bubbles:true}));}

(async()=>{
 const browserErrors=[];
 const vc=new VirtualConsole();
 vc.on('jsdomError',e=>browserErrors.push(String(e&&e.message||e)));
 vc.on('error',e=>browserErrors.push(String(e)));
 const dom=await JSDOM.fromFile('v10_stage1.html',{
  runScripts:'dangerously',resources:'usable',pretendToBeVisual:true,virtualConsole:vc
 });
 await new Promise((resolve,reject)=>{
  const timer=setTimeout(()=>reject(new Error('DOM load timeout')),15000);
  dom.window.addEventListener('load',()=>{clearTimeout(timer);setTimeout(resolve,50);},{once:true});
 });
 const {window}=dom,d=window.document;
 const textbook=d.getElementById('textbook');
 const grade=d.getElementById('grade');
 const major=d.getElementById('major');
 const section=d.getElementById('section');
 assert(textbook&&grade&&major&&section,'selector hierarchy missing');
 assert(!d.getElementById('period'),'period/month selector must not exist');

 assert(textbook.value==='サンシャイン','initial textbook should be Sunshine');
 let majors=values(major);
 assert(majors.includes('Get Ready'),'Sunshine Get Ready major missing');
 assert(majors.includes('PROGRAM 1'),'Sunshine PROGRAM 1 major missing');
 assert(majors.includes('PROGRAM 10'),'Sunshine PROGRAM 10 major missing');
 assert(majors.includes('Step 6 / Our Project 3 / Power-Up 6'),'Sunshine final Step 6 major missing');
 change(window,major,'Get Ready');
 assert(JSON.stringify(values(section))===JSON.stringify(['Get Ready 2','Get Ready 3','Get Ready 4','Get Ready 5','Get Ready 6']),'Sunshine Get Ready minor order mismatch');
 change(window,major,'PROGRAM 10');
 assert(JSON.stringify(values(section))===JSON.stringify(['PROGRAM 10-1','PROGRAM 10-2','PROGRAM 10-3','PROGRAM 10-4']),'Sunshine PROGRAM 10 minor order mismatch');
 change(window,section,'PROGRAM 10-4');
 assert(d.getElementById('passage').textContent.trim().length>0,'Sunshine passage did not render');
 assert(d.getElementById('gate').textContent.includes('品質ゲート通過'),'Sunshine release gate not shown');

 change(window,textbook,'ニューホライズン');
 majors=values(major);
 assert(majors[0]==='Unit 0','New Horizon Unit 0 should be first major');
 assert(majors.includes('Unit 1')&&majors.includes('Unit 10'),'New Horizon Unit major range incomplete');
 change(window,major,'Unit 10');
 assert(JSON.stringify(values(section))===JSON.stringify(['Unit 10-1','Unit 10-2','Unit 10-3']),'New Horizon Unit 10 minor order mismatch');
 change(window,section,'Unit 10-3');
 assert(d.getElementById('passage').textContent.trim().length>0,'New Horizon passage did not render');
 assert(d.getElementById('answers').textContent.includes('根拠英文'),'answer evidence block missing');
 assert(d.getElementById('audit').textContent.includes('月フィルタ：なし'),'audit UI does not confirm removed month filter');
 assert(d.getElementById('masterCount').textContent.includes('現在合計：69本'),'UI total master count is not 69');

 const serious=browserErrors.filter(x=>!/Could not load link/i.test(x));
 assert(serious.length===0,`browser/jsdom errors: ${serious.join(' | ')}`);
 console.log('DOM PASS: textbook > grade > major > minor selectors render and switch correctly; passage, answers, audit, and release gate render without browser errors.');
 process.exit(0);
})().catch(e=>{console.error(`DOM FAIL: ${e.stack||e}`);process.exit(1);});
