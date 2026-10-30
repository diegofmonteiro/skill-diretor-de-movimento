# Fantoche: colagem de papel em dois quadros

Uma colagem vertical de papel de 10 segundos animada em dois quadros (12 desenhos por segundo). Um sol mostarda sobe atrás de uma cordilheira cinza escaneada em 3D, um manequim sem rosto tirado do vídeo explicativo da própria marca cai pendurado em fios, uma mão desenhada de museu maneja uma cruz de marionete de madeira acima dele e o fantoche dá um tranco a cada puxão, com os olhos riscados por X amarelos. Então a cabeça real do fundador estoura sobre os ombros do manequim, uma bola de papel amassado voa dela, a mão solta, os fios somem, o fantoche se acomoda e a manchete cai palavra por palavra. A ideia que faz funcionar: cada batida é uma piada visual com um verbo físico (subir, cair, puxar, dar um tranco, estourar, soltar), o mascote da própria marca vira a vítima e o fundador é a frase de efeito. A piada se entende num olhar porque os fios são geometria de verdade, recalculada a cada quadro da cruz até o fantoche, e por isso nunca se soltam.

## Formato, duração, ritmo

- 1080x1920 (9:16), 30 fps, 10,0 s. Funciona em 1:1 pondo a manchete ao lado do sol; 16:9 não é recomendado (os fios precisam de altura).
- Um plano contínuo, sem cortes. Tudo se move em dois quadros: toda interpolação usa `steps(round(duration * 12))`, então um movimento de 0,5 s são 6 desenhos parados.
- Batidas medidas: 0,0 as rochas sobem, 0,2 o sol cresce, 0,7 o fantoche cai, 1,1 a mão e a cruz caem, 1,5 os fios aparecem, 2,0 a 4,5 seis trancos a cada 0,5 s, 5,0 a cabeça real estoura, 5,2 a bola de papel voa, 6,4 a mão solta, 6,5 o fantoche se acomoda, 7,0 a 7,75 quatro palavras batem com 0,25 s de intervalo, 8,2 o endereço, parado até 10,0.

## O visual em números

| elemento | valor |
|---|---|
| fundo | papel quadriculado `#F3F3F1`: dois degradês de linha de 1,5 px `rgba(90,90,100,.2)` numa grade de 38 px, sob uma folha de papel amassado escaneada (`background-size: 1300px`, `mix-blend-mode: multiply`, opacidade .45) |
| sol | disco chapado `#D5A50D` (mostarda), 700x700 em left 140 top 760, sem contorno, sem sombra |
| rochas | o escaneamento 3D renderizado em PNG, `filter: grayscale(1) contrast(1.25) brightness(1.5)` mais `drop-shadow(0 -6px 10px rgba(0,0,0,.25))`, 1200x800 em left -60 top 1220, `object-fit: cover; object-position: 50% 10%`, borda de cima cortada em 9 picos com um polígono clip-path |
| mão | o punho desenhado de museu, sépia quente como escaneado, 300 px de largura em left 420 top -90, `scaleY(-1) rotate(-12deg)` para pender segurando a cruz |
| cruz de marionete | SVG, duas barras arredondadas (480x30 e 30x200, rx 8), preenchimento `#D9B98A`, contorno `#9d7b4c` 3 px |
| fios | divs de 1,6 px de largura, `rgba(30,30,30,.55)`, 3 deles |
| fantoche | o recorte do manequim da marca, 500 px de largura, `scale: 1.45` a partir do centro do topo, `grayscale(1) contrast(1.15) brightness(1.05)` |
| olhos em X | caminhos SVG, contorno `#F2C21A` 11 px com pontas redondas, 94x44 sobre o rosto |
| cabeça do fundador | recorte de foto real em cores, 154 px de largura sobre a cabeça de 122 px do manequim (um pouco maior é lido como “estourando”) |
| manchete | fonte de destaque da marca, peso 900, 140 px, entrelinha .9, espaçamento -0.02em, `#141414`, maiúsculas e minúsculas de frase, 2 linhas centralizadas em top 330 |
| endereço | fonte de destaque da marca 700, 44 px, branco numa cápsula `#141414` (padding 14px 30px, cantos retos), centralizado em top 1690 |
| granulação | SVG `feTurbulence` fractalNoise baseFrequency 1.2, alfa .14, multiply, opacidade .5, sobre tudo |
| sombras | todo recorte com `drop-shadow(0 10px 10px rgba(20,14,8,.3))`: papel erguido 1 cm da folha |

Regra de cor: o quadro é em tons de cinza, exceto três coisas, o sol mostarda, os X amarelos e a mão sépia. A cabeça do fundador é a única pele em cores plenas do filme, e é por isso que a explosão funciona.

## Lista de planos

| tempo | na tela | o que se move e como | estático | saída |
|---|---|---|---|---|
| 0,0-0,7 | papel quadriculado, rochas, sol | rochas `y 300 para 0`, 0,42 s, `steps(5)`; sol `scale .35 para 1` a partir de `50% 100%` (sobe de trás dos picos), 0,5 s, `steps(6)`, começa em 0,2 | fundo, granulação | nenhuma, um plano só |
| 0,7-1,5 | o manequim na sua mesa cai | fantoche `y -1300 para 0, rotation -15 para 0`, 0,5 s, `steps(6)`; mão + cruz `y -500 para 0`, 0,42 s, `steps(5)`, em 1,1 | rochas, sol | os fios se ligam em 1,5 |
| 1,5-5,0 | mão, cruz, 3 fios, fantoche com olhos em X | a cada 0,5 s a partir de 2,0: cruz + mão `rotation sw, x sw*3` (sw = valor com semente de -7 a +7 graus), 0,17 s `steps(2)`; o fantoche responde 0,08 s depois `rotation -0.8*sw, x 4*sw, y abs(sw)*2`, 0,25 s `steps(3)`; os olhos em X fervem a cada 1/6 s (rotação +-3 graus, x +-2 px) | fundo, sol, rochas | nenhuma |
| 5,0-6,4 | cabeça real sobre a cabeça do manequim, bola de papel | cabeça com `visibility` ligada em 5,0, `scale .2 para 1, rotation -40 para 0, y -220 para 0`, 0,33 s `steps(4)`; olhos em X escondidos em 5,08; bola de papel em 5,2 `y 150 para -60, scale .3 para 1, rotation -40 para 20`, 0,42 s `steps(5)`, e então em 5,7 `scale .2, opacity 0, rotation 120`, 0,25 s `steps(3)`, escondida em 5,96 | fios ainda esticados, mão ainda dando trancos até 5,0 | a mão solta |
| 6,4-7,0 | mão e cruz saem, fios somem | fios com opacity 0 em 6,4; mão + cruz `y -600`, 0,42 s `steps(5)`; fantoche `y 120, rotation 0, x 0`, 0,33 s `steps(4)` (ele desaba sobre o sol) | rochas, sol | nenhuma |
| 7,0-10,0 | manchete sobre o fantoche, cápsula do endereço | cada palavra `opacity 0 para 1, scale 1.4 para 1`, 0,17 s `steps(2)`, com 0,25 s de intervalo; o endereço surge em 8,2 em 0,25 s (o único movimento suave do filme) | tudo | parado até o fim |

## Materiais e onde obtê-los para uma marca nova

1. **O fantoche: o personagem da própria marca.** Baixe o vídeo principal ou explicativo da marca e faça uma folha de contato dele (`ffmpeg -vf fps=1,scale=480:-1,tile=6x6`). Procure uma figura sem rosto ou genérica: um manequim, um boneco de palitos, um mascote, um avatar 3D. Pegue o quadro em tamanho cheio e recorte-o: `node scripts/cutout.mjs frame.png puppet.png`. Corte numa linha natural (a borda de uma mesa, a cintura) para ser lido como um busto em fios. Se o recorte mantiver uma borda colorida de um fundo colorido, o filtro `grayscale(1)` a esconde. **Se a marca não tem personagem**, use o corpo do próprio fundador de uma imagem parada de vídeo com o rosto coberto por um oval de papel (os olhos em X vão no papel), ou `find-assets.mjs "mannequin" --cutout`.
2. **A cabeça do fundador**: uma imagem parada de vídeo ou retrato de frente, recortada com `cutout.mjs`, cortada na cabeça e no pescoço, com cerca de 1,25 vez a largura da cabeça do fantoche. Mantenha em cores.
3. **A mão**: `node scripts/find-assets.mjs "hand holding stick" --out <dir> --cutout`. O desenho de museu “Study: A man's hand holding a stick” (Cooper Hewitt, 1700-1750, domínio público) é o punho usado: uma mão fechada sobre papel tonalizado, virada na vertical para pender. Outras boas buscas: `"drawing study hand"`, `"hand study red chalk"` com `--title drawing`. Se o desenho está sobre um fundo escuro ou chapado de escaneamento, mascare-o com um limiar preenchido a partir de cada pixel da borda (abaixo) em vez de confiar no Vision.
4. **As rochas**: `node scripts/find-assets.mjs --polyhaven model mountainside --out <dir>`, depois `node scripts/prop-render.mjs <dir>/mountainside/mountainside_1k.gltf rocks.png --rx 70 --ry 0 --fill 0.95 --size 2000` (olhe o escaneamento de cima para a superfície preencher o quadro; o ângulo exato usado não foi registrado, julgue pela renderização) e gire o PNG 90 graus para as cristas correrem na vertical (`sips -r 90`). A cor não importa: o CSS a transforma em rocha cinza-prata. Os picos vêm do clip-path, não do modelo.
5. **Fundos**: `node scripts/find-assets.mjs --ambientcg paper --out <dir>` ou `"crumpled paper texture"` para a folha multiply. A grade é CSS.
6. **A bola de papel**: `find-assets.mjs "crumpled paper ball" --cutout`; qualquer folha amassada, creme ou branca.
7. **A marca** (batida final opcional): a logo da marca vinda da entrada de dados, num bloco arredondado, posta ACIMA da camada de rochas.

Limpar um escaneamento (um desenho de museu sobre um fundo chapado ou preto). O Vision costuma falhar em desenhos; uma máscara de limiar preenchida a partir de cada pixel da borda nunca falha. Precisa só do Pillow. Use `--tol 60` para um desenho sobre um fundo uniforme; a mão não precisa de `--largest`.

```python
# clean-scan: lift a drawing or a plate frame off a flat scan background. Needs only Pillow.
#   python3 clean.py scan.jpg out.png [--largest] [--tol 60]
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
    keep = bytearray(0 if o else 255 for o in out)  # subject = everything the flood did not reach (holes inside stay)
    if keep_largest:                           # plate frames: keep the biggest connected blob, drop grid lines, numbers, specks
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

Material faltando: nunca desenhe uma mão ou uma pessoa em CSS. Se não existe personagem na mídia da marca, use o corpo do próprio fundador (passo 1). Se não existe rosto do fundador, a explosão vira a marca da empresa num bloco de papel.

## Mecânica

Interpolação em degraus e aleatório com semente (sem `Math.random`):

```js
const tl = gsap.timeline({ paused: true });
const STEP = 1 / 12, st = (d) => `steps(${Math.max(1, Math.round(d * 12))})`;
const R = (seed) => () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
  let r = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r; return ((r ^ (r >>> 14)) >>> 0) / 4294967296; };
```

Fios de marionete recalculados a cada quadro. Três divs de fio (`.str { position:absolute; width:1.6px; transform-origin:50% 0 }`) são reapontadas a cada busca por uma interpolação fantasma que abrange o filme todo:

```js
const S = { on: 0, t: 0 };
function strings() {
  const cb = document.getElementById("cross").getBoundingClientRect();
  const hd = document.getElementById("head").getBoundingClientRect();   // an empty div over the puppet head
  const bd = document.getElementById("body").getBoundingClientRect();
  const tops = [[cb.left + 30, cb.top + 135], [cb.left + cb.width / 2, cb.top + 50], [cb.right - 30, cb.top + 135]];
  const bots = [[bd.left + bd.width * .2, bd.top + bd.height * .32], [hd.left + hd.width / 2, hd.top + 6], [bd.left + bd.width * .8, bd.top + bd.height * .32]];
  ["#s1", "#s2", "#s3"].forEach((s, i) => {
    const [x1, y1] = tops[i], [x2, y2] = bots[i];
    gsap.set(s, { left: x1, top: y1, height: Math.hypot(x2 - x1, y2 - y1),
      rotation: Math.atan2(x1 - x2, y2 - y1) * 180 / Math.PI, opacity: S.on }); });
}
tl.to(S, { t: 1, duration: FILM_LENGTH, ease: "none", onUpdate: strings }, 0);
tl.to(S, { on: 1, duration: 0.01 }, 1.5);   // strings appear once the cross is in
tl.to(S, { on: 0, duration: 0.01 }, 6.4);   // the hand lets go
```

O puxão e o balanço atrasado:

```js
const r = R(3);
for (let t = 2.0; t < 5.0; t += 0.5) {
  const sw = (r() - .5) * 14;
  tl.to(["#hand", "#cross"], { rotation: sw, x: sw * 3, duration: 0.17, ease: st(0.17) }, t);
  tl.to("#puppet", { rotation: -sw * .8, x: sw * 4, y: Math.abs(sw) * 2, duration: 0.25, ease: st(0.25) }, t + 0.08);
}
for (let t = 1.0; t < 6.3; t += STEP * 2) tl.set(".xx", { rotation: (r() - .5) * 6, x: (r() - .5) * 4 }, t);  // boil
```

A estrutura do fantoche: `#puppet { transform-origin: 250px 0; scale: 1.45 }` para ele balançar de onde os fios se encontram; a div da cabeça e os olhos em X ficam dentro dele para balançarem junto.

Picos na camada de rochas (generalizado: N picos com semente):

```js
function peaks(n, seed, lo = 4, hi = 32) { const r = R(seed), p = [];
  for (let i = 0; i <= n * 2; i++) p.push(`${(i / (n * 2) * 100).toFixed(1)}% ${(i % 2 ? hi - r() * 8 : lo + r() * 14).toFixed(1)}%`);
  return `polygon(${p.join(",")}, 100% 100%, 0 100%)`; }
document.getElementById("rocks").style.clipPath = peaks(4, 9);
// the proof used: polygon(0 32%, 14% 18%, 24% 26%, 38% 4%, 52% 22%, 62% 12%, 74% 28%, 86% 10%, 100% 24%, 100% 100%, 0 100%)
```

Entrada com explosão de um elemento escondido (visibilidade no código da página, revelada pela linha do tempo):

```js
tl.set("#realhead", { visibility: "visible" }, 5.0);
tl.fromTo("#realhead", { scale: .2, rotation: -40, y: -220 }, { scale: 1, rotation: 0, y: 0, duration: .33, ease: st(.33) }, 5.0);
tl.set("#xx", { visibility: "hidden" }, 5.08);
```

Palavra batida em dois quadros:

```js
document.querySelectorAll("#word .w").forEach((w, i) =>
  tl.fromTo(w, { opacity: 0, scale: 1.4 }, { opacity: 1, scale: 1, duration: .17, ease: st(.17) }, 7.0 + i * .25));
```

## Adaptar a uma marca

Vem da marca: o fantoche (o seu próprio personagem), a cabeça do fundador, a manchete (2 linhas, de 3 a 5 palavras, um verbo sobre controle: “Pare de ser o fantoche”, “Corte os fios”, “Comande o seu show”), a fonte de destaque e o seu peso mais pesado, a cápsula do endereço, a marca se usada. Os olhos em X podem assumir a cor de destaque da marca se ela for quente e viva; senão, mantenha `#F2C21A`.

Fica fixo: o fundo de papel quadriculado, os recortes em tons de cinza, o sol mostarda, a mão desenhada em sépia, a cruz de madeira, as rochas cinza, o ritmo em dois quadros, o ritmo dos trancos (a cada 0,5 s), a manchete em quase preto. Não tinja o fundo com a cor da marca: os tons de cinza são o que faz a cabeça saltar.

## Armadilhas encontradas durante a construção

- Um `gsap.set` feito no carregamento, antes de a linha do tempo ser registrada, é sobrescrito quando o HyperFrames busca um ponto. Esconda os elementos tardios com `visibility:hidden` no código da página e revele-os com `tl.set`.
- `immediateRender: true` na queda do fantoche, ou o quadro 0 o mostra no lugar final por um quadro.
- A ordem das camadas importa: a camada de rochas fica acima da estrutura para o fantoche afundar atrás dos picos. Na prova, a marca foi posta em y 1520 dentro da estrutura e as rochas a esconderam por completo; tudo o que precisa ser visto no final fica acima das rochas no DOM.
- As âncoras dos fios são medidas com `getBoundingClientRect`, então incluem a escala e a rotação do fantoche; ancore-as a uma div vazia da cabeça, não à imagem, ou elas pousam em pixels transparentes.
- Um recorte tirado de um fundo colorido mantém uma borda dessa cor; tons de cinza a escondem, cores não. Recorte de novo os recortes coloridos a partir de um quadro com fundo neutro.
- A imagem parada do vídeo é macia e levemente borrada de movimento nas bordas; a escala 1,45x mostra isso. Escolha o quadro mais nítido, e o movimento em degraus faz a maciez ser lida como impressão.
- O texto fica dentro da sua cápsula: rode `scripts/frame-audit.mjs`; um endereço longo a 44 px exige que a cápsula cresça, nunca que ultrapasse a largura de 1080 com margens abaixo de 60 px.

## Som

96 BPM, brincalhão. Pop nas rochas (0,0) e no sol (0,2), whoosh na queda do fantoche (0,7), pop na mão (1,1), um tick seco em cada tranco (2,0, 2,5 ... 4,5), pop na explosão da cabeça (5,0) e na bola de papel (5,2), o único golpe na revelação (5,75), whoosh quando a mão solta (6,4), um pop por palavra (7,0, 7,25, 7,5, 7,75), shimmer no endereço (8,2).
