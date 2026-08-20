import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {renderCanonicalText,markerRefs,safeFigureRef}=require('./render_figure_markers.js');

function assert(cond,msg){if(!cond)throw new Error(msg)}

const original='図を見て答えなさい。\n[[IMAGE:figures/a.png]]\n次の問いに答えよ。';
const copy=original;
const ok=renderCanonicalText(original,['figures/a.png'],'Q-001');
assert(original===copy,'source text mutated');
assert(ok.unresolvedMarkers.length===0,'valid marker unresolved');
assert(ok.usedRefs.length===1&&ok.usedRefs[0]==='figures/a.png','valid ref not used exactly once');
assert(ok.html.includes('data-inline-figure="1"'),'inline image not rendered');
assert(!ok.html.includes('[[IMAGE:'),'raw marker leaked into rendered HTML');

const bad=renderCanonicalText('[[IMAGE:../secret.png]]',['../secret.png'],'Q-002');
assert(bad.unresolvedMarkers.length===1,'unsafe marker must be unresolved');
assert(bad.html.includes('data-figure-marker-error="1"'),'unsafe marker must remain visible as an error');
assert(!bad.html.includes('src="../secret.png"'),'unsafe marker rendered as image');

const missing=renderCanonicalText('A [[IMAGE:figures/missing.png]] B',['figures/other.png'],'Q-003');
assert(missing.unresolvedMarkers[0]==='figures/missing.png','unregistered marker not detected');
assert(missing.html.includes('[図版参照エラー]'),'unregistered marker silently disappeared');

const escaped=renderCanonicalText('<script>alert(1)</script>',[],'Q-004');
assert(!escaped.html.includes('<script>'),'text HTML was not escaped');
assert(escaped.html.includes('&lt;script&gt;'),'escaped text missing');

assert(JSON.stringify(markerRefs('[[IMAGE:a.png]] x [[IMAGE:a.png]] [[IMAGE:b.svg]]'))===JSON.stringify(['a.png','b.svg']),'markerRefs should deduplicate in source order');
assert(safeFigureRef('figures/a.png')===true,'safe local figure rejected');
assert(safeFigureRef('../a.png')===false,'parent traversal accepted');
assert(safeFigureRef('javascript:alert(1)')===false,'javascript URL accepted');

console.log('PASS_RENDER_FIGURE_MARKERS_NON_MUTATING_SAFE');
