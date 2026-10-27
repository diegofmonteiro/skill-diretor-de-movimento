# Regras de movimento

Destiladas de várias centenas de notas de revisão em filmes reais editados. Cada regra aqui existe porque o contrário foi entregue uma vez e voltou como nota. Leia antes de escrever uma cena; leia a seção "Notas repetidas" antes de cada rodada de crítica.

## A régua

Estar correto não é a meta. Um filme pode passar em todas as regras abaixo e mesmo assim ser chato. A lista do queixo caído em `direction.md` vem primeiro: um mundo (seda sob vidro), uma câmera contínua, algo novo a cada batida, material real da marca tornado físico, heróis com 40% ou mais do quadro, profundidade de campo, um momento-assinatura na queda.

## As quatro regras duras

1. **Nada de texto centralizado sobre um degradê liso.** Uma cena só de texto precisa de um motivo escrito nela (`data-type-scene="..."`), e "fica limpo" não é motivo. A resposta padrão para "o que aparece na tela" é o produto.
2. **Nada de ícones genéricos de banco de imagens.** Sem fontes de ícones, sem conjuntos Lucide, Heroicons ou Material, sem emoji no lugar de ícone, sem logo de letras numa caixa onde deveria haver uma logo real. Se a marca não está no disco, diga isso; um espaço reservado ao lado de duas logos reais parece uma imagem que faltou.
3. **Toda linha de texto tem uma entrada e uma saída deliberadas.** O `md.js` dá erro numa linha que não tenha as duas. "end" só vale como saída da última linha do cartão final.
4. **Material real em vez de maquetes desenhadas.** Use as telas capturadas da marca, o vídeo do produto, as miniaturas de vídeo e as marcas dos clientes, tornados físicos no mundo. Nunca mova uma captura de página de marketing como se fosse a imagem: esse foi o maior motivo individual de os primeiros filmes de teste serem recusados. Uma interface desenhada é a coisa mais obviamente gerada de um filme; reconstrua só o que nunca foi gravado, e então a partir dos materiais medidos do produto (as cores de superfície dele, o raio, a tipografia), nunca como um diagrama sobre o produto.

## O que vai na tela

- **Mostre a coisa fazendo a coisa.** A demonstração de um produto vale mais que a página dele; a página vale mais que a cobertura de imprensa sobre ele. O resultado chega enquanto acontece, não depois: comece a cena no momento em que a ação vira o assunto.
- **Um instrumento, não uma frase.** Para dizer "rápido", mostre um contador parando; "muito", uma lista que se enche; "tempo", um relógio. As únicas palavras que sobram na tela devem ser dados e a linha única que o filme está pousando.
- **Uma ideia por quadro.** Um conceito pode ser várias minicenas; dê a cada oração o palco inteiro, na vez dela, e passe de uma para outra com um corte, não com uma dissolvência (a dissolvência põe duas ideias na tela por um terço de segundo).
- **Uma lista de N pontos são N imagens,** não um cartão com N linhas acendendo.
- **A primeira coisa está na tela no quadro 0.** O quadro 0 é a miniatura e o gancho: um resultado, o produto ou uma linha forte. Nunca preto, nunca uma logo esperando para surgir. A estrutura pode chegar durante o primeiro segundo; o quadro não pode ficar vazio por mais tempo que isso.
- **Preencha o quadro.** Dimensione tipografia e painéis ao espaço; nunca ancore um painel curto no topo deixando os 40% de baixo mortos.
- **O desfecho é mostrado uma vez, onde é conquistado.** Provoque antes (desfocado, parcial, pixelado); revele na queda.
- **Um número viaja até a afirmação.** Comece do que o espectador já sabe e conte até o valor novo. Um contador não mostra nada até começar (um "R$ 0" de pré-roll parece um valor real), enche-se bem dentro da sua batida, PARA e é carimbado.
- **Todo número na tela tem fonte.** Um número inventado e plausível é o que ninguém percebe. Se um número não pode ter fonte, ele não é renderizado.
- **Um destaque é tipografia, não um evento.** A palavra em destaque já está destacada desde o primeiro quadro em que aparece; um destaque por linha, no destaque da marca.
- **Um nome de marca largo é dimensionado pela largura,** nunca encaixotado num quadrado (uma logo 4,6:1 num quadrado renderiza com 5% da altura do quadro). Meça a tinta da logo, não a tela dela: os ícones de aplicativo trazem margens invisíveis.
- **Meça uma marca contra a superfície em que está, nos dois sentidos.** Uma logo preta sobre fundo escuro é um retângulo de nada; uma branca sobre branco é o mesmo defeito. Se duas coisas se tocam, confira o contraste.

## Como as coisas se movem

- **Uma animação é um objeto se comportando,** não um layout contendo uma ideia. Nomeie a única quantidade contínua (velocidade, carga, progresso) e derive o visual dela. Se nada se move entre as batidas, é um diagrama.
- **Chegue devagar, saia limpo.** As chegadas pousam numa cauda longa (`expo.out`, `power4.out`); as saídas são de 40 a 50% mais curtas e aceleram para fora (`power3.in`). Os movimentos de câmera suavizam nos dois sentidos (`power2.inOut`). Linear só para rotação e progresso.
- **Uma linha que pousou fica totalmente parada.** O movimento vai para o próximo elemento, a câmera ou o mundo atrás. Sem laços de respiração, flutuação ou pulso; sem avanço lento num título; sem oscilação por item. Um grupo deriva como UM corpo.
- **Nada fica parado por mais de cerca de 3 segundos.** Se uma pausa for mais longa, o intervalo precisa de uma batida própria. Meça no render (a crítica faz isso) e, quando disparar numa cena que JÁ TEM uma batida ali, a batida é pequena demais para se ver: mude uma faixa do quadro, não um ponto.
- **Sobreposição.** O próximo elemento começa quando o anterior está de 30 a 50% feito. Totalmente sequencial parece robótico; tudo de uma vez parece barato.
- **Escalonamento:** letras com um quadro de distância, palavras de 60 a 120 ms, itens de lista de 40 a 80 ms.
- **Não dê zoom por dar.** Um empurrão remove as bordas, muitas vezes justamente o texto que a cena existe para mostrar. Recorte a região, então segure. Um empurrão é para um elemento específico sendo seguido, e traz um motivo.
- **Uma câmera contínua** lê-se como um mundo; um corte entre layouts sem relação lê-se como slides. Entre na cena seguinte por um objeto que está na tela.
- **As transições têm uma causa:** zoom através de um botão, um objeto vira o mundo seguinte, uma transformação, um transporte, uma inundação de cor, uma chicotada, uma íris a partir de um clique. De três a cinco tipos num filme; no máximo um terço das emendas são cortes secos.
- **Corte na batida, mude o layout no compasso.** Os tempos de batida vêm do ÍNDICE da batida (`MD.B(n)`), nunca de somar uma batida arredondada repetidamente.
- **Uma cena não deve abrir na própria conclusão.**
- **Um colapso vai a zero.** Os elementos que devem sair chegam à opacidade 0; só então o sobrevivente chega, desenhado por último.

## Layout

- **Dentro da caixa segura.** `MD.safe` (e as variáveis CSS `--safe-*`) por formato. 9:16: nada nos 168 px do topo, nenhum texto abaixo de y=1330 (a legenda, o nome do perfil e os botões da plataforma), nada sob a coluna de ações da direita.
- **Derive a geometria das linhas do palco,** nunca de deslocamentos que parecem certos: caixas iguais, uma grade, fios ortogonais pousando no centro das bordas.
- **Reserve, depois ajuste.** Quando o tamanho de um painel vem da proporção de uma imagem, tire primeiro a faixa dos móveis e encaixe a imagem no que sobrou. `h = w / ar` e depois posicionar algo abaixo dela estoura o quadro.
- **Uma largura é função do próprio texto,** nunca um número fixo. Confira cada elemento em movimento nos dois estados finais e ao longo do caminho.
- **Arredonde toda expressão de centralização para um pixel inteiro.** Uma borda de 0,5 px tremula entre duas cores durante a cena.
- **Tamanho de tipografia:** títulos de 4 a 9% da altura do quadro; nada que deva ser lido abaixo de cerca de 2,6% do lado menor (28 px em 1080). Na vertical: títulos cerca de 1,35 vez maiores, uns 5 palavras por linha.

## Texto, sombras e recortes

- **Nunca recorte texto que tem sombra.** Uma revelação por `clip-path` recorta na caixa da borda e fatia uma sombra num retângulo reto (a nota "a sombra é sempre uma caixa"). As revelações do `md.js` usam recuos negativos nos lados que não revelam; faça o mesmo em efeitos escritos à mão.
- **Nunca pinte um fundo atrás de um adicional** (sem véu radial, sem box-shadow em volta de uma marca transparente). Levante com `filter: drop-shadow(...)`, que segue o alfa do próprio elemento, suave e baixo.
- **O piso de um recorte fica abaixo dos descendentes e do brilho.** Uma máscara cuja borda inferior é a caixa da linha fatia um "g", um "y" e o brilho de uma palavra iluminada (pior com entrelinha abaixo de 1). As máscaras do `md.js` baixam o piso 0,42em abaixo da caixa; um recorte escrito à mão faz o mesmo (`inset(... -0.42em ...)`).
- **Espaçamento entre letras não mais apertado que -0,025em.** Mais apertado, as letras se sobrepõem ("t" dentro de "h"); cada sobreposição renderiza como uma emenda fina atravessando as letras. O `lint-md` reprova a construção por isso. Aperte com um peso ou tamanho menor, não com espaçamento negativo.
- **Um destaque, cursor ou carimbo pousa no elemento real.** Meça a captura (`scripts/find-rows.mjs <img> --box LxA --inset N` imprime o centro de cada linha nos pixels da própria caixa) e cole os números. Um deslocamento no olho cai entre as linhas e parece quebrado.
- **Nada de travessão (— ou –) em texto da tela.** Use vírgula, dois-pontos ou duas frases. O `lint-md` reprova a construção por isso.

## Tempo de leitura

Uma linha que o espectador precisa ler fica parada cerca de 0,5 s mais 0,3 s por palavra; a última linha do filme, pelo menos 2 s; uma linha de capítulo de uma ou duas palavras, 0,4 s. Num filme de 10 a 30 s esse orçamento é apertado, então corte palavras em vez de encolher as pausas.

## Notas repetidas (leia antes de cada crítica)

Voltaram em vários filmes cada uma. Quando uma se repete, pare de refazer o estilo e ache o mecanismo.

- "Muita tela escura vazia": o quadro não está preenchido.
- "Nada acontece por alguns segundos": uma pausa de mais de 3 s.
- "Por que essas caixas se movem de forma tão robótica": oscilação ou ultrapassagem por item.
- "A sombra é uma caixa": um recorte em texto com sombra.
- "Parece uma maquete": uma interface desenhada onde existia uma tela real.
- "A logo está minúscula": uma marca larga encaixotada num quadrado.
- "Está vazio no começo": o quadro 0 não tem nada.
- "A animação não combina com o que é dito / acontece tarde": batidas lidas de dois arquivos, ou um escalonamento no chute em vez da grade.
- "Zoom demais, não consigo ler": um empurrão que cortou o texto.
- "Por que as letras e o brilho estão cortados embaixo": um piso de máscara na caixa da linha.
- "Tem uma linha atravessando as letras": espaçamento mais apertado que -0,025em.
- "O destaque erra a linha": posições chutadas, não medidas.

## Os movimentos do md.js

Entradas (`data-in="tipo@tempo"`):

| tipo | o que faz | usar em |
|---|---|---|
| `words` | cada palavra entra desfocando, 67 ms de distância, sem deslocamento | a maioria das linhas |
| `ink` | as palavras vão de fracas a tinta cheia | linhas de apoio discretas |
| `line` | a linha inteira se resolve a partir de um desfoque de 8 px | linhas curtas e fortes |
| `letters` | por letra, opacidade e leve desfoque | um nome, um logotipo |
| `rise` | sobe de um piso invisível (sem sombras!) | manchetes com peso |
| `scale` | pousa um pouco grande, assenta, ganha nitidez | uma palavra ou número-herói |
| `wipe` | revelação da esquerda para a direita, recuos seguros para sombra | rótulos, textos de interface |
| `type` | digitado por caractere com piscar de cursor finito | prompts, comandos |
| `slot` | rola por `data-options="a|b|c"` e pousa | a única palavra que muda |
| `count` | conta de `data-from` até `data-to`, para e carimba | números (com fonte!) |
| `present` | na tela a partir desse tempo, sem deslocamento | cartão final trazido de antes |

Saídas (`data-out="tipo@tempo"`): `blur`, `words`, `up`, `down`, `wipe`, `scale`, `cut` (só quando a cena inteira corta), `end` (só o cartão final).

Varie a entrada dentro de um filme; nunca esmaeça e suba tudo.

Os tempos são especificações de batida: `B12`, `bar3`, `B12+0.1`, `drop-0.2` ou segundos.
