# 06 — Motor de renderização

Como um HTML vira vídeo, e o que fazer quando algo dá errado.

## Princípio

A animação é uma linha do tempo do GSAP pausada (`window.__linhas.principal`). O renderizador abre a página no Chrome sem interface, leva a linha do tempo ao instante de cada quadro (`time(t, false)`), tira uma foto da tela e junta as fotos com o FFmpeg. Não há relógio nem tempo real em jogo, então o resultado é idêntico a cada render e não depende da velocidade do computador.

## Requisito mínimo de uma página renderizável

- Um elemento `#raiz` com `data-largura`, `data-altura`, `data-duracao` (segundos) e, opcionalmente, `data-fps` (padrão 30).
- A linha do tempo registrada em `window.__linhas.principal`, pausada. `MOV.pronto()` (movimentos) e `FILME.terminar(tl)` (filmes) fazem isso.
- Nada que dependa do relógio, de rede ou de sorte.

## Como o render é feito

1. O Chrome abre a página, espera `window.__linhas.principal` e as fontes.
2. Os quadros são divididos entre N trabalhadores (3 por padrão, até 6), cada um com seu Chrome e seu perfil temporário.
3. Cada quadro vira PNG numa pasta temporária; no fim o FFmpeg junta tudo e a pasta é apagada.
4. O áudio entra no mesmo comando do FFmpeg (`--audio`), cortado no tamanho do vídeo (`-shortest`).

## Formatos e codecs

| Formato | Codec | Transparência | Uso |
|---|---|---|---|
| `mp4` | H.264 (libx264), yuv420p | não | entrega e B-roll |
| `mov` | ProRes 4444 (prores_ks) | sim | Premiere, DaVinci, Final Cut |
| `webm` | VP9 | sim | navegador e CapCut recente |
| `gif` | paleta própria | sim | prévias leves |
| `sequencia` | PNG numerado | sim | qualquer editor |

Transparência é obtida pelo Chrome com fundo transparente (`Emulation.setDefaultBackgroundColorOverride`), por isso o movimento precisa existir em versão sem fundo (`"alfa": true`).

## Qualidade e velocidade

- `--qualidade rascunho`: CRF 26 e `-preset ultrafast`; use nas rodadas.
- `--qualidade entrega` (padrão): CRF 16 e `-preset veryfast`; só na versão final.
- `--trabalhadores N`: mais trabalhadores aceleram até o limite dos núcleos da máquina; acima disso só consomem memória.
- O que mais pesa: o fundo (seda) é redesenhado em canvas a cada quadro, e desfoques grandes (`filter: blur`) custam caro em tela grande. Em 16:9 de 17 segundos, medimos cerca de 5 minutos num ambiente de 4 núcleos sem GPU; num notebook moderno costuma ser bem menos.
- Para olhar um detalhe sem esperar, `--quadro <segundos>` grava um PNG só.

## Problemas conhecidos

| Sintoma | Causa | Solução |
|---|---|---|
| Render que nunca termina | a página devolve um objeto não serializável (a linha do tempo) ao avaliador | o renderizador já envolve a chamada numa expressão que devolve `true`; não mude |
| Número com ponto vira 1,2 em vez de 1.200 | o GSAP lê "1.200" como número | gravar o texto por JavaScript (`MOV.contar`, entrada `contar`) |
| Tremor em texto ou imagem | `Math.random`, `Date.now` ou `repeat: -1` | usar `sorteio(semente)` e repetições finitas |
| Primeiro quadro em branco | fontes ainda carregando | declarar as fontes em `marca-fontes.css` com `font-display: block` |
| "Chrome não encontrado" | caminho diferente do padrão | `DIRETOR_DE_MOVIMENTO_CHROME=/caminho/do/chrome` |
| Fundo preto em vez de transparente | MP4 não guarda transparência | usar `mov`, `webm`, `gif` ou `sequencia` |
| Imagem cortada no 9:16 | elemento fora da zona segura | rodar `auditar-quadros.mjs` e ajustar |

## Segurança do navegador

O Chrome roda sem interface, com perfil temporário apagado ao final e sem a sessão da pessoa. A página renderizada só carrega arquivos da própria pasta do projeto (`file://`).
