#!/usr/bin/env node
// Renderizador: transforma uma composição HTML em vídeo, quadro a quadro.
//
//   node renderizador.mjs <pasta com index.html> --saida arquivo [--formato mp4|mov|webm|gif|sequencia]
//        [--fps 30] [--qualidade rascunho|entrega] [--trabalhadores 3]
//        [--audio arquivo.wav] [--quadro 1.5]   (um quadro só, em PNG)
//
// Como funciona: abre index.html no Chrome sem interface, pausa a linha do
// tempo do GSAP (window.__linhas.principal), vai ao instante de cada quadro,
// fotografa a página e entrega as fotos ao FFmpeg. Nada depende de relógio
// nem de sorteio, então o mesmo arquivo gera sempre o mesmo vídeo.
//
// A composição precisa ter um elemento #raiz com data-largura, data-altura,
// data-duracao (segundos) e, se quiser, data-fps.
//
// Códigos de saída: 0 ok, 1 erro de uso ou de renderização.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { comPagina, esperarComposicao, executar, falhar, lerArgs } from "./lib.mjs";

const AJUDA = `Uso: node renderizador.mjs <pasta> --saida <arquivo> [--formato mp4|mov|webm|gif|sequencia]
       [--fps 30] [--qualidade rascunho|entrega] [--trabalhadores 3] [--audio arq.wav] [--quadro segundos]
Formatos com transparência: mov (ProRes 4444), webm (VP9), gif, sequencia (PNGs).`;

/** Lê as medidas da composição sem renderizar. */
const medidas = async (url) =>
  comPagina(url, { largura: 1920, altura: 1080 }, async ({ avaliar }) => {
    await esperarComposicao(avaliar);
    return avaliar(`(() => { const r = document.getElementById("raiz"); return { l: +r.dataset.largura, a: +r.dataset.altura, d: +r.dataset.duracao, fps: +(r.dataset.fps || 30) }; })()`);
  });

/** Parte do trabalho: fotografa os quadros [de, ate) para a pasta destino. */
const fotografar = async (url, med, de, ate, fps, destino, transparente) =>
  comPagina(url, { largura: med.l, altura: med.a }, async ({ avaliar, capturar, enviar }) => {
    await esperarComposicao(avaliar);
    if (!transparente) await enviar("Emulation.setDefaultBackgroundColorOverride", {});
    for (let i = de; i < ate; i++) {
      await avaliar(`(window.__linhas.principal.time(${(i / fps).toFixed(5)}, false), true)`);
      fs.writeFileSync(path.join(destino, `${String(i).padStart(6, "0")}.png`), await capturar());
    }
  });

export const renderizar = async ({ pasta, saida, formato = "mp4", fps, qualidade = "entrega", trabalhadores = 3, audio, quadro, transparente = false }) => {
  const dir = path.resolve(pasta);
  const idx = path.join(dir, "index.html");
  if (!fs.existsSync(idx)) falhar(`não achei ${idx}`);
  const url = "file://" + idx;
  const med = await medidas(url);
  if (!med.l || !med.a || !med.d) falhar("#raiz precisa de data-largura, data-altura e data-duracao");
  const f = fps || med.fps || 30;
  const total = Math.ceil(med.d * f) + 1;
  const out = path.resolve(saida);
  fs.mkdirSync(path.dirname(out), { recursive: true });

  // um quadro só
  if (quadro !== undefined) {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "dm-q-"));
    const i = Math.round(parseFloat(quadro) * f);
    await fotografar(url, med, i, i + 1, f, tmp, transparente);
    fs.copyFileSync(path.join(tmp, `${String(i).padStart(6, "0")}.png`), out);
    fs.rmSync(tmp, { recursive: true, force: true });
    return { arquivo: out, quadros: 1 };
  }

  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "dm-r-"));
  try {
    const n = Math.max(1, Math.min(+trabalhadores || 1, 6, total));
    const fatia = Math.ceil(total / n);
    await Promise.all(Array.from({ length: n }, (_, k) =>
      fotografar(url, med, k * fatia, Math.min(total, (k + 1) * fatia), f, tmp, transparente)));

    if (formato === "sequencia") {
      fs.mkdirSync(out, { recursive: true });
      for (const a of fs.readdirSync(tmp)) fs.copyFileSync(path.join(tmp, a), path.join(out, a));
      return { arquivo: out, quadros: total };
    }

    const entrada = ["-v", "error", "-y", "-framerate", String(f), "-i", path.join(tmp, "%06d.png")];
    if (audio) entrada.push("-i", path.resolve(audio));
    const crf = qualidade === "rascunho" ? "26" : "16";
    const codec = {
      mp4: ["-c:v", "libx264", "-preset", qualidade === "rascunho" ? "ultrafast" : "veryfast", "-crf", crf, "-pix_fmt", "yuv420p", "-movflags", "+faststart"],
      mov: ["-c:v", "prores_ks", "-profile:v", "4444", "-pix_fmt", "yuva444p10le", "-vendor", "apl0"],
      webm: ["-c:v", "libvpx-vp9", "-pix_fmt", "yuva420p", "-b:v", "0", "-crf", "28", "-auto-alt-ref", "0"],
      gif: ["-vf", "split[a][b];[a]palettegen=reserve_transparent=1[p];[b][p]paletteuse", "-loop", "0"],
    }[formato];
    if (!codec) falhar(`formato desconhecido: ${formato}`);
    const audioArgs = audio && formato !== "gif" ? ["-c:a", formato === "webm" ? "libopus" : "aac", "-b:a", "192k", "-shortest"] : [];
    const r = executar("ffmpeg", [...entrada, ...codec, ...audioArgs, out]);
    if (r.codigo) falhar(`o FFmpeg falhou:\n${r.erro.split("\n").slice(-8).join("\n")}`);
    return { arquivo: out, quadros: total };
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
};

if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith("renderizador.mjs")) {
  const { pos, op } = lerArgs();
  if (op.ajuda || op.h || !pos[0]) { console.log(AJUDA); process.exit(op.ajuda || op.h ? 0 : 1); }
  if (!op.saida) falhar("falta --saida");
  const t0 = Date.now();
  const formato = op.formato || path.extname(op.saida).slice(1) || "mp4";
  const r = await renderizar({
    pasta: pos[0], saida: op.saida, formato: formato === "png" ? "sequencia" : formato, fps: op.fps ? +op.fps : undefined,
    qualidade: op.qualidade, trabalhadores: op.trabalhadores, audio: op.audio, quadro: op.quadro,
    transparente: ["mov", "webm", "gif", "sequencia"].includes(formato) && op.transparente !== "nao",
  });
  console.log(`${r.arquivo}  ${r.quadros} quadros em ${((Date.now() - t0) / 1000).toFixed(1)} s`);
}
