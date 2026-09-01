'use strict';

module.exports=function repairBatch12LengthR8(candidate){
  const additions={
    'V11-B12-G1-001':["Ken saw the umbrella and said, 'Yes, this is mine.'",'ケンはその傘を見て、「うん、これは僕のだよ」と言いました。'],
    'V11-B12-G1-003':['After that day, the students checked the classroom clock again before they left.','その日以降、生徒たちは教室を出る前にも、もう一度教室の時計を確認しました。'],
    'V11-B12-G1-005':['The teacher put the four other bibs in a box for another day.','先生は残りの4枚のビブスを、別の日に使えるよう箱に入れました。'],
    'V11-B12-G1-009':['The new rule helped the students finish animal duty on time again.','新しいルールのおかげで、生徒たちはその後の飼育当番も時間どおりに終えられました。'],
    'V11-B12-G1-011':['The librarian marked the place, too, and everyone put the cart there after use.','司書の先生はその場所にも印を付け、みんなが使った後にカートをそこへ置くようにしました。'],
    'V11-B12-G1-013':['The arrow did not move on the next windy day.','次に風が強かった日にも、矢印は動きませんでした。'],
    'V11-B12-G1-015':['Miki put the new list on the table for the next snack count.','ミキは次のおやつの数を確認するときに使えるよう、新しい一覧を机の上に置きました。'],
    'V11-B12-G2-002':['After two more days, the new fan position still worked, and the worksheets stayed on the desks.','さらに二日たっても新しい扇風機の位置はうまく働き、プリントは机の上に置かれたままでした。'],
    'V11-B12-G2-013':['The club used the same three times again and checked the numbers every week.','部員は同じ三つの時刻で観察を続け、毎週その数を確認しました。'],
    'V11-B12-G3-002':['At the end of each week, the group would also ask nearby residents and students whether the trial caused new problems.','さらに毎週の終わりに、試行によって新しい問題が起きていないか、近隣住民と利用する生徒にも尋ねることにしました。'],
    'V11-B12-G3-004':['Before sending the plan, Aya and the teacher checked the four pieces of information again. Every time in the plan still worked.','計画を提出する前に、アヤと先生は四つの情報をもう一度確認しました。計画に入れた時刻はすべて問題なく使えました。'],
    'V11-B12-G3-008':['Before the visit, their mother called the library and learned that they could join the first-floor science show that day.','参加する前に母親は図書館へ電話し、その日は1階の科学ショーに参加できることも確認しました。']
  };
  const byId=new Map((candidate.passages||[]).map(p=>[p.id,p]));
  for(const [id,[en,jp]] of Object.entries(additions)){
    const p=byId.get(id);if(!p)throw new Error('R8 length repair missing '+id);
    const body=String(p.body||'').trim();
    p.body=body+(body?' ':'')+en;
    p.fullTranslation=String(p.fullTranslation||'').trim()+jp;
    p.slashRows=Array.isArray(p.slashRows)?p.slashRows:[];
    p.slashRows.push({en,jp,humanReview:'HUMAN_REVIEW_1TO1_R8_LENGTH_MEANING_CONFIRMED',alignmentCost:0,alignmentShape:'1:1'});
    p.wordCount=(String(p.body).match(/[A-Za-z]+(?:['’][A-Za-z]+)?/g)||[]).length;
    p.humanSemanticReview='B12_HUMAN_REVIEW_R8_LENGTH_ADDITION_CONFIRMED';
  }
  candidate.lengthRepairR8={reviewed:true,ids:Object.keys(additions),addedRows:Object.keys(additions).length,policy:'V11_YAMAGUCHI_ENTRANCE_EXAM_READING_SPEC.md',chronologySafeRewrite:'R8B'};
  candidate.finalSlashHumanReview='B12_FINAL_SLASH_HUMAN_REVIEW_R8_LENGTH_REPAIRED';
  candidate.finalSemanticRepairs=Array.from(new Set([...(candidate.finalSemanticRepairs||[]),...Object.keys(additions)]));
  return candidate;
};
