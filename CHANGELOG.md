# Histórico de versões

O formato segue o [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e as versões seguem o [SemVer](https://semver.org/lang/pt-BR/).

## [0.3.0] - 2026-10-28

Três modos de fontes (automático, travado, só os meus), escolha das fontes externas e material próprio com licença. O comportamento padrão continua o de sempre: `automatico`.

### Traduzido para o português do Brasil
- Os 269 efeitos: nome, resumo, "quando usar" e rótulos dos campos (`move.json` e `index.html`). Valores literais (modos, lados, cores, formato de data) ficaram como estavam.
- Valores padrão dos campos de texto (cerca de 430): os exemplos que aparecem no vídeo agora saem em português. Códigos de exemplo, nomes de pessoas e termos técnicos (API, build, drop) ficaram em inglês. Os textos fixos do código dos efeitos já estavam em português.
- Os 9 temas: `theme.json`, os 9 `RECIPE.md`, `THEME.md` e `STYLE.md` do tema studio. Os blocos de código das receitas não mudaram.
- Galeria, catálogos (`CATALOG.md`, `catalog/*.md`) e quadro de temas (`gallery.mjs`, `theme-board.mjs`) já saem em português.
- Novo: `docs/glossario-traducao.md` e `docs/ferramentas-traducao/` (conferência da tradução).

### Adicionado
- `scripts/net.mjs`: módulo único de acesso à rede, com tempo limite (60 s), tentativas, cache local com impressão digital (SHA-256), conferência de licença da fonte e trava por projeto (`assets.lock.json`).
- Modos de fontes por `MD_FONTES` ou `node scripts/fontes.mjs modo`: `automatico` (padrão), `travado` (usa a cópia local e confere a impressão digital; arquivo alterado para a execução) e `proprio` (sem internet).
- `scripts/fontes.mjs`: mostra e muda o modo, liga e desliga fontes, registra fontes próprias (com licença obrigatória) e gerencia o cache. Padrões em `templates/fontes.padrao.json`.
- `scripts/add-asset.mjs`: coloca foto, textura, modelo ou fonte do usuário na biblioteca (ou num efeito) com licença obrigatória (`CC0`, `PD`, `OFL-1.1`, `APACHE-2.0`, `MIT`, `PROPRIO`, `AUTORIZADO`) e `credits.json`.
- `scripts/auditar-creditos.mjs`: confere se todo arquivo dos efeitos está no `credits.json` e lista o que está `PENDENTE`.
- `scripts/converter-bloco.mjs`: transforma um bloco trazido do catálogo em efeito da skill (créditos, ficha, gsap embutido). Primeiros efeitos convertidos e traduzidos: `data-chart` (gráfico de barras com linha), `flowchart-vertical` (fluxograma de decisão em 9:16) e `bar-chart-race` (corrida de barras).
- `scripts/buscar-efeitos.mjs`: busca no catálogo de efeitos do HyperFrames (210 blocos), mostra a licença e traz o item com `credits.json`. Todos os itens liberados; os que não declaram licença levam "Apache-2.0 (licença do repositório, não do bloco)" e um aviso.
- Adaptador de busca por site para fontes próprias (`scripts/adaptadores.mjs`, `fontes.mjs adaptador <id>`, `find-assets.mjs --so`): licença e endereço de cada resultado são conferidos.
- Cena de dispositivo: a logo de terceiros que vem nos modelos fica escondida por padrão (`--show-logo` a mostra).
- `references/fontes-externas.md` e a seção 26 do manual.
- `check-setup.mjs` confere o `unzip`, avisa quando roda como `root` ou em CPU sem Chrome próprio e mostra o modo.

### Alterado
- `find-assets.mjs`, `device-init.mjs`, `prop-render.mjs`, `brand-intake.mjs` e `add-reference.mjs` passam pelo módulo de rede. Erros de rede agora dizem que foi a rede, e não culpam as palavras da busca.
- Nos modos `travado` e `proprio`, o three.js e os carregadores vêm do cache e são copiados para `film/vendor/` (cerca de 0,7 MB); o decodificador Draco só é copiado se um modelo o usar (os modelos atuais de MacBook e iPhone não usam).
- Os modelos 3D de dispositivo vêm de um commit fixo do registro do HyperFrames nos modos `travado` e `proprio`; em `automatico` seguem a ramificação `main`, como antes.
- O corpo do `SKILL.md` foi reduzido (passo a passo da tela do dispositivo movido para `references/direction.md`).
- `gallery.mjs --open` abre a galeria também em Linux e Windows.
- Se a biblioteca 3D não carrega, o `prop-render` e a cena de dispositivo dizem isso, em vez de gerar imagem transparente.

### Encaixe dos textos em português
- Conferência com `frame-audit` em todos os efeitos e formatos. Corrigidos: contador de seguidores (`profile-stats-header`, que quebrava com o ponto de milhar), valor por extenso do `big-cheque` (agora em português, sem repetir "reais"), botões do `post-reactions`, formato de números do `trending-list`, e textos que estouravam a caixa em `calendar-reschedule`, `email-send`, `doc-page`, `progress-bar`, `label-box-callout` e nos exemplos da marca de demonstração (`channel-analytics`, `compare-table`, `growing-coin-row`, `notebook-scribble`, `podium-rank`, `pros-cons`, `tabs-multiply`, `video-timeline`, `window-tile`).
- `frame-audit.mjs` agora aceita uma composição que registra a linha do tempo com outro nome além de `main`.

### Créditos corrigidos
- Criado o `credits.json` de bond-coupon-drip, glass-whiteboard-write, product-halo e rate-dial-knob (também ausente no projeto original). Papel e fontes foram identificados por impressão digital idêntica a arquivos já documentados.
- Créditos soltos de keynote-stage-screen, label-box-callout e product-cutout-drop reescritos com o nome exato de cada arquivo.

### Observações
- Por ordem do dono (28/10/2026), todas as licenças estão liberadas para uso na skill: os modelos 3D de dispositivo (`vfx-iphone-device`) e os 13 arquivos de origem não documentada (coin.png, marker.png, reflection.jpg, bulb-off.png, bulb-mask.png e knob-0 a knob-7), agora marcados `LIBERADO` nos `credits.json`. A liberação é decisão do dono e não altera a licença de terceiros; a origem segue sem documentação.
- `auditar-creditos.mjs` lista os arquivos `LIBERADO` à parte e só reprova arquivo sem registro.
- A trava garante entradas iguais, não pixels idênticos entre computadores diferentes.

## [0.2.1] - 2026-10-27

Os efeitos passam a sair em português do Brasil e as prévias deixam de mostrar a marca antiga.

### Alterado
- Textos de exemplo e padrões dos 269 efeitos traduzidos para pt-BR (cerca de 950 textos), com `lang="pt-BR"` e formatação de números em pt-BR.
- Textos fixos dentro dos efeitos traduzidos: meses e dias da semana, rótulos de cheque, passagem, fatura, recibo, tabela nutricional, termos de uso, registros de log e outros.
- Moeda `R$` no lugar de `$`, `/mês` e `/ano` no lugar de `/mo` e `/yr`; decimais com vírgula nos efeitos que formatam números por conta própria; horas em formato de 24 h.
- Cheque por extenso em português ("Dez mil reais e 00/100"); o valor do cheque agora é digitado no padrão brasileiro (`10.000` ou `1.250,50`).
- Prévias (`preview.mp4`, `preview.gif`) e `gallery.jpg` regeneradas com a marca de exemplo neutra.

### Observações
- Nos campos de entrada dos efeitos, decimais continuam com ponto (`1.2 mi`) e listas com vírgula; a saída é que usa a vírgula. A exceção é o cheque.
- Os rótulos dos campos (`label`) e os campos `name`, `oneLiner` e `say` dos `move.json` seguem em inglês; ver BACKLOG.

## [0.2.0] - 2026-10-27

Troca da base: a skill passa a usar o motor HyperFrames e a biblioteca completa de 266 efeitos e 9 temas, no lugar da versão enxuta da 0.1.0.

### Adicionado
- 266 efeitos em 10 categorias, com catálogo, galeria e prévias.
- 9 temas de filme inteiro, cada um com receita.
- Captura de marca, busca de imagens livres de direitos, crítica em seis eixos, verificação de regras, trilha sintetizada, cena de dispositivo em 3D.
- `LICENCAS-DE-TERCEIROS.md` com os avisos obrigatórios.
- Caderno `modulo-laravel/` reescrito para este motor (fila, limites de servidor, aprovação do cliente, registro, guard).
- `docs/manual.md` completo.
- `evals/` com testes de resultado e de gatilho.

### Alterado
- `SKILL.md`, `README.md` e os 10 guias de `references/` traduzidos e adaptados para o português do Brasil e para o processo da Conex Prime.
- Nome interno `diretor-de-movimento` e variável `DIRETOR_DE_MOVIMENTO_HOME` no lugar do nome original.
- Marca de exemplo trocada por uma marca fictícia neutra (a original trazia fotos e telas pessoais do autor).
- GSAP 3.14.2 embutido em `templates/hyperframes/gsap.min.js`; os 269 modelos deixaram de carregá-lo de um CDN. Corrige falha de render sem internet.

### Corrigido
- Render falhava quando o servidor não alcançava o CDN do GSAP.

### Observações
- Em Linux ARM o HyperFrames não baixa o Chrome: usar `HYPERFRAMES_BROWSER_PATH` (ver README).
- O recorte de fotos (`cutout.mjs`) só funciona em Mac; ver BACKLOG.
- As prévias em vídeo (`preview.mp4`) e `gallery.jpg` mostravam a marca de exemplo antiga; corrigido na 0.2.1.

## [0.1.0] - 2026-10-27

Versão inicial, com motor próprio, 22 movimentos e 3 temas. Substituída pela 0.2.0.
