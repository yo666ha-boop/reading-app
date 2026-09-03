# V10 rewrite blueprint 011-020

Planning gate: final English is decided here before source/translation/question edits. Only already-available cumulative vocabulary and the selected section grammar are used; vocabulary is never consumed just because it exists.

## 011 Sunshine G1 PROGRAM 2-3 — Drawing During the Break
Decision: REWRITE. Keep one drawing conversation. Remove the disconnected `I have a question / Sure` exchange and make the pencil lead directly to drawing together.

Final English:
1. Look at this picture.
2. Wow!
3. I draw this picture in my notebook.
4. I draw at home, too.
5. Are you an artist?
6. No, I’m not.
7. I like this picture.
8. This pencil is for you.
9. Thank you.
10. I have two.
11. We can draw during the break.
12. Let’s draw tomorrow.
13. Great!

## 012 Sunshine G1 PROGRAM 3-1 — What My Family Can Do
Decision: LIGHT_REWRITE. Make family abilities the main topic; group ski ability first, dance ability second, then close with the winter routine.

Final English:
1. This is my family.
2. That is my brother.
3. He can ski well.
4. I can ski, too.
5. My father can ski, too.
6. My mother can’t ski.
7. My mother can dance well.
8. My grandfather can dance, too.
9. My grandmother can dance, too.
10. We ski in winter.
11. We don’t ski in summer.
12. We like winter.
13. Winter is great.

## 013 Sunshine G1 PROGRAM 3-2 — After-School Practice
Decision: REWRITE. Reduce the repeated can-question drill and make the passage about two friends deciding what they can practice together after school.

Final English:
1. I can speak French.
2. My friend can play the guitar.
3. I can play the guitar, too.
4. I can skate fast.
5. My friend can skate, too.
6. Can you do a magic trick?
7. Yes, I can.
8. Great!
9. We can practice after school.
10. I like the guitar.
11. My friend and I can skate together.
12. Sounds great.

## 014 Sunshine G1 PROGRAM 3-3 — Our Rescue Robot Show
Decision: LIGHT_REWRITE. Keep one robot demonstration, remove redundant audience questions, and make each ability part of the same rescue purpose.

Final English:
1. This is our rescue robot.
2. The robot is in our show.
3. I am so excited.
4. It can carry a heavy thing.
5. It can carry water, too.
6. It can find people.
7. It can help people.
8. It can help people in a tree.
9. It can fly, too.
10. It is wonderful.
11. Good luck!
12. Our show is great.

## 015 Sunshine G1 PROGRAM 4-1 — Animals in a Picture
Decision: LIGHT_REWRITE. Keep the picture-identification activity but remove unnecessary preference padding; two corrections are enough to make a coherent guessing scene.

Final English:
1. Look at this picture.
2. Is this a zebra?
3. No, it isn’t.
4. This is a horse.
5. Is that an elephant?
6. Yes, it is.
7. Look at that ant.
8. Is that a butterfly?
9. No, it isn’t.
10. That is an ant.
11. I like the horse and the elephant.
12. This picture is great.

## 016 Sunshine G1 PROGRAM 4-2 — People in a Sports Picture
Decision: REWRITE. Remove the unrelated street-singer branch. Keep one sports picture with a classmate on the track-and-field team and a teacher on the court.

Final English:
1. Look at this picture.
2. Who is this boy?
3. He is my classmate.
4. Is he a runner?
5. Yes, he is.
6. He is on the track and field team.
7. Who is that man?
8. He is my teacher.
9. He is on the court.
10. Is he on the track and field team?
11. No, he isn’t.
12. This picture is great.

## 017 Sunshine G1 PROGRAM 4-3 — A Fruit Guessing Game
Decision: LIGHT_REWRITE. Keep the guessing game only; remove the unrelated banana-offer ending.

Final English:
1. I have a question.
2. This fruit is yellow and long.
3. What is it?
4. Is it a banana?
5. Yes.
6. That’s right.
7. I got it!
8. This fruit is round and sweet.
9. What is it?
10. Is it a cherry?
11. Yes.
12. That’s right.
13. I like fruit.

## 018 Sunshine G1 PROGRAM 5-1 — A Pajama Design
Decision: REWRITE_MAJOR. Remove the unrelated curry question and the contradictory design preference. Keep a home-economics pajama-design discussion using `Does ...?` / `doesn’t` naturally.

Final English:
1. This is my brother.
2. This is his pajama design.
3. He is in home economics.
4. He can sew.
5. Does he like drawing?
6. Yes, he does.
7. His drawing is great.
8. This design is yellow.
9. Does he like this design?
10. Yes, he does.
11. Does he like this long design?
12. No, he doesn’t.
13. This pajama design is great.

## 019 Sunshine G1 PROGRAM 5-2 — An Ice Hockey Player
Decision: LIGHT_REWRITE. Keep one picture description of the player; place descriptive facts together before the single preference check.

Final English:
1. Look at this picture.
2. Who is this man?
3. He is an ice hockey player.
4. He can skate fast.
5. Look at his clothes.
6. His clothes are yellow.
7. He is on a team.
8. His team is famous.
9. Does he like ice hockey?
10. Yes, he does.
11. Does he like his clothes?
12. Yes, he does.
13. This picture is great.

## 020 Sunshine G1 PROGRAM 5-3 — A Charity Event
Decision: LIGHT_REWRITE. Keep one charity event and remove repeated pride/support claims. Order it as event -> who is helped -> what students do -> reflection.

Final English:
1. This is a charity event.
2. It is at my elementary school.
3. We support sick children.
4. The children are in a hospital.
5. We have a photo of the event.
6. We work together.
7. We spend time at the hospital.
8. We talk about the children.
9. I am proud of our work.
10. I would like to support the children.
11. I’d like to talk about the event.
12. This event is great.

## Implementation rule
Implement each planned passage atomically with its natural Japanese full translation, slash rows, A questions/answers/evidence/evidenceJp/reasons and B equivalents. Re-render the actual stage2 output after implementation and reject the batch if sentence/slash counts or any evidence link no longer matches.