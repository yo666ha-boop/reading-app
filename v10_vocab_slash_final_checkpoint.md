# V10 Vocabulary + Slash Final Audit Checkpoint

status: IN_PROGRESS
phase: VOCAB_AND_SLASH_HUMAN_AUDIT
started_at_jst: 2026-08-20 11:00
last_manual_progress_jst: 2026-08-20 11:07+

## Current verified baseline
- Semantic passage rebuild: 168/168 previously completed.
- Student print mode: English passage + current questions only; Japanese translation/slash/answers/evidence/explanations excluded.
- Teacher print mode: passage + translation + slash reading + current questions + answers/evidence/explanations.
- Canonical vocabulary basis: NH/SS 2026 vocabulary master plus the passage-level reviewed `allowedWords` classification that records exact-section, cumulative, textbook-confirmed, and elementary words.
- Important correction: absence from the keyword-table search alone is NOT proof that a word is out of scope when `allowedWords` explicitly classifies it as elementary or section-valid.
- Existing automated vocabulary/chronology/slash gates are NOT sufficient for this final pass.

## Final audit requirements
1. Re-check every final rendered passage word-by-word against the cumulative vocabulary available up to that exact textbook/grade/section, preserving reviewed elementary/textbook-confirmed allowances.
2. Classify lexical items as: in-scope / textbook-confirmed / elementary / proper noun / needs rewrite / note candidate.
3. Prefer rewriting with already-learned vocabulary; use student-facing notes only when truly unavoidable.
4. If passage English changes, synchronize full Japanese translation, slash reading, A/B questions, answers, evidence, evidence meanings, and reasons in the same repair set.
5. Re-audit slash reading for all 168 passages manually against the established model: read from the front in natural meaning chunks, not one sentence per slash and not mechanical word-count splitting.
6. Do not split be + complement, auxiliary + main verb, simple verb + object, or article + noun. Use readable semantic chunks for prepositional phrases, subordinate clauses, infinitive phrases, participial phrases, relative clauses, etc.
7. Japanese slash meanings must correspond chunk-by-chunk so students can build meaning left-to-right.
8. Final regression: vocabulary/grammar chronology, slash correspondence, A/B evidence integrity, 168/168 coverage, DOM, browser, student/teacher print, and public Pages.

## Reference rule confirmed
Project learning manual states that long passages should be understood from the front by meaning chunks, with the example pattern: `I went to the park / to play baseball / with my friends / yesterday.`

## Progress
- vocabulary_final_audited: 3/168
- slash_human_audited: 3/168
- passages_rewritten_this_phase: 0
- notes_confirmed: 0

## This run completed
- Started immediately rather than waiting for the next hourly run.
- Re-checked the vocabulary source hierarchy itself. The base passage data shows reviewed `allowedWords` for 001-003; this corrected an over-strict keyword-only interpretation before it could spread to later passages.
- 001: confirmed planned wording is in-scope under the reviewed gate, including `notebook` as elementary. Restored the planned notebook sentences. Slash human audit completed: short clauses remain intact; only the longer write sentences split before the place phrase (`I write “dog” / in my notebook.`).
- 002: confirmed `subject` is explicitly classified as `Get Ready 3` in `allowedWords`. Restored `What subject do you like?`. Slash human audit completed with short question/answer chunks left intact.
- 003: reviewed `allowedWords` explicitly covers basketball/club/practice/gym/every day/run/jump/high/shoot/ball/very/exciting/together/let’s and cumulative/basic words. Vocabulary PASS with notes=0. Slash human audit completed; only `I practice / in the gym / every day.` is split, while be+complement, can+verb, and verb+short-object units stay intact.
- Runtime/public overrides for 001-003 updated in `v10_interaction_metadata_nh_g3_u6_fix.js`.
- Durable detail ledger `v10_vocab_slash_manual_audit_001_010.md` updated through 003.

## Current phase
VOCAB_AND_SLASH_HUMAN_AUDIT

## Remaining work
- Continue passage 004 onward through 168.
- For each passage: reviewed vocabulary classification + canonical support -> rewrite only if genuinely needed -> translation/A+B sync if changed -> model-aligned slash human review.
- After 168/168: full vocabulary/grammar/slash/A+B/coverage/DOM/browser/print/public regression.

## Next start point
Passage 004 Sunshine G1 Get Ready 5. Verify zoo/panda/monkey/tiger/rabbit/bear and cumulative words using the reviewed gate/canonical support, then human-review every slash row.

## Next phase after current
Continue sequentially 004-168 -> FULL_REGRESSION -> PUBLIC_VERIFY
