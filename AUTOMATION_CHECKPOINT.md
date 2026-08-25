# Long-reading app vocabulary / grammar / notes checkpoint

Updated: 2026-08-25 JST (manual continuation)

## Source of truth / safety
- Repo: `yo666ha-boop/reading-app`.
- Work branch: `v10-vocab-grammar-notes-audit`.
- Public `main`: `1f0cabf9bfcc4482f507e33188499bdbbd5bab57`; NOT modified.
- Sole vocabulary authority: native Sheet `1AkKYV6h-9ZCq1-p8126u4t8z0pvPSRnHlOfY8C-3hH4`, tab `単語マスター`, 3975 canonical records.
- Final runtime order re-read this run: semantic/final repairs -> manual vocab/slash corrections -> loaded passage-local note batch2 -> reference chronology prepare -> reference slash files -> final chronology apply -> runtime complete.

## Completed this run
- Re-read work branch/main/checkpoint/latest Actions/workflow/final runtime order before edits.
- Resolved and verified loaded passage-local families `badge/checklist/ocean/production/race/researchers/trash/white/basketball/straw`, then `compare/detective/road/route/vegetables/visitors/bicycle/event/house`, without cumulative or cross-textbook whitelisting.
- Fixed notes UI regression test so a passage that now legitimately has notes is not hard-coded as the zero-note fixture. Current notes UI gate PASS.
- Added/verified further loaded local-note families `quokka/bento/button/consumption/donation/Hokkaido/kangaroo/poster/remaining`.
- Updated `.github/workflows/v10-vocab-grammar-notes-audit.yml` so `v10_passage_local_notes_batch*.js` changes directly trigger the authoritative audit instead of depending on incidental loader edits. Commit `1f8638e48863912db2c933d30ff48f277365972f`.
- Latest authoritative status after those loaded changes: audit 168/168; `520 unique / 2294 occurrences`; `FUTURE_V7_LEAK=871`; `UNREGISTERED_V7=1423`; `UNREGISTERED_PROPER=0`; notes `93`; `missing_gloss=0`; grammar candidates 168/168, 20 feature families; notes UI PASS.
- Continued into next unresolved group. Live-v7 checked `schoolchildren`, `term`, `shoe`, `everyday`, `architect`, `deck`, `value`, `skate`, `person`, `pirate`, `project`.
- High-leverage scanner defect found: explicitly tagged passage-local proper names were accepted only in bare form, so a legitimate possessive such as `Riko's` could leak even when `Riko` was explicitly marked as a proper name. Added bounded possessive handling only for explicitly tagged local proper names; capitalization alone is still forbidden. Scanner-fix commit `0d4c25f5d62b0911c0d1c78084e4873816cbb8c2`.
- Staged the next content-essential local-note set in `v10_passage_local_notes_batch3.js`: `schoolchildren`, `term`, `architect`, `deck`, `skate`, `value`, `person`, `pirate`, `project`, `data`, `horse`, `supporters`. Commit `cd0761763853382eab082c576107746af184a666`.
- IMPORTANT: batch3 is intentionally recorded as STAGED/PENDING, not verified or counted yet, because the current final loader still loads batch2 only. Do not claim batch3 reductions until it is inserted before chronology/reference sync and re-audited.
- `everyday` and `shoes` were deliberately not papered over with notes: `everyday` may need natural correction to `every day`; `shoes` needs exact base/phrase chronology handling because v7 contains `boat shoe` in SS2. These remain for direct resolution.

## Current exact VERIFIED state
- Vocabulary passages audited: `168/168`.
- Vocabulary chronology: FAIL / IN PROGRESS.
- VERIFIED unresolved: `520 unique / 2294 occurrences` = `871 FUTURE_V7_LEAK + 1423 UNREGISTERED_V7`.
- Verified notes: `93`.
- `missing_gloss=0` PASS.
- Grammar candidate coverage: `168/168`; 20 feature families; exact evidence-backed subunit chronology still pending, so grammar chronology remains FAIL-CLOSED/PENDING.
- Notes UI: PASS at latest authoritative status.
- Latest verified passage audit on prior content was SUCCESS; slash/browser/print had been PASS before these notes/scanner-only changes. Newest branch still requires fresh full run before claiming newest-content final PASS.
- Public main release: NOT performed.

## Actions / commits
- Authoritative loaded-content status source: `VOCAB_GRAMMAR_NOTES_AUDIT_STATUS.txt` currently records 520/2294/93/missing_gloss0/notes_ui PASS.
- Prior audit run on the loaded 9-family batch: `32824729378` SUCCESS; passage audit `32824729402` SUCCESS.
- Scanner-fix push run `32825004047` was cancelled by concurrency after later branch commit, not a test failure.
- Workflow now directly watches passage-local note batch files.

## Exact stop / next start
- Exact stop: branch contains proper-name-possessive scanner fix plus staged batch3, but batch3 is not yet in final runtime load order; latest VERIFIED vocabulary number remains 520/2294.
- Next start: re-read branch/main/Actions. Insert `v10_passage_local_notes_batch3.js` immediately after batch2 and before `v10_reference_chronology_sync.js` in final runtime loader, bump runtime build, then run authoritative audit. Verify actual reductions; do not infer them.
- After that, inspect/repair `everyday` contexts for correct `every day` vs adjective use, and resolve `shoes/shoe` via exact canonical base/phrase chronology rather than a blanket note. Continue descending through fresh unresolved list (`zealand`, `ant`, etc.) without stopping at a small batch.
- Once vocab leak reaches zero: build evidence-backed exact-subunit grammar introduction boundaries for all 20 detected grammar families, run grammar chronology to future_grammar_leak=0, then full slash reference/A+B evidence/coverage/DOM/Chromium/Firefox/WebKit-iPhone/A4 student+teacher print gates.
- Only after every gate PASS: merge/update `main`, verify live Pages, then stop the automation.
