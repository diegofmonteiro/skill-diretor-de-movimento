/* Motor dos movimentos do diretor-de-movimento.
   Todo movimento carrega o GSAP, depois este arquivo, depois o próprio roteiro.
   O objeto global MOV entrega o necessário para o movimento funcionar em qualquer
   marca, em qualquer formato e com ou sem fundo (fundo "nenhum" = transparente).

   MOV.v            variáveis: tokens da marca + variáveis do movimento + fundo + aspecto
   MOV.L, MOV.A     largura e altura do quadro em px
   MOV.u            min(L, A) / 1080. Meça TUDO em unidades u
   MOV.retrato      verdadeiro em 9:16 e 4:5
   MOV.alfa         verdadeiro quando o fundo é transparente ou há cor de chave
   MOV.seguro       {topo, base, esq, dir} em px: margens que evitam a interface das redes
   MOV.tl           linha do tempo pausada; MOV.pronto() a registra (chame por último)
   MOV.sorteio(n)   sorteio com semente, MOV.degraus(d) curva em passos de 12 quadros por segundo
   MOV.palavras(el) divide o texto em spans .p e devolve a lista
   MOV.ajustar(el, larguraMax) reduz a fonte até o TEXTO caber em larguraMax
   MOV.imagem(src, classe)     cria um <img> sem texto alternativo (decorativo)
   MOV.zona(el, posicao)       estica el sobre a zona segura; posicao: topo, centro ou base
   MOV.numero(n, casas)        formata no padrão brasileiro
   MOV.D                       duração do movimento em segundos
   MOV.digitar(el, texto, inicio, dur)            texto letra a letra
   MOV.contar(el, de, ate, inicio, dur, formatar) contador que só aparece quando começa
   MOV.trocarTexto(el, antes, depois, t) troca o texto num instante
   MOV.sair(alvo)              saída padrão nos últimos 0,38 s
*/
(function () {
  "use strict";
  const raiz = document.getElementById("raiz");

  // 1) variáveis: padrões declarados no <html> + valores injetados pelo montador
  const v = {};
  try { for (const d of JSON.parse(document.documentElement.dataset.variaveis || "[]")) v[d.id] = d.padrao; } catch (e) { /* sem padrões */ }
  Object.assign(v, window.__variaveis || {});

  const L = +raiz.dataset.largura;
  const A = +raiz.dataset.altura;
  const u = Math.min(L, A) / 1080;
  const retrato = A > L;
  const chave = /^#[0-9a-f]{6}$/i.test(v.chave || "") ? v.chave : null;
  const alfa = v.fundo === "nenhum" || !!chave;

  // 2) tokens da marca viram variáveis CSS na raiz
  const css = {
    "--destaque": v.destaque, "--destaque2": v.destaque2, "--tinta": v.tinta, "--fundo": v.fundoCor,
    "--superficie": v.superficie, "--apagado": v.apagado, "--papel": v.papel,
    "--fonte-titulo": `"${v.fonteTitulo}", "Archivo Black", "Arial Black", sans-serif`,
    "--fonte-corpo": `"${v.fonteCorpo}", "Inter", "Helvetica Neue", Arial, sans-serif`,
    "--u": u + "px",
  };
  for (const k in css) if (css[k]) raiz.style.setProperty(k, css[k]);

  if (alfa) {
    const cor = chave || "transparent";
    document.documentElement.style.background = cor;
    document.body.style.background = cor;
    raiz.style.background = cor;
    raiz.classList.add("e-alfa");
    if (chave) raiz.classList.add("e-chave");
  }
  raiz.classList.add(retrato ? "e-retrato" : L === A ? "e-quadrado" : "e-paisagem");

  // 3) zonas seguras. Em 9:16 uma sobreposição (alfa) evita título, legenda e botões da rede;
  //    um corte de cobertura (B-roll) ocupa o quadro todo com margens iguais.
  const k = L / 1080;
  const seguroSobreposicao = retrato
    ? { topo: 250 * k, base: 620 * k, esq: 70 * k, dir: 170 * k }
    : { topo: A * 0.06, base: A * 0.08, esq: L * 0.05, dir: L * 0.05 };
  const seguro = retrato && !alfa ? { topo: 220 * k, base: 220 * k, esq: 80 * k, dir: 80 * k } : seguroSobreposicao;

  // 4) utilidades
  const tl = gsap.timeline({ paused: true });

  // mulberry32: gerador pequeno e conhecido, suficiente para variar posições com semente fixa
  const sorteio = (semente) => () => {
    semente = (semente + 0x6d2b79f5) | 0;
    let t = Math.imul(semente ^ (semente >>> 15), 1 | semente);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const degraus = (d) => `steps(${Math.max(1, Math.round(d * 12))})`;

  const palavras = (el) => {
    if (typeof el === "string") el = document.querySelector(el);
    if (el.dataset.dividido) return [...el.querySelectorAll(".p")];
    const andar = (no) => [...no.childNodes].forEach((c) => {
      if (c.nodeType === 3) {
        const frag = document.createDocumentFragment();
        c.textContent.split(/(\s+)/).forEach((trecho) => {
          if (!trecho) return;
          if (/^\s+$/.test(trecho)) frag.appendChild(document.createTextNode(trecho));
          else { const s = document.createElement("span"); s.className = "p"; s.style.display = "inline-block"; s.textContent = trecho; frag.appendChild(s); }
        });
        c.replaceWith(frag);
      } else if (c.nodeType === 1 && !c.classList.contains("p")) andar(c);
    });
    andar(el);
    el.dataset.dividido = "1";
    return [...el.querySelectorAll(".p")];
  };

  // mede o TEXTO (um Range sobre o conteúdo), então funciona em caixas de bloco, flex e absolutas
  const ajustar = (el, larguraMax, minimo = 10) => {
    if (typeof el === "string") el = document.querySelector(el);
    let tam = parseFloat(getComputedStyle(el).fontSize);
    el.style.whiteSpace = "nowrap";
    const r = document.createRange();
    const largura = () => { r.selectNodeContents(el); return r.getBoundingClientRect().width; };
    while (largura() > larguraMax && tam > minimo) { tam -= 2; el.style.fontSize = tam + "px"; }
    return tam;
  };

  const imagem = (src, classe) => { const i = document.createElement("img"); i.src = src; if (classe) i.className = classe; i.alt = ""; return i; };

  // formata número no padrão brasileiro (milhar com ponto)
  const numero = (n, casas = 0) => Number(n).toLocaleString("pt-BR", { minimumFractionDigits: casas, maximumFractionDigits: casas });

  // estica um elemento sobre a zona segura e alinha o conteúdo em cima, no centro ou embaixo
  const zona = (el, posicao) => {
    if (typeof el === "string") el = document.querySelector(el);
    const p = posicao || v.posicao || (alfa ? "topo" : "centro");
    el.style.position = "absolute";
    el.style.left = seguro.esq + "px"; el.style.right = seguro.dir + "px";
    el.style.top = seguro.topo + "px"; el.style.bottom = seguro.base + "px";
    el.style.display = "flex"; el.style.flexDirection = "column"; el.style.alignItems = "center";
    el.style.justifyContent = p === "topo" ? "flex-start" : p === "base" ? "flex-end" : "center";
    return p;
  };

  const D = +raiz.dataset.duracao;

  // texto que aparece letra a letra (o texto é função pura do instante: serve em qualquer renderização)
  const digitar = (el, texto, inicio, dur, passos = true) => {
    if (typeof el === "string") el = document.querySelector(el);
    const c = { n: 0 };
    el.textContent = "";
    tl.to(c, { n: texto.length, duration: dur, ease: passos ? `steps(${Math.max(1, texto.length)})` : "none",
      onUpdate: () => { el.textContent = texto.slice(0, Math.round(c.n)); } }, inicio);
    return inicio + dur;
  };

  // contador: não mostra nada antes de começar, para no valor final.
  // O texto é gravado por JavaScript (e não pelo GSAP, que converteria "1.200" em 1,2).
  const contar = (el, de, ate, inicio, dur, formatar, curva = "power3.out") => {
    if (typeof el === "string") el = document.querySelector(el);
    const f = formatar || ((x) => numero(x));
    const c = { x: de };
    el.textContent = "";
    tl.to(c, { x: ate, duration: dur, ease: curva, onUpdate: () => { el.textContent = f(c.x); } }, inicio);
    return inicio + dur;
  };

  // troca o texto de um elemento num instante: dois spans, um some e o outro aparece
  const trocarTexto = (el, antes, depois, instante) => {
    if (typeof el === "string") el = document.querySelector(el);
    el.innerHTML = `<span class="tt-a">${antes}</span><span class="tt-b" style="display:none">${depois}</span>`;
    tl.set(el.querySelector(".tt-a"), { display: "none" }, instante);
    tl.set(el.querySelector(".tt-b"), { display: "inline" }, instante);
  };

  // saída padrão: nos últimos 0,38 s tudo sobe um pouco, some e acelera
  const sair = (alvo, dur = 0.38) => {
    tl.to(alvo, { opacity: 0, y: -36 * u, duration: dur, ease: "power3.in" }, D - dur);
    tl.set(alvo, { opacity: 0 }, D);
  };

  const pronto = () => {
    window.__linhas = window.__linhas || {};
    window.__linhas.principal = tl;
  };

  window.MOV = { v, L, A, u, retrato, alfa, chave, seguro, seguroSobreposicao, tl, sorteio, degraus, palavras, ajustar, imagem, numero, zona, D, digitar, contar, trocarTexto, sair, pronto };
})();
