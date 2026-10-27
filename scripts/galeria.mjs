#!/usr/bin/env node
// Gera o catálogo dos movimentos: uma imagem de cada, CATALOGO.md e uma página galeria.html.
//
//   node galeria.mjs [--marca <pasta>] [--sem-imagens] [--saida <pasta>]
//
// Padrão de saída: <skill>/catalogo/ (previas/<id>.jpg, CATALOGO.md, galeria.html).
// Cada prévia é um quadro do movimento, com a marca dada (ou a marca de exemplo), no primeiro formato que ele aceita.
// --sem-imagens: só reescreve CATALOGO.md e galeria.html com o que já existe em previas/.
//
// Códigos de saída: 0 ok; 1 erro.
import fs from "node:fs";
import path from "node:path";
import { SKILL, executar, lerArgs } from "./lib.mjs";
import { lerMarca, listarMovimentos, montarMovimento } from "./renderizar-movimento.mjs";
import { renderizar } from "./renderizador.mjs";

const { op } = lerArgs();
if (op.ajuda) { console.log("Uso: node galeria.mjs [--marca pasta] [--sem-imagens] [--saida pasta]"); process.exit(0); }
const saida = path.resolve(op.saida || path.join(SKILL, "catalogo"));
const previas = path.join(saida, "previas");
fs.mkdirSync(previas, { recursive: true });
const movs = listarMovimentos().sort((a, b) => (a.categoria + a.id).localeCompare(b.categoria + b.id));

if (!op["sem-imagens"]) {
  const marca = lerMarca(op.marca ? path.resolve(String(op.marca)) : undefined);
  for (const m of movs) {
    const asp = m.formatos?.[0] || "9:16";
    const w = montarMovimento({ id: m.id, marca, aspecto: asp, fundo: "olhar" });
    try {
      const bruto = path.join(w.dir, "quadro.png");
      await renderizar({ pasta: w.dir, saida: bruto, quadro: +(w.duracao * 0.7).toFixed(2) });
      // JPEG de 540 px de largura: leve o bastante para morar no repositório
      const r = executar("ffmpeg", ["-v", "error", "-y", "-i", bruto, "-vf", "scale=540:-2", "-q:v", "4", path.join(previas, `${m.id}.jpg`)]);
      if (r.codigo) throw new Error("FFmpeg falhou ao reduzir a prévia: " + r.erro.slice(-200));
      console.log("prévia:", m.id);
    } finally { fs.rmSync(w.dir, { recursive: true, force: true }); }
  }
}

const porCategoria = {};
for (const m of movs) (porCategoria[m.categoria] ||= []).push(m);
const linha = (m) => `| ![${m.nome}](previas/${m.id}.jpg) | **${m.nome}** (\`${m.id}\`)<br>${m.umaLinha}<br>${m.duracao} s, ${m.formatos.join(" e ")}${m.alfa ? ", com versão transparente" : ""} | ${m.quando_usar} |`;
const md = ["# Catálogo de movimentos", "", `${movs.length} movimentos, em ${Object.keys(porCategoria).length} categorias. Cada um é um efeito curto e independente, escrito para receber a marca da empresa.`, "",
  "Para ver um deles com a sua marca: `node scripts/renderizar-movimento.mjs --movimento <id> --marca <pasta> --saida teste.mp4`.", ""];
for (const [cat, lista] of Object.entries(porCategoria)) {
  md.push(`## ${cat}`, "", "| Prévia | Movimento | Quando usar |", "|---|---|---|", ...lista.map(linha), "");
}
fs.writeFileSync(path.join(saida, "CATALOGO.md"), md.join("\n"));

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const cartoes = movs.map((m) => `<article><img src="previas/${m.id}.jpg" alt="${esc(m.nome)}" loading="lazy"><h3>${esc(m.nome)}</h3><p>${esc(m.umaLinha)}</p><small>${esc(m.categoria)} · ${m.duracao} s · <code>${esc(m.id)}</code></small></article>`).join("\n");
fs.writeFileSync(path.join(saida, "galeria.html"), `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Galeria de movimentos</title>
<style>body{margin:0;font:16px/1.45 system-ui,sans-serif;background:#111;color:#eee;padding:24px}h1{margin:0 0 20px}main{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:18px}article{background:#1b1b20;border-radius:14px;padding:12px}img{width:100%;border-radius:8px;background:#000}h3{margin:10px 0 4px}p{margin:0 0 8px;color:#bbb}small{color:#888}code{color:#ccc}</style></head>
<body><h1>Galeria de movimentos (${movs.length})</h1><main>
${cartoes}
</main></body></html>
`);
console.log(`${movs.length} movimentos catalogados em ${saida}`);
