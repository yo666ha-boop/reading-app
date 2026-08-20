from __future__ import annotations

from pathlib import Path

PATH = Path(__file__).with_name("browser_regression.mjs")


def once(s: str, old: str, new: str) -> str:
    n = s.count(old)
    if n != 1:
        raise RuntimeError(f"expected exactly one match, got {n}: {old[:120]!r}")
    return s.replace(old, new, 1)


def main() -> None:
    s = PATH.read_text(encoding="utf-8")
    if "TEST-XVAR-" in s and "rows.length !== 1234" in s and "追加3問" in s:
        if "候補 1231問" in s or "既存類題 107問" in s or "正本データ未接続" in s:
            raise RuntimeError("mixed frozen and expanded browser fixture state")
        print("PASS_BROWSER_REGRESSION_EXPANDED_VARIANT_FIXTURE_ALREADY_ENABLED")
        return

    s = once(
        s,
        "originals.push({ rid, grade });",
        "originals.push({ rid, grade, hasChoices, minor: grade === 1 ? '正負の数' : (grade === 2 ? '式の計算' : '多項式') });",
    )

    old_variant = """    for (let n = 1; n <= 107; n++) {
      i++;
      const parent = originals[n - 1];
      const hasChoices = i % 10 === 0;
      rows.push({
        id: `TEST-VAR-${String(n).padStart(3, '0')}`,
        grade: parent.grade,
        unit: { major: '数と式', minor: '正負の数', tags: ['TEST_ONLY_BROWSER_FIXTURE'] },
        title: `テスト専用類題 ${n}`,
        skill: '計算',
        question_format: hasChoices ? '選択' : '記述',
        difficulty: 'standard',
        source: {
          book: 'generated',
          document: 'TEST_ONLY_NOT_CANONICAL_VARIANT',
          original_no: null,
          is_generated_variant: true,
          parent_id: parent.rid,
        },
        question: `ブラウザ回帰専用類題 ${n}`,
        choices: hasChoices ? ['選択肢A', '選択肢B', '選択肢C'] : null,
        answer: hasChoices ? '選択肢B' : String(n),
        explanation: `ブラウザ回帰専用類題解説 ${n}`,
        figure_refs: [],
        variant_group: parent.rid,
        prerequisites: [],
        audit: {
          problem_answer_verified: true,
          structure_verified: true,
          figure_refs_verified: true,
        },
      });
    }
    if (rows.length !== 1231) throw new Error(`fixture count ${rows.length}`);"""

    new_variant = """    for (let n = 1; n <= 107; n++) {
      i++;
      const parent = originals[n - 1];
      const hasChoices = parent.hasChoices;
      rows.push({
        id: `TEST-VAR-${String(n).padStart(3, '0')}`,
        grade: parent.grade,
        unit: { major: '数と式', minor: parent.minor, tags: ['TEST_ONLY_BROWSER_FIXTURE'] },
        title: `テスト専用類題 ${n}`,
        skill: '計算',
        question_format: hasChoices ? '選択' : '記述',
        difficulty: 'standard',
        source: {
          book: 'generated',
          document: 'TEST_ONLY_NOT_CANONICAL_VARIANT',
          original_no: null,
          is_generated_variant: true,
          parent_id: parent.rid,
        },
        question: `ブラウザ回帰専用類題 ${n}`,
        choices: hasChoices ? ['選択肢A', '選択肢B', '選択肢C'] : null,
        answer: hasChoices ? '選択肢B' : String(n),
        explanation: `ブラウザ回帰専用類題解説 ${n}`,
        figure_refs: [],
        variant_group: parent.rid,
        prerequisites: [],
        audit: {
          problem_answer_verified: true,
          structure_verified: true,
          figure_refs_verified: true,
        },
      });
    }
    for (let n = 1; n <= 3; n++) {
      i++;
      const parent = originals[198 + n];
      const hasChoices = parent.hasChoices;
      rows.push({
        id: `TEST-XVAR-${String(n).padStart(3, '0')}`,
        grade: parent.grade,
        unit: { major: '数と式', minor: parent.minor, tags: ['TEST_ONLY_BROWSER_FIXTURE', 'EXPANDED_VARIANT'] },
        title: `テスト専用追加類題 ${n}`,
        skill: '計算',
        question_format: hasChoices ? '選択' : '記述',
        difficulty: 'standard',
        source: {
          book: 'generated',
          document: 'TEST_ONLY_EXPANDED_VARIANT',
          original_no: null,
          is_generated_variant: true,
          parent_id: parent.rid,
        },
        question: `ブラウザ回帰専用追加類題 ${n}`,
        choices: hasChoices ? ['選択肢A', '選択肢B', '選択肢C'] : null,
        answer: hasChoices ? '選択肢B' : String(2000 + n),
        explanation: `ブラウザ回帰専用追加類題解説 ${n}`,
        figure_refs: [],
        variant_group: parent.rid,
        prerequisites: [],
        audit: {
          problem_answer_verified: true,
          structure_verified: true,
          figure_refs_verified: true,
        },
      });
    }
    if (rows.length !== 1234) throw new Error(`fixture count ${rows.length}`);"""
    s = once(s, old_variant, new_variant)

    s = s.replace("includes('正本データ未接続')", "includes('基準データ未接続')")
    if "正本データ未接続" in s:
        raise RuntimeError("stale disconnected status remains")

    old_gate = """    if (!gate?.includes('PASS') || !gate.includes('タイトル/選択肢') || !gate.includes('本文内図版マーカー')) fail(`${name}: canonical gate did not pass with title/choices/markers`);
    const summary = await page.textContent('#summary');
    if (!summary?.includes('候補 1231問') || !summary.includes('原問題 1124問') || !summary.includes('既存類題 107問')) {
      fail(`${name}: canonical summary mismatch: ${summary}`);
    }"""
    new_gate = """    if (!gate?.includes('拡張ゲート PASS') || !gate.includes('追加3問')) fail(`${name}: expanded gate did not pass with dynamic verified variants: ${gate}`);
    const summary = await page.textContent('#summary');
    if (!summary?.includes('候補 1234問') || !summary.includes('原問題 1124問') || !summary.includes('類題 110問')) {
      fail(`${name}: expanded summary mismatch: ${summary}`);
    }"""
    s = once(s, old_gate, new_gate)

    PATH.write_text(s, encoding="utf-8")
    print("PASS_BROWSER_REGRESSION_EXPANDED_VARIANT_FIXTURE_UPGRADE")


if __name__ == "__main__":
    main()
