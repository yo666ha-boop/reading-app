(function repairV11Batch05GrammarR2(){
'use strict';
const ps=[...(window.V11_BATCH05_G1_PASSAGES||[]),...(window.V11_BATCH05_G2_PASSAGES||[]),...(window.V11_BATCH05_G3_PASSAGES||[])];
if(ps.length!==50)throw new Error('Batch05 50 passages missing before grammar repair r2');
const repl={
"When I reached home, the outside of the bag was wetter.":"I reached home, and the outside of the bag was wetter.",
"The visitor could see both her new friends and our school name.":"The visitor saw both her new friends and our school name."
};
function slash(en){return String(en).replace(/, /g,', / ').replace(/\b(and|but|because|so|before|after|until|then|when|while|although)\b/gi,'/ $1');}
let changed=0;
for(const p of ps){for(let i=0;i<(p.sentences||[]).length;i++){const old=p.sentences[i],neu=repl[old];if(!neu)continue;p.sentences[i]=neu;if(p.slashRows&&p.slashRows[i])p.slashRows[i].en=slash(neu);changed++;}p.wordCount=(p.sentences.join(' ').match(/[A-Za-z]+(?:['’][A-Za-z]+)?/g)||[]).length;p.questions=[];p.questionSetB=[];}
window.V11_BATCH05_GRAMMAR_REPAIR_R2_STATE={version:'20260828-r2',changed,registered:false,questionsPending:true,translationRecheckPending:true};
})();