# v11 Batch08 vocab/gloss checkpoint — 2026-08-29 JST

- Formal persistent runtime remains **518/1000**. Batch08 has **50/50 authored drafts** but remains `registered=false`; target after all gates is 568.
- Latest Batch08 chronology before note finalization: `vocab_unregistered=5104`, `vocab_future_leak=1518`, `grammar_unresolved=0`, `grammar_future_leak=0`. Grammar chronology is PASS; vocabulary chronology is still FAIL.
- The exact unresolved/future vocabulary inventory was frozen from the real FAIL report and materialized by `v11_batch08_build_vocab_repair.js` into `v11_batch08_vocab_repair.js`. This inventory contains **1759 passage-word pairs / 985 distinct words**. Its generated note text is explicitly temporary and is not a final Japanese gloss or a registration gate pass.
- Verified-gloss coverage audit `33227752293` succeeded. Reusing previously verified Batch06 canonical gloss plus Batch07 finalized manual gloss covers **534/985 distinct words (54.21%)**; **451 distinct words remain unresolved** and are listed in `V11_BATCH08_GLOSS_COVERAGE_AUDIT.json`.
- Do not replace unresolved glosses with the English word itself or generic placeholder text. Resolve/prune the 451 words in passage context, then run placeholder=0/final-note quality, chronology, human semantic/naturalness review, translation/slash sync, A/B quality, easy-support, cross-batch duplicate/near-duplicate, Chromium/iPhone, A4 student/teacher, and persistent runtime gates before registering 568.
- This checkpoint intentionally does not change `V11_1000_PASSAGE_STATUS.txt`; formal total remains 518.
