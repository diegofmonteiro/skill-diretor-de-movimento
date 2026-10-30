import json,re,sys
sys.path.insert(0,'.')
from padroes import M
R='../../templates/moves/'
byf={}
for (e,i),n in M.items(): byf.setdefault(e,[]).append((i,n))
bad=0;chg=0;extra=0
W=0
for e,items in byf.items():
    fb=0
    p=R+e+'/index.html'; h=open(p,encoding='utf-8').read(); o=h
    m=re.search(r"data-composition-variables='(.*?)'",h,re.S)
    if not m: print('SEM VARS',e); fb+=1; continue
    vs={x['id']:x for x in json.loads(m.group(1))}
    for i,n in items:
        if i not in vs or not isinstance(vs[i].get('default'),str): print('SEM CAMPO',e,i); fb+=1; continue
        old=vs[i]['default']
        if old==n: continue
        if "'" in n or '"' in n: print('ASPAS',e,i); fb+=1; continue
        for s in '|;,':
            if old.count(s)!=n.count(s) and s in '|;' : print('SEP',s,e,i,old.count(s),n.count(s)); fb+=1
        if old.count(',')!=n.count(',') and ',' in old and not re.search(r'[.!?]',old): print('VIRG?',e,i,old.count(','),n.count(','))
        for t in re.findall(r'\{\w+\}',old):
            if t not in n: print('TOKEN',e,i,t); fb+=1
        oj=json.dumps(old,ensure_ascii=False)[1:-1]; nj=json.dumps(n,ensure_ascii=False)[1:-1]
        pat='"id":"'+i+'"'
        k=h.find(pat); 
        d=h.find('"default":"'+oj+'"',k)
        if k<0 or d<0 or d-k>600: print('NAO ACHEI',e,i); fb+=1; continue
        h=h[:d]+'"default":"'+nj+'"'+h[d+len('"default":"'+oj+'"'):]
        chg+=1
        if len(oj)>=12:
            a=re.search(r"data-composition-variables='.*?'",h,re.S)
            pre,mid,post=h[:a.start()],h[a.start():a.end()],h[a.end():]
            c=pre.count(oj)+post.count(oj)
            if c: h=pre.replace(oj,nj)+mid+post.replace(oj,nj); extra+=c
    if h!=o and not fb: open(p,'w',encoding='utf-8').write(h)
    elif h!=o: print('NÃO GRAVADO (erros)',e)
    bad+=fb
print('alterados',chg,'extras em código',extra,'erros',bad)
