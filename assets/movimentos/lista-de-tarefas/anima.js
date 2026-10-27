const { v, tl, u } = MOV;
MOV.zona("#zona");
document.getElementById("tit").textContent = v.titulo;
const itens = String(v.itens).split(",").map((s) => s.trim()).filter(Boolean).slice(0, 5);
const box = document.getElementById("itens");
itens.forEach((t) => {
  const d = document.createElement("div");
  d.className = "it";
  d.innerHTML = `<div class="cx"><svg viewBox="0 0 52 52"><rect class="fu" x="0" y="0" width="52" height="52" rx="14"/><path class="vv" d="M14 27 L23 36 L39 17"/></svg></div><span class="nm"><span class="tx"></span><i></i></span>`;
  d.querySelector(".tx").textContent = t;
  box.appendChild(d);
});
const lin = [...box.children];
const cont = document.getElementById("cont");
MOV.trocarTexto(cont, `0 de ${itens.length}`, `0 de ${itens.length}`, 0);
tl.fromTo("#cartao", { opacity: 0, y: 70 * u, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: "expo.out" }, 0);
tl.from(lin, { opacity: 0, x: -36 * u, duration: 0.45, ease: "expo.out", stagger: 0.1 }, 0.35);
lin.forEach((l, i) => {
  const t = 1.2 + i * 0.62;
  tl.to(l.querySelector(".fu"), { opacity: 1, duration: 0.12 }, t);
  tl.to(l.querySelector(".vv"), { strokeDashoffset: 0, duration: 0.25, ease: "power2.out" }, t + 0.05);
  tl.fromTo(l.querySelector(".cx"), { scale: 1 }, { scale: 1.2, duration: 0.12, ease: "power2.out", yoyo: true, repeat: 1 }, t);
  tl.to(l.querySelector(".nm i"), { scaleX: 1, duration: 0.32, ease: "power2.out" }, t + 0.1);
  tl.to(l.querySelector(".tx"), { opacity: 0.5, duration: 0.3 }, t + 0.1);
});
// contador de concluídas: um span por valor, trocado no instante da marcação
const sp = itens.map((_, i) => `<span class="c${i}" style="display:${i === 0 ? "inline" : "none"}">${i} de ${itens.length}</span>`);
sp.push(`<span class="c${itens.length}" style="display:none">${itens.length} de ${itens.length}</span>`);
cont.innerHTML = sp.join("");
for (let i = 1; i <= itens.length; i++) {
  tl.set(cont.querySelector(".c" + (i - 1)), { display: "none" }, 1.2 + (i - 1) * 0.62 + 0.1);
  tl.set(cont.querySelector(".c" + i), { display: "inline" }, 1.2 + (i - 1) * 0.62 + 0.1);
}
MOV.sair("#cartao");
MOV.pronto();
