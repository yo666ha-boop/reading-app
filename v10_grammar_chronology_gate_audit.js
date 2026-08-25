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
let detectedOccurrences=0,resolvedOccurrences=0,unresolvedOccurrences=0,futureGrammarLeak=0;
const unresolved=[],future=[],resolved=[];
for(const row of cand.passageFeatures||[]){
  for(const [feature,hits] of Object.entries(row.features||{})){
    const k=key(row.textbook,row.grade,feature); detectedOccurrences+=hits.length;
    const b=exact[k];
    if(!b){
      unresolvedOccurrences+=hits.length;
      unresolved.push({textbook:row.textbook,grade:row.grade,section:row.section,feature,occurrences:hits.length,evidenceStatus:coarse[k]?'PROGRAM_OR_UNIT_ONLY':'NO_EVIDENCE_BOUNDARY',coarseBoundary:coarse[k]||null,samples:hits.slice(0,3)});
      continue;
    }
    const rr=rank(row.section), br=rank(b);
    if(rr===null||br===null){
      unresolvedOccurrences+=hits.length; unresolved.push({textbook:row.textbook,grade:row.grade,section:row.section,feature,occurrences:hits.length,evidenceStatus:'UNRANKABLE_SECTION',boundary:b,samples:hits.slice(0,3)}); continue;
    }
    if(rr<br){
      futureGrammarLeak+=hits.length; future.push({textbook:row.textbook,grade:row.grade,section:row.section,feature,boundary:b,occurrences:hits.length,samples:hits.slice(0,5)});
    }else{
      resolvedOccurrences+=hits.length; resolved.push({textbook:row.textbook,grade:row.grade,section:row.section,feature,boundary:b,occurrences:hits.length});
    }
  }
}
const out={generatedAt:new Date().toISOString(),detectorVersion:cand.detectorVersion||1,passages:cand.passages,detectedFeatureTypes:Object.keys(cand.featureSummary||{}).length,detectedOccurrences,resolvedOccurrences,unresolvedOccurrences,futureGrammarLeak,sectionChronologyComplete:unresolvedOccurrences===0,finalPass:unresolvedOccurrences===0&&futureGrammarLeak===0,rule:'Fail closed: only exact evidence-backed same-textbook boundaries resolve occurrences. Unit/program-level evidence is recorded but never upgraded to exact subunit permission.',future,unresolved,resolved};
fs.writeFileSync('v10_grammar_chronology_gate_report.json',JSON.stringify(out,null,2)+'\n');
console.log(`GRAMMAR CHRONOLOGY GATE passages=${out.passages}/168 features=${out.detectedFeatureTypes} occurrences=${detectedOccurrences} resolved=${resolvedOccurrences} unresolved=${unresolvedOccurrences} future=${futureGrammarLeak} final=${out.finalPass?'PASS':'FAIL_CLOSED'}`);
if(future.length){for(const x of future.slice(0,30))console.log(`FUTURE ${x.textbook}|${x.grade}|${x.section} ${x.feature} before ${x.boundary} occurrences=${x.occurrences}`);}
