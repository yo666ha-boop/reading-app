const fs = require("fs");

const assembledPath = "v11_batch14_assembled_draft.json";
const mapsPath = "v11_batch14_slash_repair_r31_maps_20260909.json";
const r32Path = "v11_batch14_wordcount_repair_r32_20260909.json";

const data = JSON.parse(fs.readFileSync(assembledPath, "utf8"));
const maps = JSON.parse(fs.readFileSync(mapsPath, "utf8"));
const r32 = JSON.parse(fs.readFileSync(r32Path, "utf8"));

function combine(arr, spec) {
  return spec.split("+").map(x => arr[Number(x) - 1]).join(" ");
}

let slashFixed = 0;
let r32Applied = 0;

for (const p of data.passages) {
  const mp = maps.maps[p.id];
  if (mp && p.slashBoundaryDraft) {
    const es = p.slashBoundaryDraft.englishSentences;
    const js = p.slashBoundaryDraft.japaneseSentences;
    p.slashRows = mp.map(pair => {
      const [e, j] = pair.split(":");
      return {
        english: combine(es, e),
        japanese: combine(js, j),
        humanReview: "B14_SLASH_HUMAN_R34_20260909"
      };
    });
    delete p.slashBoundaryDraft;
    slashFixed++;
  }
}

for (const rep of r32.repairs) {
  const p = data.passages.find(x => x.id === rep.id);
  if (!p) throw new Error("R32 target not found: " + rep.id);

  if (!p.body.endsWith(rep.appendEnglish)) {
    p.body = p.body.replace(/\s+$/, "") + " " + rep.appendEnglish;
    p.fullTranslation = p.fullTranslation.replace(/\s+$/, "") + rep.appendJapanese;
    p.slashRows.push({
      english: rep.appendEnglish,
      japanese: rep.appendJapanese,
      humanReview: "B14_SLASH_HUMAN_R34_20260909"
    });
    r32Applied++;
  }
}

if (data.passages.length !== 50) throw new Error("Batch14 passage count must be 50");

let pendingSlash = 0;
let questionCountBad = 0;
let evidenceBad = 0;
for (const p of data.passages) {
  if (!Array.isArray(p.slashRows) || p.slashRows.some(r => !r.english || !r.japanese)) pendingSlash++;
  if ((p.questions || []).length !== 5 || (p.questionSetB || []).length !== 5) questionCountBad++;

  const qs = [...(p.questions || []), ...(p.questionSetB || [])];
  for (const q of qs) {
    const eok = !q.evidence ||
      p.body.includes(q.evidence) ||
      q.evidence.split(" / ").every(s => p.body.includes(s));
    const jok = !q.evidenceJp ||
      p.fullTranslation.includes(q.evidenceJp) ||
      q.evidenceJp.split(" / ").every(s => p.fullTranslation.includes(s));
    if (!eok || !jok) evidenceBad++;
  }
}

if (pendingSlash !== 0) throw new Error("pendingSlash=" + pendingSlash);
if (questionCountBad !== 0) throw new Error("questionCountBad=" + questionCountBad);
if (evidenceBad !== 0) throw new Error("evidenceBad=" + evidenceBad);

data.status = "ASSEMBLED_R34_SLASH_R32_APPLIED_PENDING_REMAINING_GATES";
data.r34ApplySummary = {
  slashFixed,
  r32Applied,
  pendingSlash,
  questionCountBad,
  evidenceBad
};

fs.writeFileSync(assembledPath, JSON.stringify(data, null, 2) + "\n");
console.log(JSON.stringify({ passages: data.passages.length, slashFixed, r32Applied, pendingSlash, questionCountBad, evidenceBad }));
