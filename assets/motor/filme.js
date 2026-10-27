/* Motor dos filmes do diretor-de-movimento.
 *
 * Ordem de carga no index.html: gsap, ativos/batidas.js, este arquivo, o roteiro do filme.
 * Tudo aqui é função pura do instante da linha do tempo: sem relógio, sem Math.random,
 * sem rede, sem repetição infinita. A renderização vai ao instante de cada quadro,
 * então qualquer outra coisa aparece como tremor.
 *
 * O que o filme ganha:
 *   FILME.B(n), FILME.compasso(n), FILME.t("B12+0.1")  tempo pela batida, calculado pelo ÍNDICE
 *   FILME.seguro                                       caixa segura do formato, em px
 *   FILME.cenas(tl)                                    mostra cada <section class="cena"> só no seu intervalo
 *   FILME.linhas(tl)                                   cada .linha-texto recebe entrada E saída, ou o filme não monta
 *   FILME.seda(canvas, opcoes, tl)                     fundo de luz em movimento nas cores da marca
 *   FILME.camera, FILME.voo, FILME.cursor, FILME.carimbo, FILME.brilho
 *   FILME.terminar(tl)                                 confere se tudo foi ligado e registra a linha do tempo
 */
(function () {
  "use strict";
  const F = (window.FILME = window.FILME || {});
  const BAT = window.__BATIDAS || { bpm: 120, deslocamento: 0, batidasPorCompasso: 4, marcas: {} };

  F.bpm = BAT.bpm;
  F.spb = 60 / BAT.bpm;
  F.bpc = BAT.batidasPorCompasso || 4;
  F.marcas = BAT.marcas || {};

  /** Batida n em segundos, pelo índice: 32 batidas nunca se afastam do tempo. */
  F.B = (n) => (BAT.deslocamento || 0) + n * F.spb;
  F.compasso = (n) => F.B(n * F.bpc);

  /** "B12", "compasso3", "B12+0.1", "queda-0.2", "4.5" ou o nome de uma marca. Mesma regra do beatgrid. */
  F.t = (espec) => {
    if (typeof espec === "number") return espec;
    const s = String(espec).replace(/\s+/g, "");
    if (/^-?\d+(\.\d+)?$/.test(s)) return parseFloat(s);
    const m = s.match(/^(.+?)([+-]\d+(?:\.\d+)?)?$/);
    const cab = m[1], desvio = m[2] ? parseFloat(m[2]) : 0;
    let base;
    if (/^B\d+(\.\d+)?$/.test(cab)) base = F.B(parseFloat(cab.slice(1)));
    else if (/^compasso\d+(\.\d+)?$/.test(cab)) base = F.compasso(parseFloat(cab.slice(8)));
    else if (Object.prototype.hasOwnProperty.call(F.marcas, cab)) base = F.marcas[cab];
    else throw new Error(`diretor-de-movimento: não consegui ler o tempo "${espec}" (use B12, compasso3, 4.5 ou uma marca da grade)`);
    return +(base + desvio).toFixed(4);
  };

  /* ------------------------------------------------------------- formato */
  const raiz = document.getElementById("raiz");
  F.L = +raiz.dataset.largura; F.A = +raiz.dataset.altura;
  F.retrato = F.A > F.L;
  const k = F.L / 1080;
  // 9:16: nada nos 168 px de cima, nada abaixo de y=1330 (legenda e botões da rede) nem sob a coluna da direita
  F.seguro = F.retrato
    ? { topo: 168 * k, base: F.A - 1330 * k > 0 ? F.A - 1330 * k : 590 * k, esq: 64 * k, dir: 162 * k }
    : { topo: F.A * 0.06, base: F.A * 0.07, esq: F.L * 0.05, dir: F.L * 0.05 };
  raiz.classList.add(F.retrato ? "e-retrato" : F.L === F.A ? "e-quadrado" : "e-paisagem");

  /* --------------------------------------------------------------- cenas */
  F.cenas = (tl) => {
    document.querySelectorAll("section.cena").forEach((c) => {
      if (!c.id) throw new Error("toda <section class=\"cena\"> precisa de id (o mesmo da grade de batidas)");
      const ini = F.t(c.dataset.inicio), dur = +c.dataset.duracao;
      tl.set(c, { visibility: "hidden" }, 0);
      tl.set(c, { visibility: "visible" }, ini);
      tl.set(c, { visibility: "hidden" }, +(ini + dur).toFixed(4));
    });
  };

  /* ---------------------------------------------------- texto em partes */
  const dividir = (el, modo) => {
    if (el.dataset.dividido === modo) return [...el.querySelectorAll(modo === "letras" ? ".l" : ".p")];
    const classe = modo === "letras" ? "l" : "p";
    const andar = (no) => [...no.childNodes].forEach((c) => {
      if (c.nodeType === 3) {
        const frag = document.createDocumentFragment();
        const pedacos = modo === "letras" ? [...c.textContent] : c.textContent.split(/(\s+)/);
        pedacos.forEach((p) => {
          if (!p) return;
          if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(p)); return; }
          const s = document.createElement("span"); s.className = classe; s.style.display = "inline-block"; s.textContent = p; frag.appendChild(s);
        });
        c.replaceWith(frag);
      } else if (c.nodeType === 1 && !c.classList.contains(classe)) andar(c);
    });
    andar(el); el.dataset.dividido = modo;
    return [...el.querySelectorAll("." + classe)];
  };
  F.palavras = (el) => dividir(el, "palavras");
  F.letras = (el) => dividir(el, "letras");

  // envolve o conteúdo para o efeito "subir": a máscara tem o chão 0,42em abaixo da linha,
  // senão corta o "g", o "y" e o brilho de uma palavra acesa
  const envolver = (el) => {
    if (el.dataset.envolvido) return el.querySelector(":scope > .dentro");
    const d = document.createElement("span"); d.className = "dentro"; d.style.display = "inline-block";
    while (el.firstChild) d.appendChild(el.firstChild);
    el.appendChild(d); el.dataset.envolvido = "1";
    el.style.clipPath = "inset(0 -6% -0.42em -6%)";
    return d;
  };

  /* ------------------------------------------------------------ entradas */
  const ENTRADAS = {
    // cada palavra sai do desfoque, 67 ms entre elas, sem se mover
    palavras: (el, t, tl) => tl.fromTo(F.palavras(el), { opacity: 0, filter: "blur(8px)" }, { opacity: 1, filter: "blur(0px)", duration: 0.45, ease: "power2.out", stagger: 0.067 }, t),
    // as palavras vão de quase apagadas à tinta cheia
    tinta: (el, t, tl) => tl.fromTo(F.palavras(el), { opacity: 0.12 }, { opacity: 1, duration: 0.5, ease: "power1.out", stagger: 0.09 }, t),
    linha: (el, t, tl) => tl.fromTo(el, { opacity: 0, filter: "blur(8px)" }, { opacity: 1, filter: "blur(0px)", duration: 0.5, ease: "power2.out" }, t),
    letras: (el, t, tl) => tl.fromTo(F.letras(el), { opacity: 0, filter: "blur(4px)" }, { opacity: 1, filter: "blur(0px)", duration: 0.3, ease: "power2.out", stagger: 0.034 }, t),
    subir: (el, t, tl) => { const d = envolver(el); tl.fromTo(d, { yPercent: 160 }, { yPercent: 0, duration: 0.7, ease: "expo.out" }, t); },
    escala: (el, t, tl) => tl.fromTo(el, { opacity: 0, scale: 1.18, filter: "blur(10px)" }, { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.55, ease: "expo.out" }, t),
    // revela da esquerda para a direita; as laterais e o chão ficam abertos para não cortar sombra
    apagar: (el, t, tl) => tl.fromTo(el, { clipPath: "inset(-20% 100% -60% -10%)" }, { clipPath: "inset(-20% -10% -60% -10%)", duration: 0.5, ease: "power3.out" }, t),
    digitar: (el, t, tl) => {
      const txt = el.textContent; const c = { n: 0 };
      el.textContent = "";
      tl.to(c, { n: txt.length, duration: Math.max(0.3, txt.length * 0.045), ease: `steps(${Math.max(1, txt.length)})`, onUpdate: () => { el.textContent = txt.slice(0, Math.round(c.n)); } }, t);
    },
    // a palavra rola pelas opções de data-opcoes="a|b|c" e pousa na última
    slot: (el, t, tl) => {
      const ops = String(el.dataset.opcoes || el.textContent).split("|"); const c = { i: 0 };
      tl.to(c, { i: ops.length - 1, duration: 0.18 * ops.length, ease: "power2.out", onUpdate: () => { el.textContent = ops[Math.round(c.i)]; } }, t);
    },
    // conta de data-de até data-ate, para, e dá uma batida de escala. Nada aparece antes de contar
    contar: (el, t, tl) => {
      const de = +(el.dataset.de || 0), ate = +el.dataset.ate, casas = +(el.dataset.casas || 0);
      const pre = el.dataset.prefixo || "", suf = el.dataset.sufixo || ""; const c = { x: de };
      const fmt = (x) => pre + Number(x).toLocaleString("pt-BR", { minimumFractionDigits: casas, maximumFractionDigits: casas }) + suf;
      el.textContent = "";
      tl.to(c, { x: ate, duration: +(el.dataset.duracao || 1.2), ease: "power3.out", onUpdate: () => { el.textContent = fmt(c.x); } }, t);
      tl.fromTo(el, { scale: 1 }, { scale: 1.07, duration: 0.12, ease: "power2.out", yoyo: true, repeat: 1 }, t + +(el.dataset.duracao || 1.2));
    },
    presente: (el, t, tl) => tl.set(el, { opacity: 1 }, t),
  };

  /* --------------------------------------------------------------- saídas */
  const SAIDAS = {
    desfoque: (el, t, tl) => tl.to(el, { opacity: 0, filter: "blur(10px)", duration: 0.28, ease: "power3.in" }, t),
    palavras: (el, t, tl) => tl.to(F.palavras(el), { opacity: 0, filter: "blur(8px)", duration: 0.22, ease: "power3.in", stagger: 0.04 }, t),
    subir: (el, t, tl) => tl.to(el, { opacity: 0, y: "-0.4em", duration: 0.26, ease: "power3.in" }, t),
    descer: (el, t, tl) => tl.to(el, { opacity: 0, y: "0.4em", duration: 0.26, ease: "power3.in" }, t),
    apagar: (el, t, tl) => tl.to(el, { clipPath: "inset(-20% -10% -60% 100%)", duration: 0.3, ease: "power3.in" }, t),
    escala: (el, t, tl) => tl.to(el, { opacity: 0, scale: 0.9, duration: 0.25, ease: "power3.in" }, t),
    corte: (el, t, tl) => tl.set(el, { opacity: 0 }, t),
    fim: () => {}, // só a última linha do cartão final: fica até o fim do filme
  };

  const marcadas = new Set();
  F.linhas = (tl) => {
    document.querySelectorAll(".linha-texto").forEach((el) => {
      if (!el.id) throw new Error("toda .linha-texto precisa de id (para a crítica apontar a linha com problema)");
      const [ke, te] = String(el.dataset.entra || "").split("@");
      const [ks, ts] = String(el.dataset.sai || "").split("@");
      if (!ke || !te) throw new Error(`#${el.id}: falta data-entra="tipo@tempo". Tipos: ${Object.keys(ENTRADAS).join(", ")}`);
      if (!ks) throw new Error(`#${el.id}: falta data-sai="tipo@tempo". Tipos: ${Object.keys(SAIDAS).join(", ")}`);
      if (!ENTRADAS[ke]) throw new Error(`#${el.id}: entrada desconhecida "${ke}". Tipos: ${Object.keys(ENTRADAS).join(", ")}`);
      if (!SAIDAS[ks]) throw new Error(`#${el.id}: saída desconhecida "${ks}". Tipos: ${Object.keys(SAIDAS).join(", ")}`);
      if (ks !== "fim" && !ts) throw new Error(`#${el.id}: a saída "${ks}" precisa de tempo (data-sai="${ks}@B8")`);
      const t0 = F.t(te);
      // escondida até a hora; a entrada decide como aparece
      tl.set(el, { opacity: 0 }, 0);
      tl.set(el, { opacity: 1 }, t0);
      ENTRADAS[ke](el, t0, tl);
      if (ks !== "fim") SAIDAS[ks](el, F.t(ts), tl);
      marcadas.add(el.id);
    });
  };

  /* ----------------------------------------------------------- a câmera */
  /** Empurra a câmera (um .rig) para um ponto: escala e deslocamento com easing nos dois sentidos. */
  F.camera = (tl, el, { t, dur = 0.8, escala = 1.5, x = 0, y = 0, ease = "power2.inOut" }) => {
    tl.to(el, { scale: escala, x, y, duration: dur, ease }, F.t(t));
  };
  /** Chega de longe: de z -900, com desfoque que se resolve. */
  F.voo = (tl, el, t, { de = -900, dur = 0.9, ease = "expo.out" } = {}) => {
    tl.fromTo(el, { z: de, opacity: 0, filter: "blur(14px)" }, { z: 0, opacity: 1, filter: "blur(0px)", duration: dur, ease }, F.t(t));
  };
  /** Mergulho: atravessa a cena atual (escala alta com desfoque) para entrar na próxima. */
  F.mergulho = (tl, el, t, { escala = 3, dur = 0.5 } = {}) => {
    tl.to(el, { scale: escala, filter: "blur(18px)", opacity: 0, duration: dur, ease: "power3.in" }, F.t(t));
  };
  /** Cursor que percorre pontos [{x,y,t,clique}]. */
  F.cursor = (tl, el, pontos) => {
    pontos.forEach((p, i) => {
      const t = F.t(p.t);
      if (i === 0) tl.set(el, { x: p.x, y: p.y, opacity: 1 }, t);
      else tl.to(el, { x: p.x, y: p.y, duration: p.dur || 0.6, ease: "power3.inOut" }, t - (p.dur || 0.6));
      if (p.clique) tl.to(el, { scale: 0.82, duration: 0.07, ease: "power2.out", yoyo: true, repeat: 1 }, t);
    });
  };
  /** Carimbo: cai grande, bate e dá um tranco no mundo. */
  F.carimbo = (tl, el, t, { de = 2.4, rot = -9 } = {}) => {
    const T = F.t(t);
    tl.set(el, { opacity: 1 }, T);
    tl.fromTo(el, { scale: de, rotate: rot * 2 }, { scale: 1, rotate: rot, duration: 0.24, ease: "power4.in" }, T);
  };
  /** Faixa de luz que cruza um painel uma única vez, quando ele pousa. */
  F.brilho = (tl, el, t, dur = 0.8) => {
    const T = F.t(t);
    tl.set(el, { opacity: 1 }, T);
    tl.fromTo(el, { xPercent: -130 }, { xPercent: 130, duration: dur, ease: "power2.inOut" }, T);
    tl.set(el, { opacity: 0 }, T + dur);
  };

  /* ------------------------------------------------------ a seda (fundo) */
  /**
   * Fundo de luz em movimento, desenhado em canvas 2D como função do tempo.
   * opcoes: { cores:[hex,...], base:"#hex", intensidade:0.3, picos:[{t, valor}] }
   */
  F.seda = (canvas, opcoes, tl) => {
    const cx = canvas.getContext("2d");
    canvas.width = F.L; canvas.height = F.A;
    const cores = opcoes.cores || ["#ff5c39", "#6c5ce7"];
    const E = { t: 0, int: opcoes.intensidade ?? 0.3 };
    const rgba = (hex, a) => { const n = parseInt(hex.replace("#", ""), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; };
    const desenhar = () => {
      cx.globalCompositeOperation = "source-over";
      cx.fillStyle = opcoes.base || "#0f1020"; cx.fillRect(0, 0, F.L, F.A);
      cx.globalCompositeOperation = "lighter";
      const grande = Math.max(F.L, F.A);
      for (let i = 0; i < 5; i++) {
        const fase = i * 1.7, w = 0.16 + i * 0.045;
        const x = F.L * (0.5 + 0.42 * Math.sin(E.t * w + fase)), y = F.A * (0.5 + 0.40 * Math.cos(E.t * w * 0.8 + fase * 1.3));
        const r = grande * (0.36 + 0.1 * Math.sin(E.t * 0.3 + i));
        const g = cx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, rgba(cores[i % cores.length], 0.5 * E.int + 0.1));
        g.addColorStop(1, rgba(cores[i % cores.length], 0));
        cx.fillStyle = g; cx.fillRect(0, 0, F.L, F.A);
      }
      // cristas: faixas finas e claras que cruzam o fundo devagar, mais fortes quando a intensidade sobe
      cx.globalCompositeOperation = "screen";
      for (let i = 0; i < 3; i++) {
        const y0 = F.A * (0.2 + 0.3 * i) + Math.sin(E.t * 0.35 + i * 2) * F.A * 0.06;
        const g = cx.createLinearGradient(0, y0 - 60, 0, y0 + 60);
        g.addColorStop(0, "rgba(255,255,255,0)"); g.addColorStop(0.5, `rgba(255,255,255,${0.05 * E.int * 2})`); g.addColorStop(1, "rgba(255,255,255,0)");
        cx.save(); cx.translate(F.L / 2, y0); cx.rotate(-0.25 + 0.1 * Math.sin(E.t * 0.2 + i)); cx.translate(-F.L / 2, -y0);
        cx.fillStyle = g; cx.fillRect(-F.L * 0.2, y0 - 60, F.L * 1.4, 120); cx.restore();
      }
    };
    const dur = +raiz.dataset.duracao;
    tl.to(E, { t: dur, duration: dur, ease: "none", onUpdate: desenhar }, 0);
    (opcoes.picos || []).forEach((p) => tl.to(E, { int: p.valor, duration: p.dur || 0.6, ease: "power2.out", onUpdate: desenhar }, F.t(p.t)));
    desenhar();
  };

  /** Sorteio com semente (mulberry32), para variar posições sempre do mesmo jeito. */
  F.sorteio = (semente) => () => {
    semente = (semente + 0x6d2b79f5) | 0;
    let t = Math.imul(semente ^ (semente >>> 15), 1 | semente);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  F.terminar = (tl) => {
    const faltam = [...document.querySelectorAll(".linha-texto")].filter((e) => !marcadas.has(e.id)).map((e) => "#" + e.id);
    if (faltam.length) throw new Error("linhas sem ligar: " + faltam.join(", ") + ". Chame FILME.linhas(tl) depois de criar todos os elementos.");
    window.__linhas = window.__linhas || {};
    window.__linhas.principal = tl;
  };
})();
