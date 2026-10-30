#!/usr/bin/env node
// Audit the credits of every effect: each image, font, texture or model inside an
// effect's assets/ must be listed in that effect's credits.json with an origin and
// a licence. Lists what is missing and what is still marked PENDENTE.
//
//   node auditar-creditos.mjs            report (exit code 1 when something is missing)
//   node auditar-creditos.mjs --json     the same, as JSON
//
// Reads files only; changes nothing.
import fs from "node:fs";
import path from "node:path";
import { SKILL, readJSON } from "./lib.mjs";

const MOVES = path.join(SKILL, "templates", "moves");
const ASSET = /\.(jpe?g|png|webp|svg|hdr|exr|glb|gltf|bin|ttf|otf|woff2?)$/i;
const walk = (d) => (fs.existsSync(d) ? fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)])) : []);

const faltando = [], pendentes = [], liberados = [];
let efeitos = 0, arquivos = 0;
for (const id of fs.readdirSync(MOVES).filter((n) => fs.existsSync(path.join(MOVES, n, "move.json")))) {
  const dir = path.join(MOVES, id), files = walk(path.join(dir, "assets")).filter((f) => ASSET.test(f)).map((f) => path.relative(dir, f).split(path.sep).join("/"));
  if (!files.length) continue;
  efeitos++;
  const creditsFile = path.join(dir, "credits.json");
  const credits = fs.existsSync(creditsFile) ? readJSON(creditsFile, { sources: [] }) : null;
  const listed = new Map();
  for (const s of credits?.sources || []) for (const f of String(s.file).split(",").map((x) => x.trim())) listed.set(f, s);
  for (const f of files) {
    arquivos++;
    const s = listed.get(f);
    if (!s) faltando.push({ efeito: id, arquivo: f, motivo: credits ? "not listed in credits.json" : "no credits.json" });
    else if (s.licenseCode === "LIBERADO") liberados.push({ efeito: id, arquivo: f, por: s.liberadoPor || "" });
    else if (/pendente|a confirmar/i.test(`${s.license} ${s.licenseCode || ""}`)) pendentes.push({ efeito: id, arquivo: f });
  }
}
if (process.argv.includes("--json")) console.log(JSON.stringify({ efeitos, arquivos, faltando, pendentes, liberados }, null, 2));
else {
  console.log(`${efeitos} effects with outside material, ${arquivos} files checked`);
  console.log(faltando.length ? `\nMISSING (${faltando.length}):\n` + faltando.map((x) => `  ${x.efeito}: ${x.arquivo} (${x.motivo})`).join("\n") : "\nMissing: none");
  console.log(liberados.length ? `\nRELEASED by the owner, origin not documented (${liberados.length}): ` + [...new Set(liberados.map((x) => x.efeito))].join(", ") : "");
  console.log(pendentes.length ? `\nPENDING licence (${pendentes.length}), not for client work until confirmed:\n` + [...new Set(pendentes.map((x) => x.efeito))].map((e) => `  ${e}: ${pendentes.filter((x) => x.efeito === e).length} file(s)`).join("\n") : "\nPending: none");
}
process.exit(faltando.length ? 1 : 0);
