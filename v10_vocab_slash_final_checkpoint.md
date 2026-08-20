# V10 Vocabulary + Slash Final Audit Checkpoint

status: IN_PROGRESS
phase: BASELINE_AND_FULL_REAUDIT
started_at_jst: 2026-08-20 11:00

## Current verified baseline
- Semantic passage rebuild: 168/168 previously completed.
- Student print mode: English passage + current questions only; Japanese translation/slash/answers/evidence/explanations excluded.
- Teacher print mode: passage + translation + slash reading + current questions + answers/evidence/explanations.
- Canonical vocabulary source: NH/SS 2026 vocabulary master, cumulative by textbook/grade/section.
- Existing automated vocabulary/chronology/slash gates are NOT sufficient for this final pass.

## New final audit requirements
1. Re-check every final rendered passage word-by-word against the cumulative canonical vocabulary available up to that exact textbook/grade/section.
2. Classify every lexical item as: in-scope / textbook-confirmed / proper noun / needs rewrite / note candidate.
3. Prefer rewriting with already-learned vocabulary; use student-facing notes only when truly unavoidable.
4. If passage English changes, synchronize full Japanese translation, slash reading, A/B questions, answers, evidence, evidence meanings, and reasons in the same repair set.
5. Re-audit slash reading for all 168 passages manually against the established model: read from the front in natural meaning chunks, not one sentence per slash and not mechanical word-count splitting.
6. Do not split be + complement, auxiliary + main verb, simple verb + object, or article + noun. Use readable semantic chunks for prepositional phrases, subordinate clauses, infinitive phrases, participial phrases, relative clauses, etc.
7. Japanese slash meanings must correspond chunk-by-chunk so students can build meaning left-to-right.
8. Final regression: vocabulary/grammar chronology, slash correspondence, A/B evidence integrity, 168/168 coverage, DOM, browser, student/teacher print, and public Pages.

## Reference rule confirmed
Project learning manual states that long passages should be understood from the front by meaning chunks, with the example pattern: `I went to the park / to play baseball / with my friends / yesterday.`

## Progress
- vocabulary_final_audited: 0/168
- slash_human_audited: 0/168
- passages_rewritten_this_phase: 0
- notes_confirmed: 0

## This run completed
- Re-opened final audit as a separate post-release quality phase.
- Confirmed canonical NH/SS vocabulary master is available.
- Confirmed the project reference explicitly requires front-to-back meaning-chunk slash reading.
- Enabled hourly continuation until the full 168-passage vocabulary + slash audit is complete.

## Current phase
BASELINE_AND_FULL_REAUDIT

## Remaining work
- Extract and classify vocabulary differences for all 168 effective rendered passages.
- Repair out-of-scope vocabulary and synchronize all dependent content.
- Human-review all 168 slash rows against the meaning-chunk model.
- Run full regression and public verification.

## Next start point
Passage 001. Build the per-passage vocabulary classification and slash-review ledger, then continue sequentially without skipping.

## Next phase after current
VOCAB_FULL_AUDIT_001_168 -> VOCAB_REPAIRS -> SLASH_HUMAN_AUDIT_001_168 -> FULL_REGRESSION -> PUBLIC_VERIFY
