#!/usr/bin/env node
// A crítica de uma rodada: mede o que dá para medir e prepara o que precisa de olho.
//
//   node critica.mjs --projeto <pasta> [--rodada N]                      mede e gera a folha de quadros
//   node critica.mjs --projeto <pasta> --veredito --gancho 4 --marca 5 --movimento 4 --legibilidade 5 --ritmo 4 --acabamento 4 [--nota "texto"]
//
// Medida automática (FFmpeg, sem interpretar nada): duração, loudness integrado e pico verdadeiro,
//   trechos pretos, trechos congelados e quantos cortes por segundo o filme tem.
// Folha: critica/rodada-N/folha.png com 24 quadros em ordem. Olhe a folha ANTES de dar notas.
// Veredito: seis eixos de 1 a 5 (gancho, marca, movimento, legibilidade, ritmo, acabamento). Aprovado se
//   nenhum eixo ficar abaixo de 3 e a média chegar a 4. No máximo 3 rodadas: na terceira o filme segue com a lista do que ficou.
//
// Códigos de saída: 0 ok (ou aprovado); 1 erro; 2 reprovado (volte e corrija).
import fs from "node:fs";
import { abrirProjeto, duracaoDe, executar, falhar, gravarJSON, lerArgs, lerJSON, registrar } from "./lib.mjs";

const EIXOS = ["gancho", "marca", "movimento", "legibilidade", "ritmo", "acabamento"];
const { op } = lerArgs();
if (op.ajuda || !op.projeto) { console.log("Uso: node critica.mjs --projeto <pasta> [--rodada N] | --veredito --gancho 1-5 --marca 1-5 --movimento 1-5 --legibilidade 1-5 --ritmo 1-5 --acabamento 1-5"); process.exit(op.ajuda ? 0 : 1); }
const P = abrirProjeto(op.projeto);
const rodadas = fs.existsSync(P.arq("critica")) ? fs.readdirSync(P.arq("critica")).filter((x) => /^rodada-\d+$/.test(x)).map((x) => +x.slice(7)).sort((a, b) => a - b) : [];
if (!rodadas.length) falhar("nenhuma rodada renderizada. Rode renderizar-filme.mjs antes.");
const n = op.rodada ? +op.rodada : rodadas[rodadas.length - 1];
const pasta = P.arq("critica", `rodada-${n}`), video = `${pasta}/filme.mp4`;
if (!fs.existsSync(video)) falhar(`não existe ${video}`);

if (op.veredito) {
  const notas = {};
  for (const e of EIXOS) {
    const v = +op[e];
    if (!(v >= 1 && v <= 5)) falhar(`dê uma nota de 1 a 5 para --${e}`);
    notas[e] = v;
  }
  const media = EIXOS.reduce((s, e) => s + notas[e], 0) / EIXOS.length;
  const aprovado = EIXOS.every((e) => notas[e] >= 3) && media >= 4;
  const ultima = n >= 3;
  const fracos = EIXOS.filter((e) => notas[e] < 4);
  gravarJSON(`${pasta}/scores.json`, { rodada: n, notas, media: +media.toFixed(2), aprovado, ultimaRodada: ultima, abaixoDe4: fracos, nota: typeof op.nota === "string" ? op.nota : "" });
  registrar(P.dir, { fase: `veredito-rodada-${n}`, seg: 0, nota: `média ${media.toFixed(1)}, ${aprovado ? "aprovado" : "reprovado"}` });
  console.log(`Rodada ${n}: média ${media.toFixed(2)}. ${aprovado ? "APROVADA." : ultima ? "Reprovada, mas é a última rodada: siga para a entrega e liste o que ficou fraco: " + fracos.join(", ") + "." : "REPROVADA. Corrija: " + fracos.join(", ") + "."}`);
  process.exit(aprovado || ultima ? 0 : 2);
}

const dur = duracaoDe(video);
const filtro = (vf, af) => executar("ffmpeg", ["-hide_banner", "-nostats", "-i", video, ...(vf ? ["-vf", vf, "-an"] : []), ...(af ? ["-af", af, "-vn"] : []), "-f", "null", "-"]).erro;
const tempos = (texto, re) => [...texto.matchAll(re)].map((x) => x.slice(1).map(Number));
const preto = tempos(filtro("blackdetect=d=0.2:pix_th=0.05"), /black_start:([\d.]+)\s+black_end:([\d.]+)/g);
const parado = tempos(filtro("freezedetect=n=-55dB:d=1.2"), /freeze_start:\s*([\d.]+)/g).map((x) => x[0]);
const cortes = (filtro("select='gt(scene,0.35)',showinfo").match(/pts_time:[\d.]+/g) || []).length;
const so = filtro(null, "ebur128=peak=true");
const resumo = so.slice(so.lastIndexOf("Summary:"));
const loud = parseFloat((resumo.match(/I:\s+(-?[\d.]+)\s+LUFS/) || [])[1]);
const pico = parseFloat((resumo.match(/Peak:\s+(-?[\d.]+)\s+dBFS/) || [])[1]);

const metricas = { rodada: n, duracao: +dur.toFixed(2), loudnessLUFS: loud, picoDBFS: pico, trechosPretos: preto, inicioDeTrechosCongelados: parado, cortesPorSegundo: +(cortes / dur).toFixed(2) };
const avisos = [];
if (Number.isFinite(loud) && Math.abs(loud + 14) > 1.5) avisos.push(`loudness ${loud} LUFS, longe de -14`);
if (Number.isFinite(pico) && pico > -0.5) avisos.push(`pico ${pico} dBFS: risco de estourar na plataforma`);
if (preto.length) avisos.push(`${preto.length} trecho(s) preto(s): confira se é intencional`);
if (parado.length) avisos.push(`imagem parada a partir de ${parado.map((x) => x.toFixed(1) + "s").join(", ")}: nada se move por mais de 1,2 s`);
metricas.avisos = avisos;
gravarJSON(`${pasta}/metricas.json`, metricas);

// 24 quadros em ordem, em 6 colunas
const fps = 24 / dur;
const r = executar("ffmpeg", ["-v", "error", "-y", "-i", video, "-vf", `fps=${fps.toFixed(5)},scale=480:-1,tile=6x4:padding=6:color=0x202026`, "-frames:v", "1", `${pasta}/folha.png`]);
if (r.codigo) falhar("não consegui montar a folha: " + r.erro.slice(-200));
registrar(P.dir, { fase: `critica-rodada-${n}`, seg: 0, nota: `${avisos.length} aviso(s)` });
console.log(JSON.stringify(metricas, null, 2));
console.log(`\nFolha de quadros (olhe antes de dar notas): ${pasta}/folha.png  (24 quadros, um a cada ${(dur / 24).toFixed(2)} s, da esquerda para a direita)`);
