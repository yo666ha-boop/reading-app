# Long-reading app vocabulary / grammar audit checkpoint

Updated: 2026-08-25 03:55 JST

## Source of truth
- Repository: `yo666ha-boop/reading-app`.
- Work branch: `v10-vocab-grammar-notes-audit` only.
- Work branch HEAD at checkpoint write base: `62206cf07ff5e63a422264a5d510be8aa6a27de3` (`audit: record v7-confirmed future give rewrite`).
- Public `main` HEAD remains `1f0cabf9bfcc4482f507e33188499bdbbd5bab57`; main was NOT modified.
- Canonical vocabulary source re-opened live: native Google Sheet `英単語_教科書別マスターデータ_NH_SS_2026_v7_app_wordbook_master`, id `1AkKYV6h-9ZCq1-p8126u4t8z0pvPSRnHlOfY8C-3hH4`, sheet `単語マスター`, 3975 canonical records.

## Work completed this run
- Re-read actual branch HEAD, main HEAD, checkpoint, latest persisted audit status/report, v10 stage2 final script load order, vocabulary correction layer, and notes UI test.
- Confirmed latest persisted all-168 report after prior-grade metadata repairs: 168/168 audited; 27,967 exact allowed occurrences; 9,986 cumulative prior/current allowed; 154 function-to-grammar; 138 morphology-to-grammar; 47 normal v7 lookup occurrences; 7 proper-class lookup occurrences; 13 normal unique candidates + 2 proper-class candidates; notes 0; missing gloss 0; missing allowedWords 0; grammar extraction 168/168 with 19 feature families.
- Confirmed `eat` and `large` disappeared from the unresolved candidate set after the previous metadata repair.
- Diagnosed the remaining notes-UI timing hazard: `v10_vocab_corrections.js` stopped polling after 12 seconds (`tries>=120`), while the bounded jsdom test permits up to 45 seconds for all 168 datasets to load. A slow load can therefore end polling before Get Ready 4 exists, leaving the v7-confirmed `play` correction unapplied and making the UI gate fail despite datasets eventually reaching 168.
- Extended correction polling from 12 seconds to 120 seconds in commit `b1fa55a481c3521a9591ec3d051c0db1ff1a1bb7`. The gate was not weakened; it still requires the real correction to exist before the note rendering assertions run.
- Re-opened canonical v7 row evidence for `give`: row 1115 (master ID 1114 in the data field), NH2, `LR1`, `Let's Read 1 教科書本文`, P44-P47, `give-gave / 与える[原形-過去形]`.
- Therefore confirmed the NH2 Unit 2-2 sentence `At school, I give a short speech about local food.` is a genuine future-vocabulary leak. This is before the v7 first appearance of `give`.
- Repaired that leak without adding a note: replaced it with prior-reviewed `At school, I talk about local food in a short speech.` and synchronized fullTranslation, slashRows[0] English/Japanese, A1 evidence, evidenceJp and reason together. Repair commit: `37abfb12b5943bb875a7e76899fe3135c30b7172`.
- Recorded the evidence-backed decision in `v10_v7_vocab_resolution.json`, commit `62206cf07ff5e63a422264a5d510be8aa6a27de3`.
- No main write was made.

## Current authoritative counts
Latest persisted report before rerun of the new `give` repair:
- passages audited: `168/168`
- exact allowed occurrences: `27967`
- cumulative prior/current allowed occurrences: `9986`
- function-to-grammar occurrences: `154`
- morphology-to-grammar occurrences: `138`
- unresolved v7 lookup occurrences: `47`
- unresolved proper-class lookup occurrences: `7`
- unique normal v7 lookup candidates: `13`
- unique proper-class candidates: `2`
- notes present: `0`
- missing gloss: `0`
- missing allowedWords: `0`
- grammar candidate passages: `168/168`
- grammar detected feature families: `19`
- confirmed genuine future-vocab leak repaired this run: `1` (`give` in NH2 Unit 2-2)
- The next persisted rerun must reduce the `give` candidate occurrences for Unit 2-2; Unit 5-4 still needs cutoff evaluation separately.

## UI / gate status
- Latest persisted notes UI status before this run's polling extension remains `FAIL_OR_TIMEOUT`; do not mark PASS until a fresh run persists PASS.
- Correction polling timing has now been aligned with the bounded dataset-load window. Fresh CI evidence is required.
- Slash reference remains mandatory after this synchronized passage edit; final 168/168 slash regression must be rerun before release.

## Remaining candidate focus
Latest candidate set includes `give`, `sixteen`, `today`, `bring`, `map`, `nine`, `process`, `using`, `above`, `hike`, `tells`, `used`, `learn`, `lot`, plus proper-name `anna` (the report classifies `today` as a capitalization/proper candidate in some sentence-initial occurrences). `eat` and `large` are resolved and gone.

## Exact stop / next start
- Exact stop: v7-confirmed future `give` in NH2 Unit 2-2 was synchronously rewritten and the decision was recorded. Branch HEAD is `62206cf...`. Fresh Actions/persisted scanner/UI outputs for this head were not yet available at checkpoint write.
- Next start: first read branch HEAD and newest bot-persisted report/UI status. Verify Unit 2-2 `give` disappearance and whether notes UI becomes PASS after the 120-second polling repair. Then continue exact v7 cutoff resolution of every remaining candidate, prioritizing `bring` (SS2 PROGRAM 2-1 versus v7 Reading1/Power-Up2), `sixteen`, `map`, `nine`, `process`, `using`, `above`, `hike`, `tells`, `used`, `learn`, `lot`, `today`, `anna`, and Unit 5-4 `give`. For each confirmed future word, prefer a natural already-learned rewrite and synchronize sentence/fullTranslation/slash/questions/answer/evidence/evidenceJp/reason. Add notes only for truly indispensable unknowns.
- After vocabulary candidates are exhausted: build evidence-backed textbook/section thresholds for all 19 grammar families; audit all 168 passages + A/B English; then rerun slash reference 168/168, A/B evidence/translation sync, coverage/DOM, Chromium/Firefox/WebKit-iPhone, A4 student/teacher print. Merge to main only after every gate passes and verify Pages live.

## PASS / FAIL record
- vocabulary scanner execution: PASS 168/168; chronology final: IN PROGRESS.
- confirmed future vocabulary repairs: 1 this run (`give`, NH2 Unit 2-2).
- grammar candidate extraction: PASS 168/168; chronology final: IN PROGRESS.
- missing gloss among current notes: PASS (`0`), but final notes necessity remains IN PROGRESS.
- notes UI: fresh rerun pending after timing repair; latest persisted state still FAIL_OR_TIMEOUT.
- future vocab leak: NOT FINALIZED.
- future grammar leak: NOT FINALIZED.
- slash regression: synchronized one-row passage/slash/evidence edit made this run; full 168/168 final regression pending.
- public main/live release: NOT RUN / intentionally blocked.
