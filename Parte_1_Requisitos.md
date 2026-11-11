# Parcial 3 · Ingeniería de Software I (273365) — EnvíaYa

**Universidad de La Guajira · Facultad de Ingenierías · Ingeniería de Sistemas**
Grupo B1 · VI semestre · Periodo 2026-2 · Docente: Ing. Robert Damián Quintero Laverde

**Estudiante:** ______________________________
**Código estudiantil:** ______________________ (últimos 6 dígitos: 2 2 0 0 6 8)

## Mis parámetros

| A | B | C | D | E | F | PMAX | L1 | L2 | RR | RN | V | S | CAMBIO |
|---|---|---|---|---|---|------|----|----|----|----|---|---|--------|
| 2 | 2 | 0 | 0 | 6 | 8 | 40 kg | 4 kg | 10 kg | 20 % | 50 % | 20 % | $2.000 | 1 |

Reglas por paridad: **D = 0 (par)** → tramo 1 incluye el límite (peso ≤ 4) · **E = 6 (par)** → recargo de fin de semana *antes* de los descuentos · **B = 2 (par)** → solo se aplica el *mayor* entre descuento de cliente y cupón · **F = 8 (par)** → un cupón inexistente se *ignora*.
Cálculo detallado: ver `calculo.txt`.

---

# Parte 1 · Requisitos y criterios de aceptación

## 1.1 Especificación completa del cálculo del costo (R1–R8)

**Entradas:** `peso` (kg, admite decimales), `zona` (urbana | rural | nacional), `cliente` (normal | frecuente | vip), `dia` (1 a 7; 6 = sábado, 7 = domingo) y `cupon` (opcional).
**Salida:** costo del envío en pesos, múltiplo de $100.

| ID | Requisito (con mis valores) |
|----|-----------------------------|
| **R1** | El peso debe cumplir **0 < peso ≤ 40 kg**. Si no, se lanza el error **"peso inválido"**. |
| **R2** | Si la zona no es una de las tres válidas (urbana, rural, nacional), o el día no está entre 1 y 7, se lanza un error. |
| **R3** | **Tarifa base.** Tramo 1: **peso ≤ 4 kg** (el límite está incluido, por D par) → **$6.000**. Tramo 2: **4 kg < peso ≤ 10 kg** → **$9.000**. Más de 10 kg: **$9.000 + $800 por cada kg sobre 10**, de forma proporcional (admite decimales). |
| **R4** | **Recargo por zona.** Rural: **+20 %** de la tarifa base. Nacional: **+50 %**. Urbana: sin recargo. |
| **R5** | **Fin de semana** (sábado = 6 y domingo = 7): **+$2.000**, que se suma **antes** de los descuentos (E par), es decir, sobre el valor ya con recargo de zona. |
| **R6** | **Descuentos.** Cliente frecuente: **5 %**. Cliente VIP: **20 %**. Cupón `ENVIO10`: **10 %**. Si el envío tiene descuento de cliente y cupón, se aplica **solo el mayor** de los dos (B par), nunca ambos. |
| **R7** | Un **cupón que no existe se ignora** (F par): el envío se cobra como si no hubiera cupón, sin error. |
| **R8** | El costo **nunca es menor que $5.000**. El resultado se **redondea al múltiplo de $100 más cercano**; los $50 redondean hacia arriba. |

### Orden de cálculo derivado de la especificación

1. Validar entradas (R1, R2).
2. Tarifa base según el peso (R3).
3. Aplicar recargo de zona (R4).
4. Sumar recargo de fin de semana si el día es 6 o 7 (R5).
5. Aplicar el mayor entre el descuento del cliente y el del cupón (R6, R7).
6. Aplicar el mínimo de $5.000 y redondear a $100 (R8).

### Ejemplo calculado a mano con mis parámetros

Entradas: peso = 4 kg · zona = rural · cliente = vip · día = 6 (sábado) · cupón = ENVIO10

- Tramo: D = 0 es par, el tramo 1 es peso ≤ 4. Como 4 ≤ 4, va al tramo 1 → **$6.000**.
- Zona rural +20 % → 6.000 × 1,20 = **$7.200**.
- Sábado, y E = 6 es par: el recargo va antes de los descuentos → 7.200 + 2.000 = **$9.200**.
- B = 2 es par: solo el mayor descuento. VIP 20 % contra cupón 10 % → 9.200 × 0,80 = **$7.360**.
- Es mayor que $5.000. Se redondea a $100 → **resultado esperado: $7.400**.

---

## 1.2 Historias de usuario con criterios de aceptación

Las 3 historias cubren R1 a R8. Todos los resultados esperados de los criterios están calculados a mano con mis parámetros.

### HU-01 · Validación de los datos del envío (cubre R1, R2)

> **Como** operador de EnvíaYa, **quiero** que el sistema rechace envíos con peso, zona o día inválidos, **para** no cobrar ni despachar paquetes que la empresa no puede transportar.

| Criterio | Dado | Cuando | Entonces |
|----------|------|--------|----------|
| **CA-01.1** | un envío con peso = 0 kg o peso negativo (−1 kg) | se calcula el costo | se lanza el error "peso inválido". |
| **CA-01.2** | un envío con peso = 40,01 kg (supera PMAX = 40) | se calcula el costo | se lanza el error "peso inválido". |
| **CA-01.3** | un envío urbano, cliente normal, día 3, con peso = 40 kg (límite superior) | se calcula el costo | se acepta y el costo es **$33.000** (9.000 + 30 × 800). |
| **CA-01.4** | un envío con zona "aérea" (no es urbana, rural ni nacional) | se calcula el costo | se lanza un error de zona inválida. |
| **CA-01.5** | un envío con día = 0 o día = 8 | se calcula el costo | se lanza un error de día inválido. |

### HU-02 · Tarifa base, recargo de zona y recargo de fin de semana (cubre R3, R4, R5)

> **Como** cliente de EnvíaYa, **quiero** que el costo dependa del peso, de la zona de destino y de si se envía en fin de semana, **para** conocer de antemano cuánto pagaré según las condiciones de mi envío.

| Criterio | Dado | Cuando | Entonces |
|----------|------|--------|----------|
| **CA-02.1** | un envío urbano, cliente normal, día 3, con peso = 4 kg (límite del tramo 1) | se calcula el costo | se cobra el tramo 1: **$6.000**. |
| **CA-02.2** | el mismo envío con peso = 4,1 kg | se calcula el costo | se cobra el tramo 2: **$9.000**. |
| **CA-02.3** | un envío urbano, cliente normal, día 3, con peso = 10 kg, y otro con peso = 12 kg | se calcula el costo | el de 10 kg cuesta **$9.000** y el de 12 kg cuesta **$10.600** (9.000 + 2 × 800). |
| **CA-02.4** | un envío de 10,5 kg, urbano, cliente normal, día 3 | se calcula el costo | el costo es **$9.400** (9.000 + 0,5 × 800, proporcional). |
| **CA-02.5** | un envío de 4 kg, cliente normal, día 3, a zona rural, y otro a zona nacional | se calcula el costo | rural cuesta **$7.200** (6.000 × 1,20) y nacional cuesta **$9.000** (6.000 × 1,50). |
| **CA-02.6** | un envío urbano de 4 kg, cliente normal, en sábado (día 6) y otro en domingo (día 7) | se calcula el costo | ambos cuestan **$8.000** (6.000 + 2.000). |
| **CA-02.7** | un envío rural de 4 kg, cliente normal, en sábado | se calcula el costo | el costo es **$9.200** (6.000 × 1,20 = 7.200, luego + 2.000). |
| **CA-02.8** | un envío urbano de 4 kg, cliente normal, en día de semana (día 3) | se calcula el costo | no se cobra recargo de fin de semana: **$6.000**. |

### HU-03 · Descuentos, cupones, costo mínimo y redondeo (cubre R6, R7, R8)

> **Como** cliente de EnvíaYa, **quiero** que se me aplique el mejor descuento al que tengo derecho y que el valor final sea claro y redondeado, **para** pagar un precio justo y fácil de entender.

| Criterio | Dado | Cuando | Entonces |
|----------|------|--------|----------|
| **CA-03.1** | un envío urbano de 4 kg, día 3, cliente **frecuente**, sin cupón | se calcula el costo | se aplica 5 %: 6.000 × 0,95 = **$5.700**. |
| **CA-03.2** | un envío urbano de 10 kg, día 3, cliente **VIP**, sin cupón | se calcula el costo | se aplica 20 %: 9.000 × 0,80 = **$7.200**. |
| **CA-03.3** | un envío urbano de 10 kg, día 3, cliente normal, cupón `ENVIO10` | se calcula el costo | se aplica 10 %: 9.000 × 0,90 = **$8.100**. |
| **CA-03.4** | un envío urbano de 10 kg, día 3, cliente **VIP** y cupón `ENVIO10` | se calcula el costo | solo se aplica el mayor (VIP 20 %): **$7.200**, no $6.480. |
| **CA-03.5** | un envío urbano de 10 kg, día 3, cliente **frecuente** y cupón `ENVIO10` | se calcula el costo | solo se aplica el mayor (cupón 10 % > 5 %): **$8.100**, no $7.695. |
| **CA-03.6** | un envío urbano de 10 kg, día 3, cliente normal, cupón `PROMO50` (no existe) | se calcula el costo | el cupón se ignora, sin error: **$9.000**. |
| **CA-03.7** | un envío urbano de 4 kg, día 3, cliente VIP (4 kg → 6.000 × 0,80 = 4.800) | se calcula el costo | el costo no baja del mínimo: **$5.000**. |
| **CA-03.8** | un envío urbano de 10 kg, día 3, cliente frecuente (9.000 × 0,95 = 8.550) | se calcula el costo | el valor termina en $50 y redondea hacia arriba: **$8.600**. |
| **CA-03.9** | un envío de 10,5 kg, zona nacional, cliente frecuente, domingo (9.400 × 1,50 = 14.100; + 2.000 = 16.100; × 0,95 = 15.295) | se calcula el costo | se redondea al múltiplo de $100 más cercano: **$15.300**. |
| **CA-03.10** | el envío del ejemplo de la sección 1.1 (4 kg, rural, VIP, sábado, `ENVIO10`) | se calcula el costo | el costo es **$7.400**. |

---

## 1.3 Matriz de trazabilidad (requisito → historia → casos de prueba)

La columna de casos de prueba se irá completando en las partes siguientes (matriz de casos en la Parte 3, caja blanca en la Parte 4 y automatización en la Parte 5). Mientras tanto, queda enlazada con los criterios de aceptación, que son la base para diseñar esos casos.

| Requisito | Descripción corta | Historia | Criterios de aceptación | Casos de prueba | Estado |
|-----------|-------------------|----------|-------------------------|-----------------|--------|
| **R1** | 0 < peso ≤ 40, si no "peso inválido" | HU-01 | CA-01.1, CA-01.2, CA-01.3 | _por completar (Parte 3)_ | Pendiente |
| **R2** | Zona y día válidos | HU-01 | CA-01.4, CA-01.5 | _por completar (Parte 3)_ | Pendiente |
| **R3** | Tarifa base por tramos | HU-02 | CA-02.1, CA-02.2, CA-02.3, CA-02.4 | _por completar (Parte 3)_ | Pendiente |
| **R4** | Recargo por zona (20 % / 50 %) | HU-02 | CA-02.5, CA-02.7 | _por completar (Parte 3)_ | Pendiente |
| **R5** | Recargo fin de semana ($2.000, antes de descuentos) | HU-02 | CA-02.6, CA-02.7, CA-02.8, CA-03.9 | _por completar (Parte 3)_ | Pendiente |
| **R6** | Descuento cliente / cupón, solo el mayor | HU-03 | CA-03.1 a CA-03.5, CA-03.10 | _por completar (Parte 3)_ | Pendiente |
| **R7** | Cupón inexistente se ignora | HU-03 | CA-03.6 | _por completar (Parte 3)_ | Pendiente |
| **R8** | Mínimo $5.000 y redondeo a $100 | HU-03 | CA-03.7, CA-03.8, CA-03.9 | _por completar (Parte 3)_ | Pendiente |

### Cobertura inversa (historia → requisitos)

| Historia | Requisitos que cubre |
|----------|----------------------|
| HU-01 | R1, R2 |
| HU-02 | R3, R4, R5 |
| HU-03 | R6, R7, R8 |

Todos los requisitos R1–R8 están cubiertos por al menos una historia y un criterio de aceptación.
