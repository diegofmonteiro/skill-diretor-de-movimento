# Backlog

O que ainda falta fazer, em ordem de prioridade.

- Conversão de blocos do catálogo: feita com `converter-bloco.mjs` (3 blocos convertidos). Falta fazer o bloco usar as cores da marca (hoje mantém as próprias, `tema: proprio`) e converter os demais sob demanda, principalmente os blocos 3D, que precisam de teste de render próprio.

## Antes de oferecer a clientes

1. **Modelos 3D de dispositivo** (bloco `vfx-iphone-device`): uso liberado por ordem do dono em 28/10/2026. A logo continua escondida por padrão. A liberação é decisão do dono e não substitui a autorização dos mantenedores do HyperFrames (HeyGen), que nunca foi pedida. Se um dia um cliente questionar, o plano é trocar por aparelhos genéricos.
2. **13 arquivos de origem não documentada**: liberados por ordem do dono em 28/10/2026 (`licenseCode: LIBERADO` nos `credits.json`; `node scripts/auditar-creditos.mjs` os lista à parte). São coin.png (bond-coupon-drip), marker.png e reflection.jpg (glass-whiteboard-write), bulb-off.png e bulb-mask.png (product-halo) e knob-0 a knob-7 (rate-dial-knob). Se o autor original aparecer, registrar no `credits.json`.
3. **Recorte de fotos fora do Mac.** O `cutout.mjs` usa o reconhecimento de imagem da Apple. Para o servidor, escolher uma alternativa (serviço de remoção de fundo ou o cliente enviar o PNG recortado) e registrar no `modulo-laravel/06-integracoes.md`.
4. **Testar no servidor ARM** (instância Oracle): Chromium do sistema, `MD_WORKERS`, tempo e memória por render, e um filme com cena de dispositivo no modo `travado`.

## Fontes e modos de rede (feito na 0.3.0; o que falta)

- Fonte própria com busca automática: resolvido com adaptadores por site (`fontes.mjs adaptador <id>`). Falta só escrever os adaptadores dos sites que a pessoa quiser.
- Alternativa ao `cutout.mjs` fora do Mac (por exemplo `rembg`, a testar em ARM).
- Medir onde o tempo do render vai (captura de quadros, vídeo, som) antes de otimizar.
- Registrar a versão do Chrome no `assets.lock.json` e no `LOG.md`.
- Opção de embutir de vez as bibliotecas 3D no repositório, se um dia a prioridade deixar de ser a praticidade de baixar.

## Traduções

Feito na 0.3.0: rótulos, `name`, `oneLiner` e `say` dos 269 efeitos, os 9 `RECIPE.md`, `THEME.md`/`STYLE.md`, catálogos e galeria (glossário em `docs/glossario-traducao.md`).

- As prévias (`preview.mp4`) e a `gallery.jpg` ainda mostram os textos antigos em inglês. Rodar `node scripts/gallery.mjs --force` no Mac (precisa do Chrome) para refazer.
- Encaixe dos textos em português: conferido em 29/10/2026 com `frame-audit` em todos os efeitos e formatos, com os textos padrão e com os de exemplo da marca de demonstração. Corrigidos 20 efeitos. Restam alertas que já existiam no original em inglês (agent-id, book-highlight, compare-table 9:16, control-toggles, file-upload, knowledge-base, radar-chart 9:16, report-card, report-cover, stock-left, tabs-multiply 9:16, tweet-thread 9:16, video-timeline, waitlist-spot, label-box-callout 9:16) e dois falsos alarmes (entrada inclinada do big-cheque; sobreposição declarada de linhas na corrida de barras). Corrigir um a um quando for preciso.
- Conferir a olho, no módulo, os 269 efeitos em pt-BR: foram verificados por programa e por amostra, não um a um.
- Mensagens dos scripts (em inglês de propósito, para o código continuar compatível com a base).

## Novos efeitos e temas

- Usar `scripts/add-reference.mjs` (ver `references/themes.md`). Copiar a gramática, nunca o conteúdo.
- Pedidos frequentes de clientes a transformar em efeito: terça inferior (nome e cargo), chamada para ação, contagem regressiva, selo de oferta, depoimento com texto real.

## Módulo do aplicativo

- Construir o módulo seguindo `modulo-laravel/07-plano-de-construcao.md`.
