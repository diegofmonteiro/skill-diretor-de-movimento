# 01 — Visão geral

## O que o módulo faz

O Estúdio de Movimento permite que uma equipe (um cliente da Conex Prime) cadastre a marca, peça efeitos de vídeo (movimentos) e produza filmes completos com a identidade dela, acompanhando cada pedido até o arquivo final. Por trás, ele chama os mesmos programas da skill `diretor-de-movimento` para renderizar.

## Para quem

| Papel | O que faz no módulo |
|---|---|
| Proprietário da equipe | tudo, inclusive apagar marcas e ver o custo de render |
| Administrador | cadastra marcas, aprova grades, baixa entregas |
| Membro | pede movimentos e filmes, acompanha e baixa o que é dele |
| Leitor | vê e baixa as entregas aprovadas |

Os papéis vêm de `TeamRole`; o módulo só decide o que cada um pode fazer neste contexto.

## Escopo

**Dentro:**

- Cadastro de marcas (cores, fontes, logo, telas, números confirmados).
- Pedido de movimento: escolher no catálogo, preencher variáveis, escolher formato e fundo, renderizar.
- Pedido de filme: briefing, grade de batidas com aprovação, trilha, roteiro, rodadas de crítica, entrega.
- Fila de renderização com estado, tempo e custo de cada tarefa.
- Biblioteca de entregas por equipe, com download.
- Importação de uma pasta de projeto gerada pela skill.

**Fora (por ora):**

- Editar o roteiro do filme dentro do aplicativo (o roteiro é escrito pelo agente de IA).
- Publicar direto em redes sociais.
- Upload de vídeo filmado ou voz.
- Cobrança por uso (o módulo registra o tempo de máquina; cobrar é decisão do núcleo).

## Glossário

| Termo | Significado |
|---|---|
| Marca | conjunto de cores, fontes, logo, telas e números de uma empresa |
| Movimento | efeito curto e independente do catálogo (2 a 6 s) |
| Filme | vídeo completo com cenas, trilha e crítica |
| Grade de batidas | plano de cenas, tempos e sons, aprovado antes de animar |
| Rodada | uma renderização do filme seguida de crítica |
| Entrega | arquivo final aprovado, com registro |
| Trabalhador de render | processo que roda os programas da skill |
| Cobertura / sobreposição | movimento em tela cheia (B-roll) ou transparente para pôr sobre outro vídeo |
