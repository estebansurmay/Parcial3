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
  }
  // fin de semana
  if (d > 6) {
    t = t + CONFIG["RECARGO_FINDE"];
  }
  if (c === "frecuente") {
    t = t - t * 0.05;
  }
  if (c === "vip") {
    t = t - t * CONFIG["DESC_VIP"];
  }
  if (cup != null) {
    if (cup === "ENVIO10") {
      t = t - t * 0.10;
    }
  }
  if (t < 5000) {
    t = 5000;
  }
  if (flag) {
    console.log("costo:", t);
  }
  return Math.trunc(t / 100) * 100; // equivale a int(t / 100) * 100 de Python
}

module.exports = { calc, CONFIG };
