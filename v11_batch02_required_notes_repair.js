(function addV11Batch02RequiredNotes(){
'use strict';
const ps=window.V11_BATCH02_DRAFT_PASSAGES;
if(!Array.isArray(ps)||ps.length!==50)throw new Error('Batch02 draft missing before required-note repair');
const gloss={movie:'映画',theater:'劇場',interesting:'おもしろい',together:'いっしょに',trash:'ごみ',technology:'技術',talk:'話す',talked:'話した',box:'箱',think:'考える',hope:'願う',tired:'疲れた',sleepy:'眠い',life:'生活・人生',badge:'バッジ',album:'アルバム',contest:'コンクール',beat:'鼓動する',safe:'安全な',chorus:'合唱',water:'水',fold:'折る'};
function tokens(s){return new Set((String(s||'').toLowerCase().match(/[a-z]+(?:'[a-z]+)*/g)||[]));}
let added=0;
for(const p of ps){
 const body=tokens((p.sentences||[]).join(' '));
 p.notes=Array.isArray(p.notes)?p.notes:[];
 const have=new Set(p.notes.map(n=>String(n&&n.english||'').toLowerCase()));
 for(const [english,japanese] of Object.entries(gloss)){
  if(body.has(english)&&!have.has(english)){
   p.notes.push({english,japanese,kind:'unlearned_local_required',source:'v11 Batch02 audited same-unit chronology repair'});
   have.add(english);added++;
  }
 }
}
window.V11_BATCH02_REQUIRED_NOTES_REPAIR_STATE={version:'20260828-pass1',count:ps.length,added,registered:false};
})();