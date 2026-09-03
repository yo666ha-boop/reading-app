# v11 Batch03 authoring checkpoint — 2026-08-28

## Persistent runtime remains locked
- Current persistent runtime: 268/1000.
- Batch03 target after all final gates: 318/1000.
- Batch03 is **not registered**. Do not update status to 318 until all required gates pass.

## Completed in this authoring pass
- `V11_BATCH03_50_PASSAGE_PLAN.md`: 50 distinct event arcs, exact six-family textbook/grade/section mapping, locked IDs and baselines.
- Authored all 50 non-runtime story-specific passages:
  - G1: `v11_batch03_passages_draft_g1.js` — 17 passages.
  - G2: `v11_batch03_passages_draft_g2.js` — 17 passages.
  - G3: `v11_batch03_passages_draft_g3.js` — 16 passages.
- English sentences, full Japanese translation, slash rows, A/B 5+5 structural scaffolds, evidence English/Japanese/reason fields and local-note seeds exist for all 50.
- Semantic rewrite/story-specific flag exists for 50/50; these are not a repeated safe-sentence scaffold.

## Length/structure gate
- Initial G1 audit correctly failed six short passages; `v11_batch03_g1_length_repair.js` added story-specific content without lowering bands.
- G1 draft audit run `33153743969`: SUCCESS.
- Initial full 50 draft audit run `33153950802`: FAIL only for 17 word-band misses.
- `v11_batch03_length_repair.js` added story-specific content to those 17 without lowering any target band.
- Full 50 draft audit run `33154089646`: SUCCESS.
- Therefore 50/50 currently pass count/unique ID, target word band, stored/actual word count, sentence/slash count, full translation existence, A/B 5+5 structure, evidence-in-body and evidence-JP/reason presence.

## Independent chronology gate added
- Added `v11_batch03_chronology_audit.js` and `.github/workflows/v11-batch03-chronology-audit.yml`.
- Canonical v7 source remains 3975 records.
- First Batch03 chronology run `33154153663` intentionally FAIL-CLOSED:
  - passages=50/50
  - semantic_rewrite_complete=50/50
  - registered=false
  - runtime_total=268
  - vocab_tokens_scanned=25322
  - required_note_covered=706
  - vocab_unregistered=2094 occurrences
  - future_vocab=1252 occurrences
  - grammar_occurrences=887
  - grammar_unresolved=151
  - future_grammar=0
  - final=FAIL
- This result must be treated as a repair list, not as a reason to weaken chronology gates.

## Important quality state
- The new passages are natural story-specific drafts, but many words/structures are not yet legal at their assigned chronology point.
- A/B questions are structurally complete but are still sentence-evidence scaffolds; final content-understanding diversification must happen **after** body chronology is stable.
- Existing cross-batch workflow reported success on a Batch03-triggered run, but its loader must be explicitly inspected before accepting that as a final Batch01-03 duplicate gate for the split G1/G2/G3 draft files.

## Next exact start point
1. Re-read Drive 00/99 and GitHub actual first; use any newer normal checkpoint if present.
2. Use artifact from chronology run `33154153663` as the violation list.
3. Repair vocabulary/grammar in the passage bodies while preserving each story and word-count bands. Use local required notes only for genuinely necessary story vocabulary; do not blanket-bypass future chronology.
4. Re-run chronology until `unregistered=0`, `future_vocab=0`, `grammar_unresolved=0`, `future_grammar=0`.
5. Re-run full content/length structure after body changes.
6. Diversify A/B into content-understanding questions and independently audit evidence/reason alignment.
7. Audit normal notes + easy-support notes.
8. Explicitly include Batch03 in cross-batch exact/near-duplicate audit.
9. Run naturalness, PC/iPhone, A4 student/teacher and persistent-runtime gates.
10. Only after all PASS register Batch03 and update 268 -> 318.
