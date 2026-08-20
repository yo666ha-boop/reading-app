from __future__ import annotations

from pathlib import Path

PATH = Path(__file__).with_name("index.html")


def replace_once(text: str, old: str, new: str) -> str:
    count = text.count(old)
    if count != 1:
        raise RuntimeError(f"expected exactly one match, got {count}: {old[:120]!r}")
    return text.replace(old, new, 1)


def main() -> None:
    s = PATH.read_text(encoding="utf-8")
    s = replace_once(
        s,
        "正本1231問専用。原問題1124問＋検算済み類題107問以外は追加しません。問題文・選択肢・正答・解説を保持します。",
        "検証済み原問題1124問を固定土台に、既存類題107問＋元問題から独立検算した追加類題を使う拡張問題バンクです。原問題の本文・選択肢・正答・解説は変更しません。",
    )
    s = replace_once(s, "<option value=\"variant\">既存類題のみ</option>", "<option value=\"variant\">類題のみ</option>")
    s = replace_once(
        s,
        "公開時は app-records.json を自動読込。再確認中は正本JSONを手動読込して同じ完全ゲートで検証できます。",
        "公開時は検証済み app-records.json を自動読込。再確認中は正本＋検算済み追加類題JSONを手動読込して同じ完全ゲートで検証できます。",
    )
    s = replace_once(
        s,
        "const CANONICAL={total:1231,original:1124,variant:107,source:{Winpass:570,'実力錬成':237,Standard:317}};",
        "const BASELINE={original:1124,baselineVariant:107,source:{Winpass:570,'実力錬成':237,Standard:317}};",
    )
    s = replace_once(s, "`既存類題 ${f.filter(isVariant).length}問`", "`類題 ${f.filter(isVariant).length}問`")
    s = replace_once(
        s,
        "let duplicate=0,blankQ=0,blankA=0,original=0,variant=0,invalid=0,auditFail=0,parentFail=0,figureFail=0,markerFail=0,choiceRecords=0;",
        "let duplicate=0,blankQ=0,blankA=0,original=0,variant=0,invalid=0,auditFail=0,parentFail=0,taxonomyFail=0,figureFail=0,markerFail=0,choiceRecords=0;",
    )
    s = replace_once(
        s,
        "for(const r of rs){if(!isObj(r)||!isVariant(r))continue;const p=byId.get(txt(r.source?.parent_id));if(!p||isVariant(p))parentFail++}",
        "for(const r of rs){if(!isObj(r)||!isVariant(r))continue;const p=byId.get(txt(r.source?.parent_id));if(!p||isVariant(p)){parentFail++;continue}const sameTaxonomy=r.grade===p.grade&&majorOf(r)===majorOf(p)&&minorOf(r)===minorOf(p)&&r.skill===p.skill&&r.question_format===p.question_format&&r.difficulty===p.difficulty;const sameChoices=(r.choices===null&&p.choices===null)||(Array.isArray(r.choices)&&Array.isArray(p.choices)&&r.choices.length===p.choices.length);if(!sameTaxonomy||!sameChoices)taxonomyFail++}",
    )
    s = replace_once(
        s,
        "const pass=rs.length===CANONICAL.total&&original===CANONICAL.original&&variant===CANONICAL.variant&&duplicate===0&&blankQ===0&&blankA===0&&invalid===0&&auditFail===0&&parentFail===0&&figureFail===0&&markerFail===0&&Object.keys(CANONICAL.source).every(k=>src[k]===CANONICAL.source[k]);",
        "const pass=rs.length===original+variant&&original===BASELINE.original&&variant>=BASELINE.baselineVariant&&duplicate===0&&blankQ===0&&blankA===0&&invalid===0&&auditFail===0&&parentFail===0&&taxonomyFail===0&&figureFail===0&&markerFail===0&&Object.keys(BASELINE.source).every(k=>src[k]===BASELINE.source[k]);",
    )
    s = replace_once(
        s,
        "return {pass,total:rs.length,original,variant,duplicate,blankQ,blankA,invalid,auditFail,parentFail,figureFail,markerFail,choiceRecords,src}",
        "return {pass,total:rs.length,original,variant,expandedVariant:Math.max(0,variant-BASELINE.baselineVariant),duplicate,blankQ,blankA,invalid,auditFail,parentFail,taxonomyFail,figureFail,markerFail,choiceRecords,src}",
    )
    s = replace_once(
        s,
        "function showGate(a){$('gate').className='data-gate '+(a.pass?'pass':'fail');$('gate').textContent=a.pass?'正本ゲート PASS：1231問・タイトル/選択肢・構造/監査/親子関係/図版パス/本文内図版マーカーまで確認':'正本ゲート未達：データを公開完成版として扱いません';for(const id of ['draw','redraw','toggleAnswers','printQuestions','printAnswers'])$(id).disabled=!a.pass}",
        "function showGate(a){$('gate').className='data-gate '+(a.pass?'pass':'fail');$('gate').textContent=a.pass?`拡張ゲート PASS：原問題1124問固定＋類題${a.variant}問（追加${a.expandedVariant}問）／親子・単元・技能・形式・監査・図版まで確認`:'拡張ゲート未達：検証済み原問題1124問＋正しい親子関係を持つ類題として確認できません';for(const id of ['draw','redraw','toggleAnswers','printQuestions','printAnswers'])$(id).disabled=!a.pass}",
    )
    s = replace_once(
        s,
        "` / 親 ${a.parentFail} / 図版 ${a.figureFail} / 図版マーカー ${a.markerFail}`",
        "` / 親 ${a.parentFail} / 分類 ${a.taxonomyFail} / 図版 ${a.figureFail} / 図版マーカー ${a.markerFail}`",
    )
    s = replace_once(
        s,
        "else clearOutput('正本1231問の完全ゲートを通過していないため、出題・解答表示・印刷はロックしています。')",
        "else clearOutput('検証済み原問題1124問と親子・分類・監査ゲートを通過していないため、出題・解答表示・印刷はロックしています。')",
    )
    PATH.write_text(s, encoding="utf-8")
    print("PASS_INDEX_EXPANDED_VARIANT_DYNAMIC_GATE_UPGRADE")


if __name__ == "__main__":
    main()
