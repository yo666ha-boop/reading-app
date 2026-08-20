# V10 Vocabulary + Slash Final Audit Checkpoint

status: IN_PROGRESS
phase: VOCAB_AND_SLASH_HUMAN_AUDIT
started_at_jst: 2026-08-20 11:00
last_manual_progress_jst: 2026-08-20 11:07+

## Current verified baseline
- Semantic passage rebuild: 168/168 previously completed.
- Student print mode: English passage + current questions only; Japanese translation/slash/answers/evidence/explanations excluded.
- Teacher print mode: passage + translation + slash reading + current questions + answers/evidence/explanations.
- Canonical vocabulary source: NH/SS 2026 vocabulary master, cumulative by textbook/grade/section.
- Existing automated vocabulary/chronology/slash gates are NOT sufficient for this final pass.

## Final audit requirements
1. Re-check every final rendered passage word-by-word against the cumulative canonical vocabulary available up to that exact textbook/grade/section.
2. Classify lexical items as: in-scope / textbook-confirmed / proper noun / needs rewrite / note candidate.
3. Prefer rewriting with already-learned vocabulary; use student-facing notes only when truly unavoidable.
4. If passage English changes, synchronize full Japanese translation, slash reading, A/B questions, answers, evidence, evidence meanings, and reasons in the same repair set.
5. Re-audit slash reading for all 168 passages manually against the established model: read from the front in natural meaning chunks, not one sentence per slash and not mechanical word-count splitting.
6. Do not split be + complement, auxiliary + main verb, simple verb + object, or article + noun. Use readable semantic chunks for prepositional phrases, subordinate clauses, infinitive phrases, participial phrases, relative clauses, etc.
7. Japanese slash meanings must correspond chunk-by-chunk so students can build meaning left-to-right.
8. Final regression: vocabulary/grammar chronology, slash correspondence, A/B evidence integrity, 168/168 coverage, DOM, browser, student/teacher print, and public Pages.

## Reference rule confirmed
Project learning manual states that long passages should be understood from the front by meaning chunks, with the example pattern: `I went to the park / to play baseball / with my friends / yesterday.`

## Progress
- vocabulary_final_audited: 2/168
- slash_human_audited: 2/168
- passages_rewritten_this_phase: 2
- notes_confirmed: 0

## This run completed
- Re-opened the actual final audit from passage 001 instead of waiting for the next scheduled run.
- 001: canonical re-check found `notebook` unsupported in the Sunshine master search while dog/cat/book/read/write are confirmed earlier. Rewrote the two notebook sentences to `I write “dog”.` / `I write “cat”, too.`; synchronized translation, A question 3, B question 3, evidence and reasons; notes remain 0.
- 001 slash human audit: removed forced splits (`This is / ...`, `I can read / ...`) and kept short meaning units intact.
- 002: `subject` was not found in the relevant canonical Sunshine vocabulary range. Rewrote `What subject do you like?` to `What do you like?`; synchronized translation, A question 1, B question 1 and evidence/reasons; notes remain 0.
- 002 slash human audit: removed grammar-drill splits such as `I like / English.` and `Can you read / English?`; short question/answer units remain intact.
- Added durable detail ledger `v10_vocab_slash_manual_audit_001_010.md`.
- Runtime/public data patch committed on main in `v10_interaction_metadata_nh_g3_u6_fix.js` so the app uses these 001-002 corrections.

## Current phase
VOCAB_AND_SLASH_HUMAN_AUDIT

## Remaining work
- Continue passage 003 onward through 168.
- For each passage: canonical vocabulary classification -> rewrite if needed -> translation/A+B sync -> model-aligned slash human review.
- After 168/168: full vocabulary/grammar/slash/A+B/coverage/DOM/browser/print/public regression.

## Next start point
Passage 003 Sunshine G1 Get Ready 4. Verify basketball/club/practice/gym/run/jump/high/shoot/ball/exciting/together against the cumulative canonical master, repair only if needed, then human-review every slash row.

## Next phase after current
Continue sequentially 003-168 -> FULL_REGRESSION -> PUBLIC_VERIFY
