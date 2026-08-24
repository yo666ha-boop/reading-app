# Long-reading app vocabulary / grammar audit checkpoint

Updated: 2026-08-25 01:40 JST

- Repository: `yo666ha-boop/reading-app`.
- Work branch: `v10-vocab-grammar-notes-audit` only. Public `main` was not modified in this manual run.
- Public main HEAD observed: `1f0cabf9bfcc4482f507e33188499bdbbd5bab57`.
- Previous audit trigger `7d2f951f2179976f7656373da1f5a3d6c82e8d00` had no combined CI statuses and did not produce a fresh persisted vocabulary/grammar report.
- Manual run action this time: changed watched scanner file `v10_vocab_notes_candidate_audit.js` and committed trigger `c310a6c12ae9f1c91d4a130f06de1e835947f11e` with message `Manual rerun corrected cumulative vocabulary audit`.
- The scanner's intended vocabulary chronology rule remains: within each textbook and grade, current-section reviewed `allowedWords` plus only prior sections are cumulative; future sections are never added.
- Persisted report/log at the moment of this checkpoint are still stale: `v10_vocab_notes_candidate_report.json` generated `2026-08-24T11:56:14.705Z` and old log shows 5,407 V7 lookups. Those figures are superseded and MUST NOT be used as current violation counts.
- Confirmed evidence remains valid: Sunshine G1 Get Ready 4 `play` is allowed by canonical v7 row 2146 and was a metadata omission; Sunshine G1 PROGRAM 2-2 `town` is allowed from prior reviewed PROGRAM 2-1 vocabulary. Neither requires an unknown-word note.
- Notes UI and its test remain installed. Fresh grammar chronology candidate output has not yet been persisted, so grammar violations/future grammar leak are not finalized.
- No passage text was edited in this manual run, so the already-completed 168/168 slash reference content was not changed.
- Local container clone was retried and still failed because DNS could not resolve `github.com`; do not substitute the stale report because of that environment failure.
- Exact stop: after manual trigger `c310a6c...`, the audit branch still had no fresh bot-persisted corrected report. A status checkpoint commit followed; inspect the current branch HEAD and report `generatedAt` before doing any candidate resolution.
- Next start point: if a fresh corrected vocab report and grammar candidate report have appeared, resolve only the remaining unique candidates against canonical v7 at the exact textbook/grade/section cutoff, repair genuine metadata omissions or future vocabulary, then derive evidence-backed grammar chronology and run slash/A+B/DOM/browser/print regression. If no fresh reports have appeared, diagnose GitHub Actions execution/permissions directly and do not reuse 5,407.
