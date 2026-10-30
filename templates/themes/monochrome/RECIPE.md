# Monocromático: a mesa do designer em preto e cinza

Um filme 9:16 de 18 segundos que parece um designer trabalhando numa tela cinza: uma grade de pontos cinza clara, dois asteriscos pretos gigantes e suaves girando nos cantos, um cursor preto que arrasta caixas de seleção tracejadas e as palavras aparecem dentro delas, e adereços 3D fotográficos reais (um megafone, uma moldura dourada com um retrato gravado do fundador, relógios de bolso caindo) soltos nesse mundo chapado. A ideia que faz funcionar: **tudo é em tons de cinza, exceto os objetos reais**, então cada adereço (e o site real da marca num celular real) é lido como um objeto precioso posto na mesa do designer. O texto é uma frase cortada em 8 batidas curtas; cada batida tem um verbo (enquadrar, soltar, varrer, circular, correr, fechar as cortinas sobre ela).

## Formato, duração, ritmo

- 1080x1920, 30 fps, 18,0 s (composição `data-duration="18"`), um arquivo, 8 cenas, uma subcomposição 3D.
- Trilha a 100 BPM, um compasso = 2,40 s; a grade tinha 20,2 s e o filme foi cortado para 18 s, então as batidas não caem nas linhas dos compassos: os cortes seguem o texto.
- Inícios das cenas (s): 0, 2,4, 4,6, 7,4, 9,4, 12,6, 14,2, 16,2. Plano médio de 2,25 s; o mais curto 1,6 s (a digitação corrida), o mais longo 3,2 s (o celular).
- As cenas se sobrepõem em 0,2 s (cada `section` começa 0,2 s antes de a anterior terminar) para o objeto da varredura cobrir a troca.
- Algo se move em toda batida; as manchas nunca param de girar (50 graus em 18 s).

## O visual em números

**Fundo (fixo, nunca na cor da marca)**
- `#bg`: `radial-gradient(70% 50% at 50% 30%, #F1F1F1, #E3E3E3 70%, #D9D9D9)`, uma luz suave de cima.
- `#dots`: `radial-gradient(circle, rgba(0,0,0,.13) 1.6px, transparent 2px) 0 0 / 30px 30px`, uma grade de pontos de 30 px sobre o quadro todo.
- `.lgrid` (uma grade quadrada local atrás de um adereço): linhas de `linear-gradient` `rgba(0,0,0,.09)` de 1,5 px, célula de 34 px, mascarada por `radial-gradient(closest-side, #000 45%, transparent)` para sumir num círculo. 600x600 atrás do megafone, 800x1000 atrás do celular.
- Granulação sobre tudo: SVG `feTurbulence fractalNoise baseFrequency 1.1, numOctaves 1, seed 8`, alfa 0,14, opacidade da camada .35, `mix-blend-mode: multiply`, z-index 90.

**Paleta**
- Cinzas fixos: tinta `#141414` / `#161616` / `#1A1A1A`, secundário `#3C3C3C`, minúsculas `#2B2B2B`, apagado `#555`, `#666`, `#6B6B6B`; caixa de seleção e anel `#2A2A2A`; faixa `#2A2A2A` com texto `#F4F4F4`; cortinas `#141414`.
- Preenchimento das manchas: degradê radial `#2A2A2A` (0) a `#151515` (.7) a `#0B0B0B` (1), centro em 40% 35%, filete `rgba(255,255,255,.08)` com traço de 0,5.
- A cor da marca aparece SÓ dentro de material real: as cores próprias dos adereços (corpo vermelho do megafone, relógio de latão, moldura dourada), o site da marca no celular e a luz de contorno do celular (`--rim` = a cor de destaque da marca). Nenhum elemento de interface, texto ou forma assume a cor de destaque.

**Tipografia** (a fonte de destaque da marca, uma fonte variável, todos os pesos dela)
| função | peso | px | espaçamento | caixa | cor |
|---|---|---|---|---|---|
| chamada fina (“todo fundador está atrás de”) | 400 | 50 | +0.02em | maiúsculas | #3C3C3C |
| manchete grossa | 900 | 76-128 (124 gancho, 128 legenda do objeto, 120 “pare”, 76 linhas em caixas) | -0.01em | maiúsculas | #161616 |
| rótulo pequeno acima de um objeto | 800 | 52-66 | 0 | maiúsculas ou como escrito | #1B1B1B |
| conectivo em minúsculas (“para isso”, “aqui está a”, “sobre”) | 400-600 | 44-66 | 0 | minúsculas | #2B2B2B, #6B6B6B |
| texto da faixa | 900 | 64 | +0.01em | maiúsculas | #F4F4F4 sobre #2A2A2A |
| digitação corrida | 900 | 84 | 0, espaço entre palavras de 26 px | maiúsculas | #1A1A1A |
| comentário em itálico | 400 itálico | 36, entrelinha 1,35 | 0 | frase | #555 |
| assinatura: verbo / substantivo / domínio | 700 / 900 / 400 | 66 / 110 / 36 | 0 | como escrito | #161616, #666 |

- Os pares são postos fora do centro e em degraus: a palavra pequena fica no alto à esquerda (`left:-150px` numa linha centralizada), a palavra grande embaixo deslocada para a direita (`left:+90..120px`). Nunca duas linhas centralizadas do mesmo tamanho.
- O texto é ou minúsculo e editorial ou enorme; nada entre 66 e 76 px.

**Sombras e materiais**
- Adereços: `filter: drop-shadow(0 30px 30px rgba(0,0,0,.28))`.
- Manchas: `drop-shadow(0 14px 18px rgba(0,0,0,.22))`.
- Faixa: `box-shadow: 0 30px 60px rgba(0,0,0,.25)`; uma elipse de 2200x760, `border-radius: 50%`, girada -8 graus.
- Caixa de seleção: `border: 3px dashed #2a2a2a`, quatro alças redondas de 16 px centradas nos cantos (deslocadas -10 px). Em tamanho de celular, aparece como uma linha pontilhada fina, que é o visual.
- Cursor: 46 px, o caminho clássico de seta `M10 6 L10 52 L22 41 L31 60 L39 56 L30 38 L46 38 Z` numa caixa de 64, preenchimento `#111`, contorno `#fff` 3,5, junções redondas, `drop-shadow(0 3px 4px rgba(0,0,0,.3))`.
- Os relógios caindo usam `filter: blur(3px)` e `blur(4px)` mais a sombra do adereço: profundidade de campo em tudo o que não é o assunto.

## Lista de planos

| # | tempo (s) | na tela | o que se move e como | estático | saída |
|---|---|---|---|---|---|
| 0 | 0 a 18 | dois asteriscos de 1100 px, A no alto à esquerda (`left:-520 top:-560`), B embaixo à direita (`left:500 top:1300`) | entram pelos cantos: x/y +-120 e rotação +-20 a 0, 0,8 s `back.out(1.2)`; depois A gira até +50 graus e B até -45 graus em 18 s `none` | grade de pontos, granulação | somem a 0 em 0,3 s em 12,6 |
| 1 | 0 a 2,6 | uma caixa tracejada de 880x270 em (100,800); chamada de 50 px e manchete de 124 px dentro | cursor posto em (900,1300) em 0,3, desliza até o canto superior esquerdo da caixa (100,800) em 0,45 s `power3.inOut`; a caixa se desenha do canto superior esquerdo: scaleX/scaleY 0 a 1, 0,32 s `power3.out` em 0,8 enquanto o cursor arrasta até o canto inferior direito (980,1070) em 0,32 s; a chamada salta em 1,0, a manchete em 1,25 (salto: opacity 0, scale 0,8/0,5, blur 6px a 1/0, 0,35/0,45 s `back.out(2)`); o cursor sai para (1150,1500) em 0,4 s `power3.in` em 1,6 | a caixa depois de desenhada | **varredura de asterisco**: B voa x -900, y -1500, scale 2,4 pelo quadro em 0,55 s `power3.inOut` em 2,05, volta em 0,6 s `power3.out` em 2,6; A se esquiva x/y -600 em 0,4 s `power3.in` |
| 2 | 2,4 a 4,8 | “PROCURANDO” 52 px / “para isso” 44 px em degraus no alto à esquerda; quadrado da grade local; o adereço do megafone com 480 px de largura; “TRUQUE VIRAL” 128 px embaixo dele | as palavras saltam em 2,6 e 2,75; megafone: scale .3 a 1, rotação -25 a 0, opacity 0 a 1, 0,6 s `back.out(1.6)` em 2,7, e depois deriva rotação 4, y -10 em 1,8 s `sine.inOut`; a legenda é revelada da esquerda para a direita: `clip-path inset(-20% 100% -20% -5%)` a `inset(-20% -5% -20% -5%)` 0,5 s `power2.out` em 3,3 | grade local | a faixa escura varre para baixo por cima |
| 3 | 4,6 a 7,4 | a faixa escura no alto; “Esta é a” 48 px + “verdade” 104 px (minúsculas); a moldura dourada com o fundador gravado, 740 px de largura | faixa: y -900 a 0 com rotação -8, 0,55 s `power3.out` em 4,45; palavras saltam 4,75 / 4,9; a moldura desliza x -900 a 0, rotação -12 a 4, 0,6 s `back.out(1.3)` em 4,7, assenta em rotação 1 em 1,0 s `sine.inOut`; em 6,0 a faixa rola para baixo até y 1700 (rotação -4) em 0,6 s `power3.inOut` e leva moldura e palavras para fora (y 1500, rotação 10, 0,55 s `power3.in`); o megafone volta (scale .6 a 1, rotação 15 a -6, 0,5 s `back.out(1.5)` em 6,35) e um anel tracejado (r 270, `stroke-dasharray 10 10`) se desenha em volta dele em 0,7 s `power2.inOut` em 6,5; o texto da faixa “SEM ATALHOS” surge na faixa em 6,55 | grade de pontos | a faixa e o seu texto caem pela base, y +900 em 0,4 s `power3.in` em 7,25 |
| 4 | 7,4 a 9,4 | duas caixas tracejadas de 620x140 e 580x140, uma linha grossa de 76 px em cada | o cursor entra de (1000,1500) até o canto da primeira caixa em 0,35 s; a caixa 1 se desenha em 7,75 enquanto o cursor arrasta até o canto oposto (0,3 s `power3.out`); a linha salta em 7,9; o cursor pula para o canto da caixa 2 em 0,3 s em 8,25; a caixa 2 se desenha em 8,55; a linha salta em 8,7; o cursor sai em 9,1; o asterisco A volta ao seu canto em 0,6 s `power3.out` | caixas | corte para o celular |
| 5 | 9,4 a 12,6 | três palavras em degraus acima (66 / 46 / 66 px); grade local 800x1000; um celular 3D real com o site da marca rolando nele | o preset `iphone` do `device-init`: sobe de y -4,5 mostrando as costas, gira até a tela, a câmera se aproxima (veja Mecânica); as palavras saltam 9,9 / 10,1 / 10,3; os dois asteriscos encolhem para scale .8 em 1 s | as palavras | corte seco |
| 6 | 12,6 a 14,2 | uma linha de palavras de 84 px correndo da direita para a esquerda em y 930 (`data-bleed`) | a fileira desliza x 900 a -620 em 1,6 s `none`; cada palavra cai y -40 a 0, opacity 0 a 1, 0,25 s `back.out(2)`, defasadas em 0,18 s; os asteriscos somem em 0,3 s | mais nada na tela | as cortinas fecham |
| 7 | 14,2 a 16,4 | duas cortinas pretas de 600x2000 fechando em ângulo; “PARE” 120 px / “de alugar” 66 px; um relógio de bolso de 360 px caindo no centro; dois relógios desfocados caindo ao lado; um comentário em itálico de 36 px | cortinas x +-400 a 0, rotação 0 a -12/+12, 0,5 s `power3.out` (formam um V que enquadra o centro); relógio principal y -900 a 0, rotação -30 a 0, 0,7 s `back.out(1.2)` em 14,4, e depois balança rotação 6 yoyo 1,2 s `sine.inOut`; relógio 1 (260 px, blur 3) cai y -300 a 2100, rotação 0 a 140, 2,0 s `power1.in`; relógio 2 (420 px, blur 4) y -1700 a 400, rotação 30 a 160, 2,2 s `power1.in`; o comentário surge em 0,4 s em 15,1 | cortinas depois de fechadas | corte |
| 8 | 16,2 a 18 | assinatura: verbo de 66 px no alto à esquerda, substantivo de 110 px embaixo à direita, domínio de 36 px #666 embaixo | saltos em 16,35 / 16,55 / 16,9 (0,35 / 0,45 / 0,3 s) | só a grade de pontos, sem manchas | parado até o fim |

## Materiais, e onde obtê-los para uma marca nova

| material | fonte |
|---|---|
| a fonte de destaque da marca | o `brand-intake.mjs` captura os arquivos de fonte; o `film-init.mjs` escreve o `@font-face` em `assets/brand.css` como “Brand display” (pesos de 100 a 900 de um arquivo variável). Uma fonte faz todos os pesos. |
| o site da marca no celular | capture o site no ar com largura de celular: Chrome sem janela `--window-size=390,7000 --force-device-scale-factor=2`, página inteira, salva como `device/site-phone.png` (aqui 390 de largura, rolada até y 5250). Escolha 3 paradas: o topo, a prova (números, marcas de clientes), os depoimentos. |
| um retrato do fundador | a foto do próprio fundador ou um quadro do vídeo dele (uma imagem parada do YouTube em 720p basta), recortada com `node scripts/cutout.mjs still.png founder-cut.png`. Depois grave-a (Mecânica) e componha na moldura. |
| megafone | `node scripts/find-assets.mjs --polyhaven model megaphone_01 --out <dir>`, renderizado com `node scripts/prop-render.mjs <dir>/megaphone_01/Megaphone_01_1k.gltf mega.png --hdri <dir>/studio_small_09/studio_small_09_1k.hdr --ry -35 --rx 10` para uma vista de 3/4, boca para a esquerda, cabo para baixo (ângulos aproximados: as opções exatas da renderização aprovada não foram registradas; renderize 3 ou 4 valores de `--ry` e escolha numa folha). |
| moldura dourada | `--polyhaven model fancy_picture_frame_01`, renderizada de frente (`--rx 0 --ry 0`), depois `trim-alpha.mjs`. A tela dela traz uma paisagem: substitua em 2D (tela interna medida numa renderização de 1122x870: x 92 a 1029, y 92 a cerca de 780). As duas malhas se chamam `Plane.*`, então o `--screen-mesh` não consegue isolar a tela: componha. |
| relógio de bolso | `--polyhaven model vintage_pocket_watch`, duas renderizações: de frente (`--rx 0 --ry 0`, o principal, 854x1106) e inclinada em 3/4 (cerca de `--ry 35 --rx -15`, os que caem; ângulos aproximados, escolha numa folha). |
| HDRI | `--polyhaven hdri studio_small_09` (estúdio neutro, mantém os adereços compatíveis com tons de cinza). |
| o celular 3D | `node scripts/device-init.mjs --project <dir> --preset iphone --start 9.4 --duration 3.2 --id ph --rim <cor de destaque da marca> --env #2a2a2a`. A carcaça do celular assume a cor de destaque pela luz de contorno. |

Os adereços devem contar a metáfora do texto: um megafone para “viralizar”, uma moldura para “a verdade / o fundador”, relógios para “pare de alugar / tempo”. Escolha a metáfora a partir da frase da própria marca e depois busque no Poly Haven (`find-assets.mjs --polyhaven model <id>`; o site lista cerca de 500 modelos CC0 por categoria). Material faltando: sem modelo do Poly Haven, tente `find-assets.mjs "<objeto> isolated" --cutout --min 1400` (uma foto CC0 real, recortada); sem foto do fundador, ponha na moldura a captura real do produto da marca, gravada do mesmo modo; sem fonte capturada, use a grotesca incluída mais próxima em 400/800/900 e diga isso no `brand.md`. Nunca desenhe um adereço em CSS.

## Mecânica

O asterisco suave (a forma-assinatura do tema). 5 pétalas nos dois; `phase` gira os lóbulos para duas manchas nunca ficarem idênticas:

```js
function blob(id, petals, phase) {
  const n = 400, p = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2, c = Math.abs(Math.cos(petals * a / 2 + phase));
    const k = 0.47 * (0.2 + 0.8 * Math.pow(c, 2.4)) + 0.03 * Math.pow(c, 20);   // long rounded lobes, a slight bulb at the tip
    p.push([50 + 50 * k * Math.cos(a), 50 + 50 * k * Math.sin(a)]);
  }
  const g = id + "g", d = `M${p.map((q) => q.map((v) => v.toFixed(2)).join(" ")).join(" L")} Z`;
  document.getElementById(id).innerHTML =
    `<defs><radialGradient id="${g}" cx="40%" cy="35%" r="75%"><stop offset="0" stop-color="#2a2a2a"/>` +
    `<stop offset=".7" stop-color="#151515"/><stop offset="1" stop-color="#0b0b0b"/></radialGradient></defs>` +
    `<path d="${d}" fill="url(#${g})" stroke="rgba(255,255,255,.08)" stroke-width=".5"/>`;
}
// <svg class="blob" id="blA" viewBox="0 0 100 100" style="left:-520px;top:-560px;width:1100px;height:1100px">
blob("blA", 5, 0.4); blob("blB", 5, 1.2);
```

```css
svg.blob { position: absolute; overflow: visible; z-index: 40; filter: drop-shadow(0 14px 18px rgba(0,0,0,.22)); }
```

Caixa de seleção, arrasto do cursor e o salto:

```js
const tl = gsap.timeline({ paused: true }), C = "#cur";
const box = (b, t, from = "0 0") => tl.fromTo(b, { scaleX: 0, scaleY: 0, transformOrigin: from, opacity: 1 },
  { scaleX: 1, scaleY: 1, duration: 0.32, ease: "power3.out" }, t);
const pop = (el, t, from = 0.6, d = 0.4) => tl.fromTo(el, { opacity: 0, scale: from, filter: "blur(6px)" },
  { opacity: 1, scale: 1, filter: "blur(0px)", duration: d, ease: "back.out(2)" }, t);

// drag a box at (L,T) size WxH starting at time t: the cursor IS the box's corner
function dragBox(id, L, T, W, H, t) {
  tl.to(C, { x: L, y: T, duration: 0.35, ease: "power3.inOut" }, t - 0.35);
  box(id, t);
  tl.to(C, { x: L + W, y: T + H, duration: 0.32, ease: "power3.out" }, t);   // same duration as the box
}
tl.set(C, { x: 900, y: 1300, opacity: 1 }, 0.3);
dragBox("#b1", 100, 800, 880, 270, 0.8);
pop("#s1a", 1.0, 0.8, 0.35); pop("#s1b", 1.25, 0.5, 0.45);          // the words appear INSIDE the box after it is drawn
tl.to(C, { x: 1150, y: 1500, duration: 0.4, ease: "power3.in" }, 1.6); tl.set(C, { opacity: 0 }, 2.0);
```

```css
.box { position: absolute; border: 3px dashed #2a2a2a; z-index: 20; }
.box i { position: absolute; width: 16px; height: 16px; border-radius: 50%; background: #2a2a2a; }
.box i:nth-child(1) { left: -10px; top: -10px; } .box i:nth-child(2) { right: -10px; top: -10px; }
.box i:nth-child(3) { left: -10px; bottom: -10px; } .box i:nth-child(4) { right: -10px; bottom: -10px; }
```

A varredura de asterisco (uma mancha cresce pelo quadro, a cena muda por baixo dela, ela volta rolando ao seu canto):

```js
tl.to("#blB", { x: -900, y: -1500, scale: 2.4, duration: 0.55, ease: "power3.inOut" }, T);
tl.to("#blB", { x: 0, y: 0, scale: 1, duration: 0.6, ease: "power3.out" }, T + 0.55);
// the next section starts at T + 0.35, while the blob covers the centre
```

A faixa escura e o círculo desenhado em volta de um objeto:

```css
#band { position: absolute; left: -500px; top: -400px; width: 2200px; height: 760px; border-radius: 50%;
  background: #2a2a2a; z-index: 30; box-shadow: 0 30px 60px rgba(0,0,0,.25); }
#ring circle { fill: none; stroke: #2a2a2a; stroke-width: 3; stroke-dasharray: 10 10; }
```

```js
tl.fromTo("#band", { y: -900, rotation: -8 }, { y: 0, rotation: -8, duration: 0.55, ease: "power3.out" }, T);
tl.to("#band", { y: 1700, rotation: -4, duration: 0.6, ease: "power3.inOut" }, T2);          // rolls down, carrying the scene
tl.to(["#frame", "#capA", "#capB"], { y: 1500, rotation: 10, duration: 0.55, ease: "power3.in" }, T2);
// ring: <svg id="ring" width="580" height="580" viewBox="0 0 580 580"><circle id="rc" cx="290" cy="290" r="270" transform="rotate(-90 290 290)"/></svg>
const rc = document.getElementById("rc"), RL = 2 * Math.PI * 270;
tl.set("#ring", { opacity: 0 }, 0); tl.set("#ring", { opacity: 1 }, T3);               // hidden until it draws
tl.fromTo(rc, { attr: { "stroke-dasharray": `0 ${RL}` } }, { attr: { "stroke-dasharray": `${RL} 0` }, duration: 0.7, ease: "power2.inOut" }, T3);
```

Nota: no filme aprovado, o `stroke-dasharray: 10 10` do CSS vence a interpolação de `attr` (uma regra CSS vence um atributo de apresentação do SVG), então o anel simplesmente aparece, tracejado, em T3 e a interpolação não faz nada. Isso é lido bem. Se quiser que o anel tracejado se desenhe visivelmente em volta do objeto, mantenha o tracejado no círculo e revele-o por uma máscara: um segundo círculo, sólido, numa `<mask>` cujo `stroke-dashoffset` vai de `RL` a 0 em 0,7 s `power2.inOut`.

A digitação corrida:

```js
tl.fromTo("#run", { x: 900 }, { x: -620, duration: 1.6, ease: "none" }, T);
document.querySelectorAll("#run span").forEach((s, i) =>
  tl.fromTo(s, { y: -40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.25, ease: "back.out(2)" }, T + i * 0.18));
// #run { position:absolute; top:930px; white-space:nowrap; font-weight:900; font-size:84px; text-transform:uppercase }
// #run span { display:inline-block; margin-right:26px }   and mark #run data-bleed for frame-audit
```

Cortinas e objetos caindo:

```js
// .cur { position:absolute; top:-40px; width:600px; height:2000px; background:#141414; z-index:15 }  left:-300px / right:-300px
tl.fromTo("#cL", { x: -400, rotation: 0 }, { x: 0, rotation: -12, duration: 0.5, ease: "power3.out" }, T);
tl.fromTo("#cR", { x: 400, rotation: 0 }, { x: 0, rotation: 12, duration: 0.5, ease: "power3.out" }, T);
tl.fromTo("#hero", { y: -900, rotation: -30 }, { y: 0, rotation: 0, duration: 0.7, ease: "back.out(1.2)" }, T + 0.2);
tl.to("#hero", { rotation: 6, duration: 1.2, ease: "sine.inOut", yoyo: true, repeat: 1 }, T + 0.9);
tl.fromTo("#fall1", { y: -300, rotation: 0 }, { y: 2100, rotation: 140, duration: 2.0, ease: "power1.in" }, T + 0.2);
tl.fromTo("#fall2", { y: -1700, rotation: 30 }, { y: 400, rotation: 160, duration: 2.2, ease: "power1.in" }, T);
```

A gravura (foto do fundador para uma placa gravada em linhas). Rode uma vez para gerar o `portrait.png`; é uma trama de linhas horizontais com passo de 4 px cuja espessura de linha cresce com o escuro, deixando os realces limpos. Medido na placa aprovada: papel `#EEEAE0`, linhas de 1 a 3 px de quase preto (`#0B0B0B` a `#161616`), vãos cinza claros, realces em torno de `#F5F5F5`, contraste duro. A etapa original de geração não foi guardada; esta função foi refeita a partir dessas medidas, então compare o resultado com a placa de referência num recorte ampliado e ajuste `contrast`, `lift` e `cut` até o rosto ser lido em três tons (realce limpo, linhas finas, linhas densas).

```js
// in a page or a node canvas: img = the cut-out (alpha), out = same size
function engrave(img, { pitch = 4, contrast = 1.7, lift = 0.08, cut = 0.62 } = {}) {
  const c = document.createElement("canvas"); c.width = img.width; c.height = img.height;
  const x = c.getContext("2d"); x.drawImage(img, 0, 0);
  const d = x.getImageData(0, 0, c.width, c.height), p = d.data;
  for (let y = 0; y < c.height; y++) for (let X = 0; X < c.width; X++) {
    const i = (y * c.width + X) * 4; if (p[i + 3] < 8) continue;
    let L = (0.299 * p[i] + 0.587 * p[i + 1] + 0.114 * p[i + 2]) / 255;
    L = Math.min(1, Math.max(0, (L - 0.5) * contrast + 0.5 + lift));
    let v;
    if (L > cut) v = 225 + 30 * (L - cut) / (1 - cut);                  // highlights: clean, no lines
    else { const w = 1 - L / cut, t = Math.abs(((y % pitch) + 0.5) / pitch - 0.5) * 2;
           v = t < w ? 14 : 150 + 60 * L; }                              // the line, then its gap
    p[i] = p[i + 1] = p[i + 2] = v;
  }
  x.putImageData(d, 0, 0); return c;
}
```

Depois componha: preencha a tela interna da moldura com `#EEEAE0`, desenhe o recorte gravado ancorado embaixo e centralizado nela com cerca de 75% da altura da tela, desenhe a renderização da moldura por cima (o próprio alfa da moldura mantém o acabamento por cima). Passo de 4 px numa placa de 1122 px de largura; escale o passo com a placa (passo = largura da placa / 280).

O celular (`device-init --preset iphone`): sobe de y -4,5 com as costas para a câmera, `pry` gira de 0,25 a PI + 0,18 (1,1 s, curva bezier .76,0,.18,1), a câmera se aproxima de 55% a 86% da altura do quadro; o HTML da tela rola em paradas suavizadas `[[0,0],[0.12,0],[0.4,860],[0.58,860],[0.92,5250],[1,5250]]` (p, y da página) com uma cúbica de entrada e saída entre as paradas:

```js
var PH = [[0, 0], [0.12, 0], [0.4, 860], [0.58, 860], [0.92, 5250], [1, 5250]];   // stops: hero, proof, testimonials
function scrollAt(K, p) { for (var i = 1; i < K.length; i++) if (p <= K[i][0]) {
  var a = K[i - 1], b = K[i], u = (p - a[0]) / (b[0] - a[0] || 1);
  u = u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2; return a[1] + (b[1] - a[1]) * u; }
  return K[K.length - 1][1]; }
window.MD_SCREEN_ph = function (p) { document.getElementById("phone-page").style.transform = "translateY(" + (-Math.round(scrollAt(PH, p))) + "px)"; };
```

Escolha as paradas com `find-rows.mjs` ou medindo a página capturada; nunca adivinhe.

## Adaptar a uma marca

- Vem da marca: a fonte de destaque (toda a tipografia), o texto, o domínio, o retrato do fundador, o site no celular, a luz de contorno do celular (cor de destaque) e a escolha dos adereços (as metáforas da própria marca).
- Fica fixo: o fundo cinza, a grade de pontos de 30 px, os asteriscos pretos, as caixas, o cursor, a faixa e o anel em `#2a2a2a`, as cortinas pretas, a granulação, todas as curvas e durações acima. A cor de destaque nunca pinta uma forma ou uma palavra: uma marca com cor forte ainda recebe um filme cinza, e a cor dela vive no material real. Essa contenção é o tema.
- Uma marca só escura: mantenha o fundo cinza do mesmo jeito; o celular e os adereços carregam o resto.
- 16:9: a mesma gramática; asteriscos de 900 px em cantos opostos, caixas e manchetes centralizadas no terço do meio, o celular vira `macbook`.

## Armadilhas encontradas durante a construção

- Anéis, faixas e hospedeiros de subcomposição podem aparecer no quadro 0: ponha-os em `opacity: 0` no tempo 0 da linha do tempo (`tl.set("#ring", {opacity:0}, 0)`) e só revele no quadro em que começam a se desenhar; todo `fromTo` que começa depois de 0 e não pode afetar o quadro 0 precisa de `immediateRender: false`.
- A varredura da mancha precisa cobrir a troca: a seção que entra começa 0,2 s antes de a que sai terminar, e a mancha está com escala 2,4x nesse momento. Confira os dois quadros de cada lado do corte numa folha; uma mancha que passa alta demais deixa as palavras antigas visíveis.
- O comentário em itálico sobre as cortinas (plano 7) fica onde as bordas das cortinas e um relógio caindo o cruzam; a 36 px #555 ele perde contraste. Mantenha qualquer linha desse plano dentro do V entre as cortinas e acima de y 1100, ou tire-a.
- Manchas cruzando palavras: os asteriscos têm z-index 40, acima do texto. Planeje o texto nos 60% do meio do quadro e confira a cada 4 quadros se um lóbulo cai sobre uma letra.
- Texto dentro de caixas: as linhas em caixas precisam caber dentro da caixa tracejada com 20 px ou mais de folga; rode `scripts/frame-audit.mjs <dir>` (texto fora da caixa, texto sobre texto, texto fora do quadro). A digitação corrida é a única linha com permissão de sair do quadro e precisa levar `data-bleed`.
- O caminho do cursor e a caixa precisam dividir duração e curva, ou o canto da caixa e a ponta do cursor se separam no meio do arrasto.
- O megafone reaparece no plano 3 como um segundo elemento (`#mega2`): esconda-o com `tl.set(..., {opacity:0})` no início da seção ou ele aparece sob a faixa.

## Som

- 100 BPM, clima `minimal`, lá menor; subida de tensão até 4,8, queda em 4,8, sinal da logo em 9,6. Mixagem a -14 LUFS.
- Sons de interface nos eventos: whoosh na entrada das manchas (0,0) e em cada varredura (2,05, 4,45 faixa, 6,0 rolagem da faixa, 9,4 celular), clique quando o cursor começa cada caixa (0,8, 7,75, 8,55), pop em cada manchete (1,25, 2,7 megafone, 4,9 moldura, 10,3), shimmer quando o anel se desenha (6,5), quatro ticks nas palavras da digitação corrida (12,60, 12,78, 12,96, 13,14, um por palavra na defasagem de 0,18 s), um golpe quando as cortinas fecham e o relógio pousa (14,4), um pop no substantivo da assinatura (16,55).
