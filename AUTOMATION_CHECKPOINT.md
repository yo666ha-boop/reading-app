# Long-reading app vocabulary / grammar audit checkpoint

Updated: 2026-08-25 JST

## Source of truth
- Repository: `yo666ha-boop/reading-app`.
- Work branch: `v10-vocab-grammar-notes-audit` only.
- Work branch HEAD at the final manual audit change of this run: `0bf1b7c39fc10c381bc06a1e44b74967712bdd3a` (`Audit: honor only explicitly tagged local proper names`). Actions may append `[skip ci]` evidence commits after this checkpoint; always re-read branch HEAD before the next edit.
- Public `main` HEAD remained `1f0cabf9bfcc4482f507e33188499bdbbd5bab57`; main was NOT modified.
- Sole vocabulary authority: native Google Sheet `英単語_教科書別マスターデータ_NH_SS_2026_v7_app_wordbook_master`, id `1AkKYV6h-9ZCq1-p8126u4t8z0pvPSRnHlOfY8C-3hH4`, tab `単語マスター`, exactly 3975 canonical records. Rechecked this run: 3975 records; English/Japanese/reading blanks 0; v6 English/Japanese diff 0; v7 columns include search base, variants/alternate notation and phrase structure.
- Bounded elementary lexical source remains `v10_elementary_vocab_allowlist.json`, exactly 104 records with provenance. It is lexical evidence only; productive inflections remain grammar-gated.

## This run completed
- Re-read latest branch HEAD, main HEAD, stale checkpoint, current Actions and `v10_stage2.html` final load order before editing.
- Confirmed the strict vocabulary auditor was still using canonical v7 English entries plus morphology reduction and was not correctly handling short regular forms. Fixed `used -> use` and `using -> use`, added regression assertions and bounded irregular handling. Commit `fa46f81866d2127aa10dc5fc644cc0bd935cba55`.
- Confirmed bounded elementary vocabulary evidence had been introduced, then tightened it so elementary base words do not auto-authorize plural/3sg/past/ing/comparison surfaces. Commit `7efff81b95401fd95ae0abbf6306456fde694bc8`.
- Accepted the newer actual branch improvement `f892b3e9f845cf83915cd6fdc802d6d8e1f97cb6`, which routes a surface form to grammar when its v7 base is already known even if v7 lists that surface later; also includes `let's` contraction handling. This reduced false FUTURE_V7 results for forms such as `saw/gives/days`.
- Latest persisted f892 audit result: `567` unique unresolved / `3110` future-or-unregistered occurrences = `1242 FUTURE_V7_LEAK + 1868 UNREGISTERED_V7`; 168/168 scanned; missing gloss 0; notes UI PASS; grammar candidate scan 168/168 with 19 families.
- Investigated top unresolved `ken` (33 occurrences in the pre-fix report). Verified NH Unit 0 data explicitly marks `Ken / Mei` as `proper names` and auditNote explicitly states they are proper names outside the vocabulary gate. The old auditor discarded this bounded provenance and treated names as unregistered.
- Added a fail-closed proper-name gate: only tokens explicitly listed in the CURRENT passage `allowedWords` row tagged `proper names`, and actually capitalized in the source token, are locally authorized. Proper names are NOT promoted into cumulative ordinary vocabulary. Commit `0bf1b7c39fc10c381bc06a1e44b74967712bdd3a`.
- No passage wording/content changed in this run. Passage-content fixes this run: 0. Notes added this run: 0.

## Current stage and exact counts
- Vocabulary passages audited: `168/168`.
- Last fully persisted strict vocabulary result before the final proper-name-gate commit: `567` unique unresolved / `3110` occurrences = `1242 FUTURE_V7_LEAK + 1868 UNREGISTERED_V7 + 0 UNREGISTERED_PROPER`; vocabulary chronology `FAIL / IN PROGRESS`.
- Progress across this run's auditor corrections: `602 -> 599 -> 579 -> 567` unique unresolved and `3426 -> 3373 -> 3183 -> 3110` leak occurrences on confirmed completed runs. The final proper-name gate is expected to remove explicitly tagged name false positives such as `Ken`, but its new numbers must be read from the new run before recording them as fact.
- Last confirmed classifications after f892: v7 chronology allowed 10133; morphology to grammar 2505; contractions to grammar 227; explicit function/structure to grammar 20701.
- Notes present: `0`; notes added this run: `0`; `missing_gloss=0`; notes UI bounded gate `PASS`.
- Grammar candidate scan: `168/168`, 19 detected feature families. Final evidence-backed grammar chronology is NOT complete; exact future grammar leak count remains pending and must remain fail-closed.
- Slash reference: prior authoritative runtime gate had reached PASS 168/168, but f892 slash-quality run `32800445683` completed FAILURE. Current commit `0bf1...` started a fresh slash-quality run; do not claim overall slash chain PASS until its first real failing step is read and fixed.
- A/B evidence and coverage/DOM/cross-browser/print still require a fresh fully green chain after chronology changes.
- Chromium/Firefox/WebKit-iPhone and A4 student/teacher print are not final-PASS yet.

## Actions / PASS FAIL
- f892 vocabulary/grammar/notes audit persisted SUCCESS at workflow level with strict result: canonical snapshot PASS 3975; vocabulary scan 168/168; vocabulary chronology FAIL with 3110 occurrences; grammar candidate scan 168/168 only; notes UI PASS.
- f892 slash-quality run `32800445683`: FAILURE; a newer run is evaluating `0bf1...`.
- Current `0bf1...` runs started: passage audit `32800683928`, slash quality `32800683945`, vocab/grammar/notes audit `32800683995`; all were still in progress at checkpoint preparation.
- vocabulary chronology: FAIL / IN PROGRESS.
- grammar chronology: FAIL-CLOSED / IN PROGRESS.
- missing_gloss: PASS = 0.
- main/public Pages: unchanged / not released.

## Exact stop / next start
- Exact stop: manual HEAD `0bf1b7c39fc10c381bc06a1e44b74967712bdd3a`; bounded explicit-current-passage proper-name support committed. New Actions are running and may append report/status commits.
- Next start 1: re-read branch HEAD first; then read run `32800683995` and the newly persisted `VOCAB_GRAMMAR_NOTES_AUDIT_STATUS.txt` / unresolved list. Record the actual reduction from explicit proper names; verify `Ken` is gone only where explicitly tagged.
- Next start 2: read slash run `32800683945` and passage run `32800683928`; fix the first actual failing gate, preserving 168/168 reference slash.
- Next start 3: continue top remaining unresolved vocabulary continuously. Separate (a) auditor false positives with bounded evidence, (b) genuine future vocabulary that can be naturally replaced, and (c) indispensable outside vocabulary that must receive an English+Japanese `notes` gloss. Synchronize fullTranslation/slash/A-B evidence whenever passage wording changes.
- Next start 4: once vocabulary false positives are exhausted, populate evidence-backed NH/SS subunit introduction boundaries for all 19 grammar families and turn the candidate scanner into a real 168/168 pass/fail chronology gate; drive future grammar leak to zero.
- Final sequence only after vocabulary + grammar + slash + A/B all PASS: coverage/DOM, Chromium/Firefox/WebKit-iPhone, A4 student/teacher print; then merge main, verify live GitHub Pages 168/168 + notes + mobile + print, and stop only after public PASS.
