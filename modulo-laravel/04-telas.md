# 04 — Telas

Toda tela tem os estados vazio, carregando e erro. As ações respeitam as camadas de `01-visao-geral.md`. Texto de interface em português do Brasil (RN-24). Telas marcadas **[Conex Prime]** só existem na camada 1.

## T1 — Painel

**Objetivo:** ver o que está acontecendo na equipe.
**Dados:** tarefas na fila e em execução, últimas entregas, filmes aguardando aprovação, saldo de tempo de render do mês.
**Ações:** abrir um filme, abrir uma entrega, pedir um efeito, criar um filme.
**Estados:** vazio mostra os botões "Pedir um efeito" e "Criar um filme".

## T2 — Marcas (lista e cadastro)

**Objetivo:** manter as marcas da equipe.
**Dados:** nome, cores em amostras, logo, quantidade de telas, status.
**Ações:** criar, editar, aprovar (com a autorização registrada, RN-15), pedir exclusão (RN-03), "capturar de um site" (ação governada: mostra os candidatos a logo e as cores vistas para escolher).
**Validações:** cores em hexadecimal; logo em SVG ou PNG de até 2 MB; só marca aprovada serve a um render.
**Estados:** a captura mostra "Lendo o site…" e o erro legível se o site não abrir.

## T3 — Marca (detalhe)

**Objetivo:** completar e conferir uma marca.
**Dados:** cores, fontes (arquivos), logo e símbolo, telas, pessoas, números com fonte.
**Ações:** enviar arquivos, marcar tela com dado pessoal e confirmar o tratamento (RN-14), cadastrar número com a fonte (RN-08), pré-visualizar a marca num efeito de exemplo.
**Validações:** número exige fonte; tela com dado pessoal exige confirmação; pessoa exige autorização de imagem.

## T4 — Vitrine de efeitos

**Objetivo:** escolher um efeito.
**Dados:** só o que a vitrine pode mostrar (RN-02): prévia, nome, uma linha, categoria, duração, formatos, se tem versão transparente, "quando usar".
**Ações:** filtrar por categoria, abrir, "Usar este efeito".
**Estados:** efeitos desligados ou sem licença conferida não aparecem (RN-19).

## T5 — Pedir um efeito

**Objetivo:** preencher e gerar um efeito.
**Dados:** variáveis do efeito (com rótulo e valor padrão), marca, formato, fundo (cobertura ou transparente), tipo de arquivo, cor de chave opcional, **estimativa de tempo de máquina e saldo do plano**.
**Ações:** gerar a prévia de um quadro, gerar o arquivo, baixar.
**Validações:** RN-08, RN-09, RN-12, RN-17.
**Estados:** fila (com posição), renderizando (com tempo decorrido), pronto, em revisão humana, falhou (com a mensagem).

## T6 — Filmes (lista)

**Objetivo:** acompanhar todos os filmes.
**Dados:** título, marca, formato, estado, rodadas usadas, quem pediu.
**Ações:** criar filme, abrir, cancelar.

## T7 — Filme (detalhe)

Tela em abas que acompanha o estado do filme.

- **Briefing:** as cinco respostas da entrevista (finalidade, duração, formato, tema, momento-assinatura). Ação: salvar.
- **Tema:** o quadro de temas da vitrine (só os ligados, RN-19). Ação: escolher.
- **Grade:** tabela de cenas (tempo, batidas, tela, movimento, som) e a de efeitos sonoros; erros do validador, se houver. Ações: editar, validar, **aprovar** conforme a política da equipe (RN-06). Mostra quem aprovou e quando.
- **Trilha:** ouvir a trilha gerada, ver andamento e clima. Ação: gerar de novo.
- **Rodadas:** para cada rodada, o vídeo, as folhas de quadros, as medidas e as seis notas com as correções. Ações: gerar rascunho, avaliar, gerar a versão final (RN-20).
- **Entrega:** arquivo final, registro (`LOG.md`), pendências se entregue na rodada 3. Ações: baixar, pedir exclusão.

**Validações:** não gerar rascunho com grade pendente; não passar de 3 rodadas (RN-10).

## T8 — Fila de renderização

**Objetivo:** ver e controlar as tarefas.
**Dados:** tipo, origem, estado, tempo, estimativa, erro. A camada 1 vê todas as equipes, a máquina e o uso de memória.
**Ações:** cancelar (dono da tarefa ou administrador), ver o log.
**Estados:** tarefas com tempo estourado aparecem como `timeout` com a mensagem de RN-18.

## T9 — Biblioteca de entregas

**Objetivo:** achar e baixar o que já foi feito.
**Dados:** miniatura, título, formato, duração, data, marca.
**Ações:** baixar, baixar em lote (ação governada, RN-23), pedir exclusão (RN-03).

## T10 — Importar projeto da skill

**Objetivo:** trazer para o módulo uma pasta de projeto gerada pelo agente de IA.
**Dados:** envio de um arquivo compactado.
**Ações:** importar (ação governada); mostra o que foi lido e o que falhou.

## T11 — Catálogo e recursos **[Conex Prime]**

**Objetivo:** controlar o que existe e o que cada equipe pode usar.
**Dados:** todos os efeitos e temas, estado de licença, tempo típico de render, versão da skill, recursos por equipe.
**Ações:** sincronizar o catálogo com a skill, ligar e desligar efeito, tema ou recurso (com a licença conferida registrada, RN-19), definir plano e política de aprovação de cada equipe.

## T12 — Pedidos de exclusão e revisões **[Conex Prime]**

**Objetivo:** decidir o que o cliente não pode decidir sozinho.
**Dados:** pedidos de exclusão, textos em revisão humana (RN-09), pedidos de exceção de plano.
**Ações:** autorizar ou recusar, com motivo; cada decisão vai para o registro (RN-04).

## T13 — Capacidade do servidor **[Conex Prime]**

**Objetivo:** saber se a máquina aguenta.
**Dados:** tempo médio e memória por tipo de tarefa, fila no momento, uso do mês por equipe, tarefas por hora.
**Ações:** ajustar tarefas simultâneas e janela de horário de render.

## T14 — Biblioteca de referências **[Conex Prime]**

**Objetivo:** criar efeitos e temas novos a partir de referências.
**Dados:** referências em estudo, rascunhos, provas lado a lado, estado de aprovação.
**Ações:** abrir uma referência (ação governada), aprovar a prova, publicar na biblioteca. Regra: copiar a gramática, nunca o conteúdo.
