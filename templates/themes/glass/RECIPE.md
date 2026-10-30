# Glass: receita

Um filme de lançamento escuro em que as cores da marca se movem como luz de seda sob painéis de vidro fosco, e UMA câmera voa por um único mundo 3D: um gancho que já é resultado no quadro 0, um objeto que explode nas partes do produto, um pipeline acompanhado pela câmera, os números reais carimbados em placas de vidro (o drop), as marcas reais de clientes numa parede giratória, o site real vivo num notebook e num celular em 3D, e então a marca pousando na batida forte. Funciona porque nada fica parado nem chapado: o fundo é luz, cada painel pega um varrido de luz ao pousar, tudo o que não é o assunto fica ao fundo, desfocado, e cada movimento é cortado na grade de batidas, de modo que imagem e trilha leem uma única medida.

Duas versões aprovadas: um lançamento de produto em 16:9 (24,8 s, 120 BPM) e uma abertura de canal em 9:16 (19,55 s, 128 BPM). Mesma gramática, conteúdo de plano diferente.

## Formato, duração, ritmo

| | Lançamento 16:9 | Abertura de canal 9:16 |
|---|---|---|
| quadro | 1920x1080, 30 fps | 1080x1920, 30 fps |
| duração | 24,8 s (12 compassos + 0,8 s de cauda) | 19,55 s (8 compassos + 4,55 s de cartão final) |
| BPM / batida / compasso | 120 / 0,5 s / 2 s | 128 / 0,469 s / 1,875 s |
| marcas | `drop` = compasso 4 (8,0 s), `logo` = compasso 10 (20,0 s) | `drop` = compasso 4 (7,5 s), `logo` = compasso 8 (15,0 s) |
| planos | 2; 2; 4; 4; 4; 4; 4,8 s | 1,875; 1,875; 3,75; 3,75; 3,75; 4,55 s |

Regra de ritmo: os planos têm compassos inteiros (1 compasso para o gancho e para o primeiro objeto, 2 compassos para cada plano seguinte), algo novo pousa a cada batida dentro de um plano, os números de assinatura pousam no drop, a marca pousa em `logo` e segura por 4,5 a 4,8 s. Os cortes nunca são secos: cada plano sai por um mergulho, uma chicotada ou um desfoque 0,24 a 0,45 s antes da linha do compasso.

## O visual, em números

**Fundo.** Um canvas WebGL de seda (`MD.silk`, `md-silk.js`) sob tudo:
- `colors: [ground, accent-deep, accent-light]`
  - ground: o neutro mais escuro da marca, ou `#0E0D0C` / `#050404` se a marca for clara
  - accent-deep: o destaque com cerca de 65 a 70% do brilho (o destaque `#CA433C` deu `#8E2A25`)
  - accent-light: o destaque clareado de 30 a 40% em direção ao branco, mantendo a saturação (`#E07B73`, `#FF5A4F`)
- `intensity` 0,32 (16:9) / 0,4 (9:16) atrás do texto; `speed` 0,55 a 0,6; `angle` 0,62 (16:9, padrão, fitas na diagonal) ou 1,9 (9:16, fitas mais verticais)
- o nível acompanha a grade (`MD.silkLevel`): até 0,62 a 0,7 na subida para o drop, 0,5 a 0,55 no drop, descendo a 0,22 sob a parede de clientes e a 0,24 a 0,3 sob o cartão final.

**Painel de vidro** (`.md-glass` em `md-world.css`): preenchimento `linear-gradient(150deg, rgba(255,255,255,.16), rgba(255,255,255,.04))`, `backdrop-filter: blur(22px) saturate(160%)`, borda de luz `inset 0 1px 0 rgba(255,255,255,.45)`, fio `inset 0 0 0 1px rgba(255,255,255,.12)`, sombra `0 40px 90px -30px rgba(0,0,0,.45)`, brilho do destaque `0 0 80px -10px` com o destaque a 35%. Raio por objeto: pílulas = metade da altura (66px, 60px), cartões 34px, ladrilhos 28px, estações 32px, placas 36px, ladrilhos de cliente 24px, disco = metade da largura. O varrido de luz é uma faixa de 105deg, branca a 28%, com 36% de largura, em `mix-blend-mode: screen`.

**Profundidade de campo.** Fora de foco = `filter: blur(7-9px)` + opacidade de 0,45 a 0,55 + empurrado para trás em `z: -260`. Em foco = blur 0, opacidade 1, `z: +80`.

**Mundo.** `.md-world` com perspectiva de 1600px e origem em 50% 46%; a câmera é o `.md-rig` dentro dele (sempre leva `data-layout-allow-overflow`).

**Acabamento.** `.md-vignette` radial de 120%x90% em 50% 45%, limpo até 55%, preto a 22% na borda; `.md-grain` com ruído fractal em SVG (baseFrequency 0,9, 2 oitavas) a 5% de opacidade, em overlay, estático.

**Papéis da paleta.**
- `--ground`: fundo da seda e fundo da raiz (sempre escuro; este tema é escuro mesmo para uma marca clara, e a cor clara da marca vira `--ink`)
- `--ink`: `#F8F7F3` ou o quase-branco da marca
- `--muted`: tinta a 60 a 62%
- `--accent`: pontos, barras de progresso, luz do trilho, traço do anel, barras do gráfico, face do botão de chamada
- `.md-lit` (a palavra-chave, iluminada e não pintada): um tom claro do destaque com brilho do destaque. 16:9: `color #FFB4AD; text-shadow 0 0 34px` com o destaque a 85%. 9:16: `color #FF6A5F; text-shadow 0 0 30px` com o destaque a 90%
- uma segunda cor da marca, se houver, para UMA palavra de destaque por filme (o 9:16 usou um amarelo `#FFC93C` com `0 0 40px` a 35% na última palavra do gancho e na última linha do cartão final)
- fixos: degradê do gráfico `linear-gradient(180deg, accent-light, accent)`; pontos de comprador `#F8F7F3` com `0 0 14px rgba(255,255,255,.7)`

**Tipografia.** A fonte de títulos da marca, capturada pelo brand-intake.

16:9 (maiúscula só no início da frase):
| papel | peso | tamanho | espaçamento | altura de linha |
|---|---|---|---|---|
| golpe do gancho | 700 | 280px | -0.025em | 0.9 |
| título do plano | 700 | 110-124px | -0.025em | 0.9 |
| linha do plano do dispositivo | 700 | 76px | -0.025em | 0.9 |
| legenda sob um mundo | 600 | 58px | -0.02em | 0.9 |
| título de ladrilho / estação | 700 | 56 / 72px | -0.025em | 1 |
| número numa placa | mono 700 (JetBrains Mono) | 132px | -0.025em | 1 |
| código de tempo | mono 700 | 64px | -0.02em | 1 |
| rótulo | texto 600 | 20-30px | 0.2em, MAIÚSCULAS | 1 |
| botão de chamada | texto 600 | 46px numa pílula, recuo 26px 64px | 0 | 1 |

9:16 (MAIÚSCULAS, largo): fonte de títulos 900, `font-stretch: 112%`, espaçamento -0.025em, altura de linha 0.92, caixa `left:76px; right:162px` (o trilho da direita fica livre).
| papel | tamanho |
|---|---|
| golpe do gancho | 116px, última palavra 176px na segunda cor |
| linha do plano | 78px |
| legenda | 56px |
| contagem grande | 150px |
| linhas do cartão final | 92px, passo de linha de 110px |
| título de documento num painel | 800, stretch 105%, 52px, lh 1.04 |
| título de parte | 800, 38px |
| rótulo | 700, stretch 112%, 26px, 0.2em, tinta a 62% |
| botão de chamada | 800, stretch 112%, 40px, 0.14em, recuo 30px 60px, cantos retos |

Nunca mais apertado que -0.025em. Mantenha cada linha com `white-space: nowrap` e um tamanho medido, para que nunca quebre sem planejamento.

## Lista de planos, lançamento 16:9 (120 BPM, B = índice da batida, B1 = 0,5 s)

| tempo | na tela | o que se move e como | estático | saída |
|---|---|---|---|---|
| 0-2,0 gancho | o número da dor como golpe de 2 linhas ("N horas / por semana.", o número em `.md-lit`) à esquerda 130px, topo 230/500, 280px; uma pílula de vidro REC (600x132, lado direito, topo 300) com um ponto e um código de tempo mono; em B2 uma linha de 110px "Você grava." sob a pílula | as linhas `zoom@0` e `zoom@0.18` (por palavra: escala 2,4 para 1, blur 16 para 0, 0,45 s, atraso de 0,09, expo.out); pílula `z -300 para 0, blur 10 para 0, 0,5 s expo.out` em 0; o código de tempo faz `count` de 0 a 4 em 1,3 s no formato `0{n}:00:00` e então é carimbado; o ponto pisca a cada batida (`scale 1.35 para 1, opacity 1 para .55, 0,42 s`); varrido sobre a pílula em B1,2; soco de 5% no rig em B3 | a seda se move; nada mais fica à toa | a pílula sai chicoteada para a esquerda `x -700, blur 24, 0,26 s power3.in` em B3,74; as linhas fazem `zoom` de saída (escala 1,7, blur 14, 0,25 s) em B3,7-3,75 |
| 2-4 gravação | um cartão de vidro de "gravação" (720x500, à direita) com uma onda de 44 barras e uma barra de progresso; título de 2 linhas à esquerda a 120px, com `mask` de entrada em B4,2 / B4,5 | cartão `MD.fly` vindo de z -1100, ry -24, 0,75 s; as barras da onda se reescalam a cada meia batida (com semente, 0,22 s power2.out); progresso scaleX de 0 a 1 linear de B4,3 a B6; em B6-0,15 o cartão encolhe para 0,6 e desfoca (0,3 s); em B6 seis ladrilhos de vidro (as seis tarefas do produto, 520x230) explodem do lugar do cartão para um arco 3D de 2x3 (`z -400 para o z do encaixe`, rotationY em +-14/+-12/0, escala 0,3 para 1, blur 12 para 0, 0,7 s expo.out, atraso de 0,06 s), e a barra de cada ladrilho se enche (0,8 s power2.inOut, atraso de 0,09 s); o grupo todo de ladrilhos deriva x -60 y -20 até B8 | o título segura | a câmera mergulha: rig `scale 2.6, opacity 0, blur 18, 0,45 s power3.in`, terminando em B8 |
| 4-8 pipeline | três estações de vidro (500x430) num trilho de 1640px em y 760: rótulo da fase + título + uma visualização viva (pontos que escorrem para um ponto; um anel que se enche enquanto um ponto percorre uma linha; quatro barras crescendo) | estações `MD.fly` z -700, y 200, rx 30, 0,8 s, atraso de 0,09; a câmera é marcada no rig: B8 x 884 escala 1,55 (estação 1), B11 x 0, B13 x -884 (0,55 s power3.inOut cada), B14,4 recuo para x 0 y -40 escala 0,92 (0,75 s); a profundidade de campo acompanha (o que está em foco nítido, os outros com blur 9 / 45%, 0,5 s); a luz do trilho vai de scaleX 0 a 1 de B9 a B14 power1.inOut; varrido em cada estação na sua batida (B9, B11, B13); 18 pontos convergem de um anel com semente (r 220-380) em 0,9 s power2.in, atraso de 0,055; anel `stroke-dashoffset 490 para 0` 0,9 s; barras scaleY de 0 a 1 em 0,5 s expo.out, atraso de 0,09; legenda `words@B14.4` (58px, embaixo, últimas 2 palavras iluminadas) | o trilho | o rig desfoca e sai em 0,25 s em B15,7 |
| 8-12 prova (drop, assinatura) | três placas de vidro com números (540x420) em fila: os três números reais da marca, mono 132px, uma legenda de 34px sob cada um | placas `MD.fly` z -1200, 0,7 s, atraso de 0,07 no drop; foco rack em cada uma meia batida antes da sua contagem: em foco `z 80, blur 0, opacity 1`, as outras `z -260, blur 7, opacity .55`, rotationY [20, 0, -20] (um arco 3D), 0,45 s power3.out em B16,8 / B18,8 / B20,8; cada número conta por 0,5 s a partir de 0 (`count`, não mostra nada antes) e é carimbado (1,12 para 1, 0,35 s expo.out); em B22,3 todas vão a z -60 nítidas, a câmera suaviza até escala 0,94; um varrido sobre as três em B22,5 (1,0 s) | as legendas das placas | o rig desfoca e sai em 0,25 s em B23,7 |
| 12-16 fundadores | um rótulo de 30px com espaçamento largo no topo 150 ("pessoas para quem já construímos"); nove logos reais de clientes em ladrilhos de vidro de 440x190, numa parede 3x3 (passo 480 x 220), centrada em 960, 560 | cada ladrilho voa de z -1400 com x +-250, y +-150, rotationY +-25 com semente, blur 16, 0,7 s expo.out, a 0,13 s um do outro a partir de B24; a parede inteira gira `rotationY -16 para 12, rotationX 6 para -4` ao longo de 2 compassos sine.inOut; um varrido sobre todos os ladrilhos em B26,5; em B28-0,45 a parede sobe e sai (y -260, escala 0,8, blur 10, 0,45 s power3.in); depois o slogan da marca em 2 linhas, 124px, centralizado, `mask@B28` / `B28.5` | o rótulo | as linhas desfocam e saem em B31,7 |
| 16-20 dispositivo | o site real num notebook E num celular em 3D (predefinição `duo`), uma linha de 76px acima deles ("N pilares. Um sistema.", a segunda metade iluminada) | cena do dispositivo: o notebook sobe de y -3,2 inclinado (rx 0,45, ry -0,95 rad) até repousar em 0,88 s (bézier .16,1,.3,1), o celular sobe por baixo com uma volta de 1,3 rad 0,35 s depois; a câmera se aproxima até 2,48 s e depois deriva; as duas telas rolam o site capturado em paradas suavizadas (veja Mecânica) | a linha | o cartão final cobre |
| 20-24,8 cartão final | a marca da empresa num disco de vidro (340, topo 150), o nome da marca (190px de altura, invertido para branco) embaixo, uma pílula de chamada, o domínio num rótulo de 30px | o disco pousa em `logo`: escala 1,8 para 1, z 400 para 0, blur 16 para 0, 0,45 s expo.out, depois carimbo de 7%; varrido sobre o disco em logo+0,3; o nome da marca aparece por um clip-path da esquerda para a direita em 0,55 s power3.inOut em logo+0,5; botão `rise@B42`, domínio `words@B43`; varrido sobre a face do botão em B44 | tudo segura até o fim | nenhuma |

## Lista de planos, abertura de canal 9:16 (128 BPM, B1 = 0,469 s)

| tempo | na tela | o que se move e como | saída |
|---|---|---|---|
| 0-1,875 gancho | a frase do próprio canal em 3 linhas empilhadas, MAIÚSCULAS (116 / 116 / 176px, a última na segunda cor), topo 500/630/760; uma pílula de vidro "ÚLTIMO NO YOUTUBE" (842x120, topo 1120) com um triângulo de play | a linha 1 e a pílula são `present@0` (tinta no quadro 0); linha 2 `zoom@B1`, linha 3 `zoom@B2`; soco de 4% no rig em B1, de 6% em B2; a pílula assenta de 1,06 para 1 em 0,8 s; varridos sobre a pílula em B1 e B3 | a pílula sai chicoteada para a esquerda x -900 blur 24 em B3,75; as linhas fazem zoom de saída em B3,6-3,7 |
| 1,875-3,75 vídeo | a miniatura real do vídeo mais novo num player de vidro (842x520, topo 450) com um botão de play de vidro e uma barra de progresso; 2 linhas de 78px embaixo | player `MD.fly` z -1200, y 160, rx 28, ry -10, 0,75 s; progresso linear de B4,4 a B7,6; varrido em B5,5 | mergulho: rig escala 3,4, blur 18, 0,42 s, origem no player |
| 3,75-7,5 texto | um painel de documento de vidro (título do artigo real + 2 linhas esqueleto), depois quatro ladrilhos de parte de 410x240 numa grade 2x2 embaixo, um por par de batidas (B9, B11, B13, B14): prompts, código, ferramentas, downloads, cada um com uma mini visualização viva | o documento se abre saindo do mergulho (escala 0,55 para 1, 0,6 s); cada parte voa de cima, do centro (y -360/-600, x +-216, z -600, rx 30, escala 0,4) em 0,6 s expo.out, varrido 0,3 s depois; as linhas esqueleto se desenham (scaleX, 0,25 s, atraso de 0,18); o símbolo de chaves se estica (scaleX 1,8 para 1); 3 quadrados de ferramenta surgem (y 60, 0,45 s, atraso de 0,09); a barra de download se enche em 0,8 s; o rig deriva y -40; legenda `words@B14.5` | tudo se dobra: x/y para 0, escala 0,15, rx 60, blur 12, 0,32 s, atraso de 0,03, terminando no drop |
| 7,5-11,25 carta (drop, assinatura) | um painel de vidro de envelope (842x540) com um selo brilhante na cor do destaque e o nome da newsletter, depois três linhas reais (miniatura 244x137 + título real, painéis de 842x176 em topo 420/620/820), uma contagem de 150px do tamanho real do arquivo e um rótulo | o envelope bate no drop (escala 1,6, z 600, 0,45 s, carimbo de 6%), varrido; em B18,4 ele voa para cima e sai (y -560, escala 0,42); as linhas caem de cima, uma por batida (y -260, z -500, rx -35, 0,6 s), varrido em cada uma; as linhas deslizam y -80 em 1,4 s; contagem `count@B21.6` 0,8 s, rótulo `wipe@B22.6` | o rig desfoca e sai em B23,7 |
| 11,25-15 dispositivo | o site real num celular em 3D (predefinição `iphone`) | o celular sobe mostrando as COSTAS (a carcaça colorida se lê como objeto), gira até a tela (1,1 s, bézier .76,0,.18,1), a câmera fecha a 86% da altura do quadro; a tela rola o topo, o arquivo e a inscrição | corte para o cartão final |
| 15-19,55 cartão final | o avatar redondo do fundador num disco de vidro (320, topo 370), 3 linhas de 92px (a última na segunda cor), um botão de chamada, o domínio | o disco pousa em `logo` como a marca do 16:9; linhas `mask` em B32,5 / B33,3 / B34,1; botão `wipe@B35`; domínio `words@B36`; varrido sobre o botão em B35,6 | segura |

## Materiais e onde obtê-los para uma marca nova

Tudo o que aparece na tela é da própria marca ou é código. Nada de banco de imagens.

| material | fonte | ferramenta |
|---|---|---|
| cores, fontes, logo, marca | o site da marca | `node scripts/brand-intake.mjs <url> --project <dir>`, depois `pick --logo --mark --shots` |
| os três números | a seção de provas do próprio site (contagens, dinheiro captado, notas); nunca inventados | leia `brand.md` / a página capturada; um número que não está no site não vai para a tela |
| logos de clientes (6-9) | a faixa de logos do site, capturada pelo brand-intake como candidatas | corte cada uma com `node scripts/trim-alpha.mjs in.png out.png --pad 8` para que apareçam no mesmo tamanho óptico na caixa de 330x96 |
| capturas do site para os dispositivos | Chrome sem interface, página inteira, `--window-size=1440,5200` (notebook) e `390,7000` (celular), `--force-device-scale-factor=2`, salvas em `film/assets/devshots/site-laptop.png` e `site-phone.png` | depois escolha 3 paradas de rolagem (y da página) que caiam no título, nos números e na prova |
| notebook e celular em 3D | `node scripts/device-init.mjs --project <dir> --preset duo|iphone --start <spec> --duration <s> --rim <accent> --env <accent at ~20% on black>` | ele baixa os modelos GLB para `film/models/` e grava `compositions/dev.html` |
| miniaturas de vídeo, avatar (aberturas de canal) | o brand-intake grava `yt-<id>.jpg` para os vídeos que o site incorpora e `youtube-avatar` a partir do canal vinculado | use as miniaturas 16:9 como estão no player e nas linhas |
| as tarefas / fases / partes do produto | a seção de funções ou de método do próprio site, nas palavras dele | montadas como ladrilhos de vidro em código, nunca como capturas de tela |
| mini visualizações | código (pontos, anel, barras, onda, linhas esqueleto) | veja Mecânica |

Se faltar um material:
- sem números no site: troque o plano de prova pela parede de clientes em tamanho de destaque, ou por três capturas reais em placas (`.md-glass > img.md-fill`); nunca um número inventado.
- sem logos de clientes: use 3 depoimentos reais em painéis de citação, ou 3 miniaturas do YouTube como linhas (o plano da carta no 9:16).
- sem site responsivo: use só `--preset macbook`.
- sem marca separada: ponha o nome da marca numa pílula de vidro larga, no lugar do disco.
- sem segunda cor da marca: use `.md-lit` em todos os destaques.
- os modelos de dispositivo não baixam: renderize um dispositivo parado com `node scripts/find-assets.mjs --polyhaven model <id>` + `node scripts/prop-render.mjs <model.gltf> dev.png --screen site.png --ry 25 --rx -8` e então ponha a captura rolando POR CIMA do PNG, recortada no retângulo da tela (uma frente de vidro em PNG esconde tudo o que está atrás).

## Mecânica

O ambiente de execução (`md.js`, `md-world.css`, `md-silk.js`) fornece todos os movimentos. Um filme é um conjunto de seções na grade, cada uma com o seu próprio rig:

```html
<canvas id="silk"></canvas>
<section id="hook" class="clip md-scene" data-start="0" data-duration="2">
  <div class="md-world"><div data-layout-allow-overflow class="md-rig" id="hook-rig">
    <h1 id="h1" class="md-line big" style="left:130px;top:230px;font-size:280px"
        data-in="zoom@0" data-out="zoom@B3.7"><span class="md-lit">4</span> hours</h1>
    <div class="md-glass rec md-obj" id="rec"><span class="md-dot" id="rec-dot"></span>
      <span class="lab">REC</span>
      <span class="mono md-line" id="tc" data-in="count@0.1" data-count-dur="1.3"
            data-from="0" data-to="4" data-fmt="0{n}:00:00" data-out="blur@B3.7">04:00:00</span></div>
  </div></div>
</section>
<!-- ... sections ... then the device composition, then its copy section above it -->
<div id="dev" class="clip" data-composition-id="dev" data-composition-src="compositions/dev.html"
     data-start="16" data-duration="4" data-width="1920" data-height="1080" data-track-kind="graphics"></div>
<section id="device" class="clip md-scene" data-start="16" data-duration="4">...one line...</section>
<div class="md-vignette"></div><div class="md-grain"></div>
```

O mundo, a câmera, a luz:

```js
const tl = gsap.timeline({ paused: true });
// build repeated pieces BEFORE MD.lines (untimed DOM, deterministic)
MD.lines(tl);
const silk = MD.silk(tl, "#silk", { colors: [GROUND, ACCENT_DEEP, ACCENT_LIGHT], intensity: 0.32, speed: 0.55, from: 0, to: LENGTH });
MD.silkLevel(tl, silk, "B15", 0.62, 1.0);   // build
MD.silkLevel(tl, silk, "drop", 0.5, 0.8);
MD.silkLevel(tl, silk, "logo", 0.24, 1.0);

// a pane arriving: from depth, tilted, blurred, landing on a long tail, then light runs over it
MD.fly(tl, "#card", "B4", { z: -1100, ry: -24, dur: 0.75 });
MD.sweep(tl, "#card", "B4.6", 0.8);
// a beat punch on the camera (never on the title)
MD.punch(tl, "#hook-rig", "B3", 0.05);
// a whip out
tl.to("#rec", { x: -700, opacity: 0, filter: "blur(24px)", duration: 0.26, ease: "power3.in" }, MD.t("B3.74"));
// the dive into the next shot
tl.to("#rec-rig", { scale: 2.6, opacity: 0, filter: "blur(18px)", duration: 0.45, ease: "power3.in" }, MD.t("B8-0.45"));
```

A explosão (um objeto vira N ladrilhos num arco 3D):

```js
// SLOT: [left, top, z, rotationY] per tile; tiles all start at the source object's spot (SX, SY)
const SLOT = [[110,190,-160,14],[700,170,-40,4],[1290,190,-160,-14],[110,520,-60,12],[700,540,80,0],[1290,520,-60,-12]];
tl.to("#card", { scale: 0.6, opacity: 0, filter: "blur(16px)", duration: 0.3, ease: "power3.in" }, MD.t("B6-0.15"));
SLOT.forEach(([x, y, z, ry], i) => {
  tl.fromTo("#tile" + i, { x: 0, y: 0, z: -400, rotationY: 0, scale: 0.3, opacity: 0, filter: "blur(12px)" },
    { x: x - SX, y: y - SY, z, rotationY: ry, scale: 1, opacity: 1, filter: "blur(0px)", duration: 0.7, ease: "expo.out" }, MD.t("B6") + i * 0.06);
  tl.fromTo(`#tile${i} .bar b`, { scaleX: 0 }, { scaleX: 1, duration: 0.8, ease: "power2.inOut" }, MD.t("B6.6") + i * 0.09);
});
MD.drift(tl, "#tiles", { x: -60, y: -20 }, "B6", "B8");
```

Uma câmera acompanhada, com profundidade de campo:

```js
MD.camera(tl, "#pipe-rig", [            // the rig has transform-origin at the stations' centre
  { at: "B8",   x: 884,  y: 30,  scale: 1.55, dur: 0.01 },
  { at: "B11",  x: 0,    y: 30,  scale: 1.55, dur: 0.55, ease: "power3.inOut" },
  { at: "B13",  x: -884, y: 30,  scale: 1.55, dur: 0.55, ease: "power3.inOut" },
  { at: "B14.4", x: 0,   y: -40, scale: 0.92, dur: 0.75, ease: "power3.inOut" },
]);
const ST = ["#st1", "#st2", "#st3"];
const dof = (on, at) => ST.forEach((s, i) => tl.to(s, {
  filter: i === on || on < 0 ? "blur(0px)" : "blur(9px)", opacity: i === on || on < 0 ? 1 : 0.45,
  duration: 0.5, ease: "power2.inOut" }, MD.t(at)));
dof(0, "B8.8"); dof(1, "B11"); dof(2, "B13"); dof(-1, "B14.4");
```

Foco rack nas placas de números (o drop):

```js
MD.fly(tl, ["#pl1", "#pl2", "#pl3"], "drop", { z: -1200, y: 0, rx: 0, dur: 0.7, stagger: 0.07 });
const focus = (on, at) => ["#pl1", "#pl2", "#pl3"].forEach((p, i) => tl.to(p, {
  z: i === on ? 80 : -260, rotationY: [20, 0, -20][i], filter: i === on ? "blur(0px)" : "blur(7px)",
  opacity: i === on ? 1 : 0.55, duration: 0.45, ease: "power3.out" }, MD.t(at)));
focus(0, "B16.8"); focus(1, "B18.8"); focus(2, "B20.8");
// numbers: <div class="num md-line" id="n1" data-in="count@B17-0.5" data-count-dur="0.5"
//          data-from="0" data-to="300" data-fmt="{n}+" data-out="blur@B23.6">300+</div>
```

Mini visualizações vivas (todas com semente, todas na linha do tempo):

```js
// waveform: 44 bars re-scaled every half beat
MD.each(4, 8, (t, k) => tl.to(bars, { scaleY: (i) => 0.12 + 0.88 * Math.abs(Math.sin(i * 0.55 + k * 1.7)) * (0.4 + 0.6 * MD.rand(i * 31 + k)()),
  duration: 0.22, ease: "power2.out" }, t), 0.5);
// a dot blinking on every beat
MD.each(0, 4, (t) => tl.fromTo("#rec-dot", { scale: 1.35, opacity: 1 }, { scale: 1, opacity: 0.55, duration: 0.42, ease: "power2.out", immediateRender: false }, t));
// dots converging to one point from a seeded ring
for (let i = 0; i < 18; i++) { const r = MD.rand(i * 13 + 5); const a = r() * Math.PI * 2, d = 220 + r() * 160;
  tl.fromTo("#by" + i, { x: CX + Math.cos(a) * d, y: CY + Math.sin(a) * d * 0.6, opacity: 0, scale: 0.6 },
    { x: CX, y: CY, opacity: 1, scale: 1, duration: 0.9, ease: "power2.in" }, MD.t("B9") + i * 0.055);
  tl.to("#by" + i, { opacity: 0, scale: 0.2, duration: 0.15 }, MD.t("B9") + i * 0.055 + 0.9); }
// a ring filling (SVG circle r 78, dasharray 490)
tl.fromTo("#ring2", { attr: { "stroke-dashoffset": 490 } }, { attr: { "stroke-dashoffset": 0 }, duration: 0.9, ease: "power2.inOut" }, MD.t("B11"));
```

A parede de clientes:

```js
// 9 tiles, 3x3, pitch 480 x 220, centred in a 0x0 .ring (preserve-3d) at 960,560
for (let i = 0; i < 9; i++) { const r = MD.rand(i * 17 + 3);
  tl.fromTo("#mk" + i, { z: -1400, x: (r() - 0.5) * 500, y: (r() - 0.5) * 300, rotationY: (r() - 0.5) * 50, opacity: 0, filter: "blur(16px)" },
    { z: 0, x: 0, y: 0, rotationY: 0, opacity: 1, filter: "blur(0px)", duration: 0.7, ease: "expo.out" }, MD.t("B24") + i * 0.13); }
tl.fromTo("#ring", { rotationY: -16, rotationX: 6 }, { rotationY: 12, rotationX: -4, duration: MD.t("B28") - MD.t("B24"), ease: "sine.inOut" }, MD.t("B24"));
MD.sweep(tl, "#ring .mark", "B26.5", 1.0);
```

O cartão final:

```js
tl.fromTo("#disc", { scale: 1.8, z: 400, opacity: 0, filter: "blur(16px)" }, { scale: 1, z: 0, opacity: 1, filter: "blur(0px)", duration: 0.45, ease: "expo.out" }, MD.t("logo"));
MD.stamp(tl, "#disc", MD.t("logo") + 0.45, 0.07);
MD.sweep(tl, "#disc", "logo+0.3", 0.8);
tl.fromTo("#word", { clipPath: "inset(-20% 100% -20% -5%)" }, { clipPath: "inset(-20% -5% -20% -5%)", duration: 0.55, ease: "power3.inOut" }, MD.t("logo+0.5"));
MD.finish(tl);
window.__timelines = window.__timelines || {};
window.__timelines["main"] = tl;
```

```css
.cta .face { display:inline-block; padding:26px 64px; border-radius:999px; font:600 46px var(--font-body); color:#fff;
  background: linear-gradient(180deg, color-mix(in srgb, var(--accent) 85%, #fff), var(--accent));
  box-shadow: inset 0 1px 0 rgba(255,255,255,.5), 0 20px 60px -10px color-mix(in srgb, var(--accent) 70%, transparent); }
.word img { height: 190px; filter: invert(1) brightness(1.1); }   /* a dark wordmark on the dark world */
```

As telas da cena do dispositivo (`device/screen.js`): a página capturada rola em paradas suavizadas, `p` de 0 a 1 ao longo do trecho ativo da tela.

```js
var LAP = [[0, 0], [0.18, 0], [0.42, Y_NUMBERS], [0.62, Y_NUMBERS], [0.9, Y_PROOF], [1, Y_PROOF]];
var PH  = [[0, 0], [0.12, 0], [0.4, Y2], [0.58, Y2], [0.92, Y3], [1, Y3]];
function scrollAt(K, p) {
  for (var i = 1; i < K.length; i++) if (p <= K[i][0]) {
    var a = K[i - 1], b = K[i], u = (p - a[0]) / (b[0] - a[0] || 1);
    u = u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2;   // easeInOutCubic
    return a[1] + (b[1] - a[1]) * u;
  }
  return K[K.length - 1][1];
}
window.MD_SCREEN_dev = function (p) {
  document.getElementById("lap-page").style.transform = "translateY(" + (-Math.round(scrollAt(LAP, p))) + "px)";
  document.getElementById("phone-page").style.transform = "translateY(" + (-Math.round(scrollAt(PH, p))) + "px)";
};
```

`laptop.html` / `phone.html` são uma única `<img id="lap-page" src="assets/devshots/site-laptop.png">` (largura 1440 / 390, altura automática, absoluta em 0,0) sobre a cor de fundo da própria página. Configuração de dispositivo usada: `rim` = destaque, `env` = destaque a ~20% sobre preto (`#2a1614`, `#2a1010`), `fill #ffd9c2`, sombra 0,4. O movimento da cena está em `templates/hyperframes/md-device.html` (predefinições `macbook`, `duo`, `iphone`): chegada em `min(1, 0.22 x D)`, a aproximação termina em `0.62 x D`, depois uma deriva lenta; as telas começam 0,2 s depois da chegada.

## Adaptação a uma marca

Do que vem da marca: as cores da seda (a partir do destaque), `--ink`, o tom de `.md-lit`, as fontes de títulos e de texto, a marca e o nome, os logos de clientes, os números, o site nos dispositivos, as miniaturas e o avatar, os substantivos do próprio produto nos ladrilhos e nas estações, a segunda cor se houver. O 9:16 só usa MAIÚSCULAS largas se a fonte da marca tiver eixo de largura ou já for larga; caso contrário, use as regras do 16:9 (maiúscula só no início da frase) nos tamanhos do 9:16.

O que fica fixo: o mundo escuro de seda, a receita do vidro, a profundidade de campo, varridos de luz em cada pouso, a grade (planos de compassos inteiros, os números no drop, a marca em `logo`), uma câmera por plano (o rig, nunca a seção temporizada), o gancho com tinta no quadro 0, o plano do dispositivo como último plano antes do cartão final, a ordem do cartão final (marca, nome, chamada, domínio).

## Armadilhas encontradas durante a construção

- O quadro 0 já precisa mostrar tinta: a pílula REC e as linhas do gancho 16:9 começam em 0; o gancho 9:16 usa `present@0` na primeira linha e na pílula. Um primeiro quadro vazio reprova na crítica.
- `count` não mostra nada até começar a contar; nunca deixe um "0" pré-impresso (um "R$ 0" na tela parece um número real). Use um `data-count-dur` curto (0,5 s) no drop para que o carimbo pouse na batida.
- Anime o rig, nunca a `<section>` temporizada: o HyperFrames é dono da visibilidade da seção. Todo rig precisa de `data-layout-allow-overflow`, senão a checagem de layout acusa o transbordo 3D.
- Peças repetidas (ladrilhos, barras, pontos, ladrilhos de cliente) são criadas no script ANTES de `MD.lines(tl)`; tudo o que uma linha contém precisa existir quando ela for dividida.
- Saídas que rodam antes de a entrada pousar geram aviso; deixe cada linha cumprir a entrada inteira (zoom de 0,45 s + atraso) antes de a cena sair.
- Predefinição duo: um celular mais perto da câmera que o notebook cresce rápido na perspectiva e sai do quadro; o modelo enquadra o par em x -3,35..2,95. Não mova o celular para a frente.
- O texto do dispositivo fica ACIMA do dispositivo (topo 52px, fonte de 76px), nunca sobre o teclado; monte o `<div>` do dispositivo antes da seção do seu texto, para que o texto fique por cima.
- Nomes de marca escuros sobre o mundo escuro: `filter: invert(1) brightness(1.1)` no SVG/PNG, ou use a variante clara do site.
- Caixa segura do 9:16: texto entre y 168 e 1330, `left:76px; right:162px` (o trilho da direita da plataforma). Linhas grandes de 116 a 176px precisam ser medidas para caber em 842px.
- O texto precisa ficar dentro do painel: rode `node scripts/frame-audit.mjs film` (o render.mjs já roda). Os títulos de ladrilho (56px) e de parte (38px) são os primeiros a transbordar com substantivos longos da marca: encurte o substantivo ou reduza o tamanho, nunca deixe quebrar.
- `stroke-dashoffset` em SVG precisa ser animado como `attr`, e todo `fromTo` que se repete no mesmo alvo precisa de `immediateRender: false` (o piscar da batida); senão, ao buscar um quadro inicial, aparece o último estado.
- Nada de `Math.random` nem de relógios: use `MD.rand(seed)` com semente em todo espalhamento.

## Som

Pulsante, 120 a 128 BPM, tom menor (lá menor no lançamento). Kit completo desde o compasso 0, uma subida para o drop, um impacto no drop, um trecho final com metade da energia. Sons de interface, cada pico no seu quadro (o synth.mjs posiciona):
- tick: o código de tempo / a contagem pousando
- whoosh: toda entrada voando do fundo e todo mergulho ou chicotada de câmera (o cartão, o trilho, a parede de clientes, o dispositivo subindo)
- pop: a explosão em ladrilhos, cada estação acendendo, cada número carimbado, cada linha ou parte pousando, o celular assentando
- hit: a marca pousando em `logo` (um golpe por filme, mixado cerca de -9 dB abaixo do pico da base)
- shimmer: o nome da marca aparecendo, ou o varrido sobre o botão de chamada
