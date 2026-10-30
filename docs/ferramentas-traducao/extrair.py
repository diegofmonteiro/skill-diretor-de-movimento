import json,glob,re,sys,os
SK='/home/claude/teste/skill/templates/moves'
ids=sorted(os.path.basename(os.path.dirname(f)) for f in glob.glob(SK+'/*/move.json'))
def vars_of(i):
    h=open(f'{SK}/{i}/index.html',encoding='utf-8').read()
    m=re.search(r"data-composition-variables='(\[.*?\])'",h,re.S)
    return json.loads(m.group(1))
def src(i):
    d=json.load(open(f'{SK}/{i}/move.json'))
    return {"id":i,"name":d['name'],"oneLiner":d['oneLiner'],"say":d['say'],"vars":{v['id']:v.get('label','') for v in vars_of(i)}}
if __name__=='__main__':
    a,b=int(sys.argv[1]),int(sys.argv[2])
    for i in ids[a:b]:
        s=src(i); print(json.dumps(s,ensure_ascii=False))
    if a==0: print(len(ids),file=sys.stderr)
