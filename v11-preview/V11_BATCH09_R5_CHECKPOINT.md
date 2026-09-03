# v11 Batch09 r6 checkpoint

- Persistent runtime remains 568/1000; Batch09 has 50 drafts and is not registered.
- Batch09 grammar chronology remains clean: unresolved=0, future_grammar=0.
- r5 persisted vocabulary status remains unregistered=1613, future_vocab=510; do not weaken the gate or register Batch09.
- Investigated the residual vocabulary pipeline instead of adding fake/English glosses.
- Added `v11_batch09_gloss_apply_r2.js` to finalize post-grammar residual inventory only when a verified Japanese gloss exists.
- Added `v11_batch09_chronology_audit_r6.js` and workflow `v11-batch09-chronology-audit-r6.yml` so residual finalization is tested in the real chronology chain.
- r6 run 33239147475 completed and correctly remained FAIL: grammar is still PASS, vocabulary is still 1613 unregistered / 510 future. This proves the remaining issue is not merely the first gloss-apply ordering; the r2 residual layer is not being converted into gate-recognized `unlearned_local_required` notes by the current pipeline.
- No temporary annotation, English-as-Japanese gloss, allowlist weakening, or premature registration was introduced.
- Exact next start: inspect the note kinds/state produced by `v11_batch09_vocab_repair_r2.js` after all grammar repairs, convert only its true residual words using verified Japanese glosses, rerun chronology until unregistered=0 and future_vocab=0, then continue semantic/naturalness, translation/slash, A/B quality, normal/easy notes, cross-batch, Chromium/iPhone, A4 student/teacher, persistent runtime, and only then 568->618 registration.
- Latest work commits in this pass: dba14b05ae4309432cbec9f8be8e0e1729f067c4, f581751483ba6052f1ee560112edfd2531f9ce65, e5aace8c71ac7764d400868105b18fe24aabcb9b, c22ef62108bc41cacdcaf72f9505c0f90510fab8.
