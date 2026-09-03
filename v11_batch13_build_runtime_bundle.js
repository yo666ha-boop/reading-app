'use strict';
const fs=require('fs');
const cp=require('child_process');
const build=require('./v11_batch13_build_final_candidate.js');
const applyGloss=require('./v11_batch13_apply_prior_verified_gloss.js');
function die(m){throw new Error(m)}
function run(f){const r=cp.spawnSync(process.execPath,[f],{encoding:'utf8'});if(r.status!==0)die(`${f} failed\n${r.stderr||r.stdout}`)}
run('v11_batch13_verify_slash_human_review.js');
const gate=JSON.parse(fs.readFileSync('v11_batch13_slash_human_gate.json','utf8'));
if(gate.status!=='PASS'||gate.humanReviewed!==true||gate.passages!==50||gate.rows!==558)die('Batch13 slash human gate invalid');
const packet=JSON.parse(fs.readFileSync('v11_batch13_slash_review_packet.json','utf8'));
const c=applyGloss(build());
if(c.registered!==false||c.officialTotal!==768||c.targetAfterFullGates!==818||c.passages.length!==50)die('Batch13 candidate contract');
if(!c.priorVerifiedGlossReuse||c.priorVerifiedGlossReuse.uncoveredDistinct!==0)die('Batch13 required-local gloss uncovered');
const byId=new Map(packet.passages.map(x=>[x.id,x]));
const textbookRuntimeName=s=>{const v=String(s||'').trim().toLowerCase();if(['sunshine','サンシャイン','ss'].includes(v))return 'サンシャイン';if(['new horizon','newhorizon','ニューホライズン','nh'].includes(v))return 'ニューホライズン';throw Error('unknown textbook '+s)};
const ps=c.passages.map(p=>{const q=JSON.parse(JSON.stringify(p)),a=byId.get(q.id);if(!a||!a.rows||!a.rows.length)die(q.id+' slash packet missing');q.textbook=textbookRuntimeName(q.anchor&&q.anchor.textbook);q.grade=String(q.anchor.grade);q.section=q.anchor.unit;q.slashRows=a.rows.map(r=>({en:r.suggestedEn||r.en,jp:r.suggestedJp||r.jp,humanReview:'B13_HUMAN_SLASH_PASS',alignmentShape:`${r.enSentenceCount}:${r.jpSentenceCount}`}));q.sentences=q.slashRows.map(r=>r.en.replace(/\s*\/\s*/g,' '));q.registered=false;q.batch='V11-B13';q.finalHumanQuestionReview=true;q.finalSlashHumanReview='B13_SLASH_HUMAN_REVIEW_PASS';return q});
if(new Set(ps.map(p=>p.id)).size!==50)die('Batch13 unique IDs');
const payload={batch:'V11-B13',officialBefore:768,targetAfterFullGates:818,registered:false,passages:ps,slashGateSha256:gate.packetProjectionSha256,requiredGloss:c.priorVerifiedGlossReuse};
fs.writeFileSync('v11_batch13_runtime_bundle.js',`(function(){'use strict';window.V11_BATCH13_FINAL_BUNDLE=${JSON.stringify(payload)};window.V11_BATCH13_FINAL_PASSAGES=window.V11_BATCH13_FINAL_BUNDLE.passages;})();\n`);
fs.writeFileSync('V11_BATCH13_RUNTIME_BUNDLE_STATUS.json',JSON.stringify({passages:50,questions:ps.reduce((n,p)=>n+p.questions.length+p.questionSetB.length,0),normalNotes:ps.reduce((n,p)=>n+(p.notes||[]).length,0),slashRows:ps.reduce((n,p)=>n+p.slashRows.length,0),registered:false,officialBefore:768,target:818,requiredGlossUncovered:c.priorVerifiedGlossReuse.uncoveredDistinct,pass:true},null,2)+'\n');
console.log('V11_BATCH13_RUNTIME_BUNDLE_50_PASS');
