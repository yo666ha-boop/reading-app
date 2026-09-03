(function finalizeV11Batch05ResidualNotesPre(){
'use strict';
const gloss={
'followed':'たどった・ついて行った','dark':'暗い','evening':'夕方・夜','holding':'持っている','arrived':'到着した','carefully':'注意深く','promise':'約束','stairs':'階段','town':'町','feel':'感じる','guest':'客','put':'置く・入れる','added':'加えた','arrive':'到着する','pretty':'きれいな','yard':'庭','shop':'店','depending':'〜によって','packed':'詰めた・荷造りした','putting':'置くこと・入れること','actually':'実は','found':'見つけた','presentation':'発表','folder':'フォルダー','included':'含めた','renamed':'名前を変更した','repeating':'繰り返して','balls':'ボール','parts':'部分','wind':'風','menus':'メニュー','results':'結果','areas':'場所・地域','begun':'始まった','arguing':'議論して','reports':'報告・レポート','activities':'活動','points':'点・要点','across':'〜を横切って・向こう側に','replaced':'置き換えた','photos':'写真','locker':'ロッカー','article':'記事','preferred':'より好んだ','seemed':'〜のように思えた','considered':'検討した・考えた','reason':'理由','fairly':'公平に','rebuilt':'作り直した','stopping':'止めること','itself':'それ自体','talking':'話すこと','garden':'庭','task':'作業','affected':'影響を与えた','sense':'意味・感覚','seven':'7','session':'時間・講習'
};
const ps=[...(window.V11_BATCH05_G1_PASSAGES||[]),...(window.V11_BATCH05_G2_PASSAGES||[]),...(window.V11_BATCH05_G3_PASSAGES||[])];if(ps.length!==50)throw new Error('Batch05 50 passages missing before residual note pre-finalization');
let replaced=0;for(const p of ps){for(const n of (p.notes||[])){if(!n||!n.english||!String(n.japanese||'').includes('最終注整理対象'))continue;const key=String(n.english).replace(/[’]/g,"'").toLowerCase();if(gloss[key]){n.japanese=gloss[key];n.source='v11 Batch05 residual context gloss 20260829';replaced++;}}}
window.V11_BATCH05_NOTE_PREFINAL_RESIDUAL_STATE={version:'20260829-residual-pre',replaced};
})();
