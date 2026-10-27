# 07 — Plano de construção

Construa uma fase por vez. Só avance quando o checklist da fase estiver todo marcado. Antes de qualquer fase, o agente precisa ter lido os arquivos 01 a 06. Toda fase termina com: "Pare ao final e me mostre o checklist de aceite."

A ordem é pensada para entregar valor cedo: ao fim da Fase 3 já se vende o produto de **efeitos**, que não depende de IA. Os filmes (Fase 6) vêm depois.

## Fase 0 — Preparação e prova do servidor

**Pedido para o agente:**

> Leia docs/modulos/diretor-de-movimento/ inteiro. Compare a "Base técnica considerada" do README com o que o aplicativo tem hoje e me diga o que mudou. Proponha onde o módulo `MotionStudio` vai ficar seguindo o padrão dos outros módulos. Depois ajude-me a provar o trabalhador de render no servidor: instalar Node 22, FFmpeg e Chromium, definir `HYPERFRAMES_BROWSER_PATH`, rodar `node scripts/check-setup.mjs` e `node scripts/move-render.mjs --move notify-stack --quality draft`, e anotar tempo e memória. Não escreva código do módulo ainda. Pare ao final e me mostre o checklist de aceite.

**Aceite:**

- [ ] Diferenças entre a base considerada e a atual listadas
- [ ] Local do módulo decidido e aprovado
- [ ] Máquina do trabalhador decidida (Oracle para laboratório, Vultr para produção) e o render de teste rodou nela
- [ ] Tempo e memória de um efeito medidos e anotados
- [ ] Solução de recorte de fotos escolhida (`06-integracoes.md`)
- [ ] Nenhuma regra de `02` ficou impossível na base atual (ou está anotado)

## Fase 1 — Banco de dados e modelos

**Pedido para o agente:**

> Construa a Fase 1: as tabelas de 03-modelo-de-dados.md com migrations, os modelos com relacionamentos e filtro automático por equipe, os enums e as factories. A tabela de registro de auditoria só aceita inclusão. Escreva testes Pest para os relacionamentos, para o filtro por equipe e para a imutabilidade do registro. Pare ao final e me mostre o checklist de aceite.

**Aceite:**

- [ ] Todas as tabelas de `03` existem, com `team_id` e exclusão lógica (exceto camada 1 e registro de auditoria)
- [ ] Um modelo nunca devolve registro de outra equipe (teste passando)
- [ ] O registro de auditoria não pode ser alterado nem apagado (teste passando)
- [ ] Todos os enums têm rótulo em português

## Fase 2 — Catálogo e trabalhador de render

**Pedido para o agente:**

> Construa a Fase 2: a ação de sincronizar o catálogo a partir da pasta da skill (move.json, variáveis do index.html, temas), com itens novos desligados; a fila `motion-render`, o Job que cria a pasta temporária, chama os programas da skill com argumentos em lista, lê o código de saída, aplica o tempo máximo e a simultaneidade (um por vez por padrão), grava tempo e memória e guarda arquivo e log em armazenamento privado. Inclua a rota autenticada de download. Escreva testes Pest com o programa simulado (sem renderizar de verdade) para sucesso, erro, tempo estourado e idempotência. Pare e me mostre o checklist.

**Aceite:**

- [ ] Sincronização lê os efeitos e as variáveis; itens novos entram desligados (RN-19)
- [ ] Tarefa idempotente: mesma entrada não duplica arquivo nem entrega (RN-18)
- [ ] Tempo estourado encerra a tarefa e libera a fila
- [ ] Nenhum comando é montado em texto único a partir de dado do usuário
- [ ] Download só para quem é da equipe (RN-01)
- [ ] Um efeito real renderizou de ponta a ponta no servidor escolhido

## Fase 3 — Regras de negócio no servidor

**Pedido para o agente:**

> Construa a Fase 3: implemente no servidor todas as regras de 02-regras-de-negocio.md, cada uma com pelo menos um teste Pest que falha se a regra for quebrada. Pare e me mostre o checklist.

**Aceite:**

- [ ] RN-01, RN-02 e RN-05 isolamento, inteligência protegida e níveis de acesso
- [ ] RN-03 e RN-04 exclusão com autorização e registro de tudo
- [ ] RN-06 e RN-07 aprovação e validação da grade
- [ ] RN-08 número com fonte
- [ ] RN-09 conferência de texto e revisão humana
- [ ] RN-10 e RN-11 rodadas, notas e entrega conferida
- [ ] RN-12 transparência só em formato que a guarda
- [ ] RN-13 conteúdo externo como dado (teste com `<script>` e com instrução maliciosa)
- [ ] RN-14 e RN-15 dado pessoal em tela e autorização da marca
- [ ] RN-16 trilha sem direito de terceiros
- [ ] RN-17 e RN-18 plano, fila e idempotência
- [ ] RN-19 e RN-20 recursos sem licença desligados e rascunho antes do final
- [ ] RN-21 e RN-22 redundância de IA e código antes de IA
- [ ] RN-23 ações governadas (completo na Fase 5)
- [ ] RN-24 idioma e formatos

## Fase 4 — Telas

**Pedido para o agente:**

> Construa a Fase 4: as telas T1 a T14 de 04-telas.md, uma de cada vez, com os estados vazio, carregando e erro, separando o que é da camada 1 do que é do cliente. Pare e me mostre o checklist.

**Aceite:**

- [ ] T1 Painel
- [ ] T2 e T3 Marcas
- [ ] T4 e T5 Vitrine e pedido de efeito (com estimativa e saldo do plano)
- [ ] T6 e T7 Filmes
- [ ] T8 Fila e T9 Biblioteca
- [ ] T10 Importar projeto
- [ ] T11 a T14 telas da Conex Prime, invisíveis para o cliente
- [ ] Todas as telas em português do Brasil

## Fase 5 — Núcleo, API, tickets e n8n

**Pedido para o agente:**

> Construa a Fase 5: registre o módulo na camada de LGPD do núcleo conforme 06-integracoes.md, transforme em ações governadas as ações listadas, crie a API e os webhooks para o n8n, a ligação com tickets e a consulta ao módulo de conformidade (se existir). Depois rode todos os testes e me mostre uma tabela regra por regra com onde ela está garantida e qual teste a cobre.

**Aceite:**

- [ ] Dados pessoais declarados no núcleo de LGPD, com o comportamento de exclusão do titular
- [ ] Ações sensíveis passam pelo guard (teste com bloqueio)
- [ ] API e webhooks com as mesmas regras do restante
- [ ] Falha de render abre ticket
- [ ] Importador só lê JSON e copia arquivos, e lista o que falhou

## Fase 6 — Filmes com IA

**Pedido para o agente:**

> Construa a Fase 6: a interface `DiretorIA` com mais de um provedor, o fluxo do filme (briefing, tema, grade, trilha, roteiro, rodadas de crítica, entrega) conduzido pelos programas da skill, o texto do cliente sempre delimitado como dado e as aprovações humanas. Escreva testes com o provedor simulado, inclusive o caso em que todos os provedores falham. Pare e me mostre o checklist.

**Aceite:**

- [ ] Troca de provedor funciona e a falha total vai para revisão humana (RN-21)
- [ ] A IA nunca aprova, apaga nem libera nada
- [ ] Máximo de três rodadas e régua de 8 (RN-10)
- [ ] Um filme real, do briefing à entrega, feito numa equipe de teste

## Fase 7 — Revisão final

**Pedido para o agente:**

> Rode todos os testes e me mostre uma tabela com as 24 regras de 02-regras-de-negocio.md: onde cada uma está garantida e qual teste a cobre. Aponte o que ficou sem cobertura.

## Definição de pronto

- [ ] Todas as fases com checklist completo
- [ ] Todos os testes passam
- [ ] Um efeito e um filme reais, do pedido à entrega, numa equipe de teste, sem ver dados de outra equipe
- [ ] O autoteste da skill passa no trabalhador de render
- [ ] Licenças pendentes (`LICENCAS-DE-TERCEIROS.md`) conferidas ou os recursos continuam desligados
