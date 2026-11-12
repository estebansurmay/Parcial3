// Suite automatizada de EnvíaYa: ejecuta los casos de las Partes 1, 3 y 4 contra envios.js.
// Los resultados esperados vienen de la especificación R1-R8 (calculados a mano), no del código.
const { calc } = require("../envios.js");
const negra = require("./casos_caja_negra.json").casos;
const blanca = require("./caminos_caja_blanca.json").caminos;
const aceptacion = require("./criterios_aceptacion.json").criterios;

const pesos = (n) => "$" + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
const resumen = (e) =>
  `p=${e.peso} ${e.zona} ${e.cliente} d${e.dia} ${e.cupon ?? "sin cupón"}${e.flag ? " flag" : ""}`;

function ejecutar(c) {
  const e = c.entradas;
  return () => calc(e.peso, e.zona, e.cliente, e.dia, e.cupon ?? null, e.flag ?? false);
}

function verificar(c) {
  const f = ejecutar(c);
  if (c.esperado === null) {
    expect(f).toThrow();
  } else {
    expect(f()).toBe(c.esperado);
  }
}

const titulo = (c) =>
  `${c.id} [${c.requisitos.join(",") || "—"}] ${resumen(c.entradas)} → ${c.esperado === null ? "error" : pesos(c.esperado)}`;

beforeEach(() => {
  jest.spyOn(console, "log").mockImplementation(() => {}); // permite comprobar que calc no imprime
});
afterEach(() => jest.restoreAllMocks());

describe("Caja negra (Parte 3)", () => {
  test.each(negra.map((c) => [titulo(c), c]))("%s", (_t, c) => verificar(c));
});

describe("Caja blanca: caminos independientes (Parte 4)", () => {
  test.each(blanca.map((c) => [titulo(c), c]))("%s", (_t, c) => verificar(c));
});

describe("Aceptación: criterios de las historias (Parte 1)", () => {
  test.each(aceptacion.map((c) => [titulo(c), c]))("%s", (_t, c) => verificar(c));
});

describe("Mensajes de error (R1)", () => {
  test("R1: el error de peso inválido dice “peso inválido”", () => {
    expect(() => calc(0, "urbana", "normal", 3)).toThrow("peso inválido");
  });
  // Reemplaza a la prueba del argumento flag (Parte 6): la interfaz ya no lo tiene y calc no imprime.
  test("interfaz v2: calc recibe 5 parámetros y no imprime nada, aunque se le pase un sexto", () => {
    expect(calc.length).toBe(4); // peso, zona, cliente, dia (cupon tiene valor por defecto)
    calc(4, "urbana", "normal", 3, null, true);
    expect(console.log).not.toHaveBeenCalled();
  });
});
