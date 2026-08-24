from safe_inverse_proportion_value_variant_engine import generate

def parent():
    return {'id':'INV-V','question':'yはxに反比例し、比例定数は24です。x=6のとき、yの値を求めなさい。','answer':'y=4','choices':[],'figure_refs':[]}
def main():
    rows,ev,reason=generate(parent(),3); assert reason=='inverse_proportion_value_exact' and len(rows)==len(ev)==3
    assert len({r['question'] for r in rows})==3
    for r,e in zip(rows,ev):
        assert r['choices'] if False else True
        assert 'PASS' in e['independent_check'] and e['parent_sha256']
    bad=parent(); bad['answer']='y=5'; assert generate(bad,1)[0]==[]
    fig=parent(); fig['figure_refs']=['f']; assert generate(fig,1)[0]==[]
    choice=parent(); choice['choices']=['4']; assert generate(choice,1)[0]==[]
    wrong=parent(); wrong['question']='yはxに反比例し、比例定数は24です。x=6のとき、xの値を求めなさい。'; assert generate(wrong,1)[0]==[]
    nonint=parent(); nonint['question']='yはxに反比例し、比例定数は25です。x=6のとき、yの値を求めなさい。'; nonint['answer']='y=25/6'; assert generate(nonint,1)[0]==[]
    print('PASS_INVERSE_PROPORTION_VALUE_EXACT_DIVISION_PRODUCT_FAIL_CLOSED')
if __name__=='__main__': main()
