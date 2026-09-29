/* v11 fixed Yamaguchi-style 100-passage subset overlay. */
(function applyV11Yamaguchi100(){
'use strict';
if(window.V11_YAMAGUCHI_100_READY)return;
const ids=["V11-B07-G3-003","V11-B07-G3-009","V11-B08-G3-003","V11-B08-G3-009","V11-B13-G3-003","V11-B13-G3-009","V11-B14-G3-003","V11-B14-G3-009","V11-B15-G3-003","V11-B15-G3-009","V11-B07-G3-006","V11-B07-G3-014","V11-B08-G3-006","V11-B08-G3-014","V11-B09-G3-004","V11-B09-G3-008","V11-B09-G3-012","V11-B09-G3-016","V11-B10-G3-004","V11-B10-G3-008","V11-B10-G3-012","V11-B10-G3-016","V11-B11-G3-008","V11-B11-G3-012","V11-B11-G3-004","V11-B11-G3-016","V11-B12-G3-004","V11-B12-G3-008","V11-B12-G3-012","V11-B12-G3-016","V11-B13-G3-006","V11-B13-G3-014","V11-B14-G3-006","V11-B14-G3-014","V11-B15-G3-006","V11-B15-G3-014","V11-B07-G3-001","V11-B07-G3-013","V11-B08-G3-007","V11-B08-G3-011","V11-B08-G3-015","V11-B14-G3-001","V11-B14-G3-005","V11-B14-G3-011","V11-B15-G3-001","V11-B07-G3-004","V11-B08-G3-002","V11-B09-G3-002","V11-B09-G3-006","V11-B09-G3-010","V11-B09-G3-014","V11-B10-G3-002","V11-B10-G3-006","V11-B10-G3-010","V11-B10-G3-014","V11-B11-G3-002","V11-B11-G3-006","V11-B11-G3-010","V11-B11-G3-014","V11-B12-G3-002","V11-B12-G3-006","V11-B12-G3-010","V11-B12-G3-014","V11-B13-G3-002","V11-B13-G3-008","V11-B13-G3-012","V11-B13-G3-016","V11-B14-G3-008","V11-B07-G3-016","V11-B07-G3-007","V11-B07-G3-015","V11-B08-G3-005","V11-B08-G3-004","V11-B08-G3-012","V11-B09-G3-001","V11-B09-G3-011","V11-B09-G3-003","V11-B10-G3-013","V11-B10-G3-003","V11-B10-G3-015","V11-B11-G3-013","V11-B11-G3-009","V11-B11-G3-015","V11-B12-G3-005","V11-B12-G3-007","V11-B12-G3-011","V11-B13-G3-013","V11-B13-G3-011","V11-B13-G3-001","V11-B14-G3-013","V11-B14-G3-015","V11-B15-G3-016","V11-B15-G3-012","V11-B15-G3-013","V11-B16-G3-014","V11-B16-G3-004","V11-B16-G3-015","V11-B16-G3-003","V11-B16-G3-005","V11-B16-G3-006"];
if(ids.length!==100||new Set(ids).size!==100)throw new Error('Yamaguchi100 manifest must contain exactly 100 unique IDs');
const selected=new Set(ids);
const all=Object.values(window.V11_EXTRA_PASSAGES||{}).flat();
const found=[];
for(const p of all){
  if(!p||!p.id)continue;
  if(selected.has(String(p.id))){
    p.yamaguchiStyle=true;
    p.yamaguchiSubsetVersion='20260929-y100-r1';
    found.push(String(p.id));
  }
}
if(found.length!==100||new Set(found).size!==100)throw new Error('Yamaguchi100 runtime coverage invalid '+found.length);
window.V11_YAMAGUCHI_100_IDS=ids.slice();
window.V11_YAMAGUCHI_100_STATE={version:'20260929-y100-r1',count:100,found:found.length,registeredTotal:168+Number(window.V11_MULTI_PASSAGE_STATE&&window.V11_MULTI_PASSAGE_STATE.extraPassages||0)};
window.V11_YAMAGUCHI_100_READY=true;
window.dispatchEvent(new Event('v11-passages-updated'));
console.log('[v11 Yamaguchi100] fixed subset ready',window.V11_YAMAGUCHI_100_STATE);
})();
