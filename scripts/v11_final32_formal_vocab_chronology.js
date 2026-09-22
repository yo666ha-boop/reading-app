const fs=require('fs');
const vm=require('vm');
const finalFiles=['V11_FINAL32_BODY_TRANSLATION_DRAFT_G1_001_008.json','V11_FINAL32_BODY_TRANSLATION_DRAFT_G1_009_011.json','V11_FINAL32_BODY_TRANSLATION_DRAFT_G2_001_008.json','V11_FINAL32_BODY_TRANSLATION_DRAFT_G2_009_011.json','V11_FINAL32_BODY_TRANSLATION_DRAFT_G3_001_010.json'];
const merged={items:finalFiles.flatMap(f=>JSON.parse(fs.readFileSync(f,'utf8')).items||[])};
if(merged.items.length!==32||new Set(merged.items.map(x=>x.id)).size!==32)throw Error('FINAL32 must contain 32 unique passages');
const virtual='V11_FINAL32_MERGED_BODY.tmp.json'; fs.writeFileSync(virtual,JSON.stringify(merged));
let src=fs.readFileSync('scripts/v11_batch16_formal_vocab_chronology.js','utf8');
src=src.replace(/const files=\[[^;]+;/s,`const files=['${virtual}'];`)
 .replace(/if\(ps\.length!==50\)/,'if(ps.length!==32)')
 .replace(/Batch16 \$\{ps\.length\}\/50/,'FINAL32 ${ps.length}/32')
 .replace(/\^V11_BATCH16_REQUIRED_LOCAL_GLOSS_G\[123\]_\\d\{3\}\\\.json\$/,'^V11_FINAL32_REQUIRED_LOCAL_GLOSS_G[123]_\\d{3}\\.json$')
 .replace("batch:'V11-B16'","batch:'V11-FINAL32'")
 .replace(/Batch16 passages/g,'FINAL32 passages')
 .replace("'V11_BATCH16_FORMAL_VOCAB_CHRONOLOGY_REPORT.json'","'V11_FINAL32_FORMAL_VOCAB_CHRONOLOGY_REPORT.json'");
try{vm.runInThisContext(src,{filename:'generated-final32-vocab-gate.js'});}finally{try{fs.unlinkSync(virtual)}catch{}}
