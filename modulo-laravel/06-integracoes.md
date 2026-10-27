# 06 — Integrações

## Trabalhador de render (a integração mais importante)

O render roda os programas da skill (`scripts/*.mjs`), que precisam de Node 22, FFmpeg, Chrome e o GSAP. Isso **não roda dentro do PHP-FPM**. Desenho recomendado:

- Uma fila própria (`motion-render`) atendida por um trabalhador dedicado, em máquina ou contêiner com os quatro requisitos, separado do servidor web.
- Cada tarefa vira uma pasta temporária com o projeto; o trabalhador chama o programa com argumentos em lista (nunca montando um comando em texto único a partir de dado do usuário) e lê o código de saída: 0 ok, outro valor falha com a mensagem do programa.
- Limite de tarefas simultâneas por equipe e tempo máximo por tarefa (RN-11); ao estourar, a tarefa é encerrada e a pasta temporária apagada.
- Saída gravada em disco privado, nunca em caminho público; o download passa por uma rota autenticada que confere a equipe (RN-01).
- O trabalhador usa um perfil de navegador temporário e não tem acesso à rede além do necessário (a captura de marca é a única tarefa que abre sites externos, e roda isolada).

A pasta da skill instalada no trabalhador é a fonte dos programas e do catálogo; ao subir de versão da skill, atualize-a (e reconfira com o autoteste da skill).

## Núcleo: LGPD

Dados pessoais deste módulo (declarar no núcleo de LGPD):

| Dado | Onde | Tratamento |
|---|---|---|
| Nome e imagem de pessoas em `motion_brand_assets` (kind `person`) | arquivo e rótulo | só com autorização de uso de imagem registrada |
| Dados pessoais dentro de capturas de tela | arquivo | declarado em `contains_personal_data` e tratado antes do uso (RN-10) |
| Quem pediu, aprovou ou avaliou | ids de usuário | vínculo mínimo |
| Usuário de rede social da marca (`handle`) | `motion_brands` | dado da empresa; se for de pessoa física, vale como dado pessoal |

**Pedido de exclusão do titular:** o módulo apaga os arquivos de pessoa e as capturas que contenham o titular, anonimiza os vínculos de usuário nos registros de render e crítica, e **avisa** quais entregas já publicadas continuam contendo a imagem (o módulo não alcança o que já foi postado fora dele).

## Núcleo: guard determinístico

Ações sensíveis, cada uma um Job que implementa o contrato de ação governada, interceptado pelo middleware do núcleo:

| Ação | Por que é governada |
|---|---|
| Apagar marca | derruba projetos e entregas ligados |
| Apagar entrega | perda de arquivo final |
| Baixar entregas em lote | saída de muito conteúdo da equipe |
| Importar projeto da skill | entrada de arquivos de origem externa |
| Capturar marca de um site | acesso à rede externa |

Cada ação grava no log de auditoria quem pediu, o alvo e o resultado.

## Conteúdo enviado a modelos de IA

Se o módulo mandar texto da pessoa a um modelo (por exemplo, para sugerir o roteiro), o texto vai **delimitado como dado**, com instrução fixa de que nada dentro dele é ordem (RN-09). A decisão sobre qualquer ação continua com o guard, nunca com o modelo.

## Outros módulos

- **Marketing e conteúdo:** uma entrega aprovada pode ser anexada a um item de calendário de conteúdo (só o vínculo; a publicação é do outro módulo).
- **Biblioteca de voz e de marca (se existirem):** o módulo pode ler a marca já cadastrada em vez de pedir de novo; a regra de aprovação continua aqui.

## n8n

| Gatilho (entrada) | O que faz |
|---|---|
| `POST /api/motion/clips` | pede um movimento (marca, movimento, variáveis, formato); devolve o id da tarefa |
| `GET /api/motion/clips/{id}` | estado e, se pronto, endereço autenticado do arquivo |
| Webhook de saída `motion.delivery.created` | avisa uma entrega nova, com título, formato e link autenticado |

Chamadas autenticadas por token da equipe; as mesmas regras (RN-04, RN-08, RN-11) valem na API.

## A própria skill (importador)

O importador lê uma pasta de projeto gerada pela skill e cria os registros:

| Arquivo da skill | Vira |
|---|---|
| `marca/marca.json` e arquivos | `motion_brands` e `motion_brand_assets` (rascunho; precisa de aprovação) |
| `projeto.json` e `briefing.md` | `motion_projects` |
| `grade.json` | `motion_beat_grids` (revalida pelo validador, RN-03) |
| `critica/rodada-N/scores.json`, `metricas.json`, `filme.mp4`, `folha.png` | `motion_critiques` |
| `saida/*.mp4` e `LOG.md` | `motion_deliveries` |
| `registro.json` | tempos de máquina em `motion_render_jobs` |

O importador nunca executa nada do arquivo recebido: só lê JSON e copia arquivos para o disco privado, rejeitando caminhos fora da pasta e arquivos acima do limite. O que falhar é listado, e o que passar entra como rascunho.
