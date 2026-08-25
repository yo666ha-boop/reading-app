# Long-reading app vocabulary / grammar / notes checkpoint

Updated: 2026-08-25 JST (manual continuation)

## Source of truth / safety
- Repo: `yo666ha-boop/reading-app`.
- Work branch: `v10-vocab-grammar-notes-audit`.
- Public `main`: `1f0cabf9bfcc4482f507e33188499bdbbd5bab57`; NOT modified.
- Sole vocabulary authority: native Sheet `1AkKYV6h-9ZCq1-p8126u4t8z0pvPSRnHlOfY8C-3hH4`, tab `単語マスター`, 3975 canonical records.
- Actual loader re-check this run: checked-in `v10_stage2.html` is the static 168-dataset shell. The authoritative audit layers additional semantic/vocab/reference scripts in its audit runtime; `v10_reference_runtime_audit.js` explicitly applies semantic repairs, vocab/manual repairs, chronology sync and reference slash files. Do not infer a checked-in script tag that is not present.

## Completed this run
- Re-read work branch HEAD, main HEAD, checkpoint, latest Actions, vocab audit workflow, `v10_stage2.html`, audit scanner and reference-runtime loader before edits.
- Starting branch HEAD was `a40aff9a007374b630f9907666d3f49d3b1381d6`; public main remained `1f0cabf9bfcc4482f507e33188499bdbbd5bab57`.
- Confirmed prior VERIFIED vocabulary state remains `520 unique / 2294 occurrences` = `871 FUTURE_V7_LEAK + 1423 UNREGISTERED_V7`; notes `93`; `missing_gloss=0`; 168/168 passages; grammar candidates 168/168 with 20 feature families.
- Found the actual audit-loading gap rather than assuming the checkpoint wording: the strict vocab wrapper waited for authoritative runtime completion but did not explicitly execute staged batch3 before token scanning.
- Patched `v10_vocab_notes_candidate_audit.js` so, after authoritative runtime reaches terminal `complete`, it explicitly executes bounded `v10_passage_local_notes_batch2.js` then `v10_passage_local_notes_batch3.js` before the 168 token scan. This preserves passage-local/non-cumulative note semantics and fails if either bounded file is missing.
- Patch commit: `a793e9c6fa54595442e01121bf84027d001dab0e` (`audit: load bounded notes batch3 in final vocab scan`).
- The patch triggered fresh Actions: vocab/grammar/notes audit run `32829169788` and passage audit run `32829170065`. At checkpoint-write time the vocab run was `in_progress`; therefore NO inferred post-batch3 counts are recorded yet.
- Re-read live canonical Sheet metadata: `単語マスター` is 3976 rows including header, 33 columns; header confirms English=O, Japanese=P, search base=AB, variants=AC.
- Live-v7 exact checks this run: `everyday` has no standalone English row and no search-base/variant row; `shoe` finds canonical phrase `boat shoe = デッキシューズ` only; `New Zealand = ニュージーランド` exists (row 353); exact standalone `ant` is not present in English rows (substring search only returned unrelated words such as want/plant/important).
- Fresh unresolved report contexts read directly: `zealand` 12 occurrences in NH1 Unit 4-1 (future canonical phrase boundary), `everyday` 11 occurrences across SS3 PROGRAM 6-3 / NH2 Unit 5-1 / NH3 Unit 5-4, `shoes` 11 occurrences in NH2 Unit 4-4, `ant` 10 occurrences in SS1 PROGRAM 4-1. Batch3 families `schoolchildren/term/architect/deck/skate/value/...` are confirmed immediately above these in the unresolved ranking.

## Current exact VERIFIED state
- Vocabulary passages audited: `168/168`.
- Vocabulary chronology: FAIL / IN PROGRESS.
- Last VERIFIED unresolved (before the newly triggered batch3 scan): `520 unique / 2294 occurrences` = `871 FUTURE_V7_LEAK + 1423 UNREGISTERED_V7`.
- Last verified notes: `93`.
- `missing_gloss=0` PASS.
- Grammar candidate coverage: `168/168`; 20 feature families; exact evidence-backed subunit chronology still pending, so grammar chronology remains FAIL-CLOSED/PENDING.
- Notes UI: prior authoritative PASS. New batch3 scan/run still pending at checkpoint-write time.
- Slash/browser/print: prior PASS evidence exists, but newest branch content requires fresh final runs before any final PASS claim.
- Public main release: NOT performed.

## Actions / commits
- New content/audit commit: `a793e9c6fa54595442e01121bf84027d001dab0e`.
- New authoritative vocab/grammar/notes run: `32829169788` — `in_progress` at checkpoint save.
- New passage-audit run: `32829170065` — triggered from same head; verify conclusion next run.
- Previous verified status source remains `VOCAB_GRAMMAR_NOTES_AUDIT_STATUS.txt` with 520/2294/93/missing_gloss0 until run `32829169788` persists a newer authoritative report.

## Exact stop / next start
- Exact stop: batch3 is now explicitly connected to the authoritative 168-passage vocabulary scan and CI is running; post-batch3 counts are not yet known. The checked-in public/static stage2/reference runtime path has NOT yet been declared final for batch3 just from scanner injection.
- Next start: read branch/main and run `32829169788` first. If SUCCESS, read newly persisted `VOCAB_GRAMMAR_NOTES_AUDIT_STATUS.txt` + `v10_vocab_unresolved_unique.json` and record actual reduced counts. If FAIL, read job/log evidence and repair from the exact failing stage.
- Then resolve `everyday` by inspecting each final-runtime sentence to distinguish adjective `everyday` from erroneous adverbial `every day`; do not blanket-note it. Resolve `shoes` against the `boat shoe` phrase without treating that phrase as a global standalone `shoe` license. Resolve `zealand` as the `New Zealand` phrase at its exact NH1 chronology boundary, not as a free token. Resolve `ant` from passage context; if indispensable and still v7-absent, use a passage-local gloss only.
- Continue descending through unresolved tokens without stopping at a small batch. Once vocab leak reaches zero, complete evidence-backed exact-subunit grammar introductions for all 20 families and run grammar chronology to `future_grammar_leak=0`.
- Then run slash reference 168/168, A+B evidence, coverage/DOM, Chromium/Firefox/WebKit-iPhone, A4 student/teacher print. Only after every gate PASS may main be updated and live Pages verified; only then stop automation.
