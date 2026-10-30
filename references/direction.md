# Direção: como fazer de cair o queixo, não só correto

Leia isto ANTES de escrever a grade de batidas. Um filme pode passar em todas as verificações e mesmo assim ser chato: tipografia correta sobre um fundo liso, capturas de tela movidas de um lado para o outro, uma coisa acontecendo a cada três segundos. As primeiras versões dos filmes de teste desta skill fizeram exatamente isso e foram recusadas como "chatas, lentas, nada de cair o queixo"; as versões reconstruídas, descritas abaixo, não foram. A diferença nunca foi acabamento. Foram estas decisões, tomadas logo no início e em números.

## 1. Três roteiros, depois um (escreva STORYLINES.md)

Rascunhe cinco ideias, cada uma um DISPOSITIVO combinado com uma FORMA; fique com as três que mais diferem; faça de uma a ousada, a que você não teria escolhido primeiro. Recomende uma em uma frase. Para cada uma escreva: o dispositivo e a forma, duas frases do que o espectador vê e sente, os 2 primeiros segundos EXATOS, as batidas em uma linha, o visual em uma linha e o som em uma linha.

| dispositivo | o que o espectador vê |
|---|---|
| um objeto atravessa o sistema | uma única coisa (uma gravação, um prompt, um comprador) percorre todas as etapas do produto |
| o resultado primeiro | o produto final toca, depois a câmera recua para mostrar de onde veio |
| uma palavra que abre mundos | uma palavra que muda (um slot, uma pílula) e cada valor abre a sua própria cena |
| a vida antes e depois | o jeito antigo se agita, o novo se move com calma e depois toma o quadro |
| um número que pousa | um número real conquistado por uma cena, depois tornado físico |
| a tipografia carrega o argumento | tipografia cinética gigante e campos de cor cortando na batida |

| forma | o que a câmera faz |
|---|---|
| uma câmera contínua | nunca corta; empurra, mergulha e viaja de um mundo para o próximo |
| cadeia de objeto em objeto | cada cena termina na coisa que abre a próxima (o cartão vira a página) |
| zoom sem fim | mergulha num detalhe que se revela o próximo mundo |
| voo por um mundo | estações num trilho ou num cenário, cada ideia uma parada |
| um quadro que se reconstrói | uma única composição que se rearranja o tempo todo |

Uma proposta em que as três opções são cortes simples entre cenas não experimentou as formas.

## 2. Adjetivos viram números (escreva SPEC.md)

```text
GOAL:    o que o espectador sente ou faz no fim, em uma frase
OUTPUT:  L x A, fps
TIME:    segundos x fps = quadros; BPM, quadros por batida; "um novo evento visual a cada batida"
LOOK:    hex do fundo sob uma seda de luz <destaque> com cristas <realce> (intensidade 0,3, 0,6 na queda);
         hex da tinta; destaque em UMA palavra por cena, como luz; fonte de título + peso + px + espaçamento;
         vidro: preenchimento a%->b% de branco, borda de 1px a 45%, desfoque 22px, sombra 0 40 90 -30 45%, brilho do destaque 35%;
         grão %, vinheta %
OBJECTS: toda coisa reconhecível, com o material que a faz ser lida sem legenda
MOTION:  entrada expo.out 0,45-0,9 s; câmera power2.inOut 0,6 s; saídas power3.in 0,25 s; escalonamento 60-90 ms;
         perspectiva 1600px, chegadas de z -900; profundidade de campo = desfoque de 7-10px fora de foco
SHOTS:   faixas de quadros, o único movimento-herói por cena, a passagem para a próxima
BANNED:  os padrões abaixo mais o que o primeiro render mostrar
QA:      os quadros a conferir e o que cada um deve mostrar
```

Os rótulos em maiúsculas ficam em inglês porque são os nomes dos campos que o fluxo espera; o conteúdo pode ser em português.

"Premium" é um material com números. "Cinematográfico" é uma lente e uma luz. "Dinâmico" é corte na batida e mudança de layout no compasso.

## 3. A lista do queixo caído (todo filme, todo item)

1. **Um mundo, não uma página.** Um fundo em movimento feito das cores da própria marca (`MD.silk`, intensidade 0,3 atrás do texto, 0,6 a 1,0 na queda) sob vidro (`.md-glass`, `.md-glass.is-light` em marcas claras). Nunca um preenchimento liso, nunca capturas de site como imagem.
2. **Uma câmera contínua.** Os rigs (`.md-rig`) se movem: entradas vindas da profundidade (`MD.fly`), empurrões para a coisa que importa (`MD.camera`), mergulhos de uma cena para a próxima (escala 2,6 a 3,4 + desfoque, power3.in), chicotadas.
3. **Algo novo a cada batida.** A 96 a 128 BPM isso é a cada 0,5 a 0,6 s: uma palavra pousa, um cartão pousa, uma barra se enche, um destaque avança, a câmera se move, a luz varre. Um quadro parado por mais de 1 s antes do cartão final é um defeito.
4. **Material real da marca, tornado físico.** As marcas dos clientes como uma parede em 3D, as miniaturas de vídeo num player de vidro, o vídeo do produto numa janela grande, ampliada na parte que se move, os números reais contados e carimbados, o próprio texto da marca como tipografia cinética. Interface reconstruída só a partir do texto e dos tokens da própria marca; nunca números inventados.
5. **O herói ocupa 40% ou mais do quadro.** Tipografia de 9 a 21% da altura do quadro para as linhas-herói. Coisas pequenas num quadro grande são o visual "chato".
6. **Profundidade de campo.** O que não é o assunto fica para trás: desfoque de 7 a 10 px, opacidade de 35 a 55%, em sintonia com a câmera.
7. **Um momento-assinatura, na queda.** A música cresce até ele (riser), o fundo fica mais forte, a câmera faz o maior movimento.
8. **A luz se move, os objetos pousam.** Uma varredura especular (`MD.sweep`) sobre um painel, uma vez, quando ele pousa; um título que pousou fica totalmente parado.
9. **Toda passagem é limpa.** A batida que sai termina exatamente quando a que entra começa; um colapso vai à opacidade 0; nada deixa fantasma.
10. **O cartão final atua.** A marca pousa no golpe único (escala 1,7 para 1 a partir de um desfoque, depois um carimbo), o nome da marca se revela na cintilação, um botão real é varrido; fica parado de 2 a 3,5 s.

## 4. PROIBIDO (cresce a cada render)

- capturas de site movidas ou ampliadas como imagem; um título sobre uma captura escurecida
- texto centralizado sobre um fundo liso ou em degradê, sem mais nada
- elementos pequenos flutuando num quadro grande e vazio; três cartões em fileira
- tudo esmaecendo e subindo; a mesma curva em tudo
- laços de respiração, flutuação ou pulso em títulos ou interface; escalas lentas que vão crescendo
- cor de destaque sobre fundo da cor de destaque (texto vermelho sobre seda vermelha some)
- ícones de banco de imagens, emoji, logos só com letras onde deveria haver uma logo, números inventados
- vidro sobre um vazio liso (parece plástico cinza); brilho em tudo
- animações de espaçamento entre letras, largura, `top` ou `left` (encaixam em pixels e tremem)
- a logo encostada num canto

Depois de cada render, nomeie todo padrão que os quadros mostram, acrescente-o aqui para o filme e corrija antes de qualquer outra coisa.

## 5. Blocos prontos do HyperFrames que vale conhecer (testados)

`npx hyperframes catalog --json` lista cerca de 450 blocos. Estes renderizam bem num notebook e são o caminho mais rápido para um momento em 3D ou de vidro líquido; instale com `hyperframes add <nome>` no filme e reescreva as cores, o texto e o conteúdo das telas para a marca (nunca entregue o conteúdo de demonstração):

| bloco | o que é | renderizado em 1080p |
|---|---|---|
| `vfx-iphone-device` | iPhone e MacBook reais em GLTF, HTML ao vivo nas telas; o `device-init.mjs` embrulha os modelos com três presets (macbook, duo, iphone) e o site real da marca na tela | 15 s em 26 s; uma cena de dispositivo de 4 s soma de 10 a 20 s ao render |
| `macos-tahoe-liquid-glass` | MacBook em 3D com uma área de trabalho e janelas de vidro | 15 s em 26 s |
| `liquid-glass-widgets` | cartões de vidro refrativo sobre um shader fluido | 8 s em 17 s |
| `glass-hero` | um objeto de vidro girando diante de uma manchete gigante | 5 s em 7 s |
| `glass-shard-title` | estilhaços de vidro entram pela névoa e formam uma manchete | |
| `parallax-device-dive` | um celular sobe, a câmera atravessa a tela dele e entra na interface | |

> Para uso comercial, confira antes a licença de cada bloco e dos modelos 3D (ver `LICENCAS-DE-TERCEIROS.md`).

### Como montar a tela do dispositivo

Coloque a tela em `<pasta>/device/`: `laptop.html` (1440x900), `phone.html` (390x844), `screen.css` e `screen.js` definindo `window.MD_SCREEN_dev(p, t)`. Preencha com material REAL: o site ao vivo capturado nessa largura (Chrome sem janela, página inteira, `--window-size=1440,5200` ou `390,7000` com `--force-device-scale-factor=2`) rolado em paradas suavizadas escolhidas para cair na própria manchete, nos números e na prova; ou o vídeo do produto como pilha de quadros (`ffmpeg -vf fps=12`, uma `<img>` por quadro, trocada conforme `t`). Monte a linha de host impressa ACIMA da seda; dê à cena o seu próprio `<section id="<id da cena>">` para qualquer linha sobre ela, posicionada acima ou ao lado do dispositivo, nunca sobre o teclado. `macbook` para um produto, `duo` (notebook e celular) para um site que funciona nos dois, `iphone` para 9:16 e marcas mobile-first. De 3 a 5 s bastam.

## 6. Padrões de pedido que elevam a qualidade de forma medida

1. "Escreva três roteiros que sejam três filmes diferentes (dispositivo x forma), faça de um o ousado e recomende um."
2. "Escreva o SPEC.md. Onde você escreveria um adjetivo, escreva um número."
3. "Nomeie todo padrão que você usou mesmo assim, acrescente-o ao PROIBIDO e corrija." (Proibir um padrão só leva o modelo ao próximo padrão; por isso a lista só cresce.)
4. "Nomeie um meio, não um humor: painéis de vidro fumê iluminados por uma borda vermelha sobre uma seda do vermelho da marca."
5. "Toda cena precisa avançar a única tarefa; apague a que não avançar."
6. "Um movimento-herói por cena; os movimentos secundários percorrem de 50 a 70% da distância e começam de 100 a 200 ms depois."
7. "Gaste a ousadia num só lugar: o momento-assinatura na queda. Antes de terminar, tire um acessório."
8. "Critique os quadros, não o código: leia a folha densa de meio em meio segundo e descreva cada quadro como um estranho faria."
9. Correções com escopo e mapeamentos fixos: "rápido demais" = deixar os movimentos de câmera em 0,7x e nada mais; "parece slides" = entrar na cena seguinte por um objeto da tela; "os títulos se mexem" = pousar e ficar parado. Termine toda correção com "não mude mais nada".
