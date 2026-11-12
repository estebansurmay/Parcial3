# Changelog

Todos los cambios notables de **EnvíaYa · cálculo del costo de envío** se documentan en este archivo.

El formato sigue [Keep a Changelog 1.1.0](https://keepachangelog.com/es-ES/1.1.0/) y el proyecto usa [Versionado Semántico](https://semver.org/lang/es/).

## [Unreleased]

## [2.0.0] - 2026-11-11

Versión **mayor** porque cambia la interfaz pública de `calc` (se elimina el argumento `flag`) y porque entradas que antes se aceptaban (zona o día inválidos) ahora lanzan error. Incluye la corrección de los 7 defectos conocidos de la v1.0.0 y la refactorización con patrón Estrategia.

### Added
- Patrón Estrategia para el recargo por zona: `EstrategiaZona`, `ZonaUrbana`, `ZonaConRecargo`, `ZonaRural` y `ZonaNacional` en `zonas.js`.
- Validación de la zona: una zona distinta de urbana, rural o nacional lanza el error `zona inválida` (R2).
- Validación del día: un día fuera de 1 a 7 lanza el error `día inválido` (R2).
- Funciones con nombre exportadas desde `envios.js`: `validarPeso`, `validarDia`, `tarifaBase`, `esFinDeSemana`, `mayorDescuento`, `aplicarMinimo` y `redondearACentena`.
- Suite automatizada con Jest: 88 pruebas de regresión (caja negra, caja blanca y criterios de aceptación) y 35 pruebas unitarias de las piezas nuevas.
- Diagrama de clases UML del patrón Estrategia y capturas de la ejecución en `docs/`.

### Changed
- **Cambio incompatible:** la firma pasa de `calc(p, z, c, d, cup = null, flag = false)` a `calc(peso, zona, cliente, dia, cupon = null)`.
- Se reemplazaron los números mágicos por constantes con nombre y se dividió `calc` en funciones pequeñas (complejidad ciclomática de `calc`: de 15 a 1).
- Los descuentos de cliente y de cupón se consultan en tablas (`Map`) y no en cadenas de condicionales.
- El cálculo conserva el orden de la especificación: validar, tarifa base, zona, fin de semana, descuento, mínimo y redondeo.

### Removed
- **Cambio incompatible:** el argumento `flag` y el `console.log("costo:", …)` asociado.

### Fixed
- DEF-01: el límite de peso es 40 kg (PMAX) y no 50 kg (R1).
- DEF-02: el mensaje de error de peso es `peso inválido`, con tilde (R1).
- DEF-03: una zona desconocida ya no se cobra como urbana; lanza error (R2).
- DEF-04: ya no se aceptan los días 0 ni 8 (R2).
- DEF-05: el recargo de fin de semana se cobra el sábado y el domingo, y no solo el domingo (R5).
- DEF-06: se aplica solo el mayor entre el descuento de cliente y el cupón, y no ambos acumulados (R6).
- DEF-07: el costo se redondea al múltiplo de $100 más cercano (los $50 suben) y ya no se trunca (R8).

## [1.0.0] - 2026-11-11

Código heredado de EnvíaYa, tal como se recibió.

### Added
- Función `calc(p, z, c, d, cup, flag)` en `envios.js` con el cálculo del costo de envío por peso, zona, tipo de cliente, día y cupón, con `CONFIG` completado según los parámetros del estudiante.
- Conocía 7 defectos (DEF-01 a DEF-07), registrados en la Parte 5 y corregidos en la 2.0.0.

[Unreleased]: https://github.com/estebansurmay/Parcial3/compare/v2.0.0...HEAD
[2.0.0]: https://github.com/estebansurmay/Parcial3/compare/v1.0.0...v2.0.0
[1.0.0]: https://github.com/estebansurmay/Parcial3/releases/tag/v1.0.0
