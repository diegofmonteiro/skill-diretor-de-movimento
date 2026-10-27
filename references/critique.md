# Crítica

Dê nota de 1 a 10 a cada eixo depois de OLHAR `sheet.png` e `phone.png` e de ler `metrics.json`. Uma nota só serve se disser o que mudar, então todo eixo abaixo de 8 leva pelo menos uma linha `fix`, escrita assim: `t=4.2s · onde · problema -> mudança exata`. Corrija todas, renderize a próxima rodada e dê nota de novo. No máximo três rodadas; depois entregue a melhor e diga o que ainda ficou abaixo de 8.

Seja o diretor severo, não o autor orgulhoso. Você escreveu a linha do tempo, então sabe o que acontece; quem assiste vê uma vez, em velocidade normal, num celular, muitas vezes sem som.

## Âncoras

As medições limitam a nota: um problema medido na área de um eixo segura esse eixo em 7 ou menos até ser corrigido.

| eixo | 9-10 | 7-8 | 5-6 | abaixo de 5 |
|---|---|---|---|---|
| **gancho (hook)** | o quadro 0 já mostra o produto ou um resultado e uma linha forte; os 2 primeiros segundos levantam uma pergunta ou uma mudança | forte, mas precisa de uma batida para chegar | um título aparecendo aos poucos sobre a cor da marca | preto, uma logo ou vazio por um segundo |
| **marca (brand)** | as cores da própria marca nas proporções dela, a tipografia dela (ou a fonte embutida mais próxima), a logo real e as telas reais; parece feito pela marca | paleta certa, um elemento fora da marca | aparência "tech" genérica com a logo jogada em cima | cores erradas, interface inventada, logo só com letras |
| **movimento (motion)** | curvas por papel, chega devagar e sai limpo, todo movimento tem uma causa, um mundo contínuo | bons movimentos, um elemento robótico ou flutuante | tudo na mesma curva, esmaecer e deslizar em toda parte | tremor, saltos nas emendas, oscilação |
| **legibilidade (readability)** | cada linha parada 0,5 s + 0,3 s por palavra, legível em 360 px de largura, dentro da caixa segura, contraste AA | uma linha curta ou pequena | várias linhas ilegíveis na largura do celular | texto cortado, sob a interface da plataforma ou ilegível |
| **ritmo (pacing)** | cortes nas batidas, mudanças de layout nos compassos, momento-assinatura na queda, nenhum trecho parado acima de 3 s | uma queda de ritmo ou uma pressa | cenas todas do mesmo tamanho; um trecho morto | a música e a imagem não têm relação |
| **acabamento (polish)** | emendas limpas, recortes sem sombra cortada, bordas em pixel inteiro, efeitos nos seus quadros, um cartão final parado, nada solto | uma pequena mancha | várias manchas visíveis | quadros quebrados |

## Os problemas medidos, ligados aos eixos

| medida | eixo |
|---|---|
| tinta no quadro 0 abaixo de 3%, `first_frame_empty` | gancho |
| `line_unread`, `text_below_floor`, contraste, frame-check, zona de legenda | legibilidade |
| trecho parado mais longo acima de 3 s, `dead_stretch` | ritmo (e movimento) |
| um efeito a mais de 50 ms do seu quadro, a menos de 3 dB acima do fundo | acabamento |
| volume fora de -14 LUFS, pico verdadeiro acima de -1 | acabamento |
| carimbos de tempo irregulares, duração errada | acabamento (e um defeito: corrija primeiro) |

## O que procurar nas folhas

1. Descreva cada quadro em uma frase, como um estranho faria, nomeando cada objeto. Tudo que você teria de explicar é um problema.
2. Com as palavras cobertas, os quadros ainda contam a história?
3. Os sinais de amadorismo: texto centralizado sobre um fundo liso; uma lista de recursos como três cartões; um título sobre uma captura de tela escurecida; um painel inventado; a logo encostada num canto; todo elemento esmaecendo e subindo; laços de respiração ou flutuação; uma escala lenta que vai crescendo; a interface do produto inclinada em 3D; uma janelinha no meio de um quadro vazio.
4. As notas repetidas em `motion-rules.md`.
5. Folha do celular: dá para ler cada linha em 360 px de largura?

## scores.json

```json
{
  "hook": { "score": 8, "notes": ["quadro 0: captura da caixa de entrada + 'Caixa zerada' na tela"], "fix": [] },
  "brand": { "score": 7, "notes": ["destaque usado em duas palavras na s3"], "fix": ["t=9.1s · manchete da s3 · duas palavras em destaque -> destacar só 'meio-dia'"] },
  "motion": { "score": 9, "notes": [], "fix": [] },
  "readability": { "score": 8, "notes": [], "fix": [] },
  "pacing": { "score": 8, "notes": [], "fix": [] },
  "polish": { "score": 8, "notes": [], "fix": [] }
}
```

Os nomes dos eixos no arquivo ficam em inglês (`hook`, `brand`, `motion`, `readability`, `pacing`, `polish`) porque o script os lê assim. As notas e as correções podem ser em português.

Depois, `node scripts/critique.mjs --project <pasta> --round <n> --verdict` imprime a tabela, registra a rodada e diz PASS, FIX ou STOP. Mostre a tabela à pessoa a cada rodada.
