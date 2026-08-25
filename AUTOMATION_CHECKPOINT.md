# Long-reading app vocabulary / grammar / notes checkpoint

Updated: 2026-08-26 JST (automation continuation, vocabulary chronology PASS + grammar chronology exact-evidence expansion)

## Source of truth / safety
- Repo: `yo666ha-boop/reading-app`.
- Work branch: `v10-vocab-grammar-notes-audit`.
- Public `main`: `1f0cabf9bfcc4482f507e33188499bdbbd5bab57`; NOT modified.
- Sole vocabulary authority: native Sheet `1AkKYV6h-9ZCq1-p8126u4t8z0pvPSRnHlOfY8C-3hH4`, tab `単語マスター`, 3975 canonical records. No v5/v6 authority used.
- Vocabulary chronology is already authoritative PASS and remains frozen except for regression checks.
- Grammar final gate is fail-closed. Candidate detection alone is never PASS evidence; every occurrence must resolve to an exact evidence-backed same-textbook boundary at or before the passage, with exact earlier-grade introductions carried forward only within the same textbook.

## Completed this run
- Re-read work branch HEAD, main HEAD, prior checkpoint, latest Actions, grammar detector/gate/evidence files, and final-runtime correction/reference layers before editing. Public main remained unchanged.
- Kept vocabulary authoritative state unchanged: passages `168/168`, unique unresolved `0`, future vocab leak `0`, unregistered `0`, missing_gloss `0`, notes `663`, notes UI PASS; last vocabulary-content slash-quality run `32868771993` SUCCESS.
- Fixed the grammar chronology model so exact earlier-grade introductions carry forward automatically to later grades in the same textbook. Program/unit-only evidence still fails closed. Commit `aa1990e06415a866afb2ae09f703eedf0583ad56`; trigger `a2e03f279b1859719e58efb2e4ed924d06897d04`. Authoritative result improved from `98 resolved / 1226 unresolved / 20 future` to `199 resolved / 1125 unresolved / 20 future` over 1344 detected occurrences.
- Expanded evidence from official 2025 Tokyo Shoseki NEW HORIZON 2 materials down to Part boundaries: U1 going-to/will; U2 when/if/because; U3 infinitive subtypes and It is ... to; U4 have-to/must/gerund; U5 wh-to; U6 comparison; U7 passive. Evidence/trigger commits include `6c1fc9df519de1aff5f755885166f1c4fdd10655` and `3d3b01424c3bf5ad0501f12ad6d91d596f214a8e`.
- Expanded official 2025 NEW HORIZON 3 exact Part evidence: present perfect, make O adjective, present perfect progressive, want O to, let/help O V, indirect question, participle postmodifier, relative pronoun. Evidence/trigger commits `df9eccd72e5248689afc1c9d8384b86dc94b2911`, `9ac62f63c41fde551d8523dad9f023900ab1e12f`. Authoritative exact-evidence run `32875507883` SUCCESS; pre-v3 state became `1344 detected / 288 resolved / 1014 unresolved / 42 future`. The rise in future candidates reflects previously unresolved structures becoming provably early, not a regression.
- Rebuilt the grammar structure detector to v3 so chronology cannot be accidentally shared across unrelated structures. Split combined MODAL into `MODAL_CAN`, `MODAL_COULD`, `MODAL_MAY_MIGHT`, `MODAL_MUST`, `MODAL_SHOULD`; split broad infinitive into `WANT_TO`, `VERB_TO_INFINITIVE`, `ADJECTIVE_TO_INFINITIVE`, while keeping `WH_TO_INFINITIVE`, `ASK_TELL_WANT_O_TO`, `WOULD_LIKE` separate. Detector commit `c5248d1db36f9a30a2361ba623174c180e3da901`.
- Added split-family exact evidence for NH1/NH2/NH3 and bounded Sunshine evidence from official 2025 publisher plans. Evidence commits `62b61e3d323e959989f53b11268b6013628c838e` and later `47f1d9f57e3bfecbc08a18651032980c52a1f889`.
- Verified official 2025 grade-1 chronology as well: NH1 can begins Unit 2 P2 (app Unit 2-2), present progressive Unit 7 P1, want/try-to infinitive Unit 8 P1, past progressive Unit 10 P2; Sunshine1 Get Ready 1-4 explicitly reviews elementary can/want-to, PROGRAM 8 is present progressive, PROGRAM 10 past forms/progressive. This exposes true early NH1 grammar rather than licensing it globally.
- Detector-v3 authoritative persisted state after split-family evidence reached `1355 detected / 795 resolved / 527 unresolved / 33 future`; then grade-1 exact boundaries exposed additional real early structures and the latest verified state became `1355 detected / 962 resolved / 320 unresolved / 73 future`. This is a net reduction of unresolved evidence gaps from 1226 at the start of grammar work to 320 now; the larger future count is more precise classification, not permission widening.
- Confirmed real rewrite-required grade-1 cases include NH1 Unit 1-1 `I want to join the tennis club.` before official Unit 8 infinitive and NH1 `can` occurrences before Unit 2-2. Also confirmed early present-progressive cohorts in NH1 before Unit 7 and Sunshine1 before PROGRAM 8 must be rewritten or otherwise synchronized; they must not be hidden by relaxing boundaries.
- Inspected final semantic/reference infrastructure before sentence mutations: `v10_semantic_runtime_final_fixes.js` and `v10_reference_chronology_sync.js` demonstrate the late-runtime correction + reference bridge pattern. Any grammar rewrite must synchronize sentence, fullTranslation, slashRows EN/JP, A/B prompt/answer/evidence/evidenceJp/reason and reference slash.
- Updated the detector to persist the full exact `future` and `unresolved` gate rows inside `v10_grammar_chronology_candidate_report.json`, so the next run can work directly from the authoritative future list instead of inferring from counts. Commit `e6faf95bf0e298c4c15af74095d135cbd3eb458d`; run `32876553301` was still in progress at checkpoint time, so its detailed persisted list is the immediate next retrieval target. The latest verified counts remain `962 / 320 / 73` until that run completes.

## Current exact state
- Vocabulary passages audited: `168/168`.
- Vocabulary violations: `0 unique / 0 occurrences`.
- FUTURE_V7_LEAK: `0`.
- UNREGISTERED_V7 / UNREGISTERED_PROPER: `0`.
- Notes present: `663`.
- missing_gloss: `0`.
- Vocabulary chronology: `PASS 168/168`.
- Notes UI gate: `PASS`.
- Slash/reference: vocabulary-content slash-quality `PASS` at run `32868771993`; no passage sentence/slash mutation was made in this grammar-evidence run, so no new intended slash change exists yet. Full final release rerun is still required after grammar completion.
- Grammar candidate coverage: `168/168`.
- Grammar detector: v3, split modal/infinitive families.
- Grammar detected occurrences: `1355`.
- Grammar chronology resolved: `962` occurrences (latest verified).
- Grammar chronology unresolved: `320` occurrences (latest verified).
- Current confirmed/provable future grammar candidate occurrences: `73` (latest verified).
- Grammar chronology: `FAIL-CLOSED / IN PROGRESS`.
- Public main release: NOT performed.

## Exact stop / next start
- Exact stop: detector v3 + prior-grade carry-forward + NH1/NH2/NH3 exact evidence + bounded Sunshine evidence are implemented. Latest verified authoritative counts are `1355 detected / 962 resolved / 320 unresolved / 73 future`. Detailed future/unresolved persistence commit `e6faf95bf0e298c4c15af74095d135cbd3eb458d` is running as Actions run `32876553301` at checkpoint time.
- Next start: first recover run `32876553301` and the newly embedded `chronologyGate.future` / `chronologyGate.unresolved` arrays from `v10_grammar_chronology_candidate_report.json`. Then process the full future list, prioritizing confirmed early NH1 `WANT_TO` and `MODAL_CAN`, early NH1/SS1 `PRESENT_PROGRESSIVE`, then the previously confirmed NH2/NH3 early structures. Do not widen chronology to make them disappear.
- For each confirmed future structure, rewrite with a learned structure while preserving meaning as much as possible and synchronize `sentences`, `fullTranslation`, `slashRows.en/jp`, A/B `prompt`, `answer`, `evidence`, `evidenceJp`, `reason`, and reference slash/runtime bridge in the same change.
- In parallel, finish exact Sunshine2/3 subunit evidence and any remaining NH feature boundaries so `unresolvedOccurrences=0`. Treat fixed expressions such as `Nice to meet you` separately from productive `ADJECTIVE_TO_INFINITIVE` where detector refinement is needed.
- After grammar chronology reaches `PASS 168/168` with `futureGrammarLeak=0`, rerun slash reference 168/168, A/B evidence consistency, coverage/DOM, Chromium/Firefox/WebKit-iPhone, A4 student/teacher print. Only every-gate PASS permits main update and live Pages verification; only live Pages PASS permits completion and automation stop.

## Key commits/runs this continuation
- Prior-grade carry-forward: `aa1990e06415a866afb2ae09f703eedf0583ad56`.
- NH2 exact evidence trigger: `3d3b01424c3bf5ad0501f12ad6d91d596f214a8e`.
- NH3 exact evidence: `df9eccd72e5248689afc1c9d8384b86dc94b2911`; authoritative run `32875507883` SUCCESS.
- Detector v3 split families: `c5248d1db36f9a30a2361ba623174c180e3da901`.
- Split/grade1 evidence: `62b61e3d323e959989f53b11268b6013628c838e`, `47f1d9f57e3bfecbc08a18651032980c52a1f889`.
- Latest verified report: `1355 / 962 / 320 / 73`.
- Persist exact future/unresolved arrays: `e6faf95bf0e298c4c15af74095d135cbd3eb458d`; run `32876553301` in progress at stop.
- Public main remains `1f0cabf9bfcc4482f507e33188499bdbbd5bab57`.
