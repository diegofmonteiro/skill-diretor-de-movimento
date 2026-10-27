const { v, tl, u } = MOV;
MOV.zona("#zona");
document.getElementById("tit-r").textContent = v.titulo_recibo;
document.getElementById("sub-r").textContent = v.nomeMarca + (v.dominio ? " · " + v.dominio : "");
document.getElementById("carimbo").textContent = v.carimbo;
const it = String(v.itens).split("|").map((s) => s.trim()), vl = String(v.valores).split("|").map((s) => s.trim());
const box = document.getElementById("itens-r");
it.forEach((t, i) => { const d = document.createElement("div"); d.className = "ir"; d.innerHTML = `<span class="a"></span><span class="d"></span><b class="b"></b>`; d.querySelector(".a").textContent = t; d.querySelector(".b").textContent = vl[i] || ""; box.appendChild(d); });
const linhas = [...box.children];

tl.fromTo("#folha", { opacity: 0, y: -90 * u, rotateX: -22, rotate: -2 }, { opacity: 1, y: 0, rotateX: 0, rotate: 0, duration: 0.8, ease: "expo.out" }, 0);
tl.from(["#tit-r", "#sub-r"], { opacity: 0, duration: 0.4, stagger: 0.1 }, 0.4);
linhas.forEach((l, i) => tl.from(l, { opacity: 0, x: -24 * u, duration: 0.4, ease: "expo.out" }, 0.9 + i * 0.35));
const T = 0.9 + linhas.length * 0.35 + 0.5;
tl.set("#carimbo", { opacity: 0.92 }, T);
tl.fromTo("#carimbo", { scale: 2.6, rotate: -22 }, { scale: 1, rotate: -11, duration: 0.24, ease: "power4.in" }, T);
tl.fromTo("#folha", { y: 0 }, { y: 7 * u, duration: 0.06, ease: "power2.out", yoyo: true, repeat: 1 }, T + 0.22);
MOV.sair("#folha");
MOV.pronto();
