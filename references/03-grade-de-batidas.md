# 03 — Grade de batidas

A grade é o plano único que imagem e som leem. Ela vem antes de qualquer animação e é aprovada pela pessoa.

## Por que existe

Quando a música é escolhida depois, os cortes caem fora do tempo e o vídeo parece montado. Aqui as cenas são contadas em batidas, a trilha é sintetizada a partir das mesmas batidas e o motor do filme calcula os tempos pelo índice da batida (não somando segundos), então não há deriva.

## Formato do `grade.json`

```json
{
  "titulo": "Lançamento do plano anual",
  "bpm": 120,
  "compassos": 8,
  "batidasPorCompasso": 4,
  "cauda": 0.8,
  "clima": "impulsionado",
  "tom": "La menor",
  "assinatura": "o número cresce até 1.200 e a marca carimba",
  "marcas": { "queda": "compasso4" },
  "secoes": [
    { "nome": "abertura", "de": "compasso0", "ate": "compasso2", "energia": 0.4 },
    { "nome": "subida", "de": "compasso2", "ate": "compasso4", "energia": 0.7, "subida": true },
    { "nome": "queda", "de": "compasso4", "ate": "B32", "energia": 0.95, "queda": true }
  ],
  "cenas": [
    { "id": "abertura", "de": "B0", "ate": "compasso2", "tela": "a promessa", "movimento": "palavras saem do desfoque", "som": "tique" },
    { "id": "marca", "de": "compasso4", "ate": "B32+0.8", "tela": "logo e convite", "movimento": "carimbo e brilho", "som": "impacto" }
  ],
  "efeitos": [
    { "tipo": "impacto", "em": "queda", "evento": "a marca carimba" }
  ]
}
```

## Como escrever o tempo

| Escrita | Significa |
|---|---|
| `B12` | a batida de índice 12, contando de 0 |
| `compasso3` | o início do compasso de índice 3 (também de 0) |
| `B12+0.1` | 0,1 s depois da batida 12 |
| `queda` | uma marca nomeada em `marcas` |
| `4.5` | 4,5 segundos |

Tudo começa em 0: `compasso0` é o início e `compasso4` num filme de 4 batidas por compasso fica na batida 16. O filme dura `compassos x batidasPorCompasso x (60/bpm) + cauda`. Se a última cena não terminar nesse instante (por exemplo `B32+0.8` num filme de 8 compassos), o validador reclama.

## Regras do validador

- As cenas são contíguas: a primeira começa em 0 e cada uma começa onde a anterior terminou, até o fim do filme.
- Toda cena diz o que aparece (`tela`) e como se move (`movimento`).
- Todo efeito sonoro nomeia o evento visível que acompanha. Som sem evento na tela é som sem motivo; o validador recusa.
- Falta `assinatura`: recusa.
- `bpm` entre 60 e 180; `energia` entre 0 e 1; `clima` e `tipo` só dos valores conhecidos.

## Seções

`energia` (0 a 1) decide o que a trilha toca: abaixo de 0,3 só harmonia (o pad); a partir de 0,3 entra o chimbal; a partir de 0,45 o bumbo; a partir de 0,5 o arpejo; a partir de 0,55 o grave; a partir de 0,7 a palma. `subida: true` faz um efeito de subida durante a seção inteira; `queda: true` põe um impacto grave no começo dela. Combine uma seção com `subida` seguida de outra com `queda`: é o gesto clássico que anuncia o momento de assinatura.

## Efeitos sonoros

| Tipo | Som | Use em |
|---|---|---|
| `clique` | estalo curto de interface | botão, clique do cursor |
| `tique` | batida aguda e breve | palavra que entra, item de lista |
| `estalo` | estalo com queda de tom | card que encaixa |
| `passagem` | ruído que cruza | troca de cena, mergulho |
| `impacto` | golpe grave | carimbo, logo, assinatura |
| `brilho` | sino cristalino | brilho no logo, meta batida |
| `subida` | ruído que sobe | prelúdio de um impacto |

Use um som por papel. Trocar de som numa sequência rápida (cada item com um timbre) soa como defeito.

## Aprovação

`node scripts/grade-de-batidas.mjs --projeto <pasta>` imprime a `grade.md`: uma tabela de cenas com tempo, batidas, tela, movimento e som, mais a tabela de efeitos. Mostre-a à pessoa e espere o sim. Depois rode de novo com `--aprovada`, que fica no registro e separa tempo de trabalho de tempo de espera.

Saídas: `grade.md`, `som/batidas.json` (cada marca em segundos) e, se a pasta `filme/` existir, `filme/ativos/batidas.js`.
