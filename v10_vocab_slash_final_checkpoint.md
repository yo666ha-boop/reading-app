# V10 Vocabulary + Slash Final Audit Checkpoint

status: IN_PROGRESS
phase: VOCAB_AND_SLASH_HUMAN_AUDIT
started_at_jst: 2026-08-20 11:00
last_manual_progress_jst: 2026-08-20 12:00+

## Baseline and rules
- Semantic passage rebuild: 168/168 previously completed.
- Student print: English passage + current questions only. Teacher print: passage + translation + slash + same questions + answers/evidence/explanations.
- Vocabulary basis: canonical NH/SS 2026 master + reviewed exact-section/cumulative/textbook-confirmed/elementary gates; grammar/form chronology is checked too.
- Slash basis: front-to-back meaning chunks; do not break be+complement, auxiliary+verb, simple verb+short object, article+noun, or fixed phrases.

## Progress
- vocabulary_final_audited: 70/168
- slash_human_audited: 70/168
- passages_rewritten_this_phase: 12
- notes_confirmed: 0

## This run completed
- Corrected the 051-060 ledger after a broader cumulative source check proved passage 053 `water` is valid from `Sounds and Letters 3 cumulative`. Restored `The dolphin is in the water.` through final correction layer `v10_vocab_slash_manual_corrections.js`; passage 053 is no longer counted as a rewrite.
- Therefore genuine rewrites through 060 = 5: 049, 050, 051, 052, 057.
- Continued immediately through 061-070 instead of stopping at 060.
- 061 Unit 8-1: removed uncertain bare `help them`; retained clearly licensed teach/respect/become/in need/do my best content; A/B/translation/slash synchronized.
- 062 Unit 8-2: removed premature `again` (canonical introduction later in Unit 8 Stage Activity 2) and unapproved plural `Straws` in title; rebuilt/synchronized.
- 063 Unit 8-3: removed auto-generated positive 3sg `wants`; rebuilt as `A group is in the village. They want to build a well.`; synchronized.
- 064 Unit 9-1: replaced premature past be `was` with present `is`; Unit 9-1 explicitly unlocks met/went/saw, while `was` is introduced at Unit 10-1.
- 065 Unit 9-2: vocabulary/slash PASS.
- 066 Unit 9-3: vocabulary/slash PASS; `again` is cumulative by this point.
- 067 Unit 10-1: removed unreviewed `that` complement clause after `realize`; reflection remains through `remember my mistake`.
- 068 Unit 10-2: replaced unreviewed `I remember that we won, too.` with `I remember the contest, too.` and synchronized A/B/translation/slash.
- 069 Unit 10-3: vocabulary/slash PASS.
- 070 Sunshine G2 PROGRAM 1-1: removed too-early `news` (canonical Sunshine G2 Reading 1, later than PROGRAM 1-1) and replaced first sentence with `I have a special plan.`; translation/slash synchronized.
- Genuine rewrites in 061-070 = 7. Cumulative genuine rewrites = 12.
- `v10_vocab_slash_manual_061_070.js` summary corrected to rewritten=7, commit `8a4a5eed1909b71afbaa69467392a191ea0deee5`.
- `v10_interaction_metadata.js` now loads `v10_vocab_slash_manual_061_070.js` and then `v10_vocab_slash_manual_corrections.js` LAST, commit `9033feab42d5c4fc38ae6e013f1e5953981e7277`. This makes final manual decisions authoritative over earlier semantic/automatic layers.
- Detailed ledgers corrected/created: `v10_vocab_slash_manual_audit_051_060.md` commit `1a591382024e364fc1558ed153e28c25595c3460`; `v10_vocab_slash_manual_audit_061_070.md` commit `48815cd6a8f0a2b11cd63577e1379f77928af2fb`.

## Completed ranges
- 001-010 COMPLETE
- 011-020 COMPLETE
- 021-030 COMPLETE
- 031-040 COMPLETE
- 041-050 COMPLETE
- 051-060 COMPLETE (053 false alarm restored; genuine rewrites 051/052/057)
- 061-070 COMPLETE (genuine rewrites 061/062/063/064/067/068/070)

## Current phase
VOCAB_AND_SLASH_HUMAN_AUDIT

## Exact stop point
Passage 070 Sunshine G2 PROGRAM 1-1 completed, synchronized, connected to final runtime loader, and durably recorded. Passage 071 has not yet been human-audited in this phase.

## Next start point
Passage 071.

## Remaining major work
1. Human vocabulary + slash audit 071-168.
2. Repair/synchronize genuine vocabulary/grammar failures as found.
3. Update semantic render/regression workflow so final manual override files on main are exercised; re-render final passages and verify DOM/coverage.
4. Full vocabulary/grammar/slash/A+B/browser/print regression after 168/168.
5. Public GitHub Pages verification; repair/retest loop until no unresolved failure.

## Current unresolved verification item
Static `semantic_passages/*.txt` files predate the newest final manual runtime layers. The runtime loader is now connected through passage 070, including the final correction layer, but a main-branch render/regression path still needs to be enabled/run before claiming actual rendered-dump/browser verification of the newest overrides.
