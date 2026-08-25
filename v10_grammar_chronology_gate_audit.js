const fs=require('fs');
const cand=JSON.parse(fs.readFileSync('v10_grammar_chronology_candidate_report.json','utf8'));
const ev=JSON.parse(fs.readFileSync('v10_grammar_chronology_evidence.json','utf8'));
function rank(section){
  let m=String(section).match(/^Unit\s*(\d+)-(\d+)$/i); if(m)return Number(m[1])*100+Number(m[2])*10;
  if(/^Unit\s*0$/i.test(section))return 0;
  m=String(section).match(/^PROGRAM\s*(\d+)-(\d+)$/i); if(m)return Number(m[1])*100+Number(m[2])*10;
  m=String(section).match(/^Get Ready\s*(\d+)$/i); if(m)return -1000+Number(m[1])*10;
  if(/Step\s*6|Our Project\s*3|Power-Up\s*6/i.test(section))return 99990;
  return null;
}
function key(book,grade,feature){return `${book}|${grade}|${feature}`;}
const exact=ev.exactBoundariesVerified||{};
const coarse=ev.programOrUnitBoundaryVerifiedButExactSubunitPending||{};
function evidenceFor(book,grade,feature){
  const g=Number(grade);
  const same=key(book,g,feature);
  if(exact[same]) return {status:'EXACT_CURRENT_GRADE',boundary:exact[same],introducedGrade:g,key:same};
  for(let pg=g-1;pg>=1;pg--){
    const k=key(book,pg,feature);
    if(exact[k]) return {status:'EXACT_PRIOR_GRADE_CARRY_FORWARD',boundary:exact[k],introducedGrade:pg,key:k};
  }
  if(coarse[same]) return {status:'PROGRAM_OR_UNIT_ONLY',coarseBoundary:coarse[same],key:same};
  for(let pg=g-1;pg>=1;pg--){
    const k=key(book,pg,feature);
    if(coarse[k]) return {status:'PRIOR_GRADE_COARSE_ONLY',coarseBoundary:coarse[k],introducedGrade:pg,key:k};
  }
  return {status:'NO_EVIDENCE_BOUNDARY',key:same};
}
function isFalsePositive(feature,hit){
  const text=String(hit&&hit.text||'');
  const match=String(hit&&hit.match||'');
  if(feature==='ADJECTIVE_TO_INFINITIVE'){
    if(/\bnice\s+to\s+meet\b/i.test(match))return true;
    if(/\b(?:important|good|nice|easy|hard|difficult|necessary|possible|ready)\s+to\s+(?:me|you|him|her|us|them)\b/i.test(match))return true;
  }
  if(feature==='MAKE_O_V'){
    // Reject ordinary lexical make + noun phrases accidentally read as make O V.
    if(/\bmake\s+(?:chinese|japanese|local|traditional|school|sports?|food|lunch|dinner|breakfast)\b/i.test(match))return true;
    if(/\bmade\s+it\s+(?:this|that|the|a|an)\b/i.test(match))return true;
  }
  if(feature==='SV_OO'){
    // A real double-object needs a second object, not a following preposition/adverb/to-infinitive marker.
    if(/\b(?:about|around|with|across|to|from|for|at|on|in|into|over|under|through|by)\b\s*$/i.test(match))return true;
  }
  if(feature==='SUPERLATIVE'){
    if(/\b(?:do|doing|did|try|trying)\s+(?:my|your|his|her|our|their)\s+best\b/i.test(text))return true;
    if(/^\s*best\s+wishes\b/i.test(text))return true;
    if(/\bat\s+least\s+(?:a|one|two|three|four|five|few|some)\b/i.test(text)&&/\bleast\b/i.test(match))return true;
  }
  if(feature==='VERB_TO_INFINITIVE'&&/\bwould\s+like\s+to\b|\b(?:i|you|he|she|we|they)'d\s+like\s+to\b/i.test(text))return true;
  return false;
}
function cleanHits(feature,hits){return (hits||[]).filter(h=>!isFalsePositive(feature,h));}
let detectedOccurrences=0,resolvedOccurrences=0,unresolvedOccurrences=0,futureGrammarLeak=0,priorGradeCarryForwardOccurrences=0,falsePositiveOccurrencesRemoved=0;
const unresolved=[],future=[],resolved=[];
for(const row of cand.passageFeatures||[]){
  for(const [feature,rawHits] of Object.entries(row.features||{})){
    const hits=cleanHits(feature,rawHits);
    falsePositiveOccurrencesRemoved+=rawHits.length-hits.length;
    if(!hits.length)continue;
    detectedOccurrences+=hits.length;
    const e=evidenceFor(row.textbook,row.grade,feature);
    if(e.status==='EXACT_PRIOR_GRADE_CARRY_FORWARD'){
      resolvedOccurrences+=hits.length; priorGradeCarryForwardOccurrences+=hits.length;
      resolved.push({textbook:row.textbook,grade:row.grade,section:row.section,feature,boundary:e.boundary,introducedGrade:e.introducedGrade,evidenceStatus:e.status,occurrences:hits.length});
      continue;
    }
    if(e.status!=='EXACT_CURRENT_GRADE'){
      unresolvedOccurrences+=hits.length;
      unresolved.push({textbook:row.textbook,grade:row.grade,section:row.section,feature,occurrences:hits.length,evidenceStatus:e.status,coarseBoundary:e.coarseBoundary||null,introducedGrade:e.introducedGrade||null,samples:hits.slice(0,3)});
      continue;
    }
    const rr=rank(row.section), br=rank(e.boundary);
    if(rr===null||br===null){
      unresolvedOccurrences+=hits.length;
      unresolved.push({textbook:row.textbook,grade:row.grade,section:row.section,feature,occurrences:hits.length,evidenceStatus:'UNRANKABLE_SECTION',boundary:e.boundary,samples:hits.slice(0,3)});
      continue;
    }
    if(rr<br){
      futureGrammarLeak+=hits.length;
      future.push({textbook:row.textbook,grade:row.grade,section:row.section,feature,boundary:e.boundary,occurrences:hits.length,samples:hits.slice(0,5)});
    }else{
      resolvedOccurrences+=hits.length;
      resolved.push({textbook:row.textbook,grade:row.grade,section:row.section,feature,boundary:e.boundary,introducedGrade:Number(row.grade),evidenceStatus:e.status,occurrences:hits.length});
    }
  }
}
const out={generatedAt:new Date().toISOString(),detectorVersion:(cand.detectorVersion||'3.1')+'+gate-fp1',passages:cand.passages,detectedFeatureTypes:Object.keys(cand.featureSummary||{}).length,detectedOccurrences,falsePositiveOccurrencesRemoved,resolvedOccurrences,priorGradeCarryForwardOccurrences,unresolvedOccurrences,futureGrammarLeak,sectionChronologyComplete:unresolvedOccurrences===0,finalPass:unresolvedOccurrences===0&&futureGrammarLeak===0,rule:'Fail closed after bounded structural false-positive removal: only exact evidence-backed same-textbook boundaries resolve occurrences. Exact earlier-grade introductions carry forward. Unit/program-level evidence remains unresolved.',future,unresolved,resolved};
fs.writeFileSync('v10_grammar_chronology_gate_report.json',JSON.stringify(out,null,2)+'\n');
console.log(`GRAMMAR CHRONOLOGY GATE passages=${out.passages}/168 features=${out.detectedFeatureTypes} occurrences=${detectedOccurrences} fpRemoved=${falsePositiveOccurrencesRemoved} resolved=${resolvedOccurrences} carry=${priorGradeCarryForwardOccurrences} unresolved=${unresolvedOccurrences} future=${futureGrammarLeak} final=${out.finalPass?'PASS':'FAIL_CLOSED'}`);
if(future.length){for(const x of future.slice(0,30))console.log(`FUTURE ${x.textbook}|${x.grade}|${x.section} ${x.feature} before ${x.boundary} occurrences=${x.occurrences}`);}
