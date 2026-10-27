const { v, tl, u } = MOV;
MOV.zona("#zona", v.posicao || (MOV.alfa ? "base" : "centro"));
const el = document.getElementById("frase");
el.textContent = v.frase;
const marcar = String(v.destaque_palavras).toLowerCase().split(",").map((s) => s.trim()).filter(Boolean);
const pal = MOV.palavras(el);
pal.forEach((p) => { if (marcar.includes(p.textContent.toLowerCase().replace(/[.,!?;:]/g, ""))) p.classList.add("destaque"); });

pal.forEach((p, i) => {
  const t = 0.15 + i * v.ritmo;
  tl.fromTo(p, { opacity: 0, y: 34 * u, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.42, ease: "expo.out" }, t);
  if (p.classList.contains("destaque")) {
    tl.fromTo(p, { scale: 1 }, { scale: 1.14, duration: 0.14, ease: "power2.out", yoyo: true, repeat: 1 }, t + 0.18);
  }
});
MOV.sair("#frase");
MOV.pronto();
