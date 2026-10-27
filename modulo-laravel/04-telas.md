# 04 — Telas

Toda tela tem os estados vazio, carregando e erro. As ações respeitam os papéis de `01-visao-geral.md`. Texto de interface em português do Brasil (RN-13).

## T1 — Painel

**Objetivo:** ver o que está acontecendo na equipe.
**Dados:** tarefas na fila e em execução, últimas entregas, filmes aguardando aprovação de grade, tempo de máquina do mês.
**Ações:** abrir um filme, abrir uma entrega, pedir um movimento, criar um filme.
**Estados:** vazio mostra os dois botões "Pedir um efeito" e "Criar um filme".

## T2 — Marcas (lista e cadastro)

**Objetivo:** manter as marcas da equipe.
**Dados:** nome, cores em amostras, logo, quantidade de telas, status (rascunho ou aprovada).
**Ações:** criar marca, editar, aprovar (administrador), apagar (ação governada, RN-12), "capturar de um site" (informa o endereço; mostra os candidatos a logo e as cores vistas para escolher).
**Validações:** cores em hexadecimal; logo em SVG ou PNG de até 2 MB; só marca aprovada serve a um filme.
**Estados:** a captura mostra "Lendo o site…" enquanto roda e o erro legível se o site não abrir.

## T3 — Marca (detalhe)

**Objetivo:** completar e conferir uma marca.
**Dados:** cores, fontes (arquivos), logo e símbolo, telas, pessoas, números com fonte.
**Ações:** enviar arquivos, marcar tela com dado pessoal e confirmar o tratamento (RN-10), cadastrar número com a fonte (RN-04), pré-visualizar a marca num quadro de exemplo.
**Validações:** número exige fonte; tela com dado pessoal exige confirmação de tratamento antes de servir a um filme.

## T4 — Catálogo de movimentos

**Objetivo:** escolher um efeito.
**Dados:** prévia, nome, uma linha, categoria, duração, formatos aceitos, se tem versão transparente, "quando usar".
**Ações:** filtrar por categoria, abrir, "Usar este movimento".
**Estados:** a prévia é uma imagem; vazio não existe (o catálogo vem da skill).

## T5 — Pedir um movimento

**Objetivo:** preencher e gerar um efeito.
**Dados:** variáveis do movimento (com rótulo e valor padrão), marca, formato, fundo (cobertura ou transparente), tipo de arquivo, cor de chave opcional.
**Ações:** gerar a prévia de um quadro (tarefa `still`), gerar o arquivo, baixar.
**Validações:** RN-08 (transparência só em formato que a guarda), número com fonte (RN-04).
**Estados:** fila, renderizando (com tempo decorrido), pronto, falhou (com a mensagem).

## T6 — Filmes (lista)

**Objetivo:** acompanhar todos os filmes.
**Dados:** título, marca, formato, estado, rodadas usadas, quem pediu.
**Ações:** criar filme, abrir, cancelar.

## T7 — Filme (detalhe)

Tela em abas que acompanha o estado do filme.

- **Briefing:** as seis respostas da entrevista. Ação: salvar.
- **Grade:** tabela de cenas (tempo, batidas, tela, movimento, som) e a de efeitos sonoros; erros do validador, se houver. Ações: editar a grade (JSON ou formulário), validar, **aprovar** (administrador, RN-02). Mostra quem aprovou e quando.
- **Trilha:** ouvir a trilha gerada, ver andamento, tom e clima. Ação: gerar de novo (tarefa `score`).
- **Rodadas:** para cada rodada, o vídeo, a folha de 24 quadros, as medidas e as seis notas com a nota livre. Ações: gerar rascunho, avaliar (RN-06), gerar a versão final.
- **Entrega:** arquivo final, registro (`LOG.md`), pendências se entregue na rodada 3. Ações: baixar, entregar.

**Validações:** não gerar rascunho com grade pendente; não passar de 3 rodadas (RN-05).

## T8 — Fila de renderização

**Objetivo:** ver e controlar as tarefas.
**Dados:** tipo, origem, estado, máquina, tempo, erro.
**Ações:** cancelar (dono da tarefa ou administrador), ver o log.
**Estados:** tarefas com tempo estourado aparecem como `timeout` com a mensagem de RN-11.

## T9 — Biblioteca de entregas

**Objetivo:** achar e baixar o que já foi feito.
**Dados:** miniatura, título, formato, duração, data, marca.
**Ações:** baixar, baixar em lote (ação governada, RN-12), apagar (ação governada).

## T10 — Importar projeto da skill

**Objetivo:** trazer para o módulo uma pasta de projeto gerada pelo agente de IA.
**Dados:** envio de um arquivo compactado do projeto.
**Ações:** importar (ação governada); mostra o que foi lido (marca, grade, rodadas, entrega) e o que falhou.
