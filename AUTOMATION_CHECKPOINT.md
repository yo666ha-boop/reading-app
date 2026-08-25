# Long-reading app vocabulary / grammar / notes checkpoint

Updated: 2026-08-25 JST (manual continuation)

## Source of truth / branch safety
- Repository: `yo666ha-boop/reading-app`.
- Work branch: `v10-vocab-grammar-notes-audit`.
- Branch HEAD at start of this run: `e2312fc1f50ef3320afc2c2fb9222e916ce2047e`.
- Public `main`: `1f0cabf9bfcc4482f507e33188499bdbbd5bab57`; NOT modified.
- Sole vocabulary authority: native Google Sheet `英単語_教科書別マスターデータ_NH_SS_2026_v7_app_wordbook_master`, id `1AkKYV6h-9ZCq1-p8126u4t8z0pvPSRnHlOfY8C-3hH4`, tab `単語マスター`, 3975 canonical records.
- Final v10 load order re-read: terminal manual corrections -> passage-local note batch -> chronology/reference bridge prepare -> reference slash files -> final chronology bridge apply -> runtime complete.

## This run completed
- Re-read branch HEAD, main HEAD, checkpoint, latest Actions, audit workflow and final runtime load order before editing.
- Live-v7 checked and resolved the previous top ten families passage-locally without cumulative whitelisting: `badge`, `checklist`, `ocean`, `production`, `race`, `researchers`, `trash`, `white`, `basketball`, `straw`.
- Added 18 exact book+grade+section note definitions in `v10_passage_local_notes_batch2.js` and loaded that batch before reference chronology sync. Content commit chain: `0dc356abb07f411d85498e607c6cd2a158dab7f3` then loader commit `f2efa1494c3aa662b16e1a965ae5840585a58530`.
- Audit run `32823921366` completed SUCCESS for `f2efa...`: vocabulary 168/168; verified unresolved reduced from `548 unique / 2684 occurrences` to `538 unique / 2526 occurrences`; `FUTURE_V7_LEAK=926`; `UNREGISTERED_V7=1600`; notes `44 -> 62`; `missing_gloss=0`; runtime browser errors 0; grammar candidates remain 168/168 with 20 feature families.
- The notes UI subtest in that run exposed a test-fixture regression, not an app rendering failure: Get Ready 4 now legitimately contains the new `basketball` note, while the test still assumed that fixture was permanently note-free. Log failure was exactly `zero-note passage must hide gloss box`.
- Fixed `v10_notes_ui_test.js` so it temporarily clears the fixture and explicitly calls the normal `render()` before checking zero-note hiding. Test-fix commit `5286635b5a65f79a8e042a2d327643b3c68fe998`, then diagnostic/rerun commit `c6d2eba74ca8432d143526195d420ceb4f75f6cd`.
- Continued beyond the first ten families. Live-v7 checked the next nine high-frequency families and extended the loaded batch with exact local notes for `compare`, `detective`, `road`, `route`, `vegetables`, `visitors`, `bicycle`, `event`, `house`; extension commit `3da4941519a048b235faf732f3b1860f084fb0e5`.
- Canonical evidence captured: `detective=探偵`; `road=道路`; `bicycle=自転車`; `event=出来事, 行事`; standalone `compare`, `route`, `visitor(s)` are absent; `vegetables` occurs only inside canonical phrase `fried vegetables`; standalone NH `house` is absent and v7 has only SS phrase `the Opera House`. Cross-textbook rows were not promoted cumulatively.
- Also live-v7 inspected the following queued 12-occurrence families (`bento`, `button`, `consumption`, `donation`, `Hokkaido`, `kangaroo`, `poster`, `remaining`) so the next run can continue immediately; `poster=ポスター` exists in NH1, while the others searched here have no standalone canonical row in their current context.

## Current exact verified state
- Passages vocabulary-audited: `168/168`.
- Vocabulary chronology: `FAIL / IN PROGRESS`.
- Latest VERIFIED audit result: `538 unique / 2526 occurrences` = `926 FUTURE_V7_LEAK + 1600 UNREGISTERED_V7 + 0 UNREGISTERED_PROPER` from run `32823921366`.
- Verified notes present: `62`.
- `missing_gloss=0` PASS.
- Grammar candidate coverage: `168/168`, `20` detected feature families; evidence-backed exact subunit introduction boundaries still pending, so grammar chronology remains FAIL-CLOSED/PENDING.
- Latest verified 10-family improvement this run: `-10 unique / -158 occurrences`, notes `+18`.
- A further nine families totaling 123 occurrences have been implemented in the loaded local-note batch but are PENDING authoritative re-audit; do not count them as resolved until the queued run completes.
- Notes UI code itself remains intact; the stale zero-note fixture test was corrected. New authoritative notes UI rerun is pending.
- Slash/reference/browser/print had been fully PASS before these notes-only changes; newest notes-only commit still requires current run confirmation before claiming newest-content PASS.
- Public main release: NOT performed.

## Current Actions / PASS FAIL
- `32823921366` vocab/grammar/notes audit on `f2efa...`: SUCCESS. Core vocabulary figures above are authoritative; embedded notes UI subtest recorded the stale-fixture FAIL described above.
- New vocab/grammar/notes PR run `32824305288` on `c6d2eba...`: PENDING at checkpoint time; it includes the extended nine-family batch because that batch commit precedes `c6d2eba...`.
- New slash-quality PR run `32824305261` on `c6d2eba...`: IN_PROGRESS at checkpoint time.
- Vocabulary chronology overall: FAIL until zero.
- Grammar chronology overall: PENDING/FAIL-CLOSED until evidence-backed section chronology exists and leak=0.
- main: unchanged.

## Exact stop / next start
- Exact stop: branch content includes the first ten verified local-note families plus nine additional implemented families; last explicit user/test commit is `c6d2eba74ca8432d143526195d420ceb4f75f6cd`, with Actions `32824305288` pending and `32824305261` in progress when this checkpoint was written.
- Next start: FIRST re-read branch/main/Actions because Actions may append `[skip ci]` evidence commits. Then read fresh `VOCAB_GRAMMAR_NOTES_AUDIT_STATUS.txt` and `v10_vocab_unresolved_unique.json`. Confirm whether the nine-family extension removes exactly its 123 candidate occurrences and whether notes UI now PASSes. Do not assume expected counts.
- After that, continue immediately from the already-v7-inspected 12-occurrence group: `bento`, `button`, `consumption`, `donation`, `Hokkaido`, `kangaroo`, `poster`, `remaining`, then continue descending without a small-batch stop.
- For every family: live-v7 exact/base/variant + textbook/grade/subunit evidence first; fix morphology scanner when canonical base+allowed grammar should license the form; otherwise prefer a natural cumulative-word rewrite; only content-essential words get passage-local English+Japanese notes.
- Once vocabulary leak is zero: populate evidence-backed exact-subunit grammar introduction boundaries for all 20 detected families; run final grammar chronology to future_grammar_leak=0; rerun slash reference, A/B evidence, coverage/DOM, Chromium/Firefox/WebKit-iPhone and A4 student/teacher print.
- Only after every gate PASS: update `main`, verify live GitHub Pages `https://yo666ha-boop.github.io/reading-app/`, then stop the automation.
