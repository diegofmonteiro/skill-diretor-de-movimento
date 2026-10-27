#!/usr/bin/env node
// Trilha original e sons de interface, sintetizados em código a partir da grade de batidas.
//
//   node sintetizador.mjs --projeto <pasta>
//
// Lê som/batidas.json (escrito por grade-de-batidas.mjs) e grava:
//   som/musica.wav  som/efeitos.wav   as duas pistas, para conferir
//   som/trilha.wav                    a mistura que o filme toca, a -14 LUFS e -1 dBTP
//   filme/ativos/trilha.wav           cópia para o filme (se a pasta filme/ existir)
//   som/som.json                      o que foi posto e os níveis medidos
//
// Nada de amostras, de downloads nem de música de terceiros: todo som é conta sobre um gerador
// com semente fixa, então a mesma grade gera sempre o mesmo arquivo.
//
// Regras que o código segue:
//  - um efeito sonoro acompanha um evento visível, nunca uma batida solta;
//  - um som por papel (clique, tique...); variar o som numa sequência rápida soa como defeito;
//  - o PICO do efeito cai no quadro da imagem (meio quadro depois, porque a luz chega antes do som);
//  - a base precisa carregar médios: se mais de 55% da energia ficar abaixo de 150 Hz, no celular soa como nada.
//
// Códigos de saída: 0 ok; 1 erro (grade ausente, FFmpeg ausente).
import fs from "node:fs";
import { abrirProjeto, executar, falhar, gravarJSON, lerArgs, lerJSON, registrar } from "./lib.mjs";

const SR = 44100;
const TAU = Math.PI * 2;

const semente = (s) => () => { s = (s + 0x6d2b79f5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296 * 2 - 1; };
const NOTAS = { do: 0, re: 2, mi: 4, fa: 5, sol: 7, la: 9, si: 11 };

const raizDoTom = (tom) => {
  const m = String(tom || "La menor").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").match(/^(do|re|mi|fa|sol|la|si)\s*(#|b)?\s*(maior|menor)?/);
  if (!m) return { midi: 57, menor: true };
  const semi = NOTAS[m[1]] + (m[2] === "#" ? 1 : m[2] === "b" ? -1 : 0);
  return { midi: 48 + semi, menor: m[3] !== "maior" };
};
const freq = (midi) => 440 * Math.pow(2, (midi - 69) / 12);

// o que cada clima toca
const CLIMAS = {
  impulsionado: { kick: 1, hat: "8", clap: true, pluck: "16", pad: 0.5, graves: true },
  brincalhao: { kick: 1, hat: "contra", clap: true, pluck: "8", pad: 0.35, graves: true },
  acolhedor: { kick: 2, hat: "none", clap: false, pluck: "8", pad: 0.7, graves: true },
  cinematografico: { kick: 4, hat: "none", clap: false, pluck: "4", pad: 0.9, graves: true },
  minimo: { kick: 2, hat: "none", clap: false, pluck: "8", pad: 0.45, graves: false },
  escuro: { kick: 1, hat: "8", clap: true, pluck: "4", pad: 0.8, graves: true, oitava: -12 },
};

const filtroPassaBaixa = (fc) => { const a = 1 - Math.exp(-TAU * fc / SR); let y = 0; return (x) => (y += a * (x - y)); };
const filtroPassaAlta = (fc) => { const lp = filtroPassaBaixa(fc); return (x) => x - lp(x); };

const grade = (g) => {
  const { bpm, batidasPorCompasso: bpc } = g;
  const spb = 60 / bpm;
  const { midi: raiz, menor } = raizDoTom(g.tom);
  const oit = (CLIMAS[g.clima] || CLIMAS.impulsionado).oitava || 0;
  // progressão de 4 acordes, um por compasso
  const prog = menor
    ? [[0, "m"], [8, "M"], [3, "M"], [10, "M"]]
    : [[0, "M"], [7, "M"], [9, "m"], [5, "M"]];
  const acorde = (compasso) => {
    const [g0, tipo] = prog[((compasso % 4) + 4) % 4];
    const base = raiz + g0 + oit;
    return { raiz: base, tons: [base, base + (tipo === "m" ? 3 : 4), base + 7] };
  };
  const energiaEm = (t) => { const s = (g.secoes || []).find((x) => t >= x.de && t < x.ate); return s ? s.energia : 0.45; };
  return { spb, bpc, acorde, energiaEm };
};

export const sintetizar = (b) => {
  const N = Math.ceil(b.comprimento * SR);
  const musica = new Float32Array(N), efeitos = new Float32Array(N);
  const K = grade(b), C = CLIMAS[b.clima] || CLIMAS.impulsionado;
  const aleat = semente(1234);
  const nBatidas = Math.floor(b.comprimento / K.spb);
  const compassoDe = (t) => Math.floor(t / (K.spb * K.bpc));
  const somar = (alvo, t0, dur, f) => { const i0 = Math.max(0, Math.floor(t0 * SR)), n = Math.min(N - i0, Math.ceil(dur * SR)); for (let i = 0; i < n; i++) alvo[i0 + i] += f(i / SR, i); };

  // momentos de kick, para a compressão lateral (a música "respira" com o bumbo) e para abrir espaço aos efeitos
  const kicks = [];
  for (let n = 0; n < nBatidas; n++) {
    const t = n * K.spb; const e = K.energiaEm(t);
    if (e >= 0.45 && n % (C.kick * (C.kick === 4 ? 1 : 1)) === 0) kicks.push(t);
  }
  const efSemMusica = (b.efeitos || []).map((f) => f.em);

  // pad: três vozes levemente desafinadas por acorde, atacando devagar
  const nComp = Math.ceil(b.comprimento / (K.spb * K.bpc));
  for (let c = 0; c < nComp; c++) {
    const t0 = c * K.spb * K.bpc, dur = K.spb * K.bpc + 0.4;
    const e = K.energiaEm(t0 + 0.01), ac = K.acorde(c);
    const vol = (0.07 + 0.05 * e) * C.pad * 2.4;
    for (const m of ac.tons) for (const des of [-0.004, 0.004, 0]) {
      const lp = filtroPassaBaixa(1400 + 2400 * e);
      const f = freq(m + 12) * (1 + des);
      somar(musica, t0, dur, (t) => {
        const env = Math.min(1, t / 0.45) * Math.min(1, (dur - t) / 0.4);
        const saw = 2 * ((t * f) % 1) - 1;
        return lp(saw * 0.5 + Math.sin(TAU * f * t) * 0.5) * env * vol / 3;
      });
    }
  }
  // grave: raiz em colcheias quando há energia
  if (C.graves) for (let n = 0; n < nBatidas * 2; n++) {
    const t = n * K.spb / 2; const e = K.energiaEm(t);
    if (e < 0.55) continue;
    const ac = K.acorde(compassoDe(t)); const f = freq(ac.raiz - 12);
    somar(musica, t, K.spb * 0.45, (tt) => { const env = Math.exp(-tt * 5) * Math.min(1, tt / 0.004); return (Math.sin(TAU * f * tt) + 0.35 * Math.sin(TAU * f * 2 * tt)) * env * 0.11; });
  }
  // arpejo: notas do acorde, sem pisar nos efeitos
  if (C.pluck !== "none") {
    const passo = C.pluck === "16" ? K.spb / 4 : C.pluck === "8" ? K.spb / 2 : K.spb;
    for (let t = 0, i = 0; t < b.comprimento - 0.2; t += passo, i++) {
      const e = K.energiaEm(t); if (e < 0.5) continue;
      if (efSemMusica.some((x) => Math.abs(x - t) < 0.06)) continue;
      const ac = K.acorde(compassoDe(t)); const m = ac.tons[[0, 1, 2, 1][i % 4]] + 24; const f = freq(m);
      somar(musica, t, 0.35, (tt) => { const env = Math.exp(-tt * 11) * Math.min(1, tt / 0.003); return (Math.sin(TAU * f * tt) + 0.4 * Math.sin(TAU * f * 2 * tt) + 0.18 * Math.sin(TAU * f * 3 * tt)) * env * 0.075 * (e > 0.7 ? 1.15 : 1); });
    }
  }
  // chimbal
  if (C.hat !== "none") for (let n = 0; n < nBatidas; n++) {
    const e = K.energiaEm(n * K.spb); if (e < 0.3) continue;
    const alvos = C.hat === "contra" ? [0.5] : [0, 0.5];
    for (const o of alvos) {
      const t = (n + o) * K.spb;
      if (efSemMusica.some((x) => Math.abs(x - t) < 0.05)) continue;
      const hp = filtroPassaAlta(7000);
      somar(musica, t, 0.07, (tt) => hp(aleat()) * Math.exp(-tt * 70) * 0.09 * (o === 0.5 ? 0.8 : 1));
    }
  }
  // bumbo e palma
  for (const t of kicks) {
    const metade = efSemMusica.some((x) => Math.abs(x - t) < 0.05) ? 0.5 : 1;
    let fase = 0;
    somar(musica, t, 0.3, (tt) => { const f = 45 + 95 * Math.exp(-tt * 28); fase += TAU * f / SR; return Math.sin(fase) * Math.exp(-tt * 9) * Math.min(1, tt / 0.002) * 0.34 * metade; });
  }
  if (C.clap) for (let n = 1; n < nBatidas; n += 2) {
    const t = n * K.spb; if (K.energiaEm(t) < 0.7) continue;
    const hp = filtroPassaAlta(1200), lp = filtroPassaBaixa(5200);
    somar(musica, t, 0.2, (tt) => lp(hp(aleat())) * (Math.exp(-tt * 22) + 0.5 * Math.exp(-Math.max(0, tt - 0.012) * 40)) * 0.2);
  }
  // subida (riser) no fim das seções marcadas, e impacto no início da queda
  for (const s of b.secoes || []) {
    if (s.subida) {
      const dur = s.ate - s.de; const hp = filtroPassaAlta(900); const lp = filtroPassaBaixa(9000);
      somar(musica, s.de, dur, (tt) => { const p = tt / dur; return lp(hp(aleat())) * Math.pow(p, 2.2) * 0.11; });
      let ph = 0;
      somar(musica, s.de, dur, (tt) => { const p = tt / dur; ph += TAU * (200 + 1400 * p * p) / SR; return Math.sin(ph) * Math.pow(p, 2) * 0.05; });
    }
    if (s.queda) {
      const lp = filtroPassaBaixa(900);
      somar(efeitos, s.de, 1.4, (tt) => (Math.sin(TAU * (38 + 40 * Math.exp(-tt * 6)) * tt) * 0.8 + lp(aleat()) * 0.5 * Math.exp(-tt * 12)) * Math.exp(-tt * 3.4) * 0.7);
    }
  }
  // compressão lateral: a música cede ao bumbo e aos efeitos (4 dB por 0,25 s)
  const cedo = new Float32Array(N).fill(1);
  const abaixar = (t, prof, rel) => { const i0 = Math.floor(t * SR), n = Math.floor(rel * 4 * SR); for (let i = 0; i < n && i0 + i < N; i++) cedo[i0 + i] = Math.min(cedo[i0 + i], 1 - prof * Math.exp(-i / SR / rel)); };
  for (const t of kicks) abaixar(t, 0.3, 0.1);
  for (const x of efSemMusica) abaixar(x, 0.35, 0.18);
  for (let i = 0; i < N; i++) musica[i] *= cedo[i];

  // efeitos: cada tipo tem um som só e um instante de pico dentro dele
  const meioQuadro = 1 / 60;
  const DEF = {
    clique: { pico: 0.002, dur: 0.12, f: (t) => { const lp = null; return (Math.sin(TAU * 1800 * t) * Math.exp(-t * 90) * 0.5 + aleat() * Math.exp(-t * 400) * 0.5) * 0.7; } },
    tique: { pico: 0.002, dur: 0.06, f: (t) => Math.sin(TAU * 2600 * t) * Math.exp(-t * 130) * 0.55 },
    estalo: { pico: 0.003, dur: 0.18, f: (t) => { const f = 220 + 700 * Math.exp(-t * 60); return Math.sin(TAU * f * t) * Math.exp(-t * 30) * 0.8; } },
    passagem: { pico: 0.22, dur: 0.7, f: () => { const lp = filtroPassaBaixa(3000), hp = filtroPassaAlta(400); return (t) => lp(hp(aleat())) * Math.sin(Math.PI * Math.min(1, t / 0.7)) ** 2 * 0.6; } },
    impacto: { pico: 0.003, dur: 1.3, f: (t) => (Math.sin(TAU * (40 + 50 * Math.exp(-t * 7)) * t) * 0.9 + aleat() * 0.3 * Math.exp(-t * 30)) * Math.exp(-t * 3.2) * 0.85 },
    brilho: { pico: 0.02, dur: 1.0, f: (t) => ([2093, 3136, 4186].reduce((s, f, i) => s + Math.sin(TAU * f * t) * (0.4 - i * 0.1), 0)) * Math.exp(-t * 4) * Math.min(1, t / 0.01) * 0.28 },
    subida: { pico: 0.5, dur: 0.5, f: () => { const hp = filtroPassaAlta(600); return (t) => hp(aleat()) * (t / 0.5) ** 2 * 0.4; } },
  };
  const ajustados = [];
  for (const f of b.efeitos || []) {
    const d = DEF[f.tipo]; if (!d) continue;
    const gen = d.f.length === 0 ? d.f() : d.f;       // passagem e subida criam filtros próprios por efeito
    const t0 = f.em + meioQuadro - d.pico;
    somar(efeitos, Math.max(0, t0), d.dur, (tt) => gen(tt));
    ajustados.push({ tipo: f.tipo, em: f.em, evento: f.evento, picoEm: +(f.em + meioQuadro).toFixed(4) });
  }
  return { musica, efeitos, ajustados, kicks };
};

const gravarWav = (arq, mono, ganho = 1) => {
  const n = mono.length, buf = Buffer.alloc(44 + n * 4);
  buf.write("RIFF", 0); buf.writeUInt32LE(36 + n * 4, 4); buf.write("WAVEfmt ", 8); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20);
  buf.writeUInt16LE(2, 22); buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 4, 28); buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34); buf.write("data", 36); buf.writeUInt32LE(n * 4, 40);
  for (let i = 0; i < n; i++) { const v = Math.max(-1, Math.min(1, mono[i] * ganho)); const s = Math.round(v * 32767); buf.writeInt16LE(s, 44 + i * 4); buf.writeInt16LE(s, 46 + i * 4); }
  fs.writeFileSync(arq, buf);
};

/** Parcela da energia abaixo de 150 Hz (filtro simples), para avisar quando a base não tem médios. */
const parcelaGraves = (x) => { const lp = filtroPassaBaixa(150); let a = 0, b = 0; for (let i = 0; i < x.length; i++) { const l = lp(x[i]); a += l * l; b += x[i] * x[i]; } return b ? a / b : 0; };

if (process.argv[1]?.endsWith("sintetizador.mjs")) {
  const { op } = lerArgs();
  if (op.ajuda || !op.projeto) { console.log("Uso: node sintetizador.mjs --projeto <pasta>"); process.exit(op.ajuda ? 0 : 1); }
  const P = abrirProjeto(op.projeto);
  const b = lerJSON(P.arq("som", "batidas.json"), null) || falhar("rode grade-de-batidas.mjs antes: falta som/batidas.json");
  const t0 = Date.now();
  const { musica, efeitos, ajustados } = sintetizar(b);
  const N = musica.length, mix = new Float32Array(N);
  for (let i = 0; i < N; i++) mix[i] = musica[i] * 0.9 + efeitos[i];
  let pico = 0; for (let i = 0; i < N; i++) pico = Math.max(pico, Math.abs(mix[i]));
  const g = pico > 0 ? 0.89 / pico : 1;
  fs.mkdirSync(P.arq("som"), { recursive: true });
  gravarWav(P.arq("som", "musica.wav"), musica, g); gravarWav(P.arq("som", "efeitos.wav"), efeitos, g);
  const bruto = P.arq("som", "mistura-bruta.wav"); gravarWav(bruto, mix, g);
  // normalização em duas passagens: mede e depois aplica o ganho, para chegar a -14 LUFS sem estourar -1 dBTP
  const alvo = ["I=-14", "TP=-1", "LRA=11"].join(":");
  const m = executar("ffmpeg", ["-hide_banner", "-nostats", "-i", bruto, "-af", `loudnorm=${alvo}:print_format=json`, "-f", "null", "-"]);
  if (m.codigo) falhar("o FFmpeg não conseguiu medir a mistura: " + m.erro.slice(-300));
  const j = JSON.parse(m.erro.slice(m.erro.lastIndexOf("{"), m.erro.lastIndexOf("}") + 1));
  const final = P.arq("som", "trilha.wav");
  const r = executar("ffmpeg", ["-v", "error", "-y", "-i", bruto, "-af", `loudnorm=${alvo}:measured_I=${j.input_i}:measured_TP=${j.input_tp}:measured_LRA=${j.input_lra}:measured_thresh=${j.input_thresh}:offset=${j.target_offset}:linear=true`, "-ar", String(SR), final]);
  if (r.codigo) falhar("o FFmpeg falhou ao normalizar: " + r.erro.slice(-300));
  fs.rmSync(bruto, { force: true });
  if (fs.existsSync(P.arq("filme", "ativos"))) fs.copyFileSync(final, P.arq("filme", "ativos", "trilha.wav"));
  const graves = parcelaGraves(musica);
  gravarJSON(P.arq("som", "som.json"), { comprimento: b.comprimento, clima: b.clima, tom: b.tom, efeitos: ajustados, parcelaGravesBase: +graves.toFixed(2), alvo: "-14 LUFS, -1 dBTP" });
  registrar(P.dir, { fase: "sintetizador", seg: +((Date.now() - t0) / 1000).toFixed(2), nota: `${ajustados.length} efeitos` });
  console.log(`trilha: ${final}  (${b.comprimento.toFixed(1)} s, ${ajustados.length} efeitos)`);
  if (graves > 0.55) console.log(`aviso: ${(graves * 100).toFixed(0)}% da energia da base está abaixo de 150 Hz; em alto-falante de celular ela some. Suba a energia das seções ou troque o clima.`);
}
