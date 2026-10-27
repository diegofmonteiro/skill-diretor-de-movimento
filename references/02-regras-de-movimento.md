# 02 — Regras de movimento

Regras de animação para os dois caminhos. Cada uma vem com o motivo, para você poder ajustá-la quando o caso pedir.

## Tempo

- **Tudo tem entrada e saída.** Elemento que aparece sem entrada parece erro; que fica sem sair se acumula e suja a tela. A única exceção é o cartão final, que sai com `fim`.
- **Entradas de 0,4 a 0,7 s, saídas de 0,22 a 0,3 s.** A saída é mais curta porque o olho já passou para a próxima coisa.
- **Nada parado por mais de 1,2 s.** Mesmo um texto estático ganha um movimento lento de fundo ou de câmera, senão o quadro parece travado. A crítica mede isso.
- **Cortes na batida.** A cena troca no tempo de uma batida da grade, nunca "mais ou menos". Use `B12`, `compasso3`, nunca segundos soltos.
- **Palavras em sequência a cada 60 a 90 ms.** Mais lento vira cerimônia; mais rápido, tudo aparece de uma vez.

## Curvas

| Situação | Curva |
|---|---|
| Algo que chega e pousa | `expo.out` ou `power3.out` |
| Algo que sai | `power3.in` |
| Ida e volta de câmera | `power2.inOut` |
| Contador de número | `power3.out` (ou `power3.inOut` quando o anel acompanha) |
| Carimbo que bate | `power4.in` na descida, sem repique |
| Mola com pouca sobra | `back.out(1.7)` a `back.out(2)`, só em selo ou ícone |

Evite `linear` fora do fundo (a seda) e de rotação contínua. Movimento linear em elemento de interface parece mecânico.

## Texto

- Tamanho mínimo na tela: 28 px em 1080 de largura. Abaixo disso é ilegível no celular; a auditoria acusa.
- Espaçamento entre letras não menor que -0,025 em: mais apertado que isso as letras se encostam.
- Sem travessão (— ou –) e sem emoji no texto da tela.
- Números no padrão brasileiro: 1.200; 3,5; R$ 49,90.
- Contraste: texto sobre fundo escuro usa a tinta da marca; sobre fundo claro, quase preto. Nunca cinza sobre cinza.
- Para revelar uma linha subindo de uma máscara, a máscara tem o chão 0,42 em abaixo da linha de base; senão corta o "g", o "y" e o brilho de uma palavra acesa.

## Quadro e zonas seguras

| Formato | Medida | Zona segura |
|---|---|---|
| 16:9 | 1920x1080 | 5% nas laterais, 6% em cima, 7% embaixo |
| 9:16 | 1080x1920 | nada nos 168 px de cima; nada abaixo de y=1330 nem na coluna da direita (162 px), onde ficam legenda e botões da rede |
| 1:1 | 1080x1080 | 5% em volta |
| 4:5 | 1080x1350 | 5% em volta |

Uma sobreposição (fundo transparente) em 9:16 respeita a zona segura da rede; um corte de cobertura (B-roll) ocupa o quadro todo, com margens iguais.

## Câmera

A câmera de um filme é um elemento `.rig` que escala e desloca dentro da cena. Um empurrão em direção a uma tela real (`FILME.camera`) dura 0,8 s e vai a 1,3x a 1,6x; mais que isso desfoca o texto. Voo (`FILME.voo`) é para a entrada de um painel, mergulho (`FILME.mergulho`) é para trocar de seção. Use no máximo uma troca grande de câmera a cada 2 compassos.

## Fundo

O fundo (a seda) se move devagar e não compete: a intensidade fica entre 0,25 e 0,35 e sobe a 0,5 só no momento de assinatura. O granulado cobre a imagem inteira em 30% e evita faixas de cor em degradês.

## Determinismo

A animação é função pura do instante. Proibido: `Math.random`, `Date.now`, `new Date`, `performance.now`, `requestAnimationFrame`, `setInterval`, `setTimeout` e `repeat: -1`. Para variar posições use `FILME.sorteio(semente)` ou `MOV.sorteio(semente)`, que dão sempre a mesma sequência.
