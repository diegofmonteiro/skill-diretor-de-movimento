#!/usr/bin/env node
// Turn a block brought from the HyperFrames catalogue (buscar-efeitos.mjs --trazer) into an
// effect of this skill: templates/moves/<id>/ with index.html, move.json, credits.json and assets.
//
//   node converter-bloco.mjs --de <pasta do bloco trazido> --id <id do efeito> [--categoria data]
//        [--nome "Nome em português"] [--resumo "uma frase"] [--quando "quando usar"]
//        [--usos broll,overlay] [--visual studio,glass] [--tags a,b,c] [--forcar]
//
// What it does:
//   - reads the block's composition (size, duration, variables) and keeps it as index.html
//   - swaps the gsap CDN script for the bundled copy (assets/gsap.min.js), so the render does not need the internet
//   - copies the block's other files (assets/...) and keeps the credits, adding the effect id
//   - writes move.json from what it read; "traducao": "pendente" stays until a person translates the
//     texts that appear in the video (defaults of the variables and fixed text) and removes that key
// What it does not do: translate, restyle with the brand, or render. A block keeps its own colours
// ("tema": "proprio"). Run `node move-render.mjs --move <id>` afterwards to make preview.mp4.
// Changes only templates/moves/<id>/ (never overwrites without --forcar).
import fs from "node:fs";
import path from "node:path";
import { SKILL, die, slugify } from "./lib.mjs";

const argv = process.argv.slice(2);
const opt = (k, d) => (argv.includes(k) ? argv[argv.indexOf(k) + 1] : d);
const de = path.resolve(opt("--de") || die('usage: converter-bloco.mjs --de <folder of the brought block> --id <effect id> [--categoria data] [--nome "..."] [--resumo "..."] [--quando "..."]'));
if (!fs.existsSync(de)) die(`folder not found: ${de}`);
const htmls = fs.readdirSync(de).filter((f) => f.endsWith(".html"));
if (htmls.length !== 1) die(`expected exactly one .html in ${de}, found ${htmls.length}`);
const id = slugify(opt("--id") || die("--id <effect id> is required"));
const DEST = path.join(SKILL, "templates", "moves", id);
if (fs.existsSync(DEST) && !argv.includes("--forcar")) die(`templates/moves/${id} already exists (use --forcar to replace it)`);

const CATEGORIAS = ["data", "business", "paper", "social", "productivity", "creator", "explain", "ai", "system", "dev"];
const categoria = opt("--categoria", "explain");
if (!CATEGORIAS.includes(categoria)) die(`--categoria must be one of ${CATEGORIAS.join(", ")}`);

let html = fs.readFileSync(path.join(de, htmls[0]), "utf8");
const num = (k) => { const m = html.match(new RegExp(`data-${k}="([\\d.]+)"`)); return m ? +m[1] : 0; };
const W = num("width"), H = num("height"), dur = num("duration");
const comp = (html.match(/data-composition-id="([^"]+)"/) || [])[1];
if (!W || !H || !dur || !comp) die("could not read width, height, duration and composition id from the block");
const aspect = W === H ? "1:1" : H > W ? "9:16" : "16:9";
const info = (() => { try { return JSON.parse(fs.readFileSync(path.join(de, "bloco.json"), "utf8")); } catch { return {}; } })();
const cred = (() => { try { return JSON.parse(fs.readFileSync(path.join(de, "credits.json"), "utf8")); } catch { return { sources: [] }; } })();

// scripts that load from the internet: gsap is replaced by the bundled copy, anything else is reported
const avisos = [];
html = html.replace(/<script\b[^>]*\bsrc="(https?:\/\/[^"]+)"[^>]*><\/script>/g, (all, url) => {
  if (/gsap(\.min)?\.js/.test(url)) return '<script src="assets/gsap.min.js"></script>';
  avisos.push(`depends on ${url}: it needs internet at render time (modo automatico) or a local copy`);
  return all;
});
// the timeline registers under the composition id; frame-audit and the renderer both find it there

fs.rmSync(DEST, { recursive: true, force: true });
fs.mkdirSync(DEST, { recursive: true });
fs.writeFileSync(path.join(DEST, "index.html"), html);
for (const e of fs.readdirSync(de, { withFileTypes: true })) {
  if (e.isFile() && /\.(html|json|md)$/.test(e.name)) continue;
  fs.cpSync(path.join(de, e.name), path.join(DEST, e.name), { recursive: true });
}

const title = info.titulo || comp;
const move = {
  id, name: opt("--nome", title), oneLiner: opt("--resumo", info.descricao || ""),
  category: categoria, kind: "effect", uses: (opt("--usos", "broll")).split(","), looks: (opt("--visual", "studio")).split(","), from: "catalogo",
  tags: (opt("--tags") ? opt("--tags").split(",") : info.tags || []).map((t) => t.trim()).filter(Boolean),
  formats: [aspect], duration: dur, alpha: false, tema: "proprio",
  say: opt("--quando", ""),
  origem: { registro: "HyperFrames", bloco: info.nome || comp },
  ...(opt("--nome") && opt("--resumo") && opt("--quando") ? {} : { traducao: "pendente" }),
};
if (!argv.includes("--quando")) move.say = "";
fs.writeFileSync(path.join(DEST, "move.json"), JSON.stringify(move, null, 1));

const fontes = (cred.sources || []).map((s) => ({ ...s, efeito: id }));
if (info.atencao?.length) for (const s of fontes) s.atencao = [...new Set([...(s.atencao || []), ...info.atencao])];
fs.writeFileSync(path.join(DEST, "credits.json"), JSON.stringify({ sources: fontes }, null, 1));

console.log(`effect created: templates/moves/${id}  (${aspect}, ${dur}s, composition ${comp})`);
for (const a of avisos) console.log(`warning: ${a}`);
for (const a of info.atencao || []) console.log(`attention: ${a}`);
if (move.traducao) console.log('next: translate the on-screen texts, fill name/oneLiner/say, then remove "traducao" from move.json');
console.log(`next: node scripts/move-render.mjs --move ${id} --out templates/moves/${id}/preview.mp4   (then node scripts/auditar-creditos.mjs)`);
