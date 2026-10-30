// Network access for the whole skill, in one place.
//
// Three modes (MD_FONTES=automatico|travado|proprio, or "modo" in fontes.json):
//   automatico  fetch live from the sources that are turned on (the default;
//               every download is also kept in the local cache).
//   travado     use the local cache first and check every file against its
//               SHA-256 fingerprint; download only what is missing. Together
//               with a project's assets.lock.json a film re-renders from the
//               very same inputs months later, and a changed file stops the run.
//   proprio     never touch the network. Only the skill's own effects, the
//               local library and files already in the cache.
//
// Cache: $DIRETOR_DE_MOVIMENTO_HOME/cache/<xx>/<key>/{data,meta.json}
// Lock : <project>/assets.lock.json
// Sources on/off + the user's own sources: $DIRETOR_DE_MOVIMENTO_HOME/fontes.json
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { HF_VERSION, HOME, SKILL, die, readJSON, writeJSON } from "./lib.mjs";

export class ErroFonte extends Error {}

export const MODOS = ["automatico", "travado", "proprio"];
export const arquivoUsuario = () => path.join(HOME, "fontes.json");
const PADRAO = path.join(SKILL, "templates", "fontes.padrao.json");

const mesclar = (a, b) => {
  if (!b || typeof b !== "object" || Array.isArray(b)) return b === undefined ? a : b;
  const out = { ...a };
  for (const [k, v] of Object.entries(b)) out[k] = k in a && a[k] && typeof a[k] === "object" && !Array.isArray(a[k]) ? mesclar(a[k], v) : v;
  return out;
};
export const config = () => mesclar(readJSON(PADRAO), readJSON(arquivoUsuario(), {}));

export const modo = () => {
  const m = String(process.env.MD_FONTES || config().modo || "automatico").trim().toLowerCase();
  if (!MODOS.includes(m)) die(`MD_FONTES="${m}" is not a mode. Use: ${MODOS.join(" | ")}`);
  return m;
};

/** Commit of the HyperFrames registry the 3D device models come from. */
export const registroRef = () => process.env.MD_REGISTRO_REF || (modo() === "automatico" ? config().registro_ref : config().registro_ref_travado);

const sha = (buf) => crypto.createHash("sha256").update(buf).digest("hex");
export const impressao = sha;

/* ----------------------------------------------------------------- cache */

const cacheDir = (chave) => {
  const h = sha(Buffer.from(chave));
  return path.join(HOME, "cache", h.slice(0, 2), h);
};

/** Cached bytes for a key, verified against the fingerprint stored with them; null if absent. */
export const cacheLer = (chave) => {
  const d = cacheDir(chave);
  if (!fs.existsSync(path.join(d, "data")) || !fs.existsSync(path.join(d, "meta.json"))) return null;
  const buf = fs.readFileSync(path.join(d, "data"));
  const meta = readJSON(path.join(d, "meta.json"), {});
  if (meta.sha256 !== sha(buf)) throw new ErroFonte(`the cached copy of ${chave} is corrupted (fingerprint differs). Delete ${d} and run again.`);
  return buf;
};

export const cacheGravar = (chave, buf, extra = {}) => {
  const d = cacheDir(chave);
  fs.mkdirSync(d, { recursive: true });
  const tmp = path.join(d, `data.${process.pid}.tmp`);
  fs.writeFileSync(tmp, buf);
  fs.renameSync(tmp, path.join(d, "data"));
  writeJSON(path.join(d, "meta.json"), { chave, sha256: sha(buf), bytes: buf.length, em: new Date().toISOString(), ...extra });
};

/* ------------------------------------------------------------------ lock */

const lockPath = (p) => path.join(path.resolve(p), "assets.lock.json");
export const lockLer = (p) => readJSON(lockPath(p), { versao: 1, itens: {} });

/** Record a file's fingerprint in the project's lock. In travado/proprio a different fingerprint stops the run. */
export const lockRegistrar = (projeto, chave, buf) => {
  if (!projeto) return;
  const L = lockLer(projeto);
  const h = sha(buf), old = L.itens[chave];
  if (old && old.sha256 !== h) {
    if (modo() !== "automatico") throw new ErroFonte(`${chave} changed since this film was locked (expected ${old.sha256.slice(0, 12)}…, got ${h.slice(0, 12)}…). Delete assets.lock.json to accept the new file.`);
    console.warn(`  note: ${chave} is different from the locked copy; lock updated`);
  }
  L.itens[chave] = { sha256: h, bytes: buf.length, em: old && old.sha256 === h ? old.em : new Date().toISOString() };
  L.ambiente = { hyperframes: HF_VERSION, node: process.version, registro_ref: registroRef(), modo: modo() };
  writeJSON(lockPath(projeto), L);
};

/* ----------------------------------------------------------------- fontes */

/** Throws unless the source is turned on and the mode allows the network. */
export const exigirFonte = (id, oque = "") => {
  const f = config().fontes?.[id];
  if (!f) throw new ErroFonte(`unknown source "${id}". See: node scripts/fontes.mjs`);
  if (f.ativa === false) throw new ErroFonte(`source "${f.nome || id}" is turned off. Turn it on: node scripts/fontes.mjs ativar ${id}`);
  if (modo() === "proprio") throw new ErroFonte(`mode "proprio" (own material only) blocks the network${oque ? ` for ${oque}` : ""}. Change it: MD_FONTES=travado or node scripts/fontes.mjs modo travado`);
  return f;
};

const espera = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Download a URL as a Buffer, honouring the mode, the sources that are on, a
 * time limit and retries. Options:
 *   fonte   source id from fontes.json (required for anything outside the machine)
 *   cache   false = never read or write the cache (large or personal downloads)
 *   projeto project folder whose assets.lock.json records the fingerprint
 *   chave   cache key when it is not the URL itself
 */
export async function baixar(url, o = {}) {
  const cfg = config(), m = modo();
  const chave = o.chave || url;
  const usaCache = o.cache !== false;
  const f = o.fonte ? cfg.fontes?.[o.fonte] : null;
  if (o.fonte && !f) throw new ErroFonte(`unknown source "${o.fonte}". See: node scripts/fontes.mjs`);
  if (f && f.ativa === false) throw new ErroFonte(`source "${f.nome || o.fonte}" is turned off. Turn it on: node scripts/fontes.mjs ativar ${o.fonte}`);
  if (f && f.estrito && f.hosts?.length) {
    const host = new URL(url).hostname;
    if (!f.hosts.some((h) => host === h || host.endsWith("." + h))) throw new ErroFonte(`${host} is not an address registered for source "${o.fonte}" (allowed: ${f.hosts.join(", ")})`);
  }
  if (usaCache && m !== "automatico") {
    const hit = cacheLer(chave);
    if (hit) { lockRegistrar(o.projeto, chave, hit); return hit; }
  }
  if (m === "proprio") throw new ErroFonte(`mode "proprio" (own material only): ${url} is not in the local cache and the network is off. Download it once with MD_FONTES=travado, or add the file yourself with scripts/add-asset.mjs`);

  const tempo = (o.tempo ?? cfg.tempo_limite_s ?? 60) * 1000, tent = o.tentativas ?? cfg.tentativas ?? 3;
  let ultimo = "";
  for (let k = 1; k <= tent; k++) {
    try {
      const r = await fetch(url, { headers: o.headers, signal: AbortSignal.timeout(tempo), redirect: "follow" });
      if (r.ok) {
        const buf = Buffer.from(await r.arrayBuffer());
        if (usaCache) cacheGravar(chave, buf, { url, fonte: o.fonte || null });
        lockRegistrar(o.projeto, chave, buf);
        return buf;
      }
      ultimo = `HTTP ${r.status}`;
      if (r.status !== 429 && r.status < 500) break; // a 404 or 403 will not improve by waiting
    } catch (e) {
      if (e instanceof ErroFonte) throw e;
      ultimo = e.name === "TimeoutError" ? `no answer in ${tempo / 1000}s` : (e.cause?.code || e.message);
    }
    if (k < tent) await espera(2000 * k);
  }
  throw new ErroFonte(`could not download ${url} (${ultimo}). Check the connection, or whether this site is reachable from this machine.`);
}

export const baixarTexto = async (url, o) => (await baixar(url, o)).toString("utf8");
export const baixarJSON = async (url, o) => {
  const t = await baixarTexto(url, o);
  try { return JSON.parse(t); } catch { throw new ErroFonte(`${url} did not answer with JSON (first characters: ${JSON.stringify(t.slice(0, 60))})`); }
};

/** Save a download next to the caller's files. */
export const baixarPara = async (url, destino, o) => {
  const buf = await baixar(url, o);
  fs.mkdirSync(path.dirname(destino), { recursive: true });
  fs.writeFileSync(destino, buf);
  return buf;
};

/* ------------------------------------------------- three.js + Draco (3D) */

export const THREE_CDN = "https://cdn.jsdelivr.net/npm/three@0.147.0";
export const DRACO_CDN = "https://www.gstatic.com/draco/versioned/decoders/1.5.6/";
const LIBS = {
  three: "/build/three.min.js",
  gltf: "/examples/js/loaders/GLTFLoader.js",
  dracoLoader: "/examples/js/loaders/DRACOLoader.js",
  rgbe: "/examples/js/loaders/RGBELoader.js",
};
const DRACO_ARQ = ["draco_decoder.js", "draco_decoder.wasm", "draco_wasm_wrapper.js"];

/**
 * Where the 3D libraries come from. automatico: the public CDN, as before.
 * travado / proprio: the same files, fetched once into the cache, fingerprint-
 * checked, and copied to <dest>/vendor so the render never reaches out.
 * `decodificador: false` skips the Draco decoder files (the loader script stays).
 * Returns the addresses to put in the page (relative to `base`).
 */
export async function bibliotecas3d({ quais = ["three", "gltf"], draco = false, decodificador = draco, dest, base = dest, projeto } = {}) {
  if (modo() === "automatico") {
    exigirFonte("bibliotecas");
    const u = Object.fromEntries(quais.map((q) => [q, THREE_CDN + LIBS[q]]));
    if (draco) { u.dracoLoader = THREE_CDN + LIBS.dracoLoader; u.dracoPath = DRACO_CDN; }
    return u;
  }
  const vendor = path.join(dest, "vendor");
  const rel = (f) => path.relative(base, f).split(path.sep).join("/");
  const u = {};
  for (const q of draco ? [...quais, "dracoLoader"] : quais) {
    const f = path.join(vendor, "three", path.basename(LIBS[q]));
    await baixarPara(THREE_CDN + LIBS[q], f, { fonte: "bibliotecas", projeto });
    u[q] = rel(f);
  }
  if (draco) {
    // the decoder files (~0.8 MB) are only fetched when a model really is Draco-compressed
    for (const n of decodificador ? DRACO_ARQ : []) await baixarPara(DRACO_CDN + n, path.join(vendor, "draco", n), { fonte: "bibliotecas", projeto });
    u.dracoPath = rel(path.join(vendor, "draco")) + "/";
  }
  return u;
}
