# Glossário da tradução para o português do Brasil

Serve para manter a mesma palavra para o mesmo conceito nos 269 efeitos, nos 9 temas e nas galerias. Ao criar ou traduzir um efeito novo, consulte esta lista antes.

## O que é traduzido e o que fica em inglês

| Traduzido | Fica literal (inglês) |
|---|---|
| nome, resumo (`oneLiner`), quando usar (`say`) de cada efeito | `id` do efeito, pastas e nomes de arquivo |
| rótulos dos campos em `data-composition-variables` | nome técnico do campo (`key`) |
| textos das galerias, dos catálogos e do quadro de temas | marcas de uso (`broll`, `overlay`), formatos, etiquetas de visual (`dark`, `paper`, `photo`, `colour`) |
| `RECIPE.md`, `THEME.md`, `STYLE.md` dos temas | blocos de código dentro das receitas |

Valores que o programa compara com texto fixo ficam literais: nomes de modo, `left`/`right`, `yes`/`no`, `red`/`green`/`accent`, `top`/`full`, nomes de glifos, `none`/`auto` e o formato `YYYY-MM-DD`.

## Termos

| Inglês | Português usado |
|---|---|
| effect / move | efeito |
| theme | tema |
| film | filme |
| shot | plano |
| beat / bar | batida / compasso |
| drop | drop (mantido) |
| hook | gancho |
| end card | cartão final |
| lower third | terço inferior |
| caption / subtitle | legenda |
| thumbnail | miniatura |
| overlay | sobreposição (a marca de uso `overlay` não muda) |
| b-roll | imagem de apoio (a marca `broll` não muda) |
| call to action / CTA | chamada para ação / botão de chamada |
| timeline | linha do tempo |
| pane / glass pane | painel de vidro |
| tile | ladrilho |
| sweep | varrido de luz |
| rack focus | foco rack |
| depth of field | profundidade de campo |
| ground | fundo |
| ink | tinta |
| accent | destaque |
| follower(s) | seguidor(es) |
| story / reel / post | story / reel / publicação |
| prompt | prompt (mantido) |
| dashboard | painel |
| pull request | pull request (mantido) |

## Regras de escrita

- Singular quando o texto fala em nome do fundador; a skill não usa "nós".
- Sem crase errada, sem anglicismo desnecessário; palavra técnica sem tradução natural (drop, prompt, pull request) fica em inglês.
- Valores padrão dos campos de texto estão em português (mapa em `docs/ferramentas-traducao/padroes.py`). Ficam em inglês só código de exemplo, nomes de pessoas e termos técnicos.
- Campos que repetem uma palavra de outro campo (frase a destacar, palavra circulada, alvo do filtro) precisam ser traduzidos juntos.

## Ferramentas de conferência

Em `docs/ferramentas-traducao/`: `extrair.py`, `validar.py` e `aplicar.py` (efeitos) e `rc_extract.py` / `rc_apply.py` (receitas). O `validar.py` compara a tradução com o original (campos, símbolos, aspas, marcadores) e `ignorar.txt` guarda os avisos já conferidos à mão. Os arquivos ficam fora do pacote `.skill`.
