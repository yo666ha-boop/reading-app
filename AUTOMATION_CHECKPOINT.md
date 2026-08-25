# Long-reading app vocabulary / grammar / notes checkpoint

Updated: 2026-08-25 JST (manual continuation, batch14 pending authoritative verification)

## Source of truth / safety
- Repo: `yo666ha-boop/reading-app`.
- Work branch: `v10-vocab-grammar-notes-audit`.
- Public `main`: `1f0cabf9bfcc4482f507e33188499bdbbd5bab57`; NOT modified.
- Sole vocabulary authority: native Sheet `1AkKYV6h-9ZCq1-p8126u4t8z0pvPSRnHlOfY8C-3hH4`, tab `単語マスター`, 3975 canonical records. This run re-read native-sheet metadata: 3976 rows including header, 33 columns, tab sheetId `109187341`, and exported/read the native workbook for bounded v7 checks.
- Authoritative audit waits for `V10_RUNTIME_LOAD_PROGRESS=complete`, then applies passage-local proper-name batches 1-4 and notes batches 2-14 before scanning all 168 passages. Notes are exact-passage/non-cumulative; proper names require explicit local tagging and capitalization.

## Completed this run
- Re-read branch HEAD, main HEAD, checkpoint, latest Actions, workflow path filters, and authoritative final-runtime load order before editing. Public main remained `1f0cabf9bfcc4482f507e33188499bdbbd5bab57`.
- Re-downloaded authoritative artifact `9566464062` from successful run `32856710276` and parsed the actual unresolved report rather than relying on prior prose. Verified baseline remains `301 unique / 831 occurrences` = `252 FUTURE_V7_LEAK + 579 UNREGISTERED_V7`; notes `360`; `missing_gloss=0`; passages `168/168`.
- Enumerated the complete four-occurrence cohort: 84 unresolved token families. Did not stop after 10/20.
- Re-read canonical v7 evidence for the high-risk front of the cohort. Confirmed examples include: `enter` future at its current passage; `evening` future at its current passage; `fold` future at its current passage; `goal` later/future; `gorgeous` later/future; `hand` future. Also identified cases that must NOT be blindly converted to notes because morphology or same-section chronology may explain them, including `grew`, `four`, `forms` and other productive forms.
- Added `v10_passage_local_notes_batch14.js` with 54 distinct unambiguous four-occurrence token families (55 exact-passage definitions because `evening` spans two passages). These are bounded exact-passage notes only; no global allowlist was added. Content commit: `ca62d640e8703312522cb66f9cc0d4382eac0743`.
- Batch14 includes the verified/unambiguous families `enter`, `essential`, `evening`, `exciting`, `fold`, `goal`, `gorgeous`, `hand`, `historical`, `hotel`, `hungry`, `immediate`, `immediately`, `interdependence`, `interesting`, `issue`, `job`, `join`, `junior`, `message`, `modern`, `movies`, `music`, `myself`, `nutritional`, `police`, `population`, `pork`, `pressure`, `purpose`, `rail`, `relationships`, `relief`, `replace`, `sale`, `sandwich`, `shade`, `sharply`, `shoot`, `sick`, `steak`, `strong`, `suggest`, `sunburn`, `surf`, `survival`, `tired`, `together`, `trumpet`, `twelve`, `volunteer`, `wall`, `yellow`, `zoo`.
- Updated authoritative scanner so batch14 is loaded only after final runtime completion, after batches 2-13. Scanner commit: `d2c455272bab7c6191dc801bb3b8e6c62726728d`.
- New authoritative run `32859155741` was created for scanner commit `d2c455...`; at checkpoint-write time it was still PENDING, so no post-batch14 counts are guessed or claimed.
- Slash-quality also triggered from the batch14 content change (run `32859127567` observed in latest Actions). Final conclusion must be collected next run if it is not complete before this run ends.
- Grammar chronology remains fail-closed: candidate coverage `168/168`, 20 feature families, evidence-backed exact-subunit boundaries still incomplete; no grammar PASS claimed.

## Current exact state
- Last artifact-verified vocabulary passages audited: `168/168`.
- Last artifact-verified vocabulary violations: `301 unique / 831 occurrences`.
- Last artifact-verified FUTURE_V7_LEAK: `252 occurrences`.
- Last artifact-verified UNREGISTERED_V7: `579 occurrences`.
- Last artifact-verified notes present: `360`.
- Last artifact-verified missing gloss: `0`.
- Proper-name unresolved: `0` at last verified artifact.
- Batch14 implementation: COMMITTED, authoritative post-batch14 result PENDING at run `32859155741`.
- Vocabulary chronology: FAIL / IN PROGRESS; do not substitute expected reductions for artifact results.
- Grammar chronology: FAIL-CLOSED / IN PROGRESS; candidate coverage `168/168`, 20 feature families, exact subunit boundaries incomplete.
- Slash/reference: previous batch13 slash-quality PASS; batch14 slash-quality run `32859127567` must be collected.
- Public main release: NOT performed.

## Exact stop / next start
- Exact stop: batch14 is committed and connected to the authoritative final-runtime scanner; authoritative run `32859155741` is pending. Last verified baseline remains `301 / 831`, not an estimated lower number.
- Next start: first collect `32859155741` artifact and `32859127567` slash-quality conclusion. If authoritative run succeeds, record exact new unresolved counts/notes/missing gloss and use its new unresolved JSON as the only next queue.
- Then continue the remaining four-occurrence cohort, beginning with the deliberately deferred high-risk cases such as `forms`, `four`, `grew`, plus remaining `hard`, `hi`, `life`, `mark`, `market`, `n`, `outside`, `person's`, `practical`, `pull`, `real`, `reopened`, `rest`, `roads`, `sells`, `several`, `shipped`, `similar`, `sounds`, `step`, `systems`, `talk`, `trip`, `variety`, `visitor's`, `wider`, etc. Resolve morphology/same-section/proper-name/tokenization cases from v7 + grammar evidence instead of masking them with notes.
- Continue vocabulary until `unique_unresolved=0`, `future_vocab_leak=0`, `missing_gloss=0`. Then finish evidence-backed grammar introduction boundaries for all 20 feature families and require `future_grammar_leak=0` across all 168 passages plus A/B English fields.
- After both chronologies reach zero leaks, rerun slash reference 168/168, A/B evidence consistency, coverage/DOM, Chromium/Firefox/WebKit-iPhone, A4 student/teacher print. Only every-gate PASS permits main update and live Pages verification; only live Pages PASS permits completion.
