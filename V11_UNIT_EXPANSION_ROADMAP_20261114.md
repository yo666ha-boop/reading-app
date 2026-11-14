# v11 UNIT-based English Reading Expansion — 2026-11-14 JST

## Confirmed problem
The 1000-item v11 runtime is made of 168 verified base passages and 832 later-batch passages. The 832 extras were registered in only six late sections (one section for each textbook × grade), so early and middle UNIT/PROGRAM choices did not get the expected reading variety. Prior v11 selector used the **selected section only** despite labeling the selector “小単元上限”.

## Changes in this branch (not yet released)
- `v11_multi_passage_architecture.js` treats the selected section as the upper limit and includes all preceding sections in the same grade/textbook source ordering; excludes future sections.
- Supplements are held outside `V11_EXTRA_PASSAGES` under `V11_UNIT_SUPPLEMENTAL_PASSAGES`. This preserves the exact 168+832=1000 core gates in Batch15, Batch16 and FINAL32.
- `v11_unit_supplemental_20261114.js` adds six **candidate** original reading texts, one in each course, with 60 A/B evidence-linked questions and 74 aligned slash/translation rows.
- The corresponding source section IDs were found in the audited v10 baseline. This is *not* equivalent to the final direct v7 `単語マスター` / formal grammar gate; candidate status remains pending until that independent cross-check.
- `v11-preview-publish.yml` is updated to inject the new script only after it is integrated into the protected v11 work branch. This feature branch does not change the public v11-preview and must not directly merge into main.

| Course | Initial section receiving an extra passage | Candidate ID |
|---|---|---|
| Sunshine G1 | PROGRAM 1-1 | V11-UNIT-SS-G1-P1-1-001 |
| New Horizon G1 | Unit 1-1 | V11-UNIT-NH-G1-U1-1-001 |
| Sunshine G2 | PROGRAM 1-2 | V11-UNIT-SS-G2-P1-2-001 |
| New Horizon G2 | Unit 1-1 | V11-UNIT-NH-G2-U1-1-001 |
| Sunshine G3 | PROGRAM 1-2 | V11-UNIT-SS-G3-P1-2-001 |
| New Horizon G3 | Unit 1-1 | V11-UNIT-NH-G3-U1-1-001 |

## Quality / release gates
1. Every new text must be original, internally coherent, linked to an exact textbook/grade/section key, and contain an accurate Japanese translation, sentence-to-sentence slash explanation and at least two evidence-supported 5-question sets.
2. Check **every** vocabulary item and grammar construction against the canonical native Sheet `単語マスター` (ID `1AkKYV6h-9ZCq1-p8126u4t8z0pvPSRnHlOfY8C-3hH4`), corresponding actual UNIT, and cumulative earlier lessons; grade-specific grammar order needs an explicit human-readable audit trace. No use of a future grammar item just because it appears in a dictionary.
3. Run `node scripts/v11_unit_supplemental_audit.cjs` and Chromium UI smoke across all six courses. Confirm no later-unit text appears before its unit. Detect and fix any UI error.
4. Check duplicates and near duplicates against the full 1000 body corpus, and inspect narrative naturalness, slash meaning and A/B answer appropriateness manually before approval.
5. Only after passing these gates change `curriculumGate` to `VERIFIED_V7_CANONICAL`, merge to v11 source, and verify new preview deployment. Never fast-forward/merge the divergent v11 branch into main.

## Expansion target
Keep all 1000 frozen passages. Add **at least two independent vetted passages to every under-covered unit** after authoring and verification, starting with early/middle sections of each of six course tracks. Base sections are at least 168 across the six course tracks, so a 2-per-section target implies at least 336 sectional additions (less overlap only where a section is already covered). Track coverage by unit, not merely by total passage count. Short pre-grammar units should use level-appropriate shorter passages rather than artificial 100-word padding.

## Current status
- Core: 1000 verified items, unchanged.
- UNIT supplement authored: 6 candidates, original code saved.
- v7 direct vocabulary/grammar full approval: **not yet granted**.
- Production and public preview: unchanged until explicit integration and full smoke test.
