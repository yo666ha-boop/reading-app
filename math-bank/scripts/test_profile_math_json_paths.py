from __future__ import annotations

import profile_math_json_paths as m


def main()->None:
    obj={
      'grade':1,
      'sections':[
        {'question':'1+2=?','answer':'3','choices':[]},
        {'problem':{'text':'x+2=5'},'solution':{'answer':'3'}},
      ],
      'meta':{'title':'sample'},
    }
    s=m.new_stats()
    s['documents']=1
    m.walk(obj,'$',0,s)
    out=m.finalize(s)
    assert out['documents']==1
    assert '$.sections' in out['object_key_paths']
    assert '$.sections[].question' in out['question_hint_paths']
    assert '$.sections[].answer' in out['answer_hint_paths']
    assert '$.sections[].solution.answer' in out['answer_hint_paths']
    assert out['list_paths']['$.sections']['max_len']==2
    assert out['list_paths']['$.sections[].choices']['max_len']==0
    assert out['depth_truncated']==0

    deep={}
    cur=deep
    for i in range(m.MAX_DEPTH+2):
        cur['x']={}
        cur=cur['x']
    s2=m.new_stats();m.walk(deep,'$',0,s2)
    assert s2['depth_truncated']>0

    print('PASS_MATH_JSON_RECURSIVE_PATH_PROFILE_AND_HINT_DISCOVERY_TEST')

if __name__=='__main__':
    main()
