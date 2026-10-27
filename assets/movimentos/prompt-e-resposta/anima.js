const { v, tl, u } = MOV;
MOV.zona("#zona");
document.getElementById("resp-t").textContent = v.resposta;
const pal = MOV.palavras("#resp-t");

tl.from("#entrada", { opacity: 0, y: 60 * u, scale: 0.95, duration: 0.7, ease: "expo.out" }, 0);
const fimDigitar = MOV.digitar("#digitado", v.pedido, 0.7, Math.min(2.0, v.pedido.length * 0.06));
// o cursor pisca em passos finitos e some quando o pedido é enviado
tl.fromTo("#cursor", { opacity: 1 }, { opacity: 0, duration: 0.01, repeat: 8, repeatDelay: 0.24, yoyo: true }, 0.2);
const T = fimDigitar + 0.35;
tl.set("#cursor", { opacity: 0 }, T);
tl.to("#enviar", { scale: 0.82, duration: 0.1, ease: "power2.out", yoyo: true, repeat: 1 }, T);
tl.to("#entrada", { y: -8 * u, duration: 0.3, ease: "power2.out" }, T + 0.1);
tl.set("#resp", { visibility: "visible" }, T + 0.35);
tl.fromTo("#resp", { opacity: 0, y: 40 * u, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "expo.out" }, T + 0.35);
tl.from(pal, { opacity: 0, filter: "blur(5px)", duration: 0.3, ease: "power2.out", stagger: 0.07 }, T + 0.75);
tl.set("#resp", { opacity: 0 }, 0);
tl.set("#resp", { opacity: 1 }, T + 0.35);
MOV.sair("#bloco");
MOV.pronto();
