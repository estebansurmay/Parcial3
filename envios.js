// envios.js - v2.0.0 (refactorizado). Calcula el costo de un envio de EnviaYa.
// Orden de la especificacion: validar (R1,R2) -> tarifa base (R3) -> zona (R4)
// -> fin de semana (R5) -> mayor descuento (R6,R7) -> minimo y redondeo (R8).
const { ZonaUrbana, ZonaRural, ZonaNacional } = require("./zonas.js");

const CONFIG = {
  L1: 4,
  L2: 10,
  RECARGO_RURAL: 0.20, // como fraccion, ej. 0.15
  RECARGO_NACIONAL: 0.50,
  DESC_VIP: 0.20,
  RECARGO_FINDE: 2000, // en pesos
};

// Constantes con nombre (antes eran numeros magicos dentro de calc)
const PESO_MAXIMO = 40; // PMAX
const TARIFA_TRAMO_1 = 6000;
const TARIFA_TRAMO_2 = 9000;
const TARIFA_POR_KG_ADICIONAL = 800;
const DIA_MINIMO = 1;
const DIA_MAXIMO = 7;
const DIA_SABADO = 6;
const DIA_DOMINGO = 7;
const DESC_FRECUENTE = 0.05;
const DESC_CUPON_ENVIO10 = 0.10;
const COSTO_MINIMO = 5000;
const MULTIPLO_REDONDEO = 100;
const TOLERANCIA_FLOTANTE = 1e-9; // evita que 8549.9999999 redondee hacia abajo

const ZONAS = new Map([
  ["urbana", new ZonaUrbana()],
  ["rural", new ZonaRural(CONFIG.RECARGO_RURAL)],
  ["nacional", new ZonaNacional(CONFIG.RECARGO_NACIONAL)],
]);
const DESCUENTOS_CLIENTE = new Map([
  ["frecuente", DESC_FRECUENTE],
  ["vip", CONFIG.DESC_VIP],
]);
const DESCUENTOS_CUPON = new Map([["ENVIO10", DESC_CUPON_ENVIO10]]);

function validarPeso(peso) {
  if (peso <= 0 || peso > PESO_MAXIMO) {
    throw new Error("peso inválido");
  }
}

function obtenerEstrategiaZona(zona) {
  const estrategia = ZONAS.get(zona);
  if (!estrategia) {
    throw new Error("zona inválida");
  }
  return estrategia;
}

function validarDia(dia) {
  if (dia < DIA_MINIMO || dia > DIA_MAXIMO) {
    throw new Error("día inválido");
  }
}

function tarifaBase(peso) {
  if (peso <= CONFIG.L1) {
    return TARIFA_TRAMO_1;
  }
  if (peso <= CONFIG.L2) {
    return TARIFA_TRAMO_2;
  }
  return TARIFA_TRAMO_2 + (peso - CONFIG.L2) * TARIFA_POR_KG_ADICIONAL;
}

function esFinDeSemana(dia) {
  return dia === DIA_SABADO || dia === DIA_DOMINGO;
}

function recargoFinDeSemana(dia) {
  return esFinDeSemana(dia) ? CONFIG.RECARGO_FINDE : 0;
}

// R6 y R7: solo el mayor entre descuento de cliente y de cupon; lo desconocido no descuenta.
function mayorDescuento(cliente, cupon) {
  const descuentoCliente = DESCUENTOS_CLIENTE.get(cliente) ?? 0;
  const descuentoCupon = DESCUENTOS_CUPON.get(cupon) ?? 0;
  return Math.max(descuentoCliente, descuentoCupon);
}

function aplicarMinimo(costo) {
  return Math.max(costo, COSTO_MINIMO);
}

// Al multiplo de 100 mas cercano; los 50 redondean hacia arriba (R8).
function redondearACentena(costo) {
  return Math.floor(costo / MULTIPLO_REDONDEO + 0.5 + TOLERANCIA_FLOTANTE) * MULTIPLO_REDONDEO;
}

function calc(peso, zona, cliente, dia, cupon = null) {
  validarPeso(peso);
  const estrategiaZona = obtenerEstrategiaZona(zona);
  validarDia(dia);

  const conZona = estrategiaZona.aplicar(tarifaBase(peso));
  const conFinDeSemana = conZona + recargoFinDeSemana(dia);
  const descuento = mayorDescuento(cliente, cupon);
  const conDescuento = conFinDeSemana - conFinDeSemana * descuento;

  return redondearACentena(aplicarMinimo(conDescuento));
}

module.exports = {
  calc,
  CONFIG,
  validarPeso,
  validarDia,
  tarifaBase,
  esFinDeSemana,
  mayorDescuento,
  aplicarMinimo,
  redondearACentena,
};
