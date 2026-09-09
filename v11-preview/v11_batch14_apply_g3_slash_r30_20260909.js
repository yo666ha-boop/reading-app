const fs = require('fs');

const path = 'v11_batch14_assembled_draft.json';
const a = JSON.parse(fs.readFileSync(path, 'utf8'));
const passageMap = new Map((a.passages || []).map(p => [p.id, p]));

const maps = {
  'V11-B14-G3-004': ['1:1','2:2','3:3','4+5:4','6:5','7:6','8:7','9+10:8','11:9','12:10'],
  'V11-B14-G3-006': ['1:1','2:2','3:3','4:4','5:5','6:6','7:7','8:8','9:9','10+11:10','12:11','13:12','14+15:13','16:14+15','17:16','18:17','19:18','20:19','21:20','22:21','23:22','24:23','25:24','26:25','27:26','28:27'],
  'V11-B14-G3-009': ['1:1','2:2','3:3','4:4','5:5','6:6','7:7','8:8','9:9','10:10','11:11','12:12','13:13','14:14','15:15','16:16','17:17','18:18','19:19','20:20+21','21:22','22:23','23:24+25','24:26'],
  'V11-B14-G3-010': ['1:1+2','2:3','3:4','4:5','5:6','6:7','7:8','8:9','9:10','10:11','11:12','12:13','13:14','14:15'],
  'V11-B14-G3-011': ['1:1','2+3:2','4:3','5:4','6+7:5','8:6','9:7','10:8','11:9','12:10','13:11','14:12','15:13','16:14','17:15','18:16','19:17','20:18','21:19','22:20','23:21'],
  'V11-B14-G3-012': ['1:1','2+3:2','4:3','5:4','6:5','7:6','8:7','9:8','10:9','11:10'],
  'V11-B14-G3-013': ['1:1','2:2','3:3','4:4','5:5','6:6','7:7','8:8+9','9:10','10:11','11:12','12:13','13:14'],
  'V11-B14-G3-014': ['1:1','2:2','3:3','4:4','5:5','6:6','7:7','8:8','9:9','10:10','11:11','12+13:12+13','14:14','15:15','16:16','17:17','18:18','19:19','20:20','21:21','22:22','23:23','24:24','25:25','26:26','27:27'],
  'V11-B14-G3-015': ['1:1','2:2','3+4:3','5:4','6:5','7:6','8:7','9:8','10:9','11:10']
};

const expectedSentenceCounts = {
  'V11-B14-G3-004':[12,10],
  'V11-B14-G3-006':[28,27],
  'V11-B14-G3-009':[24,26],
  'V11-B14-G3-010':[14,15],
  'V11-B14-G3-011':[23,21],
  'V11-B14-G3-012':[11,10],
  'V11-B14-G3-013':[13,14],
  'V11-B14-G3-014':[27,27],
  'V11-B14-G3-015':[11,10]
};

function splitEnglish(text) {
  const s = String(text || '').trim();
  const out = [];
  let start = 0;
  for (let i=0; i<s.length; i++) {
    if (!'.?!'.includes(s[i])) continue;
    let j = i + 1;
    while (j < s.length && /[”’'\")\]]/.test(s[j])) j++;
    if (j < s.length && !/\s/.test(s[j])) continue;
    let k = j;
    while (k < s.length && /\s/.test(s[k])) k++;
    if (s[i] === '.' && k < s.length && /[a-z]/.test(s[k])) continue;
    const piece = s.slice(start, j).trim();
    if (piece) out.push(piece);
    start = k;
    i = k - 1;
  }
  const tail = s.slice(start).trim();
  if (tail) out.push(tail);
  return out;
}

function splitJapanese(text) {
  const s = String(text || '').trim();
  const out = [];
  let start = 0;
  for (let i=0; i<s.length; i++) {
    if (!'。！？'.includes(s[i])) continue;
    let j = i + 1;
    while (j < s.length && /[」』”’'\")\]]/.test(s[j])) j++;
    const piece = s.slice(start, j).trim();
    if (piece) out.push(piece);
    start = j;
  }
  const tail = s.slice(start).trim();
  if (tail) out.push(tail);
  return out;
}

function indices(expr) {
  return expr.split('+').map(x => Number(x.trim()));
}

function pick(parts, expr, joiner) {
  return indices(expr).map(n => {
    if (!Number.isInteger(n) || n < 1 || n > parts.length) throw new Error(`bad map index ${expr} for count ${parts.length}`);
    return parts[n-1];
  }).join(joiner);
}

function compact(s) { return String(s || '').replace(/\s+/g,''); }

let totalRows = 0;
for (const [id, lines] of Object.entries(maps)) {
  const p = passageMap.get(id);
  if (!p) throw new Error(`missing passage ${id}`);
  const en = splitEnglish(p.body);
  const jp = splitJapanese(p.fullTranslation);
  const [wantEn,wantJp] = expectedSentenceCounts[id];
  if (en.length !== wantEn || jp.length !== wantJp) {
    console.error(id, 'EN', en.map((x,i)=>`${i+1}:${x}`));
    console.error(id, 'JP', jp.map((x,i)=>`${i+1}:${x}`));
    throw new Error(`${id} sentence count ${en.length}/${jp.length}, expected ${wantEn}/${wantJp}`);
  }
  const rows = lines.map(line => {
    const [e,j] = line.split(':');
    return {
      english: pick(en,e,' '),
      japanese: pick(jp,j,''),
      humanReview: 'B14_G3_SLASH_HUMAN_R30_20260909'
    };
  });
  if (rows.length !== lines.length) throw new Error(`${id} row count fail`);
  for (const r of rows) {
    if (!p.body.includes(r.english)) throw new Error(`${id} english slash exact fail: ${r.english}`);
    if (!p.fullTranslation.includes(r.japanese)) throw new Error(`${id} japanese slash exact fail: ${r.japanese}`);
  }
  if (compact(rows.map(r=>r.english).join(' ')) !== compact(p.body)) throw new Error(`${id} english slash coverage fail`);
  if (compact(rows.map(r=>r.japanese).join('')) !== compact(p.fullTranslation)) throw new Error(`${id} japanese slash coverage fail`);
  p.slashRows = rows;
  totalRows += rows.length;
  console.log(id, `slash PASS ${rows.length} rows; sentences ${en.length}/${jp.length}`);
}
if (totalRows !== 154) throw new Error(`total slash rows ${totalRows}, expected 154`);
fs.writeFileSync(path, JSON.stringify(a,null,2)+'\n');
console.log('Batch14 G3 missing slash PASS totalRows=154');
