(function repairV11Batch01Uniqueness(){
  const VERSION='20260827-b01-unique-002';
  const rows={
    friendSleepy:{en:'My friend was sleepy.',jp:'友達は眠そうでした。',sen:'My friend was / sleepy.',sjp:'私の友達は〜でした / 眠い'},
    schoolWay:{en:'I saw my friend on my way to school.',jp:'学校へ行く途中で友達に会いました。',sen:'I saw / my friend / on my way to school.',sjp:'私は会いました / 友達に / 学校へ行く途中で'},
    figure:{en:'We make a small figure from the wood.',jp:'私たちは木材から小さな人形を作ります。',sen:'We make / a small figure / from the wood.',sjp:'私たちは作ります / 小さな人形を / 木材から'},
    thin:{en:'The tin is so thin that we can fold it.',jp:'ブリキはとても薄いので、私たちはそれを折ることができます。',sen:'The tin is / so thin that / we can fold / it.',sjp:'そのブリキは〜です / とても薄いので / 私たちは折ることができます / それを'},
    cloud:{en:'A cloud was over the mountain.',jp:'山の上には雲がありました。',sen:'A cloud was / over the mountain.',sjp:'雲がありました / 山の上に'},
    openAir:{en:'A person can sell a coat in the open air.',jp:'人は屋外でコートを売ることができます。',sen:'A person / can sell / a coat / in the open air.',sjp:'人は / 売ることができます / コートを / 屋外で'},
    sold:{en:'One shop sold a coat yesterday.',jp:'ある店は昨日コートを売りました。',sen:'One shop / sold / a coat / yesterday.',sjp:'ある店は / 売りました / コートを / 昨日'},
    island:{en:'Water can surround an island.',jp:'水は島を囲むことがあります。',sen:'Water can surround / an island.',sjp:'水は囲むことがあります / 島を'},
    exception:{en:'There is one exception in this trade.',jp:'この貿易には1つの例外があります。',sen:'There is / one exception / in this trade.',sjp:'あります / 1つの例外が / この貿易に'}
  };
  const defs=[
    ['V11-SS-G1-P10-2-007','friendSleepy'],
    ['V11-NH-G1-U10-2-006','schoolWay'],
    ['V11-SS-G2-P8-3-008','figure'],
    ['V11-SS-G2-P8-3-009','thin'],
    ['V11-NH-G2-U7-4-008','cloud'],
    ['V11-NH-G3-U6-4-006','openAir'],
    ['V11-NH-G3-U6-4-007','exception'],
    ['V11-NH-G3-U6-4-009','sold'],
    ['V11-NH-G3-U6-4-008','sold'],
    ['V11-NH-G3-U6-4-010','island'],
    ['V11-NH-G3-U6-4-010','exception']
  ];
  function apply(){
    const all=window.V11_BATCH01_PASSAGES||[];let changed=0;const missing=[];
    for(const [id,key] of defs){const p=all.find(x=>x&&x.id===id),r=rows[key];if(!p||!r){missing.push(id+':'+key);continue;}if((p.sentences||[]).includes(r.en))continue;p.sentences.push(r.en);p.fullTranslation=String(p.fullTranslation||'')+r.jp;p.slashRows.push({en:r.sen,jp:r.sjp});p.auditNote=String(p.auditNote||'')+' Batch01 uniqueness repair: added one same-section audited sentence to eliminate an exact duplicate body without changing chronology.';changed++;}
    const fp=new Map(),dups=[];for(const p of all){const f=[...new Set(p.sentences||[])].sort().join('\n');if(fp.has(f))dups.push([fp.get(f),p.id]);else fp.set(f,p.id);}
    const state={version:VERSION,definitions:defs.length,changed,missing,duplicateBodies:dups};window.V11_BATCH01_UNIQUENESS_STATE=state;if(missing.length||dups.length)throw new Error('Batch01 uniqueness repair incomplete '+JSON.stringify(state));if(typeof window.V11_APPLY_EASY_SUPPORT_NOTES==='function')window.V11_APPLY_EASY_SUPPORT_NOTES();return state;
  }
  window.V11_APPLY_BATCH01_UNIQUENESS_REPAIR=apply;
  apply();
})();
