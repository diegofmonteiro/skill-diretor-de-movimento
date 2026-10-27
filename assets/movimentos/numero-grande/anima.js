const { v, tl, u } = MOV;
MOV.zona("#zona");
const num = document.getElementById("num");
const fmt = (x) => v.prefixo + MOV.numero(x, +v.casas) + v.sufixo;
document.getElementById("rot").textContent = v.rotulo;
num.textContent = fmt(v.valor);
// o painel tem a largura do número final, para o contador não empurrar nada enquanto sobe
MOV.ajustar(num, MOV.L - MOV.seguro.esq - MOV.seguro.dir - 156 * u);
const tam = parseFloat(getComputedStyle(num).fontSize);
num.style.fontSize = tam + "px";
num.style.minWidth = num.getBoundingClientRect().width + "px";
num.textContent = "";

tl.fromTo("#painel", { opacity: 0, y: 70 * u, scale: 0.92, rotateX: 14 }, { opacity: 1, y: 0, scale: 1, rotateX: 0, duration: 0.7, ease: "expo.out" }, 0);

// o contador só mostra algo quando começa a contar; para antes do fim e carimba
MOV.contar(num, +v.inicio, +v.valor, 0.35, 1.5, fmt);
tl.to("#barra", { scaleX: 1, duration: 1.5, ease: "power3.out" }, 0.35);
tl.fromTo(num, { scale: 1 }, { scale: 1.06, duration: 0.12, ease: "power2.out", yoyo: true, repeat: 1 }, 1.85);
tl.set("#brilho", { opacity: 1 }, 1.9);
tl.fromTo("#brilho", { xPercent: -120 }, { xPercent: 120, duration: 0.8, ease: "power2.inOut" }, 1.9);
tl.from("#rot", { opacity: 0, y: 14 * u, duration: 0.5, ease: "expo.out" }, 0.55);

// saída limpa nos últimos 0,4 s, acelerando
tl.to("#painel", { opacity: 0, y: -40 * u, scale: 0.96, duration: 0.38, ease: "power3.in" }, 3.02);
tl.set("#painel", { opacity: 0 }, 3.4);
MOV.pronto();
