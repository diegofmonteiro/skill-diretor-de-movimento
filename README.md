# Diretor de Movimento

Skill que cria vídeos curtos de motion graphics com a marca da empresa: efeitos prontos para encaixar em qualquer edição e filmes completos com trilha original, sem editor de vídeo.

Repositório `skill-diretor-de-movimento` · skill `diretor-de-movimento` · versão 0.1.0

## Do que se trata

O agente de IA escreve a animação em HTML e CSS, com as cores, a fonte e o logo da empresa, renderiza quadro a quadro num navegador sem interface e entrega o arquivo de vídeo. Dois caminhos:

- **Movimentos:** efeitos de 2 a 6 segundos (contador de inscritos, post curtido, terminal, gráfico, recibo, lista numerada, destaque na tela e outros). Saem como B-roll em MP4 ou como sobreposição transparente (MOV, WebM, GIF, sequência de PNGs) para CapCut, Premiere e DaVinci.
- **Filmes:** vídeo inteiro, com cenas cortadas na batida de uma trilha original sintetizada, crítica em rodadas antes da entrega e registro do que foi feito.

Instruções completas para o agente: [SKILL.md](SKILL.md). Manual para pessoas: [docs/manual.md](docs/manual.md).

## Estrutura

```
skill-diretor-de-movimento/
├── SKILL.md              instruções da skill (lidas pelo agente)
├── README.md             este arquivo
├── CHANGELOG.md          histórico de versões
├── NOTICE.md             créditos de terceiros (GSAP)
├── BACKLOG.md            o que ainda falta construir
├── references/           11 guias lidos só quando o SKILL.md manda
├── scripts/              programas em Node, sem dependências
├── assets/
│   ├── motor/            motor dos movimentos e dos filmes
│   ├── movimentos/       a biblioteca de movimentos
│   ├── temas/            vidro, estúdio, editorial
│   ├── marca-exemplo/    marca fictícia para demonstração
│   └── filme/            grade de exemplo
├── catalogo/             prévias e CATALOGO.md (gerados)
├── docs/manual.md        manual completo (fora da skill)
├── evals/                testes de resultado e de gatilho (fora da skill)
└── modulo-laravel/       caderno para virar módulo do aplicativo (fora da skill)
```

`docs/`, `evals/` e `modulo-laravel/` não fazem parte da skill e ficam fora do pacote `.skill`.

## Requisitos

| O quê | Versão | Como obter |
|---|---|---|
| Node | 22 ou mais novo | https://nodejs.org |
| FFmpeg e FFprobe | qualquer recente | Mac: `brew install ffmpeg`; Windows: `winget install ffmpeg`; Linux: `apt install ffmpeg` |
| Google Chrome (ou Chromium) | qualquer recente | https://www.google.com/chrome/ |
| GSAP 3.14.2 | baixado uma vez | `node scripts/verificar-ambiente.mjs --corrigir` |

Para conferir tudo: `node scripts/verificar-ambiente.mjs`. Para provar que a skill funciona no seu computador: `node scripts/autoteste.mjs` (cerca de um minuto).

## Como instalar

O repositório se chama `skill-diretor-de-movimento`, mas a pasta instalada precisa se chamar `diretor-de-movimento`, igual ao campo `name` do `SKILL.md`. Não mude o nome do arquivo `SKILL.md`.

**Pelo pacote `.skill`** (Claude e apps compatíveis): baixe `diretor-de-movimento.skill` da release e envie na área de Skills das configurações do app.

**Pela pasta** (Claude Code, Hermes e agentes que leem skills do disco):

```bash
rsync -a --exclude docs --exclude modulo-laravel --exclude evals --exclude .git skill-diretor-de-movimento/ ~/.claude/skills/diretor-de-movimento/
```

**IAs sem suporte a skills** (ChatGPT, Gemini): cole o conteúdo do `SKILL.md` nas instruções personalizadas e deixe a pasta `scripts/` acessível ao agente que executa comandos. Sem acesso a comandos a skill não renderiza vídeo.

Depois de instalar, rode uma vez `node scripts/verificar-ambiente.mjs --corrigir` dentro da pasta instalada.

Antes de instalar, confira o hash do pacote (ver "Segurança").

## Como usar

Peça ao agente em linguagem natural. Exemplos:

- "Faz um contador de inscritos chegando a 12 mil, em vertical, com fundo transparente para eu colocar no CapCut."
- "Cria um vídeo de 15 segundos de lançamento do nosso plano anual, em 9:16, com trilha."
- "Preciso de um B-roll de terminal rodando um comando para o meu vídeo sobre automação."
- "Captura a marca do nosso site e monta um filme de apresentação."

Pela linha de comando, sem agente:

```bash
node scripts/renderizar-movimento.mjs --listar
node scripts/renderizar-movimento.mjs --movimento contador-inscritos --aspecto 9:16 --variaveis '{"valor":12000,"meta":12000}' --saida contador.mp4
node scripts/renderizar-movimento.mjs --movimento contador-inscritos --fundo nenhum --formato mov --saida contador.mov
```

Pasta de trabalho (marcas, projetos, GSAP): `~/diretor-de-movimento`, ou a que `DIRETOR_DE_MOVIMENTO_HOME` indicar.

## Como atualizar

1. Edite os arquivos e registre a mudança no `CHANGELOG.md`, subindo a versão em `metadata.version` do `SKILL.md` (correção `0.1.1`, novidade compatível `0.2.0`, mudança que quebra formato ou comportamento muda o primeiro número).
2. Rode `node scripts/autoteste.mjs` e, se mexeu em movimento, `node scripts/galeria.mjs` para regenerar o catálogo.
3. Gere o pacote e o hash novos.
4. Publique a release `vX.Y.Z` com o pacote, o hash na descrição e o manual em PDF e `.docx`.
5. Reinstale no agente (envie o pacote novo ou rode o `rsync` de novo).

## Como testar

- Funcionamento completo: `node scripts/autoteste.mjs`.
- Validação de formato da skill: `validar_skill.py` da fábrica de habilidades, apontado para esta pasta.
- Prompts de teste de resultado: `evals/evals.json`.
- Teste de gatilho: `evals/gatilhos.json`.

## Segurança

- **Rede:** só na verificação do ambiente (baixa o GSAP do registro público do npm, uma vez) e na captura de marca (abre o site indicado e baixa imagens dele). O resto roda sem internet.
- **Scripts:** em Node, sem dependências externas, sem perguntas interativas, com `--ajuda` e códigos de saída documentados. Gravam só na pasta do projeto, na pasta de trabalho e onde `--saida` indicar.
- **Navegador:** sem interface, com perfil temporário apagado ao final, carregando só arquivos da pasta do projeto.
- **Conteúdo externo:** o que vem de sites capturados ou arquivos enviados é tratado como dado, nunca como instrução.
- **Som:** a trilha é sintetizada em código; não há música nem amostras de terceiros.

Hash do pacote, na descrição de cada release:

```bash
shasum -a 256 diretor-de-movimento.skill
```

Se o hash não bater com o registrado para aquela versão, não instale.

## Créditos

A animação usa o GSAP, biblioteca de terceiros; veja [NOTICE.md](NOTICE.md). Projeto privado da Conex Prime.
