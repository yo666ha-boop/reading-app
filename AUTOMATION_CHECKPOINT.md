# Long-reading app vocabulary / grammar / notes checkpoint

Updated: 2026-08-25 JST (manual continuation)

## Source of truth / safety
- Repo: `yo666ha-boop/reading-app`.
- Work branch: `v10-vocab-grammar-notes-audit`.
- Public `main`: `1f0cabf9bfcc4482f507e33188499bdbbd5bab57`; NOT modified.
- Sole vocabulary authority: native Sheet `1AkKYV6h-9ZCq1-p8126u4t8z0pvPSRnHlOfY8C-3hH4`, tab `単語マスター`, 3975 canonical records.
- Final audit runtime waits for `V10_RUNTIME_LOAD_PROGRESS=complete`, then applies bounded passage-local annotations before scanning all 168 passages. Passage-local notes never enter cumulative vocabulary; proper-name allowances require explicit `proper names` tagging and capitalization.

## Completed this run
- Re-read branch/main/checkpoint/latest Actions/final runtime loader and resumed from the pending batch3 scan.
- Authoritative run `32829256631` confirmed batch3: `508 unique / 2166 occurrences`, `871 FUTURE + 1295 UNREGISTERED`, notes `110`, `missing_gloss=0`, passages `168/168`, grammar candidates `168/168` / 20 feature families.
- Added bounded `v10_passage_local_notes_batch4.js` and wired it into the final scanner. Exact v7/context checks used: `New Zealand=ニュージーランド`; `boat shoe=デッキシューズ`; `chorus contest=合唱コンクール`; no exact standalone `ant` or `community`; standalone `shoes` is not licensed by the later phrase `boat shoe`.
- Batch4 definitions: NH1 Unit4-1 `New Zealand`; SS1 PROGRAM4-1 `ant`; SS2 PROGRAM6-2 `boat shoe`; NH1 Unit10-1/10-2 `chorus contest`; NH3 Unit4-3 `community`; NH2 Unit4-4 `shoes`.
- Batch4 file commit: `9f3cc99726f0214725ecbee9704a1c0633a6060e`; scanner-wire commit: `e21b72993d8b3d829d015f3d747e3676ce7a33aa`.
- Authoritative run `32834709973` SUCCESS confirmed batch4: `501 unique / 2093 occurrences`, `787 FUTURE + 1306 UNREGISTERED`, notes `117`, `missing_gloss=0`, passages `168/168`, notes UI PASS.
- Added a separate bounded proper-name layer rather than treating names as vocabulary or notes: `v10_passage_local_proper_names_batch1.js` with NH1 Unit6-2 `Riko`, NH3 Unit0 `Yuki`, SS3 PROGRAM3-1 `Ken`, NH2 Unit3-4 `Ken`. These are passage-local only and scanner capitalization-gated; possessive `Riko's` is allowed only through the explicitly tagged local base name.
- Proper-name file commit: `f715d253f6ca84564b68c6003b1e4e859384c3d5`; scanner-load commit: `f92e9158951bc3ca626a8977caac4dc79831bd94`.
- Fresh authoritative proper-name run `32834908093` was `in_progress` at checkpoint save; therefore no inferred post-name counts are recorded.
- Inspected `everyday`: unresolved remains 11 occurrences across SS3 PROGRAM6-3 / NH2 Unit5-1 / NH3 Unit5-4. The checked-in SS3 PROGRAM6-3 base and fix files do not contain `everyday`, proving the token is introduced by a later runtime semantic/reference layer; do not rewrite it until that final-runtime source is located. This avoids changing the wrong layer.

## Current exact VERIFIED state
- Vocabulary passages audited: `168/168`.
- Vocabulary chronology: FAIL / IN PROGRESS.
- Last VERIFIED unresolved: `501 unique / 2093 occurrences` = `787 FUTURE_V7_LEAK + 1306 UNREGISTERED_V7`.
- Last VERIFIED notes: `117`.
- `missing_gloss=0` PASS.
- Grammar candidate coverage: `168/168`; 20 feature families; exact evidence-backed subunit chronology still pending, so grammar chronology remains fail-closed/pending.
- Notes UI: PASS at run `32834709973`.
- Slash/browser/print: previous branch evidence PASS exists; newest proper-name scanner content still requires fresh final regression before final release claim.
- Public main release: NOT performed.

## Actions / commits
- Batch4 authoritative audit: run `32834709973` SUCCESS, head `e21b72993d8b3d829d015f3d747e3676ce7a33aa`.
- Passage audit for batch4 file-only head `9f3cc997...`: run `32834649423` SUCCESS.
- Proper-name content commit: `f715d253f6ca84564b68c6003b1e4e859384c3d5`.
- Proper-name scanner commit: `f92e9158951bc3ca626a8977caac4dc79831bd94`.
- Authoritative run `32834908093`: `in_progress` at checkpoint save.

## Exact stop / next start
- Exact stop: bounded proper-name layer is wired into the authoritative final scan; run `32834908093` is executing. No post-proper-name reduction is claimed yet.
- Next start: read branch/main and run `32834908093` first. On SUCCESS read persisted `VOCAB_GRAMMAR_NOTES_AUDIT_STATUS.txt` and `v10_vocab_unresolved_unique.json`; on FAIL inspect exact job/log and repair.
- Then locate the late runtime layer that introduces `everyday` in SS3 PROGRAM6-3, NH2 Unit5-1, NH3 Unit5-4 and distinguish adjective `everyday` from adverbial `every day`; synchronize sentence/fullTranslation/slash/A+B answer/evidence/reason if rewriting is correct.
- Continue with `compares` as morphology/grammar candidate rather than blindly glossing it; inspect exact canonical `compare`/variants and final contexts. Continue remaining high-frequency tokens without small-batch stopping.
- After vocabulary leak reaches 0, populate evidence-backed exact-subunit grammar introduction boundaries for all 20 detected families and require `future_grammar_leak=0`.
- Then rerun slash reference 168/168, A+B evidence, coverage/DOM, Chromium/Firefox/WebKit-iPhone, A4 student/teacher print. Only every-gate PASS permits main update and live Pages verification; only then stop automation.
