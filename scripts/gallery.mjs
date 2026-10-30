#!/usr/bin/env node
// Build the preview gallery: a looping preview of every MOVE (rendered in the
// example brand in templates/demo-brand) and every THEME, in one page the user picks from.
//
//   node gallery.mjs                      # render missing/stale move previews, write gallery.html + gallery.jpg
//   node gallery.mjs --only bar-race      # just these moves (comma separated)
//   node gallery.mjs --force              # re-render every preview
//   node gallery.mjs --no-render          # only rebuild the page from previews already on disk
//   node gallery.mjs --open               # open the page when done
//
// Per move it writes templates/moves/<id>/preview.mp4 (540px wide, 9:16 if the
// move has it) and preview.gif (270px, for chat). Themes show their preview
// strip (templates/themes/<id>/preview.jpg) when one exists.
// The page lives at <skill>/gallery.html and filters by use, look and tag.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { SKILL, die, duration, readJSON, run } from "./lib.mjs";

const argv = process.argv.slice(2);
const opt = (k, d) => (argv.includes(k) ? argv[argv.indexOf(k) + 1] : d);
const only = opt("--only") ? opt("--only").split(",") : null;
const force = argv.includes("--force"), noRender = argv.includes("--no-render");
const MOVES = path.join(SKILL, "templates", "moves"), THEMES = path.join(SKILL, "templates", "themes");
if (run("ffmpeg", ["-version"]).code) die("o ffmpeg é necessário para as amostras (veja check-setup.mjs)");

// the example brand can carry per-move example copy ("examples": {"<move id>": {vars}}) so previews read right
const BRAND = path.join(SKILL, "templates", "demo-brand", "brand.json");
const EXAMPLES = readJSON(BRAND, {}).examples || {};
const mtime = (p) => (fs.existsSync(p) ? fs.statSync(p).mtimeMs : 0);
const dirs = (d) => (fs.existsSync(d) ? fs.readdirSync(d).filter((n) => !n.startsWith("_") && !n.startsWith(".") && fs.statSync(path.join(d, n)).isDirectory()) : []);

// ---- moves: render the preview loops
const moves = [];
for (const id of dirs(MOVES)) {
  const md = path.join(MOVES, id), mj = path.join(md, "move.json");
  if (!fs.existsSync(mj)) continue;
  const m = readJSON(mj);
  moves.push(m);
  if (noRender || (only && !only.includes(id))) continue;
  const mp4 = path.join(md, "preview.mp4"), gif = path.join(md, "preview.gif");
  const src = Math.max(mtime(mj), mtime(path.join(md, "index.html")), mtime(path.join(MOVES, "_lib", "move.js")), mtime(BRAND));
  if (!force && mtime(mp4) > src && mtime(gif) > src) continue;
  const aspect = (m.formats || ["9:16"]).includes("9:16") ? "9:16" : m.formats[0];
  const tmp = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "md-gallery-")), `${id}.mp4`);
  process.stdout.write(`${id} (${aspect}) ... `);
  const r = run("node", [path.join(SKILL, "scripts", "move-render.mjs"), "--move", id, "--aspect", aspect, "--quality", opt("--quality", "draft"), "--out", tmp, ...(EXAMPLES[id] ? ["--vars", JSON.stringify(EXAMPLES[id])] : [])], { timeout: 1800000 });
  if (r.code || !fs.existsSync(tmp)) { console.log("FALHOU\n" + (r.err || r.out).split("\n").slice(-6).join("\n")); continue; }
  run("ffmpeg", ["-y", "-v", "error", "-i", tmp, "-vf", "scale=540:-2:flags=lanczos", "-c:v", "libx264", "-crf", "24", "-preset", "slow", "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-an", mp4]);
  run("ffmpeg", ["-y", "-v", "error", "-i", tmp, "-vf", "fps=15,scale=270:-2:flags=lanczos,split[a][b];[a]palettegen=max_colors=128:stats_mode=diff[p];[b][p]paletteuse=dither=bayer:bayer_scale=4", gif]);
  fs.rmSync(path.dirname(tmp), { recursive: true, force: true });
  console.log(`ok (${(fs.statSync(mp4).size / 1024).toFixed(0)} KB mp4, ${(fs.statSync(gif).size / 1024).toFixed(0)} KB gif)`);
}

// ---- themes: whole films
const themes = dirs(THEMES).map((id) => ({ ...readJSON(path.join(THEMES, id, "theme.json"), { id, name: id }), id })).filter((t) => t.name);

// ---- the page
const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const rel = (p) => path.relative(SKILL, p).split(path.sep).join("/");
const card = (o) => `
  <article class="card ${o.kind}" data-uses="${esc(o.uses.join(" "))}" data-looks="${esc(o.looks.join(" "))}" data-text="${esc((o.name + " " + o.id + " " + o.tags.join(" ") + " " + o.say).toLowerCase())}">
    <div class="media ${o.tall ? "tall" : "wide"}">${o.media}</div>
    <div class="body">
      <h3>${esc(o.name)} <span class="id">${esc(o.id)}</span></h3>
      <p>${esc(o.oneLiner)}</p>
      ${o.say ? `<p class="say">${esc(o.say)}</p>` : ""}
      <div class="chips">${o.uses.map((x) => `<b>${esc(x)}</b>`).join("")}${o.looks.map((x) => `<i>${esc(x)}</i>`).join("")}${o.alpha ? "<b class=a>transparente</b>" : ""}${(o.formats || []).map((x) => `<i>${esc(x)}</i>`).join("")}</div>
      <code>${esc(o.cmd)}</code>
    </div>
  </article>`;
const cards = [
  ...themes.map((t) => {
    const img = t.preview && fs.existsSync(path.join(THEMES, t.id, t.preview)) ? rel(path.join(THEMES, t.id, t.preview)) : null;
    return card({ kind: "theme", id: t.id, name: t.name, oneLiner: t.oneLiner || "", say: t.bestFor ? `Melhor para: ${t.bestFor}` : "", uses: ["film"], looks: [t.ground || ""].filter(Boolean), tags: [], formats: [t.format].filter(Boolean), tall: false,
      media: img ? `<img src="${img}" loading="lazy" alt="">` : `<div class="none">faixa de amostra não incluída</div>`, cmd: `film-init.mjs --theme ${t.id}` });
  }),
  ...moves.map((m) => {
    const mp4 = path.join(MOVES, m.id, "preview.mp4");
    const tall = (m.formats || ["9:16"]).includes("9:16");
    return card({ kind: "move", id: m.id, name: m.name || m.id, oneLiner: m.oneLiner || "", say: m.say ? `Use ${m.say}` : "", uses: m.uses || [], looks: m.looks || [], tags: m.tags || [], formats: m.formats, alpha: m.alpha, tall,
      media: fs.existsSync(mp4) ? `<video src="${rel(mp4)}" autoplay loop muted playsinline preload="metadata"></video>` : `<div class="none">ainda sem amostra: node scripts/gallery.mjs --only ${esc(m.id)}</div>`,
      cmd: `move-render.mjs --move ${m.id}${m.alpha ? " --bg none --format mov" : ""}` });
  }),
];
const uses = [...new Set(["film", ...moves.flatMap((m) => m.uses || [])])];
const looks = [...new Set(moves.flatMap((m) => m.looks || []))].sort();
const html = `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Biblioteca de movimento</title>
<style>
  :root { --bg:#0f0f12; --card:#18181d; --line:#2a2a31; --ink:#f2f1ee; --mute:#9a98a3; --acc:#ff6a3d; }
  * { box-sizing: border-box; } body { margin: 0; background: var(--bg); color: var(--ink); font: 15px/1.45 -apple-system, system-ui, sans-serif; }
  header { position: sticky; top: 0; z-index: 2; padding: 18px 24px 14px; background: rgba(15,15,18,.92); backdrop-filter: blur(12px); border-bottom: 1px solid var(--line); }
  h1 { margin: 0 0 10px; font-size: 20px; } h1 small { color: var(--mute); font-weight: 400; font-size: 14px; margin-left: 8px; }
  .bar { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; }
  .bar button { background: var(--card); color: var(--ink); border: 1px solid var(--line); border-radius: 99px; padding: 5px 12px; cursor: pointer; font: inherit; font-size: 13px; }
  .bar button.on { background: var(--ink); color: var(--bg); } .bar span { color: var(--mute); font-size: 12px; margin: 0 4px 0 10px; }
  .bar input { flex: 1 1 180px; min-width: 0; background: var(--card); color: var(--ink); border: 1px solid var(--line); border-radius: 99px; padding: 6px 14px; font: inherit; }
  main { display: grid; grid-template-columns: repeat(auto-fill, minmax(270px, 1fr)); gap: 18px; padding: 22px 24px 60px; }
  .card { background: var(--card); border: 1px solid var(--line); border-radius: 14px; overflow: hidden; display: flex; flex-direction: column; }
  .card.theme { grid-column: 1 / -1; }
  .media { background: #000; display: grid; place-items: center; } .media.tall { aspect-ratio: 9 / 16; } .card.theme .media { aspect-ratio: auto; }
  .media video, .media img { width: 100%; height: 100%; object-fit: cover; display: block; } .card.theme .media img { height: auto; }
  .none { color: var(--mute); font-size: 12px; padding: 30px; text-align: center; }
  .body { padding: 12px 14px 14px; } h3 { margin: 0 0 4px; font-size: 16px; } .id { color: var(--mute); font-weight: 400; font-size: 12px; margin-left: 4px; }
  p { margin: 0 0 6px; color: #cfcdd6; font-size: 13px; } .say { color: var(--mute); }
  .chips { display: flex; flex-wrap: wrap; gap: 4px; margin: 8px 0; } .chips b, .chips i { font-style: normal; font-size: 11px; padding: 2px 8px; border-radius: 99px; border: 1px solid var(--line); color: var(--mute); }
  .chips b { color: var(--ink); } .chips b.a { border-color: var(--acc); color: var(--acc); }
  code { display: block; font-size: 11px; color: var(--mute); background: #111114; padding: 6px 8px; border-radius: 6px; overflow-wrap: anywhere; }
  .hide { display: none; }
  @media (max-width: 600px) { header, main { padding-left: 16px; padding-right: 16px; } }
</style></head><body>
<header><h1>Biblioteca de movimento <small>${themes.length} temas, ${moves.length} efeitos, mostrados na marca de exemplo</small></h1>
<div class="bar"><span>uso</span><button class="on" data-f="use" data-v="">todos</button>${uses.map((u) => `<button data-f="use" data-v="${esc(u)}">${esc(u)}</button>`).join("")}
<span>visual</span><button class="on" data-f="look" data-v="">todos</button>${looks.map((l) => `<button data-f="look" data-v="${esc(l)}">${esc(l)}</button>`).join("")}
<input id="q" placeholder="buscar: número, logo, transição, citação..."></div></header>
<main>${cards.join("")}</main>
<script>
  const f = { use: "", look: "" }, q = document.getElementById("q");
  const apply = () => { const s = q.value.trim().toLowerCase(); document.querySelectorAll(".card").forEach((c) => {
    const ok = (!f.use || c.dataset.uses.split(" ").includes(f.use)) && (!f.look || c.dataset.looks.split(" ").includes(f.look)) && (!s || c.dataset.text.includes(s));
    c.classList.toggle("hide", !ok); }); };
  document.querySelectorAll(".bar button").forEach((b) => b.onclick = () => { f[b.dataset.f] = b.dataset.v;
    document.querySelectorAll('.bar button[data-f="' + b.dataset.f + '"]').forEach((x) => x.classList.toggle("on", x === b)); apply(); });
  q.oninput = apply;
</script></body></html>
`;
fs.writeFileSync(path.join(SKILL, "gallery.html"), html);

// ---- the catalogue, split by category: CATALOG.md is a short index, catalog/<category>.md holds one
// line per move. Choosing moves reads the index plus the one or two sections a beat needs (~1-2k tokens
// each) instead of every move.json (~60k) or gallery.html (~100k). Each move.json names its "category".
const CATEGORIES = {
  social: "publicações, comentários, mensagens diretas, seguidores, stories, enquetes, reações, depoimentos",
  creator: "vídeos, canais, ferramentas de edição, legendas, miniaturas, capítulos, podcasts, números de lista",
  ai: "agentes, prompts, modelos, respostas de IA, memória, automações, conectores",
  dev: "código, terminal, pull requests, publicações no ar, APIs, registros, páginas de status, sites e domínios",
  productivity: "documentos, e-mail, agenda, tarefas, arquivos, reuniões, busca, cronômetros",
  business: "negócios, notas, pagamentos, preços, carrinhos e pedidos, contratações, reservas, produtos",
  data: "gráficos, estatísticas, classificações, crescimento, comparações por número, mapas",
  paper: "documentos físicos: recortes, cartas, recibos, carimbos, certificados, impressos, livros",
  system: "sistema do celular e do computador: notificações, janelas de aviso, códigos, janelas, configurações, atalhos",
  explain: "decompor uma ideia: partes, etapas, listas, métodos, prós e contras, vereditos, apontar coisas",
};
const clip = (s, n) => { s = String(s || "").replace(/\s+/g, " ").trim(); if (s.length <= n) return s; const c = s.slice(0, n); return c.slice(0, c.lastIndexOf(" ")) + "..."; };
const groups = {};
for (const m of moves.sort((a, b) => a.id.localeCompare(b.id))) {
  const c = CATEGORIES[m.category] ? m.category : "other";
  if (c === "other") console.warn(`! ${m.id}: o move.json não tem uma "category" conhecida (uma entre ${Object.keys(CATEGORIES).join(", ")})`);
  (groups[c] ||= []).push(m);
}
const CATDIR = path.join(MOVES, "catalog");
fs.mkdirSync(CATDIR, { recursive: true });
for (const [c, ms] of Object.entries(groups)) fs.writeFileSync(path.join(CATDIR, `${c}.md`), [
  `# Efeitos: ${c} (gerado por scripts/gallery.mjs, não edite)`,
  "",
  "Cada linha: id | usos | t = pode renderizar transparente | quando usar.",
  "",
  ...ms.map((m) => `- ${m.id} | ${(m.uses || []).join(",")}${m.alpha ? " | t" : ""} | ${clip(m.say || m.oneLiner, 100)}`),
  "",
].join("\n"));
const cat = [
  "# Catálogo de efeitos (gerado por scripts/gallery.mjs, não edite)",
  "",
  "Escolha uma categoria para o que a pessoa está dizendo e leia só esse arquivo em catalog/ (dois no",
  "máximo por batida). Abra os arquivos de um efeito só para o 1 ou 2 efeitos que vão ser renderizados.",
  "Nunca leia o gallery.html nem todos os move.json.",
  "",
  ...Object.keys(CATEGORIES).concat("other").filter((c) => groups[c]).map((c) => `- catalog/${c}.md | ${groups[c].length} efeitos | ${CATEGORIES[c] || "efeitos ainda sem categoria"}`),
  "",
  "## Temas (filmes inteiros)",
  "",
  ...themes.map((t) => `- ${t.id} | ${clip(t.bestFor || t.oneLiner, 100)}`),
  "",
];
fs.writeFileSync(path.join(MOVES, "CATALOG.md"), cat.join("\n"));

// ---- a contact sheet for chat: one frame from the middle of each move preview
const frames = moves.map((m) => path.join(MOVES, m.id, "preview.mp4")).filter((p) => fs.existsSync(p));
if (frames.length) {
  const td = fs.mkdtempSync(path.join(os.tmpdir(), "md-sheet-"));
  frames.forEach((p, i) => run("ffmpeg", ["-y", "-v", "error", "-ss", (duration(p) * 0.6).toFixed(2), "-i", p, "-frames:v", "1", "-vf", "scale=270:480:force_original_aspect_ratio=decrease,pad=270:480:(ow-iw)/2:(oh-ih)/2:color=0x0f0f12", path.join(td, `f${String(i).padStart(3, "0")}.png`)]));
  const cols = Math.min(6, frames.length), rows = Math.ceil(frames.length / cols);
  run("ffmpeg", ["-y", "-v", "error", "-framerate", "1", "-i", path.join(td, "f%03d.png"), "-vf", `tile=${cols}x${rows}:padding=8:margin=8:color=0x0f0f12`, "-frames:v", "1", "-q:v", "3", path.join(SKILL, "gallery.jpg")]);
  fs.rmSync(td, { recursive: true, force: true });
}
console.log(`\n${path.join(SKILL, "gallery.html")}  (${themes.length} temas, ${moves.length} efeitos)${frames.length ? `\n${path.join(SKILL, "gallery.jpg")}  folha de contato` : ""}`);
if (argv.includes("--open")) run(process.platform === "darwin" ? "open" : process.platform === "win32" ? "explorer" : "xdg-open", [path.join(SKILL, "gallery.html")]);
