const { v, tl, u } = MOV;
MOV.zona("#zona");
document.getElementById("chamada").textContent = v.chamada;
const pil = document.getElementById("pilula");
pil.textContent = v.palavra;
MOV.ajustar(pil, MOV.L - MOV.seguro.esq - MOV.seguro.dir - 200 * u);
const fila = document.getElementById("fila");
const nomes = String(v.nomes).split(",").map((s) => s.trim()).filter(Boolean).slice(0, 4);
nomes.forEach((n) => {
  const d = document.createElement("div");
  d.className = "com vidro";
  d.innerHTML = `<div class="ini">${n[0]}</div><div><b>${n}</b><span><em>${v.palavra}</em></span></div>`;
  fila.appendChild(d);
});

tl.from("#chamada", { opacity: 0, y: 24 * u, duration: 0.5, ease: "expo.out" }, 0);
tl.fromTo("#pilula", { scale: 0.4, opacity: 0, rotate: -5 }, { scale: 1, opacity: 1, rotate: 0, duration: 0.7, ease: "back.out(1.8)" }, 0.2);
tl.to("#pilula", { scale: 1.07, duration: 0.14, ease: "power2.out", yoyo: true, repeat: 1 }, 1.0);
// um comentário por vez, cada um chega um pouco depois do anterior e vem de uma posição levemente diferente
nomes.forEach((_, i) => {
  tl.from(fila.children[i], { opacity: 0, x: (i % 2 ? 60 : -60) * u, filter: "blur(8px)", duration: 0.55, ease: "expo.out" }, 1.2 + i * 0.34);
});
MOV.sair("#bloco");
MOV.pronto();
