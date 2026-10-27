# Diretor de Movimento

Skill que cria vídeos de motion graphics com a marca da empresa: filmes de 10 a 30 segundos e 266 efeitos prontos para encaixar em qualquer edição, com trilha original, tudo renderizado na própria máquina.

Repositório `skill-diretor-de-movimento` · skill `diretor-de-movimento` · versão 0.2.0 · uso interno da Conex Prime

## Do que se trata

Você entrega um link ou um pedido de uma linha. O agente de IA captura a logo, as cores, as fontes e as telas reais do produto da marca, planeja cada cena numa grade de batidas para você aprovar, sintetiza uma trilha e sons originais, renderiza o vídeo quadro a quadro, dá nota ao próprio resultado em seis eixos e corrige o que ficar abaixo de 8, em até três rodadas.

Dois caminhos:

- **Filme inteiro:** lançamento, demonstração animada de interface, abertura de canal ou explicativo, de 10 a 30 segundos.
- **Efeitos para um vídeo que você gravou:** cortes de B-roll e sobreposições transparentes (MOV, WebM, GIF, MP4 sobre fundo verde) para Premiere, Final Cut, DaVinci e CapCut.

Sem contas, sem chaves de API, sem música de banco, sem nada enviado para fora da máquina.

Instruções para o agente: [SKILL.md](SKILL.md). Manual para pessoas: [docs/manual.md](docs/manual.md).

## O que vem dentro

- **266 efeitos** em 10 categorias: dados (35), negócios (30), papel (29), redes sociais (28), criador de conteúdo (27), produtividade (27), explicação (26), IA (23), sistema (22) e programação (19). O catálogo está em `templates/moves/CATALOG.md` e as prévias em `gallery.html`.
- **9 temas** de filme inteiro: vidro, pasta de vidro, estúdio, interface de produto, construção de logo, monocromático, impresso retrô, marionete e colagem.
- **Cena de dispositivo em 3D** (MacBook e iPhone com a tela real da marca). Fica desligada para trabalho de cliente até a licença dos modelos ser conferida (ver `LICENCAS-DE-TERCEIROS.md`).
- **Captura de marca**, **busca de imagens livres de direitos**, **crítica automática**, **trilha sintetizada** e **verificação de regras** antes do render.
- **Módulo do aplicativo**: o caderno `modulo-laravel/` descreve como transformar a skill em módulo do aplicativo da Conex Prime.

## Estrutura

```
skill-diretor-de-movimento/
├── SKILL.md                 instruções da skill (lidas pelo agente)
├── README.md                este arquivo
├── CHANGELOG.md             histórico de versões
├── BACKLOG.md               o que ainda falta
├── LICENCAS-DE-TERCEIROS.md avisos de licença obrigatórios
├── references/              guias lidos só quando o SKILL.md manda
├── scripts/                 programas em Node, sem dependências
├── templates/
│   ├── moves/               os 266 efeitos (+ CATALOG.md e catalog/)
│   ├── themes/              os 9 temas, cada um com a sua receita
│   ├── hyperframes/         motor do filme (md.js, GSAP embutido)
│   ├── demo-brand/          marca fictícia de exemplo
│   └── remotion/            auxiliares do plano B
├── gallery.html             galeria de prévias (para abrir no navegador)
├── docs/manual.md           manual completo (fora da skill)
├── evals/                   testes de resultado e de gatilho (fora da skill)
└── modulo-laravel/          caderno para virar módulo do aplicativo (fora da skill)
```

`docs/`, `evals/` e `modulo-laravel/` não fazem parte da skill que o agente lê.

## Requisitos

| O quê | Versão | Como obter |
|---|---|---|
| Node.js | 22 ou mais novo | https://nodejs.org |
| FFmpeg e FFprobe | qualquer recente | Mac: `brew install ffmpeg`; Windows: `winget install ffmpeg`; Linux: `apt install ffmpeg` |
| HyperFrames | 0.8.188 (baixado sozinho pelo `npx`) | `node scripts/check-setup.mjs --fix` |
| Chrome para o render | baixado pelo HyperFrames | `node scripts/check-setup.mjs --fix` |
| yt-dlp | opcional | só para baixar um vídeo de referência de um link |

**Computador ARM (por exemplo a instância Oracle Ampere):** o HyperFrames não baixa o Chrome nessa arquitetura. Instale o Chromium do sistema (`sudo apt-get install -y chromium-browser`) e aponte para ele: `export HYPERFRAMES_BROWSER_PATH=$(which chromium-browser)`.

Para conferir tudo: `node scripts/check-setup.mjs`. Na primeira vez, `--fix` baixa o HyperFrames (para a pasta temporária do `npx`, sem instalar nada no sistema) e o Chrome dele.

## Como instalar

O repositório se chama `skill-diretor-de-movimento`, mas a pasta instalada precisa se chamar `diretor-de-movimento`, igual ao campo `name` do `SKILL.md`. Não mude o nome do arquivo `SKILL.md`.

**Pela pasta** (Claude Code, Hermes e agentes que leem skills do disco), clonando já com o nome certo:

```bash
git clone https://github.com/diegofmonteiro/skill-diretor-de-movimento.git ~/.claude/skills/diretor-de-movimento
node ~/.claude/skills/diretor-de-movimento/scripts/check-setup.mjs --fix
```

O repositório é privado: o `git` pede o seu login do GitHub na primeira vez (o passo a passo está em `docs/manual.md`). Para outro agente, troque `~/.claude/skills/` pela pasta de skills dele.

A skill pesa cerca de 120 MB (as prévias em vídeo dos efeitos são a maior parte), então o jeito recomendado é pela pasta, não por pacote `.skill` enviado pelo aplicativo.

## Como usar

Peça ao agente, por exemplo:

> Faça um vídeo de lançamento de 20 segundos para https://exemplo.com.br, em 9:16, com ritmo forte.

Ele faz até cinco perguntas curtas, mostra a grade de batidas (cada cena, seu tempo, o que aparece, o movimento e o som) e **espera a sua aprovação** antes de animar qualquer coisa. Depois renderiza, mostra as notas da crítica a cada rodada e entrega:

```
~/diretor-de-movimento/projects/<slug>/
  out/<slug>.mp4      o filme
  out/LOG.md          tempo total, tempo de render, custo de API, notas por rodada
  beatgrid.md         o plano que você aprovou
  brand/brand.md      a marca como foi capturada (reaproveitada na próxima vez)
  film/index.html     a composição do HyperFrames, editável
```

Para ajustar à mão, abra `film/` com `npx hyperframes preview`.

## Como atualizar

```bash
cd ~/.claude/skills/diretor-de-movimento
git pull
node scripts/check-setup.mjs
```

Antes de atualizar, leia o `CHANGELOG.md`. Para acrescentar um efeito ou tema novo, veja a seção "Como acrescentar" do `docs/manual.md`.

## Privacidade

O HyperFrames roda sempre com a telemetria desligada, sem instalar skills próprias e com as chaves de visão em nuvem removidas do ambiente. Defina `MD_ALLOW_CLOUD=1` só se quiser os recursos pagos dele.

## Licenças

A trilha e os efeitos sonoros são sintetizados do zero a cada filme. O GSAP vem embutido em `templates/hyperframes/gsap.min.js`. As fontes, os modelos e as bibliotecas de terceiros têm os seus avisos em [LICENCAS-DE-TERCEIROS.md](LICENCAS-DE-TERCEIROS.md). Logos, fontes e telas de uma marca pertencem a ela: a skill os captura para fazer o filme dessa marca, não para redistribuir.
