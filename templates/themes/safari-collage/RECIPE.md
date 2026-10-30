# Colagem de safári: um mundo máximo de papel rasgado com um mergulho

Uma colagem de papel rasgado em tela larga de 12 segundos, barulhenta e densa. Tiras rasgadas de vermelho em meio-tom, jornal antigo, papel laranja e azul (cada uma com uma borda de papel branco) deslizam sobre um céu real de nuvens, duas acácias recortadas, rochas e faixas de capim se montam, e um rádio 3D real cai no meio, impresso em prata, com a marca da empresa brilhando na janela do cassete e um rótulo na fita. Suricatos saltam. A câmera mergulha no alto-falante da direita até o preto dele encher o quadro, e desse preto se abre um caleidoscópio de 12 cunhas da savana dentro de uma moldura hexagonal rasgada, enquanto uma águia real de Muybridge, de 1887, bate asas por ele. Depois quatro colinas rasgadas se deslocam a quatro velocidades enquanto suricatos sobem um a um, e o título bate sobre um pico de jornal rasgado enquanto a águia passa. A ideia que faz funcionar: cada batida é um verbo físico sobre fotografias reais (deslizar, cair, saltar, mergulhar, abrir, bater asas, deslocar, bater), a marca vive dentro de um objeto real (a marca no deck), e o mergulho é uma emenda por correspondência através da própria geometria do objeto.

## Formato, duração, ritmo

- 1920x1080 (16:9), 30 fps, 12,0 s. Quatro cenas: A 0,0-4,4 (montagem e mergulho), B 4,2-6,8 (caleidoscópio; sobrepõe A em 0,2 s para o preto do mergulho passar a vez), C 6,8-9,6 (colinas), D 9,6-12,0 (título).
- Ritmo misto: os movimentos de posicionamento são suaves (`power3.out`, `back.out`), as texturas vivem em dois quadros: cada recorte ferve a cada 1/6 s e a águia bate asas a 12 fps; o título cai em `steps(3)`.
- Batidas medidas: 0,0-0,36 dez peças deslizam com 0,04 s de intervalo, 0,25 o rádio cai, 0,95 a marca salta no deck, 1,0 a 3,4 o alto-falante pulsa a cada 0,52 s, 1,3 e 2,1 suricatos, 3,4 mergulho, 4,2 caleidoscópio, 4,4 águia, 6,8 colinas, 7,3 / 7,55 / 7,8 / 8,1 suricatos, 9,6 pico, 10,0 e 10,3 palavras do título, 10,9 endereço, parado até 12,0.

## O visual em números

| elemento | valor |
|---|---|
| céu | foto CC0 de cúmulos, `cover`, `center 30%`, `saturate(1.25) brightness(1.04)`; uma mancha branca de pontos de meio-tom no alto à esquerda (pontos de `radial-gradient` de 14 px, mascarados para sumir a 135 graus) |
| peça rasgada (`.tp`) | duas camadas: `.rim` (branco de papel `#FBFAF6` multiplicado com um escaneamento de papel a 700 px) com um clip-path irregular (amplitude do serrilhado 16 px a cada 18 px), e `.ink` recuado 10 px com o seu próprio recorte irregular (9 px a cada 14 px), de modo que uma borda branca rasgada aparece de forma desigual; `drop-shadow(0 6px 6px rgba(20,14,8,.28))` |
| papéis de tinta | laranja `#E8A13A`, vermelho `#E2462F`, azul `#3E86C9`, cada um multiplicado com o escaneamento de papel; vermelho em meio-tom (pontos `#F7E9E4` a 30% em células de 22 px sobre `#E2462F`); jornal (uma primeira página de domínio público a 900 px, `grayscale(1) contrast(1.15)`); foto de savana (`saturate(1.35) hue-rotate(-12deg) brightness(1.08)`); foto de capim (`saturate(1.25) brightness(1.05)`) |
| tiras em A | b1 vermelho em meio-tom 1600x260 a -14 graus, b2 jornal 1300x200 a -7 graus, b3 laranja 1100x170 a -4 graus, b4 azul 1000x160 a -9 graus, g1 savana 2040x320 em y 820, g2 capim 2040x200 em y 960 |
| recortes | em cores plenas, `drop-shadow(0 8px 8px rgba(20,14,8,.35))`; rochas em tons de cinza `contrast(1.15)`; árvores com 520-560 px de largura, suricatos com 130-360 px de altura aproximada conforme a profundidade |
| rádio | 1100 px de largura em (410,230), o modelo do Poly Haven renderizado de frente, impresso em prata: `grayscale(1) brightness(3.1) contrast(1.02)` mais `drop-shadow(0 18px 18px rgba(0,0,0,.35))` |
| marca no objeto | marca na janela do cassete esquerdo (caixa em 30,6%/67,6%, 14,2% x 17,4% do rádio), 62% da janela, cor de destaque da marca com `drop-shadow(0 0 14px accent at 90%)`; rótulo da fita (56,2%/76,4%, 11,8% x 5,4%) laranja `#E8A13A`, fonte sem serifa da marca 600 17 px, espaçamento .02em, `#1d1a16` |
| caleidoscópio | quadrado de 2600 px com 12 cunhas (30 graus), cada uma um ladrilho de foto de savana (`saturate(1.5) hue-rotate(-15deg)`), um bloco azul de 700x360, um bloco laranja de 500x260 a -12 graus e um recorte de acácia; cunhas alternadas espelhadas; sobre preto `#0b0b0b` |
| moldura hexagonal | anel SVG, caminho par-ímpar entre dois raios irregulares (44 e 31 de 100), viés hexagonal `abs(cos 3a) * .08`, preenchimento laranja `#E8A13A`, contorno branco de papel 1,6 |
| título | fonte com serifa (ou de destaque) da marca, peso 800, 270 px, entrelinha .86, espaçamento -0.01em, vermelho `#E2462F` (ou a cor de destaque da marca se for quente), `-webkit-text-stroke: 6px #FBFAF6; paint-order: stroke fill`, sombra dura `10px 10px 0 #2B57A8, 12px 12px 0 #2B57A8`; duas linhas centralizadas em top 260 |
| endereço | fonte sem serifa da marca 600 44 px, `#FBFAF6` sobre uma cápsula `#1d1a16` (14px 30px), centralizado em top 880 |
| granulação | `feTurbulence` baseFrequency 1.2, alfa .14, multiply, opacidade .5 |

Regra de cor: primárias saturadas de colagem infantil (laranja, vermelho, azul, verde de capim, azul de céu) mais cinza de jornal. A cor da marca aparece no objeto (a marca), no endereço e opcionalmente no título; nunca como cor de papel, ou a colagem começa a parecer um modelo de marca.

## Lista de planos

| tempo | na tela | o que se move e como | estático | transição de saída |
|---|---|---|---|---|
| 0,0-1,0 | céu, 4 tiras rasgadas, 2 acácias, rochas, pedregulho vermelho, faixas de savana e de capim | cada peça do seu próprio lado (tiras de -1300/+1300 em x, b1 de (900,-300), árvores de -700/+700, rochas de +-700 com y 200, faixas de chão de y 500/400) até a posição final, 0,55 s `power3.out`, com 0,04 s de intervalo; rádio `y -800, rotation -8 para 0`, 0,7 s `back.out(1.3)` em 0,25 | céu | nenhuma |
| 1,0-3,4 | o mundo do rádio | a marca salta no deck `scale 0, rotation -90 para 0`, 0,5 s `back.out(2)` em 0,95, e depois gira 90 graus em 3 s linear; o cone do alto-falante `scale 1.06` 0,08 s `power2.out` e volta em 0,3 s, a cada 0,52 s; suricato no pedregulho `y 260, opacity 0 para 1`, 0,4 s `back.out(1.6)` em 1,3; suricato da frente `y 420 para 0`, 0,45 s `back.out(1.4)` em 2,1, depois balança `rotation -6` yoyo 3x 0,4 s; câmera `scale 1 para 1.05` em 3,4 s linear; cada recorte ferve a cada 1/6 s (+-1,4 px, +-0,4 grau) | céu | o mergulho |
| 3,4-4,25 | avanço para o alto-falante da direita | câmera `scale 1.05 para 11`, 0,85 s `power3.in`, transform-origin no centro do alto-falante (medido: 1360,771) | nenhum | o preto do alto-falante enche o quadro; a cena B começa em 4,2 sobre preto |
| 4,2-6,8 | caleidoscópio numa moldura hexagonal rasgada, águia | caleidoscópio `scale .05 para .9, rotation -60 para 40`, 2,6 s `power2.out`; moldura hexagonal `scale .1 para 1.1, rotation 30 para -20` a partir de 4,25; a águia cruza `x 0 para 2400, y 120 para -260`, 2,4 s linear a partir de 4,4, batendo asas 0-1-2-3-4-3-2-1 a 12 fps | fundo preto | corte seco em 6,8 |
| 6,8-9,6 | céu, 4 colinas rasgadas (jornal, vermelha, savana, capim), uma acácia, 4 suricatos | as colinas sobem `y 300/380/460/540 para 0`, 0,6 s `power3.out`, com 0,07 s de intervalo; elas se deslocam `x 0 para -120/-200/-320/-480` em 2,8 s linear (de trás para a frente: 4 velocidades), a árvore se desloca -200; os suricatos sobem `y 320, opacity 0 para 1`, 0,4 s `back.out(1.5)` em 7,3, 7,55, 7,8, 8,1, depois derivam `x -260` linear até 9,6; os recortes fervem | céu | corte seco em 9,6 |
| 9,6-12,0 | céu, um pico de jornal rasgado, duas tiras rasgadas de canto, título, endereço, águia | pico `y 900 para 0`, 0,55 s `power3.out`; tira vermelha no alto à esquerda a partir de x -900 (9,7), tira laranja embaixo à direita a partir de x +900 (9,75), 0,45 s `power3.out`; cada palavra do título `scale 1.6, rotation +-4, opacity 0` até o repouso, 0,22 s `steps(3)`, em 10,0 e 10,3; o endereço surge em 0,3 s em 10,9; a águia deriva `x -500, y -120` em 2,4 s batendo asas; pico, tiras e título fervem (+-1,6 px, +-0,5 grau) | céu | parado |

## Materiais e onde obtê-los para uma marca nova

O que é da marca: a marca da empresa em SVG ou num PNG limpo (vindo da entrada de dados), a fonte de destaque ou com serifa e uma sem serifa para os rótulos, o domínio, uma manchete de duas palavras (“Conheça <nome>”, “Diga olá”, “Tocando agora”) e o texto do rótulo da fita (o nome do produto mais uma palavra que combine com o objeto: “mix”, “rádio”, “ao vivo”).

Fontes gratuitas, todas CC0 ou de domínio público:

```sh
node scripts/find-assets.mjs --polyhaven model boombox --out <dir>
node scripts/prop-render.mjs <dir>/boombox/boombox_1k.gltf boombox.png --rx 0 --ry 0 --rz 0 --fill 0.95 --size 2000
node scripts/find-assets.mjs "cumulus clouds blue sky" --out <dir> --min 2000
node scripts/find-assets.mjs "acacia tree" --out <dir> --cutout            # pick a lone tree on sky
node scripts/find-assets.mjs "meerkat standing" --out <dir> --cutout --n 16 # need 4 different poses
node scripts/find-assets.mjs "rocks boulders" --out <dir> --cutout
node scripts/find-assets.mjs "red rock boulder" --out <dir> --cutout
node scripts/find-assets.mjs "savanna grassland" --out <dir>
node scripts/find-assets.mjs "grass turf" --out <dir>
node scripts/find-assets.mjs "old newspaper front page" --out <dir> --min 2000
node scripts/find-assets.mjs "eagle flying" --out <dir> --title american     # Muybridge, Animal Locomotion plates 769-771 (1887)
node scripts/find-assets.mjs --ambientcg paper --out <dir>
```

O ângulo de renderização usado para o rádio é de frente; as opções exatas não foram registradas, julgue pela renderização se os alto-falantes são quase círculos (o mergulho precisa de um alvo redondo). Depois meça, numa prévia quadriculada do PNG, as caixas de: a janela do cassete esquerdo (marca), o rótulo da fita e o centro do alto-falante da direita (origem do mergulho). Guarde-as como porcentagens da imagem.

Outro objeto para outra marca: o rádio serve para áudio, mídia, criadores e assistentes de IA (“um mix”). Alternativas do Poly Haven com alvo de mergulho redondo: `Television_01` (mergulho na tela), `vintage_video_camera` (a lente), `vintage_pocket_watch` (o mostrador). O mergulho sempre entra na abertura redonda mais escura do objeto.

Quadros da águia de Muybridge (um ciclo de bater de asas real): pegue uma fileira de uma prancha (5 quadros de uma batida de asa), recorte cada célula dentro da sua borda preta e recorte a ave com uma máscara de limiar preenchida a partir de cada pixel da borda, e então mantenha só o maior componente conectado (ele descarta as linhas da grade, os números dos quadros e as manchas). Precisa só do Pillow; `--tol 170` para pranchas:

```python
# clean-scan: lift a drawing or a plate frame off a flat scan background.
#   python3 clean.py cell.png eagle0.png --largest --tol 170
import sys
from collections import deque
from PIL import Image, ImageFilter

def clean(src, dst, tol=60, keep_largest=False):
    img = Image.open(src).convert("RGB"); w, h = img.size; px = img.load()
    edge = [px[x, 0] for x in range(w)] + [px[x, h - 1] for x in range(w)] + [px[0, y] for y in range(h)] + [px[w - 1, y] for y in range(h)]
    bg = tuple(sorted(c[i] for c in edge)[len(edge) // 2] for i in range(3))   # median border colour = the backdrop
    near = lambda p: abs(p[0] - bg[0]) + abs(p[1] - bg[1]) + abs(p[2] - bg[2]) <= tol
    out = bytearray(w * h); q = deque()
    for x in range(w):
        for y in (0, h - 1): q.append((x, y))
    for y in range(h):
        for x in (0, w - 1): q.append((x, y))
    while q:                                   # flood fill the backdrop from EVERY border pixel
        x, y = q.popleft(); i = y * w + x
        if out[i] or not near(px[x, y]): continue
        out[i] = 1
        if x > 0: q.append((x - 1, y))
        if x < w - 1: q.append((x + 1, y))
        if y > 0: q.append((x, y - 1))
        if y < h - 1: q.append((x, y + 1))
    keep = bytearray(0 if o else 255 for o in out)
    if keep_largest:                           # keep the biggest connected blob only
        lab = [0] * (w * h); best, best_n, n = 0, 0, 0
        for s in range(w * h):
            if not keep[s] or lab[s]: continue
            n += 1; lab[s] = n; q = deque([s]); c = 0
            while q:
                i = q.popleft(); c += 1; x, y = i % w, i // w
                for j, ok in ((i - 1, x > 0), (i + 1, x < w - 1), (i - w, y > 0), (i + w, y < h - 1)):
                    if ok and keep[j] and not lab[j]: lab[j] = n; q.append(j)
            if c > best_n: best, best_n = n, c
        keep = bytearray(255 if l == best else 0 for l in lab)
    a = Image.frombytes("L", (w, h), bytes(keep)).filter(ImageFilter.GaussianBlur(1.2))
    img.putalpha(a); img.crop(a.getbbox()).save(dst)

if __name__ == "__main__":
    tol = int(sys.argv[sys.argv.index("--tol") + 1]) if "--tol" in sys.argv else 60
    clean(sys.argv[1], sys.argv[2], tol, "--largest" in sys.argv)
```

Depois alinhe os cinco quadros numa única tela com o corpo (o centroide mais escuro) no mesmo ponto; cortados nos seus próprios limites eles diferem de tamanho (207 a 271 px de largura na prova) e a ave pula.

Material faltando: se não há suricatos CC0 em 4 poses, use qualquer animal em pé com várias fotos CC0 (cachorro-da-pradaria, pinguim, coruja). Se não há rádio, veja as alternativas acima. Nunca desenhe um animal, uma árvore ou um aparelho em CSS.

## Mecânica

Aleatório com semente e dois quadros:

```js
const tl = gsap.timeline({ paused: true });
const STEP = 1 / 12;
const R = (seed) => () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
  let r = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r; return ((r ^ (r >>> 14)) >>> 0) / 4294967296; };
```

Gerador de polígono de borda rasgada (borda e tinta, topo moldado opcional para colinas e picos):

```js
function poly(w, h, seed, amp, every, top) {
  const r = R(seed), p = [], nx = Math.round(w / every), ny = Math.round(h / every);
  for (let i = 0; i <= nx; i++) { const x = (i / nx) * w; p.push([x, (top ? top(x) : 0) + r() * amp]); }
  for (let i = 1; i <= ny; i++) p.push([w - r() * amp, (i / ny) * h]);
  for (let i = nx - 1; i >= 0; i--) p.push([(i / nx) * w, h - r() * amp]);
  for (let i = ny - 1; i > 0; i--) p.push([r() * amp, (i / ny) * h]);
  return `polygon(${p.map(([x, y]) => `${x.toFixed(1)}px ${y.toFixed(1)}px`).join(",")})`;
}
document.querySelectorAll(".tp").forEach((t, i) => {
  const w = t.offsetWidth, h = t.offsetHeight, k = R(31 + i)();
  const top = t.classList.contains("hill") ? (x) => 120 + 90 * Math.sin(x / (260 + 120 * k) + i * 1.7) + 40 * Math.sin(x / 90 + i)
            : t.classList.contains("peak") ? (x) => Math.abs(x - w / 2) * 1.6 : null;
  t.querySelector(".rim").style.clipPath = poly(w, h, 11 + i * 7, 16, 18, top);
  t.querySelector(".ink").style.clipPath = poly(w - 20, h - 20, 91 + i * 7, 9, 14, top ? (x) => top(x + 10) : null);
});
```

```css
.tp { position:absolute; filter: drop-shadow(0 6px 6px rgba(20,14,8,.28)); }
.tp > .rim { position:absolute; inset:0; background:#FBFAF6 url(paper.jpg) center/700px; background-blend-mode:multiply; }
.tp > .ink { position:absolute; inset:10px; }
```

Fervura em dois quadros sem brigar com as interpolações (propriedades individuais de transformação do CSS controladas por variáveis, de modo que `translate`/`rotate` se empilham sobre o `transform` do GSAP):

```css
.boil { translate: var(--bx, 0px) var(--by, 0px); rotate: var(--br, 0deg); }
```

```js
function boil(sel, a, b, seed, px = 1.4, rot = 0.4) {
  document.querySelectorAll(sel).forEach((el, k) => { el.classList.add("boil"); const r = R(seed * 131 + k * 17);
    for (let t = a; t < b; t += STEP * 2) tl.set(el, { "--bx": `${((r() - .5) * 2 * px).toFixed(2)}px`,
      "--by": `${((r() - .5) * 2 * px).toFixed(2)}px`, "--br": `${((r() - .5) * 2 * rot).toFixed(2)}deg` }, t); }); }
```

O mergulho no alto-falante:

```js
tl.fromTo("#camA", { scale: 1 }, { scale: 1.05, duration: 3.4, ease: "none", transformOrigin: "960px 600px" }, 0);
tl.to("#camA", { scale: 11, duration: 0.85, ease: "power3.in", transformOrigin: `${SPEAKER_X}px ${SPEAKER_Y}px` }, 3.4);
```

Caleidoscópio: 12 cunhas, as alternadas espelhadas, clip-paths sobrepostos em 0,6% para nenhuma emenda aparecer:

```css
#kal { position:absolute; left:50%; top:50%; width:2600px; height:2600px; margin:-1300px; }
/* a 30 deg wedge from the centre to 12 o'clock; exact edge would be 78.87%, apex 50% */
.wedge { position:absolute; inset:0; clip-path: polygon(50% 50.6%, 49.4% 0, 79.6% 0); }
.wedge .tile { position:absolute; left:50%; top:0; width:1300px; height:1300px; margin-left:-300px; }
```

```js
for (let i = 0; i < 12; i++) { const w = document.createElement("div"); w.className = "wedge";
  w.style.transform = i % 2 ? `rotate(${(i + 1) * 30}deg) scaleX(-1)` : `rotate(${i * 30}deg)`;
  w.innerHTML = TILE_HTML;   // photo + 2 paper blocks + a cut-out
  document.getElementById("kal").appendChild(w); }
```

Moldura hexagonal rasgada:

```js
const r = R(5);
const ring = (rad, j) => { let d = ""; for (let i = 0; i <= 60; i++) { const a = (i / 60) * Math.PI * 2,
  s = 1 + Math.abs(Math.cos(3 * a)) * 0.08 + (r() - .5) * j;
  d += (i ? "L" : "M") + (50 + rad * s * Math.cos(a)).toFixed(2) + " " + (50 + rad * s * Math.sin(a)).toFixed(2); } return d + "Z"; };
document.getElementById("hexring").setAttribute("d", ring(44, 0.03) + ring(31, 0.04));   // fill-rule="evenodd"
```

Sprite de ciclo de quadros (a águia), vai e volta em 5 quadros a 12 fps:

```js
function sprite(id, a, b, frames) { const el = document.getElementById(id);
  const imgs = frames.map((src) => { const im = document.createElement("img"); im.src = src; el.appendChild(im); return im; });
  const cyc = [0, 1, 2, 3, 4, 3, 2, 1]; let k = 0;
  for (let t = a; t < b; t += STEP, k++) imgs.forEach((im, n) => tl.set(im, { opacity: n === cyc[k % 8] ? 1 : 0 }, t)); }
```

Colinas com paralaxe (4 profundidades, 4 velocidades):

```js
[["#h1", -120], ["#h2", -200], ["#h3", -320], ["#h4", -480]].forEach(([s, x], i) => {
  tl.fromTo(s, { x: 0 }, { x, duration: 2.8, ease: "none" }, 6.8);
  tl.fromTo(s, { y: 300 + i * 80 }, { y: 0, duration: 0.6, ease: "power3.out" }, 6.8 + i * 0.07); });
```

## Adaptar a uma marca

Vem da marca: a marca na janela do objeto (cor de destaque e brilho), o rótulo no objeto, a manchete na sua fonte de destaque ou com serifa, a cápsula do endereço, a escolha do objeto (o que a marca é: áudio, vídeo, tempo). O título pode assumir a cor de destaque da marca se ela for quente e saturada; senão, mantenha o vermelho com a sombra azul.

Fica fixo: a foto do céu, a construção da borda rasgada, a paleta de papéis (laranja, vermelho, vermelho em meio-tom, azul, jornal, savana, capim), o objeto impresso em prata, o mergulho, o caleidoscópio de 12 cunhas com a moldura hexagonal laranja, o bater de asas de Muybridge, as colinas de 4 velocidades, a fervura em dois quadros, a batida em degraus do título. Os animais podem mudar com o mundo da marca (marca urbana: pombos em telhados recortados de fotos CC0), a construção não.

## Armadilhas encontradas durante a construção

- Definições feitas antes de a linha do tempo ser registrada são sobrescritas ao buscar um ponto: ponha `visibility:hidden` ou `opacity:0` para o que entra tarde no código da página e ligue-os com `tl.set`; construa todos os clip-paths rasgados antes de registrar.
- Um recorte de uma foto emoldurada mantém a borda da caixa da moldura; pegue os corpos de fotos inteiras em que o animal está totalmente dentro da imagem, ou mascare.
- A renderização do objeto é opaca: tudo o que for posto atrás dela fica escondido. Ponha a marca, o rótulo da fita e o cone do alto-falante ACIMA da imagem do rádio, posicionados em porcentagens dela.
- O alvo do mergulho precisa estar livre: na prova, o suricato da frente fica na frente do alto-falante da direita, então os últimos quadros do mergulho se enchem com o rosto dele, não com o preto do alto-falante. Tire os recortes do primeiro plano da linha do mergulho (ou deslize-os para fora em 3,2) para o preto realmente encher o quadro.
- Emendas das cunhas: clip-paths exatos de 30 graus deixam um fio de preto entre as cunhas na rotação; sobreponha-os (ápice 50,6%, bordas 49,4% e 79,6%).
- As células de Muybridge cortadas nos seus próprios limites têm tamanhos diferentes, então quadros ancorados no canto superior esquerdo pulam; alinhe-os numa tela só.
- `.boil` usa `translate`/`rotate` do CSS, não x/y do GSAP, então nunca briga com as entradas deslizando; não ferva com `x`/`y` em elementos que também são interpolados.
- O texto fica dentro do quadro e sobre o seu papel: o título a 270 px tem cerca de 820 px de largura para uma palavra de 6 letras (mantenha abaixo de 1500 px); rode `scripts/frame-audit.mjs` e confira se a cápsula do endereço está sobre o pico, não sobre o céu.

## Som

108 BPM, brincalhão, uma base saltitante com groove (o alto-falante pulsa nela: ajuste o pulso para 60/BPM s). whoosh na entrada deslizando (0,0), pop no rádio (0,25), pop na marca (0,95) e em cada suricato (1,3, 2,1), whoosh no mergulho (3,4), shimmer quando o caleidoscópio abre (4,2), whoosh na águia (4,4) e nas colinas (6,8), um pop por suricato (7,3, 7,55, 7,8, 8,1), whoosh no pico (9,6), o único golpe na primeira palavra do título (10,0), pop na segunda (10,3), shimmer no endereço (10,9).
