# A grade de batidas

O `beatgrid.json` é o plano único. A imagem (o `md.js`, por meio do `beats.js`) e o som (o `synth.mjs`, por meio de `sound/beats.json`) resolvem todos os tempos dele pelo mesmo interpretador, então um corte, a entrada de um texto e o som embaixo dela não podem se separar. Dois arquivos que guardam a mesma medida sempre se afastam; aqui existe um só.

## Escolher o andamento

Um compasso de 4 batidas a b BPM dura 240/b segundos. Escolha o BPM de modo que a duração pedida seja um número inteiro de compassos, mais uma cauda de cerca de 0,8 s para o último acorde e o cartão final:

| duração | 120 BPM (compasso 2,0 s) | 128 (1,875 s) | 100 (2,4 s) | 96 (2,5 s) |
|---|---|---|---|---|
| ~10 s | 5 compassos = 10,0 | 5 = 9,4 | 4 = 9,6 | 4 = 10,0 |
| ~15 s | 7 = 14,0 | 8 = 15,0 | 6 = 14,4 | 6 = 15,0 |
| ~20 s | 10 = 20,0 | 10 = 18,75 | 8 = 19,2 | 8 = 20,0 |
| ~30 s | 14 = 28,0 | 16 = 30,0 | 12 = 28,8 | 12 = 30,0 |

Estilo e andamento: impulsivo ou de lançamento 118 a 128, brincalhão 110 a 120, acolhedor 90 a 105, cinematográfico ou minimalista 90 a 110 (sensação de meio tempo), sombrio 95 a 110.

## Esquema

```json
{
  "title": "Lançamento Acme",
  "bpm": 120, "bars": 10, "beatsPerBar": 4, "tail": 0.8, "length": 20.8,
  "vibe": "driving",
  "key": "A minor",
  "signature": "o painel se monta sozinho na queda",
  "cues": { "drop": "bar4", "logo": "bar8" },
  "sections": [
    { "name": "intro", "from": "bar0", "to": "bar2", "energy": 0.3 },
    { "name": "build", "from": "bar2", "to": "bar4", "energy": 0.6, "riser": true },
    { "name": "drop",  "from": "bar4", "to": "bar8", "energy": 1.0, "drop": true },
    { "name": "outro", "from": "bar8", "to": "bar10", "energy": 0.45 }
  ],
  "shots": [
    { "id": "s1", "from": "B0", "to": "B8",
      "screen": "a captura real da caixa de entrada; a manchete 'Caixa zerada até o meio-dia' é digitada",
      "motion": "a câmera vai da janela inteira até o contador de não lidas; entrada palavra por palavra",
      "sound": "tick a cada palavra digitada, whoosh no corte" }
  ],
  "sfx": [
    { "type": "whoosh", "at": "B8", "event": "corte para o painel" },
    { "type": "hit", "at": "logo", "event": "a logo pousa" }
  ]
}
```

Os nomes dos campos e os valores (`driving`, `bar4`, `B8`, `whoosh`) ficam em inglês porque os scripts os leem assim. O texto livre (`title`, `signature`, `screen`, `motion`, `sound`, `event`) pode ser escrito em português.

- `vibe`: driving (impulsivo), playful (brincalhão), warm (acolhedor), cinematic (cinematográfico), minimal (minimalista), dark (sombrio). O arranjo, os acordes e a bateria do sintetizador seguem esse valor.
- `energy` de 0 a 1 por seção: abaixo de 0,3 só pad e chimbal; 0,45 entra o bumbo; 0,55 um arpejo de pluck; 0,7 a bateria completa e a palma.
- `riser: true` cresce até o fim da seção; `drop: true` põe um impacto no primeiro tempo forte dela. O momento-assinatura pertence à queda.
- `sfx.type`: click (um clique real do cursor), tick/type (texto chegando um caractere ou uma palavra por vez), pop (um chip, selo ou número pousando), whoosh (um corte, ou um cartão grande movendo-se rápido), hit (o desfecho ou a marca, UMA vez), shimmer (uma revelação), riser (termina no seu tempo). Todo efeito nomeia o `event` visível a que pertence: uma deixa numa batida em que nada muda na tela é um som sem nada que o explique.
- As cenas são contíguas, começam em 0 e terminam na duração do filme. Cada uma vira `<section id="<id da cena>" class="clip md-scene" data-start data-duration>` com exatamente os tempos que o `beatgrid.mjs` imprime.

Formato dos tempos: `B12` (batida 12), `bar3` (compasso 3, contado a partir de 0), `B12+0.1` (com deslocamento) ou o nome de uma deixa definida em `cues`.

## A tabela que a pessoa aprova

`node scripts/beatgrid.mjs --project <pasta>` imprime e grava `beatgrid.md`: uma linha por cena com o tempo, as batidas, o que aparece na tela, o movimento e o som. Mostre essa tabela e ESPERE. Nada se anima até a pessoa dizer sim; então `beatgrid.mjs --approved` registra a aprovação (o registro separa o tempo de trabalho do tempo de espera).
