# Long-reading app vocabulary / grammar / notes checkpoint

Updated: 2026-08-27 JST (FINAL COMPLETE / Drive handoff synchronized)

## Source of truth / safety
- Repo: `yo666ha-boop/reading-app`.
- Audited work branch: `v10-vocab-grammar-notes-audit`.
- Sole vocabulary authority: native Sheet `1AkKYV6h-9ZCq1-p8126u4t8z0pvPSRnHlOfY8C-3hH4`, tab `単語マスター`, 3975 canonical records.
- Final release baseline merge commit: `1fab996266a441ab530ca6bdc1a416b82cbdd7a1`.
- Current main may contain later unrelated project commits; do not infer long-reading regression only from main HEAD advancing.
- Google Drive handoff root: `英語長文アプリ` folder ID `1pi4I-yRF-uMd_HYScFUE4d8U7VEgla9Y`.
- Drive progress master: `00_英語長文アプリ_進捗・引継ぎマスター` Doc ID `1VhCweUoa89jk97IO9Uau-_O6g63f-jlcJuT3wdQ-fjo`.

## Final verified state
- Passages: `168/168`.
- Vocabulary chronology: `PASS 168/168`.
- Vocabulary unresolved: `0 unique / 0 occurrences`.
- FUTURE_V7_LEAK: `0`.
- UNREGISTERED_V7 / UNREGISTERED_PROPER: `0`.
- Notes present: `663`.
- missing_gloss: `0`.
- Notes UI: `PASS`.
- Grammar chronology: `PASS 168/168`.
- Final grammar gate: `features=27 occurrences=1195 fpRemoved=57 resolved=1195 unresolved=0 future=0 final=PASS`.
- Future grammar leak: `0`.
- Production final runtime includes final grammar/vocabulary sync after the reference correction layer.
- Reference/slash: `PASS 168/168`.
- Stage2 coverage: `PASS 168/168`.
- Passage audit / A-B consistency runtime gate: `PASS`.
- DOM regression: `PASS`.
- Cross-browser/print: Chromium `PASS`, Firefox `PASS`, WebKit/iPhone `PASS`, A4 student/teacher print `PASS`.

## Final release evidence
- PR #5 merged: `true`.
- Merge commit: `1fab996266a441ab530ca6bdc1a416b82cbdd7a1`.
- Pre-release audited production commit: `ca22dc992f13e7dbf99b3a410155d81dedb3945d`.
- Vocabulary/grammar/notes audit run `32885436878`: `SUCCESS`.
- Slash-quality run `32885436855`: `SUCCESS`.
- GitHub Pages deployment run `32886343345`: `SUCCESS`.
- Live public runtime diagnose run `32886344269`: `SUCCESS`, including live runtime, iPhone and A4 print diagnosis.
- Public URL: `https://yo666ha-boop.github.io/reading-app/`.

## Completion status
- Final objective: `COMPLETE`.
- No remaining vocabulary chronology work.
- No remaining grammar chronology work.
- No remaining missing glosses.
- No remaining slash/reference regression.
- No remaining browser/mobile/print release blocker.
- Public main release and GitHub Pages verification are complete.
- Older interim files that still say `CANDIDATES_NOT_PASS_FAIL...` or `finalPass:false` are historical intermediate artifacts and MUST NOT override this final release evidence.
- New work starts only from a new user-requested change or a newly reproduced public bug.
