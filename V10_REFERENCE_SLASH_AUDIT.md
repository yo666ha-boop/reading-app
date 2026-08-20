# V10 Reference-Based Slash Audit

status: ACTIVE
phase: FULL_168_REFERENCE_REAUDIT
started_at_jst: 2026-08-20 19:18+
last_run_jst: 2026-08-20 19:48+
branch: v10-reference-slash-audit

## Authoritative source of truth
The user re-supplied and confirmed these exact references:
- `英語長文基本.pdf` — 46 pages
- `英語長文基本解答.pdf` — 10 pages

Both rendered page sets were inspected. The answer book is authoritative for slash placement and the left-to-right Japanese support line. Total pages reviewed: 56/56. Do not return to “PDF missing” source recovery.

## Why the old COMPLETE state is invalid
The old generic audit reported 168/168, 1856 rows, only 450 slashes and 1409 unsplit rows. It used generic `front-to-back meaning chunks`, not the supplied answer-book pattern. The user-visible long-passage example confirmed the result is too sparse. Old `slash_human_audited: 168/168 COMPLETE` is invalid.

## Reference-derived style
Representative answer-book examples:
- `Thank you. / I visited America / last year / and stayed there / for two months.`
- `I went to school / to study English. / Also, / I'm in the English club / in this school.`
- `What did you do / last Sunday, / Kenta?`
- `If you are interested, / you should go / on a weekday. / The movie is very popular, / so a lot of people go to see it / on the weekend.`
- `The book was written / by a famous writer.`
- `I played soccer / at school / in Canada / for three years.`
- `I didn't know / that there is a soccer team / in this school.`
- `Playing in bad weather / isn't difficult / for me.`

Rules are recorded in `v10_reference_slash_rules.json` (`verified_complete=true`, files=2, pages=56). Main implications: relatively fine front-to-back chunks; frequent time/place/duration/purpose/subordinate/content-clause chunks; discourse markers can be isolated; Japanese must track the English chunk order; short/simple sentences are not forced; no generic ban such as “never split be + complement”; no fixed word-count splitter.

## Correction to the earlier local diagnosis
The screenshot’s main defect is global density/style mismatch. `The population is now / in danger.` must not be auto-rejected just because the predicate is split: the reference permits comparable predicate/prepositional chunking. Judge every row by the supplied model, not generic grammar heuristics.

## Engineering work completed
- Reference rule file completed from the actual PDFs.
- `v10_reference_slash_gate.js` prevents false completion without source-derived rules.
- Draft PR #4 opened from `v10-reference-slash-audit`; main remains untouched.
- `v10_reference_runtime_dump.js` added so CI prints the effective current rows for all 168 passages.
- Workflow runs the reference gate and full runtime dump before legacy gates.
- `v10_reference_slash_manual_001_168.js` added as the final runtime layer after all older slash overrides.
- `v10_interaction_metadata.js` now loads that reference layer last.
- Passage 001: corrected over-splitting of short core clauses (`This is / my English book.`, `I can read / “dog”.`, etc.); retained useful place chunks.
- Passage 002: removed artificial WH/object, verb/object, and Yes/auxiliary splits in short simple clauses.
- Passage 003: retained `I practice / in the gym / every day.` but removed over-splitting in short cores such as `I like basketball.`, `I can jump high.`, `Basketball is very exciting.`.
- Passages 004-010: re-read against the supplied answer-book pattern; current final rows match the reference style and are marked `PASS_REFERENCE_20260820`.

## Progress checkpoint
- reference PDFs opened: 2/2
- reference pages reviewed: 56/56
- reference rulebook: COMPLETE
- passages fully committed as reference-audited: 10/168
- last completed passage: 010 `PROGRAM 2-2`
- next passage: 011 `PROGRAM 2-3`
- final regression: NOT STARTED

## Required continuation
Continue 011 → 168 without stopping at artificial 10/20-passage boundaries. For every passage check every sentence and every EN/JP slash row for TOO_FEW_SLASHES / TOO_MANY_SLASHES / WRONG_BOUNDARY / CLAUSE_BOUNDARY_MISSED / MODIFIER_BOUNDARY_MISSED / EN_JP_CHUNK_MISMATCH / FRONT_READ_JP_UNNATURAL / NATURAL_TRANSLATION_MISMATCH / SHORT_SENTENCE_SHOULD_REMAIN_UNSPLIT. Change the English passage only if independently necessary; if English changes, synchronize A/B questions, answers and evidence. After 168/168, replace conflicting legacy heuristics, run full coverage, vocabulary/grammar chronology, A/B evidence integrity, DOM, Chromium/Firefox/WebKit, iPhone-equivalent, A4 print and public-page validation. Only then mark COMPLETE and merge/release.

## Resume point
Passage 011 `PROGRAM 2-3`, row 1. Continue forward continuously to 168. If interrupted, resume from the exact last committed passage/row in this checkpoint.
