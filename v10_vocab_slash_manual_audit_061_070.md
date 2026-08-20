# V10 Vocabulary + Slash Human Audit 061-070

Reference: canonical NH/SS 2026 chronology + reviewed cumulative/elementary/textbook-confirmed gates. Human slash review keeps short grammar units intact and splits only meaningful time/place/topic/company chunks.

## 061 NH G1 Unit 8-1 — FAIL FOUND -> REPAIRED -> PASS
- Semantic text used bare `help` in `He can help them, too.`
- The reviewed Unit 8-1 gate explicitly supplies volunteer/Kenya/teach/respect/children/become/in need/do one’s best, while the earlier confirmed help item is the phrase `help A with B`, not a clear license for this bare transitive use.
- Removed the uncertain sentence instead of adding a note. A question 3 and B question 2 now use the clearly licensed `teach`; translation/slash synchronized.

## 062 NH G1 Unit 8-2 — FAIL FOUND -> REPAIRED -> PASS
- `again` in `I can use it again.` is too early: canonical NH1 places `again` later in Unit 8 Stage Activity 2.
- Title `Two Kinds of Straws` also used an unapproved auto-generated plural `Straws`; the Unit 8-2 source audit explicitly avoids generating `straws`.
- Rebuilt as `A Reusable Straw and a Paper Straw`; removed the premature `again` sentence and synchronized A/translation/slash. No note required.

## 063 NH G1 Unit 8-3 — FAIL FOUND -> REPAIRED -> PASS
- Semantic `A group in the village wants to build a well.` auto-generated positive 3sg `wants` even though the reviewed gate supplies `want to` and the source itself uses plural `They want to ...` to avoid unverified inflection.
- Rebuilt as `A group is in the village. They want to build a well.` and synchronized A evidence/translation/slash.
- Source gate also confirms `water` as `Sounds and Letters 3 cumulative`, important for the corrected passage 053 decision.

## 064 NH G1 Unit 9-1 — FAIL FOUND -> REPAIRED -> PASS
- Semantic `The mountain was beautiful.` used past be `was` before Unit 10-1.
- Unit 9-1 explicitly unlocks `met / went / saw`; `was` is explicitly introduced in Unit 10-1.
- Changed to `The mountain is beautiful.`; translation/slash synchronized. No dependent A/B evidence needed changes.

## 065 NH G1 Unit 9-2 — COMPLETE
Vocabulary PASS, notes=0. New Year/grandparent/traditional/special/card/did/wrote/ate/didn’t/rice cake/Good for you are explicit Unit 9-2 items.
Slash PASS. Past verb+short-object units remain intact; beneficiary/language/company chunks are separated naturally.

## 066 NH G1 Unit 9-3 — COMPLETE
Vocabulary PASS, notes=0. fortune slip/charm/spend/New Year’s Day/bad/bought/got/spent/had/have a ... time are explicit. `again` is already cumulative from Unit 8 Stage Activity 2 by this point.
Slash PASS.

## 067 NH G1 Unit 10-1 — FAIL FOUND -> REPAIRED -> PASS
- Semantic used `I realize that I was late.` Although lexical `realize` is available, this introduced an unreviewed `that` complement-clause construction.
- Removed the sentence; the reflection remains explicit through `Now I remember my mistake.`
- Translation/slash synchronized; A/B evidence remained valid.

## 068 NH G1 Unit 10-2 — FAIL FOUND -> REPAIRED -> PASS
- Semantic used another unreviewed complement clause: `I remember that we won, too.`
- Replaced it with `I remember the contest, too.` using already reviewed vocabulary/structure.
- A question 5 and B question 4/evidence were synchronized, together with translation/slash.

## 069 NH G1 Unit 10-3 — COMPLETE
Vocabulary PASS, notes=0. trip/campground/hot spring/tent/campfire/set/main/night/event/camping/there’s/isn’t/aren’t/there is/set up are explicit; went and past be/had are cumulative by this point.
Slash PASS. Short action clauses stay whole; only `At night, / ...` uses a time chunk.

## 070 Sunshine G2 PROGRAM 1-1 — FAIL FOUND -> REPAIRED -> PASS
- Semantic first sentence `I have important news.` contained `news` too early.
- Canonical Sunshine master places `news` later in G2 Reading 1; PROGRAM 1-1 explicitly supplies `plan` and `special`. (`important` itself is cumulative from Sunshine G1 PROGRAM 8.)
- Replaced with `I have a special plan.` and synchronized translation/slash. A/B evidence did not rely on `news`.

## Implementation
- Runtime layer: `v10_vocab_slash_manual_061_070.js`.
- Batch summary corrected to `rewritten:7`.
- Loader then applies `v10_vocab_slash_manual_corrections.js` last so the valid cumulative `water` restoration for passage 053 remains authoritative.
- Genuine rewrites this batch: 7 (061, 062, 063, 064, 067, 068, 070).
- Notes required: 0.

Cumulative progress through 070: vocabulary 70/168, slash human audit 70/168, genuine vocabulary/grammar-driven rewrites 12, notes confirmed 0.
Next: passage 071.
