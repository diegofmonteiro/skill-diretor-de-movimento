#!/usr/bin/env node
// Add your own photo, texture, 3D model or font to the library, with its licence.
//
//   node add-asset.mjs <file|link> --nome <slug> --licenca <code> --origem "<where it came from>"
//                      [--pagina <url>] [--autor "<name>"] [--autorizacao "<reference>"]
//                      [--fonte <id>]                     (needed when the thing is a link)
//                      [--para biblioteca|efeito:<id>]    (default: biblioteca)
//   node add-asset.mjs --listar
//
// Licences accepted: CC0, PD (public domain), OFL-1.1, APACHE-2.0, MIT,
//   PROPRIO (made by you or by Conex Prime), AUTORIZADO (the owner allowed this use;
//   --autorizacao says where that permission is written).
// Without a licence nothing is added: the skill's rule is that every outside material
// has its origin and licence recorded. PROPRIO and AUTORIZADO stay in the library; they
// never go into a shared effect. A link must come from a source registered in
// fontes.json (node scripts/fontes.mjs).
//
// Library: $DIRETOR_DE_MOVIMENTO_HOME/biblioteca/<nome>/  (+ credits.json, indice.json)
import fs from "node:fs";
import path from "node:path";
import { HOME, SKILL, die, readJSON, writeJSON, slugify } from "./lib.mjs";
import { baixar, config } from "./net.mjs";

const argv = process.argv.slice(2);
const opt = (k, d) => (argv.includes(k) ? argv[argv.indexOf(k) + 1] : d);
const LIB = path.join(HOME, "biblioteca");
const IDX = path.join(LIB, "indice.json");

if (argv.includes("--listar")) {
  const idx = readJSON(IDX, { itens: [] });
  if (!idx.itens.length) console.log("The library is empty.");
  for (const i of idx.itens) console.log(`${i.nome.padEnd(28)} ${i.licenca.padEnd(10)} ${i.arquivo}  — ${i.origem}`);
  process.exit(0);
}

const LICENCAS = { CC0: "CC0", PD: "Public domain", "OFL-1.1": "SIL OFL 1.1", "APACHE-2.0": "Apache 2.0", MIT: "MIT", PROPRIO: "Own work", AUTORIZADO: "Used with the owner's permission" };
const EXT = /\.(jpe?g|png|webp|svg|hdr|exr|glb|gltf|bin|ttf|otf|woff2?)$/i;
const MAX = 80 * 1048576;

const valued = new Set(["--nome", "--licenca", "--origem", "--pagina", "--autor", "--autorizacao", "--fonte", "--para"]);
const src = argv.find((a, i) => !a.startsWith("--") && !valued.has(argv[i - 1]));
if (!src) die('usage: add-asset.mjs <file|link> --nome <slug> --licenca <code> --origem "<where from>"   (or --listar)');
const nome = slugify(opt("--nome") || die("--nome <short-name-without-spaces>"));
const lic = String(opt("--licenca") || die(`--licenca is required. One of: ${Object.keys(LICENCAS).join(", ")}`)).toUpperCase();
if (!LICENCAS[lic]) die(`licence "${lic}" is not accepted. Use one of: ${Object.keys(LICENCAS).join(", ")}`);
const origem = opt("--origem") || die('--origem "<where it came from>" is required');
if (lic === "AUTORIZADO" && !opt("--autorizacao")) die('AUTORIZADO needs --autorizacao "<where the permission is written>"');
const para = opt("--para", "biblioteca");
if (para !== "biblioteca" && !/^efeito:[a-z0-9-]+$/.test(para)) die("--para must be biblioteca or efeito:<effect-id>");
if (para !== "biblioteca" && (lic === "PROPRIO" || lic === "AUTORIZADO")) die("PROPRIO and AUTORIZADO material stays in the library: an effect is shared across every client.");

let buf, ext;
if (/^https?:\/\//i.test(src)) {
  const fonte = opt("--fonte") || die("a link needs --fonte <id> (a source registered with: node scripts/fontes.mjs adicionar ...)");
  if (!config().fontes[fonte]) die(`unknown source "${fonte}"`);
  try { buf = await baixar(src, { fonte, cache: false }); } catch (e) { die(e.message); }
  ext = path.extname(new URL(src).pathname).toLowerCase();
} else {
  if (!fs.existsSync(src)) die(`${src} does not exist`);
  buf = fs.readFileSync(src); ext = path.extname(src).toLowerCase();
}
if (!EXT.test(ext)) die(`file type "${ext || "(none)"}" is not accepted (images, HDR, glTF/glb, fonts)`);
if (buf.length > MAX) die(`file is ${(buf.length / 1048576).toFixed(0)} MB; the limit is ${MAX / 1048576} MB`);

const arquivo = `${nome}${ext}`;
const entrada = { file: arquivo, from: origem, license: LICENCAS[lic], licenseCode: lic, added: new Date().toISOString().slice(0, 10) };
for (const [k, o] of [["page", "--pagina"], ["author", "--autor"], ["authorization", "--autorizacao"]]) if (opt(o)) entrada[k] = opt(o);

let destDir;
if (para === "biblioteca") destDir = path.join(LIB, nome);
else {
  const id = para.slice(7), md = path.join(SKILL, "templates", "moves", id);
  if (!fs.existsSync(path.join(md, "move.json"))) die(`there is no effect "${id}"`);
  destDir = path.join(md, "assets");
}
const dest = path.join(destDir, arquivo);
if (fs.existsSync(dest)) die(`${dest} already exists; pick another --nome`);
fs.mkdirSync(destDir, { recursive: true });
fs.writeFileSync(dest, buf);

const credits = path.join(para === "biblioteca" ? destDir : path.dirname(destDir), "credits.json");
const c = readJSON(credits, { sources: [] });
c.sources = [...(c.sources || []), para === "biblioteca" ? entrada : { ...entrada, file: `assets/${arquivo}` }];
writeJSON(credits, c);

if (para === "biblioteca") {
  const idx = readJSON(IDX, { itens: [] });
  idx.itens.push({ nome, arquivo: dest, licenca: lic, origem });
  writeJSON(IDX, idx);
}
console.log(`added ${dest}\nlicence recorded: ${LICENCAS[lic]}  (${credits})`);
