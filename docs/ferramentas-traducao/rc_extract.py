import re,sys,json
src=sys.argv[1]; tag=sys.argv[2]
t=open(src,encoding='utf-8').read()
blocks=[]
def sub(m):
    blocks.append(m.group(0)); return f'@@CODE{len(blocks)}@@'
out=re.sub(r'(?ms)^```.*?^```[ \t]*$',sub,t)
open(f'./rec/{tag}.blocks.json','w').write(json.dumps(blocks))
open(f'./rec/{tag}.src.md','w',encoding='utf-8').write(out)
print(len(t),'->',len(out),'chars;',len(blocks),'blocos de código')
