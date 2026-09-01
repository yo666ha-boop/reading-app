'use strict';
const replacements=[
["Emi first moved the cart into the aisle, and that made people walk around it.","Emi first moved the cart into the aisle, so people walked around it."],
["He did not bring a new chair immediately because he first thought someone moved one.","He did not bring a new chair immediately; he first thought someone moved one."],
["one might simply have been moved の one は何を指しますか。","he first thought someone moved one の one は何を指しますか。"]
];
function walk(x,counts){if(typeof x==='string'){let s=x;for(let i=0;i<replacements.length;i++){const[a,b]=replacements[i];if(s.includes(a)){const n=s.split(a).length-1;s=s.split(a).join(b);counts[i]+=n;}}return s;}if(Array.isArray(x))return x.map(v=>walk(v,counts));if(x&&typeof x==='object'){for(const k of Object.keys(x))x[k]=walk(x[k],counts);return x;}return x;}
module.exports=function(candidate){const counts=Array(replacements.length).fill(0);walk(candidate,counts);if(counts.some(n=>n===0))throw Error('Batch12 grammar R2 source missing '+JSON.stringify(counts));for(const p of candidate.passages||[])p.wordCount=(String(p.body||'').match(/[A-Za-z]+(?:'[A-Za-z]+)*/g)||[]).length;candidate.grammarRepairR2={counts,registered:false};return candidate;};
