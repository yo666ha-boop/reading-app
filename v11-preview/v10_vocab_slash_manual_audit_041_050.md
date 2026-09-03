# V10 Vocabulary + Slash Human Audit 041-050

Reference: front-to-back meaning chunks. Short basic clauses remain intact; slashes mark genuine time/place/company/topic boundaries. The NH/SS 2026 canonical vocabulary chronology plus reviewed section/cumulative/elementary/textbook-confirmed allowances are authoritative. Keyword-table absence alone is not a failure, but a canonical later-unit placement or premature grammar form is a real failure.

## 041 New Horizon G1 Unit 1-2 — COMPLETE
Vocabulary: PASS, notes=0. Source gate explicitly confirms rugby/fan/often/watch/friends/soccer plus cumulative/basic forms.
Slash: PASS. `Do you like rugby?`, `Do you play rugby?`, `We can play soccer together.` stay intact. Only `I often watch rugby / with my friends.` separates a real company phrase.

## 042 New Horizon G1 Unit 1-3 — COMPLETE
Vocabulary: PASS, notes=0. Source gate explicitly confirms comics/draw/anime/art club/school club/swimming lessons and cumulative forms.
Slash: PASS. be+complement and verb+short-object splits removed. `I’m not in a school club / now.` retains only the time contrast.

## 043 New Horizon G1 Unit 2-1 — COMPLETE
Vocabulary: PASS, notes=0. Source gate explicitly confirms teacher/Canada/America/class/team/good at/tennis and cumulative forms.
Slash: PASS. Short identification, origin, class/team membership and be+complement clauses remain intact.

## 044 New Horizon G1 Unit 2-2 — COMPLETE
Vocabulary: PASS, notes=0. Source gate explicitly confirms China/Chinese food/can/make/very/well.
Slash: PASS. `He can make Chinese food` stays one ability phrase; only `very well` is separated as manner.

## 045 New Horizon G1 Unit 2-3 — COMPLETE
Vocabulary: PASS, notes=0. English book/notebook are elementary; Unit 2-3 explicitly confirms ownership/fixed expressions `Excuse me.`, `Here you are.`, `Thank you.`, `You’re welcome.`
Slash: PASS. All short ownership/fixed-expression lines remain intact.

## 046 New Horizon G1 Unit 3-1 — COMPLETE
Vocabulary: PASS, notes=0. Source gate explicitly confirms favorite character/comic/kind/brave/interesting/cool/why and cumulative forms.
Slash: PASS. be+complement and question frames remain intact; only `She’s a character / in this comic.` separates the postmodifier.

## 047 New Horizon G1 Unit 3-2 — COMPLETE
Vocabulary: PASS, notes=0. Source gate explicitly confirms when/study/online/after school/walk and cumulative friend/with forms.
Slash: PASS. `study English` and `talk about English` stay intact; time/company chunks are separated only when useful.

## 048 New Horizon G1 Unit 3-3 — COMPLETE
Vocabulary: PASS, notes=0. Source gate explicitly confirms where/practice/near/park/station/go/hard/win/Good luck and cumulative forms.
Slash: PASS. `Where do you practice tennis?`, `We practice hard.`, `I want to win.` remain intact; place/time chunks are meaningful.

## 049 New Horizon G1 Unit 4-1 — FAIL FOUND -> REPAIRED -> PASS
Vocabulary failure found during the final word-by-word chronology check:
- `picture` was present in the semantic passage, but the canonical NH/SS 2026 master places `picture` in New Horizon G1 Unit 4 Part 2 (canonical master row 332), later than Unit 4-1.
- `animals` was an automatically generated plural not justified by the Unit 4-1 source gate. The Unit 4-1 source audit explicitly says not to auto-generate the plural of `animal`.

Repair: removed both `picture` and `animals`; no student note needed. Final English is:
1. `This is a puppy.`
2. `This is a cat, too.`
3. `They are small.`
4. `I like the puppy.`
5. `I like the cat, too.`
6. `They are in New Zealand.`
7. `I want to visit New Zealand someday.`
8. `New Zealand is interesting.`

The rewrite uses Unit 4-1 words plus cumulative `in`, `like`, `interesting`, etc. Full Japanese translation, slash rows, A questions/answers/evidence/evidenceJp/reasons, and B metadata were synchronized in `v10_vocab_slash_manual_041_050.js`.
Slash: PASS. Short clauses stay intact; only `I want to visit New Zealand / someday.` separates the time adjunct.

## 050 New Horizon G1 Unit 4-2 — FAIL FOUND -> REPAIRED -> PASS
Vocabulary/grammar chronology failure found:
- The semantic passage used `We will practice again tomorrow.`
- `will` is not in the reviewed Unit 4-2 gate and future auxiliary `will` has not been introduced at this point. This is a genuine premature grammar form, not a keyword-table false positive.

Repair: removed the future sentence and rebuilt the eight-sentence passage with already available cumulative vocabulary. Final English is:
1. `Basketball is my favorite sport.`
2. `I practice basketball in the afternoon.`
3. `My friend and I practice basketball.`
4. `We practice near the park.`
5. `We practice hard.`
6. `We want to win.`
7. `We like basketball.`
8. `Basketball is great.`

Full Japanese translation, slash rows, A questions/answers/evidence/evidenceJp/reasons, and B metadata were synchronized in `v10_vocab_slash_manual_041_050.js`.
Slash: PASS. `Basketball is my favorite sport.`, `My friend and I practice basketball.`, `We practice hard.`, `We want to win.` remain intact; time/place adjuncts are the only split points.

## Implementation
- Final runtime override: `v10_vocab_slash_manual_041_050.js`.
- Loader order: this file is loaded after semantic runtime repairs, automatic final fixes, and manual 004-040 audit layers, so the repaired 049/050 data and B metadata are the final effective runtime values.
- Canonical master verification used for 049: `picture` = NH G1 Unit4 Part2; `animal` singular = NH G1 Unit4 Part1.
- No student-facing notes are required after the rewrites.

Progress: vocabulary 50/168, slash human audit 50/168, vocabulary-driven rewrites 2, notes confirmed 0.
Next: passage 051 New Horizon G1 Unit 4-3.
