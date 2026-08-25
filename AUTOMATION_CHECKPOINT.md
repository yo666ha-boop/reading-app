# Long-reading app vocabulary / grammar / notes checkpoint

Updated: 2026-08-25 JST (manual continuation, batch14 verified)

## Source of truth / safety
- Repo: `yo666ha-boop/reading-app`.
- Work branch: `v10-vocab-grammar-notes-audit`.
- Public `main`: `1f0cabf9bfcc4482f507e33188499bdbbd5bab57`; NOT modified.
- Sole vocabulary authority: native Sheet `1AkKYV6h-9ZCq1-p8126u4t8z0pvPSRnHlOfY8C-3hH4`, tab `単語マスター`, 3975 canonical records. This run re-read native-sheet metadata: 3976 rows including header, 33 columns, tab sheetId `109187341`, and exported/read the native workbook for bounded v7 checks.
- Authoritative audit waits for `V10_RUNTIME_LOAD_PROGRESS=complete`, then applies passage-local proper-name batches 1-4 and notes batches 2-14 before scanning all 168 passages. Notes are exact-passage/non-cumulative; proper names require explicit local tagging and capitalization.

## Completed this run
- Re-read branch HEAD, main HEAD, checkpoint, latest Actions, workflow path filters, and authoritative final-runtime load order before editing. Public main remained `1f0cabf9bfcc4482f507e33188499bdbbd5bab57`.
- Re-downloaded authoritative baseline artifact `9566464062` from run `32856710276` and parsed actual unresolved JSON. Baseline was `301 unique / 831 occurrences` = `252 FUTURE_V7_LEAK + 579 UNREGISTERED_V7`; notes `360`; `missing_gloss=0`; passages `168/168`.
- Enumerated the complete 84-token four-occurrence cohort; did not stop after 10/20.
- Re-checked canonical v7 evidence for the high-risk front. Kept morphology/same-section candidates such as `grew`, `four`, `forms` out of blanket notes pending grammar/order proof.
- Added `v10_passage_local_notes_batch14.js` with 54 distinct unambiguous four-occurrence token families (55 exact-passage definitions because `evening` spans two passages). Notes are exact-passage only; no global allowlist. Content commit `ca62d640e8703312522cb66f9cc0d4382eac0743`.
- Updated authoritative scanner to load batch14 after final runtime completion. Scanner commit `d2c455272bab7c6191dc801bb3b8e6c62726728d`.
- Authoritative run `32859155741` completed SUCCESS. Artifact `9567421627` was downloaded and read directly.
- Exact post-batch14 state: `247 unique / 615 unresolved occurrences` = `200 FUTURE_V7_LEAK + 415 UNREGISTERED_V7`; notes `415`; `missing_gloss=0`; passages `168/168`; proper-name unresolved `0`; mapping errors `0`; runtime browser errors `0`.
- Verified batch14 reduction from `301 / 831` to `247 / 615`: `54 unique / 216 occurrences`; notes `360 -> 415`; missing gloss remained zero.
- Slash-quality run `32859127567` completed SUCCESS for batch14 content; no slash regression was introduced.
- Grammar chronology remains fail-closed: candidate coverage `168/168`, 20 feature families, evidence-backed exact-subunit boundaries incomplete; no grammar PASS claimed.

## Current exact state
- Vocabulary passages audited: `168/168`.
- Vocabulary violations: `247 unique / 615 occurrences`.
- FUTURE_V7_LEAK: `200 occurrences`.
- UNREGISTERED_V7: `415 occurrences`.
- Notes present: `415`.
- missing gloss: `0`.
- Proper-name unresolved: `0`.
- Mapping errors: `0`.
- Runtime browser errors: `0`.
- Vocabulary chronology: FAIL / IN PROGRESS.
- Grammar chronology: FAIL-CLOSED / IN PROGRESS; candidate coverage `168/168`, 20 feature families, exact subunit boundaries incomplete.
- Slash/reference: batch14 slash-quality PASS at run `32859127567`; full final release gate still required after vocab+grammar reach zero leaks.
- Public main release: NOT performed.

## Exact stop / next start
- Exact stop: batch14 authoritative audit verified SUCCESS at `247 unique / 615 occurrences`; slash-quality also SUCCESS.
- Next start: use artifact `9567421627` unresolved JSON as sole queue. Continue the remaining four-occurrence cohort, beginning `forms`, `four`, `grew`, `hard`, `hi`, `life`, `mark`, `market`, `n`, `outside`, `person's`, `practical`, `pull`, `real`, `reopened`, `rest`, `roads`, `sells`, `several`, `shipped`, `similar`, `sounds`, `step`, `systems`, `talk`, `trip`, `variety`, `visitor's`, `wider`, etc. Resolve morphology/same-section/proper-name/tokenization cases from v7 + grammar evidence instead of masking them with notes.
- Continue vocabulary until `unique_unresolved=0`, `future_vocab_leak=0`, `missing_gloss=0`. Then finish evidence-backed grammar introduction boundaries for all 20 feature families and require `future_grammar_leak=0` across all 168 passages plus A/B English fields.
- After both chronologies reach zero leaks, rerun slash reference 168/168, A/B evidence consistency, coverage/DOM, Chromium/Firefox/WebKit-iPhone, A4 student/teacher print. Only every-gate PASS permits main update and live Pages verification; only live Pages PASS permits completion.
