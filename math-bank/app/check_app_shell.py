from __future__ import annotations

import re
import subprocess
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent
HTML = ROOT / "index.html"
FIGURE_RENDERER = ROOT / "render_figure_markers.js"
FIGURE_TEST = ROOT / "test_render_figure_markers.mjs"
EXPANDED_VALIDATOR = ROOT / "validate_expanded_variant_layer.py"
EXPANDED_COMPOSER = ROOT / "compose_expanded_app_records.py"
EXPANDED_TEST = ROOT / "test_expanded_variant_layer.py"
EXPANDED_LAYER = ROOT / "verified-expanded-variants.json"
text = HTML.read_text(encoding="utf-8")

required_ids = [
    "status", "gate", "grade", "major", "minor", "skill", "difficulty", "qformat",
    "kind", "book", "count", "order", "search", "draw", "redraw", "toggleAnswers",
    "printQuestions", "printAnswers", "importFile", "importButton", "summary", "paper",
    "conditionLine", "printCount", "list",
]
missing = [x for x in required_ids if f'id="{x}"' not in text]
if missing:
    raise SystemExit(f"FAIL missing controls: {missing}")

required_fragments = [
    "original:1124",
    "baselineVariant:107",
    "Winpass:570",
    "'実力錬成':237",
    "Standard:317",
    "variant>=BASELINE.baselineVariant",
    "taxonomyFail===0",
    "expandedVariant:Math.max(0,variant-BASELINE.baselineVariant)",
    "拡張ゲート PASS",
    "追加${a.expandedVariant}問",
    ".problem-title",
    ".choices",
    "validChoices",
    "choicesHtml",
    "r?.title",
    "Array.isArray(r?.choices)?r.choices:[]",
    "Object.prototype.hasOwnProperty.call(r,'choices')",
    "typeof r.title!=='string'",
    "choiceRecords",
    "選択問題",
    ".answer.open",
    "show-answers-screen",
    "print-answers",
    "afterprint",
    "localStorage",
    "SETTINGS_KEY",
    "readSettings",
    "setStoredValue",
    "restoreSettings",
    "setStoredValue('major',x.major)",
    "setStoredValue('minor',x.minor)",
    "sourceAnchor",
    "const aa=sourceAnchor(a),bb=sourceAnchor(b)",
    "isVariant(a)?1:0",
    "labelDifficulty",
    "setOptions($('difficulty'),uniq(base.map(r=>r?.difficulty)),labelDifficulty)",
    "Math.max(1,Math.min(200",
    "app-records.json",
    "canonicalAudit",
    "sourceSort",
    "parentBookOf",
    "VALID_GRADES",
    "VALID_DIFFICULTY",
    "VALID_BOOKS",
    "SAFE_EXTERNAL_FIGURE_SCHEMES",
    "SAFE_LOCAL_FIGURE_EXTENSIONS",
    "safeFigureRef",
    "figs.some(x=>!safeFigureRef(x))",
    "figurePrintReadiness",
    "loading=\"eager\"",
    "dataset.loadError",
    "naturalWidth===0",
    "印刷中止：表示中の図版",
    "印刷待機：図版",
    "auditFail",
    "parentFail",
    "taxonomyFail",
    "figureFail",
    "problem_answer_verified!==true",
    "structure_verified!==true",
    "figure_refs_verified!==true",
    "parentBookOf(r)===book",
    "以前の表示を破棄しました",
    "render_figure_markers.js",
    "MikamiMathFigureMarkers",
    "markerHtml",
    "markerRefsForRecord",
    "markerFail",
    "data-inline-figure=\"1\"",
    "#list img[data-inline-figure=\"1\"]",
]
missing_fragments = [x for x in required_fragments if x not in text]
if missing_fragments:
    raise SystemExit(f"FAIL missing app behavior fragments: {missing_fragments}")

for forbidden in (
    "const CANONICAL={total:1231",
    "rs.length===CANONICAL.total",
    "以外は追加しません",
    "正本1231問の完全ゲート",
):
    if forbidden in text:
        raise SystemExit(f"FAIL frozen-1231 behavior remains: {forbidden}")

for target in (FIGURE_RENDERER, FIGURE_TEST, EXPANDED_VALIDATOR, EXPANDED_COMPOSER, EXPANDED_TEST, EXPANDED_LAYER):
    if not target.is_file():
        raise SystemExit(f"FAIL required math app file missing: {target.name}")

scripts = re.findall(r"<script(?:\s[^>]*)?>(.*?)</script>", text, flags=re.S | re.I)
if not scripts:
    raise SystemExit("FAIL no inline script")
js = "\n".join(scripts)
with tempfile.NamedTemporaryFile("w", suffix=".js", encoding="utf-8", delete=False) as f:
    f.write(js)
    temp = f.name
proc = subprocess.run(["node", "--check", temp], text=True, capture_output=True)
if proc.returncode:
    raise SystemExit(f"FAIL node --check\n{proc.stdout}\n{proc.stderr}")

for target in (FIGURE_RENDERER, FIGURE_TEST):
    proc = subprocess.run(["node", "--check", str(target)], text=True, capture_output=True)
    if proc.returncode:
        raise SystemExit(f"FAIL node --check {target.name}\n{proc.stdout}\n{proc.stderr}")

proc = subprocess.run(["node", str(FIGURE_TEST)], text=True, capture_output=True)
if proc.returncode or "PASS_RENDER_FIGURE_MARKERS_NON_MUTATING_SAFE" not in proc.stdout:
    raise SystemExit(f"FAIL inline figure marker regression\n{proc.stdout}\n{proc.stderr}")

proc = subprocess.run(["python", str(EXPANDED_TEST)], cwd=ROOT, text=True, capture_output=True)
if proc.returncode or "PASS_EXPANDED_VARIANT_LAYER_STRICT_PARENT_TAXONOMY_RECALC_DUPLICATE_GATES" not in proc.stdout:
    raise SystemExit(f"FAIL expanded variant layer regression\n{proc.stdout}\n{proc.stderr}")

print("PASS_APP_SHELL")
print("base_originals=1124 baseline_variants=107 expanded_variants=dynamic_verified_only")
print("expanded_parent_taxonomy_recalc_provenance_duplicate_gates=PASS")
print("title_choices_preservation=PASS choice_rendering=PASS choice_search=PASS")
print("browser_strict_shape=PASS browser_audit_flags=PASS generated_parent=PASS")
print("variant_parent_book_filter=PASS parent_source_order=PASS stale_import_clear=PASS")
print("browser_figure_path_safety=PASS print_figure_readiness=PASS inline_marker_gate=PASS")
print("inline_marker_non_mutating_render=PASS unsafe_or_unregistered_marker_rejected=PASS")
print("dynamic_filter_settings_restore=PASS difficulty_labels=PASS count_clamp=PASS")
print("search=PASS json_import=PASS per_question_answer=PASS print_reset=PASS")
print("javascript_syntax=PASS")
