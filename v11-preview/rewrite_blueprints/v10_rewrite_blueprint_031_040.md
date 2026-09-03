# V10 rewrite blueprint 031-040

Planning gate: final English is decided here before source/translation/question edits. Only already-available cumulative vocabulary and the selected section grammar are used. Vocabulary is a ceiling, never a checklist.

## 031 Sunshine G1 PROGRAM 9-2 — An Afternoon with My Dog
Decision: REWRITE. Keep one afternoon visit centered on photographing and walking the dog; remove the unrelated koala book and repetitive relaxing filler.

Final English:
1. Yesterday afternoon, my friend came to my house.
2. My dog stayed near us.
3. My friend took a picture of my dog.
4. I took a picture, too.
5. We took a walk with my dog.
6. We came back to my house.
7. We read a book at home.
8. We talked about my dog.
9. My friend relaxed there.
10. We relaxed a lot.

## 032 Sunshine G1 PROGRAM 9-3 — Last Night at My Friend’s House
Decision: REWRITE_MAJOR. Remove self-questions that exist only to drill `Did ...?`; narrate the evening in chronological order.

Final English:
1. Last night, I went to my friend’s house.
2. We had a good time.
3. We played a game.
4. My friend played well.
5. I didn’t win the game.
6. We read a book.
7. We talked about the game.
8. I didn’t sleep there.
9. I went home at night.
10. I relaxed at home.

## 033 Sunshine G1 PROGRAM 9-4 — A Winter Experience
Decision: LIGHT_REWRITE. Keep the Finland/reindeer encounter, remove the disconnected greeting and `once`, and make the viewing time plausible without implying hours of staring at the animal.

Final English:
1. Last winter, I visited Finland with my family.
2. One night, I went outside.
3. I found a reindeer near the road.
4. I ran to my family.
5. We went outside together.
6. The reindeer stayed near the road.
7. We watched it at night.
8. Then it went down the road.
9. We went back to our house.
10. I slept after midnight.
11. The next morning, I talked about the experience.
12. I liked the winter trip a lot.

## 034 Sunshine G1 PROGRAM 10-1 — Homework with Grandma
Decision: REWRITE_MAJOR. State Grandma’s idea explicitly and make it solve the tired/homework situation; remove repeated location/fine filler.

Final English:
1. Yesterday, I was tired.
2. My grandma was at home with me.
3. I had homework.
4. I was sleepy, too.
5. My grandma had an idea.
6. “Let’s finish the homework together.”
7. “Great!”
8. We finished my homework together.
9. Then we talked about my school.
10. I was happy.
11. It was a great evening.

## 035 Sunshine G1 PROGRAM 10-2 — Yesterday at the Theater
Decision: LIGHT_REWRITE. Keep the coherent movie outing and remove unrelated negative-form drills about tiredness, sleepiness, and house distance.

Final English:
1. Yesterday, my friend and I were at the theater.
2. The theater wasn’t busy.
3. It was quiet.
4. We watched a movie.
5. The movie was interesting.
6. We had a good time.
7. After the movie, we talked about it.
8. We went home together.
9. I was happy.
10. It was a great evening.

## 036 Sunshine G1 PROGRAM 10-3 — A Comic Story at Seven
Decision: REWRITE. Keep the evening focused on reading one comic and discussing it with a friend; remove the unrelated internet/textbook/homework cluster.

Final English:
1. Last night, I was at home.
2. I read a comic story.
3. The story was about a detective.
4. At seven, my friend called me.
5. I was surprised.
6. We talked about the comic story.
7. We talked about the detective, too.
8. Then I read the story again.
9. I was happy.
10. It was a good night.

## 037 Sunshine G1 PROGRAM 10-4 — A Broken Sleigh
Decision: REWRITE. Keep the real problem/resolution structure and remove decorative raccoon/quilt/closet/hot-water vocabulary. The family reaches its own house and becomes warm and safe.

Final English:
1. Last winter, my family and I were in a snowy town.
2. We got on a sleigh.
3. We started on a hill.
4. The sleigh went down a slope.
5. The speed increased.
6. Bang!
7. The sleigh broke.
8. It was terrible.
9. We walked to our house.
10. We reached the house.
11. The house was warm.
12. Finally, we were warm and safe.

## 038 Sunshine G1 Step 6 / Our Project 3 / Power-Up 6 — A Letter to Anna
Decision: REWRITE_MAJOR. Make it a real letter to Anna about one school performance, with a reason for writing and a coherent closing.

Final English:
1. Dear Anna,
2. I want to tell you about my school performance.
3. In February, I went to the performance.
4. It was my first performance.
5. I was nervous.
6. My friend was nervous, too.
7. The performance was creative and exciting.
8. After the performance, we took a shot.
9. I have a card from the performance for you.
10. I want to show it to you.
11. I miss you.
12. It was a great day.
13. Best wishes,

## 039 New Horizon G1 Unit 0 — Good Morning
Decision: REWRITE. Keep one first-meeting conversation and make speaker roles explicit with proper-name labels; remove redundant answer restatement and the generic final filler.

Final English:
1. Ken: Good morning.
2. Mei: Hi.
3. Ken: I’m Ken.
4. Mei: I’m Mei.
5. Ken: Nice to meet you.
6. Ken: Do you like tennis?
7. Mei: Yes, I do.
8. Ken: I like tennis.
9. Mei: Do you play tennis?
10. Ken: Yes, I do.

## 040 New Horizon G1 Unit 1-1 — Call Me Leo
Decision: REWRITE. Make Leonardo’s passage a continuous self-introduction; remove the unexplained interviewer and let interests lead naturally to the tennis-club wish.

Final English:
1. Hello, everyone.
2. I’m Leonardo.
3. Call me Leo.
4. I’m twelve.
5. I’m from South Africa.
6. I love Japanese sweets.
7. I love tennis, too.
8. I want to join the tennis club.
9. Nice to meet you.

## Implementation rule
Implement each planned passage atomically with its natural Japanese full translation, slash rows, A questions/answers/evidence/evidenceJp/reasons and B equivalents. Re-render the effective stage2 output after implementation and reject the batch if sentence/slash counts, vocabulary/grammar gates, or any evidence link no longer matches.