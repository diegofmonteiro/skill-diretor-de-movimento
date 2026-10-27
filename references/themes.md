# Temas

Um tema é uma linguagem visual inteira: os fundos e materiais, a tipografia, o movimento, as transições e o som. A marca o preenche (cores, fontes, logo, telas reais); o tema decide como tudo se move. Cada tema vive em `templates/themes/<id>/`:

| arquivo | o que é |
|---|---|
| `theme.json` | nome, uma linha, para que serve melhor, o movimento, o fundo, o som, imagens de amostra |
| `theme.css` | os materiais, desenhados em código (ruído SVG, degradês, recortes), tingidos pelos tokens da marca |
| `theme.js` | os movimentos (`MD.paper`, `MD.table`, `MD.studio`) e as entradas de linha (`MD.ENTER.slap`) |
| `THEME.md` | a gramática em números, receitas de cena, som, proibições |
| `sample.html` | uma amostra de 5 segundos com `{{MARCADORES}}` que o `theme-board.mjs` preenche a partir da marca |

## A biblioteca

Cada tema é um filme aprovado, guardado como receita. Cada pasta tem `theme.json`, `RECIPE.md` (o filme cena a cena: o visual em números, uma tabela de cenas com cada movimento, de onde vem cada material para uma marca nova, o código essencial, as armadilhas achadas, o som) e, na máquina de quem o criou, `preview.jpg` (quadros-chave do filme aprovado; **não acompanha esta skill**, e o quadro de temas mostra "sem prévia nesta máquina" no lugar). O `studio` também tem um `sample.html` que renderiza ao vivo em qualquer marca.

| id | formato | em uma linha |
|---|---|---|
| `glass-folder` | 9:16 | uma pasta de vidro na cor da marca num palco escuro iluminado: um cursor de vidro clica nela, ela gira para três quartos e cartões reais se abrem em leque, um player ao vivo do vídeo da própria marca no centro |
| `glass` | 16:9 ou 9:16 | as cores da marca como luz de seda em movimento sob painéis de vidro fosco, uma câmera 3D por cena, profundidade de campo, os números reais em placas de vidro e o site real num notebook e num celular em 3D |
| `logo-build` | 9:16 1080x1920, 30 fps | uma cena contínua: pontos são chicoteados até formar a logo real, páginas reais passam voando em 3D, uma pergunta real é digitada e enviada, um carrossel 3D de páginas reais gira, traços de destaque voltam a se resolver na logo |
| `monochrome` | 9:16 1080x1920, 30 fps | uma tela cinza de designer: grade de pontos, asteriscos pretos gigantes e suaves, um cursor arrastando caixas de seleção tracejadas e objetos 3D fotográficos reais como única cor |
| `product-ui` | 9:16 1080x1920, 30 fps | uma tela cinza de grade de pontos com asteriscos pretos suaves: a logo real é traçada, um cursor enquadra o slogan, a barra de entrada real é digitada e apertada, um disco escuro varre até o produto real girando em 3D e o vídeo dele tocando |
| `puppet` | 9:16 (1080x1920); 1:1 possível | colagem de papel em dois quadros: o personagem sem rosto da própria marca pende dos fios de marionete de uma mão desenhada sobre um sol mostarda e rochas cinza escaneadas, até a cabeça real do fundador estourar e os fios caírem |
| `retro-print` | 1:1 (1080x1080); 9:16 com um painel mais alto | um pôster em risografia que ferve: papel creme, um raio de sol em dois vermelhos girando em dois quadros, objetos de contorno grosso e um computador antigo com tela de pixels, um título extrudado, toda borda rastejando como tinta |
| `safari-collage` | 16:9 (1920x1080) | uma colagem máxima de papel rasgado com fotos reais CC0: tiras rasgadas com bordas brancas, um rádio 3D real impresso em prata com a marca da empresa no deck, um mergulho no alto-falante, um caleidoscópio de 12 cunhas, uma águia de Muybridge batendo asas, colinas deslizando a quatro velocidades, um título num pico de jornal rasgado |
| `studio` | 16:9 (9:16 com os mesmos objetos a 60% da largura) | movimento de estúdio de design: um objeto-herói de vidro sobre um fundo brilhante na cor da marca, raio de sol, manchas, um cursor de designer e caixas de seleção |

## Construir um filme num tema

Leia o `RECIPE.md` do tema por inteiro antes da grade de batidas. Mantenha o ritmo, a gramática de cenas, os materiais e as curvas dele; troque o conteúdo pelo da marca: as palavras, a logo, as telas e o vídeo reais, as pessoas. Cada batida do briefing vira uma das cenas da receita (ou uma cena nova construída com a mecânica dela). Escreva esse mapeamento no `SPEC.md` como tabela (batida, cena da receita, material, fonte) e mostre-a junto com a grade. Depois construa e compare o render lado a lado com a faixa de prévia antes de alguém ver.

## Material real, gratuito, nunca falsificado em CSS

Filmes de papel e de história de objetos vivem de material fotográfico e 3D. Desenhar uma máquina de escrever, uma lupa ou uma mesa em CSS parece desenho de criança. Pegue a coisa real, gratuita e sem crédito necessário (só CC0 e domínio público):

    node scripts/find-assets.mjs "typewriter" --out <pasta> --cutout   # fotos do Wikimedia + Openverse, assunto recortado
    node scripts/find-assets.mjs --ambientcg paper --out <pasta>       # papel, papelão e tecido escaneados
    node scripts/find-assets.mjs --polyhaven texture wood_table_001 --out <pasta>
    node scripts/find-assets.mjs --polyhaven model magnifying_glass_01 --out <pasta>
    node scripts/prop-render.mjs <modelo.gltf> prop.png --hdri studio.hdr --rx 0 --rz -40
    node scripts/cutout.mjs <foto> <saida.png>                         # recorta uma pessoa ou objeto (só macOS)

Olhe cada folha e escolha; a busca do Commons é solta (acrescente `--title palavra`). O Poly Haven tem cerca de 500 modelos CC0 (objetos de mesa, ferramentas, câmeras, relógios, móveis) e HDRIs; renderize cada um exatamente no ângulo que a cena pede. Meça tudo que precisa alinhar (o centro de uma lente, a fenda de uma folha) numa prévia quadriculada.

O `find-assets.mjs` grava um `credits.json` com título, autor, licença e página de cada arquivo. Guarde-o junto com o material: é o registro de que a licença permitia o uso.

## Reconstruir uma referência por filme (o que enfim funcionou)

Os filmes que passaram foram, cada um, uma única referência reconstruída cena por cena na marca, nunca uma mistura. Por filme:
1. Desmonte a referência (quadros a 3 ou 4 por segundo) e escolha de 4 a 6 quadros-chave.
2. Para cada quadro-chave liste: o lugar (fundo), cada objeto (foto real, modelo 3D ou escaneamento), a tipografia (fonte, peso, cor, extrusão, tamanho), o que se move e como (curva, velocidade, ultrapassagem), a transição de saída.
3. Obtenha cada objeto de verdade: primeiro a mídia da própria marca (vídeo do site, miniaturas do YouTube e os cortes do fundador, interface do produto capturada no tamanho do dispositivo), depois CC0 (find-assets.mjs: Wikimedia, ambientCG, modelos do Poly Haven renderizados com prop-render.mjs, inclusive `--screen` para pôr uma captura real num dispositivo).
4. Construa, depois compare os seus quadros com os quadros-chave da referência lado a lado e corrija toda diferença antes de alguém ver. Rode o frame-audit.
5. No máximo um som de "golpe"; construa a trilha a partir dos próprios eventos do filme.

Melhores fontes achadas nos testes: o PRÓPRIO vídeo da marca muitas vezes tem os melhores personagens e objetos (o explicativo de uma marca tinha um manequim sem rosto que virou a marionete do filme de papel); baixe o vídeo principal da marca no YouTube e faça uma folha de contato dele antes de procurar em qualquer outro lugar. Acervos de museus no Commons dão desenhos e pranchas antigos reais (um punho desenhado, a sequência da águia de Muybridge de 1887, cujos quadros formam um ciclo real de batida de asas). O Wikimedia limita rajadas (429): o find-assets tenta de novo com espera crescente.

Armadilhas de recorte: o sistema de visão recorta pessoas e objetos, mas não interface; um escaneamento de museu sobre preto puro precisa de uma máscara por limiar preenchida a partir de cada pixel da borda; um recorte tirado de uma foto emoldurada guarda uma borda de caixa, então tire os corpos de fotos inteiras. O vidro opaco de um dispositivo esconde tudo posto atrás dele: ponha a mídia ao vivo ACIMA da imagem do dispositivo, recortada na tela.

## Escolher um

Se a pessoa nomeia um tema, use-o. Se não, mostre o quadro:

    node scripts/theme-board.mjs --project <pasta>

Ele mostra cada tema como uma faixa do filme aprovado (e renderiza o `studio` ao vivo na marca DELA), grava `themes/board.png` e `themes/board.md`. Mostre o quadro, diga em uma linha para que serve melhor cada um e pergunte qual. Depois `film-init.mjs --project <pasta> --theme <id>` e leia o RECIPE.md desse tema.

## Acrescentar à biblioteca (temas e efeitos, a partir de referências)

A biblioteca cresce uma referência aprovada por vez:

    node scripts/add-reference.mjs --as theme --id <nome> <link|arquivo> [mais ...]
    node scripts/add-reference.mjs --as move  --id <nome> <link|arquivo> [--fast]

Ele aceita pins do Pinterest (o vídeo do próprio pin, ou a imagem se for estático), qualquer coisa que o yt-dlp leia, ou arquivos locais, e grava uma pasta de entrada (dentro da pasta do diretor-de-movimento, nunca dentro da skill) com, por referência: `ref/` (a leitura medida: cortes, duração das cenas, paleta por área, energia de movimento, folhas a 2 quadros por segundo) e `strip-*.png` (faixas CONTÍNUAS, todo quadro a 4 por segundo, 8 com `--fast`). Uma folha uniforme de 15 quadros esconde como as coisas se movem. Ele também grava o `DRAFT.md`, as notas a preencher e os passos de construção.

1. OLHE cada faixa e preencha o DRAFT.md com números: o trabalho único, os materiais e onde obter cada um de graça, papéis da paleta, tipografia, traços e sombras em px, cada movimento (caminho, curva, quadros), câmera, transições, o momento que pousa, o que nunca se move, a lista de proibições.
2. Construa com material REAL ("Material real, gratuito, nunca falsificado em CSS", acima). Um TEMA é provado reconstruindo uma referência como um filme numa marca real ("Reconstruir uma referência por filme"); um EFEITO segue `references/moves.md`.
3. Compare a prova com a faixa da referência nos mesmos momentos, lado a lado, e corrija toda diferença que você conseguir nomear.
4. Mostre à pessoa a prova ao lado da referência. Nada entra em `templates/` sem um sim. Depois escreva o `theme.json` + `RECIPE.md` do tema (ou a pasta do efeito) e rode `node scripts/gallery.mjs` para que apareça na galeria.
5. Copie a gramática, nunca o conteúdo: nenhum clipe, imagem, logo ou fonte baixado de uma referência entra na skill. Esta é também a regra da Conex Prime para criar efeitos novos: a referência inspira o ritmo, a transição e a textura; o desenho e o código são refeitos do zero.
