(function repairV11Batch05Grammar(){
'use strict';
const ps=[...(window.V11_BATCH05_G1_PASSAGES||[]),...(window.V11_BATCH05_G2_PASSAGES||[]),...(window.V11_BATCH05_G3_PASSAGES||[])];
if(ps.length!==50)throw new Error('Batch05 50 passages missing before grammar repair');
const repl={
"Nobody had to leave the new seats to look for her.":"Nobody left the new seats to look for her.",
"I almost took the first one because it looked like mine.":"It looked like mine, so I almost took the first one.",
"The next student could find the correct umbrella easily too.":"The next student found the correct umbrella easily too.",
"We did not notice the problem when we first came in.":"We first came in and did not notice the problem.",
"Everyone thought we still had time before practice should start.":"Everyone thought we still had time before the start of practice.",
"My brother saw me and asked me to check the food inside.":"My brother saw me and said, “Check the food inside.”",
"We laughed because I was holding his lunch box.":"I was holding his lunch box, so we laughed.",
"The next morning, we could tell the boxes apart at once.":"The next morning, we told the boxes apart at once.",
"I saw that three different places could cause a problem.":"I saw a problem with three different meeting places.",
"The large clock near the main gate was easy to see.":"We saw the large clock near the main gate easily.",
"Choosing one clear place was better than keeping three ideas.":"We chose one clear place and stopped using the other three ideas.",
"Rain started while I was walking home from school one day.":"One day, rain started during my walk home from school.",
"The homework inside the folder was still dry and easy to read.":"The homework inside the folder was still dry, and I read it easily.",
"The teacher told us to begin on page forty-two.":"The teacher said, “Begin on page forty-two.”",
"Everyone could see the mark when we returned after lunch.":"We returned after lunch, and everyone saw the mark.",
"I could not talk because our coach was calling everyone together.":"Our coach was calling everyone together, so I did not talk on the phone.",
"The message appeared when I looked at my phone again.":"I looked at my phone again and saw the message.",
"My father said we should check before going down.":"My father said, “Check the direction before we go down.”",
"Checking the final station name made the direction easy to choose.":"We checked the final station name and chose the direction easily.",
"Changing the old note clearly kept the schedule easy to understand.":"I changed the old note clearly, and I understood the schedule easily.",
"The place was pretty, but the photo could be from any school.":"The place was pretty, but the photo did not show our school clearly.",
"Our school name was written clearly above its entrance.":"Clear letters above the entrance showed our school name.",
"Most notebooks had a price tag on the shelf below them.":"Many notebooks had a price tag on the shelf below them.",
"The worker checked a list and told me the correct amount.":"The worker checked a list and said, “This is the correct amount.”",
"I wanted to check because it was already getting late.":"It was already getting late, so I wanted to check.",
"That number surprised me because we usually met on another floor.":"We usually met on another floor, so that number surprised me.",
"Two friends were ready to go upstairs without checking.":"Two friends started toward the upstairs rooms without checking.",
"I worried that we might put the wrong gift in a bag.":"I worried about putting the wrong gift in a bag.",
"A short list made three similar bags easy to prepare correctly.":"We used a short list and prepared the three similar bags correctly.",
"A teammate stopped me because it was actually his bottle.":"It was actually his bottle, so a teammate stopped me.",
"The bright mark was easy to see from a short distance.":"We saw the bright mark easily from a short distance.",
"There was no extra cardboard large enough to make a new one.":"There was no extra cardboard of the size we needed for a new one.",
"We asked a teacher whether we could use that wall safely.":"We asked a teacher, “Can we use that wall safely?”",
"Changing the place let us practice safely instead of losing the whole day.":"We changed the place and practiced safely instead of losing the whole day.",
"Two friends who arrived after me followed me to the same rack.":"Two friends arrived after me and followed me to the same rack.",
"More students used it during the rest of the week.":"The second rack became more popular during the rest of the week.",
"Visitors might know the event name and still walk the wrong way.":"Some visitors knew the event name but still walked the wrong way.",
"Our teacher asked us to read the temporary sign carefully first.":"Our teacher said, “Read the temporary sign carefully first.”",
"One question asked students whether they liked sports or other things.":"One question gave students two choices: sports and other things.",
"A student who liked music and art did not know which answer to choose.":"One student liked music and art and did not know which answer to choose.",
"Another member asked me to read every attachment name aloud first.":"Another member said, “Read every attachment name aloud first.”",
"I started to think the lock might be broken and looked for a teacher.":"I started to think the lock was broken and looked for a teacher.",
"The place made it easy to find people, but music was playing nearby.":"We found people easily there, but music was playing nearby.",
"Marking only the first-day places made a detailed map easier to use.":"We marked only the first-day places, and the detailed map became easier to use.",
"The number looked useful because it seemed to support our main argument.":"The number seemed to support our main argument, so it looked useful.",
"The revised graph made it easier for the audience to judge the change fairly.":"The revised graph helped the audience judge the change fairly.",
"Our group still planned to finish one day early so a small problem would not make us late.":"Our group still planned to finish one day early, so a small problem would not cause a delay.",
"Everyone liked the photos, and the rating made it seem like an easy choice.":"Everyone liked the photos, and the high rating suggested an easy choice.",
"After the fourth stop, one person asked whether there was a place to sit nearby.":"After the fourth stop, one person asked, “Is there a place to sit nearby?”"
};
function slash(en){return String(en).replace(/, /g,', / ').replace(/\b(and|but|because|so|before|after|until|then|when|while|although)\b/gi,'/ $1');}
let changed=0;
for(const p of ps){for(let i=0;i<(p.sentences||[]).length;i++){const old=p.sentences[i],neu=repl[old];if(!neu)continue;p.sentences[i]=neu;if(p.slashRows&&p.slashRows[i])p.slashRows[i].en=slash(neu);changed++;}p.wordCount=(p.sentences.join(' ').match(/[A-Za-z]+(?:['’][A-Za-z]+)?/g)||[]).length;p.questions=[];p.questionSetB=[];p.auditNote=(p.auditNote||'')+' Batch05 grammar repair applied; A/B cleared pending regeneration; JP translation sync pending.';}
window.V11_BATCH05_GRAMMAR_REPAIR_STATE={version:'20260828-pass1',changed,registered:false,questionsPending:true,translationRecheckPending:true};
})();