const { v, tl, u } = MOV;
MOV.zona("#zona");
const rot = String(v.rotulos).split(",").map((s) => s.trim()).filter(Boolean).slice(0, 5);
const val = String(v.valores).split(",").map((s) => parseFloat(s.trim().replace(",", "."))).slice(0, rot.length);
const grade = document.getElementById("grade");
const H = 128 * u;
grade.style.height = rot.length * H + "px";
const max = Math.max(...val);
const ordem = val.map((x, i) => [x, i]).sort((a, b) => b[0] - a[0]).map((p) => p[1]);
const linhas = rot.map((r, i) => {
  const d = document.createElement("div");
  d.className = "lh" + (i === (+v.destaque_item) - 1 ? " dest" : "");
  d.innerHTML = `<div class="nm"></div><div class="tr"><div class="br"></div><div class="vl"></div></div>`;
  d.querySelector(".nm").textContent = r;
  d.style.top = i * H + "px";
  grade.appendChild(d);
  return d;
});
linhas.forEach((d, i) => {
  tl.from(d, { opacity: 0, x: -50 * u, duration: 0.5, ease: "expo.out" }, 0.1 + i * 0.1);
  tl.to(d.querySelector(".br"), { scaleX: val[i] / max, duration: 1.9, ease: "power3.out" }, 0.6);
  MOV.contar(d.querySelector(".vl"), 0, val[i], 0.6, 1.9, (x) => MOV.numero(x, val[i] % 1 ? 1 : 0) + v.unidade);
});
// reordenação: cada linha desliza até a posição do seu valor
linhas.forEach((d, i) => { const r = ordem.indexOf(i); if (r !== i) tl.to(d, { y: (r - i) * H, duration: 0.75, ease: "power3.inOut" }, 2.9); });
const lider = linhas[ordem[0]];
tl.fromTo(lider.querySelector(".vl"), { scale: 1 }, { scale: 1.15, duration: 0.15, ease: "power2.out", yoyo: true, repeat: 1, transformOrigin: "100% 50%" }, 3.7);
MOV.sair("#grade");
MOV.pronto();
