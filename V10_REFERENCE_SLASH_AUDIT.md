# V10 Reference-Based Slash Audit

status: ACTIVE
phase: FULL_168_REFERENCE_REAUDIT
started_at_jst: 2026-08-20 19:18+
last_run_jst: 2026-08-20 19:42+
branch: v10-reference-slash-audit

## Why the previous COMPLETE state is invalid
The previous final audit used a generic `front-to-back meaning chunks` rule set and reported:
- passages: 168/168
- rows: 1856
- slashes: 450
- unsplit rows: 1409

The user-visible production example showed that this generic pass is too sparse compared with the supplied reference. Therefore the old `slash_human_audited: 168/168 COMPLETE` is invalid for reference-quality approval.

## Authoritative source of truth — now recovered and inspected
The user re-supplied the exact reference pair in the conversation:
- `英語長文基本.pdf` — 46 pages
- `英語長文基本解答.pdf` — 10 pages

Both rendered page sets are available and were inspected. The answer book is authoritative for slash placement and the corresponding left-to-right Japanese support line. Total pages reviewed: 56.

The previous assumption that these PDFs were still unavailable is obsolete. Do not return to source-recovery waiting.

## Reference-derived slash style
The reference is noticeably finer than the old runtime. Representative examples from `英語長文基本解答.pdf` include:
- `Thank you. / I visited America / last year / and stayed there / for two months.`
- `I went to school / to study English. / Also, / I'm in the English club / in this school.`
- `What did you do / last Sunday, / Kenta?`
- `If you are interested, / you should go / on a weekday. / The movie is very popular, / so a lot of people go to see it / on the weekend.`
- `The book was written / by a famous writer.`
- `I played soccer / at school / in Canada / for three years.`
- `I didn't know / that there is a soccer team / in this school.`
- `Playing in bad weather / isn't difficult / for me.`

Reference behavior:
1. Use fine, useful left-to-right meaning chunks; do not leave most longer sentences unsplit.
2. Time/place/duration phrases are frequently independent chunks.
3. Purpose infinitives are commonly separated.
4. If/because/when and other subordinate clauses are commonly separated.
5. Major coordinated units and discourse markers may be separated.
6. Prepositional and passive-agent phrases may form their own chunks.
7. Content clauses after know/think may be separated.
8. Short markers such as `Yes,`, `Well,`, `Also,`, `Sure.` may be isolated.
9. Questions may split before time/place/vocative units.
10. A generic rule such as “never split be + complement” is not authoritative; the reference itself has `Playing in bad weather / isn't difficult / for me.` and `The book was written / by a famous writer.`
11. Short/simple complete sentences are not mechanically split; examples such as `You speak English very well.` and `Have you ever played soccer?` remain whole.
12. Japanese support must follow the English chunk order and granularity; it is not merely a natural full translation placed below.
13. No fixed word-count algorithm.

Full rules and benchmark examples are recorded in `v10_reference_slash_rules.json` with:
- `verified_complete: true`
- `reference_files_read: 2`
- `reference_pages_read: 56`

## Correction to earlier local diagnosis
The main screenshot defect is the global slash density/style mismatch: several longer neighboring sentences are unsplit while the reference would normally break meaningful time/place/purpose/clause units.

Do **not** automatically reject `The population is now / in danger.` merely because a be/predicate sequence is split. The actual reference permits comparable predicate/prepositional splitting. That row must be judged in context against the reference style, not against the old generic ban.

## Current engineering state
Completed this pass:
- actual references recovered: 2/2
- actual reference pages reviewed: 56/56
- reference rulebook: EXTRACTED
- benchmark examples: RECORDED
- false-complete prevention gate: INSTALLED
- branch workflow reference gate: INSTALLED
- automation resume prompt: UPDATED so it never goes back to “PDF missing”
- passage 001 source/slash record opened for first reference-based re-audit

Still required:
1. Re-audit passages 001 through 168 sentence-by-sentence and slashRow-by-slashRow against the actual reference style.
2. Repair TOO_FEW_SLASHES / TOO_MANY_SLASHES / WRONG_BOUNDARY / CLAUSE_BOUNDARY_MISSED / MODIFIER_BOUNDARY_MISSED / EN_JP_CHUNK_MISMATCH / FRONT_READ_JP_UNNATURAL / NATURAL_TRANSLATION_MISMATCH / SHORT_SENTENCE_SHOULD_REMAIN_UNSPLIT.
3. Replace old generic quality heuristics where they conflict with the reference.
4. Re-run full 168 coverage, vocabulary/grammar chronology, A/B evidence integrity, DOM, Chromium/Firefox/WebKit, iPhone-equivalent, A4 print, and public-page validation.
5. Only then mark COMPLETE.

## Progress checkpoint
- reference PDFs opened: 2/2
- reference pages reviewed: 56/56
- reference rulebook: COMPLETE
- passages opened in new reference pass: 1/168
- passages fully re-audited/repaired in new reference pass: 0/168
- final regression: NOT STARTED

## Resume point
Continue passage 001 immediately using the reference-derived rules, then proceed 002 → 168 without stopping at artificial batch boundaries. If execution is interrupted, resume from the exact last completed passage/sentence recorded here and continue until final regression and public validation pass.
