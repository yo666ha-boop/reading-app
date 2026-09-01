'use strict';
const fs=require('fs');
const build=require('./v11_batch13_build_final_candidate.js');

function die(m){throw new Error(m);}

function seg(locale,text){
  const raw=[...new Intl.Segmenter(locale,{granularity:'sentence'}).segment(String(text||''))]
    .map(x=>x.segment.trim()).filter(Boolean);
  const out=[];
  for(const s0 of raw){
    let s=s0.trim();
    // Intl.Segmenter can occasionally leave a Japanese closing quote as its own
    // fragment.  A quote-only fragment can never be a semantic sentence, so it
    // belongs to the immediately preceding sentence.
    if(locale==='ja' && /^[」』”’）\]】〉》]+$/.test(s) && out.length){
      out[out.length-1]+=s;
      continue;
    }
    // Likewise, do not start a new Japanese sentence with closing punctuation.
    if(locale==='ja' && /^[」』”’）\]】〉》]/.test(s) && out.length){
      const m=s.match(/^([」』”’）\]】〉》]+)/);
      out[out.length-1]+=m[1];
      s=s.slice(m[1].length).trim();
      if(!s) continue;
    }
    out.push(s);
  }
  return out;
}

function normLen(s){return String(s).replace(/\s+/g,'').length;}
function anchors(s){
  const x=String(s);
  const vals=[];
  for(const m of x.matchAll(/\b\d{1,2}:\d{2}\b|\b\d+(?:\.\d+)?(?:%|円|人|分|時|月|日|年)?\b|[A-Za-z][A-Za-z0-9-]{1,}/g)) vals.push(m[0].toLowerCase());
  return [...new Set(vals)];
}
function anchorPenalty(a,b){
  const A=anchors(a),B=anchors(b);
  if(!A.length&&!B.length) return 0;
  const SA=new Set(A),SB=new Set(B);
  let miss=0,hit=0;
  for(const x of SA) SB.has(x)?hit++:miss++;
  for(const x of SB) if(!SA.has(x)) miss++;
  // exact shared numeric/Latin anchors are powerful evidence; mismatches are a
  // strong warning but not an automatic exception because Japanese may spell a
  // name phonetically.
  return Math.max(-0.6, miss*0.32-hit*0.38);
}
function quoteShape(s){
  const x=String(s);
  return /["“”「」『』]/.test(x)?1:0;
}
function score(a,b,posPenalty){
  const x=normLen(a),y=normLen(b);
  if(!x||!y)return 99;
  const r=x/y;
  const len=Math.abs(Math.log(r/0.42));
  const q=quoteShape(a)===quoteShape(b)?0:0.28;
  return len+anchorPenalty(a,b)+q+posPenalty;
}

function align(en,jp,id){
  const n=en.length,m=jp.length,INF=1e9;
  if(Math.abs(n-m)>Math.max(5,Math.ceil(Math.max(n,m)*0.35))) die(`sentence-count gap too large ${id} en=${n} jp=${m}`);
  // Critical fail-closed rule: use ONLY the grouping direction required by the
  // actual count difference.  Allowing both 1:2 and 2:1 lets a length-only DP
  // create compensating reciprocal groups and silently drift out of semantic
  // alignment (observed in the first Batch13 packet).
  const moves=n===m?[[1,1]]:(n>m?[[1,1],[2,1]]:[[1,1],[1,2]]);
  const requiredGroups=Math.abs(n-m);
  const dp=Array.from({length:n+1},()=>Array(m+1).fill(INF));
  const prev=Array.from({length:n+1},()=>Array(m+1).fill(null));
  dp[0][0]=0;
  for(let i=0;i<=n;i++) for(let j=0;j<=m;j++){
    if(dp[i][j]>=INF) continue;
    for(const [a,b] of moves){
      if(i+a>n||j+b>m) continue;
      const es=en.slice(i,i+a).join(' '),js=jp.slice(j,j+b).join('');
      const pEn=(i+a/2)/n,pJp=(j+b/2)/m;
      const position=Math.abs(pEn-pJp)*0.8;
      const grouping=(a===1&&b===1)?0:0.28;
      const penalty=grouping+score(es,js,position);
      const v=dp[i][j]+penalty;
      if(v<dp[i+a][j+b]){dp[i+a][j+b]=v;prev[i+a][j+b]=[i,j,a,b,penalty];}
    }
  }
  if(!prev[n][m])die(`unalignable ${id} en=${n} jp=${m}`);
  const rows=[];let i=n,j=m;
  while(i||j){
    const p=prev[i][j];if(!p)die(`alignment backtrack ${id}`);
    const [pi,pj,a,b,penalty]=p;
    rows.push({en:en.slice(pi,i).join(' '),jp:jp.slice(pj,j).join(''),enSentenceCount:a,jpSentenceCount:b,alignmentScore:Number(penalty.toFixed(4)),humanReviewed:false});
    i=pi;j=pj;
  }
  rows.reverse();
  const grouped=rows.filter(r=>r.enSentenceCount!==1||r.jpSentenceCount!==1);
  if(grouped.length!==requiredGroups) die(`non-minimal grouping ${id} required=${requiredGroups} got=${grouped.length}`);
  if(rows.some(r=>r.enSentenceCount>2||r.jpSentenceCount>2||(r.enSentenceCount===2&&r.jpSentenceCount===2))) die(`illegal grouping ${id}`);
  if(n>m && rows.some(r=>r.jpSentenceCount!==1)) die(`wrong-direction grouping ${id}`);
  if(m>n && rows.some(r=>r.enSentenceCount!==1)) die(`wrong-direction grouping ${id}`);
  return rows;
}

// This is deliberately only a review aid.  It is never promoted to slashRows
// without human reading.  Avoid splitting tiny trailing particles such as
// "right after ..." merely because a generic conjunction appears.
function chunk(s){
  return String(s)
    .replace(/([;:]\s+)/g,'$1/ ')
    .replace(/,\s+(because|when|while|after|before|if|but|so)\s+/gi,', / $1 ')
    .replace(/\s+(because|when|while|if)\s+/gi,' / $1 ')
    .replace(/\s+\/\s+\/\s+/g,' / ')
    .trim();
}

const c=build();
const packet={batch:'V11-B13',registered:false,officialTotal:768,humanReviewed:false,policy:{allowedAlignment:['1:1','1:2','2:1'],forbid:['2:2','reciprocal-compensating-grouping','partial-registration','auto-human-pass'],note:'alignment is a fail-closed review candidate only; every row and slash boundary must be human-read before PASS'},passages:[]};
let rows=0,groups11=0,groups12=0,groups21=0;
for(const p of c.passages){
  const ens=seg('en',p.body),jps=seg('ja',p.fullTranslation);
  const aligned=align(ens,jps,p.id);
  for(const r of aligned){
    r.suggestedEn=chunk(r.en);r.suggestedJp=r.jp;
    if(r.enSentenceCount===1&&r.jpSentenceCount===1) groups11++;
    else if(r.enSentenceCount===1&&r.jpSentenceCount===2) groups12++;
    else if(r.enSentenceCount===2&&r.jpSentenceCount===1) groups21++;
  }
  rows+=aligned.length;
  packet.passages.push({id:p.id,englishSentenceCount:ens.length,japaneseSentenceCount:jps.length,rows:aligned});
}
packet.summary={passages:packet.passages.length,rows,groups11,groups12,groups21,allHumanReviewed:false};
if(packet.passages.length!==50)die('passage count');
fs.writeFileSync('v11_batch13_slash_review_packet.json',JSON.stringify(packet,null,2));
console.log(JSON.stringify(packet.summary));
