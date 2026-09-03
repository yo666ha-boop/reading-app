# V10 rewrite blueprint 041-050

Planning gate: final English is decided here before source/translation/question edits. Only already-available cumulative vocabulary and the selected section grammar are used. Vocabulary is a ceiling, never a checklist.

## 041 New Horizon G1 Unit 1-2 — Rugby and Soccer
Decision: LIGHT_REWRITE. Keep the natural contrast of liking rugby but actually playing soccer. Remove the repeated negative and generic reactions, then end with the shared soccer connection.

Final English:
1. Do you like rugby?
2. Yes, I do.
3. I’m a rugby fan, too.
4. I often watch rugby with my friends.
5. Do you play rugby?
6. No, I don’t.
7. But I play soccer.
8. Oh, I play soccer, too.
9. We can play soccer together.

## 042 New Horizon G1 Unit 1-3 — Comics and Clubs
Decision: LIGHT_REWRITE. Keep one conversation about comics/anime and after-school activities. Remove the generic ending and make the second speaker’s swimming lesson a clear contrast to the art club.

Final English:
1. Do you like comics?
2. Yes, I do.
3. I draw comics, too.
4. Wow!
5. I’m an anime fan, too.
6. Are you in the art club?
7. Yes, I am.
8. How about you?
9. I’m not in a school club now.
10. But I take swimming lessons.
11. I see.

## 043 New Horizon G1 Unit 2-1 — Our New Teacher and Team
Decision: REWRITE_MAJOR. Make this one classroom introduction. Ms. Brown is the new teacher, Leo is a classmate and tennis teammate, and the team connection follows naturally from the class introduction.

Final English:
1. This is Ms. Brown.
2. She’s our new teacher.
3. She’s from Canada.
4. She’s cool.
5. This is Leo.
6. He’s in our class.
7. He’s from America.
8. He’s on our tennis team.
9. He’s good at tennis.
10. I’m on the tennis team, too.
11. Our team is cool.

## 044 New Horizon G1 Unit 2-2 — My Father and Chinese Food
Decision: LIGHT_REWRITE. Keep the father/cooking conversation, remove the redundant standalone “I like Chinese food,” and let the ability question lead directly to the father’s skill.

Final English:
1. This is my father.
2. He’s from China.
3. He can make Chinese food very well.
4. Do you like Chinese food?
5. Yes, I do.
6. Can you make Chinese food?
7. No, I can’t.
8. My father can.
9. Really?
10. Yes.
11. That’s cool.

## 045 New Horizon G1 Unit 2-3 — Your Book and Notebook
Decision: LIGHT_REWRITE. Return both lost classroom items in one exchange, using the target courtesy expressions only once instead of repeating the full pattern twice.

Final English:
1. Oops!
2. Excuse me.
3. Is this your English book?
4. Yes, it is.
5. Is this your notebook, too?
6. Yes, it is.
7. Here you are.
8. Thank you.
9. You’re welcome.

## 046 New Horizon G1 Unit 3-1 — My Favorite Character
Decision: LIGHT_REWRITE. Keep one favorite-character discussion. Group Hana’s traits together and remove the duplicated “interesting” check plus the generic ending.

Final English:
1. What’s your favorite character?
2. My favorite character is Hana.
3. Who’s Hana?
4. She’s a character in this comic.
5. She’s kind.
6. She’s also brave.
7. She’s interesting and cool.
8. Why is she your favorite character?
9. She’s kind and brave.
10. I see.

## 047 New Horizon G1 Unit 3-2 — After-School English
Decision: REWRITE. Keep the online English study routine and make the walk home a natural continuation of the same after-school time instead of a separate grammar drill.

Final English:
1. When do you study English?
2. I study English after school.
3. Do you study online?
4. Yes, I do.
5. I study online with my friend.
6. We study English together.
7. After school, I walk home with my friend.
8. We talk about English.
9. I like our study time.

## 048 New Horizon G1 Unit 3-3 — Practice Near the Park
Decision: LIGHT_REWRITE. Keep place, time, partner and goal in one tennis-practice description. Remove repeated yes/no practice questions and make the encouragement follow the goal directly.

Final English:
1. Where do you practice tennis?
2. I practice tennis near the park.
3. The park is near the station.
4. I go there after school.
5. I practice with my friend.
6. We practice hard.
7. I want to win.
8. Good luck.
9. Thank you.

## 049 New Horizon G1 Unit 4-1 — A Picture from New Zealand
Decision: REWRITE_MAJOR. Stop assigning human-style national origins to pets. Use a picture from New Zealand as the country connection, with the puppy and cat simply being animals shown in that picture.

Final English:
1. This is a picture from New Zealand.
2. A puppy is in the picture.
3. A cat is in the picture, too.
4. They are small.
5. They are animals.
6. I like the puppy and the cat.
7. I want to visit New Zealand someday.
8. New Zealand is interesting.

## 050 New Horizon G1 Unit 4-2 — Basketball in the Afternoon
Decision: LIGHT_REWRITE. Turn the repeated interview into one compact routine: favorite sport -> practice time -> partner -> effort -> goal.

Final English:
1. Basketball is my favorite sport.
2. I practice basketball in the afternoon.
3. My friend and I practice together.
4. We practice hard.
5. We want to win.
6. We like basketball very much.
7. Basketball is great.

## Implementation rule
Implement each planned passage atomically with its natural Japanese full translation, slash rows, A questions/answers/evidence/evidenceJp/reasons and B equivalents. Re-render the effective stage2 output after implementation and reject the batch if sentence/slash counts, vocabulary/grammar gates, or any evidence link no longer matches.