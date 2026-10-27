# 04 — Crítica

Depois de cada rodada, o filme é avaliado antes de seguir. A crítica serve para pegar o que o olhar de quem fez já não enxerga.

## O processo

1. `node scripts/critica.mjs --projeto <pasta>` mede e monta `critica/rodada-N/folha.png`: 24 quadros em ordem, 6 por linha.
2. **Olhe a folha.** Abra a imagem. Não dê nota só pelos números: a medida acha trecho preto e imagem parada, mas não acha texto feio.
3. Dê o veredito: `node scripts/critica.mjs --projeto <pasta> --veredito --gancho 4 --marca 5 --movimento 4 --legibilidade 5 --ritmo 4 --acabamento 4 --nota "o logo entra tarde"`.
4. Reprovou: corrija o eixo mais fraco, renderize outra rodada, avalie de novo. Máximo de 3 rodadas.

## Regra de aprovação

Aprovada se nenhum eixo ficar abaixo de 3 e a média chegar a 4. Na rodada 3 o filme segue mesmo reprovado, mas a lista do que ficou abaixo de 4 é dita à pessoa. Insistir em rodada 4 raramente melhora e custa render.

## Os seis eixos

| Eixo | Nota 1 | Nota 3 | Nota 5 |
|---|---|---|---|
| **Gancho** | os 2 primeiros segundos não dizem nada | a promessa aparece, mas sem força | a promessa ou a imagem mais forte abre o filme |
| **Marca** | podia ser de qualquer empresa | cores e fonte certas, sem tela real | identidade clara, 3 telas reais ou mais, logo no fecho |
| **Movimento** | entradas sem curva, tudo no mesmo tempo | curvas boas, variação pouca | cada coisa se move com intenção, câmera usada com critério |
| **Legibilidade** | texto cortado, pequeno ou sobreposto | tudo legível, mas apertado | leitura sem esforço no celular |
| **Ritmo** | cortes fora da batida, cenas do mesmo tamanho | ritmo certo, monótono | tensão e alívio, assinatura no auge |
| **Acabamento** | tremor, faixas de cor, erro de português | pequenos desleixos | nada para corrigir |

## O que a medida automática acusa

| Campo em `metricas.json` | Leia como |
|---|---|
| `loudnessLUFS` | deve ficar perto de -14; longe disso o `sintetizador.mjs` não rodou ou foi mexido |
| `picoDBFS` | acima de -0,5 corre risco de estourar na plataforma |
| `trechosPretos` | confira se é intencional; se não, uma cena não montou |
| `inicioDeTrechosCongelados` | nada se moveu por mais de 1,2 s: falta movimento de fundo ou de câmera |
| `cortesPorSegundo` | muito alto cansa; muito baixo parece lento para o clima |

## Escreva a nota

A `--nota` registra em uma frase o que mais incomodou. É isso que a próxima rodada ataca; sem ela a rodada vira loteria.

## Quando a pessoa discordar

A opinião da pessoa vence a nota. Se ela gostou de algo que a crítica reprovou, registre e siga: a nota é ferramenta, não juiz.
