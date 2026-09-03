const fs=require('fs');
const path='v11_batch12_assembled_draft.json';
const src=require('./'+path);
if(src.registered!==false||src.passages.length!==50||src.humanReviewedCount!==50) throw new Error('expected reviewed unregistered Batch12 50');
function patch(id,from,to){const p=src.passages.find(x=>x.id===id);if(!p)throw new Error('missing '+id);if(!p.fullTranslation.includes(from))throw new Error(id+' expected translation fragment not found');p.fullTranslation=p.fullTranslation.replace(from,to);p.slashBoundaryRepair='HUMAN_R3_APPLIED';}
patch('V11-B12-G3-011',
'ただし、そのカップがこのケーキに使われたとは証明できません。そこでサキは歴史記録を確定事項のように書き換えず、展示では二つの可能な分量を示し、その違いがなぜ重要か説明しました。博物館は二種類の小さな試作ケーキを焼き、来館者に比べてもらいました。',
'ただし、そのカップがこのケーキに使われたとは証明できなかったため、サキは歴史記録を確定事項のように書き換えませんでした。代わりに展示では二つの可能な分量を示し、その違いがなぜ重要か説明しました。博物館は二種類の小さな試作ケーキを焼き、来館者に比べてもらいました。');
patch('V11-B12-G3-012',
'午前は9時から12時、午後は13時から16時で、ボランティアは開始15分前に到着しなければなりません。また両方の時間帯で働く人は45分の昼食休憩が必要です。準備室は東が8人、西が5人までで、必要人数は午前10人、午後11人でした。',
'午前は9時から12時、午後は13時から16時です。ボランティアは開始15分前に到着しなければならず、両方の時間帯で働く人は45分の昼食休憩が必要です。準備室は東が8人、西が5人までです。必要人数は午前10人、午後11人でした。');
patch('V11-B12-G3-016',
'スタッフはまず全活動をAホールへ移そうとしましたが、95人は定員80人を超えます。',
'スタッフはまず全活動をAホールへ移そうとしました。それなら寒さの問題は解決できますが、95人は定員80人を超えます。');
patch('V11-B12-G3-004',
'15時30分の便も便利に見えましたが、14時以降は強風が予想され、欠航の可能性がありました。そこで学校に通常のホームルーム前に出発する許可を求め、8時10分の往路と13時40分の復路を選びました。',
'15時30分の便も便利に見えましたが、14時以降は強風が予想され、欠航の可能性がありました。一日の中で最も不確かな便に頼る計画にはしたくありませんでした。そこで学校に通常のホームルーム前に出発する許可を求め、8時10分の往路と13時40分の復路を選びました。');
patch('V11-B12-G3-004',
'一つの時刻表だけでは答えは出ず、移動時間、診療所の条件、天候、帰りのバスを結びつけて初めて実行可能な計画になりました。',
'一つの時刻表だけでは答えは出ませんでした。移動時間、診療所の条件、天候、帰りのバスを結びつけて初めて実行可能な計画になりました。');
src.slashBoundaryRepairRound='R3_HUMAN_TRANSLATION_BOUNDARY_SYNC';
src.slashBoundaryRepairIds=['V11-B12-G3-004','V11-B12-G3-011','V11-B12-G3-012','V11-B12-G3-016'];
fs.writeFileSync(path,JSON.stringify(src,null,2)+'\n');
console.log(JSON.stringify({repaired:src.slashBoundaryRepairIds,registered:src.registered,humanReviewedCount:src.humanReviewedCount},null,2));