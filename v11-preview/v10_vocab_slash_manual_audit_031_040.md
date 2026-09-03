# V10 Vocabulary + Slash Human Audit 031-040

Reference: front-to-back meaning chunks. Short basic clauses remain intact. Slashes are added only at real chronology/place/company/topic boundaries. Vocabulary is judged against the canonical NH/SS chronology plus the passage-level reviewed section/cumulative/elementary gate.

## 031 Sunshine G1 PROGRAM 9-2 — COMPLETE
Vocabulary: PASS, notes=0. Source gate explicitly permits yesterday/afternoon/vet/came/took/read/come back/take a picture/take a walk plus PROGRAM 9-1 past forms and cumulative dog/house/picture/walk vocabulary.
Slash: PASS. `Yesterday afternoon, / my friend came to my house.`, `My friend took a picture / of my dog.`, `We took a walk / with my dog.`, `We read a book / at home.` preserve verb phrases and separate only meaningful adjuncts.

## 032 Sunshine G1 PROGRAM 9-3 — COMPLETE
Vocabulary: PASS, notes=0. Final narrative uses the PROGRAM 9-3 past/didn't gate plus previously unlocked read/played/relaxed forms.
Slash: PASS. Removed `had / a good time`, `played / a game`, `didn’t win / the game` grammar-drill splits. Only clear time/place chunks remain: `Last night, / ...`, `I went home / at night.`, `I relaxed / at home.`

## 033 Sunshine G1 PROGRAM 9-4 — COMPLETE
Vocabulary: PASS, notes=0. Final text remains within the reviewed PROGRAM 9-4 past-form/reindeer/winter-experience gate and cumulative vocabulary.
Slash: PASS. `Last winter, / I visited Finland / with my family.`, `One night, / I went outside.`, `I found a reindeer / near the road.`, `The next morning, / I talked about the experience.` follow chronology/place/topic chunks.

## 034 Sunshine G1 PROGRAM 10-1 — COMPLETE
Vocabulary: PASS, notes=0. Source gate explicitly confirms grandma/finish/idea/homework/tired/sleepy/were/was plus finished/talked/had and cumulative words. The known out-of-scope kitchen issue had already been removed in the source fix.
Slash: PASS. `I was tired.`, `I had homework.`, `My grandma had an idea.` and the quoted proposal stay whole. `My grandma was at home / with me.` and `Then / we talked about my school.` use real attachment boundaries.

## 035 Sunshine G1 PROGRAM 10-2 — COMPLETE
Vocabulary: PASS, notes=0. Source gate explicitly confirms theater/wasn’t plus 10-1 be-past forms and unlocked watched/talked/went/had vocabulary.
Slash: PASS. be+complement units remain whole. `Yesterday, / my friend and I were at the theater.` and `After the movie, / we talked about it.` retain only chronology boundaries.

## 036 Sunshine G1 PROGRAM 10-3 — COMPLETE
Vocabulary: PASS, notes=0. Final semantic repair removed the unrelated internet/textbook/homework cluster; remaining comic/detective/called/surprised/talked/read-again content stays within the reviewed 10-3/cumulative gate.
Slash: PASS. `The story was about a detective.` and `We talked about ...` stay whole. Time/sequence uses `Last night, / ...`, `At seven, / ...`, `Then / ...`.

## 037 Sunshine G1 PROGRAM 10-4 — COMPLETE
Vocabulary: PASS, notes=0. Final semantic repair retains only the reviewed snowy-town/sleigh/slope/speed/broke/reached/warm/safe problem-resolution vocabulary and removes decorative out-of-scope filler.
Slash: PASS. Phrasal/action units such as `got on a sleigh`, `went down a slope`, `walked to our house`, `reached the house` stay intact. Only `Last winter, / ...`, `We started / on a hill.`, and `Finally, / ...` are split.

## 038 Sunshine G1 Step 6 / Our Project 3 / Power-Up 6 — COMPLETE
Vocabulary: PASS, notes=0. Source gate explicitly confirms performance/shot/nervous/creative/first/dear/miss/February/card/Best wishes plus went/took/was and cumulative vocabulary. Unnecessary St./wish vocabulary remains unused.
Slash: PASS. `I want to tell you / about my school performance.`, `In February, / I went to the performance.`, `After the performance, / we took a shot.`, and `I have a card from the performance / for you.` follow topic/time/beneficiary chunks.

## 039 New Horizon G1 Unit 0 — COMPLETE
Vocabulary: PASS, notes=0. Source allowedWords explicitly confirms morning/tennis/you/I/meet/am/like/do/good/yes/hi plus elementary play and proper names Ken/Mei.
Slash: PASS. Speaker label and short utterance are kept as one readable unit; no `Do you like / tennis?` or `I like / tennis.` grammar split remains.

## 040 New Horizon G1 Unit 1-1 — COMPLETE
Vocabulary: PASS, notes=0. Source allowedWords explicitly confirms South Africa/call/love/sweets/club/twelve/everyone/me/join/Japanese/too/from/the/want to plus Unit 0 cumulative tennis and proper names Leonardo/Leo.
Slash: PASS. All nine self-introduction sentences are short natural units and remain intact; no `I’m / Leonardo`, `I’m from / South Africa`, `I want to join / the tennis club` splitting remains.

## Implementation
- Runtime override: `v10_vocab_slash_manual_031_040.js`.
- Loader: `v10_interaction_metadata.js` now loads this after automatic final fixes and after the 004-030 human-audit overrides.
- No vocabulary-driven English rewrite was required in 031-040, so the already synchronized full translations and A/B evidence remain valid.

Progress: vocabulary 40/168, slash human audit 40/168, vocabulary-driven rewrites 0, notes confirmed 0.
Next: passage 041 New Horizon G1 Unit 1-2.
