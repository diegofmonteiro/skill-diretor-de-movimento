# Instruções do módulo Estúdio de Movimento

## Do que se trata

Esta pasta é o caderno de instruções para construir a skill `diretor-de-movimento` como um módulo do aplicativo modular da Conex Prime (`aplicativo-modular-conexprime`), para uso próprio e para oferecer o serviço de vídeo aos clientes. Não tem código. Ela descreve o que o módulo faz, que dados guarda, que telas tem, que regras não podem ser quebradas e em que ordem construir.

O módulo se chama `MotionStudio` no código e responde na rota `/diretor-de-movimento`. Esta pasta não faz parte da skill que o agente lê.

## Como o módulo se relaciona com a skill

A skill é o **motor**: ela tem os 266 efeitos, os 9 temas, a captura de marca, a crítica e o render (HyperFrames). O módulo é a **operação**: quem pede, quem aprova, quanto cabe no servidor, o que fica registrado, o que o cliente vê. O módulo nunca reescreve a inteligência da skill; ele a chama.

Regra de ouro herdada do aplicativo: **o cliente nunca vê a inteligência** (instruções, receitas, regras, código dos efeitos). Ele pede, aprova e baixa o vídeo. A inteligência fica no servidor, na pasta da skill.

## Ordem de leitura

| Arquivo | O que tem |
|---|---|
| `01-visao-geral.md` | O que o módulo faz, para quem, camadas de acesso, escopo e glossário |
| `02-regras-de-negocio.md` | As regras que o sistema nunca pode quebrar (RN-01…) |
| `03-modelo-de-dados.md` | Tabelas, campos, listas de valores e relações |
| `04-telas.md` | As telas: objetivo, dados, ações, validações e estados |
| `05-fluxos-e-estados.md` | Diagramas do fluxo e dos estados |
| `06-integracoes.md` | Trabalhador de render, servidor, IA, n8n, LGPD, guard, tickets, conformidade |
| `07-plano-de-construcao.md` | Fases, pedido pronto para o agente e checklist de aceite |

## Como usar quando for construir

1. Copie esta pasta para `docs/modulos/diretor-de-movimento/` no repositório do aplicativo (ou para a pasta do repositório de especificação, seguindo a numeração que ele já usa).
2. Abra o agente de IA no repositório do aplicativo e peça:

   > Leia todos os arquivos de docs/modulos/diretor-de-movimento/ na ordem numérica. Depois construa só a Fase 1 do 07-plano-de-construcao.md. Ao terminar, me mostre o checklist de aceite da fase preenchido e pare.

3. Construa uma fase por vez.
4. Se o agente propuser algo que contradiz uma regra de `02-regras-de-negocio.md`, a regra vence. **Regras vencem telas.**

## Base técnica considerada

Registrada em 27 de outubro de 2026, tirada da referência `referencia-laravel-starter-kit/` do aplicativo:

- Laravel 13 com PHP 8.3
- Inertia 3 com React 19 e TypeScript
- shadcn/ui (sobre Radix), Tailwind CSS 4 e ícones Lucide
- Rotas tipadas com Wayfinder
- Autenticação com Fortify
- Testes com Pest
- Equipes (`Team`, `Membership`, `TeamRole`), rotas prefixadas por `{current_team}` e protegidas por `EnsureTeamMembership`. Cada cliente da Conex Prime é uma equipe.

Se a base mudar, peça ao agente para conferir a base atual e adaptar os detalhes técnicos, mantendo as regras de negócio.

## Pontos de atenção deste módulo

1. **O render é pesado e roda fora do PHP.** Exige Node 22, FFmpeg, Chrome e o HyperFrames. O caderno trata isso como um **trabalhador de render** separado do servidor web, com fila própria, limites por plano e um render por vez em máquinas pequenas (ver `06-integracoes.md`).
2. **Servidor ARM.** Na instância Oracle (ARM), o HyperFrames não baixa o Chrome: é preciso o Chromium do sistema. A produção (Vultr, São Paulo) deve ser testada antes de prometer prazo a cliente. A Fase 0 resolve isso antes de qualquer outra coisa.
3. **Licenças pendentes.** A cena de dispositivo 3D fica desligada até a licença dos modelos ser conferida (RN-19).
4. **Código antes de IA.** Os efeitos (movimentos) rodam sem IA: são código determinístico. A IA entra só nos filmes completos, por uma camada que permite trocar de provedor (RN-21 e RN-22).

## Como atualizar

As regras nascem na skill. Sempre que ela mudar: regra nova ou alterada → `02`; campo novo → `03` e a tela em `04`; registre no `CHANGELOG.md` da raiz. Se skill e caderno divergirem, corrija antes de construir. Ao subir a versão da skill no servidor, rode o autoteste e a sincronização do catálogo (Fase 2).
