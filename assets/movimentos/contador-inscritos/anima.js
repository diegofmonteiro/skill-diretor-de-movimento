const { v, tl, u } = MOV;
MOV.zona("#zona");
document.getElementById("rot").textContent = v.rotulo;
document.getElementById("selo").textContent = v.selo;
const num = document.getElementById("num");
num.textContent = MOV.numero(v.valor);
MOV.ajustar(num, 500 * u);
num.style.minWidth = num.getBoundingClientRect().width + "px";
num.textContent = "";
const fim = Math.min(1, v.valor / v.meta);

tl.fromTo("#anel-caixa", { opacity: 0, scale: 0.86 }, { opacity: 1, scale: 1, duration: 0.6, ease: "expo.out" }, 0);
tl.to("#arco", { strokeDashoffset: 540.35 * (1 - fim), duration: 1.9, ease: "power3.inOut" }, 0.3);
MOV.contar(num, 0, v.valor, 0.3, 1.9, (x) => MOV.numero(Math.round(x)), "power3.inOut");
tl.from("#rot", { opacity: 0, y: 14 * u, duration: 0.5, ease: "expo.out" }, 0.6);
if (v.selo) {
  tl.fromTo("#selo", { opacity: 0, scale: 0.5, y: 20 * u }, { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: "back.out(2)" }, 2.25);
  tl.fromTo(num, { scale: 1 }, { scale: 1.05, duration: 0.13, ease: "power2.out", yoyo: true, repeat: 1 }, 2.2);
}
MOV.sair("#bloco");
MOV.pronto();
