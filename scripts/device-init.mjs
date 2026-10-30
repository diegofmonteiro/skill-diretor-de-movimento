#!/usr/bin/env node
// A real 3D MacBook and/or iPhone with the brand's own UI on the screens.
//
//   node device-init.mjs --project <dir> --preset macbook|duo|iphone --start <spec> --duration <s>
//                        [--id dev] [--rim #hex] [--env #hex] [--show-logo]
//   The models come with a third party's logo as separate meshes. They are hidden
//   by default; --show-logo brings them back (not for client work: licence pending).
//
// Reads the screen content from <project>/device/:
//   laptop.html   the MacBook screen, laid out at 1440x900  (macbook, duo)
//   phone.html    the iPhone screen, laid out at 390x844    (duo, iphone)
//   screen.css    styles for both (optional)
//   screen.js     defines window.MD_SCREEN_<id> = (p, t, S) => { ... } to animate
//                 that HTML: p is 0..1 over the screen's active span (optional)
// Build the screens from REAL brand material: the product's own screenshots,
// its real copy and numbers, its real forms. Never an invented dashboard.
//
// Writes film/compositions/<id>.html and fetches the GLTF models (from
// HyperFrames' vfx-iphone-device block, via the registry) into film/models/.
// Then mount it in index.html with the printed host line. The scene is
// transparent: the film's silk and glass show around the device.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { SKILL, die, hf, lastJSON, logEvent, makeTime, project, readJSON } from "./lib.mjs";
import { bibliotecas3d, cacheGravar, cacheLer, exigirFonte, lockRegistrar, modo, registroRef } from "./net.mjs";

const argv = process.argv.slice(2);
const opt = (k, d) => (argv.includes(k) ? argv[argv.indexOf(k) + 1] : d);
const P = project(opt("--project", "."));
const id = opt("--id", "dev");
if (!/^[a-z][a-z0-9-]*$/.test(id)) die("--id: lowercase letters, digits and dashes");
const preset = opt("--preset", "macbook");
if (!["macbook", "duo", "iphone"].includes(preset)) die("--preset must be macbook, duo or iphone");
const G = readJSON(P.file("sound", "beats.json"));
const T = makeTime({ bpm: G.bpm, beatsPerBar: G.beatsPerBar, cues: G.cues });
const start = T.t(opt("--start") ?? die("--start <time spec>"));
const dur = parseFloat(opt("--duration") ?? die("--duration <seconds>"));
const film = P.file("film");
const dev = P.file("device");
const read = (f, need) => { const p = path.join(dev, f); if (fs.existsSync(p)) return fs.readFileSync(p, "utf8"); if (need) die(`missing ${p}`); return ""; };
const laptop = preset !== "iphone", phone = preset !== "macbook";
const lapHtml = laptop ? read("laptop.html", true) : "";
const phoneHtml = phone ? read("phone.html", true) : "";

// The models come from the registry at build time; the skill never ships them.
// automatico: the registry's main branch, as before. travado / proprio: a fixed
// commit, and the files are kept in the cache with a fingerprint so the same
// models come back next time without the network.
const models = path.join(film, "models");
const ref = registroRef();
const nomes = ["macbook.glb", "iphone.glb"];
if (!nomes.every((n) => fs.existsSync(path.join(models, n)))) {
  fs.mkdirSync(models, { recursive: true });
  let veioDoCache = false;
  if (modo() !== "automatico") {
    try {
      const hits = nomes.map((n) => cacheLer(`registro:${ref}:${n}`));
      if (hits.every(Boolean)) { nomes.forEach((n, i) => { fs.writeFileSync(path.join(models, n), hits[i]); lockRegistrar(P.dir, `registro:${ref}:${n}`, hits[i]); }); veioDoCache = true; }
    } catch (e) { die(e.message); }
  }
  if (!veioDoCache) {
    try { exigirFonte("bibliotecas", "the 3D device models"); } catch (e) { die(e.message); }
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "md-device-"));
    fs.writeFileSync(path.join(tmp, "hyperframes.json"), JSON.stringify({ registry: `https://raw.githubusercontent.com/heygen-com/hyperframes/${ref}/registry`, paths: { blocks: "compositions", components: "compositions/components", assets: "assets" } }));
    fs.writeFileSync(path.join(tmp, "index.html"), "<!doctype html><html><body></body></html>");
    const r = hf(["add", "vfx-iphone-device", "--json", "--no-clipboard"], { cwd: tmp, timeout: 300000 });
    const j = lastJSON(r.out);
    if (!fs.existsSync(path.join(tmp, "models", "macbook.glb"))) die(`could not fetch the device models (registry ${ref.slice(0, 12)}): ${(r.err || "").slice(-400)} ${j ? JSON.stringify(j).slice(0, 300) : ""}`);
    for (const n of nomes) {
      const buf = fs.readFileSync(path.join(tmp, "models", n));
      fs.copyFileSync(path.join(tmp, "models", n), path.join(models, n));
      cacheGravar(`registro:${ref}:${n}`, buf, { fonte: "bibliotecas" });
      try { lockRegistrar(P.dir, `registro:${ref}:${n}`, buf); } catch (e) { die(e.message); }
    }
    fs.rmSync(tmp, { recursive: true, force: true });
  }
}

const brand = readJSON(P.file("brand", "brand.json"), { colors: {} });
const cfg = { preset, laptop, phone, rim: opt("--rim", brand.colors?.accent || "#6366f1"), env: opt("--env", "#1a1a2e"), fill: "#ffd9c2", shadow: 0.4, showLogo: argv.includes("--show-logo") };
let html = fs.readFileSync(path.join(SKILL, "templates", "hyperframes", "md-device.html"), "utf8");
let libs;
const usaDraco = nomes.some((n) => fs.readFileSync(path.join(models, n)).includes("KHR_draco_mesh_compression"));
try { libs = await bibliotecas3d({ quais: ["three", "gltf"], draco: true, decodificador: usaDraco, dest: film, base: film, projeto: P.dir }); } catch (e) { die(e.message); }
const fill = { THREE_URL: libs.three, GLTFLOADER_URL: libs.gltf, DRACOLOADER_URL: libs.dracoLoader, DRACO_PATH: libs.dracoPath, ID: id, W: P.meta.width, H: P.meta.height, DUR: dur, CONFIG: JSON.stringify(cfg), LAPTOP_HTML: lapHtml, PHONE_HTML: phoneHtml, SCREEN_CSS: read("screen.css"), SCREEN_JS: read("screen.js") };
for (const [k, v] of Object.entries(fill)) html = html.split(`{{${k}}}`).join(String(v));
if (/\{\{[A-Z_]+\}\}/.test(html)) die(`unfilled placeholder: ${html.match(/\{\{[A-Z_]+\}\}/)[0]}`);
fs.mkdirSync(path.join(film, "compositions"), { recursive: true });
fs.writeFileSync(path.join(film, "compositions", `${id}.html`), html);
logEvent(P.dir, { phase: "device-init", secs: 0, note: `${preset} ${id} at ${start}s for ${dur}s` });
console.log(`device scene written: film/compositions/${id}.html (${preset}, ${dur}s)
mount it in index.html, ABOVE the silk and below the vignette:
  <div id="${id}" class="clip" data-composition-id="${id}" data-composition-src="compositions/${id}.html" data-start="${start}" data-duration="${dur}" data-width="${P.meta.width}" data-height="${P.meta.height}" data-track-kind="graphics"></div>`);
