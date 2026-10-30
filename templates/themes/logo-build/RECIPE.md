# Construção de logo: a marca é feita, o produto é usado, a marca é feita de novo

Um filme 9:16 de 12 segundos num único movimento, sem cortes secos. Cinco pontos pretos aparecem um a um, deslizam numa fileira, se curvam num arco e são chicoteados até a logo real da marca. A logo colapsa numa esfera brilhante na cor de destaque e as páginas reais da marca voam da profundidade passando pela câmera. Uma barra de pergunta branca cresce do nada, uma pergunta real é digitada e o botão de enviar é apertado. A resposta chega como um carrossel 3D de páginas reais que gira duas vezes na batida; a câmera recorta numa delas. Quatro traços grossos na cor de destaque varrem o quadro e se afastam, e a logo pousa de novo. A ideia que faz funcionar: **a logo é construída com as próprias peças e o produto é mostrado sendo usado**, então a marca é a animação, não um rótulo colado nela. Todo objeto tem mola ou arco; nada é linear, exceto a barra de progresso.

## Formato, duração, ritmo

- 1080x1920, 30 fps, composição de 12 s, entregue com 11,73 s (a pausa final aparada).
- Trilha a 112 BPM, um compasso = 2,14 s; queda em 4,29 (as páginas terminam de voar, a barra de pergunta cresce), sinal da logo em 8,57.
- Batidas (s): pontos 0,15-0,63, fileira para arco 0,95, chicotada 1,35-2,0, a logo salta 1,98, respiro 2,6, colapso 2,95, passagem voando 3,25-5,5, barra de pergunta 5,0, digitação 5,6-6,5, toque 7,38, carrossel 7,65, giros 8,35 e 8,75, recorte para dentro 9,25, traços 9,95, logo 10,8, parado até o fim.
- Um plano contínuo: cada passagem de bastão se sobrepõe à seguinte em 0,1 a 0,5 s (a barra cresce enquanto as últimas páginas ainda passam; o carrossel sobe enquanto a barra sai).

## O visual em números

**Fundo**
- Papel quente `#F4F3EF` com três manchas suaves de luz, derivando x -50, y +30 ao longo do filme todo (`sine.inOut`), num elemento de 120% do quadro (`inset: -10%`) para a deriva nunca mostrar uma borda:
  - `radial-gradient(42% 32% at 82% 12%, <accent> at 30% alpha, transparent 70%)`
  - `radial-gradient(48% 36% at 12% 92%, <accent> at 22% alpha, transparent 72%)`
  - `radial-gradient(60% 40% at 30% 20%, rgba(255,214,140,.30), transparent 70%)` (uma luz quente fixa)
- Granulação: SVG `feTurbulence fractalNoise baseFrequency 1.1, numOctaves 1, seed 8`, alfa 0.18, opacidade .35, `multiply`, z-index 90.

**Paleta (funções)**
- Tinta `#111` (pontos, a marca, o bloco atrás de um cartão de marca).
- Destaque = cor de destaque da marca: esfera, cursor de texto, botão de enviar, os 4 traços, a barra de progresso, as manchas de luz.
- Esfera: `radial-gradient(circle at 40% 35%, <accent 45% to white>, <accent> 55%, transparent 72%)`, `blur(2px)`.
- Cartões e barra: `#fff`, filete `0 0 0 1.5px rgba(0,0,0,.06-.07)`.
- Texto dos cartões: título `#111`, metadados `#8a8782`, trilho de progresso `#eceae6`.

**Tipografia** (a fonte de interface da marca; o filme quase não tem texto)
| função | peso | px | espaçamento | caixa |
|---|---|---|---|---|
| pergunta digitada na barra | 500 | 50 | -0.01em | frase |
| título do cartão | 700 | 34 | -0.01em | título |
| metadados do cartão | 400 | 24 | 0 | frase, `#8a8782` |
- Sem manchete, sem slogan. As únicas palavras são as que um usuário digitaria ou veria no produto.

**Sombras e formas**
- Marca: 400x400 em (340,760), `drop-shadow(0 30px 40px rgba(0,0,0,.18))`; se a marca for um contorno sobre branco (logo de ícone de app), um bloco branco arredondado atrás dela: 376 px, raio de 70 px, `drop-shadow(0 30px 50px rgba(0,0,0,.14))`.
- Cartões voando: raio de 26 px, `box-shadow: 0 40px 70px -24px rgba(0,0,0,.35)`; contêiner com `perspective: 1400px`.
- Barra de pergunta: 860x136 em (110,870), raio de 30 px, `box-shadow: 0 30px 70px -26px rgba(0,0,0,.3)`; botão de enviar círculo de 84 px na cor de destaque com uma seta branca (traço 3, pontas redondas); cursor de texto 4x52 px na cor de destaque.
- Anel do clique: círculo de 150 px, `border: 9px solid #fff`, `box-shadow: 0 0 0 2px rgba(0,0,0,.08), 0 10px 30px rgba(0,0,0,.2)`.
- Cartões do carrossel: 500x640 em (290,640), raio de 30 px, imagem com 72% da altura (`object-fit: cover; object-position: top left`), bloco de legenda embaixo; contêiner com `perspective: 1600px`; `box-shadow: 0 40px 80px -26px rgba(0,0,0,.4)`.
- Traços: 30 px, pontas redondas, cor de destaque, `drop-shadow(0 10px 18px <accent at 35%>)`.
- Pontos: círculos de 22 px na cor da tinta.

## Lista de planos

| # | tempo (s) | na tela | o que se move e como | estático | saída |
|---|---|---|---|---|---|
| 1 pontos | 0,15 a 0,95 | 5 pontos no centro (540,960) | cada um salta scale 0 a 1, 0,18 s `back.out(3)` e desliza até x 440 + i*50 em 0,35 s `power3.out`, defasados em 0,12 s, então se alinham conforme aparecem | fundo | eles se curvam |
| 2 arco e chicotada | 0,95 a 1,98 | os pontos num arco de raio 150 em torno do centro | `arc.r` 0 a 1 em 0,5 s `power2.inOut` (a fileira se dobra num arco de 0,9 PI), depois `arc.a` 0 a 3 PI em 0,65 s `power3.in`; cada ponto se estica scaleX = 1 + a*0.25, um rastro de movimento | fundo | os pontos somem em 0,12 s em 1,98 |
| 3 a marca | 1,98 a 3,37 | a logo real (e o seu bloco branco) | scale 0 a 1, rotação -40 a 0, 0,55 s `back.out(2.2)`; respira até 1,06 em 0,25 s `power2.out` em 2,6; colapsa scale 0, y +40, 0,42 s `back.in(2)` em 2,95 | fundo | vira a esfera |
| 4 passagem voando | 3,25 a 5,5 | a esfera de destaque no centro; 5 páginas reais (4 capturas, 1 bloco escuro com a marca) vindas da profundidade | a esfera salta 0,3 s `back.out(2)`, depois incha a 2,4x e some em 1,2 s `power2.in`; cada cartão `z` de (z0 - 300) a (z0 + 1000) com rotationX/Y/Z em queda para o sinal oposto em 1,55 s `power1.in`, defasados em 0,12 s; surge em 0,25 s, some em 0,2 s em 4,7 + i*0,12 | centro da esfera | os cartões passam pela câmera; camada escondida em 5,5 |
| 5 pergunta | 5,0 a 7,97 | a barra de pergunta | cresce de uma cápsula: scaleX 0,08, scaleY 0,5 a 1, 0,55 s `back.out(1.6)`; a pergunta é digitada um caractere a cada 0,045 s a partir de 5,6; o cursor de texto pisca apagado/aceso em 6,6 e 7,0 (0,2 s apagado); o anel aparece no botão de enviar (scale 1,4 a 1, 0,2 s em 7,15), aperta (0,85, 0,1 s em 7,38), sai (opacity 0, scale 1,2, 0,25 s) | a barra durante a digitação | a barra voa para cima: y -760, scale .86, some, 0,42 s `back.in(1.4)` em 7,55 |
| 6 carrossel | 7,65 a 10,25 | 5 cartões de páginas reais abertos em leque em 3D, o cartão do centro com legenda | cada um sobe de y 500 até a sua pose, 0,5 s `back.out(1.4)`, defasados em 0,05 s; o anel gira um passo em 8,35 e de novo em 8,75 (0,38 s `power3.inOut`); só o cartão do centro mostra a legenda; a sua barra de progresso corre scaleX .12 a .7 em 2,6 s `none` a partir de 8,8; a câmera recorta para dentro: scale do contêiner 1,65, y -230, 0,6 s `power3.inOut` em 9,25 enquanto os cartões laterais somem em 0,25 s | a página do cartão do centro | o contêiner some em 0,2 s em 10,05 |
| 7 traços até a marca | 9,95 a 11,73 | 4 traços grossos na cor de destaque cruzando o quadro (dois quase horizontais, um diagonal, um baixo) | cada um se desenha (dashoffset L a 0, 0,42 s `power2.out`, defasados em 0,07 s), depois se apaga pela ponta de lá (0 a -L, 0,4 s `power2.in` em 10,5 + i*0,05); a marca pousa scale 0 a 1, rotação 30 a 0, 0,6 s `back.out(2)` em 10,8 | fundo | parado na marca |

## Materiais, e onde obtê-los para uma marca nova

| material | fonte |
|---|---|
| a logo como UM caminho SVG | o `brand-intake.mjs` registra uma marca vetorial (Simple Icons quando existe, ou o SVG embutido do site). Mantenha-a como um `<path>` com um `id`, reutilizado com `<use href="#id">` no cartão da marca. Logo só em raster: vetorize (potrace) ou use o PNG com `trim-alpha.mjs`; a chicotada ainda funciona, o final do traço não precisa do caminho. |
| 4-5 páginas reais do produto | as capturas do produto da própria marca escolhidas em `brand-intake.mjs pick --shots` (recortes quadrados ou 4:3 funcionam melhor nos cartões de 500x640 e 520-640 px). Só interface real; sem banners de marketing. |
| quadros do vídeo do produto | quadros do vídeo do produto do próprio site que o brand-intake salva (aqui três imagens de 1152x720); uma delas é um cartão voando e um cartão do carrossel. |
| a pergunta | algo real que um usuário digita neste produto (dos exemplos do próprio site ou do briefing), 18 a 24 caracteres para caber em 860 px a 50 px. |
| legendas dos cartões | os nomes reais das páginas e uma linha de estado real (“Trabalhando em <ticket>”) das próprias capturas. |
| um produto sem barra de pergunta | use a sua entrada principal (campo de busca, barra de comandos, campo de endereço, caixa de prompt) estilizada conforme a interface real; se não tem entrada nenhuma, troque o plano 5 pelo cursor apertando o botão principal. |

Não precisa de material gratuito: este tema funciona com a logo e as telas da própria marca. Se existem menos de 4 telas reais, peça-as à pessoa antes de construir; não preencha os cartões com interface desenhada.

## Mecânica

Pontos para fileira, arco e chicotada (5 pontos; o arco abrange 0,9 PI, centralizado no alto):

```js
const tl = gsap.timeline({ paused: true });
const N = 5, CX = 540, CY = 960, R = 150, ROW0 = CX - 100, GAP = 50, pts = [];
for (let i = 0; i < N; i++) { const d = document.createElement("div"); d.className = "dot"; dots.appendChild(d); pts.push(d); }
pts.forEach((d, i) => {
  gsap.set(d, { left: CX, top: CY, scale: 0, opacity: 1 });
  tl.to(d, { scale: 1, duration: 0.18, ease: "back.out(3)" }, 0.15 + i * 0.12);
  tl.to(d, { left: ROW0 + i * GAP, duration: 0.35, ease: "power3.out" }, 0.15 + i * 0.12);
});
const arc = { a: 0, r: 0 };
function placeArc() { pts.forEach((d, i) => {
  const row = ROW0 + i * GAP, ang = arc.a + (i / (N - 1)) * Math.PI * 0.9 - Math.PI * 0.45 - Math.PI / 2;
  const ax = CX + Math.cos(ang) * R, ay = CY + Math.sin(ang) * R;
  gsap.set(d, { left: row + (ax - row) * arc.r, top: CY + (ay - CY) * arc.r, scaleX: 1 + arc.a * 0.25, scaleY: 1 });
}); }
tl.to(arc, { r: 1, duration: 0.5, ease: "power2.inOut", onUpdate: placeArc }, 0.95);          // the row bends
tl.to(arc, { a: Math.PI * 3, duration: 0.65, ease: "power3.in", onUpdate: placeArc }, 1.35);   // the whip
tl.to(pts, { scale: 0, opacity: 0, duration: 0.12 }, 1.98);
tl.fromTo(["#mark", "#markbg"], { scale: 0, rotation: -40 }, { scale: 1, rotation: 0, duration: 0.55, ease: "back.out(2.2)" }, 1.98);
```

```css
.dot { position: absolute; width: 22px; height: 22px; margin: -11px; border-radius: 50%; background: var(--ink, #111); }
```

O `onUpdate` escreve com `gsap.set` apenas a partir do objeto interpolado, de modo que é determinístico ao buscar quadros. Se a marca da empresa for redonda, termine o arco como um círculo completo (abrangência de 2 PI) para os pontos virarem o seu contorno.

Passagem 3D das páginas reais:

```js
// #fly { position:absolute; inset:0; perspective:1400px }  .fc { position:absolute; border-radius:26px; overflow:hidden }
// [selector, z0, rotationX, rotationY]; place cards round the centre, alternating corners, sizes 330-640px
const F = [["#f1", -700, 30, -20], ["#f2", -900, -25, 28], ["#f3", -1100, 40, -30], ["#f4", -800, -30, 22], ["#f5", -600, 20, -16]];
gsap.set("#fly", { opacity: 0 }); tl.set("#fly", { opacity: 1 }, T);
F.forEach(([s, z, rx, ry], i) => {
  const t = T + 0.05 + i * 0.12;
  tl.fromTo(s, { z: z - 300, rotationX: rx, rotationY: ry, rotationZ: ry / 2, opacity: 0 },
               { z: z + 1000, rotationX: -rx * 0.5, rotationY: -ry * 0.6, rotationZ: 0, opacity: 1, duration: 1.55, ease: "power1.in" }, t);
  tl.fromTo(s, { opacity: 0 }, { opacity: 1, duration: 0.25, immediateRender: false }, t);
  tl.to(s, { opacity: 0, duration: 0.2 }, t + 1.4);
});
tl.set("#fly", { opacity: 0 }, T + 2.25);
```

Barra de pergunta crescendo, digitação com cursor de texto, anel do clique:

```js
gsap.set("#ask", { scaleX: 0.08, scaleY: 0.5, opacity: 0 });
tl.to("#ask", { opacity: 1, duration: 0.1 }, T);
tl.to("#ask", { scaleX: 1, scaleY: 1, duration: 0.55, ease: "back.out(1.6)" }, T);
const Q = "<a real query, 18-24 chars>", typed = document.getElementById("typed");
for (let i = 1; i <= Q.length; i++) tl.set(typed, { textContent: Q.slice(0, i) }, T + 0.55 + i * 0.045);
const done = T + 0.55 + Q.length * 0.045;
[done + 0.1, done + 0.5].forEach((t) => { tl.set("#caret", { opacity: 0 }, t); tl.set("#caret", { opacity: 1 }, t + 0.2); });
// the ring sits on the send button's centre (measured from the bar's layout, here 888,938)
tl.fromTo("#ring", { left: BX, top: BY, scale: 1.4, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.2, ease: "power2.out", immediateRender: false }, P - 0.23);
tl.to("#ring", { scale: 0.85, duration: 0.1 }, P);                         // the press
tl.to("#ring", { opacity: 0, scale: 1.2, duration: 0.25 }, P + 0.12);
tl.to("#ask", { y: -760, scale: 0.86, opacity: 0, duration: 0.42, ease: "back.in(1.4)" }, P + 0.17);
```

```html
<div id="ask"><div class="q"><span id="typed"></span><i class="caret" id="caret"></i></div>
  <div class="go"><svg width="40" height="40" viewBox="0 0 24 24"><path d="M12 19V5M5 12l7-7 7 7" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg></div></div>
```

Função de pose do carrossel (k = posição relativa ao cartão do centro):

```js
const C = ["#c0", "#c1", "#c2", "#c3", "#c4"];
const pose = (k) => ({ x: k * 360, z: -Math.abs(k) * 320, rotationY: -k * 30, opacity: Math.abs(k) > 1.5 ? 0 : 1 });
C.forEach((c, i) => { gsap.set(c, { ...pose(i), opacity: 0 });
  tl.fromTo(c, { ...pose(i), y: 500, opacity: 0 }, { ...pose(i), y: 0, duration: 0.5, ease: "back.out(1.4)" }, T + i * 0.05); });
const cap = (c, on, t) => tl.to(c + " .meta", { opacity: on ? 1 : 0, duration: 0.12 }, t);
C.forEach((c, i) => gsap.set(c + " .meta", { opacity: i === 0 ? 1 : 0 }));       // only the centre card is captioned
[[1, T1], [2, T2]].forEach(([to, t]) => C.forEach((c, i) => {
  tl.to(c, { ...pose(i - to), duration: 0.38, ease: "power3.inOut" }, t);
  cap(c, i === to, i === to ? t + 0.26 : t);                                    // new caption shows after the turn lands
}));
tl.to("#car", { scale: 1.65, y: -230, duration: 0.6, ease: "power3.inOut" }, T3);  // crop into the centre card
tl.to(C.filter((_, i) => i !== 2), { opacity: 0, duration: 0.25 }, T3);
```

Traços que se desenham, se apagam e passam a vez à marca:

```js
// <svg id="strokes" viewBox="0 0 1080 1920"> 4 cubic paths crossing the frame edge to edge:
//  M -100 760 C 300 700, 640 860, 1180 720     M -100 980 C 260 1100, 700 880, 1180 1060
//  M 200 1500 C 420 1200, 560 1000, 900 420     M 1180 1300 C 760 1260, 380 1460, -100 1380
["#k1", "#k2", "#k3", "#k4"].map((s) => document.querySelector(s)).forEach((p, i) => {
  const L = p.getTotalLength(); p.style.strokeDasharray = `${L} ${L}`;
  gsap.set(p, { strokeDashoffset: L, opacity: 0 });                              // hidden: a round cap shows even at offset L
  tl.set(p, { opacity: 1 }, T + i * 0.07); tl.set(p, { opacity: 0 }, T + 0.97 + i * 0.05);
  tl.to(p, { strokeDashoffset: 0, duration: 0.42, ease: "power2.out" }, T + i * 0.07);
  tl.to(p, { strokeDashoffset: -L, duration: 0.4, ease: "power2.in" }, T + 0.55 + i * 0.05);
});
tl.fromTo(["#mark", "#markbg"], { scale: 0, rotation: 30, y: 0 }, { scale: 1, rotation: 0, y: 0, duration: 0.6, ease: "back.out(2)", immediateRender: false }, T + 0.85);
```

```css
#strokes path { fill: none; stroke: var(--accent); stroke-width: 30; stroke-linecap: round;
  filter: drop-shadow(0 10px 18px color-mix(in srgb, var(--accent) 35%, transparent)); }
```

## Adaptar a uma marca

- Vem da marca: o caminho da logo (os dois momentos da marca e o cartão da marca), a cor de destaque (esfera, cursor de texto, botão, traços, progresso, manchas de luz), a fonte de interface, as páginas reais, a pergunta real, os nomes reais das páginas.
- Fica fixo: o fundo de papel quente e a sua mancha quente, os pontos de tinta, os cartões e a barra brancos, todos os tempos e curvas acima, o arco de 0,9 PI e a chicotada de 3 PI, a função de pose de 5 cartões, um plano contínuo sem corte seco.
- Uma marca escura: mantenha o fundo de papel (o tema é claro); ponha a cor escura no bloco da marca e deixe as manchas de destaque carregarem o tom. Uma cor de destaque muito clara (amarelo, menta): escureça 25% para o cursor de texto, os traços e o botão para se sustentarem no papel.
- Uma logo que é só um nome escrito: os pontos são chicoteados até a caixa da primeira letra, e então o nome escrito é revelado ao lado dela (clip-path da esquerda para a direita, 0,4 s `power2.out`).
- 16:9: as mesmas batidas; pontos e marca no centro, cartões voando mais largos (capturas 16:10), espaçamento do carrossel x = k * 520.

## Armadilhas encontradas durante a construção

- Pontas de traço perdidas: um caminho com pontas redondas pinta um ponto no seu início mesmo com `strokeDashoffset = L`. Mantenha cada traço com `opacity: 0` até o quadro em que ele começa a se desenhar e volte a 0 no quadro em que ele se apagou por completo.
- As legendas dos cartões laterais sobrepõem o cartão do centro: em perspectiva, os blocos de legenda dos cartões laterais deslizam sob a borda do cartão do centro. Só o cartão do centro mostra a legenda; troque as legendas 0,26 s depois do início de cada giro, quando o novo cartão está quase no centro.
- O anel do clique visível no quadro 0: todo `fromTo` que começa depois precisa levar `immediateRender: false`, e o anel precisa de `opacity: 0` definido antes de a linha do tempo começar.
- As interpolações de opacidade dos cartões voando se sobrepõem à interpolação de transformação; o segundo `fromTo` na opacidade também precisa de `immediateRender: false`, ou o cartão aparece com opacidade total antes do seu início.
- A barra de pergunta cresce enquanto as últimas páginas ainda passam (5,0 a 5,5): a sobreposição é proposital, mas mantenha a barra acima da camada de voo (depois no DOM), ou um cartão passa na frente da barra vazia.
- O bloco branco da marca é 24 px menor que a marca e deslocado 12 px; no respiro (scale 1,06) o seu canto aparece para fora. Escale bloco e marca juntos, a partir da mesma origem de transformação.
- Tempo de digitação = caracteres * 0,045 s: uma pergunta com mais de 24 caracteres passa da batida do toque e transborda a barra de 860 px a 50 px. Confira com `scripts/frame-audit.mjs` (texto fora da caixa).
- A fonte foi carregada só pelo nome (`font-family: "Inter"`), então a renderização dependia do que a máquina tinha instalado. Carregue sempre a fonte da marca com `@font-face` a partir de `assets/brand.css`.

## Som

- 112 BPM, clima `minimal`, lá menor; subida de tensão ao longo do segundo compasso até a queda em 4,29.
- Sons de interface nos eventos: cinco ticks quando os pontos aparecem (0,15, 0,27, 0,39, 0,51, 0,63, um por ponto na defasagem de 0,12 s), whoosh na chicotada (1,35), pop quando a marca pousa (1,98), whooshes quando as páginas voam (3,3, 3,9), pop quando a barra cresce (5,0), uma base de digitação a partir de 5,6 pela duração da pergunta, clique no toque (7,38), whoosh quando a barra sai (7,65), um tick em cada giro do carrossel (8,35, 8,75), whoosh quando os traços varrem (9,95), um golpe quando a marca pousa (10,8).
