from safe_circle_diameter_from_circumference_variant_engine import generate

def parent():
    return {'id':'C-D','question':'円周率を3.14とします。円周の長さは31.4cmです。この円の直径を求めなさい。','answer':'10cm','choices':[],'figure_refs':[]}
def main():
    rows,ev,reason=generate(parent(),3); assert reason=='circle_diameter_from_circumference_pi_3_14_exact'; assert len(rows)==len(ev)==3
    assert len({r['question'] for r in rows})==3
    for r,e in zip(rows,ev):
        assert '3.14' in r['question'] and r['answer'].endswith('cm') and 'PASS' in e['independent_check'] and e['parent_sha256']
    bad=parent(); bad['answer']='9cm'; assert generate(bad,1)[0]==[]
    nonint=parent(); nonint['question']='円周率を3.14とします。円周の長さは10cmです。この円の直径を求めなさい。'; nonint['answer']='3.1847cm'; assert generate(nonint,1)[0]==[]
    fig=parent(); fig['figure_refs']=['f']; assert generate(fig,1)[0]==[]
    choice=parent(); choice['choices']=['10cm']; assert generate(choice,1)[0]==[]
    wrong=parent(); wrong['question']='円周率を3.14とします。円周の長さは31.4cmです。この円の半径を求めなさい。'; wrong['answer']='5cm'; assert generate(wrong,1)[0]==[]
    print('PASS_CIRCLE_DIAMETER_FROM_CIRCUMFERENCE_EXACT_PI_3_14_FAIL_CLOSED')
if __name__=='__main__': main()
