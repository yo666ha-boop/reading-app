# Long-reading app vocabulary / grammar audit checkpoint

Updated: 2026-08-25 JST

## Source of truth
- Repository: `yo666ha-boop/reading-app`.
- Work branch: `v10-vocab-grammar-notes-audit` only.
- Final manual audit-code commit this run: `0bf1b7c39fc10c381bc06a1e44b74967712bdd3a` (`Audit: honor only explicitly tagged local proper names`). Latest checkpoint commit will be newer; always re-read branch HEAD first next run because Actions may append `[skip ci]` evidence commits.
- Public `main` remained `1f0cabf9bfcc4482f507e33188499bdbbd5bab57`; main NOT modified.
- Sole vocabulary authority: Google Sheet `英単語_教科書別マスターデータ_NH_SS_2026_v7_app_wordbook_master`, id `1AkKYV6h-9ZCq1-p8126u4t8z0pvPSRnHlOfY8C-3hH4`, tab `単語マスター`, exactly 3975 records; English/Japanese/reading blanks 0 and v6 English/Japanese diff 0 reconfirmed.
- Bounded elementary source: `v10_elementary_vocab_allowlist.json`, exactly 104 provenance-backed records; base vocabulary only, with productive inflections kept behind grammar chronology.

## This run completed
- Re-read branch/main, prior checkpoint, latest Actions, canonical v7 Sheet and current `v10_stage2.html` load order before editing.
- Fixed short productive morphology in strict v7 audit: `used -> use`, `using -> use`; added regression assertions and bounded irregular handling. Commit `fa46f81866d2127aa10dc5fc644cc0bd935cba55`.
- Tightened elementary lexical evidence so plural/3sg/past/ing/comparison surfaces do not auto-PASS vocabulary and remain grammar-gated. Commit `7efff81b95401fd95ae0abbf6306456fde694bc8`.
- Adopted newer actual `f892b3e9f845cf83915cd6fdc802d6d8e1f97cb6`, which routes inflected surfaces to grammar when an already-known v7 base exists even if v7 separately lists the surface later; also covers `let's`.
- Investigated `Ken`: NH Unit 0 explicitly has `['Ken / Mei','proper names']` and auditNote says they are proper names outside ordinary vocabulary gating. Added a fail-closed local proper-name rule: only a token explicitly tagged `proper names` in that CURRENT passage and actually capitalized is allowed; it is never promoted to cumulative ordinary vocabulary. Commit `0bf1b7c39fc10c381bc06a1e44b74967712bdd3a`.
- Proper-name rerun completed successfully at workflow level and reduced strict vocabulary from `567 / 3110` to `563 unique / 3041 occurrences`: `1242 FUTURE_V7_LEAK + 1799 UNREGISTERED_V7`; 69 false-positive occurrences and 4 unique unresolved keys removed.
- No passage wording changed this run. Passage-content fixes: 0. Notes added: 0.

## Current stage and exact counts
- Vocabulary audited: `168/168`.
- Strict vocabulary result: `563` unique unresolved / `3041` leak occurrences = `1242 FUTURE_V7_LEAK + 1799 UNREGISTERED_V7 + 0 UNREGISTERED_PROPER`; vocabulary chronology `FAIL / IN PROGRESS`.
- Confirmed reduction sequence this run: unique `602 -> 599 -> 579 -> 567 -> 563`; leak occurrences `3426 -> 3373 -> 3183 -> 3110 -> 3041`.
- Current other classifications: v7 chronology allowed `10133`; morphology to grammar `2505`; contractions to grammar `227`; explicit function/structure to grammar `20701`.
- Notes present: `0`; notes added this run: `0`; `missing_gloss=0`; bounded notes UI gate `PASS`.
- Grammar scan: `168/168`, 19 detected feature families; final evidence-backed grammar chronology remains FAIL-CLOSED / not yet implemented, so exact future-grammar-leak count is still pending.
- Slash current run `32800683945`: authoritative reference runtime PASS, sample gate PASS, full 168 coverage PASS; first failure is `Stage2 DOM regression`. Browser engines, cross-browser/print and public Pages smoke were skipped after that failure.
- Passage audit run `32800683928`: all audit commands executed and the aggregate audit step itself completed; final fail gate tripped because at least one sub-audit returned nonzero. No deterministic repair commit was made on this PR run. Exact sub-audit failure must be isolated next.
- A/B evidence, DOM, Chromium/Firefox/WebKit-iPhone and A4 student/teacher print are NOT final PASS yet.

## Actions / PASS FAIL
- `32800683995` vocab/grammar/notes: SUCCESS workflow; canonical 3975 snapshot PASS; scan 168/168; strict vocabulary FAIL 3041; grammar candidate 168/168 only; notes UI PASS.
- `32800683945` slash-quality: FAILURE at `Stage2 DOM regression`; reference runtime + sample + 168 coverage all PASS before failure.
- `32800683928` passage audit: FAILURE at final aggregate fail gate after running all sub-audits; exact failing sub-audit remains to isolate.
- vocabulary chronology: FAIL / IN PROGRESS.
- grammar chronology: FAIL-CLOSED / IN PROGRESS.
- missing_gloss: PASS = 0.
- slash reference/coverage: PASS before DOM step; full chain FAIL.
- main/public Pages: unchanged / not released.

## Exact stop / next start
- Exact stop: strict-vocab code through `0bf1b7c...` is persisted; current confirmed result is `563 / 3041`. Checkpoint updated after reading all three current workflow outcomes.
- Next start 1: re-read latest branch HEAD and newest `[skip ci]` evidence commits. Fetch the current unresolved list and continue from its highest-frequency genuine candidate; verify `Ken` and only explicitly tagged proper names were removed.
- Next start 2: isolate `Stage2 DOM regression` from slash run `32800683945` and the nonzero sub-audit inside passage run `32800683928`; fix the actual DOM/runtime cause while preserving reference slash 168/168 and coverage 168/168.
- Next start 3: continue strict vocab cleanup without small batches: distinguish auditor false positives from genuine future vocabulary; naturally replace future words where possible; add `notes` only for indispensable outside words, always synchronizing fullTranslation, slashRows, A/B answer/evidence/evidenceJp/reason.
- Next start 4: populate evidence-backed NH/SS subunit introduction boundaries for all 19 grammar families, convert grammar candidate extraction into true chronology PASS/FAIL, and drive future grammar leak to zero.
- Final only after vocabulary + grammar + slash + A/B PASS: coverage/DOM, Chromium/Firefox/WebKit-iPhone, A4 student/teacher print; then main, live GitHub Pages 168/168 + notes + mobile + print; stop task only after public PASS.
