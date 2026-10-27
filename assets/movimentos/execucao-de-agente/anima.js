const { v, tl, u } = MOV;
MOV.zona("#zona");
document.getElementById("tit").textContent = v.titulo;
const passos = String(v.passos).split(",").map((s) => s.trim()).filter(Boolean).slice(0, 5);
const lista = document.getElementById("lista");
passos.forEach((p) => {
  const d = document.createElement("div");
  d.className = "passo";
  d.innerHTML = `<div class="estado"><svg viewBox="0 0 50 50"><circle class="anel" cx="25" cy="25" r="20"/><circle class="gira" cx="25" cy="25" r="20" pathLength="100"/><circle class="ok-c" cx="25" cy="25" r="22"/><path class="ok-v" d="M15 26 L22 33 L35 18"/></svg></div><span class="nome"></span>`;
  d.querySelector(".nome").textContent = p;
  lista.appendChild(d);
});
const linhas = [...lista.children];

tl.fromTo("#painel", { opacity: 0, y: 70 * u, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: "expo.out" }, 0);
tl.fromTo("#pulso", { scale: 1, opacity: 1 }, { scale: 1.7, opacity: 0.4, duration: 0.9, ease: "power1.inOut", yoyo: true, repeat: 3 }, 0.3);
linhas.forEach((l, i) => {
  const ini = 0.7 + i * 0.85, fim = ini + 0.75;
  tl.from(l, { opacity: 0, x: -40 * u, duration: 0.5, ease: "expo.out" }, 0.3 + i * 0.12);
  tl.to(l, { opacity: 0.45, duration: 0.01 }, 0.3 + i * 0.12 + 0.5);
  tl.to(l, { opacity: 1, duration: 0.2 }, ini);
  tl.set(l.querySelector(".gira"), { opacity: 1 }, ini);
  tl.fromTo(l.querySelector(".gira"), { rotation: 0 }, { rotation: 540, duration: fim - ini, ease: "none" }, ini);
  tl.set(l.querySelector(".gira"), { opacity: 0 }, fim);
  tl.set([l.querySelector(".ok-c"), l.querySelector(".ok-v")], { opacity: 1 }, fim);
  tl.fromTo(l.querySelector(".ok-c"), { scale: 0.3 }, { scale: 1, duration: 0.4, ease: "back.out(2.4)" }, fim);
  tl.to(l, { opacity: 0.8, duration: 0.3 }, fim + 0.25);
});
tl.to("#barra", { scaleX: 1, duration: passos.length * 0.85, ease: "none" }, 0.7);
MOV.sair("#painel");
MOV.pronto();
