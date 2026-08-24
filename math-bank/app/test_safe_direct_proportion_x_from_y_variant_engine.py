from safe_direct_proportion_x_from_y_variant_engine import generate

def parent():
    return {'id':'DIR-X','question':'yはxに比例し、比例定数は4です。y=24のとき、xの値を求めなさい。','answer':'x=6','choices':[],'figure_refs':[]}
def main():
    rows,ev,reason=generate(parent(),3); assert reason=='direct_proportion_x_from_y_exact' and len(rows)==len(ev)==3
    assert len({r['question'] for r in rows})==3
    for r,e in zip(rows,ev): assert 'PASS' in e['independent_check'] and e['parent_sha256']
    bad=parent(); bad['answer']='x=5'; assert generate(bad,1)[0]==[]
    fig=parent(); fig['figure_refs']=['f']; assert generate(fig,1)[0]==[]
    choice=parent(); choice['choices']=['6']; assert generate(choice,1)[0]==[]
    wrong=parent(); wrong['question']='yはxに比例し、比例定数は4です。y=24のとき、yの値を求めなさい。'; assert generate(wrong,1)[0]==[]
    nonint=parent(); nonint['question']='yはxに比例し、比例定数は4です。y=25のとき、xの値を求めなさい。'; nonint['answer']='x=25/4'; assert generate(nonint,1)[0]==[]
    print('PASS_DIRECT_PROPORTION_X_FROM_Y_EXACT_DIVISION_PRODUCT_FAIL_CLOSED')
if __name__=='__main__': main()
