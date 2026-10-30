// Search adapters: one small file per site, for sources YOU registered.
//
// A registered source (node scripts/fontes.mjs adicionar ...) can only download
// files you pick by hand. To search a site automatically, the site needs an adapter:
//   $DIRETOR_DE_MOVIMENTO_HOME/adaptadores/<id>.mjs   (yours; kept when the skill is updated)
//   scripts/fontes-adaptadores/<id>.mjs               (shipped with the skill)
// Create yours from the template: node scripts/fontes.mjs adaptador <id>
//
// An adapter exports   async function buscar(consulta, { json, texto, n, min })
// and returns [{ title, url, w, h, license, creator, page }]. `json` and `texto` fetch
// through the skill's network module, so the mode (automatico / travado / proprio),
// the time limit, the retries and the allowed sites of the source all still apply.
// Nothing an adapter returns is used unless its licence is one the source declared.
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { HOME, SKILL } from "./lib.mjs";
import { ErroFonte, baixarJSON, baixarTexto, config, exigirFonte } from "./net.mjs";

export const pastaUsuario = () => path.join(HOME, "adaptadores");
const pastaSkill = () => path.join(SKILL, "scripts", "fontes-adaptadores");
export const arquivoAdaptador = (id) => [path.join(pastaUsuario(), `${id}.mjs`), path.join(pastaSkill(), `${id}.mjs`)].find((f) => fs.existsSync(f)) || null;

/** Sources that are on, are yours (strict site list) and have an adapter. */
export const adaptadoresAtivos = () =>
  Object.entries(config().fontes || {}).filter(([id, f]) => f.propria && f.ativa !== false && arquivoAdaptador(id)).map(([id]) => id);

const norm = (s) => String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, " ").trim();
const apelidos = { "public domain": "dominio publico", pd: "dominio publico", pdm: "dominio publico", "cc zero": "cc0" };
const canon = (s) => { const n = norm(s); return apelidos[n] || n; };
export const licencaAceita = (lic, aceitas) => { const c = canon(lic); return !!c && (aceitas || []).some((a) => canon(a) === c); };

export async function buscarEm(id, consulta, { n = 20, min = 0 } = {}) {
  const f = exigirFonte(id, `searching ${id}`);
  if (!f.propria) throw new ErroFonte(`"${id}" is built in; adapters are for sources you added`);
  const arq = arquivoAdaptador(id);
  if (!arq) throw new ErroFonte(`no adapter for "${id}". Create one: node scripts/fontes.mjs adaptador ${id}`);
  const mod = await import(pathToFileURL(arq).href);
  if (typeof mod.buscar !== "function") throw new ErroFonte(`${arq} must export: async function buscar(consulta, { json, texto, n, min })`);
  const ajuda = {
    n, min,
    json: (url, o = {}) => baixarJSON(url, { ...o, fonte: id }),
    texto: (url, o = {}) => baixarTexto(url, { ...o, fonte: id }),
  };
  const lista = await mod.buscar(consulta, ajuda);
  if (!Array.isArray(lista)) throw new ErroFonte(`the adapter of "${id}" must return a list`);
  const out = [], descartes = { semUrl: 0, endereco: 0, licenca: 0 };
  for (const r of lista) {
    let host = "";
    try { host = new URL(r.url).hostname; } catch { descartes.semUrl++; continue; }
    if (!f.hosts.some((h) => host === h || host.endsWith("." + h))) { descartes.endereco++; continue; }
    if (!licencaAceita(r.license, f.licencas)) { descartes.licenca++; continue; }
    out.push({ src: id, fonte: id, title: String(r.title || "").slice(0, 120), url: r.url, w: +r.w || 0, h: +r.h || 0, license: String(r.license), creator: String(r.creator || "").slice(0, 120), page: r.page || "" });
  }
  return { itens: out, descartes };
}
