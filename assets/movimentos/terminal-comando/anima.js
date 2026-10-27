const { v, tl, u } = MOV;
MOV.zona("#zona");
const saida = document.getElementById("saida");
const linhas = String(v.saida).split("|").map((s) => s.trim()).filter(Boolean);
linhas.forEach((l) => { const d = document.createElement("div"); d.textContent = "  " + l; saida.appendChild(d); });
if (v.resultado) { const d = document.createElement("div"); d.className = "ok-l"; d.textContent = "  ok  " + v.resultado; saida.appendChild(d); }

tl.fromTo("#janela", { opacity: 0, y: 70 * u, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: "expo.out" }, 0);
const fim = MOV.digitar("#cmd", v.comando, 0.7, Math.min(1.5, v.comando.length * 0.07));
tl.fromTo("#cur", { opacity: 0.85 }, { opacity: 0, duration: 0.01, repeat: 10, repeatDelay: 0.22, yoyo: true }, 0.2);
const filhos = [...saida.children];
tl.set(filhos, { opacity: 0 }, 0);
filhos.forEach((d, i) => { tl.set(d, { opacity: 1 }, fim + 0.35 + i * 0.4); });
tl.fromTo(filhos[filhos.length - 1], { x: -14 * u }, { x: 0, duration: 0.4, ease: "expo.out" }, fim + 0.35 + (filhos.length - 1) * 0.4);
MOV.sair("#janela");
MOV.pronto();
