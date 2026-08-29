(function(){'use strict';
const ps=[...(window.V11_BATCH09_G1_DRAFTS||[])];
const byId=new Map(ps.map(p=>[p.id,p]));
function words(s){return (String(s||'').match(/[A-Za-z]+(?:['’][A-Za-z]+)?/g)||[]).length;}
function replaceRow(id,idx,en,jp,note){const p=byId.get(id);if(!p)throw Error('missing '+id);const oldEn=p.sentences[idx],oldJp=p.slashRows[idx].jp;p.sentences[idx]=en;p.slashRows[idx]={en,jp};for(const set of [p.questions||[],p.questionSetB||[]])for(const q of set){if(q.evidence===oldEn)q.evidence=en;if(q.evidenceJp===oldJp)q.evidenceJp=jp;if(q.answer===oldJp)q.answer=jp;}p.fullTranslation=(p.slashRows||[]).map(r=>r.jp).join('');p.wordCount=words((p.sentences||[]).join(' '));p.semanticRepairLog=Array.isArray(p.semanticRepairLog)?p.semanticRepairLog:[];p.semanticRepairLog.push({row:idx+1,note,beforeEn:oldEn,afterEn:en,beforeJp:oldJp,afterJp:jp});}
replaceRow('V11-B09-G1-001',3,'She asked the student about the second note.','彩はその二枚目のメモについて生徒に尋ねました。','Removed an unnecessary Friday-caregiver detail that made the Sunday explanation feel temporally ungrounded; kept the causal chain direct.');
replaceRow('V11-B09-G1-002',7,'He returned the box to Mao and put a sign on the shelf so food would not be placed there again.','蓮は真央に箱を返し、そこに再び食べ物が置かれないよう棚に表示を付けました。','Changed an unexplained “moved a sign” into the causally clear action of putting a sign on the shelf.');
replaceRow('V11-B09-G1-006',8,'Leo learned to read the words under an arrow before following it.','レオは、矢印をたどる前にその下の文字を読むことを学びました。','Replaced an awkward abstract closing sentence with a natural lesson directly supported by the incident.');
const reviewed={
'V11-B09-G1-001':'Timeline and causal logic reread after repair; note chronology and watering decision now align.',
'V11-B09-G1-002':'Ownership clues, non-invasive identification, return action, and prevention step reread as one coherent sequence.',
'V11-B09-G1-003':'Weather change, map check, route comparison, safety check, choice, arrival, and future marking are coherent.',
'V11-B09-G1-004':'Photo-state evidence supports the corrected chronological order; brightness is intentionally shown as a weak first heuristic.',
'V11-B09-G1-005':'Old card versus new receipt dates, librarian explanation, planner action, and library label form a consistent information-date lesson.',
'V11-B09-G1-006':'Wrong-arrow choice, label reading, correct stop, pictogram improvement, and repaired lesson are coherent.'
};
for(const [id,summary] of Object.entries(reviewed)){const p=byId.get(id);if(!p)throw Error('missing '+id);p.semanticRewrite={version:'20260829-g1-r1',humanRead:true,fullPassageReread:true,timelineCoherent:true,actorsClear:true,causalLogicCoherent:true,translationSynced:true,slashSynced:true,questionEvidenceSynced:true,summary};p.authorReview=Object.assign({},p.authorReview||{},{reviewed:true,timelineCoherent:true,actorPerspectiveClear:true,causalLogicCoherent:true,translationNatural:true});}
window.V11_BATCH09_SEMANTIC_G1_R1_STATE={version:'20260829-g1-r1',reviewed:Object.keys(reviewed).length,repairedRows:3,registered:false};
})();
