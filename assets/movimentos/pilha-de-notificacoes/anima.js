const { v, tl, u } = MOV;
MOV.zona("#zona");
const T = String(v.titulos).split("|").map((s) => s.trim()), M = String(v.mensagens).split("|").map((s) => s.trim());
const pilha = document.getElementById("pilha");
const cards = T.slice(0, 3).map((t, i) => {
  const d = document.createElement("div");
  d.className = "nt vidro";
  d.innerHTML = `<div class="ic"></div><div class="tx"><div class="t"><b></b><span></span></div><div class="m"></div></div>`;
  if (v.simbolo) d.querySelector(".ic").appendChild(MOV.imagem(v.simbolo));
  d.querySelector("b").textContent = t; d.querySelector("span").textContent = v.quando; d.querySelector(".m").textContent = M[i] || "";
  pilha.appendChild(d);
  return d;
});
const passo = 190 * u, n = cards.length, ini = [0.3, 1.2, 2.1];
cards.forEach((c, k) => {
  tl.fromTo(c, { y: -150 * u, opacity: 0, scale: 0.96, filter: "blur(8px)" }, { y: 0, opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.6, ease: "expo.out" }, ini[k]);
  // cada notificação que chega depois empurra esta uma casa para baixo e a deixa um pouco mais discreta
  for (let j = k + 1; j < n; j++) tl.to(c, { y: (j - k) * passo, opacity: 1 - (j - k) * 0.18, duration: 0.55, ease: "power3.out" }, ini[j]);
});
MOV.sair("#pilha");
MOV.pronto();
