from create_winpass_review_queue import build

def main():
    records=[{'id':f'W-{i}','source':'Winpass','document_id':f'D{i//9}','record_index':i,'question':f'Q{i}','answer':f'A{i}','explanation':'','figure_refs':[]} for i in range(717)]
    r=build(records); assert len(r['queue'])==717 and r['pending']==717 and not r['ready_for_normalization_audit']
    assert len({x['record_fingerprint_sha256'] for x in r['queue']})==717
    assert all(x['action']=='' and x['evidence']==[] and x['review_status']=='PENDING_EVIDENCE' for x in r['queue'])
    try: build(records[:-1]); raise AssertionError('count gate did not fail')
    except SystemExit: pass
    dup=list(records); dup[1]=dict(dup[1]); dup[1]['id']=dup[0]['id']
    try: build(dup); raise AssertionError('duplicate id gate did not fail')
    except SystemExit: pass
    print('PASS_WINPASS_717_FINGERPRINT_BOUND_REVIEW_QUEUE_NO_COUNT_FORCING')
if __name__=='__main__': main()
