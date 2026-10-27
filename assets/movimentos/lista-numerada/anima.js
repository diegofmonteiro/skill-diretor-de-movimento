const { v, tl, u } = MOV;
const T = String(v.titulos).split(",").map((s) => s.trim()).filter(Boolean).slice(0, 4);
const Dd = String(v.detalhes).split("|").map((s) => s.trim());
const box = document.getElementById("pontos");
const fatia = (MOV.D - 0.3) / T.length;
T.forEach((t, i) => {
  const d = document.createElement("section");
  d.className = "pt";
  d.innerHTML = `<div class="n">${i + 1}</div><div class="bloco"><div class="t"></div><div class="d"></div></div>`;
  d.querySelector(".t").textContent = t; d.querySelector(".d").textContent = Dd[i] || "";
  box.appendChild(d);
  const ini = i * fatia, fim = (i + 1) * fatia;
  MOV.ajustar(d.querySelector(".t"), MOV.L - (MOV.retrato ? 160 : 760) * u);
  tl.set(d, { opacity: 0 }, 0);
  tl.set(d, { opacity: 1 }, ini);
  tl.from(d.querySelector(".n"), { scale: 1.5, opacity: 0, x: -80 * u, duration: 0.5, ease: "expo.out" }, ini);
  tl.from(d.querySelector(".t"), { opacity: 0, y: 50 * u, duration: 0.5, ease: "expo.out" }, ini + 0.12);
  tl.from(d.querySelector(".d"), { opacity: 0, y: 30 * u, duration: 0.5, ease: "expo.out" }, ini + 0.3);
  // corte seco no fim do ponto: o próximo já começa no mesmo instante
  if (i < T.length - 1) tl.set(d, { opacity: 0 }, fim);
});
tl.to(box, { opacity: 0, duration: 0.3, ease: "power3.in" }, MOV.D - 0.3);
MOV.pronto();
