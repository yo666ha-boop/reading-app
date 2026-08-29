'use strict';
const fs=require('fs');
const p='V11_1000_PASSAGE_STATUS.txt';let s=fs.readFileSync(p,'utf8');
function set(k,v){const re=new RegExp('^'+k.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'=.*$','m');if(re.test(s))s=s.replace(re,`${k}=${v}`);else s+=`${s.endsWith('\n')?'':'\n'}${k}=${v}\n`;}
set('phase','V11_BATCH08_COMPLETE_BATCH09_NEXT');set('batch08_passages','50');set('current_total','568');set('remaining_passages','432');set('next_batch','Batch09');set('next_batch_target','618');set('batch08_registered','true');
const lines=[
'batch08_profile=PASS g1=17 g2=17 g3=16 g3_standard=8 g3_long=4 g3_yamaguchi_exam=4',
'batch08_content_quality=PASS run=33232602390 passages=50 word_count=PASS structure=PASS translation_slash=PASS near_shared=0 human_question_scaffold=0',
'batch08_questions=PASS run=33232602390 passages=50 total_questions=500 a=5 b=5 evidence=PASS question_type_diversity=PASS mechanical_scaffold=0',
'batch08_vocab_chronology=PASS run=33232724648 unregistered=0 future_vocab=0 tokens=23808 required_note_covered=6622',
'batch08_grammar_chronology=PASS run=33232724648 occurrences=469 unresolved=0 future_grammar=0',
'batch08_persistent_runtime=PASS run=33232685412 total=568 batch08=50 pc=50 iphone=50 cross_batch=PASS a4_student_teacher=PASS',
'batch08_registration_commit=603841b26519d92f1991ab887155e7862d82400e',
'batch08_bootstrap_commit=2270a86b26c80c167db3ab632cd2eaad8bcd9c08',
'batch08_human_question_rewrite_commit=46693f1e6898dfd5d4c924368e85115dae3cc1a0'
];
for(const line of lines){const k=line.split('=')[0];const re=new RegExp('^'+k+'=.*$','m');if(re.test(s))s=s.replace(re,line);else s+=(s.endsWith('\n')?'':'\n')+line+'\n';}
set('next_step','Begin Batch09 from 568: author 50 new distinct passages only after re-reading Drive 00/99 and branch HEAD; preserve all v7 chronology, human semantic/question, notes, cross-batch, Chromium/iPhone, A4, and persistent runtime gates before 618 registration.');
fs.writeFileSync(p,s.endsWith('\n')?s:s+'\n');console.log('V11_STATUS_BATCH08_568_UPDATED');
