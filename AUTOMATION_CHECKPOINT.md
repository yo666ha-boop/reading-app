# Long-reading app vocabulary / grammar / notes checkpoint

Updated: 2026-08-25 JST (manual continuation)

## Source of truth / branch safety
- Repository: `yo666ha-boop/reading-app`.
- Work branch: `v10-vocab-grammar-notes-audit`.
- Branch HEAD at start of this run: `c7577bba35128906469d1b7cdeb53ee873920a22`.
- Public `main`: `1f0cabf9bfcc4482f507e33188499bdbbd5bab57`; NOT modified.
- Sole vocabulary authority: native Google Sheet `英単語_教科書別マスターデータ_NH_SS_2026_v7_app_wordbook_master`, id `1AkKYV6h-9ZCq1-p8126u4t8z0pvPSRnHlOfY8C-3hH4`, tab `単語マスター`, canonical 3975 records.
- Final dynamic v10 load order was re-read from `v10_interaction_metadata.js`; `v10_vocab_slash_manual_corrections.js` is loaded near the terminal end, immediately before chronology/reference slash synchronization, so chronology repairs placed there survive earlier passage/manual overlays.

## This manual run completed
- Re-read branch HEAD, main HEAD, prior checkpoint, latest Actions and final runtime load order before editing.
- Latest completed audit at run start remained `32811368244` SUCCESS for commit `609e3c9379e2a554b94fa9e99e8101eb11e135de`.
- Re-read final-runtime SS1 `Get Ready 6`: it still contained `I had lunch and ate pizza.` plus five `I saw ...` sentences, and metadata falsely labeled `had / ate / saw` as explicit Get Ready 6 past forms.
- Re-checked canonical v7 live Sheet evidence. `saw` has no Get Ready 6 entry; canonical matches are later `see-saw` / `see-saw-seen` entries (NH1 Unit 9 and later). `eat-ate` likewise appears later (NH1 Unit 9 / SS1 PROGRAM 9), while base `eat` is already in SS1 pre-step (`プレステップ4`) and `lunch` is already in SS1 pre-step (`プレステップ8`). `pizza` has no canonical v7 row.
- Therefore this was not a morphology false positive: it was a genuine future-vocabulary + future-past-grammar leak in SS1 Get Ready 6.
- Implemented a terminal-runtime chronology correction in `v10_vocab_slash_manual_corrections.js` so earlier overlays cannot restore the bad version.
- Replaced the past-tense/pizza passage with current-safe wording: `I eat lunch. / I am at the zoo. / I like ...` using base `eat`, `lunch`, cumulative Get Ready 5 zoo vocabulary and already-reviewed function vocabulary.
- Synchronized `sentences`, `fullTranslation`, all `slashRows` English/Japanese, A questions `prompt/answer/evidence/evidenceJp/reason`, `allowedWords`, audit metadata, and the B-question interaction metadata for `サンシャイン|1|Get Ready 6`.
- Content commit: `960d19311b4c477540493de9772cd7e00a5356ac` (`vocab: repair SS1 Get Ready 6 future past-tense leak`).
- No workflow run had yet been created for that new SHA when checked (`head_sha=960d...` returned 0 runs), so post-change all-168 counts are NOT claimed as verified in this checkpoint.

## Current exact state
- Vocabulary audited baseline: `168/168`.
- Vocabulary chronology baseline before this repair: `FAIL / IN PROGRESS`.
- Last verified strict unresolved baseline: `556` unique / `2826` leak occurrences = `1071 FUTURE_V7_LEAK + 1755 UNREGISTERED_V7 + 0 UNREGISTERED_PROPER`.
- Repair this run removes the final-runtime SS1 Get Ready 6 occurrences of `had`, `ate`, `saw`, and unregistered `pizza`; exact new aggregate counts remain pending the next authoritative all-168 run.
- Content passages changed this run: `1` (`SS1 Get Ready 6`).
- Synchronized A/B question set changed this run: `1` passage.
- New notes added this run: `0`; retained notes baseline: `22`.
- `missing_gloss`: last verified `0`; no unglossed note was introduced.
- Grammar baseline: `168/168` candidate scan, `20` detected feature families; exact evidence-backed subunit introduction chronology still pending. This run deliberately removes the known Get Ready 6 past-tense future grammar rather than authorizing it.
- Slash/reference: passage slash rows were changed in synchronization with the passage. Reference regression must be re-run; PASS is not claimed for this new commit until the terminal reference bridge and slash workflow validate it.
- Main release: NOT performed.

## PASS / FAIL snapshot
- canonical v7 source re-check: PASS.
- vocabulary coverage baseline: 168/168 PASS; chronology still FAIL until authoritative rescan reaches zero leaks.
- missing gloss: last verified PASS (`0`).
- notes UI: last verified PASS.
- grammar coverage baseline: 168/168 candidate scan PASS; chronology PENDING/FAIL-CLOSED.
- slash reference/regression on new content commit: PENDING RESCAN (previous commit was PASS).
- browser/print on new content commit: PENDING final regression.
- public main/live GitHub Pages: intentionally unchanged / not final.

## Exact stop / next start
- Exact stop: SS1 Get Ready 6 future `had / ate / saw / pizza` content was repaired and committed at `960d19311b4c477540493de9772cd7e00a5356ac`; no Actions run had appeared for that SHA at the final check of this run.
- Next start: re-read branch HEAD because Actions may append report commits; inspect the first authoritative audit/slash run covering `960d...`. If a reference mismatch is reported, update the canonical reference chronology/slash synchronization for Get Ready 6 rather than reverting the chronology-safe passage.
- After verification, continue unresolved high-frequency candidates without small batches: `food`, `part`, `contest`, `fruit`, `partner`, `town`, then descending remainder. Resolve each from live v7 earliest textbook/grade/PDF/subunit evidence; prefer natural known-vocabulary replacement and use passage-local notes only when meaning cannot be preserved otherwise.
- After vocabulary leak reaches zero: populate evidence-backed exact-subunit grammar `introductionEvidence` for all detected feature families, run true grammar chronology, and reduce `future_grammar_leak` to zero.
- Final only after vocabulary chronology 168/168 PASS, grammar chronology 168/168 PASS, missing_gloss=0, future vocab/grammar leak=0, slash reference=168/168, A/B evidence, coverage/DOM, Chromium/Firefox/WebKit-iPhone and A4 student/teacher print all PASS: update main, verify live GitHub Pages, then stop automation.
