from safe_circle_diameter_from_radius_variant_engine import generate

def parent():
    return {'id':'C-D-R','question':'半径6cmの円があります。この円の直径を求めなさい。','answer':'12cm','choices':[],'figure_refs':[]}
def main():
    rows,ev,reason=generate(parent(),3); assert reason=='circle_diameter_from_radius_exact'; assert len(rows)==len(ev)==3
    assert len({r['question'] for r in rows})==3
    for r,e in zip(rows,ev): assert r['answer'].endswith('cm') and 'PASS' in e['independent_check'] and e['parent_sha256']
    bad=parent(); bad['answer']='10cm'; assert generate(bad,1)[0]==[]
    fig=parent(); fig['figure_refs']=['f']; assert generate(fig,1)[0]==[]
    choice=parent(); choice['choices']=['12cm']; assert generate(choice,1)[0]==[]
    wrong=parent(); wrong['question']='半径6cmの円があります。この円の面積を求めなさい。'; wrong['answer']='113.04cm2'; assert generate(wrong,1)[0]==[]
    print('PASS_CIRCLE_DIAMETER_FROM_RADIUS_DOUBLING_HALVING_FAIL_CLOSED')
if __name__=='__main__': main()
