(()=>{const m=window.V10_INTERACTION_META_G3_NH_U6&&window.V10_INTERACTION_META_G3_NH_U6['ニューホライズン|3|Unit 6-4'];if(!m)return;m.questionSetB[2]={prompt:'3. 1つの場所の人々は別の場所の人々とどのような関係になれますか。本文から英語で1語抜き出しなさい。',answer:'interdependent',evidence:'People from one place can be interdependent with people from another place.',evidenceJp:'1つの場所の人々は別の場所の人々と相互依存することができます。',reason:'状態を表す語が interdependent です。'};})();

// Separate print modes for classroom use.
// Student sheet: English passage + current questions only. No Japanese translation, slash reading, answers, evidence, or explanations.
// Teacher sheet: passage + slash/translation + current questions + answers/explanations.
(()=>{
  function installPrintModes(){
    if(document.getElementById('studentPrintBtn')) return;
    const oldBtn=document.getElementById('printBtn');
    const bar=oldBtn&&oldBtn.parentElement;
    if(!bar) return;

    oldBtn.style.display='none';

    const student=document.createElement('button');
    student.id='studentPrintBtn';
    student.type='button';
    student.textContent='生徒用プリント';
    student.title='英文本文と問題だけを印刷';

    const teacher=document.createElement('button');
    teacher.id='teacherPrintBtn';
    teacher.type='button';
    teacher.textContent='解答・解説プリント';
    teacher.title='本文・訳・問題・解答・解説を印刷';

    bar.appendChild(student);
    bar.appendChild(teacher);

    const style=document.createElement('style');
    style.id='v10PrintModeStyle';
    style.textContent=`
      #printSheetLabel{display:none}
      @media print{
        #printSheetLabel{display:block!important;font-size:18px;font-weight:800;margin:0 0 12px;padding:0 0 8px;border-bottom:2px solid #111}
        body.print-student #slash,
        body.print-student #answers,
        body.print-student #audit{display:none!important}
        body.print-student #passage,
        body.print-student #questions{display:block!important}
        body.print-student .student-print-hide{display:none!important}
        body.print-teacher #audit{display:none!important}
        body.print-teacher #passage,
        body.print-teacher #slash,
        body.print-teacher #questions,
        body.print-teacher #answers{display:block!important}
        body.print-student #passage,
        body.print-teacher #passage{page-break-after:always!important}
        body.print-student #questions{page-break-after:auto!important}
        body.print-teacher #slash,
        body.print-teacher #questions{page-break-after:always!important}
        body.print-teacher #answers{page-break-after:auto!important}
      }
    `;
    document.head.appendChild(style);

    const label=document.createElement('div');
    label.id='printSheetLabel';
    const wrap=document.querySelector('.wrap');
    if(wrap) wrap.insertBefore(label,wrap.firstChild);

    let studentHidden=[];

    function markStudentOnlyHidden(){
      studentHidden=[];
      const passage=document.getElementById('passage');
      if(!passage) return;
      const heading=[...passage.querySelectorAll('h3')].find(el=>el.textContent.trim()==='自然な全訳');
      const body=heading&&heading.nextElementSibling;
      [heading,body].filter(Boolean).forEach(el=>{
        studentHidden.push({el,display:el.style.display,priority:el.style.getPropertyPriority('display')});
        el.classList.add('student-print-hide');
        el.style.setProperty('display','none','important');
      });
    }

    function restoreStudentHidden(){
      studentHidden.forEach(({el,display,priority})=>{
        el.classList.remove('student-print-hide');
        if(display) el.style.setProperty('display',display,priority||'');
        else el.style.removeProperty('display');
      });
      studentHidden=[];
    }

    const cleanup=()=>{
      restoreStudentHidden();
      document.body.classList.remove('print-student','print-teacher');
      label.textContent='';
    };

    function runPrint(mode){
      cleanup();
      const isStudent=mode==='student';
      document.body.classList.add(isStudent?'print-student':'print-teacher');
      if(isStudent) markStudentOnlyHidden();
      label.textContent=isStudent?'生徒用プリント（英文本文・問題）':'解答・解説プリント（本文・訳・問題・解答・解説）';
      window.addEventListener('afterprint',cleanup,{once:true});
      window.addEventListener('focus',()=>setTimeout(cleanup,300),{once:true});
      void document.body.offsetHeight;
      setTimeout(()=>window.print(),80);
    }

    student.addEventListener('click',()=>runPrint('student'));
    teacher.addEventListener('click',()=>runPrint('teacher'));
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',installPrintModes,{once:true});
  else installPrintModes();
})();

// Final vocabulary/slash human audit: passages 001-002.
// Remove words not present in the canonical cumulative Sunshine vocabulary master
// when the same meaning can be expressed naturally with already learned language.
(()=>{
  const data=window.V10_SUNSHINE_G1||{};
  function metaTargets(section){
    const key='サンシャイン|1|'+section;
    const out=[];
    const maps=[window.V10_INTERACTION_META_SEMANTIC_REPAIRS_001_010,window.V10_INTERACTION_META];
    for(const m of maps) if(m&&m[key]&&!out.includes(m[key])) out.push(m[key]);
    return out;
  }

  const p1=data['Get Ready 2'];
  if(p1){
    p1.sentences=['This is my English book.','Really?','Yes.','This is a dog.','I see.','This is a cat, too.','I write “dog”.','I write “cat”, too.','I can read “dog”.','I can read “cat”, too.','Great!'];
    p1.fullTranslation='「これは私の英語の本です。」「本当に？」「うん。」「これは犬です。」「なるほど。」「これはねこでもあります。」「私は dog と書きます。」「cat も書きます。」「私は dog を読むことができます。」「cat も読むことができます。」「すごい！」';
    p1.slashRows=[
      {en:'This is my English book.',jp:'これは私の英語の本です。'},
      {en:'Really?',jp:'本当に？'},{en:'Yes.',jp:'うん。'},
      {en:'This is a dog.',jp:'これは犬です。'},{en:'I see.',jp:'なるほど。'},
      {en:'This is a cat, too.',jp:'これはねこでもあります。'},
      {en:'I write “dog”.',jp:'私は dog と書きます。'},
      {en:'I write “cat”, too.',jp:'cat も書きます。'},
      {en:'I can read “dog”.',jp:'私は dog を読むことができます。'},
      {en:'I can read “cat”, too.',jp:'cat も読むことができます。'},
      {en:'Great!',jp:'すごい！'}
    ];
    if(Array.isArray(p1.questions)&&p1.questions[2]){
      p1.questions[2]={prompt:'3. 書いた英単語を2つ答えなさい。',answer:'dog and cat',evidence:'I write “dog”. / I write “cat”, too.',evidenceJp:'私は dog と書きます。／cat も書きます。',reason:'write の後ろに dog と cat が示されています。'};
    }
    for(const m of metaTargets('Get Ready 2')) if(Array.isArray(m.questionSetB)&&m.questionSetB[2]) m.questionSetB[2]={prompt:'3. 「私」は dog と書きますか。本文に合うように Yes / No で答えなさい。',answer:'Yes',evidence:'I write “dog”.',evidenceJp:'私は dog と書きます。',reason:'write “dog” と明示されています。'};
    p1.vocabFinalAudit='PASS_REWRITE_NOTES_0';
    p1.slashHumanAudit='PASS_MODEL_ALIGNED';
  }

  const p2=data['Get Ready 3'];
  if(p2){
    p2.sentences=['What do you like?','I like English.','Really?','Yes.','Do you have your English book?','Yes, I do.','Can you read English?','Yes, I can.','Great!','I like English, too.'];
    p2.fullTranslation='「何が好きですか。」「私は英語が好きです。」「本当に？」「うん。」「英語の本を持っていますか。」「はい、持っています。」「英語を読むことができますか。」「はい、できます。」「すごい！」「私も英語が好きです。」';
    p2.slashRows=p2.sentences.map((en,i)=>({en,jp:['何が好きですか。','私は英語が好きです。','本当に？','うん。','英語の本を持っていますか。','はい、持っています。','英語を読むことができますか。','はい、できます。','すごい！','私も英語が好きです。'][i]}));
    if(Array.isArray(p2.questions)&&p2.questions[0]) p2.questions[0]={prompt:'1. 最初の人が好きなものは何ですか。英語で答えなさい。',answer:'English',evidence:'I like English.',evidenceJp:'私は英語が好きです。',reason:'最初の質問への答えで、好きなものを直接示しています。'};
    for(const m of metaTargets('Get Ready 3')) if(Array.isArray(m.questionSetB)&&m.questionSetB[0]) m.questionSetB[0]={prompt:'1. “What do you like?” に対する答えの英文を本文から1文抜き出しなさい。',answer:'I like English.',evidence:'I like English.',evidenceJp:'私は英語が好きです。',reason:'好きなものを直接答えています。'};
    p2.vocabFinalAudit='PASS_REWRITE_NOTES_0';
    p2.slashHumanAudit='PASS_MODEL_ALIGNED';
  }
})();
