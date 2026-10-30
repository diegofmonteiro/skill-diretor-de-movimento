#!/usr/bin/env node
// Search the HyperFrames effect catalogue (blocks, components, examples), see the
// licence of each one, and bring one into a folder with its credits.json.
//
//   node buscar-efeitos.mjs "<words>" [--tipo bloco|componente|exemplo|todos] [--so-declarada]
//   node buscar-efeitos.mjs --ver <name> [--tipo ...]
//   node buscar-efeitos.mjs --trazer <name> --para <dir> [--tipo ...] [--project <dir>]
//
// Licence rule (decided by the owner of this skill, 2026-10-28): every item is allowed.
//   - the item declares a licence      -> that licence is recorded (licenseSource: "bloco")
//   - the item declares none           -> "Apache-2.0 (licença do repositório, não do bloco)" is
//     recorded (licenseSource: "repositorio"): the repository's own licence, NOT a licence
//     of the item. Material inside the item that is not HeyGen's (fonts, images, logos,
//     designs that imitate a brand) may not be covered; each item gets a note (atencao).
// Nothing is copied into the skill's effects: files go to --para, for you to look at.
// The catalogue is read at the pinned registry commit (modo travado/proprio) or "main" (automatico).
import fs from "node:fs";
import path from "node:path";
import { die, slugify } from "./lib.mjs";
import { baixar, baixarJSON, exigirFonte, modo, registroRef } from "./net.mjs";

const argv = process.argv.slice(2);
const opt = (k, d) => (argv.includes(k) ? argv[argv.indexOf(k) + 1] : d);
const PROJ = opt("--project", "");
const TIPOS = { bloco: ["hyperframes:block", "blocks"], componente: ["hyperframes:component", "components"], exemplo: ["hyperframes:example", "examples"] };
const tipo = opt("--tipo", "todos");
if (tipo !== "todos" && !TIPOS[tipo]) die("--tipo must be bloco, componente, exemplo or todos");
const dirDe = Object.fromEntries(Object.values(TIPOS));
const REPO = "Apache-2.0 (licença do repositório, não do bloco)";
const MARCA = /\b(apple|ios\d*|macos|iphone|ipad|google|meta|facebook|instagram|tiktok|whatsapp|netflix|spotify|youtube|twitter|chatgpt|openai|claude|nyt|new york times|windows|android)\b|tahoe/i;

try { exigirFonte("catalogo", "the effect catalogue"); } catch (e) { die(e.message); }
const ref = registroRef();
const R = `https://raw.githubusercontent.com/heygen-com/hyperframes/${ref}/registry`;
const get = (p) => baixarJSON(`${R}/${p}`, { fonte: "catalogo", projeto: PROJ }).catch((e) => die(e.message));

const detalhe = async (it) => {
  const dir = dirDe[it.type];
  const j = await get(`${dir}/${it.name}/registry-item.json`);
  const declarada = j.license ? String(j.license) : "";
  const texto = [it.name, j.title, j.description, ...(j.tags || []), ...(j.files || []).map((f) => f.path)].join(" ");
  const atencao = [];
  if (!declarada) atencao.push("o item não declara licença: vale só a licença do repositório (Apache-2.0), que pode não cobrir material de terceiros dentro dele");
  if (MARCA.test(texto)) atencao.push("cita, imita ou traz arquivos de marca de terceiro (nome, ícones ou modelos): confira marca registrada e desenho antes de usar com cliente");
  return { nome: it.name, tipo: it.type, dir, titulo: j.title || it.name, descricao: j.description || "", tags: j.tags || [], arquivos: j.files || [], licenca: declarada || REPO, origemLicenca: declarada ? "bloco" : "repositorio", atencao };
};

const idx = await get("registry.json");
const itens = idx.items.filter((i) => tipo === "todos" || i.type === TIPOS[tipo][0]);
const lotes = async (lista, f) => { const out = []; for (let i = 0; i < lista.length; i += 20) out.push(...(await Promise.all(lista.slice(i, i + 20).map(f)))); return out; };

if (argv.includes("--ver") || argv.includes("--trazer")) {
  const nome = opt("--ver") || opt("--trazer");
  const it = itens.find((i) => i.name === nome) || die(`no item "${nome}" in the catalogue (${tipo}). Search first: node scripts/buscar-efeitos.mjs "<words>"`);
  const d = await detalhe(it);
  if (argv.includes("--ver")) {
    console.log(`${d.nome} (${d.tipo.replace("hyperframes:", "")})\n  ${d.titulo}\n  ${d.descricao}\n  licence: ${d.licenca}${d.origemLicenca === "repositorio" ? "  [from the repository, not the item]" : ""}\n  files: ${d.arquivos.map((f) => f.path).join(", ")}`);
    for (const a of d.atencao) console.log(`  attention: ${a}`);
    process.exit(0);
  }
  const dest = path.join(path.resolve(opt("--para") || die("--para <dir>")), slugify(d.nome));
  fs.mkdirSync(dest, { recursive: true });
  const ausentes = [];
  for (const f of d.arquivos) {
    const out = path.join(dest, f.path);
    if (!path.resolve(out).startsWith(path.resolve(dest) + path.sep)) die(`file path "${f.path}" leaves the folder; refusing`);
    fs.mkdirSync(path.dirname(out), { recursive: true });
    // the catalogue sometimes lists a file that is not in the repository (HTTP 404): note it and go on
    try { fs.writeFileSync(out, await baixar(`${R}/${d.dir}/${d.nome}/${f.path}`, { fonte: "catalogo", projeto: PROJ })); }
    catch (e) { if (/HTTP 404/.test(String(e.message))) ausentes.push(f.path); else throw e; }
  }
  d.arquivos = d.arquivos.filter((f) => !ausentes.includes(f.path));
  if (ausentes.length) d.atencao.push(`o catálogo lista arquivo(s) que não existem no repositório e não foram trazidos: ${ausentes.join(", ")}`);
  const credito = { sources: [{ file: d.arquivos.map((f) => f.path), from: `HyperFrames registry, ${d.dir}/${d.nome}, commit ${ref}`, page: `https://github.com/heygen-com/hyperframes/tree/${ref}/registry/${d.dir}/${d.nome}`, license: d.licenca, licenseSource: d.origemLicenca, ...(d.atencao.length ? { atencao: d.atencao } : {}), added: new Date().toISOString().slice(0, 10) }] };
  fs.writeFileSync(path.join(dest, "credits.json"), JSON.stringify(credito, null, 2));
  // what the catalogue says about the item, for converter-bloco.mjs
  fs.writeFileSync(path.join(dest, "bloco.json"), JSON.stringify({ nome: d.nome, tipo: d.tipo, titulo: d.titulo, descricao: d.descricao, tags: d.tags, atencao: d.atencao }, null, 2));
  console.log(`brought ${d.arquivos.length} file(s) to ${dest}\nlicence recorded: ${d.licenca}`);
  for (const a of d.atencao) console.log(`attention: ${a}`);
  process.exit(0);
}

const q = argv.find((a, i) => !a.startsWith("--") && !["--tipo", "--project"].includes(argv[i - 1]));
if (!q) die('usage: buscar-efeitos.mjs "<words>" [--tipo bloco|componente|exemplo|todos] [--so-declarada]   |   --ver <name>   |   --trazer <name> --para <dir>');
const palavras = q.toLowerCase().split(/\s+/).filter(Boolean);
const todos = await lotes(itens, (i) => detalhe(i).catch(() => null));
let achados = todos.filter(Boolean).filter((d) => palavras.every((w) => [d.nome, d.titulo, d.descricao, ...d.tags].join(" ").toLowerCase().includes(w)));
if (argv.includes("--so-declarada")) achados = achados.filter((d) => d.origemLicenca === "bloco");
if (!achados.length) die(`nothing in the catalogue for "${q}" (${todos.length} items searched, registry ${ref.slice(0, 12)})`);
console.log(`${achados.length} item(s) for "${q}"  (catalogue ${todos.length} items, registry ${ref.slice(0, 12)}, mode ${modo()})\n`);
for (const d of achados) console.log(`${d.nome.padEnd(34)} ${d.tipo.replace("hyperframes:", "").padEnd(10)} ${d.origemLicenca === "bloco" ? d.licenca : "repo: Apache-2.0"}${d.atencao.some((a) => a.includes("marca")) ? "   [brand]" : ""}`);
console.log(`\nSee one: node scripts/buscar-efeitos.mjs --ver <name>\nBring it: node scripts/buscar-efeitos.mjs --trazer <name> --para <dir>`);
