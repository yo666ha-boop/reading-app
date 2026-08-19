# V10 rewrite blueprint 001-010

This file is the planning gate before code changes. The final English below is decided first; only then may source/translation/slash/questions be synchronized to it. Available vocabulary is a ceiling, not a checklist.

## 001 Sunshine G1 Get Ready 2 — My English Book
Decision: LIGHT_REWRITE. Keep one book-sharing scene; remove the duplicate final reaction and make `too` attach naturally to the second animal.

Final English:
1. This is my English book.
2. Really?
3. Yes.
4. This is a dog.
5. I see.
6. This is a cat, too.
7. I write “dog” in my notebook.
8. I write “cat” in my notebook, too.
9. I can read “dog”.
10. I can read “cat”, too.
11. Great!

## 002 Sunshine G1 Get Ready 3 — English at School
Decision: LIGHT_REWRITE. Keep one short conversation about a shared interest in English; remove the redundant statement after `Yes, I do.` and the dangling final `Really?`.

Final English:
1. What subject do you like?
2. I like English.
3. Really?
4. Yes.
5. Do you have your English book?
6. Yes, I do.
7. Can you read English?
8. Yes, I can.
9. Great!
10. I like English, too.

## 003 Sunshine G1 Get Ready 4 — Basketball in the Gym
Decision: LIGHT_REWRITE. Keep one basketball-club scene; combine the duplicated practice sentences and end at the invitation/reaction rather than adding another generic summary.

Final English:
1. I like basketball.
2. I am in the basketball club.
3. I practice in the gym every day.
4. I can run.
5. I can jump high.
6. I can shoot the ball.
7. Basketball is very exciting.
8. Do you like basketball?
9. Yes, I do.
10. Let’s play basketball together.
11. Great!

## 004 Sunshine G1 Get Ready 5 — The Zoo
Decision: LIGHT_REWRITE. Keep a simple early-unit preference dialogue; remove one generic ending and reduce redundant reaction/answer padding while staying inside the extremely small vocabulary ceiling.

Final English:
1. Do you like the zoo?
2. Yes, I do.
3. What do you like?
4. I like the panda and the monkey.
5. I like the tiger, too.
6. Really?
7. Yes.
8. Do you like the rabbit?
9. Yes, I do.
10. I like the bear, too.

## 005 Sunshine G1 Get Ready 6 — A Day at the Zoo
Decision: REWRITE. One zoo-visit diary only. Lunch belongs to the same setting, all animal sentences are observations from that visit, and the unsupported speaker switch is removed.

Final English:
1. I had lunch at the zoo.
2. I ate pizza.
3. I saw a panda.
4. I saw a monkey, too.
5. I saw a tiger.
6. I saw a rabbit.
7. I saw a bear, too.
8. I like the panda and the monkey.
9. I like the tiger, too.
10. I like the zoo.

## 006 Sunshine G1 PROGRAM 1-1 — A Junior High School Student
Decision: LIGHT_REWRITE. Make it a continuous self-introduction. Remove the isolated negative `I’m not shy.` and keep personality, music, practice, sport, and school as one introduction.

Final English:
1. Hi.
2. I’m a junior high school student.
3. I’m friendly.
4. My teacher is kind.
5. I like my teacher.
6. I like music.
7. I play the trumpet.
8. I practice every Wednesday.
9. I like basketball, too.
10. I like my school.
11. School is really great.
12. Goodbye.

## 007 Sunshine G1 PROGRAM 1-2 — From Australia
Decision: REWRITE. Remove the drill-like `not from Japan / not from the U.S.` sequence and keep one natural introduction about origin, teacher, interests, and school.

Final English:
1. Hello.
2. I’m a student.
3. I’m from Australia.
4. Australia is really great.
5. My teacher is from Japan.
6. My teacher is kind.
7. I like Japan.
8. I like Australia, too.
9. I’m friendly.
10. I like my school.
11. School is great.
12. Goodbye.

## 008 Sunshine G1 PROGRAM 1-3 — A New Student in This City
Decision: LIGHT_REWRITE. Keep the first-day self-introduction but order it as arrival/class -> personality -> subjects -> hobby/teacher -> wish to fit in.

Final English:
1. I’m a new student.
2. This is my new class.
3. Nice to meet you.
4. I’m quiet.
5. I’m cheerful, too.
6. I like math and science.
7. I’m good at math.
8. I’m good at science, too.
9. I like Japanese.
10. I’m a fan of movies.
11. My teacher is kind.
12. This city is nice.
13. I want to be friendly.
14. School is really great.

## 009 Sunshine G1 PROGRAM 2-1 — My Bicycle After School
Decision: REWRITE. Keep only the after-school bicycle -> home routine. Remove unrelated tennis and the forced negative sentence.

Final English:
1. After school, I ride my bicycle.
2. I sometimes ride with my friend.
3. We ride in our town.
4. Our town is beautiful.
5. My friend and I walk, too.
6. I like my bicycle very much.
7. I go home after school.
8. At home, I clean my bicycle.
9. I read at home.
10. I like my town, too.
11. I like my bicycle and my town.

## 010 Sunshine G1 PROGRAM 2-2 — My Weekend Routine
Decision: REWRITE. Put the weekend in chronological order: bicycle outing -> before dinner -> after dinner. Do not jump backward in time.

Final English:
1. On the weekend, I ride my bicycle with my friend.
2. We ride in our town.
3. Our town is beautiful.
4. Before dinner, I clean my bicycle.
5. I study math before dinner.
6. I like math, but I like science, too.
7. After dinner, I study Japanese.
8. I read at home after dinner.
9. I sometimes watch tennis after dinner.
10. I like the weekend very much.

## Synchronization rule for implementation
For each passage, update in one atomic repair set: title/sentences -> natural full Japanese translation -> slash rows -> A questions/answers/evidence/evidenceJp/reasons -> B questions/answers/evidence/evidenceJp/reasons. Then render the effective app and re-check vocabulary ceiling, prerequisite grammar, sentence/slash count, and question evidence before moving to the next passage.
