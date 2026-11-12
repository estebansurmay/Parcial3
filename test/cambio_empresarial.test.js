// Solicitud de cambio CAMBIO = 1 (Parte 8), pruebas escritas ANTES del código:
//  R9  cliente "empresarial" con 12 % de descuento.
//  R10 si el peso es mayor que L2, el cliente empresarial no paga recargo de zona.
// Los resultados esperados están calculados a mano a partir de la solicitud (ver cambio_empresarial.json).
const { calc, CONFIG, mayorDescuento, exentoDeRecargoDeZona } = require("../envios.js");
const casos = require("./cambio_empresarial.json").casos;

const pesos = (n) => "$" + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
const titulo = (c) => {
  const e = c.entradas;
  return `${c.id} [${c.criterio}; ${c.requisitos.join(",")}] p=${e.peso} ${e.zona} ${e.cliente} d${e.dia} ${e.cupon ?? "sin cupón"} → ${c.esperado === null ? "error" : pesos(c.esperado)}`;
};

describe("Cambio 1: cliente empresarial (casos CE-01 a CE-18)", () => {
  test.each(casos.map((c) => [titulo(c), c]))("%s", (_t, c) => {
    const e = c.entradas;
    const f = () => calc(e.peso, e.zona, e.cliente, e.dia, e.cupon);
    if (c.esperado === null) expect(f).toThrow();
    else expect(f()).toBe(c.esperado);
  });
});

describe("Cambio 1: piezas nuevas", () => {
  test("R9: el descuento empresarial es 12 %", () => {
    expect(mayorDescuento("empresarial", null)).toBeCloseTo(0.12);
  });
  test("R9 y R6: contra el cupón ENVIO10 (10 %) gana el empresarial (12 %)", () => {
    expect(mayorDescuento("empresarial", "ENVIO10")).toBeCloseTo(0.12);
  });
  test.each([
    ["empresarial", 10, false], ["empresarial", 10.01, true], ["empresarial", 40, true], ["empresarial", 4, false],
    ["normal", 12, false], ["frecuente", 12, false], ["vip", 40, false],
  ])("R10: exentoDeRecargoDeZona(%p, %p) = %p (L2 = " + CONFIG.L2 + ")", (cliente, peso, esperado) => {
    expect(exentoDeRecargoDeZona(cliente, peso)).toBe(esperado);
  });
});
