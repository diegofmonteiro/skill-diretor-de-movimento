const { v, tl, u } = MOV;
MOV.zona("#zona");
document.getElementById("ct").textContent = v.titulo; document.getElementById("cx").textContent = v.texto;
document.getElementById("b1").textContent = v.botao_principal; document.getElementById("b2").textContent = v.botao_secundario;
document.getElementById("ft").textContent = v.feito;
const r = document.getElementById("raiz").getBoundingClientRect();
const b = document.getElementById("b1").getBoundingClientRect();
const alvoX = b.left - r.left + b.width * 0.55, alvoY = b.top - r.top + b.height * 0.5;
const ptr = document.getElementById("mouse");
// o cursor parte de um canto e termina exatamente sobre o botão medido na página
const ox = MOV.L * 0.78, oy = MOV.A * 0.78;

tl.fromTo("#caixa", { opacity: 0, scale: 0.88, y: 30 * u }, { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: "back.out(1.5)" }, 0);
tl.set(ptr, { opacity: 1, x: ox, y: oy }, 0.7);
tl.to(ptr, { x: alvoX, y: alvoY, duration: 1.1, ease: "power3.inOut" }, 0.8);
const T = 2.0;
tl.to(ptr, { scale: 0.86, duration: 0.08, ease: "power2.out", yoyo: true, repeat: 1 }, T);
tl.to("#b1", { scale: 0.94, duration: 0.08, ease: "power2.out", yoyo: true, repeat: 1 }, T);
tl.to("#feito", { opacity: 1, duration: 0.3, ease: "power2.out" }, T + 0.2);
tl.from("#feito svg", { scale: 0.3, duration: 0.5, ease: "back.out(2.4)" }, T + 0.2);
tl.to(ptr, { opacity: 0, duration: 0.25 }, T + 0.3);
MOV.sair("#caixa");
MOV.pronto();
