# 06 — Integrações

## Trabalhador de render (a integração mais importante)

O render roda os programas da skill (`scripts/*.mjs`), que precisam de Node 22, FFmpeg, o HyperFrames (versão fixa 0.8.188) e um Chrome. Isso **não roda dentro do PHP-FPM**. Desenho recomendado:

- Uma fila própria (`motion-render`) atendida por um trabalhador dedicado, em máquina ou contêiner com os requisitos, separado do servidor web. A fila tem prioridade (rascunho antes de final) e **um render por vez por padrão** (RN-18).
- Cada tarefa vira uma pasta temporária com o projeto; o trabalhador chama o programa com **argumentos em lista** (nunca montando um comando em texto único a partir de dado do usuário) e lê o código de saída. Exemplo de efeito: `node scripts/move-render.mjs --move <id> --brand <pasta> --aspect <formato> --format <formato> --bg <look|none> --vars '<json>' --out <arquivo>`, com as variáveis passadas como um único argumento JSON (e não montadas em texto).
- Limite de tarefas simultâneas por equipe e tempo máximo por tarefa; ao estourar, a tarefa é encerrada e a pasta temporária apagada.
- Saída gravada em armazenamento privado; o download passa por uma rota autenticada que confere a equipe (RN-01).
- O trabalhador usa perfil de navegador temporário. A captura de marca é a única tarefa que abre sites externos, e roda isolada, como ação governada.
- **Sem internet para renderizar.** O GSAP vem embutido na skill, então o render de efeitos não precisa de rede. A exceção é a cena de dispositivo 3D (three.js e Draco de um CDN), que fica desligada (RN-19).
- Variáveis de ambiente: `DIRETOR_DE_MOVIMENTO_HOME` (onde ficam marcas e projetos no trabalhador), `HYPERFRAMES_BROWSER_PATH` (Chrome do sistema), `MD_WORKERS` (processos de captura por render; use 2 ou 1 em máquina pequena).

### Dimensionamento (valores de referência, a confirmar na Fase 0)

Medido no ambiente de teste (2 núcleos, x86): um efeito de 4 segundos em 9:16, qualidade rascunho, levou cerca de 30 segundos. Segundo a documentação da skill, um filme em 1080p renderiza a cerca de 3 a 4 vezes o tempo real em 4 núcleos, e cada processo de captura usa cerca de 256 MB. Trate esses números como parâmetro de partida: meça no servidor real e grave em `motion_render_jobs` (`seconds`, `peak_memory_mb`) para dimensionar os planos.

| Máquina | Observação |
|---|---|
| Oracle Ampere (ARM, 2 núcleos e 13 GB) | laboratório. O HyperFrames não baixa o Chrome em ARM: instalar o Chromium do sistema e apontar `HYPERFRAMES_BROWSER_PATH`. Um render por vez. |
| Vultr São Paulo (produção) | definir a máquina na Fase 0 conforme o volume esperado. Preferir x86 se o Chrome do HyperFrames for usado sem ajuste. |
| Pico de demanda | o HyperFrames prevê execução em Docker e em nuvem (AWS Lambda), segundo a página do projeto; avaliar só se a fila crescer. |

### Controle de carga (resumo)

Fila com um render por vez; limites por plano (RN-17); rascunho antes do final (RN-20); reaproveitar a captura da marca; janela de horário para renderizações longas; render em máquina separada do aplicativo; limites de processador e memória no contêiner; estimativa antes de enfileirar; painel de capacidade (T13).

## Recorte de fotos

O `cutout.mjs` da skill usa o reconhecimento de imagem da Apple e só funciona em Mac. No servidor, escolher na Fase 0 uma destas saídas: (a) o cliente envia o PNG já recortado; (b) um serviço próprio ou de terceiros de remoção de fundo, como ação governada, sem enviar dado pessoal sem necessidade. Registrar a escolha aqui.

## Camada de IA (filmes e crítica)

A IA dirige o filme (escreve o roteiro da cena e dá as notas da crítica a partir das imagens). Regras:

- Uma interface única `DiretorIA` com mais de um provedor configurável (RN-21). A skill é neutra: qualquer agente que leia o `SKILL.md` conduz o fluxo.
- O texto do cliente vai delimitado como dado (RN-13). A IA nunca aprova, apaga nem libera nada: isso é do guard e das pessoas.
- A conferência de texto (RN-09), as validações e os limites rodam em código, sem IA (RN-22).
- O agente geral de operação da Conex Prime não tem poder de criação: não é ele quem dirige filmes.

## Núcleo: LGPD

Dados pessoais deste módulo (declarar no núcleo de LGPD):

| Dado | Onde | Tratamento |
|---|---|---|
| Nome e imagem de pessoas em `motion_brand_assets` (kind `person`) | arquivo e rótulo | só com autorização de uso de imagem registrada |
| Dados pessoais dentro de capturas de tela | arquivo | declarado em `contains_personal_data` e tratado antes do uso (RN-14) |
| Quem pediu, aprovou ou avaliou | ids de usuário | vínculo mínimo |
| Usuário de rede social da marca (`handle`) | `motion_brands` | dado da empresa; se for de pessoa física, vale como dado pessoal |

**Pedido de exclusão do titular:** o módulo apaga os arquivos de pessoa e as capturas que contenham o titular (passando pela autorização da Conex Prime, RN-03, sem impedir o cumprimento da lei), anonimiza os vínculos de usuário nos registros de render e crítica, e **avisa** quais entregas já publicadas continuam contendo a imagem (o módulo não alcança o que já foi postado fora dele). O registro de auditoria mantém o fato do pedido, sem o dado pessoal.

## Núcleo: guard determinístico

Ações sensíveis, cada uma um Job que implementa o contrato de ação governada, interceptado pelo middleware do núcleo:

| Ação | Por que é governada |
|---|---|
| Apagar marca, entrega ou projeto | perda de material e de prova |
| Baixar entregas em lote | saída de muito conteúdo da equipe |
| Importar projeto da skill | entrada de arquivos de origem externa |
| Capturar marca de um site | acesso à rede externa |
| Ligar recurso (cena de dispositivo, tema, efeito) | risco de licença |
| Criar efeito ou tema novo | entra na biblioteca da Conex Prime |

Cada ação grava no log de auditoria quem pediu, o alvo e o resultado.

## Tickets

Um pedido que falha, uma revisão pedida pelo cliente ou uma exceção de plano podem virar ticket do atendimento do aplicativo. O ticket pode virar tarefa ligada ao cliente e ser atribuído a uma pessoa ou a um funcionário robô, seguindo o desenho dos tickets do aplicativo. O módulo só cria e liga; o fluxo do ticket é do outro módulo.

## Conformidade

Se o módulo de conformidade do aplicativo existir, a conferência de RN-09 consulta as regras do setor e das plataformas de anúncio dele; sem ele, usa só a lista de termos da Conex Prime. O módulo guarda as provas (quem aprovou o quê e quando) no registro de auditoria.

## n8n

O n8n conversa com o Laravel por webhooks e requisições HTTP. Não se usa o nó que executa comandos no servidor: ele só existe no n8n instalado por conta própria e vem desativado por padrão desde a versão 2.0.

| Gatilho (entrada) | O que faz |
|---|---|
| `POST /api/motion/clips` | pede um efeito (marca, efeito, variáveis, formato); devolve o id da tarefa |
| `GET /api/motion/clips/{id}` | estado e, se pronto, endereço autenticado do arquivo |
| Webhook de saída `motion.delivery.created` | avisa uma entrega nova, com título, formato e link autenticado |
| Webhook de saída `motion.job.failed` | avisa uma falha, para o n8n abrir ticket ou avisar a equipe |

Chamadas autenticadas por token da equipe; as mesmas regras (RN-08, RN-09, RN-12, RN-17, RN-18) valem na API. Exemplos de uso: venda fechada gera o pedido de um vídeo de boas-vindas; a entrega pronta é enviada por e-mail ou WhatsApp e registrada no ClickUp.

## A própria skill (catálogo e importador)

**Catálogo.** Uma ação da camada 1 lê a pasta `templates/moves/*/move.json` da skill instalada no servidor e atualiza `motion_catalog_items` (e os temas, de `templates/themes/*/theme.json`). As variáveis de cada efeito vêm do atributo `data-composition-variables` do `index.html` dele. O módulo grava a versão da skill de onde cada item veio. Itens novos entram **desligados**; só a camada 1 os liga (RN-19).

**Importador.** Lê uma pasta de projeto gerada pela skill e cria os registros:

| Arquivo da skill | Vira |
|---|---|
| `brand/brand.json` e arquivos | `motion_brands` e `motion_brand_assets` (rascunho; precisa de aprovação) |
| `project.json` e `brief.md` | `motion_projects` |
| `beatgrid.json` | `motion_beat_grids` (revalida pelo validador, RN-07) |
| `critique/round-N/scores.json`, `metrics.json`, `film.mp4`, `sheet.png` | `motion_critiques` |
| `out/*.mp4` e `out/LOG.md` | `motion_deliveries` |
| `log.json` | tempos de máquina em `motion_render_jobs` |

O importador nunca executa nada do arquivo recebido: só lê JSON e copia arquivos para o armazenamento privado, rejeitando caminhos fora da pasta e arquivos acima do limite. O que falhar é listado, e o que passar entra como rascunho.
