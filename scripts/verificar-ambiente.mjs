#!/usr/bin/env node
// Confere se o computador tem o que a skill precisa e, com --corrigir, baixa o que falta.
//
//   node verificar-ambiente.mjs [--corrigir] [--json]
//
// Confere: Node 22 ou mais novo, FFmpeg e FFprobe, Chrome (ou Chromium) e o GSAP.
// --corrigir: só o GSAP pode ser corrigido sozinho. Ele roda `npm pack gsap@<versão>` numa pasta temporária,
//   copia dist/gsap.min.js para <casa>/vendor/ e apaga a pasta temporária. É o único uso de rede da skill
//   (registro público do npm, só leitura). Chrome e FFmpeg a pessoa instala; o texto diz como.
//
// Códigos de saída: 0 tudo certo; 1 falta algo.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { CASA, VERSAO_GSAP, acharChrome, caminhoGsap, executar, lerArgs } from "./lib.mjs";

const { op } = lerArgs();
if (op.ajuda) { console.log("Uso: node verificar-ambiente.mjs [--corrigir] [--json]"); process.exit(0); }

const itens = [];
const nota = (nome, ok, detalhe, ajuda) => itens.push({ nome, ok, detalhe, ajuda });

const maior = parseInt(process.versions.node.split(".")[0], 10);
nota("Node 22 ou mais novo", maior >= 22, `versão ${process.versions.node}`, "Instale em https://nodejs.org (versão LTS mais recente).");
for (const prog of ["ffmpeg", "ffprobe"]) {
  const r = executar(prog, ["-version"]);
  nota(prog, r.codigo === 0, r.codigo === 0 ? r.saida.split("\n")[0] : "não encontrado", "No Mac: brew install ffmpeg. No Windows: winget install ffmpeg. No Linux: apt install ffmpeg.");
}
const ch = acharChrome();
nota("Chrome ou Chromium", !!ch, ch || "não encontrado", "Instale o Google Chrome em https://www.google.com/chrome/ ou aponte o caminho em DIRETOR_DE_MOVIMENTO_CHROME.");

let gsap = caminhoGsap();
if (!gsap && op.corrigir) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "dm-gsap-"));
  try {
    const r = executar("npm", ["pack", `gsap@${VERSAO_GSAP}`, "--silent"], { cwd: tmp });
    const tgz = fs.readdirSync(tmp).find((f) => f.endsWith(".tgz"));
    if (r.codigo === 0 && tgz) {
      executar("tar", ["-xzf", tgz, "package/dist/gsap.min.js"], { cwd: tmp });
      const origem = path.join(tmp, "package", "dist", "gsap.min.js");
      if (fs.existsSync(origem)) {
        fs.mkdirSync(path.join(CASA, "vendor"), { recursive: true });
        fs.copyFileSync(origem, path.join(CASA, "vendor", "gsap.min.js"));
        gsap = caminhoGsap();
      }
    }
  } finally { fs.rmSync(tmp, { recursive: true, force: true }); }
}
nota(`GSAP ${VERSAO_GSAP}`, !!gsap, gsap || "não baixado", "Rode: node scripts/verificar-ambiente.mjs --corrigir (precisa de internet e do npm uma única vez).");

if (op.json) console.log(JSON.stringify(itens, null, 2));
else {
  for (const i of itens) console.log(`${i.ok ? "ok " : "FALTA"}  ${i.nome}: ${i.detalhe}${i.ok ? "" : "\n       -> " + i.ajuda}`);
  console.log(`\nPasta de trabalho: ${CASA}`);
}
process.exit(itens.every((i) => i.ok) ? 0 : 1);
