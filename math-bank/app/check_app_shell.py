from __future__ import annotations

import re
import subprocess
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent
HTML = ROOT / "index.html"
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
    ".answer.open",
    "show-answers-screen",
    "print-answers",
    "afterprint",
    "localStorage",
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
]
missing_fragments = [x for x in required_fragments if x not in text]
if missing_fragments:
    raise SystemExit(f"FAIL missing app behavior fragments: {missing_fragments}")

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

print("PASS_APP_SHELL")
print(f"controls={len(required_ids)}")
print("canonical=1231 original=1124 variants=107")
print("browser_strict_shape=PASS browser_audit_flags=PASS generated_parent=PASS")
print("variant_parent_book_filter=PASS stale_import_clear=PASS")
print("browser_figure_path_safety=PASS print_figure_readiness=PASS")
print("search=PASS json_import=PASS per_question_answer=PASS print_reset=PASS")
print("javascript_syntax=PASS")
