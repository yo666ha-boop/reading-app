# V10 Reference-Based Slash Audit

status: REOPENED
phase: SOURCE_REFERENCE_RECOVERY_AND_RULE_EXTRACTION
started_at_jst: 2026-08-20 19:18+
last_run_jst: 2026-08-20 19:25+
branch: v10-reference-slash-audit

## Why the previous COMPLETE state is invalid
The previous final audit used a generic rule set described as `front-to-back meaning chunks` and reported:
- passages: 168/168
- rows: 1856
- slashes: 450
- unsplit rows: 1409

A user-visible production example exposed that this is not sufficient and does not match the supplied long-reading reference material. The defect is not just one bad slash position: many longer sentences are left with no slash at all, while some existing cuts break a natural unit (example reported by the user: `The population is now / in danger.`).

Therefore the previous `slash_human_audited: 168/168 COMPLETE` must not be treated as reference-quality approval.

## Source of truth
The only allowed benchmark for this pass is the user-supplied reference pair:
- `英語長文基本.pdf`
- `英語長文基本解答.pdf`

The second file was supplied specifically as the model for slash-reading placement and the corresponding Japanese reading/translation presentation.

Do not substitute generic slash-reading theory for these files.

## Required execution order
1. Recover/open both reference PDFs.
2. Review them from first page to last page.
3. Extract an explicit reference rulebook from real examples:
   - where slashes are inserted
   - where they are intentionally omitted
   - how fine/coarse the chunks are
   - treatment of clauses, infinitives, prepositional phrases, conjunctions, modifiers, fixed expressions, complements, and short sentences
   - how the Japanese line corresponds to each English chunk
   - distinction between front-to-back reading support and natural full translation
4. Build a benchmark set of representative examples from the PDFs.
5. Re-audit all 168 passages from passage 001 through 168, sentence by sentence and slash row by slash row.
6. Repair every mismatch; do not only patch examples found by the user.
7. Recheck English/Japanese chunk alignment and natural full translation.
8. Recheck A/B questions/evidence if any English sentence changes.
9. Re-run vocabulary/grammar chronology, DOM, browser, iPhone-equivalent, and print checks.
10. Only then mark the slash audit COMPLETE.

## Failure categories to record
- TOO_FEW_SLASHES
- TOO_MANY_SLASHES
- WRONG_BOUNDARY
- FIXED_UNIT_SPLIT
- CLAUSE_BOUNDARY_MISSED
- MODIFIER_BOUNDARY_MISSED
- EN_JP_CHUNK_MISMATCH
- FRONT_READ_JP_UNNATURAL
- NATURAL_TRANSLATION_MISMATCH
- SHORT_SENTENCE_SHOULD_REMAIN_UNSPLIT

## Confirmed production failure example
From the user screenshot:
- `The population is now / in danger.` -> current boundary is invalid because `in danger` is split from the predicate unit.
- Multiple longer neighboring sentences contain no slash at all, showing that the current global slash density/rules are too sparse relative to the reference target.

## Current source-recovery status
### 2026-08-20 19:25+ retry
- Re-read this checkpoint before work.
- File Library searched again with exact names and semantic combinations for `英語長文基本`, `英語長文基本解答`, `スラッシュリーディング`, and `長文問題 見本`.
- The two required PDFs were still not returned. The search instead returned the current app `index.html` and unrelated study-method materials.
- GitHub branch contents were inspected again; the reference PDFs are not stored in `v10-reference-slash-audit`.
- Current app/runtime is present and recoverable; `index.html` loads the full grade/textbook data modules and the slash display.
- No reference-derived edits were made, because doing so before opening the two PDFs would violate the explicit no-guessing requirement.

This missing-reference state must never be papered over by guessing. Continue source recovery first; once the reference PDFs are available, proceed through all 168 passages without stopping at batch boundaries.

## Progress checkpoint
- reference PDFs opened: 0/2
- reference pages reviewed: 0/?
- reference rulebook: NOT YET EXTRACTED
- benchmark examples: 0
- passages re-audited against actual reference: 0/168
- passages repaired in this pass: 0
- final regression: NOT STARTED

## Resume point
Recover/open `英語長文基本.pdf` and `英語長文基本解答.pdf`, then begin page-1-to-final-page extraction. Do not resume the old generic 168/168 COMPLETE state. If the PDFs become accessible, immediately continue through rule extraction and the 168-passage audit without pausing for a progress-only report.
