(function(){'use strict';
const ps=[...(window.V11_BATCH09_G1_DRAFTS||[]),...(window.V11_BATCH09_G2_DRAFTS||[]),...(window.V11_BATCH09_G3_DRAFTS||[])];
if(ps.length!==50)throw Error('Batch09 50 passages missing');
const byId={
'V11-B09-G1-002':{'keep':'保つ・〜の状態にしておく','away':'離れて・近づかないで'},
'V11-B09-G1-004':{'bright':'明るい','clearly':'はっきりと','alone':'一人で・単独で'},
'V11-B09-G1-005':{'received':'受け取った'},
'V11-B09-G1-006':{'label':'ラベル・表示','purpose':'目的','clear':'明確な・分かりやすい',"sign's":'標識の'},
'V11-B09-G1-008':{'someone':'だれか'},
'V11-B09-G1-009':{'possibilities':'可能性・考えられる選択肢'},
'V11-B09-G1-011':{"workshop's":'講習会の・作業場の'},
'V11-B09-G2-003':{'responding':'応答すること・対応すること'},
'V11-B09-G2-011':{'direct':'直接の・直接的な','comparison':'比較'},
'V11-B09-G2-012':{'possibly':'ひょっとすると・可能性として'},
'V11-B09-G2-017':{'frequent':'頻繁な'}
};
let added=0;
for(const p of ps){const add=byId[p.id];if(!add)continue;p.notes=Array.isArray(p.notes)?p.notes:[];const have=new Set(p.notes.filter(Boolean).map(n=>String(n.english||'').toLowerCase().replace(/[’‘]/g,"'").trim()));for(const [english,japanese] of Object.entries(add)){if(!have.has(english)){p.notes.push({english,japanese,kind:'unlearned_local_required',source:'v11 Batch09 chronology residual r3; content-required exact-form gloss'});have.add(english);added++;}}}
window.V11_BATCH09_CHRONOLOGY_RESIDUAL_R3_STATE={version:'20260829-r3',passages:ps.length,added,registered:false};
})();
