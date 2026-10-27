const { v, tl, u } = MOV;
MOV.zona("#zona");
const av = document.getElementById("av");
if (v.simbolo) av.appendChild(MOV.imagem(v.simbolo));
document.getElementById("nome").textContent = v.nomeMarca;
document.getElementById("usu").textContent = v.usuario || v.dominio;
document.getElementById("texto").textContent = v.texto;
document.getElementById("coment").textContent = MOV.numero(v.comentarios) + " comentários";
const curt = document.getElementById("curt");

tl.fromTo("#cartao", { opacity: 0, y: 80 * u, rotateX: 16, scale: 0.94 }, { opacity: 1, y: 0, rotateX: 0, scale: 1, duration: 0.75, ease: "expo.out" }, 0);
const pal = MOV.palavras("#texto");
tl.from(pal, { opacity: 0, filter: "blur(6px)", duration: 0.4, ease: "power2.out", stagger: 0.06 }, 0.4);

// o toque no coração é o momento que vale: mola no traço, estouro de partículas e +1
const T = 1.7;
tl.to("#cor-p", { fill: "var(--destaque)", stroke: "var(--destaque)", duration: 0.12 }, T);
tl.fromTo("#cor", { scale: 1 }, { scale: 1.45, duration: 0.16, ease: "power2.out" }, T);
tl.to("#cor", { scale: 1, duration: 0.5, ease: "back.out(2.4)" }, T + 0.16);
const rnd = MOV.sorteio(7);
const fx = document.getElementById("fx");
for (let i = 0; i < 9; i++) {
  const p = document.createElement("i"); fx.appendChild(p);
  const ang = (i / 9) * Math.PI * 2 + rnd() * 0.5, dist = (70 + rnd() * 50) * u;
  tl.fromTo(p, { x: 0, y: 0, opacity: 1, scale: 1 }, { x: Math.cos(ang) * dist, y: Math.sin(ang) * dist, opacity: 0, scale: 0.2, duration: 0.6, ease: "power3.out" }, T);
}
MOV.trocarTexto(curt, MOV.numero(v.curtidas - 1), MOV.numero(v.curtidas), T);
tl.fromTo(curt, { y: 12 * u, opacity: 0.2 }, { y: 0, opacity: 1, duration: 0.35, ease: "expo.out" }, T);

MOV.sair("#cartao");
MOV.pronto();
