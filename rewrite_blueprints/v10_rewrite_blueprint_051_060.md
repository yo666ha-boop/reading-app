# V10 rewrite blueprint 051-060

Planning gate: final English is decided here before source/translation/question edits. Use only cumulative vocabulary and grammar available by each section. Vocabulary is a ceiling, never a checklist.

## 051 New Horizon G1 Unit 4-3 — Reading at the Front
Decision: REWRITE. Give `your turn / front / nervous / right` one concrete purpose: reading an English story at the front of class. Keep teacher encouragement in one continuous classroom scene.

Final English:
1. It’s your turn.
2. Are you nervous?
3. Yes, I am.
4. Don’t worry.
5. Please come to the front.
6. Read this English story, please.
7. Look at me, please.
8. Is this right?
9. Yes, it is.
10. Great.
11. Enjoy yourself.
12. Thank you.

## 052 New Horizon G1 Unit 5-1 — A Local Guide’s Blog
Decision: REWRITE_MAJOR. Make the passage consistently the brother’s first-person blog entry so the speaker never changes without warning.

Final English:
1. This is my blog.
2. I am a local guide.
3. I like nature very much.
4. This is a local spot.
5. It is beautiful.
6. I work here as a local guide.
7. I write about this local spot.
8. I enjoy working as a guide.
9. I like this blog, too.
10. I enjoy my work.

## 053 New Horizon G1 Unit 5-2 — A Dolphin Picture on His Blog
Decision: REWRITE_MAJOR. Keep the blog and dolphin picture as the single topic. Use only a small number of `Does he ...?` questions where they clarify the picture/blog rather than creating a grammar checklist.

Final English:
1. This is his blog.
2. The blog is about his life.
3. He has a beautiful dolphin picture there.
4. The dolphin is in the water.
5. Does he like the picture?
6. Yes, he does.
7. He can swim.
8. He doesn’t surf.
9. Does he write about the dolphin?
10. Yes, he does.
11. The picture is very beautiful.
12. The blog is interesting.

## 054 New Horizon G1 Unit 5-3 — Looking at a Cafe Website
Decision: LIGHT_REWRITE. Frame the website as two people looking at it together; let the food information naturally make the second speaker want to visit the cafe.

Final English:
1. My brother and I look at a cafe website.
2. The cafe is popular.
3. The owner is friendly.
4. This dish is wonderful.
5. A fried egg is on top of the dish.
6. “Do you know this cafe?”
7. “No, I don’t.”
8. “Look at this dish.”
9. “Wonderful!”
10. “I want to visit the cafe.”
11. “Great!”

## 055 New Horizon G1 Unit 6-1 — A Show from the U.K.
Decision: REWRITE. Keep recognition of one performer and let that recognition lead once, not repeatedly, to a plan to watch the show.

Final English:
1. This is a show from the U.K.
2. This is a performer in the show.
3. Do you know him?
4. Yes, I do.
5. He is from the U.K.
6. I like him very much.
7. Why don’t we watch the show?
8. Sounds great.
9. We can watch it together.
10. The show is interesting.

## 056 New Horizon G1 Unit 6-2 — Riko’s Ticket and Book
Decision: REWRITE_MAJOR. Make the ticket and history book part of the same lost-belongings scene instead of starting a second unrelated ownership drill.

Final English:
1. This is a ticket.
2. Whose ticket is this?
3. Is it yours?
4. No, it is not.
5. Maybe it is Riko’s.
6. Yes, it is.
7. This history book is near the ticket.
8. It is Riko’s, too.
9. Here you are, Riko.
10. Thanks.

## 057 New Horizon G1 Unit 6-3 — Getting Ready for the Show
Decision: REWRITE. Make cushion, towel and casual clothes parts of one show-preparation sequence. Keep only one genuine choice question.

Final English:
1. This is a cushion.
2. It is a prop in the show.
3. This is a towel.
4. It is a prop, too.
5. I use the cushion first.
6. Then I use the towel.
7. I wear casual clothes in the show.
8. Which do you like, the cushion or the towel?
9. I like the cushion.
10. The cushion and the towel are different.
11. The show is great.

## 058 New Horizon G1 Unit 7-1 — Talking About Tomorrow’s Tennis
Decision: LIGHT_REWRITE. Keep tomorrow-morning tennis and after-school availability, but make the after-school conversation explicitly about tennis and remove duplicate agreement lines.

Final English:
1. What’s up?
2. Are you busy tomorrow morning?
3. Yes, I am.
4. I want to practice tennis tomorrow morning.
5. Are you free after school?
6. Yes, I am.
7. Why don’t we talk about tennis after school?
8. Great!
9. I look forward to tomorrow.

## 059 New Horizon G1 Unit 7-2 — Choosing a Souvenir at the Market
Decision: REWRITE. Make the market scene about finding and choosing one souvenir for the speaker’s family; remove demonstrative/pronoun drilling about unrelated people.

Final English:
1. Welcome to this market.
2. It is a popular place.
3. I want to buy a souvenir for my family.
4. Look at this souvenir.
5. It is beautiful.
6. Do you like it?
7. Yes, I do.
8. Great!
9. I want to buy it.
10. I like this market very much.

## 060 New Horizon G1 Unit 7-3 — A Family Travel Plan
Decision: REWRITE_MAJOR. Keep only one family trip-planning scene. Remove the disconnected late/angry/sorry exchange entirely.

Final English:
1. Mom, are you free tomorrow?
2. Yes, I am.
3. Dad, are you free tomorrow?
4. Yes, I am.
5. Great!
6. Let’s travel tomorrow.
7. I want to visit a palace.
8. Mom and Dad like the plan.
9. Sounds exciting.
10. We’re happy.

## Implementation rule
Implement each planned passage atomically with its natural Japanese full translation, slash rows, A questions/answers/evidence/evidenceJp/reasons and B equivalents. Re-render the effective stage2 output after implementation and reject the batch if sentence/slash counts, vocabulary/grammar gates, or any evidence link no longer matches.