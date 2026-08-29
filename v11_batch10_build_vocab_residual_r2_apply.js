'use strict';
const fs=require('fs');
const r=JSON.parse(fs.readFileSync('V11_BATCH10_VOCAB_CHRONOLOGY_REPORT.json','utf8'));
const gloss={
 actual:'実際の',check:'確認する',described:'説明した',forgot:'忘れた',helpers:'手伝った人たち',mark:'印',overlook:'見落とす',"pair's":'ペアの',reveal:'明らかにする',sang:'歌った',start:'最初・開始',tests:'テスト・試験',thought:'考えた',unclear:'はっきりしない',
 added:'加えた',became:'〜になった',cause:'原因・引き起こす',caused:'引き起こした',chose:'選んだ',clear:'はっきりした',continue:'続ける',explain:'説明する',explained:'説明した',find:'見つける',foods:'食べ物',kept:'残した・保った',person:'人',ride:'乗る',rule:'規則・ルール',solve:'解決する',stood:'立った',trouble:'問題・困難',wasted:'無駄にした',yet:'まだ'
};
const norm=w=>String(w||'').toLowerCase().replace(/[’‘]/g,"'").trim();
const by={};for(const x of [...(r.unresolved||[]),...(r.future||[])]){const w=norm(x.word);if(!w)continue;if(!gloss[w])throw Error('Missing curated Japanese gloss for '+w);(by[x.id]??=new Set()).add(w);}
const plain={};for(const [id,s] of Object.entries(by))plain[id]=[...s].sort();
const used=[...new Set(Object.values(plain).flat())].sort();
const unused=Object.keys(gloss).filter(w=>!used.includes(w));if(unused.length)throw Error('Unused gloss entries: '+unused.join(','));
const code=`(function applyV11Batch10VocabResidualR2(){\n'use strict';\nconst ps=[...(window.V11_BATCH10_G1_DRAFTS||[]),...(window.V11_BATCH10_G2_DRAFTS||[]),...(window.V11_BATCH10_G3_DRAFTS||[])];if(ps.length!==50)throw Error('Batch10 vocab residual r2 requires 50 passages');\nconst add=${JSON.stringify(plain)};const gloss=${JSON.stringify(gloss)};const norm=w=>String(w||'').toLowerCase().replace(/[’‘]/g,"'").trim();let added=0;\nfor(const p of ps){p.notes=Array.isArray(p.notes)?p.notes:[];const have=new Set(p.notes.filter(Boolean).map(n=>norm(n.english)));for(const w of(add[p.id]||[])){if(have.has(w))continue;const jp=String(gloss[w]||'').trim();if(!jp||jp.toLowerCase()===w)throw Error('Invalid Batch10 r2 gloss '+w);p.notes.push({english:w,japanese:jp,kind:'unlearned_local_required',source:'v11 Batch10 post-grammar chronology residual r2; manually curated Japanese gloss'});have.add(w);added++;}}\nwindow.V11_BATCH10_VOCAB_RESIDUAL_R2_STATE={version:'20260829-r2',passages:ps.length,passageWordPairs:Object.values(add).reduce((n,a)=>n+a.length,0),uniqueWords:Object.keys(gloss).length,notesAdded:added,registered:false};\n})();\n`;
fs.writeFileSync('v11_batch10_vocab_residual_r2_apply.js',code);
fs.writeFileSync('V11_BATCH10_VOCAB_RESIDUAL_R2_APPLY_STATE.json',JSON.stringify({generatedAt:new Date().toISOString(),passages:Object.keys(plain).length,passageWordPairs:Object.values(plain).reduce((n,a)=>n+a.length,0),uniqueWords:used.length,words:used},null,2)+'\n');
console.log(`Batch10 vocab residual r2: passages=${Object.keys(plain).length} pairs=${Object.values(plain).reduce((n,a)=>n+a.length,0)} unique=${used.length}`);
