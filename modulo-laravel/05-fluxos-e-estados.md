# 05 — Fluxos e estados

## Fluxo de um movimento

```mermaid
flowchart LR
    A[Escolhe no catálogo] --> B[Preenche variáveis e formato]
    B --> C{Regras ok? RN-04, RN-08}
    C -->|Não| B
    C -->|Sim| D[Prévia de um quadro]
    D --> E{Aprovou a prévia?}
    E -->|Não| B
    E -->|Sim| F[Tarefa de render na fila]
    F --> G[Arquivo pronto]
    G --> H[Download]
```

## Fluxo de um filme

```mermaid
flowchart TD
    A[Briefing] --> B[Grade de batidas]
    B --> C{Validador da skill}
    C -->|Erros| B
    C -->|Ok| D{Administrador aprova?}
    D -->|Não| B
    D -->|Sim| E[Trilha original]
    E --> F[Roteiro e conferência de regras]
    F --> G[Rodada em rascunho]
    G --> H[Crítica: seis notas]
    H --> I{Aprovada?}
    I -->|Não, rodada < 3| F
    I -->|Sim ou rodada 3| J[Render final]
    J --> K[Conferência do arquivo]
    K --> L[Entrega com registro]
```

## Estados do filme (`ProjectStatus`)

```mermaid
stateDiagram-v2
    [*] --> briefing
    briefing --> grid_pending: grade gravada e válida
    grid_pending --> grid_approved: administrador aprova (RN-02)
    grid_approved --> grid_pending: grade alterada
    grid_approved --> scoring: trilha solicitada
    scoring --> scripting: trilha pronta
    scripting --> critique: rodada gerada
    critique --> scripting: reprovada e rodada menor que 3
    critique --> delivered: aprovada ou rodada 3
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
    queued --> running: trabalhador pega
    running --> done
    running --> failed: erro do programa
    running --> timeout: tempo estourado (RN-11)
    queued --> cancelled
    running --> cancelled
    failed --> queued: tentar de novo (mesma entrada)
    done --> [*]
    timeout --> [*]
    cancelled --> [*]
```

## Estados de um movimento (`ClipStatus`)

`queued` → `rendering` → `done`, ou `failed` (volta a `queued` ao tentar de novo).
