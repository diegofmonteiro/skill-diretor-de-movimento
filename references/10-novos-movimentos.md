# 10 — Criar um movimento novo

Siga esta ordem. Cada passo evita um retrabalho do seguinte.

## 1. Decida se vale a pena

Um movimento é um efeito que se repete em vários vídeos de várias marcas (um contador, um recibo). Algo que só aparece uma vez num filme é cena, não movimento: escreva-a no roteiro (`07-padroes-de-cena.md`). Antes de criar, procure em `catalogo/CATALOGO.md` se algum existente resolve com outras variáveis.

## 2. Escreva a situação de uso

A frase de `quando_usar` vem primeiro: "quando a pessoa fala X, o efeito mostra Y". Se não conseguir escrevê-la, o efeito ainda não está claro.

## 3. Crie a pasta

```
assets/movimentos/<id>/
├── movimento.json
├── corpo.html
├── estilo.css
└── anima.js
```

Use um movimento parecido como ponto de partida; os campos do `movimento.json` estão em `09-movimentos.md`.

## 4. Regras de escrita

- **Variáveis para tudo o que a pessoa pode querer mudar** (texto, número, rótulo, posição). Cada uma com `rotulo` em português claro e um `padrao` que já fica bom.
- **Padrão com sentido.** O número padrão não pode ser uma estatística que parece real; use valores redondos e neutros.
- **Cores e fontes só por variáveis CSS** (`var(--destaque)`, `var(--fonte-titulo)`), nunca valores fixos: o movimento tem de funcionar em qualquer marca, clara ou escura.
- **Unidades em `u`** (`MOV.u`), não em px: o efeito precisa servir em 9:16 e em 16:9.
- **Termine com `MOV.sair(...)` e `MOV.pronto()`**: sem saída, o último quadro corta seco; sem `pronto`, não renderiza.
- **Texto que muda por JavaScript** (`MOV.contar`, `MOV.trocarTexto`), nunca com o GSAP animando `textContent`.
- **Sem sorte nem relógio**: `MOV.sorteio(semente)` quando precisar variar.
- **Versão transparente**: se `alfa: true`, confira com `--fundo nenhum` que nada depende do fundo da marca (vidro ganha a variante `.e-alfa`).
- **Dados que dependem de arquivo da marca** (tela real, pessoa): se faltarem, falhe com mensagem clara dizendo o que enviar, como faz `destaque-na-tela`.

## 5. Confira em imagem

Renderize um quadro em cada formato aceito e olhe:

```bash
node scripts/renderizar-movimento.mjs --movimento <id> --aspecto 9:16 --quadro 1.5 --saida /tmp/a.png
node scripts/renderizar-movimento.mjs --movimento <id> --aspecto 16:9 --quadro 1.5 --saida /tmp/b.png
node scripts/renderizar-movimento.mjs --movimento <id> --fundo nenhum --formato mov --saida /tmp/c.mov
```

Olhe pelo menos três instantes (começo, meio, fim) e dois formatos. Os defeitos mais comuns: texto que quebra em 9:16, elemento fora da zona segura, número que não cabe, fundo vazando na versão transparente.

## 6. Teste com a marca de exemplo e com outra

Rode com `assets/marca-exemplo/` (escura) e com uma marca clara. Se o contraste sumir numa delas, troque as cores fixas por variáveis.

## 7. Registre

1. Regenere o catálogo: `node scripts/galeria.mjs`.
2. Anote no `CHANGELOG.md` (novidade compatível sobe o número do meio).
3. Se o movimento resolve algo do `BACKLOG.md`, risque o item.

## Armadilhas já vividas

- Uma variável com o nome de um token da marca (`titulo`) apagava o token e todos os movimentos mostravam o mesmo texto. Use nomes próprios (`texto_manchete`).
- Reescrever o `textContent` de um elemento apaga o destaque que está dentro dele; use dois irmãos (um com o texto, outro com o destaque).
- Um traço SVG com `vector-effect: non-scaling-stroke` ignora `pathLength`: o anel aparece tracejado. Anime escala e opacidade em vez de `stroke-dashoffset`.
- Um rótulo à direita de um elemento que pode estar na borda sai da tela: calcule o lado pelo espaço livre.
