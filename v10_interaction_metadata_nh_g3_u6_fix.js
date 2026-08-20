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
      // Force style/layout calculation before opening print preview (important on Safari/iOS).
      void document.body.offsetHeight;
      setTimeout(()=>window.print(),80);
    }

    student.addEventListener('click',()=>runPrint('student'));
    teacher.addEventListener('click',()=>runPrint('teacher'));
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',installPrintModes,{once:true});
  else installPrintModes();
})();
