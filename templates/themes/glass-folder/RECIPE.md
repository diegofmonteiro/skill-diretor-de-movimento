# Pasta de vidro: receita

Um plano principal vertical de 7,5 segundos: sobre um fundo quase preto iluminado por uma faixa de luz na cor da marca, um grande cursor de vidro desliza até uma pequena pasta na cor da marca e clica nela; a pasta gira para uma vista de três quartos, cresce e se levanta, a luz se abre, e cinco cartões reais sobem e se abrem em leque saindo dela (o do centro um player ao vivo tocando o vídeo da própria marca, com os controles funcionando), atrás de uma frente de vidro fosco com a marca e o nome; a luz corre uma vez pelo vidro; uma palavra gigante da marca surge acima num degradê que se dissolve para baixo, o nome do produto fica sobre ela em branco e quatro palavras pequenas se espalham embaixo. Depois o objeto inteiro continua girando devagar e o player aperta pausar e tocar. Funciona porque é UM objeto desenhado, tratado como foto de produto: pessoas e vídeo reais dentro, vidro de verdade (desfoque, borda, brilho interno) na frente, uma só fonte de luz, e nada nunca totalmente parado.

## Formato, duração, ritmo

- 1080x1920 (9:16), 30 fps, 7,5 s, um plano contínuo, sem cortes. Construído numa grade de 110 BPM (batida de 0,545 s).
- Batidas medidas na fonte:
  - 0,05-0,85 s: o cursor desliza para dentro
  - 0,85-1,11 s: clique (achata, volta com mola)
  - 1,0-2,1 s: a pasta gira, cresce e se levanta; a luz se abre (até 2,4 s)
  - 1,2-2,25 s: os cartões sobem e abrem em leque, com 0,04 a 0,08 s de intervalo
  - 1,0-2,2 s: o cursor viaja em direção à câmera
  - 2,1-3,2 s: brilho pela frente de vidro
  - 2,6-3,3 s: a palavra grande da marca surge
  - 2,95-3,53 s: o nome do produto, palavra por palavra
  - 3,6-4,38 s: quatro palavras pequenas, com 0,16 s de intervalo
  - 2,1-7,5 s: um giro lento do objeto inteiro (a pausa)
  - 5,55 s e 6,35 s: o botão do player é apertado (pausar, depois tocar)
- Como abertura de um filme mais longo: corte em 4,5 s num mergulho no vídeo do cartão do centro; como loop independente, segure até 7,5 s.

## O visual, em números

**Fundo e luz** (tudo CSS, sem imagens):
- `#bg`: `radial-gradient(120% 70% at 50% 42%, #1a0907 0%, #0b0504 45%, #040202 100%)` (destaque a cerca de 8% sobre preto, caindo para preto). Fundo da página `#050303`.
- `#band`: uma elipse de x -260 a 1340, y 560-940 (logo atrás da borda de cima da pasta), `radial-gradient(50% 50% at 50% 50%, accent-light 100% 0%, accent 70% 35%, accent-deep 25% 65%, transparent 82%)`, `filter: blur(36px)`; opacidade 0,55, subindo a 1 enquanto a pasta se abre.
- `#cone`: 1500x1000 a partir de y -200, centralizado, `radial-gradient(48% 100% at 50% 100%, accent 50%, accent-deep 18% 55%, transparent 75%)`, blur de 30 px; opacidade 0,6 a 1 junto com a faixa. A luz cai de cima sobre o objeto.
- Granulação: SVG fractalNoise baseFrequency 1.1, 1 oitava, semente 8, cinza neutro a 50% de alfa, opacidade da camada 0,45, overlay, z 90. Mais pesada que no tema Vidro de propósito: mata o efeito de faixas no degradê escuro.
- Sem vinheta: o fundo radial faz isso.

**Funções da paleta** (a cor de destaque da fonte era `#CA433C`; derive o resto da cor de destaque da marca):
- accent-light `#F26E62` / `#F06A5F` (destaque clareado cerca de 25% em direção ao branco): topo da pasta, realce do cursor, o topo da palavra grande
- accent `#D84A40` / `#CA433C`: meio da pasta, moldura dos cartões
- accent-deep `#A82E26` / `#8E241F` (destaque a cerca de 75% de brilho): base da pasta, sombra do cursor
- tinta do vidro `rgba(255,175,166)` / `rgba(236,104,92)` / `rgba(214,76,66)`: o destaque em 3 luminosidades, 20 a 34% de alfa
- branco para o nome do produto e o rótulo da frente; branco a 70% para as palavras pequenas

**Tipografia** (fonte de destaque da marca):
- palavra grande da marca: 172 px, peso 800, espaçamento -0.02em, entrelinha 1, centralizada em top 190; preenchimento `linear-gradient(180deg, accent-light 0%, accent 85% at 45%, accent 0% at 92%)` recortado no texto, de modo que a metade de baixo se dissolve no escuro
- nome do produto: 56 px, 700, -0.01em, branco, centralizado em top 300 (sobre a metade de baixo da palavra grande), `text-shadow 0 6px 24px rgba(0,0,0,.45)`
- palavras pequenas: 26 px, 500, branco a 70%, em top 384, bordas esquerdas em x 250, 420, 580, 760 (espalhadas pela largura da palavra grande, não uma frase)
- rótulo da frente: 40 px, 700, -0.01em, branco, depois de uma marca de 64 px, espaço de 18 px, em left 46 bottom 44
- maiúsculas e minúsculas de frase em todo lugar

**A pasta** (em `#stage`, perspectiva de 1500 px, origem 50% 46%; `#rig` 620x620 em left 230 top 640, `preserve-3d`, origem 50% 70%):
- fundo: 620x620, `linear-gradient(165deg, accent-light 0%, accent 40%, accent-deep 100%)`, um realce superior `linear-gradient(180deg, white 28%, transparent 18%)`, formato da aba por `clip-path: path('M 0 66 Q 0 30 36 30 L 190 30 Q 214 30 230 50 L 248 72 L 584 72 Q 620 72 620 108 L 620 584 Q 620 620 584 620 L 36 620 Q 0 620 0 584 Z')` (aba de 0 a 248 de largura, cantos de 36 px)
- cartões: raio de 22 px, uma moldura colorida de 8 px em volta da imagem (raio da imagem 15 px), origem embaixo no centro, sombra `0 30px 60px -20px rgba(0,0,0,.7)`:

  | cartão | left, top | tamanho | moldura |
  |---|---|---|---|
  | fundo-esquerda B1 | 40, 150 | 270x360 | luz quente `#d9d2c4` |
  | fundo-direita B2 | 310, 150 | 270x360 | escura `#2b2b33` |
  | esquerda L | 50, 130 | 290x390 | creme `#EFE7D8` |
  | direita R | 280, 130 | 290x390 | destaque escuro `#3b1715` |
  | centro C (player) | 140, 90 | 340x500 | `linear-gradient(160deg, accent-light, accent 55%, accent-deep)` |

  O cartão do centro tem um vídeo de 320x362 (raio 16) e um painel de controles embaixo (`rgba(20,8,7,.55)`, raio 16): uma barra de progresso de 5 px (branca sobre branco a 25%), depois uma fileira de 5 controles de 34 px (coração em accent-light, anterior, um círculo branco de 64 px com pausar/tocar em quase preto, próximo, aleatório), desenhados como caminhos SVG embutidos.
- frente de vidro: 640x420 em left -10 top 216 (ultrapassa o fundo em 10 px de cada lado), raio de 40 px, origem embaixo no centro:
  - preenchimento `linear-gradient(170deg, rgba(255,175,166,.30) 0%, rgba(236,104,92,.20) 45%, rgba(214,76,66,.34) 100%)`
  - `backdrop-filter: blur(7px) saturate(140%)` (desfoque baixo: os cartões atrás continuam legíveis como pessoas)
  - `inset 0 2px 0 rgba(255,230,225,.85)` borda de cima, `inset 0 0 0 2px rgba(255,190,182,.45)` contorno, `inset 0 -40px 80px rgba(255,120,108,.25)` brilho interno de baixo, `0 0 70px` destaque a 35% de brilho externo
  - brilho: `::before` com `linear-gradient(115deg, transparent 30%, rgba(255,255,255,.22) 42%, transparent 54%)` movido por `translateX(var(--sheen))`, de -60% a 160%
- profundidade dentro da estrutura: cartões z 10 / 14 / 26 / 30 / 44 e deslocamentos y 70 / 70 / 50 / 50 / 26 (começam recolhidos); frente z 70, rotationX -6.

**O cursor**: uma seta SVG de 250 px (viewBox 200), ponta no canto superior esquerdo: `M 40 34 L 176 96 L 116 120 L 96 180 Z`, preenchida E contornada com 30 px de junção redonda com um degradê diagonal (rosa claro do destaque `#FFB2A9` até accent-light `#EE6A5E` a 45% até accent-deep `#B8342B`), uma borda interna de 3 px a 55% pálida, um triângulo de realce branco no topo que some a 0 na metade da altura. Brilho: `drop-shadow(0 0 30px accent-light 55%) drop-shadow(0 24px 30px rgba(0,0,0,.5))`. É um objeto 3D macio, não um ícone de ponteiro.

## Lista de planos (um plano, por batida)

| tempo | na tela | o que se move e como | estático | saída |
|---|---|---|---|---|
| 0-0,85 | o fundo escuro, a faixa a 55%, o cone a 60%, a pasta pequena e frontal no centro (estrutura scale 0,78, rotationX 4, y 40) com o topo do cartão do player aparecendo acima da frente, o cursor no canto inferior direito dela (x 720, y 1150, scale 0,62) | o cursor desliza até 660, 1090 em 0,8 s power2.inOut | a pasta; o vídeo no cartão do centro toca desde o quadro 0 | nenhuma |
| 0,85-1,11 | clique | cursor scale 0,62 a 0,54 em 0,08 s power2.out, de volta a 0,62 em 0,18 s back.out(2) | | nenhuma |
| 1,0-2,25 | a pasta se abre | estrutura `rotationX 4 para 15, rotationY 0 para -22, rotationZ 0 para 11, scale 0.78 para 1.04, y 40 para 0`, 1,1 s power3.inOut; frente `rotationX -6 para -14`, 1,0 s; faixa e cone a opacidade 1, 1,4 s power2.inOut; os cartões sobem, 0,85 s cada: C `y -160` back.out(1.35) em 1,2 s, L `y -40, x -120, rotationZ -22` back.out(1.3) em 1,28 s, R `y -40, x 120, rotationZ 22` em 1,32 s, B1 `y -10, x -60, rotationZ -10` back.out(1.2) em 1,36 s, B2 `y -10, x 60, rotationZ 10` em 1,4 s; o cursor viaja em direção à câmera `x 580, y 1400, scale 1.4`, 1,2 s power3.inOut (termina grande e abaixo à direita da pasta, como um objeto em primeiro plano) | | nenhuma |
| 2,1-3,2 | luz no vidro | brilho de -60% a 160%, 1,1 s power2.inOut | | nenhuma |
| 2,1-7,5 | a pausa | estrutura `rotationY -22 para -14, rotationZ 11 para 8, rotationX 15 para 13, y 0 para -16`, 5,4 s sine.inOut; cursor `x 610, y 1450`, 5,2 s sine.inOut | | nenhuma |
| 2,6-4,4 | o título acima | palavra grande `opacity 0 para 1, y 40 para 0, blur 14 para 0`, 0,7 s power3.out em 2,6 s; nome do produto por palavra `opacity, y 18, blur 10`, 0,4 s, com 0,18 s de intervalo a partir de 2,95 s; palavras pequenas `opacity, blur 6`, 0,3 s cada em 3,6 / 3,76 / 3,92 / 4,08 s | | parado |
| 0-7,5 | o player está ao vivo | o vídeo toca; o progresso `scaleX 0.12 para 0.86` linear pelos 7,5 s todos; em 5,55 s o botão se achata (0,86, 0,08 s yoyo) e pausar troca por tocar em 5,6 s; em 6,35 s achata de novo e tocar volta para pausar em 6,4 s | | parado |

## Materiais e onde obtê-los para uma marca nova

| material | fonte | como |
|---|---|---|
| cor de destaque, fonte de destaque, marca, nome | o site da marca | `node scripts/brand-intake.mjs <url> --project <dir>`; marca cortada com `node scripts/trim-alpha.mjs mark.png mark.png --pad 8` (ela aparece com 64 px no vidro) |
| o vídeo do cartão do centro | o vídeo principal da própria marca: um vídeo do site capturado pelo brand-intake, ou o último vídeo do YouTube do fundador (`yt-dlp -f "bv*[height<=1080]" --no-playlist -o hero-full.mp4 <url>`) | corte 8 s de um momento de fala ou demonstração e recorte em 3:4: `ffmpeg -ss <t> -t 8 -i hero-full.mp4 -vf "crop=ih*3/4:ih,scale=720:960" -an -c:v libx264 -crf 18 hero.mp4` |
| os quatro cartões laterais | as miniaturas do YouTube da marca (o brand-intake grava `yt-<id>.jpg` para os vídeos que o site incorpora) ou imagens paradas dos próprios vídeos da marca (pessoas em cena funcionam melhor) | recorte cada uma em 3:4 em volta do rosto ou do assunto: `ffmpeg -i thumb.jpg -vf "crop=ih*3/4:ih:<x>:0,scale=480:640" cardL.jpg` (B1 420x560, B2 390x520, L e R 480x640) |
| a palavra grande, o nome do produto, as palavras pequenas | o nome da própria marca e a promessa do produto, vindos do site (um substantivo de 1 palavra da marca, um nome de produto de 2 palavras, 4 palavras curtas da proposta) | |
| todo o resto | código | nada é baixado |

Se a marca não tem vídeo: ponha a melhor tela do produto (brand-intake `--shots`) no cartão do centro como imagem parada e tire os controles, ou use uma captura do site rolada por uma interpolação de `y` dentro do cartão. Se não tem pessoas: preencha os cartões laterais com telas reais do produto ou logos de clientes em molduras claras. Extras gratuitos só se a pasta precisar guardar uma coisa física: `node scripts/find-assets.mjs "<objeto>" --out <dir> --cutout` (foto CC0, assunto recortado) ou um modelo do Poly Haven renderizado com `node scripts/prop-render.mjs <model.gltf> prop.png --rx -10 --ry 25 --fill 0.8`. Um rosto recortado de uma foto para a borda de um cartão: `node scripts/cutout.mjs <photo> <out.png>`.

## Mecânica

```html
<div id="root" data-composition-id="main" data-start="0" data-duration="7.5" data-width="1080" data-height="1920" data-fps="30">
  <div id="bg"></div><div id="cone"></div><div id="band"></div>
  <div id="ghost" data-layered>BRAND</div>
  <div class="tw" id="t1"><span class="w">Product</span> <span class="w">Name</span></div>
  <div id="subs"></div>
  <div id="stage"><div id="rig">
    <div class="back"></div>
    <div class="card" id="cB1"><img src="assets/cardB1.jpg" alt="" /></div>
    <div class="card" id="cB2"><img src="assets/cardB2.jpg" alt="" /></div>
    <div class="card" id="cL"><img src="assets/cardL.jpg" alt="" /></div>
    <div class="card" id="cR"><img src="assets/cardR.jpg" alt="" /></div>
    <div class="card" id="cC">
      <!-- the TIMED element is the <video> itself: class="clip" + data-start + data-duration on it -->
      <div class="vid"><video id="hv" class="clip" data-start="0" data-duration="7.5" muted playsinline src="assets/hero.mp4"></video></div>
      <div class="ctl"><div class="bar"><i id="prog"></i></div><div class="row"><!-- 5 SVG controls; .pp holds #pause and #play --></div></div>
    </div>
    <div class="front" id="front"><div class="brand"><img src="assets/mark.png" alt="" /><span>name</span></div></div>
  </div></div>
  <svg id="cursor" viewBox="0 0 200 200"><!-- see The look --></svg>
  <div id="grain"></div>
</div>
```

```css
#ghost { position:absolute; left:0; right:0; top:190px; text-align:center; font:800 172px/1 var(--font-display); letter-spacing:-0.02em;
  background: linear-gradient(180deg, var(--accent-light) 0%, color-mix(in srgb, var(--accent) 85%, transparent) 45%, transparent 92%);
  -webkit-background-clip:text; background-clip:text; color:transparent; }
.front::before { content:""; position:absolute; inset:0;
  background: linear-gradient(115deg, transparent 30%, rgba(255,255,255,.22) 42%, transparent 54%); transform: translateX(var(--sheen, -60%)); }
```

```js
const tl = gsap.timeline({ paused: true });
const R = "#rig", CARDS = ["#cB1", "#cB2", "#cL", "#cR", "#cC"];
// layout defaults (depth inside the folder); anything that must be HIDDEN at t=0 is hidden by a fromTo on tl below
gsap.set(R, { rotationX: 4, rotationY: 0, rotationZ: 0, scale: 0.78, y: 40 });
gsap.set(CARDS, { z: (i) => [10, 14, 26, 30, 44][i], y: (i) => [70, 70, 50, 50, 26][i] });
gsap.set("#front", { z: 70, rotationX: -6 });
gsap.set("#cursor", { x: 720, y: 1150, rotation: 0, scale: 0.62 });
gsap.set("#band", { opacity: 0.55 }); gsap.set("#cone", { opacity: 0.6 });

// the click
tl.to("#cursor", { x: 660, y: 1090, duration: 0.8, ease: "power2.inOut" }, 0.05);
tl.to("#cursor", { scale: 0.54, duration: 0.08, ease: "power2.out" }, 0.85);
tl.to("#cursor", { scale: 0.62, duration: 0.18, ease: "back.out(2)" }, 0.93);
// the folder turns into three-quarter, the light opens
tl.to(R, { rotationX: 15, rotationY: -22, rotationZ: 11, scale: 1.04, y: 0, duration: 1.1, ease: "power3.inOut" }, 1.0);
tl.to("#front", { rotationX: -14, duration: 1.0, ease: "power3.inOut" }, 1.05);
tl.to(["#band", "#cone"], { opacity: 1, duration: 1.4, ease: "power2.inOut" }, 1.0);
// the fan: centre highest, the sides turning out, the back pair least
tl.to("#cC",  { y: -160, duration: 0.85, ease: "back.out(1.35)" }, 1.2);
tl.to("#cL",  { y: -40, x: -120, rotationZ: -22, duration: 0.85, ease: "back.out(1.3)" }, 1.28);
tl.to("#cR",  { y: -40, x: 120,  rotationZ: 22,  duration: 0.85, ease: "back.out(1.3)" }, 1.32);
tl.to("#cB1", { y: -10, x: -60,  rotationZ: -10, duration: 0.85, ease: "back.out(1.2)" }, 1.36);
tl.to("#cB2", { y: -10, x: 60,   rotationZ: 10,  duration: 0.85, ease: "back.out(1.2)" }, 1.4);
tl.to("#cursor", { x: 580, y: 1400, scale: 1.4, duration: 1.2, ease: "power3.inOut" }, 1.0);
tl.fromTo("#front", { "--sheen": "-60%" }, { "--sheen": "160%", duration: 1.1, ease: "power2.inOut" }, 2.1);
// the hold: never still
tl.to(R, { rotationY: -14, rotationZ: 8, rotationX: 13, y: -16, duration: 5.4, ease: "sine.inOut" }, 2.1);
tl.to("#cursor", { x: 610, y: 1450, duration: 5.2, ease: "sine.inOut" }, 2.2);
// the title
tl.fromTo("#ghost", { opacity: 0, y: 40, filter: "blur(14px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.7, ease: "power3.out" }, 2.6);
tl.fromTo("#t1 .w", { opacity: 0, y: 18, filter: "blur(10px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.4, stagger: 0.18, ease: "power3.out" }, 2.95);
["#s0", "#s1", "#s2", "#s3"].forEach((s, i) => tl.fromTo(s, { opacity: 0, filter: "blur(6px)" }, { opacity: 1, filter: "blur(0px)", duration: 0.3 }, 3.6 + i * 0.16));
// the live player
tl.fromTo("#prog", { scaleX: 0.12 }, { scaleX: 0.86, duration: 7.5, ease: "none" }, 0);
const press = (at, showPlay) => {
  tl.fromTo("#cC .pp", { scale: 1 }, { scale: 0.86, duration: 0.08, yoyo: true, repeat: 1, immediateRender: false }, at);
  tl.set("#pause", { opacity: showPlay ? 0 : 1 }, at + 0.05); tl.set("#play", { opacity: showPlay ? 1 : 0 }, at + 0.05);
};
press(5.55, true); press(6.35, false);

window.__timelines = window.__timelines || {};
window.__timelines["main"] = tl;
```

A fonte é GSAP puro. Dentro de um filme do diretor-de-movimento, ligue os três elementos do título como `.md-line`s (`data-in` / `data-out`, por exemplo a palavra grande `data-in="line@2.6"`, o nome `words@2.95`, as palavras pequenas `words@3.6`) e chame `MD.lines(tl)` / `MD.finish(tl)` para o verificador e a crítica os enxergarem.

## Adaptar a uma marca

Vem da marca: a cor de destaque (e as três luminosidades derivadas dela) para a faixa de luz, a pasta, a tinta do vidro, o cursor e a palavra grande; a fonte de destaque; a marca e o nome na frente; o vídeo principal e os quatro cartões de pessoas/produto; a palavra da marca, o nome do produto e as quatro palavras da proposta. Fica fixo: um objeto, centralizado, com 57% da largura do quadro; uma só fonte de luz (a faixa na borda de cima da pasta mais o cone vindo de cima) sobre um fundo quase preto; granulação pesada; a virada de pequeno frontal para grande em três quartos (rotationY -22, rotationZ 11) em power3.inOut; as amplitudes do leque (-160 / +-120 / +-60 e +-22 / +-10 graus) em back.out 1,2 a 1,35; o cursor como um objeto de vidro 3D macio que se move em direção à câmera depois do clique; um brilho; o giro lento na pausa; o player ao vivo. Uma marca clara: mantenha o fundo escuro (é um estúdio iluminado, não uma página); uma marca cuja cor de destaque é escura (azul-marinho, verde-floresta): eleve a faixa para accent-light a 100% e use branco no ponto de cima da palavra grande.

## Armadilhas encontradas durante a construção

- A mídia com tempo precisa ser o próprio clipe: ponha `class="clip" data-start data-duration` no elemento `<video>`, não numa div em volta, ou o HyperFrames não o busca e o cartão mostra o primeiro quadro congelado. Corte o clipe com pelo menos a duração do filme antes de usar (o `hero.mp4` de 8 s para um filme de 7,5 s); um clipe mais curto congela no último quadro.
- Um `gsap.set(..., {opacity: 0})` feito antes de a linha do tempo ser registrada pode ser sobrescrito quando o HyperFrames busca um ponto; esconda tudo o que precisa estar invisível em t=0 com um `fromTo` (ou `tl.set` em 0) na linha do tempo registrada, como o título faz.
- Frentes de vidro em PNG escondem a mídia atrás delas. A frente aqui é CSS com `backdrop-filter`, então os cartões e o vídeo aparecem através, suavizados. Se você trocar por um PNG de vidro ou de aparelho renderizado, ponha a mídia ACIMA dele, recortada na janela.
- Mantenha o desfoque do fundo em 7 px: os 14 a 22 px dos outros temas de vidro transformam as pessoas atrás da frente em névoa de cor.
- A aba do fundo é um `clip-path: path(...)` em px; se mudar o tamanho da pasta, o caminho precisa ser reescalado (não é baseado em porcentagem).
- Texto sobre texto é proposital aqui (o nome do produto sobre a metade que se dissolve da palavra grande). O `scripts/frame-audit.mjs` aponta texto sobre texto; a palavra grande leva `data-layered`, que a auditoria lê como um título em camadas deliberado (ela pula o teste de sobreposição para ele). Nada mais pode se sobrepor.
- As palavras pequenas são espalhadas por bordas esquerdas fixas (250, 420, 580, 760) medidas contra a palavra de 172 px; uma palavra de marca mais longa precisa de novas bordas, medidas da caixa renderizada da palavra.
- Área segura do 9:16: o bloco do título fica em y 190-410 e o cursor termina em y ~1450-1700 com escala 1,4. Para uma publicação de feed, mantenha o título abaixo de y 168 longe da interface do alto (está: 190) e nada legível abaixo de 1330 (o cursor não é texto).
- `--sheen` é uma propriedade personalizada: interpole-a com `fromTo` e valores em texto (`"-60%"` a `"160%"`).

## Som

110 BPM, quente, base em lá menor (a trilha da prova). Sons de interface nos eventos do próprio filme:
- clique: o clique do cursor (0,88 s) e cada toque no player (5,55 s, 6,35 s)
- whoosh: a pasta girando em direção à câmera (1,0 s)
- pop: o cartão do centro e os cartões laterais subindo (1,25 s, 1,32 s); a palavra grande e o nome do produto chegando (2,6 s, 2,95 s)
- shimmer: o brilho pelo vidro (2,1 s)
- tick: cada palavra pequena (3,6, 3,76, 3,92, 4,08 s)
Sem golpe: não há chegada de logo; se o filme continuar até um cartão final, o único golpe vai lá.
