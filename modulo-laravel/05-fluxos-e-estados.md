# 05 — Fluxos e estados

## Fluxo de um efeito

```mermaid
flowchart LR
    A[Escolhe na vitrine] --> B[Preenche variáveis e formato]
    B --> C{Regras ok? RN-08, RN-09, RN-12}
    C -->|Não| B
    C -->|Revisão humana| R[Conex Prime libera ou recusa]
    R -->|Libera| D
    C -->|Sim| D{Cabe no plano? RN-17}
    D -->|Não| X[Mensagem ou pedido de exceção]
    D -->|Sim| E[Prévia de um quadro]
    E --> F{Aprovou a prévia?}
    F -->|Não| B
    F -->|Sim| G[Tarefa de render na fila]
    G --> H[Arquivo pronto]
    H --> I[Assiste na plataforma e aprova]
    I --> P[Publica nas redes do plano, RN-26 e RN-27]
    P --> Q[Registro com endereço da publicação]
```

## Fluxo de um filme

```mermaid
flowchart TD
    A[Briefing e tema] --> B[Grade de batidas]
    B --> C{Validador da skill}
    C -->|Erros| B
    C -->|Ok| D{Aprovação conforme a política da equipe}
    D -->|Não| B
    D -->|Sim| E[Trilha original]
    E --> F[Roteiro e conferência de regras]
    F --> G[Rodada em rascunho]
    G --> H[Crítica: seis notas de 1 a 10]
    H --> I{Todas as notas 8 ou mais?}
    I -->|Não, rodada < 3| F
    I -->|Sim ou rodada 3| J[Render final]
    J --> K[Conferência do arquivo]
    K --> L[Entrega com registro]
```

## Fluxo de exclusão

```mermaid
flowchart LR
    A[Cliente pede exclusão] --> B[Registro: exclusao_pedida]
    B --> C{Conex Prime decide}
    C -->|Recusa| D[Registro com motivo]
    C -->|Autoriza| E[Exclusão lógica]
    E --> F[Prazo de retenção]
    F --> G[Remoção física]
    G --> H[Registro permanece]
```

## Estados do filme (`ProjectStatus`)

```mermaid
stateDiagram-v2
    [*] --> briefing
    briefing --> grid_pending: grade gravada e válida
    grid_pending --> grid_approved: aprovação conforme a política (RN-06)
    grid_approved --> grid_pending: grade alterada
    grid_approved --> scoring: trilha solicitada
    scoring --> scripting: trilha pronta
    scripting --> critique: rodada gerada
    critique --> scripting: notas abaixo de 8 e rodada menor que 3
    critique --> delivered: aprovada ou rodada 3
    scripting --> review: texto sinalizado (RN-09)
    review --> scripting: liberado
    briefing --> cancelled
    grid_pending --> cancelled
    scripting --> cancelled
    delivered --> [*]
    cancelled --> [*]
```

## Estados de uma tarefa de render (`RenderStatus`)

```mermaid
stateDiagram-v2
    [*] --> queued
    queued --> running: trabalhador pega (um por vez)
    running --> done
    running --> failed: erro do programa
    running --> timeout: tempo estourado (RN-18)
    queued --> cancelled
    running --> cancelled
    failed --> queued: tentar de novo (mesma entrada)
    done --> [*]
    timeout --> [*]
    cancelled --> [*]
```

## Estados de um efeito (`ClipStatus`)

`queued` → `rendering` → `done`, ou `failed` (volta a `queued` ao tentar de novo), ou `review` (texto sinalizado, RN-09; sai para `queued` quando a Conex Prime libera).

## Estados de uma publicação (`PublicationStatus`)

`draft` → `scheduled` (se tiver data) → `publishing` → `published`, ou `publishing` → `failed` (tenta de novo até o limite; depois fica `failed` e abre ticket para a Conex Prime), ou `scheduled` → `cancelled`.

## Estados de um pedido de exclusão (`DeletionStatus`)

`requested` → `authorized` → `executed`, ou `requested` → `refused`.
