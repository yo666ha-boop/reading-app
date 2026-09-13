const fs=require('fs');
const files=['V11_BATCH16_BODY_TRANSLATION_DRAFT_G1_001_010.json','V11_BATCH16_BODY_TRANSLATION_DRAFT_G1_011_017.json','V11_BATCH16_BODY_TRANSLATION_DRAFT_G2_001_008.json','V11_BATCH16_BODY_TRANSLATION_DRAFT_G2_009_017.json','V11_BATCH16_BODY_TRANSLATION_DRAFT_G3_001_008.json','V11_BATCH16_BODY_TRANSLATION_DRAFT_G3_009_016.json'];
const items=files.flatMap(f=>JSON.parse(fs.readFileSync(f,'utf8')).items);
if(items.length!==50) throw new Error(`Batch16 item count ${items.length}/50`);
const ids=new Set(items.map(x=>x.id)); if(ids.size!==50) throw new Error(`Batch16 unique ids ${ids.size}/50`);
const badShape=items.filter(x=>!String(x.body||'').trim()||!String(x.fullTranslation||'').trim()).map(x=>x.id);

// Explicit required-local maps are now consumed by this Batch16 preflight.
// This prevents already-reviewed Japanese glosses from being repeatedly raised as candidates,
// while deliberately NOT promoting this preflight to the formal canonical-v7 gate.
const requiredLocalById=new Map();
for(const f of fs.readdirSync('.')){
  if(!/^V11_BATCH16_REQUIRED_LOCAL_GLOSS_G[123]_\d{3}\.json$/.test(f)) continue;
  const j=JSON.parse(fs.readFileSync(f,'utf8'));
  const words=new Set((j.requiredLocal||[]).map(v=>String(v.word||'').toLowerCase()).filter(Boolean));
  requiredLocalById.set(j.passageId,{file:f,words});
}

const vocabRules=[
 ['future_perfect',/\bwill have\s+\w+(?:ed|en)\b/i],['past_perfect',/\bhad\s+\w+(?:ed|en)\b/i],['subjunctive_were',/\bif\s+\w+\s+were\b/i]
];
const grammarHits=[]; for(const x of items){for(const [rule,re] of vocabRules){if(re.test(x.body))grammarHits.push({id:x.id,rule});}}
const suspicious=[];
const resolvedRequiredLocal=[];
const advanced=['distinguish','incompatible','committing','triggered','unresolved','misleading','assumption','inspection','availability','participants','environmental','reusable','concentration','diagram','margin','evidence','trustworthy','capacity','context'];
for(const x of items){
  const lower=x.body.toLowerCase();
  const local=requiredLocalById.get(x.id)?.words||new Set();
  for(const w of advanced){
    if(!lower.includes(w)) continue;
    if(local.has(w)) resolvedRequiredLocal.push({id:x.id,word:w});
    else suspicious.push({id:x.id,word:w});
  }
}
const requiredLocalMaps=[...requiredLocalById.entries()].map(([id,v])=>({id,file:v.file,wordCount:v.words.size}));
const report={batch:'V11-B16',registered:false,officialTotal:918,items:items.length,uniqueIds:ids.size,bodyTranslationMissing:badShape,grammarPatternHits:grammarHits,requiredLocalMaps,resolvedRequiredLocal,suspiciousVocabularyCandidates:suspicious,status:(badShape.length||grammarHits.length)?'FAIL_REVIEW':'STRUCTURE_PASS_VOCAB_REVIEW_REQUIRED',note:'Candidate scan only. Required-local Japanese gloss maps are consumed explicitly, but formal v7 chronology still requires canonical grade vocabulary/grammar ledgers and zero unresolved/future violations. Do not register from this report alone.'};
fs.writeFileSync('V11_BATCH16_CHRONOLOGY_PREFLIGHT.json',JSON.stringify(report,null,2));
console.log(JSON.stringify(report));