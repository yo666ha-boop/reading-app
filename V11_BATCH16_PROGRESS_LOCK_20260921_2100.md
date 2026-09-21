# V11 Batch16 progress lock

Source branch: v11-1000passage-easy-notes
Observed HEAD before write: eff0597bc95706c79898785bc591fafb2b8a68eb
Formal registered total: 918/1000
Current atomic candidate: Batch16, 50 passages, UNREGISTERED

## DONE / LOCKED — do not rerun unless canonical Batch16 source changes
- A/B question payload: 50 passages / 500 questions / A5+B5 / required answer,evidence,evidenceJp,reason / finalPass=true / locked=true. Evidence: V11_BATCH16_500_QUESTION_FINAL_GATE_20260921.json.
- Formal v7 vocabulary chronology: PASS, futureVocab=0, unregistered=0.
- Formal grammar chronology: PASS, unresolved=0, futureGrammar=0.
- Slash/word-count authoring report: PASS 50/50.
- Browser gate: Chromium/WebKit/iPhone-WebKit PASS from current Batch16 diagnostics.
- Cross-batch duplicate/near-duplicate: PASS exact=0 near=0 against prior 918.
- A4 student/teacher and persistent runtime: PASS from current Batch16 evidence.

## ONLY remaining Batch16 work
1. Human semantic final review of all 50 current canonical passages and synchronized fullTranslation/slash/question evidence fields where any body edit is required.
2. Normal/easy notes coverage final validation across all 50, including required-local Japanese gloss validity (no blank gloss; no English-as-Japanese gloss).
3. If and only if 1-2 PASS without changing a LOCKED source, atomically register all 50: 918 -> 968. No partial registration.
4. In the same run, begin final 32 passages toward 1000.

## Anti-loop rule
Do not spend a run rechecking LOCKED gates. A run counts as forward progress only when it closes one of the two remaining gates, repairs a concrete failure found in them, performs the 918->968 atomic registration, or authors the final 32 after registration.
