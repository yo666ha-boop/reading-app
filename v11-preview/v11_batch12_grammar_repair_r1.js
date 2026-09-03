'use strict';
const replacements=[
["Mei took the umbrella to the school office and told Ken where it was.","Mei took the umbrella to the school office and contacted Ken about its location."],
["Thursday's cards would be collected after lunch, but Friday's box was for the next day.","The librarian would collect Thursday's cards after lunch, but Friday's box was for the next day."],
["Aya's class had to meet in the hall at ten o'clock.","The class schedule said, 'Meet in the hall at ten o'clock.'"],
["Riku followed it and reached the old music room, but the door was locked.","Riku followed it and reached the old music room, but the locked door did not open."],
["The name at the bottom was partly covered, but she could read the first letter, M.","The name at the bottom was partly covered, but she read the first letter, M."],
["The bus number and location were unchanged.","The bus kept the same number and stopped at the same place."],
["Mio fed the hamster and checked that the cage door was closed.","Mio fed the hamster and checked the closed cage door."],
["They decided that the person who finished each job would mark the chart at once.","They decided on a rule: each student would mark the chart at once after finishing a job."],
["Toma took the scarf to the office and mentioned where and when he had found it.","Toma took the scarf to the office and explained the place and time."],
["In the library, Emi noticed that the return cart was parked in front of a low shelf.","In the library, Emi noticed the return cart in front of a low shelf."],
["A younger student tried to reach a book but could not get close enough.","A younger student tried to reach a book but was not close enough."],
["The younger student could reach the book, and visitors could still move safely through the library.","The younger student reached the book, and visitors still moved safely through the library."],
["Emi first moved the cart into the aisle, but then people had to walk around it.","Emi first moved the cart into the aisle, and that made people walk around it."],
["She asked the librarian where it should go.","She asked the librarian about the right place for it."],
["Visitors to the school garden were supposed to follow a sign toward the flower beds.","A sign guided visitors to the school garden toward the flower beds."],
["Hana also added a note to the garden check sheet so the sign would be checked after strong wind.","Hana also wrote 'Check the sign after strong wind' on the garden check sheet."],
["He asked Yuta to check them.","He showed both shoes to Yuta and asked, 'Are these yours?'"],
["Cup A was supposed to stay by the bright south window, and Cup B by the darker north window.","Cup A belonged by the bright south window, and Cup B by the darker north window."],
["Because the mistake was found early, the class could record the mix-up and continue the observation without assuming that Cup B had stayed by the north window all day.","The class found the mistake early, recorded the mix-up, and continued the observation without assuming that Cup B stayed by the north window all day."],
["He did not bring a new chair immediately because one might simply have been moved.","He did not bring a new chair immediately because he first thought someone moved one."],
["No student waited more than four minutes, and both groups still had enough time to drink.","No student waited more than four minutes, and both groups still had time to drink."],
["Kaho was ready to report that result, but she noticed that almost every response came from students who already used the library.","Kaho was ready to report that result, but she noticed that almost every response came from regular library users."],
["Their printed route used the east sidewalk because it was the shortest path.","Their printed route used the east sidewalk, the shortest path."],
["The club added a minimum number beside each item and asked the student who opened the last package to mark it.","The club added a minimum number beside each item and wrote a rule: 'If you open the last package, mark it.'"],
["Haru did not want to choose the date that appeared in the first interview simply because it had been recorded earlier.","Haru did not want to choose the first interview's date only because of the recording order."],
["The decision was based not only on attendance but also on whether the revised procedure made responsibilities and limits clearer.","The decision considered attendance and whether the revised procedure made responsibilities and limits clearer."]
];
function replaceString(s,counts){let out=s;for(let i=0;i<replacements.length;i++){const [a,b]=replacements[i];if(out.includes(a)){const n=out.split(a).length-1;out=out.split(a).join(b);counts[i]+=n;}}return out;}
function walk(x,counts){if(typeof x==='string')return replaceString(x,counts);if(Array.isArray(x))return x.map(v=>walk(v,counts));if(x&&typeof x==='object'){for(const k of Object.keys(x))x[k]=walk(x[k],counts);return x;}return x;}
module.exports=function repairGrammar(candidate){const counts=Array(replacements.length).fill(0);walk(candidate,counts);const missing=[];for(let i=0;i<counts.length;i++)if(counts[i]===0)missing.push(replacements[i][0]);if(missing.length)throw new Error('Batch12 grammar repair source missing: '+JSON.stringify(missing));for(const p of candidate.passages||[]){p.wordCount=(String(p.body||'').match(/[A-Za-z]+(?:'[A-Za-z]+)*/g)||[]).length;p.grammarRepair='B12_GRAMMAR_REPAIR_R1_HUMAN_SEMANTIC_PRESERVED';}
candidate.grammarRepair={version:'R1',mappingCount:replacements.length,totalStringReplacements:counts.reduce((a,b)=>a+b,0),sourceHitCounts:counts,registered:false};return candidate;};
module.exports.replacements=replacements;
