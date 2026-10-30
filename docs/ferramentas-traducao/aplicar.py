import json,re,sys,os
sys.path.insert(0,'.')
from extrair import SK, vars_of
def aplicar(batch):
    d=json.load(open(batch))
    for i,t in d.items():
        p=f'{SK}/{i}/move.json'; s=open(p,encoding='utf-8').read()
        for k in ('name','oneLiner','say'):
            pat=re.compile(r'("%s"\s*:\s*)"(?:[^"\\]|\\.)*"'%k)
            assert pat.search(s),(i,k)
            s=pat.sub(lambda m: m.group(1)+json.dumps(t[k],ensure_ascii=False),s,count=1)
        json.loads(s); open(p,'w',encoding='utf-8').write(s)
        p=f'{SK}/{i}/index.html'; h=open(p,encoding='utf-8').read()
        m=re.search(r"data-composition-variables='(\[.*?\])'",h,re.S); blk=m.group(1)
        for vid,lab in t['vars'].items():
            pat=re.compile(r'("id"\s*:\s*"%s"[^{}]*?"label"\s*:\s*)"(?:[^"\\]|\\.)*"'%re.escape(vid))
            assert pat.search(blk),(i,vid)
            blk=pat.sub(lambda m: m.group(1)+json.dumps(lab,ensure_ascii=False),blk,count=1)
        json.loads(blk)
        h=h.replace(m.group(1),blk,1); open(p,'w',encoding='utf-8').write(h)
        assert {v['id'] for v in vars_of(i)}==set(t['vars'])
if __name__=='__main__':
    for b in sys.argv[1:]: aplicar(b); print('aplicado',b)
