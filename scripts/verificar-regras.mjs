#!/usr/bin/env node
// Confere o roteiro do filme contra as regras da skill ANTES de gastar minutos renderizando.
//
//   node verificar-regras.mjs --projeto <pasta> [--json]
//
// Lê filme/index.html e grade.json. Erros impedem o render; avisos pedem uma segunda olhada.
//   erros:  linha de texto sem id/entrada/saída; cena do roteiro que não existe na grade (ou o contrário);
//           travessão (— –) em texto da tela; emoji; Math.random, Date.now, new Date, repetição infinita;
//           espaçamento entre letras mais apertado que -0.025em.
//   avisos: menos de 3 telas reais da marca; cena só de texto sem motivo declarado; texto de tela com mais de 12 palavras.
//
// Códigos de saída: 0 sem erros; 1 com erros.
import fs from "node:fs";
import { abrirProjeto, falhar, lerArgs, lerJSON } from "./lib.mjs";

const { op } = lerArgs();
if (op.ajuda || !op.projeto) { console.log("Uso: node verificar-regras.mjs --projeto <pasta> [--json]"); process.exit(op.ajuda ? 0 : 1); }
const P = abrirProjeto(op.projeto);
const arq = P.arq("filme", "index.html");
if (!fs.existsSync(arq)) falhar("não há filme/index.html. Rode filme-init.mjs antes.");
const html = fs.readFileSync(arq, "utf8");
const grade = lerJSON(P.arq("grade.json"), { cenas: [] });

const erros = [], avisos = [];
const E = (m) => erros.push(m), W = (m) => avisos.push(m);

// elementos .linha-texto
const reLinha = /<(\w+)([^>]*\bclass="[^"]*\blinha-texto\b[^"]*"[^>]*)>([\s\S]*?)<\/\1>/g;
let nLinhas = 0;
const ids = new Set();
for (const m of html.matchAll(reLinha)) {
  nLinhas++;
  const attrs = m[2], texto = m[3].replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").trim();
  const id = (attrs.match(/\bid="([^"]+)"/) || [])[1];
  if (!id) E(`linha "${texto.slice(0, 30)}" sem id`);
  else if (ids.has(id)) E(`id de linha repetido: ${id}`); else ids.add(id);
  const nome = id ? "#" + id : `"${texto.slice(0, 30)}"`;
  if (!/\bdata-entra="[^"@]+@[^"]+"/.test(attrs)) E(`${nome}: falta data-entra="tipo@tempo"`);
  if (!/\bdata-sai="[^"@]+(@[^"]+)?"/.test(attrs)) E(`${nome}: falta data-sai="tipo@tempo"`);
  if (/[—–]/.test(texto)) E(`${nome}: travessão no texto da tela. Use vírgula, dois pontos ou ponto.`);
  if (/\p{Extended_Pictographic}/u.test(texto)) E(`${nome}: emoji no texto da tela. Use um ícone desenhado na marca ou nada.`);
  const palavras = texto.split(/\s+/).filter(Boolean).length;
  if (palavras > 12) W(`${nome}: ${palavras} palavras numa linha; acima de 12 ninguém lê no tempo da cena.`);
}
if (!nLinhas) W("o roteiro não tem nenhuma .linha-texto");

// cenas
const cenasHtml = [...html.matchAll(/<section\b[^>]*\bclass="[^"]*\bcena\b[^"]*"[^>]*>/g)].map((x) => (x[0].match(/\bid="([^"]+)"/) || [])[1]).filter(Boolean);
const cenasGrade = (grade.cenas || []).map((c) => c.id);
for (const c of cenasGrade) if (!cenasHtml.includes(c)) E(`a grade tem a cena "${c}", mas o roteiro não`);
for (const c of cenasHtml) if (!cenasGrade.includes(c)) E(`o roteiro tem a cena "${c}", que não está na grade`);

// proibições de código
const script = [...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)].map((x) => x[1]).join("\n");
for (const [re, msg] of [[/Math\.random\s*\(/, "Math.random() faz o quadro mudar a cada render; use FILME.sorteio(semente)"],
  [/Date\.now\s*\(|new\s+Date\s*\(|performance\.now\s*\(/, "relógio real no roteiro; o tempo é o da linha do tempo"],
  [/repeat\s*:\s*-1|Infinity/, "repetição infinita não termina no render; use repeat com número"],
  [/requestAnimationFrame|setInterval|setTimeout/, "temporizador do navegador; a animação precisa ser função do tempo da linha do tempo"]]) {
  if (re.test(script)) E(msg);
}
const css = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map((x) => x[1]).join("\n") + [...html.matchAll(/style="([^"]*)"/g)].map((x) => x[1]).join("\n");
for (const x of css.matchAll(/letter-spacing\s*:\s*(-\d*\.?\d+)em/g)) if (parseFloat(x[1]) < -0.025) E(`letter-spacing ${x[1]}em é mais apertado que -0.025em: as letras se encostam`);

// telas reais
const telas = new Set([...html.matchAll(/ativos\/marca\/tela-\d+\.\w+/g)].map((x) => x[0]));
if (telas.size < 3) W(`só ${telas.size} tela(s) real(is) da marca no filme; com menos de 3 o filme parece genérico. Capture mais telas do produto.`);

if (op.json) console.log(JSON.stringify({ erros, avisos, linhas: nLinhas, cenas: cenasHtml.length }, null, 2));
else {
  for (const e of erros) console.log("ERRO   " + e);
  for (const a of avisos) console.log("aviso  " + a);
  console.log(erros.length ? `\n${erros.length} erro(s). Corrija antes de renderizar.` : `\nRegras ok (${nLinhas} linhas, ${cenasHtml.length} cenas, ${avisos.length} aviso(s)).`);
}
process.exit(erros.length ? 1 : 0);
