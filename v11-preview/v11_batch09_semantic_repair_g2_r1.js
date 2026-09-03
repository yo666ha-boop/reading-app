(function(){'use strict';
const ps=[...(window.V11_BATCH09_G2_DRAFTS||[])];
const byId=new Map(ps.map(p=>[p.id,p]));
function words(s){return (String(s||'').match(/[A-Za-z]+(?:['’][A-Za-z]+)?/g)||[]).length;}
function replaceRow(id,idx,en,jp,note){const p=byId.get(id);if(!p)throw Error('missing '+id);const oldEn=p.sentences[idx],oldJp=p.slashRows[idx].jp;p.sentences[idx]=en;p.slashRows[idx]={en,jp};for(const set of [p.questions||[],p.questionSetB||[]])for(const q of set){if(q.evidence===oldEn)q.evidence=en;if(q.evidenceJp===oldJp)q.evidenceJp=jp;if(q.answer===oldJp)q.answer=jp;}p.fullTranslation=(p.slashRows||[]).map(r=>r.jp).join('');p.wordCount=words((p.sentences||[]).join(' '));p.semanticRepairLog=Array.isArray(p.semanticRepairLog)?p.semanticRepairLog:[];p.semanticRepairLog.push({row:idx+1,note,beforeEn:oldEn,afterEn:en,beforeJp:oldJp,afterJp:jp});}
replaceRow('V11-B09-G2-003',6,'Four of the six absent students preferred the science museum.','欠席した六人のうち四人は科学博物館を選びました。','Fixed a numeric contradiction: present vote was aquarium 8 to museum 4; absent vote 2 to 4 now yields final 10 to 8, exactly matching the next sentence’s two-vote aquarium win.');
replaceRow('V11-B09-G2-005',5,'The long waits on Tuesday made the new system look worse than the old one.','火曜日の長い待ち時間だけを見ると、新しい仕組みの方が以前より悪く見えました。','Replaced the illogical phrase “longer Tuesday line” because two lines were open; the measured outcome was waiting time under a confounded customer surge.');
replaceRow('V11-B09-G2-012',5,'The cafeteria placed a second box at the main exit and added an online form with the same questions.','食堂は二つ目の箱を主な出口に置き、同じ質問のオンラインフォームも作りました。','Changed “moved a second box” to “placed a second box” because no second box existed earlier in the narrative.');
replaceRow('V11-B09-G2-015',7,'The reservation table showed who approved the change and the return time for the tablets.','予約表には誰が変更を認めたかと、タブレットの返却時刻を示しました。','Replaced awkward “when the tablets had to return,” which incorrectly made the tablets the agent of returning.');
const reviewed={
'V11-B09-G2-001':'Festival-day paper count is correctly recognized as an unusual sample; three ordinary Tuesdays provide the comparison and the report preserves both contexts.',
'V11-B09-G2-002':'Two-year-old floor plan, previous-spring room change, current-map verification, three corrected locations, and dated revised guide form a coherent stale-source case.',
'V11-B09-G2-003':'All vote arithmetic reread and repaired: 12 present gives 8–4; six absent gives 2–4; final aquarium 10–8, a two-vote win. Participation lesson is supported.',
'V11-B09-G2-004':'20% versus 50% forecasts are reconciled by update time and later Friday recheck; covered-location decision causally follows higher afternoon-rain risk.',
'V11-B09-G2-005':'Monday one-line baseline, Tuesday confounded special-snack surge, Thursday similar-customer two-line retest, and 7-to-4-minute comparison are coherent after wording repair.',
'V11-B09-G2-006':'Forty rows minus three verified duplicates yields thirty-seven volunteers; identity fields are checked before merge, so the numeric and data-cleaning logic is consistent.',
'V11-B09-G2-007':'Lunch-only sound sample is shown to miss after-school music; three later measurements support choosing Room C and publishing tested times.',
'V11-B09-G2-008':'Persistent wet soil after rainy days plausibly supports reducing conditional watering; damaged-leaf removal and one-week observation are presented without claiming a single certain cause.',
'V11-B09-G2-009':'Four rainy days plausibly depress bicycle counts; next-month dry-week repetition and near-full racks support a small, not oversized, expansion.',
'V11-B09-G2-010':'Estimated sound-system cost, confirmation request, +1200-yen correction, decoration reduction, and final within-limit budget are numerically and causally consistent.',
'V11-B09-G2-011':'Page totals are explicitly rejected as a direct fairness measure because formats differ; revised measures match the stated purpose of regular reading and idea sharing.',
'V11-B09-G2-012':'Original box location selects for spicy-food users; second exit box plus identical online questions broadens access. New mild/vegetarian responses support a moderated menu change.',
'V11-B09-G2-013':'April route is normally valid but July platform closure creates a temporary exception; railway notice, alternate train/bus, +15 minutes, and page update align.',
'V11-B09-G2-014':'Heater-adjacent thermometer bias is tested with center and window readings; 2–3 degree difference and week-long three-location data support moving the main thermometer.',
'V11-B09-G2-015':'Ten reserved tablets, four absences, six used by A and four borrowed by B sum exactly to ten; approval and return-time recording support the accountable-exception rule.',
'V11-B09-G2-016':'60% class increase and 15% whole-school increase can both be correct because denominators differ; revised labels make the bases explicit.',
'V11-B09-G2-017':'Online-only response overrepresents home tablet users; paper homeroom repeat broadens access, changes the preference distribution, and supports a six-o’clock trial with later review.'
};
for(const [id,summary] of Object.entries(reviewed)){const p=byId.get(id);if(!p)throw Error('missing '+id);p.semanticRewrite={version:'20260829-g2-r1',humanRead:true,fullPassageReread:true,timelineCoherent:true,actorsClear:true,causalLogicCoherent:true,numbersChecked:true,translationSynced:true,slashSynced:true,questionEvidenceSynced:true,summary};p.authorReview=Object.assign({},p.authorReview||{},{reviewed:true,timelineCoherent:true,actorPerspectiveClear:true,causalLogicCoherent:true,translationNatural:true});}
window.V11_BATCH09_SEMANTIC_G2_R1_STATE={version:'20260829-g2-r1',reviewed:Object.keys(reviewed).length,repairedRows:4,registered:false};
})();
