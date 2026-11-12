// envios.js  (traduccion fiel de envios.py v1.0.0 - codigo heredado)
// La logica, incluidos los defectos, se conserva sin cambios.
const CONFIG = {
  L1: 4,
  L2: 10,
  RECARGO_RURAL: 0.20, // como fraccion, ej. 0.15
  RECARGO_NACIONAL: 0.50,
  DESC_VIP: 0.20,
  RECARGO_FINDE: 2000, // en pesos
};

function calc(p, z, c, d, cup = null, flag = false) {
  if (p <= 0 || p > 40) {
    throw new Error("peso inválido");
  }
  if (d < 1 || d > 7) {
    throw new Error("día inválido");
  }
  let t;
  if (p <= CONFIG["L1"]) {
    t = 6000;
  } else if (p <= CONFIG["L2"]) {
    t = 9000;
  } else {
    t = 9000 + (p - CONFIG["L2"]) * 800;
  }
  if (z === "urbana") {
    t = t;
  } else if (z === "rural") {
    t = t + t * CONFIG["RECARGO_RURAL"];
  } else if (z === "nacional") {
    t = t + t * CONFIG["RECARGO_NACIONAL"];
  } else {
    throw new Error("zona inválida");
  }
  // fin de semana
  if (d === 6 || d === 7) {
    t = t + CONFIG["RECARGO_FINDE"];
  }
  // solo el mayor descuento entre cliente y cupon (R6)
  let desc = 0;
  if (c === "frecuente") {
    desc = 0.05;
  }
  if (c === "vip") {
    desc = CONFIG["DESC_VIP"];
  }
  if (cup === "ENVIO10" && 0.10 > desc) {
    desc = 0.10;
  }
  t = t - t * desc;
  if (t < 5000) {
    t = 5000;
  }
  if (flag) {
    console.log("costo:", t);
  }
  return Math.trunc(t / 100) * 100; // equivale a int(t / 100) * 100 de Python
}

module.exports = { calc, CONFIG };
