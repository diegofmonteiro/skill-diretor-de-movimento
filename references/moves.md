# Efeitos: animações avulsas, transições, vinhetas e sobreposições

Um EFEITO (em inglês, *move*) é uma animação que faz um trabalho só, de 2 a 6 segundos, que renderiza em qualquer marca, em qualquer proporção (9:16, 16:9, 1:1) e ou em quadro cheio (um corte de B-roll, `--bg look`) ou transparente (uma sobreposição sobre quem fala, `--bg none`, `.mov` ProRes 4444 ou `.webm` VP9). Os temas (`templates/themes`) são filmes inteiros; os efeitos são as peças deles, usáveis dentro de qualquer vídeo.

    node scripts/move-render.mjs --move bar-race --aspect 9:16                   # B-roll, marca de exemplo
    node scripts/move-render.mjs --move bar-race --brand <projeto> --bg none --format mov \
         --vars '{"labels":"Manual,Modelos,{brand}","values":"14,31,72"}'        # sobreposição, marca do cliente
    node scripts/gallery.mjs                                                     # prévias, gallery.html, CATALOG.md + catalog/

Notas de exportação: o `.mov` ProRes 4444 entra no Premiere, no Final Cut e no Resolve com a transparência. O `.webm` VP9 com alfa só toca transparente em navegadores. O CapCut quer um MP4 de tela verde (`--format mp4 --vars '{"key":"#00FF00"}'` num efeito com alfa pinta o fundo de verde puro) ou um GIF (o brilho forma faixas no GIF).

## Pasta

    templates/moves/<id>/
      move.json      metadados (abaixo)
      index.html     a composição, com os marcadores {{W}} {{H}} {{DUR}}
      assets/        os arquivos estáticos do próprio efeito (opcional, só genéricos)
      preview.mp4    laço de 3 a 4 s na marca de exemplo (templates/demo-brand), 9:16, 540 px de largura (o gallery.mjs grava)
      preview.gif    o mesmo, 270 px de largura, para o chat (só local)

Para escolher efeitos: leia `templates/moves/CATALOG.md` (o índice de categorias) e depois só os arquivos `templates/moves/catalog/<categoria>.md` que combinam com a batida, nunca todos os `move.json` nem o `gallery.html`. O `say` de um efeito vira a linha dele no catálogo, então escreva-o como "quando quem fala diz...", e o `category` decide em qual arquivo do catálogo ele aparece.

`move.json`:

    { "id", "name", "oneLiner",
      "category": "social" | "creator" | "ai" | "dev" | "productivity" | "business" | "data" | "paper" | "system" | "explain",
      "kind": "effect" | "transition" | "sting" | "film",
      "uses": ["overlay", "broll", "transition"],
      "looks": ["glass" | "paper" | "riso" | "mono" | "studio" | "editorial"],
      "from": "<id do tema de onde veio, ou new>",
      "tags": [...],
      "formats": ["9:16","16:9","1:1"], "duration": 3.2, "alpha": true,
      "say": "quando usar num vídeo com alguém falando: o que a pessoa diz quando ele pousa" }

Os valores de `category`, `kind`, `uses` e `looks` ficam em inglês: os scripts os leem assim. Os textos `name`, `oneLiner` e `say` podem ser escritos em português nos efeitos novos da Conex Prime.

## O contrato da composição

- `<html data-composition-variables='[...]'>` (entre aspas simples, então nenhum apóstrofo em qualquer rótulo ou valor padrão: um deles quebra todas as variáveis sem avisar) declara as variáveis PRÓPRIAS do efeito (`{id,type,label,default}`), com valores padrão que ficam bem em qualquer marca (sem texto específico de produto: ponha o texto de exemplo da marca de exemplo no `examples` do `brand.json` dela).
- Carregue `gsap`, `assets/brand-fonts.css`, depois `assets/move.js`, depois o script do efeito. O `MV` (do `move.js`) fornece `v` (variáveis), `W/H`, `u` (= min(W,H)/1080; dimensione TUDO em `calc(var(--u) * n)` ou `n * u`), `portrait`, `alpha`, `safe` (zonas de interface da plataforma no 9:16), `tl`, `rand`, `st` (curva em dois quadros), `words`, `fit`, `img`, `done()`. Chame `MV.done()` por último.
- Os tokens da marca chegam como variáveis e como variáveis CSS em `#root`: `--accent --accent2 --ink --ground --surface --muted --paper --font-display --font-body`. Arquivos da marca: `v.logo`, `v.mark`, `v.screens[]`, `v.people[]` (caminhos em `assets/brand/`), `v.brandName`, `v.domain`, `v.headline`, `v.tagline`, `v.handle` (pode ser vazio: derive do nome), `v.stats[]`. Nunca escreva uma marca fixa no código.
- `bg`: quando `MV.alpha`, NÃO desenhe fundo, grão nem vinheta de quadro cheio (a raiz recebe `.is-alpha`); mantenha o objeto, a sombra e o brilho dele. Dê ao objeto corpo suficiente (um preenchimento de superfície) para ser lido sobre qualquer imagem.
- `key` (um hex como `#00FF00`): a sobreposição sobre uma cor chave lisa, para editores sem alfa. A raiz também recebe `.is-key`: nela toda superfície, placa e cartão precisa ser OPACA (`.is-key .card { background: var(--surface) }`, sem backdrop-filter), e evite brilhos grandes e suaves, ou o removedor de cor os come.
- O layout sai de `W/H/u` e de `MV.safe`. No 9:16 uma SOBREPOSIÇÃO fica longe da interface da plataforma (topo 290 px, base 680 px, direita 192 px, escalados por W/1080); um corte de B-roll em quadro cheio fica CENTRALIZADO no quadro (`MV.safe` dá margens simétricas quando não é alfa), aceitando que legendas possam ficar sobre a parte de baixo dele. As sobreposições ficam onde quem fala deixa espaço: terço inferior ou superior, nunca sobre a zona do rosto (a faixa central de 40% do 9:16), a menos que o efeito seja um corte total.
- As sobreposições começam de um quadro vazio em t=0 (entram cortadas numa palavra) e saem limpas antes do fim (saída nos últimos 0,3 a 0,45 s, acelerando). O B-roll em quadro cheio pode abrir no próprio fundo.
- Texto: ajuste-o (`MV.fitText`, que mede o próprio texto; o `MV.fit` antigo encolhe demais texto em caixas de bloco ou flex) para que um texto de marca mais longo nunca transborde; uma ideia por efeito; rótulos, não frases.
- Nunca anime `filter: blur()` numa curva `back` ou `elastic`: ela passa de zero para baixo, `blur(-0.5px)` é inválido e o quadro fica com um desfoque antigo. Desfoque e opacidade em `power`/`expo`/`steps`; molas só em transformações.
- Nomes reservados: as variáveis próprias de um efeito nunca reutilizam um token de marca ou de execução (`key`, `bg`, `aspect`, `mark`, `logo`, `screens`, `people`, `handle`, `ink`, `accent`, `ground`, `surface`, `paper`, `muted`, `domain`, `headline`, `tagline`, `stats`), e os scripts nunca declaram um `top` global (ele colide com `window.top`). O renderizador também grava cada variável em #root como propriedade CSS de mesmo nome, então nunca dê a uma propriedade CSS o nome de uma variável do efeito (`--tone` com uma variável `tone`).
- Estados de sucesso (confirmado, pronto, pago) usam um verde semântico, nunca o destaque da marca.
- Determinístico: sem Math.random, sem Date, sem temporizadores; `MV.rand` com semente.

## A régua (leia antes de construir)

Eles são julgados contra filmes aprovados. Um efeito precisa parecer motion design sênior, não um modelo pronto: material real (as telas da marca, o caminho da logo, recortes de pessoas, fotos CC0 e renders 3D do find-assets / prop-render), luz medida (bordas, brilhos, sombras de contato), curvas com cauda longa (`expo.out`, `back.out(1.4-2)` para molas, `steps(n)` para papel em dois quadros), sobreposição entre elementos e um momento que pousa (um carimbo, um clique, um estalo). Nunca: clip-art chapado, fontes de ícones, emoji, texto centralizado sobre degradê liso, um slide de texto, uma linha cruzando uma letra.

## Verifique cada efeito

    node scripts/move-render.mjs --move <id> --aspect 9:16 --quality draft --keep   # imprime a pasta de trabalho
    node scripts/frame-audit.mjs <pasta de trabalho>                                # precisa sair limpo
    # também --aspect 16:9 e, se tiver alfa, --bg none --format mov sobre uma placa colorida
    ffmpeg -i out.mp4 -vf "fps=4,scale=200:-2,tile=12x2" -frames:v 1 sheet.jpg      # OLHE todos os quadros
