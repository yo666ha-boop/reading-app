from validate_rebuilt_raw_records import validate,TARGETS

def make(source,n):
    return [{'id':f'{source}-{i}','source':source,'document_id':'D1','record_index':i,'question':f'Q{i}','answer':f'A{i}','explanation':'','figure_refs':[]} for i in range(n)]
def main():
    for source,n in TARGETS.items(): assert validate(make(source,n),source)['pass']
    bad=make('Winpass',717); bad[1]['answer']=''; assert not validate(bad,'Winpass')['pass']
    dup=make('Winpass',717); dup[1]=dict(dup[0]); assert not validate(dup,'Winpass')['pass']
    fig=make('Standard',317); fig[0]['figure_refs']=['img/a.png']; r=validate(fig,'Standard',{'img/b.png'}); assert not r['pass'] and len(r['missing_figure_refs'])==1
    wrong=make('実力錬成',236); assert not validate(wrong,'実力錬成')['pass']
    print('PASS_REBUILT_RAW_COUNT_QA_FINGERPRINT_FIGURE_FAIL_CLOSED')
if __name__=='__main__': main()
