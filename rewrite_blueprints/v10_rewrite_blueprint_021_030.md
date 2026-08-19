# V10 rewrite blueprint 021-030

Planning gate: final English is decided here before source/translation/question edits. Only already-available cumulative vocabulary and the selected section grammar are used. Vocabulary is a ceiling, never a checklist.

## 021 Sunshine G1 PROGRAM 6-1 — Which Character Do You Like?
Decision: REWRITE. Keep one story-character discussion, remove the pointing-at-flashcards feel, and avoid unclear speaker turns.

Final English:
1. I like this story.
2. This story is about a detective.
3. A pirate is in the story, too.
4. A monster is in the story, too.
5. I like the detective very much.
6. I like the pirate, too.
7. I don’t like the monster very much.
8. My friend and I like the detective.
9. My friend and I talk about the detective and the pirate.
10. We talk about the monster, too.
11. We really like the story.

## 022 Sunshine G1 PROGRAM 6-2 — Saturday at the Park
Decision: REWRITE. Give the park visit one purpose: friends go early for basketball practice, then relax there before going home.

Final English:
1. I always go to the park on Saturday.
2. My friend and I go there together.
3. We go there early.
4. The park is quiet.
5. It is beautiful, too.
6. We practice basketball there.
7. We practice hard.
8. After practice, I read there.
9. I sometimes ride my bicycle there.
10. My friend and I like the park very much.
11. We go home together.

## 023 Sunshine G1 PROGRAM 6-3 — Schoolchildren in Kenya
Decision: LIGHT_REWRITE. Keep the Kenya school-commute explanation, remove unsupported safety claims, and end by evaluating the children rather than calling the dangerous walk itself “amazing.”

Final English:
1. This is Kenya.
2. Schoolchildren walk across the savanna every morning.
3. They walk for one hour to school.
4. The walk is tough.
5. The savanna can be dangerous.
6. The schoolchildren are strong.
7. They walk together.
8. They go to school every morning.
9. I respect the schoolchildren.
10. I want to tell my friend about them.
11. The schoolchildren are amazing.

## 024 Sunshine G1 PROGRAM 7-1 — Around My Dad’s College
Decision: REWRITE_MAJOR. Replace the map-like inventory with one visit: college/research -> nearby library/museum -> museum visit -> meal -> home.

Final English:
1. My dad and I are at a college.
2. We talk about research.
3. The research is interesting.
4. A library is near the college.
5. A museum is near the library.
6. My dad and I go to the museum.
7. After the museum, I am hungry.
8. My dad is hungry, too.
9. We go to a restaurant near the college.
10. I have a pork sandwich.
11. My dad has steak.
12. We go home after dinner.
13. It is a great day.

## 025 Sunshine G1 PROGRAM 7-2 — By Bus to a Cake Shop
Decision: LIGHT_REWRITE. Keep the bus trip and cake shop, remove the unnatural `come to the shop` and duplicate cake-eating statements.

Final English:
1. My friend and I go to a cake shop.
2. The shop is far from my house.
3. We go there by bus.
4. I am a little hungry.
5. My friend is hungry, too.
6. We want something sweet.
7. We have cake together.
8. The cake is great.
9. Now I am full.
10. My friend is full, too.
11. We go home by bus.
12. I like this shop very much.

## 026 Sunshine G1 PROGRAM 7-3 — A Quokka at the Zoo
Decision: REWRITE_MAJOR. Make the viewpoint consistent: the speaker is already visiting the zoo with a friend, sees the quokka, then reflects on returning with family someday.

Final English:
1. This zoo is popular.
2. My friend and I are at the zoo.
3. My friend can show me around.
4. The zoo is famous for the quokka.
5. Look at the quokka.
6. The quokka is a unique animal.
7. I like the quokka very much.
8. The zoo has a koala, too.
9. A turtle is near the gate.
10. The scenery is gorgeous.
11. I want to come here with my family someday.
12. I like this zoo very much.

## 027 Sunshine G1 PROGRAM 8-1 — New Year Shopping
Decision: REWRITE_MAJOR. Make New Year the reason for one family shopping trip and mention only a few fruits naturally instead of listing every available fruit.

Final English:
1. Happy New Year!
2. My dad and I go to the supermarket.
3. We need fruit for our family.
4. We need a pineapple and a strawberry.
5. We need a persimmon and a peach, too.
6. The supermarket is busy.
7. We have the fruit in our bag.
8. My dad and I go home together.
9. My family and I like the fruit.
10. We are happy.

## 028 Sunshine G1 PROGRAM 8-2 — A New Year Countdown
Decision: REWRITE. Keep one indoor countdown sequence: preparation -> music/cake -> countdown -> reaction. Remove irrelevant weather and duplicate generic endings.

Final English:
1. Today, my friend and I are at home.
2. We prepare for a countdown.
3. We are busy.
4. We have a cake for the countdown.
5. Why don’t we listen to music?
6. Great!
7. We listen to music together.
8. We have a little cake before the countdown.
9. The countdown is exciting.
10. I feel happy.
11. My friend is happy, too.
12. It is a great day.

## 029 Sunshine G1 PROGRAM 8-3 — At a Night Market
Decision: REWRITE_MAJOR. Keep the midnight market and food stands only. Remove the unexplained figure and disconnected January ending.

Final English:
1. We’re at a market.
2. My mom is with me.
3. It is almost midnight.
4. We are in front of a food stand.
5. I have tuna at the stand.
6. I have an oyster, too.
7. The tuna is expensive.
8. A pastry chef is at the next stand.
9. The pastry chef is from France.
10. The pastry chef is skillful.
11. My mom and I like the market very much.
12. We go home together.

## 030 Sunshine G1 PROGRAM 9-1 — My Last Holiday in Finland
Decision: REWRITE_MAJOR. Replace the unrelated activity list with one memorable family day centered on a tennis game and the evening afterward.

Final English:
1. Last holiday, I stayed in Finland with my family.
2. We stayed in a small house near a park.
3. I relaxed a lot there.
4. One day, my brother and I walked to the park.
5. We played tennis there.
6. My brother beat me.
7. We walked home.
8. My father cooked dinner.
9. After dinner, we talked about the tennis game.
10. I read a book and relaxed.
11. I liked the trip very much.

## Implementation rule
Implement each planned passage atomically with its natural Japanese full translation, slash rows, A questions/answers/evidence/evidenceJp/reasons and B equivalents. Re-render the effective stage2 output after implementation and reject the batch if sentence/slash counts, vocabulary/grammar gates, or any evidence link no longer matches.