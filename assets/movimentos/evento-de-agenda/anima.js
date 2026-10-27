const { v, tl, u } = MOV;
MOV.zona("#zona");
document.getElementById("mes").textContent = v.mes;
document.getElementById("dia").textContent = v.dia;
document.getElementById("evt").textContent = v.titulo;
document.getElementById("hr-t").textContent = v.hora;

tl.fromTo("#cartao", { opacity: 0, y: 70 * u, scale: 0.94 }, { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: "expo.out" }, 0);
tl.fromTo("#data", { rotateX: -80, opacity: 0 }, { rotateX: 0, opacity: 1, duration: 0.7, ease: "back.out(1.5)" }, 0.15);
tl.from("#evt", { opacity: 0, x: 40 * u, duration: 0.55, ease: "expo.out" }, 0.55);
tl.from("#hr", { opacity: 0, x: 40 * u, duration: 0.55, ease: "expo.out" }, 0.75);
tl.set("#sino", { opacity: 1 }, 1.6);
tl.fromTo("#sino", { rotation: 0 }, { rotation: 0, keyframes: [{ rotation: 22, duration: 0.09 }, { rotation: -18, duration: 0.12 }, { rotation: 12, duration: 0.12 }, { rotation: -6, duration: 0.12 }, { rotation: 0, duration: 0.12 }] }, 1.6);
MOV.sair("#cartao");
MOV.pronto();
