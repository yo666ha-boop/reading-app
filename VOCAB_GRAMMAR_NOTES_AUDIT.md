# V10 vocabulary / grammar / notes audit

Started: 2026-08-24 JST
Working branch: `v10-vocab-grammar-notes-audit`
Status: IN PROGRESS — previous release completion is not sufficient for vocabulary/grammar/notes.

## Authoritative vocabulary source
Google Drive: `英単語_教科書別マスターデータ_NH_SS_2026_v7_app_wordbook_master`
- spreadsheet id: `1AkKYV6h-9ZCq1-p8126u4t8z0pvPSRnHlOfY8C-3hH4`
- 3975 canonical records
- English blanks: 0
- Japanese blanks: 0
- reading blanks: 0
- v6 canonical English diffs: 0
- v6 canonical Japanese diffs: 0

## Findings that invalidate a blanket PASS
1. Existing generic `v10_audit_test.js` checks that `vocabAudit===true` and `allowedWords` is non-empty, but does not token-by-token compare every passage against the v7 master and its unit cutoff.
2. Some targeted audits explicitly block future-unit vocabulary, but this is not a single 168-passage master comparison.
3. The current public `index.html` has no vocabulary-note/gloss rendering at all.
4. Older long-reading DB behavior explicitly supported out-of-set words as Japanese-meaning notes. That requirement must be restored, not silently dropped.

## 2026-08-24 active pass
- [x] Added an all-168 runtime vocabulary candidate scanner covering passage sentences, slash English, A questions and B questions.
- [x] First complete scan: 168/168 passages loaded successfully.
- [x] First scan occurrence counts were exact allowed 22516 / function-to-grammar 11923 / morphology-to-grammar 805 / proper-name v7 lookup 247 / v7 lookup 5407. These counts are now **superseded** because the first scanner compared only each passage's local `allowedWords`.
- [x] Found and fixed the scanner's main false-positive cause: earlier learned vocabulary was re-flagged whenever it was not repeated in the current passage's local `allowedWords`.
- [x] Corrected `v10_vocab_notes_candidate_audit.js` so each textbook+grade has a cumulative reviewed vocabulary set. The current section is added immediately before auditing that section; later/future sections are never added. The report now separates `EXACT_ALLOWED` from `CUMULATIVE_ALLOWED`.
- [x] Updated the audit workflow/status schema to persist `cumulative_prior_allowed_occurrences` separately and to mark the remaining lookup list as only those unresolved after current+prior reviewed vocabulary.
- [x] `allowedWords` missing passages in the last persisted scan: 0/168.
- [x] Existing reviewed `notes` entries in production data in the last persisted scan: 0. This does **not** prove notes are unnecessary; unresolved candidates still require v7 chronology resolution.
- [x] Aggregation added so unresolved occurrences collapse to unique token + affected passage/section sets before v7 lookup.
- [x] Restored a safe notes rendering layer on the working branch: `notes:[{english,japanese,reading?}]` renders as `注（未習語）`; zero-note passages remain unchanged; HTML is escaped; mobile/print wrapping included.
- [x] Added `v10_notes_ui_test.js` and CI gate for gloss rendering.
- [x] First exact v7 resolution: Sunshine G1 Get Ready 4 `play` is **not** a future word. v7 master row ID 2146 lists `play / ~をする` in `プレステップ4 だれが何をどうする`. The app's Get Ready 4 allowedWords omitted it. Working branch correction adds it to metadata and does not create a false unknown-word note.
- [x] First cumulative-prior resolution: Sunshine G1 PROGRAM 2-2 `town` was a false lookup candidate. PROGRAM 2-1 explicitly reviewed `town` in its `allowedWords`; PROGRAM 2-2 is later and therefore may use it cumulatively. No rewrite or note is needed. This exact decision is now recorded in `v10_v7_vocab_resolution.json`.
- [x] Started `v10_v7_vocab_resolution.json`; every exact resolution must carry canonical or explicit prior-review evidence.

## Current interpretation of candidate counts
The original 5407 `V7_LOOKUP_REQUIRED` occurrences and 247 proper-name candidates are **not current violation counts** and must not be reported as such. The corrected cumulative scanner must recompute them. `FUNCTION_TO_GRAMMAR` and `MORPHOLOGY_TO_GRAMMAR` are also not automatic PASS: each must pass the chronological grammar gate.

## Current run checkpoint
- Candidate scanner scope: 168/168 passages.
- Confirmed vocabulary metadata repairs: 1 (`play`, Get Ready 4).
- Confirmed cumulative false-positive resolutions: 1 (`town`, PROGRAM 2-2).
- Confirmed future vocabulary leaks: not yet finalized.
- Notes/glosses required: not yet finalized; last persisted notes count 0, missing gloss 0.
- Grammar chronology violations: not yet finalized.
- Slash: no passage text was edited in this run, so the previously established reference slash 168/168 was not disturbed.
- Workflow evidence: no workflow run was attached to cumulative scanner commit `29854d2484a95171d86a0e77ae3915e3d7833b6c`; corrected aggregate counts therefore have not yet been persisted and must not be invented.
- Main observed: `1f0cabf9bfcc4482f507e33188499bdbbd5bab57`; this run did not write to main.

## Remaining completion gates
- [ ] Recompute and persist corrected all-168 cumulative vocabulary candidate report.
- [ ] Resolve every remaining unique v7 lookup candidate against cumulative v7 chronology.
- [ ] Repair missing allowedWords metadata where v7 or explicit prior review proves the word is already learned.
- [ ] Rewrite genuine future words to already-learned vocabulary where natural.
- [ ] Add Japanese-meaning `notes` only for genuinely indispensable unknown words; missing gloss must be 0.
- [ ] Build evidence-backed textbook/section grammar chronology gate and audit all 168 passages + A/B question English.
- [ ] Vocabulary chronology PASS 168/168; future vocabulary leak 0.
- [ ] Grammar chronology PASS 168/168; future grammar leak 0.
- [ ] Re-run reference slash 168/168 after every passage edit.
- [ ] A/B evidence, translation, slash English/Japanese synchronization PASS after edits.
- [ ] Chromium / Firefox / WebKit-iPhone / A4 student/teacher print PASS.
- [ ] Merge only after all gates PASS, then verify GitHub Pages live runtime.

## Exact resume point
The cumulative scanner logic is corrected and committed. Resume by obtaining the corrected `v10_vocab_notes_candidate_report.json` output (do not reuse the superseded 5407 count), then resolve its remaining global candidates against the canonical v7 exact section cutoff. Continue recording verified decisions in `v10_v7_vocab_resolution.json`. In parallel derive the grammar chronology only from explicit textbook/app evidence; unresolved grammar sections must remain unresolved rather than being guessed as PASS. Do not mark complete until every remaining checkbox passes.
