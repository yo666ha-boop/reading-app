# Long-reading app vocabulary / grammar / notes checkpoint

Updated: 2026-08-26 JST (FINAL COMPLETE)

## Source of truth / safety
- Repo: `yo666ha-boop/reading-app`.
- Work branch: `v10-vocab-grammar-notes-audit`.
- Sole vocabulary authority: native Sheet `1AkKYV6h-9ZCq1-p8126u4t8z0pvPSRnHlOfY8C-3hH4`, tab `単語マスター`, 3975 canonical records.
- Public release completed only after all required chronology and runtime gates passed.

## Final verified state
- Vocabulary chronology: `PASS 168/168`.
- Vocabulary unresolved: `0 unique / 0 occurrences`.
- FUTURE_V7_LEAK: `0`.
- UNREGISTERED_V7 / UNREGISTERED_PROPER: `0`.
- Notes present: `663`.
- missing_gloss: `0`.
- Notes UI: `PASS`.
- Grammar chronology: `PASS 168/168`.
- Grammar detector: `v3.1` refined fail-closed chronology gate.
- Final grammar gate log: `features=27 occurrences=1195 fpRemoved=57 resolved=1195 unresolved=0 future=0 final=PASS`.
- Future grammar leak: `0`.
- Production final runtime includes `v10_grammar_vocab_final_sync.js`, `v10_grammar_additional_future_sync.js`, and `v10_grammar_final_future_sync.js` after the reference correction layer.
- Reference/slash: `PASS 168/168`.
- Stage2 coverage: `PASS 168/168`.
- DOM regression: `PASS`.
- Cross-browser/print: Chromium `PASS`, Firefox `PASS`, WebKit/iPhone `PASS`, A4 student/teacher print `PASS`.
- Passage audit / A-B consistency runtime gate: `PASS`.

## Final release
- PR #5 was marked ready only after every branch gate passed.
- PR #5 merged to `main` as merge commit `1fab996266a441ab530ca6bdc1a416b82cbdd7a1`.
- Pre-release audited production commit `ca22dc992f13e7dbf99b3a410155d81dedb3945d` had all three required branch workflows SUCCESS:
  - passage audit run `32885436822` SUCCESS;
  - vocabulary/grammar/notes audit run `32885436878` SUCCESS;
  - slash-quality run `32885436855` SUCCESS.
- Slash-quality run included reference runtime 168 validation, reference sample gate, Stage2 full 168 coverage, DOM regression, Chromium/Firefox/WebKit browser engines, cross-browser + A4 print validation, and public Pages smoke; every step SUCCESS.
- GitHub Pages deployment for merge commit `1fab996266a441ab530ca6bdc1a416b82cbdd7a1`: run `32886343345` SUCCESS.
- Live public runtime diagnose for the same merge commit: run `32886344269` SUCCESS, including live runtime, iPhone and A4 print diagnosis.

## Completion status
- Final objective: COMPLETE.
- No remaining vocabulary chronology work.
- No remaining grammar chronology work.
- No remaining missing glosses.
- No remaining slash/reference regression.
- No remaining browser/mobile/print release blocker.
- Public `main` and GitHub Pages are released and verified.
- Recurring continuation automation may be disabled because the completion condition has been met.
