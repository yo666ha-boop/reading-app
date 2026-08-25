const fs=require('fs');
const {JSDOM,VirtualConsole}=require('jsdom');
function norm(s){return String(s||'').replace(/[’]/g,"'").replace(/\s+/g,' ').trim();}
function add(out,feature,where,text,match){if(!out[feature])out[feature]=[];if(out[feature].length<120)out[feature].push({where,text,match});}
function scan(text,where,out){
  const s=norm(text); if(!s)return;
  const rules=[
    ['WILL_FUTURE',/\bwill\s+(?:be|have|do|go|come|make|take|give|see|help|use|visit|work|play|study|learn|tell|show|bring|keep|need|want|start|finish|become|remain|support|protect|continue|improve|change|live|stay|try|find|know|think|say|read|write|meet|eat|buy|build|call|open|close|move|turn|travel|enjoy|practice|remember|understand|feel|look)\b|\b(?:i|you|he|she|it|we|they)'ll\b/i],
    ['WOULD_LIKE',/\b(?:i|you|he|she|we|they)\s+would\s+like\s+to\b|\bi'd\s+like\s+to\b/i],
    ['BE_GOING_TO',/\b(?:am|is|are) going to\s+[a-z]+\b/i],
    ['MODAL_CAN',/\bcan\s+(?:not\s+)?[a-z]+\b/i],
    ['MODAL_COULD',/\bcould\s+(?:not\s+)?[a-z]+\b/i],
    ['MODAL_MAY_MIGHT',/\b(?:may|might)\s+(?:not\s+)?[a-z]+\b/i],
    ['MODAL_MUST',/\bmust\s+(?:not\s+)?[a-z]+\b/i],
    ['MODAL_SHOULD',/\bshould\s+(?:not\s+)?[a-z]+\b/i],
    ['HAVE_TO',/\b(?:have|has|had) to\s+[a-z]+\b/i],
    ['PRESENT_PROGRESSIVE',/\b(?:am|is|are)\s+[a-z]+ing\b/i],
    ['PAST_PROGRESSIVE',/\b(?:was|were)\s+[a-z]+ing\b/i],
    ['PRESENT_PERFECT_PROGRESSIVE',/\b(?:have|has)\s+been\s+[a-z]+ing\b/i],
    ['PRESENT_PERFECT',/\b(?:have|has)\s+(?!to\b)(?:been|gone|seen|done|made|taken|given|written|known|come|become|found|felt|kept|met|left|heard|lost|built|bought|brought|thought|told|said|spoken|eaten|drunk|swum|begun|[a-z]+ed)\b/i],
    ['GERUND',/\b(?:like|love|enjoy|finish|practice|stop|start|begin|keep)\s+[a-z]+ing\b|^[A-Z]?[a-z]+ing\s+(?:is|was|can|may|helps?|makes?)\b/i],
    ['WANT_TO',/\b(?:want|wants|wanted)\s+to\s+[a-z]+\b/i],
    ['VERB_TO_INFINITIVE',/\b(?:need|hope|plan|decide|try|learn|start|begin|like|love|choose|promise|agree|expect|wish|help)\s+to\s+[a-z]+\b/i],
    ['ADJECTIVE_TO_INFINITIVE',/\b(?:happy|glad|sorry|surprised|excited|ready|easy|hard|difficult|important|necessary|possible|good|nice)\s+to\s+[a-z]+\b/i],
    ['WH_TO_INFINITIVE',/\b(?:what|when|where|which|who|how)\s+to\s+[a-z]+\b/i],
    ['ASK_TELL_WANT_O_TO',/\b(?:ask|asks|asked|tell|tells|told|want|wants|wanted)\s+(?:me|you|him|her|us|them|[A-Z][a-z]+)\s+to\s+[a-z]+\b/],
    ['COMPARATIVE',/\b(?:better|worse|bigger|smaller|larger|longer|shorter|higher|lower|older|younger|faster|slower|easier|harder|more\s+[a-z]+|less\s+[a-z]+)\s+than\b/i],
    ['SUPERLATIVE',/\b(?:the\s+)?(?:best|worst|biggest|smallest|largest|longest|shortest|highest|lowest|oldest|youngest|fastest|slowest|easiest|hardest|most\s+[a-z]+|least\s+[a-z]+)\b/i],
    ['AS_AS',/\bas\s+(?:[a-z]+|many|much)\s+as\b/i],
    ['IF_CLAUSE',/\bif\s+(?:i|you|he|she|it|we|they|people|someone|something|there|this|that)\s+/i],
    ['WHEN_WHILE_CLAUSE',/\b(?:when|while)\s+(?:i|you|he|she|it|we|they|people|someone|something|there|this|that)\s+/i],
    ['WHETHER_CLAUSE',/\bwhether\s+(?:i|you|he|she|it|we|they|people|someone|something|there|this|that)\s+/i],
    ['BECAUSE_CLAUSE',/\bbecause\s+(?:i|you|he|she|it|we|they|people|someone|something|there|this|that)\s+/i],
    ['PASSIVE',/\b(?:am|is|are|was|were|be|been)\s+(?!(?:tired|surprised|interested|excited|worried|pleased|glad|afraid|ready|gone)\b)(?:[a-z]+ed|built|made|known|seen|given|taken|written|shown|thrown|found|called|sent|told|kept|held|lost|bought|brought)\b/i],
    ['PARTICIPLE_POSTMODIFIER',/\b(?:people|person|persons|man|woman|boy|girl|student|students|thing|things|book|books|food|foods|products?|animals?|places?|items?|materials?|messages?|pictures?|photos?|letters?|stories?|countries?|cities?|buildings?)\s+(?:made|used|called|written|built|produced|recycled|located|shown|known|living|working|using|wearing|standing|sitting|playing|coming|going)\b/i],
    ['RELATIVE_PRONOUN',/\b(?:people|person|persons|man|woman|boy|girl|student|students|teacher|teachers|friend|friends|thing|things|book|books|food|foods|product|products|animal|animals|place|places|item|items|country|countries|city|cities|building|buildings|story|stories|message|messages)\s+(?:who|which|that)\s+(?:am|is|are|was|were|can|could|will|would|has|have|had|do|does|did|[a-z]+s?)\b/i],
    ['INDIRECT_QUESTION',/\b(?:know|tell|show|ask|wonder|learn|remember|understand)\s+(?:me\s+|us\s+)?(?:what|when|where|who|how|why)\s+(?:i|you|he|she|it|we|they|people|someone|something|there|this|that)\s+/i],
    ['SV_OO',/\b(?:give|gave|send|sent|show|tell|told|lend|lent|teach|taught|buy|bought)\s+(?:me|you|him|her|us|them|[A-Z][a-z]+)\s+(?:a|an|the|my|your|his|her|our|their|this|that|some|[a-z]+)\b/],
    ['IT_IS_ADJ_TO',/\bit\s+(?:is|was)\s+(?:easy|hard|difficult|important|necessary|possible|good|nice|useful|dangerous|safe|fun|interesting)\s+(?:for\s+(?:me|you|him|her|us|them|people|students)\s+)?to\s+[a-z]+\b/i],
    ['TOO_TO',/\btoo\s+(?:young|old|small|big|large|heavy|light|hard|difficult|busy|tired|dangerous|far|late|early|fast|slow)\s+to\s+[a-z]+\b/i],
    ['ENOUGH_TO',/\b(?:old|young|big|small|strong|smart|kind|good|fast|slow|large|long|high|low)\s+enough\s+to\s+[a-z]+\b|\benough\s+(?:time|money|space|food|water)\s+to\s+[a-z]+\b/i],
    ['SO_THAT',/\bso\s+that\s+(?:i|you|he|she|it|we|they|people|someone|something)\s+/i],
    ['NOT_ONLY_BUT_ALSO',/\bnot only\b[^.?!]{1,160}\bbut also\b/i],
    ['MAKE_O_V',/\b(?:make|makes|made)\s+(?:me|you|him|her|us|them|it|people|someone|[A-Z][a-z]+)\s+[a-z]+\b/],
    ['LET_O_V',/\b(?:let|lets|let)\s+(?:me|you|him|her|us|them|it)\s+[a-z]+\b/i]
  ];
  for(const [f,re] of rules){const m=s.match(re);if(m)add(out,f,where,s,m[0]);}
}
function sources(m,meta){const a=[];(m.sentences||[]).forEach((x,i)=>a.push([`sentence:${i+1}`,x]));(m.slashRows||[]).forEach((x,i)=>a.push([`slash:${i+1}`,x&&x.en]));(m.questions||[]).forEach((q,i)=>['prompt','answer','evidence'].forEach(k=>a.push([`A${i+1}.${k}`,q&&q[k]])));const b=meta&&Array.isArray(meta.questionSetB)?meta.questionSetB:[];b.forEach((q,i)=>['prompt','answer','evidence'].forEach(k=>a.push([`B${i+1}.${k}`,q&&q[k]])));return a;}
async function waitFor(fn,ms=30000,label='condition'){const st=Date.now();while(Date.now()-st<ms){try{if(fn())return;}catch(_){}await new Promise(r=>setTimeout(r,50));}throw new Error(`timeout waiting for ${label}`);}
function datasetCount(d){let n=0;for(const g of Object.values(d||{}))for(const t of Object.values(g||{}))n+=Object.keys(t||{}).length;return n;}
(async()=>{let dom;try{const errs=[];const vc=new VirtualConsole();vc.on('jsdomError',e=>errs.push(String(e&&e.message||e)));dom=await JSDOM.fromFile('v10_stage2.html',{runScripts:'dangerously',resources:'usable',pretendToBeVisual:true,virtualConsole:vc});const w=dom.window;await waitFor(()=>datasetCount(w.eval('DATASETS'))===168,45000,'168 datasets');await waitFor(()=>w.V10_RUNTIME_LOAD_PROGRESS==='complete'||!!w.V10_RUNTIME_LOAD_ERROR,90000,'authoritative final runtime terminal state');if(w.V10_RUNTIME_LOAD_PROGRESS!=='complete'||w.V10_RUNTIME_LOAD_ERROR)throw new Error(`authoritative runtime load failed: progress=${w.V10_RUNTIME_LOAD_PROGRESS} error=${w.V10_RUNTIME_LOAD_ERROR}`);await new Promise(r=>setTimeout(r,250));errs.length=0;await new Promise(r=>setTimeout(r,50));const DATASETS=w.eval('DATASETS'),META=w.eval('META');let passages=0;const rows=[];const featureSections={};for(const grade of ['1','2','3'])for(const textbook of ['サンシャイン','ニューホライズン'])for(const [section,m] of Object.entries((DATASETS[grade]||{})[textbook]||{})){passages++;const found={};const meta=META[`${textbook}|${grade}|${section}`]||{};for(const [where,text] of sources(m,meta))scan(text,where,found);for(const f of Object.keys(found)){if(!featureSections[f])featureSections[f]=new Set();featureSections[f].add(`${textbook}|${grade}|${section}`);}rows.push({textbook,grade,section,id:m.id||'',features:found});}if(passages!==168)throw new Error(`expected 168 passages, got ${passages}`);if(errs.length)throw new Error(`browser errors: ${errs.join(' | ')}`);const featureSummary={};for(const [f,set] of Object.entries(featureSections))featureSummary[f]={sectionCount:set.size,sections:[...set]};const out={generatedAt:new Date().toISOString(),passages,classification:'CANDIDATES_NOT_PASS_FAIL',warning:'Refined structure detector v3 after authoritative final runtime load. Modal and infinitive families are split so chronology cannot be granted by an unrelated earlier use.',detectorVersion:3,featureSummary,passageFeatures:rows};fs.writeFileSync('v10_grammar_chronology_candidate_report.json',JSON.stringify(out,null,2));if(fs.existsSync('v10_grammar_chronology_evidence.json')&&fs.existsSync('v10_grammar_chronology_gate_audit.js')){delete require.cache[require.resolve('./v10_grammar_chronology_gate_audit.js')];require('./v10_grammar_chronology_gate_audit.js');const gate=JSON.parse(fs.readFileSync('v10_grammar_chronology_gate_report.json','utf8'));out.chronologyGate={detectedOccurrences:gate.detectedOccurrences,resolvedOccurrences:gate.resolvedOccurrences,priorGradeCarryForwardOccurrences:gate.priorGradeCarryForwardOccurrences||0,unresolvedOccurrences:gate.unresolvedOccurrences,futureGrammarLeak:gate.futureGrammarLeak,sectionChronologyComplete:gate.sectionChronologyComplete,finalPass:gate.finalPass,future:gate.future||[],unresolved:gate.unresolved||[]};fs.writeFileSync('v10_grammar_chronology_candidate_report.json',JSON.stringify(out,null,2));}console.log(`GRAMMAR CANDIDATE AUDIT v3 passages=${passages} features=${Object.keys(featureSummary).length} runtime=authoritative-complete`);for(const [f,v] of Object.entries(featureSummary))console.log(`${f} sections=${v.sectionCount}`);if(out.chronologyGate)console.log(`GRAMMAR GATE resolved=${out.chronologyGate.resolvedOccurrences} unresolved=${out.chronologyGate.unresolvedOccurrences} future=${out.chronologyGate.futureGrammarLeak} final=${out.chronologyGate.finalPass?'PASS':'FAIL_CLOSED'}`);}finally{if(dom)dom.window.close();}})().catch(e=>{console.log(`GRAMMAR CANDIDATE AUDIT FAIL: ${e.stack||e}`);process.exit(1)});
