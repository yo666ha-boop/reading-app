const fs=require('fs');
const files=['V11_BATCH16_BODY_TRANSLATION_DRAFT_G1_001_010.json','V11_BATCH16_BODY_TRANSLATION_DRAFT_G1_011_017.json'];
const fixes={
 'V11-B16-G1-001':['A small change in the right place made the space easier to use.','A small change at the right place made the space easier to use.'],
 'V11-B16-G1-014':['During the next week, more students used it, and the line at the counter became shorter.','During the next week, more students returned books through it, and the line at the counter became shorter.']
};
let changed=0;
for(const file of files){const data=JSON.parse(fs.readFileSync(file,'utf8'));for(const item of data.items||[]){const f=fixes[item.id];if(!f)continue;if(!item.body.includes(f[0]))throw new Error(`${item.id}: source phrase not found`);item.body=item.body.replace(f[0],f[1]);if(!String(item.fullTranslation||'').trim())throw new Error(`${item.id}: missing fullTranslation`);changed++;}fs.writeFileSync(file,JSON.stringify(data,null,2)+'\n');}
if(changed!==2)throw new Error(`Expected 2 fixes, got ${changed}`);
console.log(`Batch16 grammar followup fixes=${changed}`);