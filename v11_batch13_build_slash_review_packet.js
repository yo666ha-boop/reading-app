'use strict';
const fs=require('fs');
const build=require('./v11_batch13_build_final_candidate.js');
function die(m){throw new Error(m);}
function segEn(text){return [...new Intl.Segmenter('en',{granularity:'sentence'}).segment(String(text||''))].map(x=>x.segment.trim()).filter(Boolean);}
function segJa(text){
  // Japanese full translations are authored with Japanese terminal punctuation.
  // Split ONLY on 。！？ so Latin abbreviations/initials such as M.K. and quoted
  // labels such as 「Morning」 cannot create fake sentence boundaries.
  const s=String(text||'').trim(),out=[];let buf='';
  for(let i=0;i<s.length;i++){
    buf+=s[i];
    if(/[。！？]/.test(s[i])){
      while(i+1<s.length && /[」』”’）\]】〉》]/.test(s[i+1])) buf+=s[++i];
      if(buf.trim()) out.push(buf.trim());
      buf='';
    }
  }
  if(buf.trim()) out.push(buf.trim());
  return out;
}
function normLen(s){return String(s).replace(/\s+/g,'').length;}
function anchors(s){const x=String(s),v=[];for(const m of x.matchAll(/\b\d{1,2}:\d{2}\b|\b\d+(?:\.\d+)?(?:%|円|人|分|時|月|日|年)?\b|[A-Za-z][A-Za-z0-9.-]{1,}/g))v.push(m[0].toLowerCase());return [...new Set(v)];}
function anchorPenalty(a,b){const A=anchors(a),B=anchors(b);if(!A.length&&!B.length)return 0;const SA=new Set(A),SB=new Set(B);let miss=0,hit=0;for(const x of SA)SB.has(x)?hit++:miss++;for(const x of SB)if(!SA.has(x))miss++;return Math.max(-0.6,miss*.32-hit*.38);}
function quoteShape(s){return /["“”「」『』]/.test(String(s))?1:0;}
function score(a,b,pos){const x=normLen(a),y=normLen(b);if(!x||!y)return 99;return Math.abs(Math.log((x/y)/.42))+anchorPenalty(a,b)+(quoteShape(a)===quoteShape(b)?0:.28)+pos;}
function align(en,jp,id){
  const n=en.length,m=jp.length,INF=1e9;if(Math.abs(n-m)>Math.max(5,Math.ceil(Math.max(n,m)*.35)))die(`sentence-count gap too large ${id} en=${n} jp=${m}`);
  const moves=n===m?[[1,1]]:(n>m?[[1,1],[2,1]]:[[1,1],[1,2]]),req=Math.abs(n-m);
  const dp=Array.from({length:n+1},()=>Array(m+1).fill(INF)),prev=Array.from({length:n+1},()=>Array(m+1).fill(null));dp[0][0]=0;
  for(let i=0;i<=n;i++)for(let j=0;j<=m;j++){if(dp[i][j]>=INF)continue;for(const [a,b] of moves){if(i+a>n||j+b>m)continue;const es=en.slice(i,i+a).join(' '),js=jp.slice(j,j+b).join(''),pos=Math.abs((i+a/2)/n-(j+b/2)/m)*.8,pen=(a===1&&b===1?0:.28)+score(es,js,pos),v=dp[i][j]+pen;if(v<dp[i+a][j+b]){dp[i+a][j+b]=v;prev[i+a][j+b]=[i,j,a,b,pen];}}}
  if(!prev[n][m])die(`unalignable ${id} en=${n} jp=${m}`);const rows=[];let i=n,j=m;while(i||j){const p=prev[i][j];if(!p)die(`alignment backtrack ${id}`);const[pi,pj,a,b,pen]=p;rows.push({en:en.slice(pi,i).join(' '),jp:jp.slice(pj,j).join(''),enSentenceCount:a,jpSentenceCount:b,alignmentScore:+pen.toFixed(4),humanReviewed:false});i=pi;j=pj;}rows.reverse();
  const grouped=rows.filter(r=>r.enSentenceCount!==1||r.jpSentenceCount!==1);if(grouped.length!==req)die(`non-minimal grouping ${id} required=${req} got=${grouped.length}`);if(rows.some(r=>r.enSentenceCount>2||r.jpSentenceCount>2||(r.enSentenceCount===2&&r.jpSentenceCount===2)))die(`illegal grouping ${id}`);if(n>m&&rows.some(r=>r.jpSentenceCount!==1))die(`wrong-direction grouping ${id}`);if(m>n&&rows.some(r=>r.enSentenceCount!==1))die(`wrong-direction grouping ${id}`);return rows;
}
function chunk(s){return String(s).replace(/([;:]\s+)/g,'$1/ ').replace(/,\s+(because|when|while|after|before|if|but|so)\s+/gi,', / $1 ').replace(/\s+(because|when|while|if)\s+/gi,' / $1 ').replace(/\s+\/\s+\/\s+/g,' / ').trim();}
const c=build(),packet={batch:'V11-B13',registered:false,officialTotal:768,humanReviewed:false,policy:{allowedAlignment:['1:1','1:2','2:1'],forbid:['2:2','reciprocal-compensating-grouping','partial-registration','auto-human-pass'],note:'alignment is a fail-closed review candidate only; every row and slash boundary must be human-read before PASS'},passages:[]};let rows=0,groups11=0,groups12=0,groups21=0;
for(const p of c.passages){const ens=segEn(p.body),jps=segJa(p.fullTranslation),aligned=align(ens,jps,p.id);for(const r of aligned){r.suggestedEn=chunk(r.en);r.suggestedJp=r.jp;if(r.enSentenceCount===1&&r.jpSentenceCount===1)groups11++;else if(r.enSentenceCount===1)groups12++;else groups21++;}rows+=aligned.length;packet.passages.push({id:p.id,englishSentenceCount:ens.length,japaneseSentenceCount:jps.length,rows:aligned});}
packet.summary={passages:packet.passages.length,rows,groups11,groups12,groups21,allHumanReviewed:false};if(packet.passages.length!==50)die('passage count');fs.writeFileSync('v11_batch13_slash_review_packet.json',JSON.stringify(packet,null,2));console.log(JSON.stringify(packet.summary));
