# v11 Batch02 50-passage production plan

Status: SECTION MAPPING LOCKED — not registered in runtime and not counted toward 1000 until every gate passes.
Start point: 218/1000. Target after completion: 268/1000.

## Production rules
- Reuse only vocabulary/grammar that is valid at the exact textbook/grade/section chronology point.
- Every passage must have a distinct event arc, not merely reordered sentences or noun swaps.
- Full translation and slash rows are authored together with the English passage.
- A/B each contain 5 questions whose evidence sentence, evidence translation, and reason match the passage.
- Normal notes and easy-support notes are generated/checked separately against the v7 canonical wordbook.
- No runtime registration until the complete 50-item batch passes cross-batch diversity, chronology, UI and print gates.
- Blueprint meaning is preserved at the event-arc level, but wording must be simplified to the assigned section's audited vocabulary/grammar. A blueprint must never force future vocabulary or grammar into an earlier section.
- Passage length must not be uniform. Batch02 deliberately includes longer readings by word count while keeping vocabulary/grammar chronology valid.

## Batch02 word-count mix (locked)
- #1-17 (G1): standard 90-125 words; #5, #9, #13, #17 are long 135-165 words.
- #18-34 (G2): standard 115-155 words; #21, #25, #29, #33 are long 170-210 words.
- #35-50 (G3): standard 140-185 words; #36, #40, #44, #48, #49, #50 are long 210-270 words.
- Long passages must remain natural stories/informational readings, not padding or repeated sentences.
- Every completed object records an actual `wordCount`; the quality gate checks the assigned band before Batch02 can count toward 268.

## Audited section families used for Batch02
1. Sunshine G1 PROGRAM 10-2 — baseline `V10-SS-G1-P10-2-001`; Batch02 IDs `V11-SS-G1-P10-2-010` to `017`.
2. New Horizon G1 Unit 10-2 — baseline `V10-NH-G1-U10-2-001`; Batch02 IDs `V11-NH-G1-U10-2-010` to `018`.
3. Sunshine G2 PROGRAM 8-3 — baseline `V10-SS-G2-P8-3-001`; Batch02 IDs `V11-SS-G2-P8-3-010` to `017`.
4. New Horizon G2 Unit 7-4 — baseline `V10-NH-G2-U7-4-001`; Batch02 IDs `V11-NH-G2-U7-4-010` to `018`.
5. Sunshine G3 PROGRAM 7-3 — baseline `V10-SS-G3-P7-3-001`; Batch02 IDs `V11-SS-G3-P7-3-011` to `018`.
6. New Horizon G3 Unit 6-4 — baseline `V10-NH-G3-U6-4-001`; Batch02 IDs `V11-NH-G3-U6-4-011` to `018`.

## Locked 50-item authoring matrix
The Runtime IDs, assigned baselines, and 50 distinct event arcs remain exactly as locked in commit 758d5503303c1d7309460ded375e5150d459daa7. Authoring must preserve that mapping while applying the word-count mix above.

## Gate sequence before runtime registration
1. Author all 50 complete objects with English, actual wordCount, full translation, slash rows, A/B evidence/reasons.
2. Run word-count-band audit, including all designated long passages.
3. Run cross-batch exact/near-duplicate gate across all v11 batches.
4. Run independent v7 vocabulary chronology and unregistered/future-vocab checks for all 50.
5. Run independent grammar chronology and future-grammar checks for all 50.
6. Run normal notes and easy-support notes checks for all 50.
7. Run PC and iPhone-equivalent UI checks for all 50, with special overflow checks on the longest G3 passages.
8. Run A4 student/teacher print checks on the Batch02 section set, including long-passage pagination.
9. Only after all PASS, register Batch02 and change current total from 218 to 268.

## Next implementation step
Author all 50 complete passage objects against the locked matrix and length bands. Do not change runtime count or register a partial batch.