# 07 — Plano de construção

Construa uma fase por vez. Só avance quando o checklist da fase estiver todo marcado. Antes de qualquer fase, o agente precisa ter lido os arquivos 01 a 06.

## Fase 0 — Preparação

**Pedido para o agente:**

> Leia docs/modulos/diretor-de-movimento/ inteiro. Compare a "Base técnica considerada" do README com o que o aplicativo tem hoje. Me diga o que mudou, proponha onde o módulo `MotionStudio` vai ficar seguindo o padrão dos outros módulos e proponha onde o trabalhador de render vai rodar (máquina ou contêiner com Node 22, FFmpeg, Chrome e a skill instalada). Não escreva código ainda. Pare ao final e me mostre o checklist de aceite.

**Aceite:**

- [ ] Diferenças entre a base considerada e a atual listadas
- [ ] Local do módulo decidido e aprovado
- [ ] Local do trabalhador de render decidido e aprovado
- [ ] Nenhuma regra de `02` ficou impossível na base atual (ou está anotado)

## Fase 1 — Banco de dados e modelos

**Pedido para o agente:**

> Construa a Fase 1: as tabelas de 03-modelo-de-dados.md com migrations, os modelos com relacionamentos e filtro automático por equipe, os enums e as factories. Escreva testes Pest para os relacionamentos e para o filtro por equipe. Pare ao final e me mostre o checklist de aceite.

**Aceite:**

- [ ] Todas as tabelas de `03` existem, com `team_id` e exclusão lógica
- [ ] Um modelo nunca devolve registro de outra equipe (teste passando)
- [ ] Todos os enums têm rótulo em português

## Fase 2 — Trabalhador de render

**Pedido para o agente:**

> Construa a Fase 2: a fila `motion-render`, o Job que cria a pasta temporária, chama os programas da skill com argumentos em lista, lê o código de saída, aplica o limite de tempo e de simultaneidade por equipe e grava arquivo e log em disco privado. Inclua a rota autenticada de download. Escreva testes Pest com o programa simulado (sem renderizar de verdade) para sucesso, erro, tempo estourado e idempotência. Pare e me mostre o checklist.

**Aceite:**

- [ ] Tarefa idempotente: mesma entrada não duplica arquivo nem entrega (RN-11)
- [ ] Tempo estourado encerra a tarefa e libera a fila
- [ ] Nenhum comando é montado em texto único a partir de dado do usuário
- [ ] Download só para quem é da equipe (RN-01)

## Fase 3 — Regras de negócio no servidor

**Pedido para o agente:**

> Construa a Fase 3: implemente no servidor todas as regras de 02-regras-de-negocio.md, cada uma com pelo menos um teste Pest que falha se a regra for quebrada. Pare e me mostre o checklist.

**Aceite:**

- [ ] RN-01 isolamento por equipe, testado por todas as rotas
- [ ] RN-02 e RN-03 aprovação e validação da grade
- [ ] RN-04 número com fonte
- [ ] RN-05 e RN-06 rodadas e notas
- [ ] RN-07 entrega só com arquivo conferido
- [ ] RN-08 transparência só em formato que a guarda
- [ ] RN-09 conteúdo externo como dado (teste com `<script>` e com instrução maliciosa)
- [ ] RN-10 dado pessoal em tela
- [ ] RN-11 idempotência e limites
- [ ] RN-12 ações governadas (completo na Fase 5)
- [ ] RN-13 idioma e formatos
- [ ] RN-14 trilha sem direito de terceiros

## Fase 4 — Telas

**Pedido para o agente:**

> Construa a Fase 4: as telas T1 a T10 de 04-telas.md, uma de cada vez, com os estados vazio, carregando e erro. Pare e me mostre o checklist.

**Aceite:**

- [ ] T1 Painel
- [ ] T2 e T3 Marcas
- [ ] T4 e T5 Catálogo e pedido de movimento
- [ ] T6 e T7 Filmes (briefing, grade, trilha, rodadas, entrega)
- [ ] T8 Fila
- [ ] T9 Biblioteca de entregas
- [ ] T10 Importar projeto
- [ ] Todas as telas em português do Brasil

## Fase 5 — Núcleo, API, importador e revisão final

**Pedido para o agente:**

> Construa a Fase 5: registre o módulo na camada de LGPD do núcleo conforme 06-integracoes.md, transforme em ações governadas as ações listadas, crie a API para o n8n e o webhook de saída, e construa o importador da skill. Depois rode todos os testes e me mostre uma tabela regra por regra com onde ela está garantida e qual teste a cobre.

**Aceite:**

- [ ] Dados pessoais declarados no núcleo de LGPD, com o comportamento de exclusão do titular
- [ ] Ações sensíveis passam pelo guard (teste com bloqueio)
- [ ] API e webhook com as mesmas regras do restante
- [ ] Importador só lê JSON e copia arquivos, e lista o que falhou
- [ ] Tabela final com todas as regras, local e teste

## Definição de pronto

- [ ] Todas as fases com checklist completo
- [ ] Todos os testes passam
- [ ] Um filme real, do briefing à entrega, feito numa equipe de teste, sem ver dados de outra equipe
- [ ] O autoteste da skill passa no trabalhador de render
