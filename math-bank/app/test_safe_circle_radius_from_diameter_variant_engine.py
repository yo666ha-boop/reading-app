from safe_circle_radius_from_diameter_variant_engine import generate

def parent():
    return {'id':'C-R-D','question':'直径12cmの円があります。この円の半径を求めなさい。','answer':'6cm','choices':[],'figure_refs':[]}
def main():
    rows,ev,reason=generate(parent(),3); assert reason=='circle_radius_from_diameter_exact'; assert len(rows)==len(ev)==3
    assert len({r['question'] for r in rows})==3
    for r,e in zip(rows,ev): assert r['answer'].endswith('cm') and 'PASS' in e['independent_check'] and e['parent_sha256']
    bad=parent(); bad['answer']='5cm'; assert generate(bad,1)[0]==[]
    odd=parent(); odd['question']='直径11cmの円があります。この円の半径を求めなさい。'; odd['answer']='5.5cm'; assert generate(odd,1)[0]==[]
    fig=parent(); fig['figure_refs']=['f']; assert generate(fig,1)[0]==[]
    choice=parent(); choice['choices']=['6cm']; assert generate(choice,1)[0]==[]
    wrong=parent(); wrong['question']='直径12cmの円があります。この円の面積を求めなさい。'; wrong['answer']='113.04cm2'; assert generate(wrong,1)[0]==[]
    print('PASS_CIRCLE_RADIUS_FROM_DIAMETER_HALVING_DOUBLING_FAIL_CLOSED')
if __name__=='__main__': main()
