# 01 — Visão geral

## O que o módulo faz

O Estúdio de Movimento permite que a Conex Prime produza vídeos de motion graphics com a identidade de cada cliente e os entregue de forma controlada. Por trás, ele chama os programas da skill `diretor-de-movimento` para renderizar. Há dois produtos:

- **Efeitos (movimentos):** peças curtas de 2 a 6 segundos, escolhidas num catálogo de 266, que saem como B-roll em MP4 ou como sobreposição transparente. Rodam sem IA.
- **Filmes:** vídeos de 10 a 30 segundos, com cenas cortadas na batida de uma trilha original, plano aprovado antes de animar e crítica em rodadas. Usam um agente de IA para dirigir.

## Camadas de acesso

O módulo segue as três camadas do aplicativo e a regra de que cada nível só repassa o que recebeu.

| Camada | Quem | O que faz no módulo |
|---|---|---|
| 1. Conex Prime | o fundador e quem ele autorizar | configura o catálogo e os planos, liga e desliga recursos, autoriza exclusões, vê a fila e a capacidade, cuida das marcas e dos modelos novos. É a única camada que enxerga a inteligência (receitas, regras, código dos efeitos). |
| 2. Dono do cliente | o proprietário da equipe do cliente | libera o que os seus empregados podem pedir, cadastra a marca dele, aprova entregas, baixa o que é dele |
| 3. Empregados do cliente | gerentes e demais papéis, conforme o cargo | pedem efeitos e filmes, acompanham e baixam, dentro do que o dono liberou |

Uma quarta camada (o cliente do cliente, que acompanha e envia arquivos) está em avaliação no aplicativo; este módulo não a usa por ora.

Os papéis finos vêm de `TeamRole`; o módulo só decide o que cada um pode fazer neste contexto.

## O que o cliente compra

O cliente compra o **direito de produzir vídeos** para a empresa dele, não o aplicativo nem a inteligência. Ele nunca recebe a skill, as receitas dos temas, as regras, o código dos efeitos nem a lista completa de variáveis internas. Ele vê uma **vitrine** (prévia, nome, para que serve) e recebe o **vídeo**.

## Escopo

**Dentro:**

- Cadastro de marcas (cores, fontes, logo, telas, números confirmados) com autorização de uso registrada.
- Catálogo de efeitos sincronizado da skill, com liga/desliga por recurso e por equipe.
- Pedido de efeito: escolher, preencher variáveis, escolher formato e fundo, gerar prévia, renderizar.
- Pedido de filme: briefing, plano (grade de batidas) com aprovação, trilha, roteiro, rodadas de crítica, entrega.
- Fila de renderização com estado, tempo, custo de máquina e limites por plano.
- Biblioteca de entregas por equipe, com download autenticado.
- Registro (log) permanente de tudo o que cada pessoa pede, aprova, baixa e apaga.
- Pedido de exclusão que só se cumpre com a autorização da Conex Prime.
- Importação de uma pasta de projeto gerada pela skill.
- Criação de efeitos e temas novos a partir de referências, só na camada da Conex Prime.

**Fora (por ora):**

- Editar o roteiro do filme dentro do aplicativo (o roteiro é escrito pelo agente de IA).
- Publicar direto em redes sociais.
- Upload de vídeo filmado ou de voz.
- Cobrança por uso (o módulo registra o tempo de máquina; cobrar é decisão do núcleo).
- Cena de dispositivo 3D em trabalho de cliente, até a licença ser conferida (RN-19).

## Glossário

| Termo | Significado |
|---|---|
| Marca | conjunto de cores, fontes, logo, telas e números de uma empresa |
| Efeito ou movimento | peça curta e independente do catálogo (2 a 6 s). No código da skill, *move* |
| Filme | vídeo completo com cenas, trilha e crítica |
| Grade de batidas | plano de cenas, tempos e sons, aprovado antes de animar (`beatgrid.json`) |
| Rodada | uma renderização do filme seguida de crítica |
| Entrega | arquivo final aprovado, com registro |
| Trabalhador de render | processo que roda os programas da skill |
| Cobertura / sobreposição | efeito em tela cheia (B-roll) ou transparente para pôr sobre outro vídeo |
| Vitrine | a parte do catálogo que o cliente pode ver (prévia, nome, uso), sem a inteligência |
| Plano | os limites de uso de uma equipe (tempo de render, simultâneos, duração máxima, recursos) |
