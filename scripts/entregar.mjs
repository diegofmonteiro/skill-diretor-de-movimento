#!/usr/bin/env node
// Fecha o projeto: confere o vídeo final e escreve o registro do que foi feito.
//
//   node entregar.mjs --projeto <pasta> [--rodada N] [--nome nome-do-arquivo] [--simular]
//
// Pega a rodada indicada (ou a mais nova) de critica/, confere resolução, duração e se há áudio,
// copia para saida/<nome>.mp4 e escreve saida/LOG.md com as etapas, o tempo de cada uma e o que a crítica decidiu.
// Não apaga nada.
//
// Códigos de saída: 0 entregue; 1 vídeo ausente ou fora do combinado.
import fs from "node:fs";
import { abrirProjeto, dimensoesDe, duracaoDe, executar, falhar, lerArgs, lerJSON, registrar, slug } from "./lib.mjs";

const { op } = lerArgs();
if (op.ajuda || !op.projeto) { console.log("Uso: node entregar.mjs --projeto <pasta> [--rodada N] [--nome arquivo] [--simular]"); process.exit(op.ajuda ? 0 : 1); }
const P = abrirProjeto(op.projeto);

const rodadas = fs.existsSync(P.arq("critica")) ? fs.readdirSync(P.arq("critica")).filter((x) => /^rodada-\d+$/.test(x)).map((x) => +x.slice(7)).sort((a, b) => a - b) : [];
if (!rodadas.length) falhar("nenhuma rodada renderizada. Rode renderizar-filme.mjs antes.");
const n = op.rodada ? +op.rodada : rodadas[rodadas.length - 1];
const origem = P.arq("critica", `rodada-${n}`, "filme.mp4");
if (!fs.existsSync(origem)) falhar(`não existe ${origem}`);

const dim = dimensoesDe(origem), dur = duracaoDe(origem);
const temAudio = executar("ffprobe", ["-v", "error", "-select_streams", "a", "-show_entries", "stream=codec_name", "-of", "csv=p=0", origem]).saida.trim() !== "";
const problemas = [];
if (!dim || dim.l !== P.meta.largura || dim.a !== P.meta.altura) problemas.push(`resolução ${dim ? dim.l + "x" + dim.a : "?"}, esperada ${P.meta.largura}x${P.meta.altura}`);
if (!temAudio) problemas.push("o vídeo não tem áudio");
const veredito = lerJSON(P.arq("critica", `rodada-${n}`, "scores.json"), null);
if (veredito && veredito.aprovado === false) problemas.push("a crítica desta rodada não aprovou (scores.json)");
if (problemas.length) falhar("não vou entregar: " + problemas.join("; ") + ".");

const nome = slug(op.nome || P.meta.titulo || P.meta.nome);
const destino = P.arq("saida", `${nome}.mp4`);
if (op.simular) { console.log(`[simulação] copiaria ${origem} para ${destino}`); process.exit(0); }
fs.mkdirSync(P.arq("saida"), { recursive: true });
fs.copyFileSync(origem, destino);

const reg = lerJSON(P.arq("registro.json"), { eventos: [] });
const total = reg.eventos.reduce((s, e) => s + (e.seg || 0), 0);
const linhas = [`# Registro de ${P.meta.titulo}`, "",
  `Entrega: \`${nome}.mp4\`, ${dim.l}x${dim.a}, ${dur.toFixed(1)} s, com áudio. Rodada usada: ${n} de ${rodadas.length}.`, "",
  "| Etapa | Quando | Tempo (s) | Nota |", "|---|---|---|---|",
  ...reg.eventos.map((e) => `| ${e.fase} | ${String(e.em).slice(0, 16).replace("T", " ")} | ${e.seg ?? 0} | ${e.nota || ""} |`), "",
  `Tempo de máquina somado: ${total.toFixed(0)} s.`];
if (veredito) linhas.push("", "## Crítica da rodada usada", "", "```json", JSON.stringify(veredito, null, 2), "```");
fs.writeFileSync(P.arq("saida", "LOG.md"), linhas.join("\n") + "\n");
registrar(P.dir, { fase: "entrega", seg: 0, nota: `${nome}.mp4` });
console.log(destino);
