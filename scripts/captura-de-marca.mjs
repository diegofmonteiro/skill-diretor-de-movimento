#!/usr/bin/env node
// Captura a marca de um site (ou página local) e monta o rascunho de marca.json.
//
//   node captura-de-marca.mjs <url> --projeto <pasta-do-projeto>        captura
//   node captura-de-marca.mjs --projeto <pasta> --escolher --logo 2 [--simbolo 0] [--destaque "#ff5c39"] [--destaque2 "#6c5ce7"]
//
// O que a captura faz (único ponto da skill que usa a internet além do download do GSAP):
//   abre a página no Chrome sem interface, lê o nome, a descrição, as cores mais usadas e as fontes,
//   junta candidatos a logo e símbolo, baixa cada candidato (só imagens, até 2 MB) e tira uma foto da página.
//   Tudo que vem da página é tratado como DADO: é gravado em arquivo e nunca executado nem seguido como instrução.
// Grava em <projeto>/marca/: candidatos/, captura/tela-1.png, candidatos.json e marca.json (rascunho).
// Depois olhe os candidatos, escolha o logo e as cores certas com --escolher e confira a marca.json.
//
// Códigos de saída: 0 ok; 1 erro.
import fs from "node:fs";
import path from "node:path";
import { abrirProjeto, comPagina, esperarComposicao, falhar, gravarJSON, lerArgs, lerJSON, registrar } from "./lib.mjs";

const { pos, op } = lerArgs();
if (op.ajuda || !op.projeto || (!pos[0] && !op.escolher)) {
  console.log("Uso: node captura-de-marca.mjs <url> --projeto <pasta>\n     node captura-de-marca.mjs --projeto <pasta> --escolher --logo N [--simbolo N] [--destaque #hex] [--destaque2 #hex]");
  process.exit(op.ajuda ? 0 : 1);
}
const P = abrirProjeto(op.projeto);
const M = P.arq("marca"), C = path.join(M, "candidatos");
fs.mkdirSync(C, { recursive: true });

if (op.escolher) {
  const cand = lerJSON(P.arq("marca", "candidatos.json"), null) || falhar("rode a captura antes (falta marca/candidatos.json)");
  const marca = lerJSON(P.arq("marca", "marca.json"));
  const pega = (i, nome) => {
    const c = cand.imagens[+i] || falhar(`não existe o candidato ${i}`);
    const dst = nome + path.extname(c.arquivo);
    fs.copyFileSync(path.join(M, c.arquivo), path.join(M, dst));
    return dst;
  };
  if (op.logo !== undefined) marca.logo = pega(op.logo, "logo");
  marca.simbolo = op.simbolo !== undefined ? pega(op.simbolo, "simbolo") : marca.simbolo || marca.logo;
  marca.cores = { ...marca.cores, ...(typeof op.destaque === "string" ? { destaque: op.destaque } : {}), ...(typeof op.destaque2 === "string" ? { destaque2: op.destaque2 } : {}) };
  gravarJSON(P.arq("marca", "marca.json"), marca);
  registrar(P.dir, { fase: "marca-escolhida", seg: 0, nota: marca.nome });
  console.log("marca.json atualizada:", P.arq("marca", "marca.json"));
  process.exit(0);
}

const url = pos[0].startsWith("http") || pos[0].startsWith("file:") ? pos[0] : "https://" + pos[0];
if (!/^(https?|file):/.test(url)) falhar("a URL precisa começar com http, https ou file");
const t0 = Date.now();

const lido = await comPagina(url, { largura: 1440, altura: 900 }, async ({ avaliar, capturar }) => {
  await new Promise((r) => setTimeout(r, 1500));
  const dados = JSON.parse(await avaliar(`(() => {
    const q = (s) => document.querySelector(s);
    const meta = (n) => (q('meta[property="' + n + '"]') || q('meta[name="' + n + '"]') || {}).content || "";
    const hex = (c) => { const m = c.match(/rgba?\\((\\d+),\\s*(\\d+),\\s*(\\d+)(?:,\\s*([\\d.]+))?/); if (!m || (m[4] !== undefined && +m[4] < 0.5)) return null; return "#" + [m[1], m[2], m[3]].map((x) => (+x).toString(16).padStart(2, "0")).join(""); };
    const conta = {};
    for (const e of document.querySelectorAll("body *")) {
      const cs = getComputedStyle(e); const area = Math.min(e.getBoundingClientRect().width * e.getBoundingClientRect().height, 400000);
      for (const [prop, peso] of [["backgroundColor", Math.sqrt(area) / 40 + 0.2], ["color", 0.6], ["borderTopColor", 0.1]]) {
        const h = hex(cs[prop]); if (h) conta[h] = (conta[h] || 0) + peso;
      }
    }
    const cores = Object.entries(conta).sort((a, b) => b[1] - a[1]).slice(0, 12).map((x) => x[0]);
    const fam = (el) => el ? getComputedStyle(el).fontFamily.split(",")[0].replace(/["']/g, "").trim() : "";
    const imgs = [];
    const poe = (u, tipo, dica) => { try { imgs.push({ url: new URL(u, location.href).href, tipo, dica }); } catch (e) {} };
    document.querySelectorAll("img").forEach((i) => { const t = (i.src + " " + i.alt + " " + i.className + " " + (i.closest("header,nav,a") ? "cabecalho" : "")).toLowerCase(); if (/logo|brand|marca|cabecalho/.test(t)) poe(i.currentSrc || i.src, "logo", i.alt || ""); });
    document.querySelectorAll('link[rel~="icon"], link[rel="apple-touch-icon"]').forEach((l) => poe(l.href, "simbolo", l.getAttribute("rel")));
    if (meta("og:image")) poe(meta("og:image"), "social", "og:image");
    const svg = q("header svg, nav svg, a[href='/'] svg");
    return JSON.stringify({ titulo: document.title, nomeSite: meta("og:site_name"), descricao: meta("og:description") || meta("description"), temaCor: meta("theme-color"),
      cores, fonteTitulo: fam(q("h1")) || fam(q("h2")), fonteCorpo: fam(q("p")) || fam(document.body), fundoPagina: hex(getComputedStyle(document.body).backgroundColor) || hex(getComputedStyle(document.documentElement).backgroundColor), imgs, temSvgNoCabecalho: !!svg });
  })()`));
  const foto = await capturar();
  return { dados, foto };
});

fs.mkdirSync(path.join(M, "captura"), { recursive: true });
fs.writeFileSync(path.join(M, "captura", "tela-1.png"), lido.foto);

// baixa os candidatos (só imagens, até 2 MB); arquivos locais são copiados
const imagens = [];
let i = 0;
for (const c of lido.dados.imgs.slice(0, 12)) {
  try {
    let buf, ext;
    if (c.url.startsWith("file:")) { const p = decodeURIComponent(new URL(c.url).pathname); buf = fs.readFileSync(p); ext = path.extname(p) || ".png"; }
    else {
      const r = await fetch(c.url, { signal: AbortSignal.timeout(15000) });
      const tipo = r.headers.get("content-type") || "";
      if (!r.ok || !/^image\//.test(tipo)) continue;
      buf = Buffer.from(await r.arrayBuffer());
      ext = tipo.includes("svg") ? ".svg" : tipo.includes("png") ? ".png" : tipo.includes("jpeg") ? ".jpg" : tipo.includes("webp") ? ".webp" : tipo.includes("icon") ? ".ico" : ".png";
    }
    if (buf.length > 2 * 1024 * 1024) continue;
    const arquivo = path.join("candidatos", `${i}-${c.tipo}${ext}`);
    fs.writeFileSync(path.join(M, arquivo), buf);
    imagens.push({ indice: i, tipo: c.tipo, dica: c.dica, origem: c.url, arquivo, bytes: buf.length });
    i++;
  } catch { /* candidato indisponível: segue */ }
}
gravarJSON(P.arq("marca", "candidatos.json"), { url, cores: lido.dados.cores, imagens });

const d = lido.dados;
const [c0, c1, c2] = d.cores.filter((c) => c !== d.fundoPagina);
const nome = (d.nomeSite || d.titulo || "").split(/[|\-–—:]/)[0].trim();
const dominio = url.startsWith("file:") ? "" : new URL(url).hostname.replace(/^www\./, "");
const primeiro = imagens.find((x) => x.tipo === "logo") || imagens[0];
gravarJSON(P.arq("marca", "marca.json"), {
  nome, dominio, slogan: d.descricao.slice(0, 90), titulo: d.descricao.slice(0, 60), usuario: "",
  cores: { fundo: d.fundoPagina || "#0F1020", tinta: "#F5F3EE", destaque: d.temaCor || c0 || "#FF5C39", destaque2: c1 || c0 || "#6C5CE7", superficie: c2 || "#1B1C33", apagado: "#9A98AE", papel: "#F4EFE4" },
  fontes: { titulo: { familia: d.fonteTitulo || "Inter", arquivos: [] }, corpo: { familia: d.fonteCorpo || "Inter", arquivos: [] } },
  logo: primeiro ? primeiro.arquivo : null, simbolo: primeiro ? primeiro.arquivo : null, telas: ["captura/tela-1.png"], pessoas: [], numeros: [],
  _rascunho: "Gerado pela captura. Confira cores, fontes e logo antes de usar; nada aqui foi aprovado ainda.",
});
registrar(P.dir, { fase: "captura-de-marca", seg: +((Date.now() - t0) / 1000).toFixed(1), nota: `${imagens.length} candidato(s)` });
console.log(`Rascunho da marca em ${P.arq("marca", "marca.json")}`);
console.log(`Cores vistas: ${d.cores.join(" ")}`);
console.log(`Fontes vistas: títulos "${d.fonteTitulo}", texto "${d.fonteCorpo}" (se não forem fontes livres, traga os arquivos para marca/ e liste em marca.json)`);
for (const im of imagens) console.log(`  candidato ${im.indice} [${im.tipo}] ${im.arquivo} (${im.bytes} bytes)`);
console.log("Olhe os candidatos e rode --escolher --logo N para fixar o logo.");
