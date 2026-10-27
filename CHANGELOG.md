# Histórico de versões

Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e versionamento semântico.

## [Não lançado]

## [0.1.0]

Primeira versão.

### Adicionado
- Motor de renderização quadro a quadro (Chrome sem interface e FFmpeg) com saída em MP4, MOV com transparência (ProRes 4444), WebM com transparência, GIF e sequência de PNGs.
- Motor de movimentos (`MOV`) e motor de filmes (`FILME`), ambos determinísticos.
- 22 movimentos em 10 categorias, com versão transparente quando faz sentido.
- Filme completo: grade de batidas aprovada pela pessoa, trilha original sintetizada em código (-14 LUFS, -1 dBTP), montagem, verificador de regras, auditoria de quadros, renderização por rodadas, crítica com seis eixos e entrega com registro.
- Três temas: vidro, estúdio e editorial.
- Captura de marca a partir de um site, com escolha assistida do logo e das cores.
- Galeria e catálogo gerados dos movimentos.
- Verificação de ambiente e autoteste.
- Onze referências, manual, caderno `modulo-laravel/` e testes de resultado e de gatilho.

### Limitações conhecidas
- A biblioteca começa com 22 movimentos; o que falta está em `BACKLOG.md`.
- Sem personagem em 3D, sem busca de imagens e sem edição sobre vídeo filmado.
