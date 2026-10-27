const { v, tl, u } = MOV;
MOV.zona("#zona");
const q = (s) => document.querySelector(s);
q("#a .r").textContent = v.rotulo_antes; q("#a .f").textContent = v.texto_antes;
q("#d .r").textContent = v.rotulo_depois; q("#d .f").textContent = v.texto_depois;
const L = document.getElementById("duplo").getBoundingClientRect().width;

tl.fromTo("#duplo", { opacity: 0, y: 60 * u, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: "expo.out" }, 0);
tl.from("#a .f", { opacity: 0, x: -30 * u, duration: 0.6, ease: "expo.out" }, 0.4);
// o divisor e o recorte andam na mesma conta: a borda direita do depois é a posição do divisor
const c = { p: 0 };
tl.to(c, { p: 1, duration: 1.1, ease: "power3.inOut", onUpdate: () => {
  q("#d").style.clipPath = `inset(0 ${(1 - c.p) * 100}% 0 0)`;
  q("#div").style.left = c.p * L + "px";
} }, 1.5);
tl.set("#div", { opacity: 0 }, 2.7);
tl.from("#d .f", { x: -40 * u, duration: 0.7, ease: "expo.out" }, 1.55);
MOV.sair("#duplo");
MOV.pronto();
