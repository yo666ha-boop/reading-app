# Long-reading app vocabulary / grammar audit checkpoint

Updated: 2026-08-25 JST, canonical-v7 chronology hardening and notes-UI gate repair

## Source of truth
- Repository: `yo666ha-boop/reading-app`.
- Work branch: `v10-vocab-grammar-notes-audit` only.
- Work branch HEAD observed during this run advanced through GitHub Actions; latest observed before checkpoint write: `2f42370163d38d3c47eefb99304c9bb121e20bd8` (`Record canonical v7 vocabulary and grammar audits [skip ci]`).
- Public `main` HEAD re-read live: `1f0cabf9bfcc4482f507e33188499bdbbd5bab57`; main was NOT modified.
- Canonical vocabulary source re-opened live: native Google Sheet `英単語_教科書別マスターデータ_NH_SS_2026_v7_app_wordbook_master`, id `1AkKYV6h-9ZCq1-p8126u4t8z0pvPSRnHlOfY8C-3hH4`, visible tab `単語マスター`, sheetId `109187341`, 3976 rows including header / 3975 canonical records, 33 columns. Header columns live-confirmed include 教科書, 学年, ファイル単元, 大単元, 単元名, PDF順, 英語, 日本語, 注記, 読みの目安, 検索用基本形, 変化形・別表記, 語句構造, v7確認状態.

## Work completed this run
- Re-read branch HEAD, main HEAD, checkpoint, latest audit reports/Actions, workflow definition, notes UI log, and current v10 load order before changes.
- Confirmed the canonical-v7 snapshot/audit infrastructure is already present in latest actual and scans all `168/168`; the old 420/21 app-allowedWords candidate result is obsolete.
- Confirmed v10 final load order begins with `v10_vocab_corrections.js`, then all passage data/fix scripts, then interaction metadata, then DATASETS/META assembly. This ordering explains why delayed correction-layer mutations can race strict runtime validators even when final data becomes correct.
- Found a remaining chronology loophole in `v10_vocab_notes_candidate_audit.js`: a token that exists in canonical v7 but is introduced in a future section could still become `REVIEWED_EXPLICIT_ALLOWED` when present in app `allowedWords`; likewise an inflected form could be handed to grammar from a future canonical base.
- Fixed the classifier so direct canonical-v7 chronology is authoritative: direct future token => `FUTURE_V7_LEAK`; inflection whose canonical base is future => `FUTURE_V7_LEAK`. App reviewed `allowedWords` can now only act as bounded fallback for tokens absent from canonical v7. Commit `c791e4561a28326fc54af43073e5e00e0b0818ac`.
- The stricter canonical run completed and persisted via Actions. Current authoritative discovery counts after that hardening: `168/168`, `V7_CHRONOLOGY_ALLOWED=33664`, `MORPHOLOGY_TO_GRAMMAR=1743`, `CONTRACTION_TO_GRAMMAR=10`, `EXPLICIT_FUNCTION_TO_GRAMMAR=647`, `FUTURE_V7_LEAK=1984`, `UNREGISTERED_V7=982`, `UNREGISTERED_PROPER=57`, `unique_unresolved=491`, `future_vocab_leak_occurrences=3023`, `notes_present=0`, `missing_gloss=0`. Vocabulary chronology remains FAIL, correctly fail-closed.
- Latest canonical report also records runtime validator errors separately instead of suppressing the vocabulary report. The observed errors include `Row mismatch 73` and an English mismatch around NH2 Unit 2-2 where the source still contains `give` while delayed correction rewrites to `talk about`. This is a load/synchronization defect to eliminate before final DOM/browser gates.
- Diagnosed notes UI CI timeout: the renderer test coupled its success to one unrelated vocabulary correction (`play` in SS1 Get Ready 4) after all 168 datasets were already loaded. The log consistently stopped after `NOTES UI PHASE 3: datasets=168`.
- Decoupled `v10_notes_ui_test.js` from vocabulary-correction timing. It now tests only the notes UI contract on a stable fixture: title `注（未習語）`, English + Japanese meaning + optional reading, HTML escaping, and hidden state when notes are empty. Vocabulary correction readiness remains the responsibility of the canonical vocabulary audit. Commit `694f80c8ced98e2ae96ef6b646758401f9368414`.
- A fresh Actions core audit after the UI-test change persisted at `2f42370163d38d3c47eefb99304c9bb121e20bd8`; final UI evidence had not yet been persisted at the exact checkpoint-write moment, so notes UI remains pending verification rather than being claimed PASS.
- main was never written.

## Current counts / truth status
- passages vocabulary scanned: `168/168`.
- vocabulary chronology: `FAIL / in progress`.
- future vocab leak occurrences: `3023` under the stricter canonical-v7-precedence scanner.
- unresolved vocabulary keys: `491`.
- future-v7 occurrences: `1984`.
- unregistered-v7 occurrences: `982`.
- unregistered-proper occurrences: `57`.
- morphology handed to grammar: `1743`.
- explicit function forms handed to grammar: `647`.
- contractions handed to grammar: `10`.
- content repairs this run: `0` direct passage edits; scanner logic and UI-test infrastructure were repaired.
- notes added this run: `0`.
- notes currently present in canonical report: `0`.
- missing gloss: `0` for current notes, but unknown/future vocabulary is not resolved, so final missing-gloss PASS is not yet established.
- grammar structural scan: `168/168`; `19` detected rule families; final chronology remains fail-closed pending evidence-backed introduction thresholds.
- future grammar leak: `PENDING` exact textbook/subunit mapping.

## UI / regression status
- Notes renderer installed; bounded test code is repaired but fresh final UI PASS evidence is pending persistence.
- Runtime validator errors still exist and must be eliminated rather than ignored.
- Full slash-reference `168/168`: pending rerun after vocabulary/content repairs finish.
- Full A/B evidence consistency: pending rerun.
- coverage/DOM, Chromium/Firefox/WebKit-iPhone, A4 student/teacher print: pending final gates.

## Exact stop / next start
- Exact stop: canonical-v7 precedence loophole is closed and the stricter 168/168 report is persisted; notes UI test is decoupled from vocabulary repair timing. Current strict vocabulary set is 491 unresolved keys / 3023 occurrences. Runtime still reports two synchronization/validator errors.
- Next start 1: read the fresh notes UI Actions result and verify whether the decoupled renderer test now reaches `NOTES UI PASS`; if not, use the new stopping line/error directly.
- Next start 2: eliminate the runtime source/correction races, beginning with NH2 Unit 2-2 `give -> talk about` so the actual loaded source, fullTranslation, slashRows and A/B evidence are already synchronized before validators run; then isolate `Row mismatch 73` to its exact source/fix pair.
- Next start 3: process the strict canonical unresolved set in descending impact, separating (a) genuine future-v7 vocabulary to replace or gloss, (b) unregistered words that are truly indispensable and need notes, (c) proper names that can be replaced or explicitly justified, and (d) morphology/function forms that belong to grammar chronology rather than vocabulary.
- Next start 4: populate `v10_grammar_chronology_gate.json.introductionEvidence` for the 19 detected families from evidence-backed textbook/subunit chronology and resolve all occurrences including `using / used / tells`.
- After vocabulary + grammar chronology reach zero leaks: rerun slash reference 168/168, A/B evidence, coverage/DOM, notes UI, Chromium/Firefox/WebKit-iPhone, A4 student/teacher print. Only all-PASS may update main and then verify GitHub Pages live.

## PASS / FAIL record
- vocabulary structural coverage: PASS `168/168`.
- canonical source identity/record count: PASS `3975`.
- canonical chronology precedence implementation: PASS after `c791e456...` hardening.
- vocabulary chronology final: FAIL / IN PROGRESS (`3023` unresolved occurrences).
- grammar extraction: PASS `168/168` candidate detection only.
- grammar chronology final: FAIL-CLOSED / IN PROGRESS.
- notes UI test implementation: repaired; fresh PASS evidence pending.
- missing gloss final: NOT YET PASS despite current `0`, because unresolved vocabulary remains.
- slash regression global: pending.
- runtime validator: FAIL (`Row mismatch 73` + NH2 U2-2 source/correction English mismatch observed).
- browser/print/public release: NOT RUN / intentionally blocked.
- main/public Pages: unchanged.
