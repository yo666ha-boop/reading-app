const fs=require('fs'),vm=require('vm');
global.window={};
const files=[
  'v11_batch11_passages_draft_g1.js','v11_batch11_passages_draft_g2.js','v11_batch11_g3_core.js',
  'v11_batch11_passages_draft_g3_standard.js','v11_batch11_passages_draft_g3_long.js',
  'v11_batch11_passages_draft_g3_yamaguchi_a.js','v11_batch11_passages_draft_g3_yamaguchi_b.js',
  'v11_batch11_length_repair_r1.js','v11_batch11_length_repair_r2.js','v11_batch11_length_repair_r3.js','v11_batch11_length_repair_r4.js',
  'v11_batch11_grammar_repair_r1.js','v11_batch11_grammar_repair_r2.js','v11_batch11_semantic_repair_r5.js',
  'v11_batch11_question_human_rewrite_r1.js','v11_batch11_question_human_rewrite_r2.js','v11_batch11_question_human_rewrite_r3.js'
];
for(const f of files)vm.runInThisContext(fs.readFileSync(f,'utf8'),{filename:f});
const all=[...(window.V11_BATCH11_G1_DRAFTS||[]),...(window.V11_BATCH11_G2_DRAFTS||[]),...(window.V11_BATCH11_G3_DRAFTS||[])];
if(all.length!==50)throw Error('Batch11 passages '+all.length);
const out=all.map(p=>({id:p.id,title:p.title,textbook:p.textbook,grade:p.grade,section:p.section,level:p.level,wordCount:p.wordCount,targetWordBand:p.targetWordBand,sentences:p.sentences,fullTranslation:p.fullTranslation,slashRows:p.slashRows,materialData:p.materialData||null,freeWriteTask:p.freeWriteTask||null,questions:p.questions,questionSetB:p.questionSetB,authorReview:p.authorReview||null,semanticReviewR5:p.semanticReviewR5||null,humanReviewR2:p.humanReviewR2||null,humanReviewR3:p.humanReviewR3||null,questionStage:p.questionStage||null,questionHumanReview:p.questionHumanReview||null,registered:p.registered===true}));
fs.writeFileSync('V11_BATCH11_HUMAN_REVIEW_DUMP.json',JSON.stringify({generatedAt:new Date().toISOString(),count:out.length,registered:out.filter(x=>x.registered).length,passages:out},null,2)+'\n');
console.log('V11_BATCH11_HUMAN_REVIEW_DUMP_OK count='+out.length);
