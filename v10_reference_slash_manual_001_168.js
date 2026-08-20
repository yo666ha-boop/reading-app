// Final reference-based slash layer. Source of truth: 英語長文基本.pdf + 英語長文基本解答.pdf.
// This file is loaded after all older semantic/vocab slash layers and is extended continuously through passage 168.
(function(){
  const PASS='PASS_REFERENCE_20260820';
  function setAudit(data,section,rows,passageNo){
    const p=data&&data[section];
    if(!p) throw new Error('Missing reference-audit passage '+passageNo+': '+section);
    if(!Array.isArray(p.sentences)||rows.length!==p.sentences.length) throw new Error('Reference slash row mismatch passage '+passageNo+': '+section+' '+rows.length+'/'+((p.sentences||[]).length));
    for(let i=0;i<rows.length;i++){
      const deSlash=String(rows[i].en||'').replace(/\s*\/\s*/g,' ').replace(/\s+/g,' ').trim();
      const sentence=String(p.sentences[i]||'').replace(/\s+/g,' ').trim();
      if(deSlash!==sentence) throw new Error('Reference slash changes English passage '+passageNo+' row '+(i+1)+': '+deSlash+' <> '+sentence);
    }
    p.slashRows=rows;
    p.slashReadingVersion='reference-book-20260820';
    p.slashReferenceAudit=PASS;
    p.slashReferencePassageNo=passageNo;
  }

  const sun1=window.V10_SUNSHINE_G1||{};

  // 001 — short core clauses stay whole; only the notebook place phrase is a useful extra chunk.
  setAudit(sun1,'Get Ready 2',[
    {en:'This is my English book.',jp:'これは私の英語の本です。'},
    {en:'Really?',jp:'本当に？'},
    {en:'Yes.',jp:'うん。'},
    {en:'This is a dog.',jp:'これは犬です。'},
    {en:'I see.',jp:'なるほど。'},
    {en:'This is a cat, too.',jp:'これはねこでもあります。'},
    {en:'I write “dog” / in my notebook.',jp:'私は「dog」と書きます / ノートに'},
    {en:'I write “cat” / in my notebook, too.',jp:'私は「cat」と書きます / ノートにも'},
    {en:'I can read “dog”.',jp:'私は「dog」を読むことができます。'},
    {en:'I can read “cat”, too.',jp:'私は「cat」も読むことができます。'},
    {en:'Great!',jp:'すごい！'}
  ],1);

  // 002 — the reference does not split a short simple core merely to separate WH/object, verb/object, or Yes + auxiliary.
  setAudit(sun1,'Get Ready 3',[
    {en:'What subject do you like?',jp:'何の教科が好きですか。'},
    {en:'I like English.',jp:'私は英語が好きです。'},
    {en:'Really?',jp:'本当に？'},
    {en:'Yes.',jp:'うん。'},
    {en:'Do you have your English book?',jp:'英語の本を持っていますか。'},
    {en:'Yes, I do.',jp:'はい、持っています。'},
    {en:'Can you read English?',jp:'英語を読むことができますか。'},
    {en:'Yes, I can.',jp:'はい、できます。'},
    {en:'Great!',jp:'すごい！'},
    {en:'I like English, too.',jp:'私も英語が好きです。'}
  ],2);

  // 003 — reference-style place/time chunking, without over-splitting short predicate cores.
  setAudit(sun1,'Get Ready 4',[
    {en:'I like basketball.',jp:'私はバスケットボールが好きです。'},
    {en:'I am in the basketball club.',jp:'私はバスケットボール部に入っています。'},
    {en:'I practice / in the gym / every day.',jp:'私は練習します / 体育館で / 毎日'},
    {en:'I can run.',jp:'私は走ることができます。'},
    {en:'I can jump high.',jp:'私は高くジャンプすることができます。'},
    {en:'I can shoot the ball.',jp:'私はボールをシュートすることができます。'},
    {en:'Basketball is very exciting.',jp:'バスケットボールはとてもわくわくします。'},
    {en:'Do you like basketball?',jp:'バスケットボールは好きですか。'},
    {en:'Yes, I do.',jp:'はい、好きです。'},
    {en:'Let’s play basketball together.',jp:'いっしょにバスケットボールをしよう。'},
    {en:'Great!',jp:'いいね！'}
  ],3);

  window.V10_REFERENCE_SLASH_AUDIT={version:'2026-08-20',passagesAudited:3,total:168,lastCompleted:3};
})();
