(function(){'use strict';function words(s){return(String(s||'').match(/[A-Za-z]+(?:['’][A-Za-z]+)?/g)||[]).length}const all=[...(window.V11_BATCH11_G1_DRAFTS||[]),...(window.V11_BATCH11_G2_DRAFTS||[]),...(window.V11_BATCH11_G3_DRAFTS||[])],by=id=>all.find(p=>p.id===id);function patch(id,i,en,jp){const p=by(id);if(!p)throw new Error('missing '+id);const oe=p.sentences[i],oj=p.slashRows[i].jp;p.sentences[i]=en;p.slashRows[i]={en,jp};p.fullTranslation=p.slashRows.map(r=>r.jp).join('');for(const q of [...p.questions,...p.questionSetB]){if(q.evidence===oe)q.evidence=en;else if(Array.isArray(q.evidence))q.evidence=q.evidence.map(x=>x===oe?en:x);if(q.evidenceJp===oj)q.evidenceJp=jp;}p.wordCount=words(p.sentences.join(' '));}
patch('V11-B11-G1-001',1,'At home, a yellow slip fell from the book.','家で開くと、本から黄色い貸出票が落ちました。');
patch('V11-B11-G1-002',1,'The morning group watered them and marked Monday on the care sheet.','朝の班は水をやり、世話の表の月曜日に印を付けました。');
patch('V11-B11-G1-005',2,'The old lunch list still showed thirty-two students.','古い給食表はまだ三十二人のままでした。');
patch('V11-B11-G1-006',0,'Haruto left his project notebook open while carrying books.','陽斗は本を運ぶ間、調べ学習ノートを開いたままにしました。');
patch('V11-B11-G1-010',3,'During art, four pencil cases were together on one table.','美術の時間、四人分の筆箱が一つの机に置かれていました。');
patch('V11-B11-G3-002',12,'The group found monthly maintenance was not enough during the first summer.','グループは、最初の夏は月一回の管理では足りないと分かりました。');
patch('V11-B11-G3-006',14,'Teachers warned that the volunteer group might differ from all students.','先生は、希望者集団が全生徒と異なる可能性を指摘しました。');
patch('V11-B11-G3-010',10,'Missing cups still mattered because replacements used money and resources.','未返却カップは交換に費用と資源が必要なため問題でした。');
patch('V11-B11-G3-014',15,'Feedback supported learning, but visitors wanted clearer information before bringing heavy items.','感想では学習への支持があり、重い物を運ぶ前の明確な情報も求められました。');
patch('V11-B11-G3-012',15,'Tomatoes and carrots for C could wait in the covered loading area.','C用のトマトとニンジンは屋根付き積込所で待機できました。');
patch('V11-B11-G3-016',23,'The school did not call the day risk-free just because the revised plan worked.','修正版が機能しただけで、学校はその日を危険ゼロとはしませんでした。');
window.V11_BATCH11_LENGTH_REPAIR_R2_STATE={patched:11,counts:Object.fromEntries(all.map(p=>[p.id,p.wordCount])),registered:false,version:'20260829-r2'};})();