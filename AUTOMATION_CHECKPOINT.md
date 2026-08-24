# Long-reading app vocabulary / grammar audit checkpoint

Updated: 2026-08-25 02:14 JST

## Source of truth
- Repository: `yo666ha-boop/reading-app`.
- Work branch: `v10-vocab-grammar-notes-audit` only.
- Fresh core-audit bot commit: `6132c111eaab9e86b074a9bda423361032ddde7d`.
- Latest manual code fix after that core audit: `ce0a96155bb46fa61bfe843f7b3928a856d10677` (`test: prevent jsdom load-event hang in notes UI gate`).
- Public `main` HEAD remains `1f0cabf9bfcc4482f507e33188499bdbbd5bab57`; main was NOT modified.
- Canonical vocabulary source was re-opened live from Google Drive: `英単語_教科書別マスターデータ_NH_SS_2026_v7_app_wordbook_master`, Sheet id `1AkKYV6h-9ZCq1-p8126u4t8z0pvPSRnHlOfY8C-3hH4`, `単語マスター` 3975 records. The exported live v7 workbook was used for canonical-resolution pass 1; old v5/v6 data were not substituted.

## Work completed this run
- Diagnosed the previous Actions stall: `v10_notes_ui_test.js` ran before the two all-168 audits and could hold the job open, preventing fresh reports from being persisted.
- Reworked `.github/workflows/v10-vocab-grammar-notes-audit.yml` so the all-168 vocabulary and grammar audits run first with timeouts and their reports/status are committed BEFORE the bounded notes-UI gate.
- Verified that architecture in isolated GitHub Actions run `32753921697`. The job completed successfully: vocabulary 168/168 PASS, grammar candidate extraction 168/168 PASS, core status write PASS, core report persistence PASS, artifact upload PASS.
- Downloaded and inspected the full evidence artifact directly.
- The actual work branch then received a fresh bot-persisted core report, replacing the stale old 5,407 report.
- Repaired the notes UI test harness itself at `ce0a961...`: it no longer waits for jsdom's browser `load` event (dynamic v10 script injection can keep that event open); it instead waits directly for 168 datasets + the gloss renderer, emits phase diagnostics, always closes jsdom, and explicitly exits success so residual app timers cannot hold CI open. This fix is committed but its new run has not yet been verified as PASS, so notes UI remains unfinalized.

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
- `3500`, `668`, and `34` are lookup candidates, NOT confirmed future-vocabulary violations.
- Superseded `5407` MUST NOT be reused.

## Canonical v7 resolution progress
- Pass 1 used textbook, grade, canonical file-unit order, explicit section labels (`PROGRAM n-k`, `Unit n Part/Read and Think`, presteps), prior-grade learning, `検索用基本形`, and `変化形・別表記`.
- Morphology was normalized (plural/3sg/past/ing/comparative/superlative plus irregular/base handling) before unknown/future decisions.
- The full just-prior candidate artifact contains `702` scanner candidate records (`668` normal + `34` proper), representing `687` distinct surface tokens because some occur in both scanner classes.
- `324/687` distinct surface tokens were cleared completely at every occurrence checked in pass 1 as already learned in a prior grade or learned by the v7 cutoff. These must not receive unknown-word notes merely because app-local `allowedWords` omitted them.
- `363/687` distinct surface tokens still have at least one occurrence requiring deeper evidence-backed resolution: future-v7, later-grade, truly absent-from-v7, elementary-known allowance, proper name, or section-boundary ambiguity. These are NOT final violation counts.
- Confirmed prior repairs remain valid: Sunshine G1 Get Ready 4 `play` is canonical v7 and needs no gloss; Sunshine G1 PROGRAM 2-2 `town` is prior-section cumulative and needs no gloss.

## Grammar / UI status
- Grammar candidate extraction covers `168/168` and reports 20 feature families. It is not yet a chronology PASS; evidence-backed introduction thresholds by textbook/grade/small-unit must still be built.
- Previous isolated notes-UI evidence was `FAIL_OR_TIMEOUT` with an empty log. The harness cause has now been repaired in commit `ce0a961...`, but do not mark notes UI PASS until a fresh run confirms it.
- No passage body/slash text was changed in this run, so slash-reference content was not intentionally altered. Final slash regression still must be rerun after vocabulary/text repairs.

## Exact stop / next start
- Exact stop: fresh 168/168 core reports are persisted; v7 resolution pass 1 cleared 324 distinct surface candidates; 363 distinct surface candidates remain for evidence-backed classification; notes UI hang harness has been patched but awaits fresh-run verification. No genuine future-vocabulary count has yet been finalized and no unresolved candidate has been replaced or glossed.
- Next start: first inspect the Actions result produced after `ce0a961...` and confirm/fix notes UI. Then use the current work-branch full candidate report (not the slightly earlier isolated occurrence totals) to continue v7 exact-section resolution of the remaining candidates, separating elementary-known/function/proper-name/true-absent/future cases. Apply only confirmed repairs, derive grammar chronology, then rerun slash/A+B/DOM/Chromium/Firefox/WebKit-iPhone/A4 student+teacher print gates.
- Keep public main unchanged until every final gate passes.
