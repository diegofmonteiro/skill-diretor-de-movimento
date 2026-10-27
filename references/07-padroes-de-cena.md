# 07 — Padrões de cena

Como escrever o roteiro de um filme (`filme/index.html`). O motor `filme.js` oferece o objeto `FILME`; tudo nele é função do instante, sem relógio.

## Sumário

1. Estrutura da página
2. Tempo
3. Linhas de texto: entradas e saídas
4. Câmera e movimento
5. Telas reais, cursor e carimbo
6. Fundo
7. Receitas

## 1. Estrutura da página

`filme-init.mjs` cria a página; o esqueleto é:

```html
<div id="raiz" data-largura="1920" data-altura="1080" data-duracao="16.8" data-fps="30">
  <canvas id="seda"></canvas>
  <section class="cena" id="abertura" data-inicio="B0" data-duracao="4">
    <div class="rig">
      <h1 id="l-abertura-1" class="linha-texto display" style="left:0;width:100%;text-align:center;top:42%"
          data-entra="palavras@0.2" data-sai="desfoque@3.5">A promessa em uma frase</h1>
    </div>
  </section>
  <div class="granulado-f"></div>
</div>
<script>
  const tl = gsap.timeline({ paused: true });
  FILME.seda(document.getElementById("seda"), { base: "#0F1020", cores: ["#FF5C39", "#6C5CE7"] }, tl);
  FILME.cenas(tl);     // mostra cada cena só no seu intervalo
  FILME.linhas(tl);    // entradas e saídas de todo .linha-texto
  /* ... câmera, cursor, carimbo ... */
  FILME.terminar(tl);  // confere e registra a linha do tempo
</script>
```

- Toda `<section class="cena">` tem `id` (o mesmo da grade), `data-inicio` (tempo da grade) e `data-duracao` (segundos).
- O `.rig` é o que a câmera move; elementos fixos (logo de canto, por exemplo) ficam fora dele.
- Chame `FILME.terminar(tl)` por último: ele recusa o filme se alguma linha de texto não foi ligada.

## 2. Tempo

`FILME.B(n)` é a batida n em segundos, `FILME.compasso(n)` o começo do compasso n, e `FILME.t("B12+0.1")` lê qualquer escrita da grade (`B12`, `compasso3`, `queda`, `4.5`). O cálculo usa o índice da batida, nunca soma de segundos. Em atributos HTML, escreva o tempo numa forma que `FILME.t` entenda.

## 3. Linhas de texto

Cada `.linha-texto` leva `data-entra="tipo@tempo"` e `data-sai="tipo@tempo"`. Sem as duas o filme não monta.

| Entrada | Efeito |
|---|---|
| `palavras` | cada palavra sai do desfoque, 67 ms entre elas |
| `tinta` | as palavras vão de quase apagadas à tinta cheia |
| `linha` | a linha inteira sai do desfoque |
| `letras` | letra a letra, 34 ms |
| `subir` | sobe de uma máscara (chão 0,42 em abaixo da linha) |
| `escala` | chega grande e desfocada e assenta |
| `apagar` | revela da esquerda para a direita |
| `digitar` | digita como máquina; para terminal e prompt |
| `slot` | rola por `data-opcoes="a\|b\|c"` e pousa na última |
| `contar` | conta de `data-de` a `data-ate` (`data-casas`, `data-prefixo`, `data-sufixo`, `data-duracao`) e dá uma batida de escala |
| `presente` | só acende, sem efeito |

| Saída | Efeito |
|---|---|
| `desfoque` | some desfocando (0,28 s) |
| `palavras` | as palavras somem em sequência |
| `subir` / `descer` | some deslocando 0,4 em |
| `apagar` | some da esquerda para a direita |
| `escala` | some encolhendo |
| `corte` | desaparece no instante |
| `fim` | fica até o fim do filme (só o cartão final) |

Exemplo: `data-entra="contar@B8" data-de="0" data-ate="1200" data-prefixo="R$ " data-duracao="1.4" data-sai="desfoque@compasso4"`. A entrada `contar` escreve o texto por JavaScript; o GSAP, se escrevesse, converteria "1.200" em 1,2.

## 4. Câmera e movimento

```js
FILME.camera(tl, "#abertura .rig", { t: "B2", dur: 0.8, escala: 1.4, x: -120, y: 40 });  // empurrão
FILME.voo(tl, "#painel", "B6");                  // chega de longe, de z -900, com desfoque que se resolve
FILME.mergulho(tl, "#abertura .rig", "compasso2-0.2");  // atravessa a cena para entrar na próxima
FILME.brilho(tl, "#painel .brilho-f", "B9");     // faixa de luz que cruza uma vez
```

Cada uma é uma única animação na linha do tempo: não empilhe duas câmeras no mesmo `.rig` ao mesmo tempo.

## 5. Telas reais, cursor e carimbo

Telas reais ficam em `ativos/marca/tela-N.png` e vão dentro de `.janela-f` (borda arredondada e sombra):

```html
<div class="janela-f" id="painel" style="left:12%;top:14%;width:76%;height:72%">
  <img src="ativos/marca/tela-1.png" alt="">
  <div class="brilho-f"></div>
</div>
```

O cursor (`.cursor-f`, um SVG de seta) percorre pontos e clica:

```js
FILME.cursor(tl, document.querySelector(".cursor-f"), [
  { x: 300, y: 700, t: "B8" },
  { x: 900, y: 420, t: "B10", dur: 0.7, clique: true },
]);
```

O carimbo cai grande, bate e dá o tranco: `FILME.carimbo(tl, "#selo", "queda")`. Combine com o efeito sonoro `impacto` no mesmo instante.

## 6. Fundo

`FILME.seda(canvas, { base, cores, intensidade, picos }, tl)` desenha luz em movimento como função do tempo. `picos: [{ t: "queda", valor: 0.5, dur: 0.6 }]` sobe a intensidade no momento de assinatura. As cores vêm da marca (variáveis `--fundo`, `--destaque`, `--destaque2`).

## 7. Receitas

**Abertura com promessa (4 s):** `palavras` entrando em B0+0,2, saída `desfoque` meio compasso antes do fim; seda a 0,3.

**Prova com número (2 compassos):** `contar` no centro, rótulo pequeno em `tinta` logo abaixo, câmera empurrando devagar; no fim da contagem, efeito `brilho` e `FILME.brilho`.

**Tela real com cursor:** `FILME.voo` do painel, `cursor` indo ao botão e clicando na batida, efeito `clique` no mesmo instante, câmera que empurra para o resultado.

**Fecho com carimbo:** logo com `FILME.carimbo` na marca `queda`, texto do convite com `escala`, `fim` na última linha; seda sobe a 0,5.
