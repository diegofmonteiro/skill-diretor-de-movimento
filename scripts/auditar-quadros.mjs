#!/usr/bin/env node
// Audita o filme quadro a quadro, no navegador, sem renderizar o vídeo.
//
//   node auditar-quadros.mjs --projeto <pasta> [--passo 0.25] [--json]
//
// A cada --passo segundos (padrão 0,25) leva a linha do tempo àquele instante e mede toda .linha-texto visível:
//   - fora do quadro (cortada pela borda);
//   - fora da zona segura do formato (em 9:16: topo 168 px, base a partir de y=1330);
//   - sobreposta a outra linha de texto visível;
//   - menor que 28 px (ilegível no celular).
// Mostra cada problema com o instante, o id da linha e a medida, para a correção apontar o lugar certo.
//
// Códigos de saída: 0 sem problemas; 1 com problemas.
import { abrirProjeto, comPagina, esperarComposicao, falhar, lerArgs, registrar } from "./lib.mjs";
import fs from "node:fs";

const { op } = lerArgs();
if (op.ajuda || !op.projeto) { console.log("Uso: node auditar-quadros.mjs --projeto <pasta> [--passo 0.25] [--json]"); process.exit(op.ajuda ? 0 : 1); }
const P = abrirProjeto(op.projeto);
const idx = P.arq("filme", "index.html");
if (!fs.existsSync(idx)) falhar("não há filme/index.html. Rode filme-init.mjs antes.");
const passo = op.passo ? +op.passo : 0.25;
const t0 = Date.now();

const achados = await comPagina("file://" + idx, { largura: P.meta.largura, altura: P.meta.altura }, async ({ avaliar }) => {
  await esperarComposicao(avaliar);
  const dur = await avaliar(`+document.getElementById("raiz").dataset.duracao`);
  const lista = [];
  for (let t = 0; t <= dur; t = +(t + passo).toFixed(4)) {
    const r = await avaliar(`(() => {
      window.__linhas.principal.time(${t}, false);
      const L = FILME.L, A = FILME.A, S = FILME.seguro, out = [];
      const vis = [...document.querySelectorAll(".linha-texto")].filter((e) => {
        const cs = getComputedStyle(e); let n = e, o = 1;
        while (n && n.id !== "raiz") { const c = getComputedStyle(n); if (c.visibility === "hidden" || c.display === "none") return false; o *= parseFloat(c.opacity); n = n.parentElement; }
        return o > 0.6;
      });
      const caixas = vis.map((e) => { const b = e.getBoundingClientRect(); return { id: e.id, x: b.left, y: b.top, d: b.right, b: b.bottom, fs: parseFloat(getComputedStyle(e).fontSize) }; });
      for (const c of caixas) {
        if (c.x < -2 || c.y < -2 || c.d > L + 2 || c.b > A + 2) out.push({ tipo: "fora do quadro", id: c.id, medida: Math.round(c.x)+","+Math.round(c.y)+" a "+Math.round(c.d)+","+Math.round(c.b) });
        else if (FILME.retrato && (c.y < S.topo - 2 || c.b > A - (A - S.base) + 2 && c.b > S.base)) out.push({ tipo: "fora da zona segura", id: c.id, medida: "y "+Math.round(c.y)+" a "+Math.round(c.b) });
        if (c.fs < 28) out.push({ tipo: "texto pequeno", id: c.id, medida: c.fs + " px" });
      }
      for (let i = 0; i < caixas.length; i++) for (let j = i + 1; j < caixas.length; j++) {
        const a = caixas[i], b = caixas[j];
        const w = Math.min(a.d, b.d) - Math.max(a.x, b.x), h = Math.min(a.b, b.b) - Math.max(a.y, b.y);
        if (w > 4 && h > 4) out.push({ tipo: "sobreposição", id: a.id + " e " + b.id, medida: Math.round(w) + "x" + Math.round(h) + " px" });
      }
      return JSON.stringify(out);
    })()`);
    for (const a of JSON.parse(r)) lista.push({ t, ...a });
  }
  return lista;
});

// junta o mesmo problema em instantes seguidos
const grupos = [];
for (const a of achados) {
  const g = grupos.find((x) => x.tipo === a.tipo && x.id === a.id && Math.abs(a.t - x.ate - passo) < 0.01);
  if (g) { g.ate = a.t; g.medida = a.medida; } else grupos.push({ ...a, de: a.t, ate: a.t });
}
registrar(P.dir, { fase: "auditoria-de-quadros", seg: +((Date.now() - t0) / 1000).toFixed(1), nota: `${grupos.length} problema(s)` });
if (op.json) console.log(JSON.stringify(grupos, null, 2));
else if (!grupos.length) console.log("Nenhum problema encontrado nos quadros.");
else for (const g of grupos) console.log(`${g.tipo.padEnd(20)} ${g.id}  de ${g.de.toFixed(2)}s a ${g.ate.toFixed(2)}s  (${g.medida})`);
process.exit(grupos.length ? 1 : 0);
