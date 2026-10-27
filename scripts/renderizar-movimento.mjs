#!/usr/bin/env node
// Renderiza UM movimento (efeito, transição, selo ou sobreposição) na marca da pessoa.
//
//   node renderizar-movimento.mjs --movimento <id> [--marca <pasta da marca ou do projeto>]
//        [--aspecto 9:16|16:9|1:1|4:5] [--formato mp4|mov|webm|gif|sequencia]
//        [--fundo olhar|nenhum] [--variaveis '{"titulo":"..."}'] [--saida arquivo]
//        [--qualidade rascunho|entrega] [--manter] [--listar]
//
// --marca vazio usa a marca de exemplo (assets/marca-exemplo), só para pré-visualizar.
// --fundo nenhum gera transparente (use --formato mov ou webm) para sobrepor a um vídeo gravado;
// --fundo olhar usa o fundo do próprio movimento, para um corte de cobertura (B-roll).
// Para editores sem transparência (CapCut): --formato mp4 --variaveis '{"chave":"#00FF00"}'.
//
// Códigos de saída: 0 ok; 1 uso incorreto, movimento inexistente ou falha na renderização.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { SKILL, FORMATOS, caminhoGsap, falhar, lerArgs, lerJSON } from "./lib.mjs";
import { renderizar } from "./renderizador.mjs";

export const DIR_MOVS = path.join(SKILL, "assets", "movimentos");

/** Lê a marca e a transforma no conjunto de tokens que todo movimento entende. */
export const lerMarca = (dirMarca) => {
  const d = dirMarca ? path.resolve(dirMarca) : path.join(SKILL, "assets", "marca-exemplo");
  const raiz = fs.existsSync(path.join(d, "marca.json")) ? d : path.join(d, "marca");
  const j = lerJSON(path.join(raiz, "marca.json"), null);
  if (!j) falhar(`não achei marca.json em ${d}. Rode captura-de-marca.mjs ou deixe --marca vazio para usar a marca de exemplo.`);
  const c = j.cores || {};
  const tokens = {
    nomeMarca: String(j.nome || "").split(":")[0].trim(),
    dominio: String(j.dominio || "").replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/.*$/, ""),
    slogan: j.slogan || "", usuario: j.usuario || "", manchete: j.titulo || j.slogan || "",
    fundoCor: c.fundo || "#0E0D12", tinta: c.tinta || "#F4F2EE", destaque: c.destaque || "#FF6A3D",
    destaque2: c.destaque2 || c.destaque || "#7C5CFF", superficie: c.superficie || "#1A1820",
    apagado: c.apagado || "#8D8A96", papel: c.papel || "#F3EFE6",
    fonteTitulo: j.fontes?.titulo?.familia || "Archivo Black", fonteCorpo: j.fontes?.corpo?.familia || "Inter",
    numeros: j.numeros || [],
  };
  return { raiz, tokens, arquivos: { logo: j.logo, simbolo: j.simbolo || j.logo, telas: j.telas || [], pessoas: j.pessoas || [], fontes: j.fontes || {} } };
};

export const listarMovimentos = () =>
  fs.readdirSync(DIR_MOVS).filter((x) => fs.existsSync(path.join(DIR_MOVS, x, "movimento.json")))
    .map((x) => lerJSON(path.join(DIR_MOVS, x, "movimento.json")));

/**
 * Monta a pasta de trabalho (index.html + ativos/) de um movimento.
 * Devolve { dir, largura, altura, duracao }.
 */
export const montarMovimento = ({ id, marca, aspecto, fundo = "olhar", variaveis = {}, destino }) => {
  const pasta = path.join(DIR_MOVS, id);
  if (!fs.existsSync(path.join(pasta, "movimento.json"))) falhar(`não existe o movimento "${id}". Veja a lista com --listar.`);
  const meta = lerJSON(path.join(pasta, "movimento.json"));
  const asp = aspecto || meta.formatos?.[0] || "9:16";
  const med = FORMATOS[asp] || falhar(`--aspecto deve ser um destes: ${Object.keys(FORMATOS).join(", ")}`);
  if (meta.formatos && !meta.formatos.includes(asp)) falhar(`${id} aceita só ${meta.formatos.join(", ")}`);
  if (fundo === "nenhum" && !meta.alfa) falhar(`${id} não tem versão transparente (alfa: false). Use --fundo olhar.`);

  const gsap = caminhoGsap() || falhar("GSAP não encontrado. Rode: node scripts/verificar-ambiente.mjs --corrigir");
  const dir = destino || fs.mkdtempSync(path.join(os.tmpdir(), `dm-mov-${id}-`));
  const A = path.join(dir, "ativos"), M = path.join(A, "marca");
  fs.mkdirSync(M, { recursive: true });
  fs.copyFileSync(gsap, path.join(A, "gsap.min.js"));
  fs.copyFileSync(path.join(SKILL, "assets", "motor", "movimento.js"), path.join(A, "movimento.js"));
  fs.copyFileSync(path.join(SKILL, "assets", "motor", "movimento.css"), path.join(A, "movimento.css"));
  if (fs.existsSync(path.join(pasta, "ativos"))) fs.cpSync(path.join(pasta, "ativos"), A, { recursive: true });

  // arquivos da marca sob nomes estáveis, para o movimento não depender de nomes de terceiros
  const levar = (rel, nome) => {
    if (!rel) return null;
    const src = path.join(marca.raiz, rel);
    if (!fs.existsSync(src)) return null;
    const dst = nome + path.extname(src);
    fs.copyFileSync(src, path.join(M, dst));
    return `ativos/marca/${dst}`;
  };
  const arqs = {
    logo: levar(marca.arquivos.logo, "logo"), simbolo: levar(marca.arquivos.simbolo, "simbolo"),
    telas: marca.arquivos.telas.map((s, i) => levar(s, `tela-${i + 1}`)).filter(Boolean),
    pessoas: marca.arquivos.pessoas.map((s, i) => levar(s, `pessoa-${i + 1}`)).filter(Boolean),
  };
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

  const todas = { ...marca.tokens, ...arqs, fundo, aspecto: asp, ...variaveis };
  for (const vd of meta.variaveis || []) if (todas[vd.id] === undefined) todas[vd.id] = vd.padrao;
  const dur = +(todas.duracao || meta.duracao);

  const ler = (n) => (fs.existsSync(path.join(pasta, n)) ? fs.readFileSync(path.join(pasta, n), "utf8") : "");
  const html = `<!doctype html>
<html lang="pt-BR" data-variaveis='${JSON.stringify(meta.variaveis || []).replace(/'/g, "&#39;")}'>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=${med.l}, height=${med.a}" />
<script src="ativos/gsap.min.js"></script>
<link rel="stylesheet" href="ativos/marca-fontes.css" />
<link rel="stylesheet" href="ativos/movimento.css" />
<style>
html, body { width: ${med.l}px; height: ${med.a}px; }
#raiz { width: ${med.l}px; height: ${med.a}px; }
${ler("estilo.css")}
</style>
</head>
<body>
<div id="raiz" data-largura="${med.l}" data-altura="${med.a}" data-duracao="${dur}" data-fps="30">
<div id="fundo"><i class="l1"></i><i class="l2"></i></div>
${ler("corpo.html")}
<div id="granulado"></div>
</div>
<script>window.__variaveis = ${JSON.stringify(todas).replace(/</g, "\\u003c")};</script>
<script src="ativos/movimento.js"></script>
<script>
${ler("anima.js")}
</script>
</body>
</html>
`;
  fs.writeFileSync(path.join(dir, "index.html"), html);
  return { dir, largura: med.l, altura: med.a, duracao: dur, meta, aspecto: asp };
};

if (process.argv[1]?.endsWith("renderizar-movimento.mjs")) {
  const { op } = lerArgs();
  if (op.listar) {
    for (const m of listarMovimentos()) console.log(`${m.id.padEnd(26)} ${m.categoria.padEnd(13)} ${m.alfa ? "transparente" : "só fundo    "}  ${m.nome}`);
    process.exit(0);
  }
  if (op.ajuda || !op.movimento) {
    console.log("Uso: node renderizar-movimento.mjs --movimento <id> [--marca pasta] [--aspecto 9:16] [--formato mp4|mov|webm|gif|sequencia]\n     [--fundo olhar|nenhum] [--variaveis json] [--saida arquivo] [--qualidade rascunho|entrega] [--quadro seg] [--manter] [--listar]");
    process.exit(op.ajuda ? 0 : 1);
  }
  const marca = lerMarca(op.marca);
  const fundo = op.fundo || "olhar";
  const formato = op.formato || "mp4";
  if (fundo === "nenhum" && !["mov", "webm", "gif", "sequencia"].includes(formato))
    falhar("--fundo nenhum precisa de --formato mov, webm, gif ou sequencia, senão a transparência se perde");
  let variaveis = {};
  try { variaveis = JSON.parse(op.variaveis || "{}"); } catch (e) { falhar(`--variaveis não é um JSON válido: ${e.message}`); }
  const m = montarMovimento({ id: op.movimento, marca, aspecto: op.aspecto, fundo, variaveis });
  const ext = { mp4: ".mp4", mov: ".mov", webm: ".webm", gif: ".gif", sequencia: "" }[formato];
  const saida = path.resolve(op.saida || `${op.movimento}-${m.aspecto.replace(":", "x")}${fundo === "nenhum" ? "-transparente" : ""}${ext}`);
  const t0 = Date.now();
  const r = await renderizar({ pasta: m.dir, saida, formato, qualidade: op.qualidade, quadro: op.quadro, transparente: ["mov", "webm", "gif", "sequencia"].includes(formato) });
  if (!op.manter) fs.rmSync(m.dir, { recursive: true, force: true }); else console.log(`pasta de trabalho: ${m.dir}`);
  console.log(`${r.arquivo}  ${m.aspecto} ${formato}${fundo === "nenhum" ? " (transparente)" : ""} em ${((Date.now() - t0) / 1000).toFixed(1)} s`);
}
