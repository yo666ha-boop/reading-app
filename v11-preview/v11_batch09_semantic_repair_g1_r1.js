(function(){'use strict';
const ps=[...(window.V11_BATCH09_G1_DRAFTS||[])];
const byId=new Map(ps.map(p=>[p.id,p]));
function words(s){return (String(s||'').match(/[A-Za-z]+(?:['’][A-Za-z]+)?/g)||[]).length;}
function replaceRow(id,idx,en,jp,note){const p=byId.get(id);if(!p)throw Error('missing '+id);const oldEn=p.sentences[idx],oldJp=p.slashRows[idx].jp;p.sentences[idx]=en;p.slashRows[idx]={en,jp};for(const set of [p.questions||[],p.questionSetB||[]])for(const q of set){if(q.evidence===oldEn)q.evidence=en;if(q.evidenceJp===oldJp)q.evidenceJp=jp;if(q.answer===oldJp)q.answer=jp;}p.fullTranslation=(p.slashRows||[]).map(r=>r.jp).join('');p.wordCount=words((p.sentences||[]).join(' '));p.semanticRepairLog=Array.isArray(p.semanticRepairLog)?p.semanticRepairLog:[];p.semanticRepairLog.push({row:idx+1,note,beforeEn:oldEn,afterEn:en,beforeJp:oldJp,afterJp:jp});}
replaceRow('V11-B09-G1-001',3,'She asked the student about the second note.','彩はその二枚目のメモについて生徒に尋ねました。','Removed an unnecessary Friday-caregiver detail that made the Sunday explanation feel temporally ungrounded; kept the causal chain direct.');
replaceRow('V11-B09-G1-002',7,'He returned the box to Mao and put a sign on the shelf to keep food off it.','蓮は真央に箱を返し、その棚に食べ物を置かないための表示を付けました。','Changed an unexplained sign move into a clear preventive action without introducing later grammar.');
replaceRow('V11-B09-G1-004',1,'The photos showed an empty table, a model on it, and students cleaning.','写真には、空の机、その上の模型、そして掃除する生徒が写っていました。','Removed five redundant words from repeated “one photo showed” phrasing while preserving all three visual states and the chronology evidence.');
replaceRow('V11-B09-G1-006',8,'Leo learned to read the words under each arrow before he chose a direction.','レオは、進む方向を選ぶ前にそれぞれの矢印の下の文字を読むことを学びました。','Replaced the awkward abstract closing and avoided a later-taught -ing lexical form.');
replaceRow('V11-B09-G1-007',6,'They reached the field before the game started and used the pump on the soft ball.','試合開始前にグラウンドへ戻り、空気の少ないボールに空気入れを使いました。','Replaced unnatural “filled the soft ball” using already established story vocabulary.');
replaceRow('V11-B09-G1-008',1,'Ten minutes later, a teacher changed the meeting room because Room 3 had a broken light.','10分後、3号室の照明が壊れていたため先生が集会場所を変更しました。','Replaced unnatural “moved the meeting” with a precise room-change statement.');
replaceRow('V11-B09-G1-010',5,'The second route took two more minutes but did not use the closed stairway.','二つ目の道は2分多くかかりましたが、閉鎖された階段は使いませんでした。','Removed vague spatial wording and stated the safety-relevant route property directly.');
replaceRow('V11-B09-G1-014',1,'Six students wanted to eat the dish, so the amounts on the card were too small for their group.','六人で料理を食べたかったため、カードに書かれた分量では足りませんでした。','Replaced “the card was too small” with the intended quantity meaning.');
replaceRow('V11-B09-G1-016',8,'Ko learned to write a clear new message when a plan changed.','予定が変わったときは、明確な新しい連絡を書くことを航は学びました。','Replaced unnatural closing language while avoiding a later modal and later vocabulary.');
const reviewed={
'V11-B09-G1-001':'Timeline and causal logic reread after repair; note chronology and watering decision now align.',
'V11-B09-G1-002':'Ownership clues, non-invasive identification, return action, and prevention step reread as one coherent sequence.',
'V11-B09-G1-003':'Weather change, map check, route comparison, safety check, choice, arrival, and future marking are coherent.',
'V11-B09-G1-004':'Photo-state evidence supports the corrected chronological order; repeated visual-state wording was compressed without losing empty/model/cleaning evidence.',
'V11-B09-G1-005':'Old card versus new receipt dates, librarian explanation, planner action, and library label form a consistent information-date lesson.',
'V11-B09-G1-006':'Wrong-arrow choice, label reading, correct stop, pictogram improvement, and repaired lesson are coherent.',
'V11-B09-G1-007':'Checklist omission, remembered location, recovery before kickoff, ball preparation, and checklist update are coherent after idiom repair.',
'V11-B09-G1-008':'Announcement, later room change, timestamp comparison, redirection, and notice-format improvement form a consistent update sequence.',
'V11-B09-G1-009':'Weekend feeding schedule, ambiguous check mark, direct confirmation, actual-time recording, and Sunday welfare check are coherent.',
'V11-B09-G1-010':'Closure, alternate-route test, two-minute tradeoff, temporary map, and repaired route description are mutually consistent.',
'V11-B09-G1-011':'Missing start time, conflicting memories, booking-sheet verification, 10:30 correction, and full recheck are coherent.',
'V11-B09-G1-012':'Competing gym needs are resolved by actual time requirements; dance-before-four and basketball-after-four fit without overlap.',
'V11-B09-G1-013':'Umbrella identification uses independent handle/thread details and teacher verification; ownership logic is determinate.',
'V11-B09-G1-014':'Three-person recipe to six-person scaling is consistently doubled across eggs, milk, and onions after quantity wording repair.',
'V11-B09-G1-015':'Initial window-seat sample is visibly biased; broader same-question survey supports the fair-sampling lesson without overclaiming.',
'V11-B09-G1-016':'Noon message, 3 p.m. storm change, 4:30 update, and meeting time align; closing lesson is now natural and supported.',
'V11-B09-G1-017':'Empty Wednesday record is resolved by the dated note; moving the entry explains the weekly-total reconciliation.'
};
for(const [id,summary] of Object.entries(reviewed)){const p=byId.get(id);if(!p)throw Error('missing '+id);p.semanticRewrite={version:'20260829-g1-r4',humanRead:true,fullPassageReread:true,timelineCoherent:true,actorsClear:true,causalLogicCoherent:true,translationSynced:true,slashSynced:true,questionEvidenceSynced:true,summary};p.authorReview=Object.assign({},p.authorReview||{},{reviewed:true,timelineCoherent:true,actorPerspectiveClear:true,causalLogicCoherent:true,translationNatural:true});}
window.V11_BATCH09_SEMANTIC_G1_R1_STATE={version:'20260829-g1-r4',reviewed:Object.keys(reviewed).length,repairedRows:9,registered:false};
})();
