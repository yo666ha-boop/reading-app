# V10 semantic audit blocker

Status: RELEASE BLOCKED

The structural/vocabulary/browser gates are not sufficient to approve the reading passages.
A manual human-level semantic review of all 168 passages is required before release.

## Problems confirmed in current data

- Some passages are grammatically possible but semantically disconnected or unnatural.
- Vocabulary items have sometimes been forced into a passage instead of being used only when they fit one coherent situation.
- Some sentences change subject/topic abruptly without enough context.
- Some English is textbook-like in form but not natural as a connected reading passage.

Examples already confirmed:
- Sunshine G1 PROGRAM 6-1: detective/pirate/monster discussion abruptly switches to `this singer`.
- Sunshine G1 PROGRAM 6-2: `Why do we go there?` is an unnatural self-question in the middle of the narrator's own account, followed by abrupt/repetitive statements.
- Sunshine G2 PROGRAM 5-1: `handle a book`, `handle the work`, and `At noon, I know when to take a coffee break.` are forced/unnatural in context.
- Sunshine G3 PROGRAM 3-1: `The mascots live in our event poster.` is unnatural English for the intended meaning.

## New release rule

No passage is release-ready merely because vocabulary, chronology, A/B questions, DOM, browser, and print checks pass.
For each of the 168 passages, verify all of the following manually:

1. One clear situation/theme throughout.
2. Sentence-to-sentence logical connection.
3. Natural English for a junior-high reading passage.
4. No forced consumption of unit vocabulary.
5. No abrupt unexplained person/place/topic changes.
6. Full Japanese translation matches the corrected English naturally.
7. Slash reading matches meaning chunks after the English is fixed.
8. Questions/answers/evidence are regenerated or corrected after any text change.
9. Vocabulary/grammar chronology gates still pass after revision.

Until this audit is completed and recorded passage-by-passage, PR #1 must remain draft and must not be merged into main.
