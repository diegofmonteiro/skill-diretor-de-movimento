#!/usr/bin/env node
// Cria a pasta de um projeto de filme.
//
//   node novo-projeto.mjs "<título>" --formato 16:9 [--pasta <caminho>]
//
// Estrutura criada (o filme em si nasce depois, em filme-init.mjs, quando a marca e a grade existirem):
//   projeto.json  briefing.md  registro.json
//   marca/  referencia/  som/  critica/  saida/
//
// Códigos de saída: 0 ok; 1 uso incorreto ou pasta já ocupada.
import fs from "node:fs";
import path from "node:path";
import { CASA, FORMATOS, falhar, gravarJSON, lerArgs, registrar, slug } from "./lib.mjs";

const { pos, op } = lerArgs();
if (op.ajuda || !pos[0]) {
  console.log('Uso: node novo-projeto.mjs "<título>" --formato 16:9|9:16|1:1|4:5 [--pasta caminho] [--simular]');
  process.exit(op.ajuda ? 0 : 1);
}
const titulo = pos[0];
const formato = op.formato || "16:9";
if (!FORMATOS[formato]) falhar(`--formato deve ser um destes: ${Object.keys(FORMATOS).join(", ")}`);
const nome = slug(titulo);
const dir = path.resolve(String(op.pasta || path.join(CASA, "projetos", nome)).replace(/^~/, process.env.HOME || ""));
if (fs.existsSync(path.join(dir, "projeto.json"))) falhar(`${dir} já tem um projeto. Escolha outra --pasta ou continue esse.`);
const { l, a } = FORMATOS[formato];
if (op.simular) { console.log(`[simulação] criaria ${dir} (${formato}, ${l}x${a})`); process.exit(0); }

for (const d of ["marca", "referencia", "som", "critica", "saida"]) fs.mkdirSync(path.join(dir, d), { recursive: true });
gravarJSON(path.join(dir, "projeto.json"), { titulo, nome, formato, largura: l, altura: a, fps: 30, marca: null, criado: new Date().toISOString() });
fs.writeFileSync(path.join(dir, "briefing.md"), `# ${titulo}

<!-- A entrevista, respondida. Uma linha por resposta. -->

- **Para quê:**
- **Duração:**
- **Formato:** ${formato} (${l}x${a})
- **Clima:**
- **Momento de assinatura:**
- **Fonte dos números:**
`);
gravarJSON(path.join(dir, "registro.json"), { eventos: [] });
registrar(dir, { fase: "novo-projeto", seg: 0, nota: `${formato} ${l}x${a}` });
console.log(dir);
