# V10 final vocabulary/slash audit ledger 091-168

Scope: passages 091-168 (78 passages), consolidated so the final pass is not artificially stopped every ten passages.

Coverage:
- 091-093: Sunshine G2 PROGRAM 8-1 through PROGRAM 8-3.
- 094-122: New Horizon G2 Unit 0 through Unit 7-4.
- 123-143: Sunshine G3 PROGRAM 1-1 through PROGRAM 7-3.
- 144-168: New Horizon G3 Unit 0 through Unit 6-4.

Final slash policy applied:
- Preserve forward-reading meaning units.
- Do not split be + complement.
- Do not split auxiliary/modal + lexical verb.
- Do not split a simple predicate from a short object/complement when the combined unit remains readable.
- Preserve useful boundaries before subordinate/content clauses, participial modifiers, and longer time/place/prepositional adjuncts.
- Keep English and Japanese slash-part counts synchronized; leave a row unchanged rather than create a mismatched bilingual row.

Runtime safeguards:
- Every target section must exist.
- sentences.length must equal slashRows.length for every target passage.
- Exact audited target count must equal 78 or the layer throws.
- Final correction layer remains after this audit layer.

Vocabulary decision:
- Existing semantic rebuilds are retained; this final pass adds no new prose rewrite in 091-168.
- Existing reviewed vocabulary-gate state is preserved where present; otherwise the passage receives PASS_REVIEWED_GATE_RECHECK_NOTES_0.
- No student-facing vocabulary note is added in this range.

Status after connection: vocabulary/slash final audit coverage 168/168. Regression/browser/print/public verification remains a separate required phase and is not claimed by this ledger.
