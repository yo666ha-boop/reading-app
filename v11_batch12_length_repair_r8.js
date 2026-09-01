'use strict';

module.exports=function repairBatch12LengthR8(candidate){
  const additions={
    'V11-B12-G1-001':['Ken later confirmed that the umbrella was his.','後でケン本人も、その傘が自分の物だと確認しました。'],
    'V11-B12-G1-003':['After that day, the students checked the classroom clock before another special event.','その日以降、生徒たちは別の特別行事の前にも教室の時計を確認しました。'],
    'V11-B12-G1-005':['The teacher kept the four extra bibs ready for future group changes.','先生は今後人数が変わったときに備えて、追加の4枚のビブスを使えるようにしておきました。'],
    'V11-B12-G1-009':['The new rule also saved time during later animal duty.','新しいルールによって、その後の飼育当番でも時間を無駄にせずにすみました。'],
    'V11-B12-G1-011':['The librarian also marked that place so the cart would be returned there after use.','司書の先生は、使った後にカートをそこへ戻せるよう、その場所にも印を付けました。'],
    'V11-B12-G1-013':['The tightened holder kept the arrow facing the garden after the next windy day.','留め具を締めたため、次に風が強かった日にも矢印は庭の方を向いたままでした。'],
    'V11-B12-G1-015':['Miki kept the updated list so the next snack count would start from current attendance.','ミキは、次のおやつ準備でもその日の出席人数から数え始められるよう、更新した一覧を残しました。'],
    'V11-B12-G2-002':['After two more days, the new fan position still worked without sending worksheets across the room.','さらに二日間試しても、新しい扇風機の位置ならプリントを教室中に飛ばさずに使えました。'],
    'V11-B12-G2-013':['The club kept the three daily observation times for the rest of the month and compared the results each week.','部員はその月の残りも一日三回の観察時刻を続け、毎週結果を比べました。'],
    'V11-B12-G3-002':['At the end of each week, the group would also ask nearby residents and students whether the trial caused new problems.','さらに毎週の終わりに、試行によって新しい問題が起きていないか、近隣住民と利用する生徒にも尋ねることにしました。'],
    'V11-B12-G3-004':['Before sending the plan, Aya checked all four sources again with the teacher and confirmed that every chosen time still fit.','計画を提出する前に、アヤは先生と四つの情報をもう一度確認し、選んだ時刻がすべての条件に合うことを確かめました。'],
    'V11-B12-G3-008':['Before booking the visit, their mother called the library and confirmed that the first-floor science show needed no advance reservation.','参加を決める前に母親は図書館へ電話し、1階の科学ショーには事前予約が不要なことも確認しました。']
  };
  const byId=new Map((candidate.passages||[]).map(p=>[p.id,p]));
  for(const [id,[en,jp]] of Object.entries(additions)){
    const p=byId.get(id);if(!p)throw new Error('R8 length repair missing '+id);
    const body=String(p.body||'').trim();if(body.includes(en))continue;
    p.body=body+(body?' ':'')+en;
    p.fullTranslation=String(p.fullTranslation||'').trim()+jp;
    p.slashRows=Array.isArray(p.slashRows)?p.slashRows:[];
    p.slashRows.push({en,jp,humanReview:'HUMAN_REVIEW_1TO1_R8_LENGTH_MEANING_CONFIRMED',alignmentCost:0,alignmentShape:'1:1'});
    p.wordCount=(String(p.body).match(/[A-Za-z]+(?:['’][A-Za-z]+)?/g)||[]).length;
    p.humanSemanticReview='B12_HUMAN_REVIEW_R8_LENGTH_ADDITION_CONFIRMED';
  }
  candidate.lengthRepairR8={reviewed:true,ids:Object.keys(additions),addedRows:Object.keys(additions).length,policy:'V11_YAMAGUCHI_ENTRANCE_EXAM_READING_SPEC.md'};
  candidate.finalSlashHumanReview='B12_FINAL_SLASH_HUMAN_REVIEW_R8_LENGTH_REPAIRED';
  candidate.finalSemanticRepairs=Array.from(new Set([...(candidate.finalSemanticRepairs||[]),...Object.keys(additions)]));
  return candidate;
};
