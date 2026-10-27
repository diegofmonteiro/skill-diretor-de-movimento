# 08 — Temas

Um tema muda a atitude visual do filme sem mexer na marca: o mesmo roteiro fica sóbrio num tema e agressivo em outro. A marca (cores, fonte, logo) é sempre a da empresa; o tema decide fundo, painéis e peso da tipografia.

## Temas incluídos

| Tema | Atitude | Fundo | Use em |
|---|---|---|---|
| `vidro` (padrão) | luz em movimento e painéis de vidro fosco | escuro | produto digital, IA, aplicativo |
| `estudio` | cor chapada, tipografia enorme, sombra dura | cor da marca | promoção, lançamento, varejo |
| `editorial` | papel claro, títulos serifados, filetes finos | claro | consultoria, conteúdo, serviço |

Escolha ao montar o filme: `node scripts/filme-init.mjs --projeto <pasta> --tema estudio`. O tema vira `filme/ativos/tema.css`, carregado depois do `filme.css`.

## Estrutura de um tema

```
assets/temas/<id>/
├── tema.json     id, nome, umaLinha, fundo, usos
├── tema.css      só o que muda: variáveis e classes do motor
└── RECEITA.md    quando usar, como compor, o que evitar
```

## O que um tema pode mudar

- Variáveis na `#raiz`: `--peso-titulo`, e as da marca se precisar (`--fundo`, `--papel`).
- Classes do motor: `.display`, `.vidro-f`, `.janela-f`, `.rotulo-f`, `.acento`, `#seda`.
- Não mude `.cena`, `.rig` nem `.linha-texto`: o motor depende delas.

## Criar um tema novo

1. Copie a pasta de um tema parecido para `assets/temas/<novo>/` (nome em minúsculas, sem acento).
2. Mude `tema.css` e confira em dois formatos (16:9 e 9:16) com o `autoteste` e um filme de exemplo.
3. Escreva a `RECEITA.md`: quando usar, composição, o que evitar.
4. Teste com a marca de exemplo e com uma marca clara e uma escura: um tema que só funciona numa cor de fundo é um tema com defeito.
5. Registre no `CHANGELOG.md`.

Regra de ouro: um tema novo deve ser reconhecível em um quadro, sem o logo.
