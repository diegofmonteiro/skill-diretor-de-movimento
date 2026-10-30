import re,sys,json
src,tag=sys.argv[1],sys.argv[2]
blocks=json.load(open(f'./rec/{tag}.blocks.json'))
tr=open(f'./rec/{tag}.pt.md',encoding='utf-8').read()
orig=open(f'./rec/{tag}.src.md',encoding='utf-8').read()
ph=lambda s:re.findall(r'@@CODE\d+@@',s)
assert ph(orig)==ph(tr),'placeholders diferem'
spans=lambda s:sorted(re.findall(r'`[^`\n]+`',s))
a,b=spans(orig),spans(tr)
from collections import Counter
ca,cb=Counter(a),Counter(b)
for k in (ca-cb): print('SÓ NO ORIGINAL:',k,(ca-cb)[k])
for k in (cb-ca): print('SÓ NA TRADUÇÃO:',k,(cb-ca)[k])
hd=lambda s:len(re.findall(r'(?m)^#+ ',s))
tb=lambda s:len(re.findall(r'(?m)^\|',s))
li=lambda s:len(re.findall(r'(?m)^\s*(?:[-*]|\d+\.) ',s))
print('títulos',hd(orig),hd(tr),'| linhas de tabela',tb(orig),tb(tr),'| itens',li(orig),li(tr))
res=tr
for i,bk in enumerate(blocks,1): res=res.replace(f'@@CODE{i}@@',bk)
open(src,'w',encoding='utf-8').write(res)
print('gravado',src,len(res))
