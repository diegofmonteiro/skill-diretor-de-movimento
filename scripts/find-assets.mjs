#!/usr/bin/env node
// Find real photographs of objects, hands, people and surfaces that are free to
// use with no credit and no permission (CC0 and public domain only), download
// candidates, and draw a labelled sheet to pick from.
//
//   node find-assets.mjs "<query>" --out <dir> [--n 12] [--min 1400] [--cutout] [--title word] [--so <source-id>]
//   --so searches only that source of yours (it needs a search adapter: node fontes.mjs adaptador <id>).
//   Without --so: Wikimedia, Openverse and every source of yours that has an adapter.
//   node find-assets.mjs --polyhaven model|texture|hdri <id> --out <dir> [--res 1k]
//   node find-assets.mjs --ambientcg "<material>" --out <dir> [--res 2K]
//
// Sources: Wikimedia Commons (the high-resolution files), Openverse (indexes Flickr
// Commons and museums; rate-limited, skipped when it refuses) and Poly Haven (CC0
// 3D models as glTF, photo-scanned textures, studio HDRIs). No keys, no accounts.
// Writes <out>/<slug>/NN.jpg, credits.json (title, creator, licence, page), and
// sheet.png. --cutout also lifts the subject of each into NN-cut.png (cutout.mjs).
// Then LOOK at sheet.png and choose; never take the first result blind.
import fs from "node:fs";
import path from "node:path";
import { SKILL, die, run, sheet, slugify } from "./lib.mjs";
import { adaptadoresAtivos, buscarEm } from "./adaptadores.mjs";
import { baixar, baixarJSON, baixarPara, cacheGravar, cacheLer, modo } from "./net.mjs";

const argv = process.argv.slice(2);
const opt = (k, d) => (argv.includes(k) ? argv[argv.indexOf(k) + 1] : d);
const PROJ = opt("--project", ""); // optional: record every file's fingerprint in <project>/assets.lock.json
const falhar = (e) => die(`${e.message}${modo() === "automatico" ? "" : `\n(mode: ${modo()})`}`);
const temUnzip = () => { if (run("unzip", ["-v"]).code === 127) die("ambientCG downloads are zip files and the 'unzip' program is missing. Install it: sudo apt install unzip (Linux) or it comes with macOS."); };
// ambientCG: CC0 scanned materials (paper, cardboard, fabric, tape...), colour map only
if (argv.includes("--ambientcg")) {
  const term = argv[argv.indexOf("--ambientcg") + 1], res = argv.includes("--res") ? argv[argv.indexOf("--res") + 1] : "2K";
  const dst = path.join(path.resolve(argv[argv.indexOf("--out") + 1]), "acg-" + slugify(term)); fs.mkdirSync(dst, { recursive: true });
  let d;
  try { d = await baixarJSON(`https://ambientcg.com/api/v2/full_json?type=Material&q=${encodeURIComponent(term)}&limit=12&include=downloadData,imageData`, { fonte: "ambientcg", projeto: PROJ }); } catch (e) { falhar(e); }
  const items = [];
  for (const a of d.foundAssets || []) {
    const dl = a.downloadFolders?.default?.downloadFiletypeCategories?.zip?.downloads?.find((x) => x.attribute === `${res}-JPG`); if (!dl) continue;
    const key = `ambientcg:${a.assetId}:${res}`, outDir = path.join(dst, a.assetId);
    try {
      let jpg = modo() !== "automatico" ? cacheLer(key) : null; // travado / proprio: the colour map is kept, fingerprinted
      if (jpg) { fs.mkdirSync(outDir, { recursive: true }); fs.writeFileSync(path.join(outDir, `${a.assetId}_${res}-JPG_Color.jpg`), jpg); }
      else {
        temUnzip();
        const zip = path.join(dst, `${a.assetId}.zip`);
        await baixarPara(dl.fullDownloadPath || dl.downloadLink, zip, { fonte: "ambientcg", cache: false });
        run("unzip", ["-o", "-q", zip, "*Color.jpg", "-d", outDir]); fs.rmSync(zip, { force: true });
        const got = fs.existsSync(outDir) ? fs.readdirSync(outDir).find((f) => /Color\.jpg$/.test(f)) : null;
        if (got) cacheGravar(key, fs.readFileSync(path.join(outDir, got)), { fonte: "ambientcg" });
      }
    } catch (e) { console.log(`  ${a.assetId}: ${e.message}`); continue; }
    const col = fs.existsSync(outDir) ? fs.readdirSync(outDir).find((f) => /Color\.jpg$/.test(f)) : null;
    if (col) items.push({ src: path.join(outDir, col), label: `${a.assetId} (CC0, ambientCG)` });
  }
  if (!items.length) die(`no ambientCG material saved for "${term}" (see the lines above if any download failed)`);
  fs.writeFileSync(path.join(dst, "credits.json"), JSON.stringify({ source: "ambientCG", license: "CC0", items: items.map((i) => i.label) }));
  console.log(`${items.length} materials in ${dst}\nsheet: ${sheet(items, path.join(dst, "sheet.png"), { cols: 4, cell: 360, aspect: 1, title: `ambientCG "${term}" (CC0)` })}`);
  process.exit(0);
}
// Poly Haven: one asset by id, all its files (a glTF pulls its .bin and textures)
if (argv.includes("--polyhaven")) {
  const kind = argv[argv.indexOf("--polyhaven") + 1], pid = argv[argv.indexOf("--polyhaven") + 2];
  const res = argv.includes("--res") ? argv[argv.indexOf("--res") + 1] : "1k";
  const dst = path.join(path.resolve(argv[argv.indexOf("--out") + 1]), pid); fs.mkdirSync(dst, { recursive: true });
  let f;
  try { f = await baixarJSON(`https://api.polyhaven.com/files/${pid}`, { fonte: "polyhaven", projeto: PROJ }); } catch (e) { falhar(e); }
  const get = async (url, to) => { try { await baixarPara(url, to, { fonte: "polyhaven", projeto: PROJ }); } catch (e) { falhar(e); } };
  if (kind === "model") {
    const g = f.gltf?.[res]?.gltf || die(`no ${res} glTF for ${pid}`);
    await get(g.url, path.join(dst, path.basename(g.url)));
    for (const [rel, inc] of Object.entries(g.include || {})) await get(inc.url, path.join(dst, rel));
    console.log(`${pid}: ${path.join(dst, path.basename(g.url))}`);
  } else if (kind === "texture") {
    for (const map of ["Diffuse", "nor_gl", "Rough"]) { const u = f[map]?.[res]?.jpg?.url; if (u) await get(u, path.join(dst, path.basename(u))); }
    console.log(`${pid}: ${fs.readdirSync(dst).join(", ")}`);
  } else if (kind === "hdri") {
    const u = f.hdri?.[res]?.hdr?.url || die(`no ${res} hdri for ${pid}`); await get(u, path.join(dst, path.basename(u)));
    console.log(`${pid}: ${path.join(dst, path.basename(u))}`);
  } else die("--polyhaven model|texture|hdri <id>");
  fs.writeFileSync(path.join(dst, "credits.json"), JSON.stringify({ source: "Poly Haven", id: pid, license: "CC0", page: `https://polyhaven.com/a/${pid}` }));
  process.exit(0);
}
const q = argv.find((a, i) => !a.startsWith("--") && !(argv[i - 1] || "").startsWith("--")) || die('usage: find-assets.mjs "<query>" --out <dir>');
const out = path.join(path.resolve(opt("--out") || die("--out <dir>")), slugify(q));
const N = +opt("--n", 12), MIN = +opt("--min", 1400), TITLE = (opt("--title", "") || "").toLowerCase();
const UA = { "User-Agent": "diretor-de-movimento/1.0 (open-licence asset search)" };
fs.mkdirSync(out, { recursive: true });
const free = (l) => /^(cc0|pdm|public domain|pd\b|pd-|no restrictions)/i.test(String(l || "").trim());
const strip = (s) => String(s || "").replace(/<[^>]+>/g, "").trim().slice(0, 120);

const SO = opt("--so", "");
const found = [], falhas = [];
if (!SO) try { // Wikimedia Commons: search files, keep CC0 / public domain, prefer big
  const u = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(q + " filetype:bitmap")}&gsrnamespace=6&gsrlimit=80&prop=imageinfo&iiprop=url|size|extmetadata&iiurlwidth=2000&format=json`;
  const d = await baixarJSON(u, { fonte: "wikimedia", headers: UA, projeto: PROJ });
  for (const p of Object.values(d.query?.pages || {})) {
    const ii = p.imageinfo?.[0]; if (!ii) continue; const m = ii.extmetadata || {};
    const lic = m.LicenseShortName?.value || m.License?.value;
    if (!free(lic) || Math.max(ii.width, ii.height) < MIN) continue;
    if (TITLE && !p.title.toLowerCase().includes(TITLE)) continue;
    found.push({ src: "wikimedia", title: p.title.replace(/^File:/, ""), url: ii.thumburl || ii.url, w: ii.width, h: ii.height, license: strip(lic), creator: strip(m.Artist?.value), page: ii.descriptionurl });
  }
} catch (e) { falhas.push(`wikimedia: ${e.message}`); console.log(`  wikimedia: ${e.message}`); }
if (!SO) try { // Openverse
  const u = `https://api.openverse.org/v1/images/?q=${encodeURIComponent(q)}&license=cc0,pdm&page_size=40`;
  const d = await baixarJSON(u, { fonte: "openverse", headers: UA, projeto: PROJ });
  for (const r of d.results || []) {
    if (Math.max(r.width || 0, r.height || 0) < Math.min(MIN, 1000)) continue;
    if (found.some((f) => f.url === r.url)) continue;
    found.push({ src: r.source, title: strip(r.title), url: r.url, w: r.width, h: r.height, license: r.license, creator: strip(r.creator), page: r.foreign_landing_url });
  }
} catch (e) { falhas.push(`openverse: ${e.message}`); console.log(`  openverse: ${e.message}`); }
for (const id of SO ? [SO] : adaptadoresAtivos()) { // sources you added, one adapter each
  try {
    const { itens, descartes } = await buscarEm(id, q, { n: 40, min: MIN });
    for (const r of itens) if (!found.some((f) => f.url === r.url) && (!r.w || Math.max(r.w, r.h) >= Math.min(MIN, 1000)) && (!TITLE || r.title.toLowerCase().includes(TITLE))) found.push(r);
    if (descartes.licenca || descartes.endereco) console.log(`  ${id}: dropped ${descartes.licenca} result(s) with a licence you did not declare and ${descartes.endereco} from another site`);
  } catch (e) { falhas.push(`${id}: ${e.message}`); console.log(`  ${id}: ${e.message}`); }
}
const tentadas = SO ? 1 : 2 + adaptadoresAtivos().length;
if (!found.length) die(falhas.length && falhas.length >= tentadas ? `all sources failed, so this is not about the words you searched:\n  ${falhas.join("\n  ")}\n(mode: ${modo()}; see node scripts/fontes.mjs)` : `nothing CC0 / public domain over ${MIN}px for "${q}": try other words, or --min 1000${falhas.length ? `\n  (one source failed: ${falhas[0]})` : ""}`);
found.sort((a, b) => (b.src === "wikimedia") - (a.src === "wikimedia") || Math.max(b.w, b.h) - Math.max(a.w, a.h));

const kept = [];
for (const f of found) {
  if (kept.length >= N) break;
  const file = path.join(out, `${String(kept.length + 1).padStart(2, "0")}.jpg`);
  try {
    const buf = await baixar(f.url, { fonte: f.fonte || (f.src === "wikimedia" ? "wikimedia" : "openverse"), headers: UA, projeto: PROJ, tentativas: 4 }).catch(() => null);
    if (!buf || buf.length < 20000) continue;
    fs.writeFileSync(file + ".src", buf);
    const c = run("ffmpeg", ["-v", "error", "-y", "-i", file + ".src", "-vf", "scale='min(2400,iw)':-2", "-q:v", "2", file]);
    fs.rmSync(file + ".src", { force: true }); if (c.code) continue;
    kept.push({ file: path.basename(file), ...f });
    if (argv.includes("--cutout")) {
      const cut = run("node", [path.join(SKILL, "scripts", "cutout.mjs"), file, file.replace(/\.jpg$/, "-cut.png")]);
      kept.at(-1).cutout = cut.code ? null : path.basename(file).replace(/\.jpg$/, "-cut.png");
    }
  } catch {}
}
fs.writeFileSync(path.join(out, "credits.json"), JSON.stringify(kept, null, 2));
const items = kept.map((k) => ({ src: path.join(out, k.cutout || k.file), label: `${k.file.replace(".jpg", "")} ${k.w}x${k.h} ${k.license}: ${k.title}` }));
const sh = sheet(items, path.join(out, "sheet.png"), { cols: 4, cell: 360, aspect: 1.2, well: "#e85a5a", title: `"${q}" (CC0 / public domain)` });
console.log(`${kept.length} of ${found.length} free candidates for "${q}" in ${out}\nsheet: ${sh}`);
