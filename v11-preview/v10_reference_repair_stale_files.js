const fs=require('fs');
function writeIfChanged(file,next){const old=fs.readFileSync(file,'utf8');if(old!==next){fs.writeFileSync(file,next);console.log('UPDATED '+file);return true}console.log('UNCHANGED '+file);return false}
let changed=false;
{
 const f='v10_reference_slash_manual_051_060.js';let s=fs.readFileSync(f,'utf8');
 const replacement=`setAudit(d,'Unit 5-2',[\n  {en:'This is his blog.',jp:'これは彼のブログです。'},\n  {en:'The blog is / about his life.',jp:'そのブログは〜です / 彼の生活について'},\n  {en:'He has a beautiful dolphin picture there.',jp:'彼はそこに美しいイルカの写真を持っています。'},\n  {en:'Does he like the picture?',jp:'彼はその写真が好きですか。'},\n  {en:'Yes, / he does.',jp:'はい / 好きです'},\n  {en:'The dolphin is / in the water.',jp:'そのイルカはいます / 水の中に'},\n  {en:'He can swim.',jp:'彼は泳ぐことができます。'},\n  {en:'He doesn’t surf.',jp:'彼はサーフィンをしません。'},\n  {en:'Does he write / about the dolphin?',jp:'彼は書きますか / そのイルカについて'},\n  {en:'Yes, / he does.',jp:'はい / 書きます'},\n  {en:'The picture is very beautiful.',jp:'その写真はとても美しいです。'},\n  {en:'The blog is interesting.',jp:'そのブログはおもしろいです。'}\n ],53);`;
 const re=/setAudit\(d,'Unit 5-2',\[[\s\S]*?\],53\);/;
 if(!re.test(s))throw new Error('Unit 5-2 block not found in '+f);s=s.replace(re,replacement);changed=writeIfChanged(f,s)||changed;
}
{
 const f='v10_reference_slash_manual_141_150.js';let s=fs.readFileSync(f,'utf8');
 const reps=[
  ["{en:'Probably, / the project can help other patients, / too.',jp:'おそらく / このプロジェクトはほかの患者を助けられます / 〜もまた'}","{en:'Probably, / the project can help other patients too.',jp:'おそらく / このプロジェクトはほかの患者も助けられます'}"],
  ["{en:'My friend has been / to Kyoto, / too.',jp:'友達も行ったことがあります / 京都に / 〜もまた'}","{en:'My friend has been / to Kyoto too.',jp:'友達も行ったことがあります / 京都にも'}"],
  ["{en:'I have never been there, / either.',jp:'私もそこへ行ったことがありません / 〜もまた'}","{en:'I have never been there either.',jp:'私もそこへ行ったことがありません。'}"]
 ];
 for(const[a,b]of reps){if(!s.includes(a))console.log('ALREADY_OR_NOT_FOUND '+a.slice(0,60));else s=s.replace(a,b)}
 changed=writeIfChanged(f,s)||changed;
}
{
 const f='v10_interaction_metadata.js';let s=fs.readFileSync(f,'utf8');
 const anchor="  ['v10_reference_slash_manual_999_recovery.js',()=>({})]";
 if(!s.includes("v10_reference_slash_manual_zz_corrections.js")){
   if(!s.includes(anchor))throw new Error('loader anchor missing');
   s=s.replace(anchor,anchor+",\n  ['v10_reference_slash_manual_zz_corrections.js',()=>({})]");
 }
 changed=writeIfChanged(f,s)||changed;
}
console.log(changed?'REFERENCE STALE REPAIR CHANGED':'REFERENCE STALE REPAIR NOOP');
