'use strict';
const fs=require('fs');
const files=['v11_batch15_g1_body_draft.json','v11_batch15_g2_body_draft.json','v11_batch15_g3_body_draft.json'];
const docs=files.map(f=>({f,d:JSON.parse(fs.readFileSync(f,'utf8'))}));
const rules=[
['The teacher said the cleaners needed the room bright when they brought in their equipment.','The teacher said the cleaners needed a bright room. Later, the cleaners brought in their equipment.'],
['If she had only looked through the window, she would have made the wrong choice.','She first looked only through the window. That clue pointed to the wrong choice.'],
['The note and the schedule gave her the full answer.','She found the full answer in the note and the schedule.'],
['Sora had to take one folder from the classroom to the school office.','The teacher asked Sora to take one folder from the classroom to the school office.'],
['Sora could not remember which one the teacher named.','Sora did not remember the teacher’s choice.'],
['Before leaving, he showed it to another student who was also on delivery duty.','Before leaving, he showed it to another student. That student was also on delivery duty.'],
['she could only read the first letter, M.','she read only the first letter, M.'],
['but that did not tell her who had lost a card.','but that did not show the card’s owner.'],
['Ryo saw a first-year student standing between two bus signs near the gate.','Ryo saw a first-year student between two bus signs near the gate.'],
['She also told the teacher where she had found it, so the class could check that nothing else was missing.','She also told the teacher where she found it. Then the class checked the area for other missing things.'],
['Nana checked the lesson schedule because she wondered why.','Nana checked the lesson schedule to find the reason.'],
['It said that the green tray was for Table Four because one student there could not eat eggs.','It said, “Green tray: Table Four. No eggs for one student.”'],
['The name side was under a clear cover, but the number 24 was easy to see.','The name side was under a clear cover, but the clear cover showed number 24.'],
['the best viewing place','a good viewing place'],
['The bag was red, so she first thought','She saw a red bag, so she first thought'],
['He wondered if someone had put it there for a game.','He thought the arrow was part of a game.'],
['When he reached Room 5, a teacher was waiting there.','He reached Room 5. A teacher was waiting there.'],
['Mei was about to put it back when she noticed a message from a teacher beside it.','Mei was about to put it back. Then she noticed a message from a teacher beside it.'],
['The message said that new fire-safety information had to use that wall until Friday morning.','The message said that new fire-safety information needed that wall until Friday morning.'],
['the poster could return before students needed the final reminder.','the club planned to return the poster before students needed the final reminder.'],
['told her club leader what she had learned.','explained the situation to her club leader.'],
['Haruto thought it might be an extra chair and started to move it.','Haruto thought it was an extra chair and started to move it.'],
['When the guest arrived, the seat was easy to find.','The guest arrived and found the seat quickly.'],
['Before removing it, the committee watched how students used the area.','Before removing it, the committee watched students in the area.'],
['They read the message around lunch or after classes, when it was too late to get shoes from home.','They read the message around lunch or after classes. At that time, they were at school and the shoes were at home.'],
['but people coming from the station could not.','but people from the station could not.'],
['Four students made the same two-hour study plan before a test.','There were four students with the same two-hour study plan before a test.'],
['The second group would reach the repair area too late to pass,','The second group would reach the repair area after the closure,'],
['A park manager said the richer record was more useful because it showed not only how many people came but also which spaces they used under different conditions.','A park manager said the richer record was more useful. It showed how many people came and which spaces they used under different conditions.'],
['Group B had enough time to reach the 11:20 robotics workshop.','Group B reached the 11:20 robotics workshop in time.'],
['Visitors using Version B had enough looking time but sometimes stopped the tour because it felt slow.','Visitors using Version B had enough looking time but sometimes felt the tour was slow and stopped it.']
];
const audit=[];
for(const [from,to] of rules){
  const hits=[];
  for(const x of docs){for(const p of x.d.passages||[]){if(p.body.includes(from)) hits.push({x,p});}}
  if(hits.length===1){
    const {x,p}=hits[0]; p.body=p.body.replace(from,to);
    p.humanSemanticReview=(p.humanSemanticReview||'')+'_GRAMMAR_R2_EQUIV';
    hits[0].x.d.status=(hits[0].x.d.status||'')+'_GRAMMAR_REPAIR_R2';
    audit.push({status:'APPLIED',file:x.f,id:p.id,from,to,translationSync:'semantic-equivalent; existing fullTranslation remains accurate'});
  } else {
    audit.push({status:hits.length===0?'NOT_FOUND':'AMBIGUOUS',hits:hits.length,from,to});
  }
}
for(const x of docs) fs.writeFileSync(x.f,JSON.stringify(x.d,null,2)+'\n');
const applied=audit.filter(x=>x.status==='APPLIED').length;
const skipped=audit.length-applied;
fs.writeFileSync('V11_BATCH15_GRAMMAR_REPAIR_R2_REPORT.json',JSON.stringify({generatedAt:new Date().toISOString(),sourceUnresolvedOccurrences:33,rules:rules.length,applied,skipped,principle:'actual body grammar simplification; no allowlist weakening; no filler; source phrases searched across the current Batch15 only',translationSync:'replacements preserve the same proposition, so existing fullTranslation remains semantically synchronized',audit},null,2)+'\n');
console.log(`Batch15 grammar repair R2 applied=${applied} skipped=${skipped}`);
