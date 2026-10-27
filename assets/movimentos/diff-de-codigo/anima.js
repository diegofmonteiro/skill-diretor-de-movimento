const { v, tl, u } = MOV;
MOV.zona("#zona");
document.getElementById("arq").textContent = v.arquivo;
const lista = (s) => String(s).split("|").map((x) => x.trim()).filter(Boolean);
const box = document.getElementById("linhas");
const mk = (cls, sinal, txt) => { const d = document.createElement("div"); d.className = "l " + cls; d.innerHTML = `<span class="s">${sinal}</span><span class="t"></span>`; d.querySelector(".t").textContent = txt; box.appendChild(d); return d; };
const rem = lista(v.removidas).map((t) => mk("rem", "-", t));
const add = lista(v.adicionadas).map((t) => mk("add", "+", t));

tl.fromTo("#janela", { opacity: 0, y: 70 * u, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: "expo.out" }, 0);
rem.forEach((d, i) => tl.from(d, { opacity: 0, x: -30 * u, duration: 0.4, ease: "expo.out" }, 0.5 + i * 0.12));
// as linhas novas só existem depois de a antiga ser riscada: a ordem conta a história
const tAdd = 0.5 + rem.length * 0.12 + 0.9;
rem.forEach((d, i) => tl.to(d, { opacity: 0.4, duration: 0.3 }, tAdd - 0.1 + i * 0.05));
add.forEach((d, i) => {
  tl.set(d, { opacity: 0 }, 0);
  tl.fromTo(d, { opacity: 0, x: 40 * u }, { opacity: 1, x: 0, duration: 0.45, ease: "expo.out" }, tAdd + i * 0.2);
});
MOV.sair("#janela");
MOV.pronto();
