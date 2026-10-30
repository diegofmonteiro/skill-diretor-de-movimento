import json,re,sys,glob
sys.path.insert(0,'.')
from extrair import src, vars_of, SK
OPT=set("in out fanout full top badge roster chain tree green accent on off auto left right bottom center".split())
def protegidos_label(s, default, tipo):
    t=set()
    for w in re.findall(r"[^\s,;()]+", s):
        w2=w.strip('.,:;"“”')
        if not w2: continue
        if re.search(r"[0-9{}|\\+]|assets/", w2) and not re.fullmatch(r"[0-9]+(-[0-9]+)?|[0-9]+(st|nd|th)?|1-based|[0-9]+K", w2): t.add(w2)
        elif w2.isupper() and len(w2)>1: t.add(w2)
        elif re.search(r"[a-z][A-Z]", w2): t.add(w2)
    if tipo=="string" and isinstance(default,str) and default and default.lower() not in ("off","on") and len(default)<=14 and re.search(r"\b"+re.escape(default)+r"\b", s): t.add(default)
    if ' or ' in s:
        for m in re.finditer(r"\b([a-z]{2,10})\b(?= \()", s): t.add(m.group(1))
    return t
EN=re.compile(r"\b(the|and|with|then|while|into|its|their|your|from the|that|when)\b", re.I)
def check(batch_file):
    d=json.load(open(batch_file)); erros=[]
    for i,t in d.items():
        s=src(i); vs={v['id']:v for v in vars_of(i)}
        for k in ('name','oneLiner','say'):
            if not t.get(k): erros.append(f"{i}: falta {k}")
            elif EN.search(t[k]): erros.append(f"{i}: {k} parece ter inglês: {EN.search(t[k]).group(0)}")
        if set(t['vars'])!=set(s['vars']): erros.append(f"{i}: variáveis diferentes {set(t['vars'])^set(s['vars'])}")
        for vid,lab in t['vars'].items():
            if "'" in lab or '"' in lab: erros.append(f"{i}.{vid}: aspas/apóstrofo no rótulo")
            if vid in s['vars']:
                for p in protegidos_label(s['vars'][vid], vs[vid].get('default'), vs[vid].get('type')):
                    if p not in lab: erros.append(f"{i}.{vid}: perdeu {p!r}")
                if EN.search(lab): erros.append(f"{i}.{vid}: rótulo parece ter inglês: {EN.search(lab).group(0)}")
        for m in re.finditer(r"\b(?:swap|set|use|switch|turn)\s+([A-Za-z]+(?:,? (?:and )?[A-Za-z]+){0,2})", s['say']):
            for vid in re.findall(r"[A-Za-z]+", m.group(1)):
                if vid in vs and vid not in ('and',) and vid not in t['say']: erros.append(f"{i}: say perdeu o parâmetro {vid}")
        for k in ('oneLiner','say'):
            for m in re.finditer(r"\bmode (\w+)|\blayout (\w+)|\bshape (\w+)", s[k]):
                if m.group(0) not in t[k] and 'mode' in m.group(0) or m.group(0) not in t[k] and 'layout' in m.group(0): erros.append(f"{i}: {k} perdeu {m.group(0)!r}")
    return erros
if __name__=='__main__':
    tot=[]
    for f in sys.argv[1:]: tot+=check(f)
    ign=set(open('ignorar.txt',encoding='utf-8').read().splitlines()) if __import__('os').path.exists('ignorar.txt') else set()
    tot=[e for e in tot if e not in ign]
    print('\n'.join(tot) or 'OK'); print(len(tot),'avisos')
