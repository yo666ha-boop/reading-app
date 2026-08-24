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
- [x] First scan occurrence counts: exact allowed 22516 / function-to-grammar 11923 / morphology-to-grammar 805 / proper-name v7 lookup 247 / v7 lookup 5407.
- [x] `allowedWords` missing passages: 0/168.
- [x] Existing reviewed `notes` entries in production data: 0. This does **not** prove notes are unnecessary; unresolved candidates still require v7 chronology resolution.
- [x] Aggregation added so unresolved occurrences collapse to unique token + affected passage/section sets before v7 lookup.
- [x] Restored a safe notes rendering layer on the working branch: `notes:[{english,japanese,reading?}]` renders as `注（未習語）`; zero-note passages remain unchanged; HTML is escaped; mobile/print wrapping included.
- [x] Added `v10_notes_ui_test.js` and CI gate for gloss rendering.
- [x] First exact v7 resolution: Sunshine G1 Get Ready 4 `play` is **not** a future word. v7 master row ID 2146 lists `play / ~をする` in `プレステップ4 だれが何をどうする`. The app's Get Ready 4 allowedWords omitted it. Working branch correction adds it to metadata and does not create a false unknown-word note.
- [x] Started `v10_v7_vocab_resolution.json`; every exact resolution must carry master evidence.

## Current interpretation of candidate counts
`V7_LOOKUP_REQUIRED` and `PROPER_V7_LOOKUP_REQUIRED` are candidates, not confirmed violations. They must be resolved against the v7 master at the exact textbook/grade/unit cutoff. `FUNCTION_TO_GRAMMAR` and `MORPHOLOGY_TO_GRAMMAR` are also not automatic PASS: each must pass the chronological grammar gate.

## Remaining completion gates
- [ ] Resolve every unique v7 lookup candidate against cumulative v7 chronology.
- [ ] Repair missing allowedWords metadata where v7 proves the word is already learned.
- [ ] Rewrite genuine future words to already-learned vocabulary where natural.
- [ ] Add Japanese-meaning `notes` only for genuinely indispensable unknown words; missing gloss must be 0.
- [ ] Build textbook/section grammar chronology gate and audit all 168 passages + A/B question English.
- [ ] Vocabulary chronology PASS 168/168; future vocabulary leak 0.
- [ ] Grammar chronology PASS 168/168; future grammar leak 0.
- [ ] Re-run reference slash 168/168 after every passage edit.
- [ ] A/B evidence, translation, slash English/Japanese synchronization PASS after edits.
- [ ] Chromium / Firefox / WebKit-iPhone / A4 student/teacher print PASS.
- [ ] Merge only after all gates PASS, then verify GitHub Pages live runtime.

## Exact resume point
Continue from the aggregated unique v7 lookup candidate list in `v10_vocab_notes_candidate_report.json`. Resolve candidates against the v7 master in chronological order by textbook/grade/section, recording each verified decision in `v10_v7_vocab_resolution.json`. In parallel, derive the explicit grammar chronology gate. Do not mark complete until every remaining checkbox passes.
