# V10 Vocabulary + Slash Final Audit Checkpoint

status: IN_PROGRESS
phase: VOCAB_AND_SLASH_HUMAN_AUDIT
started_at_jst: 2026-08-20 11:00
last_manual_progress_jst: 2026-08-20 12:00+

## Current verified baseline
- Semantic passage rebuild: 168/168 previously completed.
- Student print mode: English passage + current questions only; Japanese translation/slash/answers/evidence/explanations excluded.
- Teacher print mode: passage + translation + slash reading + current questions + answers/evidence/explanations.
- Canonical vocabulary basis: NH/SS 2026 vocabulary master plus passage-level reviewed `allowedWords` classifications recording exact-section, cumulative, textbook-confirmed, and elementary words.
- Missing keyword-table rows alone are not proof that a reviewed elementary/textbook word is out of scope.
- Existing automated vocabulary/chronology/slash gates are not sufficient for this final pass; human review is required.

## Progress
- vocabulary_final_audited: 50/168
- slash_human_audited: 50/168
- passages_rewritten_this_phase: 2
- notes_confirmed: 0

## This run completed
- Re-read latest checkpoint and continued from 041.
- Human vocabulary + slash audit completed for 041-050.
- 041-048: vocabulary PASS under explicit reviewed section/cumulative gates; human slash rows corrected to preserve natural phrase units.
- 049 New Horizon G1 Unit 4-1: genuine vocabulary chronology failure found and repaired. Canonical NH/SS 2026 master places `picture` in NH G1 Unit4 Part2, later than Unit4-1. The Unit4-1 source audit also explicitly forbids auto-generating plural `animals`. Rewrote the passage without `picture`/`animals` using already-available vocabulary, then synchronized full translation, slash rows, A questions/answers/evidence/reasons and B metadata. No note required.
- 050 New Horizon G1 Unit 4-2: genuine grammar chronology failure found and repaired. `will` in `We will practice again tomorrow.` was not available at Unit4-2. Rebuilt the passage using cumulative Unit3-3/Unit4-2 vocabulary, then synchronized translation, slash, A/B questions/answers/evidence/reasons. No note required.
- Final effective runtime repairs for 041-050 are in `v10_vocab_slash_manual_041_050.js`, content SHA `469fd9f7961f730a9e19b40378383fcc3c68e09c` (repair commit `1af6567d7ade00178ffd41d24c142ff60a8ca5ba`).
- Corrected detailed ledger: `v10_vocab_slash_manual_audit_041_050.md`, commit `a252895b7580b790056d9b69347e8bba627422ed`.
- Loader confirmed to include `v10_vocab_slash_manual_041_050.js` as the last human-audit chunk after automatic final fixes and earlier manual ranges.

## Completed audit ranges
- 001-010 COMPLETE
- 011-020 COMPLETE
- 021-030 COMPLETE
- 031-040 COMPLETE
- 041-050 COMPLETE (049/050 rewritten during final vocabulary audit)

## Current phase
VOCAB_AND_SLASH_HUMAN_AUDIT

## Remaining work
- Continue passage 051 through 168 sequentially.
- For each passage: word-by-word vocabulary/grammar chronology -> rewrite only if genuinely needed -> synchronize dependent content -> human slash review.
- Re-render/DOM verify the newly repaired 049/050 and future manual batches; do not rely only on old static semantic dump files.
- After 168/168: full vocabulary/grammar/slash/A+B/coverage/DOM/browser/print regression.
- After regression: public main/GitHub Pages and both print modes verification.

## Exact stop point this run
Passage 050 New Horizon G1 Unit 4-2 has been human-audited and the genuine vocabulary/grammar leaks were repaired in the final runtime layer. Passage 051 has not yet been audited in this phase.

## Next start point
Passage 051 New Horizon G1 Unit 4-3.

## Next phase after current
Continue sequentially 051-168 -> FULL_REGRESSION -> PUBLIC_VERIFY

## Final-purpose remaining major stages
1. Human vocabulary + slash audit 051-168.
2. Repair/synchronize any genuine vocabulary failures found.
3. Re-render/DOM verification of final manual overrides.
4. Full automated and browser/print regression after 168/168.
5. Public Pages verification and unresolved-failure repair loop.

## Latest status
- vocabulary audit: 50/168
- slash human audit: 50/168
- vocabulary-driven English rewrites: 2
- notes confirmed: 0
- next: 051
- unresolved: old static semantic dump for 049/050 still reflects pre-final-manual text until re-render workflow is run/updated; runtime final loader has the repaired data.
