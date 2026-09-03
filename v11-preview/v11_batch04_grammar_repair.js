(function repairV11Batch04Grammar(){
'use strict';
const ps=[...(window.V11_BATCH04_G1_PASSAGES||[]),...(window.V11_BATCH04_G2_PASSAGES||[]),...(window.V11_BATCH04_G3_PASSAGES||[])];
if(ps.length!==50)throw new Error('Batch04 50 passages missing before grammar repair');
const repl={
"My cousin said we should check before we got on the bus.":"My cousin said, “Check the bus before we get on.”",
"Writing the whole name was better than trusting a name that only sounded familiar.":"Writing the whole name was a good choice. A familiar sound was not enough.",
"I first gave her a long explanation in the hall.":"I first gave a long explanation to her in the hall.",
"I saw that my words were not easy to remember.":"I saw that my words were difficult. She did not remember them easily.",
"My mother asked me to get one kind of noodles at a store.":"My mother said, “Please get one kind of noodles at a store.”",
"My mother checked it when I got home.":"I got home, and my mother checked it.",
"I was happy to read it, but I did not write the return date anywhere.":"I read it happily, but I did not write the return date anywhere.",
"My friend asked if I was still reading the book.":"My friend asked, “Are you still reading the book?”",
"The sky was gray, but it was not raining when we left.":"We left under a gray sky, but it was not raining.",
"Waiting for a short time was better than running through heavy rain.":"We waited for a short time. Running through heavy rain was not a good idea.",
"I explained the next rule only when we needed it.":"We needed the next rule, so I explained it then.",
"My uncle called me while I was finishing my homework.":"My uncle called me during my homework.",
"Just then, my mother asked me to help carry something.":"Just then, my mother said, “Please help me carry this.”",
"He said it was fine and asked me to call again later.":"He said it was fine and said, “Call again later.”",
"I told my uncle that I could not talk for long.":"I told my uncle, “I do not have much time to talk.”",
"A clear time made an interrupted call easy to finish later.":"A clear time helped us finish an interrupted call later.",
"He needed the correct day because he wanted to come.":"He wanted to come, so he needed the correct day.",
"Checking one calendar was better than giving a fast answer from memory.":"I checked one calendar. A fast answer from memory was not enough.",
"Showing the destination and the price in order made our help easy to follow.":"We showed the destination and the price in order. People followed our help easily.",
"I told my friend that I wanted number three.":"I told my friend, “I want number three.”",
"When we finished, one cleaning tool was missing.":"We finished, and one cleaning tool was missing.",
"We could not find it there.":"We did not find it there.",
"The list showed where each tool should go.":"The list showed the place for each tool.",
"Changing the place solved the problem faster than repeating the same photo.":"Changing the place solved the problem quickly. Repeating the same photo did not help.",
"When we arrived, another family was already using it.":"We arrived and saw another family already using it.",
"My little brother looked disappointed because he liked that place.":"My little brother liked that place, so he looked disappointed.",
"My mother asked me to leave it in the family room.":"My mother said, “Please leave it in the family room.”",
"The name on the new package was small and hard to see.":"The name on the new package was small, so I did not see it easily.",
"A large clear name made three similar boxes easy to tell apart.":"A large clear name helped us tell the three similar boxes apart.",
"When he came home, he found his box immediately.":"He came home and found his box immediately.",
"One student wanted to send the first file because it appeared at the top of the folder.":"The first file appeared at the top of the folder, so one student wanted to send it.",
"Our captain asked us to list the jobs that still had to be covered.":"Our captain said, “List the jobs that are still open.”",
"We kept one small picture because it helped people notice the poster.":"The small picture helped people notice the poster, so we kept it.",
"We could have skipped the exhibit, but it was important for our topic.":"We almost skipped the exhibit, but it was important for our topic.",
"Reading the captions carefully let us continue without pretending that we had heard the guide.":"Reading the captions carefully helped us continue without pretending that we heard the guide.",
"The teacher later asked us to compare our notes with the museum website at school.":"The teacher later said, “Compare your notes with the museum website at school.”",
"We usually used the same wide road because it was easy to remember.":"We usually used the same wide road. We remembered it easily.",
"We chose that street and rode slowly because it was new to us.":"The street was new to us, so we chose it and rode slowly.",
"Our teacher asked us to think about what we could still observe from inside.":"Our teacher said, “Think about things you can still observe from inside.”",
"The word “attached” made me look below the message box.":"I saw the word “attached” and looked below the message box.",
"A ten-second check prevented an email that would have asked my teacher to read a file that was not there.":"A ten-second check stopped a wrong email to my teacher. The file was not there.",
"Then our teacher asked whether someone could easily answer “no” after reading those words.":"Then our teacher asked, “Can someone easily answer ‘no’ after reading those words?”",
"We learned that a survey should collect opinions instead of telling people which opinion to choose.":"We learned an important survey rule: collect opinions and do not tell people which opinion to choose.",
"Our teacher asked me to explain one part of our school life in simple English.":"Our teacher said, “Explain one part of our school life in simple English.”",
"Then I imagined that the student might not understand one of my words.":"Then I thought, “Maybe the student does not understand one of my words.”",
"Because we had checked the update date, we could explain the source clearly.":"We checked the update date, so we explained the source clearly.",
"The experience taught us that information can look convincing even when its date makes it less useful.":"From the experience, we learned an important point: information can look convincing, but an old date reduces its value.",
"I knew the answer because I had collected the data, but the graph itself did not show it.":"I collected the data, so I knew the answer, but the graph itself did not show it.",
"I did not ask “why” after every sentence because that would sound unnatural.":"I did not ask “why” after every sentence. Too many questions sound unnatural.",
"Then we asked whether they could send the two selected photos by the end of the day.":"Then we asked, “Can you send the two selected photos by the end of the day?”"
};
function slash(en){return String(en).replace(/, /g,', / ').replace(/\b(and|but|because|so|before|after|until|then|when|while|although)\b/gi,'/ $1');}
let changed=0;
for(const p of ps){
 for(let i=0;i<(p.sentences||[]).length;i++){
   const old=p.sentences[i]; const neu=repl[old]; if(!neu)continue;
   p.sentences[i]=neu; if(p.slashRows&&p.slashRows[i])p.slashRows[i].en=slash(neu); changed++;
 }
 p.wordCount=(p.sentences.join(' ').match(/[A-Za-z]+(?:['’][A-Za-z]+)?/g)||[]).length;
 p.auditNote=(p.auditNote||'')+' Batch04 grammar repair applied to chronology-unresolved constructions.';
}
window.V11_BATCH04_GRAMMAR_REPAIR_STATE={version:'20260828-pass1',changed,registered:false,questionsPending:true,translationRecheckPending:true};
})();