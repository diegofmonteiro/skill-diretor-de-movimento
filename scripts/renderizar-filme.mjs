#!/usr/bin/env node
// Renderiza uma rodada do filme: confere as regras, gera o vídeo com a trilha e guarda em critica/rodada-N/.
//
//   node renderizar-filme.mjs --projeto <pasta> [--rascunho] [--quadro <seg>] [--trabalhadores 3] [--sem-audio]
//
// --rascunho   qualidade menor e mais rápida, para conferir ritmo e posição
// --quadro     só um quadro em PNG, no segundo dado (para olhar um detalhe sem esperar o filme todo)
// Cada rodada completa vira critica/rodada-<N>/filme.mp4. A crítica (critica.mjs) lê a rodada mais nova.
//
// Códigos de saída: 0 ok; 1 regras violadas ou erro de render.
import fs from "node:fs";
import path from "node:path";
import { abrirProjeto, falhar, lerArgs, registrar } from "./lib.mjs";
import { renderizar } from "./renderizador.mjs";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const { op } = lerArgs();
if (op.ajuda || !op.projeto) {
  console.log("Uso: node renderizar-filme.mjs --projeto <pasta> [--rascunho] [--quadro seg] [--trabalhadores 3] [--sem-audio]");
  process.exit(op.ajuda ? 0 : 1);
}
const P = abrirProjeto(op.projeto);
const aqui = path.dirname(fileURLToPath(import.meta.url));

const lint = spawnSync(process.execPath, [path.join(aqui, "verificar-regras.mjs"), "--projeto", P.dir], { encoding: "utf8" });
process.stdout.write(lint.stdout || "");
if (lint.status !== 0) falhar("as regras do filme têm erros; corrija antes de renderizar.");

const pasta = P.arq("filme");
const trilha = P.arq("filme", "ativos", "trilha.wav");
const audio = !op["sem-audio"] && fs.existsSync(trilha) ? trilha : undefined;
if (!audio && !op["sem-audio"]) console.log("aviso: sem trilha (rode sintetizador.mjs); o vídeo sairá mudo.");

const t0 = Date.now();
if (op.quadro !== undefined) {
  const saida = P.arq("critica", `quadro-${String(op.quadro).replace(".", "_")}s.png`);
  await renderizar({ pasta, saida, quadro: op.quadro, formato: "mp4" });
  console.log(saida);
  process.exit(0);
}
const existentes = fs.existsSync(P.arq("critica")) ? fs.readdirSync(P.arq("critica")).filter((x) => /^rodada-\d+$/.test(x)).map((x) => +x.slice(7)) : [];
const n = (existentes.length ? Math.max(...existentes) : 0) + 1;
const saida = P.arq("critica", `rodada-${n}`, "filme.mp4");
const r = await renderizar({ pasta, saida, formato: "mp4", qualidade: op.rascunho ? "rascunho" : "entrega", trabalhadores: op.trabalhadores ? +op.trabalhadores : 3, audio });
const seg = (Date.now() - t0) / 1000;
registrar(P.dir, { fase: `render-rodada-${n}`, seg: +seg.toFixed(1), nota: `${r.quadros} quadros${op.rascunho ? " (rascunho)" : ""}` });
console.log(`${saida}  ${r.quadros} quadros em ${seg.toFixed(1)} s`);
