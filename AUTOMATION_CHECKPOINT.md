# Long-reading app vocabulary / grammar audit checkpoint

Updated: 2026-08-25 02:10 JST

## Source of truth
- Repository: `yo666ha-boop/reading-app`.
- Work branch: `v10-vocab-grammar-notes-audit` only.
- Work branch HEAD observed after fresh bot-persisted core audit: `6132c111eaab9e86b074a9bda423361032ddde7d` (`Record core cumulative vocabulary and grammar audits [skip ci]`).
- Public `main` HEAD remains `1f0cabf9bfcc4482f507e33188499bdbbd5bab57`; main was NOT modified.
- Canonical vocabulary source was re-opened live from Google Drive: `英単語_教科書別マスターデータ_NH_SS_2026_v7_app_wordbook_master`, Sheet id `1AkKYV6h-9ZCq1-p8126u4t8z0pvPSRnHlOfY8C-3hH4`, `単語マスター` 3975 records. The exported live v7 workbook was used for the first canonical-resolution pass; old v5/v6 data were not substituted.

## Work completed this run
- Diagnosed the previous Actions stall: the job reached `v10_notes_ui_test.js` before the two all-168 audits and could hang there, preventing fresh reports from being persisted.
- Reworked `.github/workflows/v10-vocab-grammar-notes-audit.yml` on the work branch so the all-168 vocabulary audit and grammar candidate audit run first with bounded timeouts, and their reports/status are committed BEFORE the bounded notes-UI gate. This prevents the UI test from swallowing core audit evidence again.
- Verified the corrected workflow in an isolated non-main runner. GitHub Actions run `32753921697` completed successfully: all-168 vocabulary candidate audit PASS, all-168 grammar structure candidate audit PASS, status write PASS, core-report persistence PASS, bounded notes-UI step completed under the workflow bound, artifact upload PASS.
- The isolated evidence artifact was downloaded and inspected directly; it contains the full vocabulary and grammar JSON reports and logs.
- The actual work branch subsequently received a fresh bot-persisted core audit. Its current authoritative compact status is now fresh, not the old 5,407 report.

## Current authoritative core counts on work branch
- passages audited: `168/168`
- exact allowed occurrences: `22523`
- cumulative prior/current-section allowed occurrences: `7460`
- function words routed to grammar chronology: `6106`
- morphology occurrences routed to grammar chronology: `1149`
- proper-name/v7 lookup occurrences: `160`
- unresolved v7 lookup occurrences after app cumulative gate: `3500`
- unique normal v7 lookup candidates: `668`
- unique proper lookup candidates: `34`
- notes currently present: `0`
- missing gloss among present notes: `0`
- passages missing allowedWords: `0`
- grammar candidate passages: `168/168`
- detected grammar feature types: `20`
- IMPORTANT: `3500`, `668`, and `34` are lookup candidates, NOT confirmed future-vocabulary violations.
- The superseded old `5407` figure must never be reused.

## Canonical v7 resolution progress
- A first canonical v7 chronology pass was run against the live exported v7 master using textbook, grade, file-unit order, explicit section labels (`PROGRAM n-k`, `Unit n Part/Read and Think`, presteps), prior-grade learning, `検索用基本形`, and `変化形・別表記`.
- Morphology was normalized during this pass (plural/3sg/past/ing/comparative/superlative plus irregular/base handling) instead of treating surface forms as automatically unknown.
- In the just-prior full candidate artifact there are `702` scanner candidate records (`668` normal + `34` proper), representing `687` distinct surface tokens because some appear in both scanner classes.
- `324/687` distinct surface tokens were cleared completely at every occurrence checked in this first pass as already learned in a prior grade or learned by the v7 cutoff. They must not receive unknown-word notes merely because the app-local allowedWords list omitted them.
- `363/687` distinct surface tokens still have at least one occurrence requiring deeper resolution (future-v7, later-grade, truly absent-from-v7, school-elementary-known allowance, proper name, or section-boundary ambiguity). These are NOT yet final violations.
- High-frequency false positives such as inflected forms must continue to be collapsed to their v7 base form before any replacement/gloss decision.
- Existing confirmed repairs remain valid: Sunshine G1 Get Ready 4 `play` is canonical v7 and needs no gloss; Sunshine G1 PROGRAM 2-2 `town` is prior-section cumulative and needs no gloss.

## Grammar / UI status
- Grammar structure extraction now covers `168/168` and reports 20 feature families. This is candidate extraction only; the evidence-backed textbook/small-unit introduction thresholds still must be built before `future grammar leak=0` can be claimed.
- The isolated run's notes UI log remained empty and its compact artifact marked `notes_ui_gate=FAIL_OR_TIMEOUT`; therefore notes UI is NOT yet a final PASS even though the workflow no longer blocks on it. Root cause still needs isolation/fix before browser/print final gates.
- No passage body/slash text was changed in this run, so the previously completed slash-reference content was not intentionally altered. Final slash regression still must be rerun after any vocabulary/text repair.

## Exact stop / next start
- Exact stop: fresh core reports are now persisted and old 5,407 is eliminated. Canonical v7 candidate-resolution pass 1 has cleared 324 distinct surface candidates; 363 distinct surface candidates still require evidence-backed classification. No genuine future-vocabulary count has been finalized yet and no passage replacement/note was applied from an unresolved candidate.
- Next start: obtain the current work-branch full candidate report corresponding to HEAD `6132c111...` (do not substitute the slightly earlier isolated-run occurrence totals), continue v7 exact-section resolution for the remaining candidates, explicitly separate elementary-known/function/proper-name/true-absent/future cases, then apply only confirmed repairs. In parallel derive grammar introduction thresholds from evidence, fix the notes UI test hang, then rerun slash/A+B/DOM/Chromium/Firefox/WebKit-iPhone/A4 student+teacher print gates.
- Keep public main unchanged until every final gate passes.
