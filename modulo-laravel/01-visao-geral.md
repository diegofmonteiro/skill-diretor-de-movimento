# 01 — Visão geral

## O que o módulo faz

O Estúdio de Movimento permite que a Conex Prime produza vídeos de motion graphics com a identidade de cada cliente e os entregue de forma controlada. Por trás, ele chama os programas da skill `diretor-de-movimento` para renderizar. Há dois produtos:

- **Efeitos (movimentos):** peças curtas de 2 a 6 segundos, escolhidas num catálogo de 269, que saem como B-roll em MP4 ou como sobreposição transparente. Rodam sem IA.
- **Filmes:** vídeos de 10 a 30 segundos, com cenas cortadas na batida de uma trilha original, plano aprovado antes de animar e crítica em rodadas. Usam um agente de IA para dirigir.

## Camadas de acesso

O módulo segue as três camadas do aplicativo e a regra de que cada nível só repassa o que recebeu.

| Camada | Quem | O que faz no módulo |
|---|---|---|
| 1. Conex Prime | o fundador e quem ele autorizar | configura o catálogo e os planos, liga e desliga recursos, autoriza exclusões, vê a fila e a capacidade, cuida das marcas e dos modelos novos. É a única camada que enxerga a inteligência (receitas, regras, código dos efeitos). |
| 2. Dono do cliente | o proprietário da equipe do cliente | libera o que os seus empregados podem pedir e publicar, cadastra a marca dele, conecta as redes sociais dele, aprova e publica as entregas |
| 3. Empregados do cliente | gerentes e demais papéis, conforme o cargo | pedem efeitos e filmes, acompanham e publicam, dentro do que o dono liberou |

Uma quarta camada (o cliente do cliente, que acompanha e envia arquivos) está em avaliação no aplicativo; este módulo não a usa por ora.

Os papéis finos vêm de `TeamRole`; o módulo só decide o que cada um pode fazer neste contexto.

## O que o cliente compra

O cliente compra o **direito de produzir vídeos** para a empresa dele, não o aplicativo nem a inteligência. Ele nunca recebe a skill, as receitas dos temas, as regras, o código dos efeitos nem a lista completa de variáveis internas. Ele vê uma **vitrine** (prévia, nome, para que serve) e vê o **vídeo** pronto dentro da plataforma, que o publica nas redes sociais dele. **O cliente não baixa o arquivo** (RN-25): o vídeo vive na plataforma e sai dela só para a rede social que o cliente conectou e que o plano dele permite.

## Escopo

**Dentro:**

- Cadastro de marcas (cores, fontes, logo, telas, números confirmados) com autorização de uso registrada.
- Catálogo de efeitos sincronizado da skill, com liga/desliga por recurso e por equipe.
- Pedido de efeito: escolher, preencher variáveis, escolher formato e fundo, gerar prévia, renderizar.
- Pedido de filme: briefing, plano (grade de batidas) com aprovação, trilha, roteiro, rodadas de crítica, entrega.
- Fila de renderização com estado, tempo, custo de máquina e limites por plano.
- Biblioteca de entregas por equipe, com visualização dentro da plataforma e **sem download** pelo cliente (RN-25).
- Redes sociais conectadas por equipe e publicação direta (agora ou agendada) nas redes que o plano permite (RN-26 e RN-27).
- Registro (log) permanente de tudo o que cada pessoa pede, aprova, publica e apaga.
- Camada 1 (Conex Prime) sem limites: vê e usa tudo o que a skill faz, em tela própria (T20), com a única marca de "uso interno" para itens de licença pendente (RN-28).
- Pedido de exclusão que só se cumpre com a autorização da Conex Prime.
- Importação de uma pasta de projeto gerada pela skill.
- Criação de efeitos e temas novos a partir de referências, só na camada da Conex Prime.

**Fora (por ora):**

- Editar o roteiro do filme dentro do aplicativo (o roteiro é escrito pelo agente de IA).
- Upload de vídeo filmado ou de voz.
- Anúncios (campanhas, contas de anúncios, verba e desempenho): serão um módulo próprio, depois. **Possibilidade em aberto:** este módulo poderá ser a parte gráfica e de arte dos anúncios (criativos nos tamanhos de cada canal, variações para teste), entregues ao módulo de anúncios por API interna e nunca baixados pelo cliente (RN-25). Nada disso está construído; a decisão fica para quando o módulo de anúncios for desenhado.
- Cobrança por uso (o módulo registra o tempo de máquina; cobrar é decisão do núcleo).

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
