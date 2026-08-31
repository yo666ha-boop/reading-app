(function(){
'use strict';
const ps=[...(window.V11_BATCH11_G1_DRAFTS||[]),...(window.V11_BATCH11_G2_DRAFTS||[]),...(window.V11_BATCH11_G3_DRAFTS||[])];
if(ps.length!==50)throw Error('Batch11 50 passages missing');
// “単語サポート多め”は通常注に入っていない既習・基本語も補助する。
// 内容語を無理にrequired-localへ昇格させず、正規の日本語glossだけをここで追加する。
const batch11SupportGloss={
  school:'学校',student:'生徒',teacher:'先生',class:'クラス',club:'部・クラブ',time:'時間・時刻',day:'日',week:'週',year:'年',old:'古い',new:'新しい',book:'本',paper:'紙',room:'部屋・教室',water:'水',food:'食べ物',place:'場所',work:'仕事・作業',people:'人々',group:'グループ',name:'名前',date:'日付',plan:'計画・予定',page:'ページ',map:'地図',report:'報告',morning:'朝',afternoon:'午後',weather:'天気',
  cap:'ふた・キャップ',still:'まだ・それでも',tell:'伝える・話す',told:'伝えた・話した',stay:'とどまる・そのままでいる',stayed:'とどまった・そのままだった',through:'〜を通って',third:'3番目の',tomorrow:'明日',runner:'走者',run:'走る',ran:'走った',hot:'暑い・熱い',nearest:'最も近い',saw:'見た',last:'最後の・前の',sometimes:'ときどき',sister:'姉・妹',neither:'どちらも〜ない',wrote:'書いた',top:'上・上部',straight:'まっすぐな・まっすぐに',turn:'向きを変える・曲がる',turned:'向きを変えた・曲がった',little:'少し・小さい',tennis:'テニス',size:'大きさ',far:'遠く・遠い',look:'見る',looking:'見ている',ask:'たずねる',come:'来る',came:'来た',make:'作る',making:'作っている',song:'歌',much:'多くの・ずっと',most:'最も・ほとんど',hour:'1時間',take:'取る・連れて行く',took:'取った・連れて行った',into:'〜の中へ',buy:'買う',buying:'買うこと',anything:'何か・何でも',where:'どこで・〜する場所',how:'どのように・どれくらい',some:'いくつかの・ある',why:'なぜ',mean:'意味する',means:'意味する',less:'より少ない',any:'何か・どの〜も',often:'しばしば',become:'〜になる',rose:'上がった',create:'作り出す',greatest:'最も大きい',dog:'犬',best:'最もよい',design:'設計・デザイン',close:'近い・閉じる',hole:'穴',maker:'作る人・メーカー',product:'製品',beat:'拍・リズム',play:'演奏する・競技する',listen:'聞く',thick:'厚い',volume:'音量',sun:'太陽',right:'正しい・右の',handmade:'手作りの',sell:'売る',sold:'売った・売られた',set:'一組・セット',own:'自分自身の',thing:'物・こと',tag:'札・タグ',front:'前・正面',now:'今',upper:'上の',expensive:'高価な',shower:'にわか雨・シャワー',pen:'ペン',plastic:'プラスチック',face:'面・顔',player:'選手',drink:'飲む・飲み物',break:'休憩・壊す',need:'必要とする',increase:'増える・増やす',probably:'おそらく',sometime:'いつか・ある時',therefore:'したがって',august:'8月',september:'9月',november:'11月',chicken:'鶏肉・にわとり',bean:'豆',say:'言う',ago:'〜前',research:'調べる・研究する',landing:'上陸・着地',active:'活動中の・活発な',connect:'つなぐ',butterfly:'チョウ',balanced:'バランスの取れた',lot:'土地・たくさん',hold:'持つ・収容する',drawing:'図・絵',ground:'地面',children:'子どもたち',apartment:'アパート',perfect:'完全な・最適な',junior:'年下の・中等の',elementary:'初等の・小学校の',home:'家・家庭',sleep:'眠る・睡眠',thousand:'1000',reusable:'再使用できる',want:'欲しい・〜したい',busy:'忙しい',good:'よい',ticket:'切符・券',spend:'使う・過ごす',labor:'労働・作業',cafe:'カフェ',learn:'学ぶ',invite:'招く',invited:'招かれた',experienced:'経験のある',age:'年齢',adjustable:'調節できる',send:'送る',see:'見る',lasted:'続いた',o'clock:'〜時',produce:'農産物・生産する',spent:'使った・過ごした',travel:'移動する・旅行する',depend:'〜による・依存する',answer:'答え・答える',situation:'状況',value:'値・価値',prepare:'準備する',skill:'技能',live:'住む・生きる',watch:'見る・見守る',worked:'働いた・うまくいった',like:'好む・〜のような',whether:'〜かどうか',than:'〜より',who:'だれ・〜する人',which:'どちら・どの',when:'いつ・〜するとき',what:'何・〜すること',also:'〜もまた',more:'より多く・もっと',as:'〜として・〜のように',up:'上へ・上に',down:'下へ・下に',other:'ほかの',then:'そのとき・それから',out:'外へ・外に',its:'それの',few:'少数の',just:'ちょうど・ただ',over:'〜を越えて・〜以上',forward:'前へ',spread:'広がる・広げる'
};
const gloss={...batch11SupportGloss,...(window.V11_BATCH10_PRIOR_VERIFIED_GLOSS||{}),...(window.V11_BATCH10_MANUAL_GLOSS||{}),...(window.V11_BATCH11_MANUAL_GLOSS||{}),...(window.V11_EASY_SUPPORT_DICT||{})};
const norm=w=>String(w||'').toLowerCase().replace(/[’‘]/g,"'").trim();
const tok=s=>(String(s||'').replace(/[’‘]/g,"'").match(/[A-Za-z]+(?:'[A-Za-z]+)*/g)||[]).map(norm);
const stop=new Set(['i','a','an','the','am','is','are','was','were','be','been','being','do','does','did','can','could','will','would','should','must','may','might','have','has','had','to','of','in','on','at','for','from','by','with','and','but','or','so','if','that','this','these','those','it','he','she','we','they','you','my','your','his','her','our','their','me','him','us','them','not','no','yes','too','very']);
function lookup(w){
  if(gloss[w])return{base:w,jp:gloss[w]};
  const c=[];
  if(/'s$/.test(w))c.push(w.slice(0,-2));
  if(/ies$/.test(w))c.push(w.slice(0,-3)+'y');
  if(/ves$/.test(w))c.push(w.slice(0,-3)+'f',w.slice(0,-3)+'fe');
  if(/es$/.test(w))c.push(w.slice(0,-2));
  if(/s$/.test(w)&&w.length>3)c.push(w.slice(0,-1));
  if(/ied$/.test(w))c.push(w.slice(0,-3)+'y');
  if(/ed$/.test(w))c.push(w.slice(0,-2),w.slice(0,-1));
  if(/ing$/.test(w)){c.push(w.slice(0,-3),w.slice(0,-3)+'e');if(w.length>5&&w[w.length-4]===w[w.length-5])c.push(w.slice(0,-4));}
  for(const b of c)if(gloss[b])return{base:b,jp:gloss[b]};
  return null;
}
// 50題すべてを先に計画し、1題でも候補0なら一切書き換えない。
// これにより途中例外で3/40題だけsupportNotesが残る不整合を禁止する。
const planned=new Map(),failures=[];
for(const p of ps){
  const required=new Set((p.notes||[]).map(n=>norm(n&&n.english)));
  const seen=new Set(),out=[];
  for(const w of tok((p.sentences||[]).join(' '))){
    if(stop.has(w)||required.has(w))continue;
    const g=lookup(w);if(!g||required.has(g.base)||seen.has(g.base))continue;
    const jp=String(g.jp||'').trim();
    if(!jp||jp.toLowerCase()===g.base||/placeholder|temporary|最終注整理対象/i.test(jp))continue;
    seen.add(g.base);out.push({english:g.base,japanese:jp,source:'v11 Batch11 verified easy support',support:true});
    if(out.length>=16)break;
  }
  if(!out.length)failures.push(p.id);else planned.set(p.id,out);
}
if(failures.length)throw Error('Batch11 no verified easy support candidate: '+JSON.stringify(failures));
let total=0,min=99,max=0;
for(const p of ps){const out=planned.get(p.id);p.supportNotes=out;p.supportNotesVersion='20260831-b11-r12-atomic-basic-gloss';total+=out.length;min=Math.min(min,out.length);max=Math.max(max,out.length);}
const cloneNotes=v=>(Array.isArray(v)?v:[]).map(n=>({...n}));
const frozenById=new Map(ps.map(p=>[p.id,{supportNotes:cloneNotes(p.supportNotes),supportNotesVersion:p.supportNotesVersion}]));
if(frozenById.size!==50){const ids=ps.map(p=>p&&p.id),dup=[...new Set(ids.filter((id,i)=>ids.indexOf(id)!==i))];throw Error('Batch11 easy support requires 50 unique passage IDs, got '+frozenById.size+' duplicates='+JSON.stringify(dup));}
function exportVerifiedSnapshots(){return [...frozenById.entries()].map(([id,s])=>({id,supportNotes:cloneNotes(s.supportNotes),supportNotesVersion:s.supportNotesVersion}));}
window.V11_GET_BATCH11_VERIFIED_SUPPORT_SNAPSHOTS=exportVerifiedSnapshots;
const protectedObjects=new WeakSet();
function restoreOne(p){
  const src=frozenById.get(p&&p.id);if(!src)return false;
  if(!protectedObjects.has(p)){
    const d=Object.getOwnPropertyDescriptor(p,'supportNotes');
    if(!d||d.configurable!==false){
      let current=cloneNotes(src.supportNotes);
      try{
        Object.defineProperty(p,'supportNotes',{configurable:false,enumerable:true,get(){return cloneNotes(current);},set(v){if(Array.isArray(v)&&v.length){current=cloneNotes(v);}}});
        protectedObjects.add(p);
      }catch(_e){p.supportNotes=cloneNotes(src.supportNotes);}
    }else{try{p.supportNotes=cloneNotes(src.supportNotes);}catch(_e){}protectedObjects.add(p);}
  }else{const now=p.supportNotes;if(!Array.isArray(now)||!now.length){try{p.supportNotes=cloneNotes(src.supportNotes);}catch(_e){}}}
  p.supportNotesVersion=src.supportNotesVersion;
  return Array.isArray(p.supportNotes)&&p.supportNotes.length>0;
}
function restoreRegistry(){let applied=0;for(const arr of Object.values(window.V11_EXTRA_PASSAGES||{}))for(const p of arr||[]){if(restoreOne(p))applied++;}return applied;}
function installChooseGuard(force){
  if(typeof window.choose!=='function')return false;
  const current=window.choose;if(!force&&current.__V11_BATCH11_SUPPORT_GUARD===true)return true;
  const baseChoose=current;const guarded=function(){const p=baseChoose.apply(this,arguments);if(p&&frozenById.has(p.id))restoreOne(p);return p;};
  guarded.__V11_BATCH11_SUPPORT_GUARD=true;guarded.__V11_BATCH11_SUPPORT_BASE=baseChoose;window.choose=guarded;window.__V11_BATCH11_SUPPORT_CHOOSE_GUARD=true;return true;
}
function installRenderGuard(force){
  if(typeof window.render!=='function')return false;
  const current=window.render;if(!force&&current.__V11_BATCH11_SUPPORT_RENDER_GUARD===true)return true;
  const baseRender=current;const guarded=function(){const r=baseRender.apply(this,arguments);restoreRegistry();installChooseGuard(true);return r;};
  guarded.__V11_BATCH11_SUPPORT_RENDER_GUARD=true;guarded.__V11_BATCH11_SUPPORT_RENDER_BASE=baseRender;window.render=guarded;window.__V11_BATCH11_SUPPORT_RENDER_GUARD=true;return true;
}
function keepGuard(){restoreRegistry();if(typeof window.choose==='function'&&window.choose.__V11_BATCH11_SUPPORT_GUARD!==true)installChooseGuard(true);if(typeof window.render==='function'&&window.render.__V11_BATCH11_SUPPORT_RENDER_GUARD!==true)installRenderGuard(true);}
window.V11_APPLY_BATCH11_EASY_SUPPORT_NOTES=function(){const applied=restoreRegistry();installChooseGuard(true);installRenderGuard(true);return{applied,expected:frozenById.size,pass:applied===frozenById.size};};
for(const p of ps)restoreOne(p);
installChooseGuard(false);installRenderGuard(false);
const guardTimer=setInterval(keepGuard,5);window.__V11_BATCH11_SUPPORT_GUARD_TIMER=guardTimer;
window.V11_BATCH11_EASY_SUPPORT_STATE={passages:ps.length,snapshots:frozenById.size,total,min,max,registered:false,replacementObjectGuard:true,authoritativeSnapshotExport:true,curatedFallbackGloss:true,atomicGeneration:true,version:'20260831-b11-r12-atomic-basic-gloss'};
})();
