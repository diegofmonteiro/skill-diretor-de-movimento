const { v, tl, u } = MOV;
MOV.zona("#zona");
const tela = (v.telas || [])[Math.max(0, (+v.tela || 1) - 1)];
if (!tela) throw new Error("destaque-na-tela precisa de uma captura real da marca (marca.json > telas). Não desenhe uma tela de mentira.");
document.getElementById("img").style.backgroundImage = `url("${tela}")`;
document.getElementById("rot").textContent = v.rotulo;
const vista = document.getElementById("vista").getBoundingClientRect();
const jan = document.getElementById("jan").getBoundingClientRect();
const fx = +v.foco_x, fy = +v.foco_y, rx = +v.raio, ry = +v.raio * (vista.width / vista.height);
const an = document.getElementById("anel");
an.setAttribute("cx", fx); an.setAttribute("cy", fy); an.setAttribute("rx", rx); an.setAttribute("ry", ry);
const ZOOM = 1.8;
document.getElementById("zoom").style.transformOrigin = `${fx}% ${fy}%`;
// o ponto de foco é o ponto fixo da ampliação: o rótulo pode ser posto ao lado dele em coordenadas da janela
const px = (fx / 100) * vista.width, py = (fy / 100) * vista.height + (vista.top - jan.top);
const rot = document.getElementById("rot");
const rpx = rx * 0.01 * vista.width * ZOOM;
if (fx > 55) rot.style.right = Math.max(jan.width - px + rpx + 24 * u, 24 * u) + "px";
else rot.style.left = px + rpx + 24 * u + "px";
rot.style.top = Math.min(Math.max(py - 28 * u, 90 * u), jan.height - 120 * u) + "px";

tl.fromTo("#jan", { opacity: 0, y: 70 * u, scale: 0.94 }, { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: "expo.out" }, 0);
tl.fromTo(an, { opacity: 0, scale: 2.2, svgOrigin: `${fx} ${fy}` }, { opacity: 1, scale: 1, svgOrigin: `${fx} ${fy}`, duration: 0.6, ease: "expo.out" }, 1.1);
tl.to("#zoom", { scale: ZOOM, duration: 0.9, ease: "power3.inOut" }, 2.0);
tl.set(rot, { opacity: 1 }, 2.7);
tl.from(rot, { scale: 0.6, x: -30 * u, duration: 0.5, ease: "back.out(2)" }, 2.7);
tl.to("#jan", { opacity: 0, y: -36 * u, duration: 0.38, ease: "power3.in" }, MOV.D - 0.38);
MOV.pronto();
