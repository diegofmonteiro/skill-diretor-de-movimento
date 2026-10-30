# Impressão retrô: um pôster em risografia que ferve

Um pôster quadrado em loop de 9 segundos, impresso em dois vermelhos sobre papel creme. Um painel de raio de sol em dois vermelhos gira atrás de um computador antigo, bege, com um rosto de pixels sorridente; um cursor de pixels clica nele, um brilho estoura, o computador encolhe e some nos raios; e então BUM: o painel cai, um título extrudado bate acima dele, o computador volta enorme e inclinado com o conteúdo da marca na tela de pixels, e um anel de objetos de contorno grosso (raios, um cronômetro, uma ampulheta, um cursor de pixels, uma folha quadriculada, quadrados de pixels) estoura por trás dele. Tudo treme em dois quadros enquanto o cronômetro marca e a tela troca as imagens, e então tudo colapsa e toca de novo. A ideia que faz funcionar: toda borda do quadro rasteja como tinta de risografia porque um único filtro de deslocamento SVG muda a sua semente de ruído a cada 1/12 s, de modo que formas vetoriais chapadas são lidas como um objeto impresso e vivo, e cada batida é um verbo físico (clicar, encolher, cair, bater, estourar, marcar, colapsar).

## Formato, duração, ritmo

- 1080x1080 (1:1), 30 fps, 9,0 s. Dois ciclos: o ciclo 1 a partir de 0,0, o ciclo 2 a partir de 4,4 (o último fica parado em vez de colapsar). Fecha o loop limpo como publicação. Para 9:16, estique o painel para 980x1300 e ponha o título acima dele.
- Um quadro contínuo, sem cortes; a moldura editorial nunca se move.
- Tudo em dois quadros: `steps(round(duration * 12))`. Os raios giram `steps(108)` em 9 s (0,5 grau por passo, 6 graus/s).
- Batidas medidas por ciclo (t0 = 0 ou 4,4): +0,25 o cursor desliza para dentro, +0,85 clique e brilho, +1,25 a tela apaga e o computador encolhe, +1,8 o painel cai, o título bate, o computador volta grande, os objetos estouram (+1,85 a +2,13, defasagem de 0,04 s), +2,0 subtítulo, +2,3 a +3,9 pausa trêmula (o cronômetro marca a cada 0,25 s, quadros da tela em +2,0 / +3,0 / +3,5), +4,1 colapso.

## O visual em números

| elemento | valor |
|---|---|
| papel | fundo creme `#FCE9CB`; manchas: `feTurbulence` fractalNoise baseFrequency .012, 3 oitavas, tingido (.8,.55,.35) alfa .35, multiply, opacidade .5 |
| pintas | `feTurbulence` baseFrequency .9, 2 oitavas, linhas da matriz de cor (.55, .3, .15) e alfa `1.4 -.55` (só as pintas mais escuras sobrevivem), multiply, opacidade .55, sobre tudo |
| tinta fervendo | `filter: url(#rough)` no painel, nos objetos e no título: `feTurbulence fractalNoise .9, 2 oitavas` para um `feDisplacementMap scale 5`, região do filtro -5%/110% |
| painel | 980x700 em (50,150), `overflow:hidden`, um disco de 1900 px de `repeating-conic-gradient(#C23A22 0 9deg, #E16A49 9deg 18deg)`: 40 raios, 9 graus cada, dois vermelhos |
| tinta do contorno | `#160c0a` (preto quente); todo objeto tem uma cópia preta sólida deslocada +10,+12 atrás dele (a sombra dura de impressão), nunca uma sombra desfocada |
| cores fixas | amarelo `#FFC93C` (raios, subtítulo), pêssego `#E8977A` (mostrador do cronômetro, faixa do computador), creme `#FCE9CB` (corpos dos objetos, para serem lidos como papel aparecendo), branco `#FFFFFF` (cursor, brilho, quadrados de pixels), vermelho editorial `#D9573F` |
| título | fonte de destaque da marca, peso 900, `font-stretch:125%`, 122 px, entrelinha .9, espaçamento -0.01em, MAIÚSCULAS, preenchimento na cor de destaque da marca, extrusão de 9 sombras de texto em passos de 2 px a 18 px em `#160c0a`, centralizado em top 96 |
| subtítulo | fonte de destaque da marca 900, estiramento 112%, 64 px, minúsculas, `#FFC93C`, `-webkit-text-stroke: 4px #160c0a; paint-order: stroke fill`, sombra `4px 5px 0 #160c0a`, centralizado em top 232 (sobrepõe a borda de cima do painel) |
| moldura editorial | barra de etiqueta 380x44 `#D9573F` rente à esquerda em top 30, com uma faixa de 120 px recortada com `repeating-linear-gradient(115deg, transparent 0 14px, cream 14px 22px)` na ponta direita; usuário (o domínio) 22 px peso 500 `#2a1712` em (40,39); um filete de 5 px `#D9573F` com pontas redondas de x 440 a 950 em top 50; número da edição `#01` à direita em 40; embaixo: uma chamada à esquerda ("<coisa> da semana"), um filete de x 300 a 880, uma periodicidade à direita ("Todo vídeo") em bottom 34 |
| objetos | o computador 440x440, cronômetro 300x320, raios 290x250 e 260x230, ampulheta 140x200, cursor de pixels 230x250 (`shape-rendering: crispEdges`), folha quadriculada 700x560 desenhada com linhas creme de 5 px, dois quadrados de pixels de 60 e 50 |

Regra de cor: dois vermelhos, um amarelo, creme, preto quente, detalhes em branco. Nenhum degradê além do ruído do papel. A cor de destaque da marca preenche o título e o vermelho da tela de pixels; se a cor de destaque da marca não for vermelha nem laranja, o painel fica nos seus dois vermelhos e a cor de destaque vai só para o título.

## Lista de planos (um ciclo; o filme tem dois)

| tempo (a partir de t0) | na tela | o que se move e como | estático | saída |
|---|---|---|---|---|
| 0,0-1,25 | painel em (50,150) 980x700, o computador em `y 30, scale 1.05, rotation -6` com a tela sorridente, moldura editorial | cursor `x 180 para 130, y 240 para -70`, 0,5 s `steps(6)` a partir de +0,25; clique: `scale .7 para .6` 0,08 s em +0,8, de volta em +0,9; brilho `scale 0 para 1, rotation 0 para 45`, 0,25 s `steps(3)` em +0,85, saída `scale 0` 0,17 s em +1,15; cursor some em +1,0 | painel, moldura, o computador | a tela fica preta em +1,25 |
| 1,25-1,8 | o computador sozinho, tela apagada | `scale 1.05 para .32, rotation -6 para 8, y 10`, 0,5 s `steps(6)`: ele cai e some nos raios | os raios continuam girando | a queda |
| 1,8-2,3 | título, subtítulo, painel mais baixo, computador enorme, explosão | painel `top 150 para 250, height 700 para 720`, 0,17 s `steps(2)`; título `scale 1.6 para 1, y -40 para 0, opacity 0 para 1`, 0,25 s `steps(3)`; subtítulo `scale .4 para 1`, 0,25 s `steps(3)` em +2,0; computador `scale 1.42, rotation -16, y 110, x -10`, 0,25 s `steps(3)`; cada objeto de `-2.2x` do seu deslocamento, `scale .2, rotation -30` até a sua posição, 0,33 s `steps(4)`, com 0,04 s entre eles; quadro 1 da tela (envelope) em +2,0 | moldura editorial | nenhuma |
| 2,3-4,1 | o pôster completo | a cada 1/6 s cada objeto e o computador se movem `+-2px` em x e y (com semente); o ponteiro do cronômetro salta para 8 posições com 45 graus de distância a cada 0,25 s; quadros da tela: botão de tocar em +3,0, envelope em +3,5 | título, subtítulo, painel | o colapso |
| 4,1-4,4 | painel de volta para cima, computador minúsculo | título, subtítulo e objetos `opacity 0` na hora; painel de volta a `top 150, height 700` e computador a `scale .3, rotation 6, y 20`, 0,17 s `steps(2)` | raios | o ciclo 2 começa em 4,4 |

O último ciclo mantém o seu pôster trêmulo de +2,3 até o fim (4,2 s de tremor em vez de 3,9) e nunca colapsa.

## Materiais e onde obtê-los para uma marca nova

Tudo é desenhado em SVG na página: sem fotos, sem downloads. Este tema é a exceção a "material real em vez de desenhado": uma impressão em risografia É formas chapadas desenhadas, e a fervura as torna físicas.

- **O que é da marca**: a fonte de destaque (o peso mais pesado; um corte largo ou estendido é o melhor, `font-stretch:125%` se a fonte for variável), a cor de destaque para o título, o domínio para o usuário, um título curto (uma ou duas palavras, com menos de cerca de 900 px de largura a 122 px: "A CARTA", "NOVIDADE"), um subtítulo em minúsculas (uma palavra), um número de edição, uma chamada e uma periodicidade.
- **A tela de pixels** carrega a história da marca em 3 quadros numa grade de pixels de 12 px desenhada com retângulos `<path>`: o quadro 0 é o "antes" (um sorriso, a marca), o quadro 1 é o produto (um envelope para uma newsletter, um balão de conversa, um carrinho), o quadro 2 é o desfecho na cor de destaque (um botão de tocar, uma marca de verificação, a logo em pixels). Traduza a marca da empresa para uma grade de 10x10 ou 12x12 no quadro 2.
- **Os objetos** são os adereços da promessa da marca, cada um uma silhueta simples em creme ou amarelo com uma cópia preta deslocada: tempo (cronômetro, ampulheta), velocidade (raios), cliques (cursor de pixels), estrutura (folha quadriculada). Troque-os pelos da marca: uma moeda e um gráfico para finanças, um microfone e uma forma de onda para áudio. Mantenha de 6 a 8 deles.
- **Material faltando**: se a marca não tem fonte de destaque com um peso pesado, use a grotesca mais pesada incluída no peso 900; nunca uma fonte fina, a extrusão precisa de massa.

## Mecânica

Dois quadros e aleatório com semente:

```js
const tl = gsap.timeline({ paused: true });
const STEP = 1 / 12, st = (d) => `steps(${Math.max(1, Math.round(d * 12))})`;
const R = (seed) => () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
  let r = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r; return ((r ^ (r >>> 14)) >>> 0) / 4294967296; };
```

O filtro rough e a sua semente fervendo (o coração do visual):

```html
<svg width="0" height="0" style="position:absolute">
  <filter id="rough" x="-5%" y="-5%" width="110%" height="110%">
    <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="3" result="n"/>
    <feDisplacementMap in="SourceGraphic" in2="n" scale="5"/>
  </filter>
</svg>
```

```js
const turb = document.querySelector("#rough feTurbulence");
for (let t = 0, k = 0; t < FILM_LENGTH; t += STEP, k++) tl.set(turb, { attr: { seed: 3 + (k % 7) } }, t);
```

Sete sementes em rodízio bastam; mais é lido como ruído, menos como um loop. Mantenha `scale` em 4 a 6: mais que isso rasga a tipografia.

Raios do sol girando em dois quadros:

```css
#panel { position:absolute; left:50px; top:150px; width:980px; height:700px; overflow:hidden; filter:url(#rough); }
#rays  { position:absolute; left:50%; top:50%; width:1900px; height:1900px; margin:-950px; border-radius:50%;
         background: repeating-conic-gradient(from 0deg, var(--ray-a) 0deg 9deg, var(--ray-b) 9deg 18deg); }
```

```js
tl.fromTo("#rays", { rotation: 0 }, { rotation: 54, duration: FILM_LENGTH, ease: `steps(${FILM_LENGTH * 12})` }, 0);
```

O título extrudado (9 sombras duras empilhadas):

```css
#title { font-family:"Brand display"; font-weight:900; font-stretch:125%; font-size:122px; line-height:.9;
  color: var(--accent); letter-spacing:-0.01em; text-transform:uppercase; white-space:nowrap; filter:url(#rough);
  text-shadow: 2px 2px 0 #160c0a, 4px 4px 0 #160c0a, 6px 6px 0 #160c0a, 8px 8px 0 #160c0a, 10px 10px 0 #160c0a,
               12px 12px 0 #160c0a, 14px 14px 0 #160c0a, 16px 16px 0 #160c0a, 18px 18px 0 #160c0a; }
```

Um objeto de contorno grosso = a forma duas vezes, a cópia preta deslocada primeiro:

```html
<svg class="obj" id="bolt1" width="290" height="250" viewBox="0 0 230 200">
  <path d="M20 70 L130 20 L110 80 L210 60 L80 180 L110 110 L20 130 Z" fill="#160c0a" transform="translate(10 12)"/>
  <path d="M20 70 L130 20 L110 80 L210 60 L80 180 L110 110 L20 130 Z" fill="#FFC93C"/>
</svg>
```

Quadros da tela de pixels, trocados pela linha do tempo:

```js
const showScreen = (n, t) => ["#scr0", "#scr1", "#scr2"].forEach((s, i) => tl.set(s, { opacity: i === n ? 1 : 0 }, t));
```

A explosão e a pausa trêmula:

```js
const pos = { "#bolt1": [-80, -40], "#bolt2": [80, 30], "#watch": [60, -60], "#glass": [40, 50],
              "#cur": [-60, 60], "#grid": [0, 30], "#px1": [90, -20], "#px2": [-40, 80] };
Object.keys(pos).forEach((o, i) => { const [dx, dy] = pos[o];
  tl.fromTo(o, { opacity: 1, x: -dx * 2.2, y: -dy * 2.2, scale: .2, rotation: -30 },
               { x: 0, y: 0, scale: 1, rotation: 0, duration: .33, ease: st(.33) }, t0 + 1.85 + i * .04); });
const r = R(Math.round(t0 * 10) + 7), objs = ["#pc", ...Object.keys(pos)];
for (let t = t0 + 2.3; t < t0 + 3.9; t += STEP * 2)
  objs.forEach((o) => tl.set(o, { x: `+=${((r() - .5) * 4).toFixed(1)}`, y: `+=${((r() - .5) * 4).toFixed(1)}` }, t));
for (let k = 0; k < 8; k++)   // stopwatch hand: 8 ticks, 45 deg apart
  tl.set("#hand", { attr: { x2: 128 + 54 * Math.cos(-.55 + k * .78), y2: 152 + 54 * Math.sin(-.55 + k * .78) } }, t0 + 2.3 + k * .25);
```

Monte o ciclo inteiro como `cycle(t0, last)` e chame-o duas vezes; restaure toda propriedade que ele toca com `tl.set` em `t0` para o ciclo 2 começar limpo.

## Adaptar a uma marca

Vem da marca: o preenchimento do título (cor de destaque), os quadros da tela de pixels (o produto e a marca em pixels), o vermelho do quadro do desfecho, o usuário (domínio), o número da edição, a chamada, a periodicidade, a fonte de destaque, a escolha de 6 a 8 adereços.

Fica fixo: o papel creme, o raio de sol em dois vermelhos, os contornos deslocados em preto quente, os raios e o subtítulo amarelos, as pintas e as manchas, o filtro rough e a sua fervura de semente a cada 1/12 s, o ritmo em dois quadros, o ciclo de clicar, encolher, cair, estourar, pausar, colapsar. Uma marca escura ainda imprime sobre o creme: este é um visual de papel, nunca inverta o fundo.

## Armadilhas encontradas durante a construção

- Definições feitas no carregamento, antes de a linha do tempo ser registrada, são sobrescritas ao buscar um ponto: comece as coisas escondidas com `opacity:0` definido pela linha do tempo em `t0` (`tl.set([...], { opacity: 0 }, t0)`), ou com `visibility:hidden` no código da página.
- O título entra em `scale 1.6`: no seu primeiro desenho em degraus ele é mais largo que o quadro e é cortado nas duas bordas. Mantenha o título abaixo de 900 px em repouso, ou entre em `scale 1.3`; a auditoria de quadro aponta texto fora do quadro.
- O cursor foi mirado a olho e clica no painel ao lado do computador, não no computador. Meça a caixa do alvo e pouse a ponta do cursor nela.
- O tremor com `+=` é um passeio aleatório: em 1,6 s ele deriva até cerca de 6 px. Serve para uma pausa; para pausas mais longas use deslocamentos absolutos em torno da posição original.
- A região do filtro precisa de folga (`x="-5%" width="110%"`) ou o deslocamento corta as bordas retas.
- `filter:url(#rough)` num contêiner grande é a parte mais lenta da renderização; aplique-o só ao painel, ao palco e ao título, nunca ao `#root`.
- O texto fica dentro do quadro e longe da borda do painel onde cairia sobre as listras: rode `scripts/frame-audit.mjs`. O subtítulo sobrepondo a borda de cima do painel é proposital e tem um contorno de 4 px para a legibilidade.

## Som

104 BPM, brincalhão, uma base de sintetizador saltitante. Por ciclo: clique no clique do cursor (0,85), pop no brilho (1,0), whoosh no encolhimento (1,25), o único golpe na queda e na batida do título (1,8), pop no subtítulo (2,0), ticks com o cronômetro (3,0, 3,5), whoosh no colapso (4,1). O ciclo 2 repete o clique, o whoosh e o pop (5,25, 5,65, 6,2) sem um segundo golpe, e ticks na pausa (7,4, 7,9).
