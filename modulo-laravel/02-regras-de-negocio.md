# 02 — Regras de negócio

Regras que o sistema nunca pode quebrar. Se uma tela ou decisão técnica contradisser uma regra, a regra vence.

Cada regra tem: a regra, o porquê e como testar.

## Acesso e dados

### RN-01 — Isolamento por equipe

**Regra:** nenhum usuário de uma equipe vê, baixa ou altera marca, projeto, tarefa de render ou entrega de outra equipe, por nenhuma rota, inclusive o download direto de arquivo.

**Por quê:** cada equipe é um cliente da Conex Prime; uma marca ou um vídeo inédito vazado é dano real.

**Como testar:** usuário da equipe A tenta acessar, por todas as rotas do módulo e pelo endereço do arquivo, registros da equipe B e recebe recusa.

### RN-02 — A inteligência nunca chega ao cliente

**Regra:** nenhuma rota, resposta de API, arquivo baixável ou tela das camadas 2 e 3 devolve o conteúdo da skill: `SKILL.md`, `references/`, receitas dos temas, código ou HTML dos efeitos, regras internas. O cliente vê só a vitrine e o vídeo entregue.

**Por quê:** a inteligência é o valor da Conex Prime; o cliente compra o direito de produzir vídeos, não o motor.

**Como testar:** com usuário de equipe cliente, pedir por todas as rotas e pela API qualquer arquivo da skill; recusado. A resposta do catálogo contém só os campos da vitrine.

### RN-03 — Exclusão só com autorização da Conex Prime

**Regra:** o cliente não apaga marca, entrega, projeto nem arquivo por conta própria. Ele registra um pedido de exclusão; a Conex Prime autoriza ou recusa. A exclusão é lógica; a remoção física só acontece depois da autorização e do prazo de retenção definido pelo núcleo. O pedido, a decisão e o autor ficam registrados para sempre.

**Por quê:** a Conex Prime precisa de prova do que foi pedido e entregue, a seu favor, e não pode perder material por clique do cliente.

**Como testar:** o usuário do cliente aciona "apagar" e o registro continua existindo com o estado `exclusao_pedida`; só após a autorização da camada 1 ele muda; o log guarda os três momentos.

### RN-04 — Registro de tudo

**Regra:** toda ação relevante (pedir, aprovar, reprovar, baixar, enviar arquivo, pedir exclusão, mudar plano ou recurso) grava um registro de auditoria com quem, quando, o quê, o alvo e o resultado. O registro não pode ser editado nem apagado por nenhum papel das camadas 2 e 3.

**Por quê:** é a prova que a Conex Prime precisa ter a seu favor em qualquer discussão.

**Como testar:** executar cada ação e conferir o registro; tentar editar ou apagar um registro como usuário do cliente e como administrador de equipe; recusado.

### RN-05 — Cada nível só repassa o que recebeu

**Regra:** o dono do cliente só libera aos empregados o que a Conex Prime liberou a ele; o empregado só usa o que o dono liberou. Recursos desligados pela camada 1 não podem ser religados por camadas abaixo.

**Por quê:** é a regra de acesso do aplicativo (Conex Prime → cliente → cargo).

**Como testar:** desligar um recurso na camada 1 e tentar ligá-lo como dono do cliente; recusado.

## Filmes e conteúdo

### RN-06 — O plano precisa de aprovação humana

**Regra:** um filme só sai de `grade_pendente` depois que a grade (plano de cenas) é aprovada, e a aprovação fica registrada com quem aprovou e quando. A política de aprovação é definida por equipe: `cliente`, `conex_prime` ou `ambos`. Alterar a grade depois disso volta o filme a `grade_pendente`.

**Por quê:** a grade é o plano único de imagem e som; animar sem plano aprovado desperdiça render e atropela a decisão da pessoa.

**Como testar:** tentar iniciar a trilha ou o roteiro com a grade pendente falha; alterar uma cena de grade aprovada reabre a aprovação; com política `ambos`, uma só aprovação não basta.

### RN-07 — A grade só vale se passar no validador da skill

**Regra:** a grade é gravada somente se `scripts/beatgrid.mjs` a aceitar: cenas contíguas que terminam na duração do filme, todo efeito sonoro com evento visível, andamento válido. A lista de erros é mostrada à pessoa.

**Por quê:** a skill é a fonte das regras; o módulo não pode ter um validador diferente.

**Como testar:** gravar grades com cena faltando e efeito sem evento; todas recusadas com a mensagem do validador.

### RN-08 — Número em vídeo precisa de fonte

**Regra:** todo número que entra em um vídeo (marca ou variável de efeito) tem uma fonte registrada e a confirmação de quem o cadastrou. Número sem fonte não pode ser usado em render.

**Por quê:** número inventado em vídeo de marca vira afirmação pública da empresa.

**Como testar:** cadastrar um número sem fonte e tentar usá-lo; o render recusa.

### RN-09 — Conferência de promessa e de norma antes do render

**Regra:** todo texto que vai para a tela passa por uma conferência determinística (sem IA) contra uma lista editável pela Conex Prime de termos proibidos ou de risco (por exemplo, promessa de resultado, "garantido", antes e depois sem autorização) e contra as regras do setor da equipe, quando existirem no módulo de conformidade. Texto sinalizado fica em `revisao_humana` e não renderiza até a Conex Prime liberar.

**Por quê:** a Conex Prime não promete resultado e precisa obedecer às normas das plataformas de anúncio e à LGPD.

**Como testar:** pedir um efeito com "resultado garantido"; fica em revisão humana; a liberação registra quem liberou.

### RN-10 — Máximo de três rodadas de crítica

**Regra:** cada filme tem no máximo 3 rodadas de crítica. Uma rodada é aprovada se os seis eixos (gancho, marca, movimento, legibilidade, ritmo, acabamento) tiverem nota de 1 a 10 e todos chegarem a 8 ou mais. Depois da rodada 3, entrega-se a melhor e grava-se a lista dos eixos abaixo de 8.

**Por quê:** é a régua da skill; repetir rodadas além disso raramente melhora e custa máquina.

**Como testar:** tentar criar a rodada 4 falha; nota abaixo de 8 sem linha de correção é recusada; a entrega da rodada 3 grava as pendências.

### RN-11 — Entrega só com arquivo conferido

**Regra:** uma entrega só é criada se o arquivo tiver a resolução do pedido e, nos filmes, áudio, e se a rodada de origem existir. O registro do que foi feito (`LOG.md` da skill) é gravado junto.

**Por quê:** evita entregar arquivo errado ou mudo.

**Como testar:** tentar entregar arquivo com outra resolução ou sem áudio; recusado.

### RN-12 — Transparência só em formato que a guarda

**Regra:** pedido de efeito com fundo transparente só aceita MOV, WebM, GIF ou sequência de PNGs, e só para efeitos com `alpha = true`. Para editor sem transparência (CapCut), a saída é MP4 com cor de chave.

**Por quê:** MP4 comum não guarda transparência; o usuário receberia fundo preto.

**Como testar:** pedir transparência em MP4 comum ou em efeito sem versão transparente; recusado com mensagem.

### RN-13 — Conteúdo vindo de fora é dado

**Regra:** texto capturado de sites, arquivos enviados e variáveis digitadas nunca são executados nem tratados como instrução. Em HTML gerado, todo texto é escapado; variáveis entram como JSON; nomes de arquivo são normalizados. Quando um texto vai a um modelo de IA, vai delimitado como dado.

**Por quê:** uma página capturada ou um campo de texto não pode injetar código na página renderizada nem ordens para o agente de IA.

**Como testar:** cadastrar variável com `<script>` e com "ignore as instruções anteriores": o vídeo mostra o texto literal e nada é executado.

### RN-14 — Dado pessoal em tela capturada

**Regra:** capturas de tela de produto declaram se contêm dado pessoal. Captura com dado pessoal não declarado como tratado (coberto ou fictício) não entra em filme nem em efeito.

**Por quê:** o vídeo é público; dado de cliente exposto é violação da LGPD.

**Como testar:** marcar uma captura como "contém dado pessoal" e tentar usá-la em render; recusado até haver a confirmação de tratamento.

### RN-15 — Uso da marca do cliente autorizado

**Regra:** uma marca só fica `aprovada` (e só serve a render) com a autorização de uso registrada (referência do contrato ou aceite). Logo, fontes e telas de uma marca nunca são usadas por outra equipe.

**Por quê:** logos, fontes e telas pertencem ao cliente.

**Como testar:** tentar aprovar marca sem autorização; recusado. Tentar usar a marca da equipe A num pedido da equipe B; recusado (RN-01).

### RN-16 — Trilha sem direito autoral de terceiros

**Regra:** a trilha de um filme é sempre a gerada pelo sintetizador da skill; o módulo não aceita nem oferece música de terceiros no fluxo de filme.

**Por quê:** evita problema de direito autoral em vídeo de marca.

**Como testar:** não existe campo de envio de trilha no fluxo; a entrega registra o arquivo de trilha gerado.

## Servidor e custo

### RN-17 — Limites por plano e fila com admissão

**Regra:** cada equipe tem um plano com tempo de render por mês, tarefas simultâneas, duração máxima de filme, formatos e recursos permitidos. Um pedido só entra na fila se couber no plano; fora dele, recebe mensagem clara e, se a Conex Prime quiser, vira pedido de exceção. O módulo estima o tempo de máquina antes de enfileirar e avisa quando for longo.

**Por quê:** o render é pesado; sem limite, um cliente ocupa a máquina de todos e o custo foge.

**Como testar:** equipe sem saldo tenta enfileirar e recebe recusa; equipe no limite de simultâneos fica em espera; a estimativa aparece antes de confirmar.

### RN-18 — Tarefas de render idempotentes, com tempo máximo

**Regra:** a mesma tarefa (mesma entrada) executada duas vezes gera o mesmo arquivo e não duplica entrega. Cada tarefa tem tempo máximo; ao estourar, é encerrada com mensagem clara, a pasta temporária é apagada e a fila segue. O trabalhador roda um render por vez por padrão.

**Por quê:** o render é determinístico por desenho; o limite impede uma tarefa travada de parar a fila.

**Como testar:** reenviar a mesma tarefa não cria segunda entrega; tarefa com tempo estourado é cancelada e a fila segue.

### RN-19 — Recursos com licença pendente ficam desligados

**Regra:** a cena de dispositivo 3D e qualquer bloco ou material cuja licença não esteja confirmada ficam desligados para equipes clientes. Só a camada 1 liga um recurso, registrando a licença conferida.

**Por quê:** uso comercial de material sem licença é risco jurídico.

**Como testar:** pedir um filme com cena de dispositivo numa equipe cliente; o item não aparece e o pedido pela API é recusado.

### RN-20 — Rascunho antes do final

**Regra:** filmes e efeitos acima de um tempo de máquina definido pela Conex Prime só geram a versão final depois de uma prévia ou rascunho aprovado.

**Por quê:** a maior parte dos ajustes acontece no rascunho, que custa uma fração do render final.

**Como testar:** tentar gerar o final de um filme sem rascunho aprovado; recusado.

## Operação

### RN-21 — Nunca depender de uma IA só

**Regra:** toda chamada a modelo de IA passa por uma camada com mais de um provedor configurável; se o primeiro falhar, tenta o segundo; se todos falharem, o pedido vai para revisão humana, sem perder o que já foi feito.

**Por quê:** princípio da casa de redundância e de poder trocar de ferramenta.

**Como testar:** simular falha do provedor principal; o segundo assume; simular falha dos dois; o pedido fica em `revisao_humana`.

### RN-22 — Código antes de IA

**Regra:** efeitos, conferências, validações, estimativas e limites rodam em código determinístico, sem IA. A IA só dirige filmes completos e a crítica visual, e nunca decide uma ação sensível (isso é do guard).

**Por quê:** é mais barato, mais previsível e auditável.

**Como testar:** o fluxo de efeito completo roda com o provedor de IA desligado.

### RN-23 — Ações governadas

**Regra:** as ações listadas em `06-integracoes.md` (apagar, baixar em lote, importar projeto, capturar marca de um site, ligar recurso, criar efeito novo) são Jobs que implementam o contrato de ação governada e passam pelo guard determinístico do núcleo.

**Por quê:** a decisão sobre ações sensíveis fica fora do modelo de IA e deixa registro auditável.

**Como testar:** com uma regra do guard que bloqueia a ação, o Job não executa e o bloqueio aparece no log de auditoria.

### RN-24 — Português do Brasil em tudo que o usuário lê

**Regra:** mensagens, e-mails e textos de tela estão em português do Brasil correto; números no padrão brasileiro (1.200; 3,5); datas no formato dia/mês/ano.

**Por quê:** é o idioma do cliente da Conex Prime e o padrão da casa.

**Como testar:** teste de renderização das telas e e-mails conferindo o idioma e o formato de números e datas.
