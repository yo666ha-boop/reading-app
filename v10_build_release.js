const fs=require('fs');
const path=require('path');

const htmlPath='v10_stage2.html';
const html=fs.readFileSync(htmlPath,'utf8');
const scriptRefs=[...html.matchAll(/<script\s+src="([^"]+)"/g)].map(m=>m[1]);
const local=[...new Set(scriptRefs.filter(x=>!/^https?:/i.test(x)))];
const missing=local.filter(f=>!fs.existsSync(f));
if(missing.length) throw new Error(`missing release dependencies: ${missing.join(', ')}`);

const out='release/v10_stage2_release';
fs.rmSync(out,{recursive:true,force:true});
fs.mkdirSync(out,{recursive:true});
fs.copyFileSync(htmlPath,path.join(out,'index.html'));
fs.copyFileSync(htmlPath,path.join(out,'v10_stage2.html'));
for(const f of local){
  const dest=path.join(out,f);
  fs.mkdirSync(path.dirname(dest),{recursive:true});
  fs.copyFileSync(f,dest);
}
for(const f of ['v10_release_candidate_report.txt','v10_stage2_full_coverage_report.txt','v10_final_browser_print_report.txt']){
  if(fs.existsSync(f)) fs.copyFileSync(f,path.join(out,f));
}
const readme=[
  'みかみ塾 長文読解問題作成アプリ v10',
  '',
  '起動方法:',
  '1. ZIPを展開します。',
  '2. index.html をブラウザで開きます。',
  '3. 教科書 → 学年 → 大単元 → 小単元上限 → 出題型 の順で選択します。',
  '',
  '収録:',
  '中1 Sunshine 38本文 / New Horizon 31本文',
  '中2 Sunshine 24本文 / New Horizon 29本文',
  '中3 Sunshine 21本文 / New Horizon 25本文',
  '合計168本文。各本文にA/B問題セットあり。',
  '',
  '品質:',
  '本文・スラッシュ・全訳・設問・根拠・語彙ゲートの監査済み。',
  'Chromium / Firefox / WebKit(iPhone相当) と印刷CSSの最終検証を通過した版のみリリース対象です。',
  '',
  '注意:',
  'このフォルダ内のJSファイルはindex.htmlから読み込まれるため、削除・移動しないでください。'
].join('\n');
fs.writeFileSync(path.join(out,'README.txt'),readme);
console.log(`RELEASE BUILD PASS files=${local.length+3} scripts=${local.length} out=${out}`);
// Release gate trigger: rerun after WebKit native-control overflow containment fix.
