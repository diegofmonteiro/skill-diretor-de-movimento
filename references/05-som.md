# 05 — Som

A trilha e os efeitos são sintetizados por `scripts/sintetizador.mjs`, em código, a partir de `som/batidas.json`. Não há amostras, downloads nem música de terceiros; por isso não há problema de direito autoral, e o mesmo plano gera sempre o mesmo arquivo.

## O que ele faz

1. **Pad:** três vozes levemente desafinadas por acorde, um acorde por compasso, em progressão de quatro acordes derivada do tom (menor: i, VI, III, VII; maior: I, V, vi, IV).
2. **Grave** em colcheias, **arpejo** nas notas do acorde, **chimbal**, **bumbo** e **palma**, cada um ligado à energia da seção (limiares em `03-grade-de-batidas.md`).
3. **Subidas e quedas** nas seções marcadas.
4. **Compressão lateral:** a música cede cerca de 30% ao bumbo e ao efeito, para os efeitos aparecerem sem subir o volume.
5. **Efeitos sonoros** da grade, cada um com um instante de pico definido.
6. **Mistura** e normalização em duas passagens (mede, aplica o ganho) até -14 LUFS e -1 dBTP, valores que as plataformas de vídeo curto toleram sem recomprimir.

## Saídas

| Arquivo | O que é |
|---|---|
| `som/musica.wav`, `som/efeitos.wav` | as duas pistas, para conferir cada uma |
| `som/trilha.wav` | a mistura final normalizada |
| `filme/ativos/trilha.wav` | cópia usada no render (só se `filme/` já existir; senão `filme-init` copia) |
| `som/som.json` | efeitos com o instante do pico e a parcela de graves |

## Regras que o código segue

- **Efeito sonoro acompanha um evento visível.** A grade recusa efeito sem `evento`. Efeito sem imagem parece erro de áudio.
- **O pico cai no quadro da imagem.** O som é posto de modo que o seu pico chegue meio quadro depois do evento (1/60 s): a luz chega antes do som, e o olho percebe sincronia assim.
- **Um timbre por papel.** O mesmo `tique` em todos os itens de uma lista. Variar o timbre numa sequência rápida soa como defeito.
- **A base precisa de médios.** Se mais de 55% da energia ficar abaixo de 150 Hz, o celular não reproduz e a trilha "some". O sintetizador avisa; suba a energia das seções ou troque o clima.
- **Silêncio é recurso.** Antes de um impacto, cortar a base por meio compasso (seção de baixa energia) faz o golpe parecer maior.

## Clima e instrumentos

| Clima | O que toca |
|---|---|
| impulsionado | bumbo em todas as batidas, chimbal em colcheias, palma, arpejo em semicolcheias |
| brincalhão | bumbo, chimbal no contratempo, palma, arpejo em colcheias |
| acolhedor | bumbo a cada duas batidas, sem chimbal nem palma, pad cheio |
| cinematográfico | bumbo a cada quatro batidas, pad dominante, arpejo lento |
| mínimo | bumbo a cada duas batidas, pad leve, sem grave |
| escuro | como impulsionado, uma oitava abaixo, pad cheio |

## Conferir

```bash
ffmpeg -hide_banner -i som/trilha.wav -af ebur128=peak=true -f null - 2>&1 | grep -E "I:|Peak"
```

Esperado: cerca de -14 LUFS e pico até -1 dBFS (a leitura de pico amostrado pode ficar décimos acima do pico verdadeiro; a crítica avisa acima de -0,5).

## Quando a trilha não agrada

Ajuste na grade, não no código: troque `clima`, `tom` (qualquer nota maior ou menor, como "Sol maior"), a energia das seções ou o andamento. O gosto da pessoa decide; avise que a trilha é sintetizada e simples de propósito, para não competir com a fala e a imagem.
