// Pruebas unitarias de las piezas nuevas de la refactorización (Parte 6):
// estrategias de zona y funciones extraídas. Complementan la suite de regresión.
const {
  validarPeso, validarDia, tarifaBase, esFinDeSemana, mayorDescuento, aplicarMinimo, redondearACentena,
} = require("../envios.js");
const { EstrategiaZona, ZonaUrbana, ZonaConRecargo, ZonaRural, ZonaNacional } = require("../zonas.js");

describe("Estrategias de zona (R4)", () => {
  test("ZonaUrbana no cambia la tarifa", () => expect(new ZonaUrbana().aplicar(6000)).toBe(6000));
  test("ZonaRural suma 20 %", () => expect(new ZonaRural(0.2).aplicar(6000)).toBeCloseTo(7200));
  test("ZonaNacional suma 50 %", () => expect(new ZonaNacional(0.5).aplicar(6000)).toBeCloseTo(9000));
  test("ZonaRural y ZonaNacional son ZonaConRecargo y EstrategiaZona (polimorfismo)", () => {
    for (const z of [new ZonaRural(0.2), new ZonaNacional(0.5)]) {
      expect(z).toBeInstanceOf(ZonaConRecargo);
      expect(z).toBeInstanceOf(EstrategiaZona);
    }
  });
  test("la clase abstracta obliga a implementar aplicar()", () => {
    expect(() => new EstrategiaZona().aplicar(1)).toThrow("debe implementarse");
  });
});

describe("Funciones extraídas", () => {
  test("validarPeso: 0 y 40,01 fallan; 40 y 0,1 pasan", () => {
    expect(() => validarPeso(0)).toThrow("peso inválido");
    expect(() => validarPeso(40.01)).toThrow("peso inválido");
    expect(() => validarPeso(40)).not.toThrow();
    expect(() => validarPeso(0.1)).not.toThrow();
  });
  test("validarDia: 0 y 8 fallan (DEF-04); 1 y 7 pasan", () => {
    expect(() => validarDia(0)).toThrow("día inválido");
    expect(() => validarDia(8)).toThrow("día inválido");
    expect(() => validarDia(1)).not.toThrow();
    expect(() => validarDia(7)).not.toThrow();
  });
  test("zona desconocida lanza 'zona inválida' (DEF-03), también con nombres heredados de Object", () => {
    const { calc } = require("../envios.js");
    expect(() => calc(4, "aerea", "normal", 3)).toThrow("zona inválida");
    expect(() => calc(4, "constructor", "normal", 3)).toThrow("zona inválida");
  });
  test.each([[4, 6000], [4.1, 9000], [10, 9000], [10.5, 9400], [12, 10600], [40, 33000]])(
    "tarifaBase(%p) = %p", (peso, esperado) => expect(tarifaBase(peso)).toBeCloseTo(esperado),
  );
  test.each([[1, false], [5, false], [6, true], [7, true]])("esFinDeSemana(%p) = %p", (d, r) =>
    expect(esFinDeSemana(d)).toBe(r),
  );
  test.each([
    ["normal", null, 0], ["frecuente", null, 0.05], ["vip", null, 0.2], ["normal", "ENVIO10", 0.1],
    ["vip", "ENVIO10", 0.2], ["frecuente", "ENVIO10", 0.1], ["normal", "PROMO50", 0], ["vip", "PROMO50", 0.2],
  ])("mayorDescuento(%p, %p) = %p", (c, cup, r) => expect(mayorDescuento(c, cup)).toBeCloseTo(r));
  test("aplicarMinimo sube a 5.000 y no toca valores mayores", () => {
    expect(aplicarMinimo(4800)).toBe(5000);
    expect(aplicarMinimo(5000)).toBe(5000);
    expect(aplicarMinimo(9200)).toBe(9200);
  });
  test.each([[8550, 8600], [8549, 8500], [8551, 8600], [15295, 15300], [7360, 7400], [5000, 5000], [8550.0000001, 8600]])(
    "redondearACentena(%p) = %p (DEF-07: al más cercano, 50 sube)", (v, r) => expect(redondearACentena(v)).toBe(r),
  );
  test("redondearACentena tolera el error de coma flotante (8549,99999999 cuenta como 8550)", () => {
    expect(redondearACentena(8550 - 1e-10)).toBe(8600);
  });
});
