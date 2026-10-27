# Instruções do módulo Estúdio de Movimento

## Do que se trata

Esta pasta é o caderno de instruções para construir a skill `diretor-de-movimento` como um módulo do aplicativo modular da Conex Prime (`aplicativo-modular-conexprime`). Não tem código. Ela descreve o que o módulo faz, quais dados guarda, quais telas tem, quais regras não podem ser quebradas e em que ordem construir.

O módulo se chama `MotionStudio` no código e responde na rota `/diretor-de-movimento`. Esta pasta não faz parte da skill e não entra no pacote `.skill`.

## Ordem de leitura

| Arquivo | O que tem |
|---|---|
| `01-visao-geral.md` | O que o módulo faz, para quem, papéis, escopo e glossário |
| `02-regras-de-negocio.md` | As regras que o sistema nunca pode quebrar (RN-01…) |
| `03-modelo-de-dados.md` | Tabelas, campos, listas de valores e relações |
| `04-telas.md` | As telas: objetivo, dados, ações, validações e estados |
| `05-fluxos-e-estados.md` | Diagramas do fluxo e dos estados |
| `06-integracoes.md` | Núcleo (LGPD e guard), outros módulos, n8n e importador da skill |
| `07-plano-de-construcao.md` | Fases, pedido pronto para o agente e checklist de aceite |

## Como usar quando for construir

1. Copie esta pasta para `docs/modulos/diretor-de-movimento/` no repositório do aplicativo.
2. Abra o agente de IA no repositório do aplicativo e peça:

   > Leia todos os arquivos de docs/modulos/diretor-de-movimento/ na ordem numérica. Depois construa só a Fase 1 do 07-plano-de-construcao.md. Ao terminar, me mostre o checklist de aceite da fase preenchido e pare.

3. Construa uma fase por vez.
4. Se o agente propuser algo que contradiz uma regra de `02-regras-de-negocio.md`, a regra vence. Regras vencem telas.

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

## O ponto de atenção deste módulo

Ao contrário da maioria dos módulos, este executa um **trabalho pesado fora do PHP**: renderizar vídeo exige Node 22, FFmpeg e Chrome sem interface. O caderno trata isso como um **trabalhador de render** separado do servidor web (fila própria, máquina própria), descrito em `06-integracoes.md`. A Fase 0 do plano decide onde ele roda antes de qualquer outra coisa.

## Como atualizar

As regras nascem na skill. Sempre que ela mudar: regra nova ou alterada → `02`; campo novo → `03` e a tela em `04`; registre no `CHANGELOG.md` da raiz. Se skill e caderno divergirem, corrija antes de construir.
