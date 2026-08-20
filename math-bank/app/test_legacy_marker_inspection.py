from __future__ import annotations

from inspect_canonical_artifact import image_marker_profile

rows = [
    {
        "id": "LEGACY-1",
        "stage": "中1",
        "unit": "図形",
        "title": "図を見て答えなさい [[IMAGE:figures/a.png]]",
        "q": "次の図を見て答えなさい。[[IMAGE:figures/a.png]]",
        "choices": ["A", "B [[IMAGE:figures/b.svg]]"],
        "ans": "A",
        "explanation": "解説 [[IMAGE:missing/c.png]]",
    },
    {
        "id": "LEGACY-2",
        "stage": "中2",
        "unit": "関数",
        "title": "別の図",
        "q": "[[IMAGE:ambiguous.png]] を使う。",
        "choices": None,
        "ans": "1",
        "explanation": "",
    },
]
images = {
    "root/figures/a.png",
    "root/figures/b.svg",
    "x/ambiguous.png",
    "y/ambiguous.png",
}
profile = image_marker_profile(rows, images)

assert profile["marker_occurrences"] == 5, profile
assert profile["records_with_markers"] == 2, profile
assert profile["distinct_marker_refs"] == 4, profile
assert profile["ref_counts"]["figures/a.png"] == 2, profile
assert profile["resolved_marker_refs"]["figures/a.png"] == ["root/figures/a.png"], profile
assert profile["resolved_marker_refs"]["figures/b.svg"] == ["root/figures/b.svg"], profile
assert profile["unresolved_marker_refs"] == ["missing/c.png"], profile
assert profile["ambiguous_marker_refs"]["ambiguous.png"] == ["x/ambiguous.png", "y/ambiguous.png"], profile

print("PASS_LEGACY_IMAGE_MARKER_INSPECTION")
print("marker_occurrences=5")
print("distinct_marker_refs=4")
print("resolved_exact_or_suffix=PASS")
print("unresolved_marker=DETECTED")
print("ambiguous_marker=DETECTED")
print("canonical_strings_rewritten=NO")
