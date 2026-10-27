# O HyperFrames, do jeito que esta skill o usa

O HyperFrames (licença Apache 2.0) renderiza uma página HTML em MP4: avança uma linha do tempo GSAP pausada quadro a quadro num Chrome sem janela e codifica com o FFmpeg. Chame-o sempre por `scripts/lib.mjs` (`hf(...)`) ou com o mesmo ambiente, nunca "pelado":

    HYPERFRAMES_NO_TELEMETRY=1 DO_NOT_TRACK=1 HYPERFRAMES_SKIP_SKILLS=1 \
      npx -y hyperframes@0.8.188 <comando>

e com `GEMINI_API_KEY` e `HEYGEN_API_KEY` removidas do ambiente. O porquê de cada uma:

- **versão fixa:** um filme renderiza de forma idêntica no mês que vem
- **telemetria desligada:** as renderizações da pessoa não são reportadas a ninguém
- **SKIP_SKILLS:** o `init` instalaria, do contrário, skills de agente do próprio HyperFrames na configuração do agente da pessoa, sem ela ter pedido
- **sem chaves de nuvem:** o `snapshot` roda visão do Gemini nos seus quadros por padrão sempre que `GEMINI_API_KEY` está definida, e o `capture` faz o mesmo com imagens; o `audio --quality best` envia ao serviço de vídeo e pode cobrar. Ative com `MD_ALLOW_CLOUD=1` só quando a pessoa pedir.

## Chrome em computador ARM

Em Linux ARM64 (como a instância Oracle Ampere) o HyperFrames **não baixa** o Chrome sozinho. Instale o Chromium do sistema e aponte para ele:

    sudo apt-get install -y chromium-browser    # ou: chromium
    export HYPERFRAMES_BROWSER_PATH=$(which chromium-browser)

Em x86 o `check-setup.mjs --fix` baixa o Chrome dele normalmente. Qualquer Chrome serve para a captura por tela; o chrome-headless-shell só dá o caminho mais rápido.

## GSAP embutido

Os modelos desta skill não carregam o GSAP de um endereço público: o arquivo fica em `templates/hyperframes/gsap.min.js` e é copiado para `assets/` de cada projeto e de cada efeito. Assim o render não depende de internet nem de um servidor de terceiros. Se atualizar o GSAP, troque só esse arquivo e confira a licença nova (ver `LICENCAS-DE-TERCEIROS.md`).

## O contrato (o que o `check` exige)

- Raiz: `<div id="root" data-composition-id="main" data-start="0" data-duration="N" data-width data-height data-fps="30">`.
- O registro precisa estar LITERAL na página, depois de todas as animações: `window.__timelines["main"] = tl;` (o lint lê o código-fonte; escondê-lo num auxiliar causa `missing_timeline_registry`).
- Elementos com tempo: `class="clip"`, `data-start`, `data-duration`. Um clipe aparece em `[start, start + duration)`; um estado final que pousa exatamente no fim nunca é renderizado.
- Nunca anime `display` nem `visibility` de um `.clip`; anime um filho. Nada de `transform` em CSS num elemento que o GSAP transforma.
- Só determinístico: sem `Date.now()`, `Math.random()`, temporizadores, requisições nem `repeat: -1`. O `tl.call()` funciona, mas desliga a eliminação de quadros estáticos do HyperFrames ("not seek-safe"): alterne a visibilidade com `tl.set()`, como o `md.js` faz.
- `<audio>` precisa de `id`. Os caminhos dos arquivos são relativos (`assets/...`).
- Fontes: as fontes embutidas resolvem pelo nome (Inter, Montserrat, Outfit, Nunito, Oswald, League Gothic, Archivo Black, Space Mono, IBM Plex Mono, JetBrains Mono, EB Garamond, Playfair Display, Source Code Pro, Roboto, Open Sans, Lato, Poppins). Qualquer outra precisa de `@font-face` apontando para um arquivo em `assets/`. O `film-init` escreve isso a partir das fontes capturadas da marca.

## Aviso conhecido, mantido de propósito

O `nested_structure_needs_subcomposition` avisa que uma cena `<section>` tem filhos. O HyperFrames prefere um arquivo de subcomposição por cena, para a visão de linha do tempo do Studio dele. Esta skill mantém o filme num só `index.html`, uma linha do tempo e um relógio, porque a grade de batidas é global e uma subcomposição reinicia o relógio no início do hospedeiro (e um id de hospedeiro diferente do id da cena faz cada render esperar 45 s por cena). O aviso é só estético.

## Comandos que esta skill usa

| tarefa | comando |
|---|---|
| captura da marca | `capture <url> -o <pasta> --skip-vision --max-screenshots 12 --json` |
| contrato + layout + acabamento | `check --json --at-transitions --frame-check ... [--caption-zone ...]` |
| quadros para olhar | `snapshot --at 1,3.5 --no-end --describe false -o <pasta>` |
| render | `render -o <arquivo> --quality delivery --video-frame-format png --workers 4` |
| onde os sons caem | `audio <arquivo> --json` (só qualidade local) |
| caminho do Chrome | `browser path` / `browser ensure` |

Vale ler todo round os achados de acabamento do `check`: `line_unread` (parada por pouco tempo), `dead_stretch` (3 s ou mais sem nada mudar), `text_below_floor`, `first_frame_empty`, `film_silent`.

## Custo de render

Um filme em 1080p renderiza a cerca de 3 a 4 vezes o tempo real num notebook com 4 workers. Cada worker é um Chrome (cerca de 256 MB). Caro num quadro: `backdrop-filter` (tudo bem em 1080p: os filmes de teste de vidro renderizaram 20 s de filme em cerca de 21 s; evite em 4K, onde custa cerca de 20 vezes mais), `filter: drop-shadow` em SVGs grandes e muitos desfoques simultâneos. Se um render estiver lento, apague uma propriedade por vez e meça; "4K é só lento" não é diagnóstico. Entregue em 1080p; ofereça `--resolution landscape-4k` (ou `portrait-4k`, `square-4k`) como novo render depois de aprovado.

**Para o servidor:** conte cerca de 1 GB de memória por render com 4 workers e todo o processador durante alguns minutos. Use `MD_WORKERS=2` (ou 1) em máquinas pequenas e rode um render por vez (ver `modulo-laravel/`).

## O registro

Cerca de 450 blocos se instalam como código editável com `hyperframes add <nome>`. A lista testada e os custos de render estão em `direction.md`, seção 5. Trate um bloco como matéria-prima: reescreva as cores, o texto e o conteúdo das telas para a marca e nunca entregue o conteúdo de demonstração dele.
