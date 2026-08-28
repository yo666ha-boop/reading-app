(function repairV11Batch07GrammarR3(){
'use strict';
const groups=[window.V11_BATCH07_G1_DRAFTS||[],window.V11_BATCH07_G2_DRAFTS||[],window.V11_BATCH07_STANDARD_DRAFTS||[],window.V11_BATCH07_LONG_DRAFTS||[],window.V11_BATCH07_YAMAGUCHI_EXAM_DRAFTS||[]];
const ps=groups.flat(), find=id=>ps.find(p=>p.id===id), norm=s=>String(s||'').replace(/[’‘]/g,"'").replace(/[“”]/g,'"');
function fields(id,a,b){const p=find(id);if(!p)return;for(const q of [...(p.questions||[]),...(p.questionSetB||[]),p.freeWriteTask||{}])for(const k of ['prompt','answer','reason','modelAnswer'])if(typeof q[k]==='string')q[k]=q[k].split(a).join(b);}
function row(id,a,b,j){const p=find(id);if(!p)throw Error('missing '+id);const i=p.sentences.findIndex(x=>norm(x)===norm(a));if(i<0)throw Error('missing row '+id+' '+a);const old=p.sentences[i];p.sentences[i]=b;p.slashRows[i]={en:b,jp:j};for(const q of [...p.questions,...p.questionSetB]){if(typeof q.evidence==='string'&&norm(q.evidence)===norm(old)){q.evidence=b;q.evidenceJp=j;}if(Array.isArray(q.evidence)){const before=q.evidence.slice();q.evidence=q.evidence.map(x=>norm(x)===norm(old)?b:x);if(Array.isArray(q.evidenceJp))q.evidenceJp=q.evidenceJp.map((x,k)=>norm(before[k])===norm(old)?j:x);}}}
fields('V11-B07-G1-001','That clue gave them one more name to check.','That clue showed one more name to check.');
fields('V11-B07-G1-002','She could not come.','She was not coming.');
row('V11-B07-G1-003','The note belonged to her, and she smiled when it came back.','The note belonged to her. It came back, and she smiled.','そのメモは彼女のものでした。メモが戻り、彼女は笑顔になりました。');
fields('V11-B07-G1-006','The first paper showed that the job had already been decided.','The first paper showed the earlier job choice.');
fields('V11-B07-G1-006','The name was _____ when the clean copy was written.','The writer _____ the name on the clean copy.');
row('V11-B07-G1-008','For Leo, the long route was easy to remember, and it worked well.','Leo remembered the long route well, and it worked for him.','レオは長い方の道をよく覚えられ、その道は彼に合っていました。');
fields('V11-B07-G1-008','He could reach the gym without help.','He reached the gym without help.');
fields('V11-B07-G1-017','The largest paper used two clips.','The big paper used two clips.');
row('V11-B07-G2-002','The club moved one reminder sign to the stairs. Students used those stairs after lunch.','The club moved one reminder sign to the stairs. After lunch, many students went up those stairs.','部は一つの案内表示を階段へ移しました。昼食後、多くの生徒がその階段を上りました。');
fields('V11-B07-G3-013','That small detail made us question our first guess.','That small detail changed our first guess.');
for(const p of ps){p.fullTranslation=(p.slashRows||[]).map(r=>r.jp).join('');p.wordCount=((p.sentences||[]).join(' ').match(/[A-Za-z]+(?:['’][A-Za-z]+)?/g)||[]).length;}
window.V11_BATCH07_GRAMMAR_REPAIR_R3_STATE={version:'20260829',passages:ps.length};
})();
