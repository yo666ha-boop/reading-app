'use strict';

const gloss={
  school:'学校',student:'生徒',students:'生徒たち',teacher:'先生',class:'クラス',club:'部・クラブ',time:'時間・時刻',day:'日',week:'週',year:'年',old:'古い',new:'新しい',book:'本',paper:'紙',room:'部屋・教室',water:'水',food:'食べ物',place:'場所',work:'仕事・作業',people:'人々',group:'グループ',name:'名前',date:'日付',plan:'計画・予定',page:'ページ',map:'地図',report:'報告',morning:'朝',afternoon:'午後',weather:'天気',table:'机・表',door:'扉',light:'明かり・ライト',line:'列・線',check:'確認する',checked:'確認した',before:'〜の前に',after:'〜の後に',first:'最初の',last:'最後の・前の',next:'次の',more:'より多く・もっと',another:'別の・もう一つの',same:'同じ',use:'使う',used:'使った・使われた',find:'見つける',found:'見つけた',help:'助ける',make:'作る',made:'作った・〜にした',change:'変える・変化',changed:'変えた・変わった',problem:'問題',rule:'規則・ルール',safe:'安全な',safety:'安全',together:'一緒に',family:'家族',city:'市・都市',center:'センター・中心',event:'行事・イベント',outside:'外・外側',inside:'内側',near:'〜の近く',later:'後で・より遅く',early:'早く・早い',number:'数・番号',record:'記録・記録する',question:'質問',answer:'答え・答える',need:'必要とする',needed:'必要だった',different:'異なる',information:'情報',important:'重要な',small:'小さい',large:'大きい',high:'高い',low:'低い',right:'右・正しい',left:'左・残った',way:'方法・道',because:'〜なので',during:'〜の間に',while:'〜する間',only:'〜だけ',still:'まだ・それでも',again:'もう一度',well:'よく・うまく',each:'それぞれの',every:'すべての・毎〜',around:'周りに・約',without:'〜なしで',instead:'代わりに',until:'〜まで',between:'〜の間',through:'〜を通って',against:'〜に反対して・〜に接して',keep:'保つ・続ける',kept:'保った・続けた',show:'示す',showed:'示した',asked:'尋ねた',told:'伝えた',looked:'見た',thought:'考えた',decided:'決めた',wanted:'望んだ',learned:'学んだ・分かった',started:'始めた',finished:'終えた',returned:'戻した・返した',arrived:'到着した',continued:'続けた',compared:'比べた',noticed:'気づいた',suggested:'提案した',measured:'測った',important:'重要な',possible:'可能な',actual:'実際の',final:'最終の',local:'地域の',public:'公共の',visitor:'来訪者',visitors:'来訪者たち'
};
const stop=new Set(['a','an','the','i','you','he','she','it','we','they','me','him','her','us','them','my','your','his','our','their','is','am','are','was','were','be','been','being','do','does','did','have','has','had','can','could','will','would','should','may','might','must','to','of','in','on','at','for','from','by','with','and','but','or','so','if','that','this','these','those','not','no','yes','very','too']);
const norm=s=>String(s||'').toLowerCase().replace(/[’‘]/g,"'").trim();
const toks=s=>(String(s||'').replace(/[’‘]/g,"'").match(/[A-Za-z]+(?:'[A-Za-z]+)*/g)||[]).map(norm);
function baseCandidates(w){const c=[w];if(/ies$/.test(w))c.push(w.slice(0,-3)+'y');if(/es$/.test(w))c.push(w.slice(0,-2));if(/s$/.test(w)&&w.length>3)c.push(w.slice(0,-1));if(/ied$/.test(w))c.push(w.slice(0,-3)+'y');if(/ed$/.test(w))c.push(w.slice(0,-2),w.slice(0,-1));if(/ing$/.test(w))c.push(w.slice(0,-3),w.slice(0,-3)+'e');return c;}
module.exports=function applyBatch12EasySupport(candidate){
  const failures=[];let total=0,min=999,max=0;
  for(const p of candidate.passages||[]){
    const required=new Set((p.notes||[]).map(n=>norm(n&&n.english)));
    const seen=new Set(),out=[];
    for(const w of toks(p.body||((p.sentences||[]).join(' ')))){
      if(stop.has(w)||required.has(w))continue;
      let hit=null;for(const b of baseCandidates(w)){if(gloss[b]&&!required.has(b)){hit=b;break;}}
      if(!hit||seen.has(hit))continue;
      seen.add(hit);out.push({english:hit,japanese:gloss[hit],source:'v11 Batch12 curated easy support',support:true});
      if(out.length>=16)break;
    }
    if(out.length<4)failures.push(p.id+': support candidates '+out.length);
    p.supportNotes=out;p.supportNotesVersion='20260901-b12-final-curated-r1';
    total+=out.length;min=Math.min(min,out.length);max=Math.max(max,out.length);
  }
  if(failures.length)throw new Error('Batch12 easy support failures: '+JSON.stringify(failures));
  candidate.easySupport={passages:(candidate.passages||[]).length,total,min,max,version:'20260901-b12-final-curated-r1'};
  return candidate;
};
