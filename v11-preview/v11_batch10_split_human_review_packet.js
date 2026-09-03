'use strict';
const fs=require('fs');
const src=fs.readFileSync('V11_BATCH10_HUMAN_REVIEW_PACKET.md','utf8');
const parts=src.split(/(?=^## V11-B10-)/m).filter(x=>/^## V11-B10-/m.test(x));
if(parts.length!==50)throw Error('expected 50 review parts got '+parts.length);
fs.mkdirSync('V11_BATCH10_REVIEW_PASSAGES',{recursive:true});
for(const part of parts){const m=part.match(/^## (V11-B10-[A-Z0-9-]+)/m);if(!m)throw Error('missing id');fs.writeFileSync(`V11_BATCH10_REVIEW_PASSAGES/${m[1]}.md`,part);}
console.log('split review passages='+parts.length);
