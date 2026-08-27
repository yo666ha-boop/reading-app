(function repairV11Batch01Uniqueness(){
  const VERSION='20260827-b01-diversity-003';
  const rows={
    friendSleepy:{en:'My friend was sleepy.',jp:'友達は眠そうでした。',sen:'My friend was / sleepy.',sjp:'私の友達は〜でした / 眠い'},
    schoolWay:{en:'I saw my friend on my way to school.',jp:'学校へ行く途中で友達に会いました。',sen:'I saw / my friend / on my way to school.',sjp:'私は会いました / 友達に / 学校へ行く途中で'},
    figure:{en:'We make a small figure from the wood.',jp:'私たちは木材から小さな人形を作ります。',sen:'We make / a small figure / from the wood.',sjp:'私たちは作ります / 小さな人形を / 木材から'},
    thin:{en:'The tin is so thin that we can fold it.',jp:'ブリキはとても薄いので、私たちはそれを折ることができます。',sen:'The tin is / so thin that / we can fold / it.',sjp:'そのブリキは〜です / とても薄いので / 私たちは折ることができます / それを'},
    cloud:{en:'A cloud was over the mountain.',jp:'山の上には雲がありました。',sen:'A cloud was / over the mountain.',sjp:'雲がありました / 山の上に'},
    openAir:{en:'A person can sell a coat in the open air.',jp:'人は屋外でコートを売ることができます。',sen:'A person / can sell / a coat / in the open air.',sjp:'人は / 売ることができます / コートを / 屋外で'},
    sold:{en:'One shop sold a coat yesterday.',jp:'ある店は昨日コートを売りました。',sen:'One shop / sold / a coat / yesterday.',sjp:'ある店は / 売りました / コートを / 昨日'},
    island:{en:'Water can surround an island.',jp:'水は島を囲むことがあります。',sen:'Water can surround / an island.',sjp:'水は囲むことがあります / 島を'},
    exception:{en:'There is one exception in this trade.',jp:'この貿易には1つの例外があります。',sen:'There is / one exception / in this trade.',sjp:'あります / 1つの例外が / この貿易に'},
    ss1SchoolMovie:{en:'We talked about school and the movie.',jp:'私たちは学校とその映画について話しました。',sen:'We talked / about school and the movie.',sjp:'私たちは話しました / 学校とその映画について'},
    nh1ContestMemory:{en:'The album can bring back the contest memory.',jp:'そのアルバムはコンクールの思い出をよみがえらせることがあります。',sen:'The album / can bring back / the contest memory.',sjp:'そのアルバムは / よみがえらせることがあります / コンクールの思い出を'},
    ss2PeaceBadge:{en:'The peace message is on the small badge.',jp:'平和のメッセージは小さなバッジにあります。',sen:'The peace message is / on the small badge.',sjp:'平和のメッセージはあります / 小さなバッジに'},
    ss2BadgeFigure:{en:'We make a badge and a small figure from the old material.',jp:'私たちは古い材料からバッジと小さな人形を作ります。',sen:'We make / a badge and a small figure / from the old material.',sjp:'私たちは作ります / バッジと小さな人形を / 古い材料から'},
    nh2CampaignProtect:{en:'The cleanup campaign can help people protect the mountain.',jp:'清掃活動は人々が山を守るのに役立つことがあります。',sen:'The cleanup campaign / can help people / protect the mountain.',sjp:'その清掃活動は / 人々を助けることができます / 山を守る'},
    g3TradePlaces:{en:'Trade can connect people in different places.',jp:'貿易は異なる場所の人々を結びつけることができます。',sen:'Trade can connect / people / in different places.',sjp:'貿易は結びつけることができます / 人々を / 異なる場所で'},
    g3IslandProduct:{en:'An island can depend on trade for a product.',jp:'島は製品を得るために貿易に頼ることがあります。',sen:'An island / can depend on / trade / for a product.',sjp:'島は / 頼ることがあります / 貿易に / 製品のために'},
    g3CountryTrade:{en:'Trade can connect a country with another country.',jp:'貿易はある国と別の国を結びつけることができます。',sen:'Trade can connect / a country / with another country.',sjp:'貿易は結びつけることができます / ある国を / 別の国と'},
    g3StudentDepend:{en:'A student can study how a country can depend on another country.',jp:'生徒は、ある国が別の国にどのように頼ることがあるかを学ぶことができます。',sen:'A student / can study / how a country can depend / on another country.',sjp:'生徒は / 学ぶことができます / ある国がどのように頼ることがあるかを / 別の国に'}
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
    ['V11-NH-G3-U6-4-010','exception'],
    ['V11-SS-G1-P10-2-004','ss1SchoolMovie'],
    ['V11-NH-G1-U10-2-006','nh1ContestMemory'],
    ['V11-SS-G2-P8-3-004','ss2PeaceBadge'],
    ['V11-SS-G2-P8-3-009','ss2BadgeFigure'],
    ['V11-NH-G2-U7-4-008','nh2CampaignProtect'],
    ['V11-NH-G3-U6-4-003','g3TradePlaces'],
    ['V11-NH-G3-U6-4-004','g3IslandProduct'],
    ['V11-NH-G3-U6-4-006','g3CountryTrade'],
    ['V11-NH-G3-U6-4-008','g3StudentDepend']
  ];
  function apply(){
    const all=window.V11_BATCH01_PASSAGES||[];let changed=0;const missing=[];
    for(const [id,key] of defs){const p=all.find(x=>x&&x.id===id),r=rows[key];if(!p||!r){missing.push(id+':'+key);continue;}if((p.sentences||[]).includes(r.en))continue;p.sentences.push(r.en);p.fullTranslation=String(p.fullTranslation||'')+r.jp;p.slashRows.push({en:r.sen,jp:r.sjp});p.auditNote=String(p.auditNote||'')+' Batch01 diversity repair: added a coherent same-section sentence using only already-established family vocabulary and grammar to separate near-duplicate passages without changing question evidence.';changed++;}
    const fp=new Map(),dups=[];for(const p of all){const f=[...new Set(p.sentences||[])].sort().join('\n');if(fp.has(f))dups.push([fp.get(f),p.id]);else fp.set(f,p.id);}
    const state={version:VERSION,definitions:defs.length,changed,missing,duplicateBodies:dups};window.V11_BATCH01_UNIQUENESS_STATE=state;if(missing.length||dups.length)throw new Error('Batch01 uniqueness repair incomplete '+JSON.stringify(state));if(typeof window.V11_APPLY_EASY_SUPPORT_NOTES==='function')window.V11_APPLY_EASY_SUPPORT_NOTES();return state;
  }
  window.V11_APPLY_BATCH01_UNIQUENESS_REPAIR=apply;
  apply();
})();
