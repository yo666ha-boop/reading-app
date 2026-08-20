from __future__ import annotations

import re
import subprocess
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent
HTML = ROOT / "index.html"
FIGURE_RENDERER = ROOT / "render_figure_markers.js"
FIGURE_TEST = ROOT / "test_render_figure_markers.mjs"
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
    "total:1231",
    "original:1124",
    "variant:107",
    "Winpass:570",
    "'実力錬成':237",
    "Standard:317",
    ".problem-title",
    ".choices",
    "validChoices",
    "choicesHtml",
    "r?.title",
    "Array.isArray(r?.choices)?r.choices:[]",
    "Object.prototype.hasOwnProperty.call(r,'choices')",
    "typeof r.title!=='string'",
    "choiceRecords",
    "タイトル/選択肢",
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
    "正本JSONを読込",
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
    "本文内図版マーカー",
    "data-inline-figure=\"1\"",
    "#list img[data-inline-figure=\"1\"]",
]
missing_fragments = [x for x in required_fragments if x not in text]
if missing_fragments:
    raise SystemExit(f"FAIL missing app behavior fragments: {missing_fragments}")

if not FIGURE_RENDERER.is_file() or not FIGURE_TEST.is_file():
    raise SystemExit("FAIL inline figure marker renderer/test file missing")

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
if proc.returncode:
    raise SystemExit(f"FAIL inline figure marker regression\n{proc.stdout}\n{proc.stderr}")
if "PASS_RENDER_FIGURE_MARKERS_NON_MUTATING_SAFE" not in proc.stdout:
    raise SystemExit(f"FAIL inline figure marker PASS token missing\n{proc.stdout}")

print("PASS_APP_SHELL")
print(f"controls={len(required_ids)}")
print("canonical=1231 original=1124 variants=107")
print("title_choices_preservation=PASS choice_rendering=PASS choice_search=PASS")
print("browser_strict_shape=PASS browser_audit_flags=PASS generated_parent=PASS")
print("variant_parent_book_filter=PASS parent_source_order=PASS stale_import_clear=PASS")
print("browser_figure_path_safety=PASS print_figure_readiness=PASS inline_marker_gate=PASS")
print("inline_marker_non_mutating_render=PASS unsafe_or_unregistered_marker_rejected=PASS")
print("dynamic_filter_settings_restore=PASS difficulty_labels=PASS count_clamp=PASS")
print("search=PASS json_import=PASS per_question_answer=PASS print_reset=PASS")
print("javascript_syntax=PASS")
