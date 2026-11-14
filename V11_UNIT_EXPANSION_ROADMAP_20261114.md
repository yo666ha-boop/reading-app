# v11 UNIT-based English Reading Expansion — 2026-11-14 JST

## Confirmed problem
The 1000-item v11 runtime is made of 168 verified base passages and 832 later-batch passages. The 832 extras were registered in only six late sections (one section for each textbook × grade), so early and middle UNIT/PROGRAM choices did not get the expected reading variety. Prior v11 selector used the **selected section only** despite labeling the selector “小単元上限”.

## Changes in this branch (not yet released)
- `v11_multi_passage_architecture.js` provides **two selectable modes**: studied-through cumulative UNIT scope (default) and exact selected UNIT only. Both exclude future sections. An explicit Story genre is now selectable.
- Supplements are held outside `V11_EXTRA_PASSAGES` under `V11_UNIT_SUPPLEMENTAL_PASSAGES`. This preserves the exact 168+832=1000 core gates in Batch15, Batch16 and FINAL32.
- `v11_unit_supplemental_20261114.js` and `v11_unit_supplemental_wave2_20261114.js` add **12 candidate texts** across 12 different early sections in all six tracks: 120 A/B evidence-linked questions and 146 aligned slash/translation rows.
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

## Verified full-corpus coverage (2026-11-14)
- Full persistent browser inventory: base 168 + core extras 832 + review-only supplemental candidates 12 = **1012 total candidates**, without altering the frozen 1000.
- **168 school UNIT/PROGRAM sections** across six grade/textbook tracks; **150 still have fewer than two readings**. At least 150 more *approved* texts are needed to give every section a second passage.
- A stronger three-readings-per-section goal (introductory, standard, applied) currently requires at least **312 further approved passages**; this number is derived from the actual full inventory and excludes the six late-unit groups that already exceed the target.
- Coverage QA includes 12 selected UNIT checkpoints, cumulative and exact UNIT scopes, genre filter, A/B switch, future-UNIT blocking, and full 1000+12 inventory output. Report is saved as a GitHub Actions artifact (`V11_UNIT_COVERAGE_REPORT_20261114.json`).
- V7 direct reference and known future-word revisions are documented in `V11_UNIT_V7_ALIGNMENT_20261114.md`. Unit 1-1 NH G1 "friend", Unit 1-1 NH G2 "excited", and Sunshine G3 PROGRAM 1-2 "portion" were removed from candidate passages because of later-UNIT vocabulary risk.

## Expansion target
Keep the 1000 original passages frozen. First reach **at least two verified passages per UNIT** (150 more needed beyond the current 12 drafts), then work toward **at least three distinct reading experiences per UNIT** (312 more needed from the current 1012-candidate snapshot). Prioritize the 150 still-undercovered early/middle sections and enforce full vocabulary and grammar chronology before approval. Short pre-grammar units should use natural short texts, not forced 100-word padding.

## Current status
- Core: 1000 verified items, unchanged.
- UNIT supplement authored: **12 candidates**, original source code and A/B question evidence saved.
- Automated structural/unit QA: **PASS** for 12 exact section IDs, 120 question evidence links, 146 slash rows, no known future-unit leak, and baseline sentence reuse bound. Chromium verifies six tracks and 12 UNIT checkpoints, A/B selection, exact/current UNIT, cumulative scope, story genre. Full inventory run 43560900652: SUCCESS (2026-11-14 JST).
- Canonical v7 master targeted unit lists were retrieved for all six target sections; full token-by-token vocabulary plus grammar approval: **not yet granted**.
- Production and public preview: unchanged until explicit integration and full smoke test.
