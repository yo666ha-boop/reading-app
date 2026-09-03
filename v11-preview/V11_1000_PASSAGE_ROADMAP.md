# v11 長文アプリ 1000題拡張ロードマップ

Updated: 2026-08-27 JST
Branch: `v11-1000passage-easy-notes`
Baseline: v10 FINAL COMPLETE (168 passages)
Target: 1000 passages
Remaining from baseline: 832 passages
Planned increment: 50 passages per audited batch (16 x 50 + final 32 = 832)

## Non-negotiable source of truth
- Vocabulary: native Google Sheet `1AkKYV6h-9ZCq1-p8126u4t8z0pvPSRnHlOfY8C-3hH4`, tab `単語マスター`, 3975 canonical v7 records.
- Grammar: textbook/grade/subunit chronology gate already established in v10; new passages must be at or before the selected unit.
- Slash reading: reference-book minimum rules and the completed v10 168/168 reference gate.
- v10 production baseline must not be overwritten until a v11 batch passes every gate.

## v11 goals
1. Add a weak-student vocabulary support switch. Normal mode keeps required/local notes; support mode adds more already-learned vocabulary notes, clearly labeled as support rather than unlearned vocabulary.
2. Make the passage/question data architecture scalable beyond 168 passages.
3. Add passages in audited batches of 50. First batch target: 218 total.
4. Create a curriculum-progress version in which each passage is bound to textbook + grade + exact section ceiling for both vocabulary and grammar.
5. Reach 1000 passages without semantic nonsense, random sentence stitching, broken referents, or unanswerable questions.

## Passage quality gate for every new passage
- One coherent topic, story, dialogue, email, notice, report, or experience.
- Clear speaker/referent/time/place relations; no unexplained pronouns or contradictory facts.
- Vocabulary chronology PASS for the exact textbook/grade/section. Necessary outside vocabulary must have a Japanese gloss; unnecessary future vocabulary must be rewritten.
- Grammar chronology PASS for the exact textbook/grade/section.
- Natural Japanese full translation.
- Reference-style slash English + front-reading Japanese with matching chunk count/order.
- Questions must be answerable from the passage. Every answer carries evidence, evidenceJp, and reason.
- Avoid merely changing names/numbers to manufacture near-duplicates; each passage needs a distinct reading purpose/content structure.
- Runtime DOM, Chromium, Firefox, WebKit/iPhone, student/teacher A4 print PASS before release.

## Batch plan
- Batch 01: +50 -> 218
- Batch 02: +50 -> 268
- Batch 03: +50 -> 318
- Batch 04: +50 -> 368
- Batch 05: +50 -> 418
- Batch 06: +50 -> 468
- Batch 07: +50 -> 518
- Batch 08: +50 -> 568
- Batch 09: +50 -> 618
- Batch 10: +50 -> 668
- Batch 11: +50 -> 718
- Batch 12: +50 -> 768
- Batch 13: +50 -> 818
- Batch 14: +50 -> 868
- Batch 15: +50 -> 918
- Batch 16: +50 -> 968
- Batch 17: +32 -> 1000

## Current implementation checkpoint
- Separate v11 branch created from final v10 public state.
- `v11_easy_support_notes.js` created. It builds extra support notes from a curated subset of canonical v7 meanings and adds the `単語サポート多め` switch without changing the meaning of the required-note category.
- v11 loader hook added branch-only through `v10_grammar_vocab_final_sync.js`; main v10 is untouched.
- Next: automated support-note/runtime audit, then scalable multi-passage-per-section data model and Batch 01 (+50).
