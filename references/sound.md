# Som

Todo filme recebe uma trilha original e sons de interface, sintetizados em código pelo `scripts/synth.mjs` a partir da grade de batidas. Nunca baixe, amostre, imite nem "recrie" música com direitos autorais, e nunca use uma faixa cuja licença a pessoa não tenha mostrado. Se a pessoa trouxer uma faixa própria e licenciada, coloque-a em `film/assets/` como trilha, rode `npx hyperframes beats` nela para descobrir o andamento e refaça a grade nesse BPM.

## O que o sintetizador faz

- **Trilha:** acordes de pad, um arpejo de pluck, baixo, bumbo, palma e chimbal, arranjados por seção conforme a `energy`, com um riser até o fim de uma seção `riser` e um impacto numa `drop`. O bumbo "bombeia" o canal da música (sidechain), então o ritmo respira. Os acordes e a pegada da bateria seguem o `vibe` (driving, playful, warm, cinematic, minimal, dark); o `key` muda a tônica.
- **Sons de interface, um por papel:** click, tick/type, pop, whoosh, hit, shimmer, riser. Um som por papel no filme inteiro: variar a versão numa sequência rápida parece instável, não variado, e um som diferente num cartão parece erro.

## Regras

- **Um som é um evento visível, nunca uma batida.** As batidas também guiam rolagens e tempos; uma deixa onde nada muda na tela são dois sons sem motivo. Toda entrada de `sfx` nomeia o seu `event`.
- **O PICO cai no quadro.** A luz chega antes do som, então um efeito adiantado parece errado mais cedo do que um atrasado; o `synth.mjs` põe o pico de cada efeito meio quadro depois do tempo da imagem. A crítica mede isso no arquivo entregue e sinaliza o que passar de 50 ms.
- **Os efeitos ficam de 3 a 6 dB acima do fundo,** medidos ao redor de cada um, não estimados.
- **O fundo carrega médios.** Menos de cerca de 55% da energia dele abaixo de 150 Hz; do contrário não se ouve nada no alto-falante do celular. O `synth.mjs` informa essa proporção.
- **Um golpe grande,** no desfecho ou na marca.
- **Volume:** -14 LUFS integrados, pico verdadeiro de -1 dBTP ou menos (loudnorm em duas passadas). Nunca aplique um ganho copiado de outro filme; um ganho não significa nada sem os dois níveis entre os quais ele atua.
- **Diga que foi medido, não ouvido.** Quem roda esta skill não consegue ouvir; o registro de entrega diz isso.

## Níveis que a crítica confere

Volume, pico verdadeiro, o deslocamento de cada efeito em relação ao seu quadro e quanto ele sobe sobre o fundo, tudo no MP4 ENTREGUE, não no wav que entrou nele.
