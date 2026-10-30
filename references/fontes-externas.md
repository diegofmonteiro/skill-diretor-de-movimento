# Fontes externas e modos de rede

Tudo o que a skill busca fora dela passa por um único módulo (`scripts/net.mjs`), com tempo limite, tentativas, conferência de licença e registro. Leia este arquivo quando a pessoa perguntar de onde vem um material, quiser trabalho sem internet, quiser que um filme refaça sempre igual ou quiser adicionar uma fonte própria.

## Os três modos

Escolha com `node scripts/fontes.mjs modo <nome>` (fica salvo) ou, para um comando só, com `MD_FONTES=<nome>`.

| Modo | O que faz | Quando usar |
|---|---|---|
| `automatico` (padrão) | Busca ao vivo nas fontes ligadas. Cada download também fica guardado no cache. | Dia a dia |
| `travado` | Usa primeiro a cópia local, confere a impressão digital (SHA-256) e só baixa o que falta. Com o `assets.lock.json` do projeto, o filme refaz com as mesmas entradas meses depois; arquivo alterado para a execução. | Vídeo de cliente e qualquer filme que precise refazer igual |
| `proprio` | Não usa a internet. Só os efeitos da skill, a biblioteca própria e o que já está no cache. | Trabalho sensível, servidor sem rede |

A trava garante entradas iguais, não pixels idênticos: Chrome e placa de vídeo diferentes podem mudar um detalhe do fundo em WebGL. O `assets.lock.json` registra a versão do HyperFrames, do Node, o commit do registro e o modo.

No modo `proprio`, o `brand-intake.mjs` só reaproveita uma marca que já está na biblioteca; para marca nova, mude o modo ou ponha logo, cores e telas na pasta da marca.

## Fontes que a skill conhece

| Id | Origem | O que traz | Onde é usada |
|---|---|---|---|
| `polyhaven` | Poly Haven | Modelos 3D, texturas, HDRI (CC0) | `find-assets.mjs --polyhaven` |
| `ambientcg` | ambientCG | Texturas (CC0); exige o programa `unzip` | `find-assets.mjs --ambientcg` |
| `wikimedia` | Wikimedia Commons | Fotos de objetos (CC0 e domínio público) | `find-assets.mjs "<busca>"` |
| `openverse` | Openverse | Fotos filtradas por CC0 e domínio público | `find-assets.mjs "<busca>"` |
| `bibliotecas` | jsDelivr (three.js) e Google (Draco), mais o registro de modelos do HyperFrames | Bibliotecas e modelos 3D da cena de dispositivo | `device-init.mjs`, `prop-render.mjs` |
| `marca` | YouTube (`i.ytimg.com`: miniaturas; `www.youtube.com` e `yt3.googleusercontent.com`: avatar e imagem do canal) e Simple Icons (`cdn.jsdelivr.net`) | Extras da marca do cliente | `brand-intake.mjs` |
| `catalogo` | Catálogo de efeitos do HyperFrames (`raw.githubusercontent.com`) | 210 blocos, 238 componentes e 8 exemplos para estudar e trazer | `buscar-efeitos.mjs` |
| `referencias` | Links que a pessoa indica. Pinterest direto pelo script (`pinterest.com`, `pin.it`, `pinimg.com`); YouTube, Instagram, X, Dribbble e outros pelo programa `yt-dlp`, que acessa o site por conta própria | Vídeo ou imagem de referência de estilo | `add-reference.mjs`, `ref-style.mjs` |

O `yt-dlp` (referências por link) também usa a rede por conta própria: o módulo só decide se pode ser chamado (desligado no modo `proprio` e quando a fonte `referencias` está desativada). Fora desse módulo, o HyperFrames usa a rede por conta própria (baixar o motor pelo npm, a documentação e, em x86, o Chrome dele) e a captura de marca visita o site que a pessoa indicou. São os únicos acessos que o módulo não controla.

Ligar e desligar: `node scripts/fontes.mjs ativar|desativar <id>`. O comando sem argumentos mostra o estado.

## Conferir os créditos

`node scripts/auditar-creditos.mjs` lista todo arquivo de efeito (imagem, textura, fonte, modelo) que não está no `credits.json` do efeito e todo item marcado `PENDENTE`; os `LIBERADO` (origem não documentada, uso liberado pelo dono) aparecem à parte. Rode antes de oferecer um efeito a um cliente. Código de saída 1 quando há arquivo sem registro.

## Buscar efeitos novos

`node scripts/buscar-efeitos.mjs "<palavras>"` pesquisa o catálogo de efeitos do HyperFrames. `--ver <nome>` mostra a descrição, os arquivos e a licença; `--trazer <nome> --para <pasta>` baixa os arquivos com um `credits.json`. Nada entra sozinho nos efeitos da skill: os arquivos ficam na pasta indicada, para você olhar. Para transformar o bloco em efeito, use `node scripts/converter-bloco.mjs --de <pasta> --id <id> --categoria <categoria> --nome "..." --resumo "..." --quando "..."`: ele cria `templates/moves/<id>/` com os créditos, troca o gsap da internet pela cópia embutida e deixa `"traducao": "pendente"` no `move.json` até alguém traduzir os textos do vídeo. O bloco mantém as próprias cores. Se o catálogo lista um arquivo que não existe no repositório, `--trazer` avisa e segue.

Regra de licença (decisão do dono, 28/10/2026): todos os itens podem ser trazidos. Quando o item declara licença, ela é registrada (`licenseSource: "bloco"`). Quando não declara, o registro é "Apache-2.0 (licença do repositório, não do bloco)" (`licenseSource: "repositorio"`), com um aviso: a licença do repositório pode não cobrir fonte, imagem, logo ou desenho de marca que o item traga. Itens que citam ou trazem arquivos de marca de terceiro (iOS, macOS, ChatGPT, Instagram etc.) ganham o aviso de marca. `--so-declarada` na busca mostra só os que têm licença própria. Em 28/10/2026, no commit fixo, 38 dos 210 blocos declaravam licença.

## Fonte própria

`node scripts/fontes.mjs adicionar <id> --nome "<site>" --host <site.com> --licencas CC0` registra um endereço (só os sites listados em `--host` são aceitos) e a licença que a pessoa aceita dele. Sem licença declarada, a fonte não entra. Sem adaptador, a fonte serve para baixar arquivos escolhidos à mão com `add-asset.mjs --fonte <id>`. Para buscar automaticamente em outro site, a fonte precisa de um adaptador: `node scripts/fontes.mjs adaptador <id>` cria o arquivo em `<pasta de dados>/adaptadores/<id>.mjs`, e você edita só a função `buscar`. O adaptador acessa o site pelo módulo de rede (modo, tempo limite e lista de sites valem), e todo resultado cuja licença não esteja entre as que você declarou, ou cuja imagem venha de outro site, é descartado. `find-assets.mjs` passa a buscar nessa fonte junto com as outras; `--so <id>` busca só nela.

## Material próprio

`node scripts/add-asset.mjs <arquivo|link> --nome <nome> --licenca <código> --origem "<de onde veio>"` guarda foto, textura, modelo ou fonte na biblioteca (`<pasta de dados>/biblioteca/`) com o `credits.json`. Licenças aceitas: `CC0`, `PD`, `OFL-1.1`, `APACHE-2.0`, `MIT`, `PROPRIO` e `AUTORIZADO` (exige `--autorizacao`). Material `PROPRIO` e `AUTORIZADO` nunca entra num efeito compartilhado. `--para efeito:<id>` coloca material livre dentro de um efeito. `--listar` mostra a biblioteca.

## Onde ficam os arquivos

- Escolhas: `<pasta de dados>/fontes.json` (o padrão está em `templates/fontes.padrao.json`).
- Cópias locais: `<pasta de dados>/cache/` (`node scripts/fontes.mjs cache` mostra o tamanho; `cache limpar` apaga).
- Trava do filme: `<projeto>/assets.lock.json`.
- Bibliotecas 3D copiadas para o filme nos modos `travado` e `proprio`: `<projeto>/film/vendor/` (cerca de 0,7 MB; o decodificador Draco, 0,8 MB, só entra se um modelo usar Draco, o que não acontece com o MacBook e o iPhone atuais).

## Modelos 3D de dispositivo

Os modelos vêm do bloco `vfx-iphone-device` do registro do HyperFrames (cerca de 3,5 MB: MacBook 2,5 MB, iPhone 1,0 MB). No modo `automatico` o endereço aponta para a ramificação `main`, que muda quando eles publicam. Nos modos `travado` e `proprio` aponta para um commit fixo (`registro_ref_travado` em `templates/fontes.padrao.json`; troque com `MD_REGISTRO_REF`). Os modelos trazem a logo de uma marca de terceiros como peças separadas (`apple-logo`, `apple-logo-leaf`); a skill as esconde por padrão (`--show-logo` no `device-init.mjs` as mostra). Uso liberado por ordem do dono (28/10/2026); a autorização dos mantenedores não foi pedida (`LICENCAS-DE-TERCEIROS.md`).
