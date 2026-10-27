const { v, tl, u } = MOV;
MOV.zona("#zona");
const lista = (s) => String(s).split("|").map((x) => x.trim());
const pl = lista(v.planos), pr = lista(v.precos), ln = lista(v.linhas), d = (+v.destaque_plano || 2) - 1;
const trio = document.getElementById("trio");
pl.slice(0, 3).forEach((n, i) => {
  const c = document.createElement("div");
  c.className = "pl vidro" + (i === d ? " dest" : "");
  c.innerHTML = `<div class="nm"></div><div class="pr"><span class="vl"></span><small></small></div><div class="ln"></div>${i === d ? '<div class="selo"></div>' : ""}`;
  c.querySelector(".nm").textContent = n;
  c.querySelector(".vl").textContent = pr[i] || "";
  c.querySelector("small").textContent = v.periodo;
  c.querySelector(".ln").textContent = ln[i] || "";
  if (i === d) c.querySelector(".selo").textContent = v.selo;
  trio.appendChild(c);
});
const cards = [...trio.children];
const vert = MOV.retrato;
cards.forEach((c, i) => tl.from(c, { opacity: 0, [vert ? "y" : "x"]: (i - 1) * 90 * u, scale: 0.92, filter: "blur(8px)", duration: 0.7, ease: "expo.out" }, 0.1 + i * 0.12));
const T = 1.7;
cards.forEach((c, i) => {
  if (i === d) {
    tl.to(c, { scale: 1.04, y: vert ? 0 : -18 * u, duration: 0.55, ease: "back.out(1.6)" }, T);
    tl.to(c.querySelector(".selo"), { opacity: 1, duration: 0.2 }, T + 0.15);
    tl.from(c.querySelector(".selo"), { scale: 0.5, duration: 0.45, ease: "back.out(2.2)" }, T + 0.15);
  } else tl.to(c, { opacity: 0.5, scale: 0.96, duration: 0.5, ease: "power2.out" }, T);
});
MOV.sair("#trio");
MOV.pronto();
