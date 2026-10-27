const { v, tl, u } = MOV;
MOV.zona("#zona");
document.getElementById("rot").textContent = v.rotulo;
const ys = String(v.pontos).split(",").map((s) => parseFloat(s.trim())).filter((x) => !isNaN(x));
const n = ys.length, mn = Math.min(...ys), mx = Math.max(...ys);
const X = (i) => 20 + (i / (n - 1)) * 760;
const Y = (y) => 330 - ((y - mn) / (mx - mn || 1)) * 290;
// curva suave (Catmull-Rom convertida em Bézier) pelos pontos reais
let d = `M${X(0)},${Y(ys[0])}`;
for (let i = 0; i < n - 1; i++) {
  const p0 = [X(i - 1 < 0 ? 0 : i - 1), Y(ys[i - 1 < 0 ? 0 : i - 1])], p1 = [X(i), Y(ys[i])], p2 = [X(i + 1), Y(ys[i + 1])], p3 = [X(i + 2 > n - 1 ? n - 1 : i + 2), Y(ys[i + 2 > n - 1 ? n - 1 : i + 2])];
  d += ` C${p1[0] + (p2[0] - p0[0]) / 6},${p1[1] + (p2[1] - p0[1]) / 6} ${p2[0] - (p3[0] - p1[0]) / 6},${p2[1] - (p3[1] - p1[1]) / 6} ${p2[0]},${p2[1]}`;
}
document.getElementById("linha-g").setAttribute("d", d);
document.getElementById("area").setAttribute("d", d + ` L${X(n - 1)},360 L${X(0)},360 Z`);
const ponta = document.getElementById("ponta");
const cur = { p: 0 };
tl.fromTo("#painel", { opacity: 0, y: 70 * u, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: "expo.out" }, 0);
// a revelação e o número andam juntos: o valor mostrado é o do ponto onde a linha está
tl.to(cur, { p: 1, duration: 2.4, ease: "power2.inOut", onUpdate: () => {
  document.getElementById("rev-r").setAttribute("width", 800 * cur.p + 20);
  const f = cur.p * (n - 1), i = Math.min(n - 2, Math.floor(f)), k = f - i;
  const yv = ys[i] + (ys[i + 1] - ys[i]) * k;
  document.getElementById("num").textContent = MOV.numero(Math.round(yv)) + v.unidade;
  ponta.setAttribute("cx", X(f)); ponta.setAttribute("cy", Y(yv));
  ponta.setAttribute("opacity", cur.p > 0.01 ? 1 : 0);
} }, 0.6);
tl.fromTo("#num", { scale: 1 }, { scale: 1.06, duration: 0.13, ease: "power2.out", yoyo: true, repeat: 1, transformOrigin: "0 50%" }, 3.05);
MOV.sair("#painel");
MOV.pronto();
