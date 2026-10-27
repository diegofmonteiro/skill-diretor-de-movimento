// Biblioteca compartilhada dos scripts do diretor-de-movimento.
// Node 22 ou mais novo, sem dependências de npm. Código próprio da Conex Prime.
import { spawn, spawnSync } from "node:child_process";
import fs from "node:fs";
import net from "node:net";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

/** Pasta raiz da skill (um nível acima de scripts/). */
export const SKILL = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/** Onde ficam marcas, projetos e o GSAP baixado. Muda com DIRETOR_DE_MOVIMENTO_HOME. */
export const CASA = process.env.DIRETOR_DE_MOVIMENTO_HOME
  ? path.resolve(process.env.DIRETOR_DE_MOVIMENTO_HOME.replace(/^~/, os.homedir()))
  : path.join(os.homedir(), "diretor-de-movimento");

export const VERSAO_GSAP = "3.14.2";

export const FORMATOS = {
  "16:9": { l: 1920, a: 1080 },
  "9:16": { l: 1080, a: 1920 },
  "1:1": { l: 1080, a: 1080 },
  "4:5": { l: 1080, a: 1350 },
};

/* ------------------------------------------------------------ mensagens */

export const falhar = (msg, codigo = 1) => {
  console.error(`\n!! ${msg}`);
  process.exit(codigo);
};

/** Lê as opções "--chave valor" e "--bandeira" de argv. */
export const lerArgs = (argv = process.argv.slice(2)) => {
  const pos = [];
  const op = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) {
      const k = a.slice(2);
      const prox = argv[i + 1];
      if (prox === undefined || prox.startsWith("--")) op[k] = true;
      else { op[k] = prox; i++; }
    } else pos.push(a);
  }
  return { pos, op };
};

/* -------------------------------------------------------------- arquivos */

export const lerJSON = (p, padrao) => {
  if (!fs.existsSync(p)) {
    if (padrao !== undefined) return padrao;
    falhar(`arquivo não encontrado: ${p}`);
  }
  try { return JSON.parse(fs.readFileSync(p, "utf8")); }
  catch (e) { falhar(`${p} não é um JSON válido: ${e.message}`); }
};

export const gravarJSON = (p, v) => {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, JSON.stringify(v, null, 2) + "\n");
};

export const slug = (s) =>
  String(s).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/^https?:\/\//, "").replace(/^www\./, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60) || "filme";

/** Executa um comando com argumentos em lista (nunca em texto único). */
export const executar = (cmd, args, op = {}) => {
  const r = spawnSync(cmd, args, {
    encoding: op.binario ? null : "utf8",
    maxBuffer: 1 << 30,
    cwd: op.cwd,
    env: { ...process.env, ...(op.env || {}) },
    stdio: op.herdar ? "inherit" : "pipe",
    timeout: op.tempoMax,
  });
  if (r.error && r.error.code === "ENOENT") return { codigo: 127, saida: "", erro: `${cmd}: não encontrado` };
  return { codigo: r.status ?? 1, saida: r.stdout ?? "", erro: r.stderr ? String(r.stderr) : "" };
};

export const duracaoDe = (arquivo) => {
  const r = executar("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", arquivo]);
  return parseFloat(r.saida) || 0;
};

export const dimensoesDe = (arquivo) => {
  const r = executar("ffprobe", ["-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height", "-of", "csv=p=0:s=x", arquivo]);
  const [l, a] = (r.saida || "").trim().split("x").map(Number);
  return l && a ? { l, a } : null;
};

/* ------------------------------------------------------------- projeto */

export const abrirProjeto = (dir) => {
  const p = path.resolve(dir || ".");
  if (!fs.existsSync(path.join(p, "projeto.json")))
    falhar(`${p} não é um projeto do diretor-de-movimento (falta projeto.json). Rode novo-projeto.mjs antes.`);
  return { dir: p, meta: lerJSON(path.join(p, "projeto.json")), arq: (...xs) => path.join(p, ...xs) };
};

/** Registra o que cada etapa fez e quanto demorou; o log de entrega sai daqui. */
export const registrar = (dirProjeto, ev) => {
  const p = path.join(dirProjeto, "registro.json");
  const reg = lerJSON(p, { eventos: [] });
  reg.eventos.push({ em: new Date().toISOString(), custo: 0, ...ev });
  gravarJSON(p, reg);
};

/* --------------------------------------------------- tempo em batidas */

/**
 * Lê um tempo escrito como "B12", "compasso3", "B12+0.1", "4.5" ou o nome de
 * uma marca ("queda", "logo"). A mesma regra existe em assets/motor/filme.js,
 * para que imagem e som leiam a mesma medida.
 */
export const criarRelogio = ({ bpm, deslocamento = 0, batidasPorCompasso = 4, marcas = {} }) => {
  const spb = 60 / bpm;
  const B = (n) => deslocamento + n * spb;
  const compasso = (n) => B(n * batidasPorCompasso);
  const t = (espec) => {
    if (typeof espec === "number") return espec;
    const s = String(espec).replace(/\s+/g, "");
    if (/^-?\d+(\.\d+)?$/.test(s)) return parseFloat(s);
    const m = s.match(/^(.+?)([+-]\d+(?:\.\d+)?)?$/);
    const cabeca = m[1];
    const desvio = m[2] ? parseFloat(m[2]) : 0;
    let base;
    if (/^B\d+(\.\d+)?$/.test(cabeca)) base = B(parseFloat(cabeca.slice(1)));
    else if (/^compasso\d+(\.\d+)?$/.test(cabeca)) base = compasso(parseFloat(cabeca.slice(8)));
    else if (Object.prototype.hasOwnProperty.call(marcas, cabeca)) base = typeof marcas[cabeca] === "number" ? marcas[cabeca] : t(marcas[cabeca]);
    else throw new Error(`não consegui ler o tempo "${espec}" (use B12, compasso3, 4.5 ou o nome de uma marca)`);
    return +(base + desvio).toFixed(4);
  };
  return { spb, B, compasso, t };
};

/* ---------------------------------------------------------- navegador */

/** Procura um Chrome ou Chromium. DIRETOR_DE_MOVIMENTO_CHROME força um caminho. */
export const acharChrome = () => {
  const candidatos = [
    process.env.DIRETOR_DE_MOVIMENTO_CHROME,
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
    "/usr/bin/google-chrome", "/usr/bin/google-chrome-stable", "/usr/bin/chromium", "/usr/bin/chromium-browser",
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  ].filter(Boolean);
  for (const c of candidatos) if (fs.existsSync(c)) return c;
  // Playwright instalado na máquina (opcional): usa o Chromium dele
  const pw = process.env.PLAYWRIGHT_BROWSERS_PATH || "/opt/pw-browsers";
  if (fs.existsSync(pw)) {
    for (const d of fs.readdirSync(pw).filter((x) => x.startsWith("chromium"))) {
      for (const sub of ["chrome-linux64/chrome", "chrome-linux/chrome", "chrome-mac/Chromium.app/Contents/MacOS/Chromium"]) {
        const p = path.join(pw, d, sub);
        if (fs.existsSync(p)) return p;
      }
    }
  }
  return null;
};

export const chrome = () => acharChrome() || falhar("Chrome não encontrado. Instale o Google Chrome ou rode: node scripts/verificar-ambiente.mjs");

/** Caminho do GSAP baixado pela verificação de ambiente. */
export const caminhoGsap = () => {
  const cand = [path.join(CASA, "vendor", "gsap.min.js"), path.join(SKILL, "vendor", "gsap.min.js")];
  for (const c of cand) if (fs.existsSync(c)) return c;
  return null;
};

/**
 * Abre uma página no Chrome sem interface e conversa com ela pelo protocolo
 * de depuração. fn recebe { avaliar, enviar, capturar }.
 */
export const comPagina = async (url, { largura = 1920, altura = 1080, gl = false } = {}, fn) => {
  const porta = await new Promise((ok) => { const s = net.createServer(); s.listen(0, () => { const p = s.address().port; s.close(() => ok(p)); }); });
  const perfil = fs.mkdtempSync(path.join(os.tmpdir(), "dm-chrome-"));
  const flags = ["--headless=new", "--no-sandbox", "--hide-scrollbars", "--mute-audio", "--allow-file-access-from-files",
    "--disable-background-networking", "--disable-component-update", "--disable-sync", "--no-first-run", "--disable-default-apps", "--disable-background-timer-throttling", "--disable-renderer-backgrounding", "--force-color-profile=srgb",
    `--user-data-dir=${perfil}`, `--remote-debugging-port=${porta}`, `--window-size=${largura},${altura}`];
  if (gl) flags.push("--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader");
  const proc = spawn(chrome(), [...flags, "about:blank"], { stdio: "ignore" });
  let ws;
  try {
    for (let i = 0; i < 80 && !ws; i++) {
      await new Promise((r) => setTimeout(r, 150));
      try {
        const lista = await (await fetch(`http://127.0.0.1:${porta}/json/list`)).json();
        const pg = lista.find((x) => x.type === "page");
        if (pg) ws = new WebSocket(pg.webSocketDebuggerUrl);
      } catch { /* ainda subindo */ }
    }
    if (!ws) throw new Error("não consegui iniciar o Chrome sem interface");
    await new Promise((r) => ws.addEventListener("open", r, { once: true }));
    let id = 0;
    const pend = new Map();
    ws.addEventListener("message", (m) => {
      const d = JSON.parse(m.data);
      if (d.id && pend.has(d.id)) { pend.get(d.id)(d); pend.delete(d.id); }
    });
    const enviar = (metodo, params = {}) => new Promise((r) => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method: metodo, params })); });
    const avaliar = async (expr) => {
      const r = await enviar("Runtime.evaluate", { expression: expr, awaitPromise: true, returnByValue: true });
      if (r.result?.exceptionDetails) throw new Error(JSON.stringify(r.result.exceptionDetails).slice(0, 500));
      return r.result?.result?.value;
    };
    const capturar = async (transparente = false, formato = "png") => {
      const r = await enviar("Page.captureScreenshot", { format: formato, ...(formato === "jpeg" ? { quality: 95 } : {}) });
      return Buffer.from(r.result.data, "base64");
    };
    await enviar("Emulation.setDeviceMetricsOverride", { width: largura, height: altura, deviceScaleFactor: 1, mobile: false });
    await enviar("Emulation.setDefaultBackgroundColorOverride", { color: { r: 0, g: 0, b: 0, a: 0 } });
    await enviar("Page.enable");
    await enviar("Page.navigate", { url });
    return await fn({ avaliar, enviar, capturar });
  } finally {
    try { ws && ws.close(); } catch { /* ok */ }
    try { proc.kill("SIGKILL"); } catch { /* ok */ }
    try { fs.rmSync(perfil, { recursive: true, force: true }); } catch { /* ok */ }
  }
};

/** Espera a composição registrar o relógio, as fontes e as imagens carregarem. */
export const esperarComposicao = (avaliar) => avaliar(`(async () => {
  for (let i = 0; i < 200 && !(window.__linhas && window.__linhas.principal); i++) await new Promise((r) => setTimeout(r, 50));
  if (!(window.__linhas && window.__linhas.principal)) throw new Error("a composição não registrou window.__linhas.principal");
  await document.fonts.ready;
  await Promise.all([...document.images].map((im) => im.complete ? 0 : new Promise((r) => { im.onload = im.onerror = r; })));
  return true; })()`);

/* ------------------------------------------------------ folhas de contato */

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

/** Grade de imagens com legenda, desenhada em HTML e fotografada pelo Chrome. */
export const folha = async (itens, saida, { colunas = 4, celula = 480, titulo = "", proporcao = 1.6, fundoCelula = "#2a2a30" } = {}) => {
  if (!itens.length) return null;
  const linhas = Math.ceil(itens.length / colunas);
  const ch = Math.round(celula / proporcao);
  const L = colunas * (celula + 16) + 16;
  const A = linhas * (ch + 46) + 16 + (titulo ? 56 : 0);
  const html = `<!doctype html><html><body style="margin:0;background:#16161a;font:600 15px/1.2 -apple-system,Helvetica,Arial,sans-serif;color:#eee;width:${L}px">
${titulo ? `<div style="padding:18px 16px 0;font-size:22px">${esc(titulo)}</div>` : ""}
<div style="display:grid;grid-template-columns:repeat(${colunas},${celula}px);gap:16px;padding:16px">
${itens.map((it) => `<div><div style="width:${celula}px;height:${ch}px;background:${fundoCelula} url('file://${encodeURI(it.src)}') center/contain no-repeat;border-radius:6px"></div><div style="margin-top:6px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(it.legenda)}</div></div>`).join("\n")}
</div></body></html>`;
  const tmp = saida.replace(/\.\w+$/, "") + ".folha.html";
  fs.writeFileSync(tmp, html);
  await comPagina("file://" + tmp, { largura: L, altura: A }, async ({ avaliar, capturar }) => {
    await avaliar(`Promise.all([...document.images].map(i=>i.complete?0:new Promise(r=>{i.onload=i.onerror=r})))`);
    await new Promise((r) => setTimeout(r, 400));
    fs.writeFileSync(saida, await capturar());
  });
  fs.rmSync(tmp, { force: true });
  return saida;
};

export const fmtT = (s) => {
  const m = Math.floor(s / 60);
  const r = s - m * 60;
  return `${m}:${r.toFixed(2).padStart(5, "0")}`;
};
