# v11 Batch09 r5 checkpoint

- Persistent runtime remains 568/1000; Batch09 has 50 drafts and is not registered.
- Started from the farther-ahead GitHub actual rather than older Drive-visible checkpoints.
- Added `v11_batch09_chronology_audit_r5.js` so the generated post-grammar residual vocabulary layer `v11_batch09_vocab_repair_r2.js` is included in the actual chronology audit chain.
- First r5 workflow run executed the audit but failed only while persisting reports. The workflow persistence path was repaired with package-lock suppression, force-add of generated reports, and direct push.
- r5 run 33237375985: SUCCESS.
- Persisted chronology after r5: passages 50/50; runtime 568; registered=false; vocab tokens 23874; required-note-covered 8586; vocab unregistered 1613; future_vocab 510; grammar occurrences 542; grammar unresolved 0; future_grammar 0. Grammar chronology PASS; vocabulary chronology still FAIL; final FAIL.
- Previous persisted pre-r5 status was vocab unregistered 5014 / future_vocab 1242 / grammar unresolved 124, so r5 materially reduced residuals without weakening gates.
- Do not register Batch09 until vocabulary chronology reaches unregistered=0 and future_vocab=0 and human semantic rewrite plus translation/slash, A/B question quality, normal/easy notes, naturalness, cross-batch, Chromium/iPhone, A4 student/teacher, and persistent runtime gates all PASS.
- Exact next start: re-read Drive 00/99 and branch HEAD, then continue Batch09 residual vocabulary repair from the r5 persisted report; after chronology is zeroed, perform the 50-passage human-level semantic rewrite and all downstream gates before 568->618 registration.
