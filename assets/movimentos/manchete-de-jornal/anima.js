const { v, tl, u } = MOV;
MOV.zona("#zona");
document.getElementById("mast").textContent = v.veiculo;
document.getElementById("dt").textContent = v.data_texto;
const mc = document.getElementById("mc");
tl.fromTo("#recorte", { opacity: 0, y: 80 * u, rotate: 3, scale: 0.95 }, { opacity: 1, y: 0, rotate: -1.2, scale: 1, duration: 0.8, ease: "expo.out" }, 0);
tl.from("#col i", { scaleX: 0, transformOrigin: "0 50%", duration: 0.5, ease: "power2.out", stagger: 0.08 }, 0.9);
const fim = MOV.digitar(mc, v.texto_manchete, 0.5, Math.min(1.6, v.texto_manchete.length * 0.04));
// terminada a digitação, a manchete é refeita com o trecho marcado e o marca-texto corre
const pos = v.texto_manchete.indexOf(v.marcar);
if (v.marcar && pos >= 0) {
  const html = (t) => t.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
  const final = document.getElementById("mc2");
  final.innerHTML = html(v.texto_manchete.slice(0, pos)) + "<mark>" + html(v.marcar) + "</mark>" + html(v.texto_manchete.slice(pos + v.marcar.length));
  tl.set("#mc", { opacity: 0 }, fim + 0.02);
  tl.set(final, { opacity: 1 }, fim + 0.02);
  tl.to(final.querySelector("mark"), { backgroundSize: "100% 100%", duration: 0.6, ease: "power2.inOut" }, fim + 0.3);
}
MOV.sair("#recorte");
MOV.pronto();
