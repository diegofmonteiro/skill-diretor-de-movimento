# Backlog

O que ainda falta fazer, em ordem de prioridade.

## Antes de oferecer a clientes

1. **Licença dos modelos 3D de dispositivo** (bloco `vfx-iphone-device`). Confirmar a licença; até lá, não usar a cena de dispositivo em trabalho de cliente.
2. **Embutir three.js e o decodificador Draco** (hoje carregados de um CDN na cena de dispositivo e no `prop-render.mjs`), como foi feito com o GSAP.
3. **Recorte de fotos fora do Mac.** O `cutout.mjs` usa o reconhecimento de imagem da Apple. Para o servidor, escolher uma alternativa (serviço de remoção de fundo ou o cliente enviar o PNG recortado) e registrar no `modulo-laravel/06-integracoes.md`.
4. **Testar no servidor ARM** (instância Oracle): Chromium do sistema, `MD_WORKERS`, tempo e memória por render.

## Traduções

- **Rótulos dos campos** (`label` em `data-composition-variables`) dos 266 efeitos: aparecem para quem edita os campos e ainda estão em inglês.
- Campos `name`, `oneLiner` e `say` dos 266 `move.json` (e, com eles, `CATALOG.md` e `catalog/*.md`).
- Conferir a olho, no módulo, os 266 efeitos em pt-BR: foram verificados por amostra, não um a um.

- 9 arquivos `RECIPE.md` dos temas e `THEME.md`/`STYLE.md` do tema estúdio (ainda em inglês).
- `templates/moves/CATALOG.md` e `catalog/*.md`: são gerados pelo `gallery.mjs` a partir do `move.json`. Para traduzi-los, traduzir antes os campos `name`, `oneLiner` e `say` dos 266 `move.json`.
- Mensagens dos scripts (em inglês de propósito, para o código continuar compatível com a base).

## Novos efeitos e temas

- Usar `scripts/add-reference.mjs` (ver `references/themes.md`). Copiar a gramática, nunca o conteúdo.
- Pedidos frequentes de clientes a transformar em efeito: terça inferior (nome e cargo), chamada para ação, contagem regressiva, selo de oferta, depoimento com texto real.

## Módulo do aplicativo

- Construir o módulo seguindo `modulo-laravel/07-plano-de-construcao.md`.
