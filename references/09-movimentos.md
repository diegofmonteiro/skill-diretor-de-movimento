# 09 — Movimentos

Um movimento é um efeito curto (2 a 6 s), independente e parametrizado, que recebe a marca da empresa. Esta referência descreve a pasta de um movimento e a API que ele usa. Para criar um novo, veja `10-novos-movimentos.md`.

## Sumário

1. Pasta de um movimento
2. O `movimento.json`
3. Variáveis e tokens da marca
4. A API `MOV`
5. Cobertura, sobreposição e chave de croma
6. Categorias do catálogo

## 1. Pasta de um movimento

```
assets/movimentos/<id>/
├── movimento.json   metadados e variáveis
├── corpo.html       a estrutura (vai dentro de #raiz)
├── estilo.css       só o estilo deste movimento
└── anima.js         a linha do tempo, usando a API MOV
```

`scripts/renderizar-movimento.mjs` monta uma pasta de trabalho com `index.html`, `ativos/` (GSAP, `movimento.js`, `movimento.css`, arquivos da marca e `marca-fontes.css`) e a entrega ao renderizador.

## 2. O `movimento.json`

| Campo | Para quê |
|---|---|
| `id` | nome da pasta, em minúsculas e hífens |
| `nome`, `umaLinha` | como aparece no catálogo |
| `categoria` | social, criador, ia, dev, produtividade, negocios, dados, papel, sistema, explicar |
| `tipo` | `efeito` |
| `usos` | `cobertura` (B-roll cheio) e/ou `sobreposicao` (sobre outro vídeo) |
| `estilos` | temas em que fica bom |
| `formatos` | `9:16`, `16:9`, `1:1`, `4:5` aceitos |
| `duracao` | segundos |
| `alfa` | `true` se existe versão transparente |
| `quando_usar` | a frase que decide a escolha: em que situação da fala ou do vídeo o efeito entra |
| `variaveis` | lista de `{id, tipo, rotulo, padrao}` |

## 3. Variáveis e tokens da marca

As variáveis do movimento (`valor`, `rotulo`, `selo`, `posicao`...) vêm de `movimento.json` e podem ser trocadas com `--variaveis '{"valor":12500}'`. Tipos: `string`, `number`, `boolean`, `color`.

Os tokens da marca ficam disponíveis em `MOV.v` e como variáveis CSS na `#raiz`:

| Token (`MOV.v`) | Variável CSS | Conteúdo |
|---|---|---|
| `nomeMarca`, `dominio`, `slogan`, `usuario`, `manchete` | | textos da marca |
| `fundoCor` | `--fundo` | cor de fundo |
| `tinta` | `--tinta` | cor do texto |
| `destaque`, `destaque2` | `--destaque`, `--destaque2` | cores de destaque |
| `superficie`, `apagado`, `papel` | `--superficie`, `--apagado`, `--papel` | cartões, texto fraco, papel |
| `fonteTitulo`, `fonteCorpo` | `--fonte-titulo`, `--fonte-corpo` | famílias |
| `logo`, `simbolo`, `telas[]`, `pessoas[]`, `numeros[]` | | arquivos e dados |
| `fundo`, `aspecto`, `chave` | | modo de fundo (`olhar` ou `nenhum`), formato, cor de chave |

Atenção: uma variável do movimento com o mesmo nome de um token da marca sobrescreve o token. Foi assim que `titulo` virou `manchete` (token) e `texto_manchete` (variável do movimento de jornal).

## 4. A API `MOV`

| Item | Para quê |
|---|---|
| `MOV.v` | variáveis e tokens |
| `MOV.L`, `MOV.A`, `MOV.u`, `MOV.retrato` | largura, altura, unidade (min(L,A)/1080) e se o quadro é vertical |
| `MOV.alfa`, `MOV.chave` | fundo transparente ou em cor de chave |
| `MOV.seguro`, `MOV.seguroSobreposicao` | caixas seguras `{topo, base, esq, dir}` |
| `MOV.tl` | a linha do tempo pausada do GSAP |
| `MOV.zona(el, posicao)` | estica `el` sobre a zona segura e alinha o conteúdo (`topo`, `centro`, `base`) |
| `MOV.ajustar(el, larguraMax, minimo)` | reduz a fonte até o texto caber |
| `MOV.numero(n, casas)` | formata no padrão brasileiro |
| `MOV.contar(el, de, ate, inicio, dur, formatar, curva)` | contador: nada antes de começar, grava o texto por JavaScript |
| `MOV.digitar(el, texto, inicio, dur, passos)` | texto letra a letra |
| `MOV.trocarTexto(el, antes, depois, instante)` | troca o texto num instante |
| `MOV.palavras(el)` | separa em palavras para animar uma a uma |
| `MOV.degraus(d)` | curva em passos para efeitos de máquina |
| `MOV.sorteio(semente)` | gerador com semente fixa (mulberry32) |
| `MOV.sair(alvo, dur)` | saída padrão: nos últimos 0,38 s tudo sobe, some e acelera |
| `MOV.imagem(src, classe)` | cria um `<img>` |
| `MOV.pronto()` | registra a linha do tempo; chame por último |

## 5. Cobertura, sobreposição e chave

- **Cobertura (`--fundo olhar`)**: o movimento ocupa o quadro com o fundo da marca (luzes desfocadas e granulado). É um B-roll.
- **Sobreposição (`--fundo nenhum`)**: sem fundo, em MOV, WebM, GIF ou sequência de PNGs com transparência, para pôr sobre outro vídeo. Os elementos de vidro ganham uma variante própria para continuarem legíveis.
- **Chave de croma (variável `chave`, por exemplo `#00ff00`)**: fundo sólido numa cor para editores sem suporte a transparência (CapCut). Escolha uma cor que a marca não usa.

## 6. Categorias do catálogo

| Categoria | Para quê |
|---|---|
| social | posts, curtidas e comentários |
| criador | contador de inscritos, legenda cinética |
| ia | execução de agente, prompt e resposta |
| dev | terminal, diff de código |
| produtividade | lista de tarefas, evento de agenda |
| negocios | cartão de plano, negócio fechado |
| dados | número grande, corrida de barras, gráfico de linha |
| papel | recibo carimbado, manchete de jornal |
| sistema | pilha de notificações, caixa de diálogo |
| explicar | lista numerada, antes e depois, destaque na tela |

A lista atual com prévias está em `catalogo/CATALOGO.md`; para regenerar: `node scripts/galeria.mjs`.
