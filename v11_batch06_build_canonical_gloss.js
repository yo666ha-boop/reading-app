'use strict';
const fs=require('fs'),vm=require('vm');
function extract(file){const src=fs.readFileSync(file,'utf8');const m=src.match(/const gloss=({[\s\S]*?});\nconst ps=/);if(!m)throw new Error('gloss not found '+file);return vm.runInNewContext('('+m[1]+')');}
const gloss={...extract('v11_batch05_notes_finalize.js'),...extract('v11_batch05_notes_finalize_pre.js')};
fs.writeFileSync('v11_batch06_canonical_gloss.js',"(function(){'use strict';window.V11_BATCH06_CANONICAL_GLOSS="+JSON.stringify(gloss)+";})();\n");
console.log('canonical gloss entries',Object.keys(gloss).length);
