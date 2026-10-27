# Plano B com Remotion

O HyperFrames é o padrão e não precisa de nada instalado além do Node e do FFmpeg. Use o Remotion SÓ quando a pessoa já tem um projeto Remotion funcionando e quer o filme dentro dele. Nunca instale o Remotion para ela.

## Detectar

- `new-project.mjs ... --remotion <caminho>` recusa, a menos que o `<caminho>/package.json` tenha a dependência `remotion`.
- Tudo até a grade de batidas é idêntico: entrevista, captura da marca, estilo de referência, grade de batidas, aprovação, síntese. Só a construção e o render mudam.

## Construir

1. Copie `templates/remotion/src/md.tsx` para o `src/` dela e o `sound/beats.json` do projeto ao lado, como `beats.json`. Copie `brand/shots`, `brand/logo.*` e `sound/score.wav` para o `public/` dela.
2. Uma composição, `durationInFrames = Math.ceil(length * fps) + 3` (o truncamento de int() deixa um último quadro preto; a margem é de graça). Os ids de composição não podem ter sublinhado.
3. Cada cena é um `<Sequence from={round(a*fps)} durationInFrames=...>`; cada linha de texto é um `<Line enter="words@B4" exit="blur@B12">`. Acrescente `<Audio src={staticFile("score.wav")} />` na raiz.
4. As batidas são lidas com cuidado: `t("B12")`, nunca `beats[3]` direto em `interpolate` (um undefined ali derruba o render inteiro com "inputRange must contain only finite numbers").

## Render

```sh
npx remotion bundle src/index.ts --out-dir=build          # uma vez
npx remotion render build <id> critique/round-1/film.mp4 \
  --codec=h264 --crf=16 --concurrency=4
```

Depois os mesmos `critique.mjs` e `deliver.mjs` (eles leem o mp4, não o código-fonte). Registre o render: um `node -e` serve, ou meça o tempo e acrescente um evento `render` ao `log.json`.

## Lições de uso longo do Remotion

- **Fixe o TypeScript 5.x** se mexer na cadeia de ferramentas dela: o TS 7 tirou o `ts.sys` e quebra o empacotador. E um `tsc --noEmit` limpo não é prova: apague o `tsconfig.tsbuildinfo` antes de acreditar num verde.
- **Empacote uma vez, renderize várias.** O `remotion render src/index.ts` refaz o webpack do projeto inteiro por composição (de 1 a 2 minutos cada).
- **Ajuste a concorrência pela memória, não pelos núcleos.** Num notebook de 12 núcleos com quadros 4K, concorrência 10 usou swap e foi mais lenta que 5 ou 6.
- **Sobreposições com alfa: qtrle, não ProRes 4444.** Idêntico bit a bit, cerca de 60 vezes mais rápido num quadro quase todo transparente.
- **Sem `backdrop-filter` em 4K** (20 vezes mais lento), sem `filter: drop-shadow` num SVG de quadro cheio (desenhe o brilho como um traço mais largo e mais fraco).
- **defaultProps não são verificados:** um nome de prop errado usa em silêncio os padrões do componente. Quando uma composição ignora as batidas, confira primeiro o nome da prop.
- **Apague a saída antes de renderizar de novo** e espere o processo do render terminar, nunca um arquivo chegar a uma contagem de quadros que o arquivo antigo já tem.
