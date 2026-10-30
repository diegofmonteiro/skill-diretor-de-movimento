# Estúdio: receita

Uma peça de estúdio de design de 5,4 segundos em três batidas sobre um fundo brilhante de uma só cor: a frase da própria marca salta palavra por palavra enquanto um traço branco se desenha embaixo e um cursor de designer arrasta uma caixa de seleção em volta da última palavra, que se inverte; uma pasta de vidro sobe, gira, e três telas reais do produto sobem e se abrem em leque saindo dela, atrás de uma frente fosca com o nome da marca, com a luz correndo pelo vidro; uma esfera-lente de vidro entra rolando com a marca dentro e o domínio salta embaixo. Funciona porque só existe UMA coisa para olhar de cada vez, o objeto é tratado como foto de produto (gira, pega luz), toda chegada tem mola, e o próprio fundo é energia (um radial aceso, um raio de sol girando, duas manchas orgânicas derivando nos cantos), então nenhum quadro é estático. Estenda para um filme de 15 a 25 s repetindo a mesma gramática de três partes (afirmação + ferramenta, objeto-herói, marca) com mais objetos-herói, um por compasso.

## Formato, duração, ritmo

- 1920x1080, 30 fps, 5,4 s. (O 9:16 funciona: os mesmos objetos a 60% da largura do quadro, título de 96 a 110 px.)
- Três cenas que se sobrepõem em 0,15 a 0,2 s para a saída de uma e a entrada da seguinte dividirem quadros (sem quadro vazio no meio):
  - c1 afirmação: 0,00-1,95 s
  - c2 pasta-herói: 1,75-4,05 s
  - c3 cartão final com esfera: 3,90-5,40 s
- Batidas medidas na fonte: o título salta 0,15-0,66 s, o traço se desenha 0,05-0,75 s, o cursor desliza 0,62-1,07 s, a seleção é arrastada 1,10-1,42 s, a palavra se inverte em 1,12 s, as ferramentas saem em 1,72 s, o título se afasta em 1,75 s, a pasta salta em 1,80 s, a frente balança em 2,05 s, os cartões abrem em leque 2,25-2,85 s, o brilho 2,80-3,70 s, a pasta some em 3,85 s, a esfera rola 3,90-4,65 s, o carimbo em 4,65 s, o domínio salta em 4,25 s.
- Ritmo para um filme mais longo: um objeto-herói a cada 2 a 4 s, mantido como um plano contínuo que continua se movendo; as transições são sair com um salto e entrar com um salto, nunca um corte seco.

## O visual, em números

**Fundo** (`.st-ground`, `theme.css`): `radial-gradient(75% 85% at 50% 42%, --st-hi 0%, --st-mid 30%, --st-deep 78%)`, onde `--st-hi` = destaque misturado a 62% com branco, `--st-mid` = destaque, `--st-deep` = destaque a 22% sobre `#050506`. Na tela: um centro salmão brilhante, o anel da cor de destaque, um vermelho quase preto nos cantos. Variante monocromática `.is-mono`: `#ECECEC` com uma grade de pontos de 28 px (pontos de 1,4 px a 13% de preto), tinta `#141414`.

**Raio de sol** (`.st-burst`): disco de 3000 px centralizado em 50% 44%, `repeating-conic-gradient` de 24 raios (7,5 graus de branco a 7,5%, 7,5 graus transparentes), mascarado por um esmaecimento radial até 62%. Gira 10 graus/s durante o filme todo.

**Manchas** (`.st-blob`, `MD.studio.blob`): formas de flor com semente num SVG, r 0,42, profundidade das pétalas 0,38. No alto à esquerda: 980 px, 5 pétalas, semente 4, preenchimento `--st-deep`, em left -300 top -340. Embaixo à direita: 760 px, 6 pétalas, semente 9, branco a 90%, em left 1440 top 600. As duas terminam de 30 a 50% fora do quadro.

**Traço** (`.st-swoosh`): um caminho branco, traço de 16 px a 92%, pontas redondas, pelo terço de baixo: `M-60 860 C 400 700, 760 980, 1180 780 S 1760 560, 1990 640`.

**Tipografia** (`.st-title`): fonte de destaque da marca, peso 800, espaçamento -0.02em, entrelinha 0.98, branco, `text-shadow 0 10px 40px` em `--st-deep` a 60%, sem quebra. Tamanhos: afirmação 128 px em 2 linhas centralizadas em top 360 (o theme-board ajusta `HEAD_SIZE` a 1500 px); domínio 72 px centralizado em top 760. Maiúsculas e minúsculas de frase. A palavra selecionada: caixa branca, texto em `--st-deep`. Regra: a tipografia é ou enorme ou minúscula e editorial, nunca média.

**Seleção e cursor**: `.st-select` tracejado branco de 3 px a 95%, quatro alças brancas de 16 px com borda de 3 px `--st-deep` nos cantos (deslocadas -10 px); folga de 18 px em volta da caixa medida da palavra. `.st-cursor` seta SVG de 64 px, preenchimento branco, contorno `#111` de 3 px, sombra `0 6px 10px` a 35% de preto.

**Pasta de vidro** (`.st-folder`, 800x640 em left 560 top 150, `transform-style: preserve-3d` num palco com perspectiva de 1800 px):
- fundo: raio de 40 px, `linear-gradient(170deg, --st-hi 85%, --st-mid 80% on black)`, uma aba recortada por `clip-path: polygon(0 9%, 3% 0, 34% 0, 39% 9%, 100% 9%, 100% 100%, 0 100%)`, realce interno superior de 2 px a 50% de branco.
- cartões: 76% x 74% em left 12% top 12%, raio de 22 px, brancos, `object-fit: cover; object-position: top center`, sombra `0 20px 40px -14px` a 50% de preto, origem embaixo no centro.
- frente: 104% de largura, 62% de altura, bottom -2%, raio de 40 px, `linear-gradient(160deg, white 34%, white 7% at 55%, --st-hi 22%)`, `backdrop-filter: blur(14px) saturate(170%)`, borda `inset 0 1.5px 0` a 75% de branco + `inset 0 0 0 1.5px` a 28% de branco, sombra `0 40px 80px -30px` a 55% de preto, brilho `0 0 60px -10px --st-hi` a 50%. Rótulo embaixo à esquerda em 7%/12%: a marca com 56 px de altura (raio de 12 px) + o nome da marca, 700 40 px, branco.
- brilho: uma faixa de 105 graus, branco a 45%, 32% de largura, mistura screen, controlada por `--sheen` de -40% a 140%.

**Esfera de vidro** (`.st-orb`, 520 px em left 700 top 170): `radial-gradient` transparente até 58%, anel de branco a 22% em 72%, `backdrop-filter: blur(3px) saturate(180%)`, `inset 0 0 0 2px` a 80% de branco, `inset 0 0 50px` a 35% de branco, brilho externo `0 0 70px --st-hi` a 70%, sombra `0 50px 90px -30px` a 60%; uma elipse de brilho especular (46% x 26% em 14%/8%, girada -24 graus). A marca dentro a 56%, raio de 18%, sombra `0 8px 18px` a 35%.

Sem granulação nem vinheta neste tema: o radial do fundo faz a vinheta.

## Lista de planos

| tempo | na tela | o que se move e como | estático | saída |
|---|---|---|---|---|
| 0-1,95 afirmação | fundo, raio de sol, duas manchas; o slogan da marca (2 linhas, 128 px, a última palavra envolvida em `.st-hl`); o traço branco; o cursor; a caixa de seleção | manchas: `scale 0.3 para 1, rotation -40 para 0, opacity 0 para .9, 1,1 s expo.out`, defasagem de 0,15 a partir de 0, depois giram +35 / -30 graus e deslizam x +40 / -50 linearmente até o fim; título `pop@0.15` (por palavra: scale 0,2 a 1, y 50 a 0, 0,42 s back.out(2), 0,06 s de intervalo); o traço se desenha de 0,05 a 0,75 s power2.inOut e se apaga a partir do início em 1,35 s; o cursor aparece em 1500,900 em 0,6 s e desliza até o canto inferior direito da palavra (+6, -6) em 0,45 s power3.inOut; a caixa de seleção é arrastada do canto superior esquerdo em 0,32 s power3.out em 1,1 s; a palavra se inverte em 1,12 s (fundo branco em 0,12 s, texto para `--st-deep`) | o raio de sol girando, o título depois de pousar | cursor + caixa somem em 0,15 s em 1,72 s; o título faz `zoom` para fora (scale 1,7, blur 14, 0,25 s) em 1,75 s |
| 1,75-4,05 herói | a pasta de vidro, 3 telas reais dentro | a pasta salta em 1,8 s: `scale 0.4 para 1, rotation -10 para 0, y 120 para 0, opacity 0 para 1, 0,55 s back.out(1.8)`; a pasta gira `rotationY -14 para +10` em 2,2 s power1.inOut; a frente balança para cima `rotationX -55 para -8` 0,6 s back.out(1.5) em 2,05 s; os cartões sobem e abrem em leque, com 0,09 s de intervalo a partir de 2,25 s, 0,6 s back.out(1.6): esquerda `y -160, xPercent -32, rotation -9`, centro `y -220`, direita `y -160, xPercent +32, rotation 9`; brilho pela frente em 2,8 s, 0,9 s power2.inOut | o fundo | a pasta faz `unpop` (scale 0, back.in(1.6), 0,25 s) em 3,85 s |
| 3,9-5,4 final | a esfera com a marca; o domínio embaixo dela | a esfera entra rolando pela direita: `x 1100 para 0, rotation 220 para 0, scale 0.6 para 1, 0,75 s back.out(1.3)`; carimbo 1,06 para 1 em 4,65 s; domínio `pop@4.25` | o raio de sol continua girando, as manchas continuam derivando | parado até o fim |

## Materiais e onde obtê-los para uma marca nova

| material | fonte | como |
|---|---|---|
| cor de destaque, fonte de destaque, marca, nome, domínio | o site da marca | `node scripts/brand-intake.mjs <url> --project <dir>` e depois `pick --logo --mark --shots` |
| slogan | a manchete principal do site, literal, dividida de modo que a última palavra seja a selecionada | o theme-board preenche `HEAD_L1`, `HEAD_L2`, `LAST` |
| 3 telas para a pasta | a própria interface do produto (brand-intake `--shots`), recortes quase em retrato de páginas reais; seções do site capturadas com 1440 de largura servem quando a interface está atrás de um login | corte cada uma em cerca de 4:3 a partir do alto, para a manchete de cada uma aparecer acima da frente de vidro |
| a marca para a esfera e o rótulo | a marca quadrada da empresa; corte até a tinta com `node scripts/trim-alpha.mjs mark.png mark.png --pad 8` para ela preencher a caixa de 56% | uma marca que é só um nome escrito: ponha o nome escrito dentro, com 70% da largura |
| todo o resto | código (`theme.css`, `theme.js`) | nada é baixado |

Se a marca não tem telas de produto: ponha na pasta três coisas reais que a marca faz (miniaturas do YouTube cortadas em 4:3, logos de clientes em cartões brancos, capas de artigos). Se não tem marca quadrada: use a esfera para um número (a cifra enorme dentro da lente) e termine no nome escrito saltando embaixo dela. Uma marca clara: mantenha o fundo colorido (é a própria cor de destaque da marca, acesa), ou use `.is-mono` com manchas pretas e tinta.

Para um filme mais longo, mais objetos-herói de fontes gratuitas: `node scripts/find-assets.mjs --polyhaven model <id> --out <dir>` e depois `node scripts/prop-render.mjs <model.gltf> prop.png --rx -15 --ry 30 --fill 0.8` (um objeto 3D real no ângulo que o plano pede; `--screen shot.png` põe uma captura real num modelo de aparelho). Trate-o como o herói: salto, giro, brilho.

## Mecânica

Os movimentos estão em `theme.js` (`MD.studio`), os materiais em `theme.css`. A montagem essencial:

```html
<div class="st-ground"></div>
<div class="st-burst" id="burst"></div>
<svg class="st-blob" id="b1" style="left:-300px;top:-340px;width:980px;height:980px"></svg>
<svg class="st-blob is-light" id="b2" style="left:1440px;top:600px;width:760px;height:760px"></svg>

<section id="s1" class="clip scene" data-start="0" data-duration="1.95">
  <svg class="st-swoosh" width="1920" height="1080" viewBox="0 0 1920 1080" style="left:0;top:0">
    <path id="s1-swp" d="M-60 860 C 400 700, 760 980, 1180 780 S 1760 560, 1990 640" /></svg>
  <h1 class="st-title md-line" id="s1-h" style="left:0;right:0;top:360px;text-align:center;font-size:128px"
      data-in="pop@0.15" data-out="zoom@1.75">LINE ONE<br>LINE TWO <span class="st-hl" id="s1-last">LAST</span></h1>
  <div class="st-select" id="s1-sel"><i></i><i></i><i></i><i></i></div>
  <svg class="st-cursor" id="s1-cur" viewBox="0 0 64 64"><path d="M10 6 L10 52 L22 41 L31 60 L39 56 L30 38 L46 38 Z"
       fill="#fff" stroke="#111" stroke-width="3" stroke-linejoin="round"/></svg>
</section>

<section id="s2" class="clip scene" data-start="1.75" data-duration="2.3"><div class="stage">  <!-- perspective: 1800px -->
  <div class="st-folder" id="fold" style="left:560px;top:150px;width:800px;height:640px">
    <div class="st-back"></div>
    <div class="st-card" id="k1"><img src="assets/shots/shot-1.png" alt="" /></div>
    <div class="st-card" id="k2"><img src="assets/shots/shot-2.png" alt="" /></div>
    <div class="st-card" id="k3"><img src="assets/shots/shot-3.png" alt="" /></div>
    <div class="st-front" id="front"><div class="st-label"><img src="assets/mark.png" alt="" /><span>NAME</span></div></div>
  </div></div>
</section>

<section id="s3" class="clip scene" data-start="3.9" data-duration="1.5">
  <div class="st-orb" id="orb" style="left:700px;top:170px;width:520px;height:520px"><div class="st-in"><img src="assets/mark.png" alt="" /></div></div>
  <h2 class="st-title md-line" id="s3-n" style="left:0;right:0;top:760px;text-align:center;font-size:72px" data-in="pop@4.25" data-out="end">DOMAIN</h2>
</section>
```

```js
const tl = gsap.timeline({ paused: true });
const S = MD.studio;
S.blob(document.getElementById("b1"), { petals: 5, seed: 4 });
S.blob(document.getElementById("b2"), { petals: 6, seed: 9 });
// the selection box is placed on the word's MEASURED rect, before the line is split
const rb = document.getElementById("s1-last").getBoundingClientRect(), pad = 18;
Object.assign(document.getElementById("s1-sel").style, { left: `${Math.round(rb.left - pad)}px`, top: `${Math.round(rb.top - pad + 8)}px`,
  width: `${Math.round(rb.width + pad * 2)}px`, height: `${Math.round(rb.height + pad * 2 - 16)}px` });
MD.lines(tl);

S.turn(tl, "#burst", 0, 5.4, 10);
tl.fromTo(["#b1", "#b2"], { scale: 0.3, rotation: -40, opacity: 0 }, { scale: 1, rotation: 0, opacity: 0.9, duration: 1.1, stagger: 0.15, ease: "expo.out" }, 0);
tl.to("#b1", { rotation: 35, x: 40, duration: 4.3, ease: "none" }, 1.1);
tl.to("#b2", { rotation: -30, x: -50, duration: 4.15, ease: "none" }, 1.25);

// claim: stroke, cursor, selection, the word inverts
S.swoosh(tl, "#s1-swp", 0.05, 0.7, 1.35);
S.cursor(tl, "#s1-cur", [{ x: 1500, y: 900, at: 0.6 }, { x: rb.right + 6, y: rb.bottom - 6, at: 0.62, dur: 0.45 }]);
S.select(tl, "#s1-sel", 1.1);
tl.fromTo("#s1-last", { color: "#ffffff" }, { color: "var(--st-deep)", duration: 0.01 }, 1.12);
tl.fromTo("#s1-last", { backgroundColor: "rgba(255,255,255,0)" }, { backgroundColor: "rgba(255,255,255,1)", duration: 0.12 }, 1.12);
tl.to(["#s1-sel", "#s1-cur"], { opacity: 0, duration: 0.15 }, 1.72);

// hero: pop, front swings, cards fan, light runs, the object turns
S.pop(tl, "#fold", 1.8, { from: 0.4, dur: 0.55, y: 120 });
[["#k1", -16, -160, -9], ["#k2", 0, -220, 0], ["#k3", 16, -160, 9]].forEach(([k, x, y, r], i) =>
  tl.fromTo(k, { yPercent: 0, xPercent: 0, rotation: 0 }, { y, xPercent: x * 2, rotation: r, duration: 0.6, ease: "back.out(1.6)" }, 2.25 + i * 0.09));
tl.fromTo("#front", { rotationX: -55 }, { rotationX: -8, duration: 0.6, ease: "back.out(1.5)" }, 2.05);
S.sheen(tl, "#front", 2.8, 0.9);
tl.fromTo("#fold", { rotationY: -14 }, { rotationY: 10, duration: 2.2, ease: "power1.inOut" }, 1.8);
S.unpop(tl, "#fold", 3.85, 0.25);

// end: the lens rolls in
tl.fromTo("#orb", { x: 1100, rotation: 220, scale: 0.6 }, { x: 0, rotation: 0, scale: 1, duration: 0.75, ease: "back.out(1.3)" }, 3.9);
MD.stamp(tl, "#orb", 4.65, 0.06);

MD.finish(tl);
window.__timelines = window.__timelines || {};
window.__timelines["main"] = tl;
```

Os movimentos em si (de `theme.js`):

```js
// pop: springy arrival; unpop: back.in exit
tl.fromTo(el, { scale: from, rotation: rot - 10, y, opacity: 0 }, { scale: 1, rotation: rot, y: 0, opacity: 1, duration: dur, ease: "back.out(1.8)" }, t);
tl.to(el, { scale: 0, opacity: 0, duration: 0.22, ease: "back.in(1.6)" }, t);
// swoosh: dash the path to its length, draw on, then off from its start
p.style.strokeDasharray = `${len} ${len}`;
tl.fromTo(p, { strokeDashoffset: len }, { strokeDashoffset: 0, duration: dur, ease: "power2.inOut" }, t);
tl.to(p, { strokeDashoffset: -len, duration: dur * 0.8, ease: "power2.in" }, off);
// select: drag from the top-left corner
tl.fromTo(el, { scaleX: 0, scaleY: 0, transformOrigin: "0% 0%", opacity: 1 }, { scaleX: 1, scaleY: 1, duration: 0.32, ease: "power3.out" }, t);
// cursor click: a squash 0.82 for 0.07s, yoyo once, at the end of the glide
tl.fromTo(el, { scale: 1 }, { scale: 0.82, duration: 0.07, yoyo: true, repeat: 1, ease: "power2.out", immediateRender: false }, at + dur);
// line entrance pop@t: per word, scale 0.2, y 50, 0.42s back.out(2), 0.06s apart
```

## Adaptar a uma marca

Vem da marca: a cor de destaque (ela É o fundo, o fundo da pasta e o brilho), a fonte de destaque, o slogan e a sua palavra-chave, três telas reais, a marca, o nome na frente de vidro, o domínio. Fica fixo: um herói de cada vez, centralizado, com 45 a 60% da altura do quadro; curvas com mola (`back.out` 1,3 a 2 em toda chegada, `back.in` nas saídas); o raio de sol girando e as manchas derivando; a caixa de seleção medida, nunca no olho; um brilho por objeto; o final com a esfera. Uma cor de destaque muito escura (azul-marinho, preto): o fundo é lido como um radial escuro, então aumente `--st-hi` para 75% de branco no centro. Uma cor de destaque muito clara (amarelo, menta): troque a tinta do título por `--st-deep` e o traço por `--st-deep`, ou use `.is-mono`.

## Armadilhas encontradas durante a construção

- O quadro 0 é fundo vazio na amostra (o título salta em 0,15 s, as manchas começam em scale 0,3). Num filme, a verificação do quadro 0 da crítica quer tinta: comece o primeiro salto em 0 ou traga o objeto do plano anterior.
- Meça a caixa de seleção a partir de `getBoundingClientRect()` da palavra ANTES de `MD.lines(tl)` dividir a linha e antes de qualquer transformação; depois da divisão o retângulo é por palavra, e depois do salto ele está escalado.
- A palavra invertida muda fundo e cor no mesmo quadro (1,12 s); esmaecer a cor é lido como falha. Mantenha a definição de cor de 0,01 s.
- `st-hl` precisa ser `display: inline-block` para a caixa branca abraçar a palavra e o retângulo da seleção ser uma caixa só, não um fragmento de linha.
- O vidro da frente desfoca o que está atrás dele (`backdrop-filter`), então os cartões só aparecem nítidos acima da frente; abra-os alto o bastante (y -160 a -220) para a manchete de cada tela ficar livre do vidro. Uma frente em PNG os esconderia por completo.
- As linhas do título precisam caber em 1500 px no tamanho escolhido (o theme-board calcula `HEAD_SIZE`); rode `node scripts/frame-audit.mjs <filme>` para nenhuma palavra sair do quadro enquanto a pasta ou a esfera se sobrepõe.
- Sobreponha as cenas em 0,15 a 0,2 s (1,75 / 1,95, 3,85 / 3,9) para um `unpop` e o salto seguinte dividirem quadros.
- O cursor nunca pode ser um emoji ou um ícone do sistema: é o SVG desenhado de 64 px.

## Som

Não medido na amostra. Planejado: quente, de 100 a 120 BPM; um pop suave em cada palavra e na chegada da pasta e da esfera, um clique onde o cursor para na palavra (1,07 s), um whoosh quando o traço se desenha, um shimmer de vidro no brilho (2,8 s), um golpe suave no carimbo da esfera (4,65 s).
