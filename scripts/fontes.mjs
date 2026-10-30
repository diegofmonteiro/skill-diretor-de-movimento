#!/usr/bin/env node
// Choose where the skill may look for material outside itself.
//
//   node fontes.mjs                         show the mode, every source (on/off) and the cache
//   node fontes.mjs modo <automatico|travado|proprio>
//   node fontes.mjs ativar <id>             turn a source on
//   node fontes.mjs desativar <id>          turn a source off
//   node fontes.mjs adicionar <id> --nome "<name>" --host <site[,site]> --licencas <CC0,...> [--uso "<what it brings>"]
//   node fontes.mjs adaptador <id>          create the search adapter of a source you added (then edit it)
//   node fontes.mjs remover <id>            remove a source YOU added (the built-in ones can only be turned off)
//   node fontes.mjs cache                   size of the local copies
//   node fontes.mjs cache limpar            delete the local copies (they are downloaded again when needed)
//
// Modes:  automatico = fetch live from the sources that are on (default)
//         travado    = keep a fingerprinted local copy; the same inputs every time
//         proprio    = never use the network; only the skill's own effects and your library
// MD_FONTES=<mode> overrides the saved mode for one command. Your choices live in
// $DIRETOR_DE_MOVIMENTO_HOME/fontes.json.
import fs from "node:fs";
import path from "node:path";
import { HOME, SKILL, die, readJSON, writeJSON } from "./lib.mjs";
import { arquivoAdaptador } from "./adaptadores.mjs";
import { MODOS, arquivoUsuario, config, modo, registroRef } from "./net.mjs";

const argv = process.argv.slice(2);
const [cmd, arg1] = argv;
const opt = (k, d) => (argv.includes(k) ? argv[argv.indexOf(k) + 1] : d);
const user = () => readJSON(arquivoUsuario(), {});
const save = (u) => writeJSON(arquivoUsuario(), u);
const slug = (s) => (/^[a-z][a-z0-9-]{1,30}$/.test(s || "") ? s : die("the source id must be lowercase letters, digits and dashes (2 to 31 characters), starting with a letter"));

const du = (dir) => {
  let n = 0, bytes = 0;
  const walk = (d) => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) walk(p); else if (e.name === "data") { n++; bytes += fs.statSync(p).size; } } };
  if (fs.existsSync(dir)) walk(dir);
  return { n, bytes };
};

if (cmd === "modo") {
  if (!MODOS.includes(arg1)) die(`mode must be: ${MODOS.join(" | ")}`);
  const u = user(); u.modo = arg1; save(u);
  console.log(`saved mode: ${arg1}  (${arquivoUsuario()})`);
} else if (cmd === "ativar" || cmd === "desativar") {
  const id = arg1; if (!config().fontes[id]) die(`unknown source "${id}". Run: node scripts/fontes.mjs`);
  const u = user(); u.fontes = u.fontes || {}; u.fontes[id] = { ...(u.fontes[id] || {}), ativa: cmd === "ativar" }; save(u);
  console.log(`${config().fontes[id].nome}: ${cmd === "ativar" ? "ON" : "OFF"}`);
} else if (cmd === "adicionar") {
  const id = slug(arg1);
  if (config().fontes[id] && !user().fontes?.[id]?.propria) die(`"${id}" is a built-in source; pick another id`);
  const nome = opt("--nome") || die('--nome "<name of the site>"');
  const hosts = String(opt("--host") || die("--host <site.com[,other.com]>")).split(",").map((h) => h.trim().toLowerCase()).filter(Boolean);
  if (!hosts.every((h) => /^[a-z0-9.-]+\.[a-z]{2,}$/.test(h))) die("--host takes bare site names such as fotos.exemplo.com.br, with no https:// and no slashes");
  const licencas = String(opt("--licencas") || die("--licencas <CC0,Domínio público,...>: say which licences you accept from this source")).split(",").map((l) => l.trim()).filter(Boolean);
  if (!licencas.length) die("--licencas cannot be empty: a source without a stated licence is not added");
  const u = user(); u.fontes = u.fontes || {};
  u.fontes[id] = { nome, uso: opt("--uso", ""), ativa: true, estrito: true, propria: true, hosts, licencas };
  save(u);
  console.log(`added "${nome}" (${hosts.join(", ")}). To search it automatically create an adapter: node scripts/fontes.mjs adaptador ${id}\nTo download single files: node scripts/add-asset.mjs <link> --fonte ${id} --licenca <code> --nome <name> --origem "<where from>"`);
} else if (cmd === "adaptador") {
  const id = arg1, u = user();
  if (!u.fontes?.[id]?.propria) die(`"${id}" is not a source you added. Add it first: node scripts/fontes.mjs adicionar ${id} --nome ... --host ... --licencas ...`);
  const dir = path.join(HOME, "adaptadores"), dest = path.join(dir, `${id}.mjs`);
  if (fs.existsSync(dest)) die(`${dest} already exists; edit that file`);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(dest, fs.readFileSync(path.join(SKILL, "templates", "adaptador-exemplo.mjs"), "utf8").split("<ID>").join(id));
  console.log(`created ${dest}\nEdit the function buscar() for the site's search, then try: node scripts/find-assets.mjs "<words>" --out <dir> --so ${id}`);
} else if (cmd === "remover") {
  const id = arg1, u = user();
  if (!u.fontes?.[id]?.propria) die("only sources you added can be removed (turn the built-in ones off with: desativar)");
  delete u.fontes[id]; save(u); console.log(`removed ${id}`);
} else if (cmd === "cache") {
  const c = path.join(HOME, "cache"), { n, bytes } = du(c);
  if (arg1 === "limpar") { fs.rmSync(c, { recursive: true, force: true }); console.log(`deleted ${n} local copies (${(bytes / 1048576).toFixed(1)} MB)`); }
  else console.log(`${n} local copies, ${(bytes / 1048576).toFixed(1)} MB in ${c}`);
} else if (!cmd) {
  const cfg = config(), m = modo();
  const da = process.env.MD_FONTES ? "from MD_FONTES" : user().modo ? "saved in fontes.json" : "default";
  const info = { automatico: "fetches live from the sources that are on", travado: "keeps fingerprinted local copies: same inputs every time", proprio: "no network at all: own effects, your library and the cache only" };
  console.log(`\nMode: ${m}  (${da}) — ${info[m]}`);
  console.log(`Registry of the 3D device models: ${registroRef()}\nTime limit per download: ${cfg.tempo_limite_s}s, ${cfg.tentativas} attempts\n`);
  for (const [id, f] of Object.entries(cfg.fontes)) {
    console.log(`${f.ativa === false ? "OFF" : " ON"}  ${id.padEnd(12)} ${f.nome}${f.propria ? `  (yours${arquivoAdaptador(id) ? ", with search adapter" : ", no search adapter"})` : ""}\n       ${f.uso || ""}${f.hosts?.length ? `\n       sites: ${f.hosts.join(", ")}` : ""}\n       licences: ${(f.licencas || []).join(", ")}`);
  }
  const { n, bytes } = du(path.join(HOME, "cache"));
  console.log(`\nLocal copies: ${n} files, ${(bytes / 1048576).toFixed(1)} MB   |   your choices: ${arquivoUsuario()}${fs.existsSync(arquivoUsuario()) ? "" : " (not created yet)"}\n`);
} else die(`unknown command "${cmd}". Run without arguments to see the options.`);
