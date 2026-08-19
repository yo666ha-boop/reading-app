from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / "out" / "archive_manifest.json"
OUTPUT = ROOT / "out" / "file_classification.json"
CHECKPOINT = ROOT / "state" / "checkpoint.json"

ANSWER_WORDS = ("解答", "答え", "正答", "解説", "answer", "ans", "solution")
QUESTION_WORDS = ("問題", "本冊", "テキスト", "演習", "work", "question", "q_")
GRADE_PATTERNS = {
    "1": (r"中\s*1", r"中一", r"1年", r"１年", r"grade\s*1", r"g1"),
    "2": (r"中\s*2", r"中二", r"2年", r"２年", r"grade\s*2", r"g2"),
    "3": (r"中\s*3", r"中三", r"3年", r"３年", r"grade\s*3", r"g3"),
}


def norm(s: str) -> str:
    return s.replace("\\", "/").lower()


def detect_role(path: str) -> str:
    p = norm(path)
    if any(w.lower() in p for w in ANSWER_WORDS):
        return "ANSWER_OR_SOLUTION"
    if any(w.lower() in p for w in QUESTION_WORDS):
        return "QUESTION_OR_TEXT"
    return "UNKNOWN"


def detect_grade(path: str) -> str | None:
    p = norm(path)
    found = []
    for grade, patterns in GRADE_PATTERNS.items():
        if any(re.search(pattern, p, re.IGNORECASE) for pattern in patterns):
            found.append(grade)
    return found[0] if len(found) == 1 else None


def extension(path: str) -> str:
    return Path(path).suffix.lower() or "[none]"


def main() -> int:
    if not MANIFEST.exists():
        raise SystemExit("archive_manifest.json not found; run inventory.py first")

    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
    rows = []
    summary = {
        "total": 0,
        "question_or_text": 0,
        "answer_or_solution": 0,
        "unknown_role": 0,
        "grade_1": 0,
        "grade_2": 0,
        "grade_3": 0,
        "grade_unknown": 0,
        "extensions": {},
    }

    for arc in manifest.get("archives", []):
        if arc.get("status") != "OK":
            continue
        for f in arc.get("files", []):
            path = f["path"]
            role = detect_role(path)
            grade = detect_grade(path)
            ext = extension(path)
            review = []
            if role == "UNKNOWN":
                review.append("ROLE_UNKNOWN")
            if grade is None:
                review.append("GRADE_UNKNOWN")

            row = {
                "archive": arc["name"],
                "path": path,
                "extension": ext,
                "role": role,
                "grade_candidate": grade,
                "needs_review": review,
                "size": f.get("size"),
                "crc": f.get("crc"),
            }
            rows.append(row)

            summary["total"] += 1
            summary["extensions"][ext] = summary["extensions"].get(ext, 0) + 1
            if role == "QUESTION_OR_TEXT":
                summary["question_or_text"] += 1
            elif role == "ANSWER_OR_SOLUTION":
                summary["answer_or_solution"] += 1
            else:
                summary["unknown_role"] += 1
            if grade in {"1", "2", "3"}:
                summary[f"grade_{grade}"] += 1
            else:
                summary["grade_unknown"] += 1

    OUTPUT.write_text(json.dumps({"summary": summary, "files": rows}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    cp = json.loads(CHECKPOINT.read_text(encoding="utf-8")) if CHECKPOINT.exists() else {}
    cp.setdefault("counts", {})["files_discovered"] = summary["total"]
    cp["current_stage"] = "FILE_CLASSIFICATION"
    cp["last_completed_batch"] = "classify-files"
    cp["next_batch"] = "inspect-file-formats-and-pair-question-answer"
    cp["status"] = "RUNNING"
    cp["blocking_issue"] = None
    cp["classification_summary"] = summary
    CHECKPOINT.write_text(json.dumps(cp, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(summary, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
