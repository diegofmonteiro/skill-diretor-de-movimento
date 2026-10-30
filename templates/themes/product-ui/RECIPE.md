# Interface de produto: desenhe a marca, enquadre as palavras, use o produto, toque-o

Um filme 9:16 de 11 segundos sobre uma grade de pontos monocromática, com dois asteriscos pretos suaves e gigantes girando nos cantos. O caminho real da logo da marca é traçado como um desenho a caneta e depois se preenche. Um cursor de designer arrasta duas caixas de seleção tracejadas e o slogan aparece dentro delas, editorial minúsculo sobre enorme e em negrito. A barra de entrada real da marca salta com mola, uma pergunta real é digitada, o cursor aperta enviar. Um disco escuro enorme varre o quadro na diagonal e, por baixo dele, a cena vira a tela real do produto da marca girando em 3D; ela passa a vez ao vídeo do produto da própria marca, tocando como pilha de quadros enquanto a câmera recorta para dentro. O quadro salta para fora na marca e no domínio. A ideia que faz funcionar: **uma tela cinza de designer em que a única coisa rica é o produto real**, e cada batida é um ato que um usuário ou designer faz (desenhar, selecionar, digitar, apertar, assistir).

## Formato, duração, ritmo

- 1080x1920, 30 fps, 11,0 s, quatro cenas a 120 BPM (um compasso = 2,00 s).
- Janelas das cenas (s): logo 0 a 2,6, palavras e pergunta 2,4 a 5,6, produto 5,4 a 9,55, assinatura 9,4 a 11,0. Cada uma se sobrepõe à seguinte em 0,15 a 0,2 s.
- Batidas (s): traço 0 a 1,0, preenchimento 1,1, pulso 1,15, rótulo 1,4, a logo sai 2,25, caixa 1 em 2,75, caixa 2 em 3,38, barra de pergunta 3,85, digitação 4,3 a 5,04, toque 5,12, faixa 4,98 a 5,78, troca de cena sob a faixa 5,36, o cartão gira 5,36 a 7,65, vídeo 7,2 a 9,2, recorte para dentro 7,75 a 9,05, marca 9,45, domínio 9,75.
- Momento-assinatura: a logo se desenha sozinha (o quadro 0 já mostra 18% do contorno, então o primeiro quadro nunca fica vazio).

## O visual em números

**Fundo (fixo)**
- `#E8E8E8` com `radial-gradient(circle, rgba(0,0,0,.16) 1.6px, transparent 2px) 0 0 / 30px 30px`: um cinza claro chapado com grade de pontos de 30 px. Sem vinheta, sem granulação.

**Paleta**
- Fixas: tinta `#111`, chamada `#3A3A3A`, seleção `#1A1A1A`, faixa `#1B1B1C`, barra e cartões brancos `#fff`, texto de exemplo `#9B9A97`, texto digitado `#191919`.
- Preenchimento da mancha: degradê radial `#2C2C2E` (0) a `#18181A` (.6) a `#0D0D0E` (1) em 38% 32%, mais uma luz interna (branco a 18% ao longo da borda interna superior esquerda).
- A cor de destaque da marca aparece em exatamente um lugar desenhado: o botão de enviar (círculo de 76 px). Tudo o mais que tem cor é o produto real (telas, vídeo).

**Tipografia** (a fonte de interface da marca)
| função | peso | px | espaçamento | entrelinha | caixa | cor |
|---|---|---|---|---|---|---|
| editorial `.small` (chamada, rótulo da logo, domínio sob o vídeo) | 500 | 34 | +0.06em | normal | maiúsculas | #3A3A3A |
| `.huge` (as palavras-chave do slogan, o domínio final) | 800 | 112 (88 para o domínio final) | -0.025em | 1 | como escrito | #111 |
| pergunta digitada / texto de exemplo | 500 | 48 | 0 | normal | frase | #191919 / #9B9A97 |
- Editorial minúsculo ou enorme em negrito, nada no meio. O texto é sempre centralizado numa caixa medida.

**Formas e sombras**
- Asteriscos: duas manchas SVG de 1100 px, A no alto à esquerda (`left:-420 top:-480`, 5 pétalas), B embaixo à direita (`left:520 top:1340`, 3 pétalas), `drop-shadow(0 18px 24px rgba(0,0,0,.28))`, z-index 30.
- Caixa de seleção: `border: 3px dashed #1a1a1a`, quatro alças redondas de 14 px deslocadas -9 px; caixa 1 780x84, caixa 2 860x150.
- Cursor: seta de 58 px (`M10 6 L10 52 L22 41 L31 60 L39 56 L30 38 L46 38 Z` numa caixa de 64), preenchimento `#111`, contorno `#fff` 3,5, `drop-shadow(0 5px 8px rgba(0,0,0,.35))`.
- Anel do clique: 120 px, `border: 8px solid #fff`, `box-shadow: 0 0 0 2px rgba(0,0,0,.15)`; ele se expande e desaparece (scale .4 a 1,3).
- Barra de pergunta: 900x130 em (90,1050), raio de 26 px, `box-shadow: 0 30px 60px -24px rgba(0,0,0,.35), 0 0 0 1.5px rgba(0,0,0,.08)`; marca de 64 px à esquerda, espaço de 24 px.
- Cartão do produto: 900x600 em (90,560), raio de 30 px, `box-shadow: 0 50px 90px -30px rgba(0,0,0,.45)`, palco com `perspective: 2200px`.
- Cartão de vídeo: 800x500 em (140,560), mesmo raio e sombra.
- Faixa: um disco de 3100x2900, `border-radius: 1450px`, `#1b1b1c`, `rotate(-38deg)`, `box-shadow: 0 0 80px rgba(0,0,0,.35)`, z-index 35.
- Traço da logo: largura 0,35 numa viewBox de 24 unidades a 400 px (cerca de 5,8 px na tela), `#111`, pontas retas.

## Lista de planos

| # | tempo (s) | na tela | o que se move e como | estático | saída |
|---|---|---|---|---|---|
| 0 | 0 a 11 | os dois asteriscos | A entra rolando de x -500, y -400, rotação -60, 0,8 s `back.out(1.2)` em 0; B de x 500, y 500, rotação 60 em 0,25; depois A gira até 40 graus e B até -35 graus em 10 s `none`; na assinatura os dois se aproximam (A x 120 y 140, B x -120 y -160, 0,6 s `back.out(1.4)`) | grade de pontos | ficam |
| 1 logo | 0 a 2,6 | o caminho da logo da marca, 400 px, centralizado em y 660; um rótulo `.small` com o nome da marca embaixo em y 1130 | o traço se desenha com `strokeDashoffset` L*0.82 a 0, 1,0 s `power2.inOut`; fill-opacity 0 a 1, 0,2 s em 1,1; pulso scale .9 a 1,06 0,18 s `power2.out` em 1,15, assenta em 1 em 0,4 s `back.out(2)`; o rótulo salta em 1,4 (scale .6 a 1, 0,4 s `back.out(1.9)`) | logo depois de pousar | a logo voa para cima y -1200, scale .4, 0,45 s `back.in(1.4)` em 2,25; o rótulo some em 0,15 s |
| 2 palavras | 2,4 a 5,36 | caixa 1 com a chamada, caixa 2 com as palavras enormes, a barra de pergunta embaixo delas | o cursor entra de (980,1300) até o canto da caixa 1 em 0,35 s `power3.inOut`; a caixa 1 se desenha do canto superior esquerdo em 0,3 s `power3.out` em 2,75 enquanto o cursor arrasta até o canto oposto; a chamada sobe y 14 a 0, 0,25 s `back.out(2)` em 2,95; o cursor vai à caixa 2 em 0,28 s em 3,1; a caixa 2 se desenha em 3,38; as palavras enormes scale .6 a 1, 0,42 s `back.out(2.2)` em 3,55; as duas caixas somem em 0,15 s em 3,9; a barra de pergunta salta scale .3 a 1, 0,5 s `back.out(1.9)` em 3,85 | palavras depois de pousarem | faixa |
| 3 pergunta | 4,3 a 5,36 | a barra com o texto de exemplo, depois a pergunta digitada | um caractere a cada 0,035 s a partir de 4,3 (21 caracteres, pronto em 5,04), cursor de texto ligado em 4,3, pisca apagado/aceso em 4,8/5,0 e 5,2/5,4; o cursor desliza até o botão de enviar em 0,35 s em 4,75; o cursor se achata a .82 e volta (0,07 s yoyo) em 5,1; o anel branco se expande do botão, scale .4 a 1,3, e some, 0,4 s `power2.out` em 5,12 | a barra | sob a faixa a cena 2 inteira some em um quadro em 5,36 |
| faixa | 4,98 a 5,78 | o disco escuro | x 1500, y 1900 até x -1600, y -2100, 0,8 s `power2.inOut`; o seu centro cruza o centro do quadro por volta de 5,36 | | revela a cena 3 |
| 4 produto | 5,36 a 7,6 | a tela real do produto da marca como cartão | sobe: rotationY -38 a -12, rotationX 14 a 6, y 400 a 0, opacity 0 a 1, 0,7 s `back.out(1.4)` em 5,36; gira: rotationY -12 a 10, rotationX 6 a 2, 1,5 s `sine.inOut` em 6,15 | | desfoca e some (filter blur 10px, opacity 0, 0,35 s em 7,25) enquanto o cartão de vídeo pousa sobre ele |
| 5 vídeo | 7,2 a 9,52 | o vídeo do produto como pilha de quadros; o domínio em `.small` embaixo dele | cartão de vídeo: opacity 0 a 1, scale .7 a 1,08, rotationY 20 a 0, y 80 a 0, 0,55 s `back.out(1.5)` em 7,2; 66 quadros mostrados um após o outro a cada 1/36 s (1,83 s); o domínio salta em 7,6; a câmera recorta para dentro: scale 1,75, x 120, y 90, 1,3 s `power2.inOut` em 7,75 enquanto o domínio desliza y +260 para ficar embaixo dele | | sai com um salto: scale .2, opacity 0, 0,32 s `back.in(1.6)` em 9,2 |
| 6 assinatura | 9,4 a 11 | a marca de 300 px em y 700, o domínio em `.huge` 88 px em y 1060 | marca scale 0 a 1, rotação -25 a 0, 0,55 s `back.out(2)` em 9,45; domínio y 40 a 0 e surge, 0,4 s `back.out(2)` em 9,75; os asteriscos se inclinam para dentro | parado | fim |

## Materiais, e onde obtê-los para uma marca nova

| material | fonte |
|---|---|
| logo como um único `<path>` SVG | `brand-intake.mjs` (vetor do Simple Icons quando existe, senão o SVG embutido do site). O traço precisa de um caminho; ponha-o no `<svg>` da logo com um `id` e reutilize-o na barra e na assinatura com `<use href="#id">`. Logo só em raster: vetorize-a (potrace, com tolerância de 1 a 2 px) ou pule o traço e revele o PNG com um `clip-path: circle()` que cresce. |
| slogan | a linha principal da própria marca, dividida numa chamada de 3 a 5 palavras (pequena) e num golpe de 2 a 3 palavras (enorme, abaixo de 860 px a 112 px). |
| barra de entrada | a entrada real do produto, refeita em HTML em tamanho de herói a partir de uma captura dela: seu texto de exemplo, seu ícone (a marca), seu botão de enviar na cor de destaque. Pergunta = um exemplo real de prompt, cerca de 20 caracteres. |
| tela do produto | uma captura real do produto escolhida em `brand-intake.mjs pick --shots` (aqui 3840x2400, mostrada em 900x600 com `object-position: top`). A tela mais cheia e mais reconhecível. |
| vídeo do produto | o próprio vídeo do produto do site, que o brand-intake amostra. Monte a pilha: `ffmpeg -i product.mp4 -ss <início> -t 5.5 -vf "fps=12,scale=1152:-1" -q:v 3 assets/devframes/f%03d.jpg` (66 quadros). Tocar quadros de 12 fps a 36 fps acelera o trecho 3 vezes, o que é lido como “funciona” em menos de 2 s. Escolha um trecho em que a interface mude visivelmente. |
| sem vídeo do produto | grave a tela do produto você mesmo ou peça à pessoa uma captura de 5 a 10 s; senão, troque o plano 5 por uma segunda captura real e um recorte lento, sem movimento falso. |
| fonte | a fonte de interface da marca via `@font-face` em `assets/brand.css`; nunca só pelo nome. |

Não precisa de material gratuito de banco: este tema funciona com a logo, o texto, as telas e o vídeo da própria marca.

## Mecânica

O asterisco com luz interna (A com 5 pétalas, B com 3):

```js
function blob(id, petals, phase) {
  const n = 360, p = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2, c = Math.abs(Math.cos(petals * a / 2 + phase));
    const k = 0.47 * (0.22 + 0.78 * Math.pow(c, 2.2)) + 0.47 * 0.06 * Math.pow(c, 18);
    p.push([50 + 50 * k * Math.cos(a), 50 + 50 * k * Math.sin(a)]);
  }
  const d = `M${p.map((q) => q.map((v) => v.toFixed(2)).join(" ")).join(" L")} Z`, g = id + "g";
  document.getElementById(id).innerHTML = `<defs>
    <radialGradient id="${g}" cx="38%" cy="32%" r="75%"><stop offset="0" stop-color="#2c2c2e"/><stop offset=".6" stop-color="#18181a"/><stop offset="1" stop-color="#0d0d0e"/></radialGradient>
    <filter id="${g}i"><feGaussianBlur in="SourceAlpha" stdDeviation="1.1"/><feOffset dx="-.6" dy="-.8"/>
      <feComposite in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1" result="e"/><feFlood flood-color="#fff" flood-opacity=".18"/>
      <feComposite in2="e" operator="in"/><feComposite in2="SourceGraphic" operator="over"/></filter></defs>
    <path d="${d}" style="fill:url(#${g})" filter="url(#${g}i)"/>`;
}
blob("blobA", 5, 0.3); blob("blobB", 3, 1.1);
```

Traço da logo com `getTotalLength`, depois preenchimento e pulso:

```js
// #logo path { fill: #111; stroke: #111; stroke-width: .35 }   (viewBox 0 0 24 24 at 400px)
const lp = document.getElementById("lp"), L = lp.getTotalLength();
lp.style.strokeDasharray = L;
tl.fromTo(lp, { strokeDashoffset: L * 0.82, fillOpacity: 0 }, { strokeDashoffset: 0, duration: 1.0, ease: "power2.inOut" }, 0);
tl.to(lp, { fillOpacity: 1, duration: 0.2 }, 1.1);
tl.fromTo("#logo", { scale: 0.9 }, { scale: 1.06, duration: 0.18, ease: "power2.out" }, 1.15);
tl.to("#logo", { scale: 1, duration: 0.4, ease: "back.out(2)" }, 1.33);
tl.to("#logo", { y: -1200, scale: 0.4, duration: 0.45, ease: "back.in(1.4)" }, 2.25);
```

Um caminho composto de logo (vários subcaminhos) desenha todos os seus subcaminhos de uma vez ao longo de um único traço, o que parece uma caneta seguindo todas as bordas juntas; esse é o visual. Para uma logo feita de `<path>`s separados, defasá-los em 0,08 s.

O cursor enquadra as palavras (caixa e cursor dividem duração e curva):

```js
const C = "#cur";
tl.set(C, { x: 980, y: 1300, opacity: 1 }, T);
tl.to(C, { x: L1, y: T1, duration: 0.35, ease: "power3.inOut" }, T);
tl.fromTo("#b1", { scaleX: 0, scaleY: 0, transformOrigin: "0 0" }, { scaleX: 1, scaleY: 1, duration: 0.3, ease: "power3.out" }, T + 0.35);
tl.to(C, { x: L1 + W1, y: T1 + H1, duration: 0.3, ease: "power3.out" }, T + 0.35);
tl.fromTo("#t1", { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.25, ease: "back.out(2)" }, T + 0.55);
// box 2 the same, 0.63s later; the huge words: scale .6 to 1, 0.42s back.out(2.2)
```

Digitação, cursor de texto, toque e anel que se expande:

```js
const typed = document.getElementById("typed"), Q = "<a real query>";      // starts showing the placeholder span
for (let i = 1; i <= Q.length; i++) tl.set(typed, { textContent: Q.slice(0, i) }, T + i * 0.035);
tl.set("#caret", { opacity: 1 }, T);
[T + 0.3, T + 0.7].forEach((t) => { tl.set("#caret", { opacity: 0 }, t + 0.2); tl.set("#caret", { opacity: 1 }, t + 0.4); });
tl.to(C, { x: BX - 28, y: BY, duration: 0.35, ease: "power3.inOut" }, P - 0.37);          // onto the send button
tl.fromTo(C, { scale: 1 }, { scale: 0.82, duration: 0.07, yoyo: true, repeat: 1, immediateRender: false }, P - 0.02);
tl.fromTo("#ring", { left: BX, top: BY, scale: 0.4, opacity: 1 }, { scale: 1.3, opacity: 0, duration: 0.4, ease: "power2.out", immediateRender: false }, P);
```

A varredura da faixa e a troca de um quadro sob ela:

```js
// <div id="band" style="position:absolute;left:-1000px;top:-500px;width:3100px;height:2900px;border-radius:1450px;
//   background:#1b1b1c;z-index:35;transform:rotate(-38deg);box-shadow:0 0 80px rgba(0,0,0,.35)">
tl.fromTo("#band", { x: 1500, y: 1900 }, { x: -1600, y: -2100, duration: 0.8, ease: "power2.inOut" }, W);
tl.set(["#t1", "#t2", "#ask", "#cur", "#ring"], { opacity: 0 }, W + 0.38);   // the frame the disc covers the whole old layout
// the next scene's first move starts on that same frame, so it is revealed by the band's trailing edge
```

Cartão real do produto girando em 3D:

```js
// .stage { position:absolute; inset:0; perspective:2200px }
tl.fromTo("#card", { rotationY: -38, rotationX: 14, y: 400, opacity: 0 }, { rotationY: -12, rotationX: 6, y: 0, opacity: 1, duration: 0.7, ease: "back.out(1.4)" }, S);
tl.to("#card", { rotationY: 10, rotationX: 2, duration: 1.5, ease: "sine.inOut" }, S + 0.79);
```

Vídeo do produto como pilha de quadros (determinístico: sem elemento `<video>`):

```js
const vid = document.getElementById("vid"), N = 66, FPS = 36;
for (let i = 1; i <= N; i++) { const im = document.createElement("img"); im.className = "vf";
  im.src = `assets/devframes/f${String(i).padStart(3, "0")}.jpg`; vid.appendChild(im); }
const vfs = vid.querySelectorAll(".vf");                       // .vf { position:absolute; inset:0; opacity:0 } + object-fit:cover
tl.fromTo("#vid", { opacity: 0, scale: 0.7, rotationY: 20, y: 80 }, { opacity: 1, scale: 1.08, rotationY: 0, y: 0, duration: 0.55, ease: "back.out(1.5)" }, V);
tl.to("#card", { opacity: 0, filter: "blur(10px)", duration: 0.35 }, V + 0.05);
vfs.forEach((f, i) => { tl.set(f, { opacity: 1 }, V + i / FPS); if (i) tl.set(vfs[i - 1], { opacity: 0 }, V + i / FPS); });
tl.to("#vid", { scale: 1.75, x: 120, y: 90, duration: 1.3, ease: "power2.inOut" }, V + 0.55);   // crop toward the part that changes
tl.to("#vid", { scale: 0.2, opacity: 0, duration: 0.32, ease: "back.in(1.6)" }, V + 2.0);
```

Escolha o alvo do recorte (x, y) na região do vídeo que mais se move; meça-o nos quadros, não adivinhe.

## Adaptar a uma marca

- Vem da marca: o caminho da logo (traço, ícone da barra, assinatura), o rótulo do nome, o slogan, a fonte de interface, o visual da barra de entrada e a pergunta, a cor de destaque do botão de enviar, a tela do produto, o vídeo do produto, o domínio.
- Fica fixo: a grade de pontos `#E8E8E8`, os asteriscos pretos, as caixas tracejadas, o cursor preto e o anel branco, a varredura do disco escuro, a tipografia minúscula ou enorme, todos os tempos e curvas acima.
- Uma marca cuja logo é uma mancha cheia sem bordas internas: o traço mostra só um contorno; tudo bem, mas deixe o preenchimento entrar em 0,9 e não em 1,1.
- Uma logo muito colorida: mantenha o traço em `#111` e então preencha com as cores reais em 1,1; é a primeira cor na tela e deve parecer merecida.
- 16:9: slogan em uma linha, barra de entrada de 1100 px, cartão do produto 1280x800, o disco de 4400 px, escala de recorte 1,5.

## Armadilhas encontradas durante a construção

- O cursor e o anel ficam acima da faixa (z-index 50 e 49 sobre 35), então na varredura aparecem por cima do disco preto por 0,2 s (visível no filme em 5,33). Esconda-os no quadro do toque + 0,15 s, ou dê à faixa z-index 55.
- A varredura precisa cobrir por completo antes da troca: a cena antiga some em um quadro (`tl.set(... opacity 0)`) no momento em que o disco grande cobre todo o seu layout, nunca num esmaecimento. Confira os quadros W+0,3 a W+0,45 numa folha; se alguma palavra antiga aparecer na borda do disco, aumente o disco ou atrase a troca de 1 a 2 quadros.
- Quadro 0 com uma logo traçada: começar o `strokeDashoffset` em L*0.82 mostra 18% do contorno no quadro 0, então o filme nunca abre num quadro vazio. Um traço com pontas redondas mostraria pontos no início de cada subcaminho antes de se desenhar: mantenha `stroke-linecap: butt` ou esconda o caminho até o seu primeiro quadro.
- O anel e qualquer `fromTo` posterior precisam levar `immediateRender: false`, ou renderizam o seu estado inicial (anel com opacidade total) desde o quadro 0.
- O cartão de vídeo em scale 1,75 passa das bordas do quadro de propósito; mantenha a linha do domínio fora da sua caixa e confira com `scripts/frame-audit.mjs` (texto sobre texto, texto fora da caixa). A auditoria é também o que mantém a chamada e as palavras enormes dentro das caixas tracejadas com folga.
- Os asteriscos têm z-index 30, acima do cartão do produto: planeje o cartão na faixa do meio (y 560 a 1160) e confira a cada 4 quadros se um lóbulo passa sobre a interface.
- A fonte foi definida só pelo nome (`"Inter"`): carregue a fonte da marca com `@font-face`, ou a renderização depende da máquina.

## Som

- 120 BPM, clima `minimal`, ré maior; subida de tensão de 2,0 até a queda em 6,0, sinal da logo em 9,45. Mixagem a -14 LUFS.
- Sons de interface nos eventos: whoosh quando os asteriscos entram rolando (0,1), pop quando a logo se preenche (1,15), tick quando cada caixa é desenhada (2,75, 3,38), pop quando a barra salta (3,6), uma base de digitação a partir de 4,33 para a pergunta, whoosh quando a faixa começa (5,05), clique no toque (5,12), shimmer quando o vídeo pousa (7,2), whoosh quando o quadro sai com um salto (9,2), um golpe na marca (9,45).
