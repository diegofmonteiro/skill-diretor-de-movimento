# Histórico de versões

O formato segue o [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e as versões seguem o [SemVer](https://semver.org/lang/pt-BR/).

## [0.2.0] - 2026-10-27

Troca da base: a skill passa a usar o motor HyperFrames e a biblioteca completa de 266 efeitos e 9 temas, no lugar da versão enxuta da 0.1.0.

### Adicionado
- 266 efeitos em 10 categorias, com catálogo, galeria e prévias.
- 9 temas de filme inteiro, cada um com receita.
- Captura de marca, busca de imagens livres de direitos, crítica em seis eixos, verificação de regras, trilha sintetizada, cena de dispositivo em 3D.
- `LICENCAS-DE-TERCEIROS.md` com os avisos obrigatórios.
- Caderno `modulo-laravel/` reescrito para este motor (fila, limites de servidor, aprovação do cliente, registro, guard).
- `docs/manual.md` completo.
- `evals/` com testes de resultado e de gatilho.

### Alterado
- `SKILL.md`, `README.md` e os 10 guias de `references/` traduzidos e adaptados para o português do Brasil e para o processo da Conex Prime.
- Nome interno `diretor-de-movimento` e variável `DIRETOR_DE_MOVIMENTO_HOME` no lugar do nome original.
- Marca de exemplo trocada por uma marca fictícia neutra (a original trazia fotos e telas pessoais do autor).
- GSAP 3.14.2 embutido em `templates/hyperframes/gsap.min.js`; os 269 modelos deixaram de carregá-lo de um CDN. Corrige falha de render sem internet.

### Corrigido
- Render falhava quando o servidor não alcançava o CDN do GSAP.

### Observações
- Em Linux ARM o HyperFrames não baixa o Chrome: usar `HYPERFRAMES_BROWSER_PATH` (ver README).
- O recorte de fotos (`cutout.mjs`) só funciona em Mac; ver BACKLOG.
- As prévias em vídeo (`preview.mp4`) e `gallery.jpg` ainda mostram a marca de exemplo antiga; regenerar com `node scripts/gallery.mjs` (ver BACKLOG).

## [0.1.0] - 2026-10-27

Versão inicial, com motor próprio, 22 movimentos e 3 temas. Substituída pela 0.2.0.
