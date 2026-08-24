from safe_inverse_proportion_x_from_y_variant_engine import generate

def parent():
    return {'id':'INV-X','question':'yはxに反比例し、比例定数は24です。y=4のとき、xの値を求めなさい。','answer':'x=6','choices':[],'figure_refs':[]}
def main():
    rows,ev,reason=generate(parent(),3); assert reason=='inverse_proportion_x_from_y_exact' and len(rows)==len(ev)==3
    assert len({r['question'] for r in rows})==3
    for r,e in zip(rows,ev): assert 'PASS' in e['independent_check'] and e['parent_sha256']
    bad=parent(); bad['answer']='x=5'; assert generate(bad,1)[0]==[]
    fig=parent(); fig['figure_refs']=['f']; assert generate(fig,1)[0]==[]
    choice=parent(); choice['choices']=['6']; assert generate(choice,1)[0]==[]
    wrong=parent(); wrong['question']='yはxに反比例し、比例定数は24です。y=4のとき、yの値を求めなさい。'; assert generate(wrong,1)[0]==[]
    nonint=parent(); nonint['question']='yはxに反比例し、比例定数は25です。y=6のとき、xの値を求めなさい。'; nonint['answer']='x=25/6'; assert generate(nonint,1)[0]==[]
    print('PASS_INVERSE_PROPORTION_X_FROM_Y_EXACT_DIVISION_PRODUCT_FAIL_CLOSED')
if __name__=='__main__': main()
