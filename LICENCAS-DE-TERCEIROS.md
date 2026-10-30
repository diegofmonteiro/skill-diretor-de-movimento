# Licenças de terceiros

Este arquivo reúne os avisos de licença que precisam acompanhar esta skill. Ele existe para cumprir as condições dessas licenças e deve permanecer no repositório e em qualquer cópia dele. Não é necessário citá-lo no README, no manual nem nas telas do aplicativo.

Este projeto é de uso interno da Conex Prime. Conferir as licenças antes de oferecer qualquer parte dele a terceiros como código (e não apenas como vídeos entregues) é responsabilidade de quem decidir fazê-lo. Este arquivo não é parecer jurídico.

## 1. Base do projeto (licença MIT)

Boa parte do código, dos modelos e dos efeitos desta skill foi adaptada de um projeto distribuído sob a licença MIT. A licença exige que o aviso de direito autoral e o texto da permissão acompanhem as cópias e as partes substanciais do software. Aviso e texto na íntegra:

```
MIT License

Copyright (c) 2026 Sharbel

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 2. HyperFrames (licença Apache 2.0)

O motor de render (`hyperframes`) **não faz parte** deste repositório: é baixado pelo `npx`, numa versão fixa (0.8.188), na primeira vez que a skill roda. Fonte e licença: https://github.com/heygen-com/hyperframes

- Segundo a página do projeto, a licença é Apache 2.0, "sem taxa por renderização e sem limite de uso comercial". A página não trata de oferecer o programa como serviço hospedado: leia o arquivo `LICENSE` completo antes de vender um serviço que o execute.
- Se o HyperFrames, ou partes dele, passarem a ser copiados para dentro deste repositório, inclua o texto da Apache 2.0 e os avisos (`NOTICE`) dele neste arquivo.
- Os blocos do catálogo dele instalados com `hyperframes add` têm licenças próprias. Confira cada um antes de usar em trabalho de cliente.
- **Modelos 3D de celular e notebook** (bloco `vfx-iphone-device`): baixados pelo `device-init.mjs`. O original manda conferir a licença antes de uso comercial. **Uso liberado por ordem do dono em 28/10/2026**; os mantenedores do HyperFrames não foram consultados, então a liberação é decisão do dono e não uma licença de terceiros. A logo de terceiros que vem nos modelos fica escondida por padrão.

## 3. GSAP (licença padrão da GreenSock)

O arquivo `templates/hyperframes/gsap.min.js` é o GSAP 3.14.2, embutido para que o render não dependa de internet. O aviso de direito autoral está no cabeçalho do próprio arquivo, que não deve ser removido. Termos: https://gsap.com/standard-license. A licença tem restrições para quem constrói ferramentas visuais de animação; confira os termos antes de oferecer uma ferramenta desse tipo.

## 4. Fontes embutidas nos efeitos

Cada pasta de efeito que usa uma fonte traz o arquivo dela em `assets/fonts/` e a licença no `credits.json` da mesma pasta. Fontes do Google Fonts:

| Fonte | Licença |
|---|---|
| Anton, Covered By Your Grace, Gochi Hand, Great Vibes, Libre Baskerville, Playfair Display, Share Tech Mono | SIL Open Font License 1.1 |
| Permanent Marker, Special Elite | Apache License 2.0 |

A SIL OFL 1.1 permite uso e inclusão comercial, mas não permite vender a fonte isolada. Textos das licenças e dados de cada família: https://fonts.google.com

## 5. Materiais dos efeitos (fotos, texturas, modelos)

Cada efeito que usa um material externo traz um `credits.json` com o arquivo, a origem e a licença. Os materiais registrados são, na maioria, CC0 ou domínio público (Wikimedia Commons, Poly Haven https://polyhaven.com, ambientCG https://ambientcg.com, NASA). Ao criar efeitos novos, use apenas CC0 e domínio público e registre o `credits.json` (o `find-assets.mjs` faz isso).

## 6. three.js e Draco na cena de dispositivo

A cena de dispositivo 3D usa o three.js (licença MIT, https://threejs.org), os carregadores dele e o decodificador Draco do Google (licença Apache 2.0, https://github.com/google/draco). Nenhum deles está neste repositório.

- No modo de fontes `automatico`, são carregados de endereços públicos (jsDelivr e Google) na hora do render.
- Nos modos `travado` e `proprio`, os mesmos arquivos são baixados uma vez, guardados no cache com impressão digital (SHA-256) e copiados para a pasta `film/vendor/` do filme. Quem distribuir um filme com essa pasta, ou o cache, deve incluir os avisos de direito autoral e as licenças MIT e Apache 2.0 desses dois projetos.
- Os modelos 3D de MacBook e iPhone são outro assunto: ver a seção 2 (bloco `vfx-iphone-device`, uso liberado pelo dono).

## 7. Marcas de clientes

Logos, fontes e telas capturados de um site pertencem ao dono da marca. A skill os captura para fazer o filme daquela marca. Não os reutilize em outro cliente nem os redistribua. Obtenha a autorização do cliente no contrato.
