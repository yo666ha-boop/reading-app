# V10 Vocabulary + Slash Human Audit 011-020

Reference: front-to-back meaning chunks. Short basic clauses stay intact; slash only at meaningful time/place/phrase boundaries. Vocabulary is judged against the reviewed passage gate (`allowedWords` / cumulative / textbook-confirmed / elementary) and the canonical NH/SS chronology; keyword-table absence alone is not an automatic failure.

## 011 Sunshine G1 PROGRAM 2-3 — COMPLETE
Vocabulary: PASS, notes=0. Final text stays inside the reviewed PROGRAM 2-3/cumulative gate.
Slash: PASS. `Look at this picture.`, `Are you an artist?`, and `This pencil is for you.` remain whole. Longer phrases use `I draw this picture / in my notebook.`, `We can draw / during the break.`, `Let’s draw / tomorrow.`

## 012 Sunshine G1 PROGRAM 3-1 — COMPLETE
Vocabulary: PASS, notes=0. Family/ski/dance/winter/summer/can/can’t/don’t vocabulary remains inside the reviewed gate.
Slash: PASS. can+verb and be+complement stay intact. Only seasonal adjuncts split: `We ski / in winter.` and `We don’t ski / in summer.`

## 013 Sunshine G1 PROGRAM 3-2 — COMPLETE
Vocabulary: PASS, notes=0. French/guitar/skate/magic trick/practice/after school are within the reviewed section/cumulative gate.
Slash: PASS. `I can speak French.`, `My friend can play the guitar.`, `Can you do a magic trick?` stay whole. `We can practice / after school.` separates the time phrase only.

## 014 Sunshine G1 PROGRAM 3-3 — COMPLETE
Vocabulary: PASS, notes=0. rescue robot/carry/heavy/water/find/help/fly/show/excited/wonderful remain inside the reviewed gate.
Slash: PASS. Short capability sentences remain whole. `It can help people in a tree.` is deliberately not split because `people in a tree` is one noun phrase and splitting it would distort meaning.

## 015 Sunshine G1 PROGRAM 4-1 — COMPLETE
Vocabulary: PASS, notes=0. zebra/horse/elephant/ant/butterfly and demonstrative/be forms remain inside the reviewed gate.
Slash: PASS. All sentences are short identification/question units, so grammar-drill splits were removed.

## 016 Sunshine G1 PROGRAM 4-2 — COMPLETE
Vocabulary: PASS, notes=0. boy/man/classmate/runner/track and field team/court/who vocabulary remains inside the reviewed gate.
Slash: PASS. `He is on the track and field team.` and `He is on the court.` stay intact as be+complement units.

## 017 Sunshine G1 PROGRAM 4-3 — COMPLETE
Vocabulary: PASS, notes=0. fruit/banana/cherry/yellow/long/round/sweet/question/right/I got it remain inside the reviewed gate.
Slash: PASS. All short guessing-game turns stay intact; no artificial split after be or have.

## 018 Sunshine G1 PROGRAM 5-1 — COMPLETE
Vocabulary: PASS, notes=0. pajama/design/home economics/sew/drawing/yellow/does/doesn’t/long remain inside the reviewed gate.
Slash: PASS. be+complement and like+object units remain whole; yes/no answers remain whole.

## 019 Sunshine G1 PROGRAM 5-2 — COMPLETE
Vocabulary: PASS, notes=0. ice hockey/player/clothes/team/famous/skate/yellow and cumulative forms remain inside the reviewed gate.
Slash: PASS. Short picture-description units remain whole, including `He is an ice hockey player.` and `He is on a team.`

## 020 Sunshine G1 PROGRAM 5-3 — COMPLETE
Vocabulary: PASS, notes=0. charity/event/elementary school/support/hospital/sick/children/photo/proud/would like/spend/time/work/talk/together remain inside the reviewed gate.
Slash: PASS. Most clauses stay whole because they are already natural chunks. `We spend time / at the hospital.` separates only the place adjunct.

## Implementation
- Runtime override: `v10_vocab_slash_manual_011_020.js`.
- Loader order: after `v10_semantic_runtime_final_fixes.js` and after 004-010 manual overrides, so these rows are the final effective slash rows.
- No vocabulary-driven English rewrite was required in 011-020; therefore translation and A/B question evidence did not require text synchronization changes in this batch.

Progress: vocabulary 20/168, slash human audit 20/168, notes confirmed 0.
Next: passage 021 Sunshine G1 PROGRAM 6-1.
