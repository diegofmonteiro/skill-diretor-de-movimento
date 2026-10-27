#!/usr/bin/env node
// Autoteste: roda a skill inteira numa pasta temporária, sem renderizar o vídeo todo (leva cerca de 1 minuto).
//
//   node autoteste.mjs [--manter]
//
// Passos: ambiente, um movimento (um quadro), projeto novo, grade, trilha, filme, regras, auditoria de quadros e um quadro do filme.
// Ao final apaga a pasta temporária (use --manter para olhar o resultado).
//
// Códigos de saída: 0 tudo certo; 1 algum passo falhou (o nome do passo aparece na tela).
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { SKILL, lerArgs } from "./lib.mjs";

const { op } = lerArgs();
if (op.ajuda) { console.log("Uso: node autoteste.mjs [--manter]"); process.exit(0); }
const aqui = path.dirname(fileURLToPath(import.meta.url));
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "dm-autoteste-"));
const proj = path.join(tmp, "projeto");
const rodar = (nome, ...args) => {
  const r = spawnSync(process.execPath, args.map((a) => (a.endsWith(".mjs") ? path.join(aqui, a) : a)), { encoding: "utf8", timeout: 240000 });
  const ok = r.status === 0;
  console.log(`${ok ? "ok   " : "FALHOU"}  ${nome}`);
  if (!ok) { console.log((r.stdout || "") + (r.stderr || "")); limpar(); process.exit(1); }
};
const limpar = () => { if (!op.manter) fs.rmSync(tmp, { recursive: true, force: true }); else console.log("Pasta mantida em " + tmp); };

rodar("ambiente (Node, FFmpeg, Chrome, GSAP)", "verificar-ambiente.mjs");
rodar("um movimento, um quadro", "renderizar-movimento.mjs", "--movimento", "numero-grande", "--aspecto", "9:16", "--quadro", "2", "--saida", path.join(tmp, "movimento.png"));
rodar("projeto novo", "novo-projeto.mjs", "Autoteste", "--formato", "16:9", "--pasta", proj);
fs.copyFileSync(path.join(SKILL, "assets", "filme", "grade-exemplo.json"), path.join(proj, "grade.json"));
rodar("grade de batidas", "grade-de-batidas.mjs", "--projeto", proj);
rodar("trilha original", "sintetizador.mjs", "--projeto", proj);
rodar("filme (montagem)", "filme-init.mjs", "--projeto", proj);
rodar("regras do roteiro", "verificar-regras.mjs", "--projeto", proj);
rodar("auditoria de quadros", "auditar-quadros.mjs", "--projeto", proj, "--passo", "1");
rodar("um quadro do filme", "renderizar-filme.mjs", "--projeto", proj, "--quadro", "9");
for (const f of [path.join(tmp, "movimento.png"), path.join(proj, "som", "trilha.wav")]) if (!fs.existsSync(f)) { console.log("FALHOU  arquivo esperado ausente: " + f); limpar(); process.exit(1); }
console.log("\nTudo certo: a skill funciona neste computador.");
limpar();
