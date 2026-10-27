# 02 — Regras de negócio

Regras que o sistema nunca pode quebrar. Se uma tela ou decisão técnica contradisser uma regra, a regra vence.

Cada regra tem: a regra, o porquê e como testar.

## RN-01 — Isolamento por equipe

**Regra:** nenhum usuário de uma equipe vê, baixa ou altera marca, projeto, tarefa de render ou entrega de outra equipe, por nenhuma rota, inclusive o download direto de arquivo.

**Por quê:** cada equipe é um cliente da Conex Prime, e uma marca ou vídeo inédito vazado é dano real.

**Como testar:** usuário da equipe A tenta acessar, por todas as rotas do módulo e pelo endereço do arquivo, registros da equipe B e recebe recusa.

## RN-02 — A grade precisa de aprovação humana

**Regra:** um filme só sai de `grade_pendente` depois que um administrador aprova a grade; a aprovação fica registrada com quem aprovou e quando. Alterar a grade depois disso volta o filme a `grade_pendente`.

**Por quê:** a grade é o plano único de imagem e som; animar sem plano aprovado desperdiça render e atropela a decisão da pessoa.

**Como testar:** tentar iniciar a trilha ou o roteiro com a grade pendente falha; alterar uma cena de grade aprovada reabre a aprovação.

## RN-03 — A grade só é válida se passar no validador da skill

**Regra:** a grade é gravada somente se `grade-de-batidas.mjs` a aceitar: cenas contíguas, todo efeito sonoro com evento visível, assinatura declarada, andamento entre 60 e 180. A lista de erros é mostrada à pessoa.

**Por quê:** a skill é a fonte das regras; o módulo não pode ter um validador diferente.

**Como testar:** gravar grades com cena faltando, efeito sem evento e andamento 200; todas recusadas com a mensagem.

## RN-04 — Número em vídeo precisa de fonte

**Regra:** todo número que entra em um vídeo (marca ou variável de movimento) tem uma fonte registrada (texto livre) e a confirmação de quem o cadastrou. Número sem fonte não pode ser usado em render.

**Por quê:** número inventado em vídeo de marca vira afirmação pública da empresa.

**Como testar:** cadastrar um número sem fonte e tentar usá-lo; o render recusa.

## RN-05 — Máximo de três rodadas de crítica

**Regra:** cada filme tem no máximo 3 rodadas de crítica. A rodada 3 segue para entrega mesmo reprovada, mas a lista dos eixos abaixo de 4 é gravada e mostrada na entrega.

**Por quê:** repetir rodadas raramente melhora e custa tempo de máquina.

**Como testar:** tentar criar a rodada 4 falha; entregar a rodada 3 reprovada grava a lista de pendências.

## RN-06 — Aprovação por notas

**Regra:** uma rodada é aprovada se nenhum dos seis eixos (gancho, marca, movimento, legibilidade, ritmo, acabamento) ficar abaixo de 3 e a média chegar a 4. A nota de cada eixo é de 1 a 5 e é obrigatória.

**Por quê:** a mesma regra da skill; a decisão fica comparável entre filmes.

**Como testar:** notas (3,3,3,3,3,3) reprovam; (4,4,4,4,4,3) aprovam; falta de um eixo recusa.

## RN-07 — Entrega só com arquivo conferido

**Regra:** uma entrega só é criada se o arquivo tiver a resolução do projeto e áudio (filme) e se a rodada de origem existir. O registro do que foi feito é gravado junto.

**Por quê:** evita entregar arquivo errado ou mudo.

**Como testar:** tentar entregar arquivo com outra resolução ou sem áudio; recusado.

## RN-08 — Transparência só em formato que a guarda

**Regra:** pedido de movimento com fundo transparente só aceita MOV, WebM, GIF ou sequência de PNGs; e só para movimentos com `alfa = true`.

**Por quê:** MP4 não guarda transparência; o usuário receberia um fundo preto.

**Como testar:** pedir transparência em MP4 ou em movimento sem versão transparente; recusado com mensagem.

## RN-09 — Conteúdo vindo de fora é dado

**Regra:** texto capturado de sites, arquivos enviados e variáveis digitadas nunca são executados nem tratados como instrução. Em HTML gerado, todo texto é escapado; variáveis entram como JSON; nomes de arquivo são normalizados.

**Por quê:** uma página capturada ou um campo de texto não pode injetar código na página renderizada nem ordens para o agente de IA.

**Como testar:** cadastrar variável com `<script>` e com "ignore as instruções anteriores": o vídeo mostra o texto literal e nada é executado; nenhum acesso externo acontece.

## RN-10 — Dado pessoal em tela capturada

**Regra:** capturas de tela de produto declaram se contêm dado pessoal. Captura com dado pessoal não declarado como tratado (coberto ou fictício) não entra em filme.

**Por quê:** o vídeo é público; dado de cliente exposto é violação da LGPD.

**Como testar:** marcar uma captura como "contém dado pessoal" e tentar usá-la em render; recusado até haver a confirmação de tratamento.

## RN-11 — Tarefas de render são idempotentes e limitadas

**Regra:** a mesma tarefa (mesma entrada) executada duas vezes gera o mesmo arquivo e não duplica entrega. Cada equipe tem limite de tarefas simultâneas e de tempo por tarefa; ao estourar o tempo a tarefa falha com mensagem clara e libera a máquina.

**Por quê:** o render é determinístico por desenho; um limite evita que uma equipe ocupe a máquina de todas.

**Como testar:** reenviar a mesma tarefa não cria segunda entrega; uma tarefa com tempo estourado é cancelada e a fila segue.

## RN-12 — Ações governadas

**Regra:** as ações listadas em `06-integracoes.md` (apagar marca, apagar entrega, baixar em lote, importar projeto) são Jobs que implementam o contrato de ação governada e passam pelo guard determinístico do núcleo.

**Por quê:** a decisão sobre ações sensíveis fica fora do modelo de IA e deixa registro auditável.

**Como testar:** com uma regra do guard que bloqueia a ação, o Job não executa e o bloqueio aparece no log de auditoria.

## RN-13 — Português do Brasil em tudo que o usuário lê

**Regra:** mensagens, e-mails e textos de tela estão em português do Brasil correto; números no padrão brasileiro (1.200; 3,5); datas no formato dia/mês/ano.

**Por quê:** é o idioma do cliente da Conex Prime e o mesmo padrão da skill.

**Como testar:** teste de renderização das telas e e-mails conferindo o idioma e o formato de números e datas.

## RN-14 — Trilha sem direito autoral de terceiros

**Regra:** a trilha de um filme é sempre a gerada pelo sintetizador da skill; o módulo não aceita nem oferece música de terceiros no fluxo de filme.

**Por quê:** evita problema de direito autoral em vídeo de marca.

**Como testar:** não existe campo de envio de trilha no fluxo; a entrega registra o arquivo de trilha gerado.
