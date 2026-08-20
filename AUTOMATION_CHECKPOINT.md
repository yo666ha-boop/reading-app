# Long-reading app public validation checkpoint

Updated: 2026-08-20 22:22 JST

- Public verification: not yet confirmed from this runner; direct external fetch from the assistant environment is unavailable.
- main HEAD before this checkpoint: `9545ca6feae0ec93f3bca598521b984d6c11ec29`.
- Change this run: updated `.github/workflows/v10-slash-quality.yml` to run on `main` and perform local 168/168 reference runtime validation, stage2 coverage/DOM, cross-browser+print validation, and a real GitHub Pages smoke test in Chromium and WebKit.
- Public smoke asserts exactly 168 passages have `slashReadingVersion=reference-book-minimum-rules-20260820` and `slashReferenceAudit=PASS_REFERENCE_20260820`.
- Public smoke specifically checks Sunshine grade 3 `PROGRAM 6-1` begins with:
  1. `A Canadian researcher studies a patch / in the ocean.`
  2. `It is said / that a lot / of trash can gather there.`
  3. `The researcher finds / that the trash is mostly plastic.`
  4. `A bottle can float / for a long time / and move / into the patch.`
- The workflow also requires the public `index.html` to contain cache-busted loader `v10_interaction_metadata.js?v=20260820-2055-reference` and checks the 168/168 runtime marker.
- Remaining: obtain the workflow result, inspect any failed step/log, fix if needed, then confirm public Chromium/WebKit and print validation all pass. Do not mark complete until the public workflow passes.
- Next start point: commit `9545ca6feae0ec93f3bca598521b984d6c11ec29`, inspect `v10 slash quality` run triggered by that main push.
