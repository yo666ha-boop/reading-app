# Long-reading app vocabulary / grammar / notes checkpoint

Updated: 2026-08-25 JST (manual continuation)

## Source of truth / safety
- Repo: `yo666ha-boop/reading-app`.
- Work branch: `v10-vocab-grammar-notes-audit`.
- Public `main`: `1f0cabf9bfcc4482f507e33188499bdbbd5bab57`; NOT modified.
- Sole vocabulary authority: native Sheet `1AkKYV6h-9ZCq1-p8126u4t8z0pvPSRnHlOfY8C-3hH4`, tab `単語マスター`, 3975 canonical records.
- Final audit runtime waits for `V10_RUNTIME_LOAD_PROGRESS=complete`, then applies bounded passage-local proper-name/notes layers before scanning all 168 passages. Passage-local notes never enter cumulative vocabulary; proper names require explicit local tagging and capitalization.

## Completed this run
- Re-read work-branch HEAD, main HEAD, prior checkpoint, newest Actions, authoritative status/unresolved JSON, and final audit wrapper/load order before editing.
- Confirmed prior batch6 slash-quality run `32840208534` completed SUCCESS; the previous checkpoint's pending slash state is therefore resolved.
- Added bounded proper-name batch2 rather than glossing names as vocabulary: Sunshine G1 `Step 6 / Our Project 3 / Power-Up 6` -> `Anna`; New Horizon G3 `Unit 1-1` -> `Kyoto`. File commit `0c4c336ea97da2c71b46b9b0f998abfa5bcf54af`.
- Native v7 actual checks used during this pass include: `damage=~に損害を与える`; `earthquake=地震`; `handle=~を処理する`; no standalone `communication`; `pastry` appears only inside later `pastry chef`; `peaceful=平和な`; `safe=安全な`; `puppy=子イヌ`; and `the U.K.=英国/イギリス`.
- Added `v10_passage_local_notes_batch7.js` for the next 8-occurrence group: `communication`, `damage`, `diet`, `difference`, `earthquake`, `easily`, `handle`, `human`. Content commit `23401f1a9f1dd12b944bcec7633bf9f57bcd4075`; authoritative scanner load commit `bbdeb58d0c33137e7e90573044aaab79b3445b5b`.
- Batch7 authoritative evidence verified `479 -> 469 unique`, `1902 -> 1822 occurrences`; `700 FUTURE + 1122 UNREGISTERED`; notes `158`; `missing_gloss=0`; passages `168/168`; notes UI PASS; grammar candidates remain `168/168`, 20 feature families.
- Added `v10_passage_local_notes_batch8.js` for the remainder of the 8-occurrence group. Important scanner-safe handling: NH1 Unit6-1 uses exact phrase note `the U.K.=イギリス`, avoiding any global allowance of single-letter tokenizer fragments `u` / `k`. Other bounded tokens include `museum`, `pastry`, `peaceful`, `political`, `protection`, `protesters`, `puppy`, `record`, `safe`, `sea`, `sequence`, `simple`, `single`, `solve`, `supermarket`, `theater`, `tuna`, `twenty`, `UNESCO`. Content commit `ee32d54e10a5a189ff8cf2356940b6cf35abd240`; scanner-load commit `c6c81259e65952662caa0de73e1490688efce224`.
- Batch8 authoritative evidence verified `469 -> 448 unique`, `1822 -> 1654 occurrences`; `620 FUTURE + 1034 UNREGISTERED`; notes `186`; `missing_gloss=0`; passages `168/168`; notes UI PASS.
- Continued immediately into the 7-occurrence group and added `v10_passage_local_notes_batch9.js` for `advice`, `cape`, `classroom`, `cleanup`, `comparison`, `corn`, `crowd`, `elephant`, `field`, `fresh`, `gym`, `high`, `hockey`, `hospital`, `ice`, `machine`, `mosque`, `product`, `protect`, `reused`, `stall`, `stand`, `track`. Content commit `f31518f308a5781964274f7b153e09e6bb4d30e1`; scanner-load commit `111e16b52822a3ba1d3af78410177ede90ebc841`.
- Batch9 authoritative run `32845055089` completed SUCCESS and persisted the new exact state: `425 unique / 1493 occurrences` = `543 FUTURE + 950 UNREGISTERED`; notes `215`; `missing_gloss=0`; passages `168/168`; notes UI PASS; grammar candidates `168/168`, 20 feature families.
- Batch9 content slash-quality run `32845023852` completed SUCCESS. No passage text/slash rewrite was made in batches7-9; notes/proper-name metadata additions did not regress slash quality.
- Total verified progress in this continuation: `479 -> 425 unique`, `1902 -> 1493 occurrences`, reduction `54 unique / 409 unresolved occurrences`; notes `144 -> 215`; missing gloss remained zero.

## Current exact VERIFIED state
- Vocabulary passages audited: `168/168`.
- Vocabulary chronology: FAIL / IN PROGRESS.
- Unresolved: `425 unique / 1493 occurrences` = `543 FUTURE_V7_LEAK + 950 UNREGISTERED_V7`.
- Notes present: `215`; `missing_gloss=0` PASS.
- Proper-name unresolved: `0`; bounded proper names are passage-local and capitalization-gated.
- Grammar candidate coverage: `168/168`; 20 detected feature families. Evidence-backed exact subunit introduction chronology is still incomplete, so grammar chronology remains fail-closed/pending; no PASS claimed.
- Notes UI: PASS on latest persisted batch9 evidence.
- Slash quality: batch9 content run `32845023852` SUCCESS. Final full release gates still must be rerun after vocabulary and grammar chronology reach zero leaks.
- Public main release: NOT performed; main remains `1f0cabf9bfcc4482f507e33188499bdbbd5bab57`.

## Actions / commits
- Proper names batch2: `0c4c336ea97da2c71b46b9b0f998abfa5bcf54af`.
- Batch7 content/scanner: `23401f1a9f1dd12b944bcec7633bf9f57bcd4075` / `bbdeb58d0c33137e7e90573044aaab79b3445b5b`.
- Batch8 content/scanner: `ee32d54e10a5a189ff8cf2356940b6cf35abd240` / `c6c81259e65952662caa0de73e1490688efce224`.
- Batch9 content/scanner: `f31518f308a5781964274f7b153e09e6bb4d30e1` / `111e16b52822a3ba1d3af78410177ede90ebc841`.
- Batch9 authoritative audit: run `32845055089` SUCCESS.
- Batch9 slash quality: run `32845023852` SUCCESS.
- Evidence-writer bot advanced branch after audit; always re-read HEAD before the next write.

## Exact stop / next start
- Exact stop: the entire 8-occurrence group and the visible 7-occurrence group through `track` have been processed and batch9 is authoritative PASS for the bounded vocabulary/notes scan. Current unresolved begins at the remaining 7-occurrence tail (including `without` if still present after newest JSON) and then the 6-occurrence group (`attention`, `blocked`, `cake`, `cherry`, `classmates`, `clear`, `coach`, `courage`, `cross`, `crossing`, etc.).
- Next start: re-read branch/main/checkpoint/status/unresolved JSON first, then continue from the newest highest-frequency unresolved token. For every item, use native v7 exact row/base/variant/chronology when present; do not global-allow future words. Prefer a natural known-vocabulary rewrite only when all passage/translation/slash/A+B fields can be synchronized safely; otherwise use a bounded passage-local note with nonblank Japanese gloss.
- Continue until `unique_unresolved=0`, `future_vocab_leak=0`, `missing_gloss=0`; then populate evidence-backed exact-subunit grammar introduction boundaries for all 20 feature families and require `future_grammar_leak=0` across all 168 passages and A/B English fields.
- Finally rerun slash reference 168/168, A/B evidence consistency, coverage/DOM, Chromium/Firefox/WebKit-iPhone, A4 student/teacher print. Only every-gate PASS permits main update and live Pages verification; only live Pages PASS permits completion/automation stop.
