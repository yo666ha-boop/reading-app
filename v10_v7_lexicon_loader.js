const fs=require('fs');
const zlib=require('zlib');

function loadCanonicalV7(){
  const parts=['v10_v7_lexicon_snapshot.b64.part1','v10_v7_lexicon_snapshot.b64.part2'];
  const b64=parts.map(p=>fs.readFileSync(p,'utf8').trim()).join('');
  const json=zlib.gunzipSync(Buffer.from(b64,'base64')).toString('utf8');
  const data=JSON.parse(json);
  if(!data||data.v!==1)throw new Error('unexpected canonical-v7 snapshot version');
  const src=data.source||[];
  if(src[0]!=='1AkKYV6h-9ZCq1-p8126u4t8z0pvPSRnHlOfY8C-3hH4'||src[1]!=='単語マスター'||Number(src[2])!==3975){
    throw new Error(`canonical-v7 source mismatch: ${JSON.stringify(src)}`);
  }
  return data;
}

module.exports={loadCanonicalV7};
