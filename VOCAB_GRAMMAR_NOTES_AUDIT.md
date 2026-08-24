# V10 vocabulary / grammar / notes audit

Started: 2026-08-24 JST
Base: main @ d5c527291abb6777719c59d08f99344402a59cdb
Status: IN PROGRESS — previous release completion is not sufficient for vocabulary/grammar/notes.

## Authoritative vocabulary source
Google Drive: 英単語_教科書別マスターデータ_NH_SS_2026_v7_app_wordbook_master
- 3975 canonical records
- English blanks: 0
- Japanese blanks: 0
- reading blanks: 0
- v6 canonical English diffs: 0
- v6 canonical Japanese diffs: 0

## Findings that invalidate a blanket PASS
1. Existing generic `v10_audit_test.js` checks that `vocabAudit===true` and `allowedWords` is non-empty, but does not token-by-token compare every passage against the v7 master and its unit cutoff.
2. Some targeted audits (for example Sunshine G3 PROGRAM 6) explicitly block future-unit vocabulary, but this is not a single 168-passage master comparison.
3. The current public `index.html` has no vocabulary-note/gloss rendering at all.
4. Older long-reading DB behavior explicitly supported a maxNotes setting and rendered out-of-set words as notes with Japanese meanings. That requirement must be restored, not silently dropped.

## Completion gates
- [ ] Build cumulative v7 vocabulary ledger by textbook / grade / section.
- [ ] Audit all 168 passages sentence-by-sentence against the section cutoff.
- [ ] Audit all English answer/evidence strings against the same cutoff.
- [ ] Classify legitimate morphology / proper nouns / fixed expressions separately; no guessed allowances.
- [ ] Any necessary out-of-cutoff word must carry an explicit Japanese gloss in `notes`.
- [ ] Restore note/gloss display in the public UI and print output.
- [ ] Build textbook/section grammar chronology gate and audit all 168 passages + question English.
- [ ] Re-run slash 168/168 gate after edits.
- [ ] Chromium / Firefox / WebKit-iPhone / A4 print PASS.
- [ ] Publish to GitHub Pages and verify live runtime.

Do not mark complete until all boxes pass.
