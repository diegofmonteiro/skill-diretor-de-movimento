# Padrões de cena

Receitas de trabalho de filmes de teste reais (um lançamento de serviço em 16:9, uma abertura de canal em 9:16, um lançamento de recurso de SaaS em 1:1). Cada uma passou na crítica com 8 ou mais em todos os eixos; cada "porque" é um defeito que um render realmente mostrou.

## O quadro 0 é a página real, com a própria manchete

A captura do herói do site num `.md-shot.md-window`, na tela no quadro 0, assentando de `scale 1.05` (sem esmaecer a opacidade: um esmaecimento a partir de 0 é uma miniatura vazia). Se a captura já traz a manchete na tipografia da marca, não a redigite por cima; mova a câmera: leia a manchete (empurrão do `MD.camera` até ela na B2), depois empurre para a coisa que a página está vendendo na B6.

## Recorte no corte: `object-view-box`

```html
<img class="md-crop" src="assets/shots/shot-3.png"
     style="left:76px;top:420px;width:842px;height:454px;object-view-box:inset(395px 570px 100px 264px)">
```

`inset(topo direita base esquerda)` nos pixels da própria imagem; largura e altura na proporção da região recortada. Porque: uma `<img>` filha que ultrapassa uma `div` de recorte é apontada pela verificação de layout como mídia vazando do quadro, e um `scale` na captura inteira ("zoom") corta justamente o texto para o qual a cena existe. Recorte de modo que toda linha de texto da cena fique INTEIRA: um título fatiado na borda do recorte parece um erro.

O `object-view-box` NÃO funciona em `<video>` (o renderizador compõe os quadros do vídeo por conta própria). Para vídeo, amplie com um invólucro escalado dentro da janela:

```html
<div class="md-shot md-window" style="...;overflow:hidden">
  <div id="zoom" style="width:100%;height:100%;transform-origin:64% 60%">
    <video class="clip" data-start="0" data-duration="5" src="..." muted playsinline></video>
  </div>
</div>
<script> tl.set("#zoom", { scale: 1.9 }, 0); </script>
```

O próprio `<video>` leva `data-start` e `data-duration`; os invólucros dele não têm tempo (um vídeo dentro de uma cena temporizada, ou um invólucro temporizado em volta de um vídeo sem tempo, ambos reprovam no contrato).

## A própria interação do produto como movimento

Ache algo na tela real que já se comporta e anime ISSO: as três abas do gráfico de método acendendo uma por par de batidas (uma sobreposição com o preenchimento rosa e a linha vermelha do topo do próprio site, dimensionada pelas abas medidas na captura), uma linha vermelha percorrendo o eixo do gráfico enquanto acendem, a pílula de palavra rolando pelas opções, a página real rolando dentro do cartão. Lê-se como o produto, não como decoração.

## Contadores sobre os números reais

Cada número que o site imprime (digamos `300+`, `R$ 100 mi+`, `9,2/10`) como uma linha `count`, enorme, carimbando na sua batida; o texto de rótulo do próprio site posto abaixo, num tamanho legível (as legendas de 14 px da captura são ilegíveis na largura do celular). A faixa real de logos do site sobe em chicotada de totalmente abaixo do quadro na queda e ancora a base, de modo que o quadro fica preenchido.

## Marcas pousando uma a uma

Revele a faixa em que elas ficam UMA vez (0,35 s) e depois revele as marcas nela com um recorte em degraus na imagem. Porque: abrir a faixa escura inteira em degraus parece uma caixa solta crescendo, não marcas pousando.

## O empurrão para a prova

Dois cartões reais lado a lado, trazidos de um deslocamento curto com desfoque (não de baixo do quadro: uma entrada de fora do quadro dispara a verificação de quadro), depois a câmera empurra cerca de 1,7x para a frase que importa (a resposta de um agente), segura e atravessa até onde essa frase aparece (a tarefa que ele atribuiu a si mesmo). Limpe a manchete ANTES do empurrão, ou os cartões ampliados a cobrem.

## 9:16

- O texto vive entre y=206 e y=1330 e à esquerda de x=918. Abaixo de 1330 é interface da plataforma: só textura ali (a faixa hachurada da marca, um brilho).
- Ponha `white-space: nowrap` em toda linha grande e dimensione-a para caber em 842 px: fontes de título largas (uma grotesca com `font-stretch: 112%`) ocupam cerca de 0,72em por caractere em caixa-alta. Um nome de marca de 8 caracteres a 150 px quebrou em duas linhas; a 124 px cabe.
- Uma abertura de canal quer o avatar do próprio canal: a captura o puxa em tamanho cheio do canal do YouTube ligado (o favicon do site costuma ser uma cópia de 192 px).

## Cartão final

A marca pousa no golpe único (escala 1,6 para 1 a partir de um desfoque, depois um pequeno carimbo), o nome da marca se revela na cintilação, depois o botão real (o preenchimento, o raio, o peso e a caixa da própria marca) e a URL. Tudo com `data-out="end"`. Pode ficar parado até cerca de 3 s; nada mais pode.

## Som

- Um som de interface é dono do seu instante: o sintetizador tira o chimbal e o pluck dali e reduz o bumbo à metade, e dá ganho a cada efeito contra o seu próprio fundo local. Um pop numa batida em que caem juntos um bumbo, um chimbal e um pluck fica inaudível de outro modo.
- Não ponha um whoosh na queda: o impacto já está lá. Ponha-o no movimento que realmente viaja (o mergulho, o transporte).
- O misturador do próprio renderizador deixa a trilha cerca de 2 dB baixa; o `render.mjs` remuxa uma vez a trilha medida sobre a imagem.

## Padrões de mundo (os filmes reconstruídos, 8,0 a 8,2 em todos os eixos)

**Uma gravação vira um fluxo (serviço em 16:9).** Quadro 0: a afirmação batida a 280 px sobre a seda da marca, com uma pílula de vidro REC contando um número real num código de tempo. Um cartão de gravação de vidro com uma forma de onda ao vivo entra voando de z -1100; na batida, ele explode nos seis trabalhos que o serviço faz, cada um um bloco de vidro voando para um arco em 3D com uma barra se enchendo. A câmera mergulha pelos blocos (escala 2,6, desfoque 18, power3.in) até um trilho iluminado de três estações de vidro (as fases do próprio site), seguindo de estação em estação com profundidade de campo, cada estação atuando: pontos se derramando num ponto, um anel se enchendo, barras crescendo.

**Foco seletivo nos números.** Três placas de vidro num arco em 3D; a cada par de batidas uma desliza para a frente em z, ganha nitidez e carimba a sua contagem enquanto as outras ficam atrás, desfocadas; na última batida as três vêm para a frente juntas sob uma varredura de luz.

**A parede de logos.** As marcas dos clientes (aparadas com `trim-alpha.mjs`) num 3x3 de blocos de vidro, cada um entrando voando de z -1400 com um deslocamento semeado, 0,13 s de distância, enquanto a parede inteira orbita alguns graus. Sai por completo (opacidade 0) antes de a linha seguinte começar.

**Um vídeo vira um texto (criador em 9:16).** A frase do próprio site batida palavra por palavra; uma miniatura de vídeo real (baixada em tamanho cheio) num player de vidro entra voando inclinada; a câmera mergulha nela e ela se abre num documento de vidro cujas partes saem voando uma por batida; elas se dobram num envelope que bate na queda; títulos reais com suas miniaturas reais caem em cascata como linhas; a contagem de textos carimba.

**Uma palavra que abre mundos (SaaS em 1:1).** A pílula de palavra do próprio site rola no quadro 0; cada valor em que ela pousa abre um mundo sob ela (uma página real saindo voando da pílula com um destaque descendo pelas linhas; duas páginas reais trazidas com um empurrão para a frase que importa; o vídeo real do produto caindo plano de uma inclinação de 24 graus, ampliado 1,9x na parte que se move).

## Padrões de dispositivo (a rodada de dispositivos 3D, 8,3 a 8,5)

**O produto toca num MacBook real (SaaS em 1:1).** Na queda o MacBook sobe de baixo girando, o vídeo do produto tocando na tela dele como pilha de quadros; a câmera avança até o notebook ocupar 90% da largura. A linha fica ACIMA da tela: qualquer coisa abaixo de y~860 no 1:1 cai no teclado.

**O site nos dois dispositivos (serviço em 16:9).** Dois compassos antes do cartão final, `duo`: o MacBook sobe com o herói do site ao vivo, o iPhone entra balançando uma batida depois; o notebook rola o herói, os números e o método enquanto o celular rola até os depoimentos. Uma linha acima dos dois cita a seção em que o notebook pousa. Mantenha o celular no mesmo nível do notebook ou atrás dele em z: mais perto da câmera ele cresce em perspectiva e sai do quadro.

**O site na mão (criador em 9:16).** `iphone`: sobe mostrando as costas sob a luz de borda da marca, gira até a tela e rola o site móvel ao vivo a partir do herói (que pode repetir o gancho do filme) pelos artigos reais até o cadastro, depois passa para o cartão final. Nenhuma linha sobre ele: o texto do próprio celular é o texto.

**Acrescentar a cena a uma grade pronta.** Acrescente compassos inteiros (as cenas estão em batidas), mova a deixa da logo e o cartão final pelo mesmo número de batidas, rode de novo `beatgrid.mjs` e `synth.mjs` (a trilha precisa ser refeita para a nova duração), depois `device-init` e o render. Dois compassos a 120 BPM são uma cena de 4 s.

## Armadilhas de contrato que a reconstrução achou

- `data-layout-allow-overflow` em todo `.md-rig`: o mundo de uma câmera enquadra coisas parcialmente fora da tela de propósito.
- A verificação de quadro do HyperFrames aponta mídia recortada como fora do quadro mesmo dentro de um pai que recorta; o `render.mjs` a mantém como aviso, então leia-a na crítica em vez de ignorá-la.
- Nunca anime `letter-spacing`, `width`, `top` ou `left`: eles encaixam em pixels inteiros (`gsap_non_transform_motion`). Use escala.
- Uma entrada de fora do quadro dispara a verificação de quadro; traga as coisas de um deslocamento curto com desfoque.
- Uma cena `.clip` não deve ser transformada ela mesma; mova um filho ou um rig.
- O WebGL (`MD.silk`) desliga o desfoque de movimento do HyperFrames no render; os movimentos rápidos levam o próprio `filter: blur` (MD.fly, MD.whip e MD.zoomThrough fazem isso).
