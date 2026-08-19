# V10 rewrite blueprint 071-080

Planning gate: decide the final English first. Existing section vocabulary/grammar is a ceiling, not a checklist. Keep one scene/topic and remove sentences that exist only to exercise a form.

## 071 Sunshine G2 PROGRAM 1-2 — Goodbye at Our Park
Decision: REWRITE. Make the speaker and friend explicit through one farewell scene and connect the park as a shared memory.

Final English:
1. Tomorrow, I will leave this town.
2. I am a bit worried.
3. My friend and I are at the local park.
4. This park is special to us.
5. We often talked here after school.
6. “Take care.”
7. “Thank you.”
8. I won’t forget my friends.
9. I won’t forget this town, either.
10. “I’ll text you.”
11. “You can text me, too.”
12. We will keep in touch.
13. I hope my friend will be fine.
14. I will visit this park again someday.

## 072 Sunshine G2 PROGRAM 1-3 — A New Friend on My First Day
Decision: REWRITE_MAJOR. Keep the overseas first day at school, one quiz worry, one short break, and one concrete social encounter.

Final English:
1. I am overseas now.
2. Today is my first day at my new school.
3. My class has a short quiz.
4. I am a bit worried.
5. “Why don’t you take a short break?”
6. A student near me smiles.
7. “Sounds nice. Thank you.”
8. We read our books during the break.
9. We talk about the quiz.
10. The student helps me.
11. Maybe I can make a new friend.
12. I won’t cry.
13. I’ll do my best.

## 073 Sunshine G2 PROGRAM 2-1 — Baseball for Children in the City
Decision: REWRITE_MAJOR. Define the project through a concrete activity and a named role instead of abstract slogans.

Final English:
1. I heard about a baseball project in Africa.
2. The project promotes baseball for children in a city.
3. A coach is very passionate about the project.
4. The coach teaches baseball after school.
5. Children practice together.
6. Games take place around the city.
7. The work is not easy.
8. Some days are difficult.
9. Many people root for the children.
10. I am interested in the project.
11. I hope the project will be successful.
12. Baseball can bring people together.

## 074 Sunshine G2 PROGRAM 2-2 — A Coach’s Program for Peace
Decision: REWRITE. Keep the university visit and let the coach explain what the program does; the speaker ends with a realistic hope to join.

Final English:
1. Today, I visit a university.
2. I meet a baseball coach there.
3. The coach works in a national program.
4. The program is about baseball and peace.
5. The coach tells me about the program.
6. People play baseball together in the program.
7. When people play together, they can be friends.
8. The coach believes sport can create peace.
9. I am interested in the program.
10. We talk about baseball and peace.
11. I want to join the program someday.
12. I hope many people will be interested in it.

## 075 Sunshine G2 PROGRAM 2-3 — Helping Each Other in One Game
Decision: REWRITE_MAJOR. Show cooperation in an actual game first, then derive the idea that sport can foster peace.

Final English:
1. Our baseball project has a game today.
2. Our goal is to play together and learn from the game.
3. The game is difficult.
4. One player has trouble.
5. We help each other.
6. A player hits a home run.
7. Everyone is happy.
8. After the game, we talk together.
9. We learn through the game.
10. In fact, sport can have a positive effect.
11. Sport can foster peace.
12. We believe in the power of sport.
13. I want to remember this idea.

## 076 Sunshine G2 PROGRAM 3-1 — Meeting My Friend at a Festival
Decision: LIGHT_REWRITE. Keep one festival outing and remove duplicate eating and the broad unsupported culture claim.

Final English:
1. Today, I am at an American festival.
2. I wait for my friend.
3. Many people are at the festival.
4. My friend is here now.
5. We eat a light meal together.
6. The taste is very good.
7. We listen to music.
8. We talk about the festival.
9. I am interested in American culture.
10. The festival is very exciting.
11. I want to visit the festival again.
12. It is a special day for me.

## 077 Sunshine G2 PROGRAM 3-2 — Handmade Cards for Our Project
Decision: REWRITE_MAJOR. Make the speaker a student seller from the start and keep all money tied to one fundraising purpose.

Final English:
1. Today, we sell handmade cards at the festival.
2. The cards are for our project.
3. Some children make the cards themselves.
4. Here is a thin card.
5. It is light and beautiful.
6. I make a card, too.
7. Many people buy the cards.
8. We earn money for our project.
9. I like the children’s work.
10. The festival is special for me.
11. I look forward to visiting the festival again.

## 078 Sunshine G2 PROGRAM 3-3 — A Dutch Student’s Charity Stall
Decision: REWRITE_MAJOR. Define the Dutch student’s job as explaining/selling handmade bowls and make the donation destination clear without unrelated food-smell filler.

Final English:
1. At the festival, I meet a Dutch student.
2. The student is from the Netherlands.
3. The student has a job at a charity stall.
4. “Can you show me this bowl?”
5. “Sure.”
6. The bowl is handmade.
7. Each bowl is light.
8. I can carry it easily.
9. People buy the handmade bowls.
10. The stall earns money.
11. At the end, the students donate the money.
12. I like their work.
13. I want to visit this festival again.

## 079 Sunshine G2 PROGRAM 4-1 — A Deer on Our Hike
Decision: REWRITE. Keep the footprint-to-deer discovery and end naturally during/after the hike.

Final English:
1. Today, the sky is clear.
2. My friend and I go hiking.
3. My friend can guide me.
4. We walk in a forest.
5. I see a footprint.
6. “Is it a deer footprint?”
7. “Yes, it is.”
8. Actually, we see a deer near us.
9. I am glad to see it.
10. We watch the deer for a short time.
11. After the hike, we talk about the footprint and the deer.
12. I want to go hiking again.

## 080 Sunshine G2 PROGRAM 4-2 — A Guide’s Forest Rule
Decision: REWRITE_MAJOR. Use a small set of concrete rules with reasons, not a must/mustn’t inventory. Keep `rule` singular because that is the verified surface form.

Final English:
1. We are in a forest today.
2. Our guide tells us an important rule.
3. First of all, we must protect the forest.
4. We must not leave garbage.
5. We must keep the forest clean.
6. We must help each other.
7. If we have trouble, we should talk to our guide.
8. The forest is quiet.
9. We should walk carefully and enjoy it.
10. This rule helps us protect the forest.
11. I am glad to learn the rule.

## Implementation rule
For every passage, synchronize title/sentences -> natural full Japanese translation -> slash rows -> A questions/answers/evidence/evidenceJp/reasons -> B equivalents in one repair set. Re-render effective stage2 data and reject a batch on any sentence/slash mismatch, vocabulary/grammar gate failure, stale evidence, DOM failure, or 168-passage coverage/B-set regression failure.