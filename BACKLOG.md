# Backlog

O que ainda falta fazer, em ordem de prioridade.

## Antes de oferecer a clientes

1. **Regenerar as prévias.** Os `preview.mp4` dos 266 efeitos e o `gallery.jpg` foram gravados com a marca de exemplo antiga (fotos e telas de uma pessoa real). Rodar `node scripts/gallery.mjs` com a marca de exemplo neutra (`templates/demo-brand`) e conferir o resultado. Leva cerca de 30 segundos por efeito num computador de 2 núcleos; fazer em lotes.
2. **Licença dos modelos 3D de dispositivo** (bloco `vfx-iphone-device`). Confirmar a licença; até lá, não usar a cena de dispositivo em trabalho de cliente.
3. **Embutir three.js e o decodificador Draco** (hoje carregados de um CDN na cena de dispositivo e no `prop-render.mjs`), como foi feito com o GSAP.
4. **Recorte de fotos fora do Mac.** O `cutout.mjs` usa o reconhecimento de imagem da Apple. Para o servidor, escolher uma alternativa (serviço de remoção de fundo ou o cliente enviar o PNG recortado) e registrar no `modulo-laravel/06-integracoes.md`.
5. **Testar no servidor ARM** (instância Oracle): Chromium do sistema, `MD_WORKERS`, tempo e memória por render.

## Traduções

- 9 arquivos `RECIPE.md` dos temas e `THEME.md`/`STYLE.md` do tema estúdio (ainda em inglês).
- `templates/moves/CATALOG.md` e `catalog/*.md`: são gerados pelo `gallery.mjs` a partir do `move.json`. Para traduzi-los, traduzir antes os campos `name`, `oneLiner` e `say` dos 266 `move.json`.
- Mensagens dos scripts (em inglês de propósito, para o código continuar compatível com a base).

## Novos efeitos e temas

- Usar `scripts/add-reference.mjs` (ver `references/themes.md`). Copiar a gramática, nunca o conteúdo.
- Pedidos frequentes de clientes a transformar em efeito: terça inferior (nome e cargo), chamada para ação, contagem regressiva, selo de oferta, depoimento com texto real.

## Módulo do aplicativo

- Construir o módulo seguindo `modulo-laravel/07-plano-de-construcao.md`.
