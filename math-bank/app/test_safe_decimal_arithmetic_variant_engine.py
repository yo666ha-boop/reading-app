from safe_decimal_arithmetic_variant_engine import can_generate,generate

def parent(**kw):
    p={'id':'P-DEC-001','question':'1.2+3.4を計算しなさい。','answer':'4.6','figure_refs':[],'choices':None};p.update(kw);return p

def main():
    ok,r=can_generate(parent());assert ok and r=='finite_decimal_binary_arithmetic_exact'
    ok,_=can_generate(parent(choices=[]));assert ok
    rows,ev,_=generate(parent(),3);assert len(rows)==len(ev)==3;assert len({x['question'] for x in rows})==3
    for x,e in zip(rows,ev):assert e['independent_check'].endswith('PASS') and x['answer']
    for bad in [parent(answer='4.7'),parent(question='1.2+3.4+2.0を計算しなさい。',answer='6.6'),parent(question='1.0÷3.0を計算しなさい。',answer='0.333'),parent(figure_refs=['f.svg']),parent(choices=['4.6','5.6'])]:
        ok,_=can_generate(bad);assert not ok;assert generate(bad,1)[0]==[]
    print('PASS_SAFE_DECIMAL_ARITHMETIC_VARIANT_ENGINE')
if __name__=='__main__':main()
