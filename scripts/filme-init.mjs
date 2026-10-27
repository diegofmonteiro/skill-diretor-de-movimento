#!/usr/bin/env node
// Monta a pasta filme/ de um projeto: motor, marca, grade e um roteiro inicial que já renderiza.
//
//   node filme-init.mjs --projeto <pasta> [--marca <pasta-da-marca>] [--tema vidro|estudio|editorial] [--simular] [--refazer-roteiro]
//
// Pré-requisitos: projeto criado (novo-projeto.mjs) e grade válida (grade-de-batidas.mjs).
// O que grava em <projeto>/filme/:
//   index.html          o roteiro: uma <section class="cena"> por cena da grade, com uma linha de texto provisória
//   ativos/             gsap, filme.js, filme.css, marca.css, marca-fontes.css, marca/, batidas.js, trilha.wav (se existir)
// Se index.html já existir, ele NÃO é sobrescrito (é o trabalho da pessoa); use --refazer-roteiro para recomeçar.
//
// Códigos de saída: 0 ok; 1 erro (grade, marca ou GSAP ausentes).
import fs from "node:fs";
import path from "node:path";
import { SKILL, FORMATOS, abrirProjeto, caminhoGsap, criarRelogio, falhar, lerArgs, lerJSON, registrar } from "./lib.mjs";
import { lerMarca } from "./renderizar-movimento.mjs";

const { op } = lerArgs();
if (op.ajuda || !op.projeto) {
  console.log("Uso: node filme-init.mjs --projeto <pasta> [--marca <pasta>] [--tema vidro|estudio|editorial] [--simular] [--refazer-roteiro]");
  process.exit(op.ajuda ? 0 : 1);
}
const P = abrirProjeto(op.projeto);
const grade = lerJSON(P.arq("grade.json"), null) || falhar("falta grade.json. Escreva a grade e rode grade-de-batidas.mjs antes.");
if (!fs.existsSync(P.arq("som", "batidas.json"))) falhar("rode grade-de-batidas.mjs antes: falta som/batidas.json");
const med = FORMATOS[P.meta.formato] || falhar(`formato desconhecido no projeto: ${P.meta.formato}`);
const dirMarca = op.marca ? path.resolve(String(op.marca)) : fs.existsSync(P.arq("marca", "marca.json")) ? P.arq("marca") : null;
const marca = lerMarca(dirMarca);
const gsap = caminhoGsap() || falhar("GSAP não encontrado. Rode: node scripts/verificar-ambiente.mjs --corrigir");

const bpc = grade.batidasPorCompasso || 4;
const rel = criarRelogio({ bpm: grade.bpm, batidasPorCompasso: bpc, marcas: grade.marcas || {} });
const compr = +(grade.compassos * bpc * rel.spb + (grade.cauda ?? 0.8)).toFixed(3);

if (op.simular) {
  console.log(`[simulação] criaria ${P.arq("filme")} com ${grade.cenas.length} cenas, ${compr}s, marca "${marca.tokens.nomeMarca}"`);
  process.exit(0);
}

const F = P.arq("filme"), A = path.join(F, "ativos"), M = path.join(A, "marca");
fs.mkdirSync(M, { recursive: true });
fs.copyFileSync(gsap, path.join(A, "gsap.min.js"));
for (const n of ["filme.js", "filme.css"]) fs.copyFileSync(path.join(SKILL, "assets", "motor", n), path.join(A, n));
const tema = typeof op.tema === "string" ? op.tema : "vidro";
const arqTema = path.join(SKILL, "assets", "temas", tema, "tema.css");
if (!fs.existsSync(arqTema)) falhar(`tema "${tema}" não existe. Temas: ${fs.readdirSync(path.join(SKILL, "assets", "temas")).join(", ")}`);
fs.copyFileSync(arqTema, path.join(A, "tema.css"));
fs.copyFileSync(P.arq("som", "batidas.json"), path.join(A, "batidas.json"));
fs.writeFileSync(path.join(A, "batidas.js"), `/* escrito por grade-de-batidas.mjs: não edite */\nwindow.__BATIDAS = ${JSON.stringify({
  bpm: grade.bpm, deslocamento: 0, batidasPorCompasso: bpc,
  marcas: Object.fromEntries(Object.entries(grade.marcas || {}).map(([k, v]) => [k, rel.t(v)])),
})};\n`);
if (fs.existsSync(P.arq("som", "trilha.wav"))) fs.copyFileSync(P.arq("som", "trilha.wav"), path.join(A, "trilha.wav"));

// arquivos e fontes da marca com nomes estáveis
const levar = (rel0, nome) => {
  if (!rel0) return null;
  const src = path.join(marca.raiz, rel0);
  if (!fs.existsSync(src)) return null;
  const dst = nome + path.extname(src);
  fs.copyFileSync(src, path.join(M, dst));
  return `ativos/marca/${dst}`;
};
const arqs = { logo: levar(marca.arquivos.logo, "logo"), simbolo: levar(marca.arquivos.simbolo, "simbolo"),
  telas: marca.arquivos.telas.map((s, i) => levar(s, `tela-${i + 1}`)).filter(Boolean) };
let fontes = "";
for (const papel of ["titulo", "corpo"]) {
  const f = marca.arquivos.fontes?.[papel];
  for (const ff of f?.arquivos || []) {
    const src = path.join(marca.raiz, ff.arquivo);
    if (!fs.existsSync(src)) continue;
    fs.copyFileSync(src, path.join(M, path.basename(src)));
    fontes += `@font-face{font-family:"${f.familia}";src:url("marca/${path.basename(src)}");font-weight:${ff.peso || "100 900"};font-display:block}\n`;
  }
}
fs.writeFileSync(path.join(A, "marca-fontes.css"), fontes || "/* fontes do sistema */\n");
const T = marca.tokens;
fs.writeFileSync(path.join(A, "marca.css"), `/* escrito por filme-init.mjs a partir da marca; edite a marca, não este arquivo */
:root {
  --fundo: ${T.fundoCor}; --tinta: ${T.tinta}; --destaque: ${T.destaque}; --destaque2: ${T.destaque2};
  --superficie: ${T.superficie}; --apagado: ${T.apagado}; --papel: ${T.papel};
  --fonte-titulo: "${T.fonteTitulo}", system-ui, sans-serif; --fonte-corpo: "${T.fonteCorpo}", system-ui, sans-serif;
  --u: ${(med.l / 1080).toFixed(4)}px;
}
`);
fs.writeFileSync(path.join(A, "marca.json"), JSON.stringify({ tokens: T, ...arqs }, null, 2));

// roteiro inicial
const destinoHtml = P.arq("filme", "index.html");
if (fs.existsSync(destinoHtml) && !op["refazer-roteiro"]) {
  console.log(`index.html já existe e foi mantido (use --refazer-roteiro para recomeçar). Ativos atualizados em ${A}`);
} else {
  const ult = grade.cenas.length - 1;
  const cenas = grade.cenas.map((c, i) => {
    const a = rel.t(c.de), b = rel.t(c.ate);
    const entra = +(a + 0.2).toFixed(3), sai = +(b - 0.45).toFixed(3);
    const texto = String(c.tela).replace(/[<>&]/g, "");
    return `    <section class="cena" id="${c.id}" data-inicio="${c.de}" data-duracao="${+(b - a).toFixed(3)}">
      <div class="rig">
        <h1 id="l-${c.id}-1" class="linha-texto display" style="left:0;width:100%;text-align:center;top:42%;font-size:${Math.round(92 * med.l / 1920 * (med.l > med.a ? 1 : 1.5))}px" data-entra="palavras@${entra}" data-sai="${i === ult ? "fim" : `desfoque@${sai}`}">${texto}</h1>
      </div>
    </section>`;
  }).join("\n");
  fs.writeFileSync(destinoHtml, `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=${med.l}, height=${med.a}" />
<title>${(P.meta.titulo || "Filme").replace(/[<>&]/g, "")}</title>
<script src="ativos/gsap.min.js"></script>
<link rel="stylesheet" href="ativos/marca-fontes.css" />
<link rel="stylesheet" href="ativos/marca.css" />
<link rel="stylesheet" href="ativos/filme.css" />
<link rel="stylesheet" href="ativos/tema.css" />
<style>html, body { width: ${med.l}px; height: ${med.a}px; } #raiz { width: ${med.l}px; height: ${med.a}px; }</style>
</head>
<body>
<div id="raiz" data-largura="${med.l}" data-altura="${med.a}" data-duracao="${compr}" data-fps="${P.meta.fps || 30}">
  <canvas id="seda"></canvas>
  <div id="cenas">
${cenas}
  </div>
  <div class="granulado-f"></div>
</div>
<script src="ativos/batidas.js"></script>
<script src="ativos/filme.js"></script>
<script>
  /* Roteiro. Troque os textos provisórios pelo que a grade descreve; cada linha precisa de id, entrada e saída. */
  const tl = gsap.timeline({ paused: true });
  const cores = getComputedStyle(document.documentElement);
  FILME.seda(document.getElementById("seda"), {
    base: cores.getPropertyValue("--fundo").trim(),
    cores: [cores.getPropertyValue("--destaque").trim(), cores.getPropertyValue("--destaque2").trim()],
    intensidade: 0.3,
  }, tl);
  FILME.cenas(tl);
  FILME.linhas(tl);
  FILME.terminar(tl);
</script>
</body>
</html>
`);
  console.log(`roteiro inicial: ${destinoHtml}`);
}
registrar(P.dir, { fase: "filme-init", seg: 0, nota: `${grade.cenas.length} cenas, ${compr}s` });
console.log(`filme pronto para editar em ${F}`);
