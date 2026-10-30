# Estúdio

Movimento de estúdio de design. Um objeto-herói sobre um fundo brilhante de uma só cor: uma pasta de vidro com as telas reais da marca, uma esfera-lente com a marca, um objeto de pôster retrô. Formas fortes, um cursor de designer e caixas de seleção, traços que se desenham, saltos com mola.

## O visual, em números
- Fundo: `.st-ground`, a cor de destaque acesa a partir do centro (destaque misturado a 62% com branco em 50% 42%, caindo para o destaque a 22% sobre preto). `.is-mono` para uma variante cinza clara com grade de pontos e formas pretas.
- Energia: um raio de sol lento atrás (`.st-burst`, 24 raios a 7,5% de branco, 10 a 12 graus por segundo), manchas orgânicas nos cantos (`.st-blob`, geradas com `MD.studio.blob`), traços brancos grossos (`.st-swoosh`).
- Objetos-herói: `.st-folder` (painel de trás com uma aba, telas reais como `.st-card` dentro, um `.st-front` de vidro com a marca e o nome), `.st-orb` (uma lente de vidro com a marca dentro). O herói ocupa de 45 a 60% da altura do quadro e é a única coisa em foco.
- Ferramentas: `.st-select` (caixa tracejada com 4 alças) e `.st-cursor` agem sobre o texto: selecionar a palavra que importa, clicar num botão, arrastar um cartão.
- Tipografia: a fonte de destaque da marca em branco, de 72 a 150 px, linhas curtas; a palavra selecionada se inverte (caixa branca, texto escuro).

## Movimento
- Com mola: os saltos chegam em `back.out(1.8)` em 0,4 a 0,55 s (`MD.studio.pop`, `data-in="pop@B4"`); as saídas em `back.in` em 0,2 s (`unpop`).
- O herói gira alguns graus ao longo do plano (rotationY de -14 a +10) para ser lido como objeto, nunca como cartão chapado.
- Os traços se desenham e se apagam com `power2.inOut` (`swoosh`); a caixa de seleção é arrastada a partir do canto (`select`); o cursor desliza e se achata ao clicar (`cursor`).
- O vidro pega a luz uma vez ao pousar (`sheen`).
- Transições: o herói some com um salto enquanto o próximo entra com outro; ou a câmera mergulha na palavra selecionada ou num cartão.

## Receitas de plano
- Gancho: a afirmação salta palavra por palavra, um traço se desenha embaixo dela, o cursor seleciona a palavra-chave.
- Produto: a pasta de vidro salta, três telas reais sobem e se abrem em leque, a luz corre pelo vidro.
- Recurso: um cartão real puxado da pasta pelo cursor, ampliado a 60% do quadro, uma caixa de seleção em volta da parte que importa.
- Busca / IA: uma barra de busca de vidro, a pergunta digitada (`data-in="type@B4"`), o cartão de resultado real salta embaixo dela.
- Número: a cifra enorme na fonte de destaque dentro da esfera, ampliada.
- Cartão final: a marca dentro da esfera-lente entra rolando, o endereço salta embaixo, o raio de sol continua girando.

## Som
Quente, de 100 a 120 BPM; um pop suave a cada mola, um clique com o cursor, um shimmer de vidro no brilho.

## Proibido
- Mais de um objeto-herói em foco. Movimentos em degraus ou em stop-motion. Texturas de papel, fita ou foto.
- Texto no vidro do herói que não seja o nome ou a marca da própria marca.
