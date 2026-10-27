#!/usr/bin/env node
// A grade de batidas: um plano só, lido pela imagem E pelo som.
//
//   node grade-de-batidas.mjs --projeto <pasta> [--aprovada] [--json]
//
// Lê <projeto>/grade.json, confere e grava:
//   grade.md                 a tabela que a pessoa aprova
//   som/batidas.json         cada batida, compasso, seção, marca e efeito sonoro em segundos
//   filme/ativos/batidas.js  os mesmos números para o motor do filme (só se filme/ já existir)
//
// Todo tempo em grade.json é escrito como "B12", "compasso3", "B12+0.1", "queda" ou "4.5".
// As cenas são escritas em BATIDAS, então todo corte cai na grade e música e imagem não se afastam.
// --aprovada: a pessoa disse sim à grade.md. Fica registrado para o log separar trabalho de espera.
//
// Códigos de saída: 0 grade válida; 1 grade com erro (a lista vem na tela).
import fs from "node:fs";
import { abrirProjeto, criarRelogio, fmtT, falhar, gravarJSON, lerArgs, lerJSON, registrar } from "./lib.mjs";

export const CLIMAS = ["impulsionado", "brincalhao", "acolhedor", "cinematografico", "minimo", "escuro"];
export const TIPOS_SOM = ["clique", "tique", "estalo", "passagem", "impacto", "brilho", "subida"];

export const validar = (g) => {
  const erros = [];
  const e = (m) => erros.push(m);
  if (!(g.bpm >= 60 && g.bpm <= 180)) e("bpm precisa estar entre 60 e 180");
  if (!(g.compassos >= 2)) e("compassos precisa ser 2 ou mais");
  const bpc = g.batidasPorCompasso || 4;
  const rel = criarRelogio({ bpm: g.bpm, batidasPorCompasso: bpc, marcas: g.marcas || {} });
  const compr = +(g.compassos * bpc * rel.spb + (g.cauda ?? 0.8)).toFixed(3);
  if (g.comprimento !== undefined && Math.abs(g.comprimento - compr) > 0.05) e(`comprimento ${g.comprimento}s não bate com ${g.compassos} compassos a ${g.bpm} bpm mais a cauda (= ${compr}s)`);
  if (g.clima && !CLIMAS.includes(g.clima)) e(`clima "${g.clima}" desconhecido. Use: ${CLIMAS.join(", ")}`);
  const t = (s, onde) => { try { return rel.t(s); } catch (x) { e(`${onde}: ${x.message}`); return NaN; } };

  const cenas = g.cenas || [];
  if (!cenas.length) e("faltam cenas");
  let cursor = 0;
  const ids = new Set();
  for (const c of cenas) {
    if (!c.id) { e("toda cena precisa de id"); continue; }
    if (ids.has(c.id)) e(`id de cena repetido: ${c.id}`);
    ids.add(c.id);
    const a = t(c.de, `cena ${c.id}.de`), b = t(c.ate, `cena ${c.id}.ate`);
    if (Math.abs(a - cursor) > 0.01) e(`cena ${c.id} começa em ${a}s, mas a anterior terminou em ${cursor.toFixed(3)}s (as cenas são contíguas e a primeira começa em 0)`);
    if (!(b > a)) e(`cena ${c.id} termina antes de começar`);
    if (!c.tela) e(`cena ${c.id}: descreva o que aparece na tela`);
    if (!c.movimento) e(`cena ${c.id}: descreva o movimento`);
    cursor = b;
  }
  if (cenas.length && Math.abs(cursor - compr) > 0.05) e(`as cenas terminam em ${cursor.toFixed(3)}s, mas o filme tem ${compr}s`);

  for (const s of g.secoes || []) {
    const a = t(s.de, `seção ${s.nome}.de`), b = t(s.ate, `seção ${s.nome}.ate`);
    if (!(b > a)) e(`seção ${s.nome} termina antes de começar`);
    if (!(s.energia >= 0 && s.energia <= 1)) e(`seção ${s.nome}: energia entre 0 e 1`);
  }
  for (const f of g.efeitos || []) {
    if (!TIPOS_SOM.includes(f.tipo)) e(`efeito "${f.tipo}" desconhecido. Use: ${TIPOS_SOM.join(", ")}`);
    if (!f.evento) e(`efeito ${f.tipo} em ${f.em}: diga qual evento visível ele acompanha (som sem evento na tela é som sem motivo)`);
    const x = t(f.em, `efeito ${f.tipo}`);
    if (x > compr) e(`efeito ${f.tipo} em ${f.em} cai depois do fim do filme`);
  }
  if (!g.assinatura) e("falta a assinatura: o momento que as pessoas vão lembrar");
  return { erros, compr, rel, bpc };
};

if (process.argv[1]?.endsWith("grade-de-batidas.mjs")) {
  const { op } = lerArgs();
  if (op.ajuda || !op.projeto) { console.log("Uso: node grade-de-batidas.mjs --projeto <pasta> [--aprovada] [--json]"); process.exit(op.ajuda ? 0 : 1); }
  const P = abrirProjeto(op.projeto);
  const g = lerJSON(P.arq("grade.json"));
  const { erros, compr, rel, bpc } = validar(g);
  if (erros.length) { console.error("\nA grade tem problemas:\n" + erros.map((x) => " - " + x).join("\n")); process.exit(1); }

  // marcas resolvidas em segundos
  const marcas = {};
  for (const [k, v] of Object.entries(g.marcas || {})) marcas[k] = rel.t(v);
  const batidas = { bpm: g.bpm, deslocamento: 0, batidasPorCompasso: bpc, comprimento: compr, clima: g.clima || "impulsionado", tom: g.tom || "La menor", marcas };
  batidas.secoes = (g.secoes || []).map((s) => ({ ...s, de: rel.t(s.de), ate: rel.t(s.ate) }));
  batidas.efeitos = (g.efeitos || []).map((f) => ({ ...f, em: rel.t(f.em) }));
  batidas.cenas = g.cenas.map((c) => ({ id: c.id, de: rel.t(c.de), ate: rel.t(c.ate) }));
  gravarJSON(P.arq("som", "batidas.json"), batidas);
  if (fs.existsSync(P.arq("filme", "ativos"))) {
    fs.writeFileSync(P.arq("filme", "ativos", "batidas.js"), `/* escrito por grade-de-batidas.mjs: não edite */\nwindow.__BATIDAS = ${JSON.stringify({ bpm: g.bpm, deslocamento: 0, batidasPorCompasso: bpc, marcas })};\n`);
  }

  const linhas = [`# ${g.titulo || P.meta.titulo}`, "", `${g.bpm} bpm, ${g.compassos} compassos de ${bpc} batidas, ${compr.toFixed(2)} s. Clima: ${g.clima || "impulsionado"}. Momento de assinatura: ${g.assinatura}`, "",
    "| Cena | Tempo | Batidas | O que aparece | Movimento | Som |", "|---|---|---|---|---|---|"];
  for (const c of g.cenas) {
    const a = rel.t(c.de), b = rel.t(c.ate);
    linhas.push(`| ${c.id} | ${fmtT(a)} a ${fmtT(b)} | ${c.de} a ${c.ate} | ${c.tela} | ${c.movimento} | ${c.som || ""} |`);
  }
  if ((g.efeitos || []).length) {
    linhas.push("", "## Efeitos sonoros", "", "| Tipo | Quando | Evento na tela |", "|---|---|---|");
    for (const f of g.efeitos) linhas.push(`| ${f.tipo} | ${fmtT(rel.t(f.em))} (${f.em}) | ${f.evento} |`);
  }
  fs.writeFileSync(P.arq("grade.md"), linhas.join("\n") + "\n");
  registrar(P.dir, { fase: op.aprovada ? "grade-aprovada" : "grade", seg: 0, nota: `${g.cenas.length} cenas, ${compr.toFixed(1)} s` });
  if (op.json) console.log(JSON.stringify(batidas, null, 2));
  else { console.log(linhas.join("\n")); console.log(op.aprovada ? "\nGrade APROVADA registrada." : "\nMostre esta tabela à pessoa e espere o sim antes de escrever qualquer animação."); }
}
