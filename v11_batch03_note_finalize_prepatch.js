(function prepatchV11Batch03RequiredNotes(){
'use strict';
const ps=[window.V11_BATCH03_DRAFT_G1_PASSAGES,window.V11_BATCH03_DRAFT_G2_PASSAGES,window.V11_BATCH03_DRAFT_G3_PASSAGES].flatMap(x=>Array.isArray(x)?x:[]);
if(ps.length!==50)throw new Error('Batch03 50 passages missing before note prepatch');
const m={different:'違う・異なる',easier:'より簡単な・より楽な',used:'使った・使われた',between:'〜の間に',using:'使うこと・使って',meant:'意味した',hung:'掛けた・つるした',safe:'安全な',thinner:'より薄い',forgotten:'忘れられた・忘れた',four:'4・四つ',without:'〜なしで',gentler:'よりやさしい・より穏やかな',rewrote:'書き直した',easily:'簡単に・容易に'};
let changed=0;
for(const p of ps)for(const n of (p.notes||[])){const k=String(n&&n.english||'').replace(/[’]/g,"'").toLowerCase();if(m[k]&&String(n.japanese||'').includes('最終注整理対象')){n.japanese=m[k];n.source='v11 Batch03 final required-note prepatch';changed++;}}
window.V11_BATCH03_NOTE_PREPATCH_STATE={version:'20260828-v1',count:ps.length,changed};
})();