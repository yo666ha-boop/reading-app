const fs=require('fs');
const bodyFiles=[
  'V11_BATCH16_BODY_TRANSLATION_DRAFT_G1_001_010.json',
  'V11_BATCH16_BODY_TRANSLATION_DRAFT_G1_011_017.json',
  'V11_BATCH16_BODY_TRANSLATION_DRAFT_G2_001_008.json',
  'V11_BATCH16_BODY_TRANSLATION_DRAFT_G2_009_017.json',
  'V11_BATCH16_BODY_TRANSLATION_DRAFT_G3_001_008.json',
  'V11_BATCH16_BODY_TRANSLATION_DRAFT_G3_009_016.json'
];
const items=bodyFiles.flatMap(f=>JSON.parse(fs.readFileSync(f,'utf8')).items||[]);
if(items.length!==50) throw new Error(`Batch16 item count ${items.length}/50`);
if(new Set(items.map(x=>x.id)).size!==50) throw new Error('Batch16 duplicate ids');
function norm(s){return String(s||'').replace(/[’]/g,"'").replace(/\s+/g,' ').trim();}
const rules=[
 ['WILL_FUTURE',/\bwill\s+(?:not\s+)?[a-z]+\b|\b(?:i|you|he|she|it|we|they)'ll\b/i,2],
 ['WOULD_LIKE',/\b(?:i|you|he|she|we|they)\s+would\s+like\s+to\b|\bi'd\s+like\s+to\b/i,1],
 ['BE_GOING_TO',/\b(?:am|is|are) going to\s+[a-z]+\b/i,2],
 ['MODAL_CAN',/\bcan\s+(?:not\s+)?[a-z]+\b/i,1],
 ['MODAL_COULD',/\bcould\s+(?:not\s+)?[a-z]+\b/i,2],
 ['MODAL_MAY_MIGHT',/\b(?:may|might)\s+(?:not\s+)?[a-z]+\b/i,2],
 ['MODAL_MUST',/\bmust\s+(?:not\s+)?[a-z]+\b/i,2],
 ['MODAL_SHOULD',/\bshould\s+(?:not\s+)?[a-z]+\b/i,2],
 ['HAVE_TO',/\b(?:have|has|had) to\s+[a-z]+\b/i,2],
 ['PRESENT_PROGRESSIVE',/\b(?:am|is|are)\s+(?!(?:interesting|amazing|exciting|surprising|boring|tiring|worrying|frightening|moving|touching|charming|promising|missing|following|leading|remaining|outstanding|willing)\b)[a-z]+ing\b/i,1],
 ['PAST_PROGRESSIVE',/\b(?:was|were)\s+(?!(?:interesting|amazing|exciting|surprising|boring|tiring|worrying|frightening|moving|touching|charming|promising|missing|following|leading|remaining|outstanding|willing)\b)[a-z]+ing\b/i,1],
 ['PRESENT_PERFECT_PROGRESSIVE',/\b(?:have|has)\s+been\s+[a-z]+ing\b/i,3],
 ['PRESENT_PERFECT',/\b(?:have|has)\s+(?!to\b)(?:been|gone|seen|done|made|taken|given|written|known|come|become|found|felt|kept|met|left|heard|lost|built|bought|brought|thought|told|said|spoken|eaten|drunk|swum|begun|[a-z]+ed)\b/i,3],
 ['GERUND',/\b(?:like|love|enjoy|finish|practice|stop|start|begin|keep)\s+[a-z]+ing\b|^[A-Z]?[a-z]+ing\s+(?:is|was|can|may|helps?|makes?)\b/i,2],
 ['WANT_TO',/\b(?:want|wants|wanted)\s+to\s+[a-z]+\b/i,1],
 ['VERB_TO_INFINITIVE',/\b(?:need|hope|plan|decide|try|learn|start|begin|like|love|choose|promise|agree|expect|wish|help)\s+to\s+[a-z]+\b/i,2],
 ['ADJECTIVE_TO_INFINITIVE',/\b(?:happy|glad|sorry|surprised|excited|ready|easy|hard|difficult|important|necessary|possible|good|nice)\s+to\s+[a-z]+\b/i,2],
 ['WH_TO_INFINITIVE',/\b(?:what|when|where|which|who|how)\s+to\s+[a-z]+\b/i,2],
 ['ASK_TELL_WANT_O_TO',/\b(?:ask|asks|asked|tell|tells|told|want|wants|wanted)\s+(?:me|you|him|her|us|them|[A-Z][a-z]+)\s+to\s+[a-z]+\b/,3],
 ['COMPARATIVE',/\b(?:better|worse|bigger|smaller|larger|longer|shorter|higher|lower|older|younger|faster|slower|easier|harder|more\s+[a-z]+|less\s+[a-z]+)\s+than\b/i,2],
 ['SUPERLATIVE',/\b(?:the\s+)?(?:best|worst|biggest|smallest|largest|longest|shortest|highest|lowest|oldest|youngest|fastest|slowest|easiest|hardest|most\s+[a-z]+|least\s+[a-z]+)\b/i,2],
 ['AS_AS',/\bas\s+(?:[a-z]+|many|much)\s+as\b/i,2],
 ['IF_CLAUSE',/\bif\s+(?:i|you|he|she|it|we|they|people|someone|something|there|this|that)\s+/i,2],
 ['WHEN_WHILE_CLAUSE',/\b(?:when|while)\s+(?:i|you|he|she|it|we|they|people|someone|something|there|this|that)\s+/i,2],
 ['WHETHER_CLAUSE',/\bwhether\s+(?:i|you|he|she|it|we|they|people|someone|something|there|this|that)\s+/i,3],
 ['BECAUSE_CLAUSE',/\bbecause\s+(?:i|you|he|she|it|we|they|people|someone|something|there|this|that)\s+/i,2],
 ['PASSIVE',/\b(?:am|is|are|was|were|be|been)\s+(?!(?:tired|surprised|interested|excited|worried|pleased|glad|afraid|ready|gone)\b)(?:[a-z]+ed|built|made|known|seen|given|taken|written|shown|thrown|found|called|sent|told|kept|held|lost|bought|brought)\b/i,2],
 ['PARTICIPLE_POSTMODIFIER',/\b(?:people|person|persons|man|woman|boy|girl|student|students|thing|things|book|books|food|foods|products?|animals?|places?|items?|materials?|messages?|pictures?|photos?|letters?|stories?|countries?|cities?|buildings?)\s+(?:made|used|called|written|built|produced|recycled|located|shown|known|living|working|using|wearing|standing|sitting|playing|coming|going)\b/i,3],
 ['RELATIVE_PRONOUN',/\b(?:people|person|persons|man|woman|boy|girl|student|students|teacher|teachers|friend|friends|thing|things|book|books|food|foods|product|products|animal|animals|place|places|item|items|country|countries|city|cities|building|buildings|story|stories|message|messages)\s+(?:who|which|that)\s+(?:am|is|are|was|were|can|could|will|would|has|have|had|do|does|did|[a-z]+s?)\b/i,3],
 ['INDIRECT_QUESTION',/\b(?:know|tell|show|ask|wonder|learn|remember|understand)\s+(?:me\s+|us\s+)?(?:what|when|where|who|how|why)\s+(?:i|you|he|she|it|we|they|people|someone|something|there|this|that)\s+/i,3],
 ['SV_OO',/\b(?:give|gave|send|sent|show|tell|told|lend|lent|teach|taught|buy|bought)\s+(?:me|you|him|her|us|them|[A-Z][a-z]+)\s+(?:a|an|the|my|your|his|her|our|their|this|that|some|[a-z]+)\b/,2],
 ['IT_IS_ADJ_TO',/\bit\s+(?:is|was)\s+(?:easy|hard|difficult|important|necessary|possible|good|nice|useful|dangerous|safe|fun|interesting)\s+(?:for\s+(?:me|you|him|her|us|them|people|students)\s+)?to\s+[a-z]+\b/i,2],
 ['TOO_TO',/\btoo\s+(?:young|old|small|big|large|heavy|light|hard|difficult|busy|tired|dangerous|far|late|early|fast|slow)\s+to\s+[a-z]+\b/i,3],
 ['ENOUGH_TO',/\b(?:old|young|big|small|strong|smart|kind|good|fast|slow|large|long|high|low)\s+enough\s+to\s+[a-z]+\b|\benough\s+(?:time|money|space|food|water)\s+to\s+[a-z]+\b/i,3],
 ['SO_THAT',/\bso\s+that\s+(?:i|you|he|she|it|we|they|people|someone|something)\s+/i,3],
 ['NOT_ONLY_BUT_ALSO',/\bnot only\b[^.?!]{1,160}\bbut also\b/i,3],
 ['MAKE_O_V',/\b(?:make|makes|made)\s+(?:me|you|him|her|us|them|it|people|someone|[A-Z][a-z]+)\s+[a-z]+\b/,3],
 ['LET_O_V',/\b(?:let|lets|let)\s+(?:me|you|him|her|us|them|it)\s+[a-z]+\b/i,3]
];
function gradeOf(id){const m=String(id||'').match(/-G([123])-\d{3}$/);return m?Number(m[1]):null;}
const detections=[],future=[],unresolved=[];
for(const item of items){
  const grade=gradeOf(item.id); if(!grade){unresolved.push({id:item.id,reason:'NO_GRADE_IN_ID'});continue;}
  const text=norm(item.body);
  for(const [feature,re,minGrade] of rules){const m=text.match(re);if(!m)continue;const row={id:item.id,grade,feature,minGrade,match:m[0]};detections.push(row);if(minGrade>grade)future.push(row);}
}
const out={
  batch:'V11-B16', gate:'FORMAL_GRAMMAR_CHRONOLOGY_TEACHING_YEAR', registered:false, officialTotal:918,
  passages:items.length, uniqueIds:new Set(items.map(x=>x.id)).size, detectorVersion:'v10-3.1-derived+b16-year-floor1',
  detectedOccurrences:detections.length, unresolvedOccurrences:unresolved.length, futureGrammarLeak:future.length,
  sectionChronologyMode:'Batch16 passages are grade-targeted (G1/G2/G3), not tied to a single textbook section; this formal gate therefore fail-closes on verified earliest teaching year. It does not widen any exact textbook boundary and does not replace textbook-section evidence for textbook-bound passages.',
  finalPass:unresolved.length===0&&future.length===0, unresolved, future, detections
};
fs.writeFileSync('V11_BATCH16_FORMAL_GRAMMAR_CHRONOLOGY_REPORT.json',JSON.stringify(out,null,2)+'\n');
console.log(`B16 FORMAL GRAMMAR passages=${out.passages}/50 detected=${out.detectedOccurrences} unresolved=${out.unresolvedOccurrences} future=${out.futureGrammarLeak} final=${out.finalPass?'PASS':'FAIL_CLOSED'}`);
if(future.length) for(const x of future) console.log(`FUTURE ${x.id} ${x.feature} grade=${x.grade} minGrade=${x.minGrade} match=${x.match}`);
if(!out.finalPass) process.exitCode=2;
