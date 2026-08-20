# V10 Vocabulary + Slash Final Audit Checkpoint

status: IN_PROGRESS
phase: VOCAB_AND_SLASH_HUMAN_AUDIT
started_at_jst: 2026-08-20 11:00
last_manual_progress_jst: 2026-08-20 11:35+

## Current verified baseline
- Semantic passage rebuild: 168/168 previously completed.
- Student print mode: English passage + current questions only; Japanese translation/slash/answers/evidence/explanations excluded.
- Teacher print mode: passage + translation + slash reading + current questions + answers/evidence/explanations.
- Canonical vocabulary basis: NH/SS 2026 vocabulary master plus passage-level reviewed `allowedWords` classifications recording exact-section, cumulative, textbook-confirmed, and elementary words.
- Missing keyword-table rows alone are not proof that a reviewed elementary/textbook word is out of scope.
- Existing automated vocabulary/chronology/slash gates are not sufficient for this final pass; human review is required.

## Final audit requirements
1. Re-check every final rendered passage word-by-word against vocabulary available up to that exact textbook/grade/section, preserving reviewed elementary/textbook-confirmed allowances.
2. Classify lexical items as in-scope / textbook-confirmed / elementary / proper noun / needs rewrite / note candidate.
3. Prefer rewriting with already-learned vocabulary; use notes only when unavoidable.
4. If English changes, synchronize full Japanese translation, slash reading, A/B questions, answers, evidence, evidence meanings, and reasons in the same repair set.
5. Human-review slash reading for all 168 passages against the front-to-back meaning-chunk model.
6. Do not split be+complement, auxiliary+main verb, simple verb+short object, or article+noun. Split only at meaningful place/time/reason/clause/phrase boundaries.
7. Japanese slash meanings must correspond chunk-by-chunk.
8. Final regression after 168/168: vocabulary/grammar chronology, slash correspondence, A/B evidence integrity, coverage, DOM, browser, student/teacher print, public Pages.

## Reference rule confirmed
Project learning manual example: `I went to the park / to play baseball / with my friends / yesterday.`

## Progress
- vocabulary_final_audited: 20/168
- slash_human_audited: 20/168
- passages_rewritten_this_phase: 0
- notes_confirmed: 0

## This run completed
- Continued immediately from 004 and completed the human vocabulary + slash review through passage 020.
- 004-010: manual runtime slash overrides created in `v10_vocab_slash_manual_004_010.js`; detailed ledger `v10_vocab_slash_manual_audit_001_010.md` complete 10/10.
- 011-020: manual runtime slash overrides created in `v10_vocab_slash_manual_011_020.js`; detailed ledger `v10_vocab_slash_manual_audit_011_020.md` complete 10/10.
- Loader updated so both manual override files load after `v10_semantic_runtime_final_fixes.js`; therefore human-reviewed slash rows override the earlier automatic slash rebuild.
- No vocabulary-driven English rewrite was required in 004-020. Reviewed section/cumulative/elementary vocabulary gates remained valid and no student-facing note was needed.
- Human slash review removed widespread grammar-drill splits (`be / complement`, `like / object`, `can VERB / object`) and retained slashes only for real meaning chunks such as time/place adjuncts or clause boundaries.

## Current phase
VOCAB_AND_SLASH_HUMAN_AUDIT

## Remaining work
- Continue passage 021 through 168 in sequence.
- For each passage: vocabulary classification -> rewrite only if genuinely needed -> synchronize dependent content -> human slash review.
- After 168/168 run full vocabulary/grammar/slash/A+B/coverage/DOM/browser/print/public regression.

## Next start point
Passage 021 Sunshine G1 PROGRAM 6-1. Inspect the final effective passage and its reviewed vocabulary gate, then replace any remaining grammar-drill slash splits with model-aligned meaning chunks.

## Next phase after current
Continue sequentially 021-168 -> FULL_REGRESSION -> PUBLIC_VERIFY
